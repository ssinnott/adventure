// The combat screen: draws the fight over the viewport and turns menu input into PartyActions for
// the resolver in game/combat.ts. Monster turns play out on a short timer so the log can be read. With
// `auto` on, the game's bot (game/bot.ts) plays the company's turns on a timer of its own, by what the
// fight has shown it, and presses Space at the end; any key takes the fight back. With the feats on
// (#1113) a knight's, barbarian's, thief's or monk's Cast reads Feat, its list the feats and then any
// artifact's spell it bears, and its card shows its stamina where a caster's shows spell points.
import type { Host, Screen } from './screen.ts';
import type { Action } from './actions.ts';
import { is } from './actions.ts';
import { ListMenu } from './menu.ts';
import { drawText } from '../lib/engine/text.ts';
import { panel, menu } from './draw.ts';
import { LAYOUT, drawPartyCards, drawStatus, drawPurse, drawViewportFrame, cardRect, logTail, COMBAT_LOG_LINES } from './frame.ts';
import { drawMonsterSprite } from './sprites.ts';
import { drawViewport, drawWeather } from './viewport.ts';
import { BRASS, TEXT, TEXT_DIM, RED, YELLOW, GREEN } from './palette.ts';
import { currentTurn, partyAct, monsterAct, meetCalled, aliveMonsters, canAttackFromRow, canReach, shareRange } from '../game/combat.ts';
import type { CombatState, PartyAction, TurnRef } from '../game/combat.ts';
import { FEATS, aimable, builds, featsOn, featsKnown, featsOf, staminaOf } from '../game/combat/feats.ts';
import { botTurn, asSeen, PLAYED } from '../game/bot.ts';
import { spell, ELEMENTS } from '../game/spells.ts';
import type { Element } from '../game/spells.ts';
import { item, chargesLeft } from '../game/items.ts';
import { weaponOf, borne } from '../game/party.ts';
import type { Character, Party } from '../game/party.ts';
import { groupLabels, crown, MARKER_RISE, LABEL_TOP } from './grouplabels.ts';
import type { LabelLine } from './grouplabels.ts';
import { seatRow } from './row.ts';
import type { Tables } from '../game/tables.ts';

type Mode = 'menu' | 'target' | 'spell' | 'spellTarget' | 'element' | 'item' | 'itemTarget' | 'feat' | 'featTarget' | 'done';
const MONSTER_DELAY = 22;
/** The frames the bot waits on a company's turn, or on the finished fight, before it acts (`auto`). */
const BOT_DELAY = 22;

/** What a member may cast in a fight: the spells they know, then each artifact's they bear (#847), whatever they know. */
function castable(tables: Tables, c: Character): { id: string; from?: string }[] {
  const { items } = tables, arts = borne(items, c).filter((id) => item(items, id).casts && spell(tables.spells, item(items, id).casts!.spell).context !== 'explore').map((id) => ({ id: item(items, id).casts!.spell, from: id }));
  return [...c.spells.filter((x) => spell(tables.spells, x).context !== 'explore').map((id) => ({ id })), ...arts];
}
/** The fight's spell list: each row's words, a spell's cost or an artifact's castings left ("Grasping Roots (3 LEFT)"), and whether it is out of reach. */
export const castRows = (tables: Tables, party: Party, c: Character): { label: string; disabled: boolean }[] => castable(tables, c).map((e) => {
  const left = e.from ? chargesLeft(tables.items, party, e.from) : 0;
  return { label: `${spell(tables.spells, e.id).name} (${e.from ? `${left} LEFT` : spell(tables.spells, e.id).sp})`, disabled: e.from ? left < 1 : spell(tables.spells, e.id).sp > c.sp };
});
/** What a member may use in a fight: the draughts and the like in its pack and the company's bag, each once, but food. */
const usable = (tables: Tables, party: Party, who: number): string[] =>
  [...new Set([...party.members[who].pack, ...party.bag].filter((id) => item(tables.items, id).use && !item(tables.items, id).use!.food))];
