// Restates the monsters past level 10 onto a line made again (MONSTERS §4.4, "When the line
// moves"): for the day `--calibrate --write` makes the line past 10 again, which #865 weighed and
// did not do. Each is found on the shape it stood on in the line at a base git ref (a role's test
// monster, the test troll, giant or drake, or a role come down whole by the share it names) and given
// that shape's hit points and blow on the line as tools/testmonster.ts gives it now, a troll's
// mending with them. Its armour, to-hit, speed and xp come from the line's formulas and the curve,
// which the tables do not move, and are checked so; its notes, holds, resistances and spells are its
// own. Those set off the line (`MonsterDef.offLine`) are their boxes' gates' to set.
//   node tools/restate.ts <base ref>           what it would restate, from the line at <base ref>
//   node tools/restate.ts <base ref> --write   and writes it into the areas' monsters.ts
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { MONSTERS } from '../src/content/index.ts';
import type { MonsterDef } from '../src/game/monsters.ts';
import { ROLE_IDS, HP, DAMAGE, TROLL, SWEEP, scaleAt, testMonster } from './kit/line.ts';
import type { Role } from './kit/line.ts';
import { offLineOf, wholeOf } from './tests/harness.ts';

type Table = Record<Role, readonly number[]>;
export interface Tables { hp: Table; dmg: Table }

/** The HP and DAMAGE tables of tools/testmonster.ts at a git ref. */
export function tablesAt(ref: string): Tables {
  const src = execFileSync('git', ['show', `${ref}:tools/testmonster.ts`], { encoding: 'utf8' });
  const table = (name: string): Table => {
    const body = new RegExp(`export const ${name}: Record<Role, readonly number\\[\\]> = \\{\\n([\\s\\S]*?)\\n\\};`).exec(src)?.[1];
    if (!body) throw new Error(`no ${name} in tools/testmonster.ts at ${ref}`);
    const rows = new Map(body.split('\n').map((l) => {
      const row = /^\s*(\w+):\s*\[([^\]]*)\],?$/.exec(l);
      if (!row) throw new Error(`a row of ${name} at ${ref} reads oddly: ${l}`);
      return [row[1], row[2].split(',').map(Number)] as const;
    }));
    const out = {} as Record<Role, readonly number[]>;
    for (const r of ROLE_IDS) { const row = rows.get(r); if (!row) throw new Error(`no ${r} in ${name} at ${ref}`); out[r] = row; }
    return out;
  };
  return { hp: table('HP'), dmg: table('DAMAGE') };
}

/** The shapes a monster of its level may stand on, by name, on the tables given, as the harness suite's `onTheLine` has them. */
export function shapes(t: Tables, m: MonsterDef): { name: string; def: MonsterDef }[] {
  const l = m.level, h = (r: Role): number => scaleAt(t.hp, r, l), d = (r: Role): number => scaleAt(t.dmg, r, l), w = wholeOf(m.id);
  const brute = testMonster('brute', l, h('brute'), d('brute')), trollHp = Math.round(brute.hp * TROLL.hp);
  const giant = testMonster('brute', l, h('brute') * SWEEP.share, d('brute') * SWEEP.share);
  return [
    ...ROLE_IDS.map((r) => ({ name: r, def: testMonster(r, l, h(r), d(r)) })),
    { name: 'troll', def: { ...brute, hp: trollHp, regen: Math.round(trollHp * TROLL.regen) } },
    { name: 'giant', def: { ...giant, sweep: { chance: SWEEP.chance } } },
    { name: 'drake', def: { ...giant, sweep: { chance: SWEEP.chance, element: 'fire' as const } } },
    ...(w ? [{ name: `${w.role} come down whole to ${w.share}`, def: testMonster(w.role, l, h(w.role) * w.share, d(w.role) * w.share) }] : []),
  ];
}

const blow = (m: Pick<MonsterDef, 'dice' | 'sides' | 'bonus'>): number => (m.dice * (m.sides + 1)) / 2 + m.bonus;
/** Whether a monster stands on a shape: its hit points, its blow to half a point, its mending and its sweep (`onTheLine`'s rule). */
export const stands = (t: MonsterDef, m: MonsterDef): boolean =>
  t.hp === m.hp && Math.abs(blow(t) - blow(m)) <= 0.5 && (t.regen ?? 0) === (m.regen ?? 0) && (t.sweep?.chance ?? 0) === (m.sweep?.chance ?? 0) && t.sweep?.element === m.sweep?.element;

