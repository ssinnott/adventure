# The Dead-Drop's plan

The Dead-Drop's plan and its history (EXPANSION §8.2): the old §4 (the levels' briefs), §7
(building it, and when) and §10 (what was cut) of its doc, `docs/areas/dead_drop.md`, moved here
whole by #1027 (every level in them is built). A new brief goes here first, with its "As built"
once it is built. Its decisions are `docs/areas/dead_drop/decisions.md`.

## 4. The levels

Each level is a 32×32 dungeon at the dungeon floor of density (EXPANSION §5.3): about twelve
features and ten groups, about one rest's fights at the band (MONSTERS §4.4); the vaults hold five
(§8, the vaults' 2) and the counting house two (§8, the counting house's 2). "None gentler"
(#443, call 4) means no level floors under 26; the band rises
inside it as EXPANSION §5.2 asks.

### 4.1 The drop (`dead_drop`): band 26 rising to 27

- **Purpose.** The receiving floor beyond the stair's foot, where the Hand's crews leave the cargo
  and go back up: the dead drop the place is named for (an addition).
- **Landmarks.** Crates on rails; the shards stacked by size; the tally clerks' counting posts.
- **Encounters.** Loaders and tally clerks, and as built one hold keeper at the far end (§8, the
  drop's 4). The first group stands out of sight of the stair's foot, round a corner, so a company
  at 12–14 that looks in meets the band's warning before any machine (§6).
- **Finds.** The Compact's drop coin, heavy; parts.
- **As built** (#22, 9 October): the brief's places laid in 264 open squares (266 since the vaults
  opened two: the way down and the hoist's landing), as a long way in and a loop, with ten groups
  (§8, the drop's 1 and 2). Band 26–27, outside Wrackholm's budget (the drop's 3 and 4), the map
  named The Drop (the drop's 11). The stair's foot's far end, a way on now,
  lets a company in at 3,1 facing south, and **the long way in** goes down x 3 (rows 1–8) to **the
  drop** (2–6 by 9–11): crates left in a row across the floor, the crews' boot marks turning back
  at them (4,10), and in its west wall the cage of the vaults' hoist, seen from above (1,10). A
  dogleg east (7–9, row 10) and south (x 9, rows 11–12) turns the corner into **the rails' hall**
  (3–28 by 13–15): two counting posts (13,14 and 21,14, the first read at 12,14) and the rails (read
  at 9,13), which end against a buffer at its west end (4,14) with a loader's pieces heaped beside
  it (3,15). Off the hall's south side lie **the shards stacked by size** in three bays (rows 17–20,
  their mouths on row 16): small (x 5–7, read at 6,18), middling (x 11–13, 12,18) and large (x
  17–19, 18,18). The rails go on south down the east side (x 27–28, rows 16–23) to the head of **the
  way down** (22–28 by 24–29), with the keeper's trough at 24,25 and the rails' slope to the vaults
  at its foot (25,30, said at 25,29). From the small bay a back way (x 6, rows 21–23) goes down to
  **the counting floor** (3–8 by 24–29): a ring worn round two posts (5,26 and 7,28; read at 6,25),
  the Compact's strongbox under them (3,29, its weight said at 4,28) and its aisle east (9–21 by
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
    `dd_door` now is (§8, the drop's 6). The way down, 25,30 (`VAULT_STAIR`, exported): an exit
    now, labelled, onto the vaults' 25,1 facing south, with `dd_down` at its head (25,29), said
    the once; their way back up lands on 25,29 facing north (§8, the drop's 7 and the vaults' 1).
    The hoist's landing, 1,10, in the drop's west wall, with `dd_cage` on it (§8, the vaults' 10).
    The atlas plate `dead_drop` at 208,204, beside the stair's foot's 214,204 (§8, the drop's 8).
  - **Measured.** At its floor, 26, a company wins every fight and manages 11.24 fights to a rest,
    inside the aim of 9.5 to 11.5 and the limit of 8 to 14, with 86% of its days ending in a fight
    broken off; two under, at 24, it wins every fight too (§8, the drop's 2 and 13; past 10 the gate
    judges a company two under by its day, #851). A loader alone, the pair, a clerk alone and the
    keeper alone are each won every time at 26 and at 24. The level pays 2,934 xp a member for the
    brief's 3,000, under the cap of 3,750, and holds 2,000 gold and two parts, unpriced, so the
    Glasswold's window of 6,000 holds nothing of it (§8, the drop's 3 and 9). Density 100.0% within
    7 steps (266 of 266) and the furthest 6 of 10, with no sign among its 28 points. The curve's
    rank correlation is 0.52: the first loader nearest at 22 steps, level 26.0, and the keeper the
    hardest at 52 steps, level 27.0, at least 27. The gate's day counts a clerk's calls and the pay
    does not (§8, the drop's 2 and 3). The walkthrough goes down the far end and back up, finds no
    group in sight of the way in or the drop, wins every group at 26, takes the heap and the 2,000
    gold and goes on down the rails' slope to the vaults, its line said at its head the once.

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
- **As built** (#22, 9 October): the brief's places laid in 179 open squares, as the shards' vault,
  the people's below it and a way between, with five groups (§8, the vaults' 1 and 2). Band 27–28,
  outside Wrackholm's budget (the vaults' 3 and 4), the map named The Vaults (the vaults' 13). The
  drop's way down, open now, lets a company in at 25,1 facing south, and **the rails' slope** goes
  down x 25 (rows 1–4; the way in read at 25,2) to **the shards' vault** (4–28 by 5–11): three
  aisles (rows 5, 8 and 11) between two rows of racks (rows 6–7 and 9–10), cut every six squares (x
  4, 10, 16, 22 and 28), the shards on them sorted by colour (read at 25,5) and one rack bare, swept
  clean to the wood (read at 10,5). The rails come down the middle aisle (row 8, read at 16,8) west
  to **the sealed door** in the end wall (3,8): no handle, no hinge, a thousand dents low on its
  face (read at 4,8), and beside it the crates under the Hand's seal (4,9). At the east end, by the
  rails, a sledge carries the Compact's coin in two strongboxes (read at 26,11; 27,11 and 28,11).
  Off the south aisle a way down (x 16, rows 12–14) leads into **the people's vault**, an aisle (x
  15–17, rows 15–29) with **six pens**, three a side (west x 12–13, east x 19–20, rows 16–17, 20–21
  and 24–25), their gates standing open (read at 16,15); in one pen's straw the named piece (12,21)
  and in another a keeper's parts (12,25). **The rest** is an empty pen (20,21). At the aisle's end,
  **the count** on the east wall (17,26 to 17,28), **the hoist's chains** (15,28) and the steps down
  (16,30, said at 16,29).
  - **Groups.** Five: a loader on the rails (`dd2_loader`, 22,8), a pair at the racks
    (`dd2_loaders`, 10,8), four deep knockers at the door, knocking (`dd2_knockers`, 5,8) and, in
    the aisle among the pens, three hold keepers and four (`dd2_keepers`, 16,18 and `dd2_keepers2`,
    16,24). Only the first roams. Respawn is 2,880 minutes, the first's 1,440; aware 2.
  - **Seams.** Down from the drop onto the vaults' 25,1 facing south and back up onto the drop's
    25,29 facing north, the slope's head. The hoist (`HOIST`, exported): the chains at 15,28 (the
    hint, said each time), a secret door found by a search at 14,28 in the aisle's west wall and the
    cage behind it at 13,28, one way up onto the drop's new square 1,10 facing east; nothing on the
    drop leads down it (§8, the vaults' 10). The way on down, 16,30 (`WRITER_STAIR`, exported):
    floor now, in the vaults' exits and labelled, onto the counting house's start at 16,1, with
    `dd2_down` at its head (16,29), said once (§8, the vaults' 11 and the counting house's 1). The
    rails' door, 3,8, a wall drawn as a door with `dd2_door` at its foot (4,8), leads nowhere (the
    vaults' 7). The atlas plate `dead_drop2` at 208,210 (the vaults' 14).
  - **Measured.** At its floor, 27, a company wins every fight and manages 11.09 fights to a rest,
    inside the aim of 9.75 to 11.75 and the limit of 8.25 to 14.25 that the gate asks at 27, with
    65.7% of its days ending in a fight broken off; two under, at 25, it wins every fight too (§8,
    the vaults' 2 and 16). A loader alone, the pair, three keepers, four keepers and four knockers
    are each won every time at 27 and at 25. The level pays 3,275 xp a member for the brief's 3,000,
    under the cap of 3,750, and holds 2,000 gold, two parts (unpriced) and the Fisher's Spike +5 at
    3,050, inside the Glasswold's window of 6,000 (§8, the vaults' 3 and 12). Density 100.0% within
    7 steps (179 of 179, 162 needed) and the furthest 6 of 10, with no sign among its 25 points. The
    curve's rank correlation is 0.79: the loader nearest at 10 steps, level 26.0, and the knockers
    the hardest at 27 steps, level 28.0, at least 28 (§8, the vaults' 4). The walkthrough goes down
    the drop's rails and back up, reads the door, the seal and the count, wins every group at 27,
    finds the rest in an empty pen and takes the coin, the parts and the spike. It searches out the
    hoist, rides it up to the drop and goes on down the steps into the counting house (§4.3).

### 4.3 The counting house (`dead_drop3`): band 27–28

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
- **As built** (#22, 9 October): the brief's places laid in 180 open squares, as the steps' foot, a
  hall of desks and the master's floor behind a rail, with two groups (§8, the counting house's 1
  and 2). Band 27–28, outside Wrackholm's budget (the counting house's 3), the map named The
  Counting House (the counting house's 12). The vaults' steps, open now, let a company in at 16,1
  facing south, and **the steps' foot** (16,1 and 16,2) has the door ahead (16,3, a plain door),
  with **the marks** over it (`dd3_marks`, read at 16,2): to anyone marks like the Kilns', to a
  reader **MANIFEST. COUNT EVERY ONE.**, the room's word and the order it keeps (the counting
  house's 10). Past the door **the hall** (x 10–22, rows 4–15), twelve high desks in it as single
  pillars (x 12, 14, 18 and 20 on rows 6, 9 and 12), the ledgers, the shelves and the stools read
  in it; across row 16 **the rail**, with one gate (16,16) where the Tallymaster is first seen
  writing (`dd3_writes`, once, which sets `q_writer_seen`). Behind the rail **the master's floor**
  (x 12–20, rows 17–19) and five niches in row 20: the strongbox (12,20), **the in-tray**
  (`dd3_intray`, 14,20), **the desk** (16,20), **the out-tray** (`dd3_outtray`, 18,19; the chest
  `dd3_orders` in its niche, 18,20) and the bin of spent nibs (20,20). Rows 21–31 are rock.
  - **Groups.** Two: a tally clerk with a loader by the rail (`dd3_clerk`, 12,14), the day's one
    group, and the Tallymaster alone at its desk (`dd3_tallymaster`, 16,20, in its niche with
    walls on three sides). Neither roams. The Tallymaster calls two clerks, who may call their
    loaders; it does not respawn, has a text for its breaking and is aware 1 (§8, the counting
    house's 6).
  - **Seams.** Down from the vaults' `WRITER_STAIR` (16,30, floor now and in their exits,
    labelled) onto the counting house's 16,1 facing south, the start; back up from 16,1 onto the
    vaults' 16,29 facing north, the steps' head, where `dd2_down` is said once. The door is 16,3
    and its marks stand on 16,2. Nothing leads on down: the steps are the level's one exit (§8, the
    counting house's 15). The atlas plate `dead_drop3` at 208,216 (the counting house's 13).
  - **The orders and the writing.** The orders are `compact_orders`, in the chest `dd3_orders`
    in the out-tray's niche, taken without a fight (§8, the counting house's 8); the letters in the
    in-tray are in the hand that countersigned the pages under the Helmstow seal, never named (the
    counting house's 9). Seeing the Tallymaster write is `dd3_writes`, which sets `q_writer_seen`
    (the counting house's 7). The Thief's third prestige is to key on that event and flag, the
    Factor's rung on the orders (§5).
  - **Measured.** At its floor, 27, a company wins 85% of the level's fights, off the aim of 90%
    and inside the limit of 80%, and manages 10.30 fights to a rest, inside the aim of 9.75 to
    11.75 and the limit of 8.25 to 14.25, with 61.3% of its days ending in a fight broken off; two
    under, at 25, it wins 64%, off the aim of at most 25% and inside the limit of 90% that the gate
    asked of it until #851 (§8, the counting house's 5). The clerk with its loader is won every time
    at 27 and at 25. The Tallymaster is won 70% at 27 (aim 30% to 70%, limit 20% to 80%), 83% at 29
    (aim 90%, limit 75%) and 28% at 25: its blow is set off the line (the counting house's 4). The
    level pays 3,485 xp a member for the brief's 3,000, under the cap of 3,750, and holds 2,000 gold
    and two parts (unpriced), with no priced find and no named piece (the counting house's 3 and
    11). Density 100.0% within 7 steps (180 of 180, 162 needed) and the furthest 6 of 10, with one
    sign among its 16 points. The curve's rank correlation is 1.00: the clerk nearest at 17 steps,
    level 26.0, and the Tallymaster the hardest at 19 steps, level 28.0, at least 28. The
    walkthrough goes down the vaults' steps and back up, reads the marks and the room, sees the
    Tallymaster writing from the gate and the flag set, reaches both trays with no group beside,
    takes the orders, the coin and the parts, wins the clerk every time and the Tallymaster 70% of
    ten at 27 and finds no way on.

### 4.4 The cargo

No living cargo remains by the time a company can live here (an addition). The ones the doors
opened for went on; the rest went up through the ice at Rime Lodge (DESIGN §9, Act III). The count
on the wall carries names the company knows from the Cargo Ledger's CARGO BELOW column and from
Rime Lodge's nights, and Wenna's carries a mark the others lack: the captain's line, found here and
never said (DESIGN §9).

As built (§4.2): six pens with their gates open, and no one in them. The count is three events on
the people's vault's end wall: two columns under the Compact's knot, names and homes on the left,
a short right ending on Wenna, of Gullwick, and by hers alone a loop inside a loop, her family's
knot, which no text calls anything (§8, the vaults' 8).

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
  Ashfall's claims. The drop, the vaults and the counting house stand there and claim nothing new
  (§8, the drop's 12, the vaults' 15 and the counting house's 14).

## 10. What was cut

- **Gentler upper levels:** call 4 holds the whole dungeon at 26–28; the stair's foot is the warning.
- **The cargo's road to the Core** as a walkable way: the rails' door stays shut, and the Core's
  door is the one lock the road spends.
- **Living cargo below,** which would ask a rescue the band forbids an Act II company.
- **About ten groups at the vaults:** five (the vaults' 2).
- **About ten groups at the counting house:** two (the counting house's 2). Nor did it need
  `dead_drop3: under` in `OWED`, as every other box did until #851 (the counting house's 5).
- **A way on down from the counting house:** none; the vaults' steps are its one way out (the
  counting house's 15).
- **The Factor's rung** (`In the Founder's Hand`, which asks for `compact_orders`) with **Ruan's
  choice at the Keel,** left to a pull request of their own (PR D of #635): built there (§5).
- **MONSTERS §4.4's 6 and 8** owed the Dead-Drop's monsters a restating and reported the
  Tallymaster at 57% at 28; the counting house sets it off the line and its gate wins it 70% at 27
  (the counting house's 4). Brought in step by #735: `RESTATE` is empty and §4.4's 8 gives the
  Tallymaster by its gate.
- **MONSTERS §8.5's Where for the hold keeper** named the people's vault alone; the drop's far
  end is a second place (the drop's 4). Brought in step by #735: the table gives both.
