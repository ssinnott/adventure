// The tools' command lines (tools/kit/args.ts, #986): each line of the four tools that take it, in the
// form their usage lines give, reads as the tool read it before, by its own reading kept here as the
// witness; and each refusal is named: an unknown flag, a flag twice, a flag with no value and a second
// output path, the sheet's word for word as it had them.
import { parse, SHEET, GALLERY, INTERIORS, WORLDMAP, type Spec } from '../kit/args.ts';
import { ok } from './lib.ts';

type Read = Record<string, string | boolean | undefined>;
const opt = (args: readonly string[], name: string): string | undefined => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : undefined; };

/** Each tool's reading before #986, with the output path it wrote when given none. */
const BEFORE: { name: string; spec: Spec; out?: string; before: (args: readonly string[]) => Read; lines: string[] }[] = [
  {
    name: 'sheet', spec: SHEET,
    before: (args) => {
      const FLAGS = ['area', 'maps', 'monsters', 'interiors', 'rifts', 'ground', 'changed'], opts: Record<string, string> = {};
      let out: string | undefined;
      for (let i = 0; i < args.length; i++) {
        const a = args[i];
        if (a.startsWith('--')) { opts[a.slice(2)] = args[i + 1]; i++; } else out ??= a;
      }
      return { out, ...Object.fromEntries(FLAGS.map((f) => [f, opts[f]])) };
    },
    lines: ['out.png --area thornmark', 'out.png --maps thornhold,grove1 --monsters tm_ogre --interiors green_man', 'out.png --changed origin/main',
      'out.png --rifts all', 'out.png --rifts ring,spiral', 'out.png --ground ash,ice', '--area thornmark out.png'],
  },
  {
    name: 'gallery', spec: GALLERY, out: 'gallery.png',
    before: (args) => ({ out: args.find((a) => !a.startsWith('--')) ?? 'gallery.png', only: opt(args, 'only'), family: opt(args, 'family'), scale: opt(args, 'scale'),
      frames: opt(args, 'frames'), flash: args.includes('--flash'), tone: opt(args, 'tone') }),
    lines: ['', 'out.png', 'out.png --only wolf,dire_wolf', 'out.png --family wolf', 'out.png --scale 3 --frames 6 --flash', 'out.png --flash --tone 0.6',
      'out.png --family wolf --frames 4 --flash', '--flash out.png'],
  },
  {
    name: 'interiors', spec: INTERIORS, out: 'interiors.png',
    before: (args) => ({ out: args.find((a) => !a.startsWith('--') && !/^\d/.test(a)) ?? 'interiors.png', only: opt(args, 'only'), scale: opt(args, 'scale'),
      hour: opt(args, 'hour'), frame: opt(args, 'frame') }),
    lines: ['', 'out.png', 'out.png --only hearthlight_inn,gilded_eel', 'out.png --scale 2 --hour 21 --frame 40', '--scale 2 out.png'],
  },
  {
    name: 'worldmap', spec: WORLDMAP, out: 'worldmap.png',
    before: (args) => ({ out: args.find((a, i) => !a.startsWith('--') && !(i > 0 && ['--scale', '--at'].includes(args[i - 1]))) ?? 'worldmap.png',
      zones: args.includes('--zones'), scale: opt(args, 'scale'), at: opt(args, 'at') }),
    lines: ['', 'out.png', 'out.png --zones', 'out.png --scale 2 --at shelf,16,9,2', '--zones out.png', '--at shelf,16,9,2 out.png --zones'],
  },
];

const words = (line: string): string[] => line.split(' ').filter(Boolean);

export function args(): void {
  for (const t of BEFORE) {
    const flags = Object.keys(t.spec.flags);
    for (const line of t.lines) {
      const r = parse(t.spec, words(line));
      if ('refused' in r) { ok(false, `${t.name}.ts ${line}: read as before, not refused (${r.refused.split('\n')[0]})`); continue; }
      const now: Read = { out: r.out ?? t.out, ...Object.fromEntries(flags.map((f) => [f, t.spec.flags[f] === 'switch' ? r.switches.has(f) : r.opts[f]])) };
      const was = t.before(words(line));
      ok(JSON.stringify(now) === JSON.stringify(was), `${t.name}.ts ${line || '(nothing)'}: read as before (${JSON.stringify(now)}${JSON.stringify(now) === JSON.stringify(was) ? '' : `, before ${JSON.stringify(was)}`})`);
    }
    const value = flags.find((f) => t.spec.flags[f] === 'value')!, other = flags.find((f) => f !== value)!;
    const refusals: [string, string[], string][] = [
      ['an unknown flag', ['out.png', '--famly', 'wolf'], 'unknown flag --famly'],
      ['a flag twice', ['out.png', `--${value}`, 'a', `--${value}`, 'b'], `--${value} given twice`],
      ['a flag with no value, at the end', ['out.png', `--${value}`], `--${value} needs a value`],
      ['a flag with no value, before a flag', ['out.png', `--${value}`, `--${other}`, 'x'], `--${value} needs a value`],
      ['a flag with an empty value', ['out.png', `--${value}`, ''], `--${value} needs a value`],
      ['a second output path', ['a.png', 'b.png'], "one output path only, not 'a.png' and 'b.png'"],
    ];
    const sw = flags.find((f) => t.spec.flags[f] === 'switch');
    if (sw) refusals.push([`a switch twice`, ['out.png', `--${sw}`, `--${sw}`], `--${sw} given twice`]);
    for (const [what, argv, why] of refusals) {
      const r = parse(t.spec, argv);
      ok('refused' in r && r.refused === `${why}\n${t.spec.usage}`, `${t.name}.ts refuses ${what} (${argv.map((a) => a || "''").join(' ')}): ${'refused' in r ? r.refused.split('\n')[0] : 'not refused'}, the usage line under it`);
    }
  }
  // The sheet's refusals and its usage line, word for word as tools/sheet.ts had them before #986.
  const USAGE = 'usage: node tools/sheet.ts out.png [--area <id>] [--maps a,b] [--monsters x,y] [--interiors p,q] [--rifts all|a,b] [--ground all|a,b] [--changed <base>]';
  const said = (argv: string[]): string => { const r = parse(SHEET, argv); return 'refused' in r ? r.refused : ''; };
  ok(SHEET.usage === USAGE, "the sheet's usage line is as it was");
  ok(said(['out.png', '--mpas', 'a']) === `unknown flag --mpas\n${USAGE}` && said(['out.png', '--maps', 'a', '--maps', 'b']) === `--maps given twice\n${USAGE}`
    && said(['out.png', '--maps']) === `--maps needs a value\n${USAGE}` && said(['a.png', 'b.png', '--maps', 'x']) === `one output path only, not 'a.png' and 'b.png'\n${USAGE}`,
  "the sheet's four refusals are word for word as they were");
}
