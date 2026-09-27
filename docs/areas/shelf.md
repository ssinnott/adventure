# The Foreland: step I of the road, to its edges

The Foreland is the first step on the road of levels (DESIGN §9, EXPANSION §2.2): Helmstow, its
coast and Callow Downs, band 1–5. This is its area doc (EXPANSION §4, §6 and §8.2): where the atlas
puts it, what is built, what the atlas and the docs put in it that is not, and what the owner has
to decide before the rest of it is built. Figures are measured on main at `5dee2b7` (27 September
2026) with `worldGrid` (`src/game/atlas.ts`).

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
and from the rim down to y 120, in the border's lettered squares C1 to H4.

Its edges:

- **North: the rim,** the band of mountains inside the world's edge, about nine squares deep. It
  stands right behind Helmstow's north wall. In play the Foreland map's north ring is the end of
  the world today.
- **East: the ridge, with the Scarth through it** into Thornmark (5–10). The only built way out.
- **South: the Wyke.** The Mewstone lies in its mouth, and the atlas gives it to the Deepthorn (110
  of its 116 squares), since an islet goes to the nearest zone across the water.
- **West: Kestrel Edge,** a cliff from the rim to the Salt Gulf, above Saltreach's Upper Water
  (10–12). The area's border keeps to the cliff's lip except at its two ends. In the rim it drops
  straight down through the mountains at x 94, a few squares east of the cliff, where there is
  nothing to follow. At the south end it leaves the cliff and takes a strip of low ground at the
  cliff's foot, about eight squares wide (x 109–120, y 99–121), so the road down Kestrel Edge
  (`atlas.ts:387`) ends on the Downs and not in the Delta.
- **South-west: the Salt Road down Kestrel Edge** into the Delta (10–12). The atlas opens it only
  after step II (`opens: 2`); under one road, lightly held, it is open from the start (#40).

Between the two zones the area map (M, then Tab) draws a dotted line from the rim down through
Brockholt and the fields to Gullwick. It follows nothing on the ground. It is where the walk out
from the Foreland map meets the walk from the Downs' seed in Brockholt (180,30), and it moves as
soon as a Downs map is laid, since a built zone starts its walk from its whole map. Until then the
Foreland zone holds about 780 walkable squares of field and wood west of its map that are void in
play.

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
Each secret door has a hint on its near side: the cellar's (mill 4,7) a cold draught at 4,6
(`mill_draught`), Brandy Hole's (greywater1 10,11) drag marks at 9,11 (`gw1_drag`), and the Seam's
the carving over a blank stretch of wall.

## 4. What is still to build

About 7,700 squares of land, all of it void in play: some 6,400 a company could walk, and the rest
the rim and Kestrel Edge. Laid out on the Foreland map's own grid, for scale, that is five zone maps
that are mostly land and seven that are part rim, coast or cliff, with a few slivers.

The places, as the atlas and the docs have them:

| Place | Where | What the docs say | On the atlas |
|---|---|---|---|
| The chalk hills | the north-west of the Downs | wolves, and the Black Dog round the Berth by night (MONSTERS §5.2) | hills, 1,824 squares of the Downs |
| The fields round Gullwick | the middle of the Downs | crows over wolves in the stubble | farmland, 1,127 squares |
| Brockholt | a wood astride the two zones, west of Helmstow | nothing yet | a wood |
| The Wend | a river from the rim down to Gullwick | nothing yet | a river |
| Gullwick | 172,70, at the Wend's mouth | Wenna's village, where her mother asks the company to find her (DESIGN §9) and where STORY opens; an old shanty singer who teaches the Bard's second prestige (#19) | a planned village |
| Crowness Light | 140,88, on Crowness | the keeper who counted the eleven and wrote down the gaps (DESIGN §9, STORY); the Cleric's second prestige (#19); shore crabs under it | a planned lighthouse |
| Coldharbour | 176,42 | a retired Warden captain's farm; the Knight's second prestige (#19) | a planned farm |
| The Berth | "up on the hills" | the Queen's barrow, opened, and only her signet gone (DESIGN §9); band 4–5, her guard two by two down the passage and her captain at the empty bier (MONSTERS §5.2) | not on the atlas |
| The Salt Road | the coast road, from Brandy Hole's beach west past Gullwick and Crowness Light, and down Kestrel Edge | the wreckers and their lampman in fog; crows at the gibbet (MONSTERS §5.2) | a planned road, and the way down the Edge |
| The Lodestone | beside Helmstow, on the built map (21.5,4) | "already intact; tutorial" (DESIGN §4) | a planned site; nothing in the game |
| The Mewstone | the mouth of the Wyke | nothing yet | an isle, the Deepthorn's |

## 5. The one quest here

DESIGN §9 gives the Downs three steps, and none is built:

- the Berth opened, and only the Queen's signet gone;
- Wenna's mother, in Gullwick, asking the company to find her;
- Crowness Light's keeper, who logged the night the Queen died: the Hearth went out eleven times,
  and he wrote down the gaps between.

The Salt Road west, into Act II, starts here. The Foreland's chapter is The Quiet Farm (#42), and
every zone on the road holds at least one step of the quest (EXPANSION §5.8). STORY opens at
Gullwick on the night the light went out, and the company reaches Helmstow in the morning; a new
game opens in Helmstow.

## 6. Side quests

#56 drafts eight for the Foreland, levels 1 to 4, for the owner to take or leave: The Bell That Rang
Twice and The Well That Tastes of Iron in Helmstow, Who Lived at Ashcombe, The Boat With No
Name-Board at Gullwick, Oil for the Lamp at Crowness Light, Riders in the Dark at Coldharbour, The
Clerk's Seal at Brandy Hole and The Rest of the Survey Team in the coast woods. Three are set in
Downs places that are not built, and the Well needs Helmstow's keep (#17). #56 was written before
the naming pass and uses the old names.

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
- **Spells.** Tier 3 comes at level 4, inside the band (`spellTierAt`), and Helmstow's Lantern
  Guildhall sells to tier 2 (it sets no `maxTier`; `src/ui/screens.ts:409`). EXPANSION §4 has an
  area's towns sell its band's tier.

## 9. What the owner has to decide

1. **The core.** Which places are hand-built at full density and which are country (EXPANSION §2.1
   (b), #39). The core as §2.1 has it is the area's towns, its Stone and its dungeons' approaches:
   Helmstow and the Foreland map are built, the Lodestone is not, and the Berth's approach is in
   the Downs.
2. **Gullwick.** A town map with businesses of its own, or a village of features on a Downs map. A
   town could sell tier 3 (§8).
3. **The Berth.** A dungeon map of its own, placed on the atlas, or a part of a zone map.
4. **The Lodestone.** What it is in the game: a thing to see, a tutorial or a place.
5. **The first map.** Which of the Downs' places #47's map holds.
6. **More than one map to a zone.** A zone holds one built map (`AtlasZone.map`,
   `src/game/atlas.ts:82`), and the Downs are about six maps of land. The first Downs map can be the
   `downs` zone's; the second needs a zone of its own, or zones that hold several maps.
7. **The borders.** Whether Kestrel Edge should be the border at both its ends, with the road down
   it ending in the Delta; where the Foreland zone should end and the Downs begin, once maps are
   laid; and whether the Mewstone is the Foreland's.
8. **The names** in §10: any that should change again, and whether the old names are too many for
   Act I.

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

Nothing yet.
