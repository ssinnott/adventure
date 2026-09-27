# The Foreland: step I of the road, to its edges

The Foreland is the first step on the road of levels (DESIGN §9, EXPANSION §2.2): Helmstow, its
coast and Callow Downs, band 1–5. This is its area doc (EXPANSION §4, §6 and §8.2): where the atlas
puts it, what is built, what the atlas and the docs put in it that is not, and the plan for building
the rest, box by box. Figures are measured on main at `4129f47` (27 September 2026) with `worldGrid`
(`src/game/atlas.ts`).

It was the Shelf until its naming pass (§10). Its ids are as they were: the area, its zone and its
map are `shelf`, the Downs `downs`, the city `harrow`.

---

## 1. Where it is

The atlas (`src/content/atlas.ts`) makes the Foreland two zones:

| Zone | Band | Squares | Built |
|---|---|---|---|
| The Foreland | 1–5, its map's | 2,284 | 871: the Foreland map, laid at 200,30 |
| Callow Downs | 2–5 | 6,577 | none |
| The area | 1–5 | 8,861 | a tenth |

Squares are the ones the atlas gives each zone, shallows and rivers included. Without the shallows
the area is 8,582 squares, about 8.4 zone maps (EXPANSION §1 has 8.3). It runs from x 94 to x 231
and from the rim down to y 120.

