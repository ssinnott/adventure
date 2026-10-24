# The pilot

An autoplay mode for watching (epic #713). The pilot is built to play the one quest from the title
to the ending's choice: it fights, explores, rests, buys, trains and talks at a walking pace, saying
over the view what it is about. Today it finishes The Quiet Farm on most seeds and stops lost in
Thornmark's chapter; the ten chapters after are not reached (Known limits). It plays **fair**: it
knows only what the party knows, never a map as written, so where it gets lost the finding is
against the area's hint chain, not the pilot. It is opt-in and changes nothing for the player
(DESIGN §1, pillar 1).

It lives on the `Game` (`g.pilot`), outside the save: nothing of it goes into `WorldState` or
`party.flags`, and it asks no save upgrade. `src/main.ts` builds it; a `Game` a test builds has none
until the test gives it one. It presses the keys a player would: every move is an `Action` through
`Game.update`, and nothing teleports or is bought off screen.

Built so far: the frame (#716) over the bot's fights (#714), the navigator (#717), the explorer
(#718), the quartermaster (#719), the strategist (#720) and talk (#721): people, choices, crossings,
guilds, spells and prestige trainers, the stop at the ending's choice and, in its second part, the
statues' riddles.

The first part of #723 makes the pilot live through the first chapter: a rest by member, a mending
between fights, a flight from a fight lost, a town's own doors before the land's, the journal's pages
read the earliest first, rations bought for six rests, a watchdog and a way through a group in the
only way (Survival, below). Its second part plays the one quest's chapters headlessly as a check,
with an omniscient run beside the fair one (Full runs, below).

## Using it

- **P** hands the game to the pilot and takes it back. Any other key while it drives takes it back
  too, and is then handled as usual. `src/main.ts` takes P and T before any screen sees them, so
  they work on the map, in a town and in a fight alike; no screen has a pilot key of its own. While a
  name or a riddle's word is typed, P and T are letters; the pilot types a riddle's word letter by
  letter, as the keyboard does (#721). While it types, the viewer's letters, P and T among them, go
  into the box and the pilot takes them out again: only Esc, Enter, Tab or an arrow takes the helm
  there, and Enter answers with the word as far as it is typed.
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

`attracting` lives on the Game outside the save, which asks no upgrade for it. While it is on,
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
  on a seen square within two steps, and none a hill hides (#53): where a group stands and nothing
  of what it is;
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
them now, not as last seen. The headless run's `omniscient` pilot (#723) has every square seen, each
cell as it is (a secret door a door) and, through a reader of its own, the secret doors as written
(`secrets`); the game never sets it (Full runs, below).

Each reader came with the first issue that used it, and its own fairness test: a goal's map is
read once the journal shows the goal (#720); a crossing once its seller has offered it (#721). A
statue's riddle is no reader of Known's: talk reads it off the box once the plinth is read
(`RiddleScreen.riddle`), as a menu is read off its rows, and its answer never (#721).

## Brains

The brains (`BRAINS`, each `(g, k, p) => Action | null`) are asked in order on every paced tick,
whatever screen is on top, and the first key given is pressed. A brain returns null unless the
screen it works on is on top: route and explore only on the ExploreScreen; talk and keep also on the
screens they answer. The order is keep, talk, aims, route, explore, wait (a fight is the frame's): the
company's needs outrank its meetings, and those its wandering; a brain either presses a key or sets
`Pilot.goal` and returns null, so that route presses it. The explorer, asked after the navigator,
speaks only when no goal is walked, and a goal it sets it walks at once, asking `route` for the first
key itself. Talk walks its goal to a person so, every key of it, or the strategist would set its own.
A brain that stops the pilot ends the tick (#723).

## The navigator

`route` (#717) walks `Pilot.goal`, a square and the name the why line gives it ("Bound for the
lane."), one key a call with the map on top: `forward` and the turns, never `back` or a strafe, so
the party faces where it goes. Its routes go breadth-first over the squares Known has a cell for that
the company can cross, round the groups the automap marks (through one only where no way round is
seen, #723) and onto an exit, a rift or a business's door only at the end (#720); from map
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
17). With Perception standing (the premade six's elf and gnome are born to it) a search finds a
secret door surely, in the wall ahead and in the wall past an open square ahead (#856), but the
explorer still searches a suspected wall once a side from the square before it. A Lockpick
standing (the premade six's thief is born to it) opens a locked door with no key spent, and a locked
chest, but the explorer goes to a locked door only once a key is carried, as before, and to no
chest: chests are the strategist's (#857). Then it says "Helmstow is walked out." and gives no key,
and says it again with no search until something it rests on changes. It explores the map it is on,
or `Pilot.prefer` (the strategist's, #720) where that is this map or a zone of it. Outdoors it keeps
to one zone's box, the party's or the zone preferred, and never goes into a zone whose band, as Known
gives it, starts above the company's level and one, unless that zone is preferred ("Callow Downs is
too hard for us yet." in such a zone). Of a zone preferred with nothing seen near it, it says "No
way to Thornmark that I have seen.": bringing the party nearer is #720's.

## The quartermaster

`keep` (#719) keeps the company fit to fight. `need` names the most urgent of its needs (`needs`
gives them all, in order): the temple with one dead or stone; rest when the harness's rule trips
(`mustRest`) over those standing, or the pilot's own by member (`weary`, #723); food under two
rations a head, bought for six rests (`FOOD_RESTS`, #723); training for one ready whom it can
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
trainer each row that offers training. Nothing is sold and no skill or tier is learnt: the keep never
presses a trainer's "Expert at arms and in magic" (#852), whose rows carry no `train Ng`, and talk
leaves a tier's menu, a trainer's or a Master's person's, as it leaves a skill's. Pender's Locks in
Saltmouth is a shop now (#860): the pilot buys no set of picks, as `better` passes over a slotless
ware, and takes the Thief's first from Pender through the shop's "Talk to Pender the locksmith", as
at any business with a person in it (from the square before his door, eight ticks). What it bought it
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
it stands on and goes to one seen there, Space pressed once a chest, so a locked chest it cannot
open ("Locked.") is walked past as a locked door with no key is (#857); walked out, it walks the
place again end to end, so that the days pass. Three days of the world's on one goal with no change
in its words, it says "Lost in the Foreland: three days, and no way on.", gives the goal up
(`Pilot.lost`) and turns to the next aim; three days levelling with no level gained, "Three days in
the Foreland, and no stronger."; either is tried again once anyone gains a level or a flag is set.
Over a line into a zone too hard for the company that its aim is not in, it turns back to the square
before the line, once a crossing ("Too strong for us yet: back."). An enclave (#845) is given no
grace of a level: Known gives its band once a way into it is seen (`Known.enclave`), as its door says
it; a goal in one whose floor is over the company's level sends the pilot levelling to that floor; it
walks into no such enclave and the navigator takes no way in to one (`edges`). The way up from a
deeper level stays open, so a pilot handed the helm inside is never stranded. It meets nobody: a
chapter begins and moves on by words that are talk's (#721).

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
pilot under it ("The choice is yours.").

A statue is gone to as a person is ("To the statue.") and its plinth read with Space ("Reading the
plinth."). Its riddle is read off the box as the player reads it, never the statue's answer, and
tried with the words heard alone (`answers`): a HOW MANY riddle with the number words one to twelve
heard in a line that shares a word of four letters or more with the rest of the question, in
ascending order; any other with the words of three letters or more, the riddle's own left out, of
every line heard that shares two or more words of four letters or more with it, ranked by that
overlap, then the longer first, then as first heard. Each word is typed a key a tick into the box as
the keyboard types in the text mode ("Trying TEN."), then Enter is pressed; it counts as tried at
Enter. A wrong one costs nothing, and Space on the stone tries the next. Five at most a statue, each
once (`Pilot.tried`); none left, it says "I have no answer for the stone." into the log, as the
strategist says it is lost, presses Esc and gives the stone up until a line heard gives a word it
has not tried. The Downs' stone, HOW MANY FOR THE HEARTH?, is answered by "ten" on its second try
once the old man's song at Gullwick is heard ("Ten for the Hearth and one for the Queen..."), after
"one"; in the shelf's play on seed 10 as it ran at #841's review, with more heard of the Hearth by then, on its fourth ("one",
"two", "seven", "ten").

## Survival

#723's first part. Before it, of seeds 1 to 12 of the shelf's first chapter only 2 finished with the
premade company, and 3 with the companies the seeds draw: the company walked out of Helmstow onto the
Foreland at level 1 without entering the keep, and fell there to groups a level or two up; the
sorcerer fought empty, as the harness's rule pools the spell points; the hurt walked far to a camp.
Now the quartermaster rests by member, beside the harness's rule (`mustRest`, unchanged): one standing
under three quarters of their hit points (`REST_HP`), or a caster (a cleric, a sorcerer or a druid)
under half their spell points (`REST_SP`), rests the company where it stands, or takes the room at an
inn's door, and goes nowhere for it. Between fights a member with a mending spell mends one under 70%
(`MEND_AT`) by the spell menu's keys, as a player casts: C, the caster's number, `down` to the spell,
Space and the member's row; where the harness's rule wants rest and a rest or a room can be had here,
the rest comes first. Rations are bought for six rests (`FOOD_RESTS`) once under two a head, and the
rule by member rests only with two a head in hand. The game's bot flees a fight lost (`beaten`: one of
the company fallen in this fight, and as many foes standing as members), a reading of its own: the
gate's and the harness's bot (`asWritten`) never flees, so their figures stand; the square a fight was
fled from is gone round (`Pilot.fled`) until the company stands whole again or has gained a level or a
flag. The strategist walks a town's own doors to a map not visited before the land's gate (the keep
before the Foreland), reads every begun page of the journal, the earliest first, and tries a goal
given up again once a level, a flag, a thing carried or a map visited is gained; with every aim given
up and nothing gained it stops, saying "Lost: no way on that I can see.". Two keep it moving (the
review of #841): where a group stands in the only way the navigator goes through it, the fight the
bot's; and a watchdog, the brain `wait`, asked last: after 600 ticks (`STUCK_TICKS`) on the map with
no key from any brain, a search where it stands passes ten minutes a press ("Stuck: waiting a
while."), so the clock runs and the lost rule can come. The survival sweep (`node tools/test.ts
survival`, run only when named) plays the chapter on seeds 1 to 12 with both companies, a run within
ten minutes of the wall clock, and prints a line a seed under `--list` or once it fails (#895).

## Full runs

#723's second part. `node tools/test.ts fullrun` (`tools/tests/fullrun.ts`) plays a new game on seed 4
with the premade company and an instant pilot at the helm asking every brain: the one quest's
chapters in AREAS order on the one Game, so that each area starts as the pilot left the last (the one
road). A chapter's play ends when the chapter is done, the company is wiped, the pilot stops itself
or a cap is met: ten minutes of the wall clock (`BUDGET`) or 2,000,000 ticks (`TICK_CAP`). Each chapter
gets a line: "shelf: the pilot finishes The Quiet Farm in 7,541 ticks, 25.0 days, level 4" (#889), the days
being the world's while it played; or where it stopped: fell, stopped itself with its why line or
capped (by the budget or by the ticks). The last chapter ends at an ending taken, which the pilot never
takes: its stop under the question ("The choice is yours.") counts, and the test, as its privilege,
presses the first answer. Every line heard that starts "Lost in" or "I have no answer" is printed as a
note, once with its count ("note: thornmark: Lost in Thornmark: three days, and no way on. (x36)"),
and fails nothing. These lines print under `--list`, as the run started by hand in CI prints them;
by default they wait for a chapter's failure and print with it (#895).

Before each chapter the run takes a save point (`serialize`) with the map on top, where a player can
save. A chapter the fair pilot does not finish is played again from that point by a fresh pilot with
`omniscient` set, the save loaded as F9 loads one (`headlessLoad`, `tools/kit/headless.ts`), so no memory
crosses it. A second line says which kind of failure it is: "thornmark: fair pilot lost; omniscient
also fails (fell in Callow Downs 109,120, ...)". The omniscient Known has every square seen, each
cell as it is (a secret door a door), every exit there now and every feature the automap marks. The
explorer suspects the secret doors as written and not yet found (`Known.secrets`: `MapDef.secrets`,
a zone's placed where its box lies) and no other wall. Nothing else changes: the brains are the fair
pilot's. Where the omniscient pilot finishes, the road goes on from its end with a fresh fair pilot.
A chapter neither finishes ends the road, and each later area's line says that it was not reached.

FULLRUN names the areas, as ids with commas between or `all`, and `shelf` when unset. The run plays
the road up to the last area named and checks every chapter on it, as a chapter is reached only
through those before it. `FULLRUN=shelf` repeats the shelf's walkthrough play tick for tick. The
suite runs only when named (`ASKED`, `tools/test.ts`, held so by the runner's own check): a bare
`node tools/test.ts` does not run it, but `npm test` names it last, so `npm test` runs the shelf's full
run (about 10 to 25 s; it repeats walkthrough:shelf's play) and so does the tests job.

In CI the tests job's `npm test` is the shelf's gate, with no step of its own (10 s on CI). The
`fullrun` job runs only when the workflow is started by hand (`workflow_dispatch`), never on a pull
request: its `fullrun` input is the FULLRUN (`all` unless changed) and it has sixty minutes; its lines
go into the run's summary. It is a report, not a gate, until the pilot finishes those chapters. The
smoke test hands the browser's pilot the game for thirty seconds at 1x (1,800 frames) after its other
pilot checks: the company walks, no page error comes and P takes the game back. That pins the show,
not the finish.

## Known limits

- **The full run, all areas** (`FULLRUN=all node tools/test.ts fullrun` on 4473dac1, seed 4, the
  premade company: 8 minutes 45 seconds, 12 failures). The road ends at Thornmark's chapter. The
  shelf's and Thornmark's rows are main's on 18 October with #889 (`FULLRUN=thornmark`), measured
  again since #856 and #857 gave the premade six Perception (its elf and gnome), Pathfinder (its
  ranger) and Lockpick (its thief), and since #889 stopped the automap mapping through a wall or
  round a corner: the fair pilot stops where it stopped before, by another way (it took 68,368 ticks
  and 176.9 days on #844's tree, 85,559 and 239.6 before #889; now 47,738 and 164.8), and the
  omniscient one falls elsewhere, in the Wold (at 81,253, after 15,821 ticks and 41.5 days there; on
  Callow Downs on the trees before).

  | Area | Chapter | The fair pilot | The omniscient pilot, from the save point |
  |---|---|---|---|
  | shelf | The Quiet Farm | finishes: 7,541 ticks, 25.0 days, level 4 (14.1 s) | not run |
  | thornmark | The Grove Stone | stops itself lost in Ashcombe Cellar at 1,1 ("Lost: no way on that I can see."), level 6, after 47,738 ticks, 164.8 days (195.9 s) | also fails: falls in the Wold at 81,253, level 6, after 15,821 ticks, 41.5 days (443.4 s) |
  | saltreach | The Tide Stone | not reached | |
  | wrackholm | The Stone Carried Home | not reached | |
  | sunderwood | The Wall | not reached | |
  | kilns | The Anvil Stone | not reached | |
  | cairnmoor | The Ring | not reached | |
  | rimewater | The Sleepers | not reached | |
  | whitespine | The Bells | not reached | |
  | ashfall | The Window | not reached | |
  | glasswold | The Warning | not reached | |
  | hearth | The Heart | not reached | |

  The notes, on 18 October: shelf, "Lost in the Foreland: three days, and no way on." 7 times;
  thornmark, "Lost in Thornmark: three days, and no way on." 36 times, "Lost in the Foreland: ..." 39
  times and "I have no answer for the stone." once; thornmark (omniscient), "Lost in Thornmark: ..."
  8 times, "Lost in the Foreland: ..." 9 times and "I have no answer for the stone." once.
- **The birth skills and Thornmark's run** (#893). The premade six's Perception, Pathfinder and
  Lockpick (#856, #857) made the fair run a quarter longer on the tree that showed it, #879's. Each
  was taken off the six in turn by a scratch runner (decision 2 for #893), on that tree and on main
  at 61653d0e; the give-ups are the "Lost in" lines heard:

  | Skills | #879's tree: ticks, days, give-ups | Main: ticks, days, give-ups |
  |---|---|---|
  | all three | 85,559, 239.6, 75 | 47,739, 164.8, 49 |
  | all but Perception | 85,559, 239.6, 75 | 47,739, 164.8, 49 |
  | all but Lockpick | 79,120, 210.5, 67 | 47,730, 164.8, 49 |
  | all but Pathfinder | 100,398, 321.1, 100 | 60,606, 172.0, 54 |
  | none | 68,368, 176.9, 56 | 74,237, 189.8, 60 |

  Taken off together, the three give back #844's 68,368 ticks to the tick: they are the whole of the
  issue's difference. Every run stops where the issue's did, in Ashcombe Cellar at 1,1 ("Lost: no
  way on that I can see."): no skill strands the pilot, and on main the three shorten the run. Perception changes
  nothing: the elf is the ranger and the gnome the thief, both with Keen Eyes, which finds the door
  ahead surely, and none of a run's 114 to 119 searches faced a door past an open square. Lockpick
  lengthened #879's run by 6,439 ticks and 29.1 days, by the lost rule and not by a door. The two
  runs are one, tick for tick, until 69,567, when the cellar's locked door (7,11) opens to the iron
  key from the cellar's chest (3,3, found at 34,907): Ottilie's picks keep it, and without them it is
  spent. The survey wand found 24 ticks on then outnumbers the things carried at the last give-up in
  the one run and only evens them in the other, so the goals given up are tried again in the one
  (`retry`, aims.ts); the runs part at 70,303 and the Lockpick run gives up 8 times more. The run
  without Lockpick, given an inert thing in its bag the tick the key is spent, follows the Lockpick
  run to the tick (85,559). Pathfinder takes the drag off rough ground (6.00 minutes an outdoor step;
  6.09 to 6.49 without it), so the world's clock parts at the shelf's first rough step and the runs
  share nothing after: it shortened the run with Lockpick and lengthened it without on #879's tree,
  and shortens it either way on main (the shelf's play too: 7,541 ticks with it, 10,322 without).
  The days are the lost rule's, 3.1 to 3.4 a give-up; what a skill moves is how often the goals given
  up come back, and where their three days are walked: in Helmstow, at two minutes a step, a give-up
  takes nearly four times the ticks of one outdoors (#879's run spent 44,104 ticks and 52.5 days in
  Helmstow, 25,758 and 111.5 on Callow Downs). Nothing is changed (decision 1 for #893).
- **Thornmark's chapter, fair** (the full run). The aim is grove2, two maps in, and the fair pilot
  never sets foot in grove1 or Thornhold (Two maps in, below): lost in Thornmark thirty-six times, it
  walks the Foreland, Thornmark, Helmstow and the mill until it stops itself lost in Ashcombe Cellar,
  at 1,1. Past that lies a second wall: in grove1 the stairs down to grove2 (11,10) are past a locked
  door (7,11), and the key is in a chest (3,10) in a room whose one way in is a secret door (5,11).
  The far side of that door is never seen, so the explorer never suspects it (decision 17 for #718).
- **Thornmark's chapter, omniscient.** It walks into grove1 again and again and loops there: the
  explorer sets the secret door's wall as its goal, and on the square before it the strategist, asked
  first, finds no way to grove2 (the door at 7,11 is locked) and walks the company to the far side
  again, so the search never comes. Lost, it wanders off and falls on Callow Downs at 109,120. A
  route over every square seen is slow, too: about 19 ms a tick against the fair run's 4.
- **The omniscient pilot has no frontier.** Every square is seen, so the explorer has nothing to walk
  to: it searches the secret doors as written and then calls the map walked out; only the walk again
  rule walks it. Chests are gone to only on the aim's map. "Omniscient also fails" therefore does not
  yet mean that nobody could finish the chapter. The issue's flag was built as written ("nothing else
  changes"); a frontier of the squares not walked, or the explorer asked before the walk again, is the
  owner's call.
- **Survival.** The sweep's figures are in the table over the decisions for #723. Since a wall hides
  what lies past it (#889), 12 of 12 finish with the premade company and 10 of 12 with the companies
  the seeds draw; before #889, on main, 10 of 12 and 11 of 12 (premade seed 5 fell on the Foreland and
  seed 8 stood at the budget in Callow Downs, "Stuck: waiting a while."). A finished run takes 7,541 to
  25,443 ticks, played as the survival sweep plays it. At #842's second review the lost rule fired 3
  to 17 times a finished run, a median of about 9 (counted from the log), on the world's minutes,
  sleep among them (decision 13 for #723). `Game.fight` still takes every group beside the party at
  once; the two falls are drawn seed 10, on the Foreland at 204,58, at level 4 (216,42, at level 2,
  before #889) and drawn seed 1, in Thornmark at 255,39, at level 4, after 24,921 ticks (it finished
  in 30,548 while a step could slip round a corner, #903's review).
- **The last one standing does not flee.** A fight is lost only once one of the company falls in it
  (`beaten`), so a company with one member standing, the rest down before it began, fights on to the
  end, as in both of the falls at #842's merge. A follow-up, if the owner wants it (the delegate's
  call for #723).
- **Two maps in.** A goal's map behind a map not visited is not reached by `toward`: `routeMaps`
  goes only to maps visited and the goal's own, and the explorer never takes an exit, so on seed 10
  Thornhold's gate and the Grove's steps were seen and never stepped on (#841's review). A seen exit
  to a map not visited, chosen by where the world map draws its place, would be the hop. Not built in
  #723's second part: the full run shows it on seed 4 too, but grove1's locked way down stands behind
  it (Thornmark's chapter, fair, above), so the hop alone would not finish the chapter.
- **Meetings in a town.** Every flag set or item gained sends the pilot back round the people near it
  (talk's rule, as the issue has it): at review, on seed 4 it spent ticks 167 to 617 in Helmstow on 24 meetings
  with nine people, Aldith and Hob five times each.
- **Thornmark's chapter** (seed 10, run to tick 40,000, at #721's review; for #723, whose `fullrun`
  suite asserts the chain to the chapter's end). Over the pass at tick 14,650, at level 5; only 1,938
  of the next 16,000 ticks are in Thornmark (walks to Helmstow for rations, training to level 6, side
  quests). The aim is grove2, two maps in: Thornhold's gate (23,4) is seen twelve keys off at 15,700
  and the Grove's steps (7,29) by 18,900; the company reaches row 30 but steps on neither. There
  is no known route into grove2 (`routeMaps`' edges go only to maps visited or the target), so
  `toward` falls to the explorer, which never takes an exit. Lost in Thornmark at 15,763, 18,940,
  24,466 and 29,146 and in the Foreland seven times more; no square shut, no wipe (all at level 6,
  995 gold).
- **The stall in the Ashcombe cellar** (the same run, from about tick 34,000). In the cellar (map
  `mill`) at 11,10, a dead-end room three squares by two whose door is 13,11, on the map screen: no
  key for 6,000 ticks, the clock stopped at minute 126,836, the why "Bram is ready to train, and no
  trainer seen to teach them.", no goal and no aim. A live group (`m_slime`) stands on 12,11, the only
  square to the door; the navigator goes round the groups the automap shows, so only 5 squares are
  reachable. `chooseAim` sees the doors to Thornhold, grove1 and greywater1 and `routeMaps` finds each,
  but `toward` gets no key and marks each walked out (`aims.ts`); with no key there is no clock, so
  the group never moves: a deadlock. Mended by #723's first part: the navigator goes through a
  group that stands in the only way, and the watchdog searches after 600 ticks with no key, so the
  clock runs.
- **The rations shuttle** (#842's review). The rule by member rested a company for a druid or a
  sorcerer with few points after nearly every fight, and the quartermaster bought only to two rations
  a head, so every second rest was a walk back for food: a drawn company on seed 4 said "Resting: Rook
  is short of spells." 2,237 times and walked to the Ellerby Farm for rations 1,570 times, with 39,675
  gold unspent. Mended: rations are bought for six rests, and the rule by member rests only with two
  a head in hand.
- **The journal moved on** (#842's review). With the wand handed in before Crowness Light, Thornmark's
  chapter began and the log showed its goal alone, so the keeper's log was never sought. Mended: Known
  gives each begun page's goal, the earliest first, as the journal's pages turn.
- **Riddles.** By §6's rule, with every line of the game's people, signs, events and statues heard
  (the worst case), the Downs' stone's "ten" is the fourth word tried, the first elder's "standing"
  (Thornmark) the eighth, the stone Lantern's "moths" (Sunderwood) the 162nd and the drowned god's
  name (Saltreach) none: it is said nowhere in a line, but in the Holy Symbol of the Tide's text,
  which is read on the sheet and never heard. The pilot hears far less than every line; what it
  answers in a play is the full run's to show (#723); on seed 4 it says "I have no answer for the
  stone." once in Thornmark's chapter, fair and omniscient alike, before its road ends.

## The files

| File | Owns |
|---|---|
| `src/game/pilot/pilot.ts` | `Pilot`: on and off (`toggle`), a stop of its own (`stop`), the tempo and the pace, the why line and what the band shows (`band`), the corpus heard (`hear`, `forget`), the next key (`next`), the navigator's goal, plan and squares found shut (`goal`, `plan`, `shut`), the explorer's walls searched and the map preferred (`searched`, `prefer`), the strategist's aim, since when, its goal's words and the goals given up (`aim`, `aimSince`, `aimGoal`, `lost`, #720), the people met and the crossings told (`met`, `offers`, `told`, #721), the words tried at each statue (`tried`, #721), whether it asks talk (`talks`), the watchdog's count (`stuck`, `STUCK_TICKS`, #723) and `BRAINS`: the brains in the order asked (fight, keep, talk, aims, route, explore, `wait`), a stop of a brain's ending the tick (#723); `omniscient`, the headless run's, never the game's (#723) |
| `src/game/pilot/known.ts` | `Known` and `knownOf`, the fair view; `fair`, a feature as the party knows it; what a menu has shown (`wares`, a Buy list's; `trainsTo`, a trainer's top level; #719); a map's or a zone's bounds, a place's band and the squares seen, counted (`box`, `band`, `seenCount`, #718); an enclave's band once a way into it is seen, as its door says it (`enclave`, #845); the journal's goals with their maps and the zones set foot in (`goals`, `zones`, #720); the crossings told (`offers`, #721); the headless run's omniscient view (`omniscient`, every square seen and each cell as it is) and its reader `secrets`, the secret doors as written, empty for a fair pilot (#723) |
| `src/game/pilot/keep.ts` | the quartermaster (#719): `needs` and `need` (what the company needs, the most urgent first), `better` (the best a member can wear for the gold), `restWanted` (the rest offered taken, talk's rule 2 too), `reserve` and `spare` (from `purse.ts`) and the brain `keep`; the rest by member and the mending (#723): `weary`, `caster`, `REST_HP`, `REST_SP`, `MEND_AT` and `mendable`, the spell menu answered by its keys |
| `src/game/pilot/purse.ts` | `reserve` and `spare` (#719): what the quartermaster keeps back and the gold over it, read by the quartermaster, talk and the navigator (#721) |
| `src/game/pilot/talk.ts` | talk (#721): `pick` (the row to answer a menu with, or -1 for Esc), `NEAR` (the keys a person or a statue may be off), `answers` (the words heard that may answer a riddle, the likeliest first), `TRIES` and `NO_ANSWER` (five words a statue and the line when none is left) and the brain `talk`, with the meetings and the riddles; what it keeps between ticks (its goal, the stamps of the people met, the crossing chosen, the riddles read, the word being typed, the stones given up) it keeps by pilot (`untalk` forgets it), and what it opened in a visit by the visit |
| `src/game/pilot/aims.ts` | the strategist (#720): `Aim`, `chooseAim` (what the pilot is for), `LOST_MINUTES` (the lost rule's three days) and the brain `aims`, with the lost rule, the band rule, the chests and the walk again; what it keeps between ticks (the zone and square of its last look, the goals lost at what level, the places walked out) it keeps by pilot (`unaim` forgets it) |
| `src/game/quests.ts` | `goalMap` (#720): the map a quest's shown goal is done on, read back from the goal |
| `tools/walk.ts` | `pilotPlays` (#720): a chapter played from a new game by the pilot alone, every brain asked, until its end or the point a play names, on a seed it may name (#721) and with a company it may name, the play given back by `pilotRun` (#723); the shelf's walkthrough plays The Quiet Farm to its end on seed 4 with it, within a five-minute budget (#723); the Thornmark chain is asserted by #723's `fullrun` suite, not by a walkthrough |
| `tools/tests/survival.ts` | the suite `survival` (#723): the shelf's first chapter on `SEEDS` with the premade company and the drawn ones, a line a seed, each held to its `FLOOR`; run only when named (`ASKED`, `tools/test.ts`) |
| `src/ui/riddle.ts` | `RiddleScreen`'s `riddle`, the question as its box shows it, which talk reads (#721) |
| `src/input.ts` | `drainTyped`: typed keys applied to a word, `Input`'s text mode and a headless game's alike (#721); `Game.input.typed` is where they are typed, by the keyboard or the pilot |
| `tools/kit/headless.ts` (`tools/tests/lib.ts` until #984) | `headlessGame(seed, party)`: a new game under Node, with the premade company or the one given (#723); `headlessLoad(save)`: a game under Node loaded from a save's text as F9 loads one (#723); its input drains its typed keys as `Input` does, so the pilot types under Node as in the browser (#721) |
| `tools/tests/fullrun.ts` | the suite `fullrun` (#723): the one quest's chapters played on one Game by the pilot, the omniscient run from the save point beside a chapter the fair pilot loses, the notes; `reach` (the road FULLRUN reaches), `SEED`, `TICK_CAP` and `BUDGET`; run only when named (`ASKED`, `tools/test.ts`) |
| `.github/workflows/checks.yml` | the `fullrun` job, run by hand with its `fullrun` input; the tests job runs the shelf's full run through `npm test` (#723) |
| `package.json` | `npm test`: the suites, the runner's own check, then the shelf's full run (#723) |
| `tools/smoke.ts` | the pilot in the browser: P, T, an arrow and the band (#716), and thirty seconds of its play at 1x (#723) |
| `src/game/pilot/route.ts` | the navigator (#717): `Goal` (with the reason or the why line its brain gives it), `routeOn` (the keys over one map), `routeLengths` (the length of the route to every square, in one search), `routeNearest` (the nearest of a set of squares, the search stopped there), each round the squares found shut it is given and through a group only where no way round is seen (#723), `routeMaps` (the exits from map to map, and the crossings told whose fare the gold over the reserve pays, `edges`, #721; no way in to an enclave whose floor is over the company's level and over the map's own, so the way up from a deeper level stays open, #845), the brain `route` and `unroute` (what it kept of a goal, forgotten); it reads a cell by `passableCell` (`src/game/map.ts`) and the groups as the automap marks them (`markedGroups`, `src/ui/frame.ts`) |
| `src/game/pilot/explore.ts` | the explorer (#718): `frontier` (seen squares with an unseen one beside them), `suspects` (walls with seen floor on both sides; for the omniscient pilot the secret doors `Known.secrets` gives, #723) and the brain `explore`; a zone's box and band it reads through `Known.box` and `Known.band`, and the zone a square lies in by `zoneAt` (`src/game/map.ts`), as the world map draws the boxes |
| `src/game/ink.ts` | `drawnCell`: what a cell is drawn as, which the view, the automap and Known share |
| `src/game/bot.ts` | the fight and the rest rule (`botTurn`, `asSeen`, `mustRest`, #714); `beaten`, a fight lost, which the game's reading flees (#723); the three the auto-fight plays from level 11, bless, sleep and drink (`PLAYED`, `optsFor`, #865), so the pilot's fights, which it hands to the screen's auto, play them too |
| `src/game/items.ts` | `hits`, a weapon's mean blow, its element's die at 3.5 (#855): the harness's measure, moved here for `better` (#719) |
| `src/game/party.ts` | `randomParty`: the company drawn from a seed (#979) |
| `src/ui/screens.ts` | `ChoiceScreen`'s `title`, `disabled` and its marks (#721): a group's refusal (`fight`, by `Game.parley`) and an ending's question (`ends`, by `Game.ask`, `endsIn` in `src/game/stones.ts`) |
| `src/ui/title.ts` | `TitleScreen` and attract mode's idle: `IDLE_TICKS`, the ticks of nothing counted on the title (#722) |
| `src/game/game.ts` | what the pilot leaves on the `Game`: `pilot`, `attracting`, `newRandomGame` (P on the title's and attract mode's start), `attract` and its wake in `update`, `band` (the band over the view: the pilot's, with attract mode's opening lines and the way out), the no-op `saveGame` and the wipe's restart in `gameOver` (#722) |
| `tools/tests/pilot.ts` | the suite `pilot` |

No parameter property, enum or namespace may enter anything a `Game` imports: `tools/kit/headless.ts`
loads the game under plain node, which only strips types (#715, decision 2).

## Decided by delegate

Decided by delegate for #715, each the owner's to overturn:

1. **`drive` makes one tick for each action and none between them.** The issue's doc line says "with a tick of nothing between each" and its body says "`g.update(a)` for each, then `g.update(null)` `settle` times". Built as the body: #717 to #719 count their ticks as `Array(n).fill(null)`, so n actions must be n ticks, and a test that wants a gap writes the `null` itself. The doc comment is reworded to say so.
2. **`tools/tests/lib.ts` imports `Game` outright**, so every suite, `tools/test.ts` itself and the runner's own check load the game's import graph at start, about 0.4 s a process (the table; a full run loads it all anyway). The gain is the guard: a parameter property, an enum or a namespace back in anything a `Game` imports now stops every run at load with the file named, and the docs say nowhere that these are barred. A line for DESIGN §13 or for `docs/PILOT.md` (#716) would say it; not written here, as it is not this lane's. To undo the cost, the two helpers would move to a file of their own that the pilot's suites import.
3. **The suite asserts more than the issue's four**, for the reason under What is built. Each added check is content-free (no map, group or door but Harrow's start and the Foreland's rats that the issue names), so a change of content does not break it.
4. **The declarations sit above each constructor** (`TitleScreen`'s with its other fields, as a method stands between), not first in the class where esbuild used to emit them.
5. **`tools/tests/runner/check.ts` needs no change.** It is 32 lines now (the issue's line 99 is gone) and runs the runner on `./fixture/` with `--dir`, where `FIRST` only orders the suites found, and `game` is not a fixture: the order it asserts, `holds later owing rejects unnamed`, is as before.

Decided by delegate for #714, each the owner's to overturn:

1. **The game's reading is a predicate, the gate's the default.** `botTurn`'s last argument defaults to `asWritten`, so the gate, the harness and every existing call see what they saw and their figures cannot move; the auto-fight passes `asSeen`. A named predicate rather than a boolean: it says which reading a caller takes; #723's omniscient flag can choose between the two. (Since #853 the options follow it, off unless given; since #865 the auto-fight passes `PLAYED`, so it and the pilot's fights with it bless, sleep and drink from level 11.)
2. **What the game has seen is read from the fight's log.** The game records an element's work (`CombatState.seen`) and a mending (`CombatState.mends`) and nothing else of a monster's ways, so `asSeen` takes a sweep, a breath, a call or a drain as seen once this fight's log has a line of a monster of that name at it ("Giant sweeps ", "Drake breathes ", "Tallyman calls, ", a "hits" line that drinks or takes spell points). The log is what the player reads, so it is fair as it stands; the resolver and `CombatState` take no new field. It holds for the fight and by name, as `seen` and `mends` hold for the fight and by kind. The new checks pin each line it leans on, so a reworded line fails a test rather than blinding the bot.
3. **A leader is never seen before it falls.** Nothing on the screen marks one and its people break only at the last leader's fall (`morale`), so the game's bot never aims at a leader first.
4. **The clock is read as the gate reads it.** The issue was written before the clock (#748). The story names the Grey Hands at the panel before the fight (MONSTERS §9.3) and the light goes out over it from the first round, so the game's bot aims at the panel first from the start, as `ANSWER.clock` says.
5. **Auto waits `BOT_DELAY` on the finished fight too**, so VICTORY and the loot show for as long as a turn takes before the screen goes, rather than not at all.
6. **The hint stands while auto is on**: in place of SPACE on the finished fight and of ESC BACK on a turn; on the enemy's turn as well, where there was none. P itself is #716's (the epic's Decided 9: the router takes it); in this pull request nothing in the game turns auto on.
7. **`REACH` stays private** in `bot.ts`, as it was in `gate.ts`: only the blast and the burn read it.

Decided by delegate for #716, each the owner's to overturn:

1. **P on the company screen is P on the title.** No game is under way on either, so both start one on a fresh seed with a drawn company (the epic's Decided 11), and the pilot asks no brain on them.
2. **The drawn company** (`randomParty(seed)`, in `game/party.ts` beside the premade company, and rolled from the seed as the company screen rolls): six of the ten classes with a mender among them (a cleric, a paladin, a bard or a druid), so the bot's mending and the rest rule have someone to lean on; the hardiest by hit die in the front row, as a player would stand them; a people and one of the screen's twelve names each. The seed alone makes it, so a seed replays (DESIGN §13).
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
3. **Known gives the groups the automap marks** (`Known.groups`): `world.groupAt` reads every live group, seen or not, which the fair rule bars. The automap's own rule moves into `markedGroups` (`src/game/ink.ts` since #979) and the automap draws by it, so the two cannot drift. A group out of sight is walked into, as a player would.
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
12. **The shelf's play runs on seed 10** (`pilotPlays(ok, CHAPTER, { seed: 10 })`; the seed is a new option of `pilotPlays`, 4 by default). On #720's seed, 4, the company falls to the shore crabs on the Foreland at level 1, at tick 1,532, before it reaches the keep, so #720's bound to the keep fails too. Of twelve seeds, two (8, 10) play The Quiet Farm to its end, in 14,919 and 14,634 ticks (14,538 for 10 on the final code, the riddles in); the rest fall in fights: at level 1 on the Foreland, before the keep (1, 3, 4, 6, 7: the cliff smugglers, the shore crabs, the coast bandits); at level 3, after the hire and Hild's ask (2, 5, 12 on Callow Downs: the chalk wolves, the crows; 11 on the Foreland: the cliff smugglers); at level 5 in Thornmark, after the wand is handed in and before the keeper's log (9: the brigands). The falls are the bot's fights and the harness's rest rule (#714, #719: a company rests only once one is under a quarter of their hit points), not a word unsaid: a finding for #723's runs. The play is chaotic: a change to anything it meets may move it. A fall on seed 10 is to be fixed, or the play bounded with the fall's issue named; it is never met by choosing another seed. The survival's numbers are under Known limits.
13. **The well is looked for only within six squares** (`drink`, #719): a route is no shorter than the squares between, and the quartermaster searched the whole map every tick while one was under half, a third of a long play's time (30.5 s to 21.2 s on seed 3, as the code then stood). Nothing it chooses moves.
14. **The why lines**: "A word with Hild.", "A word with an old man mending nets.", "To the Lantern Guildhall.", "Taking the work.", "Paying the guild's fee.", "Maren learns Bless.", "Bram rises.", "Passage to Helmstow.", "Burning the den." and, for a person's question, the answer given: "To Ailith: The Chapel, in Helmstow."
15. **The pilot stops itself at the ending's choice now** (§7's stop, at the review's asking): under a question marked `ends` talk presses nothing and calls `Pilot.stop` with "The choice is yours.", the stop of its own that keeps the band up until the next key (#716, decision 9). Standing under it pressing nothing, the band said "Nothing to do."; Esc would have looped, the strategist walking the company back to the person. #721's second part keeps the stop and the mark and builds the riddles; `EndingScreen` is never reached while the pilot drives.

The second part (§6 and §7, with Thornmark's play):

16. **A HOW MANY riddle is tried with the number words heard.** The issue tries one to twelve in order, the Downs' stone on the tenth try; but five tries a statue and the epic's Decided 1 and 5 (the world read fairly; a riddle answered from what is heard, else lost) bind, and the Done when wants the stone answered within five with its hint heard and no answer with nothing heard. So the number words one to twelve tried are those in a line heard that shares a word of four letters or more with the rest of the question (the Downs': "hearth"), in ascending order: the old man's song gives "one", then "ten", the second try.
17. **A line's words are cut at anything not a letter**, so "Thornhold's" is "thornhold" and "s" and Thornmark's sign shares "thornhold" with the first elder's riddle; each is `normalWord`ed, and none longer than the box takes (16 letters) is tried.
18. **A tie in the overlap goes to the longer word, then to the first heard.** The issue ranks by the overlap alone, and most hint lines share the same two words: an answer is seldom a short word, and the first elder's "standing" is the longest of its sign's words. A word in several lines is ranked by its best.
19. **The word is typed, a key a tick, as the keyboard types in the text mode**: into `Game.input.typed`, where `Input` puts a letter, and the box takes it as it takes a player's (a backspace first where it holds other letters), then Enter. The issue's "set `word`" would write the screen's field past its keys. `Game.input` names `typed`, which `Input` has; a headless game's input drains it as `Input` does (`drainTyped`, `tools/tests/lib.ts`), so the tests and the full run type as the browser does. The band says the word: "Trying TEN." A word counts as tried at Enter, not as it is chosen, so one the viewer cuts off with Esc is no try.
20. **A statue is gone to as a person is**: within twelve keys or on the aim's map, while it is due a reading ("To the statue."), and its plinth read with Space ("Reading the plinth."). Nothing else would take the pilot to one. Due: never read; or not yet given up (the reading tries the next word, or says there is none); or given up with fewer than five tried and a word heard since that it has not tried. The riddle is known once read (talk keeps it by square), so its words heard are weighed from afar, afresh only when something new is heard.
21. **"I have no answer for the stone." is said into the log** (`Game.say`), when the words run out or five are tried, as the strategist says "Lost in ..." (the epic's Decided 5 makes the two the same), with Esc pressed in the same step; set only in the band, it went with the box before it was drawn. The stone is given up until a line heard gives a word not tried while it has tries left. No quest's goal is a riddle (the four statues give gold, a point and gear and set no flag), so the strategist's `lost` takes no riddle.
22. **The real ending's question is tested through the game**: Wenna's at the Heart, met with the flags before her set and the Heart's groups put down (the test's privilege), both her question of two answers and, Fane's map held, of three; each answer's flag is one of the Hearth chapter's `done`. The stop is the first part's (15), kept. The band's test reads `Pilot.band()`, which `Game.render` draws: a Node test has no canvas.
23. **Thornmark's chain is #723's, not a walkthrough's.** The issue asks the chain from the Foreland to The Grove Stone's end in one run; on seed 10, the shelf's, the pilot gets over the pass into Thornmark with The Quiet Farm done and no further (Known limits); seed 4 falls on the Foreland (12). A play bounded there took 14,668 ticks, 30.6 s on one core, and the default run, about 8 minutes 42 seconds of CI's 10, has no room for it; #723's `fullrun` suite reads `FULLRUN` as a list of areas, so a walkthrough's own switch would run inside it. The delegate moved #721's last Done when to #723, which asserts the chain to the chapter's end; no walkthrough plays it, and no area file is touched here. It is not met by another seed (12).
24. **A why line's name that begins with "A" or "An" keeps it**: "To a stone Lantern.", where `whyTo` said "To the a stone Lantern.", as it would have of a hall so named.

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
11. **The wake and the restart turn the text mode off.** Only a riddle turns its own text mode off (`RiddleScreen.close`), and the wake drops the screens without a word: with a riddle open (the riddle brain, #721's second part, will open them) the viewer's key left the title up with the text mode on, so that Space, the letters, P and T and the digits were typed and F5 reloaded the page. `wake()` and `attract()` (a wipe's restart) set it off, and the checks open a riddle and send a key and a wipe.
12. **P in attract mode says what it does.** "You take the helm." and a fight's "P TAKES THE FIGHT BACK" were false there, as the next key brings the title back: P says "Paused. P plays on, any other key for the title." and the fight's hint reads "ANY KEY FOR THE TITLE" while `attracting`. The hint is drawn only: it was looked at in the page and is not checked under Node.
13. **The issue's "is opt-in" reworded, because the title starts the mode unasked.** DESIGN §1's line says that the pilot takes the player's own game only when asked and that, left alone, the title plays one of its own and saves nothing; §12's row says the same in one sentence. It still does not loosen pillar 1 for the player.

Decided by delegate for #723 (survival), each the owner's to overturn:

The figures: The Quiet Farm played from a new game by every brain on seeds 1 to 12 to the chapter's end, cap 200,000 ticks, a fresh process a run; finished of 12, with the premade company unless said.

| Build | Finished | Seeds |
|---|---|---|
| main, before (f18826f9) | 2 | 10, 12 |
| a town's own doors first (1) | 5 | 2, 4, 7, 8, 11 |
| and the rest by member, walking to a camp or an inn for it | 8 | 2 to 6, 8, 10, 11 |
| doors first, the rest by member where it stands (4) and the mending (5) | 6 | 1, 4, 5, 8, 9, 11 |
| and the flight (6) | 10 | all but 2 and 5, which stood at the cap in the cellar |
| the same with the rest at 50% and 25% | 8 of 11 run | two fell, one stood |
| head aff655d9, at #842's review | 10 | all but 7 (still running) and 9 (fell: the flight's loop) |
| head aff655d9, the companies the seeds draw, at #842's review | 6 | 1, 2, 5, 6, 8, 10 |
| #842 as merged | 11 | all but 8 (fell on Callow Downs at level 3, tick 4,720) |
| #842 as merged, the companies the seeds draw (`randomParty`) | 11 | all but 11 (fell on the Foreland at level 2, tick 5,300) |
| #844, a hill hiding what lies behind it from lower ground (#53; 73c49d4a, and 008b4307 with #849 taken in) | 12 | all |
| #844, the companies the seeds draw | 11 | all but 10 (fell on the Foreland at 216,42 at level 2, tick 4,502: the road bandits) |
| main, the companies the seeds draw | 3 | 3, 4, 6 |

1. **A town's own doors come before the land's gate** (`chooseAim`'s walk). The gate out of Helmstow onto the Foreland counted as one of the town's doors to a map not visited, and from where the meetings left the company it was nearer than the keep's: on seed 4 the company walked out at level 1 at tick 617, never entered the keep, and fell at 1,440. #720's decision 8 meant the keep first. 2 finished before, 5 with it.
2. **The pilot rests by member** (`weary`, beside `mustRest`, which stays the gate's and the harness's): one standing under 75% of their hit points (`REST_HP`), or a caster under 50% of their spell points (`REST_SP`). At 50% and 25% two of eleven fell.
3. **A caster is a calling of `caster`** (the prestiges' table: a cleric, a sorcerer, a druid). A paladin's, a ranger's or a bard's few points, spent on a mending a fight, would rest the company after nearly every fight.
4. **The pilot's own rule rests where it stands, or takes the room at an inn's door, and walks nowhere for it**; the harness's rule still sends the company to a camp or an inn. Walking for it finished 8 (doors first only) but in 21,000 to 61,000 ticks, as every rest refused at three quarters was a walk back.
5. **A mending between fights** (`mendable`, under 70%, `MEND_AT`), through the spell menu by a player's keys (C, the caster's number, `down`, Space, the member's row), by the member with the most spell points, so a paladin keeps his for the fight; before any walk, but after the rest or the room when the harness's rule wants one and it can be had where the company stands. The well's test now empties the rations and the spell points, so the well is still the one want it can meet; its check is as it was.
6. **The game's bot flees a fight lost** (`beaten`: one of the company fallen in this fight, not one who came into it down, and as many foes standing as members standing), in `botTurn` behind the reading: the gate's and the harness's bot (`asWritten`) never flees, and `node tools/test.ts gate harness curve density` prints the same, byte for byte, before and after. At #842's review a member who came into the fight down made every fight lost from its first blow, and the company fled five barn rats; the members down are now counted as the fight begins (`CombatState.downAtStart`).
7. **The square a fight was fled from is gone round** (`Pilot.fled`, read by the navigator as a square found shut) until the company stands whole again or has gained a level or a flag: at #842's review the route stepped straight back in, 28 fights on one square in 133 ticks on premade seed 9, 237 flights on drawn seed 12, then the wipe.
8. **Rations are bought for six rests** (`FOOD_RESTS`) once under two a head, the gold allowing, and **the rule by member rests only with two a head in hand**, so the next rest is not walked for (the harness's rule still rests on one a head): at #842's review a drawn company said "Resting: Rook is short of spells." 2,237 times and walked for rations 1,570 times, with 39,675 gold unspent, to the cap.
9. **The journal's pages: the strategist reads each begun page's goal, the earliest first** (`Known.goals`), as a player turning the journal's pages: with the wand handed in before Crowness Light, Thornmark's chapter began and the log showed its goal alone, so the keeper's log was never sought (drawn seeds 3, 9 and 12, premade seed 7 at the review).
10. **A goal given up is tried again once a level, a flag, a thing carried or a map visited is gained** (`retry`); **with every aim given up and nothing gained, the pilot stops** ("Lost: no way on that I can see.", the band kept up), rather than walk a lost chapter to the cap.
11. **A watchdog, the brain `wait`, asked last** (the review of #841): after 600 ticks on the map with no key from any brain (`STUCK_TICKS`, counted in ticks at every tempo), a search where it stands, ten minutes a press, until a brain has a key again ("Stuck: waiting a while."). A search rather than a rest, as the rest's menu is the quartermaster's to answer and a search needs none. A brain, not the frame, so that a test naming its own brains (#718's decision 15) is not searched under. **Through a group where it stands in the only way** (`routeOn`, `routeNearest`): the search runs again with the groups' squares open only when no way round is seen; `routeLengths` keeps them shut.
12. **The quartermaster's nearest place is kept while nothing it rests on moves but the party's square** (`nearest`: the map, its squares seen, the flags, the groups the automap marks and the places): at #842's review a stuck tick cost 13 ms, 44% of it a search of the whole map a tick; now 100 ticks of a walk make no such search (the check counts them, `searches`).
13. **The lost rule counts the world's minutes, sleep among them**: a company that rests nine times on one goal is lost on it. Counting waking hours only would need the rest and the inn's night told apart from a test's clock; left as it is, and counted: it fires 3 to 17 times a finished run, a median of about 9 (counted from the log).
14. **The survival sweep** (`tools/tests/survival.ts`): run only when named (`ASKED`, `tools/test.ts`, checked by the runner's own check; #723's second part may add `fullrun`); the floors, 9 of 12 with the premade company and 8 of 12 with the drawn ones, are the delegate's, as #723 names no figure; a run within ten minutes of the wall clock (`RUN_BUDGET`), over which it counts as not finished, and the 200,000-tick cap stands. `headlessGame` takes a company (`randomParty(seed)`, as P on the title draws it), its default as it was.
15. **The shelf's play is back on seed 4, to the chapter's end** (the seed pin gone), within five minutes of the wall clock (`PLAY_BUDGET`, `pilotPlays`): 10,875 ticks, 21.0 s (10,792 since a hill hides what lies behind it, #53; 8,916 since #857; 7,541 since a wall hides what lies past it, #889), where main's play on seed 10 took 14,538 ticks, 29.8 s. The play is chaotic: a change to anything it meets may move it.
16. **Not built:** caution outdoors by level (the flight answered the level-1 fights it was for), the armour first, the reach two maps in (Known limits) and `Game.fight`'s taking every group beside the party, which is the game's. Talk's meetings in Helmstow are talk's, left as they were.

Decided by delegate for #723 (the suite), each the owner's to overturn:

1. **FULLRUN reaches the road up to the last area it names**, and every chapter on the road is checked, as a chapter is reached only through those before it: `FULLRUN=thornmark` plays and checks the shelf's chapter first. Unset is `shelf`; a name that is no area with a chapter fails.
2. **Ten minutes of the wall clock a chapter's play** (`BUDGET`), fair and omniscient each their own, as the survival sweep's run has; the issue's 2,000,000 ticks (`TICK_CAP`) stays as a cap. Either cap fails and says which. With the road as it stands the whole run takes about nine minutes.
3. **Seed 4 and the premade company**, the walkthroughs', so the default run repeats the shelf's walkthrough play tick for tick (7,541 since #889; 8,916 since #857; 10,792 since #53; 10,875 before) and the two can be compared.
4. **The save point is taken with the map on top**, as F5 saves: a chapter may end in a visit, and the pilot plays on until it is back on the map, those ticks counted in the next chapter. At the first sweep the save was taken in the throne room's visit, the party on its door, and a game loaded from it stood there with no way out: the navigator does not turn on a square it leaves from.
5. **The omniscient run loads the save as F9 does** (`headlessLoad`) with a fresh pilot, so nothing of the fair pilot's memory crosses; its line is a second failure beside the fair one's, worded as the issue words it, with where it stopped.
6. **Where the omniscient pilot finishes a chapter the fair one lost, the road goes on from its end with a fresh fair pilot** (its corpus empty), so each later chapter still has a fair line; a chapter neither finishes ends the road, and each later area fails as not reached.
7. **Each note once, with its count**: the fair pilot said "Lost in Thornmark" thirty times in one chapter. The omniscient run's notes are marked as its.
8. **The last chapter** is the delegate's first call: the stop under the ending's question counts, and the test presses the first answer, so the ending holds (`takeEnding`). The road ends before it, so the `pilot` suite checks it under Wenna's question through the suite's own `play`: the ending holds, and a stop with another why line does not count.
9. **The omniscient view reads a cell as it is** (a secret door a door) and gains `Known.secrets`, the secret doors as written and not yet found (a zone's placed where its box lies), with `Known.omniscient` so the explorer suspects those and nothing else; a fair pilot's `secrets` is empty, checked. The issue's "nothing else changes" is kept: the brains are the fair pilot's, and so its frontier is empty (Known limits).
10. **A brain's stop ends the tick** (`Pilot.next`), found by the first sweep: with every aim lost the strategist stopped the pilot and the watchdog after it pressed a search in the same tick, so the band lost the stop's line, which the suite reads. Checked.
11. **`npm test` and CI**: `npm test` runs the shelf's full run (about 10 to 25 s; it repeats walkthrough:shelf's play) and so does the tests job, as the issue's Done when asks, with no step of its own (10 s on CI); the `fullrun` job runs by hand only, with sixty minutes and its lines in the run's summary, and goes red when a chapter fails: a report, as nothing requires it.
12. **The smoke's thirty seconds** follow #716's pilot checks: T twice back to 1x, P, 1,800 frames counted from the frame the pilot took the helm, the steps grown and no page error in them, then P. Every earlier frame is as it was.
13. **No fix for a chapter's blocker.** The sweep's road ends at Thornmark's chapter, where the fair and the omniscient pilot fall for different reasons (Known limits): no single cheap blocker repeats across chapters, so both are left to the owner. The two fixes the sweep did bring (10, 4) are the suite's own footing.

Decided by the builder for #893, each the owner's to overturn:

1. **No change to the pilot.** The issue fixes the pilot where a skill strands it, and none does: all ten runs stop in Ashcombe Cellar at 1,1, as Two maps in (Known limits) has it, and on main the three skills shorten the run. Lockpick's lengthening on #879's tree is the lost rule's count of things carried (`gainsOf`, aims.ts), which a key kept or spent moves. A count of each kind of thing, so that any find tries the goals again whatever was spent, would be the pilot's fix (DESIGN's ruling for #892), and is not built: it would move the shelf's play, the survival sweep and every figure on this page, for a run that no longer lengthens.
2. **The skills were taken off in a scratch runner, not by a switch in the tree.** A copy of the full run's fair play (`play`, `tools/tests/fullrun.ts`) that strikes the peoples and classes born to a skill from `SKILLS` before the game is made; nothing of it is committed, and its figures are the suite's to the tick where both ran (the shelf's 7,541 and Thornmark's 47,739 on main, Thornmark's 85,559 on #879's tree).
3. **Measured on #879's tree as well as on main.** The issue's figures are #879's, and #889 and the areas have moved the run since (47,738 ticks at #903, 47,739 now): the cause is found on the tree that showed it, and main's runs say that it no longer shows.
