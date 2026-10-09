// The scaffold (tools/scaffold.ts): the Downs' first zone map, as the tool writes it, cut at its
// atlas square and laid back into the atlas, is the atlas square for square. It pins that the Downs'
// hills, farmland, forest and road come through, not how many of each, so the owner may repaint the
// Downs. Then the Deepthorn's first box, for the light woods no map could hold before #210.
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ATLAS, MAP_DEFS, AREAS } from '../../src/content/index.ts';
import { worldGrid, MAP_TERRAIN } from '../../src/game/atlas.ts';
import type { Atlas } from '../../src/game/atlas.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef } from '../../src/game/map.ts';
import { cut, emit, layBack, mismatches, baseline, CHAR_OF, SIZE } from '../scaffold.ts';
import type { Draft } from '../scaffold.ts';
import { ok } from './lib.ts';

/** The Downs' first zone map: the square west of the Foreland, on the grid the built maps sit on. */
const AT = [168, 30] as const;
const REGIONS = AREAS.map((a) => a.id);
/** The Deepthorn's first box, H3, where the atlas lays its light woods along the Wyke. */
const WOODS_AT = [232, 62] as const;
/** The Deepthorn's J4, over the ridge in the Eaves' land, with 30 squares of the atlas's dead wood. */
const DEAD_AT = [296, 94] as const;
/** K3, the Sunder's gorge, with its chasm and the glass trees at its lip. */
const SUNDER_AT = [328, 62] as const;
/** C6, Saltmouth's box, with salt at the pans' head and tidal ground along the Saltings' shore. */
const SALT_AT = [72, 158] as const;
/** F6, Wrackholm's moor, with its heather. */
const MOOR_AT = [168, 158] as const;
/** O6, the Kilns' heart under the vent ridge, with its ash. */
const ASH_AT = [456, 158] as const;
/** M3, the Iron Fells' way in, with its pines. */
const PINE_AT = [392, 62] as const;
/** N10, Glacier Foot under the glacier, with the atlas's ice: the lochs are water on it, and a box draws them frozen. */
const ICE_AT = [424, 286] as const;
/** J11, Monks' Vale, with the peaks on its crest; and I11 over it, the Peak Stone's box, with peaks and cliffs (#543). */
const PEAK_AT = [296, 318] as const;
const CLIFF_AT = [264, 318] as const;
/** H10, the Stair's foot, with the shore's vines; D9, the steppe, with the dunes' first edge; and G11, Fire Mountain's flank, with its lava (#543). */
const VINES_AT = [232, 286] as const;
const STEPPE_AT = [104, 254] as const;
const LAVA_AT = [200, 318] as const;

