// Modal screens over the exploration frame: messages, choices, the character sheet, the spell
// picker, and the town services (inn, temple, shop, guild, trainer).
import type { Game, Screen } from '../game/game.ts';
import type { Action } from '../input.ts';
import { is } from '../input.ts';
import { drawText, lineHeight } from '../lib/engine/text.ts';
import { panel, paragraph, menu } from './draw.ts';
import { LAYOUT, drawPartyCards } from './frame.ts';
import { drawPortraitLarge } from './portraits.ts';
import { BRASS, TEXT, TEXT_DIM, YELLOW, RED } from './palette.ts';
import type { Feature } from '../game/map.ts';
import { item, ITEMS } from '../game/items.ts';
import { spell, spellsFor } from '../game/spells.ts';
import { CLASSES, RACES, TRAITS, STATS, armorClass, attackBonus, equip, heal, removeCondition, isDown, hasCondition, xpForLevel, levelUp, rest, canTrain, MAX_LEVEL } from '../game/party.ts';
import { castOnAlly } from '../game/combat.ts';
import type { Character } from '../game/party.ts';

const BOX = { x: 40, y: 40, w: 560, h: 220 };

export class MessageScreen implements Screen {
  readonly overlay = true;
  constructor(private text: string, private then?: () => void, private title = '') {}
  update(g: Game, a: Action | null): void {
    if (is(a, 'interact', 'cancel')) { g.pop(); this.then?.(); }
  }
  render(g: Game, ctx: CanvasRenderingContext2D): void {
    panel(ctx, BOX.x, BOX.y, BOX.w, BOX.h);
    let y = BOX.y + 10;
    if (this.title) { drawText(ctx, this.title, BOX.x + 12, y, { size: 1, color: BRASS }); y += 14; }
    paragraph(ctx, this.text, BOX.x + 12, y, BOX.w - 24, { color: TEXT, maxLines: 14 });
    drawText(ctx, 'SPACE', BOX.x + BOX.w - 12, BOX.y + BOX.h - 12, { size: 1, color: TEXT_DIM, align: 'right' });
  }
}

