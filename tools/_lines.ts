import { MAP_DEFS } from '../src/content/index.ts';
import { logLines } from '../src/ui/frame.ts';
import { lookLine } from '../src/game/wilds.ts';
const id = process.argv[2] ?? 'wrackholm_e6';
for (const f of MAP_DEFS.find((d) => d.id === id)!.features ?? []) {
  const t = f.kind === 'event' ? f.text : f.kind === 'camp' ? lookLine(f) : 'text' in f ? (f as any).text : undefined;
  if (t) console.log(logLines(t).length, t.length, (f as any).id ?? f.kind, '|', logLines(t).join(' / '));
}
