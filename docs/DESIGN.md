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
   differentiation, secondary skills that open the map, and promotions earned through factions.
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

---

## 2. Inspirations

### From Might and Magic I–V (take)

| Take | Why |
|---|---|
| Six-character party, first-person grid, 90° turns | The feel the player remembers. Non-negotiable. |
| Open world with geographic difficulty | The series' most-loved trait across all entries. |
| Secondary skills (Mountaineer, Pathfinder, Swimmer, Cartographer…) | Skills that *open the map* are the best skills. |
| Hirelings / temporary party members | Cheap variety, story hooks, and a use for gold. |
| Spell guilds, spell purchase, per-class spell lists | Makes towns matter and gold meaningful. |
| Day/night, food, conditions (poison, disease, stone…) | Attrition that makes town trips a decision. |
| Class promotion quests (VII) | Direction inside an open world. |
| The sci-fi reveal | The franchise's identity. |
| Timed respawn of cleared areas | Keeps the world alive without infinite grind. |

### From Might and Magic (leave)

- Typed-answer end puzzles (II), cryptograms, timers on riddles.
- Wireframe-era encounter rates; graph paper.
- Real-time toggles and free movement (VI–IX). Wrong branch of the family for this game.
- Playable dragons and recruited-only parties (VIII). Fun once; hollow as a foundation.
- Always-online DRM and a small world (X).

### From Oblivion (take, adapted to the grid)

| Oblivion | Our version |
|---|---|
| Oblivion gates spawning across the world | **Rifts** open near dead Wardstones and spread. Repeatable, template-built mini-dungeons that stop when the region's Wardstone is restored. |
| Emperor dies in the prologue; find the heir | The Queen dies in the prologue; **the succession is a subplot**, not the main plot. |
| Fighters/Mages/Thieves/Dark Brotherhood questlines | **Four Charters** (§8), each a full questline with its own arc and reward, and each the promotion path for a class pair. |
| Fame / Infamy, faction disposition | **Standing** per faction and region. Gates trainers, prices, and who will talk to you. |
| NPC schedules, shop hours | Towns have a clock. The smith is not at the forge at 3am. |
| Skill-by-use | *Not taken directly.* We use level-up points plus trainer mastery, but Charter tasks act like "use it to earn it." |
| Lockpicking / persuasion minigames | Tiny, optional, skill-skippable. A 10-second grid puzzle, not a wheel. |
| Shivering Isles-style "strange region" | The **Underdeep** (§4) is our tonal break. |

---

## 3. Core loop

```
Town ──► Outdoors ──► Dungeon ──► Town
  │          │           │
  │          │           └─ loot, keys, journals, a Wardstone, a promotion token
  │          └─ encounters, rifts, secrets, hidden entrances, terrain skills
  └─ rest, train, buy spells, take contracts, turn in quests, hear rumours
```

Minute to minute: walk a square, read the viewport, decide (fight / avoid / search / cast).
Hour to hour: push a little further than is safe, retreat, grow, return.
Session to session: a region's Wardstone falls, a Charter rank rises, a promotion lands, the
story turns.

---

## 4. The world: Caldera

Caldera is a ring of land around an inland sea. In the centre of the sea burns **the Hearth**, a
column of light that has never gone out in recorded history. It has begun to dim.

Around the sea, six regions, each an outdoor map with towns, dungeons, and one **Wardstone**:

| Region | Character | Difficulty band | Wardstone |
|---|---|---|---|
| **The Shelf** | Starting coast. Fishing towns, farmland, the capital *Harrow*. | 1–8 | Harrow Stone (already intact; tutorial) |
| **Thornmark** | Old forest, elf holds, ruined watchtowers. | 5–14 | The Grove Stone |
| **The Kilns** | Dwarven mining country, lava tubes, forges. | 8–18 | The Anvil Stone |
| **Saltreach** | Marsh delta, smuggler ports, drowned temples. | 10–20 | The Tide Stone |
| **The Whitespine** | High passes, monasteries, giants. | 14–26 | The Peak Stone |
| **Ashfall** | Volcanic waste on the far side of the sea. | 20–32 | The Ember Stone |

*The atlas (`src/content/atlas.ts`) has since grown these six into twelve areas on one road of
levels to 32, and §9 follows it. Nothing on the road is locked by a skill or a flag
(docs/EXPANSION.md §2.2): a mountaineer or a ship is a shortcut, never a key.*

