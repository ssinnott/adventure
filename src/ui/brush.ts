// A minimal ShadeTarget: what the engine's cel helpers (celBall, celCapsule, celPoly, band...) need
// in order to paint, without owning a rig. One brush per sprite family; `flash` sets the white
// override for a hit frame. Light is top-left in screen space, like the rigs.
import type { ShadeTarget, Tones } from '../lib/art/shading.ts';
import { RAMP, LIGHT_X, LIGHT_Y } from '../lib/art/shading.ts';

export interface Brush extends ShadeTarget {
  override: string | null;
  flash(on: boolean): void;
}

export function makeBrush(outline = '#120c14', ow = 1): Brush {
  const b: Brush = {
    tones: new Map<string, Tones>(),
    ramp: RAMP,
    override: null,
    col(hex: string): string { return b.override ?? hex; },
    shading: true,
    light: { x: LIGHT_X, y: LIGHT_Y },
    outline,
    ow,
    contactAlpha: 0,
    tonesN: 3,
    // Sprites here are small; let parts a little narrower than the rig defaults still take a shadow band.
    thinR: 4, flatR: 3, hiMin: 6,
    flash(on: boolean) { b.override = on ? '#ffffff' : null; },
  };
  return b;
}

/** A small deterministic hash for "random but stable" detail (which brick is darker, which tuft where). */
export function hash(...n: number[]): number {
  let h = 0x811c9dc5;
  for (const v of n) { h ^= (v | 0) + 0x9e3779b9; h = Math.imul(h ^ (h >>> 15), 0x85ebca6b); h ^= h >>> 13; }
  return (h >>> 0) / 4294967296;
}
export function hashStr(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0) / 4294967296;
}
