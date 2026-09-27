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

- Merge each pull request (sessions never merge). Pull requests merge with merge commits.
- #27: turn on branch protection for main once the workflow has run once: require the checks,
  require branches to be up to date, no required approvals. A merge queue is not available on a
  user-owned repository.
- Hold the window for #29: merge nothing else while it is open, and merge it promptly.
