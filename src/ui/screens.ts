// Modal screens over the exploration frame: messages, choices, the character sheet, the spell
// picker, and the town services (inn, temple, shop, guild, trainer, a guild's skills) with the visit
// that frames them.
import type { Game, Screen } from '../game/game.ts';
import type { Action } from '../input.ts';
import { is } from '../input.ts';
import { drawText, lineHeight, measureText } from '../lib/engine/text.ts';
import { panel, paragraph, menu, wrap, columnMenu, optionParts, fit, columnLabelWidth } from './draw.ts';
import { LAYOUT, drawPartyCards, drawLog, drawViewportFrame, SAY_W, SAY_LINES, SIDE_W, ASK_LINES, ASK_SIDE_LINES } from './frame.ts';
import { drawPortraitLarge } from './portraits.ts';
import { drawInterior } from './interior.ts';
import { BRASS, BRASS_DARK, TEXT, TEXT_DIM, YELLOW, RED } from './palette.ts';
import type { Feature, Interior } from '../game/mapdef.ts';
import { item, priceIn, buy, sellPrice } from '../game/items.ts';
import type { ItemDef } from '../game/items.ts';
import { readText } from '../game/people.ts';
import { spell } from '../game/spells.ts';
import { CLASSES, RACES, TRAITS, STATS, armorClass, attackBonus, equip, useItem, templePrice, isDown, hasCondition, xpForLevel, canTrain, trainPrice, MAX_LEVEL, className, resists, statOf, borne } from '../game/party.ts';
import { nightCost, stay, buyRations, RATIONS, RATIONS_PRICE, cure, donate, DONATION, sell, joined, payFee, hallOffers, learnSpell, mayTrain, train } from '../game/services.ts';
import { castOnAlly } from '../game/combat.ts';
import { castExplore } from '../game/wilds.ts';
import type { Character, Stat } from '../game/party.ts';
import type { GuildId } from '../content/guilds.ts';
import { rankOf, rankName, offered, inHand, report, take, guildName, guildShortName } from '../game/guilds.ts';
import { taughtBy, mayLearn, skillOffers, skillLine, skillRow, learn, askSkill, askWhich, skillNames, LEAVE_SKILLS, STRANGER } from '../game/skills.ts';
import type { SkillId } from '../game/skills.ts';
import { teachesExpert, expertOffers, masterOffers, favourDone, tierLine, teachTier, tierOf, askLine, askTier, noneHere, LINES, LINE_ROWS, LEAVE_TIERS, EXPERT_ENTRY, TIER_NAMES } from '../game/mastery.ts';
import type { Line, Mastery } from '../game/mastery.ts';
import type { Items, Tables } from '../game/tables.ts';

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
  readonly at: { x: number; y: number };
  readonly interior: Interior;
  constructor(g: Game, at: { x: number; y: number }, interior: Interior) {
    this.at = at;
    this.interior = interior;
    this.from = Math.min(g.actionFrom, g.said);
  }
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
  /** Its words: the pilot hears them as the box opens (Game.push). */
  readonly text: string;
  private then?: () => void;
  private title: string;
  constructor(text: string, then?: () => void, title = '') {
    this.text = text;
    this.then = then;
    this.title = title;
  }
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
  private text: string | (() => string);
  private choices: string[] | (() => string[]);
  private then: (i: number) => void;
  /** The title over the prompt: whose question it is, or the business's name. */
  readonly title: string;
  /** The rows barred, drawn dim: Space on one does nothing. */
  readonly disabled: boolean[];
  /** Of a group's question (`Game.parley`), the row that fights, its refusal; -1 on any other. The pilot (#721) reads it, as the group's own words say it. */
  readonly fight: number;
  /** Of a person's question (`Game.ask`), whether an answer takes an ending (DESIGN §9): no pilot answers it (#721). */
  readonly ends: boolean;
  /**
   * `text` and `choices` may be made when drawn, for words and options that change while the menu
   * waits under another (a person an answer sends away is gone from a business's menu).
   */
  constructor(text: string | (() => string), choices: string[] | (() => string[]), then: (i: number) => void, title = '', disabled: boolean[] = [], marks: { fight?: number; ends?: boolean } = {}) {
    this.text = text;
    this.choices = choices;
    this.then = then;
    this.title = title;
    this.disabled = disabled;
    this.fight = marks.fight ?? -1;
    this.ends = marks.ends ?? false;
  }
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
  private who: number;
  constructor(who: number) { this.who = who; }
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
      const d = item(g.tables.items, it.id);
      if (d.slot !== 'none') {
        if (equip(g.tables.items, c, it.id)) { if (it.from === 'bag') g.party.bag.splice(g.party.bag.indexOf(it.id), 1); g.say(`${c.name} equips ${d.name}.`); }
        else g.say(`${c.name} cannot use ${d.name}.`);
        // A piece's words are read as it is taken up from the pack (#847, DESIGN §9), once it is gone from the list.
        if (d.text) g.push(new MessageScreen(d.text.join('\n\n'), undefined, d.name));
      } else if (d.use) {
        pickMember(g, `Use ${d.name} on whom?`, (i) => {
          if (i < 0) return;
          // The line says where it lies: one listed from the bag comes from the bag, though the member's pack holds one too.
          for (const l of useItem(g.tables.items, g.party, it.from === 'pack' ? c : null, it.id, g.party.members[i]) ?? []) g.say(l);
        });
      } else if (readText(g.tables.items, it.id)) g.push(new MessageScreen(readText(g.tables.items, it.id)!.join('\n\n'), undefined, d.name));
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
    for (const s of STATS) {
      const [total, raise] = statText(g.tables.items, c, s);
      drawText(ctx, s.toUpperCase().slice(0, 3), 100, y, { size: 1, color: TEXT_DIM });
      drawText(ctx, total, 140, y, { size: 1, color: TEXT, align: 'right' });
      // The raise follows the total a glyph's gap on, in brackets: "13(+3)", 13 of which 3 is borne.
      if (raise) drawText(ctx, raise, 141, y, { size: 1, color: YELLOW });
      y += 10;
    }
    for (const r of sheetRows(g.tables, c)) drawText(ctx, r.text, 20, r.y, { size: 1, color: r.color });
    // Items column
    const items = this.items(g);
    drawText(ctx, 'ITEMS (SPACE: EQUIP OR USE)', 340, 36, { size: 1, color: TEXT_DIM });
    if (!items.length) drawText(ctx, 'nothing carried', 340, 50, { size: 1, color: TEXT_DIM });
    else menu(ctx, items.slice(0, SHEET_ITEMS).map((it) => `${item(g.tables.items, it.id).name}${it.from === 'bag' ? ' (bag)' : ''}`), 340, SHEET_ITEMS_Y, this.sel);
    drawText(ctx, '< > OR 1-6 SWITCH   ESC CLOSE', 620, 264, { size: 1, color: TEXT_DIM, align: 'right' });
    drawPartyCards(g.tables.items, ctx, g.party, this.who, frame);
  }
}

