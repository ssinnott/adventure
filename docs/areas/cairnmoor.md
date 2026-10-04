# Cairnmoor: step VII of the road, the moor with the ring

The seventh step of the road of levels (DESIGN §9, EXPANSION §2.2), band 18–20, and the second
of Act III, The Deep Script: a heather moor between the Kilns and the lakes, crossed in snow on
the drove road, with the oldest ground on the road at its heart. Fionnlios (the Stone Ring, §10) is
older than the Wardstones, the first emitters, dead for centuries, and inside it by night the
Custodian's oldest voice still asks the crew to report; the lights that drift over the bog are the
last of its field, the Rift at its thinnest; Carn Dubh (the Cairns, §10) holds the oldest dead. It
has no town and needs none (#434, call 9). This is its area doc (EXPANSION §4, §6 and §8.2):
where the atlas puts it, what the atlas and the docs put in it, the plan for building it, box by
box, and the briefs. Its work is filed under #437 (Phase 1.3, #431): the doc (#475), the boxes as
§4's table has them, Carn Dubh (#480), its chapter (#481), its side quests (#482), its seven
drawings (#483) and the country behind, parked (#484). Figures are measured on main at `6032251`
(2 October 2026) with `worldGrid` (`src/game/atlas.ts`).

Nothing of it is built. Its atlas rows are charted (`src/content/areas/cairnmoor/atlas.ts`, §3);
its content will be `src/content/areas/cairnmoor/` (maps, monsters, items, climate, its part of the
world map, its chapter of the one quest, The Ring, in `chapter.ts` and its side quests in
`quests.ts`); it has no businesses, so no rooms. Its ids: the area `cairnmoor`, its zones `highmoor`
and `cairnfield`, the dungeon `cairns` (the id stays under the new name, NAMES §3).

---

## 1. Where it is

The atlas (`src/content/areas/cairnmoor/atlas.ts`, spread into `ATLAS` with the plan until its first
box lists it) makes Cairnmoor two zones:

| Zone | Band | Squares | Built |
|---|---|---|---|
| High Moor | 18–19 | 4,105 | none |
| The Cairnfield | 19–20 | 3,587 | none |
| The area | 18–20 | 7,692 | nothing |

Squares are land, without the shallows and the rivers. The area is 7,692 squares, about 7.5 zone
maps (EXPANSION §1 has 7.5), the smallest of the act, and 6,779 of them a company could walk: the
rest is mountain, the rim's and the Rimefells'. High Moor is heather 1,595, hills 946, mountain 767,
grass 497 and marsh 126; the Cairnfield heather 1,777, grass 938, hills 452, mountain 146 and marsh
128. It runs from the Kilns' hills at about y 196 down to the Rimefells at about y 260, between
Kilnmouth's mountains on the west and the rim on the east. The zones' bands are this doc's, written
on the atlas's rows: the area is 18–20 and the boxes rise through it (§4).

**The grid** (EXPANSION §8.2; docs/areas/shelf.md §1). Cairnmoor is the M to P columns from row 6
to row 9. The land worth a map is six boxes: N7 and N8 down the drove road; O7 and O8, the ring and
the bog east of it; M7 and M8, the grass west of the road under the Kilns' hills. P6, P7, P8, O9 and
N9 are the rim and the Rimefells, and are cut (§11); O6, N6 and M6 hold slivers of its land inside
the Kilns' boxes, and L7 one inside Kilnmouth's.

Its edges:

- **North: the Kilns,** over low hills along y 196 to 208. The drove road comes up from the Kilns'
  N6 over them, its link's ends at 430,196 and 432,212 (`src/content/atlas.ts`), open from the start
  (EXPANSION §2.2); the crossing line (#166) falls where N6 meets N7. The Lava Tubes' box, O6, is
  built whole by the Kilns, its 195 squares of the moor's land with it.
- **East: the rim,** the P column, mountain nine squares deep with heather under it.
- **South: the Rimefells,** a ridge along y 256 to 264 between Cairnmoor and Rimewater. The drove
  road goes down through them from N8 at 424,250 to Rimewater's M9 at 414,262, a road link open
  from the start, and Rime Lodge stands at 410,262 just over the ridge on the shore of Loch Fada
  (the long lake, NAMES §4).
- **West: Kilnmouth's mountains,** L7, and M7 and M8's grass under them, the country behind (§4).

The drove road is the only road: up from the Kilns over N7, south down N8 and over the Rimefells to
the lodge. Nothing on the moor is on it but the moor; the ring lies a box east.

`node tools/worldmap.ts out.png --zones` paints it.

## 2. What it is for

The middle of Act III (DESIGN §9): *what are the Stones?* The Kilns have shown the machine and read
the dwarves' holy words as signs on doors; Cairnmoor shows what came before the Stones. The ring on
the moor is older than any Wardstone, the first emitters, dead for centuries, and the company sleeps
inside it one night because there is nowhere else out of the wind, and in the dark something very
old and very faint says *Crew. Report.* (STORY, Act Three). Nobody sleeps after. The bog lights are
the last of the ring's field, the Rift at its thinnest, with no body left and no tear (MONSTERS
§2.1; #434, call 3): the last Rift on the road, and #158's check holds that none comes after. The
cairns hold the oldest dead, and the tors are trolls by night. The road then drops to the long lake,
where the lodge-keepers say people are coming up through the ice (docs/areas/rimewater.md, to come).

It is also where the second prestige falls (DESIGN §5): a character reaches 19 on the moor, and the
Sorcerer's and the Bard's second trainers are here, at the Watcher's Hut and the piper's fire by
the tarn (#434, call 9). The Kilns place the Barbarian's and #439 the other five behind the act.

The weather is the moor's: wind, sleet, snow lying from autumn and fog on the bog. The company
crosses it in snow (STORY; MONSTERS §7.2).

## 3. What is built

Its atlas rows (`src/content/areas/cairnmoor/atlas.ts`, #475): the zones with their bands (High
Moor 18–19, the Cairnfield 19–20), Carn Dubh's two plates at 19–20 and the sites, spread into the
plan as Saltreach's and Wrackholm's were until their first box (docs/areas/saltreach.md §9, #169).
The atlas has the plan's: the Stone Ring at 462,214, the Cairns at 430,240 and the Watcher's Hut
at 466,208 as planned sites, and its links, the drove road from the Kilns, the Cairns' way in and
the drove road down to Longmere. Its row on the curve and its share of the act's gear ladder are in
(#535): the row in `src/content/progression.ts`, planned until #476 lists the area (band 18–20,
next 20, window 4,000), and O7's Banded Staff +1 in `src/content/areas/cairnmoor/items.ts`, made
ahead of the area as the Kilns' step is (docs/areas/kilns.md §3), owed to #477 until placed.
Nothing else. The systems it waits on are the rest of #432's: ice and lying snow underfoot (#536;
heather is #162's), regeneration and curse (#537), the drove road's coach (#539) and the bot that
plays them (#541). Its monsters are drawn in #483.

## 4. What is still to build

All of it: 7,692 squares of land, 6,779 of them walkable. On the grid (§1) the plan is four boxes
and a dungeon, with two boxes behind, and the four hold 3,945 of those squares:

| Box | Name | Zone | Kind | Band | Land | What is there | Its step of the quest | Issue |
|---|---|---|---|---|---|---|---|---|
| N7 | The road up onto the moor | High Moor, the Cairnfield | core | 18 | 1,024 (heather 438, grass 264, hills 247, marsh 75) | the drove road from the Kilns' N6 over the low hills; the moor's gentlest groups; the coach's road | none: the goal turns east to the ring | #476 |
| O7 | Fionnlios's box | High Moor | core | 18–19 | 986 (heather 552, hills 263, rock 88, grass 83), 38 shallow | the ring at 462,214; the Watcher's Hut at 466,208; the tarn below the ring and the piper's fire | the voice inside the ring | #477 |
| O8 | The bog | High Moor | country | 19 | 965 (heather 637, hills 159, marsh 120, mountain 23), 42 shallow | the peat bog and its lights; the tors; the peat-cutter | none | #478 |
| N8 | The Cairnfield's box | the Cairnfield | core | 19–20 | 970 (heather 858, marsh 59, hills 28, rock 25), 54 shallow | Carn Dubh's way in at 430,240; the cairns; the drove road down to the Rimefells at 424,250; the coach stopped in the snow | the road's head above the lakes | #479 |
| | Carn Dubh | | dungeon, two levels of 16×16 | 19–20 | | the oldest dead; the Watcher's first page; the Cairn King | | #480 |
| M7, M8 | The country behind | the Cairnfield | country, parked | 18–19 | 856 (grass 381, heather 285, hills 164), 46 shallow, and 834 (heather 491, grass 240), 70 shallow | the grass west of the road under the Kilns' hills | none | #484 |

The core is the three boxes that hold a step or carry the road to one (N7, O7 and N8), built at
full density; O8 is country, built to the looser floor with the wilderness features (EXPANSION §2.1
(b) and §5.3, #45). The bog is built with the act; M7 and M8 are parked until the owner has played
it (#434, call 10). The bands rise from the way in, 18 where the drove road comes over the hills, to
20 at the Cairn King and the road's head, as the gate asks (EXPANSION §5.2), and each box holds a
group at the top of its band for the curve.

**One box holds land of two zones.** N7 is High Moor's 690 squares and the Cairnfield's 334, the
zone line running across it. A map is its whole box (EXPANSION §8.2), so it is built to its edges
and laid in one zone; the zone a square belongs to decides only its crossing line (#166) and its
band. N7 is proposed laid in High Moor (§9), so the Cairnfield begins at N8.

**The order** is the drove road's, and the quest's: N7, the only box that meets the Kilns; O7, east
to the ring and the first step; O8, the bog below it; N8 and Carn Dubh; and the road down. Building
waits on the Kilns' Anvil Stone being played, since no more than two areas are in flight at once
(EXPANSION §3), and on #432's systems (§3); the briefs and the drawings do not (#437).

The places, as the atlas and the docs have them:

| Place | Box | What the docs say | On the atlas |
|---|---|---|---|
| Fionnlios (the Stone Ring) | O7 | older than the Wardstones, the first emitters, dead for centuries; the Custodian's oldest voice speaks inside it in the dark and asks the crew to report (DESIGN §9, STORY, MONSTERS §7.2); no monster inside, only the voice; the Bard's third-prestige quest gathers its call (DESIGN §5) | a planned ring at 462,214 |
| The Watcher's Hut | O7 | the Sorcerer's second prestige, Thaumaturge (DESIGN §5, #19); a camp (#434, call 9); the Watcher who counts the bog lights (#56's 37) | a planned lodge at 466,208 |
| The tarn | O7 | the Bard's second prestige, Skald: a piper camped by the tarn below the ring (DESIGN §5, #19); a camp (#434, call 9) | 38 squares of shallow on O7 |
| The bog | O8 | the Bog Light's ground, the Rift at its thinnest (MONSTERS §2.1, §7.2); the body with the rope and the ring (#56's 38) | marsh, 120 squares of High Moor |
| The tors | O8, O7 | trolls by night, stone with faces by day (MONSTERS §7.2); the stonecutter's faces (#56's 39) | hills, lettered nowhere |
| Carn Dubh (the Cairns) | N8, and below | the oldest dead; the Cairn King (MONSTERS §7.2); the last Watcher's grave (#56's 37) | a planned barrow at 430,240 |
| The drove road | N7, N8 | the coach from Kilnhaven to Rime Lodge, no stop on the moor (#434, call 9; #539); the coach that did not come, stopped in the snow (#56's 40, Rimewater's #494) | the road links at 430,196 and 424,250 |
| The Rimefells | N8's south edge | the ridge to Rimewater; the long lake seen from its head (STORY) | mountain along y 256 to 264 |

### 4.1 The briefs

Each box's brief is what EXPANSION §8.2 asks of one: its purpose, band, landmarks, the secret and
its hint, the encounters and what is new, with its points of interest and a first share of the pay
beside them. They are drafts for the owner, written before the Kilns' first box is built; each is
settled in its issue, and what the Kilns teach changes them.

- **Points of interest** (EXPANSION §5.3). A core box is held to the Foreland map's density: about
  nine features, ten groups and four ways in or out to 870 open squares. A country box has about
  half, and the wilderness features (#45) do most of the work. No more than one point in four is a
  sign.
- **Encounters** are MONSTERS §7.2's roster and fights. A group is about one of MONSTERS §4.4's
  standard encounters, and a kill pays each member by the monster's level against theirs (#159),
  so the figures below are for a company at the box's band. At 18 a company fights about eight
  standard encounters to a rest (MONSTERS §4.4).
- **Pay.** The area owes 14,667 xp a member (§8). The shares below are #437's, and add up to well
  under it (§8, §9).
- **Side quests** are #56's 37 to 39, placed as §6 has them (#482); 40 is Rimewater's, found here.
- **Finds** are the act's ladder (#535): the Kilns' towns' gear by 18 and the same with a plus by
  19. The moor's own plus on the ladder is O7's Banded Staff +1; N7 and O8 hold seconds of the
  Kilns' Forge Hammer +1 and Seax +1, lines three classes share; N8's and Carn Dubh's pluses are
  their own, off the ladder. All sit inside the band's window of 4,000. Nothing on the moor sells or
  trains: Anvilhall and Kilnhaven train to 19 behind and Rime Lodge to 23 ahead, and the coach runs
  between (#539).
- **Camps.** The Watcher's Hut and the piper's fire are camps of EXPANSION §5.3's kind, where a
  company rests safely (#434, call 9), and the ring's inside is proposed as a third (§9), since the
  chapter sleeps there.

### 4.2 N7, the road up onto the moor (#476): core, band 18

- **Purpose.** Act III's second ground and the moor's way in: the drove road up over the low hills
  from the Kilns, the area's gentlest groups, and the crossing line that tells a company under the
  band how the moor feels (#166). The snow begins here.
- **Landmarks.** The drove road from N7's north edge at about 430,190, over the hills and south
  across the heather to N8; a milestone where the hills give out; the first cairn beside the road;
  the moor opening east, with the ring's stones on the skyline; a peat-cutter's track east to O7.
- **Points of interest,** about nine features and eight groups:
  - a milestone where the road tops the hills: RIME LODGE 5, ANVILHALL 14;
  - the drove road's coach, passing and never stopping (#539), said in a line at the milestone;
  - a cairn beside the road (#45), with a cache;
  - a shrine of the hill folk's, a stone with a cup in it, snow in the cup (#45);
  - a drover's shelter, a camp, where the road leaves the hills (#45);
  - a drover with a rumour: the lights were out over the bog last night, and the ring was lit;
  - the peat-cutter's track east, a sign at its fork.
- **Encounters.** Ravens on the first cairn, eight; bog bodies out of the peat in the marsh beside
  the road (two groups); a moor hound by night (`when`) on the road's southern reach, the box's
  hardest, and the first paralysing bite on the road since the Downs.
- **Quests.** None of its own; the chapter's goal turns east to the ring (§5).
- **The secret and its hint.** The drovers' cache under the first cairn, a stone that lifts, with
  the ladder's first plus for a fighter and the drovers' takings. The hint: the ravens sit on this
  cairn and on no other, and a company that has walked the Cairnfield knows why.
- **New here.** Snow lying underfoot (#536); the crossing line said in snow; a moor hound, the
  Downs' black dog grown old and huge (MONSTERS §7.2).
- **Finds.** The cache's plus, the ladder's: a second Forge Hammer +1, for the second of the knight,
  the paladin and the cleric (#535).
- **Pay.** About 1,400 xp a member.

### 4.3 O7, Fionnlios's box (#477): core, band 18–19

- **Purpose.** High Moor's step of the quest: the ring on the moor, older than the Stones, where the
  company sleeps because there is nowhere else out of the wind, and the voice in the dark. The
  Watcher's Hut and the tarn below the ring, where two second prestiges are taught.
- **Landmarks.** Fionnlios at 462,214, thirteen stones in a ring on a rise of rock, one fallen, and
  the ground inside it bare of snow; the Watcher's Hut at 466,208, a stone hut with a turf roof and
  a tally cut in its lintel; the tarn below the ring to the south with the piper's fire on its shore;
  the hills rising south-east to the first tor; the peat-cutter's track from N7.
- **Points of interest,** about nine features and eight groups:
  - the ring, the step (§5): a camp inside it (§4.1, §9), and by night the voice (`when`), once;
  - the Watcher at his hut, who counts the lights and teaches the Sorcerer's second (#19); the hut
    a camp (#45);
  - the piper at his fire by the tarn, who teaches the Bard's second (#19); the fire a camp (#45);
  - the tally on the hut's lintel, and the gap in it where the last Watcher's years should be;
  - a cairn on the rise below the ring (#45), a shrine by the tarn (#45);
  - the first tor, a face in it by day.
- **Encounters.** Lights round the ring on a snowy night with a moor hound (MONSTERS §7.2's first
  fight): four bog lights by night (`when`), their touch draining spell points while the hound runs
  at the front, the box's hardest group; ravens on the cairn; bog bodies in the marsh at the tarn's
  head; by night a tor troll on the first tor, alone, and by day a tor with a face. The ring itself
  holds no monster.
- **Quests.** The step. The Watcher's Tally begins here (§6).
- **The secret and its hint.** Under the fallen stone, a hollow where the first Watchers kept their
  tallies, and in it the ladder's plus for a caster and a tally older than the hut's. The hint: the
  snow never lies on the ring's ground, and lies least where the stone fell.
- **New here.** The lights, a new family (#483); drain of spell points (`drain: 'sp'`, #161, first
  spent on spell points here, MONSTERS §3.3); a voice that is no monster, an event by night that
  fires once; two trainers at camps; a ring older than the Stones.
- **Finds.** The hollow's plus, the ladder's: a Banded Staff +1 (#535).
- **Pay.** About 1,600 xp a member.

### 4.4 O8, the bog (#478): country, band 19

- **Purpose.** High Moor's peat bog below the ring, the lights' own ground, and the tors above it
  where the trolls stand by day as stone: the box the company crosses to find out what the lights
  are, and finds nothing but light.
- **Landmarks.** The bog in the box's middle, pools and peat-cuttings, duckboards half sunk; the
  peat-cutter's hut at its edge with the body laid out beside it; the tors on the hills to the
  south, each with a face cut in it; the Rimefells' first mountain at the box's south-east corner;
  the tarn's outflow from O7.
- **Points of interest,** about five features and five groups:
  - the peat-cutter, who dug up a body with a rope round its neck (#56's 38);
  - the body's cutting, where it lies down again;
  - a cairn on the hills (#45), a shrine, a stone with a cup (#45);
  - the stonecutter's camp under the tors, a camp (#45; #56's 39);
  - the tors, and the last face half cut.
- **Encounters.** Bog lights over the bog by night (two groups, `when`); the bog body that walks
  at night to get its ring back, with others (§6); trolls on the tor (MONSTERS §7.2's second fight):
  two tor trolls and a flock of ravens by night, the box's hardest, mended each round unless burned
  (#537).
- **Quests.** The Ring on the Bog Body (§6). The Faces on the Tors (§6).
- **The secret and its hint.** A cutting in the bog the peat-cutter stopped at, where the peat is
  black and the lights come up from: a hoard of the hill folk's grave-gold, laid in the bog four
  hundred years ago, with the ladder's plus for a thief. The hint: the lights rise from one cutting
  and drift from there to the ring, and the peat-cutter has not cut it since.
- **New here.** Regeneration (#537): the first monster that gets up again unless burned, and the
  druid's and the sorcerer's fire the answer (DESIGN §7); a monster that is a landmark by day and a
  group by night.
- **Finds.** The hoard's plus, the ladder's: a second Seax +1, for the second of the thief, the bard
  and the sorcerer (#535); the body's ring (§6).
- **Pay.** About 1,400 xp a member.

### 4.5 N8, the Cairnfield's box (#479): core, band 19–20

- **Purpose.** The Cairnfield's step: the cairns themselves along the drove road's last reach, Carn
  Dubh's door among them, and the road's head above the Rimefells where the long lake is first
  seen. The coach that did not come stands here in the snow.
- **Landmarks.** The drove road south from N7 down the box's west side to the Rimefells' notch at
  424,250; the cairns east of the road, a score of them, Carn Dubh the biggest at 430,240 with its
  door in its side; a frozen pool among them; the coach stopped on the road, its horses gone (#494);
  the head of the road, where the ridge drops and the lake lies below; the Rimefells across the
  south, mountain, with the road's notch the only way through.
- **Points of interest,** about nine features and nine groups:
  - the road's head, the step (§5), and the lake below;
  - Carn Dubh's door, the way into #480;
  - the coach in the snow (#56's 40, Rimewater's #494), its lines until #494 builds the quest;
  - a milestone at the head: RIME LODGE 2;
  - a cairn with a wight under it, the Watcher's grave (#56's 37);
  - a shrine of the hill folk's at the road's head (#45), a camp in the notch's lee (#45);
  - a hermit among the cairns who knows which is oldest.
- **Encounters.** Ravens on the cairns, eight to a group (two groups); bog bodies out of the frozen
  pool; cairn wights at two of the cairns, cursing (#537), the box's hardest by day; moor hounds on
  the road by night (`when`), the box's farthest.
- **Quests.** The step. The Watcher's Tally's grave (§6). The Coach That Did Not Come is found
  here and asked at Rime Lodge (§6).
- **The secret and its hint.** The coach's strongbox, under its seat, with a plus for a ranger and
  the fare the coach was carrying to the lodge. The hint: the coach's door hangs open and the snow
  inside it is trodden, and nothing was taken from the luggage on its roof.
- **New here.** Curse (#537), the first condition on the road the temples cure and Absolve lifts
  (DESIGN §7); a crossing met stopped (#539).
- **Finds.** The strongbox's plus, off the ladder, the box's to choose: the ranger's Steel Bow +1 is
  O6's in the Kilns (#535).
- **Pay.** About 1,500 xp a member.

### 4.6 Carn Dubh (#480): dungeon, two levels of 16×16, band 19–20

- **Purpose.** The area's dungeon: the oldest cairn and the oldest dead on the road, the Cairn King
  under it, crowned and older than the crown (MONSTERS §7.2), and the last Watcher's grave with
  the first page of his tally.
- **Landmarks.** The upper chambers: the passage in from the cairn's side, the side cells with the
  hill folk's dead laid in rows, grave-gold at their throats, a wight over each row; the Watcher's
  cell, newer than the rest, his tally's first page under his hands. The lower chamber: a stair down
  through the bedrock to a chamber the cairn was built over, its walls too smooth for the hill
  folk, and the Cairn King on a seat at its end.
- **Points of interest,** about seven features and eight groups a level, as the Foreland's dungeons
  are held: the rows, the Watcher's cell, the stair, the smooth walls, the seat.
- **Encounters.** Bog bodies in the passage (two groups); cairn wights over the rows (three), each
  cursing at 0.2; the Watcher's wight; the Cairn King, boss, level 20, cursing, alone on its seat.
  No lights below ground: they are the ring's.
- **Quests.** The Watcher's Tally's first page, under the Watcher's wight (§6).
- **The secret and its hint.** Behind the King's seat the smooth wall has a door in it that nothing
  opens, and beside it, at a girl's shoulder height, nothing: the first mark on the road a company
  looks for and does not find. In a cell off the stair, the dead the hill folk laid nearest it, the
  richest grave-gold and a named piece. The hint: the rows below are laid with their heads to the
  wall and their feet to the stair, every one but those.
- **New here.** A boss that curses; a cairn built over something that is not a cairn; the smooth
  wall underground, the Sunder's, seen again and not named (docs/areas/sunderwood.md §4.6).
- **Finds.** The grave-gold; a named piece of the hill folk's, a Torc or a Blade, off the ladder,
  the dungeon's to name (#535); the Watcher's first page, a letter read from the pack (#76).
- **Pay.** About 2,200 xp a member.

### 4.7 M7 and M8, the country behind (#484): country, band 18–19, parked

- **Purpose.** The Cairnfield's grass west of the drove road under the Kilns' hills and Kilnmouth's
  mountains, built once the owner has played the act (#434, call 10).
- **Landmarks.** The drovers' summer grazing; a sheepfold; a tarn under the mountains.
- **Encounters.** Moor hounds by night; ravens; a troll on a lone tor.
- **Pay.** About 600 xp a member each.

## 5. The one quest here

Cairnmoor's chapter is The Ring (`chapter.ts`, #481, a working title), joined after the Kilns' The
Anvil Stone, and every zone on the road holds a step (EXPANSION §5.8): High Moor's inside the ring,
the Cairnfield's at the drove road's head above the lakes. Its entries and goals, in the journal's
voice, keyed to flags, events and maps the save holds:

- **The way in.** The drove road up onto the moor in snow, from the Kilns' hills; the goal points
  east to the ring, since there is nowhere out of the wind but inside it.
- **The ring.** Fionnlios, older than the great Stones and dead for centuries, and the company sleeps
  inside it. In the dark something speaks, very old and very faint, like a man talking in his
  sleep: *Crew. Report.* Nobody sleeps after. The voice is an event by night inside the ring
  (`when`, #41), fires once and sets the chapter's flag; by day the ring is stones. The goal turns
  south-west to the road and the lakes.
- **The road's head.** The drove road drops through the Rimefells and Loch Fada, the long lake,
  lies below, where the lodge-keepers say people are coming up through the ice. The goal points
  down to Rime Lodge, where Rimewater's chapter takes it (docs/areas/rimewater.md, to come).

Nothing in the chapter is a lock (EXPANSION §2.3): the ring is open ground, the voice speaks to
whoever sleeps there, and a company that walks the road's head first reads the journal true in that
order. The act's one lock is #440's and lies elsewhere. The walkthrough plays it at 18, 19 and 20,
resting inside the ring by night, in order and with the road's head taken first.

## 6. Side quests

#56's three for Cairnmoor, all standing (#434, call 11), each built with its box on the systems of
#76 (#482), and Rimewater's fourth, found here:

| # | Quest | Level | Where | What it needs | Built in |
|---|---|---|---|---|---|
| 37 | The Watcher's Tally | 19 | the Watcher's Hut (O7); the Watcher's grave under a wight in Carn Dubh; the Watcher or the Lanterns | a letter read from the pack (#76); a hand-in at the first meeting (#43), to the Watcher or to a Lanterns' hall | #477, #480 |
| 38 | The Ring on the Bog Body | 19 | the bog (O8); Tallis's agent, the elves or the cutting | a choice put by a person; `until` (#41); a group that walks only by night (`when`) | #478 |
| 39 | The Faces on the Tors | 20 | the tors (O8); Rime Lodge | a choice put by a person; `after` (#41) | #478, with Rime Lodge's words in Rimewater |
| 40 | The Coach That Did Not Come | Rimewater's | the coach on N8's drove road; Rime Lodge | Rimewater's #494 | #479 places the coach and its lines; #494 the quest |

**The Watcher's Tally.** The Watcher counts the bog lights, as the Watchers have for four hundred
years; the last Watcher's tally says the ring spoke on the nights the Hearth flickered. Its first
page is buried with him in a cairn under a wight, and says the ring spoke eleven nights four hundred
years ago. The company gives it to the Watcher, who writes it into the lintel, or to the Lanterns,
whose fourth-rank ask includes the ring's voice reported (#434, call 8; #439). No hall gives the
quest: the Watcher does (call 8).

**The Ring on the Bog Body.** A peat-cutter dug up a body with a rope round its neck and a ring
patterned like the Helmstow signet; the body walks at night to get it back. Sell the ring to
Tallis's agent, give it to the elves, or put it back, and the body lies down (`until`). The ring's
pattern is seen and never said (DESIGN §10.1).

**The Faces on the Tors.** A Rime Lodge stonecutter has carved faces on the tors for years, and the
Lodge wants him stopped now the trolls get up. Bring him home, or let him finish the last face, and
that tor never stands. Its level is the area's top, 20; the box is 19 and the fight is the box's
trolls.

No change to #56's drafts. 40's coach is built with #494 and stands on N8 from #479, as the hermit
stood on F6 before her quest (docs/areas/wrackholm.md §4.4).

## 7. Encounters, and what is new

MONSTERS §7.2 has the roster and the fights: the Raven, the Bog Light, the Bog Body, the Moor
Hound, the Cairn Wight, the Tor Troll and the Cairn King; lights round the ring, trolls on the tor.
Their drawings are #483's, seven. The ring itself holds no monster: inside it there is only the
voice. §4.2 to §4.6 place every group, box by box, the ravens and the bog bodies at the way in and
the Cairn King at the top of the band.

Cairnmoor spends four of MONSTERS §3.3's asks, each built in the systems lane first (#537; #41 and
#161 exist): regeneration, for the trolls, which mend each round except a round they took fire;
curse, which `inflict` takes for the wights and the King, cured at a temple and lifted by Absolve
(DESIGN §7); drain of spell points (`drain: 'sp'`), for the lights, which Saltreach's leeches spent
on hit points; and `when` for night, for the lights, the hounds and the trolls, which the Downs
spent first. The fire the trolls ask for is the sorcerer's and the druid's by 15 (DESIGN §7).

New in Cairnmoor, for the novelty check (EXPANSION §5.4): the lights, a new family (O7 claims it);
snow lying and ice underfoot (#536); regeneration and curse (#537); a voice that is an event and no
monster; a monster that is a landmark by day; a crossing met stopped on the road (#539). Its
landmarks: a stone ring, a cairnfield, a tor, a tarn.

## 8. The numbers

- **Experience.** The curve (EXPANSION §5.2, #159) gives an area the climb from its floor to the
  next area's floor, divided by 0.75: from 18 to 20 that is 11,000 / 0.75, about 14,667 xp a
  member, with today's `xpForLevel`. The shares of §4 are #437's: N7 1,400, O7 1,600, O8 1,400, N8
  1,500, Carn Dubh 2,200 and the three side quests about 700 between them (37 and 38 200 each, 39
  300): about 8,800, some 40% under the curve. Saltreach's, Wrackholm's and Sunderwood's shares
  each added up to a little over their curve, for a kill paid by level to damp
  (docs/areas/saltreach.md §8); these do not, and the gap is owed to #437 before the first box is
  built (§9). A fight inside the gate's aim at 11 cost about 300 a member whatever its monsters, and
  at 18 to 20 costs more, so a box priced by its fights as the Act II boxes were will land over its
  share here: each is measured when it is built, recorded as built where that passes its share, and
  the sum restated with each. M7 and M8 add about 1,200 when they are built. From here on a kill
  pays by level (#159), so a company that arrives at 18 earns the shares as written and one that
  arrives at 21 earns less; the curve's row reports what a clear falls short of as owed to #437
  until the boxes exist.
- **Gold.** Training six members from 18 to 20 costs 8,880 with today's `trainPrice`, and the second
  prestiges about 4,000 each (DESIGN §5, #19); nothing on the moor sells or trains, so a clear's
  chests and drops must carry the gold to Rime Lodge, and the coach's fare (#539) with it. The band's
  price window is 4,000 (#535): no find on the moor is dearer, the ladder's there 1,450 to 1,550.
- **The gate.** The gate check (`tools/tests/gate.ts`, #38) holds each box at its own floor
  (docs/areas/thornmark.md §9, 17): a company at 18 wins nine in ten of N7's fights and walks the
  drove road resting at its camp; one at 16 wins no more than one in four. The Cairn King is won
  about half the time at 19 and nearly always at 21. The ring's camp is where the road's walk rests
  on O7; the bot learns the trolls' fire with #541.
- **Density.** Core boxes at the Foreland's floor, the bog at the looser one (EXPANSION §5.3). The
  ring's inside is held to no feature but the camp and the voice, so it needs no exception.

## 9. Decisions

Decided by the owner's delegate on 2 October 2026 (#434), and followed here:

1. **No Kiln-script on the moor** (call 2): no inscription is read here, and the ring's voice is not
   script. The hill folk's names are their own tongue (§10).
2. **The lights have no tear** (call 3): the generator serves no Rift after Act II, and the bog
   lights are groups on the bog and round the ring, the Rift at its thinnest. #158's check holds
   that no Rift comes after Cairnmoor.
3. **No new guild, and no hall gives an Act III quest** (call 8): the Watcher gives The Watcher's
   Tally, and the Lanterns' fourth-rank ask includes the ring's voice reported (#439).
4. **Cairnmoor has no town and needs none** (call 9): the Watcher's Hut and the piper's fire by the
   tarn are camps, EXPANSION §5.3's kind, where a company rests safely and the Sorcerer's second
   (Thaumaturge, at the hut) and the Bard's second (Skald, the piper) are taught; the drove road's
   coach runs Kilnhaven to Rime Lodge over N7 and N8 without a stop (#539).
5. **The cuts stand** (call 10): §11; M7 and M8 are parked (#484).
6. **All three side quests stand** (call 11): #56's 37 to 39; 40's coach is found stopped in the snow
   on N8's drove road, built with Rimewater's #494.
7. **The names** (#435): §10.

Decided by delegate for #535, each the owner's to overturn:

1. **The moor's own plus on the ladder is O7's Banded Staff +1,** the caster's its brief asks; the
   rest of the rung by 19 is the Kilns' (docs/areas/kilns.md §9), so a company two under the
   moor's floors at 20 goes without it.
2. **N7 and O8 hold seconds of the Kilns' Forge Hammer +1 and Seax +1,** the ladder's for a fighter
   and a thief: three classes share each line, and the Kilns place one of each.
3. **N8's ranger's plus and Carn Dubh's named piece are off the ladder,** their boxes' to choose:
   the ranger's line has one bearer, and its Steel Bow +1 is O6's.

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.7: each box's landmarks, points of interest, encounters, secret and
  hint, finds and share of the pay.
- **The core** is N7, O7 and N8, the boxes that hold a step or carry the road to one; O8 is country
  (§4).
- **N7 is laid in High Moor,** all of it, though a third of its land is the Cairnfield's: the road
  comes onto the moor there, and the Cairnfield begins at N8 with its cairns.
- **The ring's inside is a camp** of §5.3's kind, since the chapter sleeps there and the voice
  speaks to a company resting by night (#477); the hut's and the fire's are call 9's.
- **The voice fires once,** an event by night inside the ring (`when`), and sets the chapter's flag;
  by day the ring says only its stones (#481).
- **Carn Dubh is two levels of 16×16,** the rows and the chamber under them, with the smooth wall
  behind the King's seat seen and never named (#480).
- **The shares** (§8) are #437's and come to about 8,800 against the curve's 14,667. Scaled to the
  curve by one fraction, as Sunderwood's were scaled down (docs/areas/sunderwood.md §8), they would
  be about N7 2,350, O7 2,650, O8 2,350, N8 2,500, Carn Dubh 3,650 and the side quests 1,200, about
  14,700; the owner's word settles them in #437.
- **The bands on the atlas's rows** (#475): High Moor 18–19, the Cairnfield 19–20, Carn Dubh
  19–20. They are set in `src/content/areas/cairnmoor/atlas.ts`, where only the scaffold reads
  them, for a box's draft; the owner's word changes them there.
- **The trolls' tors stand on O8 and the first on O7,** a landmark by day and a group by night;
  MONSTERS §7.2's Where column has them on the tors and names no box.
- **The Faces on the Tors is at 20 on a box at 19,** its fight the box's trolls, as The Star That
  Moved was at 12 on C7 (docs/areas/saltreach.md §6).

## 10. Names

Cairnmoor's naming pass, by the rules of `docs/NAMES.md`, chosen for #435. The moor's folk and
Rimewater's lodge-keepers share a tongue, the hill folk's, beside the Foreland's English, the
elves' Cornish and the Tidefolk's Frisian.

- **The tongue.** The hill folk are the drovers and peat-cutters of the moor and the keepers of the
  lodges under the glacier, who built the cairns and tallied the lights. Their names are Scots
  Gaelic in shape, spelled as they are said, with no accent the font lacks: *carn* a cairn, *creag*
  a crag, *loch* a lake, *moine* peat, *tulach* a knoll, *dubh* dark, *fionn* white, *beinn* a
  mountain, *allt* a stream, *clach* a stone, *fuar* cold, *fada* long, *eas* a fall, *ceann* a
  head, *lios* a ring or an enclosure, *bogach* a bog. NAMES §2 has it in the hill folk's row, and
  Rimewater draws on it for its lakes, Loch Fada and Loch Fuar (NAMES §4).
- **The names:**

  | Was | Now | What it means | Also thought of |
  |---|---|---|---|
  | the Stone Ring | Fionnlios | the white ring: the ring with the lights round it, and the snow that never lies inside it | Clachlios, the stone ring, which is the Stone Ring again |
  | the Cairns | Carn Dubh | the dark cairn: the oldest and biggest, with the King under it; the field of cairns round it keeps the Crown's name | Carn Fada, the long cairn |

- **Kept:** Cairnmoor, High Moor and the Cairnfield, the Crown's names for the area and its zones,
  which the story and the atlas lean on; the Watcher's Hut, a hut and lettered as one, since the
  Watchers are Lanterns' kin and count in the Crown's tongue; the drove road, a thing and not a name;
  the Rimefells, the Crown's name for the ridge, shared with Rimewater. The tarn and the tors are
  things, lettered nowhere.
- **The hill folk's own words** for the rest, the Cairnfield as *Moine Carn* and the moor as *Beinn
  Fuar*, are theirs in speech and nowhere on the map, as the Tidefolk's Diep is
  (docs/areas/saltreach.md §10).
- **Ids stay:** the dungeon's id is `cairns` under Carn Dubh, as `smugglers_cove` is under Kelp Hole
  (NAMES §3); the zones keep `highmoor` and `cairnfield`. The new names are used throughout this doc,
  the old in brackets at first mention.

## 11. What was cut

- **The rim,** P6, P7 and P8: 763 squares of land, 190 a company could walk (P7 143 of its 363, P8
  47 of its 310, P6 90 of mountain), the rim's face and the heather under it. The maps of the O
  column end in it.
- **The Rimefells,** O9 and N9: 450 squares, 202 walkable (O9 145 of 277, N9 57 of 173), the ridge
  between Cairnmoor and Rimewater; the drove road's notch through them is N8's and M9's.
- **The slivers** in the Kilns' boxes: O6 (195, in the Lava Tubes' box, built whole there), N6 (180)
  and M6 (127), the moor's land north of the low hills, which the Kilns build with their boxes; and
  L7 (181), in Kilnmouth's box, void. Not Cairnmoor's to build.
- **The country behind,** M7 and M8 (§4.7): 1,690 squares, parked, not cut (#434, call 10).

About 1,200 squares void and 680 another area's, to come back as country only if the act plays
short.
