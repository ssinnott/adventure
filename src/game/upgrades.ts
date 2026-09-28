// Upgrades: what brings an old save up to date, each registered by the version it brings a save to,
// and run by version in deserialize (game/save.ts). An upgrade is a pure change to the saved data.
// It never reads today's content (maps, the atlas), which a later edit would change under it: what
// it needs of the world as it was then, it keeps here, frozen. Each one comes with a test of an old
// save loading (tools/tests/save.ts), and tools/tests/shipped.ts checks every version has one.
import type { WorldState, MapState } from './world.ts';
import type { Party } from './party.ts';

/** A save as it was written at some version: the shape SaveData had then. */
export interface OldSave { version: number; savedAt: number; rng: number; world: WorldState; party: Party }

export type Upgrade = (data: OldSave) => OldSave;

const see = (bits: number[], i: number): void => { bits[i >> 5] = (bits[i >> 5] ?? 0) | (1 << (i & 31)); };
const bitsFor = (cells: number): number[] => new Array(Math.ceil(cells / 32)).fill(0);

/** The outdoors at version 2, as it stood when version 1 saves were brought to it. */
const V2_OUTDOORS = { id: 'caldera', w: 512, h: 384 };
/** Where the zone maps of version 1 were laid into it, and their size. */
const V2_ZONES: Record<string, { x: number; y: number; w: number; h: number }> = {
  shelf: { x: 200, y: 30, w: 32, h: 32 },
  thornmark: { x: 232, y: 30, w: 32, h: 32 },
};

/**
 * 2: the outdoors is one map and exploration is kept in bits. A version 1 map kept a number for each
 * cell seen; it is packed into bits, index for index. What the Foreland and Thornmark kept apart
 * (what the party saw and used there, its groups, its doors, the party itself if it stood there) is
 * folded into the outdoors where the zone sits. A zone map with state of its own is one the party trod.
 */
function toV2(data: OldSave): OldSave {
  const s = data.world;
  s.zones ??= [];
  let out: MapState | undefined;
  for (const [id, old] of Object.entries(s.maps)) {
    const z = V2_ZONES[id];
    if (!z) {
      const bits = bitsFor(old.explored.length);
      old.explored.forEach((v, i) => { if (v) see(bits, i); });
      old.explored = bits;
      continue;
    }
    out ??= (s.maps[V2_OUTDOORS.id] ??= { explored: bitsFor(V2_OUTDOORS.w * V2_OUTDOORS.h), used: {}, groups: {}, doors: {} });
    old.explored.forEach((v, i) => { if (v) see(out!.explored, (z.y + Math.floor(i / z.w)) * V2_OUTDOORS.w + z.x + (i % z.w)); });
    Object.assign(out.used, old.used);
    for (const [g, st] of Object.entries(old.groups)) out.groups[g] = { ...st, x: st.x + z.x, y: st.y + z.y };
    for (const [k, d] of Object.entries(old.doors)) { const [x, y] = k.split(',').map(Number); out.doors[`${x + z.x},${y + z.y}`] = d; }
    if (!s.zones.includes(id)) s.zones.push(id);
    delete s.maps[id];
  }
  const z = V2_ZONES[s.mapId];
  if (z) { s.mapId = V2_OUTDOORS.id; s.x += z.x; s.y += z.y; }
  return data;
}

/** Each upgrade by the version it brings a save to. A bump of SAVE_VERSION adds one here. */
export const UPGRADES: Readonly<Record<number, Upgrade>> = { 2: toV2 };
