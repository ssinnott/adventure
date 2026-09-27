// The art held to what the owner once found by hand. Every monster def has a drawing of its own
// (EXPANSION §5.6), and the walls are dressed with restraint: the share of wall faces that carry
// dressing stays near where #9 put it, and each kind of dressing has its rate. The silhouettes and
// the cracks need a canvas, so they are the smoke test's (tools/smoke.ts).
import { MONSTERS } from '../../src/content/index.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { wallDressing, isSolidWall, DRESSINGS, DRESSING_RATES } from '../../src/ui/viewport.ts';
import { hash } from '../../src/ui/brush.ts';
import { FACING_DX, FACING_DY } from '../../src/game/types.ts';
import type { GameMap } from '../../src/game/map.ts';
import { ok } from './lib.ts';

/** The defs that draw with a kind another def draws with too, as 'kind: a, b'. */
export function sharedKinds(defs: readonly { id: string; sprite: string }[]): string[] {
  const by = new Map<string, string[]>();
  for (const d of defs) by.set(d.sprite, [...(by.get(d.sprite) ?? []), d.id]);
  return [...by].filter(([, ids]) => ids.length > 1).map(([k, ids]) => `${k}: ${ids.join(', ')}`);
}

/**
 * The caps. A map of 100 faces or more has at most 35% of them dressed, a smaller one at most half;
 * a kind of map has at most 25% once its maps have 200 faces between them. Set above today's levels
 * (about a fifth: one wall in five is dressed by construction), so an honest new map does not fail
 * by chance, and far below the three in four and more dressed before #9.
 */
export const MAP_CAP = 0.35, SMALL_MAP_CAP = 0.5, SMALL_MAP = 100, KIND_CAP = 0.25, KIND_FLOOR = 200;

type Rule = (map: GameMap, x: number, y: number) => boolean;
interface Tally { id: string; kind: string; faces: number; dressed: number }

/**
 * Count the front faces of wall, doors left out, that look onto a cell the eye can stand in front
 * of, and how many of them `dressed` holds dressed: dressing is only drawn on a front face, and a
 * wall seen from two sides counts twice. A zone of the outdoors is a map of its own; the outdoors
 * outside every zone is 'caldera'.
 */
export function tallyWalls(maps: readonly GameMap[], dressed: Rule): Tally[] {
  const out = new Map<string, Tally>();
  for (const m of maps) for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) {
    const c = m.at(x, y);
    if (!isSolidWall(c) || c.solid === 'void' || c.door === 'door' || c.door === 'locked') continue;
    const id = m.zoneAt(x, y)?.id ?? m.id;
    const t = out.get(id) ?? { id, kind: m.kind, faces: 0, dressed: 0 };
    out.set(id, t);
    const on = dressed(m, x, y);
    for (let f = 0; f < 4; f++) {
      const nx = x + FACING_DX[f], ny = y + FACING_DY[f];
      if (!m.inBounds(nx, ny) || isSolidWall(m.at(nx, ny))) continue;
      t.faces++;
      if (on) t.dressed++;
    }
  }
  return [...out.values()].filter((t) => t.faces > 0);
}

/** The kinds of map, summed over their maps. */
export function byKind(tallies: readonly Tally[]): Tally[] {
  const out = new Map<string, Tally>();
  for (const t of tallies) {
    const k = out.get(t.kind) ?? { id: t.kind, kind: t.kind, faces: 0, dressed: 0 };
    k.faces += t.faces; k.dressed += t.dressed;
    out.set(t.kind, k);
  }
  return [...out.values()];
}

const share = (t: Tally): number => t.dressed / t.faces;
const pct = (t: Tally): string => `${(100 * share(t)).toFixed(1)}% of ${t.faces}`;
export const mapOver = (t: Tally): boolean => share(t) > (t.faces >= SMALL_MAP ? MAP_CAP : SMALL_MAP_CAP);
export const kindOver = (t: Tally): boolean => t.faces >= KIND_FLOOR && share(t) > KIND_CAP;

