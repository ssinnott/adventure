# The vertical slice (M0) and the road to level 10

What is playable now, what is stubbed, and where things live: the systems. What each area holds is
in its own doc, [the Foreland](areas/shelf.md) (Helmstow, the cellar, Brandy Hole, band 1-5) and
[Thornmark](areas/thornmark.md) (Thornhold, the Grove Roots, the Cut Stone, band 5-10). Read
DESIGN.md first for the why.

## Playable

- **Title and party creation.** Take the premade six or muster your own: name, race, class, rolled
  stats with reroll. Front row is slots 1–3, back row 4–6.
- **Businesses:** stepping into a business's doorway goes inside. The viewport shows its own painted
  room (see Art) while its menus sit in the right-hand panel, where the automap is, as combat's do:
  columns with the price flush right, a note under the list (an item's dice, a spell's effect),
  scrolling for a long stock, a tavern's rumours a page at a time. The log over the room shows what
  the step in said (an event on the doorway) and what is said inside. Leaving (the last menu closed)
  steps the party back into the street, facing the door. A shop may name its own price for an item
  it stocks (`prices`); the rest sell at their own, and anything sells back for half its own price.
- **Guild halls:** a business may also be a guild's hall (`hall`, DESIGN §8). It then opens on a
  first menu, its own trade, the guild's work, its skills where the guild has one built (below) and
  Leave, which each choice returns to; a business with its trade alone opens straight on it. The
  work's row reads "Work for the Wardens", the guild by its short name where the whole would be cut
  in the side panel ("Work for the Cartographers"), and `tools/tests/guilds.ts` holds every row of
  every hall's first menu to the panel's column (#890). The guild's work pays what is done, then
  offers the quests at or under the company's rank, those
  that wait for an act (`after`, a flag) once the company holds it (#439). Membership
  and rank are worked out from the guild quests' done flags, and a rank reached is kept by its own
  flag (`game/guilds.ts`). The Warden Drillyard is the Wardens' hall, and the Lanterns' are the
  Lantern Guildhall, the Thornhold Lantern Hall, the Watch's and the Lodge's, one ladder over the
  four (#439). A spell hall's fee buys the right to study, not membership.
- **People in a business:** a person with no room of their own on a business's doorway, listed after
  it, is in the business while present, and its first menu offers "Talk to <name to its first
  comma>" after its trade and the guild's work; the menu is made when drawn, so a person an answer
  sends away is gone from it. A tavern (the Gilded Eel, a person with a room) with people in it says
  its room first, over a menu of "The talk of the room" and them. With nobody there, a business
  opens as before.
- **Exploration:** grid movement with 90° turns and strafing, doors, locked doors, secret doors
  (each with a hint on its near side, the event or sign `MapDef.secrets` names), water and mountains
  gated by party abilities, hills (`^`), farmland (`f`), light woods (`t`) and dead wood (`d`, on no
  built map yet) open to all, the Sunder's glass trees (`c`) and chasm (`v`), on none yet, salt
  (`-`), heather (`h`) and tidal ground (`;`), on none yet, ash (`a`), pine (`p`) and ice (`i`), on
  none yet (#536), peaks (`A`) and cliffs (`|`), solid as the mountain is, on none yet (#543), steppe (`s`), dunes (`u`) and vines (`&`), walked, and the volcano (`V`) and a vent (`@`), solid, on none yet (#543), a calendar and weather over a day/night clock (below), automap with field-of-view reveal, rest with
  food, a search action, exploration spells (Light, Wizard Eye). The wilderness features (a shrine
  on F2; the rest on E2): a shrine or fountain that gives every member a stat point once, a cairn
  with a cache, a statue whose riddle takes its answer typed and a camp where the party may rest
  with monsters two squares off; a hermit is a person. Dens (E2's rookery and D3's bandit camp; #69
  places more): a camp that breeds one kind of monster, its brood back one a pace at their posts
  while it stands, guarded by keepers beside it that never leave. Its look is said when first seen;
  its keepers dead, a step or Space asks to burn it, and burnt it gives its hoard, breeds no more
  and shows as ash on the automap.
- **Combat:** turn-based, speed-ordered; front/back rows; attack, cast, use, defend, flee;
  conditions (poison, disease, sleep, paralysis, curse, unconscious, dead); a 12-monster cap; xp, gold and
  drops; readiness to train reported. Every monster is a beast, a person, the dead, the Rift or a
  machine: the dead and machines never sleep, and a def may shrug off more of its own (`immune`).
  A group may stand in two ranks (`back`): a blade reaches its back once the fight's front is down,
  bows, slings and spells reach anyone, and a back rank with no bow or spell waits for the front to
  fall. Morale: once a fight's leaders (`leader`) are down its people break and run, and a group's
  beasts bolt at three in four down; the dead, the Rift, the machine and the Hand (`steady`) never
  do, and the fled pay nothing (#160). Every damage spell has an element, which a monster may
  resist (half), be immune to (none) or be weak to (half again); a monster may cast from the tables
  (`cast`) and drain hit points or spell points with its hits (`drain`); a hit wakes a sleeper, and
  sleep ends with the fight (#161). A monster may mend each round but a round fire struck it
  (`regen`), curse with its hits and spend a turn calling its group into the fight while there is
  room for the whole of it under twelve monsters in three groups, the fallen counted (`calls`) (#537).
  A monster may sweep a row at a chance a turn, its arm the front row or its breath the fuller row
  with its element, which Lampglass halves (`sweep`) (#545).
  A hit may turn a member to glass, out of the fight and the walk and through a rest till Absolve, a
  Quickening Draught or a temple lifts it (`inflict: stoned`) (#546).
  The first Smite or Wrath of the Hearth to pass through a machine and do nothing is followed in the
  log by the light going into it like a hand into a glove, once a game (`glove_seen`, MONSTERS §2).
  A group placed on ice (`under: 'ice'`, #536) lives under it: it
  moves only under the ice, strikes only a company standing on the ice beside it and in the fight
  reaches only the front row over it, never the back, bow or none.
  Gear may carry a plus: a point is +1 to hit and damage on a weapon, +1 armour class on armour or
  a shield (`P`, `src/content/items.ts`). Past a plus, an item may raise a stat while it is borne
  (`ItemDef.stat`, read through `statOf` by the blow, to-hit, armour, the turn's order, a flight and
  a heal, never written into a member's stats) and a weapon's blows may carry an element, an added
  1d6 of it through `elementDamage` that burns a mender and is seen as a spell's is
  (`ItemDef.element`, #855; DESIGN §5, §6). The sheet prints the total and its raise ("SPE 13(+3)") and
  the weapon's element, and a shop says both. Eight found items carry one, off the ladder and in no
  shop, two in each of Wrackholm, the Whitespine, Cairnmoor and Hearth Isle, one of each pair in the
  area's first locked chest (#861 to #864): Corposant, the Thunderhead Axe and the Levin Mace carry
  lightning and the Beacon Hammer fire; the Runner's Coat, the Talon Knife, Cairnbuilder's Mail and
  the Vigil Robe raise speed, accuracy, might and personality by 3. An artifact is an item marked so
  (`ItemDef.artifact`, #847; DESIGN §9): one in the world, found and never sold; no shop stocks one
  or takes one, and no rung of the ladder or price window holds one, by its mark. The sheet says each
  borne and its power ("ARTIFACT The Erzhemd, SPEED +5"). All eight are in their areas' items, each
  of the five kinds of power built (#921), and seven lie in their lairs; the Telstok (holy blows),
  in Saltreach's items, waits for its lair (#830).
- **Save/load:** F5/F9 to localStorage; door changes, explored cells, group state and the rng all
  survive a reload. Saves are version 2 (the outdoors as one map, cells seen kept a bit apiece); a
  version 1 save loads, its Foreland and Thornmark state folded into the outdoors where they now lie.
  An old save is brought up to date by version, one registered upgrade a step, and the shipped
  files (each area's `content/areas/<area>/shipped.json` and the central `content/shipped.json`,
  joined into one record) list every id and placement a save may hold, so a check fails when one
  goes or moves without a bump and its upgrade (`node tools/shipped.ts` records what is new, each
  id in its area's file). A map edited since the save still takes it: a group the map has gained
  stands where the map puts it, and a saved door goes back only where the map still has a locked
  or secret door. A save keeps the kinds of monster the company has met (`met`); one made before
  has met none.
- **People** (`game/people.ts`): a person's first meeting may hire (one flag or several) and end in
  a question put through the choice screen, whose answer sets flags, may hand over an item and has
  its own words; a question once answered is not put again, and Esc answers nothing. An answer may
  have a price (`price`), sold as a ware is: listed at it with the purse after the question, barred
  to a company with less and paid as it is answered (Anvilhall's thane and the Stone, #459). A person may
  say other words once a flag holds, by night or until a flag (`says`, wearing `Presence`, the first
  that holds said, furthest along first), and take several items (`quest` one or a list, one a
  meeting, in order; one paying nothing says no gold line). An item with `text` is a letter, read
  from the pack in a box. A person and an event wear `Presence` as a group does: there only in their
  hours (by night), once their `after` holds and until their `until` does, so one person can stand
  in two places, one at a time, and a once-event by night is not spent by day (`World.present`; the
  automap shows only who is there). The Foreland's side quests are built on them (#77).
- **Prestiges** (`game/prestige.ts`, `game/party.ts`, #19; DESIGN §5): each class's three, at 11,
  19 and 27, each a title that becomes its name on the sheet. Each adds hit points and spell points
  to every level from its own on, whenever it is taken. A person who `teaches` one class one prestige
  offers it once their words are said: the company's members of the class, each with the title and
  the price, or why not (its level, the prestige before, the third's quest, the gold). The perks are
  the resolver's: the blows, the knight's banner, the ranger's Marksman and weatherproof shots, the
  thief's growing sneak attack and its round out of sight, the Ironhide's rage and -30, the monk
  first and from the back row, Holy Strike risen, the bard's song and its ward against sleep and
  paralysis, and the cleric's last rite. A caster's or a hybrid's prestiges are its spell ranks
  (`spellRank`, `rankMult`, #20): 15% a rank on its damage dice and its mending, half that for a
  hybrid, and the Magus's spells pass a resistance.
  No trainer is placed yet. Each placed trainer makes a seeking quest for each member of the class
  (`game/seeking.ts`), keyed by its slot: begun at the prestige's level with the one before (a quest
  condition on a member's class, level and prestiges, `member`), done once taken, or once the third's
  trainer's own quest begins (`asks`); a trainer's `seek` words stand in for the journal's. The world
  map marks the place of every open quest that asks (`mark`) with a green diamond and who is sought
  there (SOUGHT in its legend). Nothing is saved.
- **The Hearth's measure** (`game/stones.ts`, #168; DESIGN §9): the Stones restored, counted from
  the save's flags against `content/stones.ts`, so nothing new is saved: the Tide Stone once
  `q_tide_home` holds, which the plinth at Stienwierde sets as it takes the Stone (#191); the Grove
  once a Lantern has mended it, `q_mender_done`, which the Mender sets at the Stone (#56's 18); the Anvil Stone once
  the Warden of the Anvil has fallen and its tear is closed, bought back or taken alike,
  `q_anvil_closed` (#540), which the Rift sets once its Warden falls (#465); the Ember Stone once it
  is lit, its three parts set, `q_ember_lit` (#548), which its dungeon will set (#516, not built
  yet); the Peak Stone, whole and never broken, once the company has stood beside it, the once event
  at the Stone on I11 (#501); the rest as their areas write them. By night, outdoors and in a town, the Hearth stands over
  the far hills in its true bearing from the party, faint from the first night and taller and
  brighter by a step for each Stone. The title reads the save in storage and draws its column
  steadier, taller and wider by a step; the world map's flickers less; the almanac adds a word on it
  once one is restored. The Tide Stone and the Anvil Stone can be restored so far.
- **Crossings** (`game/passage.ts`, #164): a person may sell passage by coach, by boat or on a
  Rider's horse, whose terms are the Riders' own (`passage`,
  a list of `Passage`). Their words close onto a menu of the crossings, each with its fare and days,
  then the terms: when it leaves and when it lands, and to a company under the far end's floor the
  seller's warning, never a refusal. A crossing leaves at its hour every day, so a company that buys
  after it waits for the next, and lands its days later at its own hour; the fare is the company's,
  pays its board and lands it rested, as an inn does (the dead stay dead, and no food is eaten).
  Open to anyone with the fare, it is free once its `free` holds. On the world map a boat is a way
  by sea and a coach or a horse a way of its own (`coach`); the gate check counts each landing as a way in, and
  where a crossing lands in a town, that town's ways out (`landings`, `tools/tests/gate.ts`), and
  the outdoors' walk (`tools/tests/outdoors.ts`) starts from each landing as well. Saltmouth's quay
  sells the boat to Wrackholm's landing and the landing sells it back (#177).
  The crossings between towns (`content/crossings.ts`, #539) are written once, both ends together:
  one fare, length and timetable either way, on a link the atlas charts, and each end's landing once
  its town is built. A town sells one by a person whose `passage` is `sells('<town>', ...)`, which
  sells nothing toward a town not built, so nothing ever lands where nothing is. The check holds each
  to its link and its fare's rule, each built end to a landing on open ground and, once both ends
  land, each end to a seller; on the world map the link a crossing is sold both ways on is drawn as
  that way built. Kilnhaven's ferry to Saltmouth, the Compact ship to Cinderport and the drove road's
  coach to Rime Lodge are written, and Kilnhaven writes its three landings (#469): the ferry and the
  coach run, each sold at both its ends by its master and its coachman, and the ship waits on
  Cinderport (#512). Act IV's are written (#547): the ship's Cinderport end, halved there for a
  member of the Compact; the Rider's ride between Cinderport and Akordu; and the last crossing to
  Hearth Isle. An end may be a zone, a camp or a shore, landing on the map of the box that holds it,
  and a link to a zone sold both ways is drawn as built too. All three wait on Cinderport (#512),
  and the far ones on Akordu (#526) and Hearth Isle (Phase 1.5).
- **Kiln-script and the secondary skills** (`game/inscriptions.ts`, `game/skills.ts`, #538; DESIGN
  §5, §9): a sign with a second text (`read`) is an inscription. Its words are said to every
  company, and its reading after them only to one with a reader, as `<name> reads: "<reading>"`:
  the first standing member with Linguist or born to it, a dwarf, else, while an item that does
  Linguist's work is carried (`ItemDef.skill`, the copybook #471 built), its carrier or the first
  standing member. Read, it is kept by its id in its map's `used`, as a once-event is, so `seen`
  names it and nothing new is saved; one that `marks` atlas places pins them on the world map once
  read, a hollow square with no name and no word in the legend, and its first reading says so. A
  reading may be a secret's hint, which the hint check counts; it sets no flag and opens no way. The
  secondary skills are a list on each member (`skills`, none in a save from before them) that the
  sheet shows. Linguist is the first built: the Lanterns', 1,000 gold a member, taught at every hall
  of theirs ("Learn a skill" on its first menu) and by a person who teaches it (`skill`), to a
  company that is of the guild. The Kilns' maps place both: inscriptions from N3's niche to O6's
  adit, and Anvilhall's Lantern reader to teach it (docs/areas/kilns.md §4.1, §4.4). Mountaineer and
  Swimmer are built as it is (#805): the Wardens', taught at the Drillyard, and the Cartographers',
  taught at the Map Room in Saltmouth and the Chart House in Cinderport. `partyCan` lets a company
  climb with a Mountaineer standing and swim with a Swimmer standing; the flags `skill_mountaineer`
  and `skill_swim` still grant the same. The Lanterns' Perception and Spirit Sense and the Wardens'
  Danger Sense and Arms Master follow (#856), so every hall teaches its guild's three. A skill names
  the peoples and classes born to it (`races`, `classes`): the dwarves to Linguist, the elves and
  the gnomes to Perception, and a hall will not sell it to them. `World.search` finds surely with
  Perception standing, in the wall past an open square too; `markedGroups` marks the dead within
  eight steps through walls with Spirit Sense standing, and an aware roaming group behind a hill or
  a wall with Danger Sense; `newRound` puts the company before the monsters in the first round while
  an Arms Master stands, reading the member's list itself. "Learn a skill" opens the
  hall's skills, then who would learn one (`skillMenu`, `learnerMenu`); a person opens on who. The
  Cartographers' Cartographer and Pathfinder and the Compact's Lockpick, Merchant and Navigator
  complete the twelve (#857): `World.reveal` maps a square further for a Cartographer or a chart
  carried, never past what blocks the view; `World.move` drops the drag on the clock for a
  Pathfinder (the Rangers born to it); `World.unlock` opens an iron-key door and a locked chest
  (`chest.locked`) to a Lockpick (the Thieves born to it) or a set of picks, keeping the key, else to
  a key spent; `sellPrice` pays a Merchant two thirds and `fareOf` charges a Navigator half. A
  company's rank in a guild is `game/ranks.ts`'s, so that `skills.ts` asks it apart from the quests'
  rules. Pender's Locks sells the set of picks and the Map Room a chart, in Saltmouth (#860).
- **The weapon and magic tiers** (`game/mastery.ts`, #852; DESIGN §5, §7): a member's Expert and
  Master at arms and in magic (`tiers`, none in a save from before them). Arms adds to the to-hit
  (`attackBonus`) and to every blow (`armsBonus`, beside `traitDamage` in the blow and in the
  harness's `weaponDamage`); magic adds rank steps in `rankMult` (`tierSteps`), so damage dice and
  mending read it and nothing else does. Expert is "Expert at arms and in magic" on the first menu of
  every town trainer of ceiling 13 or over, 2,000 a line; Master a person's (`npc.mastery`), two on
  the road: the Wold's old Rider at arms (#858) and Old Cinder's scholar in magic (#859). The sheet
  says each tier. The gate's company takes none: #865 weighed the tiers and left them out (J2,
  EXPANSION §5.2).
- **A monster's look.** The first time a company sees a kind, as the viewport draws it (each kind
  of the group to three, in line of sight), or meets one in a fight unseen, the log says its `look`,
  once. A group is drawn as up to three figures: each of its kinds once, in the order they stand,
  then the rest (`groupDrawn`, `game/world.ts`), so the archer among the brigands is seen.
- **Quest log** (J): the quests the party knows of, active first, each with its next goal and a
  journal of what the party has found. The main quest is one, The Dimming, joined from each area's
  chapter in road order (EXPANSION §5.8): The Quiet Farm (Vask) and The Grove Stone (Vask's lead,
  Sylvane's chisel). A chapter is begun once its start or its end holds, and the quest is done once
  every one is; its goal is tried from the last chapter back, over those begun and the ones before
  them, so a company in Thornmark early is not sent to the Stone before anyone has spoken of it.
  Beside it are the side quests: The Cargo Ledger (Hale), The Bell That Rang Twice (Osmund), The
  Rest of the Survey (Ebba, Ailith), The Clerk's Seal (Maud), The Well Tastes of Iron (Mottram), A
  Boat With No Name-Board (Wat and Hamo), Who Lived at Ashcombe (Hob), Oil for the Lamp (Aldred,
  Mottram and Vask) and The Lost Expedition, which the first Meridian journal opens and which stays
  open until the rest of its trail is built. Left and right page the one quest by chapter, and a
  page too long goes on over the next. Nothing new is saved. Every entry is keyed to something the
  save already holds (a flag, a carried item, a once-only event, a guardian killed, a map set foot
  on), so an old save opens with its log whole. A quest or chapter begun, advanced or finished is
  announced once in the message log, and J opens on the one that changed last, at its goal's
  chapter.

## The outdoors as one map, and the end of the world

The world map (M) charts Caldera as one land of 512 by 384 squares, divided into areas (the steps
of the road of levels) and the zones inside them (`game/atlas.ts`; the plan in `content/atlas.ts`,
each built area's part in `areas/<area>/atlas.ts`, merged as `ATLAS` in `content/index.ts`). The
game now walks it that way too: the outdoors is one map, `caldera`, the size of the world, square
for square with the painted map (`game/outdoors.ts`, which `content/maps.ts` runs once to make
`PLAYED_DEFS`, the maps as played).

- **Zones.** Every outdoor map the atlas places is a zone, laid in 1:1 at its box of the grid: the
  Foreland at 200,30 (G2), Thornmark at 232,30 (H2) and Callow Downs' first seven boxes, F2 at
  168,30, F3 at 168,62, E3 at 136,62, E2 at 136,30, D2 at 104,30, D3 at 104,62 and D4 at 104,94. The
  zone maps are still written as maps of their own in their areas' `maps/` folders, in their own
  coordinates; laying them in moves their features, monster groups and exits to where they sit, and
  leads every town's and dungeon's way out onto the outdoors. Outdoors, the party's zone says where
  it is: the name on the status strip and the almanac, the level band, the region whose weather it
  has, the palette it is painted in.
- **Walked, not jumped.** An exit from one zone map into the next is dropped: the road through the
  pass runs straight on into Thornmark, and the view looks down it. The Foreland's exit kept its
  arrival line as what the log says on crossing into Thornmark ("The pass opens onto old forest.
  Thornmark."; the way back says "Back through the pass to the Foreland."). The pass is open to any
  company: a sign at the Warden checkpoint, on the one square the pass is entered from, warns it,
  and Thornmark's monsters decide. Monster groups may follow the party over a zone's edge. An exit
  with flags still becomes a gate on its square (`MapDef.gates`; the outdoors suite holds a fixture
  to it), but none is left between the zones.
- **The line at a border** (#166, EXPANSION §5.2). Crossing into another atlas zone, the log names it
  ("The Delta."), unless the way's arrival line has. Where the floor of the zone map stepped into is
  over the company's level (its members' mean, rounded down), and the land is new or its floor
  higher than the last, the line says how the land feels: "The land here is harder than the road
  behind." one or two under, "Nothing here would spare you. The road behind is still open." three
  or more under. A zone may give its own words in its atlas row (`crossing`). Never a wall, and
  stepping straight back over a line just crossed says no more. A way that jumps from one zone map
  to another (N8's notch down onto M9) says it too, on landing, after its own label, which leaves the
  land's name to the line. Each zone map is its listed atlas zone's for now: a box that straddles
  two (C4, B5, B6) waits on its own build to draw the line inside it.
- **The end of the world.** Wherever no zone map is laid yet, the outdoors is void (`%`, the `void`
  solid): nothing crosses it, whatever a company can do, and nothing sees through it. The ring of
  mountains that closed each zone map in is, where it faces nothing built, the end of the world as
  well: the Foreland's north and south edges, F2's, E2's and D2's north (the rim, cut for good),
  F3's east and south, E4's east and Thornmark's north. D2's, D3's and D4's west, D4's south, E3's
  south and Thornmark's east and south once faced nothing too, and meet Saltreach's C2, C3, C4 and
  D5, the Foreland's E4 (#930), Sunderwood's I2 and the Deepthorn's H3 now. F3's east opens onto
  G3, a crumb left unbuilt, at rows 0 and 1 (`src/content/areas/shelf/checks.ts`). Between the
  Foreland and Thornmark the ridge stands as it was, two squares thick with the pass through it;
  between the Foreland and F2 it is the Foreland's ring alone, with the Salt Road through a gap at
  0,29. The void is drawn as its look, the ground the world map paints there (#829, `MapDef.looks`,
  laid by `game/outdoors.ts` from the atlas's grid, which the world map's paint shares): the sea and
  the lakes run on to the horizon, the rim's mountains stand, the cut country lies as the atlas has
  it. A zone map's ring, and the void its author wrote into it, are drawn as the mountain it closes
  with, but a ring's square where the atlas has water, so the coast runs on; past the rim, mountain.
  A step into it says what stands there: "The water is far too deep.", "Too steep for anyone to
  climb." or "There is no way on from here.". The automap inks it in its look's colour, faded into
  the parchment. A void with no look is painted as before, pink empty space standing up past the top
  of the view, and says "The world ends here."; no walkable square has one in view
  (`tools/tests/outdoors.ts`).
- **Building more.** A new box is a map in its area's `maps/` and `index.ts`, marked `density`
  core or country, and a line in its zone's `maps` in its area's `atlas.ts`, the map at its box's
  corner; `node tools/scaffold.ts` cuts its first draft from the atlas and names its box. Laid in, it
  opens the void where it stands. Where it meets a built box, the two edges agree square for square
  on passable ground, water and road, and open a way between two areas only where the atlas joins
  them: one rule over every seam (`tools/tests/outdoors.ts`, #898), and a seam that disagrees as
  built is its area's `seamsAsBuilt` row with its reason. Where it meets the atlas, its water and
  roads carry on into the land beyond its edge (`tools/tests/pillars.ts`), and each edge that faces
  no built box is open to a walker exactly where a row of its area's `openOnNothing` says, with the
  box it faces and why that is unbuilt: the bounds' border check (#828) in embryo. The box's pull
  request adds the rows for its own edges onto nothing and deletes those of the edges it now faces.
- **Around it.** The automap draws a map that fits the panel whole, as before, and for the outdoors
  a window of 33 by 33 squares round the party at the size a 32-square map is drawn. Quests still
  name zone maps: `visited: 'thornmark'` holds once the party has set foot in the zone
  (`WorldState.zones`), and a `seen` or `slain` on a zone map reads the outdoors' state. `travel()`
  takes a zone map's own coordinates, so tools and tests can still say `shelf 16 8`.
- **Act III's ground** (#536). Ash, pine and ice have their characters (`a`, `p`, `i`), and on the
  world map they are the atlas's ash, pine and ice, so the scaffold drafts the Kilns' ash and pines
  and Glacier Foot's ice. Rimewater's lochs are water on the atlas (docs/areas/rimewater.md §1): a
  box draws its frozen loch as ice by hand and places its pike on it `under: 'ice'` (Combat, above).

Decided by delegate for #536, each the owner's to overturn:

1. **Pine is its own ground, `p`,** walked through among pines as the woods are, closer, taller and
   green all year; the forest's `T` stays the wall of trunks. The Kilns' M3 and Rimewater's K10 are
   mostly pine (K10 770 of 782 squares) with groups in the pines, and a wall of trees leaves them
   nowhere to stand; #200's 1 left the character to Rimewater. Sunderwood keeps its pines as forest.
2. **Ash is slow going, two minutes more a step as hills are, and nothing else:** loose ash is the
   heart's hardest ground, and the atlas prices it near hills already. Pine and ice take the usual six.
3. **The ice holds in every season:** the lochs under the glacier never open. A thaw would shut the
   bay's door under Loch Fuar half the year, a lock by the calendar (EXPANSION §2.2); the tide (#162)
   shows what ground that comes and goes costs. The ice greys in the summer and whitens in the winter.
4. **The lochs stay water on the atlas,** as docs/areas/rimewater.md §1 has them, and a box draws them
   frozen by hand; frozen on the atlas, they would turn the world map's lochs to ice before any box.
5. **A group is placed on ice by its own mark, `under: 'ice'`,** not by the square it stands on, so
   an ice bear may cross the ice without going under it, and the gate, which fights groups without
   their maps, fights it as play does. Under the ice it moves only under it, strikes only a company
   standing on the ice beside it and lets one on the shore beside it walk by, though one facing it
   may strike first as at any group; it is drawn as a shape in the ice, nothing of it over the horizon.
6. **In the fight it reaches one square: the front row over it, bow or none,** and once that row is
   down, nobody; the company strikes it as it strikes any group. The gate bot and the harness fight it
   so, and the gate check keys its rate apart from the same group on dry ground.
7. **Lying snow is the maps' snow, `*`,** walked, white in every season, on no built map yet, so
   Cairnmoor or Rimewater may claim it; nothing new was needed for it.
8. **A sample of each ground stands in for the maps to come** (`tools/kit/grounds.ts`): the smoke
   test sweeps them for cracks every run and paints the grounds through the year, and the sheet
   shows them with `--ground` and whenever it draws every map, as the Rift samples show the
   templates.

- **Act IV's ground** (#543). Peaks and cliffs have their characters (`A`, `|`), and on the world map
  they are the atlas's peak and cliff, so the scaffold drafts the Whitespine's boxes with them: J11's
  202 peaks, I11's 48 peaks and 64 cliffs. Steppe (`s`), dunes (`u`) and vines (`&`) are walked, and
  the volcano (`V`) and a vent in it (`@`) are the mountain's rock; on the world map each is the
  atlas's own, a vent its volcano, so the scaffold drafts the Wold's and the shore's boxes with them:
  D9's 807 steppe and 171 dunes, H10's 207 vines. G11 cuts with its 102 squares of lava and the cone
  as mountain: the atlas lays no volcano square yet (below).

Decided by delegate for #543 (cliffs and peaks), each the owner's to overturn:

1. **A peak and a cliff are the mountain's rock:** solid, never seen past and climbed by a Mountaineer
   and nobody else, with the mountain's words. One rule for the range; the skill still opens the
   ground off the road (EXPANSION §2.2), and the road needs none.
2. **Each is a ground of its own under the mountain's solid** (`cell('peak', 'mountain')`), so all
   that knows the mountain knows them (sight, the walk, the bot's way in, a secret door's guise), and
   only the view, the automap and the world map tell the three apart. Neither slows a climb.
3. **A peak stands taller and whiter than any mountain:** two and a half to three squares high to the
   mountain's under two and a quarter, white to near half its height in the summer, lower in the
   winter and almost to its foot under lying snow. On the automap it is inked pale.
4. **A cliff is a face as tall as a mountain, upright and flat along its top,** bedded in ledges, a
   little wider than its square so a line of them stands as one face; snow lies along its top in the
   winter and on its ledges under a deep fall. Slate, to the mountain's grey; on the automap, dark.
5. **The road through the range is road,** walked and drawn as road anywhere; the faces either side of
   it from the next square on make the cut, as every billboard stands. No atlas link was still marked
   for a Mountaineer: the road from Coldmere into Monks' Vale is a road already.
6. **A sample of each with the road cut through** (`ground_cliff`, `ground_peak`), swept for cracks
   and shown on the sheet; the smoke test paints a peak and a cliff beside a mountain through the
   year and holds each to its shape.

Decided by delegate for #543 (steppe, dunes, vines and the volcano), each the owner's to overturn:

1. **Their characters are `s`, `u`, `&`, `V` and `@`:** lower case for the grounds walked, as the
   others are (`d` and `v` were taken), `&` a tangle of creepers, and capitals and marks for the rock.
2. **Steppe is walked as grass,** at the usual six minutes, as the atlas's table has it (grass's 2).
   It is dun after the winter, green-gold in Sowing, gold by Longlight and tawny at Harvest, the lions'
   colour, then straw: tall dry grass in tufts leaning one way, with seed heads. Snow lies as on grass.
3. **Dunes are walked as slowly as hills** (`DRAG`), as the table has them as slow as ash: warm ochre
   sand with a crest across each near square, lit along its top with its lee in shadow, and the wind's
   ripples over the rest. Snow lies as on sand.
4. **Vines are walked through as the woods are,** with no drag (the table's 3 is the pines'): the
   shore's trees stand to the sides of each square hung with the creepers' curtains, the way through
   open, green the year round and duller in the winter. A strangler vine is a group placed in them with
   `roams: false` (MONSTERS §8.2): its placement holds it, not the ground.
5. **The volcano and a vent are the mountain's rock** (`cell('volcano', 'mountain')`): solid, never
   seen past and climbed by a Mountaineer and nobody else, as the table's 30 (a peak's) says. G11's
   vents' mouth, Grimsforge and the salamanders' slopes are on the ash foot round the cone (ashfall.md
   §4.5), so nothing walked is lost. Neither slows a climb.
6. **A box draws the cone as `V` and a vent as `@`, both the atlas's volcano:** the cone black-red rock,
   broader than a mountain and flat at its lip, ash run grey down its flanks; a vent the same with its
   fire in the lip, dull by day and bright by night, its smoke going up. The scaffold writes `V`
   and the author letters the vents (the mouth at 215,326 is one); the three iron mouths at 226,334
   are the way into #22, a feature on the ash.
7. **The atlas lays no volcano square today:** the range at 204–226,326 paints the cone as mountain
   over the volcano patch under it, so G11 cuts with the cone as `M` (281 squares). Its builder letters
   the cone `V` and its mouth `@` over the draft, and the world map takes them from the built map.
8. **Lava is the `!` there was:** walked and glowing, with no harm in it, as before. A flow is a line of it
   from the cone's foot down the ash and a field is laid wide, as the cut brings them: G11's three
   flows come through square for square.
9. **On the automap** the steppe, the dunes and the vines are washed as open ground is, each its own
   colour; the volcano is inked black-red and a vent redder, unwashed as the mountain is.
10. **A sample of each** (`ground_steppe`, `ground_dunes`, `ground_vines` with a strangler vine standing
    in it, `ground_volcano` with a vent and a flow), swept for cracks and shown on the sheet; the smoke
    test paints the three grounds through the year with the others, and the cone and a vent beside the
    mountain, a vent's fire by night and its smoke over the cone.

**Line of sight over the hills** (#53, the last of the finishing touches). A hill hides what lies
behind it from lower ground: the viewport does not draw it, the automap does not mark it and a group
standing there is neither drawn, marked nor met, so a fight can come from over the brow (`hillOver`
and `World.hidden` in `game/world.ts`; `GameMap.blocksView` given the eye's square). A company on a
hill sees over hills and no farther; one beside a hill sees past it. Night, a light and the weather
say how far a company sees, as before; a hill cuts the line, and the nearer stop wins. Woods hide
nothing: a wood is trees the view passes between.

Decided by delegate for #53, each the owner's to overturn:

1. **The rule is relative** (the delegate's call 3): `blocksView` takes the eye's square, and a hill
   stops the view of an eye on lower ground and not of one on a hill or on a mountain's top, where a
   Mountaineer may stand. With no eye it answers what stops the view from anywhere, as it did, so one
   function still decides and a later change (the world's end, #829) can extend it.
2. **A hill hides by its row, not by its corners:** the line from the eye is read where it crosses
   the middle of each row between, and on the seam of two squares it takes two hills to hide. The
   walk that walls stop is kept for walls, so nothing moves where there is no hill; read that way,
   one hill straight ahead would hide 4, 6 and 7 of the 7 squares at depths 2 to 4, more on one side
   than the other, ground the view shows plainly beside it.
3. **What stands taller than a hill is seen over it** (`GameMap.overtops`): the mountain, the end of
   the world as it is drawn tall (decision 8) and a landmark (Crowness Light, Highcell) are drawn and
   marked past a hill as before; a building, a tree, a rock and a group are not.
4. **Behind a hill the hill's own ground runs on,** flat, in its colour and with nothing on it, and the
   ground out to the horizon past a hill ahead is the hill's: a hole would draw a seam, and the far
   ground's own colour would tell what lies there.
5. **The squares round the company are marked as before, but for one a hill hides** (two off, past a
   hill beside or behind the company), read in the way it lies; and the automap's near rule (a group on
   a seen square within two steps) leaves out a group a hill hides (the delegate's call 4). A wall hid
   neither when this was built; since #889 it hides both (below).
6. **A save keeps what it marked:** explored bits only ever add, so a save made before loads with the
   valleys it marked from below, and hiding applies from then on. It asks no save upgrade.
7. **The pilot is left as it was:** it reads the automap's seen squares and groups through `Known`,
   so it sees what a player sees; a hill's square is seen and stood on, so its explorer climbs it as a
   frontier square and sees what lies behind.
8. **The world's end drawn as the atlas paints it (#829) is the void for sight:** `blocksView` reads
   the cell and not its look, so a void drawn as a hill stops the view as the void always did, from a
   hill too, and no look is read as a hill. Whether a hill hides it reads the look: bare or drawn as a
   mountain it stands over a hill; drawn as the sea or as land it lies as low as they do and is hidden
   with them. Where no hill hides it the view draws the look as #829 draws it, and the ground to the
   horizon is the look's but where a hill on the centre line hides it.

**A wall hides what lies past it from the squares round the company** (#889). Outdoors by day, when
the sky lets the company see four squares, it maps the two squares round it (a Cartographer, three),
and until #889 every one of them was marked whatever stood between: one off a wall, a building, the
mountain, a door or a secret door, the company mapped the square behind it from two off, and with it a
Master's hide. `World.reveal` now asks of every square past the first what it asked of the
Cartographer's extra one (#857): it is marked only where no square between it and the company, taken a
step at a time toward the company, stops the view (`GameMap.blocksView`), and no diagonal step on the
way slips between two that do. One off, a square between two that stop the view is marked only if it
stops the view itself, and so beside the corridor ahead. The outdoors is as underground, where the
company maps one square: a wall is marked and what lies past it is not, until the company stands in
the doorway or the view reaches round it. A landmark is marked over a wall, as the view draws it.

What a player sees change, facing north from each of the 64,346 squares a company stands on, in a sky
clear everywhere by day: of main's 1,016,342 squares marked two off, 33,585 (3.3%) are not, and 40 of
its 514,768 one off. The mountain stops 50.6% of those two off, the void 24.9%, a building 13.7%, a
wall, a door or a secret door 8.0% and a corner 2.8%. They are the mountain (43.8%), open ground
(16.3%) and **the world's end** (27.1%, 9,086: the void drawn as land 4,911, the mountain 1,762, hills
1,742 and the sea 671): at the edge of the built world the automap inks one square of the void's look
where it inked two, as a void stops the view whatever it is drawn as (#53's decision 8). In the open
nothing changes: a hill hides as above and a wood hides nothing.

Decided by the builder for #889, each the owner's to overturn:

1. **The question is asked of every step on the way,** not of the square beside it alone, which the
   issue proposed (`d > 1`): that left a Cartographer the square two behind a wall or a secret door one
   off, a hole at two squares with the hide marked past it (139 of the 150 sides of the outdoors'
   secret doors with two open squares behind them, as on main). Her extra square is now the last step
   of the same walk, and her reach on open ground, at night and underground (3, 2 and 2) does not move.
2. **A found door is a door.** It shuts the view from two off as any door does and as the viewport draws
   it, so the square behind it is marked once the company stands in the doorway: the issue's "once the
   door is found, it has" is read so.
3. **The check is read over the content as well as on a fixture:** the 99 secret doors of the outdoors
   as played, from the 204 sides that have an open square to stand on and one behind the door, in a
   sky clear in every region by day: 204 told on main, none now (`tools/tests/outdoors.ts`). The rule
   on open ground with each stopper is held beside the hills' (`tools/tests/terrain.ts`). The issue's
   count, 170 of 198, took the sky as it fell.
4. **The world's end stops the walk,** whatever the void is drawn as, as #53's decision 8 has it and
   the view draws it (the owner's delegate's call at #903's review). Flipping it is one line in the
   walk, its stopper passing over the void, and inks 8,439 squares two off again: the void drawn as
   land 4,834, hills 1,667, the mountain 1,214 and the sea 664.
5. **No step slips between two that stop the view.** The walk is a staircase that takes its diagonal
   steps first, and a diagonal step between two stoppers let it through: Deepthorn J4's box (308,110)
   was marked from the hill at 309,112, Monksvale J10's tolls (306,302) from 308,300 between two
   squares of the mountain and the square behind Kilnmouth M6's door (413,179) from 412,181. Such a
   step now stops it, the step into the company's own square too: 926 marks two off (0.09%).
6. **One off, a corner hides what does not stop the view.** The eight squares round the company were
   marked whatever stood between, so Kilnmouth M6's cache (413,180) showed from 412,181, one off
   between two buildings, at any hour; and the corridor ahead marked the chest of the Delta B4's
   flood-store (42,105) from 40,106, facing its door. A square between two that stop the view is now
   marked only if it stops the view itself, round the company and beside the corridor, so the walls
   still close round the company as the automap has always drawn a corner. It reaches the dungeons,
   where a corner shuts off a square here and there: every suite run with it and without it prints the
   same lines, the dungeons' figures and the pilot's among them.
7. **A landmark is seen over a wall,** as over a hill (#844): Highcell (322,343) stands behind its
   gate, an exit no company stands on, and the walk left it unmarked from the road's end. The rest of
   `GameMap.overtops`, the mountain and the void drawn tall, is not: over a wall they would ink a range
   round a hide and leave the hide a hole, and they marked the mountain two behind 6 of the 204 sides.
8. **The check holds a diagonal approach as well as the four sides:** the square behind each side and
   every chest of its hide (160 squares, 121 chests), where no run of squares that do not stop the view
   joins them to the side stood on, from every square a company stands on within two, three with a
   Cartographer, facing any way: 3,244 marks on main, 216 of 8 such squares on the walk before #903's
   review, none now. The corner is held on a fixture beside the walls' (`tools/tests/terrain.ts`).

## The calendar and the weather

Pillar 4 says the world has a clock. It now has a year and a sky as well.

- **The calendar** (`game/calendar.ts`). Eight months of fifteen days, two to a season: Thaw and
  Sowing (spring), Longlight and Harvest (summer), Leafturn and Mistfall (autumn), Frost and
  Longnight (winter), 120 days in the Lanterns' year. Game day 1 is the 1st of Mistfall, 1016, late
  in the autumn, so the first winter comes on while the party is still on the Foreland or just over
  the pass. The days lengthen and shorten: dawn and dusk are 12 hours apart at the equinoxes (the
  old fixed clock), 15½ at midsummer, 8½ at midwinter, and the sun and moon follow them. The status
  strip is two lines now: the facing, the time and the map; then the date and the sky with a glyph.
  M adds an almanac to the map info: the date and season, days since the Hearth flickered, dawn and
  dusk, the sky, how cold it is, and what the weather is doing to the party.
- **The weather** (`game/weather.ts`) is a pure function of a per-save seed, the minute and the
  region's climate, so nothing about it is saved but the seed (`WorldState.weatherSeed`; older saves
  take a fixed one) and it never draws on the gameplay rng, so a fight replays the same in any
  weather. Smooth noise in time gives how wet the air is (fronts over days, showers over hours,
  bursts inside them), how cold, how windy and how foggy; the season sets the odds and the
  temperature, and the temperature picks rain, sleet or snow. Snow lying and standing water are the
  same function run over the ten days before, so snow builds through a fall, lasts in the cold and
  melts in a thaw or a rain. A new game draws seeds until its first morning is dry and free of fog.
- **Regions.** A region is an area, with its `climate` in its `index.ts`. Each map names its region
  (`MapDef.region`; the laid outdoors names none, its zones do); towns and dungeons share their
  region's weather, and a test holds them to it, naming any map that differs. No sky is lent: a
  World asked the sky of a square no zone or map gives a region throws, naming both (`regionOf`,
  #945). The Foreland is mild and wet, foggy off the sea in the autumn, with snow only in a cold
  snap; Thornmark is colder, and its winter snow lies deep for weeks. Fronts reach
  Thornmark five hours after they cross the Foreland.
- **What the sky does:** clear, cloudy, overcast, fog, drizzle, rain, downpour, thunderstorm,
  sleet, flurries, snow, heavy snow and blizzard. A shower on a threshold does not flicker: each
  strength is entered above one line and left below a lower one. The log reports changes as the
  party sees them ("Rain begins to fall.", "The rain turns to snow.", "Fog rolls in off the sea.",
  "Mist rises between the trees."), says what the sky is doing on a new game, a load or the way out
  of a dungeon, and says nothing underground.
- **What it does to play.** Thick fog or a blizzard leaves two squares of sight, thinner fog, a
  downpour or heavy snow three (a Light spell does not cut fog; underground nothing changes). Snow
  lying deep adds two minutes to an outdoor step, as hills do (`HILL_DRAG` in `game/map.ts`): six
  on the flat, eight on hills or in deep snow, ten on hills in it. In a downpour, heavy snow or
  thick fog, bows, slings and crossbows lose 2 to-hit on both sides of a fight
  (`MonsterDef.missile` marks the archers; the Ashen casters are ranged without it), and the
  fight's log says so. The inn wakes the party at 07:00, or at first light in the depth of winter.
- **A time to walk.** A group may walk only by night or by day, in fog or snow, or in a season
  (`EncounterDef.when`), only after a step (`after`), or stop coming back once something holds
  (`until`, the quest log's conditions). Out of its hours it is not there, not drawn, fought or in
  the way, and comes back where it stood. Nothing new is saved: the clock, the weather and the save
  already hold all they read. Thornmark's Rift stops coming back once the Warden of the Cut is dead,
  and Ashfall's sentries wait on the Ember Stone's flag, `q_ember_lit`, as its boxes place them
  (#548, #449).

## The road to level 10

The slice's content ends around level 4. The Thornmark extension carries a party to 10, and its
trainer one level past it, onto Act II's road:

- **Progression.** `MAX_LEVEL` is the road's cap, 32 (#159), and each level past 10 gives what one
  under it does; the sheet says so at the cap. What a company reaches is set by the towns built:
  each town's trainer teaches to its area's band's top plus one (`trainerCeiling` in
  `content/progression.ts`), the Warden Drillyard in Helmstow to 6, the Elder's Yard in
  Thornhold to 11, the Sail Loft in Saltmouth to 13, the Lamp Gallery at Lantern Watch to 17, and the
  Old Working at Anvilhall and the Ore Shed at Kilnhaven to 19. Five spell tiers, unlocked at levels 1, 2, 4, 6 and 8 (`spellTierAt`); damage
  spells stop growing at 10 (`SPELLS_GROW_TO`, DESIGN.md §7). Trainers charge 25 a level to 5 and
  40 a level after, to the cap (`trainPrice` in `party.ts`, which the curve's gold reads). Guilds
  sell up to a tier of their own (`maxTier`: Helmstow 2, Thornhold 4) at 40, 80, 160, 320 gold;
  tier 5 comes only with level 8.
- **What a kill pays.** Each member by the monster's level against theirs (`killPay`): a tenth at
  three or more under, 0.4 at two, 0.7 at one, the whole at their level, 1.15, 1.3 and half again
  at three or more over, split among the living. Where the members' levels differ, the log gives
  the least and the most share. Gold and loot stay fixed.
- **The curve** (`content/progression.ts`). Each area has a band, the floor of the next and a price
  window: the Foreland 1-5 and 500 gold, Thornmark 5-10 and 1,200; and Act II's three, Saltreach
  10-12 and 2,000, Wrackholm 12-14 and 2,500, Sunderwood 14-16 and 3,000. Three quarters of a
  clear's xp should take a member to the next floor, and its gold train the six there; every monster
  has a `level` within two of its maps' bands, rising from the way in (it sets what a kill pays, and
  changes no combat), and no chest or drop is dearer than the window. Both clears give it:
  `node tools/test.ts curve --list` prints the Foreland's 4,101 xp a member of the 3,734 it asks, and
  Thornmark's 16,765 of 13,667 and 9,355 gold of 8,400.
- **Spells.** Nine new ones. Cleric: Ward (party AC), Mending Light (party heal), Restore (big
  heal plus every cure), Revive (raises the dead), Wrath of the Hearth (damage to every foe).
  Sorcerer: Haste (party speed and to-hit), Chain Lightning and Meteor Swarm (every foe, scaling
  with level), Town Portal (back to the last town stood in; `lastTown` in the world state).
  Combat carries Bless, Ward and Haste timers side by side.
- **Classes.** Ten: Knight, Paladin, Ranger, Cleric, Sorcerer, Thief, plus Barbarian (d12 hp, martial
  weapons, leather and brigandine only), Monk (staff and robe, levels into Speed), Bard (a
  half-caster on the cleric list) and Druid (a full caster on the new druid list: Thorn Lash,
  Foxfire, Barkskin, Salve, Hawk's Eye, Stinging Swarm, Regrowth, Hailstorm, Heart of the Stag,
  Tempest). The Ranger now draws on the druid list, not the sorcerer's. Both Lantern guilds teach
  bards and druids.
- **Class traits.** Every class has one or two passives (`TRAITS` in `party.ts`), listed on the
  class picker and the character sheet. Knight: Stalwart (+2 AC), Weapon Master (+1 melee). Paladin:
  Holy Strike (+3 on the dead), Divine Health (no disease). Ranger: Marksman (+2 ranged), Keen Eyes
  (always finds secret doors). Cleric: Healing Hands (+3 on heals), Faith (no curses). Sorcerer:
  Spellfire (+2 per foe on damage spells), Iron Will (no sleep). Thief: Sneak Attack (+4 in round
  one), Keen Eyes. Barbarian: Rage (+3 melee below half hp), Die Hard (dies at -20). Monk:
  Unarmoured Defence (robe or less: +1 AC, +1 per two levels), Stillness (no paralysis). Bard:
  Inspiring Song (+1 to-hit for the party while standing). Druid: Nature's Ward (no poison), Healing
  Hands.

## Art

Everything is drawn at runtime from vector shapes; there are no bitmaps in the repo.

- `ui/paint/brush.ts` is a minimal `ShadeTarget`, so sprites and portraits paint with the engine's
  own cel-shading helpers (`celBall`, `celCapsule`, `celPoly`, `band`) and share the sibling games'
  look: 1px ink outline, three tones, top-left light. It is the paint kit's (`ui/paint/`, #983),
  with the gloss, one `INK` and `rod`, the forms (`ring`, `tube`, the unit frame) and the flame:
  what every drawing in `ui` paints with. It, the monsters' kit and the rooms' are the systems
  lane's; the old paths (`ui/brush.ts` and the rest) re-export them, and a family or a scene takes a
  kit when it is next edited (EXPANSION §8.1).
- `ui/portraits.ts` builds a front-facing portrait per character from the name, race and class
  (head shape, ears, skin, hair, beard, class headgear), with the expression following the
  character's state, cached to an offscreen canvas.
- `ui/scenery.ts` holds the trees, rocks, mountains and pillars, and `ui/sprites.ts` dispatches the
  monsters to `ui/monsters/`, one module per family (rat, slime, wolf, boar, spider, bandit, cultist,
  skeleton, riftling, ogre, wraith, birds, old wood) behind one `draw(ctx, kind, x, y, h, paint)`
  signature. Each family registers the kinds it draws in its `SPRITES`, each with its drawer, its span
  and any part drawn apart, and `ui/monsters/index.ts` merges the 28, refusing by name a kind two
  families register or one no area names; `FAMILY`, `SPAN` and the smoke test's `DETACHED` are read
  off it, so a new kind of a family is its family's file alone (#915). The monsters' kit,
  `ui/monsters/kit/`, has the brush and the small shape helpers (`common.ts`), the measured humanoid
  frame the bandits, the cult and the skeletons stand on (`figure.ts`) and the chisel's mark
  (`chisel.ts`, which `knockers.ts` re-exports); `common.ts` and `figure.ts` beside it
  re-export it. Every monster def names a sprite kind no other def uses (`tools/tests/art.ts`
  holds it), so the variants that share a family (the archers, brigands, smugglers,
  wrecker and lampman, the cult's ranks, the bone knight, the ghoul, the drowned man
  and the Barrow Guard and Captain, the dire wolf, rift hound and Black Dog, the thorn spider, shore
  crab and rift crawler, the crow and the great owl, the elder and the two wardens, the bramble,
  rootwalker, heartwood and the Eldest) are drawn with their own gear, anatomy and glow rather than
  a recolour.
- `ui/paint/gloss.ts` is how the monsters stop looking like outlined primitives, after the Xeen
  look: `blob()` paints every part of one material (a wolf's fur, a robe, a hide) as a single
  mass, with one ink outline around the union, one rendered gradient across the whole (a bright
  core toward the light, a deep band at the far edge), then, clipped inside, a soft volume per
  part, creases where forms meet, a surface texture (fur, bristle, stipple, scales, mail, cracks,
  folds, facets; only above a minimum sprite height) and a specular where the surface is wet or
  crystalline. Contours are `curve` parts (a spline through points, lumpy or fur-tufted) and
  `tube` parts (a bending tapered tube for tails, necks, legs and tentacles); `glow()` is a real
  radial light for embers and halos; `softLine()` replaces interior ink. The hit flash still
  paints a flat white silhouette through all of it. Each monster is one piece of ink at combat
  size, alone, three and six abreast, through its idle, but for the parts its family declares
  apart (`detached` in its `SPRITES`, the smoke test's `DETACHED`: the wardens' shards, the
  acolyte's censer, the lampman's lantern, the adept's hand flame, the rift hound's and the Hand of
  Ash's embers, the wraith's fading cloth), and stands inside the view where a fight seats it, its
  foot 184 px below the view's top (`seatFoot`), and within its span (below); the smoke test holds
  both. The old path, `ui/monsters/gloss.ts`, re-exports it.
- Combat sprite height comes from `combatHeight()` in `ui/sprites.ts`, which scales with how many
  monsters share the row: a lone enemy or a pair fills the viewport the way a Xeen monster does,
  three and four taper down, five is the old flat size and six goes under it. Across the view the
  row is seated by `seatRow` in `ui/row.ts`: each kind's span (`SPAN`, read off its family's
  `SPRITES`) says how far its drawing reaches either side of its centre, and neighbours stand a slot
  apart as they always have, or further where they would overlap by more than a third of the
  narrower (`OVERLAP`). A row that would run past the view's edge closes up, never past the third,
  and slides in; one still too wide is drawn smaller, the whole fight at one scale, so every monster
  stands whole inside the view with two pixels to spare (`SPAN_SLACK`). A row that fits stands as
  it did. A back rank stands in a row of its own behind the front, a fifth smaller and between them
  (`BACK_RISE`, `BACK_SCALE`).
- `ui/viewport.ts` textures every surface procedurally: stone courses (front faces and receding
  side faces), timber-framed houses with hipped roofs and windows lit at night, flagstones with
  mortar, grass tufts, pebbles, waves; a sky with a sun and moon on the compass, clouds, stars and
  two bands of distant hills that turn with the party. The static scene is cached per world state
  and monsters are drawn over it each frame with a line-of-sight check.
- `ui/interior.ts` and `ui/interiors/` paint the businesses' interiors, 45 of them, one per business
  (`interior` on the map feature names it). The Foreland's eight and Thornmark's six: the
  Hearthlight's common room round its fire and the Green Man's under a carved face of leaves; the
  Chapel's stained-glass apse and the Chapterhouse's grove; the Provisioner's pigeonholes and the
  Armoury's forge; the Guildhall's map of Caldera and the Lantern Hall's copy of the Grove Stone;
  the Drillyard inside Helmstow's wall and the Elder's ring of stones; the Gilded Eel's harbour
  window and the Split Oak's living oak; the throne room behind the keep's door, its throne under
  black cloth. The farm kitchen is Ellerby's store (#87). Saltreach's eight, Lantern Watch's five,
  Anvilhall's six, Kilnhaven's six and Rime Lodge's six are painted beside them, each in its built
  town (docs/areas/kilns.md §3 and docs/areas/rimewater.md §3 describe the last three). No people:
  the rooms are backdrops. The rooms' kit, `ui/interiors/kit/`, has the walls, floors,
  windows and light (`stage.ts`), the furniture and goods (`props.ts`) and a trade's
  own (`trades/`, the temple's and the smithy's), which `kit.ts` and `props.ts` beside
  it re-export; each scene is a file in `ui/interiors/<area>/`, and what both towns'
  scenes of a trade use is in `shops.ts`, `guilds.ts`, `yards.ts` and `taverns.ts`.
  A scene is painted once into an offscreen canvas and multiplied by a light map (the ambient for
  the hour plus a pool round every lamp, fire and window it put down), so the corners fall dark on
  their own; flames, glows and drifting motes are drawn over it every frame. Windows and the two
  yards follow the clock.
- The Xeen pass: saturated palette with no distance fog outdoors; per-cell wall dressing chosen by
  hash (torch sconces with flames animated over the cached scene, banners in the map's colour,
  cobwebs, cracks, damp streaks, iron rings, barred grates, carved glyph panels; on houses flower
  boxes and ivy); on every house door a lantern lit after dark, and on a business's a sign with a
  glyph for the service (a door is a house's where a building stands beside it; a door set in stone
  is an arched doorway in the wall, with neither; outdoors, a secret door set among mountain, rock or
  trees is drawn and inked on the automap as most of its neighbours are, so a sett or a cave is found
  and never seen, and once found it is a door); a town or a dungeon may place its banners
  (`MapDef.banners`), which hang whatever the hash says; map palettes choose `wallStyle` (stone,
  brick, smooth or tent) and `ceilingStyle` (vault or timber beams); cobbled roads, flowers in the grass, cracks and
  puddles on flagstones; a carved plank frame with brass fittings and rivets; a painted title
  looking west over the sea at the Hearth. The dressing is restrained (`wallDressing()` in
  `ui/viewport.ts`): a wall is dressed only where its hash beats the four round it, so about one in
  five and never two side by side, each kind at its rate in `DRESSING_RATES` (nearly half the
  dressed stone walls a sconce, so dungeons stay lit); a door's lantern and sign are its furniture,
  not dressing. `tools/tests/art.ts` caps a map at 35% of its wall faces dressed (half under 100
  faces) and a kind of map at 25% (from 200 faces), placed banners among them, holds every placed
  banner to stone wall and none to an outdoor map, and fails the walls as they were dressed before
  #9.
- Final polish: pitched, hipped, tiled roofs that run across adjoining cells with eaves, ridge caps
  and a chimney, keyed per building (one roof per building, projected like the walls, so its front
  and side slopes meet along their hips); timber bracing and a window on house side faces; a birch
  tree variant; a parchment automap with inked walls and a compass rose; hit sparks and a red card
  flash in combat when someone takes damage.
- Weather and seasons: the cached scene is two canvases now, the sky and everything in front of it,
  so a lightning strike can light the whole sky behind the roofs and trees and fork down behind the
  hills. An overcast sky greys over with a cloud deck and hides the stars, sun and moon; a downpour
  darkens it; fog washes it out. In the scene, cloud lays a flat grey light over everything, murk
  (fog, or rain or snow coming down hard) swallows far faces into the haze, rain darkens the ground
  and leaves puddles holding the sky on the roads, and lying snow whitens the ground, the cobbles,
  the roofs, the hills, the rocks and the conifers' boughs. The grass runs from spring green to
  tawny through the year. Hills rise as round-shouldered mounds of drier grass that run on into one
  another (slow going; from below, one hides what lies past it: the outdoors' line of sight, #53);
  farmland lies in fields three squares long in bands
  two deep, each with its crop (wheat, barley, pasture, roots) green in Sowing, gold or cut by
  Harvest and ploughed through the winter, its rows or furrows and the hedges between fields showing
  under snow. Light woods (`t`, the atlas's woods) are walked through at a plain step: a shaded
  floor of moss, leaf litter and ferns with a tree or two to either side of the square, the way
  through it open. Dead wood (`d`) is walked the same, over grey ground and fallen limbs, its trees
  long dead: bleached trunks, bare or snapped short, with no green in any season. A glass tree (`c`,
  on crystal) stands where a tree would and blocks as one, shards of crystal catching a point of
  light by day. The chasm (`v`) is no wall and is seen across, but a step into it is refused ("The
  ground falls away. There is no way down here."); where ground stands beyond it, its far wall hangs
  from the rim in bands of rock darkening into the drop. Salt (`-`) is walked as sand, a white crust
  cracked into plates. Heather (`h`) is walked as grass, a purple-brown moor of low dark clumps that
  goes purple while it flowers, from late Longlight to Leafturn. Tidal ground (`;`) is the shore the
  sea leaves twice a day (`tideAt` in `game/calendar.ts`: high water 04:00 to 08:00 and 16:00 to
  20:00, read from the clock and saved nowhere). At low water it is wet sand with ripples and pools,
  walked; at high water it is drawn as the sea, and a step onto it is refused ("The tide is in. The
  sands will show again.") unless someone swims, and a group keeps off it. The log says the tide
  turning where the flats are in sight, and a `when` can name the tide. Ash (`a`) lies dark grey
  under the vents, drifted and rippled, a cinder in it and here and there an ember, dull by day and
  glowing by night; it is slow going, two minutes more a step as hills are. Pine (`p`) is walked as
  the woods are, the pines closer and taller about the square and green in every season, over
  needles and cones. Ice (`i`) is a frozen lake, walked: pale and blue, whitest in the winter and
  greyer with meltwater in the summer but never open, with black ice, the light along it and
  hairlines frozen in; a group placed on ice is drawn under it, its shape dark through the ice and
  nothing of it standing over it. Lying snow underfoot is the maps' snow (`*`). A peak (`A`) stands
  over the mountains, taller and steeper, white from its top to a snow line that comes down in the
  winter and further under lying snow, in tongues down its gullies. A cliff (`|`) is an escarpment's
  sheer face, upright and broken a little along its top, its beds in ledges, a line of them one face;
  snow lies along its top in the winter and on its ledges under a deep fall. The steppe (`s`) is dry
  grass in tufts, tawny at Harvest and greener in Sowing; dunes (`u`) are warm sand, a crest across the
  square and ripples; vines (`&`) are dark ground under the shore's trees hung with creepers, standing
  to the sides of the square as the woods' do. The volcano (`V`) is a cone of black-red rock flat at its
  lip, ash run down its flanks; a vent (`@`) has its fire in the lip, bright by night, with its smoke
  going up. Broadleaf trees bud in Thaw, blossom in
  Sowing, turn orange and gold in Leafturn, brown and drop in Mistfall and stand bare through the
  winter (`treeSeason()` in `ui/scenery.ts`); flowers only come out between Sowing and Leafturn.
  Lamps and windows light early on a dark day. Every frame, over the scene (and over the monsters in
  a fight): rain as streaks in three depths, more, longer and slanting harder with the wind across
  the view, splashing only on floor the party can see; snow as flakes that sway and blow, nearly
  flat in a blizzard; fog banks drifting low; and the flash of a strike. Particles take their
  positions from `mixHash()` in `game/weather.ts`, which mixes well enough that a drop's x is
  unrelated to its y (`hash()` in `ui/paint/brush.ts` does not). All of it costs a fraction of a
  millisecond a frame.

## Stubbed or absent

- The Meridian journal opens The Lost Expedition in the quest log, and the Cartographers' Geographer
  in Saltmouth reads it (#181); vol. IV is Ashfall's, and no vol. II or III exists.
- No audio. The engine's synth stack is vendored, unused.
- What the checks owe: a known shortfall prints as `owed` with the issue that owes it, and
  `node tools/test.ts` ends by counting them. None is owed since #865 re-sized `cairnfield_m8`.
  Under `--list` the gate lists 88 figures off their aim, inside their limits: fights to a rest,
  figures two under a floor, wins at a floor and four bosses' odds (#47 left the limits as they were).

## Checks

`npm run check` runs three gates, each verified to be able to fail:

- `typecheck`: `tsc -p tsconfig.json` (no emit, strict, over `src/`, `tools/` and `types/`), zero
  suppressions. It is the first content check: a monster with no drawing, a business with no room
  or a map in a region no area has fails it.
- `test`: `node tools/test.ts --jobs`, the suites in parallel (#954), then the runner's own check,
  `node tools/tests/runner/check.ts`, on `tools/tests/runner/fixture/`, `stuck/`, `leaves/` and
  `narrow/`, in one process and under `--jobs`, their failures kept out of the real run, then
  `node tools/test.ts fullrun`, the pilot's full run on the shelf (about 10 to 25 s; it
  repeats walkthrough:shelf's play). The suites are in `tools/tests/`, one file each exporting a function of its name (`lib.ts`
  is what they share, and `tools/kit/` what they share with the walkthroughs: the
  headless game, the fight, the company, the line and the rules, #984), which the
  runner finds (maps, movement, monsters, combat, harness, party, traits, calendar,
  terrain, weather, atlas, outdoors, save, quests, then any other in name order),
  then each area's walkthrough (the Foreland's and Thornmark's), in road order, each with an `ok` of
  its own, under which its runs keep the goals they walk (`everyGoalWalked`), so one passes alone as
  in the full run. After every suite the runner finds the item and monster tables as they were, each
  entry by identity, and fails a suite that leaves one added, removed or replaced, by name (#946); a
  suite lends a def through `withDefs` (`lib.ts`). `layers` holds the imports to the layers
  (EXPANSION §8.1, #900). Each area's
  `checks.ts`, found by its file as its walkthrough is (`tools/kit/checks.ts`), holds the rows the suites
  keep of it that are its own and no part of the game, what it owes, its rungs of the ladder, its lead
  over the road, its seams as built and its edges open on nothing (`AreaChecks`); what describes a
  zone, a group, a monster or an exit is a field of that. A suite
  reads them beside its own table and refuses a row in both (#897); the Foreland's have moved. Every check has a
  line saying what it holds, so the output under `--list` is the list; `node tools/test.ts maps combat` runs a few
  suites, `walkthrough:<area>` one walkthrough. The pilot's survival sweep and full run (`survival`,
  `fullrun`, docs/PILOT.md) run only when named; `npm test` names the full run, on the shelf alone.
  `--since <ref>` (or `TEST_SINCE`) runs the gate and the walkthroughs only for the areas the diff
  since the ref reaches and `--areas a,b` (or `TEST_AREAS`) for those; every other suite runs whole
  (#955). `node tools/changed.ts <ref> areas` prints each area reached with why: a file of its own,
  or a file of another area that imports the one changed, in turn. Where more than a comment
  changed, every walkthrough runs as well: they read other areas' maps by id and by scan, which no
  import shows. A changed or removed line of an area's items or monsters, a rung of the ladder (an
  area's `gear`), a module the gate or a walkthrough loads, what decides what runs and a file the
  graph does not read reach every area; the docs, a module neither loads and the drawings none.
  The run says what ran and why before its table, and in `$GITHUB_STEP_SUMMARY` where it is set;
  with neither flag every area runs, as the runner's check holds on `runner/narrow/`. Locally the
  ref is the base, `--since origin/main`; `TEST_SINCE=HEAD^1` is the last commit.
  The run is quiet unless asked (#895): by default it prints each suite's name as it starts, so a
  run that dies inside one names it last, then a check only when it fails, and the owed lines; what
  a suite prints itself (the gate's `n/a` lines and its figures off their aim, the quests' `info`)
  waits for its first failure, and prints then, in order. `--list`, or `TEST_LIST=1`, which reaches
  each step of `npm test` and `npm run check`, prints every line. Each suite ends with a line of its
  seconds and its count (`gate  335.5 s  617 ok`), timed in the one process from its load to its
  end, and the run with a table of those lines, the slowest first, before the last line. A green run
  printed 27,874 lines on 18 October and prints 182. The table that day, loaded, on a four-core
  container shared with other runs: the gate 335.5 s, `labels` 104.5, `row` 84.5, the Foreland's
  walkthrough 33.1, `quests` 27.7, `harness` 27.1, `scaffold` 12.3, `pilot` 8.5 and every other
  suite under 6, 698.9 s in all. In CI's tests job (#905, 8965ac98): the gate 149.4 s (53%),
  `labels` 37.9, `row` 30.4, `harness` 15.2, `quests` 13.9, the Foreland's walkthrough 8.7,
  `scaffold` 4.6, `pilot` 4.3 and every other suite under 1.5, 282.8 s in all.
  In parallel (#954): `--jobs [N]` runs the runs as processes of their own, N at a time, as many as
  the cores where N is left out. A suite that exports `parts()` runs as its parts, `suite:part`, in
  one process too: the gate's are `fixed` (its workings on fixtures and the tables' checks) and one
  to each area the run asks for, Saltreach's with the enclave's fixture, each with its own figures
  off their aim and its own owed entries, 723 checks in thirteen runs. The runs over three seconds
  (`DEAR`, or `TEST_DEAR=a,b`) are a process each, started dearest first once the rest, packed into
  one process in the run's order, has started; `--jobs 1` runs every run alone, one after another. A
  run's lines are held in its process and print whole at its turn in the run's order, so the output
  is one process's but the seconds; its seconds, counts and owed lines come back over the channel;
  a process that dies fails the run in flight by name (`died, exit 13`), and any after it in that
  process never ran. The harness's workers take `TEST_CORES`, the cores over the processes.
  `--shuffle [seed]` plays the runs in an order the seed shuffles, printed first and last to play it
  again. The line of the run's wall, before the last line, gives the runs, the processes, the cores,
  the starts, the suites' seconds and the run's. Before it, on 23 October: the gate 52% of the
  suites' seconds in CI (189.1 of 361.1 s and 313.9 of 591.0), its areas 11 s (Thornmark) to 77 (the
  Kilns) on a loaded machine and a process about a second to start. On this container, loaded by
  other runs, on 24 October (2675867d): in one process 75 runs took 700.9 s, the gate's parts 379.3,
  the largest `gate:ashfall` 58.7 after `labels` 97.3 and `row` 86.7, the 56 packed runs 53.2 in
  all; under `--jobs`, four at a time in 20 processes, 341.7 s, bound by the cores (1,297.5 s of
  suites and 52.8 of starts over four) more than by its largest run (`labels`, 174.0 s).
  A check someone owes is reported, not failed:
  `owed()` in `tools/tests/lib.ts` prints `owed: <what> (#40's)`, and fails once the check holds,
  so the entry is dropped. The last line counts them by whose, as `ALL OK (3 owed: #40 ×2, #43 ×1)`.
  Nothing is owed today, so it reads `ALL OK`; the curve and the gate would fail a miss that grows
  past where it was owed.
- `smoke`: `node tools/smoke.ts`, headless Chromium playing the game through the dev server: every
  screen painted with no page error, and a line for each check as well. The file is the runner and
  the parts are in `tools/smoke/` (#1006): `flows.ts` plays the game by its keys and screens,
  `scenes.ts` lays scenes on the Foreland and reads their pixels, `art.ts` holds the drawings to their
  rules and `cracks.ts` sweeps, each part in the frame `boot.ts` gives it. A part makes its own state,
  measures and asserts together and, after a key, waits on the page's state and never on the clock;
  one that throws is `FAIL: <part> threw` with its stack, and the others still report. Every run plays the same
  world (`SMOKE_SEED`; `SMOKE_SEED=random` tries another and prints it). It holds every monster to
  one silhouette and to its span (within 2 px at any size, and no more than a twentieth of a height
  wider; it prints the span to write), every pair of sprite part kinds to a union with no hole, and
  sweeps for cracks between walls: one way from every square of the cellar, Helmstow, its keep and
  the ground's samples (`tools/kit/grounds.ts`, a small map each of ash, pine, ice, cliffs, peaks, steppe, dunes, vines and the volcano) each run, all four
  ways on the maps changed since `SMOKE_BASE=<ref>` (CI passes the pull request's base;
  `node tools/changed.ts <ref> maps` names them, and `monsters` or `interiors` the sheet's), or on
  those `SMOKE_SWEEP=all|<id>,<id>` names. `SMOKE_PART=rest` runs every part but the four-way sweep
  and `SMOKE_PART=sweep` that sweep alone, both when unset; `SMOKE_PART=<part>,<part>` runs those
  parts alone, in the run's order, and refuses a name that is no part; `SMOKE_SHARD=i/n` sweeps the
  i-th of n shards of its plan (`tools/kit/sweep.ts`: each view skipped where nothing stands in its
  window, each window painted once); `SMOKE_SWEEP_AUDIT=1` judges every view the old way too and fails
  a difference (#953). `SMOKE_SHOT=<png>` saves a screenshot of the play after the winding part, which
  CI keeps when the smoke test fails.

CI (`.github/workflows/checks.yml`) runs the three as jobs of their own on every pull request, and
`sheet`, which attaches the contact sheet and gates nothing. The smoke job runs `SMOKE_PART=rest`,
and the crack sweep's four ways run beside it: the `plan` job, Node alone, plans the maps changed
(`node tools/sweep.ts`, a shard for each 60,000 pairs of paints, none when no map is), and the
`sweep` job paints each shard as a job of its own and gates as the smoke does (#953). `npm test`
runs the shelf's full run, and so does the tests job (10 s on CI). A run started by hand skips the
sheet, sweeps every map for cracks with the audit and adds the job `fullrun`: the pilot's full run
on the areas its `fullrun` input names (all unless changed), a report that gates nothing.

On a pull request the tests job runs the gate only for the areas its diff reaches
(`TEST_SINCE=HEAD^1`) and every other suite whole; the walkthroughs run for those areas and,
where more than a comment changed, for all. Its summary says which areas ran and why (#955). Every
day at 03:17 UTC a schedule runs everything, as a run started by hand (a release's) does: the gate
and every walkthrough, and every map swept with the audit; `fullrun` alone waits for a hand.
`pages.yml` runs `npm test` whole on every push to main.

Of the suites before `quests`, `combat` holds the bots' three (#853, #865): a seeded fight played
turn for turn as before with them off, and with them on at 4 and at 10, but not at 11; bless,
sleep and drink each at a company of 12; no spell over many while one sleeps, for the whole company
once a member is past Act I; a caster alone fighting on; no group slept that holds a foe proof
against sleep. `harness` holds the line, and beside the premade six the four newer classes' company
at 12, 20, 28 and 32 on 100 seeds, its fights to a rest inside the limit and its fights from fresh
won 80% (#854); its what-ifs are off unless named.

The suites after `quests` hold the content to its contract (EXPANSION §5), over every area and most
over content broken on purpose too, and two tools to theirs:

- `structure` (§5.1): no iron key behind its own lock however the keys are spent, no guardian that
  comes back, every respawn 720 to 2,880 minutes, every group's, person's and event's `until` and
  `after` naming something real (an `until` only on a group that comes back), no sky asked
  underground, every group placed under the ice standing on ice and every Rift group of
  Thornmark's that comes back stopping with the tear, and fifteen modules (three of the game, each
  area's `index.ts`) each imported first in a fresh process, so none reads content as it loads (#896).
- `curve` (§5.2): each area against its row in `content/progression.ts`: its band, the xp and gold a
  clear gives, its monsters' levels in their maps' bands, groups harder with steps from the way in,
  no chest or drop dearer than its window, an artifact excepted by its mark alone (`windowed`, #847,
  and each would be caught unmarked). An enclave (#845) is counted in no clear and held to its
  own band and its country's window, and stands over its box (`enclaveFaults`).
- `gate` (§2.2, §5.2): the gate's bot (`tools/kit/fight.ts`) plays the premade company
  (`tools/kit/company.ts`), dressed by the gear ladder and with its prestiges, harness's
  own (#541), against every group alone; it takes no tier, skill or found item and
  never blesses, sleeps, drinks or flees (J2). Each map is held to its band, and
  each area pools its groups, each fought at its own map's floor: nine fights in ten won at the
  floor; two under it (of a map whose floor is its area's, and of the area, a zone map's groups two
  under its own floor and a town's or dungeon's two under the area's), a quarter at most won in
  Act I and, from Saltreach's floor, 10, at most two thirds of the floor's aim fought to a rest,
  never all of it (`GATE.backDay`, #851); a boss three to seven times in ten, 6.5 fights to a rest
  give or take one, its bosses left out of the day and each zone's road walked at its floor eight
  times in ten, its nearest groups at its way in among its gentlest. A group that walks only in fog
  is fought with the bows' toll, and one placed on ice from under it; one that waits on an `after`
  is no warning at the way in.
  Each figure has an aim (these) and a limit beyond it (#273): between the two it passes and is
  listed under `--list` at the end of the suite as off its aim, and only past its limit does it fail
  or go into `OWED`. A den's keepers are its camp's hardest fight, won no more often than any of its
  brood; its brood's number and pace are printed under `--list`. An enclave (#845) is judged alone at
  its own floor and two under it by the day from 10, out of its area's pools and day (`gateMaps`).
- `enclave` (#845): the fixture lair, an artifact lair at 30–32 beside Saltreach on the Stair's
  ground and groups, which the gate, the curve, the quests, the pillars and the pilot hold in their
  own suites; here its door: crossing in, the log says its name and band and, under its floor, how it
  feels, harder or a warning, and its sign gives its band; from a level of an enclave, the line only
  where the floor rises.
- `density` (§5.3): nine squares in ten within seven steps of something to find (eight in the core
  outdoors, twelve in the country, as `MapDef.density` marks it), none too far and no more than
  one point in four a sign.
- `wilds` (§5.3): the wilderness features on a fixture field. Each is a point and none a sign; the
  shrine, fountain, cairn and statue give once and are kept through a save and by the shipped list;
  the camp is rested at twice; the riddle is typed through the real keyboard and takes only the
  right word. Every statue's answer is one to sixteen characters long, and some other text of the
  game says it, never another statue's answer.
- `dens` (#88): a den on a fixture field, a point and no sign. Its brood killed together come back
  one a pace, and all after five days away; its keepers alive it neither asks nor burns; burnt, it
  gives its hoard once and none of its brood comes back in thirty days, through a save and a load.
  Its look is said once, on first sight, never for a ruin. Every den keeps its rules: keepers
  beside it that never leave, brood of its kind that come back until it burns.
- `pillars` (§5.4): a hint on the near side of every secret door, there always, an inscription's
  reading among them; no text past three lines of the log, nor a square's texts that can show
  together (day and night, or `until` and `after` the same thing, never do) past the log's four, an
  inscription's words, reading and mark said together; no monster's look past two, no crossing's
  landing line, seller's warning or enclave's door line at its longest past three (#845), every
  glyph in the font, British spelling, a crossing's name and words and an enclave's two feelings
  among them; each `Area.novel` holds; water and roads carry on into the
  atlas; story locks (`content/locks.ts`) signed in, none between areas and every hand-in taking its
  item at the first meeting.
- `people` (§2.3): every hand-in takes its item at the first meeting; Vask, Hale and Sylvane
  each played hired first and early, the words, the pay and the log true either way round; every
  person's words fit the box (a hand-in's with its gold line), a question leaves room for its
  answers and an answer that hands over an item, pays or costs sets a flag. A fixture town holds the
  rest: a question and its two roads read by the log and the save list, an answer with a price
  barred to a company short of it, words by flag and by night, several hand-ins, a letter, a person
  gone from one place and found in another, one by night and events by night or by flag.
- The walkthroughs (EXPANSION §5.8): `walkthrough:shelf` plays The Quiet Farm from a new game,
  `walkthrough:thornmark` the chain and then Thornmark taken early, before Vask's hire and after it
  but before the wand. Each step, by the game's own moves (`tools/walk.ts`): the goal is the
  chapter's, placed at a built map its words name, at the curve's level for it, which sits in the
  place's band; its fights are won once in ten by the gate's bot at that level; the play moves the
  goal on; a person who takes an item stands at the step's place; and nothing a person says is
  written into a chapter already done. Early, the goal comes from no chapter past the last begun,
  each end is said once and the log ends with the entries of the order played. The quests suite
  holds every zone on the road of the built areas to a step of the quest, and fails a step placed in
  an enclave, which holds no zone (`enclaveSteps`, `heldZones`, #845); the Deepthorn's is owed
  to #49.
- `shipped` (§5.5): nothing in the shipped files, joined, goes or moves without a `SAVE_VERSION`
  bump and its upgrade; each id sits in the file of the area that owns it and in no other, and an
  area with content has its file; `node tools/shipped.ts` records what is new.
- `inscriptions` (#538): on a fixture hall, an inscription said as a sign to the premade six, who
  have no reader, and read after its words by a dwarf, a Linguist or anyone with a copybook carried,
  never by a member knocked down; kept read by its id through a save and by the shipped list; its
  marks pinned once read and said once; no flag set and no door changed. Every inscription of the
  content has an id of its own on its map and a reading, its marks name atlas places, and no way
  waits on a reading.
- `skills` (#538, #805, #856, #857): each of DESIGN §5's twelve built, its guild's by DESIGN §8;
  every hall teaches its guild's three, each walked through its own two levels in a Game, every row
  measured against the panel; a stranger to the guild learns nothing, a member learns once for the
  price, a dwarf is born to Linguist, an elf and a gnome to Perception, a ranger to Pathfinder and a
  thief to Lockpick, and none is sold one it is born to; each skill's work with it and without, for
  a company of each people (the search's sure find and second square, the dead marked through a
  wall, an aware group behind a hill, the first round's order held to `hasSkill` for every class
  too, the automap a square further by day, by night, underground and with a chart, a fixture's
  locked chest opened by a thief, a set of picks, a learnt Lockpick or a key and by nothing else);
  the pilot learns none; a save keeps a member's skills and one from before them has none.
  `movement`, `passage` and `shops` hold Pathfinder's ground, Lockpick's doors, the Navigator's
  fares and the Merchant's price.
- `mastery` (#852): each tier's effect through the blow and the cast for a fighter, a caster and a
  hybrid; the bars; the seven trainers of 13 and over teach Expert and the two under do not; the Sail
  Loft walked in a Game; a Master's person, built in the test; the sheet's lines; no spell's cost or
  rounds moved and nothing else under `src/` reading a tier; saves; the words in the font; the
  pilot's keep at the Sail Loft, which trains there and never opens the tier menu. The two Masters
  the content places are played in their areas' walkthroughs, rumour to lesson (`masterOfArms`,
  `masterOfMagic`).
- `items` (#855), on fixtures: a +3 speed coat moves armour and the turn's order worn, and nothing
  in the pack or the bag; a charm of each stat a fight reads moves its read from the pack; a save
  holds the coat and no raise; a lightning blade's die, nothing to the immune, half to the
  resistant, half again to the weak, the steel as ever, seen as a spell's; a fire blade burns a
  mender; `hits` counts the die at 3.5; the sheet's and a shop's words, in the font and inside the
  column; what the sell screen pays (`sellPrice`). The content is held to the shape alone; each of
  the four areas' walkthroughs walks to its two found items and opens its locked chest (#861 to
  #864). The bounds' artifacts (#847): the eight, each of DESIGN §9's shape (one power of the five,
  inside its bound), in its area's items, its Hand's piece's numbers and a point, the stone carried
  with none; its power as its twin's without the mark (the Erzhemd's speed, Akkush's accuracy, the
  Telstok's holy die) and no raise saved; a ward that keeps its condition off, in a seeded fight and
  out, and lifts none; regeneration by the clock's hour and never in a fight; a spell cast from it
  by one who knows none, for a charge and at the level held at 10 unranked, its charges kept through
  a save and back at dawn; sold in no shop and refused at the sell screen with the shop's words;
  said on the sheet, on its slot's line or carried on one of its own, the fullest member of every
  class ending above the panel's foot; its words read as it is taken up from the pack; one in the
  world in a lair of its own area at the cap, owed to its lair's issue while it waits (`UNPLACED`).
- `glyphs`: every symbol `src/ui/` draws past plain ASCII (arrows, stars, hearts) is in the pixel
  font, so none is painted as nothing.
- `drawn`: every group on the maps is drawn while exploring as each of its kinds, to three, and a
  band seen ahead is met as each kind drawn.
- `labels`: every group on the maps as played, alone and in every fight of up to three a map brings
  together, labelled with each kind and its count of the living, but for a lone proper name ("The
  Eldest, 2 Heartwoods"). A kind leaves the label when its last one falls; every line stays inside
  the view and above the monsters' markers, running into no other.
- `row`: every fight the maps can start, and the cap's worst (twelve of every kind drawn, those ahead
  of their maps too, and three groups of the widest and of the tallest), seats every span inside the
  view with no neighbour over more than a third of the next; a fight that fitted as the row stood
  before stands as it did, and only a row too wide for the view is drawn smaller.
- `art` (§5.6): every monster def its own sprite kind, each family's `SPRITES` naming its own
  drawer and merged by the barrel, which refuses by name a kind two families register or one no area
  names, and the walls dressed under their caps, each kind at its rate; a secret door
  outdoors among mountain, rock or trees drawn as they are (`drawnCell`), and any other door, or one
  in a wall or a town, left a door.
- `changed`: which files count every map, monster or interior for the crack sweep and the sheet, and
  which only their own: a family's file counts the monsters of the kinds the barrel gives it, the
  barrel those of a family it adds, and a kind added to a family counts no map; the scenery counts
  every map (#915).
- `layers` (§8.1, #900): the runtime imports of `src/` and `tools/`, read from the files in about
  0.2 s, held to the layers: no cycle among `src`'s, nothing in `src/game` taking content, the UI or
  the app, nothing in the UI the app, no area another's files but its `public.ts` (#992), and the
  walkthroughs and the suites taking `src` and `tools/kit/` alone. Today's crossings are the
  rows of its `KNOWN`, each under the issue that clears it; a new crossing fails, and so does a row
  that no longer crosses, so the table only shrinks.
- `scaffold` (§8.2): the Downs' draft, the Deepthorn's first and J4, the Sunder's K3, the Saltings'
  C6, Wrackholm's F6, the Kilns' O6 and M3, Glacier Foot's N10, the Whitespine's J11 and I11,
  Cindercoast's H10, the Wold's D9 and Fire Mountain's G11, their light woods, dead wood, chasm,
  crystal, salt, tidal ground, heather, ash, pine, ice, peaks, cliffs, vines, steppe, dunes and lava
  and all, laid back into the atlas, are the atlas square for square.
- `ladder`: every class betters its kit by level 3 and again by level 5 (`GEAR` in
  `tools/kit/company.ts`), every find is an item within the Foreland's window and owed to its box
  until a chest, cairn or statue gives it or a monster drops it, Mottram's sells the band's gear and
  the gate check's company wears what harness's does; every class finds a plus it can use in
  Thornmark, each in the ladder by 9, and nothing there gives the Armoury's gear; no rung holds an
  artifact (#847).

`node tools/shot.ts out.png [map x y facing] [keys...]` screenshots any state for eyeballing (a zone map takes its own coordinates: `shelf 8 1 0` faces the end of the world). Besides
keys it takes `fight:<group>`, `time:<hour>`, `walk:<n>`, `day:<n>` (game day n at the same hour),
`seed:<n>` (the weather seed) and `sky:<kind>[:night]`, which moves the clock to the next hour of
daylight (or night) with that sky in the current region, e.g.
`node tools/shot.ts rain.png shelf 16 8 2 seed:11 sky:downpour`. With `STAY_ON_CREATE=1` it stops
on party creation instead of taking the premade company.
`node tools/gallery.ts out.png [--only kinds] [--family wolf] [--scale 2] [--frames 6] [--flash] [--tone 0.6]`
renders every monster (or one family) at the combat size with the viewport sizes underneath, or
as a strip of idle frames ending in the hit flash, for judging an art pass.
`node tools/interiors.ts out.png [--only hearthlight_inn,split_oak] [--scale 2] [--hour 21] [--frame 40]`
renders the businesses' interiors as the viewport shows them, at an hour of the day and a frame of
what moves.
`node tools/worldmap.ts out.png [--zones] [--scale 1] [--at map,x,y,facing]` paints the whole world
map as M does, and with `--zones` the zone overlay over it. The gallery, the interiors and the world
map read their flags as the sheet does (`tools/kit/args.ts`, #986): a misspelt flag, a second output
path or a flag given twice or with no value stops with the tool's usage line and draws nothing,
where a misspelt flag once drew the default.
`node tools/sheet.ts out.png --area thornmark` (or `--maps`, `--monsters` and `--interiors` with ids)
makes a pull request's contact sheet: each map from its arrivals and, outdoors, its sites, by day
and by night (a dungeon once, lit), with the automap revealed and its crop of the world map; each
monster as a strip ending in the hit flash; and each interior at noon and at night. The world is
pinned, so the same tree makes the same PNG; an unknown flag or id, a flag given twice or one with
no value is refused. `--changed <base>` draws what changed since the base (tools/kit/changed.ts),
which is how the checks attach a sheet to every pull request that changes a map, a monster or an
interior (a file anywhere in an area's folder of rooms, `ui/interiors/<area>/`, counts every room
of that area); with nothing changed it says so and writes none. `--ground all` (or
`--ground ash,ice`) draws the ground's samples (`tools/kit/grounds.ts`), each with its plan in its
grounds' colours, and a change that draws every map draws them too, so a new ground is seen before
a map holds it.
`node tools/lanes.ts <base> [--labels "lane: area, lane: quality"]` lists the lanes the files
changed since the base fall in (docs/ISSUES.md §2's table as code, in `tools/kit/lanes.ts`, the
kit's first file; `tools/lanes.ts` is its command line), each with its files, an area's by area.
With `--labels`, or in the checks' `lanes` job from the pull request's event, it lists the lane
labels beside them, a line for each lane a file falls in that the labels lack, each label no file
falls under and one where no lane label is on yet. In the checks it writes the run's summary and
never fails (#899, EXPANSION §8.1); a file no lane holds, as under the vendored `src/lib/`, it lists
outside every lane.
`node tools/harness.ts [--levels 2,6,10] [--roles soldier,brute] [--seeds 400] [--under 2] [--map thornmark --level 5] [--stats] [--calibrate --write] [--spell-cap 10] [--gear-grows] [--level-bonus] [--level-traits] [--rank-step 0.25] [--tiers] [--bot bless,sleep,drink] [--company newer] [--artifacts erzhemd,akkush|all]`
fights the premade company at a level against standard encounters of the test monster, or a map's
own groups, one after another until it must rest, and says how many it managed against the six or
seven an encounter at its level should allow (docs/MONSTERS.md §4.4). `--spell-cap` tries a world
where damage spells stop growing at that level, `--gear-grows` one where the company's gear keeps
growing past Thornmark's, `--level-bonus` one where every member gains a point of damage and of
armour every two levels past 10, and `--level-traits` one where fighters strike once more a turn
from 11 and again from 29, and sneak attacks grow. `--tiers` gives the company its Expert at 13
and Master at 25 (#852); `--bot` gives the bots, the gate's too, their bless, sleep and drink from
11 (#853, #865); `--company newer` fields the four newer classes' company in the premade's place
(#854); `--artifacts` has the company bear the bounds' artifacts named, or all, each by the first
member who may, and its bot cast an artifact's spell where it pays (#847). Each says what it makes,
and none is on by default: #865 weighed the first two and left them off (J2, EXPANSION §5.2).
`node tools/restate.ts <base ref> [--write]` restates the monsters past 10 onto a line made again
(#865), for the day the line is made again; it writes only with `--write`.
`node tools/gate.ts [--maps thornmark,grove2] [--levels 2,3,4,5] [--seeds 200]` prints how often the
premade company, trained to each level, dressed by the gear ladder and with the prestiges its level
brings, wins each map's groups alone
from full health; `--road thornmark:tm_wolves1,tm_brigands2` fights the groups named in a row with
no rest and counts the companies still standing. `tools/tests/gate.ts` holds the maps and areas to
it.
`node tools/scaffold.ts <zone> <x> <y> [--id <map id>] [--out <file> [--force]]` cuts the atlas's
32 by 32 squares from x,y into a zone map's first draft (EXPANSION §8.2): the ground, the woods, the
hills, the water and the road square for square, with no ring, and the zone's name and band; its
header notes the seams, where the road leaves and the sites inside, and it takes its area's region
where the area has one. It prints the draft, or writes it and never overwrites without `--force`,
and refuses an unknown zone, an id a built map has or no map id could be, and a cut outside the
world, over a laid zone map or holding ground no map character is. It registers nothing: the area
does.

## Code map

| File | Owns |
|---|---|
| `game/map.ts` | the terrains (hills, farmland, woods, dead wood, crystal, the chasm, salt, heather, tidal ground, ash, pine, ice, peaks, cliffs, steppe, dunes, vines and the volcano named as the atlas names them, and `DRAG`, the slow ones), `MapDef` (rows + legend + features + encounters, a sign's reading and marks, `secrets` with each secret door's hint, a town's or a dungeon's placed `banners`, its `landmarks`, an outdoor map's `density`, its `anchors`, the squares other maps' exits land on by name (`Exit.at`, through `anchored`; `landExits` fills each exit's square and facing from its anchor where the maps are joined, #993) and, on the outdoors, its gates, zones and `looks`; the wilderness features and a statue's `Gift`, the den; a person's hand-ins, `Words`, `Choice`, `Answer` and the crossings they sell, `Passage`), `GameMap` queries (passable, `exitAt` (an exit or a tear into a Rift), blocksView (a hill only from lower ground, given the eye's square) and `overtops`, the zone and palette at a cell, `bannerAt`); the void and its looks; `Presence`, when a thing is in the world (`when` as `Hours`, `until`, `after`), which a group and a person's words wear; an enclave (`enclave`, #845), a dungeon beside the road held to its own band |
| `game/outdoors.ts` | `layOutdoors`: the maps as played, the placed zone maps laid into one outdoors the size of the world, void where nothing is built and drawn as the atlas paints it (`LOOK`), their ways between them walked and gated, each exit by the square the maps' join filled from its anchor (#993) |
| `game/atlas.ts` | the world map's model: `Atlas`, the land drawn in strokes, `worldGrid` (a cell a square, the built outdoor maps stamped in 1:1, each cell's zone), the ways between areas (the exits, the crossings people sell and the planned links, a crossing link sold both ways drawn as built) and the road's steps |
| `game/world.ts` | `WorldState` (position, clock, weather seed, per-map state with cells seen in bits, zones set foot in, the kinds met; a group a map has gained since a save, and a saved door only where the map still has one), the zone the party is in and what it is called, movement across zones and gates (a Pathfinder's step at six minutes), a lock opened (`unlock`), reveal (a Cartographer's a square further), the weather's reach into play (sight, snow, the log, the almanac, fights), the region of a square, its zone's or its map's, or a throw naming both (`regionOf`, #945), roaming groups and when they walk, on any map (`walks`, `ended`, `hoursHold`), whether a person or an event is there (`present`), what is in sight (the viewport's rule: `VIEW_DEPTH`, `lineOfSight`, and what a hill hides from below it, `hillOver`, `hidden`) and the looks said on first meeting (`sightings`, `meet`, a den's too), a den's brood paced as they come back, encounter triggers (a group under the ice keeping to it and striking only a company on it), rest, search, an enclave's door crossing in (`enclaveLine`: its name and band, and how it feels, #845); the clock's one way on (`advance`, which runs `passClock`) |
| `game/calendar.ts` | the months and seasons, dates, dawn and dusk through the year, and the tide |
| `game/weather.ts` | the `Climate` shape (each area has its own, merged as `CLIMATES` in `content/index.ts`), `weatherAt` (the sky, the temperature, snow lying, wet ground), naming the sky and its log lines, and what it does to sight, steps and bows |
| `game/party.ts` | races, classes, `Character` (its secondary skills learnt among it), `Party`, conditions, equip, an item used in a fight or from the sheet (`useItem`: out of the holder's pack, else the bag; its healing, spell points, cure and food, in their words), what a member bears (`borne`) and a stat as they stand (`statOf`), levelling and the trainer's price, the prestiges (titles, pools, `takePrestige`, `spellRank`), what a tier does (`armsBonus`, `tierSteps`, beside `RANK_STEP`), the premade party and the company drawn from a seed alone (`randomParty`: six classes, a mender among them, rolled as the creation screen rolls, `rollStats`, and named from its `SUGGESTED`); a ward borne in `immuneTo` (`WARDABLE`) and what the clock's passing does to what is borne (`passClock`: regeneration by the hour, an artifact's castings back at dawn) |
| `game/people.ts` | `meet`: what a person says and asks, in order (a hand-in the company can make, their words that hold, a done hand-in's after-lines, the first meeting); a hand-in taking its item at the first meeting and paying, with the `early` words to a company never hired; `answer`, with an answer's price as the choice screen lists and bars it (`answerLabel`, `asked`, `barred`); `readText`; `handIns`, `personFlags` and `personGives`, what the checks and the save list read |
| `game/seeking.ts` | the seeking quests: the trainers placed (`trainersIn`), a quest for each member and prestige (`seekingQuests`), and the places the world map marks (`sought`); pure |
| `game/prestige.ts` | a prestige's trainer: who the company has of the class, each one's bar (the level, the prestige before, the third's quest, the gold), and teaching it; pure |
| `game/mastery.ts` | the weapon and magic tiers: who takes which line, the levels and prices (`TIER_PRICES`), each member's bar, the offers (a trainer's Expert, a Master's person's) and teaching a tier; what a tier does is `party.ts`'s (`armsBonus`, `tierSteps`); pure |
| `game/skills.ts` | the secondary skills (`SKILLS`, all twelve, Linguist the first): a member's list, who has one (learnt, or born to it by people or class) and who does its work for the company (`skilled`, a carried item too), the skills a guild's halls teach, the menu's two levels (a hall's skills, then a skill's six), each member's bar, and learning one; pure |
| `game/services.ts` | the town's services (#971): an inn's night (`nightCost`; `stay` pays, rests the company, sleeps the world to morning and counts the night) and its ten rations (`buyRations`), a temple's cure (`cure`, at `templePrice`) and the donation (`donate`), selling back (`sell`, handed the item table: an artifact refused), a spell hall's fee, offers and purchase (`payFee`, `hallOffers`, `learnSpell` at `spellPrice`) and a trainer's visit (`train`: one level a visit for `trainPrice`, never past the trainer, to those `mayTrain` takes). Each returns whether it was done, what it charged and the screen's line (`Served`); the screens and the walkthroughs call them, and `tools/tests/services.ts` holds them; pure |
| `game/inscriptions.ts` | Kiln-script: an inscription (a sign with `read`), who reads it (`readerOf`), what a sign says and what a reading keeps (`signSays`), its texts as the line check measures them (`signTexts`), the id it is kept by (`readId`, given on from `game/keys.ts`) and the places the world map pins once read (`readMarks`); pure |
| `game/stones.ts` | the Hearth's measure: the Stones restored (`stonesRestored`, `savedStones` for the title), where the Hearth burns, the atlas's `hearth` site or a throw (`hearthIn`, #945), its bearing from a world cell, its flicker and the almanac's word by the count; pure |
| `game/passage.ts` | crossings: a passage's fare (nothing once its `free` holds, half once its `half` does and half again for a Navigator), its next departure and its landing, the floor at the far end, the menu's line and the terms with their warning, and taking it (the fare, the clock, the landing, the company rested); pure |
| `game/guilds.ts`, `game/ranks.ts` | a guild quest (`GuildQuest`); a company's rank, worked out from its done flags and kept once reached (`rank_<guild>`; `rankOf`, ranks.ts's, which reads the content alone); what a hall offers (a quest may wait for a flag, `after`), taking a quest and the report that pays it (gold, items, xp split among the living), an item taken at the first meeting whatever the rank; pure |
| `game/items.ts`, `game/monsters.ts`, `game/spells.ts` | what an item, a monster and a spell are (`ItemDef`, with a letter's `text`, a raise borne, a blow's element, an artifact's mark and its spell, regeneration or ward; `MonsterDef`, `SpellDef`) and their lookups; a weapon's measure (`hits`) and what a shop pays (`sellPrice`: half, a Merchant two thirds) and says to an artifact (`REFUSED`), and the bounds of an artifact's power (the most it raises a stat, `ARTIFACT_RAISE`; the most castings a day of its spell, `ARTIFACT_CASTINGS`; the level that spell rolls at, `ARTIFACT_LEVEL`; regeneration's share, `REGEN_PART`) and the castings left until dawn (`chargesLeft`); a monster's kind and what each kind sets (`KINDS`: sleep, Holy Strike); the tables are content's |
| `game/save.ts`, `game/upgrades.ts` | the save and `SAVE_VERSION`; the upgrades, each registered by the version it brings a save to and run in turn on load, with what they need of the world as it was kept frozen; a save that will not load gives its reason (`load`, #945) |
| `game/keys.ts` | the keys a save keeps things by, each spelt once: a den's look (`lookKey`), the ids a feature is spent and an inscription read by (`spentId`, `readId`), a seeking quest's id (`seekId`), the flags of a spell hall paid (`guildFlag`), of the glove's line (`GLOVE_FLAG`) and of a guild quest taken and done and a rank kept (`takenFlag`, `doneFlag`, `rankFlag`); and a den's brood's `until` (`denBurnt`), which the maps import, and the respawn figures they name (`RESPAWN`, #968). It imports only types, so any module may load it first; each old home gives its keys on (#896) |
| `game/combat.ts` | `CombatState`, `startCombat`, `currentTurn`, `partyAct`, `monsterAct` (a spell cast from an artifact, `from`, for a charge), the looks of the kinds a call brings in (`meetCalled`), and the log's lines, the glove's once a game (`GLOVE_FLAG`, given on from `game/keys.ts`); pure and seeded |
| `game/bot.ts` | the bot that plays a fight, the gate's and the game's: `botTurn` (the action the resolver took; `gateTurn` the same with the action dropped), its two readings of the monsters (`asWritten`, every trait as written, the gate's; `asSeen`, only what the fight's log has shown, the auto-fight's), the answers a tool may turn (`ANSWER`, frozen: a tool passes another as `answer`, #946), the three it may play (`BotOpts`: bless, sleep and drink, off unless given; `PLAYED`, the game's, read from level 11 by `optsFor`, with its guards `striker` and `letsLie`) and the rest rule (`mustRest`); pure |
| `game/ink.ts` | what a cell is drawn as (`drawnCell`: a secret door outdoors among mountain, rock or trees as they are) and what the automap marks (`onAutomap`: a feature not an event and there now; `markedGroups`: the groups in view, on the cells `viewCells` gives, or near, and what Spirit Sense and Danger Sense mark), which the view, the automap and the pilot's fair view share; pure |
| `game/pilot/pilot.ts`, `game/pilot/known.ts`, `game/pilot/route.ts`, `game/pilot/explore.ts`, `game/pilot/keep.ts` | the pilot (docs/PILOT.md): `Pilot` (on and off, the tempo and its pace, the why line, the lines heard, the next key, the brains in their order, the goal and its plan), `Known`, the fair view of the world it reads through (the automap's bits and ink, its features and exits as fair copies, the groups it marks, the maps visited, the world map, a map's or a zone's bounds and a place's band, an enclave's band once its door is seen (#845), the corpus heard, the company and what a menu has shown), the navigator (`routeOn`, `routeLengths`, `routeNearest`, `routeMaps`, `route`: the keys to a square over what has been seen, and no way into an enclave whose floor is over the company) and the explorer (`frontier`, `suspects`, `explore`: the nearest unseen, the walls to search and the ways found shut tried again) and the quartermaster (`need`, `better`, `keep`: a rest, the temple, an inn, rations, gear worn through the sheet and training) |
| `game/quests.ts` | `QuestDef`, `Chapter` and `ChapteredQuest`; `questLog` (the quests known, their pages, entries and goal, worked out from the world state and party), `questNews` (what changed between two looks) and `finishedBy` (the quest or chapter whose end names a flag: what the world map letters a gate with) |
| `game/game.ts` | `Game` (screen stack, save/load, interactions, each saying what its rule returns: a chest's `give`, a well's `drinkWell`; the offer of rest, a den's choice to burn, attract mode: a new game the pilot plays, saved nowhere, until a key) and `ExploreScreen` |
| `game/wilds.ts` | the wilderness features: what a feature gives (`giftOf`) and the id it is spent by (`spentId`, given on from `game/keys.ts`), the shrine, the cairn, the statue's answer and when the party may rest; a well (`drinkWell`) and the six exploration spells (`castExplore`: its lines and whether the party moved); pure |
| `game/dens.ts` | dens: the look's key (`lookKey`, given on from `game/keys.ts`; the brood's `until`, `denBurnt`, is imported from there), the pace, the approach, the burning and its hoard, the look on first sight; pure |
| `game/rifts.ts` | the Rift generator: a 12 by 12 Rift from a template, a Stone's material, an area's table and a seed (turned one of eight ways, its groups in its slots, its looks on their squares and its warden a boss where the table says so, #968), its groups stopping and its tear going quiet once `until` holds; `riftWay`, the tear on a zone map that leads in, walked through as an exit is; pure |
| `ui/viewport.ts` | the depth-layered first-person compositor, the hills and the ground drawn past one seen from below it (`standsAt`), the farmland's fields and hedges and the trees about the woods, the dead wood and the pinewoods, the glass trees and the chasm's drop, the ash and the ice through the year, a group drawn under the ice, the peaks and cliffs, the steppe, the dunes, the vines' hung trees and the volcano and its vents, a landmark drawn tall over its building's square and seen out to `LANDMARK_REACH` (Crowness Light, its lamp lit by night once its flag is held; a monastery, its bell towers over a wall and no lamp), the tents of a felt palette ('tent': a low felt wall under a pitched felt roof to a crown, its door a flap), the wall dressing and its rates (`DRESSING_RATES`, held by `tools/tests/art.ts`), the sky, the end of the world drawn as its look (pink where it has none) and the weather drawn over it |
| `ui/frame.ts` | layout constants, status strip (time, date, the sky and its glyph), automap (whole, or a window round the party on the outdoors; a spent feature gone from it, a den standing or burnt; the features and the groups marked as `game/ink.ts` says, `onAutomap` and `markedGroups`), party cards, log, purse |
| `ui/riddle.ts` | a statue's riddle, the answer typed in the text mode |
| `ui/worldmap.ts` | the world map (M): the cloth painted from the atlas and the built maps, the zone overlay (Tab; a gate lettered with the title of the quest or chapter `finishedBy` gives, or its flag's own words) and the almanac (Space), and the pins of a place sought and of one a reading marked |
| `ui/screens.ts` | message (a person's box, `SAY_W` by `SAY_LINES` from `ui/frame.ts`), choice, character sheet (a letter read from it and a piece's words as it is taken up, the skills a member has, an artifact's power on its slot's line or a carried one's own, the column laid out by `sheetRows` above `SHEET_FOOT`, an item used by `useItem`), spell picker (an exploration spell by `castExplore`, its lines said and what stands where it moved the party met), inn/temple/shop/guild/trainer (each draws its menu and says what its rule in `game/services.ts` returns, with no sum of its own), a business's first menu (`businessEntries`), a guild's work at its hall and its skills there (`skillMenu`, two levels) or from a person (`learnerMenu`), and the visit that frames them (`InteriorScreen`) |
| `ui/interior.ts`, `ui/interiors/` | the businesses' interiors: the rooms' kit (`kit/`: the stage, the props and a trade's own in `trades/`), a scene to a file in `<area>/`, and the helpers a trade's scenes share |
| `ui/combat.ts` | the combat screen (menus over the resolver, the kinds a call brings met by `meetCalled` after each monster's turn), its monsters where `ui/row.ts` seats them; the spells an artifact borne casts beside a member's own, with the castings left; the auto-fight (`auto`: `game/bot.ts` plays the company's turns by what the fight has shown (the three from level 11, `PLAYED`) and leaves the finished fight, until a key takes it back) |
| `ui/row.ts` | the fight's row: each monster's place across the view and the height it is drawn, spaced by the drawings' spans, every one whole inside the view and none over more than a third of the next (`seatRow`, `OVERLAP`); pure |
| `ui/grouplabels.ts` | the labels over a fight: each group's kinds, each with its count of the living (a lone proper name none), laid out inside the view; pure |
| `ui/quests.ts` | the quest log screen, and `questSheets`, its pure page layout, a chapter to a page or more |
| `ui/scenery.ts`, `ui/sprites.ts`, `ui/monsters/*.ts` | scenery sprites, the trees dressed by the season; the monster drawings by family, each registering its kinds with their spans (`SPRITES`, merged by `ui/monsters/index.ts`), the dispatcher, and the monsters' kit (`ui/monsters/kit/`: the brush, the helpers, the humanoid frame and the chisel's mark) on the paint kit (`ui/paint/`: the brush and its hash, the gloss, the ink, the forms and the flame) |
| `ui/create.ts` | party creation, the stats rolled and the names offered as `game/party.ts` says (`rollStats`, `SUGGESTED`) |
| `ui/title.ts` | the title screen: new game or continue, why a save will not load in the note's two lines (#945), the Hearth over the saved company and attract mode's idle (untouched for 45 seconds, the pilot plays a new game) |
| `content/index.ts` | the areas in road order; the tables merged from them (maps, monsters, items, quests and guild quests, climates, rooms; the monsters and items read-only by type, #945), the one quest joined from their chapters and `ATLAS`, their parts of the world map over the plan; `SPELLS` from `spells.ts`; and the `MonsterSprite`, `Interior` and `RegionId` unions made from the areas |
| `content/guilds.ts` | the four guilds (`GUILDS`: names, a short name where a hall's menu row would cut the whole, and ranks), a guild quest's flags (given on from `game/keys.ts`) and its side of the quest log |
| `content/area.ts` | `Area`, the shape every area fills in, and `Novelty`, what it claims is new (held by `tools/tests/pillars.ts`); `Walkthrough`, an area's end-to-end test |
| `content/areas/<area>/` | an area: its maps, monsters, items, chapter of the one quest (`chapter.ts`), side quests (`quests.ts`), climate, what it claims is new (`novel`) and part of the world map, and the sprite kinds and rooms it brings (`index.ts`); and the one file another area takes, `public.ts`: the flags and exits the others take, and every item by name (#992). Each has a doc in [docs/areas/](areas/) |
| `content/items.ts`, `content/spells.ts` | the items no area owns (the class kits, the starting bag, the iron key), the helpers the areas' tables are written with and an artifact's price (`ARTIFACT_PRICE`), and the spells |
| `content/progression.ts` | the curve: each area's band, next floor and price window, the xp and gold a clear should give, and what is owed; checked by `tools/tests/curve.ts` |
| `content/rifts/` | the eight Rift templates and the four materials (ember, brine, black glass and slag, MONSTERS §2.1), `rift` for an area to place one by ids, and `RIFT_SAMPLES`, each template dressed once for the tests and the contact sheet (`--rifts`) |
| `content/stones.ts` | the Wardstones a company may restore, each with its area and the condition it is restored on (or the issue that owes it); held to the atlas by `tools/tests/stones.ts`, read by `game/stones.ts` |
| `content/crossings.ts` | the crossings between towns, or from a town to a camp or a shore in a zone, each with its fare, days and hours and its two ends, each end's landing once its place is built (in a zone, on the box that holds it; or the issue that owes it), and `sells`, the passages a place's person sells on them; held to the atlas and the towns by `tools/tests/passage.ts` |
| `content/locks.ts` | the story locks (each flag that closes something, where and why) and how many an area and the road may spend; held to by `tools/tests/pillars.ts`, read by nothing in the game. Holds one: Act III's, the Sleepers' Bay's door under Loch Fuar's ice, shut on `q_wenna_up` (#440, docs/areas/rimewater.md §5); the road's first, the pass's flag, went with #40 |
| `content/maps.ts` | the maps as played: `PLAYED_DEFS`, the outdoors laid out, and `buildMaps` |
| `content/shipped.json` | what a save may refer to that no area owns, and the version: the outdoors' size, the core items, the flags the code and the guilds' ranks set, the spells, classes, races, conditions, skills and tiers. Each area's `areas/<area>/shipped.json` holds what it owns: its played maps' sizes, chests, once-events, the other features spent once, inscriptions read, groups and door squares, its zones' places and the outdoors' ids, groups and door squares in its boxes, its flags, items and monsters. Written by `tools/shipped.ts`, joined into one record and held to by `tools/tests/shipped.ts` |
| `content/atlas.ts` | the world map's plan: the land, the areas of the road, and the zones, places and sites not built yet; each area charts its own in `areas/<area>/atlas.ts`, and `content/index.ts` merges them into `ATLAS` |

Decided by the builder for #896, each the owner's to overturn:

1. **The three reads are functions of nothing under their old names,** read on use, `TRAINERS` and
   `HEARTH` keeping what they read: no import line moves, but each reader gains `()`: `questLog`'s
   default, `hearthBearing`, the seeking, prestige and stones suites and one line of Glasswold's
   walkthrough. A lazy array would have spared the readers, at the cost of a proxy.
2. **The Shelf's three maps call `denBurnt` too.** They spelt the den's `until` by hand
   (`{ seen: 'downs_d2:d2_den' }`) where the other six imported it (six, as the review counted); now
   all of them import it from `keys.ts`, as the issue has it (ten maps with Saltreach's A4, built after
   the issue was filed), and the condition is the same.
3. **Each old home gives its keys on** (`export { … } from './keys.ts'`), so no import moves but the
   ten maps' and `game/guilds.ts`'s (`dens.ts` gives on `lookKey` only: a map's stale route for
   `denBurnt` fails the typecheck, not a load-order check three maps away); `quests.ts` and
   `stones.ts` read no key and import nothing from `keys.ts`, and `ranks.ts` still takes its two
   flags from `content/guilds.ts`.
4. **`readId` spells an inscription itself** (a sign with a reading) and does not call
   `inscriptions.ts`'s `isInscription`: `keys.ts` loads nothing.
5. **The alike-check becomes a check of `hasSkill`** (`tools/tests/skills.ts:199` on 1aefb823, the
   issue's :117): Mountaineer and Swimmer are had only by learning, by every people, and `partyCan`
   climbs and swims by them only while the learner stands.
6. **The fifteen loads start at once,** each in its own process, as the structure suite begins, and are
   read at its end; the areas' indexes are found from `AREAS`.

Decided by the builder for #945, each the owner's to overturn:

1. **`walks` and `present` take the map by its id as written** (`on?: string`), read through
   `locate`: the walkthroughs know the zone map's id, and a zone map is not in `World.maps`; an id
   the World has not got throws.
2. **`regionOf` is a function of a played map and a square,** exported from `world.ts`. The
   constructor asks it of the first map's start square, so a laid outdoors first takes the zone its
   start lies in; the game's first map is Helmstow's, so no game draws another seed.
3. **`load` returns the save, `null` or the reason;** `Game.loadGame` returns `true` or the line the
   title and the load key show, so neither caller words it. A save that reads but that the build
   cannot lay out (a map gone, a square under no region) gives the World's reason, and the game is
   left as it was.
4. **Text that is not a save gives the build's own reason,** "the text in storage is not a save",
   whether it will not parse or parses to no object with a numbered version: not the engine's,
   whose words name marks the font has not got (`{`, `}`) and differ by browser.
5. **The note is cut by `paragraph`'s `maxLines`** to its two lines across 380 of its 400; the saves
   suite holds the notes of the reasons to two lines at that width.
6. **`HEARTH` reads through `hearthIn(sites)`,** exported so the stones suite can hand it the
   atlas's sites without the Hearth and read the throw without touching `ATLAS`.
7. **A fixture names the region in the helper that makes it** where there is one (`row`, `town`,
   `box`: every map they make names it, 47 asked the sky); `people.ts` has two `fx_town` literals
   and both name it.
8. **`crossings` reports an exit whose end names no region** rather than comparing two absences as
   equal; the sheet refuses a map with no region as it refuses one with no way in.
9. **The smoke's torch search keeps to squares the Foreland's zones hold:** the sky it fixes is the
   Foreland's and its message says "no square of the Foreland"; it painted squares no zone holds
   under the lent sky. The ground and Rift samples name the Foreland, the sky they had.

Decided by the builder for #971, each the owner's to overturn:

1. **Each service returns `{ done, paid, line }`** (`Served`), as `learn` returns its line: `done`
   because the hall's fee screen goes on to the offers only once paid, `paid` because the
   walkthroughs print what was charged; `line` is empty where the screen says nothing.
2. **`train` charges a purse** (`Pick<Party, 'gold'>`) and takes the trainer's level. A walkthrough
   that trained a copy and charged nobody (Ashfall's, the Kilns' two, Rimewater's) hands it a copy
   of the purse, so the company walks on as it was; Sunderwood's charged the company and still does.
3. **`train` refuses, saying nothing, one the trainer does not take** (`mayTrain`: ready by the xp,
   under the trainer's level and standing): the screen bars the row by the same rule.
4. **The donation short of gold says nothing,** as the chapel did; every other refusal says the
   screen's own line.
5. **`sell` takes the item table first,** as #973 passes every table; `sellPrice` still finds a
   Merchant through `skilled`, and the hall reads `spellsFor` and `spell`, as the screen did: #973's
   and #974's to pass in.
6. **`stay` returns the flag of the night it counts** (`set`), which Rimewater's four nights check;
   `stayNight` stays in `party.ts`, where a camp's nights call it too.
7. **The walkthroughs take the night's price from `nightCost` and the spell from `hallOffers`** (the
   caster's offer of it) before `learnSpell`, and every `ok` line reads as it did. The pilot's
   `INN_RATIONS` keeps its name and is the rule's `RATIONS_PRICE`.

Decided by the builder for #978, each the owner's to overturn:

1. **`useItem` sits in `party.ts`, beside `heal` and `lift`,** which it calls: no new import and no
   cycle. It returns its lines, or null where the item has no use or nobody holds it.
2. **The holder is a member or none.** The fight passes the one acting (the pack, then the bag, as
   before); the sheet passes the member for a line of the pack and none for a line of the bag, so a
   bag's line comes out of the bag though the member's pack holds one too, as it did.
3. **The fight lends `useItem` a table of the one item it reads** (`{ [d.id]: d }`, through `item`):
   it carries no table until #973, and `ITEMS` imported into `combat.ts` would cross a layer. #973
   passes `s.tables.items` there; the sheet and the suites pass `ITEMS`.
4. **Rations used in a fight now feed the company** (5 to the stores, said); on main they were spent
   for nothing. No fight names them: the menu leaves food out, the bot draws on heal and cure.
5. **The well and the explore spells are `drinkWell` and `castExplore` in `wilds.ts`,** which now
   takes `spells.ts` and `combat.ts` (`castOnParty`) at run time, with no cycle. `castExplore` reads
   `spell(id)` as `Game` did: #974's to pass in.
6. **`Game.castExplore` goes.** The spell screen calls the rule, says its lines and calls
   `enterCell` where the party moved, as the method did after a portal or a return to the mark.
7. **`meetCalled` sits in `combat.ts` beside `call`,** taking `Pick<World, 'meet'>` by a type
   import, which the layers check leaves out.
8. **The new suite parts go to suites that need not print the same:** `useItem` to `party`, the
   well and the spells to `wilds` (on a headless game, whose world has the towns a portal needs),
   the chest and the call to `game`. The combat suite's draught on the walk calls `useItem` under
   the same `ok` line.

Decided by the builder for #979, each the owner's to overturn:

1. **`randomParty`, `rollStats`, `SUGGESTED` and `MENDERS` sit in `party.ts` after `defaultParty`,**
   the two companies side by side. The first three are exported and `MENDERS` is not; `party.ts`
   now takes `makeRng` from `src/lib` at run time, as `create.ts` does.
2. **`randomParty` reads the peoples and the classes through two lists of its own** (`RACE_IDS`,
   `CLASS_IDS`, in their tables' order, so the draws are the same): the issue brings back only
   `rollStats` and `SUGGESTED`, so the creation screen keeps its two for its menus.
3. **`finishedBy(quests, flag)` takes the quests with no default** (`questLog` falls back to
   `QUESTS`): its one caller passes them, and #975's slice needs no reach into content. It gives the
   quest or chapter or undefined; `gateName` keeps the lettering and its fallback.
4. **The checks of `randomParty` are two lines of the `party` suite,** pinning seed 77's company
   (names, peoples, classes, hit points and stats) as `create.ts` drew it, so a change to the draws
   fails by name, and six seeds' classes for the mender rule: two drawn again for want of a mender
   and one for each mender alone. The pilot suite's three stand as they were. `finishedBy`'s is a
   line of `quests` on its own fixtures: a side quest, a chapter, a flag that only starts a quest,
   one nothing finishes and two quests ending on one flag, of which it gives the first.
5. **The code map's `game/party.ts` and `game/quests.ts` rows name `randomParty` and `finishedBy`**
   beside the four rows the issue names, so the map still says where each lives.
6. **The smoke's seeded screenshot is shown the same outside the fog, not as the same PNG,**
   which the issue's Done when asks for: no two runs give the same PNG on any tree, the fog banks
   drifting by the frame count (`drawMurk`, `src/ui/viewport.ts:794`). A shot held byte for byte
   would need the frame pinned in the smoke, a change the issue does not name.
