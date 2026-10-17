# The pilot

An autoplay mode for watching (epic #713). The pilot plays the one quest from the title to the
ending's choice: it fights, explores, rests, buys, trains and talks at a walking pace, saying over
the view what it is about. It plays **fair**: it knows only what the party knows, never a
map as written, so where it gets lost the finding is against the area's hint chain, not the pilot.
It is opt-in and changes nothing for the player (DESIGN §1, pillar 1).

It lives on the `Game` (`g.pilot`), outside the save: nothing of it goes into `WorldState` or
`party.flags`, and `SAVE_VERSION` stays 5. `src/main.ts` builds it; a `Game` a test builds has none
until the test gives it one. It presses the keys a player would: every move is an `Action` through
`Game.update`, and nothing teleports or is bought off screen.

Built so far: the frame (#716) over the bot's fights (#714), the navigator (#717) and the explorer
(#718). Until the other brains land (#719 to #721) the explorer sets the only goals: the pilot walks
the map it is on, outdoors its zone, until it is walked out, hands each fight to the bot and closes
each message box.

## Using it

- **P** hands the game to the pilot and takes it back. Any other key while it drives takes it back
  too, and is then handled as usual. `src/main.ts` takes P and T before any screen sees them, so
  they work on the map, in a town and in a fight alike; no screen has a pilot key of its own. While a
  name or a riddle's word is typed, P and T are letters.
- **P on the title** (or the company screen) starts a new game on a fresh seed with a company drawn
  from that seed, the pilot at the helm.
- **T** cycles the tempo: 1×, 2× and 4×, an action every 15, 8 and 4 ticks (4, 7.5 and 15 a second).
  A fight goes at the game's own pace whatever the tempo: the pilot hands it to the bot (`auto`).
- **The why line**: while the pilot drives, a band over the top of the view carries two lines in the
  game's voice and `PILOT 1X` at its right; the hint that would stand there is not drawn. When no
  brain has a key or a word, it says "Nothing to do."
- It stops by itself at a party wipe, saying "The company has fallen.", and at the ending's choice
  (#721). Nothing else is the viewer's to say. A stop of its own keeps the band up with its why line
  until the next key; when the viewer takes the helm, the band goes at once.

## Fair: Known

Every brain reads the world through `Known` (`knownOf(g)`, `src/game/pilot/known.ts`) and never
through `g.world`, `g.maps` or a `MapDef`:

- the automap's bits (`seen`) and the cells of seen squares as the automap inks them (`cell`): a
  secret door is a wall, and no cell carries its legend letter;
- the features the automap marks on seen squares (no event, nothing absent or spent), each a fair
  copy: its kind, square, id and the name its hint shows. A statue's riddle and answer, a person's
  words, question, crossings and hand-ins, a shop's stock, a trainer's top level and what a chest
  holds do not come through: words are '', lists [], a number NaN;
- the exits on seen squares that are there now, with where each leads and no gate's terms: a gate's
  `needFlag`, `shut`, `lifts` or `after` is never read, and the pilot learns a gate by trying it;
- the squares of the groups the automap marks on the party's own map (`groups`, #717), in view or
  on a seen square within two steps: where a group stands and nothing of what it is;
- the company (`party`, #717): who stands, what each has learnt and what it carries;
- the maps visited, the world map as it is painted (`placeOf`) and every line heard: what `Game.say`
  says and every message box opened, the last 2000. A new game or a load empties it;
- a map's bounds and a zone's box on the outdoors (`box`, #718), as the automap and the world map
  draw them, and nothing else of either; a place's band as the almanac gives it (`band`, #718): a
  zone's once the party has set foot in it, a town's or a dungeon's once visited; and how many
  squares of a map are seen (`seenCount`, #718).

A zone map's id (a goal's map may be one) names the outdoors it lies in, in one reckoning: every
reader takes and gives the outdoors' squares, as `g.world.state` has them while the party is there,
and its features and exits are those in the zone's box. A goal's square written in the zone's own
reckoning goes through `World.locate` first. Features and exits of seen squares are as the world has
them now, not as last seen. The headless run's `omniscient` pilot (#723) has every square seen; the
game never sets it.

Not in `Known` yet, each built by the first issue that uses it, with its own fairness test: what a
menu has shown, such as a shop's stock and a trainer's top level (#719); and a goal's map, read once
seen (#720).

## Brains

The brains (`BRAINS`, each `(g, k, p) => Action | null`) are asked in order on every paced tick,
whatever screen is on top, and the first key given is pressed. A brain returns null unless the
screen it works on is on top: route and explore only on the ExploreScreen; talk and keep also on the
screens they answer. The explorer is asked after the navigator, so it speaks only when no goal is
walked; a goal it sets it walks at once, asking `route` for the first key itself. When no brain
gives a key, a why line one of them said that tick stands ("Helmstow is walked out."); else the
frame says "Nothing to do."

## The navigator

`route` (#717) walks `Pilot.goal`, a square and the name the why line gives it ("Bound for the
lane."), one key a call with the map on top: `forward` and the turns, never `back` or a strafe, so
the party faces where it goes. Its routes go breadth-first over the squares Known has a cell for that
the company can cross, round the groups the automap marks and onto an exit only at the end; from map
to map they go by the exits seen. A secret door is a wall to it until a search finds it; a gate is
learnt by trying it. A step that leaves the party where it stood with no screen shown since is a
block: the plan is made afresh, and at the third block the goal goes ("The lane is shut to me."),
its square left in `Pilot.shut` for the explorer (#718). With no way seen it says "No way to the
lane that I have seen." and drops the goal. A goal is reached by standing on it or by the step onto
it, when that step takes an exit or opens a visit. A brain that wants the nearest of many squares
asks `routeLengths` once, for the length of the route to every square it can reach. A square left
in `Pilot.shut` is gone round until the explorer takes it back to try it again.

## The explorer

`explore` (#718) makes a way where the navigator has none seen. With no goal walked it takes, in
order: a way found shut that the company may open now, a locked door once a key is carried or a gate
once a flag has been set since it was found shut ("Trying a shut way again."); the nearest square of
the frontier by the route's length, a seen square the company can stand on with an unseen square
beside it ("Looking about Helmstow."); and, the frontier spent, the nearest wall it suspects, a wall
with seen floor on both sides, searched once from each side (`Pilot.searched`) from the square
before it ("Searching the wall."), so a secret door whose far side is unseen is not found (decision
17). Then it says "Helmstow is walked out." and gives no key, and says it again with no search
until something it rests on changes. It
explores the map it is on, or `Pilot.prefer` (the strategist's, #720) where that is this map or a
zone of it. Outdoors it keeps to one zone's box, the party's or the zone preferred, and never goes
into a zone whose band, as Known gives it, starts above the company's level and one, unless that zone
is preferred ("Callow Downs is too hard for us yet." in such a zone). Of a zone preferred with nothing
seen near it, it says "No way to Thornmark that I have seen.": bringing the party nearer is #720's.

## The files

| File | Owns |
|---|---|
| `src/game/pilot/pilot.ts` | `Pilot`: on and off (`toggle`), a stop of its own (`stop`), the tempo and the pace, the why line and what the band shows (`band`), the corpus heard (`hear`, `forget`), the next key (`next`), the navigator's goal, plan and squares found shut (`goal`, `plan`, `shut`), the explorer's walls searched and the map preferred (`searched`, `prefer`) and `BRAINS`: the brains in the order asked (fight, keep, aims, route, explore, talk), each slot absent until its module lands |
| `src/game/pilot/known.ts` | `Known` and `knownOf`, the fair view; `fair`, a feature as the party knows it |
| `src/game/pilot/route.ts` | the navigator (#717): `Goal` (with the why line its brain gives it), `routeOn` (the keys over one map), `routeLengths` (the length of the route to every square, in one search), `routeNearest` (the nearest of a set of squares, the search stopped there), each round the squares found shut it is given, `routeMaps` (the exits from map to map), the brain `route` and `unroute` (what it kept of a goal, forgotten); it reads a cell by `passableCell` (`src/game/map.ts`) and the groups as the automap marks them (`markedGroups`, `src/ui/frame.ts`) |
| `src/game/pilot/explore.ts` | the explorer (#718): `frontier` (seen squares with an unseen one beside them), `suspects` (walls with seen floor on both sides) and the brain `explore`; a zone's box and band it reads through `Known.box` and `Known.band`, and the zone a square lies in by `zoneAt` (`src/game/map.ts`), as the world map draws the boxes |
| `src/game/ink.ts` | `drawnCell`: what a cell is drawn as, which the view, the automap and Known share |
| `src/game/bot.ts` | the fight and the rest rule (`botTurn`, `asSeen`, `mustRest`, #714) |
| `src/ui/create.ts` | `randomParty`: the company drawn from a seed |
| `tools/tests/pilot.ts` | the suite `pilot` |

No parameter property, enum or namespace may enter anything a `Game` imports: `tools/tests/lib.ts`
loads the game under plain node, which only strips types (#715, decision 2).

## Decided by delegate

Decided by delegate for #715, each the owner's to overturn:

1. **`drive` makes one tick for each action and none between them.** The issue's doc line says "with a tick of nothing between each" and its body says "`g.update(a)` for each, then `g.update(null)` `settle` times". Built as the body: #717 to #719 count their ticks as `Array(n).fill(null)`, so n actions must be n ticks, and a test that wants a gap writes the `null` itself. The doc comment is reworded to say so.
2. **`tools/tests/lib.ts` imports `Game` outright**, so every suite, `tools/test.ts` itself and the runner's own check load the game's import graph at start, about 0.4 s a process (the table; a full run loads it all anyway). The gain is the guard: a parameter property, an enum or a namespace back in anything a `Game` imports now stops every run at load with the file named, and the docs say nowhere that these are barred. A line for DESIGN §13 or for `docs/PILOT.md` (#716) would say it; not written here, as it is not this lane's. To undo the cost, the two helpers would move to a file of their own that the pilot's suites import.
3. **The suite asserts more than the issue's four**, for the reason under What is built. Each added check is content-free (no map, group or door but Harrow's start and the Foreland's rats that the issue names), so a change of content does not break it.
4. **The declarations sit above each constructor** (`TitleScreen`'s with its other fields, as a method stands between), not first in the class where esbuild used to emit them.
5. **`tools/tests/runner/check.ts` needs no change.** It is 32 lines now (the issue's line 99 is gone) and runs the runner on `./fixture/` with `--dir`, where `FIRST` only orders the suites found, and `game` is not a fixture: the order it asserts, `holds later owing rejects unnamed`, is as before.

Decided by delegate for #714, each the owner's to overturn:

1. **The game's reading is a predicate, the gate's the default.** `botTurn`'s last argument defaults to `asWritten`, so the gate, the harness and every existing call see what they saw and their figures cannot move; the auto-fight passes `asSeen`. A named predicate rather than a boolean: it says which reading a caller takes; #723's omniscient flag can choose between the two.
2. **What the game has seen is read from the fight's log.** The game records an element's work (`CombatState.seen`) and a mending (`CombatState.mends`) and nothing else of a monster's ways, so `asSeen` takes a sweep, a breath, a call or a drain as seen once this fight's log has a line of a monster of that name at it ("Giant sweeps ", "Drake breathes ", "Tallyman calls, ", a "hits" line that drinks or takes spell points). The log is what the player reads, so it is fair as it stands; the resolver and `CombatState` take no new field. It holds for the fight and by name, as `seen` and `mends` hold for the fight and by kind. The new checks pin each line it leans on, so a reworded line fails a test rather than blinding the bot.
3. **A leader is never seen before it falls.** Nothing on the screen marks one and its people break only at the last leader's fall (`morale`), so the game's bot never aims at a leader first.
4. **The clock is read as the gate reads it.** The issue was written before the clock (#748). The story names the Grey Hands at the panel before the fight (MONSTERS §9.3) and the light goes out over it from the first round, so the game's bot aims at the panel first from the start, as `ANSWER.clock` says.
5. **Auto waits `BOT_DELAY` on the finished fight too**, so VICTORY and the loot show for as long as a turn takes before the screen goes, rather than not at all.
6. **The hint stands while auto is on**: in place of SPACE on the finished fight and of ESC BACK on a turn; on the enemy's turn as well, where there was none. P itself is #716's (the epic's Decided 9: the router takes it); in this pull request nothing in the game turns auto on.
7. **`REACH` stays private** in `bot.ts`, as it was in `gate.ts`: only the blast and the burn read it.

Decided by delegate for #716, each the owner's to overturn:

1. **P on the company screen is P on the title.** No game is under way on either, so both start one on a fresh seed with a drawn company (the epic's Decided 11), and the pilot asks no brain on them.
2. **The drawn company** (`randomParty(seed)`, beside the company screen and rolled from the seed as it rolls): six of the ten classes with a mender among them (a cleric, a paladin, a bard or a druid), so the bot's mending and the rest rule have someone to lean on; the hardiest by hit die in the front row, as a player would stand them; a people and one of the screen's twelve names each. The seed alone makes it, so a seed replays (DESIGN §13).
3. **A feature through Known is a fair copy of a `Feature`**, not a type of its own, since #719 reads `k.features` by kind: what only a meeting, a menu or a use shows is blank ('' for words, [] for lists, NaN for a number, {} for a gift) and the rest is gone. A shop's stock and prices, a trainer's top level, an inn's price and a guild's classes, fee and tiers are blanked outright for now, though #719 needs the stock and the top level: #719 adds the memory of what a menu has shown, in `known.ts`, with its own fairness test.
4. **`Known.cell` gives `Inked`, a `Cell` without `ch`**: stripping the legend letter changes the type, so the type says so and no brain can read it.
5. **Known's exits are the automap's**: on seen squares and there now (`World.there`, so an exit not there yet is floor, as it looks), with where each leads and nothing of a gate or its label. A rift keeps where it leads, as an exit does.
6. **A zone map's id names the outdoors it lies in, in one reckoning**: `seen`, `cell`, `features` and `exits` all take and give the outdoors' squares, as `g.world.state` has them while the party stands in the zone, which is what the navigator compares with; its features and exits are those in its box. A goal's square written in the zone's own reckoning goes through `World.locate` before it is compared.
7. **`CombatScreen.instant` stays** beside the pilot's `instant`: the combat tests turn it on and off in the middle of a fight, which a pilot's readonly `instant` cannot do. Either makes the screen's delays count as none.
8. **The corpus is forgotten on a new game or a load** (`Pilot.forget`, called by `Game.newGame` and `Game.loadGame`): a new company has heard nothing, and a loaded one has heard nothing either, as the corpus is never saved.
9. **A stop of its own keeps the band up.** A wipe (`Game.gameOver`) calls `Pilot.stop`, which gives the helm back through `toggle` ("You take the helm.") and keeps "The company has fallen." in the band over the title until the next key (`Pilot.stopped`, cleared by `Game.update` and by P and T in `src/main.ts`); #721's stop at the ending's choice can do the same. When the viewer takes the helm, the band goes at once.
10. **`PILOT 2X`, not `2×`**: the font has no ×.
11. **`Pilot.brains`**, the brains a pilot asks: `BRAINS`, unless a test names its own (#718's asks for route and explore alone).
12. **`drawnCell` moves to `src/game/ink.ts`**, a file of its own rather than `map.ts`, which every content builder shares; `tools/tests/art.ts` and the smoke test's crack sweep import it from there.
13. **A known simplification: features and exits of seen squares are as the world has them now** (`World.present`, `World.there`), not as last seen: a person with an `after`, or a door a flag opens, shows from afar the moment its flag is set, though nobody has looked since.
14. **A zone's band and a goal's map are read once seen; built by the first issue that uses them** (the zone's band by #718's explorer bound, the goal's map by #720's strategist), each with its own fairness test: a zone's band is read once the party has been in the zone or the world map's almanac shows it. `Known` has no member for either yet.
15. **A brain returns null unless the screen it works on is on top**: route and explore only on the ExploreScreen; talk and keep also on the screens they answer. The frame asks every brain whatever is on top, so #717's route, asked before talk, never presses its plan into a choice or a business opened on the way.

Decided by delegate for #717, each the owner's to overturn:

1. **A block is a step that leaves the party where it stood with no screen shown since** (`Game.shown`, the screens put on top), whatever line says why. The issue reads the log's last line against `BLOCK_TEXT` and "The way is closed.", but a gate's own words (`blockedText`) and a failing float say other lines, and a test on the line would miss them and press the rest of the plan out of step. A refused step opens no screen; a step a fight or a visit put back (a flight, `World.flee`; a business left, `World.stepOut`) opens one, so it is no block. The line said is kept as the shut square's `why`; `BLOCK_TEXT` stays private.
2. **The plan is made afresh whenever the party is not where the last key should have left it**: on another map, as the issue says, and after a push or a flight on the same map, which a test of the map alone would miss.
3. **Known gives the groups the automap marks** (`Known.groups`): `world.groupAt` reads every live group, seen or not, which the fair rule bars. The automap's own rule moves into `markedGroups` (`src/ui/frame.ts`) and the automap draws by it, so the two cannot drift. A group out of sight is walked into, as a player would.
4. **Known gives the company** (`Known.party`, in the epic's Decided 1): `routeOn` takes no party, and `partyCan(k.party)` says what the company can cross with its keys and its swimmers and mountaineers, learnt ones among them (#805).
5. **`passableCell` is `GameMap.passable` for a cell given**, so the navigator reads passable's rule on the cell Known inks, never on the map's own, where a secret door is floor. `GameMap.passable` calls it, so nothing in play moves.
6. **A route steps onto an exit or a rift only at its end**: a step onto one leaves the map, and the next plan would come straight back.
7. **To another map, the nearest seen exit to the first map of `routeMaps`'s way**, not only the first exit found: Harrow's road has its exits in pairs, and an exit out of reach would give "No way" while its twin is open.
8. **`routeMaps` takes maps as played and follows every exit Known gives**, as `Known.visited` and an exit's `to` give them; the brain places a goal written in a zone's reckoning with `World.locate` (decision 6 for #716) before it compares or routes. The issue's test that a map is visited is Known's own in the fair game, where a map not walked has no square seen, so it is not repeated; the omniscient run (#723) can then go through a map not yet walked.
9. **The tide and Walk on Water are not read**: `partyCan` alone, as the issue says. Tidal ground is read at low water, `passable`'s own default, and a step the tide refuses is a block like any other.
10. **The why line's second line is the log's last line since the goal was set, cut at a word with '...'** to the band's width: the band does not wrap, and a line of the log may run to three.
11. **Taking the helm back drops the goal and its plan; a new game or a load drops them and the squares found shut too**: the viewer may walk anywhere, and a new company is bound nowhere.
12. **`drive` gives a tick of nothing to the pilot**, as `src/main.ts` does (`tools/tests/lib.ts`): the issue's walk drives sixty nulls with the pilot on, which pressed nothing before. A game with no pilot ticks as it did.
13. **What the navigator keeps between keys lives in `route.ts`, by the goal's square and not the goal**, as a brain asked before it may set an equal goal afresh each tick: the blocks on it, the lines said since it was set and the last key, in a `WeakMap` by pilot, so `Pilot` gains only the issue's `goal`, `plan` and `shut`. It goes with the goal, and with the helm, a new game or a load (`unroute`).
14. **A goal is reached by standing on it or by a step onto it that went through**: one that left the party's square (an exit's square, which takes the party away) or opened a screen there (a business's door, whose visit puts the party back before the door). It is looked for before the screen test, so a visit opened on the goal ends the goal under its menu.
15. **`routeLengths`, the length of `routeOn`'s route to every square in one search**, for the brains that want the nearest of many squares (#718's frontier, #719's businesses), where a `routeOn` for each would search the map once a candidate.

Decided by delegate for #718, each the owner's to overturn:

1. **The frontier leaves out the squares a step never stands on**: an exit's, a rift's and a business's door (a feature with an `interior`). A step onto one takes the party away or puts it back before the door, so what lies beyond is never seen from it and the explorer would go back to it for ever. A square off the map is no unseen neighbour.
2. **Outdoors the unseen square lies in the zone's box, and the frontier square may stand just outside it**, as the way in: so a zone preferred is looked into from the seen squares beside it, and the party's own zone keeps to its box.
3. **"The frontier is empty" is read as "no frontier square the route reaches"**: a square seen across a wall or beyond a gate found shut is frontier but cannot be reached, and would keep the explorer from the walls for ever.
4. **A suspect is a cell Known inks a wall** (`solid: 'wall'`, a secret door among them), never a building, a tree, rock or a mountain: outdoors a line of trees or rock one thick between two seen floors is everywhere, and a door hidden there is drawn as what it hides among, so it is the hint chain's to find (#720, #723).
5. **One search a side**, as the issue keys `searched` ("map:x,y,f"). A company with no elf, gnome or keen eyes finds a door one search in two (`World.search`), so it may miss one after its two; searching again would cost ten minutes for every wall that hides nothing.
6. **The explorer presses the navigator's first key itself.** Asked after `route`, a goal set and null returned would lose a tick and show "Nothing to do." between; a goal carries its own why line (`Goal.why`, new), "Looking about Helmstow." or "Searching the wall." in place of "Bound for <name>.".
7. **A why line a brain said stands when no brain gives a key** (`Pilot.next`): the frame said "Nothing to do." over it, so "Helmstow is walked out." would never have shown. "Nothing to do." is said when no brain spoke that tick.
8. **A square found shut is gone round by the navigator until the explorer takes it back** (`routeOn`'s and `routeLengths`' new last argument, which `route` fills from `Pilot.shut`): else a frontier square seen beyond a gate is routed through the gate again and again, three blocks a time, and filed in `shut` each time.
9. **A gate is tried again once a flag has been set since the explorer first saw it shut**: the flags counted then are kept in `explore.ts` by entry, so `Pilot.shut` keeps #717's shape. Any line but a locked door's is read as a gate's, the tide's and a failing float's among them.
10. **A locked door is a frontier square once a key is carried** (`passableCell` reads `unlock`), so the frontier takes the company to it unasked. The navigator files no locked door in `shut`, as it routes into none without a key; the first rule's locked clause serves an entry filed otherwise, as the test files one.
11. **A zone's band is read once the party has set foot in it** (`Known.band`: `WorldState.zones`, as the almanac and the world map's foot show it there), a town's or a dungeon's once visited. A zone not yet set foot in has no band known, so nothing bars it; the world map's plates show a town's or a dungeon's band from the start, a reading #720 may add.
12. **"Never entered" is read as "never the explorer's goal"**: no frontier square or wall in a zone too hard is goaled unless the zone is `prefer`, and in such a zone itself the explorer says "<Zone> is too hard for us yet." and gives no key, for #720 to take the party out. The navigator's way to a goal may still cross a corner of another zone; it knows no bands.
13. **`prefer` counts where it is this map or a zone of it**; elsewhere the explorer explores here, and bringing the party to it is #720's. Of a zone preferred with nothing seen near it, the explorer says "No way to <zone> that I have seen." rather than that it is walked out.
14. **`Known.box`, new**: a map's bounds, as the automap draws a map whole, and a zone's box, as the world map draws it, and nothing else of either. `suspects(k, map)` takes no `g`, so its bounds come through Known; the box's test fails if the zone itself, with its secrets and encounters, comes back.
15. **The frame's and the navigator's tests that turn the pilot on and lean on `BRAINS` now name their brains** (none, or `[route]`): with the explorer among them, a walked goal's test would see it walk on after arrival. Their checks are as they were.
16. **A new game or a load forgets the walls searched and the map preferred** (`Pilot.forget`); the helm taken back keeps both, as a wall searched stays searched.
17. **A suspect is a wall with seen floor on both sides, as the issue says, so a dungeon's secret door whose far side is unseen is not found by this explorer.** Of the 21 dungeons with a secret door, 8 were walked out at review (`[route, explore]`, their groups put down): the door was a suspect on 1 of the 8 (tide_ship3); on mill, greywater1, greywater2, berth, grove1, grove2 and smugglers_cove2 its far side was never seen, 3 to 63 squares staying unseen behind it, while 9 to 78 walls hiding nothing were searched (mill's 78, thirteen hours of the game's time). Only 7 of the 21 stand at a corridor's dead end. Not widened here: left for #720 and #723.
18. **A map walked out stays walked out until what that rests on changes**: the squares seen (`Known.seenCount`, new: the automap's bits counted), the flags, the squares found shut, the party's square and facing, its map, the zone looked at, the company's level and what it can cross. Till then the explorer says so again with no search: with the whole outdoors seen a search took a quarter of a second, and it ran every paced tick. Each search stops at the first square it wants (`routeNearest`, new), where `routeLengths` searched every square seen.
