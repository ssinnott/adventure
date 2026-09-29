# Thornmark

The second step of the road of levels, band 5–10: old forest over the pass from the Foreland,
where the Ashen cut the Grove Stone. Its content is in `src/content/areas/thornmark/` (maps,
monsters, items, its chapter of the one quest, The Grove Stone, in `chapter.ts`, its side quest
The Lost Expedition in `quests.ts`, climate and its part of the world map) and its businesses'
rooms in `src/ui/interiors/thornmark/`. The systems it runs on, the level cap and the spells,
classes and traits that carry a company to it included, are in [SLICE.md](../SLICE.md) ("The road
to level 10").

## What is built

- **Gear.** A Thornmark tier in the Armoury: war hammer, battle axe, great sword, crossbow, the
  Thornmark bow, rune dagger, grove staff, runed robe, brigandine, plate, tower shield, elixirs,
  sapphire vials, lantern oil. The Armoury sells it plain; the chests hold it with a plus (#101),
  the step of the gear ladder past the Foreland's: a War Hammer +1 in the ruined watchtower, a
  Rune Dagger +1 in the barrow, a Grove Staff +1, a Thornmark Bow +1 and Brigandine +1 in the Grove
  Roots, a Great Sword +1 and, in the hoard, Brigandine +2 in the Cut Stone; the Hand of Ash drops
  a Runed Robe +1. No plate with a plus: it would pass the window's 1,200 gold. Every class finds
  one, and the harness and the gate check dress their company from them at 9 (`GEAR`):

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
- **Monsters.** Thirteen for band 5–10: dire wolves, thorn spiders, brigands and their archers,
  Ashen zealots and adepts, rift hounds, bone knights, wraiths, riftling elders, ogres, and two
  bosses, the Hand of Ash and the Warden of the Cut. Two new drawings (ogre, wraith); the rest
  re-tint and re-scale the slice's ten.
- **Thornmark** (outdoor zone, 32×32, band 5–10): reached through the mountain pass on the
  Foreland's east edge, open to any company; a Warden checkpoint warns it on the way. Thornhold in
  the north-east, a ruined watchtower with an ogre's den, a barrow with bone knights and wraiths, a
  river with one bridge, a dead survey marker in a lake, and the Grove at the end of a chisel-marked
  road in the south-west. Fourteen groups. By Thornhold's north wall, the chest the watchtower's
  garrison buried when the elves shut the gate (`tm_strongbox`), the Wardens' rank 2 quest; their
  rank 1 quest is the tower's ogre (docs/areas/shelf.md §6, the Wardens' quests).
- **Thornhold** (town, 16×16): the Green Man inn, the Lantern Chapterhouse, the Armoury, the
  Lantern Hall (tier 4), the Elder's Yard, the Split Oak tavern (rumours about Vask's timing),
  a healing spring, and Elder Sylvane, who pays 1500 gold for the Underdeep chisel. Ailith of the
  survey is in the Chapterhouse once the company sends her there (docs/areas/shelf.md §6, 8).
- **The Grove Roots** (dungeon, 16×16, band 6–9): two halves joined by a locked door; the iron
  key is behind a secret door on the west side; the stairs down are guarded.
- **The Cut Stone** (dungeon, 16×16, band 8–10): three square rings of Underdeep corridor. A
  secret door opens the second ring, a door the third, the key the chamber. The Hand of Ash and
  two adepts wait at the Stone; kill them and the Warden of the Cut, two cells on, is the
  hardest fight in the game. The chisel goes to Sylvane; the Warden drops the first Meridian
  journal. The tear closes when the Warden dies: an encounter's `slainText` is said on the kill, so
  it comes after the fight from whichever side the party fought. From then on the rift hounds and
  the riftling elders stop coming back, in the forest and under the Grove alike (`until:
  TEAR_CLOSED`, in `grove2.ts`); a group still standing stays until it is killed.
- **Weather.** Colder than the Foreland, with hard winters whose snow lies deep for weeks over the
  pass, and mist under the trees. Fronts reach it five hours after they cross the Foreland.

One clear of every map is worth a little over level 8 per member; the dungeons respawn in one to
two days, and a little over two more sweeps of the Grove reach 10 (a sweep pays 38% less once the
Warden of the Cut is dead and the Rift's groups stop coming). Levels are still bought, so the gold
matters: about 8,400 for six members from 5 to 10. A clear of Thornmark pays 8,249 xp a member of
the 13,667 its curve asks, and 5,800 gold of the 8,400 (the Wardens' two quests and their chest
give 400 xp a member and 470 gold of it): the curve (`src/content/progression.ts`)
reports both as owed to the pilot (#26).

The gate check (`tools/tests/gate.ts`) reports Thornmark's misses as #40's. Its company is dressed
by the Foreland's gear ladder (#99), so at 3 it wears the band's gear. The zone holds: the company
wins 23% of its fights at 3, 7% at 2 and 2% at 1, and all of them from 4, where the group spells
come; at 5 it gives 5.84 fights to a rest. It does so with swarms: past the two gentle groups at
the way in (the dire wolves, and the ogre with his brigands and an archer), most groups are twelve
strong, of thorn spiders or brigands that die to one group spell but bite hard, with the area's
own heavier monsters among them, and the barrow's dead and the wraiths in their own bands. The
dungeons do not yet hold: two under their floors the company wins all of the Grove Roots' fights
(at 4) and the Cut Stone's (at 6), and two under the area's floor, at 3, 54% of the area's. The
gate wants a quarter. The Hand of Ash and the Warden of the Cut are won every time at level 8,
where a boss should be won about half the time, and the Cut Stone gives 7.95 fights to a rest,
against six or seven.

## Tests

Its `walkthrough.ts` plays the chain of the one quest, the Foreland's chapter and then its own,
The Grove Stone, a step at a time (`tools/walk.ts`); then again with Thornmark taken before Vask's
hire, and after it but before the wand, where the log must read true and end the same. A step added
to the chapter adds its play there. The other end-to-end tests (the pass, the stairs) cross between
the Foreland and Thornmark, so they stay in `tools/tests/`.
