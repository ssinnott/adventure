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

### 15:48 to 16:00: the owed table in; second-round and first reviews under way

State at the 15:47 check-in: every Wave 1 session had answered. Fixes pushed on #110, #111, #112
and #113; #115 merged main after #114; new pull requests #116 (the `UNPLACED` table), #117 (#40's
road) and #118 (#41's `look`, which closes #41). The four drawing sessions waited on #116.

- #116 merged at 15:49 (main 36c2e3c): the diff was exactly the footprint's verified text; the
  tests on main with it: ALL OK, 30 owed (no drawing is in yet, so no new owed line); CI green.
- 15:56: the drawing sessions told to merge main and open their pull requests; the barrow's hexes
  and sizes are the owner's to judge on the sheets, so #83 and #84 open together (#84 stacked on
  #83, saying so). The farm kitchen session went on to #97.
- Reviewers at 15:55: second rounds on #110 and #112, #113 and #111; first reviews of #115, #117
  and #118. Reports in `reviews/`.
- Footprints in for Wave 2: #88 (after #45; its burn goes through the existing choice screen, not
  #76's, so it need not wait for #76: the orchestrator's call), #76 (L, two pull requests, after
  #43; seven drafted people stand inside a business, a shape to put to the owner in its pull
  request; it and #21's build both change what a business opens on, so decide who builds that menu
  before both start), #42 (L, two pull requests: the join and the log after #117; the walkthroughs
  before #47). #99 and #101's is being written.

### 16:00: #110 and #112 merged; Wave 2 begins with #99

- #110 (#100) and #112 (#98) merged at 15:58 (main 1104e08, then 611c5de) after their second round
  (`reviews/110-2.md`, `112-2.md`): each fix proven by breaking what it guards; both heads and main
  merged cleanly and passed `npm run check` together (ALL OK, 30 owed); CI green on both heads.
  Main's tree matches the merge the reviewer tested exactly. #100 and #98 close; the session is done.
- The #99 and #101 footprints: #99 does the dressing once (`GEAR` the ladder, `gateCompany` wearing
  it), re-records four owed figures that move past their slack and settles #47's greywater2 rest;
  #101 after it, before #40's dungeon PR. The orchestrator's call: the 16 finds no box places yet
  are owed to the box issue that places each, as the owner agreed for drawings.
- Started at 15:59:

| Wave | Issues | Session | Branch |
|---|---|---|---|
| 2 | #99, #101 | session_017gmKkkiPWxH5PB61L1M1mr | `claude/m1-99-gear-ladder`, `claude/m1-101-thornmark-chests` |

### 16:10: #113 merged; #115 and #111 sent their last fixes

- #113 (#66) merged at 16:07 (main 244812a) after its second round (`reviews/113-2.md`): the seeding
  test now fails its break (1714 of 2048), HELMSTOW shows whole on the overlay. Main's tree matches
  the tested merge; `npm run check` on main: ALL OK (30 owed), SMOKE OK. #66 closes; its session is
  done.
- #115 (#45) reviewed (`reviews/115.md`): ready after two should-fixes (the merged `seen` rule passes
  a key with no id; the hint chain passes an empty, over-long or shared answer) and three nits. Sent
  16:09, with a main merge (maps.ts against #116: keep both).
- #111 (#21 A) second round (`reviews/111-2.md`): six of seven fixes hold; the new "lost garrison"
  row is still the open barrow. Sent 16:09: choose another deed; no need to ask the owner.

### 16:15: the drawings and #99's pull requests are up

- #117 (#40's road) reviewed (`reviews/117.md`): ready after three should-fixes (a stray "the ledger
  the pass waits on"; the kept gate machinery untested; the world map's padlocks and "Mountaineer"
  gone unsaid, to be shown to the owner). Sent 16:13.
- #118 (#41's look) reviewed (`reviews/118.md`): ready after three should-fixes (the combat log cuts
  a two-line look; nothing holds `groupsInSight` to sight and walls; a count that fails once any def
  has a look). Sent 16:17.
- Opened: #119 (#97's room), #120 (#82), #121 (#80, #81), #122 (#79), #123 (#83), #124 (#84, stacked
  on #123), #125 (#99) and #126 (#101). The orchestrator rendered the five contact sheets itself from
  the branches and sent them to the owner at 16:14 for the OKs art waits on. Three reviewers on the
  code (`reviews/119.md` to `126.md`).

### 16:40: the drawings reviewed; #99's fixes sent

- The six drawings are ready on their code (`reviews/119.md` to `124.md`): each def has its `kind`,
  is owed through `UNPLACED` to the issue that places it, fails its silhouette break, and leaves every
  old monster or room pixel-identical to main. Together they conflict only in
  `src/content/areas/shelf/monsters.ts` (SPRITES and the end of MONSTERS; keep both), and all six pass
  `npm run check` together (36 owed). They wait on the owner's OK on the sheets sent at 16:14.
- Landing order once the owner OKs: #118 first (it adds a `monsters` list to shipped.json; every
  drawing after it merges main and reruns `node tools/shipped.ts`); #119 any time (no conflicts);
  then #122, #121, #120, #123 and #124, one at a time, the rest merging main after each. The last of
  #120, #121 and #123/#124 brings SLICE's variants sentence up to date. Nits ride those merges.
- For #48 (the Great Owl, on the crow's frame): at the hop's peak the far wing reaches 1.24h of
  1.3h; an owl, eagle or heron must be drawn inside a smaller h, as the lampman is.
- #125 and #126 (#99, #101) reviewed (`reviews/125.md`, `126.md`): ready after fixes (merge main; the
  ladder suite must count finds given through `giftOf`, cairns and statues, once #115 is in; a check
  to hold `GEAR`'s step at 9). Sent 16:39.

### 16:50: #117, #118 and #111 merged; #43 and #42 started