/** A whole number as a raise is written: "+3", "-1". */
const signed = (n: number): string => (n > 0 ? `+${n}` : String(n));
/** A stat as the sheet prints it: the total a fight reads (`statOf`), and in brackets the raise of what is borne, if any ("13", "(+3)"). */
export function statText(items: Items, c: Character, s: Stat): [string, string] {
  const total = statOf(items, c, s), raise = total - c.stats[s];
  return [String(total), raise ? `(${signed(raise)})` : ''];
}
/**
 * The sheet's WEAPON line: what is in hand and the element its blows carry, then the member's tier at
 * arms ("WEAPON Longsword, EXPERT", "WEAPON Grey Blade, LIGHTNING").
 */
export function weaponLine(tables: Tables, c: Character): string {
  const t = tierOf(c, 'arms'), w = c.equipment.weapon ? item(tables.items, c.equipment.weapon) : null;
  return 'WEAPON ' + (w ? w.name + (w.artifact ? `, ${power(w)}` : w.element ? `, ${w.element.toUpperCase()}` : '') : 'none') + (t ? `, ${TIER_NAMES[t].toUpperCase()}` : '');
}
/** The sheet's ARMOUR and SHIELD lines: what is worn there, and an artifact's power after it (#847: "ARMOUR The Erzhemd, SPEED +5"). */
export function slotLine(tables: Tables, c: Character, slot: 'armor' | 'shield'): string {
  const id = c.equipment[slot], d = id ? item(tables.items, id) : null;
  return `${slot === 'armor' ? 'ARMOUR' : 'SHIELD'} ` + (d ? d.name + (d.artifact ? `, ${power(d)}` : '') : 'none');
}
/**
 * An artifact's power in words (#847, DESIGN §9): the stat it raises and by how much, the element its
 * blows carry, its spell and how many a day, its regeneration or its ward ("SPEED +5", "HOLY BLOWS",
 * "METEOR SWARM 2 A DAY", "MENDS A TENTH AN HOUR", "NEVER ASLEEP").
 */
