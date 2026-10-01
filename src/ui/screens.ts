// Modal screens over the exploration frame: messages, choices, the character sheet, the spell
// picker, and the town services (inn, temple, shop, guild, trainer) with the visit that frames them.
import type { Game, Screen } from '../game/game.ts';
import type { Action } from '../input.ts';
import { is } from '../input.ts';
import { drawText, lineHeight, measureText } from '../lib/engine/text.ts';
import { panel, paragraph, menu, wrap, columnMenu, optionParts, fit, columnLabelWidth } from './draw.ts';
import { LAYOUT, drawPartyCards, drawLog, drawViewportFrame, SAY_W, SAY_LINES, SIDE_W, ASK_LINES, ASK_SIDE_LINES } from './frame.ts';
import { drawPortraitLarge } from './portraits.ts';
import { drawInterior } from './interior.ts';
import { BRASS, BRASS_DARK, TEXT, TEXT_DIM, YELLOW, RED } from './palette.ts';
import type { Feature, Interior } from '../game/map.ts';
import { item, priceIn, buy } from '../game/items.ts';
import { readText } from '../game/people.ts';
import { ITEMS } from '../content/index.ts';
import { spell, spellsFor } from '../game/spells.ts';
import { CLASSES, RACES, TRAITS, STATS, armorClass, attackBonus, equip, heal, removeCondition, isDown, hasCondition, xpForLevel, levelUp, rest, canTrain, canTrainAt, trainPrice, MAX_LEVEL, guildFlag, className } from '../game/party.ts';
import { castOnAlly } from '../game/combat.ts';
import type { Character } from '../game/party.ts';
import type { GuildId } from '../content/guilds.ts';
import { rankOf, rankName, offered, inHand, report, take, guildName } from '../game/guilds.ts';

const BOX = { x: 40, y: 40, w: SAY_W + 24, h: 220 };

// ---- a visit to a business ----

/**
 * Inside a business. Game.visit pushes this under the service's first menu, and it paints the
 * business's interior over the viewport for as long as any of that service's menus are open above
 * it. They find it in the stack and lay themselves out in the side panel (where the automap is,
 * as in combat), so the room stays in view. It is never the top screen for long: the moment the
 * last menu closes, Game.update closes the visit.
 */
export class InteriorScreen implements Screen {
  readonly overlay = true;
  /**
   * What the game had said when the step that brought the party in began: the room's log shows
   * what that step said (a doorway's event) and what is said inside.
   */
  private readonly from: number;
  constructor(g: Game, readonly at: { x: number; y: number }, readonly interior: Interior) { this.from = Math.min(g.actionFrom, g.said); }
  /** Never reached with a menu open, and closed before the next step without one. */
  update(): void {}
  /** The visit is over: out of the business, and out of its doorway into the street. */
  close(g: Game): void {
    g.pop();
    g.leave(this.at);
  }
  /** The room's log: what was said since the step in began. */
  roomLog(g: Game): string[] {
    const n = Math.min(g.said - this.from, g.log.length);
    return n > 0 ? g.log.slice(-n) : [];
  }
  render(g: Game, ctx: CanvasRenderingContext2D, frame: number): void {
    drawInterior(ctx, this.interior, LAYOUT.view, g.world.daylight, frame);
    drawLog(ctx, this.roomLog(g));
    drawViewportFrame(ctx);
  }
}

/** Whether the party is inside a business, where messages and menus take the side panel. */
function visiting(g: Game): boolean { return g.screens.some((s) => s instanceof InteriorScreen); }

const SIDE = LAYOUT.map, PAD = 8, TEXT_W = SIDE_W, HINT_Y = SIDE.y + SIDE.h - PAD - 7;

/** The side panel and its title; returns the y the body starts at. */
function sidePanel(ctx: CanvasRenderingContext2D, title: string): number {
  panel(ctx, SIDE.x, SIDE.y, SIDE.w, SIDE.h);
  return title ? paragraph(ctx, title, SIDE.x + PAD, SIDE.y + PAD, TEXT_W, { color: BRASS }) + 4 : SIDE.y + PAD;
}
function sideTitleH(title: string): number { return title ? wrap(title, TEXT_W).length * lineHeight(1) + 4 : 0; }
function sideHint(ctx: CanvasRenderingContext2D, hint: string): void {
  drawText(ctx, hint, SIDE.x + SIDE.w - PAD, HINT_Y, { size: 1, color: TEXT_DIM, align: 'right' });
}

