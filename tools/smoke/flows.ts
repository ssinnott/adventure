// The smoke's flows (#1006): the parts that play the game by its keys and its screens, each waiting on the
// page's state after a key or a change (boot.ts, `press` and `settle`), never on the clock.
import type { Load } from '../kit/browser.ts';
import type { Flag } from '../../src/content/index.ts';
import type { Feature } from '../../src/game/map.ts';
import type { Facing } from '../../src/game/types.ts';
import type { CombatScreen } from '../../src/ui/combat.ts';
import { LAYOUT } from '../../src/ui/frame.ts';
import { colours, company, press, settle, stack, top, type Kept, type Npc, type Run, type Shown } from './boot.ts';

// Title -> new game -> premade company.
export async function title({ page, seed, ok }: Run): Promise<void> {
  await settle(page);
  const titleColours = await colours(page);
  await press(page, 'Space');
  const screen0 = await page.evaluate(() => window.__game!.game!.top.constructor.name);
  const gameSeed = await page.evaluate(() => (window.__game!.game!.top as Shown).seed);
  await press(page, 'Space');
  const screen1 = await stack(page);
  const weatherSeed = await page.evaluate(() => window.__game!.game!.world.state.weatherSeed);
  ok(titleColours > 6, `the title painted (${titleColours} colours)`);
  ok(screen0 === 'CreateScreen' && screen1 === 'ExploreScreen', `Space on the title opens creation, Space again takes the premade company (${screen0}, ${screen1})`);
  ok(gameSeed === seed, `the new game starts from the pinned seed (${gameSeed}, weather seed ${weatherSeed})`);
}

// The premade company at the gate on the pinned seed -> walk out of the gate and into the Foreland -> force a fight.
export async function explore({ page, seed, ok }: Run): Promise<void> {
  await company(page, seed);
  for (const k of ['ArrowDown', 'ArrowDown', 'ArrowDown']) await press(page, k);
  const state = await page.evaluate(() => { const g = window.__game!.game!; return { map: g.world.state.mapId, zone: g.world.zone?.id, x: g.world.state.x, y: g.world.state.y, steps: g.world.state.steps }; });
  const exploreColours = await colours(page);
  await page.evaluate(() => { const g = window.__game!.game!; g.fight(['road_rats']); });
  await settle(page);
  const screen2 = await page.evaluate(() => window.__game!.game!.top.constructor.name);
  const combatColours = await colours(page);
  ok(state.map === 'caldera' && state.zone === 'shelf' && state.steps === 3, `three steps back through the gate reach the Foreland, outdoors (${JSON.stringify(state)})`);
  ok(exploreColours > 20, `the viewport, automap and party cards painted (${exploreColours} colours)`);
  ok(screen2 === 'CombatScreen' && combatColours > 20, `a fight opens and paints (${screen2}, ${combatColours} colours)`);
}

// Thornmark: the second region's sprites (ogre, wraith, the big wolves) and a town paint too.
export async function thornmark({ page, ok }: Run): Promise<void> {
  await page.evaluate(() => { const g = window.__game!.game!; g.world.travel('thornmark', 6, 8, 3); g.enterCell(); });
  await settle(page);
  const thornColours = await colours(page);
  // The ogre's band as the view draws it before the fight: each of its kinds, to three (world.ts, groupDrawn).
  const ogreView = await page.evaluate(() => { const g = window.__game!.game!, band = g.world.liveGroups().find((q) => q.def.id === 'tm_ogre'); return band ? (g.monstersAt(band.state.x, band.state.y) ?? []).map((m) => m.id).join(',') : 'no tm_ogre'; });
  await page.evaluate(() => { const g = window.__game!.game!; g.fight(['tm_ogre', 'tm_wraiths']); });
  await settle(page);
  const thornFight = await page.evaluate(() => { const g = window.__game!.game!; return { screen: g.top.constructor.name, monsters: (g.top as Shown).state.monsters.map((m) => m.def.sprite).join(','), labels: (g.top as Shown).labels.map((l) => l.text).join(' | ') }; });
  const thornFightColours = await colours(page);
  await page.evaluate(() => { const g = window.__game!.game!; g.screens.pop(); g.world.travel('thornhold', 7, 14, 0); g.enterCell(); });
  await settle(page);
  const townColours = await colours(page);
  ok(thornColours > 20, `Thornmark's forest paints (${thornColours} colours)`);
  ok(thornFight.screen === 'CombatScreen' && /ogre/.test(thornFight.monsters) && /wraith/.test(thornFight.monsters) && thornFightColours > 20, `the ogre and wraith sprites paint in a fight (${thornFight.monsters}, ${thornFightColours} colours)`);
  ok(ogreView === 'ogre,brigand_archer,brigand', `before the fight the view draws the ogre's band as each of its kinds (${ogreView})`);
  // The ogre's band is mixed: its label names each kind with its count, as painted (ui/grouplabels.ts).
  ok(thornFight.labels.startsWith('1 Ogre, 1 Brigand Archer, 3 Brigands'), `a mixed band's label names each kind with its count (${thornFight.labels})`);
  ok(townColours > 20, `Thornhold paints (${townColours} colours)`);
}

