==================== #66 [open] ['lane: quality', 'lane: systems', 'approved'] Lay the outdoors on one grid: zones of several boxes, and the world map lettered by them
Part of #65: the grid the owner chose on 27 September 2026 (`docs/areas/shelf.md` §1 and §9, EXPANSION §8.2). Every outdoor map is one box of the grid the Foreland and Thornmark sit on, and the Downs are one zone of seven boxes, which the atlas can't hold today.

## Dependencies

- **Blocked by:** #29, the layout refactor: it lands alone, and the tests this changes move in it.
- **Blocks:**
  - #47: the pilot's two boxes, F2 and F3, are one zone.
  - #67, #68, #69, #71 and #72: each is a box of the same zone.
  - #49: the Deepthorn's core is two maps of one zone, the oldest elf-hold and Thorn Head.
- **Related:**
  - #36: the scaffold cuts a box.
  - #30: the structure checks take in the grid's.
  - #34: where a map lies is something a save holds; this changes how a zone lists its maps, not where any map lies, so no bump is needed.

## Why

- **A zone holds one map.** `AtlasZone` has one `map` and one `at` (`src/game/atlas.ts:82`), `zoneOfMap` finds the zone a map is (`:642`), and `layOutdoors` lays a map where its zone puts it (`src/game/outdoors.ts:38`). The Downs are seven boxes of one zone, and the Deepthorn's core two maps of another. A zone to a box would ask a step of the quest of every box the road crosses (EXPANSION §5.8), bare country included.
- **Nothing holds a map to the grid.** `layOutdoors` lays any rectangle that overlaps no other and stays in the world, and a map laid off the grid leaves its neighbours strips that no box fits.
- **The border letters a different grid.** The world map letters squares of 32 from the world's corner (`paintBorder`, `src/ui/worldmap.ts:999`), 8 columns west and 2 rows south of the grid the built maps sit on, so a box's name in the docs (the Foreland is G2) is not the one on the border.

## Proposal

- **A zone lists its maps,** each at its box: a list in place of `map` and `at`, or a map naming its zone, as the change finds simplest. A built zone's walk (`settleZones`, `src/game/atlas.ts:542`) starts from all its maps, the overlay draws each map's footprint (`src/ui/worldmap.ts:1294`), and in play each laid map is still a zone of the outdoors under its own name (`src/game/outdoors.ts:104`).
- **The grid in the atlas:** its corner beside `square` (`src/game/atlas.ts:146`), and a box's name from a square and back.
- **A check:** every outdoor map is one box, 32 by 32, or a box cut to the world at its edge.
- **The border lettered by box.** The strips left at the world's edges are rim, and go unlettered.

## Work

- [ ] Zones of several maps, and everything that reads a zone's map: `settleZones`, `zoneOfMap`, `homeMap`, `layOutdoors`, the overlay, and their tests.
- [ ] The grid's corner in the atlas, the boxes' names, and the check.
- [ ] The border lettered by box, and the atlas's header comment with it.

## Done when

- A zone can hold several maps, laid and drawn as one zone: a test lays two maps in one.
- A map laid off the grid fails the check.
- The border's letters name the boxes: the Foreland's map is lettered G2.
- `npm run check` is green.

==================== #47 [open] ['lane: area', 'approved'] Build the pilot: the road west to Gullwick, boxes F2 and F3 of Callow Downs
Part of #65, in #26 (Phase 1): the pilot, the first two boxes of Callow Downs built by the new recipe (EXPANSION §8.2), west of the Foreland where the world now ends. The owner chose them on 27 September 2026 (`docs/areas/shelf.md` §9): F2 is the only box that meets the Foreland, and the road west runs into it; F3 is Gullwick, where the Downs' first step of the one quest is. Callow Downs is a zone of the Foreland, band 2–5 (MONSTERS §5.2).

## Dependencies

- **Blocked by:**
  - #66: F2 and F3 are two maps of one zone.
  - #36: each box starts from the scaffold.
  - #44: the Downs are chalk hills and fields.
  - #45: F2 is country, and meets its floor with the wilderness features; Gullwick's camp is one.
  - #41: the wreckers walk by night and in fog (`when`), and the Downs' groups say what they are (`look`).
  - #79, #80 and #81: the crows, and the wreckers and their lampman, are drawn.
  - #42: Gullwick holds the Downs' first step of the one quest, in the Foreland's chapter.
  - #43: in The Boat With No Name-Board, the Compact's man takes the hoard at the first meeting.
  - #76: the customs chit is a letter read from the pack, and Hild's, Wat's and Hamo's words change with what the company has done.
  - #32 and #37: the density check these are the first new maps to pass, and the contact sheet their pull request carries.
  - #99: F2 and F3 hold the kits' weapons with a plus.
- **Blocks:**
  - #49: the Deepthorn waits until the pilot has measured a zone map.
  - #67 and #68: the rest of the Downs waits on the pilot and the thresholds it tunes, and is reached through these two boxes.
  - #87: the walk to Ashcombe, moved past Gullwick, runs through F2 and F3.
- **Related:**
  - #19: the Knight's second prestige is taught at Coldharbour, in F2, and the Bard's at Gullwick.
  - #23: the end-of-the-world check it fixes looks west from the Foreland, where F2 goes, so the check moves to an edge that is still void.
  - #33: its edge check owes shelf 0,28 to this issue, where the Salt Road's trail meets the Foreland's sand; F2 covers the cell beyond (199,58), so it agrees once F2 is laid.
  - #38: the gate's thresholds are tuned on these boxes, and the Foreland's margins settled.
  - #39: the owner chose cores and country, which the wilderness features here are for.
  - #56: The Boat With No Name-Board is built here, and Riders in the Dark, which the captain at Coldharbour gives, with #68.
  - #104: cuts the Foreland's sea back at x 1–8, so F2's east column meets beach, not sea.

## Why

Pink empty space starts one step west of the Foreland. The Downs are the pilot: the first boxes built by the recipe, to measure how long one takes and what the owner still finds by hand, and to tune the thresholds every later map is held to (EXPANSION §9). F2 is country and F3 is core, so the pilot tunes both floors (EXPANSION §5.3).

## Proposal

