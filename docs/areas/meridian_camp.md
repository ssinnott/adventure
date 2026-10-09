# Meridian Camp: the Lost Expedition's end, down Fire Mountain's vents

One of the two large dungeons that stand in place of a world-wide Underdeep (#22; DESIGN §4): three
levels of 32×32 under Fire Mountain, band 25–28, reached from Ashfall's G11 in Act IV. The vents
are the Underdeep's exhaust, and two of the Ember Stone's three parts lie on the upper two levels;
at the bottom is the Meridian Company's last camp, with Oriel Fane, the expedition's map of the
hull and the room with a window (DESIGN §9, §10.3). This is its brief (EXPANSION §8.2), written
for #22 under Phase 1.4 (#441). It is Ashfall's dungeon, and docs/areas/ashfall.md §4.11 points
here. Every call below is a decision the owner may overturn; §8 lists them.

Its three levels, the vents, the iron corridors and the camp, are built (#22, §4.1 to §4.3). Its
maps are in `src/content/areas/ashfall/maps/`, beside the area's, and its monsters Ashfall's. Its
ids: `meridian_camp` (the vents), `meridian_camp2` (the iron corridors) and `meridian_camp3` (the
camp); the first keeps the plan's id and its atlas row, as `tide_ship` did.

---

## 1. Where it is

The atlas (`src/content/areas/ashfall/atlas.ts`) has Meridian Camp as a dungeon at 226,340, band
25–28, its way in at the vents' mouth, 226,334, in G11 on Fire Mountain's flank (ashfall §4.5). The
row's band is the union of the three levels' and agrees with them (§4). Laying the vents moves
nothing: the row keeps its id, its place and its band and loses `planned` and `name`; the site at
the mouth loses `planned` (§8, the vents' 12). The corridors add a second plate,
`meridian_camp2` at 226,346, six squares south, with no band and no name (§8, the corridors' 15),
and the camp a third, `meridian_camp3` at 226,352, six squares south of that (§8, the camp's 15).

- **In:** the vents' mouth on G11, and the scavenger's hole beside Grimsforge, which comes in behind
  the furnace room (ashfall §4.5, #56's 52). Both are open since the vents were built (§4.1).
- **Out:** the way in, and Fane's rope up a cold flue from the camp to G11's lookout on the cone's
  shoulder, a way out and never in, as Kelp Hole's flooded passage is (an addition, §8, 3); it is
  built (§4.3; §8, the camp's 11).
- **Down:** a stair at each level's far end; the vents' is open onto the corridors (§4.1) and the
  corridors' onto the camp (§4.2). A door below the camp opens on the service ways and for nobody,
  as the Deep Mines' CREW ONLY is a wall (§4.3; docs/areas/kilns.md §9, 4).

## 2. What it is for

The Lost Expedition's end and Act IV's turn (DESIGN §9, §10.3): the place where the company
learns the sky is a ceiling by looking, and is never told it. The road goes no further than the
second level: the chapter walks the vents and the corridors for two of the Stone's parts and never
needs the camp, the window or the map (#443, call 2; ashfall §5). The camp is for the company that
read the notes, and three third prestiges come here: the Barbarian's after the drake that nests in
the corridors, the Ranger's for Fane's map and, by the Guild's line, the Cartographers' ending (#448,
DESIGN §8).

## 3. What is built

Three levels. The vents (`meridian_camp`, 32×32, band 25; #22, §4.1): in at G11's middle
mouth, open now, or up from the scavenger's hole, onto a flue hall of iron under the three mouths,
black with soot, with a drift under the west mouth and under the east the floor worn bright in a
path. West, the Company's trail: a Guild chain pin at the flue's head and chalked arrows down the
west flue past their first camp, cold, to the stair down to the corridors. Down the middle the
grates, with the stokers on their round; below them the lower gallery, with boot prints under the
machines' tracks; and the stokers' furnace room, where two stokers with their ember salamanders
shovel nothing into nothing and the Ember Stone's first part lies in the furnace's mouth beside a
heap of their parts. The scavenger's hole comes in behind the room. Four groups, one a sentry that
walks up the stair once the Stone is lit.

The iron corridors (`meridian_camp2`, 32×32, band 26; #22, §4.2): down the vents' stair onto four
straight corridors of iron, hot enough to blister, doubling back down the level. On the first a
glove stuck to the wall and the Company's chalk arrows; on the second the flue walker on its round
with a stoker and a cinder drake, and off its west end, behind a door, the Company's second camp,
cold, with their kit in a chest. Off the third a grave with a note; off the fourth the drake's nest,
two drakelings and the Brood Drake on its eggs, with its hoard behind it. At the corridors' end the
Ember Stone's third part, a heap of the walker's parts and the stair down to the camp, barred. Four
groups, one a sentry that comes up that stair once the Stone is lit.

The camp (`meridian_camp3`, 32×32, band 27–28; #22, §4.3): down the corridors' stair into the cold
at the stair's foot, a last chalk arrow with a ring drawn beside it (a fire drawn) and firelight on
the one way in. The Company's third camp is the only warm one: tents laced shut but one, their kit
in a chest, a plotting table, a second grave with a note and, at his fire, Oriel Fane, alive, who
gives his map, sewn shut. In the room beside the hall, through a door with no name, the window.
North, a cold flue and Fane's rope up it to G11's lookout, a way out and never in; south, the steps
down to the deep knockers' gallery, and at its end a door that opens for nobody. Six groups, one a
sentry that goes up the stair once the Stone is lit and one a pair on the steps by night, whose
lamps go over the camp and past the old man. The camp pays outside Ashfall's budget.

The three levels place the five new monsters, drawn ahead of the levels on the frames of the drakes,
the heavy machines and the knockers: the corridors the drakeling, the Brood Drake and the flue
walker, the camp the deep knocker and the inspector (§6, §8; MONSTERS §8.4).

## 4. The levels

Each level is a 32×32 dungeon at the dungeon floor of density (EXPANSION §5.3): about twelve
features and ten groups, about one rest's fights at the band (MONSTERS §4.4), with one place to rest
(§4.4). The band rises from the stair down to the level's far end.

### 4.1 The vents (`meridian_camp`): band 25

- **Purpose.** Ashfall's first deep, and the chapter's step at Fire Mountain: down to the stokers'
  furnace room and the Ember Stone's first part (#443, call 2; ashfall §5).
- **Landmarks.** Three mouths dropping into flues and grates; the stokers' rounds; the furnace room,
  where the machines shovel nothing into nothing; the first of the Company's camps, cold; the
  scavenger's hole behind the furnace room.
- **Encounters.** Stokers with ember salamanders, where fire is useless and lightning the answer
  (MONSTERS §8.2); the furnace room's group the level's hardest. After the Stone is lit, one sentry
  group (`after`), as everywhere in Ashfall.
- **The trail.** The Company's own marks begin here: a Guild chain pin, the same as the Ember
  Stone's hint (ashfall §4.8), and chalked arrows down.
- **Finds.** The Stone's first part (a quest item); parts from the machines, which no shop buys.
- **Pay.** About 2,200 xp a member, Ashfall's (§7).
- **As built** (#22, 9 October): the brief's places laid whole in 279 open squares, with four
  groups for its ten (§8, the vents' 1 and 2). Band 25, the area's own, the map named Meridian Camp
  (§8, the vents' 11). G11's middle mouth, open now, lets a company in at 16,1 facing south, the
  middle of the three mouths (11,1; 16,1; 21,1) over the flue hall, rows 2 and 3. Under the west
  mouth a drift of what has fallen down it, a cairn with 900 gold and a Sapphire Vial (11,1), and
  under the east the floor worn bright in a path (21,2). **The trail** runs west and down: the
  Guild's chain pin at the west flue's head (6,3), the Ember Stone's hint's own pin (ashfall §4.8);
  chalked arrows down the flue (3,8; 3,18; 2,29); behind a door (4,14) a side chamber with the first
  of the Company's camps, cold (7,14), the level's one rest; and at the flue's foot the stair's head
  (2–7 by 26–29) and the stair (4,30), open since the corridors, whose event at 4,29, said once,
  has the heat coming up it like breath. **The middle** is the grates (12–20 by 8–12) round four
  iron stanchions, with the stokers' signs along row 10 and the east flue: slag swept in heaps, the
  grates breathing, a glow far below, tracks worn round and round (7,10; 16,10; 24,10; 28,15). The
  middle flue goes on down, a shovel scraping ahead (16,16), to the lower gallery on row 19, where
  boot prints go west under the machines' tracks (9,19). **The furnace room** (19–27 by 21–28) is
  through a door at 23,20: the furnace a block of iron (22–24 by 25–27), two stokers with two ember
  salamanders at it shovelling nothing into nothing, the Ember Stone's first part, `ember_part1`, in
  a chest in its mouth (23,24) and the stokers' parts in a heap (20,27). At the room's back the
  scavenger's crawl (29,27 to 30) ends at his rope up to G11.
  - **Groups.** A stoker with an ember salamander on the grates' round (`mc1_round`, 19,10) and a
    stoker alone on the east flue's (`mc1_flue`, 28,8), both roaming; the furnace room's two
    stokers with two salamanders (`mc1_stokers`, 23,23), still, the level's hardest (MONSTERS
    §8.2); one sentry `after` `q_ember_lit` at the stair's head (`mc1_sentry`, 6,27), up from below,
    the level's top at 26 as on G11.
  - **Seams.** G11's middle mouth, 26,16, to the vents' 16,1 facing south, and back from 16,1 to
    G11's 27,16 facing east; the scavenger's hole, G11's 31,17, to the vents' 29,30 facing north,
    and back from 29,30 to G11's 31,16 facing west, the hole's chest square. Up the rope a company
    lands inside the scavenger's ring, whose way out is G11's secret door at 29,16, found from
    inside as from outside; the rope goes back down. The stair, 4,30, is `STAIR`, exported, in
    this map's exits since the corridors were built: it lands on their 4,1 facing south, and their
    way back up lands on 4,29 facing north (§8, the vents' 9; the corridors' 14).
  - **Measured.** A company at 25 wins every fight and manages 10.98 fights to a rest, inside the
    aim of 9.25 to 11.25 and the limit of 7.75 to 13.75, with 87.7% of its days ending in a fight
    broken off: the furnace's fight runs past 15 rounds once spell points run low, as G11's
    stokers' did (94.7%), which the gate shows and never judges. Its under-check is n/a, its floor
    being over the area's; Ashfall's pool at 22 is won in all of its 24 groups, owed to #18 as
    before. The vents pay 2,146 xp a member for the brief's 2,200 and hold 900 gold and a Sapphire
    Vial. Density 100.0% within 7 steps (279 of 279) and the furthest 6, with no sign among its 25
    points. The curve's rank correlation is 0.63: the round nearest at 12 steps, level 24.5, and
    the sentry the hardest at 42 steps, level 26.0. The gate counts the sentry in the level's day
    and the curve its xp in the clear, though a company before the Stone never meets it, as on G11.
    The walkthrough wins every group at 25 and goes down and up both ways.

### 4.2 The iron corridors (`meridian_camp2`): band 26 rising to 27

- **Purpose.** The Stone's third part at the corridors' end, and the Barbarian's quarry in its nest
  (#443, call 2; ashfall §6).
- **Landmarks.** Corridors of iron hot enough to blister, running too straight; the corridors' end,
  with the part; the drake's nest in a side gallery at 27, so the chapter never has to pass it; the
  Company's second camp, cold; a grave with a note.
- **Encounters.** Stokers and cinder drakes; drakelings in the nest; a flue walker, the corridors'
  elite; the Brood Drake, boss, level 27, in the nest (MONSTERS §8.4). After the Stone, one sentry
  group (`after`).
- **Finds.** The Stone's third part; the Company's kit in the cold camp, a named piece in the
  band's window; parts.
- **Pay.** About 2,700 xp a member, Ashfall's (§7).
- **As built** (#22, 9 October): the brief's places laid whole in 193 open squares, as four
  straight corridors doubling back, with four groups (§8, the corridors' 1 and 2). Band 26, the
  area's top, the map named The Iron Corridors (§8, the corridors' 15); the rise to 27 is the Brood
  Drake's, for a map's band must sit in Ashfall's curve row, which tops at 26, and 26–27 fails the
  check (§8, the corridors' 4). The vents' stair, open now, lets a company in at 4,1 facing south,
  the stair's foot, with a landing (3–5 by 2) before the first corridor. **The corridors** run east
  on row 3 (3–28), down the east end (x 28, rows 4–10), west on row 11, down the west end (x 3,
  rows 12–18), east on row 19, down the east end (x 28, rows 20–26) and west on row 27 to the
  corridors' end (2–6 by 27–29): each is one unbroken line 26 long, and how straight is only seen,
  along the wall (19,3) and through a grate in the floor of the third (25,19). On the first, a glove
  stuck to the wall by its palm (11,3) and a chalk arrow at the corner (27,3); on the second, the
  flue walker's round heard far off (8,11) and its tracks worn two by two end to end (22,11); at
  the west end a smeared arrow (3,13). Behind a door (4,15) off that end is **the second camp**
  (5–8 by 14–16), cold (7,15), the level's one rest, with the Company's kit in a chest (8,14). Off
  the third, a drake's cast skin along the wall (12,19) and, by a mouth at 22,18, **the grave's
  gallery** (21–23 by 15–17): a heap of slag, a chain pin at its head and the note FANE SAYS ONE
  MORE DAY (22,16). Off the fourth, where the heat is worst (25,27), **the nest** (10–18 by 21–23)
  by a mouth at 14,24–26, with crust like broken pots at the mouth (14,26), the drakelings and the
  Brood Drake behind them and a chest of 1,500 gold behind the drake (18,21). **The corridors'
  end** is a wall of iron, flat and blind (6,27), with the Ember Stone's third part,
  `ember_part3`, in a chest (2,27) and the walker's parts in a heap (2,29); the stair down to the
  camp (4,30) is a square of wall, whose event at 4,29 has a cold draught up the steps and bars
  that will not give.
  - **Groups.** The flue walker on its round with a stoker and a cinder drake (`mc2_walker`,
    16,11), roaming; two drakelings in the nest (`mc2_drakelings`, 14,23), still, and behind them
    the Brood Drake alone on its eggs (`mc2_brood`, 14,21), still, the boss, which does not
    return and has a line for its death; one sentry `after` `q_ember_lit` at the corridors' end
    (`mc2_sentry`, 5,28), up from below. Every kind the brief names is placed once, the drakelings
    two for the roster's six and the cinder drake one: lighter groups, by the pay and the gate (§8,
    the corridors' 2 and 3).
  - **Seams.** The vents' stair, 4,30 (`STAIR`), to the corridors' 4,1 facing south, and back from
    4,1 to the vents' 4,29 facing north. The way down, 4,30, is `STAIR2`, exported and barred:
    `{ x: 4, y: 30, to: 'meridian_camp3', tx: 4, ty: 1, tf: SOUTH }`, with `mc2_stair` at 4,29, not
    once. The camp lists it in this map's exits, opens 4,30, drops or rewrites `mc2_stair`, gives
    the landing asked for (4,1 facing south), lands the way back up on 4,29 facing north and
    changes the walkthrough's `STAIR2` line, which asserts the stair shut (§8, the corridors' 13).
  - **Measured.** A company at 26 wins 90.3% of the level's fights, meeting its aim of 90% (the
    limit is 80%), the boss counted among its four groups; held to the gate's 15 rounds, the
    Brood Drake alone is won 61% at 26 (aim 30% to 70%) and 100% at 28 (aim 90%) (§8, the
    corridors' 5). It manages 8.69 fights to a rest, under the aim of 9.5 to 11.5 and inside the
    limit of 8 to 14, with 88% of its days ending in a fight broken off: the walker's three run
    past 15 rounds once spell points run low, as the vents' furnace does, which the gate shows and
    never judges. Its under-check is n/a, its floor being over the area's; Ashfall's 34 groups at
    their maps' floors are won 97.8% of the time, and two under them 94.1%, owed to #18 as before.
    The corridors pay 4,399 xp a member for the brief's 2,700, over the cap of 3,375 (§8, the
    corridors' 3), and hold 1,500 gold and Meridian Mail +3. Density 100.0% within 7 steps (193 of
    193) and the furthest 7 of 10, with no sign among its 24 points. The curve's rank correlation
    is 0.63: the walker nearest at 46 steps, level 25.7, and the Brood Drake the hardest at 120
    steps, level 27.0, at least 27. The gate counts the sentry in the level's day and the curve
    its xp in the clear, though a company before the Stone never meets it, as on the vents. The
    walkthrough wins every group at 26, the Brood Drake nine in ten of its uncapped fights, and
    goes down and up the vents' stair.

### 4.3 The camp (`meridian_camp3`): band 27 rising to 28

- **Purpose.** The Lost Expedition's end (DESIGN §10.3): Oriel Fane, his map and the window.
- **Landmarks.** The tents and Fane's fire, the third camp and the only warm one; the room beside
  it with the window, which has no sign and no name; a second grave; the deep knockers' gallery
  below the camp at 28, ending at the door to the service ways; the foot of Fane's rope.
- **Encounters.** Fewer groups and more features than the levels above, about eight (six as built,
  §8, the camp's 2): deep knockers and an inspector that calls them, in the gallery below the camp;
  none at the fire. The knockers
  inspect the camp each night and leave Fane alone, because he is not in their way (MONSTERS §2).
- **Oriel Fane** is alive and very old: a person who stands at his fire, never in a fight, and
  never leaves. He gives his map at the first meeting, and his words know whether the journals were
  read; nothing waits on a count of them (EXPANSION §2.3).
- **Fane's Map** (`fane_map`) is a quest item, sewn shut, with nothing a player can read (#443, call
  4). Its giving sets `meridian_map`, and that flag, not the item held, is the Lost Expedition
  completed and the hidden third ending's key (DESIGN §9, §10.3). The Wold's scout takes it, looks,
  says nothing of it, gives it back and teaches the Unerring, as Ysolde reads the first journal
  and gives it back (docs/areas/saltreach.md §9, #181's 6; docs/areas/glasswold.md §6).
- **The window** is a feature in the room beside the camp, never a goal: what the eyes see and
  nothing more, two lines at most, with no word of a hull, a ship, an orbit, a voyage or the
  Custodian. The journal's entry is written only for a company that looks (ashfall §5). Its words are
  the building session's, for the owner's review; this brief holds none.
- **Finds.** The map; the Company's kit, a named piece in the band-28 window.
- **Pay.** About 3,000 xp a member, outside any area's budget (§7).
- **As built** (#22, 9 October): the brief's places laid whole in 226 open squares, as a hall and
  two arms, with six groups (§8, the camp's 1 and 2). Band 27–28, outside Ashfall's budget (the
  camp's 4), the map named The Camp (the camp's 15). The corridors' stair, open now, lets a company
  in at 4,1 facing south, the stair's foot, where the heat is gone (4,2). A landing (3–5 by 2), a way
  down x 4 and east along row 8 lead to **the camp's hall** (10–21 by 6–14, four iron pillars): a
  last chalk arrow with a ring drawn beside it (4,7) and, on the one way in, firelight on the iron
  ahead (9,8). In the hall are the tents in a row, laced shut but one (13,7), with the Company's
  kit in a chest (11,6); **Fane's fire** (15,10), the level's one rest, with Oriel Fane beside it
  (16,10); the second grave, a heap of slag with a chain pin and a note in a shaking hand (11,13);
  and a plotting table with a lamp, a rule and a pen laid square (20,13). East of the hall, through
  a door with no name (23,10), is **the window's room** (24–27 by 9–11) and the window (27,10).
  North, a cold flue (x 19, rows 2–5) with a rope hanging in it (19,4) and Fane's rope at its top
  (19,2). South, the steps (x 15, rows 15–25), with knocking coming up them (15,15), go down to
  **the knockers' gallery** (3–28 by 26–28): its iron knocked bright in rows (12,27), a pick turned
  back on itself at its west end (3,27) and, at its east end, the door to the service ways (29,27),
  flush in the iron with a chain pin jammed in its seam (28,27), a wall drawn as a door, as the
  Deep Mines' CREW ONLY is (`dm3_door`).
  - **Groups.** The deep knockers in the gallery: a three at its west end (`mc3_west`, 6,27), a
    lone one beside it (`mc3_knocker`, 10,26) and a four in the middle (`mc3_four`, 19,28), still;
    before the door the inspector (`mc3_inspector`, 27,27), which calls three more. By night a pair
    stands on the steps (`mc3_night`, 15,17), and at the camp the lamps go over every tent and past
    the old man (`mc3_lamps`, 15,13). One sentry `after` `q_ember_lit` at the stair's foot
    (`mc3_sentry`, 4,5), going up. No group is within 6 of Fane. Six groups, not the brief's about
    eight: the eight small ones first laid gave 19.56 fights to a rest at the floor, 27, and the
    same ten knockers in these give 10.64 (§8, the camp's 2).
  - **Seams.** The corridors' stair, 4,30 (`STAIR2`, open now, labelled, in their exits), to the
    camp's 4,1 facing south, and back from 4,1 to their 4,29 facing north. Fane's rope, one way:
    the camp's 19,2 (`ROPE`, exported, in this map's exits only) to G11's 13,10 facing south, ash
    beside the lookout (14,10) and out of every G11 group's notice; nothing on G11 leads back (§8,
    the camp's 11 and 12). The atlas plate `meridian_camp3` at 226,352.
  - **Measured.** At its floor, 27, a company wins every fight and manages 10.64 fights to a rest,
    inside the aim of 9.75 to 11.75 and the limit of 8.25 to 14.25, with 73% of its days ending in
    a fight broken off; two under, at 25, it wins every fight too, owed to #18 as the other boxes'
    are (§8, the camp's 2 and 18). The level pays 3,003 xp a member for the brief's 3,000, under
    the cap of 3,750; it holds 1,200 gold and the Meridian Staff +4 at 2,600, inside the
    Glasswold's window of 6,000 (§7). Density 100.0% within 7 steps (226 of 226) and the furthest 6
    of 10, with no sign among its 24 points. The curve's rank correlation is 0.65: the sentry
    nearest at 4 steps, level 26.0, and the night pair the hardest at 27 steps, level 28.0, at
    least 28. The gate counts the sentry in the level's day, though a company before the Stone never
    meets it, and the night pair, though they are there only by night. The walkthrough wins every
    group at 27, goes down and up the corridors' stair, meets Fane with the first journal read and
    without it and goes out by the rope.

### 4.4 Rests

The Company's three camps are the dungeon's rests, one a level: the first two cold and empty, the
last Fane's, the only warm one (§4.3).

## 5. The quests here

- **The one quest** (Ashfall's chapter, The Window): its Fire Mountain step and its corridors' step
  are the upper two levels (ashfall §5). The window is an entry, never a goal. The vents' part is
  `ember_part1`, found in the furnace's mouth, which sets no flag; the corridors' is `ember_part3`,
  in a chest at their end, which sets none; Old Cinder's is `ember_part2`, and sets none either (§8,
  the vents' 4; the corridors' 7).
- **The Lost Expedition** (DESIGN §10.3) ends at Fane's fire, done on `meridian_map`, which the giving of his map sets
  (§8, the camp's 6). The trail inside is the Company's
  marks: pins, arrows and two graves with notes for the reader of every note. No new numbered
  journal: the fourth stays in the Ember Stone's lower gallery (ashfall §4.8), and filling
  Cinderport's shelf is #512's.
- **The Cartographers' line** ends here (DESIGN §8; #443, call 7).
- **Third prestiges** (#448): the Barbarian's, kill the drake that nests in the corridors (the Brood
  Drake, ashfall §6); the Ranger's, bring Fane's map back to the Wold's scout.

## 6. Encounters, and what is new

MONSTERS §8.4 has the roster. No new family: Ashfall already adds the drakes and the heavy
machines, and the camp is Ashfall's (MONSTERS §11). New defs in old families: the drakeling, the
Brood Drake, the flue walker and the inspector; the deep knocker is first met here at 28 and is
back in the Underdeep. Asks: sweep with fire (#545), calls (#537), elements. The corridors place
the drakeling, the Brood Drake and the flue walker (§4.2); the camp places the inspector and the
deep knocker (§4.3), restated on the line at 28 (§8, the camp's 17).

New here, for the novelty check (EXPANSION §5.4): a camp of the dead expedition with a living man
in it; a way out that is not a way in; a window. The vents claim none of it (§8, the vents' 14),
nor do the corridors (§8, the corridors' 16) or the camp (§8, the camp's 16).

## 7. The numbers

- **Experience.** The vents and the corridors are Ashfall's balance of about 4,900 (ashfall §8),
  split about 2,200 and 2,700. The camp, about 3,000, pays outside any area's budget, as Wrackholm
  counts the Dead-Drop and Ashfall its country behind; pay by level (#159) keeps a company that
  goes down early from overshooting. As built, the vents pay 2,146 a member, 0.98 of their 2,200
  (§4.1; §8, the vents' 3). The corridors pay 4,399, 1.63 of their 2,700 and over the cap of 3,375,
  the Brood Drake alone paying 2,862 (§4.2; §8, the corridors' 3). The camp pays 3,003, 1.00 of its
  3,000 and under its cap of 3,750, outside any area's budget: Ashfall lists it `outside`, so the
  curve prints its pay as a figure and no clear counts it (§4.3; §8, the camp's 3 and 4). With
  Ashfall's other maps a clear is 29,386 of the area's 19,467 (ashfall §8).
- **The gate.** Each level is held at its own floor (EXPANSION §5.2). The Brood Drake is won about
  half the time at 26, the corridors' floor, and nearly always at 28. As built, a company at the
  vents' floor, 25, wins every fight and manages 10.98 fights to a rest (§4.1); at the corridors'
  floor, 26, it wins 90.3% of the fights and manages 8.69, and the Brood Drake is won 61% of the
  time at 26 and 100% at 28 (§4.2; §8, the corridors' 5). At the camp's floor, 27, it wins every
  fight and manages 10.64 fights to a rest; two under, at 25, it wins every fight, owed to #18
  (§4.3; §8, the camp's 2 and 18).
- **Gold and finds.** Machines carry parts; the Company's kit is the finds, a named piece on each
  of the lower two levels, in the band's window. As built, the vents hold 900 gold and a Sapphire
  Vial, in the drift, but no gear (§8, the vents' 8); their parts are the Stone's first, a quest
  item, and the stokers' firebar and shovel blade, which no shop buys (§8, the vents' 4 and 5). The
  corridors hold 1,500 gold, in the nest's hoard, and the Company's kit in the cold camp, Meridian
  Mail +3 at 2,450, inside the window and under the Ember Stone's Drakeskin Coat +1 at 3,250,
  Ashfall's dearest find (§8, the corridors' 8 and 12); their parts are the Stone's third, a quest
  item, and the flue walker's damper and climbing iron, which no shop buys (§8, the corridors' 7 and
  9). The camp holds 1,200 gold and, in the Company's kit in the tents, the Meridian Staff +4 at
  2,600, inside the Glasswold's window of 6,000, which holds a map outside the budget; and Fane's
  Map, a quest item (§8, the camp's 6 and 13).

## 8. Decisions

Decided by the owner's delegate on 3 October 2026 for #22, following #443's call 4 and the owner's
comment on #22; each may be overturned:

1. **Three levels of 32×32, the bands exactly call 4's:** the vents at 25, the corridors at 26–27,
   the camp at 27–28. The atlas row's 25–28 is their union and stands.
2. **The ids** are `meridian_camp`, `meridian_camp2` and `meridian_camp3`.
3. **Fane's rope** up a cold flue to G11's lookout is the camp's way out and never in (an addition).
4. **The drake's nest is a side gallery,** so the chapter's walk to the third part never passes the
   Barbarian's quarry.
5. **Fane gives the map at the first meeting;** nothing counts the journals.
6. **`meridian_map` is the Lost Expedition completed,** set by the giving, and the scout gives the
   map back (an addition to DESIGN §10.3, which said only that the map is brought out).
7. **The window says only what the eyes see,** and the map has nothing to read: the act's turn is
   the sky as a ceiling, and the Custodian's lie about the voyage stays the hidden third's, found at
   the Core.
8. **The service ways' door below the camp opens for nobody;** the camp is a glimpse of the hull,
   not a door into a wider map.
9. **No new family;** four new defs and the deep knocker brought forward to 28 (MONSTERS §8.4).
10. **The camp level pays outside any budget,** about 3,000; the upper two are Ashfall's 4,900.
    Built so (the camp's 3 and 4).
11. **Build order:** the upper two levels in Ashfall's flight, right after G11 (#513), since the
    chapter needs the parts; the camp once the Wold's curve row is in. The camp is built (§4.3).

Decided by delegate for #22 (the camp's monsters), each the owner's to overturn:

1. **The inspector is a knocker,** on the knockers' frame, as MONSTERS §8.4 and §11 and the frame's
   own notes have it (the brief put it on the heavy machines'): the deep knockers' caller.
2. **The looks:** the drakeling *The mountain's youngest. Its crust has not set.*; the Brood Drake
   *It will not leave the eggs.*; the flue walker *It walks the corridor to its end, and back.*; the
   inspector *It holds its light to the wall, and then to you.*; the deep knocker §9.2's.
3. **Fire does not touch the drakeling or the Brood Drake,** as it does not their kin, though the
   roster says only that they fly; both reach the back row (`ranged`), as the Cinder Drake does.
4. **The drakeling does not breathe:** fodder on the line at 26 and six to a group, with no sweep;
   the corridors place two (the corridors' 2).
5. **The Brood Drake is set off the line as the Old Drake is:** the boss line at 27 come down whole
   to a sweeper's share, 1,250 and 21d7+34, its breath fire on a row a turn in four, for the
   corridors' gate (§7) to set; it set the blow to 19d7+28 (the corridors' 5).
6. **The flue walker is the elite's line at 27,** its hooks holding at the elite's 0.15 as the
   Sentry's clamp does; the deep knocker the armoured line at 28 with no parts yet; the inspector a
   caller on a soldier's numbers at 28, calling three deep knockers at a half a turn, as the
   tallyman calls knockers at 20.
7. **The Brood Drake is drawn settled on its clutch,** three eggs between its feet and its wings
   mantled round them, though it flies: the nest is where it is met. Size 1.8, inside the tall
   boss's crown; the drakeling 0.6, the flue walker 1.5, the deep knocker 0.75, the inspector 0.8.
8. **Each is owed to the level that first places it** (`UNPLACED`): the drakeling, the Brood Drake
   and the flue walker to `meridian_camp2`, which placed them (the corridors' 6); the deep knocker
   and the inspector to `meridian_camp3`, which placed them (the camp's 17).

Decided by delegate for #22, each the owner's to overturn:

1. **The vents are laid as 4.1 has them,** 279 open squares: the three mouths, the flue hall, the
   west and east flues, the grates, the lower gallery, the furnace room, the stair's head and the
   scavenger's crawl (§4.1, as built). The middle mouth is the way in, as G11's `VENTS` asked.
2. **Four groups for the brief's ten,** because the pay binds first: the furnace's fight alone pays
   980 a member. A stoker with a salamander on the grates' round and a stoker alone on the east
   flue's, both roaming; the furnace room's two stokers with two salamanders, still, the level's
   hardest; one sentry `after` `q_ember_lit` at the stair's head, up from below, the level's top at
   26 as on G11. They read 10.98 fights to a rest, inside the aim, in two rounds, as "the stokers'
   rounds" asks.
3. **Pay 2,146 xp a member,** 0.98 of the brief's 2,200: the round 2,940, the flue's stoker 1,987,
   the furnace 5,880 and the sentry 2,067, 12,874 between six. The sentry's xp counts in the clear,
   as on G11.
4. **The Ember Stone's first part is `ember_part1`, "Ember Stone's First Part",** a quest item (no
   slot, no price) in a chest in the furnace's mouth (`mc1_part`, 23,24), past the furnace room's
   group. The docs named no part; the ordinal follows the chapter's order (ashfall §5: the vents,
   Old Cinder, the corridors). The second, Old Cinder's (#515), and the third, the corridors' (level
   2), are to be `ember_part2` and `ember_part3` for their builders, and the Stone's hand-in (#516)
   takes the three. The finding sets no flag: the hand-in takes the item, the Hearth reads only the
   lighting (ashfall §9, #548's 2) and the chapter can read the item or `seen:
   'meridian_camp:mc1_furnace'` (#518). The id is a save key once merged.
5. **The stokers' parts are two new items,** `stoker_firebar` ("Stoker's Firebar") and
   `stoker_blade` ("Stoker's Shovel Blade"), no slot and no price, as the Kilns' knocker's plate,
   in the heap chest (`mc1_heap`, 20,27).
6. **The camp is a `camp` feature,** "A cold camp", at 7,14 in the side chamber: empty and cold
   (§4.4). It is the level's one rest: a camp lets a company rest with a group two squares off,
   where elsewhere none may be within two.
7. **The trail is seen and never told:** the Guild's chain pin at the west flue's head (`mc1_pin`,
   6,3), the Ember Stone's hint's own pin; three chalked arrows down the flue to the stair (3,8;
   3,18; 2,29); boot prints under the machines' tracks in the lower gallery (`mc1_boots`, 9,19).
8. **Gold 900 and a Sapphire Vial** in the drift under the west mouth (`mc1_drift`, 11,1, a cairn:
   what fell down the mouth). No gear: the Company's kit is the lower levels' (§7). The area's
   dearest find stays the Great Axe +2.
9. **The stair down is `STAIR`, exported:** `{ x: 4, y: 30, to: 'meridian_camp2', tx: 4, ty: 1, tf:
   SOUTH }`, its square wall, with `mc1_stair` at its head (4,29), not once. The corridors then
   listed it in this map's exits, opened 4,30, rewrote `mc1_stair` and landed the way back up on
   4,29 facing north (the corridors' 14).
10. **No secret on this level:** no check asks one of a dungeon level, and the doc's hint is the
    Company's trail (§4.1). The hole is plain from below; its secret door is G11's.
11. **The map is named Meridian Camp,** since a built place's plate shows its map's name (§9 had the
    Vents): band 25 only, region Ashfall, `bare` (iron flues, nothing hung), a soot palette and
    `smooth` walls.
12. **The atlas:** the place row keeps its id, 226,340 and band 25–28 (the union of the three
    levels; the plate shows the built map's own band first) and loses `planned` and `name`; the
    site at the vents' mouth (226,334) loses `planned`. The corridors' plate went six squares
    south, 226,346, as Highcell's second did (the corridors' 15).
13. **G11 is opened as its handoff asked:** `VENTS` and `HOLE` are in its `exits` with labels, and
    26,16 and 31,17 are re-lettered ash; the side mouths stay vents. `g11_vents` stays as it was,
    the step's line said at the front each time, so on every return up the rungs.
14. **Novelty claims nothing:** Ashfall's claim stands. The way out that is not a way in and the
    camp of the dead expedition are level 3's.
15. **The density is met with features, not groups:** 15 events, a cairn, two chests, the camp, four
    groups and two exits make 25 points; every event is two lines.

Decided by delegate for #22, each the owner's to overturn:

1. **The corridors are laid as four straight corridors doubling back,** 193 open squares (§4.2,
   as built): east on row 3, down the east end, west on row 11, down the west end, east on row 19,
   down the east end and west on row 27 to the end. The cold camp is behind a door off the west
   end, the grave's gallery off the third and the nest off the fourth. "Too straight" is only
   seen: every corridor is one unbroken line 26 long (`mc2_true`, `mc2_grate`).
2. **Four groups:** the flue walker on its round with a stoker and a cinder drake, roaming; two
   drakelings in the nest; the Brood Drake alone on its eggs behind them, the boss, never
   respawning; one sentry `after` `q_ember_lit` at the end, up from below. Every kind the brief
   names is placed once; the drakelings are two, not the roster's six, and the cinder drake one:
   lighter groups, by the pay and the gate (3).
3. **Pay 4,399 xp a member, over the brief's 2,700 and its cap of 3,375 (1.25 times it): it cannot
   hold with the boss here.** The Brood Drake alone pays 17,173, 2,862 a member, its role's xp at
   27, which is not this level's to change, and the sentry adds 345: the walker's group 6,121, the
   drakelings 1,034, the Brood Drake 17,173 and the sentry 2,067, 26,395 between six. The gate's
   day (8 to 14 fights to a rest at 26, the boss left out) then needs a hard corridor group beside
   the sentry, whose fight alone is 30 fights to a rest. At 26 over 300 days the sentry with the
   walker and the stoker reads 12.26 at 3,895 a member, the cheapest mix that passes, but it
   places no drakelings and no cinder drake; with six drakelings it reads 12.83 at 4,412, still
   no cinder drake; with the cinder drake in the walker's group and six drakelings 6.56, which
   fails; with two drakelings 8.50 at 4,399, the pick; with one, 8.94 at 4,313. The pick keeps every
   kind the brief names and the drakelings plural. The owner's to decide: accept 1.63 of the share,
   or cut a kind, the floor being the sentry with the walker and the stoker, 3,895, 1.44. What it
   does to Ashfall's clear is in ashfall §9, #22's 4.
4. **The band is 26–26 on the map, its rise to 27 carried by its monsters:** Ashfall's curve row
   tops at 26 and a map's band must sit in it, so 26–27 fails the check. With a band of 26 the rise
   check's top is 27, so the hardest group must average 27: the Brood Drake stands alone, for with
   its drakelings it averages 26.33. As the vents (25, their sentry at 26) and Highcell. No zone
   words, a dungeon having none.
5. **The Brood Drake keeps its 1,250 hit points and level 27, its blow going from 21d7+34 to
   19d7+28:** the gate (15 rounds a fight) read the drawn figures 31% at 26 and 99% at 28. At 61%
   and 100% the level's share of fights won at 26 is 90.3%, inside its 90% aim, the level counting
   the boss among its four groups (as Highcell's Abbot was set to 66%); nearer half (1,000 and
   21d7+34, 48%) leaves the level at 87%, off its aim. The brief's "about half" is 61% here.
   `OFF_LINE` says: "the corridors' boss, the boss line come down whole to a sweeper's share with
   the drakes' breath, as the Old Drake, its blow set by the corridors' gate (#22)".
6. **The drakeling and the flue walker are restated on the line** as #549 made it (PR #661): the
   drakeling to fodder at 26, 241 and 2d8+5 to 191 and 3d8+4; the flue walker to an elite at 27,
   624 and 6d8+7 to 670 and 7d8+7; ids, looks, sprites and flags kept. Both leave `RESTATE`, and
   the drakeling, the Brood Drake and the flue walker leave `UNPLACED` (tools/tests/maps.ts). The
   Brood Drake stays in `OFF_LINE`.
7. **The Ember Stone's third part is `ember_part3`, "Ember Stone's Third Part",** a quest item (no
   slot, no price; a wedge of grey iron, warm, its broad face cut to fit something) in a chest at
   the corridors' end (`mc2_part`, 2,27). The finding sets no flag, as the first; the hand-in
   (#516) reads the item.
8. **The Company's kit is `meridian_mail`, "Meridian Mail +3":** the Kilns' Dwarf Mail with a plus
   of 3 (AC 14, the heavy classes', 2,450, inside the 5,500 window), named as the Foreland's
   Captain's Mail is, with a line of look (its lining burnt through across the shoulders), in a
   chest at the cold camp (`mc2_kit`, 8,14). Old Cinder's Flamberge +1 at 2,550 stays Ashfall's
   dearest find, the Mail the next.
9. **The machines' parts are two new items,** `walker_damper` ("Flue Walker's Damper") and
   `walker_iron` ("Flue Walker's Climbing Iron"), no slot and no price, as the stokers', in the heap
   at the corridors' end (`mc2_heap`, 2,29).
10. **The camp is a `camp` feature,** "A cold camp", at 7,15 behind its door: charred bedrolls and a
    ring of stones with no ash in it, cold because nobody could bear a fire here, seen and not
    told. The level's one rest.
11. **The grave with a note** is one event in its gallery (`mc2_grave`, 22,16): a heap of slag, a
    chain pin at its head and the note FANE SAYS ONE MORE DAY, the Company's marks, Fane alive
    below. The trail also has two chalk arrows (`mc2_arrow`, 27,3; `mc2_arrow2`, 3,13) and the
    glove on the wall (`mc2_glove`, 11,3), the blistering heat, seen.
12. **The nest's hoard is a chest of 1,500 gold** behind the drake (`mc2_hoard`, 18,21): the
    level's gold.
13. **The way down is `STAIR2`, exported:** `{ x: 4, y: 30, to: 'meridian_camp3', tx: 4, ty: 1, tf:
    SOUTH }`, its square wall, with `mc2_stair` at its head (4,29), not once: a cold draught up the
    steps, bars that will not give. The camp then listed it in this map's exits, opened 4,30,
    rewrote `mc2_stair`, gave the landing (asked for: 4,1 facing south), landed the way back up on
    4,29 facing north and changed the walkthrough's `STAIR2` line, which asserted it shut (the
    camp's 12).
14. **The vents' stair is opened as the vents' handoff asked:** `STAIR` takes a label ("Down the
    steps into the red dark...") and is in `meridian_camp`'s exits; 4,30 is floor. `mc1_stair` is
    rewritten (heat coming up like breath) and made `once`: said each time while barred, it would
    now be said on every return up. The corridors' way back up lands on 4,29 facing north.
15. **The map is named The Iron Corridors,** the plain name §9 has: band 26–26, region Ashfall,
    `bare`, a rust-dark iron palette and `smooth` walls. The atlas plate is a second row,
    `meridian_camp2` at 226,346, six squares south, with no band and no name, as `monastery2`.
16. **No secret on the level, and novelty claims nothing:** no check asks a secret of a dungeon
    level, and no token on the level is new on the road (a features event, a camp and a chest; a
    door; `after`, `roams` and `slainText`; drakes and machines; ranged, fire, paralysed: all met
    before), so Ashfall's claim stands.
17. **The gate's boss list:** `firemount: ['meridian_camp2:mc2_brood']` in `BOSSES`
    (tools/tests/gate.ts), the zone the dungeon opens from, so the boss is judged at 26 and 28 and
    left out of the day.

Decided by delegate for #22 (the camp), each the owner's to overturn:

1. **The camp is laid as a hall and two arms,** 226 open squares (§4.3, as built): the stair's foot
   (4,1) and a landing, down x 4 and east on row 8 into the hall (10–21 by 6–14, four iron pillars),
   the window's room east of it through an unnamed door (23,10), the cold flue north (x 19, rows
   2–5) and the steps south (x 15, rows 15–25) to the knockers' gallery (3–28 by 26–28), which ends
   at the door to the service ways (29,27), a legend `Z` wall drawn as a door, as the Deep Mines'
   CREW ONLY is (`dm3_door`).
2. **Six groups, not the brief's about eight.** At the floor, 27, the eight small groups first laid
   (the sentry, the night pair, the inspector, three pairs along the gallery and two lone
   knockers) were too easy: 19.56 fights to a rest against 9.91 at 26, the aim 9.75 to 11.75 and
   the limit 8.25 to 14.25. The same ten knockers, over 300 days at 27: a pair, a four and a pair
   10.37; a lone one, a three and a four 10.64; a lone one, a pair and a five 11.03; a three, a
   three and a pair 12.23; two fours 8.14, past the limit. The pick is the second, nearest the
   aim's middle: `mc3_west` three, `mc3_knocker` one and `mc3_four` four, beside the night pair, the
   sentry and the inspector as built. Monsters, levels and pay are as built (3), the night pair
   stands where it did (9) and the rise holds (4). The owner's to overturn: more groups make a day
   twice the aim's length, fewer one past its limit.
3. **Pay 3,003 xp a member** (18,020 between six: the sentry 2,067; the ten deep knockers 1,484
   each, 14,840; the inspector 1,113), 1.00 of the brief's 3,000 and under its cap of 3,750.
   The curve counts only the groups' own monsters, never the knockers the inspector calls. The
   regrouping moves none of it.
4. **The band is 27–28, and Ashfall lists the camp `outside`** (`outside: ['meridian_camp3']`, PR
   #679's rule: a map whose floor, 27, is past the area's band, 24–26, may pay outside any area's
   budget). The curve holds it to its band, its monsters' levels (the sentry 26, every other group
   28) and the window of the Glasswold's row, 6,000, the last on the road whose floor, 26, is at or
   under its own; no clear counts its 3,003 xp or 1,200 gold, which the curve prints as a figure;
   the gate judges it at 27 and 25, out of Ashfall's pools. Ashfall's clear is 29,386 xp a member
   of 19,467 and 9,900 gold of 11,760, none of it the camp's. The first build banded it 26–26 to sit
   in Ashfall's row, and its pay then counted in the clear, 3,003 xp and 1,200 gold more. Rise: the
   sentry (26) is nearest the way in and every other group 28 (rank correlation 0.65, the hardest
   at least 28).
5. **Oriel Fane is an `npc` at 16,10 beside his fire** (the `camp`, 15,10), no group within 6 of
   him (the walk checks it). The first meeting is the default `lines` and, before them, a `says`
   entry `after` `{ flag: 'meridian_read' }` (Ysolde read the first journal, the only read-token
   in the game) with the same choice: nothing counts the journals. The map is a one-answer
   `choice` (`MAP`, one object shared by both, so the curve counts it once): "Take it." sets
   `meridian_map` and gives `fane_map`. Once it is given a `says` entry `after` `meridian_map`
   holds his later words, with no choice. "You took your time" is said to every company (ashfall
   §5's line); only a reader hears that somebody read him.
6. **`fane_map`, "Fane's Map",** is a quest item (no slot, no price), two lines of look, sewn shut,
   nothing to read; `meridian_map` is set only by the giving. The Lost Expedition (`meridian`,
   thornmark/quests.ts) now has `done: { flag: 'meridian_map' }` and an entry `fane`, since the
   engine's own note says a quest with no `done` is one whose end is not built. Its start stays the
   first journal: started by the flag it would start done with no goal, which the quests check
   fails ("starts with a goal").
7. **The fire's once event for the Mapmaker's rung is `mc3_fire`** (9,8), on the one way from the
   stair to the fire: the walk checks the fire cannot be reached without passing it. The deed is
   `seen: 'meridian_camp3:mc3_fire'`; the rung is owed (§10).
8. **The window is `mc3_window`** (27,10, `once`), in the room through the unnamed door: no sign, no
   name, no label. The chapter's entry (#518) can key on `seen: 'meridian_camp3:mc3_window'`. The
   walk checks that its text names no hull, ship, orbit, voyage or Custodian.
9. **The knockers inspect the camp by night and leave Fane alone:** a `when: { hours: 'night' }`
   group of two deep knockers, `roams: false`, on the steps at 15,17 (7 from the fire, 8 from Fane:
   it never reaches the camp's squares) and a night-only once event at the camp, `mc3_lamps`
   (15,13), the lamps going over everything but the old man. By day the steps are clear.
10. **One sentry `after` `q_ember_lit`,** at 4,5 on the way from the stair (the levels above's
    pattern, one sentry each), "going up"; it is the level's lowest group and carries the rise.
11. **Fane's rope is `ROPE`, exported:** `{ x: 19, y: 2, to: 'firemount_g11', tx: 13, ty: 10, tf:
    SOUTH, label }`, in this map's exits only. G11 lists nothing to `meridian_camp3` (the walk
    checks it), as Kelp Hole's flooded passage onto F6. 13,10 is ash beside the lookout (14,10),
    four from `g11_slope` (16,11, aware 3); the walk checks it is out of every G11 group's notice.
    G11 gets only a comment saying so: no square changes and its exits stay two.
12. **The corridors' `STAIR2` is opened** as their handoff asked: a label, in `meridian_camp2`'s
    exits, 4,30 floor, `mc2_stair` rewritten ("There is smoke on it.") and made `once` (said each
    time, it would now be said on every return up). The camp's way back up lands on 4,29 facing
    north; the landing is 4,1 facing south, as asked.
13. **The Company's kit is `meridian_staff`, "Meridian Staff +4":** the armourer's Battle Staff with
    a plus of 4 (2,600, any class), a surveyor's staff notched in spans (Fane: "Every span of it
    walked"), in the kit chest in the tents (`mc3_kit`, 11,6) with 1,200 gold. It is the camp's
    dearest find, in the Glasswold's window of 6,000, where a map outside the budget is held (4).
    Ashfall's dearest is the Ember Stone's Drakeskin Coat +1 at 3,250.
14. **The second grave is `mc3_grave`** (11,13): slag, a chain pin and a note in a shaking hand, ONE
    MORE DAY, the corridors' note FANE SAYS ONE MORE DAY answered (for the reader of every note).
15. **The map is named The Camp,** the plain name §9 has ("Meridian Camp" is the vents' map's name
    already): band 27–28, region Ashfall, `bare`, a cold grey iron palette and `smooth` walls. The
    atlas plate is a third row, `meridian_camp3` at 226,352, six squares south of the second, with
    no band and no name.
16. **No secret on the level, and novelty claims nothing:** no check asks a secret of a dungeon
    level, and no token on the level is new (npc, camp, event and chest; a door; `after`, `when`
    and `roams`; machines and calls: all met before), so Ashfall's claim stands. The camp with a
    living man, the way out that is not a way in and the window have no token.
17. **The deep knocker and the inspector are restated on the line** as #549 made it (PR #661): the
    deep knocker to the armoured line at 28 (517 and 5d7+11 to 523 and 6d8+5), the inspector to the
    soldier's at 28 (5d8+3 to 5d7+8, hit points 408 kept); ids, looks, sprites and calls kept. Both
    leave `RESTATE` (tools/tests/harness.ts) and `UNPLACED` (tools/tests/maps.ts). No boss on the
    level, so no `BOSSES` entry.
18. **The gate's two-under figure is owed to #18:** a company at 25 wins every fight, as it does in
    every box past Act II's first, for the aims for the day and for two under pull against each
    other past 10. The row is `'meridian_camp3: under'` in `OWED` (tools/tests/gate.ts), held at
    100%. The day's figure, 10.64, is not owed: it is inside its aim.

## 9. Names

- **Meridian Camp** stands, the Guild's name for the Company's last camp (ashfall §10).
- **The levels** take plain names, as the Tide Ship's decks do: the Vents, the Iron Corridors and
  Meridian Camp. The vents' map is named Meridian Camp, since a built place's plate shows its map's
  name (§8, the vents' 11); the corridors' is named The Iron Corridors (§8, the corridors' 15); the
  camp's is named The Camp (§8, the camp's 15).
- **The window's room has no name** in the game. The item is Fane's Map.

## 10. What was cut

- **A numbered journal inside:** the Company's marks carry the trail, and the fourth journal stays
  where Ashfall put it.
- **A way on from the camp:** the service ways' door stays shut; the Underdeep is Act V's (DESIGN §4).

Cut and owed, from the vents (#22):

- **Four groups stand for the brief's ten** (§8, the vents' 2): the furnace's fight alone pays 980
  a member, so the pay binds before the density does.
- **No secret on this level** (§8, the vents' 10): the dungeon asks none of a level, and the hint
  the doc gives is the Company's trail.
- **The stair stood barred** until the corridors were built, which listed `STAIR` in the vents'
  exits, opened 4,30 and landed the way back up on 4,29 facing north (§8, the vents' 9; the
  corridors' 14).
- **The second part,** `ember_part2`, is Old Cinder's (#515); the hand-in (#516) takes the three
  (§8, the vents' 4).

Cut and owed, from the corridors (#22):

- **Lighter groups stand for the roster's** (§8, the corridors' 2 and 3): two drakelings, not six,
  and one cinder drake; the cheapest mix that passes the gate, 3,895 a member, places neither.
- **The pay stands over the brief's cap** (§8, the corridors' 3): 4,399 a member for 2,700, cap
  3,375, because the Brood Drake alone pays 2,862 and the gate then wants a hard group beside the
  sentry. The owner may accept 1.63 of the share or cut a kind.
- **The band is 26–26 on the map** (§8, the corridors' 4), its rise to 27 the Brood Drake's alone.
- **No secret on this level** (§8, the corridors' 16): the dungeon asks none of a level.
- **The third part is placed,** `ember_part3` in a chest at 2,27, for the hand-in (#516) to read
  (§8, the corridors' 7).
- **The stair down stood barred** until the camp was built, which listed `STAIR2` in the corridors'
  exits, opened 4,30, rewrote `mc2_stair`, gave the landing asked for (4,1 facing south), landed
  the way back up on 4,29 facing north and changed the walkthrough's `STAIR2` line (§8, the
  corridors' 13; the camp's 12).

Cut and owed, from the camp (#22):

- **Six groups stand for the brief's about eight** (§8, the camp's 2): at the floor, 27, the eight
  small groups first laid gave 19.56 fights to a rest, so the same ten deep knockers stand in a
  three, a lone one and a four.
- **The Mapmaker's rung, "Fane's Fire",** (the Cartographers' rank 3) is owed: its deed is `seen:
  'meridian_camp3:mc3_fire'`, the once event on the one way to the fire (§8, the camp's 7; ashfall
  §11). It needs the Surveyor's rung, which the Ember Stone built.
- **The chapter's window entry** is #518's and can key on `seen: 'meridian_camp3:mc3_window'` (§8,
  the camp's 8).
- **The Dead-Drop's three levels** are the rest of #22 (docs/areas/dead_drop.md) and are planned to
  pay outside their area's budget as the camp does (EXPANSION §5.2).
- **No secret on this level** (§8, the camp's 16): the dungeon asks none of a level.
- **The two-under figure is owed to #18,** as the other boxes' are (§8, the camp's 18).
