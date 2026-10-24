# The Foreland's decisions

The Foreland's decisions (EXPANSION §8.2): the old §9 of its doc, `docs/areas/shelf.md`, moved
here whole by #1011, its four lists in their order. It is appended to and never rewritten: a
builder adds a list at its end, and a later decision that changes an earlier one says which. Its
current state is `docs/areas/shelf.md` and its plan `docs/areas/shelf/plan.md`.

## 9. Decisions

Decided by the owner on 27 and 28 September 2026:

1. **The grid.** Every outdoor map is one box of the grid the built maps sit on (§1), so a map's
   place is its box, and whatever is not built is whole boxes. Borders become box edges as boxes
   are built, and the rim's row above the Downs is left unbuilt (§11).
2. **The pilot** (#47) is F2 and F3, the road west to Gullwick: F2 is the only box that meets the
   Foreland, and F3 holds the Downs' first step. Gullwick's box is two-thirds sea, so the two are
   about 1.3 maps of land, and between them they measure a country box and a core box, the two
   floors the pilot tunes (EXPANSION §5.3). The pilot measured every box of the Downs in the end:
   its hours, and the gate's aims and limits it left as they were, are in §8.
3. **Zones hold several maps.** The Downs are one zone of seven boxes, F2 and F3 from the pilot on;
   an atlas zone lists its maps (`AtlasZone.maps`; #66). A zone to a box would ask a step of the
   quest of every box the road crosses (EXPANSION §5.8), bare country included.
4. **Gullwick** is a village on F3: its houses, its boats and Wenna's mother as features, as the
   Ellerby farm is on the Foreland map, and a camp to rest at (#45). No businesses, so no new
   interiors.
5. **The Berth** is a dungeon of its own: one level of 16 by 16, entered from D2 (#70).
6. **The Lodestone** is a stone to see, beside Helmstow on the Foreland map, with a Lantern who
   tells a new company what a Stone is, so that the cut Grove Stone reads as wrong when the company
   finds it (#73).
7. **The names** (§10).
8. **The side quests:** #56's eight for the Foreland are pulled into the build, each built where its
   places are (§6): with their boxes, or in #77, on the systems of #76.
9. **Ashcombe moves past Gullwick,** so that the first job is further and a bit harder (#85 and
   #87): into E3's north-east corner, across the Wend from Gullwick, with its cellar starting at
   level 2 and its Rift Warden held to the gate's rule for a boss there. The Foreland map keeps a
   farm where it stood, under a name of its own, with a small store in a farm kitchen (#97) that
   sells rations at its own price (#98): 3 gold, a quarter under Mottram's. Built in #87: the farm
   there is Ellerby (§10).
10. **Dens** (#88): a camp that breeds one kind of monster until a company beats its keepers and
    burns it; its hoard is theirs, and it stands as a ruin after. The first three are a rookery in
    E2, a wolves' den in D2 and a bandit camp in D3.
11. **Gear.** A plus is +1 to hit and damage on a weapon and +1 armour class on armour (#100).
    Mottram's sells the band's gear, and in Act I pluses are found, not sold (#99 and #101). No
    find is dearer than its band's window on the curve (`src/content/progression.ts`), so the
    captain's mail is Scale Mail +1 and Thornmark has no plate with a plus. The ladder (§8): every
    class betters its kit by level 3 and again by level 5, from Mottram's and then the Downs' finds,
    the named ones at the top.
12. **The world map's lettering** is on the grid: the border names each box, and the strips at the
    world's edges go unlettered (§1; #66).
13. **Crowness Light** stands on the point, at 156,90, rather than inland at 140,88 (#67).

Decided by delegate for #157, on 2 October 2026 (the owner's to overturn):

14. **The gate really turns back** a company with an orcblood member, as STORY has the sergeant step in
    front of Idris; the postern, always open, is why it is no lock. It needed `Exit.shut` and
    `member.race` (#454).
15. **The postern is in the south wall by the Eel,** in both cities, and named the harbour postern for
    the boats it goes down to, off the map.
16. **The curfew bell is a night event** on the middle street, said every time, rather than a dusk bell
    the clock would have to learn: a company of 16 is seldom in Helmstow at the turn of the light.
17. **The Chapel shuts with its cure and raise,** which Thornhold and Saltmouth still sell; its people
    go, the notice says where the sexton went, and an unanswered bell ends there. Businesses wear a
    presence for it (#454).
18. **The Wardens are events, not monster groups:** no standing group that does not fight exists
    (the `warden` drawing is the Rift Warden's, not a soldier's), and a fight in a town of band 1–4
    with a company of 16, before the act's war with them, would say the wrong thing.
19. **One of the cousin's captains** sits in the Drillyard, a person with two lines and one after; the
    guild's quests are as they were, given by the hall, since a person cannot give them.
20. **Prices rise** by half: "prices do not" read as do not stay, since Helmstow changes never for the
    better. The inn and the stores are twins on their squares after the flag; the oil keeps its
    forty for Mottram's word.
21. **The Gilded Eel's rumours change,** since its old ones are Act I's; the Keep is left as it is, and
    Vask in his throne room after the act is a question for the owner.

The Scarth once the Regent has the ledger (#156), each the owner's to overturn:

22. **Hale is taken on the Delta's first step,** not at the pass: a once-event on each square of
    D5's first row a company can stand on, there once `q_greywater_done` holds, sets `q_hale_taken`
    (an event sets a flag as it is said, the systems change #156 asked for) and shows two riders in
    Warden grey going over the Edge towards the Scarth. Every way down from the Downs crosses that
    row; a way into Saltreach that does not, such as a later act's boat to Saltmouth, leaves Hale at
    the pass.
23. **Hale and the strangers wear the flag itself,** Hale `until` it and the strangers `after` it,
    as Saltmouth's Warden and the Tide Ship's last row do, so Hale is never at the pass and in the
    hold at once. A company that has been to the Delta and gives the ledger later finds Hale gone on
    its next walk down the Edge, not as it hands the book over.
24. **The strangers are one person,** `two Wardens at the Scarth`, on Hale's square: one up, one
    under his hat, the crate gone. They ask the company's business, do not know Hale's name and warn
    of nothing (#151's call 5: Vask's Wardens). They hire no one and set nothing of their own.
25. **They take Dunstan's letter** if it is still in the pack (`q_riders_grey`), so Riders in the
    Dark does not stick open, and it goes into a coat. They take nothing else: the seal goes to Maud
    and the paper to Vask, and the goals say so once Hale is gone.
26. **Vask's after-words name the Wardens,** not Hale, as holding the Scarth: the words are fixed, and
    are true both before and after.
27. **The sign, First Watch's `scarth_watch` and the rest are kept:** the road is still open, the
    two Wardens watching the pole are the strangers once Hale is gone, and Hob, Dunstan and the
    Eel's dockhand do not know he is.
28. **No journal entry says Hale is gone:** Saltreach's chapter writes the news at Saltmouth's gate,
    where it is told.
29. **Hale's Sergeant (#56's 20) is left to #558** (docs/areas/thornmark.md §6).

Decided by delegate for #19's trainers in the Foreland, on 3 October 2026, each the owner's to
overturn:

30. **Three new people teach and one who was here:** Wulfric in the keep's ward, Aldith in Helmstow
    and Siward at Coldharbour, and Mottram in his stores. Mottram's first meeting puts no choice, so
    the trainer's menu follows it; Dunstan's yard fails the road's rule, and moving him would break
    Riders in the Dark.
31. **Mottram is the chandler,** whose stores sell Lantern Oil and torches. His lesson is a `says`
    said once to a company with a paladin of 11, keyed to his hire as his other words are. The cost:
    the menu follows his words from the first meeting, so a paladin under 11 reads "from level 11"
    there. A lampmaker of his own in the stores is the alternative.
32. **Wulfric works at a bench before the empty building, in the open.** A door there would need a
    business, and every business a room of its own: the armoury's door, its armour and its shields
    wait on an interior (another lane).
33. **Aldith keeps no shop,** as DESIGN has the luthier, and sits under the Hearthlight's eaves.
34. **Siward, Dunstan's old standard-bearer, teaches in Coldharbour's east field at 19,16.** The yard
    is seven squares from the track to the Berth, a road and the one quest's way, and one from the
    barn's rats; the field is 14 from the road and 13 from the nearest group.
35. **All four are always there,** in both cities and whatever Riders in the Dark came to. A company
    of 16 or more reaches them: an orcblood member by the postern, and the keep's gatehouse is never
    shut. The band warns and never walls.
36. **Each has a `seek` line of their own,** since the system's would read "in The Keep" and "in
    Callow Downs". The goal's "Find Wulfric, armourer of the keep in The Keep." is the system's
    wording, left to it.
37. **Their words:** three lines at the first meeting for the three new people, and three in
    Mottram's lesson. Dunstan's words do not change.
38. **The walk** checks each place and presence in both cities; teaches a knight, a paladin and a
    bard at 11 in the old city and again at 16 in the changed one, Idris let in by the postern;
    holds Siward to the road's and the groups' rule; and teaches the Banneret at 19.

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.9: each box's landmarks, points of interest, encounters, secret and
  hint, share of the pay.
- **The core** is F3, E3 and D2, the boxes that hold a step of the quest; the other four are
  country (§4).
- **Tier 3** is sold by Helmstow's Lantern Guildhall (`maxTier: 3`), so that the band's tier is
  sold in the band (§8; #74).
- **The Berth** goes on the atlas in D2, about 118,42, with a track up to it from Coldharbour across
  E2 (#68 and #69). #56's Riders in the Dark rides it.
- **Sjonghol** (the Wind Cave, `src/content/atlas.ts:309`), Saltreach's cave in the face of Kestrel Edge,
  moves a square west into C3, so that D3 does not hold it (#71).
- **The chalk figure** below the Berth, a ship that only the Berth's mouth shows as one (§4.6).
- **The Queen on her bier,** her hand bare, as STORY has the tomb, where MONSTERS §5.2 has the bier
  empty (§4.7).
- **Three changes to #56's side quests** (§6).

Decided by the builder for #837, each the owner's to overturn:

1. **The bounds' brief is §12,** for E4 and the lair, each in §4's form, in two pull requests: E4
   with the brief (#828's 3, the Foreland's one box), then the lair once #847's powers and the Hag's
   drawing are in. The Foreland has no enclave (#837).
2. **E4 is the Downs', laid whole in Callow Downs at 4–5,** D4's and D3's band, the Downs' last: its
   69 walkable squares and the 32 of shallows beside them are all the Downs' by the atlas, and E3
   and D4, the boxes it runs off, are the Downs' too, so no crossing line names the land at its
   edges.
3. **No group stands on E4.** The curve's rise rule asks a box's hardest group at its top, 5. At 5
   the Downs have the Black Dog that walks D2 by night, D2's barrow wolves (the den's keepers) and
   the cutthroats who keep D3's bandit camp and walk D4's road by the Delta; the Foreland's others
   at 5 are its bosses, the Deacon and the Berth's captain. A group on a shore of 65 squares would
   crowd it, beside the lair's door with nothing within four squares, and repeat D2's, D3's or D4's
   own. The area's clear already gives 4,101 xp a member of the 3,734 the curve asks (§8); the lair
   is the bounds' fight.
4. **Its wilderness features are a post of holed stones on the last rise and a cairn of flints at
   the strand's end.** The post is a shrine, +1 personality once, a stat no shrine of the area
   gives. No camp: E3's lee of the point is seven squares from E4's north edge across the seam.
5. **The secret is a crabber's store in a stack drawn at the north-east shore,** a ring of nine
   squares where the atlas has shallows and the sea, its hint the crab shells heaped at the rock's
   foot, a kind no box of the Downs had; its door, 10,2, stands where the art check takes it.
6. **The finds are gold, an Elixir and a Blue Vial,** the Downs' own (D3's pack holds both), better
   than the Healing Draught, the one potion Mottram's sells: 110 gold in all and no gear.
7. **The lair's door is the low cliff's face at 3,6:** a cliff of rock drawn across the down's last
   grass at 1 to 4 on rows 5 and 6, rock either side of the door and behind it, 3,7 open before it
   on the strand and nothing within four squares (§12.3).
8. **E4 meets E3 and D4 square for square,** its edges worked from the built letters: its 9,0 and
   10,0 are sand as E3's 9,31 and 10,31 are, where the atlas has shallows; its west column is open
   at 0 to 10 as D4's east column is, the atlas's but for the strand's sand at 0,7 to 0,9. Every
   corner agrees with the built letters; no built square changes and no `SEAMS_AS_BUILT` row is
   added. The two `OPEN_ON_NOTHING` rows E4 answers go and none comes: its east edge, against F4,
   is the sea.
9. **E4 differs from the atlas at 30 squares:** four of shallows drawn as sand (the seam's two at
   9,0 and 10,0 and the stack's way at 9,1 and 9,2), the stack's nine (two of shallows and seven of
   the sea), the cliff's eight and the strand's nine, the atlas's grass under the cliff drawn as
   sand (0 to 5 on row 7, 0 and 1 on row 8 and 0 on row 9), so the strand reads as one from the
   cliff's foot to the box's west edge.
10. **E4 starts at 6,0 facing south,** in from Crowness's down, the land and not the sea in view.
11. **The walkthrough walks the bounds in one function,** `theBounds`, called last.
12. **The lair is Hag Hole** (`hag_hole`): hole is the Foreland folk's word for a sea cave
    (docs/NAMES.md), as Brandy Hole's is, and the coast names a cave for what lies in it. One level
    of 16 by 16, as the brief has it (§12.3).
13. **The Hag stands alone in the narrows,** 7,7, the one square from the passage into the cave, so
    the wrack, the box, the lamp smoke and the ledge all lie past it and nothing in the lair is had
    without its fight; it never moves and never comes back.
14. **The Hag's numbers are set by its gate,** as the Steiger's and the Rim Troll's are
    (docs/areas/kilns.md §9, #831's 41). Drawn at the line's boss at 32 (2,100 hit points, attack
    20, 34d8+41), it was won 38% at 30 and 40% at 32; at 2,000, attack 26 and 24d8+26, its armour
    (29), its pace (13) and its hold (paralysed, 0.2) kept, it is won 66% at 30 and 91% at 32,
    inside both aims (66% and 90% over 400 seeds), where the Stair's Catcher and the Steiger stand
    under the aim at 32 (80% and 81%). It pays the line's 20,373 xp at 32 and carries its own
    `offLine` word. 2,800 with 21d8+22 (54% and 83%) ran 14.3 rounds a fight at 30 in the harness,
    44% of its days broken off at the round cap; the row set runs 11.2, 2% broken off.
15. **The secret is the ledge behind a fall of rock at 3,3,** over the pool in the cave's west end,
    found from the lamp smoke on the roof over the pool and searched at 3,4 facing north: the
    purse's 500 gold, as the Randzeche's stope and Bearn Liath's store hold 500, the lamp a look and
    no gear.
16. **The Hagstone lies alone in the box of black wood in the wrack,** no gold with it, as Torhide's
    kist has none; one in the world and sold nowhere.
17. **The old man is met once before he speaks of the stone:** his first meeting gives his look and
    his song and sets his `flag`, `netmender_met`, as the drover's sets `drover_met`, and every
    meeting after it gives his look, his song and then DESIGN §9's two lines, so the cave's pointer
    in the song is never lost. The words set nothing and ask nothing, and they say nothing of the
    Hag, so they stand after its fall.
18. **#837 is done with the lair:** E4 and the lair are built and judged, the lair at 30–32 with the
    Hagstone in it; the Foreland has no enclave (#837's 1), and no built map of the Foreland is open
    onto unbuilt land but F3's east edge onto G3, a crumb (#828).
