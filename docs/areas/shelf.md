# The Shelf: step I of the road, to its edges

The Shelf is the first step on the road of levels (DESIGN §9, EXPANSION §2.2): Harrow, its coast
and the Downs, band 1–5. This is its area doc (EXPANSION §4, §6 and §8.2): where the atlas puts
it, what is built, what the atlas and the docs put in it that is not, and what the owner has to
decide before the rest of it is built. Figures are measured on main at `5dee2b7` (27 September
2026) with `worldGrid` (`src/game/atlas.ts`).

The names are the ones the docs and the atlas use today. They may change (§9).

---

## 1. Where it is

The atlas (`src/content/atlas.ts`) makes the Shelf two zones:

| Zone | Band | Squares | Built |
|---|---|---|---|
| The Shelf | 1–5, its map's | 2,284 | 871: the Shelf map, laid at 200,30 |
| Harrow Downs | 2–5 | 6,577 | none |
| The area | 1–5 | 8,861 | a tenth |

Squares are the ones the atlas gives each zone, shallows and rivers included. Without the shallows
the area is 8,582 squares, about 8.4 zone maps (EXPANSION §1 has 8.3). It runs from x 94 to x 231
and from the rim down to y 120, in the border's lettered squares C1 to H4.

Its edges:

- **North: the rim,** the band of mountains inside the world's edge, about nine squares deep. It
  stands right behind Harrow's north wall. In play the Shelf map's north ring is the end of the
  world today.
- **East: the ridge, with the Warden Pass through it** into Thornmark (5–10). The only built way
  out.
- **South: Harrow Bay.** Gull Isle lies in its mouth, and the atlas gives it to the Deepthorn (110
  of its 116 squares), since an islet goes to the nearest zone across the water.
- **West: the Ledge,** a cliff from the rim to the Salt Gulf, above Saltreach's Upper Water
  (10–12). The area's border keeps to the cliff's lip except at its two ends. In the rim it drops
  straight down through the mountains at x 94, a few squares east of the cliff, where there is
  nothing to follow. At the south end it leaves the cliff and takes a strip of low ground at the
  cliff's foot, about eight squares wide (x 109–120, y 99–121), so the road down the Ledge
  (`atlas.ts:385`) ends on the Downs and not in the Delta.
