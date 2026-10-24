# Saltreach: step III of the road, the Long Water's country

Saltreach's doc is three files (EXPANSION §8.2, #1027), and this, its current state, is read first.
Its decisions, the old §9 whole, are `docs/areas/saltreach/decisions.md`, appended to and never
rewritten. Its plan is `docs/areas/saltreach/plan.md`: the old §4 (the boxes' briefs, §4.1 to
§4.11), §11 (what was cut) and §12 (the bounds, §12.1 to §12.11, the enclave and the lair in
§12.10) whole, then under "Moved from the state" the lines of the old header, §1, §3 and §5 to §8
that this file does not keep, each under the heading it had, among them §1's zone table, edges and
the river's course, §3's atlas rows and boxes as built, §5's entries and its As built, §6's table of
#56's four, each quest as built, the halls' ranks and the Telstok's brief, §7's roster and novelty
and §8's shares box by box. §2 and §10 stand here whole. The figures are main's at `2ef2d315` (24
October 2026), as the suites print them.

Its ids: the area `saltreach`; its zones `upperwater`, `delta` and `saltings`, each box named for
its zone and square (`delta_c5`); the town `saltmouth`; the temples `drowned_temples` (with
`drowned_temples2`); the Rifts `c5_rift`, `b5_rift_n` and `b5_rift_s`. They stayed through the
naming pass (§10, NAMES §3).

## 1. Where it is

The third step on the road of levels (DESIGN §9), band 10–12, the first of Act II: three zones of
the atlas (`src/content/areas/saltreach/atlas.ts`). The Upper Water, band 10–11, is C3, B3, C2, B2
and A3, the Long Water out of the rim past Rietum. The Delta, band 10–12, is D5, C5, C4, B5, B6,
B4, A4, A5 and A6, the fen with the Tide Stone's plinth and the Drowned Temples. The Saltings, band
11–12, are C6, C7, B7 and D6, Saltmouth's box, the pans and the Scarp's foot. Eighteen boxes of the
grid (EXPANSION §8.2; docs/areas/shelf.md §1), in the A to D columns from row 2 to row 7; C2, B2,
A3, A4, A5, A6, B7 and D6 are the bounds' (#830). The town, the temples and the Rifts stand off the
grid, each entered from a map.

- **North: the rim,** with the upper valley under it, C2 and B2.
- **East: Kestrel Edge,** the Foreland's cliff. The Salt Road comes down it in the Foreland's D4 and
  into C5 by D5's shore, open from the start, the only way over. C2 holds the Downs' turf on the
  Edge's top, walked to from the Downs alone.
- **South: the Scarp,** with the Glasswold (26–28) above it. Its stair's foot is in C7's notch,
  Act IV's way down, open from the start.
- **South-east: the sea,** Sylmeer, with Wrackholm beyond it. The smugglers' boat to the isle and
  the ferry to Kilnhaven leave Saltmouth's quay (`src/content/crossings.ts`), each sold there and
  open from the start.
- **West: the rim** again, the A column, with the fen's west edge under it.

The Long Water runs the length of the area, from the rim down the Upper Water past Rietum and
through the fen to the sea at Saltmouth. No edge of a built map opens on nothing: its checks hold
no `openOnNothing` row, and A2, A7 and C1 are cut (plan, §11). `node tools/worldmap.ts out.png
--zones` paints the zones.

## 2. What it is for

