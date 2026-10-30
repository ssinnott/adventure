// The Game: owns the world, the party, the rng and a stack of screens, and dispatches one input
// action per fixed step to the top screen. Screens are small objects with update/render, each in
// ui/ and written against the Host (ui/screen.ts), which the Game implements (#1022).
import { freshSeed } from '../lib/engine/rng.ts';
import type { Rng } from '../lib/engine/rng.ts';
import { makeRng } from '../game/rng.ts';
import { World } from '../game/world.ts';
import { signSays } from '../game/inscriptions.ts';
import type { WorldState } from '../game/world.ts';
import { groupDrawn } from '../game/world.ts';
import { defaultParty, randomParty } from '../game/party.ts';
import { meet, answer, answerLabel, asked, barred, heard } from '../game/people.ts';
import type { Person } from '../game/people.ts';
import type { Party } from '../game/party.ts';
import { buildMaps } from '../content/maps.ts';
import type { GameMap } from '../game/map.ts';
import type { Feature, Interior, Choice, Passage, Teaching } from '../game/mapdef.ts';
import * as passage from '../game/passage.ts';
import * as prestige from '../game/prestige.ts';
import { startCombat } from '../game/combat.ts';
import { save as saveTo, load as loadFrom, browserStore, hasSave } from '../game/save.ts';
import type { Store } from '../game/save.ts';
import type { Action } from './input.ts';
import { monster } from '../game/monsters.ts';
import type { ViewMonster } from '../ui/viewport.ts';
import { ExploreScreen } from '../ui/explore.ts';
import { LAYOUT, drawFrameBackground } from '../ui/frame.ts';
import { HINT } from '../ui/palette.ts';
import { CombatScreen } from '../ui/combat.ts';
import { MessageScreen, ChoiceScreen, serviceScreen, InteriorScreen, learnerMenu, masterMenu } from '../ui/screens.ts';
import { questLog, questMarks, questNews } from '../game/quests.ts';
import { TitleScreen } from '../ui/title.ts';
import { EndingScreen } from '../ui/ending.ts';
import { endingTaken, endsIn } from '../game/stones.ts';
import { drawText } from '../lib/engine/text.ts';
import { RiddleScreen } from '../ui/riddle.ts';
import { stepLine, useShrine, openCairn, answerRiddle, restRefused, restAndWake, drinkWell, give, giftOf } from '../game/wilds.ts';
import { approach, burn } from '../game/dens.ts';
import { wakeAtChapel } from '../game/chapel.ts';
import type { Pilot } from './pilot/pilot.ts';
import type { Tables } from '../game/tables.ts';
import type { Host, Screen, TextInput } from '../ui/screen.ts';

/**
 * Attract mode's lines (#722): the band holds both over the pilot's own for the first three seconds,
 * then the second stands under the pilot's first line for as long as the game plays.
 */
const ATTRACT_WHY: readonly [string, string] = ['The pilot plays.', 'Any key for the title.'];
export const ATTRACT_HOLD = 60 * 3;

export class Game implements Host {
  world!: World;
  party!: Party;
  /** The Game's own generator (src/game/rng.ts, #1021): seeded by `newGame` and `loadGame`, its state saved, drawn on by no other Game. */
  readonly rng: Rng = makeRng();
  /** The tables the game reads, handed in by the app (src/main.ts: content's), and on to its world and fights (#973). */
  readonly tables: Tables;
  readonly store: Store | null;
  /** Set by main.ts; screens that take typed text need it. `typed` is the keys typed in the text mode, where the pilot types a riddle's word too (#721). */
  input: TextInput | null = null;
  log: string[] = [];
  /** Lines ever said. The log keeps only the last 60, so a screen that wants what was said since it opened counts from this. */
  said = 0;
  /** What had been said when the party's last action began: a visit that action opens shows the lines it said, a doorway's event among them. */
  actionFrom = 0;
  screens: Screen[] = [];
  /** Screens ever put on top (`push`): the pilot's navigator tells a refused step from one a fight or a visit put back. */
  shown = 0;
  frame = 0;
  /** The party member the sheet opens on. */
  selected = 0;
  /** The quest the log opens on: the last one to change, or the last one looked at. */
  questFocus = '';
  /** What the quest log held at the last look, so each change to it is announced once. */
  private questMarked = new Set<string>();
  maps: Record<string, GameMap> = buildMaps();
  /** The pilot (epic #713, docs/PILOT.md): src/main.ts builds one, as a test may; none otherwise. Never saved. */
  pilot: Pilot | null = null;
  /**
   * Attract mode (#722): the title sat idle and the pilot is playing a new game for watching, which
   * saves nothing (`saveGame`) and gives way to a key (`update`). Outside the save, like the pilot.
   */
  attracting = false;
  /** The frame attract mode began on, for its opening lines in the band. */
  private attractFrom = 0;
  /**
   * Where and when the company last fell (`fall`), before the Lanterns carried it: what a pilot's run
   * that ends in a wipe says it fell in (tools/kit/walk.ts, tools/kit/rules/fullrun.ts). Not saved; a
   * new game or a load clears it.
   */
  fell: { mapId: string; x: number; y: number; minutes: number } | null = null;

