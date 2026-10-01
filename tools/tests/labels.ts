// The labels over a fight (ui/grouplabels.ts). Every group on the maps as played, alone and in every
// fight of up to three groups a map can bring together, names each of its kinds with its count of
// the living and drops a kind when its last one falls. Its labels stay inside the view and above
// the monsters' markers, no line running into another.
import { MAP_DEFS, MONSTERS } from '../../src/content/index.ts';
import { PLAYED_DEFS } from '../../src/content/maps.ts';
import { groupLabels, seatOf, crown, LABEL_ROW, LABEL_TOP, MARKER_RISE, TALL, BACK_SCALE } from '../../src/ui/grouplabels.ts';
import { combatHeight } from '../../src/ui/sprites.ts';
import type { LabelMonster, LabelLine } from '../../src/ui/grouplabels.ts';
import { LAYOUT, COMBAT_LOG_LINES } from '../../src/ui/frame.ts';
import { measureText } from '../../src/lib/engine/text.ts';
import { ok } from './lib.ts';

const V = LAYOUT.view;
/** A line of the font's height, in px. */
const GLYPH = 7;

/** A fight's monsters as the resolver seats them: each group's in order, a back rank a group of its own, twelve at most. */
function seat(groups: readonly (readonly string[] | { monsters: readonly string[]; back?: number })[]): LabelMonster[] {
  const out: LabelMonster[] = [];
  let group = -1;
  groups.forEach((g, band) => {
    const ids = 'monsters' in g ? g.monsters : g, front = ids.length - ('monsters' in g ? g.back ?? 0 : 0);
    ids.forEach((id, k) => { if (out.length >= 12) return; if (k === 0 || k === front) group++; out.push({ group, band, back: k >= front, hp: MONSTERS[id].hp, def: MONSTERS[id] }); });
  });
  return out;
}

/**
 * What is wrong with a fight's labels: a group misnamed or miscounted, a line past the view's side,
 * into another or down onto the monsters (its painted foot at or below the highest marker, as the
 * fight seats them in a view `height` high).
 */
export function labelFaults(monsters: readonly LabelMonster[], width: number = V.w, height: number = V.h, row = LABEL_ROW): string[] {
  const lines = groupLabels(monsters, width).map((l) => ({ ...l, y: (l.y / LABEL_ROW) * row })), out: string[] = [];
  // Each group standing reads as its kinds, each with its count of the living, in the order they
  // stand; a lone proper name ("The Eldest") is not counted. The rule is written out here, not taken
  // from the code it checks, so a rule widened or narrowed there fails.
  for (const g of new Set(monsters.map((m) => m.group))) {
    const living = monsters.filter((m) => m.group === g && m.hp > 0);
    const kinds = [...new Set(living.map((m) => m.def.id))];
    const want = kinds.map((id) => { const n = living.filter((m) => m.def.id === id).length, d = MONSTERS[id] ?? living.find((m) => m.def.id === id)!.def; return n === 1 && /^The /.test(d.name) ? d.name : `${n} ${n === 1 ? d.name : d.plural}`; }).join(', ');
    const got = lines.filter((l) => l.group === g).map((l) => l.text).join(' ');
    if (got !== want) out.push(`group ${g} reads "${got}", not "${want}"`);
  }
  const box = (l: LabelLine): { x0: number; x1: number; y: number } => ({ x0: l.x, x1: l.x + measureText(l.text), y: l.y });
  const living = monsters.filter((m) => m.hp > 0);
  const size = (m: LabelMonster): number => MONSTERS[m.def.id]?.size ?? 1, h = (m: LabelMonster): number => combatHeight(size(m), living.length) * (m.back ? BACK_SCALE : 1);
  const markers = Math.min(...living.map((m) => seatOf(m, height, size(m)) - crown(size(m), h(m)) - MARKER_RISE));
  for (const l of lines) {
    const b = box(l), foot = LABEL_TOP + b.y + GLYPH;
    if (b.x0 < 0 || b.x1 > width || b.y < 0) out.push(`"${l.text}" at ${b.x0},${b.y} runs past the view`);
    if (foot >= markers) out.push(`"${l.text}" reaches ${foot} px down, onto the monsters' markers at ${Math.round(markers)}`);
  }
  // A tall boss's crown stands below the labels, so its face is in the view and clear of them, and
  // its health bar above the log's lines.
  const under = lines.length ? LABEL_TOP + Math.max(...lines.map((l) => l.y)) + GLYPH : 0;
  for (const m of living.filter((q) => size(q) > TALL)) {
    const foot = seatOf(m, height, size(m)), top = foot - crown(size(m), h(m));
    if (top <= under) out.push(`${m.def.name}'s crown stands at ${Math.round(top)} px, up into the labels at ${under}`);
    if (foot + 6 > height - (COMBAT_LOG_LINES * 10 + 6)) out.push(`${m.def.name} stands at ${Math.round(foot)} px, its health under the log`);
  }
  for (let i = 0; i < lines.length; i++) for (let j = i + 1; j < lines.length; j++) {
    const a = box(lines[i]), b = box(lines[j]);
    if (a.y === b.y && a.x0 < b.x1 + 4 && b.x0 < a.x1 + 4) out.push(`"${lines[i].text}" runs into "${lines[j].text}"`);
  }
  return out;
}

