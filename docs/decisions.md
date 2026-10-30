# Decisions

The "Decided by" lists of the rules in EXPANSION.md, each the owner's to overturn, moved whole and
in order by #1024 from the sections they settle, each under its section's number. A builder adds
the next as a list under the issue's number, under the doc and the section of the rule it settles
(EXPANSION §8.2); an area's decisions are beside its doc, in `docs/areas/<area>/decisions.md`.

## EXPANSION §5.1 Structure

Decided by the builder for #898, each the owner's to overturn:

1. **Passable ground is a walker's:** open to a company with no skill. Water is the water and the deep,
   never the void, which stays the void for every rule; road is the road's terrain. Each seam is read
   on the laid outdoors, its corners with it.
2. **A way between two areas** is a square a walker, a climber, a swimmer, a floater or a company that
   does all three crosses, and the atlas joins two areas where a road does, by a map's exits or its
   links (`zoneEdges`), as a whole and not seam by seam: 285 squares on seams between two areas that
   no road crosses are walked open by design, so a wall opened on both sides of a seam between joined
   areas, or of one inside an area, passes. The door marked `crosses` is a dungeon's door and no
   seam. One crossing the atlas does not draw is held as built: the shallows where the Deepthorn's
   I5 meets Hearth Isle's I6, which on I5's side are a pocket of seven squares shut by rock and deep
   water, so no company reaches the isle by them. The way is read on the two squares either side of
   a seam, so it never misses a crossing, and holds one into a closed pocket too.
3. **A row is exact:** it lists, kind by kind, the squares that fail, so a square that comes to agree is
   refused with it. On 18 October: 153 seams, 62 rows, 329 squares.
4. **The edges against unbuilt land are held exactly,** as the seams are: a row of `openOnNothing`
   for each edge with a square open to a walker, so a square opened or shut on such an edge fails; its
   reason names the box it faces and the issue that builds it, or the reach, a crumb or the sea. On 18
   October: 102 edges, 3,264 squares, 899 open in 50 rows, five of them onto the sea or the world's end,
   where #828 plans no box. The void past them refuses every company, and their water and roads are the
   pillars' edge check's.
5. **The count of seams may not fall below 153,** those built on 18 October, as a box once built never
   goes.

## EXPANSION §5.2 The curve, and the gate

Decided by the builder for #845, each the owner's to overturn:

1. **The declaration is a mark on the map, `enclave: true`, and its band is the map's own `band`**:
   the sign already shows a map's band, so one band serves the sign, the door and the checks.
2. **An enclave stands over its box**, the outdoor map its door opens onto: its floor over the box's
   top. One with no band, at its box's band, listed `outside` as well, laid as a zone map or opening
   onto no box fails the curve (`enclaveFaults`); leaving the area's figures is only fair for a place
   past its box.
3. **Its window is the last road area's whose floor is at or under its own**, as a map outside the
   budget has it: the Hearth's 7,000 for a lair at the cap. No window holds an artifact, so #847
   must exempt one from the curve's window by its mark.
4. **Two under is asked of it alone, by the day from 10**, as of a map outside the budget, and its
   guardian is a boss, its group marked `boss: true` in its map, as a dungeon's boss is; the
   fixture's figures off their aim are said with it and kept out of the gate's list, which is the
   content's.
5. **The door's line is the game's**, one entry after the way's own: "<name>: levels 30-32.", then
   harder one or two under its floor and the warning three or more under, in an enclave's words, not a
   zone's. None from a level of an enclave whose floor is at or over its own, for a border speaks
   where the floor rises. Held to the log's three lines at its longest (pillars). An area's own words
   can come when one asks for them.
6. **The pilot learns an enclave's band at its door**, once a way in is seen (`Known.enclave`), and
   keeps out under its floor with no grace, where a zone allows a level: the navigator has no way in,
   the strategist chooses no walk there and a goal inside sends it levelling to the floor. Only the
   way in is shut: the way up from a deeper level stays open, so a pilot handed the helm inside is
   never stranded.
7. **The secret's pace and the novelty check are left as they are**: each places a map by its floor
   (`roadPlace`), so a lair at the cap stands with the Hearth in both.
