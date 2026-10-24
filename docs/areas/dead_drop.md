# The Dead-Drop: where the Compact's orders come from, below the Tide Ship

The Dead-Drop's doc is three files (EXPANSION §8.2, #1027), and this, its current state, is read
first. Its decisions, the old §8 whole, are `docs/areas/dead_drop/decisions.md`, appended to and
never rewritten. Its plan is `docs/areas/dead_drop/plan.md`: the old §4 (the levels' briefs, §4.1
to §4.4), §7 (building it, and when) and §10 (what was cut) whole. The old header, §1 to §3, §5,
§6 and §9 stand here whole, as they were written, and §3 ends in a row to each map, its figures
main's at `8462ffeb` (24 October 2026). It belongs to no area of its own: its maps are Wrackholm's.

One of the two large dungeons that stand in place of a world-wide Underdeep (#22; DESIGN §4): three
levels of 32×32 at 26–28, down the stair from the Tide Ship's hold on Wrackholm. The Tide Ship's
cargo goes there, and the Salt Compact's orders come from there, written by the Tallymaster in the
dead founder's hand (DESIGN §9, §10.2; #443, call 4). Its stair opens in Act II and its band is Act
IV's: a warning, not a wall (EXPANSION §5.2). This is its brief (EXPANSION §8.2), written for #22
under Phase 1.4 (#441). Every call below is a decision the owner may overturn; §8 lists them.

Built: the stair's foot, `dead_drop_stair`, one room at 26–28 with no group and no chest, the
way back up and, at its far end, the way on (docs/areas/wrackholm.md §4.5, §9, 6); the first
level, the drop (#22, §4.1); the second, the vaults (#22, §4.2); and the third and last, the
counting house (#22, §4.3), which the plan called the writer's room. The Dead-Drop is built, and
so are the quests that go down: the Factor's rung and Ruan's choice (#635's PR D) and the Thief's
third prestige (#448), both in §5. Its maps are Wrackholm's, in `src/content/areas/wrackholm/maps/`, the area
that opens on them. Its ids: `dead_drop` (the drop), `dead_drop2` (the vaults) and `dead_drop3`
(the counting house); the first keeps the plan's id and place, its atlas row now the built plate
(§8, the drop's 8); the others have plates of their own (§8, the vaults' 14 and the counting
house's 13).

---

## 1. Where it is

The atlas has the Dead-Drop as a dungeon plate at 208,204, band 26–28 (the three levels' union),
below the Tide Ship off Wrackholm's F6, with the stair's foot at 214,204 beside it, the vaults'
plate at 208,210 below it and the counting house's at 208,216 below that
(`src/content/areas/wrackholm/atlas.ts`). It was the plan's row until the drop was built; the
vaults and the counting house have plates of their own (§8, the drop's 8, the vaults' 14 and the
counting house's 13).

- **In and out:** the Tide Ship's hatch and the stair, and nothing else. The stair's foot leads on
  into `dead_drop` by the way at its far end (§4.1).
- **The rails** run on through a door at the shards' vault's far end, which opens for nobody the
  company has: a sealed glimpse, not a way. The Core's door is the one lock the road is sure to spend
  (DESIGN §9), and the Hand's road there is the service ways, through doors that know the line.
- **A cargo hoist** from the vaults up to the drop, found by a search, is a shortcut back (an
  addition). Built, it comes up beside the drop's crates (§4.2).

## 2. What it is for

The Salt Compact's last turn (DESIGN §10.2): the founder has been dead a decade, and a machine
writes his orders. It is where the Tide Ship's cargo went, and where a company that has heard
the Tidefolk's god only counts finds what has been counting. The Thief's third prestige comes
here to steal the orders and learn who writes them (#448; the trainer at Rook's Nest,
docs/areas/whitespine.md). The road never needs it.

## 3. What is built

The stair's foot (#190), the drop, the first level (#22, §4.1), the vaults, the second (#22, §4.2)
and the counting house, the third and last (#22, §4.3). Four of the five monsters were drawn ahead
of the levels that place them (#22, §8), in Wrackholm's table: the drop places three, the loader,
the tally clerk and the hold keeper, restated on the line (§8, the drop's 5); the counting house
places the Tallymaster, set off the line for its gate (§8, the counting house's 4). The deep
knocker is Meridian Camp's, drawn by #657. The vaults place it at the sealed door, with the loader
and the keeper again; they restate nothing (§8, the vaults' 5). The counting house places the
tally clerk with a loader again. The Dead-Drop is built; its Factor's rung and Ruan's choice and
the Thief's third prestige are built (§5).

Its maps, a row each: its id and name, kind, size and band; its groups (its encounters); and its
secret, a door at the squares given, with the hint that finds it (the map's `secrets`).

| Map | Kind, size, band | Groups | Secret, and its hint |
|---|---|---|---|
| `dead_drop_stair`, the Stair's Foot | dungeon, 10×9, 26–28 | none | none |
| `dead_drop`, the Drop | dungeon, 32×32, 26–27 | ten | none |
| `dead_drop2`, the Vaults | dungeon, 32×32, 27–28 | five | 14,28, the hoist up to the drop: its chains at 15,28 (`dd2_chains`) |
| `dead_drop3`, the Counting House | dungeon, 32×32, 27–28 | two | none |

## 5. The quests here

- **The Compact's line** (DESIGN §10.2), built (#635's PR D): the orders, carried up, open the rank
  that reveals, where #182 left the founder's seal (docs/areas/saltreach.md §9; docs/areas/
  wrackholm.md §4.4). The choice is put by Ruan in the Keel at Saltmouth, not below: the Compact is
  people, and a person puts a choice. Hand it to the Wardens or take it over; either way it stops
  taking the Tallymaster's orders. The orders are the counting house's `compact_orders` (§4.3), and
  the Factor's rung, *In the Founder's Hand* (`compact_factor`, Wrackholm's `guilds.ts`), asks for
  `{ item: 'compact_orders' }` and leaves them in the pack; paid at either hall for 800 gold and
  4,800 xp, it makes a Partner. Ruan's words follow it (`q_compact_factor_done`): one question,
  and two answers that set `q_compact_wardens` or `q_compact_over` and pay nothing; the seal is not
  taken (docs/areas/wrackholm.md §9, PR D's 5 to 7).
- **The Thief's third prestige** (#448), Whose Hand, built: steal the orders and learn who writes
  them, for Hereward in Rook's Nest (docs/areas/whitespine.md §6). Seeing the Tallymaster write is
  `dd3_writes`, which sets `q_writer_seen`; with the orders in the pack too he reads them, once,
  and hands them back, so they stay the company's. Nothing on this level changed for it.
- **The Scarp Stair's runner** (#56's 54, docs/areas/glasswold.md §6) carries orders from here; the
  cleft under the Scarp's lip holds the last three drops. Neither changes.

## 6. Encounters, and the secret's pace

MONSTERS §8.5 has the roster: loaders, tally clerks, hold keepers, deep knockers and the
Tallymaster, boss, level 28, judged at 27. No new family; new defs in the knockers, the keepers and
the heavy machines. Asks: calls and the sleeping touch, both from Rimewater's. The Hand is never met
below: its crews leave the cargo at the stair's foot, which is why Act II's crews never walk at 26.

**The no-machine rule** (MONSTERS §2.2; `paceFaults`, #158) already covers the Dead-Drop: a map
whose floor is over its area's band takes the place of the last area whose floor is at or under its
own, so a floor of 26 stands at the Glasswold's place, past the Kilns. `dead_drop_stair` may hold a
machine by the rule and holds none by its brief: it stays as built, one room with no group, its sign
the warning. A company at 12–14 that walks on dies before it can wonder what it saw (DESIGN §14.4):
a mystery, not a spoiler. A fixture that the stair's foot holds no group is the quality lane's to
add, if the owner wants it.

## 9. Names

- **The Dead-Drop** stands: the smugglers' English (docs/areas/wrackholm.md §10), and now literal.
- **The levels** take plain names: the Drop, the Vaults and the Counting House, the Compact's
  merchant English for a room they never saw.
- **The items** are the Compact's Orders and, on the wall, the count; neither needs a name more.
