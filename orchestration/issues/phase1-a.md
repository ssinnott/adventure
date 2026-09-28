==================== #40 Take the flag off the pass, and make Thornmark the gate
Part of #26 (Phase 1), from EXPANSION §2.2 and §9: the road that exists, made to follow one road, lightly held.

## Dependencies

- **Blocked by:**
  - #38: Thornmark, the Grove Roots and the Cut Stone are retuned until the gate check holds.
  - #29: `shelf.ts` and `harrow.ts` move in the layout refactor.
- **Blocks:**
  - #42: the one quest's chapters can't read true while a goal says "Deal with Brandy Hole, so that Captain Hale opens the pass", nor be played with Thornmark taken first.
  - #85: Hale's and Vask's rewritten words say the pass is open.
- **Related:**
  - #33: its lock check finds the flag on the pass; this takes it away. Until then the check reports it as this issue's.
  - #17: Vask's line about the pass is fixed here, if this lands first.

## Why

The pass to Thornmark waits on `q_ashcombe_done` and `q_greywater_done` (`src/content/maps/shelf.ts:52`, the gate's `needFlag`): a quest flag between two areas, the one kind of lock EXPANSION §2.3 rules out. And it is the flag, not the monsters, that holds the road: a company wins nine fights in ten in Thornmark at level 3, and in the Grove Roots and the Cut Stone at 4 (EXPANSION §2.2).

## Proposal

- **The pass opens.** Hale's checkpoint warns every company in words instead of turning it back (EXPANSION §5.2). The warning and the crossing line stay fixed text: the owner has left a warning that knows the company's level for "the danger made legible" in Phase 2 (EXPANSION §9; not filed yet), since a crossing line today is one string for everyone (`MapZone.enter`, `src/game/map.ts:90`).
- **Everything that says the pass is shut** says it no longer: the checkpoint sign (`shelf.ts:58`), Hale's words (`shelf.ts:65` and his `after` at `:72`), the quest log (Hale's entry at `src/content/quests.ts:40`, the `pass` entry at `:68`, the goals at `:86` and `:87`), the comments at the top of `shelf.ts` and `thornmark.ts`, SLICE.md (lines 31–33, 167–169 and 282), and the atlas's header (`src/content/atlas.ts:12`).
- **Thornmark becomes the gate,** retuned with MONSTERS §5.3's levers in order: the gentlest groups first past the pass; groups that ask (the brigands' archers with the ogre, thorn spiders on the front row before the dire wolves come in); the cost set between the pools with `tools/gate.ts`.
- **Vask's line** stops saying Hale opens the pass once Brandy Hole is dealt with (his `after`, in `harrow.ts`).
- **The atlas follows:** its planned ways that open only after a step (`opens`) are open from the start, and the road from Coldmere into Monks' Vale, marked "Mountaineer", becomes a road through the range (EXPANSION §2.2).

## Work

- [ ] The pass without its flag; Hale warns.
- [ ] Thornmark, the Grove Roots and the Cut Stone retuned against #38.
- [ ] The texts that say the pass is shut, as listed above.
- [ ] The tests that pin the flag gate follow: the movement suite's closed pass ("the Thornmark pass is closed before the Ashcombe hand-in", `tools/test.ts:177`), the outdoors suite's checkpoint (`:703`), the quests suite's pass (`:877` and `:881`), and the smoke test's walk through the pass (`tools/smoke.ts:177`).
- [ ] The atlas's `opens`, and its suite's gates.

## Done when

- A company can walk through the pass at level 1, is warned, and finds Thornmark too hard for it; the gate check holds at Thornmark's floor.
- Nothing in the game or the docs still says the pass is shut.
- `npm run check` is green.

==================== #41 Give monsters a kind, a look and a time to walk: kind, look, when, until and after
Part of #26 (Phase 1), from MONSTERS §3.3: the fields Act I asks for, made once in the systems lane before the areas that spend them.

## Dependencies

- **Blocked by:** #29: the monster tables move into content in the layout refactor.
- **Blocks:**
  - #47: the Downs' wreckers walk by night and in fog (`when`), and every group there says what it is (`look`).
  - #67: the wreckers and their lampman on the Salt Road walk in fog.
  - #69: the Black Dog walks by night.
  - #49: the old wood wakes and sleeps with the Grove Stone (`until`, `when`).
  - #76: events and people take the same `when`, `until` and `after`.
  - #70: the Barrow Guard and the Barrow Captain say what they are (`look`).
  - #88: a den's brood stops coming back once it is burnt (`until`).
- **Related:**
  - #31: `level` comes with the curve.
  - #18: the rest of MONSTERS §3.3 (ranks, elements, morale, casting and the others) comes past level 10.
  - #38: each field lands with the gate bot's answer to it.
  - #34: `look` needs a record of which kinds a company has met, new save state that goes through its check.

