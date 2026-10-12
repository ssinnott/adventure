// The pilot's frame (#716): what Known lets it see and keeps from it, what it has heard and been shown
// and when it forgets them, the P and T keys and any other, its pace, a fight handed to the bot, a message read and
// closed, the why line with no brain to ask, a wipe's why over the title and P there. The navigator
// (#717): a route over seen squares, a secret door a wall to it, a group, a person and a way off
// walked round, water and a mountain as the company can cross them, the ways between the maps it has
// been to and no others, the outdoors by a zone's id, a walk to a square, driven, a fight and a
// message on the way, a route planned again after a flight, a way shut after three refusals, its why
// lines, and a new game or a load bound nowhere.
import { GameMap } from '../../src/game/map.ts';
import type { Feature, MapDef } from '../../src/game/map.ts';
import { EAST, WEST, FACING_DX, FACING_DY, turnLeft, turnRight } from '../../src/game/types.ts';
import type { Facing } from '../../src/game/types.ts';
import { Game, ExploreScreen } from '../../src/game/game.ts';
import type { Store } from '../../src/game/save.ts';
import { defaultParty } from '../../src/game/party.ts';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { CombatScreen } from '../../src/ui/combat.ts';
import { ChoiceScreen, MessageScreen } from '../../src/ui/screens.ts';
import { RiddleScreen } from '../../src/ui/riddle.ts';
import { TitleScreen } from '../../src/ui/title.ts';
import { Pilot, BRAINS, IDLE, HEARD_MAX } from '../../src/game/pilot/pilot.ts';
import { knownOf } from '../../src/game/pilot/known.ts';
import type { Sighted } from '../../src/game/pilot/known.ts';
import { routeOn, routeMaps } from '../../src/game/pilot/route.ts';
import type { Action } from '../../src/input.ts';
import { ok, headlessGame, drive } from './lib.ts';

