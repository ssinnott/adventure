// The atlas's lookups and ways: where a built map lies and which zone and area hold it, an area's
// level band and a map's place on the road, the arrows between places (the maps' exits, the
// crossings sold and the links of the plan), the road of levels and what a company can reach on
// it. Pure: nothing here draws.
import type { MapDef } from '../mapdef.ts';
import type { Atlas, AtlasArea, AtlasZone, LinkKind, Pt } from './schema.ts';

// ---------------------------------------------------------------- lookups

/** The zone a built outdoor map is part of, if the atlas places it. */
export function zoneOfMap(atlas: Atlas, mapId: string): AtlasZone | undefined {
  return atlas.zones.find((z) => z.maps?.some((m) => m.map === mapId));
}

/** Where the atlas lays a built outdoor map: its top-left cell on the world grid. */
export function mapAt(atlas: Atlas, mapId: string): Pt | undefined {
  for (const z of atlas.zones) for (const m of z.maps ?? []) if (m.map === mapId) return m.at;
  return undefined;
}

/** The area an id belongs to: an area itself, a zone's area, or a built map's zone's area. */
export function areaOf(atlas: Atlas, id: string): AtlasArea | undefined {
  const direct = atlas.areas.find((a) => a.id === id);
  if (direct) return direct;
  const z = atlas.zones.find((q) => q.id === id) ?? zoneOfMap(atlas, id);
  return z ? atlas.areas.find((a) => a.id === z.area) : undefined;
}

/**
 * Where a map is on the world map, in world cells: over a place's plate, else a built outdoor map's
 * middle where the atlas lays it, else the middle of the outdoor map it opens onto (`homeMap`). The
 * world map pins a quest's place and a reading's mark here, and the pilot's fair view reads it.
 */
export function mapPlace(atlas: Atlas, defs: readonly MapDef[], mapId: string): [number, number] | undefined {
  const pl = atlas.places.find((q) => q.id === mapId);
  if (pl) return [pl.at[0], pl.at[1]];
  const middle = (id: string): [number, number] | undefined => {
    const at = mapAt(atlas, id), def = defs.find((q) => q.id === id);
    return at && def ? [at[0] + Math.max(...def.rows.map((s) => s.length)) / 2, at[1] + def.rows.length / 2] : undefined;
  };
  const home = middle(mapId) ? undefined : homeMap(defs, mapId);
  return middle(mapId) ?? (home && middle(home.id));
}

/** A map cell's centre on the world grid, for maps the atlas places. */
export function worldPoint(atlas: Atlas, mapId: string, x: number, y: number): [number, number] | null {
  const at = mapAt(atlas, mapId);
  return at ? [at[0] + x + 0.5, at[1] + y + 0.5] : null;
}

/**
 * An area's level band: its built maps' bands and its planned zones', together. A zone with maps
 * built reads their bands; one with none built yet, its planned band. The places of kind `deep` its
 * deep ways lead down to, one from another, widen it (the Hearth's Underdeep and Core, 30 to 32): the
 * road counts them steps of their own, but their levels are the area's, so its band stays the atlas's
 * once its boxes are laid (docs/areas/hearth.md §9, call 2). A deep place reads its own band, as
 * its step on the road does, or its map's when it has none.
 */
export function areaBand(atlas: Atlas, defs: readonly MapDef[], areaId: string): [number, number] | undefined {
  const area = atlas.areas.find((a) => a.id === areaId);
  let lo = Infinity, hi = -Infinity;
  const widen = (b: readonly [number, number]): void => { lo = Math.min(lo, b[0]); hi = Math.max(hi, b[1]); };
  const from = new Set([areaId]);
  for (const z of atlas.zones) {
    if (z.area !== areaId) continue;
    const built = (z.maps ?? []).map((m) => defs.find((d) => d.id === m.map)?.band).filter((b) => !!b);
    const bands = built.length ? built : [z.band ?? area?.band].filter((b) => !!b);
    for (const b of bands) widen(b);
    for (const id of [z.id, ...(z.maps ?? []).map((m) => m.map)]) from.add(id);
  }
  if (!Number.isFinite(lo) && area?.band) widen(area.band);
  // A set walked while it grows visits what is added, so this follows the deep ways to the last.
  for (const id of from) {
    for (const l of atlas.links) {
      const p = l.kind === 'deep' && l.from === id && !from.has(l.to) ? atlas.places.find((q) => q.id === l.to && q.kind === 'deep') : undefined;
      if (!p) continue;
      from.add(p.id);
      const b = p.band ?? defs.find((d) => d.id === p.id)?.band;
      if (b) widen(b);
    }
  }
  return Number.isFinite(lo) ? [lo, hi] : undefined;
}