## Why

Holy Strike's +3 is keyed to `mindless`, and nine monsters are mindless: the five dead, and the Cellar Slime, the Shore Crab and both of the Rift's wardens, which are not dead (MONSTERS §3.2). Nothing can walk only by night or in fog, say what it is when it is first seen, or stop coming back once a Stone is restored.

## Proposal

As MONSTERS §3.3 has them:

- **`kind`:** beast, person, dead, Rift or machine, setting the defaults of MONSTERS §2; a def may add its own (the slime and the crab keep their immunity to sleep). Holy Strike lands on the dead only.
- **`look`:** the line said the first time a group of it is seen, and the art's brief in one sentence. Saying it only the first time means remembering which kinds a company has met: new save state, unlike `when`.
- **`when`:** a group that walks only by night, in fog or snow, or in a season, read from the clock and the weather, so nothing new is saved.
- **`until` and `after`:** a group that stops coming back once a Stone is restored, or comes only after a step or a choice. Neither opens or shuts a way, so neither is a story lock (EXPANSION §2.3). First spent on Thornmark: its rift hounds and riftling elders stop coming back once the Grove Stone is restored (MONSTERS §5.3). Nothing in the game marks the Stone restored, since its cut "will need a Lantern to mend", so the owner has set the moment as the tear closing: the Warden of the Cut's death (`slain: grove2:g2_warden`), where the game already says nothing more comes through. The barrow's dead, which MONSTERS §5.3 names too, never come back already: they have no `respawn` (`src/content/maps/thornmark.ts:72`).

## Work

- [ ] `kind` on every def, and Holy Strike keyed to it.
- [ ] `look`.
- [ ] `when`.
- [ ] `until` and `after`, first on Thornmark.
- [ ] The gate bot reads each of them.

## Done when

- Holy Strike lands on the dead and nothing else, a group with `when` walks only when it says, and Thornmark's rift hounds and riftling elders stop coming back once the Warden of the Cut is dead.
- `npm run check` is green.

==================== #42 Start the one quest: The Quiet Farm and The Grove Stone as its first chapters
Part of #26 (Phase 1), from EXPANSION §5.8: one quest from level 1 to the cap, joined from each area's chapter.

## Dependencies

- **Blocked by:**
  - #29: the quest is joined in `src/content/index.ts` from each area's `chapter.ts`.
  - #31: the walkthrough plays each step at the curve's level.
  - #40: while the pass waits on Brandy Hole, a goal says "Deal with Brandy Hole, so that Captain Hale opens the pass", and Thornmark can't be taken before the quest sends the company there.
- **Blocks:**
  - #47, #67 and #70: the Downs' three steps, at Gullwick, Crowness Light and the Berth, go into the Foreland's chapter.
  - #49: the Deepthorn holds a step of the quest, in Thornmark's chapter.
- **Related:**
  - #43: Vask's wand and Sylvane's chisel are steps of these chapters.
  - #21: what gives a company its start, now that it picks no Charter.

## Why

The main quest is one quest down one road (EXPANSION §2.2), and a quest from level 1 to the cap in one file would be a file every area edits. Today the log holds four separate quests: The Quiet Farm, The Cargo Ledger, The Grove Stone and The Lost Expedition, which stays open by design (`src/content/quests.ts`; `tools/test.ts:893` and `:895`). A condition that names a place must name a real map (`tools/test.ts:803`), but nothing checks that a goal's words name a place that exists, or that the company can be at its level there.

## Proposal

- **Joined from chapters.** Each area writes its chapter, its entries and goals; `content/index.ts` joins them in road order into one quest, with the goals furthest along first. No area edits another's chapter.
- **The first chapters.** The Quiet Farm and The Grove Stone become the Foreland's and Thornmark's. The Cargo Ledger stays a quest of its own, on the road but off the spine, and The Lost Expedition stays a subplot. The log is worked out from the save and never stored, so re-cutting it is safe for old saves.
- **The road's own test.** The walkthrough plays the chapters in order with a company at the curve's level for each step, and checks at every step that the goal names a place that exists, that the company's level sits in that place's band, and that the step can be finished. Played again with Thornmark taken before the quest sends the company there, the log must still read true.
- **Every zone on the road** of the areas built holds a step.

## Done when

- The log shows one quest in two chapters, and the walkthrough plays it end to end, in order and out of it.
- `npm run check` is green.


==================== #43 Take a hand-in's item at the first meeting
Part of #26 (Phase 1), from EXPANSION §2.3: no false "not yet".

## Dependencies

