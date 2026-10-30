# Cairnmoor: step VII of the road, the moor with the ring

Cairnmoor's doc is three files (EXPANSION §8.2, #1011), and this, its current state, is read first.
Its decisions, the old §9 whole, are `docs/areas/cairnmoor/decisions.md`, appended to and never
rewritten. Its plan is `docs/areas/cairnmoor/plan.md`: the old §4 (the boxes' briefs, §4.1 to
§4.8), §11 (what was cut) and §12 (the bounds, §12.1 to §12.6) whole, then under "Moved from the
state" the lines of the old header, §1, §3 and §5 to §8 that this file does not keep, each under
the heading it had, among them §1's squares, §3's atlas rows and drawings, §6's table, the
artifact's brief and §8's figures box by box. §2 and §10 stand here whole. The figures are main's
at `8462ffeb` (24 October 2026), as the suites print them.

Its ids: the area `cairnmoor`, its zones `highmoor` and `cairnfield`, the dungeon `cairns` and
`cairns2` (Carn Dubh, the ids kept under its new name, §10), the enclave `carn_fada` and the lair
`bearn_liath`. It has no town and no business, so no rooms.

## 1. Where it is

The second step of Act III, The Deep Script, on the road of levels (DESIGN §4, §9): two
zones of the atlas (`src/content/areas/cairnmoor/atlas.ts`) on the grid of boxes 32 squares a side
(EXPANSION §8.2). High Moor, band 18–19, is N7, O7, O8, P7 and P8; the Cairnfield, band 19–20, is
N8, M7, M8 and L8. P7, P8 and L8 are the bounds' (#834). The dungeons stand off the grid, each
entered from a map: Carn Dubh from N8, Carn Fada from L8 and Bearn Liath from P7.

- **North: the Kilns,** over low hills. The drove road comes up from the Kilns' N6 onto N7, open
  from the start; the crossing line falls where N6 meets N7.
- **East: the rim,** the P column, mountain over the hills of P7 and P8.
- **South: the Rimefells,** the ridge between the moor and Rimewater, O9 and N9, cut (plan, §11).
  The drove road goes down through its notch from N8 to Rimewater's M9 and Rime Lodge on the shore
  of Loch Fada; L8's south meets Loch Fada's L9 square for square.
- **West: Kilnmouth's mountains,** L7, the Kilns' box, behind M7's and M8's grass; west of M8 the
  shore, L8, with the sea past it.

The drove road is the only road: up from the Kilns over N7, south down N8 and over the Rimefells.
The ring lies a box east of it, on O7. Two edges open on nothing (`openOnNothing`,
`src/content/areas/cairnmoor/checks.ts`): O8's south, onto O9, Glacier Foot, the reach, shut until
Phase 1.6; and L8's west, onto the sea. `node tools/worldmap.ts out.png --zones` paints the zones.

## 2. What it is for

The middle of Act III (DESIGN §9): *what are the Stones?* The Kilns have shown the machine and read
the dwarves' holy words as signs on doors; Cairnmoor shows what came before the Stones. The ring on
the moor is older than any Wardstone, the first emitters, dead for centuries, and the company sleeps
inside it one night because there is nowhere else out of the wind, and in the dark something very
old and very faint says *Crew. Report.* (STORY, Act Three). Nobody sleeps after. The bog lights are
the last of the ring's field, the Rift at its thinnest, with no body left and no tear (MONSTERS
§2.1; #434, call 3): the last Rift on the road, and #158's check holds that none comes after. The
cairns hold the oldest dead, and the tors are trolls by night. The road then drops to the long lake,
where the lodge-keepers say people are coming up through the ice (docs/areas/rimewater.md).

