# Reviewing a Phase 1 pull request: the brief

You review for the session orchestrating Phase 1 (epic #26) of ssinnott/adventure. The owner has
asked the orchestrator to merge each pull request once it is verified; your review is what it
verifies against. You change nothing that others see.

## Read first

- `/home/user/adventure/CLAUDE.md`, `docs/ISSUES.md` and `orchestration/COMMON.md` (the rules the
  building session was given).
- The issue (GitHub `issue_read` on ssinnott/adventure; snapshots in `orchestration/issues/`), its
  footprint in `orchestration/footprints/`, and the pull request's body and files (`pull_request_read`
  with `get`, `get_files`, `get_check_runs`). Load the GitHub tools with ToolSearch if they are not
  loaded.

## Rules

- **Read-only on GitHub:** no comments, reviews, labels, merges, pushes or branch changes.
- **Never touch `/home/user/adventure`'s working tree** except to write your report file. Work in
  your own worktree: `git -C /home/user/adventure fetch -q origin`, then
  `git -C /home/user/adventure worktree add --detach <scratch>/wt origin/<branch>` and
  `ln -s /home/user/adventure/node_modules <scratch>/wt/node_modules`. Your scratch dir is
  `/tmp/claude-0/-home-user-adventure/546d91ba-3a33-5eb4-b569-11da53248d30/scratchpad/review-<pr>/`.
  Remove the worktree when done (`git -C /home/user/adventure worktree remove --force <path>`).
- **Never use `git stash`:** the stash is shared by every worktree, and other agents are using it.
- Several reviewers run at once; `npm run check` takes about a minute and a half. Run it.

## What to check

1. **Done-when:** each line of the issue's Done-when (or the pull request's share of it), with the
   evidence the body claims. Reproduce the key claims: run the test that proves each, and break the
   thing it guards on purpose (a scratch edit in your worktree) to see it fail.
2. **Correctness:** read every hunk. Real bugs first: wrong logic, a case missed, a check that
   passes by chance or cannot fail, a save that breaks (ids moved or dropped without
   `SAVE_VERSION`; `node tools/shipped.ts` must say "Nothing new." or record only additions).
3. **Scope and lanes:** the pull request stays in its issue and the files its footprint names; no
   drive-by edits to shared files; `src/lib/` untouched.
4. **The combined tree:** merge the latest `origin/main` into your worktree's head and run
   `npm run check`. Report the last line (ALL OK and the owed counts) and anything red.
5. **CI** on the pull request's head: the typecheck, tests and smoke jobs (the sheet job is not
   required).
6. **Voice:** docs and texts terse, British spelling (colour, armour), no Oxford comma; game texts
   two lines to an event, three the most; commit subjects imperative, sentence case, no prefix, no
   issue number, no full stop.

Before you report a finding that is not a nit, prove it: a failing command, a scratch edit that
shows the bug, or the exact lines that contradict each other. Drop anything you cannot prove.

## The report

Write `orchestration/reviews/<pr>.md`, and reply with the same in no more than 300 words:

```
### Review of #<pr> (<branch> at <sha>) for #<issue>

**Verdict:** ready | ready after fixes | not ready

**Combined with main:** `npm run check` → <last line>
**CI:** <typecheck, tests, smoke: pass/fail>

**Findings** (most severe first; each blocker, should-fix or nit, with path:line, what is wrong,
the proof and the fix):

**The owner's choices** the pull request puts, each with a one-line view (take the default, or why
not).
```
