# Roster

Made by `node tools/roster.ts` from the monsters' defs (#1024); never edited by hand. The monsters
by area in road order, as each area's `monsters.ts` lists them, a row to each def: its family (the
module of `src/ui/monsters/` that registers its drawing), its kind and level, its numbers, its
look and what it can do; then the families. It holds nothing a map decides: where a monster is met
is the maps' to say, and its area's doc says it. A pull request that adds or changes a monster runs
the tool: the `roster` suite names the rows of a stale roster, and a conflict here is mended by
running the tool. What the monsters are for, their kinds and how their numbers are made is
[MONSTERS.md](MONSTERS.md).

Blow is a hit's dice; gold is what each drops. What it does is the def's own: its kind's (MONSTERS
§2) are not repeated.

## The Foreland (`shelf`)

| Monster | Family | Kind | Level | HP | Armour | To hit | Blow | Speed | XP | Gold | Look | What it does |
|---|---|---|---:|---:|---:|---:|---|---:|---:|---|---|---|
| Giant Rat (`rat`) | rat | beast | 1 | 4 | 11 | +1 | 1d3 | 12 | 10 | 0–2 |  | diseases, 0.1 a hit |
| Cellar Slime (`slime`) | slime | beast | 1 | 7 | 9 | +1 | 1d4 | 6 | 14 | 0 |  | shrugs off sleep |
| Wolf (`wolf`) | wolf | beast | 2 | 9 | 12 | +2 | 1d6 | 14 | 25 | 0 |  |  |
| Wild Boar (`boar`) | boar | beast | 3 | 14 | 12 | +3 | 1d8+1 | 10 | 40 | 0 |  |  |
| Marsh Spider (`spider`) | spider | beast | 2 | 8 | 13 | +2 | 1d4 | 13 | 28 | 0 |  | poisons, 0.3 a hit |
| Bandit (`bandit`) | bandit | person | 2 | 10 | 13 | +2 | 1d8 | 10 | 32 | 3–12 |  |  |
| Bandit Archer (`bandit_archer`) | bandit | person | 3 | 8 | 12 | +3 | 1d6 | 11 | 35 | 3–10 |  | reaches the back row with a bow |
| Ashen Cultist (`cultist`) | cultist | person | 2 | 12 | 12 | +3 | 1d6+2 | 10 | 50 | 5–20 |  | never breaks |
| Skeleton (`skeleton`) | skeleton | dead | 4 | 13 | 13 | +3 | 1d8+1 | 8 | 55 | 0–6 |  |  |
| Riftling (`riftling`) | riftling | rift | 6 | 11 | 14 | +3 | 2d4 | 15 | 60 | 0 |  | paralyses, 0.1 a hit |
| Rift Warden (`rift_warden`) | riftling | rift | 4 | 125 | 15 | +6 | 2d6+3 | 12 | 300 | 20–40 |  | shrugs off sleep |
| Shore Crab (`shore_crab`) | spider | beast | 2 | 16 | 15 | +3 | 1d6+1 | 8 | 60 | 0 |  | shrugs off sleep |
| Smuggler (`smuggler`) | bandit | person | 3 | 18 | 13 | +4 | 1d8+1 | 11 | 70 | 6–18 |  |  |
| Smuggler Bowman (`smuggler_bowman`) | bandit | person | 3 | 14 | 13 | +4 | 1d6+1 | 12 | 75 | 5–15 |  | reaches the back row with a bow |
| Smuggler Captain (`smuggler_captain`) | bandit | person | 4 | 95 | 14 | +5 | 2d6+4 | 12 | 400 | 40–80 |  |  |
| Drowned Man (`drowned`) | skeleton | dead | 3 | 20 | 13 | +4 | 1d8 | 9 | 100 | 0–8 |  | diseases, 0.15 a hit |
| Ghoul (`ghoul`) | skeleton | dead | 4 | 22 | 13 | +4 | 1d6+2 | 9 | 95 | 0–6 |  | paralyses, 0.1 a hit |
| Ashen Acolyte (`ashen_acolyte`) | cultist | person | 4 | 20 | 13 | +5 | 2d4+1 | 11 | 110 | 8–20 |  | reaches the back row; never breaks |
| Rift Crawler (`rift_crawler`) | spider | rift | 4 | 20 | 14 | +4 | 1d6+1 | 14 | 115 | 0 |  | poisons, 0.25 a hit |
| Ashen Deacon (`ashen_deacon`) | cultist | person | 5 | 175 | 15 | +6 | 2d8+5 | 12 | 1000 | 60–120 |  | never breaks |
| Carrion Crow (`carrion_crow`) | birds | beast | 2 | 6 | 11 | +1 | 1d4 | 14 | 12 | 0 | *Crows, too many to count, and all of them watching.* | reaches the back row |
| Wrecker (`wrecker`) | bandit | person | 4 | 23 | 13 | +4 | 2d6+1 | 10 | 86 | 4–14 | *Oilskins, a boathook, and a boat they were expecting.* |  |
| Lampman (`lampman`) | bandit | person | 4 | 24 | 13 | +5 | 1d6+1 | 11 | 86 | 3–12 | *A lantern held high on a pole, and someone under it.* | reaches the back row with a bow |
| Black Dog (`black_dog`) | wolf | beast | 5 | 52 | 14 | +5 | 3d6+1 | 15 | 218 | 0 | *A black dog the size of a calf, with eyes like coals.* | paralyses, 0.1 a hit |
| Barrow Guard (`barrow_guard`) | skeleton | dead | 4 | 50 | 16 | +4 | 2d8+3 | 8 | 173 | 0–6 | *The Queen's guard, in her colours, still standing to. They do not turn their heads. They have already seen you.* |  |
| Barrow Captain (`barrow_captain`) | skeleton | dead | 5 | 220 | 16 | +7 | 3d8+8 | 12 | 1140 | 40–80 | *Her captain, at his post beside the bier. He was told to hold it, and nobody has told him otherwise.* |  |
| Chalk Wolf (`chalk_wolf`) | wolf | beast | 4 | 24 | 13 | +4 | 1d6+3 | 15 | 86 | 0 | *Pale as the chalk it runs on, and leaner than the Foreland's.* |  |
| Tusker (`tusker`) | boar | beast | 4 | 67 | 12 | +5 | 3d5+2 | 8 | 173 | 0 | *A boar grown old and huge on beech mast.* |  |
| Barn Rat (`barn_rat`) | rat | beast | 3 | 7 | 12 | +2 | 1d7 | 12 | 32 | 0 | *Rats, fat on someone's grain.* | diseases, 0.1 a hit |
| Footpad (`footpad`) | bandit | person | 3 | 17 | 13 | +3 | 1d6+2 | 11 | 64 | 4–14 | *A short blade, and a coat taken off someone better dressed.* |  |
| Poacher (`poacher`) | bandit | person | 3 | 16 | 13 | +4 | 1d5+1 | 12 | 64 | 3–12 | *A longbow taller than he is, and one of the Queen's hares at his belt.* | reaches the back row with a bow |
| Barnacle Crab (`barnacle_crab`) | spider | beast | 4 | 29 | 15 | +4 | 2d6+4 | 8 | 115 | 0 | *A rock with barnacles on it, until it stands up.* | shrugs off sleep |
| Billman (`billman`) | bandit | person | 4 | 23 | 13 | +4 | 2d6+1 | 10 | 86 | 4–14 | *A bill on a pole, and a man who knows which end to hold.* |  |
| Slinger (`slinger`) | bandit | person | 4 | 24 | 13 | +5 | 1d6+1 | 11 | 86 | 3–12 | *A sling going round, and the Downs have flints to spare.* | reaches the back row with a bow |
| Barrow Wolf (`barrow_wolf`) | wolf | beast | 5 | 52 | 14 | +5 | 3d6+1 | 15 | 218 | 0 | *Grey to the muzzle and big as a pony, and the pack waits on it.* |  |
| Old Rook (`old_rook`) | birds | beast | 4 | 50 | 14 | +5 | 2d6+3 | 15 | 173 | 0 | *Grey in the face, and older than the trees it keeps.* | reaches the back row |
| Cutthroat (`cutthroat`) | bandit | person | 5 | 52 | 14 | +5 | 3d6+1 | 15 | 218 | 10–30 | *A captain's sash on a thief's coat, and a knife for every pocket.* |  |
| The Hag (`hag`) | longbodies | beast | 32 | 2000 | 29 | +26 | 24d8+26 | 13 | 20373 | 0 | *No eyes, and it found you first.* | paralyses, 0.2 a hit |