8. **The fixture is the Stair's ground and groups at 30–32 off C3**, a chest with the Grey Axe in it
   (6,800, over Saltreach's 2,000): its figures are the gate's already, so it needs no new monster.

Decided by the builder for #847, each the owner's to overturn:

An artifact is an item marked so (`ItemDef.artifact`, DESIGN §9): one in the world, found in its lair
and never sold. No shop stocks one or takes one, and no rung of the ladder or price window holds
one, by the mark alone and never by its price: the curve's window, which held every find, holds
every find but an artifact (`windowed`, `tools/tests/curve.ts`), and new checks hold that each is
in no shop, on no rung and in no window, and that unmarked the window would catch it.

1. **A mark, `artifact: true`, beside the power's own field:** the stat and the element are read as
   on any item, so an artifact's power is a found item's by the same code, and its twin unmarked does
   the same.
2. **Its price is `ARTIFACT_PRICE`, 7,500, past every window** (the Hearth's 7,000 the widest): nobody
   pays it, and a window that dropped the mark would catch it, so the mark is what exempts.
3. **The shop's words** are "Keep it. There is no price on a thing like that." (`REFUSED`); the sell
   list shows an artifact without a price, and the company keeps it.
4. **The sheet says each artifact's power,** one with a slot on its slot's line ("ARMOUR The
   Erzhemd, SPEED +5"), one carried on a line of its own ("ARTIFACT The Hagstone, NEVER PARALYSED"),
   and hit points and armour share a line, so the fullest member of every class (the stone carried,
   a resistance, twelve skills and every spell) ends above the panel's foot (`SHEET_FOOT`). A line to
   every artifact, as the first half had it, ran the column off the panel.
5. **`--artifacts`** takes ids or `all` and gives each, one in the world, to the first member in the
   company's order who may bear it: a weapon of the reach they hold, or of the other where none who
   may bear it holds that reach (Holdfast to the premade's thief, for her sling: she strikes nothing
   from the back row with it, and casts its charges, decision 10); a two-hander puts a plain shield
   in the pack, never an artifact's. So `all` dresses the premade six with the eight. The gate's
   company stays plain (#891).
6. **The eight not placed are owed** in `UNPLACED` (`tools/tests/items.ts`) to #830 to #837, each
   until it lies anywhere; placed, it must lie once in the world, in a chest, cairn or statue on an
   enclave of its own area at the cap. The table only shrinks.
7. **The castings spent are the company's, by the artifact** (`Party.spent`, an optional field, so
   no save version moves): passed to another member, an artifact keeps what it has spent. They come
   back at the dawn the calendar gives that day (`dawnOf`), the one a night's sleep wakes to.
8. **An artifact's spell is cast in a fight only:** both of the eight's are fight spells, so the
   spell screen offers none and the check holds an artifact's spell to a fight's; the way to cast one
   out of a fight comes with the first that needs it. The fight's menu lists it after the member's
   own spells, with the castings left ("Meteor Swarm (2 LEFT)").
9. **Regeneration and a ward keep nothing in a save:** every passage of time goes through the
   world's clock (`World.advance`), which mends the bearer (`passClock`), and a ward is read from what
   is borne, as a trait's immunity is (`immuneTo`).
10. **The harness's bot casts an artifact's spell** where it pays, weighed as its own spells are and
    at no cost in points, an artifact's hold whatever `--bot` asks and at a group of one too, so a
    lair's guardian is tuned with the artifact's power and not its steel alone. In 20 seeded fights at
    30 the company with Holdfast, or with all eight, wins as many as the plain one and loses fewer hit
    points (`tools/tests/harness.ts`). The game's auto-fight leaves an artifact's spell to the player.
11. **A piece's words are read as it is taken up:** Space on a weapon or armour with words equips it
    and shows them, so DESIGN §9's "read from the pack" holds for every slotted piece, the Old
    Lantern's Staff among them.

Decided by the owner's delegate for #18, each the owner's to overturn:

1. **The bot's three behind `BotOpts { bless, sleep, drink }`** (#853), an option of `botTurn` and of
   `thrifty` as the reading (`sees`) is, off in every default: nothing in play or in a check moves
   before #865. `ANSWER` stays, frozen since #946: a tool passes another answer to the call.
2. **The turn is mend, wake, burn, bless, sleep, blast, drink, strike, brace.**
3. **Bless** in the first round, by a member that knows it and keeps its share of the rest line after
   it, while three foes or more stand; not again while one runs.
4. **Sleep:** a sorcerer's Slumber or a druid's Grasping Roots, at the group with the most foes
   standing, awake and not proof against it, where that is two or more.
5. **Drink:** a healing draught from the member's pack or the bag for the lowest under its mend line
   that no mender can mend; a cure draught for the one the bots free first that no one can free. The
   company's bag stays as it is: a player's potions are not what every company has.
6. **The gate's bot never flees:** a flight only turns a win into a loss, and the gate measures
   whether a fight is winnable. The game's flees a fight lost (#723).

Decided by the builder for #853, each the owner's to overturn:

1. **"No mender can" is read as no member who can act** (not down, asleep or held) knowing a mend it
   can afford, and so for a cure: a cleric asleep mends no one this turn.
2. **The weighing kept simple:** a foe Slumber takes sleeps four rounds, since the bots let it lie and
   it wakes at a quarter of its turns (`SLEEPS_FOR`); one the roots take is held about three (it tears
   free at 35% of round ends, `HOLD_BREAKS`). Bless and sleep are weighed before the damage spells, so
   a tie goes to them.
3. **The game's reading knows a foe Slumber cannot take once a Slumber has put none of its kind to
   sleep** (the log's "0 of the ... fall asleep", which now counts the kind it names, the target's, so
   that a mixed group shows it). The roots' failure names no kind, so it never knows one the roots
   cannot hold; none is so as built. The gate's reads both as written.
4. **Awake is held by nothing:** a foe asleep or rooted is not counted, so none is slept twice.
5. **The draught given is the least that lifts the lowest to its line, else the most,** the
   member's own before the bag's.
6. **Sleep stays with the classes named:** a ranger that knows Grasping Roots (the premade Wren from
   17) keeps to its bow and its few points.
7. **With sleep on, the sleepers are let lie:** a blade falls on an awake foe it reaches where there
   is one, a spell on an awake foe where one stands and no spell over many is cast where it would wake
   a sleeper. Without it a swarm woke three ogres asleep and Slumber was cast again, and the thrifty
   bot's day at 4 fell a tenth; with it, its day against the standard soldier and skirmisher rises at
   4, 12 and 20 (6.25 to 6.55, 6.72 to 7.05, 8.68 to 10.95 for the soldier, 40 seeds).
8. **Bless goes to the knower whose turn is worth least:** one that can strike from its row leaves it
   to one yet to act this round that cannot, so Idris strikes and Maren blesses.

Decided by the owner's delegate for #18, each the owner's to overturn:

1. **The company's tiers behind `Rules.tiers`** (`--tiers`): `companyAt` dresses them after
   `prestige(p)`, Expert from 13 and Master from 25 by class line; the cache key counts them.
2. **The bots' option plumbed:** `--bot bless,sleep,drink` sets `Rules.bot`, handed to `botTurn`
   and `thrifty`. Both off until #865, which kept them off (J2).
3. **A second company, `newerCompany(level, seed)`,** held by the harness suite at 12, 20, 28 and
   32: fights to a rest inside −2.5/+3.5 of `fightsPerRest`, fights at the floor won 80% or more,
   100 seeds; `--company newer` plays it by hand.
4. **The gate keeps one judged company,** the premade six. A class that fails the line is reported
   to the owner, not fixed here.
5. **With every option off `companyAt` returns what it returns on main.**

Decided by the builder for #854, each the owner's to overturn:

1. **The monk takes a staff for its prestige blows, as the thief a light blade** (`BLOWS_WANT` in
   `prestige`): its blows past one come only with a staff or bare hands (`blowsOf`), and the
   ladder's best blade by its blow is not a staff. Without it the newer company fought 5.4 soldiers
   and 5.5 armoured to a rest at 20 of 9, four days in five ended by a fight broken off, and the
   monk in the ranger's place cost the premade six as much. The six hold no monk, so their company
   is as it was.
2. **The four stand in for four of the premade**, each with that member's raises on its own
   class's stats and of a people that suits it: Rook a dwarf barbarian for Bram, Hollis a tidefolk
   monk for Wren, Aveline a gnome bard for Ottilie, Sable a human druid for Maren. Idris and Cassian
   are the premade's own; the names are the creation screen's.
3. **The boss is left out of the newer company's line:** a boss is judged by its odds from two
   under, not by a day or the floor's fights.
4. **`--company` is a what-if too** (`Rules.company`), so `--calibrate --write` refuses under it as
   under the rest; the refusal names what is set (`whatIfs`).
5. **The gate's bot takes `Rules.bot` in tools/gate.ts's own `gateTurn`,** which every gate fight
   plays, so #865's default in the harness reaches the gate (off, J2).
6. **The line runs on every core** (`cellsOnCores`, the report's own pool): its 36 cells cost
   about 37 seconds of CPU, about ten of a four-core runner's.
7. **The what-ifs show what they make:** under `--tiers` or `--company` the report gives the
   company at each level it fights from, with its titles and tiers; under `--bot`, the share of
   fights from fresh in which the bots blessed, slept a group and drank.

Decided by the owner's delegate for #18, each the owner's to overturn:

1. **The gate's company models neither the tiers nor the bots' three** (J2, #865; the first call of
   17 October withdrawn). The road needs no tier or skill, so the gate's company takes what a level
   brings on the road and buys nothing optional: the tiers, the Masters, the three, the skills, the
   charms and the items are alike unmeasured and stronger than measured. The limits (#273) and the
   softening cap (#541, decision 3) are the owner's and are not moved.
2. **No calibration is written:** `tools/testmonster.ts` and the 91 monsters past 10 stay as they
   were; the weighing and the calibration's measurement stand as evidence in #865's pull request.
3. **The defaults stay off:** `Rules.tiers` and `Rules.bot` are off in the gate and the harness;
   `--tiers`, `--bot`, `--company newer` and `--under 2` stay what-ifs, and `--calibrate --write`
   refuses under any.
4. **The game's auto-fight bot blesses, sleeps and drinks from level 11 with its guards** and flees as
   #723 built it; the gate's never does any of the four; Act I's figures are main's.
5. **`cairnfield_m8` is re-sized inside its floor's own aims,** a role up and a group thinner, never
   more monsters; two passes, else owed by name to an issue under #54.
6. **`--company newer` stays a check at 12, 20, 28 and 32** on the old company's dressing; a class
   past the limit is reported to the owner, not fixed.

Decided by the owner's delegate for #891, each the owner's to overturn:

1. **J2 stands: the gate's company models neither the tiers nor the bots' three,** and no Master,
   skill, charm or found item. The road needs no tier or skill, and a line made on a stronger
   company raises the monsters' blows where nothing bought raises defence (J2, above): optional
   power is the player's edge, not the road's floor. No lever moves (not the softening cap, `WORST`,
   the limits, a defence-side rule or a second judged company); the 91 monsters past 10, 22 of them
   set off the line (each by its `offLine`, in its area's `monsters.ts`), stand, and the eight
   bounds areas (#830 to #837) meet the gate as it is.
2. **What the optional power buys is written here** (#865, two under, 100 seeds). With Expert,
   Master and the three the company fights 4.6 to 8.4 of a role's standard encounter to a rest at 20
   where it fought 3.0 to 6.7 (9.0 asked at the floor), 9.9 to 13.6 at 25 where 5.9 to 8.8 (10.3
   asked) and 4.0 to 10.0 at 28 where 2.3 to 7.0 (11.0 asked), and wins the boss 58% at 20 where 42%,
   60% at 25 where 55% and 75% at 28 where 53%; its fights run longer, the sleepers let lie (at 20
   from 3.4 to 10.7 rounds to 3.8 to 13.5). `node tools/harness.ts --under 2 --levels 13,20,25,28
   --seeds 100 --tiers --bot bless,sleep,drink` prints it, in under a minute.
3. **The harness's what-ifs are the standing evidence:** `--tiers`, `--bot bless,sleep,drink`,
   `--company newer`, `--under 2` and `--calibrate` under any (it says what share of days end badly
   and writes nothing), with the tables in MONSTERS §4.4 and the raw outputs on #883. No new check:
   one over optional power would be a figure on a company the gate does not judge.
4. **The barbarian for the knight and the bard for the thief at 20 are left,** reported and not
   fixed (6 above). Against the soldier and the armoured (100 seeds; 9.0 asked, the limit 6.5 to
   12.5) the premade six fight 8.7 and 9.1 to a rest, 6.3 and 6.4 with the barbarian and 12.3 and
   13.3 with the bard; the newer six on the staff 8.8 and 9.4, inside every limit at 12, 20, 28 and
   32. Each is the class as designed (the barbarian wears no plate, the bard's song lifts the
   company), in a mixed company the gate does not judge; a class tune for a harness figure would
   move play for everyone who fields it.

Decided by the builder for #865, each the owner's to overturn:

1. **"Another can strike" is a blow from its row at a foe in its reach,** asleep or awake (`striker`):
   a blow wakes only the foe it strikes. Without it a caster alone slept its foes and stood idle.
2. **The guard is in both bots,** the game's and the thrifty one, by one helper.
3. **The three begin at level 11, the first past Act I** (`FIRST_PAST_ACT_I`, `optsFor`): a member
   under it plays as the bots did, so Act I plays as it was made; `--bot` is read so too, as weighed.
4. **No sleep on a group that holds a foe the sleep cannot take** (as the bot knows it): its sleepers
   would bar every spell at the group while the one awake was struck alone. With the three on at
   every level, Deepthorn's j5_eldest, an elder among two heartwoods, was won 3% at 8 in the gate;
   the level-11 threshold now puts it out of the rule's reach.
5. **The bots' tests stand at a company of 12,** past the threshold; at 4 and 10 the three are main's.
6. **`cairnfield_m8`'s crag group is two ravens and two tor trolls** where eight ravens stood: one troll
   left two under past its limit (102.7 to 113.5%), two put it inside its aim; the ravens first, since
   with the trolls first the floor's day fell to 7.48, under its aim. The night troll stands. A
   quarter of the floor's days (23.3%) now end in a fight broken off, the two trolls mending.
7. **The whole company lets the sleepers lie once one member is past Act I** (`letsLie`): a member's
   spell over many wakes another's sleepers (with the six at 8 and Cassian at 12, Wren's Hailstorm
   woke the ogres he had slept). Who blesses, sleeps and drinks stays each member's own, and a
   company with no member at 11 plays as on main.

Decided by the owner's delegate for #892, each the owner's to overturn:

1. **The bots' three begin at 11, and a company with a member at 11 or over lets its sleepers lie
   as a whole: stands** (the builder's 3 and 7). Act I plays as the owner's own play tuned it: with
   the three at every level four of its figures went past their limits, and its monsters are not
   re-sized for a bot.
2. **`cairnfield_m8`'s crag group, two ravens and two tor trolls, stands** (the builder's 6): of the
   fourteen mixes and orders #865 tried it is the only one inside both aims, 7.60 to a rest at the
   floor (7.5 to 9.5 asked) and 64.9% two under (66.7% the aim). The 23.3% of the floor's days ended
   by a fight broken off at fifteen rounds is the harness's figure, printed and not judged (#734):
   the game has no round cap, the company wins every fight there and the trolls mend. Eight ravens
   again would be 109.3% two under, past its limit, with a row owed and no better mix to size to.

Decided by the builder for #946, each the owner's to overturn:

1. **The bots' answer rides in the rules** (`Rules.answer`) through the harness's calls and the
   gate's, so each chain carries one value; the bot's own calls (`botTurn`, `markOf`, `breathGuard`,
   `mendLines`, `wakeWith`, `gateBlast`, `drinkFor`) take the answer itself, as they take `sees`.
2. **Each exported call takes `rules` last, defaulting to `RULES`;** the harness's own helpers
   (`weaponDamage`, `incoming`, `mendRate`, `spellDamage`, `heldDamage`, `train`, `keyOf`) take it
   with no default, so the typecheck finds one a caller forgets.
3. **One helper lent a def to either table, over one already there,** and put back what it
   covered, so the rat's and the wolf's looks went through it too; `gear` lends its four items with
   a plus up front, each only where absent, as it added them on the way. Main gained two writers
   since the issue (`curve`'s unmarked artifacts, `items`' stone twin): 17 went through it. Since
   #973 an item, and since #974 a monster, is lent by a table of the suite's own (`tablesWith`,
   `tools/kit/headless.ts`), handed to what plays it, and the helper is gone.
4. **`unforge` drops the companies dressed in forged gear from the cache** as well, so a later
   `gearGrows` never meets an id the table no longer holds.
5. **The runner's check fails the suite by name, listing each entry added, removed or replaced** (by
   identity); its fixture is a folder of its own (`tools/tests/runner/leaves/`), so the other
   fixtures' counts stand; the clean suite after it is `next`, since a module exporting `then`
   is awaited as a promise and never settles.
6. **The goals walked are kept by the walkthrough's `ok`,** in a `WeakMap` whose entries go with it;
   the runner hands each walkthrough a fresh wrapper of the shared `ok`.

Decided by the owner's delegate for #18, each the owner's to overturn:

1. **Past 10, "well under, back" is the day, not the fight** (read as from 10: the builder's 1).
   The aim was written for Act I's slope; past it the gate lives in attrition, and no tier, item or
   counter could bring a fight two under to nine in ten without the cliff DESIGN.md §1 forbids. The
   limits of #273 are not moved: a figure is named anew, with its reason.
2. **Judged per map and per area, on 100 seeds, dealt.** A share wants fewer seeds than the floor's
   day, judged to a tenth of a fight on 300. A boss is left out of the day, as at the floor.
3. **Act I keeps its figure:** two under, a quarter, limit nine in ten. There two levels are a cliff
   by design, and the figure measures it.
4. **The two-under win rate is not judged past Act I.** The warning keeps reading its rates two under.
5. **The 86 owed rows went,** each because the check it held no longer runs. None is re-recorded.
6. **More than five maps past the limit would make the share wrong for the game as built:** the
   builder stops and reports to the owner, and the share is not widened.

Decided by the builder for #851, each the owner's to overturn:

1. **"Past 10" is read as from Saltreach's floor, 10.** The issue's work keeps the fight where the
   floor is 10 or under, but Saltreach's floor is 10 and its seven rows go by the issue's own fifth
   decision; the measurement counted 10 among the plain (`delta_c5` and `c5_rift` won every fight two
   under). Act I's floors run 1 to 8, so Act I is judged as before (`GATE.dayFrom`).
2. **A map's day is asked where its fights two under were:** a map whose floor is its area's, or one
   outside the area's budget; one with a higher floor counts in the area's day. So the 81 maps judged
   two under past Act I, the 76 owed among them, each have a day.
3. **`cairnfield_m8`'s day is owed to #865 by name** at its figure (109.3%, and 106.3% on 300 seeds), not
   re-sized here: a group re-sized is the area lane's, and #865 re-sizes every group past its limit
   past 10 on the company it makes. One map is not the more than five of the delegate's 6. (#865
   re-sized its crag group, above: nothing is owed.)
4. **The key is `<map or area>: under day`,** a new one, since the figure is not the one the rows held.

## EXPANSION §5.5 Saves

Decided by the builder for #914, each the owner's to overturn:

1. **An area's part of the outdoors is kept under the outdoors' own id,** `maps.caldera` with its
   `used`, `groups` and `doors` and no `size`, which the central file gives, and an area's file has
   no version: every file has the record's shape, so one join reads them all, a single old file too.
2. **What no area owns is the central file's,** and so is an id of the outdoors that stands in no
   area's box, should one ever (none does today; the suite moves a chest onto the void to show it).
3. **A list a file has nothing in is left out** at its top; a played map keeps its four keys as
   before, and an area's part of the outdoors the lists it has ids in.

## EXPANSION §5.8 The one quest

Decided by the builder for #1018, each the owner's to overturn:

1. **The plan learns a walkthrough's scenes by importing its file** where its text exports `scenes`,
   as it reads a suite's `parts()`: a scan cannot read a name a helper builds. None exports them
   today, so the plan reads twelve texts; cut, the twelve cost it about 1.0 s (the kit 0.86 s).
2. **A walkthrough named whole runs as its scenes, each a run of its own,** in their order, as the
   gate's parts do. A name is lower-case letters, digits, hyphens and underscores, once; one that is
   not makes the walkthrough one run, which fails naming it before any scene plays.
3. **A module that exports only `walkthrough` plays as one scene named for its area,** through
   `playScenes`: it prints what it printed, and a throw reads `FAIL: scene <area> threw`.
4. **A name no run has stops the run before it starts, exit 2,** naming the suites, the parts or the
   scenes as they are before the run narrows them; one that `--areas` or `--since` leaves out still
   runs nothing, as before. A scene of a walkthrough whose scenes the plan cannot name (its file
   will not load, or a name is one no run can have) runs the walkthrough whole, which fails saying
   why.
5. **`--walks <folder>` is `--dir`'s mirror:** either alone drops the other's own folder and both give
   both; its areas are its folders in name order, and need not be in AREAS.
6. **A scene says the goals it walks, a chapter standing for every goal of it:** of the twelve's 63
   chapter plays, 6 meet every goal of their chapter (each of the Foreland's 13 meets 5 of its 8);
   the rest come up across plays in other orders.
7. **A scene is held to what it says by a failure alone,** silent when its plays came to each goal
   it names, so that #1033's cuts print the 7,042 checks and no more.
8. **A start sets the flags and fills the bag, then the level (as `walkAt` does), then the place,**
   and the log is read there: a walk hears nothing of its start. The bag is what an earlier scene
   found (the dry cut of Cairnmoor's needs the Cairns' mail in the Cairnfield's last section).
9. **The maps are built once and each walk takes a copy:** its own array of cells and its own
   locked and secret doors (the only cells play writes); the other cells and the palettes shared
   and frozen, so that a write throws, and the defs' features, groups and ways out shared as
   `buildMaps()` always shared them. A walk costs 3.1 ms against 21.3; a reset was refused, as two
   walks alive at once share a map.
10. **`fight` takes #984's memo and not its cap:** the cap moves the printed rate of 28 lines (12
    groups and levels), though no check fails; the memo, keyed by the seeds and the cap as well,
    works out 534 of the 652 fights and prints the same.
11. **The lookups name the five ids nearest by edits** (`no map is named ironfells_n33: the nearest
    are ironfells_n3, ironfells_m3, ...`); `exitTo` finds a way out by where it leads, as the
    walkthroughs' finds do, and `mapOf` goes through `mapDef`. `goalOf` names the words it was
    given and the chapter's goals that begin nearest them.
12. **`DEAR` names runs as it did, a scene among them:** `walkthrough:shelf` stays until #1033 cuts
    the Foreland and names `walkthrough:shelf:pilot`; the fixture shows a scene as the dear run.
13. **The fixture walks one step of the Foreland's chapter,** to Hild at Gullwick: `playChapter`
    reads only the one quest and this is its cheapest goal, so the runner's own check meets the
    content there.

## EXPANSION §8.1 Lanes

Decided by the builder for #900, each the owner's to overturn:

1. **A runtime import is what Node loads:** an `import` or an `export ... from`, `import './x.ts'`
   and `import('./x.ts')`. `import type`, `export type` and an `import()` in a type are left out, so
   the type cycle through content stays as it was kept; `import { type A }` is not, as Node strips
   the name and still loads the file (none is written today). A path made as it runs (`import(p)`)
   is not followed. A lexer reads them in 0.2 s, where the compiler takes three to parse them, and
   agrees with its parse on every file.
2. **The layers are one order,** so content taking the UI or the app would cross too (none does).
   `src/lib/` is vendored: never an importer, always a target. A walkthrough is a test, not
   content: it takes any of `src`, and the area rule holds it.
3. **The suites are what the runner runs as suites:** `tools/tests/*.ts` but `lib.ts`, which a suite
   may take (`ok`, `fail`, `owed`) and a walkthrough, handed `ok`, may not. The runner's fixtures
   under `tools/tests/runner/` are tools.
4. **A row is `importer > imported`,** however often the import is written, under the first rule it
   breaks: the walkthroughs' and the suites', the layers, the areas. A cycle is one row, `cycle: `
   and its files sorted, a strongly connected component of `src`'s graph.
5. **The keys are the plan's:** H8 a walkthrough taking another's chain (`STEPS`, and Saltreach's
   two orders of play), keyed K8 until #985 moved `tools/walk.ts` into the kit. L8 and L9 hold
   none: `src/game` takes no screen.
6. **No cycle is left:** #1020 split `party.ts` so that `skills.ts` loads no item, and the last
   (`items.ts`, `skills.ts`, `party.ts`) went with its `split` row; the `dens.ts` one went in #918.

Decided by the builder for #899, each the owner's to overturn:

1. **The table is ISSUES §2's, a line to a kind of file, the first line a file matches placing it.**
   The area lane is one label, `lane: area`, with the area named beside it in the report:
   `src/content/areas/<area>/` (its `shipped.json` with it) and `docs/areas/<name>.md`, two of
   which are named for a place and not their area (`dead_drop` is Wrackholm's and `meridian_camp`
   Ashfall's; Hearth's was a third until #1027 named it for its area). Since #1011 the folder
   beside a doc, `docs/areas/<name>/`, falls where the doc does.
2. **The save format needs no line of its own:** `SAVE_VERSION`, the upgrades and the save keys all
   stand in `src/game/`, which is systems already. The central `src/content/shipped.json`, what a
   save may refer to that no area owns, is quality's, as the issue says.
3. **The files the table leaves out:** `README.md` and `CLAUDE.md` are design, the docs' front
   pages; `package.json`, `package-lock.json`, `tsconfig.json`, `.gitignore` and `types/` are
   quality, for they configure the checks; `index.html` and whatever else stands in `src/` outside
   the folders the table names (`src/main.ts`, `src/app/input.ts`) are systems, the game's page,
   entry and input; `src/lib/` is no lane, for it is vendored (DESIGN §13).
4. **The labels are the event's, and the tool never fails.** A pull request with no lane label yet
   gets a line saying so, not a failure, and the tool exits 0 in the checks whatever it finds. The
   event is read as the run began, so labels put on after a pull request opens show from the next
   push's run: a re-run of the job reads the same event.
5. **The files are `git diff` against `HEAD^1`,** the merge's first parent, as the sheet job reads
   them: no token and no API. A rename counts at both its ends, since a file moved from one lane to
   another is an edit in each.
6. **The report is a job of its own,** not a step in the sheet job: it needs Node alone and comes in
   seconds, where the sheet waits on `npm ci` and Chromium. Like the sheet it is not one of the
   three required.
7. **A suite of its own,** `tools/tests/lanes.ts`, found by its file, holds the table to a sample
   file under each of its lines, to every file in the tree, to `AREAS` and to `.github/labels.json`,
   and the report to the lines it must write.
8. **The library is the kit's, the command a thin tool:** the layers check (#900) lets a suite take
   `src` and `tools/kit/` and not a tool, so the table, `laneOf`, the report and the reading of the
   diff and the event are `tools/kit/lanes.ts`, the kit's first file (#984, K7, filled the folder,
   and #985 put the walk in it). It imports `node:` modules alone, which the check does not follow,
   and `tools/lanes.ts` is the command line that takes it. The job and the docs still name
   `node tools/lanes.ts`, and no `KNOWN` row is added.

Decided by the builder for #984, each the owner's to overturn:

1. **The harness's library is a module of its own,** `tools/kit/harness.ts` (the thrifty bot, a
   fight and a day of fights measured, the calibration and the workers), in #899's form; the
   company, the fight and the line, which the gate takes too, are `company.ts`, `fight.ts` and
   `line.ts`. The gate's library is the fight's, its `gateCompany` the company's.
2. **The loop takes a fight already begun,** `playOut(s, p, rng, bot, rules, cap)`: each caller
   starts its own (its group's name, its weather, its edge), and the bot is the harness's `Bot`,
   handed `rules.bot` and `rules`; the gate's is `gateBot`. The cap is read once the turn is found,
   as four of the five loops read it; the combat suite's, which read it first, ends inside the cap
   either way.
3. **The guard is 4,000 turns:** no fight under the cap comes near it (the harness's 5,000 never
   bit), and an uncapped one, a walkthrough's `fight`, is broken off at it.
4. **The memo takes its seeds with it:** `rate` and `SEEDS` (100) are the fight's, keyed as they
   were, and the gate suite takes both.
5. **The line's tables are `tools/kit/line.json`, a role a line,** each row as `JSON.stringify`
   writes it (`lineJson`), read as `line.ts` loads; `tools/restate.ts` reads the file at a ref, or
   `tools/testmonster.ts` at a ref before #984.
6. **The suites take the headless game from the kit too:** `tools/tests/lib.ts` keeps `ok`, `owed`
   and the rest and re-exports nothing, so a suite that plays no game no longer loads `Game`.
7. **A suite's shared rules are one module named for it,** `tools/kit/rules/<suite>.ts`, the
   fullrun's `play` and the ladder's acts among them; each suite keeps its checks.
8. **Three of the six tools move whole and three split:** `checks`, `grounds` and `ways` into the
   kit; `shipped`, `changed` and `scaffold` keep their command lines over `tools/kit/<name>.ts`.
   `DECIDES` names `tools/kit/changed.ts` beside `tools/changed.ts`, the changed suite's tool the
   gate loads is `tools/kit/harness.ts` and the sheet watches the kit's `ways.ts` and `grounds.ts`.
9. **`tools/walk.ts` takes the gate's win rate and the headless game from the kit,** two import
   lines, so #985 can move it whole; its 15 rows are keyed `K8`.
10. **The import lines were rewritten by a script,** `tools/rehome.ts`, committed first and deleted
    last, as #968's sweep was.

Decided by the builder for #985, each the owner's to overturn:

1. **The helpers are `walk.ts`'s, the floods `grid.ts`'s:** each flood takes the map it floods (a
   walkthrough's `out`) first, and `ALL` is the grid's.
2. **What a copy took from its scope, the kit's takes as an argument:** the walk (`search`, `here`,
   `keys`), the outdoors, the chapter (`written`, `goalOf`) or the box; each call passes it.
3. **Where copies differed, the kit's covers them in the words each check said:** `answerTo` takes
   what the answer sets (null: nothing) or `{ label }`, and `whole` for the four that named a person
   in full; `open` takes 'map:id', what a chest found open does (`'check'`, `'skip'`, `'any'`) and
   whether the log is heard; `reads` goes by the title of the quest's first page (the five handed a
   title were handed that one); `there` and `shows` place a feature on the map it is written on, as
   Thornmark's and Sunderwood's `shows` did, where the rest placed it on the map the company stood
   on: the same at every call.
4. **A `reach` along a predicate is `spread`, one counting steps `paces`:** Ashfall's two and
   Whitespine's are the first, Cairnmoor's, Rimewater's and the Kilns' `steps` the second.
5. **A variant that does another thing stays, under a name of its own** (`afoot`, `loot`, `sight`
   and the rest, each listed in #985's pull request with what it does).
6. **`FARM_FIRST`, `inOrder` and `saltmouthFirst` stay:** they replay the chain, which the kit could
   hold only by taking three walkthroughs. `HIRE`, `hired` and `ledgerGiven` come in; the row
   `wrackholm > saltreach` stays, and H8 holds eight rows, not seven.
7. **Counted again on the head, `here` has three bodies and `keys` and `hour` one:** the position
   and the two move, and so does every other body two walkthroughs wrote alike under one name, and
   those alike but for the map, box or chest they read where the kit holds the general one (`at` as
   `here`, `clock`, `hour`, `walkAt` or `square`; `business` as `ofKind`; `chestOf` as `chest`).
   What two still declare is listed in #985's pull request with why.
8. **The count reads columns 0 and 2, as the issue's did:** the lairs' `flood`s at column 4 stay;
   Hearth's `written` there, a quest's entries by id, is `entered`, as Ashfall's is.
9. **A script made the edits,** `tools/rehome.ts`, committed first and deleted last; its `--prune`
   dropped the imports they left unused (the base's three stand). Five edits are by hand: Hearth's
   deeper `written`, Glasswold's two comments and its local `Can`, Cairnmoor's `road` and
   Whitespine's `keeperLog`.
10. **Six bodies are still written in two walkthroughs, each one but for a type, a `!` or the walk
    it reads:** `group` by 'map:id' (Ashfall's and Sunderwood's), `person` on a map given
    (Cairnmoor's, Rimewater's and Whitespine's `personOn`), `feature` on a map given (Ashfall's and
    Glasswold's three), `cross` (Ashfall's and Glasswold's), a box's square stood on (Ashfall's
    `at`, Cairnmoor's `standsIn`) and a meeting's words with the log not heard (Ashfall's `say`, the
    Kilns' `says`, Sunderwood's and Shelf's `talk`). With the families alike but for the map or box
    they read (the box tests `on` gives, the events `ev` finds, the squares `square` keys) they go
    into the kit with the scenes (#1018, #1033), which rewrite every walkthrough.

Decided by the builder for #983, each the owner's to overturn:

1. **Which file holds what.** The paint kit: `brush.ts` and `gloss.ts` moved whole, `ink.ts` (`INK`,
   `rod`), `forms.ts` (`Pt`, the unit frame `F`, `ring`, `tube`) and `flame.ts`; the monsters' kit:
   `common.ts` and `figure.ts` moved whole, and `chisel.ts`; the rooms' kit: `stage.ts`
   (the old `kit.ts`, a name that says nothing in `kit/`), `props.ts` and `trades/`.
   A moved file keeps its name.
2. **The glow goes with the flame:** `smudge`, which `drawFlame` lights with, moves into `flame.ts`,
   as the paint kit takes nothing from the rooms'. The stage imports `INK`, `smudge` and `drawFlame`
   and re-exports none; the old `kit.ts` does, so each name has one home in the kits.
3. **The trades are the props the issue names:** the temple's stained glass, altar, pew and
   Lanterns' ring (eight scenes take one) and the smithy's armour stand, mail and anvil (six).
   `pillar` stays in `props.ts`, as the throne room stands on it beside two temples, and so
   do the weapons and shields.
4. **The unit frame is `F`, as its nine copies name it,** beside `Pt`, so a family taking
   it deletes its own declaration and changes no other line; the four with an `h` and
   the crawlers' `H` need more.
5. **The brush's default and `B` take `INK`,** as the issue asks; the eye's pupil in `common.ts`,
   the file's other `'#120c14'`, is a copy and stays until the file is next edited.
6. **What a kit's file counts (`tools/changed.ts`) goes by folder:** any of `src/ui/paint/` every
   monster and room, and `brush.ts` and `ink.ts` (the viewport's `hash`, `B`'s outline)
   every map too; any of `src/ui/monsters/kit/` every monster, its `common.ts` every map
   too; any of `src/ui/interiors/kit/` every room. A new kit file is counted with no edit;
   `chisel.ts` counts every monster, where `knockers.ts` counted the knockers alone for a
   mark three other families cut.
7. **The rooms' kit is no area's folder:** the changed suite's check that each folder of
   `src/ui/interiors/` is an area's, its registry keying the area's rooms, skips `kit/` by name.

Decided by the builder for #986, each the owner's to overturn:

1. **Each tool serves the tree and hands the port in:** the kit takes src only, so `browser.ts`
   cannot take `tools/server.ts`. Each of the six keeps its three lines that start the server on a
   port of its own, and `node tools/server.ts` (`npm run dev`) is as it was; moving the server's
   library into the kit would move the file `npm run dev` names to save three lines a tool.
2. **A page's errors are gathered one way,** a page error or a console error, each named so
   (`pageerror: `, `console: `), as the smoke and the sheet had them; the gallery, the interiors,
   the world map and `shot.ts` took page errors alone, unnamed. The game writes no console error of
   its own (`src/` has none outside `src/lib/`), so their runs print what they did. The full
   Chromium of the fallback asks for `/favicon.ico`, which the tree lacks, and its 404 is a console
   error: the kit answers it with nothing.
3. **The four tools' tables stand in `tools/kit/args.ts` beside the reading,** not in the tools: a
   suite takes no tool and a tool runs as it loads, so the suite reads them there. Each tool keeps
   its defaults (its output path among them) and the meaning of each flag; the sheet's usage line
   and refusals are word for word.
4. **The output path is the one word that is neither a flag nor a flag's value, wherever it
   stands.** The gallery and the interiors took the first word that was not a flag, so a flag's
   value could be the path: `gallery.ts --family wolf` wrote a file named `wolf` and
   `interiors.ts --only green_man out.png` one named `green_man`; the interiors also passed over a
   path starting with a digit (`interiors.ts 2x.png --only green_man` wrote `green_man` too). The
   first now writes the default and the others their path. Every line in the form of the usage lines
   reads as it did, which the suite holds against each tool's old reading.
5. **A page's import is typed by `Load`, a type in `tools/kit/browser.ts`:** a page function cannot
   close over the tool's, so each binds it (`const load: Load = (p) => import(p);`) and each call
   names the module's type, its path a literal as before.
6. **The smoke names what it reaches into, all of it erased before the page sees it:** `Shown`, the
   fields it reads off a screen that `Screen` does not name; casts that write what the game keeps
   read-only (a map's features and landmarks, the item table and the painted flames); the world's
   private cached sky and the input's queue by their names (`w['cached']`, `['queue']`), the sky set
   to `null` where it was `undefined`, as a flag set to `true` is now `1`: the game tests both for
   truth. Its five lines left with `any` (the lighthouse's and the tents' records and an early
   return's `wold`) are H9's.

Decided by the builder for #1026, each the owner's to overturn:

1. **The table is `FIRST_READ` in `tools/kit/docs.ts`, which §8.1 names in a sentence:** a table in
   §8.1 would be a third copy of what CLAUDE.md says and the measure reads, and EXPANSION had 115
   bytes to spare. The sentence's room is the two lists cut from §8.1's #985 paragraph, which the
   files' headers hold.
2. **DESIGN beside §1:** systems §5's Races and Classes and prestiges, §6, §7, §11 and §13; area §4
   and its act; interiors §11; quality §13; creatures and design none. All of §5 put the systems
   lane over 112,000 bytes; cut by sub-heading, it leaves Stats, skills, mastery for a question.
3. **EXPANSION is read whole:** since #1048 it is its §3 to §5 and §8 alone, held at 46,000 bytes;
   the quality lane's §5 is in it and counted once.
4. **The interiors lane reads the header of every .ts file of `src/ui/interiors/`, its kit's too:**
   a room paints with the kit and the rule of three asks what it holds; 81 files, 22,384 bytes. The
   code map folds an area's rooms into one row, so it is not the reading.
5. **One of several is counted at its largest:** an area's state at the largest of `docs/areas/`
   (Saltreach's since #1067, the Kilns' before), its act at Act I's; the design lane's doc at the
   `##` section of DESIGN, STORY and MONSTERS (DESIGN §9).
6. **The creatures lane's family is ROSTER's families with its head;** a family's row there names
   its defs. It reads MONSTERS §1 to §4.3 but §3.3, What the road asks (18,477 bytes), the systems
   lane's list of a def's fields: read whole, the lane was about 2,800 bytes under budget, which
   the next monsters ROSTER lists would spend in a content pull request, so §3.3 is cut now.
7. **A file read in part counts its head,** the lines before its first `##`, as the issue counted
   DESIGN §1 "2,464 with the title"; a header is all the comment lines a file opens on.
8. **CLAUDE.md names a file of the reading in backticks, as the docs check reads a path;** what is
   not read first (README.md, the folder an area is named by, its decisions.md and plan.md) is
   written bare.
9. **A rule gets the docs through the tree:** `Tree` gains the texts the first reads take, and
   `budget` and `reading` are held on CLAUDE.md; a rule stays a function of one doc and the tree.
10. **A doc may name the check's own:** of its two files only the names a line declares are the
    code's words, not their strings or comments, so the copies' made-up names stay refused.
11. **The name rule stays a word's:** a member rule would hold 97 of the 98 dotted names, but the
    maps' `GATE` would still let `GATE.through` pass; not built.
12. **A "Decided by" list is a heading that opens so, a paragraph or quote that opens so and ends
    on a colon or runs into a list (as this file writes one) or a list two of whose items open so;**
    one ruling said in a sentence is no list, nor are the three §5.2 states inside its paragraphs.

Decided by the builder for #972, each the owner's to overturn:

1. **The rule is the issue's:** an export is imported by name (in types too, a re-export counting
   for the file it names), by a module taken whole (`import * as`, `export *`, an `import()` as it
   runs) or as a name a tool reads off a module it loads in the page; 427 exports pass by a module
   taken whole, the items and flags each `public.ts` re-exports among them.
2. **`typeof import('./x.ts')` alone takes nothing:** the page's loads type their module so
   (`load<typeof import(…)>('/src/…')`), and what a tool reads off the name the load binds counts,
   the latest load of that name in the file; `import('./x.ts').T` takes T.
3. **A row of `ENTRY` fails when it names no export,** as a row of the layers' `KNOWN` does when it
   crosses no more; the kits' rows stand though two let nothing through today, `export *` taking
   their files whole.
4. **`NARROW` and `LISTED` get no row:** exported for the typecheck alone, they pass as the content's
   index is taken whole by the tools' `import()` of it.
5. **Six the check would pass are deleted as #848 named them:** `celEllipse`, `figure`, `head` and
   `sword`, in the monsters' kit since K8, and `prestigeBar` and `MAX_SPELL_TIER`, in party's own
   files, which `export *` takes whole; nothing uses them.
6. **A statement of declarators not all imported is split:** the imported keep `export`, the rest
   are a `const` of their own after them.
7. **The world's weather memo is not private now:** the smoke and the kept suite read and set it as
   `w['cached']`, which the unused flag does not count as a read.
8. **A parameter nobody needs goes with its arguments** (`hurtMonster`'s state, `desk`'s stage, the
   spell screen's `context`); a screen's `render` keeps its host as `_g`, which `Screen` asks for.
9. **The pilot meets once:** `for (const f of stood) meet(…)` is `if (stood.length) meet(…)`, as
   `meet` sets a key in a set and a map; and the weather suite still builds its second world,
   unbound, since building it draws what building the first drew.

## EXPANSION §8.2 The recipe for a zone map

Decided by the builder for #915, each the owner's to overturn:

1. **The barrel reads the areas** (`AREAS`, `src/content/index.ts`) to refuse at load a kind no area
   names, as `byId` refuses a monster defined twice; a family's file refuses one outside
   `MonsterSprite` at the typecheck already.
2. **A change to the barrel counts the families its import lines add against the base's**, read from
   its text since the base's barrel cannot be imported; `tools/tests/changed.ts` holds the reading to
   the families the barrel merges. A file of `src/ui/monsters/` the barrel merges no kinds from counts
   every monster, as a shared brush does.
3. **`SPRITES` stands after the family's `draw`**, which every entry names, where `KINDS` stood before
   it, and keeps `KINDS`' order; the smoke's line of declared parts names them family by family, in the
   barrel's order, where the old table had its own.
4. **`familyModules` keeps a family's `kinds`**, the keys of its `SPRITES`, so `pillars` reads them as
   before.

Decided by the builder for #1011, each the owner's to overturn:

1. **The state holds what a session needs and no history:** the index, then §1 in words (zones,
   bands, edges), §2 and §10 whole, §3's table, §5 to §8 a paragraph or a line each and "Open and
   owed" last, unnumbered so the old numbers keep their meaning. Every figure in it is re-read on
   the head from the suites' lines; the old lines stand in the plan as they were written.
2. **A row says its secret as the door's squares, what it is, then the hint's squares and id**
   (`4,7: a cold draught at 4,6 (mill_draught)`), as `secrets` and the hint's feature hold them, so
   the row is found again in the map's file; a map with none says so.
3. **The header's moved lines open "Moved from the state" with no heading,** as they had none but
   the title; every other part stands under the heading it had, repeated where the state keeps it.
4. **The proof holds paragraphs as well as lines:** a paragraph (a run of lines, broken at each
   heading, list item and table row; a fenced block whole) stands whole and in order in one new
   file, its blank lines where they were, and each file holds a section's paragraphs in their old
   order, since every line found does not show that none was split or reordered. A line is
   compared whole, its spaces and all.
5. **The lanes line takes the doc's folder whole,** any file in it, as an area's content folder is
   taken, through `DOC_AREA` for a place's doc.
6. **The owed docs are named, and their lines read as they stand** each run, so no area's pull
   request leaves the figure stale; the issue's count on `ea34c3ad` is in its pull request.

Decided by the builder for #897, each the owner's to overturn:

1. **What an area owes and its rungs are rows of its `checks.ts`, not fields of the `Area` in its
   `index.ts`**: the game's build carries none of the checks' bookkeeping, as `progression.ts` and
   `tools/harness.ts` keep it out today, and the issue's `checks.ts` holds the area's own rows.
2. **One field name per table**, each keyed as its table was, so the move is a copy: `owes.curve`,
   `unplaced`, `unset`, `cutOff`, `edges` and `locks`; `gear` by level; `road`, `reach: true` and
   `maxGroup` on the zone; `boss: true` on the group; `offLine` on the monster, OFF_LINE's reason or
   WHOLE's role, share and reason; `crosses` on the exit, the two regions it joins.
3. **`gear` holds a rung whole**: what a company wears by the level goes to `GEAR` and what it carries
   to `KIT`, by the item's slot, so one row serves both.
4. **`NAMES` is the atlas's name of the area, and `BEHIND` every group whose `after` names a flag only
   a later area's maps set**: both read the same as the tables did (the twelve names and
   `deep_mines3:ud_mines`), and a new area needs no row for either.
5. **The Deepthorn's eight is a table, `MAX_GROUP`, until it moves**, read beside `maxGroup` as the
   other tables are.
6. **`ONE_CROSSING` is a list, and the exit's mark names the two regions it joins** (`crosses:
   'hearth kilns'`): the table may be emptied and still typecheck, the mark keeps the table's pin on
   the regions, and each fixture gives its own table, so it holds whichever way the door is written.
7. **`seamsAsBuilt` and `openOnNothing` are lists of rows as their tables write them**, so the move is
   a copy of the line, and a row on an area that is not its first box's is refused. The Foreland's
   are five seams and three edges; `upperwater_c2|downs_d2` and `upperwater_c3|downs_d3` name its box
   second and are Saltreach's.
8. **An issue may be owed edges or locks by several areas; a square or a lock is owed once.** `edges`
   and `locks` stay keyed by the issue, as their tables are, and are read by the thing owed.
9. **A rung stands whole on the last area on the road whose items it holds**: 3 on the Foreland (the
   core's and its own), 13 on Wrackholm and 19 on Cairnmoor, the three that hold the items of two
   areas; every other rung is its one area's (14 on the Sunderwood, 28 on Hearth Isle and the
   rest). A rung on another area is refused; 13 and 19, each moved whole by hand, read the same.
10. **An area's lead over the road is its own figure, `overRoad`**, read beside `OVER_ROAD` and refused
    in both. The Foreland has none; the Kilns' 19.4, moved by hand, reads the same.
11. **`BEHIND` takes a group only when every alternative of its `after` waits on a later area's flag**,
    as a list is any one of them. No group has two today.
12. **Two tables are not an area's to carry: `BUILT` and `UNPLACED` in `tools/tests/items.ts`** (#911: the
    three artifacts then owed to #830, #831 and #833; the Telstok alone, owed to #830, since the
    Kilns' and the Glasswold's lairs placed theirs) go when the lairs place them, so they have no
    field.
13. **An `unplaced` id that is no monster and no room fails by its name**, and a field `AreaChecks` has
    not stops the run by its name: the run passed both over before.

Decided by the builder for #968, each the owner's to overturn:

1. **Rungs 13 and 19 stand on Wrackholm and Cairnmoor**, the last area on the road whose items each
   holds (#897's rule, which the ladder suite keeps), and KIT's 25 shares Ashfall's rung 25 with
   GEAR's, worn first: the derived `GEAR` and `KIT` read as the tables did, rung for rung and in
   order.
2. **`Area.atlas.links` may be left out**, as the Foreland's is, having no link of its own.
   `ATLAS.links` is each area's in road order and then the plan's 15 between two areas; the zone
   overlay draws the same PNG from them.
3. **A Rift's table may say its warden is a boss** (`RiftTable.boss`): the Tide Ship's Rift's warden
   is made by `rift()`, so its mark goes on the table, and the group carries `boss: true` as written
   ones do.
4. **A row's comment goes with it** where it names one thing: a road's above its zone (above the
   field in a zone of several lines), a boss row's above its one group. The three rows of several
   groups (Wrackholm's, the Ember Waste's and Hearth Isle's) leave theirs, each group saying in its
   map what it is; `SEAMS_AS_BUILT`'s headers, one an area, go, as each row now stands in its area's
   file.
5. **`offLine` stands before a def's `tint` and `boss: true` after a group's `roams`**, where the
   lairs wrote theirs; a new `checks.ts` (Thornmark's, Saltreach's, the Sunderwood's, the
   Whitespine's and Hearth Isle's) takes the others' form.
6. **Every walkthrough check of a respawn takes its name**: thirteen in six walkthroughs, where the
   issue counted four.
7. **The quests suite reads `reach` alone**, so it imports nothing from the pillars suite, and that
   row of the layers' `KNOWN` goes.
8. **`OPEN_ON_NOTHING` (17 rows) and `OVER_ROAD` (2) stay**: each has had a field since #897
   (`openOnNothing`, `overRoad`), but #968's table names neither, and it kept `OVER_ROAD` only until
   it had one; #969 moves both by the same script, and its body names them.

Decided by the builder for #992, each the owner's to overturn:

1. **`public.ts` re-exports `items.ts` whole** (`export * from './items.ts'`): every item by name
   and the rest of the file (`ITEMS`, `CURES` and the shops' lists; the Kilns' `quarterMore`,
   `SMITH_PRICES` and `ANVIL_STONE_PRICE`), in one line that an item added never touches.
2. **A statement of several flags is split** where the others take only some: those taken move, and
   the rest stay in the map under the comment that names them all. Each group in `public.ts` says
   the file it came from; a flag's own comment moves with it.
3. **The Kilns' `GATE` of `ironfells_n3` is `IRONFELLS_GATE`**, for the Iron Fells, its map's name
   without its square, in the map and the two walkthroughs that read it; `kilnmouth_l6`'s stays
   `GATE`. No other name of a `public.ts` clashes with one of its area's.
4. **An item named for the first time takes its id's name**, declared above the array it stands in
   (`ITEMS`, or Ashfall's `PARTS`), in that array's order and with its comment, an object typed
   `ItemDef`; the array holds the names. The 20 consts that had names keep them and gain `export`.
5. **A walkthrough takes another area's chapter as the Hearth's takes the warning:** `const TIDE =
   THE_QUEST.chapters.find((c) => c.id === 'tide')!`, under one comment after its imports, the names
   the bodies read kept.
6. **One import from each `public.ts` in a file**, where the first of the imports it replaces stood;
   an area's own files and the tools that took a moved name take it from `public.ts` too.
7. **The layers suite's fixtures key their area row `K8`**: `judge` takes a row under any key of the
   plan, and with `A6` gone no key holds a row of the area rule (`K8`'s eight are a walkthrough
   taking another, the `tests` rule's), so the fixtures borrow `K8`; what they test is the rule, not
   the key.

Decided by the builder for #969, each the owner's to overturn:

1. **The script gives the two tables their owners**: an edge open on nothing to the area whose box
   it is, a lead over the road to its area, after its rungs and before its seams as `AreaChecks`
   orders them; `OPEN_ON_NOTHING`'s headers, one an area, go, as `SEAMS_AS_BUILT`'s did.
2. **`MAX_GROUP` goes too**: #968 emptied it and the issue's list leaves it out, but no suite may
   read a row from two places; the maps suite reads the zones' `maxGroup` alone.
3. **A row two areas could both give is still refused twice** (an owed monster, room, flag, map,
   square or lock, and a rung): that is no table's second read but the areas' own check, so `beside`
   becomes `gather` over the areas alone and the line drops "in the table or by its area".
4. **A refusal that only a table could trip goes with it**: a zone holds one road, a group one mark,
   a monster one `offLine` and an area one `overRoad`, and a seam's or an edge's row is held once by
   its own check; so those lines go, and the gate's "every key of `ROADS` and `BOSSES` is a zone".
5. **The one crossing is still one**: a second exit marked `crosses` is refused, as the weather rule
   allows one door; the fixtures that wrote the door in the table mark it on its exit.
6. **The gate's `nameOf` loses its fallback to the id**: an area the atlas does not name throws, as
   the issue asks of whatever fallback `NAMES` left.
7. **The items suite's `UNPLACED`** (the Telstok's lair, owed to #830) is not an area's table, and
   the issue names it neither in its What nor as an exception: it stands, though the issue's grep
   finds it.
8. **A doc's rule says the field; a record keeps the name**: the decisions of #897 and #968 above
   and the area docs' build history name the tables as they stood when each was written.

Decided by the builder for #993, each the owner's to overturn:

1. **An area writes an exit through `anchored`**, which types an exit written by its anchor as the
   exit the join makes of it: `Exit` keeps `tx`, `ty` and `tf` as every reader reads them. Made
   optional, they would have taken a change at 28 places in three files of `src/game` and six of
   `tools/`, the readers the issue keeps as they are.
2. **The join fills each exit in place and keeps its `at`**: whatever holds the exit (its map, a
   `public.ts`, `MAP_DEFS`) reads the same square, so the 33 walkthrough lines read as they did and
   are not touched, and the structure suite holds every exit to an anchor as the game runs.
3. **`anchors` is a record by name**, written after the map's `start`; the typecheck refuses a
   literal that names one twice, as a fixture holds under `@ts-expect-error`, so the join refuses
   the one name it can see twice, `start`.
4. **A name is `from_<the map left>`**, with `_2` for a second square entered from the same map
   (seven, the Foreland's `from_harrow_2` among them), so `from_meridian_camp_2` and
   `from_meridian_camp2` read apart. One is renamed: the Deep Mines' `rungs`, where the way down
   from the first level and the way up from the third both land.
5. **A Rift's way out takes an anchor too** (`out: { to, at }`): each of the five Rifts the areas
   place builds its one exit from it, so they are five of the issue's 175 exits and its grep found
   their `tx:`. The Rift samples' `out` keeps its square, as it keeps the party's facing, which an
   anchor cannot; the Kilns' `TEAR` keeps its own.
6. **A zone map's place is `laid(PLAN, id)`**, from the plan's grid; the Foreland's and Thornmark's
   name their boxes (`laid(PLAN, 'shelf', 'G2')`). A box the grid lacks throws as the area loads.
7. **The fixtures stand in the structure suite**, which holds the grid already, beside its line
   holding every exit of the areas to an anchor: no suite of their own and no snapshot.

Decided by the builder for #994, each the owner's to overturn:

1. **Each map's id is literal where it is declared**, `MapDef<'cairns'>` (191 maps) and
   `Rift<'c5_rift'>` (5), in place of the keyed record: the smaller diff, as the record changes
   every reader of `Area.maps`. The id is `MapDef`'s parameter, not `as const` under
   `satisfies MapDef`: a map's type inferred from its literal would wait on `MapId`, which its exits
   name.
2. **`MapId` is made of each area's `MAPS`**, not of `AREAS`: an area's literal names maps
   (`outside`), so a union made of the areas would wait on itself. `LISTED` fails the typecheck if
   an area's maps are left out of `AreaMaps`, and `NARROW` if the union widens.
3. **A map as played is `PlayedDef`**, whose exits name the outdoors too (`MapDef`'s second
   parameter), and the world's exit as it steps is `Exit<string>`, as it takes a Rift's tear and a
   crossing sold. `MAP_DEFS` is `MapDef<MapId>[]`.
4. **A rift's `to` and `Passage.to` stay strings**: each costs more than a line, as `riftWay` makes
   a tear of any Rift (the samples' too) and `sells` a passage of a crossing's ends, which name
   their places by strings. A Rift's `out.to` takes `MapId`.
5. **A fixture's map goes through `fxMap` or `fxKey`** (`tools/tests/lib.ts`), a string handed on as
   a map's id or key: each map no area has is marked where a suite names it, and so are a map a
   check holds as a string (`denFaults`' map, the outdoors) and a key the game must refuse.
6. **The Rift samples' `until` goes through `wardenFallen`** (`src/game/rifts.ts`), the one
   assertion outside the suites: a sample's id is no map the areas list, and no file of
   `src/content` takes a cast.
7. **A built `seen` or `slain` goes through `mapKey(map, id)`** (`src/game/keys.ts`), which
   `denBurnt` uses; a condition kept in a const takes `satisfies When` (seven).

Decided by the builder for #995, each the owner's to overturn:

1. **Each area declares its flags in a leaf, `flags.ts`**, which `public.ts` gives on and `index.ts`
   puts on `AREA`; the code's six are `src/content/flags.ts`, beside the core items. A leaf, as the
   issue allows: 436 entries would bury `public.ts`'s few, and a file that imports nothing closes no
   loop.
2. **A flag is declared by the area whose `shipped.json` records it**, as the issue rules, where
   another area's `public.ts` spells it too: the six of the Glasswold's quests asked at Cinderport
   are Ashfall's, `q_nest_watch` and `q_salt_done` Sunderwood's, `q_wenna_home` the Foreland's and
   the endings' three Hearth Isle's. `q_road_west`, in two files, is Ashfall's, as the issue gives
   it. No constant moves.
3. **`Flag` is made of each area's `FLAGS` and the core's** (`Declared`), not of `AREAS`, as `MapId`
   is of `MAPS`: an area's literal holds what its fields read. `NARROW` fails if it widens.
4. **A flag two declare is refused twice over**: `ONCE`, `Once<Declared>`, is `true` only while no
   two declarations share a key, else the flag, which the typecheck names; `flagOwners` refuses it
   at load with both areas' names, as `byId` refuses a monster, and there alone a key made at run
   time or an `AREA`'s `flags` beside its `FLAGS`, which the typecheck lets through.
5. **A guild quest's two flags and a hall's fee are `Flag` by assertion** (`src/game/keys.ts`): they
   are made from the content's strings, a quest's id and a hall's name, and the shipped suite holds
   each to its declaration by name. A rank's is typed from `GuildId` and the glove's is a `Flag`.
6. **A fixture's flag goes through `fxFlag`** (`tools/tests/lib.ts`), as a map goes through `fxMap`;
   the smoke's two fixtures, which run in the page and cannot import it, through a helper of their
   own.
7. **`finishedBy` takes a string still** (`src/game/quests.ts`): it looks a flag up, and the world
   map names a gate by the strings it reads off any exit.
8. **The declarations are in the record's order**, as `tools/kit/shipped.ts` sorts each list, so
   each reads against its `shipped.json` line for line; a gloss says what holding the flag means.
9. **`CODE_FLAGS` is the code's declaration** (`tools/kit/shipped.ts`): the central file's six are
   read from `src/content/flags.ts`, where `donations`, `GLOVE_FLAG` and the four ranks were listed.

Decided by the builder for #1024, each the owner's to overturn:

1. **All 30 lists moved, the two that L3 (#1046, open) edits among them:** #946's item 3 (§5.2) and
   #900's item 5 (§8.1). Left in their sections they would make EXPANSION 50,030 bytes, past its
   46,000; whichever of the two pull requests merges second makes L3's edits here.
2. **A heading to each section that had lists, naming its doc and number,** in the old order, so a
   decision on another doc's rule can stand under its own.
3. **Every decision but an area's comes here,** a list under the issue's number, under the doc and
   section of the rule it settles (EXPANSION §8.2, whose last line says so and points here); an
   area's stays beside its doc, as #1011 has it.
4. **The index is one line of the head's paragraph,** naming the archive for each section moved,
   under its number; the titles are the archive's. The kept rules, 38,771 bytes on `ea34c3ad`, are
   45,433 at the base without their lists, so what is added had 567 bytes; it takes 559.
5. **A pointer ends each section whose lists moved,** §5.1, §5.2, §5.5, §8.1 and §8.2; the other
   kept sections had none to point at.
6. **Of §2's rules only the road's wanted a line,** a bullet of §5.4, where the pillars are checked:
   §4 and §5.4 say a story lock is declared and kept to its count (`src/content/locks.ts` holds
   it) and §5.3 says the core and the country, each to its floor.
7. **§10's aim is a bullet of §8.3, after the tests job's;** the cure's three steps are built (#955,
   #954 and #953) and the sentence keeps their order.
8. **The archive gives §8's heading again above §8.4,** so that §8.4 stands under its number; its
   links are left as written from `docs/`, as the slice's archive left them.
9. **The rules' own "Decided by" sentences stay in them** (three in §5.2): each is a rule with its
   source, not a list.
10. **The pass of #1025's rule reads the lines this writes:** seven paths, all in the tree. A kept
    line is moved, never rewritten, so the 33 backticked words of EXPANSION's own lines that name
    no file from the root or from src/ (an area's checks, the kit's files by their names, the pages
    workflow) are #1025's to mend, inside the 46,000.

## MONSTERS and the roster

Decided by the builder for #1024, each the owner's to overturn:

1. **A paragraph of §4.4 is a rule or a run whole,** since `tools/docmove.ts` holds each paragraph
   whole in one file (the lines are MONSTERS.md's at a3c5ed75). `:527`, which says the gate judges
   the day two under a floor, is a rule whose last sentence leads to its table, a run: the table
   moves and two lines stand where it stood. The two decisions of 16 October 2026 written inside
   run paragraphs (`:844` in #549's bullet, `:917` in #584's) move with them; the first is stated
   again in EXPANSION §5.2 (#734), the second bounds a fix to the test brute's line at 12.
2. **#18's and #891's lists in #865's bullet (`:959`, `:966`) are rules** (J2: the line is not made
   on optional power), so they stay in §4.4 after "When the line moves", indented as they stood,
   since a line is moved and never reworded; they read as a paragraph and a list. #865's bullet, a
   run, moves.
3. **The harness's report (`:972`) is a rule:** how the line is measured and made again, its flags
   and what-ifs. The armoured held at 29 and 31 (`:632`) stays with the line it explains.
4. **The row:** the issue's family, kind and level, numbers, look and abilities, each number a
   column (hit points, armour, to-hit, the blow's dice, speed, xp, gold) and the name with its id,
   by which the tool names a row. Left out: `tint` and `size` (the drawing's), `plural`, `sprite`
   (one to each def), `drops` (the items') and `offLine` (why its numbers stand off the line, the
   harness suite's; 30 defs, up to 236 characters).
5. **What it does is the def's own fields:** its kind's (immune, resistant, weak, holy, when it
   breaks) are the kind's column and MONSTERS §2, not repeated. A chance reads "0.3 a hit" as §4.4
   writes it, and "every turn" at 1.
6. **The families' table:** a row to each family the defs use, in the order the road first meets
   it, its first area (with its defs there) and then each later area with its own; a family is
   named by its module (`machines`, `longbodies`, `oldwood`, `glasswalkers`), as `FAMILY_OF` names
   it, not by the old table's words.
7. **An area is headed by the atlas's name and its id,** the Foreland's "The Foreland (`shelf`)";
   an area with no defs has no heading.
8. **The roster counts nothing,** as #1023's decision 11 has the code map count nothing: two pull
   requests that add monsters to two areas merge clean; two that add one family's kinds in two
   areas both edit its row, mended by the tool.
9. **A guardian's row stays in MONSTERS.md §13 only while it is not drawn.** Built on b56e8daa, the
   Old Chanter's row stayed there with §13's heading, the table's head and three lines saying why.
   #1045 merged during the build (15434c64) with the Old Chanter drawn, so on merging main §13 went
   whole to the archive, its row and #1045's lines in it, and MONSTERS.md keeps no §13; its index
   names the archive for it.
10. **An index of four entries at MONSTERS.md's head** names the file of each section that moved,
    under its number, for the citations of §5 to §13 and of the runs; README's list names the three
    new files.
11. **The archives' heads are blockquotes,** as `docs/archive/SLICE-history.md`'s is; the log's
    table takes a line leading to it, since its paragraph stays in MONSTERS.md.
