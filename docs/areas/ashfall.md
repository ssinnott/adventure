# Ashfall: step X of the road, the far side of the sea

Ashfall's doc is three files (EXPANSION §8.2, #1011), and this, its current state, is read first.
Its decisions, the old §9 whole, are `docs/areas/ashfall/decisions.md`, appended to and never
rewritten. Its plan is `docs/areas/ashfall/plan.md`: the old §4 (the boxes' briefs, §4.1 to
§4.11), §11 (what was cut) and §12 (the bounds, §12.1 to §12.4) whole, then under "Moved from the
state" the lines of the old header, §1, §3 and §5 to §8 that this file does not keep, each under
the heading it had, among them §1's squares and flows, §3's atlas rows, drawings and crossings,
§6's tables, the Master of magic, Grim's Axe's brief and §8's figures box by box. §2 and §10 stand
here whole. The figures are main's at `5231c94d` (24 October 2026), as the suites print them.

Its ids: the area `ashfall`; its zones `cindercoast`, `firemount` and `emberwaste`; the town
`cinderport`; the dungeons `old_cinder` and `old_cinder2` (Old Cinder and its undercroft) and
`ember_stone`; Meridian Camp's three levels, `meridian_camp`, `meridian_camp2` and
`meridian_camp3`, #22's (`docs/areas/meridian_camp.md`); the enclave `blackdraw`; and the lair
`grims_howe`.

## 1. Where it is

The tenth step of the road of levels (DESIGN §4, §9) and the second of Act IV: three zones
of the atlas (`src/content/areas/ashfall/atlas.ts`) on the grid of boxes 32 squares a side
(EXPANSION §8.2), the E to H columns from row 9 to row 12. Cindercoast, band 24–25, is H10, G10,
F9, G9 and H9; Fire Mountain, band 25–26, is G11, H11, H12 and G12; the Ember Waste, band 25–26, is
F11, F10, E10, E11 and F12, F10 built at 24–26. F12 is the bounds' (#836). The town and the
dungeons stand off the grid: Cinderport behind G10's gate; Meridian Camp down G11's vents; Old
Cinder through F11's crater and the Ember Stone under its field of cinders; Blackdraw and Grim's
Howe in F12's mountain face and its dam.

- **North: the Ember Sound,** with Sheer Point across it. The Compact's ship from Kilnhaven lands at
  Cinderport, a crossing open from the start for the fare, and the last crossing leaves from the
  same steps for Hearth Isle, Act V's.
- **East: the Sheer,** the cliff down the Whitespine's west side. The Giants' Stair comes down it
  from the High Spine's I10 onto H10, open from the start and the only way over by land.
- **South: the rim,** under Fire Mountain's slopes and the Waste's; E12 is cut (plan, §11).
- **West: the Cinder Hills,** between Ashfall and the Glasswold. The road to the Wold crosses them
  in E10, open from the start, onto the steppe, Act IV's third area.

Fire Mountain's three lava flows run south-west through G11 and F11 to their end in F12, south-east
through H11 to its end in H12 and west across F11. Two edges open on nothing (`openOnNothing`,
`src/content/areas/ashfall/checks.ts`): E11's south, onto E12, the world's end; and E11's west, onto
D11, the Glass, the reach, shut until Phase 1.6. `node tools/worldmap.ts out.png --zones` paints
the zones.

## 2. What it is for

