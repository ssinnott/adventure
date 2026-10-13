// The pilot's frame (#716): what Known lets it see and keeps from it, what it has heard and been shown
// and when it forgets them, the P and T keys and any other, its pace, a fight handed to the bot, a message read and
// closed, the why line with no brain to ask, a wipe's why over the title and P there. The navigator
// (#717): a route over seen squares, a secret door a wall to it, a stop stepped over by routeOn, a
// group known only in sight and walked round, every group known to the omniscient and none on another
// map, a person, a den, a business, a way off and a tear walked round and walked onto when bound there,
// driven round them, over a person or a den with no way round, its question answered with nothing, and
// never over a business or a person in a doorway, Saltmouth's quay past its stevedore, driven with her
// offer let go, a person in a doorway driven to and the trip done on the step onto him, a corner door
// with a person in it driven past, a gated way off and a locked business bound for and shut, with the
// line each was refused with, and tried afresh on the next goal, tidal ground shut at high water and
// walked at low, of two ways into a map the open one, of two by a map between the one open the whole
// way, and the other once a group is seen on the first, never back to it, Helmstow by its postern, a
// lock refused on one map and not on the next, water and a mountain as the company can cross them, the
// ways between the maps it has been to and no others, a map out of reach from the outdoors given up on
// with each square read about once, the outdoors by a zone's id, a Rift by its tear, a walk to a
// square, driven, and a key taking the helm back, a fight and a message on the way, a parley on the
// way left up and said so, a way off as the goal, a goal fled off and walked back onto, a new goal on
// the way planned for afresh, a route planned again after a flight, the way out from the square landed
// on by each side, round a lock and at it when it is the only way, and none when sealed in, a lock
// refused and walked round, a way shut after three refusals, with no line once the log has lost it,
// its why lines, and a new game or a load bound nowhere. The explorer (#718): the frontier, a room's
// door out and nothing inside it; the suspects, a dead end's end wall and nothing on open floor;
// Helmstow walked out, every square of it seen; a secret door at a dead end searched and found, a
// wall that hides nothing searched once from each side; a lock and a gate shut to it and come back
// to with a key and a flag; a group across the only way on gone at and fought, and under a truce
// stepped over; and the outdoors, the zone it stands in, and one beyond its strength left alone until
// preferred. The quartermaster (#719): what the company needs, by the harness's rule and the reserve; the
// gear a shop betters it with for the gold over the reserve; rest where it stands; the inn's room
// taken, at its door and walked to for want of rations, and the rations it could not pay for not sought
// again; the dead raised at the temple; a sword bought and taken up through the sheet; a level trained
// at a trainer whose levels it had not seen; and a well that did nothing remembered, and one that
// restores drunk from.
import { GameMap } from '../../src/game/map.ts';
import type { Exit, Feature, MapDef } from '../../src/game/map.ts';
import { NORTH, EAST, WEST, SOUTH, FACING_DX, FACING_DY, turnLeft, turnRight } from '../../src/game/types.ts';
import type { Facing } from '../../src/game/types.ts';
import { Game, ExploreScreen } from '../../src/game/game.ts';
import type { Store } from '../../src/game/save.ts';
import { seen as seenBit } from '../../src/game/world.ts';
import { defaultParty, equip, hasCondition, trainPrice, xpForLevel } from '../../src/game/party.ts';
import { item } from '../../src/game/items.ts';
import { restRefused } from '../../src/game/wilds.ts';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { companyAt } from '../harness.ts';
import { CombatScreen } from '../../src/ui/combat.ts';
import { ChoiceScreen, InteriorScreen, MessageScreen, SheetScreen } from '../../src/ui/screens.ts';
import { RiddleScreen } from '../../src/ui/riddle.ts';
import { TitleScreen } from '../../src/ui/title.ts';
import { Pilot, BRAINS, IDLE, HEARD_MAX } from '../../src/game/pilot/pilot.ts';
import { knownOf } from '../../src/game/pilot/known.ts';
import type { Known, Sighted } from '../../src/game/pilot/known.ts';
import { route, routeOn, walkOn, nearestOn, routeMaps, HELD } from '../../src/game/pilot/route.ts';
import { explore, frontier, suspects, SEARCHING, CLEARING } from '../../src/game/pilot/explore.ts';
import { keep, need, better, reserve, spare, WELL_STEPS } from '../../src/game/pilot/keep.ts';
import type { Action } from '../../src/input.ts';
import { ok, headlessGame, drive } from './lib.ts';

// The frame's fixtures go on Helmstow's features as written, shared by every game, so they all go
// again once its checks are done, whether they end or throw, and the navigator walks Helmstow as written.
export function pilot(): void {
  const helmstow = headlessGame(4).maps.harrow.features as Feature[], had = [...helmstow];
  try { check(); } finally { helmstow.splice(had.length); }
  const after = headlessGame(4).maps.harrow.features;
  ok(after.length === had.length && after.every((f, i) => f === had[i]), `the fixtures gone, a new game's Helmstow has its ${had.length} features as before (${after.length})`);
  // The navigator's checks are its own: the explorer, which makes a goal wherever it has none, is held
  // back from them, and back after, whether they end or throw.
  const brains = BRAINS.splice(0, BRAINS.length, route);
  try { navigator(); } finally { BRAINS.splice(0, BRAINS.length, ...brains); }
  ok(BRAINS.length === 3 && BRAINS[0] === keep && BRAINS[1] === route && BRAINS[2] === explore, 'the brains are asked in order: the quartermaster, the navigator, then the explorer');
  explorer();
  quartermaster();
}

