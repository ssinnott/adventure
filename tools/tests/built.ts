// What the screens work out once (#1032): the quest log's list when it opens and the selected
// quest's sheets when the choice moves, the world map's marks (the party's place, the pins of the
// places read and sought, the line of where) when it opens, each held to what a frame worked out
// before (the log's list and sheets, `marksOf`) at every key the screen takes, and worked out anew
// at the next opening after the game has changed them; a load, a new game and attract mode put a
// stack of their own in place of an open log; the pilot at the helm over the log presses its keys
// alone; and LAYOUT's sheet, hint, box and world map rects and the palette's selection and hint as
// the screens wrote them. What is painted (the log's canvas, the automap's parchment) needs a
// canvas, so it is the smoke test's (tools/smoke/flows.ts, `questlog` and `explore`).
import type { Action } from '../../src/ui/actions.ts';
import type { Game } from '../../src/app/game.ts';
import type { Feature } from '../../src/game/mapdef.ts';
import { QuestScreen, questOrder, questSheets, openingSheet, PAGE } from '../../src/ui/quests.ts';
import { WorldMapScreen, marksOf } from '../../src/ui/worldmap.ts';
import type { Marks } from '../../src/ui/worldmap.ts';
import { LAYOUT, SAY_W } from '../../src/ui/frame.ts';
import { SELECTED, HINT } from '../../src/ui/palette.ts';
import { questLog } from '../../src/game/quests.ts';
import { PRESTIGE_LEVELS } from '../../src/game/party.ts';
import { FLAG_OWNERS } from '../../src/content/index.ts';
import { Pilot } from '../../src/app/pilot/pilot.ts';
import { ok } from './lib.ts';
import { headlessGame, drive } from '../kit/headless.ts';

export function built(): void {
  log();
  pilot();
  chart();
  layout();
}

/** The log a frame drew before (#1032): its list, the selected quest's sheets and the page shown. */
function framed(g: Game, s: QuestScreen): string {
  const list = questOrder(questLog(g.tables, g.world.state, g.party)), sel = s['menu'].sel, v = list[sel];
  const sheets = v ? questSheets(v, PAGE.w, PAGE.h) : [];
  return JSON.stringify({ list: list.map((q) => q.def.id), sheets, at: Math.min(s['sheet'], Math.max(0, sheets.length - 1)) });
}

/** The log the screen keeps. */
function kept(s: QuestScreen): string {
  const sheets = s['sheets'];
  return JSON.stringify({ list: s['list'].map((q) => q.def.id), sheets, at: Math.min(s['sheet'], Math.max(0, sheets.length - 1)) });
}

const isLog = (s: unknown): s is QuestScreen => s instanceof QuestScreen;

