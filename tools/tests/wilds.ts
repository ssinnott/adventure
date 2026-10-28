// The wilderness features (EXPANSION §5.3), on a fixture field, since no map places one yet: a
// shrine, a fountain, a cairn, a statue, a camp and a hermit. Each counts towards the density floor
// and none as a sign; the first four give once and are saved as used, the camp rests the party as
// often as it likes, and the statue takes its answer typed, through the real keyboard, and only the
// right word. Then the hint chain: every statue's answer is said somewhere else in the game. And a
// camp's nights (#730), on a fixture of camps: a rest there counts the first night not yet set, once
// its after holds, and says the night's own words on waking in place of the usual.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { GameMap } from '../../src/game/map.ts';
import type { Feature, MapDef } from '../../src/game/mapdef.ts';
import { World } from '../../src/game/world.ts';
import { defaultParty, resists, stayNight } from '../../src/game/party.ts';
import type { Party } from '../../src/game/party.ts';
import { serialize, deserialize, SAVE_VERSION } from '../../src/game/save.ts';
import { NORTH } from '../../src/game/types.ts';
import { useShrine, openCairn, answerRiddle, restRefused, restParty, restAndWake, stepLine, normalWord, spentId, ANSWER_MAX, drinkWell, castExplore } from '../../src/game/wilds.ts';
import { spell } from '../../src/game/spells.ts';
import { Input } from '../../src/app/input.ts';
import { RiddleScreen } from '../../src/ui/riddle.ts';
import type { Game } from '../../src/game/game.ts';
import { MAP_DEFS, TABLES } from '../../src/content/index.ts';
import { CONTENT, collect, compare } from '../kit/shipped.ts';
import { judge, measure } from '../kit/rules/density.ts';
import { texts, lineFaults } from '../kit/rules/pillars.ts';
import { condFaults } from '../kit/rules/quests.ts';
import { ok, fxKey, fxFlag } from './lib.ts';
import { headlessGame, drive } from '../kit/headless.ts';