/**
 * The rule before #9 (21da74a), for the check to be seen failing: every wall rolled, no neighbour
 * held it back; stone was dressed below 0.78, or 0.86 where it is no door of any kind, and a house
 * front below 0.55.
 */
export const BEFORE_9: Rule = (m, x, y) => {
  const c = m.at(x, y), roll = hash(x * 131 + y * 17 + m.id.length * 7, 77);
  const house = m.kind === 'town' && (c.solid === 'building' || c.door === 'door' || c.door === 'locked');
  return house ? roll < 0.55 : roll < 0.78 || (roll < 0.86 && c.door === 'none');
};

export function art(): void {
  // A drawing of its own: the typecheck holds each kind to a drawing, but nothing held two defs off one.
  const clash = sharedKinds(Object.values(MONSTERS).map((d) => ({ id: d.id, sprite: d.sprite })));
  ok(clash.length === 0, `every monster def has a sprite kind no other def uses (${Object.keys(MONSTERS).length} defs)${clash.length ? ' -> ' + clash.join('; ') : ''}`);
  ok(sharedKinds([{ id: 'wolf', sprite: 'wolf' }, { id: 'dire_wolf', sprite: 'wolf' }, { id: 'rat', sprite: 'rat' }]).join() === 'wolf: wolf, dire_wolf', 'a def given another\'s sprite kind is caught');

  // Each kind of dressing has its rate, and a wall's rates leave room for bare stone at most, not more.
  for (const [wall, kinds] of Object.entries(DRESSINGS)) {
    const sum = kinds.reduce((n, k) => n + DRESSING_RATES[k], 0);
    ok(kinds.every((k) => DRESSING_RATES[k] > 0) && sum <= 1 + 1e-9, `each kind of ${wall} dressing has a rate, and they add up to 1 at most (${kinds.map((k) => `${k} ${DRESSING_RATES[k]}`).join(', ')}; ${sum.toFixed(2)})`);
  }

  // Restraint, on the maps as played.
  const maps = Object.values(buildMaps());
  const now = tallyWalls(maps, (m, x, y) => wallDressing(m, x, y) !== null);
  for (const t of byKind(now)) ok(!kindOver(t), `${t.kind}: ${pct(t)} wall faces dressed, at most ${100 * KIND_CAP}%`);
  const over = now.filter(mapOver);
  ok(over.length === 0, `every map dresses at most ${100 * MAP_CAP}% of its wall faces (${100 * SMALL_MAP_CAP}% under ${SMALL_MAP}): ${now.map((t) => `${t.id} ${(100 * share(t)).toFixed(1)}%`).join(', ')}${over.length ? ' -> over: ' + over.map((t) => t.id).join(', ') : ''}`);
  // A door's lantern and sign are its furniture, reported, not capped: every house door has a lantern.
  const doors = maps.filter((m) => m.kind === 'town').flatMap((m) => m.cells.filter((c) => c.door === 'door' || c.door === 'locked'));
  console.log(`  (door furniture: ${doors.length} house doors, each with a lantern; ${maps.flatMap((m) => m.features.filter((f) => m.kind === 'town' && m.at(f.x, f.y).door !== 'none')).length} with a sign)`);

  // The check fails the walls as they were dressed before #9: every map, and every kind of map with
  // faces enough to be held to its cap.
  const then = tallyWalls(maps, BEFORE_9);
  const kindsThen = byKind(then);
  ok(kindsThen.every((t) => t.faces < KIND_FLOOR || kindOver(t)) && kindsThen.some(kindOver) && then.every(mapOver), `walls dressed as before #9 fail: ${kindsThen.map((t) => `${t.kind} ${pct(t)}`).join(', ')}${then.some((t) => !mapOver(t)) ? ' -> passed: ' + then.filter((t) => !mapOver(t)).map((t) => t.id).join(', ') : ''}`);
}