- The fix rounds verified (`reviews/117-2.md`, `118-2.md`, `115-2.md`, `111-3.md`): all four ready.
- Merged at 16:46 in order: #117 (#40's road, 74a2670), #118 (#41's look, 39e1b32; #41 closes) and
  #111 (#21's design, e192f7f). Main's tree matches the tested merge exactly; `npm run check` on
  main: ALL OK (22 owed: #26 ×3, #40 ×7, #43 ×3, #47 ×9), SMOKE OK.
- #115 conflicts with #118 (SLICE's shipped.json row, pillars.ts's imports): its session merges main
  and reruns `node tools/shipped.ts`, then it merges.
- Started at 16:47:

| Wave | Issues | Session | Branch |
|---|---|---|---|
| 2 | #43 | session_015eA3U3nfug5hverH1thjvm | `claude/m1-43-hand-ins` |
| 2 | #42 | session_01Uzk1jKfKNQrxZAhfNcPuxP | `claude/m1-42-chapters`, then `claude/m1-42-walk` |

- The #41 session is done; #40's waits on #99 for its zone pull request; the guilds session waits on
  #43 and #45 for #21's build.

### 17:20: #115 merged; #88 started; #43's and #42's first pull requests in review

- #115 (#45) merged at 17:15 (main 5b3e589) after its main merge was checked: main an ancestor of
  its head, both conflicts kept both sides, `npm run check` on the head ALL OK (22 owed) with SMOKE
  OK, "Nothing new.", CI green. #45 closes; its session is done.
- Started at 17:16:

| Wave | Issues | Session | Branch |
|---|---|---|---|
| 2 | #88 | session_018nPhLL3EgGCQ1q9zdqrLC1 | `claude/m1-88-dens` |

  The burn goes through the existing ChoiceScreen (the orchestrator's call); #76 moves it later.
- #125 (#99) told to count finds given through `giftOf` now that #115 is in, then #126 on top.
- Opened: #127 (#43, the hand-ins) and #128 (#42's A, the one quest joined from chapters). Reviewers
  on both (`reviews/127.md`, `128.md`).
- The drawings (#119 to #124) merged main themselves; they still wait on the owner's OK. At 17:03
  the owner asked to see them all: the orchestrator sent each one's combat strip and a gallery by day
  and by night, close up and at the viewport's sizes.

### 17:25: the owner OKs the drawings; #122 merged

- 17:24: the owner OK'd all six drawings ("All those look good!").
- #122 (#79, the crow) merged at 17:26 (main be9f4e9) after a local merge with main 5b3e589: ALL OK
  (23 owed, the crow's to #47), SMOKE OK (34 drawn), "Nothing new."; CI green. Main's tree matches.
- The rest go one at a time, each merging main first (they all append to shelf/monsters.ts): #121
  (sent 17:28), then #120, then #123 and #124; #119 (no monster conflict) sent its two comment nits
  and a main merge at 17:28. The last of #120, #121 and #123/#124 brings SLICE's variants sentence
  up to date.

### 17:40: #127 and #128 reviewed, fixes sent

- #127 (#43) reviewed (`reviews/127.md`): ready after a main merge (pillars.ts against #115: keep
  both) and nits (unused imports; EXPANSION :170-172 into the past tense; Oxford commas; say the sheet
  is unchanged). Sent 17:38. Its three early texts are new dialogue: shown to the owner; #85 can
  still rework them with the rest of Vask's and Hale's words.
- #128 (#42's A) reviewed (`reviews/128.md`): ready after its body stops saying "closes #42" (merging
  would close #42 before B) and three test nits. Sent 17:41. The log's pictures sent to the owner.
- Whichever of #127 and #128 lands second ports the people suite to the paged log (five lines).

### 17:50: #121, #119 and #127 merged; #76, #17 and #21's B started

- #121 (#80, #81, the Wrecker and the Lampman) merged at 17:45 (main 6c2b8db), then #119 (#97, the
  farm kitchen; its two comment nits in) at 17:45 (main 56c4b55). Both heads had merged be9f4e9; the
  two tested together on main: ALL OK (26 owed: #26 ×3, #40 ×7, #43 ×3, #47 ×12, #87 ×1), SMOKE OK
  (36 drawn), "Nothing new."; CI green on both. Main's tree after each matches the tested one.
- #127 (#43) merged at 17:49 (main b580939) after its fix round (unused imports, EXPANSION §2.3 in
  the past tense, the Oxford commas, the sheet unchanged) and a main merge whose tree is exactly the
  one tested: ALL OK (23 owed: #26 ×3, #40 ×7, #47 ×12, #87 ×1), SMOKE OK, "Nothing new."; CI green.
  #43 closes.
- #120 (the Black Dog) told at 17:46 to merge main with one Downs header and its two nits; #123 and
  #124 follow it.
- #128 (#42's A): its fix round reads right (no closing keyword; marks held; pages printed;
  `openingSheet` tested). Told at 17:49 to merge main and port the people suite to the paged log,
  and to stop saying the owner took #42's defaults (the owner never ruled on them).
- #129 (#88, the dens) opened at 17:26: a reviewer on it (`reviews/129.md`).
- #125 and #126: the `giftOf` count (8acfeb8) and the step at 9 (dc1c629) are in. Told at 17:52 to
  merge main into both; a reviewer on the second round (`reviews/125-2.md`, `126-2.md`).
- The menu a business opens on (#76's PR 2 against #21's B): the orchestrator's call. B builds the
  one top menu, its entries a list made in one place (the trade, the guild's work, Leave; a business
  with only its trade opens straight on it as today); #76's PR 2 adds "Talk to <name>" to it.
- Started at 17:54, reusing sessions that know the code:

| Wave | Issues | Session | Branch |
|---|---|---|---|
| 2 | #21's B | session_017b6Ze7q42YLoTkFWntD7BT (the guilds session) | `claude/m1-21-guilds-b` |
| 2 | #76 | session_015eA3U3nfug5hverH1thjvm (the #43 session) | `claude/m1-76-words`, then `claude/m1-76-presence` |
| 2 | #17 | session_01UaCWFTv18dPudY5PWNQ4Zh (the #97 session) | `claude/m1-17-stone`, then `claude/m1-17-ward` |

  #17's B depends on #40 only through the pass (#117, in): #40's zone and dungeon pull requests touch
  Thornmark alone. Its throne room goes in B, and B's sheet waits on the owner.

### 18:02: #120 and #128 merged; #42's B started

- #120 (#82, the Black Dog) merged at 18:00 (main 0196e32): its head had merged main with one Downs
  header over the wreckers and the dog; the nits in; the drawing unchanged since the owner's OK (only
  comments moved in `wolf.ts`). On the head: ALL OK (24 owed: #26 ×3, #40 ×7, #47 ×12, #69 ×1,
  #87 ×1), SMOKE OK (37 drawn), "Nothing new."; CI green. Main's tree is the head's.
- #123 and #124 (the barrow) told at 18:00 to merge main, the guard and the captain under the one
  Downs header, #123's three nits, and SLICE's variants sentence in #124, the last drawing to land.
- #128 (#42's A) merged at 18:01 (main 59e2936) after merging main and porting the people suite to
  the log's begun pages (its break still bites); its body no longer closes #42 or says the owner took
  its defaults. Tested with main 0196e32: ALL OK (24 owed), SMOKE OK, "Nothing new."; CI green.
  Main's tree matches. #42 stays open.
- #42's B (`claude/m1-42-walk`, `Closes #42`) started at 18:05 in the same session: people met
  through `meet`, found by what they set or take (Vask moves with #17).

### 18:10: #125 merged; #40's zone started; #129 and #130 in review

- #129 (#88, dens) reviewed (`reviews/129.md`): ready after a main merge (pillars.ts against #127,
  SLICE's code map against #128: keep both) and nits (Oxford commas, "thereafter"). Every break
  fails; a 20-seed fuzz never has more than the three brood abroad; no save changes. Sent 18:08.
- #130 (#17's A, the stone doorway and placed banners) opened at 17:59: a reviewer on it
  (`reviews/130.md`), above all that nothing changes to the eye.
- #125 and #126 second round (`reviews/125-2.md`, `126-2.md`): #125 ready; #126 ready once #125 is
  in, with docs nits. #125 (#99) merged at 18:07 (main 46fe292) after a local merge with 59e2936:
  ALL OK (39 owed: #26 ×3, #40 ×7, #47 ×15, #67 ×1, #68 ×3, #69 ×4, #70 ×3, #71 ×1, #72 ×1, #87 ×1;
  the sixteen finds owed to the boxes that place them), SMOKE OK, "Nothing new."; CI green. Main's
  tree matches. #99 closes. #126 told at 18:11: merge main, the docs nits (its own and #125's
  leftover), the body's credits.
- #40's zone pull request (`claude/m1-40-zone`) started at 18:11 on the dressed company, the zone
  only; 'grove1: under' and 'grove2: under' stay owed until the owner answers decisions 1 and 2
  (put to the owner at 18:03: (b), and bosses out of the rest day, recommended).

### 18:21: #130 reviewed

- #130 (#17's A) reviewed at 5bcef1c (`reviews/130.md`): ready after fixes. All nine maps and the
  thirteen interiors render byte-identical to main's; every break fails. One should-fix: an outdoor
  zone's `banners` are dropped by `layOutdoors`, unchecked (place them, or fail any outdoor map that
  places one); nits in SLICE; the body lacks a Done-when section. Sent 18:23.

### 18:28: #126, #123, #124 and #129 merged; scouts on #85 and #48

- #126 (#101) merged at 18:22 (main 2ccfc56): its fix round (the docs say cairns and statues count,
  #125's leftover included; the Oxford comma) on a head that held main 46fe292. On the head: ALL OK
  (39 owed), SMOKE OK, "Nothing new."; CI green. Main's tree is the head's. #101 closes; the
  #99/#101 session is free. #40's dungeon pull request may now follow its zone.
- #123 (#83, the Barrow Guard) merged at 18:24 (main 4f6bf27), then #124 (#84, the Barrow Captain,
  with SLICE's variants sentence brought up to date) at 18:25 (main d6c14bb). Their fix commits
  changed only comments and dead code, so the drawings are as the owner OK'd them. Tested in turn on
  main: ALL OK (40, then 41 owed: #70 ×4, ×5), SMOKE OK (38, then 39 drawn), "Nothing new."; CI green.
  Main's tree matches each. All six of epic #46's issues are closed; the epic is the owner's to close.
- #129 (#88, dens) merged at 18:27 (main 18a8235) after its main merge and nits: tested on main
  d6c14bb, ALL OK (41 owed), SMOKE OK, "Nothing new."; CI green. Main's tree matches. #88 closes. Its
  Found in passing: facing north from the Foreland's top rows shows the world's-end pink as the sky.
- Main 18a8235: ALL OK (41 owed: #26 ×3, #40 ×7, #47 ×15, #67 ×1, #68 ×3, #69 ×4, #70 ×5, #71 ×1,
  #72 ×1, #87 ×1).
- Unblocked: #85 (its blocker #40 was the pass, open since #117) and #48 (its blocker #79, the birds'
  frame, in). Scouts on both at 18:28 (`footprints/85.md`, `48.md`); free sessions take them after.

### 18:35: four more pull requests open; #130's fix in

- Opened: #131 (#76's words, 18:06), #132 (#21's B, 18:08), #133 (#42's B, 18:13) and #134 (#40's
  zone, 18:28). Each came within about fifteen minutes of its session starting, so each reviewer is
  told to read it closely. Reviewers at 18:30 (`reviews/131.md` to `134.md`), each trial-merging with
  the others it meets: #131 with #132 and #133 (`meet`, the flags a feature sets), #133 with #134
  (the walkthrough fights Thornmark's retuned groups).
- #130's fix (b496bc6): no outdoor map may place a banner (broken on Thornmark, it fails); the SLICE
  nits; a Done-when section. It now conflicts with main in SLICE's code map row for `game/map.ts`
  (#129's den beside its banners): told at 18:36 to merge main keeping both.

### 18:55: #130 merged; #85 started; four reviews in; the order set

- #130 (#17's A) merged at 18:51 (main db1fe2a) after its main merge (SLICE's `game/map.ts` row:
  #129's den beside its banners): on the head, ALL OK (41 owed), SMOKE OK, "Nothing new."; CI green.
  Main's tree is the head's. #17's B (`claude/m1-17-ward`) cut now; it lands after #85.
- #85's footprint (`footprints/85.md`): S, one pull request; every text of the owner's fits its box;
  one log entry reworded (The Quiet Farm's `paid`); the gap: a company that hands the ledger in early
  never hears Wenna's name (a proposed line, 14 of 14, goes to the owner). Started at 18:54 in the
  #99/#101 session (`claude/m1-85-words`), to land before #17's B, which then carries Vask's words
  into `keep.ts`.
- Reviews: #131 (#76's words), #132 (#21's B), #133 (#42's B) and #134 (#40's zone): all ready after
  fixes (`reviews/131.md` to `134.md`). Sent 18:50-18:58:
  - #133: every goal walked (an in-order run through the pass, the Stone and the chisel; "Find
    someone in Thornhold" never shows today). Lands first.
  - #131: one helper for the words check that `talk`, the suite and the walk call; `holds` required;
    `personFlags` proven on words' `sets` and lists of hire flags; `condFaults` over words'
    conditions. Lands second, carrying `walk.ts`'s port.
  - #132: the hall menu's rank built when drawn; a rank never falls when content grows (the
    orchestrator's should-fix: a quest added at a held rank lowered it); `collect(CONTENT)` checked.
    Lands third, carrying its collisions with #131 and #133.
  - #134: the body says the wall at 3 is the gate bot's (it never casts Slumber: with it the zone at
    3 is 55%; a mixed group led by its most numerous monster gives 27%, failing), and that the look
    changed (two wolf groups now drawn as thorn spiders; three wraiths at 27,10). It waits on the
    owner's OK on the sheet, and lands after #133.

### 19:07: #48 started in two sessions

- #48's footprint (`footprints/48.md`): XL, three pull requests. The Deepthorn is Thornmark's zone,
  so the defs go in `thornmark/monsters.ts`; all five are beasts, the Eldest sleep-proof; each owed
  to #49 through `UNPLACED`; #49 claims the family. The owl fits the check's canvas only drawn inside
  0.85h; the heartwood inside 0.9h; the Eldest inside the view is bigger by breadth only, unless a
  systems pull request clips the combat row (the owner's one call; work need not wait).
- Started at 19:09, reusing the creatures sessions:

| Wave | Issues | Session | Branch |
|---|---|---|---|
| 3 | #48 A (the Great Owl) | session_016Toj1jd4bCGps8LiF14hJ3 (the birds session) | `claude/m1-48-owl` |
| 3 | #48 B, then C (the old wood; the Eldest) | session_01Ge45ZQ7zivyvVdxtrsjGc1 (the barrow session) | `claude/m1-48-oldwood`, then `claude/m1-48-eldest` |
| 3 | #85 | session_017gmKkkiPWxH5PB61L1M1mr (the #99/#101 session) | `claude/m1-85-words` |

  Each drawing waits on the owner's OK on its sheet.

### 19:30: #133 merged, #42 closed; four more pull requests in review

- #133 (#42's B) merged at 19:27 (main 0a4ef3b) after its fix round (7a9c27e): a run that goes to
  the Stone before Thornhold, and `everyGoalWalked` (dropping that run fails it with "Find someone in
  Thornhold who knows the Grove Stone."); choice 3 corrected; the pass break said. On the head (main
  db1fe2a in): ALL OK (43 owed: #47 ×16 and #49 ×1 with the zone check's two), SMOKE OK, "Nothing
  new."; CI green. Main's tree is the head's. #42 closes; its session is free.
- #131 told at 19:31 to merge main and port `tools/walk.ts` onto its API (one words helper for
  `talk`, the suite and the walk); then it lands, then #132 (its fix round 5418f05 is in: a rank kept
  once reached, the menu read fresh, who is ready to train; a second round after it merges #131).
- #134's fix round (e232c37): the body says how much of the wall at 3 is the gate bot's (Slumber
  never cast: 55%; the first monster struck: 27%), and that the look changed; the sheet and a
  before-and-after of tm_wolves2 went to the owner. It waits on the owner's OK.
- New: #135 (#17's B, the ward and the throne room; waits on #85 and the owner's sheet OK), #136
  (#85, the owner's words), #137 and #138 (#48's B and C, the old wood and the Eldest; wait on the
  owner's sheet OK). Reviewers at 19:29 (`reviews/135.md`, `136.md`, `137.md`, `138.md`). #48's A
  (the owl) is pushed on `claude/m1-48-owl`, not yet a pull request.

### 19:45: #136 merged, #85 closed

- #136 (#85) reviewed (`reviews/136.md`): ready. The owner's seven texts are in to the character;
  every text fits its box; #43's early words untouched; the Wenna line (14 of 14) passes #131's box
  check. Merged at 19:44 (main bdbaba9) after a local merge with 0a4ef3b: ALL OK (43 owed), SMOKE OK,
  "Nothing new."; CI green. Main's tree matches. #85 closes; the #99/#101/#85 session is free (it drops
  a serial comma from the closed body). The owner's choice 1 (Wenna for an early company) stays open;
  #47 closes it either way.
- #135 (#17's B) told at 19:48 to merge main and carry Vask's words into `keep.ts` as #85 left them:
  git conflicts only at `harrow.ts` (resolve the hunk, not the file: the Eel's new words live there
  too), and `keep.ts` would silently keep his old `lines`, `done` and `after`.
- Scouts on #47 (the pilot) and #73 (the Lodestone) since 19:30 (`footprints/47.md`, `73.md`).

### 19:53: #135 reviewed

- #135 (#17's B) reviewed (`reviews/135.md`): ready after fixes, then the owner's OK on its sheet.
  Its blocker (carrying #85's words) was already done in its main merge a2a0716 (19:49): Vask's new
  lines are in `keep.ts` alone; the Eel's stay in `harrow.ts`. Sent 19:56: the proclamation moved off
  the arrival squares; `keep_chapel` once; nits; the owner's choice (Vask's hand-in pages 19 lines and
  the gold line alone).

### 19:58: #131 back for a second round; the owl opened

- #131 (#76's words) merged main bdbaba9 and pushed its fix round and the walk's port (ecf517c):
  a second-round reviewer on it (`reviews/131-2.md`); it lands once that says ready, then #132.
- #139 (#48's A, the Great Owl) opened at 19:26: a reviewer on it (`reviews/139.md`).

### 20:05: #137 and #138 reviewed; #73's footprint in

- #137 and #138 (#48's B and C) reviewed (`reviews/137.md`, `138.md`): ready after one fix each, then
  the owner's OK: the heartwood's and the Eldest's feet hang 30 and 51 px below their roots (the
  trunk tube starts at the ground point); `barkL` unused. And a merge trap with #139: both add the
  same five `UNPLACED` entries on either side of `farm_kitchen`, which git merges cleanly and tsc then
  fails (TS1117 ×5): the second to land drops its copy. Sent 20:07 to both sessions.
- #73's footprint (`footprints/73.md`): S, one pull request, needs #131 alone (`says` and `heard`);
  the Lodestone event and Gytha on the Foreland map, a track at 17-20 on row 4 (the owner's sheet),
  the site un-planned. Starts in a free session once #131 lands.

### 20:15: #131 merged; #76's second half, #132's merge and #73 started; the owl reviewed

- #131's second round (`reviews/131-2.md`): ready; every first-round fix holds, every break
  reproduced; the walk's port green. Merged at 20:11 (main db02d4f): on the head (main bdbaba9 in),
  ALL OK (43 owed), SMOKE OK, "Nothing new."; CI green. Main's tree is the head's. #76 stays open.
- Sent 20:15:
  - #76's second pull request (`claude/m1-76-presence`, `Closes #76`) started; "Talk to" goes on
    #132's `businessEntries` once #132 lands; the comment nits ride it.
  - #132 merges main and carries its collisions with #131 (the reviewer's recipe); then a second
    round.
  - #73 (the Lodestone) started in the #42 session (`claude/m1-73-lodestone`): it needs #131 alone.
    Its map changes: the sheet goes to the owner.
- #139 (#48's A, the owl) reviewed (`reviews/139.md`): ready; the crow and every old monster
  byte-identical; one comment nit. It lands first of the Deepthorn's three once the owner OKs it;
  #137 and #138 then drop their copy of the five `UNPLACED` lines.

### 20:19: the pilot (#47) started

- #47's footprint (`footprints/47.md`): XL, seven pull requests, from a scratch prototype of both
  boxes. Two blockers before any map passes: hills fail the smoke test's crack sweep (402 of 6,830
  views on the drafts; 22 on the Foreland beside them), and an outdoor secret door draws as a block
  of masonry (it gives the Brockholt sett and the wreckers' cave away). The briefs' groups are far too
  soft for the gate's rest rule (19.6 and 10.7 fights to a rest at level 2 against 6.5 ± 1; doubled,
  6.0 and 4.8, which also matches the briefs' pay): the owner's call, in A's body. Before C the owner
  decides how the Foreland's chapter leads a company to Gullwick.
- Started at 20:19:

| Wave | Issues | Session | Branch |
|---|---|---|---|
| 3 | #47's 0a (hills and the crack sweep, quality) | session_01V987PdPPKAHiPfKnj2Zx3j (the #66 session) | `claude/m1-47-hills` |
| 3 | #47's 0b (outdoor doors in rock, systems) | session_01KQC92fBp7Bg9WK9VYCHypE (the #45 session) | `claude/m1-47-rock-doors` |
| 3 | #47's A to D (F2, F3, the people, the night) | session_017gmKkkiPWxH5PB61L1M1mr (the #99/#85 session) | `claude/m1-47-f2`, `-f3`, `-people`, `-night` |
| 3 | #73 (the Lodestone) | session_01Uzk1jKfKNQrxZAhfNcPuxP (the #42 session) | `claude/m1-73-lodestone` |
| 3 | #76's second pull request (presence) | session_015eA3U3nfug5hverH1thjvm | `claude/m1-76-presence` |

  E (the thresholds) waits until the owner has played A to D.

### 20:30: fix rounds in on the art; #132 back for a second round

- #132 (#21's B) merged main db02d4f with #131's collisions carried (c8eb5ee): a second-round
  reviewer on its fix round and the merge (`reviews/132-2.md`).
- The art's fix rounds are in: #135 (the proclamation moved, the chapel once, the words tidied; main
  merged), #137 and #138 (the feet stand on their roots), #139 (the pose picked by its face; the
  crow's sheet byte-identical to main's, checked here). All four, and #134, wait on the owner's OK.
  The orchestrator rendered the owl, the old wood and the keep from their current heads and sent them
  to the owner at 20:30 in one message.
- In progress: #76's second pull request, #73 and #47's 0b (pushed), 0a and A (not yet pushed).

### 20:42: the owner OKs the art but the throne; #132 and #139 merged

- 20:37, the owner: "So everything looks good except for the throne in the throne room that looks
  weird". Taken as the OK on the owl (#139), the old wood (#137, #138), the keep's ward and room but
  the throne (#135) and #134's look. The gate-bot point on #134 was not answered: its default stands
  (the bot stays the test; no rule changes), and the owner was told so.
- #132 (#21's B) second round (`reviews/132-2.md`): ready; a rank is now saved once reached
  (`rank_<guild>`, recorded by `node tools/shipped.ts`), so it never falls when content grows.
  Merged at 20:40 (main cb4c33a): on the head (main db02d4f in), ALL OK (43 owed), SMOKE OK, "Nothing
  new."; CI green. Main's tree is the head's. Its nits (comments that say nothing else is saved;
  Oxford commas) ride #21's C.
- #139 (the owl) merged at 20:42 (main 5a18f83) after a local merge with cb4c33a: ALL OK (44 owed:
  #49 ×2), SMOKE OK (40 drawn), "Nothing new."; CI green. Main's tree matches.
- Sent 20:43: #135 redraws the throne (read as a throne: back, arms, seat, legs; the mourning a cloth,
  not a shroud) and sends the owner a before-and-after; #76's second pull request adds "Talk to" to
  #132's `businessEntries`, built when drawn; #134 merges main to land; #137 and #138 merge main
  after the owl, dropping their copy of the five `UNPLACED` lines.

### 21:15: the Deepthorn's five and the zone merged; five new pull requests in review

- #137 (#48's B) merged at 21:12 (main 97715f9) and #138 (#48's C, the Eldest) at 21:13 (main
  49489e8), each after merging main behind the owl with one Deepthorn header and one copy of the five
  `UNPLACED` lines: on each, ALL OK (47, then 48 owed: #49 ×5, ×6), SMOKE OK (43, then 44 drawn),
  "Nothing new."; CI green; main's tree matches each. #48 closes.
- #134 (#40's zone) merged at 21:15 (main 825fd35) after its main merge: tested on main 49489e8, ALL
  OK (47 owed: #40 ×6), SMOKE OK, "Nothing new."; CI green. Main's tree matches. #40 stays open for
  its dungeons, which wait on the owner's decisions 1 and 2.
- #135 (#17's B): the throne redrawn (0790f8f, "the mourning cloth thrown over one corner"); it waits
  on the owner's OK of the throne.
- New: #140 (#73, the Lodestone), #141 (#47's 0b, doors in rock), #142 (#47's 0a, hills and the
  crack sweep), #143 (#76's second pull request, presence and "Talk to"), #144 (#21's C, the
  Wardens). Reviewers at 21:16 (`reviews/140.md` to `144.md`). #47's A is pushed on
  `claude/m1-47-f2`, not yet a pull request.

