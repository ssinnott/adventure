// The world map's model: Caldera as one grid of cells, and the zone graph drawn over it. The atlas
// content sketches the whole world coarsely; every built outdoor map is stamped into that sketch
// 1:1 where its region sits, so the painted map shows the real Shelf and the real Thornmark, and
// the zone overlay's arrows come from the maps' own exits. Pure: nothing here draws.
//
// The world is one road of levels with a winding route: every area has a step in the progression
// (I, II, III...), and a way between areas may only open after a later step, which is what sends
// the party back through country it has already cleared, or out across the inland sea.
import type { MapDef, MapKind } from './map.ts';

/** What a site on the painted map is drawn as. `label` is a name with no icon. */
export type SiteIcon =
  | 'city' | 'hold' | 'farm' | 'cave' | 'tower' | 'barrow' | 'grove' | 'stone' | 'port' | 'hearth'
  | 'monastery' | 'mine' | 'forge' | 'fortress' | 'volcano' | 'sunken' | 'gate' | 'wreck' | 'rift'
  | 'ring' | 'lodge' | 'obelisk' | 'label';

/** How a link is travelled. */
export type LinkKind = 'road' | 'enter' | 'stairs' | 'sea' | 'deep';

/** An outdoor area: one map once built, a sketched part of the world until then. */
export interface AtlasRegion {
  id: string;
  name: string;
  /** Its step on the one road of levels: 1 is the start. */
  order: number;
  /** The outdoor map this area is, once it is built. */
  map?: string;
  /** Top-left corner on the world grid, in cells. */
  at: readonly [number, number];
  /** Width and height in cells; an area map is 32x32 unless it says otherwise. */
  size?: number;
  /** Level band while planned; a built area reads its map's. */
  band?: readonly [number, number];
  /** The area's Wardstone, if it has one. */
  stone?: string;
  /** Where the area's name is lettered on the art, world cells (the centre of the text). */
  label: readonly [number, number];
  /** Grass colour inside the area, so neighbouring country reads apart; blended at the borders. */
  tint?: string;
  /** One line for the zone overlay: what the area is. */
  note?: string;
}

/** Something painted on the map: a town, a cave mouth, a Wardstone, a name. */
export interface AtlasSite {
  name: string;
  icon: SiteIcon;
  /** Region the position is relative to; absent means world cells. */
  region?: string;
  at: readonly [number, number];
  /** Where the name goes; 'none' leaves it unlabelled. */
  label?: 'above' | 'below' | 'left' | 'right' | 'none';
  /** Not in the game yet. Planned sites are still painted; the overlay treats them as such. */
  planned?: boolean;
}

/** A town, dungeon or Underdeep segment: a plate in the zone overlay. */
export interface AtlasZone {
  /** The map's id once built; a planned zone's own id otherwise. */
  id: string;
  /** Planned zones only; a built zone shows its map's name. */
  name?: string;
  kind: Exclude<MapKind, 'outdoor'> | 'deep';
  planned?: boolean;
  /** A step of its own on the road of levels (the Underdeep and the core are steps, not areas). */
  order?: number;
  band?: readonly [number, number];
  /** Centre of the plate, world cells. */
  at: readonly [number, number];
  note?: string;
}

/** A connection that no map's exits make yet. Built connections come from `MapDef.exits`. */
export interface AtlasLink {
  from: string;
  to: string;
  kind: LinkKind;
  /** The way opens once this step is done (a road cleared, a boat found); absent means open. */
  opens?: number;
  /** World cells where the arrow leaves `from` and meets `to`; a zone's plate is used when absent. */
  a?: readonly [number, number];
  b?: readonly [number, number];
  note?: string;
  /** Where the note and the step it opens after are lettered, world cells; beside the arrow when absent. */
  noteAt?: readonly [number, number];
}

