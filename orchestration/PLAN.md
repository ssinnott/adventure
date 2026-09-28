# Phase 1 (epic #26): how the work is run

The orchestrating session's plan for Phase 1, the pilot that finishes M1, run as parallel cloud
sessions. This folder lives only on `claude/phase-1-orchestration-w0egtw` and is never merged. It
follows Phase 0's (`claude/milestone-0-orchestration-afav8x:orchestration/`): `footprints/<issue>.md`
holds a scout's read-only notes on each issue, taken on main at b2f7322 (the files it touches, what
it collides with, the traps, how to prove it). They are notes to verify, not instructions; the issue
on GitHub is what is approved. `COMMON.md` is every session's rules. `CANDIDATES.md` lists what was
ready at the start and what waits on what.

Orchestrator: session_017TzXpQKYibnFH632JsEHtt.

## Where it starts

At 12:08 on 2026-09-28 the owner closed Phase 0 (#25). Main b2f7322 is green: `npm run check`
ALL OK, 30 owed (#26 ×3, #40 ×15, #43 ×3, #47 ×9). #26 has thirteen sub-issues, two of them epics
(#46, six drawings; #65, eighteen issues for the Foreland to its edges), and a last line not filed
(the rest of Thornmark, filed once #47 has measured a zone map). All carry `approved`. No pull
request is open.

## The owner's calls (12:37)

- **Merging.** As in Phase 0, the orchestrator reviews each pull request against its issue, merges
  main into it, checks the combined tree and merges with a merge commit. A pull request that adds or
  changes a monster, a map or an interior waits for the owner's OK on its contact sheet first
  (EXPANSION §8.2, step 5). Sessions never merge.
- **Wave 1 is eleven sessions.** Five touch `src/game/` at once, against EXPANSION §8.1's one
  systems session; each shared file gets an owner and a landing order, as Phase 0 did with eight
  quality sessions. #43 and #17 follow once #40 lands, since they edit the same lines of Vask and
  Hale.

## The critical path

#47, the pilot (F2 and F3), waits on #66, #45, #41, #79, #80, #81, #42, #43, #76 and #99. Three of
those wait in turn: #42 on #40, #76 on #41, #99 on #100. So #40, #41 and #100 start first, with
#66, #45 and the pilot's drawings beside them; #43 follows #40. The rest of the Downs goes box by
box after #47 (#67 to #72, #87), and the Deepthorn's core (#49) after #47 and #48.

## Wave 1: now

| Session | Issues | Lanes | Branch |
|---|---|---|---|
| Pass | #40 | quality, area | `claude/m1-40-pass` |
| Monster fields | #41 | systems | `claude/m1-41-monster-fields` |
| Items | #100, then #98 | systems | `claude/m1-100-plus`, `claude/m1-98-shop-price` |
| Grid | #66 | quality, systems | `claude/m1-66-grid` |
| Wilderness | #45 | systems | `claude/m1-45-wilderness` |
| Guilds | #74, then #21 (its design first) | area, systems, design | `claude/m1-74-tier3`, `claude/m1-21-guilds` |
| Birds | #79 | creatures | `claude/m1-79-birds` |
| Wreckers | #80 and #81 | creatures | `claude/m1-80-81-wreckers` |
| Black Dog | #82 | creatures | `claude/m1-82-black-dog` |
| Barrow | #83 and #84 | creatures | `claude/m1-83-84-barrow` |
| Farm kitchen | #97 | interiors | `claude/m1-97-farm-kitchen` |

## Wave 2: as Wave 1 lands

- After #40: #43 (hand-ins), then #17 (the keep); #42 (the one quest's chapters); #85 (the built
  quests' words).
- After #41: #76 (choices, flags, letters), #88 (dens); #73 (the Lodestone) after #76.
- After #100: #99 (the Foreland's gear ladder), #101 (Thornmark's chests).
- After #79: #48 (the Deepthorn's monsters).
- After #43 and #74: #21's build.
- After #76 and #43: #77 (the side quests on the built maps; its quest 3 after #17).

## Wave 3 and on

#47, the pilot, once its ten blockers are in. Then the Downs box by box (#67, #68, then #69, #70,
#71, #72), #87 once #47, #67, #97 and #98 are in, and #49 once #47 and #48 are. The pilot measures
how long a zone map takes; the rest of Thornmark is filed after it, with the owner's agreement.

## Reaching a session

From Phase 0: SendMessage doesn't reach cloud sessions. What works is `create_trigger` with
`persistent_session_id` set to the session and `run_once_at` a minute or two ahead. Never
`fire_trigger` a trigger bound to another session: it starts a new, empty session instead.

## Log