## Thornmark (`thornmark`)

| Monster | Family | Kind | Level | HP | Armour | To hit | Blow | Speed | XP | Gold | Look | What it does |
|---|---|---|---:|---:|---:|---:|---|---:|---:|---|---|---|
| Dire Wolf (`dire_wolf`) | wolf | beast | 6 | 24 | 14 | +5 | 1d10+1 | 15 | 120 | 0 |  |  |
| Thorn Spider (`thorn_spider`) | spider | beast | 6 | 7 | 17 | +7 | 1d10+2 | 11 | 130 | 0 |  | poisons, 0.4 a hit |
| Brigand (`brigand`) | bandit | person | 6 | 8 | 16 | +7 | 1d8+2 | 11 | 140 | 8–25 |  |  |
| Brigand Archer (`brigand_archer`) | bandit | person | 7 | 20 | 14 | +6 | 1d8+1 | 12 | 150 | 6–20 |  | reaches the back row with a bow |
| Ashen Zealot (`zealot`) | cultist | person | 7 | 30 | 14 | +6 | 1d8+2 | 11 | 190 | 10–30 |  | never breaks |
| Ashen Adept (`ashen_adept`) | cultist | person | 8 | 24 | 15 | +7 | 2d6 | 12 | 240 | 15–40 |  | reaches the back row; never breaks |
| Rift Hound (`rift_hound`) | wolf | rift | 7 | 30 | 15 | +6 | 2d6 | 17 | 250 | 0 |  | paralyses, 0.1 a hit |
| Bone Knight (`bone_knight`) | skeleton | dead | 8 | 40 | 17 | +7 | 1d12+2 | 9 | 280 | 0–15 |  |  |
| Wraith (`wraith`) | wraith | dead | 9 | 32 | 17 | +7 | 2d6 | 13 | 330 | 0 |  | paralyses, 0.2 a hit |
| Riftling Elder (`riftling_elder`) | riftling | rift | 9 | 45 | 16 | +7 | 3d4+2 | 15 | 440 | 0 |  | paralyses, 0.15 a hit |
| Ogre (`ogre`) | ogre | person | 7 | 60 | 14 | +7 | 2d8+2 | 8 | 520 | 15–50 |  |  |
| Hand of Ash (`ashen_hand`) | cultist | person | 10 | 440 | 17 | +12 | 4d8+13 | 13 | 2000 | 100–200 |  | never breaks |
| Warden of the Cut (`cut_warden`) | riftling | rift | 10 | 450 | 18 | +12 | 4d8+15 | 12 | 3000 | 50–100 |  | shrugs off sleep |
| Great Owl (`great_owl`) | birds | beast | 8 | 57 | 15 | +6 | 2d6+2 | 15 | 176 | 0 | *Wings as wide as a cart, and not a sound.* | reaches the back row |
| Bramble (`bramble`) | oldwood | beast | 8 | 57 | 15 | +6 | 2d6+2 | 6 | 176 | 0 | *A thicket that closes behind you.* | paralyses, 0.3 a hit |
| Rootwalker (`rootwalker`) | oldwood | beast | 9 | 83 | 18 | +6 | 2d6+3 | 8 | 265 | 0 | *A stump walking on its roots, its bark like plate.* |  |
| Heartwood (`heartwood`) | oldwood | beast | 10 | 165 | 15 | +8 | 3d8+2 | 8 | 443 | 0 | *An oak that has decided to move.* |  |
| The Eldest (`eldest`) | oldwood | beast | 10 | 450 | 18 | +12 | 4d8+12 | 12 | 3000 | 0 | *The oldest tree in Caldera, and it is awake.* | shrugs off sleep |

