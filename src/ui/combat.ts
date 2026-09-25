// The combat screen: draws the fight over the viewport and turns menu input into PartyActions for
// the resolver in game/combat.ts. Monster turns play out on a short timer so the log can be read.
import type { Game, Screen } from '../game/game.ts';
import type { Action } from '../input.ts';
import { is } from '../input.ts';
import { drawText } from '../lib/engine/text.ts';
import { panel, menu } from './draw.ts';
import { LAYOUT, drawPartyCards, drawStatus, drawPurse, drawViewportFrame, cardRect } from './frame.ts';
import { drawMonsterSprite, combatHeight } from './sprites.ts';
import { drawViewport, drawWeather } from './viewport.ts';
import { BRASS, TEXT, TEXT_DIM, RED, YELLOW, GREEN } from './palette.ts';
import { currentTurn, partyAct, monsterAct, aliveMonsters, canAttackFromRow } from '../game/combat.ts';
import type { CombatState, PartyAction } from '../game/combat.ts';
import { spell } from '../game/spells.ts';
import { item } from '../game/items.ts';
import { weaponOf } from '../game/party.ts';

type Mode = 'menu' | 'target' | 'spell' | 'spellTarget' | 'item' | 'itemTarget' | 'done';
const MONSTER_DELAY = 22;

export class CombatScreen implements Screen {
  private mode: Mode = 'menu';
  private sel = 0;
  private sub = 0;
  private timer = 0;
  private pendingSpell = '';
  private pendingItem = '';
  private logSeen = 0;
  /** Frames of red flash left on each party card, set when a member loses hp. */
  private cardFlash: number[] = [];
  private lastHp: number[] = [];
  /** Sparks: position, velocity, life. */
  private sparks: { x: number; y: number; vx: number; vy: number; life: number; col: string }[] = [];
  private lastMonsterHp: number[] = [];
  constructor(readonly state: CombatState, readonly groupIds: string[]) {
    this.lastMonsterHp = state.monsters.map((m) => m.hp);
  }

