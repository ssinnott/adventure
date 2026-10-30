// What a screen is and what it may ask of the app (#1022): `Screen`, which the game's stack holds
// and steps once a tick, and `Host`, what of the game a screen reads and calls, which `Game`
// (app/game.ts) implements; with `TextInput`, the keyboard's text mode as a screen takes it. The
// screens are written against the host, so no file of src/ui names the app.
import type { Rng } from '../lib/engine/rng.ts';
import type { World, LiveGroup } from '../game/world.ts';
import type { Party } from '../game/party.ts';
import type { Person } from '../game/people.ts';
import type { Feature } from '../game/mapdef.ts';
import type { Store } from '../game/save.ts';
import type { Tables } from '../game/tables.ts';
import type { Action } from './actions.ts';
import type { ViewMonster } from './viewport.ts';

export interface Screen {
  /** Called once per fixed step with the next queued action (or null). */
  update(g: Host, a: Action | null): void;
  render(g: Host, ctx: CanvasRenderingContext2D, frame: number): void;
  /** Whether the frame (party cards, automap) is drawn beneath. */
  readonly overlay?: boolean;
  /** Whether it paints the view's rect whole, as a fight's backdrop does, so a screen beneath leaves the view undrawn (#1073). */
  readonly paintsView?: boolean;
}

/** The keyboard's text mode, as a screen that takes typed text uses it (app/input.ts's `Input`). */
export interface TextInput {
  textMode: boolean;
  /** The keys typed in the text mode, where the pilot types a riddle's word too (#721). */
  typed?: string[];
  drainText(current: string, max?: number): string;
}

/** What a screen may ask of the app (`Game`): what the screens read and call, and no more. */
export interface Host {
  push(s: Screen): void;
  pop(): void;
  say(line: string): void;
  readonly tables: Tables;
  readonly party: Party;
  readonly world: World;
  readonly rng: Rng;
  readonly store: Store | null;
  /** The keyboard, for the screens that take typed text; null where there is none. */
  readonly input: TextInput | null;
  readonly log: readonly string[];
  /** Lines ever said, of which the log keeps the last 60. */
  readonly said: number;
  /** What had been said when the party's last action began. */
  actionFrom: number;
  readonly screens: readonly Screen[];
  /** The party member the sheet opens on. */
  selected: number;
  /** The quest the log opens on. */
  questFocus: string;
  /** Whether a game for watching plays (attract mode, #722). */
  readonly attracting: boolean;
  /** Whether fights are played at once: the combat screen's delays count as none. */
  readonly instant: boolean;
  /** Whether the pilot's band is up over the view. */
  readonly bandUp: boolean;
  newGame(seed: number, party?: Party): void;
  loadGame(): true | string;
  saveGame(): void;
  attract(): void;
  gameOver(): void;
  enterCell(): void;
  interact(f: Feature, stepped?: boolean): void;
  parley(id: string): void;
  fight(groupIds: string[]): void;
  offerRest(): void;
  talkScreen(p: Person): Screen;
  leave(at: { x: number; y: number }): void;
  afterCombat(groupIds: string[], outcome: 'victory' | 'defeat' | 'fled'): void;
  /** The monsters the viewport draws at a cell. */
  readonly monstersAt: (x: number, y: number) => ViewMonster[] | null;
  /** The monsters the viewport draws for a live group, or none for no group: what `monstersAt` draws for the group at its cell. */
  readonly monstersOf: (g: LiveGroup | undefined) => ViewMonster[] | null;
}
