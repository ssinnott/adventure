// The pilot (#713): the game playing itself, for watching. It presses the keys a player would, one
// a beat through Game.update, and reads the world only through Known (known.ts). P hands it the game
// and takes it back, T sets its pace, and any other key takes it back (press, from src/main.ts). A
// fight it hands to the bot (ui/combat.ts auto, game/bot.ts) and a message it reads and closes; for
// the rest it asks its brains in turn. Its why line, two at most, is drawn over the top of the view
// (Game.render), and a wipe's stays up over the title. It lives on the Game and never in the save.
import type { Game } from '../game.ts';
import type { Action } from '../../input.ts';
import { is } from '../../input.ts';
import type { Feature } from '../map.ts';
import { CombatScreen } from '../../ui/combat.ts';
import { MessageScreen } from '../../ui/screens.ts';
import { TitleScreen } from '../../ui/title.ts';
import { knownOf } from './known.ts';
import type { Known } from './known.ts';

export type Tempo = 1 | 2 | 4;
export interface PilotOpts { instant?: boolean; omniscient?: boolean }

/** A brain: the key it would press next, or null to leave the beat to the next brain. */
export type Brain = (g: Game, k: Known, p: Pilot) => Action | null;

/**
 * The brains, asked in this order each beat until one gives a key: the fight's, the quartermaster's
 * (#719), the strategist's (#720), the navigator's (#717), the explorer's (#718) and talk (#721).
 * Each takes its place as its module lands.
 */
export const BRAINS: Brain[] = [];

/** The lines heard that the pilot keeps, the oldest dropped first. */
export const HEARD_MAX = 2000;
/** The why line with no brain to give a key. */
export const IDLE = 'Nothing to do.';

export class Pilot {
  on = false;
  tempo: Tempo = 1;
  /** Tests and the headless run: no delays, an action every tick, and a fight's timers count as nothing. */
  readonly instant: boolean;
  /** The headless run only (#723): Known answers seen() true everywhere. Never set in the game. */
  readonly omniscient: boolean;
  /** The two why lines, drawn over the top of the view while it is on. */
  why: [string, string?] = [IDLE];
  /** Turned off by its own hand (stop): its why line stays drawn until a game starts. */
  stopped = false;
  /** Every line said through Game.say, every message opened and every riddle put, the newest last. */
  readonly heard: string[] = [];
  /** What a menu has shown: a shop's wares, a trainer's levels, a person's crossings (Known.features). */
  told = new WeakSet<Feature>();
  /** Ticks counted towards the next beat. */
  private ticks = 0;
  /** The fight last handed to the bot: a key that took it back is not undone. */
  private fought: CombatScreen | null = null;

  constructor(opts: PilotOpts = {}) {
    this.instant = !!opts.instant;
    this.omniscient = !!opts.omniscient;
  }

  hear(line: string): void {
    this.heard.push(line);
    if (this.heard.length > HEARD_MAX) this.heard.shift();
  }

  /** A menu has shown what a feature lists. */
  tell(f: Feature): void { this.told.add(f); }

  /** A new company, or one loaded: it has heard nothing and been shown nothing yet, and the last run's stop and its why are gone. */
  forget(): void { this.heard.length = 0; this.told = new WeakSet<Feature>(); this.stopped = false; this.why = [IDLE]; }

  /** Turns itself off, and says why over every screen until a game starts (#713, Decided 4 and 10). */
  stop(why: string): void { this.on = false; this.why = [why]; this.stopped = true; }

  /**
   * A key pressed, before any screen has it (src/main.ts): P hands the game over or takes it back, T
   * sets the pace, and any other key takes it back and is the screen's. True when the key was the pilot's.
   */
  press(g: Game, a: Action): boolean {
    if (is(a, 'pilot')) { this.toggle(g); return true; }
    if (is(a, 'tempo')) { this.tempo = this.tempo === 4 ? 1 : (this.tempo * 2) as Tempo; return true; }
    if (this.on) this.toggle(g);
    return false;
  }

  /** Turns on or off; says the line. With no game going, on the title, P starts one at random (#713, Decided 11). */
  toggle(g: Game): void {
    if (!this.on && g.screens[0] instanceof TitleScreen) g.randomGame();
    this.on = !this.on;
    const top = g.top;
    if (top instanceof CombatScreen) top.auto = this.on;
    this.fought = this.on && top instanceof CombatScreen ? top : null;
    g.say(this.on ? 'The pilot takes the helm.' : 'You take the helm.');
  }

  /** The next key to press, or null for a tick of nothing. Called once per tick from main.ts and tests. */
  next(g: Game): Action | null {
    if (!this.on) return null;
    // A beat every 15, 8 or 4 ticks at 1, 2 or 4 times: 4, 7.5 or 15 keys a second at 60 Hz.
    if (!this.instant && ++this.ticks % Math.round(15 / this.tempo) !== 0) return null;
    const top = g.top;
    // The fight is the screen's own to play, on its own timer.
    if (top instanceof CombatScreen) {
      if (this.fought !== top) { top.auto = true; this.fought = top; }
      return null;
    }
    if (top instanceof MessageScreen) return 'interact';
    if (top instanceof TitleScreen) return null;
    const k = knownOf(g);
    for (const brain of BRAINS) {
      const a = brain(g, k, this);
      if (a) return a;
    }
    this.why = [IDLE];
    return null;
  }
}
