# Meridian Camp: the Lost Expedition's end, down Fire Mountain's vents

One of the two large dungeons that stand in place of a world-wide Underdeep (#22; DESIGN §4): three
levels of 32×32 under Fire Mountain, band 25–28, reached from Ashfall's G11 in Act IV. The vents
are the Underdeep's exhaust, and two of the Ember Stone's three parts lie on the upper two levels;
at the bottom is the Meridian Company's last camp, with Oriel Fane, the expedition's map of the
hull and the room with a window (DESIGN §9, §10.3). This is its brief (EXPANSION §8.2), written
for #22 under Phase 1.4 (#441). It is Ashfall's dungeon, and docs/areas/ashfall.md §4.11 points
here. Every call below is a decision the owner may overturn; §8 lists them.

Its first level, the vents, is built (#22, §4.1); the iron corridors and the camp are to build. Its
maps are in `src/content/areas/ashfall/maps/`, beside the area's, and its monsters Ashfall's. Its
ids: `meridian_camp` (the vents), `meridian_camp2` (the iron corridors) and `meridian_camp3` (the
camp); the first keeps the plan's id and its atlas row, as `tide_ship` did.

---

## 1. Where it is

The atlas (`src/content/areas/ashfall/atlas.ts`) has Meridian Camp as a dungeon at 226,340, band
25–28, its way in at the vents' mouth, 226,334, in G11 on Fire Mountain's flank (ashfall §4.5). The
row's band is the union of the three levels' and agrees with them (§4). Laying the vents moves
nothing: the row keeps its id, its place and its band and loses `planned` and `name`; the site at
the mouth loses `planned` (§8, the vents' 12).

- **In:** the vents' mouth on G11, and the scavenger's hole beside Grimsforge, which comes in behind
  the furnace room (ashfall §4.5, #56's 52). Both are open since the vents were built (§4.1).
- **Out:** the way in, and Fane's rope up a cold flue from the camp to G11's lookout on the cone's
  shoulder, a way out and never in, as Kelp Hole's flooded passage is (an addition, §8, 3).
- **Down:** a stair at each level's far end; the vents' is built and barred until the corridors are
  (§4.1). A door below the camp opens on the service ways and for nobody, as the Deep Mines' CREW
  ONLY is a wall (docs/areas/kilns.md §9, 4).

## 2. What it is for

The Lost Expedition's end and Act IV's turn (DESIGN §9, §10.3): the place where the company
learns the sky is a ceiling by looking, and is never told it. The road goes no further than the
second level: the chapter walks the vents and the corridors for two of the Stone's parts and never
needs the camp, the window or the map (#443, call 2; ashfall §5). The camp is for the company that
read the notes, and three third prestiges come here: the Barbarian's after the drake that nests in
the corridors, the Ranger's for Fane's map and, by the Guild's line, the Cartographers' ending (#448,
DESIGN §8).

## 3. What is built

One level of three, the vents (`meridian_camp`, 32×32, band 25; #22, §4.1): in at G11's middle
mouth, open now, or up from the scavenger's hole, onto a flue hall of iron under the three mouths,
black with soot, with a drift under the west mouth and under the east the floor worn bright in a
path. West, the Company's trail: a Guild chain pin at the flue's head and chalked arrows down the
west flue past their first camp, cold, to a stair that goes down and is barred. Down the middle the
grates, with the stokers on their round; below them the lower gallery, with boot prints under the
machines' tracks; and the stokers' furnace room, where two stokers with their ember salamanders
shovel nothing into nothing and the Ember Stone's first part lies in the furnace's mouth beside a
heap of their parts. The scavenger's hole comes in behind the room. Four groups, one a sentry that
walks up the stair once the Stone is lit.

The iron corridors (§4.2) and the camp (§4.3) are to build, the corridors in Ashfall's flight and
the camp once the Wold's curve row is in (§8, 11). The vents place none of the five new monsters,
drawn ahead of the levels on the frames of the drakes, the heavy machines and the knockers (§6, §8;
MONSTERS §8.4).

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
  (2–7 by 26–29) and the stair (4,30), a square of wall, whose event at 4,29 stops a company on the
  first step with the heat coming up it. **The middle** is the grates (12–20 by 8–12) round four
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
    inside as from outside; the rope goes back down. The stair, 4,30, is `STAIR`, exported and
    barred: the corridors list it in this map's exits, open 4,30, drop or rewrite `mc1_stair`, give
    the landing asked for (4,1 facing south) and land the way back up on 4,29 facing north (§8, the
    vents' 9).
  - **Measured.** A company at 25 wins every fight and manages 10.98 fights to a rest, inside the
    aim of 9.25 to 11.25 and the limit of 7.75 to 13.75, with 87.7% of its days ending in a fight
    broken off: the furnace's fight runs past 15 rounds once spell points run low, as G11's
    stokers' did (94.7%), which the gate shows and never judges. Its under-check is n/a, its floor
    being over the area's; Ashfall's pool at 22 is won in all of its 16 groups, owed to #18 as
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

### 4.3 The camp (`meridian_camp3`): band 27 rising to 28

- **Purpose.** The Lost Expedition's end (DESIGN §10.3): Oriel Fane, his map and the window.
- **Landmarks.** The tents and Fane's fire, the third camp and the only warm one; the room beside
  it with the window, which has no sign and no name; a second grave; the deep knockers' gallery
  below the camp at 28, ending at the door to the service ways; the foot of Fane's rope.
- **Encounters.** Fewer groups and more features than the levels above, about eight: deep knockers
  and an inspector that calls them, in the gallery below the camp; none at the fire. The knockers
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

### 4.4 Rests

The Company's three camps are the dungeon's rests, one a level: the first two cold and empty, the
last Fane's.

## 5. The quests here

- **The one quest** (Ashfall's chapter, The Window): its Fire Mountain step and its corridors' step
  are the upper two levels (ashfall §5). The window is an entry, never a goal. The vents' part is
  `ember_part1`, found in the furnace's mouth, which sets no flag; Old Cinder's and the corridors'
  are to be `ember_part2` and `ember_part3` (§8, the vents' 4).
- **The Lost Expedition** (DESIGN §10.3) ends at Fane's fire. The trail inside is the Company's
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
back in the Underdeep. Asks: sweep with fire (#545), calls (#537), elements.

New here, for the novelty check (EXPANSION §5.4): a camp of the dead expedition with a living man
in it; a way out that is not a way in; a window. The vents claim none of it (§8, the vents' 14).

## 7. The numbers

- **Experience.** The vents and the corridors are Ashfall's balance of about 4,900 (ashfall §8),
  split about 2,200 and 2,700. The camp, about 3,000, pays outside any area's budget, as Wrackholm
  counts the Dead-Drop and Ashfall its country behind; pay by level (#159) keeps a company that
  goes down early from overshooting. As built, the vents pay 2,146 a member, 0.98 of their 2,200
  (§4.1; §8, the vents' 3); with Ashfall's other maps a clear is 9,203 of the area's 19,467 (ashfall
  §8).
- **The gate.** Each level is held at its own floor (EXPANSION §5.2). The Brood Drake is won about
  half the time at 26, the corridors' floor, and nearly always at 28. As built, a company at the
  vents' floor, 25, wins every fight and manages 10.98 fights to a rest (§4.1).
- **Gold and finds.** Machines carry parts; the Company's kit is the finds, a named piece on each
  of the lower two levels, in the band's window. As built, the vents hold 900 gold and a Sapphire
  Vial, in the drift, but no gear (§8, the vents' 8); their parts are the Stone's first, a quest
  item, and the stokers' firebar and shovel blade, which no shop buys (§8, the vents' 4 and 5).

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
11. **Build order:** the upper two levels in Ashfall's flight, right after G11 (#513), since the
    chapter needs the parts; the camp once the Wold's curve row is in.

Decided by delegate for #22 (the camp's monsters), each the owner's to overturn:

1. **The inspector is a knocker,** on the knockers' frame, as MONSTERS §8.4 and §11 and the frame's
   own notes have it (the brief put it on the heavy machines'): the deep knockers' caller.
2. **The looks:** the drakeling *The mountain's youngest. Its crust has not set.*; the Brood Drake
   *It will not leave the eggs.*; the flue walker *It walks the corridor to its end, and back.*; the
   inspector *It holds its light to the wall, and then to you.*; the deep knocker §9.2's.
3. **Fire does not touch the drakeling or the Brood Drake,** as it does not their kin, though the
   roster says only that they fly; both reach the back row (`ranged`), as the Cinder Drake does.
4. **The drakeling does not breathe:** fodder on the line at 26 and six to a group, with no sweep.
5. **The Brood Drake is set off the line as the Old Drake is:** the boss line at 27 come down whole
   to a sweeper's share, 1,250 and 21d7+34, its breath fire on a row a turn in four, for the
   corridors' gate (§7) to set.
6. **The flue walker is the elite's line at 27,** its hooks holding at the elite's 0.15 as the
   Sentry's clamp does; the deep knocker the armoured line at 28 with no parts yet; the inspector a
   caller on a soldier's numbers at 28, calling three deep knockers at a half a turn, as the
   tallyman calls knockers at 20.
7. **The Brood Drake is drawn settled on its clutch,** three eggs between its feet and its wings
   mantled round them, though it flies: the nest is where it is met. Size 1.8, inside the tall
   boss's crown; the drakeling 0.6, the flue walker 1.5, the deep knocker 0.75, the inspector 0.8.
8. **Each is owed to the level that first places it** (`UNPLACED`): the drakeling, the Brood Drake
   and the flue walker to `meridian_camp2`; the deep knocker and the inspector to `meridian_camp3`.

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
   SOUTH }`, its square wall, with `mc1_stair` at its head (4,29), not once. The corridors list it
   in this map's exits, open 4,30, drop or rewrite `mc1_stair`, give the landing and land the way
   back up on 4,29 facing north.
10. **No secret on this level:** no check asks one of a dungeon level, and the doc's hint is the
    Company's trail (§4.1). The hole is plain from below; its secret door is G11's.
11. **The map is named Meridian Camp,** since a built place's plate shows its map's name (§9 had the
    Vents): band 25 only, region Ashfall, `bare` (iron flues, nothing hung), a soot palette and
    `smooth` walls.
12. **The atlas:** the place row keeps its id, 226,340 and band 25–28 (the union of the three
    levels; the plate shows the built map's own band first) and loses `planned` and `name`; the
    site at the vents' mouth (226,334) loses `planned`. The corridors' plate is to go six squares
    south, 226,346, as Highcell's second did.
13. **G11 is opened as its handoff asked:** `VENTS` and `HOLE` are in its `exits` with labels, and
    26,16 and 31,17 are re-lettered ash; the side mouths stay vents. `g11_vents` stays as it was,
    the step's line said at the front each time, so on every return up the rungs.
14. **Novelty claims nothing:** Ashfall's claim stands. The way out that is not a way in and the
    camp of the dead expedition are level 3's.
15. **The density is met with features, not groups:** 15 events, a cairn, two chests, the camp, four
    groups and two exits make 25 points; every event is two lines.

## 9. Names

- **Meridian Camp** stands, the Guild's name for the Company's last camp (ashfall §10).
- **The levels** take plain names, as the Tide Ship's decks do: the Vents, the Iron Corridors and
  Meridian Camp. The vents' map is named Meridian Camp, since a built place's plate shows its map's
  name (§8, the vents' 11).
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
- **The stair stands barred** until the corridors are built, which list `STAIR` in the vents' exits,
  open 4,30 and land the way back up on 4,29 facing north (§8, the vents' 9).
- **The second and third parts** are to be `ember_part2` (Old Cinder, #515) and `ember_part3` (the
  corridors); the hand-in (#516) takes the three (§8, the vents' 4).
