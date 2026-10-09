# Meridian Camp: the Lost Expedition's end, down Fire Mountain's vents

One of the two large dungeons that stand in place of a world-wide Underdeep (#22; DESIGN §4): three
levels of 32×32 under Fire Mountain, band 25–28, reached from Ashfall's G11 in Act IV. The vents
are the Underdeep's exhaust, and two of the Ember Stone's three parts lie on the upper two levels;
at the bottom is the Meridian Company's last camp, with Oriel Fane, the expedition's map of the
hull and the room with a window (DESIGN §9, §10.3). This is its brief (EXPANSION §8.2), written
for #22 under Phase 1.4 (#441). It is Ashfall's dungeon, and docs/areas/ashfall.md §4.11 points
here. Every call below is a decision the owner may overturn; §8 lists them.

Nothing is built. Its maps will be `src/content/areas/ashfall/maps/`, beside the area's, and its
monsters Ashfall's. Its ids: `meridian_camp` (the vents), `meridian_camp2` (the iron corridors) and
`meridian_camp3` (the camp); the first keeps the plan's id and its atlas row, as `tide_ship` did.

---

## 1. Where it is

The atlas (`src/content/areas/ashfall/atlas.ts`) has Meridian Camp as a planned dungeon at 226,340,
band 25–28, its way in at the vents' mouth, 226,334, in G11 on Fire Mountain's flank (ashfall
§4.5). The row's band is the union of the three levels' and agrees with them (§4).

- **In:** the vents' mouth on G11, and the scavenger's hole beside Grimsforge, which comes in behind
  the furnace room (ashfall §4.5, #56's 52).
- **Out:** the way in, and Fane's rope up a cold flue from the camp to G11's lookout on the cone's
  shoulder, a way out and never in, as Kelp Hole's flooded passage is (an addition, §8, 3).
- **Down:** a stair at each level's far end. A door below the camp opens on the service ways and
  for nobody, as the Deep Mines' CREW ONLY is a wall (docs/areas/kilns.md §9, 4).

## 2. What it is for

The Lost Expedition's end and Act IV's turn (DESIGN §9, §10.3): the place where the company
learns the sky is a ceiling by looking, and is never told it. The road goes no further than the
second level: the chapter walks the vents and the corridors for two of the Stone's parts and never
needs the camp, the window or the map (#443, call 2; ashfall §5). The camp is for the company that
read the notes, and three third prestiges come here: the Barbarian's after the drake that nests in
the corridors, the Ranger's for Fane's map and, by the Guild's line, the Cartographers' ending (#448,
DESIGN §8).

## 3. What is built

No level yet. Its plate and its way in are on the atlas as planned, and its five new monsters are
drawn ahead of the levels, on the frames of the drakes, the heavy machines and the knockers (§6,
§8; MONSTERS §8.4). It waits on Ashfall's systems (#442): the curve's rows past 16, the gear step
at Cinderport and the volcano underfoot; and on G11 (#513), whose map it exits to (EXPANSION §8.2).

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
  are the upper two levels (ashfall §5). The window is an entry, never a goal.
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
in it; a way out that is not a way in; a window.

## 7. The numbers

- **Experience.** The vents and the corridors are Ashfall's balance of about 4,900 (ashfall §8),
  split about 2,200 and 2,700. The camp, about 3,000, pays outside any area's budget, as Wrackholm
  counts the Dead-Drop and Ashfall its country behind; pay by level (#159) keeps a company that
  goes down early from overshooting.
- **The gate.** Each level is held at its own floor (EXPANSION §5.2). The Brood Drake is won about
  half the time at 26, the corridors' floor, and nearly always at 28.
- **Gold and finds.** Machines carry parts; the Company's kit is the finds, a named piece on each
  of the lower two levels, in the band's window.

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

## 9. Names

- **Meridian Camp** stands, the Guild's name for the Company's last camp (ashfall §10).
- **The levels** take plain names, as the Tide Ship's decks do: the Vents, the Iron Corridors and
  Meridian Camp.
- **The window's room has no name** in the game. The item is Fane's Map.

## 10. What was cut

- **A numbered journal inside:** the Company's marks carry the trail, and the fourth journal stays
  where Ashfall put it.
- **A way on from the camp:** the service ways' door stays shut; the Underdeep is Act V's (DESIGN §4).
