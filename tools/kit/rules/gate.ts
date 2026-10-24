// The gate's rules the suites share (#984): each figure's aim and limit (`GATE`) and a map's
// landings. The gate suite holds them; the harness and passage suites take them from here.
import type { MapDef } from '../../../src/game/mapdef.ts';

/**
 * Each figure's aim, and its limit beyond it (#273): a figure inside its aim passes; one between its
 * aim and its limit passes and is listed as off its aim; one past its limit fails. The pilot weighed
 * them on every box of the Downs and moved none (#47, docs/areas/shelf.md §8).
 */
export const GATE = {
  /** At the floor, the share of the fights won: through. At least. */
  through: { aim: 0.9, limit: 0.8 },
  /** Two levels under the floor, the share won: back. At most. Under `dayFrom` alone: Act I's floors. */
  back: { aim: 0.25, limit: 0.9 },
  /**
   * From `dayFrom`, two levels under the floor, its fights to a rest as a share of the floor's
   * (harness's fightsPerRest): back by the day (#851). At most: two thirds, and never the floor's own.
   */
  backDay: { aim: 2 / 3, limit: 1 },
  /** At the floor, the share of companies that walk the zone's road. At least. */
  road: { aim: 0.8, limit: 0.65 },
  /** The boss at its map's floor: about half. Within. */
  boss: { aim: [0.3, 0.7], limit: [0.2, 0.8] } as { aim: readonly [number, number]; limit: readonly [number, number] },
  /** The boss two levels above its map's floor: nearly always. At least. */
  bossAbove: { aim: 0.9, limit: 0.75 },
  /** How far fights to a rest may fall under and rise over harness's fightsPerRest: 5.5 to 7.5, and 4 to 10, at 6.5. */
  perRest: { aim: [1, 1], limit: [2.5, 3.5] } as { aim: readonly [number, number]; limit: readonly [number, number] },
  /** How far under its zone's median group the groups nearest its way in may be won. */
  warning: { aim: 0.01, limit: 0.1 },
  /** How far below its floor a company is held back. */
  under: 2,
  /** The floor from which two under is judged by the day (backDay), not the fight (back): Saltreach's, Act II's first. */
  dayFrom: 10,
};

/**
 * Where the crossings people sell (game/passage.ts) put a company onto map `id`: a crossing's landing
 * on it, and where a crossing lands in a town, that town's ways out onto it. Each is a way in, as a
 * coach carries a company past country it has not earned (#164).
 */
export function landings(defs: readonly MapDef[], id: string): { x: number; y: number; by: string }[] {
  const out: { x: number; y: number; by: string }[] = [];
  for (const d of defs) for (const f of d.features ?? []) {
    if (f.kind !== 'npc') continue;
    for (const p of f.passage ?? []) {
      const by = `${p.by} from ${d.id}`;
      if (p.to === id) out.push({ x: p.x, y: p.y, by });
      const town = defs.find((t) => t.id === p.to && t.kind === 'town');
      for (const e of town?.exits ?? []) if (e.to === id && !out.some((o) => o.x === e.tx && o.y === e.ty && o.by === by)) out.push({ x: e.tx, y: e.ty, by: `${by} through ${town!.id}` });
    }
  }
  return out;
}