export class MessageScreen implements Screen {
  readonly overlay = true;
  /** In the side panel a long message is read a page at a time. */
  private page = 0;
  constructor(private text: string, private then?: () => void, private title = '') {}
  update(g: Game, a: Action | null): void {
    if (is(a, 'interact') && visiting(g) && this.page < this.pages().length - 1) { this.page++; return; }
    if (is(a, 'interact', 'cancel')) { g.pop(); this.then?.(); }
  }
  render(g: Game, ctx: CanvasRenderingContext2D): void {
    if (visiting(g)) { this.renderSide(ctx); return; }
    panel(ctx, BOX.x, BOX.y, BOX.w, BOX.h);
    let y = BOX.y + 10;
    if (this.title) { drawText(ctx, this.title, BOX.x + 12, y, { size: 1, color: BRASS }); y += 14; }
    paragraph(ctx, this.text, BOX.x + 12, y, SAY_W, { color: TEXT, maxLines: SAY_LINES });
    drawText(ctx, 'SPACE', BOX.x + BOX.w - 12, BOX.y + BOX.h - 12, { size: 1, color: TEXT_DIM, align: 'right' });
  }
  /**
   * The text in pages that fit the side panel under the title. A paragraph (one speaker, in a
   * tavern) moves whole to the next page rather than breaking, unless it is longer than a page.
   */
  private pages(): string[][] {
    const per = Math.max(1, Math.floor((HINT_Y - 4 - SIDE.y - PAD - sideTitleH(this.title)) / lineHeight(1)));
    const out: string[][] = [];
    let cur: string[] = [];
    for (const para of this.text.split('\n\n')) {
      const lines = wrap(para, TEXT_W);
      if (cur.length && cur.length + 1 + lines.length > per) { out.push(cur); cur = []; }
      if (cur.length) cur.push('');
      for (const l of lines) { if (cur.length === per) { out.push(cur); cur = []; } cur.push(l); }
    }
    if (cur.length) out.push(cur);
    return out.length ? out : [[]];
  }
  private renderSide(ctx: CanvasRenderingContext2D): void {
    const y = sidePanel(ctx, this.title);
    const pages = this.pages(), at = Math.min(this.page, pages.length - 1);
    pages[at].forEach((l, i) => drawText(ctx, l, SIDE.x + PAD, y + i * lineHeight(1), { size: 1, color: TEXT }));
    if (pages.length > 1) drawText(ctx, `${at + 1}/${pages.length}`, SIDE.x + PAD, HINT_Y, { size: 1, color: TEXT_DIM });
    sideHint(ctx, at < pages.length - 1 ? 'SPACE: MORE' : 'SPACE');
  }
}

