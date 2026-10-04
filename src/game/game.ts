// The Game: owns the world, the party, the rng and a stack of screens, and dispatches one input
// action per fixed step to the top screen. Screens are small objects with update/render; the
// exploration screen is here because it is the game's spine, the others live in ui/.
import { rng } from '../lib/engine/rng.ts';
import type { Rng } from '../lib/engine/rng.ts';
import { World } from './world.ts';
import { signSays } from './inscriptions.ts';
import type { WorldState } from './world.ts';
import { groupDrawn } from './world.ts';
import { defaultParty, isDown, allDown } from './party.ts';
import { meet, answer, answerLabel, asked, barred, heard } from './people.ts';
import type { Person } from './people.ts';
import type { Party } from './party.ts';
import { buildMaps } from '../content/maps.ts';
import type { GameMap, Feature, Interior, Choice, Passage, Teaching } from './map.ts';
import * as passage from './passage.ts';
import * as prestige from './prestige.ts';
import { startCombat, castOnParty } from './combat.ts';
import { spell } from './spells.ts';
import { save as saveTo, load as loadFrom, browserStore, hasSave } from './save.ts';
import type { Store } from './save.ts';
import type { Action } from '../input.ts';
import { is } from '../input.ts';
import { monster } from './monsters.ts';
import { drawViewport } from '../ui/viewport.ts';
import type { ViewMonster } from '../ui/viewport.ts';
import { LAYOUT, drawStatus, drawAutomap, drawPartyCards, drawLog, drawFrameBackground, drawPurse, drawViewportFrame } from '../ui/frame.ts';
import { CombatScreen } from '../ui/combat.ts';
import { MessageScreen, ChoiceScreen, SheetScreen, serviceScreen, SpellScreen, InteriorScreen, skillMenu } from '../ui/screens.ts';
import { QuestScreen } from '../ui/quests.ts';
import { questLog, questMarks, questNews } from './quests.ts';
import { TitleScreen } from '../ui/title.ts';
import { WorldMapScreen } from '../ui/worldmap.ts';
import { drawText } from '../lib/engine/text.ts';
import { RiddleScreen } from '../ui/riddle.ts';
import { stepLine, useShrine, openCairn, answerRiddle, restRefused, restParty } from './wilds.ts';
import { approach, burn } from './dens.ts';

export interface Screen {
  /** Called once per fixed step with the next queued action (or null). */
  update(g: Game, a: Action | null): void;
  render(g: Game, ctx: CanvasRenderingContext2D, frame: number): void;
  /** Whether the frame (party cards, automap) is drawn beneath. */
  readonly overlay?: boolean;
}

export class Game {
  world!: World;
  party!: Party;
  readonly rng: Rng = rng;
  readonly store: Store | null;
  /** Set by main.ts; screens that take typed text need it. */
  input: { textMode: boolean; drainText(current: string, max?: number): string } | null = null;
  log: string[] = [];
  /** Lines ever said. The log keeps only the last 60, so a screen that wants what was said since it opened counts from this. */
  said = 0;
  /** What had been said when the party's last action began: a visit that action opens shows the lines it said, a doorway's event among them. */
  actionFrom = 0;
  screens: Screen[] = [];
  frame = 0;
  /** The party member the sheet opens on. */
  selected = 0;
  /** The quest the log opens on: the last one to change, or the last one looked at. */
  questFocus = '';
  /** What the quest log held at the last look, so each change to it is announced once. */
  private questMarked = new Set<string>();
  maps: Record<string, GameMap> = buildMaps();

  constructor(store: Store | null = browserStore()) {
    this.store = store;
    this.screens.push(new TitleScreen(hasSave(store)));
  }

  // ---- lifecycle ----
  newGame(seed: number, party?: Party): void {
    this.rng.seed(seed);
    this.maps = buildMaps();
    this.party = party ?? defaultParty(this.rng);
    this.world = new World(this.maps, this.party, this.rng);
    this.log = [];
    this.screens = [new ExploreScreen()];
    this.say('Arrows move. Space acts. R rests, F searches, C casts, I inventory, J quests, F5/F9 save/load.');
    for (const m of this.world.eventsHere()) this.say(m);
    this.enterCell();
    this.markQuests();
  }

