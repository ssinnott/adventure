# The vertical slice (M0) and the road to level 10

What is playable now, what is stubbed, and where things live. Read DESIGN.md first for the why.

## Playable

- **Title and party creation.** Take the premade six or muster your own: name, race, class, rolled
  stats with reroll. Front row is slots 1–3, back row 4–6.
- **Harrow** (town, 16×16): inn (rest, rations), temple (cure and raise, priced by level), shop
  (buy and sell), Lantern Guildhall (join, then buy tier-2 spells), Warden Drillyard (train a level
  when the xp allows; levels are bought, not automatic), the Gilded Eel tavern (rumours), Lord Vask
  (the contract and the hand-in), a well, a sign.
- **The Shelf** (outdoor, 32×32): road, woods, hills, marsh, the coast, eight roaming or lurking
  monster groups with respawn timers, the Ashcombe farm.
- **Ashcombe Cellar** (dungeon, 16×16): four rings, an iron key, a locked door, a secret door, the
  dead Lantern and her survey wand, the Rift and its Warden.
- **Greywater** (two dungeon levels, 16×16 each, band 2–5): smugglers' caves in the south-west
  cliffs, reached from the beach. Level one, the Greywater Caves: smugglers, shore crabs and drowned
  men, a secret stash, and the captain's den with the iron key to the stairs. Level two, the Drowned
  Shrine: an Ashen cult's galleries around a sealed shrine; a secret vestry holds the key, and the
  Ashen Deacon guards the Greywater Ledger. Captain Hale at the pass checkpoint gives the contract
  and takes the ledger. Chests carry the Shelf's mid-tier gear (long sword, kite shield, scale,
  chain, long bow).
- **The ramp to Thornmark.** The pass needs both `q_ashcombe_done` and `q_greywater_done` (an exit's
  `needFlag` may list several flags). The slice's early monsters give about double their old xp, so
  one clear of the Shelf and the cellar is worth level 2 per member, and adding Greywater is worth
  level 4 (tests pin both); respawns make up the step to Thornmark's band 5.
- **Exploration:** grid movement with 90° turns and strafing, doors, locked doors, secret doors,
  water and mountains gated by party abilities, a calendar and weather over a day/night clock (below),
  automap with field-of-view reveal, rest with food, a search action, exploration spells (Light,
  Wizard Eye).
- **Combat:** turn-based, speed-ordered; front/back rows; attack, cast, use, defend, flee;
  conditions (poison, disease, sleep, paralysis, unconscious, dead); a 12-monster cap; xp, gold and
  drops; readiness to train reported.
- **Save/load:** F5/F9 to localStorage; door changes, explored cells, group state and the rng all
  survive a reload.
- **Quest log** (J): the quests the party knows of, active first, each with its next goal and a
  journal of what the party has found: The Quiet Farm (Vask), The Greywater Ledger (Hale), The
  Grove Stone (Vask's lead, Sylvane's chisel), and The Lost Expedition, which the first Meridian
  journal opens and which stays open until the rest of its trail is built. Nothing new is saved.
  Every entry is keyed to something the save already holds (a flag, a carried item, a once-only
  event, a guardian killed, a map set foot on), so an old save opens with its log whole. A quest
  begun, advanced or finished is announced once in the message log, and J opens on the one that
  changed last.

## The calendar and the weather

Pillar 4 says the world has a clock. It now has a year and a sky as well.

- **The calendar** (`game/calendar.ts`). Eight months of fifteen days, two to a season: Thaw and
  Sowing (spring), Longlight and Harvest (summer), Leafturn and Mistfall (autumn), Frost and
  Longnight (winter), 120 days in the Lanterns' year. Game day 1 is the 1st of Mistfall, 1016, late
  in the autumn, so the first winter comes on while the party is still on the Shelf or just over
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
- **Regions.** Each map names its region (`MapDef.region`, the Shelf when absent); towns and
  dungeons share their region's weather, and a test holds them to it. The Shelf is mild and wet,
  foggy off the sea in the autumn, with snow only in a cold snap; Thornmark is colder, and its
  winter snow lies deep for weeks. Fronts reach Thornmark five hours after they cross the Shelf.
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
cap, which is 10 until promotions exist:

