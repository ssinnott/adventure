# CLAUDE.md

What every session reads first. It points at the docs; it does not repeat them.

## Before you start

Read docs/DESIGN.md, then docs/EXPANSION.md, then the area's doc (`docs/areas/<area>.md`, once the
area has one). README.md lists the rest of the docs.

## The work

- **The lanes** are EXPANSION §8.1. Stay in yours. A content session that needs a system changed
  stops and asks, or opens a systems pull request first; it never edits shared files on the side.
- **A zone map** follows the recipe in EXPANSION §8.2; a monster or an interior goes the same way.
- **`src/lib/`** is game-engine, vendored with `git subtree`. Never edit it here; fix it upstream
  (DESIGN §13).
- **Run `npm run check`** (typecheck, Node tests, headless Chromium smoke test) before every push.
  It must be green.

## The voice

Terse, British spelling as the game has it (colour, armour). In a game text, two lines to an event
is the aim, three the most (DESIGN §11, EXPANSION §5.4). The secret is found, never told. The docs,
issues and pull requests take no Oxford comma (ISSUES §5).

## Commits

Subjects as the history writes them: imperative, sentence case, no prefix, no issue number, no full
stop ("Give the ogre a stoop, a face and a club that is a tree limb").

## Issues and pull requests

- File issues as docs/ISSUES.md says: a type, lanes, an epic and a Dependencies section.
- Nothing is filed without the owner's agreement (ISSUES §6).
- Only issues the owner has marked `approved` are picked up, and a session never puts that label on
  of its own accord (ISSUES §2).
- A session never merges its own pull request: the owner merges.
- The session that opens a pull request adding or changing a map, a monster or an interior makes its
  contact sheet (`node tools/sheet.ts sheet.png --area <area>`, or the ids with `--maps`, `--monsters`
  and `--interiors`) and sends it to the owner in the Claude app. The checks attach one too.
