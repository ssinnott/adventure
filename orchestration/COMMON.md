# You are one of several parallel sessions on Phase 1 (epic #26)

The orchestrating session (session_017TzXpQKYibnFH632JsEHtt) started you for the repository owner,
ssinnott, to build part of Phase 1 of ssinnott/adventure: epic #26, "the pilot: finish Act I for
M1". Other sessions build other sub-issues of #26 at the same time; your task says which, and your
footprint says what they touch. The orchestrator may send you messages in this session; they arrive
as ordinary turns. Follow them.

## Before you start

- Read CLAUDE.md, then your issue(s) on GitHub with the GitHub MCP tools (`issue_read` on
  ssinnott/adventure; load them with ToolSearch if they are not loaded), docs/ISSUES.md, and what
  they cite in docs/DESIGN.md, docs/EXPANSION.md, docs/MONSTERS.md, docs/SLICE.md and docs/areas/.
- Read your footprint: `git fetch origin claude/phase-1-orchestration-w0egtw`, then
  `git show origin/claude/phase-1-orchestration-w0egtw:orchestration/footprints/<file>.md` (your
  task names the file). It is a scout's read-only notes on main at b2f7322: the files, the
  collisions with the other Phase 1 issues, the traps with `path:line`, how to prove Done-when, and
  the open choices, each with a conservative default. Verify it before relying on it. The issue is
  what the owner approved; where the two differ, the issue wins, and say so in the pull request.
- Start your branch from the latest main.

## The layout

Content lives in src/content/: each area in src/content/areas/<area>/ (the Foreland's id is
`shelf`, Helmstow's map `harrow`, Brandy Hole's `greywater1` and `greywater2`), merged by
src/content/index.ts; the items no area owns, the spells and the maps as played at the root. Tests
are one file a suite in tools/tests/: the runner, tools/test.ts, finds every tools/tests/<name>.ts
that exports a function `<name>`, so add a suite by adding its file and never edit tools/test.ts.
For anything "reported as #N's" use `owed(cond, msg, whose)` from tools/tests/lib.ts: while `cond`
is false it prints an owed line, and once it holds it fails, so the entry gets dropped. When your
work settles an owed entry, drop it. Never write a second mechanism for this.

## Rules

- Stay inside your issue and the files your footprint names. Where it names a collision, do what it
  says (who adds a shared piece, who lands first). Never edit `src/lib/` (vendored).
- Never add or remove labels, edit issue bodies, comment on issues, or file issues. Work outside your
  scope goes in your pull request under "Found in passing", for after Phase 1: no new issues are
  filed in it (the owner, 1 October).
- Where the issue leaves a choice open, take the conservative default your footprint gives (the
  owner has not answered, and wants the work to go ahead), keep it easy to change, and list it under
  "Choices for the owner". If a choice truly cannot be defaulted, say so in your turn's summary and
  carry on with what you can.
- The owner has delegated their calls (29 September, 13:35): the orchestrator puts each question,
  and each contact sheet, to a delegate that must decide, and relays the answer. Send the owner your
  sheets as before, but never wait on them for an answer: carry on with your defaults until the
  orchestrator relays a decision.
- The voice of docs, issues and pull requests: terse, British spelling, no Oxford comma. Game texts:
  two lines to an event the aim, three the most; the secret is found, never told.
- Commit subjects as CLAUDE.md says: imperative, sentence case, no prefix, no issue number, no full
  stop. Several small commits are fine.
- `npm ci` once, then `npm run check` before every push; it must be green. The smoke test is seeded
  and deterministic: a failure is real.
- Prove every check you add by breaking it on purpose and watching it fail; say how in the pull
  request.
- Saves: content is never saved, so what a save can refer to only grows. When you add ids, run
  `node tools/shipped.ts` to record them in src/content/shipped.json; never move or drop one without
  SAVE_VERSION and an upgrade (EXPANSION §5.5).
- Pictures: a pull request that adds or changes a map, a monster or an interior makes its contact
  sheet (`node tools/sheet.ts sheet.png --area <area>`, or the ids with `--maps`, `--monsters` and
  `--interiors`) and sends it to the owner with SendUserFile. Where anything else you change shows in
  the game, send a picture of it too (tools/shot.ts).

## Pull requests

- Open one against main when your Done-when holds. Title: a plain sentence like the issue's. Body:
  an opening line; `Closes #N`; **What changed**; **Done when** (each line of the issue's Done-when
  with its evidence); **Choices for the owner**; **Found in passing** and **Owner actions** where
  there are any.
- The checks workflow (typecheck, tests, smoke, and the contact sheet) runs on every pull request;
  see it green.
- NEVER merge a pull request, yours or another's, and never enable auto-merge or call any merge
  tool. The owner has asked the orchestrator to review and merge. A pull request that adds a
  monster, a map or an interior, or changes one to the eye, also waits for an OK on its contact
  sheet (since 29 September the owner's delegate's, which the orchestrator relays); one whose sheet
  shows nothing changed says so in its body. The orchestrator reviews every pull request itself
  before it merges it: answer its review as you would the owner's.
- After opening it, subscribe to its activity (subscribe_pr_activity) and see it through: answer
  review comments and the orchestrator's messages, fix red checks, and when main moves (other Phase
  1 pull requests land often) merge main in (never rebase or force-push once it is open) and re-run
  the check.
- When you are done, end your turn with a short summary: the pull request's link, what the owner
  must decide, and anything that went wrong.
