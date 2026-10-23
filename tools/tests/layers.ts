// The layers (#900, part of #848): the runtime import graph of src/ and tools/, read from the files as
// they stand, and the rules it keeps (EXPANSION §8.1). src/lib under src/game under src/content under
// src/ui under src/app, the files directly under src/ the app's until src/app/ is made; the tools take
// anything and tools/kit/ only src; the walkthroughs and the suites take src and tools/kit/, not each
// other or the tools; no area takes another area's files but its public.ts; and no cycle among src's
// runtime imports. What crosses today is a row of KNOWN, under the issue that clears it: a crossing no
// row holds fails, and so does a row that no longer crosses, so the table only shrinks, and by name.
//
// A runtime import is one Node loads as the file loads or runs: an `import` or an `export ... from`
// with a literal path, `import './x.ts'` for its side effects and `import('./x.ts')`. `import type`,
// `export type ... from`, `typeof import('./x.ts')` and `import('./x.ts').T` in a type are erased
// before the file runs and are left out: the type cycle through content is kept on purpose, as it
// keeps MonsterSprite, Interior and RegionId narrow (NARROW in src/content/index.ts). `import { type
// A }` is not left out: Node strips the name and still loads the file. The files are read by a small
// lexer, not the compiler, which takes three seconds to parse them.
import { readdirSync, readFileSync } from 'node:fs';
import { posix, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ok, fail } from './lib.ts';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

/** The issues of #848's plan that clear today's crossings, each with what it does. */
const KEYS = {
  L2: 'the items table passed into src/game, not imported',
  L3: 'the monsters and spells tables passed in',
  L4: 'the quests and the guild quests passed in',
  L5: 'the climates, stones, endings, maps and the atlas passed in',
  L6: 'the pilot moved to src/app',
  L7: 'Game, its screen stack and input moved to src/app, the screens given a Host',
  split: 'the big modules split: party.ts into its tables, conditions and levels, so skills.ts loads no items',
  A6: "each area's public.ts, the one way into it",
  K7: 'tools/kit/: the walk, the fights and the company the walkthroughs and suites take',
  K8: "the walkthroughs as scenes: a chain takes an area's steps.ts, not its walkthrough",
} as const;
type Key = keyof typeof KEYS;

