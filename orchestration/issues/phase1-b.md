==================== #46 Draw the Downs' monsters: the birds, and five on frames that exist
Part of #26 (Phase 1), from MONSTERS §5.2 and §11: the Downs' six new monsters, one new family and five variants on the frames that exist. Art is the costliest content the game has (EXPANSION §11), so each drawing is an issue of its own, and this is their epic.

## Dependencies

- **Blocked by:** #35: every drawing passes the silhouette check, and has a sprite kind of its own.
- **Blocks,** through its six, each of which names its own: #47, #67, #68, #69, #70, #71 and #72, where the Downs' monsters are placed; and #48, whose Great Owl is drawn on the birds' frame.
- **Related:**
  - #37: each drawing goes on the contact sheet, as a strip ending on the hit flash.
  - #17: the barrow guard wears the Queen's colours, which the owner chose there: deep blue and gold.

## Why

Every monster def has a drawing of its own (EXPANSION §5.6), and the Downs bring six new monsters. The birds are the frame the road reuses for owls, herons, gulls, ravens, eagles and vultures, so the family is drawn to carry them.

## Proposal

| Monster | Family | Look | Issue |
|---|---|---|---|
| Carrion Crow | birds, new | Crows, too many to count, and all of them watching | #79 |
| Wrecker | bandit | Oilskins, a boathook, and a boat they were expecting | #80 |
| Lampman | bandit | A lantern held high on a pole, and someone under it | #81 |
| Barrow Guard | skeleton | The Queen's guard, in her colours (deep blue and gold), still standing to; halberds | #83 |
| Black Dog | wolf | A black dog the size of a calf, with eyes like coals | #82 |
| Barrow Captain | skeleton | Her captain, at his post beside the bier | #84 |

## Work

Every item is filed as a sub-issue; the progress bar counts them.

- [ ] #79: the Carrion Crow, and the birds' frame.
- [ ] #80: the Wrecker.
- [ ] #81: the Lampman.
- [ ] #82: the Black Dog.
- [ ] #83: the Barrow Guard.
- [ ] #84: the Barrow Captain.

## Done when

- Each is drawn in `src/ui/monsters/`, passes the silhouette check, and is on a contact sheet.
- `npm run check` is green.


==================== #48 Draw the Deepthorn's monsters: the old wood and the Great Owl
Part of #26 (Phase 1), from MONSTERS §5.4 and §11.

## Dependencies

- **Blocked by:**
  - #79: the Great Owl is drawn on the birds' frame, which the crow starts.
  - #35: every drawing passes the silhouette check, and has a sprite kind of its own.
- **Blocks:** #49: every monster def has a drawing of its own.
- **Related:** #37: each drawing goes on the contact sheet.

## Why

The Deepthorn's monsters are the wood itself, woken when the Grove Stone was cut: a new family, the old wood, and an owl from the birds.

## Proposal

| Monster | Family | Look |
|---|---|---|
| Bramble | old wood, new | A thicket that closes behind you |
| Great Owl | birds | Wings as wide as a cart, and not a sound |
| Rootwalker | old wood | A stump walking on its roots, its bark like plate |
| Heartwood | old wood | An oak that has decided to move; size 1.8 |
| The Eldest | old wood | The oldest tree in Caldera, and it is awake |

## Done when

- Each is drawn in `src/ui/monsters/`, passes the silhouette check, and is on a contact sheet.
- `npm run check` is green.


==================== #65 Phase 1, the Foreland to its edges: Callow Downs, box by box
Part of #26 (Phase 1): the Foreland built out to its edges on the atlas, as `docs/areas/shelf.md` plans it. The Downs are seven boxes of the grid west of the Foreland map, built as cores and country (EXPANSION §2.1 (b)), with the Berth below the chalk hills; #47, the pilot, is the first two. The owner settled the plan's shape on 27 September 2026 (`docs/areas/shelf.md` §9). This fills #26's line for the rest of the Foreland; Thornmark's half stays a line there.

## Dependencies

