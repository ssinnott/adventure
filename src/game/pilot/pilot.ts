// The pilot (epic #713; docs/PILOT.md): a mode that plays the game for watching. It lives on the
// Game, outside the save, built by src/main.ts or a test; it reads the world only through `Known`
// (known.ts) and presses the keys a player would, one action a paced tick, through `Game.update`.
// This is its frame: on and off, the tempo, the why line, the fights handed to the bot and the boxes
// closed. Which key it presses on the map is the brains' to say, each in a module of its own.
import type { Game } from '../game.ts';
import { ExploreScreen } from '../game.ts';
import type { Passage } from '../mapdef.ts';
import { isDown } from '../party.ts';
import type { Party } from '../party.ts';
import type { Action } from '../../input.ts';
import { CombatScreen } from '../../ui/combat.ts';
import { MessageScreen } from '../../ui/screens.ts';
import { TitleScreen } from '../../ui/title.ts';
import { CreateScreen } from '../../ui/create.ts';
import { knownOf } from './known.ts';
import type { Known } from './known.ts';
import { route, unroute } from './route.ts';
import type { Goal } from './route.ts';
import { keep } from './keep.ts';
import { explore } from './explore.ts';
import { aims, unaim } from './aims.ts';
import type { Aim } from './aims.ts';
import { talk, untalk } from './talk.ts';

export type Tempo = 1 | 2 | 4;
/** What a fled square is kept against (#723): the members' levels and the flags set. */
const gains = (p: Party): string => `${p.members.reduce((t, m) => t + m.level, 0)}|${Object.keys(p.flags).length}`;
export interface PilotOpts { instant?: boolean; omniscient?: boolean }
/**
 * A brain: the key it would press now, or null to leave the turn to the next. A brain returns null
 * unless the screen it works on is on top: route and explore only on the ExploreScreen; talk and keep
 * also on the screens they answer. The frame asks every brain whatever is on top.
 */
export type Brain = (g: Game, k: Known, p: Pilot) => Action | null;

/**
 * The brains, asked in this order and the first key given pressed: fight (the frame's), keep (#719),
 * talk (#721), aims (#720), route (#717), explore (#718), wait (#723). A brain that sets a goal asks `route` for its
 * first key itself, so the goal is walked from the tick it is set; talk walks its own goal to a person
 * so, every key of it, or the strategist, asked after, would set its own.
 */
/**
 * The watchdog (#723), asked last: with no key the clock stands with the pilot, so a group in the way
 * never moves and the lost rule never comes. After STUCK_TICKS on the map with no key from any brain,
 * a search where it stands passes ten minutes a press, until a brain has a key again.
 */
export const wait: Brain = (g, _k, p) => {
  if (!(g.top instanceof ExploreScreen) || !p.stuck) return null;
  p.why = ['Stuck: waiting a while.'];
  return 'search';
};

export const BRAINS: readonly Brain[] = [
  keep,
  talk,
  aims,
  route,
  explore,
  wait,
];

