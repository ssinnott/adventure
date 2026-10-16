// The pilot's frame (#716): its fair view of the world (Known), and the object on the Game that turns
// on and off, keeps the pace, hands a fight to the bot, closes a box and says why. Its brains (#717 to
// #721) bring tests of their own. Every game here is headless, with an instant pilot unless the pace
// is the point.
import { Game, ExploreScreen } from '../../src/game/game.ts';
import type { Store } from '../../src/game/save.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef, Feature } from '../../src/game/map.ts';
import { EAST } from '../../src/game/types.ts';
import { Pilot, HEARD_MAX } from '../../src/game/pilot/pilot.ts';
import type { Brain } from '../../src/game/pilot/pilot.ts';
import { knownOf } from '../../src/game/pilot/known.ts';
import { CombatScreen } from '../../src/ui/combat.ts';
import { ChoiceScreen } from '../../src/ui/screens.ts';
import { randomParty } from '../../src/ui/create.ts';
import { CLASSES } from '../../src/game/party.ts';
import { ok, headlessGame, drive } from './lib.ts';

/** A headless game with an instant pilot, off. */
const piloted = (seed = 4): Game => {
  const g = headlessGame(seed);
  g.pilot = new Pilot({ instant: true });
  return g;
};
const top = (g: Game): string => g.top.constructor.name;

export function pilot(): void {
  known();
  fair();
  helm();
  pace();
  company();
}