export function power(d: ItemDef): string {
  const raised = STATS.filter((s) => d.stat?.[s]).map((s) => `${s.toUpperCase()} ${signed(d.stat?.[s] ?? 0)}`);
  return [...raised, ...(d.element ? [`${d.element.toUpperCase()} BLOWS`] : []), ...(d.casts ? [`${spell(d.casts.spell).name.toUpperCase()} ${d.casts.times} A DAY`] : []),
    ...(d.regen ? ['MENDS A TENTH AN HOUR'] : []), ...(d.ward ? [`NEVER ${d.ward.toUpperCase()}`] : [])].join(', ');
}
/**
 * The sheet's ARTIFACT lines: each artifact the member carries in their pack (`borne`) and its power,
 * a line each ("ARTIFACT The Hagstone, NEVER PARALYSED"). One with a slot says its power on its slot's line.
 */
export const artifactLines = (tables: Tables, c: Character): string[] => borne(tables.items, c).map((id) => item(tables.items, id)).filter((d) => d.artifact && d.slot === 'none').map((d) => `ARTIFACT ${d.name}, ${power(d)}`);
/** Where the sheet's panel's border begins at its foot: the column under the portrait ends above it. */
export const SHEET_FOOT = 274;
/** The sheet's item list: its first row's y and the most rows it shows, a menu's step apart. */
export const SHEET_ITEMS_Y = 50, SHEET_ITEMS = 16;
/**
 * The highest the SPELLS line is drawn: just under the item list's last row (y 200), since a caster's
 * spells run on past the column into the list's (#847). Where main drew it for a member with least.
 */
export const SPELLS_TOP = 208;
/**
 * The sheet's column under the portrait (#847): each line, its colour and the y it is drawn at. Hit
 * points and armour share a line, and an artifact with a slot says its power on its slot's, so the
 * fullest member of any class ends above the panel's foot (`SHEET_FOOT`).
 */
export function sheetRows(tables: Tables, c: Character): { text: string; color: string; y: number }[] {
  const { items } = tables, rows: { text: string; color: string; y: number }[] = [];
  let y = 134;
  const add = (text: string, color = TEXT, gap = 10): void => { rows.push({ text, color, y }); y += gap; };
  const worn = (id: string | null): string => (id && item(items, id).artifact ? YELLOW : TEXT);
  add(`HP ${c.hp}/${c.maxHp}   SP ${c.sp}/${c.maxSp}   AC ${armorClass(items, c)}   TO-HIT +${attackBonus(items, c)}`);
  add(c.conditions.length ? c.conditions.join(', ').toUpperCase() : 'WELL', c.conditions.length ? RED : TEXT_DIM, 14);
  add(weaponLine(tables, c), worn(c.equipment.weapon));
  add(slotLine(tables, c, 'armor'), worn(c.equipment.armor));
  add(slotLine(tables, c, 'shield'), worn(c.equipment.shield));
  const res = resists(items, c);
  if (res.length) add('RESISTS ' + res.join(', ').toUpperCase());
  for (const l of artifactLines(tables, c)) add(l, YELLOW);
  add('TRAITS ' + CLASSES[c.cls].traits.map((t) => TRAITS[t].name).join(', '));
  for (const l of skillsLines(c)) add(l);
  if (c.spells.length) { y = Math.max(y, SPELLS_TOP); add(spellsLine(c)); }
  return rows;
}
/** The sheet's SPELLS line: the member's tier in magic, then the spells it knows ("SPELLS (MASTER) Spark, Frost"). */
export function spellsLine(c: Character): string {
  const t = tierOf(c, 'magic');
  return 'SPELLS ' + (t ? `(${TIER_NAMES[t].toUpperCase()}) ` : '') + c.spells.map((s) => spell(s).name).join(', ');
}

