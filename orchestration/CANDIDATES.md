# Phase 1: the issues ready now, and what each touches

Main at b2f7322 (28 September 2026), green: `npm run check` ALL OK, 30 owed (#26 ×3, #40 ×15,
#43 ×3, #47 ×9). Phase 0 (#25) is closed, so every blocker it held is gone. Every Phase 1 issue
carries `approved`. The issue bodies are snapshotted in `orchestration/issues/` (phase1-a.md:
#40 #41 #42 #43 #45 #100 #101; phase1-b.md: #46 #48 #65 #49 #21 #17; epic65.md: #65's eighteen;
epic46.md: #46's six); GitHub is the authority where they differ.

## Ready now (nothing open under Blocked by)

| Issue | Lanes | What it does | Where it likely lands |
|---|---|---|---|
| #40 | quality, area | the pass opens (no flag), Hale warns; Thornmark, the Grove Roots and the Cut Stone retuned until the gate check holds; every text that says the pass is shut; the atlas's `opens` open from the start and the Monks' Vale road | `src/content/areas/shelf/maps/shelf.ts` (gate, sign, Hale), `.../shelf/maps/harrow.ts` (Vask's `after`), `.../shelf/quests.ts`, `.../thornmark/{monsters,maps/*}.ts`, `src/content/atlas.ts`, `tools/tests/{movement,outdoors,quests,atlas,gate,pillars}.ts`, `tools/smoke.ts`, `docs/SLICE.md`, `docs/areas/*.md` |
| #41 | systems | `kind`, `look`, `when`, `until`, `after` on monsters; Holy Strike on the dead only; a record of kinds met (save); the gate bot reads them; rift hounds and riftling elders stop after the Warden of the Cut dies | `src/game/{monsters,map,world,combat,save,upgrades}.ts`, both areas' `monsters.ts` (kind on every def), `tools/gate.ts`, `tools/tests/*`, `src/content/shipped.json` |
| #43 | area, systems | hand-ins take their item at the first meeting, with words for a company that came early; the hand-in moved out of `Game.interact` | `src/game/game.ts:153`, a new testable module, `harrow.ts` (Vask), `shelf.ts` (Hale), `thornmark/maps/thornhold.ts` (Sylvane), quests, tests |
| #45 | systems | wilderness features: shrine/fountain, cairn, statue (typed riddle), camp, hermit | `src/game/map.ts` (Feature union), `src/game/game.ts` (interact), `src/game/world.ts`, `src/input.ts` (text mode), `src/ui/*` (glyphs, screens), `tools/tests/density.ts`, save |
| #66 | quality, systems | the outdoors on one grid: zones of several boxes, the world map lettered by box | `src/game/{atlas,outdoors}.ts`, `src/content/atlas.ts`, `src/content/areas/*/atlas.ts`, `src/ui/worldmap.ts`, `tools/tests/{atlas,outdoors,structure}.ts` |
| #100 | systems | `plus` on items: +1 to hit and damage on a weapon, +1 AC on armour; price base + 150 a point; Unarmoured Defence reads the robe's own AC | `src/game/{items,party,combat}.ts`, `src/content/items.ts`, `src/ui/screens.ts`, `tools/harness.ts` |
| #98 | systems | a shop sells an item at its own price | `src/game/map.ts` (shop stock), `src/ui/screens.ts` (shop menu), tests |
| #74 | area | Helmstow's Lantern Guildhall sells to tier 3 | `harrow.ts` (guild `maxTier`), the curve's gold, docs |
| #21 | area, systems, design | guilds: DESIGN §8 written; creation and title screens reworded; the Wardens and the Lanterns give quests from their halls in Helmstow and Thornhold, joined by a first task, with ranks | `docs/DESIGN.md` §8, `src/ui/{create,title}.ts`, `harrow.ts`, `thornhold.ts`, quests, `src/game/*` (membership, ranks), screens |
| #17 | area, systems, interiors | the keep's ward, a map of its own behind Helmstow's north gate; the throne room an interior; Vask holds court there | `harrow.ts` (gatehouse, Vask moves), a new map, `src/ui/interiors/shelf/`, palette, `tools/smoke.ts`, tests, SLICE |
| #79 | creatures | the Carrion Crow and the birds' frame, a new family | `src/ui/monsters/birds.ts` (new), `src/ui/sprites.ts` (dispatch), art checks |
| #80, #81 | creatures | the Wrecker and the Lampman, on the bandit frame | `src/ui/monsters/bandit.ts`, `tools/smoke.ts` (the lamp's glow declared apart) |
| #82 | creatures | the Black Dog, on the wolf frame | `src/ui/monsters/wolf.ts`, `tools/smoke.ts` (eyes declared apart) |
| #83, then #84 | creatures | the Barrow Guard, then the Barrow Captain, on the skeleton frame | `src/ui/monsters/skeleton.ts` |
| #97 | interiors | the farm store's room, a farm kitchen | `src/ui/interiors/shelf/` (new scene) |

## Waiting, and on what

- #42, the one quest's first chapters: #40.
- #76, choices, flags, several items, letters: #41. #88, dens: #41. #73, the Lodestone: #76.
- #99, the Foreland's gear ladder (the +1s): #100. #101, Thornmark's chests: #100.
- #48, the Deepthorn's monsters: #79. #84: #83.
- #85, the built quests' words: #40. #77, the side quests on the built maps: #76, #43 (#17 for its quest 3).
- #47, the pilot (F2 and F3): #66, #45, #41, #79, #80, #81, #42, #43, #76, #99.
- #67 to #72 (the Downs box by box), #87 (Ashcombe moved), #49 (the Deepthorn's core): #47 and more.
