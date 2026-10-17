// The pilot's frame (#716): its fair view of the world (Known), and the object on the Game that turns
// on and off, keeps the pace, hands a fight to the bot, closes a box and says why; then its brains,
// each with tests of its own: the navigator (#717), the explorer (#718) and the quartermaster (#719),
// with the memory of what a menu has shown. Every game here is headless, with an instant pilot unless
// the pace is the point.
import { readdirSync, readFileSync } from 'node:fs';
import { Game, ExploreScreen, ATTRACT_HOLD } from '../../src/game/game.ts';
import { hasSave } from '../../src/game/save.ts';
import type { Store } from '../../src/game/save.ts';
import { freshSeed } from '../../src/lib/engine/rng.ts';
import { TitleScreen, IDLE_TICKS } from '../../src/ui/title.ts';
import { RiddleScreen } from '../../src/ui/riddle.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef, Feature, MapZone } from '../../src/game/map.ts';
import { NORTH, EAST, SOUTH, WEST, FACING_DX, FACING_DY, turnLeft, turnRight } from '../../src/game/types.ts';
import type { Facing } from '../../src/game/types.ts';
import type { Action } from '../../src/input.ts';
import { Pilot, HEARD_MAX, BRAINS, STUCK_TICKS, wait } from '../../src/game/pilot/pilot.ts';
import type { Brain } from '../../src/game/pilot/pilot.ts';
import { knownOf } from '../../src/game/pilot/known.ts';
import type { Known } from '../../src/game/pilot/known.ts';
import { routeOn, routeMaps, routeLengths, route } from '../../src/game/pilot/route.ts';
import { frontier, suspects, explore } from '../../src/game/pilot/explore.ts';
import { OUTDOORS } from '../../src/game/outdoors.ts';
import { CombatScreen } from '../../src/ui/combat.ts';
import { ChoiceScreen, InteriorScreen } from '../../src/ui/screens.ts';
import { randomParty } from '../../src/ui/create.ts';
import { CLASSES, RACES, companyLevel } from '../../src/game/party.ts';
import type { RaceId } from '../../src/game/party.ts';
import { ok, headlessGame, drive } from './lib.ts';
import { keep, need, needs, better, reserve, spare } from '../../src/game/pilot/keep.ts';
import type { Need } from '../../src/game/pilot/keep.ts';
import { companyAt } from '../harness.ts';
import { restRefused } from '../../src/game/wilds.ts';
import { hasCondition, xpForLevel, weaponOf, armorClass, templePrice } from '../../src/game/party.ts';
import type { Party } from '../../src/game/party.ts';
import { item, hits } from '../../src/game/items.ts';
import { ITEMS } from '../../src/content/index.ts';
import { optionParts } from '../../src/ui/draw.ts';
import { chooseAim, aims, LOST_MINUTES } from '../../src/game/pilot/aims.ts';
import { questLog, goalMap } from '../../src/game/quests.ts';
import { THE_QUEST, MAP_DEFS } from '../../src/content/index.ts';
import { homeMap } from '../../src/game/atlas.ts';
import { levelUp } from '../../src/game/party.ts';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { talk, pick, NEAR } from '../../src/game/pilot/talk.ts';
import { ENDINGS } from '../../src/content/endings.ts';
import { PRESTIGE_LEVELS, guildFlag } from '../../src/game/party.ts';
import { mustRest, botTurn, asSeen, asWritten } from '../../src/game/bot.ts';
import type { Sees } from '../../src/game/bot.ts';
import { weary, caster, FOOD_RESTS } from '../../src/game/pilot/keep.ts';
import { searches } from '../../src/game/pilot/route.ts';
import { holds } from '../../src/game/quests.ts';
import { pilotRun } from '../walk.ts';
import { startCombat, currentTurn, monsterAct } from '../../src/game/combat.ts';
import { answers, TRIES, NO_ANSWER } from '../../src/game/pilot/talk.ts';
import { EndingScreen } from '../../src/ui/ending.ts';
import { MessageScreen } from '../../src/ui/screens.ts';
import { CHOICE_TWO, CHOICE_THREE, VASK_FALLEN, VOICE_WHOLE } from '../../src/content/areas/hearth/maps/core.ts';

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
  omniscient();
  helm();
  pace();
  company();
  attract();
  navigator();
  walking();
  explorer();
  exploring();
  shown();
  quartermaster();
  together();
  strategist();
  talking();
  survives();
  riddles();
}

/** A headless game whose company Vask has hired: walked onto his door by the test (its privilege) and his words closed. */
function hiredGame(): Game {
  const g = piloted();
  g.world.travel('keep', 7, 5, NORTH);
  drive(g, ['forward', 'interact']);
  return g;
}

/**
 * The strategist (#720): the journal's goal and its map, read once shown; the quest aim, the level
 * aim, the lost rule and the band rule; and the navigator's door, gone round on the way.
 */
function strategist(): void {
  // Known gives a goal's map only once the journal shows the goal: none before the hire, and then the shown goal's alone.
  const fresh = piloted(), before = knownOf(fresh).goals(), first = chooseAim(fresh, knownOf(fresh), fresh.pilot!);
  const g = hiredGame(), k = knownOf(g), p = g.pilot!, shelf = THE_QUEST.chapters[0];
  const view = questLog(g.world.state, g.party).find((v) => v.def === THE_QUEST)!, goals = k.goals();
  const told = goals.flatMap((q) => q.map ?? []), unsaid = shelf.goals.map((q) => q.at).filter((m) => m !== goalMap(view));
  ok(before.length === 0 && first?.kind === 'explore' && first.map === 'harrow' && !!g.party.flags.q_ashcombe && goals.length === 1 && told[0] === goalMap(view) && unsaid.length > 0 && unsaid.every((m) => !told.includes(m)),
    `Known gives the journal's goal and its map once shown, and no map of a goal not shown (before the hire ${before.length} goals, the aim ${first?.kind} ${first?.kind === 'explore' ? first.map : ''}; then ${told.join()}, not ${[...new Set(unsaid)].join()})`);

  // The quest aim on a new game hired: the one quest's goal, on the first chapter's map.
  const aim = chooseAim(g, k, p);
  ok(aim?.kind === 'quest' && aim.quest === THE_QUEST.id && aim.map === goalMap(view) && aim.text === view.goal && shelf.goals.some((q) => q.at === aim.map && q.text === aim.text),
    `chooseAim on a new game hired is the one quest's goal on the first chapter's map (${JSON.stringify(aim)})`);

  // The level aim: at level 1, the goal under the Grove, with Thornmark's band known by setting foot there.
  const lv = piloted(), lk = knownOf(lv), out = lv.maps[OUTDOORS];
  lv.party.flags.q_grove = 1;
  const groveGoal = lk.goals().find((q) => q.quest === THE_QUEST.id)!, home = homeMap(MAP_DEFS, groveGoal.map ?? '')?.id, thorn = out.zones.find((z) => z.id === home)!;
  lv.world.travel('shelf', 16, 5, SOUTH);
  lv.world.travel('thornmark', thorn.w >> 1, thorn.h >> 1, NORTH);
  const level = chooseAim(lv, lk, lv.pilot!), easy = level?.kind === 'level' ? lk.band(level.zone) : undefined;
  ok(companyLevel(lv.party) === 1 && home === 'thornmark' && level?.kind === 'level' && !!easy && easy[0] <= 1 && level.to === thorn.band![0] - 1,
    `at level 1, a goal in Thornmark (${groveGoal.map}, its zone's band ${thorn.band?.join('-')}) gives way to levelling where the band starts at 1 (${JSON.stringify(level)}, its band ${easy?.join('-')})`);

  // The lost rule: three days on one goal and it is given up, and not a minute sooner; a level gained, it is tried again.
  const lg = hiredGame(), lp = lg.pilot!;
  lp.brains = [aims];
  lp.toggle(lg);
  drive(lg, [null]);
  const set = lp.aim, since = lp.aimSince, said = (from: number, start: string): string | undefined => (lg.said > from ? lg.log.slice(-(lg.said - from)).find((l) => l.startsWith(start)) : undefined);
  lg.world.advance(since + 3 * 24 * 60 - 1 - lg.world.state.minutes);
  let from = lg.said;
  drive(lg, [null]);
  const early = said(from, 'Lost in'), still = lp.aim;
  lg.world.advance(1);
  from = lg.said;
  drive(lg, [null]);
  const lostLine = said(from, 'Lost in'), cleared = lp.aim, given = [...lp.lost];
  const elder = lg.party.members[0];
  elder.xp = xpForLevel(elder.level + 1);
  levelUp(elder, makeRng(4));
  drive(lg, [null]);
  ok(set?.kind === 'quest' && since > 0 && early === undefined && still === set && lostLine === 'Lost in the Foreland: three days, and no way on.' && cleared === null && given.length === 1 && given[0] === set.text
    && lp.aim?.kind === 'quest' && lp.aim.text === set.text && lp.lost.size === 0,
    `three days on one goal, and not a minute less: the lost line, the aim cleared and the goal given up; a member's level gained, the goal is tried again (a minute short: ${early ?? 'nothing'}; then ${lostLine}; cleared ${cleared}; then ${JSON.stringify(lp.aim)})`);

  // A level aim's three days with no level gained: the zone given up and the land walked; a flag set, it is tried again.
  const vg = piloted(), vp = vg.pilot!;
  vg.party.flags.q_grove = 1;
  vg.world.travel('shelf', 16, 5, SOUTH);
  vg.world.travel('thornmark', thorn.w >> 1, thorn.h >> 1, NORTH);
  vp.brains = [aims];
  vp.toggle(vg);
  drive(vg, [null]);
  const levelling = vp.aim, vSince = vp.aimSince;
  vg.world.advance(vSince + 3 * 24 * 60 - vg.world.state.minutes);
  const vFrom = vg.said;
  drive(vg, [null]);
  const vLine = vg.said > vFrom ? vg.log.slice(-(vg.said - vFrom)).find((l) => l.startsWith('Three days in')) : undefined, vCleared = vp.aim, vLost = [...vp.lost];
  drive(vg, [null]);
  const walking = vp.aim;
  vg.party.flags.fx_set = 1;
  drive(vg, [null]);
  delete vg.party.flags.fx_set;
  ok(levelling?.kind === 'level' && levelling.zone === 'shelf' && vLine === 'Three days in the Foreland, and no stronger.' && vCleared === null && vLost.join() === 'level:shelf'
    && walking?.kind !== 'level' && vp.aim?.kind === 'level' && vp.aim.zone === 'shelf' && vp.lost.size === 0,
    `three days levelling with no level gained: the zone given up and the land walked; a flag set, it is levelled in again (${vLine}; ${vLost.join()}; then ${JSON.stringify(walking)}; then ${JSON.stringify(vp.aim)})`);

  // Walked out, the place is walked again end to end, but never onto a person: a meeting is talk's (#721).
  const wg = piloted(), wp = wg.pilot!;
  const hall: MapDef = { id: 'fx_hall', name: 'The Hall', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#######', '#.....#', '#######'],
    features: [{ kind: 'npc', x: 5, y: 1, name: 'A stranger', lines: ['Hm.'] }] };
  fixture(wg, hall, [1, 1, EAST]);
  wp.brains = [aims];
  wp.toggle(wg);
  wp.aim = { kind: 'quest', quest: 'fx_hall', map: 'fx_hall', text: '' };
  wp.aimGoal = '';
  wp.aimSince = wg.world.state.minutes;
  drive(wg, [null]);
  const again = ((q: Pilot): Pilot['goal'] => q.goal)(wp);
  ok(again?.map === 'fx_hall' && again.x === 4 && again.y === 1 && wp.why[0] === 'Searching the Hall again.',
    `walked out, the hall is walked again to its far end, but not onto the stranger who stands there (${again?.x},${again?.y}; "${wp.why[0]}")`);

  // The band rule: over the line into Thornmark at level 1, the aim elsewhere: back to the square before it.
  const bg = piloted(), bp = bg.pilot!, shelfBox = bg.maps[OUTDOORS].zones.find((z) => z.id === 'shelf')!;
  let by = shelfBox.y;
  const edge = shelfBox.x + shelfBox.w - 1, pass = (x: number, y: number): boolean => bg.maps[OUTDOORS].passable(x, y) === 'ok';
  while (by < shelfBox.y + shelfBox.h && !(pass(edge, by) && pass(edge + 1, by) && pass(edge - 1, by))) by++;
  bg.world.travel(OUTDOORS, edge, by, EAST);
  bp.brains = [aims];
  bp.toggle(bg);
  bp.aim = { kind: 'explore', map: 'shelf' };
  bp.goal = { map: OUTDOORS, x: edge, y: by, name: 'here', reason: 'the test' };
  drive(bg, [null]);
  bp.goal = null;
  drive(bg, ['forward']);
  const crossed = bg.world.zone?.id;
  drive(bg, [null]);
  const backTo = ((q: Pilot): Pilot['goal'] => q.goal)(bp);
  ok(crossed === 'thornmark' && bp.why[0] === 'Too strong for us yet: back.' && backTo?.x === edge && backTo.y === by && backTo.map === OUTDOORS,
    `over the line into Thornmark at level 1, the aim the Foreland's: back to the square before the line (${crossed}; "${bp.why[0]}"; to ${backTo?.x},${backTo?.y})`);
  // Once a crossing: over the same line again with nothing gained since, it goes on, as a route that clips a corner would.
  bg.world.travel(OUTDOORS, edge, by, EAST);
  bp.goal = { map: OUTDOORS, x: edge, y: by, name: 'here', reason: 'the test' };
  drive(bg, [null]);
  bp.goal = null;
  drive(bg, ['forward']);
  const twice = bg.world.zone?.id;
  drive(bg, [null]);
  ok(twice === 'thornmark' && bp.why[0] !== 'Too strong for us yet: back.',
    `over the same line a second time with no level or flag gained, it is not turned back again ("${bp.why[0]}")`);

  // The navigator goes round a business's door on the way, and ends on one: a visit puts the party back before it.
  const dg = piloted(), dk = knownOf(dg);
  const shopDoor: MapDef = { id: 'fx_door', name: 'Door', kind: 'town', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#...#', '#.#.#', '#...#', '#####'],
    features: [{ kind: 'shop', x: 2, y: 1, name: 'A Stall', interior: 'harrow_provisioner', stock: [] }] };
  fixture(dg, shopDoor, [1, 1, EAST]);
  const round = routeOn(dk, 'fx_door', 1, 1, EAST, 3, 1), into = routeOn(dk, 'fx_door', 1, 1, EAST, 2, 1);
  ok(!!round && !walk(1, 1, EAST, round).includes('2,1') && walk(1, 1, EAST, round).at(-1) === '3,1' && into?.join() === 'forward',
    `a route goes round a business's door and ends on one (${round && walk(1, 1, EAST, round).join(' ')}; ${into?.join()})`);
}