function check(): void {
  const g = headlessGame(4), p = (g.pilot = new Pilot({ instant: true }));
  const { x, y } = g.world.state, m = g.maps.harrow;
  const corner = [[0, 0], [m.width - 1, 0], [0, m.height - 1], [m.width - 1, m.height - 1]].sort(([ax, ay], [bx, by]) => Math.abs(bx - x) + Math.abs(by - y) - Math.abs(ax - x) - Math.abs(ay - y))[0];
  ok(knownOf(g).seen('harrow', x, y) && !knownOf(g).seen('harrow', corner[0], corner[1]), `Known has the start square in Helmstow seen and its far corner, ${corner.join(',')}, not`);

  // What the automap draws: a chest on the start square, and not the event beside it.
  (m.features as Feature[]).push({ kind: 'chest', x, y, id: 'fx_chest', gold: 5, items: [] }, { kind: 'event', x, y, id: 'fx_event', text: 'A cold wind.' });
  const drawn = knownOf(g).features('harrow');
  ok(drawn.some((f) => f.kind === 'chest' && f.id === 'fx_chest') && !drawn.some((f) => f.kind === 'event'), `Known's features hold a chest on a seen square and leave out the event on it (${drawn.map((f) => f.kind).join(', ')})`);

  // What is said or shown only by talking or a menu: a statue's riddle and answer, a person's question and crossings.
  (m.features as Feature[]).push(
    { kind: 'statue', x, y, id: 'fx_statue', name: 'A fixture statue', text: 'A stone face.', riddle: 'What has ten toes and no feet?', answer: 'ten', gift: { gold: 5 }, done: 'The face is still.' },
    { kind: 'npc', x, y, name: 'A fixture boatman', lines: ['"Over the water?"'], choice: { ask: 'Cross?', answers: [{ label: 'Yes', sets: 'fx_cross', says: ['"Then come."'] }] },
      passage: [{ to: 'thornhold', x: 7, y: 14, name: 'Thornhold', by: 'boat', fare: 10, departs: 6, days: 1, arrives: 18 }] },
  );
  const told = knownOf(g).features('harrow');
  const statue = told.find((f) => f.kind === 'statue' && f.id === 'fx_statue'), boatman = told.find((f) => f.kind === 'npc' && f.name === 'A fixture boatman');
  ok(!!statue && !('riddle' in statue) && !('answer' in statue) && !!boatman && !('choice' in boatman) && !('passage' in boatman),
    `Known's features hold no statue's riddle or answer and no person's question or crossings (${JSON.stringify([statue, boatman])})`);

  // What a menu shows, Known once the menu has shown it and not before: a shop's wares as its Buy
  // menu opens, a trainer's levels as its menu does, a person's crossings as they are offered.
  (m.features as Feature[]).push(
    { kind: 'shop', x, y, name: 'A fixture stall', stock: ['torch'], interior: 'harrow_provisioner' },
    { kind: 'trainer', x, y, name: 'A fixture master', maxLevel: 5, interior: 'harrow_provisioner' },
    { kind: 'npc', x, y, name: 'A fixture ferryman', lines: ['"Over the water?"'], passage: [{ to: 'thornhold', x: 7, y: 14, name: 'Thornhold', by: 'boat', fare: 10, departs: 6, days: 1, arrives: 18 }] },
  );
  const sighted = (name: string): Record<string, unknown> => ({ ...knownOf(g).features('harrow').find((f) => 'name' in f && f.name === name) });
  const named = (name: string): Feature => (m.features as Feature[]).find((f) => 'name' in f && f.name === name)!;
  const pick = (label: string): void => { const c = g.top; if (c instanceof ChoiceScreen && c.options.includes(label)) { c.sel = c.options.indexOf(label); g.update('interact'); } };
  g.interact(named('A fixture stall'));
  pick('Buy and sell');
  const wares = [sighted('A fixture stall')];
  pick('Buy');
  wares.push(sighted('A fixture stall'));
  while (g.screens.length > 1) g.pop();
  g.interact(named('A fixture master'));
  const levels = [sighted('A fixture master')];
  pick('Train');
  levels.push(sighted('A fixture master'));
  while (g.screens.length > 1) g.pop();
  g.interact(named('A fixture ferryman'));
  const ways = [sighted('A fixture ferryman')];
  g.update('interact');
  ways.push(sighted('A fixture ferryman'));
  while (g.screens.length > 1) g.pop();
  ok(!('stock' in wares[0]) && (wares[1].stock as string[] | undefined)?.join() === 'torch' && !('maxLevel' in levels[0]) && levels[1].maxLevel === 5 && !('passage' in ways[0]) && (ways[1].passage as { to: string }[] | undefined)?.[0]?.to === 'thornhold',
    `a shop's wares, a trainer's levels and a person's crossings are Known once the Buy menu, the trainer's and the offer show them, and not before (${JSON.stringify([wares, levels, ways])})`);
  // A new game forgets what the menus showed: the company that never opened them is not told.
  g.newGame(4);
  const untold = ['A fixture stall', 'A fixture master', 'A fixture ferryman'].map(sighted);
  ok(untold.every((f) => 'name' in f && !('stock' in f) && !('maxLevel' in f) && !('passage' in f)),
    `a new game, the stall, the trainer and the ferryman are seen and their wares, levels and crossings not Known (${JSON.stringify(untold)})`);
  // The trainer and the ferryman go again, out of the way of the rest; the stall stays, as it was.
  (m.features as Feature[]).splice(-2);

  // Of every feature the content places, seen, no more than its kind, square, id and name: no sign's
  // reading, chest's gold, den's keepers, shrine's gift, rift's way, person's flag, or when it is there.
  // Of every exit and every tear into a Rift, nothing of what opens it or what it says on arrival.
  const o = headlessGame(4);
  o.pilot = new Pilot({ instant: true, omniscient: true });
  const ko = knownOf(o), SEEN = ['kind', 'x', 'y', 'id', 'name'], ids = Object.keys(o.maps);
  const placed = ids.flatMap((id) => ko.features(id)), more = placed.flatMap((f) => Object.keys(f).filter((q) => !SEEN.includes(q)).map((q) => `${f.kind}.${q}`));
  const scraps = ko.features('ironfells_n3').find((f) => f.kind === 'sign' && f.id === 'n3_scraps'), cache = ko.features('downs_f2').find((f) => f.kind === 'chest' && f.id === 'f2_cache');
  ok(placed.length > 500 && !more.length && JSON.stringify(scraps) === '{"kind":"sign","x":28,"y":12,"id":"n3_scraps"}' && JSON.stringify(cache) === '{"kind":"chest","x":11,"y":2,"id":"f2_cache"}',
    `of the ${placed.length} features placed, seen, Known gives no more than each one's kind, square, id and name (${[...new Set(more)].join(', ') || JSON.stringify([scraps, cache])})`);
  const exits = ids.flatMap((id) => ko.exits(id)), written = ids.flatMap((id) => o.maps[id].exits), tears = ids.flatMap((id) => o.maps[id].features.flatMap((f) => (f.kind === 'rift' ? [f] : [])));
  const opened = exits.filter((e) => 'label' in e || 'needFlag' in e || 'shut' in e || 'blockedText' in e), gated = written.filter((e) => e.needFlag || e.shut).length;
  ok(exits.length === written.length + tears.length && tears.length > 0 && written.some((e) => e.label) && tears.some((f) => f.label) && gated > 0 && !opened.length,
    `of the ${written.length} exits and ${tears.length} tears, ${gated} gated and every one with a line on arrival, Known gives none of what opens one or what it says (${JSON.stringify(opened.slice(0, 2))})`);

  // A den burnt shows as ash, as the automap inks it, and a standing one does not.
  const lair = (zone: string): Sighted | undefined => ko.features(zone).find((f) => f.kind === 'den'), den = lair('deepthorn_i3');
  o.world.travel('deepthorn_i3', den?.x ?? 0, den?.y ?? 0);
  o.world.markUsed('i3_den');
  const ash = lair('deepthorn_i3'), still = lair('eaves_j3');
  ok(!!den && !('ash' in den) && ash?.kind === 'den' && ash.id === 'i3_den' && ash.ash === true && !!still && !('ash' in still),
    `Known gives a burnt den its ash and a standing one none (${JSON.stringify([ash, still])})`);

  // A riddle put is heard as the statue puts it.
  g.interact((m.features as Feature[]).find((f) => f.kind === 'statue' && f.id === 'fx_statue')!);
  const riddle = g.top;
  if (riddle instanceof RiddleScreen) riddle.update(g, 'cancel');
  ok(riddle instanceof RiddleScreen && p.heard.includes('What has ten toes and no feet?'), 'a statue\'s riddle, put, is heard');

  // A secret door, as movement's fixtures build a map: inked as a wall, and the square past it unseen.
  // On the near side a way, a chest and a ghost not risen; past the door a way and a hoard.
  const vault: MapDef = { id: 'fx_vault', name: 'Vault', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#.S.#', '#####'],
    exits: [{ x: 1, y: 1, to: 'harrow', tx: 1, ty: 1 }, { x: 3, y: 1, to: 'harrow', tx: 1, ty: 1 }],
    features: [
      { kind: 'chest', x: 1, y: 1, id: 'fx_near', gold: 5, items: [] },
      { kind: 'npc', x: 1, y: 1, name: 'A fixture ghost', lines: ['"Boo."'], after: { flag: 'fx_risen' } },
      { kind: 'chest', x: 3, y: 1, id: 'fx_hoard', gold: 50, items: [] },
    ] };
  const v = headlessGame(4);
  v.maps.fx_vault = new GameMap(vault);
  v.world.travel('fx_vault', 1, 1, EAST);
  const kv = knownOf(v), door = kv.cell('fx_vault', 2, 1), past = kv.cell('fx_vault', 3, 1);
  ok(door?.solid === 'wall' && door.door === 'none' && !('ch' in door) && past === undefined, `Known inks a seen secret door as a wall and the square past it not at all (${JSON.stringify([door, past])})`);
  const inVault = (): string => kv.features('fx_vault').map((f) => ('id' in f && f.id) || ('name' in f && f.name)).join(', ');
  const near = kv.exits('fx_vault'), kept = inVault();
  ok(near.length === 1 && near[0].x === 1 && kept === 'fx_near',
    `of the vault's ways and features, Known has those on seen squares and drawn: the near way and chest, not the ghost not risen or what is past the door (${JSON.stringify(near)}; ${kept})`);
  v.world.markUsed('fx_near');
  v.party.flags.fx_risen = 1;
  const risen = inVault();
  ok(risen === 'A fixture ghost', `the chest opened, Known has it gone, and the ghost risen there (${risen})`);
  ok(kv.visited().join() === 'harrow,fx_vault', `Known has visited Helmstow and the vault, and nothing more (${kv.visited().join(', ')})`);
  // A locked door, seen and not tried, inked as any door is: the pilot learns the lock by trying it.
  v.maps.fx_lockup = new GameMap({ id: 'fx_lockup', name: 'Lock-up', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#.L.#', '#####'] });
  v.world.travel('fx_lockup', 1, 1, EAST);
  const lock = kv.cell('fx_lockup', 2, 1);
  ok(v.maps.fx_lockup.at(2, 1).door === 'locked' && lock?.door === 'door' && lock.solid === 'none', `Known inks a locked door, seen and not tried, as a door like any other (${JSON.stringify(lock)})`);

  const k = knownOf(g);
  ok(!!k.placeOf('thornmark') && k.placeOf('no_such_map') === undefined, `Known places Thornmark on the world map, at ${k.placeOf('thornmark')?.map((n) => n.toFixed(1)).join(',')}, and no map that is not`);

  p.toggle(g);
  ok(p.on && knownOf(g).heard.includes('The pilot takes the helm.'), 'P hands the pilot the helm, and it hears its own line');

  // T cycles the pace and leaves it the helm; any other key takes the helm back and is the screen's.
  const tempos = [0, 1, 2].map(() => (p.press(g, 'tempo') ? p.tempo : 0));
  const turned = p.press(g, 'turnLeft'), back = p.on, again = p.press(g, 'pilot');
  ok(tempos.join() === '2,4,1' && !turned && !back && p.heard.includes('You take the helm.') && again && p.on,
    `T sets the pace 2, 4 and 1 times, any other key takes the helm back and goes on to the screen, and P hands it over again (${tempos.join(', ')}; ${turned}, ${back}, ${again})`);

  // Through a zone's id, the outdoors at the zone's own squares (World.locate), and nothing past its edge.
  g.world.travel('shelf', 16, 4);
  const z = g.world.locate('shelf', 0, 0), kz = knownOf(g), cz = kz.cell('shelf', 16, 4);
  const zway = ko.exits('shelf').find((e) => e.to === 'harrow'), zsights = ko.features('shelf'), wide = ko.features(z.mapId);
  ok(kz.seen('shelf', 16, 4) && !!cz && JSON.stringify(cz) === JSON.stringify(kz.cell(z.mapId, z.x + 16, z.y + 4)) && !ko.seen('shelf', 32, 0) && ko.seen(z.mapId, z.x + 32, z.y)
    && !!zway && ko.exits(z.mapId).some((e) => e.to === 'harrow' && e.x === zway.x + z.x && e.y === zway.y + z.y)
    && zsights.length > 0 && zsights.every((f) => wide.some((c) => JSON.stringify({ ...c, x: c.x - z.x, y: c.y - z.y }) === JSON.stringify(f))),
    `through the Foreland's id, Known reads the outdoors at the zone's squares, ${z.x},${z.y} on: its square seen, its cell, its way to Helmstow at ${zway?.x},${zway?.y} and its ${zsights.length} features, and nothing past its edge`);

  g.fight(['road_rats']);
  const fight = g.top, handed = p.next(g);
  ok(handed === null && fight instanceof CombatScreen && fight.auto, 'a fight on top the pilot hands to the bot, and presses nothing');
  // P mid-fight takes the fight back from the bot with the helm, and P again hands both over at once.
  const dropped = p.press(g, 'pilot') && !p.on && fight instanceof CombatScreen && !fight.auto;
  const retaken = p.press(g, 'pilot') && p.on && fight instanceof CombatScreen && fight.auto;
  ok(dropped && retaken, `P mid-fight takes the fight back from the bot, and P again hands it over before the next beat (${dropped}, ${retaken})`);
  let ticks = 0;
  for (; ticks < 4000 && g.top === fight; ticks++) g.update(null);
  ok(g.top !== fight && g.top instanceof ExploreScreen, `ticked with nothing pressed, the fight plays itself out, in ${ticks} ticks (${fight instanceof CombatScreen ? fight.state.outcome : '?'})`);

  g.message('A fixture note.');
  ok(g.top instanceof MessageScreen && p.heard.includes('A fixture note.') && p.next(g) === 'interact', 'a message on top the pilot hears as it opens, and reads and closes with Space');
  // Paced as watched: a beat every 15, 8 or 4 ticks at 1, 2 or 4 times.
  const beats = ([1, 2, 4] as const).map((t) => {
    const q = new Pilot();
    q.on = true; q.tempo = t;
    let n = 0;
    for (let i = 0; i < 60; i++) if (q.next(g) === 'interact') n++;
    return n;
  });
  ok(beats.join() === '4,7,15', `not instant, it presses 4, 7 and 15 keys in 60 ticks at 1, 2 and 4 times (${beats.join(', ')})`);
  g.pop();

  const brains = BRAINS.splice(0);
  p.why = ['Bound for nowhere.'];
  const idle = p.next(g);
  BRAINS.push(...brains);
  ok(idle === null && p.why[0] === IDLE && IDLE === 'Nothing to do.', `with no brain to ask, it presses nothing and says so (${p.why.join(' ')})`);

  // A wipe: the next step goes to the title, and the pilot gives the helm back and says why there.
  // Before it, the stall's Buy menu shows its wares again.
  g.interact(named('A fixture stall'));
  pick('Buy and sell');
  pick('Buy');
  const shown = sighted('A fixture stall');
  while (g.screens.length > 1) g.pop();
  g.say('The answer is ten.');
  for (const c of g.party.members) c.conditions = ['dead'];
  g.update('forward');
  ok(g.top instanceof TitleScreen && !p.on && p.stopped && p.why[0] === 'The company has fallen.', `a wipe turns the pilot off, its why left up over the title (${p.why.join(' ')})`);

  // P on the title: a new game, on a random seed with a company mustered at random, that has heard
  // nothing of the last and says nothing of it. Another wipe and P again draw another company.
  const premade = defaultParty(makeRng(1)).members.map((c) => `${c.name} ${c.race} ${c.cls}`).join(', ');
  const muster = (): string => g.party.members.map((c) => `${c.name} ${c.race} ${c.cls}`).join(', ');
  const taken = p.press(g, 'pilot'), company = muster();
  ok(taken && p.on && !p.stopped && p.why[0] === IDLE && g.top instanceof ExploreScreen && g.party.members.length === 6 && company !== premade && !p.heard.includes('The answer is ten.') && !p.heard.includes('You take the helm.') && p.heard.includes('The pilot takes the helm.'),
    `P on the title starts a new game with a company at random (${company}), and the pilot has heard nothing of the last and says nothing of it (${p.why.join(' ')})`);
  const unshown = sighted('A fixture stall');
  ok((shown.stock as string[] | undefined)?.join() === 'torch' && 'name' in unshown && !('stock' in unshown),
    `the stall's wares, Known as the Buy menu shows them, are forgotten as P on the title starts a new game (${JSON.stringify([shown, unshown])})`);
  g.gameOver();
  p.press(g, 'pilot');
  const redrawn = muster();
  ok(p.on && redrawn !== company && redrawn !== premade, `P on the title again draws another company (${redrawn})`);

  // A save loaded: the pilot has heard nothing of the company before it.
  const box = new Map<string, string>(), store: Store = { getItem: (k) => box.get(k) ?? null, setItem: (k, v) => void box.set(k, v), removeItem: (k) => void box.delete(k) };
  const l = new Game(store), lp = (l.pilot = new Pilot({ instant: true }));
  l.newGame(4);
  l.saveGame();
  l.say('The answer is ten.');
  ok(l.loadGame() && !lp.heard.includes('The answer is ten.') && lp.heard.join() === 'Loaded.', `a save loaded, the pilot has heard only that (${lp.heard.join(' / ')})`);
  // A wipe with the player at the helm: the pilot has nothing to say over the title.
  l.gameOver();
  ok(l.top instanceof TitleScreen && !lp.on && !lp.stopped && lp.why[0] === IDLE, `a wipe with the player at the helm leaves no why of the pilot's over the title (${lp.why.join(' ')})`);

  // What it has heard is kept to the last 2000 lines, the oldest dropped first.
  const q = new Pilot();
  for (let i = 0; i <= HEARD_MAX; i++) q.hear(`Line ${i}.`);
  ok(HEARD_MAX === 2000 && q.heard.length === HEARD_MAX && q.heard[0] === 'Line 1.' && q.heard[HEARD_MAX - 1] === `Line ${HEARD_MAX}.`,
    `of ${HEARD_MAX + 1} lines heard, the pilot keeps the last ${q.heard.length}, from "${q.heard[0]}"`);
}

/** Marks a square seen on the automap, or with no square the whole map, as walking there would. */
function see(g: Game, map: string, x?: number, y?: number): void {
  const bits = g.world.state.maps[map].explored, i = y === undefined || x === undefined ? -1 : y * g.maps[map].width + x;
  if (i < 0) bits.fill(-1); else bits[i >> 5] |= 1 << (i & 31);
}

/** The squares a party stands on, pressing `keys` from (x, y, f): forward a step, a turn none. */
function walked(keys: readonly Action[], x: number, y: number, f: Facing): string[] {
  const at = [`${x},${y}`];
  for (const key of keys) {
    if (key === 'turnLeft') f = turnLeft(f);
    else if (key === 'turnRight') f = turnRight(f);
    else if (key === 'forward') { x += FACING_DX[f]; y += FACING_DY[f]; at.push(`${x},${y}`); }
  }
  return at;
}

function navigator(): void {
  // A corridor with a turn, as movement's fixtures build a map: east along the top, then south. From
  // its west end, facing the wall, the way is two turns, the length of it, a turn and the rest.
  const g = headlessGame(4);
  g.maps.fx_bend = new GameMap({ id: 'fx_bend', name: 'Bend', kind: 'dungeon', start: { x: 1, y: 1, facing: WEST }, rows: ['#######', '#.....#', '#####.#', '#####.#', '#######'] });
  g.world.travel('fx_bend', 1, 1, WEST);
  for (let sy = 0; sy < 5; sy++) for (let sx = 0; sx < 7; sx++) if (sx !== 5 || sy !== 3) see(g, 'fx_bend', sx, sy);
  const k = knownOf(g), short = k.seen('fx_bend', 5, 2) && !k.seen('fx_bend', 5, 3), unseen = routeOn(k, 'fx_bend', 1, 1, WEST, 5, 3);
  see(g, 'fx_bend', 5, 3);
  const bend = routeOn(k, 'fx_bend', 1, 1, WEST, 5, 3);
  ok(short && unseen === null && bend?.join() === 'turnLeft,turnLeft,forward,forward,forward,forward,turnRight,forward,forward',
    `along a corridor with a turn, from its end facing away, the route is two turns, four steps, a turn and two steps, and none while the far end alone is unseen (${bend?.join(', ')}; ${short}, ${unseen})`);

  // A secret door in the wall between two squares, and a way round below: a wall to the navigator,
  // though the map as written lets the party through, until a search finds it.
  g.maps.fx_door = new GameMap({ id: 'fx_door', name: 'Door', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#.S.#', '#.#.#', '#...#', '#####'] });
  g.world.travel('fx_door', 1, 1, EAST);
  see(g, 'fx_door');
  const lets = g.maps.fx_door.at(2, 1).door === 'secret' && g.maps.fx_door.passable(2, 1) === 'ok';
  const round = routeOn(k, 'fx_door', 1, 1, EAST, 3, 1) ?? [], by = walked(round, 1, 1, EAST);
  for (let i = 0; i < 20 && !g.world.search(); i++);
  const through = routeOn(k, 'fx_door', 1, 1, EAST, 3, 1);
  ok(lets && round.length === 9 && by.at(-1) === '3,1' && !by.includes('2,1') && through?.join() === 'forward,forward',
    `a secret door the map lets the party through is a wall to the navigator, which goes the long way round, ${round.length} keys by ${by.join(' ')}, until a search finds it (${through?.join(', ')})`);

  // A ring, from its corner to the square two east: two steps by the top, nine keys round by the
  // bottom. A group in sight on the top, and it goes round. A stop there, a person, a den, a business,
  // a way off or a tear into a Rift: routeOn, as #717 gives it, goes over it, and the brain's route
  // goes round it, and walks onto it when bound there, never over it. The group is known only while it
  // is in sight: faced away from, it is not.
  const r = headlessGame(4), kr = knownOf(r);
  const ring = (id: string, more: Partial<MapDef>, by = routeOn): Action[] | null => {
    r.maps[id] = new GameMap({ id, name: 'Ring', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#...#', '#.#.#', '#...#', '#####'], ...more });
    r.world.travel(id, 1, 1, EAST);
    see(r, id);
    return by(kr, id, 1, 1, EAST, 3, 1);
  };
  const bare = ring('fx_ring', {}), held = ring('fx_held', { encounters: [{ id: 'fx_band', x: 2, y: 1, monsters: ['brigand'], roams: false }] }), sighted = kr.groups('fx_held').length;
  r.world.travel('fx_held', 1, 1, WEST);
  const behind = kr.groups('fx_held').length;
  // To the omniscient pilot of the headless run every live group on the map is known, in sight or not,
  // and none on another map, though the map it stands on has one on the same square.
  r.pilot = new Pilot({ instant: true, omniscient: true });
  const ko = knownOf(r), unsighted = ko.groups('fx_held').length, elsewhere = ko.groups('fx_ring').length;
  const stops = ([
    ['fx_met', { features: [{ kind: 'npc', x: 2, y: 1, name: 'A fixture warden', lines: ['"Halt."'] }] }],
    ['fx_lair', { features: [{ kind: 'den', x: 2, y: 1, id: 'fx_den', text: 'A fixture den.', breeds: ['rat'], keepers: 'fx_keep', brood: [], ask: 'Burn it?', burn: 'Burn it.', burnt: 'It burns.', gold: 0, items: [] }] }],
    ['fx_inn', { features: [{ kind: 'inn', x: 2, y: 1, name: 'A fixture inn', price: 10, interior: 'hearthlight_inn' }] }],
    ['fx_gone', { exits: [{ x: 2, y: 1, to: 'harrow', tx: 1, ty: 1 }] }],
    ['fx_torn', { features: [{ kind: 'rift', x: 2, y: 1, id: 'fx_tear', to: 'harrow', tx: 1, ty: 1 }] }],
  ] as [string, Partial<MapDef>][]).map(([id, more]) => ({ over: ring(id, more)?.join(), round: ring(id, more, walkOn), onto: walkOn(kr, id, 1, 1, EAST, 2, 1) }));
  const rounds = [held, ...stops.map((s) => s.round)].map((keys) => keys?.length === 9 && !walked(keys, 1, 1, EAST).includes('2,1'));
  ok(bare?.join() === 'forward,forward' && sighted === 1 && behind === 0 && unsighted === 1 && elsewhere === 0 && rounds.every(Boolean) && stops.every((s) => s.over === 'forward,forward' && s.onto?.join() === 'forward'),
    `round a ring it goes the long way, nine keys, past a group in sight, and the brain's route past a person, a den, a business, a way off or a tear (${rounds.join(', ')}), where routeOn goes over each (${stops.map((s) => s.over).join('; ')}), and walks onto each stop when bound there (${stops.map((s) => s.onto?.join()).join('; ')}); the group is Known in sight and not faced away from (${sighted}, ${behind}), to the omniscient faced away from too (${unsighted}), and from another map not at all (${elsewhere})`);

  // Driven round a wider ring to its far corner, a way round by the bottom and on the top a stair
  // down to a cellar whose way up lands behind it, an inn, a person with a question or a den with
  // its keepers dead: it goes round by the bottom, never carried off, inside or asked, and is bound
  // nowhere. With no way round a person or a den in the open, it goes over, and a question put as it
  // passes it answers with nothing and walks on; with none round the inn or a person in a doorway, it
  // has none, and never steps onto them.
  const lap = (more: Partial<MapDef>): string => {
    const c = headlessGame(4), cp = (c.pilot = new Pilot({ instant: true }));
    c.maps.fx_cellar = new GameMap({ id: 'fx_cellar', name: 'Cellar', kind: 'dungeon', start: { x: 2, y: 1, facing: EAST }, rows: ['#####', '#...#', '#####'], exits: [{ x: 1, y: 1, to: 'fx_lap', tx: 2, ty: 1, tf: EAST }] });
    c.maps.fx_lap = new GameMap({ id: 'fx_lap', name: 'Lap', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#######', '#.....#', '#.###.#', '#.....#', '#######'], ...more });
    c.world.travel('fx_cellar', 2, 1, EAST);
    see(c, 'fx_cellar');
    c.world.travel('fx_lap', 1, 1, EAST);
    see(c, 'fx_lap');
    // The den's keepers lie dead, so a step onto it puts the question.
    c.world.mapState.groups.fx_lap_keep = { x: 1, y: 3, dead: 0 };
    cp.toggle(c);
    cp.goal = { map: 'fx_lap', x: 5, y: 1, name: 'the far corner' };
    let off = 0, met = 0, over = 0;
    for (let t = 0, on = false; t < 400 && cp.goal; t++) {
      drive(c, [null]);
      if (c.world.state.mapId !== 'fx_lap') off++;
      if (c.top instanceof ChoiceScreen) met++;
      const was = on;
      on = c.world.state.mapId === 'fx_lap' && c.world.state.x === 3 && c.world.state.y === 1;
      if (on && !was) over++;
    }
    const answered = cp.heard.filter((l) => l.includes('Pass, friend') || l === 'It burns.').length;
    return `${c.world.state.x},${c.world.state.y} ${off} ${met} ${over} ${answered} ${JSON.stringify(cp.goal)} ${cp.why[0]}`;
  };
  const warden: Feature = { kind: 'npc', x: 3, y: 1, name: 'A fixture warden', lines: ['"Halt."'], choice: { ask: '"Who goes there?"', answers: [{ label: 'A friend', says: ['"Pass, friend."'] }] } };
  const lair: Feature = { kind: 'den', x: 3, y: 1, id: 'fx_lap_den', text: 'A fixture den.', breeds: ['rat'], keepers: 'fx_lap_keep', brood: [], ask: 'Burn it?', burn: 'Burn it.', burnt: 'It burns.', gold: 0, items: [] };
  const laps = [
    lap({ exits: [{ x: 3, y: 1, to: 'fx_cellar', tx: 2, ty: 1, tf: EAST }] }),
    lap({ features: [{ kind: 'inn', x: 3, y: 1, name: 'A fixture inn', price: 10, interior: 'hearthlight_inn' }] }),
    lap({ features: [warden] }),
    lap({ features: [lair] }),
  ];
  const corridor = ['#######', '#.....#', '#######'];
  const straight = lap({ rows: corridor, features: [{ kind: 'npc', x: 3, y: 1, name: 'A fixture warden', lines: ['"Halt."'] }] });
  const passed = [lap({ rows: corridor, features: [warden] }), lap({ rows: corridor, features: [lair] })];
  const shopfront = lap({ rows: corridor, features: [{ kind: 'inn', x: 3, y: 1, name: 'A fixture inn', price: 10, interior: 'hearthlight_inn' }] });
  const porch = lap({ rows: ['#######', '#..D..#', '#######'], features: [{ kind: 'npc', x: 3, y: 1, name: 'A fixture porter', lines: ['"Mind the step."'] }] });
  ok(laps.every((l) => l === `5,1 0 0 0 0 null ${IDLE}`) && straight === `5,1 0 0 1 0 null ${IDLE}` && passed.every((l) => l === `5,1 0 1 1 0 null ${IDLE}`)
    && shopfront === '1,1 0 0 0 0 null No way to the far corner that I have seen.' && porch === shopfront,
    `driven to a ring's far corner it goes round a stair, an inn, a person and a den on the top (${laps.join('; ')}); with no way round a person in the open it goes over him (${straight}), and over a person and a den whose questions it answers with nothing in a beat (${passed.join('; ')}); with none round the inn or a person in a doorway, it has none and stands where it was (${shopfront}; ${porch})`);

  // Saltmouth's quay, its stevedore between the street and the Telhus, the Sail Loft and Kitto: there
  // is no way to them that does not step onto her, so the brain's route goes over her, and never
  // through a door on the way; and the way to her ends on her.
  const sm = headlessGame(4), ks = knownOf(sm);
  sm.world.travel('saltmouth', 6, 10, SOUTH);
  see(sm, 'saltmouth');
  const quay = ks.features('saltmouth').flatMap((f) => f.kind === 'npc' && f.y === 10 && f.x > 8 ? [f.name] : []);
  const ways = [[12, 9], [14, 9], [14, 10], [11, 10]].map(([tx, ty]) => { const keys = walkOn(ks, 'saltmouth', 6, 10, SOUTH, tx, ty); return keys ? walked(keys, 6, 10, SOUTH) : []; });
  const reached = ways.map((at) => at.at(-1) ?? 'none'), doors = ways.flatMap((at) => at.slice(0, -1).filter((q) => q.endsWith(',9')));
  ok(quay[0] === 'Baukje the stevedore' && reached.join(' ') === '12,9 14,9 14,10 11,10' && ways.slice(0, 3).every((at) => at.includes('11,10')) && !doors.length,
    `in Saltmouth, with ${quay.join(' and ')} on the quay, the way to the Telhus, the Sail Loft and Kitto goes over the stevedore and through no door short of them, and the way to her ends on her (${reached.join(' ')}; ${ways[0].join(' ')})`);
  // Driven there with a barbarian in the company: the stevedore's offer of a prestige, put as it
  // passes over her, it answers with nothing in a beat, and walks on into the Telhus.
  const tb = headlessGame(4), tbp = (tb.pilot = new Pilot({ instant: true })), rising = tb.party.members[0];
  rising.cls = 'barbarian';
  tb.world.travel('saltmouth', 6, 10, SOUTH);
  see(tb, 'saltmouth');
  tbp.toggle(tb);
  tbp.goal = { map: 'saltmouth', x: 12, y: 9, name: 'the Telhus' };
  let offered = 0;
  for (let t = 0; t < 200 && tbp.goal; t++) { drive(tb, [null]); if (tb.top instanceof ChoiceScreen && tb.top.title === quay[0] && tbp.goal) offered++; }
  const telhus = `${tb.world.state.x},${tb.world.state.y}`;
  ok(offered === 1 && telhus === '12,9' && tbp.goal === null && tb.screens.some((s) => s instanceof InteriorScreen) && !rising.prestige,
    `bound for the Telhus with a barbarian in the company, the stevedore's offer is up ${offered} beat as it passes over her, taken by no one, and it is in the Telhus at ${telhus}, bound nowhere (${JSON.stringify(tbp.goal)})`);

  // Driven to a person in a doorway, the Regent-Warden in the keep: the step onto him, taken, ends
  // the trip, so the visit that opens is another brain's, and out on the street again it never steps
  // back on. From that step it presses nothing but Space to read his words.
  const rw = headlessGame(4), rwp = (rw.pilot = new Pilot({ instant: true }));
  rw.world.travel('keep', 7, 8, NORTH);
  see(rw, 'keep');
  rwp.toggle(rw);
  rwp.goal = { map: 'keep', x: 7, y: 4, name: 'the Regent-Warden' };
  let audiences = 0;
  const since: Action[] = [];
  for (let t = 0, was = ''; t < 400; t++) {
    const key = rwp.next(rw);
    if (audiences && key) since.push(key);
    rw.update(key);
    const now = `${rw.world.state.x},${rw.world.state.y}`;
    if (now === '7,4' && was !== '7,4') audiences++;
    was = now;
  }
  const street = `${rw.world.state.x},${rw.world.state.y}`;
  ok(audiences === 1 && since.join() === 'interact' && street === '7,5' && rw.top instanceof ExploreScreen && rwp.goal === null,
    `bound for the Regent-Warden, from the step onto him it presses only ${since.join(', ')} and is bound nowhere, and out on the street at ${street} it steps onto him ${audiences} time in 400 ticks`);

  // Bound for a stop whose step is refused, a way off behind a gate and a business behind a lock,
  // with a line more said after each refusal: each is counted as any is, three shut it with the line
  // it was refused with, and the why line says so. Bound there again, it tries it afresh, and three
  // more shut it again, kept once.
  const barred = (more: Partial<MapDef>): string => {
    const c = headlessGame(4), cp = (c.pilot = new Pilot({ instant: true }));
    c.maps.fx_bar = new GameMap({ id: 'fx_bar', name: 'Bar', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#...#', '#####'], ...more });
    c.world.travel('fx_bar', 1, 1, EAST);
    see(c, 'fx_bar');
    cp.toggle(c);
    const from = c.log.length, refusals = ['The way is closed.', 'Locked. A key would open it.'];
    for (let n = 0; n < 2; n++) {
      cp.goal = { map: 'fx_bar', x: 3, y: 1, name: 'the far door' };
      for (let t = 0; t < 20; t++) { drive(c, [null]); if (refusals.includes(c.log.at(-1) ?? '')) c.say('A gull cries.'); }
    }
    const refused = c.log.slice(from).filter((s) => refusals.includes(s)).length;
    return `${c.world.state.x},${c.world.state.y} ${refused} ${cp.shut.length} ${JSON.stringify(cp.shut[0])} ${JSON.stringify(cp.goal)} ${cp.why.join(' / ')}`;
  };
  const gated = barred({ exits: [{ x: 3, y: 1, to: 'harrow', tx: 1, ty: 1, needFlag: 'fx_never' }] });
  const closed = barred({ rows: ['#####', '#..L#', '#####'], features: [{ kind: 'shop', x: 3, y: 1, name: 'A fixture stall', stock: ['torch'], interior: 'harrow_provisioner' }] });
  ok(gated === '2,1 6 1 {"map":"fx_bar","x":3,"y":1,"why":"The way is closed."} null The far door is shut to me.'
    && closed === '2,1 6 1 {"map":"fx_bar","x":3,"y":1,"why":"Locked. A key would open it."} null The far door is shut to me.',
    `bound for a gated way off and a locked business, each is refused three times and shut with its own line, not the one said after, and bound there again, it is tried afresh and shut again, kept once (${gated}; ${closed})`);

  // Tidal ground at high water, with no swimmer in the company: Known has no tide, so the step onto it
  // is tried, refused three times with the tide's line and shut. Six hours on, at low water, bound
  // there again, it walks over.
  const td = headlessGame(4), tdp = (td.pilot = new Pilot({ instant: true }));
  for (const m of td.party.members) if (m.race === 'tidefolk') m.conditions = ['dead'];
  td.maps.fx_sand = new GameMap({ id: 'fx_sand', name: 'Sand', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#.;.#', '#####'] });
  td.world.travel('fx_sand', 1, 1, EAST);
  see(td, 'fx_sand');
  tdp.toggle(td);
  const sands = (): string => {
    const from = tdp.heard.length;
    tdp.goal = { map: 'fx_sand', x: 3, y: 1, name: 'the far sand' };
    drive(td, Array(10).fill(null));
    return `${td.world.tide} ${tdp.heard.slice(from).filter((s) => s === 'The tide is in. The sands will show again.').length} ${td.world.state.x},${td.world.state.y} ${tdp.why[0]}`;
  };
  const high = sands();
  td.world.advance(6 * 60);
  const low = sands();
  ok(high === 'high 3 1,1 The far sand is shut to me.' && low === `low 0 3,1 ${IDLE}` && JSON.stringify(tdp.shut) === '[{"map":"fx_sand","x":2,"y":1,"why":"The tide is in. The sands will show again."}]',
    `tidal ground at high water is refused three times and shut (${high}), and six hours on, at low water, bound there again, it walks over (${low}; ${JSON.stringify(tdp.shut)})`);

  // Two ways into Helmstow, the first listed behind water the company cannot cross, or behind a gate:
  // it takes the other, refused at the gate once and not shut.
  const pair = (rows: string[], exits: Exit[]): string => {
    const c = headlessGame(4), cp = (c.pilot = new Pilot({ instant: true }));
    for (const m of c.party.members) if (m.race === 'tidefolk') m.conditions = ['dead'];
    c.maps.fx_pair = new GameMap({ id: 'fx_pair', name: 'Pair', kind: 'dungeon', start: { x: 3, y: 1, facing: EAST }, rows, exits });
    c.world.travel('fx_pair', 3, 1, EAST);
    see(c, 'fx_pair');
    cp.toggle(c);
    cp.goal = { map: 'harrow', x: 13, y: 14, name: 'Helmstow' };
    drive(c, Array(40).fill(null));
    return `${c.world.state.mapId} ${c.world.state.x},${c.world.state.y} ${c.log.filter((s) => s === 'The way is closed.').length} ${cp.shut.length} ${JSON.stringify(cp.goal)}`;
  };
  const wet = pair(['#######', '#.~...#', '#######'], [{ x: 1, y: 1, to: 'harrow', tx: 7, ty: 14 }, { x: 5, y: 1, to: 'harrow', tx: 13, ty: 14 }]);
  const gate = pair(['#######', '#.....#', '#######'], [{ x: 5, y: 1, to: 'harrow', tx: 7, ty: 14, needFlag: 'fx_never' }, { x: 1, y: 1, to: 'harrow', tx: 13, ty: 14 }]);
  ok(wet === 'harrow 13,14 0 0 null' && gate === 'harrow 13,14 1 0 null',
    `of two ways into Helmstow it takes the open one, past one behind water it cannot cross (${wet}) and one behind a gate, refused once (${gate})`);

  // Two ways to a room two maps off, by a map whose way on, listed first, is behind water the company
  // cannot cross or a gate, and by one whose way on is open: it takes the open one, never near the
  // water and back from the gate once refused, and never back again. With the open way's map not yet
  // walked, the gate is shut after three; walked, and bound there again, the gate turns it back once.
  // The way into the first map gives no facing: the party lands facing as it walked.
  const relay = (b: string, gate: Partial<Exit>, later: boolean): string => {
    const c = headlessGame(4), cp = (c.pilot = new Pilot({ instant: true }));
    for (const m of c.party.members) if (m.race === 'tidefolk') m.conditions = ['dead'];
    const room = (id: string, mid: string, exits: Exit[]): void => { c.maps[id] = new GameMap({ id, name: 'Room', kind: 'dungeon', start: { x: 3, y: 1, facing: EAST }, rows: ['#######', mid, '#######'], exits }); };
    room('fx_a', '#.....#', [{ x: 1, y: 1, to: 'fx_b', tx: 3, ty: 1 }, { x: 5, y: 1, to: 'fx_d', tx: 3, ty: 1, tf: EAST }]);
    room('fx_b', b, [{ x: 1, y: 1, to: 'fx_a', tx: 2, ty: 1, tf: EAST }, { x: 5, y: 1, to: 'fx_c', tx: 3, ty: 1, tf: EAST, ...gate }]);
    room('fx_d', '#.....#', [{ x: 1, y: 1, to: 'fx_a', tx: 4, ty: 1, tf: WEST }, { x: 5, y: 1, to: 'fx_c', tx: 3, ty: 1, tf: EAST }]);
    room('fx_c', '#.....#', [{ x: 1, y: 1, to: 'fx_a', tx: 3, ty: 1, tf: EAST }]);
    cp.toggle(c);
    const walk = (ids: string[]): string => {
      for (const id of ids) { c.world.travel(id, 3, 1, EAST); see(c, id); }
      const from = cp.heard.length, went = [c.world.state.mapId];
      cp.goal = { map: 'fx_c', x: 4, y: 1, name: 'the far room' };
      for (let t = 0; t < 400 && cp.goal; t++) { drive(c, [null]); if (c.world.state.mapId !== went.at(-1)) went.push(c.world.state.mapId); }
      return `${went.length > 9 ? `${went.length - 1} maps` : went.join('>')} ${cp.heard.slice(from).filter((s) => s === 'The way is closed.').length} ${c.world.state.x},${c.world.state.y} ${cp.why[0]}`;
    };
    return later ? `${walk(['fx_c', 'fx_b', 'fx_a'])}; ${walk(['fx_d', 'fx_a'])}` : walk(['fx_c', 'fx_d', 'fx_b', 'fx_a']);
  };
  const flooded = relay('#...~.#', {}, false), once = relay('#.....#', { needFlag: 'fx_never' }, false), retried = relay('#.....#', { needFlag: 'fx_never' }, true);
  ok(flooded === `fx_a>fx_d>fx_c 0 4,1 ${IDLE}` && once === `fx_a>fx_b>fx_a>fx_d>fx_c 1 4,1 ${IDLE}` && retried === `fx_a>fx_b 3 4,1 The far room is shut to me.; fx_a>fx_b>fx_a>fx_d>fx_c 1 4,1 ${IDLE}`,
    `of two ways to a room two maps off, it takes the one open the whole way, past water on the other (${flooded}) and back from a gate on it once refused (${once}); with the open way unwalked the gate is shut, and walked, it turns it back once on the next goal (${retried})`);

  // The same, the first by a corridor a group stands in, in sight from the square it lands on: it
  // turns back, and from the map before, where Known has no group on the corridor, it takes the other
  // way and never goes back, with no fight.
  const ward = headlessGame(4), wp = (ward.pilot = new Pilot({ instant: true }));
  const hall = (id: string, exits: Exit[], more: Partial<MapDef> = {}): void => { ward.maps[id] = new GameMap({ id, name: 'Hall', kind: 'dungeon', start: { x: 2, y: 1, facing: EAST }, rows: ['#######', '#.....#', '#######'], exits, ...more }); };
  hall('fx_e', [{ x: 1, y: 1, to: 'fx_f', tx: 2, ty: 1, tf: EAST }, { x: 5, y: 1, to: 'fx_g', tx: 2, ty: 1, tf: EAST }]);
  hall('fx_f', [{ x: 1, y: 1, to: 'fx_e', tx: 3, ty: 1, tf: WEST }, { x: 5, y: 1, to: 'fx_h', tx: 2, ty: 1, tf: EAST }], { encounters: [{ id: 'fx_sentry', x: 4, y: 1, monsters: ['rat'], roams: false }] });
  hall('fx_g', [{ x: 1, y: 1, to: 'fx_e', tx: 3, ty: 1, tf: WEST }, { x: 5, y: 1, to: 'fx_h', tx: 2, ty: 1, tf: EAST }]);
  hall('fx_h', []);
  for (const id of ['fx_h', 'fx_g', 'fx_f', 'fx_e']) { ward.world.travel(id, 3, 1, WEST); see(ward, id); }
  wp.toggle(ward);
  wp.goal = { map: 'fx_h', x: 4, y: 1, name: 'the far room' };
  const warded = [ward.world.state.mapId];
  let fought = 0;
  for (let t = 0; t < 400 && wp.goal; t++) {
    drive(ward, [null]);
    if (ward.world.state.mapId !== warded.at(-1)) warded.push(ward.world.state.mapId);
    if (ward.top instanceof CombatScreen) fought++;
  }
  const sentry = `${warded.length > 9 ? `${warded.length - 1} maps` : warded.join('>')} ${fought} ${ward.world.state.x},${ward.world.state.y} ${JSON.stringify(wp.goal)}`;
  ok(sentry === 'fx_e>fx_f>fx_e>fx_g>fx_h 0 4,1 null',
    `of two ways to a room two maps off, the first by a corridor with a group in sight from where it lands, it turns back and takes the other, never back to the group from the map before, unfought (${sentry})`);

  // Outside Helmstow after Act II with an orcblood in the company, both its gates seen: the south gate,
  // listed first, turns it back once, and it goes in by the harbour postern.
  const hg = headlessGame(4), hgp = (hg.pilot = new Pilot({ instant: true }));
  hg.party.members[0].race = 'orcblood';
  hg.party.flags.q_salt_done = 1;
  hg.world.travel('shelf', 16, 4, NORTH);
  const fore = hg.world.locate('shelf', 0, 0);
  for (let sy = 2; sy < 7; sy++) for (let sx = 13; sx < 22; sx++) see(hg, 'caldera', fore.x + sx, fore.y + sy);
  hgp.toggle(hg);
  hgp.goal = { map: 'harrow', x: 13, y: 14, name: 'Helmstow' };
  drive(hg, Array(40).fill(null));
  const postern = `${hg.world.state.mapId} ${hg.world.state.x},${hg.world.state.y}`, turned = hg.log.filter((s) => s.startsWith('A sergeant steps into the gate')).length;
  ok(postern === 'harrow 13,14' && turned === 1 && !hgp.shut.length && hgp.goal === null,
    `outside Helmstow after Act II with an orcblood in the company, the south gate turns it back ${turned} time and it goes in by the harbour postern (${postern}; ${JSON.stringify(hgp.shut)})`);

  // Refused at a lock on one map, it goes round it to the way down; below, on the same square of a map
  // with no lock, it goes straight over.
  const u = headlessGame(4), up = (u.pilot = new Pilot({ instant: true }));
  u.maps.fx_low = new GameMap({ id: 'fx_low', name: 'Low', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#...#', '#.#.#', '#...#', '#####'] });
  u.maps.fx_high = new GameMap({ id: 'fx_high', name: 'High', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#.L.#', '#.#.#', '#...#', '#####'], exits: [{ x: 3, y: 1, to: 'fx_low', tx: 1, ty: 1, tf: EAST }] });
  u.world.travel('fx_low', 1, 1, EAST);
  see(u, 'fx_low');
  u.world.travel('fx_high', 1, 1, EAST);
  see(u, 'fx_high');
  up.toggle(u);
  up.goal = { map: 'fx_low', x: 3, y: 1, name: 'the far side below' };
  const under: string[] = [];
  for (let t = 0; t < 60 && up.goal; t++) {
    drive(u, [null]);
    const sq = `${u.world.state.x},${u.world.state.y}`;
    if (u.world.state.mapId === 'fx_low' && under.at(-1) !== sq) under.push(sq);
  }
  const locks = u.log.filter((s) => s === 'Locked. A key would open it.').length;
  ok(locks === 1 && under.join(' ') === '1,1 2,1 3,1' && up.goal === null,
    `refused ${locks} time at a lock on one map, it goes round it to the way down, and below, where that square is open, straight over it (${under.join(' ')})`);

  // Driven past a corner door, a person in it with a room of their own, Kilnhaven's harbourmaster and
  // Saltmouth's locksmith: a step onto it goes in, and out is back where it stepped from, so it goes
  // round by the street to the square past it and is never inside with its goal set.
  const doorway = (map: string, x: number, y: number, f: Facing, tx: number, ty: number, door: number[]): string => {
    const c = headlessGame(4), cp = (c.pilot = new Pilot({ instant: true }));
    c.world.travel(map, x, y, f);
    see(c, map);
    const kept = knownOf(c).features(map).flatMap((q) => q.kind === 'npc' && q.x === door[0] && q.y === door[1] ? [q.name] : []);
    cp.toggle(c);
    cp.goal = { map, x: tx, y: ty, name: 'the street' };
    let inside = 0;
    for (let t = 0; t < 400; t++) { drive(c, [null]); if (c.screens.some((s) => s instanceof InteriorScreen) && cp.goal) inside++; }
    return `${kept[0]}: ${c.world.state.x},${c.world.state.y} ${inside} ${JSON.stringify(cp.goal)}`;
  };
  const harbour = doorway('kilnhaven', 4, 5, EAST, 5, 4, [5, 5]), locksmith = doorway('saltmouth', 5, 10, NORTH, 6, 8, [5, 9]);
  ok(harbour === 'The Harbourmaster\'s Office: 5,4 0 null' && locksmith === 'Pender the locksmith: 6,8 0 null',
    `past a corner door with a person in it, it goes round by the street, never inside with its goal set, and is bound nowhere (${harbour}; ${locksmith})`);

  // Water, then a mountain, across a passage: the company crosses the water while its tidefolk
  // swims, and the mountain once it has a Mountaineer.
  const w = headlessGame(4), kw = knownOf(w);
  w.maps.fx_ford = new GameMap({ id: 'fx_ford', name: 'Ford', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#######', '#.~.M.#', '#######'] });
  w.world.travel('fx_ford', 1, 1, EAST);
  see(w, 'fx_ford');
  const wade = routeOn(kw, 'fx_ford', 1, 1, EAST, 3, 1), sheer = routeOn(kw, 'fx_ford', 3, 1, EAST, 5, 1);
  for (const c of w.party.members) if (c.race === 'tidefolk') c.conditions = ['dead'];
  const dry = routeOn(kw, 'fx_ford', 1, 1, EAST, 3, 1);
  w.party.flags.skill_mountaineer = 1;
  const climbed = routeOn(kw, 'fx_ford', 3, 1, EAST, 5, 1);
  ok(wade?.join() === 'forward,forward' && dry === null && sheer === null && climbed?.join() === 'forward,forward',
    `across water while the company swims (${wade?.join()}), and not with its tidefolk down (${dry}); over a mountain with a Mountaineer (${climbed?.join()}), and not without (${sheer})`);

  // Helmstow to the keep: no way while the gatehouse is unseen, and one exit once it is.
  const h = headlessGame(4), kh = knownOf(h), before = routeMaps(kh, 'harrow', 'keep');
  see(h, 'harrow', 7, 0);
  const keep = routeMaps(kh, 'harrow', 'keep');
  ok(before === null && keep?.length === 1 && keep[0].map === 'harrow' && keep[0].exit.x === 7 && keep[0].exit.y === 0 && keep[0].exit.to === 'keep',
    `from Helmstow to the keep there is no way while the gatehouse is unseen, and one exit once its square, 7,0, is seen (${JSON.stringify(keep)})`);

  // The outdoors by a zone's id: from Helmstow to the Foreland is the south gate, and from the
  // Foreland to the Downs no exit at all, just walking.
  const z = headlessGame(4), kz = knownOf(z);
  see(z, 'harrow');
  z.world.travel('shelf', 16, 4);
  const onto = routeMaps(kz, 'harrow', 'shelf'), across = routeMaps(kz, 'shelf', 'downs_f2');
  ok(onto?.length === 1 && onto[0].map === 'harrow' && onto[0].exit.to === 'caldera' && onto[0].exit.x === 7 && onto[0].exit.y === 15 && across?.length === 0,
    `from Helmstow to the Foreland, by its zone's id, is the south gate at ${onto?.[0]?.exit.x},${onto?.[0]?.exit.y}, and from the Foreland to the Downs no exit, just walking (${JSON.stringify(across)})`);

  // Only by the maps it has been to: every square seen, Thornhold is no way from Helmstow while the
  // outdoors between is unwalked, though the outdoors itself is one exit, and two once it is walked.
  const a = headlessGame(4);
  a.pilot = new Pilot({ instant: true, omniscient: true });
  const ka = knownOf(a), out = routeMaps(ka, 'harrow', 'caldera'), unwalked = routeMaps(ka, 'harrow', 'thornhold');
  a.world.travel('shelf', 16, 4);
  const thornhold = routeMaps(ka, 'harrow', 'thornhold');
  ok(out?.length === 1 && unwalked === null && thornhold?.map((s) => `${s.map}>${s.exit.to}`).join() === 'harrow>caldera,caldera>thornhold',
    `with all seen, from Helmstow the outdoors is one exit, and Thornhold past it no way while the outdoors is unwalked, and two exits once it is (${thornhold?.map((s) => `${s.map}>${s.exit.to}`).join(', ')})`);

  // With all seen, on the Foreland and bound for Meridian Camp, both its ways in across water the
  // company cannot reach: it gives up on the plan having read each square it reaches about once, not
  // once for each way in and each search, so a goal out of reach does not hold the game up.
  const mc = headlessGame(4), mcp = (mc.pilot = new Pilot({ instant: true, omniscient: true })), kmc = knownOf(mc), squares = new Set<string>();
  mc.world.travel('shelf', 16, 4, NORTH);
  let reads = 0;
  const counted: Known = { ...kmc, cell: (map, cx, cy) => { reads++; squares.add(`${map} ${cx},${cy}`); return kmc.cell(map, cx, cy); } };
  const camp = mc.maps.meridian_camp.def.start, ins = kmc.exits('caldera').filter((e) => e.to === 'meridian_camp').length;
  mcp.goal = { map: 'meridian_camp', x: camp.x, y: camp.y, name: 'the camp' };
  const given = route(mc, counted, mcp);
  ok(given === null && mcp.why[0] === 'No way to the camp that I have seen.' && ins === 2 && squares.size > 10000 && reads < 2 * squares.size,
    `with all seen, bound from the Foreland for Meridian Camp by its ${ins} ways in, it has no way, and reads ${reads} squares to say so, ${squares.size} of them once or more (${mcp.why[0]})`);

  // Into the Anvil Stone's Rift by its tear on O5, walked through as an exit is: no way while the
  // tear is unseen, and the tear once it is. Driven from beside it, bound for the lanes inside, the
  // pilot steps through and walks on to them.
  const rf = headlessGame(4), rfp = (rf.pilot = new Pilot({ instant: true })), krf = knownOf(rf);
  rf.world.travel('anvil_stone', 7, 14, NORTH);
  see(rf, 'anvil_stone');
  rf.world.travel('kilnsheart_o5', 0, 24, EAST);
  const tear = rf.world.locate('kilnsheart_o5', 12, 16), shy = routeMaps(krf, 'kilnsheart_o5', 'anvil_stone');
  rf.world.travel('kilnsheart_o5', 12, 15, NORTH);
  see(rf, tear.mapId, tear.x, tear.y);
  const rift = routeMaps(krf, 'kilnsheart_o5', 'anvil_stone');
  rfp.toggle(rf);
  rfp.goal = { map: 'anvil_stone', x: 7, y: 13, name: 'the lanes' };
  drive(rf, Array(30).fill(null));
  const lanes = `${rf.world.state.mapId} ${rf.world.state.x},${rf.world.state.y}`;
  ok(shy === null && rift?.length === 1 && rift[0].map === 'caldera' && rift[0].exit.x === tear.x && rift[0].exit.y === tear.y && rift[0].exit.to === 'anvil_stone' && lanes === 'anvil_stone 7,13' && rfp.goal === null,
    `from O5 into the Anvil Stone's Rift there is no way while its tear is unseen, and the tear at ${tear.x},${tear.y} once it is; driven, the pilot steps through and is on the lanes, bound nowhere (${lanes}; ${JSON.stringify(rfp.goal)})`);

  // Driven: the pilot at the helm, bound for a square it has seen six steps up the street, walks there and is bound nowhere.
  const d = headlessGame(4), dp = (d.pilot = new Pilot({ instant: true })), { x, y, facing } = d.world.state;
  see(d, 'harrow', 7, 9); see(d, 'harrow', 7, 8);
  const six = routeOn(knownOf(d), 'harrow', x, y, facing, 7, 8);
  dp.toggle(d);
  dp.goal = { map: 'harrow', x: 7, y: 8, name: 'the high street' };
  drive(d, Array(60).fill(null));
  const stands = `${d.world.state.x},${d.world.state.y}`;
  ok(six?.join() === 'forward,forward,forward,forward,forward,forward' && d.world.state.mapId === 'harrow' && stands === '7,8' && dp.goal === null,
    `the pilot, bound for a seen square six steps away (${six?.join(', ')}), walks there in 60 ticks and is bound nowhere (stands at ${stands}; ${JSON.stringify(dp.goal)})`);
  // A key pressed while it drives takes the helm back and goes on to the screen, as src/main.ts has it.
  drive(d, ['turnLeft']);
  ok(!dp.on && d.world.state.facing === turnLeft(facing) && d.log.at(-1) === 'You take the helm.', `driven, a key pressed takes the helm back and turns the company (${dp.on}, facing ${d.world.state.facing})`);

  // A fight on the way plays out, a message is read and closed, and the walk goes on by the plan it had.
  const i = headlessGame(4), ip = (i.pilot = new Pilot({ instant: true }));
  i.maps.fx_way = new GameMap({ id: 'fx_way', name: 'Way', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#######', '#.....#', '#######', '#.#####', '#######'],
    encounters: [{ id: 'fx_rats', x: 1, y: 3, monsters: ['rat', 'rat', 'rat'], roams: false }] });
  i.world.travel('fx_way', 1, 1, EAST);
  see(i, 'fx_way');
  ip.toggle(i);
  ip.goal = { map: 'fx_way', x: 5, y: 1, name: 'the end of the way' };
  drive(i, [null]);
  const planned = ip.plan, owing = planned.length;
  i.fight(['fx_rats']);
  const brawl = i.top;
  for (let t = 0; t < 4000 && !(i.top instanceof ExploreScreen); t++) drive(i, [null]);
  i.message('A fixture note.');
  drive(i, [null]);
  const read = i.top instanceof ExploreScreen && !!ip.goal;
  drive(i, [null]);
  const kept = ip.plan === planned && planned.length === owing - 1;
  drive(i, Array(30).fill(null));
  const there = `${i.world.state.mapId} ${i.world.state.x},${i.world.state.y}`;
  ok(brawl instanceof CombatScreen && brawl.state.outcome === 'victory' && read && kept && there === 'fx_way 5,1' && ip.goal === null,
    `a fight on the way won and a message read, the pilot walks on by the plan it had, ${owing} keys to press, to the end of the way (${there}; ${read}, ${kept})`);

  // A group that talks, in a nook beside the way, by a person with a question it has to pass over: the
  // group's question, met as it steps onto the person, is not the navigator's to answer, since Esc is
  // the refusal and starts the fight. It presses nothing while the question is up, bound for the far
  // end still, and its why line says so; answered, as talk (#721) will answer it, the fight plays out,
  // the person's question it answers with nothing, and the walk goes on.
  const t = headlessGame(4), tp = (t.pilot = new Pilot({ instant: true }));
  t.maps.fx_toll = new GameMap({ id: 'fx_toll', name: 'Toll', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#######', '#.....#', '###.###', '#######'], features: [warden],
    encounters: [{ id: 'fx_tollers', x: 3, y: 2, monsters: ['rat', 'rat'], roams: false, choice: { ask: '"Toll."', answers: [
      { label: 'Pay', price: 5000, sets: 'fx_toll_paid', says: ['They stand aside.'] }, { label: 'Refuse', fight: true, says: ['They bare their teeth.'] }] } }] });
  t.world.travel('fx_toll', 1, 1, EAST);
  see(t, 'fx_toll');
  tp.toggle(t);
  tp.goal = { map: 'fx_toll', x: 5, y: 1, name: 'the far end' };
  let asked = 0, hailed = 0, tolled: CombatScreen | null = null, waiting = '';
  for (let n = 0; n < 4000 && (tp.goal || !(t.top instanceof ExploreScreen)); n++) {
    drive(t, [null]);
    if (t.top instanceof ChoiceScreen && t.top.words.startsWith('"Toll."') && tp.goal && ++asked === 20) { waiting = tp.why.join(' / '); t.update('cancel'); }
    if (t.top instanceof ChoiceScreen && t.top.title === 'A fixture warden') hailed++;
    if (t.top instanceof CombatScreen) tolled = t.top;
  }
  const tollEnd = `${t.world.state.x},${t.world.state.y}`;
  ok(asked === 20 && waiting === `Bound for the far end. / ${HELD}` && HELD === 'A question bars the way.' && t.log.includes('They bare their teeth.') && tolled?.state.outcome === 'victory'
    && hailed === 1 && !tp.heard.some((l) => l.includes('Pass, friend')) && tollEnd === '5,1' && tp.goal === null,
    `a parley met on a person passed over is left up for ${asked} beats, pressing nothing, its why line saying so (${waiting}), and answered, the fight is won, the person's question is let go in ${hailed} beat and the walk goes on to the far end (${tollEnd}; ${JSON.stringify(tp.goal)})`);

  // Bound for a way off: stepped onto, it carries the party on, and the goal is done, not walked back for.
  const o = headlessGame(4), op = (o.pilot = new Pilot({ instant: true }));
  o.maps.fx_a = new GameMap({ id: 'fx_a', name: 'Above', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['######', '#....#', '######'], exits: [{ x: 4, y: 1, to: 'fx_b', tx: 2, ty: 1, tf: EAST }] });
  o.maps.fx_b = new GameMap({ id: 'fx_b', name: 'Below', kind: 'dungeon', start: { x: 2, y: 1, facing: EAST }, rows: ['#####', '#...#', '#####'], exits: [{ x: 1, y: 1, to: 'fx_a', tx: 3, ty: 1, tf: WEST }] });
  o.world.travel('fx_b', 2, 1, EAST);
  see(o, 'fx_b');
  o.world.travel('fx_a', 1, 1, EAST);
  see(o, 'fx_a');
  op.toggle(o);
  op.goal = { map: 'fx_a', x: 4, y: 1, name: 'the way down' };
  let carried = 0;
  for (let n = 0, was = o.world.state.mapId; n < 200; n++) { drive(o, [null]); if (o.world.state.mapId !== was) { carried++; was = o.world.state.mapId; } }
  const below = `${o.world.state.mapId} ${o.world.state.x},${o.world.state.y}`;
  ok(carried === 1 && below === 'fx_b 2,1' && op.goal === null && op.why.join() === IDLE,
    `bound for the way down, it steps onto it, is carried off ${carried} time to ${below}, and is bound nowhere (${JSON.stringify(op.goal)}; ${op.why.join(' / ')})`);

  // Stepped onto its goal, a fight opens and the company flees back off it: not there, so it walks
  // back on, and is bound nowhere only then.
  const e = headlessGame(4), ep = (e.pilot = new Pilot({ instant: true }));
  e.maps.fx_run = new GameMap({ id: 'fx_run', name: 'Run', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#...#', '#####', '#.###', '#####'],
    encounters: [{ id: 'fx_chasers', x: 1, y: 3, monsters: ['rat'], roams: false }] });
  e.world.travel('fx_run', 1, 1, EAST);
  see(e, 'fx_run');
  ep.toggle(e);
  ep.goal = { map: 'fx_run', x: 2, y: 1, name: 'the middle' };
  drive(e, [null]);
  const onGoal = `${e.world.state.x},${e.world.state.y}`;
  e.fight(['fx_chasers']);
  e.afterCombat(['fx_chasers'], 'fled');
  const fled = `${e.world.state.x},${e.world.state.y}`;
  drive(e, [null]);
  const still = JSON.stringify(ep.goal);
  drive(e, Array(10).fill(null));
  const middle = `${e.world.state.x},${e.world.state.y}`;
  ok(onGoal === '2,1' && fled === '1,1' && still !== 'null' && middle === '2,1' && ep.goal === null,
    `on its goal at ${onGoal}, a fight fled back to ${fled}, it is bound there still (${still}), walks back on to ${middle} and is bound nowhere (${JSON.stringify(ep.goal)})`);

  // A new goal on the way to another: it plans for the new one from where it stands, and what was
  // refused and said on the way to the old is not the new one's. Bound east, then west past a lock
  // with no key, refused there twice, then for the wall beyond it: three refusals more shut it.
  const c = headlessGame(4), cp = (c.pilot = new Pilot({ instant: true }));
  c.maps.fx_turn = new GameMap({ id: 'fx_turn', name: 'Turn', kind: 'dungeon', start: { x: 5, y: 1, facing: EAST }, rows: ['##########', '#..L.....#', '##########'] });
  c.world.travel('fx_turn', 5, 1, EAST);
  see(c, 'fx_turn');
  cp.toggle(c);
  cp.goal = { map: 'fx_turn', x: 8, y: 1, name: 'the east end' };
  drive(c, [null]);
  cp.goal = { map: 'fx_turn', x: 2, y: 1, name: 'the near cell' };
  const west = cp.next(c), aim = walked(west ? [west, ...cp.plan] : [], 6, 1, EAST).at(-1);
  c.update(west);
  for (let t = 0; t < 40 && (cp.trip?.refused.length ?? 0) < 2; t++) drive(c, [null]);
  const twice = cp.trip?.refused.length, from = cp.heard.length;
  cp.goal = { map: 'fx_turn', x: 1, y: 1, name: 'the west wall' };
  drive(c, [null]);
  const unsaid = cp.why.join(' / '), fresh = cp.trip?.refused.length;
  drive(c, Array(10).fill(null));
  const locked = cp.heard.slice(from).filter((s) => s === 'Locked. A key would open it.').length;
  ok(aim === '2,1' && twice === 2 && unsaid === 'Bound for the west wall.' && fresh === 0 && locked === 3 && cp.goal === null && cp.why[0] === 'The west wall is shut to me.' && cp.shut.length === 1,
    `bound east and then west, it plans from 6,1 for the new goal, to ${aim}; refused ${twice} times there and bound past it, the new goal starts with none refused (${fresh}) and nothing said (${unsaid}), and is shut after ${locked} refusals of its own (${cp.why.join(' / ')})`);

  // A flight mid-route: carried off the map with keys still to press, though onto the square and
  // facing its last key would have left it on, it plans again from where it stands, back by the way
  // it has seen, and walks on.
  const f = headlessGame(4), fp = (f.pilot = new Pilot({ instant: true })), kf = knownOf(f);
  f.maps.fx_hall = new GameMap({ id: 'fx_hall', name: 'Hall', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['######', '#....#', '######'] });
  f.maps.fx_cell = new GameMap({ id: 'fx_cell', name: 'Cell', kind: 'dungeon', start: { x: 2, y: 1, facing: EAST }, rows: ['#####', '#...#', '#####'],
    exits: [{ x: 1, y: 1, to: 'fx_hall', tx: 1, ty: 1, tf: EAST }] });
  f.world.travel('fx_cell', 2, 1, EAST);
  see(f, 'fx_cell');
  f.world.travel('fx_hall', 1, 1, EAST);
  see(f, 'fx_hall');
  fp.toggle(f);
  fp.goal = { map: 'fx_hall', x: 4, y: 1, name: 'the end of the hall' };
  drive(f, [null]);
  const left = fp.plan.length;
  f.world.travel('fx_cell', 2, 1, EAST);
  const back = routeOn(kf, 'fx_cell', 2, 1, EAST, 1, 1), key = fp.next(f), replanned = [key, ...fp.plan].join();
  f.update(key);
  drive(f, Array(30).fill(null));
  const end = `${f.world.state.mapId} ${f.world.state.x},${f.world.state.y}`;
  ok(left === 2 && replanned === back?.join() && end === 'fx_hall 4,1' && fp.goal === null,
    `carried off the hall with ${left} keys to press, it plans afresh from the cell, ${replanned}, by its way back, and walks on to the hall's end (${end}; ${JSON.stringify(fp.goal)})`);

  // Landed on its own way out, as Brandy Hole lands a company on the square it climbs out by: no keys
  // from the square to itself, so bound for the beach the brain steps off it and back on, and is out.
  const b = headlessGame(4), bp = (b.pilot = new Pilot({ instant: true }));
  b.world.travel('greywater1', 1, 1, SOUTH);
  const stay = routeOn(knownOf(b), 'greywater1', 1, 1, SOUTH, 1, 1);
  bp.toggle(b);
  bp.goal = { map: 'shelf', x: 3, y: 28, name: 'the beach' };
  const off = bp.next(b), offAndOn = [off, ...bp.plan].join();
  b.update(off);
  drive(b, Array(30).fill(null));
  const beach = `${b.world.state.mapId} ${b.world.state.x},${b.world.state.y}`;
  ok(stay?.length === 0 && offAndOn === 'forward,turnLeft,turnLeft,forward' && beach === 'caldera 203,58' && bp.goal === null,
    `landed in Brandy Hole on its way out, with no keys from the square to itself (${stay?.join()}), bound for the beach it steps off and back on, ${offAndOn}, and is out (${beach}; ${JSON.stringify(bp.goal)})`);

  // Landed on its way out in a dead end open only to the west: facing north it turns left to step
  // off, facing south right. Facing a lock with open floor behind, it tries the lock once and, refused,
  // steps off behind and back on, not shut; with none behind, it tries the lock again until it is
  // shut. Sealed in, it has no way out it has seen.
  const climb = (rows: string[], f: Facing): string => {
    const c = headlessGame(4), cp = (c.pilot = new Pilot({ instant: true }));
    c.maps.fx_top = new GameMap({ id: 'fx_top', name: 'Top', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#...#', '#####'] });
    c.maps.fx_hole = new GameMap({ id: 'fx_hole', name: 'Hole', kind: 'dungeon', start: { x: 2, y: 1, facing: f }, rows, exits: [{ x: 2, y: 1, to: 'fx_top', tx: 1, ty: 1, tf: EAST }] });
    c.world.travel('fx_top', 1, 1, EAST);
    see(c, 'fx_top');
    c.world.travel('fx_hole', 2, 1, f);
    see(c, 'fx_hole');
    cp.toggle(c);
    cp.goal = { map: 'fx_top', x: 3, y: 1, name: 'the top' };
    const keys: Action[] = [];
    for (let n = 0; n < 30 && cp.goal; n++) { const key = cp.next(c); if (key) keys.push(key); c.update(key); }
    return `${keys.join()} ${c.world.state.mapId} ${c.world.state.x},${c.world.state.y} ${cp.shut.length} ${cp.why.join(' / ')}`;
  };
  const dead = ['#####', '#..##', '#####'];
  const climbs = [climb(dead, NORTH), climb(dead, SOUTH), climb(['######', '#..L.#', '######'], EAST), climb(['######', '##.L.#', '######'], EAST), climb(['#####', '##.##', '#####'], EAST)];
  ok(climbs.join('; ') === [`turnLeft,forward,turnLeft,turnLeft,forward,forward,forward fx_top 3,1 0 ${IDLE}`, `turnRight,forward,turnLeft,turnLeft,forward,forward,forward fx_top 3,1 0 ${IDLE}`,
    `forward,turnLeft,turnLeft,forward,turnLeft,turnLeft,forward,forward,forward fx_top 3,1 0 ${IDLE}`, 'forward,forward,forward fx_hole 2,1 1 The top is shut to me.', ' fx_hole 2,1 0 No way to the top that I have seen.'].join('; '),
    `landed on its way out, it steps off by the left, by the right, and behind once a lock ahead is refused, and is out; with the lock the only way off, it is shut after three; sealed in, it has none (${climbs.join('; ')})`);

  // A step refused at once, onto a lock Known inks as any door, with a way round below: the lock's
  // line is said, and the next call plans again from where the party stands, round the lock by the
  // way it has seen, not on by the old plan, and walks it to the far side.
  const n = headlessGame(4), np = (n.pilot = new Pilot({ instant: true }));
  n.maps.fx_nook = new GameMap({ id: 'fx_nook', name: 'Nook', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#.L.#', '#.#.#', '#...#', '#####'] });
  n.world.travel('fx_nook', 1, 1, EAST);
  see(n, 'fx_nook');
  np.toggle(n);
  np.goal = { map: 'fx_nook', x: 3, y: 1, name: 'the far side' };
  const tried = np.next(n);
  n.update(tried);
  const lockLine = n.log.at(-1), rest = np.plan.join(), retry = np.next(n), afresh = retry ? [retry, ...np.plan] : [], roundBy = walked(afresh, 1, 1, EAST);
  drive(n, Array(40).fill(null));
  const farSide = `${n.world.state.x},${n.world.state.y}`;
  ok(tried === 'forward' && lockLine === 'Locked. A key would open it.' && rest === 'forward' && afresh.length === 9 && roundBy.at(-1) === '3,1' && !roundBy.includes('2,1') && farSide === '3,1' && np.goal === null && !np.shut.length,
    `its first step refused (${lockLine}), it plans again from where it stands, round the lock by ${roundBy.join(' ')}, not on by the old plan's ${rest}, and walks it to the far side (${farSide}; ${JSON.stringify(np.shut)})`);

  // A locked door with no key: its why is one line until the game says something, the lock's line
  // the second after. Refused three times, the way is shut and the square kept for the explorer,
  // with the line it was told, and the why line says so. Then a goal past any way it has seen: it
  // says it has none. Each line stays up while it presses nothing.
  const l = headlessGame(4), lp = (l.pilot = new Pilot({ instant: true }));
  l.maps.fx_lockup = new GameMap({ id: 'fx_lockup', name: 'Lock-up', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#.L.#', '#####'] });
  l.world.travel('fx_lockup', 1, 1, EAST);
  see(l, 'fx_lockup');
  lp.toggle(l);
  lp.goal = { map: 'fx_lockup', x: 3, y: 1, name: 'the far cell' };
  drive(l, [null]);
  const hush = lp.why.join(' / '), alone = lp.why.length === 1;
  drive(l, [null]);
  const bound = lp.why.join(' / ');
  drive(l, Array(10).fill(null));
  const refused = l.log.filter((s) => s === 'Locked. A key would open it.').length, shut = lp.why.join(' / ');
  lp.goal = { map: 'harrow', x: 1, y: 1, name: 'Helmstow' };
  drive(l, Array(10).fill(null));
  const none = lp.why.join(' / ');
  ok(alone && hush === 'Bound for the far cell.' && bound === 'Bound for the far cell. / Locked. A key would open it.' && refused === 3 && JSON.stringify(lp.shut) === '[{"map":"fx_lockup","x":2,"y":1,"why":"Locked. A key would open it."}]'
    && shut === 'The far cell is shut to me.' && none === 'No way to Helmstow that I have seen.' && lp.goal === null && l.world.state.x === 1,
    `a locked door refused ${refused} times is shut to the navigator (${JSON.stringify(lp.shut)}), and its why lines say so: ${hush}, with nothing said yet; ${bound}; ${shut}; ${none}`);

  // Its third refusal seen only once the player, taking the helm, has said more than the log keeps and
  // handed it back: the way is shut, with no line.
  const lost = headlessGame(4), lostp = (lost.pilot = new Pilot({ instant: true }));
  lost.maps.fx_lockup = new GameMap({ id: 'fx_lockup', name: 'Lock-up', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#.L.#', '#####'] });
  lost.world.travel('fx_lockup', 1, 1, EAST);
  see(lost, 'fx_lockup');
  lostp.toggle(lost);
  lostp.goal = { map: 'fx_lockup', x: 3, y: 1, name: 'the far cell' };
  for (let n = 0; n < 20 && lostp.heard.filter((s) => s === 'Locked. A key would open it.').length < 3; n++) drive(lost, [null]);
  drive(lost, [...Array<Action>(61).fill('interact'), 'pilot', null]);
  ok(!lost.log.includes('Locked. A key would open it.') && JSON.stringify(lostp.shut) === '[{"map":"fx_lockup","x":2,"y":1,"why":""}]' && lostp.why[0] === 'The far cell is shut to me.',
    `a third refusal seen once its line has gone from the log shuts the way with none (${JSON.stringify(lostp.shut)}; ${lostp.why.join(' / ')})`);

  // What one company was bound for and refused is not the next one's: a new game, or a save loaded,
  // is bound nowhere, with no keys left to press and no way shut.
  l.world.travel('harrow', 7, 14, NORTH);
  see(l, 'harrow');
  lp.goal = { map: 'harrow', x: 7, y: 8, name: 'the high street' };
  drive(l, [null]);
  const was = { goal: lp.goal, plan: [...lp.plan], trip: lp.trip, shut: [...lp.shut] };
  const forgot = (): boolean => lp.goal === null && !lp.plan.length && lp.trip === null && !lp.shut.length;
  l.newGame(4);
  const anew = forgot();
  const box = new Map<string, string>(), store: Store = { getItem: (id) => box.get(id) ?? null, setItem: (id, v) => void box.set(id, v), removeItem: (id) => void box.delete(id) };
  const s = new Game(store);
  s.pilot = lp;
  s.newGame(4);
  s.saveGame();
  lp.goal = was.goal; lp.plan = [...was.plan]; lp.trip = was.trip; lp.shut.push(...was.shut);
  const loaded = s.loadGame() && forgot();
  ok(!!was.goal && !!was.trip && was.plan.length > 0 && was.shut.length === 1 && anew && loaded,
    `bound for the high street with ${was.plan.length} keys to press and ${was.shut.length} way shut, a new game is bound nowhere with none (${anew}), and so is a save loaded (${loaded})`);
}

/** Marks every square of a map unseen, as a map not yet walked. */
function unsee(g: Game, map: string): void { g.world.state.maps[map].explored.fill(0); }

function explorer(): void {
  // A room, seen, with a door out of it to a corridor unseen: the door's square is the frontier, and
  // nothing inside the room is, though every square of it is seen and passable.
  const r = headlessGame(4), kr = knownOf(r);
  r.maps.fx_room = new GameMap({ id: 'fx_room', name: 'Room', kind: 'dungeon', start: { x: 2, y: 2, facing: WEST }, rows: ['########', '#...#..#', '#...D..#', '#...#..#', '########'] });
  r.world.travel('fx_room', 2, 2, WEST);
  unsee(r, 'fx_room');
  for (let sy = 0; sy < 5; sy++) for (let sx = 0; sx < 5; sx++) see(r, 'fx_room', sx, sy);
  const edge = frontier(kr, r, 'fx_room');
  ok(JSON.stringify(edge) === '[{"x":4,"y":2}]' && kr.seen('fx_room', 3, 2) && !kr.seen('fx_room', 5, 2),
    `of a seen room with a door out, the frontier is the door's square and nothing inside the room (${JSON.stringify(edge)})`);

  // A dead end each side of a secret door at the top of a U, all of it seen: the secret door, inked as
  // a wall, is the dead ends' end wall and the one suspect, faced from either side. A hall seen to its
  // walls, the map unseen past every one of them, has none: open floor is no dead end.
  // A corridor seen to its dead end, the square past the end wall unseen: the end wall is the one suspect.
  const crypt: MapDef = { id: 'fx_crypt', name: 'Crypt', kind: 'dungeon', start: { x: 3, y: 4, facing: NORTH }, rows: ['#######', '#..S..#', '#.###.#', '#.###.#', '#.....#', '#######'] };
  const dead: MapDef = { id: 'fx_dead', name: 'Dead End', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['##########', '#....S...#', '##########'] };
  const s = headlessGame(4), ks = knownOf(s);
  s.maps.fx_crypt = new GameMap(crypt);
  s.maps.fx_dead = new GameMap(dead);
  s.maps.fx_hall = new GameMap({ id: 'fx_hall', name: 'Hall', kind: 'dungeon', start: { x: 2, y: 2, facing: NORTH }, rows: ['#######', '#######', '##...##', '##...##', '##...##', '#######', '#######'] });
  s.world.travel('fx_crypt', 2, 2, NORTH);
  see(s, 'fx_crypt');
  s.world.travel('fx_hall', 2, 2, NORTH);
  unsee(s, 'fx_hall');
  for (let sy = 1; sy < 6; sy++) for (let sx = 1; sx < 6; sx++) see(s, 'fx_hall', sx, sy);
  s.world.travel('fx_dead', 1, 1, EAST);
  unsee(s, 'fx_dead');
  for (let sy = 0; sy < 3; sy++) for (let sx = 0; sx < 6; sx++) see(s, 'fx_dead', sx, sy);
  const ends = suspects(ks, 'fx_crypt'), open = suspects(ks, 'fx_hall'), end = suspects(ks, 'fx_dead');
  ok(ks.cell('fx_crypt', 3, 1)?.solid === 'wall' && JSON.stringify(ends) === `[{"x":3,"y":1,"facing":${EAST}},{"x":3,"y":1,"facing":${WEST}}]` && !open.length
    && [[3, 0], [6, 3], [3, 6], [0, 3]].every(([sx, sy]) => !ks.seen('fx_hall', sx, sy)) && !ks.seen('fx_dead', 6, 1) && JSON.stringify(end) === `[{"x":5,"y":1,"facing":${EAST}}]`,
    `the end wall of a seen dead end, a secret door Known inks as a wall, is the one suspect, from each side (${JSON.stringify(ends)}), and seen open floor, unseen past its walls, has none (${JSON.stringify(open)}); past it unseen, from its one side (${JSON.stringify(end)})`);

  // Helmstow, at the helm from the start with the navigator and the explorer: 3000 ticks walk it out,
  // every passable square seen but those behind a lock, as the map is written (the test's privilege,
  // not the pilot's), and it never leaves the town, nor goes into a business.
  const h = headlessGame(4), hp = (h.pilot = new Pilot({ instant: true })), m = h.maps.harrow;
  hp.toggle(h);
  let inside = 0, out = 0, done = -1;
  for (let t = 0; t < 3000; t++) {
    drive(h, [null]);
    if (h.screens.some((q) => q instanceof InteriorScreen)) inside++;
    if (h.world.state.mapId !== 'harrow') out++;
    if (done < 0 && hp.why[0] === 'Helmstow is walked out.') done = t;
  }
  const start = m.def.start, reach = new Set([`${start.x},${start.y}`]), queue = [[start.x, start.y]];
  for (let i = 0; i < queue.length; i++) for (let f = 0; f < 4; f++) {
    const nx = queue[i][0] + FACING_DX[f], ny = queue[i][1] + FACING_DY[f];
    if (reach.has(`${nx},${ny}`) || m.passable(nx, ny) !== 'ok') continue;
    reach.add(`${nx},${ny}`); queue.push([nx, ny]);
  }
  const passable: string[] = [];
  for (let sy = 0; sy < m.height; sy++) for (let sx = 0; sx < m.width; sx++) if (m.passable(sx, sy) === 'ok') passable.push(`${sx},${sy}`);
  const bits = h.world.state.maps.harrow.explored, unseen = [...reach].filter((q) => { const [sx, sy] = q.split(',').map(Number); return !seenBit(bits, sy * m.width + sx); }).length;
  ok(reach.size === passable.length && unseen === 0 && !inside && !out && done > 0 && hp.why[0] === 'Helmstow is walked out.',
    `3000 ticks with the explorer leave every one of Helmstow's ${passable.length} passable squares seen, none behind a lock (${unseen} unseen, ${passable.length - reach.size} behind), walked out in ${done} ticks, never out of the town (${out}) or inside (${inside}): ${hp.why.join(' / ')}`);

  // A corridor to a secret door, the square past it never seen, and the company at the near end with
  // the helm handed over: it walks the corridor out, and then, with nothing unseen beside a square it
  // can reach, goes to the dead end's end wall, faces it and searches it, the door is found within 400
  // ticks, and it walks on through. A new game has searched nothing and prefers nowhere.
  const v = headlessGame(4), vp = (v.pilot = new Pilot({ instant: true }));
  v.maps.fx_dead = new GameMap(dead);
  v.world.travel('fx_dead', 1, 1, EAST);
  const hidden = v.maps.fx_dead.at(5, 1).door;
  vp.toggle(v);
  let found = -1, why = '', walked = false;
  for (let t = 0; t < 400; t++) {
    const said = vp.heard.length;
    drive(v, [null]);
    if (found < 0 && vp.heard.slice(said).includes('You find a hidden door!')) {
      found = t; why = vp.why.join(' / ');
      walked = [1, 2, 3, 4].every((sx) => knownOf(v).seen('fx_dead', sx, 1)) && !knownOf(v).seen('fx_dead', 6, 1);
    }
  }
  const searches = vp.heard.filter((l) => l === 'You search the wall ahead and find nothing.').length, marks = [...vp.searched].join(' ');
  const beyond = [6, 7, 8].every((sx) => knownOf(v).seen('fx_dead', sx, 1));
  ok(hidden === 'secret' && found >= 0 && v.maps.fx_dead.at(5, 1).door === 'door' && walked && why === SEARCHING && !searches && marks === `fx_dead:5,1,${EAST}` && beyond,
    `the corridor walked out to its dead end, the square past it unseen (${walked}), it searches the end wall and finds the door, now ${v.maps.fx_dead.at(5, 1).door}, in ${found} ticks, with ${searches} searches for nothing (${why}; ${marks}), and walks on past it (${beyond}): ${vp.why.join(' / ')}`);
  vp.prefer = 'fx_dead';
  v.newGame(4);
  ok(!vp.searched.size && vp.prefer === null, `a new game, the pilot has searched no wall and prefers nowhere (${vp.searched.size}, ${vp.prefer})`);

  // The U with a plain wall at its top: the wall is searched once from each side, finds nothing, and
  // is never searched again; the crypt is walked out.
  const n = headlessGame(4), np = (n.pilot = new Pilot({ instant: true }));
  n.maps.fx_crypt = new GameMap({ ...crypt, rows: crypt.rows.map((row) => row.replace('S', '#')) });
  n.world.travel('fx_crypt', 3, 4, NORTH);
  np.toggle(n);
  drive(n, [], 400);
  const nothing = np.heard.filter((l) => l === 'You search the wall ahead and find nothing.').length;
  ok(nothing === 2 && np.searched.size === 2 && np.why[0] === 'Crypt is walked out.',
    `a wall that hides nothing is searched ${nothing} times in 400 ticks, once from each side (${[...np.searched].join(' ')}), and the crypt is walked out (${np.why.join(' / ')})`);

  // A lock and a gate across a passage that turns out of sight past them: each refused three times and
  // shut, the passage is walked out with no more refusals while it is shut. With a key, the explorer
  // goes back to the lock and it opens; with a flag set since, back to the gate and it opens; and the
  // passage past each is walked.
  const passage = (rows: string[], more: Partial<MapDef>, open: (c: Game) => void): string => {
    const c = headlessGame(4), cp = (c.pilot = new Pilot({ instant: true }));
    c.maps.fx_way = new GameMap({ id: 'fx_way', name: 'Passage', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows, ...more });
    c.world.travel('fx_way', 1, 1, EAST);
    cp.toggle(c);
    const refusals = (): number => cp.heard.filter((l) => l === 'Locked. A key would open it.' || l === 'The way is closed.').length;
    drive(c, [], 100);
    const before = `${refusals()} ${JSON.stringify(cp.shut)} ${JSON.stringify(frontier(knownOf(c), c, 'fx_way'))} ${cp.why[0]}`;
    open(c);
    drive(c, [], 100);
    const end = knownOf(c).seen('fx_way', 5, 4);
    return `${before}; ${refusals()} ${cp.shut.length} ${end} ${cp.why[0]}`;
  };
  const turn = ['#######', '#.....#', '#####.#', '#####.#', '#####.#', '#######'];
  const flags = Object.keys(headlessGame(4).party.flags).length;
  const lock = passage(turn.map((row, sy) => (sy === 1 ? '#.L...#' : row)), {}, (c) => { c.party.bag.push('key_iron'); });
  const gate = passage(turn, { gates: [{ x: 2, y: 1, needFlag: 'fx_open' }] }, (c) => { c.party.flags.fx_open = 1; });
  ok(lock === `3 [{"map":"fx_way","x":2,"y":1,"why":"Locked. A key would open it.","flags":${flags}}] [] Passage is walked out.; 3 0 true Passage is walked out.`
    && gate === `3 [{"map":"fx_way","x":2,"y":1,"why":"The way is closed.","flags":${flags}}] [{"x":3,"y":1}] Passage is walked out.; 3 0 true Passage is walked out.`,
    `a lock and a gate, each refused three times, are shut, the lock no square of the frontier, and the passage walked out with no more refusals; a key, and a flag set since, and it goes back to each, opens it and walks on (${lock}; ${gate})`);

  // Rats in sight across a corridor that runs on unseen past them, the only way on: it goes at them,
  // the fight is won, and the corridor is walked out. Under a truce, as after a flight, it steps over
  // them and walks it out with no fight.
  const rats = (truce: number): string => {
    const c = headlessGame(4), cp = (c.pilot = new Pilot({ instant: true }));
    c.maps.fx_rats = new GameMap({ id: 'fx_rats', name: 'Corridor', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['##########', '#........#', '##########'],
      encounters: [{ id: 'fx_rats', x: 3, y: 1, monsters: ['rat', 'rat'], roams: false }] });
    c.world.travel('fx_rats', 1, 1, EAST);
    c.world.state.truce = truce; c.world.state.truceGroups = truce ? ['fx_rats'] : [];
    const ahead = `${JSON.stringify(knownOf(c).groups('fx_rats'))} ${JSON.stringify(frontier(knownOf(c), c, 'fx_rats'))}`;
    cp.toggle(c);
    let fight: CombatScreen | null = null, why = '';
    for (let t = 0; t < 400; t++) {
      drive(c, [null]);
      if (c.top instanceof CombatScreen) fight = c.top;
      if (cp.why[0] === CLEARING) why = CLEARING;
    }
    const walked = [...'........'].every((_, i) => knownOf(c).seen('fx_rats', i + 1, 1));
    return `${ahead} ${fight?.state.outcome ?? 'none'} ${why} ${walked} ${cp.why[0]}`;
  };
  const fought = rats(0), passed = rats(10);
  ok(fought === `[{"x":3,"y":1}] [{"x":3,"y":1}] victory ${CLEARING} true Corridor is walked out.` && passed === `[{"x":3,"y":1}] [{"x":3,"y":1}] none ${CLEARING} true Corridor is walked out.`,
    `rats across the only way on, it goes at them, wins the fight and walks the corridor out (${fought}); under a truce it steps over them (${passed})`);

  // The outdoors: at the Foreland's east edge, facing Thornmark, the nearest square with one unseen
  // beside it is Thornmark's, but it looks about the Foreland it stands in; preferred, it looks about
  // Thornmark. In Thornmark, beyond a company of level 1, it goes nowhere, until Thornmark is preferred.
  const o = headlessGame(4), op = (o.pilot = new Pilot({ instant: true })), ko = knownOf(o), zones = o.maps.caldera.zones;
  const zoneOf = (q: { x: number; y: number } | null): string => zones.find((z) => !!q && q.x >= z.x && q.y >= z.y && q.x < z.x + z.w && q.y < z.y + z.h)?.id ?? 'none';
  const look = (): string => {
    op.goal = null; op.trip = null; op.plan = [];
    const key = explore(o, ko, op);
    return `${key} ${zoneOf(op.goal)} ${op.why[0]}`;
  };
  o.world.travel('shelf', 31, 9, EAST);
  const st = o.world.state, both = ['shelf', 'thornmark'].flatMap((id) => { const at = o.world.locate(id, 0, 0); return frontier(ko, o, id).map((q) => ({ x: q.x + at.x, y: q.y + at.y })); });
  const nearest = zoneOf(nearestOn(ko, st.mapId, st.x, st.y, st.facing, both));
  const home = look();
  op.prefer = 'thornmark';
  const preferred = look();
  op.prefer = null;
  o.world.travel('thornmark', 2, 9, EAST);
  const wild = look();
  op.prefer = 'thornmark';
  const sought = look();
  const walks = (l: string): boolean => !l.startsWith('null ');
  ok(nearest === 'thornmark' && walks(home) && home.endsWith(' shelf Looking about the Foreland.') && walks(preferred) && preferred.endsWith(' thornmark Looking about Thornmark.')
    && wild === 'null none Thornmark is beyond us yet.' && walks(sought) && sought.endsWith(' thornmark Looking about Thornmark.'),
    `at the Foreland's edge, the nearest unseen is Thornmark's, but it looks about the Foreland (${home}), and preferred, Thornmark (${preferred}); in Thornmark, beyond it, it goes nowhere (${wild}) until preferred (${sought})`);
}

/** Picks a menu's line by its label and Space, as the frame's checks open a shop's wares. */
function choose(g: Game, label: string): void {
  const c = g.top;
  if (c instanceof ChoiceScreen && c.options.includes(label)) { c.sel = c.options.indexOf(label); g.update('interact'); }
}

/** Helmstow's business of a kind, as it stands in a new game. */
const business = (g: Game, kind: Feature['kind']): Feature => g.maps.harrow.features.find((f) => f.kind === kind && g.world.present(f))!;

function quartermaster(): void {
  // What the company needs, on the harness's company of level 3, its reserve 300: whole and fed,
  // nothing while it knows no shop's wares; one of it at 10% hp, rest; one dead, the temple; short of
  // rations, rations; one with the xp for level 4, training, once the purse holds the price over the
  // reserve and not a gold piece before; and Mottram's wares shown, gear, once it holds the cleric's
  // Buckler over the reserve and not before.
  const q = headlessGame(4, companyAt(3, 1)), c = q.party.members[0], cleric = q.party.members.find((m) => m.cls === 'cleric')!;
  q.pilot = new Pilot({ instant: true });
  const whole = need(q);
  c.hp = Math.round(c.maxHp / 10);
  const hurt = need(q);
  c.hp = c.maxHp; c.conditions = ['dead'];
  const dead = need(q);
  c.conditions = [];
  q.party.food = 2 * q.party.members.length - 1;
  const hungry = need(q);
  q.party.food = 30;
  c.xp = xpForLevel(4);
  q.party.gold = reserve(q.party) + trainPrice(c) - 1;
  const unpaid = need(q);
  q.party.gold++;
  const ready = need(q);
  c.xp = xpForLevel(3);
  see(q, 'harrow');
  q.interact(business(q, 'shop')); choose(q, 'Buy and sell'); choose(q, 'Buy');
  while (q.screens.length > 1) q.pop();
  q.party.gold = reserve(q.party) + item('buckler').price - 1;
  const dear = need(q);
  q.party.gold++;
  const geared = need(q);
  ok(reserve(q.party) === 300 && whole === null && hurt === 'rest' && dead === 'temple' && hungry === 'food' && unpaid === null && ready === 'train' && dear === null && geared === 'gear' && !cleric.equipment.shield,
    `the company of level 3 needs nothing whole and fed (${whole}), rest with one at 10% (${hurt}), the temple with one dead (${dead}), rations short of them (${hungry}), training with the price over the reserve of ${reserve(q.party)} and not a piece short (${ready}, ${unpaid}), and with Mottram's wares shown, gear with the cleric's Buckler over it and not a piece short (${geared}, ${dear})`);

  // The fighter, a hand axe in his hand, at a stall stocking only the Long Sword at 120: with 420 gold
  // in the purse of a company whose highest level is 3, the reserve 300, it is the sword; with 400,
  // nothing; at the stall's own dearer price, nothing; and with the sword in his hand, nothing at any price.
  const co = companyAt(3, 1), fighter = co.members[0];
  equip(fighter, 'axe');
  const offer = (gold: number, prices?: Record<string, number>): string | undefined => { co.gold = gold; return better(fighter, ['longsword'], prices ? { prices } : {}, spare(co)); };
  const rich = offer(420), poor = offer(400), dearer = offer(420, { longsword: 180 });
  equip(fighter, 'longsword');
  const held = offer(100000);
  ok(reserve(co) === 300 && item('longsword').price === 120 && rich === 'longsword' && poor === undefined && dearer === undefined && held === undefined,
    `a Long Sword at 120 betters the fighter's hand axe with 420 gold over the reserve of ${reserve(co)} (${rich}), and not with 400 (${poor}), nor at 180 (${dearer}), nor once he holds one (${held})`);

  // At 10% hp in Helmstow's street, where nothing refuses rest, with 12 rations: it rests where it
  // stands and says why, and within 40 ticks the company is whole, the clock 480 minutes on and the
  // rations six fewer.
  const r = headlessGame(4), rp = (r.pilot = new Pilot({ instant: true })), from = r.world.state.minutes;
  for (const m of r.party.members) m.hp = Math.max(1, Math.round(m.maxHp / 10));
  r.party.food = 12;
  const refused = restRefused(r.world);
  rp.toggle(r);
  let rested = -1, moved = 0, resting = '';
  for (let t = 0; t < 40 && rested < 0; t++) {
    drive(r, [null]);
    if (rp.why[0].startsWith('Resting')) resting = rp.why[0];
    if (r.party.members.every((m) => m.hp === m.maxHp)) { rested = t; moved = r.world.state.minutes - from; }
  }
  ok(refused === '' && rested >= 0 && moved === 480 && r.party.food === 6 && resting === `Resting: ${r.party.members[0].name} is under a quarter.`,
    `at 10% hp in the street with 12 rations it rests where it stands (${resting}), whole in ${rested} ticks, the clock ${moved} minutes on and ${r.party.food} rations left`);

  // The Hearthlight Inn, with 30 gold a head and one of the company at 10% hp: stepped in at its door,
  // it takes the room for 72 of its 180, the reserve 100, and is out on the street, whole, within 60
  // ticks. With no rations to rest on, from the street outside, the town well known to do nothing, it
  // walks in and takes the room, and the rations it then cannot pay for over the reserve it does not
  // go back for.
  const inn = (food: number, walk: boolean): string => {
    const i = headlessGame(4), ip = (i.pilot = new Pilot({ instant: true })), door = business(i, 'inn'), m = i.party.members[0];
    i.party.gold = 30 * i.party.members.length; i.party.food = food;
    m.hp = Math.max(1, Math.round(m.maxHp / 10));
    see(i, 'harrow');
    ip.wells.set(`harrow:${business(i, 'well').x},${business(i, 'well').y}`, false);
    ip.toggle(i);
    i.world.travel('harrow', door.x, door.y + (walk ? 1 : 0), NORTH);
    if (!walk) i.enterCell();
    let inside = i.screens.some((s) => s instanceof InteriorScreen), visits = inside ? 1 : 0, out = -1, taken = '';
    for (let t = 0; t < 60; t++) {
      drive(i, [null]);
      const now = i.screens.some((s) => s instanceof InteriorScreen);
      if (now && !inside) visits++;
      if (inside && !now && out < 0) { out = t; taken = `${i.world.state.x},${i.world.state.y} ${i.party.members.every((q) => q.hp === q.maxHp)} ${i.party.gold} ${i.party.food}`; }
      inside = now;
    }
    return `${out >= 0 && out < 60} ${taken} ${visits} ${[...ip.short.keys()].join()}`;
  };
  const stepped = inn(30, false), walked = inn(0, true);
  ok(stepped === 'true 4,5 true 108 30 1 ' && walked === 'true 4,5 true 108 0 1 harrow:4,4:food',
    `stepped into the Hearthlight with 30 gold a head and one at 10%, it takes the room and is out whole (${stepped}); walked to it with no rations, the same, and the rations it cannot pay for over the reserve it does not go back for (${walked})`);

  // One of the company dead, the Chapel seen: the pilot walks there, says why, raises him for 100 of the
  // 200, and he stands within 400 ticks.
  const t = headlessGame(4), tp = (t.pilot = new Pilot({ instant: true })), fallen = t.party.members[1], chapel = business(t, 'temple');
  see(t, 'harrow');
  fallen.conditions = ['dead']; fallen.hp = -10;
  tp.toggle(t);
  let stood = -1, bound = '', within = false;
  for (let n = 0; n < 400 && stood < 0; n++) {
    drive(t, [null]);
    if (n === 0) bound = tp.why[0];
    if (t.screens.some((s) => s instanceof InteriorScreen) && t.world.state.x === chapel.x && t.world.state.y === chapel.y) within = true;
    if (!hasCondition(fallen, 'dead')) stood = n;
  }
  ok(stood >= 0 && within && t.party.gold === 100 && bound === `To Chapel of the Lanterns: ${fallen.name} is dead.`,
    `with ${fallen.name} dead it walks to the Chapel (${bound}), raises him for ${200 - t.party.gold} gold, and he stands in ${stood} ticks`);

  // Mottram's wares shown and the Long Sword's 120 over the reserve: it walks to the stores, buys the
  // paladin the sword that betters his mace, sells nothing, and takes it up through the sheet.
  const s = headlessGame(4), sp = (s.pilot = new Pilot({ instant: true })), paladin = s.party.members.find((m) => m.cls === 'paladin')!;
  see(s, 'harrow');
  s.interact(business(s, 'shop')); choose(s, 'Buy and sell'); choose(s, 'Buy');
  while (s.screens.length > 1) s.pop();
  s.party.gold = reserve(s.party) + item('longsword').price;
  const was = paladin.equipment.weapon;
  sp.toggle(s);
  let sheet = false, buying = '';
  for (let n = 0; n < 200 && !(paladin.equipment.weapon === 'longsword' && s.top instanceof ExploreScreen); n++) {
    drive(s, [null]);
    if (s.top instanceof SheetScreen) sheet = true;
    if (sp.why[0].startsWith('Buying')) buying = sp.why[0];
  }
  ok(was === 'mace' && paladin.equipment.weapon === 'longsword' && paladin.pack.includes('mace') && !s.party.bag.includes('longsword') && s.party.gold === reserve(s.party) && sheet
    && buying === `Buying Long Sword for ${paladin.name}.` && !s.log.some((l) => l.startsWith('Sold ')) && s.top instanceof ExploreScreen,
    `with Mottram's wares shown and 120 over the reserve, it buys ${paladin.name} the Long Sword (${buying}), sells nothing, and takes it up through the sheet, the ${was} to his pack (${JSON.stringify(paladin.equipment)})`);

  // Bram with the xp for level 2 and the Drillyard seen but never opened: it goes in to see what it
  // teaches, trains him for 25 gold, and comes out with its levels known.
  const d = headlessGame(4), dp = (d.pilot = new Pilot({ instant: true })), bram = d.party.members[0];
  see(d, 'harrow');
  bram.xp = xpForLevel(2);
  const levels = (): unknown => (knownOf(d).features('harrow').find((f) => f.kind === 'trainer') as Record<string, unknown> | undefined)?.maxLevel;
  const unseen = levels();
  dp.toggle(d);
  for (let n = 0; n < 200 && !(bram.level === 2 && d.top instanceof ExploreScreen); n++) drive(d, [null]);
  ok(unseen === undefined && bram.level === 2 && d.party.gold === 175 && levels() === 6 && d.top instanceof ExploreScreen,
    `with Bram ready to train and the Drillyard's levels unknown (${unseen}), it goes in, trains him to level ${bram.level} for ${200 - d.party.gold} gold and comes out, its levels known (${levels()})`);

  // Under half, no group in sight and two wells in a corridor, the nearer dry: it drinks at the dry one,
  // remembers it did nothing, and goes on to the sweet one, which restores it. A sweet well seven steps
  // off it leaves be.
  const wells = (rows: string, features: Feature[]): string => {
    const w = headlessGame(4), wp = (w.pilot = new Pilot({ instant: true })), m = w.party.members[0];
    w.maps.fx_wells = new GameMap({ id: 'fx_wells', name: 'Wells', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#'.repeat(rows.length), rows, '#'.repeat(rows.length)], features });
    w.world.travel('fx_wells', 1, 1, EAST);
    see(w, 'fx_wells');
    m.hp = Math.floor(m.maxHp * 0.4);
    wp.toggle(w);
    const went: string[] = [];
    for (let n = 0; n < 30 && m.hp < m.maxHp; n++) { drive(w, [null]); if (went.at(-1) !== `${w.world.state.x}`) went.push(`${w.world.state.x}`); }
    return `${went.join(' ')} ${m.hp === m.maxHp} ${JSON.stringify([...wp.wells])}`;
  };
  const dry: Feature = { kind: 'well', x: 3, y: 1, text: 'A dry well.' }, sweet = (x: number): Feature => ({ kind: 'well', x, y: 1, text: 'A sweet well.', heal: true });
  const two = wells('#.......#', [dry, sweet(6)]), far = wells('#.........#', [sweet(1 + WELL_STEPS + 1)]);
  ok(two === '2 3 4 5 6 true [["fx_wells:3,1",false]]' && far === '1 false []',
    `under half, it drinks at the near well, which does nothing, and remembers it, and goes on to the far one, which restores it (${two}); one ${WELL_STEPS + 1} steps off it leaves be (${far})`);
}
