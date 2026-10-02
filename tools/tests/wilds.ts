// The wilderness features (EXPANSION §5.3), on a fixture field, since no map places one yet: a
// shrine, a fountain, a cairn, a statue, a camp and a hermit. Each counts towards the density floor
// and none as a sign; the first four give once and are saved as used, the camp rests the party as
// often as it likes, and the statue takes its answer typed, through the real keyboard, and only the
// right word. Then the hint chain: every statue's answer is said somewhere else in the game.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { GameMap } from '../../src/game/map.ts';
import type { Feature, MapDef } from '../../src/game/map.ts';
import { World } from '../../src/game/world.ts';
import { defaultParty } from '../../src/game/party.ts';
import type { Party } from '../../src/game/party.ts';
import { serialize, deserialize, SAVE_VERSION } from '../../src/game/save.ts';
import { NORTH } from '../../src/game/types.ts';
import { useShrine, openCairn, answerRiddle, restRefused, restParty, stepLine, normalWord, spentId, ANSWER_MAX } from '../../src/game/wilds.ts';
import { Input } from '../../src/input.ts';
import { RiddleScreen } from '../../src/ui/riddle.ts';
import type { Game } from '../../src/game/game.ts';
import { MAP_DEFS } from '../../src/content/index.ts';
import { CONTENT, collect, compare } from '../shipped.ts';
import { judge, measure } from './density.ts';
import { texts, lineFaults } from './pillars.ts';
import { condFaults } from './quests.ts';
import { ok } from './lib.ts';

const FIXTURE: MapDef = {
  id: 'wilds', name: 'Wilds', kind: 'outdoor', density: 'country',
  start: { x: 0, y: 0, facing: NORTH },
  rows: Array.from({ length: 5 }, () => ','.repeat(13)),
  features: [
    { kind: 'shrine', x: 1, y: 1, id: 'w_shrine', text: 'A worn shrine to the sea. You kneel.', stat: 'might', done: 'The shrine is quiet.' },
    { kind: 'fountain', x: 3, y: 1, id: 'w_fountain', text: 'Cold water, quick in the throat.', stat: 'speed', amount: 2, done: 'The fountain has run dry.' },
    { kind: 'cairn', x: 5, y: 1, id: 'w_cairn', text: 'A heap of stones on the ridge.', gold: 7, items: ['key_iron'] },
    { kind: 'statue', x: 7, y: 1, id: 'w_statue', text: 'A stone keeper, one hand raised.', riddle: 'Name the old word the keeper kept.', answer: 'saltmarrow', gift: { gold: 20, stat: 'luck' }, done: 'The keeper lowers its hand.' },
    { kind: 'camp', x: 9, y: 1, text: 'A ring of cold ashes.' },
    { kind: 'npc', x: 11, y: 1, name: 'A hermit', lines: ['They say the old word was saltmarrow.'] },
  ],
  encounters: [{ id: 'w_rats', x: 9, y: 3, monsters: ['rat'], roams: false }],
};

function pick<K extends Feature['kind']>(def: MapDef, kind: K): Extract<Feature, { kind: K }> {
  return def.features!.find((f) => f.kind === kind) as Extract<Feature, { kind: K }>;
}

/**
 * Each statue whose answer cannot be given or is not hinted: one with no letters, or longer than the
 * riddle's box takes, or that no other text of the game says as a whole word (DESIGN §1). No
 * statue's answer is a hint, or two statues sharing one would hint each other.
 */
export function hintless(defs: readonly MapDef[]): string[] {
  const answers = new Set(defs.flatMap((d) => (d.features ?? []).flatMap((f) => (f.kind === 'statue' ? [`${d.id} statue ${f.x},${f.y}\n${f.answer}`] : []))));
  const all = texts(defs).filter((t) => !answers.has(`${t.where}\n${t.text}`)), out: string[] = [];
  for (const d of defs) for (const f of d.features ?? []) {
    if (f.kind !== 'statue') continue;
    const own = `${d.id} statue ${f.x},${f.y}`, answer = normalWord(f.answer);
    if (!answer) { out.push(`${own}: its answer "${f.answer}" has no letters to type`); continue; }
    if (answer.length > ANSWER_MAX) { out.push(`${own}: its answer "${f.answer}" is longer than the ${ANSWER_MAX} characters the box takes`); continue; }
    const word = new RegExp(`(^|[^a-z])${answer.replace(/ /g, '[^a-z]+')}($|[^a-z])`, 'i');
    if (!all.some((t) => t.where !== own && word.test(t.text))) out.push(`${own}: its answer "${f.answer}" is said nowhere else`);
  }
  return out;
}

