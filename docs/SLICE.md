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
  scrolling for a long stock, a tavern's rumours a page at a time. The log over the room shows only
  what was said inside. Leaving (the last menu closed) steps the party back into the street, facing
  the door.
- **Exploration:** grid movement with 90° turns and strafing, doors, locked doors, secret doors,
  water and mountains gated by party abilities, a calendar and weather over a day/night clock (below),
  automap with field-of-view reveal, rest with food, a search action, exploration spells (Light,
  Wizard Eye).
- **Combat:** turn-based, speed-ordered; front/back rows; attack, cast, use, defend, flee;
  conditions (poison, disease, sleep, paralysis, unconscious, dead); a 12-monster cap; xp, gold and
  drops; readiness to train reported.
- **Save/load:** F5/F9 to localStorage; door changes, explored cells, group state and the rng all
  survive a reload. Saves are version 2 (the outdoors as one map, cells seen kept a bit apiece); a
  version 1 save loads, its Foreland and Thornmark state folded into the outdoors where they now lie.
  An old save is brought up to date by version, one registered upgrade a step, and
  `content/shipped.json` lists every id and placement a save may hold, so a check fails when one
  goes or moves without a bump and its upgrade (`node tools/shipped.ts` records what is new).
- **Quest log** (J): the quests the party knows of, active first, each with its next goal and a
  journal of what the party has found: The Quiet Farm (Vask), The Cargo Ledger (Hale), The
  Grove Stone (Vask's lead, Sylvane's chisel), and The Lost Expedition, which the first Meridian
  journal opens and which stays open until the rest of its trail is built. Nothing new is saved.
  Every entry is keyed to something the save already holds (a flag, a carried item, a once-only
  event, a guardian killed, a map set foot on), so an old save opens with its log whole. A quest
  begun, advanced or finished is announced once in the message log, and J opens on the one that
  changed last.

## The outdoors as one map, and the end of the world

The world map (M) charts Caldera as one land of 512 by 384 squares, divided into areas (the steps
of the road of levels) and the zones inside them (`content/atlas.ts`, `game/atlas.ts`). The game now
walks it that way too: the outdoors is one map, `caldera`, the size of the world, square for square
with the painted map (`game/outdoors.ts`, which `content/maps.ts` runs once to make
`PLAYED_DEFS`, the maps as played).

- **Zones.** Every outdoor map the atlas places is a zone, laid in 1:1 where the atlas puts it: the
  Foreland at 200,30 and Thornmark beside it at 232,30. The zone maps are still written as maps of
  their own in their areas' `maps/` folders, in their own coordinates; laying them in moves their
  features, monster groups and exits to where they sit, and leads every town's and dungeon's way
  out onto the outdoors. Outdoors, the party's zone says where it is: the name on the status strip
  and the almanac, the level band, the region whose weather it has, the palette it is painted in.
