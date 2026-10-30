# Adventure — High-Level Design

*Working title: **The Hearth of Caldera***

A first-person, grid-based, party RPG in the lineage of Might and Magic I–V (Book One through
World of Xeen), with the world structure, faction questlines and "gates" pressure of The Elder
Scrolls IV: Oblivion. Six characters, one square at a time, a huge world you are trusted to get
lost in, and a fantasy setting with a hard science secret underneath it.

This document is deliberately high level. It fixes the pillars, the shape of the world, the story,
and the scope tiers. Systems get their own docs once the vertical slice exists.

---

## 1. Vision and pillars

**One line:** *Chart a dying world, one square at a time, and decide whether to save it or wake it.*

**Pillars**, in priority order. When two conflict, the earlier one wins.

1. **Exploration is the game.** The map is the reward. Every region is open from the first hour;
   difficulty is geographic, not gated by quest flags. Secrets are found by walking into walls.
2. **The party is the character.** Six people you built, with real class and race
   differentiation, secondary skills that open the map, and prestiges taught by trainers you have
   to find.
3. **Turn-based, tactical, quick.** Combat is turn-based on the grid, resolves fast, and never
   pads the game with swarms. Twelve enemies is a big fight, not a Tuesday.
4. **The world has a clock.** Day and night, shop hours, NPC schedules, rifts that spread while
   you dawdle. Time passing is a resource you spend, not a cosmetic.
5. **Fantasy on the surface, machinery underneath.** The Might and Magic twist, done our way and
   earned by exploration rather than exposition.

**Anti-pillars** — things the franchise taught us to avoid:

- No hand-mapping. Automap is on from minute one; the Cartography skill makes it *better*, not
  *exist*.
- No difficulty cliff that becomes a difficulty plain. The late game must still ask questions.
- No hundred-monster rooms. Encounter size is capped by design (see §6).
- No puzzle whose answer lives outside the game. Every riddle has an in-world hint chain.
- No dead engine reuse. If a region has nothing new to do or see, it does not ship.

An autoplay mode exists for watching: the pilot plays fair, knowing only what the party knows, and
takes the player's own game only when asked; left alone, the title plays one of its own and saves
nothing. It does not loosen pillar 1 for the player.

---

## 2. Inspirations

### From Might and Magic I–V (take)

| Take | Why |
|---|---|
| Six-character party, first-person grid, 90° turns | The feel the player remembers. Non-negotiable. |
| Open world with geographic difficulty | The series' most-loved trait across all entries. |
| Secondary skills (Mountaineer, Pathfinder, Swimmer, Cartographer…) | Skills that *open the map* are the best skills. |
| Spell guilds, spell purchase, per-class spell lists | Makes towns matter and gold meaningful. |
| Day/night, food, conditions (poison, disease, stone…) | Attrition that makes town trips a decision. |
| Class promotion quests (VII) | Direction inside an open world. Ours are prestiges (§5). |
| The sci-fi reveal | The franchise's identity. |
| Timed respawn of cleared areas | Keeps the world alive without infinite grind. |

### From Might and Magic (leave)

- Typed-answer end puzzles (II), cryptograms, timers on riddles.
- Wireframe-era encounter rates; graph paper.
- Real-time toggles and free movement (VI–IX). Wrong branch of the family for this game.
- Playable dragons and recruited-only parties (VIII). Fun once; hollow as a foundation.
- Always-online DRM and a small world (X).
- Hirelings and temporary party members (VI–VIII). The party is the six you made (§5).

### From Oblivion (take, adapted to the grid)

