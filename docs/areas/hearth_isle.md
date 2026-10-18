# Hearth Isle: step XII of the road, the temple over the core

The twelfth and last step of the road of levels (DESIGN §9, EXPANSION §2.2), band 28–32, and the
whole of Act V, The Hearth: a rocky rim round a green bowl in the middle of the inland sea, the
column of light standing up out of the bowl into the roof of the sky, a temple built round its foot
by people who thought it a god and under the temple the world going down, through the hull's service
ways to the heart of the Hearth. The Hand holds the temple; its dead lie on the stairs below; Vask
is at the panel with the Queen's ring on his finger and Wenna's palm held to the glass. When the
Hand is broken the voice speaks with one voice, Wenna puts the ring in the company's hand and the
company chooses. This is its area doc (EXPANSION §4, §6 and §8.2): where the atlas puts it, what the
atlas and the docs put in it, the plan for building it, box by box and level by level, the briefs
with every line the isle says, the chapter and its ending, the side quests and the subplots' ends.
Its work is filed under Phase 1.5 (#742, with the systems in #743 and the area in #744): the doc
(this file), the boxes as §4's table has them, the temple and its crypt, the Ways and the Stair, the
Heart, its chapter (§5), its side quests and the Cleric's third (§6), its drawings, its rooms, the
Council (§6) and the endings (§5, §9). Figures are measured on main at `e3e9833` (12 October 2026),
and checked again at `8cdf1e0a` (13 October 2026) in review (§9.1), with `tools/scaffold.ts`, which
cuts the atlas's terrain for a box (EXPANSION §8.2): land is what is not sea or shallow, and
"walkable" what is not rock.

Seven places are built: H6, the isle (#753, §4.2), which lists the area; I6, the east rim (#754,
§4.3); Hearthfane, the temple (#755, §4.4); the crypt under it (#756, §4.5); the Ways below the
crypt (#757, §4.6); the Stair below the Ways (#758, §4.7); and the Heart below the Stair (#759,
§4.8). The isle is built to the Heart and its chapter is written (#760, §5), and the road behind is
built (#765, §12): Helmstow and its halls, Gullwick, Ashfall, the Kilns and Sunderwood, with its business
kept reachable (#795).
What exists: the isle's map, `hearthisle_h6`, which places four of the roster's monsters, opens the
pilgrims' camp's three rooms and gives onto the temple (§3); the rim's map, `hearthisle_i6`, which
places three of those four; the temple's map, `hearthfane`, which places three of those four and
gives down onto the crypt; the crypt's map, `hearthfane2`, which places two of the four and the
first keeper and gives down onto the Ways; the Ways' map, `underdeep`, which places one of the four,
the keeper, Ashfall's deep knocker and the first crawlers; the Stair's map, `underdeep2`, which
places the rearguard and the Catcher with the Ways' rats, keepers, knockers and crawlers again, and
has the last door at its foot, shut until the road's five hold; the Heart's map, `core`, behind that
door, which places Vask and the Grey Hands and calls the sentries: the round room under the glass
roof, Vask at the panel on the clock, the voice, Wenna with her three answers and the ring; the
atlas's rows (`src/content/atlas.ts`: the area `hearth` at 28–32, the last crossing's sea link from
Cinderport landing at 252,188 and the deep links on from the isle;
`src/content/areas/hearth/atlas.ts`, the area's own since H6: the zone `hearthisle`, with I6 laid in
it; the places `hearthfane` at 250,172, `hearthfane2` at 250,178, `underdeep` at 216,168,
`underdeep2` at 216,172 and `core` at 216,176 (built); the sites The Hearth at 256,174 and
Anchorhold at 268,176 (both built)); the last crossing itself, sold at Cinderport's quay since #547,
whose isle end lands on H6's strand since #753 (`LAST_CROSSING`, `src/content/crossings.ts`);
MONSTERS §9's roster (§7 fields it with one more, the Ashen Rearguard: twelve monsters, one new
family); the Cleric's third prestige at Anchorhold, built (#19, #763): the anchoress at her window, her
hand-in of the keeper's log, the lamps in the crypt and the log; and #56's 56 to 61 and 64, Act V's side
quests, drafted, with 56 built in the temple, 60 and 61 built in the Ways, 57 begun on the isle and
ended on the Stair, 59 begun in the Ways and ended on the Stair, 58 begun on the Stair and 64 begun
at the Heart (§6); and the chapter, The Heart (#760, §5), the one quest's twelfth and last, walked to
each of its three ends and once early. In the east rim's rock, behind a second secret door, a cell
holds two finds off the ladder, a lightning mace in the area's first locked chest and a robe that
raises personality (#864, §4.9).
Its content is
`src/content/areas/hearth/` (maps, monsters, items, climate, its part of the world map and its
walkthrough; its side quests and the Cleric's third in `quests.ts`, as far as built; its chapter,
The Heart, in `chapter.ts`) and its businesses' rooms `src/ui/interiors/hearth/`, drawn ahead of
it (#762). Its ids, the plan's: the area `hearth`, its zone `hearthisle`, the boxes `hearthisle_h6`
and `hearthisle_i6`, the temple `hearthfane` and its crypt `hearthfane2`, the Underdeep's two levels
`underdeep` and `underdeep2` and the Core `core`.

---

## 1. Where it is

The atlas (`src/content/atlas.ts`, stroke XII) makes Hearth Isle a rocky rim round a green bowl: a
hexagon of rock from 240,164 by 256,158 and 272,164 to 272,180, 256,186 and 240,180, and inside it
grass, the polygon 248,168, 262,166, 266,176, 254,180 and 246,176. One zone, `hearthisle`, seeded at
256,172, and one area, `hearth`.

| Zone | Band | Squares | Boxes |
|---|---|---|---|
| Hearth Isle | 28–29 | 1,027 land, 757 of them in H6 and 270 in I6; the shallows apart (76 in H6, 77 in I6) | H6 (built), I6 (built) |
| The area | 28–32 (§9, call 2) | the isle, and the temple, the Ways, the Stair and the Heart below it | |

The bands, once and plainly: the area is 28–32, to the cap. The isle's zone, its two boxes and the
temple are 28–29; below them the crypt is 29, the Ways 30, the Stair 30–31 and the Heart 32 (§9,
call 2). The atlas's area row says the same, and so does the curve's (#745, §8).

**The grid** (EXPANSION §8.2; docs/areas/shelf.md §1). The isle lies in two boxes. H6, at 232,158,
holds its body: the scaffold cuts it to 757 squares of land (rock 386, grass 266, hills 84, sand
21), shallow 76 and sea 191, and gives 727 of its squares to the isle's zone and 106 of the rim's to
Thornmark's Deepthorn, whose seed the atlas's walk finds nearer across the Wyke; a laid map takes
its zone (docs/areas/ashfall.md §1), so the box's rows settle it. I6, at 264,158, holds the east
rim, eight columns of rock and grass and the sand at their foot, 270 land squares (rock 155, grass
77, sand 35, hills 3), 77 of shallow and 677 of sea, 189 of the rest given to the Deepthorn by the
same walk. Its north edge faces Thornmark's `deepthorn_i5` on 32 squares: I6's row 0 is grass and
hills on its first three columns, where I5's row 31 is rock, and shallow and sea beyond on both
sides, so no way opens between them; the edge is pinned against I5's rock in
`tools/tests/outdoors.ts`, as K4's is against the Deepthorn. The Hearth stands at H6's 24,16; the
way down into the Underdeep, the temple's door, at H6's 18,14 (the atlas's deep link at 250,172);
the last crossing grounds at H6's 20,30 (252,188), on the south shore; Anchorhold stands at I6's
4,18 (268,176). Nothing of the isle is cut: its 1,027 land squares are about one zone map's worth
(EXPANSION §1's unit, a 32×32 map of 1,024 squares), and both boxes are built, H6 first. The
atlas's outline runs on past H6's north edge into the H5 box, which is unlaid (some 57 squares of
land and shore at y 154 to 157, zoned the Deepthorn's), and H6's row 0 is cut to the world there
and pinned (§4.2). The squares above are the scaffold's, before any box; H6 (#753) is laid whole,
and §4.2 has its counts as built.

Its edges:

- **South: the Sound.** The last crossing comes over from Cinderport (via 228,236) to the strand on
  the south shore, a boat open from the start for the fare (EXPANSION §2.2; #547): 350 gold, a day,
  landing rested. Nothing else lands on the isle but the Hand.
- **East and south-east: the Hand's causeway.** The road of cut stone from Sheer Point (286,230;
  docs/areas/whitespine.md §4.7) reaches the isle's south-east rim, where I6's sand lies under the
  rock: the Hand's Steps (§4.3). The causeway is a line on the water from the isle as it is from the
  Saltings and the Tide Ship's deck (#449); the company never walks it. At its root on the isle a
  grey door in the rock opened for Wenna's hand and opens for nobody else: an event, not an exit, and
  no lock (§9, call 3).
- **North: the Wyke and Thornmark's shore.** No way crosses it. H6's north edge is cut to the
  world, the H5 box above it being unlaid, and I6's meets I5's rock and water, pinned so (above).
- **West: the Sound,** and far off, Cinderport under its mountain.

Below the isle, on the atlas, the Underdeep at 216,168 and the Core at 216,176: plates for the
world map, which the grid does not read. The deep link from the isle lands in the temple, and the
temple's crypt goes on down.

`node tools/worldmap.ts out.png --zones` paints it. `node tools/scaffold.ts hearthisle 232 158`
and `node tools/scaffold.ts hearthisle 264 158` cut the two drafts.

## 2. What it is for

The last act of the one quest (DESIGN §9): *what do we do?* Every act before it asked a question
and ended on an answer; this one ends on the company's. The isle is the Hearth up close, no fire
but a column of light that hums in the teeth as the shard under Ashcombe did at the very start,
and a temple built round it by people who thought it a god. The Hand holds the temple, its best in
front, and the way down is the Hand's own: Wenna's knot on every frame, all the way down, and the
Hand's dead on the stairs where what lives below caught them. At the bottom are two doors: the
Hand's own, which opened for her palm and is shut behind them, and the Stones', which the Hand
could not open, with its creed cut across it. That one does not wait for anyone's palm. It opens
as the company comes near, because the company made the Stones whole, and the heart opens for
whoever makes it whole. Through it, people: Vask halfway
through putting out the light and the grey-handed men holding Wenna's palm to the glass. Then the
last fight, on a clock. When it is over the Custodian speaks, for the first time with one voice, and
says what DESIGN §9 says and nothing more. Wenna takes the ring off Vask's finger and puts it in
the company's hand: *You walked every road of it. You choose.*

Three endings, a clean three-way choice (DESIGN §9): reignite, arrive or, for a company that holds
Fane's map, make it finish. Nothing else on the road changes what is offered. The throne decides
who stands with the company at the core (DESIGN §10.1): the Council's verdict (§6) puts the winning
claimant's people on the Stair's first landing, and Tallis's man at the Heart's door to hinder when
the claimant is his; where no claimant's verdict carried, the pilgrims' token (57) decides the
same. A Partner of the Compact has its runner at that door too. The throne, the Compact and the
Lost Expedition all change what the world says after. In every ending the company walks Wenna home
to Gullwick in the spring, and her mother cries.

The weather is the light's: warm the year round, the Hearth's heat on the face, little fog and
never snow, thunder far off over the mainland.

## 3. What is built

The pilgrims' camp's three rooms, drawn ahead of the area (#762): `bowl_store` (the Pilgrims'
Store), `bowl_yard` (the Sergeant's Tent) and `bowl_lantern` (the Lantern's Tent), a scene to each
in `src/ui/interiors/hearth/`, listed in `src/content/areas/hearth/interiors.ts`, the Area's own
`interiors` since H6 lists the area (`ROOMS_AHEAD`, `src/content/index.ts`, merged them until then);
H6's three businesses open into them, so `UNPLACED` (`tools/tests/maps.ts`) owes them no more. The
monsters drawn ahead (#761) are the Area's own too (`AHEAD`, `src/content/index.ts`, listed them
until then): H6 places the moth, the champion, the preacher and the rat (the rim and the temple the
first three, the crypt the champion and the rat with the first keeper, the Ways the first crawlers, the
Stair the rearguard and the catcher, the Heart Vask and the Grey Hand with the sentry he calls), and
`UNPLACED` owes nothing now.

Seven places. The isle (#753) is the area's first and lists the area; the east rim (#754), the temple
(#755), the crypt (#756), the Ways (#757), the Stair (#758) and the Heart (#759) follow it:

- **The isle** (H6, `hearthisle_h6`, core, band 28–29; #753): the strand on the south shore where
  the last crossing grounds, its boatman in the stern; the cleft carved one square wide up through
  the rim, with the Hand's pickets in it and at its head; the Bowl, green and warm, with the
  pilgrims' camp in the lee of the rim, its three tents round a yard and the three pilgrims of 57;
  the temple's mound in the Bowl's north, its door in the south face giving onto Hearthfane
  (#755); the Hearth east of it, the column's foot; the cache under the north rim; the west
  shelf to the lookout. Seven groups: moths by night, the pickets, the preacher with champions
  before the temple's door, champions on the west shelf and rats in the Bowl's south-east (§4.2).
- **The east rim** (I6, `hearthisle_i6`, core, band 28–29; #754): the rim's path carved from the
  Bowl's east pocket through the rock to Anchorhold's yard, under the cell built into the rim and
  out to the east foot; the Hand's camp at the Steps, where the causeway lands, with its crates,
  its tally-house and its chest; the grey door in the rock, read and never opened; behind the
  tally-house the secret door, the Hand's takings and the hoard; and in the rim's east face a
  second secret door, with a cell behind it that holds a lightning mace in a locked chest and a
  robe that raises personality (§4.9; #864). Six groups: champions in the
  pocket where the path begins, moths over the yard by night, the camp's guard and two champions at
  the stair's head; off the road, champions on the east foot and the Hand's watch over the Wyke
  (§4.3; #794).
- **The temple** (Hearthfane, `hearthfane`, dungeon 16×16, band 28–29; #755): in at its door in the
  mound on H6 (18,14), at the nave's foot; out by the door in its south wall. The nave runs north
  with a lamp in each corner and the moths about them; the vestry off its west, where the sacristan
  hides under the table (56); the treasury off its east, behind a door his key opens and nothing
  else; the court at its head, open to the column, with the Hand's best in it; the altar, with the
  stair down behind it to the crypt (#756). Nine groups: the moths, the nave's champions, the
  sermon, the court's second group, the swarm a wrong lamp brings and the garrison's rest, three
  more threes in the court and two beside the treasury's way (§4.4; #794).
- **The crypt** (`hearthfane2`, dungeon 16×16, band 29; #756): down the stair behind the altar, to
  its foot at 8,14; a passage north to a round chamber, its eleven niches told in `hf2_niches` and
  the champions at its mouth; the side vault off its west, where the Hand's dead lie and the rats
  come up for them; the chamber's north door and a short passage with a keeper in it and the Hand's
  last man beside it; the grey door at its head, with Wenna's knot on the frame, which gives down
  onto the Ways (#757). Six groups: the chamber's champions, the rats and the keeper's; since #794,
  what came up through the grey door, rats twice and four keepers (§4.5).
- **The Ways** (`underdeep`, dungeon 32×32, band 30; #757): in through the crypt's grey door, at the
  main way's foot, 16,30, with the way back up behind it; the main way north, one wide, to the
  Stair's head, and off it every four rows side ways east and west, each ending in a door with
  Wenna's knot on its frame (59), eight in all; the keepers' store behind the first west frame;
  behind the eighth a small room with the hatch in its wall onto a crawl way and its chest, and from
  the room a way on to the crack the Sunder made and the knocker that found it (61); west along
  the row-10 way, the CREW ONLY door from the inside (60). Twelve groups since #794: rats, keepers,
  knockers and, at the Stair's head, the first crawlers (§4.6). The Stair's head and the crawl way's door give onto
  the Stair (#758).
- **The Stair** (`underdeep2`, dungeon 32×32, band 30–31; #758): down from the Ways by the door at
  the main way's head, onto the stair's head, 16,30, with the way back up behind it; eight landings
  and the seven flights between them, two wide, down to the last landing and the last door at 16,1,
  which opens into the Heart on the road's five, with the Hand's own drawn in the wall beside it at
  13,1; the first landing held by the
  claimant's people and their captain or fought for with the rearguard (57); the Hand's dead on
  the flights below and Jowan's letter under a champion's hands (58); the last frame, which carries
  Wenna's name (59); the crawl way's door in the fourth landing's wall, with no way back up it; the
  Catcher on the last landing. Nine groups since #794: the rearguard, the rats, the crawlers (two
  groups), the keepers, the knockers (three groups) and the Catcher's (§4.7).
- **The Heart** (`core`, dungeon 16×16, band 32; #759): in through the Stair's last door onto 8,14,
  with the way back up behind it at 8,15; a passage three wide north into a round room under a glass
  roof, the panel in its north wall at 8,3 and eight empty alcoves round the wall; Vask at the panel
  with three of the Grey Hands holding Wenna's palm to the glass, on the clock that calls the core's
  sentries and dims the roof; then the voice at 8,4, Wenna at 7,4 with the ring and her three
  answers and Vask on his knees by the west wall at 3,9. Two groups, one of them fought: `core_vask`
  and the thinned `core_vask_thinned` the Council swaps in (§4.8).

The Cleric's third, The Eleven Kept (#763), is built on the rim and in the crypt: Hereswith at the
cell's window (I6, 4,19) with her hand-in, her three `says` and her teaching; the lamps at the
chamber's 8,7, which #756 built and the hand-in now lights; and the log `eleven_kept` in `quests.ts`
(§6).

Its atlas rows are charted in `src/content/areas/hearth/atlas.ts`, the area's own since H6 lists the
area; they moved there from the plan (`src/content/atlas.ts`), which keeps the area's row and the
links: the zone `hearthisle` with its crossing words; the places `hearthfane` (built, #755),
`hearthfane2` (built, #756), `underdeep` (built, #757), `underdeep2` (built, #758) and `core`
(built, #759); the sites The Hearth and Anchorhold (both built, #754). The last crossing's isle
end, owed to Phase 1.5 until H6, lands on the strand (`LAST_CROSSING`, `src/content/crossings.ts`),
so Cinderport's harbourmaster sells it. The curve's row (#745, §8) has left `PLANNED`, owed to #794
for what the isle, the rim, the temple, the crypt, the Ways, the Stair and the Heart pay, which falls
short of the area's budget (§8, §11). The chapter, The Heart (#760, §5), is the area's `chapter`
(`chapter.ts`), joined after the Wold's in `THE_QUEST`, the twelfth and last: begun on `q_road_east`
or on the isle, done on any of the three endings' flags and walked in the walkthrough to each of its
ends and once early; `tools/tests/quests.ts` owes neither it nor the zone's step now. The gear's last
rung, the Hand's steel at 28 (#746, §8), is on the ladder (`GEAR`, `tools/harness.ts`), every piece
placed by its box. The drafts the scaffold cuts are in §1. This doc is the plan; §4 has the briefs,
each with every line its place says, so that the box or level can be
built from it by a session that has read DESIGN, STORY and EXPANSION and nothing else. The owner's
calls are §9's.

## 4. What is still to build

| Map | Name | Kind | Band | Land | What is there | Its step | Issue |
|---|---|---|---|---|---|---|---|
| H6 | The isle | zone box, core | 28–29 | 757 (rock 386, grass 266, hills 84, sand 21) | the strand at 20,30; the cleft up through the rim; the Bowl and the pilgrims' camp; the Hearth at 24,16; Hearthfane's door at 18,14 | the isle; the temple | #753, built |
| I6 | The east rim | zone box, core | 28–29 | 270 (rock 155, grass 77, sand 35, hills 3) | Anchorhold at 4,18; the Hand's Steps at 3,27, where the causeway lands; the Hand's camp | none; the Cleric's third | #754, built |
| | Hearthfane | dungeon, 16×16 | 28–29 | | the nave and its four lamps; the court open to the column; the Hand's best; the sacristan in the vestry; the treasury; the stair behind the altar | the temple | #755, built |
| | The crypt | dungeon, 16×16 | 29 | | the eleven niches; the Hand's first dead; the knot on the frame; the grey door down | the knots | #756, built |
| | The Ways | dungeon, 32×32 | 30 | | the hull's service ways: clean, humming, lit from nowhere; keepers with no robe; rats; the knocker at the crack; the CREW ONLY door's other side; the frames she marked | the Ways | #757, built |
| | The Stair | dungeon, 32×32 | 30–31 | | the long stair down; the claimant's people at its head; the Hand's rearguard and its dead; the crawlers; the Catcher at the foot; the last door and the Hand's own beside it | the dead; the Catcher; the door | #758, built |
| | The Heart | dungeon, 16×16 | 32 | | the door with the creed; the panel; Vask, the Grey Hands and the sentries the ring calls; the voice; Wenna and the choice | the choice | #759, built |

The core is everything: no map here is country. Build order is the road's: H6 (built, #753; it lists
the area, moves the isle's rows into the area's own atlas slice and lands the last crossing, §7),
I6 (built, #754), the temple (built, #755), the crypt (built, #756), the Ways (built, #757), the
Stair (built, #758), the Heart (built, #759); the chapter and the walkthrough once the Heart is in
(written, #760);
the side quests with their maps; the Council and the endings with the Heart. The drawings (§7) land
before the maps that first place them, the crawlers' family before the Ways.

### 4.1 The briefs

Each brief below says what the map is for, its band, its landmarks with their squares, every
person, event and sign on it with its words as written, its secret and the hint on the near side,
its encounters, its finds and its share of the pay (§8), as EXPANSION §8.2 asks. The squares are
the drafts' (§1) for the two boxes and the plan's for the dungeons, which have no draft: a
builder lays the rooms round the landmarks and keeps the squares named here, since the chapter,
the side quests and the walkthrough key on them (§5, §6). Every square named on the two boxes is
walkable ground of fitting terrain in the drafts, checked square by square in review (§9.1), save
the few the builder carves out of the rim's rock, each said where it is named: the cleft (§4.2),
the rim's path and Anchorhold's yard (§4.3), the pockets behind the two secrets and the vigil cell's
three squares (§4.9). Where a square cannot be kept, the builder changes it in one sweep, here and
in the content.

The voice is the docs' (CLAUDE.md): terse, British, two lines of the log to an event and three the
most, which `tools/tests/pillars.ts` measures; a person's lines are shown as paragraphs and may run
longer, as Aldith's at Helmstow do. The secret is found and never told: no line below says what
the Hearth is, and the voice at the panel says what DESIGN §9 gives it and no more. Every quest
condition names something the save holds (a flag a person or an event sets, an item, a once-event
seen, a guardian slain, a map visited); `tools/tests/quests.ts` checks every key, and a flag no one
sets yet is owed to its issue in its `UNSET`.

Ids used across the briefs, exported from the maps that set them:

| Constant | Flag or id | Set by |
|---|---|---|
| `STRAND` | `hearthisle_h6:h6_strand` | the once-event at the boat's grounding (§4.2) |
| `TOKEN_COUSIN`, `TOKEN_HOLD`, `TOKEN_TALLIS` | `q_token_cousin`, `q_token_hold`, `q_token_tallis` | the pilgrims' answers (§4.2, §6) |
| `LAMPS_OUT`, `LAMPS_WRONG` | `q_lamps_out`, `q_lamps_wrong` | the nave's lamps (§4.4, §6) |
| `LOG_GIVEN`, `ELEVEN_KEPT` | `q_eleven_log`, `q_eleven_kept` | the anchoress's hand-in; the crypt's lamps (§4.3, §4.5, §6); both exported from the crypt (§9.2, #756's 6) |
| `KEPT_ASKED` | `q_eleven_asked` | the anchoress's ask, to a cleric of 27 with the second (§6); exported from I6 (§9.2, #763's 1) |
| `KNOT_LAST` | `underdeep2:ud2_word` | the last frame's word (§4.7, §6) |
| `CREW_OPEN`, `CREW_SHUT` | `q_crew_open`, `q_crew_shut` | the door's other side (§4.6, §6) |
| `CRACK_SEALED`, `CRACK_WIDE` | `q_crack_sealed`, `q_crack_wide` | the knocker at the wall (§4.6, §6) |
| `VASK_FALLEN` | `q_vask_fallen` | the Heart's fight, whichever of its two groups falls: both carry `sets: 'q_vask_fallen'` (§4.8) |
| `VOICE_WHOLE` | `q_voice_whole` | the voice at the panel, met (§4.8) |
| `RING_GIVEN` | `q_ring_given` | Wenna at the panel, met (§4.8) |
| `END_REIGNITE`, `END_ARRIVE`, `END_FINISH` | `q_end_reignite`, `q_end_arrive`, `q_end_finish` | Wenna's three answers (§4.8, §5) |
| `ENDED` | any of the three, as a `When` list | |
| `HELD` | any of `q_throne_cousin`, `q_throne_hold`, `q_throne_tallis`, `q_token_cousin`, `q_token_hold` and `q_token_tallis`, as a `When` list | the Council's verdict or the pilgrims' answers: whoever holds the Stair's first landing (§4.7, §6) |
| `WENNA_HOME` | `q_wenna_home` | Hild at Gullwick, after an ending (§5, the road behind) |
| `CASE_*`, `THRONE_*` | `q_case_cousin` and the rest; `q_throne_cousin`, `q_throne_hold`, `q_throne_tallis`, `q_throne_wenna`, `q_throne_council`, `q_case_failed` | the Council's clerk at the keep (§6) |
| `SIGNET` | the item `queens_signet` | Wenna's answers give it (§4.8); the gate and the sea take it (§6, 64) |

### 4.2 H6, the isle (core, band 28–29)

**Purpose.** The far side of the last crossing: the strand, the way up through the rim, the Bowl
with the stranded pilgrims, the Hearth itself and the temple's door. The one quest's first step
here and its second (§5). The side quest 57 (§6). The company rests, trains, buys and is raised
here, since the isle has no town (§9, call 4).

**The draft.** `node tools/scaffold.ts hearthisle 232 158 --id hearthisle_h6`: the sea down the
west and south-west, shallow and sand along it, the rim's rock in a ring from row 0 to row 29 and
the grass of the Bowl inside it from about 13,7 to 31,21, with a knot of hills at 15–23,7–14 in the
Bowl's north (the temple's mound, which holds its door at 18,14) and another at 20–26,18–23 to the
south. The Hearth itself stands on the Bowl's grass at 24,16, east of the mound. The south shore is
the strand: grass to the water on row 30 from 15 to 27 and on row 31 from 19 to 25, sand at its
east end (28–31,30 and 26–27,31), the rim's rock on row 29 from 19 to 27. A grass shelf runs up the
west coast outside the rim from the strand's west end (13–15,28) to 7,22, where shallow and rock end
it; the coast north of that and the north-west hills are not reached on foot, and nothing is placed
there. The box is cut to the world at its west, south and north edges: the H5 box above is unlaid
and the outdoors makes it void, so H6's row 0 is pinned as the world's end in
`tools/tests/outdoors.ts`.
Its east edge meets I6 square for square on rows 0 to 30, walkable on both sides only on rows 12 to
18 and 29 to 30 (on row 0 H6's 31,0 is rock since #753; rock on both sides on rows 1 to 11 and 21 to
28; on rows 19 and 20 H6's grass meets I6's rock), and is pinned so in `tools/tests/outdoors.ts`;
I6's rows take it as it is.

**Landmarks and points of interest.**

- **The strand** (15–27,30–31, the draft's grass to the water), where the boat grounds at 20,30 facing north: the last crossing's
  isle end (`LAST_CROSSING.ends[1].landing = { map: 'hearthisle_h6', x: 20, y: 30, facing: NORTH }`).
  The boat's man here sells the crossing back, so both ends sell it (`src/content/crossings.ts`):
  - `{ kind: 'npc', x: 21, y: 30, name: 'The boatman', lines: ['A man sits in the grounded boat's stern with the oars shipped, looking at the light and not at you.', '"I row over, I row back. I do not go up. Nobody who goes up has ever asked me to wait, and I wait anyway."'], passage: sells('hearthisle', LAST_CROSSING) }`.
  - The once-event at the grounding, `h6_strand` (20,29, the cleft's foot and the first step off
    the boat), `STRAND`: *Up close the Hearth is no fire. A column of light stands out of the isle
    into the roof of the sky, and it hums in your teeth.*
  - `h6_shard` (19,30, on the strand beside the boat), once: *The hum. It is the hum of the carved
    lump by the tear under Ashcombe, at the very beginning, and it has not stopped since.*
- **The cleft** (20,29 up to 20,22), the one way up through the rim from the strand, a path of
  dirt the pilgrims have worn. The draft's rim is rock from 20,24 to 20,29, so the builder carves
  the cleft there, one square wide, from the strand at 20,30 to the Bowl's hills at 20,23. Its
  mouth at 20,27: `h6_cleft`, once: *A path worn into the rim's
  rock, one person wide, by four hundred years of feet. Shoes stand at its foot in pairs, left for
  the walk up.* Its head at 20,22, the crossing into the Bowl: `h6_bowl`, once: *The Bowl: a
  green cup inside the rim, and the column standing out of its north end. The grass is warm.*
- **The pilgrims' camp** (14–18,15–19), the isle's rest (§9, call 4): a `camp` at 16,17, *The
  pilgrims' fires in the lee of the rim, banked low. Nobody here has slept since the Hand landed,
  and they make room without a word.*; a trader's tent, `{ kind: 'shop', x: 15, y: 16, name: 'The Pilgrims' Store', stock: ['rations', 'torch', 'lantern_oil', 'potion_heal', 'antidote', 'elixir', 'potion_sp', 'potion_sp_great', 'quickening'], interior: 'bowl_store' }`;
  a drill-sergeant's tent, `{ kind: 'trainer', x: 17, y: 16, name: 'The Sergeant's Tent', maxLevel: 32, interior: 'bowl_yard' }`
  (Sergeant Aelfric's, the Warden of the cousin's in 57, stranded with the rest, who trains from it:
  one man, not two; the ceiling is the cap, §9, call 4);
  and a Lantern's tent for the dead and the sick, `{ kind: 'temple', x: 16, y: 15, name: 'The Lantern's Tent', interior: 'bowl_lantern' }`.
- **The three pilgrims** (57, §6), in the camp: Aelfric at 14,17, Talwyn at 18,18 and Pasco at
  14,19; their words are in §6.
- **The pilgrims' shrine** at 18,16 (18,15 is `h6_front`'s, before the temple's door), a `shrine`, id `h6_shrine`, name *The pilgrims' shrine*,
  text *A cairn of offerings under a cloth: cups, knots of rope, a child's shoe. Whoever kneels here
  feels the hum settle in the chest.*, `stat: 'personality'`, `done: 'The cloth is where you left it. The hum is in you now.'`
- **The Hearth** at 24,16, on the Bowl's grass east of the temple's mound, a `sign` that is the
  column's foot: *The column of light. It stands out of the ground here as a tree stands, wider
  than the temple's door, and goes up until the sky stops it. Looking up at it hurts.* The squares
  round it are the draft's grass. Between the mound and the column, `h6_warm` (23,14), once: *The
  ground here is warm as a hearthstone, and no grass grows on it within ten paces of the light.*
  At the column's foot, `h6_sliver` (23,16), once, `after: { item: 'grove_sliver' }` (#56's 18,
  the Mender's sliver, `thornmark/items.ts`): *The sliver from the Grove hums in your pack, the way
  it did under the roots.*
- **Hearthfane's door** at 18,14, the temple's front, an exit: `{ x: 18, y: 14, to: 'hearthfane', tx: 8, ty: 14, tf: NORTH, label: 'Through the temple's door, into the nave. The light comes down through the roof ahead.' }`.
  Before it, `h6_front` (18,15), once: *A temple of the rim's own rock, built round the column's
  foot. Its door stands open, and the Hand's grey is on the men at it.* The temple's plate on the
  atlas at 250,172 (`PLACES`, below).
- **The west lookout** at 7,22, the head of the west shelf under the rim, `h6_lookout`, once:
  *The rim's west edge. Over the Sound, under its smoke, Cinderport, and the mountain over it. The
  whole road is behind you.*
- **The north rim** at 20,7, the mound's head under the rim's north face, `h6_north`, once: *The
  rim's highest rock. Cut into it, worn almost smooth, a mark like the one on the chisel from under
  the Grove. The first people stood here.*
- **The moths** (by night): `h6_moths` (22,19), once, `when: { hours: 'night' }`: *The sky over the
  Bowl is moving. Moths, more than the stars, drawn in to the biggest lamp there is.*
- **The secret:** a cache under the north rim at 26,6, behind a secret door in the rock at 26,7,
  its hint `h6_draught` (26,8, the Bowl's grass at the rim's foot), once: *A draught comes out of
  the rock here, warm, and smelling of oil.* Behind it, in a pocket the builder carves,
  `h6_cache` (26,6), once: *A hollow the size of a cupboard, and in it a lamp of grey metal that
  burns without oil, four hundred years lit.* and a chest `h6_lamp`: 400 gold and a pouch of three
  `smelling_salts` (§8).

**Crossing line.** The zone's `crossing` (atlas.ts): `harder: 'The isle, and the light's heat on your face. What keeps the temple is harder than anything on the far side.'`,
`warning: 'The isle. Nothing on it would spare you, and the boat is the only way back.'`

**Encounters.** The band's gentlest first, by the strand; the Hand's pickets up the cleft and in
the Bowl; the moths by night; nothing by the camp.

| Id | Where | Group | Notes |
|---|---|---|---|
| `h6_moths1` | 18,30 | 12 hearth moths | `when: night`, `respawn: 1440`; on the strand, the first thing a company meets at night |
| `h6_picket1` | 20,25 | 2 ashen champions | in the cleft (carved), `roams: false`, `respawn: 2880` |
| `h6_picket2` | 20,22 | 3 ashen champions | the cleft's head |
| `h6_moths2` | 26,12 | 12 hearth moths | `when: night`, the Bowl's north |
| `h6_sermon` | 19,13 | 1 ashen preacher, 2 ashen champions, `back: 1` | before the temple's door, the box's hardest, `roams: false` (the thinning for a removed Vask is the temple's and I6's, by the leave rule, §4.3, §4.4) |
| `h6_rim` | 9,24 | 2 ashen champions | the west shelf under the rim, the lookout's way, `roams: true` |
| `h6_rats` | 28,21 | 8 deep rats | the Bowl's south-east under the rim, come up from below; `respawn: 1440` |

**Finds.** The cache's salts and gold (above); a chest in the Hand's picket at the cleft's head,
`h6_picket_chest` (21,22): 300 gold, `grey_knife` (§8).

**Share of the pay.** About a tenth of the area's (§8).

**As built** (#753, 13 October): the brief's places and its seven groups, laid whole in the box at
232,158 (`hearthisle_h6`, region `hearth`, band 28–29), which lists the area. The land is rock 424,
grass 232, hills 63, sand 11, dirt 8 and building squares 7 (the tents' three, the temple's door and
the tents' three doors), with the secret door 1, shallow 87 and sea 191, where the draft had rock
386, grass 266, hills 84 and sand 21. The map starts at the boat's landing, 20,30 facing north,
where the last crossing's isle end lands (§9.2, #753's 9; the scaffold's start, 16,15, is the
Lantern's door). It departs from the brief in these squares and lines:

- **The coast.** The north-west coast and hills outside the rim are the rim's rock to the shallows
  (rows 0–18, some 53 squares, the sand there made shallow; and 6,20–21). No way on foot reaches them
  and the brief places nothing there, but density walks only standable ground from its points, so
  they stood past 15 of any point. The shelf from the strand to the lookout at 7,22 is as drafted
  (§9.2, #753's 4).
- **The corner.** The grass at 29–31,0 in the north rim's corner is rock: walled off from every other
  square by the rim and the void, it failed the maps check's reach from the start, swimming included
  (#753's 5).
- **The temple's door** at 18,14 was a building square with no feature until #755 joined its exit
  and made it a door (§4.4); `h6_front` at 18,15 says the door (#753's 6).
- **The tents** are building squares at 16,14, 15,15 and 17,15 round a yard at 16,16, each business
  on a door square as the maps check asks: the Lantern's at 16,15, the store's at 15,16 and the
  sergeant's at 17,16, the brief's squares (#753's 7).
- **The cache** is two squares carved, the hollow at 26,6 (`h6_cache`) and the chest `h6_lamp` at
  26,5, behind the secret door at 26,7, so that the hollow's line and the chest do not share a
  square. The hint, `h6_draught`, is at 26,8 on the grass at the rim's foot, as drafted (#753's 8).
- **The edges.** North, west and south are pinned against the void in `tools/tests/outdoors.ts`, the
  boxes beside them (H5, G6 and H7) being unlaid. The east edge is pinned as a string: rows 0–11
  rock, 12–20 grass, 21–28 rock, row 29 grass, row 30 sand, row 31 shallow. It is walkable on H6's
  side on rows 12–20 and 29–30; on rows 19 and 20 H6's grass meets I6's rock as the brief has it,
  and row 0 is rock on H6's side where the brief had it walkable on both sides (#753's 5). I6's west
  edge is laid against it (§4.3).
- **The finds and the strand.** The picket's chest, `h6_picket_chest` at 21,22, holds 700 gold and
  the Grey Knife; the cache's chest 1,000 gold and three Smelling Salts; the Hand's toll, `h6_toll`
  at 20,13 behind the preacher at the temple's door, 1,200 gold (#794: 300 and 400 before; no toll);
  the champions drop the knife at one in ten (#753's 14). The Compact's runner or the Warden
  sergeant stands at 23,30, each `after` its own end of the Compact, so never together (#753's 15).
- **The pilgrims** (57, §6): the quest is `bowl_pilgrims` and all three pilgrims set its met flag,
  `q_bowl_pilgrims` (#753's 1 and 2).
- **`h6_warm`** (23,14) ends at *The ground here is warm as a hearthstone.* The brief's second
  clause, that no grass grows within ten paces of the light, is false of the map, which has grass at
  23,14 and all round the column (#755's 15).
- **Measured.** A company at 28 wins every fight on the isle and walks its road, the two pickets
  and the sermon, every time. Two under, at 26, it wins every fight too, owed to #18 as every Act
  IV box's is (#753's 11). The seven groups as written give 12.34 fights to a rest (12.19 when
  built), past the aim and inside the limit (#753's 12). Density 99.7% within 8 steps, the furthest
  9, with one sign among its 33 points (31 until the temple's door became a door in #755; 32 until
  the toll, #794). The figures are in §8.

### 4.3 I6, the east rim (core, band 28–29)

**Purpose.** The Hand's landing and the anchoress: the causeway's end, the Hand's camp at its
root and the grey door that opened for Wenna; and on the rim above, Anchorhold, the Cleric's third
(§6). No step of the one quest, by design: the company sees where the Hand came from and cannot
follow. The Hand came in here at the Steps and went down by the service ways, and opened the
crypt's grey door from below with her hand, for its garrison in the temple (§4.5); its own door
into the Heart is at the Stair's foot (§4.7).

**The draft.** `node tools/scaffold.ts hearthisle 264 158 --id hearthisle_i6`: the rim's rock in
the box's first eight or nine columns from row 2 to row 26; the Bowl's grass coming through from H6
into a pocket at 0–1,12–18; grass and hills on the rim's north, rows 0 to 3; a strip of grass, then
sand and shallow, down the rim's east foot to the sea (about 5 to 11, rows 4 to 22); grass and sand
at the south-west corner, 0–6,23–30, where the camp and the Steps are; shallow and sea everywhere
else. The box's west edge meets H6's east on rows 0 to 30, walkable on rows 0 (rock on H6's side
since #753), 12 to 18 and 29 to 30 (§4.2). Its north edge meets I5's row 31, I5's rock against I6's
grass and hills on the first three columns and water beyond, pinned against the rock (§1).

**Landmarks and points of interest.**

- **Anchorhold** at 4,18, a cell of grey stone built into the rim's rock, its door bricked up and
  one window: the atlas's site (268,176), the cell itself rock. Below it the builder carves
  Anchorhold's yard out of the rim's rock, 2–5,19–20, where the pilgrims stood at the window. The
  anchoress is the Cleric's third's trainer (§6): the person at 4,19, in the yard under the window,
  `Hereswith, the anchoress`, with her lines (§6). Round the cell: `i6_cell` (5,19),
  once: *A cell built into the rim, its door bricked up with its own stone. One window, with a cup
  on its sill, and a voice behind it saying the hour.*; `i6_wall` (3,19), once: *Scratched on the
  cell's outside, in years of different hands: the hours, as pilgrims kept them for her. Eleven,
  always eleven.*
- **The Hand's Steps** at 3,27, the causeway's end: a stair of cut stone up from the water onto
  the sand, `i6_steps`, once: *A stair of cut stone comes up out of the sea onto the sand. Every
  step glows the way the shards do. The road from Sheer Point ends here.* (Act IV's line is not
  cut here: docs/areas/whitespine.md §4.7 keeps it to Sheer Point, with no word of it elsewhere.)
- **The Hand's camp** (2–6,23–26): tents, boats and crates. `i6_camp` (4,25), once: *The Hand's
  camp at the stair's head: grey tents, grey boats drawn up and the ashes of a fire nobody has
  tended for days.*; `i6_crates` (6,24, the sand by the boats), once: *Crates under the Hand's
  seal, every one open and empty. The straw is grey with the dust of the stones.*; `i6_tally`
  (3,24, at the camp's west end against the rim), once: *A tally-house of planks, and on its slate
  the count, finished: the last row crossed through, and under it, ELEVEN. DONE.*
- **The grey door** in the rim's foot at the camp's back, in the rock at 5,22, an event and no
  exit (§9, call 3), read from the grass below it: `i6_door` (5,23), once: *A door of grey in the
  rock, no handle, no seam, at the camp's back. The ground before it is trodden flat by two
  hundred feet going in. It does not open for you, and it never will.* Beside it, `i6_knot` (6,23),
  once: *On the frame, at the height of a girl's shoulder, a loop inside a loop, and under it a
  second mark, newer, scratched in a hurry.*
- **The rim's path,** which the builder carves out of the rim's rock: from the Bowl's grass at
  0,18 (the pocket through the seam) by 1,18 and 2,18 into Anchorhold's yard, and out of the yard
  by 6,19 and 7,19 onto the grass of the rim's east foot at 8,19, which runs down to the camp.
  Where it comes out over the sea, `i6_path` (8,19), once: *The rim's path, and over the sea to
  the south-east the causeway, stone by stone, all the way to Sheer Point.*
- **The secret:** behind the tally-house, a secret door in the rim's rock at 2,24, hint
  `i6_tally`'s own words and `i6_smell` (2,25, beside it on the camp's grass), once: *Lamp oil, and
  under it the smell of the sea cave under Rook's Nest.* Behind it, in a pocket the builder carves
  at 0–1,24, the Hand's takings: `i6_takings` (1,24), once: *The Hand's takings, cut into the rock:
  coin from every town on the road, and grey parts sorted into heaps by size.* and a chest
  `i6_hoard`: 1,200 gold, `grey_mail` (§8).
- **A second secret, the vigil cell** (#864, §4.9): in the rim's east face, a secret door at 8,15,
  its hint `i6_scorch` (9,15, on the east foot's grass), once: *A vein of glass, finger-thick, runs
  through the turf from the sand and stops at the rock, which is scorched black above it.* Behind
  it, in a cell the builder carves at 5–7,15, `i6_vigil` (7,15), once, and two chests, `i6_vigil_chest`
  (6,15) with a robe and `i6_vigil_locked` (5,15, `locked: true`) with a mace, both off the ladder.

**Encounters.** The Hand's camp guard, the box's hardest, and the moths by night; the rim's path
has one group so that Anchorhold is reached by a company at 28 with a fight.

| Id | Where | Group | Notes |
|---|---|---|---|
| `i6_rim` | 0,17 | 3 ashen champions | the pocket of the Bowl's grass where the rim's path begins, `respawn: 2880` |
| `i6_moths` | 5,20 | 12 hearth moths | `when: night`, over the cell, in Anchorhold's yard |
| `i6_guard` | 4,24 | 1 ashen preacher, 3 ashen champions, `back: 1` | the camp, `roams: false`; `until: { flag: 'q_throne_removed' }` by the leave rule (fewer Hand once Vask is gone from Helmstow, §6; today's `until` takes no standing group off a map, §9, call 9) |
| `i6_guard2` | 3,26 | 2 ashen champions | the stair's head, `roams: false` |

**Finds.** The hoard (above); the camp's chest `i6_camp_chest` (6,25): 500 gold, `grey_staff`; and
the cell's two, a lightning mace and a robe that raises personality, off the ladder (§4.9).

**Share of the pay.** About a twelfth of the area's (§8).

**As built** (#754, 13 October): the brief's places and its four groups, laid whole in the box at
264,158 (`hearthisle_i6`, region `hearth`, band 28–29), in the zone `hearthisle` beside H6. The land
is rock 139, grass 77, sand 35, hills 3, dirt 14 and a building square 1 (the cell), with the secret
door 1, shallow 77 and sea 677, where the draft had rock 155. The map starts at 8,19 facing south,
where the path comes out over the sea (§9.2, #754's 9; the scaffold's start, 12,17, is shore sand).
No company lands on I6: the zone's way in is H6's boat. It departs from the brief in these squares
and lines:

- **The seams.** West, x 0 against H6's x 31: open on both sides on rows 12 to 18, the Bowl into the
  pocket, and 29 to 31, the strand, where row 31 is shallow on both. Rows 0–1 and 27–28 are I6's
  grass against H6's rock; rows 19 and 20 are H6's grass against I6's rock; row 24, the pocket's
  dirt, is against H6's rock. North, row 0 meets `deepthorn_i5`'s row 31 as the brief has it; east and
  south are sea against J6 and I7, unlaid: the void. All are pinned in `tools/tests/outdoors.ts`
  after H6's.
- **Anchorhold's cell** at 4,18 is a building square, not the plan's rock: not walkable, and it
  shows on the map (#754's 2). The site is built, at 268,176. The yard 2–5,19–20, the path (1–2,18
  and 6–7,19) and the pocket (0–1,24) are carved as dirt (#754's 5). The anchoress's square, 4,19
  under the window, holds Hereswith (#763, §6).
- **Two points the brief does not name,** `i6_keel` at 8,10 and `i6_wyke` at 5,2, stand for density.
  Their words are the builder's own (#754's 1).
- **The secret** is the door at 2,24 (world 266,182), its hint `i6_smell` at 2,25 with the
  tally-house (3,24) beside it. The pocket behind holds the takings' line `i6_takings` at 1,24 and
  the chest `i6_hoard` at 0,24 (#754's 3 and 4).
- **The groups** are the brief's four at its squares: the champions at 0,17, the moths by night at
  5,20, the camp's guard at 4,24 and the stair's two at 3,26. The rim's group, the guard and the
  stair's two respawn at 2,880 and the moths at 1,440; none is a guardian. The guard is three
  champions then the preacher, `back: 1`, and leaves on `q_throne_removed` (#754's 6 and 7). Two
  more since #794, off the road: three champions on the east foot under the keel at 10,14
  (`i6_foot`, roaming, `aware` 3) and four, the Hand's watch over the Wyke, at 2,1 on the rim's
  north end (`i6_watch`, standing, `aware` 2), both at 2,880 (§9.2, #794's 1).
- **The finds.** The camp's chest `i6_camp_chest` at 6,25 holds 700 gold and the Grey Staff; the
  hoard 1,700 gold and the Grey Mail, which is the Drakeskin Coat's wearers' (#754's 8; the gold 500
  and 1,200 before #794).
- **The vigil cell** (#864, §4.9): three squares of dirt cut from the rim's rock at 5–7,15, the
  secret door at 8,15 (world 272,173), its hint `i6_scorch` at 9,15 and the cell's `i6_vigil` at
  7,15, with the chests `i6_vigil_chest` (6,15) and `i6_vigil_locked` (5,15, locked) holding no
  gold, the Vigil Robe and the Levin Mace. The land reads rock 135, dirt 17 and secret doors 2
  (139, 14 and 1 as #754 built it). The takings' door is still the box's first secret. The door
  stands where the painter leaves a wall bare (`wallDressing`), so the zone's 12 wall faces have 4
  dressed, inside the art suite's cap of half (§9, #864's 14).
- **Measured.** A company at 28 wins every fight on the rim and walks the isle's road on to the camp
  every time (#754's 10). Two under, at 26, it wins every fight too, owed to #18 as H6's is (#754's
  11). The six groups give 11.63 fights to a rest, inside the aim, and pay 1.09 of the share (the
  brief's four 11.32 and 0.74, #754's 12; #794). Density 100.0% within 8 steps, the furthest 6, with
  no sign among its 26 points (19 before Hereswith in #763; 20 before #794; 22 before #864). The figures are in §8.

### 4.4 Hearthfane, the temple (dungeon, 16×16, band 28–29)

**Purpose.** The temple built round the column's foot, held by the Hand's best: the nave with its
four lamps and the moths the Hand's lamps have brought in, the court open to the column, the
sacristan hiding in the vestry (56, §6), the treasury his key opens and the stair down behind the
altar. The one quest's second step here (§5). Its plate on the atlas at 250,172 (`PLACES`,
`hearthfane`, kind `dungeon`, band 28–29).

**Palette.** The rim's rock, pale and warm (`wall: '#b8a890', wallDark: '#7a6c58', floor: '#8a7c64', ceiling: '#2a2420', door: '#5a4030', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#8a3a2a'`),
with the Hand's grey banners either side of the court's arch.

**Layout.** The door on the south wall at 8,15 (the exit back onto H6's 18,15 facing south,
`label: 'Out of the temple into the Bowl. The light is at your back.'`). The nave runs north from
it, three squares wide, 7–9 from row 14 to row 6, a lamp in each corner of it: the Sea lamp at 6,13,
the Shore lamp at 10,13, the House lamp at 6,7, the Hearth lamp at 10,7. The court at the nave's
head, 5–11 by 2–5, open to the sky, the column's light coming down into it from the east through
an arch at 11,3 that gives on nothing (the column's foot is outside the map; the arch is a sign).
The vestry off the nave's west at 2–4,9–12, its door at 5,10. The treasury off the nave's east at
12–14,9–12, its door at 11,10, `locked` (an iron key, the sacristan's, 56). The altar at 8,2, and
behind it at 8,1 the stair down, an exit to the crypt: `{ x: 8, y: 1, to: 'hearthfane2', tx: 8, ty: 14, tf: NORTH, label: 'Down the stair behind the altar, into the crypt. The hum is louder below.' }`.

**Events and signs.**

- `hf_nave` (8,13), once: *The nave, and the pilgrims' lamps lit in its four corners. The air is
  full of wings.*
- `hf_pillars` (8,10), a `sign` on the nave's pillar: *Carved up the pillar in the oldest hand on
  the isle: FIRST THE SEA. THEN THE SHORE. THEN THE HOUSE. LAST OF ALL THE HEARTH.* The lamps'
  order, 56's hint chain (§6).
- `hf_court` (8,4), once: *The court, open to the sky, and the column coming down into it through
  the east arch. It is too bright to look at and too close to look away from.*
- `hf_arch` (11,3), a `sign`: *The arch gives on the column's foot. The stone of the arch is
  glassed where the light has touched it, four hundred years of mornings.*
- `hf_altar` (8,3), once: *An altar of the rim's rock, worn hollow where hands have lain on it.
  Behind it, a stair goes down, and the Hand's boot-marks go down it.*
- `hf_vestry` (3,10), once: *The vestry: vestments on their pegs, and the lamp-trimmer's tools laid
  out. Someone is breathing under the table.*
- `hf_treasury` (13,10), once, behind the locked door: *The pilgrims' offerings of four hundred
  years, in heaps. Among them, the Hand's own gear, laid down here and not taken up again: steel
  from below.*
- `hf_dead` (7,6), once: *A champion of the Hand dead in the nave, his grey hands over his face.
  The moths have found him.*

**People.**

- **The sacristan** at 3,11, under the vestry's table, 56's giver: his words are §6's.
- **The four lamps,** each a person in the engine's terms with no face, as the Ember Stone's
  sockets are (`maps/ember_stone.ts`, `socket`): their words and choices are §6's.

**Encounters.** The Hand's best in front, the moths while the lamps are lit.

| Id | Where | Group | Notes |
|---|---|---|---|
| `hf_moths` | 8,12 | 12 hearth moths | `until: { flag: LAMPS_OUT }` by the leave rule (§9, call 9), so the moths go to the light standing or not; `respawn: 720` while it stands |
| `hf_champions` | 8,8 | 4 ashen champions | the nave, `roams: false`, `respawn: 2880` |
| `hf_sermon` | 8,5 | 1 ashen preacher, 3 ashen champions, `back: 1` | the court, the level's hardest |
| `hf_second` | 6,4 | 1 ashen preacher, 2 ashen champions, `back: 1` | the court's west; `until: { flag: 'q_throne_removed' }` by the leave rule: thinner once Vask is gone from Helmstow (§6) |
| `hf_swarm` | 8,9 | 12 hearth moths | `after: { flag: LAMPS_WRONG }`, `until: { flag: LAMPS_OUT }` by the leave rule (56) |

**Finds.** The treasury's chest `hf_offerings` (13,11): 2,000 gold, `grey_blade`, `grey_bow`
(§8); the champions' drops (`grey_knife` at 0.1).

**Share of the pay.** About a seventh of the area's (§8).

**As built** (#755, 13 October): the brief's rooms and its five groups, laid whole in a 16×16 box
(`hearthfane`, region `hearth`, band 28–29), in at H6's temple door. The floor is 89 squares, doors
included (88 until #756 opened the stair); every one is reached from the start, the treasury by its
key. The place is
`{ id: 'hearthfane', kind: 'dungeon', at: [250, 172] }` in the area's `PLACES`
(`src/content/areas/hearth/atlas.ts`), with no band of its own: a built place reads its map's
(§9.2, #755's 13). It departs from the brief in these squares and lines:

- **The seams.** In: H6's 18,14, a door and the exit, onto 8,14 facing north, the nave's foot, with
  a label of its own (#755's 12 and 14). Out: 8,15, a door in the south wall, onto H6's 18,15 facing
  south, `h6_front`'s square. Down: 8,1 was wall until the crypt and is floor since #756, with the
  brief's exit to `hearthfane2` (`STAIR`, 8,14 facing north) listed; 8,2, the altar's square, is
  floor and the crypt's way up lands on it, facing south (#755's 4; #756's 5).
- **The treasury's door** at 11,10 is a door gated on the sacristan's key (`gates`, `after` the item
  `fane_key`), not `locked`: no iron key fits it, and his key is kept (#755's 1).
- **The pillar** at 8,10 reads in two: its `text` is *Carved up the pillar in the oldest hand on the
  isle.* and its `read` the order, so a reader has the order and the log's pillar entry is a
  reader's (#755's 2). The arch at 11,3 is a sign with no id, where the brief gave it `hf_arch`:
  an id is kept only for a sign with `read` (#755's 22).
- **The banners** at 12,2 and 12,4 are the Hand's grey, `#6a6866`, not the palette's red (#755's 5).
- **The lamps** at 6,13, 10,13, 6,7 and 10,7 are persons with no face, made by one `lamp()` as the
  Ember Stone's `socket()` is; the House and Hearth lamps' turn lines follow the Shore's (#755's 6).
  The wrong lamp's line says *the rest flare*, where the brief had *the other three*, which was
  false once a lamp is out (#755's 20).
- **The groups** are the brief's five at its squares: the moths at 8,12, the champions at 8,8, the
  sermon at 8,5, the second group at 6,4 and the swarm at 8,9. The moths and the swarm respawn at
  720 and the rest at 2,880. The moths and the swarm leave on `q_lamps_out` and the second group on
  `q_throne_removed`; the champions, the sermon and the second group stand. `aware` is 3 for the
  moths, the swarm and the sermon and 2 for the champions and the second group (#755's 7 and 8).
  Four more since #794, the garrison's rest, each standing, `aware` 2, at 2,880: two champions
  beside the treasury's way at 9,11 (`hf_nave2`) and three each at 5,2, 10,2 and 11,5 in the court
  (`hf_court1` to `hf_court3`). The temple places the moth, the champion and the preacher, all the
  isle's: no new monster.
- **The finds.** The chest `hf_offerings` at 13,11 holds 3,000 gold, the Grey Blade and the Grey Bow
  (#755's 11; 2,000 gold before #794); the Hand's tithe `hf_tithe` at 11,2, under the arch with a
  group of the court beside it, 1,100 gold (#794); the champions' drop, the Grey Knife, is the
  isle's (#753's 14).
- **The court** is open to the sky in `hf_court`'s words alone: a dungeon has one ceiling.
- **Measured.** A company at 28 wins every fight in the temple, each group 100% of ten in the
  walkthrough. Two under, at 26, it wins every fight too, owed to #18 as H6's is (#755's 10). The
  nine groups give 11.27 fights to a rest at 28, inside the aim, where the brief's five gave 8.96,
  under it (#755's 9; #794). Density 100.0% within 7 steps, the furthest 2, with two signs among its
  26 points. The figures are in §8.

### 4.5 The crypt (dungeon, 16×16, band 29)

**Purpose.** The temple's first crypt: the eleven niches, where the Cleric's third keeps the
eleven (§6); the Hand's first dead; Wenna's knot on the frame of the grey door at its bottom, the
one quest's step (§5); and the way down into the Ways. Its plate on the atlas at 250,178
(`hearthfane2`, band 29).

**Palette.** The temple's rock going grey toward the bottom; `bare: true` as the Dead-Drop is.

**Layout.** The stair's foot at 8,14 facing north (the exit back up: `{ x: 8, y: 15, to: 'hearthfane', tx: 8, ty: 2, tf: SOUTH, label: 'Up the stair behind the altar into the court.' }`).
A vaulted passage north to a round chamber at 5–11,5–11 with eleven niches in its wall, each with a
cold lamp; a side vault west at 1–3,6–9 with the Hand's dead; the chamber's north door at 8,4 to a
short passage ending at the grey door at 8,1, the exit down: `{ x: 8, y: 1, to: 'underdeep', tx: 16, ty: 30, tf: NORTH, label: 'Through the grey door she opened, and the ice of the crypt gives way to the hum. Light comes from the walls, and no lamp.' }`.
The Ways' way back up lands at 8,2 facing south (§4.6).

**Events and signs.**

- `hf2_vault` (8,12), once: *The crypt: the rim's rock cut into a vault, and under the vault, cold.
  The pilgrims' dead lie in the walls with their cups.*
- `hf2_niches` (8,8), once: *Eleven niches round the chamber, and in each a lamp, cold. Over them,
  cut in the old hand: ONCE FOR EACH, AND THE GAPS BETWEEN.*
- `hf2_eleven` (8,7), once, `after: { flag: LOG_GIVEN }`, `sets: ELEVEN_KEPT`: *You light the
  eleven as the log has them, a grace between each, the pairs even. On the eleventh the hum changes
  key, and holds.* (The Cleric's third, §6.)
- `hf2_dead` (2,7), once: *Three of the Hand dead in the side vault, laid in a row by their own.
  Whatever caught them did it below, and they were carried up to here, and no further.*
- `hf2_knot` (8,2), once: *On the grey door's frame, at a girl's shoulder: a loop inside a loop.
  She has left you a trail.*
- `hf2_door` (8,3), the grey door seen from the passage, a `sign` two squares before it: an exit
  takes the company on arrival, before the square's texts are said, so a sign on the door's own
  square (8,1, where the brief had it) is never read (§9.2, #757's 15): *A door of grey with no
  handle, standing open. It opened for her, and nobody has shut it since.*

**Encounters.**

| Id | Where | Group | Notes |
|---|---|---|---|
| `hf2_champions` | 8,10 | 3 ashen champions | the chamber, `roams: false`, `respawn: 2880` |
| `hf2_rats` | 2,9 | 10 deep rats | the side vault, come up for the dead, `respawn: 1440` |
| `hf2_keeper` | 8,3 | 1 keeper, 1 ashen champion | the passage to the grey door: the first machine met on the isle until #794's keepers in the chamber, and the Hand's last man up here, dead on his feet beside it, which the `look` says |

**Finds.** The chamber's chest `hf2_cups` (10,10): 600 gold; the dead champion's pack
`hf2_pack` (1,8): 200 gold, `grey_robe` (§8).

**Share of the pay.** About a tenth of the area's (§8).

**As built** (#756, 13 October): the brief's rooms and its three groups, laid whole in a 16×16 box
(`hearthfane2`, named The Crypt, region `hearth`, band 29), down the temple's stair. The floor is 58
squares, doors included; every one is reached from the start. The place is
`{ id: 'hearthfane2', kind: 'dungeon', at: [250, 178] }` in the area's `PLACES`
(`src/content/areas/hearth/atlas.ts`), with no band of its own: a built place reads its map's
(§9.2, #756's 11). The palette is the temple's rock greyed, `bare: true` (#756's 12). It departs
from the brief in these squares and lines:

- **The seams.** In: the temple's 8,1, floor now with `STAIR` listed, onto 8,14 facing north, the
  stair's foot and the start. Up: 8,15, floor with the exit, a stair and not a door, onto the
  temple's 8,2 facing south (#756's 5). Down: 8,1 is a door; the brief's exit to `underdeep` 16,30
  facing north (`GREY_DOOR`) is listed since #757, which landed the Ways' way up on 8,2 facing south
  (the knot's square) and turned the walkthrough's last line, which asserted no exit to `underdeep`
  (#756's 4). The sign `hf2_door` stands at 8,3, two squares before the door: an exit takes the
  company on arrival, so a sign on 8,1 is never read (#757's 15).
- **The rooms.** The chamber is a disc, rows 3, 5, 7, 7, 7, 5 and 3 wide at 5–11,5–11; the passages
  from the stair's foot (8,12–14) and to the grey door (8,1–3) are one wide. The side vault at
  1–3,6–9 opens on the chamber by a door at 4,8, the brief leaving its way in open; the chamber's
  north door, 8,4, is a door too (#756's 2).
- **The eleven niches** are lamp recesses in the chamber's wall, told in `hf2_niches` (8,8) and not
  carved as squares: eleven one-square notches do not fit a round chamber of 5–11 with three ways
  out without running together or squaring the round (#756's 1). The hint to the gaps is that
  event's carving, *ONCE FOR EACH, AND THE GAPS BETWEEN.*, which any company sees, where the
  temple's pillar is a sign that needs a reader; the brief's form is kept.
- **The Hand's last man** is told by an event of the builder's own, `hf2_last`, on the chamber's
  north door (8,4): *The passage, and in it the Hand's last man up here, dead on his feet.* An
  encounter has no `look`, which the brief's table leaves to say it; the keeper's own (§7, #761) is
  *A keeper with no bay to keep, and no robe.* The event gives the passage and the man in the form
  of `hf_nave` and `hf_court`; the look names the keeper after it (#756's 3). He fights as a
  champion: the idiom, not a corpse.
- **The deed.** `hf2_eleven` (8,7) is the brief's, `after` `q_eleven_log`, which Hereswith's
  hand-in sets (#763). The crypt exports `LOG_GIVEN`, which it reads, with `ELEVEN_KEPT`
  (`q_eleven_kept`), which it sets: I6's map reads both from here (#756's 6; #763's 5).
- **The groups** are the brief's three at its squares: the champions at 8,10, the rats at 2,9 and
  the keeper's at 8,3. `aware` is 2 for the champions and the keeper's group and 3 for the rats; the
  champions and the keeper stand and the rats roam. The champions and the keeper's group respawn at
  2,880 and the rats at 1,440; the keeper's group is no guardian, no quest naming it and it having
  no `slainText` (#756's 8). Three more since #794, up through the grey door she left open: twelve
  rats at the chamber's east at 11,8 (`hf2_rats2`) and in the side vault's north at 3,6
  (`hf2_rats3`), roaming, `aware` 3, at 1,440; and four keepers at the chamber's north-west, 6,6
  (`hf2_keepers`), standing, `aware` 2, at 2,880. They are in sight from the niches' square, so the
  keeper's look is said there and they, not the door's keeper, are the first machine met on the isle
  (§9.2, #794 (the isle)'s 11). The crypt places the isle's champion and rat and the keeper drawn
  ahead (#761), the first placed.
- **The finds.** The chest `hf2_cups` at 10,10 holds 1,800 gold; the dead champion's pack `hf2_pack`
  at 1,8 holds 1,100 gold and the Grey Robe, ac 13 at 6,200 (§8; 600 and 200 gold before #794). It
  has no class list, as the Cinder Robe (ac 12) has none: §8's *the casters* is who wears it, not a
  bar (#756's 7).
- **Measured.** A company at 29 wins every fight in the crypt, each group 100% of ten in the
  walkthrough, which walks the eleven twice, shut without the log and kept with it set by hand
  (#756's 13). Two under the gate reads n/a for the crypt: its floor, 29, is above the area's, so
  its groups count in the area's pool at 26, which wins every fight too and is owed to #18 already
  (#756's 10). The six groups give 10.46 fights to a rest at 29, inside the aim, where the brief's
  three gave 13.71, easier than it (#756's 9; #794). Density 100.0% within 7 steps, the furthest 4,
  with one sign among its 16 points. The figures are in §8.

### 4.6 The Ways (dungeon, 32×32, band 30)

**Purpose.** The hull's service layer, the Underdeep: corridors clean and humming and lit from
nowhere, doors with Wenna's knot on every frame (59, §6), keepers with no robe, rats and knockers at
walls that have not cracked in four hundred years; and two doors onto the rest of the world: the
CREW ONLY door's other side (60) and the crack the Sunder made (61). The one quest's step (§5). The
Underdeep's plate on the atlas at 216,168 (`underdeep`, band 30, `kind: 'deep'`); the atlas's deep
link from the isle lands here through the temple.

**Palette.** The Dead-Drop's (`maps/dead_drop3.ts`): grey, smooth and cold, lit from nowhere;
`bare: true`, `wallStyle: 'smooth'`.

**Layout.** The grey door's foot at 16,30 facing north, and behind it the way back up, `{ x: 16, y: 31, to: 'hearthfane2', tx: 8, ty: 2, tf: SOUTH, label: 'Back through the grey door, up into the cold of the crypt.' }`,
so a company can climb to the pilgrims' camp to rest and come down again. A main way runs north up the middle,
sixteen squares, with side ways off it east and west every four rows, each ending in a door with
a frame: the frames at 12,26, 20,26, 12,22, 20,22, 12,18, 20,18, 12,14, 20,14, eight in all, each
a once-event (59). The CREW ONLY door at the west end of the row-10 way, at 2,10, and the crack at
the east end of the row-6 way, at 29,6. The main way ends at the Stair's head, a door at 16,2, the
exit down: `{ x: 16, y: 1, to: 'underdeep2', tx: 16, ty: 30, tf: NORTH, label: 'Through the door at the ways' end, onto a stair that goes down further than your lamp.' }`.
The secret (59): a service hatch at 24,14 behind the row-14 east frame, a secret door with its
hint the frames' own events, opening on a crawl way that runs north to 24,2 and a second door onto
the Stair, `{ x: 24, y: 1, to: 'underdeep2', tx: 24, ty: 18, tf: SOUTH, label: 'Out of the crawl way onto the stair, well below its head. Nothing up here saw you.' }`:
the unwatched way, which lands below the Stair's first fights and above the Catcher.

**Events and signs.**

- `ud_in` (16,29), once: *Corridors, clean and humming and lit from nowhere. The walls are one
  face with no join, and they are warm.*
- `ud_voice` (16,24), once: *Something in the wall speaks, very soft, like someone talking in their
  sleep in the next room. "Captain." Not asking.*
- `ud_knot1` to `ud_knot8`, one on each frame (above), once each. The first: *A frame, and on it at a
  girl's shoulder a loop inside a loop, scratched with a nail.* The rest: *Her knot again, at the
  same height.* until the seventh, *Her knot, and a smear of blood on the frame beside it. Not hers:
  the grey comes off a hand that bled.*; the eighth (20,14): *Her knot, cut deeper than the others,
  as if she pressed harder here. Behind this frame the wall is thinner: you can hear the stair.*
  (The hint for the hatch at 24,14.)
- `ud_crew_sign` (4,10, built there; §9.2, #757's 16), a `sign` with `read` (an inscription, #538):
  text *A door in the ways' west wall, shut, and over it marks like the Kilns'.*, read *CREW ONLY.
  THE MINES BEYOND.* Its door (60) is at 2,10: a person in the engine's terms (§6).
- `ud_feet` (3,10, built there), once: *Hundreds of footprints in the dust before the door, walking
  in. On the door's inner face, a bar, and a handle. It opens from this side.*
- `ud_crack` (28,6), once: *A deep knocker standing still at the wall, its hammer raised and not
  falling. Before it, a crack the width of a hand, and through it daylight the colour of glass.*
  The knocker (61) is a person at 29,6 (§6).
- `ud_rats` (8,22), once: *Rats. Even here. Nobody brought them; they came aboard the way rats
  do.*
- `ud_end` (16,3), once: *The ways end at a door, and the hum beyond it has a floor to it: a
  stair, going down.*
- `ud_hatch` (24,13), once, inside the crawl way: *A crawl way a knocker's height, running north
  behind the frames. The dust in it is undisturbed.*

**People.** The CREW ONLY door at 2,10 and the knocker at 29,6: §6.

**Encounters.** The machine at work and nothing else, and rats; the keepers are the Ways' soldiers,
the knockers their armour. Eleven groups, the budget's balance and a rest's worth at 30 (§8), and
since #794 a twelfth for the pay, the rats in the crew's stores; the table's last row stands on the
Deep Mines' side (60).

| Id | Where | Group | Notes |
|---|---|---|---|
| `ud_rats1` | 16,27 | 12 deep rats | the way in, `respawn: 1440` |
| `ud_keepers1` | 12,25 | 3 keepers | the first west way, `respawn: 2880` |
| `ud_keepers2` | 20,21 | 4 keepers | |
| `ud_knockers1` | 12,17 | 2 deep knockers, 1 keeper | |
| `ud_rats2` | 8,13 | 12 deep rats | |
| `ud_keepers3` | 16,12 | 4 keepers | the main way's middle |
| `ud_knockers2` | 20,13 | 3 deep knockers | `roams: false` |
| `ud_crew_guard` | 6,10 | 2 keepers, 1 deep knocker | before the CREW ONLY door |
| `ud_crawlers` | 16,8 | 2 deep crawlers | the first crawlers, on the ceiling of the main way's last run: the level's hardest |
| `ud_knockers3` | 26,6 | 2 deep knockers | by the crack, `roams: false`, `until: { flag: CRACK_SEALED }` by the leave rule (they go to the crack once it is sealed, and are gone, standing or not) |
| `ud_keepers4` | 16,5 | 4 keepers | before the Stair's door |
| `ud_rats3` | 10,22 | 12 deep rats | in the crew's stores behind the third west frame, by `ud_rats`, `respawn: 1440` (#794) |
| `ud_mines` | `deep_mines3` 6,3 | 3 knockers, the Kilns' own (`knocker`, level 16) | `after: { flag: CREW_OPEN }`, on the Deep Mines' side (the road behind, §12), not here: the Clean Corridor is band 17–18, so no Act V monster stands on it (`tools/tests/curve.ts`) |

**Finds.** A keeper's store `ud_store` (12,27), a chest: 1,800 gold, `grey_shield`; the crawl way's
`ud_crawl_chest` (24,4): 2,200 gold and three Great Spell Draughts (`potion_sp_great`); the crew's
stores `ud_crew_store` (7,21): 2,000 gold; a second keeper's store `ud_store2` (24,17): 2,200 gold.
8,200 in all, the box's share of the area's gold and half the Heart's (#794; the brief had the
first two, at 800 and 600).

**Share of the pay.** About nine fortieths of the area's, a little under a quarter: the Ways and the
Stair are the balance (§8), and since #794 they carry all of the Heart's share of the gold and 1,006
of its 1,650 xp short of its eighth, the isle's half the rest (§4.8).

**As built** (#757, 14 October): the brief's ways and its eleven groups, laid in a 32×32 box
(`underdeep`, named The Ways, region `hearth`, band 30), down the crypt's grey door. The floor is
200 squares, doors included; every one is reached from the start, the crawl way by the hatch. The
place is `{ id: 'underdeep', name: 'The Underdeep', kind: 'deep', order: 13, band: [30, 30], at: [216, 168] }`
in the area's `PLACES` (`src/content/areas/hearth/atlas.ts`): it drops `planned` and keeps its
name, order and band, which the road's step reads (§9.2, #757's 10). The palette is the Dead-Drop's,
smooth and `bare` (#757's 14). It departs from the brief in these squares and lines:

- **The seams.** In: the crypt's 8,1, the grey door, with `GREY_DOOR` listed, onto 16,30 facing
  north, the start. Up: 16,31, floor with the exit, onto the crypt's 8,2 facing south. Across: the
  CREW ONLY door, 2,10, onto `deep_mines3` 13,3 facing west, the floor before `dm3_door`; the mines'
  `Z` at 14,3 stays, one way. Down: the Stair's head, 16,2, is a door with rock at 16,1; the
  crawl way's, 24,1, is a door with rock beyond. Their exits to `underdeep2` were exported
  (`STAIR_DOOR`, `CRAWL_DOOR`) and not listed, an exit to an unbuilt map failing
  `tools/tests/maps.ts`; #758 turned 16,1 to floor and listed both (#757's 5).
- **The ways.** The main way is one wide, 16,3 to 16,31, with side ways at rows 26, 22, 18 and 14
  (three squares each way) and the row-10 way west, 3–15, to the CREW ONLY door (#757's 3). The
  frames are doors in the ways' walls, `ud_knot1` to `ud_knot8` at 12,26, 20,26, 12,22, 20,22,
  12,18, 20,18, 12,14 and 20,14, each with a bay of three rows behind it, so the squares the table
  names beside them are wall (#757's 1).
- **The crack** is reached through the room behind the eighth frame, 21–22,14 and 21–24,15, which
  holds the hatch in its north wall and goes on east and up a way at x 26 to the row-6 way, 26–29,6:
  the knockers at 26,6, `ud_crack` at 28,6 and the knocker at 29,6 (#757's 2).
- **The secret** is the brief's: the hatch at 24,14, its hint the eighth frame's event `ud_knot8`
  (20,14), which a company reads without it. The crawl way, 24,2–13, is reached only through the
  hatch, with `ud_hatch` at 24,13 and the chest at 24,4.
- **The groups** are the brief's eleven, regrouped so their levels rise from the grey door: seven
  are moved (`ud_knockers1` to 9,26, `ud_knockers2` to 22,26, `ud_keepers1` to 11,17, `ud_keepers2`
  to 21,21, `ud_crew_guard` to 12,10, `ud_crawlers` to 16,5 and `ud_keepers4` to 16,8) and four
  stand where the brief has them (`ud_rats1` 16,27, `ud_rats2` 8,13, `ud_keepers3` 16,12 and
  `ud_knockers3` 26,6). Their `aware`, roaming and respawns are in §9.2 (#757's 4 and 11). #794
  adds a twelfth for the pay, `ud_rats3`, twelve deep rats at 10,22 in the bay behind the third
  west frame, by `ud_rats` (§9.2, #794's 1).
- **The finds.** The keepers' store `ud_store` at 11,27 holds 1,800 gold and the Grey Shield, ac 8
  at 4,000; the crawl way's `ud_crawl_chest` at 24,4 holds 2,200 gold and three Great Spell
  Draughts; the crew's stores `ud_crew_store` at 7,21 hold 2,000 and the second keeper's store
  `ud_store2` at 24,17 2,200: 8,200 in all, the two raised from 800 and 600 and the two added by
  #794 (§9.2, #794's 4 and 5). The Old Lantern's Staff, 1d10+14 at 7,000, is the knocker's gift
  for *Widen it.* (#757's 9).
- **The people** are *The door marked CREW ONLY* at 2,10 and *The knocker at the crack* at 29,6, both
  with no face (#757's 6 and 7). Their words are the brief's, save the shut answer's label (§6).
- **The door's approach.** The sign `ud_crew_sign` stands at 4,10 and the feet `ud_feet` at 3,10, the
  brief's two squares swapped: a sign on a company's own square comes before the person ahead, so
  with the sign at 3,10 the door could be spoken to only from its own square, and its way was a wall
  after either answer until the company stepped back and forward. The feet are an event, so from
  3,10 facing west the door ahead is the one to talk to and a step forward goes through (#757's 16).
- **Measured.** A company at 30 wins every fight in the Ways, each group 100% of ten in the
  walkthrough, which walks the Ways at 30: down the grey door and up again, every frame, the hatch
  found from the eighth, the crack sealed and widened on another walk and the CREW ONLY door
  answered both ways. Density 100.0% within 7 steps, the furthest 6, with one sign among its 37
  points since #794 (32 as built). The figures are in §8.

### 4.7 The Stair (dungeon, 32×32, band 30–31)

**Purpose.** The long stair down from the Ways to the heart: the claimant's people at its head
(57, §6), the Hand's rearguard, its dead on the steps where the crawlers caught them (58, §6), the
Catcher at the foot and the last door, the act's one lock (§9, call 1), with the Hand's own door
beside it, shut. The one quest's three steps here (§5). Its plate on the atlas at 216,172
(`underdeep2`, band 30–31).

**Palette.** The Ways', darker: `floor: '#505258', ceiling: '#303236'`.

**Layout.** The stair as a dungeon map: a corridor two wide that switches back down the map from
16,30 at the top to 16,2 at the foot, with the way back up behind the head, `{ x: 16, y: 31, to: 'underdeep', tx: 16, ty: 2, tf: SOUTH, label: 'Back up off the stair\'s head into the ways.' }`:
a company that reaches the Stair before the five flags can walk back to the pilgrims' camp and
rest, and come down again. Eight flights joined by landings, the crawl way's door
opening onto the fourth landing at 24,18. The landings at rows 30, 26, 22, 18, 14, 10, 6 and 2;
each flight a run of eight squares between them, the map's walls the shaft's. The Catcher's
landing is the last, 12–20,2–4, and the last door at 16,1, the exit into the Heart, with the lock:
`{ x: 16, y: 1, to: 'core', tx: 8, ty: 14, tf: NORTH, needFlag: ['q_tide_home', 'q_grove_done', 'q_anvil_closed', 'q_peak_stood', 'q_ember_lit'], blockedText: 'A door of grey, no handle, the Hand's last words cut across it. Something in it listens, and does not open.', label: 'The door does not wait for anyone's palm. It opens as you come near, the way a door opens for someone it knows.' }`
(`q_peak_stood` is set by I11's event, #751, §9; `q_grove_done` the Grove's closing, which the road's own
chapter sets: the Lanterns' mending is the Hearth's, not the door's, §9, call 1). The lock is
signed in `src/content/locks.ts` on `q_ember_lit` at `underdeep2` 16,1 (§9). Beside it in the
landing's wall at 13,1 is the Hand's own door into the Heart, which opened for her hand and is
shut behind them: an event and no exit, as I6's grey door is (`ud2_hand`, below).

**Events and signs.**

- `ud2_head` (16,29), once: *The stair's head. Below, flight under flight, the steps go down out of
  the lamp's reach, and the hum comes up them like heat.*
- `ud2_held` (16,27), once, `after: HELD`, where `HELD` is `[{ flag: 'q_throne_cousin' }, { flag: 'q_throne_hold' }, { flag: 'q_throne_tallis' }, { flag: TOKEN_COUSIN }, { flag: TOKEN_HOLD }, { flag: TOKEN_TALLIS }]`
  (a claimant's verdict, or where none carried a token, §6):
  *The claimant's people hold the first landing, their backs to the wall and the Hand's rearguard
  dead at their feet. They came in behind the Hand by the doors she opened.* (57 and the Council;
  their captain is a person, §6.)
- `ud2_dead` (16,22), once: *The Hand's dead on the stairs, a dozen on this flight alone, where
  what lives below caught up with them. They were running up.*
- `ud2_letter` (15,21), once: *A champion dead against the wall with his grey hands folded over a
  letter, sealed with a knot of rope. The seal is Gullwick's.* (58: a chest `ud2_letter_chest` on
  the square: 0 gold, `gullwick_letter`.)
- `ud2_marks` (16,18), once: *Claw-marks on the ceiling, deep, and running down the walls to the
  steps. Whatever made them walks where you cannot.*
- `ud2_more` (16,14), once: *More of the Hand's dead, and these did not run. They stood here and
  were taken from above.*
- `ud2_creed` (16,10), a `sign` chalked on the shaft's wall: *Chalked on the wall by a hand that was
  shaking: THE DOOR IS CLOSE. KEEP GOING.*
- `ud2_word` (16,6), once, `KNOT_LAST`: *On the last frame before the foot, not the knot. A word,
  scratched hard and deep, letter by letter: WENNA.* (59.)
- `ud2_foot` (16,3), once: *The foot of the stair, and the last door. Across it, cut deep, the Hand's
  last words: PUT OUT THE LIGHT, AND THE DOOR WILL OPEN.*
- `ud2_hand` (13,2), once, before the Hand's own door in the wall at 13,1: *Beside the last door,
  a second, grey, shut behind whoever went in. On its frame at a girl's shoulder, a loop inside a
  loop.*
- `ud2_shut` (16,2), `until: { flag: ['q_tide_home', 'q_grove_done', 'q_anvil_closed', 'q_peak_stood', 'q_ember_lit'] }`, said each time:
  *The door does not open. Something in it listens for five voices, and hears fewer.* (For a company
  that came early; no goal names it, §5.)

**People.** The claimant's captain on the first landing (57), §6.

**Encounters.** The Hand's rearguard where the claimant's people are not; the crawlers from the
second flight down; the Catcher at the foot; and since #794, for the pay, knockers at the walls of
the head and the second landing.

| Id | Where | Group | Notes |
|---|---|---|---|
| `ud2_knockers2` | 18,30 | 3 deep knockers | the head's east end, `roams: false`: the first group past the way in, the gentlest (#794) |
| `ud2_rearguard` | 16,26 | 3 hand rearguard (armoured, 30) | `roams: false`, `until: HELD` by the leave rule (the claimant's people fought it; §9, call 9) |
| `ud2_rats` | 14,23 | 12 deep rats | at the dead, `respawn: 1440` |
| `ud2_knockers3` | 19,22 | 3 deep knockers, 1 keeper | the second landing's east end, `roams: false` (#794) |
| `ud2_crawlers1` | 16,20 | 2 deep crawlers | the third flight, from the ceiling |
| `ud2_keepers` | 16,16 | 4 keepers | the fifth landing |
| `ud2_crawlers2` | 16,12 | 3 deep crawlers | the sixth flight, the level's hardest group |
| `ud2_knockers` | 16,8 | 3 deep knockers, 1 keeper | the seventh landing, `roams: false` |
| `ud2_catcher` | 16,4 | the Catcher, 2 deep crawlers, `leader: 'catcher'` | the foot, `roams: false`, `aware: 3`; `slainText: 'It comes off the ceiling all at once, and lies on the steps among the ones it caught. Nothing is moving above you now.'` |

**Finds.** The rearguard's chest `ud2_rearguard_chest` (17,26): 2,000 gold and `grey_axe`
(§8); the Catcher drops nothing; the dead's packs
`ud2_packs` (15,13): 1,800 gold, `potion_heal` ×4; more of their packs `ud2_packs2` (13,22), at
the second landing's west end by `ud2_dead`: 1,800 gold; the Hand's takings `ud2_takings` (20,2),
left at the last door: 2,600 gold. 8,200 in all, the box's share of the area's gold and half the
Heart's (#794; the brief had the first two, at 900 and 700).

**Share of the pay.** About nine fortieths of the area's, the Catcher's 19,733 nearly a third of
that (§8), and since #794 a share of the Heart's shortfall: with the Ways all of its gold and 1,006
of its 1,650 xp, the isle's half the rest (§4.8).

**As built** (#758, 14 October): the brief's landings, flights and seven groups, laid in a 32×32 box
(`underdeep2`, named The Stair, region `hearth`, band 30–31), down the Ways' door at the main way's
head. The floor is 153 open squares. The place is
`{ id: 'underdeep2', kind: 'deep', band: [30, 31], at: [216, 172] }` in the area's `PLACES`
(`src/content/areas/hearth/atlas.ts`): it has no name or order, the Stair being the Underdeep's and
no step of its own, and no `deep` way is added, the area's band, 28–32, holding without one (§9.2,
#758's 10). The palette is the Ways' with the brief's floor and ceiling, smooth and vault, `bare`
(#758's 11). It departs from the brief in these squares and lines:

- **The seams.** In: the Ways' 16,1, floor now with `STAIR_DOOR` listed, beyond the door at 16,2,
  onto 16,30 facing north, the start. Up: 16,31, floor with the exit, onto the Ways' 16,2 facing
  south. Across: the crawl way's door, the Ways' 24,1, with `CRAWL_DOOR` listed, onto 24,18 facing
  south. Down: the last door, 16,1, is a door now (below), and the Heart's way back up lands on
  16,2, the floor before it.
- **The landings and flights.** Eight landings, two rows deep at the brief's rows (26–27, 22–23,
  18–19, 14–15, 10–11 and 6–7, seven wide at 13–19), the head at 14–18,30 and the last at
  12–20,2–4; seven flights between them, two wide down the middle, turning a column at each landing
  (15–16, then 16–17), so every square the brief names stands on them. Eight landings four rows
  apart leave seven flights, not eight of eight squares, and the table's "fifth landing" (16,16),
  "sixth flight" (16,12) and "seventh landing" (16,8) fit no count of the rows: the squares are
  kept and the words are not (#758's 1).
- **The fourth landing** runs east, 13–24,18–19, so the company that comes out of the crawl way
  lands on 24,18 facing south, under the door drawn in the wall at 24,17. The brief gives no way
  back up it, and the head's way up is the way back to the camp (#758's 2).
- **The last door and the Hand's own** were doors drawn in the wall, 16,1 and 13,1 (`legend: { Z: {
  solid: 'wall', door: 'door' } }`, as the Deep Mines' and the Dead-Drop's): neither could be walked
  into, so `ud2_shut` read true. `LAST_DOOR` (the brief's exit to `core` 8,14 north, with its
  `needFlag`, `blockedText` and `label`) and `FIVE` were exported and not listed: the Heart (#759)
  listed the exit, turned 16,1 to a door and signed the lock; the Hand's own, 13,1, is still drawn
  in the wall (#758's 3).
- **The first landing** holds the rearguard, three at 16,26, standing: a guardian with `until: HELD`
  and `leaves` and no respawn, which the claimant's people take off the landing and which, slain,
  stays slain (#758's 5). The captain is one person, *The captain on the landing* at 15,27,
  `after: HELD`, with six `says` built from `HELD` in its order, the verdicts first (#758's 6).
- **The groups** are the brief's seven but for one count: `ud2_rearguard` 16,26, `ud2_rats` 14,23,
  `ud2_crawlers1` 16,20, `ud2_keepers` 16,16, `ud2_crawlers2` 16,12 (two crawlers, not three:
  #758's 8), `ud2_knockers` 16,8 and `ud2_catcher` 16,4. Their `aware`, roaming and respawns are in
  §9.2 (#758's 9). #794 adds two for the pay, standing as `ud2_knockers` does: `ud2_knockers2`,
  three deep knockers at 18,30 on the head's east end, and `ud2_knockers3`, three and a keeper at
  19,22 on the second landing's east end (§9.2, #794's 2 and 3).
- **The Catcher** is set off the line on its odds (`OFF_LINE`): 1,300 hit points and 32d8+37 for
  the line's 2,095 and 34d8+41 (#752 read 2,096 and 35d7+54; its gate set 1,100 and 34d8+40). It is
  won 57% at 30 and 80% at 32 on the gate's hundred seeds (63%, 67% at 31 and 81% on 400): the
  floor's aim, which binds (§8). Its level, armour, attack, speed, xp, `ranged`, paralysis and look
  are the brief's (§7, §8; #758's 7; #752's 4; #796's 1).
- **The finds.** `ud2_rearguard_chest` (17,26) holds 2,000 gold and the Grey Axe, 2d12+7 at 6,800;
  `ud2_letter_chest` (15,21), on `ud2_letter`'s square as the brief has it, Jowan's letter and no
  gold; the dead's packs `ud2_packs` (15,13) 1,800 gold and four `potion_heal`; more of the dead's
  packs `ud2_packs2` (13,22) 1,800 and the Hand's takings `ud2_takings` (20,2) 2,600: 8,200 in all,
  the two raised from 900 and 700 and the two added by #794 (§9.2, #794's 4 and 5). The Catcher
  drops nothing.
- **The sign** `ud2_creed` (16,10) has the brief's id and no `read`, chalk any company can read,
  and keeps no `seen` (#758's 13).
- **Measured.** A company at 30 wins every group but the Catcher's ten fights in ten in the
  walkthrough, which walks the Stair: down the Ways' last door and up, out of the crawl way, the
  first landing held, fought and outranked, the dead and the letter, the last frame and the Catcher
  at the shut door. Density 98.1% within 7 steps, the furthest 9, with one sign among its 27
  points since #794 (22 as built). The figures are in §8.

### 4.8 The Heart (dungeon, 16×16, band 32)

**Purpose.** The heart of the Hearth and the end of the road: the door with the creed, the panel
of glass that waited four hundred years for a hand like hers, Vask halfway through putting out the
light, the Grey Hands at the panel, the sentries the ring calls, the fight on a clock; then the
voice, Wenna, the ring and the choice (§5). Its plate on the atlas at 216,176 (`core`, band 32,
`kind: 'deep'`).

**Palette.** Grey going white toward the panel; the ceiling a glass roof the light comes through:
`ceiling: '#e8e4d8'` until the clock dims it (the systems lane draws the dimming, §9).

**Layout.** The door at 8,15 facing north, the way back up (the exit: `{ x: 8, y: 15, to: 'underdeep2', tx: 16, ty: 2, tf: SOUTH, label: 'Back through the door at the stair's foot. It stays open behind you now.' }`).
A short passage north, three wide (7–9,12–14), to the heart, a round room at 3–13,3–11 with the panel at its north wall at
8,3: Vask's group stands at 8,5, three squares in, and the company comes beside it at 8,7, where
the parley is put (`aware: 2`). The glass roof over the whole room. Round the room's wall, eight
sentries' alcoves, empty: where the Core Sentries come from when the ring calls.

**Events and signs.**

- `core_door` (8,13), once: *Through the door, and the hum is everything. The walls here are glass
  over grey, and the light comes down through the roof like weather.*
- `core_heart` (8,8), once: *Two grey-handed men holding her palm to a panel of glass at the
  room's end, and Vask, the Queen's ring on his finger. Overhead, the light is going out.*
- `core_roof` (6,6), once: *The roof is glass a hand thick, and over it the column, dimmer than
  it was at the strand. It is dimming while you watch.*
- `core_panel` (9,4, beside the voice's square), once, `after: { flag: VASK_FALLEN }`: *The panel:
  glass, warm, and under the glass a hand-shape worn into the light, waiting. Her palm-print is
  still on it.*
- `core_after` (8,9), once, `after: { flag: VASK_FALLEN }`: *The room is still. Vask is on his
  knees by the wall with his ring hand in his other hand, and the grey hands are gone, and she is
  standing in the middle of it rubbing her wrist.*

**The fight.** One group, `core_vask`, at 8,5: Lord Vask, three Grey Hands (two with Vask gone
from Helmstow by the Council, §6: a second def of the group, `core_vask_thinned`, `after: { flag: 'q_throne_removed' }`, and the first `until` it by the leave rule, §9, call 9, since today's `until` takes no standing group off a map), `leader: 'vask'`, `roams: false`,
`aware: 2`, `sets: 'q_vask_fallen'` on both defs (`EncounterDef.sets`, #636), so `VASK_FALLEN`
holds whichever falls, `clock: { calls: 'core_sentry', every: 2, dims: 8, panel: ['grey_hand'] }`
(the systems lane's Core clock, §9, call 7: while a monster the `panel` names stands, a Core
Sentry comes out of an alcove every second round, up to the cap of twelve monsters over the fight,
and the roof dims a step a round, to eight, where it holds at a thread; the Hands down, the calling
stops and the roof holds where it is). `slainText: 'Vask goes down on his knees and stays there. The last sentry stops where it stands, and the light through the roof stops going out.'`.
The parley, put as the company comes beside the group (`choice`, as the giants' toll is):

```ts
export const VASK: Choice = {
  ask: 'Vask does not turn from the glass. "Four hundred years in a jar. They painted the lid blue and called it heaven." Now he turns, and looks at whichever of you carries the maps. "And you have spent your lives mapping the inside of the jar. I am opening the door."',
  answers: [
    { label: 'Stop him.', fight: true, says: ['"No," he says, quite gently, as if to a child, and the grey hands press her palm flatter to the glass. The light overhead goes down a step.'] },
  ],
};
```

One answer, since nothing he offers is the company's to take: he offered at the watchtower, and
was told no. He never breaks (`steady`), and the Core Sentries stand down when he falls (§9, call
7).

**The voice,** a person at the panel with no face, `after: { flag: VASK_FALLEN }`, at 8,4, `flag: VOICE_WHOLE`:

```ts
{ kind: 'npc', x: 8, y: 4, name: 'The voice in the walls', after: { flag: VASK_FALLEN }, flag: VOICE_WHOLE, lines: [
  'The hum changes. Every voice you have heard on the road is speaking, and for the first time it is one voice: the drowned god\'s song, and the count, and the monastery bells, and the old thing in the ring on the moor asking the crew to report.',
  '"The voyage is over. It has been over for four hundred years."',
  '"The vessel is in orbit around the world it was sent to. Arrival was never triggered, because the crew who could trigger it forgot they were crew."',
  '"Captain. Give the order."',
], says: [{ after: { flag: VOICE_WHOLE }, lines: ['The hum, steady, and one voice in it, waiting. "Captain."'] }] }
```

It says what DESIGN §9 gives it and no more. It does not say where the vessel is, and the window's
truth is never said by the voice, nor before the choice: a company that holds Fane's map knows it
is lying about one thing, and the third answer is that company's.

**Wenna,** at 7,4, `after: { flag: VOICE_WHOLE }`, `until: { flag: WENNA_HOME }` so her words after
the ending are heard until Hild has hers (§6, The Walk Home), named as everywhere, `flag: RING_GIVEN`:

```ts
{ kind: 'npc', x: 7, y: 4, name: 'The girl out of the hole', after: { flag: VOICE_WHOLE }, until: { flag: WENNA_HOME }, flag: RING_GIVEN, lines: [
  'She walks over to Vask on his knees and pulls the Queen\'s ring off his finger. She looks at it for a long moment. Then she looks at the six of you.',
  '"I\'m not anyone\'s key." She puts the ring in your hand. "You walked every road of it. You choose."',
], choice: CHOICE_TWO, says: [
  { after: { flag: 'meridian_map' }, until: ENDED, lines: [
    'She walks over to Vask on his knees and pulls the Queen\'s ring off his finger. She looks at it for a long moment. Then she looks at the six of you, and at the oilcloth roll in your pack.',
    '"I\'m not anyone\'s key." She puts the ring in your hand. "You walked every road of it. You choose."',
  ], choice: CHOICE_THREE },
  { after: END_REIGNITE_WHEN, lines: ['She is sitting with her back to the panel, her knees up, watching the light come back through the roof.', '"Home," she says. "In the spring. Walk me."'] },
  { after: END_ARRIVE_WHEN, lines: ['She is standing under the roof with her face turned up to it, and there is wind in her hair. "Home," she says. "Walk me. I want to see what it looks like from outside."'] },
  { after: END_FINISH_WHEN, lines: ['She has her palm flat on the floor, feeling it. "It\'s moving," she says. "Can you feel it? Home, then. Walk me. We have a long way to go, all of us."'] },
] }
```

The two choices (the third answer is the first's third, offered only with `meridian_map` in the
flags; every answer's `sets` is a flag in the chapter's `done`. Related, and nothing here depends on
it: the pilot, #721, if it lands first, stops at the answers' `sets`):

```ts
const RELIT: Answer = { label: 'Light it again.', sets: END_REIGNITE, gives: SIGNET, says: [
  'She lays the ring to the glass, and you lay your hands over hers, and the light comes back up through the roof like a tide coming in.',
  'Far away, one after another, you hear doors closing.',
] };
const OPENED: Answer = { label: 'Open the hull.', sets: END_ARRIVE, gives: SIGNET, says: [
  'She lays the ring to the glass and says the word the wall taught her. Somewhere above you, something the size of a town begins to move.',
  'The hum stops. For the first time in your life, you hear wind.',
] };
const FINISHED: Answer = { label: 'Make it finish.', sets: END_FINISH, gives: SIGNET, says: [
  '"It is lying," you tell her. "It never arrived." She looks at the map in your hands, and lays the ring to the glass, and says it: finish the voyage.',
  'The light stands up through the roof harder than it has ever burned. Far below, something that has slept four hundred years turns over, and wakes.',
] };
export const CHOICE_TWO: Choice = { ask: 'The panel waits under her hand, and the light overhead is down to a thread.', answers: [RELIT, OPENED] };
export const CHOICE_THREE: Choice = { ...CHOICE_TWO, answers: [RELIT, OPENED, FINISHED] };
```

Each answer gives the ring (`queens_signet`, §8), which 64 and the Council read (§6). The ending's
pages (§5) are shown as the answer is taken, by the systems lane's ending screen (§9, call 6), and
the game goes on.

**Vask after,** at 3,9, `after: { flag: VASK_FALLEN }`, a person who says one thing and nothing
else: `{ kind: 'npc', x: 3, y: 9, name: 'Lord Vask', after: { flag: VASK_FALLEN }, lines: ['He does not look up. "I was not wrong about the facts," he says, to the floor. "I was never once wrong about the facts."'] }`.
After the ending he is gone from here (`until: ENDED`), to Helmstow's keep or out of the world
(§5, the road behind).

**At the door,** once Vask has fallen and until an ending (`after: { flag: VASK_FALLEN }`,
`until: ENDED`), who stands with the company at the core (§6, the Council and 57). Tallis's man, the
hinder, at 7,13 inside the door, there when Tallis won the chair or, where no claimant's verdict
carried, when his tally came down (`after: [{ flag: [VASK_FALLEN, 'q_throne_tallis'] }, { flag: [VASK_FALLEN, TOKEN_TALLIS] }]`, `until: [{ flag: 'q_throne_cousin' }, { flag: 'q_throne_hold' }, ...ENDED]`):
`{ kind: 'npc', x: 7, y: 13, name: 'Tallis\'s man', lines: ['A Compact man inside the door, the stair\'s dust on a good coat. He came down behind the fighting, not in it.', '"Tallis\'s. What comes up out of here is his, the ring most of all. If it goes anywhere else, he\'ll be told."'] }`.
Beside him at 7,12, for a Partner (`after: { flag: [VASK_FALLEN, 'q_compact_over'] }`, `until: ENDED`),
the Compact's runner, who has come to carry the news and says nothing the company could use (the
spy's word is the strand runner's, §6, given where it can still be spent):
`{ kind: 'npc', x: 7, y: 12, name: 'A Compact runner', lines: ['A Compact runner inside the door, a boy with a satchel and the stair\'s dust to the knee.', '"Partner. Whatever you decide down here, the Compact will carry the news over the Sound the same night, and ask no fee."'] }`.

**Encounters.** The one group above; the sentries it calls are not placed, they are called
(`core_sentry` in Vask's `calls`, on the clock's beat), up to the cap of twelve monsters over the
fight.

**Finds.** None but the ring. The Heart pays its fight's xp and nothing else: Vask's and the Grey
Hands', and the sentries' the clock calls (§8). It holds one fight and cannot add a group, so the
shortfall of its eighth, about 1,650 xp a member, is carried by the boxes before it (1,006 by the
Ways and the Stair, the rest by the isle's half); its share of the gold, 3,540, by the Ways and the
Stair in full (#794; §4.6, §4.7).

**As built** (#759, 14 October): the brief's door, passage and round room, its five events, the
voice, Wenna with her three answers, Vask after, the two who stand inside the door and the one
fight on the clock, laid in a 16×16 box (`core`, named The Heart, region `hearth`, band 32). The
floor is 90 open squares. The place is
`{ id: 'core', name: 'The Core', kind: 'deep', order: 14, band: [32, 32], at: [216, 176] }` in the
area's `PLACES` (`src/content/areas/hearth/atlas.ts`), `planned` dropped. It departs from the brief
in these squares and lines:

- **The seams.** In: the Stair's last door, 16,1 (`LAST_DOOR`, shut until the road's five hold),
  onto 8,14 facing north, the start. Up: the door at 8,15, a door square carrying the exit, as the
  Stair's 16,1 does, onto the Stair's 16,2 facing south, where `ud2_shut` is said until the five
  hold (#759's 1). An exit fires no event on the square it lands on, so the first line, `core_door`,
  is on 8,13, one step in (#759's 16).
- **The room.** The floor is 3–13 by 4–11, rounded, under a north wall on row 3 with the panel at
  8,3 a wall square; the passage is 7–9 by 12–14. Every named square holds: 3,9 by the west wall,
  7,4 to 9,4 along the panel, 8,5 three squares in counting the panel (#759's 1).
- **The alcoves** are eight and empty: either side of the panel in its row (6,3 and 10,3), two in
  each side wall (2,6, 2,9, 14,6 and 14,9) and two in the south curve (4,11 and 12,11). The sentries
  are called, not placed (#759's 2).
- **The palette** is pale grey walls going to a white glass roof (`ceiling: '#e8e4d8'`, the brief's),
  `smooth`, `vault`, `bare`. No other square is marked: the panel is a wall and the events say what
  it is (#759's 3).
- **The groups** are the one group's two defs, `core_vask` (Vask and three Grey Hands) and
  `core_vask_thinned` (Vask and two), both at 8,5 and both carrying the clock, the parley and
  `slainText` (#759's 5). The thinned has `until: { flag: VASK_FALLEN }` and `leaves: true`, which
  the brief does not give: the Council can sit after the fight (`q_throne_removed` is set before an
  ending and after one), and it would raise Vask and two Hands at the panel for a second fight while
  he knelt by the wall (#759's 4).
- **The parley** is the brief's: one answer, *Stop him.*, and the brief's whole question, which takes
  3 of the box's 5 lines, a group's parley being asked in the box (the side panel's seven lines are a
  business's: #759's 14 and 17).
- **Wenna's words** for a company with Fane's map set `RING_GIVEN` themselves (`sets` on that `says`
  entry): a person's `flag` is set only on her own first lines (`meet`, `src/game/people.ts`), so
  those words would have given the ring and never the flag the chapter and its goals read
  (#759's 6).
- **Vask** is set off the line on his odds (`OFF_LINE`): 1,850 hit points and 22d8+23 for the line's
  2,100 and 34d8+41 (#752; the Heart's gate set 1,800), and the sentries he calls carry 890 hit
  points with the soldier's blow, twice the soldier line as #752 read it and off the line by the
  design's choice as the Catcher is (§7). He is won 60% with the Hands first and 33% with the clock
  let run on the gate's hundred seeds (62% and 28% on 400): the aims of §8. His level, armour,
  attack, speed, xp, role, look, calls and sprite are the brief's (§7, §8; #759's 7; #752's 5;
  #796's 2).
- **The finds** are none but the ring: each answer gives it (`queens_signet`, 64, §6), and the Heart
  adds no gold.
- **Measured.** The walkthrough walks the last door shut on four of the road's five and open on the
  five (#759's 12), then the Heart: the door, the room and its roof, the parley, the fight on the
  clock won with the Hands killed first and with the clock left to run, the panel, Vask after, the
  voice, Wenna and each of her three answers once; then the thinned group, with who stands inside
  the door, for a Council that removed Vask. Density 100.0% within 7 steps, the furthest 7, with no
  sign among its 12 points. The figures are in §8.

### 4.9 The vigil cell in the east rim (#864): two finds off the ladder

The area's share of epic #18's eight items (DESIGN §5 and §6; the delegate's ruling, D1 to D4): one
weapon whose blows carry an element and one piece of gear that raises a stat while it is worn, to
each act past I, found and never told, off the ladder (no `GEAR` row dresses a company in either),
inside the area's window of 7,000 and in no shop. The isle's are a lightning mace and a robe that
raises personality. They lie in a cell cut in I6's east rim, behind a second secret door, the mace in
the area's first locked chest.

| Item | Kind | Dice or stat | Where | Price |
|---|---|---|---|---|
| Levin Mace (`levin_mace`) | a weapon of the Slag Mace's and the Grey Blade's classes: knight, paladin, ranger, barbarian, cleric | 2d12+5, the Slag Mace's steel, and 1d6 of lightning on every blow that lands (`element`) | the grey-banded chest at the cell's back, 5,15 (`i6_vigil_locked`, `locked: true`), no gold | 6,950 gold, 3,475 back |
| Vigil Robe (`vigil_robe`) | armour, a robe anyone may wear, as the Grey Robe is | AC 12, a point under the Grey Robe's 13, and personality +3 while worn (`stat`) | the plain chest in front of it, 6,15 (`i6_vigil_chest`), no gold | 6,350 gold, 3,175 back |

**`hits()`.** The mace's is 21.5: the steel's 18 and the die at 3.5 (`ELEMENT_DIE`). The ladder's
weapon of its kind at the band is the Grey Blade from 28, 2d12+6, whose is 19, and the rung under it
is the Slag Mace of Cinderport's 25, 18. The steel is the rung under the ladder's, so the die is the
gain: 3.5 over the Slag Mace and 2.5 over the Grey Blade, with a point less on the steel. The robe's
gain is the stat, bought with a point of armour (the Grey Robe's 13 against its 12) for a stat the
heal reads (`spellHeal`): worn, the cleric's personality 15 reads 18 and her heal a point more
(24 to 25 on a base of 20).

**Where it is.** The rim's east face on row 15, 26 squares from the road as a company walks and 21
as the crow flies. The road is the one walk the chapter needs on the isle: from the strand at 20,30
up the cleft to the Bowl and the temple's door at 18,14 (18 steps), all in H6. The cell lies in the
other box, past the seam on the Bowl's east, along the rim's path through Anchorhold's yard and up
the east foot, where the chapter never goes (§4.3: no step of the one quest, by design). The door is
at 8,15, between rock at 8,14 and 8,16; behind it three squares of dirt floor cut from the rim's rock
at 5 to 7, the first with its event, then the plain chest and the locked one. The squares are shut to
every walker but through the door, and nothing in the boxes, the chapter or the side quests sends a
company there. The three secrets the area already had hold gold and a find or are a way (H6's cache
the salts and 1,000 gold, I6's takings the Grey Mail and 1,700 gold, the Ways' hatch a crawl way on),
so none was free, and the Underdeep and the Core are barred.

**The hint** (`i6_scorch`, 9,15, on the door's near side, always there): *A vein of glass,
finger-thick, runs through the turf from the sand and stops at the rock, which is scorched black above
it.* It explains nothing, and the door is found by a search where the glass stops. Inside, an event at
the cell's first square (`i6_vigil`, 7,15): *A cell cut in the rim, bed-long, its roof black with
lamp-smoke. A plain chest on the floor, and one banded in grey metal.* The plain chest opens to any
company; the grey-banded one says "A locked chest." and, to a company with neither a Lockpick standing
nor an iron key, "Locked." and nothing (DESIGN §5, #857). The premade six's thief is born to Lockpick.
Nothing the road needs lies in it, and no quest turns on either find. The east foot's champions
(`i6_foot`, from 10,14) start a step from the glass, so the cell is reached past them.

**The lightning.** The isle places 11 monsters, all past 10, and 4 are weak to lightning and none is
immune or resists it (`elementMult`): the keeper, the deep knocker, the deep crawler and the Catcher,
the machines of the Ways and the Stair. Holy and nature are those four's immunities, which is why the
mace is not holy. Nothing the isle places is weak to fire, cold, poison or shadow, so no other element
does better, and no area comes after the isle for the delegate's rule to ask about (§9, #864's 4).

**Built** (#864). Inert for every check: no monster, group, gold or pay is added or moved, so §8
stands, and the gate's, the harness's, the ladder's and the curve's figures are byte-identical to
main's (the PR holds the diff). Both prices are under the Grey Mail's 7,000, the dearest find the
curve names for the area, so that line stands too. Density holds: I6 100.0% within 8 steps (134 of
134, the furthest 6), with no sign among its 26 points, four more. `shipped.json` adds the door at
272,173, `levin_mace`, `vigil_robe` and the ids `i6_scorch`, `i6_vigil`, `i6_vigil_chest` and
`i6_vigil_locked`; nothing moves. The walkthrough walks the detour in I6, on from the Hand's takings
(`theVigil`): the glass, the search, the door, the robe from the plain chest and the mace from the
grey-banded one, which the company's thief picks; and holds the finds themselves (`vigilFinds`:
shape, window, no shop, no row of the ladder, no monster's drop, the one locked chest, the raise worn
and carried, lightning against the isle, found and never told, the distance from the road) and the
lock's refusals on a game of its own (`vigilLocked`, the real chest: refused with neither, opened by
the thief, by a key, by the key spent).

## 5. The one quest here

Hearth Isle's chapter is The Heart (`chapter.ts`, a working title), joined after the Wold's The
Warning, the twelfth and last; every zone on the road holds a step (EXPANSION §5.8), and the
isle's one zone holds two. It begins on The Warning's end, `q_road_east`, set at Akordu's
horse-lines with the Glass seen, or on the isle for a company that bought the last crossing early
(`visited: 'hearthisle_h6'`), and it is done on the choice: any of `q_end_reignite`,
`q_end_arrive` and `q_end_finish`, which Wenna's three answers set (§4.8). The quest's own end is
said then (`Quest complete: The Dimming.`, `tools/walk.ts` `ending`). The walk home is a side
quest, The Walk Home (§6), since a done chapter has no goal. In the journal's voice, keyed to
flags, events and maps the save holds:

```ts
export const CHAPTER: Chapter = {
  id: 'heart',
  title: 'The Heart',
  start: [{ flag: ROAD_EAST }, { visited: 'hearthisle_h6' }],
  done: ENDED,
  entries: [
    { id: 'isle', when: { seen: STRAND },
      text: 'Up close the Hearth is no fire. A column of light stands out of the isle into the sky\'s roof, and it hums in our teeth.' },
    { id: 'shard', when: { seen: 'hearthisle_h6:h6_shard' },
      text: 'It is the hum of the carved lump by the tear under Ashcombe, at the very beginning.' },
    { id: 'temple', when: { visited: 'hearthfane' },
      text: 'A temple round the column\'s foot, built by people who thought it a god. The Hand holds it, its best in front.' },
    { id: 'knot', when: { seen: 'hearthfane2:hf2_knot' },
      text: 'On the crypt\'s grey door, at a girl\'s shoulder: a loop inside a loop. She has left us a trail.' },
    { id: 'ways', when: { seen: 'underdeep:ud_in' },
      text: 'Below the crypt the world goes down: corridors clean and humming and lit from nowhere, and her knot on every frame.' },
    { id: 'dead', when: { seen: 'underdeep2:ud2_dead' },
      text: 'The Hand\'s dead lie on the stairs below, where what lives down here caught them. Something is still catching.' },
    { id: 'word', when: { seen: KNOT_LAST },
      text: 'On the last frame, not the knot. A word, scratched hard: WENNA.' },
    { id: 'catcher', when: { slain: 'underdeep2:ud2_catcher' },
      text: 'It caught the Hand on these stairs. It did not catch us.' },
    { id: 'creed', when: { seen: 'underdeep2:ud2_foot' },
      text: 'Across the last door, the Hand\'s last words: PUT OUT THE LIGHT, AND THE DOOR WILL OPEN.' },
    { id: 'door', when: { seen: 'core:core_door' },
      text: 'It did not wait for anyone\'s palm. It opened as we came near, the way a door opens for someone it knows.' },
    { id: 'vask', when: { seen: 'core:core_heart' },
      text: 'Vask at the heart of it, the Queen\'s ring on his finger, her palm held to the glass. Overhead, the light was going out.' },
    { id: 'fallen', when: { flag: VASK_FALLEN },
      text: 'A hard fight, and not a clean one. Vask on his knees, the grey hands gone and her in the middle of it, rubbing her wrist.' },
    { id: 'voice', when: { flag: VOICE_WHOLE },
      text: 'Then the voice, one voice at last. The voyage is over, it said, and has been for four hundred years. Nobody told the crew.' },
    { id: 'ring', when: { flag: RING_GIVEN },
      text: 'She took the ring off his finger and put it in our hands. I\'m not anyone\'s key, she said. You choose.' },
    { id: 'relit', when: { flag: END_REIGNITE },
      text: 'We lit it again. The Hearth stood up out of the sea brighter than anyone living has seen it, and the tears closed like doors at night.' },
    { id: 'opened', when: { flag: END_ARRIVE },
      text: 'We opened the hull. We walked up into daylight the wrong colour, under a sky that does not stop, and felt wind.' },
    { id: 'finished', when: { flag: END_FINISH },
      text: 'We made it finish. The Hearth burns harder than it ever has, and far below, engines woke. Our grandchildren will see it land.' },
  ],
  goals: [
    { when: { flag: RING_GIVEN }, at: 'core', text: 'The ring is in our hands, and the panel at the heart waits under hers. Choose.' },
    { when: { flag: VOICE_WHOLE }, at: 'core', text: 'The girl out of the hole, at the heart\'s panel, with the ring.' },
    { when: { flag: VASK_FALLEN }, at: 'core', text: 'The panel at the heart, and whatever speaks now the Hand is broken.' },
    { when: { seen: 'core:core_door' }, at: 'core', text: 'Into the heart of the Hearth, to Vask at the panel, and stop him.' },
    { when: { slain: 'underdeep2:ud2_catcher' }, at: 'underdeep2', text: 'Through the last door at the stair\'s foot, which opens for whoever made the Stones whole.' },
    { when: { seen: 'underdeep2:ud2_dead' }, at: 'underdeep2', text: 'Down the rest of the stair past the Hand\'s dead, to whatever caught them, and the door at the foot.' },
    { when: { seen: 'underdeep:ud_in' }, at: 'underdeep2', text: 'Through the service ways under the world, following her knots, to the stair that goes down to the heart.' },
    { when: { seen: 'hearthfane2:hf2_knot' }, at: 'underdeep', text: 'Through the grey door she marked, down into the ways below the world.' },
    { when: { visited: 'hearthfane' }, at: 'hearthfane2', text: 'Through the nave past the Hand\'s best, and down the stair behind the altar into the crypt.' },
    { when: { visited: 'hearthisle_h6' }, at: 'hearthfane', text: 'Up the cleft through the rim into the Bowl, to Hearthfane, the temple at the column\'s foot.' },
    { when: { flag: ROAD_EAST }, at: 'hearthisle_h6', text: 'East to Cinderport\'s quay, and the last crossing over the Sound to Hearth Isle, where the light stands.' },
  ],
};
```

Entries are kept under two lines of the journal's page, as Act IV's are; the walkthrough's `fits`
holds them. Nobody is named: she is the girl out of the hole in the goals and her in the entries,
as every chapter has her, and the word on the last frame is the one time the journal writes her
name, which is the point of it. The entries are the company's: the voice's words are quoted at
one remove, so what the Custodian is stays found and never told. Written so (#760): the code above is
the chapter as built, with three goals' words naming their place, one goal's key on the isle and one
goal's place on the Stair (§9.2, #760's 1 to 3).

**The lock.** The last door (§4.7) needs the five flags the road sets at the Stones: the Tide
Stone home (`q_tide_home`), the Grove closed (`q_grove_done`), the Anvil's tear closed
(`q_anvil_closed`), the Peak Stone stood beside (`q_peak_stood`, which #751 adds to I11's
event, §9) and the Ember Stone lit (`q_ember_lit`). The door asks the road's five and no more: the
Grove's mending (`q_mender_done`, #56's 18) brightens the Hearth's count and opens nothing. A
company that comes early reads `ud2_shut` at the door and no goal names it: the goal still says the
Catcher and the door, and the journal reads true; it can walk back up by the Stair's head and the
Ways' grey door to the pilgrims' camp and rest (§4.6, §4.7). It is the road's second lock and the
act's one (EXPANSION §2.3, §9, call 1).

**The endings' pages,** shown by the systems lane's screen as the answer is taken (§9, call 6),
the long-form exception (DESIGN §11), three pages each, in `src/content/endings.ts`:

- **Reignite** (`q_end_reignite`, *The Hearth Relit*): *The Hearth stands up out of the sea
  brighter than anyone living has seen it. All across Caldera the tears close, one by one, like
  doors in a house at night. The sky stays blue.* / *The world you spent your lives mapping is the
  world you keep. Vask goes up the stair in irons, and stands trial in Helmstow, and never once
  looks up.* / *In the spring, you will walk her home.*
- **Arrive** (`q_end_arrive`, *The Hull Opened*): *You open the hull. The Rifts stop for good,
  because there is nothing left for them to hold out.* / *You walk up out of the dark into
  daylight the wrong colour, under a sky that goes up and does not stop, and for the first time in
  your lives you feel real wind. Vask walks out ahead of you, and he is the first to understand
  what beyond really means.* / *In the spring, you will walk her home.*
- **Finish** (`q_end_finish`, *The Voyage Finished*): *The ship was never in orbit. It never
  arrived. The voyage did not end; it stalled. So you do the one thing nobody asked you to do, and
  you make it finish.* / *The Hearth burns harder than it has ever burned, and somewhere far below,
  engines wake. You will not see the landing. Your grandchildren will, if you tell them the
  truth.* / *In the spring, you will walk her home.*

Each ending changes the world after it (§9, call 6, the road behind): the Hearth's state on the
title, in the night sky and in the almanac; the sentries that hunted Ashfall stand down (by the
leave rule, §9, call 9); Helmstow's gate opens to everyone; Vask is in the keep's hall before the
Council (reignite, finish) or gone (arrive); the halls say their word. The Rifts are already quiet,
every Stone restored; the almanac says the tears have closed.

**The walkthrough** plays the chapter at 28, 30 and 32 three ways, each ending once: by the boat
at 28, the temple and the crypt, the Ways at 30 with every frame read and the hatch found, the
Stair with the rearguard fought, the Catcher at 31, the door opened on the five flags and Vask at
32 with the clock ticking, the Hands first; relit. Then with the Council sat for a claimant and
Vask removed: the thinned temple and the thinned heart, the claimant's people on the first landing
with the rearguard gone, whoever the verdict puts at the Heart's door and the hatch's way landing
below the fights; opened. Then with Fane's map held, a token carried and no verdict, the
three answers put and the third taken; finished. And once more at 27, early by the boat, the door
shut on four flags, the walk back up to the camp to rest and the journal reading true to the
Catcher with the ending unreached. It checks the quest ends once, the pages fit, every goal names a
map in band and each ending's flag reaches Gullwick's shore (owed to #765 until the road behind
writes it).

## 6. Side quests

#56's seven for Act V (56 to 61 and 64) stand (§9, call 8); 62 and 63 are the reach's, Phase
1.6's. Each is built with its map, in `quests.ts`, keyed as the chapter is; the Council and the
walk home are quests of their own. Then the Cleric's third, the tenth and last prestige quest on
the road (#448's ninth; the Sorcerer's is the reach's).

**56. The Sacristan's Lamps** (`lamps`, Hearthfane, 28). The sacristan under the vestry's table
gives it; the pillar's carving is the order; the four lamps go out; the moths leave; he gives the
treasury's key.

- The sacristan, at 3,11 in the vestry, `flag: 'q_lamps'`:
  `lines: ['A small man under the vestry table with his knees drawn up and a lamp-trimmer\'s hook in both hands. He does not come out.', '"I kept them dark. Forty years I kept them dark, because of the moths. The light outside is lamp enough for anybody." A breath. "Then the grey men lit them, all four, and the sky came in."', '"Put them out. Not any way: the pillar says the way, if you can read a pillar. Do it wrong and you will see why I kept them dark."']`,
  `says: [{ after: { flag: LAMPS_OUT }, until: { flag: 'q_lamps_key' }, sets: 'q_lamps', lines: ['He is out from under the table, standing with his face turned up to the empty air.', '"Gone. Every one of them, to the big lamp outside, where they belong." He takes a key off his belt. "The treasury. The pilgrims\' offerings are the Hearth\'s, but the grey men left their gear in there, and that is nobody\'s. Take it."'], choice: { ask: 'He holds out the key.', answers: [{ label: 'Take the key.', sets: 'q_lamps_key', gives: 'fane_key', pay: { xp: 3000 }, says: ['An iron key, warm from his belt. He is already looking at the wicks.'] }] } }, { after: { flag: 'q_lamps_key' }, lines: ['The sacristan is trimming wicks in the vestry, and not lighting them.', '"Dark again. I can hear myself think."'] }, { after: { flag: ['q_lamps', LAMPS_WRONG] }, until: { flag: LAMPS_OUT }, lines: ['From under the table: "I told you. The pillar. Read the pillar."'] }]`.
  His LAMPS_OUT words end in a choice of one answer, *Take the key.*, which sets `q_lamps_key` and
  pays the xp, as any answer can today. It gives `fane_key`, an iron key for the treasury's locked
  door (`src/game/map.ts`, `locked`), which the Ways' and the Stair's reachability flood reaches
  without it (EXPANSION §5.1).
- The lamps, each a person with no face: the Sea lamp at 6,13, the Shore at 10,13, the House at
  6,7, the Hearth at 10,7. Each has `lines` and a `choice` for the wrong order, and a `says` entry
  with the right one, said first when it holds (the order's flags `lamp_sea`, `lamp_shore`,
  `lamp_house`, `lamp_hearth`; the last sets `LAMPS_OUT` as well). The Sea lamp's right order is
  first, so it has no wrong one:
  - `{ kind: 'npc', x: 6, y: 13, name: 'The Sea lamp', until: { flag: 'lamp_sea' }, lines: ['A lamp on a stand of the rim\'s rock, burning high. The moths are thick on it.'], choice: { ask: 'Put it out?', answers: [{ label: 'Put it out.', sets: 'lamp_sea', says: ['You pinch the wick. The moths lift off it and go looking.'] }] } }`
  - the Shore lamp: `until: { flag: 'lamp_shore' }`, `lines: ['A lamp on a stand, burning high.']`, `choice: { ask: 'Put it out?', answers: [{ label: 'Put it out.', sets: LAMPS_WRONG, says: ['You pinch the wick, and the rest flare. The nave fills with wings.'] }] }`, `says: [{ after: { flag: 'lamp_sea' }, lines: ['A lamp on a stand, burning high. The moths have left the Sea lamp for it.'], choice: { ask: 'Put it out?', answers: [{ label: 'Put it out.', sets: 'lamp_shore', says: ['You pinch the wick. Two lamps left, and the moths go to the nearer.'] }] } }]`
  - the House lamp: the same shape, wrong until `lamp_shore`, right sets `lamp_house`: *You pinch
    the wick. One lamp left, and every moth in the nave is on it.*
  - the Hearth lamp: wrong until `lamp_house`, right sets `['lamp_hearth', LAMPS_OUT]`: *You pinch
    the last wick. For a breath the nave is black with wings, and then they go, all together, out
    through the court toward the light.*
  `LAMPS_WRONG` is set by any wrong answer, brings the swarm (`hf_swarm`, §4.4) and is never
  unset; the right order from there on still works, since each right answer waits on the lamp
  before it and not on the wrong flag. A lamp put out stays out (`until` its flag).
- The log: `start: { flag: 'q_lamps' }`, `done: { flag: 'q_lamps_key' }`; entries: *The temple's
  sacristan kept its lamps dark for forty years, for the moths. The Hand lit them. He wants them
  out, in the order the pillar gives.* (on `q_lamps`); *The pillar: FIRST THE SEA. THEN THE SHORE.
  THEN THE HOUSE. LAST OF ALL THE HEARTH.* (on `seen: 'hearthfane:hf_pillars'`: a sign with an id
  is kept by `seen` only when it has `read`; give the pillar `read` with the same text, so a reader
  and anyone else see one text and the id is kept, or key on the Sea lamp's flag instead); *Wrong.
  The others flared and the nave filled with wings.* (on `LAMPS_WRONG`); *The last wick out,
  the moths went, all together, out through the court to the light.* (on `LAMPS_OUT`); *He gave us
  the treasury's key. The grey men's gear in there is nobody's, he says.* (on `q_lamps_key`).
  Goals: *Go back to the sacristan under the vestry table.* (on `LAMPS_OUT`, at `hearthfane`);
  *Put out the four lamps in the pillar's order: the Sea, the Shore, the House, the Hearth.* (changed
  by #795's 8; on `q_lamps`, at `hearthfane`).
- **As built** (Hearthfane, #755): the quest is `lamps` and its ids the plan's: `q_lamps`,
  `q_lamps_out`, `q_lamps_wrong`, `q_lamps_key`, `fane_key` and the lamps' four flags (#755's 3).
  The treasury's door is gated on `fane_key`, not `locked`: it opens to the sacristan's key and to
  no other, and the key is kept (#755's 1). `fane_key` is the *Sacristan's Key*, `slot: 'none'`,
  `price: 0`. The pillar's carving is a `text` and a `read` (§4.4), so the log's pillar entry, keyed
  on `seen`, is a reader's; any company has the order from the goal or by trial (#755's 2). The
  House and Hearth lamps' turn lines follow the Shore's (#755's 6). `meet()` says a matching `says`
  entry without setting the person's `flag`, and the Sea and Shore lamps stand in the first room, so
  a company may put one out before it meets him: the key's entry sets `q_lamps` and the wrong lamp's
  waits on it, so his own words come first and the quest begins on every path (#755's 19). The wrong
  lamp's line says *the rest flare* and the log *The others flared*, and he stands, not *in the
  nave* (#755's 20 and 21). The rest is as written: the sacristan's words, the lamps' answers, the
  log's entries and goals and the 3,000 xp on *Take the key.*

**57. The Pilgrims in the Bowl** (`bowl_pilgrims`, H6, 28). Three pilgrims stranded by the Hand's
landing, one of each claimant's, each with a token to carry down; the company takes one, or none.
Who stands with it on the Stair and at the Heart's door is the Council's verdict first (DESIGN
§10.1, below), and the token where no claimant's verdict carried: no case, a failed one or a
verdict for Wenna or for nobody. None of the three is a step; the token is a piece for its claimant
at the Council, and the fallback for the Stair (§4.7) and the face at the core (§4.8).

- Aelfric, a Warden of the cousin's, at 14,17, `flag: 'q_bowl_pilgrims'`, `until: [{ flag: TOKEN_HOLD }, { flag: TOKEN_TALLIS }]`:
  `lines: ['A Warden in the old grey with the old badge, his sword across his knees, sitting the way Ordgar sits.', '"Sergeant Aelfric, of the Drillyard. The captains sent me over with a pilgrim\'s staff and no orders but one: see what the Regent does on the isle, and come back and say it." He looks at the temple. "I\'ve seen. I can\'t get back."', '"They went down under the temple by a door that opened for them from below. It is open still, they say. Take this down with you." He holds out the old badge. "If the cousin\'s people are to stand anywhere in this, let it be at the bottom."']`,
  `choice: { ask: 'Take the Wardens\' badge down?', answers: [{ label: 'Take it.', sets: TOKEN_COUSIN, gives: 'wardens_badge', says: ['He pins it to your sleeve himself, and his hands are steady.', '"Then we are behind you. Mind the stair."'] }, { label: 'Not ours to carry.', says: ['"No. Fair." He puts the badge away. "I\'ll keep watching the door."'] }] }`,
  `says: [{ after: { flag: TOKEN_COUSIN }, lines: ['Aelfric is at the camp\'s edge, looking at the temple\'s door.', '"The badge. Keep it on your sleeve where they can see it."'] }]`.
- Talwyn, an elf of Henlys, at 18,18, `until: [{ flag: TOKEN_COUSIN }, { flag: TOKEN_TALLIS }]`:
  `lines: ['An elf in Thornhold green gone grey with the isle\'s dust, a seal on a cord at her throat: the treaty\'s mark, the one on the chisel.', '"Talwyn, of Henlys. The hold sent me to see the Hearth with the eldest\'s seal, and say to it what the treaty says: that the lines were one." A small laugh. "It did not answer. Then the grey men came, and went in under it, and now there is nobody to say it to but you."', '"Carry the seal down. Whatever is at the bottom, let it see the elves\' mark."']`,
  `choice: { ask: 'Take the hold\'s seal down?', answers: [{ label: 'Take it.', sets: TOKEN_HOLD, gives: 'treaty_seal', says: ['She lifts the cord over her head and puts it over yours.', '"Say it for us, at the bottom. The lines were one."'] }, { label: 'Not ours to carry.', says: ['"Then I will say it to the column until it answers." She turns back to the light.'] }] }`,
  `says: [{ after: { flag: TOKEN_HOLD }, lines: ['Talwyn sits facing the column with her hands in her lap.', '"The seal. Let the door see it."'] }]`.
- Pasco, a Compact hand of Tallis's, at 14,19, `until: [{ flag: TOKEN_COUSIN }, { flag: TOKEN_HOLD }]`:
  `lines: ['A man in a good coat gone to rags, a tally-stick in his hand notched to the top. He counts you before he speaks.', '"Pasco. I count for Tallis. He sent me over on the last honest boat to count what the Regent takes off this isle, and the answer so far is everything, and the boat went back without me."', '"Here." The tally-stick. "Tallis\'s mark is on the butt. Whoever comes up out of that hole with it is Tallis\'s, in the Council\'s eyes and in his, and he pays for what he counts."']`,
  `choice: { ask: 'Take Tallis\'s tally down?', answers: [{ label: 'Take it.', sets: TOKEN_TALLIS, gives: 'tallis_tally', says: ['He notches it once more, for you, and hands it over.', '"He remembers what he pays for. He\'ll remember this."'] }, { label: 'Not ours to carry.', says: ['"Suit yourselves. He pays either way, and he\'ll know who didn\'t."'] }] }`,
  `says: [{ after: { flag: TOKEN_TALLIS }, lines: ['Pasco is counting the moths over the Bowl, and losing count.', '"Keep the stick dry."'] }]`.
- The claimant's captain on the Stair's first landing (§4.7), at 15,27, `after: HELD`, one person
  with six `says`, the first that holds said: the three verdicts first and then the three tokens,
  so a verdict that carried outranks a token carried for another claimant:
  - with `q_throne_cousin`: `lines: ['A Warden captain on the landing with six of the Drillyard\'s behind her, the Hand\'s rearguard dead at their feet.', '"The Council\'s word came over with us: the cousin\'s people hold the stair for the company. We came in by the door that opened, and we\'ll hold it till you\'re back up."']`;
  - with `q_throne_hold`: `lines: ['Elves of Henlys on the landing, their bows strung, and the Hand\'s rearguard dead at their feet.', '"The hold sent us when the Council read the treaty. We hold this landing, and we do not go down: what is at the bottom was never ours."']`;
  - with `q_throne_tallis`: `lines: ['Compact hands on the landing, a dozen, the Hand\'s rearguard dead at their feet and their packs already open.', '"Tallis has the chair, and we\'ve been paid to hold this for you. What comes up out of that door with you is his, mind: the ring most of all."']`;
  - with `TOKEN_COUSIN`: `lines: ['A Warden captain on the landing with six of the Drillyard\'s behind her, the Hand\'s rearguard dead at their feet.', '"Sergeant Aelfric\'s badge. Then you\'re the ones. We came in by the door that opened and held this landing for you; we\'ll hold it till you\'re back up. The captains will want it said in Helmstow that the Wardens were here."']`;
  - with `TOKEN_HOLD`: `lines: ['Elves of Henlys on the landing, their bows strung, and the Hand\'s rearguard dead at their feet. Their leader looks at the seal on your chest.', '"Talwyn\'s. Then say it at the bottom for all of us. We hold this landing, and we do not go down: what is at the bottom was never ours."']`;
  - with `TOKEN_TALLIS`: `lines: ['Compact hands on the landing, a dozen, the Hand\'s rearguard dead at their feet and their packs already open. Their master looks at the tally-stick.', '"Tallis\'s. Then we\'ve been paid to hold this for you, and we have. What comes up out of that door with you is his, mind: the ring most of all. He said so. He said you\'d know what he meant."']`
  (a hinder: 64's gate choice has an answer for Tallis, and his man stands at the Heart's door
  once Vask has fallen, until an ending, to say the ring is his and that he will be told where else
  it goes, §4.8).
- The log: `start: { flag: 'q_bowl_pilgrims' }`, `done: [...HELD, { slain: 'underdeep2:ud2_rearguard' }]`
  (a token or a claimant's verdict, which takes the rearguard off the landing, or else the
  rearguard slain);
  entries: *Three pilgrims in the Bowl, stranded by the Hand's landing: a Warden of the cousin's,
  an elf of the hold's, a hand of Tallis's. Each wants their token carried down.* (on
  `q_bowl_pilgrims`); *We carry the Wardens' badge. The cousin's people will stand at the bottom.* (on
  `TOKEN_COUSIN`), and the same for the seal and the tally; *We carried none of them. Whoever stands
  at the bottom, it is us.* (on the rearguard slain with no token). Goals: *Carry the token down
  the stair under the temple.* (on a token, at `underdeep2`); *Choose whose token to carry down, or
  none.* (on `q_bowl_pilgrims`, at `hearthisle_h6`).
- **As built** (H6, #753): the quest is `bowl_pilgrims` and its met flag `q_bowl_pilgrims`, set by
  any of the three pilgrims; the plan's `pilgrims` and `q_pilgrims` are Rimewater's 44 (§9.2, #753's
  1 and 2). Its `done` was `HELD` until the Stair, the three claimants' verdicts and the three
  tokens, with an entry for each token. The rearguard slain, the "carried none" entry and the goal
  at `underdeep2` were #758's (#753's 3).
- **As built** (the Stair, #758): `done` is the three verdicts, `seen: underdeep2:ud2_held` and
  `slain: underdeep2:ud2_rearguard`, not `HELD`: with the tokens in `done`, the goal on a token,
  *Carry the token down the stair under the temple.*, could never come up, and
  `tools/tests/quests.ts` failed it. A token ends the quest when its people are seen holding the
  first landing; a verdict ends it as before; with neither, the rearguard slain ends it on *We
  carried none of them.* The captain's six `says` are in `HELD`'s order (#758's 4 and 6). H6's
  walkthrough line that asserted a token alone did the quest now asserts the goal down the stair.

**58. A Letter for Gullwick** (`letter`, the Stair and Gullwick, 29). Among the Hand's dead a
champion with a letter home; it is an item read from the pack; on the walk home it is given to a
mother two doors from Hild's.

- The chest `ud2_letter_chest` (§4.7) holds `gullwick_letter`, an item with text: *To my mother,
  at the third house from the slip. We are on the isle. The grey men say the door opens tomorrow,
  and after that everything is different, and I will come home then and explain. I was never
  cargo. I chose this. Tell Wenna's mother I saw her girl, and she is well, and she is not afraid,
  which is more than I am. Your son, Jowan.*
- Jowan's mother at Gullwick, on `downs_f3` at 10,13, the sand at the door of the cottage at 10,12,
  two doors from Hild, `after: ENDED`, a hand-in:
  `{ kind: 'npc', x: 10, y: 13, name: 'Jowan\'s mother', after: ENDED, lines: ['A woman at her door in the third house from the slip, her arms folded, watching Hild on the shingle and not going down.', '"Mine went too. Not taken. Went. There\'s no knot for that."'], quest: { item: 'gullwick_letter', reward: 0, setFlag: 'q_letter_given', done: ['She reads it standing, twice, and folds it into her apron.', '"He chose it. Well. He never could stand to be fetched." She looks at the shingle, where Hild is. "I\'ll go down, then. In a bit."'] } }`.
- The log: `start: { item: 'gullwick_letter' }`, `done: { flag: 'q_letter_given' }`; entries:
  *A champion of the Hand died on the stair with a letter home under his hands. He was a Gullwick
  boy, Jowan, and he chose it.* (on the item); *His mother read it at her door, twice, and went
  down to the shingle after.* (on `q_letter_given`). Goal: *Take Jowan's letter to his mother at
  Gullwick, the third house from the slip.* (at `downs_f3`).
- **As built** (the Stair, #758): the quest is `letter` and the item `gullwick_letter`, *Letter for
  Gullwick*, in `ud2_letter_chest` on `ud2_letter`'s square (15,21), as the brief has it. The
  item's text is a line of what it is (*A letter sealed with a knot of rope, the seal Gullwick's.*)
  and the brief's words in two quoted paragraphs (#758's 12). The hand-in is #765's, built:
  Jowan's mother at Gullwick takes the letter and sets `q_letter_given`.

**59. Every Frame She Marked** (`frames`, the Ways and the Stair, 30). No giver: a thing found.
The eight frames' knots are once-events (§4.6); the eighth's words are the hatch's hint; the hatch
is the unwatched way onto the Stair below its fights; the last frame before the foot carries her
name (§4.7).

- The log: `start: { seen: 'underdeep:ud_knot1' }`, `done: { seen: KNOT_LAST }`; entries: *Her
  knot on the first frame below the crypt, at a girl's shoulder. We can follow every one.* (on
  `ud_knot1`); *On the eighth frame the knot is cut deeper, and the wall behind it is thin. We can
  hear the stair through it.* (on `ud_knot8`); *A crawl way behind the frames, a knocker's height,
  down onto the stair below its fights.* (on `seen: 'underdeep:ud_hatch'`); *On the last frame, not
  the knot. Her name.* (on `KNOT_LAST`). Goals: *Follow her knots down to the last frame before the
  foot of the stair.* (on `ud_knot8`, at `underdeep2`); *Follow her knots through the ways, frame
  by frame.* (at `underdeep`).
- **As built** (the Ways, #757): the quest is `frames`, with the entries on `ud_knot1`, `ud_knot8`
  and `ud_hatch` and the goal at `underdeep`. Its `done` was `[]` until the Stair:
  `seen: KNOT_LAST` names `underdeep2`, which failed `tools/tests/quests.ts` until that was built.
  The last frame's entry, the goal at `underdeep2` and the `done` were #758's (#757's 8). The
  quest begins on `ud_knot1` only: a company that takes the east way first reads *Her knot again*
  on the second frame before the first.
- **As built** (the Stair, #758): the entry on `KNOT_LAST` (`ud2_word`, 16,6), the goal at
  `underdeep2` on `ud_knot8` and `done: { seen: KNOT_LAST }`, as the brief has them.

**60. Crew Only, From the Inside** (`crew_only`, the Ways and the Deep Mines, 30). The door that
would not open under the Kilns has another side, and opens from it: a way, not a lock (EXPANSION
§2.2). The company stands in the Tiefzeche's lowest level with the door open behind it. Leave it
open, and knockers come up into the mines; shut it, and they do not.

- The door at 2,10 on `underdeep`, a person with no face, `until: [{ flag: CREW_OPEN }, { flag: CREW_SHUT }]`:
  `lines: ['The door\'s inner face: a bar across it, and a handle, and the dust of hundreds of feet before it. From this side it is only a door.']`,
  `choice: { ask: 'Open it?', answers: [{ label: 'Open it, and leave it open.', sets: CREW_OPEN, pay: { xp: 2000 }, says: ['The bar comes up and the door swings out onto the Tiefzeche\'s lowest level, where the footprints began. The hum goes out through it into the mine.', 'You leave it standing open. Behind you, something knocks, and comes to look.'] }, { label: 'Open it, go through and shut it.', sets: CREW_SHUT, pay: { xp: 2000 }, says: ['The bar comes up and the door swings out onto the Tiefzeche\'s lowest level, where the footprints began.', 'You go through, and pull it to behind you, and it is a wall with a door drawn on it again. The hum stops at it.'] }] }`.
  Either answer, the exit at 2,10 is there `after: [{ flag: CREW_OPEN }, { flag: CREW_SHUT }]`:
  `{ x: 2, y: 10, to: 'deep_mines3', tx: 13, ty: 3, tf: WEST, label: 'Through the door marked CREW ONLY, from the inside, into the Tiefzeche\'s lowest level.' }`,
  landing on the floor before the door, facing down the corridor (an exit with `after` is a presence
  the systems lane adds to `Exit`, §9, call 9; until then the exit is there from the start and the
  choice is the door's words only). `Exit.after` is read as an appearance, as a presence is, so
  pillars' `findLocks` (`tools/tests/pillars.ts`) does not count it, and this exit is no lock
  between the areas: it waits on nothing from anywhere else, only on the company's own answer at
  the door it stands in, and the Kilns are reached by their own road whichever way it is answered.
  The mines' side stays as built (`deep_mines3`'s `Z` at 14,3, with `dm3_door` on the floor before
  it at 13,3): a wall with a door drawn in it, which opens for nobody the company has. One way.
- The road behind (§12): on `deep_mines3`, a group of three of the Kilns' own knockers (`knocker`,
  level 16, within two of the Clean Corridor's band of 17–18) at 6,3 in the corridor, `after: { flag: CREW_OPEN }`,
  `respawn: 2880`, with `look` *They came up through the door you left open.* The builder places
  them so the map's groups still rise from the way in, and measures the Kilns' lead over the road
  again (`OVER_ROAD.kilns`, `tools/tests/curve.ts`): a few or none, and no Act V monster. And a line for
  Anvilhall's thane, `after: { flag: CREW_OPEN }`: *"Knockers in the Tiefzeche's lowest level, up
  through the door that never opened. My miners say it stands open now. I do not ask who opened
  it."*
- The log: `start: { seen: 'underdeep:ud_feet' }`, `done: [{ flag: CREW_OPEN }, { flag: CREW_SHUT }]`;
  entries: *The door marked CREW ONLY has another side. From here it is only a door, with a bar
  and a handle.* (on `ud_feet`); *We opened it onto the Tiefzeche's lowest level and left it open.
  Something came to look.* (on `CREW_OPEN`); *We opened it, went through and shut it behind us. A
  wall with a door drawn on it again.* (on `CREW_SHUT`). Goal: *Open the door marked CREW ONLY
  from the inside, and decide whether to shut it.* (at `underdeep`).
- **As built** (the Ways, #757): the quest is `crew_only` and its flags the plan's, `q_crew_open`
  and `q_crew_shut`. The door is a door square with the person on it, and the exit there is `after`
  either answer (#757's 6). The shut answer's label is *Go through and shut it.*: the brief's *Open
  it, go through and shut it.* runs past a line of the side panel (`tools/tests/people.ts`). Its
  words are the brief's, so the company is still in the Ways until it steps onto 2,10, though they
  say it went through.

**61. The Knocker That Stopped** (`crack`, the Ways, 30). A deep knocker stands still at a wall,
the first crack it has found in four hundred years: the Sunder, from the other side. Help it seal
the crack, and the Sunder's beasts stop coming; widen it, and behind it is what the Sunder
swallowed, a Lanterns' hall of the old kind, with a lamp in it that is the staff of §8.

- The knocker at 29,6, a person, `until: [{ flag: CRACK_SEALED }, { flag: CRACK_WIDE }]`:
  `lines: ['The knocker stands with its hammer raised over the crack, and has stood so, by the dust on it, for a long time. It has found the thing it was made to find, and it does not know what to do.', 'Its light goes over the crack, and over you, and back to the crack.']`,
  `choice: { ask: 'Its hammer waits. Seal the crack with it, or widen it?', answers: [{ label: 'Seal it.', sets: CRACK_SEALED, pay: { xp: 4000 }, says: ['You hold the plate to the crack and the hammer comes down, and down, and the daylight the colour of glass goes out of it a blow at a time.', 'The knocker lowers its hammer, and its light goes dim, and it stands there. It is finished. Far above you, in a split wood, something stops coming.'] }, { label: 'Widen it.', sets: CRACK_WIDE, gives: 'old_lanterns_staff', pay: { xp: 4000 }, says: ['Blade and hammer together, and the wall comes away in a sheet.', 'Behind it, a Lanterns\' hall the Sunder swallowed, and on its lectern a staff with a lamp in its head, still lit. You take it.'] }] }`.
- The road behind (§12): the Sunder's groups on Sunderwood's maps gain `until: { flag: CRACK_SEALED }`
  by the leave rule (their ids are Sunderwood's; the issue names them), and Lantern Watch's hall
  gains a line, `after: { flag: CRACK_SEALED }`, on Hester Dunmore, Reader of the Watch
  (`lantern_watch.ts`, 5,5): *"The Sunder's beasts have stopped. The wall at the bottom is warm in
  one place, the surveyor says, and nothing comes out of it now."*
- The log: `start: { seen: 'underdeep:ud_crack' }`, `done: [{ flag: CRACK_SEALED }, { flag: CRACK_WIDE }]`;
  entries: *A deep knocker stands still at a crack in the wall, the first it has found in four
  hundred years. Through the crack, daylight the colour of glass: the Sunder, from below.* (on
  `ud_crack`); *We sealed it with its hammer. Its light went dim, and far above, something stopped
  coming.* (on `CRACK_SEALED`); *We widened it. Behind the wall, a hall the Sunder swallowed, and
  on its lectern a lamp on a staff, still lit.* (on `CRACK_WIDE`). Goal: *The knocker's hammer
  waits at the crack: seal it, or widen it.* (at `underdeep`).
- **As built** (the Ways, #757): the quest is `crack` and its flags the plan's, `q_crack_sealed` and
  `q_crack_wide`. The knocker is a person with no face (#757's 7), and the staff it gives is
  `old_lanterns_staff` (#757's 9). The sealed knocker *stands there* in its words but goes with its
  `until`, as the brief has it.

**64. The Signet** (`signet`, the Core and after, 32). Wenna puts the ring in the company's hand
(every answer gives it, §4.8), and after the choice it is still there. At Helmstow's gate the
Council's clerk asks where it goes; at Gullwick the sea is there to take it; and Wenna does not
want it. The Council sits on it with everything else (below).

- The clerk at Helmstow's gate, on `shelf` at 15,4, the grass beside the road before the gate (16,4
  is the start square, with its sign), `after: ENDED`, `until: [{ flag: 'q_signet_cousin' }, { flag: 'q_signet_hold' }, { flag: 'q_signet_tallis' }, { flag: 'q_signet_sea' }]`:
  `{ kind: 'npc', x: 15, y: 4, name: 'Wiglaf, the Council\'s clerk', after: ENDED, lines: ['The Council\'s clerk at the gate, with his book, as if he had been waiting there since the light came back.', '"The Queen\'s signet. The Council is told you have it. The Council would like, very much, to know where it goes."'], choice: { ask: '"Three claimants, and a Council that counts on its fingers. Or you keep it, and we count without it."', answers: [{ label: 'To the cousin.', takes: 'queens_signet', sets: 'q_signet_cousin', says: ['He takes it in a cloth, as if it were hot.', '"The Wardens\' candidate. The Council will sit on it within the week."'] }, { label: 'To the hold.', takes: 'queens_signet', sets: 'q_signet_hold', says: ['He takes it in a cloth, and looks at the seal on it, and at the mark on the seal.', '"The elves\' claim. The treaty\'s mark, and this one. The Council will sit on it within the week."'] }, { label: 'To Tallis.', takes: 'queens_signet', sets: 'q_signet_tallis', says: ['He takes it in a cloth, and does not look at it at all.', '"The dockmaster. He has a hundred and forty hulls and now this. The Council will sit on it within the week, if it can find a week."'] }, { label: 'We keep it.', says: ['"Then the Council counts without it." He shuts the book. "It has done so before."'] }] } }`.
  Once the Council has sat (any of the six verdict flags, below), a `says` entry with that `after`
  puts the same four answers, and each of the three that gives the ring has the clerk's second line
  in place of the sitting he promised: *"The Council has sat, and does not sit twice. It goes into
  the chair's keeping."*
- The sea at Gullwick, on `downs_f3` at 9,15, the tideline, `after: ENDED`, a person with no face:
  `{ kind: 'npc', x: 9, y: 15, name: 'The sea off Gullwick', after: ENDED, until: { flag: 'q_signet_sea' }, lines: ['The sea off Gullwick, where the boat went out the night the light failed. It gives nothing back.'], choice: { ask: 'Throw the ring in?', answers: [{ label: 'Throw it in.', takes: 'queens_signet', sets: 'q_signet_sea', says: ['It goes in without a sound. Hild, on the shingle, does not look round, and the girl beside her does.', '"Good," she says.'] }, { label: 'Keep it.', says: ['The sea goes on giving nothing back.'] }] } }`
  (an answer with `takes` is barred to a company without the ring, which is the choice's own
  words then: §4.8's `Answer`).
- Wenna at Gullwick (the road behind, §5): her lines refuse it: *"Don't give it to me. I'm not
  anyone's key. I said."*
- The log: `start: { item: 'queens_signet' }`, `done: [the four flags]`; entries: *The Queen's
  signet, in our hands. Everyone on the road wanted it, and the one it opened doors for does not.*
  (on the item); *It went to the cousin, in a cloth.* and the like (on each); *It went into the sea
  off Gullwick, where the boat went out. Good, she said.* (on `q_signet_sea`). Goals: *Where the
  ring goes: the Council's clerk waits at Helmstow's gate, and the sea off Gullwick is where the
  boat went out.* (at `shelf`).
- **As built** (the Heart, #759): the quest is `signet` and the item `queens_signet`, *Queen's
  Signet*, with the text given in §8, read from the pack; every answer at the panel gives it. The
  log is keyed on the item and the four `q_signet_*` flags, its "and the like" written *It went to
  the hold, in a cloth.* and *It went to Tallis, in a cloth.* Its goal is at `shelf`. The clerk
  and the sea are #765's, both built: the clerk at Helmstow's gate sets three of the four flags (half
  A) and the sea at Gullwick `q_signet_sea`, once Wenna is home; `UNSET` (`tools/tests/quests.ts`)
  owes none of them, nor the endings' three, which Wenna's answers set (#759's 10).

**The Walk Home** (`walk_home`, after the ending). The chapter is done on the choice (§5), so the
walk is a quest of its own, begun on any ending and done on Hild's words. `start: ENDED`, `done: { flag: WENNA_HOME }`;
entries: *In the spring we walk her home to Gullwick, along the coast road.* (on `ENDED`);
*Helmstow's gate stood open as we passed, and nobody at it said a word about who went through.*
(on `seen: 'shelf:gate_open'`, the road behind's once-event on the road before the gate at 16,5,
`after: ENDED`: *The gate stands open, and the sergeant at it looks at every one of you and says
nothing at all.*); *Her mother was on the shore where we left her, as if she had never moved. This
time, she cried.* (on `WENNA_HOME`). Goals: *Along the coast road to Gullwick, to the shore where
her mother stands.* (at `downs_f3`). Wenna moves with it: at the Core with her words after the
ending until Hild has said hers (`until: { flag: WENNA_HOME }`, §4.8), and then on Gullwick's
shingle at 11,15 (`after: { flag: WENNA_HOME }`, the road behind), beside Hild, who says the last
words:
- Hild's `says` gains, first: `{ after: ENDED, until: { flag: WENNA_HOME }, sets: WENNA_HOME, lines: ['Hild is standing on the shore where you left her, as if she had never moved. She sees who is walking behind you, and does not move then either, not for a long moment.', 'This time, she cries.'] }`
  and after: `{ after: { flag: WENNA_HOME }, lines: ['Hild on the shingle with the rope in her hands and her girl beside her, untying the knots one at a time, and telling her what each day was.', '"It is going to take till summer. Sit down."'] }`.
- Wenna on the shingle, at 11,15, the sand beside Hild (10,14 is Wat's elder boy's): `{ kind: 'npc', x: 11, y: 15, name: 'Wenna', after: { flag: WENNA_HOME }, lines: ['Wenna on Gullwick\'s shingle with her mother\'s rope across her knees, a knot undone for every day, and the nail still in her fist.', '"Don\'t give it to me. I\'m not anyone\'s key. I said." She looks at the sea. "Thank you for walking me."'] }`:
  the one place her name is a person's, since her mother has said it.

**The Cleric's third: The Eleven Kept** (`eleven_kept`, Anchorhold and the crypt; the ask at 27,
the deed at the crypt's 29). Hereswith, the anchoress walled into Anchorhold (I6, §4.3), asks a
cleric of 27 with the second to bring her the Crowness keeper's log of the eleven, and then to go
down into the temple's first crypt alone, the company without her, and keep the eleven there in
the gaps he wrote, while she keeps the hour at the top. The log is taken at the hand-in (the
Bard's gathering reads the log's chest, not the item, so nothing breaks); the deed is `hf2_eleven`
(§4.5; built with the crypt in #756); back at the window she teaches. Built in #763.

- `{ kind: 'npc', x: 4, y: 19, name: 'Hereswith, the anchoress', lines: ['A voice from the window in the bricked-up door, and a face behind it, old, and lit from the side by the column. She says the hour before she says anything else.', '"Hereswith. I was walled in here at thirty to keep the hour against the light, and I have kept it fifty years, and the light has kept it with me, mostly." A pause. "Not the night the Queen died. That night it kept its own."', '"Eleven. I counted from here. I should like to know whether anyone else did."'], flag: 'i6_anchoress_met', quest: { item: 'keepers_log', reward: 0, setFlag: LOG_GIVEN, early: ['She reads it at the window, holding it to the light, and reads it again.', '"Crowness. A grace between each, the pairs even. Yes. He counted what I counted." She keeps it. "Now I know."'], done: ['She reads it at the window, holding it to the light, and reads it again.', '"Crowness. A grace between each, the pairs even. Yes. He counted what I counted." She keeps it. "Now there are two of us, and the gaps are written down."', '"Go down into the fane\'s crypt. Eleven lamps stand there for the eleven, cold since that night. Light them as he wrote them, the gaps and all, and I will keep the hour up here while you do. Not with you: I keep the top. That is what an anchorhold is for."'] }, says: [
    { after: { flag: ELEVEN_KEPT }, lines: ['The hour, from the window, and then: "The hum changed key an hour ago, and held. That was you."', '"Fifty years I thought the hour was mine to keep. It was the light\'s. Come to the window, Prelate, and I will show you what an Exarch keeps."'] },
    { after: { flag: LOG_GIVEN }, lines: ['The hour, from the window. "Eleven lamps, in the crypt under the fane. The gaps are in the book. Go on down; I have the top."'] },
    { after: { flag: 'i6_anchoress_met', member: { cls: 'cleric', level: 27, prestige: 2 } }, until: { flag: LOG_GIVEN }, sets: 'q_eleven_asked', lines: ['She looks a long while at your cleric through the window.', '"You have the Prelate\'s look. There is a keeper at Crowness Light, on the far shore of everything, who counted the eleven the night the Queen died and wrote the gaps down. Bring me his log, and we will see whether we counted the same."'] },
  ], teaches: { cls: 'cleric', prestige: 3, asks: 'eleven_kept', done: { flag: ELEVEN_KEPT }, seek: 'Hereswith, the anchoress walled into Anchorhold on Hearth Isle\'s east rim, keeps the hour against the light, and can make an Exarch of a Prelate.' } }`.
  A hand-in takes its item at the first meeting (EXPANSION §2.3): a company that brings the log
  before the ask hears `early`, and the ask is then never said, since it is `until` the hand-in's
  flag; the deed and the teaching key on the flags whichever came first, and the log starts on
  either, the log given only for a cleric of 27 with the second (the hand-in takes it from any
  company, §9.2, #763's 9).
- The log: `start: [{ flag: 'q_eleven_asked' }, { flag: LOG_GIVEN, member: { cls: 'cleric', level: 27, prestige: 2 } }]`, `done: { member: { cls: 'cleric', prestige: 3 } }`;
  entries: *The anchoress walled into Anchorhold counted the eleven the night the Queen died, and
  wants the Crowness keeper's log, to see if he counted the same.* (on `q_eleven_asked`); *He did.
  She keeps the book now, and sent us down into the fane's crypt to light the eleven lamps there in
  his gaps, while she keeps the top.* (on `LOG_GIVEN`); *We lit the eleven in the crypt, a grace
  between each. On the eleventh the hum changed key, and held.* (on `ELEVEN_KEPT`). Goals: *Back up
  to the anchoress's window at Anchorhold.* (on `ELEVEN_KEPT`, at `hearthisle_i6`); *Down into the
  crypt under Hearthfane, and light the eleven lamps as the log has them.* (on `LOG_GIVEN`, at
  `hearthfane2`); *Bring the Crowness keeper's log to Hereswith at Anchorhold.* (on
  `q_eleven_asked`, at `hearthisle_i6`, and the log is in E3's chest under Crowness Light,
  `downs_e3:e3_log`).
- **As built** (the rim and the crypt, #763): Hereswith is in `hearthisle_i6.ts` and the log in
  `quests.ts`, her lines and the log's words §6's; `hf2_eleven` stands as #756 built it. I6 imports
  `LOG_GIVEN` and `ELEVEN_KEPT` from the crypt (#756's 6) and exports the ask's flag as `KEPT_ASKED`
  (#763's 1). The ask is said until the log is in (#763's 3), and the log brought first begins the
  journal on `LOG_GIVEN` for a cleric of 27 with the second and for no other company (#763's 4 and
  9). The Hearth's walkthrough plays both roads (`elevenKept`): the ask first, and the log before
  the ask, which is heard `early` and never asked; then a cleric of 27 with the first only, one of 26
  with the second and none, who hear her words again and are shown no journal.

### The subplots' ends

**The Empty Throne: the Council of Helmstow** (`council`, Helmstow's keep; DESIGN §10.1). The
subplot's end, and the one way to remove Vask from Helmstow before the Core (§9, call 10). The
Council's clerk, Wiglaf, stands at the chapel's door in the keep's ward (`keep` at 4,6) once the
Hand has Wenna and Helmstow is Vask's again (`after: { flag: 'q_wenna_taken' }`, #449), and puts
the case once; the verdict reads what the company carried there, and the signet, if the Council
has it (64). Whoever wins changes Helmstow for the rest of the game, decides who holds the Stair's
first landing and who stands at the Heart's door (§4.7, §4.8) and thins the Hand on the isle,
since Vask has gone to it with fewer behind him (`q_throne_removed`, which every verdict but a
failed case sets).

The pieces, all built on the road, each a flag the save holds:

| For | Pieces (any two carry the case; the signet given to the claimant counts as two) |
|---|---|
| the cousin | `q_riders_hale` (6: the captain's letter to Hale, Wardens riding dark to the barrow), `q_seal_hale` (7: the clerk's seal beside the ledger), `q_well_lanterns` (3: the Chapel's record of the works under the keep), `q_token_cousin` (57) |
| the hold | `q_treaty` or `q_sylvane_treaty` (16, 11: the treaty and its older mark), `q_ring_elves` (38: the bog body's ring, given to the elves), `q_orders_council` (14: the survey orders kept for the Council), `q_token_hold` (57) |
| Tallis | `q_star_tallis` (24), `q_crown_sailed` (35: Tallis owes the company), `q_hermit_tallis` (26: the founder's letter sold him), `q_ring_sold` (38), `q_token_tallis` (57) |
| Wenna | `q_wenna_up` (Act III: she led them up; the Council has heard of her) and one of `q_wentback_witness` (41: the witness at the Lodge), `q_sleepers_seen` (Act III's end), `q_wenna_home` (the walk home) |
| nobody | always |

- Wiglaf at the keep: `{ kind: 'npc', x: 4, y: 6, name: 'Wiglaf, the Council\'s clerk', after: { flag: 'q_wenna_taken' }, until: [{ flag: 'q_case_cousin' }, { flag: 'q_case_hold' }, { flag: 'q_case_tallis' }, { flag: 'q_case_wenna' }, { flag: 'q_case_nobody' }], flag: 'q_council_met', lines: ['A thin man at the chapel door with a book under his arm and ink on his cuff, who looks at the keep\'s great door the way a man looks at weather.', '"Wiglaf. Clerk to the Council of Helmstow, which sits when the Regent lets it and counts on its fingers when he does not. The chair is empty. The Council would settle it tomorrow, if anyone brought it a case it could not refuse."', '"A chartered company goes everywhere, and hears everything. Bring the Council what you have heard, and name a claimant, and it will sit on it. Once. It is not brave enough for twice."'], choice: { ask: '"Whose case does the company make?"', answers: [{ label: 'The Queen\'s cousin.', sets: 'q_case_cousin', says: ['"The Wardens\' candidate. Blood, which is what the Council likes and the Regent does not." He writes it. "It sits tonight."'] }, { label: 'The elves of Henlys.', sets: 'q_case_hold', says: ['"The treaty. The Council has not read it in two hundred years, and the Lanterns have." He writes it. "It sits tonight."'] }, { label: 'Jory Tallis.', sets: 'q_case_tallis', says: ['"The dockmaster. A lineage in one shade of ink, and a hundred and forty hulls." He writes it. "It sits tonight."'] }, { label: 'Wenna of Gullwick.', sets: 'q_case_wenna', says: ['"A fisher\'s girl." He stops writing. "Whom the Council has heard of, lately, from people who came up out of the ground. It sits tonight, and I do not know what it will say."'] }, { label: 'Nobody.', sets: 'q_case_nobody', says: ['"Nobody. The chair stays empty, under the Council\'s own seal, and the Regent holds it for nobody." He writes that too. "It sits tonight. That is a case, of a kind."'] }] } }`.
  The case for Wenna is offered only once `q_wenna_up` holds: the answer is in a second `says`
  entry with `after: { flag: ['q_council_met', 'q_wenna_up'] }` that puts the five answers, and the
  first meeting's choice puts four.
- The Council sitting, a once-event in the chapel at 4,5 the morning after (`keep`), `after` the
  case flag, one text per outcome, each `sets` its verdict; the first that holds is said and the
  rest are gone (`until` the verdict flags). For each claimant, one event per carrying pair is too
  many: write the carrying `after` as a list of the pairs (a `When` is any one of its lists, each a
  list of flags that must all hold), one event for the carried case and one for the failed:
  - the cousin, carried (`sets: ['q_throne_cousin', 'q_throne_removed']`): *The Council sits in the
    chapel where she lay in state and reads what you brought. By noon the Wardens wear the old
    badge. The Regent is not in the keep when they come for him.*
  - the hold, carried (`q_throne_hold`, `q_throne_removed`): *The Council reads the treaty aloud for
    the first time in two hundred years. By evening Sylvane's people are in the ward. The Regent is
    not in the keep when they come for him.*
  - Tallis, carried (`q_throne_tallis`, `q_throne_removed`): *The Council counts hulls. Tallis comes
    up the Salt Road with a hundred Compact hands and his lineage in a case. The Regent is not in
    the keep when they come for him.*
  - Wenna, carried (`q_throne_wenna`, `q_throne_removed`): *The Council sits a long time, then seals
    the chair for a girl from Gullwick until she comes to it. The Regent is not in the keep when
    they come for him.*
  - nobody (`q_throne_council`, `q_throne_removed`): *The Council seals the chair empty under its
    own seal and holds Helmstow itself. The Regent is not in the keep when they come for him.*
  - failed (`q_case_failed`, any case whose pairs do not hold): *The Council sits, and reads what
    you brought, and is not persuaded. The Regent holds the keep. Wiglaf says it was never brave
    enough for twice.*

  Each carried verdict is `until: [{ flag: END_REIGNITE }, { flag: END_FINISH }]` and has a twin
  `after` the same two endings, its last sentence *Vask stands before the Council in irons.* in
  place of the Regent's absence, since those endings bring him up the stair in irons (§12, the
  keep); after the hull is opened he is gone from the world, and the first texts stay true. The
  failed verdict is `until: ENDED`, with one twin `after: ENDED`: *The Council sits, and reads what
  you brought, and is not persuaded. The chair stays empty. Wiglaf says it was never brave enough
  for twice.*
- Helmstow after the verdict (the road behind, §9): Vask gone from the keep (`until: { flag: 'q_throne_removed' }`
  on his person and his guards, and `until: { visited: 'hearthisle_h6' }` as well, since by then
  he is at the panel, §12, with his steward's line in his place); #449's gibbet presences gone with
  him (`until: { flag: 'q_throne_removed' }`); the proclamation's sign twinned (*The Council of
  Helmstow holds the city under its seal.* and the claimant's name where there is one); the inn's
  price back to 12 (`after` the verdict, as its dearer twin is `after: { flag: 'q_salt_done' }`);
  the curfew's Warden by the Eel's door gone; the gate's shut lifted for orcblood (§9, call 9's
  `lifts`); the Eel's talk by
  verdict (`says`, the first that holds): cousin, *A Warden, loud, with the old badge on: "The
  cousin sits in the chair and the Regent sits in a cell, and I was on the wall for both."*; hold,
  *A fisherman: "An elf on Helmstow's chair, and the treaty read out on the keep steps. My
  grandfather said it was so and we laughed at him."*; Tallis, *A dockhand: "Tallis sailed in with
  his hulls and the Council counted them. Prices are a port's now. So is the gate."*; Wenna, *A
  fisherman, quiet: "The chair's kept for a girl from Gullwick nobody has seen. They say the doors
  know her. I don't know what that means and nor does the Council."*; council, *A Warden: "The
  Council holds the city under its own seal and nobody is in the chair. It is the quietest Helmstow
  has been in a year."*. Shops: the Chapel's door open again for the hold (its shut `until` the
  verdict) and the stores dearer for Tallis (Mottram's twin at a port's prices); nothing for the
  cousin, Wenna or the Council but the gate and the Eel's talk, since a trainer has no price to
  restore (`{ kind: 'trainer', maxLevel }`).
- The log: `start: { flag: 'q_council_met' }`, `done: [the six verdict flags]`; entries: *The
  Council of Helmstow will sit once on a case a company brings it, and name the chair's claimant,
  or nobody.* (on `q_council_met`); *We made the case for the cousin.* and the like (on each case);
  *The Council sat, and the cousin sits in the chair. The Regent was not in the keep when they
  came for him.* and the like (on each verdict); *The Council sat, and was not persuaded. Vask
  holds the keep.* (on `q_case_failed`). Goals: *Come back to the keep's chapel in the morning,
  when the Council has sat.* (on a case, at `keep`); *Make the Council's case at the keep's chapel:
  the cousin, the hold, Tallis, the girl from Gullwick or nobody.* (at `keep`).

**The Salt Compact** (DESIGN §10.2), ended at the Keel (#697): nothing new is asked. What the
company chose shows on the isle: with the Compact taken over (`q_compact_over`) the last crossing
costs it nothing (`free` on both ends, `src/content/crossings.ts`) and a Compact runner waits on
the strand at 23,30, `after: { flag: 'q_compact_over' }`: *"Partner. The boat is yours, both ways,
for as long as you need it. The Compact's orders come from you now, and the first one was that."*
and, as the Compact's one spy's word, a second line: *"A word from the boats, since words are ours
now: the Hand counted everything it took off the road, and none of it went home. Ask the rock
behind its tally-house."* (a hint toward I6's hidden takings, given where the company can still
use it, as DESIGN §10.2 has it);
with the Compact handed to the Wardens (`q_compact_wardens`), a Warden sergeant on the strand
instead: *"The sea lanes are the Wardens' now, and the Hand's boats have stopped coming over. We
counted eleven of theirs on the way. We'll count yours back."* For a Partner, a second runner
stands at the Heart's door once Vask has fallen (§4.8). That is all the plan pays the Compact in
Act V: the ferry, the runner's word and the sea lanes; the Wardens' siege, the Ashfall crossing
made harder and the Compact as a fence are cut (§11).

**The Lost Expedition** (DESIGN §10.3), ended at Fane's fire (#22): the map given (`meridian_map`)
is the third answer at the panel (§4.8), and nothing else. Fane's map has nothing a player can
read; what it shows is in the window's entry and in the voice's lie, found at the Core and never
told (§9, call 5).

## 7. Encounters, and what is new

The roster is MONSTERS §9's eleven and one more of the Hand's, the Ashen Rearguard on the Stair's
first landing: twelve monsters, one new family, the crawlers, which the Ways first place (§4.6)
and Vask drawn on the figure frame, a drawing of his own. Nothing else is new: the moths at their
most, the Hand at its best and in its inner circle (the rearguard among them, on the cultist
frame), the machine at work with no robe on and the rats. The numbers below are the test monster's line at each level
(`tools/testmonster.ts`, `testMonster(role, level)`, as #549 made Act IV's), and the drawings
issue tunes them on the gate (§8).

| Id | Name | Family, drawing | Kind, role | Level | Numbers on the line | Where; what it does |
|---|---|---|---|---|---|---|
| `hearth_moth` | Hearth Moth | moths, `hearth_moth` | beast, fodder | 28 | hp 280, ac 24, attack 15, 3d8+4, speed 12, xp 557 | the isle and the nave by night, twelve to a group; flies (`ranged`); its dust puts to sleep (`inflict: asleep 0.2`); `look: 'The sky over the isle is moving.'` |
| `ashen_champion` | Ashen Champion | cultist, `ashen_champion` | person, soldier | 29 | hp 435, ac 26, attack 16, 5d8+8, speed 11, xp 1,153 | the isle's pickets, the temple, the crypt; `steady` (the Hand never breaks); drops `grey_knife` at 0.1; `look: 'The Hand\'s best, in steel from below.'` |
| `ashen_preacher` | Ashen Preacher | cultist, `ashen_preacher` | person, caster | 29 | hp 643, ac 26, attack 18, 5d8+8, speed 12, xp 1,538 | behind the champions; `cast: { spells: ['firebolt', 'ward'], chance: 0.5 }`, `ranged`, `steady`; `look: 'Still preaching, and the fire is the sermon.'` |
| `deep_rat` | Deep Rat | rat, `deep_rat` | beast, fodder | 30 | hp 281, ac 25, attack 16, 3d8+5, speed 12, xp 597 | everywhere below, twelve to a group; `inflict: diseased 0.2`; `look: 'Rats. Even here.'` |
| `keeper` | Keeper | keepers, `keeper` | machine, soldier | 30 | hp 435, ac 26, attack 17, 5d8+8, speed 11, xp 1,193 | the Ways; `inflict: asleep 0.15` (the sleepers' touch, Rimewater's); `look: 'A keeper with no bay to keep, and no robe.'` |
| `deep_knocker` | Deep Knocker | knockers, `deep_knocker` (built, Ashfall's) | machine, armoured | 28 | as built (Ashfall's `monsters.ts`) | the Ways, the Stair; the crack |
| `hand_rearguard` | Ashen Rearguard | cultist, `hand_rearguard` | person, armoured | 30 | hp 640, ac 28, attack 17, 5d8+7, speed 8, xp 1,591 | the Stair's first landing, where the claimant's people are not; `steady`; `look: 'The last of the Hand still standing, and standing in the way.'` |
| `deep_crawler` | Deep Crawler | crawlers, `deep_crawler` (new) | machine, brute | 31 | hp 1,060, ac 25, attack 18, 7d7+10, speed 8, xp 2,467 | the Ways' last run, the Stair; `ranged` (it comes down from above and reaches the back row); `look: 'It comes down from above, on too many legs.'` |
| `catcher` | The Catcher | crawlers, `catcher` (new) | machine, boss | 31 | hp 1,300, ac 28, attack 19, 32d8+37, speed 13, xp 19,733 (off the line, which gives 2,095 and 34d8+41: `OFF_LINE`, `tools/tests/harness.ts`) | the Stair's foot, among the Hand's dead; `ranged`; `inflict: paralysed 0.2`; `look: 'It caught the Hand on these stairs.'`; sized on its odds to 57% won at 30 and 80% at 32 on the gate's hundred seeds (63%, 67% at 31 and 81% on 400; below; §8; §9.2, #752's 4) |
| `grey_hand` | Grey Hand | cultist, `grey_hand` | person, elite | 31 | hp 785, ac 27, attack 18, 7d7+12, speed 15, xp 2,467 | the Heart, at the panel; `steady`; `inflict: paralysed 0.15`; `look: 'Hands the colour of ash, to the shoulder.'` |
| `core_sentry` | Core Sentry | machines, `core_sentry` | machine, soldier | 31 | hp 890, ac 27, attack 17, 5d7+10, speed 11, xp 1,233 (off the line: 890 hit points with the soldier's blow, twice the 445 the soldier line read at 31 when #752 sized them; the line reads 437 now, twice 874, and they stay, `OFF_LINE`; §9.2, #752's 5 and #793's 5) | called by the ring (Vask's `calls`, the clock); stands down when he falls (`obeys`, §9, call 7); `look: 'The core\'s own, and it takes orders from the ring.'` |
| `vask` | Lord Vask | cultist, `vask` (the figure frame, his own) | person, boss | 32 | hp 1,850, ac 29, attack 20, 22d8+23, speed 13, xp 20,373 (off the line, which gives 2,100 and 34d8+41: `OFF_LINE`, `tools/tests/harness.ts`) | the Heart; `steady`; `calls: { monsters: ['core_sentry'], chance: 1 }` on the clock's beat (the clock ignores the chance, §9, call 7); `look: 'A tall man with a quiet voice, and the Queen\'s ring on his finger.'`; sized on his odds to 60% won at 32 with the Hands first and 33% with the clock let run on the gate's hundred seeds (62% and 28% on 400; below; §8; §9.2, #752's 5) |

**Vask's sizing** (#759, before the rung and the line made again; §9.2, #759's 7). The line's Vask, 1,922 hit points and 32d8+33, is won 10%
of 400 seeds at 32 with the Grey Hands killed first, 11% going for him first, 3% with the sentries
fought as they come and 56% with no clock; his thinned group 16%. `OFF_LINE.vask` then set him at 1,800
and 22d8+23, and the plays come to 65% with the Hands first (the gate's hundred seeds: 65%; aim 30%
to 70%), 64% going for him first (61%), 45% as the sentries come (46%) and 91% with no clock (95%);
the thinned group 74% (68%); with the Hands first at 31, 47%. The tries, in percent of 400 seeds:

| Hit points | Blow | Hands first | Vask first | As they come | No clock | Thinned |
|---|---|---|---|---|---|---|
| 1,922 (the line) | 32d8+33 | 10 | 11 | 3 | 56 | 16 |
| 1,700 | 22d8+23 | 68 | 68 | 50 | 94 | 77 |
| **1,800 (kept)** | **22d8+23** | **65** | **64** | **45** | **91** | **74** |
| 1,850 | 22d8+23 | 61 | 61 | 42 | 89 | 73 |
| 1,922 | 21d8+22 | 69 | 67 | 45 | 89 | 83 |
| 1,922 | 21d8+24 | 66 | 66 | 43 | 90 | 81 |
| 1,922 | 21d8+26 | 61 | 66 | 43 | 89 | 76 |
| 1,922 | 22d8+23 | 56 | 58 | 38 | 87 | 70 |
| 1,922 | 23d8+24 | 49 | 54 | 33 | 79 | 69 |
| 2,000 | 20d8+21 | 67 | 67 | 47 | 94 | 84 |
| 2,100 | 19d8+20 | 66 | 77 | 54 | 90 | 86 |
| 2,300 | 18d8+19 | 62 | 74 | 36 | 86 | 82 |
| 2,500 | 17d8+18 | 51 | 75 | 26 | 88 | 73 |
| 3,400 | 4d8+4 | 12 | 78 | 4 | | |

The gate's hundred seeds won 1,922 and 21d8+22 73, 63, 43, 92 and 85%, the thinned group past the
boss limit of 80%. **A heavier Vask with a lighter blow runs the wrong way:** going for him first
gains, since his fall stops the calls and stands the sentries down, while with the Hands first the
called sentries stand between the company and him to the end, under the gate's fifteen-round cap.
With the sentries on the line the Hands first led going for him first only at or under the line's
hit points with about two thirds of its blow, and then by a point or a few. The plan's one in three
with the clock left to run would bring the Hands-first odds to about a half (1,922 and 23d8+24: 49%
against 33%): two in three with the Hands first, the gate's judged play and the binding line for
the odds, was kept (the line made again, below, has going for him first ahead).

The thinned group's four plays, measured in review on 400 seeds: the Hands first 74, Vask first 84,
as they come 62, no clock 97. Going for the lord first breaks the boss limit of 80, and the gate
judges only the Hands-first play (68% on its hundred seeds). No sizing of Vask's hit points and blow
puts the Hands first more than 2 points ahead of going for him first (69 against 67 at best), so the
plan's lever lay in the clock or in the Hands and not in his hit points and blow, and proved to be
the sentries' hit points (below; §11).

**The bosses as built, on the line made again** (#752 and #793, settled by #796; §9.2, #752's 4 and
5, #793's 5 and #796's 1 and 2). The Hand's steel and the line made again in it, at 28, 30 and 32 by
#752 and at 29 and 31 by #793, raise the Hands (785 and 7d7+12), the sentries on the line (437 and
5d7+10) and the crawlers (1,060 and 7d7+10). With the sentries on the line no sizing of Vask gives
both of the plan's figures: two in three with the Hands first (1,750 and 24d8+25: 65%) leaves 49% to
a clock let run and the thinned group at 83%, past its limit of 80%. The sentries carry 890 hit
points, twice the soldier line as #752 read it, 445, their blow kept; they are off the line by the
design's choice as the Catcher is (`OFF_LINE`) and stay at 890 now the line reads 437, twice 874
(#793's 5), so a room the clock fills holds: Vask at 1,850 and 22d8+23 is won 62% with the Hands
first (the gate's hundred seeds: 60%), 72% going for him first (69%), 28% with the sentries as they
come (33%) and 88% with no clock (82%); the thinned group 81% (78%); the Hands first at 31, 54%
(52%). As they come, a company loses 170 fights of 400 outright and breaks off 119 at the fifteenth
round. The tries, in percent of 400 seeds, run again on the line as #793 made it:

| Hit points | Blow | Sentries | Hands first | Vask first | As they come | No clock | Thinned |
|---|---|---|---|---|---|---|---|
| 2,100 (the line) | 34d8+41 | 437 (the line) | 9 | 20 | 5 | 41 | 17 |
| 1,800 | 22d8+23 | 437 | 74 | 78 | 57 | 88 | 87 |
| 1,750 | 24d8+25 | 437 | 65 | 70 | 49 | 88 | 83 |
| 1,700 | 25d8+26 | 437 | 61 | 73 | 42 | 87 | 75 |
| 1,800 | 26d8+27 | 437 | 51 | 62 | 34 | 82 | 62 |
| 1,800 | 22d8+23 | 668 | 67 | 72 | 39 | 88 | 87 |
| 1,800 | 23d8+24 | 780 | 60 | 73 | 32 | 88 | 81 |
| 1,800 | 22d8+23 | 890 | 63 | 74 | 32 | 88 | 83 |
| **1,850 (kept)** | **22d8+23** | **890** | **62** | **72** | **28** | **88** | **81** |
| 1,900 | 22d8+23 | 890 | 60 | 70 | 24 | 86 | 80 |
| 1,800 | 22d8+23 | 1,000 | 64 | 74 | 26 | 88 | 84 |

"About two in three" no longer fits the Hands first: it is 62% on 400 seeds and 60% on the gate's
hundred, three in five, where #752 had 66% and 64%, since #793 made the Hands harder; it sits inside
the gate's aim of 30% to 70%, which is what binds. The clock let run holds, a quarter to a third
(28%, 33%). **The Hands first is the gate's judged play and the binding line for the odds but not the
better play:** going for Vask first wins more in every sizing of the table above, 72% against 62% at
the kept one, since his fall stops the calls and stands the sentries down, while with the Hands first
the called sentries stand between the company and him. The design allows either: the fight's point is
the clock, and a company that goes for the lord first takes the Hands' blows to be rid of the
sentries. The gate judges the Hands first (the boss rule: aim 30% to 70%, limit 20% to 80%) and holds
the clock let run to 20% to 45%; it does not judge going for him first (§8; §9.2, #796's 2).

The Catcher, with its two crawlers, in percent of 400 seeds (the gate's hundred where it judges), run
again on the line as #793 made it:

| Hit points | Blow | At 30 | At 31 | At 32 |
|---|---|---|---|---|
| 2,095 (the line) | 34d8+41 | 17 (16) | 23 | 30 (27) |
| 1,100 (its gate's) | 34d8+40 | 72 (64) | 80 | 84 (81) |
| 1,200 | 34d8+40 | 66 (58) | 73 | 80 (77) |
| 1,250 | 32d8+37 | 67 (63) | 71 | 83 (84) |
| **1,300 (kept)** | **32d8+37** | **63 (57)** | **67** | **81 (80)** |
| 1,300 | 33d8+38 | 62 (67) | 67 | 76 (78) |
| 1,600 | 28d8+32 | 63 (61) | 66 | 80 (77) |
| 3,200 | 12d8+14 | 72 (70) | 77 | 91 (92) |
| 3,300 | 12d8+13 | 58 (56) | 68 | 82 (78) |
| 3,600 | 11d8+12 | 18 (17) | 23 | 56 (60) |

The rise from 30 to 32 is 12 to 18 points on 400 seeds in every try up to 1,600 hit points, which
reach 76% to 84% at the cap; from 31 to 32 it is 4 to 14, where the plan's "about half at 31 and
nearly always at the cap" would need some 40. Only the 3,200 try reaches 91% at the cap, with its
floor at 72%, over the aim (70% and 92% on the gate's hundred), and it is a slog: at the floor it
loses none and breaks off 28% at the fifteenth round, the 3,300 and 3,600 tries 42% and 82% (the kept
one, 12%). The floor, the binding figure, is kept, the cap over its limit of 75% and under its aim
(§8; §9.2, #796's 1).

The drawings (the creatures lane): `src/ui/monsters/crawlers.ts`, the new family, two kinds; the
moths', the cultists', the rat's, the keepers' and the machines' modules gain their kinds, the
Hand's greying hands at the shoulder for the Grey Hands (`cultist.ts` already greys with rank);
Vask on the cultist module's figure frame in Warden grey with the ring drawn. Each through the
silhouette checks (EXPANSION §5.6), each its own kind (`tools/tests/art.ts`) and the gallery strip
on the sheet.

**What is new** (`novel`): `families: ['crawlers']` (`src/ui/monsters/crawlers.ts`, which must be
in before the Ways claim it), `terrain: []` (the isle's ground is rock, grass, hills and sand, all
seen; the Underdeep's smooth walls are the Dead-Drop's), `mechanics: ['encounter:clock']` (the
Core's clock, once `EncounterDef.clock` exists, §9, call 7), `landmarks: ['hearth']` (the site
icon, planned on the atlas since the start). Novelty counts only an unplanned site in the area's
own atlas slice, so H6's issue moves The Hearth and Anchorhold, the zone `hearthisle` and the
places `underdeep` and `core` out of `src/content/atlas.ts` into `src/content/areas/hearth/atlas.ts`,
as the Glasswold's are, and drops `planned` from each as it is built; `hearthfane`, `hearthfane2`
and `underdeep2` take plates there (§4.4, §4.5, §4.7). The check (`tools/tests/pillars.ts`) proves
each exists here and nowhere earlier on the road. H6 claims the Hearth (#753), the Ways the
crawlers (#757) and the Heart the clock (#759).

**Asks of the systems** (MONSTERS §9.3, §12): the Core's clock, Vask's calls on its beat and the
sentries that stand down when he falls, and nothing else. Calls, sweep, the sleeping touch, the
elements and `steady` are built.

## 8. The numbers

**The curve's row** (`src/content/progression.ts`, EXPANSION §5.2), the act's one, with the
area's band widened to the cap (§9, call 2): `hearth: { band: [28, 32], next: 32, price: 7000 }`.
The isle's zone and the temple sit at 28–29, the crypt at 29, the Ways at 30, the Stair at 30–31
and the Heart at 32, every map's band inside the row's; nothing is `outside`, since the road needs
every level. The window is 7,000, the row's one `price` and the only figure the curve checks; the
6,500 the gear reaches at 30 is a guide, not a window. The atlas's area row (`src/content/atlas.ts`,
`hearth`) takes the same band, and the Underdeep's and the Core's places keep theirs inside it, so
the bands still rise along the road (`tools/tests/atlas.ts`): 28, 30, 32. Three things are the
curve issue's (§9, call 9's first): the row lands in `PLANNED` with an `owed` row until H6 lists
the area (`tools/tests/curve.ts` holds a planned row's clear to its budget otherwise); the road's
last row takes `MAX_LEVEL` as its next floor, there being no area after it (`curve.ts`, the next
floor); and `areaBand` (`src/game/atlas.ts`) widens by the bands of the area's deep places, so
the row's band equals the atlas's once the boxes are laid, not the boxes' 28–29 alone.

| | Figure |
|---|---|
| Xp a member, three quarters of a clear to reach 32 (`xpBudget`) | 46,934, from 112,050 at 28 to 147,250 at 32 |
| The whole, at ×1, split six ways | about 281,600 |
| Gold, six members trained from 28 to 32 (`goldBudget`) | 28,320, at 1,120 to 1,240 a level |
| Trainer's ceiling | 32, the cap, at the sergeant's tent (`trainerCeiling` capped at `MAX_LEVEL`, §9, call 4) |
| The bosses | the Catcher 19,733 and Vask 20,373: 40,106, a seventh of the whole |
| The rest | about 241,500 over some 47 groups, 5,100 a group: twelve rats 7,164, four keepers 4,772, three champions 3,459, two crawlers 4,934 |

**The shares,** a first cut, the Ways' and the Stair's the balance: H6 a tenth, I6 a twelfth, the
temple a seventh, the crypt a tenth and the Heart an eighth; the Ways and the Stair share the 0.449
left, about nine fortieths each, the Catcher's in the Stair's; they sum to one. The Heart's
eighth is its fight: `core_vask`, Vask 20,373 and three Grey Hands at 2,467 (7,401), is 27,774,
about a tenth, before any sentry; the sentries the clock calls are booked to it at 1,233 each, and
the cap of twelve monsters over the fight holds them to eight at most (9,864), so the Heart pays
between a tenth and two fifteenths, an eighth as booked. Paid by level a company at 28 that clears
three quarters in road order should reach 32 at the Catcher's foot, and `tools/tests/curve.ts` says
where it lands. `OVER_ROAD` is moot for this row: `leaves()` caps at `MAX_LEVEL`, so its lead over
a next floor of 32 is never positive (`tools/tests/curve.ts`).

**The gate** (EXPANSION §5.2; `tools/gate.ts`), judged at each map's floor: the isle and the temple
at 28, the crypt at 29, the Ways at 30, the Stair at 30, the Heart at 32. At the floor nine fights
in ten; two under, no more than one in four, which the champions and the keepers must hold against a
company of 26 and 28 in Cinderport's gear. Eleven fights to a rest at 28, rising to twelve at 32
(MONSTERS §3.3; EXPANSION §5.2), against a company that rests at the pilgrims' camp and nowhere
below: the temple and the crypt, eight groups at 28 and 29, were one run from the camp and since
#794 are fifteen, two runs (the harness costs the temple's nine at 83% of a day and the crypt's six
at 50%); the Ways, eleven at 30 (twelve since #794), another; the Stair, seven at 30 and 31 with the
Catcher (nine since #794), another; and the Heart, one group and its sentries, the last. The ways up
from the crypt, the Ways and the Stair (§4.5, §4.6, §4.7) take a company back to the camp between
runs, so the counts stand as written. The groups of twelve (the moths and the rats, half again the
fodder's group of eight) are a risk at the gate, which may bring them to eight. The two bosses are
judged on their odds, as the gate states them (§9.2, #758's 7 and #759's 8). The Catcher is judged
at its map's floor, 30 (aim 30% to 70%, limit 20% to 80%) and two above, 32 (aim 90%, limit 75%), as
a dungeon's boss is, not at
31. The floor is the binding figure and is kept, and "nearly always at the cap" cannot hold beside
it but in a slog (§7): it is won 57% at 30 and 80% at 32 on the gate's hundred seeds (63%, 67% at 31 and 81% on
400), the cap over its limit and under its aim. Vask is judged at 32 alone, the cap being his floor.
The plan asks two in three with the Hands first and a quarter to a third with the clock let run,
which is the clock's point (§9, call 7), on the sentries at 890: the gate judges the Hands first
against the boss rule (aim 30% to 70%, limit 20% to 80%) and holds the clock let run to 20% to 45%.
He is won 60% with the Hands first and 33% with the clock let run on the gate's hundred seeds (62%
and 28% on 400). The clock let run holds only on the sentries at 890, off the line by the design's
choice as the Catcher is (`OFF_LINE`): on the line, 437, the sizing that gives two in three with the
Hands first leaves it 49% (§7). The Hands first is three in five, not two in three, since #793 made
the Hands harder, and sits inside the aim, which binds. Going for Vask first is a play the design
allows, and it wins more, 72% (69% on the gate's hundred), since his fall stops the calls and stands
the sentries down; the gate does not judge it (§7; §9.2, #796's 2). The isle's first groups past the
strand are the band's gentlest, and the zone's crossing line says how it feels (§4.2).

**As built: H6** (#753), the area's first box. The curve's row has left `PLANNED`, and its `owed`
stands at what the isle pays, 5,009 xp a member and 700 gold, owed to #744 while the area is built
box by box:

| | Figure |
|---|---|
| Xp a member | 5,009 of the 46,934, 10.7%: 1.07 times a tenth, 4,693 (the cap is 1.25, 5,867) |
| Gold | 2,900 of the 28,320, its tenth's 2,832 and more: the picket's chest 700, the cache 1,000 and the toll 1,200 (700 before #794); the Hand carries none |
| Paid by level | entering at 28 and clearing three quarters, a company leaves at 28.5, 3.5 under the next floor 32 |
| Dearest find | the Grey Knife, 6,400, in the 7,000 window |
| Gate, at the floor 28 | 100% of fights won (aim 90%, limit 80%); the seven groups' too |
| Gate, two under, at 26 | 100% won (at most: aim 25%, limit 90%): owed to #18 (§11) |
| Gate, the road at 28 | the two pickets and the sermon walked 100% of the time (aim 80%, limit 65%) |
| Fights to a rest, at 28 | 12.34 (aim 10 to 12, limit 8.5 to 14.5); 8.7% of days end in a fight broken off (12.19 and 8% when built) |
| Density, core | 99.7% within 8 steps (318 of 319, 288 needed); the furthest 9 of 15; one sign in 33 points: the temple's door is a door since #755 and the toll a chest since #794 |
| Levels | 4 monsters in 28–29, give or take two; the nearest group, the moths at 2 steps, at 28.0; the hardest, the rats at 17 steps, at 30.0 |
| Lines | 13 events and signs: 2 of one line, 7 of two and 4 of three: `h6_warm` is one line since #755 |

**As built: Hearthfane** (#755). The row's `owed` is raised to what the isle and the temple pay,
9,980 xp a member and 2,700 gold, still owed to #744 while the area is built box by box:

| | Figure |
|---|---|
| Xp a member | 7,084 against the temple's seventh, 6,705: 1.06 (the nine groups 6,584; the sacristan's 3,000, split six ways, 500); 4,971, 0.74, with the brief's five, before #794 |
| The area so far, as built | 9,980 of the 46,934, 21.3%: H6 5,009 and the temple 4,971 |
| Gold | the temple's 4,100 of the 28,320, its seventh's 4,046 and more: the treasury's chest 3,000 and the tithe 1,100 (2,000 before #794) |
| Paid by level | entering at 28 and clearing three quarters, a company leaves at 29.0, 3.0 under the next floor 32 |
| Dearest find | the Grey Bow, 6,800, in the 7,000 window |
| Gate, at the floor 28 | 100% of fights won (aim 90%, limit 80%); the nine groups' too |
| Gate, two under, at 26 | 100% won (at most: aim 25%, limit 90%): owed to #18 (§11) |
| Fights to a rest, at 28 | 11.27 (aim 10 to 12, limit 8.5 to 14.5), in the aim since #794 (8.96 when built, under it); 7.7% of days end in a fight broken off |
| Density, dungeon | 100.0% within 7 steps (89 of 89, 81 needed); the furthest 2 of 10; 2 signs in 26 points: the stair's top is floor since #756; four groups and the tithe are points since #794 |
| Levels | 3 monsters in 28–29, give or take two; rising from the way in (rank correlation 0.62; 0.87 before #794); the nearest group, the moths at 2 steps, at 28.0; the hardest, the champions at 6 steps, at 29.0 |
| Lines | 8 events and signs: 4 of two lines and 4 of three; the area's 21: 2 of one, 11 of two and 8 of three |

**As built: the crypt** (#756). The row's `owed` is raised to what the isle, the temple and the
crypt pay, 11,942 xp a member and 3,500 gold, still owed to #744 while the area is built box by box:

| | Figure |
|---|---|
| Xp a member | 5,146 against the crypt's tenth, 4,693: 1.10 (the champions 3,459, the rats 5,970, the keeper and his champion 2,346 and, since #794, twelve rats twice 14,328 and four keepers 4,772; 30,875 split six ways); 1,962, 0.42, before |
| The area so far, as built | 11,942 of the 46,934, 25.4%: H6 5,009, the temple 4,971 and the crypt 1,962 |
| Gold | the crypt's 2,900 of the 28,320, its tenth's 2,832 and more: the cups 1,800 and the pack 1,100 (800 before #794) |
| Paid by level | entering at 28 and clearing three quarters, a company leaves at 29.2, 2.8 under the next floor 32 |
| Dearest find | the Grey Bow, 6,800, in the 7,000 window (the Grey Robe, 6,200) |
| Gate, at the floor 29 | 100% of fights won (aim 90%, limit 80%); the six groups' too |
| Gate, two under | n/a for the crypt, its floor being above the area's; the area's pool at 26, 94.2% of 51 groups' fights won since #794 (100% of 15 when built): owed to #18 (§11) |
| Fights to a rest, at 29 | 10.46 (aim 10.25 to 12.25, limit 8.75 to 14.75), in the aim since #794 (13.71 when built, easier than it); 5.3% of days end in a fight broken off |
| Density, dungeon | 100.0% within 7 steps (58 of 58, 53 needed); the furthest 4 of 10; 1 sign in 16 points, the three groups of #794 among them |
| Levels | 3 monsters in 29–29, give or take two; rising from the way in (rank correlation 0.51; 1.00 before #794); the nearest group, the champions at 4 steps, at 29.0; the hardest, the rats at 13 steps, at 30.0 |
| Lines | 7 events and signs: 6 of two lines and 1 of three; the area's 28: 2 of one, 17 of two and 9 of three |

**As built: I6** (#754). The row's `owed` is raised to what the isle, the rim, the temple and the
crypt pay, 14,850 xp a member and 5,200 gold, still owed to #744 while the area is built box by box:

| | Figure |
|---|---|
| Xp a member | 4,253 against the rim's twelfth, 3,911: 1.09 (25,517 split six ways, six groups since #794); 2,908, 0.74, with the brief's four |
| The area so far, as built | 14,850 of the 46,934, 31.6%: H6 5,009, the temple 4,971, the crypt 1,962 and the rim 2,908 |
| Gold | the rim's 2,400 of the 28,320, its twelfth's 2,360 and more: the camp's chest 700 and the hoard 1,700 (1,700 before #794) |
| Paid by level | entering at 28 and clearing three quarters, a company leaves at 29.4, 2.6 under the next floor 32 |
| Dearest find | the Grey Mail, 7,000, in the 7,000 window |
| Gate, at the floor 28 | 100% of fights won (aim 90%, limit 80%); the six groups' too |
| Gate, two under, at 26 | 100% won (at most: aim 25%, limit 90%): owed to #18 (§11) |
| Gate, the road at 28 | the isle's two pickets and the sermon, then the rim's champions and the camp's two guards, walked 100% of the time (aim 80%, limit 65%) |
| Fights to a rest, at 28 | 11.63 (aim 10 to 12, limit 8.5 to 14.5) with six groups since #794 (11.32 with four); 4.7% of days end in a fight broken off |
| Density, core | 100.0% within 8 steps (134 of 134, 121 needed); the furthest 6 of 15; no sign in 26 points (19 before Hereswith in #763; 20 before #794; 22 before #864) |
| Levels | 3 monsters in 28–29, give or take two; rising from the way in (rank correlation 0.65; 0.77 before #794); the nearest group, the moths at 4 steps, at 28.0; the hardest, the champions at 10 steps, at 29.0 |
| Lines | 13 events and signs: 10 of two lines and 3 of three; the area's 41: 2 of one, 27 of two and 12 of three |
| Art | 50.0% of its 8 wall faces dressed (the cap is 50% under 100 faces): the cell is undressed (§9.2, #754's 2) |

**As built: the Ways** (#757). The row's `owed` is raised to what the isle, the temple, the crypt and
the Ways pay, 21,710 xp a member and 4,900 gold, still owed to #744 while the area is built box by
box; #794 raised the Ways' own pay and finds, and the rows that name it say what is true since:

| | Figure |
|---|---|
| Xp a member | 10,962 since #794 against the Ways' nine fortieths, about 10,560: 1.04 (the groups 59,772 split six ways, 9,962, `ud_rats3`'s 7,164 among them; 60's 2,000, 333; 61's 4,000, 667); 9,768 as built, 0.93 |
| The area so far, as built | 21,710 of the 46,934, 46.3%: H6 5,009, the temple 4,971, the crypt 1,962 and the Ways 9,768 |
| Gold | the Ways' 8,200 since #794 (the store 1,800, the crew's stores 2,000, the second store 2,200, the crawl way 2,200); as built, 4,900 of the 28,320 for the area: the Ways' 1,400 (the store 800, the crawl way 600), the crypt's 800, the temple's chest 2,000 and H6's 700 |
| Paid by level | entering at 28 and clearing three quarters, a company leaves at 30.0, 2.0 under the next floor 32 |
| Dearest find | the Grey Bow, 6,800, in the 7,000 window (the Old Lantern's Staff, 7,000, is an answer's gift, not a find) |
| Gate, at the floor 30 | 100% of fights won (aim 90%, limit 80%), the twelve groups since #794 as the eleven; the area's 26 groups' too as built |
| Gate, two under | n/a for the Ways, its floor being above the area's; the area's pool at 26, 100% of 26 groups' fights won: owed to #18 (§11) |
| Fights to a rest, at 30 | 11.27 since #794 (aim 10.5 to 12.5, limit 9 to 15), 7% of days ending in a fight broken off; 11.58 as built and 12.00 on main before it |
| Density, dungeon | 100.0% within 7 steps (201 of 201, 181 needed, 16,1 floor since #758); the furthest 6 of 10; 1 sign in 37 points since #794 (32 as built) |
| Levels | 4 monsters in 30–30, give or take two; rising from the way in (rank correlation 0.13); the nearest group, the rats at 3 steps, at 30.0; the hardest, the crawlers at 25 steps, at 31.0 |
| Lines | 16 events and signs: 5 of one line, 8 of two and 3 of three; the area's 44: 7 of one, 25 of two and 12 of three |

**As built: the Stair** (#758). The row's `owed` is raised to what the isle, the rim, the temple, the
crypt, the Ways and the Stair pay, 34,099 xp a member and 8,200 gold, still owed to #744 while the
area is built box by box; #794 raised the Stair's own pay and finds, and the rows that name it say
what is true since:

| | Figure |
|---|---|
| Xp a member | 11,164 since #794 against the Stair's nine fortieths, about 10,560: 1.06 (the groups 66,986 split six ways, the two groups of knockers' 10,097 among them; the Catcher's group 24,667 of it, the Catcher alone 3,289 a member); 9,482 as built, 0.90 |
| The area so far, as built | 34,099 of the 46,934, 72.7%: H6 5,009, the rim 2,908, the temple 4,971, the crypt 1,962, the Ways 9,768 and the Stair 9,482 |
| Gold | the Stair's 8,200 since #794 (the rearguard's chest 2,000, the packs 1,800, the second landing's packs 1,800, the Hand's takings 2,600, the letter 0); as built, 8,200 of the 28,320 for the area: the Stair's 1,600 (the rearguard's chest 900, the packs 700, the letter 0), the Ways' 1,400, the rim's camp chest 500 and hoard 1,200, the crypt's 800, the temple's chest 2,000 and H6's 700 |
| Paid by level | entering at 28 and clearing three quarters, a company leaves at 31.1, 0.9 under the next floor 32 |
| Dearest find | the Grey Bow, 6,800, in the 7,000 window (the Grey Axe in the rearguard's chest is 6,800 too) |
| Gate, at the floor 30 | 95.2% of the Stair's fights won since #794, the Catcher counted (aim 90%, limit 80%); 94.1% as built and 93.9% on main before it; the area's 37 groups at their maps' floors 98.9% as built |
| The Catcher | 57% won at 30 (aim 30% to 70%, limit 20% to 80%) and 80% at 32 (aim 90%, limit 75%) on the gate's hundred seeds, which judge a dungeon's boss at its map's floor and two above, not at 31 (63%, 67% at 31 and 81% on 400); the walkthrough's ten at 31, 5 won. As sized by #752, 1,300 hit points and 32d8+37, and read again after #793 (56% and 79% before it); the first sizing, 1,100 and 34d8+40, gave 59%, 67% at 31 and 84%. The floor's aim binds and "nearly always at the cap" cannot hold beside it but in a slog (§7, §8; §9.2, #758's 7, #752's 4 and #796's 1) |
| Gate, two under | n/a for the Stair, its floor being above the area's; the area's pool at 26, 97.5% of 37 groups' fights won (aim 25%, limit 90%): owed to #18 (§11) |
| Fights to a rest, at 30 | 10.71 since #794 (aim 10.5 to 12.5, limit 9 to 15), in the aim, 10% of days ending in a fight broken off, the Catcher left out as a boss; 10.14 as built and 10.34 on main before it, under the aim |
| Density, dungeon | 98.1% within 7 steps (151 of 154, 139 needed, 16,1 a door since #759); the furthest 9 of 10; 1 sign in 27 points since #794 (22 as built) |
| Levels | 6 monsters in 30–31, give or take two; rising from the way in (rank correlation 0.41 since #794, 0.19 as built); the nearest group, `ud2_knockers2` at 2 steps, at 28.0 (as built the rearguard at 4 steps, at 30.0); the hardest, the crawlers at 16,20 at 10 steps, at 31.0 |
| Lines | 11 events and signs: 8 of two lines and 3 of three; the area's 55: 7 of one, 33 of two and 15 of three |

**As built: the Heart** (#759). The row's `owed` stood at what the isle, the rim, the temple, the
crypt, the Ways, the Stair and the Heart paid, 38,317 xp a member and 8,200 gold, owed to #794 (#759
raised it to 42,946 under #744, the curve then counting both of Vask's groups; #792 set it again): a
clear fell short of the area's budget by 8,617 xp a member and 20,120 gold. Since #794 a clear pays
47,836 xp a member and 28,700 gold, past both budgets; the row's `owed` is gone. The curve counts
the lesser of Vask's groups and none of the sentries, as a clear fights one group:

| | Figure |
|---|---|
| Xp a member, as the curve counts it | 4,217 against the Heart's eighth, 5,867: 0.72 (the lesser of Vask's two groups, `core_vask_thinned` 25,307 split six ways, 4,217.8, floored as the curve's sum is; `core_vask`, 27,774, is its twin on the square and is left out; no sentry) |
| Xp a member, as played | 4,629 with `core_vask` (27,774) or 4,217 with the thinned group (25,307), and 206 more for each sentry the clock calls, eight at most (1,644): 4,629 to 6,273 against an eighth, 5,867 |
| The area | 47,836 of the 46,934, 101.9%, since #794: H6 5,009, the rim 4,253, the temple 7,084, the crypt 5,146, the Ways 10,962, the Stair 11,164 and the Heart 4,217; as built 38,317, 81.6% |
| The area, as played | the curve's 47,836 with the thinned group, or 48,248 (102.8%) with `core_vask`, and up to 1,644 of sentries more; as built 38,317 or 38,728 |
| Gold | 28,700 of the 28,320 for the area since #794: the Stair's 8,200, the Ways' 8,200, the temple's 4,100, H6's 2,900, the crypt's 2,900 and the rim's 2,400; the Heart adds none (its finds are the ring); as built 8,200, 20,120 short. The dearest find, the Grey Mail at 7,000, sits in the 7,000 window |
| Paid by level | entering at 28 and clearing three quarters, a company leaves at 31.9 since #794, 0.1 under the next floor 32; 31.4 as built |
| Gate, at the floor 32 | the Heart is judged on its boss's odds alone, its every group being a boss (§9.2, #759's 8); the area's 51 groups at their maps' floors 97.9% of fights won since #794 (aim 90%, limit 80%); 39 groups, 97.2%, as built |
| Vask | `core_vask` 60% won at 32 (aim 30% to 70%, limit 20% to 80%), `core_vask_thinned` 78%; two above the floor n/a, past the cap. His four plays on 400 seeds (the gate's hundred), on the line made again with the sentries at 890 hit points (#752, read again after #793): the Hands first 62% (60%), Vask first 72% (69%), the sentries as they come 28% (33%), no clock 88% (82%); the gate judges the Hands first and holds the clock let run to 20% to 45% (33%), and leaves Vask first, the better play, unjudged; the tries are in §7 |
| Gate, two under | n/a for the Heart, its floor being above the area's; the area's pool at 26, 94.2% of 51 groups' fights won since #794 (92.5% of 39 as built; aim 25%, limit 90%): owed to #18 (§11) |
| Fights to a rest | n/a in the gate, the Heart holding nothing but its boss; on the test monsters at 32 (`node tools/harness.ts --abilities`, the line made again by #752 and #793): the Hands first 12.1 rounds, won 11%, 2.3 sentries called, the light 5.1 of 8 steps down; the lord first 10.5 rounds, won 26%, 2.6 sentries, 5.6 of 8; the sentries as they come 11.4 rounds, won 18%, 2.5 sentries, 5.5 of 8; Vask's own group, on the gate's bot (`--abilities --seeds 100`, the gate's hundred: the default 200 prints 65, 69, 27 and 87), 60%, 69%, 33% and 82% with no clock |
| Walkthrough | `core:core_vask` won at 32 in 60% of its ten seeds, 70% with the clock left to run (with no round cap) |
| Density, dungeon | 100.0% within 7 steps (90 of 90, 81 needed); the furthest 7 of 10; no sign in 12 points |
| Levels | 2 monsters in 32, give or take two; the nearest group, `core_vask` at 9 steps, at 31.3; the hardest, `core_vask_thinned` at 9 steps, at 31.3 (at least 30) |
| Lines | every event and sign of the Heart fits 3 lines of the log |

**The gear** (`GEAR`, `tools/harness.ts`), the last rung, at 28 (built, #746), found and never
sold: the Hand's steel from below, in the temple's treasury, the camps' chests, the champions'
drops and the knocker's gift (§4.2 to §4.7), each inside the window and each a point past
Cinderport's armourer for every class. *Takes it* is the ladder test's (`ACT_V`,
`tools/tests/ladder.ts`; §9.2, #746's 2):

| Id | Name | For | Takes it at 28 | Price | Where |
|---|---|---|---|---|---|
| `grey_blade` | Grey Blade | the martial classes and the cleric (one hand, 2d12+6) | the knight, the paladin and the cleric | 6,600 | the treasury |
| `grey_axe` | Grey Axe | the martial classes (two-handed, 2d12+7) | the barbarian | 6,800 | the rearguard's chest |
| `grey_knife` | Grey Knife | anyone (light, 1d8+14) | the sorcerer, the thief and the bard | 6,400 | the picket's chest; the champions' drop |
| `grey_bow` | Grey Bow | the ranger (1d12+13) | the ranger | 6,800 | the treasury |
| `grey_staff` | Grey Staff | anyone (a staff, two-handed, 1d10+13) | the monk and the druid | 6,200 | the Hand's camp's chest |
| `old_lanterns_staff` | Old Lantern's Staff | anyone (a staff, two-handed, 1d10+14), holy in its words | the cleric, the sorcerer, the thief, the bard, the monk and the druid (the knight and the paladin bear shields; the ranger and the barbarian have a better piece of their own) | 7,000 | the knocker's gift for *Widen it.* (61) |
| `grey_mail` | Grey Mail | the Drakeskin Coat's wearers (ac 14; §9.2, #754's 8) | all seven, the knight and the paladin over their plate | 7,000 | the Hand's hoard (I6) |
| `grey_robe` | Grey Robe | anyone (ac 13) | the cleric and the sorcerer | 6,200 | the crypt's pack |
| `grey_shield` | Grey Shield | the shield bearers (ac 8) | the knight and the paladin | 4,000 | the keepers' store |
| `smelling_salts` | Smelling Salts | anyone, a plain consumable: `use: { cure: ['asleep', 'paralysed'] }` on one member, used up | no one: no gear, not on the ladder | 0 | the north rim's cache, three in a pouch |

The dice are a point past the armourer's at Cinderport (`src/content/areas/ashfall/items.ts`), one
rung for one rung: the Slag Mace 2d12+5, the Flamberge 2d12+6, the Marlinspike 1d8+13, the Ashwood
Bow 1d12+12, the Battle Staff 1d10+12, the Drakeskin Coat ac 13, the Cinder Robe ac 12 and the
Basalt Shield ac 7. The harness and the gate dress their companies from the rung at 28 and measure
30 and 32 in it; `GEAR_TOP` is 28. The salts are no system: a consumable for one member, as Lantern
Oil is (`lantern_oil`, which the store sells for poison, disease and paralysis), and named apart from
it.

**The vigil cell's two finds** (#864, §4.9) are off this ladder: the Levin Mace (2d12+5 and a lightning
die, 6,950) and the Vigil Robe (ac 12, personality +3, 6,350) are priced inside the window and under
the Grey Mail; no `GEAR` row names either, no shop sells either and the cell pays no xp, gold or
group, so every figure here stands.

The boxes' tables above keep the figures they were built with, before the rung, but for the
Catcher's and Vask's rows and the Heart's fights to a rest and walkthrough, which #752 brings up to
date. In it the gate reads (#746), and on the line made again with it at 28, 30 and 32 (#752) and at
29 and 31 (#793), the isle's monsters restated on it and its two bosses set on their odds (#752);
the last column is as #793 left it, read again by #796:

| Figure | Before the rung | In it | The line made again |
|---|---|---|---|
| H6 at 28, fights to a rest | 12.19 | 13.43 | 12.34 |
| I6 at 28, fights to a rest | 11.32 | 12.67 | 11.56 |
| Hearthfane at 28, fights to a rest | 8.96 | 9.61 | 8.91 |
| The crypt at 29, fights to a rest | 13.71 | 15.74, past the limit of 14.75 | 14.24 |
| The Ways at 30, fights to a rest | 11.58 | 12.91 | 12.00 |
| The Stair at its floor, 30, won | 94.1% | 95.6% | 93.9% |
| The Stair at 30, fights to a rest | 10.14 | 11.43 | 10.34 |
| The Catcher, won at 30 and at 32 | 59% and 84% | 69% and 82% | 57% and 80% |
| Vask (`core_vask`), won at 32 | 65% | 79% | 60% |
| Vask's thinned group, won at 32 | 68% | 89%, past the limit of 80% | 78% |
| Hearth Isle at its maps' floors, its 39 groups won | 97.2% | 98.4% | 97.3% |
| Hearth Isle two under, the area's pool at 26 | 92.5% | 92.5% | 92.4%, owed to #18 |

**The depths' pay** (#794, the Ways and the Stair; the isle's four are the other half's). More
groups (never stronger monsters) and more finds (nothing sold): the Heart holds one fight and no
find, so its shortfall, about 1,650 xp a member, and its share of the gold, 3,540, are the Ways'
and the Stair's. On main before and since, the gate's figures on its own seeds:

| Box | Groups | Xp a member, against its share | Gold | Won at the floor | Fights to a rest |
|---|---|---|---|---|---|
| The Ways, at 30 | 11, now 12 | 9,768 (0.92), now 10,962 (1.04), of 10,560 | 1,400, now 8,200 | 100%, now 100% | 12.00, now 11.27 |
| The Stair, at 30 | 7, now 9 | 9,481 (0.90), now 11,164 (1.06), of 10,560 | 1,600, now 8,200 | 93.9%, now 95.2% | 10.34, now 10.71 |
| The Heart, at 32 | 1 and its twin, as it was | 4,217 (0.72) of 5,867, as it was | none | on Vask's odds, as it was | n/a |

The two pay 22,126 xp a member and 16,400 gold, against about 21,230 and 16,020 left to them once
the isle's four pay 21,492 xp and 12,300 gold and the Heart 4,217 xp and none. With both halves in
the curve prints 47,836 xp a member and 28,700 gold for a clear, past both budgets; the row's
`owed` is gone. The area's 51 groups are won 97.9% at their maps' floors and 94.2% two under at 26
(owed to #18 at 100%, as before); the Catcher 57% at 30 and 80% at 32 and Vask's groups 60% and
78%, untouched; the dearest find is still the Grey Mail at 7,000.

**Quest items** (`price: 0`, `slot: 'none'`): `wardens_badge`, `treaty_seal`, `tallis_tally`
(57); `gullwick_letter`, with its text (58); `fane_key` (an iron key, 56); `queens_signet`, with a
text of its own read from the pack: *A heavy ring, gold, worn thin on the inside. The seal is the
one on the treaty, and on the chisel, and on the north rim: the first people's mark.*

**The xp the quests pay** (`pay: { xp }` on an answer, split among the living): 56 3,000, 57
nothing (its pay is the Stair's rearguard, fought or spared), 58 nothing, 59 nothing, 60 2,000 on
either answer, 61 4,000, 64 nothing; the Council nothing; the Cleric's third nothing but the
prestige. Booked to the area's clear or to a line of their own as #728 decides.

## 9. Decisions

Decided by the owner's delegate on 12 October 2026 with this plan, as #443's were for Act IV, each
grounded in DESIGN, STORY, MONSTERS and the atlas, and each the owner's to overturn before the
issue that builds it is approved. Four add to the design rather than settle it (4, 7, 10, 11), and
are marked so.

1. **The Core's door is the act's one lock,** the road's second and the one it was always sure to
   spend (DESIGN §9; EXPANSION §2.3). It is the Stair's last exit (§4.7), `needFlag` the five flags
   the road itself sets at the Stones: `q_tide_home`, `q_grove_done`, `q_anvil_closed`,
   `q_peak_stood` and `q_ember_lit`. The Grove's flag is its closing, the road's, not the Lanterns'
   mending, which is a side quest's (#56's 18) and may never be done: the door asks the road, the
   Hearth's count asks the mending (and `stones.ts` must read `q_mender_done` for it, which The
   Mender sets and `q_grove_mended`, owed to #56, does not: the road behind fixes it); the
   mending opens nothing (§5, the lock). The Peak Stone's flag is new, set by I11's `i11_stone`
   event (#751), since a `seen` cannot be a `needFlag`. A save that stood at the Peak
   Stone before that lands has seen the once-event and will never get the flag from it, so the
   save upgrade brings it (call 9's seventh issue): `SAVE_VERSION` goes to 5
   (`src/game/save.ts`), and `toV5` (`src/game/upgrades.ts`) sets `q_peak_stood` wherever
   `highspine_i11:i11_stone` was seen, recorded in `shipped.json` and tested in
   `tools/tests/save.ts`. Signed in `src/content/locks.ts` on `q_ember_lit` at `underdeep2` 16,1
   with its reason: *the heart opens for whoever makes it whole.* The count on the road becomes two
   of four.
2. **The area's band is 28–32, the cap, on the atlas and the curve,** with its places inside it:
   the isle and the temple 28–29, the crypt 29, the Ways 30, the Stair 30–31, the Heart 32. `next`
   is 32, which the curve reads as `MAX_LEVEL` for the road's last row: three quarters of a clear
   reaches the cap at the Catcher's foot. Nothing is `outside`; the Underdeep and the Core keep
   their rows on the atlas as places of kind `deep` and `areaBand` widens by them, so the row's
   band is the atlas's; the bands still rise along the road (§8; call 9's first issue).
3. **Hearth Isle is two boxes, both core: H6 and I6.** H6 the isle's body, the strand, the Bowl,
   the Hearth and the temple's door; I6 the east rim, Anchorhold where the atlas has it and the
   Hand's Steps where the causeway lands. The grey door at the Steps that opened for Wenna's hand
   is an event and no exit: the Hand's way in is seen and never walked, and no lock is spent on
   it. I6's north edge faces the Deepthorn's I5, pinned against I5's rock where the land meets it,
   and H6's north edge is cut to the world, the H5 box being unlaid: no way crosses either.
4. **No town; the pilgrims' camp is the isle's rest** (an addition, as Akordu was the Wold's,
   #443's call 5): a camp, the Pilgrims' Store and the Lantern's tent for the dead and the sick.
   Sergeant Aelfric's tent (57) trains to 32, the cap, which asks `trainerCeiling` to be capped at
   `MAX_LEVEL` (the systems lane) since the band's top plus one is 33. Cinderport stays the port,
   a day away by the last crossing each way; it trains to 27 as built. The band's gear is found,
   never sold: the isle has nothing to sell but the store's cures.
5. **The voice says what DESIGN §9 gives it and no more,** and it says it to Wenna: *Captain. Give
   the order.* The window's truth, that the vessel is not in orbit, is never said by the voice,
   nor before the choice; the
   third answer is offered only to a company whose flags hold `meridian_map`, Fane's map given at
   his fire (#22), and its words are the company's: *It is lying. It never arrived.* The secret
   stays found, never told.
6. **The choice is Wenna's question, and the game goes on.** Three answers, two without the map,
   each setting its flag; the chapter is done on any, and the quest with it. As the answer is
   taken the ending's three pages are shown on a screen of the systems lane's, long-form, and the
   company is back in the Heart with the ring in its pack and the world changed: the Hearth's state
   on the title, in the night sky and in the almanac (relit: still and at full; opened: the day's
   sky the wrong colour and the column as it was; finished: harder than relit, and the almanac's
   line says the ground hums); the sentries that hunt Ashfall stand down (`until: ENDED`, by the
   leave rule, call 9); Helmstow's gate opens to everyone; Vask is before the Council in the keep's
   hall in irons (relit, finished) or gone from the world (opened); each hall says its word (the
   Wardens and the Lanterns approve relit and the Cartographers and the Compact opened; the
   Lanterns split on it, the Guildhall's and the Watch's lines differing); the priestess at the
   Drowned Temples hears her god sing (relit), hears nothing and sings herself (opened) or hears a
   travelling song (finished). The walk home is played, not told: The Walk Home (§6) takes the
   company to Gullwick, where Hild waits and Wenna joins her, by the last crossing, Kilnhaven's
   ship, the ferry and the coast road, or any way it likes. Nothing is a lock, and no ending closes
   anything.
7. **The Core's clock** (MONSTERS §9.3; an addition to the fight's rules): `EncounterDef.clock`,
   `{ calls: '<monster id>', every: 2, dims: 8, panel: ['<monster id>'] }`: while any monster the
   `panel` names (the Grey Hands, `panel: ['grey_hand']`) stands, the fight's leader calls one of
   the named monster every `every` rounds, up to the cap of twelve monsters over the fight, and the
   light dims a step a round, to `dims`, where it holds at a thread; the panel's monsters down, the
   calling stops and the light holds where it is. The clock's calls ignore `calls.chance` and are
   not stopped by `MAX_GROUPS`, three groups to a fight (`src/game/combat.ts`), under which no more
   than two sentries would ever come; whether that is one called group that grows or calls exempt
   from the group cap is the clock's issue's to choose and the harness's to measure. Both of the
   Heart's groups, `core_vask` and `core_vask_thinned`, carry `sets: 'q_vask_fallen'`
   (`EncounterDef.sets`, #636), so the fight ends on the one flag whichever was fought. The fight
   screen (`src/ui/combat.ts`) draws the dimming over the backdrop and the log says it every third
   step: *Through the roof, the light goes out a little.* and at the last, *The light holds at a
   thread.* No fail state: the light cannot go out in a fight, since the choice after is the
   company's and nothing on the road changes what is offered. With it, `MonsterDef.obeys`, a
   monster that stands down when every leader in the fight is down though its kind never breaks
   (the Core Sentries, machines, when Vask falls): the fight ends with Vask, as the Stair-king's
   does with the king. Vask himself is `steady` and `kind: 'person'`, and `calls` the sentries on
   the clock's beat and never on his own chance.
8. **#56's seven for Act V stand,** 56 to 61 and 64, built with their maps (§6); 62 and 63 are the
   reach's, Phase 1.6's. Two changes to the drafts: 56's key opens the treasury, not the crypt,
   since a crypt behind a key behind a flag would be a second lock; and 60 is one way, from the
   inside, since the mines' side opens for nobody the company has (the Deep Mines' brief, #22).
   61's artifact is a staff of the window's price, since artifacts are the reach's (#18). The
   drafts drift in four smaller ways too, declared here: 59's word is on the last frame, not at the
   last door; 58 loses "read it or not"; 56's moths go to the light, not for the causeway; and 57
   drops from 29 to 28 and 61 from 31 to 30.
9. **What the systems lane adds, in one issue each** (the Phase's systems epic), eight issues and
   no ninth, each in the systems lane:
   1. the curve's last row, ending at the cap: its next floor (`MAX_LEVEL` for the road's last
      row); its band (`areaBand` widened by the area's deep places); `PLANNED` and `owed` until H6
      lists the area; and the trainers' ceiling capped at `MAX_LEVEL` (`trainerCeiling`,
      `src/content/progression.ts`) (2, 4; §8);
   2. the gear's last rung at 28, found and never sold (`GEAR`, `tools/tests/ladder.ts`, `GEAR_TOP`
      from 25 to 28) (4; §8);
   3. the leave rule: an opt-in rule by which a group is gone once its `until` holds, standing or
      not, since today's `until` only keeps a killed group from coming back (`src/game/map.ts`,
      `src/game/world.ts`). Every thinning in the plan waits on it (`core_vask`, `i6_guard`,
      `hf_second`, the temple's moths once the lamps are out, `ud2_rearguard`, `ud_knockers3`,
      Ashfall's sentries after an ending and the Sunder's groups), and every group that does not
      opt in keeps today's rule;
   4. the Core's clock and `obeys`, with the panel marker and the calls past `MAX_GROUPS` (7);
   5. `Exit.lifts` and `Exit.after`, a shut that is over once a `When` holds and an exit that is
      there once one does, which Helmstow's gate (6) and the CREW ONLY door (60) want; `after` is
      read as an appearance, as a presence is, so pillars' `findLocks` does not count it and the
      CREW ONLY exit is no lock between areas (§6, 60);
   6. the endings: their table, the long-form screen and the Hearth's three states on the title,
      in the night sky and in the almanac (`src/ui/title.ts`, `src/ui/viewport.ts`,
      `src/game/stones.ts`), which are this issue's and not the road behind's (6; §12);
   7. the save upgrade: `SAVE_VERSION` 5 and `toV5`, which sets `q_peak_stood` wherever
      `highspine_i11:i11_stone` was seen, with I11's `i11_stone` setting it for new play (1);
   8. the gate bot and the harness run to 32 on the roster with the clock played (the Hands
      first), and `tools/testmonster.ts`'s `LEVELS` gaining 30.

   A person's words do not pay: the sacristan's key is an answer's (56). The pilot (#721) is a
   Related line only: if it lands first it stops at the answers' `sets`, every one a flag of the
   last chapter's `done`, and nothing here depends on it.
10. **The Empty Throne ends at the Council of Helmstow** (an addition in its shape; DESIGN §10.1
    in its substance): one sitting; a case for any of the three, for Wenna or for nobody, carried
    by any two of that claimant's pieces or by the signet; and a verdict that changes Helmstow for
    the rest of the game and removes Vask from the keep before the Core, which thins the Hand on
    the isle (§4.3, §4.4, §4.8): the only way to do so, as DESIGN says. The verdict decides who
    holds the Stair's first landing and who stands with the company at the core (DESIGN §10.1, as
    written): the winning claimant's people on the landing, and Tallis's man at the Heart's door
    when the chair is his. 57's tokens are a piece for their claimant, and decide the same where no
    claimant's verdict carried. The Wardens' siege (DESIGN §8, §10.2) is cut: nothing in the design
    says what it is beyond its name, and the Compact handed to the Wardens has its consequence on
    the strand (§6); with it go the Ashfall crossing made harder and the Compact as a fence, which
    the plan does not pay.
11. **Master trainers wait on #18's skill tiers** (an addition to M3's scope, DESIGN §12): the
    Novice, Expert and Master tiers of the weapon and magic skills are not built, so there is
    nothing for a Master to teach; they are a line of words in the Phase's epic, parked, and not in
    its Done when. The Sorcerer's third is the reach's (#448, Phase 1.6). M3 is otherwise the
    phase's: Act V, all endings, the three subplots' ends and the Cleric's third. Decided by the
    owner's delegate, 16 October 2026 (#807): the Sorcerer's third comes into M3, at the Glass's
    edge on the Wold (docs/areas/glasswold.md §6).
12. **The road behind, in one issue** (as #449 was Act IV's): `stones.ts` reads `q_mender_done`
    (1), and the stale comment there that says `q_ember_lit` is owed in `UNSET` goes; I11's
    `i11_stone` setting `q_peak_stood` is not here but the save upgrade's (call 9's seventh, #751); the
    sentries' `until` in Ashfall, by the leave rule (6); Helmstow's gate, the keep (Vask's
    presences `until` the verdict, an ending or `{ visited: 'hearthisle_h6' }`, and his steward's
    line), #449's gibbets `until` the verdict, the Eel, the inn, the stores and the Chapel for the
    verdicts and the endings (6, 10); Gullwick's shore: Hild's last words, Wenna on the shingle,
    Jowan's mother and the sea (§6); the halls' and the priestess's lines, each hall's spoken by
    its guild's own person where there is one and by one the issue adds where there is not (6,
    §12); the Kilns' knockers through the open door and the thane's line (60); the Sunder's groups
    stopped, by the leave rule, and the Watch's line (61); the last crossing's isle end written,
    its fare free for a Partner (§6). The Hearth's three states on the title, in the night sky and
    in the almanac are call 9's sixth issue's, not this one's.
13. **Names** (§10): the Lanterns' English kept, with Hearthfane for the temple and the Bowl, the
    Strand and the Hand's Steps for the isle's places; the Ways, the Stair and the Heart for the
    deep, the docs' plain names for places nothing on the surface names, as the Sleepers' Bay is.
14. **The cuts** (§11): none of the land; the Wardens' siege (and with it the harder Ashfall
    crossing and the Compact as a fence), Master trainers and the reach's two quests, each to its
    own phase or to nothing.

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.8 as written, every line included; a builder keeps the squares the
  chapter and the quests key on and lays the rest.
- **The shares** of §8, and the Ways' and the Stair's groups as the balance.
- **The bands on the atlas's rows**, set in `src/content/areas/hearth/atlas.ts` where only the
  scaffold reads them.
- **The isle's climate** (§2): `{ summer: 22, winter: 14, daily: 4, damp: [0.05, 0.09], wettest: 60, fog: 0.1, lag: 14, fogText: 'A haze comes in off the Sound, and the light stands in it like a lamp in a sack.', thunderText: 'Thunder, far off over the mainland. The light does not waver.' }`.
- **The rooms** (the interiors lane): `bowl_store`, `bowl_yard` and `bowl_lantern`, three tents,
  as Akordu's trader's is a tent (`src/ui/interiors/glasswold/akordu_trader.ts`). Drawn (#762, §3,
  §9.2).
- **The sheet**: `node tools/sheet.ts sheet.png --area hearth`, on every pull request that adds a
  map, a monster or a room, sent to the owner in the Claude app (CLAUDE.md).

### 9.1 Changes taken in review

Taken on 13 October 2026 by the owner's delegate in review of the plan, these are the owner's to
overturn before the issue that builds each is approved.

15. **Vask's fall is a flag.** Both of the Heart's groups, `core_vask` and `core_vask_thinned`,
    carry `sets: 'q_vask_fallen'`, and `VASK_FALLEN` is that flag: everything after the fight keys
    on `{ flag: VASK_FALLEN }`. A company that won the Council kills the thinned group, and the
    panel, the voice, Wenna and the chapter still come.
16. **Thinning needs the leave rule.** Today's `until` takes no standing group off a map; it only
    keeps a killed one from coming back. Every thinning here (the Heart, I6's guard, the temple's
    second group and its moths, the Stair's rearguard, the knockers at the crack, Ashfall's
    sentries and the Sunder's groups) waits on an opt-in rule from the systems lane, the leave rule
    (call 9), and every other group keeps today's rule.
17. **Ways back up.** The Ways have an exit up to the crypt and the Stair one up to the Ways, at
    16,31 on each (§4.6, §4.7). A company that reaches the Stair before the five flags walks back
    to the pilgrims' camp and rests.
18. **The Peak Stone's flag for old saves.** I11's event sets `q_peak_stood` for new play, and a
    save upgrade (`SAVE_VERSION` 5, `toV5`) sets it wherever `highspine_i11:i11_stone` was seen,
    recorded in `shipped.json` and tested in `tools/tests/save.ts` (call 1; call 9's seventh issue).
    The event's `sets` and the upgrade ship together in that issue (#751), so no save at version 5
    meets the event without the flag.
19. **The verdict decides who stands at the core.** The Council's verdict puts the winning
    claimant's people on the Stair's first landing and, for Tallis, his man at the Heart's door to
    hinder; the pilgrims' tokens decide where no claimant's verdict carried, and DESIGN §10.1
    stands as written. A Partner's runner stands at that door too (§4.8), and the Compact's one
    spy's word is the strand runner's (§6), where DESIGN §10.2 puts it.
20. **The Hand's own door.** The Hand came in at the Steps by the service ways, opened the crypt's
    grey door from below for its garrison and went into the Heart by a door of its own at the
    Stair's foot, which opened for her hand and is shut behind them: an event and no exit (§4.7).
    The Stones' door, with the creed cut across it, is the one the Hand could not open.
21. **The door asks the road's five.** Call 1 stands: the Grove's closing opens the door, and its
    mending brightens the Hearth's count and opens nothing (§5, the lock).
22. **Eleven fights to a rest.** Eleven at 28, rising to twelve at 32 (MONSTERS §3.3; EXPANSION
    §5.2), not six. The temple with the crypt, the Ways and the Stair are each one run from the
    camp, so the counts stand (§8).
23. **The Council's timing.** The clerk appears once the Hand has Wenna (`q_wenna_taken`). The
    keep's Vask goes once the company has reached the isle, his steward's line in his place, and
    #449's gibbets go with the verdict; a Council that sits after an ending says so, with Vask
    before it in irons (§6). Once it has sat, the clerk's answers at the gate put the ring in the
    chair's keeping (64).
24. **Wenna after the ending.** She stays at the Core with her words after the ending until Hild
    has said hers (`until: { flag: WENNA_HOME }`), and then stands on Gullwick's shingle beside
    her mother (§6, The Walk Home).
25. **No square booked twice.** The clerk at the gate stands at `shelf` 15,4 and `gate_open` is at
    16,5, off the start square and its sign; `core_panel` is at 9,4, off the voice's square; Wenna
    on the shingle is at 11,15, off Wat's elder boy's.
26. **Two names changed.** The elf of Henlys is Talwyn, of the elves' tongue, and the Council's
    clerk is Wiglaf, an English name used nowhere else; the names the plan first gave them belong
    to Cinderport's harbourmaster and Lantern Watch's prior (§10).
27. **The sacristan's key is an answer's.** His words after the lamps end in a choice of one
    answer, *Take the key.*, which sets `q_lamps_key`, gives `fane_key` and pays 3,000 xp, as any
    answer can today. No person's words pay, so the systems lane is asked for nothing here.
28. **The elves' lines.** Talwyn asks only that whatever is at the bottom see the elves' mark, and
    the elves' captain says what is at the bottom was never theirs. Neither says what the doors
    answer to: the secret stays found.
29. **Six events to three lines.** `core_heart` and the five carried verdicts are written short
    enough for the log's three lines, measured with the game's own wrap.
30. **No lid at the Steps.** I6's sign of Act IV's line is dropped, since whitespine.md keeps that
    line to Sheer Point with no word of it elsewhere.
31. **Twelve monsters.** The Ashen Rearguard stays, and §7 says the roster honestly: twelve
    monsters, one new family.
32. **What the Compact pays.** The plan pays the ferry, the runner's spy's word and the sea lanes,
    and DESIGN is brought to that. The siege, the harder crossing and the fence are cut.
33. **The Grove's sliver.** A once-event at the column's foot (H6 23,16), for a company that
    carries the Mender's sliver, pays #56's 18: the sliver hums again under the Hearth.
34. **Three calls accepted as declared.** The band's gear is found, never sold (call 4); Master
    trainers wait on the skill tiers and the Sorcerer's third is the reach's (call 11); the siege
    is cut (call 10). Decided by the owner's delegate, 16 October 2026 (#807): the Sorcerer's third
    comes into M3, at the Glass's edge on the Wold (docs/areas/glasswold.md §6).
35. **The Deep Mines' end of 60.** The company lands on the Clean Corridor's floor at 13,3 facing
    west, before the door drawn in the wall. The map is band 17–18, so no Act V monster stands
    there: the knockers that come up are the Kilns' own (§6, 60).
36. **The clock's sentries.** The clock names its panel (`panel: ['grey_hand']`), and its calls
    ignore `calls.chance` and pass `MAX_GROUPS`, up to the cap of twelve monsters over the fight.
    The mechanism is the clock's issue's to choose (call 7).
37. **The cache's find.** The north rim's cache holds three Smelling Salts, each waking one member
    from sleep or paralysis. They replace a lamp for the whole company, which would have asked a
    new system and taken an id Ashfall already uses.
38. **The land counted again.** H6 has 757 squares of land and I6 270, 1,027 in all, with the
    shallows apart: about one zone map's worth (§1).
39. **The squares the drafts make rock or water.** Every named square on the boxes now stands on
    walkable ground of fitting terrain, or in ground the builder carves: the cleft, the rim's path,
    Anchorhold's yard and the secrets' pockets. The seam, the north edges, the temple's mound and
    the strand are as the drafts have them, and I6's secret turns west into the rim (§4.2, §4.3).
40. **The curve's row.** It lands in `PLANNED` with an `owed` row until H6, takes `MAX_LEVEL` as the
    road's last next floor and has its band from `areaBand` widened by the deep places. Only the
    7,000 window is checked, and `OVER_ROAD` is moot (§8).
41. **The gear's numbers.** Each piece is one point past its rung at Cinderport's armourer: the
    blade 2d12+6, the axe 2d12+7, the knife 1d8+14, the bow 1d12+13, the staff 1d10+13, the Old
    Lantern's 1d10+14, the mail ac 14, the robe ac 13 and the shield ac 8 (§8).
42. **The Heart's share.** The Heart pays Vask and his three Grey Hands, about a tenth, and the
    sentries the clock calls, eight at most: an eighth as booked. The shares sum to one, with the
    Ways and the Stair the balance (§8).
43. **The Hearth in the area's own atlas.** H6's issue moves The Hearth, Anchorhold, the zone and
    the deep places into `src/content/areas/hearth/atlas.ts`, dropping `planned` as each is built,
    so the landmark counts as new (§7).
44. **`Exit.after` is an appearance.** Pillars do not count it as a lock, as they do not count a
    presence, so the CREW ONLY exit is no lock between areas: it waits only on the company's own
    answer at that door (§6, 60).
45. **The preacher's spell.** The preacher casts `firebolt`, the spell's id in
    `src/content/spells.ts`; the plan named one that does not exist.
46. **The pilot is related only.** If #721 lands first it stops at the answers' `sets`, and nothing
    in the act depends on it.
47. **Eight systems issues.** Call 9 names exactly eight, each in the systems lane: the curve's
    last row; the gear's last rung; the leave rule; the clock and `obeys`; the two `Exit` fields;
    the endings with the Hearth's three states; the save upgrade; the gate and the harness to 32.
    There is no ninth.

### 9.2 Decided while building

Decided by delegate for #745, each the owner's to overturn:

1. **The row's `owed` is the epic's, #744,** as Act IV's rows owed theirs (#445 to #447): a clear
   falls short until the Heart is built, long after H6 takes the row out of `PLANNED`.
2. **The deep places are found by the atlas's `deep` ways,** from the area, its zones and their
   maps, place to place; each reads its own band, as its step on the road does, or its map's when
   it has none. The box that builds the first deep map keeps its `deep` way on the atlas or teaches
   `areaBand` its exits: the curve check fails if the band narrows.
3. **The cap is the next floor only for the road's last row,** one with no row after it and no area
   of a later order on the atlas; a row whose next area has no band fails as before.
4. **The rise is waived only at a floor of the cap** (`nearTop`, `tools/tests/curve.ts`): the
   Heart's 32 asks 30, where a band of 31–32 still asks 32. Fixtures hold both, and the deep places'
   widening on the atlas with a stand-in box laid at 28–29.
5. **`OVER_ROAD` is typed by the curve's keys,** so a planned row type-checks against it; the Hearth
   has no entry, its lead over the cap never being positive.

Decided by delegate for #748, each the owner's to overturn:

1. **One called group that grows.** The clock's first call opens a group and every later call joins
   it, so the Heart holds two groups and the fight screen seats and labels it as any other. Calls
   exempt from the cap, a group each, measured the same within a point and asked more of the screen.
2. **The call costs Vask no turn.** It comes at the end of a round on the beat while he stands, asleep
   or not. As his turn, every second blow became a sentry and the clock eased the fight (the
   harness's bot: 44% with the Hands first, 67% with Vask first, 33% with no clock).
3. **The beat.** The light steps at each round's end from the first, a thread at the end of the
   eighth; the calls come at the end of the second, fourth and on, and act from the next round.
4. **Standing down pays nothing,** as the fled do, and the log says *2 Core Sentries stand down.*
5. **The bots kill the panel first** (`markOf`), as #752 asks; a tool may turn them to Vask first
   or to the sentries as they come (`ANSWER.clock`).
6. **Vask's odds wait on #761.** On the test monsters the plan sizes the Heart by, the gate's bot wins
   10% with the Hands first, 16% with Vask first and 5% with the sentries fought as they come (23%
   with no clock; MONSTERS §9.3): the clock halves the odds as §8 has it, the whole far under them.

Decided by delegate for #747, each the owner's to overturn:

1. **The leave rule is `leaves: true` on a group, beside its `until`** (`EncounterDef`): the smallest
   change, with `until` and `ended` untouched, so every group without it keeps today's rule (the
   Kilns' strays). Not on `Presence`, since a person or an event goes by `until` alone, nor a form of
   `until`, which the quest log reads.
2. **One check, in `World.liveGroups`**, which every reader of a standing group goes through. The
   group's record is left as it stood, so leaving is no kill (no `slainText`, none of its `sets`, no
   `slain`) and nothing new is saved.
3. **`gone` in `tools/walk.ts` plays a group leaving, and `fight` there fails on one that has left**,
   so no walkthrough wins a fight with a group that is gone and sets its flags. The cases are
   fixtures in Helmstow; no real group leaves until the boxes place one.
4. **Read from the flags, as a person's going is:** a group whose `until` stopped holding would be
   back where it stood. Each `until` the plan gives is a flag that stays set.

Decided by delegate for #749, each the owner's to overturn:

1. **An `after` at a seam is a gate.** There the exit's square is the way across, so its gate
   refuses the party until `after` holds; anywhere else an exit not there leaves a plain square.
2. **The overlay draws no padlock for either field.** `zoneEdges` gates only on `needFlag`: a `shut`,
   and so its `lifts`, turns back some companies and not the way, and an `after` is no lock.
3. **An exit not there yet is not drawn, followed or counted:** not on the automap, not by `homeMap`
   (the Ways open onto the isle, not the Kilns), not as pillars' way beside a shut exit.
4. **The maps check counts a person, a group and an event** (`groupFlags`, an event's `sets`); an
   inn's nights and a guild's quests stay out, as the issue named only the two.
5. **The weather exception names the door, both maps and both regions;** `hearth` is no region yet
   (the area's first box adds it), so the fixtures name it as a word.

Decided by delegate for #762, each the owner's to overturn:

1. **Three shapes of tent.** The store is a ridge tent of undyed canvas pitched to the ground, the
   sergeant's a wall tent of the Wardens' grey, the Lantern's a round pavilion of white linen on one
   pole: shape and cloth tell them apart, and none is Akordu's felt on a lattice.
2. **The column stands in the store's door only,** and lights it by night: the isle's one sight,
   shown once; the other two keep to their trades.
3. **The nine goods are seen on the store's trestle:** the six cures in flasks, bread and cheese
   for the rations, a bundle of torches and the oil in stoppered jars, the meal in sacks beside.
4. **The sergeant drills where he can:** his back wall rolled up on the grass, a pell of sacking
   on a spare tent pole; his grey cloak with the old badge, his helm and sword are his only word.
5. **The dead and the sick are things seen:** a shrouded form on a bier with the Lanterns' ring on
   its breast and a candle at its head, and an empty pallet with its blanket turned back.
6. **Ahead through `ROOMS_AHEAD`,** as Cinderport's went, and owed to #753 in `UNPLACED`: the check
   that every business has a room fails on a room no business opens into, so H6 drops both.

Decided by delegate for #761, each the owner's to overturn:

1. **The Champion drops nothing yet.** §7 gives it `grey_knife` at 0.1, but the knife is #746's and
   not on main, so the def leaves the drop out and #746 adds it with the item.
2. **Vask is a tall boss.** Size 1.6, drawn at 0.78 of the frame, his crown at 0.801 under the
   markers (0.82), as the Tallymaster's and the Sentinel's are: a tall man over Grey Hands at 1.05.
3. **The core's light is white and gold:** the Core Sentry's ring and port, the Queen's ring on
   Vask's hand and the Underdeep keeper's lights, against the furnaces' orange and the bay's blue,
   so the core's machines and the ring that orders them read as one.
4. **The keeper is told apart by its pose and its plate:** the bay keeper's frame bare, taller and
   thinner, dark, seven fingers, both hands raised to touch (`raise` in the keepers' Build, 0 for
   every keeper before it).
5. **The Core Sentry has a body of its own,** `core`: the Sentry's legs and keel with a ring for a
   head and two long arms alike. MONSTERS has it the frame's Build and a tint, but a tint alone
   would be the Sentry again.
6. **The deep rat is pale,** bred out of the sun: lean, up on its legs, ribbed and red-eyed, against
   the rat's brown, the barn rat's fat and the bilge rat's slick black.
7. **Nothing comes loose but the moth's dust.** The preacher's embers and the Grey Hands' ash broke
   the silhouette at combat size, so they are not drawn: the fire on the palm carries the sermon.
8. **The Wold's walkthrough reads AHEAD by name.** It asserted AHEAD empty, true only while it was;
   it now asserts the Glasswold out of it, which is what it meant.

Decided by delegate for #761 (the crawlers), each the owner's to overturn:

1. **The Deep Crawler comes head-first down the wall, front on:** seven plates upright with their legs
   splayed to the sides and the front pair and the clamps on the floor, so it stands where a fight
   seats it and still reads as coming down from above. The wall is not drawn.
2. **The Catcher is a crawler built into a cage:** the crawler's plates, rods, brass knees and red
   lamps over a hood and seven hooked arms closed to the floor, two pairs of long legs standing it
   over them; one family at a glance, and the boss another shape.
3. **One of the Hand is in the cage,** slumped in the champion's robe and steel, an arm hung out
   through the bars: the look's line seen, never said. If the cage should be empty, it is one block
   of the module.
4. **Sizes:** the crawler 1.25, the test brute's; the Catcher 2, the Eldest's, drawn at 0.8 of its
   frame so its crown stands at 0.801 under the markers (0.82): a head and more over the crawlers it
   leads at the foot (`ud2_catcher`).
5. **The lamps are a dull red,** against the core's white and gold, the keepers' gold and the
   walker's green-white: the crawlers' own, things that work in the dark.
6. **The chisel's mark is cut in a plate of each:** the makers' machines, as every knocker, keeper
   and heavy machine is (`knockers.ts`).

Decided by delegate for #751, each the owner's to overturn:

1. **`toV5` reads what the game's own `seen` reads.** The event counts as seen when the High Spine
   is among the save's `zones` and the outdoors' `used` holds `i11_stone`. The zone, the event and
   the flag are kept frozen in the upgrade (`V5_PEAK`), so a later edit of the map or of
   `stones.ts` cannot change which saves it reaches, and the upgrade and the Hearth's count agree
   on who stood at the Stone.
2. **The flag is set to 1,** as an event's `sets` sets it. A save that has it keeps it.
3. **`shipped.json` records the version and the flag.** It is at 5, and `q_peak_stood` is new,
   from the event's `sets` (5 below). Nothing in it goes or moves.
4. **New play is checked in the Whitespine walkthrough,** whose step at the Stone already stands
   on the event; `tools/tests/save.ts` holds the saves from before.
5. **The event's `sets` lands in #751, not in #765.** The upgrade and the flag ship together, so
   no save at version 5 has seen the event without the flag, and no window is left between them.
   The road behind has nothing of it to do.

Decided by delegate for #750, each the owner's to overturn:

1. **The real pages are in.** §5 gives all three whole, so `src/content/endings.ts` holds them with
   their flags and names; #759 has only to set the flags. The machinery's cases run on a fixture.
2. **The world map's Hearth follows the state too,** in a few lines: a map showing a column the
   title no longer shows would read as a bug. It has no sky, so opened shows there as at five.
3. **The looks** (`hearthLook`, `src/game/stones.ts`): relit is five Stones' column and still;
   opened is five Stones' column under a violet sky with a rose foot, most of the way by day, less
   at dusk and none by night; finished is two steps past full and still. On the title the column
   meets the top of the view at five, so there finished stands wider rather than taller.
4. **The screen** (`src/ui/ending.ts`): the ending's name over the title's dusk, the Hearth as the
   ending leaves it, a page at a time at twice the log's size. The answer's own words come first in
   their box; Space or Esc turns a page, and past the last the company stands where it stood.
5. **The voice check's exception** sits beside `MOST_LINES`: three pages to an ending, each within
   the screen's six lines (the Hull Opened's second takes four of the log). The pages go through the
   glyph and spelling checks with every text, and an ending's answer is still held to three.
6. **Two endings held**, which the Heart's question should not allow, read as the table's first.
   `ENDED` is exported from the table as a `When` list for #759 and #765 to import.
7. **Nothing new is saved:** the state is read from the flags, so it needs no save upgrade.

Decided by delegate for #764, each the owner's to overturn:

1. **The sitting is Wiglaf's word, not twelve events.** By day after the case he stands at `keep`
   4,5 and says the first verdict that holds, which sets its flags, and is gone with it (`until` the
   six). Pillars' line check counts every event on a square together, and twelve verdicts on one
   square run past the log's four lines. The words, the square, the flags and the once are §6's.
2. **The morning after is the day's hours** (`when: { hours: 'day' }`): no condition counts a night
   from a flag, so a case made by day is heard on the next step to the chapel by day.
3. **Wenna's answer at the first meeting.** The five answers are words `after: { flag: 'q_wenna_up' }`
   that set `q_council_met` themselves: a person's words are read before the meeting hires, so
   `after: { flag: ['q_council_met', 'q_wenna_up'] }` would offer her only at a second meeting.
4. **Which words were said is a flag** (`q_council_early`, `q_council_late`), so the log says the
   Regent's absence or Vask in irons as the sitting did: an entry cannot ask that a flag is unset.
5. **One proclamation with no name**, *Over it: the Council of Helmstow holds the city under its
   seal.*, an event on the sign's square said after it at every step, since a sign takes no
   presence. Five named ones there run past the log.
6. **Vask's door is the Council's:** Wiglaf at 7,4 with the throne room, `after` the removal, two
   lines of mine. The doorway check wants a business that goes to have a twin, and the locks check
   wants its trade had (#157's form); otherwise it is a lock to sign in.
7. **The inn at 12, the Chapel for the hold and Mottram's for Tallis are each the next link on its
   doorway,** which #776's doorway chain allows (`doorwayFaults`, the block below): the dearer inn
   `until` the removal and one at 12 `after` it; the Chapel's notice `until` the hold's verdict and the
   Chapel back `after` it, written temple, word, temple; Mottram's dearer stores `until` Tallis's and a
   twin `after` it. They came in a second pull request, stacked on #776, since #774 could not hold them.
8. **The goal names the girl from Gullwick only to a company she led up;** to the rest it says *the
   cousin, the hold, Tallis or nobody*.
9. **A piece may be one of several flags:** the treaty is one piece by either mark, and Wenna's case
   is `q_wenna_up` with one of her three. The pairs are a `When` list built from §6's table
   (`carried`, `keep.ts`). The tokens (#753), the signet (#759) and the walk home (#765) are owed in
   `UNSET`, as are the endings' flags (#759), read from `src/content/endings.ts`. #759 sets the
   endings' in Wenna's answers; the signet's four flags are #765's (#759's 10).
10. **A port's prices are twice the old city's,** the Lantern Oil as before: dearer than the Regent's
    half again, as §6's *dearer for Tallis* asks, and the oil's forty is Mottram's own word.

Decided by delegate for #764 (the doorway check), each the owner's to overturn:

1. **A chain, and nothing wider.** `doorwayFaults` (`tools/tests/maps.ts`) takes businesses with a room
   each, in order on the square: the first only `until` X1, each next `after` the one before's `until`
   and, but the last, `until` its own, none with a `when`, the last only `after`. A word or twin on
   another condition, a gap, a `when` on a link, a link gone with nothing after it, a person before the
   business, a second business and a doorway with no business fail as they did.
2. **The Chapel's way is a word, then the business back.** A shut door's word (an event `after` X and
   `until` Y, no `when`) may be followed at once by the business again `after` Y, as the next link. The
   word must go on Y, or it would be said at an open door; a word that does not go leaves the business
   behind it a second business, as before.
3. **A chain may end in a word.** Any link that is gone may be followed by the shut door's word, as the
   first always could, so the stores may shut after they go dearer. The word may stand anywhere after the
   link, as it did; only a twin or the business back must follow at once.
4. **Conditions compare as `same(...)` did,** to the letter: a `When` list on a word's `until` and on its
   business's `after` is one constant (the hold's verdict with `ENDED`, in #765).
5. **Checked against the old rule, not only on the maps:** over every list of up to four features on a
   doorway (4.7 million; three flags, a `when`, events, people and keepers) nothing the old rule passed
   fails, a list passes that did not only if it is a chain (a second recogniser, written from the issue,
   agrees on every list), and every list outside a chain gets the same faults word for word. The run was
   a scratch script; the fixtures in the maps check are what stays.
6. **No doc line described the rule,** so none is changed: EXPANSION §8.2 is the zone-map recipe, and
   the comment above `doorwayFaults` is where the rule is told.
7. **This unblocks the twins owed in the Council block's 7 and in #765.** The inn at 12, the Chapel for the
   hold and Mottram's for Tallis are each a link added to a chain; the Chapel is its word gone `until` the
   hold's verdict and the endings, and its temple again `after` the same list. No map is touched here.

Decided by delegate for #753, each the owner's to overturn:

1. **57 is `bowl_pilgrims` and its met flag `q_bowl_pilgrims`.** The plan's `pilgrims` and
   `q_pilgrims` are Rimewater's 44, The Pilgrims in the Pass: `byId` throws on the quest, and a
   company that met the pilgrims in the pass would start 57 at once. §6's 57 is swept to match.
2. **All three pilgrims set the met flag,** not Aelfric alone: a company that meets Talwyn or Pasco
   first and takes the token would never start the quest, since Aelfric goes with another's token.
3. **57's `done` is `HELD` for now:** the three tokens and the three claimants' verdicts, with an
   entry for each token. The rearguard slain, the "carried none" entry and the goal at `underdeep2`
   are #758's: a key naming a group or map not built fails `tools/tests/quests.ts`. #758 built them
   (#758's 4).
4. **The north-west coast and hills outside the rim are the rim's rock to the shallows** (rows 0–18,
   some 53 squares, the sand there made shallow; and 6,20–21). No way on foot reaches them and the
   brief places nothing there, but density walks only standable ground from its points, so they
   stood past 15 of any point. The shelf from the strand to the lookout at 7,22 is as drafted.
5. **The grass at 29–31,0 in the north rim's corner is rock.** Walled off from every other square of
   H6 by the rim and the void, it failed the maps check's reach from the start (swimming included).
   So the seam's row 0 is H6's rock against I6's grass, where the plan had it walkable on both sides.
6. **The temple's door at 18,14 is a building square, with no feature,** until #755 joins its exit;
   `h6_front` at 18,15 says the door. No exit: one to an unbuilt map fails `tools/tests/maps.ts`.
7. **The three tents open round a yard at 16,16,** each business on a door square as the maps check
   asks: the store's door 15,16 (its tent 15,15), the sergeant's 17,16 (17,15) and the Lantern's
   16,15 (16,14).
8. **The cache is two squares carved,** 26,6 (`h6_cache`) and 26,5 (the chest `h6_lamp`), behind the
   secret door 26,7, so the hollow's line and the chest do not share a square.
9. **The map starts at the boat's landing,** 20,30 facing north; the scaffold's start, 16,15, is the
   Lantern's door.
10. **The isle's road at the gate is the cleft's two pickets and the sermon,** from the strand to the
    temple's door; the moths come by night and are off it.
11. **Two under, the isle is won every time** (100% at 26), owed to #18 as every Act IV box's `under`
    is (`hearthisle_h6: under` and `Hearth Isle: under`, `OWED` in `tools/tests/gate.ts`). Stronger
    monsters are barred and fewer groups would not lower it. The issue's "one at 26 no more than one
    in four" is therefore not met: the owner's or #18's.
12. **The brief's seven groups are kept as written:** 12.19 fights to a rest at 28 (aim 10 to 12,
    limit 8.5 to 14.5), off the aim but inside the limit; the pay is 1.07 of the share, under 1.25.
13. **`HELD` is exported from H6's map** with the tokens (the Council's three flags imported from
    `shelf/maps/keep.ts`), since the plan's table has the map that sets them export the constants.
14. **The champion drops `grey_knife` at 0.1,** and the knife is H6's item (`greyKnife`, 1d8+14,
    6,400, light): #761's decision 1 left the drop to the item's issue, and #746 takes the item into
    its rung.
15. **The runner and the Warden sergeant share 23,30,** each `after` its own end of the Compact
    (`q_compact_over`, `q_compact_wardens`), so they never stand together.
16. **The walkthrough kneels with `useShrine` directly:** `kneel` in `tools/walk.ts` compares the
    outdoors' moved feature with the map's by identity and so fails on any zone map. Not this
    issue's to fix. Since #793 `kneel` works on a zone map and the walkthrough kneels with it.

Decided by delegate for #754, each the owner's to overturn:

1. **Two points the brief does not name,** for density: `i6_keel` (8,10), *A boat's keel on the grass
   under the rim, stripped to the ribs. Its planks went to the Hand's fires.*, and `i6_wyke` (5,2),
   *The rim's north end. Across the Wyke, Thornmark's shore, near enough to count the oaks and too
   far to reach.* Without them the east foot's north half and the north rim, some 45 squares, stood
   9 to 27 steps from any point (core asks 90% within 8 and none past 15). The land is kept as the
   plan has it, not made rock. The words are the builder's own.
2. **Anchorhold's cell at 4,18 is a building square (`B`),** not plain rock. The art check holds a
   small map to half its wall faces dressed: the secret door, I6's only wall, draws damp on its four
   faces (100%, failing), and the cell, undressed, brings it to 4 of 8 (50%, the cap). Not walkable,
   as the rock was, and the cell shows on the map.
3. **The secret's `hint` is `i6_smell`** (2,25): the field takes one event id, the smell stands beside
   the door, and the tally-house (3,24, east of the door) is the runner's word's mark. The
   walkthrough searches from the tally's square facing west.
4. **The hoard `i6_hoard` is at 0,24,** the pocket's west square, and the takings' line `i6_takings`
   at 1,24, so the line and the chest do not share a square (as H6's cache, #753's 8).
5. **The carved squares are dirt (`:`):** the yard 2–5,19–20, the path 1–2,18 and 6–7,19 and the
   pocket 0–1,24, as H6's cleft and cache are.
6. **`i6_guard` is three champions then the preacher, `back: 1`** (`back` counts from the end),
   `roams: false`, `until: { flag: THRONE_REMOVED }` (from `shelf/maps/keep.ts`) and `leaves: true`.
   There is no `UNSET` entry for `q_throne_removed`: the Council sets it (#774). `encounter:leaves`
   is not claimed in `novel`.
7. **The plan gives a respawn to `i6_rim` alone** (2,880). `i6_guard` and `i6_guard2` take 2,880 too
   (the Hand's, as H6's champions) and `i6_moths` 1,440 (as H6's moths); none is a guardian. `aware`
   is 3, the stair's two 2.
8. **The Grey Mail is for the Drakeskin Coat's wearers** (`NO_CASTER_HEAVY`), not `MAIL` (knight,
   paladin, ranger): §8 has each piece a point past Cinderport's armourer for every class, and the
   coat's rung is those seven. It is `A('grey_mail', 'Grey Mail', 7000, 14)`; the Grey Staff is in
   the Battle Staff's form, `W('grey_staff', 'Grey Staff', 6200, 1, 10, { kind: 'staff', bonus: 13,
   twoHanded: true })`.
9. **The start is 8,19 facing south,** where the path comes out over the sea; the scaffold's 12,17 is
   shore sand. No company lands on I6: the zone's way in is H6's boat.
10. **The isle's road at the gate gains `i6_rim`, `i6_guard` and `i6_guard2`** after H6's three: out of
    the Bowl's east pocket by the rim's path and down the east foot to the camp. The moths by night
    are off it, as H6's are.
11. **Two under, I6 is won every time** (100% at 26), owed to #18 (`hearthisle_i6: under`, `OWED` in
    `tools/tests/gate.ts`) as H6's is. Stronger monsters are barred and fewer groups would not lower
    it. The issue's "one at 26 no more than one in four" is therefore not met: the owner's or #18's.
12. **The brief's four groups are kept as written:** 11.32 fights to a rest at 28 (aim 10 to 12).
    They pay 2,908 xp a member against a twelfth, 3,911: 0.74 of the share. No floor on a box's
    share is checked, and more or stronger groups were not the brief's.
13. **The walkthrough's first line holds the zone's two maps,** where H6's asserted one, and plays the
    leave rule: the guard gone with `q_throne_removed` set, then back with the flag deleted and
    fought.

Decided by delegate for #755, each the owner's to overturn:

1. **The treasury's door is a door gated on the key, not a `locked` square.** The engine's `locked`
   opens to any `key_iron` and uses it up, and iron keys lie in five chests and the dens. So 11,10
   is a door with an authored gate, `gates: [{ x: 11, y: 10, after: { item: 'fane_key' }, blockedText }]`
   (#749's `after`, read by `World.move` on any map): it opens to the sacristan's key and to nothing
   else, and the key is kept. No system changed. It is the first authored gate on a door; a door's own
   key would be a systems issue, if the owner prefers one.
2. **The pillar's carving is split at its colon:** `text` *Carved up the pillar in the oldest hand on
   the isle.*, `read` *FIRST THE SEA. THEN THE SHORE. THEN THE HOUSE. LAST OF ALL THE HEARTH.* A
   sign's id is kept by `seen` only when it has `read`, and then only by a company with a reader; the
   same text twice runs past the log (the pillars check holds words and reading together to its
   lines). So a reader reads the order, as the sacristan's "if you can read a pillar" has it, and the
   log's pillar entry is a reader's; any company has the order from the quest's goal or by trial (a
   wrong lamp stays lit and the right order still works).
3. **56's ids are the plan's** (`lamps`, `q_lamps`, `q_lamps_out`, `q_lamps_wrong`, `q_lamps_key`,
   `fane_key`, the lamps' `lamp_sea`, `lamp_shore`, `lamp_house`, `lamp_hearth`): none clashes in
   `src/content`.
4. **The stair down is wall until the crypt:** 8,1 is `#`, and `STAIR` (the brief's exit to
   `hearthfane2` 8,14 facing north, with its label) is exported and not listed, as `meridian_camp2`'s
   `STAIR2` was: an exit to an unbuilt map fails `tools/tests/maps.ts`. 8,2, the altar's square, is
   floor for the crypt's way up. #756 opened the stair (its 5).
5. **The banners are the Hand's grey, `#6a6866`,** not the palette's `#8a3a2a`: the brief and the
   issue put the Hand's grey either side of the arch (12,2 and 12,4, `banners`), and a map hangs one
   colour (`palette.banner`), so any it hangs by chance are the Hand's too. The rest of the palette
   is the brief's.
6. **The House and Hearth lamps' turn lines follow the Shore's:** the House lamp says *The moths have
   left the Shore lamp for it.* and the Hearth lamp the same of the House lamp; the plan gives the
   Shore's only. Built by one `lamp()` maker, as the Ember Stone's `socket()`.
7. **The swarm respawns at 720, as the moths:** no quest names it and it has no `slainText`, so it is
   no guardian, and the respawn check holds every other group to 720 to 2,880. It leaves with the
   moths on `q_lamps_out`.
8. **`aware`, which the brief leaves open:** 3 for the moths, the swarm and the sermon; 2 for the
   champions and the second group. The champions, the sermon and the second group stand
   (`roams: false`).
9. **The brief's five groups are kept:** 8.96 fights to a rest at 28 (aim 10 to 12, limit 8.5 to
   14.5), off the aim and inside the limit; the pay is 0.74 of the temple's seventh, so cutting a
   group would only widen the shortfall.
10. **Two under, the temple is won every time** (100% at 26), owed to #18 (`hearthfane: under`,
    `OWED` in `tools/tests/gate.ts`) as H6's is; stronger monsters are barred. The issue's "one at
    26 no more than one in four" is therefore not met: the owner's or #18's.
11. **The Grey Blade and the Grey Bow are the area's items,** beside H6's knife: `greyBlade` 2d12+6,
    6,600, for the martial classes and the cleric, one hand, a point past the Slag Mace; `greyBow`
    1d12+13, 6,800, the ranger's, a point past the Ashwood Bow. #746 takes them into its rung.
    `fane_key` is named *Sacristan's Key* (`slot: 'none'`, `price: 0`).
12. **The way in has a label of its own,** *In at the temple's door, out of the light.*, on H6's
    exit at 18,14; the plan's H6 brief (§4.2) had *Through the temple's door, into the nave. The
    light comes down through the roof ahead.* The nave is roofed (the palette's `vault`) and only
    the court at its head is open to the sky, so the plan's line would be false at the door.
13. **The place is `{ id: 'hearthfane', kind: 'dungeon', at: [250, 172] }`,** with no band (a built
    place reads its map's), in the area's `PLACES`; the atlas's `deep` link `hearthisle ->
    underdeep` at 250,172 is kept.
14. **H6's 18,14 is now a door** (it was a building square) and the exit; H6's walkthrough line that
    asserted a shut building moved into the temple's steps.
15. **`h6_warm` ends at *The ground here is warm as a hearthstone.*** Its second clause, that no
    grass grows within ten paces of the light, contradicts the map, which has grass at 23,14 and all
    round the column. The review of #779 found it, and the temple edits H6's map for its exit anyway.
16. **§3 owes the crawlers' two:** `UNPLACED` (`tools/tests/maps.ts`) holds `deep_crawler` for #757
    and `catcher` for #758 since #778, and §3's sentence named neither. The review of #779 found it.
17. **§4.2's head and §4.3 say H6's 31,0 is rock,** as #753's 5 has it (both said walkable on both
    sides), and §11's *I6's meeting* names row 0. The review of #779 found it.
18. **#764's doorway-check block stood in this section twice,** merged from main: one is kept. The
    review of #779 found it.
19. **The sacristan's `says` waits on having met him.** `meet()` says a matching entry without
    setting his `flag`, and the Sea and Shore lamps stand in the first room, so a company that put
    one out before it met him heard only *I told you* and never began 56, and one that put all four
    out in order was given the key with no quest begun. The wrong lamp's entry is now `after` both
    `q_lamps` and `q_lamps_wrong` and the key's entry `sets` `q_lamps`: his own words come first,
    then *I told you*, and the quest, its first entry and its goal begin on every path. §6's `says`
    is changed to match and the walkthrough walks both. The review of #780 found it.
20. **The wrong lamp's line says *the rest flare* and the log *The others flared*:** the plan's *the
    other three* is false once a lamp is out. §6's lines are changed to match. The review of #780
    found it.
21. **He stands, not "in the nave":** he is met in the vestry at 3,11, so the plan's *standing in the
    nave with his face turned up to the empty air* now ends *standing with his face turned up to the
    empty air*. §6's line is changed to match. The review of #780 found it.
22. **The arch's sign has no id,** where the brief gave it `hf_arch`: an id is kept in a map's `used`,
    and so in `shipped.json`, only for a sign with `read` (`readId`, `src/game/inscriptions.ts`), so
    it would be kept nowhere and nothing keys on it; H6's Hearth sign has none either. The review of
    #780 found the reason missing.
23. **The goal gives the order outright** (*Put out the four lamps in the pillar's order: the Sea, the
    Shore, the House, the Hearth.*, §6's own line), so the pillar's carving is moot to a company that
    has met him. It is the plan's, left as written: the owner's call (§11). Changed by #795's 8.

Decided by delegate for #756, each the owner's to overturn:

1. **The eleven niches are told in `hf2_niches`, not carved.** Eleven one-square notches do not fit a
   round chamber of 5–11 with three ways out; `bare: true` hangs nothing on the wall.
2. **The chamber is a disc** of rows 3, 5, 7, 7, 7, 5 and 3 at 5–11,5–11, the passages one wide; the
   side vault at 1–3,6–9 opens by a door at 4,8, the brief leaving its way in open. 58 open squares.
3. **The Hand's last man is told by an event, `hf2_last`,** on the chamber's north door (8,4): *The
   passage, and in it the Hand's last man up here, dead on his feet.* An encounter has no `look`; the
   keeper's own (§7, #761) comes after the event.
4. **The grey door at 8,1 is a door square with the sign `hf2_door`,** which has no `read` and keeps no
   `seen`. `GREY_DOOR`, the exit to `underdeep` 16,30, is exported and not listed. #757 listed it and
   moved the sign to 8,3, since an exit takes the company on arrival and a sign on its square is never
   read (its 15).
5. **The stair is floor at both ends:** the temple's 8,1 turned from `#` to `.` with `STAIR` listed;
   the crypt's 8,15 is `.` with the way up, a stair and not a door.
6. **`LOG_GIVEN` is exported from the crypt, which reads it,** where §4.1 has the setting map export it:
   I6 reads `ELEVEN_KEPT` from here, so one each way would be an import cycle. I6's map (#754, PR #782,
   open) may import it; `q_eleven_log` is owed to #763 in `UNSET`.
7. **The Grey Robe is ac 13 at 6,200 with no class list,** a point past the Cinder Robe (ac 12), which
   has none: §8's *the casters* is who wears it, not a bar. #746 takes it into its rung.
8. **`aware`, which the brief leaves open:** 2 for the champions and the keeper's group, 3 for the
   rats; the champions and the keeper stand, the rats roam. The keeper's group respawns at 2,880 as
   the champions: no quest names it and it has no `slainText`, so it is no guardian.
9. **The brief's three groups are kept:** 13.71 fights to a rest at 29 (aim 10.25 to 12.25, limit
   8.75 to 14.75), easier than the aim and inside the limit. The pay is 0.42 of the crypt's tenth, so
   lighter or fewer groups would only widen the shortfall; stronger monsters are barred.
10. **No two-under row:** the gate reads the crypt's two under as n/a, its floor, 29, being above the
    area's, so its groups count in the area's pool at 26, owed to #18 already. `tools/tests/gate.ts`
    is not touched.
11. **The place is `{ id: 'hearthfane2', kind: 'dungeon', at: [250, 178] }`,** with no band (a built
    place reads its map's), in the area's `PLACES` beside the temple's; the atlas's `deep` way
    `hearthisle -> underdeep` is kept.
12. **The map is named The Crypt** (§10), band `[29, 29]`, region `hearth`, start 8,14 facing north.
    The palette is the temple's rock greyed, every door the grey door's grey, stone and vault, `bare`.
13. **The walkthrough walks the crypt at 29, its floor** (the walk's level and the members' raised
    from 28 after the temple); the eleven are walked twice, shut without the log and kept with it set
    by hand.

Decided by delegate for #757, each the owner's to overturn:

1. **The frames are doors in the ways' walls,** each with a bay of three rows behind it (west 7–11
   or 8–11, east 21–24). A door keeps walls either side, so the squares the table names beside a
   frame (12,25, 12,27, 12,17, 20,21, 20,13) are wall: the store stands at 11,27, the groups in the
   bays.
2. **The crack is reached through the room behind the eighth frame,** not off the main way. The
   crawl way runs 24,2–13, so any way from the main way east to 29,6 crosses it and opens the
   hatch's secret to anyone; the room (21–22,14 and 21–24,15) goes on east and up a way at x 26 to
   the row-6 way, 26–29,6.
3. **The main way is one wide, 16,3 to 16,31** ("sixteen squares" read as up the middle at x 16),
   with side ways at rows 26, 22, 18 and 14 (three squares each way) and the row-10 way west, 3–15,
   to the door at 2,10. 200 open squares.
4. **The groups are regrouped so their levels rise from the grey door.** On the table's squares the
   deep knockers (28) stand furthest and the curve's rise fails (rank correlation below 0). The same
   eleven groups and monsters, moved (§4.6): rank correlation 0.13. The crack's knockers (28) and
   the crew guard (29.3) are furthest whatever is done.
5. **The Stair's head and the crawl way's door wait on #758:** 16,2 is a door and 16,1 rock, as the
   temple's stair was (#755's 4); 24,1 is a door with rock beyond, as the crypt's grey door was.
   `STAIR_DOOR` and `CRAWL_DOOR` are exported and not listed: an exit to an unbuilt map fails
   `tools/tests/maps.ts`. #758 listed them.
6. **The CREW ONLY door is a door square with the person on it,** and the exit is `after` either
   answer, as the weather check's exception has it. The second answer is *Go through and shut it.*:
   the brief's *Open it, go through and shut it.* runs past a line of the side panel
   (`tools/tests/people.ts`). Its words are the brief's.
7. **The two persons are named *The door marked CREW ONLY* and *The knocker at the crack*,** with no
   face, as the Ember Stone's sockets are.
8. **59's `done` is `[]`, never done, until #758:** its `seen: KNOT_LAST` names `underdeep2`, which
   fails `tools/tests/quests.ts` until built. 59 has the entries on `ud_knot1`, `ud_knot8` and
   `ud_hatch` and the goal at `underdeep`; the last frame's entry, the goal at `underdeep2` and the
   `done` are #758's. #758 built them.
9. **The Old Lantern's Staff is a staff,** 1d10+14 at 7,000, two-handed, with no class list (as the
   Battle Staff has none), its holiness in its words: no weapon carries an element. **The Grey
   Shield** is ac 8 at 4,000 for `MAIL` (as the Basalt Shield is). Both are in
   `src/content/areas/hearth/items.ts`.
10. **The place `underdeep` drops `planned` and keeps its name (The Underdeep) and order 13,** with
    band `[30, 30]`: the road's step reads the place's own name and band (`progression()`,
    `src/game/atlas.ts`), and without them the atlas check fails. The Stair takes a plate of its own
    (§7); its 30–31 is its own.
11. **`aware` and roaming, which the brief leaves open:** the rats 3, the keepers and knockers 2, the
    crawlers 3; only the two knocker groups the table marks stand. The rats respawn at 1,440 and
    every other group at 2,880; none is a guardian.
12. **The brief's eleven groups are kept:** 11.58 fights to a rest at 30 (in the aim), 100% at the
    floor and the pay 0.93 of the share, so lighter or fewer groups would only widen the shortfall.
13. **The plan's ids stand:** the quests `frames`, `crew_only` and `crack`; the flags `q_crew_open`,
    `q_crew_shut`, `q_crack_sealed` and `q_crack_wide`. No clash in `src/content`.
14. **The palette is the Dead-Drop's colours** with `wallStyle: 'smooth'`, `ceilingStyle: 'vault'` and
    `bare: true`; the map is named The Ways, band `[30, 30]`, region `hearth`, start 16,30 facing
    north.
15. **The crypt's sign `hf2_door` moves from 8,1 to 8,3,** its id and words as they were. An exit
    takes the company on arrival and `World.move` returns before the square's texts are said, so a
    sign on the exit's square is never read. 8,3 is the passage's square two before the door, where
    the keeper's group stood; 8,2 holds the knot, and two texts on one square break the 3-line rule.
    The crypt's walkthrough steps onto it from 8,4, and nothing stands on either of the crypt's exits.
16. **The CREW ONLY sign and the feet swap squares:** `ud_crew_sign` to 4,10 and `ud_feet`, an event,
    to 3,10. The interactable on a company's own square is a sign's, so with the sign at 3,10 the door
    ahead could not be spoken to and the company had to walk onto 2,10, where its way is a wall after
    either answer until it steps back and forward (a company that steps onto 2,10 first still does).
    From 3,10 facing west the door is the one ahead, and a step forward after either answer goes through.

Decided by delegate for #758, each the owner's to overturn:

1. **Eight landings and the seven flights between them.** The landings are two rows deep at the
   brief's rows and the flights two wide down the middle, turning a column at each landing, so every
   square the brief names stands on them. Eight landings four rows apart leave seven flights, not
   eight of eight squares; the table's "fifth landing" (16,16), "sixth flight" (16,12) and "seventh
   landing" (16,8) fit no count of the rows, so the squares are kept and the words are not. 153 open
   squares.
2. **The fourth landing runs east to the crawl way's door,** 13–24,18–19: the company lands on 24,18
   facing south under the door drawn in the wall at 24,17, with no way back up it. The brief gives
   none, and the head's way up is the way back to the camp.
3. **The last door (16,1) and the Hand's own door (13,1) are doors drawn in the wall,** as the Deep
   Mines' and the Dead-Drop's are: neither can be walked into, so `ud2_shut` reads true. `LAST_DOOR`
   (the brief's exit to `core` 8,14 north, its `needFlag`, `blockedText` and `label`) and `FIVE` are
   exported and not listed: #759 lists the exit, turns 16,1 to a door and signs the lock. #759 did.
4. **57 ends on a verdict, on the first landing seen held (`underdeep2:ud2_held`) or on the
   rearguard slain,** not on `HELD`: with the tokens in `done`, the brief's goal on a token (*Carry
   the token down the stair under the temple.*, at `underdeep2`) could never come up and
   `tools/tests/quests.ts` failed it. A token now ends the quest when its people are seen holding
   the landing. H6's walkthrough line that asserted the token alone did the quest now asserts the
   goal down the stair. A company with a token that comes down the crawl way lands past the first
   landing and meets neither the rearguard nor `ud2_held`: the goal stays up on the stair until a
   verdict or the rearguard ends 57. Rare, and accepted.
5. **The rearguard is a guardian with `until: HELD`, `leaves: true` and no respawn:** 57 names it
   slain, and the quests check refuses a slain key on a group that respawns.
   `tools/tests/structure.ts` refused any `until` on a group that never comes back; under the leave
   rule (#747) that `until` takes a standing group off, so the rule now passes a group that `leaves`
   (one condition and a fixture). Outside the content lane: the owner's to overturn.
6. **The captain is one person,** *The captain on the landing*, `after: HELD`, with six `says` built
   from `HELD` in its order (the verdicts first, then the tokens), so a verdict that carried
   outranks a token. The lines are keyed by flag in one table, so reordering `HELD` cannot misalign
   them. The `lines`, said only if no `says` held, which the captain's `after` rules out, are one
   neutral line.
7. **The Catcher is set off the line by its gate (`OFF_LINE`): 1,100 hit points and 34d8+40.** The
   line's 1,826 and 30d8+34 are won 29% at 30, 35% at 31 and 41% at 32; the Catcher is won 59% at 30
   (aim 30 to 70%), 67% at 31 and 84% at 32 (aim 90%, limit 75%) on the gate's hundred seeds. In ten
   sizings tried the rise from 30 to 32 never passed about 25 points, so half at 31 and nearly
   always at 32 cannot both hold: the gate's floor aim and its limit above are kept, and 31 sits at
   two in three. Level, armour, attack, speed, xp 19,733, `ranged`, paralysis and look are kept.
   The gate judges a dungeon's boss at its map's floor, 30, and two above, 32 (`BOSSES.hearthisle`),
   not at 31. Sized again by #752's 4; the aim settled by #796's 1.
8. **The sixth flight's crawlers are two, not three:** with three a day at 30 broke off at 7.85
   fights to a rest, past the gate's limit of 9 (57% of days ended on a fight that ran long); with
   two, 10.14 (aim 10.5 to 12.5, limit 9 to 15). The smallest cut that passes: the rats at eight as
   well would reach 11.32, in the aim, for another 398 xp a member, and the pay comes first. The
   other six groups are the brief's.
9. **`aware` and roaming, which the brief leaves open:** the rearguard 2 and the knockers 2,
   standing (the brief); the rats and the crawlers 3 and the keepers 2, roaming; the Catcher 3,
   standing (the brief). The rats respawn at 1,440 and the crawlers, the keepers and the knockers
   at 2,880; the rearguard and the Catcher never (guardians).
10. **The place is `{ id: 'underdeep2', kind: 'deep', band: [30, 31], at: [216, 172] }`,** with no
    name or order (the Stair is the Underdeep's, not a step of its own) and no `deep` way added: the
    area's band, 28–32, holds without one, and the atlas and curve checks pass.
11. **The palette is the Ways'** with the brief's floor `#505258` and ceiling `#303236`, smooth and
    vault, `bare: true`; the map is named The Stair (§10), band `[30, 31]`, region `hearth`, start
    16,30 facing north.
12. **The letter is `gullwick_letter`,** *Letter for Gullwick*, its text a line of what it is (*A
    letter sealed with a knot of rope, the seal Gullwick's.*) and the brief's words in two quoted
    paragraphs. **The Grey Axe** is `greyAxe`, 2d12+7 at 6,800, two-handed, `MARTIAL`, a point past
    the Flamberge.
13. **`ud2_creed` is a sign with the brief's id and no `read`** (chalk any company can read), as the
    crypt's `hf2_door`; it keeps no `seen`. The letter's chest shares `ud2_letter`'s square (15,21),
    as the brief has it; the pillars check passes.

Decided by delegate for #763, each the owner's to overturn:

1. **The ask's flag is `KEPT_ASKED`** (`q_eleven_asked`), exported from I6 beside the person who sets
   it, for the log and the walkthrough to read. The Bard's `ELEVEN_ASKED` is `q_eleven`, another flag.
2. **Her lines, the log's three entries and its goals are §6's, as written;** the title is *The
   Eleven Kept*, the entries' ids `asked`, `given` and `kept`. `hf2_eleven` stands as #756 built it.
3. **The ask is said at every meeting until the log is in** (`until` the hand-in's flag, as §6 has
   it), where Act IV's thirds ask once. A company without the log is told again.
4. **The early road's journal shows two of its three entries,** `given` and then `kept`: `asked` never
   does, so the log begins *He did.* with nothing before it. §6's words, kept; see 10.
5. **I6 imports the crypt's `LOG_GIVEN` and `ELEVEN_KEPT`** (#756's 6); the crypt imports nothing of
   I6, so the maps stay acyclic. `q_eleven_log` leaves `UNSET`, and nothing is owed for it.
6. **The Bard's gathering is untouched:** it reads the log's chest (`seen: downs_e3:e3_log`), not the
   item, and the walkthrough asserts the chest still seen once the log is handed in.
7. **The walkthrough's cleric is Maren at 27 with the second,** moved between Anchorhold, Crowness
   Light and the crypt by `travel` as the isle's walk does; the one fight is the chamber's champions at
   29. The old assertion that 4,19 was left for her now says she stands there.
8. **I6 holds its density** (100.0% within 8, the furthest 7) with 20 points where it had 19: a
   person is a point. No other figure of the gate, density and curve moves.
9. **The log begins on the log given only for a cleric of 27 with the second** (`start: [{ flag:
   KEPT_ASKED }, { flag: LOG_GIVEN, member: { cls: 'cleric', level: 27, prestige: 2 } }]`), not on
   the flag alone as §6 has it: the hand-in takes the Crowness log from any company, and the Shelf's
   road carries it, so a company with no such cleric was shown a goal no one in it can finish. Once
   its cleric is 27 with the second the log is there, reading from the log given. The quests check
   (`satisfy`, `tools/tests/quests.ts`), which the issue does not name, learns a `member` condition on
   a start: it raises a fitting member to the level and the prestige, and every other condition is as
   strict as before. The walkthrough plays a cleric of 27 with the first only, one of 26 with the
   second and none: her words again, never the ask, and no journal (the same three fail on the old
   `start`, and on an ask gated by `{ cls: 'cleric' }` alone).
10. **The early road reads a meeting ahead of her, accepted:** the hand-in's `early` lines end on *Now
    I know.* and send nobody, yet the log's `given` entry says she sent us and its goal sends the
    company to the crypt; her next words (the log given) do send it. A hand-in sets no met flag, so
    her introduction is never said on that road. The plan's words are the owner's and are kept; the
    owner may prefer `early` to end on the send-down line (§11).

Decided by delegate for #759, each the owner's to overturn:

1. **The room's floor is 3–13 by 4–11, rounded, under a north wall on row 3** with the panel at 8,3
   a wall square; the passage 7–9 by 12–14 and the door at 8,15 a door square carrying the exit, as
   the Stair's 16,1 does. Every named square holds: 3,9 by the west wall, 7,4 to 9,4 along the
   panel, 8,5 three squares in counting the panel.
2. **The eight alcoves are empty, round the wall:** either side of the panel in its row (6,3 and
   10,3), two in each side wall (2,6, 2,9, 14,6 and 14,9) and two in the south curve (4,11 and
   12,11). The sentries are called, not placed.
3. **The palette is pale grey walls going to a white glass roof** (`ceiling: '#e8e4d8'`, the
   brief's), `smooth`, `vault`, `bare`. No other square is marked: the panel is a wall and the
   events say what it is.
4. **The thinned group has `until: { flag: VASK_FALLEN }` and `leaves: true`,** which the brief does
   not give: the Council can sit after the fight (`keep.ts` sets `q_throne_removed` before an ending
   and after one), which would raise Vask and two Hands at the panel for a second fight while he
   knelt by the wall. The walkthrough plays it.
5. **Both groups carry the clock, the parley and `slainText`:** the thinned is a second def of the
   one group (§4.8).
6. **Wenna's words for a company with Fane's map set `RING_GIVEN` themselves** (`sets` on that
   `says` entry): a person's `flag` is set only on her own first lines (`meet`,
   `src/game/people.ts`), so those words would have given the ring and never the flag the chapter
   and its goals read.
7. **Vask is set off the line by the Heart's gate (`OFF_LINE.vask`): 1,800 hit points and 22d8+23,**
   the line's 1,922 and 32d8+33. Level, armour, attack, speed, xp 20,373, role, look, calls and
   sprite are kept. Won 65% with the Hands first, 64% going for him first, 45% with the sentries as
   they come and 91% with no clock (400 seeds): a heavier Vask with a lighter blow runs the wrong
   way, and the plan's one in three for the clock left to run measures 45% (§7).
8. **The gate judges the Heart on its boss's odds** (`tools/tests/gate.ts`): `BOSSES.hearthisle`
   gains `core:core_vask` and `core:core_vask_thinned`. A map whose every group is a boss has no
   floor pool and no day (it printed 13% of fights won against nine in ten and 0.11 fights to a rest
   against twelve, which no Vask sized to two in three could pass), and a boss is judged two above
   its floor or at the cap where that is as high as it goes: at its floor alone where the floor is
   the cap, as #745 waived the curve's rise at the cap. The gate reprinted before and after moves no
   figure (only the Heart's two n/a lines read *above its floor* now). Outside the content lane:
   confirmed by #752's 6.
9. **The owed row stays at the curve's as-built floor,** `xp: 42946, gold: 8200`, `whose: '#744'`,
   its `why` that the Heart is built and a clear falls short by 3,988 xp a member and 20,120 gold:
   the crypt, the temple, the rim, the Stair and the Ways fell short of their xp shares (0.42, 0.74,
   0.74, 0.90 and 0.93), which the Heart's count hides (the curve counts both of Vask's groups where
   a clear fights one); the gold gap is not the shares' doing, and the Heart adds none. No group
   added and no monster strengthened. (#792's 3 sets the floor again, and its 6 the issue.)
10. **64:** the item `queens_signet`, *Queen's Signet*, with the plan's text, read from the pack;
    the log keyed on the item and the four `q_signet_*` flags, "and the like" written *It went to
    the hold, in a cloth.* and *It went to Tallis, in a cloth.*, its goal at `shelf`. `UNSET` owes
    the four flags to #765 (the three were #759's; `q_signet_sea` is added) and drops the endings'
    three, which Wenna's answers now set.
11. **The lock is signed** in `src/content/locks.ts` on `q_ember_lit` at `underdeep2` 16,1, its
    `what` the door and its `reason` the plan's words with the road's five; the list's comment gains
    Act IV's none and Act V's one.
12. **The Stair's walkthrough lines are turned:** on four of the five the door is blocked with
    `LAST_DOOR.blockedText`, `ud2_shut` is said and the way back up off the stair's head is open;
    on the five `ud2_shut` is not said and the company walks onto 8,14 facing north, and back
    through onto 16,2 facing south.
13. **The parley's question was cut by one clause,** *, and looks at whichever of you carries the
    maps*, for the side panel's seven lines (`tools/tests/people.ts`). Superseded by 17: the brief's
    whole question stands.
14. **`tools/tests/people.ts` lets a parley be nothing but its refusal where the group has a slain
    text of its own** (`refusable`: another answer or `slainText`): it wanted another answer that
    sets a flag, and the Heart's one answer, *Stop him.*, is the brief's and the issue's, with no
    walk past to remember. Only the Heart's two groups are admitted, and a fixture proves each case.
    Outside the content lane: the owner's to overturn.
15. **Rimewater's walkthrough counts Act III's lock on its own map,** not on the road: it asserted
    `LOCKS.length === 1`, which the Heart's lock makes two (the issue's "two of four"). Outside the
    content lane: the owner's to overturn.
16. **The Heart's first line, `core_door`, is on 8,13,** one step in from the landing square 8,14: an
    exit takes the company on arrival and fires no event on the landing square (`World.move` returns
    from the exit branch before `eventsHere`; docs/areas/kilns.md §9, decision 10, records the same).
    Same id and same words; the walkthrough takes the step for real, which `see()` had hidden by
    teleporting onto the square.
17. **The brief's whole parley question stands, and the side panel's lines are a person's alone**
    (supersedes 13): a group's parley is a `ChoiceScreen` asked in the box (`Game.parley`), where the
    question takes 3 of its 5 lines; the side panel's seven are a business's (`visiting`, under an
    `InteriorScreen`). `boxFaults` holds a group to the box and a person to both, as before, and a
    fixture proves each. Outside the content lane: the owner's to overturn.

Decided by delegate for #760, each the owner's to overturn:

1. **The goal up the cleft keys on the isle visited, not the strand seen** (`visited: 'hearthisle_h6'`):
   the start's second way, the isle for a company over early, must begin with a goal
   (`tools/tests/quests.ts`), and none held before the strand. It holds as the boat grounds; the
   entry `isle` keeps the strand.
2. **The door's goal, on the Catcher slain, is at `underdeep2`, not `core`:** a goal's words name its
   place (`namesPlace`, `tools/walk.ts`), and *Through the last door at the stair's foot* names the
   Stair, where the door stands. Its words are §5's.
3. **Three goals' words gain their place's name for the same check:** *to Hearthfane, the temple at
   the column's foot*, *at the heart's panel* and *the panel at the heart waits under hers*. Every
   entry is §5's word for word, and each entry and goal fits two lines of the page.
4. **Every key is a built one and none is added:** `core_door` on 8,13 and `ud_in` on 16,29, one step
   in off their landings (#759's 16), `ud2_word` as `KNOT_LAST` and the Catcher a guardian.
   `shipped.json` takes nothing new.
5. **The walkthrough puts the road behind done by hand** (`roadDone`: each earlier chapter's end by
   its first way, as the quests check satisfies a condition), so the quest's own end is said once in
   each play; Acts I to IV are their own walkthroughs'. The road's five (`FIVE`) are put by hand too:
   `q_peak_stood` and `q_ember_lit` end no chapter of their own.
6. **The verdict, the token and Fane's map are put by hand:** #764's own flags (`q_throne_removed`
   and `q_throne_tallis`), `q_token_cousin` with the badge and `meridian_map`, as the Heart's box play
   does. The Council's hearing is the shelf's to walk.
7. **Only the fights on the chapter's line are fought:** the Hand's best, the crypt's keeper, the
   rearguard, the Catcher at 31 and Vask or his thinned group at 32. The rest are the box plays'.
8. **The early company crosses at 27 without the Peak Stone** (`q_peak_stood`), The Window done and
   The Warning not; from the temple on its steps take the curve's levels (28 to 31), as the walk's
   band check sets them.
9. **Gullwick's shore is owed to #765** (`owed` in the walkthrough): no line there reads an ending's
   flag yet. Whichever of the two lands second makes the check.

Decided by delegate for #746, each the owner's to overturn:

1. **The rung is all nine, at 28, and `GEAR_TOP` follows to 28.** The `--gear-grows` what-if now
   names its top (*past level 28*), where it said 10, stale since the ladder passed 10.
2. **Who takes what (`ACT_V`):** each class the piece bettering the one it took at 25, plate's
   wearers the mail too; the blade and the Old Lantern's Staff go to every class they better and that has
   no better piece of its own (§8).
3. **A rung can be `found`:** its pieces carry no plus, so the test read them as wares; a found
   rung's are held to a find's place and to one more rule, that no shop sells them.
4. **A found piece may be a person's gift:** the Old Lantern's Staff is the knocker's for *Widen
   it.* (61), so a found rung counts an answer that gives it; earlier rungs keep chests and drops.
5. **None is owed:** every piece is placed, so each `from` is `['hearth', '']`, with the box's issue
   (#753 to #758) beside it.
6. **What the rung moved past a limit was owed to #752, no monster retuned:** in `OWED` the crypt's
   15.74 fights to a rest at 29 and Vask's thinned group's 89%; the harness's 12.8 at 28. Settled
   by #752's 2.
7. **The staff's holiness is its words:** the issue's table has it *holy*; the item carries no
   element (#757's 9), and the rung takes it as built. Every other figure is the table's.

Decided by delegate for #765 (half A: Helmstow and the halls), each the owner's to overturn:

1. **The empty throne room is the extra link on Vask's door** (`keep` 7,4), `after` his `until` and
   `until` the removal, with one line: the doorway and locks checks want a twin there (#764's 6).
2. **Aumery Vask, before the Council, stands after the chain,** a person in whichever room keeps the
   door, so it never opens on him alone; the steward is at 7,5, as §12 has him.
3. **The endings' proclamations are events at `keep` 6,8 in §12's words:** the Regent's sign fills the
   log at 9,8; the opened is `after: ENDED, until: IRONS`, so the line check sees the pair apart.
4. **The Guildhall's Luminary is at `harrow` 12,11,** beside its step as Aldith sits by the inn's,
   `after: ENDED`: the relit words are its lines and the other two its `says`.
5. **The clerk at the gate (64) is built here** with §6's words, `until` the four `q_signet_*`, a `says`
   after `SAT`; `UNSET` drops the three flags it sets and owes `q_signet_sea` to the other half.
6. **First of all is taken as written** on Ruan and Ysolde, so an ending hides the Compact's question
   and the journal's reading for good. Superseded by 8.
7. **The density counts a new feature whatever its presence:** Helmstow 26 to 27 points, the keep 12
   to 14 and the Foreland 29 to 31 (97.4% within 8); the gate and the curve are unmoved.
8. **An ending's words wait on a business still open** (supersedes 6): Ruan's question and Ysolde's
   journal come first until done. Ordgar's and the priestess's first words change nothing, so stay behind.
9. **Vask's `until` ends his hand-ins at the first step on the isle:** the survey wand (300 gold,
   `q_ashcombe_done`), the tenant's paper (50) and the oil order; §12 and 9.1's 23 require it.

Decided by delegate for #765 (half B: Gullwick and the rest), each the owner's to overturn:

1. **The Walk Home's entry at the open gate came in with the Helmstow half** (#788): its
   `seen: 'shelf:gate_open'` names that half's event, and `tools/tests/quests.ts` fails a `seen` on nothing.
2. **The knockers are `ud_mines`,** §4.6's id, standing at 6,3 as the corridor's others do and told by
   a once-event, `dm3_open` at 7,3, with the brief's look: a group has no `look` (as #756's 3).
3. **The gate leaves `ud_mines` out** (`BEHIND`, `tools/tests/gate.ts`, outside the lane): no company at
   the corridor's floor meets it. The curve counts it, as its pay is real; the Kilns' lead holds at 19.3.
4. **Wolfram's line waits on his answer too;** Hester's four come at every meeting before all her words
   but two said once, and an ending's word comes first, so the crack's is heard before an ending only.
5. **The Sunder's groups are the fifteen the most of whose monsters are its own,** the K3 Rift's two with
   them; its dens' keepers, its Warden, `k3_door`, `l4_brood` and the three the wood or the Hand lead stand.
6. **The harbourmaster's and the Reader's lines are the brief's words alone,** with no line of
   narration before them, as the brief gives none.
7. **The sea stands `after: { flag: WENNA_HOME }`, not the plan's `ENDED`:** its *Throw it in.* has the
   girl beside Hild look round, untrue while Wenna is still at the Core.

Decided by delegate for #752, each the owner's to overturn:

1. **The line is made again at 28, 30 and 32 in the Hand's steel, and `LEVELS` gains 30:** `node
   tools/harness.ts --calibrate --write --levels 28,30,32`, 200 seeds a point, about 25 minutes on
   four cores; every factor under 28 is as it was.
2. **The harness's company fights 10.6 to a rest at 28, rising to 11.7 at 32,** where 28 was owed at
   12.8. `OWED` loses #752's two: the crypt fights 14.16 at 29 and Vask's thinned group is won 77%.
3. **The isle's monsters on the line are restated on it,** keeping id, look, sprite, level and xp.
   Act IV's Deep Knocker and Inspector, placed at 28 (#22), are held as they stood (`OFF_LINE`).
4. **The Catcher: 1,300 hit points and 32d8+37,** won 56% at 30 and 79% at 32 on the gate's seeds.
   Half at 31 and nearly always at the cap cannot both hold: the floor, binding, is kept. Since #793:
   57% and 80% (#796's 1).
5. **Vask: 1,850 and 22d8+23, and his sentries on twice the soldier line's hit points (890):** the
   Hands first win 66% and the clock let run 28%, both of the plan's figures; on the line, 45% let run.
   Since #793: 62% and 28%, 60% and 33% on the gate's hundred (#796's 2).
6. **The Heart's two gate rules are kept and written down** (EXPANSION §5.2, MONSTERS §1); `rate`
   keys its cache on a group's clock too, which moves no figure.
7. **`--abilities` reports the Heart as built on the gate's bot,** which the plan sizes Vask by: 64,
   69, 28 and 83% with no clock (`--seeds 100`, the gate's hundred; the default 200 prints 70, 71, 29
   and 87). The thrifty bot keeps its spells, and lets the clock run at 66%. Since #793: 60, 69, 33 and
   82%, the default 200 65, 69, 27 and 87, the thrifty bot 64% (#796).
8. **The armoured at 29 and 31, read between, run long** (47 and 52% of days end badly) where the
   line's armour rounds up; no armoured monster stands there, and the line is not nudged. Made at
   29 and 31 since (#793), they end 38 and 49%, held at 28's and 30's hit points (#793's 3).

Decided by delegate for #793, each the owner's to overturn:

1. **`LEVELS` gains 29 and 31, the rest as they stood, since the armoured ran long read between:**
   `node tools/harness.ts --calibrate --write --levels 29,31`, 200 seeds, 1,281 s on four cores.
2. **A point made under a level one up that stands is held under its hit points, its blow solved
   again:** the soldier, the elite and the brute at 29 passed 30's and failed the gain check.
3. **The armoured at 29 and 31 are not nudged:** held at 28's and 30's hit points they end 38 and 49%
   of their days badly (13% free of the hold), and 28 and 30 must stand; none stands at 29 or 31.
4. **The isle's four at 29 and 31 are restated on the line,** keeping id, look, sprite, level, role
   and xp: the champion, the preacher, the Grey Hand and the crawler (§7's table).
5. **The sentries stay at 890 and 5d7+10,** twice the soldier as #752's line read him: they are set off
   the line on Vask's odds, and a restating is not a tuning (twice the made soldier is 874).
6. **`kneel` kneels at the feature the world holds, found by its id where the company stands:** on a
   zone map the world holds a copy in the outdoors' cells, so a test of identity failed there.
7. **The inscriptions check reads `shut`, `lifts` and `after`, each in its own words,** with a fixture
   for each, so a way that waits on a reading is seen however it waits.
8. **No limit, aim or owed figure of the gate is changed:** every line that moves is Hearth Isle's and
   inside its limit (Vask 60% with the Hands first, 33% let run), so nothing is newly owed.
9. **A stale statement of the Hearth's band is put right where found:** the passage check's comment
   says 28-32 now, the only one in the tools, the source and this plan.

Decided by delegate for #792, each the owner's to overturn:

1. **A twin is read as the maps and pillars checks read one:** two groups of a map on a square, one
   `until` a condition and the other `after` it, by structure. Only the Heart's pair is caught.
2. **The lesser by xp counts, the whole group,** so its xp, gold and lead are one clear's; a tie keeps
   the `until` group. The price window still reads every group's monsters, the dearer twin's too.
3. **The owed row's floor is set again from the print,** `xp: 38317` for 42946; its `why` names the
   Heart among the shares short (0.72). The gold stays; #759's 9 stands as it was.
4. **The Heart's figures in §8 and §11 are read again from the print,** the lead among them (31.4 for
   31.9, moved with the clear). The gate, the density and the harness are as they were.
5. **Only a leaving `until` group on a square of exactly two has a twin:** one that stays till it
   is killed may be met beside its twin, and a third group makes the clears 2 or 4, not the lightest.
6. **The row's `owed.whose` moves from '#744' (#745's 1) to '#794',** the open pay issue that brings
   the area up; the plan's present-tense owed sentences say #794, and the old blocks stay as history.

Decided by delegate for #795, each the owner's to overturn:

1. **Vask's hand-ins go to three persons in turn** (supersedes #765 half A's 9): Vask, then his steward
   from the first step onto the isle, then Wiglaf once the Council has sat; one stands in each state.
2. **The steward stands on after an ending,** since the opened leaves nobody else at the door; a `says`
   after any ending comes before his first words, which are not true then.
3. **The steward and Wiglaf hire nobody, so no `early` for them, nor an `after`:** an `after` is said to
   any company whose flag is set, so it would hide his first words from those who gave Vask the wand.
4. **`tools/tests/people.ts` counts the wand's takers at three** (outside the lane); the walkthrough meets
   Vask by his hire (`toVask`), as `meetWho` finds one person only.
5. **The Reader's crack is a once-line** (`q_reader_crack`) after her introduction and before the endings'
   words (supersedes #765 half B's 4); her reading and introduction, hidden below them, come first too.
6. **The rest of the audit leaves the words first:** what they hide is talk; Hild's Greywater line stays
   below, as first it would send the company for a girl who walks behind it (Ruan, Ysolde: #765's 8).
7. **Hereswith's early hand-in ends on the send-down:** a third paragraph in her voice, so that the entry
   `given` reads true of both roads; `done` is as it was.
8. **The sacristan's goal points at the pillar** ("in the order the pillar gives", as `asked` has it);
   the Hearth's walkthrough asserts that no goal of any quest names the four lamps in sequence.
9. **The four log entries that named Vask are true of whoever took the hand-in** (`paid`, `lead`, `vask`,
   `order`): their ids and conditions stay, and the goals that name him still point at the keep.

Decided by delegate for #796, each the owner's to overturn:

1. **The Catcher's aim is the floor's, as the gate states it** (30% to 70% at 30, 90% at 32): half at 31
   and nearly always at the cap cannot both hold (§7), so 57% at 30 and 80% at 32 stand (§8).
2. **Vask's aims are the gate's:** a quarter to a third with the clock let run (33%), on the sentries at
   890; the Hands first 60%, not two in three; going for him first (69%) is better, and one the design allows.
3. **The figures are the printed ones** (`node tools/test.ts gate`; `--abilities --levels 32 --seeds 100`);
   the 400-seed tries were run again after #793. No code, game text or figure in a test moves.
4. **EXPANSION §5.2 and MONSTERS §1 and §9.3 take a clause each;** #758's 7 and #752's 4, 5 and 7 gain
   a cross-reference to this block and no more.

Decided by delegate for #794 (the depths), each the owner's to overturn:

1. **The Ways take one group, `ud_rats3`, twelve deep rats at 10,22 in the bay behind the third west
   frame,** where `ud_rats` tells of rats and none stood: 10,962 xp a member, 1.04 of the share, in
   one group where keepers or knockers would take two. `aware: 3`, roaming, `respawn: 1440`.
2. **The Stair takes two standing groups of knockers,** `ud2_knockers2` (three, 18,30) and
   `ud2_knockers3` (three and a keeper, 19,22): 11,164, 1.06. Knockers (28) are the mix's gentlest:
   the day at 30 goes from 10.34 to 10.71 fights, into the aim, where twelve rats took it to 9.5.
3. **`ud2_knockers2` stands nearest the head,** 2 steps in, the first group past the way in and the
   gentlest; `ud2_knockers3` is 11 steps out, past the rearguard, the rats and `ud2_crawlers1`. The
   Stair's rise goes from 0.19 to 0.41. The head's stand off the way down, so a company may pass
   them by.
4. **Each box's finds come to 8,200 gold,** its 6,372 and half the Heart's 3,540, rounded up to the
   hundred: the depths' 16,400 and the isle's half meet the 28,320. The brief's chests are raised
   (the letter's left at none) and four are added, gold alone.
5. **The new chests stand where a box keeps one:** the crew's stores (7,21) in the rats' bay, a second
   keeper's store (24,17) in the one bay with nothing in it, more of the dead's packs (13,22) by
   `ud2_dead` and the Hand's takings (20,2) at the last door, past the Catcher. No line is added: the
   boxes' chests have none, and the events beside them say what they are.
6. **The runs from the camp grow to twelve and nine,** each inside twelve fights; §4.6, §4.7 and §8
   say so, and the ways up still take a company back to the camp between them.
7. **The walkthrough asserts the raised and the new chests' gold,** and fights no new group: none
   stands on the story's way. The Heart, the Catcher's and Vask's groups, the gate's owed figures
   and the row's `owed` (the last pull request's) are not touched.

Decided by delegate for #794 (the isle), each the owner's to overturn:

1. **Nine groups more, of each box's own kinds, so each box pays 1.06 to 1.10 of its share:** I6 two
   (three and four champions), the temple four (three champions thrice, two once) and the crypt
   three (twelve rats twice, four keepers); H6, at 1.07, none. The isle's four pay 21,492 a member.
2. **No new group stands within two squares of another it could join:** a company beside two groups
   of twelve or fewer fights both at once (`adjacentGroups`), a fight the gate never weighs.
3. **The temple's stand off the vestry, the lamps and the stair's landing but beside the treasury's
   way:** three in the court; two at 9,11, beside 9,10, the one way east to the treasury's door, so
   a fight there is forced; the west column stays free to the pillar, the vestry and the House lamp.
   None stands in the vestry, where the sacristan hides.
4. **The crypt's came up through the grey door she left open:** rats at the chamber's dead and the
   Hand's, keepers with no bay; the passages, one wide, take none.
5. **The temple's gentler groups bring it into its aim,** 11.27 fights to a rest at 28 (8.91 on
   main); the crypt's dearer ones bring it in too, 10.46 at 29 (14.24); I6 reads 11.63 (11.56).
6. **The gold follows the xp shares, rounded up to the hundred:** H6 2,900, I6 2,400, the temple
   4,100 and the crypt 2,900, 12,300 in all. Every chest the boxes had is raised.
7. **A new chest only where a group guards a place for one:** behind the preacher at the temple's
   door (`h6_toll`) and under the arch (`hf_tithe`). The rim's gold stays in its takings; the crypt,
   six groups in 58 squares, takes no chest more, so its cups and pack hold its share.
8. **The new chests take no line:** a chest has no text, and each stands by a line that says its
   place (`h6_front`, the arch's sign), so the boxes' lines and their counts are as they were.
9. **No owed figure is re-recorded; the curve row's `owed` is removed:** each box's two-under
   row stands at the 100% owed to #18 and the pool reads 94.2% of 51 groups with both halves in; a
   clear pays 47,836 xp a member and 28,700 gold, past both budgets, so nothing is owed to #794.
10. **The walkthrough's chest lines say the sums of all nine chests,** the two new ones' too. It
    fights none of the new groups: none stands on a square it walks; `hf_nave2` stands beside
    the treasury's way, which it takes by `travel`.
11. **The chamber's four keepers are the first machine met on the isle:** they are in sight from the
    niches' square, so the keeper's look is said there, before `hf2_last` and the door's keeper. The
    brief's table and the crypt's and the walkthrough's comments call the door's keeper the first no
    more; the keepers stay where they stand, the least change that is true.

Decided by the owner's delegate for #18, each the owner's to overturn:

1. **An elemental weapon,** its blows carrying lightning: its dice a rung under the ladder's at the
   band, so the die is the gain; a class list as its kind has. The rule if the area session finds
   better: an element its own area's monsters are not immune to and the next area's are weak to where
   one is.
2. **A stat item,** a robe raising personality by 3 while worn: slotted, so one is worn at a time.
3. **Found, off the quest's path,** off the Bowl or the rim, behind a hinted secret door (band 28 to
   29); never in the Underdeep or the Core; one of the two in a locked chest (`locked: true`), the
   first the area holds. Each priced inside Hearth Isle's window, sold by no shop, sellable at half
   as all found gear is. Off the ladder: no `GEAR` row, so no figure moves.
4. **Names and texts pass the pillars;** two lines to a find.

Decided by the builder for #864, each the owner's to overturn:

1. **The hide is a cell in I6's rim, behind a second secret door in its east face** (8,15). The
   area's three secrets hold gold and a find or are a way (H6's cache the salts and 1,000 gold, I6's
   takings the Grey Mail and 1,700 gold, the Ways' hatch a crawl way on), so none was free; the
   Underdeep and the Core are barred. The Bowl holds the chapter's road (the cleft up to the temple's
   door) and the camp, and H6's east wall is pinned against I6's (`outdoors`), so the cell is cut in
   the rim's rock on I6's side, which the chapter never enters (§4.3). Three squares of dirt floor
   at 5 to 7 on row 15 with the door at 8,15 add walkable squares and take none away: every id, door
   square and chest id stays, and the takings' door is still I6's first secret.
2. **Both finds in the one cell,** the robe in a plain chest at 6,15 and the mace in a locked one at
   5,15 behind it: one detour, one hint; a company with neither pick nor key still takes the robe
   and sees the lock.
3. **The mace is a Slag Mace with lightning on it,** the Grey Blade's kind (knight, paladin, ranger,
   barbarian and cleric, four of the premade six), where the bow is the ranger's alone and the knife
   and the staves the thief's and the casters'. Its steel is the Slag Mace's 2d12+5, the rung under
   the Grey Blade the ladder wears from 28 (2d12+6), so the lightning die is the gain: `hits()` 21.5
   against 19 (18 for the steel alone).
4. **Lightning stands.** Of the 11 monsters the isle places, all past 10, 4 are weak to it and none
   is immune or resists it; nothing is weak to fire, cold, poison or shadow; holy and nature are the
   machines' immunities. No area comes after the isle, so no element is the better the delegate's
   rule asks for.
5. **The robe is the Grey Robe a point lighter,** AC 12 for 13, anyone's as that is, raising
   personality by 3: the stat is the gain, as the die is the mace's. Worn it is a step of bonus on
   what a caster heals (the cleric's personality 15 reads 18); in the pack or the bag it gives
   nothing, and the armour slot makes it one robe at a time. Spell points are figured from the stat as
   it is born and are not raised.
6. **The mace is in the locked chest,** the robe in the plain one: the better find behind the lock,
   and what a company that cannot open it still carries away is a thing worth the walk.
7. **The prices are 6,950 and 6,350,** the isle's own scale for found gear (the Hand's steel stands
   at 6,200 to 7,000 where Cinderport's wares stand at 2,000 to 3,100): the Grey Blade's 6,600 and a
   point of plus (150, `PLUS_PRICE`) to each point of `hits()` the mace gains over it (2.5, 375,
   taken to the 50 below), and the Grey Robe's 6,200 less 150 for its point of armour and 300 more
   for the raise. Both are inside the window of 7,000 and under the Grey Mail's 7,000, the dearest
   find, so that line of the curve stands as main prints it; they sell back at 3,475 and 3,175.
8. **The names** are Levin Mace and Vigil Robe (§10): ten characters each, so the mace's sheet line,
   "WEAPON Levin Mace, LIGHTNING, EXPERT", ends at 235 of the 334 the column allows.
9. **The hint is a vein of glass in the turf** (`i6_scorch`, 9,15): a thing seen on the door's near
   side that explains nothing and is there at every hour, as the hint rule asks. The cell's event
   says what is in it and no more.
10. **No chest holds gold,** so I6's 2,400, the area's 28,700 and §8 stand.
11. **"Off the road" is measured by walking,** from every square on a shortest walk from the strand
    to the temple's door, the isle's two boxes laid side by side as the world lays them: the glass's
    end is 26 squares from it by the way a company walks and 21 as the crow flies, as Wrackholm's
    hollow was (#861).
12. **The walkthrough walks the detour in I6** on from the Hand's takings, the company's thief
    (Ottilie, born to Lockpick, #857) picking the lock, and plays the lock's refusals on a game of its
    own against the real chest: the checks were each broken in the tree and watched to fail (the PR
    lists them).
13. **The pilot is not stranded and does nothing new.** It reads the world through what it has seen;
    its full run stops at Thornmark's chapter (docs/PILOT.md) and never reaches the isle; the door is
    drawn as rock and the explorer suspects only cells drawn as wall; and a locked chest it met would
    be pressed on once and walked past, as a locked door with no key is (#857).
14. **The door stands on row 15, not row 13 where it was first cut,** for the art suite's wall
    dressing (`tools/tests/art.ts`): a secret door is a wall face to it, the painter dresses one wall
    in five by a hash of its square (`wallDressing`); I6's zone, 8 faces with the takings' door
    dressed, holds the cap of half only while the new door is bare. The door at 8,13 drew a sconce
    and took the zone to 8 of 12 (66.7%); 8,15 is bare, so it stands at 4 of 12 (33.3%). The cap is
    not moved; the cell is two rows down the same face, still between rock above and below.

## 10. Names

The Lanterns' English, kept, as the Whitespine's and Sunderwood's were (NAMES.md §2, §4): the isle
is the Hearth's and the pilgrims' from everywhere, and has no people of its own to name it. A few
old names on its oldest places, the crew's worn words, as NAMES.md §1 allows and never says:

| Name | What | Meaning, or what it replaced |
|---|---|---|
| Hearth Isle | the area and the zone | kept |
| The Hearth | the column | kept |
| Anchorhold | the anchoress's cell on the east rim | kept: an anchorite's hold, and the crew's word under it |
| Hearthfane | the temple | fane, a temple, the Crown's old word; the plan's "the temple" |
| The crypt | the temple's first crypt | the docs' plain name |
| The Bowl | the green bowl inside the rim | the plan's words, kept |
| The Strand | the south shore where the boat grounds | Pilgrims' Strand in full; the plan's "the shore" |
| The Hand's Steps | the causeway's end on the south-east rim | new: where the Hand came up |
| The Ways | the Underdeep's first level, the hull's service ways | the docs' plain name, as the Sleepers' Bay is; the Underdeep on the atlas |
| The Stair | its second, the stairs down to the heart | the same |
| The Heart | the Core's one level | the same; the Core on the atlas |

Two people are named here, each grepped against `src/content` and `docs/` first: the elf of
Henlys in 57 is **Talwyn**, of the elves' tongue (docs/areas/thornmark.md §10: *tal* brow and
*gwyn* white, a Cornish name of the tongue's shape that echoes no one on the road), and the
Council's clerk is **Wiglaf**, the Foreland's English, a name used nowhere else and not one more
-ric beside the keep's Wulfric, the lodge's Godric, the old champion Edric and the Watch's prior.
No place's name is new in any people's tongue, so NAMES.md §4
gains one line: *Hearth Isle (step XII): the Lanterns' English, kept, with Hearthfane for the
temple; the deep's levels take the docs' plain names.*

The vigil cell's two finds (#864) keep the Lanterns' English. Levin is the old word for lightning, a
worn one of the kind NAMES §1 allows and never says, and the mace after it is the Slag Mace it was
cut from. A vigil is the night a pilgrim keeps at the light, and the Vigil Robe is what is worn for
it, in a cell cut for the keeping. Neither name says what it does: the sheet says LIGHTNING, and the
stat says personality (§9, #864's 8).

## 11. What was cut

- **None of the land:** both boxes are built, the isle's 1,027 land squares being about one zone
  map's worth (§1).
- **The Wardens' siege** (DESIGN §8, §10.2): named and never designed; the Compact handed to the
  Wardens shows on the strand instead (§6; §9, call 10). With it go the Ashfall crossing made
  harder for that company and the Compact as a fence for a Partner: the plan pays the ferry, the
  runner's word and the sea lanes.
- **Master trainers** (DESIGN §12, M3): wait on the skill tiers (#18); a parked line in the epic
  (§9, call 11).
- **#56's 62 and 63:** the reach's, with the Buried Tower and the Vault (Phase 1.6).
- **A second way into the Ways from the Hand's Steps:** the grey door opened for her hand and
  opens for nobody else; an event, not an exit, and no lock (§9, call 3).
- **A fail state at the Core:** the light holds at a thread; the choice is always the company's
  (§9, call 7).
- **Wenna's own voice at the panel beyond her two lines and her three afters:** the ring in the
  hand and *you choose* are the scene; the rest is the journal's.

Owed, from H6 (#753):

- **Two under, the isle is won every time:** 100% of fights at 26, where the gate wants no more than
  a quarter (limit 90%). It is owed to #18 as every Act IV box's `under` is (`hearthisle_h6: under`
  and `Hearth Isle: under`, `OWED` in `tools/tests/gate.ts`). The issue's "one at 26 no more than one
  in four" is not met: stronger monsters are barred and fewer groups would not lower it (§9.2,
  #753's 11). The owner's or #18's.
- **The chapter's first step** and the strand's shard (`hearthisle_h6:h6_strand` and `h6_shard`) are
  #760's, written: `tools/tests/quests.ts` owes neither the chapter nor the zone's step now.
- **The free fare** for a Partner is built (#765): the last crossing's fare is `free` at both ends on
  `q_compact_over`, so the runner's word that the boat is the Partner's both ways holds.
- **The gear's rung** is built (#746): the Grey Knife (`greyKnife`), built here
  (`src/content/areas/hearth/items.ts`), is on the ladder at 28; the Smelling Salts are no gear.
- **`kneel` in `tools/walk.ts`** works on a zone map now: it kneels at the feature the world holds,
  found by its id where the company stands, and the isle's walkthrough kneels at the pilgrims' shrine
  with it (§9.2, #753's 16 and #793's 6).

Owed, from I6 (#754):

- **Two under, the east rim is won every time:** 100% of fights at 26, where the gate wants no more
  than a quarter (limit 90%). It is owed to #18 as H6's is (`hearthisle_i6: under`, `OWED` in
  `tools/tests/gate.ts`). The issue's "one at 26 no more than one in four" is not met: stronger
  monsters are barred and fewer groups would not lower it (§9.2, #754's 11). The owner's or #18's.
- **The pay is met** (#794): six groups pay 4,253 xp a member against a twelfth, 3,911 (1.09); the
  finds 2,400 gold against its share, 2,360 (§8; §9.2, #794's 1 and 6). Nothing is owed for it.
- **The builder's own:** `i6_keel` and `i6_wyke` are the builder's words, and the cell at 4,18 is a
  building square, not rock. The art check holds I6 at its cap of 50%, so dressing one more wall
  face or taking the cell out fails it (§9.2, #754's 1 and 2).
- **The anchoress** is built (#763): Hereswith stands at 4,19, in the yard under the cell's window.
  I6's map reads the crypt's flags (`ELEVEN_KEPT`, `LOG_GIVEN`) and exports the ask's alone
  (`KEPT_ASKED`); her hand-in sets `q_eleven_log`, no longer owed in `UNSET` (§9.2, #763's 1 and 5).
- **`q_throne_removed`** is set on main by the Council (#774), so nothing is owed for it: the camp's
  guard carries the leave rule, and the walkthrough plays it with the flag set by hand (§9.2, #754's 6).
- **The gear's rung** is built (#746): the Grey Staff and the Grey Mail (`greyStaff`, `greyMail`),
  built here (`src/content/areas/hearth/items.ts`), are on the ladder at 28 (§9.2, #754's 8).

Owed, from Hearthfane (#755):

- **Two under, the temple is won every time:** 100% of fights at 26, where the gate wants no more
  than a quarter (limit 90%). It is owed to #18 as H6's is (`hearthfane: under`, `OWED` in
  `tools/tests/gate.ts`). The issue's "one at 26 no more than one in four" is not met: stronger
  monsters are barred (§9.2, #755's 10). The owner's or #18's.
- **The chapter's step** for the temple is #760's (`visited: 'hearthfane'`), written.
- **The gear's rung** is built (#746): the Grey Blade and the Grey Bow (`greyBlade`, `greyBow`),
  built here (`src/content/areas/hearth/items.ts`), are on the ladder at 28 (§9.2, #755's 11).
- **A door's own key** would be a systems change: the treasury's door is gated on the key, and the
  comment on `MapDef.gates` (`src/game/map.ts`), which speaks of an exit, is the systems lane's to
  reword (§9.2, #755's 1).
- **Fleeing at the treasury's door:** `World.flee` steps back without reading gates or exits, so a
  company that flees a fight at 10,10 facing west lands in the treasury's doorway without the key.
  It is so for every gate (Helmstow's) and a systems matter.
- **The goal gave the order outright (done, #795's 8):** *Put out the four lamps in the pillar's order:
  the Sea, the Shore, the House, the Hearth.* (§6's own line) told a company that had met the sacristan
  what the carving says. It now points at the pillar: *Put out the four lamps in the order the pillar
  gives.* (§9.2, #755's 23).

Owed, from the crypt (#756):

- **The crypt's pay and pace are met** (#794): six groups pay 5,146 xp a member of its tenth, 4,693,
  1.10, at 10.46 fights to a rest at 29, in the aim (10.25 to 12.25); its finds 2,900 gold
  against its share, 2,832 (§8; §9.2, #794's 1, 5 and 6). Nothing is owed for it.
- **Two under, the area's pool is won nearly every time:** the crypt's own row reads n/a, its floor
  being above the area's, so its groups count in the pool at 26, 94.2% of 51 groups since #794 (100%
  of 15 when built), owed to #18 already (`Hearth Isle: under`, `OWED` in `tools/tests/gate.ts`).
  The issue's "one at 27 no more than one in four" is not met as it reads (§9.2, #756's 10). The
  owner's or #18's.
- **The eleven niches are told, not carved:** `hf2_niches` says them where the brief has eleven in
  the chamber's wall, which a round chamber with three ways out cannot hold as squares (§9.2, #756's
  1). The owner's call.
- **`hf2_last` is the builder's own event:** the brief had the Hand's last man said by a `look`,
  which no encounter has (§9.2, #756's 3).
- **`q_eleven_log`** is set by Hereswith's hand-in (#763), so `hf2_eleven` is said once the log is
  given. It has left `UNSET` (`tools/tests/quests.ts`); I6 takes `LOG_GIVEN` from the crypt, which
  exports it (§9.2, #756's 6; #763's 5).
- **The chapter's step** for the knot is #760's (`hearthfane2:hf2_knot`, seen), written.
- **The gear's rung** is built (#746): the Grey Robe (`greyRobe`), built here in the pack
  `hf2_pack`, is on the ladder at 28 (§9.2, #756's 7). In it the crypt's company fought 15.74 to a
  rest at 29, past the limit of 14.75; on the line made again with it, 14.24, inside it; with #794's
  groups 10.46, in the aim (§8; §9.2, #752's 2).

Owed, from the Ways (#757):

- **The Ways paid under their nine fortieths,** 0.93 of it (9,768 xp a member of about 10,560),
  with the brief's eleven groups (§9.2, #757's 12). #794 added a twelfth (the rats in the crew's
  stores) and two chests: 10,962 a member (1.04 of the share), 11.27 fights to a rest at 30 (in the
  aim) and 8,200 gold (§8). Nothing is owed for it.
- **The brief's crawl way and row-6 way cannot both stand:** the crawl way runs 24,2–13, and a way
  from the main way east to the crack at 29,6 crosses it and opens the hatch's secret to anyone. The
  crack is reached through the eighth frame's room instead (§9.2, #757's 2). The owner's call.
- **The groups rise from the grey door, not from the brief's squares:** on those the knockers (28)
  stand furthest and the curve's rise fails. The crack's knockers (28) and the crew guard (29.3)
  are furthest whatever is done (§9.2, #757's 4). The owner's call.
- **Two under, the area's pool is won nearly every time:** the Ways' own row reads n/a, its floor
  being above the area's, so its groups count in the pool at 26, 94.2% of 51 groups since #794 (100%
  of 30 when built), owed to #18 already (`Hearth Isle: under`, `OWED` in `tools/tests/gate.ts`).
  The owner's or #18's.
- **`underdeep` keeps its name and order 13:** the comment on `AtlasPlace.name` (`src/game/atlas.ts`)
  says planned places only, but `progression()` reads it for a deep place's step on the road (§9.2,
  #757's 10). A note for the systems lane, not edited here.
- **The issue's "`keeper` first placed here" is stale:** the crypt placed it (#756).
- **The road behind is built (#765):** `CREW_OPEN` brings the Kilns' knockers (`ud_mines`) onto
  `deep_mines3` 6,3 and gives Anvilhall's thane his line; `CRACK_SEALED` stills the Sunder's groups
  (`leaves`) and gives the Watch's Reader hers (§12).
- **The chapter's step** for the Ways is #760's (`underdeep:ud_in`, seen, at `underdeep`), written.
- **The gear's rung** is built (#746): the Grey Shield (`greyShield`, in the keepers' store
  `ud_store`) and the Old Lantern's Staff (`oldLanternsStaff`, the knocker's gift for *Widen it.*),
  built here, are on the ladder at 28 (§9.2, #757's 9).

Owed, from the Stair (#758):

- **The Stair paid under its nine fortieths,** 0.90 of it (9,482 xp a member of about 10,560), with
  10.14 fights to a rest at 30, under the aim (10.5 to 12.5) and inside the limit (9 to 15). #794
  added two light groups (knockers at the head and on the second landing) and two chests: 11,164 a
  member (1.06 of the share), 10.71 fights to a rest at 30 (in the aim) and 8,200 gold (§8).
  Nothing is owed for it.
- **The Catcher's sizing is final** (#752): `OFF_LINE.catcher`, 1,300 hit points and 32d8+37, is won
  57% at 30 and 80% at 32 on the gate's hundred seeds (63%, 67% at 31 and 81% on 400). The aim is
  the floor's, as the gate states it (§8): "nearly always at the cap" cannot hold beside it but in a
  slog, the rise from 30 to 32 being 12 to 18 points on 400 seeds, so the cap sits over the gate's
  limit of 75% and under its aim of 90% (§7; §9.2, #752's 4 and #796's 1). The owner's call.
- **The sixth flight's crawlers are two, not three:** with three the day at 30 breaks off at 7.85
  fights to a rest, past the gate's limit of 9 (§9.2, #758's 8). The owner's call.
- **`tools/tests/structure.ts` is loosened:** a group that `leaves` on its `until` needs no respawn,
  where the check refused any `until` on a group that never comes back. It is outside the content
  lane and the owner's to overturn (§9.2, #758's 5).
- **The last door was the Heart's:** `LAST_DOOR` and `FIVE` were exported and not listed (§9.2,
  #758's 3). #759 listed the exit, turned 16,1 to a door, signed the lock in `src/content/locks.ts`
  on `q_ember_lit` at `underdeep2` 16,1 with its reason, *the heart opens for whoever makes it
  whole.*, landed the Heart's way up on 16,2 facing south and turned the walkthrough's last two
  lines, which asserted 16,1 a drawn door and no exit to `core` (§9.2, #759's 11 and 12).
- **Two under, the area's pool is won nearly every time:** the Stair's own row reads n/a, its floor
  being above the area's, so its groups count in the pool at 26, 94.2% of 51 groups since #794
  (97.2% of 33 when built), owed to #18 already (`Hearth Isle: under`, `OWED` in
  `tools/tests/gate.ts`). The owner's or #18's.
- **Eight flights of eight squares do not fit the landings,** four rows apart: seven flights, and
  the table's ordinal words are not kept (§9.2, #758's 1). The owner's call.
- **The first landing's words** (`ud2_held`, the captain) say the rearguard lies dead even where the
  company killed it before taking a token: harmless and rare.
- **The verdicts are #764's:** its flags put their people on the landing (`HELD`, 57's `done`).
- **The road behind is built (#765):** `q_letter_given` is set by Jowan's mother's hand-in of
  `gullwick_letter` at `downs_f3` 10,13, and `UNSET` no longer owes it.
- **The chapter's steps** for the Stair are #760's: `underdeep2:ud2_dead` (seen),
  `underdeep2:ud2_catcher` (slain; a guardian, no respawn), `underdeep2:ud2_foot` (seen) and
  `KNOT_LAST`, at `underdeep2`, written.
- **The gear's rung** is built (#746): the Grey Axe (`greyAxe`, in `ud2_rearguard_chest`), built
  here, is on the ladder at 28 (§9.2, #758's 12).

Owed, from the Cleric's third (#763):

- **The early road read a meeting ahead of her (done, #795's 7):** `early` ended on *Now I know.* and sent
  nobody, while the log's `given` entry says she sent us. It now ends on the send-down line too. A hand-in
  sets no met flag, so her introduction is still never said on that road (§9.2, #763's 4 and 10).

Owed, from the Heart (#759):

- **The area's budget is met** (#794): a clear pays 47,836 xp a member of the 46,934 (101.9%) and
  28,700 gold of the 28,320 (101.3%); the row's `owed` is gone. Every box but the Heart pays
  its share and more (H6 1.07, the rim 1.09, the temple 1.06, the crypt 1.10, the Ways 1.04 and
  the Stair 1.06); the Heart, one fight, pays 0.72 of its eighth as the curve counts it (4,217 of
  5,867: the lesser of Vask's groups, no sentry) and the boxes before it carry the rest. A
  company that meets `core_vask` is paid 48,248 (102.8%), with up to 1,644 of sentries more (§8;
  §9.2, #759's 9, #792's 3 and 6 and both of #794's blocks). Nothing is owed to #794.
- **Vask's sizing is final and the gate's two rules are kept** (#752): `OFF_LINE.vask`, 1,850 hit
  points and 22d8+23, and the rules that a map of nothing but its boss is judged on the boss's odds
  and a boss at the cap at its floor alone, now written in `docs/EXPANSION.md` §5.2 and
  `docs/MONSTERS.md` §1; `rate` keys its cache on the clock too (§9.2, #752's 5 and 6). Outside the
  content lane and the owner's to overturn.
- **The sentries carry 890 hit points** (their blow kept), twice the soldier line as #752 read it and
  16 over twice the 437 it reads since #793, off the line by the design's choice as the Catcher is
  and the lever the Heart's builder named: the clock let run wins 28% on 400 seeds (33% on the gate's
  hundred), a quarter to a third, and the Hands first 62% (60%), three in five where the plan said
  two in three, inside the gate's aim, which binds; the thinned group 81% (78%, inside its limit).
  Going for Vask first wins 72% (69%), more than the Hands first, which is the gate's judged play and
  not the better; on the harness's thrifty bot, which keeps its spells, the clock let run wins 64%
  (200 seeds; §7, §8; §9.2, #752's 5 and 7 and #796's 2). The owner's call.
- **Two checks outside the content lane are loosened:** `tools/tests/people.ts` lets a parley be
  nothing but its refusal where the group has a slain text of its own (the Heart's two) and holds a
  group's question to the box's lines alone, the side panel's being a person's; and Rimewater's
  walkthrough counts its lock on its own map and not on the road (§9.2, #759's 14, 15 and 17). Both
  are the owner's to overturn.
- **Two under, the area's pool is won nearly every time:** 94.2% of 51 groups' fights at 26
  since #794 (92.5% of 39 before it), owed to #18 as before (`Hearth Isle: under`, `OWED` in
  `tools/tests/gate.ts`). The Heart's own row reads n/a.
- **The road behind is built (#765):** `q_wenna_home`, which ends Wenna's words at 7,4 (her `until`), is
  set by Hild at Gullwick and `q_signet_sea` by the sea there, taking `queens_signet`; the clerk at
  `shelf` 15,4 sets the other three (Helmstow and the halls). The Walk Home's `gate` entry, on
  `gate_open`, is in, and `UNSET` owes nothing.
- **First of all, but for a business still open (#765, half A):** Ruan's Compact question and
  Ysolde's reading of the journal come before an ending's words until done (§9.2, #765's 8); so do the
  Reader's reading of the papers and her introduction (#795's 5).
- **The chapter is #760's, written:** the Heart's steps are `core:core_door` and `core:core_heart` (seen),
  the flags `VASK_FALLEN`, `VOICE_WHOLE`, `RING_GIVEN` and `ENDED`, at `core`; 64 is `signet` in the
  area's `quests.ts`.
- **The Council's and the Compact's flags are read here, not set (#764):** `q_throne_removed` swaps
  Vask's groups, `q_throne_tallis` (or `q_token_tallis`, where no claimant's verdict carried) puts
  Tallis's man at 7,13 and `q_compact_over` the runner at 7,12.

Owed, from the depths' pay (#794, the Ways and the Stair):

- **The area's clear is met with both halves in:** the curve prints 47,836 xp a member of the
  46,934 and 28,700 gold of the 28,320. The depths pay 22,126 and 16,400 of it, 1,006 of the
  Heart's 1,650 xp short and all of its share of the gold among it; the isle's four pay 21,492 and
  12,300. The row's `owed` is gone (§8).
- **The runs from the camp grow,** the Ways' to twelve groups and the Stair's to nine with the
  Catcher; the ways up take a company back to the camp between runs, and each run is inside twelve
  fights (§8).
- **Two under, the area's pool** is won 94.2% of 51 groups' fights at 26 with both halves in (92.9%
  of 42 on the depths' half alone), owed to #18 at 100% as before (`Hearth Isle: under`, `OWED` in
  `tools/tests/gate.ts`); it is not re-recorded.

## 12. The road behind: the lines

What the act changes behind it, with every line, for the issue that builds it (§9, call 12).
Each is a presence `after` the flag named, on a map an earlier area owns, so the issue is in the
area lane for each of those areas and in the systems lane for nothing. What it needs of the
systems lane is call 9's own issues, which it waits on: the two `Exit` fields (the fifth), the
leave rule (the third), the save upgrade (the seventh) and the Hearth's three states on the title,
in the night sky and in the almanac (the sixth, below, which are that issue's edits and not this
one's).

**Helmstow's gate** (`shelf` 16,3): the orcblood shut gains `lifts: [...ENDED, { flag: 'q_throne_removed' }]`
(a When list: any ending, or Vask removed); and a once-event on the road before the gate at 16,5
(16,4 is the start square, with its sign), `gate_open`, `after: ENDED`: *The gate stands open, and
the sergeant at it looks at every one of you and says nothing at all.* The clerk who asks where
the ring goes stands at 15,4 (§6, 64).

**The keep** (`keep`): Vask and his guards `until: [{ flag: 'q_throne_removed' }, { visited: 'hearthisle_h6' }, ...ENDED]`,
since once the company is on the isle he is at the panel; in his place before the throne room's
door at 7,5, `after: { visited: 'hearthisle_h6' }`, `until: [{ flag: 'q_throne_removed' }, ...ENDED]`,
his steward: `{ kind: 'npc', x: 7, y: 5, name: 'The Regent\'s steward', lines: ['The Regent\'s steward before the throne room\'s door, a ring of keys at his belt and nobody to open anything for.', '"His lordship is not in the keep. He went over to the isle with the grey men and left me the keys, and no orders."'] }`.
#449's gibbet presences in Helmstow go `until: { flag: 'q_throne_removed' }`. The proclamation's
sign twinned: `after: { flag: 'q_throne_removed' }`, `until: ENDED`: *A proclamation on the
gatehouse: the Council of Helmstow holds the city under its seal, the Regent's commission being
ended.*; `after: [{ flag: END_REIGNITE }, { flag: END_FINISH }]`: *A proclamation on the
gatehouse: the Council of Helmstow sits in judgement on Aumery Vask, once Regent-Warden, this day
and every day until it is done.*; `after: { flag: END_ARRIVE }`: *A proclamation on the gatehouse,
the ink run in the strange light: the Council holds the city, and the gates stand open, since
there is nothing now to shut them against.* In the throne room's door at 7,4, `after: [{ flag: END_REIGNITE }, { flag: END_FINISH }]`, a
person: `{ kind: 'npc', x: 7, y: 4, name: 'Aumery Vask, before the Council', lines: ['Through the keep\'s door the hall, and the Council in the Queen\'s chairs, and Vask standing before them in irons with his hands folded. He is answering a question, quietly, and he never once looks up.', 'A councillor, to the clerk: "Write that he was not wrong about the facts. He will want that written."'] }`.

**The Hearthlight Inn** (`harrow` 4,4): a third twin at 12, `after: [{ flag: 'q_throne_removed' }, ...ENDED]`,
the dearer one `until` the same. **Mottram's Stores** (`harrow`): a twin at a port's prices
`after: { flag: 'q_throne_tallis' }`. **The Drillyard** (`harrow` 3,13): nothing but Ordgar's
word (the halls, below), since a trainer has no price to restore. **The Chapel** (`harrow`): its
shut `until` gains `q_throne_hold` and `ENDED` (its notice and its twin as #157 built them).

**The Gilded Eel** (`harrow` 12,13): the verdicts' five lines (§6) as `says` before the curfew's,
and after an ending, first of all: relit, *A fisherman, from the door: "Steady as a post, all
night, every night. I'd forgotten what it was for. It's for steering by."*; opened, *The tavern's
door stands open on a street in the wrong-coloured light, and nobody has shut it in a week. A
dockhand: "There's wind. Did you know there was wind?"*; finished, *A fisherman, with his hand flat
on the table: "Feel that. The table. The floor. It's been doing it since the light stood up. My
grandfather's going to say he told us so, and he never said a word."*

**The halls** (`says` on each hall's person, `after` the ending, first of all; each spoken by its
guild's own person where there is one, and where there is not by a person this issue adds): the
Drillyard,
Ordgar: relit, *"The light's steady and the Regent's in irons, and the Wardens are one grey again.
I'd have settled for one of the three."*; opened, *"Wind on the walls. The men keep looking up. I
tell them it's the Wardens' sky as much as anyone's, and I don't know if it's true."*; finished,
*"The ground hums. The sergeants say they can't sleep for it. I say good: nobody should sleep
through this."*. The Lantern Guildhall, which has no person of its own (it is a `guild` business,
`harrow`), so this issue adds one, its Luminary, on a free square by its door: relit, *"Every lamp in the house burns
steadier than it did. Whatever the Hearth is, we kept it, and I will say so from the step."*;
opened, *"Half the house says we were the lamp's keepers and have put it out, and half says we
were its jailers and have let it go, and I am to say which from the step. I have not decided."*;
finished, *"The Hearth burns harder, and the house argues what for. I have told them to light the
lamps and wait, which is what Lanterns are for."*. The Map Room, Ysolde Carrow: relit, *"The map is
finished, then, and the edge of it is the edge. The Guild will draw it fair. I had hoped the edge
was not the edge."*; opened, *"Beyond. There is a beyond, and the Guild has the first page of it
blank on the table, and every surveyor we have is arguing over who holds the pen."*; finished,
*"The Guild has a map with nothing past its edge and a note in Fane's hand that there will be.
Our grandchildren's work. I have told them to start."*. The Keel, Ruan: relit, *"Steady light,
quiet sea and nothing coming over it that pays in grey. The Compact will have to learn an honest
trade. It has been a while."*; opened, *"Wind. Real wind, off a sea that goes somewhere. Every hull
in the roads wants to find out where, and the Compact will carry the first ones, for a fee."*;
finished, *"The sea hums. The pilots say the stars have moved, all of them, a hair, and are still
moving. Tallis has bought a telescope."*. Lantern Watch's hall, its Reader, Hester Dunmore, who
is built (`lantern_watch.ts`, 5,5), for the split: opened,
*"The prior says we were the jailers. The sister says we were the keepers. They have stopped
speaking, and so has the house, and the great lamp burns whichever it was."*; the other two as the
Guildhall's.

**The Drowned Temples** (`delta_b6`, the priestess): relit, *"It sings. Not the count: the tides,
as it did. I had the number by heart and I have lost it, and I am glad."*; opened, *"It stopped.
The count stopped, and the song never came back, and in the dark the Tidefolk began to sing it
themselves. We know the words, it turns out."*; finished, *"It sings a song I have not heard: a
travelling song, the old women say, for a long way. The tide is the same tide. The song is not."*

**As built (#765, Helmstow and the halls):** the lines above stand as given but for four. The
endings' proclamations are events on the gatehouse at `keep` 6,8, the other side of the gate from
the Regent's sign, and the Council's word at 9,8 is as #764 built it; the throne room, empty
(`after` Vask's `until`, `until` the removal), is the link on Vask's door before Wiglaf, and Vask in
irons a person in the room; the Luminary, *The Guildhall's Luminary*, stands at `harrow` 12,11; and
Ruan's question and Ysolde's reading come before the endings' words while they stand open. The clerk
at the gate is built with 64 (§6; §9.2, #765's 1 to 5 and 8).

**Ashfall** (every box, the sentries' groups): `until: ENDED`, by the leave rule, so they stand
down standing or not; Cinderport's harbourmaster, `after: ENDED`:
*"The things on the road have stopped. Stood where they were, the drovers say, and are standing
yet. Whatever they were looking for, somebody found it."*

**The Deep Mines** (`deep_mines3` 6,3, after 60): three of the Kilns' own knockers (`knocker`,
level 16) `after: { flag: CREW_OPEN }`, a few or none, the company landing at 13,3 facing west
(§6, 60); Anvilhall's thane gains his line (§6, 60). **Sunderwood** (its maps' Sunder groups, after
61): `until: { flag: CRACK_SEALED }`, by the leave rule; the Watch's line, on its Reader (§6, 61).
**The Whitespine** (`highspine_i11`, `i11_stone`): nothing here. Its `sets: 'q_peak_stood'` and the
save upgrade for the saves that saw the event before it (`SAVE_VERSION` 5 and `toV5`) are call 9's
seventh issue's (#751; §9, call 1), recorded in `shipped.json` and tested in `tools/tests/save.ts`
and the Whitespine walkthrough. **`src/content/stones.ts`**: the Grove Stone restored on
`q_mender_done` with its `owed` dropped, and the Ember Stone's stale comment, which says `q_ember_lit`
is owed in `UNSET` though `UNSET` is empty, put right. **`src/content/crossings.ts`**: the last
crossing's isle end landed (§4.2) and its fare `free: { flag: 'q_compact_over' }` at both ends.

**The almanac and the title** (call 9's sixth issue, the endings', not this one; `src/game/stones.ts`): a sixth word for relit, *It burns steady, and
the tears are closed.*; for opened, *It burns as it did. The sky is another colour, and there is
wind.*; for finished, *It burns harder than it ever has, and the ground hums.* The title's column:
at full and still for relit; as it was at five Stones for opened, under a sky of the ending's
cast; taller than full for finished. The night sky's Hearth (`src/ui/viewport.ts`,
`drawHearthLight`) the same.

**Gullwick** (`downs_f3`): Hild's two new `says` and Wenna on the shingle at 11,15, `after: { flag: WENNA_HOME }`
(§6, The Walk Home); Jowan's mother at 10,13 (58); the sea at 9,15 (64).

**As built, Gullwick and the rest** (#765; Helmstow, its halls, Saltmouth's and the priestess are its
other half's). On `downs_f3`, Hild's two `says` first and Jowan's mother and Wenna as written; the sea
once Wenna is home (`after: { flag: WENNA_HOME }`, not `ENDED`), so its words hold;
The Walk Home (`walk_home`, with the Hearth's quests) has its entries on `ENDED` and
`WENNA_HOME` and its goal at `downs_f3`; its entry at the open gate is on `gate_open`, the other
half's. Ashfall's seven groups go `until: ENDED` with `leaves`, and the harbourmaster's line is a
`says`. The knockers are `ud_mines`, told by a once-event, `dm3_open` at 7,3, since a group has no
`look`; the gate leaves them out of the Kilns' figures (`BEHIND`) and the curve counts them; the
thane's line waits on his answer as well. The Sunder's groups given `until: { flag: CRACK_SEALED }`
and `leaves`: `j2_hounds`, `k2_hounds`, `k2_bears`, `k3_bears`, `l2_hounds`, `l2_bears`,
`l3_bank`, `l4_night`, `m2_hounds`, `m2_bears`, `su1_spiders`, `su2_wood`, `su2_bears` and the K3 Rift's
`k3_rift_g1` and `k3_rift_g2`. The Reader's ending words come at every meeting, after her reading while it
is open and after the badge's question, the wall's word and the crack's, which are said once (#795, below).
`i11_stone` sets `q_peak_stood` already (#751). The Grove Stone counts on `q_mender_done`, and the last
crossing, whose isle end H6 landed (#753), is free at both ends.

**As built (#795, the road behind's business kept reachable).** The keep's door and the three hand-ins
Vask took: the survey wand (300 gold, `q_ashcombe_done`), the tenant's paper (50, `q_paper_vask`) and
the keeper's oil put to him (`q_oil_order` and `q_oil_lit`, a `says`). Three persons take them in turn,
each in his own words and with the same items, pay and flags, so that no hand-in and no `q_oil_*` flag is
lost by the isle, the Council or an ending, and in every state exactly one of the three stands:

| State of the keep | At 7,4 | At 7,5 | Takes the three |
|---|---|---|---|
| Before the isle, no verdict, no ending | Vask | nobody | Vask |
| On the isle, or after an ending; the Council not sat | the empty throne room (Vask in irons within, after the relit and the finished) | the steward | the steward |
| The Council has sat, whatever else | Wiglaf at the keep's door (Vask in irons within, after the relit and the finished) | nobody | Wiglaf |

The steward is `after` the isle or any ending and `until` the removal, so he stands on after an ending:
the opened leaves nobody else at the door, and a man in irons is no one to hand a wand to. A `says` after
an ending replaces his first words, which are not true then. Neither he nor Wiglaf hires anybody, so the
wand has no `early` for them, nor an `after`: a hand-in's is said to any company whose flag is set, and
would hide the steward's first words from every company that gave the wand to Vask. The Foreland's
`keepHandIns` plays the sixteen states (the isle, the Council and the three endings). **The Reader**
(`lantern_watch` 5,5): the crack's line is said once (`q_reader_crack`), at the next meeting whichever came
first and after her introduction, as the wall's word is; her reading of the Tide Ship's papers and log
(`papers_read`, `seal_read`, `log_read`) comes before the endings' words while it is still to do, and those
words wait on her introduction (`watch_reader_met`), which the reading needs. **The audit of the endings'
words** found business hidden nowhere else, and left Hild's Greywater line below her ending word, as first
it would send the company for a girl who walks behind it (§9.2, #795's 5 and 6). **Hereswith's** early
hand-in ends on the send-down, as `done` does, and **the sacristan's** goal points at the pillar without
its order (§9.2, #795's 7 and 8).
