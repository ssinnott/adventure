// Boot: canvas, input, the fixed-step loop, and the debug hook the headless checks read.
import { createCanvas } from './lib/engine/canvas.ts';
import { createLoop } from './lib/engine/loop.ts';
import { setTextDefaults } from './lib/engine/text.ts';
import { Game } from './game/game.ts';
import { Input, is } from './input.ts';
import { Pilot } from './game/pilot/pilot.ts';
import type { Tempo } from './game/pilot/pilot.ts';
import { INK } from './ui/palette.ts';

setTextDefaults({ shadowColor: INK, outline: INK });

const { ctx, canvas } = createCanvas('stage', { width: 640, height: 360 });
canvas.focus();
// A tap or a click focuses the canvas, and in attract mode ends it as a key does: a phone has no key to press (#722).
canvas.addEventListener('pointerdown', () => { canvas.focus(); if (game.attracting) input.push('cancel'); });

const input = new Input(window);
const game = new Game();
game.input = input;
game.pilot = new Pilot();

// P hands the game to the pilot and takes it back, and T sets its tempo, before any screen sees the
// key (epic #713, Decided 9). Any other key while it drives takes the game back and is then handled
// as usual; with no key, the pilot's own, if it has one this tick.
const loop = createLoop({
  update() {
    const a = input.next();
    if (a && game.pilot) {
      if (is(a, 'pilot')) { game.pilot.toggle(game); return; }
      if (is(a, 'tempo')) { game.pilot.stopped = null; game.pilot.tempo = game.pilot.tempo === 4 ? 1 : (game.pilot.tempo * 2 as Tempo); return; }
      if (game.pilot.on) game.pilot.toggle(game);
    }
    game.update(a ?? game.pilot?.next(game) ?? null);
  },
  render() { game.render(ctx); },
});
loop.start();

// The headless check reads these: `ready` proves the module graph loaded and the first frame drew.
window.__game = { ready: true, errors: window.__game?.errors ?? [], game };