  constructor(tables: Tables, store: Store | null = browserStore()) {
    this.tables = tables; this.store = store;
    this.screens.push(new TitleScreen(hasSave(store)));
  }

  // ---- lifecycle ----
  newGame(seed: number, party?: Party): void {
    this.rng.seed(seed);
    this.maps = buildMaps();
    this.party = party ?? defaultParty(this.tables, this.rng);
    this.world = new World(this.tables, this.maps, this.party, this.rng);
    this.log = [];
    this.fell = null;
    this.pilot?.forget();
    this.screens = [new ExploreScreen()];
    this.say('Arrows move. Space acts. R rests, F searches, C casts, I inventory, J quests, F5/F9 save/load.');
    for (const m of this.world.eventsHere()) this.say(m);
    this.enterCell();
    this.markQuests();
  }

  /**
   * A new game on a fresh seed with a company drawn from that seed alone (epic #713, Decided 11): the
   * seed is picked first and the company built from it, so the seed replays the game (DESIGN §13). P
   * on the title (`Pilot.toggle`) and attract mode start one so.
   */
  newRandomGame(): void { const seed = freshSeed(); this.newGame(seed, randomParty(this.tables, seed)); }

  /**
   * Attract mode (DESIGN §1; #722): the title sat untouched, so a new game on a fresh seed plays itself
   * with the pilot at the helm, as P on the title starts one. It saves nothing (`saveGame`), a wipe
   * starts another on a new seed (`fall`) and a key of the viewer's brings the title back (`update`).
   * The game has no sound to mute. A Game with no pilot has none to start.
   */
  attract(): void {
    const p = this.pilot;
    if (!p) return;
    // The game before it is dropped whole, a riddle's text mode with it if one was open.
    if (this.input) this.input.textMode = false;
    this.newRandomGame();
    this.attracting = true;
    this.attractFrom = this.frame;
    p.on = true;
    p.why = [...ATTRACT_WHY];
  }

  /**
   * The end of attract mode: the title again, with the pilot off and the game that played let go; nothing
   * of it was saved. Its screens go without a word, so a riddle's text mode, which only the riddle
   * turns off, is turned off here, or the keys that move the party would go on being typed.
   */
  private wake(): void {
    if (this.input) this.input.textMode = false;
    this.screens = [new TitleScreen(hasSave(this.store))];
    this.attracting = false;
    if (this.pilot) this.pilot.on = false;
  }

  /** Loads the save in storage: true, or what the title's note and the load key's line say instead, the reason a save will not load among it (#945). */
  loadGame(): true | string {
    const data = this.store ? loadFrom(this.store) : null;
    if (data === null) return 'No save to load.';
    if (typeof data === 'string') return `The save could not be read: ${data}.`;
    // A save that reads but that this build cannot lay out (a map gone, a square under no region)
    // says why as well, and the game is left as it was (#945).
    const was = this.rng.state;
    this.rng.seed(data.rng);
    let world: World;
    try { world = new World(this.tables, buildMaps(), data.party, this.rng, data.world as WorldState); }
    catch (e) { this.rng.seed(was); return `The save could not be read: ${e instanceof Error ? e.message : String(e)}.`; }
    this.maps = world.maps;
    this.party = data.party;
    this.world = world;
    this.log = [];
    this.fell = null;
    this.pilot?.forget();
    this.screens = [new ExploreScreen()];
    this.say('Loaded.');
    // A save carries its quest log implicitly; take it as read rather than announcing it all again.
    this.markQuests();
    return true;
  }

