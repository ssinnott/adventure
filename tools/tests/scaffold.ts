// The scaffold (tools/scaffold.ts): the Downs' first zone map, as the tool writes it, cut at its
// atlas square and laid back into the atlas, is the atlas square for square. It pins that the Downs'
// hills, farmland, woods and road come through, not how many of each, so the owner may repaint the
// Downs.
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ATLAS, MAP_DEFS, AREAS } from '../../src/content/index.ts';
import { worldGrid, MAP_TERRAIN } from '../../src/game/atlas.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef } from '../../src/game/map.ts';
import { cut, emit, layBack, mismatches, baseline, CHAR_OF, SIZE } from '../scaffold.ts';
import type { Draft } from '../scaffold.ts';
import { ok } from './lib.ts';

/** The Downs' first zone map: the square west of the Foreland, on the grid the built maps sit on. */
const AT = [168, 30] as const;
const REGIONS = AREAS.map((a) => a.id);

/** The draft as the tool writes it: its module, written out and imported back. */
async function written(d: Draft, zone: string, x: number, y: number): Promise<MapDef> {
  const game = (f: string): string => fileURLToPath(new URL(`../../src/game/${f}`, import.meta.url));
  const dir = mkdtempSync(join(tmpdir(), 'scaffold-')), file = join(dir, 'draft.ts');
  try {
    writeFileSync(file, emit(d, zone, x, y, game('map.ts'), game('types.ts')));
    return Object.values(await import(pathToFileURL(file).href) as Record<string, MapDef>)[0];
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

export async function scaffold(): Promise<void> {
  ok(Object.entries(CHAR_OF).every(([t, ch]) => MAP_TERRAIN[ch!] === t), 'every character a draft writes is its terrain on the world map');
  const g0 = baseline(ATLAS, MAP_DEFS);
  const zone = ATLAS.zones.find((z) => z.id === 'downs')!;
  const d = cut(ATLAS, MAP_DEFS, g0, REGIONS, 'downs', AT[0], AT[1]);
  ok(!('refused' in d), `the Downs are cut at ${AT.join(',')}${'refused' in d ? ` (refused: ${d.refused})` : ''}`);
  if ('refused' in d) return;
  const def = await written(d, 'downs', AT[0], AT[1]);
  ok(def.rows.length === SIZE && def.rows.every((r) => r.length === SIZE), `the draft as written is ${SIZE} by ${SIZE}`);
  const band = zone.band ?? ATLAS.areas.find((a) => a.id === zone.area)?.band;
  ok(def.id === zone.id && def.name === zone.name && def.kind === 'outdoor' && def.band?.join('-') === band?.join('-') && def.region === undefined, `it takes the zone's id, name and band, and the Foreland's sky (${def.name}, ${def.band?.join('-')})`);
  const has = (t: 'hills' | 'farm' | 'forest' | 'road'): boolean => (d.counts[t] ?? 0) > 0;
  ok(has('hills') && has('farm') && has('forest') && has('road'), `its hills, farmland, woods and road come through (${['hills', 'farm', 'forest', 'road'].map((t) => `${t} ${d.counts[t as 'hills'] ?? 0}`).join(', ')})`);

  // Laid back where it was cut, the atlas is unchanged under it, square for square.
  const back = (draft: MapDef): number => {
    const l = layBack(ATLAS, MAP_DEFS, draft, zone, AT);
    return mismatches(g0, worldGrid(l.atlas, l.defs), AT[0], AT[1]);
  };
  const miss = back(def);
  ok(miss === 0, `laid back into the atlas, it matches it square for square (${SIZE * SIZE - miss} of ${SIZE * SIZE})`);
  // The comparison can fail: the same draft with its farmland, hills and road written as grass.
  const grass = (chars: string): MapDef => ({ ...def, rows: def.rows.map((r) => r.replace(new RegExp(`[${chars}]`, 'g'), ',')) });
  const flat = back(grass('f^')), unroaded = back(grass('='));
  ok(flat === (d.counts.farm ?? 0) + (d.counts.hills ?? 0), `and with its farmland and hills written as grass it does not (${flat} squares differ)`);
  ok(unroaded === (d.counts.road ?? 0), `nor with its road written as grass (${unroaded} squares differ)`);

  // It plays: the start is open ground and every open square is reached from it.
  const m = new GameMap(def);
  ok(m.passable(def.start.x, def.start.y) === 'ok', `its start ${def.start.x},${def.start.y} is open ground`);
  const seen = new Set<number>([def.start.y * SIZE + def.start.x]), q = [...seen];
  for (let k = 0; k < q.length; k++) {
    const x = q[k] % SIZE, y = (q[k] - x) / SIZE;
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      const n = ny * SIZE + nx;
      if (nx >= 0 && ny >= 0 && nx < SIZE && ny < SIZE && !seen.has(n) && m.passable(nx, ny) === 'ok') { seen.add(n); q.push(n); }
    }
  }
  let open = 0;
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) if (m.passable(x, y) === 'ok') open++;
  ok(seen.size === open, `every open square is reached from it (${seen.size} of ${open})`);
  ok(!def.encounters?.length && !def.exits?.length && !def.features?.length, 'it holds no groups, exits or features: those are the author\'s');

  // It refuses what it cannot cut faithfully, and says why.
  const refused = (zone: string, x: number, y: number, why: RegExp, id?: string): boolean => { const r = cut(ATLAS, MAP_DEFS, g0, REGIONS, zone, x, y, id); return 'refused' in r && why.test(r.refused); };
  ok(refused('downs', AT[0] + 1, AT[1], /lies over shelf/), 'it refuses a cut over a laid zone map, ring and all');
  ok(refused('downs', ATLAS.width - SIZE + 1, AT[1], /outside the world/), 'and one outside the world');
  ok(refused('nowhere', AT[0], AT[1], /no zone/), 'and a zone the atlas has not');
  ok(refused('downs', 88, 46, /cliff \d+/), 'and ground no map character is, counting its squares (Kestrel Edge\'s cliffs at 88,46)');
  ok(refused('downs', AT[0], AT[1], /built already/, 'shelf') && refused('downs', AT[0], AT[1], /no map id/, 'Downs-2'), 'and an id a built map has, or no map id could be');

  // A zone of another built area shares that area's sky.
  const deep = ATLAS.zones.find((z) => z.id === 'deepthorn')!, dd = cut(ATLAS, MAP_DEFS, g0, REGIONS, deep.id, 232, 94);
  const region = 'refused' in dd ? undefined : (await written(dd, deep.id, 232, 94)).region;
  ok(region === deep.area, `a draft of ${deep.name} is written in ${deep.area}'s region (${region})`);
}
