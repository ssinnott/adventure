# The Shelf

The first step of the road of levels, band 1–5: the coast below the rim, where a company starts in
Harrow and earns the pass east into Thornmark. Its content is in `src/content/areas/shelf/` (maps,
monsters, items, quests, climate) and its businesses' rooms in `src/ui/interiors/shelf/`. The
systems it runs on are in [SLICE.md](../SLICE.md).

## What is built

- **Harrow** (town, 16×16): inn (rest, rations), temple (cure and raise, priced by level), shop
  (buy and sell), Lantern Guildhall (join, then buy tier-2 spells), Warden Drillyard (train a level
  when the xp allows; levels are bought, not automatic), the Gilded Eel tavern (rumours), Lord Vask
  (the contract and the hand-in), a well, a sign.
- **The Shelf** (outdoor zone, 32×32): road, woods, hills, marsh, the coast, eight roaming or lurking
  monster groups with respawn timers, the Ashcombe farm. It and Thornmark are played as one
  outdoors ([SLICE.md](../SLICE.md), "The outdoors as one map").
- **Ashcombe Cellar** (dungeon, 16×16): four rings, an iron key, a locked door, a secret door, the
  dead Lantern and her survey wand, the Rift and its Warden.
- **Greywater** (two dungeon levels, 16×16 each, band 2–5): smugglers' caves in the south-west
  cliffs, reached from the beach. Level one, the Greywater Caves: smugglers, shore crabs and drowned
  men, a secret stash, and the captain's den with the iron key to the stairs. Level two, the Drowned
  Shrine: an Ashen cult's galleries around a sealed shrine; a secret vestry holds the key, and the
  Ashen Deacon guards the Greywater Ledger. Captain Hale at the pass checkpoint gives the contract
  and takes the ledger. Chests carry the Shelf's mid-tier gear (long sword, kite shield, scale,
  chain, long bow).
- **The ramp to Thornmark.** The pass needs both `q_ashcombe_done` and `q_greywater_done` (an exit's
  `needFlag` may list several flags; on the outdoors the Shelf's exit into Thornmark became a gate
  on the road through the pass, with the same flags and words). The slice's early monsters give about double their old xp, so
  one clear of the Shelf and the cellar is worth level 2 per member, and adding Greywater is worth
  level 4 (tests pin both); respawns make up the step to Thornmark's band 5.
- **Weather.** Mild and wet, foggy off the sea in the autumn, with snow only in a cold snap. Maps
  with no `region` are the Shelf's.

## Tests

No walkthrough of its own yet. The end-to-end tests of today (the pass, the stairs, the quests
walked through) cross between the Shelf and Thornmark, so they stay in `tools/tests/`; an area's
`walkthrough.ts`, which `tools/test.ts` finds and runs, comes with its chapter of the one quest.