- **Blocked by:** #25 (Phase 0): nothing new goes into the world before it, and the scaffold (#36), the contact sheet (#37), the density check (#32) and the Downs' terrain (#44) every box needs are built there.
- **Blocks:** nothing filed yet. Saltreach's Upper Water and Delta (not filed) meet the Downs at Kestrel Edge.
- **Related:**
  - #42: the Downs' three steps go into the Foreland's chapter of the one quest.
  - #41, #45 and #46: `when` and `look`, the wilderness features and the drawings the boxes wait on.
  - #17, #21 and #51: the rest of the Foreland's work, in Helmstow and on the built map.
  - #19: three second prestiges are taught here, at Coldharbour, Crowness Light and Gullwick.
  - #56: the Foreland's eight side quests, pulled into the build: 4 to 6 with their boxes, and the rest in #77.
  - #49: the Deepthorn, Thornmark's half, which needs zones of several maps as the Downs do.
  - #100: gear with a plus, which the Foreland's +1s are made with (#99).

## Why

The atlas gives the Foreland 8,865 squares, and a tenth of them are built. West of the Foreland map the world ends. The Downs' places (Gullwick, Crowness Light, Coldharbour, the Berth, the Salt Road) are in no issue past #47, nor are DESIGN §9's three Downs steps or the Lodestone. One clear of the area pays 1,660 xp a member against a budget of about 3,730 (EXPANSION §5.2): the Downs are where the rest comes from.

## Work

Every item is filed as a sub-issue; the progress bar counts them. In the order of `docs/areas/shelf.md` §4:

- [ ] #66: the grid, zones of several maps, and the world map lettered by box. Blocked by #29.
- [ ] #47: the pilot, F2 and F3, the road west to Gullwick.
- [ ] #67: Crowness.
- [ ] #68: the Wend's fields.
- [ ] #69: the chalk hills.
- [ ] #70: the Berth.
- [ ] #71: the west downs.
- [ ] #72: Kestrel Edge.
- [ ] #73: the Lodestone. Blocked by #29.
- [ ] #74: tier 3 in Helmstow. Blocked by #29.
- [ ] #76: people who put choices, change with a flag, take several items and hand over letters. Blocked by #29 and #41.
- [ ] #77: the side quests on the built maps, #56's 1, 2, 3, 7 and 8.
- [ ] #85: the built quests' words rewritten: Vask's, Hale's and the Gilded Eel's. Blocked by #40.
- [ ] #87: Ashcombe moved past Gullwick into E3, so that the first job is further and a bit harder, and a farm store where it stood. Blocked by #47, #67, #97 and #98.
- [ ] #88: dens, camps that breed one kind of monster until the company burns them. Blocked by #41.
- [ ] #97: the farm store's room, a farm kitchen, drawn for #87.
- [ ] #98: a shop that sells an item at its own price, for #87's farm store.
- [ ] #99: the Foreland's gear ladder: the band's gear at Mottram's, and +1s and named finds on the Downs. Blocked by #100.

## Done when

- The Foreland is done as EXPANSION §4 has it: its maps pass the contract, its towns sell and teach what its band needs, its chapter is walked end to end, its gate holds, its monsters are drawn and placed, its xp and gold sit on the curve, and the owner has played it.
- Every box of the Downs is built, and the Foreland's land left void is only what `docs/areas/shelf.md` §11 cuts.
- `npm run check` is green.

==================== #49 Build the Deepthorn's core: the oldest elf-hold and Thorn Head
Part of #26 (Phase 1): the pilot's second map (EXPANSION §9). The Deepthorn is a zone of Thornmark, band 8–10, running south from Thornmark down to Thorn Head (MONSTERS §5.4). This builds its core, as the owner decided: the hand-built zone maps of the oldest elf-hold and Thorn Head. The country between goes with the rest of Thornmark (#26).

## Dependencies

- **Blocked by:**
  - #47: the pilot measures one zone map first.
  - #36: each zone map starts from the scaffold.
  - #41: the old wood wakes and sleeps with the Grove Stone (`until`, `when`).
  - #48: every monster def has a drawing of its own.
  - #42: the Deepthorn holds a step of the one quest, in Thornmark's chapter.
  - #37: its pull request carries a contact sheet.
  - #66: its core is two maps of one zone.
- **Blocks:** nothing.
- **Related:**
  - #19: the Ranger's second prestige is taught at Deepthorn Lodge.
  - #20: the wood burns only once there are elements.
  - #39: the owner chose cores and country, so this is the Deepthorn's core, and its country comes later.

## Why

