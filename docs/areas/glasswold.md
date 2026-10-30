# The Glasswold: step XI of the road, the steppe round the Glass

The Glasswold's doc is three files (EXPANSION §8.2, #1011), and this, its current state, is read
first. Its decisions, the old §9 whole, are `docs/areas/glasswold/decisions.md`, appended to and
never rewritten. Its plan is `docs/areas/glasswold/plan.md`: the old §4 (the boxes' briefs, §4.1
to §4.9), §11 (what was cut) and §12 (the bounds, §12.1 to §12.5) whole, then under "Moved from
the state" the lines of the old header, §1, §3 and §5 to §8 that this file does not keep, each
under the heading it had, among them §1's squares and seeds, §3's atlas rows and drawings, §6's
tables, the Master of arms' words, the artifact's brief and §8's "As built" box by box. §2 and §10
stand here whole. The figures are main's at `8462ffeb` (24 October 2026), as the suites print them.

Its ids: the area `glasswold`, its zones `wold` and `theglass`, the reach, unbuilt; the enclave
`karaordu` and the lair `kushdag`. Akordu, the Riders' camp, is `wold_d8` and Kushtash `wold_b8`.
It has no town; its one business is the Riders' trader at Akordu, whose tent has a room.

## 1. Where it is

The last step of Act IV, Beyond the Sky, on the road of levels (DESIGN §4, §9): two zones
of the atlas (`src/content/areas/glasswold/atlas.ts`) on the grid of boxes 32 squares a side
(EXPANSION §8.2). The Wold, band 26–28, is ten boxes: D9, D10, D8, C8, B8 and B9 on the road; E9
and E8 behind it on the coast; D7 and E7, the bounds' (#833). The Glass, the reach, holds no map
and is Phase 1.6's. E10, the road onto the steppe, is laid in Ashfall's Ember Waste. Karaordu and
Kushdag stand off the grid, each entered from D7.

- **North: the Scarp,** the cliff over the Saltings. The Scarp stair climbs it from Saltreach's C7
  onto C8's lip, open from the start; D7 holds the Scarp's east end over the gulf.
- **East: the Cinder Hills,** Ashfall's. The road from the Ember Waste crosses them inside E10 and
  comes onto D10, open from the start; E9 and E8 lie on the coast, with no road.
- **South and south-west: the Glass,** sealed from the Ember Waste by a lava flow and entered only
  at the gap on B9, the reach's one way in.
- **West: the rim,** the A column, cut (plan, §11); B8's and B9's west columns are its foot.

Its edges open on nothing all face the Glass, shut until Phase 1.6 (`openOnNothing`,
`src/content/areas/glasswold/checks.ts`): D10's south and west, D9's west, C8's south and B9's east.
`node tools/worldmap.ts out.png --zones` paints the zones.

## 2. What it is for

