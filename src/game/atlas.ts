// The world map's model: Caldera as one continuous land, the way it will be walked once the
// outdoors is a single map. The atlas content draws the land the way a cartographer would, in
// strokes: the rim, the coasts, ranges of mountains, rivers running from the rim to the sea, woods,
// fens and fields, roads. worldGrid turns that into cells, one per square the party walks, and
// stamps every built outdoor map into it 1:1 where it sits, so the painted map shows the real
// Foreland and the real Thornmark. Every built outdoor map is one box of a grid, lettered A1, B2...
// from the atlas's corner, and a zone lists its maps, one box or several.
// This file gathers its four parts in game/atlas/, the schema, the terrain and strokes, the grid
// and the ways, and every name is had from here.
//
// The land is divided two ways. Areas are the steps of the one road of levels (I, II, III...), each
// with its level band, and every area is made of zones, the named country inside it. Which zone a
// cell belongs to is found by walking out from the zones' seeds over the land, where climbing a
// range or crossing a river costs dearly, so borders fall along ridges, rivers and coasts instead of
// straight lines. Ways between areas come from the built maps' exits and the atlas's planned links;
// a planned way may open only after a later step, which is what sends the party back through
// country it has already cleared, or out across the inland sea. Pure: nothing here draws.
export type { Pt, SiteIcon, LinkKind, ZoneMap, AtlasZone, Crossing, AtlasPlace, AtlasSite, AtlasLink, SeaMark, Atlas } from './atlas/schema.ts';
export { TERRAINS, TI, MAP_TERRAIN, isWater, lattice, noise, fbm, spline } from './atlas/painter.ts';
export type { WorldTerrain } from './atlas/painter.ts';
export { worldGrid, gridCuts, boxAt, box, laid, gridFaults } from './atlas/grid.ts';
export type { WorldGrid } from './atlas/grid.ts';
export { zoneOfMap, mapAt, areaOf, mapPlace, worldPoint, areaBand, roadPlace, zoneEdges, progression, reachable, homeMap } from './atlas/ways.ts';
export type { ZoneEdge } from './atlas/ways.ts';