## Saltreach (`saltreach`)

| Monster | Family | Kind | Level | HP | Armour | To hit | Blow | Speed | XP | Gold | Look | What it does |
|---|---|---|---:|---:|---:|---:|---|---:|---:|---|---|---|
| Brineling (`brineling`) | riftling | rift | 10 | 89 | 16 | +7 | 2d6+3 | 15 | 393 | 0 | *Green glass, walking, with a light in it.* | paralyses, 0.1 a hit; shrugs off cold; weak to lightning |
| Bargeman (`bargeman`) | bandit | person | 10 | 90 | 16 | +7 | 2d6+3 | 11 | 393 | 12–35 | *A barge pole, a knife, and no questions.* |  |
| Barge Master (`barge_master`) | bandit | person | 11 | 113 | 17 | +7 | 1d10+6 | 11 | 433 | 40–100 | *A ledger in one hand and a cudgel in the other.* |  |
| Drowned Man (`temple_drowned`) | skeleton | dead | 11 | 219 | 15 | +8 | 3d8+3 | 8 | 867 | 0–15 | *It roped the stone to its own neck, and it has not let go.* |  |
| Drowned Chanter (`drowned_chanter`) | skeleton | dead | 11 | 141 | 17 | +9 | 2d8+3 | 12 | 578 | 0–15 | *A priest of the drowned god, still chanting.* | reaches the back row; casts Slumber, 0.1 a turn |
| The Choirmaster (`choirmaster`) | skeleton | dead | 12 | 825 | 20 | +11 | 11d8+15 | 13 | 1565 | 60–120 | *The choir's master, beating time on a bell.* | casts Bless, every turn |
| Fen Eel (`fen_eel`) | longbodies | beast | 10 | 89 | 16 | +7 | 2d6+3 | 15 | 393 | 0 | *A back as thick as a man's leg, turning in the reeds.* |  |
| Fen Toad (`fen_toad`) | toads | beast | 10 | 87 | 16 | +7 | 2d6+3 | 12 | 393 | 0 | *A toad the size of a sheep, its skin weeping.* | poisons, 0.3 a hit |
| Grey Heron (`grey_heron`) | birds | beast | 10 | 89 | 16 | +7 | 2d6+3 | 15 | 393 | 0 | *Taller than Bram, and it has been watching.* | reaches the back row |
| Salt Crab (`salt_crab`) | spider | beast | 11 | 127 | 19 | +7 | 3d7+3 | 8 | 578 | 0 | *White with salt, and it glitters when it moves.* | shrugs off sleep |
| Leech (`leech`) | longbodies | beast | 10 | 87 | 16 | +7 | 2d6+3 | 12 | 393 | 0 | *Black, and as long as your arm.* | its hits heal it |
| Bull Toad (`bull_toad`) | toads | beast | 12 | 278 | 16 | +9 | 3d7+6 | 8 | 947 | 0 | *It could swallow Ottilie whole.* | diseases, 0.15 a hit |

## Wrackholm (`wrackholm`)