The first half of Act II (DESIGN §9): *who profits?* The Tide Stone is gone from its plinth, taken
downriver on a barge at midsummer, and everything in the area is what a country looks like with its
Stone stolen rather than cut: the fen glitters with brine glass, the Rifts stand open, the Drowned
Temples have gone dark and their god only counts, and the Compact's barges carry shards and people
down the Long Water past folk who saw the Stone go by (MONSTERS §6.1). It is the first content past
`MAX_LEVEL`, where a company takes its first prestige (#19) and the first fights that one spell must
not answer (MONSTERS §3.3): ranks, morale, casting, drain and elements are all first spent here
(#160, #161). It ends at Saltmouth, the free port, the Compact's home and the seat of Jory Tallis
(DESIGN §10.1, §10.2), with the boat out to Wrackholm. STORY has Maren, the company's Tidefolk
healer, come home to it and go into the temple alone.

The weather is the delta's: mild and wet, sea fog off the gulf in the mornings, the tide twice a
day on the Saltings' ground (#162, #151's call 3).

## 3. What is built

Twenty-four maps (`src/content/areas/saltreach/maps/`, each Rift in its box's file), a row each: its
id and name, kind, size and band; what is there, with its groups (the gate's count); and its
secret, a door at the squares given, with the hint that finds it (the map's `secrets`). Eighteen
maps have one; D5, the three Rifts and the temples' two levels have none.

| Map | Kind, size, band | What is there | Secret, and its hint |
|---|---|---|---|
| `delta_d5`, D5 | outdoor, 32×32, 10–11 | the shore under the Edge: the Salt Road's three squares down D4's foot and its milestone, the sand under the cliff, a shingle bar out to an islet, where a hermit mending nets saw the barge go by, and a spit with a wreck's ribs; no group | none |
| `delta_c5`, C5 | outdoor, 32×32, 10–11 | the Delta road: the causeway from the Edge's foot down the fen's east side, a camp at its head and the drowned god's dry shrine, the fork and its sign, the spur north up the river and the brine Rift on its islet; leeches and an eel in the pools either side and a bull toad alone at the far end; three groups | 27,22, a barge drowned under the causeway's arch, the Brine Shard in its straw: the mast's stump at the arch at 26,22 (`c5_arch`) |
| `c5_rift`, the Brine Rift | dungeon, 12×12, 10–11 | C5's small Rift (#165's ring): three brinelings in its rooms and a tide elder with one more at its heart, quiet once the elder falls or the Stone is home; two groups | none |
| `delta_c4`, C4 | outdoor, 32×32, 10–11 | the spur to Rietum up the Long Water's east bank: a barge tied at the bank, the backwater's herons, the eel-trapper at the ford, Passage Paid's barge on a shoal, a bull toad in a flooded drain, and a camp, a shrine and a cairn under the Edge; the barge's master, bargemen and herons, the toad and the crew that comes up the bank after Passage Paid's people; three groups | 5,14, the crews' hide, a reed hut with a Brine Shard and a Long Sword +1: the one gap in the herons and the sand trodden hard to its wall at 4,14 (`c4_gap`) |
| `upperwater_c3`, C3, Rietum | outdoor, 32×32, 10–11 | the Tidefolk's village on its mound, its houses and net lofts either side of the diep: the shrine by the sluice and its priest, Wytske on the quay, who saw the Stone go by, Nynke at her window with a shard for a night-light, Auke at the silted staithe (the Thief's second prestige) and Sjonghol in the Edge's foot, Douwe at its mouth (the Monk's second); herons in the stubble, the quay's crew by day, brinelings at the child's window by night and a bull toad; four groups | 9,13, the old smuggler's cache under the quay: one stone in the quay's face bare and pale at 8,13 (`c3_stone`) |
| `delta_b5`, B5, Stienwierde | outdoor, 32×32, 11–12 | duckboards west over the fen and the channel to the Tide Stone's island, its plinth empty and its socket cut clean, which takes the Stone home; a driftwood shrine, a cairn, house-footings and a hermit on a hummock who counts the Rifts' lights; fen toads on the boards and bull toads on the island's far side; three groups | 13,14, a hollow under the plinth's landing, a Brine Shard and a Kite Shield +1: one plank unscored among the poles' marks, its nails new, at 13,13 (`b5_landing`) |
| `b5_rift_n`, the Brine Rift | dungeon, 12×12, 11–12 | B5's north Rift (#165's cells): two tide elders at the heart, quiet once they fall or the Stone is home; one group | none |
| `b5_rift_s`, the Brine Rift | dungeon, 12×12, 11–12 | B5's south Rift (#165's breach), its heart as the north's; one group | none |
| `delta_b6`, B6 | outdoor, 32×32, 11–12 | the Drowned Temples' approach: a causeway south round the temple's roof to its dry door, the priestess beside it, counting; the last dry ground and its camp, a small roof with a cairn, the east roof silted shut, the drowned standing in the water and the far roof alone in the flats; fen toads on the causeway, brinelings in the channel by night until both of B5's Rifts are quiet, and bull toads past the far roof; three groups | 8,23, a door in the far roof's wall under the tideline, its porch and the stair down to the choir's back: the priestess's count, one to ten and then her hand to the far roof, at 17,12 (`b6_count`) |
| `drowned_temples`, the Drowned Temples | dungeon, 16×16, 11–12 | the upper temple behind B6's dry door, half flooded: its nave's drowned and the bull toads in its north-east chapel; two groups | none |
| `drowned_temples2`, the Choir | dungeon, 16×16, 11–12 | the choir below: its verger, the chanters counting until the Choirmaster (boss) falls on the chancel step with the Tide Bell, and the sacristy at the back, reached only down the far roof's wet stair, with the god's silver; three groups | none |
| `saltings_c6`, C6 | outdoor, 32×32, 11–12 | Saltmouth's box: the Salt Road's last reach and its milestone to the land gate, the coach yard, the barge quay with the crews' crate, the Compact's warehouse and its clerk, the sea wall and the shore path under it, a camp, the fen west of the road with a shrine, a cairn, a wierde and an eel-catcher's hut, and the pans' first walls; the bargemen on the quay by day, the smugglers under the sea wall by night and salt crabs at the pans; three groups | 28,19, the smugglers' stair in the sea wall's dry end, its cache by a sea door barred from within: a rope hanging down the wall with nothing on it at 28,18 (`c6_rope`) |
| `saltmouth`, Saltmouth | town, 16×16, 10–12 | the free port behind C6's land gate: the Tide Table, the Telhus, the Seawall Armoury, the Quay Chandlery, the Sail Loft, Pender's Locks, the Keel (the Compact's hall) and the Cartographers' Map Room; the four first prestiges taught in the street, the shop, the quay and at the steps; Jory Tallis at his house front; Kitto's boat to Wrackholm and Dunstan's ferry to Kilnhaven; no group | 14,4, the Keel's cellar way, one way only, out onto the sand under C6's sea wall: sawdust trodden out along the Keel's end wall at 14,5 (`sm_sawdust`) |
| `saltings_c7`, C7 | outdoor, 32×32, 11–12 | the salt pans: six walled pans walked in lanes, the last marsh with the drowned god's shrine, the salters' huts, a cairn under the Scarp, the night crew's skiff and the Scarp across the south with the stair's foot in a notch; by night a star where none should be (24); salt crabs in the pans and bull toads in the marsh; two groups | 30,5, the one pan with no sluice, the salter's hoard in it, reached by the crabs' hole under its east wall: the crust trodden to grey mud at that wall's foot at 31,5 (`c7_trodden`) |
| `upperwater_b3`, B3 | outdoor, 32×32, 10–11 | the willows behind Rietum: the Long Water down through the willows, the diep carried on west under its pollards with a plank bridge, the willows' quay with a barge lying up, the boathouse, the ford and the carr; Hiltje cutting withies, a shrine and a cairn; the quay's crew and a bull toad in the carr; two groups | 11,16, the boathouse's back room: the green worn off its back wall at a hand's height at 11,17 (`b3_wall`) |
| `delta_b4`, B4 | outdoor, 32×32, 10–11 | the willows' end: the river under the heronry and out into the broad water, the drowned god's statue with his name cut off its plinth, the dyke-wrights' flood-store in the hill's side, the strand, C4's ford and the fen's north end; the heronry's brood and its keepers (`b4_heronry`) and a bull toad; three groups | 2,12, the flood-store: martins nesting where the hill's facing is laid looser at 2,13 (`b4_bank`) |
| `upperwater_c2`, C2 | outdoor, 32×32, 10–11 | the upper valley, the bounds' first: the hill pasture over Rietum between the rim and the Edge, the Hand's watch at its fire, Jelle with Rietum's sheep, a tarn, the shepherds' cairn and the walled cleft; east of the face the Downs' turf on the Edge's top, open to D2, with a boundary stone and a shepherd of the Downs; the watch and the toads at the tarn; two groups | 17,12, the cleft in the Edge's foot walled with dry stone: the lichen rubbed off the walling in a line at 17,13 (`c2_walling`) |
| `upperwater_b2`, B2 | outdoor, 32×32, 10–11 | the valley's head under the rim: a spring and its trough, a bull toad and an eel in the mire, a cairn and a beehive hut with no door; one group | 19,21, the hut's cell: wrens going in and out low on one side at 19,22 (`b2_hut`) |
| `upperwater_a3`, A3 | outdoor, 32×32, 10–11 | the rim's foot behind the willows: a corner of hill and grass, a bull toad and a heron, a cairn and a well-house walled into the rim's foot; one group | 25,27, the well-house: a willow hung with rags at its walling at 26,27 (`a3_willow`) |
| `delta_a4`, A4 | outdoor, 32×32, 10–11 | the hills over the heronry, open to B4: a woman of stone with a riddle, a dry valley with a shrine at its mouth, a cairn, the reed-cutters' camp, herons fishing the fen's corner and a bull toad and a leech in its pools; two groups | 12,18, a still in a walled cave at the dry valley's head: the reek of peat smoke and malt at 13,18 (`a4_reek`) |
| `delta_a5`, A5 | outdoor, 32×32, 10–11 | the fen's west shore, open to B5: an old dyke let go, a wildfowler in his punt, a shrine, a camp, a cairn, leeches and an eel in the pools, a bull toad where the dyke gives out and the drowned mound left bare for the lair's door; two groups | 21,15, a sluice-house walled up in the dyke: clear water running out under its foot at 22,15 (`a5_water`) |
| `delta_a6`, A6 | outdoor, 32×32, 11–12 | the fen under the rim, open to B6: the temples' bell heard over the fen, a priest of stone with a riddle, a cairn, a camp, two drowned men walked out into the fen and two bull toads; two groups | 18,10, an anchorite's cell walled into the rim's foot: a slit that looks east to the temples at 19,10 (`a6_slit`) |
| `saltings_b7`, B7 | outdoor, 32×32, 11–12 | the Scarp's foot west of the pans: the last marsh and the salters' grass, a salt-carter with word of a fire under the Scarp, a camp, a cairn, a shrine, salt crabs on the grass and the Hand's smugglers at their fire under the rock; two groups | 9,16, a salters' bothy walled up in the Scarp's foot: a fan of dead white grass pointing at its door at 9,15 (`b7_fan`) |
| `saltings_d6`, D6 | outdoor, 32×32, 11–12 | the plate's old place, two pieces of land in the sea off Saltmouth: on the spit the old harbour light's footing with two bull toads, on the shore a cairn of ballast stones and a wreck's ribs; one group | 11,4, the light-keeper's store walled up in the footing: each wave booming hollow under it at 11,3 (`d6_boom`) |

Its content is `src/content/areas/saltreach/`: the maps, then a file each for its flags, monsters,
items, chapter, side quests and guild quests, its rooms, its part of the world (the atlas), its rows
of the suites (the checks) and what other areas take of it (public). Its businesses' rooms are
`src/ui/interiors/saltreach/`, eight in Saltmouth. Its walkthrough plays the chapter in order from a
new game and with Saltmouth taken first, both runs stopping on Wrackholm's landing.

## 5. The one quest here

**The Tide Stone** (`src/content/areas/saltreach/chapter.ts`), the first of Act II, joined after
Thornmark's The Grove Stone: begun once the Foreland and the Grove are both done, or on Wytske's
word at Rietum (`c3_saw_stone`) or Kitto's at Saltmouth (`sm_ship_word`); Wytske's sighting, the
plinth, which reads two ways (#582), the priestess's count and the count up the apse's stair, the
Warden's news of Hale (`q_hale_taken`) and Kitto's word on the ship. Each zone holds a step: Rietum,
the plinth and the temples, Saltmouth. Its end is `q_tide_home`, the Stone set back on the plinth at
B5, Wrackholm's chapter's last step; on the isle the goal passes to it. Nothing in it is a lock: the
boat sails for anyone with the fare.

## 6. Side quests

#56's four, in `src/content/areas/saltreach/quests.ts`, a line each (the plan's §6 has #56's table):

- **The Night-Light** (`nightlight`, 21): Nynke's light taken (`q_nightlight_taken`) to the
  priest's dry bowl for 100 gold (`q_nightlight_temple`) or sold to Tobin for 250
  (`q_nightlight_sold`), or kept on her sill (`q_nightlight_kept`).
- **Passage Paid** (`passage`, 22): Hessel's barge on C4's shoal, its people cut loose
  (`q_passage_freed`), a crew then up the bank after them, or pushed off, his word Kitto's fare
  (`q_passage_owed`).
- **The Tide Bell** (`tide_bell`, 23): the bell the Choirmaster beats the count on, carried back to
  the priestess at the dry door for 300 gold (`q_tide_bell_done`) and a once-only blessing.
- **The Star That Moved** (`star`, 24): Hiske's watch from C7's pilots' stone, the slate to her
  press for 200 gold (`q_star_press`) or to Tallis for 400 (`q_star_tallis`).

The halls (`src/content/areas/saltreach/guilds.ts`): the Cartographers' Guild in the Map Room, its
first task First Chain (`carto_chain`, 30 gold and 120 xp) and its first rank's The Fen's Edge and
The West Arm (200 gold and 360 xp each), where Ysolde reads the Meridian journal (`meridian_read`);
and the Salt Compact in the Keel, its first task The Long Way (`compact_run`, 30 gold and 120 xp),
its first rank's What the Crews Carry (100 gold and 360 xp) and The Watcher on Wrackholm (150 gold
and 480 xp), the boat at half fare to a Runner and Ruan's choice once the Factor's rung is paid
(`q_compact_wardens`, `q_compact_over`).

**The Telstok** (#846), the bounds' artifact, is not built: its lair, a drowned mound of two levels
with its door on A5, is #830's last pull request (plan, §6 and §12.10). The Old Chanter who keeps
it is drawn and defined, and owed to the lair in `checks.ts` until a group there holds it.

## 7. Encounters, and what is new

MONSTERS §6.1's roster, in its monsters file: the Fen Eel and the Leech, the Grey Heron, the Fen
Toad and the Bull Toad, the Bargeman and the Barge Master, the Salt Crab, the Brineling, the Drowned
Man, the Drowned Chanter and the Choirmaster, with MONSTERS §13's Old Chanter, the lair's guardian,
drawn before its lair; the Rifts' tide elders are Wrackholm's Tide Elder, and
C6 and B7 place Wrackholm's smugglers and bowmen. New here (`novel`): the long bodies and the toads,
two new families, and salt underfoot.

## 8. The numbers

- **The curve** (`tools/tests/curve.ts`): a clear gives 13,711 xp a member of the 8,267 it asks
  and 8,410 gold of 5,040; a company entering at the floor and clearing three quarters leaves at
  12.9, +0.9 over the next floor 12. It counts the Hermit of the Point's 500 gold, Wrackholm's quest
  paid by Tallis at Saltmouth, and the Watcher on Wrackholm's 80 xp a member and 150 gold, the
  Compact's, its deed on the isle.
- **The gate** (`tools/tests/gate.ts`): at its maps' floors the area wins 98.9% of its 48 groups'
  fights (aim 90%); two under, its groups pooled at 8 manage 2.85 fights to a rest, 43.8% of the
  floor's 6.5 (aim at most 66.7%). Each zone's road is walked every time, the Upper Water's and the
  Delta's at 10 and the Saltings' at 11. The Choirmaster is won 48% at 11 and 100% at 13.
- **Fights to a rest** (aim 5.5 to 7.5 at 10, 5.75 to 7.75 at 11): C5 7.02 and its Rift 6.39, C4
  6.70, C3 7.12, B5 7.11 and its Rifts 4.75 each, B6 6.96, the temples' two levels 7.18 and 7.49,
  C6 7.26, C7 6.00, B3 7.09, B4 7.10, C2 6.47, B2 5.76, A3 5.89, A4 6.82, A5 6.84, A6 7.18, B7 7.41
  and D6 5.76. Three figures are off their aim, inside the limits: B5's two Rifts, 4.75 each, and
  the choir's 82.7% won at 11.
- **Density** (`tools/tests/density.ts`): within 8 squares in the core, C3 98.7%, B5 95.6%, B6
  96.3% and C6 93.7%; within 12 in the country, D5 100%, C5 97.9%, C4 97.8%, C7 99.0%, B3 96.7%
  (its furthest square 20), B4 97.6%, A5 97.0%, B7 98.0% and C2, B2, A3, A4, A6 and D6 100%; within
  7, the Rifts 96.8%, 100% and 98.5% and the town and the temples 100%.
- **The ladder:** rung 11 is Saltreach's (`gear`, in its checks): Saltmouth's armourer's seven
  wares; by 13 the same with a plus from Saltreach's and Wrackholm's finds (Wrackholm's checks).
  The dearest find, the Sharkskin Coat +1 at 1,250 gold, sits in the window, 2,000.

## 10. Names

Saltreach's naming pass, by the rules of `docs/NAMES.md`: the Tidefolk's tongue was left to it
(NAMES §2), and *salt* ran through five names (Saltreach, Saltmouth, the Saltings, the Salt Gulf and
the salt pans), as Harrow ran through the Foreland's (NAMES §3). Filed as #152.

- **The tongue.** The Tidefolk are the sea people of the delta, who build on mounds above the
  flood, swim like otters and sing to a drowned god (STORY). Their names are Frisian in shape, the
  tongue of the low coast of dykes and tidal flats, beside the Foreland's English and the elves'
  Cornish: short parts, spelled as they are said, with no accent the font lacks. *Wierde* a mound
  above the flood, *-um* home, *riet* reed, *syl* a sluice or a way through the dyke, *diep* a
  channel, *skor* salt marsh, *wad* tidal flat, *meer* a broad water, *stien* stone, *hol* a hollow
  or a cave, *sjong* song, *tel* count, *dyk* dyke, *tij* tide, *sâlt* salt (written *salt*). It
  goes into NAMES §2's row for the Tidefolk.
- **The names:**

  | Was | Now | What it means | Also thought of |
  |---|---|---|---|
  | Reedholm | Rietum | the reed home: the village on its mound among the reeds | Rietwierde, the reed mound |
  | the Wind Cave | Sjonghol | the singing hollow: the cave in the cliff that sings in the wind, where the Monk's trainer sits | Wynhol, the wind hollow, which is Wind Cave again |
  | the Salt Gulf | Sylmeer | the sluice water: the broad water the Long Water drains through | the Gulf, kept |
  | the plinth's island, unnamed | Stienwierde | the stone mound: the island the Tide Stone stood on | Telwierde, the counting mound |
  | Smugglers' Cove (Wrackholm) | Kelp Hole | a sea cave with kelp on its rocks, in the sailors' English that named Brandy Hole and Wrackholm | Otter Hole |

- **Kept:** Saltreach and Saltmouth, the Crown's names for the area and the free port, which the
  story leans on; the Saltings, the salters' English for their marsh, since three names with *salt*
  is the light and its headland, not Harrow's five; the salt pans, a thing and not a name, the
  salters' plain word for their flats, lettered nowhere on the map; the Drowned Temples and the Tide
  Stone, plain names for plain things, as the Grove and the Grove Stone are; the Long Water, which the Tidefolk
  call the Diep in their own speech and nowhere on the map; the Upper Water and the Delta, the
  zones; the Scarp and Kestrel Edge, the Foreland folk's; Wrackholm and the Tide Ship, the sailors'.
- **The god** is *Tijsjonger*, the tide singer (*tij* tide, *sjonger* singer), a name found only on
  the rim of its Holy Symbol in the temples' sacristy (#175). Nobody speaks it: the Tidefolk say
  *the one who counts* until its Stone is home. *Tij* goes into the tongue's list.
- **Ids stay:** `reedholm` is nowhere yet, so Rietum's id is its own; the rest keep the plan's.

## Open and owed

- **Owed, not started:** the bounds' enclave and lair (#830): the enclave, its door in the Scarp's
  foot on B7 (#845), and the lair, a drowned mound of two levels at 30–32, its door on A5, the
  Telstok's (#846, #847). Each adds its brief to the plan, its decisions to
  `docs/areas/saltreach/decisions.md` and a row to §3 here (EXPANSION §8.2).
- **Owed to no check:** its checks have no `owes`; the curve, the gate, density and the ladder hold
  Saltreach with nothing owed.
- **Watched, not moved:** B5's two Rifts, 4.75 fights to a rest each, and the choir's 82.7% won sit
  between their aims and their limits. What the owner finds by hand goes here; none yet.
- **Cut:** A2, A7 and C1 (plan, §11).
- **What is next:** the enclave, then the lair (plan, §12.10).