  saveGame(): void {
    // The game for watching is nobody's: attract mode writes no save.
    if (this.attracting) return;
    if (!this.store) { this.say('No storage to save to.'); return; }
    this.say(saveTo(this.store, this.world.state, this.party, this.rng.state) ? 'Saved.' : 'Save failed.');
  }

  // ---- screens ----
  get top(): Screen { return this.screens[this.screens.length - 1]; }
  /** Puts a screen on top; a message box's words are heard by the pilot as it opens. */
  push(s: Screen): void { this.screens.push(s); this.shown++; if (s instanceof MessageScreen) this.pilot?.hear(s.text); }
  pop(): void { if (this.screens.length > 1) this.screens.pop(); }
  say(line: string): void { this.log.push(line); this.said++; if (this.log.length > 60) this.log.shift(); this.pilot?.hear(line); }
  message(text: string, then?: () => void): void { this.push(new MessageScreen(text, then)); }

  update(a: Action | null): void {
    this.frame++;
    // Any key takes down the band a stop of the pilot's left up (P and T do in src/main.ts).
    if (a && this.pilot) this.pilot.stopped = null;
    // Attract mode ends at a key of the viewer's, and the key is dropped. src/main.ts takes the helm
    // before a viewer's key reaches the game, so a key that finds the pilot at it is the pilot's own.
    if (a && this.attracting && !this.pilot?.on) { this.wake(); return; }
    this.top.update(this, a);
    // A visit ends the moment the last of its menus closes, so no frame shows the room without one,
    // and leaving a business is a return to exploring like any other.
    if (this.top instanceof InteriorScreen) this.top.close(this);
    if (!(this.top instanceof ExploreScreen)) return;
    // Whatever moved the clock (a step, a rest, the inn), the log says so once the party is back
    // to exploring and the sky has turned. The sky goes first, so a quest's news is the last word.
    const news = this.world.weatherNews(); if (news) this.say(news);
    // What a turn, an arrival, a load or a light has brought into sight, the first time it is seen.
    if (a) for (const look of this.world.sightings()) this.say(look);
    // Back to exploring after any action (a step, a chest, a closed dialogue or fight): say what
    // the quest log gained, under whatever the action itself said.
    if (a) this.checkQuests();
  }

  /**
   * What the band over the view carries: the pilot's (`Pilot.band`). While attract mode plays it says so
   * and how to leave: the opening lines for the first seconds, which the pilot's first action (a quarter
   * of a second at 1×) would replace, then the pilot's own first line over the way out.
   */
  band(): ReturnType<Pilot['band']> {
    const band = this.pilot?.band() ?? null;
    if (!band || !this.attracting || !this.pilot?.on) return band;
    return { ...band, lines: this.frame - this.attractFrom < ATTRACT_HOLD ? [...ATTRACT_WHY] : [band.lines[0], ATTRACT_WHY[1]] };
  }

  /** Whether fights are played at once (a pilot's `instant`: the tests' and the headless run's). */
  get instant(): boolean { return !!this.pilot?.instant; }
  /** Whether the pilot's band is up over the view: the explore screen's hint gives way to it. */
  get bandUp(): boolean { return !!this.pilot?.band(); }

  render(ctx: CanvasRenderingContext2D): void {
    drawFrameBackground(ctx);
    // Draw the exploration frame under any overlay screen.
    const base = this.screens.findIndex((s) => !s.overlay);
    for (let i = Math.max(0, base); i < this.screens.length; i++) this.screens[i].render(this, ctx, this.frame);
    // While the pilot drives, and after it stops itself until the next key, its why line in a band
    // over the top of the view, over every screen.
    const band = this.band(), v = LAYOUT.view;
    if (!band) return;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(v.x, v.y, v.w, 24);
    drawText(ctx, band.lines[0], v.x + 6, v.y + 4, { size: 1, color: HINT });
    if (band.lines[1]) drawText(ctx, band.lines[1], v.x + 6, v.y + 14, { size: 1, color: '#d8d0c0' });
    if (band.tag) drawText(ctx, band.tag, v.x + v.w - 6, v.y + 4, { size: 1, color: HINT, align: 'right' });
  }