| Monster | Family | Kind | Level | HP | Armour | To hit | Blow | Speed | XP | Gold | Look | What it does |
|---|---|---|---:|---:|---:|---:|---|---:|---:|---|---|---|
| Devilfish (`devilfish`) | devilfish | beast | 13 | 142 | 18 | +8 | 2d8+4 | 12 | 513 | 0 | *Arms, coming up over the side.* | reaches the back row; paralyses, 0.2 a hit |
| Great Devilfish (`great_devilfish`) | devilfish | beast | 14 | 650 | 20 | +11 | 12d7+15 | 13 | 8853 | 0 | *What the smugglers feed.* | reaches the back row; paralyses, 0.2 a hit; shrugs off sleep |
| Ashen Overseer (`ashen_overseer`) | cultist | person | 13 | 142 | 18 | +8 | 2d8+4 | 12 | 513 | 20–50 | *Grey to the wrist, and a chain in each hand.* | paralyses, 0.25 a hit; never breaks |
| Wrack Smuggler (`wrack_smuggler`) | bandit | person | 12 | 138 | 17 | +8 | 2d8+4 | 11 | 473 | 15–40 | *A Compact knife in a Helmstow coat.* |  |
| Wrack Bowman (`wrack_bowman`) | bandit | person | 12 | 138 | 17 | +9 | 2d6+3 | 12 | 473 | 12–35 | *A bow, and the high ground.* | reaches the back row with a bow |
| Bilge Rat (`bilge_rat`) | rat | beast | 12 | 107 | 16 | +7 | 1d6+3 | 12 | 237 | 0 | *The rats aboard have been eating well.* | diseases, 0.15 a hit |
| Wrack Gull (`wrack_gull`) | birds | beast | 12 | 107 | 16 | +7 | 1d6+3 | 12 | 237 | 0 | *A thousand gulls, and all of them angry.* | reaches the back row |
| Tide Elder (`tide_elder`) | riftling | rift | 13 | 270 | 18 | +9 | 3d8+3 | 15 | 1027 | 0 | *A shard of the sea, stood up.* | paralyses, 0.15 a hit |
| Warden of the Tide (`tide_warden`) | riftling | rift | 14 | 780 | 20 | +11 | 12d7+18 | 13 | 8853 | 0 | *The Stone's own light, standing guard over it.* | shrugs off sleep |
| Loader (`loader`) | machines | machine | 26 | 692 | 23 | +16 | 5d7+10 | 8 | 2067 | 0 | *It carries a crate the size of a cart, and does not set it down.* |  |
| Tally Clerk (`tally_clerk`) | knockers | machine | 26 | 321 | 24 | +15 | 4d8+3 | 11 | 1033 | 0 | *It counts the crates, then turns and counts you.* | calls 2 Loaders, 0.5 a turn |
| Hold Keeper (`hold_keeper`) | keepers | machine | 27 | 376 | 25 | +15 | 5d7+7 | 12 | 1073 | 0 | *It carries water to the pens, and nobody is in them.* | puts to sleep, 0.3 a hit; casts Mend, 0.25 a turn |
| The Tallymaster (`tallymaster`) | keepers | machine | 28 | 1552 | 27 | +18 | 28d8+50 | 13 | 17813 | 0 | *It writes, and does not look up.* | calls 2 Tally Clerks, 0.5 a turn |
| Old Nick (`old_nick`) | devilfish | beast | 32 | 1600 | 29 | +20 | 20d8+20 | 13 | 20373 | 0 | *What the smugglers fed first.* | reaches the back row; its hits heal it |

## Sunderwood (`sunderwood`)

| Monster | Family | Kind | Level | HP | Armour | To hit | Blow | Speed | XP | Gold | Look | What it does |
|---|---|---|---:|---:|---:|---:|---|---:|---:|---|---|---|
| Pine Bear (`pine_bear`) | bears | beast | 14 | 334 | 17 | +10 | 4d8+2 | 8 | 1107 | 0 | *A bear, and then the rest of the bear.* |  |
| Sunderling (`sunderling`) | riftling | rift | 14 | 156 | 18 | +9 | 2d8+4 | 15 | 553 | 0 | *Black glass, with a white light inside.* | paralyses, 0.1 a hit |
| Warden of the Sunder (`sunder_warden`) | riftling | rift | 16 | 1020 | 21 | +12 | 13d8+13 | 13 | 10133 | 0 | *The Sunder's own knot, and it has held for centuries.* | shrugs off sleep |
| Ashen Gleaner (`ashen_gleaner`) | cultist | person | 15 | 171 | 19 | +9 | 3d8+2 | 11 | 593 | 25–60 | *A sack of glowing shards, and a knife for the next.* | never breaks |
| Glass Spider (`glass_spider`) | spider | beast | 15 | 181 | 19 | +9 | 2d8+4 | 12 | 593 | 0 | *Threads of glass, and something walking them.* | paralyses, 0.25 a hit |
| Sunder Hound (`sunder_hound`) | wolf | rift | 15 | 167 | 19 | +9 | 3d8+1 | 15 | 593 | 0 | *A rift hound, gone to glass.* | paralyses, 0.15 a hit; shrugs off cold; weak to fire |
| Lantern Moth (`lantern_moth`) | moths | beast | 14 | 118 | 17 | +8 | 2d6+2 | 12 | 277 | 0 | *Wings like a pair of hands, and dust that glitters.* | reaches the back row; puts to sleep, 0.2 a hit |
| Glass Bear (`glass_bear`) | bears | beast | 16 | 249 | 21 | +10 | 3d7+6 | 8 | 844 | 0 | *Glass through its fur like frost.* | shrugs off fire |
| Deathshead (`deathshead`) | moths | beast | 16 | 351 | 20 | +11 | 3d8+6 | 15 | 1267 | 0 | *A skull on its back, and a scream in its wings.* | reaches the back row; puts to sleep, 0.35 a hit |

## The Kilns (`kilns`)

