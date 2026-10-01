// The labels over a fight: each group's living monsters by kind, each kind with its own count
// ("1 Ogre, 3 Brigands, 1 Brigand Archer"), a kind gone from the label when its last one falls.
// They run left to right across the view: a group goes to the next row where it would run past the
// edge, and one too long for a row breaks between its kinds. Where the fight seats its monsters is
// here too, so the labels can be held above them. Pure, so tools/tests/labels.ts holds every group
// on the maps to it; ui/combat.ts draws what it returns.
import { measureText } from '../lib/engine/text.ts';

/**
 * What a label needs of a monster in the fight: its group (a rank of a group on the map), and where it
 * stands, the group on the map it came with (`band`, its group when absent) and its rank.
 */
export interface LabelMonster { group: number; hp: number; fled?: boolean; band?: number; back?: boolean; def: { id: string; name: string; plural: string } }

/** Still in the fight. */
const stands = (m: LabelMonster): boolean => m.hp > 0 && !m.fled;

/** A line of a label, placed from the view's top left. */
export interface LabelLine { text: string; x: number; y: number; group: number }

/** The margin inside the view at either side. */
export const LABEL_PAD = 6;
/** The space between two groups' labels on a row: wide against the ", " between kinds. */
export const LABEL_GAP = 24;
/** A row's height. */
export const LABEL_ROW = 10;
/** How far below the view's top the first row is painted. */
export const LABEL_TOP = 6;
/** How far behind its front the back rank stands, in px up the view, and how much smaller it is drawn. */
export const BACK_RISE = 14, BACK_SCALE = 0.8;

/**
 * A monster drawn larger than this is a tall boss (MONSTERS.md §4.3). It stands on the third rank,
 * its roots sunk into the ground, and its markers are painted over its crown, so it keeps its drawn
 * size under the labels. Nothing on the maps but the Eldest is so tall.
 */
export const TALL = 1.5;
/** How high a tall boss's crown stands, of its height: the Eldest is drawn inside 0.84 of it and its crown reaches 0.812 (the smoke test holds it). */
export const TALL_REACH = 0.82;
/**
 * Where a monster of `group` and `size` stands in a fight painted in a view `viewH` high: the foot of
 * its sprite, a back rank's further up. A tall boss stands on the third rank whatever its group.
 */
export const seatFoot = (group: number, viewH: number, size = 1, back = false): number => viewH * 0.62 + 18 + (size > TALL ? Math.max(group, 2) : group) * 10 - (back ? BACK_RISE : 0);
/** Where a monster in the fight stands: by the group on the map it came with, and its rank. */
export const seatOf = (m: LabelMonster, viewH: number, size = 1): number => seatFoot(m.band ?? m.group, viewH, size, m.back);
/** How far above its foot a monster of `size`, drawn `h` high, stands: its whole height, or a tall boss's crown. */
export const crown = (size: number, h: number): number => (size > TALL ? h * TALL_REACH : h);
/** How far above a sprite's head its target and turn markers are painted. */
export const MARKER_RISE = 12;

/** A proper name, "The Eldest": a name beginning with "The". A lone one is not counted. */
export const isProperName = (name: string): boolean => /^The /.test(name);

/** A group's kinds among the living, in the order they stand, each with its count, but for a lone proper name. */
export function groupParts(monsters: readonly LabelMonster[], group: number): string[] {
  const counts = new Map<string, { n: number; name: string; plural: string }>();
  for (const m of monsters) {
    if (m.group !== group || !stands(m)) continue;
    const k = counts.get(m.def.id) ?? { n: 0, name: m.def.name, plural: m.def.plural };
    k.n++; counts.set(m.def.id, k);
  }
  return [...counts.values()].map((k) => k.n === 1 && isProperName(k.name) ? k.name : `${k.n} ${k.n === 1 ? k.name : k.plural}`);
}

/**
 * The labels of the groups still standing, laid out in a view `width` wide. A group's label starts
 * a row of its own when it would not fit after the last; a label wider than a row breaks after a
 * comma, its lines under one another.
 */
export function groupLabels(monsters: readonly LabelMonster[], width: number): LabelLine[] {
  const room = width - 2 * LABEL_PAD, out: LabelLine[] = [];
  const groups = [...new Set(monsters.filter(stands).map((m) => m.group))];
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