// A business: walking into the Hearthlight's doorway opens its interior under the inn's menu, and
// leaving puts the party back in the street, facing the door.
// An event on its doorway, put there at run time, is said by the step in and shows in the room's log.
export async function inn({ page, ok }: Run): Promise<void> {
  await page.evaluate(() => { const g = window.__game!.game!; g.world.travel('harrow', 4, 5, 0); (g.world.map.features as Feature[]).push({ kind: 'event', x: 4, y: 4, id: 'fx_chair', text: 'An empty chair by the fire.' }); });
  await press(page, 'ArrowUp');
  const inside = await stack(page);
  const roomLog = await page.evaluate(() => { const g = window.__game!.game!, v = g.screens.find((s) => s.constructor.name === 'InteriorScreen') as Shown | undefined; return v ? v.roomLog(g) : []; });
  const innColours = await colours(page);
  await press(page, 'Escape');
  await page.evaluate(() => { const m = window.__game!.game!.world.map; (m.features as Feature[]).splice(m.features.findIndex((f) => 'id' in f && f.id === 'fx_chair'), 1); });
  const outside = await page.evaluate(() => { const g = window.__game!.game!; return { screens: g.screens.map((s) => s.constructor.name).join(','), x: g.world.state.x, y: g.world.state.y, facing: g.world.state.facing }; });
  // A person in a business (game/people.ts, World.peopleAt): a Hob put in the Hearthlight at run time,
  // with the real Hob (#77) taken out for the run, makes its first menu list him; his answer sends him
  // away, and the menu no longer lists him. Then the real Hob is put back, and the menu lists him.
  const inn = await (async () => {
    await page.evaluate(() => {
      const g = window.__game!.game!, m = g.world.map, fx = (f: string): Flag => f as Flag;
      (window as Window & Kept).__hob = (m.features as Feature[]).splice(m.features.findIndex((f) => f.kind === 'npc' && f.name.startsWith('Hob')), 1)[0];
      g.world.travel('harrow', 4, 5, 0);
      (g.world.map.features as Feature[]).push({ kind: 'npc', x: 4, y: 4, name: 'Hob, once tenant of Ashcombe', lines: ['"A stranger, and armed."'], until: { flag: fx('fx_hob_gone') },
        choice: { ask: '"Should I go to Gullwick?"', answers: [{ label: 'Go', sets: fx('fx_hob_gone'), says: ['"Then I go."'] }, { label: 'Stay', sets: fx('fx_hob_stays'), says: ['"Then I stay."'] }] } });
    });
    await press(page, 'ArrowUp');
    const menu = await top(page);
    await press(page, 'ArrowDown'); await press(page, 'Space');
    const words = await top(page);
    await press(page, 'Space');
    const question = await top(page);
    await press(page, 'Space');
    const said = await top(page);
    await press(page, 'Space');
    const back = await top(page);
    const backColours = await colours(page);
    // With him gone the trade is all the menu offers: choosing it opens it once, with nothing under it to come back to.
    await press(page, 'Space');
    const traded = await stack(page);
    await press(page, 'Escape');
    const left = await page.evaluate(() => {
      const g = window.__game!.game!, top = g.top.constructor.name, m = g.world.map;
      while (g.screens.length > 1) g.pop();
      const i = m.features.findIndex((f) => f.kind === 'npc' && f.name.startsWith('Hob'));
      if (i >= 0) (m.features as Feature[]).splice(i, 1);
      (m.features as Feature[]).push((window as Window & Kept).__hob!);
      delete g.party.flags.fx_hob_gone; delete g.party.flags.fx_hob_stays;
      return top;
    });
    const hob = await page.evaluate(() => {
      const g = window.__game!.game!;
      g.interact(g.world.map.features.find((f) => f.kind === 'inn')!);
      const menu = (g.screens.find((s) => s.constructor.name === 'ChoiceScreen') as Shown | undefined)?.options ?? [];
      while (g.screens.length > 1) g.pop();
      return menu;
    });
    // The Gilded Eel is its keeper: with Ebba and Maud in it from a new game (#77), the room says
    // itself over a menu that lists them.
    const eel = await page.evaluate(() => {
      const g = window.__game!.game!, m = g.world.map, eel = m.features.find((f): f is Npc => f.kind === 'npc' && f.interior === 'gilded_eel');
      g.interact(eel!);
      const out = g.screens.map((s) => s.constructor.name).join(','), under = (g.screens[g.screens.length - 2] as Shown | undefined)?.options ?? [];
      while (g.screens.length > 1) g.pop();
      return { screens: out, options: under };
    });
    // A tavern may be a guild's hall (#417): the Gilded Eel made the Wardens' for the run lists their
    // work and their skill (#805) after the talk of the room and before its people.
    const hall = await page.evaluate(() => {
      const g = window.__game!.game!, eel = g.world.map.features.find((f): f is Npc => f.kind === 'npc' && f.interior === 'gilded_eel');
      eel!.hall = 'wardens';
      g.interact(eel!);
      const under = (g.screens[g.screens.length - 2] as Shown | undefined)?.options ?? [];
      while (g.screens.length > 1) g.pop();
      delete eel!.hall;
      return under;
    });
    return { menu, words, question, said, back, backColours, traded, left, hob, eel, hall };
  })();
  ok(inside === 'ExploreScreen,InteriorScreen,ChoiceScreen' && innColours > 400, `walking into the inn opens its interior under its menu (${inside}, ${innColours} colours)`);
  ok(inn.menu.screen === 'ChoiceScreen' && inn.menu.options.join() === 'A room and rations,Talk to Hob,Leave', `a person in the inn joins its first menu, by name to the first comma (${inn.menu.options.join(', ')})`);
  ok(inn.words.text === '"A stranger, and armed."' && inn.question.text === '"Should I go to Gullwick?"' && inn.said.text === '"Then I go."', `talking to him says his words and puts his question in the side panel (${inn.words.screen}, ${inn.question.screen}, ${inn.said.screen})`);
  ok(inn.back.screen === 'ChoiceScreen' && inn.back.options.join() === 'A room and rations,Leave' && inn.backColours > 20, `his answer sends him away: back on the first menu, which no longer lists him (${inn.back.options.join(', ')})`);
  ok(inn.traded === 'ExploreScreen,InteriorScreen,ChoiceScreen' && inn.left === 'ExploreScreen', `with him gone, the trade opens once, and Esc leaves (${inn.traded}, then ${inn.left})`);
  ok(inn.hob.join() === 'A room and rations,Talk to Hob,Leave', `the real Hob, by the Hearthlight's fire from a new game, is on its first menu (${inn.hob.join(', ')})`);
  ok(inn.eel.screens === 'ExploreScreen,InteriorScreen,ChoiceScreen,MessageScreen' && inn.eel.options.join() === 'The talk of the room,Talk to Ebba,Talk to Maud,Leave', `the Gilded Eel, with Ebba and Maud in it from a new game, says its room over a menu that lists its keeper and them (${inn.eel.screens}; ${inn.eel.options.join(', ')})`);
  ok(inn.hall.join() === 'The talk of the room,Work for the Wardens,Learn a skill,Talk to Ebba,Talk to Maud,Leave', `a tavern that is a hall lists the guild's work and skill after the talk of the room and before its people (${inn.hall.join(', ')})`);
  ok(roomLog.includes('An empty chair by the fire.'), `an event on the doorway, said by the step in, shows in the room's log (${JSON.stringify(roomLog)})`);
  ok(outside.screens === 'ExploreScreen' && outside.x === 4 && outside.y === 5 && outside.facing === 0, `leaving the inn puts the party back in the street, facing the door (${JSON.stringify(outside)})`);
}