| Monster | Family | Kind | Level | HP | Armour | To hit | Blow | Speed | XP | Gold | Look | What it does |
|---|---|---|---:|---:|---:|---:|---|---:|---:|---|---|---|
| Knocker (`knocker`) | knockers | machine | 16 | 127 | 18 | +9 | 3d5+2 | 12 | 317 | 0 | *Something small and grey, knocking on the rock as it comes.* |  |
| Mender (`mender`) | knockers | machine | 17 | 199 | 20 | +10 | 3d8+4 | 11 | 673 | 0 | *It stops to mend the others, and they let it.* | casts Mending Light, 0.5 a turn |
| The Foreman (`foreman`) | knockers | machine | 18 | 1500 | 22 | +13 | 15d8+14 | 13 | 11413 | 0 | *It checks you the way a clerk checks a list, and finds nobody on it.* |  |
| Fire Beetle (`fire_beetle`) | spider | beast | 16 | 249 | 21 | +10 | 3d7+6 | 8 | 844 | 0 | *A beetle with a coal in its back.* | shrugs off fire |
| Slagling (`slagling`) | riftling | rift | 16 | 179 | 19 | +10 | 3d8+2 | 15 | 633 | 0 | *Slag, walking, with a red iron heart.* | paralyses, 0.1 a hit; resists fire; weak to cold |
| Rock Worm (`rock_worm`) | longbodies | beast | 17 | 404 | 18 | +11 | 4d8+7 | 8 | 1347 | 0 | *This tunnel was not dug by dwarves.* |  |
| Anvil Guard (`anvil_guard`) | bandit | person | 17 | 250 | 22 | +10 | 3d7+6 | 8 | 898 | 30–70 | *Short, broad, and in the thane's iron.* |  |
| Slag Elder (`slag_elder`) | riftling | rift | 18 | 365 | 21 | +12 | 4d8+3 | 15 | 1427 | 0 | *Iron runs off it like sweat.* | paralyses, 0.15 a hit; resists fire; weak to cold |
| Warden of the Anvil (`anvil_warden`) | riftling | rift | 18 | 1200 | 22 | +13 | 13d8+12 | 13 | 11413 | 0 | *The Stone's heat, standing up out of the cut.* | shrugs off sleep; resists fire; weak to cold |
| Salamander (`salamander`) | salamanders | beast | 16 | 179 | 19 | +10 | 3d8+2 | 15 | 633 | 0 | *A lizard with the fire showing through its skin.* | shrugs off fire; weak to cold |
| Great Salamander (`great_salamander`) | salamanders | beast | 18 | 950 | 22 | +13 | 15d8+14 | 13 | 11413 | 0 | *The fire in the rock, with a head.* | shrugs off sleep and fire; weak to cold |
| The Steiger (`steiger`) | knockers | machine | 32 | 2400 | 29 | +24 | 18d8+20 | 13 | 20373 | 0 | *It knocks once, and the whole seam answers.* | calls 3 Deep Knockers, 0.5 a turn |

## Cairnmoor (`cairnmoor`)

| Monster | Family | Kind | Level | HP | Armour | To hit | Blow | Speed | XP | Gold | Look | What it does |
|---|---|---|---:|---:|---:|---:|---|---:|---:|---|---|---|
| Raven (`raven`) | birds | beast | 18 | 132 | 19 | +10 | 2d8+4 | 12 | 357 | 0 | *They were here first.* | reaches the back row |
| Bog Light (`bog_light`) | lights | rift | 18 | 117 | 20 | +11 | 2d6+2 | 12 | 713 | 0 | *A light over the bog, where nobody is.* | reaches the back row; its hits take spell points first |
| Bog Body (`bog_body`) | skeleton | dead | 18 | 200 | 20 | +11 | 3d7+5 | 11 | 713 | 0 | *Leather over bone, and a rope still round its neck.* | diseases, 0.2 a hit |
| Moor Hound (`moor_hound`) | wolf | beast | 19 | 270 | 21 | +11 | 3d7+5 | 15 | 753 | 0 | *The Downs' black dog, grown old and huge.* | paralyses, 0.15 a hit |
| Cairn Wight (`cairn_wight`) | wraith | dead | 19 | 232 | 21 | +11 | 4d8+3 | 12 | 753 | 20–60 | *A shroud with grave-gold at its throat.* | curses, 0.2 a hit |
| Tor Troll (`tor_troll`) | ogre | beast | 19 | 397 | 19 | +12 | 5d8+4 | 8 | 1507 | 0 | *A tor that stood up.* | mends 40 a round unless burnt |
| The Cairn King (`cairn_king`) | skeleton | dead | 20 | 1800 | 23 | +14 | 16d8+14 | 13 | 12693 | 150–300 | *Crowned, and older than the crown.* | curses, 0.2 a hit |
| The Rim Troll (`rim_troll`) | ogre | beast | 32 | 2700 | 26 | +22 | 25d8+18 | 8 | 20373 | 0 | *The rim stood up.* | mends 80 a round unless burnt |

## Rimewater (`rimewater`)

| Monster | Family | Kind | Level | HP | Armour | To hit | Blow | Speed | XP | Gold | Look | What it does |
|---|---|---|---:|---:|---:|---:|---|---:|---:|---|---|---|
| Ice Pike (`ice_pike`) | longbodies | beast | 20 | 288 | 21 | +12 | 3d7+5 | 15 | 793 | 0 | *The ice under Ottilie's feet has an eye in it.* |  |
| Snow Lynx (`snow_lynx`) | cats | beast | 20 | 288 | 21 | +12 | 3d7+5 | 15 | 793 | 0 | *Grey, tufted, and it has already jumped.* | reaches the back row |
| Tallyman (`tallyman`) | knockers | machine | 20 | 314 | 21 | +12 | 3d7+5 | 11 | 793 | 0 | *It stops and clicks, once for each of you.* | calls 3 Knockers, 0.5 a turn |
| Ice Bear (`ice_bear`) | bears | beast | 21 | 570 | 20 | +13 | 5d7+7 | 8 | 1667 | 0 | *White, and bigger than the last one.* |  |
| Bay Keeper (`bay_keeper`) | keepers | machine | 21 | 248 | 22 | +12 | 4d8+2 | 12 | 833 | 0 | *Tall and grey, with too many fingers, and gentle.* | puts to sleep, 0.3 a hit; casts Mend, 0.25 a turn |
| The Matron (`matron`) | keepers | machine | 22 | 1900 | 24 | +15 | 17d8+18 | 13 | 13973 | 0 | *It has tended them for four hundred years.* | casts Mend, 0.1 a turn |
| The Infirmarer (`infirmarer`) | keepers | machine | 32 | 2100 | 29 | +22 | 26d8+30 | 13 | 20373 | 0 | *No robe, too many fingers and a bed made up for you.* | puts to sleep, 0.3 a hit; casts Mend, 0.1 a turn |