Below all of it is **the Underdeep**: not a region but a layer. Every region has at least one
dungeon that drops into it. Geometry becomes too regular, materials become too smooth, and the
monsters stop being animals. This is where the secret lives (§7).

The **Hearth Isle** in the centre is reachable only by ship.

### Scale targets (v1)

*The first sketch; the atlas has outgrown it, and the v1 scale is decided in docs/EXPANSION.md
§2.1.*

| Thing | Count | Grid |
|---|---|---|
| Outdoor regions | 6 | 32×32 each |
| Towns | 9 | 16×16 |
| Dungeons | 22 | 16×16 to 32×32, 1–4 levels |
| Underdeep segments | 6 + the core | 32×32 |
| Rift templates | 8 | 12×12, seeded |

---

## 5. The party

**Six slots.** Created at the start, or hired later. Two extra **hireling** slots for NPCs with
fixed builds and their own reasons for tagging along.

### Races

| Race | Lean | Hook |
|---|---|---|
| Human | Balanced | Fastest Standing gains. |
| Dwarf | STR, END | Resists poison; can read Kiln-script. |
| Elf | INT, ACC | Innate Perception; Thornmark trusts them. |
| Gnome | LCK, PER | Finds secrets a square earlier; cheaper training. |
| Tidefolk | SPD, END | Swim without the skill; Saltreach kin. |
| Orcblood | STR, SPD | Cheap intimidation; distrusted in Harrow. |

### Classes and promotions

Base classes map to Might and Magic's six, with two promotion tiers earned through Charters (§8).

| Base | Promotion I | Promotion II | Charter |
|---|---|---|---|
| Knight | Cavalier | Champion | Wardens |
| Paladin | Crusader | Hierophant | Wardens / Lanterns |
| Ranger | Warden of the Wild | Pathwarden | Cartographers |
| Cleric | Priest | Oracle | Lanterns |
| Sorcerer | Wizard | Archmage | Lanterns |
| Thief | Rogue | Shadow | Salt Compact |

Promotions raise HP/SP per level, unlock the next spell tier, and add a class-specific ability.
Promotion II always requires a dungeon, not just Standing.

### Stats, skills, mastery

- Seven stats: Might, Intellect, Personality, Endurance, Accuracy, Speed, Luck.
- **Secondary skills** bought from trainers, most gated by Standing:
  *Cartographer, Pathfinder, Mountaineer, Swimmer, Linguist, Merchant, Lockpick, Danger Sense,
  Perception, Arms Master, Spirit Sense, Navigator.*
- Weapon and magic skills have **Novice / Expert / Master** tiers. Trainers for Expert live in
  regional towns; Master trainers are hidden, expensive, and often want a favour.

---

## 6. Combat

- **Trigger:** monsters move on the grid in real time relative to your steps (they advance one
  square per party step when aware). Combat begins when a group is adjacent or within ranged
  line.
- **Turn order** by Speed, party and monsters interleaved. One action per character.
- **Rows:** front three take and deal melee; back three need reach, ranged, or spells. Swap costs
  a turn.
- **Encounter cap:** a single fight is at most 12 monsters in at most 3 groups. Bigger threats
  are bigger monsters, not more of them.
- **Conditions:** Asleep, Poisoned, Diseased, Paralysed, Cursed, Stoned, Unconscious, Dead.
  Cured by spells, temples, or time. Death is reversible in temples at a cost that scales.
- **Flee** is always an option and always works if the party is faster; the cost is where you end
  up.
- **Respawn:** cleared areas repopulate on a long timer with weaker groups, and never repopulate
  bosses or keyed rooms.

Difficulty design: a region's band is a promise. Inside it, the hard fights are hard because of
composition and terrain (a caster behind a wall of shields, a narrow corridor, a room that goes
dark), not because of numbers.

---

## 7. Magic and the secret

### Spell schools

- **Cleric list** (Body, Mind, Spirit): heal, cure, protect, turn, bless, resurrect.
- **Sorcerer list** (Fire, Air, Water, Earth): damage, control, and the utility spells that make
  the world bigger: *Light, Levitate, Wizard Eye, Walk on Water, Town Portal, Waymark / Recall,
  Detect Secrets, Jump.*
- Spells are **bought** at guilds after paying a membership fee; the fee is the region's toll for
  making you stronger there.
- About 40 spells at v1. Every spell tier lands on a promotion.