// A crossing (#164, game/passage.ts): a coachman put in Helmstow's street at run time sells a coach
// to Thornhold. Faced and asked, his words close onto the menu of crossings, then the terms; paying
// takes the fare, runs the clock to the landing and leaves the company in Thornhold, exploring.
export async function coach({ page, ok }: Run): Promise<void> {
  const before = await page.evaluate(() => {
    const g = window.__game!.game!;
    g.world.travel('harrow', 7, 14, 0);
    (g.world.map.features as Feature[]).push({ kind: 'npc', x: 7, y: 13, name: 'A coachman', lines: ['"Thornhold, at dawn."'], passage: [{ to: 'thornhold', x: 7, y: 14, name: 'Thornhold', by: 'coach', fare: 100, departs: 6, days: 1, arrives: 18 }] });
    g.party.gold = 500;
    return { minutes: g.world.state.minutes, day: g.world.day };
  });
  await press(page, 'Space');
  const words = await top(page);
  await press(page, 'Space');
  const menu = await top(page);
  await press(page, 'Space');
  const terms = await top(page);
  await press(page, 'Space');
  const after = await page.evaluate(() => {
    const g = window.__game!.game!, m = g.maps.harrow;
    (m.features as Feature[]).splice(m.features.findIndex((f) => 'name' in f && f.name === 'A coachman'), 1);
    return { screens: g.screens.map((s) => s.constructor.name).join(','), map: g.world.state.mapId, gold: g.party.gold, day: g.world.day, hour: g.world.hour, minutes: g.world.state.minutes, log: g.log.slice(-3) };
  });
  ok(words.text === '"Thornhold, at dawn."' && menu.options.join('|') === 'Thornhold\t100g\t1 day|Not now' && /leaves at 06:00 (tomorrow )?and lands the next day at 18:00/.test(terms.text) && terms.options[0] === 'Pay the fare (100 gold)',
    `a coachman's words close onto his crossings, then their terms (${menu.options.join(', ').replace(/\t/g, ' ')}; "${terms.text}")`);
  ok(after.screens === 'ExploreScreen' && after.map === 'thornhold' && after.gold === 400 && after.day === before.day + (before.minutes % 1440 <= 360 ? 1 : 2) && after.hour === 18,
    `paying takes the fare and lands the company in Thornhold, its calendar moved to the landing (day ${before.day} to ${after.day}, ${after.hour}:00, ${after.gold} gold; ${after.log.join(' / ')})`);
}

// A prestige's trainer (#19, game/prestige.ts): an armourer put in Helmstow's street at run time
// teaches knights their first. Faced and asked, her words close onto her menu, which lists Bram, the
// one knight, with the title and the price; taking it pays and makes him a Knight-Errant.
export async function trainer({ page, ok }: Run): Promise<void> {
  await page.evaluate(() => {
    const g = window.__game!.game!, bram = g.party.members[0];
    g.world.travel('harrow', 7, 14, 0);
    (g.world.map.features as Feature[]).push({ kind: 'npc', x: 7, y: 13, name: 'An armourer', lines: ['"Steel, or a title?"'], teaches: { cls: 'knight', prestige: 1 } });
    (window as Window & Kept).__bram = { level: bram.level, maxHp: bram.maxHp, hp: bram.hp, gold: g.party.gold };
    bram.level = 11; g.party.gold = 1500;
  });
  await press(page, 'Space');
  const words = await top(page);
  await press(page, 'Space');
  const menu = await top(page);
  await press(page, 'Space');
  const after = await page.evaluate(() => {
    const g = window.__game!.game!, m = g.maps.harrow, bram = g.party.members[0];
    (m.features as Feature[]).splice(m.features.findIndex((f) => 'name' in f && f.name === 'An armourer'), 1);
    const out = { screens: g.screens.map((s) => s.constructor.name).join(','), prestige: bram.prestige ?? 0, gold: g.party.gold, log: g.log.slice(-2) };
    const was = (window as Window & Kept).__bram!;
    bram.level = was.level; bram.maxHp = was.maxHp; bram.hp = was.hp; g.party.gold = was.gold; delete bram.prestige;
    return out;
  });
  ok(words.text === '"Steel, or a title?"' && menu.options.join('|') === 'Bram: Knight-Errant\t1000g|Leave' && after.screens === 'ExploreScreen' && after.prestige === 1 && after.gold === 500 && after.log.join(' / ') === 'Bram is a Knight-Errant now. / Quest complete: Bram: Knight-Errant.',
    `a trainer's words close onto the members of her class, and Bram takes the first for 1000, and the seeking for it is done (${menu.options.join(', ').replace(/\t/g, ' ')}; "${after.log.join(' / ')}")`);
}

