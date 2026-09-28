Your task: #45, "Add the wilderness features: shrines, cairns, statues, camps and hermits".

- Rules: orchestration/COMMON.md on origin/claude/phase-1-orchestration-w0egtw. Read it first.
- Footprint: orchestration/footprints/45.md on the same branch.
- Branch: claude/m1-45-wilderness, from the latest main.
- #45 is on the critical path: #47, the pilot, places the first shrine, cairn and camp (F2 and F3), and #68, #71 and #72 need the country's features after it. Open the pull request as soon as the Done-when holds. If the riddle screen runs long, the footprint's split stands: the statue in a second pull request that closes #45, the rest first.
- Place nothing on a built map: fixtures only (open decision 9). The maps are #40's and #43's to edit now, and #47 places the first.
- Beside you in Wave 1: #41 (monster fields: map.ts's EncounterDef, world.ts, save), #98 (map.ts's shop line, :63), #21 later (the guild line, :64, and the create and title texts), #100 (party.ts). Your four arms go between the `rift` and `well` lines of the Feature union and nowhere else; your interact block goes after the businesses' arm, with a `never` default; your imports go on lines of their own, never rewriting game.ts's party or screens imports. #43, which follows #40 in Wave 2, moves the npc hand-in out of interact into src/game/people.ts, and #76 and #88 edit the npc and event arms and add a den beside your kinds: leave them each a place to add a line. Whoever lands second merges main.
- The camp's meaning is the choice most likely to be overturned: put it first under Choices for the owner, as the footprint says, with reading (b) as the larger question.
