# The vertical slice (M0)

What is playable now, what is stubbed, and where things live. Read DESIGN.md first for the why.

## Playable

- **Title and party creation.** Take the premade six or muster your own: name, race, class, rolled
  stats with reroll. Front row is slots 1–3, back row 4–6.
- **Harrow** (town, 16×16): inn (rest, rations), temple (cure and raise, priced by level), shop
  (buy and sell), Lantern Guildhall (join, then buy tier-2 spells), Warden Drillyard (train a level
  when the xp allows; levels are bought, not automatic), the Gilded Eel tavern (rumours), Lord Vask
  (the contract and the hand-in), Adjunct Perrin of the Lanterns (the second contract: the Wardstone
  shard, and what it buys you), a well, a sign.
- **The Shelf** (outdoor, 32×32): road, woods, hills, marsh, the coast, twenty monster groups with
  respawn timers — the hunters roam, the ambushers lie where they are — the Ashcombe farm, and the
  marsh stair down to the chapel.
- **Ashcombe Cellar** (dungeon, 16×16): four rings, an iron key, a locked door, a secret door, the
  dead Lantern and her survey wand, the Rift, its Warden, and the Wardstone shard beside it.
- **The Drowned Chapel** (dungeon, 16×16): the Lantern waystation the marsh took back, reached by a
  stair under the reeds south of Ashcombe. A flooded nave, two crypts — one locked, one behind a
  wall that is not one — an apse with the Hollow Prior on the broken altar, and a font of deep water
  only a swimmer reaches. Where the hand axe, kite shield, long bow and chain mail live.
- **Exploration:** grid movement with 90° turns and strafing, doors, locked doors, secret doors that
  read as walls until `F` finds them, torches that double what you see underground,
  water and mountains gated by party abilities, a day/night clock with a hazed sky, automap with
  field-of-view reveal, rest with food, a search action, exploration spells (Light, Wizard Eye).
- **Combat:** turn-based, speed-ordered; front/back rows; attack, cast, use, defend, flee;
  conditions (poison, disease, sleep, paralysis, unconscious, dead); a 12-monster cap; xp, gold and
  drops; readiness to train reported.
- **Save/load:** F5/F9 to localStorage; door changes, explored cells, group state and the rng all
  survive a reload.

## Art

Everything is drawn at runtime from vector shapes; there are no bitmaps in the repo.

- `ui/brush.ts` is a minimal `ShadeTarget`, so sprites and portraits paint with the engine's own
  cel-shading helpers (`celBall`, `celCapsule`, `celPoly`, `band`) and share the sibling games' look:
  1px ink outline, three tones, top-left light.
- `ui/portraits.ts` builds a front-facing portrait per character from the name, race and class
  (head shape, ears, skin, hair, beard, class headgear), with the expression following the
  character's state, cached to an offscreen canvas.
- `ui/sprites.ts` holds the ten monster drawings and the trees, rocks, mountains and pillars.
- `ui/viewport.ts` textures every surface procedurally: stone courses (front faces and receding
  side faces), timber-framed houses with gable roofs and windows lit at night, flagstones with
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
  and chimneys, keyed per building; timber bracing and a window on house side faces; a birch tree
  variant; a parchment automap with inked walls and a compass rose; hit sparks and a red card
  flash in combat when someone takes damage.

## Stubbed or absent

- Only one Charter (Lanterns) has any presence; no Standing.
- Town Portal does nothing; no Master trainers; no secondary skills yet beyond race innate ones.
- No audio. The engine's synth stack is vendored, unused.
- Hirelings, promotions, the succession, the Salt Compact, the Lost Expedition: design only.

## Checks

`npm run check` runs four gates, each verified to be able to fail:

| | |
|---|---|
| `typecheck` | `tsc --noEmit`, strict, zero suppressions |
| `test` | Node: every map's rows are rectangular, exits land on passable cells, every open cell is reachable; movement, doors, keys, secrets; roaming groups, encounters, respawn, truce; combat replays byte-for-byte from a seed, the cap, row rules, fleeing; party creation and levelling; a save round-trips and re-applies door changes |
| `play` | Node: the whole slice played through the keyboard — title, party creation (premade and hand-built), every Harrow service bought and used, Vask's contract and Perrin's, the road to Ashcombe, both dungeons with their keys, locked doors, secret doors and the swimmer's font, both set pieces, and the loop that earns level 2 and buys it at the drillyard; plus save/load mid-run, replay determinism, and a measured win rate for all 29 encounters against the level its map is banded for |
| `smoke` | headless Chromium loads index.html through the dev server, starts a game, walks through the gate, opens a fight, and asserts every screen painted with no page error |

`node tools/play.ts quest` runs one chapter; `PLAY_TRACE=1` narrates every fight and camp.
`node tools/shot.ts out.png [map x y facing] [keys...]` screenshots any state for eyeballing.

## Code map

| File | Owns |
|---|---|
| `game/map.ts` | `MapDef` (rows + legend + features + encounters), `GameMap` queries (passable, blocksView) |
| `game/world.ts` | `WorldState` (position, clock, per-map state), movement, reveal, roaming groups, encounter triggers, rest, search |
| `game/party.ts` | races, classes, `Character`, `Party`, conditions, equip, levelling, the premade party |
| `game/combat.ts` | `CombatState`, `startCombat`, `currentTurn`, `partyAct`, `monsterAct`; pure and seeded |
| `game/game.ts` | `Game` (screen stack, save/load, interactions) and `ExploreScreen` |
| `ui/viewport.ts` | the depth-layered first-person compositor |
| `ui/frame.ts` | layout constants, status strip, automap, party cards, log, purse |
| `ui/screens.ts` | message, choice, character sheet, spell picker, inn/temple/shop/guild/trainer |
| `ui/combat.ts` | the combat screen (menus over the resolver) |
| `ui/create.ts` | party creation |
| `content/maps/*.ts` | Harrow, the Shelf, the cellar, the chapel |
| `tools/play.ts` | the playthrough: drives `Game` with `Action`s, so screens and services are covered |