export interface Atlas {
  /** World size in cells. */
  width: number;
  height: number;
  /** World cells per sketch character, each way. */
  scale: number;
  /** The coarse world, one character per `scale` x `scale` cells; see SKETCH_TERRAIN. */
  sketch: readonly string[];
  regions: readonly AtlasRegion[];
  sites: readonly AtlasSite[];
  zones: readonly AtlasZone[];
  links: readonly AtlasLink[];
  /** Roads through the planned areas, as world-cell polylines; built areas draw their own. */
  trails: readonly (readonly (readonly [number, number])[])[];
}

/** The terrain a world cell paints as. Map legend characters and the sketch's extras both land here. */
export type WorldTerrain =
  | 'void' | 'grass' | 'forest' | 'pine' | 'deadwood' | 'crystal' | 'hills' | 'heather' | 'mountain' | 'peak'
  | 'volcano' | 'marsh' | 'sand' | 'dunes' | 'glass' | 'shallow' | 'sea' | 'ice' | 'ash' | 'lava' | 'snow'
  | 'rock' | 'dirt' | 'road' | 'building';

/** Every character the sketch or a stamped outdoor map may use. */
export const SKETCH_TERRAIN: Record<string, WorldTerrain> = {
  '.': 'void', ',': 'grass', 'T': 'forest', 't': 'pine', 'd': 'deadwood', 'c': 'crystal', 'h': 'hills',
  'e': 'heather', 'M': 'mountain', 'A': 'peak', 'V': 'volcano', 'w': 'marsh', '_': 'sand', 'u': 'dunes',
  'g': 'glass', '~': 'shallow', 'W': 'sea', 'i': 'ice', 'a': 'ash', '!': 'lava', '*': 'snow', 'r': 'rock',
  ':': 'dirt', '"': 'rock', '=': 'road', 'B': 'building',
};

export interface WorldGrid {
  width: number;
  height: number;
  /** One terrain per cell, row-major. */
  cells: WorldTerrain[];
  /** 1 where the cell is a built map's own cell rather than the sketch's. */
  built: Uint8Array;
  at(x: number, y: number): WorldTerrain;
}

/** Top-left and size of a region, world cells. */
export function regionRect(r: AtlasRegion): { x: number; y: number; w: number; h: number } {
  const s = r.size ?? 32;
  return { x: r.at[0], y: r.at[1], w: s, h: s };
}

/**
 * The world as cells: the sketch scaled up, with each built region's map stamped over it. A map's
 * ring of edge mountains is only its closed border, so edge cells that are mountain keep the
 * sketch's terrain (the sea south of the Shelf, the ranges between areas); any other edge cell,
 * like the road through the pass, is the map's.
 */
export function worldGrid(atlas: Atlas, defs: readonly MapDef[]): WorldGrid {
  const { width, height, scale } = atlas;
  const cells: WorldTerrain[] = new Array(width * height);
  const built = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    const row = atlas.sketch[Math.floor(y / scale)] ?? '';
    for (let x = 0; x < width; x++) cells[y * width + x] = SKETCH_TERRAIN[row[Math.floor(x / scale)] ?? '.'] ?? 'void';
  }
  for (const r of atlas.regions) {
    const def = r.map ? defs.find((d) => d.id === r.map) : undefined;
    if (!def) continue;
    const mh = def.rows.length, mw = Math.max(...def.rows.map((s) => s.length));
    for (let my = 0; my < mh; my++) for (let mx = 0; mx < mw; mx++) {
      const ch = def.rows[my][mx] ?? 'M';
      const edge = mx === 0 || my === 0 || mx === mw - 1 || my === mh - 1;
      if (edge && ch === 'M') continue;
      const x = r.at[0] + mx, y = r.at[1] + my;
      if (x < 0 || y < 0 || x >= width || y >= height) continue;
      cells[y * width + x] = SKETCH_TERRAIN[ch] ?? 'grass';
      built[y * width + x] = 1;
    }
  }
  return { width, height, cells, built, at: (x, y) => (x < 0 || y < 0 || x >= width || y >= height ? 'void' : cells[y * width + x]) };
}

