# Wave 1 review, 2026-09-27

Two independent agents per pull request group: a reviewer in its own worktree, then a skeptic who tried to refute each finding that wasn't a nit. Verdicts below are the skeptic's where there is one.

## docs

Both PRs are docs-only and close to ready, but each needs a small fix first. #58 (CLAUDE.md) says every item in #28's Proposal and points at EXPANSION §8.1/§8.2 rather than #29's paths, but it adds a commit-body rule the history does not follow. #59's §4 table, bands, Stones and counts match the atlas exactly (checked with a scratch script), §13 is untouched and check is green on the first run. But its new §4 lead sentence says two things the atlas contradicts, and EXPANSION §1 is left saying DESIGN still has 6 regions, 9 towns and 22 dungeons.

- **should-fix** (confirmed) #58: CLAUDE.md adds a commit-body rule that the history does not follow and the issue did not ask for. Fix: Delete the sentence 'Bodies are short prose paragraphs naming the issue.' If the owner wants a body rule, it is a separate change they agree to.
- **should-fix** (confirmed) #59: New §4 lead sentence: 'Around the sea' and 'each with its towns' are false against the atlas. Fix: For example: 'Around the sea, and on two islands in it, twelve areas on one road of levels to 32, six of them with a **Wardstone**.' Or keep 'with their towns and dungeons' without 'each'.
- **nit** (confirmed) #59: EXPANSION §1 left saying DESIGN still has 6 regions, 9 towns and 22 dungeons. Fix: Put the three DESIGN cross-references in the past tense (e.g. 'DESIGN.md §4 said 6 regions of 32×32 until #39'), or leave them and say so explicitly for the owner.
- **nit** #59: §12 line is elliptical, and EXPANSION says the tiers were 'rewritten'. Fix: Write 'then the country along the road from the last area's core', and in EXPANSION say '§12 says so under its tiers' (or 'were brought into line').
- **nit** #59: 'The temple over the core' now clashes with 'core' meaning hand-built zone maps. Fix: Write 'The temple over the Core.' or 'The temple over the reactor core.'
- **nit** #58: EXPANSION §8.4 will still say 'There is none' once CLAUDE.md lands. Fix: Mention it in the PR body for the owner, or change 'There is none, and it' to 'CLAUDE.md' in a follow-up (a different hunk from #59's §2.1 edits).
- **nit** #58: 'It must be green' says nothing about the known smoke flake (#23). Fix: Optional until #23 lands: '(a failure at the end-of-the-world check is #23's)'. Or leave it as is, since #23 is in the same wave.

## ci

#62 (#23) does what its body says. The seed is pinned, the view's own washes() test is used, a search with no clear noon fails and names the seed, and the pass-walk fix holds. I ran it 20 times in a row on the default seed and 10 times with SMOKE_SEED=random, and all 30 were green at 79,992 pink. The three broken-on-purpose cases in its body reproduced exactly. The one real defect is small: the new check message says "in twenty days", but the search window is 480 days. It is ready after that one-line fix. #63 (#27) ran green on its own PR as three separate checks (typecheck 12 s, tests 12 s, smoke 45 s), and its lockfile is consistent. But main is still unprotected, and the owner's steps leave out the admin-bypass setting. The owner's account (ssinnott) opens and merges every PR, so without that box the rule would not stop a red or out-of-date merge. It is ready after that fix, and it should merge after #62. The two PRs do not conflict with each other or with main in either order: both orders give the same tree, which I typechecked, tested and smoke-tested green.

- **should-fix** (confirmed) #63: The owner's protection steps leave out 'Do not allow bypassing', so the one account that merges is not bound. Fix: Add a fifth owner step: tick 'Do not allow bypassing the above settings' (classic rule), or leave the bypass list empty (ruleset). Say that without it the owner's own merges skip the checks.
- **nit** (confirmed) #62: The new no-clear-noon check says 'in twenty days' but searches 480 days. Fix: Change the message to 'in 480 days' (or 'in four years'). Do not shrink the window to 24 * 20: the scout's worst world needed 477 h.
- **nit** #63: README states main's protection as fact before it exists. Fix: Land the sentence once protection is on, or phrase it as what the owner turns on (Settings → Branches).
- **nit** #63: Browser install downloads full Chromium as well as the headless shell. Fix: Use `npx playwright install --with-deps --only-shell chromium`. That roughly halves the download and the cache.
- **nit** #63: Actions pinned to Node 20 majors warn on the runner; the cache-hit path has never run. Fix: Optionally move to the Node 24 majors. Re-run the workflow once (workflow_dispatch or re-run) to see the cache-hit path go green before making the checks required.
- **nit** #63: Quick start does not say how to get Chromium now that Playwright comes from node_modules. Fix: Add one line to the README quick start: `npx playwright install chromium` once, outside the session containers. Mention EXPANSION:489 under 'Found in passing'.
- **nit** #62: murkOf exported with no importer outside the view. Fix: Leave murkOf unexported and export only washes, or keep it and accept one extra export.
- **nit** #62: An empty SMOKE_SEED throws instead of taking the default. Fix: Use `process.env.SMOKE_SEED || DEFAULT_SEED`.
- **nit** #63: The failure screenshot is taken after the pass walk, not at the failing check. Fix: None needed now. Note it for #37, which reworks screenshots in this workflow.