- **South-west: the coast road down the Ledge** into the Delta (10–12). The atlas opens it only
  after step II (`opens: 2`); under one road, lightly held, it is open from the start (#40).

Between the two zones the area map (M, then Tab) draws a dotted line from the rim down through the
copse and the fields to Gullwick. It follows nothing on the ground. It is where the walk out from
the Shelf map meets the walk from the Downs' seed in the copse (180,30), and it moves as soon as a
Downs map is laid, since a built zone starts its walk from its whole map. Until then the Shelf zone
holds about 780 walkable squares of field and wood west of its map that are void in play.

`node tools/worldmap.ts out.png --zones` paints it.

## 2. What it is for

The start of the road and the first half of Act I (DESIGN §9): the company's first contract, its
first dungeon and its first Rift, the Ashen Hand's creed on a wall for the first time, and the night
the light went out, seen from the shore. Every kind of monster but the machine is met here at its
gentlest (MONSTERS §5). The Downs are that night on the coast: the fishermen steer by the Hearth,
and with it failing the coast is dark, and the dark has people in it who were waiting for it
(MONSTERS §5.2). The weather is the Shelf's: mild, wet, and foggy off the sea in the autumn.

## 3. What is built

| Map | Kind | Band | What is there |
|---|---|---|---|
| Harrow | town, 16×16 | 1–4 | the inn, the temple, the shop, the Lantern Guildhall (spells to tier 2), the Warden Drillyard (training to 6), the Gilded Eel and its four rumours, Vask and his contract |
| The Shelf | outdoor zone, 32×32 | 1–5 | the road, woods, marsh and beach; the Ashcombe farm; Hale's checkpoint at the pass; ten groups |
| Ashcombe Cellar | dungeon, 16×16 | 1–4 | four rings; the dead Lantern and her survey wand; the Rift and its Warden |
| Greywater Caves | dungeon, 16×16 | 2–4 | smugglers, crabs and the drowned; the captain's den and the iron key |
| The Drowned Shrine | dungeon, 16×16 | 3–5 | the Ashen cult's galleries; the Ashen Deacon and the Greywater Ledger |

The quests are The Quiet Farm (Vask) and The Greywater Ledger (Hale); the monsters are MONSTERS
§5.1's. Of the secret doors, the cellar's (mill 4,7) and Greywater's (greywater1 10,11) have no
hint on the near side yet (#51); the Drowned Shrine's has the carving over a blank stretch of wall.

## 4. What is still to build

About 7,700 squares of land, all of it void in play: some 6,400 a company could walk, and the rest
the rim and the Ledge. Laid out on the Shelf map's own grid, for scale, that is five zone maps that
are mostly land and seven that are part rim, coast or Ledge, with a few slivers.

The places, as the atlas and the docs have them:

| Place | Where | What the docs say | On the atlas |
|---|---|---|---|
| The chalk hills | the north-west of the Downs | wolves, and the Black Dog round the barrow by night (MONSTERS §5.2) | hills, 1,824 squares of the Downs |
| The fields round Gullwick | the middle of the Downs | crows over wolves in the stubble | farmland, 1,127 squares |
| The copse | astride the two zones, west of Harrow | nothing yet | a wood |
| The river | from the rim down to Gullwick | nothing yet | a river with no name |
| Gullwick | 172,70, at the river's mouth | Wenna's village, where her mother asks the company to find her (DESIGN §9) and where STORY opens; an old shanty singer who teaches the Bard's second prestige (#19) | a planned village |
| Harrow Light | 140,88, on the coast | the keeper who counted the eleven and wrote down the gaps (DESIGN §9, STORY); the Cleric's second prestige (#19); shore crabs under it | a planned lighthouse |
| Captain's Farm | 176,42 | a retired Warden captain's farm; the Knight's second prestige (#19) | a planned farm |
| The Queen's barrow | "up on the hills" | opened, and only her signet gone (DESIGN §9); band 4–5, her guard two by two down the passage and her captain at the empty bier (MONSTERS §5.2) | not on the atlas |
| The coast road | from Greywater's beach west past Gullwick and Harrow Light, and down the Ledge | the wreckers and their lampman in fog; crows at the gibbet (MONSTERS §5.2) | a planned road, and the way down the Ledge |
| The Harrow Stone | beside Harrow, on the built map (21.5,4) | "already intact; tutorial" (DESIGN §4) | a planned site; nothing in the game |
| Gull Isle | the mouth of Harrow Bay | nothing yet | an isle, the Deepthorn's |

## 5. The one quest here

DESIGN §9 gives the Downs three steps, and none is built:

- the Queen's barrow opened, and only her signet gone;
- Wenna's mother, in Gullwick, asking the company to find her;
- Harrow Light's keeper, who logged the night the Queen died: the Hearth went out eleven times, and
  he wrote down the gaps between.

The coast road west, into Act II, starts here. The Shelf's chapter is The Quiet Farm (#42), and
every zone on the road holds at least one step of the quest (EXPANSION §5.8). STORY opens at
Gullwick on the night the light went out, and the company reaches Harrow in the morning; a new game
opens in Harrow.

## 6. Side quests

#56 drafts eight for the Shelf, levels 1 to 4, for the owner to take or leave: The Bell That Rang
Twice and The Well That Tastes of Iron in Harrow, Who Lived at Ashcombe, The Boat With No Name-Board
at Gullwick, Oil for the Lamp at Harrow Light, Riders in the Dark at Captain's Farm, The Clerk's
Seal at Greywater and The Rest of the Survey Team in the coast woods. Three are set in Downs places
that are not built, and the Well needs Harrow's keep (#17).

## 7. Encounters, and what is new

MONSTERS §5.2 has the Downs' roster and fights: the Carrion Crow, the Wrecker and the Lampman, the
Barrow Guard, the Black Dog and the Barrow Captain; crows over wolves in the stubble; a lampman and
four wreckers on the coast road on a foggy night; the barrow, the Downs' hardest place. Their
drawings are #46.

New in the Downs, for the novelty check (EXPANSION §5.4): the birds, a new family; hills and
farmland as terrain (#44); groups that walk only by night or in fog (`when`, #41).

## 8. The numbers

- **Experience.** One clear of the area pays 1,660 xp a member today, just past level 4 (1,650).
  The curve (EXPANSION §5.2, #31) gives an area the climb from its floor to the next area's
  floor, divided by 0.75: 2,800 / 0.75, about 3,730. The Downs are where the other 2,070 or so come
  from.
- **Gold.** A clear pays about 2,530: 1,065 in chests, about 765 in drops and 700 in rewards.
  Training six members from 1 to 5 costs 1,500, so gold holds.
- **The gate.** #38 reports the Shelf outside the starting thresholds. The Rift Warden, the
  Smuggler Captain and the Deacon are won 93 to 99% of the time at their maps' floors, where a boss
  should be won about half the time. The Drowned Shrine is won 66% of the time two levels under its
  floor, where the gate wants a quarter. The area as one is won about 89% of the time at level 1.
  The pilot settles them, by retuning or by moving the thresholds (#47).
- **Spells.** Tier 3 comes at level 4, inside the band (`spellTierAt`), and Harrow's Lantern
  Guildhall sells to tier 2 (it sets no `maxTier`; `src/ui/screens.ts:409`). EXPANSION §4 has an
  area's towns sell its band's tier.

## 9. What the owner has to decide

1. **The core.** Which places are hand-built at full density and which are country (EXPANSION §2.1
   (b), #39). The core as §2.1 has it is the area's towns, its Stone and its dungeons' approaches:
   Harrow and the Shelf map are built, the Harrow Stone is not, and the barrow's approach is in the
   Downs.
2. **Gullwick.** A town map with businesses of its own, or a village of features on a Downs map. A
   town could sell tier 3 (§8).
3. **The barrow.** A dungeon map of its own, placed on the atlas, or a part of a zone map.
4. **The Harrow Stone.** What it is in the game: a thing to see, a tutorial or a place.
5. **The first map.** Which of the Downs' places #47's map holds.
6. **More than one map to a zone.** A zone holds one built map (`AtlasZone.map`,
   `src/game/atlas.ts:82`), and the Downs are about six maps of land. The first Downs map can be
   the `downs` zone's; the second needs a zone of its own, or zones that hold several maps.
7. **The borders.** Whether the Ledge should be the border at both its ends, with the road down it
   ending in the Delta; where the Shelf zone should end and the Downs begin, once maps are laid; and
   whether Gull Isle is the Shelf's.
8. **The names.** Many of the area's names are plain descriptions: the Shelf, the Downs, the
   Ledge, Captain's Farm, and Harrow five times over (the city, the Downs, the Light, the Bay and
   the Stone). Whether they change, and how, is a naming pass of its own. A rename is safe for saves,
   which hold ids and not names, except a guild hall's, whose name is its membership flag
   (`guild_<hall name>`, #34).

## 10. What was cut

Nothing yet.
