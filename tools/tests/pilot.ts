// The pilot's frame (#716): its fair view of the world (Known), and the object on the Game that turns
// on and off, keeps the pace, hands a fight to the bot, closes a box and says why; then its brains,
// each with tests of its own: the navigator (#717) and the explorer (#718). Every game here is
// headless, with an instant pilot unless the pace is the point.
import { Game, ExploreScreen } from '../../src/game/game.ts';
import type { Store } from '../../src/game/save.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef, Feature, MapZone } from '../../src/game/map.ts';
import { NORTH, EAST, SOUTH, WEST, FACING_DX, FACING_DY, turnLeft, turnRight } from '../../src/game/types.ts';
import type { Facing } from '../../src/game/types.ts';
import type { Action } from '../../src/input.ts';
import { Pilot, HEARD_MAX, BRAINS } from '../../src/game/pilot/pilot.ts';
import type { Brain } from '../../src/game/pilot/pilot.ts';
import { knownOf } from '../../src/game/pilot/known.ts';
import { routeOn, routeMaps, routeLengths, route } from '../../src/game/pilot/route.ts';
import { frontier, suspects, explore } from '../../src/game/pilot/explore.ts';
import { OUTDOORS } from '../../src/game/outdoors.ts';
import { CombatScreen } from '../../src/ui/combat.ts';
import { ChoiceScreen, InteriorScreen } from '../../src/ui/screens.ts';
import { randomParty } from '../../src/ui/create.ts';
import { CLASSES, RACES, companyLevel } from '../../src/game/party.ts';
import type { RaceId } from '../../src/game/party.ts';
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
  navigator();
  walking();
  explorer();
  exploring();
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
  p.brains = [];
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

/** A fixture map on the game with the party on it, and only `seen` of it seen (the test's privilege): all of it unless named. */
function fixture(g: Game, def: MapDef, [x, y, f]: [number, number, Facing], seen?: readonly (readonly [number, number])[]): GameMap {
  const m = (g.maps[def.id] = new GameMap(def));
  g.world.travel(def.id, x, y, f);
  const bits = g.world.ensureMapState(def.id).explored;
  bits.fill(0);
  for (const [sx, sy] of seen ?? m.cells.map((_, i) => [i % m.width, Math.floor(i / m.width)] as const)) { const i = sy * m.width + sx; bits[i >> 5] |= 1 << (i & 31); }
  return m;
}
/** The squares a route's keys step onto from (x, y) facing f, the last its end. */
function walk(x: number, y: number, f: Facing, keys: readonly Action[]): string[] {
  const out: string[] = [];
  for (const a of keys) {
    if (a === 'turnLeft') f = turnLeft(f);
    else if (a === 'turnRight') f = turnRight(f);
    else { x += FACING_DX[f]; y += FACING_DY[f]; out.push(`${x},${y}`); }
  }
  return out;
}
/** A brain that asks `route` and writes down each key it gives and the why line it gave it with. */
function recorded(keys: Action[], whys: [string, string?][]): Brain {
  return (g, k, p) => { const a = route(g, k, p); if (a) { keys.push(a); whys.push([...p.why]); } return a; };
}

