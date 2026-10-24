# The Whitespine: step IX of the road, the range the bells ring over

The Whitespine's doc is three files (EXPANSION §8.2, #1011), and this, its current state, is read
first. Its decisions, the old §9 whole, are `docs/areas/whitespine/decisions.md`, appended to and
never rewritten. Its plan is `docs/areas/whitespine/plan.md`: the old §4 (the boxes' briefs, §4.1
to §4.9), §11 (what was cut) and §12 (the bounds, §12.1) whole, then under "Moved from the state"
the lines of the old header, §1, §3 and §5 to §8 that this file does not keep, each under the
heading it had, among them §1's squares, §3's atlas rows and drawings, §6's tables, the third
prestiges' words and §8's figures box by box. §2 and §10 stand here whole. The figures are main's
at `8462ffeb` (24 October 2026), as the suites print them.

Its ids: the area `whitespine`, its zones `monksvale`, `highspine` and `sheerpoint`, the dungeon
`monastery` and `monastery2` (Highcell, the ids kept under its new name, §10). It has no town and
no business, so no rooms.

## 1. Where it is

The first step of Act IV, Beyond the Sky, on the road of levels (DESIGN §9), band 22–24: three
zones of the atlas (`src/content/areas/whitespine/atlas.ts`) on the grid of boxes 32 squares a side
(EXPANSION §8.2). Monks' Vale, band 22–23, is J11, J10 and J12; the High Spine, band 23–24, is I11,
I10 and I12; Sheer Point, band 23–24, is I9, I8 and J8, the bounds' (#832). Highcell stands off the
grid, entered at the gate in J11's monastery wall.

- **North: the sea,** off Sheer Point's tip, with the Hearth beyond it so near its heat is felt.
  J8's pines run round the bay's head to Rimewater's J9.
- **East: Coldmere,** Rimewater's frozen lake. The high pass comes over from K10, across J10's
  corner and onto J11's north edge, the one way in from the road behind, open from the start. K11
  and K12 are Loch Fuar's, laid in Rimewater's boxes.
- **West: the Sheer,** the cliff that walls Ashfall off; the Giants' Stair goes down it from its
  head in I10 to Ashfall's H10.
- **South: the range,** on through I12 and J12 to the rim, where the world ends.

The ridge trail runs from the Peak Stone north along the crest through I10 and I9 to Sheer Point,
open from the start. Its checks list no edge open on nothing (`openOnNothing`).
`node tools/worldmap.ts out.png --zones` paints the zones.

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

