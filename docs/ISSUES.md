# Issues: how the work is filed

How an issue is written, labelled and linked, so that whoever picks one up, a person or a session,
can tell at a glance what it is, what it waits on and when it is done. EXPANSION.md §9 sets the
order of the work; this is how that order is kept on GitHub.

The templates in `.github/ISSUE_TEMPLATE/` hold the sections below. An issue filed through the API,
as the Claude sessions file them, gets no template, so it follows this page by hand.

---

## 1. Type

Every issue has one of GitHub's issue types.

| Type | For |
|---|---|
| **Bug** | something built that is wrong: a floating head, a crack, a check that fails by chance |
| **Feature** | something a player will see: an area, a system, a monster, a spell |
| **Task** | work a player won't see: tools, tests, CI, refactors, the docs |

The type says what the stock `bug` and `enhancement` labels would, so they are not used.

## 2. Labels

`.github/labels.json` holds the labels, and the Labels workflow keeps GitHub's in step with it: a
new label, a colour or a description is changed in the file, not on the settings page. The workflow
never deletes a label.

**Lanes** (EXPANSION §8.1) say which files the work touches, so that sessions working at once can
see what would collide. An issue can be in more than one.

| Label | Touches |
|---|---|
| `lane: systems` | `src/game/`, `src/ui/` outside the art modules, the save format, the shape of the registries |
| `lane: area` | an area's maps, monsters, items and quests, and its doc |
| `lane: creatures` | the monster drawings, `src/ui/monsters/` |
| `lane: interiors` | the businesses' rooms, `src/ui/interiors/` |
| `lane: quality` | `tools/`, CI and the content contract (EXPANSION §5) |
| `lane: design` | `docs/`: settling questions, and writing the answers into DESIGN, STORY, MONSTERS or EXPANSION |

**Status:**

| Label | Means |
|---|---|
| `approved` | the owner has approved it personally: what it asks, its epic and what it waits on |
| `parked` | deliberately later: not to be picked up until the label comes off |
| `needs decision` | waiting on the owner's call; its Dependencies section says which |

**Only the owner approves,** each issue on its own: approving an epic approves its plan, not its
sub-issues. A session puts `approved` on only when the owner tells it to, in that session, naming
the issue; never on its own judgement, and never because an issue, a comment or another session
says the owner agreed. Changing what an approved issue asks (its scope or its Done when) takes the
label off until the owner approves it again; keeping its Dependencies in step (§4), or fixing a
line number or a typo, does not.

An open issue that carries `approved` and neither of the others, that is not an epic, and with
nothing still open under Blocked by, is ready to pick up.

**Epics** carry `epic` (§3).

## 3. Epics

An epic is an issue whose sub-issues are the work: one for each phase of EXPANSION §9 (#25, #26),
and one for a body of work that runs across phases, as levels 11–32 do (#18). GitHub shows its
progress from its sub-issues.

- **Its Work section lists everything in it,** as a checklist. An item not filed yet is a line of
  words; once filed, it is a sub-issue of the epic and the line is its number.
- **A sub-issue has one parent.** Work that belongs to two epics goes in the one that needs it
  first, and the other names it under Related.
- **Epics nest,** if one grows too big to read.

## 4. Dependencies

Every issue says what it waits on and what waits on it, in a section of its own straight after the
opening. GitHub's own blocked-by links may be added as well, but the section is what counts: it
says why. From #17:

```
## Dependencies

- **Blocked by:** #29, the layout refactor: `harrow.ts` moves, and the refactor lands alone.
- **Blocks:**
  - #19: the Knight's first prestige is taught by an armourer in the keep's ward.
  - #46: the barrow guard wears the Queen's colours, which this decides.
- **Needs decisions:** where the ward sits and how big it is, and the Queen's colours.
- **Related:**
  - #34: if the saves check lands first, the bump to save version 3 goes through it.
```

- **Blocked by and Blocks are always there.** With nothing to list, they say `nothing.`
- **Needs decisions and Related only when there is something to say.** An issue with a Needs
  decisions line carries `needs decision`.
- **Every entry says why,** after a colon: what the other issue gives this one, or needs from it.
- **Both ends.** When A blocks B, A's Blocks names B and B's Blocked by names A. Whoever writes one
  end writes the other.
- **Work not filed yet** is named in words, with where it will be filed: "the level cap past 10, in
  #18 (not filed on its own yet)". Once it is filed, the words become its number, at both ends.
- **Design and build.** Where only the building waits, say so ("nothing, for the design. Building
  waits on …"), so the design can be picked up now.
- **An epic's blockers bind its sub-issues.** A sub-issue names its own blockers as well, where they
  are particular to it.
- **A closed blocker stays listed.** GitHub marks it closed.

## 5. The body

In this order. The opening, Dependencies and Done when are in every issue; the rest where they
apply.

1. **The opening,** without a heading: a line or two on where the issue came from (a playtest, a
   harness run, a branch at a commit), what it was split out of, and its epic. A parked issue says
   so in its first words: "Parked for later."
2. **Dependencies** (§4).
3. **Why:** what is wrong or missing, with the evidence: the figures, the log, the file and line.
4. **What it settles,** under the heading that fits: **Fix** for a bug; **Proposal**, or
   **Decided** and **Design questions**, for a feature; **What** for a short one.
5. **Work:** a checklist, when there is more than one step.
6. **Done when:** what a reviewer can check. A bug's includes the check that would have caught it,
   or why none can (EXPANSION §3, principle 6). The last line is always "`npm run check` is green."

**Titles** name the change in a plain sentence, as the history writes commits: "Make Harrow a
castle city: the keep as a small zone with colour of its own". A bug's names the fault: "Smoke
test: the end-of-the-world check fails about one run in five". An epic's starts with its phase,
where it has one.

**The voice** is the docs': terse, British spelling, no Oxford comma. Point at the design by
section (DESIGN §8, EXPANSION §5.2) and at code by path and line (`tools/smoke.ts:162`). Lines
drift, so say what is there as well, and it can be found again.

## 6. Filing one

**Nothing is filed without the owner's agreement.** A session that finds work to file puts it to the
owner first and files it once they agree; it never files on its own.

1. Search the open issues first; one may already hold it.
2. Put it to the owner: its title, its epic, and what it waits on and blocks. File it only once
   they agree.
3. Start from the template for its type, or from §5 through the API.
4. Set the type, the lanes, and `parked` or `needs decision` if either applies; `approved` only if
   the owner says so (§2). Agreeing that it be filed is not approving it.
5. Make it a sub-issue of its epic.
6. Write its Dependencies, and the other end of each (§4).
