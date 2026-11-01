// Save and load. The save is the world state, the party and the rng state; content is never saved,
// so a map edit shows up in an old save the next time it is loaded. localStorage in the browser;
// tests pass their own store. `SAVE_VERSION` is the save's version, which the upgrades of
// game/upgrades.ts bring an older save to on load; a save that will not load gives its reason
// (`load`, #945).
import type { WorldState } from './world.ts';
import type { Party } from './party.ts';
import { UPGRADES } from './upgrades.ts';
import type { Upgrade } from './upgrades.ts';

/**
 * 6: the Deepthorn's hermit has a flag of his own and `q_hermit` is Merryn's (#941). 5: a save that
 * stood at the Peak Stone is given the flag the Core's door asks (#751). 4: a
 * blessing may keep an element off a member (#555). 3: Vask is only refused (#452). 2: the outdoors
 * is one map and exploration is kept in bits. An older save still loads: deserialize brings it up
 * to date, one registered upgrade a version (game/upgrades.ts). A bump comes with its upgrade, and
 * with the shipped files regenerated (tools/shipped.ts), each area's and the central one.
 */
export const SAVE_VERSION = 6;
export const SAVE_KEY = 'hearth-of-caldera.save';
/** The slot the game fills of its own accord (`autosave`); F5 never touches it, and it never touches F5's. */
export const AUTOSAVE_KEY = 'hearth-of-caldera.autosave';

export interface SaveData {
  version: number;
  savedAt: number;
  rng: number;
  world: WorldState;
  party: Party;
}

export interface Store { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void; }

export function serialize(world: WorldState, party: Party, rngState: number): string {
  const data: SaveData = { version: SAVE_VERSION, savedAt: Date.now(), rng: rngState, world, party };
  return JSON.stringify(data);
}

export function deserialize(text: string): SaveData {
  let data: SaveData;
  // The engine's own words for bad text name marks the font has not got, and differ by browser (#945).
  try { data = JSON.parse(text) as SaveData; } catch { throw new Error('the text in storage is not a save'); }
  if (typeof data !== 'object' || data === null || typeof data.version !== 'number') throw new Error('the text in storage is not a save');
  if (!(data.version >= 1 && data.version <= SAVE_VERSION)) throw new Error(`save version ${data.version} is not one this build reads (1 to ${SAVE_VERSION})`);
  return upgrade(data);
}

/** Bring a save up to version `to`, running each upgrade in turn by the version it brings the save to. */
export function upgrade(data: SaveData, upgrades: Readonly<Record<number, Upgrade>> = UPGRADES, to = SAVE_VERSION): SaveData {
  for (let v = data.version + 1; v <= to; v++) {
    const up = upgrades[v];
    if (!up) throw new Error(`no upgrade brings a save to version ${v}`);
    data = { ...up(data), version: v };
  }
  return data;
}

export function browserStore(): Store | null {
  try { const s = window.localStorage; s.getItem(SAVE_KEY); return s; } catch { return null; }
}

export function save(store: Store, world: WorldState, party: Party, rngState: number, key = SAVE_KEY): boolean {
  try { store.setItem(key, serialize(world, party, rngState)); return true; } catch { return false; }
}

/** The game's own checkpoint, in a slot apart from the player's (see `AUTOSAVE_KEY`). */
export function autosave(store: Store, world: WorldState, party: Party, rngState: number): boolean { return save(store, world, party, rngState, AUTOSAVE_KEY); }

/**
 * The save in storage, brought up to date: the newer of the player's save and the autosave that reads.
 * Null with none; or, for one that will not load, the reason why, for the player (#945).
 */
export function load(store: Store): SaveData | string | null {
  let best: SaveData | null = null, why: string | null = null;
  for (const key of [SAVE_KEY, AUTOSAVE_KEY]) {
    try {
      const t = store.getItem(key);
      if (!t) continue;
      const d = deserialize(t);
      if (!best || d.savedAt > best.savedAt) best = d;
    } catch (e) { why ??= e instanceof Error ? e.message : String(e); }
  }
  return best ?? why;
}

export function hasSave(store: Store | null): boolean { return !!store && !!(store.getItem(SAVE_KEY) || store.getItem(AUTOSAVE_KEY)); }
