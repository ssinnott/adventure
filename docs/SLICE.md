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
  first menu, its own trade, the guild's work and Leave, which each choice returns to; a business
  with its trade alone opens straight on it. The guild's work pays what is done, then offers the
  quests at or under the company's rank. Membership and rank are worked out from the guild quests'
  done flags, and a rank reached is kept by its own flag (`game/guilds.ts`). The Warden Drillyard
  is the Wardens' hall, and the Lantern Guildhall and the Thornhold Lantern Hall the Lanterns'. A
  spell hall's fee buys the right to study, not membership.
- **People in a business:** a person with no room of their own on a business's doorway, listed after
  it, is in the business while present, and its first menu offers "Talk to <name to its first
  comma>" after its trade and the guild's work; the menu is made when drawn, so a person an answer
  sends away is gone from it. A tavern (the Gilded Eel, a person with a room) with people in it says
  its room first, over a menu of "The talk of the room" and them. With nobody there, a business
  opens as before.
- **Exploration:** grid movement with 90° turns and strafing, doors, locked doors, secret doors
  (each with a hint on its near side, the event or sign `MapDef.secrets` names), water and mountains
  gated by party abilities, hills (`^`), farmland (`f`), light woods (`t`) and dead wood (`d`, on no
  built map yet) open to all, the Sunder's glass trees (`c`) and chasm (`v`), on none yet, a
  calendar and weather over a day/night clock (below), automap with field-of-view reveal, rest with
  food, a search action, exploration spells (Light, Wizard Eye). The wilderness features (a shrine
  on F2; the rest on E2): a shrine or fountain that gives every member a stat point once, a cairn
  with a cache, a statue whose riddle takes its answer typed and a camp where the party may rest
  with monsters two squares off; a hermit is a person. Dens (E2's rookery and D3's bandit camp; #69
  places more): a camp that breeds one kind of monster, its brood back one a pace at their posts
  while it stands, guarded by keepers beside it that never leave. Its look is said when first seen;
  its keepers dead, a step or Space asks to burn it, and burnt it gives its hoard, breeds no more
  and shows as ash on the automap.
- **Combat:** turn-based, speed-ordered; front/back rows; attack, cast, use, defend, flee;
  conditions (poison, disease, sleep, paralysis, unconscious, dead); a 12-monster cap; xp, gold and
  drops; readiness to train reported. Every monster is a beast, a person, the dead, the Rift or a
  machine: the dead and machines never sleep, and a def may shrug off more of its own (`immune`).
  Gear may carry a plus: a point is +1 to hit and damage on a weapon, +1 armour class on armour or
  a shield (`P`, `src/content/items.ts`).
- **Save/load:** F5/F9 to localStorage; door changes, explored cells, group state and the rng all
  survive a reload. Saves are version 2 (the outdoors as one map, cells seen kept a bit apiece); a
  version 1 save loads, its Foreland and Thornmark state folded into the outdoors where they now lie.
  An old save is brought up to date by version, one registered upgrade a step, and
  `content/shipped.json` lists every id and placement a save may hold, so a check fails when one
  goes or moves without a bump and its upgrade (`node tools/shipped.ts` records what is new). A
  map edited since the save still takes it: a group the map has gained stands where the map puts
  it, and a saved door goes back only where the map still has a locked or secret door. A save
  keeps the kinds of monster the company has met (`met`); one made before has met none.
- **People** (`game/people.ts`): a person's first meeting may hire (one flag or several) and end in
  a question put through the choice screen, whose answer sets flags, may hand over an item and has
  its own words; a question once answered is not put again, and Esc answers nothing. A person may
  say other words once a flag holds, by night or until a flag (`says`, wearing `Presence`, the first
  that holds said, furthest along first), and take several items (`quest` one or a list, one a
  meeting, in order; one paying nothing says no gold line). An item with `text` is a letter, read
  from the pack in a box. A person and an event wear `Presence` as a group does: there only in their
  hours (by night), once their `after` holds and until their `until` does, so one person can stand
  in two places, one at a time, and a once-event by night is not spent by day (`World.present`; the
  automap shows only who is there). The Foreland's side quests are built on them (#77).
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
  Foreland at 200,30 (G2), Thornmark at 232,30 (H2) and Callow Downs' first six boxes, F2 at 168,30,
  F3 at 168,62, E3 at 136,62, E2 at 136,30, D3 at 104,62 and D4 at 104,94. The zone maps are still
  written as maps of their own in their areas' `maps/` folders, in their own coordinates; laying
  them in moves their features, monster groups and exits to where they sit, and leads every town's
  and dungeon's way out onto the outdoors. Outdoors, the party's zone says where it is: the name on
  the status strip and the almanac, the level band, the region whose weather it has, the palette it
  is painted in.