  // ---- quests ----
  /** Announce each quest begun, advanced or finished since the last look. */
  private checkQuests(): void {
    const log = questLog(this.tables, this.world.state, this.party);
    for (const n of questNews(this.questMarked, log)) { this.say(n.text); this.questFocus = n.quest; }
    this.questMarked = questMarks(log);
  }

  private markQuests(): void {
    this.questMarked = questMarks(questLog(this.tables, this.world.state, this.party));
    this.questFocus = '';
  }

  // ---- exploration events ----
  /** What happens on arriving in a cell: features that trigger by standing on them. */
  enterCell(): void {
    const f = this.world.featureHere();
    if (f && f.x === this.world.state.x && f.y === this.world.state.y) this.interact(f, true);
  }

  /** Open the interaction for a feature. `stepped` is true when it was reached by walking on it. */
  interact(f: Feature, stepped = false): void {
    const w = this.world;
    switch (f.kind) {
      case 'sign': if (!stepped) for (const l of signSays(this.tables.items, w, f)) this.say(l); return;
      case 'well': for (const l of drinkWell(this.party, f)) this.say(l); return;
      case 'npc': this.talk(f); return;
      case 'chest': {
        if (stepped) { if (!w.used(f.id)) this.say(f.locked ? 'A locked chest.' : 'A chest. Space opens it.'); return; }
        if (w.used(f.id)) { this.say('The chest is empty.'); return; }
        // A locked chest opens to a Lockpick or a key (`World.unlock`, #857), and to nothing else.
        if (f.locked) { const opened = w.unlock(); this.say(opened || 'Locked.'); if (!opened) return; }
        w.markUsed(f.id);
        this.say(`You open the chest: ${give(this.tables.items, this.party, giftOf(f)!).join(', ')}.`);
        return;
      }
      case 'inn': case 'temple': case 'shop': case 'guild': case 'trainer':
        this.visit(f, f.interior, serviceScreen(this, f));
        return;
      // The wilderness features (game/wilds.ts): each says its look when stepped on, and acts on Space.
      case 'shrine': case 'fountain': case 'cairn': case 'statue': case 'camp': {
        if (stepped) { const l = stepLine(w, f); if (l) this.say(l); return; }
        switch (f.kind) {
          case 'shrine': case 'fountain': for (const l of useShrine(w, this.party, f)) this.say(l); return;
          case 'cairn': for (const l of openCairn(w, this.party, f)) this.say(l); return;
          case 'statue':
            if (w.used(f.id)) { this.say(f.done); return; }
            this.push(new RiddleScreen(this, f.name ?? 'A statue', f.riddle, (word) => { for (const l of answerRiddle(w, this.party, f, word).lines) this.say(l); }));
            return;
          case 'camp': this.offerRest(); return;
        }
        return;
      }
      // A den (game/dens.ts): stepped into or faced, its keepers dead, it puts the choice to burn it.
      case 'den': {
        const { lines, ask } = approach(w, f);
        for (const l of lines) this.say(l);
        if (ask) this.push(new ChoiceScreen(f.ask, [f.burn, f.leave ?? 'Leave it.'], (i) => { if (i === 0) for (const l of burn(w, this.party, f)) this.say(l); }));
        return;
      }
      case 'rift': case 'event': return;
      default: { const unhandled: never = f; return unhandled; }
    }
  }

  /**
   * Offer eight hours' rest, unless monsters are too near (game/wilds.ts: a camp lets them nearer). A
   * camp that counts its nights (#730) says the night's own waking in place of the usual one.
   */
  offerRest(): void {
    const refused = restRefused(this.world);
    if (refused) { this.say(refused); return; }
    this.push(new ChoiceScreen('Rest for eight hours? The party eats one ration each.', ['Rest', 'Not now'], (i) => {
      if (i !== 0) return;
      this.say(restAndWake(this.world, this.party) ?? 'There is not enough food to rest.');
    }));
  }

  /** Talk to a person: their words in a box, then their question, if they put one. */
  talk(p: Person): void {
    if (!p.interior) { this.push(this.talkScreen(p)); return; }
    // A tavern: its keeper's words, as ever, or with people in it, those words over the menu that
    // lists them, which the words close onto.
    const menu = serviceScreen(this, p);
    this.visit(p, p.interior, menu);
    if (!(menu instanceof MessageScreen)) this.push(this.talkScreen(p));
  }

