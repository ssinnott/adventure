// The pilot (epic #713; docs/PILOT.md): a mode that plays the game for watching. It lives on the
// Game, outside the save, built by src/main.ts or a test; it reads the world only through `Known`
// (known.ts) and presses the keys a player would, one action a paced tick, through `Game.update`.
// This is its frame: on and off, the tempo, the why line, the fights handed to the bot and the boxes
// closed. Which key it presses on the map is the brains' to say, each in a module of its own.
import type { Game } from '../game.ts';
import type { Action } from '../../input.ts';
import { CombatScreen } from '../../ui/combat.ts';
import { MessageScreen } from '../../ui/screens.ts';
import { TitleScreen } from '../../ui/title.ts';
import { CreateScreen, randomParty } from '../../ui/create.ts';
import { freshSeed } from '../../lib/engine/rng.ts';
import { knownOf } from './known.ts';
import type { Known } from './known.ts';
import { route, unroute } from './route.ts';
import type { Goal } from './route.ts';
import { keep } from './keep.ts';

export type Tempo = 1 | 2 | 4;
export interface PilotOpts { instant?: boolean; omniscient?: boolean }
/**
 * A brain: the key it would press now, or null to leave the turn to the next. A brain returns null
 * unless the screen it works on is on top: route and explore only on the ExploreScreen; talk and keep
 * also on the screens they answer. The frame asks every brain whatever is on top.
 */
export type Brain = (g: Game, k: Known, p: Pilot) => Action | null;

/**
 * The brains, asked in this order and the first key given pressed: fight, keep (#719), aims (#720),
 * route (#717), explore (#718), talk (#721). Each slot is absent until its module lands.
 */
export const BRAINS: readonly Brain[] = [
  keep,
  route,
];

/** The lines the heard corpus keeps, the oldest dropped first. */
export const HEARD_MAX = 2000;
/** The ticks between two actions at 1×, four a second at 60 Hz; 2× and 4× divide it (15, 8 and 4 ticks). */
const PACE = 15;

export class Pilot {
  on = false;
  tempo: Tempo = 1;
  /** Tests and the headless run: no delays, an action every tick. */
  readonly instant: boolean;
  /** The headless run only (#723): Known answers seen() true everywhere. Never set in the game. */
  readonly omniscient: boolean;
  /** The two why lines, drawn in the band over the top of the view (Game.render). */
  why: [string, string?] = ['Nothing to do.'];
  /** The brains this pilot asks: `BRAINS`, unless a test names its own. */
  brains: readonly Brain[] = BRAINS;
  /** What it has heard (Known.heard): through `hear`, the last `HEARD_MAX` lines. */
  readonly heard: string[] = [];
  /** The why line of a stop it made itself (a wipe, the ending's choice), kept up in the band until the next key. */
  stopped: [string, string?] | null = null;
  /** Where the navigator is bound (route.ts, #717): set by a brain or a test, null on arrival or when no way is seen. */
  goal: Goal | null = null;
  /** The keys left of the navigator's route to `goal`, the next first: emptied to plan afresh. */
  plan: Action[] = [];
  /** The squares a goal was found shut at (three blocks on it), each with the line said there: the explorer's to read (#718). */
  readonly shut: { map: string; x: number; y: number; why: string }[] = [];
  /** Ticks counted since it took the helm, for the pace. */
  private ticks = 0;
  /** The fight last handed to the bot: each is handed once. */
  private handed: CombatScreen | null = null;

  constructor(opts: PilotOpts = {}) {
    this.instant = opts.instant ?? false;
    this.omniscient = opts.omniscient ?? false;
  }

  hear(line: string): void {
    this.heard.push(line);
    if (this.heard.length > HEARD_MAX) this.heard.splice(0, this.heard.length - HEARD_MAX);
  }

  /**
   * A new company has heard nothing and is bound nowhere: a new game or a load empties the corpus, the
   * goal, its plan and the squares found shut (Game.newGame, Game.loadGame).
   */
  forget(): void { this.heard.length = 0; this.goal = null; this.plan = []; this.shut.length = 0; unroute(this); }

  /**
   * Turns on or off; says the line. Off, a fight on top goes back to its keys. On with no game under
   * way (the title or the company screen), it starts one on a fresh seed with a company drawn from
   * that seed (epic #713, Decided 11); on in a fight, the bot takes it.
   */
  toggle(g: Game): void {
    this.stopped = null;
    if (this.on) {
      this.on = false;
      // The viewer may walk anywhere: the goal and its plan go with the helm.
      this.goal = null;
      this.plan = [];
      unroute(this);
      if (g.top instanceof CombatScreen) g.top.auto = false;
      g.say('You take the helm.');
      return;
    }
    if (g.top instanceof TitleScreen || g.top instanceof CreateScreen) { const seed = freshSeed(); g.newGame(seed, randomParty(seed)); }
    this.on = true;
    this.ticks = 0;
    this.handed = null;
    this.why = ['Nothing to do.'];
    if (g.top instanceof CombatScreen) { g.top.auto = true; this.handed = g.top; }
    g.say('The pilot takes the helm.');
  }

  /** Gives the helm back by itself, saying why: the band keeps `why` up until the next key (Game.update, src/main.ts). */
  stop(g: Game, why: [string, string?]): void {
    if (this.on) this.toggle(g);
    this.why = why;
    this.stopped = why;
  }

  /** What the band over the view shows: the why line and the tempo while it drives, a stop's why line until the next key, else nothing. */
  band(): { lines: [string, string?]; tag: string } | null {
    if (this.on) return { lines: this.why, tag: `PILOT ${this.tempo}X` };
    return this.stopped ? { lines: this.stopped, tag: '' } : null;
  }

  /** The next key to press, or null for a tick of nothing. Called once per tick from main.ts and tests. */
  next(g: Game): Action | null {
    if (!this.on) return null;
    if (!this.instant && ++this.ticks % Math.round(PACE / this.tempo) !== 0) return null;
    const top = g.top;
    // A fight is the bot's (#714), at the screen's own pace: handed over once, and left to it.
    if (top instanceof CombatScreen) {
      if (this.handed !== top) { top.auto = true; this.handed = top; }
      return null;
    }
    if (top instanceof MessageScreen) return 'interact';
    if (top instanceof TitleScreen || top instanceof CreateScreen) return null;
    const k = knownOf(g), said = this.why;
    for (const brain of this.brains) {
      const a = brain(g, k, this);
      if (a) return a;
    }
    // A brain that gave no key may still have said why (a need it cannot meet, #719); else nothing to do.
    if (this.why === said) this.why = ['Nothing to do.'];
    return null;
  }
}