## The Whitespine (`whitespine`)

| Monster | Family | Kind | Level | HP | Armour | To hit | Blow | Speed | XP | Gold | Look | What it does |
|---|---|---|---:|---:|---:|---:|---|---:|---:|---|---|---|
| Brother (`brother`) | keepers | machine | 22 | 317 | 22 | +13 | 4d8+2 | 11 | 873 | 0 | *A monk, walking as if someone had described walking to it.* |  |
| Bell-ringer (`bell_ringer`) | keepers | machine | 23 | 284 | 23 | +13 | 4d8+2 | 12 | 913 | 0 | *Eleven strokes, a gap, and eleven more.* | reaches the back row; paralyses, 0.2 a hit |
| The Abbot (`abbot`) | keepers | machine | 24 | 1700 | 25 | +16 | 19d8+16 | 13 | 15253 | 0 | *The abbot keeps the hours, and it is time.* |  |
| Spine Eagle (`spine_eagle`) | birds | beast | 22 | 328 | 22 | +13 | 3d7+6 | 15 | 873 | 0 | *It takes the light out of the sky as it comes down.* | reaches the back row |
| Snow Troll (`snow_troll`) | ogre | beast | 23 | 474 | 21 | +14 | 5d7+8 | 8 | 1827 | 0 | *A drift that stood up.* | mends 47 a round unless burnt |
| Ashen Mason (`ashen_mason`) | cultist | person | 23 | 319 | 23 | +13 | 4d8+2 | 11 | 913 | 45–100 | *A hammer from below, and a shard to set.* | never breaks |
| Stair Giant (`stair_giant`) | giants | person | 23 | 537 | 21 | +14 | 4d7+8 | 8 | 1827 | 70–160 | *A man as tall as a house, holding out his hand.* | sweeps a row, 0.25 a turn |
| The Stair-king (`stair_king`) | giants | person | 24 | 1650 | 25 | +16 | 16d8+16 | 13 | 15253 | 250–500 | *He has taken the toll here since before Helmstow.* | sweeps a row, 0.25 a turn |

## Ashfall (`ashfall`)

| Monster | Family | Kind | Level | HP | Armour | To hit | Blow | Speed | XP | Gold | Look | What it does |
|---|---|---|---:|---:|---:|---:|---|---:|---:|---|---|---|
| Strangler Vine (`strangler_vine`) | oldwood | beast | 24 | 284 | 23 | +14 | 3d8+6 | 6 | 953 | 0 | *The vines hang lower than they did.* | paralyses, 0.3 a hit |
| Cinder Beetle (`cinder_beetle`) | spider | beast | 24 | 397 | 25 | +14 | 4d8+5 | 8 | 1271 | 0 | *Its shell is the colour of the beach.* | shrugs off fire |
| Ember Salamander (`ember_salamander`) | salamanders | beast | 24 | 330 | 23 | +14 | 3d8+4 | 16 | 953 | 0 | *Grown in the mountain's own fire.* | shrugs off fire; weak to cold |
| Ash Husk (`ash_husk`) | skeleton | dead | 25 | 320 | 24 | +14 | 4d8+2 | 10 | 993 | 0 | *A man of ash, still holding his cup.* |  |
| Cinder Drake (`cinder_drake`) | drakes | beast | 25 | 584 | 22 | +15 | 5d8+3 | 8 | 1987 | 0 | *The mountain has children.* | reaches the back row; breathes fire on a row, 0.25 a turn; shrugs off fire |
| The Old Drake (`old_drake`) | drakes | beast | 26 | 1000 | 26 | +17 | 21d7+32 | 13 | 16533 | 0 | *The mountain's eldest, asleep on what is left of the town.* | breathes fire on a row, 0.25 a turn; shrugs off fire |
| Stoker (`stoker`) | machines | machine | 25 | 665 | 22 | +15 | 5d8+8 | 8 | 1987 | 0 | *It shovels nothing into nothing, and turns as you come.* | shrugs off fire |
| Sentry (`sentry`) | machines | machine | 26 | 597 | 25 | +16 | 5d8+4 | 15 | 2067 | 0 | *It is looking for whoever touched the Stones.* | paralyses, 0.15 a hit |
| The Sentinel (`sentinel`) | machines | machine | 26 | 1400 | 26 | +17 | 25d7+42 | 13 | 16533 | 0 | *The first thing up through the doors.* |  |
| Drakeling (`drakeling`) | drakes | beast | 26 | 191 | 23 | +14 | 3d8+4 | 12 | 517 | 0 | *The mountain's youngest. Its crust has not set.* | reaches the back row; shrugs off fire |
| The Brood Drake (`brood_drake`) | drakes | beast | 27 | 1250 | 26 | +17 | 19d7+28 | 13 | 17173 | 0 | *It will not leave the eggs.* | reaches the back row; breathes fire on a row, 0.25 a turn; shrugs off fire |
| Flue Walker (`flue_walker`) | machines | machine | 27 | 670 | 25 | +16 | 7d8+7 | 15 | 2147 | 0 | *It walks the corridor to its end, and back.* | paralyses, 0.15 a hit; shrugs off fire |
| Deep Knocker (`deep_knocker`) | knockers | machine | 28 | 523 | 27 | +16 | 6d8+5 | 8 | 1484 | 0 | *Still knocking, on a wall that has never cracked.* |  |
| Inspector (`inspector`) | knockers | machine | 28 | 408 | 25 | +16 | 5d7+8 | 11 | 1113 | 0 | *It holds its light to the wall, and then to you.* | calls 3 Deep Knockers, 0.5 a turn |
| The Grave Drake (`grave_drake`) | drakes | beast | 32 | 1600 | 29 | +20 | 27d8+28 | 13 | 20373 | 0 | *Asleep on a warlord's grave, and the grave is warm.* | breathes fire on a row, 0.25 a turn; shrugs off fire |

