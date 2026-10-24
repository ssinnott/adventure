# Meridian Camp's plan

Meridian Camp's plan and its history (EXPANSION §8.2): the old §4 (the levels' briefs) and §10
(what was cut) of its doc, `docs/areas/meridian_camp.md`, moved here whole by #1027 (every level
in them is built). A new brief goes here first, with its "As built" once it is built. Its
decisions are `docs/areas/meridian_camp/decisions.md`.

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
    being over the area's; Ashfall's pool at 22 is won in all of its 24 groups (past 10 the gate
    judges a company two under by its day, #851). The vents pay 2,146 xp a member for the brief's
    2,200 and hold 900 gold and a Sapphire Vial. Density 100.0% within 7 steps (279 of 279) and the
    furthest 6, with no sign among its 25 points. The curve's rank correlation is 0.63: the round
    nearest at 12 steps, level 24.5, and the sentry the hardest at 42 steps, level 26.0. The gate
    counts the sentry in the level's day and the curve its xp in the clear, though a company before
    the Stone never meets it, as on G11. The walkthrough wins every group at 25 and goes down and up
    both ways.

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
    their maps' floors are won 97.8% of the time, and two under them 94.1%. The corridors pay 4,399
    xp a member for the brief's 2,700, over the cap of 3,375 (§8, the corridors' 3), and hold 1,500
    gold and Meridian Mail +3. Density 100.0% within 7 steps (193 of 193) and the furthest 7 of 10,
    with no sign among its 24 points. The curve's rank correlation is 0.63: the walker nearest at 46
    steps, level 25.7, and the Brood Drake the hardest at 120 steps, level 27.0, at least 27. The
    gate counts the sentry in the level's day and the curve its xp in the clear, though a company
    before the Stone never meets it, as on the vents. The walkthrough wins every group at 26, the
    Brood Drake nine in ten of its uncapped fights, and goes down and up the vents' stair.

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
    a fight broken off; two under, at 25, it wins every fight too (§8, the camp's 2 and 18). The
    level pays 3,003 xp a member for the brief's 3,000, under the cap of 3,750; it holds 1,200 gold
    and the Meridian Staff +4 at 2,600, inside the Glasswold's window of 6,000 (§7). Density 100.0%
    within 7 steps (226 of 226) and the furthest 6 of 10, with no sign among its 24 points. The
    curve's rank correlation is 0.65: the sentry nearest at 4 steps, level 26.0, and the night pair
    the hardest at 27 steps, level 28.0, at least 28. The gate counts the sentry in the level's day,
    though a company before the Stone never meets it, and the night pair, though they are there only
    by night. The walkthrough wins every group at 27, goes down and up the corridors' stair, meets
    Fane with the first journal read and without it and goes out by the rope.

### 4.4 Rests

The Company's three camps are the dungeon's rests, one a level: the first two cold and empty, the
last Fane's, the only warm one (§4.3).

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
- **The Mapmaker's rung, "Fane's Fire",** (the Cartographers' rank 3) is built and no longer owed: its
  deed is `seen: 'meridian_camp3:mc3_fire'`, the once event on the one way to the fire (§8, the
  camp's 7), and it follows the Surveyor's rung, which the Ember Stone built (ashfall §6, §9,
  #635's PR C). The Factor's, the Compact's, is the Dead-Drop's.
- **The chapter's window entry** is #518's and can key on `seen: 'meridian_camp3:mc3_window'` (§8,
  the camp's 8).
- **The Dead-Drop's three levels** are the rest of #22 (docs/areas/dead_drop.md) and are planned to
  pay outside their area's budget as the camp does (EXPANSION §5.2).
- **No secret on this level** (§8, the camp's 16): the dungeon asks none of a level.
- **The two-under figure, past 10, is judged by the day (#851),** as the other boxes' are (§8, the
  camp's 18).
