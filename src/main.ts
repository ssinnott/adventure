// Boot: canvas, input, the fixed-step loop, and the debug hook the headless checks read.
import { createCanvas } from './lib/engine/canvas.ts';
import { createLoop } from './lib/engine/loop.ts';
import { setTextDefaults } from './lib/engine/text.ts';
import { Game } from './game/game.ts';
import { Input } from './input.ts';
import { INK } from './ui/palette.ts';

setTextDefaults({ shadowColor: INK, outline: INK });

const { ctx, canvas } = createCanvas('stage', { width: 640, height: 360 });
canvas.focus();
canvas.addEventListener('pointerdown', () => canvas.focus());

const input = new Input(window);
const game = new Game();
game.input = input;

const loop = createLoop({
  update() { game.update(input.next()); },
  render() { game.render(ctx); },
});
loop.start();

// The headless check reads these: `ready` proves the module graph loaded and the first frame drew.
window.__game = { ready: true, errors: window.__game?.errors ?? [], game };