  /**
   * What talking to a person opens: their words in a box, which close onto their question, if they
   * put one, else the crossings they sell, the prestige, the skill or the Master they teach.
   */
  talkScreen(p: Person): Screen {
    const m = meet(p, this.party, heard(this.world, p));
    const then = m.choice ? (): void => this.ask(m.choice!, p.name) : p.passage?.length ? (): void => this.offer(p.passage!, p.name, p) : p.teaches ? (): void => this.train(p.teaches!, p.name)
      : p.skill ? (): void => this.push(learnerMenu(this, p.skill!, p.name)) : p.mastery ? (): void => this.push(masterMenu(this, p.mastery!, p.name)) : undefined;
    return new MessageScreen(m.text, then, p.name);
  }

  /**
   * Put a question: its answers through the choice screen, each with its price where it has one and
   * barred to a company short of it, and the answer's words in a box titled `title`, or to `said`
   * (words for the log). An answer that takes an ending has its pages after its words (ui/ending.ts,
   * #750), and the company is where it stood. Esc answers nothing, and the question comes again. A
   * question with an answer that would take an ending is marked so (`ChoiceScreen.ends`): no pilot answers it.
   */
  ask(c: Choice, title: string, said?: (text: string) => void): void {
    this.push(new ChoiceScreen(asked(c, this.party), c.answers.map(answerLabel), (i) => {
      if (i < 0) return;
      const text = answer(this.tables.items, c.answers[i], this.party), end = endingTaken(this.tables.endings, c.answers[i], this.party.flags);
      const pages = end ? (): void => this.push(new EndingScreen(end)) : undefined;
      if (said) { said(text); pages?.(); } else if (text || !pages) this.push(new MessageScreen(text, pages, title)); else pages();
    }, title, c.answers.map((a) => barred(a, this.party)), { ends: c.answers.some((a) => !!endsIn(this.tables.endings, a)) }));
  }

  /**
   * A prestige's trainer (game/prestige.ts): the company's members of the class, each with the title
   * and the price or why not, and the prestige taught to the one chosen. A company with none of the
   * class hears so.
   */
  train(t: Teaching, title: string): void {
    const party = this.party, list = prestige.offers(t, party, this.world.state);
    if (!list.length) { this.push(new MessageScreen(prestige.noneHere(t), undefined, title)); return; }
    this.push(new ChoiceScreen(prestige.ask(party), [...list.map((o) => prestige.offerLine(o, party)), prestige.LEAVE], (i) => {
      const o = list[i];
      if (!o) return;
      const { line } = prestige.teach(t, party, this.world.state, o.who);
      if (line) this.say(line);
    }, title, [...list.map((o) => !!o.bar), false]));
  }

  /**
   * A seller's crossings (game/passage.ts): the menu of where to, then the terms and the fare, then
   * the crossing taken. Esc at either backs out with nothing spent. As the menu opens the pilot is
   * told the routes, with the seller's square and the fares the menu shows (#721).
   */
  offer(routes: readonly Passage[], title: string, seller?: { x: number; y: number }): void {
    const w = this.world;
    if (seller) this.pilot?.told(w.state.mapId, seller.x, seller.y, routes.map((r) => ({ passage: r, fare: passage.fareOf(r, w) })));
    this.push(new ChoiceScreen(passage.ask(this.party), [...routes.map((r) => passage.offerLine(r, w)), passage.NOT_NOW], (i) => {
      const r = routes[i];
      if (!r) return;
      this.push(new ChoiceScreen(passage.terms(r, w), [passage.payLabel(r, w), passage.NOT_NOW], (j) => {
        if (j !== 0) return;
        const { taken, lines } = passage.take(r, w, this.party);
        for (const l of lines) this.say(l);
        if (taken) { for (const m of w.eventsHere()) this.say(m); this.enterCell(); }
      }, title));
    }, title));
  }

  /**
   * Go into a business. Its interior fills the viewport, under `first` (the service's opening menu)
   * and every menu that follows from it, until the last of them closes; then the party leaves.
   */
  visit(at: { x: number; y: number }, interior: Interior, first: Screen): void {
    this.push(new InteriorScreen(this, at, interior));
    this.push(first);
  }