/** An exploration spell cast (game/wilds.ts): its lines said and, where it moved the party, what stands there met. */
function explore(g: Game, caster: number, spellId: string, back?: boolean): void {
  const cast = castExplore(g.world, g.party, caster, spellId, back);
  for (const l of cast.lines) g.say(l);
  if (cast.moved) g.enterCell();
}

/** Pick a caster and a spell for the current context. */
export class SpellScreen implements Screen {
  readonly overlay = true;
  private who = -1;
  private sel = 0;
  private context: 'explore';
  private onDone?: () => void;
  constructor(context: 'explore', onDone?: () => void) {
    this.context = context;
    this.onDone = onDone;
  }
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
          g.say(castOnAlly(g.tables.items, c, sp, g.party.members[i]));
        });
      } else if (sp.explore === 'mark' && g.world.state.mark) {
        g.push(new ChoiceScreen('The mark is set. Which?', ['Return to the mark', 'Set it here'], (i) => { if (i >= 0) explore(g, caster, sp.id, i === 0); }, sp.name));
      } else explore(g, caster, sp.id);
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

/** What each kind of business trades in, as its first menu names it (the pilot's quartermaster picks it there, #719). */
export const TRADE: Record<Exclude<Business['kind'], 'npc'>, string> = { inn: 'A room and rations', temple: 'The chapel', shop: 'Buy and sell', guild: 'Study spells', trainer: 'Train' };
/** The sheet's left column, from its edge to the items: what a line there may run to. */
export const SHEET_COL_W = 312;
/** The sheet's lines for a member's skills, learnt or born to: none, or as many as the column needs. */
export const skillsLines = (c: Character): string[] => { const s = skillNames(c); return s.length ? wrap('SKILLS ' + s.join(', '), SHEET_COL_W) : []; };

/** A hall's first menu's line for its guild's skills. */
const LEARN = 'Learn a skill';

/** A person as a menu names them: to the first comma ("Hob", not "Hob, once tenant of Ashcombe"). */
export const shortName = (name: string): string => name.split(',')[0];

/**
 * What a business offers the party on the way in, in order: its own trade (a tavern's is its
 * keeper's words), then a trainer's Expert where it trains to 13 or past, then a guild's work where it
 * is a hall, and its skills where the guild has any built, then "Talk to <name>" for each person there
 * now (`World.peopleAt`); Leave is always last. This is the one place the list is made, and it is made
 * afresh each time it is read, so the people are those there now.
 */
