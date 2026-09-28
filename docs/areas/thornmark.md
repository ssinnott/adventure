# Thornmark

The second step of the road of levels, band 5–10: old forest over the pass from the Foreland,
where the Ashen cut the Grove Stone. Its content is in `src/content/areas/thornmark/` (maps,
monsters, items, quests, climate and its part of the world map) and its businesses' rooms in
`src/ui/interiors/thornmark/`. The systems it runs on, the level cap and the spells, classes and
traits that carry a company to it included, are in [SLICE.md](../SLICE.md) ("The road to level
10").

## What is built

- **Gear.** A Thornmark tier in the Armoury: war hammer, battle axe, great sword, crossbow, the
  Thornmark bow, rune dagger, grove staff, runed robe, brigandine, plate, tower shield, elixirs,
  sapphire vials, lantern oil.
- **Monsters.** Thirteen for band 5–10: dire wolves, thorn spiders, brigands and their archers,
  Ashen zealots and adepts, rift hounds, bone knights, wraiths, riftling elders, ogres, and two
  bosses, the Hand of Ash and the Warden of the Cut. Two new drawings (ogre, wraith); the rest
  re-tint and re-scale the slice's ten.
- **Thornmark** (outdoor zone, 32×32, band 5–10): reached through the mountain pass on the
  Foreland's east edge, open to any company; a Warden checkpoint warns it on the way. Thornhold in
  the north-east, a ruined watchtower with an ogre's den, a barrow with bone knights and wraiths, a
  river with one bridge, a dead survey marker in a lake, and the Grove at the end of a chisel-marked
  road in the south-west. Fourteen groups.
- **Thornhold** (town, 16×16): the Green Man inn, the Lantern Chapterhouse, the Armoury, the
  Lantern Hall (tier 4), the Elder's Yard, the Split Oak tavern (rumours about Vask's timing),
  a healing spring, and Elder Sylvane, who pays 1500 gold for the Underdeep chisel.
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

One clear of every map is worth a little over level 7 per member; the
dungeons respawn in one to two days, and two more sweeps of the Grove reach 10. Levels are still
bought, so the gold matters: about 8,400 for six members from 5 to 10. A clear of Thornmark pays
6,039 xp a member of the 13,667 its curve asks, and 4,932 gold of the 8,400: the curve
(`src/content/progression.ts`) reports both as owed to the pilot (#26).

The gate check (`tools/tests/gate.ts`) reports Thornmark's misses as #40's. Two levels under each
map's own floor a company wins 91% of the zone's fights (at 3), 99.9% of the Grove Roots' (at 4)
and all of the Cut Stone's (at 6); two under the area's floor, at 3, it wins 70% of the area's. The
gate wants a quarter. The Hand of Ash and the Warden of the Cut are won every time at level 8, where
a boss should be won about half the time, and the Cut Stone gives 7.75 fights to a rest, against
six or seven.

## Tests

No walkthrough of its own yet. The end-to-end tests of today (the pass, the stairs, the quests
walked through) cross between the Foreland and Thornmark, so they stay in `tools/tests/`; an area's
`walkthrough.ts`, which `tools/test.ts` finds and runs, comes with its chapter of the one quest.