/** The quest log: worked out as it opens and as its choice moves, and held to a frame's at each key. */
function log(): void {
  const g = headlessGame(4);
  for (const f of Object.keys(FLAG_OWNERS)) (g.party.flags as Record<string, number>)[f] = 1;
  drive(g, ['journal']);
  const s = g.top;
  if (!isLog(s)) { ok(false, `J opens the quest log (${s.constructor.name})`); return; }
  const list = s['list'], sheets0 = s['sheets'];
  ok(kept(s) === framed(g, s) && list.length > 50,
    `the log opens worked out as a frame worked it out: ${list.length} quests, the first's ${sheets0.length} sheets, on sheet ${s['sheet'] + 1}`);
  drive(g, [null, null, null]);
  ok(s['list'] === list && s['sheets'] === sheets0, 'three frames with no key work out nothing: the same list and the same sheets');
  // Every key the log takes, each against a frame of the base: the choice, the page, and keys it ignores.
  const keys: Action[] = ['left', 'left', 'right', 'down', 'down', 'right', 'up', 'interact', 'n3', 'rest', 'up', 'left', 'right', 'down', 'up'];
  const wrong: string[] = [];
  let moved = 0, turned = 0;
  for (const a of keys) {
    const sel = s['menu'].sel, at = s['sheet'], before = s['sheets'];
    drive(g, [a]);
    if (s['menu'].sel !== sel) { moved++; if (s['sheets'] === before) wrong.push(`${a}: the sheets of the last choice`); }
    else if (s['sheet'] !== at) turned++;
    if (kept(s) !== framed(g, s)) wrong.push(`${a}: ${s['menu'].sel}/${s['sheet']}`);
  }
  ok(!wrong.length && s['list'] === list && moved >= 5 && turned >= 3,
    `at each of ${keys.length} keys the log is the one a frame drew: the choice moved ${moved} times, each working out its quest's sheets, the page turned ${turned} times on them, the list the one it opened with (${wrong.join('; ') || 'none wrong'})`);
  // A quest of several sheets: Right turns its page, and the sheets stand.
  const many = list.findIndex((v) => questSheets(v, PAGE.w, PAGE.h).length > 1);
  while (s['menu'].sel !== many) drive(g, ['down']);
  for (let i = 0; i < 9; i++) drive(g, ['left']);
  const paged = s['sheets'];
  drive(g, ['right']);
  ok(many >= 0 && s['sheet'] === 1 && s['sheets'] === paged && kept(s) === framed(g, s),
    `a quest of ${paged.length} sheets (${list[many]?.def.title}): Right turns to its second, the sheets the ones its choice worked out`);
  drive(g, ['down']);
  const v = list[s['menu'].sel];
  ok(s['sheet'] === openingSheet(v, s['sheets']) && kept(s) === framed(g, s), `the next choice opens on its own opening sheet (${s['sheet'] + 1} of ${s['sheets'].length}, ${v.def.title})`);
  // A change through the game: shut, Vask's dialogue begins his quest, and the log opened again has it.
  const h = headlessGame(4);
  drive(h, ['journal']);
  const first = h.top as QuestScreen, none = first['list'].length;
  drive(h, ['journal']);
  h.world.travel('keep', 7, 4, 0);
  h.interact(h.world.featureHere() as Feature);
  for (let i = 0; i < 6 && h.top.constructor.name !== 'ExploreScreen'; i++) drive(h, ['interact']);
  const said = h.log.at(-1);
  drive(h, ['journal']);
  const again = h.top as QuestScreen;
  ok(isLog(again) && again !== first && again['list'].length === none + 1 && kept(again) === framed(h, again),
    `shut, then a quest begun through the game ("${said}"), the log opened again works it out: ${none} quests, then ${again['list'].map((q) => q.def.title).join(', ')}`);
  // A flag written behind the game's back while the log is open shows at its next opening, as nothing in play can write one.
  const flags = h.party.flags as Record<string, number>;
  const hand = Object.keys(FLAG_OWNERS).find((f) => { if (flags[f]) return false; flags[f] = 1; const differs = kept(again) !== framed(h, again); delete flags[f]; return differs; });
  if (hand) flags[hand] = 1;
  const stale = !!hand && kept(again) !== framed(h, again);
  drive(h, ['journal', 'journal']);
  ok(stale && kept(h.top as QuestScreen) === framed(h, h.top as QuestScreen),
    `a flag written by hand under the open log (${hand}) shows at its next opening, as no key the log takes writes one`);
  // A load, a new game and attract mode each put a stack of their own in place of the log.
  const n = headlessGame(4);
  drive(n, ['journal']);
  n.newGame(5);
  const fresh = n.top.constructor.name;
  n.pilot = new Pilot({ instant: true });
  drive(n, ['journal']);
  n.attract();
  const attracted = `${n.top.constructor.name} ${n.screens.length}`;
  ok(fresh === 'ExploreScreen' && attracted === 'ExploreScreen 1', `a new game (as a load does) and attract mode take the open log with the stack they replace (${fresh}; ${attracted})`);
}

/** The pilot at the helm over an open log presses keys the log takes, and the log follows each as a frame would. */
function pilot(): void {
  const g = headlessGame(4);
  for (const f of Object.keys(FLAG_OWNERS)) (g.party.flags as Record<string, number>)[f] = 1;
  g.pilot = new Pilot({ instant: true });
  drive(g, ['journal']);
  const s = g.top as QuestScreen, flags = Object.keys(g.party.flags).length;
  g.pilot.toggle(g);
  const wrong: string[] = [];
  let ticks = 0;
  for (; ticks < 40 && g.top === s; ticks++) {
    drive(g, [null]);
    if (g.top === s && kept(s) !== framed(g, s)) wrong.push(`tick ${ticks}`);
  }
  ok(!wrong.length && Object.keys(g.party.flags).length === flags,
    `with the pilot at the helm over the open log, ${ticks} ticks, the log the one a frame drew at each and no flag written under it; then ${g.top.constructor.name} on top (${wrong.join(', ') || 'none wrong'})`);
}