- **Progression.** `MAX_LEVEL` is 10; `levelUp` stops there and the sheet says so. Five spell
  tiers, unlocked at levels 1, 2, 4, 6 and 8 (`spellTierAt`). Trainers charge 25 a level to 5 and
  40 a level after; the Warden Drillyard in Harrow teaches to 6, the Elder's Yard in Thornhold to
  10. Guilds sell up to a tier of their own (`maxTier`: Harrow 2, Thornhold 4) at 40, 80, 160, 320
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
- **Gear.** A Thornmark tier in the Armoury: war hammer, battle axe, great sword, crossbow, the
  Thornmark bow, rune dagger, grove staff, runed robe, brigandine, plate, tower shield, elixirs,
  sapphire vials, lantern oil.
- **Monsters.** Thirteen for band 5–10: dire wolves, thorn spiders, brigands and their archers,
  Ashen zealots and adepts, rift hounds, bone knights, wraiths, riftling elders, ogres, and two
  bosses, the Hand of Ash and the Warden of the Cut. Two new drawings (ogre, wraith); the rest
  re-tint and re-scale the slice's ten.
- **Thornmark** (outdoor, 32×32, band 5–10): reached through the mountain pass on the Shelf's
  east edge, which a Warden checkpoint holds closed until Vask has the survey wand and Captain Hale
  has the Greywater ledger. Thornhold in the north-east, a ruined watchtower with an ogre's den, a
  barrow with bone knights and wraiths, a river with one bridge, a dead survey marker in a lake,
  and the Grove at the end of a chisel-marked road in the south-west. Fourteen groups.
- **Thornhold** (town, 16×16): the Green Man inn, the Lantern Chapterhouse, the Armoury, the
  Lantern Hall (tier 4), the Elder's Yard, the Split Oak tavern (rumours about Vask's timing),
  a healing spring, and Elder Sylvane, who pays 1500 gold for the Underdeep chisel.
- **The Grove Roots** (dungeon, 16×16, band 6–9): two halves joined by a locked door; the iron
  key is behind a secret door on the west side; the stairs down are guarded.
- **The Cut Stone** (dungeon, 16×16, band 8–10): three square rings of Underdeep corridor. A
  secret door opens the second ring, a door the third, the key the chamber. The Hand of Ash and
  two adepts wait at the Stone; kill them and the Warden of the Cut, two cells on, is the
  hardest fight in the game. The chisel goes to Sylvane; the Warden drops the first Meridian
  journal. The tear closes when the Warden dies: an encounter's `slainText` is said on the kill, so
  it comes after the fight from whichever side the party fought.

One clear of every map is worth a little over level 7 per member (a test pins this); the
dungeons respawn in one to two days, and two more sweeps of the Grove reach 10. Levels are still
bought, so the gold matters: about 8,400 for six members from 5 to 10.

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
  from spring green to tawny through the year; broadleaf trees bud in Thaw, blossom in Sowing,
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

- Only one Charter (Lanterns) has any presence; no Standing.
- No promotions, so no sixth spell tier; no Master trainers; no secondary skills yet beyond race
  innate ones. The Meridian journal opens The Lost Expedition in the quest log, but nothing reads it
  yet and no second volume exists.
- No audio. The engine's synth stack is vendored, unused.
- Hirelings, promotions, the succession, the Salt Compact, the Lost Expedition past its first
  journal: design only.

## Checks

`npm run check` runs three gates, each verified to be able to fail:

| | |
|---|---|
| `typecheck` | `tsc --noEmit`, strict, zero suppressions |
| `test` | Node: every map's rows are rectangular, exits land on passable cells, every open cell is reachable, every monster is placed and every quest item findable, a trainer reaches the cap and a clear of everything is worth level 7; movement, doors, keys, secrets, the gated pass, Town Portal, the stairs; roaming groups, encounters, respawn, truce, the Cut Stone's tear closing on the Warden's death and not its approach; combat replays byte-for-byte from a seed, the cap, row rules, fleeing, all-target spells, Ward, Revive; party creation and levelling to exactly 10 with every tier learned; a save round-trips and re-applies door changes; every quest-log key names a real flag, item, event, guardian or map, every page fits and every glyph is in the font, no entry vanishes when an item leaves the party, and the quests walk through end to end with each change announced once and the Lost Expedition left open; the calendar's months, seasons, new year and ordinals, and days that lengthen and shorten; the weather is a pure function of its seed, and three years of it in each region bring rain in every season and at every strength, autumn fogs, snow only below freezing and never in summer, far more snow over the pass, deep snow lying there much of the winter, and wet spells that last hours; the log's hysteresis and wording; a new game opens fair; reading the weather draws nothing from the gameplay rng; fog and downpours cut sight (not underground, and Light does not cut fog), deep snow slows a step, archers shoot worse in a downpour and casters do not; the inn waits for winter light; towns and dungeons share their region; an old save without a weather seed loads |
| `smoke` | headless Chromium loads index.html through the dev server, starts a game, walks through the gate, opens a fight, then paints Thornmark, an ogre-and-wraith fight and Thornhold, talks to Vask and opens the quest log, paints the Shelf in a downpour and a fight in it and Thornmark under falling snow, and asserts every screen painted with no page error and the log reported the quest and the weather; also unions every pair of sprite part kinds and asserts none of them leaves a hole; and paints a view from every open cell of the cellar and of Harrow over two backdrops and asserts the backdrop never shows through a crack between walls, nor at the edges of the view beside the party |

`node tools/shot.ts out.png [map x y facing] [keys...]` screenshots any state for eyeballing. Besides
keys it takes `fight:<group>`, `time:<hour>`, `walk:<n>`, `day:<n>` (game day n at the same hour),
`seed:<n>` (the weather seed) and `sky:<kind>[:night]`, which moves the clock to the next hour of
daylight (or night) with that sky in the current region, e.g.
`node tools/shot.ts rain.png shelf 16 8 2 seed:11 sky:downpour`.
`node tools/gallery.ts out.png [--only kinds] [--family wolf] [--scale 2] [--frames 6] [--flash] [--tone 0.6]`
renders every monster (or one family) at the combat size with the viewport sizes underneath, or
as a strip of idle frames ending in the hit flash, for judging an art pass.

## Code map

| File | Owns |
|---|---|
| `game/map.ts` | `MapDef` (rows + legend + features + encounters), `GameMap` queries (passable, blocksView) |
| `game/world.ts` | `WorldState` (position, clock, weather seed, per-map state), movement, reveal, the weather's reach into play (sight, snow, the log, the almanac, fights), roaming groups, encounter triggers, rest, search |
| `game/calendar.ts` | the months and seasons, dates, and dawn and dusk through the year |
| `game/weather.ts` | region climates, `weatherAt` (the sky, the temperature, snow lying, wet ground), naming the sky and its log lines, and what it does to sight, steps and bows |
| `game/party.ts` | races, classes, `Character`, `Party`, conditions, equip, levelling, the premade party |
| `game/combat.ts` | `CombatState`, `startCombat`, `currentTurn`, `partyAct`, `monsterAct`; pure and seeded |
| `game/quests.ts` | `questLog` (the quests known, their entries and goal, worked out from the world state and party), `questNews` (what changed between two looks) |
| `game/game.ts` | `Game` (screen stack, save/load, interactions) and `ExploreScreen` |
| `ui/viewport.ts` | the depth-layered first-person compositor, the sky, and the weather drawn over it |
| `ui/frame.ts` | layout constants, status strip (time, date, the sky and its glyph), automap, party cards, log, purse |
| `ui/screens.ts` | message, choice, character sheet, spell picker, inn/temple/shop/guild/trainer |
| `ui/combat.ts` | the combat screen (menus over the resolver) |
| `ui/quests.ts` | the quest log screen, and `questPage`, its pure page layout |
| `ui/sprites.ts`, `ui/monsters/*.ts` | scenery sprites, the trees dressed by the season; the monster drawings by family, and the shared brush and helpers |
| `ui/create.ts` | party creation |
| `content/maps/*.ts` | Harrow, the Shelf, the cellar, Greywater (two levels); Thornmark, Thornhold, the Grove Roots, the Cut Stone |
| `content/quests.ts` | the quests' journal entries and goals, and what each is keyed to |