**The grid.** Every outdoor map is one box of the grid the Foreland and Thornmark sit on: 32 squares
a side, with its corner at x = 8 + 32i and y = −2 + 32j, cut to the world at its edges (EXPANSION
§8.2). A box is named as the old maps were, by its column's letter and its row's number: the
Foreland is G2 and Thornmark H2. The world map's border letters squares 8 columns west and 2 rows
south of these, since the first two maps were not laid on it (§9, #66).

On the grid the Foreland's map is G2, and the Downs are seven boxes: F2 and F3 beside it, E2 and
E3, and D2, D3 and D4 (§4). The row above, C1 to G1, is the rim. C2 and C3 hold a strip of the
Downs' cliff top among Saltreach's land, and E4, G3 and G4 a few squares of shore in the sea.

Its edges:

- **North: the rim,** the band of mountains inside the world's edge, about nine squares deep. It
  stands right behind Helmstow's north wall, and the maps of row 2 end in it.
- **East: the ridge, with the Scarth through it** into Thornmark (5–10). The only built way out.
- **South: the Wyke.** The Mewstone lies in its mouth, in G4, a box of sea round the islet. The
  atlas gives it to the Deepthorn (110 of its 116 squares), since an islet goes to the nearest zone
  across the water. It is off the road, and waits for boats.
- **West: Kestrel Edge,** a cliff from the rim to the Salt Gulf, above Saltreach's Upper Water
  (10–12). The atlas's border keeps to the cliff's lip except at its two ends: in the rim it drops
  straight down through the mountains at x 94, and at the south end it takes in a strip of low
  ground at the cliff's foot (x 109–120, y 99–121), so that the road down Kestrel Edge
  (`atlas.ts:387`) ends on the Downs. Once D3 and D4 are built the border there is their edges: the
  cliff runs through both boxes, and D4 holds the road's last squares down it.
- **South-west: the Salt Road down Kestrel Edge** into the Delta (10–12). The atlas opens it only
  after step II (`opens: 2`); under one road, lightly held, it is open from the start (#40).

Between the two zones the area map (M, then Tab) draws a dotted line from the rim down through
Brockholt and the fields to Gullwick. It follows nothing on the ground. It is where the walk out
from the Foreland map meets the walk from the Downs' seed in Brockholt (180,30), and it moves as
soon as a Downs map is laid, since a built zone starts its walk from its whole map: once F2 is
built, the Foreland zone is its map and no more, and the line is the map's west edge. Until then
the Foreland zone holds about 780 walkable squares of field and wood west of its map that are void
in play.

`node tools/worldmap.ts out.png --zones` paints it.

## 2. What it is for

The start of the road and the first half of Act I (DESIGN §9): the company's first contract, its
first dungeon and its first Rift, the Ashen Hand's creed on a wall for the first time, and the night
the light went out, seen from the shore. Every kind of monster but the machine is met here at its
gentlest (MONSTERS §5). The Downs are that night on the coast: the fishermen steer by the Hearth,
and with it failing the coast is dark, and the dark has people in it who were waiting for it
(MONSTERS §5.2). The weather is the Foreland's: mild, wet, and foggy off the sea in the autumn.

## 3. What is built

| Map | Kind | Band | What is there |
|---|---|---|---|
| Helmstow | town, 16×16 | 1–4 | the Hearthlight Inn, the Chapel of the Lanterns, Mottram's Stores, the Lantern Guildhall (spells to tier 2), the Warden Drillyard (training to 6), the Gilded Eel and its four rumours, Vask and his contract |
| The Foreland | outdoor zone, 32×32 | 1–5 | the road, woods, marsh and beach; the Ashcombe farm; Hale's checkpoint at the Scarth; ten groups |
| Ashcombe Cellar | dungeon, 16×16 | 1–4 | four rings; the dead Lantern and her survey wand; the Rift and its Warden |
| Brandy Hole | dungeon, 16×16 | 2–4 | smugglers, crabs and the drowned; the captain's den and the iron key |
| The Seam | dungeon, 16×16 | 3–5 | the Ashen cult's galleries; the Ashen Deacon and the Cargo Ledger |

The quests are The Quiet Farm (Vask) and The Cargo Ledger (Hale); the monsters are MONSTERS §5.1's.
Of the secret doors, the cellar's (mill 4,7) and Brandy Hole's (greywater1 10,11) have no hint on
the near side yet (#51); the Seam's has the carving over a blank stretch of wall.

## 4. What is still to build

About 7,700 squares of land, all of it void in play: some 6,400 a company could walk, and the rest
the rim and Kestrel Edge. On the grid (§1) the Downs are seven boxes and a dungeon, and the boxes
hold 5,654 of those squares and 5,570 of the walkable ones:

| Box | Name | Kind | Band | Land | What is there | Its step of the quest | Issue |
|---|---|---|---|---|---|---|---|
| F2 | The road west | country | 2–3 | 1,024: fields, Brockholt's wood | Coldharbour; Brockholt; the Salt Road west from Brandy Hole's beach | none | #47 |
| F3 | Gullwick | core | 2–3 | 300, and 724 of sea | the village at the Wend's mouth, its boats and a camp; wreckers on the shore by night; crows in the stubble | Wenna's mother | #47 |
| E3 | Crowness | core | 3–4 | 857, and 167 of sea | Crowness Light and its keeper; the Salt Road west; a lampman and four wreckers in fog; the gibbet and its crows; shore crabs under the light | the keeper's log of the eleven | #67 |
| E2 | The Wend's fields | country | 3–4 | 1,024: fields, the Wend | crows over wolves in the stubble; the track from Coldharbour up to the Berth | none | #68 |
| D2 | The chalk hills | core | 4–5 | 1,024: the chalk | wolves by day and the Black Dog by night; the Berth's mouth | in the Berth, below it | #69 |
| D3 | The west downs | country | 4–5 | 944 | open down to the lip of Kestrel Edge | none | #71 |
| D4 | Kestrel Edge | country | 4–5 | 481, and the cliff's foot | the Salt Road down the cliff, and bandits with their archers on it | none | #72 |

**The Berth** is a dungeon of its own, one level of 16 by 16, band 4–5, entered from D2: the Queen's
guard two by two down the passage, and her captain at the empty bier (MONSTERS §5.2). Its step is
the barrow opened, and only her signet gone (#70).

The core is the three boxes that hold a step of the quest, built at full density; the rest is
country, built to the looser floor with the wilderness features (EXPANSION §2.1 (b) and §5.3, #45).
The bands rise from the way in to the far end, as the gate asks (EXPANSION §5.2).

**The order** is the Salt Road's, and the quest's: F2 and F3, the pilot (#47); then E3, E2, D2 and
the Berth, D3 and D4. They are the epic #65, with the grid (#66), the Lodestone (#73) and tier 3
(#74). F2 is first because it is the only box that meets the Foreland, and the road
west runs into it. The steps come in the order the road reaches them: Gullwick, Crowness, the Berth.
D3 comes before D4 because the Salt Road cuts a corner of D3 on its way down, and the way into Act
II comes last.

The places, as the atlas and the docs have them:

| Place | Box | What the docs say | On the atlas |
|---|---|---|---|
| The chalk hills | D2, and the north of D3 | wolves, and the Black Dog round the Berth by night (MONSTERS §5.2) | hills, 1,824 squares of the Downs |
| The fields round Gullwick | F2, E2 and F3 | crows over wolves in the stubble | farmland, 1,127 squares |
| Brockholt | F2 | nothing yet | a wood astride the two zones, its north tip in the rim's row |
| The Wend | E2 and F3 | nothing yet | a river from the rim down to Gullwick, cutting a corner of E3 |
| Gullwick | F3 | Wenna's village, where her mother asks the company to find her (DESIGN §9) and where STORY opens; an old shanty singer who teaches the Bard's second prestige (#19) | a planned village at 172,70 |
| Crowness Light | E3 | the keeper who counted the eleven and wrote down the gaps (DESIGN §9, STORY); the Cleric's second prestige (#19); shore crabs under it | a planned lighthouse at 140,88, inland of the point (about 152,89) |
| Coldharbour | F2 | a retired Warden captain's farm; the Knight's second prestige (#19) | a planned farm at 176,42 |
| The Berth | a dungeon, entered from D2 | the Queen's barrow, opened, and only her signet gone (DESIGN §9); band 4–5, her guard two by two down the passage and her captain at the empty bier (MONSTERS §5.2) | not on the atlas |
| The Salt Road | F2, F3, E3, a corner of D3, and D4 | the wreckers and their lampman in fog; crows at the gibbet (MONSTERS §5.2) | a planned road, and the way down the Edge |
| The Lodestone | G2, the built map (21.5,4) | "already intact; tutorial" (DESIGN §4) | a planned site; nothing in the game |
| The Mewstone | G4 | nothing yet | an isle, the Deepthorn's |

## 5. The one quest here

DESIGN §9 gives the Downs three steps, and none is built. The plan puts one in each of the core's
boxes, in the order the Salt Road reaches them:

- in Gullwick (F3), Wenna's mother, asking the company to find her;
- at Crowness Light (E3), the keeper who logged the night the Queen died: the Hearth went out eleven
  times, and he wrote down the gaps between;
- in the Berth, below D2, the barrow opened, and only the Queen's signet gone.

The Salt Road west, into Act II, starts here. The Foreland's chapter is The Quiet Farm (#42), and
every zone on the road holds at least one step of the quest (EXPANSION §5.8). The Downs are one
zone of seven boxes (§9), so the pilot's step at Gullwick is the zone's, and the other two come
with their boxes. STORY opens at Gullwick on the night the light went out, and the company reaches
Helmstow in the morning; a new game opens in Helmstow.

## 6. Side quests

#56 drafts eight for the Foreland, levels 1 to 4, for the owner to take or leave: The Bell That Rang
Twice and The Well That Tastes of Iron in Helmstow, Who Lived at Ashcombe, The Boat With No
Name-Board at Gullwick and on the coast below Crowness Light (F3 and E3), Oil for the Lamp at
Crowness Light (E3), Riders in the Dark at Coldharbour and on the road to the Berth (F2 and E2), The
Clerk's Seal at Brandy Hole and The Rest of the Survey Team in the coast woods. The three in the
Downs wait on their boxes, and the Well waits on Helmstow's keep (#17).

## 7. Encounters, and what is new

MONSTERS §5.2 has the Downs' roster and fights: the Carrion Crow, the Wrecker and the Lampman, the
Barrow Guard, the Black Dog and the Barrow Captain; crows over wolves in the stubble; a lampman and
four wreckers on the Salt Road on a foggy night; the Berth, the Downs' hardest place. Their drawings
are #46.

New in the Downs, for the novelty check (EXPANSION §5.4): the birds, a new family; hills and
farmland as terrain (#44); groups that walk only by night or in fog (`when`, #41).

## 8. The numbers

- **Experience.** One clear of the area pays 1,660 xp a member today, just past level 4 (1,650).
  The curve (EXPANSION §5.2, #31) gives an area the climb from its floor to the next area's floor,
  divided by 0.75: 2,800 / 0.75, about 3,730. The Downs are where the other 2,070 or so come from.
- **Gold.** A clear pays about 2,530: 1,065 in chests, about 765 in drops and 700 in rewards.
  Training six members from 1 to 5 costs 1,500, so gold holds.
- **The gate.** #38 reports the Foreland outside the starting thresholds. The Rift Warden, the
  Smuggler Captain and the Deacon are won 93 to 99% of the time at their maps' floors, where a boss
  should be won about half the time. The Seam is won 66% of the time two levels under its floor,
  where the gate wants a quarter. The area as one is won about 89% of the time at level 1. The
  pilot settles them, by retuning or by moving the thresholds (#47).
- **Spells.** Tier 3 comes at level 4, inside the band (`spellTierAt`, `src/game/party.ts:143`), and
  Helmstow's Lantern Guildhall sells to tier 2 (it sets no `maxTier`; `src/ui/screens.ts:409`).
  EXPANSION §4 has an area's towns sell its band's tier.

## 9. Decisions

Decided by the owner on 27 September 2026:

1. **The grid.** Every outdoor map is one box of the grid the built maps sit on (§1), so a map's
   place is its box, and whatever is not built is whole boxes. Borders become box edges as boxes
   are built, and the rim's row above the Downs is left unbuilt (§11).
2. **The pilot** (#47) is F2 and F3, the road west to Gullwick: F2 is the only box that meets the
   Foreland, and F3 holds the Downs' first step. Gullwick's box is two-thirds sea, so the two are
   about 1.3 maps of land, and between them they measure a country box and a core box, the two
   floors the pilot tunes (EXPANSION §5.3).
3. **Zones hold several maps.** The Downs are one zone of seven boxes, F2 and F3 from the pilot on;
   today a zone holds one (`AtlasZone.map`, `src/game/atlas.ts:82`; #66). A zone to a box would ask
   a step of the quest of every box the road crosses (EXPANSION §5.8), bare country included.
4. **Gullwick** is a village on F3: its houses, its boats and Wenna's mother as features, as the
   Ashcombe farm is on the Foreland map, and a camp to rest at (#45). No businesses, so no new
   interiors.
5. **The Berth** is a dungeon of its own: one level of 16 by 16, entered from D2 (#70).
6. **The Lodestone** is a stone to see, beside Helmstow on the Foreland map, with a Lantern who
   tells a new company what a Stone is, so that the cut Grove Stone reads as wrong when the company
   finds it (#73).
7. **The names** (§10).

Proposed, for the owner, each in the issue that would build it:

- **The core** is F3, E3 and D2, the boxes that hold a step of the quest; the other four are
  country (§4).
- **Tier 3** is sold by Helmstow's Lantern Guildhall (`maxTier: 3`), so that the band's tier is
  sold in the band (§8; #74).
- **The world map's lettering** moves onto the grid, so that the border names each box (§1; #66).
- **Crowness Light** stands on the point, about 152,89, rather than inland at 140,88 (#67).
- **The Berth** goes on the atlas in D2, about 118,42, with a track up to it from Coldharbour across
  E2 (#68 and #69). #56's Riders in the Dark rides it.
- **The Wind Cave** (`atlas.ts:332`), Saltreach's cave in the face of Kestrel Edge, moves a square
  west into C3, so that D3 does not hold it (#71).

## 10. Names

The area's naming pass, by the rules of `docs/NAMES.md`. Each name is the Foreland folk's, or one
of the old names the first crew left (marked *old*).

| Was | Now | What it means | Also thought of |
|---|---|---|---|
| the Shelf | the Foreland | the land in front of the mountains, facing the sea; *old*, faintly | |
| Harrow | Helmstow | *old*: "the helm's place", the Crown's seat in the old word for a crown | |
| Harrow Downs | Callow Downs | the bare downs; and callow, like the companies that meet them first | Chaldon Downs |
| Harrow Bay | the Wyke | the bay, in the old word Gullwick's wick comes from | Mewstone Bay |
| Harrow Light | Crowness Light | the light on Crowness, the crows' headland; *old* | |
| the Harrow Stone | the Lodestone | the stone that shows the way; *old* | |
| the Ledge | Kestrel Edge | the edge the kestrels hunt along | the Bulwark, *old* |
| the Queen's barrow | the Berth | the barrow's name, older than the Crown's; *old* | |
| Warden Pass | the Scarth | the notch in the ridge | Thorngate |
| Captain's Farm | Coldharbour | a cold shelter: an old roadside name the farm kept | Ellerby |
| Gull Isle | the Mewstone | the gulls' rock | |
| Greywater, and its caves | Brandy Hole | where the cheap brandy came from | Kelp Hole |
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

## 11. What was cut

- **The rim's foothills,** C1 to G1: 1,622 squares, nearly all of them mountain, and 414 a company
  could walk. The maps of row 2 end in the rim (§9).
- **The scraps** of the Foreland's land in boxes that are other areas' or the sea's: the Downs'
  cliff top in C2 and C3 (272 squares, 221 of them walkable), which goes with Saltreach's boxes,
  and a few squares of shore in E4, G3 and G4.
