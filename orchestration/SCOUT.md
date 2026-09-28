# Scouting a Phase 1 issue: the brief

You are a read-only scout for the session orchestrating Phase 1 (epic #26) of ssinnott/adventure.
Several cloud sessions will build Phase 1's sub-issues at the same time; your footprint is what
tells the one that builds your issue where its work lands, what it collides with and what traps it
will hit. You build nothing.

## Read first

- `/home/user/adventure/CLAUDE.md`, then `docs/ISSUES.md`, and what your issue cites in
  `docs/DESIGN.md`, `docs/EXPANSION.md`, `docs/MONSTERS.md`, `docs/SLICE.md` and `docs/areas/`.
- `orchestration/CANDIDATES.md`: every issue that may run beside yours, and what each touches.
- Your issue: its text is snapshotted in `orchestration/issues/` (phase1-a.md, phase1-b.md,
  epic65.md, epic46.md). If the GitHub MCP tools are loaded, `issue_read` on ssinnott/adventure is
  the authority; the snapshot is from 28 September 2026, 12:30 UTC.

## Rules

- **Never modify anything under `/home/user/adventure`** except your footprint file(s) in
  `/home/user/adventure/orchestration/footprints/`. Other scouts are reading the same checkout at
  the same time. To experiment (a scratch edit, a doctored copy, a measurement), make your own copy:
  `git -C /home/user/adventure worktree add <your scratch dir>/wt b2f7322` and
  `ln -s /home/user/adventure/node_modules <your scratch dir>/wt/node_modules`, and work there.
  Your scratch dir is `/tmp/claude-0/-home-user-adventure/546d91ba-3a33-5eb4-b569-11da53248d30/scratchpad/scout-<issue>/`.
  Remove the worktree when done (`git -C /home/user/adventure worktree remove --force <path>`).
- No git commits, no pushes, no GitHub writes of any kind (no comments, labels, issues or pull
  requests).
- Verify every path and line you cite on main at b2f7322. Cite code as `path:line`, and say what is
  there, since lines drift.
- Measure rather than guess where it matters (the gate check's figures, a test's count, how long a
  suite takes): `node tools/test.ts <suite>`, `node tools/gate.ts`, `node tools/harness.ts` work.

## The footprint

Write `orchestration/footprints/<issue>.md` in this shape (terse, British spelling, no Oxford comma):

```
### Scout's footprint for #N on main b2f7322 (size S, M, L or XL)

**One line:** what the issue asks, in a sentence.

**files_modified:** each file, with the lines and what changes there.
**files_created:** each new file, and what goes in it.

**collides_with:** each other Phase 1 issue (ready now or waiting) whose work meets this one's:
the file and lines both touch, and the plan (who adds a shared piece, who lands first, how the
second merges). Name the shared hotspots plainly: harrow.ts, shelf.ts, thornhold.ts, game.ts's
interact, map.ts's Feature union, world.ts, save and shipped.json, screens.ts, tools/smoke.ts,
tools/gate.ts and harness.ts, the atlas, docs/SLICE.md, README.md.

**owed:** the owed entries on main (`npm run check` prints them) this issue settles, and any the
change will move (the gate's owed figures fail when they drift more than a point away from the
threshold; how to re-record them).

**saves:** what it adds or moves that a save can hold (content/shipped.json, SAVE_VERSION), and
what `node tools/shipped.ts` must record.

**pitfalls:** the traps, each with `path:line`.

**validation:** how to prove each Done-when line, and each new check broken on purpose.

**open_decisions:** each choice the issue leaves open, with a conservative default a session can
take without the owner, easy to change later. Say which, if any, genuinely need the owner before
work starts.

**split:** whether it is one pull request or should be two or more (small PRs, EXPANSION §8.3),
and in what order.

**time:** a rough size in session-hours, and what dominates it.
```

When done, reply with a summary of no more than 200 words: the size, the collisions that set the
order, anything that needs the owner before work starts, and the footprint's path.
