// The ink every drawing in src/ui is outlined in, and the ink line under its colour that the rooms
// draw a rail, a pole or a strap with. Part of the paint kit (#983); a family or a scene takes it
// when it is next edited, and the copies stay until then (EXPANSION §8.1).

/** The ink: the outline of the monsters and the rooms, and the brush's own by default. */
export const INK = '#120c14';

/**
 * A rod along `pts`: the ink `inkWidth` wide, then `colour` over it `width` wide, each a round-capped
 * line. The two widths are the call's, as a scene writes the pair (`line(ctx, P, INK, 5)` and then
 * `line(ctx, P, colour, 3)` on the same points), so taking it is a rewrite of the pair and no change.
 */
export function rod(ctx: CanvasRenderingContext2D, pts: readonly number[], inkWidth: number, colour: string, width: number): void {
  for (const [c, w] of [[INK, inkWidth], [colour, width]] as const) {
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
    ctx.stroke();
  }
}
