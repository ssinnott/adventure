// The curve's steps the suites share (#984): how far each square of a map is walked from its start.
// The curve suite measures by it; the gate takes it from here.
import { GameMap } from '../../../src/game/map.ts';
import type { MapDef } from '../../../src/game/map.ts';

/**
 * Walking steps from a map's way in (its start, or `from`) to every cell, given keys and secrets, swimming and
 * climbing: never through a wall, tree, rock, deep water or the void. Infinity where the party
 * cannot walk.
 */
export function stepsFrom(def: MapDef, from: { x: number; y: number } = def.start): (x: number, y: number) => number {
  const m = new GameMap(def);
  const steps = new Map<number, number>([[from.y * m.width + from.x, 0]]);
  const queue = [[from.x, from.y]];
  for (let i = 0; i < queue.length; i++) {
    const [x, y] = queue[i]; const n = steps.get(y * m.width + x)!;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const [nx, ny] = [x + dx, y + dy]; const k = ny * m.width + nx;
      if (!m.inBounds(nx, ny) || steps.has(k)) continue;
      const pass = m.passable(nx, ny, { swim: true, climb: true, keys: 1 });
      if (pass !== 'ok' && pass !== 'unlock') continue;
      steps.set(k, n + 1); queue.push([nx, ny]);
    }
  }
  return (x, y) => steps.get(y * m.width + x) ?? Infinity;
}
