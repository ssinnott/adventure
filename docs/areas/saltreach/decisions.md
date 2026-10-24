# Saltreach's decisions

Saltreach's decisions (EXPANSION §8.2): the old §9 of its doc, `docs/areas/saltreach.md`, moved here
whole by #1027, every list in its order. It is appended to and never rewritten: a builder adds a
list at its end, and a later decision that changes an earlier one says which. Its current state is
`docs/areas/saltreach.md` and its plan `docs/areas/saltreach/plan.md`.

## 9. Decisions

Decided by the owner on 28 September 2026, when the act's stories were drafted (#151), and
followed here:

1. **Act II spends no story lock** (call 1): nothing in Saltreach opens on the quest's progress.
2. **The Sunder is hand-built and the small Rifts are generated** (call 2): the Delta road's and
   the plinth's Rifts are #165's templates.
3. **Tidal ground turns with the hour,** twice a day (call 3): the Saltings' shore and the temples'
   doors.
4. **The Hand's crews have left the Compact** (call 4): the bargemen and the smugglers are the
   Hand's, and killing them costs nothing at the hall.
5. **Saltmouth is on C6** (call 7), its gate at about 102,178, and the atlas's plate moves from
   118,172 to match.
6. **Lantern Watch sells the next spell tier** (call 9); Saltmouth sells none.
7. **The willows are built after the act is played** (call 10): #179 was parked, and the owner took
   it off parked on 3 October.
8. **The cuts stand** (call 12): §11.
9. **All four side quests stand** (call 13): §6.
10. **The names** (§10).

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.11: each box's landmarks, points of interest, encounters, secret
  and hint, finds and share of the pay.