/**
 * A map's place on the road, decided once for the pace check and the novelty check: the order of
 * its area, or, where its floor is over its area's band (the Dead-Drop under the Tide Ship, 26 to
 * 28 in Act II's isle), the order of the last area whose floor is at or under its own. A map with
 * no floor, or an area with no band, stands where its area does.
 */
export function roadPlace(atlas: Atlas, defs: readonly MapDef[]): (area: string, def: Pick<MapDef, 'band'>) => number {
  const order = (id: string): number => atlas.areas.find((a) => a.id === id)?.order ?? Infinity;
  const bands = atlas.areas.map((a) => ({ order: a.order, band: areaBand(atlas, defs, a.id) })).filter((a): a is { order: number; band: [number, number] } => !!a.band);
  return (area, def) => {
    const own = order(area), top = bands.find((b) => b.order === own)?.band[1], floor = def.band?.[0];
    if (floor === undefined || top === undefined || floor <= top) return own;
    return Math.max(own, ...bands.filter((b) => b.band[0] <= floor).map((b) => b.order));
  };
}

/** One arrow of the zone overlay. */
export interface ZoneEdge {
  from: string;
  to: string;
  kind: LinkKind;
  planned: boolean;
  /** Travelled both ways (the maps have an exit each way, or it is a planned road, door or crossing). */
  both: boolean;
  /** Party flags the way waits on, from the exit's `needFlag`. */
  gate: string[];
  /** The step after which a planned way opens. */
  opens?: number;
  /** Ends on the world grid; absent means the place's plate or the zone's label. */
  a?: Pt;
  b?: Pt;
  via?: readonly Pt[];
  note?: string;
  noteAt?: Pt;
}

/**
 * The ways: every pair of built maps an exit joins, merged with its return exit, then the crossings
 * people sell, then the atlas's planned links; a crossing link that a crossing is now sold both ways
 * on is planned no longer, and the crossing takes its course and name. Outdoor-to-outdoor exits run from the exit cell to the arrival cell; an exit into a
 * town or dungeon runs from its cell to that place's plate; stairs join plates.
 */
export function zoneEdges(atlas: Atlas, defs: readonly MapDef[]): ZoneEdge[] {
  const kindOf = new Map(defs.map((d) => [d.id, d.kind]));
  const edges: ZoneEdge[] = [];
  for (const d of defs) for (const e of d.exits ?? []) {
    // Only `needFlag` is a gate on the overlay. A `shut` turns back some companies, not the way, so
    // its `lifts` has nothing here to lift; an `after` is an appearance, no lock (#749), so its way
    // is drawn as the built way it is.
    const gate = [e.needFlag ?? []].flat();
    const back = edges.find((x) => x.from === e.to && x.to === d.id && !x.planned);
    if (back) { back.both = true; back.gate = [...new Set([...back.gate, ...gate])]; continue; }
    if (edges.some((x) => x.from === d.id && x.to === e.to && !x.planned)) continue;
    const fromOut = kindOf.get(d.id) === 'outdoor', toOut = kindOf.get(e.to) === 'outdoor';
    const kind: LinkKind = fromOut && toOut ? 'road' : fromOut || toOut ? 'enter' : 'stairs';
    const edge: ZoneEdge = { from: d.id, to: e.to, kind, planned: false, both: false, gate };
    if (fromOut) edge.a = worldPoint(atlas, d.id, e.x, e.y) ?? undefined;
    if (toOut) edge.b = worldPoint(atlas, e.to, e.tx, e.ty) ?? undefined;
    edges.push(edge);
  }
  // An exit out of a town or dungeon that is listed first leaves its outdoor end at the arrival
  // cell; the arrow belongs on the entrance, so take it from the matching exit the other way.
  for (const edge of edges) {
    if (kindOf.get(edge.to) === 'outdoor' && kindOf.get(edge.from) !== 'outdoor' && edge.both) {
      const out = defs.find((d) => d.id === edge.to)?.exits?.find((x) => x.to === edge.from);
      if (out) { const p = worldPoint(atlas, edge.to, out.x, out.y); if (p) edge.b = p; }
    }
  }
  // The crossings people sell (game/passage.ts): a boat's by sea, a coach's by coach, each from its
  // seller's square to its landing; one each way is travelled both ways.
  for (const d of defs) for (const f of d.features ?? []) {
    if (f.kind !== 'npc') continue;
    for (const p of f.passage ?? []) {
      const kind: LinkKind = p.by === 'boat' ? 'sea' : 'coach';
      const back = edges.find((x) => x.from === p.to && x.to === d.id && x.kind === kind && !x.planned);
      if (back) { back.both = true; continue; }
      if (edges.some((x) => x.from === d.id && x.to === p.to && x.kind === kind && !x.planned)) continue;
      const edge: ZoneEdge = { from: d.id, to: p.to, kind, planned: false, both: false, gate: [] };
      if (kindOf.get(d.id) === 'outdoor') edge.a = worldPoint(atlas, d.id, f.x, f.y) ?? undefined;
      if (kindOf.get(p.to) === 'outdoor') edge.b = worldPoint(atlas, p.to, p.x, p.y) ?? undefined;
      edges.push(edge);
    }
  }
  // A map stands for its place on the atlas: a town's for the town, a box's for its zone (#547).
  const is = (map: string, place: string): boolean => map === place || atlas.zones.some((z) => z.id === place && !!z.maps?.some((m) => m.map === map));
  for (const l of atlas.links) {
    // A crossing link the crossings now run on, sold both ways between the two places it names (a
    // zone by its box), is built (#539): the crossing takes its course and its name, and it is not
    // drawn again as planned.
    const sold = (l.kind === 'sea' || l.kind === 'coach') && edges.find((x) => !x.planned && x.both && x.kind === l.kind && ((is(x.from, l.from) && is(x.to, l.to)) || (is(x.from, l.to) && is(x.to, l.from))));
    if (sold) {
      const on = is(sold.from, l.from);
      sold.a ??= on ? l.a : l.b; sold.b ??= on ? l.b : l.a;
      sold.via = l.via && (on ? l.via : [...l.via].reverse());
      sold.note = l.note; sold.noteAt = l.noteAt;
      continue;
    }
    edges.push({
      from: l.from, to: l.to, kind: l.kind, planned: true, both: l.kind === 'road' || l.kind === 'enter' || l.kind === 'sea' || l.kind === 'coach',
      gate: [], opens: l.opens, a: l.a, b: l.b, via: l.via, note: l.note, noteAt: l.noteAt,
    });
  }
  return edges;
}

