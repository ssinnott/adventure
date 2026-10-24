# The Glasswold's decisions

The Glasswold's decisions (EXPANSION §8.2): the old §9 of its doc, `docs/areas/glasswold.md`, moved
here whole by #1027, every list in its order. It is appended to and never rewritten: a builder adds
a list at its end, and a later decision that changes an earlier one says which. Its current state is
`docs/areas/glasswold.md` and its plan `docs/areas/glasswold/plan.md`.

## 9. Decisions

Decided by the owner's delegate on 2 October 2026 (#443), and followed here:

1. **The lava flow is drawn** (call 5): a `lava` ridge, width 2, from the road's south side at
   about 160,318 south-west through 150,332, 140,348 and 134,362 to the rim at 130,376. The Glass
   is a dead end with a single way in, the gap at the mesas and dunes (B9 and C9), and EXPANSION
   §5.8's reach check passes.
2. **Akordu is the Wold's rest** (call 5): a camp, a trader who sells the band's consumables and
   leather, and a Rider who carries a company to Cinderport and back, a `coach` link open from the
   start (#547). The Wold trains at Cinderport.
3. **The Buried Tower's band is the cap's,** 30–32, as the Ice Caves' is (call 5; MONSTERS open
   question 3 answered).
4. **The Eyrie moves** from 132,289 in D10 to the far-west mesa under the rim at about 46,242 in B8
   (call 5), where DESIGN §5 already puts it and a third is hard to find.
5. **The camp sells and teaches nothing but that trade** (call 7); 51 and 54 are given from
   Cinderport's halls.
6. **The third prestiges built in Act IV are the Eyrie's** (call 8, #448): the Ranger's, the
   Meridian journals followed down Fire Mountain's vents to Meridian Camp and Oriel Fane's map
   brought back to the scout. The Sorcerer's at the Buried Tower's crown is the reach's (Phase 1.6).
   Decided by the owner's delegate, 16 October 2026 (#807): the Sorcerer's comes into v1 at the
   Glass's edge, B9, by the gap the Riders keep (§6).
7. **The cuts stand, the country behind is parked and all four side quests stand** (call 9): §11,
   #534, §6. E9 and E8 are built since, at the owner's word to build Act IV (§4.9).

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.9: each box's landmarks, points of interest, encounters, secret and
  hint, finds and share of the pay.
- **The core** is D9, D8, D10 and B8, the boxes the Riders and their beasts fill; E10, C8 and B9
  are country (§4).
- **The seeds move** so the steppe is the Wold's and the Glass is the fused desert and its dunes:
  the Wold's at about 100,232, 132,262, 50,230, 150,300 and 120,296, the Glass's at about 80,282 and
  100,320 (`src/content/areas/glasswold/atlas.ts`, #523); the fourth, built at 140,296, moved to
  134,296 for #517, just west of E10, since the atlas check holds each zone's seed inside the zone
  and E10, laid for the Waste, now holds that square, and 134,296 keeps the Wold's border where it
  was. The old seeds gave the Glass 993 of D10's 1,024 squares and 440 of E10's 620, the road in
  among them; moved, they give it 49 of D10's (§9, #527's 1).
