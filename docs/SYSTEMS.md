# Systems

How the game is put together: the layers and the folders, the outdoors as one map, the calendar and
the weather, the art kits and what is stubbed. Read DESIGN.md first for the why and EXPANSION.md
for how the work is done. Each file says what it holds in its header, and
[CODEMAP.md](CODEMAP.md) is a row to each, made from the headers; what each area holds is its doc
in `docs/areas/`. Cut from the slice's doc by #1023, which keeps that doc whole in the archive.

## The layers and the folders

- **`src/lib/`** is the engine, vendored: never edited here. Its synth stack is unused.
- **`src/game/`** is the model: the world, the party, combat, the people, the quests, the save and
  the rest, pure where it can be, so the tests play it as the game does; the item, monster, spell,
  quest and guild tables are content's, handed in (#973 to #975).
- **`src/content/`** is what the game is made of: an area to a folder, `src/content/areas/<area>/`,
  listed once in road order in `src/content/index.ts`, which merges their tables; the tables no
  area owns; and the world map's plan, `src/content/atlas.ts`.
- **`src/ui/`** is the screens, the frame, the viewport, the world map and the art (below).
- **`tools/`** is the tools, each one's usage in its header; `tools/kit/` is what they share with
  the suites and the walkthroughs (the headless game, the fight, the company, the line and the
  rules, #984); `tools/tests/` holds the suites, a file each, which `tools/test.ts` finds.
- **`types/`** is typed with the rest: `tsc -p tsconfig.json` runs over `src/`, `tools/` and it.

The `layers` suite (`tools/tests/layers.ts`, EXPANSION §8.1, #900) reads the runtime imports of
`src/` and `tools/` and holds them to the layers: no cycle among `src`'s, nothing in `src/game`
taking content, the UI or the app, nothing in the UI the app, no area another's files but its
`src/content/areas/<area>/public.ts` (#992) and the walkthroughs and the suites taking `src` and
`tools/kit/` alone. Today's crossings are the rows of its `KNOWN`, each under the issue that clears
it; a new crossing fails, and so does a row that no longer crosses.

## The outdoors as one map

The world map (M) charts Caldera as one land of 512 by 384 squares, divided into areas, the steps of
the road of levels, and the zones inside them (`src/game/atlas.ts`; the plan in
`src/content/atlas.ts`, each built area's part in `src/content/areas/<area>/atlas.ts`, merged as
`ATLAS` in `src/content/index.ts`). The game walks it that way too: the outdoors is one map,
`caldera`, the size of the world, square for square with the painted map (`src/game/outdoors.ts`,
which `src/content/maps.ts` runs once to make `PLAYED_DEFS`, the maps as played).

- **Zones in a grid.** Every outdoor map the atlas places is a zone, laid in 1:1 at its box of the
  grid. The zone maps are written in `src/content/areas/<area>/maps/` as maps of their own, in their
  own coordinates; laying them in moves their features, groups and exits to where they sit and
  leads every town's and dungeon's way out onto the outdoors. Outdoors the party's zone says where
  it is: the name on the status strip and the almanac, the level band, the region whose weather it
  has and the palette it is painted in.
- **Walked, not jumped.** An exit from one zone map into the next is dropped: the road runs
  straight on, and the view looks down it. Monster groups may follow the party over a zone's edge.
  An exit with flags still becomes a gate on its square (`MapDef.gates`).
- **The line at a border** (#166, EXPANSION §5.2). Crossing into another atlas zone, the log names
  it, unless the way's arrival line has; where the zone's floor is over the company's level and the
  land is new or harder than the last, the line says how the land feels. Never a wall.
- **Void where nothing is built: the end of the world.** Where no zone map is laid yet the outdoors
  is void (`%`, the `void` solid): nothing crosses it and nothing sees through it. The ring of
  mountains that closes each zone map in is, where it faces nothing built, the end of the world as
  well. The void is drawn as its look, the ground the world map paints there (#829,
  `MapDef.looks`, laid by `src/game/outdoors.ts` from the atlas's grid): the sea and the lakes run
  on to the horizon and the rim's mountains stand. A ring is drawn as the mountain it closes with,
  but where the atlas has water, so the coast runs on. A void with no look is pink empty space and
  says "The world ends here."; no walkable square has one in view (`tools/tests/outdoors.ts`).
- **Building more.** A new box is a map in `src/content/areas/<area>/maps/` and its area's index,
  marked `density` core or country, and a line in its zone's `maps` in its area's atlas;
  `node tools/scaffold.ts` cuts its first draft from the atlas. Laid in, it opens the void where it
  stands. Where it meets a built box the two edges agree square for square on passable ground, water
  and road, and open a way between two areas only where the atlas joins them (#898,
  `tools/tests/outdoors.ts`; a seam that disagrees as built is its area's `seamsAsBuilt` row, with
  its reason). Where it meets the atlas its water and roads carry on beyond its edge
  (`tools/tests/pillars.ts`), and each edge that faces no built box is open to a walker exactly
  where its area's `openOnNothing` says, with the box it faces and why that is unbuilt. Its pull
  request adds the rows of its edges onto nothing and deletes those of the edges it now faces.
- **Around it.** The automap draws a map that fits the panel whole, and for the outdoors a window
  of 33 by 33 squares round the party. Quests still name zone maps: `visited: 'thornmark'` holds
  once the party has set foot in the zone (`WorldState.zones`).
- **Line of sight.** A hill hides what lies behind it from lower ground (#53): the viewport does
  not draw it, the automap does not mark it and a group standing there is neither drawn, marked nor
  met (`hillOver` and `World.hidden` in `src/game/world.ts`, `GameMap.blocksView` given the eye's
  square). A company on a hill sees over hills and no farther. Night, a light and the weather say
  how far a company sees; a hill cuts the line, and the nearer stop wins. Woods hide nothing. A
  wall hides what lies past it from the squares the company maps round it (#889, `World.reveal`):
  one is marked only where nothing between it and the company, a step at a time, stops the view.

## The calendar and the weather

- **The calendar** (`src/game/calendar.ts`): eight months of fifteen days, two to a season, 120
  days in the Lanterns' year; game day 1 is the 1st of Mistfall, 1016. Dawn and dusk are 12 hours
  apart at the equinoxes, 15½ at midsummer and 8½ at midwinter, and the sun and moon follow them.
  The status strip says the date and the sky with a glyph; M adds an almanac.
- **The weather** (`src/game/weather.ts`) is a pure function of a per-save seed, the minute and
  the region's climate, so nothing about it is saved but the seed (`WorldState.weatherSeed`), and
  it never draws on the gameplay rng: a fight replays the same in any weather. Snow lying and
  standing water are the same function run over the ten days before. A new game draws seeds until
  its first morning is dry and free of fog.
- **Regions.** A region is an area, with its `climate` in `src/content/areas/<area>/index.ts`. Each
  map names its region (`MapDef.region`; the laid outdoors names none, its zones do); towns and
  dungeons share their region's weather. No sky is lent: a World asked the sky of a square no zone
  or map gives a region throws, naming both (`regionOf`, #945).
- **What it does to play.** Thick fog or a blizzard leaves two squares of sight, thinner fog, a
  downpour or heavy snow three; underground nothing changes. Snow lying deep adds two minutes to an
  outdoor step, as hills do (`HILL_DRAG` in `src/game/map.ts`). In a downpour, heavy snow or thick
  fog, bows, slings and crossbows lose 2 to-hit on both sides of a fight. The log says the sky's
  changes as the party sees them, and nothing underground.
- **A time to walk.** A group may walk only by night or by day, in fog or snow, or in a season
  (`EncounterDef.when`), only after a step (`after`), or stop coming back once something holds
  (`until`). Out of its hours it is not there, drawn or fought; nothing new is saved.

## The art

Everything is drawn at runtime from vector shapes; there are no bitmaps in the repo.

- **The paint kit**, `src/ui/paint/` (#983): the brush, a minimal `ShadeTarget`, so that sprites
  and portraits paint with the engine's own cel-shading helpers (a 1px ink outline, three tones,
  the light from the top left), the gloss (`blob()`, each material one mass under one outline),
  one `INK` and `rod`, the forms and the flame: what every drawing in `src/ui` paints with.
- **The monsters' kit**, `src/ui/monsters/kit/`: the brush and the small shape helpers, the
  measured humanoid frame and the chisel's mark. The drawings are `src/ui/monsters/`, a module to a
  family; each registers the kinds it draws in its `SPRITES` (its drawer, its span and any part
  drawn apart), and `src/ui/monsters/index.ts` merges them, refusing by name a kind two families
  register or one no area names, so a new kind of a family is its family's file alone (#915).
  `src/ui/sprites.ts` dispatches a kind to its family; every monster def names a sprite kind no
  other def uses (`tools/tests/art.ts`).
- **The rooms' kit**, `src/ui/interiors/kit/`: the walls, floors, windows and light, the furniture
  and goods and a trade's own. Each scene is a file in `src/ui/interiors/<area>/`, named by the
  `interior` on a business's map feature (`src/ui/interior.ts`); it is painted once into an
  offscreen canvas and multiplied by a light map, with its flames, glows and drifting motes drawn
  over it every frame.
- The kits are the systems lane's; the old paths (`src/ui/brush.ts` and the rest) re-export them,
  and a family or a scene takes a kit when it is next edited (EXPANSION §8.1).
- **The rest:** `src/ui/portraits.ts` paints a portrait to each character from the name, race and
  class; `src/ui/scenery.ts` holds the trees, rocks, mountains and pillars; `src/ui/view/` is the
  depth-layered first-person compositor (`compositor.ts`) and its parts by section (the sky, the
  weather, the floors, the walls, the roofs and the tents), a model with no canvas and the common
  ground they all take, with `src/ui/viewport.ts` their barrel (#1028); its static scene is
  cached in two canvases (the sky, and everything in front of it) and the weather and the year
  reach into it.

## Stubbed or absent

- The Meridian journal opens The Lost Expedition in the quest log, and the Cartographers' Geographer
  in Saltmouth reads it (#181); vol. IV is Ashfall's, and no vol. II or III exists.
- No audio. The engine's synth stack is vendored, unused.
- What the checks owe prints as `owed`, with the issue that owes it.

## Where the rest is

- **Each file:** its header, and [CODEMAP.md](CODEMAP.md), a row to each made from the headers by
  `node tools/codemap.ts`. A pull request that adds a file or changes what one owns says so in the
  file's header and runs the tool; the `codemap` suite names the rows of a stale map.
- **The checks:** `npm run check` runs the typecheck, the suites and the smoke test, each able to
  fail; EXPANSION §5 says what they hold. Each suite's header says what it holds and `--list` prints
  every `ok` line; the runner's flags are `tools/test.ts`'s header.
- **The tools:** each tool's usage is its header (`tools/sheet.ts`, `tools/gate.ts` and the rest).
- **Each area:** its doc in `docs/areas/`, with its decisions and its plan beside it.
- **The history:** [archive/SLICE-history.md](archive/SLICE-history.md), the slice's doc whole: its
  Checks, its tools' usage, its hand-written code map and its "Decided by" lists.