### 21:40: #143 reviewed

- #143 (#76's second pull request) reviewed (`reviews/143.md`): ready after one fix: once everyone
  listed in a business has gone, a choice re-pushes the menu, which collapses to the lone trade and
  opens it twice (Hob answered away: the inn twice; the Eel after Ebba: the keeper twice). Nits:
  hold `featureHere`'s and the automap's presence; refuse a business wearing a presence; the walk
  asks `present`; Oxford commas. Sent 21:42.

### 21:43: #140 and #144 reviewed

- #140 (#73, the Lodestone) reviewed (`reviews/140.md`): ready; the owner's 13 texts word for word,
  every box fits, "Nothing new." but `lodestone` and `q_lodestone`. Its track changes the Foreland to
  the eye: it waits on the owner's OK of the sheet. A nit sent 21:45.
- #144 (#21's C, the Wardens) reviewed (`reviews/144.md`): ready after fixes: the docs quote the
  curve's old pay (1,710 xp and 2,610 gold now for the Foreland; 8,249 and 5,800 for Thornmark);
  nothing walks the real ladder to Sergeant. Sent 21:45. Its 29 texts are the owner's call.
- The order in the Foreland's files: #143, then #144 (they meet in SLICE and `tools/smoke.ts`);
  #140, #135 and #144 meet in `docs/areas/shelf.md` §3 and shipped.json (the second keeps both and
  reruns the tool).