export class ChoiceScreen implements Screen {
  readonly overlay = true;
  sel = 0;
  /** The first option in view when the list is longer than the side panel. */
  private top = 0;
  /**
   * `text` and `choices` may be made when drawn, for words and options that change while the menu
   * waits under another (a person an answer sends away is gone from a business's menu).
   */
  constructor(private text: string | (() => string), private choices: string[] | (() => string[]), private then: (i: number) => void, private title = '', private disabled: boolean[] = []) {}
  /** The prompt as it reads now. */
  get words(): string { return typeof this.text === 'function' ? this.text() : this.text; }
  /** The options as they read now. */
  get options(): string[] { return typeof this.choices === 'function' ? this.choices() : this.choices; }
  update(g: Game, a: Action | null): void {
    if (!a) return;
    this.sel = Math.min(this.sel, this.options.length - 1);
    if (is(a, 'up')) this.sel = (this.sel + this.options.length - 1) % this.options.length;
    else if (is(a, 'down')) this.sel = (this.sel + 1) % this.options.length;
    else if (is(a, 'cancel')) { g.pop(); this.then(-1); }
    else if (is(a, 'interact')) { if (this.disabled[this.sel]) return; g.pop(); this.then(this.sel); }
    else if (/^n[1-9]$/.test(a)) { const i = Number(a[1]) - 1; if (i < this.options.length && !this.disabled[i]) { g.pop(); this.then(i); } }
  }
  render(g: Game, ctx: CanvasRenderingContext2D): void {
    if (visiting(g)) { this.renderSide(ctx); return; }
    // One line of question was always allowed for; each more takes its height.
    const asked = Math.min(wrap(this.words, SAY_W).length, ASK_LINES);
    const h = Math.min(300, 40 + (asked - 1) * lineHeight(1) + this.options.length * 11 + 40);
    panel(ctx, BOX.x, BOX.y, BOX.w, h);
    let y = BOX.y + 10;
    if (this.title) { drawText(ctx, this.title, BOX.x + 12, y, { size: 1, color: BRASS }); y += 14; }
    y = paragraph(ctx, this.words, BOX.x + 12, y, SAY_W, { color: TEXT, maxLines: ASK_LINES }) + 6;
    menu(ctx, this.options, BOX.x + 12, y, this.sel, { disabled: this.disabled });
  }
  /**
   * The narrow layout: the prompt, a rule, then the options in columns, scrolling when there are
   * more than fit. Under them, the selected option's note, or its label in full where it was cut.
   */
  private renderSide(ctx: CanvasRenderingContext2D): void {
    const x = SIDE.x + PAD;
    let y = sidePanel(ctx, this.title);
    y = paragraph(ctx, this.words, x, y, TEXT_W, { color: TEXT, maxLines: ASK_SIDE_LINES }) + 3;
    ctx.fillStyle = BRASS_DARK; ctx.fillRect(x, y, TEXT_W, 1);
    y += 5;
    const lh = lineHeight(1) + 1, n = this.options.length;
    const noteOf = (i: number, scrolls: boolean): string => {
      const { label, value, note } = optionParts(this.options[i]);
      const cut = measureText(label) > columnLabelWidth(TEXT_W, value, scrolls);
      return cut && note ? `${label}. ${note}` : cut ? label : note;
    };
    // Room for two lines of note is kept under the list if any option will want it, judged at the
    // widths the list will have with that room taken.
    const rowsIn = (noteH: number): number => Math.max(1, Math.floor((HINT_Y - 4 - noteH - y) / lh));
    const NOTE_H = lineHeight(1) * 2 + 4, scrollsWithNotes = n > rowsIn(NOTE_H);
    const noteH = this.options.some((_, i) => noteOf(i, scrollsWithNotes) !== '') ? NOTE_H : 0;
    const rows = rowsIn(noteH);
    if (this.sel < this.top) this.top = this.sel;
    if (this.sel >= this.top + rows) this.top = this.sel - rows + 1;
    this.top = Math.max(0, Math.min(this.top, n - rows));
    columnMenu(ctx, this.options, x, y, TEXT_W, this.sel, this.top, rows, { disabled: this.disabled });
    const note = noteOf(this.sel, n > rows);
    if (note) {
      // Two lines at most: the second takes the rest, cut to fit.
      const lines = wrap(note, TEXT_W), shown = lines.length > 2 ? [lines[0], fit(lines.slice(1).join(' '), TEXT_W)] : lines;
      shown.forEach((l, i) => drawText(ctx, l, x, HINT_Y - 4 - noteH + 2 + i * lineHeight(1), { size: 1, color: TEXT_DIM }));
    }
    sideHint(ctx, 'ESC LEAVE');
  }
}

/** Ask which party member; -1 on cancel. */
export function pickMember(g: Game, text: string, then: (i: number) => void, filter: (c: Character) => boolean = () => true): void {
  const names = g.party.members.map((m, i) => `${i + 1}. ${m.name}  ${m.hp}/${m.maxHp}`);
  g.push(new ChoiceScreen(text, names, then, '', g.party.members.map((m) => !filter(m))));
}

