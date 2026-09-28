# Names: how Caldera's places are named

How the world's places get their names, so that they say something and each people's names sound
like one tongue, rather than "[material] + [feature]" or a bare description (Wind Cave, Old Tower,
Captain's Farm). The Foreland is the first area named this way; the rest follow as each area is
built or given a naming pass of its own.

---

## 1. Two layers

- **The people's names.** Each people names its country in its own tongue, from a small set of
  name parts with meanings, the way English place-names are made: whose farm it was, what grew
  there, what the land does, what happened there. A name says one plain thing about its place.
- **The old names.** A few of the oldest places keep the names the first crew gave them four
  hundred years ago, in words worn down until they pass for the people's own. Read after Act IV,
  they are the vessel's: a helm, a crow's nest, a berth. Nothing in the game ever says so (DESIGN
  §7: the player finds the secret, and is never told it). A few to an area at most, and only on
  its oldest places: a capital, a Stone, a landmark the first people saw.

## 2. The tongues

| People | Their country | Modelled on | Name parts |
|---|---|---|---|
| The Foreland folk, the Crown's own | the Foreland | English place-names, Old English and Old Norse | -stow (place), -wick and wyke (bay, landing), -ness (headland), -combe (valley), -by (farm), -holt (wood), scarth (notch), -don and down (hill), hole (sea cave), harbour (shelter), mew (gull), brock (badger), callow (bare), kestrel, crow |
| Thornmark's elves | Thornmark, the Deepthorn | to choose, with Thornmark's naming pass | |
| The Tidefolk | Saltreach, Wrackholm | to choose | |
| The dwarves | the Kilns | to choose, beside Kiln-script | |
| The Wold Riders | the Glasswold | to choose | |

## 3. Rules

- **Short.** A name fits the world map's lettering and the status strip: two words at most, and
  about twelve letters for a place the map letters.
- **Only the font's glyphs.** Capitals, digits and a few marks (`FONT_CHARS`,
  `src/lib/engine/text.ts`): no accents.
- **British spelling,** as the rest of the game has it.
- **One place, one name.** A place may lend its name to one near it, the way a light takes its
  headland's, but no name runs through five places the way Harrow did.
- **Ids stay.** Saves hold ids, not names (EXPANSION §5.5), so a map, zone, item or quest keeps its
  id when its name changes: `harrow` is Helmstow, `shelf` the Foreland. A spell hall's name is the
  flag of the fee paid to study there (`guild_<hall name>`, `guildFlag` in `src/game/party.ts`,
  #34), so a hall is renamed only with a save upgrade.
- **A rename is one sweep.** Every use of the name in `src/`, `tools/` and `docs/`, the texts
  included, in one change. The issues keep the old names until they are edited.

## 4. The areas

- **The Foreland** (step I, once the Shelf): named on 27 September 2026. `docs/areas/shelf.md` §10
  has its names, what each means and what it replaced.
- **The rest:** with their areas.
