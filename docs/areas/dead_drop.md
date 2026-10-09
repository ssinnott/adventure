# The Dead-Drop: where the Compact's orders come from, below the Tide Ship

One of the two large dungeons that stand in place of a world-wide Underdeep (#22; DESIGN §4): three
levels of 32×32 at 26–28, down the stair from the Tide Ship's hold on Wrackholm. The Tide Ship's
cargo goes there, and the Salt Compact's orders come from there, written by the Tallymaster in the
dead founder's hand (DESIGN §9, §10.2; #443, call 4). Its stair opens in Act II and its band is Act
IV's: a warning, not a wall (EXPANSION §5.2). This is its brief (EXPANSION §8.2), written for #22
under Phase 1.4 (#441). Every call below is a decision the owner may overturn; §8 lists them.

Built: the stair's foot, `dead_drop_stair`, one room at 26–28 with no group and no chest, the
way back up and, at its far end, the way on (docs/areas/wrackholm.md §4.5, §9, 6); and the first
level, the drop (#22, §4.1). The vaults and the writer's room are to build. Its maps are
Wrackholm's, in `src/content/areas/wrackholm/maps/`, the area that opens on them. Its ids:
`dead_drop` (the drop), `dead_drop2` (the vaults) and `dead_drop3` (the writer's room); the first
keeps the plan's id and place, its atlas row now the built plate (§8, the drop's 8).

---

## 1. Where it is

The atlas has the Dead-Drop as a dungeon plate at 208,204, band 26–28 (the three levels' union),
below the Tide Ship off Wrackholm's F6, with the stair's foot at 214,204 beside it
(`src/content/areas/wrackholm/atlas.ts`). It was the plan's row until the drop was built; the vaults
and the writer's room take a plate each when they are (§8, the drop's 8).

- **In and out:** the Tide Ship's hatch and the stair, and nothing else. The stair's foot leads on
  into `dead_drop` by the way at its far end (§4.1).
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

The stair's foot (#190) and the drop, the first level (#22, §4.1). Four of the five monsters were
drawn ahead of the levels that place them (#22, §8), in Wrackholm's table: the drop places three,
the loader, the tally clerk and the hold keeper, restated on the line (§8, the drop's 5); the
Tallymaster waits for the writer's room. The deep knocker is Meridian Camp's, drawn by #657. The
vaults and the writer's room wait on what §7 lists; it is the last thing of Act IV to build.

## 4. The levels

Each level is a 32×32 dungeon at the dungeon floor of density (EXPANSION §5.3): about twelve
features and ten groups, about one rest's fights at the band (MONSTERS §4.4). "None gentler" (#443,
call 4) means no level floors under 26; the band rises inside it as EXPANSION §5.2 asks.

### 4.1 The drop (`dead_drop`): band 26 rising to 27

- **Purpose.** The receiving floor beyond the stair's foot, where the Hand's crews leave the cargo
  and go back up: the dead drop the place is named for (an addition).
- **Landmarks.** Crates on rails; the shards stacked by size; the tally clerks' counting posts.
- **Encounters.** Loaders and tally clerks, and as built one hold keeper at the far end (§8, the
  drop's 4). The first group stands out of sight of the stair's foot, round a corner, so a company
  at 12–14 that looks in meets the band's warning before any machine (§6).
- **Finds.** The Compact's drop coin, heavy; parts.
- **As built** (#22, 9 October): the brief's places laid in 264 open squares, as a long way in and a
  loop, with ten groups (§8, the drop's 1 and 2). Band 26–27, outside Wrackholm's budget (the
  drop's 3 and 4), the map named The Drop (the drop's 11). The stair's foot's far end, a way on now,
  lets a company in at 3,1 facing south, and **the long way in** goes down x 3 (rows 1–8) to **the
  drop** (2–6 by 9–11): crates left in a row across the floor, the crews' boot marks turning back
  at them (4,10). A dogleg east (7–9, row 10) and south (x 9, rows 11–12) turns the corner into
  **the rails' hall** (3–28 by 13–15): two counting posts (13,14 and 21,14, the first read at
  12,14) and the rails (read at 9,13), which end against a buffer at its west end (4,14) with a
  loader's pieces heaped beside it (3,15). Off the hall's south side lie **the shards stacked by
  size** in three bays (rows 17–20, their mouths on row 16): small (x 5–7, read at 6,18), middling
  (x 11–13, 12,18) and large (x 17–19, 18,18). The rails go on south down the east side (x 27–28,
  rows 16–23) to the head of **the way down** (22–28 by 24–29), with the keeper's trough at 24,25
  and the gate of bars at its foot (25,30, said at 25,29). From the small bay a back way (x 6, rows 21–23) goes down to **the
  counting floor** (3–8 by 24–29): a ring worn round two posts (5,26 and 7,28; read at 6,25), the
  Compact's strongbox under them (3,29, its weight said at 4,28) and its aisle east (9–21 by
  26–27, the tread read at 15,26) to the head of the way down.
  - **Groups.** Ten: a loader pair, four loaders alone, four clerks alone and one hold keeper. The
    first loader stands round the corner (`dd_loader1`, 11,15), still, so the band's sign is met
    before any machine: the walk checks that no group is in sight of any square of the way in or
    the drop, at any facing, by a light. A clerk stands at each counting post, each calling two
    loaders (`dd_clerk1` 14,13 and `dd_clerk2` 22,13 in the hall; `dd_clerk3` 4,25 and `dd_clerk4`
    8,27 on the counting floor). A loader roams the hall (`dd_loader2`, 18,15) and one the rails
    south (`dd_loader4`, 28,19); one stands in the middling bay (`dd_loader3`, 12,19) and the pair
    in the large (`dd_pair`, 18,19), still. The hold keeper (`dd_keeper`, 25,27) stands alone at
    the far end by the trough, come up from the vaults to fill its pails: the level's one group at
    27 and its farthest (52 steps), since the curve's rise asks a group at 27 and the keeper is the
    roster's only 27. The vaults still place their keepers, in the people's vault (§8, the drop's
    4). Respawn is 1,440 minutes, the pair's and the keeper's 2,880.
  - **Seams.** The stair's foot's far end, 4,1 (an exit now, labelled), onto the drop's 3,1 facing
    south, and back from 3,1 to the stair's foot's 4,2 facing south, in front of the far end, where
    `dd_door` now is (§8, the drop's 6). The way down, 25,30 (`VAULT_STAIR`, exported): a wall
    drawn as a door, barred until the vaults are built, with `dd_down` at its head (25,29); the
    vaults open it and land their way back up on 25,29 facing north (§8, the drop's 7). The hoist
    has no square here yet: the counting floor's west wall (3,24–29) or the drop (2–6 by 9–11) is
    near the way in, if the vaults want it to land by the stair. The atlas plate `dead_drop` at
    208,204, beside the stair's foot's 214,204 (§8, the drop's 8).
  - **Measured.** At its floor, 26, a company wins every fight and manages 11.24 fights to a rest,
    inside the aim of 9.5 to 11.5 and the limit of 8 to 14, with 86% of its days ending in a fight
    broken off; two under, at 24, it wins every fight too, owed to #18 as the other boxes' are
    (§8, the drop's 2 and 13). A loader alone, the pair, a clerk alone and the keeper alone are
    each won every time at 26 and at 24. The level pays 2,934 xp a member for the brief's 3,000,
    under the cap of 3,750, and holds 2,000 gold and two parts, unpriced, so the Glasswold's window
    of 6,000 holds nothing of it (§8, the drop's 3 and 9). Density 100.0% within 7 steps (264 of
    264) and the furthest 6 of 10, with no sign among its 26 points. The curve's rank correlation
    is 0.52: the first loader nearest at 22 steps, level 26.0, and the keeper the hardest at 52
    steps, level 27.0, at least 27. The gate's day counts a clerk's calls and the pay does not (§8,
    the drop's 2 and 3). The walkthrough goes down the far end and back up, finds no group in sight
    of the way in or the drop, wins every group at 26, takes the heap and the 2,000 gold and meets
    the way down barred, its line said.

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
- **The novelty check by band** (quality lane) is done: `noveltyFaults` counts a map where
  `roadPlace` puts it, as `paceFaults` does (with its area, or, where its floor is over the area's
  band, with the last area whose floor is at or under its own), so the Dead-Drop's knockers,
  keepers, heavy machines and calls stand with the Glasswold, after the Kilns', Rimewater's and
  Ashfall's claims. The drop stands there and claims nothing new (§8, the drop's 12).

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
    it; its gold is the Compact's drop coin, heavy; its finds sit in the band-28 window. Wrackholm
    declares it so by listing the three ids in its `outside` (EXPANSION §5.2). Built so for the drop
    (the drop's 3 and 4): Wrackholm lists `dead_drop`, and the other two as they are built.
11. **It is built last in Act IV,** after the novelty check learns to place a map by its band (done in #682).

Decided by delegate for #22 (the drop's monsters), each the owner's to overturn:

1. **The four are Wrackholm's defs, drawn ahead:** in its table and its `SPRITES`, the area its maps
   will be, so no `AHEAD` entry; `shipped.json` takes their ids, and `UNPLACED` owes each to the
   level that first places it: the loader and the clerk to `dead_drop`, the keeper to `dead_drop2`,
   the Tallymaster to `dead_drop3`. The drop placed the loader, the clerk and the keeper, the
   keeper before the vaults (the drop's 4 and 5).
2. **The loader** is a brute on MONSTERS §4.4's line at 26 (735 hit points, 6d8+6), size 1.4: the
   heavy machines' frame with a body of its own, a crate the size of a cart held over its head and
   no head of its own, the fire in two ports under the crate. Not the Stoker's boiler, the Sentry's
   eye or the Sentinel's block; rust for a tint, since the hold is wet. Restated on the line when
   the drop placed it (the drop's 5).
3. **The tally clerk** is the knockers' (MONSTERS §8.5, §11), a caller on a soldier's numbers at 26
   as the tallyman is at 20, size 0.55; it calls two loaders at a half a turn, the pair #537's test
   has a clerk call. Low and dust-coloured with no feelers, a counting frame on its back: not the
   tallyman's lifted front, tallies and frost, nor the Foreman's slate. Restated on the line when
   the drop placed it (the drop's 5).
4. **The hold keeper** is a controller on the line at 27 that puts to sleep at 0.3 a hit and mends
   one turn in four, as the Bay Keeper. Bare like the Bay Keeper but shorter, a little stooped and
   salt-green, with a yoke and two pails; the Matron has four arms, a cap and an apron, the monks
   robes. Restated on the line when the drop placed it, and placed first there (the drop's 4 and 5).
5. **The Tallymaster** is a boss on the line at 28 (1,497 hit points, 25d8+28), judged at 27 by
   `dead_drop3`'s gate, which tunes it; it calls two clerks at a half a turn, who may call their
   loaders, within #537's three groups. Size 1.6, drawn at its desk, its crown at 0.81 of its
   height.
6. **"Only at its desk" is the map's,** a group `dead_drop3` places at the desk; the desk is drawn
   as part of it, so the fight shows it there. Its pens write in two ledgers at once.
7. **The no-machine rule needs nothing:** `paceFaults` judges a map's groups, not a table's defs,
   and a level floored at 26 stands at the Glasswold's place, past the Mines (§6).
8. **The deep knocker is not drawn here:** Meridian Camp's pull request drew it on the knockers'
   frame (#657); the vaults place that one.

Decided by delegate for #22 (the drop), each the owner's to overturn:

1. **The drop is laid as a loop of 264 open squares** (§4.1, as built): the long way in down x 3,
   the drop at its foot, a dogleg round the corner into the rails' hall (3–28 by 13–15), the three
   bays off its south side, the rails on down the east side to the head of the way down and from
   the small bay a back way to the counting floor and its aisle east, to the same head. The rails
   end at the hall's west end against a buffer.
2. **Ten groups, the brief's about ten:** a loader pair, four loaders alone, four clerks alone and
   one hold keeper. The gate's day decides it: 300 days at 26, the deal on, fights to a rest
   against the aim of 9.5 to 11.5 and the limit of 8 to 14 (L a loader, C a clerk, K a keeper, a
   pair written together). C C C LL LL LL K gave 7.55 and CL CL C LL LL KK 5.23 (a clerk with
   loaders beside it fights up to three), both under the limit; six L, three C and K 15.36, over
   it; six L, four C and K 13.78, outside the aim; five L, five C and K 10.80 and LL, four L, four
   C and KK 9.52, inside it but paying 2,762 and 3,113; LL LL, three L, four C and K 9.39, under
   it, paying 3,279. The pick is LL, four L, four C and K: 10.65, inside the aim, paying 2,934, the
   nearest to the brief's 3,000 of those inside it. A clerk costs the day more than a loader: it
   calls two.
3. **Pay 2,934 xp a member** (17,607 between six: the six loaders 2,067 each, 12,402; the four
   clerks 1,033 each, 4,132; the keeper 1,073), 0.98 of the brief's 3,000 and under its cap of
   3,750. It is outside any budget (the first block's 10): the curve prints it and counts it in no
   clear. The pay counts the placed monsters only: the two loaders a clerk calls (4,134 xp) are
   counted nowhere, as with the inspector's knockers.
4. **Band 26–27, the rise carried by one hold keeper at 27.** The curve's rise asks the hardest
   group at max(floor + 1, top - 2): 27 for 26–27, and for 26–26 too, so no band lets the loaders
   and clerks (all 26) pass alone. The keeper, the roster's only 27, stands alone at the far end
   (52 steps, the farthest group) by the trough (`dd_water`), `roams: false`, come up from the
   vaults to fill its pails. So the drop places the keeper before the vaults do, which the
   monsters' 1 above and MONSTERS §8.5 give them: its `UNPLACED` entry (owed to `dead_drop2`) goes
   with this level, and the vaults still place their keepers in the people's vault.
5. **The three are restated on the line as #549 made it,** as the meridian levels did, with no
   tuning: the loader a brute at 26 (735 hit points and 6d8+6 to 692 and 5d7+10), the tally clerk
   a soldier at 26 (362 and 4d8+5 to 321 and 4d8+3) and the hold keeper a controller at 27 (356
   and 4d8+6 to 376 and 5d7+7). AC, attack, speed, xp, calls, sleep and mend, ids, looks and
   sprites are kept, and all three leave `RESTATE` and `UNPLACED`. `RESTATE` had called the clerk
   a skirmisher; the soldier is what the monsters' 3 above and its speed (11, the soldier's; the
   skirmisher's is 15) have, and the inspector, a caller, was restated so. Nothing is set off the
   line (`OFF_LINE`), and with no boss on the level there is no `BOSSES` entry.
6. **The stair's foot's far end is now its way on** (4,1, an exit onto the drop's 3,1 facing
   south, labelled), and `dd_door` moves from 4,1 to 4,2, one in from the way on as `dd_foot` is
   from the stair: an event on an exit square is never said, since the world takes the exit first.
   A small edit to a built map; its rows, band 26–28, `dd_foot`, both texts and its sign are as
   built, and it still holds no group and no chest.
7. **The way down is `VAULT_STAIR`, exported:** `{ x: 25, y: 30, to: 'dead_drop2', tx: 25, ty: 1,
   tf: SOUTH }`, a legend `Z` wall drawn as a door (the engine draws no stair; the text calls it a
   gate of bars), with `dd_down` at its head (25,29), said each time. The vaults list it in this
   map's exits, turn 25,30 to floor and drop the `Z` legend, drop or rewrite `dd_down` and make it
   `once` (said each time, it would be said on every return up), give their start at 25,1 facing
   south (asked for), land their way back up on 25,29 facing north and turn the walkthrough's
   `VAULT_STAIR` assertion, which asserts it shut.
8. **The atlas takes the drop's plate as built and loses the plan's link.** The plan's `dead_drop`
   row moves into Wrackholm's atlas (208,204 and band 26–28, the three levels' union, kept;
   `planned` and the name dropped, since a built plate shows its map's name, The Drop). The plan's
   link from the Tide Ship to `dead_drop` (stairs, planned) is removed: the built exits draw the
   way now (the hold, the stair's foot, the drop), and a planned link beside them would draw a
   second, dashed stair to the same plate. The vaults and the writer's room take a plate each
   when built.
9. **The finds** are the Compact's drop coin (2,000 gold in one strongbox, `dd_strongbox`, 3,29,
   under the counting floor's posts, its weight said by `dd_coin` at 4,28) and two parts,
   `loader_port` ("Loader's Fire Port") and `loader_iron` ("Loader's Crate Iron"), slot none and
   price 0, in a heap where the rails end (`dd_heap`, 3,15), as the stokers' and the flue walker's.
   No find has a price, so the window holds nothing; the curve holds a map outside at floor 26 to
   the Glasswold's 6,000, the last area on the road whose floor is at or under the drop's.
10. **Groups:** the first loader (`dd_loader1`, 11,15) stands round the corner and `roams: false`,
    so the band's sign is met before any machine (the walk checks that no group is in sight of any
    square of the way in or the drop, at any facing, by a light). The clerks at their posts and the
    stacks' loaders do not roam; two loaders on the rails do (`dd_loader2` in the hall,
    `dd_loader4` on the rails south). Respawn 1,440 minutes, the pair's and the keeper's 2,880;
    aware 2, the clerks' 3.
11. **The map is named The Drop** (§9): band 26–27, region Wrackholm, `bare`, the stair's foot's
    palette and `stone` walls.
12. **No secret, and novelty claims nothing:** no check asks a secret of a dungeon level. The
    novelty check places the drop (floor 26, over Wrackholm's 12–14) with the Glasswold, after the
    Kilns', Rimewater's and Ashfall's claims. Its heavy machines, knockers and keepers, its calls
    and sleep, events, chests and a wall drawn as a door are all on the road before it, so it
    claims nothing and changes no area's claims (Wrackholm's devilfish, heather and wreck stand).
13. **The gate owes `dead_drop: under` to #18, at 1,** as every box: every group is won at 24, two
    under its own floor.
14. **The Kilns' walkthrough reads the road by place.** Its check that the first machines stand at
    the bottom of the deepest mine took the areas after the Kilns in their list as later, and
    failed on the loaders: listed by Wrackholm, before the Kilns, though their floor puts them at
    the Glasswold's place (§6). It now takes a map's place as the pace check does (`roadPlace`), a
    small edit to `src/content/areas/kilns/walkthrough.ts` and to no other file of the Kilns'.

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
- **The vaults and the writer's room** are owed, and with them the Tallymaster (owed to
  `dead_drop3`), the hoist (no square for it on the drop yet, §4.1) and the vaults' opening of the
  way down (the drop's 7).
- **MONSTERS §8.5's Where for the hold keeper** still names the people's vault alone; the drop's far
  end is a second place (the drop's 4). Left as it stands, a shared doc.