- **F2, the road west** (its corner at 168,30), country, band 2–3: the fields west of Helmstow, Brockholt's wood, Coldharbour, the retired Warden captain's farm (176,42), and the Salt Road west from Brandy Hole's beach into F3. 1,024 squares of land: field, wood and grass, and the edge of the hills.
- **F3, Gullwick** (168,62), core, band 2–3: the village at the Wend's mouth (172,70), drawn on the box as the Ashcombe farm is on the Foreland map. Its houses, its boats with the knot painted on them, a camp to rest at, and Wenna's mother, who asks the company to find her. 300 squares of land and 724 of sea.
- **Monsters** (MONSTERS §5.2): crows in the stubble; wreckers and their lampman on the shore by night and in fog.
- **The step:** Wenna's mother, in the Foreland's chapter (#42).
- **The side quest:** The Boat With No Name-Board (#56's 4), kept to F3: the wreckers' hoard on Gullwick's own beach, and the Compact's man on the road west (`docs/areas/shelf.md` §6).

Their briefs are `docs/areas/shelf.md` §4.2 and §4.3: the landmarks, the points of interest, the encounters, the secrets and their hints, and the pay.

## Dialogue

Every line these quests put on screen, measured with the game's own wrap and font: a person's box or a letter holds 14 lines (a hand-in's reward line included), an event or a sign two lines of the log, and each answer to a choice one line. The notes say where each text goes and which flag it sets or waits on.

### Wenna of Gullwick

*For the builder: the Downs' first step: Hild at the tideline by the boats, her first lines setting q_wenna, with a second first-meeting text that replaces the first when q_greywater_done is already set. After-lines on every later visit in this act; Wenna is not found here. Her second text needs a company that brought Hale the ledger to have heard Wenna's name, so Hale reads it out: the last text here is a line added to his done-lines, after the column headed CARGO BELOW.*

**Hild, Wenna's mother**, first meeting:

> A woman stands at the tideline with her skirts wet to the knee, watching the water as if it owed her something. The rope at her belt is tied in a knot, a loop inside a loop: the mark painted on every bow along the shingle.
>
> "You're a company. Chartered, by the boots. Companies find things."
>
> "My man and my girl went out the night the light failed, and the boat never came in. Not a plank of her, not an oar. A boat that sinks gives something back. This one gave nothing, so she didn't sink. Somebody has her, and somebody has my girl."
>
> "Her name is Wenna. I can't pay what a company costs, so I'll give you that instead. Say it wherever you go, and watch whose face changes."

**Hild, Wenna's mother**, first meeting, the Cargo Ledger already read (q_greywater_done):

> A woman stands at the tideline with her skirts wet to the knee. The rope at her belt is tied in a knot, a loop inside a loop: the mark painted on every bow along the shingle.
>
> "You're a company. Companies find things. My man and my girl went out the night the light failed and the boat never came in, and her name is Wenna." She stops. "You've heard it. Don't tell me you haven't; I watched it land."
>
> "A ledger. Say the word again, so I have it." She takes it in, and does not weep. "Nobody writes down a drowned girl. You write down what you mean to keep. So she's kept, somewhere, and a kept thing can be fetched."
>
> "Go and fetch her. I'll be here. I'm always here."

**Hild, Wenna's mother**, after: every later visit in this act:

> Hild has tied another knot in the rope at her belt, below the first.
>
> "Not yet. I know. You'd have shouted it from the road."
>
> "One knot a day. When she's home she can sit on that step and watch me untie them, every one, and I'll tell her what each day was. Go on. You've a long way to walk and I've knots to tie."

**Captain Hale, Warden of the Scarth**, done: the ledger handed over, the line added to his built ones (`src/content/areas/shelf/maps/shelf.ts:70`):

> His finger stops halfway down the column. "Wenna, of Gullwick. In a neat clerk's hand, like a cask of brandy."

### The Boat With No Name-Board

*For the builder: Wat on the shingle sets q_board; the hoard (an item, the name-boards) is a chest under sailcloth in the rocks along the wreckers' beach, short of the cave at its far end, which is the box's secret; the customs chit (a letter) lies beside it, and the night event marks the way. The hoard goes to Wat (q_board_home) or to Hamo, the Compact's buyer on the Salt Road west (q_board_sold): both take it at the first meeting and pay, and Hamo stays on the road either way.*

**Wat, a boat-builder**, first meeting:

> An old man sits on an upturned hull, planing a plank down to nothing. His hands know the work, so his eyes are free for the sea.
>
> "I built the Patience. Twenty-two feet, oak on elm, and I cut her name-board myself and gave it three coats, because paint is cheaper than a board. My two boys took her out the night the light went out."
>
> "The sea's had her, I said. Then the laver-picker's girl came off the far beach at low water, white as a sail, saying she'd seen a board in the rocks with PATIENCE on it."
>
> "A board is what a family gets when the sea keeps the rest. We nail them up in the net loft; there's nine. I want hers up there, not in a wrecker's fire. Go by night. That beach is empty by day, and that's how you know what it is."

*Event, night, stepping onto the wreckers' beach:* By night the rocks stand up black and the tide is out. Below the wrack line, fresh footprints, many, all going one way.

*Event, the hoard, in the rocks along the beach:* Under sailcloth in a cleft: name-boards stacked like slates, oars, a shuttered lamp. Halfway down, PATIENCE, in three coats.

**A customs chit** (a letter, read from the pack):

> A chit of thick paper, creased and salt-spotted, stamped with the Helmstow customs seal.
>
> "Passed for Helmstow, under seal: boards fourteen, oars twenty-two, cordage, one bell. Salvage, the Wyke shore. Duty paid."

**Hamo, the Compact's buyer**, first meeting, on the Salt Road west of Gullwick:

> A neat man in a good coat sits on a milestone with a ledger on his knee, as if the road were his shop. His vowels are Saltmouth's.
>
> "Travellers. Wonderful. I buy, if you sell: timber, cordage, brass, anything the sea has finished with. The Compact pays in coin and asks nothing, which is more than the Crown does on either count."
>
> "Boards, particularly. A painted board is seasoned oak, and oak is oak whatever's written on it. I pay by the plank. Sentiment I don't buy; I've no shelf for it."

**Hamo, the Compact's buyer**, done: the hoard sold to him (he takes it at the first meeting and pays):

> Hamo counts the coin twice and the boards once.
>
> "Fourteen boards. Seasoned oak, every one, and the paint planes off. You've done well, and so have I." He makes a note in the ledger, a short one. "If you find more, I'm here most days. The sea is a generous partner. It never runs short of stock."

**Hamo, the Compact's buyer**, after: the hoard sold:

> "Still here. Still buying. You'd be surprised how much comes ashore on this coast." He looks at you. "Or perhaps by now you wouldn't."

**Hamo, the Compact's buyer**, after: the hoard taken home to Gullwick:

> "I heard the boards went up in a loft in Gullwick. Nailed to a wall. Seasoned oak, and nailed to a wall." He shakes his head, without malice. "No hard feelings. There'll be more."

**Wat, a boat-builder**, done: the hoard brought home (he takes it at the first meeting and pays from the loft jar):

> Wat turns the board over, and over again. "Three coats. That's mine." He runs a thumb along the back of it and stops. "That's a chisel. The sea doesn't own a chisel."
>
> "So she wasn't wrecked. Somebody took her name off, the way you'd take the brand off a stolen horse, and the Crown's stamp is on the bill of sale."
>
> "And if the sea never had her, it never had my boys." He sets the board down, face up, and does not say the rest.
>
> "Four more are ours, from years back. Hild's isn't here; I looked for it first. The rest I'll see home, up and down the Wyke. Here: the loft jar. It's not a company's price, but the loft wants to pay you, and so do I."

**Wat, a boat-builder**, after: the boards home:

> "Up in the loft with the nine, and every family that had one waiting took it home for a night first and hung it after." He has a new plank on the hull. "I've stopped watching the sea. I watch the far beach now."

**Wat, a boat-builder**, after: the boards sold to Hamo:

> "You sold them." He does not stop planing. "By the plank, I expect. He's fair, by the plank." A long stroke, and another. "Go on. There's nothing here you can buy."

## Work

- [ ] The briefs (`docs/areas/shelf.md` §4.2 and §4.3), settled with the owner.
- [ ] The scaffold for both boxes, and the maps authored from it.
- [ ] Their monsters placed, their secrets and their hints.
- [ ] Wenna's mother as a step of the Foreland's chapter.
- [ ] The Boat With No Name-Board.
- [ ] Hale reads Wenna's name out of the ledger (`src/content/areas/shelf/maps/shelf.ts:70`), for Hild's second meeting.
- [ ] The texts as the Dialogue section has them.
- [ ] A way opened in the Foreland's west edge for the Salt Road (`src/content/atlas.ts:364`): the Foreland's first column is mountain in every row, and stays mountain beside a built map (`src/game/outdoors.ts:63`).
- [ ] The checks that pin the void west of the Foreland moved to an edge that is still void: stepping west into "The world ends here." (`tools/tests/movement.ts:58`), the Foreland's west face all void (`tools/tests/outdoors.ts:37`), and the smoke test's pink view from the Foreland at 1,12 facing west, and its step into it (`tools/smoke.ts:294`, `:490` and `:491`), with SLICE.md's example of it.
- [ ] The pillars suite's edge fixture at 168,30, F2's corner, moved to land no zone map covers (`tools/tests/pillars.ts`, the comment above `lay`).
- [ ] How long each box took, and what the owner found by hand, written into the brief.

## Done when

- Both boxes pass the contract (EXPANSION §5), the gate holds on them, and the owner has played them.
- The thresholds are tuned on what they taught.
- `npm run check` is green.

==================== #67 [open] ['lane: area', 'approved'] Build Crowness, box E3: the light, its keeper and the Salt Road in fog
Part of #65: box E3 of Callow Downs, core, band 3–4 (`docs/areas/shelf.md` §4). Crowness Light and its keeper hold the Downs' second step of the one quest.

## Dependencies

- **Blocked by:**
  - #47: the pilot measures a box first and tunes the thresholds this one is held to, and the Salt Road reaches E3 from Gullwick.
  - #66: E3 is a box of the Downs' zone.
  - #41: the wreckers and their lampman walk by night and in fog (`when`).
  - #80, #81 and #79: the wrecker, the lampman and the crow are drawn.
  - #42: the keeper's log is a step of the Foreland's chapter.
  - #76: the keeper's log is a letter read from the pack, Mottram puts Oil for the Lamp's choice, and the lamp room is dark or lit by a flag.
  - #43: the keeper takes Lantern Oil at the first meeting.
  - #99: E3 holds a kit's armour with a plus.
- **Blocks:**
  - #71: the Salt Road runs on from E3 into D3.
  - #87: Ashcombe, moved past Gullwick, is built in E3's north-east corner, which E3 leaves free for it.
- **Related:**
  - #19: the Cleric's second prestige is taught at Crowness Light.
  - #56: Oil for the Lamp is built here (`docs/areas/shelf.md` §6).

## Why

DESIGN §9 puts the keeper who counted the eleven at Crowness Light, and STORY has him at the water's edge at Gullwick, counting under his breath, the old keeper "from the lighthouse on the point". Neither is built. MONSTERS §5.2 puts the Downs' fight in fog here: a lampman and four wreckers on the Salt Road, the first fight where the weather is a warning and not a nuisance.

## Proposal

- **Crowness Light** on the point, about 152,89, rather than inland, where the atlas has it (140,88, `src/content/areas/shelf/atlas.ts:27`), and its keeper, with his log of the night the Queen died: the Hearth out eleven times, and the gaps between written down. The step of the quest.
- **The Salt Road** west along the coast from Gullwick, with the gibbet and its crows on it.
- **Monsters** (MONSTERS §5.2): a lampman and four wreckers on the road on a foggy night, the lamp the first thing the company sees; crows at the gibbet; shore crabs under the light.
- **The side quest:** Oil for the Lamp (#56's 5). The keeper has had no oil since the week the Queen died, because the Wardens told Mottram, in Helmstow, to send no more. Buy the oil and carry it down, or put it to Vask.
- **Land:** 857 squares of grass and field, and 167 of sea.
- **Its north-east corner,** across the Wend from Gullwick, in the last of the stubble, is left free for Ashcombe, which #87 lays there.

Its brief is `docs/areas/shelf.md` §4.4: the landmarks, the points of interest, the encounters, the secret and its hint, and the pay.

## Dialogue

Every line these quests put on screen, measured with the game's own wrap and font: a person's box or a letter holds 14 lines (a hand-in's reward line included), an event or a sign two lines of the log, and each answer to a choice one line. The notes say where each text goes and which flag it sets or waits on.

### The Keeper's Count

*For the builder: the Downs' second step: Aldred at the foot of the tower stair, whose first lines set q_keeper and start Oil for the Lamp (q_oil). His log (an item, the keeper's log, read as a letter) lies on the table in the cottage, a chest of its own, and finding it is the step. His after-lines with the second light show while the lamp is dark; once it is lit, Oil for the Lamp's after-lines take over.*

**Aldred, keeper of Crowness Light**, first meeting:

> The lamp room at the top of the tower is dark, and the old man at the foot of the stair is trimming a wick that has nothing to burn.
>
> "Keeper. Forty-one years. You'll want to know about the night the light went out. Everyone does, once, and then they want to know when supper is."
>
> "Eleven. I was at Gullwick that night, at a burying, my lamp trimmed to last till dawn without me. It lasted; the Hearth didn't. I stood in the surf and counted the gaps as you count thunder, and wrote it up when I got home. It's on the table. Read it; nobody else has."
>
> "You'll have noticed she's dark. The Lanterns' cart brought a cask a month for forty-one years and stopped the week the Queen died. No letter; the cart just didn't come. A light with no oil is a tall house, and I'm too old to live in a tall house for nothing."

**The keeper's log** (a letter, read from the pack):

> CROWNESS LIGHT. Wind south-west, fresh; sea getting up. Lamp lit at dusk and trimmed for the night. Myself to Gullwick.
>
> Near midnight the Hearth went out. Not dim: out, and back, and out. Counted between, as for thunder.
>
> Out. 2. Out. 9. Out. 2. Out. 9. Out. 2. Out. 9. Out. 2. Out. 9. Out. 2. Out. 9. Out. Then no more.
>
> Eleven. Each about the length of a grace. The pairs even, every time, as if measured. Gullwick's boats had no light but mine. Not all in by dawn.
>
> Morning: a rider from Helmstow. The Queen is dead.

**Aldred, keeper of Crowness Light**, after, while the lamp is dark:

> "Still dark. It's the one thing about a lighthouse a stranger can tell at a glance."
>
> "Something for your notebook, since you read. Some nights there's a second light on the rocks below the point, lower than mine ever stood. A light that low is on the water, or in it. It's in the log, six times now. You've read more of that log than the Lanterns have in forty years."

### Oil for the Lamp

*For the builder: Mottram's lines show while q_oil is set, and his choice sets q_oil_buy or q_oil_vask. Lantern Oil, the built item at 40, joins his stock. Aldred takes a flask at the first meeting too (#43), bought here or found, and sets q_oil_lit; q_oil_vask plays Vask's lines, which set q_oil_lit and bring the cart. The lamp room event has a dark and a lit version, and Aldred's and Mottram's after-lines differ by which flag lit the lamp.*

*Event, the lamp room, while the lamp is dark:* The lamp room: a lens the height of a man, clean as a tear, its wick dry. All the Wyke lies below, and none of it can see you.

**Mottram, of Mottram's Stores**, while the keeper's ask is open (q_oil):

> Mottram is counting torches into a crate, and finishes the count before he looks up.
>
> "Crowness oil. Yes. A cask a month, first of the month, onto the Lanterns' cart, and I've the bills for forty years, my father's and mine, if you doubt it. Then a Warden sergeant with a paper: stop. I asked why. He said 'Regent's orders.' I said that's who, not why, and he didn't care for the distinction."
>
> "I don't sell against a paper with that seal on it. I've a shop. But nobody wrote me a paper about you."

*Choice (Mottram, of Mottram's Stores), after his lines above:* "So. A flask of Lantern Oil on my shelf at forty, you carry it down yourselves, and my name's not on it. Or you take it up with the man whose seal is on the paper. Which?"

- We'll buy the oil.
- We'll put it to Vask.

**Mottram, of Mottram's Stores**, answer: We'll buy the oil:

> "Sensible. Oil's oil; it doesn't care who paid for it." He sets a stoppered flask of it on the counter. "That's a night's burning. Mind the road past Gullwick. Things on that coast like the dark, and you're carrying the cure for it."

**Mottram, of Mottram's Stores**, answer: We'll put it to Vask:

> "Then I never said the word Regent, and you never heard it in this shop." He goes back to the torches. "I'll say this for you. You've more nerve than sense. I've a shop; I keep the other kind."

**Lord Aumery Vask, Regent-Warden**, the keeper's want put to him (q_oil_vask):

> Vask hears you out without moving. When you have finished he lets the silence sit a moment, so that you know he has chosen to end it.
>
> "Crowness Light. An order given in the confusion of that week, by a sergeant who mistook thrift for policy. Consider it lifted. The cart goes down on the first of the month, as it always has."
>
> "Tell the keeper the Crown remembers him." He smiles, briefly, the way a man does when a small account closes in his favour. "Was there anything else?"

**Aldred, keeper of Crowness Light**, done: given Lantern Oil (at the first meeting too):

> Aldred takes the flask and weighs it in his hand as if it might get away from him. "That's a night. One night. You've no notion what one night does."
>
> "A dark light is a thing the Lanterns can bear; they've borne it a month. A light that's burning again, that they stopped, is a thing they'll have to explain, and they'd sooner send the cart than explain. Watch. The cart comes back."
>
> He climbs the stair slowly. Above you the glass takes the flame, and his voice comes down after it: "There. Now Gullwick can find its own front door."

*Event, the lamp room, once the lamp is lit:* The lamp room, lit. The lens throws the flame to sea in a slow turning bar; the rocks below show white each time it passes.

**Aldred, keeper of Crowness Light**, after: the lamp lit with the company's oil (q_oil_buy, or oil carried in):

> The lamp turns overhead, and Aldred has the look of a man who has slept.
>
> "The cart came. First of the month, as if it had never stopped, and the carter looked at my light as if it had done something to him personally."
>
> "Two boats came in past the point last night on this light, and none by any other. Sit, if you like. It's a good room when it's lit."

**Aldred, keeper of Crowness Light**, after: the lamp lit by Vask's order (q_oil_vask):

> The lamp turns overhead. Aldred does not look up at it.
>
> "The cart came, with a Warden riding beside it to see that it did, and he told me the Crown remembers me. I've been remembered by the Crown. It's a cold sort of warm."
>
> "I'd rather have gone dark. A light that burns because a lord allows it goes out the day he stops allowing it, and the boats won't know the difference until the night it does. Still. They're finding Gullwick. That's what a light is for, whoever's it is."

**Mottram, of Mottram's Stores**, after: the company carried the oil down:

> "Lit, is it? Good. Then that's a cask a month the Lanterns will have to start finding again, and a sergeant with a paper who'll have to explain a light he stopped that's burning." He counts on. "Not my shop, not my paper. Cheaper than a Regent, oil."

**Mottram, of Mottram's Stores**, after: Vask lifted the order:

> "The sergeant came back for his paper. Didn't say a word, didn't look at me, took it off the nail and went." He counts on. "Forty years a chandler, father and son, and neither of us ever saw a Warden embarrassed. I'd pay to see it again."

## Work

- [ ] The brief (`docs/areas/shelf.md` §4.4), settled with the owner.
- [ ] The scaffold, and the map authored from it.
- [ ] Its monsters placed, its secret and its hint.
- [ ] The keeper's log as a step of the Foreland's chapter.
- [ ] Oil for the Lamp, with Mottram's and Vask's lines in Helmstow, and Lantern Oil on Mottram's shelf.
- [ ] The texts as the Dialogue section has them.
- [ ] The light moved to the point on the atlas.

## Done when

- The box passes the contract (EXPANSION §5), and the owner has played it.
- `npm run check` is green.

==================== #68 [open] ['lane: area', 'approved'] Build the Wend's fields, box E2: crows over wolves in the stubble
Part of #65: box E2 of Callow Downs, country, band 3–4 (`docs/areas/shelf.md` §4).

## Dependencies

- **Blocked by:**
  - #47: the pilot measures a box first and tunes the country's floor this one is held to, and E2 is reached from F2.
  - #66: E2 is a box of the Downs' zone.
  - #45: country meets its floor with the wilderness features.
  - #79: the crow is drawn.
  - #76: in Riders in the Dark the riders pass the ford only by night, and the captain chooses whether to write to Hale, and hands the company the letter if he does.
  - #43: Hale takes the captain's letter at the first meeting.
  - #88: the crows come from a rookery, a den.
  - #99: E2 holds a kit's armour with a plus, and the rookery's hoard a keepsake.
- **Blocks:** #69: the chalk hills are reached across E2, by the track from Coldharbour.
- **Related:** #56: Riders in the Dark is built here (`docs/areas/shelf.md` §6).

## Why

The middle of the Downs is the Wend's lower course and the fields round it: 1,024 squares of land, most of it farmland, void in play. MONSTERS §5.2 puts crows over wolves in the stubble here, where the back row learns it can be reached.

## Proposal

- **The Wend,** coming in from the rim at the box's north edge and running south towards Gullwick, and the fields either side of it.
- **The track** from Coldharbour (F2) west across the fields and the Wend, up to the Berth (D2).
- **Monsters** (MONSTERS §5.2): crows over wolves in the stubble; wolves where the fields meet the hills.
- **Country:** the looser floor, met with wilderness features (#45).
- **A den** (#88): a rookery in the willows by the drowned mill. Its keepers are the old birds that never leave it, and its brood are the crows that fly with the wolves in the stubble, until the company beats the keepers and burns it. Its hoard is what the crows have carried home.
- **The side quest:** Riders in the Dark (#56's 6). The captain at Coldharbour, in F2, asks who rode through his fields at night the week the Queen died, towards her barrow; the company waits at the ford by night and sees them come back in Warden grey. He writes to Hale, or keeps it.

Its brief is `docs/areas/shelf.md` §4.5: the landmarks, the points of interest, the encounters, the secret and its hint, and the pay.

## Dialogue

Every line these quests put on screen, measured with the game's own wrap and font: a person's box or a letter holds 14 lines (a hand-in's reward line included), an event or a sign two lines of the log, and each answer to a choice one line. The notes say where each text goes and which flag it sets or waits on.

### Riders in the Dark

*For the builder: Dunstan at Coldharbour's gate sets q_riders; the ford's night event (E2, `when` night) marks the riders seen, and Dunstan's second lines end in the choice: q_riders_letter, whose answer hands the company his letter, which Hale takes at the first meeting, or q_riders_kept. The ford's daytime event and the sign are the box's own features, shared with the quest.*

**Captain Dunstan, retired**, first meeting, at Coldharbour:

> Coldharbour. A lamp burns in the farmhouse window, as it does at every hour, and the man mending the gate has a Warden's shoulders and a farmer's hands. He does not stop working to talk.
>
> "Captain, once. Dunstan, now. You'll want to know about the lamp. Everyone does, and the gate won't mend itself, so I'll tell you while I work."
>
> "The week the Queen died, riders came off the Salt Road and through my stubble at the second hour. Eight horses, shod; farm horses aren't shod for chalk. West over the ford towards the Berth, and back before dawn, and not a lantern among them."
>
> "I've shown a light in that window every night since I hung up the grey. An honest rider steers for it. These steered round it. Go and sit at the ford by night. Men who ride dark always have a reason to go back."

*Event, the ford, by day:* The ford. Shod hoofprints in the mud of both banks, going west and coming back, and not once only.

*Sign, at the ford:* A sign reads: "THE BERTH. Scratched beneath, with a knife point: NOT AFTER DARK."

*Event, night, at the ford:* Eight riders out of the west, unlit. At the water a horse baulks and a cloak lifts on Warden grey, and they are gone.

**Captain Dunstan, retired**, back at Coldharbour, the riders seen:

> Dunstan listens with his hands flat on the table, the way a man listens to a report.
>
> "Grey under the cloaks." He is quiet a while. "A Warden shows his light. It's the first thing they teach you and the last you forget, because the country has to know who's on its roads. Wardens don't ride dark. So either the Wardens have gone dark, or somebody's wearing us."
>
> "Hale holds the Scarth. He's the one Warden east of here I'd put this in front of, and he'd want it in front of him, which is his trouble and would become mine. Or it goes no further than this table, and I keep my farm."

*Choice (Captain Dunstan, retired), after his lines above:* "I'm asking you, because I know what I'd do; I've done it before, and it's why I farm. Do I write to Hale, or does this stay under my roof?"

- Write to Hale.
- Keep it under your roof.

**Captain Dunstan, retired**, answer: Write to Hale:

> "Then I write." He does, in the Wardens' shorthand, and folds it without a seal. "Take it east yourselves; I'll not trust it to the post, and a seal only tells a thief which letter to take. He'll read it, and it'll be one more thing he knows. Knowing is what gets Wardens killed. He'd say the same of me, and he'd be right."

**Captain Dunstan, retired**, answer: Keep it under your roof:

> "Then it stays here." He gets up and trims the lamp in the window, though it does not need it. "I've a roof, a barn and forty acres, and I'd like to die in the house. That's not cowardice at my age. It's arithmetic."
>
> "The lamp stays lit, mind. That was never for them."

**Dunstan's letter to Hale** (a letter, read from the pack):

> A paper folded twice, unsealed, addressed in a square hand: HALE. THE SCARTH.
>
> "Hale. Eight riders, shod, no lights, the week she died. West to the Berth by my ford and back before dawn, and not once only. Grey under the cloaks. You know what I am not writing. Burn this. D."

**Captain Hale, Warden of the Scarth**, given Dunstan's letter (he takes it at the first meeting):

> Hale reads it standing, twice, and folds it along its own lines.
>
> "Dunstan. He taught me the light in the window." He looks east, up the pass, and then west. "Wardens, riding dark to the Queen's barrow. The Regent should know what his own men are doing. He'll have it from me, under my seal."
>
> He puts the letter inside his coat, not into the fire. "He says burn it. I don't burn things. He'd tell you that's my fault, and it is."

**Captain Dunstan, retired**, after: the letter written:

> "Anything from Hale? No. There wouldn't be. Wardens don't write 'thank you'; we write 'noted'." He looks at the lamp. "I've sat where he's sitting. You send it up the line, and you hope the line's still yours."

**Captain Dunstan, retired**, after: kept:

> "You'll not hear it from me again, and I'll thank you not to say it in Helmstow with my name on it." He is mending the same gate. "I sleep less and I still have a roof. That's the trade. I made it with my eyes open, which is more than most men can say of theirs."

### The rookery

*For the builder: the den's look is said when it is first seen, and its choice is put when the company steps into it with its keepers dead; burnt, its brood stops coming and its hoard opens (#88).*

*Event, the den, first seen:* The willows by the mill are black with nests, and every crow in them has already seen you.

*Choice, stepping into it, its keepers dead:* The rookery's keepers are dead, and the nests are dry. Burn it?

- Burn it.
- Leave it.

*Event, burnt:* The nests go up like tinder. The crows wheel over the smoke, screaming, and come down nowhere near it.

## Work

- [ ] The brief (`docs/areas/shelf.md` §4.5), settled with the owner.
- [ ] The scaffold, and the map authored from it.
- [ ] Its monsters placed, its secret and its hint.
- [ ] The track to the Berth on the atlas.
- [ ] Riders in the Dark, with the captain's lines at Coldharbour and Hale's at the pass.
- [ ] The rookery: its keepers, its brood and its hoard (#88).
- [ ] The texts as the Dialogue section has them.

## Done when

- The box passes the contract (EXPANSION §5) at the country's floor, and the owner has played it.
- `npm run check` is green.

==================== #69 [open] ['lane: area', 'approved'] Build the chalk hills, box D2: the Black Dog, and the way into the Berth
Part of #65: box D2 of Callow Downs, core, band 4–5 (`docs/areas/shelf.md` §4): the way into the Berth, the Queen's barrow.

## Dependencies

- **Blocked by:**
  - #68: the hills are reached across the Wend's fields.
  - #66: D2 is a box of the Downs' zone.
  - #41: the Black Dog walks by night (`when`).
  - #82: the Black Dog is drawn.
  - #79: the crows on the chalk are drawn.
  - #88: the wolves on the chalk come from a den.
  - #99: the hollow barrow's cist holds the guardsman's Halberd +1 and ring of office, and the wolves' den's hoard a Spear +1.
- **Blocks:** #70: its door is on these hills.
- **Related:** #56: Riders in the Dark follows the riders up to the barrow.

## Why

MONSTERS §5.2 has the Queen's barrow up on the hills, standing open, with wolves on the chalk and the Black Dog round it by night; DESIGN §9 has it opened, and only her signet gone. None of it is built, and the Berth is not on the atlas.

## Proposal

- **The chalk:** 1,024 squares, nearly all of it hills.
- **The Berth's mouth,** about 118,42, placed on the atlas with the track up to it from E2.
- **Monsters** (MONSTERS §5.2): wolves by day, and the Black Dog by night, round the barrow.
- **A den** (#88): a wolves' den dug into the old chalk pit. Its keepers are the pack that never leaves it, and its brood are the wolves on the chalk, until the company beats the pack and pulls the den down. Its hoard is what the pack has dragged in.
- **Proposed:** a figure cut in the chalk below the ridge, which the shepherds call the Cradle; seen from the Berth's mouth, it is a ship. Nothing says so (NAMES §1).
- **Its west edge** meets C2, the Downs' strip of cliff top that goes with Saltreach's boxes (`docs/areas/shelf.md` §11): the world's end there, until Saltreach is built.

Its brief is `docs/areas/shelf.md` §4.6: the landmarks, the points of interest, the encounters, the secret and its hint, and the pay.

## Dialogue

Every line the den puts in the log, measured with the game's own wrap and font: an event two lines of the log, and each answer to a choice one line. The notes say where each text goes.

*For the builder: the den's look is said when it is first seen, and its choice is put when the company steps into it with its keepers dead; burnt, its brood stops coming and its hoard opens (#88).*

*Event, the den, first seen:* A den dug into the side of the old chalk pit. The spoil is trodden grey, and the bones at its mouth are not all sheep.

*Choice, stepping into it, its keepers dead:* The pack is dead. Fire the den with gorse and pull the bank down over it?

- Pull it down.
- Leave it.

*Event, burnt:* The gorse catches, and the bank comes down over the den's mouth. Nothing on the chalk answers.

## Work

- [ ] The brief (`docs/areas/shelf.md` §4.6), settled with the owner.
- [ ] The scaffold, and the map authored from it.
- [ ] Its monsters placed, its secret and its hint.
- [ ] The wolves' den: its keepers, its brood and its hoard (#88).
- [ ] The texts as the Dialogue section has them.
- [ ] The Berth on the atlas: its site, and its place.

## Done when

- The box passes the contract (EXPANSION §5), and the owner has played it.
- `npm run check` is green.

==================== #70 [open] ['lane: area', 'approved'] Build the Berth: the Queen's barrow, opened, and her guard still standing to
Part of #65: the Queen's barrow under the chalk hills (D2), a dungeon of its own, one level of 16 by 16, band 4–5, as the owner chose on 27 September 2026 (`docs/areas/shelf.md` §9). The Downs' hardest place, and their third step of the one quest.

## Dependencies

- **Blocked by:**
  - #69: its door is on the hills.
  - #83 and #84: the barrow guard and the barrow captain are drawn.
  - #41: the guard and the captain say what they are when first seen (`look`).
  - #42: the barrow opened is a step of the Foreland's chapter.
  - #99: the niche behind the bier holds the Barrow Captain's arms, and the first side chamber a Queen's Long Sword +1.
- **Blocks:** nothing.
- **Related:**
  - #17: the Queen's colours, deep blue and gold, which her guard wears, were chosen there.
  - #38: its boss is held to the gate, won about half the time at the band's floor.
  - #56: in Riders in the Dark, riders in Warden grey rode up to the barrow the week she died.

## Why

DESIGN §9: the Queen's barrow has been opened, and only her signet is gone. MONSTERS §5.2: her guard two by two down the passage, then her captain at the empty bier; the Downs' hardest place, band 4–5, where the boss asks. None of it is built.

## Proposal

- **One level** of 16 by 16, entered from D2: the passage, the guard two by two, and the bier at its end.
- **Monsters** (MONSTERS §5.2): the Barrow Guard, which holds its ground and never roams, and the Barrow Captain at the bier, the boss, who stays dead once killed (EXPANSION §5.1).
- **The step:** the barrow opened, and only the Queen's signet gone. The brief follows STORY where MONSTERS §5.2 differs: the Queen lies on her bier, her hand bare where the signet was, where MONSTERS has the bier empty.

Its brief is `docs/areas/shelf.md` §4.7: the shape, the points of interest, the encounters, the secret and its hint, and the pay.

## Dialogue

Every line the Berth puts on screen, measured with the game's own wrap and font: an event or a sign two lines of the log. The notes say where each text goes.

*For the builder: events only, in the order of the passage: the mouth's event sits on the entrance square in D2, the hint is a sign cut in the forecourt, each side chamber holds a chest (grave goods nobody has touched), and seeing the bier is the step. The captain's and the guard's lines are their `look`, said when each is first seen; the niche behind the bier is the secret, with the captain's arms as its chest.*

*Event, the Berth's mouth, on the chalk:* The Berth. Its stones lie pulled aside in the grass, the chisel marks on them still white, the chalk cut up by shod hooves.

*Event, the forecourt:* The forecourt. Rope-scars on the lintel, and the prints of many boots. Whoever opened this came with horses, tools and time.

*Sign, cut in the forecourt's stone:* A sign reads: "Cut deep in the forecourt's stone, older than the marks around it: HER CAPTAIN LIES BEHIND HER."

*Event, the passage:* Cold, dry, and the smell of chalk. The passage runs straight into the hill, cut, not dug: the walls meet the floor square.

*Event, the Barrow Guard, first seen (their look):* The Queen's guard, in her colours, still standing to. They do not turn their heads. They have already seen you.

*Event, the first side chamber:* A Queen in her niche, her name worn past reading. Gold at her throat, a sword at her side, and the dust on all of it unbroken.

*Event, the second side chamber:* Older: the name worn smooth as a river stone. A comb, a cup, a chest and a ring of iron keys too many for any house.

*Event, the third side chamber:* The third. The name is a shadow in the stone. Her hands are folded over a small chest, and her ring is still on her finger.

*Event, the fourth side chamber:* The oldest. No name, no gold: a cup, a knife and, on her right hand, a plain band of grey metal that has not tarnished.

*Event, the bier chamber:* The bier. Queen Isaure under deep blue and gold, hands folded. The right is bare: the wrappings there were cut, not unwound.

*Event, the Barrow Captain, first seen (his look):* Her captain, at his post beside the bier. He was told to hold it, and nobody has told him otherwise.

*Event, the niche behind the bier:* Behind the bier, a niche: a captain's arms in deep blue and gold, laid out as if he meant to put them on again.

## Work

- [ ] The brief (`docs/areas/shelf.md` §4.7), settled with the owner.
- [ ] The map, its monsters, its secret and its hint.
- [ ] The step in the Foreland's chapter.
- [ ] The texts as the Dialogue section has them.

## Done when

- The dungeon passes the contract (EXPANSION §5), its boss is won about half the time at the band's floor, and the owner has played it.
- `npm run check` is green.

==================== #71 [open] ['lane: area', 'approved'] Build the west downs, box D3: open down to the lip of Kestrel Edge
Part of #65: box D3 of Callow Downs, country, band 4–5 (`docs/areas/shelf.md` §4).

## Dependencies

- **Blocked by:**
  - #67: the Salt Road comes into D3 from Crowness.
  - #66: D3 is a box of the Downs' zone.
  - #45: country meets its floor with the wilderness features.
  - #79: the crows along the lip are drawn.
  - #88: the road's bandits come from a camp, a den.
  - #99: the bandit camp's hoard holds a Long Bow +1.
- **Blocks:** #72: the Salt Road cuts a corner of D3 on its way down Kestrel Edge.

## Why

The south-west of the Downs is 944 squares of open grass and the chalk's last slopes, running down to the lip of Kestrel Edge, void in play.

## Proposal

- **Open downs** to the lip of the cliff, with the Upper Water below it. North of the Wind Cave the cliff top runs on into C3, which goes with Saltreach's boxes (`docs/areas/shelf.md` §11): the world's end there, until Saltreach is built.
- **The Salt Road** across its south-east corner.
- **The Wind Cave** (`src/content/atlas.ts:310`), Saltreach's cave in the face of Kestrel Edge, moved a square west into C3, so that D3 does not hold it.
- **Monsters:** wolves, and bandits with their archers near the road (MONSTERS §5.2).
- **A den** (#88): a bandit camp by the Salt Road, a hut of stolen planks. Its keepers are the camp's own, who never leave it, and its brood are the bandits and their archers who work the road, until the company beats the keepers and burns the hut. Its hoard is the road's takings.
- **Country:** the looser floor, met with wilderness features (#45).

Its brief is `docs/areas/shelf.md` §4.8: the landmarks, the points of interest, the encounters, the secret and its hint, and the pay.

## Dialogue

Every line the den puts in the log, measured with the game's own wrap and font: an event two lines of the log, and each answer to a choice one line. The notes say where each text goes.

*For the builder: the den's look is said when it is first seen, and its choice is put when the company steps into it with its keepers dead; burnt, its brood stops coming and its hoard opens (#88).*

*Event, the den, first seen:* A hut of stolen planks by the road, a fire kept low, and a lookout who has already seen you.

*Choice, stepping into it, its keepers dead:* The camp's own are dead, and the hut is full of other people's things. Burn it?

- Burn it.
- Leave it.

*Event, burnt:* The hut burns with everything it stole. By morning the Salt Road is only a road again.

## Work

- [ ] The brief (`docs/areas/shelf.md` §4.8), settled with the owner.
- [ ] The scaffold, and the map authored from it.
- [ ] Its monsters placed, its secret and its hint.
- [ ] The bandit camp: its keepers, its brood and its hoard (#88).
- [ ] The texts as the Dialogue section has them.
- [ ] The Wind Cave moved on the atlas.

## Done when

- The box passes the contract (EXPANSION §5) at the country's floor, and the owner has played it.
- `npm run check` is green.

==================== #72 [open] ['lane: area', 'approved'] Build Kestrel Edge, box D4: the Salt Road down the cliff to the Delta
Part of #65: box D4 of Callow Downs, country, band 4–5 (`docs/areas/shelf.md` §4): the Downs' way out west, down Kestrel Edge into the Delta, where Act II begins.

## Dependencies

- **Blocked by:**
  - #71: the Salt Road comes into D4 through a corner of D3.
  - #66: D4 is a box of the Downs' zone.
  - #45: country meets its floor with the wilderness features.
  - #79: the crows on the cliff are drawn.
  - #99: the runners' cave holds a Kite Shield +1.
- **Blocks:** nothing filed yet. Saltreach's Delta (not filed) meets the road at the cliff's foot.
- **Related:** #40: the atlas opens the road down the Edge only after step II (`opens: 2`, `src/content/atlas.ts:365`), and #40 opens it from the start.

## Why

The road into Act II leaves the Downs here, down Kestrel Edge into the Delta (10–12). The box holds 481 squares of the Downs' land, the cliff among them, and the low ground at its foot, all void in play.

## Proposal

- **The Salt Road** down the cliff, its last squares on the low ground at the cliff's foot, which the box takes in (`docs/areas/shelf.md` §1). Where it leaves the box the Delta begins: the world's end, until Saltreach is built.
- **Monsters:** bandits and their archers on the road (MONSTERS §5.2).
- **Country:** the looser floor, met with wilderness features (#45).

Its brief is `docs/areas/shelf.md` §4.9: the landmarks, the points of interest, the encounters, the secret and its hint, and the pay.

## Work

- [ ] The brief (`docs/areas/shelf.md` §4.9), settled with the owner.
- [ ] The scaffold, and the map authored from it.
- [ ] Its monsters placed, its secret and its hint.

## Done when

- The box passes the contract (EXPANSION §5) at the country's floor, and the owner has played it.
- `npm run check` is green.

==================== #73 [open] ['lane: area', 'approved'] Raise the Lodestone beside Helmstow: the Foreland's own Stone, whole
Part of #65: the Foreland's Wardstone, "already intact; tutorial" (DESIGN §4), which the atlas plans beside Helmstow (`src/content/areas/shelf/atlas.ts:22`) and the game does not have. The owner chose on 27 September 2026 that it is a stone to see, with a Lantern who tells a new company what a Stone is (`docs/areas/shelf.md` §9).

## Dependencies

- **Blocked by:**
  - #29, the layout refactor: `shelf.ts` moves. Like everything new, this waits on #25 (Phase 0).
  - #76: the keeper's words change once the company knows the Grove Stone is cut, and again once it is mended.
- **Blocks:** nothing.
- **Related:**
  - #42: the Grove Stone, cut, is a step of the one quest, and this is the Stone a company measures it against.
  - #21: the Lanterns' hall is in Helmstow, and the stone's keeper is one of theirs.
  - #33: its texts are held to the log's lines.

## Why

Act I asks why the Stones are failing (DESIGN §9), and the first Stone a company sees today is the Grove Stone, already cut, with nothing whole to set it against. DESIGN §4 has the Foreland's own Stone intact, as its tutorial, and nothing of it is built.

## Proposal

- **The stone,** whole, on the Foreland map (G2) at 21.5,4, just outside Helmstow: a place the company walks up to, and its text.
- **A Lantern** beside it, who tells a new company in a few lines what a Stone is and what the Lanterns do for them.
- Nothing to fight and nothing to take. It is there to be seen, so that the cut Grove Stone reads as wrong when the company finds it.

## Dialogue

Every line the Lodestone and its keeper put on screen, measured with the game's own wrap and font: a person's box holds 14 lines, and an event two lines of the log. The notes say where each text goes and which flag it sets or waits on.

*For the builder: nothing to fight and nothing to take. The stone stands at 21.5,4, off the road outside Helmstow's south gate, and its event is on the road square beside it, said once. Gytha sits at its foot; her first lines set q_lodestone, and her after-lines follow them. Two later texts take the after-lines' place once Thornhold sets their flag (#76): q_grove, when Elder Sylvane first speaks, and q_grove_done, when she takes the chisel, the second replacing the first. Neither is set here.*

*Event, the Lodestone, first seen from the road beside it:* The Lodestone. Grey, the height of two men, not a mark on it. It hums: one low note, held, that you feel in your teeth.

**Gytha, Lantern of the Lodestone**, first meeting:

> A woman in Lantern grey sits at the foot of the stone with a hand flat on it, the way you might rest a hand on a dog. Her eyes come round to you. The hand stays.
>
> "Gytha. I keep the Lodestone, which is to say I sit by it. You're a company, and new; I can smell the wax on the charter. So you get the lesson. Every company does, once, and none has needed it yet. Hand here. Go on."
>
> "That's a Stone, whole. It hums. Rain hasn't marked it and lichen won't take on it. Every spring some boy comes out with a knife for a chip of it to carry for luck, and goes home with a broken knife. A Stone doesn't wear, doesn't tire and doesn't go quiet of itself."
>
> "The Chapel says the Hearth keeps Caldera, a Stone keeps its country and a Lantern carries light from the one to the other. What we do is listen, and write down what we hear. Fourteen thousand mornings I've written one word, and never yet a different one."

**Gytha, Lantern of the Lodestone**, after: every later visit:

> Gytha's hand is on the stone. "Still whole. It'll be whole when you're back, and the time after. Same news every day, and I've not once been sorry to give it."
>
> "Got a needle? Lay it flat on your palm and hold it close." The needle turns, slow, and settles pointing out over the sea, at the Hearth. "Every one of them does that. Don't ask me why. Go and earn your charter; this one wants no help."

**Gytha, Lantern of the Lodestone**, after: the Grove Stone known cut (q_grove):

> Gytha hears you out with her hand on the stone, and at the word cut the hand goes flat and hard, as if the stone might have heard it too.
>
> "Cut. With tools." She is quiet a while. "Forty years I've told Guildhall boys a Stone can't fail, and I was right, and I'd give a good deal to have been wrong. A failing is nobody's fault. A cut has a hand on the other end of it."
>
> "You'd stood by a whole one. So you knew what was missing before anyone told you what was wrong; that's what the lesson is for, and I never thought to see it used. Don't say cut in the town. Helmstow walks past this stone every day of its life without a look. I used to mind that. I've stopped."

**Gytha, Lantern of the Lodestone**, after: the Grove's tear closed and the chisel given (q_grove_done):

> Gytha is on her stool, and there is a second stool beside her with nobody on it.
>
> "Word came over the Scarth: the tear under the Grove is shut and the man with the chisel is dead. Good. Then it's only a Stone that's hurt, and stone is patient. Thornhold has sent for a Lantern to mend it, and the Guildhall came to me, since I've had a Stone under my hand longer than anyone, and asked how."
>
> "I told them the truth: I've never mended one, and I've never met a Lantern who had. There's a book. The last hand in it is older than the Chapel roof." She looks at the empty stool. "I asked them to send a keeper; a keeper knows a Stone by the hand. They said keepers keep."

## Work

- [ ] The stone and its keeper on the Foreland map.
- [ ] The texts as the Dialogue section has them.
- [ ] The atlas's site no longer planned.

## Done when

- A new company can walk out of Helmstow to the stone and hear what a Stone is.
- Its texts wrap to two lines of the log or fewer.
- `npm run check` is green.

==================== #74 [open] ['lane: area', 'approved'] Sell tier 3 spells in the Foreland: Helmstow's Lantern Guildhall to tier 3
Part of #65: an area's towns sell its band's spell tier (EXPANSION §4), and nothing in the Foreland sells tier 3, which its casters reach inside its band.

## Dependencies

- **Blocked by:** #29, the layout refactor: `harrow.ts` moves.
- **Blocks:** nothing.
- **Related:**
  - #21: the Lanterns' hall is one of the first guilds, built there.
  - #31: the curve says what a clear's gold buys, spells included.

## Why

A caster casts tier 3 from level 4 (`spellTierAt`, `src/game/party.ts:147`), inside the Foreland's band of 1–5. Helmstow's Lantern Guildhall sets no `maxTier` (`src/content/areas/shelf/maps/harrow.ts:38`), so it sells to tier 2 (`src/ui/screens.ts:410`), and the first hall that sells tier 3 is Thornhold's, in the band after (`src/content/areas/thornmark/maps/thornhold.ts:41`, to tier 4).

## What

`maxTier: 3` on the Lantern Guildhall. A tier 3 spell costs 160 gold (`spellPrice`, `src/ui/screens.ts:423`), against a clear's 2,530 (`docs/areas/shelf.md` §8).

## Done when

- A level 4 cleric can buy a tier 3 spell in Helmstow.
- `npm run check` is green.

==================== #76 [open] ['lane: systems', 'approved'] Let people put choices, change with a flag, take several items and hand over letters to read
Part of #65: the systems the Foreland's side quests and steps ask for that nothing builds yet (#56, "What they ask of the systems"; `docs/areas/shelf.md` §6). `when`, `until` and `after` are #41's, the hand-ins at the first meeting #43's and the wilderness features #45's.

## Dependencies

- **Blocked by:**
  - #29, the layout refactor: the people it wires move there.
  - #41: an event or a person by night takes its `when`, and an event by flag its `until` and `after`.
- **Blocks:**
  - #77: 1, 3 and 8 put choices; 1, 2, 3, 7 and 8 move people or change their words with a flag; in 2 and 7 Hale and Vask take items besides their own; 2's paper is a letter.
  - #47: the customs chit is a letter read from the pack, and Hild's, Wat's and Hamo's words change with what the company has done.
  - #67: the keeper's log is a letter read from the pack, Mottram puts Oil for the Lamp's choice, and the lamp room is dark or lit by a flag.
  - #68: in Riders in the Dark the riders pass the ford only by night, and the captain chooses whether to write to Hale, and hands the company the letter if he does.
  - #73: the Lodestone's keeper says more once the company knows the Grove Stone is cut, and again once it is mended.
- **Related:**
  - #43: a hand-in to one of two people is the other way these quests choose.
  - #34: every choice is saved as a flag, as quests' are today, so nothing new is saved.

## Why

#56's quests turn on choices: give the name or keep it, send her to the Chapel or to Thornhold. The businesses put their menus through the choice screen (`ChoiceScreen`, `src/ui/screens.ts:109`), but a person can't: a person has lines, a flag and a hand-in (`npc`, `src/game/map.ts:68`). Nor can a person say something new once a flag is set, take more than one item, or be gone from one place and found in another; nor can an event happen only by night, or an item carry words to read.

## Proposal

- **A choice put by a person:** a person's lines can end in a question with two or three answers, each setting a flag and handing the company an item if it has one (the captain's letter), put through the choice screen.
- **Words that change with a flag:** a person says one thing until a flag is set and another after, as a hand-in's `done` and `after` do today (`src/game/game.ts:156`): a first meeting that knows what the company has already done, and a choice's two roads that end in two after-lines.
- **A person who moves:** a person stands where they stand only while a flag holds, or only once it does, or only by night (#41's `when`), so one person can be in two places, one at a time.
- **Several hand-ins:** a person can take more than one item, each with its own words and pay, or none: Hale takes the ledger, the clerk's seal, the tenant's paper and the captain's letter; Vask the wand and the paper; the tenant the hearth-key, for talk.
- **An event by night, or by flag:** an event can carry #41's `when`, `until` and `after`: the lamp room at Crowness, dark and then lit.
- **A letter to read:** an item can carry text, read from the pack.

## Done when

- A person can put a choice whose answer sets a flag, or hands the company an item, and the quest log reads the flag.
- A person's words can change once a flag is set, and a person can take more than one item.
- A person can be gone from one place and found in another once a flag is set, or stand only by night.
- An event can happen only by night, or only while or once a flag holds.
- A letter can be read from the pack.
- `npm run check` is green.

==================== #77 [open] ['lane: area', 'approved'] Add the Foreland's side quests on the built maps: #56's 1, 2, 3, 7 and 8
Part of #65: five of #56's side quests for the Foreland, the ones set on maps already built (Helmstow, the Foreland map, Brandy Hole), which the owner asked on 27 September 2026 to be pulled into the build (`docs/areas/shelf.md` §6). The Downs' three are built with their boxes: 4 in #47, 5 in #67 and 6 in #68.

## Dependencies

- **Blocked by:**
  - #76: 1, 3 and 8 put choices; 1, 2, 3, 7 and 8 move people or change their words with a flag; in 2 and 7 Hale and Vask take items besides their own; 2's paper is a letter.
  - #43: 2 and 7 end in a hand-in to one of two people, who takes the item at the first meeting.
  - #29, the layout refactor: `harrow.ts`, `shelf.ts` and the quest log move.
  - #17: 3 is set in the works under the keep, and is built after it; the other four need not wait.
- **Blocks:** nothing.
- **Related:**
  - #56: the drafts, and the rest of the sixty-four.
  - #21: 3 could be given from the Wardens' hall.
  - #47: in 2, the tenant starts over in Gullwick if Hale sends him.
  - #33: every text wraps to two lines of the log or fewer.

## Why

The Foreland's side quests today are fetch and fight: a wand, a ledger. #56's are the kind the story is told in, where someone asks, the company finds out, and then it has to decide. These five need nothing the Foreland doesn't already have but people and things: its town, its map and its caves.

## Proposal

As #56 drafts them:

- **1. The Bell That Rang Twice** (level 1, Helmstow). The sexton, the death bell at midnight, and the Lantern adjunct who rang it before the Queen was found. Give her name to the Wardens, or keep it.
- **2. Who Lived at Ashcombe** (level 1, the Hearthlight and Ashcombe). The tenant, the hearth-key, and his mark on a paper with the Ashen creed on the back. Bring it to Vask, or to Hale.
- **3. The Well That Tastes of Iron** (level 2, Helmstow). The well's iron, Mottram's question, and a Warden mason carting stone dust out of the works under the keep at night. Tell the Wardens, or the Lanterns.
- **7. The Clerk's Seal** (level 4, the Gilded Eel and Brandy Hole). A wife, a drowned clerk in Helmstow clothes, and his seal in the captain's den. Give it to her, or to Hale.
- **8. The Rest of the Survey Team** (level 4, the Foreland map's south-west woods). The second of the survey team, alive and hiding from the Wardens. Send her to the Chapel, or to Thornhold.

Each keeps #56's rules: a person and a choice, no story lock, two lines of the log to an event (EXPANSION §5.4).

## Dialogue

Every line these quests put on screen, measured with the game's own wrap and font: a person's box or a letter holds 14 lines (a hand-in's reward line included), an event or a sign two lines of the log, and each answer to a choice one line. The notes say where each text goes and which flag it sets or waits on.

### The Bell That Rang Twice

*For the builder: Osmund in the Chapel sets q_bell; while it is set the Eel's fisherman and a Warden on the wall by the Chapel have a line each, and Ebba, at the Eel's corner table, confesses. Osmund's choice sets q_bell_named (Ebba is gone from the Eel, not seen again) or q_bell_kept (Ebba moves to the Chapel, with her lines about Vask).*

**Osmund, sexton of the Chapel**, first meeting:

> A thin man in a leather apron is greasing the bell wheel, and looks at you the way he might look at a bell that had rung out of turn.
>
> "Sexton. Thirty years, and I've rung every hour of them: the dawn, the noon, the dusk, the deaths. A death bell is rung when the Chapel has seen the body. That is the rule, and it is a good one."
>
> "The Queen's bell rang at midnight. I was in my bed. She was not found until dawn, when I rang it myself, properly, and it had already been rung. Nobody knew at midnight that she was dead. Nobody but whoever had hold of my rope."
>
> "Find out who. Ask in the town; the Eel hears everything and remembers half of it. I want a name for the book."

**the fisherman at the Gilded Eel**, while q_bell is set:

> "Midnight, near enough. I was hauling by it and had to stop with the net half in." He drinks. "The bell? Aye, I heard the bell. I thought it was for the light."

**a Warden on the wall by the Chapel**, while q_bell is set:

> "I had the wall by the Chapel that night. The wheel creaked before it rang; that's someone on the rope who doesn't know it. Six strokes, and a seventh that didn't sound. Then the tower door, and someone in grey going down towards the Eel." He shrugs. "Grey's grey in the dark. Ours or the Lanterns', I couldn't swear."

**Ebba, a Lantern adjunct, at the Eel**, while q_bell is set, after the fisherman and the Warden:

> The Lantern adjunct at the corner table has a cup she is not drinking from, and the look of someone who has been waiting for a particular question.
>
> "You've been to the wall and the boats, so you know. Yes. I rang it. Seven for a Queen, and I couldn't lift the seventh; my arms had gone. I'd never touched a bell rope in my life."
>
> "Every adjunct learns it her first week and forgets it by the second: the Hearth burns for the Crown. It's a line in a catechism. Nobody has thought about it in two hundred years. Then I stood in the tower door and watched the Hearth go out, eleven times, and I thought about it all the way up the stair."
>
> "I was right. That's what I can't drink away. Tell the sexton what you like. I'd sooner be in his book than the Wardens'."

*Choice (Osmund, sexton of the Chapel), back at the Chapel, Ebba heard:* "Well? My bell rang at midnight, and I want the hand that rang it, for the book. Whose was it?"

- The adjunct, Ebba.
- We couldn't find out.

**Osmund, sexton of the Chapel**, answer: The adjunct, Ebba:

> "A Lantern. Under my own roof." He writes it, slowly, and closes the book. "The Wardens asked me the same the morning after, and I'd nothing to give them. Now I have. They'll want her at the keep, and they'll not say for how long."
>
> "I'd have liked it to be the wind."

**Osmund, sexton of the Chapel**, answer: We couldn't find out:

> "Rang itself, then." He writes it down: RANG ITSELF. "Thirty years I've kept this book and never lied in it. Well. It isn't a lie if it's what I was told." He shuts it harder than he needs to.
>
> "She's a Lantern, isn't she. Don't answer. Go on; the noon bell's mine, and I'll be ringing it."

**Osmund, sexton of the Chapel**, after: the name given:

> "They took her to the keep the same afternoon. Two Wardens, civil about it. Nobody has said since whether she's still there, and I've stopped asking, which I'm not proud of." He looks up at the wheel. "The bell's mine again. It's less comfort than I thought."

**Osmund, sexton of the Chapel**, after: the name kept:

> "Rang itself. It's in the book, and the book is closed." He nods towards the lamps, where Ebba is working. "The Chapel's lamps are trimmed properly for the first time in years. Make of that what you like. I've made of it what I can."

**Ebba, a Lantern adjunct, in the Chapel**, after: the name kept (she has moved from the Eel):

> Ebba is in the Chapel, sober, trimming lamps. Her hands have stopped shaking; the rest of her has not caught up.
>
> "The sexton wrote 'rang itself'. He told me so, not looking at me, and gave me the lamps to do. That's forgiveness, in a sexton."
>
> "Something for you, since you kept my name. Lord Vask came here the morning after, before the Queen was cold. He didn't ask who rang the bell. He asked what hour, to the minute, and whether anyone had counted the light. Everyone in Helmstow was surprised that morning but one man, and he's the one holding the city."

### Who Lived at Ashcombe

*For the builder: Hob by the Hearthlight's fire sets q_ashcombe_who; the hearth-key and the paper (a letter, on grey Ashen paper) are picked up in the farmhouse kitchen, and Hob takes the hearth-key at the first meeting and talks. The paper goes to Vask (q_paper_vask: Hob is gone from the inn) or to Hale (q_paper_hale: Hob moves to the shingle at Gullwick, F3); both take it at the first meeting and pay.*

**Hob, once tenant of Ashcombe**, first meeting, at the Hearthlight Inn:

> A man in a farmer's smock sits by the Hearthlight's fire with a full cup and the settled look of someone who has paid for the next one too.
>
> "Ashcombe? Aye, I had the tenancy. Had. Now the Regent's hiring companies to look at it, and everyone wants to know where my people went. Where does anyone go? Away. They went away."
>
> "The rent's forty a year, and the land gives thirty in a good year, and there's not been a good year since I took it. Do your own sums, and leave me to my cup."

*Event, the farmhouse kitchen:* The kitchen. The hearth-key on its nail in the chimney, and the hearth below it swept. Nobody flees a house and sweeps it first.

*Event, the paper, under the flour crock:* Under the flour crock, folded small: a grey paper with a mark at its foot, and on the back, in grey ink, THE HEARTH IS A CAGE.

**The tenant's paper** (a letter, read from the pack):

> A grey paper folded small, soft at the creases from handling.
>
> "For the use of the cellar under Ashcombe, from this new moon to the next, twenty in gold, paid in hand. The tenant to ask nothing, to go down no stairs, and to keep his people above them, that the farm look lived in."
>
> Below, in place of a name, a cross, pressed hard enough to tear the paper. On the back, in the same grey ink: THE HEARTH IS A CAGE.

**Hob, once tenant of Ashcombe**, carrying the hearth-key (he takes it at the first meeting):

> Hob looks at the hearth-key in your hand for a long moment, and puts his cup down for the first time.
>
> "That's off my nail. You've been in my kitchen." A breath. "They came at the back end of summer, three of them, in grey, with money, and they wanted the cellar and nothing else. Nothing else. I was to keep my family upstairs and my nose out and the smoke going up the chimney like any farm."
>
> "Twenty gold not to go down my own stairs. You'd have taken it. Everyone says they wouldn't, and everyone would. I sent Ann and the children to her people in Gullwick the first night I heard the singing come up through the floor, and I've not been down since, and I'm not going to be."

**Hob, once tenant of Ashcombe**, after: the key handed over, the paper not yet delivered:

> "Still here. Still not going down those stairs." He turns the cup. "Take that paper wherever you're taking it. I've stopped caring which door it goes in."

**Lord Aumery Vask, Regent-Warden**, given the paper (he takes it at the first meeting and pays):

> Vask reads the paper once, and the back of it once, and folds it along its own creases.
>
> "A tenant who let his cellar and did not ask. How very ordinary." He hands it to the guard at his shoulder without looking at him. "Thank you. The Crown pays for this kind of thing, and it will see the matter closed. Ashcombe will have a new tenant by spring."

**Captain Hale, Warden of the Scarth**, given the paper (he takes it at the first meeting and pays):

> Hale reads it and swears once, quietly.
>
> "Hob. I know him. His father had Ashcombe before him and never let so much as a hayloft." He folds the paper into the cover of his ledger. "He goes to Gullwick, to his wife's people, tonight, and he doesn't come back to Helmstow until I say so. A man who'll sell his stairs for twenty gold wants somewhere with nothing to sell."
>
> "Tell him I said so. Tell him gently; he'll come quicker."

*Event, the Hearthlight Inn, after the paper went to Vask:* Hob's chair by the fire is empty, his cup on the mantel unwashed. Nobody at the inn says his name, or sits in the chair.

**Hob, once tenant of Ashcombe**, after: in Gullwick, sent by Hale:

> Hob is on the shingle at Gullwick, gutting fish badly, with a child either side of him telling him how.
>
> "Hale sent me. You know; you carried the word. Ann's people have put me to the fish. I'm no good at it, and they know, and they've not said so, which is worse."
>
> "There's no singing here. There's the sea, and that's loud enough to sleep by. Tell Hale I stayed. He'll not believe it. Tell him anyway."

### The Well That Tastes of Iron

*For the builder: built after the keep (#17): Mottram's first lines set q_well, the cart is a night event at the gatehouse in the north wall, and Alwin, the Warden mason, stands there by night only. Mottram's choice sets q_well_wardens (Alwin and the cart are gone; the well's line stays iron) or q_well_lanterns (Osmund's line at the Chapel; the well stays iron; the record counts for the Council later).*

**Mottram, of Mottram's Stores**, first meeting about the well:

> Mottram sets a bucket on the counter between you and the goods, as if it were the day's most important stock. The water in it has a grey skin of grit.
>
> "Taste that. Iron. The town well has tasted of iron since the week the Queen died. My customers taste it in the bread, and a provisioner who sells bad rations doesn't stay a provisioner."
>
> "That grit is stone dust. I've handled every stone that comes through this town, whetstones, millstones, the lime they whiten the Chapel with, and it's none of them. And the cistern behind Ashcombe, four miles off, is sweet as rain. Same rain falls on both, so it's not the sky. Find me what it is, and I'll pay for it, which from a shopkeeper is saying something."

*Event, night, at the gatehouse in the north wall:* A cart with no lamp leaves the gatehouse, its wheels muffled in sacking, trailing a grey dust that the dew turns to rust.

**Alwin, a Warden mason**, night, by the cart at the gatehouse:

> A big man in Warden grey and a mason's leather apron stands by the cart. His hands and his hair are grey with the same dust.
>
> "Move along. Regent's works." He follows your eyes to the dust on the cobbles. "Aye, that's mine. It gets in the water; the old cut runs under the well. I told them. They said cart it out at night, and it's not your concern where it goes."
>
> "What's down there? An old way, older than the keep, and the Regent wants it opened. I cut where they chalk the line. Ask him what's at the bottom of it, if you're on speaking terms. I'm not."

**Mottram, of Mottram's Stores**, back at the shop, the mason heard:

> Mottram listens with the bucket between you, and does not taste it again.
>
> "Under the keep. The Regent's works." He wipes a counter that is already clean. "I asked why my well tastes of iron. I didn't ask to know that. A shopkeeper who knows things about the keep is a shopkeeper with a short lease."

*Choice (Mottram, of Mottram's Stores), after his lines above:* "You'll tell someone; your sort always does. Tell me who, so I know which way to look when they come asking. The Wardens, or the Lanterns?"

- The Wardens.
- The Lanterns.

**Mottram, of Mottram's Stores**, answer: The Wardens:

> "The Wardens. Good. Yes." He lets out a breath. "Their mason, their works and their well, come to that. They'll see to it. They always see to things." He puts the bucket under the counter. "Just not always the thing you asked about."

**Mottram, of Mottram's Stores**, answer: The Lanterns:

> "The Chapel." He considers it the way he considers a price. "They'll write it down. It's what they do, write things down: hours and bells, and now my well. Nothing will change." He puts the bucket under the counter. "Someone should have it written, though. I'll say that. Someone should."

*Event, night, at the gatehouse, after the Wardens were told:* The gatehouse by night. No cart. The grey line is swept from the cobbles, right up to the gate and not one step through it.

**Osmund, sexton of the Chapel**, after the Lanterns were told:

> "Written. Stone dust in the well, works under the keep, a Warden mason, the date and the hour, in the book with the bells." He blots it. "I don't know what a book does against a Regent. I know it outlasts one."

**Mottram, of Mottram's Stores**, after: the Wardens told:

> "Still iron." He does not offer you the bucket. "The mason's gone; nobody has seen him since, nor the cart. The dust isn't gone. Whatever they're cutting down there, they're still cutting it."

**Mottram, of Mottram's Stores**, after: the Lanterns told:

> "Still iron. It's in a book now, the sexton tells me, in his best hand." A dry sound that might be a laugh. "I send a boy to the Ashcombe cistern with a barrel twice a week. Four miles for sweet water. There's a sum in that somewhere, and I'd rather not do it."

### The Clerk's Seal

*For the builder: Maud at the Eel's cleanest table sets q_seal; a second event by Brandy Hole's tide pool shows once the drowned are dealt with, and the clerk's seal (an item) is in the captain's strongbox. The seal goes to Maud (q_seal_maud: she leaves the Eel) or to Hale (q_seal_hale: it goes to the Regent beside the ledger); both take it at the first meeting and pay.*

**Maud, a clerk's wife**, first meeting, at the Gilded Eel:

> A woman in a good plain dress sits at the Eel's cleanest table, with a cup she has not touched and a purse she keeps her hand on.
>
> "You're the company that goes into places. My husband is Edwin, a clerk at the customs house. Nine days ago he went down the beach to Brandy Hole with the price of a bottle in his pocket, and he hasn't come home. The price of one bottle. I count what leaves this house, and I count it twice."
>
> "The Wardens say the caves are closed and to wait. I've waited nine days. Find him, or find out. If it's the second, I want whatever he had on him. There's his seal, which is the customs house's property, and I'd sooner they asked me for it than asked the tide."

*Event, the tide pool, once the drowned are dealt with:* Among the drowned, a clerk's black coat, salt-stiff, the customs badge at its collar. The thong where a seal would hang is cut.

*Event, the captain's strongbox:* In the strongbox, a customs seal, brass on boxwood, worn bright. It has stamped more crates than a clerk sees in a year.

**Maud, a clerk's wife**, given the seal (she takes it at the first meeting and pays):

> Maud turns the seal to the light and looks at its face, worn bright, for a long time.
>
> "Nine months. That's how long a face wears like that." She puts it in the purse, and her hand over the purse. "There was money this winter a clerk doesn't earn. I counted it twice and didn't ask, because we ate. So I knew the sum and not the sale. Now I know the sale."
>
> "The customs house will pay to have this back, and pay more not to ask where it's been, and I'll take both and say nothing. Edwin's name stays a clerk's name. That's what I'm buying. Here's yours."

**Captain Hale, Warden of the Scarth**, given the seal (he takes it at the first meeting and pays):

> Hale weighs the seal in his good hand.
>
> "So that's how the crates got their stamp. Not forged. Real, and rented." He wraps it in a cloth. "It goes to the Regent beside the smugglers' ledger: the accounts, and the stamp that made them lawful. He'll want to know whose hand held it. So do I."
>
> He pays you from the post's strongbox, not his own purse, and writes it down. "Wardens' money. It's a Wardens' matter now, and I want that in ink."

**Maud, a clerk's wife**, after: the seal went to Hale:

> "You gave it to the Warden." She has finished the cup, for once. "So Edwin's name goes to the Regent in Hale's hand, beside the smugglers' book, and the customs house will strike him off with a note in the margin." She stands. "A note in the margin. He'd have hated that. He kept beautiful margins."

**Maud, a clerk's wife**, after: the seal sold back (her last visit to the Eel; then she is gone):

> "Sold. The customs house paid, and asked nothing, and I asked nothing, and Edwin is a clerk who drowned buying brandy, which is true as far as it goes." She stands. "I'll not be in here again. It's a filthy place. I only came because it was his."

### The Rest of the Survey Team

*For the builder: Ebba gives it wherever she is (the Eel, or the Chapel if her name was kept); a company that gave her to the Wardens starts from the Eel's rumour and the woods event, where the scrap and the fire-ring mark Ailith's hiding place in the Foreland map's south-west woods. Ailith's choice sets q_survey_chapel (she is not seen again; Osmund has a line) or q_survey_thornhold (she is in the Chapterhouse at Thornhold from level 5 on, and vouches for the company with Sylvane).*

**Ebba, a Lantern adjunct**, first meeting about the survey, at the Eel or the Chapel:

> "The survey team. Four went south a week before the Queen died. I told half the Eel and none of them listened. One's dead under Ashcombe, they say, with her wand beside her. That leaves three, and one of them is Ailith, who shared my cell at the Guildhall for six years and can't light a fire to save her life."
>
> "If she's alive she's hiding, and if she's hiding it's in a wood; she was raised in one. Look south-west along the coast, off the road. Find her, or find where she's buried, so I can stop looking at the door."

*Event, the south-west woods:* A scrap of Lantern grey on a thorn. Beyond it, a fire-ring so small and hidden that its maker feared smoke more than cold.

**Ailith, adjunct of the survey**, first meeting, in the woods:

> A young woman in torn Lantern grey has her back to an oak and a survey stake held like a spear; her leg is bound in her own hem. "You're not Wardens. Wardens don't come off the road." The stake comes down an inch. "Adjunct Ailith, of the survey. What's left of it."
>
> "It wasn't rats. I got out of the cellar when the floor opened and walked into a Warden patrol, and they weren't looking for survivors. They wanted our orders. The orders are at our camp over the Deepthorn's edge, and the other two went east to reach them first. I went west, and I didn't stop to pack."
>
> "The Regent sent us, under his seal: survey the ground under Ashcombe, report to him alone. That was before the Queen died, and before the floor opened. Ask how a man knows where to send a survey before there's anything to find. I've asked. I don't like the answer, so I'm hiding from it under a tree."

*Choice (Ailith, adjunct of the survey), after her lines above:* "I can't stay under this tree. Where do I go? The Chapel in Helmstow is mine by right, and the Wardens know it. Thornhold is a long walk on this leg, and nobody's looking for me there."

- The Chapel, in Helmstow.
- Thornhold, over the Scarth.

**Ailith, adjunct of the survey**, answer: The Chapel:

> "Home, then. Lamps and quiet and my own cell." She tests the leg, and it holds. "If you come asking after me at the Chapel and they say I'm resting, I'm resting. Don't ask a second time. That's not a warning. It's advice, from someone who was given it."

**Ailith, adjunct of the survey**, answer: Thornhold:

> "Thornhold. Elves and trees and nobody in grey." She takes the stake for a crutch. "Elder Sylvane knows a Lantern's word when she hears one. I'll tell her about you. She'll pretend not to have listened, and then she'll have listened. That's how the Chapterhouse works."

**Osmund, sexton of the Chapel**, after: Ailith sent to the Chapel:

> "The survey adjunct? She came in on a crutch, and two Wardens came for her within the hour." He goes on greasing the wheel. "I'm told she's resting. Nobody has told me where."

**Ailith, adjunct of the survey**, after: in the Chapterhouse at Thornhold, from level 5:

> Ailith is in the Chapterhouse with her leg in a proper splint and her arms full of somebody else's charts.
>
> "You got me here. The Elder heard me out and didn't rise, which is her way of standing up. I've told her the company that found me is to be trusted. She said she'd decide that for herself." A small smile. "She will. She'll decide it my way."

**Ebba, a Lantern adjunct**, after: Ailith safe at Thornhold:

> "Thornhold. Good. Elves don't hand people over; they just look at you until you leave." She almost laughs. "Six years in one cell and she can't light a fire, and she's the one who ends up safe. I'll take it."

**Ebba, a Lantern adjunct**, after: Ailith sent to the Chapel:

> "She came home, and then the Wardens came." Ebba looks at the door she used to watch. "I sat on the Chapel step that night, a long time. The Hearth was steady. I didn't count anything."

## Work

- [ ] 1, 2, 7 and 8.
- [ ] 3, once the keep is built (#17).
- [ ] The texts as the Dialogue section has them.

## Done when

- Each can be taken, each choice played both ways, and the log reads true after either.
- `npm run check` is green.

==================== #85 [open] ['lane: area', 'approved'] Rewrite the words of the built quests: Vask's, Hale's and the Gilded Eel's
Part of #65: the words of the Foreland's built quests (The Quiet Farm, The Cargo Ledger and the Gilded Eel's rumours), rewritten to the bar the Downs' dialogue sets in #47, #67, #68, #70 and #77. Every fact, flag and item stays where it is.

## Dependencies

- **Blocked by:** #40: Hale's and Vask's words say the pass is open, as it is once the flag comes off.
- **Blocks:** nothing.
- **Related:**
  - #47: Hale reads Wenna's name out of the ledger there, for Hild's second meeting; the rewrite keeps the line.
  - #77: the Eel's Lantern adjunct is Ebba, and its fisherman speaks again, in The Bell That Rang Twice.
  - #43: the hand-ins' words for a company that came early are that issue's.
  - #33: every text within the log's limits.

## Why

The owner found the game's dialogue poor (27 September 2026), and the Downs' quests have theirs written short and to a new bar. The Foreland's three built texts are the first a company reads, and they read flat beside them: Vask's hand-in says what STORY's does with none of its weight, and the Eel's rumours are five facts in a row.

## Proposal

- **The Quiet Farm:** Vask's first lines, his hand-in and his after-line, which stops saying that Hale opens the pass.
- **The Cargo Ledger:** Hale's first lines, his hand-in, with Wenna's name in it, and his after-line; the pass is open, and he warns.
- **The Gilded Eel:** its five lines as one room, each voice with the fact it carried.

## Dialogue

Every line these quests put on screen, measured with the game's own wrap and font: a person's box holds 14 lines (a hand-in's reward line included). The notes say what each keeps of the built lines.

### The Quiet Farm

*For the builder: Vask's built lines rewritten; every fact, flag and item kept: q_ashcombe on his first lines, the survey wand taken (reward 300, q_ashcombe_done), his after-lines pointing to Thornmark and the Grove Stone. Nothing says Hale opens the pass: the road is open.*

**Lord Aumery Vask, Regent-Warden**, first meeting:

> A tall man in Warden grey, his guards a step behind him. He does not wait for you to bow, and does not appear to notice that you did not.
>
> "The Crown has need of a chartered company; the Wardens are stretched thin. A farm south of here, Ashcombe, on the Foreland road, has gone quiet. Find out why. Clear whatever is there."
>
> "Bring me anything you find that is not a rat. Especially anything that glows."

**Lord Aumery Vask, Regent-Warden**, done: the survey wand handed over:

> Vask turns the cracked survey wand over in his long fingers, once, and then again. If he knows what he is holding, nothing in his face admits it.
>
> "A Lantern tool. So the Lanterns were at Ashcombe before the Crown was. Interesting." The wand goes into a pocket as if it had always lived there. "You have done what I asked. The Crown pays its debts; you'll find it does little else so reliably."
>
> "There will be more work. The Grove Stone in Thornmark has gone quiet too. Rest, train, and come back to me."

**Lord Aumery Vask, Regent-Warden**, after:

> "Thornmark, and the Grove Stone. Go and see why it has gone quiet, and bring me what you find. The road east runs through the Scarth; Captain Hale holds it, and will tell you the forest is dangerous, which it is. Thornhold will train you further than my drillyard can."

### The Cargo Ledger

*For the builder: Hale's built lines rewritten; every fact, flag and item kept: q_greywater on his first lines, the ledger taken (reward 400, q_greywater_done), the copy to the Regent-Warden. Hale reads Wenna's name out of the ledger, as #47 has him do, for Hild's second meeting. The pass is open from the start and Hale warns instead of shutting it; the exit's needFlag and blockedText go with the lock.*

**Captain Hale, Warden of the Scarth**, first meeting:

> A grizzled Warden with a bandaged arm sits on a crate by the checkpoint, and gets up when he sees you, which costs him something.
>
> "Smugglers. They've holed up in Brandy Hole, the caves at the west end of the beach. I lost three men going in after them, and the one who came back talks about worse than smugglers. I believe him. I've an arm that believes him."
>
> "Clear them out and bring me their ledger. I want the names of everyone in Helmstow who has been buying from them. Not the brandy; the names."
>
> "The pass is open. I'll not shut a road because I can't hold a cave. But it's mine to warn you about, and I'm warning you: Thornmark's wolves are twice the size of ours."

**Captain Hale, Warden of the Scarth**, done: the ledger handed over:

> Hale leafs through the ledger, and his face goes grey by the page.
>
> "These aren't smugglers' accounts. Names. Dates. A column headed CARGO BELOW." His finger stops halfway down it. "Wenna, of Gullwick. In a neat clerk's hand, like a cask of brandy."
>
> He shuts the book. "People. The Ash, here, under our feet, and I've been sitting on a crate on top of it."
>
> "You've earned this, and more than I've got. The Regent-Warden gets a copy. It's the sort of thing a Regent wants."

**Captain Hale, Warden of the Scarth**, after:

> "The pass is yours; it always was. Mind yourselves in Thornmark. The wolves are twice the size of ours and the trees are older than Helmstow, and the elves will thank you for neither observation."

### The Gilded Eel's rumours

*For the builder: the Eel's five lines rewritten as one box: the room, then the fisherman, the Warden, the Lantern adjunct and the dockhand, each with the fact it carried. The adjunct is Ebba of #77, and the fisherman speaks again there.*

**The Gilded Eel**, every visit:

> The tavern is loud and smells of eel.
>
> A fisherman, to nobody: "The Hearth stuttered the night the Queen died. I saw it from the boats. Out, and back, and out, like a man blowing on a wick that won't take."
>
> A Warden, into his cup: "Something came up out of the Ashcombe farm. Rats first, then worse. Nobody has gone to look, and nobody's been told to."
>
> A Lantern adjunct, drunk: "The survey team went south a week ago. A week. They should have been back by now. They should have been back."
>
> A dockhand: "Cheap brandy comes out of the caves at Brandy Hole, west end of the beach. Folk who buy it lately don't all come back. Captain Hale at the pass wants them cleared."

## Work

- [ ] The texts as the Dialogue section has them: the Eel's and Vask's (`src/content/areas/shelf/maps/harrow.ts:40` and `:49`), and Hale's (`src/content/areas/shelf/maps/shelf.ts:63`).
- [ ] The quest log's entries follow where they quote them (`src/content/areas/shelf/quests.ts`).

## Done when

- Every fact, flag and item of the three is where it was, and the words are the Dialogue section's.
- `npm run check` is green.

==================== #87 [open] ['lane: area', 'approved'] Move Ashcombe past Gullwick, so that the first job is further and a bit harder
Part of #65, from the owner's comment on #85 (27 September 2026): Ashcombe, the farm Vask sends a new company to, moves to the other side of Gullwick, so that it takes a bigger journey to get there, and the job is a bit harder for it, as the owner added the same day. The owner settled where, how much harder and what the Foreland map keeps on 28 September, and added a farm store.

## Dependencies

- **Blocked by:** nothing, for the design. Building waits on #47, whose F2 and F3 are the road there and whose pilot settles the thresholds the cellar is held to, and #67, which builds E3 and leaves its north-east corner for the farm. The farm store waits on #97, which draws its room, and #98, which lets it sell rations under their price.
- **Blocks:** nothing.
- **Related:**
  - #85: Vask's contract says where the farm is; whichever of the two lands second writes the new place into it.
  - #77: Who Lived at Ashcombe goes with the farm, and the Well's cistern ("four miles off") and the survey adjunct's hiding place follow it.
  - #42: The Quiet Farm is the one quest's first chapter, and its goal says where the farm is.
  - #38: the gate check holds the cellar and its Rift Warden at the new floor, and the walk to it.
  - #31: the curve, on which the walk there is worth the cellar's new floor.
  - #32: the Foreland map keeps its density without Ashcombe.

## Why

Ashcombe is on the Foreland map, about 25 squares south-east of Helmstow's gate: its farmhouse door, down into the cellar, is at 24,20 (`src/content/areas/shelf/maps/shelf.ts:51`), with its gate (`:61`), its cistern (`:76`) and its rats (`:85`) round it. The first job is done without leaving the first map, and a company can finish The Quiet Farm without seeing the Downs.

It is also easier than the gate wants. The cellar's band starts at 1 (`src/content/areas/shelf/maps/mill.ts:10`), and at level 1 its Rift Warden is won more than nine times in ten, where a boss should be won about half the time (EXPANSION §5.2; #38's figures, `docs/areas/shelf.md` §8).

Past Gullwick, the first job is nearer a hundred squares of the Salt Road: out of the Foreland by Brandy Hole's beach, through F2, through Gullwick and over the Wend. The Downs' first step, Wenna's mother at Gullwick (#47), is then on the first road a company walks, as STORY has the company meet her before anything else. And a combe is a valley: the Wend's is one.

Nothing outside Helmstow sells food on the way. Mottram's Stores is the Foreland's only shop with rations (`src/content/areas/shelf/maps/harrow.ts:37`), and Gullwick has no businesses (`docs/areas/shelf.md` §9).

## Decided

The owner's calls, on #85 and after:

- **Ashcombe moves** to the other side of Gullwick: the farmhouse, its yard and gate, its rats and the cellar's door, with the atlas's site (`src/content/areas/shelf/atlas.ts:23`). The cellar keeps its shape (`mill`): its rings, its Rift and its dead Lantern.
- **Into E3's north-east corner,** across the Wend from the village, in the last of the stubble, off the Salt Road: the other side of Gullwick on the road the company walks. E3 holds Crowness Light on its point and Ashcombe at its other corner; #67 builds E3 and leaves the corner free, and this lays the farm in it.
- **A level harder.** The cellar's band starts at 2 rather than 1. The walk holds the Downs' own groups by day, F2's and F3's (band 2–3), with their harder ones by night and in fog (`when`, #41), and the Rift Warden asks, won about half the time at level 2, as the gate wants of a boss. It stays Vask's first contract, given at level 1: the walk, with Gullwick's net loft to rest at, is where a company earns level 2.
- **The Foreland map keeps a farm** where Ashcombe stood, lived in, under a name of its own (docs/NAMES.md), with the cistern that #77's Well gets its sweet water from, so the road keeps its landmark and the map its density.
- **Its store:** a small farm store in the farmhouse, which sells rations at 3 gold, a quarter under Mottram's 4 (`src/content/areas/shelf/items.ts:14`).

## Proposal

- **The store** is a shop that names its own price for rations (#98), in a farm kitchen drawn as the businesses' rooms are (#97).

## Work

- [ ] `docs/areas/shelf.md` recut: the pay, the Foreland's contents and E3's brief (§4.4).
- [ ] The farm and the cellar's door in E3's north-east corner, and the atlas's site.
- [ ] The Foreland map's farm under its new name, and the signs that point to Ashcombe: the Foreland's (`shelf.ts:57`, `:58` and `:60`) and Helmstow's south gate (`src/content/areas/shelf/maps/harrow.ts:48`).
- [ ] The farm store: the shop and its rations at 3 gold (#98), in the room #97 draws.
- [ ] Every text that says where Ashcombe is: Vask's contract (`harrow.ts:51`), the quest log's entry and goal (`src/content/areas/shelf/quests.ts:14` and `:29`), the survey team's rumours ("went south": `harrow.ts:44` and `src/content/areas/thornmark/maps/thornhold.ts:46`), the maps' header comments and the Dialogue sections of #77 and #85.
- [ ] The cellar's band and its Rift Warden, retuned against the gate check (#38) at level 2.
- [ ] The ramp: one clear of the Foreland map and the cellar is worth level 2 today, a figure the tests pinned until the curve took their place (`src/content/progression.ts:5`); a test says that the walk to Ashcombe is worth level 2.
- [ ] DESIGN §9, whose Act I lists Ashcombe under the Foreland rather than Callow Downs.

## Done when

- At level 2 the gate check (#38) wins the Rift Warden about half the time, and holds on every box of the walk there.
- One clear of the walk to Ashcombe is worth level 2.
- The farm store sells rations at 3 gold, and Mottram's still at 4.
- Nothing in the game or the docs puts Ashcombe on the Foreland map.
- `npm run check` is green.

==================== #88 [open] ['lane: systems', 'approved'] Add dens: a camp that breeds one kind of monster until the company burns it
Part of #65: the monster camps the owner asked for on 27 September 2026, one each in E2 (#68), D2 (#69) and D3 (#71). A den keeps its box stocked with one kind of monster until a company beats its keepers and burns it.

## Dependencies

- **Blocked by:** #41: a den's brood stops coming back once it is burnt, which is `until` on the den's flag.
- **Blocks:**
  - #68: the rookery in the willows by the drowned mill is a den.
  - #69: the wolves' den in the old chalk pit is a den.
  - #71: the bandit camp by the Salt Road is a den.
- **Related:**
  - #45: a den is a feature kind, as the wilderness features are, and needs no new art.
  - #76: burning a den is a choice, put through the choice screen as a person's will be.
  - #38: the gate check fights a den's keepers and counts its brood among the box's fights.
  - #32: the density check counts a den as a point of interest and its keepers as a group.
  - #31: a standing den pays again and again, as a group that respawns does; the curve counts its brood once.
  - #34: a den is saved as its flag and its groups' states, which a map saves already, so nothing new is saved.

## Why

A group comes back today only where it was placed and on its timer (`respawn`, `src/game/map.ts:122`; the return, `src/game/world.ts:331`), and nothing a company does can stop it. The country is restocked by the clock, not by anything in it. A den makes the restocking a place: something to find, to fight for and to end. The wolves on the chalk come from somewhere, and a company that burns their den has changed the box for good.

## Decided

The owner's calls, on 27 September 2026:

- **A den breeds one kind of monster,** and keeps its box stocked with it until it is destroyed.
- **Its keepers guard it:** a group that never leaves. Once they are dead, the company can burn it or pull it down. Its brood stops coming and it is drawn as a ruin from then on; its hoard, a chest, is the company's.
- **The first three** are a rookery in E2, a wolves' den in D2 and a bandit camp in D3, each built with its box.

## Proposal

- **A den** is a feature kind: a place on the map with its kind of monster, and its camp round it in the map's own terrain (a clearing, a bank, a fence), as its box's brief has it. It shows on the automap, and as a ruin once burnt.
- **Its keepers** are a group that never leaves the den (`roams: false`) and never comes back once killed: the camp's hardest fight.
- **Its brood** is up to three groups of its kind abroad in the box at once. While the den stands it sends one out each day (1,440 minutes) that fewer are abroad, and they roam from the den. A den may set its own number and pace; the gate check settles them.
- **Burning it:** stepping into the den once its keepers are dead puts a choice, to burn it or leave it. Burnt, it sets its flag: its brood stops coming (`until`, #41) and its hoard opens; those abroad stay until they are killed. Each den has its look, said when it is first seen, and its burning, both in the log; the three dens' words are in their boxes' issues.

## Work

- [ ] The den: the feature kind, its keepers and its brood.
- [ ] Burning it: the choice, its flag, its ruin and its hoard.
- [ ] A test that burns a den and finds its brood gone for good, and the gate check's reading of a den.

## Done when

- A den can be placed on a map with its kind, its keepers and its hoard; while it stands its brood keeps its box stocked, and once burnt it breeds no more.
- Its look and its burning are said in the log, and a burnt den stays burnt through a save and a load.
- `npm run check` is green.

==================== #97 [open] ['lane: interiors', 'approved'] Draw the farm store's room: a farm kitchen on the Foreland road
Part of #65, split out of #87 on the owner's word (28 September 2026), as the monster drawings were split into #46's issues: art is hard in its own right. The farm the Foreland map keeps where Ashcombe stood has a small store (#87), and a store is a business the company walks into, with a room of its own.

## Dependencies

- **Blocked by:** nothing.
- **Blocks:** #87: the farm store opens into this room.

## Why

Every business is drawn: a shop names its room (`kind: 'shop'` takes an `interior`, `src/game/map.ts:63`), and the Foreland's six rooms are scenes in `src/ui/interiors/shelf/`, listed in its `index.ts`. The farm store has none. The smoke test holds every room on the content's list to painting at noon and at midnight as a picture rather than a flat fill (`tools/smoke.ts:132`).

## Proposal

- **A farm kitchen,** low-beamed and lived in: loaves and cheeses on the table, a ham and strings of garlic and herbs in the rafters, sacks and a crock by the door, the hearth and a plain counter where the rations are sold. Most of it is props the rooms already share (`src/ui/interiors/props.ts`: `loaf`, `cheese`, `ham`, `garlic`, `herbs`, `hearth`, `sack`, `jar`, `jug`, `stool` and `counter`).
- **Not a town shop.** Mottram's Stores is shelves and a brass scale, and the Hearthlight a common room round a fire; this is a working farmhouse, with the farm's own food and nobody else's.
- **Its light:** a window on the yard by day, and the hearth and a candle by night, as the other rooms are lit (`Scene`, `src/ui/interiors/kit.ts:41`).
- **Its name** is the farm's, which #87 gives it (docs/NAMES.md), and the scene's id follows it.

## Work

- [ ] The scene in `src/ui/interiors/shelf/`, listed in its `SCENES` and on the Foreland's list of rooms (`src/content/areas/shelf/index.ts:26`).
- [ ] Looked at in the interiors gallery (`tools/interiors.ts --only` its id), at noon and at night.

## Done when

- The room paints at noon and at midnight as a picture, and the smoke test holds it.
- The owner has seen it in the gallery.
- `npm run check` is green.

==================== #98 [open] ['lane: systems', 'approved'] Let a shop sell an item at its own price
Part of #65, split out of #87 on the owner's word (28 September 2026): the farm store sells rations under Mottram's price, and no shop can today.

## Dependencies

- **Blocked by:** nothing.
- **Blocks:** #87: the farm store sells rations at 3 gold, a quarter under their price.

## Why

Every shop sells an item at the item's own price. A shop holds only its stock (`kind: 'shop'`, `src/game/map.ts:63`), and its buy screen lists, greys out and charges each item's price (`buyScreen`, `src/ui/screens.ts:353`, charging at `:358`–`:359`), so the same thing costs the same everywhere. Rations are 4 gold (`src/content/areas/shelf/items.ts:14`) wherever they are sold.

## Proposal

- **A shop's own prices:** a shop can name a price for any item in its stock, and its buy screen shows and charges that price; an item it does not price sells at its own, as today.
- **Selling back is unchanged:** half the item's own price (`sellPrice`, `src/ui/screens.ts:383`), whatever a shop sells it for.

## Done when

- A shop with its own price for an item shows and charges it, and every other shop charges as today; a test proves both.
- `npm run check` is green.

==================== #99 [open] ['lane: quality', 'lane: area', 'approved'] Give the Foreland a gear ladder: the band's gear at Mottram's, and +1s and named finds on the Downs
Part of #65, on the owner's word (28 September 2026): gear that betters every class's kit by level 3 and again by level 5. It takes in the Downs' named finds, which this issue first held alone. Magic items past a plus (elements, resistances and stat gear) stay in #18.

## Dependencies

- **Blocked by:** #100, for the +1s: each is its base with a plus. Mottram's stock waits on nothing.
- **Blocks:**
  - #47: F2 and F3 hold the kits' weapons with a plus.
  - #67: E3 holds a kit's armour with a plus.
  - #68: E2 holds a kit's armour with a plus, and the rookery's hoard a keepsake.
  - #69: the hollow barrow's cist holds the guardsman's Halberd +1 and ring of office, and the wolves' den's hoard a Spear +1.
  - #70: the niche behind the bier holds the Barrow Captain's arms, and the first side chamber a Queen's Long Sword +1.
  - #71: the bandit camp's hoard holds a Long Bow +1.
  - #72: the runners' cave holds a Kite Shield +1.
- **Related:**
  - #101: Thornmark's chests, the ladder's next steps.
  - #18: the magic items of levels 11 to 32, and the artifacts of the reach.
  - #31: the curve says what a find may be worth in its band's window.
  - #38: the gate check dresses its company by the ladder, as EXPANSION §5.2 has it.
  - #88: a den's hoard opens when it is burnt.

## Why

Past its kit a class gets little on the Foreland, and four get nothing:

| Class | The best past its kit, levels 1–5 |
|---|---|
| Knight | Chain Mail, found in Brandy Hole |
| Paladin, Ranger | a Long Sword and Chain Mail, found in Brandy Hole |
| Barbarian | a Long Sword, found in Brandy Hole |
| Monk, Druid | a Spear from Mottram's |
| Cleric, Sorcerer, Thief, Bard | nothing |

Mottram's Stores, the Foreland's only shop with gear, sells little past the kits: a club and a spear (`src/content/areas/shelf/maps/harrow.ts:37`). The band's gear is only found: the Long Sword, the Kite Shield, Scale Mail, Chain Mail and the Long Bow in Brandy Hole's chests (`src/content/areas/shelf/maps/greywater1.ts:45` and `:47`, `greywater2.ts:42` and `:44`), where EXPANSION §4 has a town sell its band's gear. No weapon hits better for being found, and no item is a better copy of another (#100). The Downs add four levels of the road with nothing new to wear, and their briefs name finds that are no items at all: the Barrow Captain's arms, a guardsman's halberd, his ring of office and the dens' hoards (`docs/areas/shelf.md` §4.6 and §4.7, #88).

## Decided

The owner's calls, on 28 September 2026:

- **A plus is +1 to hit and damage** on a weapon, and +1 armour class on armour (#100).
- **Mottram's sells the band's gear.**
- **Pluses are found, not sold,** in Act I: in chests, secrets and dens' hoards.
- **The curve's window holds:** no find is dearer than the Foreland's 500 gold (`src/content/progression.ts:34`), so the captain's mail is Scale Mail +1; Chain Mail +1 would be 650.

## Proposal

A step every level or two, for every class:

| Levels | Where | What |
|---|---|---|
| 1 | the kits, and Mottram's | as today |
| 2–3 | Mottram's | the band's gear: Long Sword, Hand Axe, Scale Mail, Chain Mail, Kite Shield and Long Bow |
| 2–3 | found in F2 and F3 | the kits' weapons with a plus: Dagger, Mace, Short Sword and Quarterstaff |
| 3–4 | found in E3 and E2 | the kits' armour with a plus: Robe, Leather Armour and Buckler |
| 4–5 | found in D2, D3, D4 and the Berth | the band's gear with a plus, and the named finds |

- **The named finds** and the rest of the top step:
  - the Barrow Captain's arms (#70): his sword and his mail, a Long Sword +1 and Scale Mail +1 under names of their own, in the Queen's deep blue and gold (#17);
  - a Queen's sword in the Berth's first side chamber, a Long Sword +1;
  - the guardsman's grave goods in D2's hollow barrow (#69): a Halberd +1, a new two-handed polearm for the martial classes, between the Spear and Thornmark's Battle Axe; and his ring of office, a keepsake that sells well, since nothing is worn on a hand;
  - the dens' hoards (#88): in the rookery's (#68), bright things a crow would carry, a keepsake; in the wolves' den's (#69), a dead traveller's Spear +1; in the bandit camp's (#71), a Long Bow +1, the best bow on the road;
  - the runners' cave in D4 (#72): a Kite Shield +1.
- **Every class** betters its kit by level 3 and again by level 5:

| Class | By level 3 | By level 5 |
|---|---|---|
| Knight | Chain Mail, Kite Shield | the captain's sword, Kite Shield +1 |
| Paladin | Long Sword, Chain Mail | a Queen's Long Sword +1, Kite Shield +1 |
| Ranger | Long Bow, Chain Mail | Long Bow +1 |
| Barbarian | Long Sword | Halberd +1, Leather Armour +1 |
| Cleric | Mace +1 | Robe +1, Buckler +1 |
| Sorcerer | Dagger +1 | Robe +1 |
| Thief, Bard | Short Sword +1 | Leather Armour +1 |
| Monk | Quarterstaff +1 | Robe +1, Spear +1 |
| Druid | Quarterstaff +1 | Leather Armour +1, Spear +1 |

- **Priced as the plus has it** (#100), each find within its band's window (EXPANSION §5.2, #31). Brandy Hole's chests keep their gear, a saving to whoever finds it.
- **The ladder is the gear a company has at each level:** the harness dresses its company from it (`GEAR`, `tools/harness.ts:96`), and the gate check the same (EXPANSION §5.2), so the Downs are tuned against it.

## Work

- [ ] Mottram's stock.
- [ ] The items: the pluses, the Halberd and the keepsakes, in the Foreland's table (`src/content/areas/shelf/items.ts`).
- [ ] The briefs name each find and where it lies (`docs/areas/shelf.md` §4.2 to §4.9), and §8 the ladder.
- [ ] The harness's gear by level, and the gate check's, from the ladder.
- [ ] A test that walks the ladder class by class.

## Done when

- Every class can better its kit by level 3 and again by level 5, and the test says so.
- Every find the briefs name is an item, priced within its band's window.
- `npm run check` is green.
