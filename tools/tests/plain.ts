// Plain views (#1108): no outdoor map may show one ground and nothing drawn on it in more than
// `PLAIN_CAP` of its views (tools/kit/rules/plain.ts, which says what a view and a plain one are), as
// density holds how far a party walks to something (EXPANSION §5.3). A map over the cap is owed by its
// area to the issue that breaks it up (`Owes.plain`) or fails, and an owed map within the cap fails too:
// the rows only shrink. The maps as written, as density reads them.
// Then the rule on fields built here, so no edit to the maps can turn one red: each thing the view draws
// standing in a window, a second ground and a second look of one make it not plain, and what the view
// does not draw, or draws moving, leaves it plain.
import { AREAS } from '../../src/content/index.ts';
import { GameMap, passableCell } from '../../src/game/map.ts';
import type { Feature, MapDef, Terrain } from '../../src/game/mapdef.ts';
import { NORTH } from '../../src/game/types.ts';
import { GROUND, variantAt } from '../../src/ui/view/ground/index.ts';
import { scatterAt } from '../../src/ui/view/scatter.ts';
import { ok, owed } from './lib.ts';
import { CHECKS, areaRows, gather, once } from '../kit/checks.ts';
import { PLAIN_CAP, plainShare, viewsOf, judge } from '../kit/rules/plain.ts';

const owing = gather(areaRows((c) => c.owes?.plain));