  loadGame(): boolean {
    if (!this.store) return false;
    const data = loadFrom(this.store);
    if (!data) return false;
    this.maps = buildMaps();
    this.party = data.party;
    this.rng.seed(data.rng);
    this.world = new World(this.maps, this.party, this.rng, data.world as WorldState);
    this.log = [];
    this.screens = [new ExploreScreen()];
    this.say('Loaded.');
    // A save carries its quest log implicitly; take it as read rather than announcing it all again.
    this.markQuests();
    return true;
  }

  saveGame(): void {
    if (!this.store) { this.say('No storage to save to.'); return; }
    this.say(saveTo(this.store, this.world.state, this.party, this.rng.state) ? 'Saved.' : 'Save failed.');
  }

  // ---- screens ----
  get top(): Screen { return this.screens[this.screens.length - 1]; }
  push(s: Screen): void { this.screens.push(s); }
  pop(): void { if (this.screens.length > 1) this.screens.pop(); }
  say(line: string): void { this.log.push(line); this.said++; if (this.log.length > 60) this.log.shift(); }
  message(text: string, then?: () => void): void { this.push(new MessageScreen(text, then)); }

  update(a: Action | null): void {
    this.frame++;
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

  render(ctx: CanvasRenderingContext2D): void {
    drawFrameBackground(ctx);
    // Draw the exploration frame under any overlay screen.
    const base = this.screens.findIndex((s) => !s.overlay);
    for (let i = Math.max(0, base); i < this.screens.length; i++) this.screens[i].render(this, ctx, this.frame);
  }

  // ---- quests ----
  /** Announce each quest begun, advanced or finished since the last look. */
  private checkQuests(): void {
    const log = questLog(this.world.state, this.party);
    for (const n of questNews(this.questMarked, log)) { this.say(n.text); this.questFocus = n.quest; }
    this.questMarked = questMarks(log);
  }

  private markQuests(): void {
    this.questMarked = questMarks(questLog(this.world.state, this.party));
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
      case 'sign': if (!stepped) for (const l of signSays(w, f)) this.say(l); return;
      case 'well': this.say(f.text); if (f.heal) { for (const m of this.party.members) if (!isDown(m)) m.hp = m.maxHp; this.say('The party drinks and feels restored.'); } return;
      case 'npc': this.talk(f); return;
      case 'chest': {
        if (stepped) { if (!w.used(f.id)) this.say('A chest. Space opens it.'); return; }
        if (w.used(f.id)) { this.say('The chest is empty.'); return; }
        w.markUsed(f.id);
        this.party.gold += f.gold;
        this.party.bag.push(...f.items);
        const names = f.items.map((i) => itemName(i));
        this.say(`You open the chest: ${[f.gold ? `${f.gold} gold` : '', ...names].filter(Boolean).join(', ')}.`);
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

  /** Offer eight hours' rest, unless monsters are too near (game/wilds.ts: a camp lets them nearer). */
  offerRest(): void {
    const refused = restRefused(this.world);
    if (refused) { this.say(refused); return; }
    this.push(new ChoiceScreen('Rest for eight hours? The party eats one ration each.', ['Rest', 'Not now'], (i) => {
      if (i !== 0) return;
      if (!restParty(this.world, this.party)) { this.say('There is not enough food to rest.'); return; }
      this.say('The party rests. Morning comes.');
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
   * put one, else the crossings they sell, the prestige or the skill they teach.
   */
  talkScreen(p: Person): Screen {
    const m = meet(p, this.party, heard(this.world, p));
    const then = m.choice ? (): void => this.ask(m.choice!, p.name) : p.passage?.length ? (): void => this.offer(p.passage!, p.name) : p.teaches ? (): void => this.train(p.teaches!, p.name)
      : p.skill ? (): void => this.push(skillMenu(this, [p.skill!], p.name)) : undefined;
    return new MessageScreen(m.text, then, p.name);
  }

  /**
   * Put a question: its answers through the choice screen, each with its price where it has one and
   * barred to a company short of it, and the answer's words in a box titled `title`, or to `said`
   * (words for the log). Esc answers nothing, and the question comes again.
   */
  ask(c: Choice, title: string, said?: (text: string) => void): void {
    this.push(new ChoiceScreen(asked(c, this.party), c.answers.map(answerLabel), (i) => {
      if (i < 0) return;
      const text = answer(c.answers[i], this.party);
      if (said) said(text); else this.push(new MessageScreen(text, undefined, title));
    }, title, c.answers.map((a) => barred(a, this.party))));
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
   * the crossing taken. Esc at either backs out with nothing spent.
   */
  offer(routes: readonly Passage[], title: string): void {
    const w = this.world;
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
    const state = startCombat(this.party, groups, this.rng, this.world.combatWeather());
    this.world.endWalk();
    // A kind not met before, one unseen beside or behind the party or in the ranks, says what it is as the fight opens.
    state.log.push(...this.world.meet(groups.flatMap((x) => x.monsters)));
    this.push(new CombatScreen(state, groupIds));
  }

  /** Called by the combat screen when the fight ends. */
  afterCombat(groupIds: string[], outcome: 'victory' | 'defeat' | 'fled'): void {
    this.pop();
    if (outcome === 'victory') { for (const m of this.world.killGroups(groupIds)) this.say(m); this.enterCell(); }
    else if (outcome === 'fled') this.world.flee(groupIds);
    else this.gameOver();
  }

  gameOver(): void {
    this.screens = [new TitleScreen(hasSave(this.store), 'The party has fallen. Caldera goes on without them.')];
  }

  /** Cast an exploration spell by the selected caster; Waymark sets its mark, or with `back` returns to it. */
  castExplore(casterIndex: number, spellId: string, back = false): void {
    const c = this.party.members[casterIndex];
    const sp = spell(spellId);
    if (c.sp < sp.sp) { this.say(`${c.name} lacks the spell points.`); return; }
    c.sp -= sp.sp;
    switch (sp.explore) {
      case 'light': this.world.state.light = 200; this.say(`${c.name} casts ${sp.name}. The way ahead is lit.`); break;
      case 'wizard_eye': this.world.revealAll(6); this.say(`${c.name} casts ${sp.name}. The map fills in around you.`); break;
      case 'town_portal': { const name = this.world.townPortal(); this.say(`${c.name} casts ${sp.name}. The world folds, and you stand in ${name}.`); this.enterCell(); break; }
      case 'walk': this.world.bear('walk'); this.say(`${c.name} casts ${sp.name}. The shallows will bear you a while.`); break;
      case 'float': this.world.bear('float'); this.say(`${c.name} casts ${sp.name}. Your feet leave the ground.`); break;
      case 'mark':
        if (back ? this.world.toMark() : this.world.setMark()) {
          this.say(back ? `${c.name} casts ${sp.name}. The world folds, and you stand at the mark.` : `${c.name} casts ${sp.name}. The ground here is marked.`);
          if (back) this.enterCell();
        } else { c.sp += sp.sp; this.say(`${c.name} casts ${sp.name}, but the mark will not take here.`); }
        break;
      default:
        if (sp.target === 'party' && (sp.heal || sp.cure)) this.say(castOnParty(c, sp, this.party));
        else this.say(`${c.name} casts ${sp.name}.`);
    }
  }

  /** Monsters the viewport should draw at a cell; a group under the ice is drawn under it. */
  monstersAt = (x: number, y: number): ViewMonster[] | null => {
    const g = this.world.groupAt(x, y);
    if (!g) return null;
    return groupDrawn(g.def.monsters).map((id) => { const d = monster(id); return { id, sprite: d.sprite, tint: d.tint, size: d.size, ...(g.def.under ? { under: g.def.under } : {}) }; });
  };
}

import { item } from './items.ts';
function itemName(id: string): string { return item(id).name; }

/** Exploration: the spine of the game. */
export class ExploreScreen implements Screen {
  update(g: Game, a: Action | null): void {
    if (!a) return;
    const w = g.world;
    g.actionFrom = g.said;
    if (allDown(g.party)) { g.gameOver(); return; }
    let res: ReturnType<World['move']> | null = null;
    if (is(a, 'forward')) res = w.move('forward');
    else if (is(a, 'back')) res = w.move('back');
    else if (is(a, 'strafeLeft')) res = w.move('left');
    else if (is(a, 'strafeRight')) res = w.move('right');
    else if (is(a, 'turnLeft')) res = w.turn('left');
    else if (is(a, 'turnRight')) res = w.turn('right');
    else if (is(a, 'interact')) {
      const f = w.featureHere();
      if (f) g.interact(f);
      else {
        const ahead = w.map.ahead(w.state.x, w.state.y, w.state.facing);
        const grp = w.groupAt(ahead.x, ahead.y);
        if (grp) g.fight(w.adjacentGroups().length ? w.adjacentGroups() : [grp.def.id]);
        else g.say('Nothing here.');
      }
    }
    else if (is(a, 'search')) { w.advance(10); g.say(w.search() ? 'You find a hidden door!' : 'You search the wall ahead and find nothing.'); }
    else if (is(a, 'rest')) g.offerRest();
    else if (is(a, 'cast')) g.push(new SpellScreen('explore'));
    else if (is(a, 'inventory')) g.push(new SheetScreen(g.selected));
    else if (is(a, 'journal')) g.push(new QuestScreen(g));
    else if (is(a, 'save')) g.saveGame();
    else if (is(a, 'load')) { if (!g.loadGame()) g.say('No save to load.'); }
    else if (is(a, 'map')) g.push(new WorldMapScreen());
    else if (/^n[1-6]$/.test(a)) { g.selected = Number(a[1]) - 1; g.push(new SheetScreen(g.selected)); }
    if (!res) return;
    if (res.kind === 'blocked') { g.say(res.reason); return; }
    if (res.kind === 'turned') return;
    for (const m of res.messages) g.say(m);
    if (res.arrived) { g.enterCell(); return; }
    // Hunger: a day without food costs the party.
    if (res.encounter) { g.fight(res.encounter); return; }
    g.enterCell();
  }

  render(g: Game, ctx: CanvasRenderingContext2D, frame: number): void {
    drawViewport(ctx, g.world, LAYOUT.view, g.monstersAt, frame);
    const ahead = g.world.map.ahead(g.world.state.x, g.world.state.y, g.world.state.facing);
    const f = g.world.featureHere();
    const grp = g.world.groupAt(ahead.x, ahead.y);
    const hint = grp ? `${monster(grp.def.monsters[0]).plural}: Space to attack` : f ? `${featureLabel(f)}: Space` : '';
    if (hint) drawText(ctx, hint, LAYOUT.view.x + LAYOUT.view.w / 2, LAYOUT.view.y + 6, { size: 1, color: '#ffe08a', align: 'center' });
    drawStatus(ctx, g.world);
    drawAutomap(ctx, g.world, frame);
    drawPartyCards(ctx, g.party, -1, frame);
    drawLog(ctx, g.log);
    drawViewportFrame(ctx);
    drawPurse(ctx, g.party);
  }
}

export function featureLabel(f: Feature): string {
  switch (f.kind) {
    case 'inn': case 'temple': case 'shop': case 'guild': case 'trainer': case 'npc': return f.name;
    case 'chest': return 'A chest';
    case 'sign': return 'A sign';
    case 'well': return 'A well';
    case 'rift': return 'A rift';
    case 'shrine': return f.name ?? 'A shrine';
    case 'fountain': return f.name ?? 'A fountain';
    case 'cairn': return f.name ?? 'A cairn';
    case 'statue': return f.name ?? 'A statue';
    case 'camp': return f.name ?? 'A camp';
    case 'den': return f.name ?? 'A den';
    case 'event': return '';
  }
}