/** Character sheet with equip and use. */
export class SheetScreen implements Screen {
  readonly overlay = true;
  sel = 0;
  constructor(private who: number) {}
  update(g: Game, a: Action | null): void {
    if (!a) return;
    const c = g.party.members[this.who];
    const items = this.items(g);
    if (is(a, 'cancel')) { g.pop(); return; }
    if (is(a, 'left')) { this.who = (this.who + 5) % 6; this.sel = 0; g.selected = this.who; return; }
    if (is(a, 'right')) { this.who = (this.who + 1) % 6; this.sel = 0; g.selected = this.who; return; }
    if (/^n[1-6]$/.test(a)) { this.who = Number(a[1]) - 1; this.sel = 0; g.selected = this.who; return; }
    if (is(a, 'up') && items.length) this.sel = (this.sel + items.length - 1) % items.length;
    else if (is(a, 'down') && items.length) this.sel = (this.sel + 1) % items.length;
    else if (is(a, 'interact') && items.length) {
      const it = items[this.sel];
      const d = item(it.id);
      if (d.slot !== 'none') {
        if (equip(c, it.id)) { if (it.from === 'bag') g.party.bag.splice(g.party.bag.indexOf(it.id), 1); g.say(`${c.name} equips ${d.name}.`); }
        else g.say(`${c.name} cannot use ${d.name}.`);
      } else if (d.use) {
        pickMember(g, `Use ${d.name} on whom?`, (i) => {
          if (i < 0) return;
          const t = g.party.members[i];
          const src = it.from === 'bag' ? g.party.bag : c.pack;
          src.splice(src.indexOf(it.id), 1);
          if (d.use!.heal) g.say(`${t.name} recovers ${heal(t, d.use!.heal)}.`);
          if (d.use!.sp) { t.sp = Math.min(t.maxSp, t.sp + d.use!.sp); g.say(`${t.name} feels sharper.`); }
          if (d.use!.cure) { for (const k of d.use!.cure) removeCondition(t, k as never); g.say(`${t.name} is cleansed.`); }
          if (d.use!.food) { g.party.food += d.use!.food; g.say(`The party's food grows by ${d.use!.food}.`); }
        });
      } else if (readText(it.id)) g.push(new MessageScreen(readText(it.id)!.join('\n\n'), undefined, d.name));
      else g.say(`${d.name}: nothing to do with it here.`);
      if (this.sel >= this.items(g).length) this.sel = Math.max(0, this.items(g).length - 1);
    }
  }
  private items(g: Game): { id: string; from: 'pack' | 'bag' }[] {
    const c = g.party.members[this.who];
    return [...c.pack.map((id) => ({ id, from: 'pack' as const })), ...g.party.bag.map((id) => ({ id, from: 'bag' as const }))];
  }
  render(g: Game, ctx: CanvasRenderingContext2D, frame: number): void {
    const c = g.party.members[this.who];
    panel(ctx, 8, 8, 624, 268);
    drawText(ctx, `${c.name}  ${RACES[c.race].name} ${className(c)}  LEVEL ${c.level}`, 20, 18, { size: 1, color: BRASS });
    drawText(ctx, c.level >= MAX_LEVEL ? `XP ${c.xp}  (AT THE CAP)` : `XP ${c.xp} / ${xpForLevel(c.level + 1)}`, 620, 18, { size: 1, color: canTrain(c) ? YELLOW : TEXT_DIM, align: 'right' });
    drawPortraitLarge(ctx, c, 20, 34);
    let y = 36;
    for (const s of STATS) { drawText(ctx, s.toUpperCase().slice(0, 3), 100, y, { size: 1, color: TEXT_DIM }); drawText(ctx, String(c.stats[s]), 140, y, { size: 1, color: TEXT, align: 'right' }); y += 10; }
    y = 134;
    drawText(ctx, `HP ${c.hp}/${c.maxHp}   SP ${c.sp}/${c.maxSp}`, 20, y, { size: 1, color: TEXT }); y += 10;
    drawText(ctx, `AC ${armorClass(c)}   TO-HIT +${attackBonus(c)}`, 20, y, { size: 1, color: TEXT }); y += 10;
    drawText(ctx, c.conditions.length ? c.conditions.join(', ').toUpperCase() : 'WELL', 20, y, { size: 1, color: c.conditions.length ? RED : TEXT_DIM }); y += 14;
    drawText(ctx, 'WEAPON ' + (c.equipment.weapon ? item(c.equipment.weapon).name : 'none'), 20, y, { size: 1, color: TEXT }); y += 10;
    drawText(ctx, 'ARMOUR ' + (c.equipment.armor ? item(c.equipment.armor).name : 'none'), 20, y, { size: 1, color: TEXT }); y += 10;
    drawText(ctx, 'SHIELD ' + (c.equipment.shield ? item(c.equipment.shield).name : 'none'), 20, y, { size: 1, color: TEXT }); y += 10;
    drawText(ctx, 'TRAITS ' + CLASSES[c.cls].traits.map((t) => TRAITS[t].name).join(', '), 20, y, { size: 1, color: TEXT }); y += 10;
    if (c.spells.length) { drawText(ctx, 'SPELLS ' + c.spells.map((s) => spell(s).name).join(', '), 20, y, { size: 1, color: TEXT }); }
    // Items column
    const items = this.items(g);
    drawText(ctx, 'ITEMS (SPACE: EQUIP OR USE)', 340, 36, { size: 1, color: TEXT_DIM });
    if (!items.length) drawText(ctx, 'nothing carried', 340, 50, { size: 1, color: TEXT_DIM });
    else menu(ctx, items.slice(0, 16).map((it) => `${item(it.id).name}${it.from === 'bag' ? ' (bag)' : ''}`), 340, 50, this.sel);
    drawText(ctx, '< > OR 1-6 SWITCH   ESC CLOSE', 620, 264, { size: 1, color: TEXT_DIM, align: 'right' });
    drawPartyCards(ctx, g.party, this.who, frame);
  }
}