## The Glasswold (`glasswold`)

| Monster | Family | Kind | Level | HP | Armour | To hit | Blow | Speed | XP | Gold | Look | What it does |
|---|---|---|---:|---:|---:|---:|---|---:|---:|---|---|---|
| Vulture (`vulture`) | birds | beast | 26 | 191 | 23 | +14 | 3d8+4 | 12 | 517 | 0 | *They land when something is about to die.* | reaches the back row |
| Wold Lion (`wold_lion`) | cats | beast | 26 | 332 | 24 | +15 | 3d8+6 | 15 | 1033 | 0 | *Tawny as the grass, and seen only when it moves.* |  |
| Glass Scorpion (`glass_scorpion`) | spider | beast | 26 | 290 | 24 | +15 | 4d8+4 | 12 | 1033 | 0 | *Its sting is glass, and so is its shell.* | poisons, 0.35 a hit |
| Basilisk (`basilisk`) | salamanders | beast | 27 | 376 | 25 | +15 | 5d7+7 | 12 | 1073 | 0 | *Don't meet its eyes.* | reaches the back row; turns to stone, 0.15 a hit |
| The Grey Lion (`grey_lion`) | cats | beast | 28 | 3000 | 27 | +18 | 16d8+16 | 13 | 17813 | 0 | *Old, scarred, and king of all of this.* |  |
| Glass Walker (`glass_walker`) | glasswalkers | machine | 27 | 670 | 25 | +16 | 7d8+7 | 15 | 2147 | 0 | *Something walking out of the Glass, and it has walked a long way.* | paralyses, 0.15 a hit |
| The Foal-taker (`foal_taker`) | birds | beast | 32 | 2900 | 29 | +23 | 18d8+20 | 13 | 20373 | 0 | *When its shadow crosses the herd, the herd runs.* | reaches the back row |

## Hearth Isle (`hearth`)

| Monster | Family | Kind | Level | HP | Armour | To hit | Blow | Speed | XP | Gold | Look | What it does |
|---|---|---|---:|---:|---:|---:|---|---:|---:|---|---|---|
| Hearth Moth (`hearth_moth`) | moths | beast | 28 | 280 | 24 | +15 | 3d8+4 | 12 | 557 | 0 | *The sky over the isle is moving.* | reaches the back row; puts to sleep, 0.2 a hit |
| Ashen Champion (`ashen_champion`) | cultist | person | 29 | 435 | 26 | +16 | 5d8+8 | 11 | 1153 | 0 | *The Hand's best, in steel from below.* | never breaks |
| Ashen Preacher (`ashen_preacher`) | cultist | person | 29 | 643 | 26 | +18 | 5d8+8 | 12 | 1538 | 0 | *Still preaching, and the fire is the sermon.* | reaches the back row; casts Fire Bolt or Ward, 0.5 a turn; never breaks |
| Deep Rat (`deep_rat`) | rat | beast | 30 | 281 | 25 | +16 | 3d8+5 | 12 | 597 | 0 | *Rats. Even here.* | diseases, 0.2 a hit |
| Keeper (`keeper`) | keepers | machine | 30 | 435 | 26 | +17 | 5d8+8 | 11 | 1193 | 0 | *A keeper with no bay to keep, and no robe.* | puts to sleep, 0.15 a hit |
| Ashen Rearguard (`hand_rearguard`) | cultist | person | 30 | 640 | 28 | +17 | 5d8+7 | 8 | 1591 | 0 | *The last of the Hand still standing, and standing in the way.* | never breaks |
| Grey Hand (`grey_hand`) | cultist | person | 31 | 785 | 27 | +18 | 7d7+12 | 15 | 2467 | 0 | *Hands the colour of ash, to the shoulder.* | paralyses, 0.15 a hit; never breaks |
| Core Sentry (`core_sentry`) | machines | machine | 31 | 890 | 27 | +17 | 5d7+10 | 11 | 1233 | 0 | *The core's own, and it takes orders from the ring.* | leaves once its leaders fall |
| Lord Vask (`vask`) | cultist | person | 32 | 1850 | 29 | +20 | 22d8+23 | 13 | 20373 | 0 | *A tall man with a quiet voice, and the Queen's ring on his finger.* | calls a Core Sentry, every turn; never breaks |
| Deep Crawler (`deep_crawler`) | crawlers | machine | 31 | 1060 | 25 | +18 | 7d7+10 | 8 | 2467 | 0 | *It comes down from above, on too many legs.* | reaches the back row |
| The Catcher (`catcher`) | crawlers | machine | 31 | 1300 | 28 | +19 | 32d8+37 | 13 | 19733 | 0 | *It caught the Hand on these stairs.* | reaches the back row; paralyses, 0.2 a hit |