const FIXTURE: MapDef = {
  id: 'wilds', name: 'Wilds', kind: 'outdoor', region: 'shelf', density: 'country',
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

/**
 * Camps that count nights (#730): a fire whose first night waits on a flag and whose second waits on
 * nothing, a camp that counts none, and a hollow whose one night has no words of its own.
 */
const CAMPS: MapDef = {
  id: 'camps', name: 'Camps', kind: 'outdoor', region: 'shelf',
  start: { x: 0, y: 0, facing: NORTH },
  rows: Array.from({ length: 3 }, () => ','.repeat(9)),
  features: [
    { kind: 'camp', x: 1, y: 1, name: 'The fire', text: 'A fire-ring on the shingle.', nights: [
      { after: { flag: fxFlag('fx_come') }, sets: fxFlag('fx_night1'), says: ['She is gone.', 'A boat is out.'] },
      { sets: fxFlag('fx_night2'), says: ['Rain on the stones.'] },
    ] },
    { kind: 'camp', x: 3, y: 1, text: 'A ring of cold ashes.' },
    { kind: 'camp', x: 5, y: 1, text: 'A hollow in the rock.', nights: [{ sets: fxFlag('fx_quiet') }] },
  ],
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
  const rng = makeRng(3), party = defaultParty(TABLES, rng);
  party.food = 50;
  return { world: new World(TABLES, { wilds: new GameMap(FIXTURE) }, party, rng), party };
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
  const loaded = new World(TABLES, { wilds: new GameMap(FIXTURE) }, data.party, makeRng(1), data.world);
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
  const waits = { ...shrine, id: 'w_tide', x: 1, y: 3, after: { flag: fxFlag('w_bell') } };
  const late: MapDef = { ...FIXTURE, features: [...FIXTURE.features!, waits] };
  const tide = (() => { const rng = makeRng(3), p = defaultParty(TABLES, rng); return { world: new World(TABLES, { wilds: new GameMap(late) }, p, rng), party: p }; })();
  tide.world.state.x = waits.x; tide.world.state.y = waits.y;
  before = stat(tide.party, 'might');
  ok(!tide.world.present(waits) && tide.world.featureHere() === undefined && stepLine(tide.world, waits) === '', 'a shrine after a flag nobody has set is not there: not found underfoot, and nothing said stepping on it');
  ok(useShrine(tide.world, tide.party, waits).length === 0 && !tide.world.used(waits.id) && plus(before, stat(tide.party, 'might'), 0), 'knelt at all the same, it gives nothing and is not spent');
  tide.party.flags.w_bell = 1;
  ok(tide.world.present(waits) && tide.world.featureHere() === waits && stepLine(tide.world, waits).includes('Space kneels'), 'once the flag is set it is there');
  ok(useShrine(tide.world, tide.party, waits)[0] === waits.text && plus(before, stat(tide.party, 'might'), 1) && tide.world.used(waits.id), 'and blesses, a point of Might to each');
  ok(useShrine(tide.world, tide.party, waits)[0] === waits.done && plus(before, stat(tide.party, 'might'), 1), 'once');
  ok(condFaults({ flag: fxFlag('w_bell') }, [late]).length === 1, 'its flag is one some person or event has to set');

  // A blessing's resistance (#555): to every member, whatever their state; the kind kept to the next
  // rest ends at it and the lasting one does not; both survive a save.
  {
    const warm = { ...shrine, id: 'w_warm', stat: undefined, resist: { element: 'fire' as const } };
    const brine = { ...fountain, id: 'w_brine', stat: undefined, resist: { element: 'cold' as const, until: 'rest' as const } };
    const b = (() => { const rng = makeRng(3), p = defaultParty(TABLES, rng); p.food = 50; return { world: new World(TABLES, { wilds: new GameMap({ ...FIXTURE, features: [warm, brine] }) }, p, rng), party: p }; })();
    b.party.members[3].hp = -20; b.party.members[3].conditions = ['dead'];
    before = stat(b.party, 'might');
    const said = useShrine(b.world, b.party, warm);
    ok(said[1] === 'Fire kept off each of the company.' && b.party.members.every((c) => resists(TABLES.items, c).join() === 'fire') && plus(before, stat(b.party, 'might'), 0), `a shrine that gives only a resistance gives it to every member, the dead too, and no stat (${said.join(' ')})`);
    useShrine(b.world, b.party, brine);
    ok(b.party.members.every((c) => resists(TABLES.items, c).join() === 'fire,cold'), 'a fountain adds its own, kept to the next rest');
    const kept = deserialize(serialize(b.world.state, b.party, 0)).party;
    ok(kept.members.every((c) => resists(TABLES.items, c).join() === 'fire,cold'), 'a save keeps both');
    b.world.state.x = camp.x; b.world.state.y = camp.y;
    ok(restParty(b.world, b.party) && b.party.members.every((c) => resists(TABLES.items, c).join() === 'fire'), 'a rest ends the one kept to it, and not the lasting one, on the dead as on the living');
    ok(MAP_DEFS.every((d) => (d.features ?? []).every((f) => (f.kind !== 'shrine' && f.kind !== 'fountain') || !!f.stat || !!f.resist)), 'every shrine and fountain in the game gives a stat or a resistance');
  }

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
  ok(condFaults({ seen: fxKey('wilds:w_cairn') }, [FIXTURE]).length === 0 && condFaults({ seen: fxKey('wilds') }, [FIXTURE]).length === 1, 'a quest sees a cairn by its id, and not by its map alone');
  ok(condFaults({ seen: fxKey('greywater2') }).join() === 'seen greywater2', 'nor Brandy Hole by its map alone');
  const statues = MAP_DEFS.flatMap((d) => (d.features ?? []).filter((f) => f.kind === 'statue'));
  const lost = hintless(MAP_DEFS);
  ok(!lost.length, `every statue in the content has its answer said elsewhere (${statues.length} placed)${lost.map((l) => '; ' + l).join('')}`);
  campNights();
  wellAndSpells();
}

/** A well and the six exploration spells, rules of src/game the game and the spell screen say (#978). */
function wellAndSpells(): void {
  const wp = defaultParty(TABLES, makeRng(5)), [w0, w1] = wp.members;
  w0.hp = 1; w1.hp = 0; w1.conditions.push('unconscious');
  const well = (heal: boolean): Extract<Feature, { kind: 'well' }> => ({ kind: 'well', x: 0, y: 0, text: 'A well.', ...(heal ? { heal } : {}) });
  const drank = drinkWell(wp, well(true));
  ok(drank.join(' ') === 'A well. The party drinks and feels restored.' && w0.hp === w0.maxHp && w1.hp === 0, `a healing well makes whole each member not down (${drank.join(' ')})`);
  w0.hp = 1;
  ok(drinkWell(wp, well(false)).join() === 'A well.' && w0.hp === 1, 'a well that does not heal says its words and heals nobody');

  // The spells on a headless game's world, which has the towns a portal needs: each pays, works and says.
  const g = headlessGame(4), w = g.world, mage = g.party.members[0];
  const cast = (id: string, back?: boolean): { line: string; moved: boolean; paid: number } => {
    mage.sp = 50;
    const r = castExplore(w, g.party, 0, id, back);
    return { line: r.lines.join(' '), moved: r.moved, paid: 50 - mage.sp };
  };
  const by = (id: string, then: string): string => `${mage.name} casts ${spell(TABLES.spells, id).name}${then}`;
  const lit = cast('light');
  ok(lit.line === by('light', '. The way ahead is lit.') && w.state.light === 200 && !lit.moved && lit.paid === spell(TABLES.spells, 'light').sp, `Light lights the way (${lit.line})`);
  const eye = cast('wizard_eye'), dark: string[] = [];
  for (let dy = -6; dy <= 6; dy++) for (let dx = -6; dx <= 6; dx++) { const x = w.state.x + dx, y = w.state.y + dy; if (w.map.inBounds(x, y) && !w.explored(x, y)) dark.push(`${x},${y}`); }
  ok(eye.line === by('wizard_eye', '. The map fills in around you.') && !dark.length && eye.paid === spell(TABLES.spells, 'wizard_eye').sp, `Wizard Eye fills in the map six squares round (${eye.line})`);
  const refused = cast('waymark');
  ok(refused.line === by('waymark', ', but the mark will not take here.') && !refused.paid && !w.state.mark && !refused.moved, `Waymark will not take in ${w.state.mapId}, a town, and gives its points back (${refused.line})`);
  w.travel('shelf', 16, 4);
  const at = `${w.state.mapId} ${w.state.x},${w.state.y}`, where = (): string => `${w.state.mapId} ${w.state.x},${w.state.y}`;
  const marked = cast('waymark');
  ok(marked.line === by('waymark', '. The ground here is marked.') && `${w.state.mark?.mapId} ${w.state.mark?.x},${w.state.mark?.y}` === at && !marked.moved, `Waymark sets its mark on the Foreland, at ${at} (${marked.line})`);
  const portal = cast('town_portal');
  ok(portal.line === by('town_portal', `. The world folds, and you stand in ${w.map.name}.`) && w.map.kind === 'town' && portal.moved, `Town Portal takes the company to a town, and says it moved (${portal.line})`);
  const home = cast('waymark', true);
  ok(home.line === by('waymark', '. The world folds, and you stand at the mark.') && where() === at && home.moved, `and back to the mark (${home.line})`);
  const walk = cast('walk_water'), float = cast('levitate');
  ok(walk.line === by('walk_water', '. The shallows will bear you a while.') && float.line === by('levitate', '. Your feet leave the ground.') && !!w.state.walk && !!w.state.float && !walk.moved && !float.moved,
    `Walk on Water and Levitate bear the company (${walk.line} ${float.line})`);
  // The points exactly are enough; a party spell cast out of a fight heals by the fight's rule (`castOnParty`), never the dead.
  mage.sp = spell(TABLES.spells, 'light').sp;
  const exact = castExplore(w, g.party, 0, 'light'), left = mage.sp, [, hurt, gone] = g.party.members;
  hurt.conditions = []; hurt.hp = 1; gone.conditions = ['dead']; gone.hp = -2; mage.sp = 50;
  const mend = castExplore(w, g.party, 0, 'mend_all');
  ok(exact.lines.join() === by('light', '. The way ahead is lit.') && !left && mend.lines.join() === by('mend_all', '. The party is healed.') && mage.sp === 50 - spell(TABLES.spells, 'mend_all').sp && hurt.hp > 1 && gone.hp === -2 && !mend.moved,
    `the points exactly cast, and Mending Light heals the company but the dead (${mend.lines.join()})`);
  mage.sp = 0;
  const short = castExplore(w, g.party, 0, 'light');
  ok(short.lines.join() === `${mage.name} lacks the spell points.` && mage.sp === 0 && !short.moved, `a caster short of the points casts nothing (${short.lines.join()})`);
}

/**
 * A camp's nights (#730): a rest where the party stands counts the first night not yet set, once its
 * after holds, as an inn's stay does; the night's own words are said on waking in place of the usual
 * line; a camp with none, a rest off a camp and an inn are as they were.
 */
function campNights(): void {
  const USUAL = 'The party rests. Morning comes.', WORDS = 'She is gone. A boat is out.';
  const [fire, plain, hollow] = CAMPS.features as Extract<Feature, { kind: 'camp' }>[];
  const set = (p: Party): string => ['fx_night1', 'fx_night2', 'fx_quiet'].filter((k) => p.flags[k]).join();
  const camped = (minutes?: number): { world: World; party: Party; at: (f: { x: number; y: number }) => void } => {
    const rng = makeRng(5), party = defaultParty(TABLES, rng);
    party.food = 99;
    const world = new World(TABLES, { camps: new GameMap(CAMPS) }, party, rng);
    if (minutes !== undefined) world.state.minutes = minutes;
    return { world, party, at: (f) => { world.state.x = f.x; world.state.y = f.y; } };
  };

  // A night whose after has not come: the usual rest, nothing set, and not the second night, which
  // waits on nothing, before the first.
  const c = camped();
  c.at(fire);
  for (const m of c.party.members) m.hp = 1;
  let at = c.world.state.minutes, food = c.party.food, woke = restAndWake(c.world, c.party);
  ok(woke === USUAL && set(c.party) === '' && c.world.state.minutes === at + 480 && food > c.party.food && c.party.members.every((m) => m.hp === m.maxHp),
    `a rest at a fire whose first night is not yet due is the usual rest, eight hours and a ration each, and sets no night, the second not before the first (${woke}; set: ${set(c.party) || 'none'})`);
  // Due: the rest is the night.
  c.party.flags.fx_come = 1;
  at = c.world.state.minutes; food = c.party.food;
  woke = restAndWake(c.world, c.party);
  ok(woke === WORDS && set(c.party) === 'fx_night1' && c.world.state.minutes === at + 480 && food > c.party.food,
    `once it is due the rest sets the night and says its lines as one, in place of the usual, eight hours and a ration each as ever (${woke}; set: ${set(c.party)})`);
  woke = restAndWake(c.world, c.party);
  ok(woke === 'Rain on the stones.' && set(c.party) === 'fx_night1,fx_night2', `the next rest counts the second night and not the first again (${woke}; set: ${set(c.party)})`);
  woke = restAndWake(c.world, c.party);
  ok(woke === USUAL && set(c.party) === 'fx_night1,fx_night2', `and with every night set a rest is the usual rest (${woke})`);

  // As it was: a camp with no nights, and a rest off the fire's square, though its first night is due.
  const d = camped();
  d.party.flags.fx_come = 1;
  d.at(plain);
  ok(restAndWake(d.world, d.party) === USUAL && set(d.party) === '', 'a camp with no nights says the usual line and sets nothing, though another camp\'s first night would be due');
  d.at({ x: fire.x + 1, y: fire.y });
  ok(restAndWake(d.world, d.party) === USUAL && set(d.party) === '', 'nor does a rest beside the fire count its night');
  d.at(hollow);
  ok(restAndWake(d.world, d.party) === USUAL && set(d.party) === 'fx_quiet', 'a night with no words of its own is set and says the usual line');

  // Whatever the hour, and not without the food.
  for (const [hour, minutes] of [['noon', 12 * 60], ['midnight', 0], ['dusk', 18 * 60]] as const) {
    const h = camped(minutes);
    h.party.flags.fx_come = 1; h.at(fire);
    ok(restAndWake(h.world, h.party) === WORDS && set(h.party) === 'fx_night1', `the first night counts at ${hour}`);
  }
  const s = camped();
  s.party.flags.fx_come = 1; s.party.food = 0; s.at(fire);
  at = s.world.state.minutes;
  ok(restAndWake(s.world, s.party) === undefined && set(s.party) === '' && s.world.state.minutes === at, 'without the food nothing is rested and no night is set');

  // Through the game: the offer, declined and taken.
  const g = headlessGame(4);
  g.world = new World(TABLES, { camps: new GameMap(CAMPS) }, g.party, g.rng);
  g.party.food = 99; g.party.flags.fx_come = 1;
  g.world.state.x = fire.x; g.world.state.y = fire.y;
  const start = g.world.state.minutes;
  g.offerRest();
  drive(g, ['down', 'interact']);
  ok(set(g.party) === '' && g.world.state.minutes === start, 'Not now rests nothing and sets nothing');
  const said = g.said;
  g.offerRest();
  drive(g, ['interact']);
  const lines = g.log.slice(g.log.length - (g.said - said));
  ok(lines.includes(WORDS) && !lines.includes(USUAL) && set(g.party) === 'fx_night1' && g.world.state.minutes === start + 480, `Rest at the fire says the night's lines and not the usual (${lines.join(' / ')})`);

  // Kept and recorded: the flag is the party's, saved as any is; the shipped list records it.
  const kept = deserialize(serialize(c.world.state, c.party, 0)).party;
  ok(kept.flags.fx_night1 === 1 && kept.flags.fx_night2 === 1, 'a save keeps the nights as flags');
  const shipped = collect({ ...CONTENT, defs: [CAMPS] }).flags;
  ok(['fx_night1', 'fx_night2', 'fx_quiet'].every((k) => shipped.includes(k)), 'the shipped list records the flags a camp\'s nights set');
  ok(!condFaults({ flag: fxFlag('fx_night1') }, [CAMPS]).length && condFaults({ flag: fxFlag('fx_night9') }, [CAMPS]).length === 1, 'a night\'s flag is one something sets, for a quest or a presence to wait on');
  const wordy = { ...fire, nights: [{ sets: fxFlag('fx_long'), says: ['A night of a great many words, said slowly, with a long breath drawn between each.', 'And another, and a third, until the fire has burnt down to nothing at all.', 'Then the grey comes up over the water and the company wakes, one by one.'] }] };
  ok(!lineFaults(CAMPS).length && lineFaults({ ...CAMPS, features: [wordy] }).length === 1, 'a night whose lines, said as one, take more than three of the log is caught');
  ok(texts([CAMPS]).some((t) => t.text === 'She is gone.' && t.where.includes('fx_night1')), 'and its lines are read with every text, for the font, the spelling and the voice');

  // An inn is as it was: its nights a list of flags, each stay setting the next in order.
  const nights = ['fx_a', 'fx_b'], guests = defaultParty(TABLES, makeRng(1));
  ok(stayNight(guests, nights) === 'fx_a' && stayNight(guests, nights) === 'fx_b' && stayNight(guests, nights) === undefined && stayNight(guests) === undefined && guests.flags.fx_a === 1 && guests.flags.fx_b === 1,
    'an inn\'s stays set its flags one at a time, in order, and a spent list sets none');
  const lodge = MAP_DEFS.find((d) => d.id === 'rime_lodge')?.features?.find((f) => f.kind === 'inn');
  ok(lodge?.kind === 'inn' && !!lodge.nights?.length && lodge.nights.every((n) => typeof n === 'string'), 'and Rime Lodge\'s inn still counts its nights as a list of flags');
}