- **Walked, not jumped.** An exit from one zone map into the next is dropped: the road through the
  pass runs straight on into Thornmark, and the view looks down it. The Foreland's exit kept its
  arrival line as what the log says on crossing into Thornmark ("The pass opens onto old forest.
  Thornmark."; the way back says "Back through the pass to the Foreland."). The pass is open to any
  company: a sign at the Warden checkpoint, on the one square the pass is entered from, warns it,
  and Thornmark's monsters decide. Monster groups may follow the party over a zone's edge. An exit
  with flags still becomes a gate on its square (`MapDef.gates`; the outdoors suite holds a fixture
  to it), but none is left between the zones.
- **The end of the world.** Wherever no zone map is laid yet, the outdoors is void (`%`, the `void`
  solid): nothing crosses it ("The world ends here.") and nothing sees through it. The ring of
  mountains that closed each zone map in is, where it faces nothing built, the end of the world as
  well: the Foreland's north and south edges, F2's and E2's north (the rim, cut for good), E2's west
  until D2 is built, E3's south, D3's north until D2 is built and its west, beyond the cliff and the
  Upper Water's void, D4's west and south, where the Delta begins, and Thornmark's north, east and
  south. Between the Foreland and Thornmark the ridge stands as it was, two squares thick with the
  pass through it; between the Foreland and F2 it is the Foreland's ring alone, with the Salt Road
  through a gap at 0,29. The viewport paints the void as pink empty space, flat, unlit and
  untextured, standing up past the top of the view so it hides the sky as well as the ground; no
  weather greys it (it is cut out of the scene as it is painted, so anything nearer still covers it,
  and filled pink from behind at the end). The automap marks it the same pink.
- **Building more.** A new box is a map in its area's `maps/` and `index.ts`, marked `density`
  core or country, and a line in its zone's `maps` in its area's `atlas.ts`, the map at its box's
  corner; `node tools/scaffold.ts` cuts its first draft from the atlas and names its box. Laid in, it
  opens the void where it stands. Where it meets a built zone, the two maps' rings are the border
  between them, to open or keep as each map's author likes; where it meets the atlas, its water and
  roads carry on into the land beyond its edge (`tools/tests/pillars.ts`).
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
  melts in a thaw or a rain. A new game draws seeds until its first morning is dry and free of fog.
- **Regions.** A region is an area, with its `climate` in its `index.ts`. Each map names its region
  (`MapDef.region`, the Foreland when absent); towns and dungeons share their region's weather, and
  a test holds them to it. The Foreland is mild and wet, foggy off the sea in the autumn, with snow
  only in a cold snap; Thornmark is colder, and its winter snow lies deep for weeks. Fronts reach
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
  already hold all they read. Thornmark's Rift stops coming back once the Warden of the Cut is dead.

## The road to level 10

The slice's content ends around level 4. The Thornmark extension carries a party to the level
cap, which is 10 until the road past it is built:

- **Progression.** `MAX_LEVEL` is 10; `levelUp` stops there and the sheet says so. Five spell
  tiers, unlocked at levels 1, 2, 4, 6 and 8 (`spellTierAt`). Trainers charge 25 a level to 5 and
  40 a level after (`trainPrice` in `party.ts`, which the curve's gold reads); the Warden Drillyard
  in Helmstow teaches to 6, the Elder's Yard in Thornhold to 10. Guilds sell up to a tier of their
  own (`maxTier`: Helmstow 2, Thornhold 4) at 40, 80, 160, 320 gold; tier 5 comes only with level 8.
- **The curve** (`content/progression.ts`). Each area has a band, the floor of the next and a price
  window: the Foreland 1-5 and 500 gold, Thornmark 5-10 and 1,200. Three quarters of a clear's xp
  should take a member to the next floor, and its gold train the six there; every monster has a
  `level` within two of its maps' bands, rising from the way in (it changes no combat yet), and no
  chest or drop is dearer than the window. Neither clear gives the xp yet (the Foreland 1,770 a
  member of 3,734, Thornmark 10,227 of 13,667), nor Thornmark's the gold (6,518 of 8,400):
  `tools/tests/curve.ts` reports them as #26's.
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

- `ui/brush.ts` is a minimal `ShadeTarget`, so sprites and portraits paint with the engine's own
  cel-shading helpers (`celBall`, `celCapsule`, `celPoly`, `band`) and share the sibling games' look:
  1px ink outline, three tones, top-left light.
- `ui/portraits.ts` builds a front-facing portrait per character from the name, race and class
  (head shape, ears, skin, hair, beard, class headgear), with the expression following the
  character's state, cached to an offscreen canvas.
- `ui/sprites.ts` holds the trees, rocks, mountains and pillars and dispatches the monsters to
  `ui/monsters/`, one module per family (rat, slime, wolf, boar, spider, bandit, cultist, skeleton,
  riftling, ogre, wraith, birds, old wood) behind one `draw(ctx, kind, x, y, h, paint)` signature;
  `common.ts` has the brush and the small shape helpers, and `figure.ts` the measured humanoid frame
  the bandits, the cult and the skeletons stand on. Every monster def names a sprite kind no other
  def uses (`tools/tests/art.ts` holds it), so the variants that share a family (the archers, brigands,
  smugglers, wrecker and lampman, the cult's ranks, the bone knight, the ghoul, the drowned man
  and the Barrow Guard and Captain, the dire wolf, rift hound and Black Dog, the thorn spider, shore
  crab and rift crawler, the crow and the great owl, the elder and the two wardens, the bramble,
  rootwalker, heartwood and the Eldest) are drawn with their own gear, anatomy and glow rather than
  a recolour.
- `ui/monsters/gloss.ts` is how the monsters stop looking like outlined primitives, after the Xeen
  look: `blob()` paints every part of one material (a wolf's fur, a robe, a hide) as a single
  mass, with one ink outline around the union, one rendered gradient across the whole (a bright
  core toward the light, a deep band at the far edge), then, clipped inside, a soft volume per
  part, creases where forms meet, a surface texture (fur, bristle, stipple, scales, mail, cracks,
  folds, facets; only above a minimum sprite height) and a specular where the surface is wet or
  crystalline. Contours are `curve` parts (a spline through points, lumpy or fur-tufted) and
  `tube` parts (a bending tapered tube for tails, necks, legs and tentacles); `glow()` is a real
  radial light for embers and halos; `softLine()` replaces interior ink. The hit flash still
  paints a flat white silhouette through all of it. Each monster is one piece of ink at combat
  size, alone, three and six abreast, through its idle, but for the parts `DETACHED` in
  `tools/smoke.ts` declares apart (the wardens' shards, the acolyte's censer, the lampman's
  lantern, the adept's hand flame, the rift hound's and the Hand of Ash's embers, the wraith's
  fading cloth), and stands inside the view where a fight seats it, its foot 184 px below the
  view's top (`seatFoot`); the smoke test holds it.
- Combat sprite height comes from `combatHeight()` in `ui/sprites.ts`, which scales with how many
  monsters share the row: a lone enemy or a pair fills the viewport the way a Xeen monster does,
  three and four taper down, five is the old flat size and six goes under it. The row's spacing is
  fixed, so every extra monster is width its neighbours do not have.
- `ui/viewport.ts` textures every surface procedurally: stone courses (front faces and receding
  side faces), timber-framed houses with hipped roofs and windows lit at night, flagstones with
  mortar, grass tufts, pebbles, waves; a sky with a sun and moon on the compass, clouds, stars and
  two bands of distant hills that turn with the party. The static scene is cached per world state
  and monsters are drawn over it each frame with a line-of-sight check.
- `ui/interior.ts` and `ui/interiors/` paint the thirteen businesses' interiors, one per business
  (`interior` on the map feature names it): the Hearthlight's common room round its fire and the
  Green Man's under a carved face of leaves; the Chapel's stained-glass apse and the Chapterhouse's
  grove; the Provisioner's pigeonholes and the Armoury's forge; the Guildhall's map of Caldera and
  the Lantern Hall's copy of the Grove Stone; the Drillyard inside Helmstow's wall and the Elder's
  ring of stones; the Gilded Eel's harbour window and the Split Oak's living oak; the throne room
  behind the keep's door, its throne under black cloth. The farm kitchen is Ellerby's store
  (#87). No people: the rooms are backdrops. `kit.ts` has the walls, floors, windows and
  light, `props.ts` the furniture and goods; each scene is a file in `ui/interiors/<area>/`, and
  what both towns' scenes of a trade use is in `shops.ts`, `guilds.ts`, `yards.ts` and `taverns.ts`.
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
  (`MapDef.banners`), which hang whatever the hash says; map palettes choose `wallStyle` (stone or
  brick) and `ceilingStyle` (vault or timber beams); cobbled roads, flowers in the grass, cracks and
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
  another (slow going; they hide nothing yet); farmland lies in fields three squares long in bands
  two deep, each with its crop (wheat, barley, pasture, roots) green in Sowing, gold or cut by
  Harvest and ploughed through the winter, its rows or furrows and the hedges between fields showing
  under snow. Light woods (`t`, the atlas's woods) are walked through at a plain step: a shaded
  floor of moss, leaf litter and ferns with a tree or two to either side of the square, the way
  through it open. Dead wood (`d`) is walked the same, over grey ground and fallen limbs, its trees
  long dead: bleached trunks, bare or snapped short, with no green in any season. A glass tree (`c`,
  on crystal) stands where a tree would and blocks as one, shards of crystal catching a point of
  light by day. The chasm (`v`) is no wall and is seen across, but a step into it is refused ("The
  ground falls away. There is no way down here."); where ground stands beyond it, its far wall hangs
  from the rim in bands of rock darkening into the drop. Broadleaf trees bud in Thaw, blossom in
  Sowing, turn orange and gold in Leafturn, brown and drop in Mistfall and stand bare through the
  winter (`treeSeason()` in `ui/sprites.ts`); flowers only come out between Sowing and Leafturn.
  Lamps and windows light early on a dark day. Every frame, over the scene (and over the monsters in
  a fight): rain as streaks in three depths, more, longer and slanting harder with the wind across
  the view, splashing only on floor the party can see; snow as flakes that sway and blow, nearly
  flat in a blizzard; fog banks drifting low; and the flash of a strike. Particles take their
  positions from `mixHash()` in `game/weather.ts`, which mixes well enough that a drop's x is
  unrelated to its y (`hash()` in `ui/brush.ts` does not). All of it costs a fraction of a
  millisecond a frame.  ## Stubbed or absent
- No prestiges and no spells past tier 5; no Master trainers; no secondary skills yet beyond race
  innate ones. The Meridian journal opens The Lost Expedition in the quest log, but nothing reads it
  yet and no second volume exists.
- No audio. The engine's synth stack is vendored, unused.
- Prestiges, the Cartographers' and the Compact's halls, the succession, the Salt Compact, the
  Lost Expedition past its first journal: design only.
- What the checks owe: a known shortfall prints as `owed` with the issue that owes it, and
  `node tools/test.ts` ends by counting them. Both clears give less xp than the curve asks, and
  Thornmark's less gold (#26); the gate's limits for a boss's odds are missed on the Foreland
  (#47, the Rift Warden's odds #87's), and its fights to a rest are off their aim, as is the share
  of the Foreland's fights won two under its floors, which only E3's groups make yet.

## Checks

`npm run check` runs three gates, each verified to be able to fail:

- `typecheck`: `tsc -p tsconfig.json` (no emit, strict, over `src/`, `tools/` and `types/`), zero
  suppressions. It is the first content check: a monster with no drawing, a business with no room
  or a map in a region no area has fails it.
- `test`: `node tools/test.ts`, then `node tools/tests/runner/check.ts`, the runner's own check,
  which runs it on `tools/tests/runner/fixture/` so the fixture's failures stay out of the real
  run. The suites are in `tools/tests/`, one file each exporting a function of its name (`lib.ts`
  is what they share), which the runner finds (maps, movement, monsters, combat, harness, party,
  traits, calendar, terrain, weather, atlas, outdoors, save, quests, then any other in name order),
  then each area's walkthrough (the Foreland's and Thornmark's), in road order. Every check prints a
  line saying what it holds, so the output is the list; `node tools/test.ts maps combat` runs a few
  suites, `walkthrough:<area>` one walkthrough. A check someone owes is reported, not failed:
  `owed()` in `tools/tests/lib.ts` prints `owed: <what> (#40's)`, and fails once the check holds,
  so the entry is dropped. The last line counts them by whose, as `ALL OK (3 owed: #40 ×2, #43 ×1)`.
  The curve, the gate and the pillars owe today, and the curve and the gate fail a miss that grows
  past where it was owed.
- `smoke`: `node tools/smoke.ts`, headless Chromium playing the game through the dev server: every
  screen painted with no page error, and a line for each check as well. Every run plays the same
  world (`SMOKE_SEED`; `SMOKE_SEED=random` tries another and prints it). It holds every monster to
  one silhouette and every pair of sprite part kinds to a union with no hole, and sweeps for cracks
  between walls: one way from every square of the cellar, Helmstow and its keep each run, all four
  ways on the maps changed since `SMOKE_BASE=<ref>` (CI passes the pull request's base;
  `node tools/changed.ts <ref> maps` names them, and `monsters` or `interiors` the sheet's), or on
  those `SMOKE_SWEEP=all|<id>,<id>` names. `SMOKE_SHOT=<png>` saves a screenshot of the play, which
  CI keeps when the smoke test fails.

CI (`.github/workflows/checks.yml`) runs the three as jobs of their own on every pull request, and
a fourth, `sheet`, which attaches the contact sheet and gates nothing. A run started by hand skips
the sheet and sweeps every map for cracks.

The suites after `quests` hold the content to its contract (EXPANSION §5), over every area and most
over content broken on purpose too, and two tools to theirs:

- `structure` (§5.1): no iron key behind its own lock however the keys are spent, no guardian that
  comes back, every respawn 720 to 2,880 minutes, every group's, person's and event's `until` and
  `after` naming something real (an `until` only on a group that comes back), no sky asked
  underground, and every Rift group of Thornmark's that comes back stopping with the tear.
- `curve` (§5.2): each area against its row in `content/progression.ts`: its band, the xp and gold a
  clear gives, its monsters' levels in their maps' bands, groups harder with steps from the way in,
  no chest or drop dearer than its window.
- `gate` (§2.2, §5.2): `tools/gate.ts`'s bot plays the premade company, dressed by the gear ladder,
  against every group alone; each map is held to its band, and each area pools its groups, each
  fought at its own map's floor: nine fights in ten won at the floor, a quarter at most two under it
  (of a map whose floor is its area's, and of the area, a zone map's groups two under its own floor
  and a town's or dungeon's two under the area's), a boss three to seven times in ten, 6.5 fights to
  a rest give or take one, its bosses left out of the day and each zone's road walked at its floor
  eight times in ten, its nearest groups at its way in among its gentlest. A group that walks only
  in fog is fought with the bows' toll; one that waits on an `after` is no warning at the way in.
  Each figure has an aim (these) and a limit beyond it (#273): between the two it passes and is
  listed at the end of the suite as off its aim, and only past its limit does it fail or go into
  `OWED`. A den's keepers are its camp's hardest fight, won no more often than any of its brood; its
  brood's number and pace are printed.
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
- `pillars` (§5.4): a hint on the near side of every secret door, there always; no text past three
  lines of the log, nor a square's texts that can show together (day and night, or `until` and
  `after` the same thing, never do) past the log's four; no monster's look past two, every glyph in
  the font, British spelling; each `Area.novel` holds; water and roads carry on into the atlas;
  story locks (`content/locks.ts`) signed in, none between areas and every hand-in taking its item
  at the first meeting.
- `people` (§2.3): every hand-in takes its item at the first meeting; Vask, Hale and Sylvane
  each played hired first and early, the words, the pay and the log true either way round; every
  person's words fit the box (a hand-in's with its gold line), a question leaves room for its
  answers and an answer that hands over an item sets a flag. A fixture town holds the rest: a
  question and its two roads read by the log and the save list, words by flag and by night,
  several hand-ins, a letter, a person gone from one place and found in another, one by night and
  events by night or by flag.
- The walkthroughs (EXPANSION §5.8): `walkthrough:shelf` plays The Quiet Farm from a new game,
  `walkthrough:thornmark` the chain and then Thornmark taken early, before Vask's hire and after it
  but before the wand. Each step, by the game's own moves (`tools/walk.ts`): the goal is the
  chapter's, placed at a built map its words name, at the curve's level for it, which sits in the
  place's band; its fights are won once in ten by the gate's bot at that level; the play moves the
  goal on; a person who takes an item stands at the step's place; and nothing a person says is
  written into a chapter already done. Early, the goal comes from no chapter past the last begun,
  each end is said once and the log ends with the entries of the order played. The quests suite
  holds every zone on the road of the built areas to a step of the quest; the Deepthorn's is owed
  to #49.
- `shipped` (§5.5): nothing in `content/shipped.json` goes or moves without a `SAVE_VERSION` bump
  and its upgrade; `node tools/shipped.ts` records what is new.
- `glyphs`: every symbol `src/ui/` draws past plain ASCII (arrows, stars, hearts) is in the pixel
  font, so none is painted as nothing.
- `drawn`: every group on the maps is drawn while exploring as each of its kinds, to three, and a
  band seen ahead is met as each kind drawn.
- `labels`: every group on the maps as played, alone and in every fight of up to three a map brings
  together, labelled with each kind and its count of the living, but for a lone proper name ("The
  Eldest, 2 Heartwoods"). A kind leaves the label when its last one falls; every line stays inside
  the view and above the monsters' markers, running into no other.
- `art` (§5.6): every monster def its own sprite kind, each family module's `KINDS` the kinds
  `FAMILY` sends it and the walls dressed under their caps, each kind at its rate; a secret door
  outdoors among mountain, rock or trees drawn as they are (`drawnCell`), and any other door, or one
  in a wall or a town, left a door.
- `changed`: which files count every map, monster or interior for the crack sweep and the sheet, and
  which only their own; and that it reads each family module's `KINDS` from the module's text as the
  module lists them.
- `scaffold` (§8.2): the Downs' draft, the Deepthorn's first and J4 and the Sunder's K3, their
  light woods, dead wood, chasm and crystal and all, laid back into the atlas, are the atlas square
  for square.
- `ladder`: every class betters its kit by level 3 and again by level 5 (`GEAR` in
  `tools/harness.ts`), every find is an item within the Foreland's window and owed to its box until
  a chest, cairn or statue gives it or a monster drops it, Mottram's sells the band's gear and the
  gate check's company wears what harness's does; every class finds a plus it can use in Thornmark,
  each in the ladder by 9, and nothing there gives the Armoury's gear.

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
map as M does, and with `--zones` the zone overlay over it.
`node tools/sheet.ts out.png --area thornmark` (or `--maps`, `--monsters` and `--interiors` with ids)
makes a pull request's contact sheet: each map from its arrivals and, outdoors, its sites, by day
and by night (a dungeon once, lit), with the automap revealed and its crop of the world map; each
monster as a strip ending in the hit flash; and each interior at noon and at night. The world is
pinned, so the same tree makes the same PNG; an unknown flag or id, a flag given twice or one with
no value is refused. `--changed <base>` draws what changed since the base (tools/changed.ts), which
is how the checks attach a sheet to every pull request that changes a map, a monster or an
interior; with nothing changed it says so and writes none.
`node tools/harness.ts [--levels 2,6,10] [--roles soldier,brute] [--seeds 400] [--under 2] [--map thornmark --level 5] [--stats] [--calibrate --write] [--spell-cap 10] [--gear-grows] [--level-bonus] [--level-traits]`
fights the premade company at a level against standard encounters of the test monster, or a map's
own groups, one after another until it must rest, and says how many it managed against the six or
seven an encounter at its level should allow (docs/MONSTERS.md §4.4). `--spell-cap` tries a world
where damage spells stop growing at that level, `--gear-grows` one where the company's gear keeps
growing past Thornmark's, `--level-bonus` one where every member gains a point of damage and of
armour every two levels past 10, and `--level-traits` one where fighters strike once more a turn
from 11 and again from 29, and sneak attacks grow.
`node tools/gate.ts [--maps thornmark,grove2] [--levels 2,3,4,5] [--seeds 200]` prints how often the
premade company, trained to each level and dressed by the gear ladder, wins each map's groups alone
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
| `game/map.ts` | the terrains (hills, farmland, woods, dead wood, crystal and the chasm named as the atlas names them), `MapDef` (rows + legend + features + encounters, `secrets` with each secret door's hint, a town's or a dungeon's placed `banners`, an outdoor map's `density` and, on the outdoors, its gates and zones; the wilderness features and a statue's `Gift`, the den; a person's hand-ins, `Words`, `Choice` and `Answer`), `GameMap` queries (passable, blocksView, the zone and palette at a cell, `bannerAt`); the void; `Presence`, when a thing is in the world (`when` as `Hours`, `until`, `after`), which a group and a person's words wear |
| `game/outdoors.ts` | `layOutdoors`: the maps as played, the placed zone maps laid into one outdoors the size of the world, void where nothing is built, their ways between them walked and gated |
| `game/atlas.ts` | the world map's model: `Atlas`, the land drawn in strokes, `worldGrid` (a cell a square, the built outdoor maps stamped in 1:1, each cell's zone), the ways between areas and the road's steps |
| `game/world.ts` | `WorldState` (position, clock, weather seed, per-map state with cells seen in bits, zones set foot in, the kinds met; a group a map has gained since a save, and a saved door only where the map still has one), the zone the party is in and what it is called, movement across zones and gates, reveal, the weather's reach into play (sight, snow, the log, the almanac, fights), roaming groups and when they walk (`walks`, `ended`, `hoursHold`), whether a person or an event is there (`present`), what is in sight (the viewport's rule: `VIEW_DEPTH`, `lineOfSight`) and the looks said on first meeting (`sightings`, `meet`, a den's too), a den's brood paced as they come back, encounter triggers, rest, search |
| `game/calendar.ts` | the months and seasons, dates, and dawn and dusk through the year |
| `game/weather.ts` | the `Climate` shape (each area has its own, merged as `CLIMATES` in `content/index.ts`), `weatherAt` (the sky, the temperature, snow lying, wet ground), naming the sky and its log lines, and what it does to sight, steps and bows |
| `game/party.ts` | races, classes, `Character`, `Party`, conditions, equip, levelling and the trainer's price, the premade party |
| `game/people.ts` | `meet`: what a person says and asks, in order (a hand-in the company can make, their words that hold, a done hand-in's after-lines, the first meeting); a hand-in taking its item at the first meeting and paying, with the `early` words to a company never hired; `answer`; `readText`; `handIns`, `personFlags` and `personGives`, what the checks and the save list read |
| `game/guilds.ts` | a guild quest (`GuildQuest`); a company's rank, worked out from its done flags and kept once reached (`rank_<guild>`); what a hall offers, taking a quest and the report that pays it (gold, items, xp split among the living), an item taken at the first meeting whatever the rank; pure |
| `game/items.ts`, `game/monsters.ts`, `game/spells.ts` | what an item, a monster and a spell are (`ItemDef`, with a letter's `text`; `MonsterDef`, `SpellDef`) and their lookups; a monster's kind and what each kind sets (`KINDS`: sleep, Holy Strike); the tables are content's |
| `game/save.ts`, `game/upgrades.ts` | the save and `SAVE_VERSION`; the upgrades, each registered by the version it brings a save to and run in turn on load, with what they need of the world as it was kept frozen |
| `game/combat.ts` | `CombatState`, `startCombat`, `currentTurn`, `partyAct`, `monsterAct`; pure and seeded |
| `game/quests.ts` | `QuestDef`, `Chapter` and `ChapteredQuest`; `questLog` (the quests known, their pages, entries and goal, worked out from the world state and party), `questNews` (what changed between two looks) |
| `game/game.ts` | `Game` (screen stack, save/load, interactions, the offer of rest, a den's choice to burn) and `ExploreScreen` |
| `game/wilds.ts` | the wilderness features: what a feature gives (`giftOf`) and the id it is spent by (`spentId`), the shrine, the cairn, the statue's answer and when the party may rest; pure |
| `game/dens.ts` | dens: the brood's `until` (`denBurnt`), the pace, the approach, the burning and its hoard, the look on first sight; pure |
| `ui/viewport.ts` | the depth-layered first-person compositor, the hills, the farmland's fields and hedges and the trees about the woods and the dead wood, the glass trees and the chasm's drop, the wall dressing and its rates (`DRESSING_RATES`, held by `tools/tests/art.ts`), what a cell is drawn as (`drawnCell`: a secret door outdoors among mountain, rock or trees as they are), the sky, the end of the world in pink and the weather drawn over it |
| `ui/frame.ts` | layout constants, status strip (time, date, the sky and its glyph), automap (whole, or a window round the party on the outdoors; a spent feature gone from it, a den standing or burnt), party cards, log, purse |
| `ui/riddle.ts` | a statue's riddle, the answer typed in the text mode |
| `ui/worldmap.ts` | the world map (M): the cloth painted from the atlas and the built maps, the zone overlay (Tab) and the almanac (Space) |
| `ui/screens.ts` | message (a person's box, `SAY_W` by `SAY_LINES` from `ui/frame.ts`), choice, character sheet (a letter read from it), spell picker, inn/temple/shop/guild/trainer, a business's first menu (`businessEntries`) and a guild's work at its hall, and the visit that frames them (`InteriorScreen`) |
| `ui/interior.ts`, `ui/interiors/` | the businesses' interiors: the painting kit and the props, a scene to a file in `<area>/`, and the helpers a trade's scenes share |
| `ui/combat.ts` | the combat screen (menus over the resolver) |
| `ui/grouplabels.ts` | the labels over a fight: each group's kinds, each with its count of the living (a lone proper name none), laid out inside the view; pure |
| `ui/quests.ts` | the quest log screen, and `questSheets`, its pure page layout, a chapter to a page or more |
| `ui/sprites.ts`, `ui/monsters/*.ts` | scenery sprites, the trees dressed by the season; the monster drawings by family, and the shared brush and helpers |
| `ui/create.ts` | party creation |
| `content/index.ts` | the areas in road order; the tables merged from them (maps, monsters, items, quests and guild quests, climates, rooms), the one quest joined from their chapters and `ATLAS`, their parts of the world map over the plan; `SPELLS` from `spells.ts`; and the `MonsterSprite`, `Interior` and `RegionId` unions made from the areas |
| `content/guilds.ts` | the four guilds (`GUILDS`: names and ranks), a guild quest's flags and its side of the quest log |
| `content/area.ts` | `Area`, the shape every area fills in, and `Novelty`, what it claims is new (held by `tools/tests/pillars.ts`); `Walkthrough`, an area's end-to-end test |
| `content/areas/<area>/` | an area: its maps, monsters, items, chapter of the one quest (`chapter.ts`), side quests (`quests.ts`), climate, what it claims is new (`novel`) and part of the world map, and the sprite kinds and rooms it brings (`index.ts`); each has a doc in [docs/areas/](areas/) |
| `content/items.ts`, `content/spells.ts` | the items no area owns (the class kits, the starting bag, the iron key) and the spells |
| `content/progression.ts` | the curve: each area's band, next floor and price window, the xp and gold a clear should give, and what is owed; checked by `tools/tests/curve.ts` |
| `content/locks.ts` | the story locks (each flag that closes something, where and why) and how many an area and the road may spend; held to by `tools/tests/pillars.ts`, read by nothing in the game. Empty: the road's one lock, the pass's flag, went with #40 |
| `content/maps.ts` | the maps as played: `PLAYED_DEFS`, the outdoors laid out, and `buildMaps` |
| `content/shipped.json` | what a save may refer to: each played map's size, chests, once-events, the other features spent once, groups and door squares, the zones' places, the flags, items, spells, monsters, classes, races and conditions; written by `tools/shipped.ts`, held to by `tools/tests/shipped.ts` |
| `content/atlas.ts` | the world map's plan: the land, the areas of the road, and the zones, places and sites not built yet; each area charts its own in `areas/<area>/atlas.ts`, and `content/index.ts` merges them into `ATLAS` |
