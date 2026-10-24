# Hearth Isle's decisions

Hearth Isle's decisions (EXPANSION §8.2): the old §9 of its doc, `docs/areas/hearth.md`, moved here
whole by #1027, every list in its order. It is appended to and never rewritten: a builder adds a
list at its end, and a later decision that changes an earlier one says which. Its current state is
`docs/areas/hearth.md` and its plan `docs/areas/hearth/plan.md`.

## 9. Decisions

Decided by the owner's delegate on 12 October 2026 with this plan, as #443's were for Act IV, each
grounded in DESIGN, STORY, MONSTERS and the atlas, and each the owner's to overturn before the
issue that builds it is approved. Four add to the design rather than settle it (4, 7, 10, 11), and
are marked so.

1. **The Core's door is the act's one lock,** the road's second and the one it was always sure to
   spend (DESIGN §9; EXPANSION §2.3). It is the Stair's last exit (§4.7), `needFlag` the five flags
   the road itself sets at the Stones: `q_tide_home`, `q_grove_done`, `q_anvil_closed`,
   `q_peak_stood` and `q_ember_lit`. The Grove's flag is its closing, the road's, not the Lanterns'
   mending, which is a side quest's (#56's 18) and may never be done: the door asks the road, the
   Hearth's count asks the mending (and `stones.ts` must read `q_mender_done` for it, which The
   Mender sets and `q_grove_mended`, owed to #56, does not: the road behind fixes it); the
   mending opens nothing (§5, the lock). The Peak Stone's flag is new, set by I11's `i11_stone`
   event (#751), since a `seen` cannot be a `needFlag`. A save that stood at the Peak
   Stone before that lands has seen the once-event and will never get the flag from it, so the
   save upgrade brings it (call 9's seventh issue): `SAVE_VERSION` goes to 5
   (`src/game/save.ts`), and `toV5` (`src/game/upgrades.ts`) sets `q_peak_stood` wherever
   `highspine_i11:i11_stone` was seen, recorded in `shipped.json` and tested in
   `tools/tests/save.ts`. Signed in `src/content/locks.ts` on `q_ember_lit` at `underdeep2` 16,1
   with its reason: *the heart opens for whoever makes it whole.* The count on the road becomes two
   of four.
2. **The area's band is 28–32, the cap, on the atlas and the curve,** with its places inside it:
   the isle and the temple 28–29, the crypt 29, the Ways 30, the Stair 30–31, the Heart 32. `next`
   is 32, which the curve reads as `MAX_LEVEL` for the road's last row: three quarters of a clear
   reaches the cap at the Catcher's foot. Nothing is `outside`; the Underdeep and the Core keep
   their rows on the atlas as places of kind `deep` and `areaBand` widens by them, so the row's
   band is the atlas's; the bands still rise along the road (§8; call 9's first issue).
3. **Hearth Isle is two boxes, both core: H6 and I6.** H6 the isle's body, the strand, the Bowl,
   the Hearth and the temple's door; I6 the east rim, Anchorhold where the atlas has it and the
   Hand's Steps where the causeway lands. The grey door at the Steps that opened for Wenna's hand
   is an event and no exit: the Hand's way in is seen and never walked, and no lock is spent on
   it. I6's north edge faces the Deepthorn's I5, pinned against I5's rock where the land meets it,
   and H6's north edge is cut to the world, the H5 box being unlaid: no way crosses either.
4. **No town; the pilgrims' camp is the isle's rest** (an addition, as Akordu was the Wold's,
   #443's call 5): a camp, the Pilgrims' Store and the Lantern's tent for the dead and the sick.
   Sergeant Aelfric's tent (57) trains to 32, the cap, which asks `trainerCeiling` to be capped at
   `MAX_LEVEL` (the systems lane) since the band's top plus one is 33. Cinderport stays the port,
   a day away by the last crossing each way; it trains to 27 as built. The band's gear is found,
   never sold: the isle has nothing to sell but the store's cures.
5. **The voice says what DESIGN §9 gives it and no more,** and it says it to Wenna: *Captain. Give
   the order.* The window's truth, that the vessel is not in orbit, is never said by the voice,
   nor before the choice; the
   third answer is offered only to a company whose flags hold `meridian_map`, Fane's map given at
   his fire (#22), and its words are the company's: *It is lying. It never arrived.* The secret
   stays found, never told.
6. **The choice is Wenna's question, and the game goes on.** Three answers, two without the map,
   each setting its flag; the chapter is done on any, and the quest with it. As the answer is
   taken the ending's three pages are shown on a screen of the systems lane's, long-form, and the
   company is back in the Heart with the ring in its pack and the world changed: the Hearth's state
   on the title, in the night sky and in the almanac (relit: still and at full; opened: the day's
   sky the wrong colour and the column as it was; finished: harder than relit, and the almanac's
   line says the ground hums); the sentries that hunt Ashfall stand down (`until: ENDED`, by the
   leave rule, call 9); Helmstow's gate opens to everyone; Vask is before the Council in the keep's
   hall in irons (relit, finished) or gone from the world (opened); each hall says its word (the
   Wardens and the Lanterns approve relit and the Cartographers and the Compact opened; the
   Lanterns split on it, the Guildhall's and the Watch's lines differing); the priestess at the
   Drowned Temples hears her god sing (relit), hears nothing and sings herself (opened) or hears a
   travelling song (finished). The walk home is played, not told: The Walk Home (§6) takes the
   company to Gullwick, where Hild waits and Wenna joins her, by the last crossing, Kilnhaven's
   ship, the ferry and the coast road, or any way it likes. Nothing is a lock, and no ending closes
   anything.
7. **The Core's clock** (MONSTERS §9.3; an addition to the fight's rules): `EncounterDef.clock`,
   `{ calls: '<monster id>', every: 2, dims: 8, panel: ['<monster id>'] }`: while any monster the
   `panel` names (the Grey Hands, `panel: ['grey_hand']`) stands, the fight's leader calls one of
   the named monster every `every` rounds, up to the cap of twelve monsters over the fight, and the
   light dims a step a round, to `dims`, where it holds at a thread; the panel's monsters down, the
   calling stops and the light holds where it is. The clock's calls ignore `calls.chance` and are
   not stopped by `MAX_GROUPS`, three groups to a fight (`src/game/combat.ts`), under which no more
   than two sentries would ever come; whether that is one called group that grows or calls exempt
   from the group cap is the clock's issue's to choose and the harness's to measure. Both of the
   Heart's groups, `core_vask` and `core_vask_thinned`, carry `sets: 'q_vask_fallen'`
   (`EncounterDef.sets`, #636), so the fight ends on the one flag whichever was fought. The fight
   screen (`src/ui/combat.ts`) draws the dimming over the backdrop and the log says it every third
   step: *Through the roof, the light goes out a little.* and at the last, *The light holds at a
   thread.* No fail state: the light cannot go out in a fight, since the choice after is the
   company's and nothing on the road changes what is offered. With it, `MonsterDef.obeys`, a
   monster that stands down when every leader in the fight is down though its kind never breaks
   (the Core Sentries, machines, when Vask falls): the fight ends with Vask, as the Stair-king's
   does with the king. Vask himself is `steady` and `kind: 'person'`, and `calls` the sentries on
   the clock's beat and never on his own chance.
8. **#56's seven for Act V stand,** 56 to 61 and 64, built with their maps (§6); 62 and 63 are the
   reach's, Phase 1.6's. Two changes to the drafts: 56's key opens the treasury, not the crypt,
   since a crypt behind a key behind a flag would be a second lock; and 60 is one way, from the
   inside, since the mines' side opens for nobody the company has (the Deep Mines' brief, #22).
   61's artifact is a staff of the window's price, since artifacts are the reach's (#18). The
   drafts drift in four smaller ways too, declared here: 59's word is on the last frame, not at the
   last door; 58 loses "read it or not"; 56's moths go to the light, not for the causeway; and 57
   drops from 29 to 28 and 61 from 31 to 30.
9. **What the systems lane adds, in one issue each** (the Phase's systems epic), eight issues and
   no ninth, each in the systems lane:
   1. the curve's last row, ending at the cap: its next floor (`MAX_LEVEL` for the road's last
      row); its band (`areaBand` widened by the area's deep places); `PLANNED` and `owed` until H6
      lists the area; and the trainers' ceiling capped at `MAX_LEVEL` (`trainerCeiling`,
      `src/content/progression.ts`) (2, 4; §8);
   2. the gear's last rung at 28, found and never sold (`GEAR`, `tools/tests/ladder.ts`, `GEAR_TOP`
      from 25 to 28) (4; §8);
   3. the leave rule: an opt-in rule by which a group is gone once its `until` holds, standing or
      not, since today's `until` only keeps a killed group from coming back (`src/game/map.ts`,
      `src/game/world.ts`). Every thinning in the plan waits on it (`core_vask`, `i6_guard`,
      `hf_second`, the temple's moths once the lamps are out, `ud2_rearguard`, `ud_knockers3`,
      Ashfall's sentries after an ending and the Sunder's groups), and every group that does not
      opt in keeps today's rule;
   4. the Core's clock and `obeys`, with the panel marker and the calls past `MAX_GROUPS` (7);
   5. `Exit.lifts` and `Exit.after`, a shut that is over once a `When` holds and an exit that is
      there once one does, which Helmstow's gate (6) and the CREW ONLY door (60) want; `after` is
      read as an appearance, as a presence is, so pillars' `findLocks` does not count it and the
      CREW ONLY exit is no lock between areas (§6, 60);
   6. the endings: their table, the long-form screen and the Hearth's three states on the title,
      in the night sky and in the almanac (`src/ui/title.ts`, `src/ui/viewport.ts`,
      `src/game/stones.ts`), which are this issue's and not the road behind's (6; §12);
   7. the save upgrade: `SAVE_VERSION` 5 and `toV5`, which sets `q_peak_stood` wherever
      `highspine_i11:i11_stone` was seen, with I11's `i11_stone` setting it for new play (1);
   8. the gate bot and the harness run to 32 on the roster with the clock played (the Hands
      first), and `tools/testmonster.ts`'s `LEVELS` gaining 30.

   A person's words do not pay: the sacristan's key is an answer's (56). The pilot (#721) is a
   Related line only: if it lands first it stops at the answers' `sets`, every one a flag of the
   last chapter's `done`, and nothing here depends on it.
10. **The Empty Throne ends at the Council of Helmstow** (an addition in its shape; DESIGN §10.1
    in its substance): one sitting; a case for any of the three, for Wenna or for nobody, carried
    by any two of that claimant's pieces or by the signet; and a verdict that changes Helmstow for
    the rest of the game and removes Vask from the keep before the Core, which thins the Hand on
    the isle (§4.3, §4.4, §4.8): the only way to do so, as DESIGN says. The verdict decides who
    holds the Stair's first landing and who stands with the company at the core (DESIGN §10.1, as
    written): the winning claimant's people on the landing, and Tallis's man at the Heart's door
    when the chair is his. 57's tokens are a piece for their claimant, and decide the same where no
    claimant's verdict carried. The Wardens' siege (DESIGN §8, §10.2) is cut: nothing in the design
    says what it is beyond its name, and the Compact handed to the Wardens has its consequence on
    the strand (§6); with it go the Ashfall crossing made harder and the Compact as a fence, which
    the plan does not pay.