// The fixtures go on Helmstow's features as written, shared by every game, so they all go again when
// the suite is done, whether it ends or throws.
export function pilot(): void {
  const helmstow = headlessGame(4).maps.harrow.features as Feature[], had = [...helmstow];
  try { check(); navigator(); } finally { helmstow.splice(had.length); }
  const after = headlessGame(4).maps.harrow.features;
  ok(after.length === had.length && after.every((f, i) => f === had[i]), `the fixtures gone, a new game's Helmstow has its ${had.length} features as before (${after.length})`);
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
  // Of every exit, nothing of what opens it or what it says on arrival.
  const o = headlessGame(4);
  o.pilot = new Pilot({ instant: true, omniscient: true });
  const ko = knownOf(o), SEEN = ['kind', 'x', 'y', 'id', 'name'], ids = Object.keys(o.maps);
  const placed = ids.flatMap((id) => ko.features(id)), more = placed.flatMap((f) => Object.keys(f).filter((q) => !SEEN.includes(q)).map((q) => `${f.kind}.${q}`));
  const scraps = ko.features('ironfells_n3').find((f) => f.kind === 'sign' && f.id === 'n3_scraps'), cache = ko.features('downs_f2').find((f) => f.kind === 'chest' && f.id === 'f2_cache');
  ok(placed.length > 500 && !more.length && JSON.stringify(scraps) === '{"kind":"sign","x":28,"y":12,"id":"n3_scraps"}' && JSON.stringify(cache) === '{"kind":"chest","x":11,"y":2,"id":"f2_cache"}',
    `of the ${placed.length} features placed, seen, Known gives no more than each one's kind, square, id and name (${[...new Set(more)].join(', ') || JSON.stringify([scraps, cache])})`);
  const exits = ids.flatMap((id) => ko.exits(id)), written = ids.flatMap((id) => o.maps[id].exits);
  const opened = exits.filter((e) => 'label' in e || 'needFlag' in e || 'shut' in e || 'blockedText' in e), gated = written.filter((e) => e.needFlag || e.shut).length;
  ok(exits.length === written.length && written.some((e) => e.label) && gated > 0 && !opened.length,
    `of the ${exits.length} exits, ${gated} gated and every one with a line on arrival, Known gives none of what opens one or what it says (${JSON.stringify(opened.slice(0, 2))})`);

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
  const round = routeOn(k, 'fx_door', 1, 1, EAST, 3, 1) ?? [], by = walked(round, 1, 1, EAST);
  for (let i = 0; i < 20 && !g.world.search(); i++);
  const through = routeOn(k, 'fx_door', 1, 1, EAST, 3, 1);
  ok(g.maps.fx_door.passable(2, 1) === 'ok' && round.length === 9 && by.at(-1) === '3,1' && !by.includes('2,1') && through?.join() === 'forward,forward',
    `a secret door the map lets the party through is a wall to the navigator, which goes the long way round, ${round.length} keys by ${by.join(' ')}, until a search finds it (${through?.join(', ')})`);

  // A ring, from its corner to the square two east: two steps by the top, nine keys round by the
  // bottom. A group in sight on the top, a person or a way off, and it goes round; the person or the
  // way it walks to when bound there, never over.
  const r = headlessGame(4), kr = knownOf(r);
  const ring = (id: string, more: Partial<MapDef>): Action[] | null => {
    r.maps[id] = new GameMap({ id, name: 'Ring', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#...#', '#.#.#', '#...#', '#####'], ...more });
    r.world.travel(id, 1, 1, EAST);
    see(r, id);
    return routeOn(kr, id, 1, 1, EAST, 3, 1);
  };
  const bare = ring('fx_ring', {}), held = ring('fx_held', { encounters: [{ id: 'fx_band', x: 2, y: 1, monsters: ['brigand'], roams: false }] }), sighted = kr.groups('fx_held');
  const met = ring('fx_met', { features: [{ kind: 'npc', x: 2, y: 1, name: 'A fixture warden', lines: ['"Halt."'] }] }), toMet = routeOn(kr, 'fx_met', 1, 1, EAST, 2, 1);
  const gone = ring('fx_gone', { exits: [{ x: 2, y: 1, to: 'harrow', tx: 1, ty: 1 }] }), toGone = routeOn(kr, 'fx_gone', 1, 1, EAST, 2, 1);
  const rounds = [held, met, gone].map((keys) => keys?.length === 9 && !walked(keys, 1, 1, EAST).includes('2,1'));
  ok(bare?.join() === 'forward,forward' && sighted.length === 1 && rounds.every(Boolean) && toMet?.join() === 'forward' && toGone?.join() === 'forward',
    `round a ring it goes the long way, nine keys, past a group in sight, a person or a way off on the short one (${rounds.join(', ')}), and walks onto the person or the way when bound there (${toMet?.join()}; ${toGone?.join()})`);

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

  // A locked door with no key: refused three times, the way is shut and the square kept for the
  // explorer, with the line it was told, and the why line says so. Then a goal past any way it has
  // seen: it says it has none. Each line stays up while it presses nothing.
  const l = headlessGame(4), lp = (l.pilot = new Pilot({ instant: true }));
  l.maps.fx_lockup = new GameMap({ id: 'fx_lockup', name: 'Lock-up', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#.L.#', '#####'] });
  l.world.travel('fx_lockup', 1, 1, EAST);
  see(l, 'fx_lockup');
  lp.toggle(l);
  lp.goal = { map: 'fx_lockup', x: 3, y: 1, name: 'the far cell' };
  drive(l, [null, null]);
  const bound = lp.why.join(' / ');
  drive(l, Array(10).fill(null));
  const refused = l.log.filter((s) => s === 'Locked. A key would open it.').length, shut = lp.why.join(' / ');
  lp.goal = { map: 'harrow', x: 1, y: 1, name: 'Helmstow' };
  drive(l, Array(10).fill(null));
  const none = lp.why.join(' / ');
  ok(bound === 'Bound for the far cell. / Locked. A key would open it.' && refused === 3 && JSON.stringify(lp.shut) === '[{"map":"fx_lockup","x":2,"y":1,"why":"Locked. A key would open it."}]'
    && shut === 'The far cell is shut to me.' && none === 'No way to Helmstow that I have seen.' && lp.goal === null && l.world.state.x === 1,
    `a locked door refused ${refused} times is shut to the navigator (${JSON.stringify(lp.shut)}), and its why lines say so: ${bound}; ${shut}; ${none}`);

  // What one company was bound for and refused is not the next one's: a new game, or a save loaded,
  // is bound nowhere, with no keys left to press and no way shut.
  lp.goal = { map: 'fx_lockup', x: 3, y: 1, name: 'the far cell' };
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
    `bound for the far cell with ${was.plan.length} key to press and ${was.shut.length} way shut, a new game is bound nowhere with none (${anew}), and so is a save loaded (${loaded})`);
}