### The secret, in brief

Caldera is the inside of a hollowed body in space: a generation habitat. The Hearth is its
reactor and beacon. The Wardstones are field emitters that keep the habitat's ecology sealed. The
"gods" of every religion in Caldera are fragments of the **Custodian**, the vessel's steward,
which has been degrading for centuries and now speaks through different voices in different
regions. The Underdeep is the hull's service layer. The Custodian answers to the captain's line,
and Queen Isaure was the last of it (§9). Every people of Caldera came in the ship.

The player is never told this. They **find** it: Kiln-script that turns out to be a maintenance
language, a monastery whose bells ring in a pattern that matches the Hearth's flicker, an
Underdeep room with a window.

---

## 8. Factions: the four Charters

Every adventuring company in Caldera works under a Charter. The player picks one at start (it
gives a starting contract and a home base) but can join others. Each is an Oblivion-style
questline of six to eight quests with a rank ladder, a climax dungeon, and a unique reward.
Standing with one lowers Standing with its rival.

| Charter | Who | Line in one sentence | Rival |
|---|---|---|---|
| **The Wardens** | Soldiers, road guards | Hold the roads while the Rifts spread; ends with a siege you may or may not win. | Salt Compact |
| **The Lanterns** | Clergy and mages who tend the Wardstones | Learn what the Wardstones actually are; ends in a schism you resolve. | — |
| **The Cartographers' Guild** | Explorers, surveyors | Map the unmapped; ends in the Underdeep. Rewards are the map itself. | — |
| **The Salt Compact** | Smugglers, fences, and the honest poor | Keep the sea lanes open under the table; ends with you either running it or hanging it. | Wardens |

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
| I. Ashes on the Road | 1–10 | the Shelf, Thornmark | Why are the Stones failing? | They are not failing. They are being cut, with Underdeep tools |
| II. The Salt Road | 10–16 | Saltreach, Wrackholm, Sunderwood | Who profits? | Vask is behind the Ashen Hand, and under the world stands a wall no one built |
| III. The Deep Script | 16–22 | the Kilns, Cairnmoor, Rimewater | What are the Stones? | Machines, and people came here with them |
| IV. Beyond the Sky | 22–28 | the Whitespine, Ashfall, the Wold | What is Caldera? | A vessel. The sky is a ceiling |
| V. The Hearth | 28–32 | Hearth Isle, the Underdeep, the Core | What do we do? | The choice |

The Hearth is the quest's measure. Each restored Stone brightens it, in the night sky and on the
title's horizon. It moves only with the story, never with the clock.

### The captain's line

Queen Isaure was the last of the captain's line. The Custodian answers to the line, and the Hearth
first flickered the night she died because the vessel had lost its captain. That is why Vask needs
the throne empty (§10.1): with nobody to command it, the vessel can be shut down. It is why the
Ashen Hand ships people below: it is finding out whose hands the doors will open for. The line runs
through the whole quest and is never told, only found.

**Wenna of Gullwick** gives the line a face. She is a fisher's daughter taken as cargo, and her name
is in the Greywater ledger's CARGO BELOW column. The doors below open for her. She leads the others
up through the ice at Rime Lodge (Act III), is taken again at Sheer Point (Act IV), and at the core
the Hand holds her palm to the panel that answers to the line. Freed, she hands the choice to the
company:
*You walked all of it. Every road. You choose.* She is the heir nobody claimed (§10.1), and she
walks the main road, not only the subplot.

Harrow changes between acts, under Vask's hand, and never for the better: Wardens on the walls, a
curfew bell, the Lantern chapel shut.

### Act I — Ashes on the Road (levels 1–10: the Shelf, Thornmark)

Queen Isaure of Harrow dies the night the Hearth first flickers. The party, a freshly chartered
company, is on the road when it happens and watches the light stutter across the sea. In the
morning a Rift has opened in a Shelf farmstead. Clearing it is the tutorial. Inside is a dead
Lantern with a cracked survey wand and a note: *the Grove Stone is next.*

Harrow is in interregnum. The Regent-Warden, **Lord Aumery Vask**, holds the city "until the
succession is settled." He offers the party a Crown contract: find out why the stones are
failing.

The party reaches Thornmark and finds the Grove Stone not failed but **cut**: worked stone, fresh
chisel marks, and a sigil the Lanterns recognise as the **Ashen Hand**, a sect that preaches the
Hearth is a prison and its dimming is the door opening. Restoring the stone is the first real
dungeon. Restoring it closes Thornmark's Rifts.

