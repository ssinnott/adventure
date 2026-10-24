# The Kilns' decisions

The Kilns' decisions (EXPANSION §8.2): the old §9 of its doc, `docs/areas/kilns.md`, moved here
whole by #1027, every list in its order. It is appended to and never rewritten: a builder adds a
list at its end, and a later decision that changes an earlier one says which. Its current state is
`docs/areas/kilns.md` and its plan `docs/areas/kilns/plan.md`.

## 9. Decisions

Decided by the owner's delegate on 2 October 2026 (#434), and followed here; the calls are #434's by
number, and those that are not the Kilns' are left out:

1. **The Anvil Stone is bought back or taken** (call 1), a choice the thane puts in Anvilhall the
   way a business puts its menu. Buying costs about 6,000 gold, set with #535 so a clear of the Fells
   and the Tiefzeche can just pay it. Taking puts the Anvil Guard on the Stone's approach (`after`)
   and shuts Anvilhall's forge to the company for good, so the gear step is Kilnhaven's smith's at a
   quarter more. Either way the Warden of the Anvil must fall for the tear to close, the Stone counts
   for the Hearth (#168, #540), and the thane never forgives: words change, nothing else.
2. **Kiln-script is read, never needed** (call 2): an inscription is a sign with two texts; a
   reader is a member with Linguist, a dwarf (free) or 34's copybook; reading gives a secret's hint
   in the machine's words, finds the Tiefzeche's service ladders between levels, a shortcut, and
   marks the machine's mouths (the ice-hole, the bay under Coldmere, the vents) on the world map.
   The Lanterns teach Linguist at every hall of theirs, and a Lantern reader in Anvilhall teaches it
   too (#538).
3. **The Anvil Stone's Rift is hand-built** (call 3), one level of 16×16 in slag and iron, the last
   Rift on the road.
4. **The act's one story lock is the sealed bay under Coldmere** (call 4; #440), not the CREW ONLY
   door, which is a wall with words on it.
5. **No new guild** (call 8): no hall gives an Act III side quest, and the Wardens' and Lanterns'
   fourth ranks open in this act (#439, built: §6, and the block for #439 below).
6. **Cairnmoor has no town** (call 9): Anvilhall and Kilnhaven teach to 19, and the drove road's
   coach runs Kilnhaven to Rime Lodge.
7. **The cuts stand and the country behind was parked** (call 10): §11, and #474, taken off parked by
   the owner on 9 October 2026, is built: M4 and M5, and O3 and O4.
8. **All of #56's 33 to 36 stand** (call 11): §6.
9. **The names** (#435): §10.

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.15: each box's landmarks, points of interest, encounters, secret and
  hint, inscriptions, finds and share of the pay.
- **The core** is N3, N4, O5 and L6, the boxes that hold a step, and N5, the smelter, where the
  crown is made and the verse stands over a second forge; the rest is country (§4).
- **The dungeons' sizes:** the Tiefzeche three levels of 16×16, the workings, the old workings and
  the lowest (#462); the Rift one level of 16×16 (#465, call 3); Feuerstollen two levels of 16×16
  (#466).
- **The towns' businesses:** Anvilhall's six (§4.4), the great hall carrying the choice as a
  business carries a menu, the forge shutting on `anvil_taken`; Kilnhaven's six (§4.14), the
  harbourmaster's office a business so that the manifests have a room.
- **The verse is read aloud by the Lantern reader the first time,** so the step needs no skill, and
  a company with a reader of its own reads it first (§4.4, #459).
- **The service ladders are secret doors found by reading** (§4.7): the hatch opens to a search once
  the inscription beside it has been read, and the stairs stay the way for everyone. As #538 built
  it, the reading is the hatch's hint and a search finds it as any door (#538's 5, below).
- **The pay's shares** (§8).
- **The bands on the atlas's rows** (#456): the Iron Fells 16–17, the Kilns' heart 16–18,
  Kilnmouth 17–18, Anvilhall 16–18, the Tiefzeche 16–18, the Anvil Stone 17–18 (the plan has 16–18),
  Feuerstollen 17–18, Kilnhaven 16–18. They are set in `src/content/areas/kilns/atlas.ts`, where
  only the scaffold reads them, for a box's draft; the owner's word changes them there.
- **N4 is the heart's,** as the walk gives it, so the heart reads 16–18 and the Tiefzeche is the
  heart's dungeon: the plan's link (`ironfells` to `deep_mines`) and MONSTERS §7.1's parenthesis,
  which put the Mines in the Fells with Anvilhall, are the owner's to reword or to overturn by laying
  N4 in the Fells, which would make the Fells 16–17 still and the heart 17–18.
- **The surface roster's top** (§7): the 17–18 boxes hold their top with rock worm pairs at 17 and
  leave the 18s to the Rift, the tubes and the Foreman, or #472 adds a surface monster at 18.
- **The Fire Beetle, the Salamander and the Rock Worm off their Where column,** and the Hand's
  overseers and crew from Act II's roster at level (§7).
- **The keepsakes:** the Anvil Shard (N3's and O5's), the Heart of the Anvil and the parts the
  machines carry, none taken by a hand-in, as the Brine Shard, the Sunder Shard and the Heart of the
  Sunder are not.
- **The heart's zone keeps the area's name on the atlas** ("The Kilns", `kilnsheart`): a name of
  its own is the owner's to give with #435 (§10), since the crossing line into it says the area's
  name twice.

Decided by delegate for #540, each the owner's to overturn:

1. **The flag is `q_anvil_closed`,** set once the Warden of the Anvil has fallen and the tear is
   closed. The Warden's fall sets it (#636), the chapter's Stone entry reads it (#470) and O5's slaglings may
   stop `until` it before the Rift is built (#464; built since: #465). It is the Stones' own form
   (`q_tide_home`, `q_grove_mended`), and not `_done`, which would read as the chapter's end. Nobody
   renames it or adds a second.
2. **The Hearth does not read the thane's choice.** Bought (`anvil_bought`) or taken
   (`anvil_taken`), the count is the same: the choice is how the Stone came to the company, never
   what restores it, and the Rift opens whatever the thane said (§5). A company that closes the tear
   before it has spoken to him steadies the Hearth all the same. §4.10 asked that the Stone be the
   company's as well, and now says bought or taken alike.
3. **A flag, not the Warden's death read as `slain`,** as the issue has it: the Rift's map is not
   built to name (built since: #465), and one flag is what the Hearth, the chapter and O5's groups
   all read. It is owed to #470 in `tools/tests/quests.ts`'s `UNSET` (#415) until something sets it,
   and the first to do so drops the entry there (dropped since: #465 sets it).
4. **No wording changes.** The title, the sky and the almanac read the count, which stands at five
   Stones already, so the Anvil Stone is one step more wherever it falls.

Decided by delegate for #539, each the owner's to overturn:

1. **A crossing is written once, both ends together,** in `content/crossings.ts`, as
   `content/stones.ts` lists the Stones: one fare, length and timetable either way, and each end's
   landing once its town is built. A town sells one by a person whose `passage` is `sells(...)`.
2. **Nothing is sold toward a town not built:** an end with no landing names the issue that writes
   it (#469 for Kilnhaven's three, #487 for Rime Lodge and #512 for Cinderport), and a seller whose
   crossings all wait only talks. So none runs yet; the ferry runs first, once #469 writes the quay
   (run since: the ferry with #469 and the coach with #487; the ship waits on #512).
3. **Once both ends land, both sell it** (a crossing that runs one way is not honest, #177's 1), or
   the check fails: #469 puts the ferry's seller on Saltmouth's quay (done: #469's 7), as #177 gave
   E6's captain the way back. Saltmouth's landing is written now: 13,10 on the quay, facing west,
   where Kitto's lands.
4. **A fare is 12.5 gold a level of the dearer end's floor for each day,** as Kitto's boat is 150
   for a night to Wrackholm's 12: the ferry 400, the Compact ship 600 (Cinderport's 24) and the coach
   250 (Rime Lodge's 20). The check holds the rule.
5. **The days are the way's length at Kitto's pace,** some five squares an hour, and at least one:
   two for the ferry's 290 squares of sea and the ship's 230, one for the coach's 140 of road. The
   ferry sails at 8 and the ship at 20, as his does, each landing at 16; the coach runs 6 to 12.
6. **A seller may halve a fare for his own guild at his own end,** and Kilnhaven halves none
   (§4.14). Whether Cinderport halves the ship for the Compact, as docs/areas/ashfall.md §4 has it,
   is #547's to settle with #512 (settled by #547: it does, at Cinderport's end only).
7. **The atlas's link, sold both ways, is drawn as that way built,** on its course and under its
   name, and not again as planned.
8. **The gate needs nothing new:** #164's `landings` makes a town a crossing lands in a way into the
   zones its ways out open on, so each town is held to it from the day a crossing to it runs.

Decided by delegate for #538, each the owner's to overturn:

1. **An inscription is a sign with `read`**, not a feature of its own: its words are said as any
   sign's, and the reading after them as its reader's line, *Maren reads: "STORE."*, so a brief's
   *Read: X* is written `read: 'X'`.
2. **A reader** is the first standing member with Linguist or a dwarf, else, while an item with
   `skill: 'linguist'` is carried, its carrier or the first standing member; one knocked down reads
   nothing.
3. **A reading is kept by the inscription's id in its map's `used`,** as a once-event is: `seen`
   names it for a person's words or an entry, and nothing new is saved. An inscription must have an
   id, and the type asks for one.
4. **A reading may be a secret's only hint, and the hint check counts it** as any sign on the near
   side; the briefs' seen hint beside it (§4.1) stays the boxes' practice, so no secret needs a
   reader.
5. **A reading is a hint, never a key:** a hatch it names is found by a search as any secret door
   is. Gating the hatch on the reading (the ladders' proposal below) is not built; it would want a
   field on `secrets`, #462's to ask for.
6. **`marks` names atlas places,** planned or built, one or several; once read, the world map pins
   each with a hollow square of its own colour, with no name and no word in the legend, which is
   full, and the first reading says *Maren marks the world map.*
7. **Reading never opens the road:** it sets no flag and changes no door, and the check refuses a
   way whose `shut` names a reading.
8. **Linguist is a list on the member, `skills`,** absent in an old save and read as none, so no
   save bump; the dwarves are born to it (the skill's `races`), so the sheet lists it for a dwarf too.
9. **A guild's halls teach its skills to its members** (DESIGN §5 and §8, "taught to its members"):
   every business with `hall: 'lanterns'` offers "Learn a skill", Rime Lodge's too once #487 builds
   it (built since: #487), and a stranger to the guild hears *"We teach our own."*
10. **A person teaches a skill with `skill`,** beside `teaches`, which stays the prestiges', so the
    walkthroughs that read `teaches.cls` keep their types; Anvilhall's reader is #459's to place
    (placed since: #459).
11. **Linguist costs 1,000 gold a member:** a first prestige's price, under a tier 6 spell at the
    Watch (1,280) and an eighth of training six through the band (7,920, §8).
12. **The copybook is any item with `skill: 'linguist'`,** tested with a fixture until #471 builds
    the Primer's (built since: #471). A carried thing's own Kiln-script (34's rubbing) is not built:
    an item would want a reading of its own, a few lines in the systems lane, for #471 to ask for
    (it did not: §11). A dwarf's line reads it instead, in the area lane alone (built since: #637).
13. **The line check hears an inscription as a reader with a ten-letter name does the first time:**
    its words, reading and mark said together, which Feuerstollen's brief (§4.11) fills exactly.
14. **The novelty check names the new mechanics** `sign:read` and `sign:marks`, for §7's claim.

Decided by delegate for #472 (the knockers), each the owner's to overturn:

1. **The knockers are woodlice the vessel made:** smooth grey plates laid one over the next, round
   over the back and flat under the belly, on thin legs with ball joints, all alike, stepping in a
   wave. Small, many-legged and smooth read at once, and nothing on the road is shaped so; the
   spider frame, eight legs with the knees high, was left to the spiders.
2. **One lamp in the cowl's face, under a brow,** warm as a miner's lamp and the same in every one:
   a pool of it lies on the rock ahead of a knocker, and now and then it dims, as a blink. The cowl
   is a plate of its own over the shell's front.
3. **The chisel's mark is a lozenge on a stem,** cut straight and even into a plate of every one.
   It is the mark's first drawing, so the chisel's and the treaty's seal can follow it. It is not the
   loop inside a loop: that is Wenna's family knot (STORY, Acts One and Three), hers alone, on the
   frame of the door marked CREW ONLY.
4. **The Knocker knocks:** two feelers off the cowl's chin end in knobs, and it raps the rock ahead
   with them in turn. Fodder on #409's line at 16: 127 hit points, armour 18, +9, 3d5+2, speed 12,
   317 xp; size 0.45, tint #84878e.
5. **The Mender carries its trade,** domed higher, a spool of copper wire on its back and an arm
   that brings a needle down before its cowl, a cold light at the point, so a company picks it out
   of six knockers at a glance. A soldier's numbers at 17: 199 hit points, armour 20, +10, 3d8+4,
   speed 11, 673 xp, on #541's line (196 and 3d7+5 on #409's); size 0.55, tint #9a9c96.
6. **The Mender casts Mending Light one turn in two** that one of its group is hurt. At every turn,
   the harness's bot, which never singles it out, broke off half its days at fifteen rounds at 16
   and 17; at one in two, 6 to 7% of them, the fight a round longer than with a mender that never
   mends (5.4 rounds to 4.4 at 16, 300 seeds). On #541's line, the Mender re-stated, 7% and 13%.
7. **The Foreman is a knocker grown long and reared up,** its cowl bowed over a slate held before
   it with the list cut on it in rows, an empty box at each row's end; a stylus goes down the boxes
   and ticks none, and now and then the lamp lifts from the slate to the company. Size 1.3, under
   the tall boss's 1.5, so it stands on its group's rank; tint #5c6068.
8. **The Foreman stands on the boss line at 18,** 1,001 hit points, armour 22, +13, 18d8+20 on #541's
   line (961 and 17d8+20 on #409's), for #462's gate to tune, as #199 tuned the Warden of the Sunder:
   a company wins it 9% of the time at 14, 50% at 16, 79% at 18 and 99% at 20 (300 seeds; 17%, 66%,
   82% and 99% when it was drawn).
9. **One frame, a Build to a kind:** length, dome, taper, rear, plates, legs, stance, step, cowl,
   feelers, spool, needle, slate and the mark, so MONSTERS §11's tallyman, deep knocker, inspector
   and tally clerk are each a Build, a colouring and what their trades carry.
10. **No gold and no drops:** machines carry parts (MONSTERS §2), and the parts are items, #462's
    to add with the groups it places, as the Heart of the Sunder came with #199 (added since:
    #462's 13).
11. **They stand unplaced, owed to #462,** which seats six knockers and a mender twice in the clean
    corridor and the Foreman before the door (placed since: #462).

Built since, in the systems lane: MONSTERS §2's line for the first time the Hearth's light passes
through a machine, *The light goes into it like a hand into a glove.*, follows in the combat log the
knocker that takes 0, once a game (MONSTERS §3).

Decided by delegate for #535, each the owner's to overturn:

1. **Act III's ladder is built as Act II's was** (#399's 1): each town sells every class a new line,
   a point of blow a rung and a two-hander a point over a one-hander, and the boxes give it with a
   plus: Anvilhall's forge at 17, the Kilns' and Cairnmoor's finds by 19, Rime Lodge's furrier at
   21 and Rimewater's finds by 22.
2. **The forge sells eight, a smith's and a miner's:** a Forge Hammer, a Seax, a Steel Bow, a
   Mattock, a Banded Staff, Dwarf Mail, a Kiln Robe and a Forge Shield (§4.4).
3. **Armour steps on alternate rungs, as Act II's** (#399's 2): the medium wearers take the Dwarf
   Mail (11) at 17 and the furrier's Bearskin Coat (12) at 21; plate's wearers the Forge Shield (6)
   at 17, N3's Plate Mail +3 (12) at 19 and the Sleepers' Bay's Plate Mail +4 (13) at 22; the
   casters the Kiln Robe (9) at 17, L6's Kiln Robe +1 (10) at 19 and the furrier's Fur Robe (11)
   at 21. Each gains in the act what it gained in Act II.
4. **No Dwarf Mail with a plus, and no Forge Shield +1 on the ladder:** a Dwarf Mail +1 would leave
   the furrier's coat no step, and N5's shield with a plus is its box's to place or not.
5. **The finds by 19 go where the briefs name the piece** (#399's 3): N3's armour, the Tiefzeche's
   weapon, Erzkamm's two-hander, O6's bow, M6's dagger and L6's robe, with Cairnmoor's caster's plus
   at O7. M3's, N4's, O5's and the Rift's are their boxes' to choose, off the ladder; O5's helm is
   none, as no item is worn on the head.
6. **The finds' rung is 19,** as Act II's was 13, in the middle of the act's second area: a company
   two under Cairnmoor's floors at 20 goes without it.
7. **A ware rises about a quarter a town, its dearest a little over half its window,** as
   Saltmouth's Sharkskin Coat (1,100 of 2,000) and the Watch's Lamellar (1,600 of 3,000) were: the
   Dwarf Mail 2,000 of 3,500, the Bearskin Coat 2,500 of 4,500. Act II's half again a town would
   bring Cinderport's step to the edge of Ashfall's 5,500 (#542).
8. **Kilnhaven's smith asks a quarter more, in whole gold** (`quarterMore` and `SMITH_PRICES`, for
   #469): its dearest, 2,500, sits inside the window, and the ladder test holds it and owes the
   shop to #469 (built since: #469's 10).
9. **The Stone is 6,000** (`ANVIL_STONE_PRICE`, for #459), sized as §8 says; the curve's row asks
   the training alone, and the boxes carry the Stone.
10. **The step is made ahead of the area** (`ITEMS_AHEAD`, `src/content/index.ts`), as monsters and
    rooms drawn ahead are: no save holds it until a listed area sells or places it, and the first
    box takes the table.
11. **The harness's line at 24 is owed to #541:** in the ladder's gear to 22 a company of 24 fights
    14.9 standard encounters to a rest where 10 are asked, and #541 makes the line past 16 again
    with it, as #409 did after Act II's (made again, 9.9 at 24: MONSTERS §4.4).
12. **The windows stay at 3,500, 4,000 and 4,500,** 500 a band as the issue has them: no ware or
    find comes within 400 of its area's.

Decided by delegate for #472 (the six), each the owner's to overturn:

1. **The six on frames that exist are drawn ahead of the first box,** in AHEAD, each owed a map by
   the box that first places it: the beetle and the worm #457's, the slagling #458's, the slag elder
   and the guard #464's, the Warden #465's. The salamanders come on their own, as the knockers did.
2. **Each is on its role's line at its level** (MONSTERS §4.4): the beetle armoured and the
   slagling a skirmisher at 16, the worm a brute and the guard armoured at 17, the slag elder an
   elite at 18. #541 re-stated the worm, the guard and the elder to its line: 404 hit points and
   4d8+7, 250 and 3d7+6, 365 and 4d8+3, where they had 422, 263 and 383.
3. **The Warden of the Anvil is on the boss line at 18,** 1,001 hit points and 18d8+20 on #541's
   line (961 and 17d8+20 on #409's), its blow left for #465's gate to set, as #426 set the Sunder's;
   it shrugs off sleep, as every warden does.
4. **Cold bites the slag and fire does it half:** the slagling, the slag elder and the Warden are
   weak to cold and resist fire, so in the Rift Hoarfrost is the answer and Hearthfire is not.
5. **The Fire Beetle is immune to fire and nothing more,** so on the spoil heaps the sorcerer's fire
   does nothing and Hailstorm is the answer (MONSTERS §7.1).
6. **The slag holds as the other Rifts' things do:** the slagling paralyses at 0.1 a hit and the
   slag elder at 0.15, as the sunderling and the tide elder.
7. **Sizes:** the beetle 0.72, the slagling 0.74, the slag elder 0.95 and the guard 0.8, drawn as
   broad as he is tall; the worm 1.6, MONSTERS' figure, a tall monster; the Warden 1.45, the biggest
   warden yet and short of a tall boss.
8. **The beetle is a body of its own on the spider frame,** six legs under a dome with the coal set
   in its top, as the crabs have theirs, so Ashfall's cinder beetle can be its variant.
9. **The slag is the riftling broken rough as clinker,** cracked red and hung with drops still
   molten, the elder running with iron; the Warden has no legs, and stands up out of a pool of slag.
10. **The Warden's cut is a straight fissure down its chest,** opening on the heart, with a low crown
    of clinker, hot at the tips, where the other wardens wear shards.
11. **The worm comes up through a ring of rubble,** blind, its maw ring inside ring of teeth; the
    guard is a dwarf rebuilt on the figure frame, a maul stood beside him and an anvil buckle.
12. **The Warden drops nothing yet:** the Heart of the Anvil comes with #465, which places it, as the
    Heart of the Sunder came with the Sunder's box (#426); placed, #465's 10.
13. **No surface monster at 18:** #472 adds none; the 17–18 boxes hold their top with rock worm
    pairs at 17, as §7 proposes.

Decided by delegate for #472 (the salamanders), each the owner's to overturn:

1. **The Salamander is a beast, a skirmisher on MONSTERS §4.4's line at 16** (179 hit points, armour
   19, 3d8+2, speed 15), immune to fire and weak to cold as its row says, size 0.68: the sorcerer's
   cold is the answer, and the cleric's Hearthfire and the druid's Wildfire are not (DESIGN §7).
2. **The Great Salamander is a beast boss on the boss line at 18** (1,001, armour 22, 18d8+20 on
   #541's line; 961 and 17d8+20 on #409's), immune to fire and to sleep and weak to cold, as its kin
   and as the Eldest and the Great Devilfish. Its blow is #466's to set for the gate, as #426 set the
   Warden of the Sunder's, and its hide #466's to drop (both done: #466's 4 and 5).
3. **It is a tall boss, size 1.6,** seated on the third rank with its crown at 0.79 of its height,
   under its markers' 0.82: the deepest chamber's boss, and the biggest thing in the tubes.
4. **The frame is a lizard three-quarter on, coming at the company,** its head turned on toward the
   company's right. Side on, as the bears stand, a lizard is as wide as a bear and read as a dinosaur
   standing up; three-quarter on it reads as a lizard at a glance, and its mouth can open to them.
5. **The fire shows in blotches, as a fire salamander wears its yellow,** and on the Great Salamander
   in the seams of a crust of rock and in its open mouth. The embers are the parts apart, declared in
   `tools/smoke.ts` as the rift hound's are: three pieces, 1% of the ink.
6. **The frame is a Build for the kin to come** (MONSTERS §11): the ember salamander a hotter fire on
   a lither body, the basilisk no fire, a crest, a crown and a stare, each a Build and a colouring.
7. **The Salamander is owed to N3 (#458),** the first box whose brief places one (§4.3's spoil heaps,
   the roster's second fight), and the Great Salamander to the tubes (#466): `UNPLACED` in
   `tools/tests/maps.ts` says so until each is placed (both placed since, and `UNPLACED` is empty).

Decided by delegate for #473, each the owner's to overturn:

1. **The ids follow the towns,** `anvilhall_` or `kilnhaven_` and the business, as Saltmouth's do
   (`saltmouth_inn`): §4.4 and §4.14 give them for #459 and #469 to name, and each scene's file is
   named for its id, as `tools/changed.ts` reads a room by its file.
2. **The verse is lettered twice:** in the great hall over the kings' forge, where the reader reads
   it (§5), and in the forge over its hearth (§4.4, "under the verse"), since the dwarves read it at
   their forges and Gluthutte has it again (§4.8). It is the dwarves' words, cut and painted red in
   the font's capitals, never a reading (#538).
3. **The old script over the other doors is drawn as cut marks, never letters,** angular like the
   runes on the Grove Stone's copy in Thornhold: #459's "every door carries a verse" is kept without
   lettering verses the docs do not hold, and what one says is an inscription's on the town's map
   (#538, #459).
4. **The great hall's forge is the kings' forge, behind the thane's seat** (STORY, #459), its coals
   heaped in the arch so the seat stands dark against them; the forge business is the smiths'
   working forge, a room of its own.
5. **No crown on Anvilhall's anvil,** though #473's list had one: A Crown to Order's crown is made
   at Gluthutte (§6, #463), and a second in Anvilhall's forge would put it in two places.
6. **The rooms follow §4.4 and §4.14, not #473's older list:** the mine-surgeon's for a temple, the
   stores for a provisioner, training halls for trainers' yards. Kilnhaven's chapel is the Lanterns'
   (the ring on its altar) and a sailors' chapel, a ship hung from its beam as the coast hangs them.
7. **Kilnhaven's chandlery is a chandler's in the old sense,** candles and lamps, the miners' frog
   lamps among them, so that it is not Saltmouth's ship's chandlery again; it sells what §4.14 says.
8. **Kilnhaven letters its three ways out and nothing else:** RIME LODGE on the coach's board,
   SALTMOUTH and CINDERPORT on the board of sailings, with no times or fares, which are #539's. The
   manifests are ruled and never lettered: Sheer Point is the harbourmaster's to say (§4.14).
9. **Every room lets the day in,** by a window, a shaft, a breach or a door, so nine at night is not
   noon: Anvilhall's look out from the terraces over the heart, Gluthutte's smoke by day and the far
   fires red by night; Kilnhaven's on the harbour, the yard and the street; and the harbourmaster's
   and the chapel's windows hold the Hearth on the sea, as Helmstow's throne room's does.

Decided by delegate for #457, each the owner's to overturn:

1. **The brief is §4.2, not the issue's draft:** the issue's waymark in Kiln-script and the cache
   under it gave way to §4.2's milestone and walled adit, written after it, so N3's niche stays the
   first inscription a company reads (§4.3).
2. **The old adit is in a crag at the box's far end,** south of the trail by the east edge, not in
   the Fells' flank: the curve walks the mountains as a climber does, and only there is the worm
   further from the way in than the beetles on its spoil, as the rise asks.
3. **Three groups for five:** two threes of beetles on the spoil and the one worm, 1,068 xp a member
   for the brief's 700. Beetle pairs put fights to a rest past 10, and "a rock worm" is one; fights to
   a rest is the gate and a share a proposal, as Saltreach's C6 had it (docs/areas/saltreach.md §9).
4. **The milestone reads ANVILHALL 4, LANTERN WATCH 6,** at about 13 squares to the unit along the
   trails: the brief's 8 was long. M2's stone is put right from 12 to 8 so that the two agree, as
   Saltreach's D5 was; N3's spur, about 40 squares from M3's edge to the gate, keeps them so.
5. **M3 is laid whole in the Fells,** with Lanternwood's 554 squares of trees in its west, so the
   pass, the crossing and 404,70 are the Fells'. M2's road says the crossing as it arrives, with the
   world's harder line after it under the floor; going back the land's name is said. This is the line
   facing back that #202's 1 owed to this box.
6. **A pine verge at the crossing:** the forest beside the road in M3's first eight rows is pine two
   squares deep, so the pine the crossing names is there; the rest of the west stays forest, shut
   against L3.
7. **The Fells' line with the heart is held on the seam of rows 3 and 4** by seeds in the area's own
   rows, as at M2's edge: laid whole, M3 would run the Fells into N4, its mine's mouth and O4. N3's and
   O3's south rows go to the Fells, as laying N3 will make them; M4's north goes too, unheld, parked
   (M4 is laid since, whole in Kilnmouth: #474's 14).
8. **M2's ridge over the Warden's grave is rock for two squares:** with M3 laid, M2's south row is
   mountain and no longer the world's end, and a climber off the road would come down on the grave.
9. **The find is a Drover's Goad +2,** the Watch Staff's line at 1,300 gold: off the ladder as §4.2
   asks and the wagon's own, a staff a monk or a druid has a level before the forge's.
10. **Its gold is 740, its share by the brief of the 13,900** (§8): 240 in the cairn on the shoulder
    and 500 with the goad. The dwarves' hearth by the adit gives might.
11. **Two under, past 10, is judged by the day (#851), not by the fights won:** a company of 14 in
    the Watch's gear beats every group at the line's standard size, as on every Act II box; the
    gate's other figures are inside their aims.
12. **The woodcutters camp under the shoulder north of the trail's head and fell in the pines
    south-west of it,** each a point where the country floor wants one and the land is otherwise bare.

Decided by delegate for #458, each the owner's to overturn:

1. **The brief is §4.3, not the issue's draft:** no dwarf guards here, since the Anvil Guard stands
   at the Stone (#464), and the secret is the tithe-cellar, not an old working's second mouth; the
   verse and the Lantern reader are the town's (#459), as §4.4 and #538's 10 have them, and nobody
   camps at the gate.
2. **The gate is the atlas place's own square, 452,70 (N3's 28,8), not 452,80:** the town and the box
   are built at once, so both take the place's square, and the atlas's site and its way in move to
   it. The spur runs 46 squares of road from the trail to the forecourt before it.
3. **The gate is barred until the town is built,** as Lantern Watch's was on L2 (#200's 2): an exit
   leads only to a built map. Its exit is written beside the map, `GATE` in `ironfells_n3.ts`, into
   the town's start inside its own gate at 7,14 facing north, for #459 to list and to open the
   square; the town's way back lands on 28,9, facing south. The gate's event, `n3_gate`, leaves the
   town's line (§4.4) to the town, which says it on arrival (opened since: #459's 9).
4. **M3's milestone reads ANVILHALL 5:** the gate is 61 squares on from it along the trail and the
   spur, where #457's 4 counted about 52 to 452,80; M2's 8 holds at 106. The walkthrough holds the
   figure.
5. **Four groups for eight:** three slaglings by night on the trail's far end, gone once the tear is
   closed (`q_anvil_closed`, #540); three fire beetles and a salamander on the low heap and three
   salamanders and a beetle on the high one, the roster's fight; and the worm. They give 8.49 fights
   to a rest at 16 and 1,525 xp a member for the brief's 900: fights to a rest is the gate and a share
   a proposal, as #457's 3 has it.
6. **The worm lies in a collapsed working at the box's south-east corner,** in the rock the atlas puts
   there: the box's group at 17, further from the way in than every group but the high heap's (a rank
   correlation of 0.26).
7. **The terraces are fields behind dry-stone walls,** four of them, stepped up from a stair at their
   west end with steps at their east end, and the crag over the gate is mountain where the atlas has
   hills: a town cut into a hill, seen from its door. The gate's front is three squares of dressed
   stone.
8. **The niche is the shrine and the inscription on one square,** over the lowest wall: the hearth
   gives endurance on Space, the words are said on the step and the reading is the hint's second half
   after the ruts (#538's 4), so no company needs a reader to find the cellar.
9. **The mother at the well has her words and nothing more:** her token, her flag and the journal
   come with her son on the Tiefzeche's lowest level (#462, #471), so 33 never stands in the log with
   nothing to do until the mine is built (built since: #462, #471).
10. **The fell holds the hall's air shaft and an old bloomery** besides the brief's burying ground and
    cairn, and the camp is under a knoll by the spur: a core box's points must reach its open grass,
    and the brief's gather at the terraces and the trail.
11. **Its gold is 950, its share by the brief of the 13,900** (§8): 250 in the cairn and 700 in the
    cellar with the Anvil Shard (`anvil_shard`) and the Plate Mail +3, the ladder's (#535).
12. **Two under is judged by the day (#851),** as M3's is: a company of 14 beats every group at the
    line's standard size; the gate's other figures are inside their aims.

Decided by delegate for #459, each the owner's to overturn:

1. **The Stone is sold as a ware: an answer may have a `price`** (`src/game/map.ts`,
   `src/game/people.ts`), listed at it, barred to a company with less and paid as it is answered. No
   answer could take gold, and a negative pay would have run a purse below nothing.
2. **The great hall is a room with people in it,** as Lantern Watch's prior's room holds its Reader:
   the room says the nave and the verse, and the thane and the Lantern reader are each a "Talk to" on
   its menu, the thane's question the menu he puts.
3. **The verse is cut over the great hall's doors as over the kings' forge,** so a company with a
   reader of its own reads it at the doors, kept by its id (`seen: 'anvilhall:ah_verse'`), and the
   reader then says it after them; either way he sets `anvil_verse_read`, the chapter's step (#470).
4. **The reading is DANGER. KEEP FIRE BELOW THIS LINE.,** the line painted on a boiler, which the
   reader says aloud to a company with no reader before the brief's words.
5. **Four doors and the gate carry an inscription, not all six:** one point in four may be a sign,
   so the town holds five among its 22 points. The forge and the stores carry none.
6. **The forge is gone `until` `anvil_taken`,** its smiths with it, a barred door's word after it, as
   Helmstow's chapel shut (#157); no lock, since its trade is had at Kilnhaven's smith (§5, §9's 1).
7. **The thane's answers set their flags and pay nothing;** his first meeting sets `thane_met`, for
   the chapter to read. The town pays nothing of its own, as Saltmouth paid nothing of its own (#177).
8. **The town is a court cut down into the hill and open to the sky,** three terraces up from a gate
   one door wide to the great hall's doors: a town has the sky over it, so the hold's rooms are the
   rooms (#473) and the court their street.
9. **N3's gate opens** (#458's 3): the town lists `GATE` in N3's exits and its square is a door in
   the dressed front; `n3_gate`, which said the door was barred, goes, since the gate's label says
   the door as a company goes in (10). The way out lands on N3's 28,9, facing south. The plate
   moves into the hill behind the gate, at 452,66, as Saltmouth's moved onto its walled ground
   (docs/areas/saltreach.md §9, #177's 9), and the site at the gate is built.
10. **The brief's gate line is the gate's own,** `GATE`'s label, said as a company goes in: the game
    says an arrival square's events only once it is stepped on again. A step inside, the court is
    named, and the hold's name is over the gate.
11. **The inn is 35 a head,** a step past the Watch's refectory (30), as each town's is past the
    last; the stores sell the provisions at list price, and the forge the step and nothing else.
12. **The names are the dwarves':** Thane Wolfram, Gerda at the forge, Konrad the warder and Ilse the
    carver; the reader is Wystan Crane, a Reader by his rank. The businesses are named for what they
    are: the Old Working, the Smiths' Forge, the Candle Arch for its arch of candles.
13. **The side quests' people are #471's,** which places them: the Regent's scholar, the oldest miner
    and the Crust-Bearer's hand-in (§6). The court leaves its free squares for them.
14. **A condition's `seen` names a reading in the checks too:** `tools/tests/quests.ts` knew only
    once-events and caches, though #538 keeps a reading by its id as a once-event is.

Decided by delegate for #461, each the owner's to overturn:

1. **The brief is §4.6, not the issue's draft:** the secret is the wagon yard, not a miners' bothy
   in the spoil, and its hint the tally board and the fresh mortar, with the blessing's reading
   beside them. The issue's salamanders at the heap's warm end and its crust at the mouth are kept.
   Ash stays O6's, as §4.11 and §7 have it.
2. **The shaft is the site's own square, 440,96 (N4's 16,2),** where the atlas's site and its way in
   stand; the dungeon's plate stays at 440,104. `MOUTH` lands on the workings' first level at 7,14,
   facing north, the start this asks #462 to give `deep_mines`, and the way back up lands on 15,2,
   facing west, the spur's end.
3. **The shaft is shut until the Tiefzeche is built,** as N3's gate is (#458's 3): the shaft's square
   is wall and `n4_cage` says the cage is chained at the top. #462 lists `MOUTH` in N4's exits, opens
   the square and drops the event. The mouth's line, `n4_mouth`, is said once on the spur before it,
   for the chapter (#470) to read (opened since: #462's 16).
4. **Four groups for nine:** four fire beetles at the spoil's head by the trail, three salamanders and
   a beetle at its warm end and a rock worm in each of two open cuts, the box's groups at 17. They give
   8.73 fights to a rest at 16 and 1,468 xp a member for the brief's 900, as #457's 3 has it.
5. **The Hand's overseers are seen, not fought:** a cart comes down the trail by night with its lamps
   hooded and turns in for the headworks. The roster holds no overseer, and one at level would want a
   drawing of its own (§7).
6. **The oldest miner is left to #471** with The Miners' Hymn, as #459's 13 leaves him, so that one
   man does not stand in two places built by two hands. A miner at the camp speaks of the verses, and
   the mouth's line says them.
7. **The find is a Sharkskin Coat +2** (`sharkskin+2`, 1,400 gold), left in a cage by the cargo,
   which came from the coast. It is off the ladder as §4.6 asks, a coat the medium wearers have a
   level before the forge's Dwarf Mail, as M3's goad is a staff before its Banded Staff.
8. **Its gold is 950, its share by the brief of the 13,900** (§8): 250 in the cairn and 700 in the
   overseers' strongbox in the yard. The lamp-niche over the shaft gives luck.
9. **The crossing says the heart's atlas name,** *The Kilns.*, and to a company under 16 that the land
   is harder; a name of the zone's own is #435's (§9's proposal above).
10. **The stream for the smelter touches the box's south-east corner,** so the corner's two edge
    squares are its water, as the edge check asks.
11. **The zone walk moves 1,004 squares, unheld** (§1): the heart takes parked land in M4 and M5 and
    boxes the plan lays in the heart, as M4's north went to the Fells (#457's 7); M4 and M5 are laid
    since, whole in Kilnmouth (#474's 14). The seam's seeds
    under N3 and N4 go, the two boxes holding their own rows.
12. **Two under is judged by the day (#851),** as M3's and N3's are.

Decided by delegate for #460, each the owner's to overturn:

1. **The brief is §4.5, not the issue's draft:** the secret is the doors behind the wall and the hoard
   before them, hinted by the worn floor and the chalk, not a ledge path to the Fells' top hinted by
   the trainer's words; Hartmut says nothing of it.
2. **N2's band is 16–17, not 17:** the curve holds a map's hardest group within two of its top but
   over its floor, so a band of 17 alone asks a group at 18, which no surface monster is (#472's 13).
   At 16–17 the worms at 17 are its top, as N3's worm is, and the box is the relatively safe place
   DESIGN §5 asks for a second. Its floor is then the area's, so two under is asked of it alone (12).
3. **Three groups for four:** three fire beetles on the spoil nearest the way up, a rock worm in the
   west adit and a pair in the one under the rim. They give 8.76 fights to a rest at 16, inside the
   aim, where two lone worms gave 12.6, past the limit, and 1,095 xp a member for the brief's 600:
   fights to a rest is the gate and a share a proposal (#457's 3).
4. **No road climbs to it, and N3 is untouched:** the company walks up the open fell, grass on both
   sides of the seam at x 0 to 12, so Hartmut stands far off every road (DESIGN §5) and N3's map needs
   no change. N2's south row is N3's north row square for square, the crag over Anvilhall's gate
   running on as mountain along the rest of the seam.
5. **Hartmut, a dwarf, keeps the cave's mouth and teaches Ironhide:** his own words first, then his
   lesson once to a Berserker of 19, as Aylmer's and Leofrun's are, for the second's 4,000. His name
   is the dwarves' tongue's (§10): hard courage.
6. **The cave is cut at the site's square, 432,44 (8,14), its mouth at 8,15,** a cleft in the crag
   as Sjonghol's is. The passage and the room behind the face are walled in rock, so that no climber
   comes down into them, and only the doors at the back are dressed stone, out of sight from every
   square outside. The wall is an inscription on 8,14, the second hint beside the worn floor (#538's
   4), so no company needs a reader for the doors.
7. **The scholar has his words and nothing more,** unnamed and at the wall from a new game: his
   primers in Helmstow paper are seen, and he says he copies for himself. The choice, the copybook,
   his journal and when he comes up from Anvilhall are #471's (34), as the mother's are (#458's 9).
8. **The doors are walls with words** (#434's 4): five squares of dressed stone in a row at the
   room's back, lettered over and with no handle. Nothing opens them and nothing is declared in
   `content/locks.ts`; the lettering is seen and not read, as N3's markers are, since the brief gives
   it no words and a reading behind the face would hint at nothing.
9. **The find is the ladder's Mattock +1** (`mattock+1`, #535), with 400 gold in the hoard. Its gold
   is 640, its share by the brief of the 13,900 (§8), 240 of it in the cairn on the crest.
10. **The map is cut by hand:** the scaffold refuses the void under the rim, so it is drawn as
    mountain, as M2's corner was (docs/areas/sunderwood.md §4.9), and goes to the Fells (§1).
11. **Erzkamm's site is built,** at the cave on N2 (8.5,14.5), as Sunderfall's is on K2, and N2
    claims nothing new (§7).
12. **Two under is judged by the day (#851),** as M3's, N3's and N4's are: a company of 14 beats
    every group at the line's standard size; the gate's other figures are inside their aims.

Decided by delegate for #463, each the owner's to overturn:

1. **The brief is §4.8, not the issue's draft:** the secret is the shard store behind the slag heap's
   laid face, not a smith's hoard in a cold furnace, and the verse over the mouth hints at nothing
   here. The issue's slag off the Stone's road is kept, as a slag elder on the cutters' track (4).
2. **The smelter stands a square inside the north edge,** at 12,1 to 13,2, since the atlas's 436,126
   is the edge row itself: the site moves onto it, map-relative at 12.5,1.5, as Anvilhall's moved
   onto its gate (#458's 2). Its spur runs six squares west from the road at 20,3.
3. **Four groups for eight:** four fire beetles behind the smelter, three at the yard's foot, three
   salamanders and a beetle on the heap, and the elder. They give 8.64 fights to a rest at 17 and
   1,679 xp a member for the brief's 900, as #457's 3 has it.
4. **A slag elder for the brief's rock worm,** strayed from the Stone onto the cutters' track and
   gone once the tear is closed (`q_anvil_closed`, #540), as N3's slaglings go: the curve asks a box
   at 17 for a group at 18, and the elder is the roster's only 18 that is not a boss. A worm, or a
   pair, is 17 (§7); N2 took 16–17 instead (#460's 2), but N5's issue asks the gate at 17. The box
   places the elder first, so `UNPLACED` owes it to nobody.
5. **The smith and the factor have their words and nothing more:** A Crown to Order's choice, its
   flags and its journal are #471's (§6), as the mother's were (#458's 9). They are Eckhart, the
   master smith, his name the dwarves' tongue's (§10), and Kerensa, the Compact's factor, hers
   Saltmouth's.
6. **The furnace mouth is the shrine and the inscription on one square,** as N3's niche is (#458's
   8): it gives accuracy, and a reader reads the verse as the boiler's warning, as at Anvilhall
   (#459's 4).
7. **The shards are seen, not carried:** the store has them boxed and weighed for the Compact, and
   the smiths' chest a Forge Shield +1 (`forge_shield+1`, 1,250 gold), their own work, which #535's 4
   left the box to place. O5's cutter keeps the area's second Anvil Shard (#464).
8. **Its gold is 950, its share by the brief of the 13,900** (§8): 250 in the cairn and 700 in the
   store.
9. **The water is a stream,** the atlas's 78 squares, down from the north-east corner, where N4's
   meets it (#461's 10), to the west edge at 0,25 and 0,26, where the atlas runs it on into M5; the
   drove road fords it at 18,12.
10. **The cutters' track is dirt** from the drove road at 440,150 (16,24) to the east edge at 455,150
    (31,24): the atlas draws no road beyond, and the edge check asks road only where it does.
11. **The zone walk moves 1,852 squares, unheld** (§1). M6, N6 and O6 take their own when they are
    laid; Cairnmoor's 380 in M7, N7 and O7 go back when its boxes are laid or its own rows are
    seeded, which is Cairnmoor's to do (#437).
12. **Two under is the area's pool's:** N5's floor is over the area's, so the gate counted its
    groups at 15 in the area's pool, where every fight was won; since #851 the day judges that pool.
13. **Owed on:** the drove road at N6's 12,0 (436,158, #467); the cutters' track at O5's 0,24
    (456,150, #464), to be run on to the Stone; the stream at M5's 31,25 and 31,26, with no road
    across that edge (#474); the elder's flag, the Rift's (#465) (built since: the road, the
    track and the flag, and the stream, met at M5's 31,25 and 31,26 by #474).

Decided by delegate for #462, each the owner's to overturn:

1. **The brief is §4.7, not the issue's draft:** the issue's corridor at 17–18 and its Foreman half
   won at 16 gave way to §4.7's levels and to a Foreman half won at its map's floor (§8).
2. **The levels are banded 16–17, 16–17 and 17–18,** not §4.7's 16–17, 17 and 18: the curve's rise
   asks a group at a map's top above its floor, so a band of one level would want a group a level over
   it, and the old workings hold none at 18 nor the bottom one at 19. The Foreman is judged at 17.
3. **The Foreman is set off the line by the gate,** as #199 set the Warden of the Sunder: 1,500 hit
   points and 15d8+14, where the line's 1,001 and 18d8+20 won 71% at 17 and 93% at 19 and a harder
   blow alone took 19 under 90%. It is won 50% and 95%, and named in `OFF_LINE`.
4. **Two groups a level above the bottom, not eight:** four fire beetles and a rock worm in its hole
   on the workings, two beetles and a pair of worms in their bore on the old workings, 7.52 and 8.67
   fights to a rest at 16; a worm at each level's far end is its group at 17.
5. **The bottom holds the brief's groups and no more,** six knockers and a mender twice and the
   Foreman. Its day, 9.64 fights to a rest, and its groups pooled with a Foreman won half, 83.3%, are
   off the aim and inside the limit, as the Sunder's floor's were; the menders draw fights out, and a
   third group would be one the brief does not hold.
6. **The pay is 4,278 xp a member for the brief's 2,400:** the Foreman (1,902) and the corridor (858)
   pass the brief before the beasts above them, fights to a rest being the gate and a share a proposal
   (#457's 3). Its gold is 2,550, its share by the brief of the 13,900 (§8).
7. **The bottom is drawn smooth throughout** (`wallStyle: 'smooth'`, `bare`), the corridor being the
   hull's, and the dwarves' last squares show earth underfoot where the corridor has its floor. A wall
   style a square at a time is the systems lane's to give, and would show the pick marks stopping.
8. **The door marked CREW ONLY is a wall with a door drawn in it,** a seam in the smooth wall as the
   Sunder's is (`solid: 'wall', door: 'door'`): the brief's line on the square before it, *A wall
   blocks the way.* into it, no exit, no flag and nothing in `content/locks.ts`. #56's 60 opens it
   from the other side.
9. **The service ladders are two hatches,** secret doors at a walled niche whose prayer reads LADDER,
   each with a hint seen beside it, the candles leaning into the wall and the dust blown back in a fan,
   so no company needs a reader (#538's 4 and 5). A search finds each as any secret door, and the
   field that would gate it on the reading, #538's 5 left to this issue, is not asked for. One shaft
   of rungs runs from the workings to the bottom's ceiling; behind the first hatch lie the coins the
   miners push through for the dead.
10. **The hymn's doors are the workings' three air doors,** an old miner at each to work it who sings
    its verse as the company passes, *One door shut, and all hands counted.*, then two and three:
    once-events for #471 to read. No door below has a verse; the last is CREW ONLY's, the oldest
    miner's to sing (§6).
11. **The crust lies on two ledges:** by the workings' stair, §4.7's landmark, crumbs going on down
    the steps; and by the hole at the bottom, crusts in a row and none eaten, where #471 puts the
    crust-bearer's son (§6). Neither says who carries them.
12. **The Hand's overseers are seen, not fought,** as on N4 (#461's 5): their lamps go away down the
    bore by night, and the cages, their fresh straw and the cargo's footprints say the rest.
13. **The machines carry parts, three keepsakes** with no price and no hand-in: a Knocker's Plate,
    which about one knocker in seven drops; the Mender's Spool, which every mender drops; and the
    Foreman's Slate, its list with no box ticked, read from the pack. The knockers' room holds a plate.
14. **The finds:** the ladder's Forge Hammer +1 in the knockers' room; in the cages an Ironwood Bow +2
    and a Warden's Dirk +2, Sunderwood's, at the forge's blow a level before it, for the ranger and
    the light blades the Fells' finds miss.
15. **The ids are `deep_mines`, `deep_mines2` and `deep_mines3`,** as the brief and the Sunder's second
    level have them, named The Tiefzeche, The Old Workings and The Clean Corridor, their plates under
    the shaft at 440,104, 110 and 116. The shaft's site is built, and the area claims the knockers and
    the mine (§7).
16. **N4's shaft opens** (#461's 2 and 3): `MOUTH` is listed with the cage's line said going down, its
    square the cage's gate, a door, and `n4_cage` goes; the cage at the shaft's foot brings a company
    back up to 15,2, facing west.
17. **Two under is judged by the day (#851)** on the upper two levels, as on every box; the bottom's
    floor is over the area's, so its groups count two under in the area's pool.

Decided for #467, each the owner's to overturn, the first and the last by the orchestrator and the
rest by delegate:

1. **The roster call, binding for N6, M6, L6 and O6:** the curve asks a box's hardest group at its
   floor and one more at least, and the roster's only surface 18 is the slag elder, a Rift's thing.
   Where the roster cannot meet the check at the doc's band, a box takes its floor a level down, as
   N2 did (#460's 2), and a worm at 17 is its top; or the elder stands only where the Stone's strays
   plausibly roam, by O5 and O6. N6, M6 and L6 take 16–18, and O6 17–18 with the elder's strays as
   its 18. No monster of Cairnmoor's roster comes into the Kilns: its families, regeneration, curse
   and calls, the hounds, the ravens and the bog bodies are its novelty and stay its.
2. **The top stays 18:** the call said 16–17, but the curve holds the area's band to its built zone
   maps' bands, and with Kilnmouth built at 16–17 the Kilns would read 16–17 until O5 is built. At
   16–18 the top the curve asks is still 17, the floor and one more, so a worm meets it. Kilnmouth's
   band on the atlas goes to 16–18 with it.
3. **The brief is §4.12, not the issue's draft:** M6's secret is the drover's cache in the stopped
   kiln, not a dwarf's hoard in a farm's cellar hinted by a verse. The issue's drovers' camp at the
   fork, its first heather at N6's south edge and its dwarf caravan, whose guards do not fight, are
   kept; the caravan comes up the road by day, seen and not fought, as N4's overseers are (#461's 5).
4. **Two groups on N6 and three on M6, for five each:** on N6 four beetles on the verge and a lone
   worm at the far end give 7.52 fights to a rest, where the brief's worm pair gave 5.63, under the
   aim, and 5.84 with another beetle group. On M6 three beetles at either end of the kilns and the
   worm under the fields give 8.97. They pay 787 and 1,068 xp a member for the brief's 700 together,
   as #457's 3 has it.
5. **The milestone reads ANVILHALL 13, KILNHAVEN 4,** the brief's 8 and 3 counted again at 13
   squares to the unit (#457's 4): 167 squares along the roads to the front of Anvilhall's gate, a
   corner walked where the road turns on a diagonal, as it does on N4 and N5, and 53 to Kilnhaven's
   gate at 391,162, two squares past the branch's last road square. The walkthrough holds both.
6. **The branch crosses into M6 at row 18,** N6's 0,18 to M6's 31,18, where the atlas's road stepped
   on a diagonal between 423,174 and 424,175. The two edges meet square for square, and both roads are
   laid square to square.
7. **The branch ends at M6's west edge in dirt,** 392,162 (0,4), beside Kilnhaven's gate at 391,162
   on L6's east edge: the atlas's trail stopped in the river at 398,164, and the edge check asks for
   no road where the atlas has none beyond. #468 takes it on into the gate, and may make the square
   road once L6 is laid (done: #468's 10).
8. **The stream** comes in from M5 at 23 to 26,0, as the atlas's river asks, passes under the bridge
   at row 3 and goes out at the west edge's rows 5 and 6; from the bridge west the branch keeps to its
   north bank, where the atlas took it into the water.
9. **The halt is a shelter with its door stopped,** two squares inside, the worn verge before it the
   hint, and the coach bill is seen, not carried. M6's kilns are a row of fronts with every draw-hole
   open but the stopped one, which is a secret door; the cache lies two squares deep behind it.
10. **The find is the ladder's Seax +1** (#535), in M6's cache. The gold is 740, the two boxes' share
    by the brief of the 13,900 (§8): 110 in N6's cairn, 230 in the halt, 150 in M6's cairn and 250 in
    the cache. The drovers' stone gives speed and the farmers' shrine personality.
11. **Kilnmouth's road is the kilns' east end,** where the beetles overlook the branch: the gate names
    each zone's road (`ROADS`), and Kilnmouth's way in is M6's start at 31,18, on the branch.
12. **The zone walk moves 2,262 squares, unheld** (§1): M6's own settle to Kilnmouth, and Cairnmoor's
    row 7 holds 2,002 of the Kilns' squares until its boxes are laid or its rows seeded, which is
    Cairnmoor's to do (#437, #476).
13. **Two under is judged by the day (#851),** as the other boxes' is.
14. **Owed on:** the drove road at N7's 3,0 (427,190, #476), the coach's road over it without a stop
    (#539); the branch at L6's 31,4 (391,162, #468), Kilnhaven's gate; on M6's north the stream at
    M5's 23 to 26,31 (415 to 418,157), with no road (#474); on N6's east the grass and the
    heather against O6, with no road (#466); on M6's south the grass and the hill against
    Cairnmoor's M7, with no road (built since: N7 with its road, L6 with its gate, O6 and M5's
    stream, met by #474; M7's grass waits on #484).
15. **The save budget scales with the content:** `tools/tests/save.ts` held the outdoors' saved state
    under a fixed 20,000 characters, and N6's and M6's five groups took it to 20,106, as every later
    box would. It now holds the state to its explored bits as stored, which the world's size fixes,
    60 characters for each group the outdoors holds as played and 1,000 to spare: 24,923 today. It
    still fails if the cells are kept a number apiece or a group's state grows past 60 characters,
    and its probes show both.

Decided by delegate for #464, each the owner's to overturn:

1. **The brief is §4.9, not the issue's draft:** the secret is the cutter's piece under the
   anvil-rock's lip, hinted by the half-way cut, not a tally in a hut hinted by the clamps; no fire
   beetles. The issue's Guard's camp is kept, as the thane's iron on the approach (6).
2. **The Stone is drawn,** a pillar of dressed stone at the atlas place's square, 468,136 (12,10),
   where the Lodestone and the Grove Stone are words: the brief's stands cut square on three sides,
   its anvil of rock boulders beside it and bare rock round it. The site moves onto it, map-relative
   at 12.5,10.5, as Gluthutte's moved onto its smelter (#463's 2).
3. **Its line is said on the approach (12,12) and its plinth (12,11) is the shrine and the
   inscription on one square,** as N3's niche is (#458's 8): a hand laid on it gives intellect, and
   a reader reads KEEP WHOLE. NO CUTTING. The line and the tear's go quiet once the tear is closed
   (`until: q_anvil_closed`); what is said then is #465's and #470's.
4. **The tear is the atlas's way in, 468,142 (12,16), shut until the Rift is built,** as N4's shaft
   was until the Tiefzeche opened it (#461's 3): its square is a chasm, which refuses a step, and
   `o5_tear` says the torn ground from the track beside it. `TEAR` in `kilnsheart_o5.ts` writes the
   feature, into the Rift's start at 7,14 facing north (§4.10 gives none: the Tiefzeche's and
   Anvilhall's), saying the slag's words going in, for #465 to place, open the square and drop the
   event; its way back lands on 12,15, facing north (opened since: #465's 9).
5. **Four groups for eight:** five slaglings above the track's bend and five on the slope by the
   tear; the slag elder at its lip, the box's group at 18 (§7); three of the Anvil Guard on the
   approach. They give 8.42 fights to a rest at 17 and 1,742 xp a member, 1,292 on the buying, for
   the brief's 1,000 (#457's 3): slaglings in fours gave 10.4, and four guards broke off half the
   days.
6. **The Guard stands only once the Stone is taken** (`after: anvil_taken`, #459), and so never for a
   company that bought, since the thane puts his question once; its post is said "ahead of you as he
   said". Bought, the saw in the last cut gives way to the saws off the Stone, as he promised.
   Nothing else on the map reads the choice.
7. **The elder and the Guard never come back, and the elder has no `until`:** the structure check
   refuses an until on a group that never comes back, and once killed it is gone, tear or no tear.
   The slaglings come back until the tear is closed (`q_anvil_closed`, #540), as N3's do.
8. **The foreman has his words and nothing more:** Reinhart, his name the dwarves' tongue's (§10),
   stayed when the others went and minds the saws; his words change with the thane's answer. His
   shed is a hut of dressed stone with a door, east of the Stone beside the cutters' two.
9. **The finds:** the cutter's piece, the area's second Anvil Shard (`anvil_shard`), with 500 gold in
   the hollow; and in the foreman's shed a Cutter's Hammer +1 (`cutters_hammer`, 1,550 gold), the
   Forge Hammer with a plus under a name of its own, off the ladder: the forge's hammer has three
   hands (the knight's, the paladin's and the cleric's), and the Tiefzeche's bottom gives one (#462).
10. **Its gold is 1,060, its share by the brief of the 13,900** (§8): 250 in the cairn, 310 in the
    shed and 500 in the hollow; the Guard carries about 150 more on the taking.
11. **The crag runs on east to the rim** over the atlas's last two columns of hills from row 22 down,
    a dead end that would want a point of its own, and the corner square at 1,0 is the stream's, as
    the edge check asks where the atlas runs it on into O4 at 457,125.
12. **The zone walk moves 78 squares, unheld** (§1), none on a built map; O6 takes its own when it
    is laid (#466).
13. **Two under is the area's pool's:** O5's floor is over the area's, so the gate counted its
    groups at 15 in the area's pool, where 97.1% of fights were won (#463's 12); since #851 the day
    judges that pool.
14. **Owed on:** the tear's feature, the square opened and the way back, #465's; the Rift's flag,
    which the slaglings, the Stone's line and the tear's read, #465's too (both built, #465's 5 to 9);
    the chapter's step at the Stone, #470's, which may read `o5_stone`; the grass and the hills at
    O6's 0 to 12,0, with no road across that edge (#466) (the last two built since: #470, #466).

Decided for #468, each the owner's to overturn, the first by the orchestrator and the rest by
delegate:

1. **Band 16–18, by the orchestrator's call** (#467's 1 and 2): the roster has no surface monster
   at 18, so L6 takes its floor a level down, and its worm pair at 17 is the top the curve asks.
2. **The gate stands three squares in, at 28,4 (388,162):** the atlas's 391,162 is the east edge
   itself, so the road comes in from M6 on row 4, and the square before the gate, 29,4, is L6's. The
   site and the atlas's way in move onto the gate, as Anvilhall's moved onto N3's (#458's 2); the
   town's plate stays at 378,158 for #469 (moved since: #469's 3). The town's wall runs along the
   shore north of the gate.
3. **The gate is shut until the town is built,** as N3's was (#458's 3): its square is wall, and
   `l6_gate` says it is barred from inside. Its exit is written beside the map, `GATE` in
   `kilnmouth_l6.ts`, into the town's first square inside its own east gate at 14,7, facing west, the
   start this asks #469 to give Kilnhaven; the way back out lands on 29,4, facing east. #469 lists
   `GATE` in L6's exits, opens the square and drops the event (opened since: #469's 2).
4. **The brief is §4.13, not the issue's draft:** the secret is the bonded store behind the sealed
   row, not a customs chest under a beacon hinted by a carter. The issue's beacon stands on the hill as
   the lookout, and its salt crabs stay Saltreach's.
5. **The Hand's crew are three Ashen Gleaners on the pier by night** (`ashen_gleaner`), Act II's
   roster at 15, inside the band's two levels, each with a sack of glowing shards for the ship. They
   carry their own gold, about 130 a clear. With them the two beetle threes in the ore heaps and the
   worm pair give 7.79 fights to a rest at 16; without them 6.82, under the aim.
6. **Four groups for six:** 1,590 xp a member for the brief's 600, as #457's 3 has it.
7. **The milestone reads ANVILHALL 17,** the brief's 11 counted again at 13 squares to the unit: 221
   squares along the roads to Anvilhall's gate. N6's KILNHAVEN 4 holds, the gate now 56 squares on
   from the fork.
8. **The coach yard is a place only,** north of the road between the wall and the edge: where the
   drove road's coach puts a company down is the town's to write (#469, `content/crossings.ts`).
9. **A Crown to Order's end is the town's:** Tallis's man waits in Kilnhaven (§4.14, #471), and
   nothing of it stands on L6.
10. **The river runs on to the sea** at rows 5 and 6, under the road's bridge at 30,5 and 30,6. The
    branch's last square on M6, 0,4, is road now that L6 is laid (#467's 7).
11. **The find is the ladder's Kiln Robe +1** (#535), in the bonded store with 490 gold; with the
    cairn's 150 the box holds 640, its share by the brief of the 13,900 (§8). The tide stone gives
    intellect.
12. **The curve:** the row owes nothing since O5 (#464), and with L6 a clear gives 16,303 xp a member
    of the 13,067 the curve asks and 9,497 gold of the 7,920, before the Rift, O6 and its tubes and
    Kilnhaven (§8; the whole gives 27,228 and 14,707).
13. **The zone walk moves 105 squares** elsewhere, none on a built map: L6 was Kilnmouth's already,
    but for the 6 squares of the bay its wall and its quay stand on.
14. **Two under is judged by the day (#851),** as the other boxes' is.
15. **Owed on:** the gate's exit and its arrival (#469; built since); on the west edge, K6's cut
    heath (§11), with no road; on the south, Cairnmoor's L7, with no road. The north edge is the sea.

Decided by delegate for #439, each the owner's to overturn (docs/areas/thornmark.md §9, 51 and 52,
has the Druid's trainer):

1. **A guild quest may wait for its act** (`GuildQuest.after`, a flag, in `src/game/guilds.ts`): a
   hall offers it only once the company holds the flag, and the four fourth-rank asks wait on
   `q_salt_done`, Act II done, from which Captain Ordgar keeps the Drillyard (#455). DESIGN §8 has
   Act III open the fourth rank, and without the wait a Sergeant or a Reader made in Act I is
   offered Act III's asks two acts early. Two lines there and a fixture check in
   `tools/tests/guilds.ts`, taken as within #439's `lane: systems`. One oddity stands: `report()`
   pays an item quest whether taken or not and does not read `after`, so an item quest that waited
   for its act would be paid before it. No gated item quest exists.
2. **One ladder holds over the four Lantern halls:** the Luminary asks are offered and reported at
   Helmstow, Thornhold, Lantern Watch and Rime Lodge, and the goals name the Watch and the Lodge as
   where to report, which is how the rank opens at those two (#434, call 8). DESIGN §8: every hall
   of a guild offers the next quest on it. No per-hall rule exists and none is needed.
3. **The hole's fire is dropped as a first task, and Rime Lodge's hall gives the Lanterns' ladder
   as every hall does,** its first task the ladder's own, First Light. A stranger who joins at the
   Lodge would still go back down the road for ranks 1 and 2, so a local first task saves no road;
   it would need a second rule (rank 0 by any first task, first tasks per hall) and break "one
   first task"; and DESIGN §8 has the Lodge's hall give the quests "to a company that has done the
   first task". This settles #487's 12.
4. **The Lanterns' asks are two deeds on built ground:** `lanterns_niche`, the words over the dead
   read with a reader at either niche (`deep_mines:dm1_niche` or `deep_mines2:dm2_niche`: `seen`
   names one id, so the goal is either, and both carry the same word); `lanterns_ring`, the ring's
   voice (`q_ring_spoke`, set by O7's `o7_voice`, the chapter's own flag).
5. **The Wardens' asks are the act's own matter, proposed:** `wardens_cages`, the Hand's cages on
   the Tiefzeche's old workings (`deep_mines2:dm2_cages`), what the night carts carry;
   `wardens_hole`, a sword at the ice-hole on the fourth night (`longmere_m9:m9_night_4`, once, no
   respawn). The Wardens are road guards and soldiers, the captains who give the Drillyard's work
   are set against Vask's side, and the Hand's cargo is the act's thread from the Kilns to the
   hole. Both deeds stand on built maps on the chapter's road, and neither names a secret.
6. **Pay is 300 gold and 2,400 xp each,** 400 a member, the ladder's rise: Thornmark's rank 1 asks
   pay 150 and 900, its rank 2 asks 200 and 1,500, and Cairnmoor's answers 1,200 to 1,800 xp.
7. **Each ask is filed with its deed's area,** as Thornmark's are, so the curve counts it there:
   two here, one in Cairnmoor and one in Rimewater. Cairnmoor's and Rimewater's `owed` floors rise
   to what a clear gives now (14,041 xp and 8,655 gold; 6,732 and 3,220); the Kilns' row owes
   nothing, as before.
8. **The voices:** the Wardens' asks are Ordgar's, the cousin's captain, with a book in his boot
   ("the cousin will hear it before the walls do"); the Lanterns' show their split and never tell
   it, a Lantern who would not have the words copied and one who goes out at what the ring said.
   Each offer runs to three lines of the log, the most (EXPANSION §5.4), and the rest to one or two.
9. **The Watcher still sends the page down:** the hall's ask is the ring's voice, not
   `watchers_page`, which he takes at the first meeting and sends down by the drovers. A hall that
   took it would undo the walked answers of #482 (docs/areas/cairnmoor.md §6).
10. **The Kilns' numbers:** the two asks add 800 xp a member and 600 gold to a clear already above
    its ask, 17,103 xp of the 13,067 and 10,097 gold of the 7,920 when they were written, and 26,928
    and 13,607 with the Rift, O6 and its tubes and Kilnhaven built (§8). No box is left to build, and
    the clear is past the 1.4 times line the boxes, not the asks, were to hold to (§8, #466's 9).

Decided by delegate for #465, each the owner's to overturn:

1. **The brief is §4.10, not the issue's draft:** the secret is the hollow against the Stone's cut face
   with the first cutter's tools, hinted by the one lane whose slag set running up, not a pocket of
   unsold shards hinted by a slagling's path; the issue's elder's court is the elders at the lanes' heads.
2. **Four lanes run up from a passage under the ridges:** the middle one to a ridge under the cut face
   it cannot pass, the west and the east round to the heart with a pair of elders at each head and the
   fourth to a dead end at the hollow, so the Warden is reached past a pair of elders either way.
3. **The brief's groups, each a standard encounter** (MONSTERS §4.4): four slaglings twice, two slag
   elders twice and the Warden. They give 8.00 fights to a rest at 17, where fives and pairs gave
   6.59, and 3,698 xp a member for the brief's 1,800 (#457's 3).
4. **The Warden is set off the line by the gate,** as the Foreman was (#462's 3): 1,200 hit points and
   13d8+12, where the line's 1,001 and 18d8+20 won 32% at 17 and 69% at 19, past the limit two above.
   It is won 54% and 93%, and named in `OFF_LINE` and `BOSSES`.
5. **The flag is set by the Warden's fall** (#636's 29; at first by the step after it, when no
   group could set a flag): three events say the slag gone quiet after the Warden's death, the first
   said and the rest gone: in the cut, back out of it and on the first square in from the tear. The
   Warden is fought only from the square before the cut, so any step from there says it.
6. **The tear closed is the slag gone quiet:** the Rift's groups come back until the flag and the
   Warden never; the lines that hear the hum go once it falls and the slag material's quiet words are
   said in their place. On O5 `o5_closed`, which #464's 3 left here, says the torn ground has closed
   over once the Warden has fallen, and `o5_tear` goes with it, `until` the Warden's death and not
   the flag, which that line once set.
7. **The Rift wears the slag material:** its palette, its bare walls, its words going out and its name,
   the Slag Rift, as the generated Rifts are named, so the world map letters the Stone and its Rift
   apart; the id stays `anvil_stone`. Its plate moves onto the tear, 468,142, as K3's and the Delta's
   Rifts' plates stand on theirs.
8. **The tear says the brief's tear line going in,** as Anvilhall's gate says its brief's line (#459's
   10), not the material's, which said the red light twice beside the Rift's first words. Its arrival is
   #464's, 7,14 facing north, and the way back lands on O5's 12,15, facing north.
9. **`o5_tear` stays, though #464's 4 had this issue drop it:** it is a once-event a save may hold
   (`shipped.json` only adds), and the open tear still wants its line from the track. The tear's square
   is bare stone where it was the chasm; O5's other features stand, its lookouts' smoke and red light
   among them.
10. **The finds:** the Heart of the Anvil (`anvil_heart`, slot none, price 0), the Warden's drop on its
    def as the Heart of the Sunder is its Warden's; and the first cutter's tools, a Cutter's Pick +1
    and a Cutter's Chisel +1 (`cutters_pick`, `cutters_chisel`, 1,650 and 1,550 gold), the forge's
    mattock and seax with a plus under names of their own, off the ladder, as O5's hammer is.
11. **Its gold is 1,910, its share by the brief of the 13,900** (§8), all in the hollow with the tools.
12. **Two under is the area's pool's:** the Rift's floor is over the area's, so the gate counted its
    groups at 14 in the area's pool, where 95.4% of fights were won (#464's 13); since #851 the day
    judges that pool.
13. **Owed on:** the chapter's step at the Stone, #470's, which reads `q_anvil_closed` (built since:
    #470); and a group's own `sets`, said with its `slainText`, which would close the tear on the
    blow itself, the systems lane's to give if it is wanted (built since: #636).

Decided by delegate for #466, each the owner's to overturn (the first and the ninth follow the
orchestrator's calls):

1. **O6 takes 17–18 with the elder's strays as its 18, by the orchestrator's call** (#467's 1,
   binding for it), where the brief says 18: the roster's only surface 18 is the slag elder. The
   tubes' first level takes 16–17, so that a rock worm at 17 is its top, and the second 17–18 under
   the Great Salamander: the plan's 17–18 for Feuerstollen holds for the second only.
2. **The first level holds a rock worm in a bore no fire made** (`lt1_worm`), proposed against the
   roster's Where column as the other worms are (§7): the curve asks a map's hardest group at its
   floor and one more, and the roster has no fire thing at 17. The groove in the climb and the
   bore's polished walls are all that is said of it.
3. **Four groups on the box and seven in the tubes,** the brief's two of salamanders a level and its
   beetles kept, the worm and the elder added: salamanders and beetles in fours, five salamanders in
   the deep tubes' east. They give 8.75 fights to a rest on the box at 17, 7.31 on the first level
   at 16 and 7.56 on the second at 17, each inside the aim.
4. **The Great Salamander is off the boss line** (#472's 2): 950 hit points and 15d8+14 where the
   line gives 1,001 and 18d8+20, which is won 29% at 17 and 65% at 19; the gate asks about half and
   nearly always, and set so it is won 53% and 94% (`OFF_LINE`, `tools/tests/harness.ts`). Its pay
   stays the line's, 11,413 xp.
5. **The Great Salamander's hide is carried, not worn, and dropped once:** `salamander_hide`, a
   resistance to fire as the Tide's symbol is to cold (no slot, 500 gold), the boss's every time.
   The boss never comes back, so there is one.
6. **Both secrets are §4.11's, the issue's draft naming one:** on O6 the cold vent, hinted by ash on
   every other lip; in the deep tubes the tube cut and not run, behind the heat's gap where the
   walls go square (the draft's cooled tube behind the flow; a flow that set chokes the middle tube
   beside it). The plate at its end does not open: a wall with a door drawn in it, no flag and no
   lock (#434's 4, as the Tiefzeche's door), and before it lie picks worn to stubs and 600 gold.
7. **The reading marks four places:** the tubes, Rime Lodge (the atlas has the lodge and not the
   ice-hole beside it), the Sleepers' Bay and Meridian Camp (Fire Mountain's vents), the machine's
   mouths (#434's 2). No way waits on it.
8. **The elder comes back until the tear is closed** (`until: q_anvil_closed`, 2,880 minutes), as
   N5's does, and is no guardian; the burnt footprints down off the crag are all that is said of
   where it came from.
9. **Pay is 6,127 xp a member and 1,600 gold for the brief's 1,500 and none, by the orchestrator's
   call for the finishers:** no group is cut and no monster's pay lowered. The box is 1,645 xp, the
   first level 1,631 and the second 2,851, the Great Salamander alone 1,902. A clear gives 26,928 xp
   of the 13,067 (2.06 times) and 13,607 gold of the 7,920 (1.72 times), the Rift in and Kilnhaven
   too, which pays nothing of its own (#469's 12, §8): the area's total is the orchestrator's to
   weigh now its boxes are all in (27,228 xp and 14,707 gold, 2.08 and 1.86 times, with the side
   quests: §8).
10. **The gold is 1,600:** 450 in the shelter, 250 in the cairn, 300 in the cutters' strongbox and
    600 before the plate. The brief names none, and no monster carries any.
11. **The find is the ladder's Steel Bow +1** (#535, the ranger's), in the shelter, and the ladder's
    owed entry for it goes (`tools/tests/ladder.ts`); the hide is off the ladder.
12. **The seam with O7 is square for square but the corner,** the rim's mountain at O6's 31,31 where
    O7's 31,0 is hills, with no road or water across it, pinned in `tools/tests/outdoors.ts` beside
    O7's. O6 laid whole takes the 388 squares of High Moor's in its south, and the walk moves 613
    (§1). docs/areas/cairnmoor.md §1, §4.3, §9's 13 and §11 say O6 is laid, with its 388 where the
    plan counted 195.
13. **No crossing line is written.** The adit lands in the land it leaves, so none is said over it
    (#616), and over the south line into O7 the log says the moor's own words, harder to a company
    of 17.
14. **The ids:** `lava_tubes2` is new and `lava_tubes` stays (§10). The atlas's place for the tubes
    drops `planned` and its band, `lava_tubes2` stands at 470,200 below it, as the Tiefzeche's
    levels do, and the site Feuerstollen moves onto O6, map-relative at 22.5,20.5, as Gluthutte's
    moved onto its smelter (#463's 2).
15. **Einhart is words and a name only,** the dwarves' tongue's (§10): the brief has the hermit
    count the vents by their breath and no more, and no quest hangs on him.
16. **Two under is the area's pool's, judged by the day (#851):** O6's floor and the second level's
    are over the area's, so their groups counted in its pool, O6's at 15 and the second level's at
    14, where 94.6% of 54 groups' fights were won; the day now deals them to a company at 14, the
    area's floor less two. The first level's, at 14, were won every time (`lava_tubes: under`, a row
    of `OWED` until then).
17. **Owed on:** the elder's flag, `q_anvil_closed`, is the Rift's (#465), whose walk checks that
    the elder comes back no more. The two-under figures (16) are judged by the day (#851).

Decided by delegate for #469, each the owner's to overturn:

1. **The brief is §4.14, and the town is a walled port on its harbour:** in at the east gate to the
   inn yard, the street west to the quay along the basin, and the six doors on the yard, the street
   and the quay. The issue's trainer's yard and temple are §4.14's ore shed and chapel, as #473 drew.
2. **L6's gate opens as #468's 3 wrote it:** `GATE` is listed in L6's exits, its square a door in
   the wall as N3's is (#459's 9), and `l6_gate` goes; a company comes in at 14,7 facing west and
   goes out onto 29,4 facing east. The brief's gate line is `GATE`'s label, said going in (#459's 10).
3. **The plate moves behind the gate, to 385,162,** over the harbour three squares in, as Anvilhall's
   moved into its hill (#459's 9): at 378,158 it sat on the world's edge, where the company is drawn
   while in the town. The site at the gate is built, and Kilnhaven claims nothing new (§7).
4. **The coach sets a company down in the inn yard just inside the east gate (12,8),** not in L6's
   yard outside the wall as §4.13 and §4.14 have it: a crossing lands on its own town's map
   (`CrossingEnd.landing`, #539's 1). L6's yard stays a place only, where the carters wait (#468's 8).
5. **The two boats land at two steps on the quay:** the ferry at its own where the street comes down
   (4,7), facing up the street, and the Compact ship's boat at the Compact's (4,12). Each of the
   town's three ends has its own landing line, and the ship's and the coach's ends their sellers'
   warnings, held to the voice checks (#600).
6. **The ship's master only talks** (#539's 2): `sells` gives him nothing while Cinderport is not
   built, so his words name no fare and promise no passage, and stay true once #512 makes him sell.
   The coachman sells, Rime Lodge being built (#487), and names his fare as Dunstan names his.
7. **The ferry's master is one man at both ends,** Dunstan, as Kitto is (docs/areas/saltreach.md §9,
   #177's 6): on Saltmouth's quay at 9,12 he sells `sells('saltmouth', FERRY)`, the one edit to a
   Saltreach file, which keeps every id, door and feature. His warning there is the Saltmouth end's.
8. **No fare is halved** (#539's 6): Kilnhaven halves none, and the ferry's master is of no guild,
   so neither end does.
9. **The harbourmaster's office is a room with her in it,** as the great hall holds the thane (#459's
   2). Talking to her is asking: she reads the manifests at the first meeting, the brief's line in
   her book, and sets `manifests_read` for the chapter (#470), as Crane sets `anvil_verse_read`.
10. **The smith is never shut** and sells the forge's eight at `SMITH_PRICES` and nothing else; his
    words change once the Stone is taken, as Gerda's do (#459's 6). The ladder's `SMITH` owes nothing.
11. **The inn is 35 a head,** Anvilhall's, in the same band; the chandler's sells the provisions at
    list price, as the hold's stores do, and the chapel says the temple screen's own words, as the
    mine-surgeon's does.
12. **The town holds no group and pays nothing of its own:** §4.14 names no group, and its 300 is
    #471's hand-ins, the chapter paying nothing (#470), as Anvilhall's is (#459's 7). The clear
    stands at 26,928 xp a member and 13,607 gold with O6, the Rift and #439's asks, past the curve's
    13,067 and 7,920; nothing was cut, since nothing was added (27,228 and 14,707 with the side
    quests: §8).
13. **Tallis's man is here with his words and nothing more,** as the issue's People ask: Wiebe waits
    on the street for a parcel up from the smelter, as Eckhart and Kerensa stand at it (#463's 5),
    and the crown, the throne and the thane are never named. The choice put to a company, its
    hand-in and its flag are #471's, which adds them to his square, as #459's 13 left Anvilhall's.
14. **The dwarf on the quay has the brief's word and a flag,** `kh_dwarf_met`, for a chapter entry
    on the corridors (§5); the manifests are the step (9). The Wardens' word of Hale is #439's, whose
    asks carry it, and no Warden stands in the port.
15. **Two boards are lettered and no inscription is cut:** the sailings', SALTMOUTH and CINDERPORT,
    and the coach's, RIME LODGE, as #473's 8 letters the rooms, with no times or fares. Kilnhaven is
    the Crown's port, not a hold, and the brief gives it no Kiln-script.
16. **The names** (§10): Irmgard, the harbourmaster, and Dietmar, the smith, in the dwarves' tongue;
    Dunstan in the Crown's, the port's own; Jago in Saltmouth's, as the Compact's Kitto and Kerensa;
    Murdo in the hill folk's, whose moor the coach crosses; Wiebe in the Tidefolk's, Saltmouth's own.
    The Guard's Horn is named for the horn on its chimney breast and the Anchor Smithy for the
    anchor in for mending.
17. **Owed on:** the ship's landing and seller at Cinderport (#512); Tallis's man's hand-in and the
    crown's end (#471); the chapter's step (#470) (the last two built since; the ship still waits on
    #512).
18. **The coach runs,** Rime Lodge being built (#487): Murdo sells it to the lodge's coach house and
    its coachman back to the yard. The gate's `landings` now count the lodge's two ways out onto M9
    and hold the groups nearest them to the gentlest; the pike beside the lake door's landing, which
    #487 asked a look at, is won every time at 18 with the lynx, and nothing moves.

Decided by delegate for #470, each the owner's to overturn:

1. **Begun on M3 or at Kilnhaven, not on the Wall's end.** The Wall's last line sends the company
   home to Helmstow, whose change is #157's; a goal east the moment it ends would say otherwise.
2. **Done on the moor,** as the Ring is done at Loch Fada, with the Stone bought or taken, its tear
   closed and Kilnhaven's two heard. The verse and the door are steps, not locks (#434's 4); the
   thane must be answered, which costs nothing taken.
3. **The dwarf's word goes with the manifests** in Kilnhaven's step (#469's 14 made it an entry): the
   last goal points south because he says the corridors run south, and so waits on him.
4. **The thane's choice is two entries,** one written for each company; the Stone's entry names
   neither, since the tear may be closed before the thane is answered (#465's 2).
5. **The door's goal names the clean corridor,** the lowest level's own name, as the walkthrough asks
   a goal to name its place, and says nothing of the door.
6. **The ferry's company has no road up from Lanternwood written,** never having walked it; its
   journal is otherwise the same, the manifests read first and written in story order.
7. **It pays nothing:** the clear is far past its ask (§8). Cairnmoor's chapter keeps its start, the
   moor, where this one ends; only its comment changes.

Decided by delegate for #471, each the owner's to overturn:

1. **The four pay in kind and a token:** the clear is far past its ask (§8), so §6's 200 a member
   each is cut to 150 from two questions, 300 in all; the rest is gold and the copybook.
2. **The Crust-Bearer ends one way, the son up:** a sign is in the world from a new game, so the
   note he sends up is the scraps he has always sent, read at the well; no answer leaves him.
3. **The mother gives her ring by a question** (Take the ring or Not now): an answer is how a
   person hands over an item (#76), and a hand-in only takes. The son's hand-in is #43's token.
4. **The son comes up to Anvilhall's inn step,** where #459's 13 left the court free for the
   Crust-Bearer's hand-in, and is nowhere else once up; he pays the 300 gold, his unspent pay.
5. **The scholar is at the wall from a new game,** as #460 built him, and in Anvilhall only kept,
   so one man never stands in two places; the thane's own words are not touched (the chapter's).
6. **The copybook reads every inscription as a Linguist does while carried** (#538). #56's 16's
   rubbing is no inscription and is taken at Henlys, so it reads nothing there: Thornmark's lane
   (built since as Ilse's line at Anvilhall: #637).
7. **A Crown to Order's question is the smith's,** the crown done a week and no carter come, which
   is why Wiebe's parcel is late. Told, the thane's men take it off-stage, as the words after say.
8. **The flag the Council reads is `q_crown_sailed`** (`TALLIS_OWES`), set by Wiebe's hand-in:
   Tallis owes the company. Told, nothing is set for him but `q_crown_told`.
9. **The hymn reads the doors as seen,** kept by their ids, so a save that heard them before #471
   finishes it; the third, the last going down, brings the verse, `q_hymn_sung` (`HYMN_SUNG`).
10. **The last door is the captain's,** the bay under Coldmere's that calls Wenna Captain
    (docs/areas/rimewater.md §4.6), and nothing says so. The hymn pays its verse and no xp.
11. **The oldest miner is in Anvilhall only,** by the inn, not at N4's camp by day as N4's brief
    had him (#461's 6 left him here). The son, the miner and the scholar keep the brief's names.
12. **Nothing in `tools/tests/quests.ts` was owed to #471:** what it owed was #470's (`PLANNED`,
    `CHAPTER_OWED`), so no entry of #471's is dropped. The ids: `crust`, `primer`, `crown`, `hymn`.

Decided by delegate for #637, each the owner's to overturn:

1. **The dwarf is Ilse,** who cuts the old script over the mine-surgeon's door: old, a stonecutter and
   a keeper of strokes ("stroke for stroke as they were"). No new person; the Lantern reader reads words.
2. **The mark's words are what a cutter finds,** not what it means: every stroke is one she cuts; hers
   waver and these do not; whoever cut it was not copying. The Older Mark is older than Kiln-script, and
   she is a reader of cut marks and no more (#56's "reads it as Kiln-script", kept to its strokes).
3. **Her line is held `after: { item: 'stone_rubbing' }`** and said at every meeting while the rubbing
   is carried; it sets `q_mark_read`, which only the journal reads (added to `shipped.json`). A company
   without the rubbing hears her own words, and the copybook still reads no rubbing (#471's 6).
4. **The journal edit is two entries in Thornmark's `mark`:** the kept one names Anvilhall, in the Iron
   Fells (a company has not met Ilse), and a last one, on `q_mark_kept` and `q_mark_read`, gives her
   finding. The quest still ends at the answer, so a done quest shows no goal and none is added.
5. **Nothing else moves:** no map square, group, monster or pay, so no gate, density or curve figure
   (§8) changes; the walkthrough plays Ilse with the rubbing and without it.

Decided by delegate for #634, each the owner's to overturn:

1. **The Kilns pass the lead's line by name** (EXPANSION §5.2): they leave a company 1.2 over 18,
   at 19.18, held at 19.2 in `OVER_ROAD`, for the bosses pay the line's (§8).
2. **Nothing built is trimmed:** at 1.25 times their ask the Kilns would lose 42% of their kill xp
   for 0.6 of a level at their exit and 0.1 to 0.2 at Act III's end, and every box touched redone.
3. **The parked country behind (#474) adds about 0.2 to the figure when built,** so it comes in
   lighter or raises the Kilns' figure in `OVER_ROAD` by name (M4 and M5 raised it to 19.3, #474's 12, and O3 and O4 leave it there, #474's 26).

Decided by delegate for #474, each the owner's to overturn:

1. **Band 16–18, Kilnmouth's, as M6's, N6's and L6's,** not the brief's 17–18: the curve asks a
   17–18 map's hardest group to be at least 18, and the brief's beetles and worms top at 17.
2. **One group a box, a rock worm pair,** the fewest the curve (a group at 17), the gate and the
   density pass with: 449 xp a member, the brief's 450. No beetles; they would only add pay the
   Kilns do not need. The day is 6.59 fights to a rest, under the aim and inside the limit.
3. **M4's way in is M3's pines** (15,0, facing south) and **M5's the drovers' track off N5's smelter
   ground** (31,3, facing west).
4. **The drovers' track is dirt** from the shieling under M4's pines down to the old workings'
   ground on N4's edge, over the M4 and M5 seam in that ground (dirt both sides, the atlas's) and
   west along M5's row 4 to the farmyard. It crosses no built neighbour's seam; it meets N4's and
   N5's dirt where the atlas has dirt on both sides.
5. **M4's north row is M3's south row square for square:** M3's crag runs on into it one square
   deep (20–25,0), and the atlas's pine at 11,0 is mountain there.
6. **M4's west edge is crag** (rows 1 to 22) **and trees** (23 to 31) against L4's mountain, where
   the atlas had mountain, hills and grass: no climber crosses, so the road stays the only way
   between Sunderwood and the Kilns (M3's walkthrough says so; §11 says "no way through" of the
   slivers).
7. **M5's west edge is the range** (mountain, rows 0 to 23) **and the shingle** (24 to 31), the
   world's end against cut L5; the mountain reads void in the outdoors, as L4's edges do (#203).
8. **Four squares are retouched** so that both boxes meet N4's and N5's pinned edges square for
   square: M4's 31,17 (hills to grass), M5's 31,14 (farm to woods), 31,29 and 31,30 (hills to
   grass).
9. **The secrets are a store in the knoll behind a rock face** (hint: a hearth's soot running into
   a crack) **and a loft behind a barn's end wall** (hint: swallows in at a hole in the end, none
   inside): seen, not told.
10. **Finds stay modest and sell nothing:** 550 gold in all (cairns 100 and 100, store 150, loft
    200), two Sapphire Vials and two Elixirs. No gear, so nothing repeats the area's finds, and
    nothing nears the 3,500 window.
11. **No shrine:** the Kilns have eight, and a stat gift is more than these landmarks need.
12. **The Kilns' `OVER_ROAD` goes from 19.2 to 19.3,** the smallest tenth that holds, its why
    adding "and the country behind the road adds to it" (#634's 1 and 3, §8).
13. **Two under (14) is judged by the day (#851) for both boxes,** as M6's and every Kilns box's is.
14. **No seeds in `src/content/atlas.ts`:** laid, M4 and M5 seed Kilnmouth from every square and are
    wholly Kilnmouth's (1,024 each); it now holds 235 of cut L5's squares, where §11's cut list
    gives it 214. The walk from L4 takes nothing of Kilnmouth's that is laid or planned, so the
    seeds docs/areas/sunderwood.md §1 proposes (#203's 9) are settled by the boxes.
15. **Kilnmouth's seed at 404,140 goes,** inside laid M5, as K3's seeds went with L3, L4 and K4
    (#203).
16. **The stream's far bank** in M5's south-east corner (27 to 31 x 27 to 31), reached on foot only
    from N5 and M6, **has its own point** (`m5_bank`) rather than a ford cut across the atlas's
    stream.

Decided by delegate for #474, each the owner's to overturn:

17. **Both boxes are band 16–18, not the brief's 17–18:** the wild roster tops out at the rock worm
    (17), and the curve asks a map's hardest group to be at least its floor plus one (18 for a floor
    of 17); N6 and M6, the Kilns' other country boxes with this roster, are 16–18, and so are M4 and
    M5. The gate judges both at 16.
18. **O3's west edge is the hall's crag,** mountain, rows 0 to 20, against N3's crag and the
    terraces' end, so nothing walks at Anvilhall's gate from O3; the hills open on from N3's at rows
    21 to 29.
19. **The warren is a landmark and a worm pair, not a den:** a den adds keepers and a brood that
    respawns, more pay than the Kilns want. The pair is O3's one fight, 6.59 fights to a rest, under
    the aim of 7 and inside the limit of 5.5; a second group would only add pay.
20. **O4 holds three salamanders at the quarries and a worm pair under the pines:** the brief's
    salamanders, a lighter group, and a 17 group the curve's rise needs; together 8.37 fights to a
    rest. Four salamanders and one worm read 11.0 in the harness and a lone worm 26. The two boxes
    pay 1,214 a member against the brief's 900 (449 and 765), 1.35 times: the curve wants the 17
    group beside the salamanders and the pace check wants the worms in pairs.
21. **The stream is left whole, with no ford:** the hills over it are walked to from O5's north
    (columns 2 to 9), the quarries' side from N4 and O3.
22. **O4's south-east corner pocket is mountain** (31,29; 30 and 31,30; 29 to 31,31): six squares of
    hills cut off by the mountain and reached only from O5, which the density check found out of
    reach of every point.
23. **O4's east edge at row 7 is hills, not the ring's mountain,** so the stream's bank runs on into
    the atlas's mountain beyond (the pillars' edge check: water against mountain at 488,101).
24. **The pay-hole is at row 7, not 9:** at world 459,103 the secret door's face was dressed, 100% of
    O4's two wall faces against art's cap of 50%; at 459,101 it is not.
25. **Finds stay modest:** O3 holds 300 gold and O4 360, with potions and no gear, so nothing repeats
    the area's finds or comes near the 3,500 window.
26. **The Kilns' `OVER_ROAD` stays at 19.3 with the four boxes in:** O3 and O4 alone took it from
    19.2 to 19.3, as M4 and M5 did, and the curve test prints 19.3 for all four, held at 19.3 (#474's
    12).
27. **O3 was cut with the scaffold's own `cut` and `emit`, its void written as `%`:** the scaffold
    refuses a cut holding void (O3's 87 squares of the world's end), as D3 of the Downs carries void
    in its rows (§11).
28. **Two under (14) is judged by the day (#851) for both boxes,** as M6's and N6's are; they were
    rows of `OWED` in the gate test until then.

Decided by delegate for #636, each the owner's to overturn:

29. **The Warden of the Anvil sets `q_anvil_closed` as it falls** (`sets` on a group, MONSTERS
    §3.3): the tear is closed on the blow, so the Rift's groups and the strays stop coming back and
    the Hearth counts the Stone with no step taken. A company gone by Town Portal leaves it closed.
30. **The step events keep their words and set nothing:** the quiet in the cut, back out of it and on
    the first square in from the tear, and `o5_closed` on the track. The quiet's three now go once
    one of them is said (`seen`), where the flag held them, since the flag is set before any can be.
31. **No words change:** the slag gone black and cold and the seam closed over read as what the blow
    left, to a company that heard the red go out of the slag.
32. **The Kilns claims `encounter:sets`** in its `novel`, the first area on the road to set a flag
    by a group's fall.
33. **A save from before #636 with the Warden fallen and the flag unset keeps the tear open:** a
    company gone by Town Portal and not yet back in or up the track. Nothing sets the flag now. A
    save upgrade setting it where the Warden is dead would mend it, the systems lane's to give.

Decided by the builder for #831, each the owner's to overturn:

1. **The bounds' brief is §12,** after §11, in §4's form, for all five boxes; the boxes come in three
   pull requests, K6 with the brief, then P5 and P6, then L7 and P4, and after them the enclave and
   the lair (the delegate's order on #828). P4 comes last because its south pocket, 25 squares,
   joins P5 alone: O4's east edge there is the world's end.
2. **All five are at 16–18,** the zone's, though O5 and O6 beside the P boxes stand at 17–18: the
   roster tops at 18 with the slag elder alone, and the curve's rise rule wants a group a level over
   the floor in every box, which a box at 17–18 could only meet with slag elders (§4.15, #474's 17).
3. **L7 is Kilnmouth's, whole,** with the Cairnfield's 46 walkable squares in it played at 16–18, as
   the issue asks and docs/areas/cairnmoor.md §11 leaves it (the issue counts 45, before K6 was
   laid); it meets M7's west edge square for square, where the line into the Cairnfield falls
   (§12.5).
4. **K7's tail stays cut.** Fifty-six squares of the heath's end lie between K6's south edge and
   L7's west edge, and four squares of sand in J6 beyond K6's west shore. K6 closes its south edge
   with a bank of mountain across the heath's neck (25 squares) and its west shore with five, and L7
   closes two, and L6's corner square with them (21), so that no built box is open onto unbuilt
   land. With the bank's ten inner squares (13) and the winch-house, K6 gives 48 of the atlas's 484
   squares up: 436 stand, against the issue's 484.
5. **The lead moves, by name.** K6 carries what a company three quarters clearing the Kilns from 16
   leaves them at from 19.29 to 19.32, and `OVER_ROAD` in `tools/tests/curve.ts` holds the area at the
   figure as built, rounded up, as #474's did: it moves from 19.3 to 19.4 in this pull request. No K6
   that passes the gate and the rise rule leaves the lead under 19.3: a lone worm paces 26 fights to a
   rest and a mender alone 30, past the limit of 11.5, and the one lighter group inside it, a worm and
   a mender at 11.1, still carries the lead to 19.31, and is a machine, which no surface box holds
   (§7). The later boxes' groups (11) carry it to 19.38 with P5 and P6 and to 19.41 with L7, which
   raises the figure once more, by name, to 19.5; P4 pays nothing (§12.1).
6. **One pair of rock worms is K6's group,** as M4's, M5's and O3's: 6.59 fights to a rest at 16, off
   the aim (7 to 9) and inside the limit (5.5 to 11.5), every fight won, and 4.14 two under, 51.7% of
   the floor's 8, as theirs.
7. **K6's finds are gold and consumables,** as the country behind the road's: 120 gold and a Sapphire
   Vial on the cairn, 200 and an Elixir in the strongroom, the dearest of each kind that Kilnhaven's
   chandler, the nearest shop, sells. The ladder's six pluses are given (§4.1), and Ashfall's wares
   are not the Kilns' to give.
8. **K6's secret is the winch-house,** the dwarves' first quay's, on the headland: the rails rubbed
   bright to its wall are the hint, seen from the slipway without passing through the wall. The
   strongroom is a 1 by 2 cell in a block of rock, as M4's drovers' store is, shut to a walker, a
   swimmer, a climber and a levitator.
9. **The enclave's door is beside K6's slipway and the lair's in P5's rim face** (§12.7 and §12.8),
   the two ends of the area's land farthest from each other; #845 and #846 settle what they hold.
10. **The walkthrough walks the bounds in one function,** `theBounds`, called last, so each later box
    adds its steps there. The outdoors test pins K6's edges and reads L6's west edge as meeting it,
    and the walkthrough's line that the world ends past L6's west edge now says the heath runs on.
11. **No two boxes' hardest group is the same.** P5 holds a slag elder and a slagling and P6 a slag
    elder and a salamander, strays from the tear gone once it is closed, as N5's and O6's; L7 a lone
    rock worm; each beside a gentler group of fire beetles or salamanders, sized with the harness at
    16 inside the gate's aims at the floor and two under (§12.1). The worm and the mender is no
    choice: the mender is a machine, and no machine stands on the surface (§7, #158).
12. **Each box's secret has a shape of its own:** K6's cell of one by two, P5's walled adit three
    deep, P6's store round a bend, L7's chamber of two by two under the boundary cairn and P4's
    spring-head of one square, each with a hint seen from outside its door. P4's is in the north
    pocket, where the map starts from O4, since the hint check walks from the start.
13. **K6's bank stands thicker in places,** two squares deep at 9 to 11, 19 and 20 and 26 to 28 and
    three at 10 and 27, so that it is no ruler line across the heath; the ten squares are inside the
    box, and no pin or seam moves.
14. **P5 and P6 are cut by hand,** 24 squares wide, the atlas's rows with the void past the rim
    written `%`, as O3's, since `tools/scaffold.ts` cuts 32 by 32. `worldGrid` reads a map's `%` as
    grass, so their 472 void squares count as the heart's land on the world grid, as O3's 87 do;
    that is the systems lane's to settle, and nothing here changes it.
15. **P6's corner square at 0,29 is hills where the atlas has mountain,** so that O6's hills at its
    31,29 open on into it and P6's west edge meets O6's east edge square for square, as the seam
    rule (#910) asks of two built boxes; 0,4 and 0,28 are ash and 0,0 and 0,1 crag, O6's letters.
    The brief kept the hills at 29 closed against P6's mountain (§12.4 now says otherwise).
16. **O5's crag runs on across the seam** into P5's west column at rows 22 to 31, and a square
    further at 24 to 29, so P5's west edge meets O5's square for square; P5's 6,0 is mountain
    against P4's 6,31, so the south pocket's hills open at columns 0 to 5 alone, as the brief has
    them, and P4's seam will agree along P4/P5, though not at the corner: P4's 0,31 must be hills to
    meet P5's 0,0, which O5's hills at 31,0 force, and mountain to meet O4's 31,31. The owner's
    delegate rules that P4's pull request opens O4's 31,31 to hills, the atlas's, drops square 31
    from the O4/O5 row of `SEAMS_AS_BUILT` and, from the opening until P4 is built, holds 7-21 and
    31 in the `OPEN_ON_NOTHING` row for O4's east edge (§12.6); it is the pull request that builds
    P4, so the row goes with it (20).
17. **Each box's groups are the brief's,** measured: P5 8.15 fights to a rest at 16 and 4.80 two
    under (60%), P6 8.15 and 5.20 (65%), both inside the aim. The slag strays stand `until` the tear
    is closed and do not roam, as O6's elder; the camps stand clear of them (P5's dry pit 26 squares
    from the slag, P6's shelter 15 from the elder).
18. **The finds are the brief's,** and the two riddles give a stat and no gold, the waymark might
    and the milestone endurance; P5's niche gives accuracy. The lead is 19.384 with P5 and P6
    (19.318 before), inside the named 19.4, so `OVER_ROAD` is not touched; L7 moved it to 19.5
    (25).
19. **The lair's adit has room** in P5's rim foot past the deepest pit, left free of features, apart
    from the walled trial at the strip's middle (§12.8; the adit stands at 11,23, north of the pit,
    39); P6's store door stands at 13,2, where a lone secret door passes the art check.
20. **O4's corner 31,31 is hills, opened by P4's pull request as the owner's delegate ruled** (16).
    P4's 0,31 meets P5's 0,0, hills, and O4's 31,31, which was mountain, so O4's square is the one
    changed and no row is added: square 31 leaves the O4/O5 row of `SEAMS_AS_BUILT`, which holds
    10-12 and 27-30, and the `kilnsheart_o4 east` row of `OPEN_ON_NOTHING` goes, P4 answering all 32
    of its squares. Nothing stood on the square. It is cut off inside O4, hills between two walls of
    mountain, so the density check failed O4 for "a square nothing reaches" until the square took
    one event, `o4_corner`: O4 now has 17 points, 798 of its 805 squares within 12 and the furthest
    17 of 20. That event is the one feature this pull request adds to a built box.
21. **L7's west edge is closed in mountain, as the brief has it, and L6's corner square 0,31 with
    it,** as the owner's delegate rules: L6's heath there would hold L7's 0,0 open onto K7's tail,
    which stays cut (4). The square is the heath's dead-end corner, 0,30 and 1,31 joined through
    1,30, with nothing on it; it now meets K6's bank, so the K6|L6 row of `SEAMS_AS_BUILT` goes and
    no `OPEN_ON_NOTHING` row is added. A company saved on it loads on the mountain and steps off, as
    on B6's 0,31 (#920).
22. **P4's west edge meets O4's east edge square for square,** so five squares depart from the
    atlas: 0,7 to 0,9 are hills (the atlas has mountain; O4's hills at 7 to 9 run on), 0,29 and 0,30
    mountain (the atlas has hills; O4's are mountain) and 0,5 mountain (the atlas has its stream's
    shallows; O4's is mountain; the stream goes on at 0,6). The north pocket has 24 squares of
    hills, not 21, and the south pocket 23, not 25: 47, not 46.
23. **P4's spring-head is a cell of one square in a 3 by 3 block of rock** in the mountain, its door
    at 3,12 and the cell at 4,12, where the event and the chest stand: a climber crosses mountain
    and would reach a cell set in it, and the cells of K6, P5 and P6 are set in rock, which none
    crosses. The door passes the art check at 3,12, and L7's at 26,4.
24. **L7's groups are the brief's, as sized:** four fire beetles at the ore spill, 22,3, aware 3,
    back after a day, and a lone rock worm in the dunes, 10,2, aware 3, staying put, back after
    two: 7.52 fights to a rest at 16 and 4.97 two under, 62.1% of the floor's 8, every fight won.
    The worm stands 20 steps from the way in and the beetles 9. The driftwood fire is 5 squares
    from the worm and 7 from the beetles, so a company can rest at it.
25. **The lead moves a second time, by name.** L7 pays 787 xp a member and takes the lead over the
    road from 19.3842 to 19.4056, past the named 19.4 (the figure the brief's groups projected), so
    `OVER_ROAD.kilns` in `tools/tests/curve.ts` is re-recorded to 19.5, rounded up as K6's was, its
    reason as it stood. It is the one figure raised: no gate limit, band or aim moves. P4 pays no
    xp. This is the bounds' last re-record: a box that would carry the lead past 19.5 builds lighter
    (§12.1).
26. **The secrets and the finds are the brief's, in the shapes it gives.** L7's chamber is two by
    two at 27 to 28 x 4 to 5 in the mound, a block of rock at 26 to 30 x 3 to 6 on the seam, its
    door at 26,4 and its hint the kerbstone out of the ring at 25,4, the grass worn from its foot;
    it holds the coin laid when the line was drawn, not a grave, as M7's cist does. L7's finds are
    100 gold and a Sapphire Vial on the lookout's cairn at 1,1 and 200 gold and an Elixir in the
    chamber; P4's are 100 gold and a Sapphire Vial on the cairn at 4,28 and 150 gold and an Elixir
    in the basin: the dearest that the nearest shops sell (§12.1).
27. **L7 keeps the atlas's ground:** the brief's dunes are the sand and grass behind the tide line,
    no new terrain. The sea-coaler and the lighter aground are new to the area (K6's wreck is an ore
    barge's ribs and M7's a boat sunk in the sand), the sea-coaler unnamed as the kelp-burner and
    the old cutter are. The atlas's squares change only for the mound, 0,0 and 0,1 (21).
28. **The seams meet the rule and add no row.** `L6/L7`, `L7|M7` (between the Kilns and Cairnmoor,
    which the atlas joins), `O4|P4` and `P4/P5` agree square for square, and `K6|L6` now does (21).
    Four `OPEN_ON_NOTHING` rows go, L6's south, M7's west, O4's east and P5's north, 64 open
    squares, and none comes; square 31 leaves the O4/O5 row (20) and the K6|L6 row goes (21).
29. **The enclave is the Seestollen,** *see* and *stollen*, the sea adit (§10): the dwarves' first
    quay's galleries under K6's point, cut to load the barges out of the weather and given up to the
    sea when the cutting broke into the grey rock. One level of 16 by 16, entered by the grate in
    the slipway (§12.7).
30. **It is held at 19–20,** a band over Kilnmouth's 16–18, its floor over K6's top (#845's 2); its
    window is Cairnmoor's 4,000, the last road area whose floor is at or under 19 (#845's 3).
31. **Its groups are the knockers' kin,** the one family of the area's to reach 19–20: the Kilns'
    menders and knockers and Rimewater's tallyman, drawn on the knockers' frame, which calls them.
    The roster stops at 18 but for the Steiger, the lair's guardian, and the rise rule asks the
    hardest at a mean of 20; Rimewater's bay keeper, 21, is of the keepers, Rimewater's claim, and
    the enclave's floor stands it at Cairnmoor's place on the road, so the novelty check would find
    the keepers on the road before Rimewater, which claims them (`roadPlace`).
32. **Four menders at the pumps, a tallyman with a mender and two knockers in the tally-room and two
    tallymen with three knockers at the drowned quay,** at 17, 18.5 and 20, the knockers each
    tallyman's own: 8.40 fights to a rest at 19, inside the aim, and 4.67 two under, 53.4% of the
    floor's 8.75. With two menders it paced 10.64, over the aim, and 69.6% two under.
33. **Its machines are placed by its band,** past the Mines, as the Dead-Drop's are (MONSTERS §2.2,
    #158): none stands on the surface, and the secret's pace check places the Seestollen with
    Cairnmoor.
34. **The reward is Durchschlag,** *the breakthrough*, the miners' word for the blow that meets
    another gallery: the forge's mattock with its blows carrying cold, at 1,700, in the
    quay-master's strongbox with 400 gold. It is the plain piece where the ladder wears the plus
    from 19, the cold the gain, as Cairnmoor's Beacon Hammer carries fire; off the ladder, sold
    nowhere and no worse than the mattock Kilnhaven's smith sells.
35. **The secret is the dwarves' store,** two by two behind the one dry stretch of the loading
    gallery's weeping wall, the hint seen from the gallery: 300 gold, an Elixir and a Sapphire Vial,
    the dearest of their kinds at Kilnhaven's chandler. Its door at 12,4 passes the art check.
36. **The door is the brief's square, K6's 20,16,** its sand drawn as the slipway's dressed stone,
    walked onto from the slipway or the grass at 20,17, where the way back sets a company down
    facing the heath. It is the one square of K6 that changes; within four squares stand only the
    slipway and the rails, whose words still read true, and K6 has 17 points with it.
37. **§12.7 is the enclave's brief in §4's form, with its As built,** and the lair's note is §12.8.
38. **The lair is the Randzeche,** *rand* and *zeche*, the mine in the rim (§10): #846's old
    working, two levels of 16 by 16, the Randzeche and below it the Dark Seam, joined by a winze's
    ladder as the Tiefzeche's levels are by theirs, both marked `enclave` at 30–32 (§12.8).
39. **The adit is P5's 11,23,** between the hearth-niche and the deepest pit, the rim's mountain
    there drawn as dressed stone and given the one exit: the one square of the rim's foot in the
    strip's south half with nothing within four squares that is no edge square. Past the deepest
    pit, where 19 left room, the rim's foot at 8,29 stands within four of every face square, and the
    south edge's mountain meets P6's. It is the one square of P5 that changes; P5 has 16 points with
    it.
40. **The guardian's group is the Steiger alone,** as #846 gives it, calling its deep knockers as
    the fight goes, three at half a turn: it stands in the drift, the one way to the face, so no
    company steps round it to the kist (the walkthrough's flood). It is a boss (`boss`), with no
    `respawn` and a `slainText`.
41. **The Steiger's numbers are set at the gate's company** (MONSTERS §4.1, §4.2 and §13): 2,400 hit
    points, attack 24 and 18d8+20 a blow, where it was drawn at the line's boss at 32, 2,100, 20 and
    34d8+41, which the gate's company won 34% at 30 and 45% at 32. As set, it is won 56% at 30,
    inside the aim, and 81% at 32, between the aim (90%) and the limit (75%), as the fixture's
    guardian is (57% and 80%); no check moves. Its row gives why it stands off the line (`offLine`),
    as the road's bosses set by their gates do (`OFF_LINE`).
42. **The secret is the stope walled up** when the working was given up, three by two behind the
    north drift's west wall, its door at 9,4; the hint is the knocking behind that wall, which stops
    when the company knocks back, the knockers' old sign of ore behind the rock. It holds 500 gold,
    an Elixir and a Sapphire Vial, the dearest healing and spell draught that Kilnhaven's chandler
    and Anvilhall's Hold Stores sell. It is on the first level, which holds no group, as the lair's
    one guardian stands before the kist on the second: a company of any level that hears the
    knocking may take it without a fight.
43. **The Erzhemd lies alone in the smith's kist at the face,** past the Steiger: the smith of the
    rumour, Brandt, sits against the face where he went down for more, and the door across the adit
    has his name chalked under the hymn's count. The walkthrough asserts that no shop, chest, cairn
    or statue holds it elsewhere and no monster drops it.
44. **The rumour is the oldest miner's,** two lines more after his "Nobody goes down that far" at
    every meeting once he has sung the last verse: a company that has heard the doors with him hears
    of Brandt, whom they sang to the door. Words only: no flag, quest or mark (#846). It is the one
    change to Anvilhall.
45. **The lair's two owed rows go:** `steiger` from `owes.unplaced` in the area's `checks.ts`, which
    leaves the Kilns owing nothing, and `erzhemd` from `UNPLACED` in `tools/tests/items.ts`, as
    EXPANSION §8.2 (#897's 12) and #847's 6 say the lairs' pull requests do; each check holds now,
    so an owed line left in would fail.
46. **§12.8 is the lair's brief in §4's form, with its As built.** It is the bounds' last piece:
    every box, the enclave and the lair are built, and no built map of the Kilns is open onto
    unbuilt land but O3's north edge onto O2, the crumb #828 leaves.