/** What Known gives of the squares, the cells, the features, the maps and the world map. */
function known(): void {
  const g = piloted(), k = knownOf(g), s = { ...g.world.state }, m = g.maps.harrow, list = m.features as Feature[];
  const corners = [[0, 0], [m.width - 1, 0], [0, m.height - 1], [m.width - 1, m.height - 1]];
  const [fx, fy] = corners.sort(([ax, ay], [bx, by]) => Math.hypot(bx - s.x, by - s.y) - Math.hypot(ax - s.x, ay - s.y))[0];
  ok(s.mapId === 'harrow' && k.seen('harrow', s.x, s.y) && !k.seen('harrow', fx, fy), `Known has the start square seen and the far corner of Harrow not (${s.x},${s.y} and ${fx},${fy})`);
  const all = knownOf(Object.assign(piloted(), { pilot: new Pilot({ omniscient: true }) }));
  ok(all.seen('harrow', fx, fy) && !all.seen('harrow', m.width, 0), 'an omniscient pilot has every square seen, and none off the map');

  // A secret door in a fixture map, as tools/tests/movement.ts builds one: the automap inks it a wall.
  const def: MapDef = { id: 'fx_secret', name: 'Secret', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#.S.#', '#####'] };
  g.maps.fx_secret = new GameMap(def);
  g.world.travel('fx_secret', 1, 1, EAST);
  const door = k.cell('fx_secret', 2, 1), floor = k.cell('fx_secret', 1, 1);
  ok(g.maps.fx_secret.at(2, 1).door === 'secret' && door?.solid === 'wall' && door.door === 'none' && !('ch' in door) && floor?.solid === 'none' && !('ch' in floor),
    `a secret door seen reads as a wall, its legend letter gone (${JSON.stringify(door)})`);
  ok(k.cell('harrow', fx, fy) === undefined && all.cell('harrow', fx, fy) !== undefined, 'an unseen square has no cell');
  // An exit not there yet (`after`, #749) is floor to the eye, and an exit once it is.
  const late: MapDef = { id: 'fx_after', name: 'After', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#...#', '#####'], exits: [{ x: 3, y: 1, to: 'harrow', tx: 1, ty: 1, after: { flag: 'fx_ready' } }] };
  g.maps.fx_after = new GameMap(late);
  g.world.travel('fx_after', 1, 1, EAST);
  const none = k.exits('fx_after').length, ground = k.cell('fx_after', 3, 1);
  g.party.flags.fx_ready = 1;
  const there = k.exits('fx_after').map((e) => `${e.x},${e.y} to ${e.to}`).join();
  delete g.party.flags.fx_ready;
  ok(none === 0 && ground?.solid === 'none' && ground.door === 'none' && there === '3,1 to harrow', `an exit not there yet reads as floor, and as an exit once it is (${none} exits, ${JSON.stringify(ground)}; then ${there})`);
  ok(k.visited().includes('harrow') && k.visited().includes('fx_secret') && !k.visited().includes('mill'), `the maps visited are the maps walked (${k.visited().join(', ')})`);

  // Features as the automap marks them: an event never, a spent chest no more.
  g.world.travel('harrow', s.x, s.y);
  const at = { x: g.world.state.x, y: g.world.state.y };
  const added: Feature[] = [
    { kind: 'event', ...at, id: 'fx_event', text: 'A test event.' },
    { kind: 'sign', ...at, text: 'A test sign.' },
    { kind: 'chest', ...at, id: 'fx_chest', gold: 5, items: [] },
  ];
  const here = (): string[] => k.features('harrow').filter((f) => f.x === at.x && f.y === at.y).map((f) => f.kind);
  const base = here().length;
  list.push(...added);
  const before = here().slice(base);
  g.world.markUsed('fx_chest');
  const after = here().slice(base);
  list.splice(list.length - added.length, added.length);
  ok(before.join() === 'sign,chest' && after.join() === 'sign', `features leave out an event, and a chest once it is spent (${before.join()}; then ${after.join()})`);

  ok(!!k.placeOf('thornmark') && !!k.placeOf('harrow') && k.placeOf('no_such_map') === undefined, `placeOf finds Thornmark and Harrow on the world map and no map that is not (${k.placeOf('thornmark')}; ${k.placeOf('harrow')})`);
  // A zone map's id names the outdoors it lies in: every reader takes and gives the outdoors' squares,
  // as the party's own square is reckoned while it stands in the zone.
  g.world.travel('thornmark', 6, 8, 3);
  const z = g.world.zone!, out = g.world.state.mapId, st = g.world.state;
  const squares = [[st.x, st.y], [st.x, st.y - 1], [z.x, z.y], [z.x + z.w - 1, z.y + z.h - 1]];
  ok(z.id === 'thornmark' && out !== z.id && k.seen(z.id, st.x, st.y) && squares.every(([x, y]) => k.seen(z.id, x, y) === k.seen(out, x, y) && JSON.stringify(k.cell(z.id, x, y)) === JSON.stringify(k.cell(out, x, y))),
    `a zone's id reads the outdoors' squares, the party's own among them (${out} ${st.x},${st.y})`);
  // The zone's whole box seen (the test's privilege), so that every feature in it is read back.
  const lit = g.world.ensureMapState(out).explored, width = g.maps[out].width;
  for (let y = z.y; y < z.y + z.h; y++) for (let x = z.x; x < z.x + z.w; x++) { const i = y * width + x; lit[i >> 5] |= 1 << (i & 31); }
  const marks = k.features(z.id);
  ok(marks.length > 0 && marks.every((f) => f.x >= z.x && f.y >= z.y && f.x < z.x + z.w && f.y < z.y + z.h && k.seen(z.id, f.x, f.y) && k.cell(z.id, f.x, f.y)?.terrain === g.maps[out].at(f.x, f.y).terrain),
    `a zone's features are those in its box, each read back on its own square through seen and cell (${marks.map((f) => `${f.kind} ${f.x},${f.y}`).join(', ')})`);
}

/**
 * Known is fair: with every square of every map seen (the test's privilege, as no company could),
 * no statue's riddle or answer and no person's choice, words or crossings come through it, nor any
 * gate's terms on an exit.
 */
function fair(): void {
  const g = piloted();
  for (const id of Object.keys(g.maps)) g.world.ensureMapState(id).explored.fill(-1);
  const k = knownOf(g), known = Object.keys(g.maps).flatMap((id) => k.features(id));
  const written = Object.values(g.maps).flatMap((m) => m.features);
  const listed = (f: Feature): boolean => known.some((q) => q.kind === f.kind && q.x === f.x && q.y === f.y);
  const riddles = written.filter((f) => f.kind === 'statue' && listed(f));
  const asks = written.filter((f) => f.kind === 'npc' && (f.choice || f.passage?.length || f.says?.length) && listed(f));
  const statues = known.flatMap((f) => (f.kind === 'statue' ? [f] : [])), people = known.flatMap((f) => (f.kind === 'npc' ? [f] : []));
  ok(riddles.length > 0 && statues.every((f) => !f.riddle && !f.answer && !Object.keys(f.gift).length),
    `Known.features holds no statue's riddle or answer (${statues.length} statues, ${riddles.length} with a riddle as written)`);
  ok(asks.length > 0 && people.every((f) => f.choice === undefined && f.passage === undefined && f.says === undefined && !f.lines.length),
    `Known.features holds no person's choice, crossings or words (${people.length} people, ${asks.length} with a question, crossings or words as written)`);
  const shops = known.flatMap((f) => (f.kind === 'shop' ? [f] : [])), trainers = known.flatMap((f) => (f.kind === 'trainer' ? [f] : []));
  ok(shops.length > 0 && trainers.length > 0 && shops.every((f) => !f.stock.length) && trainers.every((f) => Number.isNaN(f.maxLevel)),
    `nor a shop's stock or a trainer's top level, which only their menus show (${shops.length} shops, ${trainers.length} trainers)`);
  const gate = (e: object): boolean => ['needFlag', 'shut', 'lifts', 'after', 'blockedText'].some((key) => key in e);
  const exits = Object.keys(g.maps).flatMap((id) => k.exits(id)), gated = Object.values(g.maps).flatMap((m) => m.exits).filter(gate);
  ok(gated.length > 0 && exits.length > 0 && !exits.some(gate) && gated.some((e) => exits.some((q) => q.x === e.x && q.y === e.y)),
    `an exit comes through with where it leads and no gate's terms (${exits.length} exits; ${gated.length} gated as written)`);
  const doors = Object.values(g.maps).flatMap((m) => m.cells.flatMap((c, i) => (c.door === 'secret' ? [k.cell(m.id, i % m.width, Math.floor(i / m.width))] : [])));
  ok(doors.length > 0 && doors.every((c) => !!c && c.door === 'none' && c.solid !== 'none'), `every secret door of every map reads as a wall or as what it is hidden among, never a door (${doors.length})`);

  // On a new game, nothing Known gives of Harrow stands on a square the party has not seen.
  const h = piloted(), hk = knownOf(h), dark = (x: number, y: number): boolean => !h.world.explored(x, y), hm = h.maps.harrow;
  const unseen = { features: hm.features.filter((f) => dark(f.x, f.y)).length, exits: hm.exits.filter((e) => dark(e.x, e.y)).length };
  ok(h.world.state.mapId === 'harrow' && unseen.features > 0 && unseen.exits > 0 && !hk.features('harrow').some((f) => dark(f.x, f.y)) && !hk.exits('harrow').some((e) => dark(e.x, e.y)),
    `on a new game no feature or exit Known gives of Harrow stands on an unseen square (${unseen.features} of ${hm.features.length} features and ${unseen.exits} of ${hm.exits.length} exits unseen)`);
}

/** On and off, the fight handed to the bot, the box closed, the brains asked, a wipe. */
function helm(): void {
  const g = piloted(), p = g.pilot!;
  p.toggle(g);
  ok(p.on && p.heard.includes('The pilot takes the helm.') && g.log.at(-1) === 'The pilot takes the helm.' && p.band()?.tag === 'PILOT 1X', 'toggle takes the helm and says so, the corpus has heard it and the band is up');
  p.why = ['Bound elsewhere.'];
  ok(p.next(g) === null && p.why[0] === 'Nothing to do.', `with no brains, nothing to do (${p.why.join(' / ')})`);
  // The brains are asked in order whatever is on top, and each answers only on its own screen.
  const onMap: Brain = (q) => (q.top instanceof ExploreScreen ? 'forward' : null), onAsk: Brain = (q) => (q.top instanceof ChoiceScreen ? 'cancel' : null);
  p.brains = [onMap, onAsk, () => 'turnLeft'];
  const exploring = p.next(g);
  g.push(new ChoiceScreen('A test?', ['Yes', 'No'], () => undefined));
  const asking = p.next(g);
  g.pop();
  p.brains = [];
  ok(exploring === 'forward' && asking === 'cancel', `the brains are asked in order and the first key given is pressed: on the map the map's brain, on a question the next (${exploring}, ${asking})`);

  g.message('A test of the box.');
  ok(p.heard.at(-1) === 'A test of the box.' && p.next(g) === 'interact', 'a message box is heard as it opens, and closed with Space');
  drive(g, ['interact']);

  g.world.travel('shelf', 16, 4);
  g.fight(['road_rats']);
  const screen = g.top as CombatScreen, handed = p.next(g);
  ok(handed === null && screen.auto, 'a fight on top is handed to the bot: no key, and the screen\'s auto on');
  let ticks = 0;
  for (; g.top === screen && ticks < 60; ticks++) g.update(null);
  ok(g.top !== screen && screen.state.outcome !== 'ongoing', `ticking plays the fight out at once and leaves it, in ${ticks} ticks (${screen.state.outcome}, ${top(g)} on top)`);

  g.fight(['road_rats']);
  const next = g.top as CombatScreen;
  p.next(g);
  p.toggle(g);
  const off = !p.on && !next.auto && g.log.at(-1) === 'You take the helm.';
  p.toggle(g);
  ok(off && p.on && next.auto, 'taking the helm in a fight gives it its keys back, and handing it over gives it the bot');
  g.pop();

  for (let i = 0; i < HEARD_MAX + 5; i++) p.hear(`line ${i}`);
  ok(p.heard.length === HEARD_MAX && p.heard[0] === 'line 5', `the corpus keeps the last ${HEARD_MAX} lines heard`);
  const said = g.said;
  g.newGame(9);
  ok(!p.heard.includes('line 9') && p.heard.length > 0 && p.heard.length === g.said - said, `a new game's company has heard only its own lines (${p.heard.length})`);

  for (const c of g.party.members) c.conditions.push('dead');
  drive(g, ['forward']);
  const fallen = p.band();
  ok(top(g) === 'TitleScreen' && !p.on && p.why[0] === 'The company has fallen.' && fallen?.lines[0] === 'The company has fallen.' && fallen.tag === '',
    `a wipe gives the helm back, and the band says why over the title (${top(g)}: ${fallen?.lines.join(' / ')})`);
  drive(g, ['down']);
  ok(p.band() === null, 'the next key takes that band down');
  const manual = piloted(), m = manual.pilot!;
  m.toggle(manual);
  m.toggle(manual);
  ok(!m.on && m.band() === null, 'P taking the helm back leaves no band up');

  // A load empties the corpus too: a loaded company has heard nothing but its own "Loaded."
  const disk = new Map<string, string>();
  const store: Store = { getItem: (key) => disk.get(key) ?? null, setItem: (key, v) => { disk.set(key, v); }, removeItem: (key) => { disk.delete(key); } };
  const lg = new Game(store);
  lg.input = { textMode: false, drainText: (c) => c };
  lg.pilot = new Pilot({ instant: true });
  lg.newGame(4);
  lg.saveGame();
  lg.pilot.hear('A line from before the load.');
  const loaded = lg.loadGame();
  ok(loaded && lg.pilot.heard.join(' / ') === 'Loaded.', `a load empties the corpus: the company loaded has heard "${lg.pilot.heard.join(' / ')}"`);
}

/** The tempo: an action every 15th tick at 1×, every 8th at 2× and every 4th at 4×; instant, every tick. */
function pace(): void {
  const g = headlessGame(), p = new Pilot();
  g.pilot = p;
  const gap = (tempo: 1 | 2 | 4): number => {
    p.tempo = tempo;
    p.toggle(g);
    g.message('Wait.');
    let n = 1;
    while (p.next(g) !== 'interact' && n < 100) n++;
    drive(g, ['interact']);
    p.toggle(g);
    return n;
  };
  const gaps = [gap(1), gap(2), gap(4)];
  ok(gaps.join() === '15,8,4', `at 1×, 2× and 4× the pilot acts every ${gaps.join(', ')} ticks`);
  const q = piloted().pilot!;
  ok(q.instant && q.next(headlessGame()) === null, 'an instant pilot that is off presses nothing');
}

/** P on the title: a new game on a fresh seed, with a company drawn from that seed alone. */
function company(): void {
  const t = new Game(null);
  t.input = { textMode: false, drainText: (c) => c };
  t.pilot = new Pilot({ instant: true });
  t.pilot.toggle(t);
  ok(top(t) === 'ExploreScreen' && t.pilot.on && t.party.members.length === 6 && t.pilot.heard.includes('The pilot takes the helm.'),
    `P on the title starts a new game with the pilot at the helm (${top(t)}, ${t.party.members.map((c) => c.cls).join(' ')})`);
  const a = randomParty(77), b = randomParty(77), c = randomParty(78);
  const classes = a.members.map((m) => m.cls), hardy = classes.map((k) => CLASSES[k].hpDie);
  ok(JSON.stringify(a) === JSON.stringify(b) && JSON.stringify(a) !== JSON.stringify(c), 'the company is drawn from the seed alone: the same seed draws the same six');
  ok(new Set(classes).size === 6 && classes.some((k) => ['cleric', 'paladin', 'bard', 'druid'].includes(k)) && hardy.every((h, i) => i === 0 || hardy[i - 1] >= h),
    `six classes, a mender among them, the hardiest in front (${classes.join(' ')})`);
  ok([...Array(40).keys()].every((s) => randomParty(s + 1).members.some((m) => ['cleric', 'paladin', 'bard', 'druid'].includes(m.cls))), 'forty seeds draw forty companies, each with a mender');
}
