// The fight's row (ui/row.ts). Every fight the maps can start, each group alone and with up to two more
// of its map's, and the worst the cap allows, twelve of a kind for every kind drawn (Act III's ahead of
// their maps among them) and three groups of the widest and of the tallest, stands with every span
// inside the view and no neighbour over more than OVERLAP of the next. A fight that fitted as the row
// stood before stands as it did, and only a row too wide for the view is drawn smaller.
import { MONSTERS, MAP_DEFS } from '../../src/content/index.ts';
import { PLAYED_DEFS } from '../../src/content/maps.ts';
import { seatRow, OVERLAP } from '../../src/ui/row.ts';
import type { RowMonster, Seat } from '../../src/ui/row.ts';
import { combatHeight, SPAN, SPAN_SLACK } from '../../src/ui/sprites.ts';
import { seatOf, BACK_SCALE } from '../../src/ui/grouplabels.ts';
import { LAYOUT } from '../../src/ui/frame.ts';
import { MAX_MONSTERS, MAX_GROUPS } from '../../src/game/combat.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import { ok } from './lib.ts';

const V = LAYOUT.view;
const EPS = 1e-6;
type Group = { monsters: readonly (string | MonsterDef)[]; back?: number };

/** A fight's monsters as the resolver seats them (`startCombat`): each group's in order, its back rank a group of its own, twelve at most. */
function seat(groups: readonly Group[]): RowMonster[] {
  const out: RowMonster[] = [];
  let group = -1;
  groups.forEach((g, band) => {
    const front = g.monsters.length - Math.max(0, Math.min(g.back ?? 0, g.monsters.length - 1));
    g.monsters.forEach((m, k) => {
      if (out.length >= MAX_MONSTERS) return;
      if (k === 0 || k === front) group++;
      const def = typeof m === 'string' ? MONSTERS[m] : m;
      out.push({ group, band, back: k >= front, hp: def.hp, def });
    });
  });
  return out;
}

/** A fight's lines, front then back rank, as the row lays them out: one line where it has no back rank, or nothing else. */
function lines(ms: readonly RowMonster[]): number[][] {
  const front = ms.flatMap((m, i) => (m.back ? [] : [i])), rear = ms.flatMap((m, i) => (m.back ? [i] : []));
  return front.length && rear.length ? [front, rear] : [ms.map((_, i) => i)];
}

/** The height a monster is drawn at in a row that is not made smaller. */
const tall = (m: RowMonster, n: number): number => combatHeight(m.def.size, n) * (m.back ? BACK_SCALE : 1);

/**
 * The row as it stood before it was spaced by the drawings: every line a slot apart and centred, a
 * back rank a quarter slot aside where it would stand behind its front. Written out here, not taken
 * from the code it checks, so the check of what fitted holds the old look.
 */
function before(ms: readonly RowMonster[]): Seat[] {
  const ls = lines(ms), ranked = ls.length === 2, n = ms.length;
  const step = ranked && (ls[0].length - ls[1].length) % 2 === 0 ? 0.25 : 0;
  const slot = V.w / Math.max(5, Math.max(...ls.map((l) => l.length)) + 2 * step);
  const out: Seat[] = [];
  ls.forEach((line, k) => line.forEach((i, j) => {
    const m = ms[i], h = tall(m, n), [l, r] = SPAN[m.def.sprite];
    const x = (V.w - slot * line.length) / 2 + slot * (j + 0.5) + (ranked ? (k === 1 ? step : -step) * slot : 0);
    out[i] = { x, foot: seatOf(m, V.h, m.def.size), h, left: l * h, right: r * h };
  }));
  return out;
}

/**
 * What is wrong with a fight's row: a span not its drawing's at its height, one past the view's side
 * (by SPAN_SLACK, which a drawing may reach past its span), neighbours over more than OVERLAP of the
 * narrower, or heights that are not one scale of the fight's, at most whole.
 */
