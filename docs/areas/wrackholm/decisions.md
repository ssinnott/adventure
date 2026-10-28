# Wrackholm's decisions

Wrackholm's decisions (EXPANSION §8.2): the old §9 of its doc, `docs/areas/wrackholm.md`, moved here
whole by #1027, every list in its order. It is appended to and never rewritten: a builder adds a
list at its end, and a later decision that changes an earlier one says which. Its current state is
`docs/areas/wrackholm.md` and its plan `docs/areas/wrackholm/plan.md`.

## 9. Decisions

Decided by the owner on 28 September 2026 (#151), and followed here:

1. **No story lock** (call 1): the boat sails for the fare, and the hatch to the Dead-Drop opens.
2. **The forward hold's tear is generated** (call 2), from #165's templates.
3. **The Hand's crews have left the Compact** (call 4): the cove's and the ship's crews are the
   Hand's.
4. **The Tide Stone is a plain quest item** (call 6).
5. **The Tide Stone is the Hearth's first step** (call 8): the night it is home, the sky and the
   title show it (#168).
6. **All four side quests stand** (call 13).
7. **The name:** Kelp Hole (docs/areas/saltreach.md §10).

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.5.
- **Both boxes core** (§4), since the isle is the ship and nothing else.
- **The ship boarded at night** (`when`, #41), by the boats from F6's shore, and its plate left in
  the sea where the atlas has it (#190).
- **The stair's landing room,** one room of 26–28 country with a way back up, until #22 is built.
- **The pay's shares** (§8), the dungeons heavier than Saltreach's, scaled to the curve's 9,867.
- **The bands on the atlas's rows** (#186): the zone 12–14, Kelp Hole 12–14, the Tide Ship 13–14.
  They are set already in `src/content/areas/wrackholm/atlas.ts`, where only the scaffold reads
  them, for a box's draft; the owner's word changes them there.

Decided by delegate for #635 (the Fence's rung), each the owner's to overturn:

1. **The rung is built now, on Act II's country,** since it is a deed on a built map. *Where the
   Cargo Goes* (`compact_fence`, `guilds.ts`, listed in the area's index) is the quest a Fence is
   offered, and its deed is the stair's foot seen (`dead_drop_stair:dd_foot`, the room's first
   once-event, #190). No group, no new feature and no change to a map, so no contact sheet.
2. **The ladder no longer rests from 12 to 24.** As the docs stood, the Compact's climb stopped at
   the Fence from Saltreach's top at 12 to Cinderport's floor at 24; with the rung it climbs on in
   Act II's band. DESIGN §8 says so, and its table of Act IV's guild quests places the other three.
3. **The other three rungs ride Act IV's dungeons,** with no new feature or group: the Surveyor's
   with the Ember Stone (#516), the Mapmaker's with Meridian Camp and the Factor's with the
   Dead-Drop (#22). `OWED_RANKS` in `tools/tests/guilds.ts` drops the Fence's entry and owes the
   three to them, in the order a ladder allows: #516 before the Mapmaker's.
4. **Any hall offers and pays it,** one ladder (DESIGN §8), and the rung has no `after`, since the
   stair opens in Act II: a Fence is offered it as the rank is held. The log's goal names the Keel
   in Saltmouth and the factor's house at Cinderport (#512), and the words name no giver but Ruan.
5. **Her paid words say not yet and name nothing below.** The company is made a Factor, whose
   rung is Act IV's; what lies past the stair's foot is found, never told (DESIGN §7), and the
   Dead-Drop's brief is #22's (docs/areas/dead_drop.md).
6. **The pay is 200 gold and 600 xp,** the next rise of the Compact's ladder after the crate's 100
   and 360 and the lookout's 150 and 480. The 600 is 100 a member, which the area's budget absorbs
   as the side quests' pay is (§8): the curve test counts 10,626 xp a member of the 9,867 asked
   (10,526 before) and 6,479 gold of the 6,000 (6,279 before), both 8% over, so the row needs no
   owed figure.

Decided by delegate for #635 (PR D), each the owner's to overturn:

1. **The rung is built now,** on the counting house's orders (#22): *In the Founder's Hand*
   (`compact_factor`, `guilds.ts`, rank 3), offered to a Factor at either hall, naming no giver but
   Ruan and no Tallymaster.
2. **The deed is `goal: { item: 'compact_orders' }`, never `item:`:** a hall takes nothing, so the
   orders stay in the pack for the Thief's third prestige (#448), which asks for them too.
3. **It waits for Act IV on the Surveyor's `after`** (`q_sleepers_seen`), since the Fence's rung
   below has none; its goal names the Keel and the factor's house.
4. **The pay is 800 gold and 4,800 xp,** 800 a member, the Mapmaker's sum and the ladder's last
   rise after the Fence's 200 and 600. It makes a Partner, the top rank, which has no quest.
5. **Ruan's choice is keyed to the rung paid** (`q_compact_factor_done`), not to `rank_compact`,
   which is the rank's number and holds from Runner. No rank waits on it; it is put until answered.
6. **One question, two answers, a flag each** (`q_compact_wardens`, `q_compact_over`): nothing is
   paid, given or taken, since dead_drop.md §5 names none and the orders stay in the pack. Only
   her words read them.
7. **The founder's seal is not taken by either answer,** though #182 left it to this rank (§4.4):
   its grave is a secret, and an answer that took it would bar a company that never opened it. The
   take-over answer may `take` it, if the owner wants.
8. **The curve holds it** (guild quests count with the area that holds them): 11,426 xp a member of
   the 9,867, 16% over (10,626 before), and 7,279 gold of the 6,000, 21% over (6,479 before). The
   row owes nothing, so `progression.ts` is untouched.
9. **`OWED_RANKS` owes nothing now:** the Compact's entry is all `undefined`, as the other guilds',
   and each guild has its four ranks.
10. **One edit to a built place:** Ruan in the Keel (`saltmouth.ts`) gains three entries in her
    `says`, before the Runner's; no tile, sprite or interior changes, so no contact sheet.

Decided by delegate for #192, each the owner's to overturn:

1. **Hale waits at the weather deck's rail,** not in the hold: his freeing words send the freed up
   to the boats and him to the ladder, and they stand, with the token's twin and Hale's Sergeant's
   checks. He asks for the book there, and goes with the thirty once answered, placed nowhere else;
   the draft's after-lines in the hold are dropped, since the company keeps the book. The chapter's
   Hale entry has him go up the ladder to the boats, which narrows #190's decision 3.
2. **The clerk's book is a third letter,** The Clerk's Book (The Cargo Ledger is the Foreland's),
   in its own chest in the cabin's corner and not on the table, so a save that opened the table
   still finds it. A chest cannot wait on a flag, so it may be taken before Hale asks; then he goes
   straight to it.
3. **The truth's cost falls on Kelp Hole's landing crew,** since the Tide Ship's deck has no
   smugglers to thin: Kitto's boats tie up there, the group stops coming back once next killed, and
   no first clear or gate figure moves. Kitto's after-lines say the cove's landing, not the deck.
4. **Only the landing's Kitto carries 25,** the hand-in with no early words, since his lines read
   true to a company he never asked; the quay's Kitto is left alone, clear of #183.
5. **The hermit is Merryn,** renamed by a fable pass: Senara is Henlys's lorekeeper.
6. **Merryn's count begins on the 11th of Frost,** as her wall has it, and her words keep the grave
   for the company to find.
7. **The pay:** Kitto 200 (the fare back and a bit), Ruan 300, Tallis 500; 27 and 28 pay in words.
8. **28 is done either way:** the beast slain and Tam home (`q_feed_home`), or Tam met and Loveday
   told while the beast lives (`q_feed_told`). Tam's meeting at the pool sets a flag rather than an
   event, since his words are the meeting.
9. **Each quest begins at whichever of its people is met first:** Colan before Kitto, Tam before
   Loveday, the book before Hale, so the log never waits on an order.
10. **Wat has two new versions,** his boy home with the board in the loft and without it; nothing
    for the boy at Saltmouth, who is not home yet. A company that sends the boy home before it
    ever meets Wat hears his boy's words and not the board's ask, and can still hand the board in.
11. **26 is The Hermit of the Point,** since #56's title, The Hermit of the East Rocks, is 7 px too
    wide for the log's list; the point is where she sits.

Decided by delegate for #191, each the owner's to overturn:

1. **The plinth takes the Stone,** a feature on its square named Stienwierde, met as a person is
   met but drawn and worded as the stone: only a person's hand-in takes an item and sets a flag, and
   a new kind of feature would be a systems change. The hermit on the hummock counts the Rifts; he
   is not the step.
2. **The chapter begins on landing,** since only Kitto's boat reaches the isle: a company still in
   the Delta keeps the Tide Stone's goals.
3. **It is done on the Stone home with the captain's table opened,** a condition that stays true and
   asks no item; the Wall begins on the same, or on the papers read (sunderwood.md §9.3). The way
   east is the Wall's own first goal, so the chapter writes none: one at the Eaves would only repeat
   it. The Wall's first goal takes the same condition beside the papers, so the start alone shows a goal.
4. **A Stone home without the papers sends the company back aboard,** a goal at the lower deck, so
   the log is never blank.
5. **No goal on F6:** its floor of 13 would carry every later step over B5's band of 11–12.
6. **The temples sing on the approach to two stairs,** the far roof's porch (B6) and the apse's,
   once the Stone is home, and the count and the quiet there give way to it. The song is the
   god's, so it does not wait on the Choirmaster; the choir below keeps its count while he stands.
   One step short of each stair, since the log holds the count and the song together no other way;
   at the apse across the nave's whole head, heard once, so no way up to the stair misses it.
7. **The Stone home closes the Delta's Rifts** (B5's two and C5's) and B6's brinelings, the other
   way #170 and #173 left to #191. The brinelings at Nynke's window stay The Night-Light's.
8. **The hermit on the hummock gets one line** once the Stone is home, and sets nothing.
9. **The walkthroughs:** Saltreach's runs stop on the landing, the Tide Stone open; Wrackholm's play
   them on, in order and with Saltmouth first; Sunderwood's play the Tide Stone and Wrackholm's
   chapter before the Wall in all three runs, the Foreland and the Grove seeded in two. The Watch
   first and the Sunder first now read both papers, since the table gives both: the papers alone
   and the log alone are no longer walked.
10. **A company that skips the Grove** and brings the Stone home is sent on by the Wall's goal, the
    furthest along, and not back to the Grove, as the log reads every chapter.

Decided by delegate for #190, each the owner's to overturn:

1. **The ship is boarded in Dando's boat by night,** a crossing sold on F6's shingle, since no way
   on a map can keep hours; the fare lands the company rested, as a crossing does. The way back is
   over the side, open at any hour.
2. **Hale is in the last row only once he is gone from the Scarth:** the hold waits on
   `q_hale_taken`, a flag #156 owns and sets on its own condition (the ledger given, Saltreach set
   foot in), so the pass and the hold never both hold him. Until #156 lands the last row holds
   strangers whatever the company has done; the checks owe the flag to #156 (#415). Changed on
   review: the hold first read #156's condition itself, which held Hale in both places until #156.
3. **Freeing Hale is his meeting,** once the crew is down: it sets `q_hale_freed`, and he is gone
   from the hold, over the side with the freed and placed nowhere else. Nothing is taken from the
   company (#43). His words for his sergeant's token (#56's 20) come with the token, which #156
   makes; the chapter (#191) keys on the flag, and 27's choice (#192) is put by one of the freed.
4. **The Rift is generated in brine, floored at 12,** so the gate judges the Warden at 12 and 14 as
   the issue asks; the Warden stands alone at its heart, with the Tide Stone in the hoard beside him.
5. **The ship aims at its share,** about 2,550 as first drawn; the curve and the gate moved it to
   about 3,500 (decision 9), 200 over, which the owner may weigh against the area's curve.
6. **The stair's foot is `dead_drop_stair`,** one room at 26–28 with no group and no chest, the sign
   its warning; `dead_drop` stayed the plan's place until #22 built the drop, and the foot's far end
   is its way on now (docs/areas/dead_drop.md §8, the drop's 6). The curve's band check let it
   stand first, in the quality lane (#407).
7. **The ids** are `tide_ship`, `tide_ship2`, `tide_ship3` and `tide_ship_rift`; the first keeps the
   plan's id and its row.
8. **The papers and the log are two letters** on the captain's table, read from the pack; the log is
   in a hand the company cannot read, for Lantern Watch (#204). The captain is not aboard. On
   review, the papers' seals are past making out, so the Helmstow seal on every cargo stays the
   Watch's to read; their PASSED column answers the crates' stamp in Kelp Hole for whoever looks.
9. **What the checks moved, by the session** on the delegate's draft: the decks floored at 12, since
   no 13–14 deck can hold the curve's hardest group without a 14 the roster lacks; four devilfish
   over the side and no bowman, eight rats and three overseers at the hatch below, and a Tide Elder
   with an overseer at the bulkhead door, the hold's group at 13, so the shard-cut is a way past them:
   on review, each the cheapest change that brings its deck inside the gate's 6 to 8 fights to a
   rest, where thinner decks ran 8.7 to 9.6; a bowman at the post or over the side would sit under
   its deck's top; a Tide Elder and three brinelings in the Rift's
   rooms and the Warden at about two in three at 12, so the Rift's own fights are won as the gate
   asks; and the ship's chests raised to 3,200 gold, as §8 has the hold pay the training.
10. **The area claims the wreck** as new; a group's leader was the delegate's second claim, but
    Saltreach's boxes place one first, a boss that closes a tear is C5's already, and the stair is
    words in §7.

Decided by delegate for #189, each the owner's to overturn:

1. **The hardest group is the Hand at the smugglers' watch,** two Ashen Overseers and two Ashen
   Gleaners, the den's keepers: the curve asks for a group at 14, which only the bosses are in
   Wrackholm's roster, and borrowing the gleaner, as Sunderwood's I2 borrowed the glass bear, needs
   no drawing first. Four gleaners (6.0 fights to a rest) and a smuggler with three (6.4) were
   measured and sat nearer the aim's edge than the pair of pairs (6.6).
2. **Five groups, at about 1,658 xp a member,** against #186's 1,600 and not the issue's 1,300: a
   sixth would add 315 to 370 and overshoot, as E6 held the pay over the brief's count of eight.
3. **The anchorage is a shingle under a cut cliff,** the path down a square wide; the boats are an
   event by night and the way aboard is left to #190, as E6 left Kelp Hole's mouth to #188.
4. **The hermit has two lines and no flag,** and no letter yet: the quest and its hand-in are
   #192's and #182's, built together.
5. **The founder's seal lies in the grave now,** with 150 gold.
6. **F6 claims nothing new;** the shrine gives personality.
7. **The hint is the tally on the cell's wall,** not the cairn beside the door: the date is found at
   one place, and the cairn left for the company to put together with it.
8. **Kelp Hole's flooded passage now lets out on F6's east shore,** at 28,9, facing south down the
   shore to the point, as #188's brief has it; it lay on E6 only until F6 was built (#188's decision
   6). Nothing on the shore leads back in, and the square is clear of every group and the secret.
9. **F6 places the Ashen Overseer at the watch,** as Kelp Hole does, so a company that walks east
   before it goes into the cliff meets the Hand here first. The borrowed Ashen Gleaner is level 15,
   so the Hand at the watch reads 14 as the group's mean.

Decided by delegate for #188, each the owner's to overturn:

1. **The ids are `smugglers_cove` and `smugglers_cove2`,** the crews' cave and the sea cave: the
   first keeps the plan's id and its link from the zone, so nothing outside the area's folder moves.
2. **Both levels are floored at 12,** the crews' cave 12–13 and the sea cave 12–14, so that the
   boss is judged at 12 and 14 as the issue asks.
3. **The brief's encounters, at about 3,450 a member,** not the share's 2,180, which the boss alone
   nearly fills: two crews and four overseers above, a crew and two devilfish groups below, and the
   boss. F6 and the Tide Ship keep their shares, and the area runs about 1,270 over (§8).
4. **The Great Devilfish is set at 650 hit points, 12d7+15 and armour 20** (600 and 8d7+10 until
   #806, below), the one set measured inside both of the gate's aims.
5. **Colan and Tam are placed with #192's first lines and no flags:** Colan by the rows once the
   overseers are down, Tam at the pool's edge until the beast is dead. Their choices, letters and
   after-lines are #192's. The brother keeps the rows; he is no overseer group.
6. **The flooded passage lets out on E6's south shore,** at 30,29, until F6 is built; #189 may
   repoint it to F6's east shore. Nothing on the shore leads back in.
7. **About 1,230 gold in the chests,** 600 of it in the crews' strongbox with the Plate Mail +1,
   behind the overseers.
8. **The crates stamped with the Helmstow customs** are a plain event, keyed to nothing, for #191.
9. **Kelp Hole claims nothing new:** the devilfish are E6's, the cave is on the road before, and it
   adds no mechanic.

Decided by delegate for #187, each the owner's to overturn:

1. **The landing is an inlet's head,** cut in from the west shore, so that the plan's two points
   stand: the stage at 152,172 and the cove's mouth at 154,170 in the cliff above it.
2. **The pay aims at 1,700,** #186's figure, not the issue's 1,400; six groups at the standard size
   come to about 1,920.
3. **The captain stands on the stage** with two lines and no flag; the quest is #192's and #188's.
4. **Nothing for the chapter** (#191) is placed in E6: it keys on what it needs when it is written.
5. **Four devilfish in the south pools,** the box's far end and its level-13 group, so the levels
   rise; E6 claims the devilfish as new, and heather.
6. **The bilge rats are placed in E6's huts,** as the brief has them, not left to #189.
7. **Wrackholm's climate** is the gulf's: mild winters, cool summers, a narrow day, wet autumns and
   much fog, its fronts three hours behind the Foreland's.

Decided by delegate for #186, each the owner's to overturn:

1. **The atlas folder is spread into the plan** (`src/content/atlas.ts` imports it where its rows
   were), as Saltreach's and Sunderwood's are: the area cannot be listed in AREAS until #187 gives
   it a map. #187 points the area's `atlas` at it and takes the import out.
2. **The folder charts the plan's rows and the bands, and no new sites:** the hermit and the east
   rocks are F6's to place (#189), and the landing is the boat's link, which an area's atlas has no
   room for.
3. **The Tide Ship is 13–14,** not the plan's 12–14: §4.5 gives it so, and it is boarded from F6,
   which is 13–14; the world map shows a plate's band.
4. **The Dead-Drop stays the plan's:** its band and brief are Phase 4's (#22), and this act builds
   only the hatch and one room. The three levels are built since (docs/areas/dead_drop.md).
5. **The pay is scaled to 9,867,** the side quests inside and the Dead-Drop outside, as Sunderwood
   counts Wrackholm's: 100 more each to E6, F6 and the Tide Ship.

Decided by delegate for #806, each the owner's to overturn:

1. **The Great Devilfish is set again at 650 hit points and 12d7+15** (600 and 8d7+10 before), by
   hearth.md §7's method: tries of hit points and blow on the gate's seeds. #188's gate set it
   against a company without its first prestige, 66% at 12 and 91% at 14; the gate's company has
   taken the prestige since #541, and won it 96% at 12, past the limit of 80%. The aim is about half
   at the floor (30% to 70%) and nearly always two above (90%). The tries, in percent of the gate's
   400 seeds and of its own hundred, a fight broken off being one still running at the fifteenth
   round, which the gate does not count won:

   | Hit points | Blow | At 12 | Broken off | At 14 | The gate's hundred, 12 and 14 |
   |---|---|---|---|---|---|
   | 600 (before) | 8d7+10 | 98 | 1 | 100 | 96 and 100 |
   | 1,000 | 8d7+10 | 55 | 38 | 93 | 58 and 92 |
   | 800 | 10d7+12 | 63 | 15 | 97 | 63 and 96 |
   | 700 | 12d7+15 | 55 | 4 | 94 | 56 and 97 |
   | **650 (kept)** | **12d7+15** | **62** | **4** | **98** | **66 and 99** |
   | 600 | 14d7+18 | 61 | 1 | 92 | 58 and 94 |

2. **The blow rises with the hit points.** Hit points alone read half at 1,000, but 38 fights in 100
   are then broken off at the fifteenth round: the beast is not beating the company, the clock is,
   and a company that waits it out may well win. The rule for the four Act II bosses (saltreach.md
   holds the Choirmaster's, sunderwood.md the Warden of the Sunder's): raise the hit points till the
   floor reads about half, and where more than one fight in ten is then broken off, raise the blow
   and lower the hit points till it is not. Both Wrackholm blows stay under the line's at 14
   (13d8+15, 73.5): 63 and 66.
3. **It is won two in three at 12, not a half, so that its cave holds its aim.** The cave's four
   groups pool at the floor, the crew and the two devilfish groups won every time: (300 + 66) / 4 is
   91.5%, inside the aim of 90%, as #188 left it. At 700 hit points the beast reads 56% and the cave
   89%, off its aim. The boss stays inside its own aim at both levels, so it is not listed.
4. **The Warden of the Tide is set again at 780 hit points and 12d7+18** (674 and 10d7+15 before), by
   the same method. #190's gate set him 63% at 12 and 96% at 14; the gate's company, with its first
   prestige, won him 94% at 12, past the limit. The tries:

   | Hit points | Blow | At 12 | Broken off | At 14 | The gate's hundred, 12 and 14 |
   |---|---|---|---|---|---|
   | 674 (before) | 10d7+15 | 96 | 0 | 100 | 94 and 100 |
   | 900 | 10d7+15 | 52 | 12 | 98 | 52 and 98 |
   | 850 | 12d7+17 | 49 | 4 | 98 | 49 and 99 |
   | 800 | 12d7+18 | 62 | 4 | 99 | 59 and 100 |
   | **780 (kept)** | **12d7+18** | **67** | **3** | **99** | **66 and 100** |
   | 750 | 13d7+20 | 58 | 0 | 97 | 58 and 97 |
   | 725 | 13d7+20 | 64 | 0 | 98 | 63 and 97 |

5. **Two in three binds the Warden, from below.** The Rift has two groups, the Tide Elder's and the
   Warden, so its fights pool at (100 + the Warden) / 2, and the Rift holds its limit of 80% only if
   the Warden is won 60% or more at 12. At 850 and 12d7+17 he reads 49% and the Rift 74.5%, past its
   limit; at 780 and 12d7+18 he reads 66% and the Rift 83%, off its aim of 90% and inside its limit,
   as #190 left it (81.5%). The check lists the Rift as off its aim; the Warden is inside his own
   aim at both levels.
6. **The `OWED` lines for both go,** and the reasons `OFF_LINE` gives for them
   (`tools/tests/harness.ts`) name this issue. Level, xp, gold, drops, id and the groups stay, so the
   curve and `src/content/shipped.json` do not move. The area's pool two under its floors falls with
   the two bosses, from 93.7% to 92.2%, still past its limit of 90%, which #851 replaced by the day.

Decided by the owner's delegate for #18, each the owner's to overturn:

1. **An elemental weapon,** its blows carrying lightning: its dice a rung under the ladder's at the
   band, so the die is the gain; a class list as its kind has. The rule if the area session finds
   better: an element its own area's monsters are not immune to and the next area's are weak to where
   one is.
2. **A stat item,** a coat or a shield raising speed by 3 while worn: slotted, so one is worn at a time.
3. **Found, off the quest's path,** behind one of Wrackholm's hinted secret doors or in a cairn off the
   road (band 12 to 14); one of the two in a locked chest (`locked: true`), the first the area holds.
   Each priced inside Wrackholm's window, sold by no shop, sellable at half as all found gear is. Off
   the ladder: no `GEAR` row, so no figure moves.
4. **Names and texts pass the pillars;** two lines to a find.

Decided by the builder for #861, each the owner's to overturn:

1. **The hide is a hollow in F6's rock, behind a second secret door in its east face.** The five
   secrets the area already has hold a reward or are a way (E6's cache the Long Bow +1, F6's grave
   the seal, Kelp Hole's passage a way out, the shard-cut a way past, the hoist a way up), so none was
   empty; the cove, the ship and the drop are on or beside the quest line; E6 has no rock, and a hut
   would take walkable squares from the moor. The rock is F6's, and three squares of stone floor cut
   from it at 17 to 19 on row 10 with the door at 20,10 add walkable squares and take none away: every
   id, door square and chest id stays, and the first secret, the grave's, is still the box's first.
2. **Both finds in the one hollow,** the coat in a sea chest at 18,10 and the blade in an iron-bound,
   locked one at 17,10 behind it: one detour, one hint; a company with neither pick nor key still
   takes the coat and sees the lock.
3. **The blade is a Morning Star,** the ladder's weapon at 11 for five classes (knight, paladin,
   ranger, barbarian and cleric, four of the premade six), where the bow is the ranger's alone; its
   `classes` are the Morning Star's, and its steel the plain Morning Star's, 2d6+3, a rung under the +1
   the ladder wears from 13 and the Flail it wears from 14, so the lightning die is the gain: `hits()`
   13.5 against 11 and 12 (10 for the steel alone).
4. **Lightning stands.** Of the 15 monsters the isle places past 10, 5 are weak to it and none is immune
   or resists it, and the nine of its own at 12 to 14 take the die whole; Sunderwood's nine have none
   weak or immune to it; fire is weak in one of them and immune in another, cold immune in one, and
   nothing the isle places is weak to either; nature and holy are the machines' immunities. No element
   is the better the delegate's rule asks for.
5. **The coat is the Sharkskin Coat a point lighter,** AC 8 for 9, of the same classes, raising speed by
   3: the speed is the gain, as the die is the blade's. Worn it is a point of armour class and an
   earlier turn (the thief's speed 15 to 18); in the pack or the bag it gives nothing; and the armour
   slot makes it one coat at a time, a coat and not a shield because a shield is worn beside armour
   and would add to it.
6. **The blade is in the locked chest,** the coat in the plain one: the better find behind the lock, and
   what a company that cannot open it still carries away is a thing worth the walk.
7. **The prices are 1,150 and 1,250,** a point of plus (150, `PLUS_PRICE`) to each point of the gain
   over what the ladder wears: the Morning Star's 700 and three points for a die of a mean 3.5; the
   Sharkskin Coat's 1,100 less 150 for its point of armour and 300 for the raise, a step of armour class
   and a turn. Both are inside the window of 2,500 and under Plate Mail +1's 1,350, the dearest find
   the curve names for the area, so that line of the curve stands as main prints it; they sell back at
   575 and 625.
8. **The names** are Corposant, Morning Star and Runner's Coat (§10): 23 characters for the blade, so
   its sheet line, "WEAPON Corposant, Morning Star, LIGHTNING, EXPERT", ends at 313 of the 334 the
   column allows.
9. **The hint is a groove in the turf** (`f6_drag`, 21,10): a thing seen on the door's near side that
   explains nothing and is there at every hour, as the hint rule asks. The hollow's event says what is
   in it and no more.
10. **No chest holds gold,** so F6's clear, the area's 7,279 gold and §8 stand.
11. **"Off the road" is measured by walking,** from every square on a shortest walk from F6's way in to
    its shingle, since the isle has no road of its own: the groove's end is 20 squares from it by the way
    a company walks and 7 as the crow flies, solid rock between. #875's crater lip was measured so, 10
    by walking and 6 by the crow. A hide ten squares off by the crow would need a new outcrop in F6's
    north-east, turning grass to rock and taking walkable squares from the box.
12. **The walkthrough walks the detour in F6** on from the founder's grave, the company's thief
    (Ottilie, born to Lockpick, #857) picking the lock, and plays the lock's refusals on a game of its
    own against the real chest: the checks were each broken in the tree and watched to fail (the PR
    lists them).
13. **The pilot is not stranded and does nothing new.** It reads the world through what it has seen; the
    door is drawn as rock and the explorer suspects only cells drawn as wall (`suspects`,
    `src/app/pilot/explore.ts`), so it never suspects it, and a locked chest it came to would be
    pressed on once and walked past, as a locked door with no key is (#857).

Decided by the builder for #835, each the owner's to overturn:

1. **The bounds' brief is §12,** for E5, F5, F7, the enclave and the lair, the last two in §4's
   form too, in three pull requests: the three strands with the brief (#828's 3, one pull request
   for the three), then the enclave, then the lair once #847's powers and Old Nick's drawing are in.
2. **Each strand is Wrackholm's, laid whole in its one zone,** E5 at E6's 12–13 and F5 and F7 at
   F6's 13–14, the boxes they run off, so no crossing line is said at their edges.
3. **No strand holds a group.** The curve's rise rule asks a box's hardest group at its top, 13 on
   E5 and 14 on F5 and F7. At 13 the isle has its devilfish (already in E6's pools, Kelp Hole, the
   Tide Ship and F6's pools), the Hand's overseers who keep the chains and the Rift's Tide Elders,
   which keep to the Stone; at 14 only its bosses and F6's keepers. A group on a strand of 56 to 74
   squares would crowd it, beside a door on two of them, and repeat the isle's own. The area's clear
   already gives 11,426 xp a member of the 9,867 the curve asks (§8); the enclave and the lair are
   the bounds' fights.
4. **Each strand has its wilderness feature,** of a kind no other strand has: E5 a ship's
   figurehead with a riddle, answered anchor (+1 endurance once), the isle's first statue; F5 a
   cairn of shore stones; F7 a spring at the cliff's foot, a fountain (+1 speed once), the isle's
   first: a camp there would repeat F6's lee hollow, seven squares across the seam.
5. **Each secret is a hollow behind a face of rock drawn on the strand,** a ring of nine squares
   where the atlas has shallows, sea or sand, its hint a thing seen at the face: soot where a lamp
   burned (E5), fish scales dried on the rock's foot (F5) and a cut chain in the sand (F7). Each
   door stands where the art check takes it.
6. **The finds are gold, Elixirs and Sapphire Vials,** the dearest healing and spell points that
   Saltmouth's Quay Chandlery sells, 450 gold in all; the strands give no gear.
7. **The enclave is a wreck on E5,** the largest strand, held at 14–15: its door was left bare at
   18,28 in black rocks drawn at the strand's west end (18,29 before it) and is built since as the
   break in her side (13 to 21). Its groups are the Hand's overseers and the Sunderwood's gleaners
   in her hold (§12.5), their sizes and its reward set in 15 and 17 inside the Sunderwood's window,
   3,000 (#845's 3).
8. **The lair is Old Nick's sea cave on F5** (§6, DESIGN §9, MONSTERS §13): its door was left bare
   at 16,30 in a reef of rock drawn at the strand's east end, in sight of the hermit's point, 16,31
   before it, and is built since as the way in under the reef into Nick's Locker (22 to 24).
9. **The strands meet E6 and F6 square for square,** their edges worked from the built letters:
   E5's 15,31 and F5's 17,31 and 18,31 are sand, as E6's and F6's are, where the atlas has
   shallows, and F7's row 0 agrees with F6's row 31, sand at 1 and 19 and rock at 11, 12 and 16
   where the atlas has shallows, hills and grass. F7's 17,1 is sand, so the shore's end at 17 to 19,
   walked onto from F6, is walked to inside the box. Every corner agrees with its built letters; no
   built square changes and no `SEAMS_AS_BUILT` row is added. The three `OPEN_ON_NOTHING` rows the
   strands answer go and none comes: every edge they turn to unbuilt land is the sea.
10. **The strands differ from the atlas at 42 squares** (E5 13, F5 14, F7 15): eight at the seams,
    F7's 17,1, the doors' six of rock and the hollows' 27.
11. **E6's `e6_north` says what is now true,** "Open grass runs north to a strand and the sea."
    where it said "then air"; its id, place and once stay.
12. **The walkthrough walks the bounds in one function,** `theBounds`, called last.
13. **The enclave is the Brokenback,** the isle's crews' word for a ship that has broken her back on
    the rocks (§10): the wreck on E5's black rocks, one level of 16 by 16 (§12.5). Her own name is
    gone from her board, and the crews' word stands for it.
14. **It is held at 14–15,** a band over E5's 12–13, its floor over E5's top (#845's 2). Its window
    is the Sunderwood's 3,000, the last road area whose floor is at or under 14 (#845's 3). Its
    floor, 14, is not over the isle's band, so the pace and novelty checks place it with Wrackholm
    (`roadPlace`).
15. **Its groups are three overseers with a gleaner at the hold's mouth and four gleaners at the
    cabin's door,** at 13.5 and 15: the brief's Hand overseers (13) and Sunderwood gleaners (15),
    the hardest the gleaners alone, which the curve's rise rule asks at 15 (`nearTop`) where the
    isle's roster stops at 13 but for its bosses. Two of each would be F6's keepers again. Sized
    with the harness at 14: the first alone 8.7 fights before a rest, the second 6.8 and the two in
    a new order each seed 7.5 (4.8 at 12); three overseers with two gleaners paced 6.4 and two with
    three 6.2, under the aim's 6.5. The gate gives 7.48 and, two under, 4.91.
16. **Both groups stand in doorways,** the first at 7,7 behind the neck at 7,6 into the hold and the
    second at 7,12 just inside the bulkhead's door at 7,11. Groups never move and a fight starts
    only next to one, so a company on foot, wading or climbing comes up to them in that order and
    passes neither: the way aft runs through the first's doorway, and the cabin and the plank lie
    past the second. The walkthrough asserts it.
17. **The reward is Keelhaul, Long Axe,** the master's own: the Seawall Armoury's long axe (2d6+4,
    two-handed, for the four martial classes) with its blows carrying cold, at 1,600, in the
    master's strongbox with 300 gold. It is the plain piece where the ladder wears the Sunderwood's
    Great Axe from 14 (13 a blow) and its plus from 16 (14), the die of cold the gain (14.5, the die
    counted at 3.5); off the ladder, found there alone and sold nowhere (the walkthrough asserts
    each, and the rungs) and inside the enclave's window. The cold is the area's rule for an element
    (#861's 4): it lands whole on all fifteen kinds the isle places past 10, the wreck's two among
    them, and of the Sunderwood's nine only the hound is immune to it; nature and holy are nothing
    to the Dead-Drop's five machines, and lightning, which does better, is the Corposant's already.
    The lair's artifact is another thing.
18. **The secret is the master's strongbox under the cabin's deck,** a hollow two squares long
    behind the cabin's east wall, its hint one plank of the deck worn bright among the grey, by the
    wall at 11,13: searched from there facing east, the wall at 12,13 gives; no company walked,
    waded, climbed or floated reaches the hollow but through it. The strongbox is the secret's
    prize, as Karaordu's sabre is the eldest khan's; the hold's cargo chest holds 250 gold and an
    Elixir, the dearest healing the Quay Chandlery sells.
19. **The door is the brief's square, E5's 18,28,** the one square of E5 that changes: rock drawn as
    stone among the black rocks, with rock at 17,28 and 19,28, walked onto from the strand at 18,29,
    where the way back sets a company down facing south onto the grass; nothing stands within four
    squares of it. The break opens on the strand's side, and 18,27 behind it is shallows that only a
    swimmer reaches, who steps onto the same square. With it E5 holds 74 walkable squares and 5
    points. The plate on the world map is at 150,150, out in the sea four squares from the door each
    way, as the Tide Ship's lie.
20. **The walkthrough walks it in `theBounds`,** after the strands: the break's square and what is
    round it; the door's words at 11, 12 and 14 and its sign; both groups won at 14 and met in
    order; the cargo, the plank and the hollow shut but through its wall; Keelhaul in the strongbox
    and nowhere else; and out onto the strand.
21. **§12.5 is the brief brought to what is built,** with its encounters, reward and pay as they
    stand and its As built; the §12 table's row for the enclave is built.
22. **The lair is Nick's Locker,** the crews' name for Old Nick's sea cave under F5's reef (§10),
    after the sailors' locker of the drowned, from which nothing comes back: one level of 16 by 16
    marked `enclave` at 30–32, as the brief has it (§12.6).
23. **Old Nick lies alone in the cave's throat,** at 7,9, where the passage from the mouth, one
    square wide, comes up to the cave, so the ship, her master, the kelp and the cleft all lie past
    it and nothing in the lair is had without its fight. It never moves and never comes back: a boss
    with no `respawn`, `roams: false` and a `slainText`.
24. **The door is the brief's square, F5's 16,30,** its reef drawn as stone and given the one exit,
    walked into from the strand at 16,31 and waded into from the shallows at 16,29, the way back
    setting a company down on 16,31 facing the land. It is the one square of F5 that changes: F5
    walks 74 squares with it and counts it among 5 points, and nothing stands within four squares of
    it. Its plate is out in the sea at 188,152, four squares from the door each way, as the
    Brokenback's lies.
25. **Old Nick's numbers are set by its gate,** as the Steiger's are (docs/areas/kilns.md §9, #831's
    41). Drawn at the line's boss at 32 (2,100 hit points, attack 20, 34d8+41), every blow it landed
    drinking back what it took, the gate's company never won it at 30 or at 32; at 1,600 hit points
    and 20d8+20, its attack, armour, pace, reach and drinking kept, it is won 57% at 30 and 81% at
    32, where the Stair's Catcher and the Steiger stand (57% and 80%, 56% and 81%). Off the line,
    its row carries its own `offLine` word (#897); it keeps the boss line's 20,373 xp at 32. Its
    drinking is the whole of its fight: without it the gate's company wins every fight, at 30 and at
    32, in about seven rounds. With it no fight is lost inside the round cap of 15, and every one
    not won is broken off there, 43 of the gate's 100 at 30 and 19 at 32, Old Nick left with a
    quarter of its hit points at the median; let run, the gate's company wins 71% at 30 and 86% at
    32 and falls in the rest.
26. **Holdfast lies alone on the ship's master,** against her keel past Old Nick, with no gold
    beside it, as the Erzhemd lies alone in the smith's kist: the knife of Merryn's rumour, where
    Old Nick took it with ship and master. One in the world and sold nowhere; the walkthrough
    asserts that no other chest, cairn, statue or shop holds it and no monster drops it.
27. **The secret is the master's sea chest in a dry cleft behind the ship's bows,** two squares
    behind the rock at 9,2, found from the kelp grown green over the rock where no wave comes, as
    the knife's haft has not rotted (§6), and searched there facing north: 500 gold, an Elixir and a
    Sapphire Vial, the dearest healing and spell draught the Quay Chandlery sells, as the strands'
    finds are (§12.1). It lies past Old Nick, and no walker, swimmer, climber or levitator reaches
    it but through the rock.
28. **The rumour is Merryn's while Old Nick lives,** DESIGN §9's two lines after her own words at
    each of her four meetings after the first, whatever has become of the founder's letter. "Nick
    gives nothing back" is not so once it has fallen and the company has the knife, so each such
    entry holds `until` its fall (`slain`), and after it an entry of her own words alone waits on
    the fall. Her first meeting sets `q_hermit` already, so no flag is added; the lines set nothing,
    and where the letter is not yet carried her own question still follows them. A company from an
    old save that has met her hears them at its next meeting. A save from before version 6 that met
    the Deepthorn's hermit and had trodden her box keeps `q_hermit` (#941) and hears them at its
    first meeting with her.
29. **New here:** the lair itself (#845, #846), the isle's one place at the cap, its guardian a boss
    whose blows heal it and the area's artifact a knife that casts Grasping Roots three times a day
    (#847).
30. **The owed rows go,** as EXPANSION §8.2 (#897's 12) and #847's 6 say: `holdfast` leaves
    `UNPLACED` in tools/tests/items.ts and Old Nick's row the area's `checks.ts`, which owes nothing
    now.
31. **#835 is done with the lair, its last piece:** the three strands, the enclave and the lair are
    built and judged, the enclave at 14–15 and the lair at 30–32 with Holdfast in it, and no built
    map of Wrackholm is open onto unbuilt land (§12.1): every edge its boxes turn away from the isle
    is the sea, and no row of `OPEN_ON_NOTHING` and no crumb faces the area.
32. **§12.6 is the brief brought to what is built,** with its encounters, finds and pay as they
    stand and its As built; the §12 table's row for the lair is built.