## hints

PR #60 (#51) meets every Done-when line. I checked it against the real engine: all three hints are once-only events with ids, reachable from the start with both the secret and locked doors shut and outside the hidden rooms. Each one logs when stepped on from every near-side approach, wraps to 2 lines at 388 px with font glyphs only, and names the right compass direction. The doors did not move, the diff touches only the three maps, and `npm run check` passed on its first run. It is ready after two small fixes. First, on grove1 6,11 the one-time grit hint shows dimmed under the sign, and one press of Space (which the viewport prompts for) removes it from the log for good. Second, old saves that already read g1_grit at 3,13 never see the corrected hint; the PR body says so.

- **should-fix** (confirmed) #60: Grove Roots: the one-time grit hint is shown dim under the sign, and one Space press wipes it from the log for good. Fix: List g1_grit after the sign in grove1's features, so the step logs the sign then the grit. Checked in a scratch copy: on arrival the grit is the bright newest entry, and after one Space both its lines are still on screen (last 4 lines = grit 2 + sign 2). Same id, same square, no other change.
- **nit** (confirmed) #60: Saves that already read g1_grit at 3,13 never get the corrected Grove Roots hint. Fix: Owner's call. Either give the moved event a new id (e.g. g1_grit_end) and pass it to #33 for its `hint:` declaration (the stale g1_grit entry in old saves' `used` is harmless), or accept that old saves miss it and keep the id.
- **nit** #60: EXPANSION still says the Shelf's two secret doors have no hint. Fix: A one-line edit to EXPANSION §1 and §5.4 in this PR, or a note to #33 to change them along with :61.

## terrain

I rate PR #61 (issue #44) ready after fixes. `npm run check` is green, all three Done-when lines hold, and the PR merges cleanly with #62 in either order: both orders give the same tree, and check is green on it. The hills drag, the MAP_TERRAIN entries and the SNOW_HOLD and TERRAIN_COLORS types each fail a check when broken on purpose. Two things need fixing before merge. First, the new smoke check measures the snow on farmland on a hedge strip, so it still passes when the fields take no snow. Second, hedgeColor never turns bare, which the PR body says it does. Smaller issues: on the automap, farmland is almost the same colour as road, and the paint check still passes with the hill and field drawing turned off.

- **should-fix** (confirmed) #61: The smoke check's farmland colour sample lands on a hedge, so 'snow lies white on the fields' passes with no snow on the fields. Fix: Sample the inside of a field and keep clear of hedge strips. Either stand on the bottom row of a band, facing into it, and sample the middle of the d=1 square, or lay the patch as a single field. Then assert on those pixels.
- **should-fix** (confirmed) #61: hedgeColor never turns bare: min where max was meant, so hedges stay in leaf all year. Fix: `Math.max(0, Math.min(1, Math.max((day - 76) / 12, (16 - day) / 12)))`, plus a Node assert if hedgeColor is exported: bare at day 100, in leaf at day 45.
- **should-fix** (confirmed) #61: On the automap, farmland is nearly the same colour as road. Fix: Pick a farm hue that stays clear of road, sand and dirt after the 0.55 parchment wash, for example a yellow-green. Optionally add a Node assert that every pair of washed open-ground colours is at least some minimum distance apart.
- **should-fix** (confirmed) #61: The new smoke paint check passes with the hill and field drawing turned off. Fix: Paint the same patch once as grass and once as hills, and require pixels above the d=1 floor edge to differ (the mound). For farm, require at least two distinct crop colours or some hedge-coloured pixels in the view.
- **nit** #61: drawHill is given '' as the floor palette, so in a dungeon a hill would draw as a black mound. Fix: Pass `map.paletteAt(c.x, c.y).floor`, as the floor loop does.
- **nit** #61: Rows of hills read as stacked terraces, with a hard straight seam at each row's front edge. Fix: Fade the mound's foot into the colour of the floor below it, or darken the floor under a row of hills to the foot's shade, so no seam shows.

## refactor

