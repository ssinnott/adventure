==================== #79 [open] ['lane: creatures', 'approved'] Draw the Carrion Crow, and the birds' frame the road reuses
Part of #46: the first of the birds, a new family, for Callow Downs (MONSTERS §5.2 and §11). The frame is the one the road reuses for the great owl, the grey heron, the wrack gull, the raven, the spine eagle and the vulture, so it is drawn to carry them.

## Dependencies

- **Blocked by:** #35: every drawing passes the silhouette check, and has a sprite kind of its own.
- **Blocks:**
  - #47, #67, #68, #69, #71 and #72: crows in the stubble at Coldharbour and Gullwick, at the gibbet, over the wolves in the Wend's fields, on the chalk, along the lip of Kestrel Edge and on the cliff (`docs/areas/shelf.md` §4).
  - #48: the Great Owl is drawn on this frame.
- **Related:** #37: its strip goes on the contact sheet; until then `tools/gallery.ts` makes it.

## Why

The Downs' fodder has no drawing, and no bird exists: the birds are a new family, a module of their own (`src/ui/monsters/birds.ts`). A family is the costliest thing the game draws: today's run from 159 lines (the rat) to 1,264 (the cultist), and the art pass took about forty commits (EXPANSION §11).

## Proposal

- **The Carrion Crow:** fodder, level 2, six to eight to a group. *Crows, too many to count, and all of them watching.* It flies, so it reaches the back row (`ranged` without `missile`, MONSTERS §5.2). Small beside the rat (0.35), black with a sheen, the eye the one bright thing on it.
- **The frame:** a bird's body, wings and head in parts the later birds can reshape: an owl's round face, a heron's neck and legs, a gull's long wings, an eagle's size.

## Work

- [ ] The birds' module, and the crow's sprite kind.
- [ ] The crow, through the silhouette check.
- [ ] Its gallery strip, ending on the hit flash, on a contact sheet.

## Done when

- The crow is drawn in `src/ui/monsters/birds.ts`, passes the silhouette check and is on a contact sheet.
- The frame's parts are named for the birds to come (MONSTERS §11).
- `npm run check` is green.


==================== #80 [open] ['lane: creatures', 'approved'] Draw the Wrecker: oilskins, a boathook, and a boat they were expecting
Part of #46: a wrecker of the Downs' coast, on the bandit frame (MONSTERS §5.2 and §11).

## Dependencies

- **Blocked by:** #35: every drawing passes the silhouette check, and has a sprite kind of its own.
- **Blocks:** #47 and #67: wreckers on Gullwick's beach by night, and on the Salt Road in fog below Crowness Light (`docs/areas/shelf.md` §4.3 and §4.4).
- **Related:** #37: its strip goes on the contact sheet.

## Why

The wreckers are the Downs' people: the dark on the coast, with people in it who were waiting for it (MONSTERS §5.2). They have no drawing.

## Proposal

- **The Wrecker:** soldier, level 3, four to a group with a lampman, by night and in fog. *Oilskins, a boathook, and a boat they were expecting.* The bandit's build under a wet oilskin coat and hood, the boathook long enough to read as a weapon.
- It carries a chit stamped with the Helmstow customs seal, as Brandy Hole's crates are (a drop, not a drawing).
- **On the bandit frame** (`src/ui/monsters/bandit.ts`), which the road reuses for the bargemen, the Wrack smugglers and the anvil guard (MONSTERS §11).

## Work

- [ ] The wrecker's sprite kind on the bandit frame.
- [ ] The drawing, through the silhouette check.
- [ ] Its gallery strip, ending on the hit flash, on a contact sheet.

## Done when

- The wrecker is drawn in `src/ui/monsters/bandit.ts`, passes the silhouette check and is on a contact sheet.
- `npm run check` is green.


==================== #81 [open] ['lane: creatures', 'approved'] Draw the Lampman: a lantern held high on a pole, and someone under it
Part of #46: the wreckers' lampman, on the bandit frame (MONSTERS §5.2 and §11).

## Dependencies

- **Blocked by:** #35: every drawing passes the silhouette check, and its lamp is a glow declared detached.
- **Blocks:** #47 and #67: one lampman to every wreckers' group, on Gullwick's beach and on the Salt Road in fog (`docs/areas/shelf.md` §4.3 and §4.4).
- **Related:** #37: its strip goes on the contact sheet.

## Why

The Downs' fight in fog turns on him: when thick fog leaves two squares of sight, the lamp is the first thing the company sees (MONSTERS §5.2). He has no drawing.

## Proposal

- **The Lampman:** archer, level 3, one to a wreckers' group. *A lantern held high on a pole, and someone under it.* He slings stones over the wreckers, and leads them once there is morale.
- The lantern hangs above the figure on its pole and glows: a detached glow the silhouette check allows, and the part that must read at a distance and in fog.
- **On the bandit frame** (`src/ui/monsters/bandit.ts`), beside the wrecker.

## Work

