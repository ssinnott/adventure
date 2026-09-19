// Shared primitive types for the game model. Nothing here draws or reads input.

/** Compass facing. Turning right adds 1 (mod 4). */
export type Facing = 0 | 1 | 2 | 3;
export const NORTH: Facing = 0, EAST: Facing = 1, SOUTH: Facing = 2, WEST: Facing = 3;
export const FACING_NAMES = ['N', 'E', 'S', 'W'] as const;
/** Unit step for each facing, x right and y DOWN (map rows). */
export const FACING_DX = [0, 1, 0, -1] as const;
export const FACING_DY = [-1, 0, 1, 0] as const;

export function turnRight(f: Facing): Facing { return ((f + 1) & 3) as Facing; }
export function turnLeft(f: Facing): Facing { return ((f + 3) & 3) as Facing; }
export function turnBack(f: Facing): Facing { return ((f + 2) & 3) as Facing; }

export interface Vec { x: number; y: number; }
export const manhattan = (ax: number, ay: number, bx: number, by: number): number => Math.abs(ax - bx) + Math.abs(ay - by);