// Kiln-script (#538, game/inscriptions.ts, game/skills.ts): an inscription put in Helmstow's street at
// run time, that marks Feuerstollen. Stepped on by the premade six, who have no reader, it is a sign.
// A person who teaches Linguist, put in the street too, tells a company not of the Lanterns that they
// teach their own. In the Lantern Guildhall, the company a Taper for the run, the hall's first menu
// offers its skills, Linguist is chosen of the three (#856), and Maren learns it, which her sheet
// then lists. Stepped on again, she reads it after its words and marks the world map, which shows the
// mark, whole, and none once forgotten.
export async function script({ page, ok }: Run): Promise<void> {
  const said = (from: number): Promise<string[]> => page.evaluate((s0: number) => { const g = window.__game!.game!; return g.log.slice(Math.max(0, g.log.length - (g.said - s0))); }, from);
  // Maren's sheet, under her traits, where a member's skills are listed: its pixels, to compare.
  const sheet = async (): Promise<string> => {
    await press(page, 'Digit5');
    const px = await page.evaluate(() => { const c = document.getElementById('stage') as HTMLCanvasElement; return Array.from(c.getContext('2d')!.getImageData(20, 190, 300, 50).data).join(); });
    await press(page, 'Escape');
    return px;
  };
  // Pixels painted the colour of a marked place's pin.
  const marked = (): Promise<number> => page.evaluate(() => {
    const c = document.getElementById('stage') as HTMLCanvasElement, d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i] === 0xbd && d[i + 1] === 0xf4 && d[i + 2] === 0xff) n++;
    return n;
  });
  // Onto the inscription from the west, facing east.
  const onto = async (): Promise<string[]> => {
    const s0 = await page.evaluate(() => { const g = window.__game!.game!; while (g.screens.length > 1) g.pop(); g.world.travel('harrow', 9, 11, 1); return g.said; });
    await press(page, 'ArrowUp');
    return said(s0);
  };
  await page.evaluate(() => {
    const g = window.__game!.game!;
    g.world.travel('harrow', 9, 11, 1);
    (g.world.map.features as Feature[]).push({ kind: 'sign', x: 10, y: 11, id: 'fx_vent', text: 'The dwarves\' words for the mountain\'s breath.', read: 'VENT. STAND CLEAR.', marks: 'lava_tubes' });
    (window as Window & Kept).__purse = g.party.gold;
    g.party.gold = 1500;
  });
  const unread = await onto();
  const sheetBefore = await sheet();
  // A person who teaches it (`skill`), faced by a company not yet of the Lanterns: their words close
  // onto the stranger's answer, and nothing is taught.
  await page.evaluate(() => {
    const g = window.__game!.game!;
    g.world.travel('harrow', 7, 14, 0);
    (g.world.map.features as Feature[]).push({ kind: 'npc', x: 7, y: 13, name: 'A Lantern reader', lines: ['"The old way, word by word."'], skill: 'linguist' });
  });
  await press(page, 'Space');
  const teacher = await top(page);
  await press(page, 'Space');
  const stranger = await top(page);
  await press(page, 'Space');
  await page.evaluate(() => { const g = window.__game!.game!; g.party.flags.rank_lanterns = 1; g.world.travel('harrow', 11, 11, 0); });
  await press(page, 'ArrowUp');
  const hall = await top(page);
  for (let i = 0; i < hall.options.indexOf('Learn a skill'); i++) await press(page, 'ArrowDown');
  await press(page, 'Space');
  // The hall's skills (#856), Linguist first; then who would learn it.
  const skills = await top(page);
  await press(page, 'Space');
  const menu = await top(page);
  for (let i = 0; i < 4; i++) await press(page, 'ArrowDown');
  await press(page, 'Space');
  const learnt = await page.evaluate(() => { const g = window.__game!.game!; return { skills: (g.party.members[4].skills ?? []).join(), gold: g.party.gold, log: g.log.at(-1), screen: g.top.constructor.name, options: (g.top as Shown).options ?? [] }; });
  await press(page, 'Escape');
  await press(page, 'Escape');
  await press(page, 'Escape');
  const left = await stack(page);
  const sheetAfter = await sheet();
  const read = await onto();
  const again = await onto();
  // The world map, whole: the mark shows once read, and not once the reading is forgotten.
  await page.keyboard.press('KeyM');
  await page.waitForFunction(() => (window.__game!.game!.top as Shown).ready === true, null, { timeout: 60000 });
  await press(page, 'KeyZ');
  const pins = await marked();
  await page.evaluate(() => { delete window.__game!.game!.world.state.maps.harrow.used.fx_vent; });
  await settle(page);
  const unpinned = await marked();
  await press(page, 'KeyZ');
  await press(page, 'KeyM');
  const closed = await page.evaluate(() => {
    const g = window.__game!.game!, m = g.maps.harrow, top = g.top.constructor.name;
    while (g.screens.length > 1) g.pop();
    (m.features as Feature[]).splice(m.features.findIndex((f) => 'id' in f && f.id === 'fx_vent'), 1);
    (m.features as Feature[]).splice(m.features.findIndex((f) => 'name' in f && f.name === 'A Lantern reader'), 1);
    delete g.party.flags.rank_lanterns; delete g.party.members[4].skills;
    g.party.gold = (window as Window & Kept).__purse!;
    return top;
  });
  const sheetChanged = sheetBefore !== sheetAfter;
  ok(unread.join(' / ') === 'A sign reads: "The dwarves\' words for the mountain\'s breath."', `with nobody to read it, an inscription is a sign (${unread.join(' / ')})`);
  ok(teacher.text === '"The old way, word by word."' && stranger.screen === 'MessageScreen' && stranger.text === '"We teach our own. Take the first task, and you are one."',
    `a person who teaches Linguist says their words, then tells a company not of the Lanterns that they teach their own (${stranger.text})`);
  ok(hall.screen === 'ChoiceScreen' && hall.options.join('|') === 'Study spells|Work for the Lanterns|Learn a skill|Leave' && skills.text === '"Which skill?" (1500 gold.)'
      && skills.options.join('|') === 'Linguist\t1000g\tReads Kiln-script.|Perception\t1000g\tFinds hidden doors, even a square off.|Spirit Sense\t1000g\tSenses the dead through walls.|Leave'
      && menu.text === '"Who would learn?" (1500 gold.)' && menu.options[4] === 'Maren\t1000g' && menu.options.length === 7,
    `a Lantern hall offers its three skills after its work, each at its price, then who would learn one, each member at its price (${hall.options.join(', ')}; ${skills.options.map((o) => o.split('\t')[0]).join(', ')}; ${menu.options[4]?.replace(/\t/g, ' | ')})`);
  ok(learnt.skills === 'linguist' && learnt.gold === 500 && learnt.log === 'Maren learns Linguist.' && learnt.screen === 'ChoiceScreen' && learnt.options[4] === 'Maren\tknown' && left === 'ExploreScreen' && sheetChanged,
    `Maren learns Linguist for 1000, the menu comes again with her known, Esc three times leaves, and her sheet lists it ("${learnt.log}"; ${left})`);
  ok(read.join(' / ') === 'A sign reads: "The dwarves\' words for the mountain\'s breath." / Maren reads: "VENT. STAND CLEAR." / Maren marks the world map.' && again.length === 2,
    `stepped on again, Maren reads it after its words and marks the world map, once (${read.slice(1).join(' / ')})`);
  ok(pins >= 40 && unpinned === 0 && closed === 'ExploreScreen', `the world map, whole, pins the place the reading marked, and none once it is forgotten (${pins} pixels of the pin, then ${unpinned}; ${closed})`);
}

// The Wardens' hall, the Drillyard, with First Watch's walk already made, so taking it pays at once.
// Back on the hall's first menu, the rank it reads is the new one: its words are made when drawn, not
// when the menu was first opened.
export async function hall({ page, ok }: Run): Promise<void> {
  // The walk is made where the company has been on the Foreland, as a goal on the outdoors reads it (game/quests.ts,
  // stateOf): the run's walk out of the gate puts it among the zones been in, and a part run alone puts it there itself.
  const laid = await page.evaluate(() => {
    const g = window.__game!.game!, zones = (g.world.state.zones ??= []), laid = !zones.includes('shelf');
    if (laid) zones.push('shelf');
    g.world.ensureMapState(g.world.locate('shelf', 0, 0).mapId).used.scarth_watch = 1;
    g.world.travel('harrow', 3, 13, 0); g.enterCell();
    return laid;
  });
  await settle(page);
  const hallBefore = await page.evaluate(() => (window.__game!.game!.top as Shown).words);
  // Down to the guild's work, First Watch, its offer, Take it and the pay; then back from the rank 1 offers to the menu.
  for (const k of ['ArrowDown', 'Space', 'Space', 'Space', 'Space', 'Space', 'Escape']) await press(page, k);
  const hallAfter = await page.evaluate(() => { const g = window.__game!.game!; return { screens: g.screens.map((s) => s.constructor.name).join(','), words: (g.top as Shown).words }; });
  await press(page, 'Escape');
  const hallLeft = await page.evaluate((laid: boolean) => {
    const g = window.__game!.game!, zones = g.world.state.zones ?? [];
    delete g.world.ensureMapState(g.world.locate('shelf', 0, 0).mapId).used.scarth_watch;
    for (const k of ['q_wardens_watch', 'q_wardens_watch_done', 'rank_wardens']) delete g.party.flags[k];
    if (laid) zones.splice(zones.indexOf('shelf'), 1);
    return g.screens.map((s) => s.constructor.name).join(',');
  }, laid);
  ok(hallBefore === 'You have no rank with the Wardens yet.' && hallAfter.screens === 'ExploreScreen,InteriorScreen,ChoiceScreen' && hallAfter.words === 'Your rank with the Wardens: Recruit.' && hallLeft === 'ExploreScreen',
    `a hall's first menu reads the rank the guild's work has just raised, and Leave ends the visit (${hallBefore} -> ${hallAfter.words}; ${hallAfter.screens}; ${hallLeft})`);
}

