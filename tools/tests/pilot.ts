// The pilot's frame (#716): what Known lets it see and keeps from it, what it has heard and been shown
// and when it forgets them, the P and T keys and any other, its pace, a fight handed to the bot, a message read and
// closed, the why line with no brain to ask, a wipe's why over the title and P there.
import { GameMap } from '../../src/game/map.ts';
import type { Feature, MapDef } from '../../src/game/map.ts';
import { EAST } from '../../src/game/types.ts';
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
import { ok, headlessGame } from './lib.ts';

export function pilot(): void {
  const g = headlessGame(4), p = (g.pilot = new Pilot({ instant: true }));
  const { x, y } = g.world.state, m = g.maps.harrow;
  const corner = [[0, 0], [m.width - 1, 0], [0, m.height - 1], [m.width - 1, m.height - 1]].sort(([ax, ay], [bx, by]) => Math.abs(bx - x) + Math.abs(by - y) - Math.abs(ax - x) - Math.abs(ay - y))[0];
  ok(knownOf(g).seen('harrow', x, y) && !knownOf(g).seen('harrow', corner[0], corner[1]), `Known has the start square in Helmstow seen and its far corner, ${corner.join(',')}, not`);

  // The fixtures go on Helmstow's features as written, shared by every game, so they all go again at the end.
  const had = [...m.features];

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

  // A secret door, as movement's fixtures build a map: inked as a wall.
  const vault: MapDef = { id: 'fx_vault', name: 'Vault', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#.S.#', '#####'] };
  const v = headlessGame(4);
  v.maps.fx_vault = new GameMap(vault);
  v.world.travel('fx_vault', 1, 1, EAST);
  const door = knownOf(v).cell('fx_vault', 2, 1);
  ok(door?.solid === 'wall' && door.door === 'none' && !('ch' in door), `Known inks a seen secret door as a wall (${JSON.stringify(door)})`);

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
  ok(g.top instanceof MessageScreen && p.next(g) === 'interact', 'a message on top the pilot reads and closes with Space');
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

  // What it has heard is kept to the last 2000 lines, the oldest dropped first.
  const q = new Pilot();
  for (let i = 0; i <= HEARD_MAX; i++) q.hear(`Line ${i}.`);
  ok(HEARD_MAX === 2000 && q.heard.length === HEARD_MAX && q.heard[0] === 'Line 1.' && q.heard[HEARD_MAX - 1] === `Line ${HEARD_MAX}.`,
    `of ${HEARD_MAX + 1} lines heard, the pilot keeps the last ${q.heard.length}, from "${q.heard[0]}"`);

  // The fixtures go again, and a new game finds Helmstow as it was for every suite after.
  (m.features as Feature[]).splice(had.length);
  const after = headlessGame(4).maps.harrow.features;
  ok(after.length === had.length && after.every((f, i) => f === had[i]), `the fixtures gone, a new game's Helmstow has its ${had.length} features as before (${after.length})`);
}