/**
 * The fight's commands for member `who`: Attack with its weapon, Cast, Use, Defend and Flee, each
 * barred where it has nothing to do. With the feats on (#1113) one of the four that build stamina has
 * Feat in Cast's place, which opens its feats and then any artifact's spell it bears.
 */
export function commandRows(tables: Tables, party: Party, s: CombatState, who: number): { label: string; key: string; disabled: boolean }[] {
  const c = party.members[who], w = weaponOf(tables.items, c), spells = castable(tables, c);
  return [
    { label: `Attack (${w.name})`, key: 'attack', disabled: !canAttackFromRow(tables.items, c, who) },
    featsOn(s) && builds(c) ? { label: 'Feat', key: 'feat', disabled: !featsKnown(c).length && !spells.length } : { label: 'Cast', key: 'cast', disabled: !spells.length },
    { label: 'Use', key: 'use', disabled: !usable(tables, party, who).length },
    { label: 'Defend', key: 'defend', disabled: false },
    { label: 'Flee', key: 'flee', disabled: false },
  ];
}
/** The fight's feat list (#1113): each feat member `who` has at its level, with its cost ("Rally (4)"), barred where it may not use it now; then its artifacts' spells, as the spell list has them. */
export function featRows(tables: Tables, party: Party, s: CombatState, who: number): { label: string; disabled: boolean }[] {
  const ready = featsOf(s, party, who);
  return [...featsKnown(party.members[who]).map((f) => ({ label: `${f.name} (${f.cost})`, disabled: !ready.includes(f) })), ...castRows(tables, party, party.members[who])];
}

export class CombatScreen implements Screen {
  /** Its backdrop is the view, painted whole over the view's rect (`render`), so exploring beneath leaves it undrawn. */
  readonly paintsView = true;
  /** Both delays count as none: the combat tests set it, as a pilot's `instant` does (app/pilot/pilot.ts). */
  static instant = false;
  /** The bot plays the company's turns and leaves the fight at its end, until a key takes it back (#713). */
  auto = false;
  private botTimer = 0;
  private mode: Mode = 'menu';
  /** The command menu's cursor (`sel`). */
  private readonly commands = new ListMenu();
  /** One cursor for the lists the commands open, as each opens (`sub`): a target, a spell, an item, an element, a member. */
  private readonly list = new ListMenu();
  private get sel(): number { return this.commands.sel; }
  private set sel(row: number) { this.commands.sel = row; }
  private get sub(): number { return this.list.sel; }
  private set sub(row: number) { this.list.sel = row; }
  private timer = 0;
  private pendingSpell = '';
  /** The artifact the pending spell is cast from, if any (#847): a charge and no spell points. */
  private pendingFrom = '';
  private pendingItem = '';
  /** The feat chosen, waiting on its target (#1113). */
  private pendingFeat = '';
  /**
   * Whose turn it is as the last `update` left it, for `render` to read; unset until the first. `update` is the
   * only place the screen walks the turn on (`currentTurn` rolls a sleeper's waking and, at a round's end, the next
   * round's speeds on the game's generator), so that drawing the fight moves nothing of it.
   */
  private turn: TurnRef | null | undefined;
  /** Frames of red flash left on each party card, set when a member loses hp. */
  private cardFlash: number[] = [];
  private lastHp: number[] = [];
  /** Sparks: position, velocity, life. */
  private sparks: { x: number; y: number; vx: number; vy: number; life: number; col: string }[] = [];
  private lastMonsterHp: number[] = [];
  /** How many groups the fight held when last looked at: a call adds one (`meetCalled`). */
  private bands: number;
  /** The group labels as last painted, for the smoke test to read. */
  labels: LabelLine[] = [];
  readonly state: CombatState;
  readonly groupIds: string[];
  constructor(state: CombatState, groupIds: string[]) {
    this.state = state;
    this.groupIds = groupIds;
    this.lastMonsterHp = state.monsters.map((m) => m.hp);
    this.bands = state.groupIds.length;
  }

