// For the runner's own check (../check.ts): a gate that says which areas the runner narrowed it
// to (#955), with parts as the real gate's (#954): `fixed`, then one to each area the run asks for.
import { ok, narrowed, asked } from '../../lib.ts';
import { AREAS } from '../../../../src/content/index.ts';

export const parts = (): string[] => ['fixed', ...AREAS.filter((a) => asked(a.id)).map((a) => a.id)];

export function gate(part?: string): void {
  if (part === undefined) { for (const p of parts()) gate(p); return; }
  if (part !== 'fixed') { ok(true, `the gate's part for ${part} ran`); return; }
  const areas = narrowed();
  console.log(`  note: the gate ran for ${areas ? areas.join(',') || 'no area' : 'every area'}`);
  ok(true, 'the gate ran');
}