The second half of Act IV (DESIGN §9): *what is Caldera?* The Whitespine found the machine in a
monk's robe and the Hand's road over the water; Ashfall is where the company is told the answer
and shown it. The Riders' eldest tells the oldest story on this side of the sea at Cinderport's
trading ground: a door opened in the sky, and the land where what rose toward it fell burned to
glass. The Ember Stone was never finished, so the far side was
never sealed: there are no Rifts and the machine is near the surface, the vents are the Underdeep's
exhaust and the stokers that tend them walk out on the ash (MONSTERS §2.1, §8.2). The parts the
Stone lacks are only below, down the vents, where Meridian Camp's old man says "You took your time"
and shows a window (STORY, Act Four; #22). When the Stone is lit, every door below opens at once,
what waited four hundred years comes up and hunts Ashfall from then on, and the Hearth burns
steadier than in all our lives (#548). Three classes take their third prestige here and a fourth
comes down from the Wold for it (DESIGN §5, #448). It ends at Cinderport, with the last crossing.

The weather is the far side's: hot, ash on the wind, the mountain's smoke over everything, steam
off the springs; the vines' shore humid.

## 3. What is built

Twenty-three maps (`src/content/areas/ashfall/maps/`), a row each: its id and name, kind, size and
band; what is there, with its groups (the gate's count); and its secret, a door at the squares
given, with the hint that finds it (the map's `secrets`). Eighteen maps have one; Cinderport, F10
and Meridian Camp's three levels have none.

| Map | Kind, size, band | What is there | Secret, and its hint |
|---|---|---|---|
| `cindercoast_h10`, H10 | outdoor, 32×32, 24 | the Stair's foot: the Giants' Stair's last flights down the Sheer to the black sand; Scaldwell's pools, its bathhouse and keeper and the stoker at the springs' source (§6); a camp under the Sheer; four groups | 8,18, the springs' vent and its hoard: a path trodden flat to the rock at 8,17 (`h10_trodden`) |
| `cindercoast_g10`, G10 | outdoor, 32×32, 24–25 | Cinderport's box, which lists the area: the town's wall and gate; the trading ground, the Riders' horse-lines and their eldest, who tells the oldest story; the knoll and the shore's trees; four groups | 27,2, the factor's hide: vines cut back to the stem at 26,2 (`g10_cut`) |
| `cinderport`, Cinderport | town, 16×16, 24–26 | the town behind G10's gate: the inn, the temple, the armourer's (rung 25), the chandler's, the Ash Yard that trains to 27, the Chart House and the Factor's House (the two halls) and the potter's; the Compact's steps, where the ship and the last crossing land | none |
| `firemount_g11`, G11 | outdoor, 32×32, 25 | Fire Mountain's flank: the cone, drawn tall over the land as a volcano with its plume from its mouth at 15,8 (a landmark), and its flows; Grimsforge and Petroc at the anvil (§6); the vents, the middle one the way down to Meridian Camp; the scavenger at his camp; five groups, a sentry after the Stone among them | 29,16, the scavenger's ledge: a rope of vine let down between the stones at 28,16 (`g11_rope`) |
| `meridian_camp`, Meridian Camp | dungeon, 32×32, 25 | #22's first level, the vents' flue hall under G11's mouths: the stokers' rounds and their furnace room, the Stone's first part (`ember_part1`); four groups | none |
| `meridian_camp2`, the Iron Corridors | dungeon, 32×32, 26 | #22's second: corridors of hot iron, the Company's cold camp, the Brood Drake on its eggs (boss) and the Stone's third part (`ember_part3`); four groups | none |
| `meridian_camp3`, the Camp | dungeon, 32×32, 27–28 | #22's last, outside the area's budget: Oriel Fane at the Company's warm camp, the window and the deep knockers' gallery with its door that opens for nobody; six groups | none |
| `emberwaste_f11`, F11 | outdoor, 32×32, 25–26 | Old Cinder's and the Ember Stone's box: the buried town's crater and Wystan on its lip (§6); the west flow and its causeway of slag; the Stone half-built in its scaffold on a field of cinders; the hermit (§6); four groups | 3,23, the builders' hollow: the rock scored in straight lines at 4,23 (`f11_scored`) |
| `old_cinder`, Old Cinder | dungeon, 16×16, 25–26 | the buried town: its people in their doorways, a cup in every hand; the well, the potters' kilns and the Old Drake asleep on the square (boss); the hall's stair down; two groups | 2,9, the room the ash never filled, the scholar's: a cup rinsed clean on the floor at 2,8 (`oc1_cup`) |
| `old_cinder2`, Old Cinder | dungeon, 16×16, 24–25 | the undercroft: the founding stone in its niche (§6), the lamp-keeper's walk and the cold lamp, the Stone's second part (`ember_part2`); one group | 7,10, the lamp-keeper's cellar: a stair fallen against the wall at 8,10 (`oc2_fallen`) |
| `ember_stone`, the Ember Stone | dungeon, 16×16, 25–26 | the housing under F11's field: the core and its three sockets, the Sentinel (boss) and two sentries when the Stone lights; the bed of earth under the lookout slit (§6); two groups | 8,13, the lower gallery and the fourth journal: a surveyor's chain pin at 8,14 (`es_pin`) |
| `emberwaste_f10`, F10 | outdoor, 32×32, 24–26 | the Ember Waste's road west from Cinderport's box over the bare ash; the Riders' ring; Kenver, the Archdruid, in an outcrop's lee (§6); three groups | none |
| `emberwaste_e10`, E10 | outdoor, 32×32, 25–26 | the road up the Cinder Hills by the notch and down onto the Wold's steppe; the Hills' cairns; the chapter's end on the last shoulder (§5); five groups | 18,27, a grave: the one cairn that looks back at the Stone at 19,27 (`e10_back`) |
| `cindercoast_f9`, F9 | outdoor, 32×32, 24–25 | the fishers' bay west of Cinderport: their hamlet on the black sand, a fisherman on the Compact's tenth and a fish stone that gives accuracy; one group | 24,24, the fishers' store: a path up the ridge that stops at a rock at 24,26 (`f9_track`) |
| `cindercoast_g9`, G9 | outdoor, 32×32, 24–25 | Cinderport's harbour side, between the sea wall's moles: the lantern on the mole's end, the fishers' slip on the cove and an old fisherman; one group | 13,28, the smugglers' cell: a step worn hollow at the sea wall's foot at 15,28 (`g9_step`) |
| `cindercoast_h9`, H9 | outdoor, 32×32, 24–25 | the shore under the Sheer: a fishers' hamlet and a fishwife, a gull stone that gives intellect; the Sheer shuts its east edge; one group | 27,27, a cleft with a hearth and a sea-chest: rocks black with old smoke at 25,27 (`h9_soot`) |
| `emberwaste_e11`, E11 | outdoor, 32×32, 25–26 | the Waste's west: the flow running south-west under the mountains, cinder cones, a knapper at the flow's edge and a black stone that gives might; one group, drakelings in their cast skins | 18,12, a tube under the flow, a man's bones by his pack: a crack breathing cold air at 18,11 (`e11_draught`) |
| `firemount_h11`, H11 | outdoor, 32×32, 25–26 | the east flank between Fire Mountain and the Sheer: Grimsforge's back, the stream on flat stones and a drake-watcher at his fire; one group, drakelings at their shell | 26,26, a hollow with an old war-chest: an axe-head driven into the rock at 26,27 (`h11_axe`) |
| `firemount_h12`, H12 | outdoor, 32×32, 25–26 | the south-east foot: the flow's end under its own crust, a warm spring that gives luck and a drake's wallow; one group | 7,9, the tube the flow ran out of: the crust split along one line at 7,8 (`h12_seam`) |
| `firemount_g12`, G12 | outdoor, 32×32, 25–26 | the south foot: the ash in long folds off the cone, warm over Meridian Camp, and hollows scraped in a row; one group | 12,11, the drakes' hollow: claw-marks scored across one rock at 12,10 (`g12_claws`) |
| `emberwaste_f12`, F12 | outdoor, 32×32, 25–26 | the bounds' first, the flow's end under the rim: its dam of black rock, a man of stone with a riddle and the sulphur vents; the lair's way in under the dam's crust and the enclave's flue mouth in the mountain's face; no group | 29,12, the knapper's store: flakes of black glass heaped at 29,11 (`f12_flakes`) |
| `blackdraw`, Blackdraw | dungeon, 16×16, 27–28 | the enclave, a flue of the Underdeep's exhaust down to a cold furnace: a flue walker, an inspector and a deep knocker; the stokers' locker and Kindler, a marlinspike whose blows carry lightning; two groups | 5,6, the clerks' room and their pay chest: one plate knocked bright at 5,7 (`bd_bright`) |
| `grims_howe`, Grim's Howe | dungeon, 16×16, 30–32 | the lair, a warlord's grave under F12's dam: the Grave Drake asleep on the grave (§6), the warlord's bier and Grim's Axe; one group | 7,13, the war-band's offerings: a stone cut with a smoking mountain at 7,12 (`gh_mark`) |

Its content is `src/content/areas/ashfall/`: the maps, then a file each for its monsters, items,
chapter, side quests and guild quests, its part of the world (the atlas), its rows of the suites
(the checks), its rooms' list and what other areas take of it (public). Its walkthrough plays the
chapter at 24, 25 and 26 four ways and every side quest's answers. Its businesses' rooms are
`src/ui/interiors/ashfall/`.

## 5. The one quest here

**The Window** (`window`, `src/content/areas/ashfall/chapter.ts`), Act IV's second chapter, after
the Whitespine's The Bells: begun on The Bells' end (`q_stair_top`) or at Cinderport by Kilnhaven's
ship; the far side at the Stair's foot; the eldest's story at the Riders' fire (`q_eldest_heard`);
the Stone seen; the three parts from Meridian Camp's vents and corridors and Old Cinder's
undercroft, each keyed on its chest opened; the camp, Fane's map and the window for a company
that looks; the Stone lit (`q_ember_lit`) and the Hearth steadier (#548); and the road west. It is
done on `q_road_west`, set on E10's last shoulder (`e10_west`) or at Akordu's horse-lines for a
company that rides; the Glasswold's chapter starts on it.

Nothing in it is a lock (EXPANSION §2.3): the ship sails for anyone with the fare, the dungeons are
open at any hour and the Stone takes the parts in any order. When it is lit every door below opens
at once, and the sentries walk all of Ashfall from then on (§7).

## 6. Side quests

Three of #56's in `src/content/areas/ashfall/quests.ts`, a line each (the plan's §6 has #56's
table and the As built); each is answered by a choice its person puts:

- **What the Springs Bring Up** (`springs`): the bathhouse keeper at Scaldwell; the stoker at the
  source left, and she gives what comes up, or broken, and the springs go cold for good.
- **The Founding Stone** (`founding`): Jenifer the potter; the stone from the undercroft's niche,
  raised in a shrine on the trading ground or taken back to the dead.
- **Shovel That Does Not Blunt** (`shovel`): Gorran the smith; the scavenger's ledge by Grimsforge;
  the shovel-head sold to the thane's agent or the Wardens, or hafted, the Grey Shovel +3.

The third prestiges' (#448), in the same file, each asked of a member of its class at 27 with the
second and paid in the prestige: **The Cold Lamp** (`old_lamp`), Wystan's, the Paladin's, the
undercroft's lamp lit; **What Nests There** (`brood`), Petroc's, the Barbarian's, the Brood Drake
slain; **The Seedling** (`seedling`), Kenver's, the Druid's, the Grove's seedling planted under the
Stone's lookout. The Ranger's is the Wold's.

**The Master of magic** (#859), found and never told: a scholar in Old Cinder's room the ash never
filled, who teaches Master in magic for 5,000 gold to a member Expert in magic of level 25 once
the town's roll, from the end of E11's cold tube, is handed in (`q_roll_given`).

The guilds' (`src/content/areas/ashfall/guilds.ts`): the Cartographers' second hall and the
Compact's factor's house stand in Cinderport. The Cartographers' The Fourth Journal
(`carto_journal`, the journal's chest under the Stone; 500 gold, 3,600 xp) and Fane's Fire
(`carto_fane`, the camp's fire seen; 800 gold, 4,800 xp) are offered at either hall.

**Grim's Axe** (#846), the bounds' artifact of #836: on the warlord's bier in Grim's Howe, behind
the Grave Drake (boss, 32: 1,600 hit points, attack 20, 27d8+28 a blow; it burns a row), found and
never told. The rumour is Petroc's at Grimsforge, at a meeting after his first. A two-handed axe of
2d12+8 for the knight, the paladin, the ranger and the barbarian; it casts Meteor Swarm twice a day.

## 7. Encounters, and what is new

Ashfall's monsters are MONSTERS §8.2's, in its monsters file: the Strangler Vine, the Cinder Beetle,
the Ember Salamander, the Ash Husk, the Stoker, the Cinder Drake, the Sentry, the Old Drake and the
Sentinel, two of them new families, the drakes and the heavy machines. The sentries walk only once
the Stone is lit (`after`). Meridian Camp's are #22's; Blackdraw places its flue walker, inspector
and deep knocker again at its own band, and Grim's Howe the Grave Drake alone, a new kind of the
drakes (MONSTERS §13). Its `novel` claims the drakes and the vines underfoot with G10, the heavy
machines and the volcano with G11 and the springs with H10; the rest is on the road before it
(`noveltyFaults`, `tools/tests/pillars.ts`).

## 8. The numbers

- **The curve** (`tools/tests/curve.ts`): a clear gives 35,919 xp a member of the 19,467 it asks and
  12,160 gold of 11,760; a company entering at the floor and clearing three quarters leaves at 27.4,
  +1.4 over the next floor 26, a named exception the curve holds at 27.4 (`overRoad`, in its
  checks). Meridian Camp's last level is outside its budget (3,003 xp a member and 1,200 gold), and
  the enclave and the lair are counted in no clear (4,186 xp a member and 1,200 gold).
- **The gate** (`tools/tests/gate.ts`): at its maps' floors the area wins 97.6% of its 45 groups'
  fights (`GATE.through`'s aim); two under, its groups pooled at 22, 7.61 fights to a rest, 76.1% of
  the floor's 10. Old Cinder and the Ember Stone at 25 win 82.5% each, their bosses deciding it: the
  Old Drake 65% at 25 and 99% at 27, the Sentinel 65% and 97%. The Brood Drake is won 61% at 26 and
  100% at 28, the Grave Drake 59% at 30 and 81% at 32. The corridors win 90.3% at 26 and every other
  map every fight at its floor; the three zones' roads are walked every time.
- **Fights to a rest** (aim 9 to 11 at 24, a quarter more a level): H10 10.21, G10 10.88, F10 9.19,
  F9, G9 and H9 10.51 and the undercroft 10.10 at 24; G11 10.23, the vents 10.98, E10 10.49 and F11
  10.82 at 25, with the Ember Stone's 8.57, Old Cinder's 11.76 and E11's, H11's, H12's and G12's
  11.39 off the aim; the corridors 8.69 at 26, off it; the camp 10.64 and Blackdraw 11.14 at 27. The
  gate lists eighteen figures off their aim, inside their limits.
- **Density** (`tools/tests/density.ts`): within 8 squares in the core, G10 97.3% and H10, G11 and
  F11 100%; within 12 in the country, E11 99.4% and H11 98.1% (their furthest squares 15), every
  other box 100%; the town and the dungeons 100% within 7.
- **The ladder:** rung 25 is Ashfall's (`gear`, in its checks): Cinderport's armourer, every class
  bettered by it. Its ranged rung (`ranged`, #1115): the Ashwood Short Bow and the Drakeskin Sling, a
  step and two behind the Ashwood Bow, sold beside it at the Hide and Hammer and off the gate's
  ladder until #1117. The Horn Bow +2 in E10's grave is Saltreach's, off the ladder, and has neither.

## 10. Names

Ashfall's naming pass, by the rules of `docs/NAMES.md`, chosen for #444. Cindercoast's folk came
down from the mountain (#56's 50) and keep the Crown's trade-English for their coast, as Wrackholm's
sailors did (NAMES §4), so most of the plan's names stand; two were bare descriptions, which NAMES
§3 forbids. The Riders' tongue is the Wold's (NAMES §2; docs/areas/glasswold.md §10), and nothing
of theirs is named here: the trading ground and Scaldwell are the coast's.

| Was | Now | What it means | Also thought of |
|---|---|---|---|
| the Hot Springs | Scaldwell | a spring that scalds, in the coast's English: the pools under the Sheer where the Riders bathe | Steamwell; the Springs, kept |
| Warlord's Forge | Grimsforge | Grim's forge: whose it was, as a farm is named, since the bare description is forbidden; the old warlord's name, worn down | Smithstead; Grimsanvil |
| the cold flue, the enclave (#836) | Blackdraw | the black draw, a flue's draught gone still under its soot, in the coast's English | Sootdraw; Coldreek |
| the enclave's reward (#836) | Kindler | the iron the stokers lit the furnace with, named for what it did | Firesteel; Sparkiron |
| the grave where the flow stopped, the lair (#836) | Grim's Howe | Grim's howe, the old word for a grave mound: whose grave it is, as his forge is Grimsforge | Grimsgrave; the Warm Howe |

- **Kept:** Ashfall, Cindercoast, Fire Mountain, the Ember Waste and the Ember Stone, plain names
  for plain things, as the Grove and the Grove Stone are; Cinderport and Old Cinder, the coast's
  English for the port and the town it was before the mountain buried it, the one place lending its
  name to the other (NAMES §3); Meridian Camp, the Guild's name for the Company's last camp; the
  Giants' Stair and the Sheer, the Whitespine's (#502); the Cinder Hills and the Ember Sound, the
  plan's, each a name on a border Ashfall shares.
- **Ids stay** where they exist (NAMES §3): the plan's sites are renamed in `atlas.ts` and the
  sweep is one change through `src/`, `tools/` and `docs/`; the issues keep the old names until they
  are edited.

## Open and owed

- **Owed to no check:** its checks owe nothing (the Grave Drake, the last row, left with the lair,
  #836), and the curve, the gate, density and the ladder hold Ashfall with nothing owed; its lead is
  the curve's named exception (§8).
- **Watched, not moved:** Old Cinder's 11.76 fights to a rest and the drakelings' boxes' 11.39 sit
  past the aim, inside the limit (plan, §8). What the owner finds by hand goes here; none yet.
- **Meridian Camp** is #22's, its doc `docs/areas/meridian_camp.md`; its levels are Ashfall's maps.
- **What is next:** nothing. The plan's briefs are all built, and a new box starts its brief there.