export function rowFaults(ms: readonly RowMonster[], seats: readonly Seat[] = seatRow(ms, V.w, V.h)): string[] {
  const out: string[] = [], n = ms.length, name = (i: number): string => `${ms[i].def.id} ${i + 1}`;
  const scales = ms.map((m, i) => seats[i].h / tall(m, n));
  ms.forEach((m, i) => {
    const s = seats[i], [l, r] = SPAN[m.def.sprite];
    if (Math.abs(s.left - l * s.h) > EPS || Math.abs(s.right - r * s.h) > EPS) out.push(`${name(i)}'s span is not its drawing's`);
    if (s.x - s.left < SPAN_SLACK - EPS) out.push(`${name(i)} runs ${(SPAN_SLACK - s.x + s.left).toFixed(1)} px past the left`);
    if (s.x + s.right > V.w - SPAN_SLACK + EPS) out.push(`${name(i)} runs ${(s.x + s.right - V.w + SPAN_SLACK).toFixed(1)} px past the right`);
    if (Math.abs(scales[i] - scales[0]) > EPS || scales[i] > 1 + EPS) out.push(`${name(i)} is drawn at ${scales[i].toFixed(3)} of its height, against ${scales[0].toFixed(3)}`);
  });
  for (const line of lines(ms)) for (let j = 1; j < line.length; j++) {
    const a = seats[line[j - 1]], b = seats[line[j]];
    const over = a.x + a.right - (b.x - b.left), most = OVERLAP * Math.min(a.left + a.right, b.left + b.right);
    if (over > most + EPS) out.push(`${name(line[j - 1])} stands ${over.toFixed(1)} px over ${name(line[j])}, past ${most.toFixed(1)}`);
  }
  return out;
}

/** Whether a row drawn smaller had to be: closed right up at its full height, some line runs past the view. */
function hadTo(ms: readonly RowMonster[]): boolean {
  const n = ms.length;
  return lines(ms).some((line) => {
    const w = (i: number): [number, number] => { const h = tall(ms[i], n); return [SPAN[ms[i].def.sprite][0] * h, SPAN[ms[i].def.sprite][1] * h]; };
    let across = w(line[0])[0] + w(line[line.length - 1])[1];
    for (let j = 1; j < line.length; j++) {
      const [la, ra] = w(line[j - 1]), [lb, rb] = w(line[j]);
      across += Math.max(0, ra + lb - OVERLAP * Math.min(la + ra, lb + rb));
    }
    return across > V.w - 2 * SPAN_SLACK + EPS;
  });
}