// The quest log: Vask's contract is announced as his dialogue closes, and J opens the log on it. He
// holds court on the keep's door, in the throne room.
export async function questlog({ page, ok }: Run): Promise<void> {
  await page.evaluate(() => { const g = window.__game!.game!; g.world.travel('keep', 7, 4, 0); g.interact(g.world.featureHere()!); });
  await settle(page);
  await press(page, 'Space');
  const questLine = await page.evaluate(() => window.__game!.game!.log.at(-1));
  await press(page, 'KeyJ');
  const questScreen = await page.evaluate(() => window.__game!.game!.top.constructor.name);
  const questColours = await colours(page);
  await press(page, 'Escape');
  const questClosed = await page.evaluate(() => window.__game!.game!.top.constructor.name);
  ok(questLine === 'New quest: The Dimming.', `closing Vask's dialogue announces his quest (${questLine})`);
  ok(questScreen === 'QuestScreen' && questColours > 20 && questClosed === 'ExploreScreen', `J opens the quest log, it paints, and Esc closes it (${questScreen}, ${questColours} colours, then ${questClosed})`);
}

// A person's question (game/people.ts): a fixture captain, put in the street at run time, asks; the
// first answer hands over a letter, which is read from the pack. Nothing of it stays.
export async function asked({ page, ok }: Run): Promise<void> {
  const top = (): Promise<{ screen: string; text: string; title: string }> => page.evaluate(() => { const t = window.__game!.game!.top as Shown; return { screen: t.constructor.name, text: t.text ?? '', title: t.title ?? '' }; });
  await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const C = await load<typeof import('../../src/content/index.ts')>('/src/content/index.ts');
    (C.ITEMS as Record<string, (typeof C.ITEMS)[string]>).fx_letter = { id: 'fx_letter', name: 'A Sealed Letter', slot: 'none', price: 0, text: ['To Captain Hale, at the pass.', '"The riders cross the ford by night."'] };
    const g = window.__game!.game!, fx = (f: string): Flag => f as Flag;
    g.world.travel('harrow', 9, 6, 0);
    // Words after a flag nobody has set are not said: the first lines are.
    g.talk({ kind: 'npc', x: 9, y: 5, name: 'Captain Fixture', lines: ['"Riders, by night."'], says: [{ after: { flag: fx('fx_never') }, lines: ['"Not yet."'] }],
      choice: { ask: 'Shall I write to Hale?', answers: [{ label: 'Write to him', sets: fx('fx_write'), gives: 'fx_letter', says: ['He writes, and seals it.'] }, { label: 'Keep it quiet', sets: fx('fx_keep'), says: ['He shrugs.'] }] } });
  });
  await settle(page);
  const words = await top();
  await press(page, 'Space');
  const question = await top();
  const choiceColours = await colours(page);
  await press(page, 'Space');
  const said = await top();
  await press(page, 'Space');
  const after = await page.evaluate(() => { const g = window.__game!.game!; return { screen: g.top.constructor.name, flag: !!g.party.flags.fx_write, bag: g.party.bag.includes('fx_letter') }; });
  await press(page, 'KeyI');
  const has = await page.evaluate(() => { const g = window.__game!.game!, t = g.top as Shown, c = g.party.members[g.selected], i = g.party.bag.indexOf('fx_letter'); if (i >= 0 && t.constructor.name === 'SheetScreen') t.sel = c.pack.length + i; return i >= 0; });
  if (has) await press(page, 'Space');
  const letter = has ? await top() : { screen: 'no letter', text: '', title: '' };
  await press(page, 'Escape');
  await press(page, 'Escape');
  const closed = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const g = window.__game!.game!, C = await load<typeof import('../../src/content/index.ts')>('/src/content/index.ts');
    const top = g.top.constructor.name;
    // Whatever went wrong above, the rest of the run starts in the street.
    while (g.screens.length > 1) g.pop();
    if (g.party.bag.includes('fx_letter')) g.party.bag.splice(g.party.bag.indexOf('fx_letter'), 1);
    delete g.party.flags.fx_write; delete (C.ITEMS as Record<string, (typeof C.ITEMS)[string]>).fx_letter;
    return top;
  });
  ok(words.screen === 'MessageScreen' && words.text === '"Riders, by night."' && question.screen === 'ChoiceScreen' && question.text === 'Shall I write to Hale?' && choiceColours > 20,
    `a person's first words (not words whose flag is unset) close onto their question, which paints (${words.screen}, then ${question.screen}, ${choiceColours} colours)`);
  ok(said.text === 'He writes, and seals it.\n\n(A Sealed Letter.)' && said.title === 'Captain Fixture' && after.flag && after.bag && after.screen === 'ExploreScreen',
    `the answer is said, sets its flag and hands over the letter (${JSON.stringify(said.text)})`);
  ok(letter.screen === 'MessageScreen' && letter.title === 'A Sealed Letter' && letter.text.startsWith('To Captain Hale') && closed === 'ExploreScreen', `the letter is read from the pack, in a box titled with its name, and Esc closes it (${letter.screen} '${letter.title}', then ${closed})`);
}

// The weather: the Foreland in a downpour, a fight in it, and Thornmark under falling snow with
// snow lying deep. Each moves the clock to the first such hour of daylight for this game's seed.
export async function weather({ page, ok }: Run): Promise<void> {
  const weatherAt = async (map: string, x: number, y: number, f: number, want: string): Promise<{ found: boolean; sky: string; log: string }> => {
    const r = await page.evaluate(async ([m, xx, yy, ff, kind]: [string, number, number, number, string]) => {
      const load: Load = (p) => import(p);
      const W = await load<typeof import('../../src/game/weather.ts')>('/src/game/weather.ts'), C = await load<typeof import('../../src/game/calendar.ts')>('/src/game/calendar.ts');
      const g = window.__game!.game!, w = g.world;
      g.screens = [g.screens[0]]; w.travel(m, xx, yy, ff as Facing); w.sky = null;
      const at = W.findWeather(w.state.weatherSeed!, w.state.minutes, w.climate, (wx, min) => (kind === 'downpour' ? wx.precip >= 0.7 && wx.snow === 0 : wx.snow >= 0.7 && wx.precip >= 0.3 && wx.cover >= 0.5) && C.daylightAt(min) >= 0.8, 24 * 480);
      if (at >= 0) w.state.minutes = at;
      return at >= 0;
    }, [map, x, y, f, want] as [string, number, number, number, string]);
    await settle(page);
    return page.evaluate((found: boolean) => { const g = window.__game!.game!; return { found, sky: g.world.sky?.sky ?? '', log: g.log[g.log.length - 1] ?? '' }; }, r);
  };
  const rain = await weatherAt('shelf', 16, 8, 2, 'downpour');
  const rainColours = await colours(page);
  await page.evaluate(() => { const g = window.__game!.game!; g.fight(['road_rats']); });
  await settle(page);
  const rainFight = await page.evaluate(() => { const g = window.__game!.game!; return { screen: g.top.constructor.name, rangedPenalty: (g.top as Shown).state.rangedPenalty }; });
  const rainFightColours = await colours(page);
  const snow = await weatherAt('thornmark', 7, 26, 2, 'snow');
  const snowColours = await colours(page);
  ok(rain.found && /downpour|storm/.test(rain.sky) && /pour|heavens|sheets|thunder/i.test(rain.log) && rainColours > 20, `the Foreland paints in a downpour and the log says so (${rain.sky}: "${rain.log}", ${rainColours} colours)`);
  ok(rainFight.screen === 'CombatScreen' && rainFight.rangedPenalty > 0 && rainFightColours > 20, `a fight in the downpour paints, with the archers' penalty (${rainFightColours} colours)`);
  ok(snow.found && /snow|blizzard|flurries/.test(snow.sky) && /snow|blizzard/i.test(snow.log) && snowColours > 20, `Thornmark paints under falling snow with snow lying (${snow.sky}: "${snow.log}", ${snowColours} colours)`);
}

