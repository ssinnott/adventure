// For the runner's own check (../check.ts): a gate that says which areas the runner narrowed it
// to (#955).
import { ok, narrowed } from '../../lib.ts';

export function gate(): void {
  const areas = narrowed();
  console.log(`  note: the gate ran for ${areas ? areas.join(',') || 'no area' : 'every area'}`);
  ok(true, 'the gate ran');
}
