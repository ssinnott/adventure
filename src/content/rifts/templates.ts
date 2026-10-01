// The eight Rift templates (DESIGN §4): rooms 12 by 12 with the tear at their heart, read by
// game/rifts.ts, which says what each mark is. The cellar's and the Grove's hand-built Rifts are
// what they follow: rings of corridor, a door or two, the warden beside the tear and its hoard.
import type { RiftTemplate } from '../../game/rifts.ts';

/** Two rings of corridor round the heart, the inner one shut by a door. */
export const RING: RiftTemplate = { id: 'ring', rows: [
  '############',
  '#<....?....#',
  '#.########.#',
  '#.#?.1...#.#',
  '#.#.####.#.#',
  '#.#.#$*#.#2#',
  '#.#.#.WD.#.#',
  '#.#.####.#.#',
  '#.#3.....#.#',
  '#.###D####.#',
  '#?....4....#',
  '############',
] };

/** One corridor, wound inward to the heart. */
export const SPIRAL: RiftTemplate = { id: 'spiral', rows: [
  '############',
  '#<...1....?#',
  '##########.#',
  '#?.......#.#',
  '#.######.#2#',
  '#.#$*W.#.#.#',
  '#.#.####.#.#',
  '#.#..3...#.#',
  '#.########.#',
  '#....4.....#',
  '#?########.#',
  '############',
] };

/** Four corner rooms on a cross, the heart at its middle. */
export const CROSS: RiftTemplate = { id: 'cross', rows: [
  '############',
  '#?.1#?.#.2?#',
  '#...#..#...#',
  '#...D..D...#',
  '#####..#####',
  '#..D.$*.D..#',
  '#.3#..W.#4.#',
  '#####..#####',
  '#...D..D...#',
  '#?..#..#..?#',
  '#<..#..#...#',
  '############',
] };

/** A pillared hall, and the heart in a room below it. */
export const HALL: RiftTemplate = { id: 'hall', rows: [
  '############',
  '#<..?......#',
  '#.o..o..o..#',
  '#..1.....2.#',
  '#.o..o..o..#',
  '#..........#',
  '####.##.####',
  '#?..D..D..?#',
  '#.3.#..#.4.#',
  '#...#$*W...#',
  '#...#......#',
  '############',
] };

/** Small rooms opening one into the next. */
export const CELLS: RiftTemplate = { id: 'cells', rows: [
  '############',
  '#<.#?.#..#?#',
  '#..D..D.1D.#',
  '#..#..#..#.#',
  '##D##D####D#',
  '#2.#..#..#.#',
  '#..D.$*W.D3#',
  '#?.#..#..#.#',
  '##D######D##',
  '#....#4....#',
  '#?...D....?#',
  '############',
] };

/** Two ways round, through either side door, to the heart. */
export const FORK: RiftTemplate = { id: 'fork', rows: [
  '############',
  '#?...<....?#',
  '#.########.#',
  '#.#1....2#.#',
  '#.#.####.#.#',
  '#.D.#$*#.D.#',
  '#.#.#.W#.#.#',
  '#.#.##D#.#.#',
  '#.#3.....#.#',
  '#.#######4.#',
  '#?.........#',
  '############',
] };

/** Long galleries switching back and forth. */
export const GALLERY: RiftTemplate = { id: 'gallery', rows: [
  '############',
  '#<....1...?#',
  '########.###',
  '#?..2......#',
  '#.##########',
  '#....3....?#',
  '##########.#',
  '#?.$*W.4...#',
  '#.########.#',
  '#..........#',
  '############',
  '############',
] };

/** Broken rooms and a breach in them. */
export const BREACH: RiftTemplate = { id: 'breach', rows: [
  '############',
  '#<..?..##..#',
  '#.####.##.1#',
  '#.#..#....##',
  '#.#2.###D###',
  '#.#..#*W..?#',
  '#..D.#$...##',
  '#?####..##.#',
  '#...#.....3#',
  '##.##..##..#',
  '#4.....?#..#',
  '############',
] };

export const TEMPLATES: readonly RiftTemplate[] = [RING, SPIRAL, CROSS, HALL, CELLS, FORK, GALLERY, BREACH];