// The world map: M paints the cloth behind a progress bar, Tab lays the zones over it, Z shows it
// whole, Space opens the almanac over it, M closes it again.
export async function worldmap({ page, ok }: Run): Promise<void> {
  await page.evaluate(() => { const g = window.__game!.game!; g.world.travel('shelf', 16, 9, 2); g.enterCell(); });
  await settle(page);
  await page.keyboard.press('KeyM');
  await page.waitForFunction(() => (window.__game!.game!.top as Shown).ready === true, null, { timeout: 60000 });
  await settle(page);
  const mapScreen = await page.evaluate(() => window.__game!.game!.top.constructor.name);
  const mapColours = await colours(page);
  await press(page, 'Tab');
  const zonesColours = await colours(page);
  await press(page, 'KeyZ');
  const wholeColours = await colours(page);
  await press(page, 'Space');
  const almanacScreen = await page.evaluate(() => window.__game!.game!.top.constructor.name);
  await press(page, 'Escape');
  const almanacClosed = await page.evaluate(() => window.__game!.game!.top.constructor.name);
  await press(page, 'KeyM');
  const afterMap = await page.evaluate(() => window.__game!.game!.top.constructor.name);
  ok(mapScreen === 'WorldMapScreen' && mapColours > 200, `M opens the world map and it paints (${mapScreen}, ${mapColours} colours)`);
  ok(zonesColours > 200 && wholeColours > 200, `Tab lays the zones over it and Z shows it whole (${zonesColours}, ${wholeColours} colours)`);
  ok(almanacScreen === 'MessageScreen' && almanacClosed === 'WorldMapScreen', `Space opens the almanac over the map and Esc goes back to it (${almanacScreen}, then ${almanacClosed})`);
  ok(afterMap === 'ExploreScreen', `M closes it again (${afterMap})`);
}

// The end of the world: nothing is built north of the Foreland, the rim cut for good. On a clear noon, with nothing the
// view would wash over it, facing it from the last square before it, the view draws the ring's mountain
// and nothing pink, and the automap inks it as a mountain faded into the parchment (#829); a step into
// it is refused and the log says why. No such noon fails the check.
export async function edge({ page, ok }: Run): Promise<void> {
  const edgeAt: number = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const W = await load<typeof import('../../src/game/weather.ts')>('/src/game/weather.ts'), C = await load<typeof import('../../src/game/calendar.ts')>('/src/game/calendar.ts'), V = await load<typeof import('../../src/ui/viewport.ts')>('/src/ui/viewport.ts');
    const g = window.__game!.game!, w = g.world;
    g.screens = [g.screens[0]]; w.travel('shelf', 8, 1, 0); w.sky = null;
    const at = W.findWeather(w.state.weatherSeed!, w.state.minutes, w.climate, (wx, min) => wx.precip < 0.02 && !V.washes(wx) && wx.cover === 0 && C.daylightAt(min) === 1, 24 * 480);
    if (at >= 0) w.state.minutes = at;
    return at;
  });
  await settle(page);
  const pinkIn = async (r: { x: number; y: number; w: number; h: number }): Promise<number> => page.evaluate((b: { x: number; y: number; w: number; h: number }) => {
    const c = document.getElementById('stage') as HTMLCanvasElement;
    const d = c.getContext('2d')!.getImageData(b.x, b.y, b.w, b.h).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - 0xff) < 5 && Math.abs(d[i + 1] - 0x5f) < 5 && Math.abs(d[i + 2] - 0xbf) < 5) n++;
    return n;
  }, r);
  const edgeView = edgeAt >= 0 ? await pinkIn({ x: 8, y: 8, w: 400, h: 200 }) : -1, edgeMap = edgeAt >= 0 ? await pinkIn({ x: 416, y: 42, w: 216, h: 214 }) : -1;
  // The ring's mountain on the automap, inked as a mountain is and faded into the parchment.
  const edgeFaded: number = edgeAt >= 0 ? await page.evaluate(async (b: { x: number; y: number; w: number; h: number }) => {
    const load: Load = (p) => import(p);
    const A = await load<typeof import('../../src/lib/art/palettes.ts')>('/src/lib/art/palettes.ts'), P = await load<typeof import('../../src/ui/palette.ts')>('/src/ui/palette.ts');
    const [r, g, bl] = A.hexToRgb(A.mix('#6a6058', P.PARCHMENT, P.AUTOMAP_FADE));
    const d = (document.getElementById('stage') as HTMLCanvasElement).getContext('2d')!.getImageData(b.x, b.y, b.w, b.h).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - r) < 4 && Math.abs(d[i + 1] - g) < 4 && Math.abs(d[i + 2] - bl) < 4) n++;
    return n;
  }, { x: 416, y: 42, w: 216, h: 214 }) : 0;
  await press(page, 'ArrowUp');
  const edgeBump = await page.evaluate(() => { const g = window.__game!.game!, z = g.world.zone!; return { log: g.log.at(-1), y: g.world.state.y - z.y, zone: z.id }; });
  const weatherSeed = await page.evaluate(() => window.__game!.game!.world.state.weatherSeed);
  ok(edgeAt >= 0, `the weather has a clear noon with no wash within 480 days, to face the end of the world in (${edgeAt >= 0 ? `minute ${edgeAt}` : `none for weather seed ${weatherSeed}`})`);
  ok(edgeAt >= 0 && edgeView === 0 && edgeMap === 0 && edgeFaded > 20, `facing the end of the world north of the Foreland, the view draws the ring's mountain and nothing pink, and the automap inks it faded (${edgeAt >= 0 ? `${edgeView} pink pixels in the view, ${edgeMap} on the automap, ${edgeFaded} of the faded mountain` : 'not looked at: no clear noon'})`);
  ok(edgeBump.log === 'Too steep for anyone to climb.' && edgeBump.zone === 'shelf' && edgeBump.y === 1, `a step into it is refused, and the log says why: the mountain no one climbs (${JSON.stringify(edgeBump)})`);
}