/**
 * The three brains together (#718, #719): on Harrow, a hurt company with gold and no rations finds
 * the inn by looking about, takes a room, and walks on, with no loop, in 400 instant ticks.
 */
function together(): void {
  const g = piloted(), p = g.pilot!, said = new Set<string>(), stood = new Set<string>();
  g.party.gold = 100;
  g.party.food = 0;
  for (const c of g.party.members) c.hp = Math.max(1, Math.round(c.maxHp / 4));
  p.toggle(g);
  p.brains = [keep, route, explore];
  let healed = -1, seenThen = 0, then = '';
  for (let t = 0; t < 400; t++) {
    drive(g, [null]);
    const st = g.world.state;
    said.add(p.why[0]);
    stood.add(`${st.x},${st.y}`);
    if (healed < 0 && g.party.members.every((m) => m.hp === m.maxHp)) { healed = t; seenThen = knownOf(g).seenCount('harrow'); then = `${st.x},${st.y}`; }
  }
  const st = g.world.state, seenNow = knownOf(g).seenCount('harrow'), keeper = [...said].filter((w) => w !== 'Nothing to do.' && !w.startsWith('Looking about') && !w.endsWith('walked out.'));
  ok(healed >= 0 && seenNow > seenThen && `${st.x},${st.y}` !== then && said.has('Looking about Helmstow.') && keeper.length > 0 && st.mapId === 'harrow',
    `the quartermaster, the navigator and the explorer together: a hurt company with gold looks about, takes a room and walks on (healed at tick ${healed} at ${then}; ${seenThen} then ${seenNow} squares seen; ${stood.size} squares stood on; ${[...said].join(' / ')})`);
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

/**
 * The headless run's omniscient flag (#723): off by default and never set by the game; on, a secret
 * door is a door to Known, the secret doors as written come through (`secrets`, a zone's in the
 * outdoors' squares) and the explorer suspects them and nothing else. A fair pilot is told of none.
 */
function omniscient(): void {
  const main = readFileSync(new URL('../../src/main.ts', import.meta.url), 'utf8');
  const setters = (readdirSync(new URL('../../src/', import.meta.url), { recursive: true }) as string[]).filter((f) => f.endsWith('.ts') && /omniscient: *true/.test(readFileSync(new URL(`../../src/${f}`, import.meta.url), 'utf8')));
  ok(!new Pilot().omniscient && !new Pilot({ instant: true }).omniscient && !knownOf(piloted()).omniscient && /game\.pilot = new Pilot\(\);/.test(main) && !setters.length,
    `the omniscient flag is off by default, and the game never sets it: src/main.ts builds new Pilot()${setters.length ? `; set in ${setters.join(', ')}` : ''}`);
  // A dead end whose secret door leads on: fair, a wall the explorer suspects among others; omniscient, a door and the one suspect.
  const def: MapDef = { id: 'fx_seer', name: 'Seer', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#######', '#...S.#', '#.#####', '#.#.#.#', '#######'], secrets: [{ x: 4, y: 1, hint: 'fx_none' }] };
  const fair = piloted(), seer = Object.assign(piloted(), { pilot: new Pilot({ instant: true, omniscient: true }) });
  for (const g of [fair, seer]) fixture(g, def, [1, 1, EAST]);
  const fk = knownOf(fair), sk = knownOf(seer), sides = (k: Known): string => suspects(k, 'fx_seer').map((s) => `${s.x},${s.y} ${s.facing}`).sort().join('; ');
  ok(fk.cell('fx_seer', 4, 1)?.solid === 'wall' && fk.cell('fx_seer', 4, 1)?.door === 'none' && sk.cell('fx_seer', 4, 1)?.door === 'door' && sk.cell('fx_seer', 4, 1)?.solid === 'none' && seer.maps.fx_seer.at(4, 1).door === 'secret',
    `on, a secret door reads as a door, and off as a wall (${JSON.stringify(sk.cell('fx_seer', 4, 1))} against ${JSON.stringify(fk.cell('fx_seer', 4, 1))})`);
  ok(!fk.secrets('fx_seer').length && sk.secrets('fx_seer').map((s) => `${s.x},${s.y}`).join() === '4,1' && sides(sk) === `4,1 ${EAST}; 4,1 ${WEST}` && sides(fk) !== sides(sk) && sides(fk).split('; ').length > 2,
    `on, the explorer's suspects are the secret doors as written, from each side (${sides(sk)}); off, the walls with floor both sides (${sides(fk)}), and Known tells of no secret`);
  seer.maps.fx_seer.at(4, 1).door = 'door';
  ok(!knownOf(seer).secrets('fx_seer').length && !suspects(knownOf(seer), 'fx_seer').length, 'a secret door found is no longer told, nor suspected');
  // The outdoors: each zone's secrets, placed where its box lies, are the outdoors' secret doors; a zone's id gives its own.
  const o = Object.assign(headlessGame(), { pilot: new Pilot({ omniscient: true }) }), ok_ = knownOf(o), out = o.maps[OUTDOORS];
  const written = out.zones.reduce((n, z) => n + (MAP_DEFS.find((d) => d.id === z.id)?.secrets?.length ?? 0), 0), told = ok_.secrets(OUTDOORS), downs = ok_.secrets('downs_d2');
  ok(written > 0 && told.length === written && told.every((s) => out.at(s.x, s.y).door === 'secret') && downs.length === 1 && downs.length < told.length && downs.every((s) => out.zoneAt(s.x, s.y)?.id === 'downs_d2') && !knownOf(Object.assign(headlessGame(), { pilot: new Pilot() })).secrets(OUTDOORS).length,
    `on the outdoors the secrets told are every zone's, each a secret door where its zone lies (${told.length} of ${written}; downs_d2's ${downs.length}), and none to a fair pilot`);
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

/**
 * Attract mode (#722): a title left untouched plays a new game on the pilot, with nothing saved, until a
 * key of the viewer's brings the title back; a wipe starts another on a new seed. A viewer's key reaches
 * the game as src/main.ts sends it: the pilot, if it drives, gives the helm back first.
 */
function attract(): void {
  const nothing = (n: number): null[] => Array<null>(n).fill(null);
  const press = (g: Game, a: Action): void => { if (g.pilot?.on) g.pilot.toggle(g); g.update(a); };
  /** The keys the pilots below press, counted. */
  let turned = 0;
  /** The one brain these games' pilots have: a turn on the map. What the brains play is theirs to test; attract mode is the game's. */
  const turning: Brain = (q, _k, p) => { if (!(q.top instanceof ExploreScreen)) return null; p.why = ['Turning about.']; turned++; return 'turnLeft'; };
  /** A game on a new title, over a store if given, with an instant pilot that is off. */
  const onTitle = (store?: Store): Game => {
    const g = store ? new Game(store) : headlessGame();
    g.input = { textMode: false, drainText: (c) => c };
    g.pilot = new Pilot({ instant: true });
    g.pilot.brains = [turning];
    g.newGame(4);
    g.screens = [new TitleScreen(hasSave(g.store))];
    return g;
  };
  const attracted = (): Game => { const g = onTitle(); drive(g, nothing(IDLE_TICKS)); return g; };
  const woke = (g: Game): boolean => top(g) === 'TitleScreen' && g.screens.length === 1 && !g.attracting && !g.pilot!.on && g.pilot!.band() === null && g.band() === null;

  // The title: untouched for IDLE_TICKS it plays; a key takes the count back; with no pilot it never does.
  const idle = onTitle();
  drive(idle, nothing(IDLE_TICKS - 1));
  const waiting = top(idle) === 'TitleScreen' && !idle.attracting && !idle.pilot!.on;
  drive(idle, nothing(2));
  ok(IDLE_TICKS === 60 * 45 && waiting && top(idle) === 'ExploreScreen' && idle.screens.length === 1 && idle.pilot!.on && idle.attracting,
    `a title untouched for forty-five seconds plays a new game on the pilot: the title after ${IDLE_TICKS - 1} ticks, the map with the pilot at the helm after ${IDLE_TICKS + 1}`);
  const touched = onTitle();
  drive(touched, nothing(IDLE_TICKS - 1));
  drive(touched, ['down']);
  drive(touched, nothing(IDLE_TICKS - 1));
  const kept = top(touched) === 'TitleScreen' && !touched.attracting;
  drive(touched, nothing(1));
  ok(kept && top(touched) === 'ExploreScreen' && touched.attracting, `a key on the title takes the count back to 0: ${IDLE_TICKS - 1} ticks after it the title stays, the next plays`);
  const bare = headlessGame();
  bare.screens = [new TitleScreen(false)];
  drive(bare, nothing(IDLE_TICKS + 5));
  bare.attract();
  ok(top(bare) === 'TitleScreen' && !bare.attracting && bare.pilot === null, 'a game with no pilot idles on the title, and attract does nothing');

  // A fresh seed, the company drawn from it, the start it plays and the lines over it. freshSeed (the engine's one draw of chance) is given its numbers here, so that the seeds are known.
  const real = Math.random;
  try {
    Math.random = () => 0.3;
    const s1 = freshSeed();
    const d = onTitle();
    drive(d, nothing(IDLE_TICKS));
    const first = JSON.stringify(d.party), state = d.rng.state, world = JSON.stringify(d.world.state), band = d.band(), why = 'The pilot plays. / Any key for the title.';
    const ref = onTitle();
    ref.newGame(s1, randomParty(s1));
    ok(d.attracting && first === JSON.stringify(randomParty(s1)) && first === JSON.stringify(ref.party) && state === ref.rng.state && world === JSON.stringify(ref.world.state),
      `attract starts on a fresh seed (${s1}) with the company drawn from that seed, seeded first: the seed plays the same start again (${d.party.members.map((c) => c.cls).join(' ')})`);
    ok(d.pilot!.why.join(' / ') === why && band?.lines.join(' / ') === why && band.tag === 'PILOT 1X', `the band opens with "${why}" and the pilot's tempo`);

    // The opening stands ATTRACT_HOLD ticks, then the pilot's own first line over the way out; its own keys go through the same door and do not wake it.
    let held = 0;
    turned = 0;
    while (d.band()?.lines[0] === 'The pilot plays.' && held < 2 * ATTRACT_HOLD) { drive(d, nothing(1)); held++; }
    const out = 'Any key for the title.', line1 = d.pilot!.why[0], then = d.band()?.lines.join(' / ');
    d.pilot!.why = ['Bound for the lane.', 'The lane is shut to me.'];
    const two = d.band()?.lines.join(' / ');
    ok(held === ATTRACT_HOLD && then === `${line1} / ${out}` && two === `Bound for the lane. / ${out}` && d.attracting && d.pilot!.on && turned >= held,
      `the opening stands ${ATTRACT_HOLD} ticks, then the pilot's first line stands over the way out, whatever its second was ("${then}"; "${two}"); the ${turned} keys it pressed did not wake it`);
    const paced = onTitle();
    paced.pilot = new Pilot();
    drive(paced, nothing(IDLE_TICKS));
    const at = JSON.stringify(paced.world.state);
    drive(paced, nothing(90));
    ok(paced.attracting && paced.pilot.on && JSON.stringify(paced.world.state) !== at, `as the game has it, paced and with the brains it has, its first actions (${paced.pilot.why.join(' / ')}) do not wake it either`);

    // A wipe: another game on a new seed at once, the title never between, the opening lines again.
    Math.random = () => 0.6;
    const s2 = freshSeed(), old = d.party;
    for (const c of old.members) c.conditions.push('dead');
    let n = 0;
    for (; n < 60 && d.party === old; n++) drive(d, nothing(1));
    ok(s1 !== s2 && d.party !== old && JSON.stringify(d.party) === JSON.stringify(randomParty(s2)) && d.attracting && d.pilot!.on && d.screens.length === 1 && top(d) === 'ExploreScreen' && d.pilot!.stopped === null && d.band()?.lines.join(' / ') === why,
      `a wipe while attracting starts another game at once, on a new seed (${s1} then ${s2}), with no title between (${n} ticks)`);

    // The viewer's key: the title, the key dropped; and the title counts again from 0.
    press(d, 'forward');
    const back = woke(d);
    drive(d, nothing(IDLE_TICKS - 1));
    const again = top(d) === 'TitleScreen' && !d.attracting;
    drive(d, nothing(1));
    ok(back && again && d.attracting, 'one key brings the title back, with attracting off and the pilot off, and the new title idles into the next game in its turn');
  } finally {
    Math.random = real;
  }
  const dropped = attracted();
  press(dropped, 'interact');
  const space = top(dropped) === 'TitleScreen';
  press(dropped, 'interact');
  ok(space && top(dropped) === 'CreateScreen', `the key that brings the title back is dropped: Space does not open the charter (${top(dropped)}), and the title answers the next`);

  // A stop of the pilot's own keeps its band up in attract mode too, and the next key wakes it.
  const stopped = attracted();
  stopped.pilot!.stop(stopped, ['The choice is theirs.']);
  const stands = !stopped.pilot!.on && stopped.attracting && top(stopped) === 'ExploreScreen' && stopped.band()?.lines[0] === 'The choice is theirs.' && stopped.band()?.tag === '';
  press(stopped, 'forward');
  ok(stands && woke(stopped), 'a stop of its own keeps its band up over the game, still attracting, and the next key brings the title back and takes the band down');

  // A riddle open when the viewer's key comes, or a wipe falls, is dropped with the game: the text mode only the riddle turns off goes off with it, or the keys that move the party would be typed.
  const riddled = attracted();
  riddled.push(new RiddleScreen(riddled, 'A statue', 'What walks on four legs?', () => undefined));
  const typing = riddled.input!.textMode;
  press(riddled, 'cancel');
  ok(typing && woke(riddled) && !riddled.input!.textMode, 'a riddle open when the viewer\'s key comes: the title is back and the text mode off');
  const wiped = attracted();
  wiped.push(new RiddleScreen(wiped, 'A statue', 'What walks on four legs?', () => undefined));
  const typed = wiped.input!.textMode;
  wiped.gameOver();
  ok(typed && wiped.attracting && wiped.pilot!.on && top(wiped) === 'ExploreScreen' && wiped.screens.length === 1 && !wiped.input!.textMode, 'a riddle open when a wipe falls: the next game starts with the text mode off');

  // P is the pilot's, and main.ts takes it before the game sees it: it pauses the show, says so and what the next key does, and starts it again; any other key leaves.
  const paused = attracted();
  paused.pilot!.toggle(paused);
  const said = paused.log.at(-1);
  const stood = !paused.pilot!.on && paused.attracting && top(paused) === 'ExploreScreen' && paused.band() === null;
  paused.pilot!.toggle(paused);
  const went = paused.pilot!.on && paused.attracting;
  press(paused, 'interact');
  ok(stood && said === 'Paused. P plays on, any other key for the title.' && went && woke(paused), `P in attract mode pauses the show and says so ("${said}"), and starts it again; another key brings the title back`);
  // Outside attract mode none of it shows: a game P started has the pilot's own band and its own words for the helm.
  const played = onTitle();
  played.pilot!.toggle(played);
  const own = !played.attracting && top(played) === 'ExploreScreen' && played.band()?.lines.join() === played.pilot!.band()?.lines.join() && played.band()?.lines[1] !== 'Any key for the title.';
  played.pilot!.toggle(played);
  ok(own && played.log.at(-1) === 'You take the helm.', 'a game P started has the pilot\'s own band and no way out written on it, and taking the helm back says so');

  // Nothing is saved: over an empty store, and over a save already there.
  const disk = new Map<string, string>();
  const store: Store = { getItem: (key) => disk.get(key) ?? null, setItem: (key, v) => { disk.set(key, v); }, removeItem: (key) => { disk.delete(key); } };
  const w = onTitle(store);
  drive(w, nothing(IDLE_TICKS));
  w.saveGame();
  const empty = w.attracting && !hasSave(store) && disk.size === 0;
  press(w, 'save');
  const unsaved = woke(w) && !hasSave(store);
  w.saveGame();
  ok(empty && unsaved && hasSave(store), 'saveGame while attracting leaves hasSave false, and F5 as a viewer presses it only brings the title back; once it is a game again it saves');
  const text = JSON.stringify([...disk]), x = onTitle(store);
  drive(x, nothing(IDLE_TICKS));
  x.saveGame();
  press(x, 'save');
  press(x, 'interact');
  ok(text.length > 2 && JSON.stringify([...disk]) === text && top(x) === 'ExploreScreen' && !x.attracting && x.log.includes('Loaded.'),
    'over a save already there, attract mode leaves it as it was, and the title it wakes to still offers it: Continue loads it');

  // The game has no sound, so attract mode has none to mute; a sound added to it must be muted while attracting.
  const src = new URL('../../src/', import.meta.url);
  const loud = (readdirSync(src, { recursive: true }) as string[]).filter((f) => f.endsWith('.ts') && !f.startsWith('lib/') && /lib\/audio|AudioContext|new Audio\(/.test(readFileSync(new URL(f, src), 'utf8')));
  ok(loud.length === 0, `nothing in the game imports the engine's audio, so attract mode has none to mute${loud.length ? `; mute it while Game.attracting: ${loud.join(', ')}` : ''}`);
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
  // The navigator alone: the quartermaster (#719) would answer the inn's menu and leave.
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
  // Known.seenCount: the squares `seen` holds for, the last word's bits beyond the map left out; every square for an omniscient pilot.
  const counts = (q: Known, id: string, w: number, h: number): number => grid(w, h).filter(([x, y]) => q.seen(id, x, y)).length;
  fixture(g, dead, [1, 1, EAST], grid(5, 3));
  const part = [k.seenCount('fx_dead'), counts(k, 'fx_dead', 7, 3)];
  g.world.ensureMapState('fx_dead').explored.fill(-1);
  const full = k.seenCount('fx_dead'), omni = knownOf(Object.assign(piloted(), { pilot: new Pilot({ omniscient: true }) }));
  ok(part[0] === 15 && part[1] === 15 && full === 21 && k.seenCount('harrow') === counts(k, 'harrow', 16, 16) && omni.seenCount('harrow') === 256 && k.seenCount('no_such_map') === 0,
    `Known.seenCount counts the squares seen, none beyond the map's own (${part.join(' and ')}; ${full} of 21; Helmstow ${k.seenCount('harrow')}; all ${omni.seenCount('harrow')})`);
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
  ok(g.world.state.mapId === 'harrow' && reached.size > 100 && unseen.length === 0 && behind.length === 0,
    `3000 ticks of the navigator and the explorer leave every passable square of Helmstow seen (${reached.size} reached as written; ${unseen.length} unseen: ${unseen.join(' ') || 'none'}; expected unseen: ${behind.join(', ') || 'none'})`);
  ok(p.on && whys.has('Looking about Helmstow.') && p.why[0] === 'Helmstow is walked out.', `the why line looks about Helmstow, and then says it is walked out (${[...whys].join(' / ')})`);
  // Walked out, it says so again with no search, until a square is seen or a flag is set: Known's cells read through a counter.
  let reads = 0;
  const real = knownOf(g), counted: Known = { ...real, cell: (id, x, y) => { reads++; return real.cell(id, x, y); } };
  const cost = (): number => { reads = 0; explore(g, counted, p); return reads; };
  const idle = cost(), [dx, dy] = grid(m.width, m.height).find(([x, y]) => !g.world.explored(x, y))!, bit = dy * m.width + dx;
  g.world.mapState.explored[bit >> 5] |= 1 << (bit & 31);
  const lit = cost(), after = cost();
  g.party.flags.fx_new = 1;
  const flagged = cost(), settled = cost();
  delete g.party.flags.fx_new;
  ok(idle === 0 && lit > 0 && after === 0 && flagged > 0 && settled === 0 && p.why[0] === 'Helmstow is walked out.',
    `walked out, the explorer reads no cell the next tick, and searches again once a square is seen or a flag set (${idle}; ${lit}, then ${after}; ${flagged}, then ${settled} reads)`);

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

type Shop = Extract<Feature, { kind: 'shop' }>;
type Trainer = Extract<Feature, { kind: 'trainer' }>;

/**
 * What a menu has shown (#719): a shop's wares and prices and a trainer's top level come through
 * Known once the pilot has looked at its menu, exactly as the screen showed them, and not before, not
 * for a business never visited and not for a new company.
 */
function shown(): void {
  const g = piloted(), p = g.pilot!, k = knownOf(g), all = (): void => { for (const id of Object.keys(g.maps)) g.world.ensureMapState(id).explored.fill(-1); };
  all();
  const shop = (map: string): Shop | undefined => k.features(map).find((f): f is Shop => f.kind === 'shop');
  const trainer = (map: string): Trainer | undefined => k.features(map).find((f): f is Trainer => f.kind === 'trainer');
  const other = Object.keys(g.maps).find((id) => id !== 'harrow' && shop(id) && trainer(id))!, mott = shop('harrow')!, drill = trainer('harrow')!;
  const blank = !mott.stock.length && mott.prices === undefined && Number.isNaN(drill.maxLevel);
  // The pilot on with no brains: each tick of nothing is its look, and every key is the test's.
  p.toggle(g);
  p.brains = [];
  g.world.travel('harrow', mott.x, mott.y, NORTH);
  drive(g, ['interact', null, 'interact', null]);
  const asked = (g.top as ChoiceScreen).options.join(), early = shop('harrow')!.stock.length;
  drive(g, ['interact', null]);
  const rows = (g.top as ChoiceScreen).options.slice(0, -1).map(optionParts), ids = rows.map((r) => Object.values(ITEMS).find((d) => d.name === r.label)?.id);
  drive(g, ['cancel', 'cancel']);
  const seen = shop('harrow')!, elsewhere = shop(other)!;
  const exact = rows.length > 0 && ids.every(Boolean) && seen.stock.join() === ids.join() && seen.stock.every((id, i) => seen.prices?.[id] === Number(rows[i].value.slice(0, -1)));
  ok(blank && asked === 'Buy,Sell,Leave' && early === 0 && exact && top(g) === 'ExploreScreen' && !elsewhere.stock.length && elsewhere.prices === undefined,
    `a shop's wares and prices come through once its Buy list is seen, as it showed them, and not at its first menu nor for a shop never visited (${seen.stock.length} wares in ${mott.name}; none in ${other}'s)`);

  // The Drillyard is the Wardens' hall: its first menu, then its trade.
  g.world.travel('harrow', drill.x, drill.y, NORTH);
  drive(g, ['interact', null]);
  const hall = (g.top as ChoiceScreen).options[0], early2 = trainer('harrow')!.maxLevel;
  drive(g, ['interact', null]);
  const says = Number(/I train to level (\d+)\./.exec((g.top as ChoiceScreen).words)?.[1]);
  drive(g, ['cancel', 'cancel']);
  ok(hall === 'Train' && Number.isNaN(early2) && says > 0 && trainer('harrow')!.maxLevel === says && top(g) === 'ExploreScreen' && Number.isNaN(trainer(other)!.maxLevel),
    `a trainer's top level comes through once its menu has said it (${says}), not at the hall's first menu and not for one never visited`);
  g.newGame(5);
  all();
  ok(!shop('harrow')!.stock.length && Number.isNaN(trainer('harrow')!.maxLevel), "a new game's company has seen no menu");
}

/** The quartermaster (#719): what the company needs, the gear it buys, a rest, the inn's room, the temple, a shop's wares worn through the sheet, a trainer and a well. */
function quartermaster(): void {
  ok(BRAINS.indexOf(keep) === 0 && BRAINS.indexOf(route) > 0, 'the quartermaster is asked before the navigator');

  // need() and better() on the harness's level-3 company: one at a tenth of their hit points, one dead, all whole.
  const g = piloted(), base = companyAt(3, 1), as = (q: Party): Need | null => { g.party = q; return need(g); };
  const hurt = structuredClone(base), dead = structuredClone(base);
  hurt.members[2].hp = Math.max(1, Math.round(hurt.members[2].maxHp / 10));
  dead.members[4].conditions = ['dead'];
  dead.members[4].hp = 0;
  const whole = as(structuredClone(base));
  ok(as(hurt) === 'rest' && as(dead) === 'temple' && (whole === null || whole === 'gear'), `need: one at a tenth of their hit points, rest; one dead, the temple; whole and fed, ${whole}`);
  const both = structuredClone(dead);
  both.members[2].hp = Math.max(1, Math.round(both.members[2].maxHp / 10));
  const first = as(both), order = needs(g).join();
  ok(first === 'temple' && order === 'temple,rest', `with one dead and one at a tenth, the temple comes before rest (${order})`);
  // companyAt(3)'s knight wields a long sword already: here he holds a short sword.
  const company = structuredClone(base), fighter = company.members.find((c) => c.cls === 'knight')!, mottram = g.maps.harrow.features.find((f): f is Shop => f.kind === 'shop')!;
  fighter.equipment.weapon = 'shortsword';
  const only: Shop = { ...mottram, stock: ['longsword'], prices: {} };
  company.gold = 420;
  const rich = better(fighter, only.stock, only, spare(company));
  company.gold = 400;
  const poor = better(fighter, only.stock, only, spare(company));
  ok(reserve(company) === 300 && item('longsword').price === 120 && rich === 'longsword' && poor === undefined,
    `better: the long sword (120 gold) for the fighter with 420 gold and not with 400, the reserve 300 (${rich}, ${poor})`);

  // A rest where it stands: everyone at a tenth, food for two nights, four steps short of the town
  // well, which a rest comes before (the issue's order).
  const r = piloted(), rp = r.pilot!;
  r.world.travel('harrow', 7, 10, NORTH);
  r.world.ensureMapState('harrow').explored.fill(-1);
  for (const c of r.party.members) c.hp = Math.max(1, Math.round(c.maxHp / 10));
  r.party.food = 12;
  const refused = restRefused(r.world), t0 = r.world.state.minutes, whys: string[] = [], well = r.maps.harrow.features.some((f) => f.kind === 'well' && f.x === 7 && f.y === 6);
  rp.toggle(r);
  let ticks = 0;
  for (; ticks < 40 && !r.party.members.every((c) => c.hp === c.maxHp); ticks++) { drive(r, [null]); whys.push(rp.why[0]); }
  ok(refused === '' && well && r.party.members.every((c) => c.hp === c.maxHp) && r.world.state.minutes - t0 === 480 && r.world.state.y === 10 && whys[0] === `Resting: ${r.party.members[0].name} is under a quarter.`,
    `a rest where it stands: in ${ticks} ticks everyone is whole and the clock has moved ${r.world.state.minutes - t0} minutes, the party at ${r.world.state.x},${r.world.state.y} (${whys[0]})`);

  // The inn's door: a room taken, and back on the street.
  const n = piloted(), np = n.pilot!, door = n.maps.harrow.features.find((f) => f.kind === 'inn' && n.world.present(f))!;
  n.world.travel('harrow', door.x, door.y, NORTH);
  n.party.gold = 30 * n.party.members.length;
  n.party.food = 6 * n.party.members.length;
  n.party.members[0].hp = Math.max(1, Math.round(n.party.members[0].maxHp / 10));
  np.toggle(n);
  let slept = false, nt = 0;
  for (; nt < 60 && !(slept && n.top instanceof ExploreScreen); nt++) { drive(n, [null]); slept ||= n.log.includes('You sleep well. Morning.'); }
  const ns = n.world.state;
  ok(slept && n.top instanceof ExploreScreen && !(ns.x === door.x && ns.y === door.y) && n.party.members.every((c) => c.hp === c.maxHp) && n.party.gold === 30 * n.party.members.length - 12 * n.party.members.length,
    `at the inn's door the room is taken: in ${nt} ticks the company is whole and back on the street at ${ns.x},${ns.y}, ${n.party.gold} gold left`);

  // The temple, seen: one dead walked there and raised.
  const t = piloted(), tp = t.pilot!, gone = t.party.members[1], bound: string[] = [];
  t.world.ensureMapState('harrow').explored.fill(-1);
  gone.conditions = ['dead'];
  gone.hp = 0;
  tp.toggle(t);
  let tt = 0;
  for (; tt < 400 && hasCondition(gone, 'dead'); tt++) { drive(t, [null]); bound.push(tp.why[0]); }
  ok(!hasCondition(gone, 'dead') && t.log.includes(`${gone.name} is restored.`) && bound.includes(`Bound for the Chapel of the Lanterns: ${gone.name} is dead.`),
    `with one dead and the temple seen, the pilot walks there and they stand, in ${tt} ticks (${bound.find((w) => w.startsWith('Bound'))})`);

  // At the temple's door with one dead, one stone and the gold for one fee: the dead is raised first.
  const tm = piloted(), tmp = tm.pilot!, [lost, stone] = [tm.party.members[1], tm.party.members[2]], chapel = tm.maps.harrow.features.find((f) => f.kind === 'temple' && tm.world.present(f))!;
  lost.conditions = ['dead'];
  lost.hp = 0;
  stone.conditions = ['stoned'];
  tm.party.gold = templePrice(lost);
  const fees = [templePrice(lost), templePrice(stone)];
  tm.world.travel('harrow', chapel.x, chapel.y, NORTH);
  tmp.toggle(tm);
  drive(tm, Array(30).fill(null));
  ok(fees[1] <= fees[0] && !hasCondition(lost, 'dead') && hasCondition(stone, 'stoned') && tm.party.gold === 0,
    `with gold for one fee (${fees.join(' or ')}), the dead is raised before the stone (${lost.conditions.join() || 'well'}; ${stone.conditions.join()})`);

  // Needs it can meet none of are said: hurt, no rations and no gold, the inn seen and gone to once.
  const u = piloted(), upi = u.pilot!;
  u.world.ensureMapState('harrow').explored.fill(-1);
  u.party.gold = 0;
  u.party.food = 0;
  for (const c of u.party.members) c.hp = Math.max(1, Math.round(c.maxHp / 10));
  upi.brains = [keep, route, explore];
  upi.toggle(u);
  drive(u, Array(200).fill(null));
  const wants = upi.why.join(' / ');
  drive(u, Array(20).fill(null));
  ok(wants === 'Hurt, and no gold for a room.' && upi.why.join(' / ') === wants && u.top instanceof ExploreScreen && u.log.includes('You cannot afford a room.') === false,
    `a need it cannot meet is said, and stands (${wants})`);

  // A shop: with gold over the reserve, it looks at the wares, buys what betters each and wears it by the sheet's keys.
  const s = piloted(), sp = s.pilot!, keys: Action[] = [], worn = s.party.members.map((c) => ({ ...c.equipment }));
  s.world.ensureMapState('harrow').explored.fill(-1);
  s.party.gold = 400;
  sp.toggle(s);
  sp.brains = [(a, b, c) => { const key = keep(a, b, c); if (key) keys.push(key); return key; }, route];
  drive(s, Array(300).fill(null));
  const stock = (s.maps.harrow.features.find((f) => f.kind === 'shop' && s.world.present(f)) as Shop).stock;
  const changed = s.party.members.flatMap((c, i) => (['weapon', 'armor', 'shield'] as const).filter((slot) => c.equipment[slot] !== worn[i][slot]).map((slot) => ({ c, id: c.equipment[slot]! })));
  const up = s.party.members.every((c, i) => hits(weaponOf(c)) >= hits(weaponOf({ ...c, equipment: worn[i] })) && armorClass(c) >= armorClass({ ...c, equipment: worn[i] }));
  ok(changed.length > 0 && up && changed.every(({ c, id }) => stock.includes(id) && s.log.includes(`${c.name} equips ${item(id).name}.`)) && !s.party.bag.some((id) => changed.some((w) => w.id === id)) && s.party.gold >= reserve(s.party),
    `with gold over the reserve, the shop's wares are looked at and what betters each is bought and worn: ${changed.map(({ c, id }) => `${c.name} ${id}`).join(', ')}; ${s.party.gold} gold left`);
  ok(keys.includes('inventory') && keys.includes('cancel') && top(s) === 'ExploreScreen', `worn through the sheet, by its keys (${[...new Set(keys)].join(' ')})`);

  // A trainer: one ready is trained, once the trainer's menu has said how far it trains.
  const tr = piloted(), trp = tr.pilot!, bram = tr.party.members[0];
  tr.world.ensureMapState('harrow').explored.fill(-1);
  bram.xp = xpForLevel(2);
  trp.toggle(tr);
  let rt = 0;
  for (; rt < 200 && bram.level < 2; rt++) drive(tr, [null]);
  const yard = knownOf(tr).features('harrow').find((f): f is Trainer => f.kind === 'trainer');
  ok(bram.level === 2 && tr.log.some((l) => l.startsWith(`${bram.name} trains to level 2.`)) && yard?.maxLevel === 6, `one ready to train is walked to the trainer and trained, in ${rt} ticks (top level ${yard?.maxLevel})`);

  // A well six keys off: drunk from while one is under half; one that restores nobody is not gone back to.
  const welled = (heal: boolean): { g: Game; healed: boolean; again: boolean } => {
    const w = piloted(), wp = w.pilot!, c = w.party.members[0];
    fixture(w, { id: `fx_well_${heal}`, name: 'Well', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#######', '#.....#', '#######'], features: [{ kind: 'well', x: 4, y: 1, text: 'A well.', heal }] }, [1, 1, EAST]);
    c.hp = Math.floor(c.maxHp * 0.4);
    // No rations to rest on and no spell points to mend with (#723): the well is the one want it can meet.
    w.party.food = 0;
    for (const m of w.party.members) m.sp = 0;
    wp.toggle(w);
    drive(w, Array(10).fill(null));
    const healed = c.hp === c.maxHp && w.world.state.x === 4;
    w.world.travel(`fx_well_${heal}`, 1, 1, EAST);
    drive(w, Array(10).fill(null));
    return { g: w, healed, again: w.world.state.x !== 1 };
  };
  const sweet = welled(true), dry = welled(false);
  ok(sweet.healed && !dry.healed && dry.g.world.state.x === 1 && !dry.again && dry.g.log.includes('A well.'), `a well near is drunk from by one under half, and one that restores nobody is not gone back to (${sweet.healed}, ${dry.healed})`);
}

/** A fixture town of one row of floor, `n` squares long, with `features` on it; the party at its west end, facing east. */
const row = (id: string, n: number, features: Feature[]): MapDef =>
  ({ id, name: id, kind: 'town', start: { x: 1, y: 1, facing: EAST }, rows: ['#'.repeat(n + 2), `#${'.'.repeat(n)}#`, '#'.repeat(n + 2)], features });

/**
 * Talk (#721): whom it meets (the near, and on the aim's map the far; again once the company gains an
 * item, as a hand-in wants), how it answers (a group's question, an inn's menu, a person's question,
 * the ending's, a guild's hall, a prestige) and a crossing told: offered, an edge of the navigator's,
 * and taken where it is the way.
 */
function talking(): void {
  ok(BRAINS.indexOf(keep) === 0 && BRAINS.indexOf(talk) === 1 && BRAINS.indexOf(aims) === 2, 'talk is asked after the quartermaster and before the strategist');

  // A group's question with a price and a fight: with 100 gold the price, with 5 none open but the fight, so Esc.
  const toll: MapDef = { ...row('fx_toll', 3, []), kind: 'dungeon', encounters: [{ id: 'fx_tollmen', x: 3, y: 1, monsters: ['rat'], choice: { ask: '"Ten gold, or blood."', answers: [
    { label: 'Pay 10 gold', price: 10, sets: 'fx_toll_paid', says: ['"Pass."'] }, { label: 'Fight', fight: true, says: ['"Blood, then."'] }] } }] };
  const pg = piloted();
  fixture(pg, toll, [2, 1, EAST]);
  const parley = (gold: number): number => { pg.party.gold = gold; pg.parley('fx_tollmen'); const i = pick(pg.top as ChoiceScreen, pg, pg.pilot!); pg.pop(); return i; };
  const rich = parley(100), poor = parley(5);
  ok(rich === 0 && poor === -1, `pick on a parley of ['Pay 10 gold','Fight']: with 100 gold the price (${rich}), with 5 the fight, by Esc (${poor})`);

  // An inn's menu with no need is the quartermaster's: Leave, not the night that rule 6 would take.
  const ig = piloted();
  fixture(ig, row('fx_lodge', 2, [{ kind: 'inn', x: 2, y: 1, name: 'The Fixture Arms', price: 5, interior: 'harrow_provisioner' }]), [1, 1, EAST]);
  ig.party.gold = 150;
  ig.interact(ig.maps.fx_lodge.features[0]);
  const inn = ig.top as ChoiceScreen, leave = pick(inn, ig, ig.pilot!);
  ok(need(ig) === null && inn.options[leave] === 'Leave' && inn.options[0].startsWith('Stay the night'), `pick on an inn's menu with no need is the index of Leave (${leave}: ${inn.options.join(' / ')})`);

  // Near and far: the near met unasked, the far (past NEAR keys) only once the aim is on its map.
  const lg = piloted(), lp = lg.pilot!;
  fixture(lg, row('fx_lane', 26, [{ kind: 'npc', x: 4, y: 1, name: 'A near one', lines: ['"Hello."'] }, { kind: 'npc', x: 25, y: 1, name: 'A far one', lines: ['"Far."'] }]), [1, 1, EAST]);
  lp.brains = [talk];
  lp.toggle(lg);
  drive(lg, Array(40).fill(null));
  const near = lp.met.has('fx_lane:4,1') && !lp.met.has('fx_lane:25,1') && lg.world.state.x === 4;
  lp.aim = { kind: 'explore', map: 'fx_lane' };
  drive(lg, Array(60).fill(null));
  ok(near && lp.met.has('fx_lane:25,1') && lg.world.state.x === 25 && lp.heard.includes('"Far."'),
    `a person within ${NEAR} keys is met; one 21 keys on only once the aim is on the map (${[...lp.met].join(' ')}; at ${lg.world.state.x})`);

  // A hand-in: taken at a meeting that holds the item, so its keeper is met again once the company gains it.
  const hg = piloted(), hp = hg.pilot!;
  fixture(hg, row('fx_yard', 4, [{ kind: 'npc', x: 3, y: 1, name: 'A collector', lines: ['"Bring me a wand."'], quest: [{ item: 'survey_wand', reward: 10, setFlag: 'fx_handed', done: ['"Good."'] }] }]), [1, 1, EAST]);
  hp.brains = [talk];
  hp.toggle(hg);
  drive(hg, Array(20).fill(null));
  const once = hp.met.has('fx_yard:3,1') && !hg.party.flags.fx_handed && hp.heard.includes('"Bring me a wand."');
  hg.world.travel('fx_yard', 1, 1, EAST);
  drive(hg, Array(20).fill(null));
  const idle = !hg.party.flags.fx_handed && hg.world.state.x === 1;
  hg.party.bag.push('survey_wand');
  drive(hg, Array(20).fill(null));
  ok(once && idle && hg.party.flags.fx_handed === 1 && !hg.party.bag.includes('survey_wand'),
    `a person met is not met again until the company gains an item; then the hand-in is made (${once}, ${idle}, ${hg.party.flags.fx_handed})`);

  // A person in a business, gone to: the door is due as the visit begins, so they are talked to before Leave.
  const sg = piloted(), sp = sg.pilot!;
  fixture(sg, row('fx_stall', 3, [{ kind: 'shop', x: 3, y: 1, name: 'A Fixture Stall', interior: 'harrow_provisioner', stock: [] }, { kind: 'npc', x: 3, y: 1, name: 'A stallholder', lines: ['"Fine day."'] }]), [1, 1, EAST]);
  sp.brains = [talk];
  sp.toggle(sg);
  drive(sg, Array(20).fill(null));
  ok(sp.heard.includes('"Fine day."') && sp.met.has('fx_stall:3,1') && sg.top instanceof ExploreScreen,
    `a person in a business talk goes to is talked to there, by the menu's Talk to row, and the business left (${sp.heard.includes('"Fine day."')}, ${top(sg)})`);

  // A goal to a person taken by another brain on the way, a box shown meanwhile: not met, so still due, and met once free.
  const wg = piloted(), wp = wg.pilot!;
  fixture(wg, row('fx_way', 9, [{ kind: 'npc', x: 8, y: 1, name: 'A far one', lines: ['"Far."'] }]), [1, 1, EAST]);
  wp.brains = [talk];
  wp.toggle(wg);
  drive(wg, Array(3).fill(null));
  wg.message('A box on the way.');
  drive(wg, [null]);
  const at = wg.world.state.x;
  wp.goal = { map: 'fx_way', x: 1, y: 1, name: 'the way back', reason: 'the test' };
  drive(wg, [null]);
  const taken = !wp.met.has('fx_way:8,1') && !wp.heard.includes('"Far."');
  wp.goal = null;
  drive(wg, Array(20).fill(null));
  ok(at === 4 && taken && wp.met.has('fx_way:8,1') && wp.heard.includes('"Far."'),
    `a goal to a person taken by another brain on the way, a box shown meanwhile, is no meeting: still due, and met once free (taken at ${at}: ${taken})`);

  // A person met again once the company sets a flag: the words that wait on it are heard.
  const fg = piloted(), fp = fg.pilot!;
  fixture(fg, row('fx_watch', 4, [{ kind: 'npc', x: 3, y: 1, name: 'A watcher', lines: ['"Not yet."'], says: [{ after: { flag: 'fx_word' }, lines: ['"Now then."'] }] }]), [1, 1, EAST]);
  fp.brains = [talk];
  fp.toggle(fg);
  drive(fg, Array(12).fill(null));
  const unsaid = fp.heard.includes('"Not yet."') && !fp.heard.includes('"Now then."');
  fg.party.flags.fx_word = 1;
  drive(fg, Array(12).fill(null));
  ok(unsaid && fp.heard.includes('"Now then."'), `a person met is met again once a flag is set, and the words that wait on it are heard (${unsaid}, ${fp.heard.includes('"Now then."')})`);

  // A person's question, from one at hand: the first answer open that is no way out and has no price.
  const cg = piloted(), cp = cg.pilot!;
  fixture(cg, row('fx_clerk', 3, [{ kind: 'npc', x: 2, y: 1, name: 'A clerk', lines: ['"A case?"'], choice: { ask: '"Whose case?"', answers: [
    { label: 'Not now', sets: 'fx_no', says: ['"Later."'] }, { label: 'The dear one.', price: 60, sets: 'fx_dear', says: ['"Paid."'] }, { label: 'The plain one.', sets: 'fx_plain', says: ['"Plain."'] }] } }]), [1, 1, EAST]);
  cp.brains = [talk];
  cp.toggle(cg);
  drive(cg, Array(12).fill(null));
  ok(cg.party.flags.fx_plain === 1 && !cg.party.flags.fx_no && !cg.party.flags.fx_dear && cg.top instanceof ExploreScreen,
    `a person's question is answered with the first answer open that is no way out and has no price (${Object.keys(cg.party.flags).join()})`);

  // The ending's question is marked and not answered: the pilot stops itself under it, saying so, and presses nothing.
  const eg = piloted(), ep = eg.pilot!;
  fixture(eg, row('fx_heart', 2, [{ kind: 'npc', x: 1, y: 1, name: 'A keeper', lines: ['"Choose."'] }]), [1, 1, EAST]);
  eg.ask({ ask: '"Which?"', answers: [{ label: 'Relight it.', sets: ENDINGS.reignite.flag, says: ['"So."'] }, { label: 'Not yet.', says: ['"Then wait."'] }] }, 'A keeper');
  ep.toggle(eg);
  const end = eg.top as ChoiceScreen, answered = pick(end, eg, ep), key = talk(eg, knownOf(eg), ep);
  drive(eg, Array(10).fill(null));
  ok(end.ends && answered === -1 && key === null && !ep.on && ep.band()?.lines[0] === 'The choice is yours.' && eg.top === end && !eg.party.flags[ENDINGS.reignite.flag],
    `the ending's question is marked, neither picked nor answered, and the pilot stops under it with the band up (${end.ends}, ${answered}, ${key}, ${ep.on}, "${ep.band()?.lines[0]}")`);

  // A guild's hall: the fee over the reserve, then for each of its classes the costliest spell over it, one each.
  const hall = (gold: number): { g: Game; learnt: number[] } => {
    const g = piloted(), p = g.pilot!;
    fixture(g, row('fx_guild', 3, [{ kind: 'guild', x: 3, y: 1, name: 'A Fixture Guildhall', classes: ['paladin', 'cleric', 'sorcerer'], fee: 50, maxTier: 2, interior: 'harrow_provisioner' }]), [1, 1, EAST]);
    g.party.gold = gold;
    const before = g.party.members.map((m) => m.spells.length);
    p.brains = [talk];
    p.toggle(g);
    drive(g, Array(60).fill(null));
    return { g, learnt: g.party.members.map((m, i) => m.spells.length - before[i]) };
  };
  const paid = hall(400), short = hall(120), taught = paid.g.party.members.filter((m) => ['paladin', 'cleric', 'sorcerer'].includes(m.cls)).length;
  ok(paid.g.party.flags[guildFlag('A Fixture Guildhall')] === 1 && paid.learnt.filter((n) => n === 1).length === taught && paid.learnt.every((n) => n <= 1) && paid.g.party.gold === 400 - 50 - 80 * taught && paid.g.party.gold >= reserve(paid.g.party)
    && !short.g.party.flags[guildFlag('A Fixture Guildhall')] && short.learnt.every((n) => n === 0) && short.g.party.gold === 120 && short.g.top instanceof ExploreScreen,
    `a guild's hall: the fee and a spell for each of its ${taught} members over the reserve (${paid.learnt.join('')}, ${paid.g.party.gold} gold left); with 120 gold, the fee left (${short.g.party.gold})`);

  // A prestige's trainer: the first rise the game leaves open; none open, Leave.
  const tg = piloted(), knight = tg.party.members.find((m) => m.cls === 'knight')!;
  tg.party.gold = 1500;
  const rise = (level: number): string => { knight.level = level; tg.train({ cls: 'knight', prestige: 1 }, 'A fixture master'); const c = tg.top as ChoiceScreen, i = pick(c, tg, tg.pilot!); tg.pop(); return c.options[i] ?? 'Esc'; };
  const ready = rise(PRESTIGE_LEVELS[0]), early = rise(PRESTIGE_LEVELS[0] - 1);
  ok(ready.startsWith(`${knight.name}: `) && early === 'Leave', `a prestige offered is taken where the game leaves it open, else Leave (${ready}; ${early})`);

  // A person who sells a crossing: met, the route is told and is an edge of the navigator's; bound over it, taken.
  const qg = piloted(), qp = qg.pilot!;
  fixture(qg, row('fx_quay', 4, [{ kind: 'npc', x: 4, y: 1, name: 'A boatman', lines: ['"Over the water?"'], passage: [{ to: 'harrow', x: 7, y: 14, name: 'Helmstow', by: 'boat', fare: 0, departs: 6, days: 0, arrives: 12 }] }]), [1, 1, EAST]);
  const untold = knownOf(qg).offers().length === 0 && qp.offers.length === 0 && routeMaps(knownOf(qg), 'fx_quay', 'harrow') === null;
  qp.brains = [talk];
  qp.toggle(qg);
  drive(qg, Array(20).fill(null));
  const told = qp.offers.map((o) => `${o.map}:${o.x},${o.y} ${o.passage.name}`).join(), way = routeMaps(knownOf(qg), 'fx_quay', 'harrow');
  ok(untold && told === 'fx_quay:4,1 Helmstow' && way?.length === 1 && way[0].crossing === 'Helmstow' && way[0].exit.x === 4 && way[0].exit.to === 'harrow' && qg.world.state.mapId === 'fx_quay',
    `a person who sells a crossing: after the meeting offers holds it and routeMaps finds the way to Helmstow by it, not before (${told}; ${way?.map((h) => `${h.map}>${h.exit.to} by ${h.crossing}`).join()}); bound nowhere, Not now`);
  qg.world.travel('fx_quay', 1, 1, EAST);
  qp.brains = [talk, route];
  qp.goal = { map: 'harrow', x: 7, y: 14, name: 'Helmstow' };
  const whys = new Set<string>();
  for (let t = 0; t < 40 && qg.world.state.mapId === 'fx_quay'; t++) { drive(qg, [null]); whys.add(qp.why[0]); }
  ok(qg.world.state.mapId === 'harrow' && whys.has('Passage to Helmstow.'), `bound for Helmstow, the navigator goes by the crossing told: to the boatman, the route chosen and boarded (${qg.world.state.mapId}; ${[...whys].join(' / ')})`);
}

/**
 * Survival (#723's first part): the pilot's own rest rule, by member; a mending between fights through
 * the spell menu; the flight from a fight lost; and a town's own door before the land's gate.
 */
function survives(): void {
  // Rest by member: the company whole and the sorcerer empty, which the harness's rule, pooling the spell points, does not rest for.
  const r = piloted(), rp = r.pilot!, sorc = r.party.members.find((c) => c.cls === 'sorcerer')!;
  r.world.travel('harrow', 7, 10, NORTH);
  r.world.ensureMapState('harrow').explored.fill(-1);
  sorc.sp = 0;
  r.party.food = 12;
  const pooled = mustRest(r.party), t0 = r.world.state.minutes;
  rp.brains = [keep];
  rp.toggle(r);
  drive(r, [null]);
  const said = rp.why[0];
  drive(r, Array(5).fill(null));
  ok(pooled === null && caster(sorc) && sorc.sp === sorc.maxSp && r.world.state.minutes - t0 === 480 && said === `Resting: ${sorc.name} is short of spells.`,
    `the pilot rests for one caster without spell points, where the harness's pooled rule does not (${pooled}; "${said}"; ${sorc.sp}/${sorc.maxSp}, ${r.world.state.minutes - t0} minutes)`);

  // The thresholds, by member: one at 60% of their hit points rests the company and one at 80% does
  // not (REST_HP), nor a paladin's few spell points spent; a caster at 40% of theirs does (REST_SP).
  const w = structuredClone(r.party), front = w.members[0], pal = w.members.find((c) => c.cls === 'paladin')!, cleric = w.members.find((c) => c.cls === 'cleric')!;
  pal.sp = 0;
  front.hp = Math.floor(front.maxHp * 0.8);
  const whole = weary(w);
  front.hp = Math.floor(front.maxHp * 0.6);
  const hurt = weary(w);
  front.hp = front.maxHp;
  cleric.sp = Math.floor(cleric.maxSp * 0.4);
  const dry = weary(w);
  ok(whole === undefined && hurt?.c === front && hurt.why === 'hp' && dry?.c === cleric && dry.why === 'sp' && !caster(pal),
    `weary: ${front.name} at ${Math.floor(front.maxHp * 0.8)} of ${front.maxHp} and the paladin empty, no rest; at ${Math.floor(front.maxHp * 0.6)}, ${hurt?.why}; the cleric at ${cleric.sp} of ${cleric.maxSp}, ${dry?.why}`);

  // Mending between fights: one at half, no rations to rest on: the mender with the most spell points casts by the spell menu's keys.
  const m = piloted(), mp = m.pilot!, bram = m.party.members[0], keys: Action[] = [], was = Math.floor(bram.maxHp / 2);
  bram.hp = was;
  m.party.food = 0;
  mp.brains = [(a, b, c) => { const key = keep(a, b, c); if (key) keys.push(key); return key; }];
  mp.toggle(m);
  drive(m, Array(8).fill(null));
  const mender = m.party.members.find((c) => m.log.some((l) => l.startsWith(`${c.name} casts Mend: ${bram.name} recovers`)));
  ok(!!mender && mender.cls === 'cleric' && bram.hp > was && keys.slice(0, 3).join() === `cast,n${m.party.members.indexOf(mender) + 1},interact` && top(m) === 'ExploreScreen',
    `one at half is mended between fights by ${mender?.name}, through the spell menu (${keys.join(' ')}; ${was} to ${bram.hp} of ${bram.maxHp})`);

  // A fight lost (two of the front fallen in it, six wolves standing): the game's bot flees it; the gate's fights on.
  const fight = (sees: Sees, before = 0, monsters: string[] = Array(6).fill('wolf'), after = 2): string[] => {
    const f = piloted(), q = f.party, down = (c: Party['members'][number]): void => { c.hp = 0; c.conditions = ['unconscious']; };
    q.members.slice(0, before).forEach(down);
    const s = startCombat(q, [{ id: 'fx_pack', monsters }], f.rng);
    q.members.slice(before, before + after).forEach(down);
    for (let n = 0; n < 80 && s.outcome === 'ongoing'; n++) {
      const t = currentTurn(s, q, f.rng);
      if (!t) break;
      if (t.side === 'monster') monsterAct(s, q, f.rng); else botTurn(s, q, f.rng, t.i, sees);
    }
    return s.log;
  };
  const flight = (log: string[]): boolean => log.some((l) => l === 'The party flees!' || l === 'The party fails to get away.');
  const seenLog = fight(asSeen), writtenLog = fight(asWritten);
  ok(flight(seenLog) && !flight(writtenLog), `a fight lost: the game's bot tries to flee, the gate's never (${seenLog.find((l) => l.startsWith('The party'))}; the gate's ${writtenLog.length} lines without one)`);
  // One who came into the fight down is no sign: against five barn rats the company strikes before any flight.
  const names = piloted().party.members.map((c) => c.name), rats = fight(asSeen, 1, Array(5).fill('barn_rat'), 0);
  const first = rats.find((l) => l.startsWith('The party') || names.some((n) => l.startsWith(`${n} `)));
  ok(!!first && !first.startsWith('The party'), `one down from before the fight and five barn rats: a blow before any flight (${first})`);

  // A town's own door before the land's gate: the town walked out, its gate to the keep is walked to, though the land's is nearer.
  const kg = piloted(), kp = kg.pilot!;
  kg.maps.fx_keep = new GameMap({ id: 'fx_keep', name: 'Keep', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#...#', '#####'] });
  fixture(kg, { id: 'fx_town', name: 'Town', kind: 'town', start: { x: 2, y: 1, facing: WEST }, rows: ['#########', '#.......#', '#########'],
    exits: [{ x: 1, y: 1, to: OUTDOORS, tx: 216, ty: 34 }, { x: 7, y: 1, to: 'fx_keep', tx: 1, ty: 1 }] }, [2, 1, WEST]);
  kp.brains = [aims];
  kp.toggle(kg);
  const chosen: string[] = [];
  for (let t = 0; t < 4 && !(kp.aim && kp.aim.kind === 'explore' && kp.aim.map !== 'fx_town'); t++) { drive(kg, [null]); chosen.push(kp.aim ? JSON.stringify(kp.aim) : 'none'); }
  const land = routeLengths(knownOf(kg), 'fx_town', 2, 1, WEST).get('1,1')!, gate = routeLengths(knownOf(kg), 'fx_town', 2, 1, WEST).get('7,1')!;
  ok(companyLevel(kg.party) === 1 && land < gate && kp.aim?.kind === 'explore' && kp.aim.map === 'fx_keep' && kp.goal?.x === 7 && kp.goal.y === 1,
    `walked out, the town's own gate to a map not visited comes before the land's, ${land} keys to ${gate} (${chosen.join(' then ')})`);

  // Lost for good: the one map visited walked out, no way off it, the goal given up and nothing gained
  // since: the pilot stops, saying so; with a thing gained since, the goal is tried again.
  const cell = (gain: boolean): Game => {
    const ng = hiredGame(), np = ng.pilot!, given = knownOf(ng).goals()[0];
    fixture(ng, { id: 'fx_cell', name: 'Cell', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#...#', '#####'] }, [1, 1, EAST]);
    for (const id of Object.keys(ng.world.state.maps)) if (id !== 'fx_cell') delete ng.world.state.maps[id];
    np.brains = [aims];
    np.toggle(ng);
    np.aim = { kind: 'quest', quest: THE_QUEST.id, map: given.map!, text: given.text };
    np.aimGoal = given.text;
    np.aimSince = ng.world.state.minutes - LOST_MINUTES;
    drive(ng, [null]);
    if (gain) ng.party.bag.push('rations');
    for (let t = 0; t < 3 && np.on; t++) drive(ng, [null]);
    return ng;
  };
  const stuck = cell(false), gained = cell(true);
  ok(!stuck.pilot!.on && stuck.pilot!.stopped?.[0] === 'Lost: no way on that I can see.' && gained.pilot!.on && gained.pilot!.aim?.kind === 'quest',
    `every aim given up and nothing gained: the pilot stops ("${stuck.pilot!.stopped?.[0]}"); a thing gained, the goal is tried again (${JSON.stringify(gained.pilot!.aim)})`);

  // A fight fled: its square is gone round until the company stands whole again.
  const fg = piloted(), fp = fg.pilot!;
  fixture(fg, { id: 'fx_fled', name: 'Fled', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['######', '#....#', '#.##.#', '#....#', '######'] }, [2, 1, EAST]);
  fp.brains = [route];
  fp.toggle(fg);
  const fs = startCombat(fg.party, [{ id: 'fx_fled_g', monsters: ['rat'] }], fg.rng), fscreen = new CombatScreen(fs, ['fx_fled_g']);
  fg.push(fscreen);
  drive(fg, [null]);
  fs.outcome = 'fled';
  fg.pop();
  fg.world.travel('fx_fled', 1, 1, EAST);
  fg.party.members[0].hp = Math.floor(fg.party.members[0].maxHp / 2);
  fp.goal = { map: 'fx_fled', x: 4, y: 1, name: 'the far corner' };
  const kept: string[] = [];
  for (let t = 0; t < 12 && fp.goal; t++) { drive(fg, [null]); kept.push(`${fg.world.state.x},${fg.world.state.y}`); }
  const remembered = fp.fled.map((q) => `${q.map}:${q.x},${q.y}`).join();
  fg.party.members[0].hp = fg.party.members[0].maxHp;
  drive(fg, [null]);
  ok(remembered === 'fx_fled:2,1' && !kept.includes('2,1') && kept.at(-1) === '4,1' && fp.fled.length === 0,
    `the square a fight was fled from is gone round while one is hurt (${remembered}; ${kept.join(' ')}), and forgotten once the company is whole`);

  // Rations: the pilot's own rest wants two a head, so the next rest is not walked for; buying, it buys for six rests.
  const lean = piloted(), lp2 = lean.pilot!, lsorc = lean.party.members.find((c) => c.cls === 'sorcerer')!;
  lean.world.travel('harrow', 7, 10, NORTH);
  lean.world.ensureMapState('harrow').explored.fill(-1);
  lsorc.sp = 0;
  lean.party.food = 2 * lean.party.members.length - 1;
  const lt0 = lean.world.state.minutes;
  lp2.brains = [keep];
  lp2.toggle(lean);
  drive(lean, Array(6).fill(null));
  const inn = piloted(), ip = inn.pilot!, innDoor = inn.maps.harrow.features.find((f) => f.kind === 'inn' && inn.world.present(f))!;
  inn.world.travel('harrow', innDoor.x, innDoor.y, NORTH);
  inn.party.food = 0;
  inn.party.gold = 500;
  ip.brains = [keep];
  ip.toggle(inn);
  drive(inn, Array(40).fill(null));
  ok(lean.world.state.minutes === lt0 && lsorc.sp === 0 && inn.party.food >= FOOD_RESTS * inn.party.members.length,
    `with under two rations a head the pilot's own rule does not rest (${lean.world.state.minutes - lt0} minutes); at the inn it buys for ${FOOD_RESTS} rests (${inn.party.food} rations)`);

  // The journal's pages: the wand handed in before Crowness, Thornmark's chapter begun and the shelf's not done: its goal comes first.
  const jg = piloted(), jk = knownOf(jg);
  for (const f of ['q_ashcombe', 'q_wenna', 'q_ashcombe_done']) jg.party.flags[f] = 1;
  const pages = jk.goals().filter((q) => q.quest === THE_QUEST.id), shelfGoal = THE_QUEST.chapters[0].goals.find((q) => q.at === 'downs_e3' && holds(q.when, jg.world.state, jg.party));
  const jaim = chooseAim(jg, jk, jg.pilot!);
  ok(pages.length >= 2 && pages[0].map === 'downs_e3' && pages[0].text === shelfGoal?.text && jaim?.kind === 'quest' && jaim.map === 'downs_e3',
    `Thornmark's chapter begun with the shelf's unfinished: the journal's pages give ${pages.length} goals, the shelf's first, and the aim is it (${pages.map((q) => q.map).join(', ')}; ${JSON.stringify(jaim)})`);

  // A steady walk costs no whole-map search a tick: bound for an inn down a long lane, seen, the quartermaster's want held.
  const wg = piloted(), wp2 = wg.pilot!;
  fixture(wg, { id: 'fx_long', name: 'Long', kind: 'town', start: { x: 1, y: 1, facing: EAST }, rows: ['#'.repeat(122), `#${'.'.repeat(120)}#`, '#'.repeat(122)],
    features: [{ kind: 'inn', x: 120, y: 1, name: 'A Far Inn', price: 12, interior: 'hearthlight_inn' }] }, [1, 1, EAST]);
  wg.party.members[0].hp = 1;
  wg.party.food = 0;
  wp2.brains = [keep, route];
  wp2.toggle(wg);
  drive(wg, Array(5).fill(null));
  const before = searches.lengths, x0 = wg.world.state.x;
  drive(wg, Array(100).fill(null));
  ok(wg.world.state.x - x0 >= 90 && searches.lengths - before <= 3, `100 ticks of a walk to an inn make ${searches.lengths - before} whole-map searches, walking ${wg.world.state.x - x0} squares`);

  // A run's wall-clock budget: with none, a play ends after its first tick, capped by the budget, not done.
  const spent = pilotRun(THE_QUEST.chapters[0], { budget: 0 });
  ok(spent.capped === 'budget' && spent.on && !spent.done && spent.ticks === 1, `a play with no budget left ends capped by the budget (${spent.capped || 'not capped'}, ${spent.ticks} ticks)`);

  // The watchdog, asked last: every other brain silent on the map, the clock stands STUCK_TICKS, then a search passes ten minutes a press.
  const sg = piloted(), sgp = sg.pilot!, m0 = sg.world.state.minutes;
  sgp.brains = [() => null, wait];
  sgp.toggle(sg);
  drive(sg, Array(STUCK_TICKS).fill(null));
  const stood = sg.world.state.minutes;
  drive(sg, Array(3).fill(null));
  ok(BRAINS.at(-1) === wait && stood === m0 && sg.world.state.minutes === m0 + 30 && sgp.why[0] === 'Stuck: waiting a while.',
    `no key for ${STUCK_TICKS} ticks and the clock stands; then a search a tick passes the time (${sg.world.state.minutes - m0} minutes; "${sgp.why[0]}")`);

  // A group in the only way is gone through, the fight the bot's; with a way round, it is gone round.
  const rg = piloted(), held = (): Known => ({ ...knownOf(rg), groups: () => [{ x: 3, y: 1 }] });
  fixture(rg, { id: 'fx_lane', name: 'Lane', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['######', '#....#', '######'] }, [1, 1, EAST]);
  const through = routeOn(held(), 'fx_lane', 1, 1, EAST, 4, 1);
  fixture(rg, { id: 'fx_ring', name: 'Ring', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['######', '#....#', '#.##.#', '#....#', '######'] }, [1, 1, EAST]);
  const round = routeOn(held(), 'fx_ring', 1, 1, EAST, 4, 1);
  ok(!!through && walk(1, 1, EAST, through).includes('3,1') && !!round && !walk(1, 1, EAST, round).includes('3,1') && walk(1, 1, EAST, round).at(-1) === '4,1',
    `a group in the only way is routed through (${through && walk(1, 1, EAST, through).join(' ')}), and round where a way round is seen (${round && walk(1, 1, EAST, round).join(' ')})`);
}

/**
 * Riddles (#721, §6) and the ending's real question (§7). A statue is read off its box and tried
 * with the words heard alone, typed a key a tick into the box as the keyboard types them: the Downs'
 * stone, its hint heard as the game says it (the old man's song, by Space on him), is answered within
 * five tries, a HOW MANY riddle by its number words in ascending order; with nothing heard there is
 * no answer. Five tries at most, each word once, the riddle's own words never. Wenna's question at
 * the Heart, the Hearth chapter's, asked through the game, stops the pilot with its band up.
 */
function riddles(): void {
  const features = (id: string): Feature[] => MAP_DEFS.find((d) => d.id === id)?.features ?? [];
  const stone = features('downs_e2').find((f) => f.kind === 'statue')!;
  const song = features('downs_f3').find((f) => f.kind === 'npc' && f.name === 'An old man mending nets')!;
  /** The pilot, talk alone, stood on a statue for `ticks`: the words tried there, the box's word each tick it is up, the boxes opened and the why lines. */
  const read = (g: Game, map: string, x: number, y: number, ticks = 60): { tried: string[]; typed: string[]; opened: number; whys: string[] } => {
    const p = g.pilot!, at = g.world.locate(map, x, y), typed: string[] = [], whys: string[] = [];
    g.world.travel(map, x, y, NORTH);
    for (const s of Object.values(g.world.mapState.groups)) s.dead = g.world.state.minutes;
    p.brains = [talk];
    p.toggle(g);
    let opened = 0;
    for (let t = 0; t < ticks; t++) {
      const was = g.top instanceof RiddleScreen;
      drive(g, [null]);
      if (g.top instanceof RiddleScreen) { typed.push(g.top.word); if (!was) opened++; }
      if (whys.at(-1) !== p.why[0]) whys.push(p.why[0]);
    }
    return { tried: [...p.tried.get(`${at.mapId}:${at.x},${at.y}`) ?? []], typed, opened, whys };
  };

  // The Downs' stone with the old man's song heard: "one", then "ten", each typed a key a tick; the gift given.
  const hg = piloted();
  hg.world.travel('downs_f3', song.x, song.y, EAST);
  drive(hg, ['interact']);
  while (hg.top instanceof MessageScreen) drive(hg, ['interact']);
  const sung = hg.pilot!.heard.some((l) => l.includes('Ten for the Hearth')), gold = hg.party.gold;
  const heard = read(hg, 'downs_e2', stone.x, stone.y);
  ok(sung && hg.world.used(stone.id) && hg.party.gold === gold + 30 && heard.tried.join() === 'one,ten' && heard.tried.length <= TRIES && heard.opened === 2
    && heard.typed.join(' ') === ' o on one  t te ten' && heard.whys.includes('Trying TEN.') && !hg.input!.textMode && hg.top instanceof ExploreScreen,
    `the Downs' stone, the song heard: answered within ${TRIES} tries, its number words in ascending order, typed a key a tick (${heard.tried.join(', ')}; "${heard.typed.join('|')}"; ${hg.party.gold - gold} gold)`);

  // With nothing heard: the box read once, no word tried, "I have no answer for the stone." said into the log, and the stone left.
  const ng = piloted(), none = read(ng, 'downs_e2', stone.x, stone.y);
  ok(!ng.world.used(stone.id) && none.tried.length === 0 && none.opened === 1 && ng.log.includes(NO_ANSWER) && !ng.input!.textMode && ng.top instanceof ExploreScreen,
    `the Downs' stone with nothing heard: read once, nothing tried, "${NO_ANSWER}" in the log (${none.opened} opened; ${ng.log.slice(-2).join(' / ')})`);

  // A miller's stone (a fixture), its hint said: the overlap's words, the longer first, never the riddle's own; five at most, each once.
  const millGame = (answer: string): Game => {
    const g = piloted();
    fixture(g, row('fx_mill', 3, [{ kind: 'statue', x: 2, y: 1, id: 'fx_mill_stone', text: 'A millstone on its edge.', riddle: 'WHAT DOES THE MILLER GRIND AT DAWN?', answer, gift: { gold: 5 }, done: 'The stone is quiet.' }]), [2, 1, NORTH]);
    g.say('"The miller grinds at dawn: oats, barley, rye, beans, peas and chaff. Oats again at dusk."');
    return g;
  };
  const mill = (answer: string): { g: Game; r: ReturnType<typeof read> } => { const g = millGame(answer); return { g, r: read(g, 'fx_mill', 2, 1, 80) }; };
  const right = mill('barley'), wrong = mill('peas'), tries = wrong.r.whys.filter((w) => w.startsWith('Trying '));
  ok(right.g.world.used('fx_mill_stone') && right.r.tried.join() === 'grinds,barley' && answers('WHAT DOES THE MILLER GRIND AT DAWN?', right.g.pilot!.heard).slice(0, 2).join() === 'grinds,barley',
    `a riddle's words from a line heard that shares two with it, the longer first: answered on the second try (${right.r.tried.join(', ')})`);
  ok(!wrong.g.world.used('fx_mill_stone') && wrong.r.tried.join() === 'grinds,barley,beans,chaff,again' && tries.length === TRIES && new Set(tries).size === TRIES
    && wrong.r.opened === TRIES + 1 && wrong.g.log.includes(NO_ANSWER) && wrong.g.top instanceof ExploreScreen,
    `five tries at most, each once and none the riddle's own, then "${NO_ANSWER}" in the log and the stone left (${tries.join(' ')}; ${wrong.r.opened} opened)`);

  // A word the viewer cuts off (the helm taken and Esc, as main.ts sends a key) is no try: at the helm again, the pilot types it afresh.
  const cg = millGame('barley'), cp = cg.pilot!;
  cp.brains = [talk];
  cp.toggle(cg);
  drive(cg, [null, null, null]);
  const cut = cg.top instanceof RiddleScreen ? cg.top.word : '';
  cp.toggle(cg);
  drive(cg, ['cancel']);
  const untried = (cp.tried.get('fx_mill:2,1')?.size ?? 0) === 0 && cg.top instanceof ExploreScreen;
  cp.toggle(cg);
  drive(cg, Array(30).fill(null));
  ok(cut === 'gr' && untried && cg.world.used('fx_mill_stone') && [...cp.tried.get('fx_mill:2,1') ?? []].join() === 'grinds,barley',
    `a word cut off by the viewer's Esc is no try: typed again from its start, then the next (${cut}, ${untried}; ${[...cp.tried.get('fx_mill:2,1') ?? []].join(', ')})`);

  // The ending's real question: Wenna's at the Heart (the Hearth chapter's, each answer an ending), asked through
  // the game as she is met, with the third answer too where Fane's map is held. The pilot closes her words, then
  // stops under the question with its band up; nothing is answered and no ending is reached; a key takes the band down.
  const last = THE_QUEST.chapters.at(-1)!, ends = new Set([last.done].flat().flatMap((c) => [c.flag ?? []].flat()));
  for (const [map, choice] of [[false, CHOICE_TWO], [true, CHOICE_THREE]] as const) {
    const eg = piloted(), ep = eg.pilot!, wenna = features('core').find((f) => f.kind === 'npc' && f.choice === CHOICE_TWO)!;
    Object.assign(eg.party.flags, { [VASK_FALLEN]: 1, [VOICE_WHOLE]: 1 }, map ? { meridian_map: 1 } : {});
    eg.world.travel('core', wenna.x, wenna.y + 1, NORTH);
    for (const s of Object.values(eg.world.mapState.groups)) s.dead = eg.world.state.minutes;
    drive(eg, ['forward']);
    ep.brains = [talk];
    ep.toggle(eg);
    let ended = false;
    for (let t = 0; t < 30; t++) { drive(eg, [null]); ended ||= eg.top instanceof EndingScreen; }
    const q = eg.top instanceof ChoiceScreen ? eg.top : undefined, band = ep.band()?.lines[0];
    drive(eg, ['down']);
    ok(!!q && q.ends && q.options.join() === choice.answers.map((a) => a.label).join() && choice.answers.every((a) => [a.sets ?? []].flat().some((s) => ends.has(s)))
      && !ep.on && band === 'The choice is yours.' && !ended && !Object.values(ENDINGS).some((e) => eg.party.flags[e.flag]) && ep.band() === null,
      `Wenna's question at the Heart${map ? ', Fane\'s map held' : ''}, each answer the Hearth chapter's end, is marked and stops the pilot: nothing answered, the band up and gone at the next key (${q?.options.join(' / ')}; "${band}")`);
  }
}
