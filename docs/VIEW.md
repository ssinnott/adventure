# The view

The first-person view and what is drawn in it, piece by piece: the grounds' looks, how their colour
drifts, what a region's look changes, the features and what moves. `docs/SYSTEMS.md`, The art, holds
the compositor and its parts; the pieces live here, a bullet each, so that the systems lane's first
read, which takes that page whole, stays inside its budget (`tools/kit/docs.ts`, FIRST_READ). A change
to the view says what is now true in its bullet here, and adds one if it adds a piece. The epic of
#1094 (the outdoors, varied) put most of them here.

- **What moves outdoors**, `src/ui/view/life.ts` (#1109), drawn every frame over the kept scene and
  under the weather: birds wheeling by day over open ground, gulls where the sea or its shallows lie
  near (the world's grid), ash on the wind over the ash, heat shimmer over steppe, sand and dunes at a
  hot summer noon, fireflies in the woods on summer nights and mist over water and low ground at dawn.
  A pure function of the frame, the minute, the weather, the ground in view and where the company
  stands; nothing in a fight, underground, in fog or where the dark would hide it, nor over a solid
  or a hill before it; each part to its cap (`LIFE_CAPS`, `tools/tests/life.ts`). No setting turns it off.

- **The grounds' looks**, `src/ui/view/ground/`: a module to each terrain exports its look (#1030),
  its colour through the year, how white snow makes it, whether rain darkens it or splashes on it,
  its tiles, what lies on it and what stands about it. `GROUND` in `src/ui/view/ground/index.ts`
  holds them, a record over the terrains; the floors, the scene and the rain ask it and name no
  ground. In the view a new ground is a module there, its line in `src/ui/view/ground/index.ts` and
  its colour in `TERRAIN_COLORS` (the automap's): the typecheck names a terrain without either.

- **Scatter**, `src/ui/view/scatter.ts` (#1103): a ground's look names the props it scatters, small
  drawings in `src/ui/scenery.ts`, each on its rate's share of the ground's open squares
  (`SCATTER_RATES`; the rates and a cap on each map are held by `tools/tests/art.ts`). `scatterAt`
  places one by a hash of the square, outdoors only, in a corner whose sides are open and never on a
  door, an exit, a gate, a feature or a group's start; reeds and driftwood only beside water. A prop is
  seen past and walked through: sight, the automap and the pilot read none.
- **The drift** (#1098): a ground's colour drifts across the land in swathes some fourteen squares
  across, by smooth noise of its cell (`cellNoise`), one land over the whole outdoors and a town's its
  own, well toward one of the two colours its look names over most of it (grass lush and dry, ash
  near-black and grey) and at most `by` of the way, reckoned from its colour on the first of Harvest
  (`DRIFT_DAY`) and moving its colour of the day as much, so the year turns on every swathe. It is
  one colour a square, its cell's, from wherever it is seen; rain and snow fall over it. Fifteen
  grounds of the open land drift, from grass to snow; water, roads, fields, drops and the rest keep
  one colour, nothing drifts underground and the automap's colours never do.
- **Where two grounds meet**, `src/ui/view/ground/edges.ts` (#1100): a look's `rank` (snow, then heather,
  steppe, grass, sand, dirt and ash) spills into a lower one beside it on open ground, a ragged tongue of
  its colour as drawn and a third of its marks, a fifth of the way in and two fifths at most; other looks,
  a square something stands on and a dungeon's floor take none and give none. The outline is the edge's,
  hashed from it and its corners, so an edge looks the same from both squares and from every facing.

- **A region's trees** (#1104): its look's `trees` names, by weight, those its forests and woods stand
  (`forest`) and its pinewoods (`pine`, conifers only). A square takes its region's, picked by its hash
  as before (`treeOf`, `src/ui/scenery.ts`), so a wood changes at a zone's border. Beside the five of
  old stand an oak, a willow, a poplar, a rowan, a wind-bent thorn, a larch, a Scots pine and a
  flat-topped tree of the steppe, each dressed by the year as the five are. With none named a region
  stands today's mix.
- **A region's look**, `src/content/areas/<area>/look.ts` (`Area.look`, #1097), merged by region into
  `Tables.looks`: its `air` casts the sky, the haze and the sun toward its colours by day, a fifth of
  the way at most, none by night and lost in murk. It changes at a zone's border; an ending's cast wins
  (`airOf`, `src/ui/view/sky.ts`). With none, as over the Foreland and Thornmark, the sky is as it was.

- **The features** (#1110): the view draws each feature on open ground as the automap marks it, by
  one rule (`markOf`, `src/game/ink.ts`; `src/ui/view/features.ts`), each kind a small drawing of
  `src/ui/scenery.ts`: a cairn, a chest, a camp's ring and fire, a shrine, a well, a statue, a
  fountain, a den, a sign and a rift. A spent one is gone and a burnt den is its ruin; an event and
  a person are never drawn, and a business hangs its sign over its door. A camp's fire is lit by
  night and underground, its flame drawn every frame as a torch's.
