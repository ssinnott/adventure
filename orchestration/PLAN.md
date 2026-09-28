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
