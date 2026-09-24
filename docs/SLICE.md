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
  water and mountains gated by party abilities, a day/night clock with a hazed sky, automap with
  field-of-view reveal, rest with food, a search action, exploration spells (Light, Wizard Eye).
- **Combat:** turn-based, speed-ordered; front/back rows; attack, cast, use, defend, flee;
  conditions (poison, disease, sleep, paralysis, unconscious, dead); a 12-monster cap; xp, gold and
  drops; readiness to train reported.
- **Save/load:** F5/F9 to localStorage; door changes, explored cells, group state and the rng all
  survive a reload.

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
  journal.

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
- No promotions, so no sixth spell tier; no Master trainers; no secondary skills yet beyond race
  innate ones. The Meridian journal is an item with no reader yet.
- No audio. The engine's synth stack is vendored, unused.
- Hirelings, promotions, the succession, the Salt Compact, the Lost Expedition: design only.

## Checks

`npm run check` runs three gates, each verified to be able to fail:

| | |
|---|---|
| `typecheck` | `tsc --noEmit`, strict, zero suppressions |
| `test` | Node: every map's rows are rectangular, exits land on passable cells, every open cell is reachable, every monster is placed and every quest item findable, a trainer reaches the cap and a clear of everything is worth level 7; movement, doors, keys, secrets, the gated pass, Town Portal, the stairs; roaming groups, encounters, respawn, truce; combat replays byte-for-byte from a seed, the cap, row rules, fleeing, all-target spells, Ward, Revive; party creation and levelling to exactly 10 with every tier learned; a save round-trips and re-applies door changes |
| `smoke` | headless Chromium loads index.html through the dev server, starts a game, walks through the gate, opens a fight, then paints Thornmark, an ogre-and-wraith fight and Thornhold, and asserts every screen painted with no page error |

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
| `content/maps/*.ts` | Harrow, the Shelf, the cellar, Greywater (two levels); Thornmark, Thornhold, the Grove Roots, the Cut Stone |