- **The lava flow's line** as decision 1 has it; the owner's word moves a point.
- **The names** (§10): Akordu, Kushtash and Tashkum, the last left for the reach's doc to decide.
- **The eldest at Akordu,** her own fire, where STORY has her tell the story at the port (#531):
  the chapter's step wants a place on the Wold, and the Rider's ride carries the company between
  the two. The owner may put a second telling at Cinderport's gate, or move the step.
- **The stair's head opened by C8** (#528), an edit to Saltreach's C7, with #412: done, nine of its
  301 squares (§4.6, §9, #528's 3).
- **The pay's shares** (§8), the epic's 12,900 against the curve's 21,067, closed by the fights as
  the boxes are built or rescaled by the owner.
- **The bands on the atlas's rows:** the Wold 26–28, the Glass 30–32 and the Buried Tower 30–32,
  set in `src/content/areas/glasswold/atlas.ts`, where only the scaffold reads them; the owner's
  word changes them there.

Decided by delegate for #542, each the owner's to overturn (docs/areas/ashfall.md §9 has the step):

1. **The Glasswold's row is 26–28, next 28, window 6,000,** owed to #447 with nothing given, as
   the issue has it: 21,067 xp a member and 12,720 gold, the training of six from 26 to 28.
2. **The Wold takes no step on the ladder:** no town sells, and the Riders buy at Cinderport by the
   ride (call 5, #547). A company at 26 wears Cinderport's step. A box that places a piece of it
   with a plus, the briefs' Horn Bow or Shield, takes the Ashwood Bow or the Basalt Shield of
   `src/content/areas/ashfall/items.ts`, off the ladder (docs/areas/ashfall.md §9, #542's 6).

Decided by delegate for #547, each the owner's to overturn (docs/areas/ashfall.md §9 has the rest):

1. **Akordu owes the ride its landing and its seller** (#526): a square at the horse-lines, on its
   end of `RIDERS_RIDE` in `content/crossings.ts` with D8's map as its `map`, and the Rider whose
   `passage` is `sells('wold', RIDERS_RIDE)`. Once Cinderport lands too, the check wants both ends
   to sell it. Built by #526 (§4.4, #526's 5).
2. **The ride is 325 gold and a day** on a Rider's horse, leaving either end at 14 and coming in at
   9 the next day, by the Wold's floor of 26, the dearer end's. Nobody halves it.
3. **The camp is a way in once the ride runs:** the gate counts the landing as a way into the Wold
   (#164's `landings`), so the groups nearest it are held to the zone's gentlest.

Decided by delegate for #533 (the Wold's five on frames), each the owner's to overturn:

1. **Each is the test monster of its roster role and level, on the line #661 made again:** the
   vulture fodder at 26 (191 hit points, 3d8+4), the Wold lion a skirmisher at 26 (332, 3d8+6), the
   glass scorpion a controller at 26 (290, 4d8+4), the basilisk the test basilisk at 27 (376, 5d7+7)
   and the Grey Lion the boss at 28 (1,552, 26d8+29). None is owed a restating; B8's gate may set
   the Grey Lion off the line, as the Act III bosses were set.
2. **The vulture flies, so it reaches the back row** (`ranged`), as the raven and the spine eagle do.
3. **The Wold lion does not leap at the back row,** where the snow lynx does: the mesa's lions keep
   the front row busy, and the test skirmishers behind which #546 tried the basilisk are not ranged.
4. **The glass scorpion's hold is the roster's poison at 0.35,** in place of the controller's
   paralysis; the basilisk's is stone at 0.15 with its gaze reaching the back row, as #546 has it.
5. **None resists anything:** the roster gives none, and nothing of the Wold is fire's.
6. **Sizes:** the vulture 0.65, the Wold lion 1, the glass scorpion 0.7, the basilisk 0.85 and the
   Grey Lion 1.4, under a tall boss's 1.5, so it stands in its group's rank and no crown is held.
7. **Each is owed to the first box whose brief places it** (`UNPLACED`): the vulture, the lions and
   the glass scorpion to E10 (#524), whose brief has all three; the basilisk to D8 (#526), in its
   mesa's shade; the Grey Lion to B8 (#529).
8. **The Wold's glass is green:** the scorpion's shell and the basilisk's crown and crest, where the
   Sunder's is black (the glass spider). A tint and a Build to change.
9. **The defs wait in the area's folder,** listed in `AHEAD` until #524 lists the area, as Ashfall's
   did; the glass walkers' family joins the same file in the second pull request.

Decided by delegate for #533 (the glass walkers), each the owner's to overturn:

1. **A man's shape, not a beast's:** the briefs give a walker a chest that opens (§4.3's and
   §4.8's secrets) and sit one in a horse's saddle (§6), so it is a tall machine in a man's shape.
2. **Older than the vessel's hands, and unlike them:** smooth bronze gone green in its seams, balls
   and rods at the joints, a lamp for a head; no plate on drums, shell on rods or robe.
3. **Fused with its glass on one side:** waded to the knees, its left arm gone into a club of glass
   dragging beside it, shards off the shoulder; the right side bare, the silhouette the glass's.
4. **The glass is the Wold's green** (8 above), lit at its edges, the arm dark through it and a
   light held in it, as the Tower's glass holds one (§4.8); the lamp the basilisk's green-white.
5. **The test elite at 27, on the line #661 made again:** 670 hit points, armour 25, +16, 7d8+7,
   speed 15, 2,147 xp; its hold the elite's paralysis at 0.15, a grip, as the Sentry's is.
6. **A machine** (MONSTERS §2): it never breaks and carries no gold, only parts, none set yet;
   it resists nothing, the roster giving nothing (5 above).
7. **Size 1.2,** a head over a man and under the Sentry's 1.45, so it stands in its group's rank and
   no crown is held; its span [0.39, 0.22], wider on the club's side.
8. **Owed to D9 (#525), not B9:** D9's brief places the first walker, "placed here first"
   (§4.3), so by 7 above it is owed there.
9. **One kind, on a Build:** the Buried Tower's walkers, at their worst (MONSTERS §10.1), are to
   be a Build and a colouring of this frame, not a module of their own.

Decided by delegate for #524, each the owner's to overturn:

1. **E10's band is 25–26,** up from #517's 24–26: the Wold's groups stand at 26 and the issue's gate
   turns back a company under the band. F10 stays 24–26, so onto E10 at 24 the Waste's harder words.
2. **The fewest groups that pass:** four beetles, six vultures and three lions with the drakes, 10.83
   fights to a rest at 25; each set tried with a second vulture group or the lone scorpion missed the
   day's aim (12.3 to 15.7). Both cut, the scorpion owed to D9's dunes (#525).
3. **The beetles stand nearest the way in,** on the ash: at 24 they let the levels rise to the drakes
   at the far end (rank correlation 0.32), where a group at 26 nearest would not.
4. **The Wold's line is its zone row's,** not a crest event: the line is said by level where the
   land changes (#166), an event the same to all. E10 is the Waste's land, so D10 (#527) says it
   first, and C8's stair (#528, walked and not jumped: #528's 2) too, so its words hold both ways in.
5. **The camp is under the hills' east face** (17,22), out of the steppe's wind, by the road below
   the notch, so a company rests before the crest and the grass.
6. **The grave's second hint is seen from the road on the ash:** vultures turning over its hills,
   nothing under them moving. The Rider's word, that they come down where something is about to die,
   is the other half; no text joins them.
7. **The Rider names Akordu** (§10) and the hoofprints north-west, toward D8 (#526); no quest, the
   chapter's and #532's.
8. **Pay 1,881 xp a member,** 2,543 with #517's 662, 1.04 times the scaled 2,450; no gold or find
   added, the grave's Horn Bow +2 and gold standing as the finds.
9. **Nothing new is claimed:** steppe is #517's first, and the vulture, lion and beetle come of
   families already on the road.

Decided by delegate for #525, each the owner's to overturn:

1. **D9 is laid whole as the atlas cuts it,** `wold_d9`, "The Wold", core, band 26–27, region
   `glasswold`, at 104,254 on the Wold's row (band 26–28 kept). The seeds give 913 squares to the
   Wold and 111 to the Ember Waste; a map is one land, so all of it is the Wold's for its crossing
   line and band, as E10 is the Waste's.
2. **D9 lists the area,** as G10 listed Ashfall: `src/content/areas/glasswold/index.ts` in
   Ashfall's form, in `AREAS` after Ashfall; `AHEAD` goes empty (the Area takes the six monsters
   and their sprites), `PLANNED` too, and the atlas's import and spreads leave the plan (the Area
   carries `ZONES`, `PLACES` and `SITES`). The climate is the steppe's: summer 26, winter −4, daily
   11, damp 0.01 to 0.06, wettest day 120, fog 0.1, lag 18; dust for fog.
3. **The road is the atlas's, squared and met at the edges:** four-way steps at 12,25, 14,26,
   19,29, 21,30 and 22,30. Its south crossing moved from the scaffold's 20 to 21,31 to 22 to 23,31
   (126 to 127,285), where D10's side of the atlas has it (the pillars' edge check binds); west it
   leaves at 0,21 (104,275) into C9, toward the gap at 92,272.
4. **A Riders' track of trodden earth,** 30 squares, runs from the road at 15,26 north to the north
   edge at 16,0 (120,254), Akordu's column: the atlas's road goes west to the gap and reaches no
   tent, and the brief wants a track toward the tents with a cairn on it. Earth is no road, so the
   edge check holds. D8 (#526) must meet it at its 16,31 (120,253) or let it fade (§4.4); the atlas
   may want the road drawn to Akordu.
5. **The way in is the road's end on the south edge,** 22,31 facing north (the map's `start`, which
   the gate reads): where the atlas's road comes over from D10's corner, a company's way from E10.
6. **`CUT_OFF` owes D9 to #527:** D10 lies between E10 and D9, which meet at a corner only (§1), and
   the mesas join them. D8 (#526) and the ride's landing there reach it from the north later.
7. **Four groups, the fewest that pass:** two prides of four lions, each with the three vultures
   over its kill in its fight (they land where something is about to die), not flocks of their own;
   four glass scorpions at the dunes' edge; the glass walker alone at the far south-west, the box's
   hardest at 27. Six groups (the prides 4 and 4, the vultures 5 and 5, the scorpions 4 and the
   walker) gave 14.6 fights to a rest, past the limit of 14, at 3,286 xp.
8. **Pay 2,940 xp a member, 0.90 times the scaled share of 3,250** (the doc wins over the issue's
   2,000): each pride 947, the scorpions 689, the walker 358. Under the share because the day, 9.67
   fights to a rest, is at the aim's foot (9.5): no group more fits. With the other scaled shares
   (17,800, E10's 2,450 among them) the area comes to about 20,740, 0.98 times the ask.
9. **Gold 1,350:** the track's cairn 300 and a Sapphire Vial, the dunes' cairn 300 and an Elixir,
   the hollow 750 with an Elixir and the Etched Glass. #533's "a walker carries no gold" holds: the
   hollow is a chest, not a drop.
10. **The secret is the doc's,** the issue's lions' den superseded: the long mound, its mouth a
    secret door at 12,13 (116,267), its hint `d9_ungrazed` (13,13) with the herder's rumour for its
    words, the fallen walker and the chest inside (§4.3).
11. **The thing of glass is `etched_glass`, "Etched Glass"** (slot none, price 0: no shop buys it),
    in the area's new `items.ts`: lines in glass a cartographer would want, nothing explained. Its
    buyer at Cinderport was #532's and #512's, and is not: its taker is the scholar of the
    Sorcerer's third at the Glass's edge (#807), since an item with two takers could be taken by
    the wrong one (#735). Hendra at Cinderport takes the Letter in Cipher, and not the glass.
12. **The horse that came back is seen and no more:** `d9_horse` at 8,17, coming in off the dunes
    toward the herd, glass in its hooves, something still in its saddle. No flag or quest: 51 is
    #532's, with #526.
13. **The brief's places are each a feature,** eighteen for its nine (§4.3): the well a fountain
    that gives endurance, the tents seen from the middle, two cairns, the herd and its herder, the
    old Rider (the hermit, words only), the kills, the lions' lie, the Glass seen from a dune and the
    walker's tracks. The glass in the grass, `d9_glass` (18,29), is the chapter's id for #531.
14. **The Wold's crossing words are #524's,** on the zone row beside D9's map: D9's own first words
    are dropped, E10's having merged first and been made true both ways in (#524's 4). Not walked:
    no built map meets D9, and D10 (#527) is the first Wold map entered.
15. **Novelty claims the glass walkers and dunes,** both new by the check. Steppe is E10's first,
    the lions the cats', and a herd has no token (it is an event).
16. **The gate:** the Wold's road is the four groups by steps from the way in (pride 11, scorpions
    20, walker 22, north pride 26); the gate names the area ("the Glasswold"); D9's and the
    Glasswold's figures two under the floor are judged by the day (#851), as every box's.
17. **`UNPLACED` drops the glass scorpion and the glass walker,** placed here; E10 dropped the
    vulture and the Wold lion (#524).
18. **The quests test** owes the Wold's step (its `PLANNED` zone) and the Glasswold's chapter
    (`CHAPTER_OWED`) to #531; the walkthrough is new, in Ashfall's form.

Decided by delegate for #527, each the owner's to overturn:

1. **D10 is laid whole as the atlas cuts it,** `wold_d10`, "The Wold", core, **band 26–27, not the
   brief's 27**: the curve holds a map's hardest group at its floor plus one or its top less two,
   whichever is higher, so a floor of 27 asks a group at 28, and the Wold's one 28 is the Grey Lion,
   B8's boss. 26–27 is D9's, the basilisk alone at 27 the top; the gate holds at 26 and so at 27.
   The cut gives the Wold 659 squares, the Ember Waste 316 and the Glass 49; a map is one land, so
   all of it is the Wold's for its line and band.
2. **D10 is the zone's way in:** first on the `wold` row and in the Area's `maps`, in road order,
   its `start` the road's east end, 31,6 facing west, where E10's road comes over. The gate's
   warning reads the zone's first map's start.
3. **The road is the atlas's at both edges and square to square between,** 22 squares, west along
   the great mesa's south foot and north up its west side; the atlas's diagonal ran over the mesa's
   rock.
4. **The great mesa is rock at 24 to 31, rows 0 to 5,** with D9's rock above it on its rows 30 to
   31; its top an enclosed grass of 18 squares, the Eyrie's cold fire-ring at 28,3 (132,289). Hills
   lie under it.
5. **The notch is on D10's side,** the mesa's north face proper being D9's, built: a nook of scree
   at 24 to 26,0 and the secret door over it at 26,1 (130,287), entered going south. At 26, not 25,
   for the art check (25,1 is dressed).
6. **The hint is the last figure,** `d10_glassed_rider` at 21,4, a Rider of glass with his bow still
   drawn on the mesa's face above the scree. The four round the great mesa stand on one line out
   from the scree and face north-east; the small mesa's three face it. No text names the notch.
7. **The small mesa is the atlas's west outcrop,** rock at 0 to 3, rows 15 to 22, with a skirt of
   hills at its east foot.
8. **Five groups, the fewest that pass and the brief's kinds,** for its eight: two prides, the mesa
   fight, four glass scorpions (a second group after D9's) and a basilisk alone. The vultures fight
   in the near pride, as D9's do, and have no flock of their own. The prides stand nearest the way
   in (9 steps each) so the zone's warning reads gentle groups; the mesa fight comes third (15
   steps), the lone basilisk last (40), the hardest by level.
9. **The mesa fight is the basilisk behind three lions,** #546's shape, a basilisk behind three
   skirmishers: the box's costliest fight, 12% at 26, and 9.2 fights to a rest. A fourth lion was
   not added: the pay sits at the share, the day at its aim.
10. **The basilisk is set to nothing:** #533's test basilisk as it stands (27, 376 hit points, stone
    0.15, its gaze `ranged`). The gate needs no tuning, the mesa fight won 100% at 26, so no
    `OFF_LINE` entry.
11. **Pay 3,199 xp a member, 0.98 times the scaled share of 3,250** (the doc's, over the issue's
    2,000): near pride 947, south pride 689, mesa 695, scorpions 689, basilisk 179. The Wold's row
    stands at 6,139 of 21,067; with the other scaled shares the area comes to about 20,690, 0.98
    times the ask (§8).
12. **Gold 1,500:** the Riders' cairn 400 and an Elixir; the hoard on the top 1,100, a Basalt Shield
    +2 and a Quickening Draught, so a company that climbs without one is not stranded. The shield is
    Cinderport's step with a plus, `basalt_shield+2`, 1,700 gold, made in the area's `items.ts`. The
    Wold stands at 2,850 gold of 12,720.
13. **The brief's places are each a feature,** twenty-one for its nine (§4.5): the mesa seen from
    the way in, seven glassed figures, the nest, the hoard, the ring, the view (the Glass whole and
    a dark crown standing up out of the glare, nothing said of what it is), the Riders' cairn, a
    Rider on the hill (words only: she goes no nearer), the glare, the kill, the lions' lie, a camp,
    the sky-stone (a shrine, luck), a horse's bones and a glass hare.
14. **The Wold's words are walked over E10's west edge,** the zone row's own, nothing changed: true
    at the border, grass on both sides, E10 (25–26) the gentler. D10 onto D9 says nothing, one land.
    What they read by level is in §4.5.
15. **Novelty claims `inflict:stoned`:** no placed monster inflicted stone before (the Mechanic
    token exists). The draught has no token.
16. **`UNPLACED` drops the basilisk,** placed here first (#533's 7 owed it to D8). **`CUT_OFF` drops
    `wold_d9`:** the reach test passes without it, 1,005 of 1,005, and the list is empty.
17. **The gate:** `ROADS.wold` is D10's five groups by steps from the way in, then D9's four; D10's
    figures two under the floor were rows of `OWED` until #851 judged the day, as every box's.
18. **The way-in event is `d10_mesa_seen`,** not `d10_mesa`, the mesa fight's group id.
19. **Stone's cure is walked in the walkthrough:** the hoard's draught lifts a glassed member and a
    temple asks 80 a level (2,080 at 26). Cinderport's temple and chandler stay Ashfall's
    walkthrough's.

Decided by delegate for #526, each the owner's to overturn:

1. **The band is 26–27, not the brief's 27,** and the gate holds D8 at 26, as D9 and D10 (#527's 1):
   the curve's rise check holds a box's hardest group at max(floor + 1, top − 2), 28 for a band of
   27 alone, and nothing on the Wold but the Grey Lion, B8's boss, is past 27. `wold_d8`, "The
   Wold", core, region `glasswold`, at 104,222, second on the zone row `wold`. B8's band, 28 in
   §4.7, will need the same: a one-level band wants a group above it.
2. **The atlas wins over §4.4's prose on the mesa:** it stands north of the site, rock in rows 13 to
   22 and columns 10 to 19, and Akordu's site (120,250, local 16,28) and the ride's link are fixed
   south of it. So the camp lies under the mesa's south face, not its north, and the basilisk in
   its shade on the north side, 13,12, not at the box's south, where it is the group furthest from
   both ways in, as the curve's rise and the gate's landing check want. §4.4 is corrected.
3. **The camp is trodden earth,** 67 squares in an oval round the fires, its rest the camp feature
   `Akordu` at 16,27. Nine squares of white felt make the ring of tents, in the map's `palette`
   (wall #e4dac8, `'tent'` since #736): the eldest's against the mesa at 16,23, five round the ring (13,24;
   19,24; 11,27; 13,30; 19,30) and the trader's, three squares and a door facing in.
4. **Two ways in:** the map's `start` is the end of D9's Riders' track on the south edge, 16,31
   facing north, its earth going on into the ring; the ride's landing at the horse-lines, 9,27
   facing east, is the second (the gate's `landings`).
5. **The ride's Akordu end** (`src/content/crossings.ts`) is the landing `wold_d8` 9,27 facing east,
   `owed` dropped and its label kept. Its seller is "A Rider at the lines" (9,26), with `passage:
   sells('wold', RIDERS_RIDE)`: the end's `at` is the zone `wold` (#547's 1), and `sells('akordu')`
   would throw. Cinderport's Rider (9,13) already had `sells('cinderport', RIDERS_RIDE)`, which
   sells by itself now, so Cinderport's map is unchanged. The fare is #547's, 325 gold and a day.
6. **The trader is a shop with a room of its own:** "The Trader's Tent" at 21,27, interior
   `akordu_trader`. The maps check wants every business to have a door and a room of its own, and
   no tent room existed, so the builder drew one, an art-lane piece the shop needed:
   `src/ui/interiors/glasswold/akordu_trader.ts` (white felt on its lattice, roof poles to the
   crown, three leather coats on a pole, a horse's skull with a red brow, the painted chest, sacks,
   a dung brazier), listed in the area's new `interiors.ts` and registered in `src/ui/interior.ts`.
   It sells at list price the band's consumables (rations, torch, lantern oil, healing draught,
   antidote, elixir, the blue and sapphire vials), the Quickening Draught (`CURES`, #546) and the
   Leather Coat; nothing of steel (call 7), and no inn, temple, guild or trainer at Akordu.
7. **Leather:** `leather_coat`, "Leather Coat" (armour 12, 2,400 gold, `NO_CASTER_HEAVY`), in the
   Wold's `items.ts`: a step under Cinderport's Drakeskin (13, 3,100) and off the ladder, #542's 2
   giving the Wold no step. The hoard holds `leather_coat+2` (14, 2,700), the Riders' own make. The
   trader sells no Bearskin or Drakeskin (Rimewater's and Cinderport's).
8. **Three groups, the fewest that pass:** a pride of four lions by night (`when: { hours: 'night'
   }`) at 4,21, west of the horse-lines; six glass scorpions at 22,17, in broken ground under the
   mesa's east face (six rocks laid there); the basilisk alone at 13,12, the hardest at 27. It must
   be alone: the curve wants the hardest group to average 27, and only a basilisk or a walker is 27.
   The vultures over the garden are seen, not fought (`d8_vultures`: they turn over it and never
   come down). The brief's four groups (pride 4, vultures 5, scorpions 4, basilisk) gave 16.3
   fights to a rest at 26, past the limit of 14, and a flock heavy enough to count, 8 vultures,
   takes the pay past the cap.
9. **Pay 1,901 xp a member,** 0.97 times the scaled share of 1,950: the doc wins over the issue's
   1,200. The cap is about 2,440. Gold 1,500, all in the hoard. The Glasswold's owed row is set to
   4,841 xp and 2,850 gold, "the Glasswold is built box by box" (§8).
10. **The secret is the doc's: the dry well with no rope.** The hint is `d8_ropeless` at 13,23
    against the mesa's foot (no rope, no bucket, the horses watered at the others). The mouth is a
    secret door at 13,22 (117,244), searched facing north, into a hollow of two squares cut into
    the rock at 12 to 13,21, with rock added at 12,22. Inside, `d8_hollow` (13,21: bronze plates, a
    lamp of glass, a hand of metal, laid in rows, what the Riders took from the walkers) and the
    chest `d8_hoard` (12,21): 1,500 gold and the Leather Coat +2. The issue's hint, the eldest's
    story, is superseded (21).
11. **The eldest is G10's,** the Riders' eldest at the port's trading ground, a horse-blanket and a
    braid white to the waist: "The eldest" at 16,24, before her tent. Her first meeting is the whole
    telling (a look and four lines) and sets the flag `akordu_story`, exported as `STORY` from the
    map for #531's step to key on; after it her `says` holds, so the story is told once. Her first
    line carries on from D9's old Rider ("the grass stood still and the birds came down out of the
    air"). No word of a hull, ship, orbit, voyage or Custodian; the walkthrough checks for those
    words. Her words are in §4.4, for the owner's review.
12. **People with words only,** with no flag, quest or choice (#532's): the Rider at the lines, who
    sells the ride; a young Rider (8,29), who wants the last blow at the Grey Lion, the eldest
    saying let him die (53); a Rider with a hammer (5,25), who waits to break what sits the horse
    (51); a woman among the figures (26,27), whose son went to look at the basilisk (55).
13. **The horse that came back is `d8_horse`** at 4,24, tethered apart from the lines, glass in its
    hooves, the thing in its saddle unmoved since it came in. It matches D9's `d9_horse`, in off
    the dunes with something very still in the saddle. No flag.
14. **The garden:** six crystal squares (`c`) east of the ring (25,24; 27,24; 26,26; 28,26; 25,28;
    27,28), with the events `d8_garden` (23,25: the figures face south-west), `d8_figure` (25,26: a
    boy, his hand to his eyes) and `d8_vultures` (29,25). Crystal draws purplish and the Wold's
    glass is green in every text, so D8's says "glass" and no colour.
15. **The mesa's watch-fire** is two events on 15,23, `d8_watch` by day (smoke) and
    `d8_watch_night` (a fire), as Cinderport's mountain is two.
16. **Shrine and wells:** `d8_shrine` at 19,21 against the rock (might), a post hung with horses'
    tails, one for each Rider who rode into the Glass; two `well`s, at 18,22 under the mesa and
    6,29 by the lines, beside the dry one.
17. **The rest of the box:** the herd (4,4), skull poles at the grazing's end (9,1), the view from
    the hill's crown (20,5), a dead foal (28,4), Riders on the skyline (28,14), graves (4,12), lion
    tracks toward the lines (7,17), a glassed horse in the mesa's shade (17,12, the basilisk's
    sign) and the broken ground (22,21). D8 has 30 features, 32 points with the groups, the
    watch-fire's two sharing a square.
18. **Novelty claims nothing of its own.** The stone is D10's, first on the road (#527's 15); the
    check refused the `camp` landmark, which is on the road before.
19. **`ROADS.wold` is unchanged,** D9's four: D8 lies north of the steppe, off the road to the gap;
    the landing's warning check holds its groups instead.
20. **Test entries:** gate OWED `wold_d8: under` (100% won two under, as every box's; dropped by
    #851); maps `UNPLACED` has lost the basilisk to D10 already; ladder `CURE_SOLD` for the
    Glasswold is '', so #546's second half is settled and nothing stays owed for the cure; outdoors,
    D9's north edge is re-pinned against D8 and D8's four edges are pinned, `CUT_OFF` being empty
    since D10 (#527's 16). The walkthrough rides the Rider both ways.
21. **The issue is superseded by the doc in three places:** its glass walker "once, at the camp's
    edge by night" (the walker seen is the one in the horse's saddle), its hint "by the eldest's
    story" (the ropeless well) and its 1,200 xp (the doc's share is 1,950). Its squares, "810,
    steppe 657, rock 85, hills 68", are not today's cut: the scaffold gives steppe 845, hills 94
    and rock 85, its zones in the cut the Wold 845 and the Saltings 179. A map is one land, so all
    of it is the Wold's.

Decided by delegate for #736, each the owner's to overturn:

1. **A tent is a low felt wall under a felt pyramid to a crown,** not a whole block with a roof set
   on it: a block with a hat still reads as a box. Its walls are square, as the grid's squares are,
   not round as a yurt's.
2. **Tent squares that fill a rectangle are one tent,** sixteen at most: the trader's two by two at
   Akordu, its door with it, is one tent with one crown. An L of them, or any other shape, is a tent
   to each square.
3. **The band round a tent's foot takes the palette's banner colour,** with ochre lozenges as inside:
   D8 sets no banner, so it is the outdoors' red, near the trader's felt. The flap takes the
   palette's door colour, D8's dark brown.
4. **In a town a house stays a house whatever the palette;** `'tent'` there is felt walls with no
   roof. Felt carries no wall dressing.
5. **C8's yurt takes `'tent'` too,** though the issue names D8 only: it is C8's one building square,
   standing clear at 6,2, white felt as Akordu's tents are, and C8 has no other building or door
   for the felt to turn.

Decided by delegate for #528, each the owner's to overturn:

1. **The band is 26–27, not the brief's 27,** and the gate holds C8 at 26, as D9, D8 and D10 (#527's
   1, #526's 1): the curve holds a box's hardest group at max(floor + 1, top − 2), so a floor of 27
   wants a group at 28, and the Wold's one 28 is the Grey Lion, B8's boss. `wold_c8`, "The Wold",
   country, region `glasswold`, at 72,222, fourth on the zone row `wold` (D10, D9, D8, C8).
2. **The stair is walked, not jumped:** C7's column 8 is opened from the notch to C7's south edge
   and meets C8's last flight at 8,0, so the Wold's crossing line is said on the step onto C8: the
   stair's head is the border. A jump from the notch (#616) would need the atlas's link moved, both
   its ends (80,206 and 80,216) lying on C7 and the atlas check wanting a jump's two squares beside
   the link's ends. The brief keeps the link the plan's, so it is untouched and walked, and the
   zone row's comment, which said "a jump: #616", now says walked.
3. **Of C7's 301 Glasswold squares only the stair's nine are opened,** with the owner's leave (#412,
   #528). Opened whole they would be the Wold's grass on a band 11–12 map of the Saltings, walked
   with no line until C8 and bare of points (C7's density). The Scarp's mass stays closed; the lip
   is C8's north edge, a row of cliff but for the stair, a knot of rock at the cleft and steppe at
   the east end, where the lip bends north toward D7.
4. **The way past the fall is a rope ladder,** pegged to the flight above (`c7_stair`'s new words).
   No flag and no lock: the stair is open both ways from the start, and the walkthrough climbs it
   at 12, 25 and 26 and comes down again.
5. **C8's way in is the stair's head,** `start` 8,1 facing south, which the curve's rise reads. A
   company on the road walks in over the east edge from D8 as well.
6. **The watch** is trodden earth, 11 squares, round the head: the yurt, one square of white felt
   in Akordu's palette (6,2), the watch-cairn (9,2), the two Riders (10,1) and the fire, a `camp`
   (#45) (9,3). The yurt sits at 6,2 and the cleft's door at 22,2 because the art check (walls
   dressed as before #9 must fail) wants a small map's two wall squares dressed by the old rule and
   under today's cap: at 7,2 the yurt was dressed today, and at 21,2 the door was bare under the
   old rule.
7. **The runner** is "A Compact runner" on the last flight, 8,0, words only (#56's 54 is #532's).
   She carries the Dead-Drop's orders for the Riders and does not name the cleft: the secret is
   found.
8. **The line at the top is an event,** `c8_line` (once) at the head, in a Rider's voice. The zone
   row's crossing words come with it, said by the engine at the company's level on the step before.
9. **Three groups, the doc's kinds, the fewest that bring the day inside its aim:** six vultures on
   the lip's updraught (27,3); the pride at its lie in the grass (12,19), four lions with three
   vultures waiting over it, D9's pride; and **two basilisks** in the hills at the box's east
   (28,27), the hardest at 27, not the doc's one. With one basilisk (29.4 fights to a rest alone)
   the day at 26 ran to 13.1 fights to a rest, off its aim of 9.5 to 11.5; a flock of eight with
   the lone basilisk gave 12.5; the pair (13.1 alone) brings the day to 10.46. None stands within 12
   steps of the head: the nearest, the vultures, are 21 off.
10. **Pay 1,822 xp a member,** 1.10 times the scaled share of 1,650, under the cap (about 2,060):
    the vultures about 516, the pride 947, the basilisks 358. The Wold's row stands at 9,861 of
    21,067; with the other scaled shares (E10 2,450, B8 4,250, B9 2,600 and the side quests 1,650)
    the area comes to about 20,810, 0.99 times the ask (§8).
11. **Gold 1,100:** the cleft 900 and the letter; the watch-cairn 200 and an Elixir. The Wold stands
    at 5,450 gold of 12,720.
12. **The secret is the doc's cleft.** The hint, `c8_prints` (22,3, not once), is a shod horse's
    prints along the lip to the rock and back; the Riders' horses are unshod (D9's herd) and no
    text says so. The mouth is a secret door at 22,2 (94,224) in a knot of rock at the lip,
    searched facing north. The cleft, 22 to 23,1, is stone, shut by rock on every side: rock and
    not cliff, since a Mountaineer climbs cliff and mountain and not rock. The walkthrough checks
    that nothing reaches it but its mouth. Inside are `c8_cleft` (22,1) and the chest `c8_drops`
    (23,1).
13. **The letter** is `cipher_letter`, "Letter in Cipher" (slot none, price 0), in the area's
    `items.ts`. Nobody on the Wold reads it and no shop buys it. What takes it was owed: Lantern
    Watch's reader (#204) or the Compact's hall at Cinderport (#512, #532); neither was edited here
    (§11). Hendra, the Compact's factor at Cinderport, takes it since #735: a hand-in at her first
    meeting, hired or not, unread, for 200 gold (`q_cipher_taken`).
14. **Novelty claims nothing new:** C8's ground (steppe, hills, cliff, stone, rock and earth), its
    features and its kinds are all on the road before, cliff and stone being Ashfall's and the
    Whitespine's. The brief's "a way into an area from two acts back" has no token.
15. **`ROADS.wold` is unchanged,** D10's five groups then D9's four: C8 is off the road, and the
    gate reads the zone's way in from its first map.
16. **Test entries:** gate OWED `wold_c8: under` (100% won two under, as every box's; dropped by
    #851); outdoors: D8's west edge, which faced the void, is pinned square for square against C8's
    east edge; C8's four edges and C7's south edge are pinned; `CUT_OFF` stays empty; maps has
    nothing to drop, D8 having dropped the basilisk's `UNPLACED`. The Glasswold's walkthrough asks
    of the zone row that it hold D8 at 104,222, not that it be exactly D10, D9 and D8.
17. **The issue is superseded by the doc in three places:** its secret, a smugglers' cache hinted by
    the runner's orders (the doc's is the cleft, hinted by a horse's prints: 12), its 1,000 xp (the
    doc's share is 1,650: 10) and its squares, "367, steppe 314, hills 53", which are not today's
    cut: the scaffold gives steppe 971 and hills 53, its zones in the cut the Saltings 528 and the
    Wold 496. A map is one land, so all of it is the Wold's.

Decided by delegate for #529, each the owner's to overturn:

1. **The band is 27–28, not the brief's 28.** The curve's rise rule holds a box's hardest group at
   max(floor + 1, top − 2), which a band of one level cannot pass: at 27–28 the hardest must be 28,
   and the Grey Lion, the Wold's one 28, carries it. The gate's company is tuned at 27, where the
   third prestige comes. `wold_b8`, "The Wold", core, region `glasswold`, at 40,222, fifth on the
   zone row `wold` and last in the Area's `maps`.
2. **Three groups, the fewest that pass,** for the brief's eight. Priced at 27, each alone (the
   harness, fights to a rest): a pride of four with three vultures 11.3; four lions and a basilisk
   10.7; three lions and two basilisks 8.6; a glass walker alone 30.0; two walkers 10.8; four lions
   alone 18.8; six vultures 22.8. The pride and the mesa fight make a day of 10.91 (aim 9.75 to
   11.75) at 4,784 xp a member with the boss. A third group lifts the day off its aim (the walker:
   about 13.9) or the pay past the cap (two walkers or a second pride: about 5,500, 1.30 times the
   share). `b8_pride` (27,13) is four lions with three vultures down on their kill, nearest the way
   in, 13 steps; `b8_mesa` (24,23), in the scree under the lesser mesa's south face, a basilisk
   behind four lions, the brief's basilisk behind a pride; `b8_grey_lion` (17,19), the boss, on open
   steppe between the mesas.
3. **The Grey Lion is alone,** not with his pride: the boss is judged by itself at its gate, a pride
   with him adds about 344 xp a member against the cap, and the lion the eldest would let die is the
   old one left alone on his ground. `roams: false`, no respawn, and a `slainText`.
4. **The second pride, the vultures over the kill-ground and the walker are seen, not fought:**
   `b8_vultures` (a dozen turning low over the kill-ground, never landing, until the Grey Lion's
   `slainText` has them begin to come down), `b8_tracks` (the walker's prints up out of the south,
   glittering) and `b8_lie` (a pride's lie in the south-east).
5. **The Grey Lion is set off the line by the gate,** in `OFF_LINE` (`tools/tests/harness.ts`), as
   the Stair's head's boss was (#502): the boss line's 1,552 hit points and 26d8+29 (average 146)
   become 3,000 and 16d8+16 (average 88); level 28, armour class 27, attack 18, xp 17,813, size,
   look and sprite kept. On the line he fell 86% at 27, past the limit of 80%, and 92% at 29. Tried
   with the gate's company, 100 seeds, at 27, 28 and 29: 2,000 and 26d8+29, 63, 72 and 74%; 3,100
   and 16d8+16, 60, 82 and 81%; 3,050 and 16d8+16, 68, 88 and 86%; 3,000 and 16d8+20, 70, 82 and
   86%; 3,000 and 16d8+16, 75, 90 and 91%. The step from 28 to 29 is flat, so the floor and two
   above cannot both sit at their aims; 3,000 and 16d8+16 keeps two of the three at aim (two above,
   and the box's floor pool, 91.7%) and the floor's 75% between its aim (70%) and its limit (80%).
   3,050 would put the floor at aim (68%) and the pool, 89.3%, and two above, 86%, off it.
6. **The boss is on the gate's list:** `BOSSES` has `wold: ['wold_b8:b8_grey_lion']` in
   `tools/tests/gate.ts`, and the gate leaves him out of the day.
7. **Kushtash, the way up (the secret):** the atlas's rock mass under the rim (columns 2 to 13, rows
   11 to 19) is kept, its top carved out and shut by rock (`r`, which no Mountaineer climbs) on
   every side. The secret door is at 2,17 (42,239) on the mesa's rim side, searched from 1,17 facing
   east; inside, stone steps up the face, 3,17 to 3,14, then the ledge, 4,14 and 5,14, onto the top
   at 6,14 (46,236). The top is 24 squares, rows 14 to 17 (columns 6 to 10, 5 to 11, 5 to 11 and 6
   to 10). The walkthrough checks that nothing reaches the top but the steps (859 squares walked,
   waded, climbed or floated) and that the steps' foot reaches the 30 squares inside. The door sits
   at 2,17 and not 2,16 because the art check wants a map's wall squares dressed by the old rule and
   bare today, and at 2,16 the square was bare under both.
8. **The hint is the doc's:** `b8_smoke` (8,10, no `when`, so the pillars check holds), smoke off
   the top and the vultures never over it; `b8_fire` (14,12, `when: night`), the fire on the top
   seen from the kill-ground; `b8_scree` (1,17), in front of the door, one run of the scree bare of
   lichen. No text says there are steps until they are found (`b8_steps`). The issue's "hinted by
   the eldest" is superseded by the doc.
9. **The scout** is the npc 'The scout' at 8,16 (48,238), words only: she guided the Meridian
   Company, and says nothing of the journals, the map or what she would teach. People have no `id`
   field, so #448 finds her by the map `wold_b8` and her name (or her square) and adds her `teaches`
   and her asking there. Neither she nor the hermit ('A hermit under the rim', 3,24) is named, as
   the Riders at C8's watch are not: §10 has nothing to add.
10. **The hunters' camp is the second rest on the Wold,** after Akordu: a `camp` at 25,5 (65,227) on
    trodden earth, 7 steps from the way in, unnamed as D9's, D10's and C8's camps are (only Akordu's
    has a name). It reads as the hunters' fire in a ring of saddles, the Riders' second peopled
    camp.
11. **The young Rider and the eldest's word are words only:** 'The young Rider' at 24,4 and 'A Rider
    from Akordu' at 26,6, who brings the eldest's word, let him die on his own ground. D8 already
    has 'A young Rider' at the horse-lines with near the same words; one boy in two places is #532's
    to settle (`until` or `after`).
12. **The shrine gives speed** (`b8_shrine`, the running horse in white stones, 10,27): E10's gives
    accuracy, D9's well endurance, D8's might and D10's luck, and C8 has none. The walkthrough
    checks that no other Wold shrine gives speed.
13. **The rim:** column 0 is mountain on all 32 rows, the rim's foot as the source reads, and row 0
    is the Scarp's lip, cliff from column 2 and mountain at the corner. The outdoors lays a zone
    map's mountain that faces nothing built as the world's end (`src/game/outdoors.ts`), so in play
    column 0 and the corner are void and the box's open land is columns 1 to 31, as at C7's corners.
    The doc's §1 has the rim as the A column, cut.
14. **Finds, 2,200 gold:** the hunter's saddlebags on the kill-ground (the chest `b8_saddlebags`,
    15,20), 1,600 gold and an Elixir; the Riders' cairn on the north hill (`b8_cairn`, 16,2), 600
    gold and a Quickening Draught, for the mesa's stone. The scout gives nothing. Nothing comes near
    the window.
15. **Novelty claims nothing:** B8's ground (steppe, hills, rock, cliff, stone, earth), kinds (cats,
    birds, salamanders) and features are on the road before; the brief's "a third prestige's trainer
    on a mesa top" and "the area's boss on open ground" have no token.
16. **`ROADS.wold` is unchanged,** D10's five groups then D9's four: B8 is off the road, and the
    gate reads the zone's way in from its first map.
17. **Pay 4,784 xp a member,** 1.13 times the scaled share of 4,250, under the cap (about 5,310):
    the pride 947, the mesa 868, the Grey Lion 2,969. The Wold's row stands at 14,645 of 21,067 xp
    and 7,650 of 12,720 gold (2,200 here: 14); with B9's 2,600 and the side quests' 1,650 to come
    the area comes to about 18,900, 0.90 times the ask (§8).
18. **Test entries:** gate `BOSSES` (6) and harness `OFF_LINE` (5); maps drops the Grey Lion from
    `UNPLACED`; outdoors pins B8's four edges, and C8's pin no longer wants the void west of it;
    `CUT_OFF` stays empty; the gate has no OWED `wold_b8: under`, B8's floor being above the area's,
    so its groups count two under in the Glasswold's pool.
19. **The issue is superseded by the doc in three places:** its 2,600 xp (the doc's share is 4,250:
    17), its "795 squares" (860 are open) and its hint, "by the eldest" (the doc's is the smoke: 8).

Decided by delegate for #448 (the Ranger's and the Thief's), each the owner's to overturn:

1. **The scout is Aysu** (§10), named as the other thirds' trainers are, so the seeking goal reads
   "Find Aysu, the scout in The Wold."; her words from #529 stand as her first meeting's.
2. **The map is given at her question, not handed in:** a question after her ask with Fane's map in
   the pack, whose answer takes it and sets `q_scout_map`, her `done`. A hand-in would take the map
   from any company that climbs Kushtash, ranger or not.
3. **No group placed and no pay:** the fights are Meridian Camp's three levels as built, 26 to 28,
   won at 27 in the walkthrough; no gate, density or curve figure moves. The prestige is the pay.
4. **Done when she has the map,** as the Whitespine's thirds are done on their deeds; her menu
   teaches in the same meeting. She has no words after it but her own: the people check plays a
   question's after-words without the item its answer takes, so they could not be kept.
5. **The Lost Expedition is untouched:** it ends on `meridian_map`, which Fane's giving sets; the map
   leaving the pack for Aysu does not undo it, and the walkthrough checks so.

Decided by delegate for #530, each the owner's to overturn:

1. **The band is 26–28, not the brief's 28 nor B8's 27–28.** The curve's rise rule wants the hardest
   group to average max(floor + 1, top − 2): at 27–28 that is 28, which only the Grey Lion is (the
   walkers' pair averages 27), and at 26–28 it is 27, which the walkers are. The gate's company is
   tuned at 26 (no third prestige): 10.41 fights to a rest, where at 27 the same five groups make a
   day of 19.7 and the larger groups that would bring it in would lift the pay past the cap.
   `wold_b9`, "The Wold", country, region `glasswold`, at 40,254, sixth on the zone row `wold` and
   last in the Area's `maps`.
2. **The brief's five groups, each passing:** two of four glass scorpions, six vultures, a glass
   walker alone and two walkers at the gap. All respawn in 2,880 minutes and none is a guardian.
3. **Cut by hand:** `tools/scaffold.ts` refuses the box (its glass and void have no map character),
   so the rows were made from the atlas: its glass is the mesa's rock and the rim's foot, its void
   the rim's mountain.
4. **The gap lies at the south-east seam with C9:** row 27, its last square 31,27 (71,281), open,
   with no exit and the void past it. The east edge from row 14 down and the whole south edge are
   rock or the rim's foot, laid as the world's end, so it is the box's one open square on the
   Glass's side (the issue's "the gap is the Glass's one way in"; the walkthrough checks it).
5. **The south edge is the rim's foot,** all mountain and laid void, where the atlas has dunes and
   glass at columns 20 to 31: left open it would be a second way into the Glass (B10).
6. **The east edge down to row 13 is the atlas's steppe and dunes,** open against C9 and parked;
   C9's north is the Wold's by the seeds, its to join.
7. **The watch is three people, words only,** round the fire at 21,25, each with `flag: WATCH`
   (`'gap_watch'`, exported from `maps/wold_b9.ts` as D8 exports STORY), so the first met sets it.
   The yurt is in the camp's words: no building square, so no palette to colour the secret door.
8. **The chapter's step (#531) may key on the flag `gap_watch`** (the watch heard) **or the once
   event `wold_b9:b9_glass`** (the Glass and the crown seen from the gap's last square), or both;
   the walkthrough sets and sees both.
9. **The crossing line into the Glass is the Riders' to say** (§2, §4.8): the once event `b9_line`
   at the stones, 27,27, a Rider's warning in the line's own form, the same to every company; read
   by a company under 28 it is the warning, as the Wold's own is to a company three under. The
   Glass's zone row (`theglass`) is left as it is, with no band and no `crossing`: nothing can cross
   into the Glass while it is void, so a zone line there could not be said. Were the Glass built at
   the cap's band (30 to 32), its row would give a company under 28 its `warning` and one at 28 or
   29 its `harder`, with the event the same words.
10. **The two walkers need not be fought to see the Glass:** `roams: false`, aware 2, under the
    mesa's west face; the way from the fire to the gap's last square never comes within 2 of them
    (checked). The walkthrough sees the gap first and fights them after.
11. **The secret is the half-buried walker** in the dune at columns 13 to 16, rows 17 to 19, the
    door at 16,18 (56,272) searched from 17,18 facing west. The hint is `b9_still` at 17,18, the
    dune that does not shift (no `when`), with `b9_shifting` at 12,10 for the dunes that do. Inside,
    the walker and the chest `b9_cache`: 1,600 gold and the glass. The art check passes with the
    door there.
12. **The item `glass_light`, "Glass with a Light",** slot none, price 0, two lines of `text` (read
    from the pack), no use, skill or resist: a plain item until the reach. Its light is the walkers'
    lamps' cold green-white, a thing seen. Since #807 the scholar in the gap asks for it, and reads
    the Etched Glass by it.
13. **Finds, 2,000 gold:** the Riders' cairn at the dunes' head (`b9_cairn`, 13,4), 400 gold and an
    Elixir; the cache, 1,600 and the glass.
14. **The camp** is the watch's fire (21,25) on trodden earth in the last grass, a patch of steppe
    at the gap's mouth (rows 22 to 27, columns 18 to 26), unnamed as the Wold's camps are, the box's
    one rest.
15. **The horse that came back** (#56's 51): `b9_horse` at 26,4, one horse's prints, deep, going
    north: seen, no quest.
16. **The walker's tracks:** `b9_tracks` at 29,27 in the gap, where the sand gives way to glass: one
    set going out and no mark on the glass.
17. **Novelty claims nothing:** the dunes and the walkers are D9's claims; "the reach seen from the
    road" and "a machine in a pair" have no token.
18. **No road:** `ROADS.wold` is unchanged; the Riders' road does not run through the dunes.
19. **Test entries:** the gate's OWED `wold_b9: under`, as D9, D10, D8 and C8 (two under, at 24, it
    wins every fight; dropped by #851); outdoors pins B9's four edges, and B8's pin no longer wants
    the void south of it; `CUT_OFF` stays empty; and the scaffold test's example of ground no map
    character is moves from the Wold's glass at 70,262, which B9 now covers, to the Glass's at
    72,262. No B9 monster is on `RESTATE` or needs `OFF_LINE`, and `UNPLACED` had nothing of B9's.
20. **Pay 2,968 xp a member,** 1.14 times the scaled share of 2,600, under the cap (about 3,250):
    the scorpions 689 and 689, the vultures 517, the walker 358, the two walkers 716. The Wold's row
    stands at 17,613 of 21,067 xp and 9,650 of 12,720 gold (2,000 here: 13); with the side quests'
    1,650 to come the area comes to about 19,260, 0.91 times the ask (§8).
21. **The issue is superseded by the doc in four places:** its 1,600 xp (the doc's share is the
    scaled 2,600: 20), "the gate holds at 28" (held at 26: 1), its landmark "the lava flow's end
    against the rim" (not in the box: the flow ends at 130,376) and its hint "by the Riders' store"
    (the doc's is the dune that does not shift: 11).

Decided by delegate for #531, each the owner's to overturn:

1. **Three ways in, one chapter:** it begins on `q_road_west` (the road or the ride) or on the stair's
   head with the Stone lit; the Stone is asked so a company that climbs at 12 is not sent on.
2. **The stair's head ends The Window too** (its `done` widened, one line in Ashfall's chapter), so a
   company that never walks the road west is not left with The Window open and its road unwritten.
3. **`d8_east` is gone once the stair's head is seen** (`until`), so the ride's landing never writes
   the road over the Hills for a company that came up the stair; E10's `e10_west` is Ashfall's (§11).
4. **The done flag is `q_road_east`, set at Akordu's horse-lines:** Cinderport is Ashfall's map and
   its band ends at 26, so the chapter ends on the Wold, where the ride east is sold.
5. **The done waits on the eldest and the watch as well as the Glass,** so nothing a person says is
   written into the chapter after it is done; the goals name what is missing first.
6. **Akordu keys on D8 visited,** not `d8_akordu`, so the ride and the Scarp's edge write it too; its
   goals say "the Wold", the atlas's Akordu being lettered on the world, not on D8's map.
7. **No step at the heart:** the way to the gap goes through B8 under the rim, and Kushtash is the
   Ranger's (§6); the walk wins the gap's two walkers at 28, the Glass kept by them in fact.
8. **The eldest's entry is the land burned to glass,** the part she did not tell at the port; what it
   cost is The Window's `eldest`, not said twice.
9. **The stair's warning is an entry,** `stair`, written for any company at the cairn; it stands
   before Akordu in the journal, where the stair puts it.
10. **No xp of its own,** §8 giving the chapter no share.

Decided by delegate for #532, each the owner's to overturn:

1. **Pay is §8's 1,000 xp a member between the four, shared by level,** whichever way each goes:
   200 for 51 at 26, 250 for 53 and 54 at 27 and 300 for 55 at 28 (1,200, 1,500, 1,500 and 1,800
   shared by six), under the scaled 1,650 as Ashfall's 800 was under its 1,100; no gold or group.
2. **51's question is the Rider with a hammer's, put to any company:** break it (`q_horse_broken`)
   or take it whole (`q_horse_carried`, the Walker from the Saddle), each paying 1,200 there. Cador
   Lusk asks (`q_horse`) and takes it at any meeting, the first too (`q_horse_whole`, a hand-in).
3. **The glass walker that sits still is D8's `d8_horse`,** gone (`until`) once broken or taken; no
   group is added. D9's sighting and B9's prints are read into the log (`seen`), neither map edited.
4. **Broken, the Rider says it turned its head at night to look back south-west;** carried, the
   Guild inks the Glass's edge. The Etched Glass keeps no buyer: the Chart House takes the walker.
5. **The young Rider is at Akordu until the company will hunt with him** (`q_lion_hunt`), then at
   the hunters' fire on B8 (`after`), as #76 places a person who moves; let die (`q_lion_left`), he
   stays at Akordu. The question is his, so the eldest's first telling stands as built.
6. **The rite's fight is B8's Grey Lion as built, and the boy's last blow is told:** a fight has no
   ally to strike in it, so once the lion is down the boy says the last blow was his, at the
   hunters' fire, and his question sets `q_lion_blow` and pays. It is the nearest honest means.
   Decided by the owner's delegate, 16 October 2026 (#729, cut, not planned): it stays told. An
   ally is a third side in the combat resolver, which the gate, the harness and the walkthroughs
   test, for one blow in one side quest, and no other quest wants one.
7. **Let die, the eldest tells the rest once, after her first telling** (`q_lion_told`): what fell
   stands in the glass on its end, as it stood to climb, the crown the watch sees from the gap; no
   word of what it is. The Grey Lion is not gated (a group's `until` leaves a standing one, and the
   quests are not locks); killed after all, the boy says so.
8. **A lion killed before the boy is answered is nobody's blow** (`q_lion_taken`): the quest ends,
   paying nothing, and a company that never met the boy never has it.
9. **Hunted, the camp's trade adds nothing:** the trader sells from the start (call 5), so the
   boy's being a Rider is words.
10. **54's three answers are §6's,** put by the eldest at Akordu, where the watch sends a climber:
    given sealed (`q_scarp_sealed`), told (`q_scarp_told`) or burned (`q_scarp_burned`). The
    letter is the runner's orders (`riders_orders`, read from the pack); the cleft's Letter in
    Cipher is Hendra's to take, unread (#735, §11).
11. **Hendra asks (`q_scarp`), and the runner gives up the orders only to a company Hendra sent**
    (`q_scarp_carried`); burned, her next climb finds the company, in her words.
12. **55's son is the garden's boy** (`d8_figure`, gone once carried): the mother gives him
    (`q_garden_carried`, the Boy of Glass), and a priest at the Harbour Temple's door, there only
    for a company that carries him, takes him in (`q_garden_brought`).
13. **The priest lifts the stone at 2,240, `templePrice` for a stoned member at the quest's 28,** or
    a Quickening Draught of the company's does (`q_garden_lifted`, `q_garden_draught`), each paying
    1,800. A member's Absolve cannot reach a boy in the pack, so the temple's is the spell's way.
14. **55 pays at Cinderport,** so the curve counts its 300 a member in Ashfall's clear and the other
    700 here: a clear of the Glasswold gives 18,313, the owed row's floor (§8).

Decided by delegate for #534, each the owner's to overturn:

1. **Band 26–27 for both, not the brief's 27–28:** the curve wants the hardest group at the floor
   plus one, of ordinary monsters, and the Wold's ordinary top is the basilisk's 27; its 28 is the
   Grey Lion's, B8's guardian, never repeated.
2. **E9 is laid in the Wold,** though the atlas's walk gives 448 of its squares to the Ember Waste:
   the box is the brief's, the Wold's terrain is the most of it and a laid map seeds its zone, so
   the Waste loses them. The Wold's crossing words read true over E10's north edge, the road being
   E10's, and the walkthrough says them.
3. **E9's south row is laid square for square to E10's built north row** (the atlas differed at
   seven squares: columns 0 to 3 hills to steppe, 16 to 18 hills to grass, 19 hills to ash; row 30
   eased to meet it), and its west column is all steppe, as D9's east is.
4. **A bar of shallows runs from E8's strand to each of its two islands** (row 13, x 8 to 20; row 2,
   x 5 to 12; deep sea to shallow): the atlas rings them in deep sea, and the density check fails a
   square nothing reaches. They are a swimmer's now, with a point on each and a cairn on the mares'
   island; the Rider and the boy say why the mares are out there, not how to get there. The world
   map, painted from the grid, shows them: `worldGrid` takes a built map's cells last, and all 21
   squares of both bars read shallow there. Decided by the owner's delegate, 16 October 2026 (#735,
   struck): there is nothing to paint.
5. **E8's 13,0 is laid as sand,** not the atlas's shallow, so that its water does not run into E7's
   sand (the pillars check).
6. **Each box has a pride, a flock and a basilisk pair:** the pride is the Wold's shape (four lions,
   three vultures); E8 needs a 27 group too by the curve's rule, and the basilisk is the Wold's only
   ordinary 27 outside the Glass, so a pair basks at the strand's north end (the brief has one, in
   the hills). Three basilisks in E9 gave 6.80 fights to a rest, past the limit of 8, so a pair and
   a light flock instead.
7. **Pay is 1,563 xp a member a box,** 1.12 times the 1,400 asked: the flocks are what the pace
   needed. The clear is 21,439 of the 21,067 asked, 1.02 times.
8. **Gold is 3,100 in four finds:** E9 1,600 (cairn 400, strongbox 1,200) and E8 1,500 (island cairn
   300, sea-chest 1,200), with an Elixir or a Sapphire Vial each. No gear, no new item and no find
   the Wold sells twice. The clear is 12,750 of the 12,720 asked.
9. **The owed row is removed** (`CURVE.glasswold.owed`, #534): the curve test says both asks hold.
10. **The secret doors stand at E9's 12,17 and E8's 3,19:** the art check rolls a hash per wall
    square and a lone secret door can fail it by where it stands; the first places, 11,17 and 3,18,
    did, so each moved one square.
11. **No den (#88):** with three groups each box pays 1.12 times its share and paces just over its
    aim; a den's keepers and brood would pay further over and move the pace further off.
12. **No exits in either box;** no new monster, item or art.
13. **E7's 132 squares of the Wold's island are cut, not built:** no issue covers them and the
    issue's Done when says the land left void in the Glasswold is only what is cut and the Glass, so
    they are cut (§11). Decided by the owner's delegate, 16 October 2026 (#737): left cut. They are
    a swimmer's island with no quest and no reason in the story, and a box would need a real fight
    for the pace check, a curve re-read and E8's north edge re-pinned, for land the road never
    needs.

Decided by delegate for #807, each the owner's to overturn:

1. **Two steps, not one hand-in for both.** A hand-in holds one item (`NpcQuest.item`) and a meeting
   makes one, so no map can take both glasses at one meeting; a hand-in of two items is a systems
   change, outside the area's lane. The Etched Glass is a hand-in, taken at the first meeting that
   holds it from any company (#43); the Glass with a Light is taken at his question once the etching
   is his, so the reading comes with the second glass whichever is found first.
2. **The etching first, the light second:** he wants what is written, and takes it on sight; the
   light is what he reads it by. Brought alone the light is not taken; the etching is, unread, by
   the hand-in rule, so "only if both are held" holds for the light alone.
3. **Eadmer, the scholar** (§10), at 30,27, between the walker's tracks and the last square: the one
   free square in the gap a square or two in from 31,27, past the Riders' stones. A person stands on
   a square the party walks onto, so the way to the Glass stays open; no square, id or door moves.
4. **Begun by his ask or by the etching, done on the Magus,** as the Cleric's third is (#763): the
   quest begins on the ask, or on the etching given by a company with a sorcerer of 27 with the
   second. Both glasses can be given and read before the sorcerer is 27, and a quest done on the
   reading would then come up begun and done at once with no goal back to him, so it ends on the
   Magus and its last goal sends the company back. His teaching waits on `q_etching_read`, no gold.
5. **His reading says what was cut and never what it is:** the land and the sea, a wall at either
   end and a line across the top. His "lid" is the Hand's word on the causeway (DESIGN §9). The
   walkthrough holds every word he says to the box's ban on what the crown is.
6. **No words after the reading but his own,** as Aysu's (#448's 4): the people check plays a
   question's after-words without the item its answer takes. No group and no pay; `shipped.json`
   adds four flags. B9 gains a point of interest, 26, and its density, its curve and the gate's
   10.41 fights to a rest at 26 stand.

Decided by the owner's delegate for #18, each the owner's to overturn:

1. **The Master of arms is an old Rider who drilled the Riders,** hidden in the mesas of D10 or D9
   behind a secret door or in a cleft not within ten squares of the road and not on the quest's
   path, hinted as the area's secrets are (the hint rule, `MOST_LINES`).
2. **Found, never told:** no `seek` quest and no world-map mark; the rumour at Akordu's Trader's
   Tent (D8), in the Riders' voice, two lines.
3. **The favour is a thing found in a hidden place of the Wold,** hinted in his words and never
   bought, never on the quest's path: an `npc.quest` hand-in that sets a flag his `done` tests.
4. **He teaches** `mastery: { line: 'arms', tier: 'master', done, price: 5000 }` to a member Expert
   at arms and of level 25 (DESIGN §5).
5. **The voice:** two lines to an event, three at most; British spelling; the font's glyphs.

Decided by the builder for #858, each the owner's to overturn:

1. **The hide is the small mesa's rock,** not the great mesa's top: the top lies a few squares from
   the road and is a secret already, where the small mesa on D10's west edge is 21 squares from
   the nearest road square, 23 from the chapter's nearest step and 17 from the nearest walk between
   two steps. The door is cut in its east face
   at 3,20 and the hollow behind it from the rock at 1 to 2,20; the mesa's west edge, pinned in
   `tools/tests/outdoors.ts`, is untouched.
2. **The door is a second secret door in D10, its hint the arrows in the mesa's foot**
   (`d10_butts`, 4,20): a thing seen on the near side that explains nothing. The glassed round the
   small mesa already face it, and the arrows say where in it. The hint rule and the pillars pass.
3. **He is Mergen, the drillmaster** (§10), at 1,20, who hires with `master_arms_met` at his first
   meeting so that his later words are short. No journal, atlas site or seeking names him.
4. **The mesa's lone basilisk stays where it is:** the door's approach, 4,20, is beside its square,
   4,19, so a company fights the box's hardest group at 27 to stand at the door, as it must to
   pass the mesa's foot anyway. No group is added, moved or retuned.
5. **The rumour is a Rider by the trader's tent** (21,28), words only, at any meeting and with no
   flag, since the shop has no words of its own: two paragraphs, a look and one saying, giving the
   kind of place (the mesas, south of the grass) and neither his name nor a square.
6. **The favour is his bow** (`drill_bow`, the Drill Bow: no price, no use, no shop, no drop), kept
   by the herders and found in E9's store behind the slab where their path stops, in a chest with
   no gold at the store's back (`e9_drill_bow`, 9,17). His words say the herders and where
   their path ends; they say nothing of the door, which E9's own hint (`e9_path`) shows. E9 has no road
   and lies 21 squares from the chapter's nearest step and 12 from the nearest walk between two.
7. **The store gains one square,** 9,17 cut from its ring's rock, and the ring is closed by turning
   the hill at 8,17 to rock, the one walkable square any change here takes away. Every id, door
   square and chest id stays where it was and no chest is changed: the strongbox is as it was, so
   a save that has emptied it can still find the bow.
8. **The hand-in takes the bow at the first meeting that holds it, from a company that never met
   him too** (the etching's rule, #807's 1), with words for a stranger. The flag
   `master_arms_favour` is all his `done` tests, and nothing else sets it.
9. **No journal entry, no quest and no mark for the favour:** he is found and never told, so the
   bars of his menu ("favour first", "Expert first", "level 25", "no gold") are all a company is told.
10. **The price is the literal 5,000 in the map,** not `TIER_PRICES.master`: a map is loaded with the
    content, and `game/mastery.ts` reaches the quests, which read `MAP_DEFS`, so a map importing a value
    from it would read the maps half loaded (#852's call 1). The walkthrough, which runs after the
    content is loaded, imports it and holds the two equal.
11. **The walkthrough plays him in `masterOfArms`,** a fresh company at the Wold's floor, 26, whose
    fighters are given Expert at arms through `teachTier` and 6,000 gold directly, as Expert is bought
    at a town trainer elsewhere on the road (#852); the one taught is set to 25, the level he asks,
    and the next to 24. `tools/tests/mastery.ts` forbids every file under `src/` but four to read a
    tier, and a walkthrough is under `src/`, so it reads the bars of his menu and not the tiers.
12. **"Off the road and off the path" is measured as the larger of the two axes** on the world's
    grid (Chebyshev), the strictest of the usual measures, from every road square, from every
    square the chapter's conditions key on (the events it has seen, the people and events that set
    its flags, the maps it visits) and from the walks between one step and the next in story order,
    each the rectangle every shortest walk lies in: 17 for the hide and 12 for the bow.
13. **Nothing in the numbers moves:** he pays no xp, gold or group, and §8 stands. DESIGN §9 now
    says the road holds two Masters and the reach may hold more.

Decided by the builder for #833, each the owner's to overturn:

1. **The bounds' brief is §12,** after §11, in §4's form, for D7, E7, the enclave and the lair, in
   three pull requests: D7 and E7 with the brief, then the enclave (#845 is in), then the lair once
   #847's powers and the Foal-taker's drawing are in (the owner's delegate's order on #828).
2. **D7 is the Wold's, whole,** at 26–27 as E8 and E9 are: with the built maps laid, 200 of its 363
   walkable squares are the Wold's and 163 the Saltings'. The Saltings' strip under the Scarp, 117
   squares, is walked onto from C7 and D6 alone and the Scarp keeps it from the lip: no group stands
   on it and nothing on it pays, and the crossing line names the Wold there with its warning, as
   C2's top names the Upper Water (docs/areas/saltreach.md §12.2).
3. **The Scarp is the atlas's cliff in D7,** as C8 draws it: the cliff is the Whitespine's novelty,
   before the Wold on the road.
4. **D7's corner with C7, C8 and D8 is shut, and D8's 0,0 and C8's 31,0 with it.** C7's 31,31 is its
   ring's mountain and D8's 0,0 was steppe, so D7's 0,31 could not agree with both. The two are
   dead-end corner squares, their neighbours joined round them, with nothing on them; shut to
   mountain, every seam there agrees, no row is added and the C7/C8 row of `SEAMS_AS_BUILT` loses
   square 31 (28 to 30). A company saved on either loads on the mountain and steps off, as on B6's
   0,31 (#920). The rest of D7's west edge on top is mountain against C7's ring, as C7 closed its
   own.
5. **E7 is the Wold's, whole,** 66 of its 96 walkable squares against Wrackholm's 30, **and is shut
   against E6.** No road joins Wrackholm and the Glasswold, so the seam rule lets no company cross
   there: E6's south shore at 13 to 26, 14 squares of hills and sand, is shallows now, E7's north
   edge deep water, and the isle's tip in E7 its last rocks. E6 is Wrackholm's map, outside the
   area's lane; its shipped files do not change, and a company saved on that shore loads in the
   shallows and wades off.
6. **E7's island is a swimmer's,** as E8's islands are, joined to the islet by a bar of sand, **and
   holds no group**: no lion has been on it (E8's Rider), and a group there would be the swimmers'
   alone. A bar the tide covers was tried first; the tide check refuses ground it cuts off. Its seven
   points are its sights and the hollow: no cairn, shrine or camp, the swim and the hidden find being
   its reward (EXPANSION §5.3).
7. **D7's groups are four vultures, three lions and two glass walkers,** sized with the harness at
   26 and passed by the gate at 9.95 fights to a rest; a walker alone paced 24 and two vultures'
   flocks too light, and no pride with its flock, E8's and E9's shape. The two under figure, 67% of
   the floor's day, stands between its aim, 66.7%, and its limit.
8. **The finds are gold, an Elixir and a Sapphire Vial,** as E8's and E9's are: the dearest healing
   and spell points Cinderport sells; the Wold sells nothing and no gear is given.
9. **The lair's door is left at D7's 19,24,** in the Scarp's east face over the gulf, as #846 has
   it, **and the enclave's at 8,30,** in the hills over Akordu's box, each bare with the square
   before it open (§12.4, §12.5). The enclave's is the diggers' cut into Karaordu since (19) and the
   lair's the shelf into Kushdag (23).
10. **The secrets' hints are a smell and a sound,** kinds no box of the Wold had: tar from the
    beacon's rock (D7) and the wind in a crack (E7). Each door stands where the art check takes it.
11. **The walkthrough walks the bounds in one function,** `theBounds`, called last.
12. **D7's north edge meets D6's south edge letter for letter** (salt, tidal ground, shallows, the
    sea), D6 built first (#830's B7 and D6, #923): `saltings_d6 south` and `saltings_c7 east` go
    with the merge and Saltreach's block of `OPEN_ON_NOTHING` with them; no row comes.
13. **The enclave's groups and its reward are named in its own pull request** (§12.4): the roster
    stands at 26 to 28; what keeps a barrow at 28 and 29 and what it holds are settled there under
    #845. They are named since (15, 16).
14. **The enclave is Karaordu,** the black camp, *kara* and *ordu* in the Riders' tongue: the khans'
    camp under the hill over Akordu, the white camp of the living. Both parts are in NAMES §2's row,
    so it stands as it is (§10).
15. **Its groups are four basilisks and eight deep rats:** the basilisks at the passage's head, the
    nearer, and the rats among the khans' bones, the hardest at 30. The curve asks an enclave at
    28–29 for a group at 29 or over (`nearTop`); the Wold's ordinary monsters stand at 26 and 27 and
    its 28 is the Grey Lion, a boss, so the brief's "the roster's heaviest" cannot be met from the
    Wold alone. The Hearth's deep rat, fodder at 30, is the one beast drawn at 29 to 31, the rest
    the Hand's people and the deep's machines; its family is no area's novelty, and the enclave
    stands with the Glasswold in the novelty check, its floor at the area's top. From the one way in
    a walker passes the basilisks' square, the passage a square wide, so it meets them first, as the
    curve's steps do. The rats stand at 7,11, on the square before the hint's, so that the hint is
    searched from beside them and the sabre is had past them and not round them. Sized with the
    harness at 28: two basilisks gave 28.7 fights to a rest and four 10.1; five rats 20.2, eight
    10.2 and nine 9.2.
16. **Its reward is the Khan's Sabre,** the eldest khan's, in his cell: 2d12+5, one-handed, for the
    four martial classes, its blows carrying cold, at 6,950 gold, inside the enclave's window, the
    Hearth's 7,000 (#845's 3). It has the Levin Mace's numbers and price with cold for lightning:
    Cinderport's Slag Mace (2d12+5 at 2,300) with a die of cold, so 21.5 a blow to the Hand's Grey
    Blade's 19 at 28, as the Levin Mace's is; on no rung of the ladder and not the area's artifact.
17. **The secret and the finds are as briefed:** the horses' skulls set in rows on the chamber
    floor, every one turned to the end wall, are the hint, and the eldest khan's cell behind it
    holds his chest, 300 gold and the sabre. The khans' gold among the biers is 1,400 and an Elixir.
    The cell is shut to walkers, waders, climbers and floaters but through its wall.
18. **New here:** the enclave itself (#845), the Wold's first place past its band.
19. **The door is the diggers' cut at D7's 8,30,** the square drawn as stone in the hills' face and
    walked into from the steppe at 8,29 (the hills either side walk into it too); nothing else of D7
    changes, and nothing stands within four squares of it. Karaordu's plate, where the world map
    draws a company inside, is at 112,225, under the hills five squares south of the door.
20. **The walkthrough walks it in `theBounds`,** after D7: the door's words at 25, 26 and 28, the
    sign, both groups won at 28, the cell found from the skulls and the way out onto 8,29.
21. **The lair is Kushdag,** the bird's mountain, *kush* a bird and *dag* a mountain in the Riders'
    tongue: the Scarp's end where the bird nests. Both parts are in NAMES §2's row, so it stands as
    it is (§10).
22. **It is one level of 16 by 16,** as §6 gives it (an eyrie of one level), marked `enclave` at the
    cap's band, 30–32. It has one plate on the world map, at 123,219, five squares under its door,
    as Karaordu's is under its own.
23. **The door is the shelf at D7's 19,24,** the Scarp's cliff there drawn as stone and given the
    one exit, walked onto from the lip at 18,24 (19,25 under it is grass too). Nothing else of D7
    changes and nothing stands within four squares of it. D7's walkthrough lines hold its two ways
    out now, Karaordu's and Kushdag's.
24. **The guardian's group is the Foal-taker alone,** as #846 gives it, standing at 9,6 where the
    shelf comes down the face before the nest. A fight starts next to a group and groups never move,
    so no company steps round it. Nothing in the lair is had without the fight: the nest, the chest,
    the buckle and the cleft all lie behind it (the walkthrough's flood). It is a boss (`boss`),
    with no `respawn` and a `slainText`; the lair holds no other group.
25. **The Foal-taker's numbers are set at the gate's company** (MONSTERS §4.1, §4.2 and §13): 2,900
    hit points, attack 23 and 18d8+20 a blow, where it was drawn at the line's boss at 32, 2,100, 20
    and 34d8+41, which the gate's company won 16% at 30 and 28% at 32. As set, it is won 57% at 30
    (inside the aim) and 81% at 32 (between the aim, 90%, and the limit, 75%), as the fixture lair's
    guardian (57% and 80%) and the Kilns' Steiger (56% and 81%) are; no check moves. Of the rows
    tried, none put it inside both aims: 2,600 hit points gave 75% and 89%. Its row gives why it
    stands off the line (`offLine`), as the road's bosses set by their gates do (`OFF_LINE`).
26. **Akkush lies alone in the Rider's chest at the nest's edge** (3,9), past the Foal-taker: the
    Rider of the eldest's rumour lies there, picked clean, a long case beside him; the chest is his.
    The walkthrough asserts that no shop, chest, cairn or statue holds it elsewhere and no monster
    drops it.
27. **The secret is the bird's cache,** a cleft behind the nest whose wall is at 7,12. The hint is a
    Rider's belt buckle wedged in the rock before it (7,11), scored by a beak, which tells nothing
    of a door. The cache holds 800 gold, an Elixir and a Sapphire Vial, the dearest healing and
    spell draught the Riders' trader sells; like the chest it lies behind the fight. The cleft is
    shut to walkers, waders, climbers and floaters but through its wall.
28. **The rumour is the eldest's,** DESIGN §9's two lines at every meeting once she has told the
    oldest story, in the two entries after the lion's rest so that a company that has heard it hears
    them too; her own words at a later meeting stay and the two lines follow them. The entries set
    no flag: she sets `akordu_story` at her first meeting already, so a company from an old save
    that has heard the story hears the rumour at its next meeting. They hold until the Foal-taker
    is slain, and two entries of her own words alone follow them: once it has fallen, it comes for
    foals no more. Words only, no quest or mark (#846). It is the one change to Akordu.
29. **The lair's two owed rows go:** `foal_taker` from `owes.unplaced` in the area's `checks.ts`,
    which leaves the Glasswold owing nothing, and `akkush` from `UNPLACED` in
    `tools/tests/items.ts`, as EXPANSION §8.2 (#897's 12) and #847's 6 say the lairs' pull requests
    do; each check holds now, so an owed line left in would fail.
30. **The eyrie's walls are the dungeon's `stone` under a vault coloured for the sky.** The viewport
    has no style for a place open to the sky (`wallStyle` is stone, brick, smooth or tent,
    `ceilingStyle` vault or beams): one would be a systems change and no lair's to make, so the
    shelf's drop is told in the texts and not drawn.
31. **§12.5 is the lair's brief in §4's form, with its As built.** It is #833's last piece:
    every box, the enclave and the lair are built, and no built map of the Glasswold is open onto
    unbuilt land but onto the reach, the Glass. The area's `OPEN_ON_NOTHING` rows are D10's south
    and west, D9's west, C8's south and B9's east; none faces a crumb.