- **The Shelf** (built): Ashcombe's Rift and the dead Lantern, whose note says *Tell Vask
  nothing*; the party hands Vask her wand anyway. Greywater, whose crates carry the Harrow customs
  seal, where the smugglers' cargo below was people and the Ashen Deacon was prising the staples
  from a glowing seam. Captain Hale sends the Regent a copy of the smugglers' ledger.
- **Harrow Downs:** the Queen's barrow has been opened, and only her signet is gone. In Gullwick,
  Wenna's mother asks the party to find her. Harrow Light's keeper logged the night the Queen died:
  the Hearth went out eleven times, and he wrote down the gaps between. The coast road west, into
  Act II, starts here.
- **Thornmark** (built): Thornhold and Elder Sylvane, the Grove Roots and the Cut Stone, the Hand of
  Ash, and the Warden of the Cut with the first Meridian journal.
- **The Deepthorn:** the oldest elf-hold keeps the two-hundred-year-old treaty behind the elves'
  claim to the throne, which says the elves' line and Harrow's were once one. Its seal is the
  chisel's maintenance mark: the royal line is written in the machine's script.

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

- **The Upper Water:** the way in, down the Ledge from the Downs. The Salt Compact's river barges
  carry shards and people downriver, and the folk of Reedholm saw the Tide Stone go by one night.
- **The Delta:** the Tide Stone's plinth stands empty, and the Drowned Temples have gone dark. The
  Tidefolk's god used to sing the tides; now it only counts, until its Stone comes home and it
  sings again.
- **The Saltings:** Saltmouth, the free port, is the Compact's home and the seat of Jory Tallis,
  the dockmaster claimant (§10.1, §10.2). His forged lineage convinces because it was copied from a
  real crew record, below. The crossing to Wrackholm leaves from here.
- **Wrackholm:** Smugglers' Cove and the Tide Ship, whose hold carries Wardstone shards and people
  bound for a dead-drop in the Underdeep. The Compact's orders come from below. The Tide Stone
  comes home.
- **The Eaves and Lanternwood:** the Sunder, a Rift that split a whole wood, which is what a
  Stone's failure looks like at full size. At its floor stands a wall too smooth to be stone.
  Across the gorge, by a rope bridge, is Lantern Watch, where the Lanterns begin to split.

By now word has come down the coast: Hale's copy of the ledger reached the Regent, and Hale has
vanished, his post at the pass held by men nobody knows.

Midpoint, at level 16: the Tide Ship's log names Vask. Every cargo in it went below under the
Harrow customs seal from the Greywater crates, countersigned by the Regent. He is the Ashen Hand's
patron. He has read
the Underdeep's writing and believes it: that the Hearth is a cage and there is a world beyond the
sky. He is not wrong about the facts. He is wrong about what "beyond" means.

### Act III — The Deep Script (levels 16–22: the Kilns, Cairnmoor, Rimewater)

- **The Iron Fells and the Kilns:** the dwarves cut their own Anvil Stone to sell the shards; the
  party buys it back or seizes it. Kiln-script, which dwarves read, turns out to be a maintenance
  language, and reading it is the act's own mechanic: each inscription read opens more of the map.
  Anvilhall's holiest verse, THE FIRE IS KEPT BELOW AND NOT ABOVE, is a warning painted on a boiler,
  and the lowest door of the Deep Mines says CREW ONLY. The Deep Mines have broken into the service
  layer, where the cargo below was taken.
- **Kilnmouth:** Kilnhaven, the ore port, whose ship is one way to the far side of the sea.
- **High Moor and the Cairnfield:** a ring of stones older than the Wardstones, the first emitters,
  dead for centuries, with the cairns around it. The Custodian's oldest voice still speaks there,
  in the dark inside the ring, and asks the crew to report.
- **Longmere:** some of Greywater's cargo come back up through the ice at Rime Lodge. The doors
  below opened for some of them and not for others: the captain's line, tested on its victims.
  Wenna, whom the doors know, led them up. The way they came up is the way down.
- **Coldmere:** a sealed bay under the frozen lake, opened by Wenna's hand, where rows of sleepers
  who never woke have faces like the party's own. Every people of Caldera lies there: the races
  came in the ship.

### Act IV — Beyond the Sky (levels 22–28: the Whitespine, Ashfall, the Wold)

