# Ashfall: step X of the road, the far side of the sea

The tenth step of the road of levels (DESIGN §9, EXPANSION §2.2), band 24–26, and the second of Act
IV, Beyond the Sky: the land under the Sheer where the Giants' Stair comes down, black sand and
hanging vines along the Ember Sound, a mountain that smokes over everything, a town it buried, and
on a field of cinders the one Stone that was never finished. Cinderport is the far side's port,
where the Compact's ship from Kilnhaven lands and the Riders come down to trade, and from it the
last crossing leaves. Down Fire Mountain's vents lies Meridian Camp and the window (#22). This is
its area doc (EXPANSION §4, §6 and §8.2): where the atlas puts it, what the atlas and the docs put in
it, the plan for building it, box by box, and the briefs. Its work is filed under #446 (Phase 1.4,
#441): the boxes as §4's table has them, Cinderport (#512), Old Cinder (#515), the Ember Stone
(#516), its chapter (#518), its side quests (#519), its drawings (#520), its rooms (#521) and the
country behind (#522, parked); this doc is #509. Figures are measured on main at `6032251` (2
October 2026) with `worldGrid` (`src/game/atlas.ts`).

Nine maps are built: H10, the Stair's foot (#510, §4.2), which joins the area to the Whitespine
overland; G10, Cinderport's box (#511, §4.3), which lists the area; Cinderport behind its gate
(#512, §4.4); G11, Fire Mountain's flank (#513, §4.5); the vents and the iron corridors, Meridian
Camp's first two levels (#22, docs/areas/meridian_camp.md §4.1 and §4.2); F11, Old Cinder's and the
Ember Stone's box (#514, §4.6); and F10 and E10, the Ember Waste's road (#517, §4.9). Its nine
monsters and the armourer's step are drawn (§3), and the rest is to build. Its content is
`src/content/areas/ashfall/` (maps, monsters, items, climate, its part of the world map and its
walkthrough; its chapter of the one quest, The Window, in `chapter.ts`, and its side quests in
`quests.ts`, to come) and its businesses' rooms `src/ui/interiors/ashfall/`. Its ids, the plan's:
the area `ashfall`, its zones `cindercoast`, `firemount` and `emberwaste`, the town `cinderport`,
the dungeons `old_cinder`, `ember_stone` and `meridian_camp`.

---

## 1. Where it is

The atlas (`src/content/areas/ashfall/atlas.ts`, the area's own since #511, §3) makes Ashfall
three zones:

| Zone | Band | Squares | Built |
|---|---|---|---|
| Cindercoast | 24–25 | 3,657 | H10, G10 |
| Fire Mountain | 25–26 | 3,795 | G11 |
| The Ember Waste | 25–26 | 3,284 | F11, F10, E10 |
| The area | 24–26 | 10,736 | H10, G10, G11, F11, F10, E10 |

Squares are land without shallows or rivers, about 10.5 zone maps (EXPANSION §1 has 10.5), and
9,228 of them a company could walk: the rest is Fire Mountain's cone, the Sheer's foot and the rim.
Most of it is ash: Cindercoast is ash 1,438, grass 1,042, vines 631, hills 165 and pine 138; Fire
Mountain ash 2,638, mountain 860, lava 147 and pine 92; the Ember Waste ash 2,086, mountain 465,
rock 382, hills 203 and vines 71. It runs from the Cinder Hills at about x 146 east to the Sheer at
x 266, and from the Sound's shore at about y 275 down to the rim at y 370. The zones' bands are the
folder's: the atlas gives the area 24–26 and the boxes rise through it (§4).

The squares are the plan's, before any box. H10 (#510) and G10 (#511) are laid whole in Cindercoast,
G11 (#513) in Fire Mountain and F11 (#514), F10 and E10 (#517) in the Ember Waste, whose band stays
the plan's 25–26 on its row where F10 and E10 are built at 24–26 (§4, §9, #514's 1, #517's 2).

**The grid** (EXPANSION §8.2; docs/areas/shelf.md §1). Ashfall is the E to H columns from row 9 to
row 12, with a sliver in I. The land worth a map is six boxes: H10 and G10 along the Sound, the
Stair's foot and Cinderport; G11, Fire Mountain's flank with the vents; F11, Old Cinder and the
Ember Stone; F10 and E10, the Waste's road to the Wold. Behind them seven boxes of country are
parked (H11, H12 and G12 on the mountain's south slopes, E11 in the Waste, F9, G9 and H9 along the
shore; §4.10), and F12 and E12 are cut (§11).

Its edges:

- **North: the Ember Sound,** the sea along Ashfall, with Sheer Point across it to the north-east
  and Hearth Isle beyond. The Compact's ship from Kilnhaven comes in to Cinderport, whose port site
  is 206,277 (`src/content/atlas.ts`; #547) and whose steps are in the town (§4.4), a crossing open
  from the start for the fare (EXPANSION §2.2); the last crossing leaves from the same steps for
  Hearth Isle (via 228,236 to 252,188), Act V's.
- **East: the Sheer,** the cliff down the Whitespine's west side (x about 264 to 272), lettered at
  262,300. The Giants' Stair comes down it at 258,306 from the High Spine's I10 (272,306; #502), a
  road link open from the start and the only way over: a company that comes by land arrives here.
  The link's `from` is `firemount` on the plan while its foot lands in Cindercoast's H10 (§9).
  H10 is built (#510): I10's 0,20 meets its 31,20, road on both sides, and Ashfall is joined to the
  Whitespine overland (§4.2).
- **South: the rim,** under Fire Mountain's south slopes and the Waste's.
- **West: the Cinder Hills,** a hills ridge running north to south at x about 146 to 152 between
  Ashfall and the Glasswold, with the road to the Wold over them at 156,312 to 144,300 in E10,
  open from the start (#524, #517). The Wold's steppe lies beyond, Act IV's third area.

Fire Mountain stands at 204–226,326, a volcano ridge with an ash foot seven wide, and three lava
flows run from it: south-west from 212,326 to 188,366 through G11 into G12 and F12, south-east from
218,327 to 240,358 into H12, and west from 209,325 to 174,330 across F11, between Old Cinder and
the Stone's field. The vents open at 226,334 on its east flank, Grimsforge (Warlord's Forge, §10)
beside them at 230,330. The road runs from Cinderport's gate south-west through G10 to Old Cinder at
180,318, then west along F11's north edge to the Wold. No river: the Waste has none, and the water
is Scaldwell's (the Hot Springs, §10) at 240,300.

`node tools/worldmap.ts out.png --zones` paints it.

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

Nine maps: the Stair's foot (#510), Cinderport's box, which lists the area (#511), the town behind
its gate (#512), Fire Mountain's flank (#513), the vents and the iron corridors (#22), Old Cinder's
and the Ember Stone's box (#514) and the Waste's road, F10 and E10 (#517):

- **The Stair's foot** (H10, `cindercoast_h10`, core, band 24; #510): the Giants' Stair's last
  flights, cut along the Sheer's foot from I10's 0,20 to a landing on the black sand, where the step
  is said, and the pines under the Sheer to the south, where things fallen from the Stair lie. A
  track runs from the landing west across the sand, past Scaldwell and through the shore's vines to
  the west edge, where it comes out onto G10's vines. Scaldwell is pools in the ash, a bathhouse of
  planks with its keeper, a Rider with words only, the Riders' shrine and, beyond the pools, a rock
  outcrop where the water comes up, with a stoker shovelling at it. A camp under the Sheer, a cairn
  at the Stair's foot, a milestone where the track leaves the sand and a lookout on the dune.
  Four groups: beetles at the Stair's foot and toward the dune, strangler vines in the shore's first
  trees and the stoker, a heavy machine (§4.2).
- **Cinderport's box** (G10, `cindercoast_g10`, core, band 24–25; #511): the town's wall along the
  north edge, a block of building squares with its gate in its face, which opens into Cinderport
  (#512), and before it the trading ground where the Riders come down: horse-lines and their
  fires, a shrine, and their eldest, who tells the oldest story on this side of the sea. Roads run
  square to square from the gate's front to the north edge and out south-west through the vines to
  the west edge, a milestone at the fork. A stream runs from the north edge to the east edge,
  crossed on stones, and east of it lie the knoll over the stream and the shore's trees, hung with
  vines, where a clearing walled by the trees holds the factor's hide. The ash lies south of the
  ground, with a cairn where it begins. Four groups: beetles on the ash, strangler vines in the
  shore's trees, salamanders where the ash warms and a cinder drake with them (§4.3).
- **Cinderport** (`cinderport`, town, 16×16, band 24–26; #512): the town behind G10's gate, opened.
  A street runs from the gate in the south wall, 8,15, north to the quay over the harbour, with two
  cross streets, a square inside the gate, the square by the quay and the Compact's pier off the
  quay. Eight businesses, each a door into its room (#521): the inn, the temple, the armourer's, the
  chandler's, the Ash Yard that trains to 27, the Chart House and the Factor's House (the two halls)
  and the potter's. The ship and the last crossing land on the Compact's steps under the factor's
  house and the ride just inside the gate; Jago sells the ship at both quays, and the other two are
  sold by nobody yet. Four people speak with words only, and the town holds no secret (§4.4).
- **Fire Mountain's flank** (G11, `firemount_g11`, core, band 25; #513): the cone in the box's
  north-west, lettered volcano over the atlas's mountain with its mouth a vent, and three lava flows
  off it, two leaving west and one south-east, their crust bearing a company. The track comes down
  from G10's south edge between the mountain and the east edge, a shrine at its head, to Grimsforge,
  a block of black stone with its fire lit and the old warlord's heir at the anvil, and a camp in
  its lee where the scavenger sits. South of it the vents are three mouths in the ash, the middle
  one the way down to Meridian Camp, open since #22 built its first level; beside them, in a ring of
  rock against the east edge, lies the scavenger's hole, his second way down, open at its far end
  the same way. Five groups: ember salamanders on the track and on the cone's shoulder, two stokers
  with ember salamanders at the vents, a cinder drake alone on the south-east flow and, after the
  Stone, a sentry walking in from the Waste (§4.5).
- **Meridian Camp's vents** (`meridian_camp`, dungeon, the first of three levels of 32×32, band 25;
  #22): in by G11's middle mouth or up the scavenger's hole, a flue hall of iron under the three
  mouths, the Company's trail down the west flue to the stair down to the corridors, the grates
  with the stokers' rounds and, last, the stokers' furnace room, where the Ember Stone's first part
  lies (`ember_part1`). Four groups, a sentry among them once the Stone is lit
  (docs/areas/meridian_camp.md §4.1).
- **Meridian Camp's iron corridors** (`meridian_camp2`, dungeon, the second of three levels of
  32×32, band 26; #22): down the vents' stair onto four straight corridors of hot iron doubling
  back down the level, the flue walker on its round, the Company's second camp, cold, behind a door
  and a grave with a note, the drake's nest off the last corridor with the Brood Drake on its eggs
  and, at the corridors' end, the Ember Stone's third part (`ember_part3`) and the stair down to the
  camp, barred until the camp is built. Four groups, a sentry among them once the Stone is lit
  (docs/areas/meridian_camp.md §4.2).
- **Old Cinder's and the Ember Stone's box** (F11, `emberwaste_f11`, core, band 25–26; #514): the
  buried town's crater at the north edge, a pit seen across and never walked with seven roof-ridges
  standing out of it, and on its west lip an old Lightbearer beside the way down, barred until Old
  Cinder is built (#515). The west lava flow runs through the ash into the rock, crossed on a
  causeway of slag with a milestone at its end; south of it, on a field of cinders, the Stone stands
  half-built in its iron scaffold, its way down barred the same way (#516). In the rock a hermit and
  a camp, each in a cleft; on the crater's rim a cairn; at the field's edge a shrine; and in a spur
  of rock on the west edge the hollow where the Stone's builders left their tools. Four groups:
  cinder beetles below the crater, ash husks on its rim by night, a cinder drake on the flow and,
  after the Stone, two sentries on the ash between the causeway and the Stone (§4.6).
- **The Ember Waste's road** (F10 and E10, `emberwaste_f10` and `emberwaste_e10`, country, band
  24–26; #517): the road west from Cinderport's box, out of the vines and over the Waste's bare ash,
  past the Riders' ring and along the rocks of F10's south rows, then up the Cinder Hills of E10 by
  the notch where a Rider's waymark stands and down onto the steppe, the Wold's, where the world
  ends for now. In F10's north-west a rock outcrop with the Archdruid in its lee, words only; on the
  ash a cairn, a shrine and the drifts; on the Hills the cairns, all facing the steppe but one that
  looks back at the Stone, a grave. Three groups: cinder beetles and a cinder drake in F10 and two
  cinder drakes on the Hills' crest (§4.9).

Its atlas rows are charted in `src/content/areas/ashfall/atlas.ts`, the area's own `atlas` since G10
lists the area; until then `src/content/atlas.ts` spread them into the plan where its rows were, as
Saltreach's were before #170: the zones with their bands (Cindercoast 24–25, with H10 and G10 laid
on it and its crossing words on its row, §9, #511's 13, reworded by G11, #513's 15; Fire Mountain
25–26, with G11 laid on it; the Ember Waste 25–26, with F11 laid on it at 25–26, F10 and E10 at
24–26 and its crossing words on its row, §9, #517's 2 and 6), Cinderport at 24–26, built since #512
with its plate at the gate, 206,288; Old Cinder at 25–26 and the Ember Stone at 26 as planned plates
and Meridian Camp at 25–28, built since the vents (#22; the band is the union of its three levels');
the sites (Cinderport, its port site at 206,277 on G9's shore no longer planned; Fire Mountain,
Grimsforge and Meridian Camp, built on G11, and Scaldwell, built on H10, no longer planned; Old
Cinder and the Ember Stone still planned, marked on F11 over their barred ways down, §9, #514's 16;
the Sheer and the Cinder Hills, the plan's, §10) and its links: the Stair down the Sheer, the ship
from Kilnhaven, the town's way in (moved from the site to the gate, §9, #512's 13), the three
dungeons' ways in, the road to the Wold and the last crossing. H10 is first on Cindercoast's row
(§9, #510's 2). The corridors' plate is a second row, `meridian_camp2` at 226,346, six squares south
of the first (docs/areas/meridian_camp.md §8, the corridors' 15).

Its row on the curve and its step on the gear ladder are in (#542): the row in
`src/content/progression.ts` (band 24–26, next 26, window 5,500), owed to #446 while the area is
built box by box, with the six boxes', the vents' and the corridors' 18,581 xp a member and 7,500
gold the clear's floor, which Cinderport leaves as it is, a town paying nothing (§8); and the step
in `src/content/areas/ashfall/items.ts`, the Area's own since G10 lists it (`ITEMS_AHEAD`,
`src/content/index.ts`, held it until then), so that the harness and the gate dress by it:
Cinderport's armourer's eight wares (`ARMOURER`, §4.4), each owed to the armourer until #512 sold it
there. The stone cure is in the table too (#546): the Quickening Draught (`CURES`), which the company
carries from 25, sold at Cinderport's chandler's since #512 and owed to the Riders' trader at Akordu
(#526). The boxes' new finds are there as they come: G11's Great Axe +2 (`scavengersAxe`, §9, #513's
12), E10's Horn Bow +2 (`graveBow`, §9, #517's 11) and the vents' Ember Stone's first part,
`ember_part1` (§9, #22's 1), and stokers' parts, `stoker_firebar` and `stoker_blade`
(docs/areas/meridian_camp.md §8, the vents' 5), which no shop buys; F11's Chain Mail +2 is the
game's own (`chain+2`, Sunderwood's), no new item (§9, #514's 12). The corridors add the Stone's
third part, `ember_part3` (§9, #22's 1), the Company's Meridian Mail +3 (`meridian_mail`) and the
flue walker's parts, `walker_damper` and `walker_iron`, which no shop buys
(docs/areas/meridian_camp.md §8, the corridors' 7 to 9).

Its ground (#543): vines (`&`), walked through as the woods are, the shore's trees hung with
creepers; the volcano (`V`) and a vent in it (`@`), the mountain's rock to walk into, see and climb,
a vent's fire in its lip and its smoke going up; lava is the `!` there was. The scaffold drafts H10
with its 207 squares of vines (187 as built, §4.2) and G11 with its 102 of lava; the atlas lays the
cone as mountain, so #513 lettered it `V` and its mouth `@` over the draft (docs/SLICE.md).

The Ember Stone counts for the Hearth (#548): its row in `src/content/stones.ts` restores it on
`q_ember_lit`, the flag the Stone's dungeon sets the moment its third part is in and it lights
(#516, §9). Nothing sets it yet, so it is owed to the chapter (#518) in `UNSET`
(`tools/tests/quests.ts`) and the first map that sets it drops the entry there. The sentries stand
`after` that flag on every box (#449): the Hearth's check (`tools/tests/stones.ts`) holds a fixture
box with a group of the test elite at the Sentry's level `after` it, not there before the Stone is
lit and standing, in the way and fought, after. G11 places the first, one sentry (#513, §9's 10),
F11 a group of two (#514, §9's 10), and the words on the roads and in Cinderport that say they are
not what they were are the boxes' and #449's.

Its crossings are written (#547), in `src/content/crossings.ts`, each on its link of the atlas with
its fare, its days and its hours, the same either way (§4.4, §9): the Compact's ship from
Kilnhaven, whose Cinderport end says where she ties up; the Rider's ride, on a Rider's horse
between Cinderport's gate and Akordu in the Wold; and the last crossing over the Sound to Hearth
Isle. The Cinderport ends are landed (#512), the ship's and the last crossing's on the Compact's
steps and the ride's just inside the gate (§4.4), and the ship runs, sold by Jago at both quays.
The ride and the last crossing wait on their far ends, Akordu (#526) and Hearth Isle (Phase 1.5),
and are sold by nobody: nothing is sold toward a place not built (§9, #512's 5).

All nine of its monsters are drawn ahead of the area (#520): the Strangler Vine, the Cinder Beetle,
the Ember Salamander and the Ash Husk, on the old wood's, the spider's, the salamanders' and the
skeleton's frames; the Cinder Drake and the Old Drake on the drakes', new; and the Stoker, the
Sentry and the Sentinel on the heavy machines', new (`src/ui/monsters/machines.ts`; §7). They are in
`src/content/areas/ashfall/monsters.ts`, the area's own since G10 lists it (`AHEAD`,
`src/content/index.ts`, listed them until then), and each was owed in `UNPLACED`
(`tools/tests/maps.ts`) to the box that first places it: G10 places the vine, the beetle, the
salamander and the drake (#511), G11 the stoker and the sentry (#513, §9's 10) and F11 the husk
(#514, §9's 13); the Old Drake is owed to #515 and the Sentinel to #516, though listing the area
records all nine in `src/content/shipped.json`. G11 restates the stoker and the sentry on the line
as it was made again (§9, #513's 17), and F11 the husk (§9, #514's 13); H10 places the stoker too,
as restated (#510, §9's 10).

The rooms are drawn (#521), one to each business of Cinderport, ahead of the town as Rime Lodge's
were. `src/content/areas/ashfall/interiors.ts` lists them, the Area's own `interiors` since G10
lists the area (`ROOMS_AHEAD`, `src/content/index.ts`, merged them until then);
`tools/tests/maps.ts` owed each to #512 until a business there opened into it, and each does now;
§4.4 names the ids. They are a scene to a file in `src/ui/interiors/ashfall/`, what they share in
`basalt.ts`: basalt in pale lime, limewashed above the sills; ash along the foot of every wall;
vines hung over the glass; the cup in the old Cinder style and two views: the Sound, the Compact's
ship at the quay and the column of light beyond, and the mountain, smoking by day and red at its
mouth by night. The inn, the fire under a mantel of the potter's cups, the stair up to the
rooms and the broom at its foot with the ash it swept; the temple, a nave between two columns, a
basin of Scaldwell's water steaming on the altar under the round window where the column of light
stands, the healer's cot and a brazier; the armourer, a cinder drake's hide laced on its frame, the
Drakeskin Coat on its stand, the Basalt Shield on the wall, the Flamberge, the Slag Mace, a Battle
Staff and the Ashwood Bow in the rack and the forge under its hood; the chandler, the Riders'
saddle on its trestle over a cloth in red and ochre bands, bridles and a halter on the pegs, lamp
oil in a tapped cask by the clay lamps it burns in and the fish off the racks tied in bundles; the
trainer's yard, ash raked inside the wall with the vines come over it, a pell of driftwood wrapped
in vine rope, the arms in their rack, the butt and fire-baskets for the dark; the Cartographers'
hall, the far side pinned to the limewash with the land behind the coast left blank, the Meridian
journals' shelf with three and a gap for the fourth, the charts rolled in their pigeonholes and one
spread on the table; the Compact's house, the ledgers in one binding, the counting table with its
scales and the manifests on their spike, the strongbox, bales under the window on the quay and,
apart in the corner, a crate under the Helmstow customs seal; the potter's, the old Cinder cups on
the shelves, glazed and bare, a board of new ones drying, the kiln a beehive of brick in the back
wall and the kick wheel with a cup on it. §9 has the decisions. Nothing else is built.

The systems it waits on are the rest of #442's: sweep with fire (#545), the ship to Cinderport, the
Riders' ride and the last crossing (#547) and the bot grown to the band (#549); the giants' toll
(#544) and stone (#546) are its neighbours'. Meridian Camp is #22, parked until #443 unparks it.

## 4. What is still to build

All of it but H10, G10, the town, G11, F11, F10 and E10, built (#510, §4.2; #511, §4.3; #512, §4.4;
#513, §4.5; #514, §4.6; #517, §4.9): 10,736 squares of land, 9,228 of them walkable, the plan's
figures (§1). On the grid the plan is six boxes, two dungeons and a town, and the boxes hold 5,462
of those squares, 5,120 walkable; the seven parked behind them hold 4,454 (§4.10), the cuts and the
sliver about 700 (§11):

| Box | Name | Zone | Kind | Band | Land | What is there | Its step of the quest | Issue |
|---|---|---|---|---|---|---|---|---|
| H10 | The Stair's foot | Cindercoast | core | 24 | 1,009 (ash 644, vines 207, grass 82, pine 56), 15 shallow | the Stair down the Sheer at 258,306; Scaldwell at 240,300; the vines; the gentlest groups | the far side reached | #510, built |
| G10 | Cinderport's box | Cindercoast | core | 24–25 | 977 (ash 618, vines 236, grass 74), 47 shallow | the town's gate at 206,288 on the north edge; the trading ground; the road south-west | the eldest's story | #511, built |
| | Cinderport | | town, 16×16 | 24–26 | | eight businesses; the two halls; the ship; the trainer to 27 | the port; the last crossing | #512, built |
| G11 | Fire Mountain's flank | Fire Mountain | core | 25 | 1,024 (ash 641, mountain 281, lava 102) | the cone at 215,326; the vents at 226,334; Grimsforge at 230,330; the drakes | the vents | #513, built |
| F11 | Old Cinder's and the Ember Stone's box | the Ember Waste, Fire Mountain, Cindercoast | core | 25–26 | 1,024 (ash 664, rock 301, lava 46) | Old Cinder at 190,318; the Ember Stone at 176,342; the west lava flow between | the Stone seen; the Stone lit | #514, built |
| | Old Cinder | | dungeon, two levels of 16×16 | 25–26 | | the buried town and the Old Drake; the undercroft and the lamp | a part | #515 |
| | The Ember Stone | | dungeon, one level of 16×16 | 26 | | the half-built Stone; the hand-in; the Sentinel | the Stone lit | #516 |
| F10, E10 | The Ember Waste's road | the Ember Waste, Cindercoast, the Wold | country | 24–26 | 1,024 (ash 730, vines 209, road 44, rock 41) and 1,024 (ash 443, hills 280, steppe 211, road 49, grass 39, lava 2) | the road west to the Wold at 156,312; the Cinder Hills; the Druid's trainer | none | #517, built |
| | The chapter | | | | | The Window | | #518 |
| | Side quests | | | | | #56's 49, 50 and 52 | | #519 |
| | The nine drawings | | | | | MONSTERS §8.2's roster | | #520 |
| | Cinderport's rooms | | | | | eight | | #521 |
| H11, H12, G12, E11, F9, G9, H9 | The country behind | Fire Mountain, the Ember Waste, Cindercoast | country, parked | 25–26 | 983, 824, 674, 711, 509, 286, 467 | the mountain's south slopes and the lava's ends; the Waste's south; the Sound's shore | none | #522 |

The core is the four boxes that hold a step of the quest (H10, G10, G11 and F11), built at full
density; the rest is country, built to the looser floor with the wilderness features (EXPANSION
§2.1 (b) and §5.3, #45). The road's two country boxes are built with the act; the country behind
is parked until the owner has played it (#443, call 9). The bands rise from the way in, 24 at the
Stair's foot, to 26 at the Stone and Old Cinder's crater, as the gate asks (EXPANSION §5.2), and
each box holds a group at the top of its band for the curve (§7).

**Boxes of more than one zone.** F11 is the Waste's (951) with a corner of Fire Mountain (40) and
the road's end of Cindercoast (33), though the scaffold counts it the Waste's 678 and Fire Mountain's
346 (§9, #514's 1); F10 is the Waste's (573) with Cindercoast's (451); E10 is the
Waste's (219) with the Wold's (805), and the Wold's E10 is the same box: #517 laid it, for the Waste
(§9, #517's 13). A map is its whole box (EXPANSION §8.2): each is built to its edges and laid in one
zone, and the zone a square belongs to decides only its crossing line (#166) and its band.

**The order** is the Stair's, and the quest's: H10, the only box that meets the Whitespine; G10 and
Cinderport; G11 and the vents; F11 with Old Cinder and the Stone; then F10 and E10. Road order holds
(#443, call 6), but Cinderport's box may begin by sea, the second area in flight, once the
Whitespine's first box is in. G10 began it (#511), with no neighbour built, so its way in is the
gate's front (§9, #511's 4); H10 (#510) is built beside it, and a company on foot comes in at the
Stair's foot (§9, #510's 2); G11 follows it over G10's south edge (#513, §9's 4) and F11 over F10's
south edge, G11's west edge a second way in (#514, §9's 2). Building waits on #442's systems (§3);
the briefs and the drawings do not.

The places, as the atlas and the docs have them:

| Place | Box | What the docs say | On the atlas |
|---|---|---|---|
| The Giants' Stair | H10 | the road over the High Spine and down into Ashfall, past the giants (DESIGN §9); its head is the Whitespine's (#502) | a road link, 272,306 to 258,306 |
| Scaldwell (the Hot Springs) | H10 | the springs that went cold the day the Anvil Stone was cut (#56's 49) | a springs site at 240,300 |
| Cinderport | G10, and its own map | the far side's port, where the last crossing leaves (DESIGN §9); the Cartographers' second hall and the Compact's factor (#443, call 7); trains to 27 (DESIGN §5) | a port, its gate at 206,288 and its site at 206,277 on G9's shore |
| Fire Mountain | G11 | the volcano; its vents are the Underdeep's exhaust and the way down (DESIGN §9) | a volcano at 215,326; a ridge at 204–226,326 with three lava flows |
| Meridian Camp | G11, and below | the Meridian Company's last camp, Oriel Fane and the window (DESIGN §9, §10.3, STORY); three levels of 32×32 (#443, call 4) | a dungeon at 226,340, its way in at 226,334; its first two levels, the vents and the iron corridors, built (#22) |
| Grimsforge (Warlord's Forge) | G11 | the Barbarian's third prestige, by the vents' mouth (DESIGN §5, #448) | a forge at 230,330 |
| Old Cinder | F11, and below | the town the mountain buried, its people cast in ash (MONSTERS §8.2); the Paladin's third (DESIGN §5); the founding stone (#56's 50); the Old Drake | a planned dungeon at 190,324, its way in at 190,318 |
| The Ember Stone | F11, and below | never finished; the company completes it with parts from below and the Underdeep notices (DESIGN §9); the Druid's third (DESIGN §5); the Sentinel (MONSTERS §8.2) | a planned dungeon at 176,348, its way in at 176,342 |
| The Cinder Hills | E10 | the ridge between Ashfall and the Glasswold, the Wold's road over it | hills, x about 146 to 152 |

### 4.1 The briefs

As Saltreach's (docs/areas/saltreach.md §4.1): drafts for the owner, each settled in its issue,
written before any box of Act IV is built. A core box is held to the Foreland map's density (about
nine features, ten groups and four ways in or out to 870 open squares) and a country box to about
half, with the wilderness features (#45); no more than one point in four is a sign.

- **Encounters** are MONSTERS §8.2's roster and fights. A group is about one of MONSTERS §4.4's
  standard encounters, a kill pays each member by the monster's level against theirs (#159), and the
  figures below are for a company at the box's band.
- **Pay.** The area owes 19,467 xp a member (§8). The shares below are the area's own maps';
  Meridian Camp's two upper levels, which the chapter walks for two of the Stone's three parts, pay
  their own under #22.
- **Side quests** are #56's 49, 50 and 52, placed as §6 has them (#519).
- **Finds** are the ladder's next step (#542): the act's gear at Cinderport's armourer by 25, the
  same with a plus in the boxes and the dungeons by 26. No find or ware is dearer than the band's
  window, 5,500. **Lines** are drafts for the builder, two lines of the log each (DESIGN §11).

### 4.2 H10, the Stair's foot (#510): core, band 24

- **Purpose.** Act IV's second ground, and the far side reached: the Stair's last flights down the
  Sheer onto black sand, Scaldwell's steam, the vines along the Sound, the area's gentlest groups
  and the crossing line that tells a company under the band how the land feels (#166). It opens the
  Whitespine's I10 for the Stair (#502).
- **Landmarks.** The Sheer along the box's east edge, closed as mountain, with the Stair's foot at
  258,306 in a notch; the Sound along the north with black sand under the cliff; Scaldwell at
  240,300, pools in the ash with a bathhouse of planks beside them; the vines' shore west toward
  Cinderport; the track along it.
- **Points of interest,** about nine features and eight groups:
  - the Stair's foot, and the line that says what is above it: the step (§5);
  - a milestone where the track leaves the sand: CINDERPORT 5;
  - the bathhouse keeper, a Rider, who says the springs went cold and came warm again (#56's 49);
  - the springs' source, up a gully in the Sheer's foot, and the stoker at it (§6);
  - a camp on the sand (#45), a cairn at the notch (#45), a shrine of the Riders' by the pools (#45);
  - a lookout on the dune's crest, north over the Sound to Sheer Point.
- **Encounters.** Cinder beetles on the sand (two groups, the first past the notch the area's
  gentlest); strangler vines in the shore's trees, which never roam; the stoker at the source, a
  quest's fight (§6); a cinder drake over the shore at the box's far end, the hardest, at 25
  (proposed, §7).
- **Quests.** The step. What the Springs Bring Up (§6).
- **The secret and its hint.** A cleft in the Sheer's foot south of the Stair, behind the steam,
  where what the giants let fall from the Stair comes to rest: coin of every age of the road and a
  Plate Mail +2. The hint: the ash along the cliff's foot is trodden to a path that ends at the rock.
- **Lines:** the foot, the step: *The last flight ends in black sand. Behind, the Sheer goes up out
  of sight; ahead, a mountain smokes over everything.*
- **New here.** Ash and vines underfoot (#543); the far side's weather; a company told it is early.
- **Finds.** The Plate Mail +2 in the cleft.
- **Pay.** About 1,700 xp a member.
- **As built** (#510, 9 October): the brief's places, with four groups for its five, laid whole in
  Cindercoast at 232,286, core, band 24–24 (§9, #510's 1). The map starts at 31,20 facing west, the
  square the Stair comes onto from I10's 0,20: the two edges meet square for square, road on both
  sides, and Ashfall is joined to the Whitespine overland (§1). The Sheer is cliff at columns 30 and
  31, rows 0 to 19, closed, meeting I10's cliff column; the Stair's last flights are road at 27 to
  31,20 along its foot, with the notch's lip rock at 28,19, and the landing, 26,20, is the atlas's
  link end (258,306), where the step's event, `h10_foot`, says the brief's line. South of the Stair
  the Sheer is I10's, and its ground goes on as pines at 28 to 31, rows 21 to 31 (§9, #510's 3). The
  Sound along the north is H9's, so the north edge is the vines and the shore's grass, and the black
  sand is the atlas's ash. The track runs from the landing west along rows 20 and 21, north-west to
  15,13, west to 10,13, north to 10,11 and west along row 11 to the west edge at 0,11 (232,297),
  where it comes out onto G10's vines at 31,11 and stops: G10's east edge has no road and the atlas
  none at the seam, so no road runs into G10 (§9, #510's 4). Cindercoast's crossing words are walked
  down the Stair, the warning at 21, the harder line at 22 and the land's name alone at 24, and
  nothing is said going straight back up (§9, #510's 13). Scaldwell (240,300, local 8,14) is six
  pools of shallow water in the ash, 7 to 9,15 and 8 to 10,16, the event `h10_pools` on the site's
  square; the bathhouse is a block of building squares at 4 to 6,12 to 13 with no interior, its
  keeper at 7,13 a Rider with four lines and words only (#56's 49, whose quest is #519's), and the
  Riders' shrine at 11,15 gives endurance (§9, #510's 6). The stoker stands at 6,17 beside the rock,
  one, not roaming, seen first from the track (`h10_shovel`, 14,15), a plain group until #519 makes
  it 49's fight (§9, #510's 7). The secret is the issue's, the springs' source down a vent the water
  comes up, and not the brief's cleft south of the Stair, which has no Sheer of H10's to stand in: a
  secret door at 8,18 in a rock outcrop (6 to 10,18 to 21) beside the pools, the vent behind it at
  8,19 (`h10_vent`) and the hoard at 8,20 (`h10_vent_hoard`), 750 gold and the brief's Plate Mail
  +2, the brief's "coin of every age" being the vent's line. The hint is the brief's own, a path
  trodden flat in the ash up to the rock and ending at it (`h10_trodden`, 8,17), and the keeper
  hints it in words: "Some days it is not there." What the giants let fall is seen in the pines
  under the Sheer (`h10_fallen`, 29,27) (§9, #510's 5). The cairn at the Stair's foot, 27,21, holds
  250 gold and a Sapphire Vial. The brief's other places are each a feature: the camp Under the
  Sheer (27,17), the milestone where the track leaves the sand for the vines (11,12, CINDERPORT 5)
  and the lookout on the dune's crest (20,1, Sheer Point); and for density, things seen, from the
  Sheer's face and a goat on it to a crust on the ash, black glass and a shod horse's bones (§9,
  #510's 14). The stream is the atlas's: in at the south edge at 4 and 5,31, out at the west edge
  at 0,22 and 23 into G10's, and crossed on stones at 3 to 4,29, so the corner west of it, with its
  heron (`h10_heron`, 1,29), is walked within the box (§9, #510's 12). The north and south edges
  end the world against H9's shore and H11, pinned in `tools/tests/outdoors.ts` with void past
  them. Its 1,024 squares are ash 554, vines 187, grass 78, pine 68, cliff 41, road 41, shallow 20
  (the stream 14, the pools 6), rock 18, hills 6, building 6, the vent's floor 2, stones 2 and the
  secret door. Four groups: beetles, 3, just past the Stair's foot, 21,23, the area's gentlest, at
  24; beetles, 4, on the sand toward the dune, 21,6; strangler vines, 4, in the shore's first
  trees, 14,10, which do not roam; and the stoker, 1, the box's group at 25. No cinder drake is
  placed (§9, #510's 8). It departs from the brief in the band, 24 to 24, and the groups, four for
  its five (§9, #510's 1 and 8); in the secret, the vent for the cleft (§9, #510's 5); in the pay,
  2,449 xp a member for about 1,700 (§8); and in the track, which stops at G10's vines (§9,
  #510's 4). The step's entry and goal are #518's, and 49's quest is #519's.
  - **Measured.** A company at 24 wins every fight and manages 10.21 fights to a rest, inside the
    aim of 9 to 11, with 17.3% of its days ending in a fight broken off; it walks Cindercoast's
    road, past the beetles at the Stair's foot and then G10's beetles and salamanders, every time.
    H10 pays 2,449 xp a member and 1,000 gold. Two under, at 22, it wins every fight too, owed to
    #18 as the Whitespine's boxes' is, and the two groups nearest the Stair are won at 22 every
    time. Density 100.0% within 8 steps and the furthest 8, with no sign among its 30 points. The
    walkthrough wins every group at 24, ten fights in ten. It claims the springs as new, the heavy
    machines being G11's claim (§7).

### 4.3 G10, Cinderport's box (#511): core, band 24–25

- **Purpose.** Cindercoast's step, the port from outside: the track's end at the town's gate on the
  box's north edge, the trading ground where the Riders come down and the road south-west for Old
  Cinder and the Wold.
- **Landmarks.** The town's wall along the north edge with its gate at 206,288, the way into #512;
  the harbour and the site at 206,277 are G9's shore, seen over the wall; the trading ground outside
  the gate, horse-lines and the Riders' fires; the vines thick along the shore east of the town; the
  road out of the ground south-west over the ash.
- **Points of interest,** about nine features and seven groups:
  - the gate, and the trading ground: the step (§5), where the eldest tells her story;
  - a milestone at the road's start: OLD CINDER 4, THE WOLD 6;
  - a shrine of the Riders' on the ground (#45), a camp beside the horse-lines (#45), a cairn where
    the ash begins (#45);
  - the chandler's drying racks under the wall, and the potter's clay pit in the vines (#56's 50);
  - a hermit under the vines who came down from the mountain, as the first did.
- **Encounters.** Cinder beetles on the ash south of the ground (two groups); strangler vines in the
  shore's trees east of the gate; ember salamanders where the ash warms toward G11 at the box's far
  end, the hardest, at 25 with a cinder drake (proposed, §7).
- **Quests.** The chapter's goals point into the town (§5). The Founding Stone's giver is in the
  town (§6).
- **The secret and its hint.** The factor's hide in the vines east of the gate, where crates under
  the Helmstow customs seal wait for a boat that comes by night: shards for the causeway (DESIGN
  §9), a Long Sword +2 among them. The hint: the vines there are cut back, and the cut ends are
  fresh.
- **Lines:** the ground, the step: *Horses on the ash outside the gate, and fires. The Riders come
  down to trade, the gate-ward says, and their eldest talks.*
- **New here.** A port on the far side; the Riders seen.
- **Finds.** The Long Sword +2 in the hide.
- **Pay.** About 1,500 xp a member.
- **As built** (#511, 9 October): the brief's places, with four groups for its seven, laid whole in
  Cindercoast at 200,286, band 24–25 (§1). The town's wall is a block of building squares along the
  north edge, rows 0 to 2 and columns 4 to 13, with the gate at 6,2 (206,288, Cinderport's plate) in
  its face; the harbour and the site at 206,277 are G9's, seen over it, and the gate's line and the
  knoll's say masts (§9, #511's 2). The gate was barred, `GATE` exported and not in `exits`, its
  square a building and `g10_gate` at its front, 6,3, until #512 listed it, opened the square and
  dropped the event (§9, #512's 12); its way back lands on 6,3 facing south (§9, #511's 3). No box
  beside G10 was built; the ship lands in the town (#547), so the way in is the gate's front: the
  map starts at 6,3 facing south (§9, #511's 4).
  The roads are the atlas's, made to meet it at the edges: from the
  gate's front west under the wall, up the wall's west side to the north edge at 3,0 (the atlas's
  road into G9 at 203,285), and out south-west through the vines to the west edge at 0,7 and 0,8
  (F10's road at 31,7 and 31,8); the milestone, OLD CINDER 4, THE WOLD 6, stands at the fork, 3,4
  (§9, #511's 5). Its north edge ends the world against G9, pinned in `tools/tests/outdoors.ts` with
  void past it; the west meets F10 (#517, §4.9), road to road at rows 7 and 8, the south meets G11
  (#513), the ash either side of the mountain's foot (§9, #513's 4), and the east meets H10 (#510,
  §4.2), the vines, the ash and the stream at rows 22 and 23, square for square but for the track at
  row 11 (§9, #510's 4). The stream is crossed on stones at 18 to 19,3 by the ground and at 26,14 on
  the ash (§9, #511's 6). On the ground, the step's event at 8,4
  (`g10_ground`) and the eldest at 11,5, who tells the story in three lines (§9, #511's 11); the
  Riders' shrine at 10,3 (speed), their fires a camp at 13,4 by the horse-lines (`g10_horses`,
  16,5), the chandler's racks under the town's east wall at 14,1 and the knoll over the stream at
  21,2; the cairn where the ash begins at 13,7, with 300 gold and a Sapphire Vial; the potter's clay
  pit at 9,12 and the hermit under the west vines at 4,10, words only (§9, #511's 12). On the ash,
  for density, the Riders' fire-ring (8,18) and their tracks west (3,22), a drake turning over by
  day (`g10_overhead`, 18,17), a boulder the mountain threw (28,25), the ash warming (14,26), the
  stream (24,13) and steam to the east (30,18). Four groups: beetles, 4, on the ash south of the
  ground, 15,9, the nearest, at 24; strangler vines, 4, in the shore's trees east of the stream,
  26,8, which do not roam; ember salamanders, 4, where the ash warms, 21,24; and one cinder drake,
  26,27, the box's hardest, at 25 (§9, #511's 7). The factor's hide is a clearing walled by the
  shore's trees, 27 to 30 by 1 to 3, its mouth a secret door at 27,2 drawn as a tree. The hint is
  the vines cut back with the cut ends fresh (`g10_cut`, 26,2); inside, the crates under the
  Helmstow customs seal (`g10_crates`, 28,2), with shards of every colour in them, seen and never
  said, and the chest (`g10_hide`, 29,2): the Long Sword +2 and 600 gold (§9, #511's 10). The cairn
  and the hide hold 900 gold between them. It departs from the brief in the groups, four for its
  seven, for the pay and the gate (§9, #511's 7); in the gate, barred until #512; and in the step's
  line, which reads "on the grass", the ground being the atlas's grass (§9, #511's 11). The step's
  quest and goal are #518's, and Cindercoast's crossing words, on its zone row, are walked by G11
  and reworded there (§9, #511's 13, #513's 15 and 16).
  - **Measured.** A company at 24 wins every fight and manages 10.88 fights to a rest, inside the
    aim of 9 to 11, with 15% of its days ending in a fight broken off; it walks Cindercoast's
    road, past the beetles and then the salamanders, every time. G10 pays 2,449 xp a member and 900
    gold. Two under, at 22, it wins every fight too, owed to #18 as the Whitespine's boxes' is.
    Density 97.3% within 8 steps and the furthest 12, with no sign among its 26 points. The
    harness's two drakes at 25 are won every time in 5.5 rounds, 10.3 fights to a rest (10.25
    asked). It claims the drakes and the vines underfoot as new (§7).

### 4.4 Cinderport (#512): town, 16×16, band 24–26

- **Purpose.** The act's second town and the road's last: the far side's port, the Compact's
  landfall, the Cartographers' second hall, where three classes are sent to their third prestige
  and where the last crossing leaves. It sells and teaches what the band needs (EXPANSION §4) and
  trains to 27, the third prestige's level (DESIGN §5).
- **Businesses,** each with a room of its own (#521), the `interior` its feature names given with
  it. No spell hall: tier 7 is Rime Lodge's (DESIGN §7).
  - The inn (rest). Interior: `cinderport_inn`.
  - The temple, cures and raising at the band's price. Interior: `cinderport_temple`.
  - The armourer, the act's gear step (#542, by 25). Interior: `cinderport_armourer`.
  - A chandler, provisions, lamp oil and the stone cure, the Quickening Draught at 2,000 (#546).
    Interior: `cinderport_chandlery`.
  - A trainer's yard, to 27. Interior: `cinderport_yard`.
  - The Cartographers' hall, its map of the far side on the wall and the Meridian journals' shelf
    (#443, call 7). Interior: `cinderport_cartographers`.
  - The Compact's house, the factor's. Interior: `cinderport_factor`.
  - The potter's. Interior: `cinderport_potter`.
- **People.** The harbourmaster and the ship's master (#547); the Cartographers' guildsman, whose
  line ends at Meridian Camp (#56's 51); the Compact's factor, whose runner is #56's 54's; the
  potter (#56's 50) and the smith (#56's 52); the Riders' eldest on trading days, at the ground
  outside the gate (§5); the mason of #56's 48, who wants passage.
- **Quests.** The chapter's goals (§5); The Founding Stone and The Shovel That Does Not Blunt given
  here (§6); the two halls' quests (§6); the seeking quests for the third prestiges (#448).
- **The ship** (#547): from Kilnhaven's quay to Cinderport's and back, 600 gold and two days, a
  fare, never a favour, halved here for a member of the Compact as Kitto's boat is
  (docs/areas/saltreach.md §4.9); the last crossing to Hearth Isle from the same steps, Act V's, 350
  and a day, open to anyone with the fare (EXPANSION §2.2). The Riders' ride west to Akordu, 325 and
  a day, leaves from the gate by the trading ground (#547, §9). The town writes where each puts a
  company down, on its ends in `content/crossings.ts`: the Compact's steps, the same steps and just
  inside the gate. It sells each by a person whose `passage` is `sells('cinderport', ...)`: the
  ship's master, the harbourmaster and a Rider.
- **Lines:** the quay: *The Compact's ship rides at the quay with Kilnhaven's mark on her. Beyond
  the Sound, a column of light.*
- **New here.** A guild hall with a map of the far side; a trainer to 27; the last crossing seen.
- **Pay.** About 600 xp a member in the halls' quests.
- **As built** (#512, 9 October): the brief's eight businesses and the quay, laid in a 16×16 plate,
  Kilnhaven's form turned on its side. The gate is in the south wall at 8,15, and G10's `GATE`
  (206,288) lands on 8,14 facing north, where the town starts. The street runs from the gate north
  to the quay along the north side, over the harbour (G9's water, the Sound past the wall), with
  two cross streets, a square inside the gate, the square by the quay and the Compact's pier off the
  quay, 13,1 to 2 (§9, #512's 1 and 2); banners hang on the wall either side of the gate, 7,15 and
  9,15 (§9, #512's 17). The temple, 4,5, stands on the square by the quay and the inn, 9,5, across
  the street from it; the Chart House is at 3,8; the potter's at 7,9 and the armourer's across the
  street from it at 9,9; the Factor's House at 13,4 over the Compact's steps; and the yard, 2,12, and
  the chandler's, 11,13, either side of the square inside the gate. The ship and the last crossing
  land on the Compact's steps, 13,2 facing south, and the ride just inside the gate, 9,14 facing
  north, by the Riders' rail, with the Rider at 9,13 (§9, #512's 3). Jago, 14,3, is the ship's master
  on both quays and sells her back to Kilnhaven's steps, halved for a member of the Compact;
  Morwenna the harbourmaster, 11,3, has the last crossing and the Rider the ride, and both sell
  nothing until their far ends are built (§9, #512's 4 and 5). The Chart House and the Factor's
  House are persons with rooms, as the Keel is, each offering and paying its Guild's one ladder, the
  Fence's rung among it, with no quest added (§9, #512's 6); the potter's is a person with a room and
  no ware (§9, #512's 7). Gorran the smith, Jenifer the potter, Cador Lusk of the Cartographers'
  Guild and Hendra the factor speak with words only, for #519, #635 and #448 to give their quests and
  choices (§9, #512's 8). The inn takes 55 a head, the armourer's and the chandler's sell at list,
  the temple charges the engine's and the yard trains to 27 (§9, #512's 10); the chandler's stock is
  the Act III provisioners' set and the Quickening Draught (§9, #512's 11). Thirteen events carry the
  rest along the street, the lanes and the quay, the quay's line among them, where the street meets
  the quay, 8,3 (§9, #512's 16). The town holds no secret, its contract asking none (§9, #512's 15).
  It departs from the brief in the people it does not place, the Riders' eldest, who is G10's, on the
  trading ground, and the mason of #56's 48, who is #504's (§9, #512's 9); in the ride and the last
  crossing, which are sold by nobody yet; and in the halls, which add no quest. G10's gate is opened,
  `g10_gate` dropped and the atlas's planned way into the town met at it (§9, #512's 12 and 13), and
  the outdoors reach walk seeds a town's ways out, so that the ship's landing reaches G10 and
  `CUT_OFF` is empty (§9, #512's 14).
  - **Measured.** Every open cell is reachable from the start (112 of 112) and the Ash Yard teaches
    to 27. Density 100.0% within 7 steps (86 of 86, 78 needed) and the furthest 4, with no sign among
    its 25 points; its 21 events, labels, landing lines and warnings are all two lines. A town pays
    nothing, no xp and no gold (§8). The gate check's boat now lands through the town and puts the
    company down at 6,3 in G10, and the groups nearest it, the beetles and the vines, are won at 22
    as often as the median group or more. The outdoors walk reaches every open square, 43,915 of
    43,915, G10's 945 among them. The walkthrough goes in and out at the gate and spends a night;
    buys the step, the Draught and a stone lifted at 2,000; trains to 27; joins both halls' ladders,
    the Fence's rung paid at the factor's house; and sails to Kilnhaven and back, 600 gold and 300 for
    a member of the Compact, finding the ride and the last crossing unsold.

### 4.5 G11, Fire Mountain's flank (#513): core, band 25

- **Purpose.** Fire Mountain's step: the cone, the vents like chimneys in its east flank, the
  stokers walking out on the ash and the drakes over the slopes. The way down to Meridian Camp
  (#22) and the Barbarian's trainer at its mouth.
- **Landmarks.** The cone at 204–226,326 in the box's north-west, mountain with the volcano's
  mouth lettered at 215,326, its ash foot round it; the south-west and south-east lava flows
  leaving the box; the vents at 226,334, three mouths of iron in the ash with heat coming off them,
  the way into #22; Grimsforge at 230,330, a forge of black stone with its fire lit; the track down
  from G10 and the Hills' line on the west.
- **Points of interest,** about nine features and nine groups:
  - the vents' mouth: the step (§5);
  - Grimsforge, and the old warlord's heir at the anvil, the Barbarian's third (#448);
  - the furnace-draught, a vent that breathes and is not a way in;
  - a camp in the lee of the forge (#45), a cairn on the ash foot (#45), a shrine at the track's
    top where the stokers' tracks begin (#45);
  - the scavenger's hole beside the forge (#56's 52, §6);
  - a lookout on the cone's shoulder, over the Waste to the Stone.
- **Encounters.** Ember salamanders on the slopes (two groups); cinder drakes on the flows (two,
  one alone); the vents' fight at the mouth, two stokers with ember salamanders, where fire is
  useless and lightning the answer (MONSTERS §8.2), the hardest, at 25–26.
- **Quests.** The step. The Shovel That Does Not Blunt's scavenger (§6). The Barbarian's quest
  goes down from here (#448).
- **The secret and its hint.** The scavenger's hole, a second way into the vents' first level that
  comes out behind the stokers' furnace room (#22), with his finds in it: grey parts, and a Great
  Axe +2. The hint: a vine rope knotted to a rock where no vine grows, and the smith's word that the
  man went down beside the forge.
- **Lines:** the vents, the step: *Three mouths of iron in the ash, each as wide as a door,
  breathing heat. The tracks in the ash go in and come out.*
- **New here.** The volcano and lava underfoot (#543); the heavy machines and the drakes, two new
  families (#520); the sweep with fire (#545).
- **Finds.** The Great Axe +2 in the hole; a Warhammer +1 at the forge, the ladder's (#542).
- **Pay.** About 2,000 xp a member.
- **As built** (#513, 9 October): the brief's places, with five groups for its nine, laid whole in
  Fire Mountain at 200,318, band 25 (§9, #513's 2). Its id is `firemount_g11`, the zone's and the
  box's, not the issue's `cindercoast_g11`: the scaffold counts 708 of its squares Fire Mountain's
  and 316 Cindercoast's (§9, #513's 1). The cone is lettered by hand, the volcano over the atlas's
  mountain at rows 4 to 10 and columns 10 to 20, its mouth a vent at 15,8 (215,326, the atlas's
  site), and the rest of the ridge stays mountain. The three flows are the atlas's lava as cut: the
  north-west leaving west at rows 10 and 11, the south-west at rows 20 to 23 and the south-east
  leaving east at rows 27 to 30. Lava is open ground, as the Kilns' is, so they cut nothing, and
  the crust bears a company (`g11_crust`, 10,9; §9, #513's 3). The way in is G10's south edge, each
  row as the atlas cuts it, ash either side of the mountain's foot with no road: walked across at
  columns 23 to 31, the track down, and 0 to 4, the cairn's corner, and the map starts at 28,0
  facing south (§9, #513's 4). The north edge meets G10's, which `tools/tests/outdoors.ts` pins anew
  with the mountain between and no void under it; the west meets F11 (#514), pinned anew with the
  cone's flank, mountain at rows 4 to 9, and no void past it, the two flows, rows 10 and 11 and 21 to
  23, going on into it; the other two end the world against H11 and G12, pinned with void past them,
  and the east holds Grimsforge's wall at rows 12 and 13 and the hole at 15 to 18. A shrine at the
  track's head, 27,2, blesses
  endurance (§9, #513's 19). Grimsforge is a block of building squares, 29 to 31 by 12 to 13, with
  the site, 230,330, in it; `g11_forge` stands at its front, 28,12, and the warlord's heir at the
  anvil, 28,13, words only (§9, #513's 7). In its lee, the rack at 29,14 (`g11_rack`, a War Hammer
  +1), the camp at 30,14 and, by its fire at 31,14, the scavenger, words only, who sells to a smith
  in Cinderport and says nothing of where he goes. The furnace-draught is a vent in the mountain's
  foot at 22,11, `g11_draught` at its front, 22,12: no wider than an arm, so no way in (§9, #513's
  8). The vents are three mouths at 26,15 to 26,17, and the middle one, 26,16 (Meridian Camp's site,
  226,334), is the way down: `VENTS` is in `exits`, its square open ash since #22 opened it (the side
  mouths stay vents), and `g11_vents` (not `once`) stands at its front, 27,16, with the step's line
  each time (§9, #513's 5; #22's 2). The secret
  is the scavenger's hole, in a ring of rock against the east edge that no climber passes: its mouth
  a secret door at 29,16, the ledge behind it (`g11_finds`, 30,16, grey parts in heaps and a cold
  draught from below) and the chest (`g11_hole`, 31,16): the Great Axe +2 and 700 gold. Its far
  end, 31,17, is open ash since #22, the way down (`HOLE`, in `exits`), with rock at 31,18 and 30,17
  so that it opens only from the hole. The hint is the rope (`g11_rope`, 28,16): a vine rope knotted
  round a rock where no vine grows, and the heir's word that a man went down beside the forge with a
  rope (§9, #513's 6).
  For density besides, the lookout over the Waste on the cone's shoulder (`g11_lookout`, 14,10), the
  cairn at the ash foot with 300 gold and a Sapphire Vial (1,2), the Hills' line from the west
  (2,15), the flows' beds (`g11_bed`, 5,8; §9, #513's 18) and, on the ash, the stokers' heaps
  (13,20) and tracks (22,20), the mountain's bombs (13,28), a bullock's bones (22,28), black glass
  where the west flow set (4,28) and the south-east flow going on (28,28). Five groups: ember
  salamanders, 4, on the track, 30,6, the nearest, at 24; ember salamanders, 3, on the cone's
  shoulder, 16,11; the vents' fight, two stokers with two ember salamanders, 28,19, where fire is
  useless and lightning the answer (MONSTERS §8.2); one cinder drake alone on the south-east flow,
  28,22; and one sentry, `after` `q_ember_lit`, walking in from the Waste, 4,24, the box's top at 26
  (§9, #513's 9 and 10). It departs from the brief in the id, the groups (five for its nine) and
  the sentry (taken from F11 for the box's top): §9, #513's 1, 9 and 10. The Great Axe +2 is a new
  item (§9, #513's 12). The step's quest and goal are #518's, and the crossing from G10 is walked
  both ways, Cindercoast's harder words reworded to read true from the mountain (§9, #513's 15
  and 16).
  - **Measured.** A company at 25 wins every fight and manages 10.23 fights to a rest, inside the
    aim of 9.25 to 11.25, with 94.7% of its days ending in a fight broken off: the stokers' fight
    runs past 15 rounds once spell points run low, which the gate shows and never judges (G10's
    is 15%). It walks Fire Mountain's road, past the salamanders and then the stokers, every
    time. G11 pays 2,768 xp a member and 1,000 gold. Its under-check is n/a, its floor being over
    the area's; Ashfall's nine groups at 22 are won every time, owed to #18 as before. Density
    100.0% within 8 steps and the furthest 8, with no sign among its 27 points; the art check
    dresses 41.7% of its 12 wall faces. It claims the heavy machines, the volcano and the vent
    underfoot and the volcano on the map as new (§7).

### 4.6 F11, Old Cinder's and the Ember Stone's box (#514): core, band 25–26

- **Purpose.** The Ember Waste's step, and two ways down: the buried town's crater at the box's
  north edge, the Stone half-built on its field of cinders to the south-west, and the west lava
  flow between them. After the Stone is lit, the first sentries, on a road that was safe the day
  before (#548).
- **Landmarks.** The road along the north edge from G10 to F10's corner; Old Cinder's crater at
  190,318, a rim of ash and roof-ridges standing out of it, the way into #515 at its lip (plate
  190,324); the lava flow from 209,325 west to 174,330, crossed by a causeway of slag; the Waste's
  rock to the west; the Stone's field, cinders for forty squares round the Stone at 176,342, the
  way into #516 (plate 176,348).
- **Points of interest,** about nine features and eight groups:
  - the Stone, seen from the causeway: the step (§5);
  - the crater's lip and the Paladin's trainer at it, a Lightbearer grown old (#448);
  - the causeway over the flow, and a milestone at its end: THE WOLD 4, CINDERPORT 5;
  - a camp in the rock (#45), a cairn on the crater's rim (#45), a shrine at the field's edge, the
    first Cinderport folk's (#45);
  - a hermit in the rock who counts the stokers that walk out, and says their count has not
    changed in forty years.
- **Encounters.** Cinder beetles on the ash (two groups); ash husks out of the crater by night
  (`when`), the dead walking where the Stone was never finished (MONSTERS §2); a cinder drake on the
  flow, the hardest before the Stone, at 25; after the Stone is lit, sentries on the road (`after`,
  two groups) at 26, the box's top.
- **Quests.** The step. The Founding Stone's way in (§6). The Paladin's quest goes down from here
  (#448).
- **The secret and its hint.** A hollow in the rock west of the field where the Stone's builders
  left their tools four hundred years ago, one of them the mate of the Cut Stone's chisel, and a
  Chain Mail +2 with them. The hint: the rock's face is scored in straight lines, the way the Grove
  Stone's cut was.
- **Lines:** the Stone, the step: *On a field of cinders, a Stone half-built. The scaffold round it
  is iron and has not rusted.*
- **New here.** `after` on a whole area (#548); a Stone's field without a Stone's light.
- **Finds.** The Chain Mail +2 in the hollow; a part, carried by the first sentry (§5).
- **Pay.** About 1,800 xp a member, and the sentries' after.
- **As built** (#514, 9 October): the brief's places, with four groups for its six, laid whole in
  the Ember Waste at 168,318, band 25–26 as the brief has it (§9, #514's 1 and 10). The scaffold
  counts 678 of its squares the Waste's and 346 Fire Mountain's, not the plan's 951, 40 and 33; as
  laid it is ash 559, rock 304, lava 60, dirt 35, chasm 30, mountain 14, building 7, road 7, pillars
  5, stone 2 and a secret door. The way in is F10's south edge at F10's corner, the ash open at
  columns 15 to 31 and the road's strip at 5 to 11 running along the rocks with rock under it, and
  the map starts at 16,0 facing south; G11's west edge is a second way in, walked (§9, #514's 2).
  The north edge is the atlas's cut, F10's row 31 square for square, and the east is lettered to
  G11's west edge square for square, so that both flows meet G11's at rows 10 and 11 and 21 to 23;
  `tools/tests/outdoors.ts` pins both anew, with the west and south ending the world against E11 and
  F12 (§9, #514's 3). The crater is a pit of chasm, 30 squares round 22,4, seen across and never
  walked, under Old Cinder's mark (22,0) on its north rim, with seven roof-ridges standing out of it
  as building squares and the rim ash (§9, #514's 4). Its way down is barred as G11's vents are:
  `CRATER`, a roof-ridge at the west lip, 19,4 (187,322), exported and not in `exits`, with
  `f11_lip` (not `once`) at its front, 18,4, and beside it, at 18,5, the Paladin's trainer, an old
  Lightbearer, words only (§9, #514's 5 and 6). The Stone is a pillar at its mark, 8,24 (176,342),
  inside four pillar uprights, on a field of cinders drawn as dirt, 35 squares in a diamond within
  four of it; its way down is barred the same way, `STONE` being the Stone's own square, with
  `f11_stone` (not `once`) at its front, 8,23, between the uprights (§9, #514's 7). The west flow
  runs through the ash at rows 12 and 13 from the east edge to the rock and on into it to its end at
  6,12 (174,330), `f11_seal` standing there; the causeway of slag is stone ground at 18,12 and
  18,13, `f11_causeway` at its north end, where the Stone is seen, and the milestone at its south
  end, which reads THE WOLD 4, CINDERPORT 4 (§9, #514's 8 and 9). The secret is the builders'
  hollow, in a spur of rock authored on the west edge, 0 to 3 by 21 to 25: its mouth a secret door
  at 3,23 (171,341), the tools at 2,23 (`f11_tools`: hammers, wedges, a chisel, iron and not rusted,
  seen and never said to be the Cut Stone's mate) and the chest at 1,23 (`f11_hollow`) with 700 gold
  and the Chain Mail +2. The hint is `f11_scored`, 4,23, the rock's face scored in straight lines,
  at the field's west edge (§9, #514's 12). For density besides, the hermit in a cleft cut into the
  rock's east face, 15,9, words only, who counts the stokers walking out of the mountain at dusk,
  and the camp in a cleft at 10,18; a cairn on the crater's rim with 300 gold and a Sapphire Vial;
  the shrine at the field's edge, 13,24, five steps from the Stone, the first Cinderport folk's,
  which blesses personality; `f11_dusk`, 27,14; and `f11_road` on the road's strip in the north row,
  which the map reaches only from F10 (§9, #514's 14, 15 and 19). Four groups: cinder beetles, 4, at
  20,9 below the crater, the nearest, at 24; ash husks, 4, by night (`when`) at 27,4 on the crater's
  east rim; one cinder drake at 25,12 on the flow, the hardest before the Stone, at 25; and two
  sentries together, `after` `q_ember_lit`, at 14,20 on the ash between the causeway and the Stone,
  the box's top at 26 (§9, #514's 10). It departs from the brief in the groups (four for its six:
  the second beetle group and the second sentry group are cut), the milestone (CINDERPORT 4 for 5)
  and the sentry's part, not given (§9, #514's 9, 10 and 18). The Chain Mail +2 is no new item. The
  step's quest and goal are #518's, and the Waste's crossing words are walked over F10's south edge
  and G11's west edge, none changed (§9, #514's 20).
  - **Measured.** A company at 25 wins every fight and manages 10.82 fights to a rest, inside the
    aim of 9.25 to 11.25, with 16.3% of its days ending in a fight broken off. The gate counts the
    night husks by day and the sentries before the Stone is lit, as it counts every group: only the
    nearest-way-in check skips a group `after`, and no check skips one `when`. The Waste's road and
    way in are F10's and E10's, unchanged. F11 pays 2,530 xp a member and 1,000 gold. Its
    under-check is n/a, its floor being over the area's; Ashfall's 20 groups at the floors, H10's
    four with the 16 before them, are won every time. The curve's rise reads 0.95 by rank, the
    nearest group the beetles, 13 steps from the way in, and the hardest the sentries, 24 steps; the
    walkthrough wins every group at 25. Density 100.0% within 8 steps and the furthest 8 of 15, with
    no sign among its 28 points; the art check dresses 10.7% of its wall faces. It claims nothing
    new (§7).

### 4.7 Old Cinder (#515): dungeon, two levels of 16×16, band 25–26

- **Purpose.** The area's first dungeon: the town the mountain buried, its people cast in the ash
  where they stood, the mountain's eldest asleep on what is left of it, and under it the undercroft,
  with the lamp at its bottom and one of the Stone's three parts (#443, call 2).
- **Landmarks.** The buried town: the crater's floor where the ash has blown clear, a street of
  roofs and doorways, the husks in them still holding their cups, the square at the far end and the
  Old Drake on it; the hall's door under the square, and the stair down. The undercroft: cellars
  under the hall, the founding stone in its niche, the lamp-keeper's walk and the lamp at the bottom,
  dark, with the part set in the floor beside it as if someone had meant to carry it on.
- **Points of interest,** about seven features and eight groups a level, as the Foreland's dungeons
  are held: the doorways, the well, the square, the hall's door, the niche, the walk, the lamp.
- **Encounters.** Ash husks in the street (three groups) and in the cellars (two); cinder beetles
  nesting in the roofs; the Old Drake, boss, level 26, asleep on the square until the company is
  near, its breath burning a row (#545); its death closes nothing.
- **Quests.** A part, the chapter's (§5). The Founding Stone (§6). The Paladin's third: the lamp
  relit at the bottom (#448).
- **The secret and its hint.** A side cellar behind a fallen stair in the undercroft, the
  lamp-keeper's own: his Holy Symbol of the Hearth and a Plate Mail +2. The hint: the lamp's oil
  channel runs under the wall where no room is.
- **Lines:** the street: *A street under the crater's rim, roofs and doorways out of the ash. In
  the doorways the people stand as they stood.*
- **New here.** The dead cast in ash; a boss that sleeps; a town under a dungeon's roof.
- **Finds.** The part; the founding stone, a quest item (§6); the Holy Symbol of the Hearth, named;
  the Plate Mail +2; a Flamberge +1 at the square, the ladder's (#542).
- **Pay.** About 2,600 xp a member.

### 4.8 The Ember Stone (#516): dungeon, one level of 16×16, band 26

- **Purpose.** The Stone itself: its housing half-built on the field of cinders, the works round it
  as the builders left them, three sockets empty and a door in the floor that has never opened.
  Finishing the Stone is a hand-in of three items, which shuts nothing before it (#443, call 2;
  #450); the moment it lights, the Sentinel comes up through the door, the first thing up (MONSTERS
  §8.2), and the Hearth steadies (#548, on `q_ember_lit`, §9).
- **Landmarks.** The housing, iron that has not rusted; the gallery round it; the three sockets at
  its heart; the door in the floor, shut; the builders' benches; the seedling's bed at the field's
  edge, where the Druid's quest ends (#448, §4.9).
- **Points of interest,** about seven features and six groups: the sockets, the door, the benches,
  the gallery's lookout over the Waste, the chain pin, the lower gallery.
- **Encounters.** Cinder beetles nesting in the works (two groups); a cinder drake on the housing's
  top; after the hand-in, the Sentinel, boss, level 26, in the chamber as the door opens, and
  sentries up through it after (`after`), two groups.
- **Quests.** The Stone lit, on `q_ember_lit` (§9): the chapter's last step (§5). The Druid's third: the seedling kept
  alive until it is (#448).
- **The secret and its hint.** A lower gallery under the housing where the Meridian Company stopped
  on their way to the vents, and the fourth journal in it, the one the shelf at Cinderport lacks
  (DESIGN §10.3). The hint: a chain pin driven in the housing's foot with the Guild's mark on it,
  and the guildsman's word that Fane wrote at the Stone.
- **Lines:** the sockets: *Three sockets in the Stone's heart, each the shape of something, each
  empty. The builders stopped as if called away.*
- **New here.** A hand-in of three parts; a boss that comes when the quest is done; a Stone that
  lights.
- **Finds.** The journal; the Sentinel's part, named; a Battle Staff +1 and a Scale Mail +1 on the
  benches, the ladder's (#542).
- **Pay.** About 2,200 xp a member.

### 4.9 F10 and E10, the Ember Waste's road (#517): country, band 24–26

- **Purpose.** The road from Old Cinder's causeway west over the Waste and the Cinder Hills to the
  Wold at 156,312 to 144,300, Act IV's third area, the crossing line facing back; F10's ash and the
  vines along its north, E10's hills; the Druid's trainer, far from the road.
- **Landmarks.** F10: the road along the south rows from F11's corner; the vines' edge in the
  north, where Cindercoast ends; a rock outcrop in the north-west, the Druid's. E10: the Cinder
  Hills across the box, the road's notch through them at about 150,306, and the Wold's steppe
  beyond, the world's end there until #524.
- **Points of interest,** about five features and five groups each:
  - F10: a milestone (THE WOLD 2, CINDERPORT 7), a camp (#45), a shrine (#45), a cairn (#45); the
    Druid's trainer at the outcrop, an Archdruid who came from the Grove and stayed (#448);
  - E10: a Rider's waymark at the notch, a cairn on the hills' crest (#45), a shrine (#45); a
    hermit in the hills who saw the Stone's field from above every day of his life and has never
    seen it lit.
- **Encounters.** Cinder beetles on the ash (two groups a box); ember salamanders at the flow's end
  in F10's south; a cinder drake on the Hills' crest, the far end, at 25; sentries after the Stone
  (`after`), one group on each box's road, the band's top.
- **Quests.** None. The Druid's quest is kept here (#448).
- **The secret and its hint.** E10: a cairn in the Hills that is a grave, the first Rider who came
  down to trade, with her saddle's silver and a Horn Bow +2. The hint: the Hills' cairns all face
  the steppe but one. F10 has none of its own: the country's floor asks for one secret between the
  two boxes.
- **Lines:** the cairn: *The Hills' cairns all look west to the steppe. This one looks back at the
  Stone.*
- **New here.** Act IV's third area seen: the Wold's road.
- **Finds.** The Horn Bow +2 in the grave.
- **Pay.** About 1,400 xp a member between them.
- **As built** (#517, 9 October): the brief's places, with three groups for its seven or so, both
  boxes laid whole in the Ember Waste, F10 at 168,286 and E10 at 136,286, band 24–26 where the brief
  has 25–26 (§1; §9, #517's 1, 2 and 7). F10 meets G10's west edge square for square, the road at
  rows 7 and 8, and the map starts at 31,7 facing west; E10 meets F10's west edge, the road at rows
  29 and 30, and starts at 31,29. F10's south edge meets F11's north edge (#514), the ash open at
  columns 15 to 31 and the road's strip at 5 to 11 with rock under it; past F9, E9, E11 and D10 the
  world ends for now. The seams are pinned in `tools/tests/outdoors.ts`. The roads are the atlas's,
  made to meet it at the edges
  and square to square (§9, #517's 3): F10's leaves the vines at 26,13, crosses the ash past the
  Riders' ring and runs west along the rocks of its south rows, past F11's corner (columns 5 to 11
  of row 31); E10's crosses the ash, climbs the Hills to the notch at 14,20 (150,306), comes down to
  the link's end at 8,14 (144,300) and leaves by the west edge at 0,6. The Waste has crossing words
  of its own, on its zone row, walked over G10's west edge (§9, #517's 6). In F10: the vines' end
  where the road leaves them (26,13), their edge in the north (12,5) and a tree they killed (24,3);
  in the north-west the Druid's outcrop, rock at 1 to 5 by 1 to 4 on the atlas's ash, and the
  Archdruid in its lee at 6,3 (§9, #517's 4); on the ash the cairn (14,12) with 250 gold and a
  Sapphire Vial, the shrine (5,13, endurance: a stone on end with a hand pressed into it), the
  drifts (13,20) and the Riders' ring, a camp by the road (20,22); in the south the flow's end,
  warm, words only (27,30), and the milestone, THE WOLD 2, CINDERPORT 4, at 3,29 where the road
  turns west along the rocks (§9, #517's 5). In E10: on the ash the cinder cones (25,4) and the
  veils of ash (27,16), and at the south edge the lava flow's head (24,30) over the atlas's two lava
  squares; in the Hills the waymark in the notch (14,20), the crest cairn (14,16) with 250 gold and
  a vial, the cairns on every rise (12,23), the Riders' sky-stone on the crest (8,3, accuracy; §9,
  #517's 12) and the hermit (13,13), words only; on the steppe the view west (1,11), the wind (4,21)
  and the hoofprints (5,27). Three groups (§9, #517's 7 and 8): in F10 cinder beetles, 4, on the ash
  below the vines, 22,16, nearest the way in, at 24, and one cinder drake on the rocks over the
  road's west run, 9,26, the box's hardest, at 25; in E10 two cinder drakes at 6,9 on the Hills'
  crest at the far end, by the road coming down to the steppe, at 25. The secret is the grave in the
  Hills, its mouth a secret door at 18,27 (154,313), its hint `e10_back` at 19,27, the woman on her
  saddle (`e10_rider`, 17,27) and the chest (`e10_grave`, 16,27) inside (§9, #517's 10 and 11). It
  departs from the brief in the band, 24–26 for 25–26 (§9, #517's 2); in the groups, three for seven
  or so, a drake in each box (#517's 7 and 8); in the milestone, CINDERPORT 4 for 7 (#517's 5); in
  the pay, 1,841 xp a member between them where the brief has 1,400 (#517's 9); and in E10, laid
  whole as the atlas cuts it, the Wold's steppe and grass with it, bare of the Wold's monsters,
  quests and crossing line, which are #524's (#517's 13). The sentries `after` the Stone, one group
  on each box's road at the band's top, are #449's (§11).
  - **Measured.** A company at 24 wins every fight and manages 10.66 fights to a rest on F10 and
    10.51 on E10, inside the aim of 9 to 11, with 19% of F10's days ending in a fight broken off and
    0.3% of E10's; it walks the Waste's road, past the beetles, the drake and the two drakes, every
    time. F10 pays 1,178 xp a member and 250 gold, E10 662 and 950. Two under, at 22, it wins every
    fight too, owed to #18 as G10's is. Density 100.0% within 12 steps, the country floor, and the
    furthest 12 of 20, with no sign among F10's 12 points or E10's 15. It claims nothing new (§7).

### 4.10 The country behind (#522): country, band 25–26, parked

- **Purpose.** Seven boxes built once the owner has played the act (#443, call 9): H11, H12 and
  G12, Fire Mountain's south slopes and the two lava flows' ends under the rim; E11, the Waste's
  south; F9, G9 and H9, the Sound's shore, with Cinderport's harbour side on G9.
- **Encounters.** Cinder drakes on the slopes; cinder beetles and strangler vines on the shore; the
  sentries after.
- **Pay.** About 450 xp a member each, outside the area's 19,467 (§8). The rest of the brief is
  written when #522 is unparked.

### 4.11 Meridian Camp (#22)

Not this doc's to brief: three levels of 32×32 down the vents (#443, call 4), the vents at 25, the
iron corridors at 26–27 and the camp at 27–28, with stokers, ember salamanders, the cinder drake
that nests in the corridors (the Barbarian's quarry) and deep knockers below the camp. Two of the
Stone's parts lie on its upper levels, never its bottom (call 2; §5), so the chapter walks the vents
and the corridors and never needs the camp, the window or the map.

Its first two levels are built (docs/areas/meridian_camp.md §4.1 and §4.2): the Stone's first part
lies in the stokers' furnace room (`ember_part1`, §9, #22's 1) and its third at the corridors' end
(`ember_part3`), and the corridors' stair down to the camp is barred until the camp is built.

## 5. The one quest here

Ashfall's chapter is The Window (`chapter.ts`, #518, a working title), joined after the Whitespine's
The Bells; every zone on the road holds a step (EXPANSION §5.8): Cindercoast's at Cinderport and the
eldest's story, Fire Mountain's at the vents, the Ember Waste's at the Stone. Its entries and goals,
in the journal's voice, keyed to flags, events and maps the save holds:

- **The far side.** Down the Stair onto black sand, hanging vines, a mountain that smokes over
  everything; the goal points west along the shore to Cinderport. Its event stands at the Stair's
  landing, 26,20 (`h10_foot`, #510); the entry and the goal are #518's.
- **The eldest's story.** At the trading ground the Riders' eldest tells the oldest story on this
  side of the sea: a door opened in the sky, something rose toward it on a pillar of fire and fell,
  and the land where it fell burned to glass. *Remember what that cost, if anyone ever offers to
  open it for you.* The goal turns to the Stone.
- **The Stone seen.** Half-built on a field of cinders, three sockets empty and the parts it lacks
  only below. The goal names the three places: the vents, Old Cinder, the corridors.
- **The vents.** Down the first level of the vents to the stokers' furnace room (#22), where the
  machines shovel nothing into nothing, and the first part, `ember_part1`, in the furnace's mouth.
  Finding it sets no flag (§9, #22's 1).
- **Old Cinder.** Down through the buried town to the undercroft's bottom, and the second part
  beside the dark lamp (§4.7), to be `ember_part2` (§9, #22's 1).
- **The corridors.** Iron corridors hot enough to blister, and at their end the third part,
  `ember_part3`, in a chest (#22's second level; §9, #22's 1). Below them a camp, and an old man who
  says *You took your time*: the window's entry is written if the company goes on down to it, and
  never asked for; what it sees there is in the entry and nowhere else (DESIGN §7).
- **The Stone lit.** The parts carried up and set, a hand-in of three items (#516) that takes each
  at the first meeting (EXPANSION §2.3). The Stone lights; every door below opens at once; the
  Sentinel comes up. The Hearth burns steadier than in all our lives (#548). From then on sentries
  walk the road back to Cinderport (`after`), which was safe the day before. The first sentry was to
  carry a part (§4.6): F11 gives none, and whether one is carried, and which, is the chapter's
  builder's (§9, #514's 18).
- **The road on.** The goal turns west to the Wold, whose chapter follows (#524); the last crossing
  waits at Cinderport's quay for Act V.

Nothing in the chapter is a lock (EXPANSION §2.3; #443, call 2; #450): the ship sails for anyone
with the fare, the three dungeons are open at any hour, a part may be fetched in any order and the
Stone takes them as they come. A company that reaches Cinderport by Kilnhaven's ship, or finds Old
Cinder's part before it has heard the eldest, reads the journal true in that order. The walkthrough
plays it at 24, 25 and 26, in order, once with Cinderport reached by the Stair and once by
Kilnhaven's ship.

## 6. Side quests

#56's three for Ashfall, all taken by the owner on 2 October 2026 (#443, call 9), each built with
its box on the systems of #76 (#519):

| # | Quest | Level | Where | What it needs | Pay | Built in |
|---|---|---|---|---|---|---|
| 49 | What the Springs Bring Up | 25 | Scaldwell and its source (H10) | a choice put by a person; a quest's fight; an event that changes on a flag | 250 | #510 |
| 50 | The Founding Stone | 25 | the potter at Cinderport; Old Cinder's undercroft | a quest item; a choice put by a person; a feature that appears `after` (#41) | 250 | #512, #515 |
| 52 | The Shovel That Does Not Blunt | 26 | the smith at Cinderport; the scavenger's hole beside Grimsforge (G11) | a choice put by a person; an item that is a weapon, #542's | 300 | #512, #513 |

Pay is xp a member, whichever way the choice goes, shared by level: about 800 between the three
(§8).

- **49.** The bathhouse keeper, a Rider, says the springs went cold the day the Anvil Stone was cut
  and warm when it was restored, and that things come up in the water: a grey part, a bead of
  glass, a bone. At the source a stoker shovels. Break it and the springs go cold for good; leave it
  and take what comes up. As built (#510): the keeper speaks four lines, words only, and the stoker
  stands at the rock, a group like any other; the choice, the fight's change and the springs going
  cold are #519's (§4.2, §9, #510's 6 and 7).
- **50.** A Cinderport potter wants the town's founding stone brought out from under the ash; it
  says the town was founded by the first who came down from the mountain. Bring it out and
  Cinderport raises a shrine on the trading ground and the Riders object; or leave it.
- **52.** A Cinderport smith bought a smooth grey shovel-head from a vent-scavenger, and it does not
  blunt, like the Underdeep chisel. The thane's agent and the Wardens want it. Sell, or keep it
  hafted as a weapon that never dulls, and find the scavenger who found the way down beside
  Grimsforge (§4.5). What "never dulls" is in the items is #542's to say.

### The guilds' quests

Two halls open here (DESIGN §8; #443, call 7), on the rules and the hall menu built in #132:

- **The Cartographers' Guild's second hall** at Cinderport (#512): its map of the far side and the
  Meridian journals' shelf, with a gap for the fourth; the Guild's line ends at Meridian Camp (DESIGN
  §10.3), and #56's 51 is its guildsman's. The quests it offers a Surveyor and a Mapmaker are on
  Ashfall's boxes, settled in #512: it offers and pays the Guild's one ladder and adds none of its
  own (§9, #512's 6).
- **The Compact's factor's house** at Cinderport (#512): the Compact's ship lands here (#547), the
  fare halved for a member; #56's 54's runner is theirs. What the factor's hide in G10's vines
  holds (§4.3) is seen and never said.

### The third prestiges' quests

Built with #448 (DESIGN §5): each trainer waits on the surface and each quest goes down; where a
third sits in country under 27 the quest's own fights are set at 26.

| Class | Trainer, where | The quest |
|---|---|---|
| Paladin | Old Cinder's crater lip (F11) | down into the undercroft, and relight the lamp at its bottom |
| Barbarian | Grimsforge, by the vents' mouth (G11) | down the vents to Meridian Camp, and kill the cinder drake that nests in the corridors (#22) |
| Druid | the Ember Waste, the rock outcrop in F10's north-west (§4.9) | carry a seedling from the Grove into the Waste, and keep it alive at the Stone's field until the Stone is finished |
| Ranger | the Eyrie, the Wold's (#524) | down the vents to Meridian Camp, and bring Oriel Fane's map back to the scout (DESIGN §10.3) |

The Ranger's is the Wold's to place and #22's to end; it is here because its road is Ashfall's.

## 7. Encounters, and what is new

MONSTERS §8.2 has the roster and the fights: the Strangler Vine (24, which never roams and holds),
the Cinder Beetle (24), the Ember Salamander (24), the Ash Husk (25), the Stoker (25, which fire
does not touch), the Cinder Drake (25, which flies and burns a row), the Sentry (26, all of Ashfall
once the Stone is lit, `after`), the Old Drake (boss 26) and the Sentinel (boss 26, the moment the
Stone lights); the vents, two stokers with ember salamanders, where fire is useless and lightning
the answer; after the Stone, sentries on the road back to Cinderport. Their drawings are #520's,
nine. §4.2 to §4.9 place every group, box by box, the gentlest at the Stair's foot and the Sentinel
at the top of the band.

Four of the nine are drawn (#520): the Strangler Vine, a grey tree it has killed, its ropes hanging
nearly to the ground; the Cinder Beetle, low and black with one forked horn; the Ember Salamander,
lither than its kin, coal-red, its fire in bands; and the Ash Husk, the cast of a man holding his cup
up. Each stands on MONSTERS §4.4's line at its level; the vine holds as the bramble does, and the
groups that place it are set not to roam (§9). The drakes are drawn on a frame of their own: the
Cinder Drake, hunched and crusted ash-grey, small-winged and heavy-headed, hanging on its wings with
its jaw open on the glow and the fire in the seams of its belly; and the Old Drake, the frame larger
and settled, its wings half folded, scarred and crusted with its crater's sulphur. Both breathe fire
on a row and fire does nothing to them (§9). The heavy machines have a frame of their own too: the
Stoker a sooted boiler on short bowed legs, the furnace door glowing in its belly and its near arm a
shovel; the Sentry leaner and upright, an eye under a brow of plate and one arm long, its clamp
holding; and the Sentinel the family at its largest and plainest, a block of plate with a slit of
fire for a visor and the fire through the line down its chest. Fire does not touch the stoker, so at
the vents lightning is the answer. With them all nine of #520's drawings are done (§9).

Proposed, against the roster's Where column: the Cinder Drake over Cindercoast's shore (H10, G10)
and on the Hills (E10), where MONSTERS §8.2 has it on Fire Mountain's slopes only, and the Ember
Salamander at G10's far end and F10's flow, where it has them at the vents. They stand in the briefs
as proposals; if the owner takes them, MONSTERS' Where column says so, in a pull request of its own.
G10 takes its two (#511, §9's 8); H10 takes neither, the stoker being its group at 25 (#510, §9's
8); F10 and E10 take the Cinder Drake, on F10's rocks and on the Hills, and place no salamander
(#517, §9's 7 and 8). One gap for the owner, real since G11: before the Stone is lit the roster has
no roaming monster at 26, so a box of 25–26 holds its top either in the sentries after or in two
drakes together, and the curve asks 26 of every Ashfall box laid at 25. G11 (#513) holds its top in
a sentry after the Stone, the sentry's first placing taken from F11 (§9, #513's 10); F11 (#514)
meets the rule too and holds its top in two sentries together after the Stone, the sentry's second
placing (§9, #514's 10), the roster answering it only with a sentry after or #22's drakeling.
Whether the curve forgives it or #520 wants a 26 is the owner's. F10 and E10 hold their top at 25
over a floor of 24, F10 with one drake and E10 with two together (§9, #517's 2 and 8).

New in Ashfall, for the novelty check (EXPANSION §5.4): the drakes and the heavy machines, two new
families (#520); sweep with fire, the drakes' breath (#545); the volcano, lava fields and vines
underfoot (#543); `after` on a whole area, the sentries (#548); a hand-in of three parts and a boss
that comes when it is done. Its landmarks: a volcano, hot springs, a buried town, a Stone
half-built, a window below (#22). Back: the old wood as the strangler vine, the salamanders, the
spider frame as the cinder beetle, the skeleton frame as the ash husk.
The area's `novel` claims each as a box places it, since the check asks that what is claimed be
used: the drakes and the vines underfoot with G10 (#511), the heavy machines, the volcano and the
vent underfoot and the volcano on the map with G11 (#513, §9's 13); the rest waits for the box that
places it, and sweep with fire has no token to claim (§9, #511's 14). F10 and E10 claim nothing more:
lava is on the road before Ashfall, and steppe, first laid in E10, is the Wold's ground (#543), left
unclaimed (§9, #517's 15; §11). H10 claims the springs, with Scaldwell; its stoker is a heavy
machine already claimed with G11 (#510, §9's 11). F11 claims nothing: the chasm is the Sunder's, and
dirt, pillars and groups `after` and `when` are on the road before (§9, #514's 17).

## 8. The numbers

- **Experience.** The curve (EXPANSION §5.2, #159) gives an area the climb from its floor to the
  next area's floor, divided by 0.75: from 24 to 26 that is 14,600 / 0.75, about 19,467 xp a member,
  with today's `xpForLevel`. The shares of §4 are H10 1,700, G10 1,500, Cinderport 600, G11 2,000,
  F11 1,800 and the sentries' after, Old Cinder 2,600, the Ember Stone 2,200, F10 and E10 1,400
  between them and the three side quests about 800: about 14,600 in the area's own maps.
  Cinderport's 600 is its two halls' quests'. The balance, about 4,900, is Meridian Camp's two
  upper levels', which the chapter walks for two of the Stone's three parts and which #22 budgets
  as its own; with them a clear comes to the curve and a little over, as Saltreach's and
  Sunderwood's do, for the curve to settle (#542) and the gate to check (#38). The country behind
  adds about 3,150 when it is built, outside the budget. A kill pays by level (#159), so a company
  that comes by ship at 26 earns less than the shares say; the curve's row reports what a clear
  falls short of as owed to #446 until the boxes exist, and each box is priced by its fights when
  it is built and recorded here.
  Scaled to the curve without the camp's levels, which §9 offers the owner beside the reading
  above, the shares are H10 2,250, G10 2,000, Cinderport 800, G11 2,650, F11 2,400, Old Cinder
  3,450, the Ember Stone 2,950, F10 and E10 1,850 and the side quests about 1,100: about 19,450. The
  issues (#510 to #519) carry the first figures until their briefs are settled. As built: G10 2,449
  (#511), 1.22 times its scaled share (§9, #511's 9); F10 and E10 1,841 between them (#517), 0.99
  times theirs; G11 2,768 (#513), 1.04 times its own; H10 2,449 (#510), 1.09 times its own; and F11
  2,530 (#514), 1.05 times its own (§9, #517's 9, #513's 11, #510's 9, #514's 11): 12,036 of the
  19,467 asked, so with the other scaled shares, 8,300, the shares stand at about 20,340, 1.04 times
  the ask. The vents (#22) add 2,146, 0.98 of the brief's 2,200 and in none of the scaled shares,
  which leave the camp's levels out: 14,182 of the 19,467 asked. The iron corridors (#22) add 4,399,
  1.63 of the brief's 2,700 and over the cap of 3,375, the Brood Drake alone paying 2,862: 18,581 of
  the 19,467 asked (§9, #22's 4). Cinderport pays nothing, as a town pays none, and its two halls
  add no quest (§9, #512's 6): its 600, 800 scaled, is unpaid (§11).
- **Gold.** Training six members from 24 to 26 costs 11,760 with today's `trainPrice`, and to 27,
  the third prestige's level, 6,240 more; the thirds ask a quest, not gold (DESIGN §5). A clear
  should pay for the training at least, in chests, drops, the halls' pay and the sentries' parts.
  The ladder's step at Cinderport's armourer is priced within the band's window, 5,500, and no ware
  comes within 400 of it (#542, as #399 held Act II's): the dearest ware the Drakeskin Coat at
  3,100, the rest 1,400 to 2,400. The armourer's full set for the premade six comes to about
  26,900, its weapons 13,900. As built: G10 holds 900 (#511), 300 in the cairn where the ash begins
  and 600 in the hide, its dearest find the Long Sword +2 at 420, inside the window; G11 holds 1,000
  (#513), 300 and a Sapphire Vial in its cairn and 700 in the hole, with the War Hammer +1 in the
  forge's rack, its dearest find, the area's, the Great Axe +2 at 1,500, inside the window; F11
  holds 1,000 (#514), 300 and a Sapphire Vial in the cairn on the crater's rim and 700 in the
  hollow, its dearest find the Chain Mail +2 at 800, inside the window; F10 and E10 hold 1,200
  (#517), 250 and a Sapphire Vial in the cairn of each and 700 in the grave, their dearest find the
  Horn Bow +2 at 1,050, inside the window; H10 holds 1,000 (#510), 250 and a Sapphire Vial in the
  cairn at the Stair's foot and 750 in the vent, its dearest find the Plate Mail +2 at 1,500, level
  with the Great Axe +2, inside the window; the vents hold 900 (#22), in the drift under the west
  mouth with a Sapphire Vial, but no gear; the corridors hold 1,500 (#22), in the nest's hoard, and
  the Meridian Mail +3 at 2,450 in the cold camp, their dearest find and now the area's, inside the
  window; the six boxes, the vents and the corridors hold 7,500 of the 11,760 the training costs.
  Cinderport holds no gold, a town paying
  nothing; the dearest ware at its armourer's is the Drakeskin Coat at 3,100 and the Quickening
  Draught at its chandler's, the company's kit from 25, is 2,000, both inside the window (#512).
- **The gate.** The gate check (`tools/tests/gate.ts`, #38) holds each box at its own floor
  (docs/areas/thornmark.md §9, 17): a company at 24 wins nine in ten of H10's fights and walks the
  shore resting at its camp; one at 22 wins no more than one in four, which is how the Stair's foot
  turns a Whitespine company back. The Old Drake and the Sentinel are won about half the time at
  26 and nearly always at 28. The bot grows to the band first (#549): at 24 it must drink, bless
  and pick lightning for the machines, or the vents will read harder than they are. #542's ladder
  dresses a company at 26 in Cinderport's step, and one at 24, the floor, in Rimewater's rung, as
  the Whitespine's at 22 is; whether that holds the figures is each box's to measure. As built: a
  company at 24 wins every fight on G10 and walks Cindercoast's road every time, 10.88 fights to a
  rest; one at 22 wins every fight too, owed to #18 as the Whitespine's boxes' is (§4.3). The town
  adds a way in, the boat's landing at 6,3; the groups nearest it are won at 22 as often as the
  median group or more (§4.4). A company at 25 wins every G11 fight and walks Fire Mountain's road
  every time, 10.23 fights to a rest, 94.7% of its days ending in a fight broken off (§4.5). On the
  vents a company at 25 wins every fight and manages 10.98 fights to a rest, 87.7% of its days
  ending in a fight broken off (docs/areas/meridian_camp.md §4.1). On the iron corridors a company
  at 26 wins 90.3% of the fights and manages 8.69 fights to a rest, 88% of its days ending in a
  fight broken off, and the Brood Drake is won 61% of the time at 26 and 100% at 28
  (docs/areas/meridian_camp.md §4.2). A company at 25 wins every F11 fight, 10.82 fights to a rest,
  16.3% of its days ending in a fight broken off (§4.6). On F10
  and E10 a company at 24 wins every fight and walks the Waste's road every time, 10.66 fights to a
  rest on F10 and 10.51 on E10; one at 22 wins every fight too, owed to #18 (§4.9). On H10 a company
  at 24 wins every fight and walks Cindercoast's road from the Stair every time, 10.21 fights to a
  rest; one at 22 wins every fight too, owed to #18, and the groups nearest the Stair are won at 22
  every time (§4.2).
- **Density.** Core boxes at the Foreland's floor, country at the looser one (EXPANSION §5.3); the
  Stone's chamber holds the door's squares empty until it opens, as the Sunder's floor holds the
  wall's. As built: G10 97.3% within 8 steps and the furthest 12, with no sign among its 26 points
  (#511); Cinderport, a town, 100.0% within 7 steps (86 of 86) and the furthest 4, with no sign
  among its 25 (#512); G11 100.0% within 8 steps and the furthest 8, with no sign among its 27
  points (#513); the vents 100.0% within 7 steps (279 of 279) and the furthest 6, with no sign among
  their 25 points (#22); the iron corridors 100.0% within 7 steps (193 of 193) and the furthest 7 of
  10, with no sign among their 24 points (#22); F11 100.0% within 8 steps and the furthest 8 of 15,
  with no sign among its 28 points (#514); F10 and E10 100.0% within 12 steps, the furthest 12 of
  20, with no sign among their 12 and 15 points (#517); H10 100.0% within 8 steps and the furthest
  8, with no sign among its 30 points (#510).

## 9. Decisions

Decided by the owner's delegate on 2 October 2026 (#443), and followed here:

1. **The Ember Stone takes three parts, and the act spends no story lock** (call 2): one part in
   the stokers' furnace room at the vents' first level (Meridian Camp's top, #22), one in Old
   Cinder's undercroft, one at the iron corridors' end on Meridian Camp's second level, never its
   bottom, so the window and the map stay the Lost Expedition's and the road never needs them.
   Finishing the Stone is a hand-in of three items, which shuts nothing before it (#450).
2. **Meridian Camp is three levels of 32×32** (call 4): the vents at 25, the iron corridors at
   26–27, the camp at 27–28, with stokers, ember salamanders, the cinder drake that nests in the
   corridors and deep knockers below the camp.
3. **Road order holds, but Cinderport's box may begin by sea** (call 6), the second area in flight
   once the Whitespine's first box is in.
4. **Cinderport holds the Cartographers' second hall and a Compact factor's house** (call 7): the
   Guild's line ends at Meridian Camp and #56's 51 is its guildsman's; the Compact's ship lands here
   and #56's 54's runner is theirs. The Riders come down to the trading ground outside the gate.
   Cinderport has a temple and trains to 27.
5. **The third prestiges built here** (call 8, #448): Old Cinder for the Paladin, Grimsforge by the
   vents' mouth for the Barbarian, the Ember Waste for the Druid; the Ranger's goes down from the
   Wold's Eyrie to Meridian Camp for Oriel Fane's map.
6. **The cuts stand, the country behind is parked and all of #56's 49, 50 and 52 stand** (call 9):
   §11, #522 and §6.
7. **The names** (#444, §10).

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.10: each box's landmarks, points of interest, encounters, secret
  and hint, finds and share of the pay.
- **The core** is H10, G10, G11 and F11, the boxes that hold a step; the rest is country (§4).
- **Old Cinder is two levels of 16×16,** the buried town and the undercroft, with the Old Drake on
  the town's square and the part beside the lamp (#515); **the Ember Stone is one level of 16×16,**
  the housing with its three sockets and the door in the floor (#516).
- **Cinderport's eight businesses** (§4.4), the potter's among them, since 50's giver has a trade.
- **The pay's shares** (§8), and Meridian Camp's two upper levels as the balance.
- **The bands on the atlas's rows:** Cindercoast 24–25, Fire Mountain 25–26, the Ember Waste
  25–26, Cinderport 24–26, Old Cinder 25–26, the Ember Stone 26, Meridian Camp 25–28. They are set
  in `src/content/areas/ashfall/atlas.ts`, where only the scaffold reads them; the owner's word
  changes them there.
- **The window is an entry, not a goal** (§5): call 2 says the road never needs Meridian Camp's
  bottom, and a goal there would; the journal writes the window for the company that goes down to
  it, and the hidden third ending asks for the Lost Expedition anyway (DESIGN §9).
- **The eldest stands on trading days** by `when` if #41 reads the day of the week; if not, she
  stands always and "trading day" lives in her words, as dusk lived in the barge's on C4.
- **The Stair's link** is `firemount` to `highspine` on the plan while its foot lands in
  Cindercoast's H10; #510 or #547 moves its `from` to `cindercoast`, a shared file's change.
- **The Riders' ride** (#547) leaves from Cinderport's trading ground for the Wold, a crossing the
  Riders sell, so the Wold's core can be played before F10 and E10 are built (EXPANSION §2.1).
- **The sentries carry parts,** not gold (MONSTERS §2); **the drakes over the shore and the
  salamanders off the vents** (§7).

Decided by delegate for #542, each the owner's to overturn:

1. **Act IV's ladder is the one step the issue asks:** Cinderport's armourer's, by 25, a point of
   blow past Rimewater's finds for every class and a point of armour past the furrier's. The briefs'
   "the same with a plus by 26" (§4.1) is not on it: the issue names one step, so the ladder's top
   is 25 and the boxes' pluses are theirs to choose, off the ladder (6).
2. **The armourer sells eight, the coast's trade:** a Slag Mace, a Marlinspike, an Ashwood Bow, a
   Flamberge, a Battle Staff, a Drakeskin Coat (13), a Cinder Robe (12) and a Basalt Shield (7),
   `ARMOURER` (§4.4): the staff and the robe 2,000 gold, the other weapons 2,300 to 2,400, the coat
   3,100 and the shield 1,400. The Flamberge and the Battle Staff are the briefs' own words; their
   Warhammer, Scale Mail and Horn Bow are older items.
3. **Armour steps on alternate rungs, as Act III's** (docs/areas/kilns.md §9, #535's 3): the medium
   wearers take the Drakeskin Coat over the furrier's Bearskin Coat (12), the casters the Cinder
   Robe over the Fur Robe (11) and plate's wearers the Basalt Shield over the Forge Shield (6), their
   plate staying the Sleepers' Bay's Plate Mail +4 (13).
4. **The weapons rise a point of blow over Rimewater's finds, a two-hander a point over a
   one-hander** (#535's 1): the Slag Mace 18 over the Ice Axe +1's 17, the Flamberge 19 over the
   Bear Spear +1's 18 and the Ashwood Bow 18.5 over the Hunter's Bow +1's 17.5. The Marlinspike and
   the Battle Staff, 17.5, better the Skinning Knife +1's and the Guide's Staff +1's 16.5.
5. **A ware rises about a quarter a town, its dearest a little over half its window** (#535's 7):
   the Drakeskin Coat 3,100 of 5,500 over the Bearskin Coat's 2,500, the weapons 2,000 to 2,400 over
   the furrier's 1,600 to 1,900. No ware is within 400 of the window.
6. **A plus on the step is a box's to place, off the ladder:** the briefs' Warhammer +1, Flamberge
   +1, Battle Staff +1, Scale Mail +1, Horn Bow and Shield with a plus (§4, docs/areas/glasswold.md
   §4) are drafts in older words. A box that wants a Flamberge +1 or a Battle Staff +1 makes it of
   `src/content/areas/ashfall/items.ts` (`P(flamberge, 1)`, 150 gold a plus), inside the window; the
   harness does not dress by it.
7. **The step is made ahead of the area** (`ITEMS_AHEAD`, `src/content/index.ts`), as Act III's were
   (docs/areas/kilns.md §9, #535's 10): no save can hold it until a listed area sells or places it,
   the first box (#510) takes the table into its Area and each ware is owed to the armourer (#512).
8. **The rows are owed to the areas' epics with nothing given** (#445, #446 and #447: 0 xp and 0
   gold), as Act III's were, and the windows stay at 5,000, 5,500 and 6,000, 500 a band as the issue
   has them.
9. **The harness's line past 22 is owed to #549:** in the step a company of 28 fights 11.4 standard
   encounters to a rest where it fought 11.0 without it (11 asked), and one of 26 fights 8.6 where it
   fought 7.8 (10.5 asked, the line there interpolated between 24 and 28). #549 makes the line again
   with the step, as #541 did after Act III's.

Decided by delegate for #520 (the four on frames), each the owner's to overturn:

1. **Each stands on the line at its level** (MONSTERS §4.4), `testMonster`'s numbers with the
   roster's notes on top: the vine a controller at 24 (284, 3d8+6), the beetle armoured at 24 (397,
   4d8+5), the salamander a skirmisher at 24 (330, 3d8+4) and the husk a soldier at 25 (340, 4d8+3).
   The boxes' gates tune them.
2. **The vine holds as the bramble does,** `inflict: paralysed` at 0.3 (the roster's, over the test
   controller's 0.15), at the bramble's speed of 6. Never roaming is a group's, not a def's: each box
   that places it sets `roams: false` on the group, as a Rift's warden is set (`src/game/rifts.ts`).
   Nothing new is owed to the systems.
3. **Fire does not touch the cinder beetle,** as it does not the fire beetle (MONSTERS §2): `immune:
   ['fire']`, though the roster's row does not say so. It is the line to drop if the owner wants the
   coast's beetles to burn.
4. **The ember salamander keeps its kin's fire and cold** (immune to fire, weak to cold) and is
   quicker and smaller: speed 16 over the salamander's 15, size 0.62 over 0.68.
5. **The husk is the dead and carries nothing,** as the bog body: Holy Strike lands on it and sleep
   and the swarm do nothing; it drops no gold. Speed 10, a stiff soldier's.
6. **Each is a drawing of its own on its frame:** the vine a dead tree wound with vine, not a tree
   that walks, its leaves green where the Deepthorn's are dead oak; the beetle low and horned where
   the fire beetle is high and lit, with no fire on it; the salamander lither, coal-red and banded
   where its kin is charcoal and spotted; the husk no skeleton but the cast of a man, his cup held up
   at his shoulder. The salamander's embers are its declared parts (`tools/smoke.ts`); the husk's
   sifting ash is too faint to be ink.
7. **Each is owed to the first box that places it:** the vine and the beetle to H10 (#510), the
   salamander to G10 (#511, the proposal in §7; to G11, #513, if the owner does not take it) and the
   husk to F11 (#514), whose crater sends them out by night before Old Cinder (#515); F11 places it
   first, restated on the line made again (#514's 13).

Decided by delegate for #520 (the drakes), each the owner's to overturn:

1. **The Cinder Drake stands on the test drake's line at 25** (MONSTERS §3.3): 584 hit points, 5d8+3
   and its breath, `sweep: { chance: 0.25, element: 'fire' }`, as `testDrake` has them
   (`tools/testmonster.ts`), so `tools/tests/harness.ts` holds it there. Its speed is the line's 8,
   though it flies.
2. **It flies as the Spine Eagle does,** `ranged`, so its blows reach the back row as well as its
   breath. The Old Drake does not: the roster gives it the breath and not the wings, and it lies on
   its town with them folded; its breath still takes either row.
3. **The Old Drake is the boss line at 26 come down whole to a sweeper's 0.85,** 1,226 hit points and
   21d7+32, as the test drake is the brute's, with the drakes' breath; no shape of the harness is a
   boss that sweeps, so it is set off the line (`OFF_LINE`) for Old Cinder's gate to set (#515), as
   the bosses with turns of their own are.
4. **Fire does nothing to either,** `immune: ['fire']`, though the roster's rows do not say so: they
   are grown in the vents, as the cinder beetle and the ember salamander are. Neither is weak to
   cold, which the roster does not give them either.
5. **Sizes 1.3 and 1.8:** the Cinder Drake a brute's, the Old Drake the Brood Drake's (MONSTERS §8.4),
   drawn with its wings folded inside the tall boss's crown, at 0.80 of its height. Settled and
   broader, it stands over its young though they hang in the air.
6. **The family is a frame and a Build** (`src/ui/monsters/drakes.ts`): height, breadth, head, how
   high it hangs, how far its wings open and beat, its colours, sulphur and scars, so the drakeling
   and the Brood Drake (MONSTERS §11) are a Build each. Nothing of the picture book's dragon: no long
   neck, no great wings, no spines, but a hunched thing with a head of basalt turned to the company.
   The breath's embers are its declared parts (`tools/smoke.ts`), four at most.
7. **Each is owed to the box that first places it:** the Cinder Drake to G10 (#511, the proposal in
   §7; to G11, #513, if the owner does not take it) and the Old Drake to Old Cinder (#515).

Decided by delegate for #520 (the heavy machines), each the owner's to overturn:

1. **Each stands on the line at its level** (MONSTERS §4.4): the Stoker a brute at 25 (687, 5d8+8),
   the Sentry an elite at 26 (584, 6d8+5) and the Sentinel on the boss's line at 26 (1,442,
   24d8+29), for #516's gate to tune; G11 restates the Stoker and the Sentry on the line made again
   (#513's 17). They carry no gold (MONSTERS §2); the parts they carry, the first sentry's and the
   Sentinel's, named, are the boxes' to give with their items (#514, #516); F11 does not give the
   first sentry's (#514's 18).
2. **Fire does not touch the Stoker,** `immune: ['fire']` on top of the machine's own (lightning
   bites; sleep, holy and nature do nothing). The Sentry and the Sentinel are the machine and no
   more: they come up through the doors, not out of the vents' fire, and the roster gives them
   nothing of it.
3. **The Sentry's long arm holds,** `inflict: paralysed` at 0.15, the test elite's own note, so it
   stands on the elite's line whole, at its speed of 15.
4. **The Sentinel is plain:** no call and no sweep, the boss's line and the kind's. Whether it calls
   the sentries up through the door after it (MONSTERS §3.3, calls) is #516's, with its gate.
5. **Their sizes:** the Stoker 1.3 and squat; the Sentry 1.45, the tallest under the tall boss's
   1.5, so it stands over the stoker by its height and not its breadth; the Sentinel 2, drawn inside
   the tall boss's crown (the smoke test measures it at 0.814 of its height, under 0.82).
6. **One family, of the hull's own make:** plain plate on ruled seams, rivets, a drum at every joint
   and the same legs, a rod of a thigh, a drum at the knee, a greave and a flat foot; one fire in
   all three, seen only where the plate opens. Nothing of the knockers' smooth shells on rods and
   their lamp, nor of the keepers' robe and fingers.
7. **The chisel's mark is cut once in each,** small, beside the door, on the chest and on the left
   of the two doors: the makers' mark is on all the crew's machines (MONSTERS §2), and these are the
   same makers' hands, the heaviest of them.
8. **A `Build` of body, reach, breadth, legs, knee, fire and soot,** and the plate and joints from
   the def's tint, so the flue walker, the loader and the core sentry are each a Build and a tint
   (MONSTERS §11).
9. **Each is owed to the box that first places it:** the stoker to G11 (#513), the vents' fight (the
   stoker at H10's springs, §6's 49, strikes the line if it is built first); the sentry to F11
   (#514), whose road has the first sentries after the Stone (§4.6), before #516's door, though G11
   places the first (#513's 10) and F11 a group of two (#514's 10); and the Sentinel to the Ember
   Stone (#516). Nothing is declared
   apart: each is one silhouette.

Decided by delegate for #547, each the owner's to overturn:

1. **Each crossing is written once with both ends** in `content/crossings.ts`, as #539's are: the
   Compact's ship gains its Cinderport end, and the Rider's ride (`RIDERS_RIDE`) and the last
   crossing (`LAST_CROSSING`) are new. Each is open from the start, no flag and no lock (EXPANSION
   §2.2).
2. **Nothing is sold toward a place not built** (#539's 2): every end here names #512, Akordu's
   #526 and the isle's Phase 1.5, so none runs yet. Jago sells the ship the day #512 writes her steps.
3. **An end may be a zone,** a camp or a shore, as the atlas names its place (`wold`,
   `hearthisle`): it lands on the map of the box that holds it (`landing.map`), since a zone is built
   a box at a time, and its floor is the zone's (its area's when it has none). The check holds the
   box to the zone. The world map draws a link to a zone sold both ways as built, as it does a
   town's, so Kitto's boat to Wrackholm (#177) is now drawn once, under its name.
4. **The fares keep #539's rule,** 12.5 gold a level of the dearer end's floor for each day: the
   ride 325 (the Wold's 26) and the last crossing 350 (Hearth Isle's 28); the ship stays 600.
5. **The days keep Kitto's pace,** some five squares an hour: the ride's 95 from the gate at 206,288
   to Akordu at 120,250 take a day, leaving at 14 and coming in at 9; the last crossing's 110 over the
   Sound take a day, sailing at 20 and landing at 16, as the ship does.
6. **The ride is on a Rider's horse** (`by: 'horse'`), a crossing by road on the atlas's `coach`
   way, so its terms are the Riders' own ("The Riders ride at 14:00 and come in the next day at
   09:00") and never a coach's.
7. **The ship is halved at Cinderport for a member of the Compact** (`q_compact_run_done`, Kitto's),
   by her master at the Compact's steps; Kilnhaven halves none (docs/areas/kilns.md §4.14), as #539
   left it. Nobody halves the ride or the last crossing.
8. **The ride lands just inside the gate,** on the town's own map, as Kilnhaven's coach lands in its
   inn yard: G10's trading ground outside is where the Riders come down and the horses wait (#511),
   and a Rider by the gate sells the ride (#512). At Akordu it lands at the horse-lines on D8's map.
9. **The last crossing says where it goes and no more:** the menu names Hearth Isle and the landing
   sees the rim and the light rising from within; to a company under 28 the harbourmaster says folk
   go over strong and come back quiet. Nothing says where the Stones lead.
10. **A save made at a landing loads there** by #164's save, which keeps the map and the square: the
    check rides a fixture to a camp on a Wrackholm box and loads it there. The isle's waits on Phase
    1.5's map, and each end's own on its place.

Decided by delegate for #548, each the owner's to overturn:

1. **The flag is `q_ember_lit`,** set the moment the Stone's third part is in and it lights. The
   Stone's dungeon sets it (#516: the hand-in's last part, in the same step that brings the Sentinel
   up), the chapter reads it for the Stone lit and the road on (#518, §5) and the sentries and the
   Sentinel stand `after` it (#449, #516). It is the Stones' own form (`q_tide_home`,
   `q_grove_mended`, `q_anvil_closed`) and not `_done`, which would read as the chapter's end
   (docs/areas/kilns.md §9, #540). Nobody renames it or adds a second.
2. **The Hearth counts the lighting, not the parts.** A part carried, or one or two set, restores
   nothing; the Stone counts once all three are in and it lights (call 2: a hand-in that shuts
   nothing before it). No flag per part is decided here: #516 chooses how the hand-in remembers the
   parts that are in, and the Hearth reads only the lighting. It counts whatever else the company
   has restored, as the Anvil Stone does: the road's order is not a lock (§5).
3. **A flag, owed to #518 in `UNSET`** (`tools/tests/quests.ts`, #415), as `q_anvil_closed` was
   (docs/areas/kilns.md §9, #540): the Stone's dungeon is not built, and the structure check reads a
   group's `after` as a real flag, so every box may place its sentries `after` it meanwhile. The
   first map to set it drops the entry there.
4. **The sentries need no new field.** `after` (#41) is the whole of it, and the Hearth's check
   (`tools/tests/stones.ts`) holds a fixture box carrying a group of the test elite at the Sentry's
   level (26) `after` the Ember Stone's own `restored` condition, so the flag that counts is the flag
   they wait on: not there before the Stone is lit, standing after it, in the way and fought. The
   Sentry (#520) and its groups on every box (#449) are not built here, nor the words on the roads
   and in Cinderport that say the roads are not what they were.
5. **No wording changes.** The title, the sky and the almanac read the count, which stands at five
   Stones already, so the Ember Stone is one step more wherever it falls: four in the table as it
   stands, the Peak Stone having no condition yet, where the almanac says "It hardly wavers now."
   The Hearth burning steadier than in all our lives (STORY) is the count rising, and the chapter's
   to say if it says it (#518), not the almanac's.

Decided by delegate for #521, each the owner's to overturn:

1. **The rooms are §4.4's eight, which are the issue's.** The ship's master, the harbourmaster and
   the Rider sell their passages as people with no room, as Kitto sells his boat on Saltmouth's
   quay; the guildsman and the factor are in their halls' rooms.
2. **The ids are `cinderport_` and the business,** as Rime Lodge's are `rime_`; the chandler's is
   `cinderport_chandlery` as Kilnhaven's is, the Compact's house `cinderport_factor` for its keeper
   as `kilnhaven_harbourmaster` is and the guild's `cinderport_cartographers`, since two halls open
   here (§6). They are save keys: §4.4 gives them for #512, and nobody renames them.
3. **Cinderport is built of basalt,** the coast's black stone, in pale lime, limewashed above the
   sills where people sit (the inn, the guild's hall, the Compact's house) and bare elsewhere; ash
   lies along the foot of every wall, and vines hang over the windows from the shore's trees.
4. **The column of light is seen from the town,** as the quay's line has it (§4.4): in the temple's
   round window and through the inn's and the Compact's windows, the ship at the quay before it.
   The mountain is seen from the chandler's window and over the yard's wall, smoking by day and red
   at its mouth by night; the yard's fire-baskets are lit only by night.
5. **The temple is the town's,** not the Riders' (their shrine is on the ground, §4.3): a basin of
   Scaldwell's water steams on its altar, carried up from the springs for the healing. No emblem is
   drawn on its linen, since none is decided.
6. **The armourer is the smith's** (#56's 52): a cinder drake's hide laced on its frame to cure by
   the Drakeskin Coat on its stand, so the coat is seen made here; the Basalt Shield, the Flamberge,
   the Slag Mace, a Battle Staff and the Ashwood Bow shown, the Marlinspike and the Cinder Robe not,
   for room.
7. **The chandler keeps the Riders' trade** for the trading days (§4.3): their saddle over a cloth
   woven in red and ochre bands (the room's own until the Wold's are decided), bridles and a halter;
   lamp oil by its clay lamps and the fish off the racks under the wall, dried flat.
8. **The journals' shelf holds three and a gap for the fourth** (#443, call 7): three in one green
   binding against a stone, a book's width empty before it, nothing lettered. The map inks the
   coast, the Sheer, the cone and the road west to where it stops, pins three camps and names
   nothing.
9. **The Compact's house holds one crate under the Helmstow customs seal,** apart in the corner,
   corded and waxed as the crates in G10's hide are (§4.3); nothing says what is in it (§6). The
   ledgers carry no number and the house no device of the Compact's.
10. **The potter's cups are the Ash Husk's:** a beaker flared on a short foot in the husk's own
    red-brown clay (`src/ui/monsters/skeleton.ts`), a band of red slip under the rim or an ash glaze
    run down from it; the inn's mantel holds a row of them, and the kiln is a beehive of brick.

Decided by delegate for #511, each the owner's to overturn:

1. **G10 is laid whole in Cindercoast at 200,286,** core, band 24–25, region `ashfall`, and lists
   the area: its Area takes the nine monsters and the armourer's step, `AHEAD` and `ITEMS_AHEAD` go
   empty and its atlas rows leave the plan for the Area.
2. **The town's wall is a block of building squares,** rows 0 to 2, columns 4 to 13, with the gate
   at 6,2 (206,288, Cinderport's plate) in its face. The harbour and the site at 206,277 are G9's,
   seen over it: the gate's line and the knoll's say masts.
3. **The gate is barred, as J11's and N8's were:** `GATE` is exported and not in `exits` (to
   `cinderport` at 8,14 facing north, which this asks #512 to give it), its square a building, and
   `g10_gate` (not `once`) stands at its front, 6,3. #512 lists it, opens the square and drops the
   event; its way back lands on 6,3 facing south.
4. **The way in is the gate's front:** nothing beside G10 is built and the ship lands in the town
   (#547), so the map starts at 6,3 facing south, where #512's way out and the ride land. The gate
   check holds the nearest groups from there and the walkthrough puts the company down there.
   `CUT_OFF` in `tools/tests/outdoors.ts` owes G10 to #512 (§11).
5. **The roads are the atlas's, made to meet it at the edges,** since the pillars' edge check binds:
   the north edge at 3,0 (G9's road at 203,285) and the west at 0,7 and 0,8 (F10's at 31,7 and
   31,8). The scaffold's crossings at 2,0, 0,5 and 0,6 and its stream's did not meet the atlas
   beyond, and moved (the stream to 14 to 16,0 and 31,22 to 23). No road runs east to the Stair or
   south to the mountain: the atlas has none at those edges, and the ash is open ground.
6. **The stream is crossed on stones** at 18 to 19,3 by the ground and at 26,14 on the ash: shallow
   water needs a swim, and the stream cuts the knoll, the east vines and the hide off from the gate.
7. **Four groups for the brief's seven,** for the pay and the gate: beetles (4), vines (4, not
   roaming), salamanders (4) and one cinder drake, the box's group at 25. The brief's set (beetles 3
   and 3, vines 3, salamanders 2 with the drake) gave 15.08 fights to a rest, past the limit, and
   its mixed group failed the curve's top (24.3, at least 25); two beetle groups of four would pay
   1.43 times the share. The harness's trials, as beetles, vines, salamanders and drakes: 4, 4, 3
   and 2 gave 9.67 fights to a rest (1.31 times the share); 4, 3, 3 and 2 10.43 (1.23); 4, 4, 3 and
   1 11.78 (1.15). These, 4, 4, 4 and 1, give 10.94 (1.22) and keep the brief's one drake.
8. **The §7 proposals are taken:** the Cinder Drake over Cindercoast's shore and the Ember
   Salamander at G10's far end. MONSTERS' Where column is a pull request of its own, as §7 says.
9. **G10 pays 2,449 xp a member,** 1.22 times the doc's scaled share of 2,000 (the doc wins over the
   issue's 1,500): its four groups' 14,695 xp over six. With the other scaled shares (17,450) the
   area comes to about 19,900, 1.02 times the ask (§8). Gold 900: the cairn 300 and a Sapphire Vial,
   the hide 600.
10. **The secret is a clearing walled by the shore's trees,** its mouth a secret door drawn as a
    tree and its hint the vines cut back, the cut ends fresh. Inside, crates under the Helmstow
    customs seal, shards of every colour in them, seen and never said, and the chest: the brief's
    Long Sword +2 and 600 gold. The shards are words: Act IV has no Rift, and an earlier area's
    shard item would count against its Rift.
11. **The step is a person and an event:** `g10_ground` carries the brief's line with "on the grass"
    for "on the ash", the ground being the atlas's grass, and the eldest tells the story in three
    lines, the doc's words last. The quest and its goal are #518's.
12. **The brief's places are each a feature,** and the ash has features for density besides: the
    Riders' fire-ring and tracks, a drake turning over by day (`g10_overhead`, `when: day`: the
    issue's warning of the slopes), a boulder the mountain threw, the ash warming, the stream and
    steam to the east (Scaldwell unnamed). The potter's clay pit and the hermit under the west vines
    have words only (#56's 50 is #519's).
13. **Cindercoast's crossing words are on its zone row:** harder, *The far side begins here, and it
    is harder than the range behind.* and warning, *The far side, and nothing on it would spare you.
    The way back is still open.* Not walked: no box beside G10 is built, and the first that is
    (#510, #513 or #517) walks them.
14. **Novelty claims the drakes' family and the vines' terrain.** Sweep with fire has no `Mechanic`
    token (`src/content/area.ts`; `uses()` reads none), so it cannot be claimed without a systems
    change (§11).
15. **The chapter is owed to #518:** the quests test lists `cindercoast`, `firemount` and
    `emberwaste` as planned and `ashfall` as owing its chapter. The gate figures under the floor are
    owed to #18, as the Whitespine's are.
16. **The climate is the coast's:** summer 24, winter 10, daily 6, damp 0.04 to 0.11, wettest 200,
    fog 0.3, lag 16; smoke comes down off the mountain for fog and the mountain is the thunder.

Decided by delegate for #512, each the owner's to overturn:

1. **The gate is in the town's south wall, at 8,15,** since G10's `GATE` lands on 8,14 facing north
   and G10 lies south of the town; the quay runs along the north side over the harbour, G9's water,
   the Sound past its wall.
2. **The plate is 16×16 in Kilnhaven's form turned on its side:** the street from the gate north to
   the quay, two cross streets, a square inside the gate, the square by the quay and the Compact's
   pier (13,1 to 2) off the quay.
3. **The ship and the last crossing land on the Compact's steps, 13,2, facing south,** on the pier
   under the factor's house (door 13,4); **the ride just inside the gate, 9,14, facing north,** by
   the Riders' rail with the Rider at 9,13 (§4.4's "the Compact's steps, the same steps and just
   inside the gate"; #547's 8).
4. **Jago is the ship's master on both quays,** as Dunstan is the ferry's (#539): here he sells her
   back to Kilnhaven's steps, halved for `q_compact_run_done` (the end's `half`, #547's 7).
   Kilnhaven halves none.
5. **The harbourmaster, Morwenna, sells the last crossing and a nameless Rider the ride** (§10 names
   nothing of the Riders'). Both sell nothing until Phase 1.5 and #526 land the far ends (`sells`
   gives none, #547's 2), and their words name no fare, as Jago's did at Kilnhaven before this.
   Hers say Hearth Isle and no more (#547's 9).
6. **The two halls are persons with rooms, as the Keel is** (`kind: 'npc'`, `interior`, `hall`): the
   Chart House (`cartographers`, 3,8) and the Factor's House (`compact`, 13,4). Each offers and pays
   its Guild's one ladder (`game/guilds.ts`), the Fence's rung among it; no quest is added. The
   Chart House sells nothing: the chandler's carries the kit that Saltmouth's Map Room sells.
7. **The potter's is a person with a room too** (7,9): no ware fits, the cups being no item.
8. **People with words only,** none with a flag, a choice or a quest, so #519, #635 and #448 add
   theirs: Gorran the smith in the armourer's (#521's 6; his shovel-head "will not take a burr"),
   Jenifer the potter (the cups the first folk's shape), Cador Lusk the guildsman (the shelf's gap
   and the hint §4.8 names for #516) and Hendra the factor (Ruan reads her book). Names are the
   coast's trade-English, as Saltreach's and Kilnhaven's are (§10), checked against the content for
   clashes.
9. **Not placed: the Riders' eldest and the mason.** The eldest is G10's, on the trading ground
   outside the gate where §4.4 puts her (#511); `when` has hours, sky and season and no trading
   day. The mason of #56's 48 hides at Sheer Point wanting passage to Cinderport (whitespine.md
   §6), so he stands here only once #504's quest buys it: #504's to place, `after` its own flag.
10. **Prices:** the inn 55 a head (Kilnhaven 35, Rime Lodge 45); the armourer's and the chandler's
    at list (no `prices`); the temple at the engine's (`templePrice`: the stone 80 a level, 2,000
    for a member of 25, the draught's price); the yard to 27 (`trainerCeiling`, 26 + 1) at
    `trainPrice` (1,040 for a member of 26).
11. **The chandler's stock is the Act III provisioners' set plus the Quickening Draught** (`CURES`).
12. **G10's gate is opened as Kilnhaven's was:** `exits: [GATE]`, 6,2 a door, `g10_gate` dropped (not
    `once`, not in `shipped.json`) and `GATE` given the town's gate line; G10's `start` stays 6,3
    facing south.
13. **The atlas:** Cinderport's place is built (`planned`, `name` and `band` dropped, as Kilnhaven's
    were) and its plate kept at the gate, 206,288, where G10's walkthrough holds it; its port site is
    kept at 206,277 on G9's shore (the port check wants the sea within 4) and no longer planned; the
    planned way `cindercoast` to `cinderport` moves from 206,277 to the gate, 206,288.
14. **The reach walk seeds a town's ways out where a crossing lands in the town,** as the gate
    check's `landings` does: the ship to Cinderport reaches G10 at 6,3, and `CUT_OFF` in
    `tools/tests/outdoors.ts` is empty.
15. **No secret:** the town contract asks none (neither precedent has one), and the density floor is
    met without.
16. **The quay's line is an event where the street meets the quay** (8,3), the doc's words exactly;
    by night the renderer draws the column of light in the sky to the north on its own.
17. **Banners either side of the gate,** on the wall (7,15 and 9,15), an ember red.

Decided by delegate for #513, each the owner's to overturn:

1. **The map's id is `firemount_g11`, not the issue's `cindercoast_g11`:** the box is laid in Fire
   Mountain, the §4 table's zone (the scaffold counts 708 of its squares Fire Mountain's and 316
   Cindercoast's), and a map's id is its zone's and its box's (`cindercoast_g10`, `highspine_i11`).
   Overturn before it merges if wanted: an id is a save key after.
2. **G11 is laid whole in Fire Mountain at 200,318** (the zone row's `maps`), core, band 25–25 as
   the brief has it, region `ashfall`.
3. **The cone is lettered by hand,** the volcano over the atlas's mountain with its mouth at the
   atlas's site and the rest of the ridge mountain; the three flows are the atlas's lava as cut.
   Lava is open ground in the engine, as the Kilns' is, so the flows cut nothing, and `g11_crust`
   says the crust bears a company.
4. **The way in is G10's south edge,** each row as the atlas cuts it, with no road on either side:
   open ash, as G10's 5. The box is reached over G10 alone, and the outdoors reach walk, which seeds
   Cinderport's ways out since #512, reaches it: it takes no `CUT_OFF` entry.
5. **The vents are three mouths and the middle one is barred,** `VENTS` exported and not in `exits`,
   its square solid, as G10's gate is; `g11_vents` (not `once`) says the brief's line each time at
   its front. #22 opened it (§11; §9, #22's 2).
6. **The secret is the scavenger's hole in a ring of rock** (`r`, which no climber passes), its far
   end barred as the vents are (`HOLE`), with rock behind it so that it opens only from the hole.
   The hint is the brief's: the rope, and the heir's word of a man who went down beside the forge.
   #22 opened its far end the same way (§9, #22's 2).
7. **Grimsforge is a block of building squares three wide:** two wide dressed 60% of its 10 wall
   faces and the art check's cap is 50% under 100; three wide dresses 41.7% of 12. The heir and the
   scavenger have words only: the Barbarian's trainer entry and quest are #448's, and #56's 52 is
   #519's.
8. **The furnace-draught is a vent in the mountain's foot,** no wider than an arm: no way in.
9. **Five groups for the brief's nine,** for the gate. The second drake group, a pair, is cut: with
   it, in place of the cone's three salamanders, the box read 8.88 fights to a rest (2,953 xp a
   member), under the aim. The harness's trial of these five, at 25 and 400 seeds, gave 10.18
   (2,768); the gate reads 10.23.
10. **The box's top is a sentry after the Stone:** the curve wants the hardest group at
    max(floor + 1, top - 2), 26 however narrow the band, and the roster's only 26 that is no boss is
    the sentry, "all of Ashfall, once the Ember Stone is lit" (MONSTERS §8.2), which §7's gap has a
    box hold its top in. A set without it read 9.93 (2,450) with no group at 26. It takes the
    sentry's first placing from F11 (#514): `UNPLACED` drops it. MONSTERS' Where column already
    covers G11. Its 2,067 xp count in G11's clear.
11. **G11 pays 2,768 xp a member,** 16,605 over six (the salamanders' groups 3,812 and 2,859, the
    stokers' fight 5,880, the drake 1,987, the sentry 2,067): 1.04 times the doc's scaled share of
    2,650 (the doc wins over the issue's 2,000). The area: G10 2,449, F10 and E10 1,841 and G11
    2,768, 7,057 of the 19,467 asked; with the other scaled shares (12,950) about 20,000, 1.03 times
    the ask (§8). Gold 1,000: the cairn 300 and a Sapphire Vial, the hole 700; the War Hammer +1 at
    the forge.
12. **The Great Axe +2 is new:** `scavengersAxe`, a +2 of Sunderwood's `great_axe` made with `P` in
    `ashfall/items.ts`, as the Kilns' pluses are made on other areas' bases; 1,500 gold, inside the
    window (5,500).
13. **Novelty adds the heavy machines' family** (`machines`), the volcano and the vent underfoot and
    the volcano on the map (the Fire Mountain site built). Lava was the Kilns' first, so it is not
    claimed; the sweep has no token.
14. **The Fire Mountain and Grimsforge sites lose `planned`,** built on G11, as Highcell's site was
    with J11; Meridian Camp's site and place stay planned (#22).
15. **Cindercoast's harder words now read true from the mountain as from the Stair:** *The far side,
    and it is harder than the range over the Sheer.* for *The far side begins here, and it is harder
    than the range behind.* (#511's 13). The world says a land's words on any crossing into it (a
    new land counts as rising), so a company under 24 off G11 onto G10 heard "begins here" and
    "the range behind", both false there. The warning words are kept. Fire Mountain takes the
    world's own words, true from G10 ("harder than the road behind").
16. **The crossing line is walked both ways:** G10's 28,31 onto G11's 28,0 at 22 (the warning), 23
    (the harder words) and 25 (the name alone); straight back, nothing; then G11 onto G10 at 22 and
    21, Cindercoast's words. G10's 13 is met.
17. **Restated on the line as #549 made it again (#661):** the stoker, a brute at 25, 687 hit points
    to 665, its blow 5d8+8 and xp 1,987 the same; the sentry, an elite at 26, 584 to 597 and 6d8+5
    to 5d8+4, its hold (paralysed, 0.15) and xp 2,067 the same. Both leave `RESTATE`. The Cinder
    Drake is untouched (G10's, `OFF_LINE`).
18. **Points for density go up the flows' beds:** the lava runs into the mountain in beds 20 steps
    from anything, so `g11_bed` and `g11_crust` stand on them. G11's 15 events are all at two lines.
19. **The shrine at the track's head blesses endurance** (`g11_shrine`), where the ash is trodden
    flat.

Decided by delegate for #517, each the owner's to overturn:

1. **Both boxes are laid whole in the Ember Waste,** country, region `ashfall`: F10 at 168,286 and
   E10 at 136,286, on the zone row `emberwaste`, F10 first, the zone's way in. E10 is laid as the
   atlas cuts it, the Wold's steppe and grass with it (13).
2. **The band is 24–26, not the brief's 25–26:** the curve holds a map's hardest group at
   max(floor+1, top-2), so a floor of 25 asks a group at 26, and no roaming monster stands at 26
   before the Stone (§7). A floor of 24, the beetles', lets the drake at 25 hold the top; 26 is kept
   as the top for the sentries (#449) and the Wold's side. The zone row keeps its planned 25–26, and
   the gate holds at 24, so at 25 a fortiori.
3. **The roads are the atlas's, made to meet it at the edges** (the pillars' edge check binds) **and
   square to square** (a company moves on four sides; the scaffold's road steps diagonally in
   places): F10 adds 30,8, 29,10, 27,13, 25,16 and 23,19; E10 adds 3,10, 8,14, 15,20, 17,20, 20,24
   and 23,26. F10's south rows carry the road along columns 5 to 11 of row 31, where F11's lies at
   its row 0 (the scaffold had 1 to 4 and 12 to 13); E10's leaves its west edge at 0,6, where D10's
   lies at its 31,6 (the scaffold had 0,7); F10's 0,29 is road to meet E10's 31,29.
4. **The Druid's outcrop is in the north-west,** as the brief says: rock, 14 squares at 1 to 5 by 1
   to 4, on the atlas's ash; the atlas's own rock stays in the south-west, the road running along
   it. The Archdruid sits in its lee at 6,3, 28 squares from the road: words only, his trainer and
   quest #448's.
5. **The milestone reads THE WOLD 2, CINDERPORT 4,** not the brief's CINDERPORT 7: G10's stone, by
   the gate, says THE WOLD 6, so 7 would put this one past the Wold. It stands at 3,29, where the
   road turns west along the rocks, about 2.6 of G10's units (half a box each) from the Wold's grass
   at 144,300.
6. **The Waste has crossing words of its own,** on its zone row: harder, *Nothing grows out here,
   and what lives on the ash is harder.* and warning, *Nothing on the ash would spare you. The coast
   is behind you still.* Walked over G10's west edge at 21, 22 and 24 and straight back, nothing
   said, and Cindercoast's words back over at 22 and 21, walked for the first time (#511's 13). F10
   onto E10 says nothing: one land, one floor.
7. **Three groups for the brief's seven or so, the fewest that pass:** F10 cinder beetles (4) below
   the vines, nearest the way in, and a cinder drake on the rocks over the road's west run; E10 two
   cinder drakes on the Hills' crest at the far end. The brief's set (F10 beetles 3, salamanders 3,
   drake 1; E10 beetles 3, drake 1) gave 15.56 and 15.01 fights to a rest (limit 13.5) and paid
   2,410 (1.30 times); a lighter group raises the figure and an added one the pay. The harness at
   24, by group: beetles of 3 9.7, of 4 6.5, salamanders 3 16.6, one drake 29.8, two drakes 10.5.
   Cut: the salamanders at the flow's end, F10's second beetles and E10's beetles (#524's issue has
   beetles come over from the Waste: its to place).
8. **Each box holds a drake, the top:** F10 needs a group at 25 as E10 does (2), and one drake alone
   is too light a day for E10 (29.8), so E10 has the doc's two drakes together (§7). §7's proposal
   of the Cinder Drake on the Hills is taken; MONSTERS' Where column is a pull request of its own.
9. **Pay 1,841 xp a member,** 0.99 times the doc's scaled share of 1,850 (the doc wins over the
   issue's 1,400): F10 1,178 (4 × 1,271 + 1,987 over six), E10 662 (2 × 1,987 over six). Ashfall
   stands at 4,290 of 19,467 and, with the other scaled shares (15,600), at about 19,890, 1.02 times
   the ask (§8; 7,057 and about 20,000, 1.03 times, with G11, #513's 11; 12,036 and about 20,340,
   1.04 times, with H10 and F11, #510's 9, #514's 11). Gold 1,200: F10's cairn 250 and a Sapphire
   Vial, E10's cairn 250 and a vial, the grave 700.
10. **The secret is the grave in the Hills, as the doc has it** (the issue's Meridian cache is
    superseded): a cairn of rock at 15 to 18 by 26 to 28, its mouth a secret door drawn as rock at
    18,27 (154,313), facing east to the Stone. The hint is the doc's line (`e10_back`, 19,27);
    inside, the woman on her saddle, seen and never named, and the chest: the Horn Bow +2 and 700
    gold. The cairns that face west are the crest cairn, the cairns on every rise and six single
    rocks on the rises.
11. **The Horn Bow +2 is Saltreach's bow with a plus** (`horn_bow+2`, in Ashfall's `items.ts`):
    1,050 gold, bonus 6, inside the window (5,500). An Act II bow in Act IV, as G10's Long Sword +2
    is, kept as written; the owner may want the act's step with a plus (the Ashwood Bow) instead.
12. **The brief's places are each a feature** (§4.9), the Archdruid and the hermit words only; the
    Riders' sky-stone on the crest (8,3, accuracy) is the Wold's brief's shrine, so #524 has it.
13. **E10's zone and band lines are the Waste's:** a map is one land, so all of E10, steppe and
    grass too, is the Ember Waste for the crossing line and the band, though the atlas gives 805 of
    its squares to the Wold and 219 to the Waste. The Wold's line is said where a company crosses
    into a map laid in the Wold (D10, #527, over E10's west edge at 0,6), in the Wold's zone row's
    words (it has none yet); #524 walks them, or says its crest line as an event.
14. **The Wold's seed at 140,296 moves to 134,296,** just west of E10: the atlas check holds each
    zone's seed inside the zone, and E10, laid for the Waste, now holds that square. 134,296 keeps
    the Wold's border where it was.
15. **Novelty claims nothing new:** lava is on the road before Ashfall (the check said so); steppe
    is first laid here, the Wold's ground (#543), and left unclaimed (§11).
16. **F10 and E10 need no `CUT_OFF` entry:** they join only G10, which the reach walk now reaches by
    the town's ways out (§9, #512's 14), so the outdoors test reaches them without one. The gate
    figures under the floor are owed to #18, as G10's are.

Decided by delegate for #510, each the owner's to overturn:

1. **H10 is laid whole in Cindercoast at 232,286,** core, band 24–24, region `ashfall`: the doc's
   and the issue's band 24, where the scaffold gave the zone's 24–25. The curve's top is then 25,
   which the stoker meets. The map starts at 31,20 facing west, the square the Stair comes onto
   from I10.
2. **H10 is Cindercoast's first map,** first in the zone row and in the Area's `maps` (road order),
   so the gate's "nearest the way in" judges the Stair's foot; G10's gate front is still judged as
   the boat's landing through the town (`landings`). The walkthrough walks H10 first.
3. **The Sheer is cliff at columns 30 and 31, rows 0 to 19** (the atlas had cliff at 31, rows 0 to
   13, and pines at 29 and 30), meeting I10's cliff column square for square. The Stair's last
   flights are road at 27 to 31,20, the notch's lip rock at 28,19 and cliff at 29,19; the landing,
   26,20, is the atlas's link end (258,306). South of the Stair the Sheer is I10's, so its ground
   goes on as pines at 28 to 31, rows 21 to 31 (ash at 31,25 and 26), matching I10's column 0.
4. **The track stops at G10's vines.** It runs from the landing west to the edge at 0,11 and comes
   out onto G10's vines at 31,11. G10 has no road on its east edge and the atlas none at the seam,
   so G10 is not touched: its east vines lead on to its stones at 18 to 19,3 and the gate.
5. **The secret is the issue's,** the springs' source down a vent the water comes up, not §4.2's
   cleft south of the Stair: south of the Stair the Sheer is I10's, so H10 has none to stand a
   cleft in. A secret door at 8,18 in a rock outcrop beside the pools, the vent at 8,19 and the
   hoard at 8,20: 750 gold and the brief's Plate Mail +2 ("coin of every age" is the vent's line).
   The hint is the brief's own, a path trodden in the ash up to the rock and ending at it, and the
   keeper hints it in words: "Some days it is not there." What the giants let fall is a thing seen
   in the pines under the Sheer.
6. **Scaldwell is six pools of shallow water in the ash** (7 to 9,15; 8 to 10,16), the event
   `h10_pools` on the site's square; the bathhouse a block of building squares with no interior;
   its keeper a Rider with four lines, words only (#56's 49, the quest #519's); the Riders' shrine,
   of endurance. The site loses `planned` on the atlas.
7. **One stoker, at 6,17 beside the rock,** not roaming (seen at its work, MONSTERS §8.2) and
   respawning at 2880: no quest names it yet, so it is a plain group. #519 makes it 49's fight
   and may take the respawn away ("break it and the springs go cold for good").
8. **Four groups for the brief's five:** beetles (3) just past the foot, beetles (4) on the sand
   toward the dune, vines (4) in the shore's first trees, not roaming, and the stoker. The proposed
   cinder drake is not placed: the stoker is the box's group at 25, and the pay and the fights to a
   rest sit inside their aims without it.
9. **H10 pays 2,449 xp a member,** 1.09 times the doc's scaled share of 2,250 (the doc wins over
   the issue's 1,700), under the 2,812 cap: its four groups' 14,696 xp over six (3 × 1,271, 4 ×
   1,271, 4 × 953 and 1,987). Gold 1,000: the cairn 250 and a Sapphire Vial, the vent 750. The
   Plate Mail +2 at 1,500 is the area's dearest find, inside the 5,500 window.
10. **The stoker is restated on #549's line,** 665 hit points for 687, 5d8+8 and 1,987 xp the same,
    as G11's did (#513's 17): the same lines, so one stays, and G11, merged first, took the stoker
    out of `RESTATE` (`tools/tests/harness.ts`) and `UNPLACED` (`tools/tests/maps.ts`).
11. **Novelty claims the landmark `springs`** (Scaldwell, no longer planned) and not the family
    `machines`, which G11 (#513) claimed first: the stoker is one, and the check wants it claimed once.
12. **The stream is the atlas's:** in at the south edge at 4 and 5,31 (5,31 made shallow, the
    atlas's river being at 237,318, for the edge check) and out at the west edge at 0,22 and 23
    into G10's. It is crossed on stones at 3 to 4,29, so the corner west of it, with its heron, is
    walked within the box.
13. **Cindercoast's crossing words (#511's 13) are walked down the Stair:** the warning at 21, the
    harder line at 22, the land's name alone at 24. Straight back up, the land is not named: from
    I10's 0,20 the king's giants are seen, I10's own lines.
14. **The brief's places are each a feature:** the camp Under the Sheer (27,17), the cairn at the
    Stair's foot (27,21), the milestone where the track leaves the sand for the vines (11,12,
    CINDERPORT 5) and the lookout on the dune's crest (20,1, Sheer Point). For density, things
    seen: the Sheer's face, a goat on it, the dune, driftwood, the vines at the water, a deer in the
    vines, planks behind the bathhouse, steam from the foot, a crust on the ash, black glass, a shod
    horse's bones (G10's Riders' horses are unshod) and the stream.
15. **The gate's figure two under is owed to #18:** at 22 a company wins every H10 fight
    (`cindercoast_h10: under`), as G10's and the Whitespine's do.
16. **Cindercoast's road** (`ROADS`, `tools/tests/gate.ts`) is H10's foot beetles, then G10's
    beetles and salamanders.

Decided by delegate for #514, each the owner's to overturn:

1. **The map is `emberwaste_f11`, laid whole in the Ember Waste at 168,318** (the zone row's `maps`,
   third), core, band 25–26 as the brief, region `ashfall`. The scaffold counts the Waste 678
   squares and Fire Mountain 346, not the issue's 951, 40 and 33.
2. **The way in is F10's south edge at F10's corner,** the start 16,0 facing south: the ash at
   columns 15 to 31 is open on both sides, while the road at 5 to 11 runs along the rocks and goes
   nowhere south (rock under it). G11's west edge is a second way in, walked. No `CUT_OFF`: the
   outdoors reach walk gets here over F10 and G11.
3. **The north edge is the atlas's cut,** F10's row 31 square for square; **the east is lettered to
   G11's west edge square for square** where the atlas differed (mountain at 31,4 for ash; ash at
   31,24 and 31,25 for lava), so that both flows meet G11's.
4. **The crater is a pit of chasm,** seen across and never walked, with the roofs standing out of it
   as building squares. Levitate floats over it and nothing is there to find. A chasm is no wall, so
   it costs nothing at the art check.
5. **The way down into Old Cinder is barred as G11's `VENTS` is:** `CRATER` exported and not in
   `exits`, its square a building; `f11_lip` (not `once`) says its line each time. #515 opens it
   (§11).
6. **The Paladin's trainer is an old Lightbearer on the lip,** beside the way down, words only (his
   trainer entry and the Paladin's quest are #448's); his word is of the lamp at the bottom of the
   town, gone out.
7. **The Stone is a pillar at the Ember Stone's mark, its iron scaffold four pillar uprights at its
   corners,** on a field of cinders drawn as dirt (there is no cinders ground), 35 squares in a diamond
   within four of it, forty with the Stone and the uprights. Its way down is barred as the crater's is: `STONE`, the Stone's own
   square, solid, where the atlas's way meets it; `f11_stone` (not `once`) says the step's line each
   time. #516 opens it (§11).
8. **The west flow is the atlas's, two rows wide through the ash and on into the rock** to its end
   at the doc's 174,330; 10,12 and 10,13 are lettered lava so that the channel joins, an island of
   open lava in the rock being unreachable. The causeway of slag is stone ground, the Stone seen
   from its north end, the milestone at its south end.
9. **The milestone reads THE WOLD 4, CINDERPORT 4, not the brief's CINDERPORT 5:** walked on the
   outdoors from 18,14, the Wold's grass (144,300) is 74 steps (4.6 units of 16) and Cinderport's
   gate 61 (3.8). F10's stone says THE WOLD 2 at 42 steps and CINDERPORT 4 at 59, so 5 would put the
   town a unit farther from here than from F10's stone, where it is two steps nearer.
10. **Four groups for the brief's six, the fewest that pass:** beetles 4 below the crater, nearest
    the way in; ash husks 4 by night on the crater's east rim; one cinder drake on the flow, the
    hardest before the Stone; two sentries together `after` `q_ember_lit`, the box's top at 26. The
    brief's six at threes (beetles 3 and 3, husks 3, drake 1, sentry 1 and 1) read 18.3 fights to a
    rest at 25 (limit 13.75) and paid 2,788. The harness at 25, 200 seeds, each alone: beetles 3
    11.3, beetles 4 7.5, husks 3 18.6, husks 4 11.8, drake 30.0, sentry 1 29.9, sentries 2 8.5;
    these four 11.0, the gate 10.82. Cut: the second beetle group (on the field's ash) and the
    second sentry group, a sentry alone being too light a day (two singles read 15.7 with the rest).
11. **F11 pays 2,530 xp a member,** 15,177 over six (the beetles 5,084, the husks 3,972, the drake
    1,987, the sentries 4,134): 1.05 times the doc's scaled share of 2,400 (the doc wins over the
    issue's 1,800). The area, with H10's 2,449 (#510's 9): 12,036 of the 19,467 asked; with the
    other scaled shares (8,300) about 20,340, 1.04 times the ask (§8). Gold 1,000: the cairn on the
    rim 300 and a Sapphire Vial (`potion_sp_great`), the hollow 700.
12. **The secret is the builders' hollow in a spur of rock authored on the west edge,** its mouth a
    secret door. The tools are seen and never said to be the Cut Stone's mate; the hint is the
    rock's face scored in straight lines at the field's west edge. The Chain Mail +2 is the game's
    `chain+2` (Sunderwood's, in J3's cache): 800 gold, inside the window (5,500); no new item.
13. **The ash husk is restated on the line made again (#661),** and placed first here: a soldier at
    25, 340 hit points to 320 and 4d8+3 to 4d8+2, its speed (10), armour, look, sprite and xp (993)
    the same. It leaves `RESTATE` and `UNPLACED`.
14. **The hermit sits in a cleft cut into the rock's east face** (15 and 16,9 opened), words only:
    he counts the stokers walking out of the mountain at dusk, and in forty years never one more or
    one less. The camp is in a cleft (10,18, opened). `f11_dusk` says something moves on the ash
    under the mountain at dusk.
15. **The shrine at the field's edge is the first Cinderport folk's** and blesses personality:
    Ashfall's others bless speed, accuracy and endurance (twice).
16. **Old Cinder's and the Ember Stone's marks stay `planned`,** as Meridian Camp's did on G11
    (#513's 14): each marks a way down to a dungeon not built. #515 and #516 take `planned` off
    their sites and places.
17. **Novelty claims nothing new:** the chasm is the Sunder's, and dirt, pillars and groups `after`
    and `when` are on the road before; `after` on a whole area (#548) has no token. The area claims
    enough already.
18. **The first sentry's part is not given** (§4.6's Finds; §5; #520's heavy machines 1): a def's
    drop would give every sentry it, G11's too, and the part is unnamed (#516 or #518 names the
    parts). Whether the first sentry carries one, and how, is the chapter's builder's to decide.
19. **Points for density:** 18 events, all at two lines, a cairn, a shrine, a camp, two people and a
    chest. The road along the north row (5 to 11,0) is reached on the map only from F10, so
    `f11_road` stands on it; 0,18 is lettered rock (a lone ash square nine steps from anything).
20. **The crossing words are the Waste's, none changed:** over F10's south edge the same land, so
    not named: at 25 nothing, at 23 and 24 the Waste's harder words alone (the floor rises a level),
    at 21 and 22 its warning; over G11's west edge the Waste named with its words; straight back,
    nothing.
21. **The Waste's road (`ROADS`) is unchanged,** F10's and E10's groups: the atlas's road only
    skirts F11's north row.

Decided by delegate for #22 (the vents), each the owner's to overturn; the dungeon's own are in
docs/areas/meridian_camp.md §8:

1. **The Ember Stone's parts are `ember_part1`, `ember_part2` and `ember_part3`,** in the chapter's
   order (§5). The vents place the first, "Ember Stone's First Part", found in the furnace's mouth
   and setting no flag; Old Cinder's (#515) and the corridors' (#22's second level) are to be named
   so by their builders, and the Stone's hand-in (#516) takes the three. The ids are save keys once
   merged.
2. **G11's middle mouth and the scavenger's hole are open:** `VENTS` and `HOLE` are in its `exits`;
   26,16 and 31,17 are ash; the landings are the ones #513 asked for, 16,1 facing south and 29,30
   facing north, back up onto 27,16 facing east and 31,16 facing west (§4.5; §9, #513's 5 and 6).

Decided by delegate for #22 (the corridors), each the owner's to overturn; the dungeon's own are in
docs/areas/meridian_camp.md §8:

3. **The Stone's third part is `ember_part3`,** "Ember Stone's Third Part", a quest item in a chest
   at the corridors' end, setting no flag, as the first does. Old Cinder's (#515) is still to be
   `ember_part2`, and the hand-in (#516) takes the three (§5).
4. **The corridors pay 4,399 xp a member, over the brief's 2,700 and its cap of 3,375,** because the
   Brood Drake alone pays 2,862 and the gate's day then needs a hard corridor group beside the
   sentry. The pick keeps every kind the brief names, two drakelings in place of six; the cheapest
   mix that passes the gate pays 3,895 and places no drakelings or cinder drakes (the dungeon's §8,
   the corridors' 3). Ashfall's clear is now 18,581 xp a member of the 19,467 asked, 0.95, with the
   Old Drake (Old Cinder) and the Sentinel (the Ember Stone) still to come: their bosses alone take
   it to about 1.24 times the ask. Pay by level keeps a company that goes down early from
   overshooting, and the Brood Drake and the Old Drake are optional kills: the chapter never passes
   them.

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

- **Kept:** Ashfall, Cindercoast, Fire Mountain, the Ember Waste and the Ember Stone, plain names
  for plain things, as the Grove and the Grove Stone are; Cinderport and Old Cinder, the coast's
  English for the port and the town it was before the mountain buried it, the one place lending its
  name to the other (NAMES §3); Meridian Camp, the Guild's name for the Company's last camp; the
  Giants' Stair and the Sheer, the Whitespine's (#502); the Cinder Hills and the Ember Sound, the
  plan's, each a name on a border Ashfall shares.
- **Ids stay** where they exist (NAMES §3): the plan's sites are renamed in `atlas.ts` and the
  sweep is one change through `src/`, `tools/` and `docs/`; the issues keep the old names until they
  are edited.

## 11. What was cut

- **F12,** 445 squares of land, 194 a company could walk: the south-west lava flow's end and the
  mountain under the rim, with nothing on the atlas or in the docs.
- **E12,** 62 squares, none walkable: mountain.
- **The I11 sliver,** 187 squares under the Sheer, the Whitespine's Peak Stone box. Not void: the
  Whitespine's, and not Ashfall's to build.

About 500 squares void, and 187 another area's. The country behind, 4,454 squares in seven boxes,
is parked, not cut (#522, §4.10).

Owed, from G10 (#511):

- **Cinderport's gate stood barred** until #512 built the town, which listed `GATE` in G10's exits,
  opened the square, dropped `g10_gate`, set the landing at 8,14 facing north and met the atlas's
  planned way at the gate (§9, #512's 12 and 13).
- **The outdoors reach test's `CUT_OFF`** (`tools/tests/outdoors.ts`) owed G10 to #512, which seeds
  a town's ways out where a crossing lands in the town, as the gate check's `landings` does: it is
  empty (§9, #512's 14).
- **Sweep with fire cannot be claimed as new:** the novelty check has no `Mechanic` token for it
  (`src/content/area.ts`), so it takes a systems change, if the owner wants one (§9, #511's 14).
- **Four groups stand for the brief's seven** (§4.3, §9, #511's 7): the brief's set gave 15.08
  fights to a rest, past the limit, and two groups of beetles of four would pay 1.43 times the
  share; its mixed group of salamanders and a drake failed the curve's top, so the drake stands
  alone at 25.
- **Cindercoast's crossing words** were walked by G11, the first box beside G10, which reworded the
  harder ones (§9, #511's 13, #513's 15 and 16); H10 walks them down the Stair (§9, #510's 13).
- **The hide's Long Sword +2** is the brief's, and Act II's find (420 gold, as K2's and L3's): the
  ladder and the window pass. The owner may want the act's step with a plus there instead (§4.1).

Owed, from Cinderport (#512):

- **The Riders' eldest and the mason are not placed in the town** (§9, #512's 9): the eldest is
  G10's and a trading day is no `when`; the mason is #504's, `after` the quest that buys his
  passage from Sheer Point.
- **The ride and the last crossing are sold by nobody** until their far ends are built, Akordu
  (#526) and Hearth Isle (Phase 1.5): the Rider and the harbourmaster have the passages and `sells`
  gives none (§9, #512's 5). The Quickening Draught at Akordu stays owed to #526 (§3).
- **No quest and no pay:** the halls offer and pay their Guilds' ladders and add none, and the four
  who speak have words only, so #519, #635 and #448 add theirs (§9, #512's 6 and 8); a town pays
  nothing, so the 600 the plan gave the halls' quests is unpaid (§8).

Owed, from G11 (#513):

- **The vents stood barred** until #22 built Meridian Camp's first level, which listed `VENTS` in
  G11's exits, re-lettered 26,16 ash, kept `g11_vents` (27,16) and set the landing asked for, 16,1
  facing south; its way back up lands on 27,16 facing east (§9, #513's 5; #22's 2).
- **The scavenger's hole stood barred at its far end** until #22 listed `HOLE`, opened 31,17 and set
  the landing asked for, 29,30 facing north, out behind the stokers' furnace room; its way back up
  lands in the hole on 31,16 facing west (§9, #513's 6; #22's 2). The walkthrough's lines on the
  shut mouths changed with them.
- **Five groups stand for the brief's nine** (§4.5, §9, #513's 9): the second drake group, a pair,
  is cut, for with it the box read 8.88 fights to a rest, under the aim.
- **The sentry's first placing is taken from F11** for G11's top (§7, §9, #513's 10): F11 (#514)
  met the curve's top rule too and holds its top in two sentries together after the Stone (§9,
  #514's 10); the roster answers it only with a sentry after the Stone or #22's drakeling.
- **The warlord's heir and the scavenger have words only:** the Barbarian's trainer entry and quest
  are #448's, and #56's 52 is #519's (§9, #513's 7).

Owed, from F11 (#514):

- **Old Cinder's way down stays barred** until #515 builds the dungeon: `CRATER` (19,4, world
  187,322; to `old_cinder` at 8,1 facing south) is exported from `emberwaste_f11.ts` and not in
  `exits`. #515 lists it, re-letters 19,4 to ground an exit can stand on, drops or rewrites
  `f11_lip` (18,4) and sets the landing it is asked for; its way back up lands on 18,4 facing east.
  The atlas's planned link `{ from: 'firemount', to: 'old_cinder', a: [190, 318] }` names Fire
  Mountain, though F11 is laid in the Waste: #515 may move it to `emberwaste` and the lip (§9,
  #514's 5 and 16).
- **The Ember Stone's way down stays barred** until #516 builds the dungeon: `STONE` (8,24, world
  176,342; to `ember_stone` at 8,1 facing south) is exported and not in `exits`. #516 lists it,
  opens the square, drops or rewrites `f11_stone` (8,23, the step's line) and sets the landing it is
  asked for; its way back up lands on 8,23 facing north (§9, #514's 7). The walkthrough asserts both
  mouths shut (`passable` is not `ok`), the crater's square a building and the Stone's a pillar:
  #515 and #516 change those lines when they open them.
- **Four groups stand for the brief's six** (§4.6, §9, #514's 10): the second beetle group and the
  second sentry group are cut, for at the brief's sizes the box read 18.3 fights to a rest, past the
  limit of 13.75.
- **The milestone reads CINDERPORT 4** where the brief has 5 (§9, #514's 9).
- **The first sentry's part is not given** (§5, §9, #514's 18): a def's drop would give every sentry
  it, G11's too, and the part is unnamed. The chapter's builder (#516 or #518, which name the parts)
  decides whether and how.
- **The old Lightbearer and the hermit have words only:** the Paladin's trainer entry and quest on
  the Lightbearer, at 18,5, are #448's (§9, #514's 6 and 14).
- **MONSTERS' Where column** for the husk (F11's rim, by night) is a pull request of its own, if the
  owner wants it (§7).

Owed, from F10 and E10 (#517):

- **The Archdruid's trainer entry and the Druid's quest** on him are #448's: he stands in the
  outcrop's lee at F10's 6,3, words only (§9, #517's 4).
- **The sentries** `after` the Stone, one group on each box's road at the band's top, 26, are
  #449's: neither box places one (§9, #517's 2).
- **E10 is laid bare of the Wold's:** its monsters, quests, outriders and crossing line are #524's
  (docs/areas/glasswold.md §4.2), the line said where D10 is crossed (#527) or by #524's crest event
  (§9, #517's 13).
- **Steppe is unclaimed.** E10 lays steppe first, so the Wold's "New here: steppe underfoot"
  (docs/areas/glasswold.md §4.2) cannot be claimed: the novelty check would say it is on the road
  before it. The owner's: Ashfall claims steppe, or the Wold claims something else (§9, #517's 15).
- **Three groups stand for the brief's seven or so** (§9, #517's 7): the salamanders at the flow's
  end, F10's second beetles and E10's beetles are cut for the gate and the pay; #524's issue has
  beetles come over from the Waste, its to place.
- **The milestone reads CINDERPORT 4** where the brief has 7, G10's stone saying THE WOLD 6 (§9,
  #517's 5).
- **Lava has no effect underfoot:** `passable` has no rule for it, so the flow that seals the Glass
  is words only (E10's 24,30).
- **The grave's Horn Bow +2** is Saltreach's bow with a plus, an Act II find at 1,050 gold, as G10's
  Long Sword +2 is at 420: the window passes. The owner may want the act's step with a plus there
  instead, the Ashwood Bow (§9, #517's 11).

Owed, from H10 (#510):

- **49's quest is #519's:** the keeper has words only and the stoker is a plain group, respawning at
  2880; #519 adds the choice and may take the respawn away, so that the springs go cold for good
  (§9, #510's 6 and 7).
- **No cinder drake stands at H10:** the brief's drake over the shore's far end is not placed, the
  stoker holding the top at 25; the pay and the fights to a rest sit inside their aims without it
  (§9, #510's 8).
- **The brief's cleft moved to the vent:** the Plate Mail +2 and the coin of every age are the
  vent's, the Sheer south of the Stair being I10's (§9, #510's 5).
- **The track ends at G10's vines:** no road runs into G10, whose east edge has none, nor does the
  atlas at the seam. The owner's, if a road should run on (§9, #510's 4).
- **The gate's figure two under is owed to #18:** at 22 a company wins every H10 fight, where §8
  asks no more than one in four (§9, #510's 15).
- **The Stair's link** keeps `from: 'firemount'`, though its `a` end, 258,306, lies in Cindercoast's
  H10: untouched, and no check reads it (§9).

Owed, from the iron corridors (#22); the dungeon's own are in docs/areas/meridian_camp.md §10:

- **The Stone's builder (#516) reads `ember_part3`,** in a chest at the corridors' end (`mc2_part`,
  2,27, on `meridian_camp2`), with the vents' `ember_part1` (`mc1_part`, 23,24) and Old Cinder's
  `ember_part2` (#515); the first and the third set no flag (§9, #22's 1).
- **The camp's stair stays barred** until the third level lists `STAIR2`
  (docs/areas/meridian_camp.md §8, the corridors' 13).