The end of Act IV (DESIGN §9): *what is Caldera?* By the Wold the company has seen the window at
Meridian Camp and knows the sky is a ceiling. The Wold is the warning against arriving, in person:
the Riders remember the day the sky opened and the land burned to glass, their grass has glass in
it, the beasts that hunt it are the biggest on the road, and now and then something walks out of
the Glass that fell with the pillar of fire and has not stopped trying to get up (MONSTERS §8.3).
The Riders keep the only way in, and they are right to. STORY has the eldest tell it: *What lies in
the glass tried to leave. The sky opened for it. Remember what that cost, if anyone ever offers to
open it for you.* It is the last ground before Hearth Isle's 28, with no Stone to mend, so what it
gives the quest is the words and the land they are said over. Two third prestiges are taught in the
Glasswold (DESIGN §5, #448): the Ranger's at Kushtash, the Eyrie, on the Wold; the Sorcerer's at
the Glass's edge, by the gap the Riders keep (#807). Akordu, the Riders' camp, is the Wold's rest, and a Rider
rides a company to Cinderport and back (call 5), so the Wold trains there, to 27. There are no
Rifts in Act IV (MONSTERS §8), and the glass walker is a machine on open ground, bare, as MONSTERS
§2.2 allows past the Mines.

The weather is the steppe's: dry, hot by day and cold by night, dust on the wind, and the Glass's
glare from the south-west on a clear noon.

## 3. What is built

Twelve maps (`src/content/areas/glasswold/maps/`), a row each: its id and name, kind, size and
band; what is there, with its groups (the gate's count); and its secret, a door at the squares
given, with the hint on its near side that finds it (the map's `secrets`). Eleven maps have one and
D10 two.

| Map | Kind, size, band | What is there | Secret, and its hint |
|---|---|---|---|
| `wold_d9`, D9 | outdoor, 32×32, 26–27 | the steppe with glass in its grass: the road over the south edge, the Riders' track north to Akordu, the herd, the dunes' edge and the Glass seen from a dune; the long mound the horses will not graze; four groups, a glass walker alone among them | 12,13, the fallen walker's hollow: the long grass on the mound at 13,13 (`d9_ungrazed`) |
| `wold_d10`, D10 | outdoor, 32×32, 26–27 | the Wold's way in from E10: the road along the great mesa's foot and up to D9, the glassed Riders, the small mesa on the west edge; five groups, the mesa's lions with a basilisk behind them | two: 26,1, the great mesa's top and its hoard: a glassed Rider aiming at the face at 21,4 (`d10_glassed_rider`); and 3,20, Mergen's hollow (#858): arrows in the small mesa's foot at 4,20 (`d10_butts`) |
| `wold_d8`, D8, Akordu | outdoor, 32×32, 26–27 | the Riders' white tents in a ring under the mesa: the eldest's fire, the trader's tent with its room, the horse-lines and the ride to Cinderport, the garden of glass; three groups, the lions by night | 13,22, the Riders' hoard: a dry well with no rope at 13,23 (`d8_ropeless`) |
| `wold_c8`, C8 | outdoor, 32×32, 26–27 | the Scarp's lip over the Saltings: the stair's head and the Riders' watch, the Compact's runner on the last flight; three groups | 22,2, the cleft with the Compact's last three drops: hoofprints along the lip at 22,3 (`c8_prints`) |
| `wold_b8`, B8, Kushtash | outdoor, 32×32, 27–28 | the far west under the rim: the hunters' fire, the Grey Lion's kill-ground, the lesser mesa; Kushtash, with Aysu at her fire on its top (the Ranger's third); a hermit under the rim; three groups, the Grey Lion alone | 2,17, the stepped scree up Kushtash: a thread of smoke off its top at 8,10 (`b8_smoke`) |
| `wold_b9`, B9 | outdoor, 32×32, 26–28 | the dunes to the rim's foot: the gap into the Glass and the Riders' watch at its mouth; Eadmer on the last sand (the Sorcerer's third); five groups, two walkers at the gap | 16,18, the half-buried walker's cache: the one dune that does not shift at 17,18 (`b9_still`) |
| `wold_e9`, E9 | outdoor, 32×32, 26–27 | the hills between the steppe and the inland sea: the Riders' summer camp, a horse's skull on a pole, a shrine that gives personality; three groups | 12,17, the herders' store with Mergen's Drill Bow: their path stopping at a slab of grey stone at 13,17 (`e9_path`) |
| `wold_e8`, E8 | outdoor, 32×32, 26–27 | the strand on the inland sea: a boat's ribs, a camp of sea-stones, a Rider swimming her mares to the island; three groups | 3,19, the sea-chest in the cleft: a tarred rope's end in the black rocks at 2,19 (`e8_rope`) |
| `wold_d7`, D7 | outdoor, 32×32, 26–27 | the bounds' first, the Scarp's east end over the gulf: the lip, the walkers' tracks and the Riders' old watch-fire, the Saltings' strip below; the diggers' cut into Karaordu at 8,30 and the shelf into Kushdag at 19,24; three groups | 7,23, the keepers' store: a beacon's cold hearth, the rock behind it smelling of tar, at 8,23 (`d7_tar`) |
| `wold_e7`, E7 | outdoor, 32×32, 26–27 | the other island's north, a swimmer's: the island's grass and a bar of sand out to an islet white with gulls; no group | 6,19, the castaway's hollow: the wind moaning in a crack at 5,19 (`e7_moan`) |
| `karaordu`, Karaordu | dungeon, 16×16, 28–29 | the enclave, the khans' barrow under the hills over Akordu's box, entered at D7's 8,30: the diggers standing in stone and the khans' chamber; two groups, basilisks and deep rats | 7,13, the eldest khan's cell and the Khan's Sabre: the horses' skulls turned to the end wall at 7,12 (`kr_skulls`) |
| `kushdag`, Kushdag | dungeon, 16×16, 30–32 | the lair, the Foal-taker's eyrie in the Scarp's east face, entered at D7's 19,24: the shelf, the choke where the Foal-taker stands and the nest with a Rider's chest and Akkush; one group, the bird | 7,12, the cleft where the bird keeps what shines: a Rider's buckle wedged in the rock at 7,11 (`kd_buckle`) |

Its content is `src/content/areas/glasswold/`: the maps, then a file each for its interiors,
monsters, items, chapter and quests, its part of the world (the atlas), its rows of the suites (the
checks), what other areas take of it (public) and its walkthrough. The trader's room is drawn in
`src/ui/interiors/glasswold/`.

## 5. The one quest here

**The Warning** (`warning`, `src/content/areas/glasswold/chapter.ts`), after Ashfall's The Window:
begun on `q_road_west`, or at the Scarp stair's head (`c8_line`) with the Ember Stone lit; the glass
in the grass (`d9_glass`); Akordu and the eldest's story (`akordu_story`); the watch at the gap
(`gap_watch`) and the Glass seen from it (`b9_glass`). It is done on `q_road_east`, which
`d8_turned` sets at Akordu's horse-lines, the flag Phase 1.5's chapter starts on. The Wold holds
every step and the Glass, the reach, none. Nothing in it is a lock.

## 6. Side quests

Four of #56's in `src/content/areas/glasswold/quests.ts`, a line each, two given from Cinderport's
halls and two at Akordu (the plan's §6 has the table and the words as built):

- **The Horse That Came Back** (`horse_back`): Cador Lusk at Cinderport's Chart House; what sits
  the horse at Akordu, broken or carried to him whole.
- **The Lion's Share** (`lions_share`): the young Rider at Akordu; the Grey Lion hunted for his last
  blow, or let die and the eldest tells the rest.
- **Orders on the Scarp Stair** (`scarp_orders`): Hendra, the Compact's factor at Cinderport; her
  runner's orders sealed, told or burned at the eldest's fire.
- **The Garden of Glass** (`glass_garden`): the mother among the figures at Akordu; her son carried
  to Cinderport's Harbour Temple and the stone lifted. Its 300 xp a member is paid there, and
  counted in Ashfall's clear.

Two third prestiges, paying nothing but the prestige: **Oriel Fane's Map** (`scout_map`), Aysu's
on Kushtash, the Ranger's, for Fane's map from Meridian Camp; and **What the Walkers Carried**
(`walkers_carried`), Eadmer's on the gap's last sand, the Sorcerer's, for the Etched Glass and the
Glass with a Light.

**The Master of arms** (#858), found and never told: Mergen, an old Rider hidden in D10's small
mesa, teaches Master at arms to a member Expert at arms and of 25 or over, for his Drill Bow out of
the herders' store on E9 and 5,000 gold. The rumour is a Rider's by the trader's tent at Akordu.

**Akkush** (#846), the bounds' artifact: in a Rider's chest in Kushdag's nest, behind the
Foal-taker (boss, 32: 2,900 hit points, attack 23), found and never told. The rumour is the
eldest's at Akordu, at every meeting after the oldest story while the bird lives. A bow for the
ranger, ranged and two-handed, 1d12+14; it raises its bearer's accuracy by 5.

## 7. Encounters, and what is new

The roster is MONSTERS §8.3's, in its monsters file: the Vulture, the Wold Lion, the Glass Scorpion,
the Basilisk, the Glass Walker and the Grey Lion (boss, 28); in Karaordu the Hearth's deep rats; and
the Foal-taker, the lair's guardian, of the birds (MONSTERS §13). The basilisk turns to stone, and
the glass walkers are a family of their own. It claims the glass walkers, dunes underfoot and stone
(`novel`); no landmark.

## 8. The numbers

- **The curve** (`tools/tests/curve.ts`): a clear gives 23,016 xp a member of the 21,067 it asks
  and 14,900 gold of 12,720; a company entering at the floor and clearing three quarters leaves at
  28.0, the next floor 28. Karaordu and Kushdag are counted in no clear: 4,906 xp a member and
  2,500 gold.
- **The gate** (`tools/tests/gate.ts`): at its maps' floors the area wins 99.2% of its 32 groups'
  fights (`GATE.through`'s aim); two under, pooled at 24, 7.52 fights to a rest, 71.6% of the
  floor's 10.5. The Grey Lion, set off the line, is won 75% at 27 and 96% at 29, the Foal-taker 57%
  at 30 and 81% at 32. The Wold's road is walked every time.
- **Fights to a rest** (aim 9.5 to 11.5, limit 8 to 14): D10 10.76, D9 9.67, D8 10.95, C8 10.46, B9
  10.41, E9 11.86, E8 12.00 and D7 9.95; B8 10.91 at 27, where a company wins 91.7% of its fights;
  Karaordu 10.60 at 28. Thirteen figures are off their aim, inside their limits.
- **Density** (`tools/tests/density.ts`): within 8 squares in the core, D10 99.4%, D9 99.8% and D8
  and B8 100.0%; within 12 in the country, C8, B9, E9, E8, D7 and E7 100.0%; Karaordu and Kushdag
  100.0% within 7.
- **The ladder:** no rung is the Glasswold's, which has no town to sell one.

## 10. Names

The Glasswold's naming pass, by the rules of `docs/NAMES.md`: the Wold Riders' tongue was left to
it (NAMES §2), and the Crown's names for the area, the steppe and the escarpment are kept. Chosen
for #444.

- **The tongue.** The Wold Riders are the horse people of the steppe, who live in white tents, ride
  down to Cinderport to trade and keep the only way into the Glass (STORY, DESIGN §9). Their names
  are Turkic in shape, the tongue of the steppe, beside the Foreland's English, the elves' Cornish,
  the Tidefolk's Frisian, the dwarves' German and the hill folk's Gaelic: short parts, spelled as
  they are said, with no accent the font lacks. *Ak* white, *kara* black, *tash* stone, *kum* sand,
  *su* water, *ordu* a camp, *yurt* a tent, *kush* a bird, *dag* a mountain, *kol* a lake, *bash* a
  head, *uzun* long, *yol* a road. NAMES §2's row for the Wold Riders has it.
- **The names:**

  | Was | Now | What it means | Also thought of |
  |---|---|---|---|
  | the Wold Riders' camp | Akordu | the white camp, for its tents | Ordubash, the head camp |
  | the Eyrie | Kushtash | the bird's rock: the scout's lookout on the far-west mesa, where the vultures never land | Kushdag, the bird's mountain |
  | the Glass, in the Riders' mouths | Tashkum | the stone sand; noted here and left for the reach's doc (Phase 1.6), with "The Glass" and "Buried Tower" still lettered | Akkum, the white sand |
  | the barrow on the lip, the enclave (#833) | Karaordu | the black camp: the khans' under the hill, over Akordu, the white camp of the living | Karatash, the black stone |
  | the Foal-taker's eyrie, the lair (#833) | Kushdag | the bird's mountain: the Scarp's end where the bird nests, the second thought for the Eyrie above, which keeps Kushtash | Kushyol, the bird's road |

- **A person:** Aysu, the scout on Kushtash, the Ranger's third (#448): *ay* the moon and *su*
  water, a Rider's name in the Riders' tongue. She was "The scout" while she had words only.
- **A person:** Eadmer, the scholar at the Glass's edge, the Sorcerer's third (#807): *ead* wealth
  and *maere* famous, an old name of the Crown's English, as Hereswith's and Edric's are; he is no
  Rider, and the Riders let him sit and no further.
- **A person:** Mergen, the drillmaster, the Master of arms (#858): *mergen* a marksman, the steppe
  tongues' word for a good archer, spelled as it is said, a Rider's name in the Riders' tongue. The
  game calls him the drillmaster and never the Master, which is a tier's name, and names him in no
  journal.
- **Kept:** the Glasswold and the Wold, the Crown's names for the area and its steppe, which the
  road leans on; the Scarp and the Scarp stair, the Foreland folk's, Saltreach's border
  (docs/areas/saltreach.md §10); the Cinder Hills, Ashfall's; the Glass and the Buried Tower, plain
  names for plain things as the Grove Stone is, lettered as the plan has them until the reach's doc
  says otherwise; the Grey Lion, a beast and not a place.
- **Ids stay:** `wold` and `theglass` are the plan's zones; the Eyrie's site keeps its name in the
  issues until #444 renames it, and Kushtash's id is its site's name and its map `wold_b8`, set by
  #529; Akordu's is its site's name and its map `wold_d8`, set by #526.

## Open and owed

- **Owed to no check:** its checks have no `owes`, and the curve, the gate, density and the ladder
  hold the Glasswold with nothing owed.
- **Watched, not moved:** E8's 12.00 and E9's 11.86 fights to a rest are over their aim, and the
  Grey Lion's 75% at 27 over its, each inside its limit (plan, §8). What the owner finds by hand
  goes here; none yet.
- **The Glass** is the reach, Phase 1.6's: no map and no step of the quest. Its doc decides Tashkum,
  the Tower's floors and the cap's gate (plan, §11).
- **Cut:** the rim's mountain, A7 to A9 (plan, §11); B7, the Scarp's lip, is laid in Saltreach's
  box.
- **What is next:** nothing. The plan's briefs are all built, and a new box starts its brief there.
