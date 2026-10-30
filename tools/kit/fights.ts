// The fights the maps can start, each once (#848): every group on the maps as played, alone and with
// up to two more of its map's in the order they stand there, seated as the suite that asks seats a
// fight, and each seated fight given once however many maps and runs of groups bring it about. The
// labels' and the row's suites take it (tools/tests/labels.ts, tools/tests/row.ts): of the eleven
// million fights their loops of three met, about 830,000 seat apart, nearly all on the outdoors.
//
// A run of groups is found by what a seat reads of a group, its monsters and its back rank, so groups
// alike are one: each run met on a map is taken once, at the first places it can stand (the earliest
// group of its like, then the earliest after it), and none is tried past a group the fight had no
// room for. A seated fight is keyed by every field of every
// monster in seat order (`seatKey`), all that the labels and the row are given but the view, which a
// suite holds fixed, and the tables, which no fight changes.
import type { LabelMonster } from '../../src/ui/grouplabels.ts';

/** A group as a fight takes it: its name on the map, its monsters in the order they stand and how many of the last stand in a back rank. */
export interface Group { id: string; monsters: readonly string[]; back?: number }

/** A fight the maps can start: the map it is first met on, its groups in the order they stand there, and its monsters as the suite seats them. */
export interface Fight<M> { map: string; groups: readonly Group[]; seated: readonly M[] }

/** The fields of a seated monster the key reads: every one a LabelMonster has, or `Every` is never and no seat's monsters can be keyed. */
type Read = 'group' | 'hp' | 'fled' | 'band' | 'back' | 'def';
type Every = [keyof LabelMonster] extends [Read] ? ([Read] extends [keyof LabelMonster] ? LabelMonster : never) : never;

/** A key's letter for a field: a whole number under the last letter, which stands for a band not given. */
const letter = (n: number): number => {
  if (!Number.isInteger(n) || n < 0 || n >= 0xffff) throw new Error(`a seated monster's field ${n} is past the fight's key`);
  return n;
};

/**
 * A seated fight as a key: each monster in seat order by every field it has, five letters to one: its
 * def by identity (all a suite reads of a def, its id, name, plural, size and drawing, goes with it),
 * its hit points, group, band, and its rank with whether it fled. One key, one input to the checks.
 */
function seatKey(ms: readonly Every[], defs: Map<object, number>): string {
  let key = '';
  for (const m of ms) {
    let def = defs.get(m.def);
    if (def === undefined) defs.set(m.def, (def = defs.size));
    key += String.fromCharCode(letter(def), letter(m.hp), letter(m.group), m.band === undefined ? 0xffff : letter(m.band), (m.back ? 2 : 0) + (m.fled ? 1 : 0));
  }
  return key;
}

/**
 * Each fight of a group alone or with up to two more of its map's, in the map's order, that seats apart
 * from every one given before it: `seat` places a fight's monsters as the suite's resolver does.
 */
export function* seatedFights<M extends Every>(maps: readonly { id: string; encounters?: readonly Group[] }[], seat: (groups: readonly Group[]) => M[]): Generator<Fight<M>> {
  const seen = new Set<string>(), defs = new Map<object, number>();
  for (const map of maps) {
    const es = map.encounters ?? [], n = es.length;
    // Each group by its like: groups with the same monsters and back rank seat alike, numbered as first met.
    const likes = new Map<string, number>();
    const like = es.map((e) => {
      const what = `${e.monsters.join(',')}/${e.back ?? 0}`;
      let k = likes.get(what);
      if (k === undefined) likes.set(what, (k = likes.size));
      return k;
    });
    const u = likes.size;
    // next[p * u + k]: the first place at p or after it that holds a group of like k, or -1.
    const next = new Int32Array((n + 1) * u).fill(-1);
    for (let p = n - 1; p >= 0; p--) { next.copyWithin(p * u, (p + 1) * u, (p + 2) * u); next[p * u + like[p]] = p; }
    // How many monsters the last fight met seated: a seat places a fight's groups in order up to its
    // most, so a group of monsters that adds none means the fight is full and no group after it adds any.
    let size = 0;
    const met = (places: number[]): Fight<M> | undefined => {
      const groups = places.map((p) => es[p]), seated = seat(groups), key = seatKey(seated, defs);
      size = seated.length;
      if (seen.has(key)) return undefined;
      seen.add(key);
      return { map: map.id, groups, seated };
    };
    for (let a = 0; a < u; a++) {
      const p = next[a];
      let f = met([p]);
      if (f) yield f;
      const one = size;
      for (let b = 0; b < u; b++) {
        const q = next[(p + 1) * u + b];
        if (q < 0) continue;
        if ((f = met([p, q]))) yield f;
        if (size === one && es[q].monsters.length) break;
        const two = size;
        for (let c = 0; c < u; c++) {
          const r = next[(q + 1) * u + c];
          if (r < 0) continue;
          if ((f = met([p, q, r]))) yield f;
          if (size === two && es[r].monsters.length) break;
        }
      }
    }
  }
}