/** The region an outdoor map is, if the atlas places it. */
export function regionOfMap(atlas: Atlas, mapId: string): AtlasRegion | undefined {
  return atlas.regions.find((r) => r.map === mapId);
}

/** A map cell's centre on the world grid, for maps the atlas places as regions. */
export function worldPoint(atlas: Atlas, mapId: string, x: number, y: number): [number, number] | null {
  const r = regionOfMap(atlas, mapId);
  return r ? [r.at[0] + x + 0.5, r.at[1] + y + 0.5] : null;
}

/** One arrow of the zone overlay. */
export interface ZoneEdge {
  from: string;
  to: string;
  kind: LinkKind;
  planned: boolean;
  /** Travelled both ways (the maps have an exit each way). */
  both: boolean;
  /** Party flags the way waits on, from the exit's `needFlag`. */
  gate: string[];
  /** The step after which a planned way opens. */
  opens?: number;
  /** Ends on the world grid; absent means the zone's plate. */
  a?: readonly [number, number];
  b?: readonly [number, number];
  note?: string;
  noteAt?: readonly [number, number];
}

/**
 * The zone graph: every pair of built maps an exit joins, merged with its return exit, then the
 * atlas's planned links. Outdoor-to-outdoor exits run from the exit cell to the arrival cell; an
 * exit into a town or dungeon runs from its cell to that zone's plate; stairs join plates.
 */
export function zoneEdges(atlas: Atlas, defs: readonly MapDef[]): ZoneEdge[] {
  const kindOf = new Map(defs.map((d) => [d.id, d.kind]));
  const edges: ZoneEdge[] = [];
  for (const d of defs) for (const e of d.exits ?? []) {
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
  for (const l of atlas.links) {
    edges.push({ from: l.from, to: l.to, kind: l.kind, planned: true, both: l.kind === 'road' || l.kind === 'enter', gate: [], opens: l.opens, a: l.a, b: l.b, note: l.note, noteAt: l.noteAt });
  }
  return edges;
}

/** One step on the road of levels. */
export interface Step { order: number; id: string; name: string; band?: readonly [number, number]; built: boolean; }

/** The progression, first step first: every area, and every zone that is a step of its own. */
export function progression(atlas: Atlas, defs: readonly MapDef[]): Step[] {
  const steps: Step[] = [];
  for (const r of atlas.regions) {
    const def = r.map ? defs.find((d) => d.id === r.map) : undefined;
    steps.push({ order: r.order, id: r.id, name: r.name, band: def?.band ?? r.band, built: !!def });
  }
  for (const z of atlas.zones) if (z.order != null) steps.push({ order: z.order, id: z.id, name: z.name ?? z.id, band: z.band, built: !z.planned });
  return steps.sort((a, b) => a.order - b.order);
}

/**
 * Which areas and zones the party can reach once `done` steps are finished: a walk over every
 * built exit and every planned way already open, from the first area. Maps join the walk through
 * the areas that hold them.
 */
export function reachable(atlas: Atlas, defs: readonly MapDef[], done: number): Set<string> {
  const edges = zoneEdges(atlas, defs);
  const alias = (id: string): string => atlas.regions.find((r) => r.map === id)?.id ?? id;
  const start = atlas.regions.reduce((a, b) => (a.order <= b.order ? a : b));
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
export function homeRegion(defs: readonly MapDef[], mapId: string): MapDef | undefined {
  const byId = new Map(defs.map((d) => [d.id, d]));
  const seen = new Set([mapId]);
  let frontier = [mapId];
  while (frontier.length) {
    const next: string[] = [];
    for (const id of frontier) for (const e of byId.get(id)?.exits ?? []) {
      if (seen.has(e.to)) continue;
      seen.add(e.to);
      const d = byId.get(e.to);
      if (d?.kind === 'outdoor') return d;
      next.push(e.to);
    }
    frontier = next;
  }
  return undefined;
}