/** Pick a caster and a spell for the current context. */
export class SpellScreen implements Screen {
  readonly overlay = true;
  private who = -1;
  private sel = 0;
  constructor(private context: 'explore', private onDone?: () => void) {}
  private casters(g: Game): number[] { return g.party.members.map((m, i) => ({ m, i })).filter(({ m }) => m.spells.length && !isDown(m) && !hasCondition(m, 'asleep')).map(({ i }) => i); }
  private list(g: Game): string[] { return g.party.members[this.who].spells.filter((s) => spell(s).context !== 'combat'); }
  update(g: Game, a: Action | null): void {
    if (!a) return;
    if (this.who < 0) {
      const cs = this.casters(g);
      if (!cs.length) { g.pop(); g.say('Nobody can cast.'); return; }
      if (is(a, 'cancel')) { g.pop(); return; }
      if (is(a, 'up')) this.sel = (this.sel + cs.length - 1) % cs.length;
      else if (is(a, 'down')) this.sel = (this.sel + 1) % cs.length;
      else if (is(a, 'interact')) { this.who = cs[this.sel]; this.sel = 0; }
      else if (/^n[1-6]$/.test(a)) { const i = Number(a[1]) - 1; if (cs.includes(i)) { this.who = i; this.sel = 0; } }
      return;
    }
    const list = this.list(g);
    if (is(a, 'cancel')) { this.who = -1; this.sel = 0; return; }
    if (!list.length) { g.say('No spell for here.'); this.who = -1; return; }
    if (is(a, 'up')) this.sel = (this.sel + list.length - 1) % list.length;
    else if (is(a, 'down')) this.sel = (this.sel + 1) % list.length;
    else if (is(a, 'interact')) {
      const sp = spell(list[this.sel]);
      const caster = this.who;
      g.pop();
      if (sp.target === 'ally') {
        pickMember(g, `${sp.name} on whom?`, (i) => {
          if (i < 0) return;
          const c = g.party.members[caster];
          if (c.sp < sp.sp) { g.say(`${c.name} lacks the spell points.`); return; }
          c.sp -= sp.sp;
          g.say(castOnAlly(c, sp, g.party.members[i]));
        });
      } else if (sp.explore === 'mark' && g.world.state.mark) {
        g.push(new ChoiceScreen('The mark is set. Which?', ['Return to the mark', 'Set it here'], (i) => { if (i >= 0) g.castExplore(caster, sp.id, i === 0); }, sp.name));
      } else g.castExplore(caster, sp.id);
      this.onDone?.();
    }
  }
  render(g: Game, ctx: CanvasRenderingContext2D): void {
    panel(ctx, BOX.x, BOX.y, BOX.w, BOX.h);
    if (this.who < 0) {
      drawText(ctx, 'WHO CASTS?', BOX.x + 12, BOX.y + 10, { size: 1, color: BRASS });
      const cs = this.casters(g);
      menu(ctx, cs.map((i) => `${g.party.members[i].name}  SP ${g.party.members[i].sp}/${g.party.members[i].maxSp}`), BOX.x + 12, BOX.y + 26, this.sel);
    } else {
      const c = g.party.members[this.who];
      drawText(ctx, `${c.name} CASTS  (SP ${c.sp})`, BOX.x + 12, BOX.y + 10, { size: 1, color: BRASS });
      const list = this.list(g);
      menu(ctx, list.map((s) => `${spell(s).name} (${spell(s).sp})  ${spell(s).text}`), BOX.x + 12, BOX.y + 26, this.sel, { disabled: list.map((s) => spell(s).sp > c.sp) });
    }
  }
}

// ---- town services ----

/** A business: a trade in a doorway, or a tavern, whose keeper is a person with a room of their own. */
type Business = Extract<Feature, { kind: 'inn' | 'temple' | 'shop' | 'guild' | 'trainer' }> | (Extract<Feature, { kind: 'npc' }> & { interior: Interior });

/** One line of a business's first menu, and the screen it opens. */
export interface BusinessEntry { label: string; open: () => Screen }

/** What each kind of business trades in, as its first menu names it. */
const TRADE: Record<Exclude<Business['kind'], 'npc'>, string> = { inn: 'A room and rations', temple: 'The chapel', shop: 'Buy and sell', guild: 'Study spells', trainer: 'Train' };

/** A person as a menu names them: to the first comma ("Hob", not "Hob, once tenant of Ashcombe"). */
export const shortName = (name: string): string => name.split(',')[0];

