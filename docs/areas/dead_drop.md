# The Dead-Drop: where the Compact's orders come from, below the Tide Ship

One of the two large dungeons that stand in place of a world-wide Underdeep (#22; DESIGN §4): three
levels of 32×32 at 26–28, down the stair from the Tide Ship's hold on Wrackholm. The Tide Ship's
cargo goes there, and the Salt Compact's orders come from there, written by the Tallymaster in the
dead founder's hand (DESIGN §9, §10.2; #443, call 4). Its stair opens in Act II and its band is Act
IV's: a warning, not a wall (EXPANSION §5.2). This is its brief (EXPANSION §8.2), written for #22
under Phase 1.4 (#441). Every call below is a decision the owner may overturn; §8 lists them.

Built: the stair's foot, `dead_drop_stair`, one room at 26–28 with no group and no chest, the
way back up (docs/areas/wrackholm.md §4.5, §9, 6). Nothing below it. Its maps will be Wrackholm's,
in `src/content/areas/wrackholm/maps/`, the area that opens on them. Its ids: `dead_drop` (the
drop), `dead_drop2` (the vaults) and `dead_drop3` (the writer's room); the first keeps the plan's
id and its atlas row.

---

## 1. Where it is

The atlas has the Dead-Drop as a planned dungeon at 208,204, band 26–28, below the Tide Ship off
Wrackholm's F6, with the stair's foot at 214,204 (`src/content/areas/wrackholm/atlas.ts`).

- **In and out:** the Tide Ship's hatch and the stair, and nothing else. The stair's foot leads on
  into `dead_drop` by the way at its far end.
- **The rails** run on through a door at the shards' vault's far end, which opens for nobody the
  company has: a sealed glimpse, not a way. The Core's door is the one lock the road is sure to spend
  (DESIGN §9), and the Hand's road there is the service ways, through doors that know the line.
- **A cargo hoist** from the vaults up to the drop, found by a search, is a shortcut back (an
  addition).

## 2. What it is for

The Salt Compact's last turn (DESIGN §10.2): the founder has been dead a decade, and a machine
writes his orders. It is where the Tide Ship's cargo went, and where a company that has heard
the Tidefolk's god only counts finds what has been counting. The Thief's third prestige comes
here to steal the orders and learn who writes them (#448; the trainer at Rook's Nest,
docs/areas/whitespine.md). The road never needs it.

## 3. What is built

The stair's foot only (#190). The rest waits on what §7 lists; it is the last thing of Act IV to
build.

## 4. The levels

Each level is a 32×32 dungeon at the dungeon floor of density (EXPANSION §5.3): about twelve
features and ten groups, about one rest's fights at the band (MONSTERS §4.4). "None gentler" (#443,
call 4) means no level floors under 26; the band rises inside it as EXPANSION §5.2 asks.

### 4.1 The drop (`dead_drop`): band 26 rising to 27

- **Purpose.** The receiving floor beyond the stair's foot, where the Hand's crews leave the cargo
  and go back up: the dead drop the place is named for (an addition).
- **Landmarks.** Crates on rails; the shards stacked by size; the tally clerks' counting posts.
- **Encounters.** Loaders and tally clerks. The first group stands out of sight of the stair's
  foot, round a corner, so a company at 12–14 that looks in meets the band's warning before any
  machine (§6).
- **Finds.** The Compact's drop coin, heavy; parts.

### 4.2 The vaults (`dead_drop2`): band 27–28

- **Purpose.** The shards' vault, then the people's.
- **Landmarks.** The shards' vault, and at its far end the rails' sealed door, with the Hand's seal
  on the crates beside it, the seal on the crates in Sheer Point's sea cave
  (docs/areas/whitespine.md, the secret under Rook's Nest): how the shards reach the causeway, found
  and never said (an addition). The people's vault: empty pens with old straw, and the count on the
  wall in the founder's hand, two columns (§4.4). An empty pen is the level's rest. The hoist up.
- **Encounters.** Loaders in the shards' vault; hold keepers in the people's, which put to sleep and
  mend; deep knockers at the sealed door.
- **Finds.** Parts; a named piece in the band's window.

### 4.3 The writer's room (`dead_drop3`): band 27–28

- **Purpose.** The Tallymaster at its desk, and the orders (DESIGN §10.2).
- **Landmarks.** The counting house: the desk, the in-tray and the out-tray. The in-tray holds
  letters in the hand that countersigned the customs seal (DESIGN §9), found and never named.
- **The orders** (`compact_orders`) are a quest item, read from the pack: an order to a runner in
  the founder's hand. The Thief takes them from the out-tray without a fight. Seeing the
  Tallymaster write is an event, and it sets the flag that the company has learned who writes them.
- **The Tallymaster** fights only when the company steps to its desk. It is a machine doing its job
  and never runs; the company may break it, or leave it writing to nobody.
- **The door's inscription,** read by a reader of Kiln-script (#538), gives the vessel's own word
  for the room: found and not given. The word is the building session's, for the owner's review.

### 4.4 The cargo

No living cargo remains by the time a company can live here (an addition). The ones the doors
opened for went on; the rest went up through the ice at Rime Lodge (DESIGN §9, Act III). The count
on the wall carries names the company knows from the Cargo Ledger's CARGO BELOW column and from
Rime Lodge's nights, and Wenna's carries a mark the others lack: the captain's line, found here and
never said (DESIGN §9).

## 5. The quests here

- **The Compact's line** (DESIGN §10.2): the orders, carried up, open the rank that reveals, where
  #182 left the founder's seal (docs/areas/saltreach.md §9; docs/areas/wrackholm.md §4.4). The
  choice is put by Ruan in the Keel at Saltmouth, not below: the Compact is people, and a person
  puts a choice. Hand it to the Wardens or take it over; either way it stops taking the
  Tallymaster's orders.
- **The Thief's third prestige** (#448): steal the orders and learn who writes them.
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

## 7. Building it, and when

**Not before Act IV,** and last in it, with Rook's Nest and #448's Thief. Building it now would
need first:

- **One machine family** with no module yet, the heavy machines (Ashfall's, #520), to land before
  the area that first needs it (MONSTERS §11). The knockers (the Kilns', #472) and the keepers
  (Rimewater's, #495) are drawn.
- **The curve to 28.** `src/content/progression.ts` stops at Sunderwood's 14–16; the gate at 26–28
  needs the rows (#432, #442).
- **The gear ladder to 26.** `GEAR` in `tools/harness.ts` tops out at 16, so a gate at 26–28 would
  be measured on the harness's what-if gear and say nothing (EXPANSION §5.2).
- **Calls** (#537) and the keepers' sleep.
- **Rook's Nest and #448,** for the Thief's quest to have a trainer.
- **The novelty check by band** (quality lane): `noveltyFaults` counts every map in an area's
  folder at that area's place, so the Dead-Drop's knockers, keepers, heavy machines and calls would
  stand at Wrackholm's place and fail the Kilns', Rimewater's and Ashfall's claims as on the road
  before them. The ledger must place a map by its band, as `paceFaults` does, sharing one
  `placeOf`. This can be done now, in the quality lane, with a fixture.

## 8. Decisions

Decided by the owner's delegate on 3 October 2026 for #22, following #443's call 4 and the owner's
comment on #22; each may be overturned:

1. **Three levels of 32×32, none floored under 26:** the drop 26–27, the vaults 27–28, the writer's
   room 27–28.
2. **The ids** are `dead_drop`, `dead_drop2` and `dead_drop3`; `dead_drop_stair` stays Wrackholm's
   one room, with no group.
3. **The stair is the only way in and out;** the rails' door is a sealed glimpse, the hoist a
   shortcut back (an addition).
4. **No living cargo,** and the count on the wall with Wenna's mark (an addition).
5. **The Tallymaster fights only at its desk;** the orders are stolen without a fight.
6. **The Compact's choice is put by Ruan in the Keel,** on the orders carried, at the rank that
   reveals.
7. **The Hand is never met below** (an addition); the seal on the vault's crates matches Sheer
   Point's (an addition).
8. **No new family;** five defs (MONSTERS §8.5).
9. **#158's rule stands as written;** the stair's foot holds no group by its brief.
10. **It pays outside any area's budget,** about 9,000 xp a member, as Wrackholm's §9 already counts
    it; its gold is the Compact's drop coin, heavy; its finds sit in the band-28 window.
11. **It is built last in Act IV,** after the novelty check learns to place a map by its band.

## 9. Names

- **The Dead-Drop** stands: the smugglers' English (docs/areas/wrackholm.md §10), and now literal.
- **The levels** take plain names: the Drop, the Vaults and the Counting House, the Compact's
  merchant English for a room they never saw.
- **The items** are the Compact's Orders and, on the wall, the count; neither needs a name more.

## 10. What was cut

- **Gentler upper levels:** call 4 holds the whole dungeon at 26–28; the stair's foot is the warning.
- **The cargo's road to the Core** as a walkable way: the rails' door stays shut, and the Core's
  door is the one lock the road spends.
- **Living cargo below,** which would ask a rescue the band forbids an Act II company.
