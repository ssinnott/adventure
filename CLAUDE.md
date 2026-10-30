# CLAUDE.md

What every session reads first. It points at the docs; it does not repeat them.

## Before you start

Read in this order: this page, `CLAUDE.md`; `docs/DESIGN.md` §1 and your lane's sections of it;
all of `docs/EXPANSION.md` (its §3 to §5 and §8); then your lane's own. The rest waits for a
question that needs it; README.md lists the docs. By lane:

- **Systems:** DESIGN §5's Races and Classes and prestiges, §6, §7, §11 and §13; `docs/SYSTEMS.md`.
- **Area:** DESIGN §4 and the area's act in §9; its state, `docs/areas/<name>.md`, by its folder's
  name in src/content/areas/ or its place's (dead_drop.md, meridian_camp.md); the decisions.md
  and plan.md beside it when a question needs them.
- **Creatures:** `docs/MONSTERS.md` §1 to §4.3; `docs/ROSTER.md`'s families, for its family.
- **Interiors:** DESIGN §11; the header of each file of `src/ui/interiors/`, its kit's with them.
- **Quality:** DESIGN §13; EXPANSION §5, the contract it keeps; the runner's header,
  `tools/test.ts`.
- **Design:** the section it settles of the doc it writes, DESIGN's, MONSTERS' or `docs/STORY.md`'s.

## The work

- **The lanes** are EXPANSION §8.1. Stay in yours. A content session that needs a system changed
  stops and asks, or opens a systems pull request first; it never edits shared files on the side.
- **The kits**, `src/ui/paint/`, `src/ui/monsters/kit/` and `src/ui/interiors/kit/`, are the systems
  lane's; `tools/kit/` is quality's (EXPANSION §8.1).
- **The rule of three:** a family or a scene takes a kit's helper when it is next edited, not in a
  sweep; a helper a third wants goes into the kit by a small pull request, not into a third copy.
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
