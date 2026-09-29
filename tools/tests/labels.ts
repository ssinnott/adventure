// The labels over a fight (ui/grouplabels.ts): every group on the maps, alone and in every fight of up
// to three groups a map can bring together, names each of its kinds with its count of the living,
// drops a kind when its last one falls, and labels inside the view, no line running into another
// or past the view's edge.
import { MAP_DEFS, MONSTERS } from '../../src/content/index.ts';
import { groupLabels, LABEL_ROW } from '../../src/ui/grouplabels.ts';
import type { LabelMonster, LabelLine } from '../../src/ui/grouplabels.ts';
import { LAYOUT } from '../../src/ui/frame.ts';
import { measureText } from '../../src/lib/engine/text.ts';
import { ok } from './lib.ts';

const V = LAYOUT.view;

/** A fight's monsters as the resolver seats them: each group's in order, twelve at most. */
function seat(groups: readonly (readonly string[])[]): LabelMonster[] {
  const out: LabelMonster[] = [];
  groups.forEach((ids, group) => { for (const id of ids) if (out.length < 12) out.push({ group, hp: MONSTERS[id].hp, def: MONSTERS[id] }); });
  return out;
}

/** What is wrong with a fight's labels: a group misnamed or miscounted, a line out of the view or into another. */
export function labelFaults(monsters: readonly LabelMonster[], width: number = V.w, height: number = V.h): string[] {
  const lines = groupLabels(monsters, width), out: string[] = [];
  // Each group standing reads as its kinds, each with its count of the living, in the order they stand.
  for (const g of new Set(monsters.map((m) => m.group))) {
    const living = monsters.filter((m) => m.group === g && m.hp > 0);
    const kinds = [...new Set(living.map((m) => m.def.id))];
    const want = kinds.map((id) => { const n = living.filter((m) => m.def.id === id).length, d = MONSTERS[id] ?? living.find((m) => m.def.id === id)!.def; return `${n} ${n === 1 ? d.name : d.plural}`; }).join(', ');
    const got = lines.filter((l) => l.group === g).map((l) => l.text).join(' ');
    if (got !== want) out.push(`group ${g} reads "${got}", not "${want}"`);
  }
  const box = (l: LabelLine): { x0: number; x1: number; y: number } => ({ x0: l.x, x1: l.x + measureText(l.text), y: l.y });
  for (const l of lines) {
    const b = box(l);
    if (b.x0 < 0 || b.x1 > width || b.y < 0 || b.y + LABEL_ROW > height / 2) out.push(`"${l.text}" at ${b.x0},${b.y} runs past the view`);
  }
  for (let i = 0; i < lines.length; i++) for (let j = i + 1; j < lines.length; j++) {
    const a = box(lines[i]), b = box(lines[j]);
    if (a.y === b.y && a.x0 < b.x1 + 4 && b.x0 < a.x1 + 4) out.push(`"${lines[i].text}" runs into "${lines[j].text}"`);
  }
  return out;
}

export function labels(): void {
  // Every group on the maps, alone, and every fight of up to three of a map's groups.
  const bad: string[] = [];
  let fights = 0;
  for (const d of MAP_DEFS) {
    const es = d.encounters ?? [];
    const check = (ids: string[], groups: string[][]): void => { fights++; for (const f of labelFaults(seat(groups))) bad.push(`${d.id} ${ids.join('+')}: ${f}`); };
    for (let a = 0; a < es.length; a++) {
      check([es[a].id], [es[a].monsters]);
      for (let b = a + 1; b < es.length; b++) {
        check([es[a].id, es[b].id], [es[a].monsters, es[b].monsters]);
        for (let c = b + 1; c < es.length; c++) check([es[a].id, es[b].id, es[c].id], [es[a].monsters, es[b].monsters, es[c].monsters]);
      }
    }
  }
  ok(bad.length === 0, `every group on the maps, alone and in ${fights} fights of up to three, names each kind with its count and labels inside the view${bad.length ? ` -> ${bad.length}: ${bad.slice(0, 5).join('; ')}` : ''}`);

  // The Thornmark ogre's band, which the issue saw read "5 Ogres".
  const tmOgre = MAP_DEFS.flatMap((d) => d.encounters ?? []).find((e) => e.id === 'tm_ogre')!;
  const ogre = seat([tmOgre.monsters]);
  const read = (ms: LabelMonster[]): string => groupLabels(ms, V.w).map((l) => l.text).join(' ');
  const { ogre: O, brigand: B, brigand_archer: A } = MONSTERS;
  ok(read(ogre) === `1 ${O.name}, 1 ${A.name}, 3 ${B.plural}`, `tm_ogre names each kind with its count (${read(ogre)})`);
  // A kind leaves the label when its last one falls, and a count falls with each.
  const fall = (id: string, n: number): void => { for (const m of ogre.filter((q) => q.def.id === id && q.hp > 0).slice(0, n)) m.hp = 0; };
  fall('ogre', 1); fall('brigand', 2);
  ok(read(ogre) === `1 ${A.name}, 1 ${B.name}`, `and drops a kind when its last one falls (${read(ogre)})`);

  // A group of the six longest-named kinds is too long for a row: it breaks between its kinds and
  // stays inside the view, and a group beside it takes the row under it.
  const longest = Object.values(MONSTERS).sort((p, q) => measureText(q.name) - measureText(p.name)).slice(0, 6).map((m) => m.id);
  const motley = seat([longest, ['brigand', 'brigand']]);
  const motleyLines = groupLabels(motley, V.w), rows = (g: number): number[] => motleyLines.filter((l) => l.group === g).map((l) => l.y / LABEL_ROW);
  ok(rows(0).length > 1 && Math.min(...rows(1)) > Math.max(...rows(0)) && labelFaults(motley).length === 0, `a group too long for a row breaks between its kinds, inside the view (${motleyLines.map((l) => `${l.y / LABEL_ROW}: ${l.text}`).join(' / ')}${labelFaults(motley).map((f) => ' -> ' + f).join('')})`);

  // A view too narrow for a name: the label runs past its edge, and the check says so.
  const wide = seat([['brigand_archer'], ['brigand_archer'], ['brigand_archer']]);
  ok(labelFaults(wide, 60).some((f) => f.includes('runs past')), `a label wider than the view is caught (${labelFaults(wide, 60)[0] ?? 'passes'})`);
}