/** The world map: its marks worked out as it opens, kept while it is open, and worked out anew at the next opening. */
function chart(): void {
  const g = headlessGame(4);
  const kilns = g.world.locate('kilnsheart_o6', 0, 0).mapId;
  g.world.ensureMapState(kilns).used.o6_mouth = 1;
  for (const i of [0, 2]) g.party.members[i].level = PRESTIGE_LEVELS[0];
  drive(g, ['map', null]);
  const m = g.top;
  if (!(m instanceof WorldMapScreen)) { ok(false, `M opens the world map (${m.constructor.name})`); return; }
  const marks: Marks | null = m['marks'], want = JSON.stringify(marksOf(g.world));
  ok(marks !== null && JSON.stringify(marks) === want && marks.read.length === 4 && marks.sought.length >= 1 && marks.party !== null && marks.where !== '',
    `the map opens with the company's marks worked out: the party at ${marks?.party?.map(Math.round).join(', ')}, ${marks?.read.length} places read, sought by ${marks?.sought.map((p) => p.who.join(' and ')).join(', ')}, "${marks?.where}"`);
  drive(g, [null, 'up', 'next', 'zoom', null]);
  ok(m['marks'] === marks && g.top === m, 'five ticks and keys on the open map work out nothing: the same marks');
  // Shut; a step through the game, a reading forgotten and a third member at the prestige's level; open again.
  drive(g, ['map']);
  const at = (): string => `${g.world.state.mapId} ${g.world.state.x},${g.world.state.y}`, was = at();
  for (let i = 0; i < 4 && at() === was; i++) { drive(g, ['forward']); if (at() === was) drive(g, ['turnRight']); }
  delete g.world.state.maps[kilns].used.o6_mouth;
  g.party.members[4].level = PRESTIGE_LEVELS[0];
  drive(g, ['map', null]);
  const m2 = g.top as WorldMapScreen, again: Marks | null = m2['marks'], now = JSON.stringify(marksOf(g.world));
  ok(m2 !== m && again !== null && JSON.stringify(again) === now && now !== want && again.read.length === 0 && at() !== was,
    `opened again after a step (${was} to ${at()}), the reading forgotten and a third member at the prestige's level, the map works its marks out anew: ${again?.read.length} read, sought by ${again?.sought.map((p) => p.who.join(' and ')).join(', ')}`);
}

/** LAYOUT's rects and the palette's colours as the screens wrote them before (#1032). */
function layout(): void {
  const { sheet, hint, box, worldmap, worldmapKeys, view, status } = LAYOUT;
  ok(sheet.x === view.x && sheet.y === view.y && sheet.x + sheet.w === status.x + status.w && sheet.y + sheet.h === view.y + view.h && `${sheet.w}x${sheet.h}` === '624x268',
    `the sheet covers the view and the column beside it: ${sheet.x}, ${sheet.y}, ${sheet.w} by ${sheet.h}`);
  ok(hint.x === PAGE.x + PAGE.w && hint.y === sheet.y + sheet.h - 12 && `${hint.x},${hint.y}` === '620,264', `a sheet's keys end at the page's right edge on its last line: ${hint.x}, ${hint.y}`);
  ok(box.w === SAY_W + 24 && `${box.x},${box.y},${box.w},${box.h}` === '40,40,560,220', `a person's box is its words' ${SAY_W} and 12 a side: ${box.x}, ${box.y}, ${box.w} by ${box.h}`);
  ok(`${worldmap.x},${worldmap.y},${worldmap.w},${worldmap.h}` === '8,8,624,318' && `${worldmapKeys.x},${worldmapKeys.y},${worldmapKeys.right}` === '14,343,626',
    `the world map's window is ${worldmap.x}, ${worldmap.y}, ${worldmap.w} by ${worldmap.h}, its keys from ${worldmapKeys.x} to ${worldmapKeys.right} at ${worldmapKeys.y}`);
  ok(SELECTED === '#ffe08a' && HINT === '#ffe08a', `the selection's colour and the hint's are the menus' and the band's (${SELECTED}, ${HINT})`);
}
