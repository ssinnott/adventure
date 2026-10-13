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

Nothing is built but the pilgrims' camp's three rooms (§3). What exists: the atlas's rows (`src/content/atlas.ts`: the area `hearth` at
28–30, the zone `hearthisle`, the places `underdeep` at 30–31 and `core` at 32, both planned, the
sites The Hearth at 256,174 and Anchorhold at 268,176, the last crossing's sea link from Cinderport
landing at 252,188 and the deep links on from the isle); the last crossing itself, sold at
Cinderport's quay since #547, whose isle end is owed to Phase 1.5 (`LAST_CROSSING`,
`src/content/crossings.ts`); MONSTERS §9's roster (§7 fields it with one more, the Ashen
Rearguard: twelve monsters, one new family); the Cleric's
third prestige at Anchorhold, placed on the map and nowhere else (#19); and #56's 56 to 61 and 64,
Act V's side quests, drafted. Its content will be `src/content/areas/hearth/` (maps, monsters,
items, climate, its part of the world map, its chapter, The Heart, in `chapter.ts`, its side quests
and the Cleric's third in `quests.ts`, its walkthrough) and its businesses' rooms
`src/ui/interiors/hearth/`, drawn ahead of it (#762). Its ids, the plan's: the area `hearth`, its zone `hearthisle`, the boxes
`hearthisle_h6` and `hearthisle_i6`, the temple `hearthfane` and its crypt `hearthfane2`, the
Underdeep's two levels `underdeep` and `underdeep2` and the Core `core`.

---

## 1. Where it is

The atlas (`src/content/atlas.ts`, stroke XII) makes Hearth Isle a rocky rim round a green bowl: a
hexagon of rock from 240,164 by 256,158 and 272,164 to 272,180, 256,186 and 240,180, and inside it
grass, the polygon 248,168, 262,166, 266,176, 254,180 and 246,176. One zone, `hearthisle`, seeded at
256,172, and one area, `hearth`.

| Zone | Band | Squares | Boxes |
|---|---|---|---|
| Hearth Isle | 28–29 | 1,027 land, 757 of them in H6 and 270 in I6; the shallows apart (76 in H6, 77 in I6) | H6, I6 |
| The area | 28–32 (§9, call 2) | the isle, and the temple, the Ways, the Stair and the Heart below it | |

The bands, once and plainly: the area is 28–32, to the cap. The isle's zone, its two boxes and the
temple are 28–29; below them the crypt is 29, the Ways 30, the Stair 30–31 and the Heart 32 (§9,
call 2). The atlas's area row says 28–30 today, and H6's issue widens it (§8).

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
and pinned (§4.2).

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
in `src/ui/interiors/hearth/`, listed in `ROOMS_AHEAD` (`src/content/index.ts`, from
`src/content/areas/hearth/interiors.ts`) and owed to H6 (#753) in `UNPLACED` (`tools/tests/maps.ts`)
until its three businesses open into them; H6's Area then takes the list as `interiors`, and both
lines go. Nothing else. The atlas's rows and sites, the last crossing's Cinderport end and MONSTERS §9's roster
exist (above). The drafts the scaffold cuts are in §1. This doc is the plan; §4 has the briefs,
each with every line its place says, so that the box or level can be built from it by a session
that has read DESIGN, STORY and EXPANSION and nothing else. The owner's calls are §9's.

## 4. What is still to build

| Map | Name | Kind | Band | Land | What is there | Its step | Issue |
|---|---|---|---|---|---|---|---|
| H6 | The isle | zone box, core | 28–29 | 757 (rock 386, grass 266, hills 84, sand 21) | the strand at 20,30; the cleft up through the rim; the Bowl and the pilgrims' camp; the Hearth at 24,16; Hearthfane's door at 18,14 | the isle; the temple | #753 |
| I6 | The east rim | zone box, core | 28–29 | 270 (rock 155, grass 77, sand 35, hills 3) | Anchorhold at 4,18; the Hand's Steps at 3,27, where the causeway lands; the Hand's camp | none; the Cleric's third | #754 |
| | Hearthfane | dungeon, 16×16 | 28–29 | | the nave and its four lamps; the court open to the column; the Hand's best; the sacristan in the vestry; the treasury; the stair behind the altar | the temple | #755 |
| | The crypt | dungeon, 16×16 | 29 | | the eleven niches; the Hand's first dead; the knot on the frame; the grey door down | the knots | #756 |
| | The Ways | dungeon, 32×32 | 30 | | the hull's service ways: clean, humming, lit from nowhere; keepers with no robe; rats; the knocker at the crack; the CREW ONLY door's other side; the frames she marked | the Ways | #757 |
| | The Stair | dungeon, 32×32 | 30–31 | | the long stair down; the claimant's people at its head; the Hand's rearguard and its dead; the crawlers; the Catcher at the foot; the last door and the Hand's own beside it | the dead; the Catcher; the door | #758 |
| | The Heart | dungeon, 16×16 | 32 | | the door with the creed; the panel; Vask, the Grey Hands and the sentries the ring calls; the voice; Wenna and the choice | the choice | #759 |

The core is everything: no map here is country. Build order is the road's: H6 (which lists the
area, moves the isle's rows into the area's own atlas slice and lands the last crossing, §7), I6,
the temple, the crypt, the Ways, the Stair, the Heart; the
chapter and the walkthrough once the Heart is in; the side quests with their maps; the Council and
the endings with the Heart. The drawings (§7) land before the maps that first place them, the
crawlers' family before the Ways.

### 4.1 The briefs

Each brief below says what the map is for, its band, its landmarks with their squares, every
person, event and sign on it with its words as written, its secret and the hint on the near side,
its encounters, its finds and its share of the pay (§8), as EXPANSION §8.2 asks. The squares are
the drafts' (§1) for the two boxes and the plan's for the dungeons, which have no draft: a
builder lays the rooms round the landmarks and keeps the squares named here, since the chapter,
the side quests and the walkthrough key on them (§5, §6). Every square named on the two boxes is
walkable ground of fitting terrain in the drafts, checked square by square in review (§9.1), save
the few the builder carves out of the rim's rock, each said where it is named: the cleft (§4.2),
the rim's path and Anchorhold's yard (§4.3) and the pockets behind the two secrets. Where a square
cannot be kept, the builder changes it in one sweep, here and in the content.

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
| `LOG_GIVEN`, `ELEVEN_KEPT` | `q_eleven_log`, `q_eleven_kept` | the anchoress's hand-in; the crypt's lamps (§4.3, §4.5, §6) |
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
Its east edge meets I6 square for square on rows 0 to 30, walkable on both sides only on rows 0, 12
to 18 and 29 to 30 (rock on both sides on rows 1 to 11 and 21 to 28; on rows 19 and 20 H6's grass
meets I6's rock), and is pinned so in `tools/tests/outdoors.ts`; I6's rows take it as it is.

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
else. The box's west edge meets H6's east on rows 0 to 30, walkable on rows 0, 12 to 18 and 29 to
30 (§4.2). Its north edge meets I5's row 31, I5's rock against I6's grass and hills on the first
three columns and water beyond, pinned against the rock (§1).

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

**Encounters.** The Hand's camp guard, the box's hardest, and the moths by night; the rim's path
has one group so that Anchorhold is reached by a company at 28 with a fight.

| Id | Where | Group | Notes |
|---|---|---|---|
| `i6_rim` | 0,17 | 3 ashen champions | the pocket of the Bowl's grass where the rim's path begins, `respawn: 2880` |
| `i6_moths` | 5,20 | 12 hearth moths | `when: night`, over the cell, in Anchorhold's yard |
| `i6_guard` | 4,24 | 1 ashen preacher, 3 ashen champions, `back: 1` | the camp, `roams: false`; `until: { flag: 'q_throne_removed' }` by the leave rule (fewer Hand once Vask is gone from Helmstow, §6; today's `until` takes no standing group off a map, §9, call 9) |
| `i6_guard2` | 3,26 | 2 ashen champions | the stair's head, `roams: false` |

**Finds.** The hoard (above); the camp's chest `i6_camp_chest` (6,25): 500 gold, `grey_staff`.

**Share of the pay.** About a twelfth of the area's.

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

**Share of the pay.** About a seventh of the area's.

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
- `hf2_door` (8,1), the grey door, a `sign` on its square before the exit takes the company:
  *A door of grey with no handle, standing open. It opened for her, and nobody has shut it since.*

**Encounters.**

| Id | Where | Group | Notes |
|---|---|---|---|
| `hf2_champions` | 8,10 | 3 ashen champions | the chamber, `roams: false`, `respawn: 2880` |
| `hf2_rats` | 2,9 | 10 deep rats | the side vault, come up for the dead, `respawn: 1440` |
| `hf2_keeper` | 8,3 | 1 keeper, 1 ashen champion | the passage to the grey door: the first machine met on the isle, and the Hand's last man up here, dead on his feet beside it, which the `look` says |

**Finds.** The chamber's chest `hf2_cups` (10,10): 600 gold; the dead champion's pack
`hf2_pack` (1,8): 200 gold, `grey_robe` (§8).

**Share of the pay.** About a tenth of the area's.

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
- `ud_crew_sign` (3,10), a `sign` with `read` (an inscription, #538): text *A door in the ways'
  west wall, shut, and over it marks like the Kilns'.*, read *CREW ONLY. THE MINES BEYOND.* Its
  door (60) is at 2,10: a person in the engine's terms (§6).
- `ud_feet` (4,10), once: *Hundreds of footprints in the dust before the door, walking in. On the
  door's inner face, a bar, and a handle. It opens from this side.*
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
the knockers their armour. Eleven groups, the budget's balance and a rest's worth at 30 (§8); the
table's twelfth row stands on the Deep Mines' side (60).

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
| `ud_mines` | `deep_mines3` 6,3 | 3 knockers, the Kilns' own (`knocker`, level 16) | `after: { flag: CREW_OPEN }`, on the Deep Mines' side (the road behind, §12), not here: the Clean Corridor is band 17–18, so no Act V monster stands on it (`tools/tests/curve.ts`) |

**Finds.** A keeper's store `ud_store` (12,27), a chest: 800 gold, `grey_shield`; the crawl way's
`ud_crawl_chest` (24,4): 600 gold and three Great Spell Draughts (`potion_sp_great`).

**Share of the pay.** About nine fortieths of the area's, a little under a quarter: the Ways and
the Stair are the balance (§8).

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
(`q_peak_stood` is the road behind's, §9; `q_grove_done` the Grove's closing, which the road's own
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
second flight down; the Catcher at the foot.

| Id | Where | Group | Notes |
|---|---|---|---|
| `ud2_rearguard` | 16,26 | 3 hand rearguard (armoured, 30) | `roams: false`, `until: HELD` by the leave rule (the claimant's people fought it; §9, call 9) |
| `ud2_rats` | 14,23 | 12 deep rats | at the dead, `respawn: 1440` |
| `ud2_crawlers1` | 16,20 | 2 deep crawlers | the third flight, from the ceiling |
| `ud2_keepers` | 16,16 | 4 keepers | the fifth landing |
| `ud2_crawlers2` | 16,12 | 3 deep crawlers | the sixth flight, the level's hardest group |
| `ud2_knockers` | 16,8 | 3 deep knockers, 1 keeper | the seventh landing, `roams: false` |
| `ud2_catcher` | 16,4 | the Catcher, 2 deep crawlers, `leader: 'catcher'` | the foot, `roams: false`, `aware: 3`; `slainText: 'It comes off the ceiling all at once, and lies on the steps among the ones it caught. Nothing is moving above you now.'` |

**Finds.** The rearguard's chest `ud2_rearguard_chest` (17,26): 900 gold and `grey_axe`
(§8); the Catcher drops nothing; the dead's packs
`ud2_packs` (15,13): 700 gold, `potion_heal` ×4.

**Share of the pay.** About nine fortieths of the area's, the Catcher's 19,733 nearly a third of
that (§8).

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

- `core_door` (8,14), once: *Through the door, and the hum is everything. The walls here are glass
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
Hands', and the sentries' the clock calls (§8).

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
    { when: { flag: RING_GIVEN }, at: 'core', text: 'The ring is in our hands, and the panel waits under hers. Choose.' },
    { when: { flag: VOICE_WHOLE }, at: 'core', text: 'The girl out of the hole, at the panel, with the ring.' },
    { when: { flag: VASK_FALLEN }, at: 'core', text: 'The panel at the heart, and whatever speaks now the Hand is broken.' },
    { when: { seen: 'core:core_door' }, at: 'core', text: 'Into the heart of the Hearth, to Vask at the panel, and stop him.' },
    { when: { slain: 'underdeep2:ud2_catcher' }, at: 'core', text: 'Through the last door at the stair\'s foot, which opens for whoever made the Stones whole.' },
    { when: { seen: 'underdeep2:ud2_dead' }, at: 'underdeep2', text: 'Down the rest of the stair past the Hand\'s dead, to whatever caught them, and the door at the foot.' },
    { when: { seen: 'underdeep:ud_in' }, at: 'underdeep2', text: 'Through the service ways under the world, following her knots, to the stair that goes down to the heart.' },
    { when: { seen: 'hearthfane2:hf2_knot' }, at: 'underdeep', text: 'Through the grey door she marked, down into the ways below the world.' },
    { when: { visited: 'hearthfane' }, at: 'hearthfane2', text: 'Through the nave past the Hand\'s best, and down the stair behind the altar into the crypt.' },
    { when: { seen: STRAND }, at: 'hearthfane', text: 'Up the cleft through the rim into the Bowl, to the temple at the column\'s foot.' },
    { when: { flag: ROAD_EAST }, at: 'hearthisle_h6', text: 'East to Cinderport\'s quay, and the last crossing over the Sound to Hearth Isle, where the light stands.' },
  ],
};
```

Entries are kept under two lines of the journal's page, as Act IV's are; the walkthrough's `fits`
holds them. Nobody is named: she is the girl out of the hole in the goals and her in the entries,
as every chapter has her, and the word on the last frame is the one time the journal writes her
name, which is the point of it. The entries are the company's: the voice's words are quoted at
one remove, so what the Custodian is stays found and never told.

**The lock.** The last door (§4.7) needs the five flags the road sets at the Stones: the Tide
Stone home (`q_tide_home`), the Grove closed (`q_grove_done`), the Anvil's tear closed
(`q_anvil_closed`), the Peak Stone stood beside (`q_peak_stood`, which the road behind adds to I11's
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
map in band and each ending's flag reaches Gullwick's shore.

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
  `says: [{ after: { flag: LAMPS_OUT }, until: { flag: 'q_lamps_key' }, lines: ['He is out from under the table, standing in the nave with his face turned up to the empty air.', '"Gone. Every one of them, to the big lamp outside, where they belong." He takes a key off his belt. "The treasury. The pilgrims\' offerings are the Hearth\'s, but the grey men left their gear in there, and that is nobody\'s. Take it."'], choice: { ask: 'He holds out the key.', answers: [{ label: 'Take the key.', sets: 'q_lamps_key', gives: 'fane_key', pay: { xp: 3000 }, says: ['An iron key, warm from his belt. He is already looking at the wicks.'] }] } }, { after: { flag: 'q_lamps_key' }, lines: ['The sacristan is trimming wicks in the vestry, and not lighting them.', '"Dark again. I can hear myself think."'] }, { after: { flag: LAMPS_WRONG }, until: { flag: LAMPS_OUT }, lines: ['From under the table: "I told you. The pillar. Read the pillar."'] }]`.
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
  - the Shore lamp: `until: { flag: 'lamp_shore' }`, `lines: ['A lamp on a stand, burning high.']`, `choice: { ask: 'Put it out?', answers: [{ label: 'Put it out.', sets: LAMPS_WRONG, says: ['You pinch the wick, and the other three flare. The nave fills with wings.'] }] }`, `says: [{ after: { flag: 'lamp_sea' }, lines: ['A lamp on a stand, burning high. The moths have left the Sea lamp for it.'], choice: { ask: 'Put it out?', answers: [{ label: 'Put it out.', sets: 'lamp_shore', says: ['You pinch the wick. Two lamps left, and the moths go to the nearer.'] }] } }]`
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
  The other three flared and the nave filled with wings.* (on `LAMPS_WRONG`); *The last wick out,
  the moths went, all together, out through the court to the light.* (on `LAMPS_OUT`); *He gave us
  the treasury's key. The grey men's gear in there is nobody's, he says.* (on `q_lamps_key`).
  Goals: *Go back to the sacristan under the vestry table.* (on `LAMPS_OUT`, at `hearthfane`);
  *Put out the four lamps in the pillar's order: the Sea, the Shore, the House, the Hearth.* (on
  `q_lamps`, at `hearthfane`).

**57. The Pilgrims in the Bowl** (`pilgrims`, H6, 28). Three pilgrims stranded by the Hand's
landing, one of each claimant's, each with a token to carry down; the company takes one, or none.
Who stands with it on the Stair and at the Heart's door is the Council's verdict first (DESIGN
§10.1, below), and the token where no claimant's verdict carried: no case, a failed one or a
verdict for Wenna or for nobody. None of the three is a step; the token is a piece for its claimant
at the Council, and the fallback for the Stair (§4.7) and the face at the core (§4.8).

- Aelfric, a Warden of the cousin's, at 14,17, `flag: 'q_pilgrims'`, `until: [{ flag: TOKEN_HOLD }, { flag: TOKEN_TALLIS }]`:
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
- The log: `start: { flag: 'q_pilgrims' }`, `done: [...HELD, { slain: 'underdeep2:ud2_rearguard' }]`
  (a token or a claimant's verdict, which takes the rearguard off the landing, or else the
  rearguard slain);
  entries: *Three pilgrims in the Bowl, stranded by the Hand's landing: a Warden of the cousin's,
  an elf of the hold's, a hand of Tallis's. Each wants their token carried down.* (on
  `q_pilgrims`); *We carry the Wardens' badge. The cousin's people will stand at the bottom.* (on
  `TOKEN_COUSIN`), and the same for the seal and the tally; *We carried none of them. Whoever stands
  at the bottom, it is us.* (on the rearguard slain with no token). Goals: *Carry the token down
  the stair under the temple.* (on a token, at `underdeep2`); *Choose whose token to carry down, or
  none.* (on `q_pilgrims`, at `hearthisle_h6`).

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
(§4.5); back at the window she teaches.

- `{ kind: 'npc', x: 4, y: 19, name: 'Hereswith, the anchoress', lines: ['A voice from the window in the bricked-up door, and a face behind it, old, and lit from the side by the column. She says the hour before she says anything else.', '"Hereswith. I was walled in here at thirty to keep the hour against the light, and I have kept it fifty years, and the light has kept it with me, mostly." A pause. "Not the night the Queen died. That night it kept its own."', '"Eleven. I counted from here. I should like to know whether anyone else did."'], flag: 'i6_anchoress_met', quest: { item: 'keepers_log', reward: 0, setFlag: LOG_GIVEN, early: ['She reads it at the window, holding it to the light, and reads it again.', '"Crowness. A grace between each, the pairs even. Yes. He counted what I counted." She keeps it. "Now I know."'], done: ['She reads it at the window, holding it to the light, and reads it again.', '"Crowness. A grace between each, the pairs even. Yes. He counted what I counted." She keeps it. "Now there are two of us, and the gaps are written down."', '"Go down into the fane\'s crypt. Eleven lamps stand there for the eleven, cold since that night. Light them as he wrote them, the gaps and all, and I will keep the hour up here while you do. Not with you: I keep the top. That is what an anchorhold is for."'] }, says: [
    { after: { flag: ELEVEN_KEPT }, lines: ['The hour, from the window, and then: "The hum changed key an hour ago, and held. That was you."', '"Fifty years I thought the hour was mine to keep. It was the light\'s. Come to the window, Prelate, and I will show you what an Exarch keeps."'] },
    { after: { flag: LOG_GIVEN }, lines: ['The hour, from the window. "Eleven lamps, in the crypt under the fane. The gaps are in the book. Go on down; I have the top."'] },
    { after: { flag: 'i6_anchoress_met', member: { cls: 'cleric', level: 27, prestige: 2 } }, until: { flag: LOG_GIVEN }, sets: 'q_eleven_asked', lines: ['She looks a long while at your cleric through the window.', '"You have the Prelate\'s look. There is a keeper at Crowness Light, on the far shore of everything, who counted the eleven the night the Queen died and wrote the gaps down. Bring me his log, and we will see whether we counted the same."'] },
  ], teaches: { cls: 'cleric', prestige: 3, asks: 'eleven_kept', done: { flag: ELEVEN_KEPT }, seek: 'Hereswith, the anchoress walled into Anchorhold on Hearth Isle\'s east rim, keeps the hour against the light, and can make an Exarch of a Prelate.' } }`.
  A hand-in takes its item at the first meeting (EXPANSION §2.3): a company that brings the log
  before the ask hears `early`, and the ask is then never said, since it is `until` the hand-in's
  flag; the deed and the teaching key on the flags whichever came first, and the log starts on
  either.
- The log: `start: [{ flag: 'q_eleven_asked' }, { flag: LOG_GIVEN }]`, `done: { member: { cls: 'cleric', prestige: 3 } }`;
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
| `hearth_moth` | Hearth Moth | moths, `hearth_moth` | beast, fodder | 28 | hp 276, ac 24, attack 15, 3d8+2, speed 12, xp 557 | the isle and the nave by night, twelve to a group; flies (`ranged`); its dust puts to sleep (`inflict: asleep 0.2`); `look: 'The sky over the isle is moving.'` |
| `ashen_champion` | Ashen Champion | cultist, `ashen_champion` | person, soldier | 29 | hp 418, ac 26, attack 16, 5d8+5, speed 11, xp 1,153 | the isle's pickets, the temple, the crypt; `steady` (the Hand never breaks); drops `grey_knife` at 0.1; `look: 'The Hand\'s best, in steel from below.'` |
| `ashen_preacher` | Ashen Preacher | cultist, `ashen_preacher` | person, caster | 29 | hp 566, ac 26, attack 18, 6d8+7, speed 12, xp 1,538 | behind the champions; `cast: { spells: ['firebolt', 'ward'], chance: 0.5 }`, `ranged`, `steady`; `look: 'Still preaching, and the fire is the sermon.'` |
| `deep_rat` | Deep Rat | rat, `deep_rat` | beast, fodder | 30 | hp 282, ac 25, attack 16, 3d8+2, speed 12, xp 597 | everywhere below, twelve to a group; `inflict: diseased 0.2`; `look: 'Rats. Even here.'` |
| `keeper` | Keeper | keepers, `keeper` | machine, soldier | 30 | hp 427, ac 26, attack 17, 5d7+7, speed 11, xp 1,193 | the Ways; `inflict: asleep 0.15` (the sleepers' touch, Rimewater's); `look: 'A keeper with no bay to keep, and no robe.'` |
| `deep_knocker` | Deep Knocker | knockers, `deep_knocker` (built, Ashfall's) | machine, armoured | 28 | as built (Ashfall's `monsters.ts`) | the Ways, the Stair; the crack |
| `hand_rearguard` | Ashen Rearguard | cultist, `hand_rearguard` | person, armoured | 30 | hp 529, ac 28, attack 17, 6d8+6, speed 8, xp 1,591 | the Stair's first landing, where the claimant's people are not; `steady`; `look: 'The last of the Hand still standing, and standing in the way.'` |
| `deep_crawler` | Deep Crawler | crawlers, `deep_crawler` (new) | machine, brute | 31 | hp 1,004, ac 25, attack 18, 6d8+8, speed 8, xp 2,467 | the Ways' last run, the Stair; `ranged` (it comes down from above and reaches the back row); `look: 'It comes down from above, on too many legs.'` |
| `catcher` | The Catcher | crawlers, `catcher` (new) | machine, boss | 31 | hp 1,826, ac 28, attack 19, 30d8+34, speed 13, xp 19,733 | the Stair's foot, among the Hand's dead; `ranged`; `inflict: paralysed 0.2`; `look: 'It caught the Hand on these stairs.'`; sized on the gate to about half won at 31 |
| `grey_hand` | Grey Hand | cultist, `grey_hand` | person, elite | 31 | hp 737, ac 27, attack 18, 6d8+9, speed 15, xp 2,467 | the Heart, at the panel; `steady`; `inflict: paralysed 0.15`; `look: 'Hands the colour of ash, to the shoulder.'` |
| `core_sentry` | Core Sentry | machines, `core_sentry` | machine, soldier | 31 | hp 436, ac 27, attack 17, 5d8+4, speed 11, xp 1,233 | called by the ring (Vask's `calls`, the clock); stands down when he falls (`obeys`, §9, call 7); `look: 'The core\'s own, and it takes orders from the ring.'` |
| `vask` | Lord Vask | cultist, `vask` (the figure frame, his own) | person, boss | 32 | hp 1,922, ac 29, attack 20, 32d8+33, speed 13, xp 20,373 | the Heart; `steady`; `calls: { monsters: ['core_sentry'], chance: 1 }` on the clock's beat (the clock ignores the chance, §9, call 7); `look: 'A tall man with a quiet voice, and the Queen\'s ring on his finger.'`; sized on the gate to two in three won at 32 with the Hands down first |

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
each exists here and nowhere earlier on the road.

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

**The gate** (EXPANSION §5.2; `tools/gate.ts`), judged at each map's floor: the isle and the
temple at 28, the crypt at 29, the Ways at 30, the Stair at 30 and the Catcher at 31, the Heart at
32. At the floor nine fights in ten; two under, no more than one in four, which the champions
and the keepers must hold against a company of 26 and 28 in Cinderport's gear. Eleven fights to a
rest at 28, rising to twelve at 32 (MONSTERS §3.3; EXPANSION §5.2), against a company that rests at
the pilgrims' camp and nowhere below: the temple and the crypt, eight groups at 28 and 29, are one
run from the camp; the Ways, eleven at 30, another; the Stair, seven at 30 and 31 with the
Catcher, a third; and the Heart, one group and its sentries, the last. The ways up from the Ways
and the Stair (§4.6, §4.7) take a company back to the camp between runs, so the counts stand as
written. The groups of twelve (the moths and the rats, half again the fodder's group of eight) are
a risk at the gate, which may bring them to eight. The two bosses
are judged on their odds: the Catcher about half at 31 and nearly always at the cap; Vask two in
three at 32 with the Grey Hands killed first, and about one in three if the company lets the
clock run and fights the sentries as they come, which is the clock's point and the harness's to
measure (§9, call 7). The isle's first groups past the strand are the band's gentlest, and the
zone's crossing line says how it feels (§4.2).

**The gear** (`GEAR`, `tools/harness.ts`), one more rung, the last, by 28 and found, never sold:
the Hand's steel from below, in the temple's treasury, the camps' chests and the champions' drops
(§4.4 to §4.7), each inside the window and each a point past Cinderport's armourer for every class:

| Id | Name | For | Price | Where |
|---|---|---|---|---|
| `grey_blade` | Grey Blade | the martial classes and the cleric (a sword, 2d12+6) | 6,600 | the treasury |
| `grey_axe` | Grey Axe | the martial classes (two-handed, 2d12+7) | 6,800 | the rearguard's chest |
| `grey_knife` | Grey Knife | light, the thief's (1d8+14) | 6,400 | the picket's chest; the champions' drop |
| `grey_bow` | Grey Bow | the ranger (1d12+13) | 6,800 | the treasury |
| `grey_staff` | Grey Staff | staves, the casters' (1d10+13) | 6,200 | the Hand's camp |
| `old_lanterns_staff` | Old Lantern's Staff | staves, the casters' (1d10+14), holy | 7,000 | the swallowed hall (61) |
| `grey_mail` | Grey Mail | the mail wearers (ac 14) | 7,000 | the Hand's hoard (I6) |
| `grey_robe` | Grey Robe | the casters (ac 13) | 6,200 | the crypt's pack |
| `grey_shield` | Grey Shield | the shield bearers (ac 8) | 4,000 | the keeper's store |
| `smelling_salts` | Smelling Salts | anyone, a plain consumable: `use: { cure: ['asleep', 'paralysed'] }` on one member, used up | 0 | the north rim's cache, three in a pouch |

The dice are a point past the armourer's at Cinderport (`src/content/areas/ashfall/items.ts`), one
rung for one rung: the Slag Mace 2d12+5, the Flamberge 2d12+6, the Marlinspike 1d8+13, the Ashwood
Bow 1d12+12, the Battle Staff 1d10+12, the Drakeskin Coat ac 13, the Cinder Robe ac 12 and the
Basalt Shield ac 7. The harness and the gate dress their companies from the rung at 28 and measure
30 and 32 in it. The salts are no system: a consumable for one member, as Lantern Oil is
(`lantern_oil`, which the store sells for poison, disease and paralysis), and named apart from it.

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
   event (the road behind), since a `seen` cannot be a `needFlag`. A save that stood at the Peak
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
      `highspine_i11:i11_stone` was seen (1);
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
    phase's: Act V, all endings, the three subplots' ends and the Cleric's third.
12. **The road behind, in one issue** (as #449 was Act IV's): `stones.ts` reads `q_mender_done`
    (1), and the stale comment there that says `q_ember_lit` is owed in `UNSET` goes; I11's
    `i11_stone` sets `q_peak_stood` (1), with the save upgrade beside it (call 9's seventh); the
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
    is cut (call 10).
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

**Ashfall** (every box, the sentries' groups): `until: ENDED`, by the leave rule, so they stand
down standing or not; Cinderport's harbourmaster, `after: ENDED`:
*"The things on the road have stopped. Stood where they were, the drovers say, and are standing
yet. Whatever they were looking for, somebody found it."*

**The Deep Mines** (`deep_mines3` 6,3, after 60): three of the Kilns' own knockers (`knocker`,
level 16) `after: { flag: CREW_OPEN }`, a few or none, the company landing at 13,3 facing west
(§6, 60); Anvilhall's thane gains his line (§6, 60). **Sunderwood** (its maps' Sunder groups, after
61): `until: { flag: CRACK_SEALED }`, by the leave rule; the Watch's line, on its Reader (§6, 61).
**The Whitespine** (`highspine_i11`, `i11_stone`): `sets: 'q_peak_stood'`, and for the saves that
saw the event before it, the save upgrade, call 9's seventh issue: `SAVE_VERSION` 5 and `toV5`
setting the flag wherever `highspine_i11:i11_stone` was seen, recorded in `shipped.json` and tested
in `tools/tests/save.ts` (§9, call 1). **`src/content/stones.ts`**: the Grove Stone restored on
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