Eleven maps (`src/content/areas/whitespine/maps/`), a row each: its id and name, kind, size and
band; what is there, with its groups (the gate's count); and its secret, a door at the squares
given, with the hint on its near side that finds it (the map's `secrets`). Nine maps have one, J12
two and Highcell's upper house none.

| Map | Kind, size, band | What is there | Secret, and its hint |
|---|---|---|---|
| `monksvale_j11`, J11 | outdoor, 32×32, 22–23 | the pass's road down from K10 to the gate in Highcell's wall at 26,24; the bells first heard; the monks' shrine and the pilgrims' hostel; Spine Summit, a camp, with Oswin (the Monk's third); the herder at his fold; six groups, the sixth the vigil's brothers by night once Oswin is answered | 16,29, the store in the rock: the snow trodden in one line west at 29,29 (`j11_trodden`) |
| `monastery`, Highcell | dungeon, 16×16, 22–24 | the upper house: the cloister and its dry well, the board of the hours, the refectory, the cells with the Novice in the last; the bell tower, its ringers and Brother Lark (the Bard's third); the night stair down at 13,13; two groups | none |
| `monastery2`, Highcell's lower house | dungeon, 16×16, 23–24 | the chapter house, a vault on four columns: brothers before two bell-ringers and the Abbot on his seat, a boss; two groups | 7,11, the undercroft, the monks in their niches: the Abbot's seat a hand off its worn hollows at 7,10 (`hc2_seat`) |
| `highspine_i11`, I11 | outdoor, 32×32, 22–23 | over the crest from the Vale: the Peak Stone whole in its ring of bare stone, a brother at it, the monks' shrine and the ridge trail's cairn; the eagles' nest with a Lantern's badge; the Sheer's lookout over Ashfall; four groups | 26,4, the hollow under the slab with the Lanterns' survey marker: every stone of the ring frosted but one at 26,3 (`i11_frost`) |
| `highspine_i10`, I10 | outdoor, 32×32, 22–24 | the ridge trail north and the road west to the Giants' Stair's head: a caravan, the toll-stone and the Stair-king on his seat with his giants and his hoard; Stairwatch's ledge and Edric (the Knight's third); five groups, the toll-takers twice by night once Edric is answered | 6,24, the chimney up to Stairwatch: a rock worn smooth by a rope at 6,23 (`i10_rope`) |
| `sheerpoint_i9`, I9 | outdoor, 32×32, 22–23 | the ridge trail north along the crest to where the Hearth stands over the water; the giants' cairn; the trolls' gully; the masons' first camp and their sledge; a hermit by the shore; three groups | 16,10, the masons' cache: a tally cut in the face, running into a crack, at 17,10 (`i9_tally`) |
| `sheerpoint_i8`, I8 | outdoor, 32×32, 22–24 | the trail's end over the Point's tip: the Hand's causeway of glowing stone out over the sea, its masons and their foreman; Wenna's camp on the shingle; Rook's Nest and Hereward (the Thief's third); the deserter with his tally; four groups, the troll by night | 22,6, the Hand's sea cave: the rock wet and smelling of the sea at 22,7 (`i8_damp`) |
| `monksvale_j10`, J10 | outdoor, 32×32, 22–23 | the road over the saddle from K10; the giants' clearing, its ring of stone seats and a fire with nobody at it; a goatherd; a fallen seat whose pool gives might; one group, two stair giants | 12,16, the giants' cauldron of the toll: old coins in the snow at 13,16 (`j10_coins`) |
| `highspine_i12`, I12 | outdoor, 32×32, 22–23 | the pines along the Sheer's edge to the rim: a charcoal-burner, a warm spring that gives endurance; one group, two snow trolls | 17,20, the cleft with the frozen packs: old tracks stopping at the rock at 17,19 (`i12_tracks`) |
| `monksvale_j12`, J12 | outdoor, 32×32, 22–23 | the vale's end under the peaks: a stone seat that gives intellect, the trolls' bowl, a pilgrim frozen where he sat; one group, two snow trolls | two: 18,11, the bell's cell: a bell-rope out of a crack at 19,11 (`j12_rope`); and 19,22, the hollow with two chests, the second locked, the lightning axe and the knife (#863): a pine split by lightning at 19,21 (`j12_split`) |
| `sheerpoint_j8`, J8 | outdoor, 32×32, 22–23 | the bounds', the pines over the water round the bay's head: an eel-fisher at his fire, a cairn, the shallows along the strand; two groups | 2,18, the smoke-house in the hill: eel-traps stacked at its foot at 2,19 (`j8_traps`) |

Its content is `src/content/areas/whitespine/`: the maps, then a file each for its monsters, items,
chapter and quests, its part of the world (the atlas), its rows of the suites (the checks), what
other areas take of it (public) and its walkthrough.

## 5. The one quest here

**The Bells** (`bells`, `src/content/areas/whitespine/chapter.ts`), after Rimewater's The Sleepers:
begun where it ends or in Monks' Vale; the bells on J11's road (`j11_bells`); Highcell's cells, its
board and its Abbot; the Peak Stone (`i11_stone`); the causeway's first stone (`i8_causeway`); the
night Wenna is taken from her fire (`q_wenna_taken`) and her knot (`i8_knot`); the Stair's head and
its toll, paid or refused. It is done on `q_stair_top`, which `i10_top` sets once the toll is
answered or the king is down, and Ashfall's chapter reads it. Monks' Vale, the High Spine and Sheer
Point each hold a step. Nothing in it is a lock.

## 6. Side quests

Four in `src/content/areas/whitespine/quests.ts`, a line each, each paying its xp whichever way it
goes (the plan's §6 has #56's table and the words as built):

- **The Novice** (`novice`): the boy in Highcell's last cell; his letter to his mother at Anvilhall,
  the Kilns'; 1,200 xp.
- **The Eagles' Nest** (`nest`): the herder at his fold on J11 and the nest on I11; the Lantern's
  badge to the Reader at Lantern Watch or to a brother in Highcell; 1,200 xp.
- **The Toll** (`toll`): the caravan-master at the Stair's head; the king's toll paid in gold, a
  grey part or a faceless coin, or the king fought; 1,500 xp.
- **The Mason's Tally** (`mason`): the deserter in the rocks on I8; his passage to Cinderport
  bought, or the tally's page swapped; 1,500 xp.

Four third prestiges are taught here, each its trainer's `asks`, put to a member of 27 with the
second taken and paying nothing but the prestige: **The Ledge** (`ledge`), Edric on Stairwatch, the
Knight's; **The Vigil** (`vigil`), Oswin on Spine Summit, the Monk's; **The Eleven** (`eleven`),
Brother Lark in Highcell's tower, the Bard's; and **Whose Hand** (`whose_hand`), Hereward in Rook's
Nest, the Thief's, out to the Dead-Drop.

The Whitespine holds none of the bounds' eight artifacts: the Wakerobe, Rimewater's, has its lair
in K12, a box of Loch Fuar's (docs/areas/rimewater.md §6).

## 7. Encounters, and what is new

The roster is MONSTERS §8.1's, in its monsters file: the Spine Eagle, the Brother, the Bell-ringer,
the Snow Troll, the Stair Giant, the Ashen Mason, the Abbot (boss, 24) and the Stair-king (boss,
24). The giants are a new family and sweep a row, and the king puts his toll before the fight; the
brothers are machines in robes. It claims the giants, peaks and cliffs underfoot and the monastery
(`novel`).

## 8. The numbers

- **The curve** (`tools/tests/curve.ts`): a clear gives 23,292 xp a member of the 17,867 it asks
  and 11,450 gold of 10,800; a company entering at the floor and clearing three quarters leaves at
  24.4, the next floor 24.
- **The gate** (`tools/tests/gate.ts`): at its maps' floors the area wins 97.5% of its 31 groups'
  fights (aim 90%); two under, pooled at 20, 6.24 fights to a rest, 65.7% of the floor's 9.5. The
  Abbot is won 66% at 23 and 93% at 25, the Stair-king 58% at 22 and 79% at 24; at I10's floor a
  company wins 91.6% of its fights, the king counted. The roads of Monks' Vale, the High Spine and
  Sheer Point are walked every time.
- **Fights to a rest** (aim 8.5 to 10.5, limit 7 to 13): J11 8.69, Highcell's upper house 11.38,
  I11 10.12, I10 10.59, I9 9.43, I8 8.99, J10 9.72, I12 and J12 8.22 and J8 9.76; the lower house
  10.59 at 23, where a company wins 83% of its fights. Ten figures are off their aim, inside their
  limits.
- **Density** (`tools/tests/density.ts`): within 8 squares in the core, J11 99.1%, I11 99.5%, I10
  99.7% and I8 100.0%; within 12 in the country, I9, J10, I12, J12 and J8 100.0%; Highcell's two
  levels 100.0% within 7.
- **The ladder:** no rung is the Whitespine's; the ladder at 22 is Rimewater's finds.

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

- **The finds (#863):** the Thunderhead Axe and the Talon Knife, in the Crown's plain English as the
  range keeps it (the Ice Axe, the Bear Spear, the Guide's Staff): a thunderhead is the anvil top of
  a storm cloud, and an axe has a head; a talon is an eagle's, which is the range's raptor. Also
  thought of: Thunderstone, which is a Stone's name and would be read as one; Eyrie Knife, which
  says where an eagle keeps a thing. Their ids are `thunderhead_axe` and `talon_knife`.
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

## Open and owed

- **Owed to no check:** its checks have no `owes`, and the curve, the gate, density and the ladder
  hold the Whitespine with nothing owed.
- **Watched, not moved:** Highcell's upper house at 11.38 fights to a rest is over its aim, and the
  Stair-king's 79% at 24 is under it, each inside its limit (plan, §8). What the owner finds by
  hand goes here; none yet.
- **Owed by a box as built** (plan, §11): the Abbot's robe opening as he is hurt waits on a systems
  change; the shard from I8's sea cave, the Ember Stone's quest item, is not placed.
- **Cut:** K11 and K12 are Loch Fuar's, and the slivers go with Rimewater's and Ashfall's boxes
  (plan, §11).
- **What is next:** nothing. The plan's briefs are all built, and a new box starts its brief there.