export function plain(): void {
  const cap = `${100 * PLAIN_CAP}%`, home = new Map<string, string>();
  for (const a of AREAS) for (const def of a.maps.filter((d) => d.kind === 'outdoor')) {
    home.set(def.id, a.id);
    const { why, line } = judge(def), whose = owing.all[def.id];
    if (whose !== undefined) owed(!why, `${a.id}/${line}, within ${cap}`, whose);
    else ok(!why, `${a.id}/${line}${why ? ': ' + why : `, within ${cap}`}`);
  }
  const astray = [...CHECKS].flatMap(([id, c]) => Object.keys(c.owes?.plain ?? {}).filter((m) => home.get(m) !== id).map((m) => `${id} owes ${m}`));
  ok(!astray.length, `every map owed its plain views is an outdoor map of the area that owes it${astray.length ? ' -> ' + astray.join(', ') : ''}`);
  ok(...once('every map owed its plain views is owed once', owing.twice));

  // The grounds the fields are made of, found by what their looks have of their own, so that a look given
  // more does not turn a fixture red: one with nothing (salt, as the looks stand), one that only scatter
  // varies, one that only its variants vary and one that only stands trees at its sides.
  const own = (t: Terrain): string => { const g = GROUND[t]; return ['scatter', 'variants', 'plot', 'sides', 'mound'].filter((k) => g[k as keyof typeof g]).join(); };
  const only = (what: string, first: Terrain[] = []): Terrain | undefined => [...first, ...Object.keys(GROUND) as Terrain[]]
    .find((t) => t !== 'floor' && own(t) === what && passableCell({ terrain: t, solid: 'none', door: 'none' }) === 'ok');
  const bare = only('', ['salt']), strewn = only('scatter'), patched = only('variants'), wooded = only('sides');
  ok(!!(bare && strewn && patched && wooded), `there are grounds to build the fixtures of: bare ${bare}, strewn ${strewn}, patched ${patched}, wooded ${wooded}`);
  if (!(bare && strewn && patched && wooded)) return;

  // A field 7 squares by 5 has two views, one up it from the middle of its south edge and one down it
  // from its north edge's, each seeing the whole field.
  const legend = { g: { terrain: bare }, R: { terrain: bare, solid: 'rock' as const }, O: { terrain: bare, door: 'door' as const }, e: { terrain: strewn }, n: { terrain: patched }, k: { terrain: wooded } };
  const field = (rows: string[], o: Partial<MapDef> = {}): MapDef =>
    ({ id: 'fx_plain', name: 'Plain', kind: 'outdoor', density: 'country', start: { x: 3, y: rows.length - 1, facing: NORTH }, rows, legend, ...o });
  const rows = (mid = 'g', all = 'g'): string[] => [0, 1, 2, 3, 4].map((y) => (y === 2 ? `${all.repeat(3)}${mid}${all.repeat(3)}` : all.repeat(7)));
  const seen = (d: MapDef): string => { const r = plainShare(d); return `${r.plain} of ${r.views}`; };
  ok(seen(field(rows())) === '2 of 2', `a field of ${bare} 7 squares by 5 has two views, and both are plain (${seen(field(rows()))})`);
  const narrow = seen(field(rows().map((r) => r.slice(1)))), short = seen(field(rows().slice(1)));
  ok(narrow === '0 of 0' && short === '0 of 0', `a square narrower or shorter, it has none: a window not wholly inside its map is no view (${narrow}, ${short})`);

  // In the middle of the field: what stands, a second ground and a feature the view draws each make both views not plain.
  const at = (f: Feature): Feature => ({ ...f, x: 3, y: 2 });
  const cairn = at({ kind: 'cairn', x: 0, y: 0, id: 'fx_cairn', gold: 1, items: [] });
  const marred: [string, MapDef][] = [
    ['a rock', field(rows('R'))], ['a door', field(rows('O'))], ['a pool', field(rows('~'))], [`a square of ${patched}`, field(rows('n'))],
    ['a cairn', field(rows(), { features: [cairn] })],
  ];
  for (const [what, d] of marred) ok(seen(d) === '0 of 2', `${what} in the middle makes it not plain (${seen(d)})`);
  // A ground that stands trees at its sides is never plain, nor farmland: its fields, three squares by two, are each a crop, hedged round.
  const woods = seen(field(rows('k', 'k'))), farmland = seen(field(rows('f', 'f')));
  ok(woods === '0 of 2' && farmland === '0 of 2', `a field of ${wooded}, trees at each square's sides, is not plain, nor a field of farmland, its fields each a crop (${woods}, ${farmland})`);
  // What the view does not draw, or draws moving, leaves it plain: an event, a person and a group; and a hill's mound is its ground's.
  const kept: [string, MapDef][] = [
    ['an event', field(rows(), { features: [at({ kind: 'event', x: 0, y: 0, id: 'fx_event', text: 'A stone.' })] })],
    ['a person', field(rows(), { features: [at({ kind: 'npc', x: 0, y: 0, name: 'Hob', lines: ['Well met.'] })] })],
    ['a group', field(rows(), { encounters: [{ id: 'fx_band', x: 3, y: 2, monsters: ['wolf'] }] })],
  ];
  for (const [what, d] of kept) ok(seen(d) === '2 of 2', `${what} in the middle leaves it plain (${seen(d)})`);
  const hills = seen(field(rows('^', '^')));
  ok(hills === '2 of 2', `a field of hills is plain, each square's mound its ground's look and its marks not counted (${hills})`);

  // Up a strip of the ground only scatter varies, and of the one only its variants vary: each view north
  // is plain exactly where nothing stands in its window, or one look fills it, and there are both.
  const strip = (t: string): GameMap => new GameMap(field(Array<string>(96).fill(t.repeat(7))));
  const up = (m: GameMap, mark: (x: number, y: number) => string): string => {
    const views = viewsOf(m).filter((v) => v.f === NORTH);
    const marks = views.map((v) => new Set([0, 1, 2, 3, 4].flatMap((d) => [0, 1, 2, 3, 4, 5, 6].map((x) => mark(x, v.y - d)))));
    const wrong = views.filter((v, i) => v.plain !== (marks[i].size === 1 && !marks[i].has('prop'))).length, plain = views.filter((v) => v.plain).length;
    return wrong || !plain || plain === views.length ? `wrong: ${wrong} of ${views.length}, ${plain} plain` : `${plain} of ${views.length} plain`;
  };
  const props = strip('e'), looks = strip('n');
  const byProps = up(props, (x, y) => (scatterAt(props, x, y) ? 'prop' : '')), byLooks = up(looks, (x, y) => variantAt(patched, x, y, looks)?.name ?? '');
  ok(!byProps.startsWith('wrong'), `up a strip of ${strewn}, the views with a prop in them are not plain and the rest are (${byProps})`);
  ok(!byLooks.startsWith('wrong'), `up a strip of ${patched}, the views of two of its looks are not plain and of one are (${byLooks})`);

  // The cap: a field all plain is over it, and the same with a cairn in it is within it.
  const over = judge(field(rows())).why, within = judge(field(rows(), { features: [cairn] })).why;
  ok(over !== '' && within === '', `a field all plain is over the cap and with a cairn in it within (${over || 'within'}; ${within || 'within'})`);
}