11. **Master trainers go with the skill tiers, not the isle** (an addition to M3's scope, DESIGN
    §12): the Novice, Expert and Master tiers of the weapon and magic skills were not built when the
    isle was planned, so there was nothing for a Master to teach, and they stood parked in the
    Phase's epic, outside its Done when. #18 has built them since (#852) and set its two Masters on
    the road, the Wold's Rider (#858) and Old Cinder's scholar (#859). The Sorcerer's third is the
    reach's (#448, Phase 1.6). M3 is otherwise the phase's: Act V, all endings, the three subplots'
    ends and the Cleric's third. Decided by the owner's delegate, 16 October 2026 (#807): the
    Sorcerer's third comes into M3, at the Glass's edge on the Wold (docs/areas/glasswold.md §6).
12. **The road behind, in one issue** (as #449 was Act IV's): `stones.ts` reads `q_mender_done`
    (1), and the stale comment there that says `q_ember_lit` is owed in `UNSET` goes; I11's
    `i11_stone` setting `q_peak_stood` is not here but the save upgrade's (call 9's seventh, #751); the
    sentries' `until` in Ashfall, by the leave rule (6); Helmstow's gate, the keep (Vask's
    presences `until` the verdict, an ending or `{ visited: 'hearthisle_h6' }`, and his steward's
    line), #449's gibbets `until` the verdict, the Eel, the inn, the stores and the Chapel for the
    verdicts and the endings (6, 10); Gullwick's shore: Hild's last words, Wenna on the shingle,
    Jowan's mother and the sea (§6); the halls' and the priestess's lines, each hall's spoken by
    its guild's own person where there is one and by one the issue adds where there is not (6,
    §12); the Kilns' knockers through the open door and the thane's line (60); the Sunder's groups
    stopped, by the leave rule, and the Watch's line (61); the last crossing's isle end written,
    its fare free for a Partner (§6). The Hearth's three states on the title, in the night sky and
    in the almanac are call 9's sixth issue's, not this one's.
13. **Names** (§10): the Lanterns' English kept, with Hearthfane for the temple and the Bowl, the
    Strand and the Hand's Steps for the isle's places; the Ways, the Stair and the Heart for the
    deep, the docs' plain names for places nothing on the surface names, as the Sleepers' Bay is.
14. **The cuts** (§11): none of the land; the Wardens' siege (and with it the harder Ashfall
    crossing and the Compact as a fence), Master trainers and the reach's two quests, each to its
    own phase or to nothing.

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.8 as written, every line included; a builder keeps the squares the
  chapter and the quests key on and lays the rest.
- **The shares** of §8, and the Ways' and the Stair's groups as the balance.
- **The bands on the atlas's rows**, set in `src/content/areas/hearth/atlas.ts` where only the
  scaffold reads them.
- **The isle's climate** (§2): `{ summer: 22, winter: 14, daily: 4, damp: [0.05, 0.09], wettest: 60, fog: 0.1, lag: 14, fogText: 'A haze comes in off the Sound, and the light stands in it like a lamp in a sack.', thunderText: 'Thunder, far off over the mainland. The light does not waver.' }`.
- **The rooms** (the interiors lane): `bowl_store`, `bowl_yard` and `bowl_lantern`, three tents,
  as Akordu's trader's is a tent (`src/ui/interiors/glasswold/akordu_trader.ts`). Drawn (#762, §3,
  §9.2).
- **The sheet**: `node tools/sheet.ts sheet.png --area hearth`, on every pull request that adds a
  map, a monster or a room, sent to the owner in the Claude app (CLAUDE.md).

### 9.1 Changes taken in review

Taken on 13 October 2026 by the owner's delegate in review of the plan, these are the owner's to
overturn before the issue that builds each is approved.

15. **Vask's fall is a flag.** Both of the Heart's groups, `core_vask` and `core_vask_thinned`,
    carry `sets: 'q_vask_fallen'`, and `VASK_FALLEN` is that flag: everything after the fight keys
    on `{ flag: VASK_FALLEN }`. A company that won the Council kills the thinned group, and the
    panel, the voice, Wenna and the chapter still come.
16. **Thinning needs the leave rule.** Today's `until` takes no standing group off a map; it only
    keeps a killed one from coming back. Every thinning here (the Heart, I6's guard, the temple's
    second group and its moths, the Stair's rearguard, the knockers at the crack, Ashfall's
    sentries and the Sunder's groups) waits on an opt-in rule from the systems lane, the leave rule
    (call 9), and every other group keeps today's rule.
17. **Ways back up.** The Ways have an exit up to the crypt and the Stair one up to the Ways, at
    16,31 on each (§4.6, §4.7). A company that reaches the Stair before the five flags walks back
    to the pilgrims' camp and rests.
18. **The Peak Stone's flag for old saves.** I11's event sets `q_peak_stood` for new play, and a
    save upgrade (`SAVE_VERSION` 5, `toV5`) sets it wherever `highspine_i11:i11_stone` was seen,
    recorded in `shipped.json` and tested in `tools/tests/save.ts` (call 1; call 9's seventh issue).
    The event's `sets` and the upgrade ship together in that issue (#751), so no save at version 5
    meets the event without the flag.
19. **The verdict decides who stands at the core.** The Council's verdict puts the winning
    claimant's people on the Stair's first landing and, for Tallis, his man at the Heart's door to
    hinder; the pilgrims' tokens decide where no claimant's verdict carried, and DESIGN §10.1
    stands as written. A Partner's runner stands at that door too (§4.8), and the Compact's one
    spy's word is the strand runner's (§6), where DESIGN §10.2 puts it.
20. **The Hand's own door.** The Hand came in at the Steps by the service ways, opened the crypt's
    grey door from below for its garrison and went into the Heart by a door of its own at the
    Stair's foot, which opened for her hand and is shut behind them: an event and no exit (§4.7).
    The Stones' door, with the creed cut across it, is the one the Hand could not open.
21. **The door asks the road's five.** Call 1 stands: the Grove's closing opens the door, and its
    mending brightens the Hearth's count and opens nothing (§5, the lock).
22. **Eleven fights to a rest.** Eleven at 28, rising to twelve at 32 (MONSTERS §3.3; EXPANSION
    §5.2), not six. The temple with the crypt, the Ways and the Stair are each one run from the
    camp, so the counts stand (§8).
23. **The Council's timing.** The clerk appears once the Hand has Wenna (`q_wenna_taken`). The
    keep's Vask goes once the company has reached the isle, his steward's line in his place, and
    #449's gibbets go with the verdict; a Council that sits after an ending says so, with Vask
    before it in irons (§6). Once it has sat, the clerk's answers at the gate put the ring in the
    chair's keeping (64).
24. **Wenna after the ending.** She stays at the Core with her words after the ending until Hild
    has said hers (`until: { flag: WENNA_HOME }`), and then stands on Gullwick's shingle beside
    her mother (§6, The Walk Home).
25. **No square booked twice.** The clerk at the gate stands at `shelf` 15,4 and `gate_open` is at
    16,5, off the start square and its sign; `core_panel` is at 9,4, off the voice's square; Wenna
    on the shingle is at 11,15, off Wat's elder boy's.
26. **Two names changed.** The elf of Henlys is Talwyn, of the elves' tongue, and the Council's
    clerk is Wiglaf, an English name used nowhere else; the names the plan first gave them belong
    to Cinderport's harbourmaster and Lantern Watch's prior (§10).
27. **The sacristan's key is an answer's.** His words after the lamps end in a choice of one
    answer, *Take the key.*, which sets `q_lamps_key`, gives `fane_key` and pays 3,000 xp, as any
    answer can today. No person's words pay, so the systems lane is asked for nothing here.
28. **The elves' lines.** Talwyn asks only that whatever is at the bottom see the elves' mark, and
    the elves' captain says what is at the bottom was never theirs. Neither says what the doors
    answer to: the secret stays found.
29. **Six events to three lines.** `core_heart` and the five carried verdicts are written short
    enough for the log's three lines, measured with the game's own wrap.
30. **No lid at the Steps.** I6's sign of Act IV's line is dropped, since whitespine.md keeps that
    line to Sheer Point with no word of it elsewhere.
31. **Twelve monsters.** The Ashen Rearguard stays, and §7 says the roster honestly: twelve
    monsters, one new family.
32. **What the Compact pays.** The plan pays the ferry, the runner's spy's word and the sea lanes,
    and DESIGN is brought to that. The siege, the harder crossing and the fence are cut.
33. **The Grove's sliver.** A once-event at the column's foot (H6 23,16), for a company that
    carries the Mender's sliver, pays #56's 18: the sliver hums again under the Hearth.
34. **Three calls accepted as declared.** The band's gear is found, never sold (call 4); Master
    trainers go with the skill tiers, built since with two Masters on the road (#858, #859), and the
    Sorcerer's third is the reach's (call 11); the siege is cut (call 10). Decided by the owner's
    delegate, 16 October 2026 (#807): the Sorcerer's third comes into M3, at the Glass's edge on the
    Wold (docs/areas/glasswold.md §6).
35. **The Deep Mines' end of 60.** The company lands on the Clean Corridor's floor at 13,3 facing
    west, before the door drawn in the wall. The map is band 17–18, so no Act V monster stands
    there: the knockers that come up are the Kilns' own (§6, 60).
36. **The clock's sentries.** The clock names its panel (`panel: ['grey_hand']`), and its calls
    ignore `calls.chance` and pass `MAX_GROUPS`, up to the cap of twelve monsters over the fight.
    The mechanism is the clock's issue's to choose (call 7).
37. **The cache's find.** The north rim's cache holds three Smelling Salts, each waking one member
    from sleep or paralysis. They replace a lamp for the whole company, which would have asked a
    new system and taken an id Ashfall already uses.
38. **The land counted again.** H6 has 757 squares of land and I6 270, 1,027 in all, with the
    shallows apart: about one zone map's worth (§1).
39. **The squares the drafts make rock or water.** Every named square on the boxes now stands on
    walkable ground of fitting terrain, or in ground the builder carves: the cleft, the rim's path,
    Anchorhold's yard and the secrets' pockets. The seam, the north edges, the temple's mound and
    the strand are as the drafts have them, and I6's secret turns west into the rim (§4.2, §4.3).
40. **The curve's row.** It lands in `PLANNED` with an `owed` row until H6, takes `MAX_LEVEL` as the
    road's last next floor and has its band from `areaBand` widened by the deep places. Only the
    7,000 window is checked, and `OVER_ROAD` is moot (§8).
41. **The gear's numbers.** Each piece is one point past its rung at Cinderport's armourer: the
    blade 2d12+6, the axe 2d12+7, the knife 1d8+14, the bow 1d12+13, the staff 1d10+13, the Old
    Lantern's 1d10+14, the mail ac 14, the robe ac 13 and the shield ac 8 (§8).
42. **The Heart's share.** The Heart pays Vask and his three Grey Hands, about a tenth, and the
    sentries the clock calls, eight at most: an eighth as booked. The shares sum to one, with the
    Ways and the Stair the balance (§8).
43. **The Hearth in the area's own atlas.** H6's issue moves The Hearth, Anchorhold, the zone and
    the deep places into `src/content/areas/hearth/atlas.ts`, dropping `planned` as each is built,
    so the landmark counts as new (§7).
44. **`Exit.after` is an appearance.** Pillars do not count it as a lock, as they do not count a
    presence, so the CREW ONLY exit is no lock between areas: it waits only on the company's own
    answer at that door (§6, 60).
45. **The preacher's spell.** The preacher casts `firebolt`, the spell's id in
    `src/content/spells.ts`; the plan named one that does not exist.
46. **The pilot is related only.** If #721 lands first it stops at the answers' `sets`, and nothing
    in the act depends on it.
47. **Eight systems issues.** Call 9 names exactly eight, each in the systems lane: the curve's
    last row; the gear's last rung; the leave rule; the clock and `obeys`; the two `Exit` fields;
    the endings with the Hearth's three states; the save upgrade; the gate and the harness to 32.
    There is no ninth.

### 9.2 Decided while building

Decided by delegate for #745, each the owner's to overturn:

1. **The row's `owed` is the epic's, #744,** as Act IV's rows owed theirs (#445 to #447): a clear
   falls short until the Heart is built, long after H6 takes the row out of `PLANNED`.
2. **The deep places are found by the atlas's `deep` ways,** from the area, its zones and their
   maps, place to place; each reads its own band, as its step on the road does, or its map's when
   it has none. The box that builds the first deep map keeps its `deep` way on the atlas or teaches
   `areaBand` its exits: the curve check fails if the band narrows.
3. **The cap is the next floor only for the road's last row,** one with no row after it and no area
   of a later order on the atlas; a row whose next area has no band fails as before.
4. **The rise is waived only at a floor of the cap** (`nearTop`, `tools/tests/curve.ts`): the
   Heart's 32 asks 30, where a band of 31–32 still asks 32. Fixtures hold both, and the deep places'
   widening on the atlas with a stand-in box laid at 28–29.
5. **`OVER_ROAD` is typed by the curve's keys,** so a planned row type-checks against it; the Hearth
   has no entry, its lead over the cap never being positive.

Decided by delegate for #748, each the owner's to overturn:

1. **One called group that grows.** The clock's first call opens a group and every later call joins
   it, so the Heart holds two groups and the fight screen seats and labels it as any other. Calls
   exempt from the cap, a group each, measured the same within a point and asked more of the screen.
2. **The call costs Vask no turn.** It comes at the end of a round on the beat while he stands, asleep
   or not. As his turn, every second blow became a sentry and the clock eased the fight (the
   harness's bot: 44% with the Hands first, 67% with Vask first, 33% with no clock).
3. **The beat.** The light steps at each round's end from the first, a thread at the end of the
   eighth; the calls come at the end of the second, fourth and on, and act from the next round.
4. **Standing down pays nothing,** as the fled do, and the log says *2 Core Sentries stand down.*
5. **The bots kill the panel first** (`markOf`), as #752 asks; a tool may turn them to Vask first
   or to the sentries as they come (an `answer` with another `clock`, passed to the call, #946).
6. **Vask's odds wait on #761.** On the test monsters the plan sizes the Heart by, the gate's bot wins
   10% with the Hands first, 16% with Vask first and 5% with the sentries fought as they come (23%
   with no clock; MONSTERS §9.3): the clock halves the odds as §8 has it, the whole far under them.

Decided by delegate for #747, each the owner's to overturn:

1. **The leave rule is `leaves: true` on a group, beside its `until`** (`EncounterDef`): the smallest
   change, with `until` and `ended` untouched, so every group without it keeps today's rule (the
   Kilns' strays). Not on `Presence`, since a person or an event goes by `until` alone, nor a form of
   `until`, which the quest log reads.
2. **One check, in `World.liveGroups`**, which every reader of a standing group goes through. The
   group's record is left as it stood, so leaving is no kill (no `slainText`, none of its `sets`, no
   `slain`) and nothing new is saved.
3. **`gone` in `tools/walk.ts` plays a group leaving, and `fight` there fails on one that has left**,
   so no walkthrough wins a fight with a group that is gone and sets its flags. The cases are
   fixtures in Helmstow; no real group leaves until the boxes place one.
4. **Read from the flags, as a person's going is:** a group whose `until` stopped holding would be
   back where it stood. Each `until` the plan gives is a flag that stays set.

Decided by delegate for #749, each the owner's to overturn:

1. **An `after` at a seam is a gate.** There the exit's square is the way across, so its gate
   refuses the party until `after` holds; anywhere else an exit not there leaves a plain square.
2. **The overlay draws no padlock for either field.** `zoneEdges` gates only on `needFlag`: a `shut`,
   and so its `lifts`, turns back some companies and not the way, and an `after` is no lock.
3. **An exit not there yet is not drawn, followed or counted:** not on the automap, not by `homeMap`
   (the Ways open onto the isle, not the Kilns), not as pillars' way beside a shut exit.
4. **The maps check counts a person, a group and an event** (`groupFlags`, an event's `sets`); an
   inn's nights and a guild's quests stay out, as the issue named only the two.
5. **The weather exception names the door, both maps and both regions;** `hearth` is no region yet
   (the area's first box adds it), so the fixtures name it as a word.

Decided by delegate for #762, each the owner's to overturn:

1. **Three shapes of tent.** The store is a ridge tent of undyed canvas pitched to the ground, the
   sergeant's a wall tent of the Wardens' grey, the Lantern's a round pavilion of white linen on one
   pole: shape and cloth tell them apart, and none is Akordu's felt on a lattice.
2. **The column stands in the store's door only,** and lights it by night: the isle's one sight,
   shown once; the other two keep to their trades.
3. **The nine goods are seen on the store's trestle:** the six cures in flasks, bread and cheese
   for the rations, a bundle of torches and the oil in stoppered jars, the meal in sacks beside.
4. **The sergeant drills where he can:** his back wall rolled up on the grass, a pell of sacking
   on a spare tent pole; his grey cloak with the old badge, his helm and sword are his only word.
5. **The dead and the sick are things seen:** a shrouded form on a bier with the Lanterns' ring on
   its breast and a candle at its head, and an empty pallet with its blanket turned back.
6. **Ahead through `ROOMS_AHEAD`,** as Cinderport's went, and owed to #753 in `UNPLACED`: the check
   that every business has a room fails on a room no business opens into, so H6 drops both.

Decided by delegate for #761, each the owner's to overturn:

1. **The Champion drops nothing yet.** §7 gives it `grey_knife` at 0.1, but the knife is #746's and
   not on main, so the def leaves the drop out and #746 adds it with the item.
2. **Vask is a tall boss.** Size 1.6, drawn at 0.78 of the frame, his crown at 0.801 under the
   markers (0.82), as the Tallymaster's and the Sentinel's are: a tall man over Grey Hands at 1.05.
3. **The core's light is white and gold:** the Core Sentry's ring and port, the Queen's ring on
   Vask's hand and the Underdeep keeper's lights, against the furnaces' orange and the bay's blue,
   so the core's machines and the ring that orders them read as one.
4. **The keeper is told apart by its pose and its plate:** the bay keeper's frame bare, taller and
   thinner, dark, seven fingers, both hands raised to touch (`raise` in the keepers' Build, 0 for
   every keeper before it).
5. **The Core Sentry has a body of its own,** `core`: the Sentry's legs and keel with a ring for a
   head and two long arms alike. MONSTERS has it the frame's Build and a tint, but a tint alone
   would be the Sentry again.
6. **The deep rat is pale,** bred out of the sun: lean, up on its legs, ribbed and red-eyed, against
   the rat's brown, the barn rat's fat and the bilge rat's slick black.
7. **Nothing comes loose but the moth's dust.** The preacher's embers and the Grey Hands' ash broke
   the silhouette at combat size, so they are not drawn: the fire on the palm carries the sermon.
8. **The Wold's walkthrough reads AHEAD by name.** It asserted AHEAD empty, true only while it was;
   it now asserts the Glasswold out of it, which is what it meant.

Decided by delegate for #761 (the crawlers), each the owner's to overturn:

1. **The Deep Crawler comes head-first down the wall, front on:** seven plates upright with their legs
   splayed to the sides and the front pair and the clamps on the floor, so it stands where a fight
   seats it and still reads as coming down from above. The wall is not drawn.
2. **The Catcher is a crawler built into a cage:** the crawler's plates, rods, brass knees and red
   lamps over a hood and seven hooked arms closed to the floor, two pairs of long legs standing it
   over them; one family at a glance, and the boss another shape.
3. **One of the Hand is in the cage,** slumped in the champion's robe and steel, an arm hung out
   through the bars: the look's line seen, never said. If the cage should be empty, it is one block
   of the module.
4. **Sizes:** the crawler 1.25, the test brute's; the Catcher 2, the Eldest's, drawn at 0.8 of its
   frame so its crown stands at 0.801 under the markers (0.82): a head and more over the crawlers it
   leads at the foot (`ud2_catcher`).
5. **The lamps are a dull red,** against the core's white and gold, the keepers' gold and the
   walker's green-white: the crawlers' own, things that work in the dark.
6. **The chisel's mark is cut in a plate of each:** the makers' machines, as every knocker, keeper
   and heavy machine is (`knockers.ts`).

Decided by delegate for #751, each the owner's to overturn:

1. **`toV5` reads what the game's own `seen` reads.** The event counts as seen when the High Spine
   is among the save's `zones` and the outdoors' `used` holds `i11_stone`. The zone, the event and
   the flag are kept frozen in the upgrade (`V5_PEAK`), so a later edit of the map or of
   `stones.ts` cannot change which saves it reaches, and the upgrade and the Hearth's count agree
   on who stood at the Stone.
2. **The flag is set to 1,** as an event's `sets` sets it. A save that has it keeps it.
3. **`shipped.json` records the version and the flag.** It is at 5, and `q_peak_stood` is new,
   from the event's `sets` (5 below). Nothing in it goes or moves.
4. **New play is checked in the Whitespine walkthrough,** whose step at the Stone already stands
   on the event; `tools/tests/save.ts` holds the saves from before.
5. **The event's `sets` lands in #751, not in #765.** The upgrade and the flag ship together, so
   no save at version 5 has seen the event without the flag, and no window is left between them.
   The road behind has nothing of it to do.

Decided by delegate for #750, each the owner's to overturn:

1. **The real pages are in.** §5 gives all three whole, so `src/content/endings.ts` holds them with
   their flags and names; #759 has only to set the flags. The machinery's cases run on a fixture.
2. **The world map's Hearth follows the state too,** in a few lines: a map showing a column the
   title no longer shows would read as a bug. It has no sky, so opened shows there as at five.
3. **The looks** (`hearthLook`, `src/game/stones.ts`): relit is five Stones' column and still;
   opened is five Stones' column under a violet sky with a rose foot, most of the way by day, less
   at dusk and none by night; finished is two steps past full and still. On the title the column
   meets the top of the view at five, so there finished stands wider rather than taller.
4. **The screen** (`src/ui/ending.ts`): the ending's name over the title's dusk, the Hearth as the
   ending leaves it, a page at a time at twice the log's size. The answer's own words come first in
   their box; Space or Esc turns a page, and past the last the company stands where it stood.
5. **The voice check's exception** sits beside `MOST_LINES`: three pages to an ending, each within
   the screen's six lines (the Hull Opened's second takes four of the log). The pages go through the
   glyph and spelling checks with every text, and an ending's answer is still held to three.
6. **Two endings held**, which the Heart's question should not allow, read as the table's first.
   `ENDED` is exported from the table as a `When` list for #759 and #765 to import.
7. **Nothing new is saved:** the state is read from the flags, so it needs no save upgrade.

Decided by delegate for #764, each the owner's to overturn:

1. **The sitting is Wiglaf's word, not twelve events.** By day after the case he stands at `keep`
   4,5 and says the first verdict that holds, which sets its flags, and is gone with it (`until` the
   six). Pillars' line check counts every event on a square together, and twelve verdicts on one
   square run past the log's four lines. The words, the square, the flags and the once are §6's.
2. **The morning after is the day's hours** (`when: { hours: 'day' }`): no condition counts a night
   from a flag, so a case made by day is heard on the next step to the chapel by day.
3. **Wenna's answer at the first meeting.** The five answers are words `after: { flag: 'q_wenna_up' }`
   that set `q_council_met` themselves: a person's words are read before the meeting hires, so
   `after: { flag: ['q_council_met', 'q_wenna_up'] }` would offer her only at a second meeting.
4. **Which words were said is a flag** (`q_council_early`, `q_council_late`), so the log says the
   Regent's absence or Vask in irons as the sitting did: an entry cannot ask that a flag is unset.
5. **One proclamation with no name**, *Over it: the Council of Helmstow holds the city under its
   seal.*, an event on the sign's square said after it at every step, since a sign takes no
   presence. Five named ones there run past the log.
6. **Vask's door is the Council's:** Wiglaf at 7,4 with the throne room, `after` the removal, two
   lines of mine. The doorway check wants a business that goes to have a twin, and the locks check
   wants its trade had (#157's form); otherwise it is a lock to sign in.
7. **The inn at 12, the Chapel for the hold and Mottram's for Tallis are each the next link on its
   doorway,** which #776's doorway chain allows (`doorwayFaults`, the block below): the dearer inn
   `until` the removal and one at 12 `after` it; the Chapel's notice `until` the hold's verdict and the
   Chapel back `after` it, written temple, word, temple; Mottram's dearer stores `until` Tallis's and a
   twin `after` it. They came in a second pull request, stacked on #776, since #774 could not hold them.
8. **The goal names the girl from Gullwick only to a company she led up;** to the rest it says *the
   cousin, the hold, Tallis or nobody*.
9. **A piece may be one of several flags:** the treaty is one piece by either mark, and Wenna's case
   is `q_wenna_up` with one of her three. The pairs are a `When` list built from §6's table
   (`carried`, `keep.ts`). The tokens (#753), the signet (#759) and the walk home (#765) are owed in
   `UNSET`, as are the endings' flags (#759), read from `src/content/endings.ts`. #759 sets the
   endings' in Wenna's answers; the signet's four flags are #765's (#759's 10).
10. **A port's prices are twice the old city's,** the Lantern Oil as before: dearer than the Regent's
    half again, as §6's *dearer for Tallis* asks, and the oil's forty is Mottram's own word.

Decided by delegate for #764 (the doorway check), each the owner's to overturn:

1. **A chain, and nothing wider.** `doorwayFaults` (`tools/tests/maps.ts`) takes businesses with a room
   each, in order on the square: the first only `until` X1, each next `after` the one before's `until`
   and, but the last, `until` its own, none with a `when`, the last only `after`. A word or twin on
   another condition, a gap, a `when` on a link, a link gone with nothing after it, a person before the
   business, a second business and a doorway with no business fail as they did.
2. **The Chapel's way is a word, then the business back.** A shut door's word (an event `after` X and
   `until` Y, no `when`) may be followed at once by the business again `after` Y, as the next link. The
   word must go on Y, or it would be said at an open door; a word that does not go leaves the business
   behind it a second business, as before.
3. **A chain may end in a word.** Any link that is gone may be followed by the shut door's word, as the
   first always could, so the stores may shut after they go dearer. The word may stand anywhere after the
   link, as it did; only a twin or the business back must follow at once.
4. **Conditions compare as `same(...)` did,** to the letter: a `When` list on a word's `until` and on its
   business's `after` is one constant (the hold's verdict with `ENDED`, in #765).
5. **Checked against the old rule, not only on the maps:** over every list of up to four features on a
   doorway (4.7 million; three flags, a `when`, events, people and keepers) nothing the old rule passed
   fails, a list passes that did not only if it is a chain (a second recogniser, written from the issue,
   agrees on every list), and every list outside a chain gets the same faults word for word. The run was
   a scratch script; the fixtures in the maps check are what stays.
6. **No doc line described the rule,** so none is changed: EXPANSION §8.2 is the zone-map recipe, and
   the comment above `doorwayFaults` is where the rule is told.
7. **This unblocks the twins owed in the Council block's 7 and in #765.** The inn at 12, the Chapel for the
   hold and Mottram's for Tallis are each a link added to a chain; the Chapel is its word gone `until` the
   hold's verdict and the endings, and its temple again `after` the same list. No map is touched here.

Decided by delegate for #753, each the owner's to overturn:

1. **57 is `bowl_pilgrims` and its met flag `q_bowl_pilgrims`.** The plan's `pilgrims` and
   `q_pilgrims` are Rimewater's 44, The Pilgrims in the Pass: `byId` throws on the quest, and a
   company that met the pilgrims in the pass would start 57 at once. §6's 57 is swept to match.
2. **All three pilgrims set the met flag,** not Aelfric alone: a company that meets Talwyn or Pasco
   first and takes the token would never start the quest, since Aelfric goes with another's token.
3. **57's `done` is `HELD` for now:** the three tokens and the three claimants' verdicts, with an
   entry for each token. The rearguard slain, the "carried none" entry and the goal at `underdeep2`
   are #758's: a key naming a group or map not built fails `tools/tests/quests.ts`. #758 built them
   (#758's 4).
4. **The north-west coast and hills outside the rim are the rim's rock to the shallows** (rows 0–18,
   some 53 squares, the sand there made shallow; and 6,20–21). No way on foot reaches them and the
   brief places nothing there, but density walks only standable ground from its points, so they
   stood past 15 of any point. The shelf from the strand to the lookout at 7,22 is as drafted.
5. **The grass at 29–31,0 in the north rim's corner is rock.** Walled off from every other square of
   H6 by the rim and the void, it failed the maps check's reach from the start (swimming included).
   So the seam's row 0 is H6's rock against I6's grass, where the plan had it walkable on both sides.
6. **The temple's door at 18,14 is a building square, with no feature,** until #755 joins its exit;
   `h6_front` at 18,15 says the door. No exit: one to an unbuilt map fails `tools/tests/maps.ts`.
7. **The three tents open round a yard at 16,16,** each business on a door square as the maps check
   asks: the store's door 15,16 (its tent 15,15), the sergeant's 17,16 (17,15) and the Lantern's
   16,15 (16,14).
8. **The cache is two squares carved,** 26,6 (`h6_cache`) and 26,5 (the chest `h6_lamp`), behind the
   secret door 26,7, so the hollow's line and the chest do not share a square.
9. **The map starts at the boat's landing,** 20,30 facing north; the scaffold's start, 16,15, is the
   Lantern's door.
10. **The isle's road at the gate is the cleft's two pickets and the sermon,** from the strand to the
    temple's door; the moths come by night and are off it.
11. **Two under, the isle is won every time** (100% at 26; `hearthisle_h6: under` and `Hearth Isle:
    under`, rows of `OWED` until #851). Stronger monsters are barred and fewer groups would not
    lower it. The issue's "one at 26 no more than one in four" is therefore not met; since #851 the
    gate judges two under past 10 by the day, and asks no more of the fights.
12. **The brief's seven groups are kept as written:** 12.19 fights to a rest at 28 (aim 10 to 12,
    limit 8.5 to 14.5), off the aim but inside the limit; the pay is 1.07 of the share, under 1.25.
13. **`HELD` is exported from H6's map** with the tokens (the Council's three flags imported from
    `shelf/maps/keep.ts`), since the plan's table has the map that sets them export the constants.
14. **The champion drops `grey_knife` at 0.1,** and the knife is H6's item (`greyKnife`, 1d8+14,
    6,400, light): #761's decision 1 left the drop to the item's issue, and #746 takes the item into
    its rung.
15. **The runner and the Warden sergeant share 23,30,** each `after` its own end of the Compact
    (`q_compact_over`, `q_compact_wardens`), so they never stand together.
16. **The walkthrough kneels with `useShrine` directly:** `kneel` in `tools/walk.ts` compares the
    outdoors' moved feature with the map's by identity and so fails on any zone map. Not this
    issue's to fix. Since #793 `kneel` works on a zone map and the walkthrough kneels with it.

Decided by delegate for #754, each the owner's to overturn:

1. **Two points the brief does not name,** for density: `i6_keel` (8,10), *A boat's keel on the grass
   under the rim, stripped to the ribs. Its planks went to the Hand's fires.*, and `i6_wyke` (5,2),
   *The rim's north end. Across the Wyke, Thornmark's shore, near enough to count the oaks and too
   far to reach.* Without them the east foot's north half and the north rim, some 45 squares, stood
   9 to 27 steps from any point (core asks 90% within 8 and none past 15). The land is kept as the
   plan has it, not made rock. The words are the builder's own.
2. **Anchorhold's cell at 4,18 is a building square (`B`),** not plain rock. The art check holds a
   small map to half its wall faces dressed: the secret door, I6's only wall, draws damp on its four
   faces (100%, failing), and the cell, undressed, brings it to 4 of 8 (50%, the cap). Not walkable,
   as the rock was, and the cell shows on the map.
3. **The secret's `hint` is `i6_smell`** (2,25): the field takes one event id, the smell stands beside
   the door, and the tally-house (3,24, east of the door) is the runner's word's mark. The
   walkthrough searches from the tally's square facing west.
4. **The hoard `i6_hoard` is at 0,24,** the pocket's west square, and the takings' line `i6_takings`
   at 1,24, so the line and the chest do not share a square (as H6's cache, #753's 8).
5. **The carved squares are dirt (`:`):** the yard 2–5,19–20, the path 1–2,18 and 6–7,19 and the
   pocket 0–1,24, as H6's cleft and cache are.
6. **`i6_guard` is three champions then the preacher, `back: 1`** (`back` counts from the end),
   `roams: false`, `until: { flag: THRONE_REMOVED }` (from `shelf/maps/keep.ts`) and `leaves: true`.
   There is no `UNSET` entry for `q_throne_removed`: the Council sets it (#774). `encounter:leaves`
   is not claimed in `novel`.
7. **The plan gives a respawn to `i6_rim` alone** (2,880). `i6_guard` and `i6_guard2` take 2,880 too
   (the Hand's, as H6's champions) and `i6_moths` 1,440 (as H6's moths); none is a guardian. `aware`
   is 3, the stair's two 2.
8. **The Grey Mail is for the Drakeskin Coat's wearers** (`NO_CASTER_HEAVY`), not `MAIL` (knight,
   paladin, ranger): §8 has each piece a point past Cinderport's armourer for every class, and the
   coat's rung is those seven. It is `A('grey_mail', 'Grey Mail', 7000, 14)`; the Grey Staff is in
   the Battle Staff's form, `W('grey_staff', 'Grey Staff', 6200, 1, 10, { kind: 'staff', bonus: 13,
   twoHanded: true })`.
9. **The start is 8,19 facing south,** where the path comes out over the sea; the scaffold's 12,17 is
   shore sand. No company lands on I6: the zone's way in is H6's boat.
10. **The isle's road at the gate gains `i6_rim`, `i6_guard` and `i6_guard2`** after H6's three: out of
    the Bowl's east pocket by the rim's path and down the east foot to the camp. The moths by night
    are off it, as H6's are.
11. **Two under, I6 is won every time** (100% at 26; `hearthisle_i6: under`, a row of `OWED` until
    #851) as H6's is. Stronger monsters are barred and fewer groups would not lower it. The issue's
    "one at 26 no more than one in four" is therefore not met; since #851 the gate judges two under
    past 10 by the day, and asks no more of the fights.
12. **The brief's four groups are kept as written:** 11.32 fights to a rest at 28 (aim 10 to 12).
    They pay 2,908 xp a member against a twelfth, 3,911: 0.74 of the share. No floor on a box's
    share is checked, and more or stronger groups were not the brief's.
13. **The walkthrough's first line holds the zone's two maps,** where H6's asserted one, and plays the
    leave rule: the guard gone with `q_throne_removed` set, then back with the flag deleted and
    fought.

Decided by delegate for #755, each the owner's to overturn:

1. **The treasury's door is a door gated on the key, not a `locked` square.** The engine's `locked`
   opens to any `key_iron` and uses it up, and iron keys lie in five chests and the dens. So 11,10
   is a door with an authored gate, `gates: [{ x: 11, y: 10, after: { item: 'fane_key' }, blockedText }]`
   (#749's `after`, read by `World.move` on any map): it opens to the sacristan's key and to nothing
   else, and the key is kept. No system changed. It is the first authored gate on a door; a door's own
   key would be a systems issue, if the owner prefers one.
2. **The pillar's carving is split at its colon:** `text` *Carved up the pillar in the oldest hand on
   the isle.*, `read` *FIRST THE SEA. THEN THE SHORE. THEN THE HOUSE. LAST OF ALL THE HEARTH.* A
   sign's id is kept by `seen` only when it has `read`, and then only by a company with a reader; the
   same text twice runs past the log (the pillars check holds words and reading together to its
   lines). So a reader reads the order, as the sacristan's "if you can read a pillar" has it, and the
   log's pillar entry is a reader's; any company has the order from the quest's goal or by trial (a
   wrong lamp stays lit and the right order still works).
3. **56's ids are the plan's** (`lamps`, `q_lamps`, `q_lamps_out`, `q_lamps_wrong`, `q_lamps_key`,
   `fane_key`, the lamps' `lamp_sea`, `lamp_shore`, `lamp_house`, `lamp_hearth`): none clashes in
   `src/content`.
4. **The stair down is wall until the crypt:** 8,1 is `#`, and `STAIR` (the brief's exit to
   `hearthfane2` 8,14 facing north, with its label) is exported and not listed, as `meridian_camp2`'s
   `STAIR2` was: an exit to an unbuilt map fails `tools/tests/maps.ts`. 8,2, the altar's square, is
   floor for the crypt's way up. #756 opened the stair (its 5).
5. **The banners are the Hand's grey, `#6a6866`,** not the palette's `#8a3a2a`: the brief and the
   issue put the Hand's grey either side of the arch (12,2 and 12,4, `banners`), and a map hangs one
   colour (`palette.banner`), so any it hangs by chance are the Hand's too. The rest of the palette
   is the brief's.
6. **The House and Hearth lamps' turn lines follow the Shore's:** the House lamp says *The moths have
   left the Shore lamp for it.* and the Hearth lamp the same of the House lamp; the plan gives the
   Shore's only. Built by one `lamp()` maker, as the Ember Stone's `socket()`.
7. **The swarm respawns at 720, as the moths:** no quest names it and it has no `slainText`, so it is
   no guardian, and the respawn check holds every other group to 720 to 2,880. It leaves with the
   moths on `q_lamps_out`.
8. **`aware`, which the brief leaves open:** 3 for the moths, the swarm and the sermon; 2 for the
   champions and the second group. The champions, the sermon and the second group stand
   (`roams: false`).
9. **The brief's five groups are kept:** 8.96 fights to a rest at 28 (aim 10 to 12, limit 8.5 to
   14.5), off the aim and inside the limit; the pay is 0.74 of the temple's seventh, so cutting a
   group would only widen the shortfall.
10. **Two under, the temple is won every time** (100% at 26; `hearthfane: under`, a row of `OWED`
    until #851) as H6's is; stronger monsters are barred. The issue's "one at 26 no more than one in
    four" is therefore not met; since #851 the gate judges two under past 10 by the day, and asks no
    more of the fights.
11. **The Grey Blade and the Grey Bow are the area's items,** beside H6's knife: `greyBlade` 2d12+6,
    6,600, for the martial classes and the cleric, one hand, a point past the Slag Mace; `greyBow`
    1d12+13, 6,800, the ranger's, a point past the Ashwood Bow. #746 takes them into its rung.
    `fane_key` is named *Sacristan's Key* (`slot: 'none'`, `price: 0`).
12. **The way in has a label of its own,** *In at the temple's door, out of the light.*, on H6's
    exit at 18,14; the plan's H6 brief (§4.2) had *Through the temple's door, into the nave. The
    light comes down through the roof ahead.* The nave is roofed (the palette's `vault`) and only
    the court at its head is open to the sky, so the plan's line would be false at the door.
13. **The place is `{ id: 'hearthfane', kind: 'dungeon', at: [250, 172] }`,** with no band (a built
    place reads its map's), in the area's `PLACES`; the atlas's `deep` link `hearthisle ->
    underdeep` at 250,172 is kept.
14. **H6's 18,14 is now a door** (it was a building square) and the exit; H6's walkthrough line that
    asserted a shut building moved into the temple's steps.
15. **`h6_warm` ends at *The ground here is warm as a hearthstone.*** Its second clause, that no
    grass grows within ten paces of the light, contradicts the map, which has grass at 23,14 and all
    round the column. The review of #779 found it, and the temple edits H6's map for its exit anyway.
16. **§3 owes the crawlers' two:** `UNPLACED` (`tools/tests/maps.ts`) holds `deep_crawler` for #757
    and `catcher` for #758 since #778, and §3's sentence named neither. The review of #779 found it.
17. **§4.2's head and §4.3 say H6's 31,0 is rock,** as #753's 5 has it (both said walkable on both
    sides), and §11's *I6's meeting* names row 0. The review of #779 found it.
18. **#764's doorway-check block stood in this section twice,** merged from main: one is kept. The
    review of #779 found it.
19. **The sacristan's `says` waits on having met him.** `meet()` says a matching entry without
    setting his `flag`, and the Sea and Shore lamps stand in the first room, so a company that put
    one out before it met him heard only *I told you* and never began 56, and one that put all four
    out in order was given the key with no quest begun. The wrong lamp's entry is now `after` both
    `q_lamps` and `q_lamps_wrong` and the key's entry `sets` `q_lamps`: his own words come first,
    then *I told you*, and the quest, its first entry and its goal begin on every path. §6's `says`
    is changed to match and the walkthrough walks both. The review of #780 found it.
20. **The wrong lamp's line says *the rest flare* and the log *The others flared*:** the plan's *the
    other three* is false once a lamp is out. §6's lines are changed to match. The review of #780
    found it.
21. **He stands, not "in the nave":** he is met in the vestry at 3,11, so the plan's *standing in the
    nave with his face turned up to the empty air* now ends *standing with his face turned up to the
    empty air*. §6's line is changed to match. The review of #780 found it.
22. **The arch's sign has no id,** where the brief gave it `hf_arch`: an id is kept in a map's `used`,
    and so in `shipped.json`, only for a sign with `read` (`readId`, `src/game/inscriptions.ts`), so
    it would be kept nowhere and nothing keys on it; H6's Hearth sign has none either. The review of
    #780 found the reason missing.
23. **The goal gives the order outright** (*Put out the four lamps in the pillar's order: the Sea, the
    Shore, the House, the Hearth.*, §6's own line), so the pillar's carving is moot to a company that
    has met him. It is the plan's, left as written: the owner's call (§11). Changed by #795's 8.

Decided by delegate for #756, each the owner's to overturn:

1. **The eleven niches are told in `hf2_niches`, not carved.** Eleven one-square notches do not fit a
   round chamber of 5–11 with three ways out; `bare: true` hangs nothing on the wall.
2. **The chamber is a disc** of rows 3, 5, 7, 7, 7, 5 and 3 at 5–11,5–11, the passages one wide; the
   side vault at 1–3,6–9 opens by a door at 4,8, the brief leaving its way in open. 58 open squares.
3. **The Hand's last man is told by an event, `hf2_last`,** on the chamber's north door (8,4): *The
   passage, and in it the Hand's last man up here, dead on his feet.* An encounter has no `look`; the
   keeper's own (§7, #761) comes after the event.
4. **The grey door at 8,1 is a door square with the sign `hf2_door`,** which has no `read` and keeps no
   `seen`. `GREY_DOOR`, the exit to `underdeep` 16,30, is exported and not listed. #757 listed it and
   moved the sign to 8,3, since an exit takes the company on arrival and a sign on its square is never
   read (its 15).
5. **The stair is floor at both ends:** the temple's 8,1 turned from `#` to `.` with `STAIR` listed;
   the crypt's 8,15 is `.` with the way up, a stair and not a door.
6. **`LOG_GIVEN` is exported from the crypt, which reads it,** where §4.1 has the setting map export it:
   I6 reads `ELEVEN_KEPT` from here, so one each way would be an import cycle. I6's map (#754, PR #782,
   open) may import it; `q_eleven_log` is owed to #763 in `UNSET`.
7. **The Grey Robe is ac 13 at 6,200 with no class list,** a point past the Cinder Robe (ac 12), which
   has none: §8's *the casters* is who wears it, not a bar. #746 takes it into its rung.
8. **`aware`, which the brief leaves open:** 2 for the champions and the keeper's group, 3 for the
   rats; the champions and the keeper stand, the rats roam. The keeper's group respawns at 2,880 as
   the champions: no quest names it and it has no `slainText`, so it is no guardian.
9. **The brief's three groups are kept:** 13.71 fights to a rest at 29 (aim 10.25 to 12.25, limit
   8.75 to 14.75), easier than the aim and inside the limit. The pay is 0.42 of the crypt's tenth, so
   lighter or fewer groups would only widen the shortfall; stronger monsters are barred.
10. **No two-under row:** the gate reads the crypt's two under as n/a, its floor, 29, being above the
    area's, so its groups count in the area's pool at 26. `tools/tests/gate.ts` is not touched.
11. **The place is `{ id: 'hearthfane2', kind: 'dungeon', at: [250, 178] }`,** with no band (a built
    place reads its map's), in the area's `PLACES` beside the temple's; the atlas's `deep` way
    `hearthisle -> underdeep` is kept.
12. **The map is named The Crypt** (§10), band `[29, 29]`, region `hearth`, start 8,14 facing north.
    The palette is the temple's rock greyed, every door the grey door's grey, stone and vault, `bare`.
13. **The walkthrough walks the crypt at 29, its floor** (the walk's level and the members' raised
    from 28 after the temple); the eleven are walked twice, shut without the log and kept with it set
    by hand.

Decided by delegate for #757, each the owner's to overturn:

1. **The frames are doors in the ways' walls,** each with a bay of three rows behind it (west 7–11
   or 8–11, east 21–24). A door keeps walls either side, so the squares the table names beside a
   frame (12,25, 12,27, 12,17, 20,21, 20,13) are wall: the store stands at 11,27, the groups in the
   bays.
2. **The crack is reached through the room behind the eighth frame,** not off the main way. The
   crawl way runs 24,2–13, so any way from the main way east to 29,6 crosses it and opens the
   hatch's secret to anyone; the room (21–22,14 and 21–24,15) goes on east and up a way at x 26 to
   the row-6 way, 26–29,6.
3. **The main way is one wide, 16,3 to 16,31** ("sixteen squares" read as up the middle at x 16),
   with side ways at rows 26, 22, 18 and 14 (three squares each way) and the row-10 way west, 3–15,
   to the door at 2,10. 200 open squares.
4. **The groups are regrouped so their levels rise from the grey door.** On the table's squares the
   deep knockers (28) stand furthest and the curve's rise fails (rank correlation below 0). The same
   eleven groups and monsters, moved (§4.6): rank correlation 0.13. The crack's knockers (28) and
   the crew guard (29.3) are furthest whatever is done.
5. **The Stair's head and the crawl way's door wait on #758:** 16,2 is a door and 16,1 rock, as the
   temple's stair was (#755's 4); 24,1 is a door with rock beyond, as the crypt's grey door was.
   `STAIR_DOOR` and `CRAWL_DOOR` are exported and not listed: an exit to an unbuilt map fails
   `tools/tests/maps.ts`. #758 listed them.
6. **The CREW ONLY door is a door square with the person on it,** and the exit is `after` either
   answer, as the weather check's exception has it. The second answer is *Go through and shut it.*:
   the brief's *Open it, go through and shut it.* runs past a line of the side panel
   (`tools/tests/people.ts`). Its words are the brief's.
7. **The two persons are named *The door marked CREW ONLY* and *The knocker at the crack*,** with no
   face, as the Ember Stone's sockets are.
8. **59's `done` is `[]`, never done, until #758:** its `seen: KNOT_LAST` names `underdeep2`, which
   fails `tools/tests/quests.ts` until built. 59 has the entries on `ud_knot1`, `ud_knot8` and
   `ud_hatch` and the goal at `underdeep`; the last frame's entry, the goal at `underdeep2` and the
   `done` are #758's. #758 built them.
9. **The Old Lantern's Staff is a staff,** 1d10+14 at 7,000, two-handed, with no class list (as the
   Battle Staff has none), its holiness in its words: no weapon carries an element. **The Grey
   Shield** is ac 8 at 4,000 for `MAIL` (as the Basalt Shield is). Both are in
   `src/content/areas/hearth/items.ts`.
10. **The place `underdeep` drops `planned` and keeps its name (The Underdeep) and order 13,** with
    band `[30, 30]`: the road's step reads the place's own name and band (`progression()`,
    `src/game/atlas.ts`), and without them the atlas check fails. The Stair takes a plate of its own
    (§7); its 30–31 is its own.
11. **`aware` and roaming, which the brief leaves open:** the rats 3, the keepers and knockers 2, the
    crawlers 3; only the two knocker groups the table marks stand. The rats respawn at 1,440 and
    every other group at 2,880; none is a guardian.
12. **The brief's eleven groups are kept:** 11.58 fights to a rest at 30 (in the aim), 100% at the
    floor and the pay 0.93 of the share, so lighter or fewer groups would only widen the shortfall.
13. **The plan's ids stand:** the quests `frames`, `crew_only` and `crack`; the flags `q_crew_open`,
    `q_crew_shut`, `q_crack_sealed` and `q_crack_wide`. No clash in `src/content`.
14. **The palette is the Dead-Drop's colours** with `wallStyle: 'smooth'`, `ceilingStyle: 'vault'` and
    `bare: true`; the map is named The Ways, band `[30, 30]`, region `hearth`, start 16,30 facing
    north.
15. **The crypt's sign `hf2_door` moves from 8,1 to 8,3,** its id and words as they were. An exit
    takes the company on arrival and `World.move` returns before the square's texts are said, so a
    sign on the exit's square is never read. 8,3 is the passage's square two before the door, where
    the keeper's group stood; 8,2 holds the knot, and two texts on one square break the 3-line rule.
    The crypt's walkthrough steps onto it from 8,4, and nothing stands on either of the crypt's exits.
16. **The CREW ONLY sign and the feet swap squares:** `ud_crew_sign` to 4,10 and `ud_feet`, an event,
    to 3,10. The interactable on a company's own square is a sign's, so with the sign at 3,10 the door
    ahead could not be spoken to and the company had to walk onto 2,10, where its way is a wall after
    either answer until it steps back and forward (a company that steps onto 2,10 first still does).
    From 3,10 facing west the door is the one ahead, and a step forward after either answer goes through.

Decided by delegate for #758, each the owner's to overturn:

1. **Eight landings and the seven flights between them.** The landings are two rows deep at the
   brief's rows and the flights two wide down the middle, turning a column at each landing, so every
   square the brief names stands on them. Eight landings four rows apart leave seven flights, not
   eight of eight squares; the table's "fifth landing" (16,16), "sixth flight" (16,12) and "seventh
   landing" (16,8) fit no count of the rows, so the squares are kept and the words are not. 153 open
   squares.
2. **The fourth landing runs east to the crawl way's door,** 13–24,18–19: the company lands on 24,18
   facing south under the door drawn in the wall at 24,17, with no way back up it. The brief gives
   none, and the head's way up is the way back to the camp.
3. **The last door (16,1) and the Hand's own door (13,1) are doors drawn in the wall,** as the Deep
   Mines' and the Dead-Drop's are: neither can be walked into, so `ud2_shut` reads true. `LAST_DOOR`
   (the brief's exit to `core` 8,14 north, its `needFlag`, `blockedText` and `label`) and `FIVE` are
   exported and not listed: #759 lists the exit, turns 16,1 to a door and signs the lock. #759 did.
4. **57 ends on a verdict, on the first landing seen held (`underdeep2:ud2_held`) or on the
   rearguard slain,** not on `HELD`: with the tokens in `done`, the brief's goal on a token (*Carry
   the token down the stair under the temple.*, at `underdeep2`) could never come up and
   `tools/tests/quests.ts` failed it. A token now ends the quest when its people are seen holding
   the landing. H6's walkthrough line that asserted the token alone did the quest now asserts the
   goal down the stair. A company with a token that comes down the crawl way lands past the first
   landing and meets neither the rearguard nor `ud2_held`: the goal stays up on the stair until a
   verdict or the rearguard ends 57. Rare, and accepted.
5. **The rearguard is a guardian with `until: HELD`, `leaves: true` and no respawn:** 57 names it
   slain, and the quests check refuses a slain key on a group that respawns.
   `tools/tests/structure.ts` refused any `until` on a group that never comes back; under the leave
   rule (#747) that `until` takes a standing group off, so the rule now passes a group that `leaves`
   (one condition and a fixture). Outside the content lane: the owner's to overturn.
6. **The captain is one person,** *The captain on the landing*, `after: HELD`, with six `says` built
   from `HELD` in its order (the verdicts first, then the tokens), so a verdict that carried
   outranks a token. The lines are keyed by flag in one table, so reordering `HELD` cannot misalign
   them. The `lines`, said only if no `says` held, which the captain's `after` rules out, are one
   neutral line.
7. **The Catcher is set off the line by its gate (`OFF_LINE`): 1,100 hit points and 34d8+40.** The
   line's 1,826 and 30d8+34 are won 29% at 30, 35% at 31 and 41% at 32; the Catcher is won 59% at 30
   (aim 30 to 70%), 67% at 31 and 84% at 32 (aim 90%, limit 75%) on the gate's hundred seeds. In ten
   sizings tried the rise from 30 to 32 never passed about 25 points, so half at 31 and nearly
   always at 32 cannot both hold: the gate's floor aim and its limit above are kept, and 31 sits at
   two in three. Level, armour, attack, speed, xp 19,733, `ranged`, paralysis and look are kept.
   The gate judges a dungeon's boss at its map's floor, 30, and two above, 32 (`BOSSES.hearthisle`),
   not at 31. Sized again by #752's 4; the aim settled by #796's 1.
8. **The sixth flight's crawlers are two, not three:** with three a day at 30 broke off at 7.85
   fights to a rest, past the gate's limit of 9 (57% of days ended on a fight that ran long); with
   two, 10.14 (aim 10.5 to 12.5, limit 9 to 15). The smallest cut that passes: the rats at eight as
   well would reach 11.32, in the aim, for another 398 xp a member, and the pay comes first. The
   other six groups are the brief's.
9. **`aware` and roaming, which the brief leaves open:** the rearguard 2 and the knockers 2,
   standing (the brief); the rats and the crawlers 3 and the keepers 2, roaming; the Catcher 3,
   standing (the brief). The rats respawn at 1,440 and the crawlers, the keepers and the knockers
   at 2,880; the rearguard and the Catcher never (guardians).
10. **The place is `{ id: 'underdeep2', kind: 'deep', band: [30, 31], at: [216, 172] }`,** with no
    name or order (the Stair is the Underdeep's, not a step of its own) and no `deep` way added: the
    area's band, 28–32, holds without one, and the atlas and curve checks pass.
11. **The palette is the Ways'** with the brief's floor `#505258` and ceiling `#303236`, smooth and
    vault, `bare: true`; the map is named The Stair (§10), band `[30, 31]`, region `hearth`, start
    16,30 facing north.
12. **The letter is `gullwick_letter`,** *Letter for Gullwick*, its text a line of what it is (*A
    letter sealed with a knot of rope, the seal Gullwick's.*) and the brief's words in two quoted
    paragraphs. **The Grey Axe** is `greyAxe`, 2d12+7 at 6,800, two-handed, `MARTIAL`, a point past
    the Flamberge.
13. **`ud2_creed` is a sign with the brief's id and no `read`** (chalk any company can read), as the
    crypt's `hf2_door`; it keeps no `seen`. The letter's chest shares `ud2_letter`'s square (15,21),
    as the brief has it; the pillars check passes.

Decided by delegate for #763, each the owner's to overturn:

1. **The ask's flag is `KEPT_ASKED`** (`q_eleven_asked`), exported from I6 beside the person who sets
   it, for the log and the walkthrough to read. The Bard's `ELEVEN_ASKED` is `q_eleven`, another flag.
2. **Her lines, the log's three entries and its goals are §6's, as written;** the title is *The
   Eleven Kept*, the entries' ids `asked`, `given` and `kept`. `hf2_eleven` stands as #756 built it.
3. **The ask is said at every meeting until the log is in** (`until` the hand-in's flag, as §6 has
   it), where Act IV's thirds ask once. A company without the log is told again.
4. **The early road's journal shows two of its three entries,** `given` and then `kept`: `asked` never
   does, so the log begins *He did.* with nothing before it. §6's words, kept; see 10.
5. **I6 imports the crypt's `LOG_GIVEN` and `ELEVEN_KEPT`** (#756's 6); the crypt imports nothing of
   I6, so the maps stay acyclic. `q_eleven_log` leaves `UNSET`, and nothing is owed for it.
6. **The Bard's gathering is untouched:** it reads the log's chest (`seen: downs_e3:e3_log`), not the
   item, and the walkthrough asserts the chest still seen once the log is handed in.
7. **The walkthrough's cleric is Maren at 27 with the second,** moved between Anchorhold, Crowness
   Light and the crypt by `travel` as the isle's walk does; the one fight is the chamber's champions at
   29. The old assertion that 4,19 was left for her now says she stands there.
8. **I6 holds its density** (100.0% within 8, the furthest 7) with 20 points where it had 19: a
   person is a point. No other figure of the gate, density and curve moves.
9. **The log begins on the log given only for a cleric of 27 with the second** (`start: [{ flag:
   KEPT_ASKED }, { flag: LOG_GIVEN, member: { cls: 'cleric', level: 27, prestige: 2 } }]`), not on
   the flag alone as §6 has it: the hand-in takes the Crowness log from any company, and the Shelf's
   road carries it, so a company with no such cleric was shown a goal no one in it can finish. Once
   its cleric is 27 with the second the log is there, reading from the log given. The quests check
   (`satisfy`, `tools/tests/quests.ts`), which the issue does not name, learns a `member` condition on
   a start: it raises a fitting member to the level and the prestige, and every other condition is as
   strict as before. The walkthrough plays a cleric of 27 with the first only, one of 26 with the
   second and none: her words again, never the ask, and no journal (the same three fail on the old
   `start`, and on an ask gated by `{ cls: 'cleric' }` alone).
10. **The early road reads a meeting ahead of her, accepted:** the hand-in's `early` lines end on *Now
    I know.* and send nobody, yet the log's `given` entry says she sent us and its goal sends the
    company to the crypt; her next words (the log given) do send it. A hand-in sets no met flag, so
    her introduction is never said on that road. The plan's words are the owner's and are kept; the
    owner may prefer `early` to end on the send-down line (§11).

Decided by delegate for #759, each the owner's to overturn:

1. **The room's floor is 3–13 by 4–11, rounded, under a north wall on row 3** with the panel at 8,3
   a wall square; the passage 7–9 by 12–14 and the door at 8,15 a door square carrying the exit, as
   the Stair's 16,1 does. Every named square holds: 3,9 by the west wall, 7,4 to 9,4 along the
   panel, 8,5 three squares in counting the panel.
2. **The eight alcoves are empty, round the wall:** either side of the panel in its row (6,3 and
   10,3), two in each side wall (2,6, 2,9, 14,6 and 14,9) and two in the south curve (4,11 and
   12,11). The sentries are called, not placed.
3. **The palette is pale grey walls going to a white glass roof** (`ceiling: '#e8e4d8'`, the
   brief's), `smooth`, `vault`, `bare`. No other square is marked: the panel is a wall and the
   events say what it is.
4. **The thinned group has `until: { flag: VASK_FALLEN }` and `leaves: true`,** which the brief does
   not give: the Council can sit after the fight (`keep.ts` sets `q_throne_removed` before an ending
   and after one), which would raise Vask and two Hands at the panel for a second fight while he
   knelt by the wall. The walkthrough plays it.
5. **Both groups carry the clock, the parley and `slainText`:** the thinned is a second def of the
   one group (§4.8).
6. **Wenna's words for a company with Fane's map set `RING_GIVEN` themselves** (`sets` on that
   `says` entry): a person's `flag` is set only on her own first lines (`meet`,
   `src/game/people.ts`), so those words would have given the ring and never the flag the chapter
   and its goals read.
7. **Vask is set off the line by the Heart's gate (`OFF_LINE.vask`): 1,800 hit points and 22d8+23,**
   the line's 1,922 and 32d8+33. Level, armour, attack, speed, xp 20,373, role, look, calls and
   sprite are kept. Won 65% with the Hands first, 64% going for him first, 45% with the sentries as
   they come and 91% with no clock (400 seeds): a heavier Vask with a lighter blow runs the wrong
   way, and the plan's one in three for the clock left to run measures 45% (§7).
8. **The gate judges the Heart on its boss's odds** (`tools/tests/gate.ts`): `BOSSES.hearthisle`
   gains `core:core_vask` and `core:core_vask_thinned`. A map whose every group is a boss has no
   floor pool and no day (it printed 13% of fights won against nine in ten and 0.11 fights to a rest
   against twelve, which no Vask sized to two in three could pass), and a boss is judged two above
   its floor or at the cap where that is as high as it goes: at its floor alone where the floor is
   the cap, as #745 waived the curve's rise at the cap. The gate reprinted before and after moves no
   figure (only the Heart's two n/a lines read *above its floor* now). Outside the content lane:
   confirmed by #752's 6.
9. **The owed row stays at the curve's as-built floor,** `xp: 42946, gold: 8200`, `whose: '#744'`,
   its `why` that the Heart is built and a clear falls short by 3,988 xp a member and 20,120 gold:
   the crypt, the temple, the rim, the Stair and the Ways fell short of their xp shares (0.42, 0.74,
   0.74, 0.90 and 0.93), which the Heart's count hides (the curve counts both of Vask's groups where
   a clear fights one); the gold gap is not the shares' doing, and the Heart adds none. No group
   added and no monster strengthened. (#792's 3 sets the floor again, and its 6 the issue.)
10. **64:** the item `queens_signet`, *Queen's Signet*, with the plan's text, read from the pack;
    the log keyed on the item and the four `q_signet_*` flags, "and the like" written *It went to
    the hold, in a cloth.* and *It went to Tallis, in a cloth.*, its goal at `shelf`. `UNSET` owes
    the four flags to #765 (the three were #759's; `q_signet_sea` is added) and drops the endings'
    three, which Wenna's answers now set.
11. **The lock is signed** in `src/content/locks.ts` on `q_ember_lit` at `underdeep2` 16,1, its
    `what` the door and its `reason` the plan's words with the road's five; the list's comment gains
    Act IV's none and Act V's one.
12. **The Stair's walkthrough lines are turned:** on four of the five the door is blocked with
    `LAST_DOOR.blockedText`, `ud2_shut` is said and the way back up off the stair's head is open;
    on the five `ud2_shut` is not said and the company walks onto 8,14 facing north, and back
    through onto 16,2 facing south.
13. **The parley's question was cut by one clause,** *, and looks at whichever of you carries the
    maps*, for the side panel's seven lines (`tools/tests/people.ts`). Superseded by 17: the brief's
    whole question stands.
14. **`tools/tests/people.ts` lets a parley be nothing but its refusal where the group has a slain
    text of its own** (`refusable`: another answer or `slainText`): it wanted another answer that
    sets a flag, and the Heart's one answer, *Stop him.*, is the brief's and the issue's, with no
    walk past to remember. Only the Heart's two groups are admitted, and a fixture proves each case.
    Outside the content lane: the owner's to overturn.
15. **Rimewater's walkthrough counts Act III's lock on its own map,** not on the road: it asserted
    `LOCKS.length === 1`, which the Heart's lock makes two (the issue's "two of four"). Outside the
    content lane: the owner's to overturn.
16. **The Heart's first line, `core_door`, is on 8,13,** one step in from the landing square 8,14: an
    exit takes the company on arrival and fires no event on the landing square (`World.move` returns
    from the exit branch before `eventsHere`; docs/areas/kilns.md §9, decision 10, records the same).
    Same id and same words; the walkthrough takes the step for real, which `see()` had hidden by
    teleporting onto the square.
17. **The brief's whole parley question stands, and the side panel's lines are a person's alone**
    (supersedes 13): a group's parley is a `ChoiceScreen` asked in the box (`Game.parley`), where the
    question takes 3 of its 5 lines; the side panel's seven are a business's (`visiting`, under an
    `InteriorScreen`). `boxFaults` holds a group to the box and a person to both, as before, and a
    fixture proves each. Outside the content lane: the owner's to overturn.

Decided by delegate for #760, each the owner's to overturn:

1. **The goal up the cleft keys on the isle visited, not the strand seen** (`visited: 'hearthisle_h6'`):
   the start's second way, the isle for a company over early, must begin with a goal
   (`tools/tests/quests.ts`), and none held before the strand. It holds as the boat grounds; the
   entry `isle` keeps the strand.
2. **The door's goal, on the Catcher slain, is at `underdeep2`, not `core`:** a goal's words name its
   place (`namesPlace`, `tools/walk.ts`), and *Through the last door at the stair's foot* names the
   Stair, where the door stands. Its words are §5's.
3. **Three goals' words gain their place's name for the same check:** *to Hearthfane, the temple at
   the column's foot*, *at the heart's panel* and *the panel at the heart waits under hers*. Every
   entry is §5's word for word, and each entry and goal fits two lines of the page.
4. **Every key is a built one and none is added:** `core_door` on 8,13 and `ud_in` on 16,29, one step
   in off their landings (#759's 16), `ud2_word` as `KNOT_LAST` and the Catcher a guardian.
   `shipped.json` takes nothing new.
5. **The walkthrough puts the road behind done by hand** (`roadDone`: each earlier chapter's end by
   its first way, as the quests check satisfies a condition), so the quest's own end is said once in
   each play; Acts I to IV are their own walkthroughs'. The road's five (`FIVE`) are put by hand too:
   `q_peak_stood` and `q_ember_lit` end no chapter of their own.
6. **The verdict, the token and Fane's map are put by hand:** #764's own flags (`q_throne_removed`
   and `q_throne_tallis`), `q_token_cousin` with the badge and `meridian_map`, as the Heart's box play
   does. The Council's hearing is the shelf's to walk.
7. **Only the fights on the chapter's line are fought:** the Hand's best, the crypt's keeper, the
   rearguard, the Catcher at 31 and Vask or his thinned group at 32. The rest are the box plays'.
8. **The early company crosses at 27 without the Peak Stone** (`q_peak_stood`), The Window done and
   The Warning not; from the temple on its steps take the curve's levels (28 to 31), as the walk's
   band check sets them.
9. **Gullwick's shore is owed to #765** (`owed` in the walkthrough): no line there reads an ending's
   flag yet. Whichever of the two lands second makes the check.

Decided by delegate for #746, each the owner's to overturn:

1. **The rung is all nine, at 28, and `GEAR_TOP` follows to 28.** The `--gear-grows` what-if now
   names its top (*past level 28*), where it said 10, stale since the ladder passed 10.
2. **Who takes what (`ACT_V`):** each class the piece bettering the one it took at 25, plate's
   wearers the mail too; the blade and the Old Lantern's Staff go to every class they better and that has
   no better piece of its own (§8).
3. **A rung can be `found`:** its pieces carry no plus, so the test read them as wares; a found
   rung's are held to a find's place and to one more rule, that no shop sells them.
4. **A found piece may be a person's gift:** the Old Lantern's Staff is the knocker's for *Widen
   it.* (61), so a found rung counts an answer that gives it; earlier rungs keep chests and drops.
5. **None is owed:** every piece is placed, so each `from` is `['hearth', '']`, with the box's issue
   (#753 to #758) beside it.
6. **What the rung moved past a limit was owed to #752, no monster retuned:** in `OWED` the crypt's
   15.74 fights to a rest at 29 and Vask's thinned group's 89%; the harness's 12.8 at 28. Settled
   by #752's 2.
7. **The staff's holiness is its words:** the issue's table has it *holy*; the item carries no
   element (#757's 9), and the rung takes it as built. Every other figure is the table's.

Decided by delegate for #765 (half A: Helmstow and the halls), each the owner's to overturn:

1. **The empty throne room is the extra link on Vask's door** (`keep` 7,4), `after` his `until` and
   `until` the removal, with one line: the doorway and locks checks want a twin there (#764's 6).
2. **Aumery Vask, before the Council, stands after the chain,** a person in whichever room keeps the
   door, so it never opens on him alone; the steward is at 7,5, as §12 has him.
3. **The endings' proclamations are events at `keep` 6,8 in §12's words:** the Regent's sign fills the
   log at 9,8; the opened is `after: ENDED, until: IRONS`, so the line check sees the pair apart.
4. **The Guildhall's Luminary is at `harrow` 12,11,** beside its step as Aldith sits by the inn's,
   `after: ENDED`: the relit words are its lines and the other two its `says`.
5. **The clerk at the gate (64) is built here** with §6's words, `until` the four `q_signet_*`, a `says`
   after `SAT`; `UNSET` drops the three flags it sets and owes `q_signet_sea` to the other half.
6. **First of all is taken as written** on Ruan and Ysolde, so an ending hides the Compact's question
   and the journal's reading for good. Superseded by 8.
7. **The density counts a new feature whatever its presence:** Helmstow 26 to 27 points, the keep 12
   to 14 and the Foreland 29 to 31 (97.4% within 8); the gate and the curve are unmoved.
8. **An ending's words wait on a business still open** (supersedes 6): Ruan's question and Ysolde's
   journal come first until done. Ordgar's and the priestess's first words change nothing, so stay behind.
9. **Vask's `until` ends his hand-ins at the first step on the isle:** the survey wand (300 gold,
   `q_ashcombe_done`), the tenant's paper (50) and the oil order; §12 and 9.1's 23 require it.

Decided by delegate for #765 (half B: Gullwick and the rest), each the owner's to overturn:

1. **The Walk Home's entry at the open gate came in with the Helmstow half** (#788): its
   `seen: 'shelf:gate_open'` names that half's event, and `tools/tests/quests.ts` fails a `seen` on nothing.
2. **The knockers are `ud_mines`,** §4.6's id, standing at 6,3 as the corridor's others do and told by
   a once-event, `dm3_open` at 7,3, with the brief's look: a group has no `look` (as #756's 3).
3. **The gate leaves `ud_mines` out** (`BEHIND`, `tools/tests/gate.ts`, outside the lane): no company at
   the corridor's floor meets it. The curve counts it, as its pay is real; the Kilns' lead holds at 19.3.
4. **Wolfram's line waits on his answer too;** Hester's four come at every meeting before all her words
   but two said once, and an ending's word comes first, so the crack's is heard before an ending only.
5. **The Sunder's groups are the fifteen the most of whose monsters are its own,** the K3 Rift's two with
   them; its dens' keepers, its Warden, `k3_door`, `l4_brood` and the three the wood or the Hand lead stand.
6. **The harbourmaster's and the Reader's lines are the brief's words alone,** with no line of
   narration before them, as the brief gives none.
7. **The sea stands `after: { flag: WENNA_HOME }`, not the plan's `ENDED`:** its *Throw it in.* has the
   girl beside Hild look round, untrue while Wenna is still at the Core.

Decided by delegate for #752, each the owner's to overturn:

1. **The line is made again at 28, 30 and 32 in the Hand's steel, and `LEVELS` gains 30:** `node
   tools/harness.ts --calibrate --write --levels 28,30,32`, 200 seeds a point, about 25 minutes on
   four cores; every factor under 28 is as it was.
2. **The harness's company fights 10.6 to a rest at 28, rising to 11.7 at 32,** where 28 was owed at
   12.8. `OWED` loses #752's two: the crypt fights 14.16 at 29 and Vask's thinned group is won 77%.
3. **The isle's monsters on the line are restated on it,** keeping id, look, sprite, level and xp.
   Act IV's Deep Knocker and Inspector, placed at 28 (#22), are held as they stood (`OFF_LINE`).
4. **The Catcher: 1,300 hit points and 32d8+37,** won 56% at 30 and 79% at 32 on the gate's seeds.
   Half at 31 and nearly always at the cap cannot both hold: the floor, binding, is kept. Since #793:
   57% and 80% (#796's 1).
5. **Vask: 1,850 and 22d8+23, and his sentries on twice the soldier line's hit points (890):** the
   Hands first win 66% and the clock let run 28%, both of the plan's figures; on the line, 45% let run.
   Since #793: 62% and 28%, 60% and 33% on the gate's hundred (#796's 2).
6. **The Heart's two gate rules are kept and written down** (EXPANSION §5.2, MONSTERS §1); `rate`
   keys its cache on a group's clock too, which moves no figure.
7. **`--abilities` reports the Heart as built on the gate's bot,** which the plan sizes Vask by: 64,
   69, 28 and 83% with no clock (`--seeds 100`, the gate's hundred; the default 200 prints 70, 71, 29
   and 87). The thrifty bot keeps its spells, and lets the clock run at 66%. Since #793: 60, 69, 33 and
   82%, the default 200 65, 69, 27 and 87, the thrifty bot 64% (#796).
8. **The armoured at 29 and 31, read between, run long** (47 and 52% of days end badly) where the
   line's armour rounds up; no armoured monster stands there, and the line is not nudged. Made at
   29 and 31 since (#793), they end 38 and 49%, held at 28's and 30's hit points (#793's 3).

Decided by delegate for #793, each the owner's to overturn:

1. **`LEVELS` gains 29 and 31, the rest as they stood, since the armoured ran long read between:**
   `node tools/harness.ts --calibrate --write --levels 29,31`, 200 seeds, 1,281 s on four cores.
2. **A point made under a level one up that stands is held under its hit points, its blow solved
   again:** the soldier, the elite and the brute at 29 passed 30's and failed the gain check.
3. **The armoured at 29 and 31 are not nudged:** held at 28's and 30's hit points they end 38 and 49%
   of their days badly (13% free of the hold), and 28 and 30 must stand; none stands at 29 or 31.
4. **The isle's four at 29 and 31 are restated on the line,** keeping id, look, sprite, level, role
   and xp: the champion, the preacher, the Grey Hand and the crawler (§7's table).
5. **The sentries stay at 890 and 5d7+10,** twice the soldier as #752's line read him: they are set off
   the line on Vask's odds, and a restating is not a tuning (twice the made soldier is 874).
6. **`kneel` kneels at the feature the world holds, found by its id where the company stands:** on a
   zone map the world holds a copy in the outdoors' cells, so a test of identity failed there.
7. **The inscriptions check reads `shut`, `lifts` and `after`, each in its own words,** with a fixture
   for each, so a way that waits on a reading is seen however it waits.
8. **No limit, aim or owed figure of the gate is changed:** every line that moves is Hearth Isle's and
   inside its limit (Vask 60% with the Hands first, 33% let run), so nothing is newly owed.
9. **A stale statement of the Hearth's band is put right where found:** the passage check's comment
   says 28-32 now, the only one in the tools, the source and this plan.

Decided by delegate for #792, each the owner's to overturn:

1. **A twin is read as the maps and pillars checks read one:** two groups of a map on a square, one
   `until` a condition and the other `after` it, by structure. Only the Heart's pair is caught.
2. **The lesser by xp counts, the whole group,** so its xp, gold and lead are one clear's; a tie keeps
   the `until` group. The price window still reads every group's monsters, the dearer twin's too.
3. **The owed row's floor is set again from the print,** `xp: 38317` for 42946; its `why` names the
   Heart among the shares short (0.72). The gold stays; #759's 9 stands as it was.
4. **The Heart's figures in §8 and §11 are read again from the print,** the lead among them (31.4 for
   31.9, moved with the clear). The gate, the density and the harness are as they were.
5. **Only a leaving `until` group on a square of exactly two has a twin:** one that stays till it
   is killed may be met beside its twin, and a third group makes the clears 2 or 4, not the lightest.
6. **The row's `owed.whose` moves from '#744' (#745's 1) to '#794',** the open pay issue that brings
   the area up; the plan's present-tense owed sentences say #794, and the old blocks stay as history.

Decided by delegate for #795, each the owner's to overturn:

1. **Vask's hand-ins go to three persons in turn** (supersedes #765 half A's 9): Vask, then his steward
   from the first step onto the isle, then Wiglaf once the Council has sat; one stands in each state.
2. **The steward stands on after an ending,** since the opened leaves nobody else at the door; a `says`
   after any ending comes before his first words, which are not true then.
3. **The steward and Wiglaf hire nobody, so no `early` for them, nor an `after`:** an `after` is said to
   any company whose flag is set, so it would hide his first words from those who gave Vask the wand.
4. **`tools/tests/people.ts` counts the wand's takers at three** (outside the lane); the walkthrough meets
   Vask by his hire (`toVask`), as `meetWho` finds one person only.
5. **The Reader's crack is a once-line** (`q_reader_crack`) after her introduction and before the endings'
   words (supersedes #765 half B's 4); her reading and introduction, hidden below them, come first too.
6. **The rest of the audit leaves the words first:** what they hide is talk; Hild's Greywater line stays
   below, as first it would send the company for a girl who walks behind it (Ruan, Ysolde: #765's 8).
7. **Hereswith's early hand-in ends on the send-down:** a third paragraph in her voice, so that the entry
   `given` reads true of both roads; `done` is as it was.
8. **The sacristan's goal points at the pillar** ("in the order the pillar gives", as `asked` has it);
   the Hearth's walkthrough asserts that no goal of any quest names the four lamps in sequence.
9. **The four log entries that named Vask are true of whoever took the hand-in** (`paid`, `lead`, `vask`,
   `order`): their ids and conditions stay, and the goals that name him still point at the keep.

Decided by delegate for #796, each the owner's to overturn:

1. **The Catcher's aim is the floor's, as the gate states it** (30% to 70% at 30, 90% at 32): half at 31
   and nearly always at the cap cannot both hold (§7), so 57% at 30 and 80% at 32 stand (§8).
2. **Vask's aims are the gate's:** a quarter to a third with the clock let run (33%), on the sentries at
   890; the Hands first 60%, not two in three; going for him first (69%) is better, and one the design allows.
3. **The figures are the printed ones** (`node tools/test.ts gate`; `--abilities --levels 32 --seeds 100`);
   the 400-seed tries were run again after #793. No code, game text or figure in a test moves.
4. **EXPANSION §5.2 and MONSTERS §1 and §9.3 take a clause each;** #758's 7 and #752's 4, 5 and 7 gain
   a cross-reference to this block and no more.

Decided by delegate for #794 (the depths), each the owner's to overturn:

1. **The Ways take one group, `ud_rats3`, twelve deep rats at 10,22 in the bay behind the third west
   frame,** where `ud_rats` tells of rats and none stood: 10,962 xp a member, 1.04 of the share, in
   one group where keepers or knockers would take two. `aware: 3`, roaming, `respawn: 1440`.
2. **The Stair takes two standing groups of knockers,** `ud2_knockers2` (three, 18,30) and
   `ud2_knockers3` (three and a keeper, 19,22): 11,164, 1.06. Knockers (28) are the mix's gentlest:
   the day at 30 goes from 10.34 to 10.71 fights, into the aim, where twelve rats took it to 9.5.
3. **`ud2_knockers2` stands nearest the head,** 2 steps in, the first group past the way in and the
   gentlest; `ud2_knockers3` is 11 steps out, past the rearguard, the rats and `ud2_crawlers1`. The
   Stair's rise goes from 0.19 to 0.41. The head's stand off the way down, so a company may pass
   them by.
4. **Each box's finds come to 8,200 gold,** its 6,372 and half the Heart's 3,540, rounded up to the
   hundred: the depths' 16,400 and the isle's half meet the 28,320. The brief's chests are raised
   (the letter's left at none) and four are added, gold alone.
5. **The new chests stand where a box keeps one:** the crew's stores (7,21) in the rats' bay, a second
   keeper's store (24,17) in the one bay with nothing in it, more of the dead's packs (13,22) by
   `ud2_dead` and the Hand's takings (20,2) at the last door, past the Catcher. No line is added: the
   boxes' chests have none, and the events beside them say what they are.
6. **The runs from the camp grow to twelve and nine,** each inside twelve fights; §4.6, §4.7 and §8
   say so, and the ways up still take a company back to the camp between them.
7. **The walkthrough asserts the raised and the new chests' gold,** and fights no new group: none
   stands on the story's way. The Heart, the Catcher's and Vask's groups, the gate's owed figures
   and the row's `owed` (the last pull request's) are not touched.

Decided by delegate for #794 (the isle), each the owner's to overturn:

1. **Nine groups more, of each box's own kinds, so each box pays 1.06 to 1.10 of its share:** I6 two
   (three and four champions), the temple four (three champions thrice, two once) and the crypt
   three (twelve rats twice, four keepers); H6, at 1.07, none. The isle's four pay 21,492 a member.
2. **No new group stands within two squares of another it could join:** a company beside two groups
   of twelve or fewer fights both at once (`adjacentGroups`), a fight the gate never weighs.
3. **The temple's stand off the vestry, the lamps and the stair's landing but beside the treasury's
   way:** three in the court; two at 9,11, beside 9,10, the one way east to the treasury's door, so
   a fight there is forced; the west column stays free to the pillar, the vestry and the House lamp.
   None stands in the vestry, where the sacristan hides.
4. **The crypt's came up through the grey door she left open:** rats at the chamber's dead and the
   Hand's, keepers with no bay; the passages, one wide, take none.
5. **The temple's gentler groups bring it into its aim,** 11.27 fights to a rest at 28 (8.91 on
   main); the crypt's dearer ones bring it in too, 10.46 at 29 (14.24); I6 reads 11.63 (11.56).
6. **The gold follows the xp shares, rounded up to the hundred:** H6 2,900, I6 2,400, the temple
   4,100 and the crypt 2,900, 12,300 in all. Every chest the boxes had is raised.
7. **A new chest only where a group guards a place for one:** behind the preacher at the temple's
   door (`h6_toll`) and under the arch (`hf_tithe`). The rim's gold stays in its takings; the crypt,
   six groups in 58 squares, takes no chest more, so its cups and pack hold its share.
8. **The new chests take no line:** a chest has no text, and each stands by a line that says its
   place (`h6_front`, the arch's sign), so the boxes' lines and their counts are as they were.
9. **No owed figure is re-recorded; the curve row's `owed` is removed:** each box's two-under
   figure stands at 100% and the pool reads 94.2% of 51 groups with both halves in; a clear pays
   47,836 xp a member and 28,700 gold, past both budgets, so nothing is owed to #794.
10. **The walkthrough's chest lines say the sums of all nine chests,** the two new ones' too. It
    fights none of the new groups: none stands on a square it walks; `hf_nave2` stands beside
    the treasury's way, which it takes by `travel`.
11. **The chamber's four keepers are the first machine met on the isle:** they are in sight from the
    niches' square, so the keeper's look is said there, before `hf2_last` and the door's keeper. The
    brief's table and the crypt's and the walkthrough's comments call the door's keeper the first no
    more; the keepers stay where they stand, the least change that is true.

Decided by the owner's delegate for #18, each the owner's to overturn:

1. **An elemental weapon,** its blows carrying lightning: its dice a rung under the ladder's at the
   band, so the die is the gain; a class list as its kind has. The rule if the area session finds
   better: an element its own area's monsters are not immune to and the next area's are weak to where
   one is.
2. **A stat item,** a robe raising personality by 3 while worn: slotted, so one is worn at a time.
3. **Found, off the quest's path,** off the Bowl or the rim, behind a hinted secret door (band 28 to
   29); never in the Underdeep or the Core; one of the two in a locked chest (`locked: true`), the
   first the area holds. Each priced inside Hearth Isle's window, sold by no shop, sellable at half
   as all found gear is. Off the ladder: no `GEAR` row, so no figure moves.
4. **Names and texts pass the pillars;** two lines to a find.

Decided by the builder for #864, each the owner's to overturn:

1. **The hide is a cell in I6's rim, behind a second secret door in its east face** (8,15). The
   area's three secrets hold gold and a find or are a way (H6's cache the salts and 1,000 gold, I6's
   takings the Grey Mail and 1,700 gold, the Ways' hatch a crawl way on), so none was free; the
   Underdeep and the Core are barred. The Bowl holds the chapter's road (the cleft up to the temple's
   door) and the camp, and H6's east wall is pinned against I6's (`outdoors`), so the cell is cut in
   the rim's rock on I6's side, which the chapter never enters (§4.3). Three squares of dirt floor
   at 5 to 7 on row 15 with the door at 8,15 add walkable squares and take none away: every id, door
   square and chest id stays, and the takings' door is still I6's first secret.
2. **Both finds in the one cell,** the robe in a plain chest at 6,15 and the mace in a locked one at
   5,15 behind it: one detour, one hint; a company with neither pick nor key still takes the robe
   and sees the lock.
3. **The mace is a Slag Mace with lightning on it,** the Grey Blade's kind (knight, paladin, ranger,
   barbarian and cleric, four of the premade six), where the bow is the ranger's alone and the knife
   and the staves the thief's and the casters'. Its steel is the Slag Mace's 2d12+5, the rung under
   the Grey Blade the ladder wears from 28 (2d12+6), so the lightning die is the gain: `hits()` 21.5
   against 19 (18 for the steel alone).
4. **Lightning stands.** Of the 11 monsters the isle places, all past 10, 4 are weak to it and none
   is immune or resists it; nothing is weak to fire, cold, poison or shadow; holy and nature are the
   machines' immunities. No area comes after the isle, so no element is the better the delegate's
   rule asks for.
5. **The robe is the Grey Robe a point lighter,** AC 12 for 13, anyone's as that is, raising
   personality by 3: the stat is the gain, as the die is the mace's. Worn it is a step of bonus on
   what a caster heals (the cleric's personality 15 reads 18); in the pack or the bag it gives
   nothing, and the armour slot makes it one robe at a time. Spell points are figured from the stat as
   it is born and are not raised.
6. **The mace is in the locked chest,** the robe in the plain one: the better find behind the lock,
   and what a company that cannot open it still carries away is a thing worth the walk.
7. **The prices are 6,950 and 6,350,** the isle's own scale for found gear (the Hand's steel stands
   at 6,200 to 7,000 where Cinderport's wares stand at 2,000 to 3,100): the Grey Blade's 6,600 and a
   point of plus (150, `PLUS_PRICE`) to each point of `hits()` the mace gains over it (2.5, 375,
   taken to the 50 below), and the Grey Robe's 6,200 less 150 for its point of armour and 300 more
   for the raise. Both are inside the window of 7,000 and under the Grey Mail's 7,000, the dearest
   find, so that line of the curve stands as main prints it; they sell back at 3,475 and 3,175.
8. **The names** are Levin Mace and Vigil Robe (§10): ten characters each, so the mace's sheet line,
   "WEAPON Levin Mace, LIGHTNING, EXPERT", ends at 235 of the 334 the column allows.
9. **The hint is a vein of glass in the turf** (`i6_scorch`, 9,15): a thing seen on the door's near
   side that explains nothing and is there at every hour, as the hint rule asks. The cell's event
   says what is in it and no more.
10. **No chest holds gold,** so I6's 2,400, the area's 28,700 and §8 stand.
11. **"Off the road" is measured by walking,** from every square on a shortest walk from the strand
    to the temple's door, the isle's two boxes laid side by side as the world lays them: the glass's
    end is 26 squares from it by the way a company walks and 21 as the crow flies, as Wrackholm's
    hollow was (#861).
12. **The walkthrough walks the detour in I6** on from the Hand's takings, the company's thief
    (Ottilie, born to Lockpick, #857) picking the lock, and plays the lock's refusals on a game of its
    own against the real chest: the checks were each broken in the tree and watched to fail (the PR
    lists them).
13. **The pilot is not stranded and does nothing new.** It reads the world through what it has seen;
    its full run stops at Thornmark's chapter (docs/PILOT.md) and never reaches the isle; the door is
    drawn as rock and the explorer suspects only cells drawn as wall; and a locked chest it met would
    be pressed on once and walked past, as a locked door with no key is (#857).
14. **The door stands on row 15, not row 13 where it was first cut,** for the art suite's wall
    dressing (`tools/tests/art.ts`): a secret door is a wall face to it, the painter dresses one wall
    in five by a hash of its square (`wallDressing`); I6's zone, 8 faces with the takings' door
    dressed, holds the cap of half only while the new door is bare. The door at 8,13 drew a sconce
    and took the zone to 8 of 12 (66.7%); 8,15 is bare, so it stands at 4 of 12 (33.3%). The cap is
    not moved; the cell is two rows down the same face, still between rock above and below.