/** The lines the heard corpus keeps, the oldest dropped first. */
export const HEARD_MAX = 2000;
/** The ticks between two actions at 1×, four a second at 60 Hz; 2× and 4× divide it (15, 8 and 4 ticks). */
const PACE = 15;
/** The ticks on the map with no key from any brain before `wait` searches where it stands, to pass the time (#723): ten seconds at 60 Hz. */
export const STUCK_TICKS = 600;

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
  /** Whether it asks talk (#721): the quartermaster leaves a business's guild work and people to it, else leaves the business. */
  get talks(): boolean { return this.brains.includes(talk); }
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
  /**
   * The squares a fight was fled from (#723), each with the levels and flags then: the navigator goes
   * round each until the company stands whole again, or a level or a flag is gained.
   */
  readonly fled: { map: string; x: number; y: number; then: string }[] = [];

  // The explorer's (#718).
  /** The walls searched, each once from each side: "map:x,y,f", the map as played, the wall's square and the facing it was searched in. */
  readonly searched = new Set<string>();
  /** A map or a zone the strategist would have explored (#720 sets it; the explorer only reads it). */
  prefer: string | null = null;

  // The strategist's (#720).
  /** What the pilot is for now (aims.ts): a quest's goal, a level to reach or a map to walk; null to choose anew. */
  aim: Aim | null = null;
  /** The world's minutes (`WorldState.minutes`) when the aim was set. */
  aimSince = 0;
  /** The goal's words when the aim was set: a quest aim is chosen anew once the log shows other words. */
  aimGoal = '';
  /** The goals given up (their words): three days on one with no way on (the lost rule). */
  readonly lost = new Set<string>();

  // Talk's (#721).
  /** The people met, by square ("map:x,y", the map as played): each met again once the company has set a flag or gained an item since (talk.ts). */
  readonly met = new Set<string>();
  /** The crossings told (`Game.offer`, as its menu opened), each with its seller's square and the fare the menu showed: the navigator's edges (`routeMaps`). */
  readonly offers: { map: string; x: number; y: number; passage: Passage; fare: number }[] = [];
  /** The words tried at each statue's riddle, by square ("map:x,y", the map as played): each once, five at most (talk.ts). */
  readonly tried = new Map<string, Set<string>>();

  /** Ticks counted since it took the helm, for the pace. */
  private ticks = 0;
  /** The fight last handed to the bot: each is handed once. */
  private handed: CombatScreen | null = null;
  /** The ticks on the map since a brain last gave a key (the watchdog, #723). */
  private idle = 0;
  /** Where the party stood when the fight last handed to the bot began. */
  private fightAt: { map: string; x: number; y: number } | null = null;

  constructor(opts: PilotOpts = {}) {
    this.instant = opts.instant ?? false;
    this.omniscient = opts.omniscient ?? false;
  }

  hear(line: string): void {
    this.heard.push(line);
    if (this.heard.length > HEARD_MAX) this.heard.splice(0, this.heard.length - HEARD_MAX);
  }

  /**
   * Told of a seller's crossings as its menu opens (`Game.offer`): the routes it sells now, each with
   * the fare the menu shows, in place of what it sold before (#721).
   */
  told(map: string, x: number, y: number, routes: readonly { passage: Passage; fare: number }[]): void {
    const others = this.offers.filter((o) => o.map !== map || o.x !== x || o.y !== y);
    this.offers.length = 0;
    this.offers.push(...others, ...routes.map((r) => ({ map, x, y, passage: r.passage, fare: r.fare })));
  }

  /**
   * A new company has heard nothing and is bound nowhere: a new game or a load empties the corpus, the
   * goal, its plan and the squares found shut, the walls searched and the map preferred, the aim and
   * the goals given up, the people met, the crossings told and the words tried at the statues
   * (Game.newGame, Game.loadGame).
   */
  forget(): void {
    this.heard.length = 0; this.goal = null; this.plan = []; this.shut.length = 0; unroute(this);
    this.searched.clear(); this.prefer = null; this.fled.length = 0;
    this.aim = null; this.lost.clear(); unaim(this);
    this.met.clear(); this.offers.length = 0; this.tried.clear(); untalk(this);
  }

  /**
   * Turns on or off; says the line. Off, a fight on top goes back to its keys. On with no game under
   * way (the title or the company screen), it starts one on a fresh seed with a company drawn from
   * that seed (epic #713, Decided 11); on in a fight, the bot takes it.
   */
  toggle(g: Game): void {
    this.stopped = null;
    if (this.on) {
      this.on = false;
      // The viewer may walk anywhere: the goal and its plan go with the helm, and the aim is chosen anew.
      this.goal = null;
      this.plan = [];
      unroute(this);
      this.aim = null;
      if (g.top instanceof CombatScreen) g.top.auto = false;
      // In attract mode the game is not the viewer's to take: P pauses the show, and the next key leaves it (#722).
      g.say(g.attracting ? 'Paused. P plays on, any other key for the title.' : 'You take the helm.');
      return;
    }
    if (g.top instanceof TitleScreen || g.top instanceof CreateScreen) g.newRandomGame();
    this.on = true;
    this.ticks = 0;
    this.idle = 0;
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
    // A fight fled is remembered by its square (#723), and forgotten once the company is whole or stronger.
    if (this.handed && top !== this.handed) {
      if (this.handed.state.outcome === 'fled' && this.fightAt) this.fled.push({ ...this.fightAt, then: gains(g.party) });
      this.handed = null;
    }
    if (this.fled.length) {
      const whole = g.party.members.every((m) => !isDown(m) && m.hp >= m.maxHp), now = gains(g.party);
      for (let i = this.fled.length - 1; i >= 0; i--) if (whole || this.fled[i].then !== now) this.fled.splice(i, 1);
    }
    // A fight is the bot's (#714), at the screen's own pace: handed over once, and left to it.
    if (top instanceof CombatScreen) {
      if (this.handed !== top) { top.auto = true; this.handed = top; this.fightAt = { map: g.world.state.mapId, x: g.world.state.x, y: g.world.state.y }; }
      this.idle = 0;
      return null;
    }
    if (top instanceof MessageScreen) { this.idle = 0; return 'interact'; }
    if (top instanceof TitleScreen || top instanceof CreateScreen) return null;
    const k = knownOf(g), said = this.why;
    let first: [string, string?] | undefined;
    for (const brain of this.brains) {
      const a = brain(g, k, this);
      if (a) { if (brain !== wait) this.idle = 0; return a; }
      // A brain that stopped the pilot (every aim lost, the ending's choice) ends the tick: no brain after it presses a key, and its why line stands (#723).
      if (!this.on) return null;
      if (!first && this.why !== said) first = this.why;
    }
    // A brain that gave no key may still have said why (a need it cannot meet, #719; "Helmstow is
    // walked out.", #718): the first said stands, as the most urgent brain is asked first; else nothing to do.
    this.why = first ?? ['Nothing to do.'];
    if (top instanceof ExploreScreen) this.idle += this.instant ? 1 : Math.round(PACE / this.tempo);
    return null;
  }

  /** Whether no brain has given a key on the map for STUCK_TICKS (`wait`, #723). */
  get stuck(): boolean { return this.idle >= STUCK_TICKS; }
}
