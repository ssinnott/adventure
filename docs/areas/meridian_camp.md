# Meridian Camp: the Lost Expedition's end, down Fire Mountain's vents

Meridian Camp's doc is three files (EXPANSION §8.2, #1027), and this, its current state, is read
first. Its decisions, the old §8 whole, are `docs/areas/meridian_camp/decisions.md`, appended to
and never rewritten. Its plan is `docs/areas/meridian_camp/plan.md`: the old §4 (the levels'
briefs, §4.1 to §4.4) and §10 (what was cut) whole. The old header, §1 to §3, §5 to §7 and §9
stand here whole, as they were written, and §3 ends in a row to each map, its figures main's at
`8462ffeb` (24 October 2026). It belongs to no area of its own: its maps are Ashfall's. Of §7's
figures one has moved since: a clear of Ashfall gives 35,919 xp a member, not 29,386 (the curve).

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

Its maps, a row each: its id and name, kind, size and band; its groups (its encounters); and its
secret (the map's `secrets`).

| Map | Kind, size, band | Groups | Secret, and its hint |
|---|---|---|---|
| `meridian_camp`, Meridian Camp (the vents) | dungeon, 32×32, 25 | four | none |
| `meridian_camp2`, the Iron Corridors | dungeon, 32×32, 26 | four | none |
| `meridian_camp3`, the Camp | dungeon, 32×32, 27–28 | six | none |

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
- **The Cartographers' line** ends here (DESIGN §8; #443, call 7): the Mapmaker's rung, *Fane's
  Fire*, is paid for the firelight on the one way to the fire (`mc3_fire`, §8, the camp's 7; ashfall
  §6, §9, #635's PR C).
- **Third prestiges** (#448): the Barbarian's, What Nests There, built: kill the Brood Drake on its
  eggs in the nest off the corridors' last run (`slain` `meridian_camp2:mc2_brood`, ashfall §6), for
  the warlord's heir at Grimsforge; the Ranger's, bring Fane's map back to the Wold's scout.

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
  fight and manages 10.64 fights to a rest; two under, at 25, it wins every fight (§4.3; §8, the
  camp's 2 and 18).
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

## 9. Names

- **Meridian Camp** stands, the Guild's name for the Company's last camp (ashfall §10).
- **The levels** take plain names, as the Tide Ship's decks do: the Vents, the Iron Corridors and
  Meridian Camp. The vents' map is named Meridian Camp, since a built place's plate shows its map's
  name (§8, the vents' 11); the corridors' is named The Iron Corridors (§8, the corridors' 15); the
  camp's is named The Camp (§8, the camp's 15).
- **The window's room has no name** in the game. The item is Fane's Map.