- **Walked, not jumped.** An exit from one zone map into the next is dropped: the road through the
  pass runs straight on into Thornmark, and the view looks down it. The Foreland's exit kept its flags
  as a gate on its square (`MapDef.gates`) and its arrival line as what the log says on crossing into
  Thornmark ("The pass opens onto old forest. Thornmark."; the way back says "Back through the pass
  to the Foreland."). Monster groups may follow the party over a zone's edge.
- **The end of the world.** Wherever no zone map is laid yet, the outdoors is void (`%`, the
  `void` solid): nothing crosses it ("The world ends here.") and nothing sees through it. The ring of
  mountains that closed each zone map in is, where it faces nothing built, the end of the world as
  well: the Foreland's north, west and south edges and Thornmark's north, east and south. Between the two
  the ridge stands as it was, two squares thick with the pass through it. The viewport paints the
  void as pink empty space, flat, unlit and untextured, standing up past the top of the view so it
  hides the sky as well as the ground; no weather greys it (it is cut out of the scene as it is
  painted, so anything nearer still covers it, and filled pink from behind at the end). The automap
  marks it the same pink.
- **Building more.** A new zone is a map in its area's `maps/` and a zone in the atlas with a `map`
  and an `at`; laid in, it opens the void where it stands. Where it meets a built zone, the two maps'
  rings are the border between them, to open or keep as each map's author likes.
- **Around it.** The automap draws a map that fits the panel whole, as before, and for the outdoors
  a window of 33 by 33 squares round the party at the size a 32-square map is drawn. Quests still
  name zone maps: `visited: 'thornmark'` holds once the party has set foot in the zone
  (`WorldState.zones`), and a `seen` or `slain` on a zone map reads the outdoors' state. `travel()`
  takes a zone map's own coordinates, so tools and tests can still say `shelf 16 8`.

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
  melts in a thaw or a rain. A new game draws seeds until its first morning is dry and clear.
- **Regions.** Each map names its region (`MapDef.region`, the Foreland when absent); towns and
  dungeons share their region's weather, and a test holds them to it. The Foreland is mild and wet,
  foggy off the sea in the autumn, with snow only in a cold snap; Thornmark is colder, and its
  winter snow lies deep for weeks. Fronts reach Thornmark five hours after they cross the Foreland.
- **What the sky does:** clear, cloudy, overcast, fog, drizzle, rain, downpour, thunderstorm,
  sleet, flurries, snow, heavy snow and blizzard. A shower on a threshold does not flicker: each
  strength is entered above one line and left below a lower one. The log reports changes as the
  party sees them ("Rain begins to fall.", "The rain turns to snow.", "Fog rolls in off the sea.",
  "Mist rises between the trees."), says what the sky is doing on a new game, a load or the way out
  of a dungeon, and says nothing underground.
- **What it does to play.** Thick fog or a blizzard leaves two squares of sight, thinner fog, a
  downpour or heavy snow three (a Light spell does not cut fog; underground nothing changes). Snow lying deep
  makes an outdoor step take eight minutes instead of six. In a downpour, heavy snow or thick fog,
  bows, slings and crossbows lose 2 to-hit on both sides of a fight (`MonsterDef.missile` marks
  the archers; the Ashen casters are ranged without it), and the fight's log says so. The inn wakes
  the party at 07:00, or at first light in the depth of winter.

## The road to level 10

The slice's content ends around level 4. The Thornmark extension carries a party to the level
cap, which is 10 until the road past it is built:

- **Progression.** `MAX_LEVEL` is 10; `levelUp` stops there and the sheet says so. Five spell
  tiers, unlocked at levels 1, 2, 4, 6 and 8 (`spellTierAt`). Trainers charge 25 a level to 5 and
  40 a level after; the Warden Drillyard in Helmstow teaches to 6, the Elder's Yard in Thornhold to
  10. Guilds sell up to a tier of their own (`maxTier`: Helmstow 2, Thornhold 4) at 40, 80, 160, 320
  gold; tier 5 comes only with level 8.
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
  class picker and the character sheet. Knight: Stalwart (+2 AC), Weapon Master (+1 melee).
  Paladin: Holy Strike (+3 on the mindless dead), Divine Health (no disease). Ranger: Marksman (+2
  ranged), Keen Eyes (always finds secret doors). Cleric: Healing Hands (+3 on heals), Faith (no
  curses). Sorcerer: Spellfire (+2 per foe on damage spells), Iron Will (no sleep). Thief: Sneak
  Attack (+4 in round one), Keen Eyes. Barbarian: Rage (+3 melee below half hp), Die Hard (dies at
  -20). Monk: Unarmoured Defence (robe or less: +1 AC, +1 per two levels), Stillness (no
  paralysis). Bard: Inspiring Song (+1 to-hit for the party while standing). Druid: Nature's Ward
  (no poison), Healing Hands.

## Art

Everything is drawn at runtime from vector shapes; there are no bitmaps in the repo.

- `ui/brush.ts` is a minimal `ShadeTarget`, so sprites and portraits paint with the engine's own
  cel-shading helpers (`celBall`, `celCapsule`, `celPoly`, `band`) and share the sibling games' look:
  1px ink outline, three tones, top-left light.
- `ui/portraits.ts` builds a front-facing portrait per character from the name, race and class
  (head shape, ears, skin, hair, beard, class headgear), with the expression following the
  character's state, cached to an offscreen canvas.
- `ui/sprites.ts` holds the trees, rocks, mountains and pillars and dispatches the monsters to
  `ui/monsters/`, one module per family (rat, slime, wolf, boar, spider, bandit, cultist, skeleton,
  riftling, ogre, wraith) behind one `draw(ctx, kind, x, y, h, paint)` signature; `common.ts` has
  the brush, the small shape helpers and the humanoid frame. Every monster def names a distinct
  sprite kind, so the variants that share a family (the archers and brigands, the cult's ranks,
  the bone knight, the dire wolf and rift hound, the elder and the two wardens) are drawn with
  their own gear, anatomy and glow rather than a recolour.
- `ui/monsters/gloss.ts` is how the monsters stop looking like outlined primitives, after the Xeen
  look: `blob()` paints every part of one material (a wolf's fur, a robe, a hide) as a single
  mass, with one ink outline around the union, one rendered gradient across the whole (a bright
  core toward the light, a deep band at the far edge), then, clipped inside, a soft volume per
  part, creases where forms meet, a surface texture (fur, bristle, stipple, scales, mail, cracks,
  folds, facets; only above a minimum sprite height) and a specular where the surface is wet or
  crystalline. Contours are `curve` parts (a spline through points, lumpy or fur-tufted) and
  `tube` parts (a bending tapered tube for tails, necks, legs and tentacles); `glow()` is a real
  radial light for embers and halos; `softLine()` replaces interior ink. The hit flash still
  paints a flat white silhouette through all of it.
- Combat sprite height comes from `combatHeight()` in `ui/sprites.ts`, which scales with how many
  monsters share the row: a lone enemy or a pair fills the viewport the way a Xeen monster does,
  three and four taper down, five is the old flat size and six goes under it. The row's spacing is
  fixed, so every extra monster is width its neighbours do not have.
- `ui/viewport.ts` textures every surface procedurally: stone courses (front faces and receding
  side faces), timber-framed houses with hipped roofs and windows lit at night, flagstones with
  mortar, grass tufts, pebbles, waves; a sky with a sun and moon on the compass, clouds, stars and
  two bands of distant hills that turn with the party. The static scene is cached per world state
  and monsters are drawn over it each frame with a line-of-sight check.
- `ui/interior.ts` and `ui/interiors/` paint the twelve businesses' interiors, one per business
  (`interior` on the map feature names it): the Hearthlight's common room round its fire and the
  Green Man's under a carved face of leaves; the Chapel's stained-glass apse and the Chapterhouse's
  grove; the Provisioner's pigeonholes and the Armoury's forge; the Guildhall's map of Caldera and
  the Lantern Hall's copy of the Grove Stone; the Drillyard inside Helmstow's wall and the Elder's
  ring of stones; the Gilded Eel's harbour window and the Split Oak's living oak. No people: the
  rooms are backdrops. `kit.ts` has the walls, floors, windows and light, `props.ts` the furniture
  and goods; each scene is a file in `ui/interiors/<area>/`, and what both towns' scenes of a trade
  use is in `shops.ts`, `guilds.ts`, `yards.ts` and `taverns.ts`. A scene is painted once into an
  offscreen canvas and
  multiplied by a light map (the ambient for the hour plus a pool round every lamp, fire and
  window it put down), so the corners fall dark on their own; flames, glows and drifting motes are
  drawn over it every frame. Windows and the two yards follow the clock.
- The Xeen pass: saturated palette with no distance fog outdoors; per-cell wall dressing chosen by
  hash (torch sconces with flames animated over the cached scene, banners in the map's colour,
  cobwebs, cracks, damp streaks, iron rings, barred grates, carved glyph panels; on houses a shop
  sign with a glyph for the service, a lantern lit after dark, flower boxes, ivy); map palettes
  choose `wallStyle` (stone or brick) and `ceilingStyle` (vault or timber beams); cobbled roads,
  flowers in the grass, cracks and puddles on flagstones; a carved plank frame with brass fittings
  and rivets; a painted title looking west over the sea at the Hearth.
- Final polish: pitched, hipped, tiled roofs that run across adjoining cells with eaves, ridge caps
  and a chimney, keyed per building (one roof per building, projected like the walls, so its front
  and side slopes meet along their hips); timber bracing and a window on house side faces; a birch
  tree variant; a parchment automap with inked walls and a compass rose; hit sparks and a red card
  flash in combat when someone takes damage.
- Weather and seasons: the cached scene is two canvases now, the sky and everything in front of
  it, so a lightning strike can light the whole sky behind the roofs and trees and fork down
  behind the hills. An overcast sky greys over with a cloud deck and hides the stars, sun and moon;
  a downpour darkens it; fog washes it out. In the scene, cloud lays a flat grey light over
  everything, murk (fog, or rain or snow coming down hard) swallows far faces into the haze, rain
  darkens the ground and leaves puddles holding the sky on the roads, and lying snow whitens the
  ground, the cobbles, the roofs, the hills, the rocks and the conifers' boughs. The grass runs
  from spring green to tawny through the year. Hills rise as round-shouldered mounds of drier
  grass that run on into one another (drawn only: they hide nothing yet); farmland lies in fields
  three squares long in bands two deep, each with its crop (wheat, barley, pasture, roots) green in
  Sowing, gold or cut by Harvest and ploughed through the winter, its rows or furrows and the
  hedges between fields showing under snow. Broadleaf trees bud in Thaw, blossom in Sowing,
  turn orange and gold in Leafturn, brown and drop in Mistfall and stand bare through the winter
  (`treeSeason()` in `ui/sprites.ts`); flowers only come out between Sowing and Leafturn. Lamps
  and windows light early on a dark day. Every frame, over the scene (and over the monsters in a
  fight): rain as streaks in three depths, more, longer and slanting harder with the wind across
  the view, splashing only on floor the party can see; snow as flakes that sway and blow, nearly
  flat in a blizzard; fog banks drifting low; and the flash of a strike. Particles take their
  positions from `mixHash()` in `game/weather.ts`, which mixes well enough that a drop's x is
  unrelated to its y (`hash()` in `ui/brush.ts` does not). All of it costs a fraction of a
  millisecond a frame.

## Stubbed or absent

- No guilds but the two Lantern spell guilds, so no guild quests.
- No prestiges and no spells past tier 5; no Master trainers; no secondary skills yet beyond race
  innate ones. The Meridian journal opens The Lost Expedition in the quest log, but nothing reads it
  yet and no second volume exists.
- No audio. The engine's synth stack is vendored, unused.
- Prestiges, guilds, the succession, the Salt Compact, the Lost Expedition past its first journal:
  design only.

## Checks

`npm run check` runs three gates, each verified to be able to fail:

- `typecheck`: `tsc --noEmit`, strict, zero suppressions. It is the first content check: a monster
  with no drawing, a business with no room or a map in a region no area has fails it.
- `test`: `node tools/test.ts`, the suites in `tools/tests/`, one file each, which the runner finds
  (maps, movement, monsters, combat, harness, party, traits, calendar, terrain, weather, atlas,
  outdoors, save, quests, then any other in name order), then each area's walkthrough where it has
  one, in road order. Every check prints a line saying what it holds, so the output is the list;
  `node tools/test.ts maps combat` runs a few suites.
- `smoke`: `node tools/smoke.ts`, headless Chromium playing the game through the dev server: every
  screen painted with no page error, and a line for each check as well. Every run plays the same
  world (`SMOKE_SEED`; `SMOKE_SEED=random` tries another and prints it). It holds every monster to
  one silhouette, and sweeps for cracks between walls: one way from every square of the cellar and
  Helmstow each run, all four ways on the maps changed since `SMOKE_BASE=<ref>` (CI passes the
  pull request's base; `node tools/changed.ts <ref> maps` names them), or on those
  `SMOKE_SWEEP=all|<id>,<id>` names.

`node tools/shot.ts out.png [map x y facing] [keys...]` screenshots any state for eyeballing (a zone map takes its own coordinates: `shelf 1 12 3` faces the end of the world). Besides
keys it takes `fight:<group>`, `time:<hour>`, `walk:<n>`, `day:<n>` (game day n at the same hour),
`seed:<n>` (the weather seed) and `sky:<kind>[:night]`, which moves the clock to the next hour of
daylight (or night) with that sky in the current region, e.g.
`node tools/shot.ts rain.png shelf 16 8 2 seed:11 sky:downpour`.
`node tools/gallery.ts out.png [--only kinds] [--family wolf] [--scale 2] [--frames 6] [--flash] [--tone 0.6]`
renders every monster (or one family) at the combat size with the viewport sizes underneath, or
as a strip of idle frames ending in the hit flash, for judging an art pass.
`node tools/interiors.ts out.png [--only hearthlight_inn,split_oak] [--scale 2] [--hour 21]` renders
the businesses' interiors as the viewport shows them, at an hour of the day.
`node tools/harness.ts [--levels 2,6,10] [--roles soldier,brute] [--under 2] [--map thornmark --level 5] [--stats] [--calibrate --write] [--spell-cap 10] [--gear-grows] [--level-bonus] [--level-traits]`
fights the premade company at a level against standard encounters of the test monster, or a map's
own groups, one after another until it must rest, and says how many it managed against the six or
seven an encounter at its level should allow (docs/MONSTERS.md §4.4). `--spell-cap` tries a world
where damage spells stop growing at that level, `--gear-grows` one where the company's gear keeps
growing past Thornmark's, `--level-bonus` one where every member gains a point of damage and of
armour every two levels past 10, and `--level-traits` one where fighters strike once more a turn
from 11 and again from 29, and sneak attacks grow.

## Code map

| File | Owns |
|---|---|
| `game/map.ts` | the terrains (hills and farmland named as the atlas names them), `MapDef` (rows + legend + features + encounters, and on the outdoors its gates and zones), `GameMap` queries (passable, blocksView, the zone and palette at a cell); the void |
| `game/outdoors.ts` | `layOutdoors`: the maps as played, the placed zone maps laid into one outdoors the size of the world, void where nothing is built, their ways between them walked and gated |
| `game/world.ts` | `WorldState` (position, clock, weather seed, per-map state with cells seen in bits, zones set foot in; a group a map has gained since a save, and a saved door only where the map still has one), the zone the party is in and what it is called, movement across zones and gates, reveal, the weather's reach into play (sight, snow, the log, the almanac, fights), roaming groups, encounter triggers, rest, search |
| `game/calendar.ts` | the months and seasons, dates, and dawn and dusk through the year |
| `game/weather.ts` | the `Climate` shape (each area has its own, merged as `CLIMATES` in `content/index.ts`), `weatherAt` (the sky, the temperature, snow lying, wet ground), naming the sky and its log lines, and what it does to sight, steps and bows |
| `game/party.ts` | races, classes, `Character`, `Party`, conditions, equip, levelling and the trainer's price, the premade party |
| `game/save.ts`, `game/upgrades.ts` | the save and `SAVE_VERSION`; the upgrades, each registered by the version it brings a save to and run in turn on load, with what they need of the world as it was kept frozen |
| `game/combat.ts` | `CombatState`, `startCombat`, `currentTurn`, `partyAct`, `monsterAct`; pure and seeded |
| `game/quests.ts` | `questLog` (the quests known, their entries and goal, worked out from the world state and party), `questNews` (what changed between two looks) |
| `game/game.ts` | `Game` (screen stack, save/load, interactions) and `ExploreScreen` |
| `ui/viewport.ts` | the depth-layered first-person compositor, the sky, the end of the world in pink, and the weather drawn over it |
| `ui/frame.ts` | layout constants, status strip (time, date, the sky and its glyph), automap (whole, or a window round the party on the outdoors), party cards, log, purse |
| `ui/screens.ts` | message, choice, character sheet, spell picker, inn/temple/shop/guild/trainer, and the visit that frames them (`InteriorScreen`) |
| `ui/interior.ts`, `ui/interiors/` | the businesses' interiors: the painting kit and the props, a scene to a file in `<area>/`, and the helpers a trade's scenes share |
| `ui/combat.ts` | the combat screen (menus over the resolver) |
| `ui/quests.ts` | the quest log screen, and `questPage`, its pure page layout |
| `ui/sprites.ts`, `ui/monsters/*.ts` | scenery sprites, the trees dressed by the season; the monster drawings by family, and the shared brush and helpers |
| `ui/create.ts` | party creation |
| `content/index.ts` | the areas in road order, the tables merged from them (maps, monsters, items, spells, quests, climates), and the `MonsterSprite`, `Interior` and `RegionId` unions made from them |
| `content/areas/<area>/` | an area: its maps, monsters, items, quests, climate and part of the world map, and the sprite kinds and rooms it brings (`index.ts`); each has a doc in [docs/areas/](areas/) |
| `content/items.ts`, `content/spells.ts` | the items no area owns (the class kits, the starting bag, the iron key) and the spells |
| `content/progression.ts` | the curve: each area's band, next floor and price window, the xp and gold a clear should give, and what is owed; checked by `tools/tests/curve.ts` |
| `content/maps.ts` | the maps as played: `PLAYED_DEFS`, the outdoors laid out, and `buildMaps` |
| `content/shipped.json` | what a save may refer to: each played map's size, chests, once-events, groups and door squares, the zones' places, the flags, items, spells, classes, races and conditions; written by `tools/shipped.ts`, held to by `tools/tests/shipped.ts` |
| `content/atlas.ts` | the world map's plan: the land, the areas of the road, and the zones, places and sites not built yet; each area charts its own in `areas/<area>/atlas.ts`, and `content/index.ts` merges them into `ATLAS` |
