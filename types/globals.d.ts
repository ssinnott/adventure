// Ambient globals. A plain script-scoped .d.ts (no top-level import/export), so the interfaces
// below merge with the DOM's rather than declaring a module of their own.

interface Window {
  /**
   * Debug surface, installed by the inline script in index.html before the module graph loads.
   * A headless harness polls `ready` and asserts `errors` is empty; `game` is the live game for
   * tests and the console.
   */
  __game?: {
    ready: boolean;
    errors: string[];
    game?: unknown;
  };
  /** Safari still ships the prefixed WebAudio constructors; src/lib/audio/facade.ts falls back to them. */
  webkitAudioContext?: typeof AudioContext;
  webkitOfflineAudioContext?: typeof OfflineAudioContext;
}
