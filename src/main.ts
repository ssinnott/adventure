// Boot: canvas, input, the fixed-step loop, and the debug hook the headless checks read.
import { createCanvas } from './lib/engine/canvas.ts';
import { createLoop } from './lib/engine/loop.ts';
import { setTextDefaults } from './lib/engine/text.ts';
import { Game } from './game/game.ts';
import { Input } from './input.ts';
import { Pilot } from './game/pilot/pilot.ts';
import { INK } from './ui/palette.ts';

setTextDefaults({ shadowColor: INK, outline: INK });

const { ctx, canvas } = createCanvas('stage', { width: 640, height: 360 });
canvas.focus();
canvas.addEventListener('pointerdown', () => canvas.focus());

const input = new Input(window);
const game = new Game();
game.input = input;
game.pilot = new Pilot();

const loop = createLoop({
  // P and T are the pilot's before any screen's: P hands it the game and takes it back, T sets its
  // pace, and any other key takes the game back and is handled as usual (Pilot.press). Else the
  // pilot's key, if any.
  update() {
    const a = input.next();
    if (a && game.pilot?.press(game, a)) return;
    game.update(a ?? game.pilot?.next(game) ?? null);
  },
  render() { game.render(ctx); },
});
loop.start();

// The headless check reads these: `ready` proves the module graph loaded and the first frame drew.
window.__game = { ready: true, errors: window.__game?.errors ?? [], game };
