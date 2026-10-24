// Density: something to find within a few steps of every square (EXPANSION §1, §5.3). Walked in
// four-way steps from every point of interest at once (a feature, a group's start, a way in or out)
// over the squares a party can stand on; a point's own square is 0 steps and a locked door is open.
// Points are counted by square, and a sign or event that says nothing is no point, so neither a stack
// of points on one square nor a scatter of empty ones meets the floor or dilutes the sign cap. A well
// that says nothing still counts: it is drawn, and it may heal.
// The maps as written, not as played: the played outdoors joins the zones and makes their exits gates.
import { AREAS } from '../../src/content/index.ts';
import type { Exit, Feature, MapDef } from '../../src/game/mapdef.ts';
import { NORTH } from '../../src/game/types.ts';
import { ok, fxMap } from './lib.ts';
import { judge } from '../kit/rules/density.ts';

export function density(): void {
  for (const a of AREAS) for (const def of a.maps) {
    const { why, line } = judge(def);
    ok(!why, `${a.id}/${line}${why ? ': ' + why : ''}`);
  }

  // The check catches what it is for, on fields built here, so no edit to the maps can turn one red.
  const fails = (d: MapDef, what: string, msg: string): void => { const w = judge(d).why; ok(w.includes(what), `${msg}: ${w || 'passes'}`); };
  const passes = (d: MapDef, msg: string): void => { const w = judge(d).why; ok(!w, `${msg}${w ? ': ' + w : ''}`); };
  const chest = (x: number, y = 0): Feature => ({ kind: 'chest', x, y, id: `c${x}_${y}`, gold: 1, items: [] });
  const exit = (x: number, y = 0): Exit => ({ x, y, to: fxMap('nowhere'), tx: 0, ty: 0 });

  // A road of grass 73 squares long, a way off it at one end.
  const road = (features: Feature[], density?: 'core' | 'country'): MapDef =>
    ({ id: 'road', name: 'Road', kind: 'outdoor', density, start: { x: 0, y: 0, facing: NORTH }, rows: [','.repeat(73)], exits: [exit(0)], features });
  const every12 = [12, 24, 36, 48, 60, 72].map((x) => chest(x));
  passes(road(every12, 'core'), 'a road with a chest every 12 squares passes core');
  fails(road([], 'core'), 'under 90% within 8', 'and stripped of its features fails');
  // A chest every 24: all within 12, but only 21 of 73 squares past 8.
  const every24 = [24, 48, 72].map((x) => chest(x));
  passes(road(every24, 'country'), 'a chest every 24 squares passes country');
  fails(road(every24, 'core'), 'under 90% within 8', 'and fails core: the mark switches the floor');
  const event = (x: number, text: string, y = 0): Feature => ({ kind: 'event', x, y, id: `e${x}`, text });
  const between = [4, 8, 12, 16, 20, 28, 32, 36, 40, 44, 52, 56, 60, 64, 68];
  fails(road([...every24, ...between.map((x) => event(x, ''))], 'core'), 'under 90% within 8', 'events that say nothing do not meet the floor');
  fails(road([...every24, ...between.map((x) => event(x, '  '))], 'core'), 'under 90% within 8', 'nor do events that say only spaces');
  passes(road([...every24, ...between.map((x) => event(x, 'A stone.'))], 'core'), 'the same events with something to say do');
  passes(road([...every24, ...between.map((x): Feature => ({ kind: 'well', x, y: 0, text: '', heal: true }))], 'core'), 'and so do wells that say nothing: a well is drawn and heals');
  fails(road(every24, undefined), 'neither core nor country', 'an outdoor map with no mark fails');

  // A hall of stone, a way out at one end.
  const hall = (features: Feature[], width = 7, extra: Partial<MapDef> = {}): MapDef => ({
    id: 'hall', name: 'Hall', kind: 'dungeon', start: { x: 1, y: 1, facing: NORTH },
    rows: ['#'.repeat(width + 2), `#${'.'.repeat(width)}#`, '#'.repeat(width + 2)], exits: [exit(1, 1)], features, ...extra,
  });
  passes(hall([8, 15, 22, 28].map((x) => chest(x, 1)), 28), 'a hall 28 long with a chest every 7 squares passes the dungeon floor');
  fails(hall([], 28), 'under 90% within 7', 'and stripped of its features fails');
  fails(hall([], 7, { density: 'core' }), 'only an outdoor map', 'a dungeon with a mark fails');

  // The sign cap: one square in four a sign passes, one more fails.
  const sign = (x: number): Feature => ({ kind: 'sign', x, y: 1, text: 'Hall.' });
  passes(hall([chest(3, 1), chest(5, 1), sign(7)]), 'a way out, two chests and a sign pass (1 of 4)');
  fails(hall([chest(3, 1), chest(5, 1), sign(6), sign(7)]), 'a sign', 'and two signs fail (2 of 5)');
  const stack = Array.from({ length: 30 }, (_, i): Feature => ({ kind: 'event', x: 1, y: 1, id: `s${i}`, text: 'Here.' }));
  fails(hall([chest(3, 1), sign(7), ...stack]), 'a sign', 'thirty events on the way out\'s square are no more points (1 sign of 3)');
  fails(hall([chest(3, 1), sign(7), ...[2, 4, 6].map((x) => event(x, '', 1))]), 'a sign', 'and empty ones are none (1 sign of 3)');
  passes(hall([chest(3, 1), sign(7), { kind: 'well', x: 5, y: 1, text: '' }]), 'but a well that says nothing is one (1 sign of 4)');
  const island: MapDef = { id: 'island', name: 'Island', kind: 'dungeon', start: { x: 1, y: 1, facing: NORTH }, rows: ['#####', '#.#.#', '#####'], exits: [] };
  fails(island, 'nothing reaches', 'a square nothing reaches fails');
}
