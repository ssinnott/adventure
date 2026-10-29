# Rimewater: step VIII of the road, the lochs under the glacier

Rimewater's doc is three files (EXPANSION §8.2, #1011), and this, its current state, is read first.
Its decisions, the old §9, are `docs/areas/rimewater/decisions.md`, appended to and never
rewritten. Its plan is `docs/areas/rimewater/plan.md`: the old §4 (the boxes' briefs, §4.1 to
§4.8), §11 (what was cut) and §12 (the bounds, §12.1 to §12.5) whole, then under "Moved from the
state" the lines of the old header, §1, §3 and §5 to §8 that this file does not keep, each under
the heading it had, among them §1's squares, §3's atlas rows and drawings, §5's lock, §6's table,
the guilds' quests, the Wakerobe's brief and §8's figures box by box. §2 stands here whole, and so
does §10, the naming pass: #929 dropped its heading and left it at the end of §9, and it stands here
under its heading again. The figures are main's at `5231c94d` (24 October 2026), as the suites
print them.

Its ids: the area `rimewater`; its zones `longmere` (Loch Fada), `coldmere` (Loch Fuar) and
`glacierfoot`, the reach's; the town `rime_lodge`; the bay's two levels `sleepers_bay` and
`sleepers_bay2`; the enclave `creag_fionn`; the lair's two levels `spittal` and `spittal2`; and the
reach's dungeon `ice_caves`, planned.

## 1. Where it is

The eighth step of the road of levels (DESIGN §4, §9) and the last of Act III: three zones
of the atlas (`src/content/areas/rimewater/atlas.ts`) on the grid of boxes 32 squares a side
(EXPANSION §8.2), the J to O columns from row 9 to row 12. Loch Fada, band 20–21, is M9, L9, L10,
L11, M10, M11, N9 and L12; Loch Fuar, band 21–22, is K9, K10, J9, K11 and K12. K12 and L12 are the
bounds' (#832). Glacier Foot, the reach, is N10, O9, N11 and O10, cut whole to Phase 1.6 (plan,
§11) but for its slivers in M11 and N9, drawn closed. The town and the dungeons stand off the grid:
Rime Lodge behind M9's gate; the Sleepers' Bay under K9's door; Creag Fionn in L12's rim; the
Spittal behind K12's door.

- **North: the Rimefells,** the ridge between Cairnmoor and Rimewater. The drove road comes down
  from Cairnmoor's N8 by the notch onto M9, the only way between the two and open from the start.
- **East: the glacier,** coming down from the rim into Glacier Foot, the reach (DESIGN §9), void
  until Phase 1.6. M9's east edge is the glacier's edge, where #56's 43 ends.
- **South: the Whitespine** (Act IV). The high pass climbs out of K10 and leaves by its west
  edge for Monks' Vale, walked on across J10's corner to J11, open from the start.
- **West: mountain,** I9 and the Whitespine's J column; no way through.

Three edges open on nothing (`openOnNothing`, `src/content/areas/rimewater/checks.ts`): K9's north,
onto K8, the sea; and M10's and M11's east, onto N10 and N11, Glacier Foot, shut until Phase 1.6.
`node tools/worldmap.ts out.png --zones` paints the zones.

## 2. What it is for

The end of Act III (DESIGN §9): *what are the Stones?* Machines, and people came here with them.
Rimewater is the cargo coming home and what follows it (MONSTERS §7.3). At Rime Lodge people come up
through a hole in the ice that the lodge-keepers hold open with fire, blue-lipped, a few a night,
taken below from all over the world; the doors down there opened for some of them and not for
others, the captain's line tested on its victims (DESIGN §9). The company stands the four nights.
On the fourth the machine that counts the cargo comes up after them, and the last one out is a girl
of about fifteen with a nail in her fist and her hair frozen to her face: Wenna of Gullwick, whom
the company has been sent after since F3 (docs/areas/shelf.md §5). She leads it down to the sealed
door under Loch Fuar, which opens for her palm and calls her Captain, and inside are the rows of
long glass beds, every people of Caldera asleep four hundred years (STORY, Act Three). The chapter
ends south, over the pass, after the two hundred she left behind.