/** One field of a def's line put to a new value; it must be there once. */
function put(line: string, id: string, field: RegExp, now: string): string {
  const found = line.match(new RegExp(field.source, 'g'));
  if (found?.length !== 1) throw new Error(`${id}: ${field.source} is on its line ${found?.length ?? 0} times`);
  return line.replace(field, now);
}

function main(): void {
  const ref = process.argv[2], write = process.argv.includes('--write');
  if (!ref || ref.startsWith('--')) throw new Error('node tools/restate.ts <base ref> [--write]: the git ref whose line the monsters stand on');
  const was = tablesAt(ref), now: Tables = { hp: HP, dmg: DAMAGE };
  const dir = new URL('../src/content/areas/', import.meta.url), files = new Map<string, string>();
  for (const area of fs.readdirSync(dir)) { const f = new URL(`${area}/monsters.ts`, dir); if (fs.existsSync(f)) files.set(f.pathname, fs.readFileSync(f, 'utf8')); }
  const tally = new Map<string, number>();
  let moved = 0, already = 0;
  for (const m of Object.values(MONSTERS).filter((x) => x.level > 10 && !offLineOf(x.id)).sort((a, b) => a.level - b.level || a.id.localeCompare(b.id))) {
    const before = shapes(was, m), k = before.findIndex(({ def }) => stands(def, m));
    if (k < 0) {
      if (shapes(now, m).some(({ def }) => stands(def, m))) { already++; continue; }
      throw new Error(`${m.id} at ${m.level} stands on no shape of the line at ${ref}, nor of the line now`);
    }
    const from = before[k].def, to = shapes(now, m)[k].def;
    for (const f of ['ac', 'attack', 'speed', 'xp'] as const) if (from[f] !== to[f]) throw new Error(`${m.id}: the ${before[k].name}'s ${f} moved with the tables (${from[f]} to ${to[f]})`);
    const file = [...files.keys()].find((f) => files.get(f)!.includes(`{ id: '${m.id}',`));
    if (!file) throw new Error(`${m.id}: no area's monsters.ts holds it`);
    const src = files.get(file)!, i = src.indexOf(`{ id: '${m.id}',`), j = src.indexOf('\n', i);
    let line = src.slice(i, j);
    line = put(line, m.id, new RegExp(`\\bhp: ${m.hp},`), `hp: ${to.hp},`);
    line = put(line, m.id, new RegExp(`\\bdice: ${m.dice}, sides: ${m.sides}, bonus: ${m.bonus},`), `dice: ${to.dice}, sides: ${to.sides}, bonus: ${to.bonus},`);
    if (m.regen !== undefined || to.regen !== undefined) line = put(line, m.id, new RegExp(`\\bregen: ${m.regen},?`), `regen: ${to.regen}${/regen: \d+,/.test(line) ? ',' : ''}`);
    files.set(file, src.slice(0, i) + line + src.slice(j));
    const area = file.split('/').at(-2) ?? file;
    tally.set(area, (tally.get(area) ?? 0) + 1);
    moved++;
    console.log(`${m.id} (${before[k].name} ${m.level}, ${area}): ${m.hp} ${m.dice}d${m.sides}+${m.bonus} (${blow(m)})${m.regen ? ` mending ${m.regen}` : ''} -> ${to.hp} ${to.dice}d${to.sides}+${to.bonus} (${blow(to)})${to.regen ? ` mending ${to.regen}` : ''}`);
  }
  console.log(`\n${moved} restated from the line at ${ref} (${[...tally].map(([a, n]) => `${a} ${n}`).join(', ')}), ${already} on the line now already, ${Object.values(MONSTERS).filter((m) => offLineOf(m.id)).length} off it (each by its own word, its gate's)`);
  if (write) { for (const [f, src] of files) fs.writeFileSync(f, src); console.log('written to the areas\' monsters.ts'); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