/** Today's crossings, each `importer > imported` under the issue that clears it; a cycle is `cycle: ` and its files. */
const KNOWN: Readonly<Partial<Record<Key, readonly string[]>>> = {
  L2: [
    'src/game/items.ts > src/content/index.ts',
    'src/game/party.ts > src/content/index.ts',
    'src/game/skills.ts > src/content/index.ts',
  ],
  L3: [
    'src/game/monsters.ts > src/content/index.ts',
    'src/game/spells.ts > src/content/index.ts',
  ],
  L4: [
    'src/game/guilds.ts > src/content/guilds.ts',
    'src/game/guilds.ts > src/content/index.ts',
    'src/game/ranks.ts > src/content/guilds.ts',
    'src/game/ranks.ts > src/content/index.ts',
  ],
  L5: [
    'src/game/quests.ts > src/content/index.ts',
    'src/game/stones.ts > src/content/endings.ts',
    'src/game/stones.ts > src/content/index.ts',
    'src/game/stones.ts > src/content/stones.ts',
    'src/game/world.ts > src/content/index.ts',
  ],
  L6: [
    'src/game/pilot/aims.ts > src/content/index.ts',
    'src/game/pilot/keep.ts > src/ui/draw.ts',
    'src/game/pilot/keep.ts > src/ui/screens.ts',
    'src/game/pilot/known.ts > src/content/index.ts',
    'src/game/pilot/known.ts > src/ui/draw.ts',
    'src/game/pilot/known.ts > src/ui/frame.ts',
    'src/game/pilot/known.ts > src/ui/screens.ts',
    'src/game/pilot/pilot.ts > src/ui/combat.ts',
    'src/game/pilot/pilot.ts > src/ui/create.ts',
    'src/game/pilot/pilot.ts > src/ui/screens.ts',
    'src/game/pilot/pilot.ts > src/ui/title.ts',
    'src/game/pilot/route.ts > src/ui/draw.ts',
    'src/game/pilot/route.ts > src/ui/frame.ts',
    'src/game/pilot/talk.ts > src/ui/draw.ts',
    'src/game/pilot/talk.ts > src/ui/riddle.ts',
    'src/game/pilot/talk.ts > src/ui/screens.ts',
  ],
  L7: [
    'src/game/game.ts > src/content/maps.ts',
    'src/game/game.ts > src/input.ts',
    'src/game/game.ts > src/ui/combat.ts',
    'src/game/game.ts > src/ui/create.ts',
    'src/game/game.ts > src/ui/ending.ts',
    'src/game/game.ts > src/ui/frame.ts',
    'src/game/game.ts > src/ui/quests.ts',
    'src/game/game.ts > src/ui/riddle.ts',
    'src/game/game.ts > src/ui/screens.ts',
    'src/game/game.ts > src/ui/title.ts',
    'src/game/game.ts > src/ui/viewport.ts',
    'src/game/game.ts > src/ui/worldmap.ts',
    'src/ui/combat.ts > src/input.ts',
    'src/ui/create.ts > src/input.ts',
    'src/ui/ending.ts > src/input.ts',
    'src/ui/quests.ts > src/input.ts',
    'src/ui/riddle.ts > src/input.ts',
    'src/ui/screens.ts > src/input.ts',
    'src/ui/title.ts > src/input.ts',
    'src/ui/worldmap.ts > src/input.ts',
  ],
  split: [
    'cycle: src/game/items.ts src/game/party.ts src/game/skills.ts',
  ],
  A6: [
    'src/content/areas/ashfall/chapter.ts > src/content/areas/whitespine/maps/highspine_i10.ts',
    'src/content/areas/ashfall/guilds.ts > src/content/areas/rimewater/chapter.ts',
    'src/content/areas/ashfall/items.ts > src/content/areas/kilns/items.ts',
    'src/content/areas/ashfall/items.ts > src/content/areas/saltreach/items.ts',
    'src/content/areas/ashfall/items.ts > src/content/areas/sunderwood/items.ts',
    'src/content/areas/ashfall/maps/cinderport.ts > src/content/areas/glasswold/maps/wold_c8.ts',
    'src/content/areas/ashfall/maps/cinderport.ts > src/content/areas/glasswold/maps/wold_d8.ts',
    'src/content/areas/ashfall/maps/cinderport.ts > src/content/areas/whitespine/maps/sheerpoint_i8.ts',
    'src/content/areas/ashfall/walkthrough.ts > src/content/areas/glasswold/maps/wold_c8.ts',
    'src/content/areas/ashfall/walkthrough.ts > src/content/areas/rimewater/chapter.ts',
    'src/content/areas/ashfall/walkthrough.ts > src/content/areas/whitespine/maps/highspine_i10.ts',
    'src/content/areas/cairnmoor/guilds.ts > src/content/areas/kilns/guilds.ts',
    'src/content/areas/cairnmoor/items.ts > src/content/areas/kilns/items.ts',
    'src/content/areas/cairnmoor/walkthrough.ts > src/content/areas/kilns/guilds.ts',
    'src/content/areas/cairnmoor/walkthrough.ts > src/content/areas/kilns/maps/ironfells_n3.ts',
    'src/content/areas/glasswold/chapter.ts > src/content/areas/ashfall/maps/ember_stone.ts',
    'src/content/areas/glasswold/chapter.ts > src/content/areas/ashfall/maps/emberwaste_e10.ts',
    'src/content/areas/glasswold/items.ts > src/content/areas/ashfall/items.ts',
    'src/content/areas/glasswold/maps/wold_d8.ts > src/content/areas/ashfall/items.ts',
    'src/content/areas/glasswold/maps/wold_d8.ts > src/content/areas/ashfall/maps/ember_stone.ts',
    'src/content/areas/glasswold/maps/wold_d8.ts > src/content/areas/ashfall/maps/emberwaste_e10.ts',
    'src/content/areas/glasswold/walkthrough.ts > src/content/areas/ashfall/chapter.ts',
    'src/content/areas/glasswold/walkthrough.ts > src/content/areas/ashfall/items.ts',
    'src/content/areas/glasswold/walkthrough.ts > src/content/areas/ashfall/maps/ember_stone.ts',
    'src/content/areas/glasswold/walkthrough.ts > src/content/areas/ashfall/maps/emberwaste_e10.ts',
    'src/content/areas/glasswold/walkthrough.ts > src/content/areas/ashfall/maps/firemount_g11.ts',
    'src/content/areas/glasswold/walkthrough.ts > src/content/areas/ashfall/maps/meridian_camp.ts',
    'src/content/areas/glasswold/walkthrough.ts > src/content/areas/ashfall/maps/meridian_camp2.ts',
    'src/content/areas/glasswold/walkthrough.ts > src/content/areas/ashfall/maps/meridian_camp3.ts',
    'src/content/areas/hearth/chapter.ts > src/content/areas/glasswold/maps/wold_d8.ts',
    'src/content/areas/hearth/items.ts > src/content/areas/ashfall/items.ts',
    'src/content/areas/hearth/maps/core.ts > src/content/areas/saltreach/maps/saltmouth.ts',
    'src/content/areas/hearth/maps/core.ts > src/content/areas/shelf/maps/keep.ts',
    'src/content/areas/hearth/maps/hearthfane.ts > src/content/areas/shelf/maps/keep.ts',
    'src/content/areas/hearth/maps/hearthisle_h6.ts > src/content/areas/saltreach/maps/saltmouth.ts',
    'src/content/areas/hearth/maps/hearthisle_h6.ts > src/content/areas/shelf/maps/keep.ts',
    'src/content/areas/hearth/maps/hearthisle_i6.ts > src/content/areas/shelf/maps/keep.ts',
    'src/content/areas/hearth/maps/underdeep2.ts > src/content/areas/shelf/maps/keep.ts',
    'src/content/areas/hearth/quests.ts > src/content/areas/shelf/maps/keep.ts',
    'src/content/areas/hearth/walkthrough.ts > src/content/areas/glasswold/maps/wold_d8.ts',
    'src/content/areas/hearth/walkthrough.ts > src/content/areas/saltreach/maps/saltmouth.ts',
    'src/content/areas/hearth/walkthrough.ts > src/content/areas/shelf/maps/keep.ts',
    'src/content/areas/kilns/items.ts > src/content/areas/saltreach/items.ts',
    'src/content/areas/kilns/items.ts > src/content/areas/sunderwood/items.ts',
    'src/content/areas/kilns/items.ts > src/content/areas/thornmark/items.ts',
    'src/content/areas/kilns/maps/anvilhall.ts > src/content/areas/hearth/maps/underdeep.ts',
    'src/content/areas/kilns/maps/anvilhall.ts > src/content/areas/whitespine/maps/monastery.ts',
    'src/content/areas/kilns/maps/deep_mines3.ts > src/content/areas/hearth/maps/underdeep.ts',
    'src/content/areas/kilns/walkthrough.ts > src/content/areas/cairnmoor/chapter.ts',
    'src/content/areas/kilns/walkthrough.ts > src/content/areas/hearth/maps/underdeep.ts',
    'src/content/areas/rimewater/guilds.ts > src/content/areas/kilns/guilds.ts',
    'src/content/areas/rimewater/items.ts > src/content/areas/thornmark/items.ts',
    'src/content/areas/rimewater/walkthrough.ts > src/content/areas/cairnmoor/maps/cairnfield_n8.ts',
    'src/content/areas/rimewater/walkthrough.ts > src/content/areas/kilns/guilds.ts',
    'src/content/areas/saltreach/items.ts > src/content/areas/shelf/items.ts',
    'src/content/areas/saltreach/walkthrough.ts > src/content/areas/shelf/chapter.ts',
    'src/content/areas/saltreach/walkthrough.ts > src/content/areas/thornmark/chapter.ts',
    'src/content/areas/shelf/maps/downs_f3.ts > src/content/areas/hearth/maps/core.ts',
    'src/content/areas/shelf/walkthrough.ts > src/content/areas/hearth/maps/core.ts',
    'src/content/areas/sunderwood/items.ts > src/content/areas/shelf/items.ts',
    'src/content/areas/sunderwood/items.ts > src/content/areas/thornmark/items.ts',
    'src/content/areas/sunderwood/maps/eaves_j2.ts > src/content/areas/hearth/maps/underdeep.ts',
    'src/content/areas/sunderwood/maps/eaves_k2.ts > src/content/areas/hearth/maps/underdeep.ts',
    'src/content/areas/sunderwood/maps/eaves_k3.ts > src/content/areas/hearth/maps/underdeep.ts',
    'src/content/areas/sunderwood/maps/lantern_watch.ts > src/content/areas/hearth/maps/underdeep.ts',
    'src/content/areas/sunderwood/maps/lantern_watch.ts > src/content/areas/whitespine/maps/highspine_i11.ts',
    'src/content/areas/sunderwood/maps/lanternwood_l2.ts > src/content/areas/hearth/maps/underdeep.ts',
    'src/content/areas/sunderwood/maps/lanternwood_l3.ts > src/content/areas/hearth/maps/underdeep.ts',
    'src/content/areas/sunderwood/maps/lanternwood_l4.ts > src/content/areas/hearth/maps/underdeep.ts',
    'src/content/areas/sunderwood/maps/lanternwood_m2.ts > src/content/areas/hearth/maps/underdeep.ts',
    'src/content/areas/sunderwood/maps/the_sunder.ts > src/content/areas/hearth/maps/underdeep.ts',
    'src/content/areas/sunderwood/maps/the_sunder2.ts > src/content/areas/hearth/maps/underdeep.ts',
    'src/content/areas/sunderwood/walkthrough.ts > src/content/areas/hearth/maps/underdeep.ts',
    'src/content/areas/sunderwood/walkthrough.ts > src/content/areas/saltreach/chapter.ts',
    'src/content/areas/sunderwood/walkthrough.ts > src/content/areas/shelf/chapter.ts',
    'src/content/areas/sunderwood/walkthrough.ts > src/content/areas/thornmark/chapter.ts',
    'src/content/areas/sunderwood/walkthrough.ts > src/content/areas/wrackholm/chapter.ts',
    'src/content/areas/thornmark/walkthrough.ts > src/content/areas/shelf/chapter.ts',
    'src/content/areas/whitespine/chapter.ts > src/content/areas/rimewater/chapter.ts',
    'src/content/areas/whitespine/items.ts > src/content/areas/rimewater/items.ts',
    'src/content/areas/whitespine/maps/monksvale_j11.ts > src/content/areas/rimewater/maps/rime_lodge.ts',
    'src/content/areas/whitespine/maps/sheerpoint_i8.ts > src/content/areas/rimewater/maps/rime_lodge.ts',
    'src/content/areas/whitespine/quests.ts > src/content/areas/kilns/maps/anvilhall.ts',
    'src/content/areas/whitespine/quests.ts > src/content/areas/saltreach/maps/drowned_temples.ts',
    'src/content/areas/whitespine/walkthrough.ts > src/content/areas/rimewater/maps/rime_lodge.ts',
    'src/content/areas/wrackholm/guilds.ts > src/content/areas/rimewater/chapter.ts',
    'src/content/areas/wrackholm/items.ts > src/content/areas/ashfall/items.ts',
    'src/content/areas/wrackholm/items.ts > src/content/areas/saltreach/items.ts',
    'src/content/areas/wrackholm/items.ts > src/content/areas/thornmark/items.ts',
    'src/content/areas/wrackholm/walkthrough.ts > src/content/areas/rimewater/chapter.ts',
    'src/content/areas/wrackholm/walkthrough.ts > src/content/areas/saltreach/chapter.ts',
    'src/content/areas/wrackholm/walkthrough.ts > src/content/areas/saltreach/maps/saltmouth.ts',
  ],
  K7: [
    'src/content/areas/ashfall/walkthrough.ts > tools/tests/ladder.ts',
    'src/content/areas/ashfall/walkthrough.ts > tools/walk.ts',
    'src/content/areas/cairnmoor/walkthrough.ts > tools/harness.ts',
    'src/content/areas/cairnmoor/walkthrough.ts > tools/tests/lib.ts',
    'src/content/areas/cairnmoor/walkthrough.ts > tools/walk.ts',
    'src/content/areas/glasswold/walkthrough.ts > tools/tests/lib.ts',
    'src/content/areas/glasswold/walkthrough.ts > tools/walk.ts',
    'src/content/areas/hearth/walkthrough.ts > tools/gate.ts',
    'src/content/areas/hearth/walkthrough.ts > tools/harness.ts',
    'src/content/areas/hearth/walkthrough.ts > tools/tests/lib.ts',
    'src/content/areas/hearth/walkthrough.ts > tools/walk.ts',
    'src/content/areas/kilns/walkthrough.ts > tools/tests/ladder.ts',
    'src/content/areas/kilns/walkthrough.ts > tools/tests/pillars.ts',
    'src/content/areas/kilns/walkthrough.ts > tools/walk.ts',
    'src/content/areas/rimewater/walkthrough.ts > tools/tests/ladder.ts',
    'src/content/areas/rimewater/walkthrough.ts > tools/walk.ts',
    'src/content/areas/saltreach/walkthrough.ts > tools/tests/ladder.ts',
    'src/content/areas/saltreach/walkthrough.ts > tools/tests/lib.ts',
    'src/content/areas/saltreach/walkthrough.ts > tools/walk.ts',
    'src/content/areas/shelf/walkthrough.ts > tools/walk.ts',
    'src/content/areas/sunderwood/walkthrough.ts > tools/tests/ladder.ts',
    'src/content/areas/sunderwood/walkthrough.ts > tools/walk.ts',
    'src/content/areas/thornmark/walkthrough.ts > tools/walk.ts',
    'src/content/areas/whitespine/walkthrough.ts > tools/harness.ts',
    'src/content/areas/whitespine/walkthrough.ts > tools/tests/lib.ts',
    'src/content/areas/whitespine/walkthrough.ts > tools/walk.ts',
    'src/content/areas/wrackholm/walkthrough.ts > tools/harness.ts',
    'src/content/areas/wrackholm/walkthrough.ts > tools/tests/lib.ts',
    'src/content/areas/wrackholm/walkthrough.ts > tools/walk.ts',
    'tools/tests/changed.ts > tools/changed.ts',
    'tools/tests/combat.ts > tools/gate.ts',
    'tools/tests/combat.ts > tools/harness.ts',
    'tools/tests/curve.ts > tools/checks.ts',
    'tools/tests/curve.ts > tools/tests/enclave.ts',
    'tools/tests/dens.ts > tools/shipped.ts',
    'tools/tests/dens.ts > tools/tests/density.ts',
    'tools/tests/dens.ts > tools/tests/pillars.ts',
    'tools/tests/dens.ts > tools/tests/quests.ts',
    'tools/tests/dens.ts > tools/tests/structure.ts',
    'tools/tests/enclave.ts > tools/gate.ts',
    'tools/tests/gate.ts > tools/checks.ts',
    'tools/tests/gate.ts > tools/gate.ts',
    'tools/tests/gate.ts > tools/harness.ts',
    'tools/tests/gate.ts > tools/testmonster.ts',
    'tools/tests/gate.ts > tools/tests/curve.ts',
    'tools/tests/gate.ts > tools/tests/enclave.ts',
    'tools/tests/gate.ts > tools/tests/quests.ts',
    'tools/tests/guilds.ts > tools/shipped.ts',
    'tools/tests/guilds.ts > tools/tests/quests.ts',
    'tools/tests/harness.ts > tools/checks.ts',
    'tools/tests/harness.ts > tools/gate.ts',
    'tools/tests/harness.ts > tools/harness.ts',
    'tools/tests/harness.ts > tools/testmonster.ts',
    'tools/tests/harness.ts > tools/tests/gate.ts',
    'tools/tests/inscriptions.ts > tools/shipped.ts',
    'tools/tests/ladder.ts > tools/checks.ts',
    'tools/tests/ladder.ts > tools/gate.ts',
    'tools/tests/ladder.ts > tools/harness.ts',
    'tools/tests/maps.ts > tools/checks.ts',
    'tools/tests/monsters.ts > tools/walk.ts',
    'tools/tests/outdoors.ts > tools/checks.ts',
    'tools/tests/passage.ts > tools/tests/gate.ts',
    'tools/tests/people.ts > tools/shipped.ts',
    'tools/tests/people.ts > tools/tests/quests.ts',
    'tools/tests/pillars.ts > tools/checks.ts',
    'tools/tests/pillars.ts > tools/tests/enclave.ts',
    'tools/tests/pilot.ts > tools/harness.ts',
    'tools/tests/pilot.ts > tools/tests/enclave.ts',
    'tools/tests/pilot.ts > tools/tests/fullrun.ts',
    'tools/tests/pilot.ts > tools/walk.ts',
    'tools/tests/quests.ts > tools/checks.ts',
    'tools/tests/quests.ts > tools/tests/enclave.ts',
    'tools/tests/quests.ts > tools/tests/pillars.ts',
    'tools/tests/rifts.ts > tools/tests/density.ts',
    'tools/tests/rifts.ts > tools/tests/pillars.ts',
    'tools/tests/rifts.ts > tools/tests/structure.ts',
    'tools/tests/scaffold.ts > tools/scaffold.ts',
    'tools/tests/shipped.ts > tools/shipped.ts',
    'tools/tests/stones.ts > tools/testmonster.ts',
    'tools/tests/stones.ts > tools/tests/quests.ts',
    'tools/tests/stones.ts > tools/tests/structure.ts',
    'tools/tests/structure.ts > tools/tests/quests.ts',
    'tools/tests/survival.ts > tools/walk.ts',
    'tools/tests/terrain.ts > tools/grounds.ts',
    'tools/tests/ways.ts > tools/ways.ts',
    'tools/tests/weather.ts > tools/checks.ts',
    'tools/tests/wilds.ts > tools/shipped.ts',
    'tools/tests/wilds.ts > tools/tests/density.ts',
    'tools/tests/wilds.ts > tools/tests/pillars.ts',
    'tools/tests/wilds.ts > tools/tests/quests.ts',
  ],
  K8: [
    'src/content/areas/saltreach/walkthrough.ts > src/content/areas/shelf/walkthrough.ts',
    'src/content/areas/saltreach/walkthrough.ts > src/content/areas/thornmark/walkthrough.ts',
    'src/content/areas/sunderwood/walkthrough.ts > src/content/areas/saltreach/walkthrough.ts',
    'src/content/areas/sunderwood/walkthrough.ts > src/content/areas/shelf/walkthrough.ts',
    'src/content/areas/sunderwood/walkthrough.ts > src/content/areas/thornmark/walkthrough.ts',
    'src/content/areas/sunderwood/walkthrough.ts > src/content/areas/wrackholm/walkthrough.ts',
    'src/content/areas/thornmark/walkthrough.ts > src/content/areas/shelf/walkthrough.ts',
    'src/content/areas/wrackholm/walkthrough.ts > src/content/areas/saltreach/walkthrough.ts',
  ],
};

