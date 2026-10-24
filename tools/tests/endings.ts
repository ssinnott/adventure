// The endings (#750; DESIGN §9, docs/areas/hearth_isle.md §5 and §9, call 6): the table by its three
// flags, an answer that takes one, its pages turned one at a time back onto the Heart, and the Hearth's
// state beside the Stones' count: on the title from the save in storage, in the almanac and the sky from
// the world. A company that has taken no ending sees the count's, as it did before. The machinery's cases
// run on a fixture ending; the pages' fit is the voice check's (tools/tests/pillars.ts).
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { ENDINGS, ENDED } from '../../src/content/endings.ts';
import type { Ending } from '../../src/content/endings.ts';
import { World } from '../../src/game/world.ts';
import { defaultParty } from '../../src/game/party.ts';
import { answer, SHORT } from '../../src/game/people.ts';
import type { Answer } from '../../src/game/map.ts';
import { save } from '../../src/game/save.ts';
import type { Store } from '../../src/game/save.ts';
import type { Game } from '../../src/game/game.ts';
import { endingOf, endingTaken, savedHearth, savedStones, hearthLook, hearthWord, flickerOf, steadier } from '../../src/game/stones.ts';
import { EndingScreen } from '../../src/ui/ending.ts';
import { ok, fxFlag } from './lib.ts';

export function endings(): void {
  // The table: the three answers by their flags and names, as the plan gives them, and ENDED any of them.
  const named = Object.entries(ENDINGS).map(([id, e]) => `${id}:${e.flag}:${e.title}`).join();
  ok(named === 'reignite:q_end_reignite:The Hearth Relit,arrive:q_end_arrive:The Hull Opened,finish:q_end_finish:The Voyage Finished', `the endings are the plan's three, by flag and name (${named})`);
  ok(ENDED.map((c) => c.flag).join() === 'q_end_reignite,q_end_arrive,q_end_finish', 'ENDED is any of the three, as a When list');

  // A fixture ending in the table: an answer that sets its flag takes it once the company holds the flag.
  const fixture: Ending = { flag: fxFlag('fx_end'), title: 'The Fixture Ended', pages: ['The first page.', 'The second page.', 'The third page.'] };
  const table = ENDINGS as Record<string, Ending>;
  table.fx = fixture;
  try {
    const party = defaultParty(makeRng(750)), took: Answer = { label: 'End it', says: ['So be it.'], sets: [fxFlag('q_other'), fxFlag('fx_end')] };
    const short: Answer = { ...took, price: party.gold + 1 }, plain: Answer = { label: 'Not yet', says: ['Not yet.'], sets: fxFlag('q_other') };
    ok(answer(short, party) === SHORT && !endingTaken(short, party.flags) && !party.flags.fx_end, 'an ending\'s answer the company cannot pay for takes no ending and sets nothing');
    ok(answer(plain, party) === 'Not yet.' && !endingTaken(plain, party.flags), 'an answer that sets no ending\'s flag takes none');
    ok(answer(took, party) === 'So be it.' && endingTaken(took, party.flags) === fixture && (endingOf(party.flags) as string) === 'fx', 'an answer that sets an ending\'s flag among others takes that ending, and the flags say so');

    // Its pages, turned one at a time by Space or Esc, and past the last the screen beneath is on top again: the game goes on.
    const screens: string[] = ['explore'], g = { pop: () => void screens.pop() } as unknown as Game, pages = new EndingScreen(fixture);
    screens.push('ending');
    const turned: number[] = [];
    for (const a of [null, 'interact', 'cancel', 'interact'] as const) { pages.update(g, a); turned.push(screens.length === 2 ? pages.page : -1); }
    ok(turned.join() === '0,1,2,-1' && screens.join() === 'explore' && !!party.flags.fx_end, `its three pages are turned one at a time (${turned.join(', ')}), and after the last the company is where it stood, the ending's flag held`);
  } finally {
    delete table.fx;
  }

  // The Hearth's state: with no ending, the count's look and word, as before #750.
  const none = [0, 1, 2, 3, 4, 5, 6].every((n) => { const l = hearthLook({ stones: n }), m = Math.min(n, 5); return l.step === m && l.flicker === flickerOf(m) && !l.cast && hearthWord({ stones: n }) === steadier(n); });
  ok(none, 'a company that has taken no ending sees the count\'s Hearth: its step, its flicker, no cast and the almanac\'s word');
  const relit = hearthLook({ stones: 5, ending: 'reignite' }), opened = hearthLook({ stones: 5, ending: 'arrive' }), finished = hearthLook({ stones: 5, ending: 'finish' });
  ok(relit.step === 5 && relit.flicker === 0 && !relit.cast, 'relit: the column at full and still');
  ok(opened.step === 5 && opened.flicker === flickerOf(5) && !!opened.cast, 'opened: the column as it was at five Stones, under a sky of another colour');
  ok(finished.step > relit.step && finished.flicker === 0 && !finished.cast, 'finished: the column taller than full, and still');

  // The almanac reads it from the world, beside the day; two endings held read as the table's first.
  const rng = makeRng(750), party = defaultParty(rng), world = new World(buildMaps(), party, rng);
  party.flags.q_tide_home = 1;
  const plain = world.almanac().split('\n')[0], day = plain.slice(0, plain.indexOf(steadier(1)) - 1);
  const said: Record<string, string> = {
    reignite: 'It burns steady, and the tears are closed.',
    arrive: 'It burns as it did. The sky is another colour, and there is wind.',
    finish: 'It burns harder than it ever has, and the ground hums.',
  };
  for (const [id, e] of Object.entries(ENDINGS)) {
    party.flags[e.flag] = 1;
    const line = world.almanac().split('\n')[0];
    ok(world.hearth.ending === id && line === `${day} ${said[id]}` && world.stones === 1, `${e.title}: the almanac says "${said[id]}", the count kept beside it`);
    delete party.flags[e.flag];
  }
  ok(world.almanac().split('\n')[0] === plain && world.hearth.ending === undefined, 'with no ending held the almanac says what the count gives it');
  party.flags.q_end_finish = 1; party.flags.q_end_reignite = 1;
  ok(endingOf(party.flags) === 'reignite', 'two endings held read as the table\'s first');
  delete party.flags.q_end_finish; delete party.flags.q_end_reignite;

  // The title reads it from the save in storage, beside the count: none from no save or a broken one.
  const box = new Map<string, string>(), store: Store = { getItem: (k) => box.get(k) ?? null, setItem: (k, v) => void box.set(k, v), removeItem: (k) => void box.delete(k) };
  const empty = savedHearth(store);
  save(store, world.state, party, 0);
  const before = savedHearth(store);
  party.flags.q_end_arrive = 1;
  save(store, world.state, party, 0);
  const after = savedHearth(store);
  box.set([...box.keys()][0], '{not a save');
  const broken = savedHearth(store);
  ok(empty.stones === 0 && !empty.ending && before.stones === 1 && !before.ending && after.stones === 1 && after.ending === 'arrive' && !broken.ending && broken.stones === 0 && savedStones(null) === 0,
    `the title reads the saved company's ending beside its count (${after.ending}, ${after.stones}), none before it, and none from no save or a broken one`);
}