/**
 * What a business offers the party on the way in, in order: its own trade (a tavern's is its
 * keeper's words), then a guild's work where it is a hall, then "Talk to <name>" for each person
 * there now (`World.peopleAt`); Leave is always last. This is the one place the list is made, and
 * it is made afresh each time it is read, so the people are those there now.
 */
export function businessEntries(g: Game, f: Business): BusinessEntry[] {
  const out: BusinessEntry[] = [f.kind === 'npc' ? { label: 'The talk of the room', open: () => g.talkScreen(f) } : { label: TRADE[f.kind], open: () => trade(g, f) }];
  if (f.kind !== 'npc' && f.hall) { const hall = f.hall; out.push({ label: `Work for ${guildName(hall)}`, open: () => guildWork(g, hall, f.name) }); }
  for (const p of g.world.peopleAt(f.x, f.y)) out.push({ label: `Talk to ${shortName(p.name)}`, open: () => g.talkScreen(p) });
  return out;
}

/**
 * The screen a business opens on: its trade alone, as ever, or where it offers more, a first menu
 * that each choice returns to (it is pushed again under the screen the choice opens), until Leave.
 */
export function serviceScreen(g: Game, f: Feature): Screen {
  if (f.kind !== 'inn' && f.kind !== 'temple' && f.kind !== 'shop' && f.kind !== 'guild' && f.kind !== 'trainer' && !(f.kind === 'npc' && f.interior)) return new MessageScreen('...');
  const b = f as Business;
  const entries = businessEntries(g, b);
  if (entries.length === 1) return entries[0].open();
  // Made when drawn: the guild's work, open above it, can raise the company's rank, and a person's
  // answer can send them away.
  const hall = b.kind !== 'npc' ? b.hall : undefined;
  return new ChoiceScreen(hall ? () => standing(g, hall) : `${b.name}.`, () => [...businessEntries(g, b).map((e) => e.label), 'Leave'], (i) => {
    const now = businessEntries(g, b);
    if (i < 0 || i >= now.length) return;
    // Back to the menu after, while it offers more than the trade: once everyone listed has gone,
    // the trade is all there is, and opening it again under itself would open it twice.
    if (now.length > 1) g.push(serviceScreen(g, b));
    g.push(now[i].open());
  }, b.name);
}

function trade(g: Game, f: Exclude<Business, { kind: 'npc' }>): Screen {
  switch (f.kind) {
    case 'inn': return inn(g, f);
    case 'temple': return temple(g, f);
    case 'shop': return shop(g, f);
    case 'guild': return guild(g, f);
    case 'trainer': return trainer(g, f);
  }
}

// ---- a guild's work, at any of its halls (game/guilds.ts) ----

/** The company's place in a guild, as its hall's first menu says it. */
function standing(g: Game, id: GuildId): string {
  const r = rankName(id, rankOf(id, g.party)), name = guildName(id);
  return r ? `Your rank with ${name}: ${r}.` : `You have no rank with ${name} yet.`;
}

/** The guild's work: first the report, which pays what is done, then what the hall offers. */
function guildWork(g: Game, id: GuildId, hallName: string): Screen {
  const paid = report(id, g.world.state, g.party);
  if (paid.length) return new MessageScreen(paid.join('\n\n'), () => g.push(guildOffers(g, id, hallName)), hallName);
  return guildOffers(g, id, hallName);
}

function guildOffers(g: Game, id: GuildId, hallName: string): Screen {
  const offers = offered(id, g.party), held = inHand(id, g.party);
  const doing = held.length ? ` In hand: ${held.map((q) => q.title).join('; ')}.` : '';
  if (!offers.length) return new MessageScreen(`"We have no more work for you now."${doing}`, undefined, hallName);
  return new ChoiceScreen(`${standing(g, id)}${doing}`, [...offers.map((q) => q.title), 'Back'], (i) => {
    if (i < 0 || i === offers.length) return;
    const q = offers[i];
    g.push(new MessageScreen(q.offer.join('\n\n'), () => g.push(new ChoiceScreen(q.title, ['Take it', 'Not now'], (j) => {
      if (j === 0) {
        const said = take(q, g.world.state, g.party);
        g.say(`You take the work: ${q.title}.`);
        if (said.length) { g.push(new MessageScreen(said.join('\n\n'), () => g.push(guildOffers(g, id, hallName)), hallName)); return; }
      }
      g.push(guildOffers(g, id, hallName));
    }, hallName)), hallName));
  }, hallName);
}