/** One step on the road of levels. */
interface Step { order: number; id: string; name: string; band?: readonly [number, number]; built: boolean }

/** The progression, first step first: every area, and every place that is a step of its own. */
export function progression(atlas: Atlas, defs: readonly MapDef[]): Step[] {
  const steps: Step[] = [];
  for (const a of atlas.areas) {
    const built = atlas.zones.some((z) => z.area === a.id && !!z.maps?.some((m) => defs.some((d) => d.id === m.map)));
    steps.push({ order: a.order, id: a.id, name: a.name, band: areaBand(atlas, defs, a.id), built });
  }
  for (const p of atlas.places) if (p.order != null) steps.push({ order: p.order, id: p.id, name: p.name ?? p.id, band: p.band, built: !p.planned });
  return steps.sort((a, b) => a.order - b.order);
}

/**
 * Which areas and places the party can reach once `done` steps are finished: a walk over every
 * built exit and every planned way already open, from the first area. Built maps and zones stand
 * for the areas that hold them.
 */
export function reachable(atlas: Atlas, defs: readonly MapDef[], done: number): Set<string> {
  const edges = zoneEdges(atlas, defs);
  const alias = (id: string): string => areaOf(atlas, id)?.id ?? id;
  const start = atlas.areas.reduce((a, b) => (a.order <= b.order ? a : b));
  const seen = new Set([start.id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const e of edges) {
      if (e.opens != null && e.opens > done) continue;
      const f = alias(e.from), t = alias(e.to);
      if (seen.has(f) && !seen.has(t)) { seen.add(t); grew = true; }
      if (e.both && seen.has(t) && !seen.has(f)) { seen.add(f); grew = true; }
    }
  }
  return seen;
}

/** The outdoor map a town or dungeon opens onto, following exits up through its levels. */
export function homeMap(defs: readonly MapDef[], mapId: string): MapDef | undefined {
  const byId = new Map(defs.map((d) => [d.id, d]));
  const seen = new Set([mapId]);
  let frontier = [mapId];
  while (frontier.length) {
    const next: string[] = [];
    for (const id of frontier) for (const e of byId.get(id)?.exits ?? []) {
      // An exit that is there only `after` something (#749) is no way the place opens onto.
      if (seen.has(e.to) || e.after) continue;
      seen.add(e.to);
      const d = byId.get(e.to);
      if (d?.kind === 'outdoor') return d;
      next.push(e.to);
    }
    frontier = next;
  }
  return undefined;
}