export function businessEntries(g: Game, f: Business): BusinessEntry[] {
  const out: BusinessEntry[] = [f.kind === 'npc' ? { label: 'The talk of the room', open: () => g.talkScreen(f) } : { label: TRADE[f.kind], open: () => trade(g, f) }];
  // A town's trainer from Saltmouth's on teaches Expert at arms and in magic (game/mastery.ts), by its ceiling.
  if (f.kind === 'trainer' && teachesExpert(f.maxLevel)) out.push({ label: EXPERT_ENTRY, open: () => tierMenu(g, f.name) });
  if (f.hall) { const hall = f.hall; out.push({ label: `Work for ${guildShortName(hall)}`, open: () => guildWork(g, hall, f.name) }); }
  // A hall teaches its guild's skills (game/skills.ts), once a skill of theirs is built.
  const taught = f.hall ? taughtBy(f.hall) : [];
  if (taught.length) out.push({ label: LEARN, open: () => skillMenu(g, taught, f.name) });
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
  const hall = b.hall;
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
  const paid = report(g.tables, id, g.world.state, g.party);
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
        const said = take(g.tables, q, g.world.state, g.party);
        g.say(`You take the work: ${q.title}.`);
        if (said.length) { g.push(new MessageScreen(said.join('\n\n'), () => g.push(guildOffers(g, id, hallName)), hallName)); return; }
      }
      g.push(guildOffers(g, id, hallName));
    }, hallName)), hallName));
  }, hallName);
}

/**
 * A guild's skills at one of its halls (game/skills.ts), skill-major (#856): the hall's skills, each
 * with its price and what it does in the note; chosen, who would learn it (`learnerMenu`). Leave goes
 * back a level: to the skills, then to the hall's first menu. A company not of the guild is told so.
 */
export function skillMenu(g: Game, ids: readonly SkillId[], title: string): Screen {
  if (!ids.every((id) => mayLearn(id, g.party))) return new MessageScreen(STRANGER, undefined, title);
  // The words are made when drawn: the menu waits under the members' while the gold is spent.
  return new ChoiceScreen(() => askWhich(g.party), [...ids.map(skillRow), LEAVE_SKILLS], (i) => {
    const id = ids[i];
    if (!id) return;
    g.push(skillMenu(g, ids, title));
    g.push(learnerMenu(g, id, title));
  }, title);
}

/**
 * Who would learn a skill: each member with its price or why not; chosen, it is taught and the menu
 * comes again. A person who teaches one opens here, as a hall's second level does.
 */
export function learnerMenu(g: Game, id: SkillId, title: string): Screen {
  if (!mayLearn(id, g.party)) return new MessageScreen(STRANGER, undefined, title);
  const list = skillOffers(id, g.party);
  return new ChoiceScreen(askSkill(g.party), [...list.map((o) => skillLine(o, g.party)), LEAVE_SKILLS], (i) => {
    const o = list[i];
    if (!o) return;
    const { line } = learn(o.skill, g.party, o.who);
    if (line) g.say(line);
    g.push(learnerMenu(g, id, title));
  }, title, [...list.map((o) => !!o.bar), false]);
}

/**
 * A town trainer's Expert (game/mastery.ts), where it trains to 13 or past: the line asked first, then
 * each member with the price or why not; chosen, it is taught and the members' menu comes again. Leave
 * goes back a level: to the line, then to the trainer's first menu.
 */
export function tierMenu(g: Game, title: string): Screen {
  // The words are made when drawn: the menu waits under the members' while the gold is spent.
  return new ChoiceScreen(() => askLine(g.party), [...LINES.map((l) => LINE_ROWS[l]), LEAVE_TIERS], (i) => {
    const line = LINES[i];
    if (!line) return;
    g.push(tierMenu(g, title));
    g.push(expertMenu(g, line, title));
  }, title);
}

function expertMenu(g: Game, line: Line, title: string): Screen {
  const list = expertOffers(line, g.party);
  return new ChoiceScreen(askTier('expert', g.party), [...list.map((o) => tierLine(o, g.party)), LEAVE_TIERS], (i) => {
    const o = list[i];
    if (!o) return;
    const { said } = teachTier(o.line, o.tier, o.price, g.party, o.who);
    if (said) g.say(said);
    g.push(expertMenu(g, line, title));
  }, title, [...list.map((o) => !!o.bar), false]);
}

/**
 * A Master's person (`npc.mastery`, game/mastery.ts), once their words are said: the company's members
 * of their line, each with the price or why not; chosen, it is taught and the menu comes again. A
 * company with nobody of the line hears so.
 */