- [ ] The lampman's sprite kind on the bandit frame, with the lantern's glow.
- [ ] The drawing, through the silhouette check.
- [ ] Its gallery strip, ending on the hit flash, on a contact sheet.

## Done when

- The lampman is drawn in `src/ui/monsters/bandit.ts`, passes the silhouette check with the glow declared, and is on a contact sheet.
- `npm run check` is green.


==================== #82 [open] ['lane: creatures', 'approved'] Draw the Black Dog: the size of a calf, with eyes like coals
Part of #46: the dead's own hound, on the wolf frame (MONSTERS §5.2 and §11).

## Dependencies

- **Blocked by:** #35: every drawing passes the silhouette check, and its eyes are a glow declared detached.
- **Blocks:** #69: the Black Dog walks the chalk hills round the Berth by night (`docs/areas/shelf.md` §4.6).
- **Related:** #37: its strip goes on the contact sheet.

## Why

The hills by night belong to it, and it has no drawing.

## Proposal

- **The Black Dog:** skirmisher, level 4, one and then two, by night. *A black dog the size of a calf, with eyes like coals.* Bigger than the wolf (0.55): a calf's height, rough-coated, black on black, so that at night the eyes are what the company sees first.
- Its bite holds (paralysis, 0.1): nothing in the drawing need show it.
- **On the wolf frame** (`src/ui/monsters/wolf.ts`), which the road reuses for the sunder hound and the moor hound (MONSTERS §11).

## Work

- [ ] The dog's sprite kind on the wolf frame, with its eyes' glow.
- [ ] The drawing, through the silhouette check, by day and by night.
- [ ] Its gallery strip, ending on the hit flash, on a contact sheet.

## Done when

- The Black Dog is drawn in `src/ui/monsters/wolf.ts`, passes the silhouette check with the glow declared, and is on a contact sheet.
- `npm run check` is green.


==================== #83 [open] ['lane: creatures', 'approved'] Draw the Barrow Guard: the Queen's guard in her colours, still standing to
Part of #46: the Queen's guard in the Berth, on the skeleton frame (MONSTERS §5.2 and §11).

## Dependencies

- **Blocked by:** #35: every drawing passes the silhouette check, and has a sprite kind of its own.
- **Blocks:** #70: the guard stands two by two down the Berth's passage (`docs/areas/shelf.md` §4.7).
- **Related:**
  - #17: the Queen's colours, deep blue and gold, which the owner chose there.
  - #37: its strip goes on the contact sheet.

## Why

The Berth's guard has no drawing, and it is the first thing in the game to wear the Queen's colours.

## Proposal

- **The Barrow Guard:** armoured, level 4, in pairs. *The Queen's guard, in her colours, still standing to.* A skeleton in old plate and a tabard of deep blue and gold, faded in the barrow's dark but still the Queen's, with a halberd held upright: it holds its ground and never roams.
- Heavier than the cellar's skeleton; not yet the Bone Knight's bulk.
- **On the skeleton frame** (`src/ui/monsters/skeleton.ts`), which the road reuses for the chanter, the bog body, the Cairn King and the glassbound (MONSTERS §11).

## Work

- [ ] The guard's sprite kind on the skeleton frame, in the Queen's colours.
- [ ] The drawing, through the silhouette check.
- [ ] Its gallery strip, ending on the hit flash, on a contact sheet.

## Done when

- The Barrow Guard is drawn in `src/ui/monsters/skeleton.ts`, passes the silhouette check and is on a contact sheet.
- `npm run check` is green.


==================== #84 [open] ['lane: creatures', 'approved'] Draw the Barrow Captain: her captain, still at his post
Part of #46: the Downs' boss, the Queen's captain in the Berth, on the skeleton frame (MONSTERS §5.2 and §11).

## Dependencies

- **Blocked by:**
  - #35: every drawing passes the silhouette check, and has a sprite kind of its own.
  - #83: the captain is drawn on the guard's kit, and ranks above it.
- **Blocks:** #70: the captain stands at the Queen's bier (`docs/areas/shelf.md` §4.7).
- **Related:**
  - #17: the Queen's colours, deep blue and gold.
  - #37: its strip goes on the contact sheet.

## Why

The Downs' boss has no drawing: the hardest fight in the band, won about half the time at the floor (EXPANSION §5.2).

## Proposal

- **The Barrow Captain:** boss, level 5, alone. *Her captain, at his post beside the bier.* The guard's kit made a captain's: a crested helm, a cloak in the Queen's blue gone nearly black, gold at the throat, a longsword grounded point-down before him. Larger than the guard, as a boss is (MONSTERS §4.3).
- Whether the bier beside him is empty (MONSTERS §5.2) or holds the Queen (STORY) is #70's question; the bier is the map's, not the drawing's.

## Work

- [ ] The captain's sprite kind on the skeleton frame.
- [ ] The drawing, through the silhouette check.
- [ ] Its gallery strip, ending on the hit flash, on a contact sheet.

## Done when

- The Barrow Captain is drawn in `src/ui/monsters/skeleton.ts`, passes the silhouette check and is on a contact sheet.
- `npm run check` is green.

