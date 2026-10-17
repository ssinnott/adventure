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

Built so far: the frame (#716) over the bot's fights (#714), the navigator (#717), the explorer
(#718), the quartermaster (#719), the strategist (#720) and the first part of talk (#721): people,
choices, crossings, guilds, spells and prestige trainers, and the stop at the ending's choice. Its
second part takes the riddles: until it lands the pilot stands under a statue's riddle.

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
  brain gives a key or says why, it says "Nothing to do."; a brain that gives no key may still say
  why ("Hurt, and no gold for a room.", #719; "Helmstow is walked out.", #718).
- It stops by itself at a party wipe, saying "The company has fallen.", and at the ending's choice,
  saying "The choice is yours." (#721). Nothing else is the viewer's to say. A stop of its own keeps
  the band up with its why line until the next key; when the viewer takes the helm, the band goes at
  once.
- **Attract mode** (#722): a title left untouched for 45 seconds plays a new game on the pilot, as P
  on the title starts one, with nothing saved; any key, or a tap on the canvas, brings the title back
  (below).

## Attract mode

`TitleScreen` counts the ticks of nothing it is given (`idle`) and at `IDLE_TICKS`, 60 × 45, calls
`Game.attract`; any key it is given takes the count back to 0, and the charter on top of it stops
the count (only the top screen is updated). `attract` starts a new game as P on the title does, by
the one code path (`Game.newRandomGame`: the seed picked first with `freshSeed`, the company drawn
from it with `randomParty`, then `newGame`, so the seed replays the game, DESIGN §13), puts the pilot
at the helm and sets `Game.attracting`. The band reads "The pilot plays." and "Any key for the
title." for the first three seconds over the pilot's own lines, and after them the pilot's first line
over "Any key for the title." for as long as the game plays (`Game.band`, `ATTRACT_HOLD`). A Game
with no pilot has nothing to start: its title counts and does nothing.

`attracting` lives on the Game outside the save, which stays at version 5. While it is on,
`saveGame` is a no-op (the save in storage is never written, an existing one left as it is) and the
game has no sound to mute: nothing outside `src/lib` imports the engine's audio, which a test keeps
true. The wake is in `Game.update`: a key that finds the pilot off brings the title back
(`TitleScreen(hasSave)`, `attracting` off, the text mode off) and is dropped. The pilot's own keys go
through `Game.update` too, but `src/main.ts` takes the helm before a viewer's key reaches the game,
so a key that finds the pilot at it is the pilot's. A tap or a click on the canvas pushes `cancel`
while `attracting` (a line of main.ts), as the game takes no other touch. P and T are main.ts's,
taken before the game sees them: P pauses the show, saying so ("Paused. P plays on, any other key
for the title."; a fight's hint reads "ANY KEY FOR THE TITLE") and starts it again, T sets its tempo.
A stop of its own keeps its band up over the game, still attracting, and the next key wakes as any
other. A wipe starts another game on a new seed at once (`Game.gameOver`), the title never shown.

## Fair: Known

Every brain reads the world through `Known` (`knownOf(g)`, `src/game/pilot/known.ts`) and never
through `g.world`, `g.maps` or a `MapDef`, but the world map's own data as the world map shows it
(a place's zone, names, a zone's box; #720, decision 20):

- the automap's bits (`seen`) and the cells of seen squares as the automap inks them (`cell`): a
  secret door is a wall, and no cell carries its legend letter;
- the features the automap marks on seen squares (no event, nothing absent or spent), each a fair
  copy: its kind, square, id and the name its hint shows. A statue's riddle and answer, a person's
  words, question, crossings and hand-ins, a shop's stock and a trainer's top level (until their
  menus show them, below) and what a chest holds do not come through: words are '', lists [], a
  number NaN;
- what a business's menu has shown (#719): a shop's wares and their prices once its Buy list is on
  top, a trainer's top level once its menu says it ("I train to level 6."), each against the
  business's square and noted at each look (`knownOf`), for the company that saw it: a new game's or
  a load's has seen none;
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
  squares of a map are seen (`seenCount`, #718);
- the journal's goals (`goals`, #720): each open quest's goal as its page shows it and the map that
  goal is done on (`goalMap`, `src/game/quests.ts`), and no goal or map the log has not shown; and
  the zones set foot in (`zones`), as the almanac has said them;
- the crossings told (`offers`, #721): each seller's square, the route's name, the fare its menu
  showed and where it lands, once `Game.offer` has opened the seller's menu (`Pilot.offers`): the
  pilot has then been told. A person's crossings are never read before.

A zone map's id (a goal's map may be one) names the outdoors it lies in, in one reckoning: every
reader takes and gives the outdoors' squares, as `g.world.state` has them while the party is there,
and its features and exits are those in the zone's box. A goal's square written in the zone's own
reckoning goes through `World.locate` first. Features and exits of seen squares are as the world has
them now, not as last seen. The headless run's `omniscient` pilot (#723) has every square seen; the
game never sets it.

Each reader came with the first issue that used it, and its own fairness test: a goal's map is
read once the journal shows the goal (#720); a crossing once its seller has offered it (#721).

## Brains

The brains (`BRAINS`, each `(g, k, p) => Action | null`) are asked in order on every paced tick,
whatever screen is on top, and the first key given is pressed. A brain returns null unless the
screen it works on is on top: route and explore only on the ExploreScreen; talk and keep also on the
screens they answer. The order is keep, talk, aims, route, explore (a fight is the frame's): the
company's needs outrank its meetings, and those its wandering; a brain either presses a key or sets
`Pilot.goal` and returns null, so that route presses it. The explorer, asked after the navigator,
speaks only when no goal is walked, and a goal it sets it walks at once, asking `route` for the first
key itself. Talk walks its goal to a person so, every key of it, or the strategist would set its own.

## The navigator

`route` (#717) walks `Pilot.goal`, a square and the name the why line gives it ("Bound for the
lane."), one key a call with the map on top: `forward` and the turns, never `back` or a strafe, so
the party faces where it goes. Its routes go breadth-first over the squares Known has a cell for that
the company can cross, round the groups the automap marks and onto an exit, a rift or a business's door only at the end (#720); from map
to map they go by the exits seen. A secret door is a wall to it until a search finds it; a gate is
learnt by trying it. A step that leaves the party where it stood with no screen shown since is a
block: the plan is made afresh, and at the third block the goal goes ("The lane is shut to me."),
its square left in `Pilot.shut` for the explorer (#718). With no way seen it says "No way to the
lane that I have seen." and drops the goal. A goal is reached by standing on it or by the step onto
it, when that step takes an exit or opens a visit. A brain that wants the nearest of many squares
asks `routeLengths` once, for the length of the route to every square it can reach. A goal may carry
the brain's reason, which the why line gives after the place: "Bound for the Chapel of the
Lanterns: Idris is dead." A square left in `Pilot.shut` is gone round until the explorer takes it
back to try it again.

## The explorer

`explore` (#718) makes a way where the navigator has none seen. With no goal walked it takes, in
order: a way found shut that the company may open now, a locked door once a key is carried or a gate
once a flag has been set since it was found shut ("Trying a shut way again."); the nearest square of
the frontier by the route's length, a seen square the company can stand on with an unseen square
beside it ("Looking about Helmstow."); and, the frontier spent, the nearest wall it suspects, a wall
with seen floor on both sides, searched once from each side (`Pilot.searched`) from the square
before it ("Searching the wall."), so a secret door whose far side is unseen is not found (decision
17). Then it says "Helmstow is walked out." and gives no key, and says it again with no search
until something it rests on changes. It explores the map it is on, or `Pilot.prefer` (the
strategist's, #720) where that is this map or a zone of it. Outdoors it keeps to one zone's box, the party's or the zone preferred, and never goes
into a zone whose band, as Known gives it, starts above the company's level and one, unless that zone
is preferred ("Callow Downs is too hard for us yet." in such a zone). Of a zone preferred with nothing
seen near it, it says "No way to Thornmark that I have seen.": bringing the party nearer is #720's.

## The quartermaster

`keep` (#719) keeps the company fit to fight. `need` names the most urgent of its needs (`needs`
gives them all, in order): the temple with one dead or stone; rest when the harness's rule trips
(`mustRest`) over those standing; food under two rations a head; training for one ready whom it can
pay for; and gear while a shop seen holds something better. It takes the needs in turn and acts on
the first it can meet. Tired, it rests where it stands when no group is too near (`restRefused`, the
game's own refusal) and there is a ration each, or takes the room when it stands at an inn's door;
else, for any need, it sets the navigator's goal on the nearest place seen that meets it (a camp
before an inn for rest) and goes in. With no need it can meet, a well within six keys is drunk from
when one standing is under half and no group is marked near; one that restores nobody is not gone
back to. With needs it can meet none of, the band says the most urgent and why not: "Hurt, and no
gold for a room."

In a business it answers the menus by their rows as they show, `down` to a row and Space: the trade
on the first menu, then Leave; at an inn the night while tired and rations while short; at a temple
each member it can pay for, the dead first, then the stone, then the rest; at a shop Buy, then in the list rations
while short and, for each member, the best it can wear (`better`, one thing each a visit); at a
trainer each row that offers training. Nothing is sold and no skill is learnt. What it bought it
wears through the sheet: `inventory`, `right` or `left` to the member, `down` to the item (the pack
listed first, then the bag), Space, then Esc. The reserve, 100 gold a level of the highest in the
company (the most a temple asks to raise one), is kept back from gear alone: `better` spends only the
gold over it (`spare`). A shop whose wares it has not seen is looked at when the gold over the reserve
is as much again as the reserve. A place gone to for a need that took no gold is not gone to again
for it until the gold moves or the need goes.

## The strategist

`aims` (#720) says what the pilot is for (`Pilot.aim`, chosen by `chooseAim`): the one quest's goal;
else a side or seeking quest's, the nearest first; levelling in the nearest zone it can, to the level
under the goal's zone's floor, where that zone's band as Known gives it starts above the company's
level and one ("Levelling in the Foreland to 4."); else walking the land ("Walking the Keep."). To a
goal's map it goes by the exits seen ("Bound for Callow Downs: Ashcombe is past Gullwick..."), else
by the zones between, and there it hands the map to the explorer (`Pilot.prefer`); it opens a chest
it stands on and goes to one seen there; walked out, it walks the place again end to end, so that the
days pass. Three days of the world's on one goal with no change in its words, it says "Lost in the
Foreland: three days, and no way on.", gives the goal up (`Pilot.lost`) and turns to the next aim;
three days levelling with no level gained, "Three days in the Foreland, and no stronger."; either is
tried again once anyone gains a level or a flag is set. Over a line into a zone too hard for the
company that its aim is not in, it turns back to the square before the line, once a crossing ("Too
strong for us yet: back."). It meets nobody: a chapter begins and moves on by words that are talk's (#721).

## Talk

`talk` (#721) is everything the pilot says to anyone. With no goal walked it goes to the nearest
person seen who is due a meeting, within twelve keys of route or anywhere on the aim's map, or to a
guild's hall so ("A word with Hild."), and steps onto them: the game talks on the step. Due is never
met, or met before the company last set a flag or gained an item (`Pilot.met`, by square), so a
hand-in is made once the item is carried and words that wait on a flag are heard. On a menu it
answers by `pick`'s rules, `down` to the row and Space, or Esc: a crossing's seller, the route that
is the navigator's way, and its terms while the gold over the reserve pays; the rest offered, as the
quartermaster rules it; a guild's offer of work, taken; a den, burnt; a group's question, the first
answer open that is not the fight, else the fight; a prestige, the first rise the trainer's menu
leaves open; a guild's hall, its fee and the costliest spell for each member over the reserve, one a
visit; its work, each offer once a visit; a business's first menu, the hall's spells, the guild's work
and the people in the room once a visit, then Leave (the quartermaster's trade comes first); a
person's question, the first answer open that is no way out and shows no price, else the cheapest
priced within the gold over the reserve; any other menu, its way out. A seller's crossings, once
offered, are the navigator's edges (`routeMaps`), from the seller's square to where it lands. The
ending's question is marked (`ChoiceScreen.ends`): talk neither picks nor answers it, but stops the
pilot under it ("The choice is yours."). Riddles are its second part.

## Known limits

- **Survival.** On seeds 1 to 12 of the shelf's first chapter with the standard party only 2 finish
  (seeds 8 and 10): falls are lost fights at level 1 on the Foreland's east side to groups one or two
  levels up (4 Shore Crabs, 3 Smugglers with a Bowman, 3 Bandits with Archers) at 54 to 100% hp; the
  sorcerer fights with 0 to 4 of 10 spell points because `mustRest` pools the company's sp; later
  falls come walking to the net loft with members already at 0 hp (it rests late and far);
  `Game.fight` takes every adjacent group (11 and 12 at once); gold is not the cause. A dedicated pull
  request (#723's first part) addresses survival. `headlessGame` gives every seed the same party, so a
  random party is not yet played.
- **Meetings in a town.** Every flag set or item gained sends the pilot back round the people near it
  (talk's rule, as the issue has it): at review, on seed 4 it spent ticks 167 to 617 in Helmstow on 24 meetings
  with nine people, Aldith and Hob five times each.

## The files

| File | Owns |
|---|---|
| `src/game/pilot/pilot.ts` | `Pilot`: on and off (`toggle`), a stop of its own (`stop`), the tempo and the pace, the why line and what the band shows (`band`), the corpus heard (`hear`, `forget`), the next key (`next`), the navigator's goal, plan and squares found shut (`goal`, `plan`, `shut`), the explorer's walls searched and the map preferred (`searched`, `prefer`), the strategist's aim, since when, its goal's words and the goals given up (`aim`, `aimSince`, `aimGoal`, `lost`, #720), the people met and the crossings told (`met`, `offers`, `told`, #721), whether it asks talk (`talks`) and `BRAINS`: the brains in the order asked (fight, keep, talk, aims, route, explore) |
| `src/game/pilot/known.ts` | `Known` and `knownOf`, the fair view; `fair`, a feature as the party knows it; what a menu has shown (`wares`, a Buy list's; `trainsTo`, a trainer's top level; #719); a map's or a zone's bounds, a place's band and the squares seen, counted (`box`, `band`, `seenCount`, #718); the journal's goals with their maps and the zones set foot in (`goals`, `zones`, #720); the crossings told (`offers`, #721) |
| `src/game/pilot/keep.ts` | the quartermaster (#719): `needs` and `need` (what the company needs, the most urgent first), `better` (the best a member can wear for the gold), `restWanted` (the rest offered taken, talk's rule 2 too), `reserve` and `spare` (from `purse.ts`) and the brain `keep` |
| `src/game/pilot/purse.ts` | `reserve` and `spare` (#719): what the quartermaster keeps back and the gold over it, read by the quartermaster, talk and the navigator (#721) |
| `src/game/pilot/talk.ts` | talk (#721): `pick` (the row to answer a menu with, or -1 for Esc), `NEAR` (the keys a person may be off) and the brain `talk`, with the meetings; what it keeps between ticks (its goal, the stamps of the people met, the crossing chosen) it keeps by pilot (`untalk` forgets it), and what it opened in a visit by the visit |
| `src/game/pilot/aims.ts` | the strategist (#720): `Aim`, `chooseAim` (what the pilot is for), `LOST_MINUTES` (the lost rule's three days) and the brain `aims`, with the lost rule, the band rule, the chests and the walk again; what it keeps between ticks (the zone and square of its last look, the goals lost at what level, the places walked out) it keeps by pilot (`unaim` forgets it) |
| `src/game/quests.ts` | `goalMap` (#720): the map a quest's shown goal is done on, read back from the goal |
| `tools/walk.ts` | `pilotPlays` (#720): a chapter played from a new game by the pilot alone, every brain asked, until its end or the point a play names, on a seed it may name (#721) |
| `src/game/pilot/route.ts` | the navigator (#717): `Goal` (with the reason or the why line its brain gives it), `routeOn` (the keys over one map), `routeLengths` (the length of the route to every square, in one search), `routeNearest` (the nearest of a set of squares, the search stopped there), each round the squares found shut it is given, `routeMaps` (the exits from map to map, and the crossings told whose fare the gold over the reserve pays, `edges`, #721), the brain `route` and `unroute` (what it kept of a goal, forgotten); it reads a cell by `passableCell` (`src/game/map.ts`) and the groups as the automap marks them (`markedGroups`, `src/ui/frame.ts`) |
| `src/game/pilot/explore.ts` | the explorer (#718): `frontier` (seen squares with an unseen one beside them), `suspects` (walls with seen floor on both sides) and the brain `explore`; a zone's box and band it reads through `Known.box` and `Known.band`, and the zone a square lies in by `zoneAt` (`src/game/map.ts`), as the world map draws the boxes |
| `src/game/ink.ts` | `drawnCell`: what a cell is drawn as, which the view, the automap and Known share |
| `src/game/bot.ts` | the fight and the rest rule (`botTurn`, `asSeen`, `mustRest`, #714) |
| `src/game/items.ts` | `hits`, a weapon's mean blow: the harness's measure, moved here for `better` (#719) |
| `src/ui/create.ts` | `randomParty`: the company drawn from a seed |
| `src/ui/screens.ts` | `ChoiceScreen`'s `title`, `disabled` and its marks (#721): a group's refusal (`fight`, by `Game.parley`) and an ending's question (`ends`, by `Game.ask`, `endsIn` in `src/game/stones.ts`) |
| `src/ui/title.ts` | `TitleScreen` and attract mode's idle: `IDLE_TICKS`, the ticks of nothing counted on the title (#722) |
| `src/game/game.ts` | what the pilot leaves on the `Game`: `pilot`, `attracting`, `newRandomGame` (P on the title's and attract mode's start), `attract` and its wake in `update`, `band` (the band over the view: the pilot's, with attract mode's opening lines and the way out), the no-op `saveGame` and the wipe's restart in `gameOver` (#722) |
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
15. **A brain returns null unless the screen it works on is on top**: route and explore only on the ExploreScreen; talk and keep also on the screens they answer. The frame asks every brain whatever is on top, so #717's route, asked before talk, never presses its plan into a choice or a business opened on the way. (Talk is asked before route now: superseded in that by #721's decision 2; the rule stands.)

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
7. **A why line a brain said stands when no brain gives a key** (`Pilot.next`), the call #719 made too (its 15): the frame said "Nothing to do." over it, so "Helmstow is walked out." would never have shown. "Nothing to do." is said when no brain spoke that tick; of two that spoke, the first stands, as the most urgent brain is asked first, so the quartermaster's want outlasts the explorer's "walked out".
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

Decided by delegate for #719, each the owner's to overturn:

1. **The needs are taken in turn and the first that can be met is acted on** (`needs`, whose first is `need`): a dead member the company cannot pay to raise, or no temple seen, does not keep the living from resting, eating or training.
2. **The reserve is kept back from gear alone.** The issue's own rules spend the whole purse at the temple (which the reserve is for), at the inn ("gold allows") and at the trainer (`party.gold >= trainPrice(c)`). `better`'s `gold` is the net gold, the gold over the reserve (`spare`): its signature has no company to reckon the reserve from, and the issue's figures hold (420 gold buys the 120-gold long sword over a reserve of 300; 400 does not).
3. **A shop whose wares are unseen is looked at when the gold over the reserve is as much again as the reserve**, 100 gold a level of the highest, the threshold the review suggested; `better` judges only wares a menu has shown. In the same way a trainer whose top level is unseen is gone to, to read it, where the issue says `maxLevel >= c.level + 1`: Known blanks it till its menu shows it, so by that rule alone nobody would ever train.
4. **`better` weighs a weapon by `hits` and armour or a shield by the armour class it gives worn (`armorClass`), the larger gain first, then the cheaper**: the issue gives no rate between a point of blow and a point of AC. A weapon keeps the kind held, ranged or not, as the harness's `outfit` does; none two-handed goes to one with a shield on; a monk's AC is reckoned with the robe's bonus that armour loses, so armour is bought for one only where it betters that.
5. **What a menu has shown is kept by company** (a `WeakMap` by the `Party` in `known.ts`), not on `Pilot`, which gains no field: a new game's or a load's company has seen nothing, as with the corpus. It is noted at each look from the screen alone: a Buy list's rows (an item's name, unique in the item table, and the price shown) and a trainer's words, which name its top level outright where its rows say only who is ready.
6. **At an inn's door the room is taken, not a rest in the street**: the issue's test stands the company there with its rations, and a night at an inn counts its nights (`stayNight`). Elsewhere a rest where it stands comes first, as the issue has it.
7. **A camp is gone to for rest only with a ration each**, which a camp's rest eats as any rest does; without them, the inn.
8. **The why line on the way is the navigator's, with the reason**: `Goal` gains `reason`, so route says "Bound for the Chapel of the Lanterns: Idris is dead." (the epic's Decided 3 form). The issue's "To the <feature name>: <need>." stands where it goes in on the spot; where route walks, route's line takes its place in the same tick. The need is said in the game's voice ("a night's rest", "Idris is dead", "a look at the stock"), not by its name, and route cuts the line to the band's width, as the second.
9. **A place gone to that took no gold is not gone to again for that need until the gold moves or the need goes** (#717's review: no same goal until the need returns). A goal of its own holds while its need does, unless a rest where it stands or a more urgent need can be met, so a place of the same need found nearer on the way does not turn the walk.
10. **A well is for one standing under half, six keys of route off at most** (turns count, as in `routeLengths`), **with no group marked near**, and only when no need can be met: after a rest where it stands, as the issue orders its rules (a well asked first walked eight keys to Harrow's well, which restores nothing, before the rest). Most wells restore nothing and the fair copy has no `heal`, so a well gone to that left one under half is dry, and not gone back to.
11. **`restRefused` is read as the issue says.** It is the game's refusal, the one thing a press of R would learn ("Too dangerous to rest here."), though it counts every live group near, seen or not; pressing R and reading the log would be as fair and cost a line in the log.
12. **No skill is learnt.** The delegate's ruling let Mountaineer and Swimmer be bought over the reserve and need not be; the simpler is taken and the business menu's `Learn a skill` row is left. These tests cross nothing; whether the one quest asks either is the strategist's and the full run's to show (#720, #723).
13. **The first menu's trade is opened again only after the last opening spent gold**, so a trade that can do nothing (a room the company cannot pay for) is not opened twice; then the quartermaster picks Leave. Talk (#721) may want the `Talk to` rows before it.
14. **Training wants one standing**, as the trainer's own rows do; a shop's rations are bought only while under two a head, at the price shown; nothing is sold and what a chest gives is not worn (only what was bought), a want left for later.
15. **The frame keeps a line a brain said with no key** (`Pilot.next`): "Nothing to do." only when no brain said why that tick. So the quartermaster's want stands, the most urgent need it cannot meet and why not ("Hurt, and no gold for a room."), where it stood "Nothing to do." for as long as the want lasted; and the navigator's "No way to ..." and "... is shut to me." show for the tick they are said.


Decided by delegate for #720, each the owner's to overturn:

1. **The chapter waits on talk from its first word, so the shelf's play stops at the keep.** The Quiet Farm begins with Vask's hire, a word at the keep's door (a business's door, which the explorer never steps on), before the journal shows any goal; then Hild at Gullwick and the wand handed in at the keep are words too. So `pilotPlays(ok, CHAPTER, { visited: 'keep' })` plays a new game with every brain to the keep, where Vask's door is seen (1,124 ticks, about 2 seconds), and `holds(CHAPTER.done)`, `pilotPlays`'s own default, is #721's to meet: it drops the third argument. The goal that needs #721 is the hire ("The Regent-Warden is hiring", the opening's line), and with it every goal of the chapter. (Superseded by #721's decision 12: the play holds the chapter's end.)
2. **A question on top stops the pilot until talk lands.** No brain yet answers a person's or a den's choice, and the strategist acts only with the map on top (#716's review): a new game's pilot steps onto Wulfric, the keep's armourer, at about tick 1,160 and stands under his menu of prestiges; a company hired by hand walked from the keep through Helmstow and the Foreland into Callow Downs, and stood under a choice there within 10,000 ticks.
3. **`chooseAim` on `headlessGame(4)` is the quest aim once the company is hired.** A new game's log shows no quest (the one quest is in it once a chapter is begun), so the test walks the company onto Vask's door, the test's privilege as `world.travel` is the issue's, and checks that before the hire the aim is to walk Helmstow.
4. **Known gains `goals` and `zones` but no second band.** A goal's map comes only from the goal the journal shows (`goalMap`), and its test fails if any other goal's map comes through; a zone's band is #718's `band`. The log is worked out afresh only when something it reads has moved (`logKey`), as the strategist asks for it every tick: `questLog` was the run's largest cost.
5. **"A level gained" is anyone's.** The issue's test levels one member, which moves the company's level (the mean, rounded down) not at all, so a lost goal keeps the members' levels summed and the flags counted when it was given up.
6. **The aim is chosen anew on more than its goal's words**: also when its zone's band is learnt too high (on the crossing) and a zone to level in is known, when the level is reached, when a quest's goal comes to a company walking the land and when the place walked is walked out. On the words alone a zone learnt too hard would never turn to levelling.
7. **A map's zone is the built zone map**: a zone map's own id, or a town's or a dungeon's home map (`homeMap`), whose band the crossing line and the almanac give (`Known.band`); the atlas's zone has a planned band no screen shows. The lost line names the world map's area (`areaOf`): "Lost in the Foreland".
8. **Walking the land (the issue's rule 4) goes on past the maps visited**: the party's map or zone until walked out; then a town's or a dungeon's own doors to a map not visited (the keep's gate from Helmstow); then the nearest map visited or zone set foot in not walked out; then a zone not set foot in beside one that was; then any exit seen to a map not visited. "The nearest visited map with a frontier" alone never leaves Helmstow, as the explorer's frontier leaves exits out (#718, decision 1).
9. **Towards a zone nothing seen leads into, the zones between**: where the explorer says "No way to Callow Downs that I have seen.", the strategist has it walk the zone beside the party's that lies nearest the goal's, then the party's own (#718 left bringing the party nearer to #720).
10. **Walked out, the place is walked again**, to its farthest square seen and back ("Searching Callow Downs again."); where the party is neither on the aim's map nor in its zone, where it stands. A pilot that gives no key stops the world's clock, and the lost rule's three days would never come. It never ends on a person: a meeting is talk's, with a goal to them (#721).
11. **Chests: one stood on is opened, one seen in the aim's place is gone to** ("To the chest."). The issue counts on the chests on the way to move the goal and no brain opened one; the keeper's log at Crowness, in The Quiet Farm's end, is one. Space is pressed once a chest, so one under another feature is not pressed for ever.
12. **The band rule reads the zone changing between two looks, not the crossing's words**: a crossing says nothing where the floor does not rise, and the zone's band is known from the step that set foot in it. The square before the line is the party's at the strategist's last look.
13. **The navigator goes round a business's door and ends on one** (`route.ts`, #717): on the Foreland a plan through the Ellerby Farm's door went into the shop, the visit put the party back before the door, and the plan went through it again, for ever.
14. **The helm taken back drops the aim**, chosen anew when the pilot takes it again; the goals given up stay given up; a new game or a load forgets both, with what the strategist kept.
15. **The quartermaster's test of a need it cannot meet names its brains** (keep, route, explore), as #718 had the frame's and the navigator's tests do (its decision 15): with the strategist asked too, a company with nothing it can meet walks on, so the want does not stand. Its checks are as they were.
16. **The why line**: "Bound for Callow Downs: Ashcombe is past Gullwick: west on the Salt..." (the goal cut at a word by 48 characters), "Levelling in the Foreland to 4." and "Walking the Keep." on the tick the aim is chosen; on the way the navigator's and the explorer's lines take the band, as before.
17. **The play is in the default run**: about 2 seconds of the shelf's walkthrough, so nothing waits on the `fullrun` suite or `FULLRUN` (#723).
18. **A level aim has the lost rule's three days too**: three days of the world's with the company's level unchanged (each level gained starts them afresh), it says "Three days in the Foreland, and no stronger.", puts `level:shelf` in `lost` and clears the aim; tried again once anyone gains a level or a flag is set, as a goal is. Only training raises a level, and a company that has seen no trainer would level for ever (the review's probe fought 25 fights in six days at level 1 and fell). A goal whose zone is too hard with no zone left to level in is passed over, as a goal lost is, so the land is walked and a trainer found.
19. **The band rule turns back once a crossing**: over the same line again with no level or flag gained since, the party goes on, so a route that clips a corner of a hard zone (#718, decision 12) does not go to and fro for ever. A crossing that leads on into the hard zone is then ended only by a quest's or a level aim's lost rule.
20. **`aims.ts` reads the world map's own data (the atlas: a place's home zone, names, a zone's box) directly**: it is what the world map shows; it never reads a map's cells, groups, secrets or gates.
21. **`goalMap` matches a goal by its words**, as `sought` does: no quest today has two goals with the same words on different maps (237 goal lists scanned: every quest, every chapter and the seeking quests at seven levels), so the match is safe.

Decided by delegate for #721, each the owner's to overturn:

1. **Two parts, as the delegate ruled.** This part is §1 to §5: the people, the choices, the crossings, the guilds and spells and the prestige trainers. Riddles (§6) are the second part's, with Thornmark's `pilotPlays`; until then the pilot stands under a riddle, as before. The stop at the ending's choice (§7) is built here, at the review's asking (15).
2. **Talk is asked second, after the quartermaster and before the strategist** (`BRAINS`: keep, talk, aims, route, explore; #716 planned it last). Asked last it would never set a goal on the map, as the strategist always does; asked before the quartermaster a meeting would outrank a rest. On the map it only sets a goal to a person and walks it, every key of it asked of the navigator itself, as the explorer's first key is (#718, decision 6), so the strategist does not take the map from it on the way.
3. **A person is met by the square** ("map:x,y", the map as played, as the issue keys `met`), and the people in a business with its door: their `Talk to` rows are opened once a visit while the door is due. Due is never met, or met before the company last set a flag or gained an item (the flags counted, and the bag and the packs). The stamp is taken once the meeting is over and the party is back on the map, so the meeting's own flag (a hire, Hild's ask) does not send the pilot straight back. A person goes into `met` only once the step onto them has gone through, not as the goal is set, so the people of a business it goes to are due as the visit begins: once the goal is over, where the party stands on the person's square or faces it (a visit puts it back before a door, facing it) with the meeting shown; a goal given up, or taken by another brain, is no meeting, though a box or a fight was shown on the way. A person stepped onto on another brain's way is met too; one stood on who falls due is spoken to with Space, as the game talks only on the step. Twelve keys of route (`NEAR`) count turns, as the quartermaster's well's six do.
4. **A guild's hall (kind `guild`) is gone to as a person is**: within twelve keys or on the aim's map, and again once due. Nothing else takes the pilot into a spell hall, so §4 would never be met in play. A hall that is another business (the Drillyard, the Wardens') has its work opened on the visits the quartermaster makes: Known shows no business as a hall before its menu does.
5. **`ChoiceScreen` shows its `title` and its `disabled` rows, and carries two marks**: a group's question its refusal's row (`fight`, by `Game.parley`), which the pilot cannot read in the group's own words ("Kill it.", "Refuse."), and a person's question whether an answer would take an ending (`ends`, by `Game.ask`; not the ruling's `ending`, which the smoke test reads as an `EndingScreen`'s, by name). The ruling reads `endingTaken(a, party.flags)`, which holds only once the answer has set the ending's flag, so the mark reads the answer's own flags (`endsIn`, `src/game/stones.ts`). It is built here, as rule 6 would otherwise answer the ending's question with its first answer; the stop under it is decision 15.
6. **Rule 6 is a person's question**: a menu whose title is the name of a person Known shows at the party's square, the one ahead or the business's door. Every other menu has its own rule or its way out (Leave, Not now, Done, Back), else Esc: so the quartermaster's menus have their way out (the issue's test: an inn's menu with no need gives Leave), and no skill is learnt (#719, decision 12).
7. **The quartermaster leaves a business's first menu to talk where the pilot asks talk** (`Pilot.talks`): its trade first, as before, then the guild's work and the people, then talk's Leave. A pilot whose brains are named without talk (#719's tests) leaves as before.
8. **A crossing is taken where it is the navigator's way**: on the seller's menu, the route that is the first hop `routeMaps` gives from here to the goal walked (to the aim's map where none is walked, or where the goal is talk's own, to the seller), read from what `offers` was told rather than by matching a route's name to a place's; then its terms, while the gold over the reserve pays the fare the menu showed. The terms' title is the seller's, not the route's, so the route chosen on the menu is kept for them. Every seller stands in the street today; one in a business would be talked to only while its door is due (3).
9. **A crossing is an edge only while the gold over the reserve pays its fare as told** (`edges`, `src/game/pilot/route.ts`): else the navigator would walk to the seller, talk would say Not now and the two would go to and fro till the lost rule. So that the navigator reads the one rule, `reserve` and `spare` move to `src/game/pilot/purse.ts`, which the quartermaster re-exports (the issue's "import it, do not copy it"), with no import between keep and route both ways.
10. **The reserve is kept from a guild's fee, a spell, a crossing and a priced answer**, as from gear (`spare`); not from a prestige, which the issue has as the first rise the trainer's menu leaves open (its own bar: the level and 1,000 gold).
11. **A spell a member a visit, the costliest the gold over the reserve pays**, read from the hall's list as it shows (the member's name, the spell and the price), the members in the list's order while the gold lasts. A guild's work: each offer opened once a visit and taken (rule 3); the report pays as the row opens; the work taken is in the log, and the strategist walks it as a side quest once the one quest has no goal it can walk.
12. **The shelf's play runs on seed 10** (`pilotPlays(ok, CHAPTER, { seed: 10 })`; the seed is a new option of `pilotPlays`, 4 by default). On #720's seed, 4, the company falls to the shore crabs on the Foreland at level 1, at tick 1,532, before it reaches the keep, so #720's bound to the keep fails too. Of twelve seeds, two (8, 10) play The Quiet Farm to its end, in 14,919 and 14,634 ticks (14,421 for 10 on the final code); the rest fall in fights: at level 1 on the Foreland, before the keep (1, 3, 4, 6, 7: the cliff smugglers, the shore crabs, the coast bandits); at level 3, after the hire and Hild's ask (2, 5, 12 on Callow Downs: the chalk wolves, the crows; 11 on the Foreland: the cliff smugglers); at level 5 in Thornmark, after the wand is handed in and before the keeper's log (9: the brigands). The falls are the bot's fights and the harness's rest rule (#714, #719: a company rests only once one is under a quarter of their hit points), not a word unsaid: a finding for #723's runs. The play is chaotic: a change to anything it meets may move it. A fall on seed 10 is to be fixed, or the play bounded with the fall's issue named; it is never met by choosing another seed. The survival's numbers are under Known limits.
13. **The well is looked for only within six squares** (`drink`, #719): a route is no shorter than the squares between, and the quartermaster searched the whole map every tick while one was under half, a third of a long play's time (30.5 s to 21.2 s on seed 3, as the code then stood). Nothing it chooses moves.
14. **The why lines**: "A word with Hild.", "A word with an old man mending nets.", "To the Lantern Guildhall.", "Taking the work.", "Paying the guild's fee.", "Maren learns Bless.", "Bram rises.", "Passage to Helmstow.", "Burning the den." and, for a person's question, the answer given: "To Ailith: The Chapel, in Helmstow."
15. **The pilot stops itself at the ending's choice now** (§7's stop, at the review's asking): under a question marked `ends` talk presses nothing and calls `Pilot.stop` with "The choice is yours.", the stop of its own that keeps the band up until the next key (#716, decision 9). Standing under it pressing nothing, the band said "Nothing to do."; Esc would have looped, the strategist walking the company back to the person. #721's second part keeps the stop and the mark and builds the riddles; `EndingScreen` is never reached while the pilot drives.

Decided by delegate for #722, each the owner's to overturn:

1. **The pilot's own keys do not wake it: a key that finds the pilot at the helm is the pilot's.** The issue's wake is "any key", but the pilot presses its keys through `Game.update` as well, so its first would have brought the title back within a quarter of a second. `src/main.ts` takes the helm before a viewer's key reaches the game (the epic's Decided 2), so the wake, which lives in `Game.update` as ruled, is a key that finds the pilot off. The tests send a viewer's key as main.ts does (`toggle`, then `update`); with the rule broken they fail.
2. **P and T keep to the pilot in attract mode.** main.ts takes both before the game sees them: P pauses the show (the pilot off, `attracting` on) and starts it again, T sets the tempo, which stays the viewer's. Any other key brings the title back, so "Any key for the title." is true of all but these two. Waking on them is one line in main.ts, the owner's to ask for.
3. **The opening lines are held three seconds over the pilot's own, and the way out stands under its first line after them** (`Game.band`, `ATTRACT_HOLD`). `why` is set as the issue says, but the pilot's first action (a quarter of a second at 1×) replaces it, and the lines would never be read. After the three seconds the band keeps "Any key for the title." as its second line under the pilot's first, whatever its own second was, so that a viewer who comes back sees that it is a show and how to leave it. The pilot plays on under the band; a stop's band is not covered.
4. **P on the title and attract mode share one code path, `Game.newRandomGame`**, which `Pilot.toggle` calls in place of its own two lines (#716, decision 2 stands): the seed first and the company from it, so a seed replays (DESIGN §13) and the two cannot drift apart.
5. **A wipe while attracting starts the next game at once**, as the issue says: no stop, no "The company has fallen." and no title, since nobody is there to read them. The pilot stays at the helm and the opening lines stand again.
6. **A stop of its own is not a wipe.** The ending's choice (#721) stops the pilot as ever, its band up over the game and `attracting` still on, and the next key brings the title back. No game follows the choice: it is the viewer's to make.
7. **The game has no sound**, so there is nothing to mute: nothing outside `src/lib` imports `src/lib/audio`. The suite fails, naming the file, if one does, so that a sound added later is muted while `Game.attracting`.
8. **The title's count is its own**: the ticks of nothing the title is given, reset by any key it is given. The charter over it (New Game) stops the count, and Esc back to the title finds it at 0, the key that opened the charter having reset it. A T on the title is main.ts's and neither resets nor counts. A Game with no pilot counts and `attract` returns, so no test's game idles into anything.
9. **The smoke waits no forty-five seconds**: its title flow is unchanged, as `npm run check` shows. One new step, on the page after the pilot's, starts attract mode with `attract()` and clicks the canvas, then starts it again and presses a key (decision 10).
10. **A tap ends attract mode: one line of `src/main.ts`**, which the issue wanted unedited and the owner's delegate allowed for this. The game takes no touch (the `pointerdown` handler only focused the canvas, and `index.html` sets `touch-action: none`), so on a phone with no keyboard the show would start at 45 seconds and only a reload would end it. The handler now pushes `cancel` while `game.attracting`, which wakes as any key does. The Node suites have no page, so the smoke's step clicks the canvas; with the line removed it fails.
11. **The wake and the restart turn the text mode off.** Only a riddle turns its own text mode off (`RiddleScreen.close`), and the wake drops the screens without a word: with a riddle open (talk, #721, will open them) the viewer's key left the title up with the text mode on, so that Space, the letters, P and T and the digits were typed and F5 reloaded the page. `wake()` and `attract()` (a wipe's restart) set it off, and the checks open a riddle and send a key and a wipe.
12. **P in attract mode says what it does.** "You take the helm." and a fight's "P TAKES THE FIGHT BACK" were false there, as the next key brings the title back: P says "Paused. P plays on, any other key for the title." and the fight's hint reads "ANY KEY FOR THE TITLE" while `attracting`. The hint is drawn only: it was looked at in the page and is not checked under Node.
13. **The issue's "is opt-in" reworded, because the title starts the mode unasked.** DESIGN §1's line says that the pilot takes the player's own game only when asked and that, left alone, the title plays one of its own and saves nothing; §12's row says the same in one sentence. It still does not loosen pillar 1 for the player.
