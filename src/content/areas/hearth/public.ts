// The way into Hearth Isle from another area, and the only one (#992; EXPANSION §8.2): the flags and
// exits the others take, declared here and imported back by the files they stood in, and every item by name.

// From maps/core.ts.
/** The voice at the panel, met (§4.8). */
export const VOICE_WHOLE = 'q_voice_whole';
/** Hild's at Gullwick after an ending (the road behind's, #765): Wenna stays at the Heart until it holds. */
export const WENNA_HOME = 'q_wenna_home';
/** The Queen's signet, off Vask's finger: every answer at the panel gives it (64). */
export const SIGNET = 'queens_signet';

// From maps/underdeep.ts.
/** The CREW ONLY door opened from the inside and left open (60), by its answer. */
export const CREW_OPEN = 'q_crew_open';
/** The CREW ONLY door opened, gone through and shut behind (60), by its answer. */
export const CREW_SHUT = 'q_crew_shut';
/** The crack the Sunder made, sealed with the knocker's hammer (61). */
export const CRACK_SEALED = 'q_crack_sealed';
/** The crack widened onto the Lanterns' hall the Sunder swallowed (61). */
export const CRACK_WIDE = 'q_crack_wide';

// Every item by name, with the rest of items.ts.
export * from './items.ts';