const fresh = (): { world: World; party: Party } => {
  const rng = makeRng(3), party = defaultParty(rng);
  party.food = 50;
  return { world: new World({ wilds: new GameMap(FIXTURE) }, party, rng), party };
};
const stat = (p: Party, s: 'might' | 'speed' | 'luck'): number[] => p.members.map((m) => m.stats[s]);
const plus = (a: number[], b: number[], n: number): boolean => a.every((v, i) => b[i] === v + n);

export function wilds(): void {
  const shrine = pick(FIXTURE, 'shrine'), fountain = pick(FIXTURE, 'fountain'), cairn = pick(FIXTURE, 'cairn'), statue = pick(FIXTURE, 'statue'), camp = pick(FIXTURE, 'camp');

  // Placed: parsed, on open ground, each a point of interest and none a sign.
  const m = new GameMap(FIXTURE);
  ok(m.features.every((f) => m.passable(f.x, f.y) === 'ok'), 'the six kinds stand on open ground of a parsed map');
  const r = measure(FIXTURE);
  ok(r.points === 7 && r.signs === 0 && !judge(FIXTURE).why, `each counts as a point and none as a sign (${r.points} points, ${r.signs} signs, ${judge(FIXTURE).why || 'inside the country floor'})`);
  ok(lineFaults(FIXTURE).length === 0, `their lines fit the log${lineFaults(FIXTURE).map((l) => '; ' + l).join('')}`);
  const long: MapDef = { ...FIXTURE, features: [{ ...shrine, done: 'The shrine is quiet. '.repeat(12) }] };
  ok(lineFaults(long).some((l) => l.includes("shrine's done")), 'and a shrine that says too much is caught');
  // Three lines bare, four as the step logs it, with the look after it.
  const keeper = 'A stone keeper stands here with one hand raised toward the pass and the sea beyond, its face worn smooth by the wind of many long winters on the coast, gulls nesting in its hood.';
  ok(lineFaults({ ...FIXTURE, features: [{ ...statue, text: keeper }] }).some((l) => l.includes("statue's text")), 'and a statue whose look, as the step logs it, takes four lines is caught');

  // Used: each gives once.
  const { world, party } = fresh();
  let before = stat(party, 'might');
  const lines = useShrine(world, party, shrine);
  ok(plus(before, stat(party, 'might'), 1) && lines[0] === shrine.text, `the shrine gives every member a point of Might (${lines.join(' ')})`);
  before = stat(party, 'might');
  ok(useShrine(world, party, shrine)[0] === shrine.done && plus(before, stat(party, 'might'), 0), 'and a second time gives nothing and says so');
  before = stat(party, 'speed');
  useShrine(world, party, fountain);
  useShrine(world, party, fountain);
  ok(plus(before, stat(party, 'speed'), 2), 'the fountain gives its two points of Speed, once');
  let gold = party.gold;
  const bag = party.bag.length;
  const cached = openCairn(world, party, cairn);
  ok(party.gold === gold + 7 && party.bag.length === bag + 1 && party.bag.includes('key_iron'), `the cairn gives its cache (${cached.join(' ')})`);
  openCairn(world, party, cairn);
  ok(party.gold === gold + 7 && party.bag.length === bag + 1, 'once');
  gold = party.gold; before = stat(party, 'luck');
  ok(!answerRiddle(world, party, statue, 'lamp').right && !world.used(statue.id), 'the statue takes a wrong word and spends nothing');
  ok(!answerRiddle(world, party, statue, 'saltmarro').right && !answerRiddle(world, party, statue, 'salt marrow').right && party.gold === gold, 'nor a near one');
  ok(answerRiddle(world, party, statue, '  SaltMarrow ').right && party.gold === gold + 20 && plus(before, stat(party, 'luck'), 1), 'and gives on the right word, in any case');
  ok(!answerRiddle(world, party, statue, 'saltmarrow').right && party.gold === gold + 20, 'once');
  ok([shrine, fountain, cairn, statue].every((f) => stepLine(world, f) === ''), 'spent, they say nothing when stepped on');
  ok(stepLine(world, camp).includes('R rests'), 'a camp always does');

  // The camp: rested at again, though monsters are two squares off; not with one next to the party.
  world.state.x = 8; world.state.y = 2;
  ok(restRefused(world) !== '', 'off the camp, a group two squares off forbids rest');
  world.state.x = camp.x; world.state.y = camp.y;
  ok(restRefused(world) === '', 'at the camp, the same group does not');
  for (const time of ['once', 'and again']) {
    for (const c of party.members) c.hp = 1;
    const at = world.state.minutes, food = party.food;
    ok(restParty(world, party) && party.members.every((c) => c.hp === c.maxHp) && world.state.minutes === at + 480 && food > party.food, `the camp rests the party whole, eight hours and a ration each, ${time}`);
  }
  world.mapState.groups.w_rats = { x: camp.x + 1, y: camp.y, dead: -1 };
  ok(restRefused(world) !== '', 'but not with a group next to the party');
  world.mapState.groups.w_rats = { x: 9, y: 3, dead: -1 };

  // Saved as used: through a save and back, the four are spent and nothing gives again.
  const data = deserialize(serialize(world.state, party, 0));
  const loaded = new World({ wilds: new GameMap(FIXTURE) }, data.party, makeRng(1), data.world);
  const ids = Object.keys(loaded.mapState.used).sort();
  ok(ids.join() === 'w_cairn,w_fountain,w_shrine,w_statue', `a save keeps the four spent, and no camp (${ids.join(', ')})`);
  const lp = data.party, might = stat(lp, 'might'), lgold = lp.gold;
  useShrine(loaded, lp, shrine); openCairn(loaded, lp, cairn); answerRiddle(loaded, lp, statue, 'saltmarrow');
  ok(plus(stat(party, 'might'), might, 0) && plus(might, stat(lp, 'might'), 0) && lp.gold === lgold, 'the points stay with the party, and nothing gives again after the load');

  // Recorded as shipped: the four and not the camp; one renamed is caught.
  const got = collect({ ...CONTENT, defs: [FIXTURE] });
  ok(got.maps.wilds?.used.join() === 'w_cairn,w_fountain,w_shrine,w_statue', `the shipped list records the four spent kinds and not the camp (${got.maps.wilds?.used.join(', ')})`);
  ok(FIXTURE.features!.every((f) => (spentId(f) !== undefined) === ['shrine', 'fountain', 'cairn', 'statue'].includes(f.kind)), 'only those four are kept by an id');
  const renamed = collect({ ...CONTENT, defs: [{ ...FIXTURE, features: FIXTURE.features!.map((f) => (f.kind === 'shrine' ? { ...f, id: 'w_shrine2' } : f)) }] });
  ok(compare({ version: SAVE_VERSION, ...got }, renamed).problems.some((p) => p.includes('w_shrine is gone')), 'and a shrine renamed is caught');

  // Typed, through the real keyboard, and only the right word.
  (globalThis as { window?: EventTarget }).window ??= new EventTarget();
  const keys = new EventTarget(), input = new Input(keys);
  const press = (key: string, code: string): void => { keys.dispatchEvent(Object.assign(new Event('keydown'), { key, code })); };
  const type = (s: string): void => { for (const ch of s) press(ch, ch === ' ' ? 'Space' : `Key${ch.toUpperCase()}`); };
  const said: string[] = [];
  let open = 0;
  const g = { input, say: (l: string) => said.push(l), pop: () => { open--; } } as unknown as Game;
  const t = fresh();
  const riddle = (): RiddleScreen => { open++; return new RiddleScreen(g, 'A statue', statue.riddle, (w) => { for (const l of answerRiddle(t.world, t.party, statue, w).lines) g.say(l); }); };
  const run = (s: RiddleScreen): void => { let a; do { a = input.next(); s.update(g, a); } while (a); };

  let s = riddle();
  ok(input.textMode, 'the riddle opens with the text mode on');
  type('salt marrow'); run(s);
  ok(open === 1 && s.word === 'salt marrow', `a space is typed, not an answer (${s.word})`);
  press('Enter', 'Enter'); run(s);
  ok(open === 0 && !t.world.used(statue.id) && said.at(-1) === 'The statue is silent.', 'Enter answers; a wrong word spends nothing');
  ok(!input.textMode, 'and the text mode is off');

  s = riddle(); gold = t.party.gold;
  type('SaltMarrow1x'); press('Backspace', 'Backspace'); run(s);
  ok(s.word === 'SaltMarrow', `Backspace edits and digits are dropped (${s.word})`);
  press('Enter', 'Enter'); run(s);
  ok(open === 0 && t.world.used(statue.id) && t.party.gold === gold + 20 && said.includes(statue.done), 'the right word, in any case, gives');
  ok(!input.textMode, 'and the text mode is off');

  s = riddle();
  type('salt'); press('Escape', 'Escape'); run(s);
  ok(open === 0 && !input.textMode && t.party.gold === gold + 20, 'Esc leaves, answering nothing, the text mode off');
  press('r', 'KeyR'); press('m', 'KeyM');
  ok(input.next() === 'rest' && input.next() === 'map', 'and R and M are actions again');

  // A blessing that waits on a flag (#554): out of its presence it is not there, says nothing and is
  // not spent; once the flag is set it blesses, once.
  const waits = { ...shrine, id: 'w_tide', x: 1, y: 3, after: { flag: 'w_bell' } };
  const late: MapDef = { ...FIXTURE, features: [...FIXTURE.features!, waits] };
  const tide = (() => { const rng = makeRng(3), p = defaultParty(rng); return { world: new World({ wilds: new GameMap(late) }, p, rng), party: p }; })();
  tide.world.state.x = waits.x; tide.world.state.y = waits.y;
  before = stat(tide.party, 'might');
  ok(!tide.world.present(waits) && tide.world.featureHere() === undefined && stepLine(tide.world, waits) === '', 'a shrine after a flag nobody has set is not there: not found underfoot, and nothing said stepping on it');
  ok(useShrine(tide.world, tide.party, waits).length === 0 && !tide.world.used(waits.id) && plus(before, stat(tide.party, 'might'), 0), 'knelt at all the same, it gives nothing and is not spent');
  tide.party.flags.w_bell = 1;
  ok(tide.world.present(waits) && tide.world.featureHere() === waits && stepLine(tide.world, waits).includes('Space kneels'), 'once the flag is set it is there');
  ok(useShrine(tide.world, tide.party, waits)[0] === waits.text && plus(before, stat(tide.party, 'might'), 1) && tide.world.used(waits.id), 'and blesses, a point of Might to each');
  ok(useShrine(tide.world, tide.party, waits)[0] === waits.done && plus(before, stat(tide.party, 'might'), 1), 'once');
  ok(condFaults({ flag: 'w_bell' }, [late]).length === 1, 'its flag is one some person or event has to set');

  // The hint chain: every statue's answer is said somewhere else.
  const bare: MapDef = { ...FIXTURE, features: FIXTURE.features!.filter((f) => f.kind !== 'npc') };
  ok(hintless([FIXTURE]).length === 0, 'a statue whose answer a hermit says has its hint');
  ok(hintless([bare]).length === 1, `and without the hermit it has none (${hintless([bare]).join('')})`);
  const statueAt = (x: number, answer: string): Feature => ({ ...statue, x, id: `w_statue${x}`, answer });
  const withStatues = (...more: Feature[]): MapDef => ({ ...FIXTURE, features: [...FIXTURE.features!, ...more] });
  for (const [answer, why] of [['', 'no letters'], ['42', 'no letters'], ['the salt marrow keeper', 'longer than']] as const) {
    // Hinted, so only the answer itself is at fault.
    const lost = hintless([withStatues(statueAt(12, answer), { kind: 'npc', x: 12, y: 3, name: 'A pilgrim', lines: [`Some say ${answer}.`] })]);
    ok(lost.some((l) => l.includes(why)), `a statue answered "${answer}" is caught (${lost.join('; ') || 'passes'})`);
  }
  const twins = hintless([{ ...bare, features: [...bare.features!, statueAt(12, 'saltmarrow')] }]);
  ok(twins.length === 2, `two statues sharing an answer do not hint each other (${twins.length} caught)`);
  const two = fresh();
  ok(answerRiddle(two.world, two.party, { ...statue, answer: 'old keeper' }, ' Old  KEEPER ').right, 'a two-word answer is taken typed with two spaces between');
  // The quests may name a spent feature by its map and id, and never by the map alone.
  ok(condFaults({ seen: 'wilds:w_cairn' }, [FIXTURE]).length === 0 && condFaults({ seen: 'wilds' }, [FIXTURE]).length === 1, 'a quest sees a cairn by its id, and not by its map alone');
  ok(condFaults({ seen: 'greywater2' }).join() === 'seen greywater2', 'nor Brandy Hole by its map alone');
  const statues = MAP_DEFS.flatMap((d) => (d.features ?? []).filter((f) => f.kind === 'statue'));
  const lost = hintless(MAP_DEFS);
  ok(!lost.length, `every statue in the content has its answer said elsewhere (${statues.length} placed)${lost.map((l) => '; ' + l).join('')}`);
}
