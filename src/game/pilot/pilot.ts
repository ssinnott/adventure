// The pilot (#713): the game playing itself, for watching. It presses the keys a player would, one
// a beat through Game.update, and reads the world only through Known (known.ts). P hands it the game
// and takes it back, T sets its pace, and any other key takes it back (press, from src/main.ts). A
// fight it hands to the bot (ui/combat.ts auto, game/bot.ts) and a message it reads and closes; for
// the rest it asks its brains in turn. Its why line, two at most, is drawn over the top of the view
// (Game.render), and a wipe's, or the ending's choice's, stays up over the screen. It lives on the
// Game and never in the save.
import type { Game } from '../game.ts';
import { ExploreScreen } from '../game.ts';
import type { Action } from '../../input.ts';
import { is } from '../../input.ts';
import type { Feature, Passage } from '../map.ts';
import type { Party } from '../party.ts';
import { CombatScreen } from '../../ui/combat.ts';
import { MessageScreen } from '../../ui/screens.ts';
import { TitleScreen } from '../../ui/title.ts';
import { knownOf } from './known.ts';
import type { Known } from './known.ts';
import { route } from './route.ts';
import type { Goal, Trip } from './route.ts';
import { explore } from './explore.ts';
import { keep } from './keep.ts';
import { aims } from './aims.ts';
import type { Aim } from './aims.ts';
import { talk, holdings } from './talk.ts';

export type Tempo = 1 | 2 | 4;
export interface PilotOpts { instant?: boolean; omniscient?: boolean }

/** A brain: the key it would press next, or null to leave the beat to the next brain. */
export type Brain = (g: Game, k: Known, p: Pilot) => Action | null;

/**
 * The brains, asked in this order each beat until one gives a key: the fight's, talk's (#721), which
 * answers every menu and riddle, the quartermaster's (#719), the strategist's (#720), the
 * navigator's (#717) and the explorer's (#718).
 */
export const BRAINS: Brain[] = [talk, keep, aims, route, explore];

/** The lines heard that the pilot keeps, the oldest dropped first. */
export const HEARD_MAX = 2000;
/** The why line with no brain to give a key, and none that gave up saying why. */
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
  /** Where the navigator is bound (route.ts): a square, on a map or a zone by its id, and what the why line calls it. */
  goal: Goal | null = null;
  /** The keys the navigator has left to press on the way, the next first: planned again when they run out, or the party is not where they put it. */
  plan: Action[] = [];
  /** The navigator's reckoning of its goal between beats (route.ts). */
  trip: Trip | null = null;
  /**
   * Ways refused the navigator three times on one goal, each once: the square, on the map as played,
   * and the line it was told there, '' when the log has lost it; and the count of the company's flags
   * as the explorer was told of it, which comes back to it once it can open it (explore.ts).
   */
  readonly shut: { map: string; x: number; y: number; why: string; flags?: number }[] = [];
  /** The walls the explorer has searched, each from one side: "map:x,y,f", on the map as played. */
  readonly searched = new Set<string>();
  /** A map or a zone the strategist wants explored (#720): the explorer walks it while it is on the map the party is on. */
  prefer: string | null = null;
  /** The wells the quartermaster has stood on, "map:x,y", and whether the company stood there whole (keep.ts). */
  readonly wells = new Map<string, boolean>();
  /** An inn's room or rations the company could not pay for, "map:x,y:need", and the gold it had then: not sought there again until it has more (keep.ts). */
  readonly short = new Map<string, number>();
  /** What the strategist is set on (aims.ts): a quest's goal on its map, a level in a zone, or a map to walk. */
  aim: Aim | null = null;
  /** The world's minutes when the aim was set: three days on one goal, and it is lost. */
  aimSince = 0;
  /** The goal's words when the aim was set: the quest's, or for a level the quest's it levels for; '' for a walk. */
  aimGoal = '';
  /** The goals given up as lost, by their words, with the company's levels, all its members' together, and its flags then: tried again once it has more of either. */
  readonly lost = new Map<string, { levels: number; flags: number }>();
  /** Where the party stood at the last beat on the street, then the beat before, and in which zone: the square before a crossing (aims.ts). */
  trail: { map: string; x: number; y: number; zone?: string }[] = [];
  /** The maps and zones the explorer had nothing more to walk in as the strategist sent it there, with the company's flags then: not walked again until it has more (aims.ts). */
  readonly walked = new Map<string, number>();
  /** The chests it has seen and found no way to, "map:x,y" on the map as played, with the company's flags then: not sought again until it has more (aims.ts). */
  readonly chests = new Map<string, number>();
  /** The people it has met, "map:x,y:name" on the map as played, a tavern holding several on one square, and what the company held then (holdings): met again once it holds more; and the guilds gone into, with the gold it had then (talk.ts). */
  readonly met = new Map<string, number>();
  /** The crossings it has been offered, each from the seller's square on the map as played, and the gold it had when it could not pay the fare over its reserve: not taken again until it has more (talk.ts). */
  readonly offers: { map: string; x: number; y: number; passage: Passage; short?: number }[] = [];
  /** The words it has tried on each statue's riddle, "map:x,y" on the map as played, each once (talk.ts). */
  readonly tried = new Map<string, Set<string>>();
  /** The riddle each statue put, by its square as `tried` keeps it, as it was heard. */
  readonly riddles = new Map<string, string>();
  /** The why a brain said as it gave no key (a goal given up): it stays up until a brain presses one. */
  private kept: [string, string?] | null = null;
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

  /** A person met (Game.talkScreen), on the map as played, and what the company holds after their words. */
  meet(map: string, f: { x: number; y: number; name: string }, party: Party): void { this.met.set(`${map}:${f.x},${f.y}:${f.name}`, holdings(party)); }

  /** A seller's crossings offered (Game.offer), from their square on the map as played: each kept once. */
  offered(map: string, x: number, y: number, routes: readonly Passage[]): void {
    for (const passage of routes) if (!this.offers.some((o) => o.map === map && o.x === x && o.y === y && o.passage === passage)) this.offers.push({ map, x, y, passage });
  }

  /** A new company, or one loaded: it has heard nothing, been shown nothing, searched nothing, tried no well, been short nowhere, is set on nothing, has lost no goal, met nobody, been offered no crossing, tried no riddle and is bound nowhere yet, and the last run's stop and its why are gone. */
  forget(): void {
    this.heard.length = 0; this.told = new WeakSet<Feature>(); this.stopped = false; this.why = [IDLE];
    this.goal = null; this.plan = []; this.trip = null; this.shut.length = 0; this.searched.clear(); this.prefer = null;
    this.wells.clear(); this.short.clear();
    this.aim = null; this.aimSince = 0; this.aimGoal = ''; this.lost.clear(); this.trail = []; this.walked.clear(); this.chests.clear();
    this.met.clear(); this.offers.length = 0; this.tried.clear(); this.riddles.clear();
  }

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
    if (top instanceof ExploreScreen) {
      const st = g.world.state;
      this.trail = [{ map: st.mapId, x: st.x, y: st.y, zone: g.world.zone?.id }, ...this.trail.slice(0, 1)];
    }
    const k = knownOf(g), was = this.why;
    // A brain that turned it off (talk, at the ending's choice) ends the beat.
    for (const brain of BRAINS) {
      const a = brain(g, k, this);
      if (a || !this.on) return a;
    }
    if (this.why !== was) this.kept = this.why;
    else if (this.why !== this.kept) this.why = [IDLE];
    return null;
  }
}
