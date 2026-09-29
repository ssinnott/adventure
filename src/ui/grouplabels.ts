// The labels over a fight: each group's living monsters by kind, each kind with its own count
// ("1 Ogre, 3 Brigands, 1 Brigand Archer"), a kind gone from the label when its last one falls.
// Laid out left to right across the view, a group to the next row where it would run past the
// edge, and one too long for a row broken between its kinds. Pure, so tools/tests/labels.ts holds
// every group on the maps to it; ui/combat.ts draws what it returns.
import { measureText } from '../lib/engine/text.ts';

/** What a label needs of a monster in the fight. */
export interface LabelMonster { group: number; hp: number; def: { id: string; name: string; plural: string } }

/** A line of a label, placed from the view's top left. */
export interface LabelLine { text: string; x: number; y: number; group: number }

/** The margin inside the view, the space between two labels on a row, and a row's height. */
export const LABEL_PAD = 6, LABEL_GAP = 14, LABEL_ROW = 10;

/** A group's kinds among the living, in the order they stand, each with its count. */
export function groupParts(monsters: readonly LabelMonster[], group: number): string[] {
  const counts = new Map<string, { n: number; name: string; plural: string }>();
  for (const m of monsters) {
    if (m.group !== group || m.hp <= 0) continue;
    const k = counts.get(m.def.id) ?? { n: 0, name: m.def.name, plural: m.def.plural };
    k.n++; counts.set(m.def.id, k);
  }
  return [...counts.values()].map((k) => `${k.n} ${k.n === 1 ? k.name : k.plural}`);
}

/**
 * The labels of the groups still standing, laid out in a view `width` wide. A group's label starts
 * a row of its own when it would not fit after the last; a label wider than a row breaks after a
 * comma, its lines under one another.
 */
export function groupLabels(monsters: readonly LabelMonster[], width: number): LabelLine[] {
  const room = width - 2 * LABEL_PAD, out: LabelLine[] = [];
  const groups = [...new Set(monsters.filter((m) => m.hp > 0).map((m) => m.group))];
  // x and row: where the next label would go; free: the first row nothing stands on yet.
  let x = LABEL_PAD, row = 0, free = 0;
  for (const g of groups) {
    const parts = groupParts(monsters, g);
    // The label's lines: as many kinds to a line as fit in a row, a comma ending all but the last.
    const lines: string[] = [];
    for (const p of parts) {
      const last = lines.length - 1;
      if (last >= 0 && measureText(`${lines[last]}, ${p},`) <= room) lines[last] = `${lines[last]}, ${p}`;
      else lines.push(p);
    }
    const shown = lines.map((l, i) => (i < lines.length - 1 ? `${l},` : l));
    const w = Math.max(...shown.map((l) => measureText(l)));
    if (x > LABEL_PAD && (shown.length > 1 || x + w > LABEL_PAD + room)) { x = LABEL_PAD; row = free; }
    shown.forEach((text, i) => out.push({ text, x, y: (row + i) * LABEL_ROW, group: g }));
    free = Math.max(free, row + shown.length);
    if (shown.length > 1) { x = LABEL_PAD; row = free; } else x += w + LABEL_GAP;
  }
  return out;
}