- **Blocked by:** #29: the maps that hold the three hand-ins move in the layout refactor.
- **Blocks:**
  - #47: in The Boat With No Name-Board, the Compact's man takes the hoard at the first meeting.
  - #77: Who Lived at Ashcombe and The Clerk's Seal end in a hand-in to one of two people.
  - #67: the keeper at Crowness Light takes Lantern Oil at the first meeting.
  - #68: Hale takes the captain's letter at the first meeting.
- **Related:**
  - #33: its lock check proves every hand-in takes its item at the first meeting. Until this lands, it reports the three as this issue's.
  - #42: Vask's wand and Sylvane's chisel are steps of the one quest's first chapters.

## Why

Today's three hand-ins (Vask's survey wand, Hale's ledger and Sylvane's chisel) take their item only from a company already hired: each waits on its quest's flag (`NpcQuest.needFlag`, tested at `src/game/game.ts:157`). A company that arrives early carrying the item is first sent to go and find it (`:162–164`), and must talk again to hand it over. That is a lock with no reason in the world. With the road open from the first hour (EXPANSION §2.2), arriving early is normal.

## Proposal

A hand-in takes its item at the first meeting, and pays, and its words know the company came early.

The hand-in lives in `Game.interact` (`src/game/game.ts:153`), which the tests never import, so proving it means moving that logic where a test can reach it.

## Work

- [ ] The hand-in moved out of `Game.interact`, where a test can reach it.
- [ ] Each of the three takes its item at the first meeting, with words for a company that came early.

## Done when

- Each of the three takes its item at the first meeting, and the log reads true whichever way round it happened; a test proves it for all three.
- `npm run check` is green.


==================== #45 Add the wilderness features: shrines, cairns, statues, camps and hermits
Part of #26 (Phase 1), from EXPANSION §5.3 and §7.

## Dependencies

- **Blocked by:** #25 (Phase 0): nothing new goes into the world before it.
- **Blocks:** #47, #68, #71 and #72: country meets its looser floor with these.
- **Related:**
  - #32: each of these is a point of interest, and none is a sign, so it never counts against the cap on signs.
  - #20: a shrine that gives a resistance waits on elements.
  - #39: the owner chose cores and country for v1, and country is where these go.

## Why