### 21:50: the pilot's two prerequisites reviewed

- #142 (#47's 0a, hills) reviewed (`reviews/142.md`): ready after one sentence: say that the clip to
  the hill's outline is what guards a crest light (or add a check); a Done-when section. On the laid
  drafts main fails 396 views, this 0; a real crack among hills still fails. It lands first.
- #141 (#47's 0b, doors in rock) reviewed (`reviews/141.md`): ready after fixes, two of them before
  the pilot's A: the smoke's edge rule reads `m.at` and takes a disguised door for a wall (4 views
  fail beside Brockholt's door with #142 and A in: read `V.drawnCell`, after #142 lands); the
  automap still colours a secret door as a door. Also: plain and locked doors outdoors are disguised
  but ask no hint (disguise only secret doors, or hold every disguised door to the hint rule); the
  art fixture's count. Sent 21:51 to both.

### 22:20: #142 and #143 merged; #76 closed; a scout on #77

- #142 (#47's 0a) merged at 22:18 (main 598ae50) after its fix: a hill's body held to its outline
  in the smoke test (main's floating crest light, put back, fails it). On the head: ALL OK (47 owed),
  SMOKE OK, "Nothing new."; CI green; main's tree is the head's.
- #143 (#76's second pull request) merged at 22:19 (main 6283b51) after its fix round (the trade
  reopened only while the menu offers more; a business may not come and go; presence held ahead and
  on the automap; the walk asks `present`): tested with main 598ae50, ALL OK (47 owed), SMOKE OK,
  "Nothing new."; CI green; main's tree matches. #76 closes; its session is free.
- #141 (#47's 0b) told at 22:21 to merge main and read `V.drawnCell` in the sweep's edge rule; it
  lands next, then the pilot's A opens. #144 told at 22:23 to merge main (SLICE and `tools/smoke.ts`
  beside #143: keep both); it lands after the owner has seen the Wardens' words.
- A scout on #77 (the side quests on the built maps; `footprints/77.md`), unblocked by #76.

### 22:55: #141 and #144 merged; the pilot's A opens; #21's D started

- #141 (#47's 0b) merged at 22:52 (main 37fbfff) after its fixes (only a secret door disguised
  outdoors; the automap inks it as drawn; the sweep's edge rule reads `V.drawnCell`; the fixture's
  count): on the head (main 6283b51 in), ALL OK (47 owed), SMOKE OK, "Nothing new."; CI green; main's
  tree is the head's.
- #144 (#21's C) merged at 22:53 (main d1f661c) after its fixes (the curve's figures; the Wardens'
  ladder walked to Sergeant) and its main merge beside #143: tested on main 37fbfff, ALL OK (47 owed),
  SMOKE OK, "Nothing new."; CI green; main's tree matches. The owner raised nothing on its words.
- Sent 22:56: the pilot's session opens A (F2); the guilds session starts D (`claude/m1-21-lanterns`,
  the Lanterns, closing #21).
- #140 (the Lodestone's track) and #135 (the redrawn throne) still wait on the owner's OKs.

### 23:00: #77's footprint in; #135 and #140 to merge main; #77's A started

- The owner was sent #135's redrawn throne (noon and 21:00) and #140's track and Gytha's first
  meeting (22:57), for their OK.
- Both test-merged onto main d1f661c conflict: #135 on §3's Helmstow row (#144 added "the Wardens'
  hall"), #140 on §3's Helmstow and Foreland rows and on shipped.json. Each session merges main now
  (shipped.json by the tool, never by hand); the second of the two to land merges again.
- footprints/77.md (size L, four PRs, no owed entries): A (quests 1 and 8, the Bell and the Survey
  Team, sharing Ebba) and B (quest 7, the Seal) now, A first; C (quest 2) after #135 and #47's B; D
  (quest 3) after #135. Two titles are too wide for the log's list: default the shorter ones.
- Started #77's A in the #76 session (`claude/m1-77-bell`). The guilds session is told that its
  Lantern words must agree with #77's Ebba and Ailith (read #77's Dialogue).

### 23:17: #135 merged; #40's dungeons started; #145, #146 and #147 in review

- The owner (23:10): #40's decisions 1 and 2 as recommended ((b); bosses out of the day), and the
  redrawn throne OK ("the chair looks better"). Nothing yet on #140's track: asked again.
- #135 (#17's B) merged at 23:13 (main 54ae56d) after its main merge (§3's Helmstow row with the
  Wardens' hall): on its head a082058, ALL OK (47 owed), SMOKE OK, "Nothing new."; CI green; main's
  tree is the head's (c02eb7e). #17 closes; the keep's session is done for Phase 1.
- #140 merged main d1f661c (2c1954a); told at 23:16 to merge 54ae56d once more (§3 keeps the Keep
  row; shipped.json by the tool). It waits on the owner's OK of the track.
- #40's session told at 23:14 to start the dungeons (`claude/m1-40-dungeons`) on the owner's two
  decisions; the pilot told the same (its bosses take the change from main).
- Opened: #145 (#47's A, F2; 42 owed, #47 16 → 10; changes the Foreland to the eye), #146 (#21's D,
  the Lanterns; `Closes #21`), #147 (#77's A, the Bell and the Survey). Reviewers at 23:12
  (`reviews/145.md` to `147.md`). #145's sheet went to the owner at 23:17. The pink beside the
  Brandy Hole beach is main's too; Coldharbour's walls at three squares are past the night's reach.