| Oblivion | Our version |
|---|---|
| Oblivion gates spawning across the world | **Rifts** open near dead Wardstones and spread. Repeatable, template-built mini-dungeons that stop when the region's Wardstone is restored. |
| Emperor dies in the prologue; find the heir | The Queen dies in the prologue; **the succession is a subplot**, not the main plot. |
| Fighters/Mages/Thieves/Dark Brotherhood questlines | **Guilds** (§8): a company can join any or all of them, and each is a hub of side quests. |
| Fame / Infamy, faction disposition | *Not taken.* Standing, our first take on it, went with the Charters (§8). Something like it may come back, but it will look different. |
| NPC schedules, shop hours | Towns have a clock. The smith is not at the forge at 3am. |
| Skill-by-use | *Not taken directly.* We use level-up points plus trainer mastery, but a third prestige's quest acts like "use it to earn it" (§5). |
| Persuasion minigames (lockpicking's struck, §5) | Tiny, optional, skill-skippable. A 10-second grid puzzle, not a wheel. |
| Shivering Isles-style "strange region" | The **Underdeep** (§4) is our tonal break. |

---

## 3. Core loop

```
Town ──► Outdoors ──► Dungeon ──► Town
  │          │           │
  │          │           └─ loot, keys, journals, a Wardstone, what a trainer asked for
  │          └─ encounters, rifts, secrets, hidden entrances, terrain skills
  └─ rest, train, buy spells, take a guild's quests, turn in quests, hear rumours
```

Minute to minute: walk a square, read the viewport, decide (fight / avoid / search / cast).
Hour to hour: push a little further than is safe, retreat, grow, return.
Session to session: a region's Wardstone falls, a guild's quest ends, a prestige lands, the story
turns.

---

## 4. The world: Caldera

Caldera is a ring of land around an inland sea. In the centre of the sea burns **the Hearth**, a
column of light that has never gone out in recorded history. It has begun to dim.

Around the sea, and on two islands in it, twelve areas on one road of levels to 32, six of them
with a **Wardstone**. In the road's order, as the atlas (`src/content/atlas.ts`) has them:

| Area | Character | Band | Wardstone |
|---|---|---|---|
| **The Foreland** | The starting coast: the capital *Helmstow*, farms, the Downs. | 1–5 | The Lodestone (already intact; tutorial) |
| **Thornmark** | Old forest, the elf hold, the Grove, the Deepthorn. | 5–10 | The Grove Stone |
| **Saltreach** | The Long Water's delta and the free port. | 10–12 | The Tide Stone |
| **Wrackholm** | The smugglers' isle, where the stolen Tide Stone lies. | 12–14 | |
| **Sunderwood** | The old wood the rift split. | 14–16 | |
| **The Kilns** | Dwarf country: mines, forges, the ore port. | 16–18 | The Anvil Stone |
| **Cairnmoor** | Heather moor, cairns and a ring of stones. | 18–20 | |
| **Rimewater** | Long lakes under the glacier. | 20–22 | |
| **The Whitespine** | The great southern range and its monks. | 22–24 | The Peak Stone |
| **Ashfall** | Fire Mountain, black sand and vines. | 24–26 | The Ember Stone |
| **The Glasswold** | Steppe round a desert of fused glass. | 26–28 | |
| **Hearth Isle** | The temple over the Core. | 28–32 | |

The bands are `CURVE`'s (`src/content/progression.ts`; the docs suite holds this table to it) and
the atlas's (`areaBand` in `src/game/atlas.ts`), the Foreland's and Thornmark's from
their maps. Two zones are not on the road: the Glass in the Glasswold and Glacier Foot in
Rimewater are the reach (§9), off the quest and optional by design. Nothing on the road is locked
by a skill or a flag (docs/EXPANSION.md §2.2): a mountaineer or a ship is a shortcut, never a key.

Below all of it is **the Underdeep**, the hull's service layer, where geometry becomes too
regular, materials become too smooth, and the monsters stop being animals. This is where the secret
lives (§7). It is not a map beneath the world: a company walks it only in the final dungeon, from
the Hearth Isle down to the Core (§9). Elsewhere the hull shows only at the foot of a few deep
dungeons, among them two large ones built around it: Meridian Camp, down Fire Mountain's vents,
and the Dead-Drop, below the Tide Ship's hold (§10.2, §10.3). Each is three levels and a glimpse, never a door
into a wider map: the camp's door to the service ways and the Dead-Drop's rails go on through doors
that open for nobody the company has, as the Deep Mines' CREW ONLY and the Sleepers' Bay's do
(docs/areas/meridian_camp.md, docs/areas/dead_drop.md; #22).

The **Hearth Isle** in the centre is reachable only by ship.

### Scale targets (v1)

v1 is **cores and country** (docs/EXPANSION.md §2.1). In each area, a core of hand-built zone maps
at full density: its towns, its Stone, its dungeons' approaches. The rest of the area is country,
built to a looser floor (docs/EXPANSION.md §5.3) from the atlas's terrain, the wilderness features
and per-zone encounter tables. The outdoors is one map, laid out by the atlas and built from 32×32
zone maps; land not built yet stays void. Coaches and boats are built (#164, `src/game/passage.ts`):
a person sells a crossing between two places that costs gold and days, five of them so far (the
ferry, the Compact's ship, the drove road's coach, the Rider's ride and the last crossing), so an
area's core can be played before the country behind it is built.

| Thing | Count | Grid |
|---|---|---|
| The outdoors | 12 areas, one map | 512×384 squares |
| Core zone maps | about 3 an area | 32×32 each, full density |
| Country | the rest, about 70 zone maps' worth | 32×32 each, the country's floor |
| Towns | 8 | 16×16 |
| Dungeons | 18, and the Underdeep and the Core | 16×16 to 32×32, 1–4 levels |
| Rift templates | 8 | 12×12, seeded |

The towns and dungeons are the atlas's places, built and planned. The reach's dungeons among them
(the Ice Caves and the Buried Tower; the Vault is not placed yet) are left for later, post-v1 with
the rest of the reach (§12).

---

## 5. The party

**Six slots,** filled at the start. There are no hirelings: the party is the six you made.

### Races

| Race | Lean | Hook |
|---|---|---|
| Human | Balanced | None yet: it was the fastest Standing gains, and Standing is gone (§8). |
| Dwarf | STR, END | Resists poison; can read Kiln-script. |
| Elf | INT, ACC | Born to Perception; Thornmark trusts them. |
| Gnome | LCK, PER | Born to Perception, as the elf is. |
| Tidefolk | SPD, END | Swim without the skill; Saltreach kin. |
| Orcblood | STR, SPD | Cheap intimidation; distrusted in Helmstow. |

### Classes and prestiges

Ten classes: Might and Magic's six (Knight, Paladin, Ranger, Cleric, Sorcerer, Thief), and the
Barbarian, Monk, Bard and Druid.

Each class has three **prestiges**, which replace the two promotions this section first planned.
Each prestige has a title of its own for each class, and the title becomes the class's name: a
Knight who takes the first is a Knight-Errant from then on. A prestige raises the hit points and
spell points each level brings. Casters (Cleric, Sorcerer, Druid) gain spell ranks, which make the
spells they know stronger (§7); hybrids (Paladin, Ranger, Bard) gain a rank and a perk; the classes
that don't cast (Knight, Thief, Barbarian, Monk) gain perks. New spells come with levels, not
prestiges.

Each prestige is taught by a trainer of its own, and every trainer lives on the surface:

- **The first,** at about level 11, in a city that suits the class, by someone who may have another
  job there, like a ranger who is Thornhold's fletcher. It costs gold.
- **The second,** somewhere off the beaten path and relatively safe. It costs gold.
- **The third,** somewhere hard to find and dangerous. It asks for a quest instead.

When a character reaches a prestige's level, they get a quest to seek out its trainer, and the
quest reveals where the trainer is. The trainer who teaches a character their 11th, 19th or 27th
level names who to seek and where, and the quest log and the world map mark the place: one quest for
each member. For the third, the quest names the place; the way there, and the quest that trainer then
asks, are the hard part. The cap passed 10 with #159. Built with #19: the titles, the hit points and
spell points, every perk below (the sorcerer's third is `pierces` in `src/game/combat/casting.ts`,
the druid's `World.moveMonsters`, #809), a trainer (a person who teaches one class one prestige,
`teaches`) and the seeking quests, made from the trainers placed, with the world map's marks. All
thirty trainers are placed, three to a class; the ten thirds each ask a quest. The ranks' effect on
spells is built (#20, §7).

**Levels.** The first at 11, the second at 19 and the third at 27, eight levels apart, with the new
spell tiers between them at 15 and 23 (§7), so something new comes every four levels. Every
prestige level is one a town's trainer teaches, since each teaches to its band's top plus one:
Thornhold to 11, Saltmouth to 13, the Kilns' towns to 19 and Cinderport to 27.

**Hit points and spell points,** added to every level from each prestige's own on, and adding up:

| | Hit points | Spell points | By 32 |
|---|---|---|---|
| Casters (Cleric, Sorcerer, Druid) | +1 | +2 | +42 and +84 |
| Hybrids (Paladin, Ranger, Bard) | +1 | +1 | +42 and +42 |
| The rest (Knight, Thief, Barbarian, Monk) | +2 | none | +84 |

**Prices.** The first 1,000 gold, a little under the 1,200 Plate Mail costs in Thornhold's Armoury,
and the second 4,000 (`PRESTIGE_PRICES`, `src/game/party/tables.ts`); the curve's gold does not
count them. The third asks a quest. Nor does it count the tiers (Stats, skills, mastery): Expert
2,000 gold a line a member at a town's trainer, Master the 5,000 a Master's person asks
(`TIER_PRICES`, `src/game/mastery.ts`, #852).

**Perks.** A rank is a spell rank (§7). They lean on offence and on work outside combat, and none
adds armour: in the harness, armour that keeps up makes monsters hit harder, and harder hits kill
(MONSTERS.md §4.4).

| Class | First | Second | Third |
|---|---|---|---|
| Knight | a second attack each turn | while the knight stands, the front row gains +2 to-hit | a third attack each turn |
| Thief | a second attack each turn with a light weapon (dagger, short sword, sling), and Sneak Attack, a blow on a foe in its first round before its turn, grows by 2 every two levels | once a fight, drops from sight for a round: no foe can single the thief out, and its blows that round are sneak attacks | a third attack each turn with a light weapon |
| Barbarian | a second attack each turn | Rage starts below three quarters of hit points, and the barbarian dies only at −30 | a third attack each turn |
| Monk | two strikes a turn with a staff or bare hands | always acts first in a round, and can strike from the back row | a third strike each turn |
| Paladin | rank 1, and a second attack each turn | rank 2, and Holy Strike rises to +6, on the dead only | rank 3, and a third attack each turn |
| Ranger | rank 1, and two shots a turn with a bow | rank 2; Marksman rises to +4, and the weather no longer spoils the ranger's shots | rank 3, and three shots a turn |
| Bard | rank 1; Inspiring Song adds +1 damage as well | rank 2; while the bard stands, the company can't be put to sleep or paralysed | rank 3; the song rises to +2 to-hit and +2 damage |
| Cleric | rank 1 | rank 2 | rank 3; once between rests, the first member who would die is left at 1 hit point |
| Sorcerer | rank 1 | rank 2 | rank 3; damage spells pass a monster's resistance to their element, though not an immunity |
| Druid | rank 1 | rank 2 | rank 3; beasts of a lower level than the druid leave the company alone |

**The trainers.** Every first is taught in a city a company reaches by 11, by someone with a job
there. Every second is off the beaten path: not a step of the one quest, and not within about ten
squares of the road. Every third is hard to find and dangerous, and its trainer waits on the surface
while the quest goes down.

| Class | Titles | First: city and job | Second: off the beaten path | Third: hidden and dangerous |
|---|---|---|---|---|
| Knight | Knight-Errant, Knight Banneret, Knight Paramount | Helmstow: an armourer in the keep's ward (#17) | Coldharbour: a retired Warden captain's farm off the Downs | Stairwatch: a ledge above the Giants' Stair, its way up found off the Stair |
| Paladin | Lightbearer, Justicar, Exemplar | Helmstow: the chandler who makes the Lantern Chapel's lamps | under the Eaves: a hermit's shrine by the clearing, kept by a knight of the Crown that was | Old Cinder, on Fire Mountain's west flank |
| Ranger | Outrider, Deadeye, Unerring | Thornhold: the fletcher | Deepthorn Lodge, in the Deepthorn | the Eyrie: the Wold Rider scout who guided the Meridian Company, on the far-west mesa under the rim |
| Cleric | Curate, Prelate, Exarch | Thornhold: the bone-setter at the Lantern Chapterhouse | Lanternwood: the keeper of the moth shrine, a Lantern who stayed when the wood split | Anchorhold: an anchoress walled into a cell on Hearth Isle's east rim |
| Sorcerer | Arcanist, Thaumaturge, Magus | Saltmouth: an astrologer who draws star charts for the ships' pilots | Watcher's Hut, beside the Stone Ring on High Moor | the Glass's edge, by the gap the Riders keep, where the Tower's crown stands out of the Glass |
| Thief | Tumbler, Nightjar, Faceless | Saltmouth: a locksmith | the Upper Water: an old barge smuggler at the willows' quay, out of the Compact, or so he says | Rook's Nest: a hide on the tip of Sheer Point, over the Hand's causeway |
| Barbarian | Berserker, Ironhide, Warlord | Saltmouth: a stevedore on the docks | Iron Crag, in the Iron Fells | Warlord's Forge, by the mouth of Fire Mountain's vents |
| Monk | Stillwater, Windwalker, Ascendant | Saltmouth: the harbour ferryman | Sjonghol, in Kestrel Edge's cliffs above the Upper Water | Spine Summit, above the Peak Stone and its monastery |
| Bard | Troubadour, Skald, Laureate | Helmstow: a luthier | High Moor: a piper camped by the tarn below the Stone Ring | the monastery's bell tower, where the bells ring the eleven |
| Druid | Swarmcaller, Thornspeaker, Archdruid | Thornhold: a beekeeper | the wood to the head, in the Deepthorn: an elf of the old wood, who comes out of the trees once the Grove Stone is restored | the Ember Waste, where the Ember Stone was never finished |

No title repeats the name of a skill, a trait or a spell. Where the trade is a shop the trainer keeps
it and sells what exists: the armourer armour and shields, the chandler Lantern Oil and torches, the
fletcher bows, the bone-setter draughts and cures, the locksmith a set of picks (#860). Lanterns,
honey and salves are not items, so the beekeeper keeps no shop, nor do the astrologer, the luthier,
the stevedore and the ferryman.

**The quests for the third prestige,** in sketch. A third's fights are the places' own, not set at
26 for the quest (#448's 3). Decided by the owner's delegate, 16 October 2026 (#733): the
Paladin's are the husks of Old Cinder, at 25. Decided by the owner's delegate, 16 October 2026
(#807): the Sorcerer's third is taught at the Glass's edge on the Wold and walks the Wold's own
country, band 26 to 28.

- **Knight:** hold the ledge above the Giants' Stair with the old champion through a night of the
  giants' toll-takers (MONSTERS.md §12).
- **Paladin:** go down into Old Cinder's undercroft, and relight the lamp at its bottom.
- **Ranger:** follow the Meridian journals down Fire Mountain's vents to Meridian Camp, and bring
  Oriel Fane's map back to the scout at the Eyrie (§10.3).
- **Cleric:** carry the Crowness Light keeper's log of the eleven over the sea to the anchoress
  walled into Anchorhold, and go down into the temple's first crypt without her, to light its eleven
  lamps in the keeper's gaps, while she keeps the top.
- **Sorcerer:** bring the scholar at the Glass's edge the two glasses the walkers carried, and let
  him read the one by the other's light.
- **Thief:** steal the Compact's orders from the Dead-Drop, below the Tide Ship, and learn who writes
  them (§10.2).
- **Barbarian:** go down Fire Mountain's vents from the old warlord's forge to Meridian Camp, and
  kill what nests there.
- **Monk:** climb past the monastery, whose Brothers are not what they seem (MONSTERS.md §8.1), to the
  summit, and keep the hermit's vigil through a night.
- **Bard:** gather the verses of the eleven, from the Drowned Temples' count, the Stone Ring's call
  and the lighthouse keeper's log, and sing them in the monastery's bell tower.
- **Druid:** carry a seedling from the Grove into the Ember Waste, and keep it alive until the Ember
  Stone is finished.

### Stats, skills, mastery

- Seven stats: Might, Intellect, Personality, Endurance, Accuracy, Speed, Luck. Four do something in
  a fight: Might a blow's damage, Accuracy its to-hit, Speed armour, the turn's order and a flight,
  Personality a heal. Endurance and the spell stat are read when a level is gained, Luck by nothing.
  A stat as a member stands is their own raised by what they bear (`statOf`, `ItemDef.stat`, #855):
  what they wear and the slotless items in their own pack, as a resistance is borne; armour in the
  pack and the bag raise nothing, and a save holds no raise. Four found items raise one by 3: the
  Runner's Coat speed (Wrackholm), the Talon Knife accuracy (the Whitespine), Cairnbuilder's Mail
  might (Cairnmoor) and the Vigil Robe personality (Hearth Isle). They and the four elemental weapons
  beside them (§6) are off the gear ladder and in no shop, two to an area, one of each pair in the
  area's first locked chest (#861 to #864).
- **Secondary skills,** three to a guild, taught to its members for a price (§8):
  *Cartographer, Pathfinder, Mountaineer, Swimmer, Linguist, Merchant, Lockpick, Danger Sense,
  Perception, Arms Master, Spirit Sense, Navigator.* Built with #538: Linguist, the first, a list on
  each member that the sheet shows, learnt for 1,000 gold at any hall of the Lanterns or from a
  person who teaches it, by a company that is a Lantern; the dwarves are born to it, and a copybook
  carried does its work (§9, Act III). Built with #805: Mountaineer and Swimmer, learnt as Linguist is,
  at the Wardens' Drillyard and at the Cartographers' halls in Saltmouth and Cinderport. A company
  with a Mountaineer standing climbs mountain and cliff; one with a Swimmer standing swims deep water.
  No people is born to either: the Tidefolk swim by theirs. Decided by the owner's delegate, 16
  October 2026 (#805). Built with #856, so that each hall teaches the three its guild has built:
  - *Perception* (the Lanterns'): a search finds a secret door surely, in the wall ahead or in the
    wall past an open square ahead. The elves and the gnomes are born to it; Keen Eyes is the sure
    find in the wall ahead alone, and anyone else finds it there one time in two.
  - *Spirit Sense* (the Lanterns'): a group all of the dead within eight steps is marked on the
    automap, through walls and dark.
  - *Danger Sense* (the Wardens'): a roaming group aware of the company is marked on the automap,
    though a hill or a wall hides it.
  - *Arms Master* (the Wardens'): the company strikes first; in every round every standing member
    acts before any monster, and the fight's start says so (§6).

  Built with #857, so that every hall teaches its guild's three and all twelve are built:
  - *Cartographer* (the Cartographers'): the automap fills a square further than the company sees,
    three in the open by day and two in a dungeon or the dark, never past a wall, a door or a secret
    door. A chart carried does its work.
  - *Pathfinder* (the Cartographers'): hills, ash, dunes and deep snow are walked at the road's six
    minutes a step, with no drag on the clock. The Rangers are born to it.
  - *Lockpick* (the Compact's): an iron-key door opens with no key spent, and so does a locked chest,
    which otherwise opens to an iron key spent and to nothing else ("Locked."). The Thieves are born
    to it, and a set of picks carried does its work. No door needs a pick: every locked door has its
    key. The lock minigame of §2 is struck.
  - *Merchant* (the Compact's): a shop pays two thirds of an item's price, not half. An item that
    does a Merchant's work would do it carried, as a chart does.
  - *Navigator* (the Compact's): a crossing costs half its fare, after a flag's free or half.

  A people or a class may be born to a skill (`races`, `classes`), and a hall will not sell a member
  a skill it is born to. Each works while a member who has it stands, and a chart's and a set of
  picks' while one is carried. A hall's "Learn a skill" asks which skill, each with its price and
  what it does, then who would learn it, each member with the price or why not; a person who
  teaches one asks only who. All twelve are built.
- **Weapon and magic tiers,** Novice, Expert and Master, a member's on two lines (`Character.tiers`,
  `game/mastery.ts`, #852): at arms, its skill with whatever weapon is in hand, and in magic, with its
  list. Fighters (Knight, Thief, Barbarian, Monk) take arms, casters (Cleric, Sorcerer, Druid) magic
  and hybrids (Paladin, Ranger, Bard) both; Novice is a member with neither. Expert at arms adds 1 to
  hit and 1 to every blow's damage, Master 2 and 2 in all; never a blow (the prestiges') nor armour
  (Perks). Expert in magic adds a rank's step, Master two, a hybrid's half (§7 Ranks). Expert is
  taught from level 13 by every town trainer whose ceiling is 13 or over: the Sail Loft, the Lamp
  Gallery, the Old Working, the Ore Shed, the Trainers' Yard, the Ash Yard and the Sergeant's Tent.
  Its first menu says "Expert at arms and in magic", which asks the line, then lists each member with
  the price or why not. Master is taught from 25 by a person found and never sought (`npc.mastery`),
  to a member Expert in the line, once their favour is done and for their price: two on the road, the
  Wold's old Rider at arms (#858) and Old Cinder's scholar in magic (#859). The rhythm: a prestige at
  11, Expert at 13, tier 6 at 15, a prestige at 19, tier 7 at 23, Master at 25, a prestige at 27. The
  gate's company takes no tier: it takes what a level brings on the road and buys nothing optional, so
  a company that buys a tier has an easier road than measured (#865, EXPANSION §5.2).

Decided by the owner's delegate for #18, each the owner's to overturn:

1. A member carries a tier on two lines, by class as above; no weapon is retyped and no school added.
2. Arms: Expert +1 to hit and +1 a blow, Master +2 and +2 in all. Magic: a rank's step and two, a
   hybrid's half; costs, rounds, buffs, cures, Slumber, raising and the map spells unchanged.
3. Expert at every town trainer of ceiling 13 or over, by rule, from 13, for 2,000 a line a member.
   Wrackholm, Cairnmoor and the Whitespine have no town and need none: the town before teaches.
4. Master by a person found, never sought: Expert in the line, level 25, a favour and 5,000 gold.
5. Inert for every check: the gate's and the harness's company takes no tier, and #865 kept it so (J2,
   EXPANSION §5.2).
6. An item may raise a stat while it is borne (`ItemDef.stat`) and a weapon's blows carry an element
   (`ItemDef.element`, §6); no charge, mark or state. #847 adds the artifact's on top (#855).
7. Might, Accuracy, Speed and Personality do something live; this epic's items raise one by 3, a step.
   Endurance, Intellect and Luck have no live effect and get none here: #847's, if an artifact wants one.
8. The sheet prints a stat's total with its raise and the weapon's element, and a shop says both.
   What a shop pays is `sellPrice` in `src/game/items.ts`, asked of the company (#857 adds the
   Merchant's).
9. Inert until #861: no item of the content carries either, and the gate and the harness never wear
   one (off the ladder, as the charms are). (#861 placed the first.)

Decided by the owner's delegate for #891, each the owner's to overturn:

1. The gate's company takes no tier, confirmed (call 5; J2, EXPANSION §5.2). A tier stays what
   call 2 has it, to hit and to damage at arms and a rank's step in magic, and gives no armour: no
   defence-side rule is added to make it pay in what the company takes.

Decided by the builder for #852, each the owner's to overturn:

1. What a tier does (`TIER_ARMS`, `TIER_STEPS`, `armsBonus`, `tierSteps`) is in `src/game/party/`,
   beside `RANK_STEP`; `src/game/mastery.ts` holds the rest. The party loads the content, and a
   `src/game/mastery.ts` reaching the quests from it would read `MAP_DEFS` half loaded, as #805's
   call 1 found.
2. The trainer's entry comes after the trade, which stays first; a trainer that offered the trade
   alone now opens on a first menu, which the pilot's keep answers by its trade as at any business.
3. A Master's person lists only the members of their line; a company with none hears "I teach arms.
   Nobody here bears them." (or "magic. Nobody here casts."). A trainer lists all six.
4. A Master with no `done` does not teach: a missing `done` reads as not yet, as it does for a
   prestige's third and in a quest.
5. The reasons are short, to fit the 200 px panel beside a name: "not theirs", "taken", "Expert
   first", "level 13" (or 25), "favour first", "no gold".
6. The words: "Arms, or magic?", then "Who would be Expert?" (or Master). Each row is the member's
   name and the price or the reason, the question and the line chosen saying the rest; once taught,
   "<name> is Expert at arms now."
7. `src/content/shipped.json`'s `tiers` holds the tier ids a save's `tiers` holds (expert, master);
   the lines are its keys, and no field's name is recorded there.
8. The sheet says the tier after the weapon ("WEAPON Long Sword, EXPERT") and before the spells
   ("SPELLS (MASTER) ..."), in capitals as its labels are.
9. After a lesson the menu comes again, as the skills' does, at a trainer and at a Master's person.
10. The smoke is unchanged: its trainer is a prestige's person, not a town trainer's menu; the
    `mastery` suite walks the Sail Loft's menus in a Game.
11. The pilot's talk leaves a tier's menu as it leaves a skill's (#719's decision 12): at a Master's
    person it would otherwise take the cheapest priced row.

Decided by the builder for #855, each the owner's to overturn:

1. A raise is borne as a resistance is: `borne` states the rule and `resists` reads it; `statOf`
   counts by it without making the list, since every blow and every AC reads it, and looks nothing
   up while no slotted or no slotless item raises a stat (kept by the table it is handed, so a
   test's fixture, a table of its own, has its own, #973). Reading every slot cost the gate 15%
   more time.
2. A level gained reads the bare stat, Endurance's hit points and the spell stat's points alike: a
   raise lasts while it is borne, and a gain made with it would outlast it.
3. A blow's die never pierces: a sorcerer's piercing is its spells' (§7 Ranks).
4. The die is rolled after the steel and only for a weapon with an element, so a plain blow draws
   what it drew before and no figure moves.
5. The log's line is as it was, the die in the sum ("Bram hits Target for 9."): what an element did
   is learnt from the numbers, as a spell's is.
6. The sheet prints the total a fight reads and the raise after it in brackets, in yellow ("SPE
   13(+3)": 13, of which 3 is borne). The ruling's "SPD 16+3" read either way, and "16+3" reads as
   19. The labels stay the first three letters, SPE and not SPD.
7. The WEAPON line puts the element before the tier ("WEAPON Grey Blade, LIGHTNING, EXPERT"): the
   element is the weapon's, the tier the member's.
8. A shop says the element after the dice and a raise last ("2d6 lightning", "AC+2 speed+3").
9. `sellPrice(party, price)` takes the company though it reads nothing of it yet: the Merchant's
   clause (#857) goes there. The shops and quests suites read it in place of their copies.
10. The ladder's `worth` reads `hits` for a weapon, and the harness's blow `statOf`, in place of
    their own copies: the same numbers today, one measure after.
11. The `items` suite holds the content to the shape alone and counts what carries either, so the
    areas may add. An elemental weapon's name stays to 26 characters, for its WEAPON line with
    lightning and a tier to end by 334 px beside the items column (331 at 26, 337 at 27): the
    road's longest, Auke's Count, Short Sword +2, would not.

The secondary skills of #856, Perception, Spirit Sense, Danger Sense and Arms Master:

Decided by the owner's delegate for #18, each the owner's to overturn:

1. A skill names the peoples and the classes born to it (`races`, `classes`). The elves and the
   gnomes are born to Perception, and the gnome's cheaper training is struck: it finds secrets as
   the elf does, by Perception.
2. Perception is a sure find, in the wall ahead or the one past it; `World.search` asks for the
   skill and names no people. Keen Eyes stays the sure find at one square.
3. Spirit Sense marks a group all of the dead within eight squares, through walls and dark.
4. Danger Sense marks a roaming group aware of the company (within its `aware`), though a hill or a
   wall hides it.
5. Arms Master: in the first round every standing member acts before any monster while an Arms
   Master stands. No title repeats the skill: the tiers are Expert and Master at arms.
6. The menu is skill-major and two-level: the hall's skills, then who learns.
7. The gate's company holds no skill: a buyer is stronger than measured, the safe side (EXPANSION
   §5.2).
8. The pilot learns none, and sees what a sense marks, since `Known.groups` reads the automap's
   marks; the explorer searches once a side as before.

Decided by the builder for #856, each the owner's to overturn:

1. Perception's second square is the wall past an open square ahead, neither solid nor a door: a
   search sees no further than the eye, so a secret door behind a wall is not found.
2. A sense, Perception and Arms Master work while a member who has them stands, as Keen Eyes and
   the terrain skills do. No item does their work.
3. Spirit Sense's eight are steps, counted as `aware` and the automap's two are; a group of the dead
   and the living is not marked by it.
4. Danger Sense reads `aware` as `moveMonsters` does (5 where a group gives none, now `AWARE`), and
   marks a roaming group within it whether or not it comes on (a truce, an Archdruid's beasts).
5. With an Arms Master standing, a monk of the second prestige still acts first of all: the company
   before the monsters, the monk before the company.
6. A person who teaches a skill opens on who would learn it, one level: they teach one.
7. The words: "Which skill?" over a hall's skills, each row the name and the price with what it does
   in the note; "Who would learn?" over the six, each row the name and the price or why not
   ("known", "born to it", "not enough gold"). Every row is measured to fit the 200 px panel.
8. The texts: "Finds hidden doors, even a square off.", "Senses the dead through walls.", "Senses
   what hunts the company." and "The company strikes first."
9. `RaceDef.perceptive` goes: Perception's `races` says who is born to it, in one place.
10. The four rows follow Swimmer in `SKILLS`, so a hall lists its three and the sheet a member's in
    that order (Linguist, Perception, Spirit Sense; Mountaineer, Danger Sense, Arms Master), not
    §8's.
11. The sheet's skills line wraps inside its left column, since a member of two guilds may hold six.
12. The pilot's talk is unchanged: its way out leaves a hall's two levels and its skill rule a
    person's. The skills test holds both.

Striking first (#1070): Arms Master's rounds and the thief's Sneak Attack.

Decided by the owner's delegate for #1070, each the owner's to overturn:

1. Acting first is a mechanic already: a fifth to a quarter of a fight at level 10 in Arms Master's
   first-round form, and nothing from 16. The company does not act first; the thief does, by speed.
   Sneak Attack is the thief's whole late blow. What was wrong is that no line showed any of it.
2. Arms Master acts in every round: its name, id, price and text stay; while one stands the company
   acts before the monsters in every round, in its own speed order, and the log says "The company
   strikes first." once, at the fight's start. It takes the first round out of the 5 for #18 above.
3. Sneak Attack is a blow on a foe before it acts, and the log marks it as a second sentence:
   "Ottilie hits Giant Rat for 7. Sneak attack." The ruling made it +2, and 1 more every two levels
   past 10 with the Tumbler, on a blow before the foe's turn in any round; as built, the builder's 1.

Decided by the builder for #1070, each the owner's to overturn:

1. Sneak Attack is a blow on a foe in its first round, before its turn: the fight's first round, or
   the round it is called in; and every blow of the Nightjar's vanished round, as before. It keeps
   main's +4 and the Tumbler's 2 more every two levels past 10. Measured, a sneak attack in every
   round took a boss off its aim at any value that kept the thief's late blow (the tallymaster at
   27, at 70% before, to 71% at +1), and the ruling's +2 took 23 of the gate's lines off their aim
   and 4 past their limits; this keeps every line where it stood, and the harness within a sixth of
   a fight.
2. The mark follows the hit's own sentence and comes before a death: "... for 7. Sneak attack.
   Giant Rat dies." The log's readers keep the hit's head.
3. "The company strikes first." follows the fight's "... attack!" and comes before the weather's
   note.
4. `sneaks` reads the trait, the round and the order, and the damage and the mark both read it, so
   that they never disagree; nothing in it, or in `strikesFirst`, draws on the generator.

The secondary skills of #857, Cartographer, Pathfinder, Lockpick, Merchant and Navigator:

Decided by the owner's delegate for #18, each the owner's to overturn:

1. Cartographer (the Cartographers'): `reveal`'s radius one more, three in the open by day and two
   in a dungeon or the dark: the automap made better, never made to exist (§1). A chart
   (`ItemDef.skill: 'cartographer'`) does its work carried.
2. Pathfinder (the Cartographers'; the Rangers born to it): a Pathfinder standing walks hills, ash,
   dunes and snow at the road's pace, with no drag on the clock.
3. Lockpick (the Compact's; the Thieves born to it): a Lockpick standing opens an iron-key door
   without spending the key, and opens a locked chest. No door needs a pick, ever: the road needs no
   skill, and the five doors keep their keys. A locked chest (`chest.locked`) opens to a Lockpick
   standing or an iron key spent, else "Locked." and nothing. A set of picks (`skill: 'lockpick'`)
   does its work carried. The lock minigame (§2) is struck; `chest.trapped` stays as it is.
4. Merchant (the Compact's): a Merchant standing sells at two thirds of the price, not half
   (`sellPrice`).
5. Navigator (the Compact's): a Navigator standing pays half fare on every crossing, after a flag's
   free or half (`fareOf`).
6. The pilot: a locked chest it cannot open is walked past, as a locked door with no key is. It
   learns no skill.

Decided by the builder for #857, each the owner's to overturn:

1. A Lockpick opens an iron-key door with no key carried, as it opens a locked chest, and a key
   carried is kept: the pick is what opens it. The door and the chest share one rule
   (`World.unlock`). The cost: from the first step, its thief standing, the premade six pass every
   Act I key's guard (`gw1_captain`'s smugglers, greywater2's vestry secret, `g1_keeper` and
   `g2_keyguard`'s seven adepts), though no quest, flag or lock reads a key spent or a door opened.
   The narrower reading, a key needed and kept, is one line (`const lock = pass === 'unlock'` in
   `World.move`) and the first case of `picked()` in `tools/tests/movement.ts`.
2. Who does a skill's work is `skilled`'s answer: a member standing who has it, else a member
   standing while an item that does it is carried. So a chart and a set of picks do theirs, and an
   item that does a Merchant's work would; none does Pathfinder's, Merchant's or Navigator's yet.
3. Cartographer's square is added in every light: thick weather in the open, one square without it,
   is two with it. The corridor ahead, which is sight's, is not lengthened.
4. The extra square follows sight: never past a wall, a door or a secret door. It is mapped only
   where the square beside it toward the company does not block the view, so the automap is made
   better and never tells what is hidden: a secret door, or a Master's hide behind one. Since #889
   every square past the first follows sight so, one step at a time toward the company and never
   round a corner (SYSTEMS.md, line of sight).
5. The words: "Ottilie picks the lock." (the member's name) where a Lockpick or a set of picks
   opens one; a key spent at a chest says the door's "The lock turns. The key crumbles."; a locked
   chest stood on says "A locked chest." in place of "A chest. Space opens it."
6. `strandedLocks` reads a locked chest as a lock the party may open and need not: a key spent on
   one is among the orders it tries, a key inside one counts only once it is opened and a chest is
   never itself stranded. So no map may hold a locked chest that could take a door's only key, and
   `lockedFaults` holds that none holds an iron key or an item a quest turns on.
7. The roundings are down: a Navigator pays 75 for 150, 37 once half holds; a Merchant is paid 80
   for 120 and 26 for 40.
8. `sellPrice` asks `skilled`, as the world does. For that, a company's rank in a guild (`rankOf`)
   moves to `game/ranks.ts`: `src/game/skills.ts` asked it of `game/guilds.ts`, which pulled the
   quests' rules in under the content index before its maps were made.
9. The shops test asks the sell-back of a company with a Merchant, the most a shop pays, so no shop
   may price an item under two thirds of its own price (none does), and the quests test asks the
   same company whether a shop buys an item.
10. The texts: "Maps a square further.", "Walks rough ground at the road's pace.", "Picks locks, and
    keeps the key.", "Sells at two thirds, not half." and "Pays half fare on every crossing."
11. The five rows follow Arms Master in `SKILLS`, so the Cartographers' halls list Swimmer,
    Cartographer and Pathfinder, and the Compact's Lockpick, Merchant and Navigator.
12. The premade six's ranger is born to Pathfinder and its thief to Lockpick, so the tests that time
    a step onto hills or through snow, or see a key spent at a door, put them down for those steps.
13. The weather still says "Snow lies deep, and the going is slow." to a Pathfinder: the snow lies
    deep whoever walks it.

Decided by the owner's delegate for #892, each the owner's to overturn:

1. A Lockpick opens an iron-key door with no key at all, and keeps any key it holds: stands
   (the builder's 1 for #857). "Picks locks, and keeps the key" is this reading; the road needs no
   skill either way (the five doors keep their keys), no quest, flag or lock reads a key spent and
   no figure moves. A thief standing that walks past a guard it could fight is choosing, not falling
   off a cliff; and as iron keys are one item the narrow reading would bring back only the first
   key's guard. If the Lockpick slows the pilot's Thornmark run (#893), the fix is the pilot's.
2. The Cartographer's extra square follows sight, never past a wall, a door or a secret door:
   stands (the builder's 4). The secret is found, never told (§1); #889 asks the same of the base
   square outdoors and is right to, so that the two squares obey one rule.
3. The eight found items keep no common rule for base piece or price: stands (#861 to #864).
   Every price sits inside its window and under its area's dearest find, so the curve suite's lines
   stand. The elemental weapons' lead of 1.5 to 2.5 by `hits()` at their bands (10 to 15% of a
   blow) is a found weapon's edge, optional power the gate does not measure (J2): a rung is worth 1
   and a d6 3.5. Restating the eight is four area pull requests for a rule no player sees.

---

## 6. Combat

- **Trigger:** monsters move on the grid in real time relative to your steps (they advance one
  square per party step when aware). Combat begins when a group is adjacent or within ranged
  line.
- **Turn order** by Speed, party and monsters interleaved. One action per character. While an Arms
  Master stands, every standing member acts before any monster, in every round (§5, #856, #1070).
- **Rows:** front three take and deal melee; back three need reach, ranged, or spells. Swap costs
  a turn.
- **Encounter cap:** a single fight is at most 12 monsters in at most 3 groups. Bigger threats
  are bigger monsters, not more of them.
- **Conditions:** Asleep, Poisoned, Diseased, Paralysed, Cursed, Stoned, Unconscious, Dead.
  Cured by spells, temples, or time. Death is reversible in temples at a cost that scales.
- **The death line** is −10 hit points at every level: a member at 0 or below is unconscious and
  dies at −10. Die Hard dies at −20 and an Ironhide at −30 (`deathAt`,
  `src/game/party/conditions.ts`). Decided by the owner's delegate, 16 October 2026 (#18, #808).
- **Flee** is always an option and a chance, not a promise: the faster the party is than what it
  flees, the likelier, from 15% to 90%; a failed flight costs the round (`flee`,
  `src/game/combat.ts`). The cost is where you end up.
- **No round limit:** a fight runs until one side is down or gone or the party flees; no count of
  rounds ends it in play. The harness's fifteen (`ROUND_CAP`, `tools/kit/fight.ts`) is its own
  measure of a slog: a fight still going at fifteen is broken off there, not won. Decided by the
  owner's delegate, 16 October 2026 (#18, #808).
- **Respawn:** cleared areas repopulate on a long timer with weaker groups, and never repopulate
  bosses or keyed rooms.
- **An elemental weapon** adds 1d6 of its element to each blow that lands (`ELEMENT_DIE`, #855):
  nothing to a monster immune to it, half to one that resists it, half again to one weak to it, as a
  spell's (`elementDamage`); the steel lands as ever, so no blow is nothing. Its fire stops a mender
  mending that round, and the company learns the element's share, as from a spell. A weapon's
  measure (`hits`: the harness's, the ladder's, the pilot's) counts the die at 3.5. Four found
  weapons carry one (§5): Corposant (a morning star), the Thunderhead Axe and the Levin Mace
  lightning; the Beacon Hammer fire.

Decided by the owner's delegate for #18, each the owner's to overturn:

1. An element on a blow is an added die, not the whole blow: 38 monsters are immune to nature and 24
   to holy, and a whole blow of either would do them nothing.
2. Fire's die marks a mender burnt as a spell's fire does, and the element goes into what the
   company has seen, so the bot learns from it too.

Difficulty design: a region's band is a promise. Inside it, the hard fights are hard because of
composition and terrain (a caster behind a wall of shields, a narrow corridor, a room that goes
dark), not because of numbers.

---

## 7. Magic and the secret

### Spell schools

- **Cleric list** (Body, Mind, Spirit): heal, cure, protect, turn, bless, resurrect.
- **Sorcerer list** (Fire, Air, Water, Earth): damage, control, and the utility spells that make
  the world bigger: *Light, Levitate, Wizard Eye, Walk on Water, Town Portal, Waymark.*
- **Druid list** (the wood, its beasts and its weather): damage, mending and the party's skin.
  Paladins and Bards learn from the cleric's list, Rangers from the druid's.
- Spells are **bought** at the spell halls (in Act I, the Lanterns' two) after paying the hall's fee
  to study; the fee is the region's toll for making you stronger there, and buys no membership (§8).
  A level gives every spell of a new tier free, so a hall only lets a caster buy ahead.
- About 40 spells at v1: 28 to tier 5, and 13 more in two tiers past 10. Spells grow two ways:
  levels unlock new spells, and prestiges bring spell ranks, which make the spells a caster already
  knows stronger (§5). In the combat harness, damage spells that go on growing with level break the
  road past 10 (MONSTERS.md §4.4), so from 10 they grow by rank alone.

### Spells past level 10

**Growth stops at 10.** Spark, Fire Bolt, Chain Lightning, Meteor Swarm, Hailstorm and Tempest stop
gaining dice at 10 (Meteor Swarm 10d10, Tempest 10d8), and no spell grows with level after. A
monster that casts from these tables (MONSTERS.md §3.3) casts at its own level, held at 10 too, and
unranked.

**Two tiers.** Tier 6 at 15 and tier 7 at 23, between the prestiges, so a caster gains something
every four levels. A hybrid gains each two levels later, at 17 and 25, between its own perks. Lantern
Watch's hall (band 14–16) sells to tier 6 and Rime Lodge's (20–22), the Lanterns' fourth (§8), to tier 7, each a level or three
ahead; no other town sells a new tier, Saltmouth among them. Halls keep no level check, so a company
that reaches the Watch early may buy early; the band's monsters and the price are the gate. New
damage spells roll fixed dice, near tier 5's at 10, so that neither tier is the jump in monster hit
points tier 5 was at 8.

| List | Tier | Spell | Points | What it does |
|---|---|---|---|---|
| Sorcerer | 6 | Hoarfrost | 11 | Cold grips a whole group: 8d8, cold. |
| Sorcerer | 6 | Walk on Water | 8 | Shallow water bears the party a short way. |
| Sorcerer | 6 | Waymark | 10 | Marks where you stand, or brings the party back to the mark. |
| Sorcerer | 7 | Killing Frost | 18 | A killing cold on every foe: 10d12, cold. |
| Sorcerer | 7 | Levitate | 12 | The party floats a few steps over a drop, never up one. |
| Cleric | 6 | Hearthfire | 10 | The Hearth's fire falls on a whole group: 6d8, fire. |
| Cleric | 6 | Cleansing Light | 9 | Cures poison, disease, sleep and paralysis in everyone. |
| Cleric | 7 | Lampglass | 10 | The party takes half from one element, for five rounds. |
| Cleric | 7 | Absolve | 12 | Lifts stone and curse. |
| Druid | 6 | Wildfire | 10 | The wood's own fire on a whole group: 6d8, fire. |
| Druid | 6 | Grasping Roots | 7 | Roots may hold a group fast. |
| Druid | 7 | Wrath of the Wood | 16 | The whole wood turns on every foe: 8d10, nature. |
| Druid | 7 | Greening | 14 | Heals everyone well, and draws out poison and disease. |

The damage spells' dice are those the harness sized as stand-ins (MONSTERS.md §4.4), and the tiers
are built (#20). Walk on Water lasts twelve steps and Levitate six; Lampglass's element is picked as
it is cast. Grasping Roots holds each of a group at one in two, a blow does not free it, and each
held monster tears free at 0.35 a round.

**Ranks.** A rank belongs to the caster, not the spell: it lifts every spell they know, those
learned later too. Each rank adds 15% to the dice of a damage spell and to what a mending spell
heals, 45% by the third; flat bonuses (Spellfire, Healing Hands), buffs, cures, Slumber, raising and
the map spells stay as they are. A ranked spell costs what it did: the prestiges' spell points are
the price. A hybrid's rank is half a caster's step, since its perks carry the rest of its growth.
The third rank's signature is the class's own perk (§5); no spell has one of its own. A tier in
magic (§5) adds a rank's step and nothing else, Expert one and Master two, a hybrid's half: no cost,
no rounds and no reach change, and no tier lets Walk on Water cross deep water or Levitate climb
(#852).

**Elements.** Fire, cold, lightning, nature and holy, one to every damage spell, to meet monsters
that resist one (half), are immune to one (none) or are weak to one (half again) (MONSTERS.md §3.3,
#161). One spell stops being the answer to every fight, and choosing the element becomes the choice.

| Element | Spells |
|---|---|
| Fire | Fire Bolt, Meteor Swarm, Hearthfire, Wildfire |
| Cold | Hailstorm, Hoarfrost, Killing Frost |
| Lightning | Spark, Chain Lightning, Tempest |
| Nature | Thorn Lash, Stinging Swarm, Wrath of the Wood |
| Holy | Smite, Wrath of the Hearth |

Each list gains the element it lacks at 15, before the monster immune to its own: the sorcerer cold
before the Kilns' salamanders, the cleric fire before the machines the Hearth's light passes through
(MONSTERS.md §12), the druid fire before Cairnmoor's trolls, which heal from anything else. No rank
adds an element; only the sorcerer's third deepens one, passing resistance and never immunity.

**Map spells.** Each is a shortcut, never a key (docs/EXPANSION.md §2.2): it has a cost and a limit,
and the skill beside it is free and lasts.

- **Wizard Eye** fills the automap six squares about the company, once a cast; beside it,
  Cartographer maps a square further than the company sees, at every step (#857).
- **Walk on Water** crosses shallow water for a set number of steps, and a fight ends it. It never
  crosses deep water, so a paid crossing stays paid, and never dives: what lies under the water is
  Swimmer's. Nor does it quicken a step: the road's pace over hills, ash, dunes and snow is
  Pathfinder's (#857).
- **Waymark** holds one mark, set on land the company stands on in the outdoors, never in a town or a
  dungeon nor on ground the tide covers, outside a fight. It never takes a company anywhere it has not walked, nor past a dungeon's
  depth; the sea's ways stay Navigator's, who crosses for half the fare (#857).
- **Levitate** floats over the chasm for a set number of steps; the chasm is the only drop built, and
  pits and lava, once an area builds them, are its to float over too. It never rises up a cliff or a
  mountain, which stay Mountaineer's, and never goes down into a chasm. Jump is folded into it:
  the grid has no height for a jump to clear.
- **Detect Secrets is cut.** The secret is found, never told, and Perception, Keen Eyes, the elves
  and the gnomes already find what is hidden.

### The secret, in brief

Caldera is the inside of a hollowed body in space: a generation habitat. The Hearth is its
reactor and beacon. The Wardstones are field emitters that keep the habitat's ecology sealed. The
"gods" of every religion in Caldera are fragments of the **Custodian**, the vessel's steward,
which has been degrading for centuries and now speaks through different voices in different
regions. The Underdeep is the hull's service layer. The Custodian answers to the captain's line,
and Queen Isaure was the last of it (§9). Every people of Caldera came in the ship.

The player is never told this. They **find** it: Kiln-script that turns out to be a maintenance
language, a monastery whose bells ring in a pattern that matches the Hearth's flicker, a room with
a window below Fire Mountain.

---

## 8. Guilds

Some of the cities have guilds. A company can join any of them or every one at once, and each is a
hub of side quests. There are no rivals, and joining one never costs anything with another: a
company is six mixed classes, and rival guilds would pull it apart. Nor do guilds carry class
progression, which is the prestiges' (§5). They replace the four rival Charters this section first
described, and Standing went with those: a company's rank in a guild is its place in that guild,
not its name in the world. Something like Standing may come back, but it will look different.

### The four

| Guild | Who they are | Halls | Skills they teach |
|---|---|---|---|
| **The Wardens** | soldiers and road guards | Helmstow | Arms Master, Danger Sense, Mountaineer |
| **The Lanterns** | clergy and scholars of the Stones | Helmstow, Thornhold, Lantern Watch, Rime Lodge | Spirit Sense, Linguist, Perception |
| **The Cartographers' Guild** | explorers and surveyors | Saltreach, Cinderport | Cartographer, Pathfinder, Swimmer |
| **The Salt Compact** | smugglers and fences | Saltreach, Cinderport | Lockpick, Merchant, Navigator |

No new guild comes with Acts III and IV (#434, call 8; #443, call 7): the four stand, and the
dwarves have their thane. M1 builds the two in Act I's cities, the Wardens and the Lanterns; the
Cartographers' and the Compact's halls go in with Saltreach (docs/EXPANSION.md §7), and their
second halls with Cinderport (#512): the Cartographers' line ends at Meridian Camp and the Compact's
ship lands there.

- **The Wardens** keep Helmstow's roads, its checkpoints and its walls. Their hall is the Warden
  Drillyard, which goes on training levels. Lord Vask commands them as Regent-Warden, though some
  of their captains back the Queen's cousin (§10.1). In Act I their work is the roads: Captain
  Hale's checkpoint and a lost watchtower in Thornmark. Between acts, under Vask's hand, the
  Wardens on Helmstow's walls are his and the captains who back the cousin give the Drillyard's
  quests: the hall stays open and the guild splits quietly, which is its line into Act III (#151).
- **The Lanterns' halls are all four.** The Lantern Guildhall in Helmstow, the Thornhold Lantern
  Hall (not the Lantern Chapterhouse, Thornhold's temple), the Watch's Lantern Hall at Lantern
  Watch (#201) and the hall at Rime Lodge (#487), whose keepers hold the ice-hole open and are
  Lanterns, since the cargo coming up is the Stones' business (#434, call 5), go on selling spells,
  and give the Lanterns' quests to a company that has done the first task. The fee to study is the
  hall's, §7's regional toll; any company may pay it, and a Lantern pays it too. It is not
  membership. Every hall of theirs teaches Linguist to a company of theirs (#538), and so does a
  Lantern reader in Anvilhall's great hall (#459), so no company goes back for it.

### Joining and ranks

- **Joining is a first task,** a small quest any hall of the guild offers a stranger. There is no
  fee to join. The first task done, the company is a member at the first rank.
- **Four ranks a guild.** All of a rank's quests done raise the company to the next, and each rank
  opens the next quests. Act I takes the Wardens and the Lanterns to their third rank; Act III opens
  their fourth (#439), two asks each, offered once Act II is done: the Wardens' through the cousin's
  captains at the Drillyard, whose asks are the act's own matter, the Lanterns' at their halls,
  whose asks are the Deep Mines' inscription copied and the ring's voice reported (Act III's guild
  quests, below). The Cartographers and the Compact climb with their own areas: the Compact's
  Fence's rung is Act II's, under the Tide Ship; the other three rungs owed are Act IV's dungeons'
  (Act IV's guild quests, below). No hall gives an Act III or Act IV side quest but Cinderport's
  two (#56's 51 and 54).

  | Guild | 1 | 2 | 3 | 4 |
  |---|---|---|---|---|
  | The Wardens | Recruit | Corporal | Sergeant | Captain |
  | The Lanterns | Taper | Adjunct | Reader | Luminary |
  | The Cartographers | Chainman | Surveyor | Mapmaker | Geographer |
  | The Compact | Runner | Fence | Factor | Partner |

- **One ladder a guild.** Every hall of a guild offers the next quest on it and takes reports for
  any, so a company that meets the Lanterns first at Thornhold is sent back a short way for the
  first task.
- **A rank is no story lock.** A rank follows the guild's own quests, not the one quest, and it
  shuts no way on the map: it only decides which of the guild's quests a hall offers. A deed done
  or an item found before its quest was taken is paid when it is reported, with words for a
  company that came early, as a hand-in is.

### What a guild gives

- **Its quests pay gold, items and xp,** the xp split among the living as a fight's is.
- **Its skills,** three to a guild, taught to members for a price (§5), all twelve built. The
  Lanterns' Linguist reads Kiln-script, so it matters from the Kilns on; it is the first built
  (#538), and every hall of a guild teaches its guild's three: the Lanterns' and the Wardens' (#805,
  #856); the Cartographers' at the Map Room and the Chart House; the Compact's at the Keel and the
  Factor's House (#857). "Learn a skill" on the hall's first menu asks which skill, then who would
  learn it.
- **Its line.** The Charters' storylines are the guilds' lines: the Lanterns' split at Lantern Watch
  (§9, Act II), the Compact's line with its ending kept (§10.2) and the Cartographers' Lost
  Expedition (§10.3). The Wardens' siege was named and never designed, and is cut (#739, call 10).

### The company's charter

A company's start is a charter from the Crown, the plain word for its licence, granted by the
Regent. Vask's commission, The Quiet Farm, is its first contract, and Helmstow its home. The
charter makes the company no member of any guild.

### Act I's guild quests

A first task and three quests a guild, on the built maps, with no new monster group. The deeds keep
off the main quest's road and Hale's where the built maps allow: in the Foreland band only the
cellar and Brandy Hole hold a deed, so each guild has one there, which most companies will have
done before they take it and are paid for when they report it. Thornmark's barrow is left alone,
since it echoes the Berth, so two deeds are new once-events, First Watch's and the second marker's,
and one a new chest, the garrison's, set apart from the tower so that its two ranks are two trips.
Each quest's words, pay and level come with its build.

| Guild | Rank | Quest | Where | The deed |
|---|---|---|---|---|
| Wardens | first task | First Watch | the Foreland, Hale's checkpoint at the Scarth | walk the road to the checkpoint and back; one new once-event there |
| Wardens | 1 | the cellar's cult | Ashcombe Cellar | the two cultist bands that hold it |
| Wardens | 1 | the old watchtower | Thornmark | the ogre denned in the tower's base |
| Wardens | 2 | the garrison's strongbox | Thornmark, by Thornhold's north wall, across the map from the tower | the chest the tower's garrison buried when it fled, opened; one new chest there |
| Lanterns | first task | First Light | the Foreland's shore | look at the Hearth from the shore and say what was seen |
| Lanterns | 1 | the drowned stair | Brandy Hole | the dead at the stair down, laid |
| Lanterns | 1 | the dark marker | Thornmark's lake | the survey marker with its glass gone dark |
| Lanterns | 2 | the second marker | Thornmark, by the boulders south of the river | a marker still lit; one new once-event there |

Each guild's ladder climbs: a rank's quests are in the band of the last's or above.

### Act III's guild quests

Two asks a guild, the fourth rank's, each a deed on a built map of the act with no new monster
group. A company at the third rank is offered both, and both done make it a Captain or a Luminary,
the top. They wait for the act: a guild quest may wait for a flag, here Act II's end, so a Sergeant
or a Reader made in Act I is offered nothing two acts early, and from the same flag Captain Ordgar
keeps the Drillyard (docs/areas/shelf.md §5.1; docs/areas/kilns.md §9, #439's 1). The ladder stays
one ladder (above): every hall of the Lanterns offers theirs, Helmstow's and Thornhold's as the
Watch's and the Lodge's, which the goals name as where to report. Each ask pays 300 gold and 2,400
xp shared, the next rise of the ladder after Thornmark's 150 and 900 and 200 and 1,500.

| Guild | Rank | Quest | Given | The deed |
|---|---|---|---|---|
| Wardens | 3 | The Night Carts | the Drillyard, in Ordgar's voice | the Hand's cages seen on the Deep Mines' second level, what the night carts carry |
| Wardens | 3 | A Sword at the Hole | the Drillyard, in Ordgar's voice | the fourth night's fight won at Rime Lodge's ice-hole |
| Lanterns | 3 | The Words Over the Dead | any Lantern hall | the words over a niche of the dead in the Deep Mines, read by a reader |
| Lanterns | 3 | What the Ring Said | any Lantern hall | the voice in the stone ring on High Moor, heard by night |

The Wardens' asks are Ordgar's, the cousin's captain's, who writes what he is told in a book in his
boot; the Lanterns' show their split and never tell it, a Lantern who would not have the words
copied and one who goes out at what the ring said. No hall takes the Watcher's page: he sends it
down (docs/areas/cairnmoor.md §6).

### Act IV's guild quests

Four rungs are owed, the Cartographers' second and third and the Compact's second and third (#635),
each a deed on a place seen or a thing brought, with no new monster group. Any hall of the guild
offers and pays them, Saltmouth's or Cinderport's (one ladder, above). The Fence's is Act II's and
built, the stair's foot under the Tide Ship's hold seen, so the Compact's ladder climbs on past
Saltreach's top at 12 and no longer rests there until Cinderport's floor at 24. The other three
ride Act IV's dungeons and are built with them: a ladder may not skip a rank, so the Surveyor's
goes in before the Mapmaker's, and the Surveyor's and the Factor's wait for the act on its opening
flag, as Act III's do. The pay climbs with the band; the xp is each place's own budget.

| Guild | Rank | Quest | Sits with | The deed | Gold |
|---|---|---|---|---|---|
| Compact | 2 | Where the Cargo Goes | the Tide Ship's stair, built | the stair's foot seen, where Ruan's count of the cargo does not close | 200 |
| Cartographers | 2 | The Fourth Journal | the Ember Stone (#516) | the lower gallery's journal seen, where Fane wrote at the Stone | 500 |
| Cartographers | 3 | Fane's Fire | Meridian Camp (#22) | the fire where the Company ended seen | 800 |
| Compact | 3 | In the Founder's Hand | the Dead-Drop (#22) | an order brought up from below | 800 |

The Fence's rung pays 600 xp, 100 a member, which Wrackholm's budget takes (docs/areas/wrackholm.md
§9). Its paid words say not yet and name nothing below: what lies past the stair's foot is found,
never told.

---

## 9. Main plot: *The Dimming*

One quest, from level 1 to the cap, in five acts down the atlas's road of levels. Nothing on the
road is locked: what turns a company back is the monsters, and the quest spends only a few story
locks (docs/EXPANSION.md §2.2 and §2.3). Each act asks a question and ends on a revelation that
changes what the quest is about, so the long climb never becomes a list of stones to fetch. Every
zone on the road holds at least one step of the quest; two areas are kept off it on purpose, as
the reach. docs/STORY.md tells the whole quest as a story.

| Act | Levels | Areas | The question | Ends on |
|---|---|---|---|---|
| I. Ashes on the Road | 1–10 | the Foreland, Thornmark | Why are the Stones failing? | They are not failing. They are being cut, with Underdeep tools |
| II. The Salt Road | 10–16 | Saltreach, Wrackholm, Sunderwood | Who profits? | Vask is behind the Ashen Hand, and under the world stands a wall no one built |
| III. The Deep Script | 16–22 | the Kilns, Cairnmoor, Rimewater | What are the Stones? | Machines, and people came here with them |
| IV. Beyond the Sky | 22–28 | the Whitespine, Ashfall, the Wold | What is Caldera? | A vessel. The sky is a ceiling |
| V. The Hearth | 28–32 | Hearth Isle, the Underdeep, the Core | What do we do? | The choice |

The Hearth is the quest's measure. Each restored Stone brightens it, in the night sky and on the
title's horizon. It moves only with the story, never with the clock. The Tide Stone, set back on
its plinth at the end of Act II's second chapter, is its first step; the Grove Stone counts once a
Lantern has mended it (#151).

### The captain's line

Queen Isaure was the last of the captain's line. The Custodian answers to the line, and the Hearth
first flickered the night she died because the vessel had lost its captain. That is why Vask needs
the throne empty (§10.1): with nobody to command it, the vessel can be shut down. It is why the
Ashen Hand ships people below: it is finding out whose hands the doors will open for. The line runs
through the whole quest and is never told, only found.

**Wenna of Gullwick** gives the line a face. She is a fisher's daughter taken as cargo, and her name
is in the Cargo Ledger's CARGO BELOW column. The doors below open for her. She leads the others
up through the ice at Rime Lodge (Act III), is taken again at Sheer Point (Act IV), and at the core
the Hand holds her palm to the panel that answers to the line. Freed, she hands the choice to the
company:
*You walked every road of it. You choose.* She is the heir nobody claimed (§10.1), and she
walks the main road, not only the subplot.

Helmstow changes between acts, under Vask's hand, and never for the better: Wardens on the walls, a
curfew bell, the Lantern chapel shut.

### Act I — Ashes on the Road (levels 1–10: the Foreland, Thornmark)

Queen Isaure of Helmstow dies the night the Hearth first flickers. The party, a freshly chartered
company, is on the road when it happens and watches the light stutter across the sea. In the
morning a Rift has opened in a Foreland farmstead. Clearing it is the tutorial. Inside is a dead
Lantern with a cracked survey wand and a note: *the Grove Stone is next.*

Helmstow is in interregnum. The Regent-Warden, **Lord Aumery Vask**, holds the city "until the
succession is settled." He offers the party a Crown contract: find out why the stones are
failing.

The party reaches Thornmark and finds the Grove Stone not failed but **cut**: worked stone, fresh
chisel marks, and a sigil the Lanterns recognise as the **Ashen Hand**, a sect that preaches the
Hearth is a prison and its dimming is the door opening. Restoring the stone is the first real
dungeon. Restoring it closes Thornmark's Rifts.

- **The Foreland** (built): Brandy Hole, whose crates carry the Helmstow customs seal, where the
  smugglers' cargo below was people and the Ashen Deacon was prising the staples from a glowing
  seam. Captain Hale sends the Regent a copy of the smugglers' ledger.
- **Callow Downs:** Ashcombe, past Gullwick, its Rift and the dead Lantern, whose note says *Tell
  Vask nothing*; the party hands Vask her wand anyway. The Queen's barrow, the Berth, has been
  opened, and only her signet is gone. In Gullwick, Wenna's mother asks the party to find her.
  Crowness Light's keeper logged the night the Queen died: the Hearth went out eleven times, and he
  wrote down the gaps between. The coast road west, into Act II, starts here.
- **Thornmark** (built): Thornhold and Elder Sylvane, the Grove Roots and the Cut Stone, the Hand of
  Ash, and the Warden of the Cut with the first Meridian journal.
- **The Deepthorn:** Henlys, the oldest elf-hold, keeps the two-hundred-year-old treaty behind the
  elves' claim to the throne, which says the elves' line and Helmstow's were once one. Its seal is
  the chisel's maintenance mark: the royal line is written in the machine's script.

Turn: the Ashen Hand's cutting tools are Underdeep-made. Somebody is arming them. The Hand's creed
is on the walls from the cellar to the Grove (THE HEARTH IS A CAGE; THE HAND OPENS WHAT THE HEARTH
SHUTS; THE STONE IS A LOCK. WE HAVE THE KEY.), and it gains a line in every act: EVERY SHARD IS A
STEP in the Tide Ship's hold, THE BLOOD OPENS THE DOOR on the sleepers' bay, THE SKY IS A LID on
the Hand's causeway, and the last, carved on the core's door, PUT OUT THE LIGHT, AND THE DOOR WILL
OPEN.

Acts II to IV each restore at least one Stone, each under threat in its own way. With each stone
restored, the Hearth steadies. With each stone restored the party also hears the
Custodian's voice more clearly, and it is not saying the same thing in every region: each region's
god is one of its fragments.

### Act II — The Salt Road (levels 10–16: Saltreach, Wrackholm, Sunderwood)

- **The Upper Water:** the way in, down Kestrel Edge from the Downs. The Salt Compact's river barges
  carry shards and people downriver, and the folk of Rietum saw the Tide Stone go by one night.
- **The Delta:** the Tide Stone's plinth stands empty, and the Drowned Temples have gone dark. The
  Tidefolk's god used to sing the tides; now it only counts, until its Stone comes home and it
  sings again.
- **The Saltings:** Saltmouth, the free port, is the Compact's home and the seat of Jory Tallis,
  the dockmaster claimant (§10.1, §10.2). His forged lineage convinces because it was copied from a
  real crew record, below. The crossing to Wrackholm leaves from here.
- **Wrackholm:** Kelp Hole and the Tide Ship, whose hold carries Wardstone shards and people
  bound for the Dead-Drop, a large dungeon down a stair from the hold. The Compact's orders come
  from there. The Tide Stone comes home.
- **The Eaves and Lanternwood:** the Sunder, a Rift that split a whole wood, which is what a
  Stone's failure looks like at full size. At its floor stands a wall too smooth to be stone.
  Across the gorge, by a rope bridge, is Lantern Watch, where the Lanterns begin to split.

By now word has come down the coast: Hale's copy of the ledger reached the Regent, and Hale has
vanished, his post at the pass held by men nobody knows.

Midpoint, at level 16: the Tide Ship's log names Vask. Every cargo in it went below under the
Helmstow customs seal from the Brandy Hole crates, countersigned by the Regent. He is the Ashen
Hand's patron. He has read the Underdeep's writing and believes it: that the Hearth is a cage and
there is a world beyond the sky. He is not wrong about the facts. He is wrong about what "beyond"
means.

### Act III — The Deep Script (levels 16–22: the Kilns, Cairnmoor, Rimewater)

- **The Iron Fells and the Kilns:** the dwarves cut their own Anvil Stone to sell the shards; the
  party buys it back or takes it, a choice the thane puts in Anvilhall (#434, call 1): buying costs
  about 6,000 gold, taking puts the Anvil Guard on the Stone's approach and shuts Anvilhall's forge
  to the company for good, and either way the Warden of the Anvil must fall for the tear to close
  and the thane never forgives. Kiln-script, which dwarves read, turns out to be a maintenance
  language, and reading it is the act's own mechanic: each inscription read opens more of the map,
  and never the road (call 2). An inscription is a sign with two texts, the marks anyone sees and
  what a reader reads; a reader is a member with Linguist, a dwarf, or a copybook carried; reading
  gives a secret's hint in the machine's own words, finds the Deep Mines' service ladders between
  levels, and marks the machine's mouths (the ice-hole, the bay under Coldmere, the vents) on the
  world map before the company reaches them. Anvilhall's holiest verse, THE FIRE IS KEPT BELOW AND
  NOT ABOVE, is a warning painted on a boiler, and the lowest door of the Deep Mines says CREW ONLY.
  The Deep Mines have broken into the hull's service ways. The Anvil Stone's Rift is the last on the
  road, hand-built (call 3).
- **Kilnmouth:** Kilnhaven, the ore port, whose ship is one way to the far side of the sea, and
  whose ferry runs back to Saltmouth; the drove road's coach runs from it to Rime Lodge (call 9).
- **High Moor and the Cairnfield:** a ring of stones older than the Wardstones, the first emitters,
  dead for centuries, with the cairns around it. The Custodian's oldest voice still speaks there,
  in the dark inside the ring, and asks the crew to report.
- **Longmere:** some of Brandy Hole's cargo come back up through the ice at Rime Lodge, a few a
  night over four nights, each night a rest at the lodge's inn (#434, call 5). The doors below
  opened for some of them and not for others: the captain's line, tested on its victims. Wenna,
  whom the doors know, led them up, the last one out on the fourth night. The way they came up is
  the way down. The lodge is the Lanterns' fourth hall (§8). Cairnmoor behind it has no town: the
  Watcher's Hut and the piper's fire by the tarn are camps (call 9).
- **Coldmere:** a sealed bay under the frozen lake, a dungeon of two levels (the Sleepers' Bay,
  call 6), opened by Wenna's hand and by nothing else: the act's one story lock (call 4). She waits
  at the door. Inside, rows of sleepers who never woke have faces like the party's own. Every
  people of Caldera lies there: the races came in the ship.

### Act IV — Beyond the Sky (levels 22–28: the Whitespine, Ashfall, the Wold)

- **Monks' Vale and the High Spine:** the Peak Stone is fine, but something wears the monks who
  guard it. The monks died long ago, and the Custodian's own hands keep the monastery in their
  robes. Its bells ring the eleven flickers of Crowness Light's log, the Hearth's pulse, rung by a
  machine that was told to ring them and never told to stop.
- **Sheer Point:** its tip reaches toward the Hearth, and the Ashen Hand is building its crossing
  there: a causeway out over the water, built from the smuggled shards. It is reached along the
  High Spine's crest from the Peak Stone (#443, call 3). The party sees where the end will come, an
  act early, and watches the Hand take Wenna out along it: Wenna is a person who moves, at the lodge,
  then at the monastery's gate, then at the camp on the point's shore, never in a fight, and the
  first rest at that camp is the night she is taken.
- **The Giants' Stair:** the road over the High Spine and down the far side of the range into
  Ashfall, past the giants who gave it its name, who ask a toll before they fight. The giants came
  in the ship awake (call 1): the crew that built the inside, the heavy hands who raised the ranges
  and set the Stones, never cargo, so they lie in no bay and are in no count. They stayed on the
  mountain when the rest were put to sleep; the Stair is the service ramp they were posted to keep,
  and the toll the order they were given, kept four hundred years. The Stair-king's words hint it
  and never say it. Kilnhaven's ship over the sea is the other way, and Ashfall may be begun by it
  (call 6).
- **Cindercoast:** Cinderport, the far side's port, where the last crossing leaves; the
  Cartographers' and the Compact's second halls (§8); the Riders come down to trade outside its
  gate, and a Rider carries a company to their camp and back (call 5).
- **The Wold:** the Riders remember the day the sky opened and the land burned, and they keep the
  only way into the Glass (the reach, below). They are the warning against arriving, in person.
- **Fire Mountain:** the volcano's vents are the Underdeep's exhaust and the way down for the Ember
  Stone's parts. They lead down to Meridian Camp, the Meridian Company's last camp and a large
  dungeon of its own, three levels of 32 by 32 (the vents, the iron corridors, the camp; #443, call
  4), where their cartographer, Oriel Fane, is still alive, and to a room with a window.
- **The Ember Waste:** the Ember Stone was never finished. The party completes it with three parts
  from below (call 2): one at the vents' first level, one in Old Cinder's undercroft, one at the
  iron corridors' end, never from the camp's bottom, so the window and the map stay the Lost
  Expedition's. Finishing it is a hand-in, not a lock: Act IV spends none. The Underdeep notices.

### Act V — The Hearth (levels 28–32: Hearth Isle, the Underdeep, the Core)

From Cinderport the party crosses to the Hearth Isle. The final dungeon descends from a temple,
through the Underdeep, into the reactor core. There are two ways in. The Hand came by its causeway
and the service ways, through doors that know a hand of the line, because it had Wenna's. The
company comes through the core's door at the Stair's foot, which opens only for whoever set the
five Stones right on the road (the Tide Stone home, the Grove closed, the Anvil's tear closed, the
Peak Stone stood beside and the Ember Stone lit): the one story lock the road is sure to spend. The
Hand went in by a door of its own beside it, which opened for Wenna's hand and is shut behind it.
The Grove's mending brightens the Hearth and opens nothing. Vask is there with the Ashen Hand,
halfway through the shutdown sequence, the Queen's signet on his finger and Wenna's palm held flat
to the panel. When the Hand is broken, the Custodian, whole for the first time, speaks with one
voice:

*The voyage is over. It has been over for four hundred years. The vessel is in orbit around the
world it was sent to. Arrival was never triggered because the crew who could trigger it forgot
they were crew.*

Wenna takes the signet from Vask's hand, and gives the choice to the company.

### The choice

- **Reignite** the Hearth. Caldera stays sealed and safe. Vask is stopped. The world you spent
  the game mapping is the world you keep. Standard "good" ending; the Wardens and Lanterns
  approve.
- **Arrive.** Open the hull. The Rifts stop for good because there is nothing left to hold out.
  The sky changes. The ending is a walk out of the Underdeep into daylight that is the wrong
  colour. Cartographers and the Salt Compact approve; the Lanterns split.
- **Hidden third:** if the player completed *The Lost Expedition* (§10.3), they know the
  Custodian is lying about one thing: the vessel is not in orbit yet. They can force it to
  finish the voyage, and the ending is a promise instead of a result.

A clean three-way choice: nothing else on the road changes what is offered. The throne and the
Compact change who stands with the party at the core, not what it may choose.

The game goes on after it. The ending's pages are shown as the answer is taken. Then the world is
changed: the Hearth on the title, in the night sky and in the almanac; Helmstow's gate open; each
hall's word. Nothing closes, and in every ending the company walks Wenna home to Gullwick (#739,
call 6).

### The reach

Two areas are kept off the quest on purpose: country at the very top of the game, for the company
that wants more than the story asks, around complex super dungeons of many levels. The quest never
needs them, and no ending depends on them. The monsters are their only gate, and they spend no
story locks.

They are out of the way as well as off the quest. Each is a dead end with a single way in, so the
road never runs through one, and a company is only ever in the reach because it went there. The
converse holds too: everything on the road belongs to the quest.

- **The Glass:** the desert behind the Wold, in the far west. A lava flow closes it off from the
  Ember Waste, so the Wold Riders keep its only way in. The Glass is what the day the sky opened
  left, and its super dungeon is the Buried Tower: the mast of a lander that tried to arrive, sunk
  in the glass it made, its decks running down into the ground it melted.
- **Glacier Foot and the Vault:** Rimewater's south-eastern lobe, off Longmere, where the glacier
  comes down from the rim. At its head the sky comes down to meet the ice, the one place a company
  can climb into the Vault, the inside of the sky, where the lights that make the sun and the moon
  hang in the dark. The Ice Caves are the first of its dungeons.
  Its way in lies in country of band 20, so it is the reach a company sees long before it can take
  it.

The two go opposite ways: the Buried Tower down into the ground, the Vault up into the sky.

The reach sits at the cap and is harder than the Core: its dungeons' bands are 30–32, whatever the
atlas's rows said before (docs/MONSTERS.md §12, open question 3; #434, call 7). Its power comes from
what it holds (artifacts, any Masters of §5 it hides beyond the road's two, the richest shrines and
fountains) rather than from more levels, so the quest still runs from level 1 to the cap. The
bounds' eight artifacts (below) are their areas' and not the reach's, which keeps its own, the
Buried Tower's and the Vault's (#56's 62 and 63). The reach is open before the choice: the Core
waits.

Two Masters stand on the road and not in the reach, each found and never told (§5): the Wold's old
Rider at arms (#858) and Old Cinder's scholar in magic (#859). The Rider is hidden in the rock of
D10's small mesa, with a rumour at Akordu and a bow to fetch (docs/areas/glasswold.md §6). The
scholar is hidden behind a secret door in the buried town, with a rumour from F11's hermit and a
roll to fetch (docs/areas/ashfall.md §6). The reach may hold more.

Decided by the owner's delegate for #18, each the owner's to overturn:

1. The road holds two Masters, one to a line, each off the road and off the quest, with a rumour in
   the area's own words and a favour found in a hidden place of the same area; the reach's stay the
   reach's, and the reach may hold more.

### Enclaves

Beside the road, each area keeps places of its own: enclaves of higher-level monsters with unique
rewards, the deepest of them artifact lairs at the cap (the owner, 17 October 2026; #828). An enclave
is a dungeon entered from a box (a hollow, a cave, a ruin), held to its own band: a band or two over
its box's, and the cap's, 30–32, for a lair. Like the reach it is off the quest: no step lies in it,
and the road never needs it. Unlike the reach it is a door beside the road, often met long before a
company can take it, so its danger is said at its door: crossing in, the log gives its name and band,
as its sign does inside, and says how it feels by the company's level, as a border does: harder one
or two levels under its floor, a plain warning three or more under, nothing at its floor. The monsters
are its only gate. EXPANSION.md §5.2 holds it to its own band (#845).

### The bounds' eight

From the owner, 17 October 2026: one artifact to each of the eight areas the bounds build out
(#828), each with a power of its own, guarded in a lair at the cap and first heard of as a rumour.
They are their areas' and not the reach's: off the quest as the reach is, and the game is whole
without them. Designed in #846 to the direction of the owner's delegate (18 October 2026, on #828):
#847 built the mark and the powers, in two halves, the first the mark and the three whose kinds were
built (the Telstok, the Erzhemd and Akkush, then defined and placed nowhere), the second the three
kinds not yet built and the other five (#921). Each area's issue (#830 to #837) builds the lair,
its door and the rumour, and the creatures lane the guardians (docs/MONSTERS.md §13): all eight
lie in their lairs, named in the table below. Each area's doc has its own under §6.

**What an artifact is.** An item marked so (`ItemDef.artifact`, #847): one in the world, found in its
lair and never sold, with no price in any window: no shop stocks one or takes one, and the windows
pass it by its mark (EXPANSION §5.2). Its numbers are one rung over the Hand's steel at 28 (EXPANSION
§5.2): a point past the Hand's piece of its kind in its bonus or its armour class, as each rung is
a point past the last, and no plus to hit; a thing carried has none. It has one power, of one of
the five kinds below, and no `resist` or `skill`: no artifact does a skill's work, and none opens a
lock, maps, swims, climbs or crosses the void, since the map is opened by walking, by the skills
and by the map spells, which are shortcuts and never keys (§1, §7). No gate figure moves: the
gate's company is dressed from the ladder (EXPANSION §5.2), and no artifact is on it.

**The five kinds, and no sixth.** One power to an artifact, and each kind on one or two of the
eight. #847 built the three new kinds (#921) and holds every bound here as a named constant (the
raise's, `ARTIFACT_RAISE`, with its first half; with its second the castings', `ARTIFACT_CASTINGS`,
the level a spell from an artifact rolls at, `ARTIFACT_LEVEL`, regeneration's share, `REGEN_PART`,
and the conditions a ward may keep off, `WARDABLE`).

1. **A stat raised while borne** (`ItemDef.stat`, built, #855): one of the four stats a fight reads
   (might, accuracy, speed, personality: §5), by 5 at most, where the found items raise by 3. Borne
   as `borne` has it, worn where the piece has a slot and in the bearer's own pack where it has
   none; a save holds no raise. Raises add, as `statOf` sums them, but two pieces of one slot are
   never worn together, so none stacks today: the Runner's Coat takes the Erzhemd's slot and the
   Talon Knife Akkush's.
2. **An element its blows carry** (`ItemDef.element`, built, #855): a weapon's alone, an added 1d6
   of the element on each blow that lands (`ELEMENT_DIE`, §6), as the found weapons have it.
3. **A spell cast from it so many times a day** (`ItemDef.casts`, built, #921): one spell of the
   tables (§7) and one to three castings. The bearer casts it as a spell of their own (#847 gives a
   member with no spells the way to), in a fight or out as the spell's context allows: it takes
   their turn, costs no spell points and spends a charge; it rolls at the bearer's level held at 10,
   unranked, with no tier, trait or song added. The charges come back whole when the clock passes
   dawn, slept or not, and the save keeps those spent. The spell is of a list the bearer's class
   cannot cast, so the artifact's classes leave out every class that casts from that list; and it is
   no spell whose `context` is `'explore'`, the spells that make the world bigger: the druid's
   Foxfire and Hawk's Eye as much as §7's six (Light, Wizard Eye, Town Portal, Walk on Water,
   Waymark, Levitate).
4. **Regeneration** (`ItemDef.regen`, built, #921): while it is borne, the bearer mends a tenth of
   their most hit points, rounded down and at least 1, each time the clock passes a whole hour,
   never past the most; a passage of hours (a rest, a crossing) mends a tenth for each hour. That is
   a tenth for about ten steps outdoors, or thirty in a town or below. The rate is the trolls' tenth
   (MONSTERS §3.3), paid by the hour and never in a fight, whose rounds pass no clock; and as a
   felled troll stays down, it never mends the down (unconscious, dead or stoned: `isDown`). Nothing
   is saved.
5. **A ward against one condition** (`ItemDef.ward`, built, #921): while it is borne, the
   bearer never takes it, as a trait's immunity works (`immune`, `src/game/party/tables.ts`): one of
   asleep, poisoned, diseased, paralysed, cursed or stoned, never unconscious or dead. It keeps
   the condition off and lifts none already taken: the cure is still a spell's, a temple's or
   time's (§6).

**The eight:** two wards, two spells, two stats, one element and one regeneration.

| Artifact | Area | Slot; who may bear it | Numbers | Power | Lair, its door; guardian |
|---|---|---|---|---|---|
| the Hagstone | the Foreland | carried; any of the ten | none | a ward: never paralysed | Hag Hole, the sea cave behind a mouth in the cliff at E4's 3,6; the Hag |
| the Telstok | Saltreach | a staff; cleric, sorcerer, druid, monk | 1d10+14, two-handed | an element: holy | Sjongwierde, the drowned mound in the fen, down the stair in its crown at A5's 26,23; the Old Chanter |
| Holdfast | Wrackholm | a light weapon; thief, bard, sorcerer | 1d8+15 | a spell: Grasping Roots, three a day | Nick's Locker, the sea cave under the reef at F5's 16,30; Old Nick |
| the Erzhemd | the Kilns | armour; knight, paladin, ranger, thief, barbarian, bard, druid | armour 15 | a stat: speed +5 | the Randzeche, the old working behind an adit in the rim's foot at P5's 11,23; the Steiger |
| Torhide | Cairnmoor | a shield; knight, paladin, ranger | armour 9 | regeneration | Bearn Liath, the cleft in the rim's face at P7's 5,24; the Rim Troll |
| the Wakerobe | Rimewater, with the Whitespine | a robe; cleric, sorcerer, druid, monk | armour 14 | a ward: never asleep | the Spittal, the brothers' house under the pass, its door in the rim's face at K12's 2,15; the Infirmarer |
| Akkush | the Glasswold | a bow; ranger | 1d12+14, ranged, two-handed | a stat: accuracy +5 | Kushdag, the eyrie off a shelf in the Scarp's face at D7's 19,24; the Foal-taker |
| Grim's Axe | Ashfall | an axe; knight, paladin, ranger, barbarian | 2d12+8, two-handed | a spell: Meteor Swarm, two a day | Grim's Howe, the warlord's grave under the flow's dam at F12's 20,14; the Grave Drake |

Each number is the Hand's piece of its kind and a point: the Grey Staff 1d10+13, the Grey Knife
1d8+14, the Grey Mail 14, the Grey Shield 8, the Grey Robe 13, the Grey Bow 1d12+13 and the Grey
Axe 2d12+7. Both spells are of a list that no class bearing them casts: Grasping Roots the druid's,
Meteor Swarm the sorcerer's.

**Who may bear which.** Each class may bear three at least, and the Hagstone alone is all ten's;
the knight's and the sorcerer's share the stone and nothing else.

| Class | May bear |
|---|---|
| Knight, Paladin | the Hagstone, the Erzhemd, Torhide, Grim's Axe |
| Ranger | the Hagstone, the Erzhemd, Torhide, Akkush, Grim's Axe |
| Barbarian | the Hagstone, the Erzhemd, Grim's Axe |
| Thief, Bard | the Hagstone, Holdfast, the Erzhemd |
| Cleric | the Hagstone, the Telstok, the Wakerobe |
| Sorcerer | the Hagstone, the Telstok, Holdfast, the Wakerobe |
| Druid | the Hagstone, the Telstok, the Erzhemd, the Wakerobe |
| Monk | the Hagstone, the Telstok, the Wakerobe |

**Their words and their rumours.** The two lines are each piece's own words, read from the pack
(its `text`, as the Old Lantern's Staff has: Space on it there shows them, a piece with a slot as it
is taken up); STORY.md has them too. Each rumour is two lines, words
only, said by a person of the artifact's own area at a meeting after their first, as F11's hermit
says the Master of magic's (docs/areas/ashfall.md §6): no flag, no quest, no line in the journal
and nothing marked on the world map. It hints at the thing and never names where it lies.

- **The Hagstone.** *A stone off the strand, a hole the sea wore through it and a cord gone green. /
  Held to the eye, the hole shows the dark as only dark.* The old man mending nets at Gullwick (F3):
  *My gran had a stone with a hole worn through it. Nothing sat on her chest of a night, she said,
  and nothing held her. / She was buried without it, and nobody would say where it went.*
- **The Telstok.** *A staff of black bog oak, its foot worn round on a stone floor. / Struck on
  stone, it rings like a bell under water.* Hiltje, the withy-cutter of Rietum (B3): *Before the
  temples there was a priest who sang and never counted. When her staff struck the floor, the dead
  lay down. / The water came up over her mound, and she sang it in.*
- **Holdfast.** *A smuggler's knife, its haft wound with kelp that has not rotted. / Wet, the weed
  on it moves.* Merryn, the hermit on the east rocks (F6): *One ship I counted in and never out.
  Her master had a knife the weed obeyed: cut a line with it and the kelp held her fast. / Old Nick
  had ship, master and knife. Nick gives nothing back.*
- **The Erzhemd.** *A shirt of mail in rings darker than iron, and no heavier than wool. / Inside the
  collar a smith's mark is cut, and a knocker's eye beside it.* The oldest miner at Anvilhall:
  *Brandt made a shirt of the ore the knockers bring up. So light, he said, his feet forgot it. / He
  went down for more. We sang him to the door, and nobody sang him back.*
- **Torhide.** *A round shield faced with grey hide, and every cut in it closed over. / It is warm to
  hold, and warmer by night.* The drover on N7: *My grandfather's grandfather faced a shield with a
  troll's hide. Cut it how you liked, by morning it had closed. / He took it up to the tops when he
  was old, and the tops kept him.*
- **The Wakerobe.** *A grey robe made for someone taller and thinner, the sleeves past your fingers.
  / Whoever wore it last walked out of the ice in it, and did not lie down again.* The lodge-keeper
  in from the ice at Rime Lodge, who takes in whoever comes up through the hole: *One came up
  through the ice in a grey robe too long in the arm. He would not take a blanket, nor sleep, nor
  say where he had been. / The third night he walked out into the snow. It was not his robe, I
  think.*
- **Akkush.** *A Rider's bow of white horn and sinew, its grip worn to one hand. / Bound under the
  grip is a feather longer than your arm.* The eldest at Akordu: *My grandmother's brother made a
  bow of white horn that never missed. He loosed it once, at the bird that takes our foals. / The
  bird took him, and the bow. It still comes for foals.*
- **Grim's Axe.** *A broad axe of black iron, its edge as warm as a hearthstone. / Grim is cut in
  its cheek, and under the name a smoking mountain.* Petroc, the warlord's heir, at Grimsforge:
  *Grim's axe was made at this anvil. When he lifted it, the mountain threw its stones for him. /
  They buried him with it, and the mountain closed the grave.*

**The lairs.** Each is one or two levels entered from the box its area's issue names, at the cap's
band, 30–32, held to it as #845 holds an enclave to its own. Its guardian is one monster, a boss at
32 judged at the lair's floor of 30 (#845); each is a new kind in a family already drawn, eight
families for the eight and none of them new (docs/MONSTERS.md §13). Its other groups, its squares and
its name are its brief's, in its area's issue.

Decided by the builder for #846, each the owner's to overturn:

1. **The names** (NAMES §5): in the area's own tongue where its people have one, in its English
   where they speak it or its finds are English-named. Each says one plain thing about its piece
   and hints, as the found items' names do (the Levin Mace, the Runner's Coat); none explains.
2. **The kinds:** the wards against paralysis and sleep, the conditions the cap's monsters put on a
   company most (the Grey Hand and the catcher; the keeper and the hearth moth); the stat and the
   spell twice; the element and regeneration once.
3. **The slots:** four weapons (a staff, a knife, a bow, an axe), two armours (a mail and a robe), a
   shield and a carried thing. Each takes its Hand's piece's classes, but the staff, the knife and
   the robe, anyone's on the ladder, are cut to their users, so the stone alone is all ten's.
4. **The numbers:** the Hand's piece and a point, with no `plus`, since a plus adds to hit as well
   and would be a second step.
5. **A stat by 5,** the bound: a stat counts by threes (`bonus`), so 3 is one step and 5 two for
   two bases in three. Speed on the mail, since its seven classes all fight by it and only the
   melee by might; accuracy on the bow, the Riders' drill.
6. **The castings:** Grasping Roots three a day, a hold a group may tear free of; Meteor Swarm two,
   fire on every foe.
7. **A spell from an artifact** rolls unranked at the level held at 10 and costs a charge, not spell
   points. It is never a spell whose `context` is `'explore'`: those make the world bigger and carry
   a company, the druid's Foxfire and Hawk's Eye as much as the sorcerer's six.
8. **Regeneration by the clock's hour,** departing from the direction's "a tick": read literally, a
   tick is a step, and a tenth a step would mend a bearer whole in ten steps outdoors, so no wound
   would outlast the walk to the next fight. The hour keeps the late game asking and ties mending to
   the clock (pillar 4): the trolls' tenth, paid by the hour and not by the round. A bearer who is
   down (unconscious, dead or stoned) mends nothing.
9. **A ward keeps a condition off** and lifts none already taken, so a cure keeps its work.
10. **The element is holy,** the drowned god's: half again on the dead and nothing on a machine, so
    the Core and the Buried Tower ask different things of its bearer.
11. **The rumours** are said by people already met, two lines more after their first meeting, as
    F11's hermit says his: no person is added for them.
12. **The doors:** the sea caves on strands, the Foreland's E4 and Wrackholm's F5 by the hermit's
    point; the rim for the Kilns (P5, the largest box under it) and Cairnmoor (P7); Saltreach's in
    the fen (A5), Rimewater's on Monks' Vale's part of K12, the Glasswold's on its Scarp (D7) and
    Ashfall's in its one box (F12).
13. **The guardians:** eight families, every one drawn already, so no new family is named. The sea
    caves take long bodies and devilfish, and the lairs on the rim and the pass the ogre and the
    keepers, as the direction's examples do; a lair under the rim takes the family its place has
    already (the Kilns' knockers, Ashfall's drakes, Saltreach's drowned dead), and the Wold's
    eyrie a bird. Each is a boss at 32, as the road's bosses stand at their bands' tops.
14. **Each guardian answers its artifact where it can:** the Hag holds where the stone wards, the
    Infirmarer puts to sleep where the robe wards, the Rim Troll mends as Torhide does.
15. **The monk** may wear the Wakerobe and give up Unarmoured Defence for the ward; the stone's ward
    is one Stillness gives it already, so the staff and the robe are the monk's.
16. **The lairs' names,** squares and other groups are each lair's brief's.

A ward gives nothing to a class that has it already (the stone's to the monk, whose Stillness keeps
paralysis off, and the robe's to the sorcerer, whose Iron Will keeps sleep off): the lists say who
may bear an artifact, not who gains most by it.

---

## 10. Subplots

Each subplot spans the whole game, is optional, touches at least three regions, and changes the
main plot's texture rather than its rails.

### 10.1 The Empty Throne

*Oblivion's "find the heir," inverted: everyone claims to be one.*

Three claimants to Helmstow: the Queen's cousin (backed by the Wardens), a Thornmark elf-hold
that holds a two-hundred-year-old treaty saying the elves' line and Helmstow's were once one (backed
by the Lanterns), and Jory Tallis, a Saltreach dockmaster with a forged lineage and the only navy
(backed by the Compact). Vask needs the throne empty.

The party gathers evidence across four regions, can be bribed by any side, and eventually
presents a case to the Council of Helmstow. Whoever wins changes Helmstow's shops, trainers, prices
and guard behaviour for the rest of the game, and decides who is at the Hearth in Act V to help
or hinder.

The captain's line (§9) makes the throne more than Helmstow's: whoever carries the line is who the
Custodian answers to. Every claim touches the machine: the dockmaster's forgery convinces because
it was copied from a real crew record, the elf-hold's treaty carries the maintenance mark, and the
cousin's claim is blood, which is what the doors below test. The Queen's missing signet is evidence
all three sides want. And there is a fourth, who claims nothing: Wenna of Gullwick, whose hand the
doors know (§9). The case before the Council can be made for her, for any of the three, or for
nobody. The Council sits once, in the keep's chapel. A case is carried by two of the claimant's
pieces, or by the signet, and a case for nobody always carries. The winner's people hold the stair
to the core (#739, call 10).

**Payoff:** the throne subplot is the only way to remove Vask from Helmstow *before* Act V, which
weakens the Ashen Hand's presence in the final dungeon.

### 10.2 The Salt Compact

*The thieves' guild line. A Light/Dark path without a morality meter.*

The Compact runs Saltreach's smuggling and quietly feeds half of Caldera. The questline is a slow
reveal that the Compact's founder has been dead for a decade and its "orders" now come from the
Dead-Drop, a large dungeon below the Tide Ship's hold, three levels of 32 by 32 (#22; #443, call
4). Somebody down there has been running the smugglers, and what they have been smuggling is
Wardstone shards. The writer is the Tallymaster, a keeper that counts the cargo and writes in the
dead founder's hand what the Hand dictates: the Tidefolk's god only counts (§9) because this is
where its fragment has been counting.

The Tallymaster's orders, stolen from its out-tray and carried up, open the guild's last rank, and
Ruan puts the choice in the Keel at Saltmouth, not below (#22). It ends with a choice: take over
the Compact and redirect it (the last crossing is free for a Partner, both ways, and its runner on
the strand has word of the isle), or hand it to the Wardens (the sea lanes are theirs, and the
Hand's boats stop coming over) (#739; docs/areas/hearth.md §6).

### 10.3 The Lost Expedition

*The completionist's subplot. For the player who reads every note.*

Thirty years ago the Cartographers' Guild sent the *Meridian Company* to map the Underdeep. They
never came back. Their journals are scattered through every region's deepest dungeon, and each
one is a hint to a secret square somewhere else (a wall that isn't, a lake that can be walked on
at night, a monastery bell that opens a door).

Following the trail leads down Fire Mountain's vents to Meridian Camp, the Meridian Company's
last camp and a large dungeon of its own, where their cartographer, Oriel Fane, is still alive and
very old, with their real map: the hull. The map shows what the Custodian will not say in Act V
(§9, hidden third ending), and bringing it out is the Ranger's third prestige quest (§5). Fane
gives it at the first meeting, and the giving, not the map held, is the expedition completed; the
map has nothing a player can read, so the hidden third is earned at the Core (#22).

---

## 11. Presentation

- **Viewport:** first person, four squares deep and three to each side, seven across (`VIEW_DEPTH`,
  `VIEW_LATERAL`, `src/game/world/sight.ts`), with depth-layered walls and doors, buildings under
  their roofs, tents, hills that hide what lies behind them from lower ground, billboards and the
  sky with its sun, moon, stars and clouds; the weather over it all; landmarks standing over the
  land out to 40 squares (`LANDMARK_REACH`, `src/ui/view/compositor.ts`); and where nothing is
  built, the void drawn as the ground the world map paints there. Drawn from vector shapes at
  runtime, not bitmaps, so it scales and re-skins cheaply (see §13).
- **Frame:** the status strip at the top right (the facing, the time and the place; the date and the
  sky), the automap under it with its compass rose, the purse under that (gold and food), the
  party's portraits with condition faces along the bottom and the message log over the foot of the
  view, a strip of four lines and five in a fight (`LOG_LINES`, `COMBAT_LOG_LINES`).
- **Menus:** one cursor serves every list (`ListMenu`, `src/ui/menu.ts`). It goes round, up from the
  first row to the last and down from the last to the first. A barred row is drawn dim: the cursor
  stands on it as on any, and nothing chooses it. A digit names the row numbered so, its place from
  the top (`pickMember` writes it: "1. Bram"), or in the spell picker's casters the member's place
  in the party. It moves the cursor there and, on a menu that acts by its digits (a question's
  answers, the fight's commands and the casters), chooses the row as Space would; on the fight's
  list of members for an item or a spell it only moves, and the other lists take no digit. On the
  sheet a digit turns to that member, and exploring it opens their sheet. A menu a choice opens
  again (a business's first menu, a hall's work, its skills and who would learn one, a spell hall's
  spells, a trainer's members, its Expert's and a Master's, a shop's Buy and Sell lists) opens on
  the row it left, held to the rows it has now, so where that row has gone the cursor is on the one
  after it. A menu a choice opens anew starts at its top.
- **The order:** on the sheet X asks with whom the member changes places, chosen by a digit or by
  the arrows round the cards and Space, and Esc or X again asks no more (`changePlaces`,
  `src/game/party/order.ts`). Only the two places change, across the rows and the fallen too; it
  costs no time, is not offered in a fight and the save keeps it.
- **Monsters:** front-facing paintings: 160 kinds, drawn by 28 family modules in `src/ui/monsters/`
  that each register the kinds they draw. A drawing breathes in a slow bob and flashes white when
  it is hit; there is no attack frame and no death frame, and a monster that dies is no longer
  drawn. The bandit, cultist and skeleton families stand on the game's own humanoid frame,
  `src/ui/monsters/kit/figure.ts`; the engine's paper-doll rig is not used (§13).
- **Audio:** none built. The game makes no sound, and the engine's synth is vendored and unused
  (§13). If sound is added, the aim stands: synth music per region and time of day and procedural
  effects, with no recorded assets.
- **Text:** terse. Two lines per event is the aim, three the most (docs/EXPANSION.md §5.4).
  Journals, books and the endings' pages are the long-form exception.

---

## 12. Scope tiers

| Tier | Contents | Purpose |
|---|---|---|
| **M0 — Vertical slice** | Helmstow, one Foreland outdoor map, one dungeon, one Rift; full party creation; combat; four spells per class; save/load; automap. | Prove the feel. Ship nothing else until this is fun. |
| **M1 — Act I** | The Foreland and Thornmark complete, the Downs and the Deepthorn with them; the first guilds and their quests; the Grove Stone dungeon. | First real playthrough. |
| **M2 — Acts II to IV** | Saltreach to the Wold and their Wardstones; the rest of the guilds; the first and second prestiges, and the eight third prestiges whose trainers live in Acts II to IV's country (#448; #443, call 8); Meridian Camp and the Dead-Drop; the ship. | The open world. |
| **M3 — Act V + subplots** | Hearth Isle, the Underdeep and the Core, all endings, all three subplots' ends and the Cleric's and the Sorcerer's third prestiges; with them what levels 11 to 32 need (#18): the weapon and magic tiers and their two Masters on the road, the twelve secondary skills and the eight found items (§5). | Content complete: built on main (Act V merged on 15 October 2026). The owner's own playthrough is what remains before v1 is called done (README.md). |
| **M3 — The pilot** | The autoplay mode (#713, docs/PILOT.md): a fair pilot, built to play the one quest from the title to the ending's choice, taking the player's own game only when asked; left alone, the title plays one of its own and saves nothing. On main it finishes the Foreland's chapter (The Quiet Farm) on most seeds and stops lost in Thornmark's; the ten chapters after are not reached (docs/PILOT.md, Known limits). | Watch the game play itself. Pillar 1 stands for the player (§1). |
| **The reach** | The Glass and Glacier Foot, with the Buried Tower and the Vault (§9) and their artifacts; #56's 62 and 63. | Optional by design: the game is whole without it. Post-v1, not filed: v1 ships without it. Decided by the owner's delegate, 16 October 2026 (#18). |
| **Stretch** | New Game+, seeded Rift daily runs, second party mode, Arcomage-style tavern game. | Only after M3 ships. |

From M1 on, each area is built as a core and country (§4, docs/EXPANSION.md §2.1): its core
first, then the country along the road from the last area's core, then the rest of its land.

Decided by the owner's delegate for #18, each the owner's to overturn:

1. The reach's row keeps its artifacts and loses the skill tiers and the Masters, which #18 built
   (#852, #858, #859); M3's row no longer calls the Masters post-v1 and names what #18 built (#866).

---

## 13. Technical notes

- **Stack:** strict TypeScript, canvas, no runtime dependencies, esbuild-on-request dev server,
  same as the sibling games. `game-engine` is vendored into `src/lib/` with `git subtree`, per
  `game-engine/docs/VENDORING.md`. `src/lib/` is never edited here: a fault in it is fixed upstream
  and pulled in.
- **From the engine:** the fixed-timestep loop, deterministic RNG (seeded per save so Rifts and
  loot are reproducible), text layout with its pixel font and the canvas, from `src/lib/engine/`;
  the palette, shape and cel-shading helpers, from `src/lib/art/`. Vendored and imported by
  nothing: the rig the cel helpers were written for (five files of `src/lib/art/`), the audio
  (`src/lib/audio/`: the synth, the sequencer and the effects) and `src/lib/engine/math.ts` and
  `src/lib/engine/trig.ts`, which nothing but the rig takes.
- **Not from the engine:** netcode. This is single-player; `src/lib/net/` is vendored and imported
  by nothing.
- **New, game-owned:** the grid viewport compositor, map format, turn-based combat resolver,
  quest state machine, save format, Rift generator and the shape of the content: what a map, a
  monster, an item, a spell and a quest are.
- **Content is TypeScript, in `src/content/`:** maps, monsters, items, quests and dialogue, one
  folder per area (`src/content/areas/<area>/`), merged in road order by `src/content/index.ts`; the
  spells and the items no area owns sit at the root of `src/content/`. Not JSON: the type checker is
  the best content check there is, so a monster with no drawing, a business with no room or a map in
  a region no area has fails it. The monster, item, spell and quest tables and the climates have
  moved out of `src/game/`; the races and classes, with their traits and starting kits, stay in
  `src/game/party/tables.ts` as rules, which no area adds to.
- **Determinism:** combat and Rift generation are pure functions of (state, seed). This gives us
  replayable bug reports: the seed replays the game, a random company drawn from it as well
  (`Game.newRandomGame`, `src/app/game.ts`). The generator is the game's own, one to a `Game`
  (`src/game/rng.ts`, the singleton's draws), until game-engine's `makeRng` gives up its state, an
  upstream change: `src/lib` is not edited here.

---

## 14. Open questions

1. Grid size: 16×16 dungeons feel right; are 32×32 outdoor maps big enough to feel like
   Xeen, or do we want 64×64 with sparser content? *Answered by the zone maps: the outdoors is one
   map of 512×384 squares, built from 32×32 zone maps, dense in each area's core and sparser in its
   country (§4, docs/EXPANSION.md §2.1).*
2. Real-time monster approach on the map versus fully turn-based movement outdoors.
   Xeen does the former; it is tenser. Needs the slice to decide.
3. Permadeath option at character creation? Cheap to add, changes the temple economy.
4. How much of the secret is discoverable in Act 1 for a player who goes straight down?
   The design says "all of it, if you can survive," but we should check that this does not
   deflate Act 3. *Answered by the road (§9): the deep truths lie in dangerous country, so a
   company that pushes ahead early finds a mystery, not a spoiler. The gate check
   (docs/EXPANSION.md §5.2) keeps it so.*