export function labels(): void {
  // Every group on the maps as played alone and in every fight of up to three of a map's groups.
  // The outdoors as played, since a group follows the party over a zone's edge (SLICE.md).
  const bad: string[] = [];
  let fights = 0, faulty = 0;
  for (const d of PLAYED_DEFS) {
    const es = d.encounters ?? [];
    const check = (ids: string[], groups: { monsters: readonly string[]; back?: number }[]): void => {
      fights++;
      const faults = labelFaults(seat(groups));
      if (faults.length) faulty++;
      for (const f of faults) bad.push(`${d.id} ${ids.join('+')}: ${f}`);
    };
    for (let a = 0; a < es.length; a++) {
      check([es[a].id], [es[a]]);
      for (let b = a + 1; b < es.length; b++) {
        check([es[a].id, es[b].id], [es[a], es[b]]);
        for (let c = b + 1; c < es.length; c++) check([es[a].id, es[b].id, es[c].id], [es[a], es[b], es[c]]);
      }
    }
  }
  ok(bad.length === 0, `every group on the maps as played, alone and in ${fights} fights of up to three, names each kind with its count and labels inside the view, above the monsters${bad.length ? ` -> ${faulty} fights with ${bad.length} faults: ${bad.slice(0, 5).join('; ')}` : ''}`);

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

  // The Eldest and its heartwoods, at Penspern's tip: a lone proper name is not counted, and the want above follows,
  // so a count put back on it fails both. Drawn at 2, it is a tall boss: whole, with its heartwoods
  // or alone, it stands under the labels and over the log, and taller than they are.
  const eldest = seat([['eldest', 'heartwood', 'heartwood']]), { eldest: E, heartwood: T } = MONSTERS, eldestFaults = labelFaults(eldest);
  ok(read(eldest) === `${E.name}, 2 ${T.plural}` && eldestFaults.length === 0, `a lone proper name is not counted, and a tall boss is seated under its label (${read(eldest)}${eldestFaults.map((f) => ' -> ' + f).join('')})`);
  for (const m of eldest.filter((q) => q.def.id === 'heartwood')) m.hp = 0;
  const alone = labelFaults(eldest), stands = (id: string): number => crown(MONSTERS[id].size, combatHeight(MONSTERS[id].size, 3));
  ok(E.size > TALL && alone.length === 0 && stands('eldest') > stands('heartwood') * 1.1, `the Eldest at ${E.size} stands ${Math.round(stands('eldest'))} px to the full height its heartwoods are drawn, ${Math.round(stands('heartwood'))}, and alone under its label too${alone.map((f) => ' -> ' + f).join('')}`);

  // A group of the six longest-named kinds is too long for a row: it breaks between its kinds and
  // stays inside the view, and a group beside it takes the row under it.
  const longest = Object.values(MONSTERS).sort((p, q) => measureText(q.name) - measureText(p.name)).slice(0, 6).map((m) => m.id);
  const motley = seat([longest, ['brigand', 'brigand']]);
  const motleyLines = groupLabels(motley, V.w), rows = (g: number): number[] => motleyLines.filter((l) => l.group === g).map((l) => l.y / LABEL_ROW);
  ok(rows(0).length > 1 && Math.min(...rows(1)) > Math.max(...rows(0)) && labelFaults(motley).length === 0, `a group too long for a row breaks between its kinds, inside the view (${motleyLines.map((l) => `${l.y / LABEL_ROW}: ${l.text}`).join(' / ')}${labelFaults(motley).map((f) => ' -> ' + f).join('')})`);

  // Rows spread 67 px apart put grove2's Hand of Ash and its warden's second row across the Hand:
  // the check holds the labels above the markers, not merely in the top half of the view.
  const es = MAP_DEFS.flatMap((d) => d.encounters ?? []), hand = es.find((e) => e.id === 'g2_hand'), warden = es.find((e) => e.id === 'g2_warden');
  const spread = hand && warden ? labelFaults(seat([hand.monsters, warden.monsters]), V.w, V.h, 67) : [];
  ok(spread.some((f) => f.includes('onto the monsters')), `a label painted down onto the monsters is caught (${spread.find((f) => f.includes('onto')) ?? 'passes'})`);
  // A back rank (#160) stands behind its front, smaller and further up the view, labelled as a group
  // of its own and clear of its labels; and a group that fled is gone from them.
  const ranked = seat([{ monsters: ['skeleton', 'skeleton', 'ashen_adept', 'ashen_adept', 'ashen_adept', 'ashen_adept'], back: 4 }, ['brigand', 'brigand', 'brigand']]);
  const foot = (i: number): number => seatOf(ranked[i], V.h);
  ok(foot(2) < foot(0) && new Set(ranked.map((m) => m.group)).size === 3 && read(ranked) === `2 ${MONSTERS.skeleton.plural} 4 ${MONSTERS.ashen_adept.plural} 3 ${MONSTERS.brigand.plural}` && labelFaults(ranked).length === 0, `a back rank stands behind its front, labelled apart (${read(ranked)}${labelFaults(ranked).map((f) => ' -> ' + f).join('')})`);
  for (const m of ranked.filter((q) => q.def.id === 'brigand')) m.fled = true;
  ok(read(ranked) === `2 ${MONSTERS.skeleton.plural} 4 ${MONSTERS.ashen_adept.plural}`, `and a group that fled leaves the labels (${read(ranked)})`);
  // A view too narrow for a name: the label runs past its edge, and the check says so.
  const wide = seat([['brigand_archer'], ['brigand_archer'], ['brigand_archer']]);
  ok(labelFaults(wide, 60).some((f) => f.includes('runs past')), `a label wider than the view is caught (${labelFaults(wide, 60)[0] ?? 'passes'})`);
}