  private burst(x: number, y: number, col: string, n = 10): void {
    for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, s = 1 + Math.random() * 2.5; this.sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, life: 10 + Math.random() * 8, col }); }
  }

  private options(g: Host, who: number): { label: string; key: string; disabled: boolean }[] { return commandRows(g.tables, g.party, this.state, who); }
  /** What the member may aim at: a weapon what it reaches, a feat the foes it may be aimed at (`aimable`), a spell anyone still in the fight. */
  private targets(g: Host, who: number): number[] {
    const alive = aliveMonsters(this.state), c = g.party.members[who], f = this.mode === 'featTarget' ? FEATS.find((x) => x.id === this.pendingFeat) : undefined;
    return this.mode === 'target' ? alive.filter((i) => canReach(this.state, c, i)) : f ? alive.filter((i) => aimable(this.state, c, f, i)) : alive;
  }
  private usable(g: Host, who: number): string[] { return usable(g.tables, g.party, who); }

  /** The frames a delay counts: none while fights are played at once (`instant`, or the pilot's). */
  private wait(g: Host, n: number): number { return CombatScreen.instant || g.instant ? 0 : n; }

  update(g: Host, a: Action | null): void {
    this.step(g, a);
    // Once the tick's act is done the turn walks on, past anyone who cannot act and at a round's end into the next
    // round, here and not in the next frame drawn: a frame after it shows the turn that is to be played. Where the
    // turn is settled the walk draws nothing.
    this.turn = currentTurn(this.state, g.party, g.rng);
    // The hit flash counts ticks, not frames: one off at the end of every tick, however it returned.
    for (const m of this.state.monsters) if (m.flash > 0) m.flash--;
  }

  private step(g: Host, a: Action | null): void {
    const s = this.state;
    // A key while the bot fights takes the fight back, and is then handled as usual. Else the bot
    // presses Space on the finished fight itself, so it never waits there.
    if (this.auto && a) { this.auto = false; this.botTimer = 0; }
    if (this.auto && s.outcome !== 'ongoing') {
      this.mode = 'done';
      if (++this.botTimer >= this.wait(g, BOT_DELAY)) { this.botTimer = 0; g.afterCombat(this.groupIds, s.outcome); }
      return;
    }
    if (s.outcome !== 'ongoing') {
      this.mode = 'done';
      if (is(a, 'interact', 'cancel')) g.afterCombat(this.groupIds, s.outcome);
      return;
    }
    const t = currentTurn(s, g.party, g.rng);
    if (!t) { this.mode = 'done'; return; }
    if (t.side === 'monster') {
      if (++this.timer >= this.wait(g, MONSTER_DELAY) || is(a, 'interact')) { this.timer = 0; monsterAct(s, g.party, g.rng); this.bands = meetCalled(g.world, s, this.bands); }
      return;
    }
    if (this.auto) {
      if (++this.botTimer >= this.wait(g, BOT_DELAY)) { this.botTimer = 0; botTurn(s, g.party, g.rng, t.i, asSeen, PLAYED); this.mode = 'menu'; this.sel = 0; }
      return;
    }
    if (!a) return;
    const who = t.i;
    const alive = this.targets(g, who);
    const act = (action: PartyAction) => { if (partyAct(s, g.party, g.rng, action)) { this.mode = 'menu'; this.sel = 0; } };
    const cast = (target: number, element?: Element) => act({ type: 'cast', spellId: this.pendingSpell, target, ...(element ? { element } : {}), ...(this.pendingFrom ? { from: this.pendingFrom } : {}) });
    switch (this.mode) {
      case 'menu': {
        const opts = this.options(g, who);
        if (this.commands.press(a, { n: opts.length, barred: (i) => opts[i].disabled, digits: 'act' }) === 'chosen') {
          const o = opts[this.sel];
          if (o.key === 'attack') { this.mode = 'target'; this.sub = 0; }
          else if (o.key === 'cast') { this.mode = 'spell'; this.sub = 0; }
          else if (o.key === 'feat') { this.mode = 'feat'; this.sub = 0; }
          else if (o.key === 'use') { this.mode = 'item'; this.sub = 0; }
          else if (o.key === 'defend') act({ type: 'defend' });
          else if (o.key === 'flee') act({ type: 'flee' });
        }
        break;
      }
      case 'target': {
        if (is(a, 'cancel')) { this.mode = 'menu'; return; }
        if (this.list.press(a, { n: alive.length, across: true }) === 'chosen') act({ type: 'attack', target: alive[this.sub] });
        break;
      }
      case 'spell': {
        const c = g.party.members[who];
        const list = castable(g.tables, g.party.members[who]);
        if (is(a, 'cancel')) { this.mode = 'menu'; return; }
        if (this.list.press(a, { n: list.length }) === 'chosen') {
          const e = list[this.sub], sp = spell(g.tables.spells, e.id);
          if (e.from ? chargesLeft(g.tables.items, g.party, e.from) < 1 : c.sp < sp.sp) { g.say(e.from ? 'Nothing left in it until dawn.' : 'Not enough spell points.'); return; }
          this.pendingSpell = sp.id;
          this.pendingFrom = e.from ?? '';
          if (sp.glass) { this.mode = 'element'; this.sub = 0; }
          else if (sp.target === 'enemy' || sp.target === 'group') { this.mode = 'spellTarget'; this.sub = 0; }
          else if (sp.target === 'ally') { this.mode = 'itemTarget'; this.pendingItem = ''; this.sub = who; }
          else cast(0);
        }
        break;
      }
      case 'spellTarget': {
        if (is(a, 'cancel')) { this.mode = 'spell'; this.sub = 0; return; }
        if (this.list.press(a, { n: alive.length, across: true }) === 'chosen') cast(alive[this.sub]);
        break;
      }
      case 'feat': {
        // The feats it has (#1113), each barred where it may not use it now; past them its artifacts'
        // spells, which go on as the spell list's do.
        const rows = featRows(g.tables, g.party, s, who), known = featsKnown(g.party.members[who]);
        if (is(a, 'cancel')) { this.mode = 'menu'; return; }
        if (this.list.press(a, { n: rows.length, barred: (i) => rows[i].disabled }) === 'chosen') {
          const f = known[this.sub];
          if (!f) { this.mode = 'spell'; this.sub -= known.length; this.step(g, a); return; }
          this.pendingFeat = f.id;
          if (f.target === 'none') act({ type: 'feat', featId: f.id, target: 0 });
          else { this.mode = 'featTarget'; this.sub = 0; }
        }
        break;
      }
      case 'featTarget': {
        if (is(a, 'cancel')) { this.mode = 'feat'; this.sub = 0; return; }
        if (this.list.press(a, { n: alive.length, across: true }) === 'chosen') act({ type: 'feat', featId: this.pendingFeat, target: alive[this.sub] });
        break;
      }
      case 'item': {
        const items = this.usable(g, who);
        if (is(a, 'cancel')) { this.mode = 'menu'; return; }
        if (this.list.press(a, { n: items.length }) === 'chosen') { this.pendingItem = items[this.sub]; this.mode = 'itemTarget'; this.sub = who; }
        break;
      }
      case 'element': {
        // Lampglass: what the party is to take half from.
        if (is(a, 'cancel')) { this.mode = 'spell'; this.sub = 0; return; }
        if (this.list.press(a, { n: ELEMENTS.length }) === 'chosen') cast(0, ELEMENTS[this.sub]);
        break;
      }
      case 'itemTarget': {
        if (is(a, 'cancel')) { this.mode = this.pendingItem ? 'item' : 'spell'; this.sub = 0; return; }
        // The members' rows, in the party's order: a digit names one and moves there, and Space chooses.
        if (this.list.press(a, { n: g.party.members.length, across: true, digits: 'move' }) === 'chosen') {
          if (this.pendingItem) act({ type: 'use', itemId: this.pendingItem, target: this.sub });
          else cast(this.sub);
        }
        break;
      }
      case 'done': break;
    }
  }

  render(g: Host, ctx: CanvasRenderingContext2D, frame: number): void {
    const s = this.state;
    const v = LAYOUT.view;
    // Detect damage since the last frame for the flashes and sparks.
    if (!this.lastHp.length) this.lastHp = g.party.members.map((m) => m.hp);
    g.party.members.forEach((m, i) => { if (m.hp < this.lastHp[i]) { this.cardFlash[i] = 10; const c = cardRect(i); this.burst(c.x + 22, c.y + 38, '#ff6a4a', 6); } this.lastHp[i] = m.hp; });
    // Backdrop: the place the fight happens in, as the viewport shows it, dimmed a touch. The
    // weather falls in front of the monsters, below.
    drawViewport(ctx, g.world, v, () => null, frame, false);
    ctx.fillStyle = 'rgba(10,8,12,0.28)'; ctx.fillRect(v.x, v.y, v.w, v.h);
    // Under the Core's clock (`Clock`) the light through the roof goes out a step a round, the dark
    // closing on a shaft of it that narrows to a thread at the last step, and holds.
    const clock = s.clock;
    if (clock?.dim) {
      const k = clock.dim / clock.dims, w = Math.max(2, Math.round(v.w * 0.3 * (1 - k)));
      ctx.fillStyle = `rgba(4,3,8,${(0.62 * k).toFixed(3)})`; ctx.fillRect(v.x, v.y, v.w, v.h);
      ctx.fillStyle = `rgba(232,228,216,${(0.06 + 0.12 * k).toFixed(3)})`; ctx.fillRect(v.x + Math.round((v.w - w) / 2), v.y, w, v.h);
    }
    // Monsters in a row, grouped, with a marker on the targeted one. A back rank has a row of its own,
    // behind the front and smaller, each of it between two of the front (ui/row.ts).
    const alive = aliveMonsters(s);
    // Whose turn it is, as the last tick left it (`turn`); a fight drawn before its first tick, pushed in the tick
    // that opens it, shows the order's first.
    const t = this.turn === undefined ? s.order[s.turn] ?? null : this.turn;
    const targeting = (this.mode === 'target' || this.mode === 'spellTarget' || this.mode === 'featTarget') && t?.side === 'party';
    const aimed = targeting && t ? this.targets(g, t.i)[this.sub] : -1;
    const row = seatRow(alive.map((mi) => s.monsters[mi]), v.w, v.h);
    // Painted from the back forward, so a tall boss on the third rank stands before its own and a
    // group's front before its back rank.
    const seats = alive.map((mi, k) => ({ mi, k, ...row[k] })).sort((a, b) => a.foot - b.foot || a.k - b.k);
    seats.forEach(({ mi, x: across, foot, h }) => {
      const m = s.monsters[mi];
      const x = v.x + across, y = v.y + foot, top = crown(m.def.size, h);
      // One called in since is taken as it comes; one that mends is followed up as well as down.
      const was = this.lastMonsterHp[mi] ?? m.hp;
      if (m.hp < was) this.burst(x, y - h * 0.5, m.hp <= 0 ? '#ffffff' : '#ffd070');
      this.lastMonsterHp[mi] = m.hp;
      const asleep = m.conditions.includes('asleep');
      drawMonsterSprite(ctx, m.def.sprite, x, y, h, m.def.tint, asleep ? 0.6 : 1, frame + mi * 11, m.flash > 0);
      const hpFrac = m.hp / m.def.hp;
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(Math.round(x - 14), Math.round(y + 3), 28, 3);
      ctx.fillStyle = hpFrac > 0.5 ? GREEN : hpFrac > 0.25 ? YELLOW : RED; ctx.fillRect(Math.round(x - 14), Math.round(y + 3), Math.round(28 * hpFrac), 3);
      if (mi === aimed) drawText(ctx, '↓', x, y - top - MARKER_RISE, { size: 1, color: YELLOW, align: 'center' });
      if (t && t.side === 'monster' && t.i === mi) drawText(ctx, '*', x, y - top - MARKER_RISE, { size: 1, color: RED, align: 'center' });
      if (asleep) drawText(ctx, 'z', x + 10, y - top - 2, { size: 1, color: TEXT_DIM });
    });
    // Sparks.
    for (const p of this.sparks) { ctx.fillStyle = p.col; ctx.globalAlpha = Math.min(1, p.life / 8); ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2); p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life--; }
    ctx.globalAlpha = 1;
    this.sparks = this.sparks.filter((p) => p.life > 0);
    drawWeather(ctx, g.world, v, frame);
    // Group labels: each kind in a group with its count of the living (ui/grouplabels.ts).
    this.labels = groupLabels(s.monsters, v.w);
    for (const l of this.labels) drawText(ctx, l.text, v.x + l.x, v.y + LABEL_TOP + l.y, { size: 1, color: TEXT_DIM });
    // Log: wrapped as the exploring log is, so a look of two lines shows whole.
    const lines = logTail(s.log, COMBAT_LOG_LINES);
    const lh = lines.length * 10 + 6;
    ctx.fillStyle = 'rgba(10,8,12,0.75)'; ctx.fillRect(v.x, v.y + v.h - lh, v.w, lh);
    lines.forEach((l, i) => drawText(ctx, l.text, v.x + 6, v.y + v.h - lh + 4 + i * 10, { size: 1, color: l.latest ? TEXT : TEXT_DIM }));

    drawViewportFrame(ctx);
    drawStatus(ctx, g.world);
    drawPurse(ctx, g.party);
    // Right column: the action menu.
    const r = LAYOUT.map;
    panel(ctx, r.x, r.y, r.w, r.h);
    drawText(ctx, `ROUND ${s.round}`, r.x + 8, r.y + 8, { size: 1, color: TEXT_DIM });
    if (this.auto) drawText(ctx, 'AUTO', r.x + r.w - 8, r.y + 8, { size: 1, color: TEXT_DIM, align: 'right' });
    // The keys' hint at the panel's foot; while the bot fights, the one that takes the fight back, and in
    // attract mode (#722) the one that leaves it, as no key but P and T is the fight's.
    const hint = (keys: string): void => { drawText(ctx, g.attracting ? 'ANY KEY FOR THE TITLE' : this.auto ? 'P TAKES THE FIGHT BACK' : keys, r.x + r.w - 8, r.y + r.h - 12, { size: 1, color: TEXT_DIM, align: 'right' }); };
    if (s.outcome !== 'ongoing') {
      drawText(ctx, s.outcome === 'victory' ? 'VICTORY' : s.outcome === 'fled' ? 'ESCAPED' : 'DEFEAT', r.x + 8, r.y + 24, { size: 2, color: s.outcome === 'defeat' ? RED : BRASS });
      if (s.loot) {
        const [least, most] = shareRange(s.loot);
        drawText(ctx, `${least === most ? s.loot.xp : `${least}-${most}`} XP  ${s.loot.gold} GOLD`, r.x + 8, r.y + 48, { size: 1, color: TEXT });
        s.loot.items.slice(0, 6).forEach((id, i) => drawText(ctx, item(g.tables.items, id).name, r.x + 8, r.y + 62 + i * 10, { size: 1, color: TEXT }));
        if (s.loot.ready.length) drawText(ctx, `READY TO TRAIN: ${s.loot.ready.join(', ')}`, r.x + 8, r.y + 130, { size: 1, color: YELLOW });
      }
      hint('SPACE');
    } else if (t && t.side === 'party') {
      const c = g.party.members[t.i];
      drawText(ctx, `${c.name.toUpperCase()}'S TURN`, r.x + 8, r.y + 22, { size: 1, color: BRASS });
      let y = r.y + 40;
      if (this.mode === 'menu') {
        const opts = this.options(g, t.i);
        menu(ctx, opts.map((o) => o.label), r.x + 8, y, this.sel, { disabled: opts.map((o) => o.disabled) });
        if (!canAttackFromRow(g.tables.items, c, t.i)) drawText(ctx, 'BACK ROW: NEEDS A RANGED WEAPON', r.x + 8, r.y + r.h - 24, { size: 1, color: TEXT_DIM });
      } else if (this.mode === 'target' || this.mode === 'spellTarget' || this.mode === 'featTarget') {
        drawText(ctx, 'TARGET', r.x + 8, y, { size: 1, color: TEXT_DIM }); y += 12;
        menu(ctx, this.targets(g, t.i).map((mi) => `${s.monsters[mi].def.name} ${s.monsters[mi].hp}/${s.monsters[mi].def.hp}`), r.x + 8, y, this.sub);
      } else if (this.mode === 'spell') {
        const rows = castRows(g.tables, g.party, c);
        drawText(ctx, `SPELL  (SP ${c.sp})`, r.x + 8, y, { size: 1, color: TEXT_DIM }); y += 12;
        menu(ctx, rows.map((x) => x.label), r.x + 8, y, this.sub, { disabled: rows.map((x) => x.disabled) });
      } else if (this.mode === 'feat') {
        const rows = featRows(g.tables, g.party, s, t.i);
        drawText(ctx, `FEAT  (ST ${s.stamina?.[t.i] ?? 0})`, r.x + 8, y, { size: 1, color: TEXT_DIM }); y += 12;
        menu(ctx, rows.map((x) => x.label), r.x + 8, y, this.sub, { disabled: rows.map((x) => x.disabled) });
      } else if (this.mode === 'element') {
        drawText(ctx, 'AGAINST WHAT?', r.x + 8, y, { size: 1, color: TEXT_DIM }); y += 12;
        menu(ctx, ELEMENTS.map((e) => e[0].toUpperCase() + e.slice(1)), r.x + 8, y, this.sub);
      } else if (this.mode === 'item') {
        const items = this.usable(g, t.i);
        drawText(ctx, 'ITEM', r.x + 8, y, { size: 1, color: TEXT_DIM }); y += 12;
        menu(ctx, items.map((x) => item(g.tables.items, x).name), r.x + 8, y, this.sub);
      } else if (this.mode === 'itemTarget') {
        drawText(ctx, 'ON WHOM', r.x + 8, y, { size: 1, color: TEXT_DIM }); y += 12;
        menu(ctx, g.party.members.map((m) => `${m.name} ${m.hp}/${m.maxHp}`), r.x + 8, y, this.sub);
      }
      hint('ESC BACK');
    } else {
      drawText(ctx, 'THE ENEMY MOVES...', r.x + 8, r.y + 22, { size: 1, color: RED });
      if (this.auto) hint('');
    }
    const who = t && t.side === 'party' ? t.i : this.mode === 'itemTarget' ? this.sub : -1;
    drawPartyCards(g.tables.items, ctx, g.party, this.mode === 'itemTarget' ? this.sub : who, frame, g.party.members.map((c, i) => staminaOf(s, c, i)));
    g.party.members.forEach((_, i) => { if (this.cardFlash[i] > 0) { const c = cardRect(i); ctx.fillStyle = `rgba(220,60,40,${0.06 * this.cardFlash[i]})`; ctx.fillRect(c.x, c.y, c.w, c.h); this.cardFlash[i]--; } });
  }
}
