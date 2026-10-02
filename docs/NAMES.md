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
| Thornmark's elves | Thornmark, the Deepthorn | Cornish, the older British of the far west: short parts, spelled as they are said. A few of the Foreland's oldest people carry names of it | pen (head), hen (old), lys (court), coos (wood), dar (oak), spern (thorns), kelli (grove), lyn (pool), dowr (water), rid (ford), hir (long), du (dark), gwyn (white) |
| The Tidefolk | Saltreach: the fen, the villages, the temples' island | Frisian, the low coast of dykes and tidal flats | wierde (a mound above the flood), -um (home), riet (reed), syl (a sluice, a way through), diep (channel), skor (salt marsh), wad (tidal flat), meer (a broad water), stien (stone), hol (hollow, cave), sjong (song), tel (count), dyk (dyke), salt |
| The dwarves | the Kilns | the German of the old mining country, the Erzgebirge, beside Kiln-script, which is the crew's and not theirs | erz (ore), eisen (iron), berg, hutte (smelter, written without its umlaut), stollen (adit), schacht (shaft), zeche (pit, mine), halde (spoil heap), kamm (crest), feuer, glut (ember), hammer, stein |
| The hill folk | Cairnmoor, Rimewater: the moor and the lodges | Scots Gaelic, the tongue of moor and loch | carn (cairn), creag (crag), loch, moine (peat), tulach (knoll), dubh (dark), fionn (white), beinn (mountain), allt (stream), clach (stone), fuar (cold), fada (long), eas (fall), ceann (head), lios (ring, enclosure), bogach (bog) |
| The monks and Cindercoast's folk | the Whitespine, Ashfall | the Crown's and the Lanterns' English, kept, as Sunderwood's and Wrackholm's were; the monks' own speech is Kiln-script | |
| The Wold Riders | the Glasswold | the Turkic of the steppe | ak (white), kara (black), tash (stone), kum (sand), su (water), ordu (camp), yurt, kush (bird), dag (mountain), kol (lake), bash (head), uzun (long), yol (road) |

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
- **Thornmark** (step II): named on 29 September 2026 (#211). `docs/areas/thornmark.md` §10 has the
  elves' tongue, its names, what each means and what it replaced. Thornmark, Thornhold, the
  Deepthorn and Deepthorn Lodge keep the Crown's English, each a place and the one it lends its
  name to.
- **Saltreach** (step III): named on 29 September 2026 with its area doc. `docs/areas/saltreach.md`
  §10 has the tongue, its names, what each means and what it replaced. Its port and its road keep
  the Crown's English (Saltreach, Saltmouth, the Saltings), as the Foreland kept a few old names.
- **Wrackholm** (step IV): the sailors' English, kept; Kelp Hole for Smugglers' Cove
  (`docs/areas/wrackholm.md` §10).
- **Sunderwood** (step V): English, the Crown's and the Lanterns', kept (`docs/areas/sunderwood.md`
  §10).
- **The Kilns** (step VI): named on 2 October 2026 with its area doc (#435). `docs/areas/kilns.md`
  §10 has the dwarves' tongue and its names: Erzkamm, the Tiefzeche, Gluthutte, Feuerstollen; the
  Kilns, Kilnmouth, the Iron Fells, Anvilhall, the Anvil Stone and Kilnhaven keep the Crown's
  English, and CREW ONLY is the crew's.
- **Cairnmoor** (step VII) and **Rimewater** (step VIII): named on 2 October 2026 with their docs
  (#435). The hill folk's tongue: Fionnlios and Carn Dubh on the moor; Loch Fada and Loch Fuar for
  the lakes. Rime Lodge keeps the Lanterns' English, Glacier Foot and the Ice Caves wait for the
  reach's doc, and the Sleepers' Bay is the docs' plain name for a place nothing on the surface names.
- **The Whitespine** (step IX): the Crown's and the Lanterns' English, kept, with Highcell for the
  monastery (#444; `docs/areas/whitespine.md` §10).
- **Ashfall** (step X): the coast's English, kept, with Scaldwell for the Hot Springs and Grimsforge
  for Warlord's Forge, whose it was (#444; `docs/areas/ashfall.md` §10).
- **The Glasswold** (step XI): the Riders' tongue for their own places, Akordu for their camp and
  Kushtash for the Eyrie, with Tashkum their word for the Glass, left for the reach's doc to decide
  (#444; `docs/areas/glasswold.md` §10).
- **The rest:** with their areas.