function inn(g: Game, f: Extract<Feature, { kind: 'inn' }>): Screen {
  const cost = f.price * g.party.members.length;
  return new ChoiceScreen(`"Welcome to ${f.name}. A night for the six of you is ${cost} gold, supper included." (You have ${g.party.gold}.)`,
    [`Stay the night (${cost} gold)`, `Buy 10 rations (${20} gold)`, 'Leave'], (i) => {
      if (i === 0) {
        if (g.party.gold < cost) { g.say('You cannot afford a room.'); return; }
        g.party.gold -= cost;
        for (const m of g.party.members) rest(m);
        // Sleep until 07:00, or first light in the depth of winter.
        g.world.sleepUntilMorning();
        g.say('You sleep well. Morning.');
      } else if (i === 1) {
        if (g.party.gold < 20) { g.say('Not enough gold.'); return; }
        g.party.gold -= 20; g.party.food += 10; g.say('The kitchen packs you ten days of rations.');
      }
    }, f.name);
}

function temple(g: Game, f: Extract<Feature, { kind: 'temple' }>): Screen {
  const priceOf = (c: Character): number => hasCondition(c, 'dead') ? 100 * c.level : hasCondition(c, 'stoned') ? 80 * c.level : c.conditions.length ? 25 : 0;
  const names = g.party.members.map((m) => `${m.name}: ${m.conditions.length ? m.conditions.join(', ') : 'well'}\t${priceOf(m) ? `${priceOf(m)}g` : ''}`);
  return new ChoiceScreen(`The Lanterns keep the chapel lit day and night. "Who needs the light?" (${g.party.gold} gold.)`,
    [...names, 'Donate 10 gold', 'Leave'], (i) => {
      if (i < 0 || i === names.length + 1) return;
      if (i === names.length) { if (g.party.gold >= 10) { g.party.gold -= 10; g.say('The Lanterns thank you.'); g.party.flags.donations = (g.party.flags.donations ?? 0) + 1; } return; }
      const c = g.party.members[i];
      const p = priceOf(c);
      if (!p) { g.say(`${c.name} is well.`); return; }
      if (g.party.gold < p) { g.say('You cannot afford it.'); return; }
      g.party.gold -= p;
      c.conditions = [];
      if (c.hp <= 0) c.hp = 1;
      g.say(`${c.name} is restored.`);
    }, f.name, [...g.party.members.map((m) => priceOf(m) === 0), false, false]);
}

function shop(g: Game, f: Extract<Feature, { kind: 'shop' }>): Screen {
  return new ChoiceScreen(`"${f.name}. Buying or selling?" (${g.party.gold} gold.)`, ['Buy', 'Sell', 'Leave'], (i) => {
    if (i === 0) g.push(buyScreen(g, f));
    else if (i === 1) g.push(sellScreen(g, f));
  }, f.name);
}

function buyScreen(g: Game, f: Extract<Feature, { kind: 'shop' }>): Screen {
  const names = f.stock.map((id) => `${item(id).name}\t${priceIn(f, id)}g\t${describe(id)}`);
  const s: ChoiceScreen = new ChoiceScreen(`What will it be? (${g.party.gold} gold.)`, [...names, 'Done'], (i) => {
    if (i < 0 || i === names.length) return;
    const d = buy(g.party, f, f.stock[i]);
    if (!d) { g.say('Not enough gold.'); g.push(buyScreen(g, f)); return; }
    if (d.use?.food) g.say(`Bought ${d.name}: food is now ${g.party.food}.`);
    else g.say(`Bought ${d.name}.`);
    const next = buyScreen(g, f); (next as ChoiceScreen).sel = i; g.push(next);
  }, f.name, [...f.stock.map((id) => priceIn(f, id) > g.party.gold), false]);
  return s;
}

function sellScreen(g: Game, f: Extract<Feature, { kind: 'shop' }>): Screen {
  const entries: { id: string; owner: string[]; label: string }[] = [];
  for (const id of g.party.bag) entries.push({ id, owner: g.party.bag, label: `${item(id).name} (bag)\t${sellPrice(id)}g` });
  for (const m of g.party.members) for (const id of m.pack) entries.push({ id, owner: m.pack, label: `${item(id).name} (${m.name})\t${sellPrice(id)}g` });
  if (!entries.length) return new MessageScreen('"You have nothing I want."', undefined, f.name);
  return new ChoiceScreen('"Let me see it."', [...entries.map((e) => e.label), 'Done'], (i) => {
    if (i < 0 || i === entries.length) return;
    const e = entries[i];
    if (sellPrice(e.id) === 0) { g.say(`"I will not buy that."`); g.push(sellScreen(g, f)); return; }
    e.owner.splice(e.owner.indexOf(e.id), 1);
    g.party.gold += sellPrice(e.id);
    g.say(`Sold ${item(e.id).name} for ${sellPrice(e.id)} gold.`);
    g.push(sellScreen(g, f));
  }, f.name);
}