- **Monks' Vale and the High Spine:** the Peak Stone is fine, but something wears the monks who
  guard it. The monks died long ago, and the Custodian's own hands keep the monastery in their
  robes. Its bells ring the eleven flickers of Harrow Light's log, the Hearth's pulse, rung by a
  machine that was told to ring them and never told to stop. Promotion II's dungeon is here.
- **Sheer Point:** its tip reaches toward the Hearth, and the Ashen Hand is building its crossing
  there: a causeway out over the water, built from the smuggled shards. The party sees where the
  end will come, an act early, and watches the Hand take Wenna out along it.
- **The Giants' Stair:** the road over the High Spine and down the far side of the range into
  Ashfall, past the giants who gave it its name. Kilnhaven's ship over the sea is the other way.
- **Cindercoast:** Cinderport, the far side's port, where the last crossing leaves.
- **The Wold:** the Riders remember the day the sky opened and the land burned, and they keep the
  only way into the Glass (the reach, below). They are the warning against arriving, in person.
- **Fire Mountain:** the volcano's vents are the Underdeep's exhaust and the way down for the Ember
  Stone's parts. They lead to the Meridian Company's last camp, where their cartographer, Oriel
  Fane, is still alive, and to a room with a window.
- **The Ember Waste:** the Ember Stone was never finished. The party completes it with parts from
  the Underdeep, and the Underdeep notices.

### Act V — The Hearth (levels 28–32: Hearth Isle, the Underdeep, the Core)

From Cinderport the party crosses to the Hearth Isle. The final dungeon descends from a temple,
through the Underdeep, into the reactor core. There are two ways in. The Hand came by its causeway
and the service ways, through doors that know a hand of the line, because it had Wenna's. The
company comes through the core's door, which opens only for whoever restored the stones: the one
story lock the road is sure to spend. Vask is there with the Ashen Hand, halfway through the
shutdown sequence, the Queen's signet on his finger and Wenna's palm held flat to the panel. When
the Hand is broken, the Custodian, whole for the first time, speaks with one voice:

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

The reach sits at the cap and is harder than the Core. Its power comes from what it holds
(artifacts, some of the hidden Master trainers of §5, the richest shrines and fountains) rather
than from more levels, so the quest still runs from level 1 to the cap. The reach is open before
the choice: the Core waits.

---

## 10. Subplots

Each subplot spans the whole game, is optional, touches at least three regions, and changes the
main plot's texture rather than its rails.

### 10.1 The Empty Throne

*Oblivion's "find the heir," inverted: everyone claims to be one.*

Three claimants to Harrow: the Queen's cousin (backed by the Wardens), a Thornmark elf-hold
that holds a two-hundred-year-old treaty saying the elves' line and Harrow's were once one (backed
by the Lanterns), and Jory Tallis, a Saltreach dockmaster with a forged lineage and the only navy
(backed by the Compact). Vask needs the throne empty.

The party gathers evidence across four regions, can be bribed by any side, and eventually
presents a case to the Council of Harrow. Whoever wins changes Harrow's shops, trainers, prices
and guard behaviour for the rest of the game, and decides who is at the Hearth in Act V to help
or hinder.

The captain's line (§9) makes the throne more than Harrow's: whoever carries the line is who the
Custodian answers to. Every claim touches the machine: the dockmaster's forgery convinces because
it was copied from a real crew record, the elf-hold's treaty carries the maintenance mark, and the
cousin's claim is blood, which is what the doors below test. The Queen's missing signet is evidence
all three sides want. And there is a fourth, who claims nothing: Wenna of Gullwick, whose hand the
doors know (§9). The case before the Council can be made for her, for any of the three, or for
nobody.

**Payoff:** the throne subplot is the only way to remove Vask from Harrow *before* Act V, which
weakens the Ashen Hand's presence in the final dungeon.

### 10.2 The Salt Compact

*The thieves' guild line. A Light/Dark path without a morality meter.*

The Compact runs Saltreach's smuggling and quietly feeds half of Caldera. Joining it is the
Thief promotion path. The questline is a slow reveal that the Compact's founder has been dead for
a decade and its "orders" now come from a dead-drop in the Underdeep. Somebody down there has
been running the smugglers, and what they have been smuggling is Wardstone shards.

Ends with a choice: take over the Compact and redirect it (it becomes your ferry, fence and spy
network for Act V), or hand it to the Wardens (the Wardens siege becomes winnable, the sea lanes
close, the Ashfall crossing gets harder).