// ---- Reading the imports ----------------------------------------------------------------------

/** An import a file makes as it runs: the path as written, and whether it is an `import()`. */
export interface Spec { path: string; dynamic: boolean }

const WORD = new Uint8Array(128);
for (let c = 0; c < 128; c++) WORD[c] = /[\w$]/.test(String.fromCharCode(c)) ? 1 : 0;
/** After these words a slash opens a regular expression; after any other word it divides. */
const BEFORE_REGEX = new Set(['return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'throw', 'case', 'do', 'else', 'yield', 'await']);

/**
 * The imports a file makes as it runs, and how many it makes in types alone. Comments, strings,
 * template literals and regular expressions are skipped whole, so an import written inside one is
 * not taken; the import forms are read from the tokens between.
 */
export function imports(text: string): { runtime: Spec[]; types: number } {
  const n = text.length;
  let i = 0;
  /** Each open brace, true where a template's `${` opened it. */
  const opened: boolean[] = [];
  // The token: 'w' a word, 's' a string, 't' a template, 'r' a regular expression, 'p' a mark.
  let kind = '', value = '', prevKind = '', prevValue = '', held = false;
  const template = (): void => {
    while (i < n) {
      const c = text.charCodeAt(i);
      if (c === 92) i += 2;
      else if (c === 96) { i++; return; }
      else if (c === 36 && text.charCodeAt(i + 1) === 123) { i += 2; opened.push(true); return; }
      else i++;
    }
  };
  const lex = (): boolean => {
    while (i < n) {
      const c = text.charCodeAt(i);
      if (c <= 32 || c === 160 || c === 0xfeff) { i++; continue; }
      if (c === 47) {
        const d = text.charCodeAt(i + 1);
        if (d === 47) { const e = text.indexOf('\n', i); i = e < 0 ? n : e; continue; }
        if (d === 42) { const e = text.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; continue; }
        if (kind === '' || (kind === 'p' && value !== ')' && value !== ']') || (kind === 'w' && BEFORE_REGEX.has(value))) {
          let inClass = false;
          for (i++; i < n; i++) {
            const e = text.charCodeAt(i);
            if (e === 92) i++;
            else if (e === 10) break;
            else if (e === 91) inClass = true;
            else if (e === 93) inClass = false;
            else if (e === 47 && !inClass) { i++; break; }
          }
          while (i < n && text.charCodeAt(i) < 128 && WORD[text.charCodeAt(i)]) i++;
          kind = 'r'; value = '';
          return true;
        }
      }
      if (c === 39 || c === 34) {
        const s = ++i;
        while (i < n) { const e = text.charCodeAt(i); if (e === 92) i += 2; else if (e === c || e === 10) break; else i++; }
        kind = 's'; value = text.slice(s, i); i++;
        return true;
      }
      if (c === 96) { i++; template(); kind = 't'; value = ''; return true; }
      if (c < 128 && WORD[c]) {
        const s = i;
        while (++i < n && text.charCodeAt(i) < 128 && WORD[text.charCodeAt(i)]);
        kind = 'w'; value = text.slice(s, i);
        return true;
      }
      i++;
      if (c === 123) opened.push(false);
      else if (c === 125 && opened.pop()) { template(); kind = 't'; value = ''; return true; }
      kind = 'p'; value = String.fromCharCode(c);
      return true;
    }
    return false;
  };
  const next = (): boolean => {
    if (held) { held = false; return true; }
    prevKind = kind; prevValue = value;
    return lex();
  };
  const is = (k: string, v: string): boolean => kind === k && value === v;
  /** Reads on to `from '...'` within the statement: the path, or undefined. */
  const from = (): string | undefined => {
    while (next()) {
      if (is('p', ';')) return undefined;
      if (is('w', 'import') || is('w', 'export')) { held = true; return undefined; }
      if (is('w', 'from')) {
        if (next() && kind === 's') return value;
        held = true;
      }
    }
    return undefined;
  };
  const runtime: Spec[] = [];
  let types = 0;
  while (next()) {
    if (kind !== 'w' || (value !== 'import' && value !== 'export') || (prevKind === 'p' && prevValue === '.')) continue;
    const word = value, before = prevKind === 'w' ? prevValue : '';
    if (!next()) break;
    if (word === 'import') {
      if (is('p', '(')) {
        if (!next()) break;
        // import(p): a path worked out as it runs, which no static read can follow.
        if (kind !== 's') { held = true; continue; }
        const path = value;
        if (!next()) break;
        if (!is('p', ')') && !is('p', ',')) { held = true; continue; }
        let inType = before === 'typeof';
        if (is('p', ')') && next()) {
          if (is('p', '.')) inType ||= next() && kind === 'w' && value !== 'then' && value !== 'catch' && value !== 'finally';
          held = true;
        }
        if (inType) types++; else runtime.push({ path, dynamic: true });
        continue;
      }
      if (kind === 's') { runtime.push({ path: value, dynamic: false }); continue; }
      // import.meta, or a key named import.
      if (kind === 'p' && value !== '{' && value !== '*') { held = true; continue; }
      let type = false;
      if (is('w', 'type')) {
        if (!next()) break;
        // `import type from` and `import type, {` take a default import named type.
        type = !is('w', 'from') && !is('p', ',');
        held = true;
      }
      const path = from();
      if (path !== undefined) { if (type) types++; else runtime.push({ path, dynamic: false }); }
      continue;
    }
    let type = false;
    if (is('w', 'type')) {
      if (!next()) break;
      type = true;
    }
    if (is('p', '*')) {
      const path = from();
      if (path !== undefined) { if (type) types++; else runtime.push({ path, dynamic: false }); }
    } else if (is('p', '{')) {
      while (next() && !is('p', '}'));
      if (next() && is('w', 'from')) {
        if (next() && kind === 's') { if (type) types++; else runtime.push({ path: value, dynamic: false }); } else held = true;
      } else held = true;
    } else held = true;
  }
  return { runtime, types };
}

// ---- The graph --------------------------------------------------------------------------------

/** The runtime import graph: each file's imports in src/ and tools/, resolved to files. */
export interface Graph {
  files: readonly string[];
  edges: ReadonlyMap<string, ReadonlySet<string>>;
  imports: number;
  dynamic: number;
  types: number;
  /** Relative paths that name no file. */
  unresolved: readonly string[];
}

/** Every file under src/ and tools/, as its path from the root. */
export function treeFiles(): string[] {
  return ['src', 'tools'].flatMap((dir) => readdirSync(ROOT + dir, { recursive: true, withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => relative(ROOT, d.parentPath + '/' + d.name).replaceAll('\\', '/'))
    .filter((f) => !f.includes('node_modules/')));
}

/**
 * The graph of the files given, each read by `read`. The importers are the .ts files outside
 * src/lib/, which is vendored and never edited here; every file is a node an import can reach. A
 * path a package or Node's own module names, or one outside src/ and tools/, is not followed.
 */
export function graph(files: readonly string[], read: (f: string) => string): Graph {
  const set = new Set(files);
  const edges = new Map<string, Set<string>>();
  const unresolved: string[] = [];
  let count = 0, dynamic = 0, types = 0;
  for (const f of files) {
    if (!f.endsWith('.ts') || f.endsWith('.d.ts') || f.startsWith('src/lib/')) continue;
    const found = imports(read(f));
    types += found.types;
    const to = new Set<string>();
    for (const s of found.runtime) {
      if (!s.path.startsWith('./') && !s.path.startsWith('../')) continue;
      const p = posix.normalize(posix.join(posix.dirname(f), s.path));
      if (!p.startsWith('src/') && !p.startsWith('tools/')) continue;
      const file = set.has(p) ? p : set.has(p + '/index.ts') ? p + '/index.ts' : undefined;
      if (!file) { unresolved.push(`${f} imports ${s.path}`); continue; }
      count++;
      if (s.dynamic) dynamic++;
      to.add(file);
    }
    edges.set(f, to);
  }
  return { files, edges, imports: count, dynamic, types, unresolved };
}

// ---- The rules --------------------------------------------------------------------------------

/** The layers of src, lowest first. */
const LAYERS = ['src/lib', 'src/game', 'src/content', 'src/ui', 'src/app'];

/** Where a file stands: its layer in src, a walkthrough, a suite, the suites' frame (tools/tests/lib.ts), the kit or a tool. */
export function place(f: string): string {
  if (/^src\/content\/areas\/[^/]+\/walkthrough\.ts$/.test(f)) return 'walkthrough';
  for (const layer of LAYERS.slice(0, 4)) if (f.startsWith(layer + '/')) return layer;
  if (f.startsWith('src/')) return 'src/app';
  if (f === 'tools/tests/lib.ts') return 'frame';
  if (/^tools\/tests\/[^/]+\.ts$/.test(f)) return 'suite';
  return f.startsWith('tools/kit/') ? 'kit' : 'tool';
}

export type Rule = 'layers' | 'areas' | 'tests' | 'kit';
/** Each rule as the check says it, of an import from `a` to `b`. */
const SAYS: Record<Rule, (a: string, b: string) => string> = {
  layers: (a, b) => LAYERS.includes(place(b)) ? `${place(a)} is under ${place(b)}` : 'src takes no tool and no walkthrough',
  areas: () => "an area takes another area's files only through its public.ts",
  tests: () => 'a walkthrough or a suite takes src and tools/kit/, not another walkthrough or suite and not a tool',
  kit: () => 'tools/kit/ takes src only',
};

const areaOf = (f: string): string | undefined => /^src\/content\/areas\/([^/]+)\//.exec(f)?.[1];

/** The rule an import from `a` to `b` breaks, if any: a walkthrough's or a suite's first, then the layers, then the areas. */
export function broken(a: string, b: string): Rule | undefined {
  const pa = place(a), pb = place(b);
  const inSrc = (p: string): boolean => LAYERS.includes(p);
  if (pa === 'walkthrough' || pa === 'suite') {
    if (!inSrc(pb) && pb !== 'kit' && !(pa === 'suite' && pb === 'frame')) return 'tests';
  } else if (pa === 'kit') {
    return inSrc(pb) || pb === 'kit' ? undefined : 'kit';
  } else if (inSrc(pa)) {
    if (!inSrc(pb) || LAYERS.indexOf(pb) > LAYERS.indexOf(pa)) return 'layers';
  } else return undefined;
  const from = areaOf(a), to = areaOf(b);
  return from && to && from !== to && b !== `src/content/areas/${to}/public.ts` ? 'areas' : undefined;
}

/** Each crossing as `importer > imported`, with the rule it breaks. */
export function crossings(g: Graph): Map<string, Rule> {
  const out = new Map<string, Rule>();
  for (const [a, to] of g.edges) for (const b of to) {
    const rule = broken(a, b);
    if (rule) out.set(`${a} > ${b}`, rule);
  }
  return out;
}

/** The cycles among src's runtime imports: each strongly connected component of more than one file, or a file that imports itself, its files sorted. */
export function cycles(g: Graph): string[][] {
  const inSrc = (f: string): boolean => f.startsWith('src/');
  const index = new Map<string, number>(), low = new Map<string, number>();
  const stack: string[] = [], onStack = new Set<string>(), out: string[][] = [];
  let n = 0;
  const visit = (v: string): void => {
    index.set(v, n); low.set(v, n); n++;
    stack.push(v); onStack.add(v);
    for (const w of g.edges.get(v) ?? []) {
      if (!inSrc(w)) continue;
      if (!index.has(w)) { visit(w); low.set(v, Math.min(low.get(v)!, low.get(w)!)); }
      else if (onStack.has(w)) low.set(v, Math.min(low.get(v)!, index.get(w)!));
    }
    if (low.get(v) !== index.get(v)) return;
    const scc: string[] = [];
    let w: string;
    do { w = stack.pop()!; onStack.delete(w); scc.push(w); } while (w !== v);
    if (scc.length > 1 || g.edges.get(v)?.has(v)) out.push(scc.sort());
  }
  for (const f of [...g.edges.keys()].filter(inSrc).sort()) if (!index.has(f)) visit(f);
  return out.sort((a, b) => a[0] < b[0] ? -1 : 1);
}

/** The check of a graph against a table: each line that fails, the file pair or the cycle and the rule. */
export function judge(g: Graph, known: Readonly<Partial<Record<Key, readonly string[]>>>): { failures: string[]; byRule: Map<string, number>; byKey: Map<string, number> } {
  const failures: string[] = [];
  const rows = new Map<string, Key>();
  for (const [key, list] of Object.entries(known) as [Key, readonly string[]][]) {
    if (!(key in KEYS)) failures.push(`KNOWN: ${key} is no issue of #848's plan`);
    for (const row of list) {
      if (rows.has(row)) failures.push(`KNOWN: ${row} is a row twice`);
      rows.set(row, key);
    }
  }
  const byRule = new Map<string, number>(), byKey = new Map<string, number>();
  const seen = new Set<string>();
  const count = (rule: string, key: Key): void => {
    byRule.set(rule, (byRule.get(rule) ?? 0) + 1);
    byKey.set(key, (byKey.get(key) ?? 0) + 1);
  };
  for (const [pair, rule] of crossings(g)) {
    const [a, b] = pair.split(' > ');
    const key = rows.get(pair);
    if (key) { seen.add(pair); count(rule, key); } else failures.push(`${rule}: ${a} imports ${b}, and ${SAYS[rule](a, b)}; no KNOWN row holds it`);
  }
  for (const scc of cycles(g)) {
    const row = 'cycle: ' + scc.join(' ');
    const key = rows.get(row);
    if (key) { seen.add(row); count('cycle', key); } else failures.push(`cycle: ${scc.join(', ')} import each other as they load; no KNOWN row holds it`);
  }
  for (const [row, key] of rows) {
    if (!seen.has(row)) failures.push(`KNOWN: ${row} (${key}) no longer ${row.startsWith('cycle: ') ? 'is a cycle' : 'crosses'}: the row goes`);
  }
  return { failures, byRule, byKey };
}

const counted = (m: ReadonlyMap<string, number>): string => [...m].sort().map(([k, v]) => `${k} ${v}`).join(', ') || 'none';

export function layers(): void {
  // The lexer on the forms the files are written in.
  const forms: [string, string[]][] = [
    ["import { a, type B } from './a.ts';\nimport type { C } from './c.ts';", ['./a.ts']],
    ["import { type B } from './b.ts';", ['./b.ts']],
    ["import type, { a } from './t.ts';\nimport type X from './x.ts';", ['./t.ts']],
    ["export * from './s.ts';\nexport { a } from './e.ts';\nexport type { T } from './t.ts';\nexport type * from './u.ts';\nexport { b };", ['./s.ts', './e.ts']],
    ["import './side.ts';\nconst m = await import('./late.ts');\nimport('./then.ts').then((x) => x);", ['./side.ts', './late.ts', './then.ts']],
    ["type T = import('./t.ts').T;\nlet u: typeof import('./u.ts');\nconst p = await import(path);", []],
    ["// import { a } from './c1.ts';\n/* import './c2.ts'; */\nconst s = \"import './s.ts'\";\nconst t = `import { a } from './t.ts' ${ `${'x'}` } import('./u.ts')`;", []],
    ["const r = /['\"`]/g, q = a / 2 / b;\nimport { x } from './after.ts';\nconst o = { import: 1, export: 2 }, m = import.meta.url;", ['./after.ts']],
  ];
  for (const [text, want] of forms) {
    const got = imports(text).runtime.map((s) => s.path);
    ok(got.join() === want.join(), `the lexer reads ${JSON.stringify(text.split('\n')[0])}${text.includes('\n') ? ' and on' : ''}: ${want.join(', ') || 'nothing'} at run time${got.join() === want.join() ? '' : `, not ${got.join(', ') || 'nothing'}`}`);
  }

  // The rules on a graph in memory: a new crossing fails, and so does a row that no longer crosses.
  const fixture = graph(['src/game/a.ts', 'src/content/b.ts', 'src/content/areas/x/maps/m.ts', 'src/content/areas/y/public.ts', 'src/content/areas/y/maps/n.ts'], (f) => ({
    'src/game/a.ts': "import { B } from '../content/b.ts';",
    'src/content/b.ts': "import { A } from '../game/a.ts';",
    'src/content/areas/x/maps/m.ts': "import { N } from '../../y/maps/n.ts';\nimport { P } from '../../y/public.ts';",
  } as Record<string, string>)[f] ?? '');
  const held = judge(fixture, { L2: ['src/game/a.ts > src/content/b.ts', 'cycle: src/content/b.ts src/game/a.ts'], A6: ['src/content/areas/x/maps/m.ts > src/content/areas/y/maps/n.ts'] });
  ok(held.failures.length === 0, `a graph in memory whose crossings and cycle KNOWN holds passes${held.failures.length ? ': ' + held.failures.join('; ') : ''}`);
  const fresh = judge(fixture, { L2: ['src/game/a.ts > src/content/b.ts', 'cycle: src/content/b.ts src/game/a.ts'] });
  ok(fresh.failures.join() === "areas: src/content/areas/x/maps/m.ts imports src/content/areas/y/maps/n.ts, and an area takes another area's files only through its public.ts; no KNOWN row holds it",
    `a crossing no row holds fails, by its pair and its rule: ${fresh.failures.join('; ')}`);
  const stale = judge(fixture, { L2: ['src/game/a.ts > src/content/b.ts', 'cycle: src/content/b.ts src/game/a.ts', 'src/game/a.ts > src/ui/gone.ts'], A6: ['src/content/areas/x/maps/m.ts > src/content/areas/y/maps/n.ts'] });
  ok(stale.failures.join() === 'KNOWN: src/game/a.ts > src/ui/gone.ts (L2) no longer crosses: the row goes', `a row that no longer crosses fails: ${stale.failures.join('; ')}`);
  const loop = judge(fixture, { L2: ['src/game/a.ts > src/content/b.ts'], A6: ['src/content/areas/x/maps/m.ts > src/content/areas/y/maps/n.ts'] });
  ok(loop.failures.join() === 'cycle: src/content/b.ts, src/game/a.ts import each other as they load; no KNOWN row holds it', `a cycle no row holds fails, by its files: ${loop.failures.join('; ')}`);

  // The tree.
  const t0 = performance.now();
  const files = treeFiles();
  const g = graph(files, (f) => readFileSync(ROOT + f, 'utf8'));
  const ms = performance.now() - t0;
  ok(g.unresolved.length === 0, `every relative import names a file${g.unresolved.length ? ': not ' + g.unresolved.join(', ') : ''}`);
  const { failures, byRule, byKey } = judge(g, KNOWN);
  for (const f of failures) fail(f);
  const rows = Object.values(KNOWN).reduce((s, l) => s + l.length, 0);
  const crossing = [...byRule.values()].reduce((s, k) => s + k, 0);
  ok(failures.length === 0, `the runtime graph of src/ and tools/: ${g.edges.size} files that import, ${g.imports} runtime imports (${g.dynamic} of them import()), ${g.types} in types alone left out, read in ${ms.toFixed(0)} ms; ` +
    `KNOWN's ${rows} rows, ${crossing} of them crossing today, by rule ${counted(byRule)}; by issue ${counted(byKey)}`);
}