- Nothing else can start yet: #67 to #72 and #87 wait on the pilot, #49 on #47 and #48.

### 23:25: the owner on #145's groups: harder monsters, not bigger groups

- The owner (23:22): "I think group sizes feel off. We maybe need better harder monsters?" The pilot
  is told (23:27) to keep the brief's sizes (§4.2: three wolves, a boar, bandits with an archer, six
  crows, five rats) and make F2 harder through Downs variants on the frames that exist (new ids,
  names and tints), statted on MONSTERS §4.4's line for band 2–3 to 6.5 ± 1 fights to a rest; the
  Foreland's own monsters untouched; the pay the curve's; the variants the Downs' from now on (B
  and the later boxes), in MONSTERS §5.2 and the area doc; 'the Foreland: floor' recomputed; the
  new monsters' sheet to the owner. The #145 reviewer is told to skip the doubled groups' figures.
- The owner (23:25) OKs #145's choice 5, the Gullwick lead for C: "The way to Gullwick sounds fine".
  The pilot told at 23:28 (Hild's step after Vask's hire and before the farm; `done`
  `['q_ashcombe_done', 'q_wenna']`; the title stays "The Quiet Farm").

### 23:33: #147 reviewed

- `reviews/147.md`: ready after fixes. Main 54ae56d merges with one doc conflict (§3's Helmstow
  row), then ALL OK (47 owed), SMOKE OK, "Nothing new."; CI green. The 38 texts verbatim; a state
  explorer (176 states) strands nobody. Sent 23:35: merge main; assert the witnesses gone after
  the answer and absent at a new game; nits (the ring's `until`, a ring-only goal that doesn't name
  Ailith, a comment, an Oxford comma). All ten owner's choices: take the defaults.

### 00:27: #147 merged; the reviews of #145, #146 and #148 sent; #47's 0c started

- The container restarted at about 00:15; the reviews of #146 and #148 had finished and were on disk.
- #147 (#77's A) merged at 00:27 (main b48f459) after its six fixes (the witnesses held both ways,
  the ring's `until`, a goal for the ring alone, a comment, the comma, main): on its head 296aaa9,
  ALL OK (47 owed), SMOKE OK, "Nothing new."; CI green; main's tree is the head's (8a7dc11). The
  owner had its words from 23:37 and raised nothing. #77 stays open: B (the Seal) started at 00:30 on
  `claude/m1-77-seal`; then D (the Well); C after the pilot's B.
- `reviews/146.md` (the Lanterns): ready after fixes (each hall held alone; the Second Marker named
  by the rocks, not hills Thornmark hasn't; `lake` moved to the water or the words changed; nits).
  It closes #21. Sent 00:29.
- `reviews/148.md` (#40's dungeons): ready after fixes (the pay figures, the n/a line, the seeds'
  margins in the body, nits), then the owner's word on its ten-to-twelve bands: §4.4's line alone
  can't make the Grove Roots lost at 3 and cheap at 6; nothing else was measured. Sent 00:29, the
  swarms left as they are until the owner answers. Found in passing: the combat header reads "12
  Ogres" over two ogres and ten zealots (`src/ui/combat.ts:188`), a systems bug to put to the owner.
- `reviews/145.md` (the pilot's F2): the pilot had already built five Downs variants (ed2addf:
  Chalk Wolf, Tusker, Barn Rat, Footpad, Hedge Archer, at the brief's sizes), but registered them
  in `src/ui/monsters/` and `src/ui/sprites.ts` as recolours, the creatures lane's files. Sent 00:29:
  the drawings go first as #47's 0c, started in the Black Dog session (`claude/m1-47-downs-kinds`,
  real variants on their frames, the defs held in `UNPLACED` for #47, the sheet to the owner);
  #145 then takes them from main. Meanwhile #145: 'the Foreland: floor' back in `OWED` (the crows
  one group of six, as the brief), the lamp by day, nits, #148's side of the `OWED` hunk.
- #140 told at 00:30 to merge b48f459 (the walkthrough's three places, §3, shipped.json); it still
  waits on the owner's OK of the track.
- 00:33: #148's session told to try the owner's way first: fewer, harder groups from Thornmark's
  existing kinds (heavier roles, near one standard encounter, 8 at most, the zealot kept a soldier
  if it can be), an hour or two; if it holds it becomes the PR, else both shapes go to the owner
  with their figures and the swarm is the fallback.
- Put to the owner at 00:35: the Lodestone's track (#140) again, and whether to file the combat
  header's "12 Ogres" as a systems issue.

### 01:15: check-in; 0c and #77's B open; #148's trial; the zone swarms too

- Opened: #262 (#77's B, the Seal) and #263 (#47's 0c, the Downs' five variants). Reviewers at
  01:13 (`reviews/262.md`, `263.md`). (The owner filed issues #149 to #261 tonight, for later acts:
  lanes only, none `approved`; nothing for Phase 1.)
- #146's fixes in (c28f83a: each hall held alone; the second marker "by the boulders south of the
  river", DESIGN §8's row with it; `lake` moved to 26,22 at the water; "It has gone dark"; the
  stair; the nits) and main b48f459 merged (090f6c8); CI green. Landing check started 01:17.
- #145's fixes in (90974f5: one flock of six crows, the lamp by day, 'the Foreland: floor' owed
  again). It waits on #263.
- #148 tried the owner's way (dde9215): the Cut Stone now fewer, harder groups (4-8, the zealot a
  soldier), holding at its floor 8 (6.89 fights to a rest); the Grove Roots keeps twelve-strong
  swarms, since at its floor 6 every heavy shape a level-3 company loses costs 3-4.5 fights to a rest
  (5.5 asked). The pay figures, the n/a line and the seeds' margins are fixed in the body.
- Thornmark's zone on main (#134, 21:15) already swarms: 11 of its 14 groups hold 12 (brigands,
  spiders, skeletons). The owner's OK of #134's look could not show it (a group draws as its first
  monster). Put to the owner: keep the swarms where only they hold (the Grove Roots, the zone), or
  a shorter day, a higher floor or a changed rule.

### 01:20: #146 merged, #21 closed; #140 OK'd; #264 filed

- The owner (01:15): "Yeah loadstone approved file issues for bug".
- #146 (#21's D, the Lanterns) merged at 01:16 (main 7395a12) after its fixes and main b48f459:
  on its head 090f6c8, ALL OK (47 owed), SMOKE OK, "Nothing new."; CI green; main's tree is the
  head's (0d9649f). #21 closes (#111, #132, #144, #146). The guilds session is done for Phase 1.
- #140: its track OK'd. A test merge onto 7395a12 clashes only in shipped.json; its session told at
  01:19 to merge main and rerun the tool. It lands when CI is green on that head.
- Filed #264 (Bug, `lane: systems`, a sub-issue of #26, not approved): a mixed group in a fight
  is labelled with its first monster's name and the whole group's count (`src/ui/combat.ts:188`;
  "5 Ogres" for `tm_ogre`, "12 Bone Knights" for `tm_barrow`). Its line added to #26's Work.
