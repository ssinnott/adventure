// The pillars, where a machine can check them (EXPANSION §5.4): every secret door has a hint on its
// near side. Each check is a function of the content it reads, so it runs over every area and over
// fixtures broken on purpose, which it must refuse.
import { AREAS } from '../../src/content/index.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef } from '../../src/game/map.ts';
import { NORTH } from '../../src/game/types.ts';
import { ok } from './lib.ts';

/**
 * What is wrong with a map's secret doors and their hints: a secret door with no hint declared, a
 * hint on a square with no secret door, a hint that names nothing on the map, or one that cannot be
 * reached from the start with that door shut. The flood is the strictest: no keys, no swimming or
 * climbing; the other secret doors are walkable, as the party finds doors by walking into walls.
 */
export function hintFaults(def: MapDef): string[] {
  const map = new GameMap(def), out: string[] = [];
  const declared = def.secrets ?? [];
  for (let y = 0; y < map.height; y++) for (let x = 0; x < map.width; x++) {
    if (map.at(x, y).door === 'secret' && !declared.some((s) => s.x === x && s.y === y)) out.push(`the secret door at ${x},${y} names no hint`);
  }
  for (const s of declared) {
    if (map.at(s.x, s.y).door !== 'secret') { out.push(`${s.x},${s.y} has a hint but no secret door`); continue; }
    const hint = map.features.find((f) => 'id' in f && f.id === s.hint && (f.kind === 'event' || f.kind === 'sign'));
    if (!hint) { out.push(`the door at ${s.x},${s.y} names '${s.hint}', which is no event or sign on the map`); continue; }
    const seen = new Set([def.start.y * map.width + def.start.x]), todo = [[def.start.x, def.start.y]];
    while (todo.length) {
      const [x, y] = todo.pop()!;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy, i = ny * map.width + nx;
        if (seen.has(i) || (nx === s.x && ny === s.y) || map.passable(nx, ny) !== 'ok') continue;
        seen.add(i); todo.push([nx, ny]);
      }
    }
    if (!seen.has(hint.y * map.width + hint.x)) out.push(`'${s.hint}' at ${hint.x},${hint.y} lies behind the door at ${s.x},${s.y}, or out of reach`);
  }
  return out;
}

export function pillars(): void {
  // Hints: every secret door names one, on its near side.
  for (const area of AREAS) {
    let doors = 0, bad = 0;
    for (const def of area.maps) {
      const faults = hintFaults(def);
      doors += def.secrets?.length ?? 0; bad += faults.length;
      if (def.secrets?.length || faults.length) ok(!faults.length, `${area.id}/${def.id}: each secret door's hint can be reached without it${faults.length ? ' -> ' + faults.join('; ') : ''}`);
    }
    ok(!bad, `${area.id}: ${doors} secret door(s), each with its hint`);
  }
  {
    const room = (secrets: MapDef['secrets'], text = 'A draught.'): MapDef => ({
      id: 'fixture_hint', name: 'Hint fixture', kind: 'dungeon', start: { x: 1, y: 1, facing: NORTH },
      rows: ['#######', '#..S..#', '#######'], secrets,
      features: [{ kind: 'event', x: 2, y: 1, id: 'near', text }, { kind: 'event', x: 4, y: 1, id: 'far', text }, { kind: 'sign', x: 5, y: 1, id: 'far_sign', text }],
    });
    ok(!hintFaults(room([{ x: 3, y: 1, hint: 'near' }])).length, 'a hint on the near side of its door passes');
    ok(hintFaults(room(undefined)).length === 1, 'a secret door with no hint declared fails');
    ok(hintFaults(room([{ x: 3, y: 1, hint: 'far' }])).length === 1, 'a hint that lies behind its own door fails');
    ok(hintFaults(room([{ x: 3, y: 1, hint: 'far_sign' }])).length === 1, 'and so does a sign behind it');
    ok(hintFaults(room([{ x: 3, y: 1, hint: 'nowhere' }])).length === 1, 'a hint that names nothing fails');
    ok(hintFaults(room([{ x: 3, y: 1, hint: 'near' }, { x: 2, y: 1, hint: 'near' }])).length === 1, 'a hint on a square with no secret door fails');
  }
}
