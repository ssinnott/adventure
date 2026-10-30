// What the first-person view keeps between frames (#1073), with no canvas: the scenes the view keeps
// (src/ui/view/kept.ts, `Scenes`) driven through a headless game by its own keys and by hand, with a
// paint that counts, held to the rule that a scene is drawn again only while all it read holds. A
// frame, a slain group and a turn back keep it; a step, a minute, the weather, a door, a flag, a
// light, the map, the rect's size and a new game paint anew and drop the square's other facings;
// under a facing kept, a feature come or gone, a cell laid anew, the landmarks replaced or the
// weather read anew paint it again as the party turns back; and no more than four are kept, the
// canvases with them. What is painted needs a canvas: the smoke holds the kept frames to fresh ones
// (tools/smoke/flows.ts, `kept`).
import type { Game } from '../../src/app/game.ts';
import type { Feature, MapKey } from '../../src/game/mapdef.ts';
import { Scenes, placeKey, KEPT_MAX, READ_REACH } from '../../src/ui/view/kept.ts';
import type { Sized, Had } from '../../src/ui/view/kept.ts';
import type { ViewRect } from '../../src/ui/view/common.ts';
import { ok } from './lib.ts';
import { headlessGame, drive } from '../kit/headless.ts';

const R: ViewRect = { x: 0, y: 0, w: 400, h: 268 };

/** A store with stand-in canvases and a paint that counts, and one frame's ask of it. */
function store(): { s: Scenes<Sized>; paints: () => number; at: (g: Game, r?: ViewRect) => Had } {
  const s = new Scenes<Sized>(() => ({ width: 0, height: 0 }));
  let n = 0;
  return { s, paints: () => n, at: (g, r = R) => s.scene(g.world, r, () => { n++; return []; }).had };
}

/** A game on the Foreland's road, a minute fixed, its weather as the clock has it. */
function road(): Game {
  const g = headlessGame(4);
  g.world.travel('shelf', 16, 8, 2);
  return g;
}

export function kept(): void {
  frames();
  places();
  under();
  bound();
}

/** A frame, an animation tick and a slain group keep the scene; a turn back draws the facing kept. */
function frames(): void {
  const g = road(), { at, paints } = store();
  const first = at(g), again = at(g), more = [at(g), at(g)];
  ok(first === 'painted' && again === 'last' && more.every((h) => h === 'last') && paints() === 1,
    `a frame with nothing changed, and every frame after it, draws the scene drawn last unpainted (${first}, ${again}, ${more.join(', ')}; ${paints()} paint)`);
  const live = g.world.liveGroups()[0];
  if (live) { g.world.mapState.groups[live.def.id].dead = g.world.state.minutes; }
  const slain = at(g);
  ok(!!live && slain === 'last' && paints() === 1, `a group slain is no part of the scene (its figures are drawn each frame): the scene is kept (${slain}; ${live?.def.id})`);
  drive(g, ['turnLeft']);
  const turned = at(g);
  drive(g, ['turnRight']);
  const back = at(g), still = at(g);
  ok(turned === 'painted' && back === 'kept' && still === 'last' && paints() === 2,
    `a turn paints the facing turned to and keeps the one turned from, and the turn back draws it kept, unpainted (${turned}, ${back}, ${still}; ${paints()} paints)`);
  drive(g, ['turnLeft', 'turnLeft']);
  const round = [at(g)];
  drive(g, ['turnLeft']); round.push(at(g));
  drive(g, ['turnLeft']); round.push(at(g));
  drive(g, ['turnLeft']); round.push(at(g));
  ok(round.join(',') === 'painted,painted,kept,kept' && paints() === 4,
    `turning round paints each facing once and the square's four are kept (${round.join(', ')}; ${paints()} paints)`);
}

/** Everything the place is keyed by: each change paints anew and drops the other facings. */
function places(): void {
  const g = road(), w = g.world, { at, paints } = store();
  /** The scene painted at the facing, a turn and the turn back after `change`: the turn back must paint. */
  // Exploring again after each change: a step may meet a fight or a word, which would take the turns.
  const explore = (): void => { while (g.screens.length > 1) g.pop(); };
  const after = (name: string, change: () => void, r = R): void => {
    explore(); at(g, r); drive(g, ['turnLeft']); at(g, r); drive(g, ['turnRight']); at(g, r);
    const was = placeKey(w, r), n = paints();
    change(); explore();
    const now = at(g, r), key = placeKey(w, r);
    drive(g, ['turnLeft']); const left = at(g, r); drive(g, ['turnRight']); const back = at(g, r);
    ok(key !== was && now === 'painted' && left === 'painted' && back === 'kept' && paints() === n + 2,
      `${name} paints the scene anew and drops the square's other facings: the turn from it paints, and the turn back keeps the new (${now}, ${left}, ${back})`);
  };
  after('a step', () => drive(g, ['forward']));
  after('a minute on (a search, ten)', () => drive(g, ['search']));
  after('an hour on', () => { w.state.minutes += 60; });
  after('the weather (another seed)', () => { w.state.weatherSeed = (w.state.weatherSeed ?? 0) + 1; });
  after('a door opened', () => { w.mapState.doors['0,0'] = 'door'; });
  after('a flag set', () => { (w.party.flags as Record<string, number>).fx_kept = 1; });
  after('a light up', () => { w.state.light = 30; });
  after('another map (Harrow)', () => w.travel('harrow', 7, 12, w.state.facing));
  after('the dungeon (the mill)', () => w.travel('mill', 1, 1, w.state.facing));
  const R2 = { x: 9, y: 4, w: 384, h: 256 }, n = paints(), other = at(g, R2), again = at(g, R2), home = at(g, R);
  ok(other === 'painted' && again === 'last' && home === 'painted' && paints() === n + 2 && placeKey(w, R2) !== placeKey(w, R),
    `a rect of another size (the window resized) paints a scene of its own and drops the other's, and back again paints anew (${other}, ${again}, ${home})`);
  const g2 = headlessGame(4), s2 = store();
  s2.at(g2); const before = placeKey(g2.world, R);
  const fresh = headlessGame(4); fresh.world.travel(g2.world.state.mapId, g2.world.state.x, g2.world.state.y, g2.world.state.facing);
  fresh.world.state.minutes = g2.world.state.minutes;
  const h = s2.s.scene(fresh.world, R, () => []).had;
  ok(placeKey(fresh.world, R) === before && h === 'painted', `a new game standing where the last stood, at its minute, paints its own scene (the place ${placeKey(fresh.world, R) === before ? 'the same' : 'another'}, ${h})`);
}

