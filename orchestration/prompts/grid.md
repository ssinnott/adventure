Your task: #66, "Lay the outdoors on one grid: zones of several boxes, and the world map lettered by them".

- Rules: orchestration/COMMON.md on origin/claude/phase-1-orchestration-w0egtw. Read it first.
- Footprint: orchestration/footprints/66.md on the same branch.
- Branch: claude/m1-66-grid, from the latest main.
- #66 is on the critical path: #47, the pilot, and every box of the Downs after it (#67 to #72), and the Deepthorn's core (#49) wait on the zone shape you set. Open the pull request as soon as the Done-when holds.
- Beside you in Wave 1: #40 (the pass and Thornmark) is the only session that meets your files. It edits src/content/atlas.ts's header road sentence (:12-16) and the links (`opens`, Monks' Vale), and tools/tests/atlas.ts :75-82; you edit atlas.ts :7-10 and :28, and put your new atlas checks before :46, never after :74. Also on different lines of tools/tests/{pillars,outdoors}.ts, docs/SLICE.md and docs/areas/shelf.md, as the footprint lists. Leave `AtlasLink.opens` and `reachable` alone: they are #40's to leave or change. Whoever lands second merges main and re-runs the check.
- Keep play's zones keyed by map id (pitfall 1): rekeying them moves what saves hold.
- Type the four fixture zones as AtlasZone and watch each fail unlaid (pitfall 2).
- Send the owner the two world map renders (with and without --zones) with SendUserFile, as the footprint's validation says.
