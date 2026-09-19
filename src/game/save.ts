// Save and load. The save is the world state, the party and the rng state; content is never saved,
// so a map edit shows up in an old save the next time it is loaded. localStorage in the browser;
// tests pass their own store.
import type { WorldState } from './world.ts';
import type { Party } from './party.ts';

export const SAVE_VERSION = 1;
export const SAVE_KEY = 'hearth-of-caldera.save';

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
  const data = JSON.parse(text) as SaveData;
  if (data.version !== SAVE_VERSION) throw new Error(`save version ${data.version} is not ${SAVE_VERSION}`);
  return data;
}

export function browserStore(): Store | null {
  try { const s = window.localStorage; s.getItem(SAVE_KEY); return s; } catch { return null; }
}

export function save(store: Store, world: WorldState, party: Party, rngState: number): boolean {
  try { store.setItem(SAVE_KEY, serialize(world, party, rngState)); return true; } catch { return false; }
}

export function load(store: Store): SaveData | null {
  try { const t = store.getItem(SAVE_KEY); return t ? deserialize(t) : null; } catch { return null; }
}

export function hasSave(store: Store | null): boolean { return !!store && !!store.getItem(SAVE_KEY); }
