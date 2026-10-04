// Kiln-script (DESIGN §9; #434's call 2; #538), Act III's own mechanic. An inscription is a sign with
// a second text (`read`): its words are the marks anyone sees, and the reading is said after them only
// to a company with a reader, a standing member with Linguist, a dwarf, who is born to it, or anyone
// while the company carries an item that reads (game/skills.ts). Read, it is kept by its id in the
// map's `used`, as a once-event is, so a quest condition's `seen` names it and nothing new is saved;
// one that `marks` puts the atlas places it names on the world map. A reading may be a secret's hint,
// which the hint check counts (tools/tests/pillars.ts). It sets no flag and opens no door: it never
// opens the road (EXPANSION §2.2), only a hint, the shortcut a hint finds and the marks. Pure apart
// from the world handed in.
import type { Feature, GameMap } from './map.ts';
import type { Party, Character } from './party.ts';
import type { WorldState } from './world.ts';
import { skilled } from './skills.ts';

export type Sign = Extract<Feature, { kind: 'sign' }>;
/** A sign with a reading: an inscription in Kiln-script. */
export type Inscription = Extract<Sign, { read: string }>;

export const isInscription = (f: Feature): f is Inscription => f.kind === 'sign' && f.read !== undefined;

/** A sign as the log shows it. */
export const signLine = (text: string): string => `A sign reads: "${text}"`;
/** An inscription's reading as the log shows it, said by the member who reads it. */
export const readLine = (who: string, read: string): string => `${who} reads: "${read}"`;
/** Said the first time a reading marks the world map. */
export const markLine = (who: string): string => `${who} marks the world map.`;

/** Who reads Kiln-script for the company, if anyone does. */
export const readerOf = (party: Party): Character | undefined => skilled(party, 'linguist');

/** The atlas places an inscription's reading marks on the world map. */
export const marksOf = (f: Inscription): readonly string[] => (f.marks === undefined ? [] : typeof f.marks === 'string' ? [f.marks] : f.marks);

/** The id an inscription is kept read by in its map's `used`; none for any other feature. */
export const readId = (f: Feature): string | undefined => (isInscription(f) ? f.id : undefined);

/**
 * What a sign says as the log shows it: its words; and to a company with a reader, an inscription's
 * reading after them, which keeps it read, and the first time it marks the world map, the mark.
 */
export function signSays(world: { party: Party; used(id: string): boolean; markUsed(id: string): void }, f: Sign): string[] {
  const out = [signLine(f.text)];
  if (!isInscription(f)) return out;
  const who = readerOf(world.party);
  if (!who) return out;
  out.push(readLine(who.name, f.read));
  const first = !world.used(f.id);
  world.markUsed(f.id);
  if (first && marksOf(f).length) out.push(markLine(who.name));
  return out;
}

/**
 * Every text a sign can say at once, as a reader with the longest name hears it the first time: its
 * words, its reading and its mark, each an entry of the log (what tools/tests/pillars.ts measures).
 */
export function signTexts(f: Sign, name: string): string[] {
  if (!isInscription(f)) return [signLine(f.text)];
  return [signLine(f.text), readLine(name, f.read), ...(marksOf(f).length ? [markLine(name)] : [])];
}

/**
 * The atlas places marked on the world map: each named by an inscription the company has read, on the
 * maps as played, in their order and each once. Worked out from the save, so nothing new is saved.
 */
export function readMarks(world: { maps: Readonly<Record<string, GameMap>>; state: WorldState }): string[] {
  const out: string[] = [];
  for (const m of Object.values(world.maps)) for (const f of m.features) {
    if (!isInscription(f) || !marksOf(f).length || !world.state.maps[m.id]?.used[f.id]) continue;
    for (const p of marksOf(f)) if (!out.includes(p)) out.push(p);
  }
  return out;
}
