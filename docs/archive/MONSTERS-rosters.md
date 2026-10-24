# The monsters' rosters

> History, not kept up to date: §5 to §13 of `docs/MONSTERS.md` as they stood when #1024 cut it,
> whole and in order under their own numbers: the acts' rosters (§5 to §9), the reach (§10), the
> families down the road (§11), what they add to the design (§12) and the bounds' lairs (§13). Each
> monster as its def makes it is [ROSTER.md](../ROSTER.md), made by `node tools/roster.ts`; the
> rules are [MONSTERS.md](../MONSTERS.md).

## 5. Act I: Ashes on the Road (levels 1–10)

*Why are the Stones failing?* Every kind but the machine is met here, each at its gentlest, and the
act ends on a Stone cut with tools from below.

### 5.1 The Foreland (band 1–5; built)

| Kind | On the Foreland, in the cellar and at Brandy Hole |
|---|---|
| Beasts | Giant Rat, Cellar Slime, Wolf, Wild Boar, Marsh Spider, Shore Crab |
| People | Bandit, Bandit Archer, Smuggler, Smuggler Bowman, the Smuggler Captain; and the Hand's first ranks, the Ashen Cultist, the Ashen Acolyte and the Ashen Deacon |
| The dead | Skeleton, Drowned Man, Ghoul |
| The Rift | Riftling, Rift Crawler, the Rift Warden |

It stays as built. What this asks of it:

- `kind` on every def: the slime and the crab are beasts, the Rift Warden is the Rift, and Holy
  Strike stops landing on them.
- The Rift Warden leaves its heart behind: the humming shard STORY.md finds by the tear, the first
  thing on the road with the Hearth's hum in it, heard again under the Hearth.
- The rats are the first thing most companies kill. The road brings them back twice, aboard the
  Tide Ship and at the bottom of the world (§9.2).

### 5.2 Callow Downs (band 2–5; the pilot)

*The chalk hills west of the Foreland, the fields round Gullwick, and the coast past Crowness Light
to Kestrel Edge. The Foreland's weather: mild, wet, and foggy off the sea in the autumn.*

The Downs are the night the light went out, seen from the shore. The fishermen steer by the Hearth;
with it failing the coast is dark, and the dark has people in it who were waiting for it (STORY.md,
Act One). Up on the hills the Queen's barrow, the Berth, stands open, and her guard is up. The Downs
are the pilot's zone map (EXPANSION.md §9, Phase 1.1), so their monsters test the pipeline and not
the resolver: one new family, variants on the frames that exist, and two small fields.

**New:** birds, the frame the road reuses for owls, herons, gulls, ravens, eagles and vultures.
**Back:** the Wolf on the hills, bandits and their archers on the coast road, the Shore Crab under
Crowness Light.

| Monster | Family | Role, level | Where | Look; what it does |
|---|---|---|---|---|
| Carrion Crow | birds, new | fodder, 2 | the stubble fields; the gibbet on the coast road | *Crows, too many to count, and all of them watching.* Flies, so it reaches the back row (`ranged` without `missile`); six to eight to a group |
| Wrecker | bandit | soldier, 4 | the coast from Gullwick to Crowness Light, by night and in fog | *Oilskins, a boathook, and a boat they were expecting.* Carries a chit stamped with the Helmstow customs seal, as the Brandy Hole crates are |
| Lampman | bandit | archer, 4 | one to every wreckers' group | *A lantern held high on a pole, and someone under it.* Slings stones over the wreckers; their leader, once there is morale |
| Barrow Guard | skeleton | armoured, 4, on an elite's weight | the Berth, the Queen's barrow, two by two | *The Queen's guard, in her colours, still standing to. They do not turn their heads. They have already seen you.* Halberds; holds its ground and never roams. Two are a standard encounter, so each weighs an elite (50 hit points, 12 a hit) in an armoured shape (armour 16, slow) |
| Black Dog | wolf | elite, 5 | the hills round the barrow, by night, one or two | *A black dog the size of a calf, with eyes like coals.* The dead's own hound: its bite holds (paralysis, 0.1) |
| Barrow Captain | skeleton | boss, 5 | at the Queen's bier | *Her captain, at his post beside the bier. He was told to hold it, and nobody has told him otherwise.* 220 hit points, armour 16, 21.5 a hit: won about half the time by a company of 4 |
| Chalk Wolf | wolf | skirmisher, 4 | Brockholt and the chalk, three to a pack | *Pale as the chalk it runs on, and leaner than the Foreland's.* |
| Tusker | boar | brute, 4 | the woods, alone | *A boar grown old and huge on beech mast.* |
| Barn Rat | rat | fodder, 3 | the Downs' farms and barns | *Rats, fat on someone's grain.* Its bite carries disease, as the rat's does |
| Footpad | bandit | soldier, 3 | the Salt Road, two with a poacher | *A short blade, and a coat taken off someone better dressed.* |
| Poacher | bandit | archer, 3 | the field edges, beside the footpads | *A longbow taller than he is, and one of the Queen's hares at his belt.* |
| Barnacle Crab | spider | armoured, 4 | under Crowness Light | *A rock with barnacles on it, until it stands up.* Shrugs off sleep, as the shore crab does |
| Billman | bandit | soldier, 4 | the Salt Road west of Gullwick | *A bill on a pole, and a man who knows which end to hold.* |
| Slinger | bandit | archer, 4 | beside the billmen | *A sling going round, and the Downs have flints to spare.* |
| Old Rook | birds | elite, 4 | the Wend's rookery, two of them beside it | *Grey in the face, and older than the trees it keeps.* The rookery's keepers; flies |
| Barrow Wolf | wolf | elite, 5 | the chalk hills (D2): one leading each of the den's packs, and two in the pack that keeps it | *Grey to the muzzle and big as a pony, and the pack waits on it.* The den's keepers: the chalk wolf's pale coat on a heavy frame, scarred |
| Cutthroat | bandit | elite, 5 | the bandit camp on the west downs, two of them beside it; two on the road by the Delta, at the foot of Kestrel Edge | *A captain's sash on a thief's coat, and a knife for every pocket.* The camp's keepers |

- **Fog on the coast road.** A lampman and four wreckers on a foggy night, when thick fog leaves
  two squares of sight (SYSTEMS.md). The first fight where the weather is a warning and not a
  nuisance: the lamp is what the company sees first.
- **Crows over wolves** in the stubble: the back row learns it can be reached.
- **The Berth**: guards two by two down the passage, then the captain at the bier. It is the
  Downs' hardest place, band 4–5, and its boss asks there. Built (#70): the guard as drawn (20 hit
  points, 5.5 a hit) left a company of 4 thirty fights to a rest and the captain (60, 9) won every
  time, so both were raised: four pairs are 7.1 fights to a rest at 4, and the captain is won 45%
  of the time at 4 and always at 6.

**Asks:** `look` and `when`. Flyers are `ranged` without `missile`, which exists.

### 5.3 Thornmark (band 5–10; built, retuned in the pilot)

*The old forest over the pass: Thornhold, the old tower, the barrow, the river, and the Grove.*

Thornmark is where the Stone is cut, and every kind the Foreland showed is here at full strength:
packs of dire wolves, spiders that poison, brigands with archers, the Hand in numbers, the barrow's
knights and wraiths, and the Rift the cut let through. The roster stays. What the pilot changes is
the gate: a company won nine fights in ten here at level 3 (EXPANSION.md §2.2), and the gate
wants one in four at most. The monsters' levers, in order:

- **The gentlest first.** The first groups past the pass are wolves and brigands, and the crossing
  line says how the land feels (EXPANSION.md §5.2).
- **Groups that ask.** The adepts behind the zealots, once there are ranks; the brigands' archers
  with the ogre; thorn spiders poisoning the front row before the dire wolves come in.
- **The cost, between the pools** (§4.1), set with `tools/gate.ts`.