### 10.3 The Lost Expedition

*The completionist's subplot. For the player who reads every note.*

Thirty years ago the Cartographers' Guild sent the *Meridian Company* to map the Underdeep. They
never came back. Their journals are scattered through every region's deepest dungeon, and each
one is a hint to a secret square somewhere else (a wall that isn't, a lake that can be walked on
at night, a monastery bell that opens a door).

Following the trail finds the Meridian Company's last camp in the Underdeep beneath Ashfall,
their cartographer, Oriel Fane, still alive and very old, and their real map: the hull. The map
shows what the Custodian will not say in Act V (§9, hidden third ending), and finishing this line
is the Cartographer Promotion II.

---

## 11. Presentation

- **Viewport:** the classic 3-deep, 5-wide first-person window with depth-layered walls,
  terrain and objects. Drawn from vector shapes at runtime, not bitmaps, so it scales and re-skins
  cheaply (see §13).
- **Frame:** party portraits with condition faces along the bottom, automap and compass on the
  right, message log below.
- **Monsters:** cel-shaded, rigged, animated (idle / attack / hurt / die) using the shared
  paper-doll rig. A few dozen base rigs, recoloured and re-proportioned per variant.
- **Audio:** synth music per region and time of day, procedural SFX. No recorded assets.
- **Text:** terse. Two lines per event. Journals and books are the long-form exception.

---

## 12. Scope tiers

| Tier | Contents | Purpose |
|---|---|---|
| **M0 — Vertical slice** | Harrow, one Shelf outdoor map, one dungeon, one Rift; full party creation; combat; four spells per class; save/load; automap. | Prove the feel. Ship nothing else until this is fun. |
| **M1 — Act I** | The Shelf and Thornmark complete, the Downs and the Deepthorn with them; Wardens and Lanterns Charter lines to rank 3; the Grove Stone dungeon; hirelings. | First real playthrough. |
| **M2 — Acts II to IV** | Saltreach to Ashfall and their Wardstones; all four Charters; promotions I; the Underdeep entrances; the ship. | The open world. |
| **M3 — Act V + subplots** | Hearth Isle, the Underdeep and the Core, all endings, all three subplots, promotions II, Master trainers. | Content complete. |
| **The reach** | The Glass and Glacier Foot, with the Buried Tower and the Vault (§9). | Optional by design: the game is whole without it. |
| **Stretch** | New Game+, seeded Rift daily runs, second party mode, Arcomage-style tavern game. | Only after M3 ships. |

---

## 13. Technical notes

- **Stack:** strict TypeScript, canvas, no runtime dependencies, esbuild-on-request dev server,
  same as the sibling games. `game-engine` is vendored into `src/lib/` with `git subtree`, per
  `game-engine/docs/VENDORING.md`.
- **From the engine:** the fixed-timestep loop, deterministic RNG (seeded per save so Rifts and
  loot are reproducible), text layout, canvas helpers, the rig and cel-shading stack for monsters
  and portraits, the synth and sequencer for music.
- **Not from the engine:** netcode. This is single-player; `src/net/` is not vendored.
- **New, game-owned:** the grid viewport compositor, map format, turn-based combat resolver,
  spell and item tables, quest state machine, save format, Rift generator.
- **Data-driven:** maps, monsters, spells, items, quests and dialogue are JSON under `content/`.
  Code never contains a monster's hit points.
- **Determinism:** combat and Rift generation are pure functions of (state, seed). This gives us
  replayable bug reports and a golden-fingerprint check like the sibling games' `tools/golden.js`.

---

## 14. Open questions

1. Grid size: 16×16 dungeons feel right; are 32×32 outdoor maps big enough to feel like
   Xeen, or do we want 64×64 with sparser content?
2. Real-time monster approach on the map versus fully turn-based movement outdoors.
   Xeen does the former; it is tenser. Needs the slice to decide.
3. Permadeath option at character creation? Cheap to add, changes the temple economy.
4. How much of the secret is discoverable in Act 1 for a player who goes straight down?
   The design says "all of it, if you can survive," but we should check that this does not
   deflate Act 3. *Answered by the road (§9): the deep truths lie in dangerous country, so a
   company that pushes ahead early finds a mystery, not a spoiler. The gate check
   (docs/EXPANSION.md §5.2) keeps it so.*