export function masterMenu(g: Game, m: Mastery, title: string): Screen {
  const list = masterOffers(m, g.party, g.world.state);
  if (!list.length) return new MessageScreen(noneHere(m.line), undefined, title);
  return new ChoiceScreen(askTier(m.tier, g.party), [...list.map((o) => tierLine(o, g.party)), LEAVE_TIERS], (i) => {
    const o = list[i];
    if (!o) return;
    const { said } = teachTier(o.line, o.tier, o.price, g.party, o.who, favourDone(m, g.world.state, g.party));
    if (said) g.say(said);
    g.push(masterMenu(g, m, title));
  }, title, [...list.map((o) => !!o.bar), false]);
}

// The town's services: each screen draws its menu and says what the rule of game/services.ts returns.
function inn(g: Game, f: Extract<Feature, { kind: 'inn' }>): Screen {
  const cost = nightCost(f, g.party);
  return new ChoiceScreen(`"Welcome to ${f.name}. A night for the six of you is ${cost} gold, supper included." (You have ${g.party.gold}.)`,
    [`Stay the night (${cost} gold)`, `Buy ${RATIONS} rations (${RATIONS_PRICE} gold)`, 'Leave'], (i) => {
      if (i === 0) g.say(stay(g.party, g.world, f).line);
      else if (i === 1) g.say(buyRations(g.party).line);
    }, f.name);
}

function temple(g: Game, f: Extract<Feature, { kind: 'temple' }>): Screen {
  const priceOf = templePrice;
  const names = g.party.members.map((m) => `${m.name}: ${m.conditions.length ? m.conditions.join(', ') : 'well'}\t${priceOf(m) ? `${priceOf(m)}g` : ''}`);
  return new ChoiceScreen(`The Lanterns keep the chapel lit day and night. "Who needs the light?" (${g.party.gold} gold.)`,
    [...names, `Donate ${DONATION} gold`, 'Leave'], (i) => {
      if (i < 0 || i === names.length + 1) return;
      const { line } = i === names.length ? donate(g.party) : cure(g.party, g.party.members[i]);
      if (line) g.say(line);
    }, f.name, [...g.party.members.map((m) => priceOf(m) === 0), false, false]);
}

function shop(g: Game, f: Extract<Feature, { kind: 'shop' }>): Screen {
  return new ChoiceScreen(`"${f.name}. Buying or selling?" (${g.party.gold} gold.)`, ['Buy', 'Sell', 'Leave'], (i) => {
    if (i === 0) g.push(buyScreen(g, f));
    else if (i === 1) g.push(sellScreen(g, f));
  }, f.name);
}

function buyScreen(g: Game, f: Extract<Feature, { kind: 'shop' }>): Screen {
  const names = f.stock.map((id) => `${item(g.tables.items, id).name}\t${priceIn(g.tables.items, f, id)}g\t${describe(g.tables.items, id)}`);
  const s: ChoiceScreen = new ChoiceScreen(`What will it be? (${g.party.gold} gold.)`, [...names, 'Done'], (i) => {
    if (i < 0 || i === names.length) return;
    const d = buy(g.tables.items, g.party, f, f.stock[i]);
    if (!d) { g.say('Not enough gold.'); g.push(buyScreen(g, f)); return; }
    if (d.use?.food) g.say(`Bought ${d.name}: food is now ${g.party.food}.`);
    else g.say(`Bought ${d.name}.`);
    const next = buyScreen(g, f); (next as ChoiceScreen).sel = i; g.push(next);
  }, f.name, [...f.stock.map((id) => priceIn(g.tables.items, f, id) > g.party.gold), false]);
  return s;
}