When the Grove Stone is restored, Thornmark's Rifts close (DESIGN.md §9): its rift hounds and
riftling elders stop coming back (`until`). In the build the moment is the tear closing, when the
Warden of the Cut dies, since the cut in the Stone waits for a Lantern to mend (#41). The barrow's
dead never come back already.

### 5.4 The Deepthorn (band 8–10)

*The oldest of the forest, south of Thornmark down to Penspern, and Henlys, the oldest elf-hold,
which keeps the treaty. Thornmark's winter: cold, and snow that lies for weeks.*

The Deepthorn is age: trees older than Helmstow in a wood older than the elves' memory, and a treaty
sealed with the chisel's mark, the first time the machine's script is seen on something that is not
a tool. Its monsters are the wood. The old wood woke when the Grove Stone was cut, and it does not
know friends from cutters; when the Stone is restored it sleeps again (`until`), and the elves can
walk their own paths.

**New:** the old wood. **Back:** the Dire Wolf in bigger packs, the Thorn Spider, the Ogre alone in
the deep; the Great Owl from the birds.

| Monster | Family | Role, level | Where | Look; what it does |
|---|---|---|---|---|
| Bramble | old wood, new | controller, 8 | across the deep paths | *A thicket that closes behind you.* Never roams, and wakes at one square; its thorns hold (paralysis, 0.3); slow |
| Great Owl | birds | skirmisher, 8 | the deep, by night | *Wings as wide as a cart, and not a sound.* Flies, and hunts the back row |
| Rootwalker | old wood, new | armoured, 9 | the old groves | *A stump walking on its roots, its bark like plate.* Slow and hard to hit; fire bites, once there are elements |
| Heartwood | old wood, new | brute, 10 | alone, or over a thicket of brambles | *An oak that has decided to move.* Size 1.3 |
| The Eldest | old wood, new | boss, 10 | Penspern | *The oldest tree in Caldera, and it is awake.* The last of the wood awake: it stays so until it is beaten, and beaten is put back to sleep, not felled |

The old wood's numbers are its roles' at its levels (§4.4), set by the gate when Henlys was built
(#49): a bramble 57 hit points and 2d6+2, a great owl the same and fast, a rootwalker 83 and 2d6+3
under armour 18, a heartwood 165 and 3d8+2. The heartwood is drawn at 1.3: taller, its label over a
fight has no room above it.

- **Brambles and an owl** on a path at night: members held in the thorns while the owl takes the
  back row.
- **The oak behind the thicket**: a heartwood over three brambles, the brute behind a wall that
  holds.

**Asks:** `until` and `when`; elements, if the wood is to burn before Saltreach.

---

## 6. Act II: The Salt Road (levels 10–16)

*Who profits?* The act follows the cargo down the Long Water, out to the smugglers' ship and back
to the Sunder, and ends on Vask's name and a wall no one built. Its monsters are the first past
today's level cap, and the first that one spell must not answer.

### 6.1 Saltreach (band 10–12)

*The Long Water's country: the Upper Water's willows and Rietum's fields, the Delta's fen and the
Drowned Temples, the Saltings' pans and Saltmouth, the free port. Salt flats and tidal ground.*

Saltreach has lost its Stone. The Tide Stone went downriver on a barge at midsummer, so its Rifts
are open and the fen glitters with brine glass; the temples are dark, and their drowned priests
count instead of singing; the Compact's barges carry shards and people down the Long Water. Most of
the road's new abilities are first spent here, which adds to what Saltreach already waits on in
Phase 1.2 (EXPANSION.md §7, §9; #150).

**New:** long bodies (the eels first; later the worms and the pike) and toads. **Back:** the
Drowned Man in the temples; the Rift, in brine (§2.1); the spider frame as the salt crab; the Grey
Heron from the birds.

| Monster | Family | Role, level | Where | Look; what it does |
|---|---|---|---|---|
| Fen Eel | long bodies, new | skirmisher, 10 | in the river and the fen's water | *A back as thick as a man's leg, turning in the reeds.* Never roams; strikes at one square |
| Leech | long bodies, new | controller, 10 | the fen's pools | *Black, and as long as your arm.* Its hits heal it; six or more |
| Grey Heron | birds | skirmisher, 10 | the Upper Water | *Taller than Bram, and it has been watching.* Flies, and spears the back row |
| Fen Toad | toads, new | controller, 10 | the Delta | *A toad the size of a sheep, its skin weeping.* Poisons (0.3) |
| Bull Toad | toads, new | brute, 12 | the Delta, alone | *It could swallow Ottilie whole.* Size 1.4; carries disease |
| Bargeman | bandit | soldier, 10 | the barges on the Long Water | *A barge pole, a knife, and no questions.* Breaks when the master falls |
| Barge Master | bandit | leader, 11 | one to a barge | *A ledger in one hand and a cudgel in the other.* |
| Salt Crab | spider | armoured, 11 | the salt pans | *White with salt, and it glitters when it moves.* Shrugs off sleep, as the shore crab does |
| Brineling | riftling | skirmisher, 10 | the Delta's Rifts | *Green glass, walking, with a light in it.* Lightning bites; cold does not |
| Drowned Chanter | skeleton | caster, 11 | the Drowned Temples | *A priest of the drowned god, still chanting.* Sings a row to sleep (Slumber); the chant is a count, and it ends on eleven |
| The Choirmaster | skeleton | boss, 12 | the Drowned Temples' choir | *The choir's master, beating time on a bell.* Blesses its group each round it can; when it falls, the count stops |

- **A barge at dusk**: a master and five bargemen, and two herons over the reeds. The master is the
  answer: the first fight on the road won by who falls first.
- **The fen's pools**: leeches with an eel in the water beside the path, one group mending itself
  as it hits and one out of reach until it strikes.
- **The choir**: four chanters behind two drowned men, the front row asleep while the chanters
  count.

The count stops with the Choirmaster, and the song comes back only with the Stone (STORY.md, Act
Two).

**Asks:** elements, ranks, morale, casting, drain.

### 6.2 Wrackholm (band 12–14)

*The smugglers' isle, reached by a smugglers' boat from Saltmouth: a heather moor with a rocky east
end, Kelp Hole, and the Tide Ship at anchor under the cliffs.*

Wrackholm is the cargo. The Tide Ship's hold carries shards and people bound below; the Compact's
crews work it, the Hand's overseers keep the chains, and the orders come up from below. In the
forward hold the stolen Tide Stone glows through its sacking, and its Rift is there with it.

**New:** devilfish, the old sailors' word for the octopus. **Back:** the rat as the bilge rat;
smugglers in better gear; the Hand as its overseers; the Tide Stone's Rift, with an elder and a
warden in the hold.

| Monster | Family | Role, level | Where | Look; what it does |
|---|---|---|---|---|
| Wrack Gull | birds | fodder, 12 | the cliffs | *A thousand gulls, and all of them angry.* Flies; eight to a group |
| Bilge Rat | rat | fodder, 12 | the Tide Ship's lower decks | *The rats aboard have been eating well.* Disease (0.15); eight to a group |
| Wrack Smuggler | bandit | soldier, 12 | the cove, and the ship's deck | *A Compact knife in a Helmstow coat.* |
| Wrack Bowman | bandit | archer, 12 | with the smugglers | *A bow, and the high ground.* |
| Ashen Overseer | cultist | controller, 13 | the hold, among the chained rows; the Brokenback | *Grey to the wrist, and a chain in each hand.* The chain holds (paralysis, 0.25) |
| Devilfish | devilfish, new | controller, 13 | the cove's pools; under the ship | *Arms, coming up over the side.* Reaches the back row; holds (paralysis, 0.2) |
| Tide Elder | riftling | elite, 13 | the forward hold | *A shard of the sea, stood up.* Paralyses (0.15) |
| Great Devilfish | devilfish, new | boss, 14 | Kelp Hole, the sea cave | *What the smugglers feed.* Size 1.9 |
| Warden of the Tide | riftling | boss, 14 | the forward hold, over the Stone | *The Stone's own light, standing guard over it.* The hold's tear closes when it falls |

- **The hold**: two overseers behind four smugglers, among the chained rows. The chains hold the
  front row while the bowmen shoot the back, and Hale is chained in the last row, watching.
- **Over the side**: two devilfish on the ship's waist at night, with a bowman on the rail.

**Asks:** none of its own: Wrackholm spends Saltreach's.

### 6.3 Sunderwood (band 14–16)

*The Eaves, pines under the rim on the Sunder's west side, and Lanternwood east of the gorge, with
Lantern Watch across the rope bridge. Along the Sunder, glass trees, crystal and dead wood, and a
gorge you cannot see the bottom of in the rain.*

Sunderwood is what a Stone's failure looks like at full size. The Sunder is the oldest and biggest
Rift in the world, and the beasts along it are changed by it: glass grows through their fur. At its
floor stands the wall, and nothing else: no group within four squares of it, because the silence
at the bottom is the monsters' part in the act's turn. In Lanternwood, the moths come to the
Lanterns' lamps.

**New:** moths, drawn to light, which come back in their thousands on Hearth Isle; and bears.
**Back:** the Rift, in black glass; the spider frame as the glass spider; the wolf frame as the
sunder hound; the Hand, gleaning shards.

| Monster | Family | Role, level | Where | Look; what it does |
|---|---|---|---|---|
| Pine Bear | bears, new | brute, 14 | the Eaves | *A bear, and then the rest of the bear.* |
| Lantern Moth | moths, new | fodder, 14 | Lanternwood, by night | *Wings like a pair of hands, and dust that glitters.* Flies; its dust puts to sleep (0.2) |
| Sunderling | riftling | skirmisher, 14 | the Sunder | *Black glass, with a white light inside.* Fire bites, for the dead wood in it |
| Glass Spider | spider | controller, 15 | the Sunder's edge | *Threads of glass, and something walking them.* Paralyses (0.25) |
| Sunder Hound | wolf | skirmisher, 15 | the Sunder | *A rift hound, gone to glass.* Paralyses (0.15). Fire bites; cold does not |
| Ashen Gleaner | cultist | soldier, 15 | the Sunder's ledges; Wrackholm's Brokenback | *A sack of glowing shards, and a knife for the next.* The Hand quarries the Rift: every shard is a step |
| Deathshead | moths, new | elite, 16 | Lanternwood, by night | *A skull on its back, and a scream in its wings.* Flies; its dust puts to sleep (0.35) |
| Glass Bear | bears, new | armoured, 16 | the Sunder's floor | *Glass through its fur like frost.* Fire does not touch it |
| Warden of the Sunder | riftling | boss, 16 | the gorge, above the wall | *The Sunder's own knot, and it has held for centuries.* When it falls, the Sunder stays open |

The Warden of the Sunder is the first on the road whose death closes nothing: its Stone is long
gone, and some damage stays done.

- **Moths to the lamp**: lantern moths with a deathshead at night, half the company asleep in a
  round and the back row their first choice.
- **The gleaners' ledge**: gleaners with sunder hounds on a ledge a square wide.

**Asks:** `when`. Wanted: moths that come more often to a company carrying Light.

---

## 7. Act III: The Deep Script (levels 16–22)

*What are the Stones?* The machine is met, the dwarves' holy words turn out to be signs on doors,
and under the ice lie the sleepers. The act's monsters bring the machine up to the surface, one job
at a time.

### 7.1 The Kilns (band 16–18)

*The Iron Fells (Anvilhall and the Deep Mines), the Kilns' hill country (quarries, spoil, the Anvil
Stone, the lava tubes and their ash), and Kilnmouth (Kilnhaven, the ore port).*

The Kilns are where the machine is first met. Under the deepest mine the tunnel ends in a clean,
humming corridor, and the things that live in it come up into the mines, knocking on the rock as
they come: the dwarves call them knockers, and leave them a crust. They are small, many-legged and
smooth, with one lamp for an eye, and every one carries the chisel's mark. The dwarves cut their
own Anvil Stone to sell the pieces, so its Rift is here, in slag and iron, hand-built as the Sunder
was and the last Rift on the road (#434, call 3; #465), and the lava tubes run with fire things.

**New:** knockers, the first machines, and salamanders. **Back:** the Rift, in slag; the long
bodies as the rock worm; the spider frame as the fire beetle; the Hand's overseers, walking the
cargo down the Deep Mines.

| Monster | Family | Role, level | Where | Look; what it does |
|---|---|---|---|---|
| Knocker | knockers, new | fodder, 16 | the Deep Mines' lowest levels; the Seestollen; the Sleepers' Bay's stair, with the tallymen (Rimewater) | *Something small and grey, knocking on the rock as it comes.* A machine (§2); four to eight |
| Salamander | salamanders, new | skirmisher, 16 | the lava tubes | *A lizard with the fire showing through its skin.* Fire does not touch it; cold bites |
| Fire Beetle | spider | armoured, 16 | the spoil heaps and the forges | *A beetle with a coal in its back.* Fire does not touch it |
| Slagling | riftling | skirmisher, 16 | the Anvil Stone's Rift | *Slag, walking, with a red iron heart.* Cold bites; fire does half |
| Mender | knockers, new | healer, 17 | with the knockers; the Seestollen | *It stops to mend the others, and they let it.* Mends its group |
| Rock Worm | long bodies | brute, 17 | the old workings | *This tunnel was not dug by dwarves.* Size 1.6 |
| Anvil Guard | bandit, a dwarf on the figure frame | armoured, 17 | the Anvil Stone, if the company takes the Stone rather than buys it | *Short, broad, and in the thane's iron.* There only after the choice (`after`) |
| Slag Elder | riftling | elite, 18 | the Anvil Stone's Rift | *Iron runs off it like sweat.* Paralyses (0.15). Cold bites; fire does half |
| The Foreman | knockers, new | boss, 18 | the Deep Mines, before the door marked CREW ONLY | *It checks you the way a clerk checks a list, and finds nobody on it.* The door stays shut when it falls |
| Great Salamander | salamanders, new | boss, 18 | the lava tubes' deepest chamber | *The fire in the rock, with a head.* Size 1.6; fire does not touch it, and cold bites, as its kin's |
| Warden of the Anvil | riftling | boss, 18 | the Anvil Stone | *The Stone's heat, standing up out of the cut.* The tear closes when it falls; cold bites it, and fire does half |

- **The clean corridor**: six knockers and a mender. Kill the mender, or fight the rest twice; and
  the cleric's Wrath goes into them like a hand into a glove, the first time the road says so.
- **The spoil heaps**: fire beetles and salamanders, where the sorcerer's fire does nothing and the
  answer is Wren's Hailstorm.

Drawn (#472), on the knockers' frame (`src/ui/monsters/knockers.ts`): smooth grey plates on a comb
of legs, one lamp in the cowl's face and the chisel's mark cut on a plate, a lozenge on a stem. The
Mender carries a spool of wire and a needle and mends one turn in two; the Foreman rears up over a
slate (docs/areas/kilns.md §9). The Tiefzeche places them (#462).

Drawn (#472), on the salamanders' frame (`src/ui/monsters/salamanders.ts`): a lizard coming at the
company three-quarter on, legs sprawled and the tail curled, with the fire showing through its skin
in blotches as a fire salamander wears its yellow; embers rise off its back. The Great Salamander is
its kin gone to a crust of rock with the fire in every seam, horned, its head thrown back on a jaw
open on the fire (docs/areas/kilns.md §9). The spoil heaps and the tubes place them (#458, #463,
#466).

The six on frames that exist are drawn as well (#472): the Fire Beetle, a beetle's own body on the
spider frame with the coal set in its back; the Slagling and the Slag Elder, the riftling broken
rough as clinker and cracked red; the Rock Worm, the long bodies come up through rubble; the Anvil
Guard, a dwarf rebuilt on the figure frame; and the Warden of the Anvil, with no legs, standing up
out of a pool of slag. Their numbers are their roles' at their levels (§4.4), and the Warden's hit points
and blow were set by #465's gate, 1,200 and 13d8+12, as the Great Salamander's were by #466's, 950 and 15d8+14.

**Asks:** `kind` for the machines, if it has not come before; `after`, for the Anvil Guard.

### 7.2 Cairnmoor (band 18–20)

*High Moor (heather, peat bog, tors and the stone ring) and the Cairnfield (the cairns). The company
crosses it in snow.*

Cairnmoor is the oldest ground on the road. The ring on the moor is older than the Wardstones, the
first emitters, dead for centuries, and inside it at night the Custodian's oldest voice still asks
the crew to report; the lights that drift over the bog are the last of the ring's field, the Rift
at its thinnest. The cairns hold the oldest dead, and the tors are trolls by night.

**New:** lights. **Back:** the ogre frame as the tor troll; the wraith's as the cairn wight; the
skeleton's as the bog body and the Cairn King; the wolf's as the moor hound; ravens from the birds.

| Monster | Family | Role, level | Where | Look; what it does |
|---|---|---|---|---|
| Raven | birds | fodder, 18 | the cairns | *They were here first.* Flies; eight to a group |
| Bog Light | lights, new | controller, 18 | over the bog by night, circling the ring | *A light over the bog, where nobody is.* Flies; its touch takes spell points, not hit points |
| Bog Body | skeleton | soldier, 18 | out of the peat; Carn Fada | *Leather over bone, and a rope still round its neck.* Disease (0.2) |
| Moor Hound | wolf | skirmisher, 19 | the moor, by night | *The Downs' black dog, grown old and huge.* Paralyses (0.15) |
| Cairn Wight | wraith | controller, 19 | the Cairns; Carn Fada | *A shroud with grave-gold at its throat.* Curses (0.2) |
| Tor Troll | ogre | brute, 19 | the tors, by night; by day they are stone, and have faces | *A tor that stood up.* Size 1.6; mends unless burned |
| The Cairn King | skeleton | boss, 20 | the oldest cairn | *Crowned, and older than the crown.* Curses |

- **Lights round the ring** on a snowy night, with a moor hound: the casters' spell points draining
  away while the hound runs at the front.
- **Trolls on the tor**: two trolls and a flock of ravens, and fire, or they get up again.

The ring itself holds no monster. Inside it there is only the voice.

Drawn (#483), on the lights' frame (`src/ui/monsters/lights.ts`): a flame within a flame, pale
green and cold, hung at a walker's hip with nobody there, over a pool of its own light; it swings,
bobs and gutters, and motes rise out of the peat into it. Its touch takes spell points, and it
comes down whole from the controller's line (docs/areas/cairnmoor.md §9).

The six on frames that exist are drawn as well (#483): the Raven, the crow's frame grown big, its
wings folded; the Bog Body, leather over bone with the rope at its throat; the Moor Hound, the
black dog grown old and grey at the muzzle; the Cairn Wight, a shroud standing, wound with bands,
the torc at its throat; the Tor Troll, a tor's stacked granite with a face cut in it; and the Cairn
King, crowned on a stone seat, the curse cold in his raised hand. The trolls mend and the wights
and the King curse as #537 made them, and the boxes place them (#476 to #480).

**Asks:** regeneration, curse, drain of spell points, and `when`.

### 7.3 Rimewater (band 20–22)

*Longmere (the long lake, its meadows and Rime Lodge) and Coldmere (the frozen lake, with the sealed
bay under it); pinewoods, and the glacier's snow and ice. Glacier Foot, off Longmere, is the reach
(§10.2).*

Rimewater is the cargo coming home, and what follows it. The people who come up through the ice at
Rime Lodge were taken below, and the machine that counts the cargo comes up after them. Under
Coldmere the bay's keepers tend the sleepers, and try to put the company to bed beside them. These
are the first machines shaped like people, and the monks of the Whitespine wear the same frame
under their robes, so a company that fought the keepers will know the walk when it sees it again.

**New:** keepers, tall, thin, grey and many-fingered; and cats. **Back:** the knockers, and the
tallyman among them; the long bodies as the ice pike; the bears as the ice bear.

| Monster | Family | Role, level | Where | Look; what it does |
|---|---|---|---|---|
| Ice Pike | long bodies | skirmisher, 20 | under the lakes' ice | *The ice under Ottilie's feet has an eye in it.* Strikes a company on the ice, at one square |
| Snow Lynx | cats, new | skirmisher, 20 | the pinewoods | *Grey, tufted, and it has already jumped.* Leaps at the back row |
| Tallyman | knockers | caller, 20 | up through the ice-hole at Rime Lodge, by night; leading the knockers on the Sleepers' Bay's stair; the Kilns' Seestollen | *It stops and clicks, once for each of you.* Calls a group of knockers |
| Ice Bear | bears | brute, 21 | the glacier's edge; L9's ridge (#488); K9's far shore (#489); K10's pass (#491); Cairnmoor's Carn Fada | *White, and bigger than the last one.* |
| Bay Keeper | keepers, new | controller, 21 | the sleepers' bay under Coldmere | *Tall and grey, with too many fingers, and gentle.* Its touch puts to sleep (0.3); mends its group |
| The Matron | keepers, new | boss, 22 | the bay's last row | *It has tended them for four hundred years.* |

- **The ice-hole**: a tallyman and six knockers up through the hole on the lodge's fourth night,
  with the lodge's fire at the company's back.
- **The bay**: three keepers among the beds, where anyone who falls asleep is a sleeper to them.

Drawn (#495), on the keepers' frame (`src/ui/monsters/keepers.ts`): a figure too tall and too thin,
in the knockers' grey plate on their ball joints, a waist of rings, an egg of a head with two soft
lights and no mouth, and the chisel's mark on its chest; six long fingers to a hand, lit at the
tips, and the keeper mends one turn in four. The Matron is the tallest, stooped, in a starched cap
and an apron of plate, a second pair of arms folded over it and eight fingers to a hand; a robe
goes where her apron does. On the cats' frame (`src/ui/monsters/cats.ts`), posed from a table, the
lynx at the top of its leap, tufted and ruffed. On the frames that exist: the Ice Pike up through a
hole it broke in the ice, its body dark under it; the Tallyman, a knocker scratched over with
tallies, six lights on its cowl coming on one a click, frosted from the hole and calling three
knockers; the Ice Bear, long in the neck and white (docs/areas/rimewater.md §9). The boxes and the
bay place them (#486, #487, #490).

**Asks:** calls; a group placed on ice.

---

## 8. Act IV: Beyond the Sky (levels 22–28)

*What is Caldera?* The machine in a monk's robe, the Hand's road over the water, and a window onto
the outside of everything. There are no Rifts in this act: its Stones are whole, or never were.

### 8.1 The Whitespine (band 22–24)

*Monks' Vale (the monastery), the High Spine (the snows and the Peak Stone), Sheer Point (the Hand's
causeway), and the Giants' Stair, over the range and down into Ashfall.*

The Whitespine's Stone is whole, so its danger is the mountain, its giants and the monastery. The
monks died long ago, and the Custodian's hands keep their hours in their robes: they walk like the
keepers of the bay, speak the dwarves' old script to each other, do not bleed, and the Hearth's
light passes through them. Their bells ring the eleven. At Sheer Point the Hand builds its road of
shards out over the water.

**New:** giants. **Back:** the keepers, robed, as the monks; the ogre frame as the snow troll;
eagles from the birds; the Hand as its masons.

| Monster | Family | Role, level | Where | Look; what it does |
|---|---|---|---|---|
| Spine Eagle | birds | skirmisher, 22 | the High Spine; Rimewater's Creag Fionn | *It takes the light out of the sky as it comes down.* Flies |
| Brother | keepers | soldier, 22 | the monastery and Monks' Vale | *A monk, walking as if someone had described walking to it.* A machine under the robe |
| Bell-ringer | keepers | controller, 23 | the monastery's towers | *Eleven strokes, a gap, and eleven more.* Its bell holds (paralysis, 0.2) |
| Snow Troll | ogre | brute, 23 | the High Spine's snow; Rimewater's Creag Fionn | *A drift that stood up.* Mends unless burned |
| Stair Giant | giants, new | brute, 23 | the Giants' Stair | *A man as tall as a house, holding out his hand.* Size 2; sweeps the front row; asks a toll before it fights, beside the king |
| Ashen Mason | cultist | soldier, 23 | Sheer Point, on the causeway | *A hammer from below, and a shard to set.* |
| The Abbot | keepers | boss, 24 | the monastery's chapter house | *The abbot keeps the hours, and it is time.* Its robe falls open as it falls |
| The Stair-king | giants, new | boss, 24 | the top of the Stair | *He has taken the toll here since before Helmstow.* Size 2; the giants break when he falls |

- **The chapter house**: brothers in front of two bell-ringers, the bells holding the front row
  while the brothers close, and the cleric's light doing nothing.
- **The Stair in snow**: a giant and a snow troll, one sweeping the front row and one getting up
  again.

The giants' toll is a choice before the fight, put the way a business puts its menu, so it needs
nothing new of the resolver (#544, built: §3.3); a company that pays walks up the Stair. The giants
are `kind: person` and break when the king falls: they came in the ship awake, the crew that built
the inside and were never cargo, posted to keep the Stair, which is the hull's service ramp, and the
toll is the order they were given (#443, call 1; DESIGN.md §9). The king's words hint it and never
say it.

Drawn (#507), the monks robed on the keepers' frame (`src/ui/monsters/keepers.ts`): the bay's walk
and six lit fingers in the dead monks' habits, girt with a cord, the plate showing at the shins and
the feet. The Brother is brown, its hood up and the lights in its shadow, and lifts each foot stiff
and high and sets it down where it was; the Bell-ringer is oatmeal, its hood down and the egg bare,
a bronze handbell held out and swung eleven strokes at a time; the Abbot is the tallest, black lined
pale, its hood drawn up to a point and a crook in its hand, and its robe has fallen open on the
plate and the chisel's mark. The bell is `ranged`, so it holds from the back rank
(docs/areas/whitespine.md §9). The boxes place them (#499, #500).

Three on frames that exist are drawn (#507): the Spine Eagle, the birds' frame at its biggest,
coming down with its wings raised high and its yellow feet thrust forward, the nape gold and the
bill hooked; the Snow Troll, the tor troll's frame made of snow, rimed, a cornice over its brow
with icicles at the lip, standing in the drift it rose from; and the Ashen Mason, the overseer's
hitched robe under a mason's apron white with dust, a glass shard on its shoulder and a hammer low
in its fist. The troll mends as #537 made trolls, and the boxes place them (#499, #501 to #504;
docs/areas/whitespine.md §9).

Drawn (#507), on the giants' frame (`src/ui/monsters/giants.ts`): a man as tall as a house, upright
in the coat of felted wool he has worn four hundred years, belted and patched, his leggings bound to
the knee and a worn badge on his shoulder; his near arm is held out from the elbow, the hand open and
cupped for the toll, and the far hand hangs, bigger than a man's head. The Stair-king is the frame an
eighth broader, his head sunk under a mantle of dark fur, white-haired and bearded to the belt, and
crowned in the toll: coin set on edge round his brow, the oldest at the front with no face. Both are
size 2, drawn inside the tall boss's crown, and with them #507's eight are drawn
(docs/areas/whitespine.md §9). I10 placed them (#502) and gave them sweep (#545), the king's group
asking the toll (docs/areas/whitespine.md §4.5).

**Asks:** sweep.

### 8.2 Ashfall (band 24–26)

*Cindercoast (Cinderport, black sand, hanging vines, the hot springs), Fire Mountain (the vents, Old
Cinder, and Meridian Camp below them, with the window), and the Ember Waste, round the unfinished
Ember Stone.*

The Ember Stone was never finished, so the far side of the sea was never sealed, and the machine is
near the surface: the mountain's vents are the Underdeep's exhaust, and the stokers that tend them
walk out on the ash. Old Cinder is a town the mountain buried, its people cast in the ash. When the
company finishes the Stone, the Underdeep notices (DESIGN.md §9): every door below opens at once,
and what comes up hunts Ashfall from then on (`after`).

**New:** drakes, and the heavy machines. **Back:** the old wood as the strangler vine; the
salamanders; the spider frame as the cinder beetle; the dead, cast in ash.

| Monster | Family | Role, level | Where | Look; what it does |
|---|---|---|---|---|
| Strangler Vine | old wood | controller, 24 | the green shore's trees | *The vines hang lower than they did.* Never roams; holds (paralysis, 0.3) |
| Cinder Beetle | spider | armoured, 24 | the black sand | *Its shell is the colour of the beach.* |
| Ember Salamander | salamanders | skirmisher, 24 | the vents | *Grown in the mountain's own fire.* |
| Ash Husk | skeleton | soldier, 25 | Old Cinder | *A man of ash, still holding his cup.* |
| Stoker | heavy machines, new | brute, 25 | the vents | *It shovels nothing into nothing, and turns as you come.* Fire does not touch it |
| Cinder Drake | drakes, new | brute, 25 | Fire Mountain's slopes | *The mountain has children.* Flies; its breath burns a row; fire does not touch it |
| Sentry | heavy machines, new | elite, 26 | all of Ashfall, once the Ember Stone is lit | *It is looking for whoever touched the Stones.* Holds (paralysis, 0.15) |
| The Old Drake | drakes, new | boss, 26 | Old Cinder's crater | *The mountain's eldest, asleep on what is left of the town.* Size 1.8; its breath burns a row; fire does not touch it |
| The Sentinel | heavy machines, new | boss, 26 | the Ember Stone, the moment it lights | *The first thing up through the doors.* Size 2 |

- **The vents**: two stokers with ember salamanders, where fire is useless and nothing but
  lightning troubles the machines.
- **After the Stone**: sentries on the road back to Cinderport, which was safe the day before.

Four on frames that exist are drawn (#520). The Strangler Vine, on the old wood's frame
(`src/ui/monsters/oldwood.ts`), is a grey tree it has killed, wound round with green cables, its ropes
hanging nearly to the ground from the two limbs and the outermost ending in curls; the face is the
tree's knotholes. The Cinder Beetle has the fire beetle's legs set wide under a body low and black,
ridged and knobbed, with ash in its grooves and one forked horn over it. The Ember Salamander is its
kin's frame lither and longer in the tail, the head high, coal-red, the fire in bands across it and
white at their hearts. The Ash Husk is no bones but the cast of a man in his tunic, pale grey and
crazed, his cup held up at his shoulder and the far hand crumbled off. The vine holds as the bramble
does and its groups never roam; fire does not touch the beetle or the salamander
(docs/areas/ashfall.md §9). The boxes place them (#510, #511, #514).

The drakes are drawn (#520), a new family on its own frame (`src/ui/monsters/drakes.ts`): nothing of
the picture book's dragon but a thing grown in the vents, hunched, crusted ash-grey, the fire showing
at the belly in the seams between its plates, with small bat's wings veined red, a tail ending in a
knob of clinker and a head too big for it, blunt as basalt and turned to the company, the jaw hung
open on the glow in its throat. The Cinder Drake hangs on its wings, beating, and its breath is a
plume of embers going up out of the jaw. The Old Drake is the frame larger and settled on its
haunches, its wings half folded, darker and crusted with sulphur, and scarred: a horn broken short, a
blind eye, a notch torn in a wing. Both breathe fire on a row and fire does not touch them; the
Cinder Drake stands on the test drake's line (§3.3) and the Old Drake is set off it for Old Cinder's
gate (docs/areas/ashfall.md §9). G10 and Old Cinder place them (#511, #515).

The heavy machines are drawn (#520), a new family on a frame of its own
(`src/ui/monsters/machines.ts`): the hull's own heavy work, plain plate riveted along ruled seams
and joined at drums, each on the same legs, a rod of a thigh, a drum at the knee, a greave and a
flat foot, with one fire in all of them seen only where the plate opens, and the chisel's mark cut
once in each. The Stoker is a boiler on short bowed legs, its dome black with soot and a stack on
it, the furnace door glowing in its belly; its near arm is a shovel, the blade worn bright at the
lip, scooping at nothing. The Sentry is leaner and upright on long legs, for a head an eye, a lamp
under a brow of plate that turns as it looks, and one arm long, hanging past the knee to an open
clamp. The Sentinel is the family at its largest and plainest, size 2: a block of plate on legs
planted wide, fists like anvils, a slit of fire for a visor and down its chest the line between two
doors, the fire through it. Fire does not touch the stoker and the sentry's clamp holds
(docs/areas/ashfall.md §9); the flue walker, the loader and the core sentry are each the frame's
`Build` and a tint (§11). With them and the drakes, #520's nine are drawn. The boxes place them
(#513, #514, #516).

**Asks:** sweep with an element; `after`.

### 8.3 The Wold (band 26–28)

*The Glasswold's steppe round the Glass, the Wold Riders' camp, dunes and mesas. The Glass itself is
the reach (§10.1).*

The Wold is the warning. The Riders remember the day the sky opened and the land burned to glass;
the grass has glass in it, the beasts that hunt it are the biggest on the road, and now and then
something walks out of the Glass that fell with the pillar of fire and has not stopped trying to
get up. The Riders keep the only way in, and they are right to.

**New:** glass walkers, the machines that fell with the lander, fused with the glass it made; the
Buried Tower is full of them. **Back:** the cats as the Wold's lions; the spider frame as the glass
scorpion; the salamanders as the basilisk; vultures from the birds.

| Monster | Family | Role, level | Where | Look; what it does |
|---|---|---|---|---|
| Vulture | birds | fodder, 26 | the steppe | *They land when something is about to die.* Flies |
| Wold Lion | cats | skirmisher, 26 | the steppe, in prides of three or four | *Tawny as the grass, and seen only when it moves.* |
| Glass Scorpion | spider | controller, 26 | the dunes | *Its sting is glass, and so is its shell.* Poisons (0.35) |
| Basilisk | salamanders | controller, 27 | the mesas; Karaordu | *Don't meet its eyes.* Turns a member to glass: stone (0.15) |
| Glass Walker | glass walkers, new | elite, 27 | the Wold's edge, by the Glass | *Something walking out of the Glass, and it has walked a long way.* A machine, and older than the rest |
| The Grey Lion | cats | boss, 28 | the Wold's heart | *Old, scarred, and king of all of this.* |

- **The mesa**: a basilisk behind a pride of lions, the lions keeping the front row busy while the
  basilisk glasses whoever looks up.

The five on frames that exist are drawn (#533), ahead of the boxes that place them. On the birds'
(`src/ui/monsters/birds.ts`): the Vulture, hunched on the ground to wait, its broad wings low and
open round it, the head hung forward on a long bare neck out of a cream ruff, the head and neck bare
and pink, a heavy brow and a pale hooked bill. On the cats' (`cats.ts`): the Wold Lion, tawny, long
and low in a stalk, the shoulders high and the head carried level in front of them, the ears small
and round, a long tail turned up at its end in a black tuft and the near forepaw lifting as it
creeps; and the Grey Lion, the frame at its heaviest, standing square with its head up over a dark
grizzled mane, the coat gone grey and three old rakes pale across the eye. On the spiders'
(`spider.ts`): the Glass Scorpion, of the Wold's green glass, eight short legs splayed under a low
body, two big claws raised open either side of a tail arched over toward the company, and a clear
sting. On the salamanders' (`salamanders.ts`): the Basilisk, its kin gone cold, lichen-grey with no
fire in the skin, the snout drawn out, a crown of glass spikes round the back of the skull, a crest
of glass shards down the spine and big eyes lit a cold green-white. Their numbers are their roles'
at their levels on the line #661 made again (§4.4), the basilisk the test basilisk (§3.3). The boxes
place them (docs/areas/glasswold.md §9).

The glass walker is drawn too (#533), the first of its family (`src/ui/monsters/glasswalkers.ts`):
a tall frame of old bronze gone green in its seams, a man's shape and a head over a man's height,
balls and rods at its joints, a shell of a chest with a door in it and a smooth head with one lamp,
lit a cold green-white. It has waded out of the Glass to the knees, and its left arm has gone into
a club of the Wold's green glass that drags beside it, the bronze dark inside, shards standing off
the shoulder and runs of glass down the chest; its right side is bare. It walks in place, the club
dragging. The elite at 27 on the line, a machine; the Buried Tower's are to be its frame at their
worst (§10.1).

**Asks:** stone, and its cure.

### 8.4 Meridian Camp (band 25–28)

*Three levels down Fire Mountain's vents: the vents, the iron corridors and the camp, with Oriel
Fane and the window (docs/areas/meridian_camp.md; #22; DESIGN.md §10.3).*

Ashfall's machine below the ash, at work: the stokers on their rounds, a drake's brood in the
corridors' heat, and under the camp the knockers inspecting walls that have not cracked. They leave
Fane alone, because he is not in their way. The look lines are the building session's, and this
table holds none.

**New:** no family; the camp is Ashfall's, which already adds two. **Back:** the stokers, the
salamanders and the drakes; the knockers, deep.

| Monster | Family | Role, level | Where | Look; what it does |
|---|---|---|---|---|
| Ember Salamander | salamanders | skirmisher, 24 | the vents | §8.2's |
| Stoker | heavy machines | brute, 25 | the vents, the furnace room, the corridors | §8.2's; fire does not touch it |
| Cinder Drake | drakes | brute, 25 | the corridors | §8.2's; burns a row |
| Drakeling | drakes, a new def | fodder, 26 | the nest | Flies; six to a group |
| Flue Walker | heavy machines, a new def | elite, 27 | the corridors; Ashfall's Blackdraw | Walks the corridor end to end; fire does not touch it |
| The Brood Drake | drakes, a new def | boss, 27 | the nest off the corridors | The drake that nests in the corridors, the Barbarian's quarry (#448). Size 1.8; flies; its breath burns a row |
| Deep Knocker | knockers | armoured, 28 | below the camp; Ashfall's Blackdraw | §9.2's, first met here |
| Inspector | knockers, a new def | caller, 28 | below the camp; Ashfall's Blackdraw | Calls deep knockers |

After the Ember Stone is lit, one sentry group joins the vents and one the corridors (`after`), as
in all of Ashfall. The Brood Drake is judged at 26, the corridors' floor.

The five new here are drawn (#22), ahead of the levels, on frames that exist. On the drakes'
(`src/ui/monsters/drakes.ts`): the Drakeling, small and round under a head too big even for it, its
crust not set, the hide a soft ember-pink with the fire showing through, with two nubs of horn,
large eyes, a short tail and stubs of wings beating fast, too young to breathe; and the Brood Drake,
rust-dark as the corridors' iron, settled on its haunches over three eggs of clinker cracked with
the fire, its wings mantled down and out round them and its horns long. On the heavy machines'
(`machines.ts`): the Flue Walker, a length of flue on the family's long legs, hooped and pale with
ash, with a chimney's cap over a collar open on the fire, a damper of three slots in its middle and
its arms bowed out to climbing irons. On the knockers' (`knockers.ts`): the Deep Knocker, longer,
higher on its legs and pale, the plates' edges standing up along its back, its knobs heavy and its
lamp hard and cold in a ring of plate; and the Inspector, umber-dark on long legs, with no feelers
and a mast off its back carrying a second lamp, which it turns from the wall to the company. Their
numbers are their roles' at their levels (§4.4), the Brood Drake set off the line for the corridors'
gate as the Old Drake is (docs/areas/meridian_camp.md §8). The levels place them (#22).

**Asks:** sweep with fire; calls; elements.

### 8.5 The Dead-Drop (band 26–28)

*Three levels down the stair from the Tide Ship's hold: the drop, the vaults and the counting house
(docs/areas/dead_drop.md; #22; DESIGN.md §10.2).*

The machine counting: loaders that move the cargo, clerks that tally it, keepers that made up the
beds, and at the last desk the Tallymaster, writing the Compact's orders in the dead founder's hand.
The Hand is never met below: its crews leave the cargo at the stair's foot and go back up. The look
lines are the building session's.

**New:** no family. **Back:** the knockers, the keepers and the heavy machines, each a def of its own.

| Monster | Family | Role, level | Where | Look; what it does |
|---|---|---|---|---|
| Loader | heavy machines, a new def | brute, 26 | the drop and the vaults | *It carries a crate the size of a cart, and does not set it down.* Size 1.4 |
| Tally Clerk | knockers, a new def | caller, 26 | the drop | *It counts the crates, then turns and counts you.* Calls two loaders |
| Hold Keeper | keepers, a new def | controller, 27 | the drop's far end (`dd_keeper`: one) and the people's vault (`dd2_keepers`: three; `dd2_keepers2`: four) | *It carries water to the pens, and nobody is in them.* Puts to sleep (0.3); mends its group |
| Deep Knocker | knockers | armoured, 28 | at the rails' sealed door | §9.2's |
| The Tallymaster | keepers, a new def | boss, 28 | the counting house | *It writes, and does not look up.* Fights only when the company steps to its desk; calls two tally clerks; size 1.6 |

The Tallymaster is judged at 27, the counting house's floor. The stair's foot, `dead_drop_stair`,
holds no group, and `dead_drop`'s first stands out of sight of it: the band's sign is the warning
(§2.2).

The four new defs are drawn (#22), each on a frame that exists and in Wrackholm's table, ahead of
the levels that place them. The Loader is the heavy machines' (`src/ui/monsters/machines.ts`): a
squat hull on short bowed legs, both arms up and holding over its head a crate the size of a cart,
planked, strapped with iron and chalked with a clerk's tally; it has no head, and the fire shows
through two ports under the crate. The Tally Clerk is the knockers': low, long and the colour of the
hold's dust, with no feelers, and stood up on its back a counting frame whose beads go across one a
click. The Hold Keeper is the bay's keeper kept in the hold, bare, shorter and a little stooped, a
yoke across its shoulders and a pail at each end. The Tallymaster is the keepers' largest and
strangest, size 1.6: it stands behind a clerk's desk among piled ledgers on a neck grown long,
writing with a pen in each hand in two ledgers at once, six lights counting across its brow. The
deep knocker is Meridian Camp's, drawn with the inspector (§8.4, #657); the vaults place that one
(docs/areas/dead_drop.md §8).

**Asks:** calls and the sleeping touch, both Rimewater's.

---

## 9. Act V: The Hearth (levels 28–32)

*What do we do?* The Hand's last stand, the machine at work and nothing else, and at the heart of
it all, people.

### 9.1 Hearth Isle (band 28–29)

*A rocky rim round a green bowl, the temple built by people who thought the Hearth a god, and the
column of light itself.*

The causeway of shards lands here, and the Hand holds the temple: its best in front, and the rest
dead on the stairs below, where the things that live below caught them. At night the sky over the
isle is moths. Everything on the road that loves a lamp has come to the biggest one.

**New:** no family; the isle's new thing is the Hearth. **Back:** the moths at their most, and the
Hand at its best.

| Monster | Family | Role, level | Where | Look; what it does |
|---|---|---|---|---|
| Hearth Moth | moths | fodder, 28 | the isle, by night | *The sky over the isle is moving.* Flies; its dust puts to sleep (0.2); twelve to a group |
| Ashen Champion | cultist | soldier, 29 | the temple | *The Hand's best, in steel from below.* |
| Ashen Preacher | cultist | caster, 29 | the temple, behind the champions | *Still preaching, and the fire is the sermon.* Fire Bolt on a row; Ward on its group |

Its boss is the Core's.

### 9.2 The Underdeep (band 30–31)

*The hull's service layer, where geometry becomes too regular and materials too smooth. The final
dungeon descends through it from the temple.*

The Underdeep is the machine at work, with the last of the Hand still standing on its stairs: every
machine family at its full size and on its own ground, the keepers with no robes, knockers still
inspecting walls that have not cracked in four hundred years, and the vessel's defences, which
caught the Hand on the stairs. And rats. They are the only animals below the world, and nobody
brought them: they came aboard the way rats do. A company that met its first rat in a farm cellar
meets its last one here.

**New:** crawlers, the long-legged things that walk the walls and ceilings. **Back:** every machine
family, at work, the deep knockers from Meridian Camp (§8.4); the rats.

| Monster | Family | Role, level | Where | Look; what it does |
|---|---|---|---|---|
| Deep Rat | rat | fodder, 30 | everywhere; the Glasswold's Karaordu | *Rats. Even here.* Disease (0.2); twelve to a group |
| Keeper | keepers | soldier, 30 | the service ways | *A keeper with no bay to keep, and no robe.* |
| Deep Knocker | knockers | armoured, 28, as built below Meridian Camp | the Ways and the Stair; the crack (#56's 61) | *Still knocking, on a wall that has never cracked.* First met below Meridian Camp, at 28 (§8.4) |
| Ashen Rearguard | cultist | armoured, 30 | the stair's first landing, where the claimant's people are not | *The last of the Hand still standing, and standing in the way.* Never breaks |
| Deep Crawler | crawlers, new | brute, 31 | walls and ceilings | *It comes down from above, on too many legs.* Reaches the back row |
| The Catcher | crawlers, new | boss, 31 | the stairs down to the core, among the Hand's dead | *It caught the Hand on these stairs.* |

### 9.3 The Core (band 32)

The last fight is people. Vask and his grey-handed men are halfway through putting out the light,
the Queen's signet on his finger and Wenna's palm held to the panel (STORY.md, Act Five). The signet
is the captain's line in a ring, so the core's machines answer it, and Vask calls them against the
company. The fight has a clock: through the roof, the light goes out a little every round until the
Grey Hands at the panel fall.

| Monster | Family | Role, level | Where | Look; what it does |
|---|---|---|---|---|
| Grey Hand | cultist | elite, 31 | the heart of the Hearth | *Hands the colour of ash, to the shoulder.* The Hand's inner circle, who walked Wenna from door to door |
| Core Sentry | heavy machines | soldier, 31 | called by the signet | *The core's own, and it takes orders from the ring.* |
| Lord Vask | the figure frame, a drawing of his own | boss, 32 | at the panel | *A tall man with a quiet voice, and the Queen's ring on his finger.* Calls sentries; never breaks |

The Custodian does not fight. When the Hand is broken it speaks, with one voice.

**Built** (#748; #739, call 7): the Core's clock, `clock: { calls, every, dims, panel }` on a group,
carried into the fight as its leader is. While a monster the `panel` names stands, the group's leader
calls one of `calls` at the end of every `every`th round, at no cost of a turn and never on his own
`calls.chance`, up to twelve monsters with those down counted; the light dims a step at each round's
end, to `dims`, and holds. The panel down, the calling stops and the light holds where it is. It ends
nothing. The fight screen darkens over the backdrop, closing on a shaft of the roof's light that
narrows to a thread, and the log says *Through the roof, the light goes out a little.* at every third
step and *The light holds at a thread.* at the last. `obeys`: once every leader is down, a monster
that obeys stands down and leaves the fight, paying nothing, though its kind never breaks
(*2 Core Sentries stand down.*). A machine that does not obey stands, as before.

The calls pass the cap of three groups by standing in **one called group that grows**, which the
first call opens: the Heart holds two groups, so the fight screen seats and labels it as any other.
Calls exempt from the cap, a group each, measured the same (below, within a point), and asked more
of the screen, which seats each group a step lower. The call costs no turn because, as a turn, every
second blow of Vask's became a sentry and the clock eased the fight: the harness's bot won 44% with
the Hands first and 67% with Vask first, against 33% with no clock.

Measured on the test monsters the plan sizes the Heart by (`clockEncounter`: the test boss at 32,
the test elite and soldier at 31, line for line Vask, the Grey Hands and the Core Sentries), 400
seeds at 32 when the clock was built (#748): the gate's bot won 10% killing the Hands first, 16% going
for Vask and 5% fighting the sentries as they come, against 23% with no clock; the harness's bot, its
fights cut at fifteen rounds, won 14%, 31% and 21%, and wins 11%, 26% and 18% since #793 made the line
at 31 (`node tools/harness.ts --abilities --seeds 200`). The clock halves the odds as the plan has it,
two in three then a quarter to a third, but the whole stood far under them on the test monsters:
Vask's size was set by the Heart's gate (#759) and the run to 32 settled by #752 (§4.4). The bots find
Vask first the better play, since his fall stops the calls and stands the sentries down. As built, with
the sentries at 890 hit points, the clock let run holds, 28% on 400 seeds; the Hands first wins 62%,
three in five where the plan said two in three, and Vask first 72% (docs/areas/hearth.md §7).

Nine on frames that exist are drawn (#761). The Hearth
Moth is the lantern moth's hands cut deeper, to flames, rust above and red beneath, its dust falling
as embers; the Deep Rat the rat lean and up on its legs, pale, ribbed and red-eyed; the Keeper the
bay keeper bare, dark-plated and gold-lit, both hands raised to touch; the Core Sentry the Sentry's
legs and keel, pale and clean, a ring of plate for a head with the core's light in it. The Ashen
Champion wears the overseer's hitched robe under a breastplate and pauldrons of the Hand's steel, a
greatsword stood on its point; the Ashen Preacher has thrown his hood back from a shaven head grey
with ash, the fire on his upflung palm; the Ashen Rearguard is a closed helm over a tall shield with
the sigil burnt in, a cleaver low; the Grey Hand a dark robe and a plain grey mask, the arms bare
and grey to the shoulder and held out to take hold. Lord Vask stands on the figure frame bare of a
robe, in the Wardens' grey coat and red sash under a black cloak, the Queen's ring lit on his raised
hand, size 1.6 inside the tall boss's crown. The boxes place them (#753, #757 to #759;
docs/areas/hearth.md §9.2).

The crawlers are drawn too (#761), a family of their own (`src/ui/monsters/crawlers.ts`): machines
that come down from above, a spine of blackened iron plates rimmed in worn steel on a dark rod, long
legs of rod with brass knees held high and hooked feet, lamps of a dull red and the chisel's mark cut
in a plate. The Deep Crawler comes head-first down the wall: seven plates, six pairs of legs splayed
and the front pair on the floor, a shovel of a head with six lamps over a pair of clamps and the hook
it hangs by at its tail; a wave of steps runs down its legs. The Catcher is a crawler built to hold
what falls: three great plates under its hook, a hood with a band of five lamps and from its rim a
cage of seven hooked arms closed to the floor, one of the Hand slumped inside with an arm hung out
through the bars; two pairs of long legs stand it over the cage, size 2 inside the tall boss's crown.
The brute on the line at 31 and the boss off it, its hit points and blow set by the Stair's gate
(`offLine`, #758); the Ways and the Stair place them (#757, #758).

---

## 10. The reach

The reach sits at the cap and asks the most (EXPANSION.md §5.2): a company at the cap that has
walked the road wins about half its first fights there, and what it finds is what makes the rest
winnable. Its super dungeons run many levels, each stranger than the one above. The two go opposite
ways, and so do their monsters: the Buried Tower down into what tried to leave, the Vault up into
what keeps the sky.

### 10.1 The Glass and the Buried Tower

The mast of a lander that tried to arrive, sunk in the glass it made, its decks running down into
the ground it melted (DESIGN.md §9). Its monsters are its own: the glass walkers at their worst,
the people who rode it down, still at their posts in the glass, and what grew in the melt.

| Monster | Family | Role, level | Where | Look; what it does |
|---|---|---|---|---|
| Glassbound | skeleton | soldier, cap | the Tower's decks | *In the glass to the chest, and still at its post.* |
| Glass Worm | long bodies | brute, cap | the melt under the decks | *A worm with a throat of glass.* |
| The Pilot | skeleton | boss, cap | the lowest deck | *Still in its seat, and still trying to leave.* |

The glass walkers come back at their full size on every deck.

### 10.2 Glacier Foot, the Ice Caves and the Vault

Where the glacier comes down from the rim and the sky comes down to meet the ice: the one place a
company can climb into the Vault, the inside of the sky, where the lights that make the sun and
the moon hang in the dark. The Ice Caves are the way up, and the Vault's monsters keep the lights.

| Monster | Family | Role, level | Where | Look; what it does |
|---|---|---|---|---|
| Ice Worm | long bodies | brute, cap | the Ice Caves | *It melted the cave it lives in.* |
| Rime Light | lights | controller, cap | where the ice is thinnest | *Cold light, drifting.* Its touch takes spell points |
| Lamplighter | keepers | soldier, cap | the Vault's gantries | *On its way to the sun, and you are on the gantry.* |
| The Old Lamplighter | keepers | boss, cap | beside the sun | *It lit the first morning.* |

---

## 11. The families, down the road

The ledger the novelty check reads (EXPANSION.md §5.4) and the creatures lane splits (EXPANSION.md
§8.1): each new family's module lands before the area that first needs it, the birds first, for
the pilot.

| Family | First met | Then |
|---|---|---|
| rat | the Foreland (built) | the bilge rat (Wrackholm), the deep rat (the Underdeep and the Glasswold's Karaordu) |
| slime | the cellar (built) | none |
| boar | the Foreland (built) | none |
| wolf | the Foreland (built) | the black dog and the barrow wolf (the Downs), the sunder hound (Sunderwood), the moor hound (Cairnmoor) |
| spider | the Foreland (built) | the salt crab (Saltreach), the glass spider (Sunderwood), the fire beetle (the Kilns), the cinder beetle (Ashfall), the glass scorpion (the Wold) |
| bandit | the Foreland (built) | the wreckers and their lampman (the Downs), the bargemen (Saltreach), the Wrack smugglers (Wrackholm), the anvil guard (the Kilns) |
| cultist | the cellar (built) | the overseer (Wrackholm), the gleaner (Sunderwood), the mason (the Whitespine), the champion and the preacher (Hearth Isle), the Grey Hand (the Core) |
| skeleton | the cellar (built) | the barrow guard and captain (the Downs), the chanter and the Choirmaster (Saltreach), the bog body and the Cairn King (Cairnmoor), the ash husk (Ashfall), the glassbound and the Pilot (the Glass), the Old Chanter (Saltreach's lair, §13) |
| riftling | the cellar (built) | brine (Saltreach, Wrackholm), black glass (Sunderwood), slag (the Kilns): §2.1 |
| ogre | Thornmark (built) | the tor troll (Cairnmoor), the snow troll (the Whitespine), the Rim Troll (Cairnmoor's lair, §13) |
| wraith | Thornmark (built) | the cairn wight (Cairnmoor) |
| **birds** | the Downs | the old rook (the Downs), the great owl, the grey heron, the wrack gull, the raven, the spine eagle, the vulture, the Foal-taker (the Glasswold's lair, §13) |
| **old wood** | the Deepthorn | the strangler vine (Ashfall) |
| **long bodies** | Saltreach | the rock worm (the Kilns), the ice pike (Rimewater), the glass worm and the ice worm (the reach), the Hag (the Foreland's lair, §13) |
| **toads** | Saltreach | none: the first to cut if the art budget bites |
| **devilfish** | Wrackholm | Old Nick (Wrackholm's lair, §13) |
| **moths** | Sunderwood | the hearth moth (Hearth Isle) |
| **bears** | Sunderwood | the ice bear (Rimewater) |
| **knockers** | the Kilns | the tallyman (Rimewater), the deep knocker and the inspector (Meridian Camp), the tally clerk (the Dead-Drop), the deep knocker again (the Underdeep), the Steiger (the Kilns' lair, §13) |
| **salamanders** | the Kilns | the ember salamander (Ashfall), the basilisk (the Wold) |
| **lights** | Cairnmoor | the rime light (the Ice Caves) |
| **keepers** | Rimewater | the brothers, the bell-ringers and the Abbot, robed (the Whitespine); the hold keeper and the Tallymaster (the Dead-Drop); the keeper (the Underdeep); the lamplighters (the Vault); the Infirmarer (Rimewater's lair, §13) |
| **cats** | Rimewater | the Wold's lions |
| **giants** | the Whitespine | none |
| **drakes** | Ashfall | the drakeling and the Brood Drake (Meridian Camp), the Grave Drake (Ashfall's lair, §13) |
| **heavy machines** | Ashfall | the flue walker (Meridian Camp), the loader (the Dead-Drop), the core sentry (the Core) |
| **glass walkers** | the Wold | the Buried Tower |
| **crawlers** | the Underdeep | none |

In all, 113 new defs in 17 new families: with today's 33 in 11, 146 in 28, each def a drawing of
its own (EXPANSION.md §5.6); eight of them are Meridian Camp's and the Dead-Drop's (§8.4, §8.5;
#22). No area adds more than two families, and Hearth Isle, the Core and the two large dungeons add
none. Five families serve a single area: the toads and the devilfish, which can be cut, and the
giants, the drakes and the crawlers, which are their areas' centrepieces and cannot. The bounds'
eight guardians (§13) are eight defs more, each a new kind in a family above, and add no family;
Old Nick is the devilfish's third kind, after the Devilfish and the Great Devilfish, so Wrackholm's
lair would want another family were they cut.

---

## 12. What this adds to the design

To take in or leave, as STORY.md's were:

- Five kinds, with `kind` on every monster in place of `mindless`'s two jobs, so that Holy Strike
  lands on the dead and nothing else.
- The machine's rules: each is doing a job; lightning bites; the Hearth's light passes through it,
  because the gods are the Custodian's voices and these are its hands.
- The Rift as a Stone's field torn loose and dressed in the Stone's material, with a shard for a
  heart; the Sunder staying open when its warden falls; no Rifts in the Whitespine, whose Stone is
  whole, or in Ashfall, whose Stone never made a field, so that on the far side the machine is near
  the surface instead.
- The dead gathering where a Stone is cut and lying down when it is restored, and the old wood
  waking and sleeping with the Grove Stone.
- No machine before the bottom of the Deep Mines and no Rift after Cairnmoor, held by a check.
- The keepers of the sleepers' bay putting people to sleep, and the monks as keepers under their
  robes, so that a company knows the walk.
- The Hand's hands greying with rank, as the Hand of Ash's are already drawn (`cultist.ts`), from
  the overseers' wrists to the Grey Hands' shoulders.
- The rats, the first thing killed and the last animal met.
- The moths, drawn to light from Lanternwood to the Hearth.
- The drowned chanters' count and the monastery's bells, both ending on the eleven.
- The giants' toll on the Stair.
- Vask's signet commanding the core's machines, and the Core's fight on a clock.
- The Tallymaster, a keeper in the Dead-Drop's last room that counts the cargo and writes the
  Compact's orders in the dead founder's hand: the Tidefolk's god only counts because this is where
  its fragment has been counting (#443, call 4; DESIGN.md §10.2).
- The giants as the crew that built the inside, awake since the ship and posted to the Stair, a
  people of the road and not of the bays (#443, call 1).
- Meridian Camp's and the Dead-Drop's rosters (§8.4, §8.5; #22): no new family, the deep
  knockers first met below the camp, and the Hand never met below the Tide Ship's stair, where its
  crews leave the cargo and go back up.

Where this and DESIGN.md disagree, the design wins.

### Open questions

1. **The Compact's crews.** The bargemen and the Wrack smugglers work for the Compact, whose line
   the company can take up (DESIGN.md §10.2). Either killing them sets the Compact against the
   company, or the crews who carry the Hand's cargo have left the Compact for the Hand's coin. The
   Compact's line should say which.
   *Answered (#151, call 4): the crews who carry the Hand's cargo have left the Compact for the
   Hand's coin. Killing them costs nothing with the guild, whose line stays open to any company.*
2. **What the giants are.** They are not among the sleepers, and every people came in the ship
   (DESIGN.md §7). Either they came awake, or they are something else. The monsters need only the
   surface; the design may want the rest.
   *Answered (#443, call 1): they came awake. The crew that built the inside, the heavy hands who
   raised the ranges and set the Stones, never cargo and so in no bay and no count; they stayed on
   the mountain when the rest were put to sleep, and the Stair is the service ramp they were posted
   to keep. §8.1 has what the monsters take of it.*
3. **The reach's bands.** The atlas gives the Buried Tower 26–28 and the Ice Caves 20–22, where the
   reach is at the cap (DESIGN.md §9). The Ice Caves' way in lies in band-20 country, which is
   right; their monsters are the cap's.
   *Answered (#434, call 7; #443, call 5): the reach's bands are the cap's, 30–32, for both. The
   atlas's rows change with the reach's own atlas work in Phase 1.6; until then Rimewater's and the
   Glasswold's docs say so, and Glacier Foot and the Glass are cut from their plans whole.*
4. **What a fight is worth.** From Saltreach on, an area spans two levels over as much as fifteen
   zone maps of land, where Thornmark spans five levels over fewer than six. At the slice's density
   of groups a clear would pay several bands, unless each fight pays far less of a level than
   Thornmark's do. The xp budget settles how much (EXPANSION.md §2.1, §5.2: however many fights an
   area holds, they share one budget, set so that three quarters of it reach the next floor), but it
   decides whether a fight on the road is worth having, and the country's floor of groups may want
   to sit looser than its floor of features (EXPANSION.md §5.3).

---

## 13. The bounds' lairs

The lairs of DESIGN.md §9's eight artifacts, one in each area the bounds build out (#828), each one
or two levels at the cap's band, 30–32 (#845). Each holds one guardian, its boss: a new kind in a
family already drawn, eight families for the eight and none of them new, so each drawing is one
small creatures pull request in its family's module (EXPANSION.md §8.1), after #846 names it; the
families register their kinds since #919. Each stands at 32, the band's top, as the road's bosses
stand at theirs, and is judged at the lair's floor of 30 (#845; EXPANSION.md §5.2). Its numbers are
set by its lair's gate, off the harness's line at the cap, with a word on its row that says so
(`offLine`; §4.1, §4.2): the seven built have theirs, and the Old Chanter, drawn and defined before
its lair, stands on the line's boss at 32 with no word until Saltreach's lair (#830) sets its
numbers. So this names the role and the shape and no hit points. Where it can, a guardian answers
what its lair holds, and a company that has fought it knows what it has found. The lair's other
groups are its brief's, from kinds already drawn.

| Monster | Family | Role, level | Where | Look; what it does |
|---|---|---|---|---|
| The Hag | long bodies, new kind | boss, 32 | Hag Hole, the Foreland's sea cave behind E4's cliff; it keeps the Hagstone | *No eyes, and it found you first.* Holds (paralysis) |
| The Old Chanter | skeleton, new kind | boss, 32 | Saltreach's drowned mound, A5; the Telstok | *The first of the chanters, and it still sings the old song.* Blesses itself and curses; dead, so sleep and nature do nothing to it and holy half again |
| Old Nick | devilfish, new kind | boss, 32 | Nick's Locker, Wrackholm's sea cave under F5's reef; Holdfast | *What the smugglers fed first.* Size 2; reaches the back row; its hits heal it |
| The Steiger | knockers, new kind | boss, 32 | the Randzeche, the Kilns' old working behind P5's adit; the Erzhemd | *It knocks once, and the whole seam answers.* A machine; calls a group of deep knockers |
| The Rim Troll | ogre, new kind | boss, 32 | Bearn Liath, Cairnmoor's cleft in P7's rim; Torhide | *The rim stood up.* Size 2; mends unless burned |
| The Infirmarer | keepers, new kind | boss, 32 | the Spittal, Rimewater's house under the pass, its door on K12; the Wakerobe | *No robe, too many fingers and a bed made up for you.* A machine; its touch puts to sleep, and it mends itself |
| The Foal-taker | birds, new kind | boss, 32 | Kushdag, the Glasswold's eyrie in the Scarp's east face, its door on D7; Akkush | *When its shadow crosses the herd, the herd runs.* Size 1.8; flies, and hunts the back row |
| The Grave Drake | drakes, new kind | boss, 32 | Grim's Howe, Ashfall's grave under F12's dam; Grim's Axe | *Asleep on a warlord's grave, and the grave is warm.* Size 2; burns a row |

Each ask is built (§3.3): holding, casting, curse, drain, calls, regeneration, the touch that puts
to sleep, flight and the sweep, so no guardian waits on the systems lane.
