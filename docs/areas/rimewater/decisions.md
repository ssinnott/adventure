# Rimewater's decisions

Rimewater's decisions (EXPANSION §8.2): the old §9 of its doc, `docs/areas/rimewater.md`, moved here
whole by #1027, every list in its order. The naming pass that stood at its end is §10, whose heading
#929 dropped, and it stands in the state under that heading again. It is appended to and never
rewritten: a builder adds a list at its end, and a later decision that changes an earlier one says
which. Its current state is `docs/areas/rimewater.md` and its plan `docs/areas/rimewater/plan.md`.

## 9. Decisions

Decided by the owner's delegate on 2 October 2026 (#434), and followed here:

1. **The sealed bay's door is Act III's one story lock** (call 4): its flag `q_wenna_up` is set
   when Wenna comes up on the fourth night, the door opens for a company that has met her, and it
   is declared in `content/locks.ts` and in §5 (#440).
2. **Rime Lodge's hall is the Lanterns' fourth** (call 5): DESIGN §8's three become four. The
   lodge-keepers who hold the ice-hole open are Lanterns; the hall sells tier 7, teaches the
   Lanterns' skills, Linguist among them (#538), and gives their quests. The four nights are a flag
   a night, set by resting at the lodge's inn, each night's arrivals a once-event keyed on its flag,
   the tallyman and six knockers on the fourth and Wenna the last one out after them; the chapter
   asks the company to stand the nights.
3. **The Sleepers' Bay is a dungeon on the atlas** (call 6): id `sleepers_bay`, band 21–22, under
   Loch Fuar at about 352,284, entered from the ice; two levels of 16×16, the stair under the ice
   and the bay of beds, the Matron in the last row. Wenna opens the door and waits at it, no
   hirelings, and speaks when the company comes back up.
4. **Glacier Foot is cut whole** (call 7): none of its boxes laid, void until Phase 1.6. #56's 43
   ends at the glacier's edge in Loch Fada, M9's east, where the guide marks the way into the void.
   The reach's bands are the cap's, the Ice Caves at 30–32 and not the atlas's 20–22, written here
   and in MONSTERS §12.
5. **The Lanterns' fourth rank opens at Lantern Watch and Rime Lodge** (call 8, #439): built as
   the Luminary asks at every Lantern hall, the goals naming these two to report at (§6).
6. **The drove road's coach runs Kilnhaven ↔ Rime Lodge** (call 9, #539).
7. **The cuts stand, and the country behind was parked** (call 10): §11, and #497; all seven boxes
   are built since (§4.8).
8. **All of #56's 40 to 44 stand** (call 11), with 43 ended at Loch Fada's edge and 40's coach found
   stopped on Cairnmoor's N8.

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.8: each box's landmarks, points of interest, encounters, secret and
  hint, finds and share of the pay.
- **The core** is M9, K9 and K10, the boxes that hold a step; L9 is country, and the seven behind
  are built (§4).
- **L9 is laid in Loch Fada,** all of it, so Loch Fuar begins at K9 and K10 and the crossing line
  falls at L9's west edge (§4).
- **The ice-hole is on M9,** a few squares out from the lodge's lake wall, the inn yard's door its
  second way between town and box as the Keel's cellar is Saltmouth's (docs/areas/saltreach.md
  §4.9), so that the fourth night's fight is placed on ice. The way the sleepers came up runs on
  under the ice from the hole to the door and is theirs, not the company's, which reaches the bay
  by the door Wenna opens (#486, #490).
- **The nights are rests at the inn,** four flags in order (§4.3); whether a night asks the clock
  past midnight as well was #487's to settle, and it asks none (#487's 2).
- **The bay's two levels,** the stair and the beds, with the back door in Kiln-script that opens
  for nobody and is no lock, the Mines' CREW ONLY's precedent (#490).
- **The band's top** on K9 and K10 (§7): both 21–22 with bear pairs, or a cat at 22 (#491, #495).
- **The shares** (§8), and the gap: raise the road's shares to the curve, or unpark part of the
  country with the act.
- **The bands on the atlas's rows** (`src/content/areas/rimewater/atlas.ts`): Loch Fada 20–21, Loch
  Fuar 21–22, Rime Lodge 20–22, the Sleepers' Bay 21–22, Glacier Foot the reach's. They are set
  there already, where only the scaffold reads them, for a box's draft; the owner's word changes
  them there.
- **The names** (§10), for #435.

Decided by delegate for #539, each the owner's to overturn (docs/areas/kilns.md §9 has the rest):

1. **Rime Lodge owes the coach its landing and its seller** (#487): the yard's square, on its end of
   `DROVE_COACH` in `content/crossings.ts`, and a coachman whose `passage` is `sells('rime_lodge',
   DROVE_COACH)`. Once Kilnhaven lands too, the check wants both ends to sell it.
2. **The run is 250 gold and a day,** leaving either end at 6 and landing at 12 the next day, by
   Rime Lodge's floor of 20, the dearer end's. No guild halves it.
3. **The Coach That Did Not Come stops one coach, never the run:** the coachman sells whatever 40's
   flags say, since no crossing waits on the story (EXPANSION §2.2).
4. **The lodge is a way in once the coach runs:** the gate counts its ways out onto M9 as the coach's
   landing (#164's `landings`), so the groups nearest them are held to the zone's gentlest (#486).

Decided by delegate for #535, each the owner's to overturn:

1. **The furrier sells seven, a hunter's and a guide's:** an Ice Axe, a Skinning Knife, a Hunter's
   Bow, a Bear Spear, a Guide's Staff, a Bearskin Coat (12) and a Fur Robe (11), a point of blow
   past the Kilns' finds for every class and the medium wearers' and the casters' armour step. No
   shield: plate's wearers step at 22 instead, with the bay's Plate Mail +4, as the Kilns' doc has
   it (docs/areas/kilns.md §9, #535's 3).
2. **The finds by 22 go where the briefs ask a piece of the step:** the lost guide's Ice Axe +1 in
   M9's hollow, a drover's Skinning Knife +1 in L9's strongbox, the drowned smith's Bear Spear +1 on
   K9, the Lantern's Guide's Staff +1 under K10's lamp and the bay's two, a Hunter's Bow +1 and a
   Plate Mail +4. K9's named blade and the sleepers' ring stay off the ladder, their boxes' own.
3. **A box names its find, and the ladder keeps the id:** the bay's two are "named pieces" and K10's
   a Lantern's, so their names are their boxes' to give, the ids the ladder's.
4. **The ladder's top is 22,** Rimewater's finds, so the Whitespine's floor wears the act's last
   step, and the harness's what-if grows gear past it.

Decided by delegate for #496, each the owner's to overturn:

1. **The rooms are §4.3's six, which are the issue's:** the inn, the Lanterns' hall, the temple, the
   furrier, the provisioner and the trainer's yard. The coachman sells the coach in the yard as a
   person with no room, as Kitto sells his boat on Saltmouth's quay.
2. **The ids are `rime_` and the business,** as Lantern Watch's are `watch_` (`watch_hall`), since
   "lodge" is Deepthorn Lodge's as well; §4.3 gives them for #487 to name, and each scene's file is
   named for its id, as `tools/changed.ts` reads a room by its file.
3. **The temple is the hill folk's, not the Lanterns':** a healer's house round a stone with a cup
   in it, snow in the cup, as the moor's shrines are (docs/areas/cairnmoor.md §4), since 40 sends
   its sleeper to the Lanterns' hall or to the temple's healer, two hands and not one.
4. **Tier 7 is on the shelves, and not lettered:** the hall's case shelves the spells by tier, a
   brass plate with each shelf's number from 1 at the foot to 7 at the top, where a few new books
   stand. No spell's name is written.
5. **The inn shows the ice-hole's fire, never the hole:** the hole is M9's, out on the loch (§4.2),
   so the yard's door shows the fire far off through its glass, smoke by day and its light on the
   ice by night, and lets the snow in under it.
6. **What the rooms share is in `lodge.ts` beside them,** as the Kilns' towns share theirs: the
   logs, the pelts, the frost on the glass and the loch through a window; what one room alone draws
   stays in its scene. The trade helpers are borrowed as they stand: the Lanterns' bookcase, the
   yards' butt and rack and the shops' flask.
7. **Every room lets the day in,** by a window, the door's glass, the temple's smoke hole or the
   open sky, so nine at night is not noon.
8. **The yard looks east to the glacier** over the stockade, as M9 has it on its east edge (§4.2),
   drawn plain, snow on every face: the bare face is M9's hint for its hollow, and stays M9's.
9. **The furrier shows its seven:** the Bearskin Coat on its stand, the Fur Robe on its peg, the
   Bear Spear, the Ice Axe, the Hunter's Bow and the Guide's Staff racked and the Skinning Knife on
   the block by the fleshing beam (#535).

Decided by delegate for #495, each the owner's to overturn:

1. **The keepers are mannequins in the vessel's plate:** too tall and too thin, the knockers' grey
   plate on their ball joints, a waist of rings and an egg of a head with two soft lights and no
   mouth; people in outline and nothing else, so a company knows the walk again under a robe.
2. **Too many fingers is six to a hand, eight to the Matron's,** long, jointed and lit at the tips,
   the sleeping touch's light; now and then a keeper's hand comes up to touch.
3. **The keepers carry the chisel's mark,** the knockers' lozenge on a stem beside the chest's seam,
   by docs/areas/kilns.md §9's rule (#472's 3) and the same drawing (`chiselMark`): every hand of the
   vessel is marked, and the Abbot's robe will fall open on it.
4. **The Matron is a keeper in a matron's shape:** the tallest, stooped, a starched cap and an apron
   of pale plate, a second pair of arms folded over it. One frame, a Build to a kind, and a robe goes
   where her apron does, so a brother is a Build and a robe.
5. **The Bay Keeper mends the most hurt of its group one turn in four,** and its touch sleeps at 0.3:
   at one in two the harness broke off a fifth of the days of four keepers at fifteen rounds, at one
   in four 3%, in fights of 7.6 rounds (300 seeds). On #541's line, 248 hit points and 4d8+2 where it
   had 227 and 3d7+5, one in four breaks off 17%, for #490's gate to weigh.
6. **The Matron does not mend:** her mend is 20 of her 1,145 (1,299 on #541's line), a blow lost, and
   at a quarter of her turns it lifted a company's odds at 20 from 74% to 86% (88% with two keepers by
   her). §4.6's boss that mends is #490's to give her.
7. **The Matron is on the boss line at 22, for #490's gate to tune,** as the Foreman is #462's: won
   74% at 20, 86% at 21, 94% at 22 and 98% at 23 (300 seeds), where #490 asks about half at 21. On
   #541's line, 1,299 hit points and 22d8+27 where she had 1,145 and 20d8+21, 45%, 59%, 78% and 90%.
8. **The cats are posed from a table** of where the body, the head and each leg's joints stand, the
   tufts, the ruff, the tail and the paws in the Build: the lynx at the top of its leap, and the
   Wold's lions a Build and a stalk of their own. The lynx leaps at the back row as flyers reach it.
9. **The Ice Pike comes up through a hole it broke in the ice,** its body dark under the ice behind,
   a bill of a head with one gold eye, spotted: the long bodies' frame takes a straight thrust, a
   head tipped up, the bill, the spots and the body under the ice.
10. **The Tallyman is a knocker that counts:** slate-blue, its front lifted to the company, tallies
    scratched over every plate but the mark's, six lights on its cowl coming on one a click, frost
    and icicles from the hole; the knockers' Build takes `count`, `tally` and `rime`.
11. **The Tallyman calls three knockers at a half a turn,** as #537's test caller calls three fodder,
    so the ice-hole's six leave room for one call: a company of 20 fights it 12.1 times to a rest,
    against 14.3 with no call, and wins it from fresh at 18, which is #487's gate to tune. On #541's
    line the tallyman has 314 hit points and 3d7+5 where it had 241 and 3d8+4: the hole is fought
    10.4 times against 13.8, 30% of its days ending in a fight broken off, and is still won from fresh
    at 18.
12. **The Ice Bear is the bears' frame long in the neck,** low in the hump, the head small and the
    muzzle long, white with black claws, lifting its head to the wind. The roster gives the ice
    things no element, so cold stays an answer here.
13. **Each is today's test monster at its role and level, and none carries gold:** the levels past 16
    are #541's to make again, and all six move with them; the machines' parts are their boxes' to
    add, as the knockers' are #462's. #541 re-stated them: the pike and the lynx 288 hit points and
    3d7+5 where they had 239 and 3d7+4, the bear 570 and 5d7+7 where it had 518 and 4d8+6; the
    tallyman, the keeper and the Matron as 11, 5 and 7 say.
14. **No seventh drawing:** the cats get no elite at 22 for the pass, and K9's and K10's top stays
    #491's (§7).
15. **Each is owed to the box that first places it:** the pike, the lynx and the bear to #486; the
    keepers to #490; the tallyman to #487, whose fourth night holds its fight though the hole is on
    M9's ice (§4.2).

Owed elsewhere: MONSTERS §7.3 has anyone asleep a sleeper to the keepers, and nothing in the combat
lets one leave a sleeper be or tend it; it is the systems lane's to build if it is wanted.

Decided by delegate for #486, each the owner's to overturn:

1. **The way in is the notch's landing, 22,8, facing west,** the box's start and no exit; the way
   back up is 23,8 beside it, onto N8's 1,28 facing east, so that neither landing is an exit, as
   L6's gate and the towns' ways back are.
2. **The notch names the land in its own label** (N8's `NOTCH`: "Down through the notch to the
   frozen loch. Loch Fada."): `World.move` returns on an exit before it says the crossing (#166), so
   a jump says neither the name nor the warning, and a company under 20 is not warned on the way
   down. A small change in `World.move` is the systems lane's to make; the crossing words stay on
   Loch Fada's atlas row for L9's seam. Overtaken: a jump now says the crossing line after its label
   (SLICE, the line at a border), so the label is "Down through the notch to the frozen loch." and
   the loch's name and words follow it.
3. **No road crosses M9's north edge** (M8 was parked): the atlas's road comes down the north-east
   diagonal, but here it starts at the landing under a cleft of the fells. The edge is the
   Rimefells, closed but for grass and pines at columns 0 to 4, and the north-east corner mountain,
   the shoulder that meets N8's.
4. **The gate, 18,8, is `GATE` and the lake wall's door, 13,10, `LAKE_DOOR`,** the inn yard's door
   onto the ice: drawn shut in the lodge's wall, with `m9_gate` and `m9_lake_door` for the town to
   drop. They lead to `rime_lodge` 14,8 and 7,14, guesses #487 may move; the ways back land on 19,8
   and 13,11.
5. **The coach yard is an event, as L6's was** (`m9_yard`, 20,7): the coachman and the coach's
   landing are the town's (#487; #539's 1, §4.3), as Kilnhaven's end is its town's. Nobody on M9
   sells passage, and `crossings.ts` owes nothing to #486.
6. **The loch's head is ice** from under the lake wall (row 11) to row 20, the ice-hole a ring of
   deep water at 12,14; a causeway at row 16 carries the drove road over it, then down the west
   shore and out at 0,20, where the atlas's road crosses. South of the ice the loch is open water.
7. **The atlas's farm at the loch's head and its mountain spur are redrawn:** the lodge's walls, the
   ice and the hills over the loch; along the east, ice at the glacier's foot (columns 26 to 28)
   under a mountain wall (29 to 31), closed against N9 (call 7) but for the pines at rows 9 and 10
   (§9, #497's 13).
8. **Seven groups for the brief's eight,** the fourth night's being #487's: snow lynx, four to a
   group, in three (by the landing, the gentlest; under the fells; south-east); ice pike, four, in
   two under the ice; ice bears, two, in two at the glacier's edge, the hardest. The harness gives
   9.6 fights to a rest (aim 8 to 10); groups of three gave 12.2.
9. **No floor is lowered:** the bear at 21 is the band's top over its floor 20.
10. **Two under, past 10, is judged by the day (#851), not by the fights won** (`longmere_m9` and
    Rimewater were rows of the gate's `OWED` until then), as for every Kilns and Cairnmoor box: a
    company of 18 wins every fight in the act's gear.
11. **The milestone, 21,8, reads RIME LODGE 1, THE PASS 9:** the pass is 119 squares along the
    roads, to the high pass's link at 334,302, and 9 at 13 to the unit; the gate is 3 squares on,
    under a unit, so the stone says 1, the least it can (N8's notch fixes the landing 4 from it).
12. **The secret is §4.2's, not the issue's:** the hollow behind the glacier's bare face, hinted by
    `m9_glacier` and the lodge-keeper's "the glacier gives nothing back"; rock beside it so no
    climber reaches it over the glacier's mountains. The issue's fishing hut and cache are cut
    (§11).
13. **People, lines only, and no names:** a lodge-keeper at the hole's fire, a Lantern; a man on the
    shelf of ice under the hole's lip (#56's 41); a guide at the glacier's foot with her half-built
    cairn (43). #494 builds the quests on them.
14. **#45's three are the Lanterns' lamp by the gate** (a shrine, personality), **a cairn at the
    fells' foot** (320 gold and a great spell-point potion) **and the shore camp.** The lookout
    looks south down the loch's length: the loch runs south here, not west as the brief has it.
15. **Novel claims the cats and a group on ice** (`families: ['cats']`, `mechanics:
    ['encounter:under']`): snow and ice are Cairnmoor's. No landmark is claimed, the lodge's site
    staying planned for #487.
16. **The area's rooms, monsters and items come with it:** the six interiors leave `ROOMS_AHEAD` for
    the Area, the monsters `AHEAD` and the items `ITEMS_AHEAD`; those three lists and `PLANNED`
    stand empty.
17. **The climate is invented, colder than Cairnmoor's:** summer 10, winter -10, a daily swing of 6,
    damp 0.03 to 0.08, the wettest day 320, fog 0.5, lag 12.
18. **The reach holds no step:** the quest-step check skips the pillars' `REACH_ZONES`, Glacier Foot
    being a zone of a listed area now and §5 exempting it (DESIGN §9).
19. **A way taken between two zone maps is walked as a step** in the outdoors' reachability check;
    the "no exit joins one zone to the next" check names the notch's two ways, and the atlas's "exit
    and arrival are neighbours" check lets an exit take one of the atlas's own links between its
    ends.
20. **The Cairnfield is held in M8 by seeds** (laid since, #484; M9's north-west corner is walked from it) along its south edge (y 253, x 392 to 423,
    `cairnmoor/atlas.ts`): laid whole, M9 seeded Loch Fada up the Rimefells into most of M8. N9's
    north-west corner (x 424 to 426, y 254 to 259) goes from the Cairnfield to Loch Fada and is left
    so, N9 being Rimewater's (§4.8); N9, built, is laid whole in Loch Fada (§9, #497's 12 and 15).
21. **Pay is the gate's, not the brief's:** 3,754 xp a member against the issue's 1,500 and §8's
    scaled 2,650. Rimewater stands at 3,754 of 16,267; with §8's scaled shares still to come, about
    13,650, at about 17,400, under 1.4 times the ask (22,774), so no group is cut.

Decided by delegate for #487, each the owner's to overturn:

1. **The nights are the inn's `nights`:** a stay sets the first of `night_1` to `night_4` not yet
   set, so they come in order (`stayNight` in `src/game/party.ts`, called by the inn's screen).
   Nothing set a flag on a rest before; the issue carries the systems lane.
2. **A night asks no clock past midnight** (the question §9 left for #487): a stay always sleeps to
   morning, so a stay is a night.
3. **Each night's arrivals are a once-event on 6,12,** the yard square outside the inn's door, the
   only way out of it, each standing until the next night is set: the square never says more than
   the log's four lines, and a company that stays twice without going out misses the first's words,
   never a flag.
4. **The hole's fight is on M9 at 12,13, `m9_night_4`,** on the ice over the hole (deep water at
   12,14), after `night_4`: a guardian, with no respawn, `roams: false` and a `slainText`. The group
   takes M9's prefix, since a zone map's ids share the outdoors' state.
5. **"The fire at the company's back" is staging, not a mechanic:** the keeper's fire at 14,14, east
   of the hole, and a company out of the inn's fourth stay fresh, as the gate judges it, one group
   and its call from fresh.
6. **The six knockers stay the Kilns' at 16:** the curve test now reads a caller's retinue (the kind
   its `calls` names, in its own group) at its own level, as it reads its calls, so the band check
   and the rise take the group's level from the tallyman, 20. No new def; no monster's level moved.
7. **Wenna is "A girl out of the hole" on M9 at 12,13,** there once `longmere_m9:m9_night_4` is
   slain, lines only (§4.3's line and §5's "two hundred more ... The doors know me."), setting
   `q_wenna_up`. No `until`: the door (#489, #490) and the lodge after the bay (#492) move her.
8. **The gate says §4.3's gate line going in,** as N3's gate says Anvilhall's; the lake door says
   the yard; the first step inside the gate, 13,8, says the stockade.
9. **The arrival squares stay M9's** (14,8, the town's start, facing west; 7,14, facing north): the
   town was laid round them. The ways back land on 19,8 facing east and 13,11 facing south, neither
   an exit.
10. **The coach lands in the coach house inside the gate,** 13,7 facing west, with a landing line;
    the coachman at 14,7 has `passage: sells('rime_lodge', DROVE_COACH)`, which sells nothing until
    Kilnhaven writes its landing (#469), and speaks of the overdue coach (40) either way.
11. **The hall is "The Lodge's Lantern Hall",** the Lanterns' (`hall: 'lanterns'`, so it teaches
    Linguist as every Lantern hall does), `maxTier: 7`, fee 500 (Thornhold's 200 at the fourth
    tier, the Watch's 400 at the sixth).
12. **No guild quest is added:** §6's first task, "keep the hole's fire a night", would be a second
    rank-0 Lanterns quest, and `rankOf` asks every quest of a rank, so every company that did
    Helmstow's first task would stay a stranger until Act III. It waits for #439, with the fourth
    rank's. Settled by #439: the hole's fire is dropped, the hall gives the ladder's own first task
    and the asks are the Luminary's, offered here as at every hall (§6; docs/areas/kilns.md §9,
    #439's 2 and 3).
13. **The rest of the town:** the inn "The Thaw" at 45 a member (Anvilhall's 35 at 16, the Watch's 30
    at 14); the temple "The Healer's House"; the furrier's the seven of `FURRIER`; the provisioner's
    Anvilhall's stores' list; "The Trainers' Yard" to 23 (the band's top plus one, as the check
    asks).
14. **No prestige trainer:** §4.3 places none at the lodge.
15. **People, lines only and no names, as M9's:** the coachman (40's coach overdue), a lodge-keeper
    (a Lantern), a stonecutter down the drove road (39) and a lodge woman whose people are under
    Fuar (42). The guide of 43 is not placed: M9's is already back from the glacier, so the lodge's
    guide before she goes is #494's to stage with 43's flags.
16. **No novel landmark is claimed:** the lodge's icon is on the road before (Deepthorn Lodge), and
    the check refuses it.
17. **The Kilns' first-machines rule is read only as far as the Kilns** (its walkthrough), since the
    hole puts machines on M9.
18. **Pay: no group is cut** (§8): 4,203 xp a member built and about 22,300 projected, under the
    limit of 22,774.
19. **The issue against the doc:** the issue sets the tallyman's fight at the lodge's fire; the doc
    puts it on M9's ice at the hole, and the doc won.

Decided by delegate for #488, each the owner's to overturn:

1. **The road keeps the atlas's line,** out by the south edge at 6,31 and 7,31 and on across L10's
   corner (parked then, built since, #497) to K10: the atlas's road never enters K9, and the edge
   check holds a map's roads to the atlas beyond its edge (a road out of the west edge failed it, and
   so did closing the south edge). The brief's road west for K9 could not hold without editing the
   shared atlas.
2. **The road was taken from the south edge, not walked** (`PASS`, 6,31, as N8's notch is): L9 and
   K10 met only at a corner, L10 between, parked. It led to `coldmere_k10` at 31,4 (359,290), facing
   west, a guess at the atlas's road at K10's east edge, and was listed in no exits. Built (#491):
   it was listed, the landing the bridge at 30,3 (358,289) and K10's way back landing on 7,31 facing
   north (#491's 1). L10 laid (#497), the road is walked and `PASS` is gone (#497's 10).
3. **No road crosses the west edge:** it is the loch's ice at rows 0 and 1 and pines below, against
   K9 (#489). The crossing line (#166) falls there once K9 is laid in Loch Fuar, and the road on to
   K10 says it; Loch Fuar's atlas row has no `crossing` words yet, so the engine's
   defaults speak until K9 writes them.
4. **Band 20–21, the floor lowered by one from the brief's 21:** nothing on the surface is 22, and
   a band of 21 alone would ask a hardest group at 22 (§7); as N2, N8, O8 and Carn Dubh. The bear,
   at 21, is the top.
5. **The brief's four groups, the lynx five to a group:** snow lynx by the road (20,21, the nearest
   and gentlest) and by the meadow (22,12); ice pike, four, under the loch's ice (5,1); an ice bear
   alone on the ridge's far side (5,24), the hardest. Four lynx gave 11.6 fights to a rest (aim 8
   to 10), five 9.27. The bear stays alone as the brief has it, though it is then the box's
   cheapest fight (29.8 fights to a rest); a pair, as M9's, is the owner's call.
6. **The pike lie off the woodcutters' camp, not by the road:** the atlas puts Loch Fada's water
   along the north rows, 15 rows off the road, so the loch is a walk north of it. The issue's
   narrows are not built (§11).
7. **The loch is ice** (#536) where the atlas has shallow; its deep, 11 squares in no zone, is left
   open water, the lead `l9_open` names, and the pine islet at 3,1 is kept.
8. **The stream** from M9's 0,2 to 0,4 runs from 31,2 to 31,4 to the north edge at 22 to 27,0, where
   the atlas's goes on into L8, Cairnmoor's, built since (#834; the edge check moved it from the
   scaffold's 25 to 28); a frozen ford at 29,1 and 29,2 joins the corner north of it to the box,
   which the density check found unreached.
9. **The secret is the brief's:** the drovers' summer shieling under the drift in the high meadow,
   a 3×3 of building with its door at 24,8, hinted by the posts (`l9_posts`, 25,8, the brief's
   line) on the square before it; inside, the drove's strongbox (1,100 gold and the Skinning Knife
   +1, #535). The issue's hollow pine and trapper's cache are not built (§11).
10. **The drover winters in a stone bothy by the road** (24,26; the bothy at 25 and 26,26) and
    hears the bell under the cold loch (#56's 42), a line only: the drovers' shieling under the
    snow is the secret, so nobody stands at it.
11. **#45's three:** the woodcutters' camp on the loch's shore (6,4), the drovers' stone by the
    road (a shrine, luck, 28,23) and a cairn on the crest (12,21: 300 gold and a great spell-point
    potion).
12. **The milestone at the saddle** (13,27) reads RIME LODGE 4, THE PASS 5, as the brief proposes
    and the walkthrough counts: 58 squares to the lodge's gate, 60 to the high pass's link at
    334,302 along the atlas's road beyond. M9's stone stays 1 and 9.
13. **The lookout on the crest** (10,22) is up a path of hills from the saddle, with the brief's
    line; the issue's shrine to the one who counts is the brief's plain shrine.
14. **Novel claims nothing** (the brief has nothing new here) and **no zone-walk seeds are added:**
    laid whole in Loch Fada, L9 moved nothing the zone checks pin.
15. **Pay is 2,128 xp a member** (10 lynx and 4 pike at 793 each, the bear's 1,667, over six)
    against the brief's 1,300 and §8's scaled 2,300. Rimewater stands at 6,332 of 16,267, Rime
    Lodge's share (#487) built; with §8's scaled shares still to come (K9 2,650, the bay 4,250, K10
    1,950 and the side quests 1,600: 10,450) at M9's ratio of 1.42, 14,840, it would stand at about
    21,170, under 1.4 times the ask (22,774), so no group is cut.
16. **Two under is judged by the day (#851)** (`longmere_l9`, a row of the gate's `OWED` until
    then), as M9's.

Decided by delegate for #489, each the owner's to overturn:

1. **Band 20–22, the floor lowered by one from the brief's 21:** at 21–22 the curve asks a hardest
   group at 22 and nothing on the surface is; at 20–22 the bear pairs at 21 are the top, as N2, N8,
   O8, Carn Dubh and L9. The atlas row stays 21–22: the zone takes its band from its built map.
2. **The loch is the doc's, laid on the atlas's ground:** the cut holds no lake (§4.5). The north's
   deep stays open water and its shallows are ice; the river is frozen and widened into the basin
   the brief needs. About 115 land squares became ice, and the edges keep the atlas's ground.
3. **The door is `DOOR`, 24,30,** the scaffold's square and the atlas's enter link at 352,284:
   exported, listed in no exits, `needFlag` `WENNA_UP`, to `sleepers_bay` 8,1 facing south, a guess
   #490 may move. It is drawn shut, a `#` in a wall of grey; `k9_door` says the brief's line.
4. **The lock is not signed in:** the pillars check finds locks only on exits a map lists, so a row
   in `content/locks.ts` for an exit listed nowhere fails as closing nothing there. The lock and
   §5's paragraph on it are #490's, with the exit and #440.
5. **The girl out of the hole waits at the door,** on the crack at 24,28 once `q_wenna_up` is set,
   with §5's lines and nothing set; "it opens" is left to #490's exit label. M9's girl takes an
   `until` on the flag (#487's 7): met once, she goes back down, never in two places.
6. **Eight groups, the brief's number:** lynx four times in the shore's pines, pike twice under the
   arm's ice (one over the tower by night) and bears in pairs, the hardest. Five lynx to every lynx
   group gave 7.69 fights to a rest, under the aim of 8; the two far groups at four give 8.54.
7. **Pay is 4,547 xp a member** (18 lynx and 8 pike at 793, 4 bears at 1,667, over six), against
   the brief's 1,500 and §8's scaled 2,650: the brief's eight groups and its figure never agreed. No
   group is cut, the projection at M9's ratio being under 1.4 times the ask (§8).
8. **The smith's iron** (`k9_iron`, 12,18): 800 gold, the Bear Spear +1 and **Lann Fuar**, off the
   ladder: *lann*, the hill folk's blade (not yet in NAMES §2's row) and Fuar, the village the loch
   came up over. A martial blade, 2d10 +6 for 2,000 gold, a sidegrade of the Ice Axe +1; its smith's
   mark is a little bell.
9. **The secret is the brief's:** stones under a clear strip run west from the tower's cap to the
   bank (14 to 19, row 18), `k9_strip` (16,18) says its line, the bank's face is a secret door at
   13,18 and the hole 12,18 behind it. The issue's bell tower door is not built (§11).
10. **#45's three:** a fowlers' camp on the north shore (12,9), a cairn on the old bank (13,16: 300
    gold and a great spell-point potion, as L9's) and a shrine on the south shore (17,25,
    endurance).
11. **The lookout is on a knoll added east over the ice** (hills at 26 to 28, rows 10 to 12, event
    27,11): the cut has no hills east.
12. **The bell tower's cap is a building square, 20,18,** its line on 20,17; the house-place is a
    hearth-stone swept clean at 9,18, above the bank. Lines only: the bell is #494's 42.
13. **Loch Fuar's crossing words are written** on its atlas row, as Loch Fada's: the cold loch
    white below and the land harder than the long loch's shore, two under; black ice that would
    spare no one and the way back east under the pines still open, three under.
14. **The zone's road** (`ROADS` in `tools/tests/gate.ts`, which the gate failed without): the
    lynx by the way in and the lynx at the loch's foot, on the way to the crack.
15. **Core density,** the brief's, not the scaffold's country; **novel claims nothing,** the lock
    and the dungeon from the ice being the bay's to claim when its exit is listed.
16. **Two under is judged by the day (#851)** (`coldmere_k9`, a row of the gate's `OWED` until
    then), as M9's and L9's.
17. **K10 meets K9's south row** and finds the atlas's lake under its own box: K9's loch lies on the
    river that feeds the lake, which lies in K10 and L10 (352 to 368 by 294 to 326). The edge is
    pinned (§4.5, §4.7); the world map paints the atlas's river over K9's ice. Built (#491's 4 and
    5).
18. **The bay makes the door and its planned place one:** `PLACES`' planned `sleepers_bay` stands
    at 352,290 (K10's 24,4), while the atlas's enter link and §4.5 put the door at 352,284 (K9's
    24,30). Harmless while planned; #490 lists the exit, signs the lock in and moves one or the
    other (§4.6, §11).
19. **The bay and K10 together may pay at most about 9,895 xp a member** (§8): the line, 22,774,
    less 11,279 (K9 built and #439's 400) and the side quests' 1,600. Each builder cuts groups of
    its own box, the least valuable first, rather than pass it.

Decided by delegate for #490, each the owner's to overturn (1 to 4 complete #489's door half, the
exit and the lock):

1. **The door is K9's `DOOR`, listed:** in `coldmere_k9`'s `exits`, its square opened (`#` to `D`,
   row 30), `k9_door` dropped, its `blockedText` the reason said at the door. Its landing, the
   bay's 8,1 facing south, is kept: it is still in the ice, and it looks straight down the stair
   (#489's 3).
2. **The way back up is a door in the stair's north wall,** 8,0, onto K9's 24,29 facing north, the
   crack's foot, since a landing is never itself an exit. The girl's lines at 24,28 are K9's,
   untouched.
3. **The lock (#440) is signed in** at `coldmere_k9` 24,30 on `q_wenna_up`, with its what and why
   in `src/content/locks.ts`: Act III's one. §5's "not signed in" is its as-built paragraph now
   (#489's 4).
4. **#440's fixture** is in `tools/tests/pillars.ts`: a fixture exit from a Loch Fuar map into a
   Monks' Vale map shut on `q_wenna_up` fails "a lock between rimewater and whitespine", signed in
   or not, and the atlas's `coldmere`-`monksvale` link given `opens` fails "no way on the atlas
   opens on the story" (that check made the function `storyWays` so a fixture can be held to it).
   The pass itself stays open, and its exit is K10's (built open; the way on into J11 is #499's,
   #491's 2).
5. **The bay on the atlas is the door's square:** `PLACES`' `sleepers_bay` moves from 352,290 to
   352,284 and drops its `planned`, `name` and `band`, as Carn Dubh's did; `sleepers_bay2` stands at
   352,290, six below. No `SITES` row: the secret is found (§10). The atlas's `enter` link is
   untouched (#489's 18).
6. **The stair's band is 20–22, the floor lowered by one:** nothing on it is 22, and at 21–22 the
   curve asks a hardest group at 22, where at 20–22 the first keeper, 21, is its top. The bay's is
   21–22, the Matron's 22.
7. **The names:** the stair is *Under Loch Fuar*, as Carn Dubh's is *Under Carn Dubh* (the place's
   plate does not name the bay), and the bay *The Sleepers' Bay* (§10).
8. **The stair's knockers come in two crews of three tallymen and five knockers,** the brief's two
   groups with sizes past the brief's. A tallyman leads, so the knockers stand at its level (the
   curve reads a caller's retinue so; alone, knockers at 16 are astray in 20–22). At one tallyman
   and five knockers the stair was 15.0 fights to a rest, past the limit of 12.5; at eight knockers
   still 14.0; at two tallymen 10.9; at three, 9.64.
9. **The first keeper waits alone at the stair's foot** (6,12), the brief's: it is 30 fights to a
   rest alone, which the crews above it carry.
10. **The bay's keepers are four to a row, three rows,** past the brief's three a group: at three
    the bay was 14.4 fights to a rest, past the limit of 12.75; at five, 7.3, under the aim; at
    four, 9.16.
11. **The Matron is alone in the last row** (10,3), off the boss line as the Foreman and the Cairn
    King are: 1,900 hit points and 17d8+18, from 1,299 and 22d8+27 (won 79% at 21 and 93% at 23),
    and she mends herself one turn in ten, the brief's boss that mends, which #495's 6 left to the
    bay (at one in four she was easier and the curve flatter). She is won 59% at 21 and 92% at 23
    under the gate's fifteen-round cap; more hit points with a lighter blow broke the fight off at
    the cap.
12. **Pay is 5,455 xp a member,** under the 6,400 the bay may take (§8): nothing is cut. The
    brief's "about eight groups a level" is not met, its own list naming five fights; seven groups
    are built.
13. **Rimewater's owed row loses its xp:** a clear now gives 16,734 of the 16,267 asked, and the
    curve test asks the entry dropped. Gold stays owed, 5,820 of 9,840.
14. **The Matron's part is her cap** (`matron_cap`, dropped always, price 0), as machines carry
    parts and no gold: a loop inside a loop worn in its band, Wenna's family knot, the Mines' mark
    at a girl's shoulder seen again (STORY; docs/areas/kilns.md §9).
15. **The locker's two are named in the hill folk's tongue** (§10; NAMES §2): **Bogha Fionn +1**,
    the white bow (`hunters_bow+1`, *bogha* a bow) and **Luireach Dubh +4**, the black mail
    (`plate+4`, *luireach* a coat of mail). The ids stay, so the ladder's rows only lose `#490`.
    **The sleepers' ring is cut:** no name came that did not tell the secret (§11).
16. **The secret is the brief's:** the path worn up the middle at x 7 runs past the last row to the
    back wall; `sb2_path` (7,3) says the brief's line, the wall is a secret door at 7,2 and the
    locker 6 to 8 on row 1 behind it, with 1,500 gold and the two pieces. Walked, it is reached
    only through the wall. The issue's, a bed with a name the company knows, hinted by the Cargo
    Ledger's column, is not built: the doc wins (§11).
17. **The back door is a wall with a door in it** (legend `Z`, 3,2), as CREW ONLY is: no flag, no
    lock, no exit. The Kiln-script over it, `sb2_back` (3,3), reads COLD STORE. WAKE IN ORDER.
18. **The beds are pillars,** forty, four rows of ten, the path between them.
19. **Novelty claims the keepers** (a family). `inflict:asleep` is on the road before it (the check
    refused it), and a lock or a dungeon entered from the ice is no kind the check knows, so
    neither is claimed.
20. **Two under is judged by the day (#851)** (`sleepers_bay: under`, as K9's, a row of `OWED` until
    then); the bay's own is n/a, its floor being over the area's.
21. **The stair's days end in a fight broken off 42.3% of the time,** recorded and not tuned: the
    gate asks no figure of it, and it is most likely the bot against the mending keeper and the
    crews. The bay's is 17%. Left so that the owner can have it tuned later (§8).
22. **MONSTERS §7.3's Where column says what §7 proposed,** in this pull request: the Ice Bear on
    L9's ridge (#488) and K9's far shore (#489), and the tallyman and the knockers on the bay's
    stair as well as the ice-hole and the Deep Mines. The owner may keep the column as it was.
23. **K10 may pay at most about 4,440 xp a member** (§8): the line, 22,774, less 16,734 (the bay
    built, #439's 400 counted) and the side quests' 1,600. K10 cuts groups of its own box, the least
    valuable first, rather than pass it. It paid 4,311 (#491's 8).

Decided by delegate for #491, each the owner's to overturn:

1. **The way in was L9's `PASS`, its landing moved to the bridge at 30,3,** facing west, from the
   guess 31,4 (#488's 2): the edge check holds the road to the atlas beyond, and the atlas's road
   leaves K10's east edge at 360,289 (row 3), not 290. The way back, `RIDGE`, was the road's last
   square, 31,3, beside the landing (a landing is never an exit), and landed on L9's 7,31 facing
   north. L9 listed `PASS`; both were taken, not walked, as N8's notch is. L10 laid (#497), the road
   is walked and both are gone; the bridge at 30,3 stays K10's start (#497's 10 and 11). The words
   that called the landing a guess are gone from L9's file and from §4.4, §4.7, §9 and §11.
2. **The road keeps the atlas's line:** in over the lake's river on split logs (30,3) and out by the
   west edge at 0,19 only, the atlas beyond 0,18 being pine, so that 0,18 is a hill. Four joint
   squares (26,5; 18,8; 9,12; 7,13) are added so that it runs square to square, and the river is
   moved off the east edge at rows 4 to 6, the atlas beyond being pine (the edge check).
3. **Band 20–22, the floor lowered by two from the brief's 22:** the curve asks the hardest group at
   the floor plus one or the top less two, whichever is more, and nothing on the surface is 22 (the
   bear, 21, is the top); at 21 it would ask 22. As N2, N8, O8, Carn Dubh, L9 and K9. No monster def
   is added. The issue's "gate holds at 22" is the gate at 20.
4. **The north edge is K9's south row square for square** (`ppppppppppppp^,,,,,,,iiiiiiii~pp`): the
   loch's ice runs a tongue three rows into K10 and the river from the lake goes in under it at 29,0
   (§4.5; #489's 17).
5. **The atlas's lake is taken as it is,** its deep water open and its shallows iced (#536); the
   river from the lake to the loch stays open water.
6. **The pass's walls are mountains,** either side of the road west of the mouth, with hills and
   snow beside it: the brief's "two walls of rock" over the issue's "all walkable", the doc winning.
   At the west edge they are the map's ring, so void in the outdoors.
7. **The brief's eight groups:** snow lynx three times (by the bridge, by the lamp and south of the
   pass's foot), ice pike twice under the shore ice (on ice, `under: 'ice'`) and ice bears in pairs
   three times at the top, the roster's question taken as K9 took it (§7), with MONSTERS §7.3's
   Where column for the Ice Bear gaining the pass, as the bay's pull request gave it the shores. The
   lynx are four to a group, not K9's five: one group of five would pay 4,442 xp, over the 4,440
   line.
8. **Pay is 4,311 xp a member** (25,862 over six), under the 4,440 the bay's budget left (§8):
   nothing of the brief is cut, only the lynx groups are sized at four. Rimewater stands at 21,045
   of the 16,267 asked, under 1.4 times it (22,774).
9. **The milestone, 9,13, reads RIME LODGE 9, MONKS' VALE 6,** the doc's figures and true there: 112
   squares along the roads to the lodge's gate and 72 over the pass to the road's end at the monks'
   gate in Monks' Vale (the atlas's enter link to Highcell, 322,342). 9,12 and 9,13 are the only
   road squares where both figures hold. The walkthrough counts it as L9's is counted, `counted`
   given an optional target (THE PASS by default).
10. **The step is `k10_mouth`,** at the mouth (5,15), the doc's line, `once`: the chapter reads it
    by `seen` (§5).
11. **The pilgrims are lines only** (#494's 44): `k10_pilgrims` in the snow below the mouth (9,18),
    one dying; the new graves by the road (`k10_graves`, 13,8) likewise. No person, no flag, no
    quest; the brother and the words are #494's. 12. **The secret is the doc's:** the dark lamp
    `k10_lamp` on the road (16,10), the doc's line, is the hint; its jar-shelf is the secret square
    (16,11) and the cache behind it (16,12, `k10_cache`, the chest `k10_silver`, 900 gold and a
    Guide's Staff +1) is shut in rock, so no climber reaches it. Its line says what is found and no
    more. The issue's waymark in the old script, with a cache under it, is not built (§11). 13.
    **Gold is 1,200:** the cache's 900 and a cairn's 300 (`k10_cairn`, a great spell-point potion,
    as K9's and L9's cairns). The clear holds 6,720 of the 9,840, 7,020 with the ask (#439), which
    the curve's owed row keeps. 14. **Core density,** the brief's; **novel claims nothing:** a
    landmark claim is an atlas site's icon, and the pass is no site. 15. **`ROADS.coldmere` stays
    K9's:** the gate names a zone's road once and did not ask for K10's, and K10's lynx added would
    make the zone's road four fights without a rest. 16. **Two under is judged by the day (#851)**
    (`coldmere_k10: under`, a row of the gate's `OWED` until then), as K9's. 17. **Smaller:** the
    map is named *Loch Fuar*, the zone's, as K9's; the shrine's stat is accuracy, not yet given in
    Rimewater; the trappers' camp is the brief's camp (#45); the cache's staff keeps the ladder's
    plain name, Guide's Staff +1 (#535's 3). 18. **The side quests and the chapter may pay at most
    about 1,729 xp a member between them** (§8): the line, 22,774, less 21,045 (K10 built, #439's
    400 counted). The quests' brief is 1,600. Each cuts its own, the least valuable first, rather
    than pass it.

Decided by delegate for #492, each the owner's to overturn:

1. **The chapter is `sleepers`, The Sleepers,** the working title kept, in `chapter.ts`, joined
   after The Ring since Rimewater follows Cairnmoor in `AREAS`. It is begun on M9 (`visited`), as
   The Ring is on N7, so it begins where The Ring ends.
2. **Nine entries and five goals, as §5 has them.** A night's entry reads the inn's flag, not the
   morning's event: a company that stays twice without going out misses a morning's words (#487's
   3), never a night. The hole and the girl are one entry, on `q_wenna_up`; the door's reads the
   stair reached (`visited` `sleepers_bay`), so it is written only through the door, never before
   the girl. Before her flag the door is the lock's, its reason on it, and the journal says nothing.
3. **The beds set a flag, `q_sleepers_seen`,** as O7's voice sets The Ring's: a condition holds one
   `seen`, and the end asks two, the beds and the pass's mouth. The sleepers' entry reads the beds
   by `seen`; the south's entry and the end read the flag and `k10_mouth`. No system is changed.
4. **The end is the beds and the mouth, in either order.** With the pass taken first the journal
   says nothing of it until the beds, which end the chapter there. The Matron is no step. Nothing in
   the game marks an act, so the chapter's end is the act's and nothing more is set.
5. **The journal leaves the girl unnamed,** as her lines do: a company that carried Hild's name from
   Gullwick (the Shelf's chapter) makes the match itself.
6. **The door's label says the voice's word:** "The door opens under her palm, and a voice in the
   wall says "Captain?" She flinches, and waits at it while you go down.", two lines of the log. The
   journal's door says the word, and every company now sees it: her own lines at the door, #489's
   and untouched, are heard only by a company that talks to her, and the stair's voice is on its
   west way alone.
7. **Back up from the beds she speaks at the door, and then she is at the lodge:** a word of K9's
   girl, `after` the beds' flag, sets `q_wenna_lodge`; K9's girl goes `until` it and a girl by the
   yard's fire at Rime Lodge, 10,13, comes `after` it and goes `until` the company has entered
   Monks' Vale, when she has gone on to Highcell's gate (#504's 8), as M9's girl hands on to K9's on
   `q_wenna_up`. Her `until` on the beds alone would take her from the door before she could speak
   there, so her words set the one new flag. No entry reads it, so nothing she says is written into
   a chapter done. At the door: the two hundred marched on south, under the world, for the mountains
   and the sea (STORY, Act Four); at the lodge: she goes home to her mother when they are brought
   up, not before. She is unnamed in every line.
8. **The south's entry says what is seen,** the two hundred not in the beds and the pass's snow
   trodden, and not her words, since with the pass taken first it is written at the beds, before she
   speaks. Its goal points up the road from Loch Fuar to the pass's mouth on K10.
9. **The chapter pays nothing,** as no chapter does, so the side quests (#494) have the 1,729 alone
   (§8). `tools/tests/quests.ts` drops `longmere` and `coldmere` from `PLANNED` and Rimewater from
   `CHAPTER_OWED`.
10. **The walkthrough, `theSleepers`,** plays it at 20 (the four nights stood at the inn and paid at
    its price, the hole fought, the girl met), 21 (the door) and 22 (the stair's foot, the beds, the
    mouth), in order and with the pass's mouth reached first. The bay's groups are left to
    `sleepersBay`, which wins them; the Matron is not fought, the chapter not needing her. Every
    goal comes up, the chapter reads the same both ways and it ends once.

Decided by delegate for #494, each the owner's to overturn:

1. **The five are `coach`, `wentback`, `icebell`, `sky` and `pilgrims`,** in `quests.ts`, each given
   by its person, finished at its level (40 at 20, 41 and 42 at 21, 43 and 44 at 22) and walked
   every way it is answered. 42's is `icebell`, and its flags `q_icebell`, because `bell` and
   `q_bell` are the Shelf's.
2. **Two titles lose a word:** The Coach That Never Came and Where the Sky Meets Ice. #56's own run
   a pixel past the log's list (173 of 172).
3. **40's hand-in is a note.** The man in the healer's coat by the coach writes it; the coachman
   takes it at the first meeting (#43), pays 200 and sends the sledge, and the two from the coach
   move by `after` and `until`. The question is put at the lodge, so its pay is Rimewater's.
4. **The man in the healer's coat is shown, not named:** salt on his hem, a sleeper for the lodge,
   and back up the road alone. In the healer's house she is out of sight: a person on its one
   square of yard would shut its door.
5. **41 hears either:** Hale's token carried, or the clerk's book read (`seen` its chest). Both are
   reachable, and nothing is taken. A company with neither leaves him silent and 41 open.
6. **42 has no clapper to carry.** The clapper is a once-event by night beside the pike over the
   cap, `after` the woman's ask; the bell's lip is a sign, since a sign wears no presence, read by
   day or night. Her ask waits on 40's answer, as §6 has it. Her pay is a question: out to Fuar, or
   stay.
7. **43's mark is a reading's.** No person can mark the world map, and only a reading's `marks` names
   a place in the void, for a company with a reader. So the guide draws the way in words, and the
   old marks at the ice's edge, beside where the quest ends, put the Ice Caves on the world map once
   read (§11).
8. **43's guide is staged:** by the lodge's gate until she goes up (`q_sky`), then at the glacier's
   foot with her cairn (both `after` it), carried in when met (`q_sky_in`) and at the inn yard's fire
   after. Handing her the map is her one question, and pays. M9's walkthrough finds nobody at the
   glacier's foot before she goes.
9. **44's brother comes once the pilgrims are met,** beside the boy, and is no fight: snow on a
   freezing boy and a hand that does not bleed, with nothing said of either. The monastery's
   pilgrims stand `after` `q_pilgrims_up` (#445).
10. **39 ends at the lodge:** its stonecutter stands `after` `q_faces_home`, so never on the tors and
    at the lodge at once.
11. **Pay is §8's scaled 1,600 a member:** 300 for 40, 41 and 42, 350 for 43 and 44, every answer
    alike. A clear gives 22,645, 129 under the line; gold 7,220 with the note's 200.

Decided by delegate for #497, each the owner's to overturn:

1. **No den (#88) in J9 or K11.** A den's keepers and brood, with the level-21 bears the rise rule
   needs, pace past 12.5 fights to a rest unless the box pays about 1,350 a member. Alone, at 20:
   lynx ×2 25.0, ×3 13.6, ×4 9.2, ×5 6.7; pike ×4 9.5, ×5 6.7; bears ×1 29.8, ×2 8.1, ×3 2.7.
   None of the five boxes after them has one either (#497's 20).
2. **The fewest groups that pass:** J9 four pike and a pair of bears (1,084 a member, 8.81 fights
   to a rest), K11 a pair of bears alone (556, 8.09). Every two-group box under 900 paces past the
   limit (pike ×4 and a bear 14.19; lynx ×2, lynx ×2 and a bear 26.95), and the only one-group box
   inside the aim is a bear pair. The two average 820, inside the 800 to 900 asked.
3. **Band 20–22 as K9 and K10, not the zone's 21–22:** the curve's rise rule wants the hardest
   group at the floor plus one at least, and the roster tops out at the bear's 21.
4. **The shallows are drawn as ice, the loch frozen at its edges as on K9.** J9's east column is
   redrawn to K9's pinned west edge, K11's row 0 to K10's south edge and K11's west column to J11's
   east edge (a mountain at row 10 and a peak at row 2 moved so the walked rows meet square for
   square).
5. **K11's peaks are drawn as mountain:** the Whitespine claims `peak` as its new terrain, and the
   pillars check failed ("claims terrain 'peak', which is on the road before it") while K11 had
   them.
6. **Finds are 1,000 gold a box, a strongbox of 700 and a cairn of 300, and potions only:** no find
   that sells and no new item, every Rimewater ladder piece being placed already.
7. **The person is an old woman of Fuar on the far shore,** a survivor of the drowned village (L9's
   drover dates the rising within a life). Her rumour is the bears, never the secret.
8. **K11's south-west pocket,** about 136 squares of Monks' Vale's grass behind the crags, is
   reached overland from J11 only; two points there keep the density.
9. **The walkthrough's steps are one function,** `fuarBehind`, called after K9's step, so the steps
   of the other country boxes meet it at one line.

Decided by delegate for #497, each the owner's to overturn:

10. **The road across L10's corner is walked:** L9's `PASS` and K10's `RIDGE` are gone, as §11 asked.
    Kept, they threw a company walking L10's road west onto K10's 31,3 back to L9's 7,31, and one
    walking north up L10's road at column 6 onto K10's bridge.
11. **No arrival line on the walked road:** the crossing says the cold loch's name and feel as any
    walked border does (*Loch Fuar.* at 20, its harder words at 18, its warning at 17; *Loch Fada.*
    coming back from elsewhere); the pass's two labels went with its exits. K10's start stays the
    bridge, 30,3.
12. **L10, L11, M10, M11 and N9 are laid whole in Loch Fada at band 20–21,** the zone's and L9's, not
    the table's 20–22: the rise rule wants a group of 21 at the top either way and no wild monster
    stands at 22. L11's ground is mostly Loch Fuar's on the atlas (756 land squares to Loch Fada's
    237); a map seeds its zone, so laid, it is Loch Fada's.
13. **N9 is walked into from M9 alone:** M9's east wall opens at rows 9 and 10, columns 28 to 31, as
    pines, the pines under the fells running on round the shoulder. N8's edge is Cairnmoor's, and N10
    and O9 are cut, so nothing else could reach it.
14. **M9's 31,24 is rock, not mountain:** with N9 laid, M9's east column is no longer the world's
    end, and a climber on the wall walked 31,22 to 31,24 and into the hollow. The rock keeps it
    shut, and the walkthrough checks it.
15. **N9's north is the Rimefells, closed:** the atlas's hills and heather in its rows 0 to 3, the
    Cairnfield's, are drawn as mountain, so the notch stays the only way between Cairnmoor and
    Rimewater and no dead-end pocket opens off the moor.
16. **The glacier's edge in N9 is drawn closed as M9's is:** ice at its foot under a mountain wall
    along the east and the south, against O9 and N10 (call 7). Glacier Foot's slivers on today's atlas
    are M11's 37 squares and N9's 4, M10 holding none; all are mountain with nothing on them, and the
    maps' void is only the atlas's, M11's nine.
17. **M10's loch is open water under M9's shore and ice from row 4 to its foot,** walked (#536); the
    burn off N10 is frozen too, the one way through the ridge, else M10's south-east pines and M11's
    pocket east of the ridge could be walked by nobody.
18. **The cold loch's margin is iced in L10 and L11,** the atlas's shallows made ice and kept off the
    K10 and K11 edge columns: the pike live under ice only, and L9 already calls the cold loch white.
19. **One real fight a box, a group of 20 near the way in and a pair of ice bears far off:** the rise
    rule needs a group of 21, which only the bears are, with levels rising from the way in, and the
    pace needs heavy groups. Two pike in L10 and M10 (820 a member, 12.05 fights to a rest), three lynx in L11,
    M11 and N9 (952, 11.06). Measured: four pike or four lynx with a lone bear 14.1 to 14.2 and two
    lynx with two bears 12.91, past the limit of 12.5; three pike with two bears 10.12; two bears
    alone 8.09 (555).
20. **No den (#88) in any of the seven:** a den's keepers and lighter brood with the bear group put the
    pace past 12.5 or the pay past 1,000 (keepers three lynx, brood two and a bear: 939 and about 14
    to a rest; keepers heavy enough for the pace about 1,600; in N9 13.7 to 17.8 to a rest unless the
    box paid about 1,230 to 1,375). An all-bear den fails the rise rule. The bears keep N9's cave as
    an event.
21. **Finds are 300 gold a box (a cairn's 100 and the secret's 200) and potions or elixirs, no
    gear:** the five carry 1,500 between them; the clear holds 10,720 gold of the 9,840, so
    Rimewater's owed entry in `progression.ts` goes.
22. **L10's secret is in the ridge's west foot by the road:** the pillars' hint check walks from the
    box's start, the road's 6,0, and the ridge cuts L10's east half off inside the box (the first
    place, 15,18 in the east half, failed it).
23. **The cold loch rose:** the drowned road, the dead pines and the stumps standing in the ice; the
    trapper and the tar-burner say only what L9's drover says already ("the year the cold loch
    rose") and nothing about the bell.
24. **M10's ice-house door is at 17,21, not 17,20:** at 17,20 the art check dressed its four faces
    (100%, the cap 50%).

Decided by the builder for #832, each the owner's to overturn:

1. **The bounds' brief is §12 here and §12 of docs/areas/whitespine.md,** by each box's zone as
   #832 asks: K12, L12, the enclave and the lair here, with what every box keeps; J8, Sheer Point's,
   there. K12 with the brief; L12 and J8 next; then the enclave; then the lair.
2. **K12 is Loch Fuar's, whole,** at 20–22 as K11 and J9 are (#497's 3): 188 of its 289 walkable
   squares the loch's by the atlas and Monks' Vale's 101 played at its band. Walked from J12, the
   crossing names the loch at 20, as from J11 onto K11.
3. **K12's groups are four snow lynxes waiting on two ice bears' kill,** two groups where K11 has
   the bears alone. The curve's rise rule reads a group's mean level, and an ice bear with two
   lynxes, tried first, stood at 20.3 against the 21 asked. Dealt, the two pace 9.31 at 20, inside
   the aim, and pay 1,084 a member, which the lead holds (22.91 against 23). East of the spur holds
   no group: its 71 squares are walked from K11 and L12 only, and two points keep the density.
4. **K12's peaks are drawn as mountain,** as K11's are (#497's 5): the Whitespine claims `peak`.
5. **K12's secret is the cell where Fuar's folk walled up their kirk's plate** when the loch rose,
   found from a path of flat stones that stops at the rock, two squares in and a step east. Its door
   is 10,13, where the art check takes a lone secret door: at 9,13 it dressed every face.
6. **K12's finds are 120 gold and a Sapphire Vial on the cairn and 250 gold and an Elixir in the
   cell,** the dearest of their kinds that Rime Lodge's Provisioner's sells; no gear.
7. **The lair's door is K12's 2,15,** the rim's face on Monks' Vale's land by the atlas (§6, DESIGN
   §9), **and the enclave's L12's 11,4,** the rim's face at the land's other end; both were left
   bare (§12.5 and §12.4) and both are drawn since (#832's 28 and 32).
8. **The enclave is held at 22–23,** a band over L12's 20–21: the Whitespine's spine eagles at its
   mouth and snow trolls inside are the only beasts of the two areas at that band (its brothers and
   bell-ringers are Highcell's keepers, its masons and giants people). Its reward is named in its
   own pull request, inside the Whitespine's window, 5,000 (#845's 3): Trollbrand (#832's 26).
9. **J8's corner, 0,31, is ruled for its pull request:** I8's 31,31 is rock and J9's 0,0 pines, so
   no square of J8's agrees with both. J8's pull request shuts J9's 0,0 to the mountain, the fewest
   squares of a built edge (#920, #922, #924), and the `sheerpoint_i9|coldmere_j9` row of
   `SEAMS_AS_BUILT` loses its square 0 (§12.1).
10. **J12's `j12_drop` says what is now true:** "East the vale's grass runs on round the rim's foot
    and in under the pines of the cold loch.", where the grass ran out to a drop with only cloud
    below. Its id, place and once stay (docs/areas/whitespine.md §4.8).
11. **The bounds' groups differ box to box:** K12's lynxes and bears, L12's bears alone and J8's
    eagles and trolls, each sized with the harness at its floor (§12.1).
12. **The walkthrough walks the bounds in one function,** `theBounds`, called last.
13. **The enclave's and the lair's briefs in §4's form are written by their own pull requests**
    (§12.4, §12.5): this brief fixes their doors, bands, groups, guardian and artifact; their
    landmarks, points of interest, secrets, New here and pay as a figure come with them under #845
    and #847. The enclave's is written (§12.4, #832's 30).
14. **L12 is Loch Fada's, whole,** at 20–21 as L10 and L11 are (#497's 12): 56 of its 77 walkable
    squares the lake's by the atlas with the built maps laid and Loch Fuar's 21 played at the
    lake's band (55 and 22 before Cairnmoor's L8 was laid, which moved one square each way). Walked
    from K12 at 20 the crossing names the lake and no more; from L11 nothing is said.
15. **L12 differs from the atlas at 14 squares:** the rim's mountain at 16,0 is drawn as pines to
    meet L11's and the enclave's door at 11,4 as stone (#832's 28); the store takes 12 squares of
    the rim's mountain at 3 to 5 by 6 to 9, its door at 4,6 (the art check takes a lone door there),
    its floor at 4,7 and 4,8 and nine squares of rock lining. The store is at the rim's face as far
    from the enclave's door as it can be, with the hint on 4,5 over the door. On foot L12 walks 79
    squares, the atlas's 77, 16,0 and 11,4.
16. **L12's spring is a shrine that gives +1 intellect** (`l12_spring`, 16,0): Rimewater's other
    shrines give luck, personality, speed, endurance and accuracy, and none gives intellect or
    might.
17. **L12's bears are denned at the point,** 1,6, the strip's far end and its farthest ground from
    the way in, with the den-mouth at 2,5 and the gatherers' fire at 13,1, 17 squares off. The
    box's one group skips the curve's rank test and is the hardest at 21; the camp, the cairn and
    the rim's look all stand five squares or more from the enclave's door at 11,4, by the
    walkthrough's measure, the two distances added (§12.4).
18. **J8 is Sheer Point's, whole,** at 22–23 as I9 is (docs/areas/whitespine.md §4.6): 55 of its 83
    walkable squares the Point's by the atlas with the built maps laid and Loch Fuar's 28 played at
    the Point's band (54 and 29 before L8). Its start is 0,19 facing east, where I8's companies
    arrive; a company from J9 comes in at the south row.
19. **J8's trolls lie up on a point of pines,** 5,23 and 6,23, two squares of the shallows drawn as
    pines, joined to the shore by the eagles' square alone. The box is entered at both ends of a
    strip, I8's along its west and J9's along its south, so on open ground no two places put the
    gentler group first for a walker from every square of the way in (the curve's steps swim and
    read the start alone, 9 steps to the eagles and 10 to the trolls); the point does, from each of
    the 32 squares, and the walkthrough walks them. A swimmer can reach the trolls by the water.
20. **J8's smoke-house is a knoll of rock at 1 to 3 by 15 to 18,** cut into the hill's foot where
    the hills end and the pines begin: a room of two at 2,16 and 2,17, its door at 2,18 at the
    south end, found from the traps stacked on 2,19. The hills the atlas has there are the seam's
    one column, so ten of the knoll's twelve squares are water drawn as rock, its floor and door.
21. **J8 differs from the atlas at 25 squares:** the west column's 0,11 to 0,14 drawn as hills for
    I8's, 0,8 and 0,9 shallows for its sea, 0,30 dirt and 0,31 rock; the ice at 10 to 12,31 for
    J9's; the point's two; and the knoll's twelve. Nine are water made walkable land, ten water
    made the smoke-house (two floors, rock and door), three land made rock (the corner and the
    knoll's two hills). On foot J8 walks 89 squares where the atlas gave 83, and 91 with the room.
22. **No den (#88) in L12 or J8,** for #497's 20: a den's keepers and brood pace past the limit or
    pay past the share.
23. **The enclave is Creag Fionn,** *creag* a crag and *fionn* white, the hill folk's name for the
    cave in the rim's face where the snow trolls winter (§10): a dungeon of one level of 16 by 16,
    entered by the cave at L12's 11,4 as §12.4 had it.
24. **It is held at 22–23,** a band over L12's 20–21, its floor over the box's top (#845's 2), as
    #832's 8 said; its window is the Whitespine's 5,000, the last road area whose floor, 22, is at
    or under its own (#845's 3).
25. **Its groups are four spine eagles in the neck and two snow trolls in the passage to the cave's
    back,** the Whitespine's, borrowed as #832's 8 said: the eagles at 22 and the trolls at 23,
    which the curve's rise rule asks of an enclave at 22–23 (rank correlation 1.00; the eagles 5
    steps from the way in, the trolls 11). The sizes are J8's, which the harness gives 9.7 fights to
    a rest dealt at 22; five eagles gave 8.5, on the aim's lower edge. The neck and the passage are
    one square wide, so a walker meets the eagles first and the trolls before the hoard (the
    walkthrough floods it with both groups standing, then with the trolls alone).
26. **Its reward is Trollbrand,** the furrier's Bear Spear with its head bound in pitch and its
    blows carrying fire, which keeps a troll from mending the round it lands (`regenerate`,
    `src/game/combat.ts`): 2d12+4, two-handed, for the martial classes, at 2,100, the spear's 1,900
    and 200 for the element as the Thunderhead Axe's lightning is, inside the Whitespine's window.
    It hits for 20.5 a blow counting the element's die at its mean, where the Bear Spear hits for 17
    and the Bear Spear +1 for 18; it is on no rung of the ladder, in the hoard alone with 400 gold,
    sold nowhere and no worse than the spear the furrier sells.
27. **The secret is the trolls' larder,** two by two behind the stretch of the hall's east wall they
    keep trodden bare, which is the hint, seen from the hall: 300 gold, an Elixir and a Sapphire
    Vial, the dearest of their kinds that Rime Lodge's Provisioner's sells. Its door at 11,9 passes
    the art check.
28. **The door is L12's 11,4, as §12.3 left it,** the rim's mountain drawn as stone and walked into
    from the pines at 11,3, with an `exits` line into Creag Fionn: the one square of L12 that
    changes. L12 differs from the atlas at 14 squares and walks 79 as built (78 before); its density
    counts 82 squares and 10 points (81 and 9); nothing stands within four squares of the door by
    the walkthrough's measure (the camp, the cairn and the rim's look at 5 or more).
29. **Its plate on the world map is at 371,359,** five squares south of the door in the rim's
    mountain, as Karaordu's stands 5 south of its door, the Cairns' 6 and the Deep Mines' 8.
30. **§12.4 is the enclave's brief in §4's form with its As built,** the lair's note is §12.5, and
    the lines that pointed at the lair as §12.4 point at §12.5 (decision 13 is met for the enclave).
31. **The lair is the Spittal,** the brothers' plain word for a house kept on a pass for whoever
    comes in off it, as Monks' Vale is theirs (§10): two levels of 16 by 16, as §6 and §12.5 had it,
    the Spittal and below it the Infirmary, joined by a stair as the bay's levels are, both marked
    `enclave` at 30–32.
32. **The door is K12's 2,15, as §12.5 left it,** the rim's mountain drawn as stone and walked into
    from the vale's pines at 2,14, with an `exits` line into the Spittal: the one square of K12 that
    changes. K12 walks 290 squares as built (289 before), and its density counts 294 squares and 16
    points (293 and 15), the furthest 7 (8); nothing stands within four squares of the door by the
    walkthrough's measure (the brother of stone at 2,9 is six away).
33. **The guardian's group is the Infirmarer alone,** as #846 gives it, at 7,6 in the neck that is
    the one way from the stair's foot into the ward, so no company steps round it to the ward, the
    hint, the cold room or the locker (the walkthrough's flood, its square and those a step from it
    shut). It is a boss (`boss`), with no `respawn` and a `slainText`.
34. **The Infirmarer's numbers are set at the gate's company** (MONSTERS §4.1, §4.2 and §13): its
    2,100 hit points as drawn, attack 22 and 26d8+30 a blow, where it was drawn at the line's boss
    at 32 with attack 20 and 34d8+41, which the gate's company won 41% at 30 and 64% at 32. As set,
    it is won 60% at 30, inside the aim, and 78% at 32, between the aim (90%) and the limit (75%),
    as the Steiger (56% and 81%) and the fixture's guardian (57% and 80%) are. The gate plays its
    mending, a Heal one turn in ten, and its sleeping touch as drawn. At 2,400 hit points and
    24d8+26 it was won 60% and 80%, but its fights ran 12.8 rounds at 30 in the harness with 22% of
    the days broken off at the round cap; as set they run 11.4 rounds with 7%. Its row gives why it
    stands off the line (`offLine`), its mending named, as the Steiger's does.
35. **Nothing in the lair is had without the Infirmarer's fight:** the Spittal holds its looks and
    the way down and no group, chest or secret, so a company of any level may walk its looks to the
    stair; the door warns it. The secret is on the Infirmary past the Infirmarer: the cold room
    behind the ward's east wall, two by three with its door at 10,9, where the ones who did not wake
    were laid out; the hint is the sheet that stirs on the bed by that wall. It holds 500 gold, an
    Elixir and a Sapphire Vial, the dearest healing and spell draught that Rime Lodge's
    Provisioner's sells.
36. **The Wakerobe lies alone in the locker beside the last bed,** where a man sits up against the
    bolster, long dead, his eyes open: the one who came up through the ice in it and would not lie
    down (DESIGN §9). The walkthrough asserts that no shop, chest, cairn or statue holds it
    elsewhere and no monster drops it.
37. **The rumour is the lodge-keeper's,** DESIGN §9's two lines more at every meeting after her
    first, as §6 has it: her first meeting sets `rl_keeper_met`, a hire flag as the F11 hermit's is
    (#859), and her words after it set nothing: no flag, quest or mark (#846). Her later meetings
    say her own two lines before the rumour's two, as the Kilns' oldest miner keeps his; a company
    from an old save, which never set the flag, hears her first lines once more before the rumour.
    It is the one change to Rime Lodge. Its first line, DESIGN §9's verbatim, would take three lines
    of the log; it is said in the say box, nine of its fourteen lines.
38. **Its plates on the world map are at 330,370 and 330,376,** five squares south of the door in
    the rim's mountain, as Creag Fionn's stands five south of its door, and the Infirmary's six
    south of the Spittal's, as the bay's two are.
39. **The lair's two owed rows go:** `infirmarer` from `owes.unplaced` in the area's `checks.ts`,
    which leaves Rimewater owing nothing, and `wakerobe` from `UNPLACED` in `tools/tests/items.ts`,
    as EXPANSION §8.2 (#897's 12) and #847's 6 say the lairs' pull requests do; each check holds
    now, so an owed line left in would fail.
40. **§12.5 is the lair's brief in §4's form with its As built.** It is #832's last piece: every
    box, the enclave and the lair are built and judged, and no built map of Rimewater or the
    Whitespine is open onto unbuilt land but M10's and M11's east edges onto the reach, Glacier Foot
    (N10 and N11); the area's other open row, K9's north, faces the sea (K8).
