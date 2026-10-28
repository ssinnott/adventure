// Exploration, the spine of the game: `ExploreScreen`, at the foot of the stack while a game plays,
// takes a press to a step, a turn, Space at what is here or ahead, a search, a rest or a menu, and
// draws the view with the frame about it, its hint naming what Space would meet (`featureLabel`).
import type { Host, Screen } from './screen.ts';
import type { Action } from './actions.ts';
import { is } from './actions.ts';
import type { World } from '../game/world.ts';
import { allDown } from '../game/party.ts';
import type { Feature } from '../game/mapdef.ts';
import { monster } from '../game/monsters.ts';
import { drawViewport } from './viewport.ts';
import { LAYOUT, drawStatus, drawAutomap, drawPartyCards, drawLog, drawViewportFrame, drawPurse } from './frame.ts';
import { SpellScreen, SheetScreen } from './screens.ts';
import { QuestScreen } from './quests.ts';
import { WorldMapScreen } from './worldmap.ts';
import { drawText } from '../lib/engine/text.ts';

/** Exploration: the spine of the game. */
export class ExploreScreen implements Screen {
  update(g: Host, a: Action | null): void {
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
        if (grp && w.question(grp.def.id)) g.parley(grp.def.id);
        else if (grp) g.fight(w.adjacentGroups().length ? w.adjacentGroups() : [grp.def.id]);
        else g.say('Nothing here.');
      }
    }
    else if (is(a, 'search')) { w.advance(10); g.say(w.search() ? 'You find a hidden door!' : 'You search the wall ahead and find nothing.'); }
    else if (is(a, 'rest')) g.offerRest();
    else if (is(a, 'cast')) g.push(new SpellScreen('explore'));
    else if (is(a, 'inventory')) g.push(new SheetScreen(g.selected));
    else if (is(a, 'journal')) g.push(new QuestScreen(g));
    else if (is(a, 'save')) g.saveGame();
    else if (is(a, 'load')) { const loaded = g.loadGame(); if (loaded !== true) g.say(loaded); }
    else if (is(a, 'map')) g.push(new WorldMapScreen());
    else if (/^n[1-6]$/.test(a)) { g.selected = Number(a[1]) - 1; g.push(new SheetScreen(g.selected)); }
    if (!res) return;
    if (res.kind === 'blocked') { g.say(res.reason); return; }
    if (res.kind === 'turned') return;
    for (const m of res.messages) g.say(m);
    if (res.arrived) { g.enterCell(); return; }
    // Hunger: a day without food costs the party.
    if (res.asks) { g.parley(res.asks); return; }
    if (res.encounter) { g.fight(res.encounter); return; }
    g.enterCell();
  }

  render(g: Host, ctx: CanvasRenderingContext2D, frame: number): void {
    drawViewport(ctx, g.world, LAYOUT.view, g.monstersAt, frame);
    const ahead = g.world.map.ahead(g.world.state.x, g.world.state.y, g.world.state.facing);
    const f = g.world.featureHere();
    const grp = g.world.groupAt(ahead.x, ahead.y);
    const hint = grp ? `${monster(g.tables.monsters, grp.def.monsters[0]).plural}: Space to attack` : f ? `${featureLabel(f)}: Space` : '';
    // The pilot's band takes the top of the view while it is up.
    if (hint && !g.bandUp) drawText(ctx, hint, LAYOUT.view.x + LAYOUT.view.w / 2, LAYOUT.view.y + 6, { size: 1, color: '#ffe08a', align: 'center' });
    drawStatus(ctx, g.world);
    drawAutomap(ctx, g.world, frame);
    drawPartyCards(g.tables.items, ctx, g.party, -1, frame);
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