- **The core** is C3, B5, B6 and C6, the boxes that hold a step; the rest is country (§4).
- **Rietum is drawn on its box,** as Gullwick is on F3: houses, quay and people as features, a
  camp to rest at, no businesses (#172).
- **The temples are two levels of 16×16,** the upper temple and the choir, with the back door from
  the far roof (#175).
- **Saltmouth's eight businesses** (§4.9), the locksmith's among them, since #19 gives the trainer
  a shop where the job is a trade.
- **The pay's shares** (§8).
- **The bands on the atlas's rows** (#169): the Upper Water 10–11, the Delta 10–12, the Saltings
  11–12, Saltmouth 10–12, the Drowned Temples 11–12. They are set already in
  `src/content/areas/saltreach/atlas.ts`, where only the scaffold reads them, for a box's draft; the
  owner's word changes them there.

Decided by delegate for #169, each the owner's to overturn:

1. **The atlas folder is spread into the plan** (`src/content/atlas.ts` imports it where its rows
   were), as Sunderwood's is: the area cannot be listed in AREAS until #170 gives it a map. #170
   points the area's `atlas` at it and takes the import out.
2. **The folder charts the plan's rows and the bands, and no new sites:** Stienwierde and the pans
   are their boxes' to place (#173, #178), and the Long Water is lettered as a river.
3. **The Delta is 10–12,** not the 11–12 this doc first gave it: C5 and C4, the way in, are 10–11,
   and the scaffold drafts a box at its zone's band.
4. **Sylmeer, Kestrel Edge and the Scarp stay the plan's:** each is a name on a border Saltreach
   shares, with the Foreland, Wrackholm or the Glasswold.

Decided by delegate for #170, each the owner's to overturn:

1. **D5 is laid with C5, both in the Delta,** band 10–11: the shore under the Edge becomes
   Saltreach's, and the crossing line falls at D4's foot, where its last event already says the
   Delta.
2. **The hint is the mast's stump at the arch,** always there, and the stones' green glow is a
   night-only line beside it: a secret's hint may not come and go (`tools/tests/pillars.ts`).
3. **The groups are three:** the pools' leeches and eel, two groups of four, and the bull toad alone
   at the far end, MONSTERS §6.1's "the Delta, alone", which the curve needs as the box's hardest.
4. **The bull toad stands 1.35, not 1.4:** a group with a monster of 1.4 to 1.5 puts its label on
   its markers, and five hundredths do not show in the drawing.
5. **The Rift is #165's ring in brine,** three brinelings in its rooms and a tide elder with one
   more at its heart, about 430 xp a member: trimmed from two groups and a warden of three, which
   paid about 760, so that a small Rift costs the area about 450 a member and B5's two can follow
   it. The tide elder is placed here first, off #190's list of monsters owed a map, as the Tide
   Stone's Rifts' own (MONSTERS §2.1). Its hoard holds no shard, so the barge's is the first the
   company can hold; the brine tear's words, which show a shard beside it, are the material's
   (`src/content/rifts/materials.ts`), for the owner.
6. **The Rift goes quiet when its warden falls,** as Thornmark's tear does; the Stone home is a flag
   nothing sets until #191, which adds it.
7. **The shard is the Brine Shard,** the fen's own word for it.
8. **The hermit sits on D5's islet,** reached over a shingle bar, and points up the spur to Rietum.

Decided by delegate for #171, each the owner's to overturn:

1. **C4 is laid in the Delta, and named The Delta.** Its band, 10–11, sits in the Delta's, and its
   barges are the Delta road's. The Delta's first map stays D5, which has no groups, and the Upper
   Water begins at Rietum (#172).
2. **Two barges.** The fight's, tied at the bank, is always there: the curve needs its group, and
   it is the road's first crew that breaks, so it may not be missing by day. Dusk lives in its words.
   Passage Paid's, on the shoal, is a person, there until either answer.
3. **Passage Paid takes no fight to help.** The choice is the whole quest. Cut loose, the people go
   ashore and three bargemen with no master come up the bank `after` it; pushed off, the master owes
   the boat's fare, `q_passage_owed`, which Kitto's boat (#413) reads as its `free`. He does not say the half he sold are
   in the ledger's column: the company sees it.
4. **The hide is a reed hut with its secret wall on the sand,** at the one gap in the herons. Its
   shard is a second Brine Shard, not a new item: the area's shards are one kind.
5. **The groups are the barge at the bank and a bull toad alone in the fields' drain; no eel.** The
   curve wants the hardest group at 11 or over by its mean level, and the barge's is 10.1; a lone
   level-11 would pass by level and be no fight. The toad is C5's precedent and MONSTERS' "the Delta,
   alone". With the eel the box ran 8.4 fights to a rest, off the aim; without it, 6.7. C4 is recorded
   as built at about 690 against its share of 600 (§8).
6. **C4's hermit is an eel-trapper at the ford,** not a second net-mender: D5's woman saw the light
   in the sacking, and he heard the barge and knows its poleman for the Hand's by his stroke.
7. **The Delta's road runs on up the spur:** the two pools and C5's bull toad, which sees a company
   at the fork, then C4's barge. It is walked 100% of the time at 10.
8. **The boat reads Hessel's word here:** #413 sold the boat without it, so this pull request adds
   `free: { flag: 'q_passage_owed' }` to Kitto's passage out of Saltmouth. The way back is paid.

Decided by delegate for #183's Passage Paid, each the owner's to overturn:

1. **Passage Paid stays #171's.** There is no chit: the favour is the fare, read off
   `q_passage_owed`, and Kitto already says so, so a letter he took would be the same favour twice.
   There is no hold event: the hold is seen in Hessel's first meeting and never said. The answers keep
   their words.
2. **Its people after:** Geeske (the issue's Elowen, a fen passenger and Frisian) on Saltmouth's quay
   at 9,10 with a text for each answer; Hessel (the issue's Jago) at 12,10 once pushed off; a boy of
   Rietum mending nets by the lofts at 6,11 once cut loose, his wrists marked by rope, as the hold had
   rope; and an event on the shoal for each. Saltmouth's steps are left to #192.
3. **The second barge at dusk is cut:** the game has no dusk, and the crew that comes up the bank
   after the people is it. A third fight on a country box would push C4 further over its share (§8).

Decided by delegate for #173, each the owner's to overturn:

1. **The band is 11–12,** not the brief's 11: the floor stays 11, and the top meets B6's so the
   box's bull toads and tide elders sit in it.
2. **The hint is the landing's pole-marks,** always there, and one plank among them unscored and
   new-nailed; the priest at Rietum's line about a pole's mark is #172's to add.
3. **The shard is a Brine Shard,** as C5's: a chip of the Stone would be an item with no use until
   #191, and would say the plinth takes it.
4. **Every fight is a real one at 11,** and B5 is built at about 1,600 over its share of 1,000
   (§8): two groups of five fen toads, two bull toads and two tide elders at each Rift's heart,
   each inside the gate's aim or, for the Rifts, a quarter of a fight under it (5.4 to its 5.75) and
   inside its limit. A lone bull toad or tide elder was eighteen to twenty fights to a rest at 11,
   no fight at all, and a tide elder with three brinelings reached the band's top only by averaging.
   No other box's share is cut: a fight at 11 costs about 300 a member in any box, so a cut would
   balance only on paper, and C6 is being built against its 700.
5. **No leeches:** the pools are C5's fight, and the toads are B5's new family.
6. **The Rifts are #165's cells and breach,** each its warden alone and closed `until` it falls; the
   Stone home is #191's. The north Rift was the spiral while it held a room group, which the cells
   put behind the warden.
7. **No camp:** the brief has none, and C5's is the next box.

Decided by delegate for #174, each the owner's to overturn:

1. **The temples' dry door sits beside the flats** (the owner's open question): tidal ground along
   its foot, so at high water the door reads as standing in the sea, while the door, the priestess
   and the causeway to them stay dry and are reached the same way at either tide. It is the brief's
   landmark in the only form the tide check allows, and keeps §5's "the temples open at either
   tide".
2. **No drowned men fight on B6;** it is built from the monsters that exist. A Drowned Chanter here
   would spend #175's caster among the dead early, and a level-11 Drowned Man is a drawing and a
   sprite, outside the area lane. #175 needs one for its nave and its choir's front row, so it is
   owed before #175, for the owner to agree and file; filed and drawn as #451. The causeways'
   drowned are events.
3. **Three groups, each a real fight at 11,** the hardest two bull toads at 12 with no averaging:
   five fen toads on the causeway in, five brinelings in the channel by night until both of B5's
   Rifts are quiet, and the bull toads on the flats past the far roof. The brief's seven groups
   would pay about 2,100 against an 800 share.
4. **B6 is built at about 970 over its 800,** and §8 says so: with C6 and C7 the area comes to
   about 9,850, some 19% over the curve. No other share is cut.
5. **The far roof's door opens on a sunken porch and a stair down,** an event owed to #175 as the
   way into the second level's back; no cache, since the brief has no finds on the box. Tidal
   ground lies either side of the ledge before the door and round the roof's foot, never beside the
   porch.
6. **The hint is the priestess's count, written as an event beside her** and always there: one to
   ten with her hand to each roof, then a pause towards the far roof, where no door shows, and
   eleven, the number the chant ends on.
7. **The band stays 11–12, and the camp and the cairn both stand:** the camp is the company's rest
   before the temples, C5's being two boxes back and B5 having none.

Decided by delegate for #176, each the owner's to overturn:

1. **The box is laid in the Saltings,** band 11–12, all of it, though the atlas gives two thirds of
   its land to the Delta: the brief calls it the Saltings' step, the chapter puts that step at
   Saltmouth and call 3 gives the tide to the Saltings' shore. The crossing line falls at the C5/C6
   seam, where the fen gives way to salt.
2. **The stair's foot is a secret door on dry sand at the sea wall's north end,** beside the gate,
   and the cache is at the flight's foot, by a sea door onto the shore path barred from within, so
   the cache is had only through the secret. This inverts the brief: the stair is dry at either
   tide, and the shore path under it is dry at low water only, since the tide may cut nothing off.
   The stair's top is the tavern's cellar, owed to #177 and #182.
3. **The groups stay three at about 1,030 xp a member,** recorded in §8 as built over C6's 700:
   fights to a rest is the gate, a share a proposal, and trimming to 700 would push the box out of
   aim or lose a group. A company at one hour meets the quay's day group or its night one, not both.
4. **C6's milestone reads SALTMOUTH 2, RIETUM 7, and D5's is corrected to SALTMOUTH 4, RIETUM 9,**
   both counted along the trails at about 13 squares to the unit; D5's RIETUM 5 was short, and the
   Cartographers' first task surveys the Salt Road's milestones (#181), so the stones must agree.
   THE PASS 40 is dropped: the pass lies behind the Edge, off this road's reckoning.
5. **Until #177 the gate is shut wall,** and the event before it says only what is seen: no flag, no
   time and no entry in `locks.ts`. #177 makes 26,19 the way in and rewrites the event. The site
   moves to the gate, 98,177; the plan's way in (`src/content/atlas.ts`, saltings to saltmouth) is
   still at 102,178, a tidal square, and is #177's to move with the town's door. #177 opened the
   gate and moved the way in to 98,177.
6. **The Scale Mail +1 is in a crate of the crews' cargo on the quay,** not the warehouse, which is
   the Compact's: call 4 frees only the crews' goods. The clerk's lines point at the crews.
7. **The eel under the quay is said, not fought:** a lone fen eel is a trivial fight that only pushes
   fights to a rest up, and C5 has eels in both its pools.

Decided by delegate for #172, each the owner's to overturn:

1. **The quay stands on a cut, a diep, with no river in the box:** deep water from a sluice-house
   on the west edge at 0,12 to the quay under the mound. The sluice-house is a building square, so
   the edge check holds with no change to the atlas, and deep water carries the barges and keeps a
   swimmer off the cache. The diep's way on through B3 to the Long Water was owed to #179, which carries it. With no
   river the brief's eel and ford go, and the shrine stands by the sluice.
2. **The Downs' strip above the cliff is closed as mountain with the Edge,** as C7 closed the
   Glasswold's squares (#178's 3). §1 says the only way over the Edge is the Salt Road in D4, and a
   band 4–5 strip left open from a band 10–11 box would be a back way and an empty walk.
3. **Sjonghol is a short cleft of dirt cut into the cliff's foot,** four squares from its mouth at
   28,10 to its back at 30,8, a dead end with the Monk's second-prestige trainer at its mouth. It
   needs no interior, so the Interiors lane stays out. It opens into neither D3 nor the strip above,
   and the site moves to the mouth, still inside C3 as #71 wanted.
4. **The old barge smuggler lives at a hut on a silted drain in the north fields under the hills,**
   in Rietum's box as the brief has it, and well over ten squares from the spur's road, which ends
   at 8,18. So he is off the beaten path and not a step of the quest. DESIGN's "the willows' quay" no
   longer reads true, but DESIGN is outside the area lane, so its rewording is the owner's to make.
5. **The cache is his old one from his Compact days, and he says nothing of it:** found, never told.
   Once the company carries his sword, a line of his `says` lets them keep it, and nothing else
   changes.
6. **Four groups, each always there or keyed to its hour:** four herons in the stubble beside the
   track nearest the way in, the barge master and three bargemen on the quay by day, four brinelings
   at the child's window by night and one bull toad in a flooded drain at the east fields' end, the
   hardest at 12 alone with no averaging. A company at one hour meets three; both hours are counted,
   as on C6. The toad sits twelve squares from Sjonghol's mouth and further from the smuggler's hut,
   so neither trainer's door is a fight's doorstep and both stay relatively safe (DESIGN §5; moved
   from under the Edge, five squares from Douwe, on review).
7. **One bull toad, not two:** the gate measures C3 at its floor of 10. Alone it is 9.0 fights to a
   rest there, inside the limit, and the box's mix is 7.2, inside the aim. Two toads were 2.1 at 10,
   under the limit of 4, and broke a fight off on 27% of days, though 5.8 at 11. One toad still meets
   the curve's rule, a mean level of 12 against the 11 asked, and follows C4 and C5, the other
   floor-10 boxes (#170's 3, #171's 5); B5 refused a lone toad because its floor is 11.
8. **The brinelings take no `until` now, and the child speaks her hint with no quest flags:** no flag
   marks the Stone home until #191 adds it, as #170's 6 and #173's 6 leave it. The Night-Light's
   choice and the brinelings' `until` are owed to whatever builds 21 once the owner approves it.
9. **The hint is one stone in the quay's face scrubbed clean where the rest are weeded,** always there
   on the square before the secret door. Beside it goes a night-only line: the child's night-light
   throws green on the water under that stone (C5's precedent, #170's 2). Her words say only that her
   light shows where the water glows. The brief's way in from the water at low tide is turned round,
   as C6's stair was: deep water and walls close the cache on every other side, so its secret door
   is the only way in.
10. **All four finds are in the cache, as #399's 3 gives Rietum's cache the ladder's two:** the Chain
    Mail +1, the Stiletto +1, the Tidefolk Robe +1 and the smuggler's sword. The sword is a Short
    Sword +2 under a name of its own (1d8+2, 340 gold), the step past the Downs' +1: a +3 or a +4
    would pass Wrackholm's Cutlass +2, found later, and with the Stiletto +1 in the same cache any
    plus is a keepsake.
11. **The step is a Tidefolk quay-hand whose words point west to the plinth, and they set a flag,
    `c3_saw_stone`, for #180's chapter to key on,** as Ysolde's set `meridian_read` (#181's 6). D5's
    net-mender saw the light in the sacking and C4's eel-trapper heard the barge, so this one adds
    what is new. The priest's line, owed by #173's 2, is about how every poleman scores the landing
    he pushes off from, without naming Stienwierde's.

Decided by delegate for #399, each the owner's to overturn:

1. **Every class has a new weapon line at each town,** sold, then found with a plus, as Thornmark's
   was: a point of blow a rung, a two-hander a point over a one-hander. Saltmouth sells the Morning
   Star, the Stiletto, the Horn Bow, the Long Axe and the Ironshod Staff.
2. **Armour steps on alternate rungs:** the medium wearers take the Sharkskin Coat (9) at 11 and the
   Watch's Lamellar (10) at 14; plate's wearers take Kelp Hole's Plate Mail +1 (10) at 13 and the
   Sunder's Plate Mail +2 (11) at 16. So Saltmouth sells nothing past plate's 9, and the Sunder's
   plate is a step past the Watch's stores, as Sunderwood's doc has it.
3. **The plus finds go to boxes that already promise finds:** Rietum's cache (two), the temples
   (two) and the pans' hoard; B6 has none, and B5 and C6 were built before the ladder, so the staff
   went to the temples and the robe to Rietum. Each is owed to its box until placed.
4. **The windows stay as they are:** no ware or find comes within 400 gold of its area's price.
5. **Two under is judged by the day from 10 (#851), not by the fights won:** gear dresses a company
   at a floor past one two under it, but a group a company at the floor fights six or seven of to a
   rest is one a company two under still beats. From 10 the to-a-rest aim and the two-under aim
   pulled against each other, and the day settled it.

Decided by delegate for #18, each the owner's to overturn:

1. **B5's Rifts keep their two tide elders,** at 4.9 fights to a rest at 11 after the re-stat to
   #409's line, under their aim of 5.75 and inside their limit. A warden must average 12 to hold the
   band's top, and only the elder pair does that among the brine family; a room of brinelings ahead
   of it would mend the figure, but it would cost the north Rift its cells and each Rift some 200 xp
   a member more.

Decided by delegate for #177, each the owner's to overturn:

1. **The coach stays owed,** to a coaches issue for the owner to file: a coach that runs one way is
   not honest, its return seller would stand in Helmstow, the Foreland's map, and the docs disagree
   on where it goes (SLICE says Helmstow, docs/areas/sunderwood.md east from Saltmouth). C6's yard
   keeps its "No horses", which is true as it stands.
2. **The locksmith is his own business, and a shop since #860:** Pender stood in
   `saltmouth_locksmith` and taught the Thief's first prestige, as the Split Oak's keeper is his
   tavern, for a shop must sell something and his trade, lock picks, waited on #18, while the
   armourer kept the Stiletto. The picks exist now: his door is a shop, Pender's Locks, selling a
   set of picks, and he stands after it on its square with no room of his own and teaches the
   Thief's first through his person, as Ysolde stands at the Map Room (#860's 1).
3. **The Keel and the map room are drawn with doors, each keeper in their room,** and #177 takes
   their UNPLACED entries: a door with no business fails `doorwayFaults`, and a shut front leaves the
   port short of its tavern. #181 and #182 turn each into its hall (a business with `hall`, which a
   person cannot carry) and add the first tasks and ranks; the keepers' words stay plain until then.
4. **The cellar way through is #182's,** with the tavern: the bar is lifted from the cellar side,
   and who lifts it is the Compact's to say. Until then C6's stair top stays a door barred from the
   far side, which is true.
5. **The boat is sold on the town's own harbour quay** (the second pull request): C6's quay is the
   river's and the barges'. #177 also gives E6's captain the passage back, as wrackholm.md and
   `CUT_OFF` both owe it to #177, landing the company on Saltmouth's quay: 150 each way, sailing at
   20 and landing at 6 the next day. The half fare for a member of the Compact waits on #182, since
   a passage has only `free`.
6. **The astrologer is Hiske,** a Tidefolk name, since Idony is a Lantern in Thornhold; **the
   captain is Kitto,** as #183 drafts him and Kelp Hole's Colan names him, the same man at both
   ends. The trainers' names carry their trades (Pender the locksmith), so the seeking quests' own
   words read true and no `seek` is written.
7. **The inn is 25 a head,** a step past the Green Man's 20 as Thornhold's was past Harrow's 12.
   The chandlery sells the provisions at list price, since a place's own price wants a reason
   Saltmouth does not have; the armourer sells #399's seven and nothing else: no shield steps on
   until the Watch's at 14, and the provisions are the chandlery's.
8. **Tallis stands in the street at his house front on the quay,** a person with no room, his door
   drawn as wall: #185 drew no room for him, and a door needs a business. An event on his square
   shows the lineage on the wall through the open door.
9. **The way in moves to the gate, 98,177,** and the plate from 100,176, the coach yard outside the
   wall, onto the walled ground at 99,180.
10. **Two pull requests, the second stacked on the first:** the town (the map, the eight
    businesses, the four trainers, Tallis and the people, the gate and the atlas), then the boat,
    which reaches into Wrackholm's E6 and `CUT_OFF` and is reviewed on its own.

Decided by delegate for #178, each the owner's to overturn:

1. **The groups are two, both always there:** four salt crabs in the pans and two bull toads in the
   marsh, about 700 a member, the share. Of the brief's three crab groups the second is C6's at the
   pans' edge, and its smugglers are C6's night crew: the atlas gives C7 no sea, and the shore is
   C6's. A lone bull toad is no fight, so the marsh holds two.
2. **The band is 11–12,** the Saltings' and C6's, not the brief's 12: a band of 12 alone wants a
   hardest group at 13, and the bull toads are the band's top as on B5.
3. **The Scarp is mountain, and the Glasswold's squares inside the box are closed with it:** 301 of
   its 1,024 squares are band 26–28, and left open they would be an empty walk from a band 12 box.
   A map is its whole box, so Act IV opens them by editing this one.
4. **The stair's foot is a notch at 8,22,** at the end of a track from the link's 80,206, its lowest
   flight fallen with the face: rock in plain sight with its reason on it, no flag and nothing in
   `locks.ts`. The link stays the plan's: Act IV's C8 (#528) kept it and built the way
   past the fall as a rope ladder (docs/areas/glasswold.md §4.6, §9, #528's 2 and 4).
5. **The Star That Moved's watch is built as a night event that sets nothing,** and the salter's
   rumour names no one: the quest and its choice are #183's, with Hiske, Saltmouth's astrologer
   (#177), and it rewrites `c7_star` as the watch. The quest's pay is §6's, not C7's.
6. **The buckler is the Crab-Shell Buckler +2,** armour 3 and 340 gold, for the martial classes and
   the cleric: a +3 would match Act I's Tower Shield +1 and pass B5's Kite Shield +1, found a box
   earlier.
7. **The shrine gives endurance,** the drowned god's as C5's and C6's are, its bowl full of salt
   where theirs are dry. No camp: C6's under the wall is the next box north.

Decided by delegate for #183's The Star That Moved, each the owner's to overturn:

1. **Hiske asks for the star at her first meeting and still teaches.** She is the issue's Idony,
   since Idony is a Lantern in Thornhold (#177's 6).
2. **Tallis gains `sm_tallis_word` on his first meeting,** so his throne words are always heard
   before the star's. His after-lines are words, not a hand-in's, since #192 gives him a second
   hand-in and of several only the last one's after-lines show.
3. **The pilots' stone is an event where the pans' lanes cross, and `c7_star` becomes the watch from
   it,** a once-event by night that the log keys on as seen, so it needs no flag and is never spent
   by day. The stone says nothing of trodden salt, which is the sealed pan's hint.
4. **The slate is in a plain chest at the stone's foot,** there at any hour, so Hiske has early
   words and the quest begins with the slate carried. She pays 200 gold and Tallis 400; the slate in
   his hands is the record #56's 64 may remember.

Decided by delegate for #181, each the owner's to overturn:

1. **The hall is a shop, the Map Room,** on the map room's door with the Guild's `hall`: only a
   business may carry one, and a shop must sell something real, so it sells rations, antidotes,
   lamp oil and healing potions at list price, what a surveyor takes out. No chart or kit was
   sold at #181, for it would have done nothing until #18's Cartographer existed; a Guild Chart is
   sold beside the stores since #860, for it does the Cartographer's work carried. Ysolde stands
   after it on its square, a person with no room of her own.
2. **The book under glass is the Company's route book,** left with the Guild the morning they went,
   since the room draws a book under glass and the journals went down with them: the first journal
   the company carries is the first read here.
3. **The first task is First Chain,** the road chained from D5's milestone to C6's, two once-events
   beside the stones that wait on the taking, the second on the first. Every company walks past both
   stones on its way in, so without the wait the task would always be paid as done early; with it,
   it is a trip back up the road, as First Watch is. It has no words for a company that came early.
4. **The first rank's two quests are on events already built:** the fen's west edge past
   Stienwierde (B5) and the eel-catcher's hut over the west arm's ford (C6), two trips in two zones,
   both in band 11–12 and off the chapter's road. No map is changed for them.
5. **The pay is small,** 140 xp a member in all, since the area is about 19% over its curve and
   Saltmouth's 300 is shared with the Compact's hall, the chapter and the side quests.
6. **Ysolde reads the journal and gives it back:** her words, after the journal is carried, set
   `meridian_read`. Fane's line about lying dry under the arch where the causeway crosses the
   channel, in off the stones beside it, points at C5's secret without claiming the barge or the
   mast, which are the Tide Stone barge's of this midsummer (#393, STORY) and thirty years too
   young for the Company: the mast's stump stays the hint it was (#170's 2), and the Company's is
   only the dry place under the arch (changed on review). The Lost Expedition's log entry for the
   reading would go in `thornmark/quests.ts`, another area's file, so it is owed to the owner's
   word and not written here; SLICE says the journal is read (#181).
7. **The Length of the Wall is not here:** it is #205's, given by the Guild's surveyor at Lantern
   Watch. The Guild's three skills were #18's, and the hall said nothing of teaching them: they are
   taught at its menu since #813 and #857, for 1,000 gold each once the first task is done, and
   Ysolde's words still say nothing of them.

Decided by delegate for #182, each the owner's to overturn:

1. **The Keel is the hall by a small systems change** (#417): a person with a room may carry `hall`,
   so the tavern keeps the talk of the room and adds the Compact's work. DESIGN §8 wants a hall that
   does not look like one, and a shop would need stock invented for it; the Map Room, which sells
   what a surveyor takes out, is a shop (#181's 1).
2. **The half fare is `Passage.half`** (#417), the fare halved and rounded down once it holds, with
   `free` above it. Both of Kitto's passages carry it, Saltmouth's and the way back from E6, which
   reaches into Wrackholm's lane as #177 did; it turns on the first task's done flag, which marks
   membership exactly, and Kitto alone says so.
3. **The first task is the clerk's cask past the customs house door:** the cask is given only once
   the run is taken and the door's event shows only while it is carried, so the run cannot be done
   early and has no early words. The cask is priced at nothing, so no shop buys it away.
4. **The first rank's two are the crews' crate on C6's quay and the lookout on E6's west cliff:**
   both deal with the Hand's crews and who watches the port, not the founder; the crews and the
   bargemen respawn, so no `slain` deed, and C5's drowned barge is its box's secret.
5. **Ruan is named and stands in the Keel; the hermit's letter is #192's,** which builds 26 end to
   end, the hermit's giving of it and Ruan's hand-in: a hand-in here alone would name an item no one
   can find, and F6 is #410's to edit now. The founder's seal is not taken at Runner, which would
   tell the reveal early; it is left to the rank that reveals (#22, Phase 4).
6. **The cellar way is a second secret, down only:** a rank shuts no way on the map (DESIGN §8) and
   any `needFlag` is a story lock Act II does not spend, so the way is open to anyone who finds it.
   It comes out on the sand by the rope, not on the flight, so C6's stair and cache still need C6's
   own secret, and no one leaving by it is stranded (changed on review).
7. **The Compact pays 160 xp a member and 280 gold** across its three quests, the first task 20 a
   member, so that with the Cartographers' 140 the two halls come to Saltmouth's 300 (§8), the area
   being some 19% over its curve (changed on review).

Decided by delegate for #451, each the owner's to overturn:

1. **It is the Drowned Man again, `temple_drowned`, with a sprite kind of its own:** MONSTERS §6.1
   brings the Drowned Man back in the temples, and the name is the return. It shares a name with the
   Foreland's `drowned`, which does no harm: they stand at 3 and 11 and never meet, and nothing keys
   on a name.
2. **A brute at 11 on #409's line:** 219 hit points, armour 15, +8, 3d8+3, speed 8, 867 xp, and no
   condition. The line's brute carries none, and the choir's chanters already put the front row to
   sleep; a disease would add a cost #175's gate has not measured. The Foreland's keeps its own.
3. **Size 1.15, tint #788672:** heavier than the chanters behind it and level with the Choirmaster,
   under the ogre and clear of every label limit; a pale grey-olive, apart from the Foreland's teal
   and the chanters' blue-grey, in the same dead green.
4. **Gold 0 to 15 and no drop,** as the chanter: the temple's dead pay alike, and its treasure is
   the god's silver in the sacristy, not to be spent early.
5. **The drawing is a ballast stone hugged to the belly,** roped to its own neck, the knot hung with
   one scallop of the god's bronze; the head bowed chin to chest, no hood; planted wide and squared;
   salt and barnacles where the Foreland's has weed. The stone is what tells it apart, from the
   Foreland's slack hang and from the chanters' robes, at a glance.
6. **It stands unplaced, owed to #175,** which puts it in the nave and two in the choir's front row.

Decided by delegate for #175, each the owner's to overturn:

1. **Two levels, the upper temple flooded and the choir dry:** `drowned_temples`, the narthex, the
   nave and its four chapels, the north-west sunk in deep water and the south-west flooded shallow,
   with nothing anyone needs standing in water; and `drowned_temples2`, the choir. Each level's way
   in is the square a company lands on, as Kelp Hole's are, and B6's dry door lands it at the
   narthex.
2. **The sacristy is cut off from the chancel by deep water,** the priests' pool, which nobody
   crosses, so the god's silver is had only down the far roof's wet stair, and a company that comes
   in that way leaves the same way. From the sacristy it sees the Choirmaster's back across the
   water. Neither level has a secret door of its own: B6's is the secret.
3. **The Choirmaster stands alone,** level 12, past MONSTERS §4.4's boss line in its hit points and
   its blows: 825 hit points (680 until #806), armour 20, +11, 11d8+15, speed 13, and paid as 6 says.
   It casts Bless whenever its group is not blessed, so alone it blesses itself; with two chanters
   behind it, the group's mean level was 11.3 and the curve asks the hardest group of a band 11–12
   map to stand at 12. It is won 48% of the time at 11 and 98% at 13.
4. **The choir is MONSTERS' cut to the share,** two chanters behind two drowned men, the front
   row still asleep while the chanters count, with a drowned man alone at the stair's foot, both
   back after two days until the Choirmaster falls, when the choir stops for good. The west bay's
   two chanters were dropped with the pay (6). The lone drowned man is no real fight alone; he
   keeps the level's day at 7.5 fights to a rest. MONSTERS' full four chanters would pay about 190
   more a member, a clear about 1,770.
5. **The upper level's far group is two bull toads,** come in with the fen through the sunk
   chapels, and its nave holds two drowned men: every temple dead is 11, and the curve asks the
   levels to rise from the way in to a group at 12. Three drowned men with the toads measured 5.6
   fights to a rest; two measure 7.2.
6. **The Choirmaster is paid as a fight, not as the boss line** (the owner agreed to bring the
   temples towards their share). Its xp is 1,565 against the line's 7,573, so it pays about 300 a
   member at 11, what any fight there costs (§8). At the line's figure the boss alone paid about
   1,450, nearly the whole share. Levelling it down to 11 would leave level 2 with no group at 12,
   which the curve asks of a map banded 11–12, so it keeps its level and its stats, and the gate
   still judges it at 48% at 11 and 98% at 13; only its pay changes. With the choir cut and the
   west bay's chanters dropped (4), a clear pays about 1,580 a member at 11 and 1,220 at 12. It was
   about 3,115 at 11 before.
7. **The Tide Bell drops from the Choirmaster,** and the priestess at the dry door asks for it at
   her first meeting and takes it at the first meeting from a company she never asked, paying 300
   gold; she rings it inside the door, ten strokes and the eleventh late, and it hangs on the
   narthex's frame after. **The blessing is a shrine on the frame** (#554, decided by delegate and
   the owner's to overturn), `dt1_bell` on its square in the narthex, there once the bell hangs (`after` `q_tide_bell_done`)
   and not before: kneeling gives a point of Endurance to each of the company, once. Endurance is the
   Tidefolk's own, and the area's shrines already give Personality twice. The priestess gives it as
   she gives the bell, by hanging it, and stays at her door. The quest is still done at the hand-in,
   the blessing found after. **It keeps the cold off too, until the next rest** (#555, decided by
   delegate and the owner's to overturn): cold, the sea god's own, comes with the point and does not
   replace it, since the point is the Tidefolk's and a resistance kept to a rest is too small to be
   the whole gift. It is #56's once-only resistance read as one that is spent: kept for good, the
   whole company would halve cold at 12, the Holy Symbol from the same temples would be worth nothing
   and Rimewater would be blunted two acts early, and a resistance for good is the Lamplighter's, at
   the cap. The shrine's text says the cold goes in and stays.
8. **The finds:** the ladder's Morning Star +1 and Ironshod Staff +1 in the vestry behind the boss,
   since the ladder's step should not hang on a secret found from another map; the god's silver,
   a Silver Mace +1 on the morning star's base and the Holy Symbol of the Tide, in the sacristy.
   The Symbol resists cold (#555): it has no slot, so whoever carries it in their pack takes half
   from cold, and their sheet says so.
9. **The god is named on its silver alone,** *Tijsjonger*, the tide singer, read on the Symbol's
   rim and spoken by nobody (§10).
10. **B6's two events move or change:** `b6_stair` moves onto the secret door's square, since an
    event on an exit is never shown, and says the door stands open below; it and the stair's head,
    the stair's foot, the chancel, the pool and the sacristy each have a quiet twin once the count
    has stopped.

Decided by delegate for #180, each the owner's to overturn:

1. **The chapter begins when the Foreland and the Grove are both done, or on a word that names the
   Stone:** Wytske's at Rietum or Kitto's at Saltmouth, for a company there early. Arriving, the
   plinth and the priestess begin nothing, as a thing found begins neither the Grove nor the Wall;
   their entries are written once it begins. A condition holds one `seen`, so the two chapters'
   ends are joined twice, each with a flag standing for the other's event (Senara's `q_treaty`, the
   keeper's `q_keeper`). A company that met the keeper and never opened his log is told of the
   Delta once the Grove is done. Starting on the hand-ins alone overtook the Foreland's Crowness
   goal and broke Thornmark's early run.
2. **Its end is `q_tide_home`,** the Tide Stone's own restored flag (`src/content/stones.ts`),
   owed to #191 in UNSET, so the goal stays open until Wrackholm's chapter sets the Stone back. The
   chapter writes no entry for the Stone home: those are Wrackholm's chapter's words.
3. **The news of Hale is a Warden by Saltmouth's gate, and an entry, not a step:** he sits there
   once `q_hale_taken` holds (#156) and goes once Hale is freed (`q_hale_freed`), so the news is
   never told before it is true or after it is stale. Keyed to `q_hale_taken` alone it would be
   written at the Edge's foot, where #156 sets it, with nobody saying it. No goal waits on him.
4. **Kitto names the ship,** as he already sells the boat: a line on the midsummer barge that never
   tied up and went out to a ship off Wrackholm, in each of his three greetings, each setting
   `sm_ship_word`, so a company with Hessel's word or the Keel's half fare hears it too. STORY puts
   the boat in a harbour tavern, but the Keel's words are kept clear of the Compact.
5. **Saltmouth first, the plinth comes before the boat,** a goal and not a lock, as the Wall sends
   a company down the Sunder before its Watch: the boat sails for the fare whenever.
6. **The walkthrough's third level is played, not given:** no map of Saltreach is floored at 12,
   so the curve gives 10 and 11 in order, and the Saltmouth-first run is played at 12 by hand, as
   Sunderwood's Watch-first run is at 16.

Decided by delegate for #183, each the owner's to overturn:

1. **Main's people keep their names; the issue's become them.** Brannoc is the priest at the
   sluice, Nessa is Nynke at her window, Jago is Hessel, Morwen is the priestess at the dry door and
   Idony is Hiske. The two priests stay unnamed, called by their place as the god is by its office
   (§10). Elowen is Geeske, a fen passenger, Frisian as the Tidefolk are; Tobin, a river bargeman
   from upriver, keeps his English name.
2. **The night-light is green glass, as main has it, and an item of its own,** `night_light`, priced
   at nothing. In kind it is a Brine Shard (#171's 4), but a hand-in cannot tell one Brine Shard from
   another, and C4's or C5's would be taken in its place. No word says the plinth takes it (#173's
   3).
3. **The priest asks and Nynke puts the choice once he has.** His first meeting sets
   `q_nightlight` and keeps the pole-mark line. Her first meeting stays the hint, and her quest words
   keep the stone of the quay that shines back. The light goes to the priest for 100 gold or to
   Tobin for 250, each at the first meeting. Nobody needs early words, since only her choice hands it
   over.
4. **Tobin stands on the diep's north bank at 9,11,** always there until he buys it, then gone, and
   the berth has an event. His barge is the river crews', not the Compact's (call 4), and he names no
   master.
5. **The brinelings and the water's glow go once the light leaves her window,** `until`
   `q_nightlight_taken` or the Stone home, not only once it is sold or given (#172's 8 paid). Kept,
   they come until the Stone is home. The hint stays the scrubbed stone, always there.
6. **The Stone home puts the light out:** Nynke says so, and a quest asked and never answered is done
   with it, the log saying only what is true on every path.
7. **The Tide Bell gains one line,** for the Stone home once the bell hangs, and her hand-in's
   after-line, the Stone away, asks for it. Words would outrank that after-line, so it stays one. Her
   first meeting and the count with the Stone home are #191's sweep.
8. **Three pull requests, in order:** 21 with the bell's lines; 22; 24.

Decided by delegate for #179, each the owner's to overturn:

1. **B3 is laid in the Upper Water and B4 in the Delta,** each named for its zone: row 3 is the
   Upper Water's (C3) and row 4 the Delta's (C4), as #171's 1 has it, so the crossing line falls at
   the B3/B4 seam as at C3/C4's. B4's marsh meets B5's and its broad water C4's, both the Delta's.
2. **B3 carries C3's diep west along row 12 to the Long Water,** deep water one square wide under
   pollards, so C3's sluice line reads true, and a plank bridge at 25,12 crosses it, a road square
   over deep water.
3. **The willows' quay is at the diep's mouth on B3,** where the barges lie up for Rietum's sluice,
   with a boathouse behind. Auke stays at C3 (#172's 4): the quay gives DESIGN §5's line a place,
   and its wording stays the owner's.
4. **The quay's crew is a fight and always there:** a master, three bargemen and two herons in
   their back rank, as C4's barge has, back after two days. A master and three or four bargemen ran
   7.6 to 8.0 fights to a rest, off the aim, since a crew that breaks when its master falls is short
   whatever its number; the herons bring it to 7.1 (changed on measuring).
5. **The heronry is on B4, in the willows' last stand at the water's head,** a den (#88) that
   breeds grey herons: herons nest where they fish, and the broad water and C4's backwater are
   their fishing.
6. **Its keepers are five herons on the nests and its brood three on the grass by the water.** The
   roster has no old heron and none may be drawn here (the creatures' lane), so the keepers are the
   same bird in greater number, the camp's harder fight. Four ran B4 at 7.6 fights to a rest; five
   bring it to 7.1 (changed on measuring).
7. **Each box's hardest group is a bull toad alone,** in B3's carr past the ford and at B4's fen
   end, each the farthest from its way in: neither the keepers nor the crew reaches the 11 the
   curve asks, and this is C3's, C4's and C5's precedent (#172's 7).
8. **The willows are built at about 1,345 a member at 10 against their 800,** and §8 says so: a den
   needs its keepers and a brood and each map its toad, which is four fights before the quay's.
   Fights to a rest is the gate and a share a proposal (#176's 3), and behind the road a company
   that comes later is paid less by level.
9. **The secrets are B3's boathouse back room and B4's flood-store in the hill,** each hint on its
   near side and always there, saying only what is seen: the green worn off the boathouse's back
   wall at a hand's height, and the martins nesting where the hill's facing is laid looser.
10. **The finds are gold, draughts and an earlier act's piece with a plus:** a Brigandine +1 in the
    boathouse, a War Hammer +1 in the store and a Spear +1 in the heronry's hoard. Every rung-13
    plus is placed already (#399's 3), and none of these comes near the window or the ladder. Their
    gold meets the curve's, which #153 owed.
11. **The wilderness features are few:** on B3 a shrine at the bend (intellect), a cairn on the
    hill and Hiltje in the withy beds with a rumour; on B4 the statue on the hill's crown (might)
    and a cairn in the fen. No shrine of the area gave intellect or might. No camp, since C3's loft
    and C4's carters' camp are a box away, and no sign.
12. **The statue's answer is the god's name, *tijsjonger*,** which only the Holy Symbol's rim says
    (#175's 9): the statue asks for it and never says it, so §10's "on its silver alone" holds, and
    a company that has been to the sacristy has a reason to walk back. Hiltje says the name was cut
    off and her grandmother would not say it.
13. **C4's ford is carried into B4,** sand across the broad water's foot on row 22, and each box's
    river has a ford of its own, B4's under the heronry and B3's below the quay, since the river's
    shallows otherwise take a swimmer.
14. **The river comes out of the rim's hills at B3's corner:** the atlas's river meets the box under
    the rim's mountain, where no square can be water to the west and land to the north, so the
    corner is mountain two squares deep and the river starts at 1,2.
15. **The willows hold no step and no quest,** none of the side quests and no guild task; the
    Cartographers' quests of ranks 2 and 3 are the owner's to file, and may point here.
16. **The flood-store is faced in stone, drawn as building squares round its door,** so B4 has wall
    faces enough to dress no more than half of them.

Decided by delegate for #582, each the owner's to overturn:

1. **The plinth is two `once` events on 8,14, held apart by the Grove Stone.** `b5_plinth` keeps its
   line as it was and is held `after` `{ seen: 'grove2:g2_stone' }`; a new `b5_plinth_first` is held
   `until` it, with the same words without the last sentence. The ruling is the issue's own. Ids are
   added and never renamed (EXPANSION §5.5), so the old id keeps the old line.
2. **The condition is one constant in the map, written the same in both events,** which is how the
   pillars check knows the two texts are never said together (`until` X against `after` X).
3. **The chapter takes either reading as the plinth seen,** which the issue does not name. Its
   `plinth` entry and the two goals that wait on the plinth were keyed on `b5_plinth` alone, so a
   company that read the short line would have had the step unwritten and the goal stuck. It is
   Saltreach's own quest, in the lane; the change cannot stand without it.
4. **A company that read the short line and later stands at the Grove Stone is told the cut the next
   time it steps on the plinth,** since `b5_plinth` is `once` and unspent for it. That is the shape
   the issue gives, and the one place the two meet for a company that came by Saltmouth first. A
   second `until` on `b5_plinth` would leave it never told.
5. **A save that read the plinth before this reads the short line on its next step there,** if it
   has not stood at the Grove Stone: `b5_plinth_first` is new to it. Said once, and nothing moves.
6. **The walkthrough holds the words to the letter,** as strings of its own, not read back from the
   map. The plinth step it shares with Sunderwood's seeded runs reads the cut to a company that has
   stood at the Grove Stone and the short line to one that has not, since those runs play it with no
   Grove Stone stood at. In order the company reads the cut; with Saltmouth first and in the area
   walk, the short line; `thePlinth` plays the late company and the early one.

Decided by delegate for #806, each the owner's to overturn:

1. **The Choirmaster is set again at 825 hit points, its blow kept at 11d8+15** (680 hit points
   before), by hearth.md §7's method: tries of hit points and blow on the gate's seeds. #175's
   gate set it against a company without its first prestige, 48% at 11 and 98% at 13; the gate's
   company has taken the prestige since #541, and won it 94% at 11, past the limit of 80%. The aim
   is about half at the floor (30% to 70%) and nearly always two above (90%). The tries, in percent
   of the gate's 400 seeds and of its own hundred, a fight broken off being one still running at the
   fifteenth round, which the gate does not count won:

   | Hit points | Blow | At 11 | Broken off | At 13 | The gate's hundred, 11 and 13 |
   |---|---|---|---|---|---|
   | 680 (before) | 11d8+15 | 94 | 0 | 100 | 94 and 100 |
   | 760 | 11d8+15 | 79 | 1 | 100 | 74 and 100 |
   | 800 | 11d8+15 | 65 | 1 | 100 | 58 and 100 |
   | **825 (kept)** | **11d8+15** | **54** | **3** | **99** | **48 and 100** |
   | 860 | 11d8+15 | 41 | 4 | 98 | 37 and 98 |
   | 900 | 11d8+15 | 31 | 6 | 95 | 26 and 96 |
   | 760 | 14d8+20 | 61 | 1 | 98 | 66 and 99 |

   825 is inside the aim at both levels, on the hundred and on the 400.
2. **Hit points alone,** since 3 fights in 100 are broken off at 825: a company that loses to the
   Choirmaster is beaten by it and not by the clock. The rule for the four Act II bosses (wrackholm.md
   and sunderwood.md §9 hold the others): raise the hit points till the floor reads about half, and
   where more than one fight in ten is then broken off, raise the blow and lower the hit points till
   it is not. A boss that the clock beats asks a company for time and not for lives.
3. **The temples' floor is 82.7% with the boss among its three groups,** 98% before: the verger and
   the choir are won every time and the boss 48%, so the map's fights pool at (100 + 100 + 48) / 3.
   That is off the aim of 90% and inside the limit of 80%, as the choir's 83% was when #175 set the
   boss, and the check lists it. The map's limit binds the boss from below: it must be won 40% or
   more at 11 for the map to hold it.
4. **The `OWED` line for the Choirmaster goes,** and the reason `OFF_LINE` gives for it
   (`tools/tests/harness.ts`) names this issue. Level, xp, gold, drops, id and the group stay, so the
   curve and `src/content/shipped.json` do not move.

Decided by the builder for #860, each the owner's to overturn:

1. **The shop takes the room and Pender stays on its square.** A business carries the room
   (`interior`) and a person after it with none keeps their words and, for Pender, `teaches`, which
   the shop's first menu reaches as "Talk to Pender the locksmith", as the Map Room reaches Ysolde.
   The issue's "as the armourer keeps his" is read so: Saltmouth's armourer teaches nothing, and
   Ysolde and Ruan are the precedent.
2. **One line of his words changes:** "I don't sell picks. I have not yet met anyone I would sell
   them to" becomes "Picks too, now. I have met someone I would sell them to". He sells what he said
   he never would, in his own few words, and neither the price nor what the picks do is told. The
   other two lines and the room stand.
3. **The ids and names are `set_of_picks`, "Set of Picks", `guild_chart`, "Guild Chart" and the
   shop's "Pender's Locks".** Each ware's name is twelve glyphs at most, so that the Sell list's row
   with a member of ten letters (name, member and price) fits the panel as the Buy list's does; the
   walkthrough measures both.
4. **Each reads from the pack,** a line of what it looks like (`text`, as the Holy Symbol of the
   Tide has), so that Space on one says what is in the hand and not "nothing to do with it here".
   Neither line says what the thing does: that is found.
5. **The chart sits last in the Map Room's stock,** beside its stores, at 400; the picks are
   Pender's only ware, at 750. Both are slotless, off the ladder (no `GEAR` row) and inside the
   2,000 window, and a shop buys either back at half, 375 and 200 (two thirds to a Merchant). No
   figure moves: the gate's company buys nothing here and holds no skill.
6. **The walkthrough buys them in a company of its own,** given the gold directly (the road has paid
   it nothing by here, and the armourer's step is bought on gold set by hand), so that a chart or a
   set of picks carried touches none of the walk's later steps. The picks are tried on #857's fixture
   shape, a locked chest under a company with its thief down (the thief is born to Lockpick), since
   Saltreach holds no locked chest; the chart in #857's dungeon hall, where it maps two squares west
   in place of one.

Decided by the owner's delegate for #892, each the owner's to overturn:

1. **Pender's room is a shop with Pender after it: stands** (the builder's 1). Ysolde at the Map
   Room and Ruan at the Keel are the precedent; the picks are his only ware and his teaching is the
   second entry of a two-entry menu, "Talk to Pender the locksmith". The pilot takes the Thief's
   first sooner (tick 26 where it was 71, at 5,000 gold, #880), a report and not a gate
   (docs/PILOT.md). Teaching first would need a person's room to offer a shop, which
   `businessEntries` cannot list today: a systems pull request, then a Saltreach one for the order
   of two rows.

Decided by the builder for #830, each the owner's to overturn:

1. **The bounds' brief is §12,** after §11, in §4's form, for all eight boxes; the boxes come in four
   pull requests, C2 and B2 first, then A3 and A4, A5 and A6, B7 and D6, then the enclave and the lair
   (the delegate's order on #828).
2. **C2 is the Upper Water's, whole,** the Downs' 214 walkable squares on the Edge's top with it:
   open to D2, where the crossing line names the Upper Water and warns a company under 8. No group
   stands there and nothing there pays, so the Foreland's company meets only the view.
3. **Kestrel Edge's face is mountain in C2,** as in C3, and the Scarp will be in B7, as in C7: the
   cliff is the Whitespine's novelty, which the pillars check refuses on a box before it.
4. **B7's ground above the Scarp is closed with it,** as C7 closed its own: B8's north edge is the
   cliff and C7's west edge the void there, so nothing built walks onto it.
5. **A7 stays cut,** with A2 and C1: A6's south edge and B7's west edge stand closed against it. Its
   224 squares are reached from no built box, and building it would widen the issue.
6. **The valley's hardest differ from box to box,** as far as the roster allows (§12.1): a bull toad
   and a fen toad come up to spawn at C2's tarn, as Jelle tells it, and a bull toad and an eel come up
   the Long Water to B2's mire. A lone bull toad paces a company of 10 at about 8.9 fights to a rest
   against an aim of 7.5; each pair, the toad with one at 10, at 5.6 to 5.8.
7. **The watch is the Hand's barge crew** at a fire on the crest, the roster's people: the area has
   no hill folk to place, and the watch on the river ties the valley to the Stone's barge without
   saying more.
8. **The finds are a Long Axe +1 and a Sharkskin Coat +1,** at 900 and 1,250, inside the 2,000
   window. The first builder's Great Sword +1 (2d6+2) and Long Bow +1 (1d8+2) were weaker than the
   Long Axe (2d6+4) and the Horn Bow (1d12+4) that Saltmouth's armoury sells, and the owner's delegate
   rules that no find is worse than the area's nearest shop sells for its slot. The Long Axe +1 betters
   the shop's for C2's slot, the Hand's as the Tide Ship's is; no bow betters the Horn Bow but its +1,
   which the pans give, so B2 takes the coat, the one plus of Saltmouth's step no box gave. Neither is
   given elsewhere in Saltreach.
9. **The walkthrough walks the bounds in one function,** `theBounds`, called last, so each later box
   adds its steps there. No edge pins go into `tools/tests/outdoors.ts`, which holds none for
   Saltreach's boxes: the walkthrough walks each seam the boxes open instead.
10. **Two test fixtures move off B2's land** to C10's steppe in the Glass, the reach, which stays
    unbuilt: the edge fixture in `tools/tests/pillars.ts` and the hills fixture in
    `tools/tests/atlas.ts`, each of which says a map built on it moves it.
11. **The lair's door is on A5 and the enclave's on B7** (§12.10), as the owner's delegate moved them
    on 18 October: #846's design (#908) puts Saltreach's lair in a drowned mound on the fen's west edge
    under the rim, which fits the fen and its rumour's words, and B7's Scarp's foot has room for the
    enclave's door among its squares. #845 and #846 settle what they hold.
12. **The six to come give gold, draughts and elixirs,** no gear: with C2's and B2's finds the
    ladder's pluses at 13 are all given in Act II, and the one Saltreach lacks, Plate Mail +1, is
    Wrackholm's. Their groups as planned pay about 2,600 xp a member against the first reckoning's
    2,200; A6 and B7 build a group fewer if the lead asks it (§12.1).
13. **D6 starts on the spit,** where D5 opens onto it, with its group and its secret there, since the
    hint check walks from a map's start; the shore under the town is walked onto from C6.
14. **A3 meets B3 as B3 is built:** its north-east corner is the rim where B3's ring closes the
    river's way, so the atlas's two squares of shallows at A3's 31,0 and 31,1 are mountain, and its
    31,25 a willow against B3's trees. The shallows are seen up the line of the willows, as §12.4 has
    them, and reached by no one. A4's 23,0 is mountain against A3's.
15. **A4's south edge is shut against A5** with the rim's mountain, a little thicker in places, but
    for its corner: 31,31 is marsh, as B4's 0,31 beside it is, so the seam with B4 agrees square for
    square, as the rule for the seams asks of a box built since it (EXPANSION §5.1). That square is
    the one of A4's open onto unbuilt land; A5 meets it with marsh at its 31,0, as B5's west edge
    asks, and the rest of A4's south edge with mountain (§12.6).
16. **A4's camp stands clear of its groups,** eight squares from the herons and nine from the toad,
    walked or counted, on the dry ground at the fen's edge rather than in its corner: no group keeps
    it, and rest at a camp is refused only with a group next to the party, so a company rests there
    while they stand, and the walkthrough says so. §12.1 and §12.5 say the same.
17. **What is left open:** after A3 and A4, 164 squares of Saltreach's built boxes are open onto
    unbuilt land, where there were 201: A4's south-east corner (1) and B5's west edge (32) onto A5,
    B6's west (32) onto A6 and its south (32) onto B7, C7's west (23) onto B7, C6's east (19) and
    D5's south (6) onto D6, which the next two pull requests close;
    and C7's east (19) onto D7, the Wold's box, where the Glasswold's lair has its way in
    (docs/areas/glasswold.md), which §12 does not build. That edge is shut when D7 is built or C7's
    edge is closed: D7 is built (#924), its west edge open where C7's east is, at rows 0 to 18.
18. **A5's pools hold four leeches and an eel,** one leech more than the brief's three, a choice and
    not a need. With three, the plain company two under the floor paced 4.39 fights to a rest, 67.5%
    of the floor's 6.5: over the aim of 66.7% and inside the limit of 100%, which the gate allows.
    With four it paces 3.93, 60.5%, and the floor's own figure is 6.84 against the aim's 7.5. The
    fourth leech pays 65 xp a member more (485 against 419), and A5 stands 35 over the brief's about
    450. §12.6 says so.
19. **The drowned mound is drawn and left bare:** a rise of hills 3 by 3 at 25–27,22–24 in the
    marsh, its crown at 26,23, a ring of water round its north, east and south and its west open to
    a way along row 23 from the gap in the dyke at 20,23. No feature or group stands on it, on the
    way or about it, so the lair's pull request puts its door on the crown and moves nothing, and
    the walkthrough walks to the crown. The atlas has marsh there and the mound touches no edge.
20. **The two blocks have shapes of their own:** A5's sluice-house is 6 wide and 3 deep across the
    dyke at 16–21,14–16, a corridor of four squares behind its door at 21,15 on the fen's side; A6's
    cell is 4 by 4 against the rim's foot at 15–18,8–11, a floor of two by two behind its door at
    18,10. C2's cleft and B2's hut are 3 by 3, A3's well-house 4 by 3 and A4's still 3 by 5. Both
    hints stand on open ground at the door, as A4's does: the clear water at 22,15, with four
    squares of shallows drawn running out of the dyke's foot into the marsh, and the slit at 19,10.
21. **A6's south-east corner is the rim's mountain, and so is B6's 0,31 beside it,** as the owner's
    delegate rules on the review: the two agree square for square and A6's south edge is shut
    against A7, which stays cut (decision 5), with no row of `OPEN_ON_NOTHING` holding a square of
    it. B6's 0,31 is a dead-end square with nothing on it, its neighbours 0,30 and 1,31 joined still
    through 1,30; the pull request takes square 0 out of the row for `delta_b6 south`. A saved
    company standing on it loads onto the void and steps off. B7's 0,0 beside both is the same
    corner, and its pull request draws it to match (§12.8).
22. **The priest of stone's riddle is answered "tide":** TWICE A DAY IT TAKES THE SHORE AND GIVES IT
    BACK, AND IT IS NEVER LATE. It gives 70 gold to the purse and a point of luck to each member.
    The bell heard at 28,4 stops when the Choirmaster falls, as the count it is does, and the
    Stone's coming home keeps it stopped (`until` the temples' own flags, as B6's stair).
23. **Both camps stand clear of both groups,** as A4's does (decision 16): the wildfowlers' hide at
    19,3 is 12 squares from the pools and 31 from the toad, the pilgrims' hearth at 20,24 is 13 from
    the drowned men and 9 from the toads. No group keeps them, and a company rests there while the
    groups stand.
24. **The lead holds without a trim:** with A5 and A6 a clear gives 12,791 xp a member and the lead
    stands at 12.733, against the limit of 13.0 (#634). B7 and D6 as planned, 600 and 300, would
    bring it to about 12.87, so A6's pay stays at the brief's and B7 is the one to trim if it nears
    the limit.
25. **What is left open:** after A5 and A6, 98 squares of Saltreach's built boxes are open onto
    unbuilt land, where there were 164: B6's south edge (31) and C7's west edge (23) onto B7; D5's
    south edge (6) and C6's east edge (19) onto D6; C7's east edge (19) onto D7, the Wold's box,
    which §12 does not build (decision 17). A4's corner, B5's west edge and B6's west edge are
    answered, and A6's south-east corner is shut with B6's 0,31 (decision 21).
26. **B7's edges and corners are worked out from the built letters:** its north edge is B6's south
    edge (the rim's mountain at 0, marsh 1 to 31), its east edge C7's west edge (marsh 0 to 12,
    grass 13 to 22, the mountain 23 to 31) and its south edge the mountain against B8's north edge
    (the mountain at 0 and 1, the cliff from 2); its west edge is the rim's mountain against A7,
    which stays cut. The corners: 0,0 the rim's mountain, with B6's 0,31 and A6's 31,31 as decision
    21 rules; 31,0 marsh, as B6's 31,31, C7's 0,0 and C6's 0,31 are; 0,31 and 31,31 the mountain,
    as B8's 0,0 and C7's 0,31 are, B8's 31,0 being cliff. No row of `SEAMS_AS_BUILT` is added, and
    none of `OPEN_ON_NOTHING` for B7: no square of its west or south edge is open.
27. **The Scarp is mountain the whole of B7's south, and the Glasswold's ground above it with it:**
    the cliff's line, from 0,18 to 31,23, is drawn as mountain as C7's is (decision 3) and every
    square under it, with the rim's two columns on the west, so no walker comes onto the Wold's 219
    squares and none of the box's 614 squares to stand on lies under row 23. A climber crosses the
    mountain there as everywhere between two areas the Scarp stair joins (the seam rule asks no
    row), and the walkthrough measures the edge to a walker.
28. **The enclave's door is left at the Scarp's foot at 22,22,** the first mountain square under the
    grass at 22,21, its way the grass of row 21 from 20 to 31, and nothing stands within four
    squares of it: the salt-carter at 22,16 and the track's end at 23,16 are the nearest, the
    smugglers' fire at 15,20 nine squares off. The enclave's pull request (#830's, after #845) draws the door
    there and moves nothing; the walkthrough walks the way and measures the clearance.
29. **B7's groups are the brief's, kept to their ground:** three salt crabs on the grass at 20,13,
    the nearest at 14 steps and level 11, and the Hand's smugglers as C6 holds them by night, two
    smugglers and two bowmen in the back rank, at their fire under the Scarp at 15,20, here at every
    hour, the farthest and the hardest at 20 steps and level 12. Neither roams, so the halt at
    14,13, six squares from the crabs and eight from the fire, is clear of both (decision 23). The
    gate holds at 11, at 7.41 fights to a rest against an aim of 5.75 to 7.75.
30. **D6's group is the brief's two bull toads,** and no other make-up serves: the curve's rise rule
    asks the hardest group's mean level at 12 in a box of 11 to 12, which only bull toads and the
    smugglers (B7's) reach, and a lone toad paces about 20 fights to a rest at 11 against a limit of
    10.25. They lie on the spit at 12,2, kept to it, 4 steps from the way in, as A6's pair lie at
    its south end; the gate holds at 11, at 5.76 fights to a rest against an aim of 5.75 to 7.75: the aim's floor, for the pair's true pace is 5.68 over 1,500 seeds.
31. **D6 is three pieces of land,** as the atlas has it: the spit at the top (22 squares and the
    store's 6), the shore under the town (36) down the west and the shore's south end (19), each
    walked onto from its own side and none from another, so the map starts on the spit where D5
    opens onto it (decision 13) and each piece has a point of interest of its own, the density
    check walking from every point. Its edges are worked out from the built letters: the north edge
    is D5's south edge; the west edge is C6's east edge, with the warehouse's wall carried on at 0,9
    and 0,10, tidal ground at 0,7, 0,20 and 0,25 to 28 and salt at 0,29 to 31; the east edge is the
    sea against E6's west edge. The south edge is open at 0 (salt) and 1 (tidal ground) onto D7,
    which stays unbuilt, so it has a row of `OPEN_ON_NOTHING`; square 1 is tidal ground, not
    shallows, because the pillars check carries water on into the atlas past an edge and D7's
    atlas is tidal there.
32. **The two secrets have shapes of their own:** B7's bothy is an L of walls 6 wide and 4 deep in
    the Scarp's foot at 5–10,16–19, a short arm behind its door at 9,16 and a long arm of four
    squares along the foot to the strongbox at 6,18; D6's footing is a round of dressed stone 5 by 5
    at 9–13,4–8, a floor of five squares in the shape of a plus behind its door at its north tip,
    11,4, the keeper's chest at 11,7. C2's cleft and B2's hut are 3 by 3, A3's well-house 4 by 3,
    A4's still 3 by 5, A5's sluice-house 6 by 3 and A6's cell 4 by 4. Both hints stand on open
    ground at the door: the fan of dead white grass, nine squares of salt spreading north from its
    point at 9,15, and the spit's end at 11,3, where each wave booms under the footing.
33. **B7's shrine gives a point of accuracy:** every stat is given by a shrine of the area already,
    accuracy only by C4's. The cairns give 75 gold (B7) and 60 (D6) and a draught each, and the
    finds are the brief's, 250 gold and an elixir in the bothy and 150 gold and a draught in the
    keeper's chest; no gear repeats a find the area gives, as §12.1 plans, and none is weaker than the shop's.
34. **The lead holds without a trim:** B7 pays about 604 xp a member by the curve's count and 427
    gold, D6 about 315 and 210, 919 in all against the 900 planned; a clear gives 13,711 xp a
    member and 8,410 gold, and the lead goes from 12.733 to 12.910 against the limit of 13.0, with
    0.09 to spare. No group is trimmed.
35. **What is left open:** after B7 and D6, 21 squares of Saltreach's built boxes are open onto
    unbuilt land, where there were 98: C7's east edge (19) and D6's south edge (2) onto D7, the
    Wold's box, which §12 does not build (decision 17). B6's south edge (31), C7's west edge (23),
    C6's east edge (19) and D5's south edge (6) are answered, and B7's west edge, 0,0 with it, is
    shut with no row. The outdoors test reads "169 pairs, 34 of them between two areas, 5400
    squares, 329 of them as built in 62 rows" and "102 edges on nothing, 3248 squares, 675 of them
    open in 42 rows".
36. **A6's step reads B6's 0,31 to a walker now:** the square is the rim's mountain between A6 and
    B7, drawn as the void only while B7 was unbuilt (`layOutdoors` closes a ring's mountain where it
    faces unbuilt land), so the walkthrough's claim that no company climbs it held then and holds
    now for A6's own south edge, which stays void against A7, and for a walker on 0,31. A saved
    company on it stands on a mountain square and steps off north or east, as it would off the void
    (decision 21).
37. **The Old Chanter's numbers are the line's boss at 32,** as `tools/kit/line.ts` gives them today
    (2,100 hit points, armour 29, +20, 34d8+41, speed 13, 20,373 xp): it stands on the line, so
    its row has no `offLine` word. They are provisional; the lair's pull request sets them
    (MONSTERS §13).
38. **Dead, blessing itself and cursing, as §13 has it,** the way its kin do it: the Choirmaster's
    `bless` at chance 1 and the Cairn King's curse at 0.2. No gold and no drop: the Telstok lies in
    the lair.
39. **Size 1.35, the skeleton family's largest** (the Cairn King 1.3, the Choirmaster 1.1), so it
    stands over the temples' chanters; its span [0.31, 0.35] is the least that holds it at every
    size, and its tint the fen's green, #3e5448.
40. **A drawing of its own, not a third row of the chanters' `priest`:** its staff, its mantle of
    weed and its crown of reeds share nothing with the bell and the whelks, and a row there would
    put new branches in a drawing two built kinds share. It is a frame and thirteen layers, as the
    bone knight is (#1005).
41. **Its staff is the Telstok's black bog oak,** the foot worn round, since a guardian answers what
    its lair holds (MONSTERS §13); nothing in the game says so, so it is found and never told.