// The pass is open, a road walked straight through into Thornmark past the checkpoint's warning,
// no transition between.
export async function pass({ page, ok }: Run): Promise<void> {
  await page.evaluate(() => {
    const g = window.__game!.game!;
    g.world.travel('shelf', 29, 9, 1); g.world.killGroups(['tm_wolves1']);
  });
  // Everything said on the walk, however the sky changes on the way.
  const said0: number = await page.evaluate(() => window.__game!.game!.said);
  for (let i = 0; i < 4; i++) await press(page, 'ArrowUp');
  const pass = await page.evaluate((s0: number) => { const g = window.__game!.game!, z = g.world.zone; return { map: g.world.state.mapId, zone: z?.id, x: g.world.state.x - (z?.x ?? NaN), y: g.world.state.y - (z?.y ?? NaN), screen: g.top.constructor.name, said: g.log.slice(Math.max(0, g.log.length - (g.said - s0))).join(' / ') }; }, said0);
  const passColours = await colours(page);
  ok(pass.map === 'caldera' && pass.zone === 'thornmark' && pass.x === 1 && pass.y === 9 && pass.screen === 'ExploreScreen' && /Warden checkpoint.*The pass opens onto old forest/.test(pass.said) && passColours > 20,
    `the open pass is walked straight through into Thornmark, warned at the checkpoint, and Thornmark says so (${JSON.stringify(pass)})`);
}

// Lampglass in a fight: Cast, the spell, then the menu asks against what, and the pick is cast (#20).
export async function lampglass({ page, ok }: Run): Promise<void> {
  const glass = await page.evaluate(() => {
    const g = window.__game!.game!;
    while (g.screens.length > 1) g.pop();
    const maren = g.party.members[4];
    g.world.travel('shelf', 16, 4, 2);
    maren.spells.push('lampglass'); maren.sp = maren.maxSp = 99;
    for (const c of g.party.members) { c.hp = c.maxHp = 999; c.conditions = []; }
    g.fight(['road_rats']);
    const scr = g.top as Shown, s = scr.state;
    let asked = '';
    for (let guard = 0; guard < 300 && s.outcome === 'ongoing' && !s.glass; guard++) {
      scr.update(g, null);
      const who = s.order[s.turn];
      if (!who || who.side === 'monster') { scr.update(g, 'interact'); continue; }
      if (g.party.members[who.i] !== maren) { scr.update(g, 'n4'); continue; }
      scr.update(g, 'n2');
      scr.sub = maren.spells.indexOf('lampglass');
      scr.update(g, 'interact');
      asked = scr.mode;
      scr.update(g, 'down'); scr.update(g, 'interact');
    }
    const out = { asked, element: s.glass?.element ?? '', line: s.log.find((l: string) => l.includes('Lampglass')) ?? '' };
    while (g.screens.length > 1) g.pop();
    return out;
  });
  ok(glass.asked === 'element' && glass.element === 'cold' && glass.line === 'Maren casts Lampglass. The glass dims the cold.', `Lampglass asks against what before it is cast, and casts the pick (${JSON.stringify(glass)})`);
}

// Waymark with a mark set: the spell asks "Return to the mark" or "Set it here", and the first goes back (#20).
export async function waymark({ page, ok }: Run): Promise<void> {
  const mark = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const S = await load<typeof import('../../src/ui/screens.ts')>('/src/ui/screens.ts'), P = await load<typeof import('../../src/game/spells.ts')>('/src/game/spells.ts');
    const g = window.__game!.game!, w = g.world, cassian = g.party.members[5];
    while (g.screens.length > 1) g.pop();
    w.travel('shelf', 16, 6, 0);
    const set = w.setMark(), at = { ...w.state.mark };
    w.travel('shelf', 16, 12, 0);
    cassian.spells.push('waymark'); cassian.sp = cassian.maxSp = 99; cassian.conditions = [];
    g.push(new S.SpellScreen('explore'));
    g.top.update(g, 'n6');
    (g.top as Shown).sel = cassian.spells.filter((id: string) => P.spell(id).context !== 'combat').indexOf('waymark');
    g.top.update(g, 'interact');
    const asked = { screen: g.top.constructor.name, options: (g.top as Shown).options ?? [] };
    g.top.update(g, 'interact');
    const back = w.state.x === at.x && w.state.y === at.y;
    delete w.state.mark;
    while (g.screens.length > 1) g.pop();
    return { set, asked, back };
  });
  ok(mark.set && mark.asked.screen === 'ChoiceScreen' && mark.asked.options.join('|') === 'Return to the mark|Set it here' && mark.back, `with a mark set, Waymark asks whether to return or set it here, and returns (${JSON.stringify(mark)})`);
}

