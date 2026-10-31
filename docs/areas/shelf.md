# The Foreland: step I of the road, to its edges

The Foreland's doc is three files (EXPANSION §8.2, #1011), and this, its current state, is read
first. Its decisions, the old §9 whole, are `docs/areas/shelf/decisions.md`, appended to and never
rewritten. Its plan is `docs/areas/shelf/plan.md`: the old §4 (the boxes' briefs, §4.1 to §4.9),
§11 (what was cut) and §12 (the bounds, §12.1 to §12.3) whole, then under "Moved from the state"
the lines of the old header, §1, §3 and §5 to §8 that this file does not keep, each under the
heading it had, among them §5.1 (Helmstow between acts), §6's tables, the Hagstone's brief and §8's
thresholds, hours and gear. §2 and §10 stand here whole. The figures are main's at `d1486633` (24
October 2026), as the suites print them.

It was the Shelf until its naming pass (§10). Its ids are as they were: the area, its zone and its
map are `shelf`, the Downs `downs`, the city `harrow`.

## 1. Where it is

The first step on the road of levels (DESIGN §4, §9): two zones of the atlas
(`src/content/areas/shelf/atlas.ts`). The Foreland, band 1–5, is its map, G2 on the grid of boxes 32
squares a side (EXPANSION §8.2), Helmstow in its north. Callow Downs, band 2–5, is eight boxes west
and south of it: F2 and F3; E2 and E3; D2, D3 and D4; and E4, the bounds', the Downs' last shore
(#837). The towns and the dungeons stand off the grid, each entered from a map.

- **North: the rim,** the mountains inside the world's edge, behind Helmstow's north wall. The maps
  of row 2 end in it, and its foothills, C1 to G1, are cut (plan, §11).
- **East: the ridge, with the Scarth through it** into Thornmark, past Hale's checkpoint.
- **South: the Wyke and the sea.** E3's south meets E4, a strand under a low cliff with Hag Hole's
  mouth in it, and E4's south Wrackholm's E5, all water. The Mewstone, in G4, is the Deepthorn's.
- **West: Kestrel Edge,** the cliff over Sylmeer and Saltreach's Upper Water, held by D3 and D4. The
  west of D2, D3 and D4 and the south of D4 meet Saltreach's boxes.
- **South-west: the Salt Road** down the Edge in D4 into the Delta (Saltreach): the way into
  Act II, open from the start, one road, lightly held (EXPANSION §2.2).

Its one edge open on nothing is F3's east, at rows 0 and 1, onto G3, a crumb left unbuilt
(`openOnNothing`, `src/content/areas/shelf/checks.ts`). `node tools/worldmap.ts out.png --zones`
paints the zones.

## 2. What it is for

The start of the road and the first half of Act I (DESIGN §9): the company's first contract, its
first dungeon and its first Rift, the Ashen Hand's creed on a wall for the first time, and the night
the light went out, seen from the shore. Every kind of monster but the machine is met here at its
gentlest (MONSTERS §5). The Downs are that night on the coast: the fishermen steer by the Hearth,
and with it failing the coast is dark, and the dark has people in it who were waiting for it
(MONSTERS §5.2). The weather is the Foreland's: mild, wet, and foggy off the sea in the autumn.

## 3. What is built

Sixteen maps (`src/content/areas/shelf/maps/`), a row each: its id and name, kind, size and band;
what is there, with its groups (the gate's count); and its secret, a door at the squares given, with
the hint on its near side that finds it (the map's `secrets`). Thirteen maps have one.

| Map | Kind, size, band | What is there | Secret, and its hint |
|---|---|---|---|
| `harrow`, Helmstow | town, 16×16, 1–4 | the Hearthlight Inn, the Chapel of the Lanterns, Mottram's Stores, the Lantern Guildhall (spells; the Lanterns' hall), the Warden Drillyard (training; the Wardens' hall), the Gilded Eel; the gatehouse north into the Keep and the harbour postern by the Eel; the side quests' people (§6); Mottram (the Paladin's first prestige) and Aldith (the Bard's); the city changed after Act II and after the endings (§5) | none |
| `keep`, the Keep | town, 16×10, 1–4 | the keep's ward behind the gatehouse: the Regent's proclamation, the chapel, the garden well; Vask and his contract behind the keep's door; Wulfric before the shut armoury (the Knight's first prestige); Wiglaf, the Council's clerk, once the Hand has Wenna | none |
| `shelf`, the Foreland | outdoor, 32×32, 1–5 | Helmstow's walls and gate, the city drawn tall over the land from the back row of the wall's block (a landmark at 16,1); the road, woods, marsh and beach; the Lodestone and Gytha; the Ellerby farm and its store; Hale's checkpoint at the Scarth; Ailith's fire-ring behind the west wood; Brandy Hole's mouth; nine groups | none |
| `mill`, Ashcombe Cellar | dungeon, 16×16, 2–4 | under Ashcombe in E3: four rings, the dead Lantern and her survey wand, the Rift and its Warden; nine groups | 4,7: a cold draught at 4,6 (`mill_draught`) |
| `greywater1`, Brandy Hole | dungeon, 16×16, 2–4 | smugglers, crabs and the drowned; the captain's den and the iron key; the clerk's coat and his seal in the strongbox; nine groups | 10,11: drag marks at 9,11 (`gw1_drag`) |
| `greywater2`, the Seam | dungeon, 16×16, 3–5 | the Ashen cult's galleries round a sealed shrine; the Deacon and the Cargo Ledger; nine groups | 11,5, the vestry: the carving over a blank stretch of wall at 11,6 (`gw2_carving`) |
| `downs_f2`, F2 | outdoor, 32×32, 2–3 | the Salt Road west; Coldharbour and Dunstan; Brockholt and its woodcutter's camp; Siward (the Knight's second prestige); five groups | 12,3, Brockholt's: the bare ground under the holly at 12,4 (`f2_holly`) |
| `downs_f3`, F3 | outdoor, 32×32, 2–3 | Gullwick at the Wend's mouth, Hild and the old man mending nets; the wreckers' far beach and their cave; three groups | 1,16, the wreckers' cave: soot where the far beach ends at 0,15 (`f3_soot`) |
| `downs_e3`, E3 | outdoor, 32×32, 3–4 | Crowness Light, Aldred and his log; the Salt Road in fog; the gibbet; the wreck; Ashcombe in the north-east corner; nine groups | 19,29, the wreckers' niche: soot on the ledge at 18,29 (`e3_ledge`) |
| `downs_e2`, E2 | outdoor, 32×32, 3–4 | the Wend's fields and the ford; the drowned mill; the rookery in the willows, a den; a boundary stone with a riddle; five groups | 22,26, the wheel-pit: the course of dry stone at 22,27 (`e2_wheel`) |
| `downs_d2`, D2 | outdoor, 32×32, 4–5 | the chalk hills, the barrows and the Berth's mouth on the crest; the Cradle; a drove from the dew pond down towards D3, two sarsens and a hollow of turf below the shepherd's hut (#1106); the wolves' den in the chalk pit; the Black Dog by night; seven groups | 20,4, the hollow barrow: the ringing turf at 20,5 (`d2_ring`) |
| `downs_d3`, D3 | outdoor, 32×32, 4–5 | the west downs to the lip of Kestrel Edge; the falconer; the bandit camp by the Salt Road, a den; seven groups | 3,18, the kestrels' ledge: the cleft in the lip at 4,18 (`d3_cleft`) |
| `downs_d4`, D4 | outdoor, 32×32, 4–5 | Kestrel Edge: the Salt Road down the cliff in seven bends to the Delta; the waystation; four groups | 20,13, the runners' cave: the rock worn smooth at 19,13 (`d4_worn`) |
| `berth`, the Berth | dungeon, 16×16, 4–5 | the Queen's barrow under D2: the forecourt, the old Queens' chambers, the Queen on her bier, her guard and her captain, the boss; five groups | 2,7, the captain's niche: the words cut in the forecourt at 13,6 (`berth_hint`) |
| `downs_e4`, E4 | outdoor, 32×32, 4–5 | the Downs' last shore, the bounds': the strand under a low cliff, a shrine and a cairn, Hag Hole's mouth at 3,6; no group | 10,2, the crabber's store: crab shells heaped at 9,2 (`e4_shells`) |
| `hag_hole`, Hag Hole | dungeon, 16×16, 30–32 | the Hagstone's lair: the sea cave the tide floods, the Hag in its narrows, the one group; the box of black wood | 3,3, the dry ledge: lamp smoke over the pool at 3,4 (`hh_smoke`) |

Its content is `src/content/areas/shelf/`: the maps, then a file each for its monsters, items,
chapter, side quests and guild quests, its part of the world (the atlas), its rows of the suites
(the checks) and what other areas take of it (public). Its walkthrough plays the chapter from a new
game a step at a time and walks both cities, the trainers and the city's changes. Its businesses'
rooms are `src/ui/interiors/shelf/`.

## 5. The one quest here

**The Quiet Farm** (`ashcombe`, `src/content/areas/shelf/chapter.ts`), Vask's contract: he hires
the company (`q_ashcombe`); Hild asks at Gullwick after Wenna (`q_wenna`); the dead Lantern, the
survey wand and the Rift in Ashcombe Cellar; the keeper's log at Crowness (`downs_e3:e3_log`); the
wand to Vask (`q_ashcombe_done`), 300 gold and the lead to the Grove Stone. It is done on both
flags and the log. The Berth's bier is an entry, found and never told. The Salt Road west, into Act
II, starts here.

**Helmstow between acts** (plan, §5.1): after Act II (`q_salt_done`) the changed city, the gate shut
to an orcblood member and the harbour postern open, the curfew, the Chapel shut, the prices up and
Ordgar in the Drillyard; once the Hand has Wenna (`q_wenna_taken`) a gibbet and the Eel near empty;
the Council of Helmstow (#764), its verdicts and Wiglaf; after the Heart (#765) and the endings, the
gate open and the ending's words. Nothing is a lock: each door shut has a way round it.

## 6. Side quests

Ten in `src/content/areas/shelf/quests.ts`, a line each (the plan's §6 has #56's table and the
changes to its drafts):

- **The Cargo Ledger** (`greywater`): Hale at the Scarth, for the ledger the Seam's Deacon guards.
- **The Bell That Rang Twice** (`bell`): Osmund in the Chapel; the bell's two witnesses.
- **Who Lived at Ashcombe** (`tenant`): Hob by the Hearthlight's fire; the tenant's paper.
- **The Well Tastes of Iron** (`well`): Mottram; the cart and the mason at the north gatehouse.
- **A Boat With No Name-Board** (`board`): Wat and Hamo at Gullwick; the wreckers' beach (F3).
- **Oil for the Lamp** (`oil`): Aldred at Crowness, Mottram and Vask; the keeper's oil.
- **Riders in the Dark** (`riders`): Dunstan at Coldharbour; the riders at the ford (E2).
- **The Clerk's Seal** (`seal`): Maud at the Eel; the seal in Brandy Hole's strongbox.
- **The Rest of the Survey** (`survey`): Ebba and Ailith; the fire-ring behind the west wood.
- **The Council of Helmstow** (`council`): Wiglaf, the Council's clerk; the case put once (§5).

The guilds' (`src/content/areas/shelf/guilds.ts`): the Wardens' First Watch (the Scarth; 20 gold,
60 xp) and The Cellar's Cult (both cultist bands in the cellar; 60 gold, 240 xp), from the
Drillyard; the Lanterns' First Light (the Hearth from the shore; 20 gold, 60 xp) and The Drowned
Stair (Brandy Hole's dead; 80 gold, 300 xp), from the Guildhall. Their next two are Thornmark's
(plan, §6).

**The Hagstone** (#846), the bounds' artifact: in Hag Hole's box of black wood, behind the Hag
(boss, 32: 2,000 hit points, attack 26, 24d8+26 a blow, off the line), found and never told. The
rumour is the net-mender's at Gullwick, at a meeting after his first. Carried, by any of the ten;
its bearer is never paralysed (a ward).

## 7. Encounters, and what is new

The Foreland's monsters are MONSTERS §5.1's and the Downs' §5.2's, in its monsters file: the birds;
the wreckers and their lampman in fog; the barrow guard, the Black Dog and the Barrow Captain; and
the Downs' own wolves, boars, rats and bandits on MONSTERS §4.4's line. The Downs have groups that
walk only by night or in fog (`when`) and three dens: the rookery in E2, the chalk pit in D2 and the
bandit camp in D3. Hag Hole holds the Hag alone, a kind of the long bodies (MONSTERS §13). The first
area on the road, it claims nothing new (`novel`), and the novelty check asks nothing of the first
(`noveltyFaults`, `tools/tests/pillars.ts`).

## 8. The numbers

- **The curve** (`tools/tests/curve.ts`): a clear gives 4,101 xp a member of the 3,734 it asks and
  4,646 gold of 1,500; a company entering at the floor and clearing three quarters leaves at 5.3,
  the next floor 5. Hag Hole, the lair, is counted in no clear: 3,395 xp a member and 500 gold.
- **The gate** (`tools/tests/gate.ts`): at its maps' floors the area wins 97.3% of its 81 groups'
  fights (`GATE.through`'s aim); two under, 82.7% of 32 groups, listed and inside `GATE.back`'s
  limit. The bosses at their floors and two above: the Rift Warden 55% and 100%, the smugglers'
  captain 50% and 100%, the Deacon 50% and 100%, the Berth's captain 44% and 100%; the Hag 66% at 30
  and 91% at 32.
- **Fights to a rest** (aim 5.5 to 7.5, limit 4 to 10): the Foreland map 4.55, Brandy Hole 4.09,
  the Seam 6.69, the cellar 7.41, F2 6.60, F3 7.07, E3 7.53, E2 6.93, D2 7.59, D3 8.21, D4 7.54 and
  the Berth 7.12, which wins 88.8% at its floor. Six are off their aim, of the gate's eight.
- **Density** (`tools/tests/density.ts`): within 8 squares in the core, the Foreland map 97.4%, F3
  100%, E3 96.9% and D2 92.6%; within 12 in the country, F2 99.5%, E2 96.4% (its furthest square 20,
  on the limit), D3 99.7%, D4 96.7% and E4 100%.
- **The ladder:** rungs 3 and 5 are the Foreland's (`gear`, in its checks): by 3 Mottram's gear
  and the kits' weapons with a plus, by 5 the kits' armour with a plus and the Downs' last finds.

## 10. Names

The area's naming pass, by the rules of `docs/NAMES.md`. Each name is the Foreland folk's, or one
of the old names the first crew left (marked *old*).

| Was | Now | What it means | Also thought of |
|---|---|---|---|
| the Shelf | the Foreland | the land in front of the mountains, facing the sea; *old*, faintly | |
| Harrow | Helmstow | *old*: "the helm's place", the Crown's seat in the old word for a crown | |
| | the Keep | the ward behind Helmstow's north gate, and the keep at its head; short, as the map's frame wants | the Keep's Ward |
| Harrow Downs | Callow Downs | the bare downs; and callow, like the companies that meet them first | Chaldon Downs |
| Harrow Bay | the Wyke | the bay, in the old word Gullwick's wick comes from | Mewstone Bay |
| Harrow Light | Crowness Light | the light on Crowness, the crows' headland; *old* | |
| the Harrow Stone | the Lodestone | the stone that shows the way; *old* | |
| the Ledge | Kestrel Edge | the edge the kestrels hunt along | the Bulwark, *old* |
| the Queen's barrow | the Berth | the barrow's name, older than the Crown's; *old* | |
| Warden Pass | the Scarth | the notch in the ridge | Thorngate |
| Ashcombe, on the Foreland map | Ellerby | the alder farm, lived in, where Ashcombe stood before it moved past Gullwick (#87); a name first thought of for Coldharbour | |
| Captain's Farm | Coldharbour | a cold shelter: an old roadside name the farm kept | Ellerby |
| Gull Isle | the Mewstone | the gulls' rock | |
| Greywater, and its caves | Brandy Hole | where the cheap brandy came from | Kelp Hole |
| | Hag Hole | the sea cave the Hag lies in, behind E4's cliff; hole, the Foreland folk's word for one, as in Brandy Hole (#837) | the Blind Hole |
| the Drowned Shrine | the Seam | the glowing seam the cult dug down to; *old*, faintly | the Undercliff |
| the Greywater Ledger | the Cargo Ledger | the smugglers' book, with its column headed CARGO BELOW | |
| Harrow Provisioner | Mottram's Stores | its keeper's name | |
| the river | the Wend | the winding one | |
| the copse | Brockholt | the badgers' wood | |
| the coast road | the Salt Road | the road down to Saltreach, where Act II begins and takes its name | |

**The old names,** read after Act IV: Helmstow is the helm, where the captain's line sat; Crowness
is the crow's nest, where the keeper watched and counted the eleven; the Berth is where a sailor
sleeps, and the Queens of the line lie there; a lodestone steers a ship and is a field's own stone,
as every Wardstone is; a seam is where two plates of a hull meet; and the fore is the front of a
ship. If that is too many for Act I, the Foreland and the Seam are the first to go plain.

**Kept:** Gullwick, which the story leans on (Wenna of Gullwick); Ashcombe and its cellar, whose
ash is the Ashen Hand's first hiding place; the Hearthlight Inn, the Gilded Eel, the Chapel of the
Lanterns and the Warden Drillyard; and the Lantern Guildhall, whose name is also its members' flag
(docs/NAMES.md §3). The people keep theirs: Vask, Hale, Wenna, Isaure.

**On the map:** the area, its zones and every place above that the atlas letters take their new
names; Kestrel Edge is lettered beside its cliff, as the Scarp and the Sheer are, and the Wend is
named in the atlas.

## Open and owed

- **Owed to no check:** its checks have no `owes`, and the curve, the gate, density and the ladder
  hold the Foreland with nothing owed.
- **Watched, not moved:** Brandy Hole's 4.09 fights to a rest and E2's furthest square at 20 sit on
  their limits' edge (plan, §8). What the owner finds by hand goes here; none yet.
- **The Keep's armoury,** its door and Wulfric's armour, waits on an interior (the Keep's map).
- **Cut:** the rim's foothills and G3's and G4's scraps (plan, §11); the Mewstone is off the road.
- **What is next:** nothing. The plan's briefs are all built, and a new box starts its brief there.
