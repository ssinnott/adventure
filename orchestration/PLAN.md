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
  main into it, checks the combined tree and merges with a merge commit. Art waits on the owner: a
  pull request that adds a monster, a map or an interior, or whose contact sheet shows one changed to
  the eye, waits for the owner's OK on the sheet first (EXPANSION §8.2, step 5). One whose sheet shows
  nothing changed (fields, numbers, words) says so and does not wait. Sessions never merge.
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

### 13:15, five Wave 1 sessions started

The scouts' footprints for #100, #98, #66, #45, #43, #74, #21, #41 and #17 are in
(`footprints/`); #40's and the art sessions' are still being written. The five whose footprints
are final started at 13:15, each with COMMON.md as its rules (also in its system prompt, SYSTEM.md)
and its prompt in `prompts/`:

| Wave | Issues | Session | Branch |
|---|---|---|---|
| 1 | #41 | session_01HX96vEeA8wjtSKCDYnV7SH | `claude/m1-41-monster-fields`, then `-when` and `-look` |
| 1 | #100, #98 | session_01JbyZsPz1NTc8cTjfQn9Grs | `claude/m1-100-plus`, `claude/m1-98-shop-price` |
| 1 | #66 | session_01V987PdPPKAHiPfKnj2Zx3j | `claude/m1-66-grid` |
| 1 | #45 | session_01KQC92fBp7Bg9WK9VYCHypE | `claude/m1-45-wilderness` |
| 1 | #74, #21 | session_017b6Ze7q42YLoTkFWntD7BT | `claude/m1-74-tier3`, `claude/m1-21-guilds` |

What the footprints changed in the plan:

- #41 splits in three (kind and Holy Strike; when, until and after; look). Its first lands before
  #40 touches Thornmark's monster rows, and moves no owed figure past its slack.
- #43 could run beside #40 (no shared lines if `early` sits before `done`), but stays after it as
  the owner's plan has it: Hale's early words carry #40's warning, and it costs nothing on the
  critical path. #17 lands after #43, or it re-keys the owed hand-in.
- #74's finding goes to the owner before merge: tier 3 is taught free at level 4, so the change sells
  it early, at levels 1 to 3, for 160 a spell.
- #21 is four pull requests: A (DESIGN §8 and two strings) now; B (systems) after #43, #45 and #98
  and the owner's review of A; then C (the Wardens) and D (the Lanterns).
- #17 is two: A (systems: the keep's door drawn in stone, banners placed) and B (the ward, the
  gatehouse, the throne room, Vask), after #40 and #43.
- Art rule: a pull request whose contact sheet shows nothing changed to the eye (fields, numbers,
  words) says so and does not wait on the owner.

### 14:04 to 15:15: Wave 1's first pull requests, the owner's calls, the second half of Wave 1

The five sessions opened eight pull requests within fifteen minutes of starting: #108 (#74), #109
and #114 (#41's first two), #110 (#100), #111 (#21's design), #112 (#98), #113 (#66) and, after a
nudge at 14:08, #115 (#45). Two container restarts on this side delayed the review; four reviewers
(REVIEW.md, reports in `reviews/`) read seven of them.

The owner's calls at 15:10, taking every default put to them:
- #74: no. Tier 3 stays at level 4 (`levelUp` teaches it; the hall would only sell it early). #108
  closed unmerged, #74 closed as not planned, both with a comment.
- #111: the seven proposals accepted, with the reviewer's fixes (sent 15:14).
- The `UNPLACED` owed table: yes. Each drawing lands before the map that places it, owed to the
  issue that places it (#47, #69, #70, #87).
- #115's camp: the default (a camp relaxes the rest refusal to a group right next to the party).
- #41's defaults (the ogre a person; only the Rift stops when the tear closes; a sweep after the
  Warden pays 38% less, which #40 corrects in the docs).

Merged at 15:14: #109 (85e97f4) and #114 (main 7bbef2e), after CI green on both heads; main's tree
is exactly #114's tested head. Fixes sent at 15:14 to #110, #112, #113, #111 and #115 (merge main).

Started at 15:12, with prompts in `prompts/`:

| Wave | Issues | Session | Branch |
|---|---|---|---|
| 1 | #40 | session_01N6AUT2r2pg7zbiY2CXyjzz | `claude/m1-40-pass`, then `-zone` and `-dungeons` |
| 1 | the `UNPLACED` table, then #97 | session_01UaCWFTv18dPudY5PWNQ4Zh | `claude/m1-unplaced`, `claude/m1-97-farm-kitchen` |
| 1 | #79 | session_016Toj1jd4bCGps8LiF14hJ3 | `claude/m1-79-birds` |
| 1 | #80, #81 | session_018hxmJuVbbEpixrS9dTFHWg | `claude/m1-80-81-wreckers` |
| 1 | #82 | session_01RXpYjWfafLBSascHWRi73h | `claude/m1-82-black-dog` |
| 1 | #83, #84 | session_01Ge45ZQ7zivyvVdxtrsjGc1 | `claude/m1-83-84-barrow`, `claude/m1-84-barrow-captain` |

#40 runs in three pull requests: the road now; the zone once #109 (in) and #99's dressing of the
gate's company are in; the dungeons once the owner answers its open decisions 1 and 2 (how the gate
judges the dungeons; bosses out of the day) and #101 is in. The orchestrator decided its decision 3:
the road opens before the zone holds.
