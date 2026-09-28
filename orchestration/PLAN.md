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

## Wave 2 started

The prep PR #86 merged at 23:11 (main 09afbf1), after a local check: the same 1,329 ok lines in
order, a dropped-in suite runs, a file with no suite fails, a failing async walkthrough fails. Wave 2
started at 23:13, every session with COMMON-wave2.md as its rules. Each check goes in a suite of its
own (structure, curve, density, pillars, shipped, art, scaffold), so none edits tools/test.ts and #30,
#31 and #35 keep out of maps.ts. #35 lands before #37's CI half (tools/changed.ts); #38 starts once
#31 has merged.

| Wave | Issues | Session | Branch |
|---|---|---|---|
| 2 | prep | session_018eYejS5iiPqx6QLoSrZnbB | `claude/m0-prep-runner` (merged, #86) |
| 2 | #30 | session_01JD8Se5AXVbg17dim3mhajM | `claude/m0-30-structure-checks` |
| 2 | #31 | session_011Rt5HgwjA5HiDvY53Q9VxD | `claude/m0-31-curve` |
| 2 | #32 | session_01YSXV6mz5mvKyX5uARvwcQY | `claude/m0-32-density` |
| 2 | #33 | session_01LnwrgPPFLbaRt4VhhH4aNm | `claude/m0-33-pillars` |
| 2 | #34 | session_018CdiTSyJCRb1Cv3Am9nLnU | `claude/m0-34-shipped` |
| 2 | #35 | session_01KrrmbGnXxUTGXFwRt2Zjmb | `claude/m0-35-art-checks` |
| 2 | #36 | session_01XeNVnJchDpX3uYZo383dHd | `claude/m0-36-scaffold` |
| 2 | #37 | session_01MjnrqGhXmsccZAggSgevxE | `claude/m0-37-contact-sheet` |

## Wave 2 reviewed

A review workflow read all eight pull requests against their issues, each finding checked by a
second agent that tried to refute it (scratchpad notes, not kept). #89 (#30) merged at 01:12 on
2026-09-28 (main 83736a1): green and level with main; its nits (the key flood walks through exit
squares, the flood isn't exported) are left for later. The other seven were sent their fixes at
01:16. #91 (#37) holds until #96 (#35) lands its tools/changed.ts, then adds the sheet job. #96 is
squash-merged, as its body asks, so the deliberate wall break stays off main. #95 (#33) waits on the
owner for its 24 edge findings, owed to 'owner' where the issue allows only fixed or #40's/#43's.
Known conflicts: #93 and #94 in src/ui/screens.ts (one import line); #91 and #92 in README.md.
#90 and #92: whoever lands second makes the scaffold emit `density: 'country'`.

The owner's call on #95's edges (01:25): narrow the rule to #33's wording, so an edge square whose
atlas cell beyond is water is skipped and the 12 Thornmark coast squares drop; owe the 12 left
(shelf 0,28-30 and 1-8,31, thornmark 31,9) to a new issue the owner files, drafted by the
orchestrator. Sent to #95 at 01:31. Its entries are re-keyed once the issue has a number.

## Wave 2 merging; Wave 3 started

A second workflow re-checked each fix (breaking each on purpose) and merged the six branches
together on main: `npm run check` green, five smoke seeds, `npm run build` fine. #96 (#35) was
squash-merged at 02:30 (15ec217), #93 (#31) merged at 02:33 (741fff3), main green after it. #90, #92,
#94 and #95 got a last round at 02:37; #91 its CI half (the sheet job, now #96 is in, and `atlas` in
tools/changed.ts's EVERY_MAP); #31's session a small follow-up PR on curve.ts. #38 started at 02:36:
session_01VXBgDwSsKr5WWLbrDdgSLo, branch `claude/m0-38-gate-check`. The edge issue's draft waits
on the owner.

| Wave | Issues | Session | Branch |
|---|---|---|---|
| 3 | #38 | session_01VXBgDwSsKr5WWLbrDdgSLo | `claude/m0-38-gate-check` |

## Last round checked; #94, #90 and #102 merged

A third workflow proved the last round's items, reviewed #103 (#38) in full with a refuter, and
merged all seven open branches together on main: `npm run check` green (1,594 ok, 41 owed), five
smoke seeds, `npm run build` fine; the only conflicts were README's tools line, which #92, #91 and
#103 all edit. #94 (#34), #90 (#32) and #102 (#31's follow-up) merged at 03:55 (main d0bc9f0). At
03:58: #92 takes the density hand-off (its drafts get `density: 'country'`); #91 fixes a check tied
to Thornmark's monster count and the two shared painting modules its sweep missed; #103 keys its
win-rate cache on the monsters, not the id, and bounds its owed misses. #95 waits on the owner's
edge issue.

#92 (#36) merged at 05:06 (main 6a2f0bd) with the density hand-off in. #91 (#37) verified; told to
merge main for README and fix a stale body line, then it merges. #103 (#38): its round held, and a
fresh review found three more (Thornmark's rest figure passes by 0.01 on seed noise; a line in
thornmark.md quotes the maps at the wrong level; gateCompany gives a stronger company under level 1),
sent at 05:08.
#91 (#37) merged at 05:14 (main 8806854) after its head, which carried main, was green in CI (sheet
job included) and locally. Left: #103 (#38) and #95 (#33, waiting on the owner's edge issue).

## Phase 0 all but done

#103 (#38) merged at 06:05 (main 781064b) after its last items were proven and its head, carrying
main, was green in CI; main is green (`npm run check`: ALL OK, 18 owed: #26 ×3, #40 ×7, #47 ×8) and
builds. Of #25's sixteen sub-issues fifteen are closed. Left: #33, whose PR #95 is verified and
waits only on the owner's edge issue (draft in the orchestrator's scratchpad, sent to the owner):
once it has a number, #95 re-keys its 12 'owner' squares (shelf 0,28 to #47, the other eleven to the
new issue) and merges. Branch protection is still the owner's to turn on.