The Deepthorn is age: trees older than Helmstow in a wood older than the elves' memory, and the oldest elf-hold, which keeps the treaty sealed with the chisel's mark, the first time the machine's script is seen on something that is not a tool (MONSTERS §5.4).

## Proposal

The recipe of EXPANSION §8.2, with the brief in `docs/areas/thornmark.md`. MONSTERS §5.4 has its monsters and fights: brambles and an owl on a path at night; a heartwood over three brambles; the Eldest at Thorn Head, asleep with the rest of the wood once the Grove Stone is restored, which the owner has set as the tear closing, at the Warden of the Cut's death (#41). Thornmark's winter: snow that lies for weeks.

## Work

- [ ] The brief, in `docs/areas/thornmark.md`.
- [ ] The elf-hold's and Thorn Head's zone maps, from the scaffold.
- [ ] A way opened in Thornmark's south edge for the road to the Deepthorn (`src/content/atlas.ts:394`): Thornmark's last row is mountain from end to end (`src/content/maps/thornmark.ts:48`).
- [ ] The check that pins Thornmark's south face as void (`tools/test.ts:694`) follows, and the ridge check beside it (`:697`) if the map's place breaks it.

## Done when

- The core's zone maps pass the contract (EXPANSION §5), the gate holds on them, and the owner has played them.
- `npm run check` is green.


==================== #21 Guilds: joinable side-quest hubs in place of the Charters
Split out of #19. This came up while planning the content past level 10 on `claude/content-expansion-strategy-f2epcf`. M1 asks for the first guilds and their quests (DESIGN §12), so this is part of the pilot, #26. The owner has settled the design; what is left is writing it into DESIGN §8 and building the first two.

## Dependencies

- **Blocked by:** nothing, for writing the design into DESIGN §8. Building waits on #25 (Phase 0), as everything new does; the Cartographers' and the Compact's halls wait on Saltreach (not filed yet).
- **Blocks:** nothing filed yet.
- **Related:**
  - #22: the Compact's line ends in the Dead-Drop, and the Cartographers' Lost Expedition in Meridian Camp.
  - #42, the one quest's first chapters: Vask's commission, the company's first contract, is its first step.
  - #18: the secondary skills the guilds teach are built there; a guild teaches its skills once they exist.
  - #34: membership is saved by the hall's name (`guild_<hall name>`), and ranks will be saved too, so both go through its check.

## Why

