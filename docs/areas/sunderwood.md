# Sunderwood: step V of the road, the wood the rift split

Sunderwood's doc is three files (EXPANSION §8.2, #1027), and this, its current state, is read
first. Its decisions, the old §9 whole and the lists that stood under §11 after its cut list, are
`docs/areas/sunderwood/decisions.md`, appended to and never rewritten. Its plan is
`docs/areas/sunderwood/plan.md`: the old §4 (the boxes' briefs, §4.1 to §4.10) and §11's cut list
whole, then under "Moved from the state" the lines of the old header, §1, §3 and §5 to §8 that this
file does not keep, each under the heading it had, among them §1's table and its counts of the
zones' lines; §5's goals; §6's table and its quests' flags; §8's shares and gold. §2 and §10 stand
here whole. The figures are main's at `8462ffeb` (24 October 2026), as the suites print them.

Its ids: the area `sunderwood`, its zones `eaves` and `lanternwood`, the boxes `eaves_i2`,
`eaves_j2`, `eaves_k2`, `eaves_k3`, `eaves_j3`, `lanternwood_l2`, `lanternwood_m2`,
`lanternwood_l3`, `lanternwood_l4` and `lanternwood_k4`, the town `lantern_watch`, the Sunder's two
levels `the_sunder` and `the_sunder2` and K3's Rift `k3_rift`.

## 1. Where it is

The fifth step on the road of levels (DESIGN §9), band 14–16, the last of Act II: two zones of the
atlas (`src/content/areas/sunderwood/atlas.ts`). The Eaves, band 14–15, west of the Sunder, are
five boxes: I2, J2, K2 and K3 along the east road and the gorge, with J3 under them. Lanternwood,
band 15–16, east of it, is five: L2 and M2 along the east road; L3, L4 and K4, its depths. The
town and the dungeons stand off the grid, each entered from a map. Three boxes of the Eaves' land,
I3, I4 and J4, are the Deepthorn's, built whole by Thornmark.

- **North: the rim,** about nine squares deep along the whole area, with the springs of both
  rivers under it.
- **West: the Hoarhills,** with the east road over them from the Thornmark map's east edge, open
  from the start and the only way between the two areas.
- **South: Sunder Bay,** and the Deepthorn's shore running on into the dead wood at K4; Penspern
  across the water.
- **East: the Iron Fells,** the Kilns' first zone (16–18, Act III), the east road running on into
  M3, its first box; south of the Fells, Kilnmouth over the mountains, with no way through.

The Sunder runs north to south through K1 to K4, a gorge of chasm with dead wood and crystal along
both lips, crossed by the rope bridge in K2 and opening on the way down in K3. Of the two rivers
from the rim, one goes over Sunderfall into the gorge and one runs south through Lanternwood to
Sunder Bay. The east road runs I2, J2, K2 (the bridge), L2 (Lantern Watch) and M2 into the Fells.
The rim's row (I1 to M1) and the mountain edges (M3, M4 and L5) are cut (plan, §11), M3 since built
as the Kilns'. `node tools/worldmap.ts out.png --zones` paints the zones.

## 2. What it is for

The end of Act II (DESIGN §9): what a Stone's failure looks like at full size. The Sunder is the
oldest and biggest Rift in the world, a wood torn in half, the trees along its edges gone to glass,
and the beasts along it are changed by it, glass growing through their fur (MONSTERS §6.3). At its
floor, under the soil and the rock, stands a wall, flat and seamless and warm to the hand, with
nothing living near it: the silence at the bottom is the monsters' part in the act's turn. Across
the gorge the Lanterns keep a watchtower, and there they read the smugglers' papers for the company:
every cargo went below under the Helmstow customs seal, countersigned by the Regent. Vask rides up
the next morning with two Wardens and no fear at all, tells the company the world is a cage and the
Hearth its lock, and asks for its help; it says no. *Then stay out of my way. I don't need you. I
have the girl.* (STORY, Act Two.) The Lanterns begin to split here (DESIGN §8), and when the
company goes home Helmstow has changed (#157).

The Warden of the Sunder is the first on the road whose death closes nothing: its Stone is long
gone, and some damage stays done (MONSTERS §6.3). The weather is the wood's: rain in the gorge you
cannot see the bottom of, mist under the pines, and by night the moths to any light.

## 3. What is built

Fourteen maps (`src/content/areas/sunderwood/maps/`), a row each: its id and name, kind, size and
band; what is there, with its groups (its encounters); and its secret, a door at the squares given,
with the hint that finds it (the map's `secrets`). Eleven maps have one.

| Map | Kind, size, band | What is there | Secret, and its hint |
|---|---|---|---|
| `eaves_i2`, I2, the Eaves' way in | outdoor, 32×32, 14–15 | the east road out of Thornmark over the Hoarhills' shoulder and under the pines; a shrine, a cairn, the woodcutter's camp, the lookout on the crest; three groups | 17,11, the Watch's last patrol's pack: the milestone face down at 17,10 (`i2_milestone`) |
| `eaves_j2`, J2, the Eaves | outdoor, 32×32, 14–15 | the east road on for the bridge, the gorge's west lip and its glass trees; the pine-cutters' steading, Garret, the two graves and the dog at the north path's foot; the hermit under the rim; four groups | 16,2, the bear's cave and the gleaner's sack: the cutters' dog at 19,7 (`j2_dog`) |
| `eaves_k2`, K2, Sunderfall | outdoor, 32×32, 15 | the gorge and the rope bridge; the dammed river and the fall gone quiet; the shrine at the fall and Orm, its keeper; the sawn glass; a Lantern's stone; three groups | 10,29, the ledge behind the fall: the one bare rock under it at 11,29 (`k2_rocks`) |
| `eaves_k3`, K3, the Sunder's mouth | outdoor, 32×32, 15–16 | the gorge on south, both lips dead wood; the ledges down the east face to the first landing and the door shut in the rock, the way into the Sunder; the black-glass Rift in the crystal; two groups | 16,15, the river's old bed on the east lip: dead wood stacked across it at 15,15 (`k3_stack`) |
| `k3_rift`, the Glass Rift | dungeon, 12×12, 14–15 | K3's Rift, which stays open: sunderlings and glass spiders; two groups | none |
| `the_sunder`, the Sunder | dungeon, 32×32, 14–15 | in at K3's door: the stair in the rock onto the east face's ledges, the black glass at the first landing, the glass threads over the drop, the gleaners' cache in a cleft; one group | none |
| `the_sunder2`, the Sunder's Floor | dungeon, 32×32, 14–16 | dead wood and glass, the river into a crack, the narrows and the Warden of the Sunder; bare rock with no sound and the wall along the floor; three groups | 2,24, the seam in the wall behind the rock fall: the surveyor's last chalk mark at 3,25 (`su2_chalk`) |
| `eaves_j3`, J3, the Bears' Wood | outdoor, 32×32, 15–16 | the deep forest under J2, closed against the Deepthorn; Aylmer the hermit, the Paladin's second prestige; the bears' den under a fallen pine; three groups | 21,20, the gleaners' cache in the den's back: moth dust at its mouth at 18,20 (`j3_mouth`) |
| `lanternwood_l2`, L2, Lanternwood | outdoor, 32×32, 15–16 | the east road on from the bridge and the spur north to Lantern Watch's gate; the two wayside lamps, one of them dark with Averil by it until the papers are read; the knoll with the signal fire's ash; four groups | 5,5, the pit under the knoll: the ash raked flat at 5,6 (`l2_ash`) |
| `lanternwood_m2`, M2, the Fells Road | outdoor, 32×32, 15–16 | the east road over the river and on into the Iron Fells' M3; the milestone and the Warden's grave; a shrine, a camp, a cairn and a lookout; three groups | 5,30, the Warden's grave: the milestone at 3,30 (`m2_milestone`) |
| `lanternwood_l3`, L3, the Moth Wood | outdoor, 32×32, 15–16 | the Lanterns' bank path down the river; the moth shrine and Sister Leofrun, the Cleric's second prestige; a fallen wayside lamp; two groups | 17,15, the Lanterns' lamp-house: the lamp-hooks grown into the oaks at 17,16 (`l3_hooks`) |
| `lanternwood_l4`, L4, the Bay Wood | outdoor, 32×32, 15–16 | the river's mouth on Sunder Bay; the den where a sow gone to glass bears cubs born glass; a stone Lantern with a riddle; a mooring post; three groups | 22,26, the Hand's store above the landing: boot prints down to the river's mouth at 17,28 (`l4_prints`) |
| `lanternwood_k4`, K4, the Sunder's Foot | outdoor, 32×32, 15–16 | the gorge's last reach, closing to a crack above the shingle; in from K3's east lip, east along the shingle to L4; two groups | 2,17, the depths' Lanterns' boathouse: steps cut down the west lip at 4,17 (`k4_steps`) |
| `lantern_watch`, Lantern Watch | town, 16×16, 14–16 | one tower in a walled yard over the gorge, through L2's gate: the Lamp Gallery (training to 17), the prior's room and the Reader, the stores, the refectory, the Lanterns' hall (to tier 6); Prior Osric and Wouter Brink; Vask at the gate once the papers are read and the wall touched | none |

Its content is `src/content/areas/sunderwood/`: the maps, then a file each for its monsters, items,
chapter and side quests, its part of the world (the atlas), its rows of the suites (the checks) and
what other areas take of it (public). Its walkthrough plays the chapter in order, the Watch first
and the Sunder first, then the side quests and the prestiges' trainers. Its businesses' rooms are
`src/ui/interiors/sunderwood/`.

## 5. The one quest here

**The Wall** (`wall`, `src/content/areas/sunderwood/chapter.ts`), the last of Act II, joined after
Wrackholm's: the wood split in half, seen from the Eaves' rim; the crossing on the rope bridge; the
wall at the Sunder's floor, flat, without a join and warm, which the log never names; the papers
read at the Watch: the Helmstow customs seal on every cargo, the Regent's name under it and the
log's one name, Vask; Vask in the rain at the gate, whose question has one answer, the company's
no (`q_vask_no`); and home. The no sets `q_salt_done`, the chapter's done flag, which ends the act.
No lock: the bridge stands whatever the story does, and the Watch reads the papers for whoever
carries them.

## 6. Side quests

#56's four, in `src/content/areas/sunderwood/quests.ts`, each a choice paid whichever way it goes
(the plan's §6 has their table and their flags):

- **Under the Glass Trees** (`family`, 15): Garret and Nell at the steading (J2) and Averil; 110
  xp a member.
- **The Dammed Fall** (`dam`, 15): Orm at Sunderfall's shrine, the dam and Hew, its foreman (K2);
  110.
- **The Watch's Lamp** (`watch_lamp`, 16): the dark lamp, Averil, Prior Osric and Brother Cuthwin
  in the Watch; 140. Telling on the prior opens the Lanterns' split (`lanterns_split`).
- **The Length of the Wall** (`length`, 16): Wouter Brink and the wall's two ends on the Sunder's
  floor; 140, and 500 gold if the measure is sold.

Two prestiges are taught here (#19): Aylmer, a knight of the Crown that was, in J3 (the Paladin's
second) and Sister Leofrun at the moth shrine in L3 (the Cleric's second).

## 7. Encounters, and what is new

Nine monsters in its file (MONSTERS §6.3): the pine bear and the glass bear, the lantern moth and
the deathshead, the sunderling, the glass spider, the sunder hound, the Ashen gleaner and the Warden
of the Sunder, its boss, whose death closes nothing. The moths and the deathsheads walk by night
(`when`). Two dens: the bears' under J3's fallen pine and the glass sow's in L4. What it claims for
the novelty check (`novel`, in its index): the bears and the moths; dead wood, crystal and the
chasm underfoot; sleep inflicted (`inflict:asleep`); the falls.

## 8. The numbers

- **The curve** (`tools/tests/curve.ts`): a clear gives 13,831 xp a member of the 11,467 it asks
  and 6,997 gold of 6,960; a company entering at the floor and clearing three quarters leaves at
  16.5, the next floor 16.
- **The gate** (`tools/tests/gate.ts`): at its maps' floors the area wins 98.7% of its 35 groups'
  fights (aim 90%); two under, its maps' groups pooled at 12, a company manages 4.11 fights to a
  rest, 54.8% of the floor's 7.5 (at most: aim 66.7%). The Warden of the Sunder is won 56% at 14
  and 95% at 16, and the Sunder's floor, at 14, 85.3% of its fights, off the aim of 90% and inside
  the limit of 80%: the gate's one.
- **Fights to a rest** (aim 6.5 to 8.5 at 14 and 6.75 to 8.75 at 15): I2 7.51, J2 7.76, K2 7.76,
  K3 8.05, the Rift 7.30, the Sunder 6.68 and its floor 7.74, J3 7.60, L2 8.20, M2 8.36, L3 7.77,
  L4 8.50 and K4 7.34, each inside its aim.
- **Density** (`tools/tests/density.ts`): within 8 squares in the core, J2 92.1%, K2 97.9%, K3
  96.0% and L2 100%; within 12 in the country, I2 96.6% (its furthest square 16 of 20), J3 99.3%,
  M2, L3 and L4 100% and K4 99.8%; within 7, the Rift 92.9%, the Sunder 100%, its floor 99.6% and
  the Watch 100%.
- **The ladder:** rungs 14 and 16 are Sunderwood's (`gear`, in its checks): by 14 the Watch's
  stores, by 16 their wares with a plus, the Lanterns' staff and the Sunder's Plate Mail +2, at
  1,500 the dearest find, each inside the window of 3,000 gold.

## 10. Names

Sunderwood's names are English already, the Crown's and the Lanterns', and stay: the Sunder, the
wood it sundered, the Eaves under the rim, Lanternwood and Lantern Watch, Sunderfall, the Hoarhills,
the Iron Fells. No people of their own live here to name it otherwise: the cutters are Thornmark's
and the Lanterns Helmstow's. A naming pass is the owner's to ask for; none is filed.

## Open and owed

- **Owed to no check:** its checks have no `owes`, and the curve, the gate, density and the ladder
  hold Sunderwood with nothing owed.
- **Watched, not moved:** the Sunder's floor, won 85.3% at 14, is off its aim and inside its limit.
  What the owner finds by hand goes here; none yet.
- **Cut:** the rim's row and the mountain edges (plan, §11); the Deepthorn's three boxes are
  Thornmark's.
- **What is next:** nothing. The plan's briefs are all built, and a new box starts its brief there.
