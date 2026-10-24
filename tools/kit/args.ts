// A tool's command line read strictly (#986), as tools/sheet.ts first read its own: one output path, each
// flag of the tool's table once and with a value (a switch where the table says so), and anything else
// refused with the tool's usage line, so a misspelt flag never draws the default and looks like nothing
// changed. The tables of the four tools that take it are here beside the reading, so the suite
// (tools/tests/args.ts) holds each tool's lines without starting one: a suite takes no tool, and a tool
// runs as it loads.

/** A tool's command line: its usage line and its flags, each taking a value or a switch. */
export interface Spec { readonly usage: string; readonly flags: Readonly<Record<string, 'value' | 'switch'>> }

/** A command line as read: the output path if one is given, each flag given with its value and each switch given. */
export interface Args { readonly out: string | undefined; readonly opts: Readonly<Partial<Record<string, string>>>; readonly switches: ReadonlySet<string> }

/** `argv` (the words after the script) read by `spec`, or why it is refused, the tool's usage line under it. */
export function parse(spec: Spec, argv: readonly string[]): Args | { refused: string } {
  const opts: Record<string, string> = {}, switches = new Set<string>();
  const refuse = (why: string): { refused: string } => ({ refused: `${why}\n${spec.usage}` });
  let out: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const name = a.slice(2), kind = Object.hasOwn(spec.flags, name) ? spec.flags[name] : undefined;
      if (!kind) return refuse(`unknown flag ${a}`);
      if (name in opts || switches.has(name)) return refuse(`${a} given twice`);
      if (kind === 'switch') { switches.add(name); continue; }
      const v = argv[i + 1];
      if (v === undefined || v.startsWith('--') || v === '') return refuse(`${a} needs a value`);
      opts[name] = v; i++;
    } else if (out === undefined) out = a;
    else return refuse(`one output path only, not '${out}' and '${a}'`);
  }
  return { out, opts, switches };
}

/** This process's command line read by `spec`; a refusal is printed and the process exits 2. */
export function read(spec: Spec, argv: readonly string[] = process.argv.slice(2)): Args {
  const r = parse(spec, argv);
  if ('refused' in r) { console.error(r.refused); process.exit(2); }
  return r;
}

export const SHEET: Spec = {
  usage: 'usage: node tools/sheet.ts out.png [--area <id>] [--maps a,b] [--monsters x,y] [--interiors p,q] [--rifts all|a,b] [--ground all|a,b] [--changed <base>]',
  flags: { area: 'value', maps: 'value', monsters: 'value', interiors: 'value', rifts: 'value', ground: 'value', changed: 'value' },
};

export const GALLERY: Spec = {
  usage: 'usage: node tools/gallery.ts out.png [--only kind,kind,...] [--family wolf] [--scale 2] [--frames 6] [--flash] [--tone 0.6]',
  flags: { only: 'value', family: 'value', scale: 'value', frames: 'value', flash: 'switch', tone: 'value' },
};

export const INTERIORS: Spec = {
  usage: 'usage: node tools/interiors.ts out.png [--only hearthlight_inn,gilded_eel] [--scale 2] [--hour 21] [--frame 40]',
  flags: { only: 'value', scale: 'value', hour: 'value', frame: 'value' },
};

export const WORLDMAP: Spec = {
  usage: 'usage: node tools/worldmap.ts out.png [--zones] [--scale 1] [--at map,x,y,facing]',
  flags: { zones: 'switch', scale: 'value', at: 'value' },
};