function sellScreen(g: Game, f: Extract<Feature, { kind: 'shop' }>): Screen {
  const entries: { id: string; owner: string[]; label: string }[] = [];
  const pays = (id: string): number => sellPrice(g.tables.items, g.party, item(g.tables.items, id).price);
  // An artifact shows no price, and no shop takes one (#847).
  const row = (id: string, whose: string): string => `${item(g.tables.items, id).name} (${whose})${item(g.tables.items, id).artifact ? '' : `\t${pays(id)}g`}`;
  for (const id of g.party.bag) entries.push({ id, owner: g.party.bag, label: row(id, 'bag') });
  for (const m of g.party.members) for (const id of m.pack) entries.push({ id, owner: m.pack, label: row(id, m.name) });
  if (!entries.length) return new MessageScreen('"You have nothing I want."', undefined, f.name);
  return new ChoiceScreen('"Let me see it."', [...entries.map((e) => e.label), 'Done'], (i) => {
    if (i < 0 || i === entries.length) return;
    const e = entries[i];
    g.say(sell(g.tables.items, g.party, e.owner, e.id).line);
    g.push(sellScreen(g, f));
  }, f.name);
}

/** A ware as a shop shows it: a weapon's dice and the element its blows carry, armour's AC, a draught's use; then the stats it raises. */
export function describe(items: Items, id: string): string {
  const d = items[id];
  const raises = STATS.filter((s) => d.stat?.[s]).map((s) => ` ${s}${signed(d.stat?.[s] ?? 0)}`).join('');
  if (d.slot === 'weapon') return `${d.dice}d${d.sides}${d.bonus ? '+' + d.bonus : ''}${d.ranged ? ' ranged' : ''}${d.twoHanded ? ' 2h' : ''}${d.element ? ' ' + d.element : ''}${raises}`;
  if (d.ac) return `AC+${d.ac}${raises}`;
  if (d.use?.heal) return `heals ${d.use.heal}`;
  if (d.use?.sp) return `${d.use.sp} SP`;
  if (d.use?.food) return `${d.use.food} food`;
  return raises.trim();
}

function guild(g: Game, f: Extract<Feature, { kind: 'guild' }>): Screen {
  if (!joined(g.party, f)) {
    return new ChoiceScreen(`"${f.name}. The fee to study here is ${f.fee} gold, paid once." (${g.party.gold} gold.)`, [`Pay the fee (${f.fee} gold)`, 'Leave'], (i) => {
      if (i !== 0) return;
      const { done, line } = payFee(g.party, f);
      g.say(line);
      if (done) g.push(guild(g, f));
    }, f.name);
  }
  // Spells up to the guild's tier for sale, per caster; the price climbs with the tier.
  const offers = hallOffers(g.party, f);
  if (!offers.length) return new MessageScreen('"We have taught you all we can for now. Come back when you have grown."', undefined, f.name);
  return new ChoiceScreen(`"What would you learn?" (${g.party.gold} gold.)`, [...offers.map((o) => `${g.party.members[o.who].name}: ${spell(o.id).name}\t${o.price}g\t${spell(o.id).text}`), 'Leave'], (i) => {
    if (i < 0 || i === offers.length) return;
    g.say(learnSpell(g.party, offers[i]).line);
    g.push(guild(g, f));
  }, f.name, [...offers.map((o) => o.price > g.party.gold), false]);
}

function trainer(g: Game, f: Extract<Feature, { kind: 'trainer' }>): Screen {
  const cost = trainPrice;
  const can = g.party.members.map((c) => mayTrain(c, f.maxLevel));
  const names = g.party.members.map((c, i) => `${c.name}  L${c.level}\t${can[i] ? `train ${cost(c)}g` : c.level >= f.maxLevel ? 'beyond me' : `needs ${xpForLevel(c.level + 1) - c.xp} xp`}`);
  return new ChoiceScreen(`"${f.name}. I train to level ${f.maxLevel}. Who is ready?" (${g.party.gold} gold.)`, [...names, 'Leave'], (i) => {
    if (i < 0 || i === names.length) return;
    const { line } = train(g.party, g.party.members[i], g.rng, f.maxLevel);
    if (line) g.say(line);
    g.push(trainer(g, f));
  }, f.name, [...can.map((x) => !x), false]);
}

export { lineHeight };