It is where the machines first look like people (MONSTERS §7.3): the keepers, tall, grey and gentle,
whose touch puts the company to bed beside the sleepers, and whose walk the monks of the Whitespine
have under their robes. It is Act III's one story lock, the bay's door (EXPANSION §2.3; call 4), the
Lanterns' fourth hall, where tier 7 is sold (DESIGN §7), their skills are taught, Linguist among
them (#538), and their fourth rank opens (call 8), the act's second gear step by 21 (#535) and
training to 23. And it is where the reach is first seen: the glacier at M9's east edge, and a guide
who says the sky came down to the ice and there are stairs in it (#56's 43).

The weather is the lochs': cold and still, snow lying, ice from autumn, clear nights.

## 3. What is built

Nineteen maps (`src/content/areas/rimewater/maps/`), a row each: its id and name, kind, size and
band; what is there, with its groups (the gate's count); and its secret, a door at the squares
given, with the hint that finds it (the map's `secrets`). Sixteen maps have one; Rime Lodge, the
bay's stair and the Spittal's upper level have none.

| Map | Kind, size, band | What is there | Secret, and its hint |
|---|---|---|---|
| `longmere_m9`, M9 | outdoor, 32×32, 20–21 | Rime Lodge's box, which lists the area: the drove road down the notch from Cairnmoor's N8, the coach yard and the lodge's gate; the loch's frozen head, the ice-hole and its fire, the fourth night's tallyman and knockers and the girl out of the hole after them; the glacier's edge, its old marks and the guide (§6); eight groups | 29,24, the hollow in the ice: the one bare face of the glacier at 28,24 (`m9_glacier`) |
| `rime_lodge`, Rime Lodge | town, 16×16, 20–22 | the stockade behind M9's gate: the Lanterns' fourth hall (tier 7), the healer's, the furrier's (rung 21), the provisioner's, the coach house, the trainers' yard to 23 and The Thaw, the inn whose stays count the nights; the side quests' people (§6) | none |
| `longmere_l9`, L9 | outdoor, 32×32, 20–21 | the long loch's shore: the drove road west under the pines and over the ridge between the lochs; a drover in his bothy who hears a bell under the cold loch; the milestone, the cairn and the lookout on the ridge; four groups | 24,8, the drovers' shieling: fence posts out into the snow at 25,8 (`l9_posts`) |
| `coldmere_k9`, K9 | outdoor, 32×32, 20–22 | Loch Fuar: the cold loch's arm frozen over the drowned village of Fuar, its bell tower's cap out of the ice; the crack down to the door in a wall of grey, Act III's one story lock (§5); the old bank and a house-place; eight groups | 13,18, the drowned smith's hole: the clear strip of black ice at 16,18 (`k9_strip`) |
| `sleepers_bay`, Under Loch Fuar | dungeon, 16×16, 20–22 | the stair under the ice from K9's door, THE BLOOD OPENS THE DOOR on its inside; two ways that meet at its foot and the voice in the wall; two crews of tallymen and knockers and the first keeper; three groups | none |
| `sleepers_bay2`, the Sleepers' Bay | dungeon, 16×16, 21–22 | forty glass beds in four rows, every people of Caldera asleep in them; the keepers in three rows and the Matron alone in the last (boss); a back door under Kiln-script that opens for nobody; four groups | 7,2, the locker: the path worn between the beds at 7,3 (`sb2_path`) |
| `coldmere_k10`, K10 | outdoor, 32×32, 20–22 | the high pass: the bridge of split logs, three new graves, the milestone and the pass's mouth, the chapter's last step; the pilgrims from Anvilhall camped below it (§6); eight groups | 16,11, the Lanterns' cache: the dark wayside lamp, its jar full, at 16,10 (`k10_lamp`) |
| `coldmere_j9`, J9 | outdoor, 32×32, 20–22 | Loch Fuar's far shore, off the road: an old woman of Fuar at her turf hut, her drying-ground, a cairn and a bell stone that gives luck; two groups | 4,21, the trapper's store: axe blazes on the pines at 9,21 (`j9_blazes`) |
| `coldmere_k11`, K11 | outdoor, 32×32, 20–22 | south of the pass, off the road: the pines down to the cold loch's foot, the rim's crags and Monks' Vale's grass behind them; a cairn and a camp in a windthrow; one group, the bears in the cleft | 23,11, the ice-cutters' ice-house: the sledge of sawn ice at 25,9 (`k11_sledge`) |
| `longmere_l10`, L10 | outdoor, 32×32, 20–21 | the cold loch's head, the road across its corner to K10: dead pines and an old road in the ice, a trapper, the fishers' camp and a holed stone that gives endurance; two groups | 10,6, the old trappers' store: blazes on the pines to bare rock at 8,6 (`l10_blazes`) |
| `longmere_l11`, L11 | outdoor, 32×32, 20–21 | the pines under the ridge's end: the cats' pinewoods and the bog, the tar-burner at his kiln and a cat cut in a boulder that gives speed; two groups | 5,20, the earth-house: a long mound with a stone like a lintel at 7,20 (`l11_mound`) |
| `longmere_m10`, M10 | outdoor, 32×32, 20–21 | the loch's foot: an ice fisher at the fishers' camp, holes in the ice and the frozen burn through the ridge; two groups | 17,21, the fishers' ice-house: sledge runs that stop at the bank at 16,21 (`m10_runners`) |
| `longmere_m11`, M11 | outdoor, 32×32, 20–21 | the pines under the rim: the marsh, the ridge down to the glacier with Glacier Foot's sliver on it (closed) and a trapper at his lean-to; two groups | 13,22, the trappers' cache: sprung snares in a line at 13,20 (`m11_snares`) |
| `longmere_n9`, N9 | outdoor, 32×32, 20–21 | the glacier's edge, in from M9 round the fells' shoulder only: the bent woods, the moraine, a bothy and the bears' cave in the ice wall's foot; two groups | 24,9, the hunters' hide: a bear's skull on a stake at 24,10 (`n9_skull`) |
| `coldmere_k12`, K12 | outdoor, 32×32, 20–22 | the bounds' first, Monks' Vale's east under the pass: a bear-hunter at his fire, a brother of stone with a riddle, two bears on a kill and the lynxes waiting on it; the lair's door in the rim at 2,15; two groups | 10,13, the cell of Fuar's kirk plate: flat stones laid to the rock at 10,12 (`k12_stones`) |
| `longmere_l12`, L12 | outdoor, 32×32, 20–21 | the bounds' second, the rim south of Loch Fuar, a dead end: the resin-gatherers' old fire, a spring that does not freeze, the bears' den-mouth; the enclave's cave in the rim at 11,4; one group | 4,6, the resin-gatherers' store: pines scored in long cuts and empty pots at 4,5 (`l12_cuts`) |
| `creag_fionn`, Creag Fionn | dungeon, 16×16, 22–23 | the enclave, the trolls' winter cave in L12's rim: spine eagles in its neck, the trolls' hall, their bed and Trollbrand, a Bear Spear with fire in its blows; two groups, the Whitespine's | 11,9, the trolls' larder: the stretch of wall trodden bare at 10,9 (`cf_path`) |
| `spittal`, the Spittal | dungeon, 16×16, 30–32 | the lair's upper level behind K12's door, the brothers' house: a slate of names, the warming room, the kirk with its bell down and the cells; no group | none |
| `spittal2`, the Infirmary | dungeon, 16×16, 30–32 | the lair's lower level: the ward of beds made up, the Infirmarer in its one way in (§6) and the Wakerobe in the locker by the last bed; one group | 10,9, the cold room: the bed by the east wall whose sheet stirs at 9,9 (`sp2_draught`) |

Its content is `src/content/areas/rimewater/`: the maps, then a file each for its monsters, items,
chapter, side quests and guild quest, its part of the world (the atlas), its rows of the suites
(the checks), its rooms' list and what other areas take of it (public). Its walkthrough plays the
chapter at 20, 21 and 22 and every side quest's answers. Its businesses' rooms are
`src/ui/interiors/rimewater/`.

## 5. The one quest here

**The Sleepers** (`sleepers`, `src/content/areas/rimewater/chapter.ts`), Act III's last chapter,
after Cairnmoor's The Ring: begun on M9, down the notch; four nights stood at The Thaw (`night_1`
to `night_4`), and on the fourth the hole's fight and the girl out of it (`q_wenna_up`), unnamed in
every line; the door under Loch Fuar; the beds (`sb2_beds`, which sets `q_sleepers_seen`); and the
pass's mouth on K10 (`coldmere_k10:k10_mouth`). It is done on the beds and the mouth, in either
order, and the act with it; the Whitespine's chapter takes it on over the pass.

**The lock** (EXPANSION §2.3): the door on K9 at 24,30 is Act III's one story lock, signed in
`src/content/locks.ts`. It opens on `q_wenna_up` and for no one before, a door in plain sight with
its reason on it. Nothing else waits on the quest: the pass is open from the start, and #440's
fixture holds it so (`tools/tests/pillars.ts`). Back up from the beds the girl speaks at the door
(`q_wenna_lodge`) and waits by the lodge's yard fire until the company is in Monks' Vale.

## 6. Side quests

Five in `src/content/areas/rimewater/quests.ts`, #56's 40 to 44, a line each (the plan's §6 has
#56's table and the As built); each is answered by a choice its person puts, and pays alike:

- **The Coach That Never Came** (`coach`): the coachman at the coach house; the coach on Cairnmoor's
  N8 and the healer's note; the sleeper to the Lanterns' hall or the healer's house. 1,800 xp.
- **The One Who Went Back Down** (`wentback`): the man at the hole's foot on M9; Hale's token or the
  clerk's book; home on the coach, or a witness at the lodge. 1,800 xp.
- **The Bell Under the Ice** (`icebell`): the lodge woman, once the sleeper has a bed; the clapper
  over the tower's cap on K9 by night, KEEP THE COLD; out to Fuar, or by the fire. 1,800 xp.
- **Where the Sky Meets Ice** (`sky`): the guide, at the lodge and frostbitten at the glacier's foot
  on M9; carried in, she marks the way into the void on the company's map. 2,100 xp.
- **The Pilgrims in the Pass** (`pilgrims`): the old woman of Anvilhall below K10's mouth; a brother
  who does not bleed, a person and no fight; up with him, or back to the lodge. 2,100 xp.

The Lanterns' fourth hall is the lodge's: tier 7, their three skills (Linguist among them), the
ladder's First Light and the Luminary asks, reported here as at the Watch (plan, §6). The one ask
filed here is the Wardens': A Sword at the Hole (`wardens_hole`,
`src/content/areas/rimewater/guilds.ts`), the fourth night's fight won; 300 gold and 2,400 xp.

**The Wakerobe** (#846), the bounds' artifact of #832, Rimewater's and the Whitespine's together:
in the locker by the Infirmary's last bed, behind the Infirmarer (boss, 32: 2,100 hit points,
attack 22, 26d8+30 a blow; its touch puts to sleep, and it mends itself), found and never told. The
rumour is the lodge-keeper's at Rime Lodge, at a meeting after her first. A robe of armour 14 for
the cleric, the sorcerer, the druid and the monk; its bearer is never put to sleep (a ward).

## 7. Encounters, and what is new

Rimewater's monsters are MONSTERS §7.3's, in its monsters file: the Ice Pike, the Snow Lynx, the
Tallyman, the Ice Bear, the Bay Keeper and the Matron, two of them new families, the keepers and the
cats; the tallyman calls three knockers more at half a turn (#537). Creag Fionn places the
Whitespine's spine eagles and snow trolls at its own band, and the Spittal the Infirmarer alone, a
new kind of the keepers (MONSTERS §13). Its `novel` claims the cats and a group on ice with M9 and
the keepers with the bay; the rest is on the road before it, or no kind the check knows
(`noveltyFaults`, `tools/tests/pillars.ts`).

## 8. The numbers

- **The curve** (`tools/tests/curve.ts`): a clear gives 30,421 xp a member of the 16,267 it asks and
  11,390 gold of 9,840; a company entering at the floor and clearing three quarters leaves at 23.0,
  +1.0 over the next floor 22. The enclave and the lair are counted in no clear: 4,586 xp a member
  and 1,200 gold.
- **The gate** (`tools/tests/gate.ts`): at its maps' floors the area wins 99.2% of its 51 groups'
  fights (`GATE.through`'s aim); two under, its groups pooled at 18, 5.27 fights to a rest, 58.6% of
  the floor's
  9. Every box wins every fight at 20, and the roads of Loch Fada and Loch Fuar are walked every
  time. The bay at 21 wins 89.8%, the Matron deciding it: 59% at 21 and 92% at 23. Creag Fionn wins
  every fight at 22; the Infirmarer is won 60% at 30 and 78% at 32.
- **Fights to a rest** (aim 8 to 10, limit 6.5 to 12.5): M9 9.55, L9 9.27, K9 8.54, K10 9.45, the
  stair 9.64, J9 8.81, K11 8.09, K12 9.31 and L12 8.09; L10 and M10 12.05 and L11, M11 and N9 11.06,
  past the aim; the bay 9.16 (aim 8.25 to 10.25) and Creag Fionn 9.76 (aim 8.5 to 10.5). The gate
  lists eight figures off their aim, inside their limits: those five, the stair two under (76.1% of
  the floor's 9), the bay's 89.8% and the Infirmarer's 78% at 32.
- **Density** (`tools/tests/density.ts`): within 8 squares in the core, M9 98.1%, K9 99.5% and K10
  99.9%; within 12 in the country, L11 96.5% (its furthest square 18) and M10 99.0% (17), every
  other box 100%; the town and the dungeons 100% within 7.
- **The ladder:** rungs 21 and 22 are Rimewater's (`gear`, in its checks): by 21 Rime Lodge's
  furrier, by 22 its finds, every class bettered by each.

## 10. Names

Rimewater's naming pass, by the rules of `docs/NAMES.md`, chosen for #435. The lodge-keepers are
hill folk who share a tongue with Cairnmoor's, modelled on Scots Gaelic, the speech of lochs and
bens: short parts, spelled as they are said, with no accent the font lacks. *Carn* a cairn, *creag*
a crag, *loch* a lake, *moine* a moss or bog, *tulach* a knoll, *dubh* black, *fionn* white or fair,
*beinn* a mountain, *allt* a burn, *clach* a stone, *fuar* cold, *fada* long, *eas* a waterfall,
*ceann* a head, *lios* an enclosure. Its finds add *lann* a blade, *bogha* a bow and *luireach* a
coat of mail. It goes into NAMES §2's row for the hill folk, Cairnmoor's and Rimewater's together.

- **The names:**

  | Was | Now | What it means | Also thought of |
  |---|---|---|---|
  | Longmere | Loch Fada | the long loch: the zone, named for its water | Loch Mor, the great loch |
  | Coldmere | Loch Fuar | the cold loch: the zone, and the loch the bay lies under | Loch Dubh, the black loch, for its ice |
  | the trolls' winter cave, the enclave (#832) | Creag Fionn | the white crag: the cave in the rim's face where the snow trolls winter | Creag Fuar, the cold crag |
  | the Wakerobe's lair, the brothers' house under the pass (#832) | the Spittal | the brothers' plain word, as Monks' Vale is theirs, for a house kept on a pass for whoever comes in off it | the Hospice, the Pass House |
  | the lair's lower level (#832) | the Infirmary | the brothers' ward of beds, which the Infirmarer keeps made up | the Long Ward |

- **Kept:** Rimewater and Rime Lodge, the Lanterns' English for the area and the lodge they keep,
  which the story leans on (DESIGN §7, §9); Glacier Foot and the Ice Caves, the reach's, to be named
  in Phase 1.6 with the reach; the Sleepers' Bay, the docs' plain name for a plain thing, as the
  Drowned Temples are, since nothing on the surface names it and no site paints it: the secret is
  found; the Rimefells and the high pass, the plan's, names on borders Rimewater shares. The old
  names stand in brackets at first mention above, and the epic's titles keep them until they are
  edited (NAMES §3).
- **Ids stay:** `longmere` and `coldmere`, as `harrow` is Helmstow (NAMES §3). The town, the bay and
  the caves are named as they are planned.
- **The finds,** in the same tongue: K9's smith's blade is **Lann Fuar**, *lann* the hill folk's
  blade and Fuar the village the loch came up over (#489's 8; *lann* was missing from the words
  above and from NAMES §2, and #490 adds it to both). The locker's two, off the ladder's plain
  names, are **Bogha Fionn +1**, the white bow (the Hunter's Bow +1) and **Luireach Dubh +4**, the
  black mail (the Plate Mail +4); their ids stay (#490's 15). The Matron's Cap is plain English, a
  machine's part. The sleepers' ring has no name: none came that did not tell the secret, and it is
  cut (§11). Trollbrand, the enclave's spear (#832's 26), is plain English as the furrier's wares
  are: the row has no word for a spear or for fire.
- **The stair** is *Under Loch Fuar*, as Carn Dubh's is *Under Carn Dubh*, since nothing on the
  surface names the bay; the lower level keeps the docs' plain name (#490's 7).

## Open and owed

- **Owed to no check:** its checks owe nothing (the Infirmarer, the last row, left with the lair,
  #832), and the curve, the gate, density and the ladder hold Rimewater with nothing owed.
- **Watched, not moved:** L10's and M10's 12.05 fights to a rest sit near the limit of 12.5, and
  L11's furthest square is 18 of 20 (plan, §8). What the owner finds by hand goes here; none yet.
- **The reach:** Glacier Foot and the Ice Caves wait on Phase 1.6 (plan, §11); M10's and M11's east
  edges open onto it.
- **What is next:** nothing. The plan's briefs are all built, and a new box starts its brief there.
