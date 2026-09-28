Your task: #79, "Draw the Carrion Crow, and the birds' frame the road reuses".

- Rules: orchestration/COMMON.md on origin/claude/phase-1-orchestration-w0egtw. Read it first.
- Footprint: orchestration/footprints/79.md on the same branch.
- Branch: claude/m1-79-birds, from the latest main.
- One pull request. The frame's parts are named for the birds to come (owl, heron, gull, raven, eagle, vulture): the Great Owl (#48) is drawn on it next, by this lane.
- A drawing cannot pass the checks until a map places its monster, so the owner agreed (28 September) to an `UNPLACED` owed table in tools/tests/maps.ts, landing now as its own small pull request from the farm kitchen's session (branch claude/m1-unplaced). Draw now; before you open your pull request, merge main once the table is on it. Never add the table yourself: if it is not on main when you are ready, say so in your turn's summary and wait.
- #41's first pull request (#109, merging now) makes `kind` required on every monster and takes `mindless` away: give each def of yours its `kind` (the dead are `kind: 'dead'`, with no `mindless`), and merge main once it lands.
- Beside you: three other drawing sessions and #41. All of you append to src/content/areas/shelf/monsters.ts (SPRITES and MONSTERS): a one-line conflict for each later lander, resolved by keeping both. src/ui/sprites.ts: put your FAMILY line exactly where your footprint says, so the four merge cleanly. docs/SLICE.md's variants sentence (:178-181) is brought up to date by whichever of #80-81, #82 and #83-84 lands last.
- Send the owner your contact sheet (`node tools/sheet.ts sheet.png --monsters <ids>`) and the gallery strips at viewport sizes and by night. Your pull request waits for the owner's OK on the sheet before it merges.