  /** The end of a visit: back out of the doorway into the street, if that is where the party stands. */
  leave(at: { x: number; y: number }): void {
    if (this.world.state.x === at.x && this.world.state.y === at.y) this.world.stepOut();
  }

  /** Start a fight with the given groups; the combat screen calls back on resolution. */
  fight(groupIds: string[]): void {
    const groups = this.world.groupDefs(groupIds);
    const state = startCombat(this.tables, this.party, groups, this.rng, this.world.combatWeather());
    this.world.endWalk();
    // A kind not met before, one unseen beside or behind the party or in the ranks, says what it is as the fight opens.
    state.log.push(...this.world.meet(groups.flatMap((x) => x.monsters)));
    this.push(new CombatScreen(state, groupIds));
  }

  /**
   * A group that talks before it fights (#544): its question through the choice screen, as a
   * person's is, its price listed and barred to a company short of it, its answer's words to the log.
   * The refusal, or Esc, starts the fight; any other answer stands the group aside, and the party
   * meets whatever else stands beside it.
   */
  parley(id: string): void {
    const c = this.world.question(id);
    if (!c) { this.engage(); return; }
    const def = this.world.groupDefs([id])[0];
    this.push(new ChoiceScreen(asked(c, this.party), c.answers.map(answerLabel), (i) => {
      const a = c.answers[i] ?? c.answers.find((x) => x.fight);
      if (a) this.say(answer(this.tables.items, a, this.party).split('\n\n').join(' '));
      if (a && !a.fight) { this.engage(); return; }
      const ids = this.world.adjacentGroups();
      this.fight(ids.length ? ids : [id]);
    }, monster(this.tables.monsters, def.leader ?? def.monsters[0]).name, c.answers.map((a) => barred(a, this.party)), { fight: c.answers.findIndex((a) => !!a.fight) }));
  }

  /** The groups beside the party: the first that talks puts its question, else they fight. */
  engage(): void {
    const ids = this.world.adjacentGroups(), asks = ids.find((q) => this.world.question(q));
    if (asks) this.parley(asks); else if (ids.length) this.fight(ids);
  }

  /** Called by the combat screen when the fight ends. */
  afterCombat(groupIds: string[], outcome: 'victory' | 'defeat' | 'fled'): void {
    this.pop();
    if (outcome === 'victory') { for (const m of this.world.killGroups(groupIds)) this.say(m); this.enterCell(); }
    else if (outcome === 'fled') this.world.flee(groupIds);
    else this.fall();
  }

  /**
   * A wipe, in a fight or out of one (#1069): the game goes on. The Lanterns carry the company to the
   * nearest chapel (game/chapel.ts), where the first in the party order wakes at the next morning and
   * the rest lie as they fell; the log says so, and the chapel's menu opens as stepping in opens it.
   * Nothing is saved and nothing is lost but the fight, the night and the walk back. The fight's
   * groups stand where they were.
   */
  fall(): void {
    // A wipe in attract mode starts another game on a new seed at once: nobody is there to watch the chapel.
    if (this.attracting && this.pilot) { this.attract(); return; }
    // A wipe ends the pilot's run: it gives the helm back, and says why (epic #713, Decided 10).
    if (this.pilot?.on) this.pilot.stop(this, ['The company has fallen.']);
    const s = this.world.state;
    this.fell = { mapId: s.mapId, x: s.x, y: s.y, minutes: s.minutes };
    const lines = wakeAtChapel(this.world);
    this.screens = [new ExploreScreen()];
    // The chapel's room shows the two lines, as a visit shows what the step in said.
    this.actionFrom = this.said;
    for (const l of lines) this.say(l);
    this.enterCell();
  }

  /** Monsters the viewport should draw at a cell; a group under the ice is drawn under it. */
  monstersAt = (x: number, y: number): ViewMonster[] | null => {
    const g = this.world.groupAt(x, y);
    if (!g) return null;
    return groupDrawn(g.def.monsters).map((id) => { const d = monster(this.tables.monsters, id); return { id, sprite: d.sprite, tint: d.tint, size: d.size, ...(g.def.under ? { under: g.def.under } : {}) }; });
  };
}