The Charters were rival factions. A company picked one at the start, Standing with one cost Standing with its rival, and each Charter was the promotion path for a pair of classes. But a company is six mixed classes, and rivalries pull it apart: a party with a Knight and a Thief needed both the Wardens and the Compact, which were rivals. The prestiges (#19) now carry class progression, which leaves the guilds the part that is fun: quests.

## What

Joinable guilds, in some of the cities, each a hub of side quests. They replace the four Charters of DESIGN §8 (the Wardens, the Lanterns, the Cartographers' Guild and the Salt Compact).

## Decided

- **Joinable, all of them.** A company can join any guild, and every guild at once. There are no rivals, and joining one never costs anything with another.
- **Side-quest hubs.** Each guild gives out side quests.
- **In some cities, not all.**
- **No class progression.** That belongs to the prestiges (#19).
- **No Standing.** It went with the Charters, and nothing takes its place for now. Something like it may come back, but it will look different. The Human race's hook was its fastest Standing gains, so the Human wants a new one (DESIGN §5). A guild rank is the company's place in one guild, not Standing.

The docs say so since 2d819b2 and 8b8758f: DESIGN §8 is the guilds, and the Charters and Standing are gone from DESIGN, EXPANSION, SLICE and MONSTERS.

The owner's calls on the rest:

- **The four carry over,** as guilds, not rivals: the Wardens (soldiers and road guards) in Helmstow, the Lanterns (clergy and scholars of the Stones) in Helmstow and Thornhold, and the Cartographers' Guild (explorers and surveyors) and the Salt Compact (smugglers and fences) in Saltreach. New guilds may come with later areas. M1 builds the two in Act I's cities: the Wardens and the Lanterns.
- **Joining is a first task,** a small quest. Finishing a guild's quests raises the company's rank in it, and each rank opens the next quests.
- **What a guild gives:** its quests pay gold, items and xp, and members can learn the guild's secondary skills (DESIGN §5), a few to each guild, for a price. Which skills each teaches is set when DESIGN §8 is written; the first thoughts are the Cartographers' Cartographer and Pathfinder, and the Compact's Lockpick and Merchant.
- **The Lanterns' halls are both.** The Lantern Guildhall in Helmstow and the Thornhold Lantern Hall (not the Lantern Chapterhouse, Thornhold's temple) go on selling spells for their fee, DESIGN §7's regional toll, and give the Lanterns' quests to a company that has done the first task.
- **The start is a charter from the Crown.** The word stays, as the plain word for the company's licence, granted by the Regent. Vask's commission, The Quiet Farm, is its first contract, and Helmstow its home. The creation and title screens still speak of the old Charters, word for word from the section that was removed ("Every adventuring company in Caldera works under a Charter", `src/ui/create.ts:116`; also `:103`, `:153` and `src/ui/title.ts:61`), and are reworded to say so.
- **The Charters' storylines are the guilds' lines:** the Wardens' siege, the Lanterns' split at Lantern Watch, the Compact's line (DESIGN §10.2) and the Cartographers' Lost Expedition (§10.3). The Compact's ending stays: take it over, or hand it to the Wardens, now the Regent's soldiers rather than a rival.

## Work

- [ ] DESIGN §8 written: the four guilds and their cities, joining and ranks, the skills each teaches, and their lines.
- [ ] The creation and title screens speak of a charter from the Crown.
- [ ] The Wardens in Helmstow and the Lanterns in Helmstow and Thornhold give quests from their halls, joined by a first task, with ranks.
- [ ] The Cartographers and the Compact listed with Saltreach, their halls to go in with its area.

## Done when

- The guilds are designed and written into DESIGN §8.
- The Wardens and the Lanterns give quests in Act I's cities, joined by a first task, with ranks; the Cartographers and the Compact are listed with Saltreach, and their halls go in with its area.
- Nothing in the game still speaks of the old Charters.
- `npm run check` is green.

==================== #17 Make Helmstow a castle city: the keep as a small map of its own, behind the north gate
Part of the pilot, #26. This came up while writing the main quest story on `claude/content-expansion-strategy-f2epcf`. **Updated:** the castle is a small map of its own behind Helmstow's north gate, as the owner chose, not a redraw of the whole town at four times the size, nor a zone of Helmstow's map.

## Dependencies

- **Blocked by:** #29, the layout refactor: `harrow.ts` moves, and the refactor lands alone. Like everything new, this waits on #25 (Phase 0).
- **Blocks:**
  - #19: the Knight's first prestige is taught by an armourer in the keep's ward.
  - #77: The Well That Tastes of Iron is set in the works under the keep.
- **Related:**
  - #46: the barrow guard wears the Queen's colours, deep blue and gold, decided here.
  - #34: the keep is a new map, so saves only gain it; nothing a save holds moves, and no bump is needed.
  - #40: Vask's line about the pass is fixed there, if it lands first.
  - #37: the screenshots asked for below are a contact sheet.

## Why

In the design and the story, Helmstow is a royal capital. It has a Queen and a Regent, an empty throne with three claimants (DESIGN §10.1), and the Council of Helmstow. Between acts, Wardens stand on its walls, a curfew bell rings, and a sergeant at the gate turns Idris away (DESIGN §9, STORY Act II).

The map doesn't feel like that. `src/content/maps/harrow.ts` is a 16×16 square with a wall around it: six blocks of houses on a crossroads, a well, and a south gate. Lord Vask stands in the open street by the well at (9,5). There is no castle, no keep, and no throne room for the throne subplot to happen in.

## Decided

- **A map of its own.** The keep's ward is a small town map, about 16×10, behind a gatehouse in Helmstow's north wall, entered as a door is. The owner chose it over a zone of Helmstow's map, which would have moved every town cell down by the ward's height, wanted a save bump, and needed four fixes where the code takes zones to mean the outdoors (`src/ui/worldmap.ts:1472` and `:1579`, `src/game/world.ts:288`, `src/game/quests.ts:31`).
- **The Queen's colours are deep blue and gold:** blue for the sea round Caldera, gold for the Hearth's light, and plainly not Vask's red, which goes up in their place between acts.

## Proposal: the castle as a small map of its own

- **The lower town stays as it is:** its streets, its well, and its six businesses (Hearthlight Inn, Lantern Chapel, Mottram's Stores, Lantern Guildhall, Warden Drillyard, Gilded Eel), each on a door cell with its own interior. Nothing in it moves.
- **A gatehouse** in what is now the north wall opens onto **the keep's ward**: walls and towers around it, the keep's great door at the far end, and a walled garden. Passing the gate says so in the log, and the frame names the ward.
- **The throne room is an interior** on the keep's door, painted like the businesses' rooms. It can't be a walkable hall because town cells are open to the sky, so the hall would have no roof. Vask holds court there, as an npc with that interior. The room shows the empty throne under black cloth, Warden banners, and a window facing the Hearth.
- **Colour, the paint.** The ward has its own palette, so it reads as a different place as soon as the party passes the gatehouse. Helmstow uses the default town palette today: warm sandstone and red banners. The keep could be cool grey dressed stone and dark flagstones, with green in the garden, and its banners in the Queen's deep blue and gold. The viewport only hangs banners at random on a few stone walls, so the keep may need them placed deliberately.
- **Colour, the life.** A few people and small scenes, all using feature kinds that already exist (sign, npc, event, well):
  - the Regent's proclamation on the gatehouse: he holds Helmstow "until the succession is settled";
  - petitioners on the keep's steps, whose news from Ashcombe and Gullwick points the party down the road;
  - the chapel where the Queen lay in state, still hung with black, and a mourner who knew her;
  - a rookery keeper whose birds bring rumours from farther off, pointing ahead to later acts.
- **Room for the story.** The ward is where Helmstow changes between acts: the gate guard doubled, the Queen's banners taken down and Vask's put up. Palettes and features can't change with story flags yet. That needs a small engine change, which Helmstow's other between-acts changes need too.
- While in `harrow.ts`, fix Vask's `after` line. It still says Hale opens the pass once Brandy Hole is dealt with, and that flag lock goes away under "one road, lightly held" (EXPANSION §2.2).
- **The Foreland's drawing of Helmstow** (a `BBBBB` block at cols 14–18, rows 1–3) has no room to grow north: the row above it is the edge of the world in play (`src/game/outdoors.ts:62`, and `tools/test.ts:694` pins it). The keep shows within the block, if at all, and the atlas note on it ("Helmstow's walls at 14-18,1-3") follows.
- Optional: draw battlements on the walls in the viewport, so they read as a fortress.

A map of its own needs nothing new of the engine. The world map puts the party at Helmstow while it is in the ward, since a town's place is found by following its exits out to the outdoors (`homeMap`, `src/game/atlas.ts:767`), and the ward's palette is its map's own.

## Touchpoints

| Where | What changes |
|---|---|
| `src/content/maps/harrow.ts` | The gatehouse, an exit on what is now the north wall; Vask moves into the keep |
| A new map for the ward | Walls, towers, the garden, and the keep's door with the throne room |
| `tools/test.ts:86` | Pins `interiors.length === 12`; the throne room makes it 13. Better to replace the count with an invariant (EXPANSION §1) |
| `tools/smoke.ts:275` | Paints all twelve interiors by day and by night, `interiors.n === 24`; the throne room makes it 26 |
| `tools/smoke.ts:104` | Travels to (9,6) to talk to Vask, who moves into the keep |
| `tools/smoke.ts:237` | The crack sweep paints a view from every open cell of Helmstow; the ward joins it, and is timed |
| `docs/SLICE.md` | Line 9 (the maps), line 224 ("the twelve businesses' interiors") and line 283 ("all twelve interiors") |

## Work

- [ ] The gatehouse, and the ward's map, with its palette and its people.
- [ ] The throne room's interior, and Vask holding court in it.
- [ ] The Queen's banners, deep blue and gold, placed in the keep.
- [ ] The touchpoints above.

## Done when

- There are screenshots of the town and the ward, by day and by night, from both sides of the gatehouse.
- Crossing the gatehouse says so in the log, and the frame names the ward.
- The world map still puts the party at Helmstow while it is in the ward.
- An old save loads as it did: nothing in the town has moved.
- The Foreland ↔ Helmstow gate works both ways.
- Every business still has an interior of its own.
- `npm run check` is green.
