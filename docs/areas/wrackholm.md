# Wrackholm: step IV of the road, the smugglers' isle

The fourth step of the road of levels (DESIGN §9, EXPANSION §2.2), band 12–14, and the smallest
area on it: a heather moor with a rocky east end, out in Sylmeer, reached only by the smugglers'
boat from Saltmouth. Kelp Hole is where the Compact's crews land the Hand's cargo, and the Tide Ship
rides at anchor under the east cliffs with shards and people in its hold, Hale chained in its last
row and the stolen Tide Stone glowing in its forward hold. This is its area doc (EXPANSION §4, §6
and §8.2). Its work is filed under #154 (Phase 1.2, #149): its two boxes (#187, #189), Kelp Hole
(#188), the Tide Ship (#190), its chapter (#191), its side quests (#192) and its drawings (#193).
Figures are measured on main at `2cc52cd` (29 September 2026) with `worldGrid`
(`src/game/atlas.ts`).

Nothing of it is built. Its content will be `src/content/areas/wrackholm/` (maps, monsters, items,
its chapter of the one quest, The Stone Carried Home, in `chapter.ts`, its side quests in
`quests.ts`, climate and its part of the world map); it has no town and no businesses, so no rooms.
The folder comes with its first map (#187), as Thornmark's did; until then its rows are the plan's
(`src/content/atlas.ts`). Its ids: the area and its zone `wrackholm`, the cove `smugglers_cove` (the
id stays under the new name, NAMES §3), the ship `tide_ship` and, below it, `dead_drop`.

---

## 1. Where it is

The atlas makes Wrackholm one zone:

| Zone | Band | Squares | Built |
|---|---|---|---|
| Wrackholm | 12–14 | 2,066 | none |

Squares are the ones the atlas gives it, shallows included. Without the shallows the isle is 1,754
squares, about 1.7 zone maps (EXPANSION §1 has 1.7), and every one of them a company could walk:
grass 878, heather 514, hills 158, rock 105 and sand 99. It runs from x 142 to x 199 and from y 150
to y 210, in the middle of Sylmeer, with Saltreach's Saltings to the west across the water, the
Deepthorn's Penspern to the north-east and Hearth Isle to the east.

**The grid** (EXPANSION §8.2; docs/areas/shelf.md §1). The isle is two boxes, E6 and F6, and 234
squares of shore in the four round them (E5, F5, E7, F7), which go with their boxes' edges or stay
void (§11). Its only neighbour on the grid's land is the Wold, 13 squares of shallow at its
south-west corner where the Glasswold's coast comes near; no way runs there.

Its edges are the sea on every side. Its ways:

- **The landing,** at 152,172 on E6's south shore, where the smugglers' boat from Saltmouth puts
  in (`src/content/atlas.ts:368`; #164). A crossing, open from the start for the fare (EXPANSION
  §2.2, §7): Wrackholm is the first area a company reaches by paying, and the boat is how it
  leaves.
- **Kelp Hole,** at 154,170 in E6, the cove's mouth in the cliff above the landing.
- **The Tide Ship,** boarded from F6's south-east shore at 182,188 at night, by the boats that row
  out to it; the ship itself lies off the shore, its plate at 208,192 in the sea.
- **The Dead-Drop's stair,** from the Tide Ship's hold, planned at 26–28 (#22): built in #190 as a
  warning, not a wall.

`node tools/worldmap.ts out.png --zones` paints it.

## 2. What it is for

The middle of Act II (DESIGN §9): Wrackholm is the cargo. The Tide Ship's hold carries Wardstone
shards packed in straw like eggs and people chained in rows, bound for somewhere below the world;
the Compact's crews work it, the Hand's overseers keep the chains, and the orders come up from
below (MONSTERS §6.2). Hale is in the last row, thin and still giving orders; the ship's papers
say Wenna was delivered below, through the dwarves' deepest mine; and in the forward hold the Tide
Stone glows through its sacking, with its Rift stood up round it. The company carries the Stone
home, and the night it is set back on its plinth the Hearth burns steadier than it has since the
Queen died and the temples begin, very faintly, to sing (STORY, Act Two; #168, #191). Wrackholm is
also where the Compact's line begins to turn: the hermit on the east rocks has counted the ships
since the founder died and keeps his last letter (#56's 26).

The weather is the gulf's: wind, spray on the cliffs, gulls and the moor's heather.

## 3. What is built

Nothing. The atlas has the zone, the cove and the ship as planned plates, the sites (Kelp Hole, the
Tide Ship) and the links (the boat, the two ways in, the stair). Its systems are Saltreach's (#150)
and the boat's (#164); its monsters are drawn in #193.

## 4. What is still to build

All of it: two boxes, both core, and two dungeons. The whole of the isle is built at full density,
since a company crosses to it for the ship and nothing else:

| Box | Name | Kind | Band | Land | What is there | Its step of the quest | Issue |
|---|---|---|---|---|---|---|---|
| E6 | The moor and the landing | core | 12–13 | 663 (grass 318, heather 238, hills 76), 72 shallow | the landing at 152,172; the heather moor; Kelp Hole's mouth at 154,170; gulls on the cliffs | the cove's crews, and whose orders they take | #187 |
| | Kelp Hole | dungeon, two levels of 16×16 | 12–14 | | the crews' cave and the sea cave, where the Great Devilfish is fed | | #188 |
| F6 | The east rocks | core | 13–14 | 857 (grass 393, heather 276, rock 105), 71 shallow | the rocky east end; the hermit who counts the ships; the Tide Ship's anchorage at 182,188 | the ship at anchor | #189 |
| | The Tide Ship | dungeon, three decks of 16×16 | 13–14 | | the deck, the lower deck, the hold: the chained rows, Hale, the papers, the forward hold and the Stone; the stair down | the Stone found, the papers read | #190 |

The bands rise from the landing, 12, to the forward hold, 14, as the gate asks (EXPANSION §5.2).
The scraps of shore in E5, F5, E7 and F7 go with their boxes' edges or stay void (§11).

**The order** is the boat's: E6 and the cove, where the company lands; F6 and the ship. Building
waits on Saltmouth (#176, #177) and the boat (#164), and on Saltreach being played, since no more
than two areas are in flight at once (EXPANSION §3).

The places, as the atlas and the docs have them:

| Place | Box | What the docs say | On the atlas |
|---|---|---|---|
| The landing | E6 | the smugglers' boat from Saltmouth (STORY; #164) | the sea link's far end at 152,172 |
| Kelp Hole (Smugglers' Cove) | E6, and below | the Compact's crews and the Hand's cargo; the sea cave, where the Great Devilfish is fed (MONSTERS §6.2); the captain's brother (#56's 25); what the smugglers feed (#56's 28) | a planned dungeon at 150,158, its way in at 154,170 |
| The east rocks | F6 | the hermit who has counted the ships since the founder died (#56's 26) | rock, 105 squares at the isle's east end |
| The Tide Ship | F6, and aboard | the hold's two kinds of cargo; Hale in the last row; the papers on Wenna; the Stone in the forward hold, with its Rift (DESIGN §9, STORY, MONSTERS §6.2); every name in the column (#56's 27) | a planned wreck at 182,188, its plate at 208,192 |
| The Dead-Drop | below the hold | the Compact's orders come from there; three third-prestige quests go down (#22, #19) | a planned dungeon at 208,204, band 26–28 |

### 4.1 The briefs

As Saltreach's (docs/areas/saltreach.md §4.1): drafts for the owner, each settled in its issue,
with the pay shared out over the isle's four maps (§8). Both boxes are core, so each is held to the
Foreland map's density.

### 4.2 E6, the moor and the landing (#187): core, band 12–13

- **Purpose.** Where the boat puts in: the landing, the smugglers' huts, the heather moor above,
  and Kelp Hole's mouth in the cliff. The isle's gentlest groups are nearest the landing, and the
  crossing line meets the company on the stage (#166).
- **Landmarks.** The landing stage at 152,172 and the huts round it; the moor rising north and
  east; the cliffs with the gulls; the cove's mouth at 154,170.
- **Points of interest,** about eight features and eight groups:
  - the landing, and the boat back to Saltmouth (#164);
  - the smugglers' huts, and the cache under one hut's floor;
  - the cove's mouth, the way into #188;
  - a cairn on the moor's crown (#45), a camp in the lee of the cliff (#45);
  - a lookout on the west cliff, with Saltmouth across the water;
  - a shrine the Tidefolk left, its bowl full of shells (#45).
- **Encounters.** Wrack gulls in eights on the moor and the cliffs (two groups); Wrack smugglers
  with their bowmen on the paths (three groups); bilge rats in the huts.
- **Quests.** The chapter's first entry (§5). The Captain's Brother starts here with the captain,
  who will not meet the company's eyes (§6).
- **The secret and its hint.** A smugglers' cache under a hut's floor, with a Compact knife in a
  Helmstow coat and the crews' pay in faceless coins. The hint: the gulls sit on one roof and no
  other.
- **New here.** Heather underfoot (#162); an area reached by a crossing; the crossing line said on a
  landing stage.
- **Finds.** A Long Bow +1 in the cache.
- **Pay.** About 1,600 xp a member.

### 4.3 Kelp Hole (#188): dungeon, two levels of 16×16, band 12–14

- **Purpose.** The cove where the Compact's crews land the Hand's cargo before it goes out to the
  ship, and the sea cave under it, where the Great Devilfish is fed (MONSTERS §6.2). Smugglers'
  Cove on the atlas; Kelp Hole in the sailors' English (§10).
- **Landmarks.** The upper cave: crates under the customs seal on the ledges, the crews' fires, an
  overseer with the chained. The sea cave: pools, kelp on the rocks, and the Great Devilfish at
  the back with the boy who feeds it.
- **Points of interest,** about seven features and eight groups a level: the crates and their
  seal, the crews' fires, the chained rows, the ledge down, the pools, the flooded passage.
- **Encounters.** Smugglers and bowmen on the ledges (three groups); an overseer with the chained,
  the first sight of the Hand's grey hands; devilfish in the pools (two groups); the Great
  Devilfish, boss, level 14, size 1.9, at the cave's back.
- **Quests.** The Captain's Brother's end: the brother is the overseer (§6). What the Smugglers
  Feed: the boy, and the choice (§6).
- **The secret and its hint.** A flooded passage from the sea cave to the isle's east shore, a way
  out and not in. The hint: the tide-mark on the cave's wall stops short of the roof at one place.
- **New here.** The devilfish, a new family (#231); a boss that is fed.
- **Finds.** The crews' strongbox: a Plate Mail +1, the first plate with a plus on the road.
- **Pay.** About 2,400 xp a member.

### 4.4 F6, the east rocks (#189): core, band 13–14

- **Purpose.** The moor's rocky east end, the hermit who has counted the ships since the Compact's
  founder died, and the Tide Ship riding at anchor below the cliffs.
- **Landmarks.** Heather rising to rock; the hermit's cell on the point; the ship seen from the
  cliff top by day, low in the water; the way down to the boats that row out to it at night; the
  cairn on the point.
- **Points of interest,** about eight features and eight groups:
  - the hermit, and the founder's last letter (#56's 26);
  - the cliff top, and the ship below it;
  - the boats, the way into #190 at night (`when`);
  - the cairn on the point, and the grave under it;
  - a bandit den in the rocks, the smugglers' watch (#88);
  - a camp in a hollow (#45), a shrine on the shore (#45).
- **Encounters.** Bilge rats on the shore; smugglers and bowmen at the den; gulls on the rocks;
  devilfish in the pools under the cliff at night.
- **Quests.** The Hermit of the East Rocks (§6). The chapter's entry: the ship at anchor (§5).
- **The secret and its hint.** The founder's grave under the cairn on the point, with his seal.
  The hint: the hermit's count starts at a date.
- **New here.** A den on an isle; a dungeon boarded at night and not by day.
- **Finds.** The founder's seal, a quest item the Compact's hall takes (#182).
- **Pay.** About 1,500 xp a member.

### 4.5 The Tide Ship (#190): dungeon, three decks of 16×16, band 13–14

- **Purpose.** The act's second dungeon and its heart: the smugglers' ship whose hold carries
  shards and people bound below (DESIGN §9, STORY, MONSTERS §6.2). Boarded from F6 at night.
- **Landmarks.** The weather deck at night, with the rail and the boats; the lower deck, the crews'
  quarters and the captain's cabin with the ship's papers and its log; the hold, the chained rows,
  the beam carved EVERY SHARD IS A STEP, the shards in straw, Hale in the last row; the forward
  hold, bulkheaded off, the Tide Stone glowing through its sacking with its Rift round it; the
  hatch down to the Dead-Drop.
- **Points of interest,** about seven features and eight groups a deck: the rail, the boats, the
  hatches, the cabin and its papers, the log, the rows and their chains, the beam, the Stone, the
  hatch.
- **Encounters.** The deck: smugglers and bowmen on the rail, devilfish coming over the side (two
  on the ship's waist at night, with a bowman on the rail: MONSTERS §6.2's second fight). The lower
  deck: bilge rats, the crews. The hold: two overseers behind four smugglers among the chained rows,
  the chains holding the front row while the bowmen shoot the back (#160, #161). The forward hold:
  the Tide Elder, and the Warden of the Tide, boss, level 14, over the Stone; the tear closes when it
  falls. No machine is met aboard (MONSTERS §2.2; #158).
- **Quests.** Every Name in the Column (§6); the papers, the log and the Stone (§5). Hale is freed,
  not handed to (#43), and his sergeant's token is known to him (#56's 20, #156).
- **The secret and its hint.** The forward hold's bulkhead has a second way through, a shard-cut in
  the planking behind the straw, for a company that cannot take the door head on. The hint: the
  straw is fresh on one side and old on the other.
- **The stair down.** A hatch in the hold's floor, a smell of clean cold air, and a line that says
  what is below is not for a company that came for a Stone. It opens; what is down it is #22's,
  and until that is built it lands on one room of 26–28 country with a way back up: a warning, not
  a wall (EXPANSION §5.2, #22).
- **New here.** A ship as a dungeon, three decks; a boss that closes a tear on a ship; the first
  door into the hull's depths.
- **Finds.** The Tide Stone (a quest item, plain: #151, call 6); the ship's papers and its log
  (letters read from the pack, #76); the captain's Cutlass +2, named.
- **Pay.** About 3,200 xp a member.

## 5. The one quest here

Wrackholm's chapter is The Stone Carried Home (`chapter.ts`, #191), joined after Saltreach's; it
closes Saltreach's goal, and the zone's one step (EXPANSION §5.8) is the Stone found. Its entries:

- **The cove's crews** take their orders from below, and the crates carry the Helmstow customs
  seal; the goal points east along the moor to the ship.
- **The ship at anchor,** low in the water, boarded by night.
- **The hold:** two kinds of cargo, Hale in the last row, four words carved on a beam; the papers
  in the cabin, which say the girl from Gullwick was delivered below, months since, through the
  dwarves' deepest mine.
- **The Stone found,** glowing through its sacking, its Warden over it.
- **The Stone home:** back by the boat and the fen to Stienwierde, set in its socket; the Hearth
  burns steadier than it has since the Queen died (#168), and in the dark temples behind, something
  begins to sing (#175's `until`). The goal then turns east, to the Sunder, where the papers can be
  read (docs/areas/sunderwood.md §5).

The Stone is a plain quest item; the words carry the weight (#151, call 6). The chapter spends no
lock (call 1): the boat sails both ways for the fare, and a company that boards the ship before it
has seen the temples reads the journal true. The walkthrough plays it at 12, 13 and 14, in order
and with the ship boarded first.

## 6. Side quests

#56's four for Wrackholm, all taken by the owner on 28 September 2026 (#151, call 13), each built
with its map on the systems of #76 (#192):

| # | Quest | Level | Where | What it needs | Built in |
|---|---|---|---|---|---|
| 25 | The Captain's Brother | 13 | the captain at the landing (E6); the overseer in Kelp Hole | a letter read from the pack; `after` (#41) | #187, #188 |
| 26 | The Hermit of the East Rocks | 13 | the hermit (F6); the Compact's hall or Tallis, in Saltmouth | a letter; a hand-in at the first meeting (#43) | #189, #182 |
| 27 | Every Name in the Column | 14 | the Tide Ship's hold | the Cargo Ledger read against the rows; a choice put by a person | #190 |
| 28 | What the Smugglers Feed | 14 | Kelp Hole's sea cave; the mother in Saltmouth | a choice; `after` | #188, #177 |

No change to #56's drafts. 26 is the Compact's line's first proof, taken at the harbour tavern
(#182, DESIGN §10.2); 27's sending decides who is at Rime Lodge to meet the freed (#56's 41, Act
III).

## 7. Encounters, and what is new

MONSTERS §6.2 has the roster and the fights: the Wrack Gull, the Bilge Rat, the Wrack Smuggler and
the Wrack Bowman, the Ashen Overseer, the Devilfish and the Great Devilfish, the Tide Elder and the
Warden of the Tide; the hold, and over the side. Their drawings are #193's, nine issues (#231 to
#239). Wrackholm spends none of MONSTERS §3.3's asks of its own: it spends Saltreach's.

New in Wrackholm, for the novelty check (EXPANSION §5.4): the devilfish, a new family; heather
underfoot (#162); an area reached by a crossing (#164); a ship as a dungeon; the Hand's overseers,
grey to the wrist (MONSTERS §12); a boss that is fed; the first door into the hull (#22). Its
landmarks: a landing, a sea cave, a wreck.

## 8. The numbers

- **Experience.** The curve (EXPANSION §5.2, #159) asks the climb from 12 to 14 over 0.75: 7,400 /
  0.75, about 9,867 xp a member, with today's `xpForLevel`. The isle is small, two boxes for a band
  two levels deep where Saltreach has nine, so its dungeons carry more of the budget than
  Saltreach's do: E6 1,600, Kelp Hole 2,400, F6 1,500, the Tide Ship 3,200 and the four side quests
  about 900 between them, about 9,600. What is short the curve reports as owed to #154 until the
  maps exist; the Compact's rank quests (#182) and the crews that come back make it up in play, and
  MONSTERS' open question 4, what a fight is worth from Saltreach on, is settled on the first box
  built.
- **Gold.** Training six members from 12 to 14 costs about 6,000 with today's `trainPrice`; the
  hold's strongboxes and the crews' drops pay it, and the isle has no shop to spend it in until the
  boat back.
- **The gate.** Each map at its own floor (docs/areas/thornmark.md §9, 17): a company at 12 wins nine
  in ten on E6 and one at 10 no more than one in four; the Great Devilfish is won about half the time
  at 12 and nearly always at 14, the Warden of the Tide the same.
- **Density.** Both boxes at the Foreland's floor (EXPANSION §5.3).

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
- **The pay's shares** (§8), the dungeons heavier than Saltreach's.

## 10. Names

Wrackholm's names are the sailors' English, the tongue that named Brandy Hole and the Wyke, and
stay: Wrackholm, the isle of wrack (weed and wreckage both); the Tide Ship; and Kelp Hole for
Smugglers' Cove, which NAMES §1 counts a bare description, a sea cave with kelp on its rocks in
Brandy Hole's pattern. The Tidefolk's tongue (docs/areas/saltreach.md §10) names nothing here: the
isle is the Compact's, not theirs. The Dead-Drop keeps its name until #22 says otherwise.

## 11. What was cut

- **The scraps** of shore in the boxes round the isle: E5 (74 squares), F5 (69), F7 (57) and E7
  (34), 234 in all and every one walkable, shingle and grass at the water's edge. Each goes with
  its box's edge where E6 or F6 reaches it, and the rest stays void: a strip of beach with nothing
  on it (DESIGN §1).
- **The Dead-Drop** below the ship, which is Phase 4's (#22): this act builds the hatch and one
  room, no more.