/** The navigator's routes (#717): over seen squares and seen exits, round what Known shows in the way. */
function navigator(): void {
  const g = piloted(), k = knownOf(g);
  ok(BRAINS.includes(route), 'the navigator is among the brains a pilot asks');

  // A corridor with a turn, as tools/tests/movement.ts builds one: from its end, facing away.
  const bend: MapDef = { id: 'fx_bend', name: 'Bend', kind: 'dungeon', start: { x: 1, y: 1, facing: WEST }, rows: ['#####', '#...#', '###.#', '###.#', '#####'] };
  // How many squares of a map `routeLengths` and `routeOn` disagree on, from one square and facing.
  const disagree = (id: string, x: number, y: number, f: Facing): number => {
    const m = g.maps[id], lengths = routeLengths(k, id, x, y, f);
    return m.cells.filter((_, i) => (lengths.get(`${i % m.width},${Math.floor(i / m.width)}`) ?? null) !== (routeOn(k, id, x, y, f, i % m.width, Math.floor(i / m.width))?.length ?? null)).length;
  };
  fixture(g, bend, [1, 1, WEST]);
  const keys = routeOn(k, 'fx_bend', 1, 1, WEST, 3, 3), bendLengths = routeLengths(k, 'fx_bend', 1, 1, WEST), bendOff = disagree('fx_bend', 1, 1, WEST);
  fixture(g, bend, [1, 1, WEST], [[1, 1], [2, 1], [3, 1], [3, 2]]);
  const dark = routeOn(k, 'fx_bend', 1, 1, WEST, 3, 3);
  fixture(g, bend, [1, 1, WEST], [[1, 1], [2, 1], [3, 1], [3, 3]]);
  const gap = routeOn(k, 'fx_bend', 1, 1, WEST, 3, 3);
  ok(keys?.join() === 'turnLeft,turnLeft,forward,forward,turnRight,forward,forward' && dark === null && gap === null,
    `round the bend from its end facing away, and null with the far end unseen or a square on the way (${keys?.join(' ')}; ${dark}; ${gap})`);

  // A ring with a secret door on its short side: a wall to the navigator, though a step goes through it.
  const ring = (id: string, rows: string[]): MapDef => ({ id, name: 'Ring', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows });
  const rows = ['#######', '#..S..#', '#.###.#', '#.....#', '#######'];
  const hidden = fixture(g, ring('fx_ring', rows), [1, 1, EAST]);
  const secret = hidden.at(3, 1).door === 'secret' && hidden.passable(3, 1) === 'ok';
  const round = routeOn(k, 'fx_ring', 1, 1, EAST, 5, 1) ?? [], trod = walk(1, 1, EAST, round);
  fixture(g, ring('fx_sealed', rows.slice(0, 2).concat('#######')), [1, 1, EAST]);
  const sealed = routeOn(k, 'fx_sealed', 1, 1, EAST, 5, 1);
  g.world.travel('fx_ring', 2, 1, EAST);
  const found = g.world.search(), through = routeOn(k, 'fx_ring', 1, 1, EAST, 5, 1);
  ok(secret && trod.at(-1) === '5,1' && !trod.includes('3,1') && sealed === null && found && through?.join() === 'forward,forward,forward,forward',
    `never over a secret door, where passable as written would step through: the long way round (${round.length} keys), none with no way round, and through it once a search has found it (${through?.join(' ')})`);

  // A group the automap marks is gone round; one it does not is not known (a light, so the view goes four deep).
  const yard: MapDef = { id: 'fx_yard', name: 'Yard', kind: 'dungeon', start: { x: 1, y: 1, facing: WEST }, rows: ['#######', '#.....#', '#.###.#', '#.....#', '#######'],
    encounters: [{ id: 'fx_eels', x: 4, y: 1, monsters: ['fen_eel'], roams: false }] };
  g.world.state.light = 50;
  fixture(g, yard, [1, 1, WEST]);
  const behind = k.groups('fx_yard'), blind = routeOn(k, 'fx_yard', 1, 1, WEST, 5, 1);
  g.world.turn('left'); g.world.turn('left');
  const ahead = k.groups('fx_yard'), wary = walk(1, 1, EAST, routeOn(k, 'fx_yard', 1, 1, EAST, 5, 1) ?? []), elsewhere = k.groups('harrow');
  g.world.state.light = 0;
  ok(behind.length === 0 && ahead.map((q) => `${q.x},${q.y}`).join() === '4,1' && elsewhere.length === 0,
    `Known gives a group's square once the automap marks it: none behind the party, one in view, none on another map (${behind.length}; ${JSON.stringify(ahead)}; ${elsewhere.length})`);
  ok(blind?.join() === 'turnLeft,turnLeft,forward,forward,forward,forward' && wary.at(-1) === '5,1' && !wary.includes('4,1'),
    `a route goes round a group the automap marks, and knows nothing of one it does not (${blind?.join(' ')}; then by ${wary.join(' ')})`);

  // An exit short of the end is gone round, since a step onto it leaves the map; at the end it is the way.
  const porch: MapDef = { id: 'fx_porch', name: 'Porch', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#######', '#.....#', '#.###.#', '#.....#', '#######'], exits: [{ x: 3, y: 1, to: 'harrow', tx: 7, ty: 14 }] };
  fixture(g, porch, [1, 1, EAST]);
  const past = walk(1, 1, EAST, routeOn(k, 'fx_porch', 1, 1, EAST, 5, 1) ?? []), onto = routeOn(k, 'fx_porch', 1, 1, EAST, 3, 1);
  ok(past.at(-1) === '5,1' && !past.includes('3,1') && onto?.join() === 'forward,forward', `a route steps onto an exit only at its end (by ${past.join(' ')}; onto it ${onto?.join(' ')})`);
  const porchOff = disagree('fx_porch', 1, 1, EAST), porchLengths = routeLengths(k, 'fx_porch', 1, 1, EAST);
  ok(bendOff === 0 && porchOff === 0 && bendLengths.get('3,3') === 7 && bendLengths.get('1,1') === 0 && porchLengths.get('3,1') === 2 && porchLengths.get('5,1') === 11 && !porchLengths.has('0,0'),
    `routeLengths gives routeOn's length to every square in one search, an exit's square among them, and none to a wall (${bendOff} and ${porchOff} squares differ; the bend's end ${bendLengths.get('3,3')}, the porch's far end ${porchLengths.get('5,1')})`);

  // Water: crossed only by a company with a swimmer, one who has learnt it as well as one born to it (#805).
  const ford: MapDef = { id: 'fx_ford', name: 'Ford', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#.~.#', '#####'] };
  fixture(g, ford, [1, 1, EAST]);
  const was = g.party.members.map((m) => ({ race: m.race, skills: m.skills })), dry = (Object.keys(RACES) as RaceId[]).find((r) => !RACES[r].swim)!;
  for (const m of g.party.members) { m.race = dry; m.skills = []; }
  const wades = routeOn(k, 'fx_ford', 1, 1, EAST, 3, 1);
  g.party.members[0].skills = ['swimmer'];
  const swims = routeOn(k, 'fx_ford', 1, 1, EAST, 3, 1);
  g.party.members.forEach((m, i) => Object.assign(m, was[i]));
  ok(wades === null && swims?.join() === 'forward,forward', `over water only with a swimmer in the company, a learnt one among them (${wades}; ${swims?.join(' ')})`);

  // Maps: Harrow to the keep by the gatehouse's exit, once its square is seen.
  const h = piloted(), hk = knownOf(h), before = routeMaps(hk, 'harrow', 'keep');
  const bits = h.world.ensureMapState('harrow').explored;
  bits[0] |= 1 << 7;
  const after = routeMaps(hk, 'harrow', 'keep');
  ok(before === null && after?.length === 1 && after[0].map === 'harrow' && after[0].exit.to === 'keep' && after[0].exit.x === 7 && after[0].exit.y === 0 && routeMaps(hk, 'harrow', 'harrow')?.length === 0,
    `Harrow to the keep is one exit once the gatehouse square is seen, and no way before (${before}; ${after?.map((s) => `${s.map} ${s.exit.x},${s.exit.y} to ${s.exit.to}`).join()})`);

  // A zone map's id reads the outdoors' squares (#716, decision 6): the same route by either id.
  h.world.travel('thornmark', 6, 8, WEST);
  const [ox, oy] = [h.world.state.x, h.world.state.y], byZone = routeOn(hk, 'thornmark', ox, oy, WEST, ox - 2, oy + 1), byOut = routeOn(hk, h.world.state.mapId, ox, oy, WEST, ox - 2, oy + 1);
  ok(byZone?.join() === 'forward,forward,turnLeft,forward' && byOut?.join() === byZone?.join(),
    `on the outdoors a zone's id routes as the outdoors' does, in the outdoors' squares (${h.world.state.mapId} ${ox},${oy}: ${byZone?.join(' ')})`);
}

/** The navigator as a brain: a goal walked, the map alone on top, a plan made afresh, a block and a goal shut. */
function walking(): void {
  // The issue's walk: a seen square six keys off, four steps up the road, a turn and a step.
  const g = piloted(), p = g.pilot!, keys: Action[] = [], whys: [string, string?][] = [];
  p.toggle(g);
  p.brains = [recorded(keys, whys)];
  p.goal = { map: 'harrow', x: 6, y: 10, name: 'the lane' };
  drive(g, Array(60).fill(null));
  const st = g.world.state;
  ok(st.mapId === 'harrow' && st.x === 6 && st.y === 10 && p.goal === null && keys.join() === 'forward,forward,forward,forward,turnLeft,forward' && whys.every((w) => w[0] === 'Bound for the lane.'),
    `the pilot walks to a seen square six keys off, pressing only forward and the turns, and drops the goal on it (${st.mapId} ${st.x},${st.y}: ${keys.join(' ')})`);

  // With a menu on top the navigator presses nothing and keeps its plan (#716's contract).
  const c = piloted(), cp = c.pilot!, ck = knownOf(c);
  cp.goal = { map: 'harrow', x: 6, y: 10, name: 'the lane' };
  const first = route(c, ck, cp), plan = cp.plan.join();
  c.push(new ChoiceScreen('A test?', ['Yes', 'No'], () => undefined));
  const asked = route(c, ck, cp);
  c.pop();
  ok(first === 'forward' && asked === null && plan.length > 0 && cp.plan.join() === plan && cp.goal !== null, `with a choice on top the navigator gives no key and keeps its plan (${plan})`);

  // A map left mid-route: the plan goes and the next key is planned from where the party stands.
  cp.plan = ['turnRight', 'turnRight', 'turnRight'];
  c.world.travel('keep', 7, 8, SOUTH);
  const fresh = route(c, ck, cp);
  ok(fresh === 'forward' && cp.plan.length === 0 && cp.why[0] === 'Bound for the lane.', `on another map the plan is made afresh: the keep's gate back to Harrow, one step off (${fresh}, then ${cp.plan.join(' ')})`);
  cp.goal = { map: 'mill', x: 1, y: 1, name: 'the mill' };
  const lost = route(c, ck, cp);
  ok(lost === null && cp.goal === null && cp.why[0] === 'No way to the mill that I have seen.', `no way over what is seen: the goal goes, and the why line says so (${cp.why[0]})`);

  // A goal in a zone's own reckoning, walked on the outdoors, its groups put down (the test's privilege) so that none meets the walk.
  const z = piloted(), zp = z.pilot!;
  z.world.travel('thornmark', 6, 8, WEST);
  for (const s of Object.values(z.world.mapState.groups)) s.dead = z.world.state.minutes;
  const zone = z.world.zone!, [zx, zy] = [z.world.state.x - 2, z.world.state.y + 1];
  zp.toggle(z);
  zp.brains = [route];
  zp.goal = { map: 'thornmark', x: zx - zone.x, y: zy - zone.y, name: 'the stile' };
  drive(z, Array(30).fill(null));
  ok(zp.goal === null && z.world.state.x === zx && z.world.state.y === zy && z.world.zone?.id === 'thornmark', `a goal in Thornmark's own squares is walked to on the outdoors (${z.world.state.mapId} ${z.world.state.x},${z.world.state.y})`);

  // A gate it cannot know is learnt by trying it: three blocks and the goal is shut, its square told to the explorer.
  const bar: MapDef = { id: 'fx_bar', name: 'Bar', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['######', '#....#', '####.#', '####.#', '######'], gates: [{ x: 3, y: 1, needFlag: 'fx_never', blockedText: 'The bar is down.' }] };
  const q = piloted(), qp = q.pilot!, pressed: Action[] = [], said: [string, string?][] = [];
  fixture(q, bar, [1, 1, EAST]);
  qp.toggle(q);
  let shut: [string, string?] | null = null;
  const asks = recorded(pressed, said);
  qp.brains = [(a, b, r) => { const key = asks(a, b, r); if (!r.goal && !shut) shut = [...r.why]; return key; }];
  qp.goal = { map: 'fx_bar', x: 4, y: 3, name: 'the far door' };
  drive(q, Array(12).fill(null));
  const told = JSON.stringify(qp.shut), why = shut as [string, string?] | null;
  ok(qp.goal === null && why?.[0] === 'The far door is shut to me.' && told === '[{"map":"fx_bar","x":3,"y":1,"why":"The bar is down."}]' && pressed.join() === 'forward,forward,forward,forward' && q.world.state.x === 2,
    `three blocks on a gate shut the goal and tell its square, with the line said there (${pressed.join(' ')}: ${why?.[0]}; ${told})`);
  ok(said.length === 4 && said[0][1] === undefined && said.slice(2).every((w) => w[1] === 'The bar is down.'), `the why line's second line is the last line said since the goal was set (${said.map((w) => w[1] ?? '-').join(' / ')})`);

  // Taking the helm back drops the goal and its plan; a new game forgets the squares found shut.
  qp.goal = { map: 'fx_bar', x: 4, y: 3, name: 'the far door' };
  qp.plan = ['forward'];
  qp.toggle(q);
  const dropped = qp.goal === null && qp.plan.length === 0;
  q.newGame(5);
  ok(dropped && qp.shut.length === 0, 'taking the helm back drops the goal and its plan, and a new game forgets the squares found shut');

  // A brain asked first that sets an equal goal afresh each tick (#719's and #720's may): the blocks still count to three.
  const r = piloted(), rp = r.pilot!, again: Action[] = [];
  fixture(r, bar, [1, 1, EAST]);
  rp.toggle(r);
  rp.brains = [(_a, _b, s) => { if (!s.shut.length) s.goal = { map: 'fx_bar', x: 4, y: 3, name: 'the far door' }; return null; }, recorded(again, [])];
  drive(r, Array(12).fill(null));
  ok(rp.shut.length === 1 && rp.goal === null && again.join() === 'forward,forward,forward,forward', `an equal goal set afresh each tick is the same goal: three blocks still shut it (${again.join(' ')}; ${rp.shut.length} shut)`);

  // The helm taken back forgets the blocks on a goal: set again, it takes three more to shut.
  const hb = piloted(), hbp = hb.pilot!, door = (): typeof hbp.goal => ({ map: 'fx_bar', x: 4, y: 3, name: 'the far door' });
  fixture(hb, bar, [2, 1, EAST]);
  hbp.toggle(hb);
  hbp.brains = [route];
  hbp.goal = door();
  drive(hb, [null, null, null]);
  hbp.toggle(hb);
  hbp.toggle(hb);
  hbp.goal = door();
  drive(hb, [null]);
  const afresh = hbp.goal !== null && hbp.shut.length === 0;
  drive(hb, [null, null, null]);
  ok(afresh && hbp.goal === null && hbp.shut.length === 1, `the helm taken back forgets the blocks on a goal: set again, it takes three more to shut (${hbp.shut.length} shut)`);

  // A step a fight put back (a flight: World.flee) is no block, as a screen came up since the key and a refused step opens none.
  const fl = piloted(), flp = fl.pilot!, flk = knownOf(fl);
  fixture(fl, { id: 'fx_run', name: 'Run', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#######', '#.....#', '#######'] }, [1, 1, EAST]);
  flp.goal = { map: 'fx_run', x: 5, y: 1, name: 'the end' };
  for (let i = 0; i < 3; i++) {
    fl.update(route(fl, flk, flp));
    fl.push(new ChoiceScreen('A fight?', ['Flee'], () => undefined));
    fl.pop();
    fl.world.state.x = 1;
  }
  const onward = route(fl, flk, flp);
  ok(onward === 'forward' && flp.goal !== null && flp.shut.length === 0, `three steps a fight put back are no blocks: the goal stands and the next key is planned afresh (${onward}; ${flp.shut.length} shut)`);

  // A goal on an exit's square (#720's may be): the step that takes the exit reaches it, and the way back is left alone.
  const e = piloted(), ep = e.pilot!;
  e.maps.fx_room = new GameMap({ id: 'fx_room', name: 'Room', kind: 'dungeon', start: { x: 2, y: 1, facing: EAST }, rows: ['#####', '#...#', '#####'], exits: [{ x: 1, y: 1, to: 'fx_hall', tx: 2, ty: 1, tf: WEST }] });
  e.world.ensureMapState('fx_room').explored.fill(-1);
  fixture(e, { id: 'fx_hall', name: 'Hall', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#...#', '#####'], exits: [{ x: 3, y: 1, to: 'fx_room', tx: 2, ty: 1, tf: EAST }] }, [1, 1, EAST]);
  ep.toggle(e);
  ep.brains = [route];
  ep.goal = { map: 'fx_hall', x: 3, y: 1, name: 'the far door' };
  let crossings = 0;
  for (let i = 0, was = e.world.state.mapId; i < 40; i++) { drive(e, [null]); if (e.world.state.mapId !== was) { crossings++; was = e.world.state.mapId; } }
  ok(ep.goal === null && crossings === 1 && e.world.state.mapId === 'fx_room', `a goal on an exit's square is reached by the step that takes the exit, and the way back is left alone (${crossings} crossings, in ${e.world.state.mapId})`);

  // A business's door (#719's goals): the visit it opens reaches it, and nothing is shut when the party steps back out.
  const v = piloted(), vp = v.pilot!;
  v.world.travel('harrow', 4, 5, NORTH);
  vp.toggle(v);
  vp.brains = [route];
  vp.goal = { map: 'harrow', x: 4, y: 4, name: 'the inn' };
  drive(v, Array(10).fill(null));
  const visiting = v.screens.some((s) => s instanceof InteriorScreen) && vp.goal === null;
  drive(v, ['cancel', 'cancel', 'cancel']);
  drive(v, Array(20).fill(null));
  const vs = v.world.state;
  ok(visiting && vp.goal === null && vp.shut.length === 0 && v.top instanceof ExploreScreen && vs.x === 4 && vs.y === 5,
    `a goal on a business's door is reached by the visit it opens, and nothing is shut when the party steps back out (${top(v)} at ${vs.x},${vs.y}; ${vp.shut.length} shut)`);
}

/** Squares as "x,y", space between. */
const squares = (qs: readonly { x: number; y: number }[]): string => qs.map((q) => `${q.x},${q.y}`).join(' ');
/** The squares of a w by h corner of a map that `keep` holds for: a fixture's seen list. */
function grid(w: number, h: number, keep: (x: number, y: number) => boolean = () => true): [number, number][] {
  const out: [number, number][] = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (keep(x, y)) out.push([x, y]);
  return out;
}

/** The explorer's pieces (#718): the frontier, the walls it suspects, Known's two readers for it (a box and a band) and the outdoors. */
function explorer(): void {
  const g = piloted(), k = knownOf(g), p = g.pilot!, goalOf = (q: Pilot): Pilot['goal'] => q.goal;
  ok(BRAINS.indexOf(explore) === BRAINS.indexOf(route) + 1, 'the explorer is among the brains a pilot asks, next after the navigator');

  // One seen room and a door out: the door's square, and nothing inside the room.
  fixture(g, { id: 'fx_cell', name: 'Cell', kind: 'dungeon', start: { x: 1, y: 2, facing: EAST }, rows: ['########', '#...#..#', '#...D..#', '#...#..#', '########'] }, [1, 2, EAST], grid(5, 5));
  const door = squares(frontier(k, g, 'fx_cell'));
  ok(door === '4,2', `the frontier of one seen room with a door out is the door's square, and nothing inside the room (${door})`);

  // The nearest by the route's length, turns and all: two squares ahead rather than two behind.
  fixture(g, { id: 'fx_reach', name: 'Reach', kind: 'dungeon', start: { x: 4, y: 1, facing: EAST }, rows: ['#########', '#.......#', '#########'] }, [4, 1, EAST], grid(9, 3, (x) => x >= 2 && x <= 6));
  const ends = squares(frontier(k, g, 'fx_reach')), first = explore(g, k, p), aim = goalOf(p);
  p.goal = null;
  ok(ends === '2,1 6,1' && first === 'forward' && aim?.x === 6 && aim.y === 1 && aim.why === 'Looking about Reach.',
    `the explorer goes to the frontier square nearest by the route, two steps ahead before two behind, and looks about (${ends}: ${first} for ${aim?.x},${aim?.y}, "${aim?.why}")`);

  // Water and a chasm at the edge of what is seen: the water with a swimmer in the company, a learnt one among them; the chasm never.
  fixture(g, { id: 'fx_brink', name: 'Brink', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['######', '#.~..#', '#.v..#', '######'] }, [1, 1, EAST], grid(3, 4));
  const was = g.party.members.map((m) => ({ race: m.race, skills: m.skills })), dry = (Object.keys(RACES) as RaceId[]).find((r) => !RACES[r].swim)!;
  for (const m of g.party.members) { m.race = dry; m.skills = []; }
  const ashore = squares(frontier(k, g, 'fx_brink'));
  g.party.members[0].skills = ['swimmer'];
  const afloat = squares(frontier(k, g, 'fx_brink'));
  g.party.members.forEach((m, i) => Object.assign(m, was[i]));
  ok(ashore === '' && afloat === '2,1', `a square under water is the frontier only with a swimmer in the company, a learnt one among them, and a chasm never (${ashore || 'none'}; then ${afloat})`);

  // A seen dead end's end wall is a suspect from either side; not where its far side is unseen, and nothing on an open floor.
  const dead: MapDef = { id: 'fx_dead', name: 'Dead end', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#######', '#...#.#', '#######'] };
  fixture(g, dead, [1, 1, EAST]);
  const walls = suspects(k, 'fx_dead').map((s) => `${s.x},${s.y} ${s.facing}`).join(', ');
  fixture(g, dead, [1, 1, EAST], grid(5, 3));
  const blind = suspects(k, 'fx_dead').length;
  fixture(g, { id: 'fx_floor', name: 'Floor', kind: 'dungeon', start: { x: 2, y: 2, facing: NORTH }, rows: ['#####', '#...#', '#...#', '#...#', '#####'] }, [2, 2, NORTH]);
  const open = suspects(k, 'fx_floor').length;
  ok(walls === `4,1 ${EAST}, 4,1 ${WEST}` && blind === 0 && open === 0, `the end wall of a seen dead end is suspected from each side, nothing with its far side unseen nor on an open floor (${walls}; ${blind}; ${open})`);
  // Before a suspect and facing it, a search, written down; with a choice on top, no key and nothing searched (#716's contract).
  fixture(g, dead, [3, 1, EAST]);
  g.push(new ChoiceScreen('A test?', ['Yes', 'No'], () => undefined));
  const asked = explore(g, k, p), unsearched = p.searched.size;
  g.pop();
  const pressed = explore(g, k, p);
  ok(asked === null && unsearched === 0 && pressed === 'search' && p.searched.has(`fx_dead:4,1,${EAST}`) && p.why[0] === 'Searching the wall.',
    `facing a suspect the explorer searches it and writes it down, and with a choice on top gives no key (${asked}; then ${pressed}: ${[...p.searched].join(' ')})`);

  // Known's box: a zone's box on the outdoors as the world map draws it, and a map's extent; nothing else of either.
  const downs = g.maps[OUTDOORS].zones.find((z) => z.id === 'downs_e3')!, box = JSON.stringify(k.box('downs_e3')), whole = JSON.stringify(k.box('harrow'));
  ok(box === JSON.stringify({ x: downs.x, y: downs.y, w: downs.w, h: downs.h }) && whole === '{"x":0,"y":0,"w":16,"h":16}' && k.box('no_such_map') === undefined,
    `Known.box gives a zone's box in the outdoors' squares and a map's extent, its bounds alone (${box}; ${whole})`);
  // Known's band: a zone's once the party has set foot in it, as the almanac shows it there; a map's once visited.
  const unwalked = Object.values(g.maps).find((m) => m.def.band && !k.visited().includes(m.id))!;
  const before = k.band('downs_e3'), town = k.band('harrow'), far = k.band(unwalked.id);
  const foot = grid(downs.w, downs.h).map(([x, y]) => [downs.x + x, downs.y + y]).find(([x, y]) => g.maps[OUTDOORS].passable(x, y) === 'ok')!;
  g.world.travel(OUTDOORS, foot[0], foot[1], NORTH);
  const after = k.band('downs_e3');
  ok(!!downs.band && before === undefined && JSON.stringify(after) === JSON.stringify(downs.band) && JSON.stringify(town) === JSON.stringify(g.maps.harrow.def.band) && far === undefined,
    `a zone's band is known once the party has set foot in it, a map's once visited, and neither before (the Downs ${before ?? 'unknown'}, then ${after}; Helmstow ${town}; ${unwalked.id} ${far ?? 'unknown'})`);

  // The band rule: a zone whose band starts above the company's level and one is not explored, unless it is the zone preferred.
  const level = companyLevel(g.party), refused = explore(g, k, p), said = p.why[0];
  p.prefer = 'downs_e3';
  const preferred = explore(g, k, p), bound = goalOf(p);
  ok(downs.band![0] > level + 1 && refused === null && said === 'Callow Downs is too hard for us yet.' && preferred !== null && bound?.map === OUTDOORS && g.maps[OUTDOORS].zoneAt(bound.x, bound.y)?.id === 'downs_e3',
    `a zone too hard for the company is not explored (level ${level}: ${said}), and is when it is the zone preferred (${preferred} for ${bound?.x},${bound?.y})`);

  // On the outdoors, in its own squares: the party's zone bounds the frontier, by either id (#716, decision 6).
  const o = piloted(), ko = knownOf(o), op = o.pilot!, out = o.maps[OUTDOORS], shelf = out.zones.find((z) => z.id === 'shelf')!, f2 = out.zones.find((z) => z.id === 'downs_f2')!;
  const into = (b: MapZone) => (q: { x: number; y: number }): boolean => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
    const x = q.x + dx, y = q.y + dy;
    return x >= b.x && y >= b.y && x < b.x + b.w && y < b.y + b.h && !ko.seen(OUTDOORS, x, y);
  });
  o.world.travel('shelf', 16, 4, SOUTH);
  const mine = frontier(ko, o, OUTDOORS), named = frontier(ko, o, 'shelf');
  ok(o.world.zone?.id === 'shelf' && mine.length > 0 && squares(mine) === squares(named) && mine.every((q) => ko.seen(OUTDOORS, q.x, q.y) && into(shelf)(q)),
    `on the outdoors the frontier is the party's zone's by either id, in the outdoors' squares: each seen, an unseen square beside it in the zone's box (${mine.length} squares)`);
  // At the Foreland's west edge, the Downs beyond: the nearest square into the Foreland, or into the Downs once they are preferred.
  let wy = shelf.y;
  while (wy < shelf.y + shelf.h && (out.passable(shelf.x + 1, wy) !== 'ok' || out.passable(shelf.x, wy) !== 'ok')) wy++;
  o.world.travel(OUTDOORS, shelf.x + 1, wy, WEST);
  const plain = explore(o, ko, op), home = goalOf(op);
  op.goal = null;
  op.prefer = 'downs_f2';
  const lean = explore(o, ko, op), away = goalOf(op);
  ok(plain !== null && lean !== null && !!home && !!away && into(shelf)(home) && into(f2)(away) && !into(f2)(home) && away.map === OUTDOORS && home.why === 'Looking about the Foreland.',
    `on the Foreland's edge the explorer looks into the Foreland, and into the Downs once they are preferred (${home?.x},${home?.y}, "${home?.why}"; then ${away?.x},${away?.y}, on ${away?.map})`);
  op.goal = null;
  op.prefer = 'thornmark';
  const none = explore(o, ko, op);
  ok(none === null && op.why[0] === 'No way to Thornmark that I have seen.', `a zone preferred that nothing has been seen of has no way to it (${op.why[0]})`);
}

/** The explorer as a brain: Helmstow walked out, a secret door searched for and found, and the ways found shut tried again. */
function exploring(): void {
  // 3000 instant ticks on Harrow with the navigator and the explorer alone.
  const g = piloted(), p = g.pilot!, m = g.maps.harrow, whys = new Set<string>();
  p.toggle(g);
  p.brains = [route, explore];
  let ticks = 0;
  for (; ticks < 3000; ticks++) { drive(g, [null]); whys.add(p.why[0]); }
  // The map as written, compared with what is seen: the test's privilege, never the pilot's. Every square
  // `passable` lets the company onto that a walk from the start reaches without a locked or a secret
  // door must be seen; the rest are named, each with its reason, rather than the check loosened.
  const start = m.def.start, reached = new Set<string>([`${start.x},${start.y}`]), queue = [[start.x, start.y]];
  const exits = new Set(m.exits.map((e) => `${e.x},${e.y}`));
  for (let i = 0; i < queue.length; i++) {
    const [x, y] = queue[i];
    if (exits.has(`${x},${y}`)) continue;
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (reached.has(`${nx},${ny}`) || m.passable(nx, ny) !== 'ok' || m.at(nx, ny).door === 'secret') continue;
      reached.add(`${nx},${ny}`);
      queue.push([nx, ny]);
    }
  }
  const passable = grid(m.width, m.height, (x, y) => m.passable(x, y) === 'ok' || m.passable(x, y) === 'locked'), door = (x: number, y: number): string => m.at(x, y).door;
  const unseen = passable.filter(([x, y]) => reached.has(`${x},${y}`) && !g.world.explored(x, y)).map(([x, y]) => `${x},${y}`);
  const behind = passable.filter(([x, y]) => !reached.has(`${x},${y}`)).map(([x, y]) => `${x},${y} (${door(x, y) === 'locked' || door(x, y) === 'secret' ? `a ${door(x, y)} door` : 'behind a locked or a secret door'})`);
  ok(g.world.state.mapId === 'harrow' && reached.size > 100 && unseen.length === 0,
    `3000 ticks of the navigator and the explorer leave every passable square of Helmstow seen (${reached.size} reached as written; ${unseen.length} unseen: ${unseen.join(' ') || 'none'}; expected unseen: ${behind.join(', ') || 'none'})`);
  ok(p.on && whys.has('Looking about Helmstow.') && p.why[0] === 'Helmstow is walked out.', `the why line looks about Helmstow, and then says it is walked out (${[...whys].join(' / ')})`);

  // A secret door at the end of a dead end, the far side walked to the long way round: searched and found within 400 ticks.
  const ring: MapDef = { id: 'fx_hidden', name: 'Hidden', kind: 'dungeon', start: { x: 5, y: 3, facing: WEST }, rows: ['#######', '#..S..#', '#.###.#', '#.....#', '#######'] };
  const hunt = (search: boolean): { s: Game; at: number; said: Set<string> } => {
    const s = piloted(), sp = s.pilot!, said = new Set<string>();
    fixture(s, ring, [5, 3, WEST], []);
    s.world.reveal();
    sp.toggle(s);
    sp.brains = [route, (a, b, c) => { const key = explore(a, b, c); return key === 'search' && !search ? null : key; }];
    let at = 0;
    for (; at < 400 && s.maps.fx_hidden.at(3, 1).door === 'secret'; at++) { drive(s, [null]); said.add(sp.why[0]); }
    return { s, at, said };
  };
  const found = hunt(true), sp = found.s.pilot!, missed = hunt(false);
  ok(found.s.maps.fx_hidden.at(3, 1).door === 'door' && found.at < 400 && found.said.has('Searching the wall.') && [...sp.searched].some((w) => w.startsWith('fx_hidden:3,1,')),
    `the pilot walks the ring, searches the wall at the dead end's end and finds the door, in ${found.at} ticks (${[...sp.searched].join(' ')})`);
  ok(missed.s.maps.fx_hidden.at(3, 1).door === 'secret' && missed.s.pilot!.why[0] === 'Hidden is walked out.', `with no search pressed the door stays a wall and the ring is walked out (${missed.s.pilot!.why[0]})`);
  sp.prefer = 'fx_hidden';
  found.s.newGame(5);
  ok(sp.searched.size === 0 && sp.prefer === null, 'a new game forgets the walls searched and the map preferred');

  // A gate learnt by trying it: shut at the third block, gone round, tried again only once a flag has been set since.
  const bar: MapDef = { id: 'fx_gate', name: 'Gatehouse', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['######', '#....#', '####.#', '####.#', '######'], gates: [{ x: 3, y: 1, needFlag: 'fx_lift', blockedText: 'The bar is down.' }] };
  const q = piloted(), qp = q.pilot!, qk = knownOf(q), downs = (): number => q.log.filter((l) => l === 'The bar is down.').length;
  fixture(q, bar, [1, 1, EAST], grid(4, 5));
  qp.toggle(q);
  qp.brains = [route, explore];
  drive(q, Array(40).fill(null));
  const held = JSON.stringify(qp.shut), stuck = qp.why[0], blocks = downs(), round = routeOn(qk, 'fx_gate', 2, 1, EAST, 3, 1, qp.shut), straight = routeOn(qk, 'fx_gate', 2, 1, EAST, 3, 1);
  ok(blocks === 3 && held === '[{"map":"fx_gate","x":3,"y":1,"why":"The bar is down."}]' && stuck === 'Gatehouse is walked out.' && !q.world.explored(4, 3) && round === null && straight?.join() === 'forward',
    `a gate tried three times is shut, gone round and not tried again while no flag is set (${blocks} blocks in 40 ticks; ${held}; ${stuck})`);
  q.party.flags.fx_lift = 1;
  drive(q, Array(40).fill(null));
  ok(qp.shut.length === 0 && downs() === 3 && q.world.explored(4, 3), `once a flag is set the gate is tried again, and gone through (${qp.shut.length} shut; ${q.world.state.x},${q.world.state.y})`);

  // A locked door found shut (the navigator files none: it routes into none without a key): tried again once a key is carried.
  const l = piloted(), lp = l.pilot!;
  fixture(l, { id: 'fx_lock', name: 'Lockup', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#######', '#..L..#', '#######'] }, [1, 1, EAST]);
  lp.toggle(l);
  lp.brains = [route, explore];
  lp.shut.push({ map: 'fx_lock', x: 3, y: 1, why: 'Locked. A key would open it.' });
  drive(l, Array(20).fill(null));
  const kept = l.maps.fx_lock.at(3, 1).door === 'locked' && lp.shut.length === 1 && l.world.state.x === 1;
  l.party.bag.push('key_iron');
  drive(l, Array(20).fill(null));
  ok(kept && l.maps.fx_lock.at(3, 1).door === 'door' && lp.shut.length === 0 && l.world.state.x === 3, `a locked door found shut is left until a key is carried, then opened (${l.maps.fx_lock.at(3, 1).door}, the party at ${l.world.state.x},${l.world.state.y})`);
}