claude/m0-29-layout-refactor (#29) is ready after fixes. As a refactor it holds up: MAP_DEFS, PLAYED_DEFS, MONSTERS, SPELLS, QUESTS and CLIMATES are byte-identical to main, a v2 save made on main loads to the same state and quest log, and the three unions are exactly main's and reject bogus values. The nine maps are recorded as renames, every commit is green, all 1,307 test lines from main pass in the same order (plus 6 new ones), and each room and the monster gallery render pixel-identical to main. It cannot merge as it stands. The Done-when "adding an area touches its own folder and one registry line" fails: a dry-run area also needs src/content/atlas.ts and two lines in index.ts, and the index.ts comment claims otherwise. There are also smaller gaps: ITEMS key order, silent id collisions between areas, unions that turn into string if an area is typed `: Area`, an overclaim in DESIGN §13, and a rebase needed onto #44.

- **blocker** (confirmed) #29-branch: Adding an area still edits the shared atlas; the registry comment claims otherwise. Fix: Either give each Area its built atlas facts (zone map/at, place plates, sites on built maps) and merge them into ATLAS in src/content/index.ts, or get the owner to amend the Done-when. In both cases, correct the comment in index.ts to list what an area actually touches.
- **should-fix** (confirmed) #29-branch: Duplicate monster or item ids across areas silently override each other. Fix: Add checks in tools/tests/maps.ts that map, monster and item ids are distinct across AREAS and CORE_ITEMS (or throw on a duplicate when index.ts builds the tables).
- **should-fix** (confirmed) #29-branch: The unions stay narrow only because every area uses `satisfies`. Fix: Add a compile-time guard in src/content/index.ts, e.g. `const _narrow: [string] extends [MonsterSprite | Interior | RegionId] ? never : true = true;`. Alternatively, make areas go through a `defineArea<const A extends Area>(a: A): A` helper.
- **nit** (confirmed) #29-branch: ITEMS key order differs from main. Fix: Either build ITEMS in main's order, or state the reordering and that nothing iterates ITEMS in the PR body so the owner accepts it knowingly.
- **nit** (confirmed) #29-branch: DESIGN §13 claims src/game holds no content, but classes and races are still there. Fix: Reword it to 'no map, monster, item, spell or quest tables', or say that classes, races and the starting kit are still in party.ts.
- **should-fix** (confirmed) #29-branch: Owner's comment on #29 not addressed. Fix: When the PR opens, say in its body that monsters and items are tables per area, and ask whether the owner wants one file per monster/item now or later.
- **nit** (confirmed) #29-branch: Branch must be rebased after Wave 1; conflicts with #44. Fix: Rebase after the other Wave 1 PRs merge, move #44's assertions into the matching tools/tests/ suite, then re-run the content-identity dump, the v2 save load and the before/after ok-line diff.
- **nit** #29-branch: Interior sheet tile order changed, so tools/interiors.ts output no longer matches main. Fix: None needed; mention the sheet order in the PR so the art-pass comparison isn't mistaken for a regression.
- **nit** #29-branch: Shared trade modules keep helpers only one business uses. Fix: Move the single-use helpers into their scene files (check the renders again, since rnd order matters), or fix the header comments.
- **nit** #29-branch: Smoke interiors check is half tautology. Fix: Drop the tautological clause, or compare kinds to a count taken from content (the number of INTERIORS).
- **nit** #29-branch: A broken walkthrough aborts every suite, even unrelated ones. Fix: Import each walkthrough inside its suite function, so it is loaded lazily, filtered by name and wrapped in the same try/catch.
- **nit** #29-branch: Stale doc pointers. Fix: Restore the keying explanation to index.ts (or game/quests.ts) and point the headers at it; update the SLICE code-map row.

## Re-verification, 18:15

Every earlier fix proven by breaking it on purpose. After #64's renames were merged in:

- #62, #63, #58, #59: ready to merge. #62's smoke test is deterministic: 12 of 12 on the pinned seed, 5 of 5 random. #63's three checks are green on its head.
- #60: one fix sent at 18:20, the Foreland's area doc still says its doors have no hint.
- #61: one fix sent at 18:20, the smoke check never sees hedges or the patchwork.
- #29: every Done-when line holds. The dry-run area touches only its folder and two lines of index.ts; the tables and ATLAS are identical to main's; a v2 save loads the same; duplicates throw; `: Area` fails the typecheck. Doc pointers in #64's shelf.md and NAMES.md went stale in the move, and five nits remain; sent at 18:20.
- For the owner: CLAUDE.md's "no Oxford comma" sits beside the game-text rule, but shipped texts use serial commas. Scope it to docs and issues, or keep it for texts too?