Most of the atlas is country between the cores (EXPANSION §2.1 (b), as the owner decided in #39), and country needs something to find within 12 steps of nine squares in ten, and none past 20 (EXPANSION §5.3, #32), without new art for each. Might and Magic filled its wilds with small things worth the walk.

## Proposal

Each a feature kind rather than new art, cheap to place and worth the walk:

- **a shrine or a fountain** that gives a stat once (and a resistance, once there are elements);
- **a cairn** with a cache;
- **a statue** with a riddle whose hint lies elsewhere, answered by typing the word, as in Might and Magic, in the text mode that names characters (the owner's call);
- **a camp** where the party can rest safely;
- **a hermit** with a rumour, an npc as they are today.

## Done when

- Each kind can be placed on a map and does what it says. A shrine or fountain, a cairn and a statue give once and are saved as used; a camp can be rested at again, and a hermit is an npc as today.
- A statue takes its riddle's answer typed, and only the right word.
- `npm run check` is green.

==================== #100 Let gear carry a plus: +1 to hit and damage on a weapon, +1 armour class on armour
Part of #26 (Phase 1), on the owner's word (28 September 2026): Act I gets +1 gear, and a +1 means what it says. The Foreland's gear ladder (#99) and Thornmark's step past its Armoury (#101) are made with it.

## Dependencies

- **Blocked by:** nothing.
- **Blocks:**
  - #99: the Foreland's +1s are its gear with a plus.
  - #101: so are Thornmark's.
- **Related:**
  - #18: the magic items of levels 11 to 32, which this starts; elements, resistances, stat items and artifacts stay there.
  - #38: the gate check fights in the gear the ladders give, pluses among it.
  - #31: a plus's price sits in its band's window.

## Why

Nothing makes a weapon hit more often. To-hit is the class's, the level's and accuracy's alone (`attackBonus`, `src/game/party.ts:197`), and a weapon's `bonus` is part of its type and adds to damage only (`src/game/combat.ts:208`): the Dagger's +1, the Long Sword's, the Rune Dagger's +3. Nor can an item be a better copy of another: there is no Long Sword +1, so a band's finds can only be the next band's types. Thornmark's are the Armoury's own. The harness's what-ifs forge +N copies that add to damage alone (`forge`, `tools/harness.ts:104`).

## Decided

The owner's calls, on 28 September 2026:

- **A plus on a weapon** is +1 to hit and +1 damage a point; **on armour or a shield,** +1 armour class a point.
- **Today's built-in bonuses stay** the weapons' own: a Long Sword +1 rolls 1d10+2 and hits one better than a Long Sword.

## Proposal

- **`plus` on an item** (`ItemDef`, `src/game/items.ts:8`), and a helper beside `W` and `A` (`src/content/items.ts:7`) that gives any weapon, armour or shield a plus: named "Long Sword +1", its id the base's and its plus (`longsword+1`, as the harness names its copies), its damage or armour class counting the plus.
- **To-hit counts a weapon's plus,** in `attackBonus`, so the fight (`src/game/combat.ts:206`) and the sheet's TO-HIT (`src/ui/screens.ts:224`) both have it.
- **Its price** is its base's and 150 gold more a point (a Long Sword +1 is 270), so a find sells back well and sits in its band's window.
- **A robe with a plus is still a robe:** Unarmoured Defence reads the robe's own armour class (`src/game/party.ts:191`), so a monk in a Robe +1 keeps it.

## Work

- [ ] `plus` and the helper.
- [ ] To-hit, and Unarmoured Defence.
- [ ] A test of each.

## Done when

- A +1 weapon adds one to its wielder's to-hit and one to its damage, and +1 armour one to armour class; a test proves both.
- A monk in a Robe +1 keeps Unarmoured Defence.
- `npm run check` is green.

==================== #101 Give Thornmark's chests a step past its Armoury: its own gear with a plus
Part of #26 (Phase 1), on the owner's word (28 September 2026): the steps of Act I's gear ladder after the Foreland's (#99), so that Thornmark's finds are better than what Thornhold sells.

## Dependencies

- **Blocked by:** #100: each find is the Armoury's gear with a plus.
- **Blocks:** nothing.
- **Related:**
  - #99: the Foreland's ladder, whose steps these follow.
  - #49: the Deepthorn's core, whose finds come after these.
  - #18: the magic items of levels 11 to 32.
  - #31: each find sits in its band's window.
  - #38: the gate check dresses its company by the ladder, as EXPANSION §5.2 has it.

## Why

Thornmark's chests hold only what its Armoury sells (`src/content/areas/thornmark/maps/thornhold.ts:40`): the War Hammer in the ruined watchtower and the Rune Dagger in the barrow (`src/content/areas/thornmark/maps/thornmark.ts:62` and `:64`); the Crossbow and the Brigandine in the Grove Roots (`grove1.ts:44` and `:45`); the Great Sword and Plate Mail in the Cut Stone (`grove2.ts:41` and `:45`). The Hand of Ash drops a Runed Robe, which the Armoury sells too (`src/content/areas/thornmark/monsters.ts:25`). A company that shops at Thornhold at level 5 finds nothing better from there to 10: exploring never beats shopping.

## Decided

The owner's calls, on 28 September 2026:

- **A plus is +1 to hit and damage** on a weapon, and +1 armour class on armour (#100).
- **Pluses are found, not sold,** in Act I: Thornhold's Armoury sells plain gear, as today.
- **The curve's window holds:** no find is dearer than Thornmark's 1,200 gold (`src/content/progression.ts:38`), so there is no plate with a plus: Plate Mail +1 would be 1,350.

## Proposal

- **Each chest that holds the Armoury's gear holds it with a plus instead,** and one chest more, so that every class finds one:
  - the ruined watchtower: a War Hammer +1;
  - the barrow: a Rune Dagger +1;
  - the Grove Roots: a Thornmark Bow +1 in place of the Crossbow, Brigandine +1 and a Grove Staff +1 in its first chest (`grove1.ts:38`);
  - the Cut Stone: a Great Sword +1, and in its hoard, the deepest, Brigandine +2 in place of the Plate Mail;
  - the Hand of Ash: a Runed Robe +1.

| Class | Its plus in Thornmark |
|---|---|
| Knight | Great Sword +1 |
| Paladin | War Hammer +1 |
| Ranger | Thornmark Bow +1 |
| Barbarian | Great Sword +1, Brigandine +1 and +2 |
| Cleric | War Hammer +1, Runed Robe +1 |
| Sorcerer | Rune Dagger +1, Runed Robe +1 |
| Thief, Bard | Rune Dagger +1, Brigandine +1 and +2 |
| Monk | Grove Staff +1 |
| Druid | Grove Staff +1, Brigandine +1 and +2 |

- **Priced as the plus has it** (#100), each within its band's window (EXPANSION §5.2, #31). The drops stay plain.
- **The ladder's next steps:** the harness dresses its company from them at level 9 (`GEAR`, `tools/harness.ts:96`), and the gate check the same (EXPANSION §5.2).

## Work

- [ ] The items, in Thornmark's table (`src/content/areas/thornmark/items.ts`).
- [ ] The chests, and the Hand of Ash's drop.
- [ ] The harness's gear by level, and the gate check's.
- [ ] Thornmark's area doc: its Gear, with the ladder (`docs/areas/thornmark.md`).

## Done when

- Every class finds a plus it can use in Thornmark, and no chest there holds what the Armoury sells.
- `npm run check` is green.