## The families

A family is a module of `src/ui/monsters/` that registers the kinds it draws in its `SPRITES`;
each def is a kind of its own. First met is the first area in road order with a def of the family.

| Family | First met | Then |
|---|---|---|
| `rat` | The Foreland (Giant Rat and Barn Rat) | Wrackholm (Bilge Rat); Hearth Isle (Deep Rat) |
| `slime` | The Foreland (Cellar Slime) | none |
| `wolf` | The Foreland (Wolf, Black Dog, Chalk Wolf and Barrow Wolf) | Thornmark (Dire Wolf and Rift Hound); Sunderwood (Sunder Hound); Cairnmoor (Moor Hound) |
| `boar` | The Foreland (Wild Boar and Tusker) | none |
| `spider` | The Foreland (Marsh Spider, Shore Crab, Rift Crawler and Barnacle Crab) | Thornmark (Thorn Spider); Saltreach (Salt Crab); Sunderwood (Glass Spider); The Kilns (Fire Beetle); Ashfall (Cinder Beetle); The Glasswold (Glass Scorpion) |
| `bandit` | The Foreland (Bandit, Bandit Archer, Smuggler, Smuggler Bowman, Smuggler Captain, Wrecker, Lampman, Footpad, Poacher, Billman, Slinger and Cutthroat) | Thornmark (Brigand and Brigand Archer); Saltreach (Bargeman and Barge Master); Wrackholm (Wrack Smuggler and Wrack Bowman); The Kilns (Anvil Guard) |
| `cultist` | The Foreland (Ashen Cultist, Ashen Acolyte and Ashen Deacon) | Thornmark (Ashen Zealot, Ashen Adept and Hand of Ash); Wrackholm (Ashen Overseer); Sunderwood (Ashen Gleaner); The Whitespine (Ashen Mason); Hearth Isle (Ashen Champion, Ashen Preacher, Ashen Rearguard, Grey Hand and Lord Vask) |
| `skeleton` | The Foreland (Skeleton, Drowned Man, Ghoul, Barrow Guard and Barrow Captain) | Thornmark (Bone Knight); Saltreach (Drowned Man, Drowned Chanter and The Choirmaster); Cairnmoor (Bog Body and The Cairn King); Ashfall (Ash Husk) |
| `riftling` | The Foreland (Riftling and Rift Warden) | Thornmark (Riftling Elder and Warden of the Cut); Saltreach (Brineling); Wrackholm (Tide Elder and Warden of the Tide); Sunderwood (Sunderling and Warden of the Sunder); The Kilns (Slagling, Slag Elder and Warden of the Anvil) |
| `birds` | The Foreland (Carrion Crow and Old Rook) | Thornmark (Great Owl); Saltreach (Grey Heron); Wrackholm (Wrack Gull); Cairnmoor (Raven); The Whitespine (Spine Eagle); The Glasswold (Vulture and The Foal-taker) |
| `longbodies` | The Foreland (The Hag) | Saltreach (Fen Eel and Leech); The Kilns (Rock Worm); Rimewater (Ice Pike) |
| `wraith` | Thornmark (Wraith) | Cairnmoor (Cairn Wight) |
| `ogre` | Thornmark (Ogre) | Cairnmoor (Tor Troll and The Rim Troll); The Whitespine (Snow Troll) |
| `oldwood` | Thornmark (Bramble, Rootwalker, Heartwood and The Eldest) | Ashfall (Strangler Vine) |
| `toads` | Saltreach (Fen Toad and Bull Toad) | none |
| `devilfish` | Wrackholm (Devilfish, Great Devilfish and Old Nick) | none |
| `machines` | Wrackholm (Loader) | Ashfall (Stoker, Sentry, The Sentinel and Flue Walker); Hearth Isle (Core Sentry) |
| `knockers` | Wrackholm (Tally Clerk) | The Kilns (Knocker, Mender, The Foreman and The Steiger); Rimewater (Tallyman); Ashfall (Deep Knocker and Inspector) |
| `keepers` | Wrackholm (Hold Keeper and The Tallymaster) | Rimewater (Bay Keeper, The Matron and The Infirmarer); The Whitespine (Brother, Bell-ringer and The Abbot); Hearth Isle (Keeper) |
| `bears` | Sunderwood (Pine Bear and Glass Bear) | Rimewater (Ice Bear) |
| `moths` | Sunderwood (Lantern Moth and Deathshead) | Hearth Isle (Hearth Moth) |
| `salamanders` | The Kilns (Salamander and Great Salamander) | Ashfall (Ember Salamander); The Glasswold (Basilisk) |
| `lights` | Cairnmoor (Bog Light) | none |
| `cats` | Rimewater (Snow Lynx) | The Glasswold (Wold Lion and The Grey Lion) |
| `giants` | The Whitespine (Stair Giant and The Stair-king) | none |
| `drakes` | Ashfall (Cinder Drake, The Old Drake, Drakeling, The Brood Drake and The Grave Drake) | none |
| `glasswalkers` | The Glasswold (Glass Walker) | none |
| `crawlers` | Hearth Isle (Deep Crawler and The Catcher) | none |