export function row(): void {
  // Every group on the maps as played, alone and in every fight of up to three of a map's groups, as
  // the labels are checked; the outdoors as played, since a group follows the party over a zone's edge.
  const bad: string[] = [], seen = new Set<string>();
  let fights = 0, kept = 0, fitted = 0, smaller = 0, least = 1;
  const check = (where: string, groups: readonly Group[]): void => {
    const key = groups.map((g) => `${g.monsters.join(',')}/${g.back ?? 0}`).join('|');
    if (seen.has(key)) return;
    seen.add(key); fights++;
    const ms = seat(groups), seats = seatRow(ms, V.w, V.h), was = before(ms);
    const faults = rowFaults(ms, seats);
    const scale = seats[0].h / tall(ms[0], ms.length);
    if (scale < 1 - EPS) { smaller++; least = Math.min(least, scale); if (!hadTo(ms)) faults.push(`drawn at ${scale.toFixed(3)} where it fits whole`); }
    if (rowFaults(ms, was).length === 0) {
      fitted++;
      if (seats.every((s, i) => Math.abs(s.x - was[i].x) < EPS && Math.abs(s.h - was[i].h) < EPS)) kept++;
      else faults.push('fitted as the row stood before, and moved');
    }
    for (const f of faults) bad.push(`${where} ${key}: ${f}`);
  };
  for (const d of PLAYED_DEFS) {
    const es = d.encounters ?? [];
    for (let a = 0; a < es.length; a++) {
      check(d.id, [es[a]]);
      for (let b = a + 1; b < es.length; b++) {
        check(d.id, [es[a], es[b]]);
        for (let c = b + 1; c < es.length; c++) check(d.id, [es[a], es[b], es[c]]);
      }
    }
  }
  ok(bad.length === 0 && kept === fitted, `every fight the maps can start, ${fights} of them, stands inside the view with no neighbour over more than a third of the next; the ${fitted} that fitted as the row stood before stand as they did, and ${smaller} too wide for the view are drawn smaller, down to ${least.toFixed(2)}${bad.length ? ` -> ${bad.length} faults: ${bad.slice(0, 5).join('; ')}` : ''}`);

  // The worst the cap allows, with every kind drawn, those ahead of their maps too: twelve of a kind
  // and every count under it, three groups of four of the widest and of the tallest, the widest four
  // before eight of the next in a back rank, and every caller with the group it calls.
  const defs = Object.values(MONSTERS);
  const worst: { what: string; groups: Group[] }[] = [];
  for (const d of defs) for (let k = 1; k <= MAX_MONSTERS; k++) worst.push({ what: `${k} ${d.id}`, groups: [{ monsters: new Array(k).fill(d) }] });
  const wide = (d: MonsterDef): number => (SPAN[d.sprite][0] + SPAN[d.sprite][1]) * combatHeight(d.size, MAX_MONSTERS);
  const widest = [...defs].sort((a, b) => wide(b) - wide(a)).slice(0, MAX_GROUPS), tallest = [...defs].sort((a, b) => b.size - a.size).slice(0, MAX_GROUPS);
  const four = (d: MonsterDef): Group => ({ monsters: new Array(MAX_MONSTERS / MAX_GROUPS).fill(d) });
  worst.push({ what: `the widest, ${widest.map((d) => d.id).join(', ')}`, groups: widest.map(four) });
  worst.push({ what: `the tallest, ${tallest.map((d) => d.id).join(', ')}`, groups: tallest.map(four) });
  worst.push({ what: 'the widest before the next in a back rank', groups: [{ monsters: [...new Array(4).fill(widest[0]), ...new Array(8).fill(widest[1])], back: 8 }] });
  for (const d of defs.filter((q) => q.calls)) worst.push({ what: `${d.id} and its call`, groups: [{ monsters: [d, ...new Array(6).fill(d.calls!.monsters[0])] }, { monsters: d.calls!.monsters }] });
  const worstBad = worst.flatMap(({ what, groups }) => rowFaults(seat(groups)).map((f) => `${what}: ${f}`));
  ok(worstBad.length === 0, `the cap's worst stand inside the view as well, ${worst.length} fights of every kind drawn (the widest ${widest.map((d) => d.name).join(', ')}; the tallest ${tallest.map((d) => d.name).join(', ')})${worstBad.length ? ` -> ${worstBad.slice(0, 5).join('; ')}` : ''}`);

  // Cairnmoor's builder saw the old row run a moor hound off the right of five and a tor troll off
  // the left: the check catches the row as it stood, and the row now keeps them in, smaller.
  const hounds = seat([{ monsters: new Array(5).fill('moor_hound') }]), trolls = seat([{ monsters: new Array(5).fill('tor_troll') }]);
  const was = [...rowFaults(hounds, before(hounds)), ...rowFaults(trolls, before(trolls))];
  ok(was.some((f) => f.startsWith('moor_hound 5 runs') && f.endsWith('past the right')) && was.some((f) => f.startsWith('tor_troll 1 runs') && f.endsWith('past the left')) && rowFaults(hounds).length === 0 && rowFaults(trolls).length === 0,
    `five moor hounds and five tor trolls ran past the view's edges as the row stood, and the check says so (${was.filter((f) => f.includes('past the')).slice(0, 2).join('; ')}); now they stand inside it`);
  // A row that fits as it was keeps its look: the Foreland's bandits on the road, wolves on the hill
  // and smugglers on the cliff, drawn at the old size in the old places.
  const ids = ['road_bandits', 'hill_wolves', 'cliff_smugglers'], first = MAP_DEFS.flatMap((d) => d.encounters ?? []).filter((e) => ids.includes(e.id));
  const same = first.map((e) => { const ms = seat([e]), was = before(ms); return rowFaults(ms, was).length === 0 && seatRow(ms, V.w, V.h).every((s, i) => Math.abs(s.x - was[i].x) < EPS && s.h === was[i].h); });
  ok(first.length === ids.length && same.every(Boolean), `and the Foreland's road bandits, hill wolves and cliff smugglers, which fitted, stand as they did (${first.map((e, i) => `${e.id} ${same[i] ? 'kept' : 'moved'}`).join(', ')})`);
}