// The pilot (#716), late, so nothing before it sees its lines in the log: P on the exploration screen
// hands it the game and its band darkens the top of the view for the why line; T steps its tempo;
// P again takes the game back, and once P has handed it over again, an arrow takes it back too.
export async function pilot({ page, ok, errors }: Run): Promise<void> {
  const pilotAt = { x: LAYOUT.view.x + 2, y: LAYOUT.view.y + 2 };
  const pilotPixel = (): Promise<number[]> => page.evaluate((p: { x: number; y: number }) => [...(document.getElementById('stage') as HTMLCanvasElement).getContext('2d')!.getImageData(p.x, p.y, 1, 1).data].slice(0, 3), pilotAt);
  const pilotBefore = await pilotPixel();
  const pilotFrom: number = await page.evaluate(() => window.__game!.game!.frame);
  await page.keyboard.press('KeyP');
  await page.waitForFunction((f: number) => window.__game!.game!.frame >= f + 60, pilotFrom, { timeout: 15000 });
  const pilotBand = { on: await page.evaluate(() => window.__game!.game!.pilot!.on === true), at: await pilotPixel() };
  const pilotState = (): Promise<{ on: boolean; tempo: number }> => page.evaluate(() => { const p = window.__game!.game!.pilot!; return { on: p.on, tempo: p.tempo }; });
  await press(page, 'KeyT');
  const pilotTempo = await pilotState();
  await press(page, 'KeyP');
  const pilotOff = (await pilotState()).on === false;
  await press(page, 'KeyP');
  const pilotAgain = (await pilotState()).on;
  await press(page, 'ArrowLeft');
  const pilotArrow = (await pilotState()).on === false;
  // Then thirty seconds of its own play (#723): T twice back to 1x, P, and 1,800 frames, as many as 60 Hz
  // draws in thirty seconds; the company walks and no page error comes. P takes it back. The show, not the finish.
  const showStart = await page.evaluate(() => ({ steps: window.__game!.game!.world.state.steps as number }));
  const showErrors = errors.length;
  await page.keyboard.press('KeyT'); await page.keyboard.press('KeyT'); await page.keyboard.press('KeyP');
  const showFrom = await (await page.waitForFunction(() => { const g = window.__game!.game!; return g.pilot!.on && g.frame; }, undefined, { timeout: 15000 })).jsonValue() as number;
  await page.waitForFunction((f: number) => window.__game!.game!.frame >= f + 1800, showFrom, { timeout: 90000 });
  const show = await page.evaluate(() => { const g = window.__game!.game!; return { on: g.pilot!.on as boolean, tempo: g.pilot!.tempo as number, steps: g.world.state.steps as number, why: g.pilot!.why[0] as string }; });
  await press(page, 'KeyP');
  const showOff = (await pilotState()).on === false, showNewErrors = errors.slice(showErrors);
  const light = (c: number[]): number => (c[0] + c[1] + c[2]) / 3;
  ok(pilotBand.on && Math.max(...pilotBand.at) < 100 && light(pilotBand.at) <= light(pilotBefore) * 0.6 + 4 && pilotOff,
    `P hands the game to the pilot, whose band darkens the top of the view 60 frames on (${pilotBefore.join(',')} to ${pilotBand.at.join(',')} at ${pilotAt.x},${pilotAt.y}), and P again takes it back (${pilotOff ? 'off' : 'still on'})`);
  ok(pilotTempo.on && pilotTempo.tempo === 2 && pilotAgain && pilotArrow, `T steps the pilot's tempo while it drives (${pilotTempo.tempo}×), and an arrow takes the game back as P does (${pilotArrow ? 'off' : 'still on'})`);
  ok(show.on && show.tempo === 1 && show.steps > showStart.steps && showOff && showNewErrors.length === 0,
    `the pilot plays thirty seconds at 1x, 1,800 frames, with no page error, the company walking (${showStart.steps} to ${show.steps} steps; "${show.why}"), and P takes it back (${showOff ? 'off' : 'still on'})${showNewErrors.length ? ' -> ' + showNewErrors.join(' | ') : ''}`);
}

// Attract mode (#722), after the pilot. The title's forty-five seconds are the Node suite's (too long here), so
// `attract()` starts it: a click on the canvas (the page's only touch: a tap is a pointerdown) brings the title back,
// and so does a key, through the real Input.
export async function attract({ page, ok }: Run): Promise<void> {
  const attractNow = (): Promise<{ top: string; attracting: boolean; on: boolean }> => page.evaluate(() => { const g = window.__game!.game!; return { top: g.top.constructor.name, attracting: g.attracting, on: g.pilot!.on }; });
  await page.evaluate(() => window.__game!.game!.attract()); await settle(page);
  const attractStarted = await attractNow();
  await page.click('#stage'); await settle(page);
  const attractTapped = await attractNow();
  await page.evaluate(() => window.__game!.game!.attract()); await settle(page);
  await press(page, 'ArrowLeft');
  const attractKeyed = await attractNow();
  ok(attractStarted.top === 'ExploreScreen' && attractStarted.attracting && attractStarted.on && attractTapped.top === 'TitleScreen' && !attractTapped.attracting && !attractTapped.on && attractKeyed.top === 'TitleScreen' && !attractKeyed.attracting && !attractKeyed.on,
    `attract mode plays a game on the pilot (${attractStarted.top}), and a click on the canvas, as a tap sends one, brings the title back (${attractTapped.top}), as a key does (${attractKeyed.top})`);
}

// Drawing a fight changes nothing of it (#943). Last, since it plays: a new game on the pinned seed, the road rats
// fought as above and drawn ten times through Game.render at three moments, the fight (CombatState, as JSON) and
// the game's generator as they were: after a round's last act, with a sleeper next in the order, and with a
// monster just struck. A draw that walked the turn on or counted a flash down would move one or both.
export async function drawing({ page, seed, ok }: Run): Promise<void> {
  const drawing = await page.evaluate((seed: number) => {
    const g = window.__game!.game!, ctx = (document.getElementById('stage') as HTMLCanvasElement).getContext('2d')!;
    g.newGame(seed);
    g.world.travel('shelf', 16, 4);
    g.fight(['road_rats']);
    const screen = g.top as Shown, s = screen.state;
    (screen.constructor as typeof CombatScreen).instant = true;
    const mark = (): string => `${JSON.stringify(s)} ${g.rng.state}`;
    const still = (): boolean => { const was = mark(); for (let i = 0; i < 10; i++) g.render(ctx); return mark() === was; };
    // The company braces ('n4') and the rats bite, round on round, to the tick of a round's last act: the next round
    // begun by then, or, drawn on main, the order spent and the walk to the next round still to make.
    let ticks = 0, reached = false;
    for (; ticks < 60 && s.outcome === 'ongoing' && !reached; ticks++) { const round = s.round; g.update('n4'); reached = s.round > round || s.turn >= s.order.length; }
    const spent = { ticks, round: s.round, reached: reached && s.outcome === 'ongoing', still: still() };
    // A rat first in the order, asleep as a Slumber leaves it: its waking is rolled where the turn is walked on.
    const at = s.order.findIndex((t: { side: string }, k: number) => k >= s.turn && t.side === 'monster');
    if (at >= 0) { s.turn = at; s.monsters[s.order[at].i].conditions = ['asleep']; }
    const slept = { at, of: s.order.length, still: still() };
    // A rat just struck and standing: the flash a blow leaves after its tick (the combat suite holds the tick's part).
    const hit = s.monsters.find((m: { hp: number }) => m.hp > 0);
    if (hit) hit.flash = 1;
    const struck = { flash: s.monsters.map((m: { flash: number }) => m.flash).join(), still: still() };
    (screen.constructor as typeof CombatScreen).instant = false;
    while (g.screens.length > 1) g.pop();
    return { spent, slept, struck };
  }, seed);
  ok(drawing.spent.reached && drawing.spent.still, `a fight drawn ten times after a round's last act is as it was, its state and the generator's (${drawing.spent.ticks} ticks to round ${drawing.spent.round})`);
  ok(drawing.slept.at >= 0 && drawing.slept.still, `a fight drawn ten times with a sleeper next in the order is as it was, its state and the generator's (a rat at ${drawing.slept.at} of ${drawing.slept.of})`);
  ok(/[1-9]/.test(drawing.struck.flash) && drawing.struck.still, `a fight drawn ten times with a monster just struck is as it was, its state and the generator's (flash ${drawing.struck.flash})`);
}
