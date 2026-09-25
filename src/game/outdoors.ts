// The outdoors as one map. Every outdoor map the atlas places is a zone of it, laid in 1:1 where the
// atlas puts it, so the party walks from the Shelf into Thornmark without a seam, and the painted map
// and the played one agree square for square. Where no zone map is laid yet the world simply ends:
// its cells are void, which nothing crosses and the viewport paints as pink empty space. Building a
// zone is how the world grows: a map of its own in content/maps/, placed by the atlas.
//
// The zone maps are still written as maps of their own, each closed in by its ring of mountains.
// Laid in, the stretch of that ring which faces unbuilt world is the end of the world as well, and
// the stretch between two zones (the ridge the Warden Pass cuts) stays mountains. The maps' ways
// out become the outdoors': a way into the next zone is walked, not jumped, so an exit from one
// zone map into another is dropped, its flags kept as a gate on its cell and its arrival line said
// on crossing into the zone. Every other exit, feature and monster group moves to where its zone
// sits, and the towns' and dungeons' ways out lead onto the outdoors instead. Pure.
import type { Atlas } from './atlas.ts';
import { zoneOfMap } from './atlas.ts';
import { VOID_CH } from './map.ts';
import type { MapDef, MapZone, Exit, Feature, EncounterDef, Gate, Cell } from './map.ts';

/** The outdoors' map id. */
export const OUTDOORS = 'caldera';

/** An exit this near its arrival, on the outdoors, joins two zones that meet there: it is walked across. */
const SEAM = 2.5;

interface Laid { def: MapDef; x: number; y: number; w: number; h: number }

/**
 * The maps as they are played: the outdoor maps the atlas places laid into one map the size of the
 * world, in the place of the first of them, and every other map as written with its ways onto a laid
 * map led onto the outdoors. Throws where laid maps overlap, fall outside the world, or share an id
 * a save keeps state under (a feature's or a monster group's).
 */
export function layOutdoors(atlas: Atlas, defs: readonly MapDef[]): MapDef[] {
  const W = atlas.width, H = atlas.height;
  const laid: Laid[] = [];
  for (const def of defs) {
    const at = def.kind === 'outdoor' ? zoneOfMap(atlas, def.id)?.at : undefined;
    if (at) laid.push({ def, x: at[0], y: at[1], w: Math.max(...def.rows.map((r) => r.length)), h: def.rows.length });
  }
  if (!laid.length) return defs.slice();
  const byId = new Map(laid.map((l) => [l.def.id, l]));

  // Which laid map each cell of the world is.
  const owner = new Int16Array(W * H).fill(-1);
  laid.forEach((l, k) => {
    for (let y = l.y; y < l.y + l.h; y++) for (let x = l.x; x < l.x + l.w; x++) {
      if (x < 0 || y < 0 || x >= W || y >= H) throw new Error(`${l.def.id}: laid outside the world at ${x},${y}`);
      const i = y * W + x;
      if (owner[i] >= 0) throw new Error(`${l.def.id}: laid over ${laid[owner[i]].def.id} at ${x},${y}`);
      owner[i] = k;
    }
  });
  const built = (x: number, y: number): boolean => x >= 0 && y >= 0 && x < W && y < H && owner[y * W + x] >= 0;
  const rows: string[] = [];
  for (let y = 0; y < H; y++) {
    const row: string[] = new Array(W);
    for (let x = 0; x < W; x++) {
      const k = owner[y * W + x];
      if (k < 0) { row[x] = VOID_CH; continue; }
      const l = laid[k], mx = x - l.x, my = y - l.y, ch = l.def.rows[my][mx] ?? '#';
      // The mountains that closed a zone map in, where they face nothing built, are the world's end.
      const open = (mx === 0 && !built(x - 1, y)) || (my === 0 && !built(x, y - 1)) || (mx === l.w - 1 && !built(x + 1, y)) || (my === l.h - 1 && !built(x, y + 1));
      row[x] = ch === 'M' && open ? VOID_CH : ch;
    }
    rows.push(row.join(''));
  }

  // A way onto a laid map lands where the map sits on the outdoors.
  const lead = <T extends { to: string; tx: number; ty: number }>(e: T): T => {
    const l = byId.get(e.to);
    return l ? { ...e, to: OUTDOORS, tx: e.tx + l.x, ty: e.ty + l.y } : e;
  };
  const exits: Exit[] = [], features: Feature[] = [], encounters: EncounterDef[] = [], gates: Gate[] = [];
  const legend: Record<string, Partial<Cell>> = {};
  const enter = new Map<string, Record<string, string>>();
  const used = new Set<string>(), groups = new Set<string>();
  for (const l of laid) {
    const place = <T extends { x: number; y: number }>(o: T): T => ({ ...o, x: o.x + l.x, y: o.y + l.y });
    for (const [ch, c] of Object.entries(l.def.legend ?? {})) {
      if (ch === VOID_CH || (legend[ch] && JSON.stringify(legend[ch]) !== JSON.stringify(c))) throw new Error(`${l.def.id}: its legend's '${ch}' clashes with the outdoors'`);
      legend[ch] = c;
    }
    for (const e of l.def.exits ?? []) {
      const to = byId.get(e.to);
      if (!to || Math.hypot(e.x + l.x - (e.tx + to.x), e.y + l.y - (e.ty + to.y)) > SEAM) { exits.push(place(lead(e))); continue; }
      // Into the zone next door: walked across, through the gate the exit's flags make, if any.
      if (e.needFlag) gates.push({ x: e.x + l.x, y: e.y + l.y, needFlag: e.needFlag, blockedText: e.blockedText });
      if (e.label) enter.set(e.to, { ...enter.get(e.to), [l.def.id]: e.label });
    }
    for (const f of l.def.features ?? []) {
      if ('id' in f) {
        if (used.has(f.id)) throw new Error(`${l.def.id}: feature id '${f.id}' is another zone's too, and the outdoors keeps one record of both`);
        used.add(f.id);
      }
      features.push(place(f.kind === 'rift' ? lead(f) : f));
    }
    for (const e of l.def.encounters ?? []) {
      if (groups.has(e.id)) throw new Error(`${l.def.id}: group id '${e.id}' is another zone's too, and the outdoors keeps one record of both`);
      groups.add(e.id);
      encounters.push(place(e));
    }
  }
  const zones: MapZone[] = laid.map((l) => ({
    id: l.def.id, name: l.def.name, x: l.x, y: l.y, w: l.w, h: l.h,
    band: l.def.band, region: l.def.region, palette: l.def.palette, enter: enter.get(l.def.id),
  }));
  const first = laid[0];
  const outdoors: MapDef = {
    id: OUTDOORS,
    name: 'Caldera',
    kind: 'outdoor',
    rows,
    legend,
    start: { ...first.def.start, x: first.def.start.x + first.x, y: first.def.start.y + first.y },
    exits, features, encounters, gates, zones,
  };
  const out: MapDef[] = [];
  for (const d of defs) {
    if (byId.has(d.id)) { if (d === first.def) out.push(outdoors); continue; }
    out.push({ ...d, exits: d.exits?.map(lead), features: d.features?.map((f) => (f.kind === 'rift' ? lead(f) : f)) });
  }
  return out;
}