/** The draft as the tool writes it: its module, written out and imported back, by export name. */
async function exported(d: Draft, zone: string, x: number, y: number): Promise<Record<string, MapDef>> {
  const game = (f: string): string => fileURLToPath(new URL(`../../src/game/${f}`, import.meta.url));
  const dir = mkdtempSync(join(tmpdir(), 'scaffold-')), file = join(dir, 'draft.ts');
  try {
    writeFileSync(file, emit(d, zone, x, y, game('map.ts'), game('types.ts')));
    return await import(pathToFileURL(file).href) as Record<string, MapDef>;
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
const written = async (d: Draft, zone: string, x: number, y: number): Promise<MapDef> => Object.values(await exported(d, zone, x, y))[0];

/**
 * The world with no zone map laid over the square at x,y: once the area builds the Downs there, the
 * scaffold is still proven against the paint beneath.
 */
function unbuilt(x: number, y: number): { atlas: Atlas; defs: readonly MapDef[] } {
  const over = new Set<string>();
  for (const z of ATLAS.zones) for (const { map, at } of z.maps ?? []) {
    const def = MAP_DEFS.find((m) => m.id === map);
    if (def && at[0] < x + SIZE && x < at[0] + def.rows[0].length && at[1] < y + SIZE && y < at[1] + def.rows.length) over.add(def.id);
  }
  return {
    atlas: { ...ATLAS, zones: ATLAS.zones.map((z) => ({ ...z, maps: z.maps?.filter((m) => !over.has(m.map)) })) },
    defs: MAP_DEFS.filter((m) => !over.has(m.id)),
  };
}

export async function scaffold(): Promise<void> {
  ok(Object.entries(CHAR_OF).every(([t, ch]) => MAP_TERRAIN[ch!] === t), 'every character a draft writes is its terrain on the world map');
  const { atlas, defs } = unbuilt(AT[0], AT[1]);
  const g0 = baseline(atlas, defs);
  const zone = atlas.zones.find((z) => z.id === 'downs')!;
  const d = cut(atlas, defs, g0, REGIONS, 'downs', AT[0], AT[1]);
  ok(!('refused' in d), `the Downs are cut at ${AT.join(',')}${'refused' in d ? ` (refused: ${d.refused})` : ''}`);
  if ('refused' in d) return;
  const def = await written(d, 'downs', AT[0], AT[1]);
  ok(def.rows.length === SIZE && def.rows.every((r) => r.length === SIZE), `the draft as written is ${SIZE} by ${SIZE}`);
  const band = zone.band ?? atlas.areas.find((a) => a.id === zone.area)?.band;
  ok(def.id === zone.id && def.name === zone.name && def.kind === 'outdoor' && def.density === 'country' && def.band?.join('-') === band?.join('-') && def.region === undefined, `it takes the zone's id, name and band, the Foreland's sky, and is country (${def.name}, ${def.band?.join('-')}, ${def.density})`);
  const has = (t: 'hills' | 'farm' | 'forest' | 'road'): boolean => (d.counts[t] ?? 0) > 0;
  ok(has('hills') && has('farm') && has('forest') && has('road'), `its hills, farmland, forest and road come through (${['hills', 'farm', 'forest', 'road'].map((t) => `${t} ${d.counts[t as 'hills'] ?? 0}`).join(', ')})`);

  // Laid back where it was cut, the atlas is unchanged under it, square for square.
  const back = (draft: MapDef): number => {
    const l = layBack(atlas, defs, draft, zone, AT);
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
  const refused = (zone: string, x: number, y: number, why: RegExp, id?: string): boolean => { const r = cut(atlas, defs, g0, REGIONS, zone, x, y, id); return 'refused' in r && why.test(r.refused); };
  ok(refused('downs', AT[0] + 1, AT[1], /lies over shelf/), 'it refuses a cut over a laid zone map, ring and all');
  ok(refused('downs', ATLAS.width - SIZE + 1, AT[1], /outside the world/), 'and one outside the world');
  ok(refused('nowhere', AT[0], AT[1], /no zone/), 'and a zone the atlas has not');
  ok(refused('downs', 72, 262, /glass \d+/), 'and ground no map character is, counting its squares (the Glass\'s glass at 72,262)');
  ok(refused('downs', AT[0], AT[1], /built already/, 'shelf') && refused('downs', AT[0], AT[1], /no map id/, 'Downs-2'), 'and an id a built map has, or no map id could be');

  // --id names the map and its export.
  const named = cut(atlas, defs, g0, REGIONS, 'downs', AT[0], AT[1], 'callow_f2');
  const mod = 'refused' in named ? {} : await exported(named, 'downs', AT[0], AT[1]);
  ok(Object.keys(mod).join() === 'CALLOW_F2' && mod.CALLOW_F2?.id === 'callow_f2', `a draft cut with the id callow_f2 is written as it, exported as CALLOW_F2 (${Object.keys(mod).join()})`);

  // A zone of another area with a region of its own shares that area's sky; one with none yet shares
  // the Foreland's, and the header says so. The rule, not today's paint: the Downs moved to Thornmark.
  const moved: Atlas = { ...atlas, zones: atlas.zones.map((z) => (z.id === 'downs' ? { ...z, area: 'thornmark' } : z)) };
  const sky = async (regions: readonly string[]): Promise<{ region?: string; told: boolean }> => {
    const r = cut(moved, defs, g0, regions, 'downs', AT[0], AT[1]);
    return 'refused' in r ? { told: false } : { region: (await written(r, 'downs', AT[0], AT[1])).region, told: /has no region yet/.test(emit(r, 'downs', AT[0], AT[1], 'map.ts', 'types.ts')) };
  };
  const own = await sky(REGIONS), none = await sky(['shelf']);
  ok(own.region === 'thornmark' && !own.told, `a Thornmark zone's draft is written in Thornmark's region (${own.region})`);
  ok(none.region === undefined && none.told, `and before Thornmark has a region, in none, and its header says so (${none.region})`);

  // A woods box: the Deepthorn's first, H3, cut where the atlas lays its light woods along the Wyke
  // and laid back as the atlas, and not with its woods written as grass (#210).
  const [wx, wy] = WOODS_AT, wood = unbuilt(wx, wy), wg = baseline(wood.atlas, wood.defs);
  const wd = cut(wood.atlas, wood.defs, wg, REGIONS, 'deepthorn', wx, wy);
  ok(!('refused' in wd) && (wd.counts.woods ?? 0) > 0, `the Deepthorn is cut at ${wx},${wy}, its woods coming through (${'refused' in wd ? `refused: ${wd.refused}` : `woods ${wd.counts.woods ?? 0}`})`);
  if ('refused' in wd) return;
  const wdef = await written(wd, 'deepthorn', wx, wy), wzone = wood.atlas.zones.find((z) => z.id === 'deepthorn')!;
  const wback = (draft: MapDef): number => { const l = layBack(wood.atlas, wood.defs, draft, wzone, WOODS_AT); return mismatches(wg, worldGrid(l.atlas, l.defs), wx, wy); };
  ok(wback(wdef) === 0, `laid back, its woods and all match the atlas square for square`);
  const thinned = wback({ ...wdef, rows: wdef.rows.map((r) => r.replace(/t/g, ',')) });
  ok(thinned === wd.counts.woods, `and with its woods written as grass it does not (${thinned} squares differ, ${wd.counts.woods} of them woods)`);
  const wm = new GameMap(wdef), at = wdef.rows.flatMap((r, y) => [...r].flatMap((c, x) => (c === 't' ? [[x, y]] : [])))[0];
  ok(!!at && wm.at(at[0], at[1]).terrain === 'woods' && wm.passable(at[0], at[1]) === 'ok' && !wm.blocksView(at[0], at[1]), 'its woods are walked through and seen past');

  // A dead-wood box: the Deepthorn's J4, refused until dead wood had a character (#163), cut and
  // laid back as the atlas, its dead wood and all.
  const [dx, dy] = DEAD_AT, dead = unbuilt(dx, dy), dgr = baseline(dead.atlas, dead.defs);
  const dd = cut(dead.atlas, dead.defs, dgr, REGIONS, 'deepthorn', dx, dy);
  ok(!('refused' in dd) && (dd.counts.deadwood ?? 0) > 0, `the Deepthorn's J4 is cut at ${dx},${dy}, its dead wood coming through (${'refused' in dd ? `refused: ${dd.refused}` : `dead wood ${dd.counts.deadwood ?? 0}`})`);
  if ('refused' in dd) return;
  const ddef = await written(dd, 'deepthorn', dx, dy), dzone = dead.atlas.zones.find((z) => z.id === 'deepthorn')!;
  const dback = (draft: MapDef): number => { const l = layBack(dead.atlas, dead.defs, draft, dzone, DEAD_AT); return mismatches(dgr, worldGrid(l.atlas, l.defs), dx, dy); };
  ok(dback(ddef) === 0, 'laid back, its dead wood and all match the atlas square for square');
  const forested = dback({ ...ddef, rows: ddef.rows.map((r) => r.replace(/d/g, 'T')) });
  ok(forested === dd.counts.deadwood, `and with its dead wood painted over as forest it does not (${forested} squares differ, ${dd.counts.deadwood} of them dead wood)`);

  // The Sunder: K3's chasm and crystal, which no map character was until #163, cut and laid back.
  const [sx, sy] = SUNDER_AT, sunder = unbuilt(sx, sy), sg = baseline(sunder.atlas, sunder.defs);
  const sdr = cut(sunder.atlas, sunder.defs, sg, REGIONS, 'eaves', sx, sy);
  ok(!('refused' in sdr) && (sdr.counts.chasm ?? 0) > 0 && (sdr.counts.crystal ?? 0) > 0, `the Sunder is cut at ${sx},${sy}, its chasm and crystal coming through (${'refused' in sdr ? `refused: ${sdr.refused}` : `chasm ${sdr.counts.chasm ?? 0}, crystal ${sdr.counts.crystal ?? 0}`})`);
  if ('refused' in sdr) return;
  const sdef = await written(sdr, 'eaves', sx, sy), szone = sunder.atlas.zones.find((z) => z.id === 'eaves')!;
  const sback = (draft: MapDef): number => { const l = layBack(sunder.atlas, sunder.defs, draft, szone, SUNDER_AT); return mismatches(sg, worldGrid(l.atlas, l.defs), sx, sy); };
  ok(sback(sdef) === 0, 'laid back, its chasm and crystal match the atlas square for square');
  const filled = sback({ ...sdef, rows: sdef.rows.map((r) => r.replace(/[cv]/g, 'r')) });
  ok(filled === (sdr.counts.chasm ?? 0) + (sdr.counts.crystal ?? 0), `and with them written as rock it does not (${filled} squares differ)`);

  // The Saltings and Wrackholm: salt, tidal ground and heather, which no map character was until
  // #162, cut and laid back; written as sand, shallows and grass, they are not the atlas. The same
  // for the Kilns' ash and pine and Glacier Foot's ice (#536), written as dirt, forest and shallows,
  // and the Whitespine's peaks and cliffs (#543), written as snow and rock; the shore's vines, the
  // Wold's steppe and dunes and Fire Mountain's lava (#543), written as woods, grass, sand and ash.
  for (const [zoneId, [bx, by], kinds, plain] of [
    ['saltings', SALT_AT, ['salt', 'tidal'], { '-': '_', ';': '~' }], ['wrackholm', MOOR_AT, ['heather'], { h: ',' }],
    ['kilnsheart', ASH_AT, ['ash'], { a: ':' }], ['ironfells', PINE_AT, ['pine'], { p: 'T' }], ['glacierfoot', ICE_AT, ['ice'], { i: '~' }],
    ['monksvale', PEAK_AT, ['peak'], { A: '*' }], ['highspine', CLIFF_AT, ['peak', 'cliff'], { A: '*', '|': 'r' }],
    ['cindercoast', VINES_AT, ['vines'], { '&': 't' }], ['wold', STEPPE_AT, ['steppe', 'dunes'], { s: ',', u: '_' }], ['firemount', LAVA_AT, ['lava'], { '!': 'a' }],
  ] as const) {
    const world = unbuilt(bx, by), gr = baseline(world.atlas, world.defs);
    const dr = cut(world.atlas, world.defs, gr, REGIONS, zoneId, bx, by);
    const has = 'refused' in dr ? '' : kinds.map((k) => `${k} ${dr.counts[k] ?? 0}`).join(', ');
    ok(!('refused' in dr) && kinds.every((k) => (dr.counts[k] ?? 0) > 0), `${zoneId} is cut at ${bx},${by}, its ${kinds.join(' and ')} coming through (${'refused' in dr ? `refused: ${dr.refused}` : has})`);
    if ('refused' in dr) return;
    const def = await written(dr, zoneId, bx, by), z = world.atlas.zones.find((q) => q.id === zoneId)!;
    const back = (draft: MapDef): number => { const l = layBack(world.atlas, world.defs, draft, z, [bx, by]); return mismatches(gr, worldGrid(l.atlas, l.defs), bx, by); };
    ok(back(def) === 0, `laid back, its ${kinds.join(' and ')} and all match the atlas square for square`);
    const swapped: Record<string, string> = plain;
    const flat = back({ ...def, rows: def.rows.map((r) => [...r].map((c) => swapped[c] ?? c).join('')) });
    const n = kinds.reduce((t, k) => t + (dr.counts[k] ?? 0), 0);
    ok(flat === n, `and with them written as ${Object.values(swapped).join(' and ')} it does not (${flat} squares differ, ${n} of them)`);
  }
}