function sellPrice(id: string): number { return Math.floor(item(id).price / 2); }

function describe(id: string): string {
  const d = ITEMS[id];
  if (d.slot === 'weapon') return `${d.dice}d${d.sides}${d.bonus ? '+' + d.bonus : ''}${d.ranged ? ' ranged' : ''}${d.twoHanded ? ' 2h' : ''}`;
  if (d.ac) return `AC+${d.ac}`;
  if (d.use?.heal) return `heals ${d.use.heal}`;
  if (d.use?.sp) return `${d.use.sp} SP`;
  if (d.use?.food) return `${d.use.food} food`;
  return '';
}

function guild(g: Game, f: Extract<Feature, { kind: 'guild' }>): Screen {
  const members = g.party.members.map((m, i) => ({ m, i })).filter(({ m }) => f.classes.includes(m.cls));
  const joined = !!g.party.flags[guildFlag(f.name)];
  if (!joined) {
    return new ChoiceScreen(`"${f.name}. The fee to study here is ${f.fee} gold, paid once." (${g.party.gold} gold.)`, [`Pay the fee (${f.fee} gold)`, 'Leave'], (i) => {
      if (i !== 0) return;
      if (g.party.gold < f.fee) { g.say('Not enough gold.'); return; }
      g.party.gold -= f.fee; g.party.flags[guildFlag(f.name)] = 1; g.say('You may study here.');
      g.push(guild(g, f));
    }, f.name);
  }
  // Spells up to the guild's tier for sale, per caster; the price climbs with the tier.
  const offers: { who: number; id: string; price: number }[] = [];
  for (const { m, i } of members) {
    const list = CLASSES[m.cls].spells; if (!list) continue;
    for (const sp of spellsFor(list, f.maxTier ?? 2)) if (!m.spells.includes(sp.id)) offers.push({ who: i, id: sp.id, price: spellPrice(sp.level) });
  }
  if (!offers.length) return new MessageScreen('"We have taught you all we can for now. Come back when you have grown."', undefined, f.name);
  return new ChoiceScreen(`"What would you learn?" (${g.party.gold} gold.)`, [...offers.map((o) => `${g.party.members[o.who].name}: ${spell(o.id).name}\t${o.price}g\t${spell(o.id).text}`), 'Leave'], (i) => {
    if (i < 0 || i === offers.length) return;
    const o = offers[i];
    if (g.party.gold < o.price) { g.say('Not enough gold.'); g.push(guild(g, f)); return; }
    g.party.gold -= o.price; g.party.members[o.who].spells.push(o.id);
    g.say(`${g.party.members[o.who].name} learns ${spell(o.id).name}.`);
    g.push(guild(g, f));
  }, f.name, [...offers.map((o) => o.price > g.party.gold), false]);
}

/** What a guild charges for a spell of the given tier: 40, 80, 160, 320. */
export function spellPrice(tier: number): number { return 40 * Math.pow(2, tier - 1); }

function trainer(g: Game, f: Extract<Feature, { kind: 'trainer' }>): Screen {
  const cost = trainPrice;
  const can = g.party.members.map((c) => canTrainAt(c, f.maxLevel) && !isDown(c));
  const names = g.party.members.map((c, i) => `${c.name}  L${c.level}\t${can[i] ? `train ${cost(c)}g` : c.level >= f.maxLevel ? 'beyond me' : `needs ${xpForLevel(c.level + 1) - c.xp} xp`}`);
  return new ChoiceScreen(`"${f.name}. I train to level ${f.maxLevel}. Who is ready?" (${g.party.gold} gold.)`, [...names, 'Leave'], (i) => {
    if (i < 0 || i === names.length) return;
    const c = g.party.members[i];
    if (g.party.gold < cost(c)) { g.say('Not enough gold.'); g.push(trainer(g, f)); return; }
    g.party.gold -= cost(c);
    const before = c.level;
    // levelUp grants every level the xp allows; the trainer charges for one, so cap it.
    const xp = c.xp; c.xp = Math.min(c.xp, xpForLevel(c.level + 2) - 1); levelUp(c, g.rng); c.xp = xp;
    g.say(`${c.name} trains to level ${c.level}.` + (c.level === before ? '' : ` HP ${c.maxHp}, SP ${c.maxSp}.`));
    g.push(trainer(g, f));
  }, f.name, [...can.map((x) => !x), false]);
}

export { lineHeight };