  private burst(x: number, y: number, col: string, n = 10): void {
    for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, s = 1 + Math.random() * 2.5; this.sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, life: 10 + Math.random() * 8, col }); }
  }

  private options(g: Game, who: number): { label: string; key: string; disabled: boolean }[] {
    const c = g.party.members[who];
    const w = weaponOf(c);
    const spells = c.spells.filter((s) => spell(s).context !== 'explore');
    const items = this.usable(g, who);
    return [
      { label: `Attack (${w.name})`, key: 'attack', disabled: !canAttackFromRow(c, who) },
      { label: 'Cast', key: 'cast', disabled: !spells.length },
      { label: 'Use', key: 'use', disabled: !items.length },
      { label: 'Defend', key: 'defend', disabled: false },
      { label: 'Flee', key: 'flee', disabled: false },
    ];
  }
  private usable(g: Game, who: number): string[] {
    const c = g.party.members[who];
    return [...new Set([...c.pack, ...g.party.bag].filter((id) => item(id).use && !item(id).use!.food))];
  }

  update(g: Game, a: Action | null): void {
    const s = this.state;
    if (s.outcome !== 'ongoing') {
      this.mode = 'done';
      if (is(a, 'interact', 'cancel')) g.afterCombat(this.groupIds, s.outcome);
      return;
    }
    const t = currentTurn(s, g.party, g.rng);
    if (!t) { this.mode = 'done'; return; }
    if (t.side === 'monster') {
      if (++this.timer >= MONSTER_DELAY || is(a, 'interact')) { this.timer = 0; monsterAct(s, g.party, g.rng); }
      return;
    }
    if (!a) return;
    const who = t.i;
    const alive = aliveMonsters(s);
    const act = (action: PartyAction) => { if (partyAct(s, g.party, g.rng, action)) { this.mode = 'menu'; this.sel = 0; } };
    switch (this.mode) {
      case 'menu': {
        const opts = this.options(g, who);
        if (is(a, 'up')) this.sel = (this.sel + opts.length - 1) % opts.length;
        else if (is(a, 'down')) this.sel = (this.sel + 1) % opts.length;
        else if (is(a, 'interact') || /^n[1-5]$/.test(a)) {
          if (/^n[1-5]$/.test(a)) this.sel = Number(a[1]) - 1;
          const o = opts[this.sel];
          if (o.disabled) return;
          if (o.key === 'attack') { this.mode = 'target'; this.sub = 0; }
          else if (o.key === 'cast') { this.mode = 'spell'; this.sub = 0; }
          else if (o.key === 'use') { this.mode = 'item'; this.sub = 0; }
          else if (o.key === 'defend') act({ type: 'defend' });
          else if (o.key === 'flee') act({ type: 'flee' });
        }
        break;
      }
      case 'target': {
        if (is(a, 'cancel')) { this.mode = 'menu'; return; }
        if (is(a, 'left', 'up')) this.sub = (this.sub + alive.length - 1) % alive.length;
        else if (is(a, 'right', 'down')) this.sub = (this.sub + 1) % alive.length;
        else if (is(a, 'interact')) act({ type: 'attack', target: alive[this.sub] });
        break;
      }
      case 'spell': {
        const c = g.party.members[who];
        const list = c.spells.filter((x) => spell(x).context !== 'explore');
        if (is(a, 'cancel')) { this.mode = 'menu'; return; }
        if (is(a, 'up')) this.sub = (this.sub + list.length - 1) % list.length;
        else if (is(a, 'down')) this.sub = (this.sub + 1) % list.length;
        else if (is(a, 'interact')) {
          const sp = spell(list[this.sub]);
          if (c.sp < sp.sp) { g.say('Not enough spell points.'); return; }
          this.pendingSpell = sp.id;
          if (sp.target === 'enemy' || sp.target === 'group') { this.mode = 'spellTarget'; this.sub = 0; }
          else if (sp.target === 'ally') { this.mode = 'itemTarget'; this.pendingItem = ''; this.sub = who; }
          else act({ type: 'cast', spellId: sp.id, target: 0 });
        }
        break;
      }
      case 'spellTarget': {
        if (is(a, 'cancel')) { this.mode = 'spell'; this.sub = 0; return; }
        if (is(a, 'left', 'up')) this.sub = (this.sub + alive.length - 1) % alive.length;
        else if (is(a, 'right', 'down')) this.sub = (this.sub + 1) % alive.length;
        else if (is(a, 'interact')) act({ type: 'cast', spellId: this.pendingSpell, target: alive[this.sub] });
        break;
      }
      case 'item': {
        const items = this.usable(g, who);
        if (is(a, 'cancel')) { this.mode = 'menu'; return; }
        if (is(a, 'up')) this.sub = (this.sub + items.length - 1) % items.length;
        else if (is(a, 'down')) this.sub = (this.sub + 1) % items.length;
        else if (is(a, 'interact')) { this.pendingItem = items[this.sub]; this.mode = 'itemTarget'; this.sub = who; }
        break;
      }
      case 'itemTarget': {
        const n = g.party.members.length;
        if (is(a, 'cancel')) { this.mode = this.pendingItem ? 'item' : 'spell'; this.sub = 0; return; }
        if (is(a, 'left', 'up')) this.sub = (this.sub + n - 1) % n;
        else if (is(a, 'right', 'down')) this.sub = (this.sub + 1) % n;
        else if (/^n[1-6]$/.test(a)) this.sub = Number(a[1]) - 1;
        else if (is(a, 'interact')) {
          if (this.pendingItem) act({ type: 'use', itemId: this.pendingItem, target: this.sub });
          else act({ type: 'cast', spellId: this.pendingSpell, target: this.sub });
        }
        break;
      }
      case 'done': break;
    }
  }

  render(g: Game, ctx: CanvasRenderingContext2D, frame: number): void {
    const s = this.state;
    const v = LAYOUT.view;
    // Detect damage since the last frame for the flashes and sparks.
    if (!this.lastHp.length) this.lastHp = g.party.members.map((m) => m.hp);
    g.party.members.forEach((m, i) => { if (m.hp < this.lastHp[i]) { this.cardFlash[i] = 10; const c = cardRect(i); this.burst(c.x + 22, c.y + 38, '#ff6a4a', 6); } this.lastHp[i] = m.hp; });
    // Backdrop: the place the fight happens in, as the viewport shows it, dimmed a touch. The
    // weather falls in front of the monsters, below.
    drawViewport(ctx, g.world, v, () => null, frame, false);
    ctx.fillStyle = 'rgba(10,8,12,0.28)'; ctx.fillRect(v.x, v.y, v.w, v.h);
    // Monsters in a row, grouped, with a marker on the targeted one.
    const alive = aliveMonsters(s);
    const t = currentTurn(s, g.party, g.rng);
    const targeting = this.mode === 'target' || this.mode === 'spellTarget';
    const n = alive.length, slot = v.w / Math.max(5, n);
    alive.forEach((mi, k) => {
      const m = s.monsters[mi];
      const x = v.x + (v.w - slot * n) / 2 + slot * (k + 0.5), y = v.y + v.h * 0.62 + 18 + m.group * 10;
      const h = combatHeight(m.def.size, n);
      if (m.flash > 0) m.flash--;
      if (m.hp < this.lastMonsterHp[mi]) { this.burst(x, y - h * 0.5, m.hp <= 0 ? '#ffffff' : '#ffd070'); this.lastMonsterHp[mi] = m.hp; }
      const asleep = m.conditions.includes('asleep');
      drawMonsterSprite(ctx, m.def.sprite, x, y, h, m.def.tint, asleep ? 0.6 : 1, frame + mi * 11, m.flash > 0);
      const hpFrac = m.hp / m.def.hp;
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(Math.round(x - 14), Math.round(y + 3), 28, 3);
      ctx.fillStyle = hpFrac > 0.5 ? GREEN : hpFrac > 0.25 ? YELLOW : RED; ctx.fillRect(Math.round(x - 14), Math.round(y + 3), Math.round(28 * hpFrac), 3);
      if (targeting && k === this.sub) drawText(ctx, '▼', x, y - h - 12, { size: 1, color: YELLOW, align: 'center' });
      if (t && t.side === 'monster' && t.i === mi) drawText(ctx, '*', x, y - h - 12, { size: 1, color: RED, align: 'center' });
      if (asleep) drawText(ctx, 'z', x + 10, y - h - 2, { size: 1, color: TEXT_DIM });
    });
    // Sparks.
    for (const p of this.sparks) { ctx.fillStyle = p.col; ctx.globalAlpha = Math.min(1, p.life / 8); ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2); p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life--; }
    ctx.globalAlpha = 1;
    this.sparks = this.sparks.filter((p) => p.life > 0);
    drawWeather(ctx, g.world, v, frame);
    // Group labels
    const groups = new Map<number, number>();
    for (const mi of alive) groups.set(s.monsters[mi].group, (groups.get(s.monsters[mi].group) ?? 0) + 1);
    let gx = v.x + 6;
    for (const [gi, count] of groups) { const name = s.monsters.find((m) => m.group === gi)!.def; drawText(ctx, `${count} ${count === 1 ? name.name : name.plural}`, gx, v.y + 6, { size: 1, color: TEXT_DIM }); gx += 110; }
    // Log
    const lines = s.log.slice(-5);
    const lh = lines.length * 10 + 6;
    ctx.fillStyle = 'rgba(10,8,12,0.75)'; ctx.fillRect(v.x, v.y + v.h - lh, v.w, lh);
    lines.forEach((l, i) => drawText(ctx, l, v.x + 6, v.y + v.h - lh + 4 + i * 10, { size: 1, color: i === lines.length - 1 ? TEXT : TEXT_DIM }));

    drawViewportFrame(ctx);
    drawStatus(ctx, g.world);
    drawPurse(ctx, g.party);
    // Right column: the action menu.
    const r = LAYOUT.map;
    panel(ctx, r.x, r.y, r.w, r.h);
    drawText(ctx, `ROUND ${s.round}`, r.x + 8, r.y + 8, { size: 1, color: TEXT_DIM });
    if (s.outcome !== 'ongoing') {
      drawText(ctx, s.outcome === 'victory' ? 'VICTORY' : s.outcome === 'fled' ? 'ESCAPED' : 'DEFEAT', r.x + 8, r.y + 24, { size: 2, color: s.outcome === 'defeat' ? RED : BRASS });
      if (s.loot) {
        drawText(ctx, `${s.loot.xp} XP  ${s.loot.gold} GOLD`, r.x + 8, r.y + 48, { size: 1, color: TEXT });
        s.loot.items.slice(0, 6).forEach((id, i) => drawText(ctx, item(id).name, r.x + 8, r.y + 62 + i * 10, { size: 1, color: TEXT }));
        if (s.loot.ready.length) drawText(ctx, `READY TO TRAIN: ${s.loot.ready.join(', ')}`, r.x + 8, r.y + 130, { size: 1, color: YELLOW });
      }
      drawText(ctx, 'SPACE', r.x + r.w - 8, r.y + r.h - 12, { size: 1, color: TEXT_DIM, align: 'right' });
    } else if (t && t.side === 'party') {
      const c = g.party.members[t.i];
      drawText(ctx, `${c.name.toUpperCase()}'S TURN`, r.x + 8, r.y + 22, { size: 1, color: BRASS });
      let y = r.y + 40;
      if (this.mode === 'menu') {
        const opts = this.options(g, t.i);
        menu(ctx, opts.map((o) => o.label), r.x + 8, y, this.sel, { disabled: opts.map((o) => o.disabled) });
        if (!canAttackFromRow(c, t.i)) drawText(ctx, 'BACK ROW: NEEDS A RANGED WEAPON', r.x + 8, r.y + r.h - 24, { size: 1, color: TEXT_DIM });
      } else if (this.mode === 'target' || this.mode === 'spellTarget') {
        drawText(ctx, 'TARGET', r.x + 8, y, { size: 1, color: TEXT_DIM }); y += 12;
        menu(ctx, alive.map((mi) => `${s.monsters[mi].def.name} ${s.monsters[mi].hp}/${s.monsters[mi].def.hp}`), r.x + 8, y, this.sub);
      } else if (this.mode === 'spell') {
        const list = c.spells.filter((x) => spell(x).context !== 'explore');
        drawText(ctx, `SPELL  (SP ${c.sp})`, r.x + 8, y, { size: 1, color: TEXT_DIM }); y += 12;
        menu(ctx, list.map((x) => `${spell(x).name} (${spell(x).sp})`), r.x + 8, y, this.sub, { disabled: list.map((x) => spell(x).sp > c.sp) });
      } else if (this.mode === 'item') {
        const items = this.usable(g, t.i);
        drawText(ctx, 'ITEM', r.x + 8, y, { size: 1, color: TEXT_DIM }); y += 12;
        menu(ctx, items.map((x) => item(x).name), r.x + 8, y, this.sub);
      } else if (this.mode === 'itemTarget') {
        drawText(ctx, 'ON WHOM', r.x + 8, y, { size: 1, color: TEXT_DIM }); y += 12;
        menu(ctx, g.party.members.map((m) => `${m.name} ${m.hp}/${m.maxHp}`), r.x + 8, y, this.sub);
      }
      drawText(ctx, 'ESC BACK', r.x + r.w - 8, r.y + r.h - 12, { size: 1, color: TEXT_DIM, align: 'right' });
    } else {
      drawText(ctx, 'THE ENEMY MOVES...', r.x + 8, r.y + 22, { size: 1, color: RED });
    }
    const who = t && t.side === 'party' ? t.i : this.mode === 'itemTarget' ? this.sub : -1;
    drawPartyCards(ctx, g.party, this.mode === 'itemTarget' ? this.sub : who, frame);
    g.party.members.forEach((_, i) => { if (this.cardFlash[i] > 0) { const c = cardRect(i); ctx.fillStyle = `rgba(220,60,40,${0.06 * this.cardFlash[i]})`; ctx.fillRect(c.x, c.y, c.w, c.h); this.cardFlash[i]--; } });
  }
}
