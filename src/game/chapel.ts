// Where a fallen company wakes (#1069): `nearestChapel`, the chapel the Lanterns carry a wiped company
// to, nearest by the road of levels (a temple standing in the area it fell in, else in the nearest
// area behind it on the road, else ahead; with none standing, Town Portal's town), and `wakeAtChapel`,
// the carrying: the next morning, the chapel's square, the first in the party order on 1 hit point
// and the two lines the log says. The Game (app/game.ts, `Game.fall`) calls it and opens the chapel.
import { areaOf, homeMap, mapPlace } from './atlas/ways.ts';
import type { Facing } from './types.ts';
import type { World } from './world.ts';

/**
 * Where the Lanterns carry a fallen company: a chapel's square and its name, the menu that opens there
 * (`chapel`); or, with no chapel standing, Town Portal's town, at its start and facing as it does.
 */
interface Haven { mapId: string; x: number; y: number; facing?: Facing; name: string; chapel: boolean }

/**
 * A square's place on the road: the order of its area, the area of the zone it lies in outdoors, else
 * of the outdoor map a town or dungeon opens onto (`homeMap`), and where it lies on the world map,
 * for the crow; none where the atlas places neither.
 */
function placed(w: World, mapId: string, x: number, y: number): { order: number; at?: [number, number] } | undefined {
  const { atlas, maps: defs } = w.tables, out = w.maps[mapId]?.kind === 'outdoor';
  const id = out ? w.maps[mapId].zoneAt(x, y)?.id : mapId;
  const area = id && areaOf(atlas, out ? id : homeMap(defs, id)?.id ?? id);
  return area ? { order: area.order, at: mapPlace(atlas, defs, id) } : undefined;
}

/** Whether one rank comes before another: figure by figure, the first that differs deciding. */
const before = (a: readonly number[], b: readonly number[]): boolean => {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] < b[i];
  return false;
};

/**
 * The chapel nearest the party by the road of levels (ruling 2 of #1069): every temple of every map
 * standing now, those of the area the party is in first, then those of the nearest area behind it,
 * then of the nearest ahead; of two at one place, the nearer by the crow, else the first in the maps'
 * order. Where none stands, or the atlas places the party nowhere, Town Portal's town (`portalTown`).
 */
export function nearestChapel(w: World): Haven {
  const s = w.state, here = placed(w, s.mapId, s.x, s.y);
  let best: { haven: Haven; rank: number[] } | undefined;
  if (here) for (const [mapId, m] of Object.entries(w.maps)) for (const f of m.features) {
    if (f.kind !== 'temple' || !w.present(f, mapId)) continue;
    const p = placed(w, mapId, f.x, f.y);
    if (!p) continue;
    // Behind (or here) before ahead, then the fewer places on the road, then the crow.
    const back = here.order - p.order, crow = here.at && p.at ? Math.hypot(here.at[0] - p.at[0], here.at[1] - p.at[1]) : 0;
    const rank = [back >= 0 ? 0 : 1, Math.abs(back), crow];
    if (!best || before(rank, best.rank)) best = { haven: { mapId, x: f.x, y: f.y, name: f.name, chapel: true }, rank };
  }
  if (best) return best.haven;
  const town = w.maps[w.portalTown()], start = town.def.start;
  return { mapId: town.id, x: start.x, y: start.y, facing: start.facing, name: town.name, chapel: false };
}

/**
 * The Lanterns carry a fallen company in (#1069): the clock to the next morning, then to the chapel
 * standing then (`nearestChapel`), the truce gone as Town Portal ends it. The first in the party order
 * is restored as a chapel's cure restores (`cure`, game/services.ts), for nothing: every condition
 * lifted, a fallen one on 1 hit point. The rest lie as they fell. The two lines the log says of it.
 */
export function wakeAtChapel(w: World): [string, string] {
  w.sleepUntilMorning();
  const to = nearestChapel(w), [first, ...rest] = w.party.members;
  w.travel(to.mapId, to.x, to.y, to.facing);
  w.state.truce = 0; w.state.truceGroups = [];
  first.conditions = [];
  if (first.hp <= 0) first.hp = 1;
  const where = to.chapel ? `the ${to.name.replace(/^The /, '')}` : to.name.replace(/^The /, 'the ');
  return [`The Lanterns found you on the road and carried you to ${where}.`, `${first.name} wakes at dawn.${rest.length ? ' The rest lie as they fell.' : ''}`];
}