- Still with the owner: the swarms where only they hold (the Grove Roots, Thornmark's zone).
- The owner (01:20) chose 1 of three: keep the swarms where only they hold (the Grove Roots; the zone
  as #134 left it). #148 lands as it stands, the Cut Stone harder and the Grove Roots swarms; the
  defaults stand (bosses in the floor pool, greywater2 unjudged two under, the bot). Told at 01:24:
  merge main 136c3c6 (the Lanterns move Thornmark's clear: the four places; `thornmark.md` meets
  #265), and write the owner's call into MONSTERS §4.4 with §4.2's row for the thin fodder.
- Main took #265 at about 01:20 (not ours: the Deepthorn's plan for #208, docs only, `thornmark.md`
  and MONSTERS.md), so main is 136c3c6.
- #140 merged main 7395a12 (b4fafa1; CI green). Test-merged onto 136c3c6 cleanly (tree e3e4f58);
  the landing check started 01:22.
- #140 (#73, the Lodestone) merged at 01:23 (main 0ced6cf) on the owner's OK: its head b4fafa1
  (with main 7395a12) merged onto 136c3c6 cleanly, and that tree tested ALL OK (47 owed), SMOKE OK,
  "Nothing new."; CI green on the head; main's tree is the tested merge's (e3e4f58). #73 closes;
  its session is done for Phase 1.

### 01:30: #263 reviewed

- `reviews/263.md`: ready after fixes, then the owner's OK on the look. The Tusker, Barn Rat,
  Footpad and Hedge Archer read as their own at combat size; the Chalk Wolf is still the stand-in
  (8.8% of its ink off the wolf's, where the Black Dog is 26%; `leg` is thickness, so it came out
  heavier, not leaner), its eye glows at night (the rift hound's untoned ember), and its def is
  ed2addf's level 3 where the pilot's F2 needs 90974f5's level 4. Main 0ced6cf merges clean: ALL
  OK (52 owed, the five `UNPLACED`), SMOKE OK. Sent 01:40. Found in passing, for the owner later:
  nothing holds a family module's `KINDS` to `FAMILY` (the quality lane's).
- For #145 once #263 lands: take main's side for the five (bandit.ts's dispatch line conflicts),
  delete its own defs block (it merges silently as a second definition), drop the five from
  `UNPLACED`.

### 01:36: #262 reviewed

- `reviews/262.md` (#77's B, the Seal): ready after fixes. The 7 texts verbatim; a state explorer
  (264 states) strands nobody, the seal given and paid once. Sent 01:40: merge main 0ced6cf (§3's
  Helmstow row, §8's gold line, shipped.json by the tool); nits: `gw1_coat` `until` the done flags,
  assert the strongbox's words. All six owner's choices: the defaults. Found in passing: an unhired
  company that hands Hale the seal is greeted afresh next time (#43's rule, as designed).

### 01:58: check-in; #148, #262 and #263 fixed

- #148 merged main 0ced6cf (a7a6369: the Lanterns' curve figures in the four places, #265's plan
  kept) and wrote the owner's call into MONSTERS (§4.2 a Thin fodder row, the thorn spider and the
  brigand; §4.4 many and thin where a map's floor sits within about three levels of its area's two
  under, fewer and harder elsewhere). CI green; landing check started 01:57.
- #262 merged main (2ec4c71) and pushed its nits (b3b8418: `gw1_coat` `until` the done flags; the
  strongbox's words asserted). CI green. It lands after #148, tested on the new main.
- #263 pushed its fixes (2f779c2: the Chalk Wolf lean and long in the leg, an amber eye, the pilot's
  level-4 def) and merged main (b9e96f9). Its sheet (the five beside the Foreland's own) went to
  the owner at 01:59; it waits on their OK of the look.
- #148 (#40's C, the dungeons) merged at 01:58 (main 9462c89): on its head a7a6369 (main 0ced6cf
  in), ALL OK (40 owed: #40's six gone, #47's 'greywater2: under' with them), SMOKE OK, "Nothing
  new."; CI green; main's tree is the head's (946dbd2). #40 closes; its session is done for Phase 1.
- #262 merges onto 9462c89 cleanly (SLICE auto-merged); the landing check on that merge started
  01:58.
- #262 (#77's B, the Seal) merged at 01:59 (main 12956d4): its head b3b8418 merged onto 9462c89
  cleanly, and that tree tested ALL OK (40 owed), SMOKE OK, "Nothing new."; CI green on the head;
  main's tree is the tested merge's (537049c). #77 stays open; D (the Well) started at 02:02 on
  `claude/m1-77-well`; C after the pilot's B.

### 02:42: check-in; #266 open

- Opened: #266 (#77's D, the Well, `claude/m1-77-well`). Reviewer at 02:42 (`reviews/266.md`).
- #263 (the Downs' five) still waits on the owner's OK of its sheet (01:59); #145 waits on #263.
  The pilot has F3 on `claude/m1-47-f3` (on F2's branch, at the brief's sizes, the wreckers on the
  line), a branch only, as asked.

### 03:05: #266 reviewed

- `reviews/266.md` (#77's D, the Well): ready after fixes. The 13 texts verbatim; an explorer over
  440 states finds no fault; the gate walks both lanes day and night. Sent 03:08: Osmund's record
  test can't fail (hear him twice); nits (`well_swept`'s night held, a header, a comma, two long
  lines). All seven owner's choices: the defaults (6: both events on the west lane only).
- For #67's brief when it starts: key its Mottram words to `q_well` or say them once, so they never
  hide the well's first meeting.

### 03:27: #266 merged; everything else waits on the owner's OK of #263

- #266 (#77's D, the Well) merged at 03:27 (main 2cc52cd) after its fixes (853fb41: Osmund heard
  twice, `well_swept` held to the night, the docs wrapped): on its head, ALL OK (40 owed), SMOKE OK,
  "Nothing new."; CI green; main's tree is the head's (e227186). #77 has A, B and D; C waits on
  the pilot's B (F3), which waits on #145 and #263.
- #263's head moved to 33f13d4 (a main merge only; no drawing changed since the sheet sent 01:59).
  It waits on the owner's OK of the look; the chain behind it: #263, then #145 (F2), then the
  pilot's B (F3), then #77's C.

### 04:31: check-in; waiting on the owner

- No new PR. #263 merged main again (5f5608c; no drawing changed since the 01:59 sheet); the pilot
  merged main into F2 (aafc250) and builds F3 (`claude/m1-47-f3`) and C (`claude/m1-47-people`) as
  branches. Everything waits on the owner's OK of #263's look.
- 05:30: nothing moved; still waiting on the owner's OK of #263.

### 06:28: the owner on the Downs' five

- The owner (06:27): "The hedge archers should probably look more leaf like." Nothing on the other
  four (taken as OK unless they say otherwise). Sent 06:30 to the Black Dog session: rework the
  Hedge Archer as a hedge with a bow in it (foliage to the knees, sprays off the arms and hood, the
  face half-hidden, leaves on the bow, one silhouette, the bow still clear), then the sheet again.
- 07:07: #263's Hedge Archer redrawn (304ee61: foliage to the knee, leaves on the arm, face and bow;
  only `bandit.ts`). Its sheet (with the four others unchanged) went to the owner at 07:07 for
  their OK.
- 07:10: #263's landing check on 304ee61 (main 2cc52cd in): ALL OK (45 owed: the five new monsters
  owed to #47 until F2 places them), SMOKE OK, "Nothing new."; CI green. It lands on the owner's OK
  of the Hedge Archer.
- 08:07: nothing of Phase 1's moved; #263 waits on the owner's OK. A new branch `claude/phase-1-2-docs` (07:13) is not ours (Act II's docs); left alone.
- 09:06: nothing moved; check-ins now two hours apart while every session waits on the owner.

### 11:28: the Hedge Archer out, the Poacher in

- The owner (between 09:06 and 11:06): "The hedge archer just looks lob like I think it need a new
  concept. Like maybe it kinda looks like a bush ona a person that makes no sense." Put three
  concepts to them at 11:27; they chose the Poacher: a Downs countryman with a longbow taller than
  he is, a broad-brimmed hat, a patched jerkin and a hare at his belt. Sent 11:30 to the Black Dog
  session: redraw on the archer's frame, rename `hedge_archer` to `poacher` everywhere (never on
  main), the other four unchanged, then the sheet. The pilot's F2 places `poacher` in its place.

### 11:35: #264 approved and started

- The owner (11:33): "Yeah approved 264". `approved` put on #264 at the owner's word. Started at
  11:37 in the #45 session (session_01KQC92fBp7Bg9WK9VYCHypE) on `claude/m1-264-group-labels` from
  main a434a53 (the owner merged #267, Act II's docs, at about 11:30).
- Still with the owner: #209 (approve; run after F2), close #46, the KINDS/FAMILY check, scouting
  #67 and #68 now.
- The owner (11:40): "209 is good too". `approved` put on #209 at the owner's word. A scout on it
  at 11:41 (`footprints/209.md`); it builds after the pilot's F2 lands (both edit the gate's `OWED`),
  in a free quality session.
- The owner (11:44): "Close 46". #46 (the Downs' monsters drawn: #79 to #84, all merged) closed as completed.
- The owner (11:47): "4+ 5 sound good to". Filed #268 (Task, `lane: quality`, a sub-issue of #26,
  not approved): each monster family's `KINDS` held to `FAMILY`; its line added to #26's Work.
  Scouts on #67 (Crowness, E3) and #68 (the Wend's fields, E2) at 11:49 (`footprints/67.md`,
  `68.md`), planning against the pilot's branches, #263's variants and #209.
- 11:58: `footprints/209.md` (size M, one PR, about 2.5 hours, the quality lane). After #145 (both
  edit `OWED`, shelf.md §8, SLICE's owed sentence) and before #47's B (on F3's head today's rule
  gives 89.98% against 90%), #67, #68 and #214. With F2, 'the Foreland: floor' goes (99.6% with
  each group at its own map's floor). For the owner: as written, #209 judges every group two under
  its own map's floor, which undoes #148's (b) for dungeons (Thornmark 62.4%, the Foreland 65.8% on
  main). The scout's default keeps (b) for dungeons and changes no figure today.
- The owner (12:00) on #209: keep #148's rule for dungeons (the footprint's default); zone maps
  judged at their own floor and two under it. Recorded on #209 in a comment. Order: F2 (#145), then
  #209 in a free quality session (the #40 session, which knows the gate), then the pilot's B (F3),
  #67, #68, #214.