export class ChoiceScreen implements Screen {
  readonly overlay = true;
  sel = 0;
  constructor(private text: string, private options: string[], private then: (i: number) => void, private title = '', private disabled: boolean[] = []) {}
  update(g: Game, a: Action | null): void {
    if (!a) return;
    if (is(a, 'up')) this.sel = (this.sel + this.options.length - 1) % this.options.length;
    else if (is(a, 'down')) this.sel = (this.sel + 1) % this.options.length;
    else if (is(a, 'cancel')) { g.pop(); this.then(-1); }
    else if (is(a, 'interact')) { if (this.disabled[this.sel]) return; g.pop(); this.then(this.sel); }
    else if (/^n[1-9]$/.test(a)) { const i = Number(a[1]) - 1; if (i < this.options.length && !this.disabled[i]) { g.pop(); this.then(i); } }
  }
  render(g: Game, ctx: CanvasRenderingContext2D): void {
    const h = Math.min(300, 40 + this.options.length * 11 + 40);
    panel(ctx, BOX.x, BOX.y, BOX.w, h);
    let y = BOX.y + 10;
    if (this.title) { drawText(ctx, this.title, BOX.x + 12, y, { size: 1, color: BRASS }); y += 14; }
    y = paragraph(ctx, this.text, BOX.x + 12, y, BOX.w - 24, { color: TEXT, maxLines: 6 }) + 6;
    menu(ctx, this.options, BOX.x + 12, y, this.sel, { disabled: this.disabled });
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
      } else g.say(`${d.name}: nothing to do with it here.`);
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
    drawText(ctx, `${c.name}  ${RACES[c.race].name} ${CLASSES[c.cls].name}  LEVEL ${c.level}`, 20, 18, { size: 1, color: BRASS });
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

export function serviceScreen(g: Game, f: Feature): Screen {
  switch (f.kind) {
    case 'inn': return inn(g, f);
    case 'temple': return temple(g, f);
    case 'shop': return shop(g, f);
    case 'guild': return guild(g, f);
    case 'trainer': return trainer(g, f);
    default: return new MessageScreen('...');
  }
}

function inn(g: Game, f: Extract<Feature, { kind: 'inn' }>): Screen {
  const cost = f.price * g.party.members.length;
  return new ChoiceScreen(`"Welcome to ${f.name}. A night for the six of you is ${cost} gold, supper included." (You have ${g.party.gold}.)`,
    [`Stay the night (${cost} gold)`, `Buy 10 rations (${20} gold)`, 'Leave'], (i) => {
      if (i === 0) {
        if (g.party.gold < cost) { g.say('You cannot afford a room.'); return; }
        g.party.gold -= cost;
        for (const m of g.party.members) rest(m);
        // Sleep until 07:00.
        const w = g.world; const mins = ((7 * 60) - (w.state.minutes % 1440) + 1440) % 1440 || 1440; w.advance(mins);
        g.say('You sleep well. Morning.');
      } else if (i === 1) {
        if (g.party.gold < 20) { g.say('Not enough gold.'); return; }
        g.party.gold -= 20; g.party.food += 10; g.say('The kitchen packs you ten days of rations.');
      }
    }, f.name);
}

function temple(g: Game, f: Extract<Feature, { kind: 'temple' }>): Screen {
  const priceOf = (c: Character): number => hasCondition(c, 'dead') ? 100 * c.level : hasCondition(c, 'stoned') ? 80 * c.level : c.conditions.length ? 25 : 0;
  const names = g.party.members.map((m) => `${m.name}: ${m.conditions.length ? m.conditions.join(', ') : 'well'}${priceOf(m) ? ` (${priceOf(m)} gold)` : ''}`);
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
  const names = f.stock.map((id) => `${item(id).name}  ${item(id).price}g${describe(id)}`);
  const s: ChoiceScreen = new ChoiceScreen(`What will it be? (${g.party.gold} gold.)`, [...names, 'Done'], (i) => {
    if (i < 0 || i === names.length) return;
    const id = f.stock[i], d = item(id);
    if (g.party.gold < d.price) { g.say('Not enough gold.'); g.push(buyScreen(g, f)); return; }
    g.party.gold -= d.price;
    if (d.use?.food) { g.party.food += d.use.food; g.say(`Bought ${d.name}: food is now ${g.party.food}.`); }
    else { g.party.bag.push(id); g.say(`Bought ${d.name}.`); }
    const next = buyScreen(g, f); (next as ChoiceScreen).sel = i; g.push(next);
  }, f.name, [...f.stock.map((id) => item(id).price > g.party.gold), false]);
  return s;
}

function sellScreen(g: Game, f: Extract<Feature, { kind: 'shop' }>): Screen {
  const entries: { id: string; owner: string[]; label: string }[] = [];
  for (const id of g.party.bag) entries.push({ id, owner: g.party.bag, label: `${item(id).name} (bag)  ${sellPrice(id)}g` });
  for (const m of g.party.members) for (const id of m.pack) entries.push({ id, owner: m.pack, label: `${item(id).name} (${m.name})  ${sellPrice(id)}g` });
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
  if (d.slot === 'weapon') return `  ${d.dice}d${d.sides}${d.bonus ? '+' + d.bonus : ''}${d.ranged ? ' ranged' : ''}${d.twoHanded ? ' 2h' : ''}`;
  if (d.ac) return `  AC+${d.ac}`;
  if (d.use?.heal) return `  heals ${d.use.heal}`;
  if (d.use?.sp) return `  ${d.use.sp} SP`;
  if (d.use?.food) return `  ${d.use.food} food`;
  return '';
}

function guild(g: Game, f: Extract<Feature, { kind: 'guild' }>): Screen {
  const members = g.party.members.map((m, i) => ({ m, i })).filter(({ m }) => f.classes.includes(m.cls));
  const joined = !!g.party.flags[`guild_${f.name}`];
  if (!joined) {
    return new ChoiceScreen(`"${f.name}. Membership is ${f.fee} gold, and buys the right to study our spells." (${g.party.gold} gold.)`, [`Join (${f.fee} gold)`, 'Leave'], (i) => {
      if (i !== 0) return;
      if (g.party.gold < f.fee) { g.say('Not enough gold.'); return; }
      g.party.gold -= f.fee; g.party.flags[`guild_${f.name}`] = 1; g.say('You are members of the guild.');
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
  return new ChoiceScreen(`"What would you learn?" (${g.party.gold} gold.)`, [...offers.map((o) => `${g.party.members[o.who].name}: ${spell(o.id).name}  ${o.price}g`), 'Leave'], (i) => {
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

/** What a trainer charges to teach the next level: 25 a level to 5, 40 a level after. */
export function trainPrice(c: Character): number { return c.level < 5 ? c.level * 25 : c.level * 40; }

function trainer(g: Game, f: Extract<Feature, { kind: 'trainer' }>): Screen {
  const cost = trainPrice;
  const can = g.party.members.map((c) => c.level < f.maxLevel && canTrain(c) && !isDown(c));
  const names = g.party.members.map((c, i) => `${c.name}  L${c.level}  ${can[i] ? `train (${cost(c)}g)` : c.level >= f.maxLevel ? 'beyond me' : `needs ${xpForLevel(c.level + 1) - c.xp} xp`}`);
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