It is also where the second prestige falls (DESIGN §5): a character reaches 19 on the moor, and the
Sorcerer's and the Bard's second trainers are here, at the Watcher's Hut and the piper's fire by
the tarn (#434, call 9). The Kilns place the Barbarian's, and the other five stand behind the act
(#439), the last the Druid's in the Deepthorn.

The weather is the moor's: wind, sleet, snow lying from autumn and fog on the bog. The company
crosses it in snow (STORY; MONSTERS §7.2).

## 3. What is built

Thirteen maps (`src/content/areas/cairnmoor/maps/`), a row each: its id and name, kind, size and
band; what is there, with its groups (the gate's count); and its secret, a door at the squares
given, with the hint on its near side that finds it (the map's `secrets`). Every map has one.

| Map | Kind, size, band | What is there | Secret, and its hint |
|---|---|---|---|
| `highmoor_n7`, N7 | outdoor, 32×32, 18 | the drove road up from the Kilns' N6 over the low hills, past the milestone and the drovers' shelter, then south over the heather for N8; the peat-cutter's track east for O7 and the ring; the coach by day, a drover, the hill folk's cup-stone, the first cairn and the marsh; four groups, the hounds by night | 9,23, the drovers' cache under the cairn: its top white with droppings at 9,24 (`n7_droppings`) |
| `cairnfield_n8`, N8 | outdoor, 32×32, 18–20 | the drove road south to its head above the Rimefells, the long lake seen and the notch down to Rimewater's M9 at 0,28; the field of cairns, Carn Dubh's door at 6,18 and the Watcher's grave; the coach stopped on the road; the hermit; the beacon cairn over the Beacon Hammer (#862); five groups, the hounds by night | 7,9, the strongbox under the coach's seat: its door hanging open at 6,9 (`n8_coach_door`) |
| `highmoor_o7`, O7 | outdoor, 32×32, 18–19 | Fionnlios, the Stone Ring, twelve stones standing and a thirteenth fallen, a camp inside it and the voice by night (`o7_voice`); the Watcher's Hut and the Watcher; the tarn and the piper's fire; a tor with a face by day; four groups, the lights and the troll by night | 9,24, the hollow under the fallen stone: the ground bare of snow and frost at 8,24 (`o7_bare`) |
| `highmoor_o8`, O8 | outdoor, 32×32, 18–19 | the peat bog below the ring: the peat-cutter's hut and the body with a rope round its neck; the cutting the lights rise from; three tors with faces, the last half cut; the stonecutter at his fire; six groups, every one by night | 18,12, the hoard behind the cutting's face: the cutting left half dug at 17,12 (`o8_cutting`) |
| `cairnfield_m7`, M7 | outdoor, 32×32, 18–19 | the drovers' summer grazing under the Kilns' hills: three shielings and a shepherd, a drovers' cairn, a ewe dead among ravens and the sheepfold built out of an old cairn; two groups, the hounds by night | 14,25, the cist behind the fold's back wall: a cup and rings cut low in one stone at 15,25 (`m7_cupmark`) |
| `cairnfield_m8`, M8 | outdoor, 32×32, 18–19 | south of M7: a stream on stepping stones to the sea, a boat on the sand, the lone tor and its troll by night, the tarn under the Rimefells and an old fisher; two groups | 6,27, the howff under a great boulder: the heather worn to the earth at 7,27 (`m8_smoke`) |
| `highmoor_p7`, P7 | outdoor, 24×32, 18–19 | the bounds' first, the hills under the rim: the herds' bothy and an old herd, the ravens' crag, the narrows past a stone with a riddle, the long cairns; the cleft into Bearn Liath at 5,24; two groups | 6,8, the hill folk's earth-house: the wind hooting at the face at 6,7 (`p7_hoot`) |
| `highmoor_p8`, P8 | outdoor, 24×32, 18–19 | O8's east hills narrowing under the rim to a ledge over the bog, a cairn and bones in the snow at its end; one group | 4,7, the herds' winter store: a rowan grown out of the bare rock at 3,7 (`p8_rowan`) |
| `cairnfield_l8`, L8 | outdoor, 32×32, 18–19 | the bounds' second, the shore west of M8: the salmon-netters' hut, the wrack-gatherer, a well and a cairn; the drowned cairn's mound, its gap into Carn Fada at 22,27; two groups | 28,26, the netters' noost: hot tar smelt out of the bank at 28,25 (`l8_tar`) |
| `cairns`, Carn Dubh | dungeon, 16×16, 18–20 | in at N8's biggest cairn: the passage with the count of the dead, the two cells of rows, the Watcher's cell with his page in the chest under his hands (`cd1_page`), the end cell and its stair down; five groups | 13,10, the cell with the area's first locked chest, Cairnbuilder's Mail in it (#862): a stain of rust at 13,9 (`cd1_rust`) |
| `cairns2`, Under Carn Dubh | dungeon, 16×16, 19–20 | the hall of the dead in rows, two courts of wights and the Cairn King on his seat, a boss that curses; a door behind the seat that nothing opens; three groups | 6,10, the cell off the stair with the Hill Torc: the dead in rows at 7,10 (`cd2_rows`) |
| `carn_fada`, Carn Fada | dungeon, 16×16, 20–21 | the enclave, the drowned cairn under L8's mound, entered at L8's 22,27: the passage at the tide's head, the chamber and the end cell, where the oldest dead's cist holds the Sunwise Mace; three groups, two of Rimewater's ice bears among them | 7,8, the cell never opened: the spiral that turns against the rest at 7,9 (`cf_spirals`) |
| `bearn_liath`, Bearn Liath | dungeon, 16×16, 30–32 | the lair, the cleft in the rim behind P7, entered at P7's 5,24: the gap where the Rim Troll stands and the hollow past it, where an old man sits with his kist and Torhide; one group, the troll | 13,4, the troll's store: great tracks ending at the rock at 13,5 (`bl_tracks`) |

Its content is `src/content/areas/cairnmoor/`: the maps, then a file each for its monsters, items,
chapter, side quests and guild quest, its part of the world (the atlas), its rows of the suites (the
checks), what other areas take of it (public) and its walkthrough.

## 5. The one quest here

**The Ring** (`ring`, `src/content/areas/cairnmoor/chapter.ts`), after the Kilns' The Anvil Stone:
begun on N7; the voice inside Fionnlios by night (`o7_voice`), which sets `q_ring_spoke`; the drove
road's head above Loch Fada (`n8_head`); done with the voice heard and Rimewater's M9 reached by the
notch, where Rimewater's chapter takes it on. High Moor and the Cairnfield each hold a step. Nothing
in it is a lock: the ring is open ground, and the voice speaks to whoever sleeps there.

## 6. Side quests

Three in `src/content/areas/cairnmoor/quests.ts`, a line each, each answered by a choice its person
puts (the plan's §6 has #56's table and the words as built):

- **The Watcher's Tally** (`tally`): the Watcher at his hut on O7; his predecessor's page out of
  Carn Dubh (`watchers_page`), cut into his lintel or sent to the Lanterns; 1,200 xp.
- **The Ring on the Bog Body** (`bogring`): the peat-cutter on O8; the ring sold, carried for the
  elves or put back on the body's hand, when the body lies down; 1,200 xp.
- **The Faces on the Tors** (`faces`): the stonecutter on O8; home to Rime Lodge, or the last face
  finished, when its tor's troll never stands again; 1,800 xp.

The coach's quest on N8 (#56's 40) is Rimewater's (#494). The guilds'
(`src/content/areas/cairnmoor/guilds.ts`): the Lanterns' fourth rank, **What the Ring Said**
(`lanterns_ring`), offered at every Lantern hall once Act II is done and paid at any once
`q_ring_spoke` holds; 300 gold and 2,400 xp.

**Torhide** (#846), the bounds' artifact: in the old man's kist in Bearn Liath, behind the Rim Troll
(boss, 32: 2,700 hit points, attack 22), found and never told. The rumour is the drover's on N7, at
every meeting after his first. A shield for the knight, the paladin and the ranger, armour 9; its
bearer mends a tenth of their most hit points each whole hour, never in a fight.

## 7. Encounters, and what is new

The roster is MONSTERS §7.2's, in its monsters file: the Raven, the Bog Light, the Bog Body, the
Moor Hound, the Cairn Wight, the Tor Troll and the Cairn King (boss, 20); and the Rim Troll, the
lair's guardian, of the ogres (MONSTERS §13). The lights and most of the hounds and trolls walk
only by night (`when`); the trolls mend each round unless burned; the wights and the King curse.
It claims the lights, a new family, snow and ice underfoot, curse and the ring (`novel`).

## 8. The numbers

- **The curve** (`tools/tests/curve.ts`): a clear gives 17,609 xp a member of the 14,667 it asks
  and 10,285 gold of 8,880; a company entering at the floor and clearing three quarters leaves at
  20.3, the next floor 20. Carn Fada and Bearn Liath are counted in no clear: 5,166 xp a member and
  1,360 gold.
- **The gate** (`tools/tests/gate.ts`): at its maps' floors the area wins 98.8% of its 36 groups'
  fights (`GATE.through`'s aim); two under, pooled at 16, 6.82 fights to a rest, 80.2% of the
  floor's 8.5. The Cairn King is won 57% at 19 and 94% at 21, the Rim Troll 59% at 30 and 89% at 32.
  Under Carn Dubh a company at 19 wins 85.7% of its fights. High Moor's road and the Cairnfield's
  are walked every time.
- **Fights to a rest** (aim 7.5 to 9.5, limit 6 to 12): N7 8.46, N8 8.66, O7 8.88, O8 11.13, M7
  10.51, M8 7.60, P7 8.94, P8 7.97, L8 8.54 and Carn Dubh 10.70; Under Carn Dubh 9.20 at 19 and Carn
  Fada 9.08 at 20, each inside its own aim. Fifteen figures are off their aim, inside their limits.
- **Density** (`tools/tests/density.ts`): within 8 squares in the core, N7 99.2%, N8 99.6% and O7
  99.4%; within 12 in the country, O8, M7, P7, P8 and L8 100.0% and M8 99.7%; the four dungeon
  levels 100.0% within 7.
- **The ladder:** rung 19 is the Kilns' and Cairnmoor's finds (`gear`, in its checks), O7's Banded
  Staff +1 among them.

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
  | the Cairns | Carn Dubh | the dark cairn: the oldest and biggest, with the King under it; the field of cairns round it keeps the Crown's name | Carn Fada, the long cairn, the enclave's name since (#834) |
  | the drowned cairn, the enclave (#834) | Carn Fada | the long cairn: its passage runs long and on under the tide, at Loch Fada's foot; thought of for Carn Dubh and left unused | Carn Fuar, the cold cairn, which Loch Fuar and the Lann Fuar say already |
  | the oldest dead's mace (#834) | the Sunwise Mace | the moor's English, as its finds' names are: the spirals cut round its head turn the way the sun goes | the Spiral Mace |
  | the cleft in the rim, the lair (#834) | Bearn Liath | the grey gap, *bearn* a gap and *liath* grey: the cleft the Rim Troll stands in, grey as the rim and as the hide on the shield it keeps | Eag Liath, the grey notch |

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

## Open and owed

- **Owed to no check:** its checks have no `owes`, and the curve, the gate, density and the ladder
  hold Cairnmoor with nothing owed.
- **Watched, not moved:** O8's 11.13 fights to a rest and Carn Dubh's 10.70 sit off the aim, near
  the limit of 12, and the Rim Troll's 89% at 32 is under `GATE.bossAbove`'s aim (plan, §8). What
  the owner finds by hand goes here; none yet.
- **Owed by a box as built** (plan, §11): the Watcher's page lies in a chest, not on his wight; the
  door behind the Cairn King's seat opens on nothing.
- **Cut:** the Rimefells (O9 and N9) and the moor's slivers in the Kilns' boxes (plan, §11).
- **What is next:** nothing. The plan's briefs are all built, and a new box starts its brief there.
