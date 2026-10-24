# Sunderwood's decisions

Sunderwood's decisions (EXPANSION §8.2): the old §9 of its doc, `docs/areas/sunderwood.md`, then
the eight lists that stood under §11 after its cut list, which the doc cites as §9's, moved
here whole by #1027, 17 lists in their order. It is appended to and never rewritten: a builder
adds a list at its end, and a later decision that changes an earlier one says which. Its current
state is `docs/areas/sunderwood.md` and its plan `docs/areas/sunderwood/plan.md`.

## 9. Decisions

Decided by the owner on 28 September 2026 (#151), and followed here:

1. **Act II spends no story lock** (call 1).
2. **The Sunder is hand-built,** a dungeon of two levels of 32×32 (call 2); K3's Rift is #165's.
3. **The Wardens' hall stays open and the guild splits quietly** (call 5): Vask's two Wardens at
   the Watch's gate are his, and the Drillyard's quests go on under the cousin's captains (#157).
4. **Lantern Watch sells the next spell tier** (call 9).
5. **The depths are built after the act is played** (call 10): #203 was parked, and taken off parked by
   the owner on 3 October 2026.
6. **The cuts stand** (call 12): §11, and the Deepthorn's three boxes.
7. **All four side quests stand** (call 13).

Fitted to Thornmark's plan (docs/areas/thornmark.md §9, 7, filed 29 September 2026 under #208): I3,
I4 and J4 are the Deepthorn's, built whole, their Eaves' forest drawn closed and no way opened
between them and the Eaves' boxes; the east road, opened by #195, is the only way from Thornmark
into Sunderwood. #163 gives dead wood its map character, and J4 (#216) paints its 30 squares of it
over as forest all the same, by hand, so that dead wood is first walked in Sunderwood; the
Deepthorn's scaffold learns no paint-over.

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.10.
- **The core** is J2, K2, K3 and L2, the boxes that hold a step; the rest is country (§4).
- **The Sunder's two levels** as §4.6 has them, the ledges above and the floor below, with the
  wall's silence declared to the density check.
- **Lantern Watch's four rooms** (§4.8), and its trainer to 17.
- **Moths that come more often to a company carrying Light** (MONSTERS §6.3's wanted line), a small
  systems ask, filed if #200 wants it.
- **The pay's shares** (§8).
- **The bands on the atlas's rows** (#194): the Eaves 14–15, Lanternwood 15–16, the Sunder 15–16.
  They are set already in `src/content/areas/sunderwood/atlas.ts`, where only the scaffold reads
  them, for a box's draft; the owner's word changes them there.
- **The Glass Bear and the Sunder Hound in Lanternwood** (§7), against MONSTERS §6.3's Where
  column.

Decided by delegate for #194, each the owner's to overturn:

1. **The atlas folder is spread into the plan** (`src/content/atlas.ts` imports it where its rows
   were): the area cannot be listed in AREAS without a map, a chapter and a walkthrough, and the
   registry and `chart()` stay as they are. #195 points the area's `atlas` at it and takes the
   import out.
2. **The folder charts the plan's rows and the bands, and no new sites:** a site's place is its
   box's to settle (#196, #197), and the bridge is a link, which an area's atlas has no room for.
3. **The pay is scaled to 11,467, the side quests inside and the depths outside,** as Saltreach and
   Wrackholm count theirs.
4. **I2's wolves give way to pine bears,** and the Sunder's glass bear goes from the last landing to
   the floor: the roster's.
5. **The depths' brief stays short** until #203 is unparked: it waits on the owner's play.
6. **The hints are things a player sees** (I2's cut turf, K2's bare rock, K3's stacked wood, the
   Sunder's chalk, L2's raked ash, J3's moths at the den): a hint that is only a person's name tells
   a player nothing to look for.

Decided by delegate for #195, each the owner's to overturn:

1. **A pine bear with a glass bear is the far end's stronger group,** against MONSTERS §6.3's
   Where column: the curve asks a group at 15 or more on the map, the roster's one pine bear is 14,
   and a new bear at 15 would want a drawing first. A glass bear alone passed the curve only by
   its level and was the easiest fight on the map; the pair is a real one.
2. **One pair of pine bears by the way in and eight moths by night beside the camp:** a pair and
   eight are the standard encounters the harness measures. A second pair in the south-east woods
   was dropped with the far end's pair in: the box pays about 1,060 xp a member against the
   brief's 1,150, where keeping it paid 1,430, and fights to a rest at 14 sit inside the aim.
3. **Every bear group comes back after two days, the moths after one,** as Thornmark's ogre and
   owls do.
4. **The shrine gives speed,** which no shrine or fountain on the road gave; the cairn 160 gold and
   a Sapphire Vial; the pack 300 gold and a Warden's Halberd +1 of its own.
5. **The gate's two under is judged by the day (#851),** for I2 and for the area, with the groups
   kept at the line's standard size: no group size turns back a company whose gear is the same as at
   14, and bigger groups only push fights to a rest at 14 under its limit.
6. **The climate:** summer 16, winter -2, damp to 0.08, fog 0.6, eight hours behind the Foreland.

Decided by delegate for #196, each the owner's to overturn:

1. **Four groups, not nine:** a pair of pine bears by the way in (the gentlest), a pair at the
   cave on the north path, lantern moths by the steading's lamp by night (beside it and not on it,
   so the steading stays a place to talk) and sunder hounds on the lip by the road at the far end
   (the hardest, at 15, the band's top). Nine groups would pay about 3,000 a member against the
   brief's 1,350. The hounds are five, not the standard four: at four they cost a company less a
   fight than the bears did, and the hardest group has to be a real fight. The moths are six and
   the cave's bears two, so that fights to a rest at 14 sit inside the aim (6.8) and the box pays
   about 1,510, which with I2's 1,060 is 2,570 against the Eaves' 2,500.
2. **The lip is J2's east edge,** a strip of chasm one to three wide north of the road with glass
   trees along it, against the atlas's dead wood beyond: the step's line has to be true where it is
   read, and a ring of mountains or the void would make it false. K2 draws its west lip from x 328
   to meet the strip; south of the road the box stays dry, so the road reaches the bridge.
3. **The road runs south-east, as the atlas paints it:** north-east in the brief was a slip.
4. **Quest 29 stays #205's:** J2 builds its cabin, the two graves under the glass trees and
   Garret, a pine-cutter whose lines of his own carry the secret's hint. Nell, the choice, the
   warding lamp and the flags are #205's to add: #205 is not approved, and names #196 as the
   builder of the cabin and the graves only.
5. **The area claims dead wood, crystal and the chasm as new terrain,** all three first on the road
   in J2: novelty is checked per area, and K2's new things are the bridge and Sunderfall.
6. **The finds:** in the cave a Great Axe +1 and 250 gold, the Great Axe a new two-handed base at
   2d8+1 and 600 gold, so its +1 (750) is a step past Thornmark's Great Sword +2 and inside the
   area's window of 3,000; the cairn 180 gold and a Sapphire Vial, as I2's; the shrine gives might,
   which only the Foreland's D2 gave before.
7. **Bears and hounds come back after two days, moths after one:** the moths are the night's.
8. **I2's east edge opens where J2's west edge meets it:** the mountain wall was the world's end
   while J2 was unbuilt, and kept it would be a range through one wood. J2's column 0 is pine but
   for the road, so no new way opens and I2's figures stand.
9. **J2 is built at core density** (90% within 8 steps, none past 15): it holds the Eaves' step.

Decided by delegate for #399, each the owner's to overturn:

1. **The Watch sells a new weapon line for every class,** a point of blow past Saltmouth's finds,
   and the Sunder and the boxes round it give each with a plus by 16. The Great Axe and the Watch
   Staff are among the wares, so J2's Great Axe +1 and L2's Lantern's Staff +1, already in the
   briefs, are the barbarian's and the monk's and druid's steps.
2. **The stores' Lamellar (10) is the medium wearers' armour step,** and the Watch Shield (5) plate's
   wearers', whose armour step is the Sunder's Plate Mail +2 (11) at 16, a step past the stores.
3. **No robe or Lamellar with a plus at 16:** the casters better their gear with the dirk or the
   flail.
4. **The window stays at 3,000:** the dearest ware is the Lamellar at 1,600.
5. **The Halberd +1, the Long Sword +2 and the Chain Mail +2 stay off the ladder,** finds that sell.
6. **J2's Great Axe is the Watch's ware,** 2d8+4 at 1,200 gold, not the 2d8+1 at 600 that #196 gave
   it: its +1 at 2d8+2 would not better Saltmouth's Long Axe +1, and at 2d8+5 (1,350) the cave's
   find is the barbarian's step at 16, early, inside the window. Saves are fine: the base was never
   sold or placed, so a save holds only `great_axe+1`, which keeps its id and grows stronger; no id
   goes or moves (EXPANSION §5.5), and nobody loses gear or gold.
7. **The Watch's staff is the Watch Staff,** so that L2's Lantern's Staff +1 reads as a named copy
   of it and not as the same thing.

Decided by delegate for #201, each the owner's to overturn:

1. **The trainer has a fifth room, the Lamp Gallery** (`watch_gallery`): the open walk round the
   great lamp at the tower's top, a straw pell lashed to the parapet and staves racked against the
   lamp-house, the gorge below. A trainer is a business, every business has a room of its own, #207
   drew four, and no other town can teach to 17.
2. **The prior's room is a room with a keeper who is out:** its doorway opens on the room, and the
   Reader sits in it at every hour, so nothing the company does or when it comes shuts it.
3. **Prior Osric keeps the yard,** under the lamp, at every hour; his lines keep to the lamp, the
   oil and Helmstow. The letter under L2's ash says why the papers are not read in front of him.
4. **The young sister stays on L2:** a person who moves is 31's, and 31 is #205's.
5. **Wouter Brink, the Cartographers' surveyor,** stands on the west wall with lines of his own and
   no quest; his name is Saltreach's, as his guild is. His ruled line under the ledges is the wall's
   hint, never its name.
6. **The hall's fee is 400,** twice Thornhold's for two tiers more, small beside 1,280 a sixth-tier
   spell; **the refectory is 30,** the inns' climb from 12, 20 and 25.
7. **The stores sell the eight wares, lamp oil, elixirs, great spell potions and rations,**
   Thornhold's four goods: with no temple, the oil's and elixirs' cures matter. Quest 29's warding
   lamp is #205's to add.
8. **The map is one tower in a walled yard,** its wall the map's edge: a town that is one tower.
   The tower is not claimed as a new landmark, since Thornmark's old tower has the icon already.
9. **The gate's two events keep their ids,** and now read open: no id moves.
10. **Two pull requests:** the tower and its businesses first, then the papers read and the
    midpoint's flag, which is the act's turn and is reviewed on its own.
11. **The Reader reads the papers, not the prior,** in his room with the door shut, as the letter
    under L2's ash asks: Hester Dunmore, Reader of the Watch, the Lanterns' third rank.
12. **The midpoint's flag is `papers_read`,** set by her words once the company carries the papers or
    the log, at any hour and with nothing but her introduction done. It is not a hand-in: she reads them and gives
    them back, as Ysolde reads the Meridian journal, so #204 and the company keep them.
13. **The letter changes only how she begins** ("You have been on the knoll, then."): the reading is
    never missed for want of the secret.
14. **The reveal stops at what is written:** the seal, the countersign and the name. She draws no
    conclusion aloud; cages, the sky and the Hand are Vask's to say in the rain (#204).
15. **The prior asks for the papers and takes nothing,** and once they are read says the chair in his
    room was warm: his side is felt, and no flag of the split or choice is spent on it (31 is
    #205's).
16. **The reading follows what is carried:** the papers alone are read for the seal and the
    countersign, the log alone for the name, and both for all three; the drafting agent wrote each.
17. **The introduction comes first:** the Reader and the prior each set a flag on meeting
    (`watch_reader_met`, `watch_prior_met`), and their words about the papers wait on it, so a
    company that comes in carrying them hears who they are before the reading, and "Shut it, if you
    would" sets up the shut door.

Decided by delegate for #453, each the owner's to overturn:

1. **The Watch's 300 is dropped:** its quests are 31 and 32, which §6 pays already, so it was
   counted twice.
2. **The side quests pay 500 between them, not 900:** 29 and 30 110 each, 31 and 32 140 each, about
   a third of a fight; a quest that pays nothing reads oddly, and the 16s keep their step.
3. **J2's moths are three, not six:** 138 xp a member against 277; at 14 the box wins every fight
   and manages 7.6 fights to a rest against 6.9, nearer the aim's middle.
4. **L2's lamp moths are two and a deathshead, not four and one:** 303 against 396; at 15 it wins
   every fight and manages 8.2 fights to a rest, as before, inside the aim.
5. **The Sunder, J3 and M2 keep their groups:** a monster off any of them puts fights to a rest past
   the aim (the Sunder's wood 9.8, its first spiders 10.4, J3's brood 9.4, M2's hounds 8.9).
6. **The area as planned comes to 11,474,** the boxes 10,974 with the side quests' 500, against the
   curve's 11,467; the owed floor in `progression.ts` falls to 10,974 with it.

Decided by delegate for #205, each the owner's to overturn:

1. **The flags are `q_family`, `q_dam`, `q_lamp` and `q_wall` and their kin, not the issue's `q_glass`,**
   which is Thornmark's (The Dark Glass). `lanterns_split` is set with `q_lamp_exposed` for #21 to
   read; the quests are `family`, `dam`, `watch_lamp` and `length`, and the chapter keeps `wall`.
2. **The people on main win:** Osric is the issue's Oswy and Brink its Hollin, and Orm and Garret keep
   their names as built. L2's young sister is named Averil, a sister of the Watch. The issue's lines
   are redrafted to them.
3. **Old saves keep:** a flag added to a person's first meeting is set the next time they are met,
   and every `sets` is on a new event. Old events only take `until`, which hides them (EXPANSION §5.5).
4. **Averil stands on L2 until the papers are read, and at the foot of the lamp's stair in the
   Lantern Hall after:** 31's person who moves (#201, 4). Her L2 lines stay word for word, since they
   carry the knoll's hint, and her first meeting in either place is always her own lines
   (`averil_met`): the family's question and the wall's line wait on it.
5. **Averil's words go open questions first, then lines said once, then after-lines, the newest
   quest first, and the after-lines are the hall's only:** the first of a person's words that holds
   is said and an after-line holds for ever, so in any other order one quest's end would stop the
   next being put, and on L2 she would never come back to the knoll's hint. A line said once sets a
   flag and is `until` it.
6. **29 is given at the steading:** Garret's first and third paragraphs stay as #196 wrote them, the
   dog's among them, and his second is redrafted for the daughter and the graves. Nell, the cutter's
   daughter, new beside him (23,8), shows the wrist. Meeting either sets `q_family`.
7. **The warding lamp is a quest thing at no price, not a ware:** the stores' stock stands, and the
   Watch is "one lamp short" in words only. Garret's after-lines end on the dog, so the hint is never
   lost.
8. **29's title is Under the Glass Trees:** #56's The Family at the Glass Trees is wider than the
   log's list (185 pixels of 172).
9. **30 is given at the shrine, or by the dam seen or its gleaners killed:** Orm's first two
   paragraphs stay as #197 wrote them and the third sends the company up the river to the dam.
10. **The dam's gleaners (`k2_dam`) come back no more,** so the foreman can wait on them; Hew sits on
    the dam's west end (20,10) once they are dead, until either answer. The curve counts every group
    once, so the xp stands.
11. **Break it stops K3's first landing's gleaners and says the fall running,** at Sunderfall and L2's
    lookout. The ledges stay walkable, the chapter's way down: the water runs down them, never a
    flood. The shrine's look stays, since a twin would bless twice.
12. **The great lamp goes dark on `papers_read` and is lit by either answer to 31:** L2's gate and the
    yard by night have a dark twin and a lit twin each, and `lw_oil` hides. The gate's lines are
    shortened to two, so that the lit and the unlit together fit the log.
13. **The cut wick is found, not told:** `lw_wick`, on the Lamp Gallery's door, is there from the
    papers until the lamp is lit, for anyone who climbs to train, and it alone opens the prior's
    confession, so a company that finds it before Averil asks has the quest and its end.
14. **Osric's words go: a dark-lamp introduction, the confession and the choice, the let-be after-lines,
    the oil sold, then the warm chair:** the introduction holds from the papers until
    `watch_prior_met`, since his first lines say the lamp burns.
15. **Brother Cuthwin, new in the stores, counts eleven casks** once the lamp is asked about, and sets
    `q_lamp_casks`, which the log reads and nothing waits on.
16. **The Watch's map marks no secret:** the secret is found, never told, and the one at the wall's
    west end has its chalk. It holds the Lanterns' ledges, each named, and below the lowest one line
    ruled edge to edge, the Watch's own to Brink's.
17. **32 waits on the wall touched:** Brink's first meeting keeps his lines, the wall's hint, and he
    asks for the length only of a company that has been down, since his line never reached the bottom.
18. **The east end is a new event at the strip's end (28,25), which sets `q_wall_east`;** the west is
    `su2_fall`. A condition takes one `seen`, so the flag carries one end and the seen the other.
19. **The measure sold pays 500 gold:** a step past Thornmark's and Saltreach's dearest hand-ins (400
    and 300), and telling costs the company something.
20. **Each answer pays its quest's xp, split among the living,** by `pay` on an answer (#573). 29 pays
    at Averil's answer, since the lamp's hand-in pays nothing. The curve counts the least of a
    question's answers, once a question, so the xp owed goes and the gold floor stays at 4,242.
21. **Levels are not enforced:** no person turns away a company under 15 (#56's rules, no story lock).

Decided by delegate for #806, each the owner's to overturn:

1. **The Warden of the Sunder is set again at 1,020 hit points and 13d8+13** (872 and 10d8+10
   before), by hearth.md §7's method: tries of hit points and blow on the gate's seeds. #199's
   gate set it against a company without its first prestige, 53% at 14 and 95% at 16; the gate's
   company has taken the prestige since #541, and won it 98% at 14, past the limit of 80%. The aim
   is about half at the floor (30% to 70%) and nearly always two above (90%). The tries, in percent
   of the gate's 400 seeds and of its own hundred, a fight broken off being one still running at the
   fifteenth round, which the gate does not count won:

   | Hit points | Blow | At 14 | Broken off | At 16 | The gate's hundred, 14 and 16 |
   |---|---|---|---|---|---|
   | 872 (before) | 10d8+10 | 97 | 1 | 100 | 98 and 100 |
   | 1,200 | 10d8+10 | 55 | 35 | 98 | 59 and 98 |
   | 1,100 | 12d8+14 | 44 | 21 | 90 | 42 and 89 |
   | 1,000 | 13d8+13 | 61 | 7 | 96 | 58 and 98 |
   | **1,020 (kept)** | **13d8+13** | **56** | **8** | **94** | **56 and 95** |
   | 972 | 14d8+14 | 61 | 4 | 93 | 57 and 94 |
   | 872 (the line's) | 16d8+18 | 65 | 0 | 88 | 64 and 89 |

2. **The blow rises with the hit points.** Hit points alone read half at 1,200, but 35 fights in 100
   are then broken off at the fifteenth round: the Warden is not beating the company, the clock is,
   and a company that waits it out may well win. The rule for the four Act II bosses (saltreach.md
   holds the Choirmaster's, wrackholm.md the Wrackholm pair's): raise the hit points till the floor
   reads about half, and where more than one fight in ten is then broken off, raise the blow and
   lower the hit points till it is not. The blow stays under the line's at 16 (16d8+18, 90): 71.5.
3. **The Warden's second figure is the tightest of the four:** 95% at 16 on the gate's hundred (94%
   on the 400) against an aim of 90%, where the others read 99% or 100%. A heavier Warden with a
   lighter blow reads higher at 16 and is lost to the clock: 1,147 hit points and 11d8+11 read 51%
   and 97% on the 400, with 31 fights in 100 broken off. The line itself, 872 and 16d8+18, would
   read 64% and 89%, a point short of the aim at 16.
4. **The floor is 85.3% with the Warden among its three groups,** 99.3% before: the spiders and the
   bears are won every time and the Warden 56%, so the map's fights pool at (100 + 100 + 56) / 3.
   That is off the aim of 90% and inside the limit of 80%, as #199 left it (84.3%), and the check
   lists it. The map's limit binds the Warden from below: it must be won 40% or more at 14 for the
   map to hold it. Two under its floor the map is 67.3%, 82.3% before, inside its limit.
5. **The `OWED` line for the Warden goes,** and the reason `OFF_LINE` gives for it
   (`tools/tests/harness.ts`) names this issue and no longer says its hit points are the line's.
   Level, xp, gold, drops, id and the group stay, so the curve and `src/content/shipped.json` do not
   move. The area's pool two under its floors falls with the Warden, from 98.5% to 97.2%, still past
   its limit of 90%, which #851 replaced by the day.

Decided by delegate for #197, each the owner's to overturn:

1. **K2 is laid whole in the Eaves, band 15:** the chapter makes the bridge the Eaves' step. The zone
   line moves to its east edge (§4). A narrow band asks a group above its floor (the curve's check),
   so the hardest group is at 16.
2. **The gorge runs from J2's lip at x 328,** seven to nine wide north of the road, narrowing south
   of it to the atlas's line, and the bridge carries the road straight on from J2 on world row 54
   rather than bending down to the link's 56. The atlas's link keeps its ends: it is a planned line,
   and moving it is a shared file's change for nothing a player walks.
3. **J2's east ring opens:** its mountain north of the road becomes chasm, so the lip runs unbroken
   to the road, and south of the road pines, so its woods meet K2's west lip.
4. **Three groups, about 1,070 xp a member, all back after two days:** three sunder hounds and a
   glass spider at the bridge's far end (four hounds put fights to a rest at 15 under the aim, 6.1);
   three gleaners and a hound at the dam, #205's "men with grey hands and dogs with glass in them";
   and two glass bears on the road at the far end, where Lanternwood begins, the box's group at 16:
   since #414's re-stat three were past the limit alone and two hold it, a true fight where a mixed
   group would only average to 16. Glass bears there are against MONSTERS §6.3's Where column, as I2's is, and
   stand with §7's proposal. Sunderlings in the glass were dropped: the box paid 1,580 with them,
   and they are K3's (#198).
5. **The dam is K2's,** on the river above the fall, as #205 has it, and the fall below it a thread:
   a line of pine trunks across the river where it leaves the pines, with #205's line. §6 had the dam
   and the foreman in K3, a slip; K3 keeps the ledges that stop. Hew, the choice, the fall's second
   text and Orm's after-lines are #205's.
6. **The shrine gives personality,** the Paladin's spell stat; the Paladin's trainer is owed to #19.
   Orm, #205's name for the keeper, has lines of his own and asks nothing.
7. **The finds:** on the ledge a Long Sword +2 and 200 gold, a one-handed blade beside J2's Great Axe;
   the cairn 180 gold and a Sapphire Vial, as I2's and J2's. The Holy Symbol is dropped: the shrine's
   blessing is the find, and a keepsake that does nothing is clutter.
8. **The map is `eaves_k2`, called Sunderfall,** and its fall is the area's site, built where the river
   meets the lip at 336.5,57.5, not the plan's 340,60. The area claims the falls as a new landmark.
9. **J2's two nits are fixed in the text:** the cabin is fieldstone and turf, as it draws, and the
   cairn is out of sight of the road, not off any path.
10. **The Long Sword +2 stays, under the Watch's stores:** #399 kept it off the ladder, a find that
    sells, as I2's halberd is. Every +1 has its box (#399), and none moves to K2.

Decided by delegate for #198, each the owner's to overturn:

1. **The ledges are cut into the east face,** and the gorge's north half is K2's line carried on,
   at x 4–8 to the landings, then back to the atlas's x 10–12. K2's lookout sees a path to them going
   south along the wall, and the face behind them lets nobody step off the lip onto a lower ledge: a
   ledge is open only to its own way, or to Levitate.
2. **Below the door the ledges go on to a lower landing and stop there in rain.** The rest of the
   way down is the Sunder's upper level (#199).
3. **The door is drawn shut until #199:** a wall in the face at 338,70, with the step's event at the
   ledges' head and the landing plain. It sets no flag and is no entry in `locks.ts`, as C6's gate
   was none before #177. #199 makes the square its way in and writes its exit back to the landing.
4. **The secret is the river's old bed, from before the Sunder took the river over the fall,** where
   the first shards were quarried. The dam and the quiet fall are K2's (#197), so the bed needs
   neither. It lies on the east lip, the river's side: on the west lip, reached only from K2's
   bridgehead, the hint check, which walks a map from its own start, could not find it.
5. **The hint is two things seen:** round stones, the river's kind, in a gully on dry ground that
   ends in air at the lip, and dead wood stacked across the bed, cut ends outward (the brief's line).
   "K2's fall gone quiet" goes: it is the dam's, and hints at nothing here.
6. **The prize is a Sunder Shard and 200 gold,** the shard (`sunder_shard`, slot none, price 0, as
   the Brine Shard) half cut from the rock. The bed is walled by rock and pines,
   so neither a swimmer, a climber nor Levitate reaches it.
7. **Two groups on the box and two in the Rift, about 1,440 xp a member.** On the box, back after two
   days: two gleaners and two sunder hounds on the first landing, MONSTERS §6.3's fight, barring the
   only way down; and two glass bears in the dead wood past the crystal, the group at 16, as on K2, a
   real fight. The bear is the only fit at 16: the deathshead is Lanternwood's by night. The Sunder's
   mouth is nearer the glass bear's Where column than K2 or I2, and stands with §7's proposal. A
   second gleaner group on the lower landing was dropped: the Rift holds its aim only at full size, and
   with both the box paid about 1,840, where at three it was off its aim (9.0 fights to a rest).
8. **The glass spider leaves the threads,** which are the Sunder's upper level (§4.6); K3's spiders
   are in the Rift.
9. **The Rift is the spiral in black glass, band 14–15, in a clearing in the crystal at the box's
   south end,** reached by a lane from the dead wood by the gorge: the crystal reads as its own grown
   glass. Seed 2 puts four sunderlings, its gentlest at 14, by the way in and four glass spiders, its
   all-15 group, by the tear. Smaller groups ran past the limit on fights to a rest (14.9 at three and
   two). Its two-under figure is judged by the day (#851), as C5's Rift's is.
10. **The Rift has no `until` and no warden:** both groups come back after a day and the tear never
    goes quiet. A warden is the one group that never returns, the opposite of open whatever the
    company does, and a heart whose fall closes nothing is the Warden of the Sunder's turn (MONSTERS
    §6.3). The hoard is 150 gold and a Healing Draught, with no shard: the bed holds the box's.
11. **The pay is about 90 over the brief's 1,350,** recorded in §8 and not cut: with L2's (#200), the
    five boxes stand about 130 over their 6,350.
12. **The foreman's tally is dropped,** and quest 30's ledges that stop: the tally is K2's ledge, and
    the foreman and the stopping are #205's, which is not approved. No `until` on the landing's group.
13. **The gleaners' camp on the lower landing holds the Warden's Dirk +1 and 120 gold,** behind the
    landing's group, with a sack of shards that glow in words only.
14. **The camp is on the east lip by the last pines,** the company's rest before the ledges and the
    Rift; the light in the glass to its south points at the Rift without naming it.
15. **The Lanterns' shrine is on the west lip's south end, facing the gorge, its lamp cold, and gives
    accuracy:** no shrine in Act II had, and the lamp was for seeing far. The west lip carries the
    lookout across to the door, a cut rope at the lip and a cairn of 170 gold and a Sapphire Vial, as
    I2's to K2's.
16. **K2's south ring opens to K3's north row square for square:** both lips' dead wood, the chasm,
    the rock under K2's ledge and the pines. K3's west, south and east edges stay ringed, for J3, K4
    and L3 to open.
17. **The map is `eaves_k3`, called The Sunder's Mouth, laid whole in the Eaves,** core, band 15–16,
    so the Eaves reads 14–16. The atlas's link at 338,70 keeps its ends. Its floor is above the
    area's, so its groups count two under in the area's pool.
18. **K3's Rift claims nothing new:** a Rift that stays open is the Sunder's (§4.6), where its
    Warden falls and nothing closes, as §7 has it; K3's open Rift comes before it unclaimed.
19. **The Sunder Shard is a keepsake, the bed's find and nothing more.** No hand-in takes it: the Watch
    reads the Tide Ship's papers and log, not a shard (§5, #201, #204), so a secret's find never holds
    up the act. It follows the Brine Shard, which neither the plinth nor any hand-in takes.
20. **Lanternwood's line is held at K3's edges by seeds,** one a square down its east edge and along
    its south edge east of the gorge, so that L4, L5 and M4 keep their squares and K4 its Lanternwood.
    With L2 laid the Iron Fells keep their line. The Deepthorn's would need seeds in Thornmark's rows,
    another lane's, or a systems change that settles unbuilt land as the plan has it; both are proposed
    to the owner, not made here.

Decided by delegate for #200, each the owner's to overturn:

1. **The rim's pines are drawn as forest, and no pine character is filed.** The atlas's 64 squares of
   pine under the rim have no map character, so the scaffold refuses the box; it is cut by hand with
   pine read as forest, as the Eaves draw theirs. Rimewater's pinewoods can ask for the character.
2. **The tower's foot is drawn small, its gate shut until #201,** as Saltmouth's was on C6 (#176):
   building squares north of the gate in a yard of woods, a spur of road to it, and one event before
   it that says only what is seen. The atlas's site and link at 372,46 stand on it, so nothing moves.
3. **The back row is the moths' reach, and nothing is filed.** The moths and the deathshead are
   `ranged`, so they strike the back row from the first round, and their sleep does the rest. A
   targeting preference would be a systems pull request of its own. The Light ask is not filed:
   groups are placed, not wandering, so "come more often" has no rate to raise.
4. **No dusk:** `when` has none, and the glass bears stand on the road by the river at all hours, as
   §7 proposes them for Lanternwood by day; against MONSTERS §6.3's Where column, as I2's and K2's.
5. **Four groups, measured down from the plan's:** five moths and a deathshead at the lamp, three
   moths and one at the tower, three hounds and two bears paid 1,370 and gave 9.6 fights to a rest at
   15. Four moths and a deathshead at the lamp and two deathsheads at the tower give 8.2, inside the
   aim, with a true fight at 16, and pay about 1,400, taking up the Eaves' 200.
6. **The young sister stands by the dark lamp** with a look, a line of her own and the brief's line
   as half the hint: no flags and no `when`. Quest 31 is #201's and #205's.
7. **The secret is on the knoll, under the ash:** a secret door north of the ash into a pit closed on
   every other side, with the letter as event text only and a chest with the Lantern's Staff +1 and
   250 gold. The letter names neither the seal nor the Regent: those are the tower's to read (§5).
8. **The shrine gives intellect:** the Lanterns read, and sell the next spell tier.
9. **The cairn gives 180 gold and a Sapphire Vial,** as J2's and K2's.
10. **K2's east ring opens to forest where it meets L2,** with the road through, as J2's opened for
    K2. L2's south and east edges are the ring, with the road out at its corner.
11. **Bears and hounds come back after two days, the moths after one.**
12. **The map is `lanternwood_l2`, called Lanternwood:** "Lantern Watch" is #201's map, and two places
    of one name would confuse the log.
13. **The road's corner is owed to #202:** the atlas runs the road out of L2 through M2's corner into
    M3, which is cut; the four squares where map and atlas disagree wait on M2.

Decided by delegate for #199, each the owner's to overturn:

1. **Four groups and the Warden, not seven and the Warden,** about 2,700 xp a member against the
   brief's 2,350. The brief's three spider groups, three sunderling groups and a glass bear would pay
   about 4,100; the Warden alone pays 1,689. The ledges keep one group, four glass spiders on the
   walked thread; the floor two, two spiders with a glass bear at the ledges' foot and two glass bears
   toward the narrows. Sunderlings are dropped: K3's Rift holds them, and the black glass stays as a
   sight. The floor needs two standard groups: with one, its fights at its floor, the Warden pooled in,
   fall past the limit (76.5%), and smaller groups run past it on fights to a rest. The two levels run
   about 350 over §8's share and the five boxes with them about 485 over theirs.
2. **The ledges are banded 14–15 and the floor 14–16,** as Kelp Hole's levels are 12–13 and 12–14:
   the gate judges a boss at its map's floor, so the floor's 14 has the Warden won about half at 14
   and nearly always at 16, as #199 asks; and a level banded 15–16 would want a group at 16, which the
   spiders on the ledges are not. Two under, the ledges are judged by the day (#851) as every Act II
   box is.
3. **The Warden's blow is cut by hand,** its hit points kept on MONSTERS §4.4's line (872): 16d8+18
   won 13% at 14 and 47% at 16; 10d8+10 won 53% and 95%, as Kelp Hole's Great Devilfish was set.
   #806 set it again, at 1,020 hit points and 13d8+13 (below).
4. **The wall is drawn smooth, a systems pull request first (#424):** `wallStyle: 'smooth'`, one face
   with no join, and a door in it its seam alone. Drawn in courses the wall would be false on the
   step's own square. The floor's gorge sides are rock and mountain, so the wall is its only wall face.
5. **The secret is a hollow in the rock fall beside the wall, not a way into it** (the review of
   #426): the wall is flat and its ways open only to Wenna's palm (STORY), so nothing passes into it.
   The chalk runs out at the fall's foot; searched from a cleft beside it, a gap opens on a pocket of air
   whose back is the wall's face, with the seam on it, drawn as a hairline on a wall square nobody
   walks through, and beside it rows of small marks nobody can read, which are not the knot. The
   seam's line is said on stepping into the hollow, where it is seen. The find is the sight, with 200
   gold and a Sapphire Vial so the search pays. A systems pull request first (#427) draws a secret door
   among rock underground as the rock, and once found as the gap it is, so the smooth style never
   shows a slab of the wall in the fall.
6. **The Warden drops the Heart of the Sunder** (`sunder_heart`, slot none, price 0), a keepsake, as
   K3's Sunder Shard is. No hand-in takes it.
7. **The threads are walked:** one a square wide, glass ground over the chasm by the level's own
   legend, the only way from the east face's ledges to the west's, and the spiders on it.
8. **K3's door becomes the way in,** cut stone on the first landing with an exit, no flag and no lock;
   K3's walkthrough checks it open.
9. **The step is the brief's line on the wall's square where the floor meets it.** The chapter's entry
   that keys on it is #204's; quest 32's surveyor, his flags and his once-event at the wall's end that
   is not there are #201's and #205's. Only the chalk, his hint, is placed.
10. **The Warden never comes back and nothing closes:** every other group comes back after two days,
    the Warden has no `respawn` and its death text says only that nothing closes.
11. **The finds are the ladder's (#399, #406):** the Plate Mail +2 in the gleaners' cleft on the
    ledges, the Flail +1 and the Ironwood Bow +1 with the fallen past the narrows.
12. **The text was drafted in the voice by a separate agent,** and no line names what the wall is.
13. **The floor has no sky and no rain** (the review of #426): a dungeon draws a vault overhead, so
    the floor's lines say the faces lean together so high that no sky shows and no rain comes down,
    rather than open the dungeon's sky, a systems change for one level. The ledges keep their rain:
    their vault is near black, the night over a gorge.
14. **K3's step and lookout lines see the way in open,** a way cut into the rock with a stair inside,
    where they saw a shut door.

Decided by delegate for #202, each the owner's to overturn:

1. **M2's road follows the atlas:** it crosses M2's corner and leaves by its south edge into M3, the
   world's end there. The crossing, the pass and 404,70 are M3's, and M3 is proposed to the owner as
   Act III's first box, laid in the Iron Fells, which would carry the road on from M2's 1–2,31; the
   crossing line facing back (#166) needs two built zone maps, so it is owed to that box. A road cut east
   through M2's own range would run to a closed edge, or one that disagrees with N2's grass. The atlas's
   link at 404,70 keeps its ends: a shared file's line that nothing here walks.
2. **M2 is laid whole in Lanternwood.** Its way in, its wood and its river are Lanternwood's. The delegate
   expected only the 109 squares east of the range to move; as built, the walk runs on east from M2's
   edge and the Iron Fells fall to 583 (§1). Holding them wants seeds in the Iron Fells' row, a shared
   file: proposed, not made.
3. **L2's corner is re-drawn:** the river leaves M2 into L2's corner and runs out of its south edge
   against L3's atlas river at 391,62, and the road fords it into M2 on row 29; L2's four squares owed to
   #202 agree, and the entry goes from `EDGES_OWED`.
4. **J3 is laid whole in the Eaves,** taking the Deepthorn's 445 squares, recorded as the owner's
   question with #198's 20. thornmark.md's counts are Thornmark's, measured earlier, and are not touched.
5. **J3 opens two ways,** a cutters' track two wide down from J2's cairn clearing and the dead wood onto
   K3's west lip, so a country box off the road need not be left the way it was come into. Its west and
   south edges stay closed. J3 draws its land under the Sunder's planned plate at 24,0 and puts nothing on
   it.
6. **The den's keepers are its old bears gone to glass,** two glass bears, and it breeds pine bears,
   a pair. Measured, the delegate's two keepers, two broods of two, a way-in pair and six moths paid
   about 1,665 a member, and gentler groups put fights to a rest past their limit (11.6); three keepers
   held the aim but broke off 27% of days at fifteen rounds (the review, #428). Two deathsheads come to
   the den's mouth by night instead, the moths of the hint, a true fight at 16 that ends.
7. **M2's groups are two sunder hounds and a lantern moth by the way in, two deathsheads at the camp by
   night and two glass bears under the range,** the box's group at 16 a true fight: the brief's four moths
   and a deathshead were too gentle a fight (11.1 fights to a rest with the rest), and the moth with the
   deathsheads broke off 32% of days (the review, #428). The hounds are on Lanternwood's road.
8. **The finds:** the badge is words on the grave, the Scarth's, left there and never named as Hale's (the
   review, #428), and nobody takes it; the
   dead Warden's pack beside it holds 250 gold and two Healing Draughts. The cache holds the Chain Mail +2
   (`chain+2`), off the ladder, a find that sells, and 200 gold; the sack of glowing shards in it is the
   lamp the moths come to. Nothing on #406's ladder was owed to #202.
9. **M2's shrine gives endurance and J3's luck;** neither had been given in Sunderwood. The cairns give
   180 and 170 gold and a Sapphire Vial, as I2's to L2's.
10. **The hints are things seen:** the milestone's back, cut by another hand; the moth dust at the den's
    mouth by day and the moths by night, with the hermit's word. The grave's way is a secret door in the
    tree line beside the stone, so the box has one wall and the pre-#9 dressing check still sees it.
11. **The maps are `lanternwood_m2`, called The Fells Road, and `eaves_j3`, called The Bears' Wood.** Bears
    and hounds come back after two days, the moths after one, the brood one a day.

Decided by delegate for #204, each the owner's to overturn:

1. **The chapter is `wall`, The Wall,** and #205's The Length of the Wall takes another id.
2. **It begins on the Tide Ship's papers, carried or read,** not on the rim, the bridge or the wall:
   the log tries the furthest chapter begun first, so a Wall begun on the rim would hold the goal
   over Wrackholm's for a company that walked east early. A company that takes the Sunder first
   finds the wall all the same, and the rim, the crossing and the wall are written when the papers
   come. Neither paper can be sold or handed in, so the start stays true.
3. **Wrackholm's done flag takes the items' place once #191 names it,** so the papers picked up on
   the ship no longer take the goal from Wrackholm's last steps. It is owed to #191 in
   `tools/tests/quests.ts` and said in `chapter.ts`.
4. **Vask's answer sets `q_salt_done`,** beside its own flag (`q_vask_no`, the one answer since
   #452): only a person sets a flag, and Helmstow is the Foreland's lane, so the act ends at the
   Watch.
5. **The chapter is done on `q_salt_done`,** the one flag #157 and Act III's first chapter key on.
6. **Home to Helmstow is an entry, not a goal:** Helmstow's maps are banded 1–4, which the road's own
   test refuses for a company of 16, and what it finds there is #157's.
7. **Vask is the keep's Lord Aumery Vask, Regent-Warden,** on the grass west of the gate's road at
   6,14, the road and the gate left clear.
8. **He waits on the papers read and the wall touched,** since he says *You've touched that wall*.
   The wall is a step of the chapter, as the story has it.
9. **He is gone once answered** (`until: q_salt_done`); his last words are the answer's.
10. **By day stands for the next morning:** the clock knows day and night and no more, so a company
    that reads at night meets him at the next daylight, and one that reads by day with the wall seen
    finds him on its way out. A true next morning would be a systems change, not asked for. The gate's
    line drops its "Morning" for the same reason, and keeps the rain, as every line at the Watch has it.
11. **His words do not change with what the company carries:** everyone who meets him has had the
    papers read and touched the wall, and the narrows give the heart with the wall. His meeting sets
    `q_vask_rain`, and a company that walks away from the question hears it again.
12. **The two Wardens are in his lines,** not people of their own; the gate's once-events `lw_vask`
    and `lw_vask_e`, on the two squares of the road in at 7,13 and 8,13, carry the brief's line,
    with his `after`, `until` and `when`, and each ends once the other is seen.
13. **One answer, the company's no, as STORY has it** (#452, amending #204's two): it sets `q_vask_no`
    and `q_salt_done`, and a company that walks away from the question hears it again. The yes and its
    entry are gone, and save version 3 turns an old save's `q_vask_yes` into `q_vask_no`.
14. **The no gives nothing:** no gold and no gift (#452; #204 said it of the yes). The endings are the
    quest's later.
15. **"I have the girl" closes the answer:** Wenna alive, below and his reaches every company.
16. **Five goals, furthest along first,** each its own words: the gate; down the Sunder, read; to the
    Watch, the wall seen; down the Sunder, over the bridge; over the bridge. The Sunder taken first
    with no papers shows no goal of the Wall's: today the quest has none there, and once #191's
    chapter is written Wrackholm's shows. A goal at the Tide Ship would fail the band at 14–16.
17. **The papers and the log read each have an entry,** keyed on `seal_read` and `log_read`, which the
    Reader now sets beside `papers_read`: an entry keyed on an item would vanish with it.
18. **The walk is at 15 in order, at 16 the Watch first and at 14 the Sunder first.** The curve
    gives each step its level, 15 or 14, which the band checks; the company fights and meets Vask at
    16 in the second run. In order plays the Foreland and the Grove from a new game; the other two
    are seeded from their flags and events. Saltreach and Wrackholm are seeded in every run: the
    papers and the log go into the bag where Wrackholm's chapter will have carried them.
19. **The act's end-to-end walk is owed to #191** in `tools/tests/quests.ts`, beside the chapter
    #191 owes: the log shows Act II in three chapters and the Wall is played on from Wrackholm's
    with the papers carried from the Tide Ship. The walkthrough puts the papers in the bag by hand
    only through `fromTheTideShip`, and the check fails once Wrackholm's chapter is written while
    it is still used. The start's swap (3) is owed too, and holds only once the Wall's start names
    Wrackholm's done flag and no item.
20. **An order of play may end at a chapter,** and a walkthrough checks only its own chapters' goals
    walked: a quality pull request first (#430), since a third chapter breaks the checks pinned to
    the Grove's seal. Sunderwood's walkthrough runs last in road order, so it checks every
    chapter's goals.
21. **The text was drafted in the voice by a separate agent,** and no line names what the wall is.

Decided by delegate for #19's trainer in Sunderwood, on 3 October 2026, each the owner's to
overturn:

1. **The hermit in J3's clearing is the knight of the Crown that was,** Aylmer: DESIGN §5 has one
   hermit by the clearing, and a second man in it would be a muddle. His name is the Crown's English
   (§10).
2. **His shrine is a sword point-down in a heap of stones, in his words, not a feature:** a shrine
   blesses, the box's luck shrine blesses already, and one that blesses nothing says an empty line.
   The wayside shrine at 7,21 stays the bears'.
3. **He moves from 6,8 to 5,11, the clearing's south-west corner:** at 6,8 he was nine squares from
   the brood on the track; at 5,11 he is 13 from it and 19 and 23 from the den's groups, and the box
   has no road, so the rule Rietum's are held to holds as written.
4. **He is always there,** with no `after`, `until` or `when`: by night, and whatever the den came to.
5. **His words keep the hint:** his three lines stand, the first given the sword in the stones. His
   lesson is a `says` said once to a company with a Lightbearer of 19, keyed to his first meeting
   (`j3_hermit_met`), so every company hears of the two legs before it. The cost, as Mottram's in the
   Foreland: the menu follows his first words, so that paladin is offered the Justicar before the
   lesson.
6. **The lesson is Holy Strike's, on the dead that walk,** not on the den's bears, which are beasts.
7. **He has a `seek` line of his own:** the system's would read "in The Bears' Wood" and say nothing
   of the Eaves or the knight.
8. **The Paladin's second leaves Sunderfall:** §4's places and K2's brief put it at the shrine
   there, and #197's 6 owed it to #19; DESIGN §5 puts it under the Eaves, and J3 is the box. Orm and
   K2's shrine change nothing.
9. **The walk** finds him there from a new game, holds him to the road's and the groups' rule,
   reaches him on foot from the cutters' track, hears the hint before the lesson, and at 19 sends the
   paladin to J3 and teaches the Justicar for 4,000 gold.

Decided by delegate for #203, each the owner's to overturn (where measuring changed the plan, the
builder says so in the decision):

1. **The maps are `lanternwood_l3`, The Moth Wood; `lanternwood_l4`, The Bay Wood; and `lanternwood_k4`,
   The Sunder's Foot,** all three laid whole in Lanternwood, band 15–16, as J3 and M2. K4 takes 270 of the
   Deepthorn's squares and 128 of the Eaves', which go to the owner with #198's 20; `atlas.ts`'s seeds at
   K3's edges and at 370,96 now sit inside laid maps, and go.
2. **The ways make one loop off the road:** L2 to L3 by the bank path through L2's south ring; L3 to L4 by
   the river's bank; L4 to K4 along the shingle; K4 to K3 through K3's south ring at the east lip's dead
   wood. K3 stays closed to L3, and its west lip to K4, so the gorge's foot in K4, which the atlas draws,
   joins only Lanternwood's two lips, and the rope bridge stays the one crossing between the Eaves and
   Lanternwood. K4's west column is rock, sea rows and all: swimming exists, and mountain is climbed.
   Measured, shallows are a swimmer's only, so the river is crossed by a gravel bar in L3 and the shore
   is shingle, not a wade; and K3's ring stays mountain over the chasm, since the gorge drawn open at the
   seam left K3's west lip unreached from its own start.
3. **The moth shrine is in L3's west clearing, kept by Sister Leofrun,** a Lantern who stayed when the
   Watch called its people up out of the depths as the glass came. Her lesson goes Aylmer's way, a `says`
   once to a Curate of 19 after her first words, which are for every company; it is a light kept for
   whoever comes to it, not to be seen by, an answer to the Watch's one lamp without naming anyone. She
   is more than ten squares from any group and the box has no road, and she is reached on foot with no
   secret door. The shrine keeps fire off the company until the next rest and gives no stat: every stat
   has been given once in the area, and its lamp is a shard lit cold that the moths do not burn on.
4. **The groups,** planned at about 500 a member a box, had to be real fights once measured. The plan's L3
   (hounds and a moth; two glass bears) gave 11.4 fights to a rest at 15, L4's (two moths by night; a brood
   of two glass bears; a lone sow) 19.4 and K4's (two sunderlings; two gleaners; a lone deathshead) 20.4,
   all past the limit. Each box now has one hard fight. L3 has two deathsheads by night at the crossing
   for the bears (7.9). L4 has a deathshead and two hounds by night for the moths, and the sow is a pair
   (8.5); two deathsheads and a moth broke off 35% of days, and a lone sow was a free fight. K4 has two
   deathsheads by night for one, and the gleaners a hound; its sunderlings are dropped, too gentle at any
   size that kept the aim (7.3). The three pay about 2,355, not 1,500.
5. **The features:** L3 the shrine, a camp, a cairn (180 gold and a Sapphire Vial) and a fallen wayside
   lamp, L2's dark one's mirror; L4 a cairn (170 and a Vial), the stone Lantern with its riddle (300 gold,
   its answer in Averil's L2 line), a lookout over the bay, a camp on the meadow and the den; K4 a cairn
   (180 and a Vial), a camp, the foot's lookout, a way-mark and an event at the east lip's glass where the
   sunderlings were, for density. No hermit and no repeated stat.
6. **One secret a box, each prize shut in on every side,** so a swimmer, a climber or a levitator reaches
   the hint and never the prize: L3's lamp-house in forest, with a Long Sword +2 and 300 gold, a find that
   sells (a Watch Habit +2 would go against #399's 3); L4's store walled in rock, with a Warden's Dirk +2
   and 1,100 gold; K4's boathouse in forest and rock, with a Flail +2, 300 gold and the Lanterns' Roll, a
   keepsake. The dearest find stays the Sunder's Plate Mail +2.
7. **Ties stay light, and the side quests are untouched:** the statue's answer is Averil's, the gleaners
   carry east to L4's landing, the Roll names the keeper and her lesson answers the Watch's one lamp.
8. **The gold closes:** the depths pay 2,755, the strongbox raised from the plan's 1,000 to 1,100 to clear
   the curve's 6,960, and Sunderwood's owed gold in `progression.ts` goes.
9. **Kilnmouth's line moves, and is not held here:** the zone walk from L4's south and east edges takes
   1,147 of Kilnmouth's unbuilt squares (§1). Holding it wants seeds in `src/content/atlas.ts`, a shared
   file, as #429 held the Fells': proposed, not made here (settled by the Kilns' M4 and M5:
   docs/areas/kilns.md §9, #474's 14).
10. **The text was drafted in the voice by a separate agent.**