/** Under a facing kept: what else the paint read, changed by hand, paints it again on the turn back. */
function under(): void {
  const g = road(), w = g.world, { at } = store();
  const back = (name: string, change: () => void): void => {
    at(g); drive(g, ['turnLeft']); at(g);
    const was = placeKey(w, R);
    change();
    drive(g, ['turnRight']);
    const h = at(g);
    ok(placeKey(w, R) === was && h === 'painted', `${name} under a facing kept paints it again as the party turns back to it (the place unchanged, ${h})`);
    drive(g, ['turnLeft']); at(g); drive(g, ['turnRight']); at(g);
  };
  const m = w.map, { x, y } = w.state;
  const shrine = { kind: 'shrine', id: 'fx_kept_shrine', x, y: y + 2, name: 'A Kept Shrine', after: { seen: `${w.state.mapId}:fx_kept_seen` as MapKey } } as unknown as Feature;
  (m.features as Feature[]).push(shrine);
  at(g);
  back('a feature about the party come (a shrine whose seen holds)', () => { w.mapState.used.fx_kept_seen = 1; });
  back('a feature about the party gone (the shrine taken off the map)', () => { (m.features as Feature[]).splice(m.features.indexOf(shrine), 1); });
  delete w.mapState.used.fx_kept_seen;
  const i = (y + 3) * m.width + x, cell = m.cells[i];
  back('a cell about the party laid anew by hand', () => { m.cells[i] = { ...cell }; });
  m.cells[i] = cell;
  back('a cell at the reach\'s edge laid anew', () => { const j = (y + READ_REACH) * m.width + x - READ_REACH; m.cells[j] = { ...m.cells[j] }; });
  const marks = m.landmarks;
  back('the map\'s landmarks replaced', () => { (m as { landmarks: typeof marks }).landmarks = [...marks]; });
  (m as { landmarks: typeof marks }).landmarks = marks;
  back('the weather read anew (pinned by hand)', () => { w['cached'] = { seed: w.state.weatherSeed!, minutes: w.state.minutes, region: w.region, weather: { ...w.weather, cloud: 0.9 } }; });
  w['cached'] = null;
  // The scene drawn last is held to the same: the next frame after a hand under it paints it again.
  at(g);
  const j = (y + 1) * m.width + x - 1, c1 = m.cells[j];
  m.cells[j] = { ...c1 };
  const next = at(g), then = at(g);
  m.cells[j] = c1;
  ok(next === 'painted' && then === 'last', `a cell laid anew by hand under the scene drawn last paints it again at the next frame (${next}, ${then})`);
}

/** No more than four scenes, one to each facing, and the canvases with them. */
function bound(): void {
  const g = road(), { s, at } = store();
  for (let i = 0; i < 12; i++) { drive(g, ['turnLeft']); at(g); }
  const held = s.held();
  drive(g, ['forward']); at(g);
  const stepped = s.held();
  for (let i = 0; i < 6; i++) { drive(g, [i % 2 ? 'turnLeft' : 'turnRight']); at(g); }
  const most = 4 * 2 * R.w * R.h * 4;
  ok(KEPT_MAX === 4 && held.scenes === 4 && held.canvases === 8 && held.bytes === most && stepped.scenes === 1 && stepped.canvases === 8 && s.held().canvases <= 8,
    `four scenes kept at most, one to each facing, in eight canvases of ${most.toLocaleString('en-GB')} bytes in all; a step keeps one and paints the next into the canvases dropped (${held.scenes}, ${held.canvases} canvases, ${held.bytes} bytes; after the step ${stepped.scenes}, ${stepped.canvases})`);
  s.drop();
  ok(s.held().canvases === 0 && at(g) === 'painted', `dropped, it holds no canvas and paints the next frame afresh`);
}
