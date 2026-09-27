# Phase 0 (epic #25): how the work is run

The orchestrating session's plan for the sixteen sub-issues of #25, run as parallel cloud
sessions. This folder lives only on `claude/milestone-0-orchestration-afav8x` and is never merged.
`footprints/<issue>.md` holds a scout's read-only notes on each issue, taken on main at 5dee2b7: the
files it touches, what it collides with, the traps, how to prove it. They are notes to verify, not
instructions; the issue on GitHub is what is approved.

## The constraint that sets the order

#29, the layout refactor, lands alone, with no other pull request open (EXPANSION §6, §11). It
moves the nine maps, splits the monster, item, spell and quest tables into areas, splits
`tools/test.ts` into `tools/tests/`, and blocks #30 to #34, #36 and #38. So:

- whatever edits a file #29 moves lands before #29 opens, or waits until it has merged;
- #29 is built at the same time as Wave 1, on its own branch, and opens its pull request only once
  Wave 1 has landed;
- Wave 2 starts when #29 has merged.

## Wave 1: now, landing before #29

| Session | Issues | Files | Lands |
|---|---|---|---|
| CI | #23, then #27 | `tools/smoke.ts`, `src/ui/viewport.ts` (`murkOf`); a new workflow, `package.json` | #23 first; #27 after it; then the owner turns on branch protection |
| CLAUDE.md | #28 | `CLAUDE.md` | any time before #29 |
| DESIGN | #39 | `docs/DESIGN.md` §4, §12, §14; `docs/EXPANSION.md` §2.1 (not DESIGN §13, which is #29's) | any time before #29 |
| Hints | #51 | `src/content/maps/{mill,greywater1,grove1}.ts` | before #29 |
| Terrain | #44 | `src/game/map.ts`, `src/game/atlas.ts`, `src/game/world.ts`, `src/ui/palette.ts`, `src/ui/viewport.ts`, `tools/test.ts`, maybe `tools/smoke.ts` | before #29 |
| Layout | #29 | nearly everything under `src/content/`, the tables in `src/game/`, `src/ui/interiors/`, `tools/test.ts` | built now; pull request opened only when the rest of Wave 1 has merged |

## Wave 2: when #29 has merged

#30 structure, #31 curve, #32 density, #33 pillars, #34 saves, #35 art, #36 scaffold (needs #44
too), #37 contact sheet. After the split, each check is a suite of its own in `tools/tests/`, so
they collide little. Their open questions are listed in their footprints; the owner may want to
settle some before they start.

## Wave 3

#38, the gate check, once #31 has merged: it reads each area's band from the curve.

## What only the owner does

- Merge each pull request. Sessions never merge their own. At 20:35 on 2026-09-27 the owner asked the
  orchestrator to merge the milestone's pull requests once verified; it merges with merge commits,
  after checking the combined tree locally.
- #27: turn on branch protection for main once the workflow has run once: require the checks,
  require branches to be up to date, no required approvals. A merge queue is not available on a
  user-owned repository.
- Hold the window for #29: merge nothing else while it is open, and merge it promptly.

## Sessions

| Wave | Issues | Session | Branch |
|---|---|---|---|
| 1 | #23, #27 | session_019XPasNJsyLRkoBnxBdzfmA | `claude/m0-23-smoke-seed`, `claude/m0-27-pr-checks` |
| 1 | #28 | session_01T1SdrKXT57sQerWqy5JV4Z | `claude/m0-28-claude-md` |
| 1 | #39 | session_01DkebomFuau14EF21iuWFsm | `claude/m0-39-design-cores-country` |
| 1 | #51 | session_01CsfL1TrnSXkh3LmXXdWs83 | `claude/m0-51-secret-door-hints` |
| 1 | #44 | session_01E3g6QHFXcVvAs2Cdy97hxy | `claude/m0-44-hills-farmland` |
| 1 | #29 | session_01VNqdcJMTGWfa2LumbzPFko | `claude/m0-29-layout-refactor` (pull request held) |

## Reaching a session

SendMessage doesn't reach cloud sessions. What works: `create_trigger` with `persistent_session_id`
set to the session and `run_once_at` a minute or two ahead; the run's `session_id` comes back as the
same id with a `cse_` prefix. Never `fire_trigger` a trigger bound to another session: it starts a new,
empty session instead (six such strays, "⚡ M0 orchestrator → …", were interrupted at 16:21 on
2026-09-27; they changed nothing, and as routine runs they are not in the session list).

## Main moved under Wave 1

#64 (4129f47, merged 16:37) renamed places in text only, ids unchanged: the Shelf is the Foreland,
Harrow is Helmstow, Greywater is Brandy Hole and so on (docs/NAMES.md). It conflicts with #59, #60, #61
and #62; each session was told at 16:59 to merge main and take the new names. #29 had merged it already.

## Wave 1 landed

#62, #63, #58, #59, #60 and #61 merged at 20:36 (main 2798b2f), in that order, after the six were
merged locally and checked together: `npm run check` green, five smoke runs green, `npm run build`
fine. Main's tree matched the tested tree exactly. #23, #27, #28, #39, #44 and #51 closed. Branch
protection is still the owner's to turn on. #29 was released at 20:39 to merge main and open its PR.

## #29 landed; Wave 2 next

#29 merged as PR #78 at 20:50 (main 79b1265) before the orchestrator's review, most likely by its own
session. Verified after the fact: sound (REVIEW-wave1.md). The Wave 2 footprints were re-scouted on the
new layout (footprints-w2/). Every Wave 2 suite would have edited one line of tools/test.ts, and #31,
#33 and #38 each needed a "reported, not failing" line, so a prep PR goes first (session
session_018eYejS5iiPqx6QLoSrZnbB, branch `claude/m0-prep-runner`): the runner finds tools/tests/*.ts,
awaits async suites and walkthroughs, and lib.ts gains `owed(cond, msg, whose)`. Wave 2 starts once
it has merged, with COMMON-wave2.md as every session's rules.