### 12:13: the Poacher's sheet to the owner; #269 opened
- #263's Poacher pushed (37e1f80, 11:37; CI green). Sheet (`--monsters poacher,bandit_archer,footpad,
  chalk_wolf,tusker,barn_rat`) and a close crop sent to the owner for their OK. My read of the round:
  the rename is whole (defs, `SPRITES`, `FAMILY`, `UNPLACED`, shipped.json, §5.2's row); against
  main, `bandit.ts` only adds (the archer is main's again). One line missed: MONSTERS.md:504, the
  Footpad's row, "two with a hedge archer"; the Black Dog session asked to fix it (12:20 trigger).
- #270 (the Deepthorn's plan, #208's docs, not ours) merged at 11:54, not by me. Main is 0a8fd4d.
- #269 (#264's fix, the #45 session, 8bed946; CI green) opened 11:44: a reviewer started
  (`reviews/269.md`), asked also to try it with #145 (both touch smoke.ts and SLICE.md).

### 12:25: the footprints for #67 and #68 in
- `footprints/67.md` (Crowness, E3; size L, 10-14 h; 0 creatures, A the map, B the keeper's step and
  Oil for the Lamp) and `footprints/68.md` (the Wend's fields, E2; size L, 6-10 h; 0 the rookery's
  keepers, A the box, B Riders in the Dark). Both measured on the pilot's C (e098228) with main in.
- Both find the brief's groups soft at 3 (8.63 and 9.36 fights to a rest against 6.5 ± 1): harder
  monsters, as the owner asked. E3: a crab and the road's bandit and archer at 4; E2: an elite bird
  on the crow's frame (an Old Rook, id never `rook`). One creatures PR for both (0), after #263; the
  Black Dog session, which drew #263, is the natural hand.
- **For the owner (a correction of mine):** under #209 as ruled (B), E3 and E2 are judged two under
  their floor, at 1, in 'the Foreland: under' (25% at most). Both scouts, and #209's, find nothing on
  MONSTERS §4.4's line or in a swarm lost at 1 and 6.5 fights to a rest at 3 (E3 72%, E2 67.8% at 1
  with the harder monsters). My 12:00 question said nothing that passes today fails, which is true,
  but left out that the Downs' boxes above 2 cannot pass it. #209's footprint said so ("those boxes
  need swarms or the owner's C"). Their shared default: tune to the box's own floor, owe 'the
  Foreland: under' to #47's E (the thresholds, set after the owner plays A to D). Alternatives:
  #209's D (the Downs never judged two under); a softer two-under test at low levels.
- Order: both issues are blocked by #47 ("tunes the thresholds this one is held to"), so A and B land
  after #47 closes with E; 0 and the authoring can go ahead. #67's footprint lands A after F3 with the
  figure owed; #68's after E. I take the issues' word (after E) unless the owner says otherwise.

### 12:35: #269 reviewed
- `reviews/269.md`: ready, four nits. Combined with main 0a8fd4d ALL OK (40 owed), SMOKE OK, "Nothing
  new."; with #145 no conflict either way, labels ok over 1,416 fights. Counts follow deaths (295,420
  random death steps); the measure is exact (221 strings painted in Chromium).
- One round asked of the #45 session before I land it: 24 px between groups (14 px is hardly more
  than the ", " inside one; 24 still keeps every fight to two rows); the vertical check held to the
  fight's highest marker, not half the view; faults or fights counted as the message says, the body
  corrected; the Oxford commas out (SLICE.md, comments, body); `PLAYED_DEFS` if cheap.
- Found in passing, for the owner (an issue, systems): the target marker '▼' (`combat.ts:179`) is not
  in the font, so choosing a target shows nothing over the monster.

### 12:50: #269 landed
- The #45 session's round (30b2abf, 13484d4; main merged at e3d3ea1): groups 24 px apart; `seatFoot`
  and `MARKER_RISE` shared with combat.ts, the check holding every line's painted foot above the
  highest marker (the 67 px fixture caught: "reaches 80 px down, onto the monsters' markers at 76");
  fights and faults counted apart; `PLAYED_DEFS` (3,071 fights: 2,511 one row, 550 two, 10 three,
  all above the markers); no Oxford commas. Read the diff: the seat and marker formulas are
  unchanged.
- Landing check on 13484d4 (main 0a8fd4d in): ALL OK (40 owed), SMOKE OK, "Nothing new." (`check269.log`);
  CI green. Merged as b59933d; main's tree 8cf9db4 is the tested tree. #264 closes with it.
- The #45 session is free (systems). For the owner: file the '▼' marker bug?

### 13:25: the owner's answers; #263 landed; #271 filed
- The owner (13:00): the Poacher looks fine; the gate test "should be more of a suggestion": within
  a range is fine, no massive outliers, and no overfitting to a number; the target marker "worth
  doing" as a small fix.
- #263: landing check on 8e61ebe merged onto main b59933d: ALL OK (45 owed: the five "appears on a
  map (#47's)" lines new), SMOKE OK, "Nothing new." (`check263.log`). The head moved to 5ce7d84 (the
  Black Dog session merged main at 12:58); its tree is the tested tree (34ca6ce), CI green on it.
  Merged as 92e14f5; main's tree is the tested tree.
- The pilot told (13:23 trigger) to merge main into #145: main's side for the five, its defs block
  gone, the five out of `UNPLACED`, `poacher` for `hedge_archer` everywhere, shipped.json from main's
  plus F2's own, then F2's sheet to the owner. I land F2 on the owner's OK.
- #271 filed at the owner's word (Bug, lane: systems, under #26; not approved): the target marker
  '▼' is not in the font (`src/lib/engine/text.ts`, the engine's); the fix draws '↓', which the font
  has, and a test holds `src/ui/`'s symbols to the font. Only '▼' is missing today ('▶', the arrows,
  '★' and '♥' are in). For the #45 session once approved.
- The gate: I put to the owner an aim and a limit for each figure (inside the aim quiet; between,
  listed as off its aim; past the limit, a failure), with suggested limits (through 80%, rests 4-10,
  boss 20-80%, two under 75% or 90%). At 75% E2 and E3 still need the scouts' harder monsters (about
  70% two under); at 90% the brief's groups pass with notes. To be filed as a quality issue if the
  owner agrees, built after #209 by the same session. The Downs' new monsters (0) wait on this.
- 13:25: the owner: "if we're waiting on harder monsters to level it out, we're blocked on that, and
  should fix that first". So #67's and #68's 0 starts now: the Black Dog session (13:29 trigger)
  draws four level-4 variants on branch `claude/m1-downs-harder` ("Part of #67" and "Part of #68"):
  a crab on the Shore Crab's frame (Crowness), the Salt Road's harder bandit and archer (the F3
  wrecker's and lampman's numbers), and the rookery's keepers (`old_rook`, never `rook`; 68.md
  decision 2's stats). Held in `UNPLACED`; names and looks the owner's on the sheet. The aim-and-limit
  issue is still to be agreed (with the harder monsters E2 and E3 stand at about 70% two under, under
  a 75% limit).

### 13:40: the owner delegates their calls
- The owner (13:35): "when you run into a question like this, launch a Fable subagent, ask them the
  question, and then go with whatever answer they suggest. They must make a decision. This should
  fully automate the loop, and you should be able to churn through the remainder of the work."
- So from now: every question that went to the owner (designs, filings, approvals, the OK on a
  contact sheet) goes to a Fable subagent briefed by `DECIDE.md`, which must decide; I act on its
  answer and log it here as the delegate's. Sheets still go to the owner to see, but nothing waits
  on them. `approved` put on at the delegate's word is marked so on the issue. COMMON.md tells the
  sessions not to wait on the owner.
- The remainder of #26: #65 (the Downs: #47, #67 to #72, #77, #87, #209, all approved), #208 (Phase
  1.1, the Deepthorn: #49, #210 to #219, none approved; the owner's planning session that wrote them
  is archived), #268 and #271 (not approved).
- First batch to the delegate (13:40): the aim-and-limit gate issue; #271; #268; #47's E without
  the owner's play; #208.
- 13:45: the pilot pushed 86777ac ("Merge main, with the Downs' own drawings and the Poacher"): no
  `src/ui/` file differs from main, no "hedge archer" left, shipped.json only adds F2's (the zone,
  five groups, eight features, the sett's door), `mill:m_warden: floor` re-keyed to #87. Landing
  check on 86777ac (main 92e14f5 in): ALL OK (36 owed), SMOKE OK, "Nothing new.", labels ok over 4,836
  fights; downs_f2 at 2: 99.6% won, 6.44 fights to a rest; the Foreland at 1: 89.4% (owed). CI green.
  Tree 224f968. The sheet (`sheet145f.png`) shows the void pink south of F2 where F3 is not built:
  `VOID_PINK`, by design. The art OK and #145's choices put to a delegate (13:47).

### 13:55: the delegate's first decisions (Fable, `DECIDE.md`)
- **Q1, the gate as a suggestion:** file it (Task, `lane: quality`, under #26), blocked by #209,
  blocking #67's and #68's A, #214 and #47's E; approved. Limits: through 80%; fights to a rest 4 to
  10; a boss at its floor 20 to 80%; two under 90%; the road 65%; `bossAbove` 75%; the warning 10
  points under the median. Inside the aim quiet, between a pass listed with its figure, past the
  limit a failure; `OWED` kept only for those past it. Its own issue, built straight after #209 by
  the #209 session. Why 90%: every two-under figure Phase 1 can measure sits on the flat of the line
  (E3 64-87%, E2 67.8%, D2-D4 68-100% at 2, H3 100% at 6); 75% would bind each box to its hardest
  shape, and 90% still fails a walkover.
- **Q2, #271:** approved; the #45 session builds it now, then #210.
- **Q3, #268:** approved; built now in the quality lane, ahead of #209.
- **Q4, the owner's play:** #47's E goes ahead without it, after C (D beside it), on the harness's
  and the bot's measurements under Q1's gate; the hours written into the briefs, "what the owner
  found" added when they play. #67 and #68 wait on #209, the aim-and-limit issue, #272 (their 0) and
  the pilot's B and C on main, not on E. Their Dependencies (and #214's, #49's) kept in step; #47
  stays open on its last line ("the owner has played them"), which nothing waits on.
- **Q5, Phase 1.1 (#208):** approve #208 and its eleven now, built beside the Downs in Thornmark's
  own area lane: one Thornmark area session, #211 (names as thornmark.md §10: Henlys, Penspern,
  Dowrdu, Lyngwyn), #213, then #219; #210 in the systems lane after #271; #212 in the quality lane
  after the aim-and-limit issue; #214 when #209, aim-and-limit, #210 and #212 are in; then #49,
  #215, #217, #216, #218 down their chains; #163 (Act II's dead wood, #216's blocker) to the delegate
  when #49 lands.
- 13:58: the delegate on #213, asked again with #74's refusal in view: close it as not planned, as
  #74 was (`levelUp` teaches the tier free at 8; a hall checks no level, so `maxTier: 5` sells only
  early, against MONSTERS §4.4). Closed with a comment; #211's pull request corrects thornmark.md §8
  and §9's decision 19. `approved` put on #268, #271, #208 and #49, #210, #211, #212, #214 to #219
  (the delegate's word; a comment on #26 says so). Filed #273 (the gate's aims and limits; Task,
  quality, approved, blocked by #209). The Dependencies of #47, #49, #67, #68, #209 and #214 kept in
  step (a subagent writes them, each checked against the body read at 13:40).
- 13:52: the delegate on F2 (#145): land it as it is (sheet, texts and choices 1 to 5 taken; the pink
  is the void). Merged at 13:55 as f438644 (head 86777ac, main 92e14f5 in it, tested tree 224f968).
  **The auto-mode classifier then refused my post-merge tree comparison as "Merge Without Review"**:
  not retried, not worked around. Put to the owner: merges on the delegate's word may be refused the
  same way; they decide how merging goes from here.
- 13:59: the delegate on #272's drawings: OK, all four and every choice (nits for the code review:
  three Oxford commas in comments, "the near forearm bare"). The code reviewer still runs.
- 14:01, sessions sent new work: the #40 session #209 then #273; the #45 session #271 then #210; the
  #97 session #268; the pilot B (F3) now, then C, D and E as the delegate settled. New session
  session_01FvrT4W9tXZiXXhFgKCnCES (Thornmark's area lane): #211, then #219.

### 14:02: the owner on merging
- The owner (14:02): "You should review the work and merge it yourself." So the gate for a merge is
  my own review: a reviewer's report (REVIEW.md) read and its findings settled, the diff read, the
  landing check on the head with main in, CI green, then the merge and the tree compared. The
  delegate still decides what was the owner's (design, art, filing, approval); it no longer stands
  in for the review.
- F2's post-merge check, run now: main f438644's tree is 224f968, the tree tested at 13:45.
- 14:10: the Dependencies of #47, #49, #67, #68, #209 and #214 written and read back (each body
  byte for byte the 13:40 read before the write; #49's and #214's later `updated_at` was my labels).

### 14:20: #272 reviewed
- `reviews/272.md`: ready after fixes. Merge main (F2's `UNPLACED` conflicts at maps.ts:18-24; with
  main's side plus the line of four: ALL OK, 40 owed, SMOKE OK, "Nothing new."). Nits: the Billman's
  far arm bare from the shoulder (a jack with one sleeve; the comments say bare forearms); the
  sling's ring undimmed at night (`bandit.ts:481`); Oxford commas in five comments and the body.
  All 49 monsters on main draw pixel for pixel as before (40,572 drawings by hash); the stats sit on
  §4.4's line at 4 as the footprints measured. Found in passing (quality): the silhouette check
  cannot see a part drawn wholly off its canvas (`tools/smoke.ts:561-577`): for the delegate's next
  batch.
- Sent to the Black Dog session (14:23): merge main, sleeve the far arm to the elbow, dim the ring,
  the commas. I land it on that head.
- 14:23: the Claude Code Remote server needs signing in again ("run /mcp to re-authenticate"): no
  triggers, sessions or subscriptions from here until the owner re-authorises it. #272's round sent
  as a comment on the PR instead (its session watches it). The 14:40 check-in was set before the
  outage and fires server-side; re-arming it after needs the server back.

### 15:10: the outage over; four new pull requests in review
- The Claude Code Remote server came back by itself (15:04) with the container's restart; no sign-in
  was needed. For next time: https://claude.ai/customize/connectors, sign in again, tools allowed.
- The outage held two of my 14:01 messages: the #45 session (#271, then #210) and the pilot (F3)
  never got them. Fired again at 15:05. The Thornmark session's own "start #219" reminder was held
  too and would not fire; a fresh message sent (15:09). #272's round re-sent as a message (15:07),
  its session not having acted on the PR comment.
- Opened in the outage: #274 (#211, the names; session_01FvrT4W9tXZiXXhFgKCnCES, 14:06), #275 (#268;
  the #97 session, 14:09), #276 (#209; the #40 session, 14:11), #277 (#273, stacked on #276, 14:17).
  Reviewers started on all four (15:10), and a delegate on #274's names; all four watched.
- 15:15: the delegate on #274's names (Henlys, Penspern, the Dowrdu, Lyngwyn) and texts: they stand,
  both Choices taken. Two doc nits ride the code review's round if it reopens the branch: no river
  is lettered on the atlas (`River.name` is read by nothing), so thornmark.md §4 and §10 should say
  "named in the atlas" as shelf.md does; two prose lines over the docs' wrap (DESIGN.md:425,
  thornmark.md:76).

### 15:17: #275 reviewed
- `reviews/275.md`: ready after fixes. The check fails every way asked (a kind dropped, under another
  drawer, in two lists; a `KINDS` entry drawn by nothing), maps drawers by identity (13 drawers);
  with main ALL OK (36 owed), SMOKE OK, "Nothing new."; with #272 in, it holds over 53 kinds.
  Should-fix: `changedMonsters` reads `KINDS` by regex (`tools/changed.ts:64-67`) and nothing holds
  that to the imported lists (double quotes or a trailing comment drop monsters off the sheet): the
  body's first choice, decided in review as the fix, not the default. Nits: the fixture misses the
  two-lists branch; an ok that drawers are distinct; an Oxford comma (SLICE.md:427); `familyModules`
  repeats `families` (pillars.ts:193-200). Sent to the #97 session (15:19).

### 15:19: #277 reviewed
- `reviews/277.md` (reviewed over #276's head): ready once #276 lands; nits only. With main (f438644
  is the base): ALL OK (33 owed; #276 alone 35, `shelf: rest` and `greywater1: rest` go), SMOKE OK;
  every figure takes the table's aim and limit, every edge right, each dropped entry put back fails.
  The list: shelf at 1, 4.60 fights to a rest; greywater1 at 2, 4.05 (both between aim and limit).
  Nits: the judge fixture probes `GATE.through`'s live numbers (fails if #47 moves them) and nothing
  tests the list (`gate.ts:110`); wording (MONSTERS.md:290 "listed" for any map 4-10; `gate.ts:239`
  "fails" at 60.5% two under; "threshold" at `:83-84`, `:87`); Oxford commas (EXPANSION.md:275,
  `gate.ts:22`, `:44`, `:48`, `:204`, `:210`). Choices: all three taken. greywater1 sits 0.05 inside
  its limit. Sent with #276's round when its review is in.

### 15:20: #274 reviewed
- `reviews/274.md`: ready, four nits. With main (its parent) ALL OK (36 owed), SMOKE OK, "Nothing
  new."; no id moves; old names left only in §10's record; #213's two lines right. Nits: HENLYS's
  label (`above`, `thornmark/atlas.ts:24`) breaks under THE DEEPTHORN on the zones overlay (Tab):
  `label: 'below'`; thornmark.md:681 "letters the Dowrdu" (nothing letters a river: "names"); the
  body credits `labels.ts` for the sites (it is `atlas.ts`); thornmark.md:215 puts Penspern at the
  tip, where it stands on the crown (296,142). With the delegate's two (§4 "lettered"; DESIGN.md:425
  and thornmark.md:76 over the wrap), sent to the Thornmark session. For #219: its Dialogue's "the
  oldest hold" and "the still lake" may be written as Henlys and Lyngwyn where they read better.

### 15:22: #276 landed
- `reviews/276.md`: ready, nits only. The rule as the owner ruled it (a zone map at its own floor and
  two under; a dungeon two under its area's); the body's figures reproduce ('the Foreland: floor'
  89.4% owed to 99.6% of 42 groups; Thornmark's floor 94.1% to 97.2%, under 21.5% of 34). With F3 on
  top: the Foreland 99.7% of 45; F3 re-records 99.6% at shelf.md:547.
- My landing check on 359f7e4 (main f438644 its base): ALL OK (35 owed), SMOKE OK, "Nothing new.";
  CI green; the diff read (`areaPools`, zone-keyed `BOSSES` and `ROADS`). Merged as ec2b93c; main's
  tree is the tested tree (8dd9388). #276's nits ride #277 (the same lines), sent at 15:24 with
  #277's.

### 15:29: #272 landed
- The Black Dog session's round (adf3543): main merged (f438644), the Billman's far arm sleeved to the
  elbow, the sling's ring toned, the commas out. Looked at: the Billman reads with both sleeves.
- Landing check on adf3543 merged onto main ec2b93c: ALL OK (39 owed: the four new "appears on a
  map", #67 ×3 and #68 ×1), SMOKE OK, "Nothing new."; CI green. Merged as a584985; main's tree is the
  tested tree (6dd842b). #67's and #68's 0 is done: their A waits now on #273 (#277) and the pilot's
  B and C.
- #275's round (b311e09): `kindsOf` exported and held to each module's `KINDS` in
  tools/tests/changed.ts, the two-lists case, drawers held distinct, `familyModules` shared in
  lib.ts. Its landing check runs on main a584985 (with #272's four kinds) in scratchpad/land2.
- 15:30: #275 (#268) landed: its landing check on b311e09 merged onto main a584985 (with #272's four):
  ALL OK (39 owed), SMOKE OK, "Nothing new."; the new lines "each family module's KINDS are the kinds
  FAMILY sends it (53 kinds, 13 modules)", "exports a drawer of its own", "KINDS reads from its text
  as it imports"; CI green. Merged as 466ca5c. #268 closes with it.
- 15:31: #212 (the Deepthorn's gear ladder) sent to the #100 session (session_01JbyZsPz1NTc8cTjfQn9Grs,
  idle since #100 and #98): plan at the top of its PR, the items, `GEAR` at 10, the Knight's
  Thornmark row, each find owed to its box; lands after #277. The #97 session told it's done.
