// A wipe and the chapel the company wakes in (#1069): `nearestChapel` (src/game/chapel.ts) by the road
// of levels from every area, a chapel out of its presence passed over, and Town Portal's town where
// none stands or the atlas places the fall nowhere; then `Game.fall` as a player meets it, from a
// fight in the Grove and from all down between fights on the isle: the next morning, the first in
// the party order on 1 hit point and clean, the rest as they fell, nothing taken, the fight's groups
// standing, the two lines and the chapel's menu open; a save made there loads there, and the pilot
// stops on its line as ever.
import { ok } from './lib.ts';
import { headlessGame, headlessLoad, drive, stoppedAt } from '../kit/headless.ts';
import { TABLES, MAP_DEFS } from '../../src/content/index.ts';
import { buildMaps, PLAYED_DEFS } from '../../src/content/maps.ts';
import { nearestChapel, wakeAtChapel } from '../../src/game/chapel.ts';
import { World } from '../../src/game/world.ts';
import { GameMap } from '../../src/game/map.ts';
import { defaultParty } from '../../src/game/party.ts';
import { makeRng } from '../../src/game/rng.ts';
import { serialize } from '../../src/game/save.ts';
import type { MapDef } from '../../src/game/mapdef.ts';
import { CombatScreen } from '../../src/ui/combat.ts';
import type { InteriorScreen } from '../../src/ui/screens.ts';
import type { ChoiceScreen } from '../../src/ui/screens.ts';
import { logLines } from '../../src/ui/frame.ts';
import { Pilot } from '../../src/app/pilot/pilot.ts';
import type { Game } from '../../src/app/game.ts';

/** Where each place the ruling names wakes (#1069, ruling 2): a map of it, the chapel, and the flags set first. */
const ROAD: readonly [where: string, map: string, chapel: string, flags?: readonly string[]][] = [
  ['the Foreland', 'shelf', 'Chapel of the Lanterns'],
  ['Helmstow', 'harrow', 'Chapel of the Lanterns'],
  ['the Foreland in the chapel\'s shut window', 'shelf', 'Lantern Chapterhouse', ['q_salt_done']],
  ['the Foreland once the chapel opens again', 'shelf', 'Chapel of the Lanterns', ['q_salt_done', 'q_throne_hold']],
  ['the Grove', 'grove1', 'Lantern Chapterhouse'],
  ['Thornmark', 'thornmark', 'Lantern Chapterhouse'],
  ['Saltreach', 'delta_d5', 'The Telhus'],
  ['Wrackholm', 'wrackholm_e6', 'The Telhus'],
  ['the Dead-Drop', 'dead_drop2', 'The Telhus'],
  ['Nick\'s Locker, a lair over its area\'s band', 'nicks_locker', 'The Telhus'],
  ['the Sunderwood', 'eaves_i2', 'The Telhus'],
  ['the Ironfells', 'ironfells_m3', 'The Mine-Surgeon\'s'],
  ['Kilnmouth', 'kilnmouth_l6', 'The Sailors\' Chapel'],
  ['Cairnmoor', 'highmoor_n7', 'The Sailors\' Chapel'],
  ['Rimewater', 'longmere_m9', 'The Healer\'s House'],
  ['the Whitespine', 'monksvale_j11', 'The Healer\'s House'],
  ['Ashfall', 'cindercoast_h10', 'The Harbour Temple'],
  ['the Glasswold', 'wold_d10', 'The Harbour Temple'],
  ['Hearth Isle', 'hearthisle_h6', 'The Lantern\'s Tent'],
  ['the Underdeep', 'underdeep', 'The Lantern\'s Tent'],
];

const top = (g: Game): string => g.top.constructor.name;
const start = (id: string): MapDef['start'] => MAP_DEFS.find((d) => d.id === id)!.start;
/** The minutes of the next 07:00 after `m`: the morning a wipe wakes to, away from winter's late dawns. */
const nextSeven = (m: number): number => (Math.floor((m - 7 * 60) / 1440) + 1) * 1440 + 7 * 60;

export function fall(): void {
  // Nearest by the road of levels, from a map of every place the ruling names.
  const g = headlessGame(4), w = g.world, wrong: string[] = [];
  for (const [where, map, chapel, flags = []] of ROAD) {
    for (const f of flags) g.party.flags[f] = 1;
    w.travel(map, start(map).x, start(map).y);
    const to = nearestChapel(w), there = w.maps[to.mapId].featuresAt(to.x, to.y).some((f) => f.kind === 'temple' && f.name === chapel && w.present(f, to.mapId));
    if (to.name !== chapel || !to.chapel || !there) wrong.push(`${where}: ${to.name} at ${to.mapId} ${to.x},${to.y}, not ${chapel}`);
    for (const f of flags) delete g.party.flags[f];
  }
  ok(!wrong.length, `a wipe in each of ${ROAD.length} places wakes in the chapel ruling 2 names, standing there, its after and its until held${wrong.length ? ': ' + wrong.join('; ') : ''}`);

  // Where no chapel stands, Town Portal's town: the last town stood in, at its start.
  // (A map shares its def's features, so the maps with no temple are built from copies of the defs.)
  const bare = Object.fromEntries(PLAYED_DEFS.map((d) => [d.id, new GameMap({ ...d, features: (d.features ?? []).filter((f) => f.kind !== 'temple') })]));
  const rng = makeRng(7), none = new World(TABLES, bare, defaultParty(TABLES, rng), rng);
  none.travel('thornhold', start('thornhold').x, start('thornhold').y);
  none.travel('grove1', start('grove1').x, start('grove1').y);
  const portal = nearestChapel(none);
  // And where the atlas places the fall nowhere, a cellar of no area, chapels standing or not.
  const cellar: MapDef = { id: 'fx_cellar', name: 'Cellar', kind: 'dungeon', start: { x: 1, y: 1, facing: 0 }, rows: ['###', '#.#', '###'] };
  const placed = buildMaps(), rng2 = makeRng(7), lost = new World(TABLES, { ...placed, fx_cellar: new GameMap(cellar) }, defaultParty(TABLES, rng2), rng2);
  lost.travel('fx_cellar', 1, 1);
  const nowhere = nearestChapel(lost);
  ok(!portal.chapel && portal.mapId === 'thornhold' && portal.x === start('thornhold').x && portal.y === start('thornhold').y && !nowhere.chapel && nowhere.mapId === 'harrow',
    `with no chapel standing, the Grove wakes in Town Portal's town, the last stood in (${portal.name}); a cellar the atlas does not place, in its town before any (${nowhere.name})`);

  // A wipe in a fight in the Grove, through the combat screen: the Lanterns' night, Thornhold's Chapterhouse.
  const f = headlessGame(4);
  f.party.gold = 900;
  f.world.travel('grove1', start('grove1').x, start('grove1').y);
  const group = f.world.map.encounters[0].id;
  f.world.advance(5 * 60);
  f.fight([group]);
  const fighting = top(f), [first, ...rest] = f.party.members;
  first.conditions = ['dead', 'poisoned']; first.hp = -14;
  rest.forEach((c, i) => { c.conditions = [i % 3 === 0 ? 'unconscious' : i % 3 === 1 ? 'stoned' : 'dead']; c.hp = i % 3 === 1 ? 5 : -3; c.sp = 0; });
  const was = { gold: f.party.gold, bag: JSON.stringify(f.party.bag), flags: JSON.stringify(f.party.flags), rest: JSON.stringify(rest), minutes: f.world.state.minutes, group: JSON.stringify(f.world.state.maps.grove1.groups[group] ?? null) };
  const instant = CombatScreen.instant;
  CombatScreen.instant = true;
  let ticks = 0;
  for (; ticks < 200 && f.top instanceof CombatScreen && f.top.state.outcome === 'ongoing'; ticks++) drive(f, [null]);
  const outcome = f.top instanceof CombatScreen ? f.top.state.outcome : 'gone';
  drive(f, ['interact']);
  CombatScreen.instant = instant;
  const st = f.world.state, room = f.screens.find((s) => s.constructor.name === 'InteriorScreen') as InteriorScreen | undefined;
  const lines = ['The Lanterns carried you to the Lantern Chapterhouse.', `${first.name} wakes at dawn. The rest lie as they fell.`];
  ok(fighting === 'CombatScreen' && outcome === 'defeat' && f.screens.map((s) => s.constructor.name).join() === 'ExploreScreen,InteriorScreen,ChoiceScreen' && st.mapId === 'thornhold' && st.x === 11 && st.y === 4,
    `a wipe in the Grove's first fight (${group}, lost in ${ticks} ticks) wakes the company in Thornhold's Lantern Chapterhouse, its interior open under its menu (${f.screens.map((s) => s.constructor.name).join(', ')} at ${st.mapId} ${st.x},${st.y})`);
  ok(first.hp === 1 && first.conditions.length === 0 && JSON.stringify(rest) === was.rest,
    `the first in the party order wakes on 1 hit point, every condition lifted (${first.name}: ${first.hp} hp, ${first.conditions.join(', ') || 'well'}); the rest lie as they fell, unconscious, stoned and dead, their spell points spent`);
  ok(f.party.gold === was.gold && JSON.stringify(f.party.bag) === was.bag && JSON.stringify(f.party.flags) === was.flags && JSON.stringify(st.maps.grove1.groups[group] ?? null) === was.group,
    `nothing is taken: the gold (${f.party.gold}), the bag, the flags, and the fight's group stands where it stood, alive (${was.group})`);
  ok(st.minutes === nextSeven(was.minutes) && st.minutes > was.minutes, `the clock moves to the next 07:00 (day ${Math.floor(was.minutes / 1440)} ${was.minutes % 1440} minutes to day ${Math.floor(st.minutes / 1440)} ${st.minutes % 1440})`);
  const said = f.log.slice(-2), rows = said.map((l) => logLines(l).length);
  ok(said.join('|') === lines.join('|') && rows.every((r) => r === 1) && !!room && room.roomLog(f).join('|') === lines.join('|'),
    `the log says two lines, each a row of the log's box (${rows.join(', ')}), and the chapel's room shows them: "${said.join('" "')}"`);
  // The first menu is the one stepping in opens: Derwa keeps the Chapterhouse, so the chapel's own list is its first row.
  const opened = (f.top as ChoiceScreen).options;
  drive(f, ['interact']);
  const menu = (f.top as ChoiceScreen).options;
  ok(opened.join() === 'The chapel,Talk to Derwa,Leave' && menu[0] === `${first.name}: well\t` && menu.slice(1, 1 + rest.length).every((o, i) => o.startsWith(`${rest[i].name}: ${rest[i].conditions.join(', ')}\t`) && /\t\d+g$/.test(o)),
    `the menu stepping in opens (${opened.join(', ')}) lists, under the chapel, the first well and each of the rest at the chapel's price (${menu.slice(0, 3).map((o) => o.replace('\t', ' ')).join('; ')})`);

  // A save made at the chapel loads at the chapel, as it was.
  const back = headlessLoad(serialize(f.world.state, f.party, f.rng.state)), bs = back.world.state;
  ok(bs.mapId === 'thornhold' && bs.x === 11 && bs.y === 4 && bs.minutes === st.minutes && back.party.members[0].hp === 1 && JSON.stringify(back.party.members.slice(1)) === was.rest && top(back) === 'ExploreScreen',
    `a save made at the chapel loads there, the first on 1 hit point and the rest as they fell (${bs.mapId} ${bs.x},${bs.y})`);

  // All down between fights, on the isle: the same, at the Lantern's Tent, which stands out of doors.
  const isle = headlessGame(4), [one] = isle.party.members;
  isle.world.travel('hearthisle_h6', start('hearthisle_h6').x, start('hearthisle_h6').y);
  for (const c of isle.party.members) { c.conditions = ['dead']; c.hp = -2; }
  drive(isle, ['forward']);
  const is = isle.world.state;
  ok(top(isle) === 'ChoiceScreen' && isle.screens.some((s) => s.constructor.name === 'InteriorScreen') && is.mapId === 'caldera' && is.x === 248 && is.y === 173 && one.hp === 1 && isle.log.at(-2) === 'The Lanterns carried you to the Lantern\'s Tent.',
    `all down between fights on Hearth Isle, a step wakes the company at the Lantern's Tent, its menu open (${top(isle)} at ${is.mapId} ${is.x},${is.y})`);

  // The pilot stops on its line as ever, and a run's where is where the company fell, not the chapel.
  const run = headlessGame(4), p = new Pilot({ instant: true });
  run.pilot = p; p.toggle(run);
  run.world.travel('wrackholm_e6', start('wrackholm_e6').x, start('wrackholm_e6').y);
  const fellIn = `${run.world.zone?.name} ${run.world.state.x},${run.world.state.y}`;
  for (const c of run.party.members) { c.conditions = ['dead']; c.hp = 0; }
  drive(run, [null]);
  ok(!p.on && p.why[0] === 'The company has fallen.' && p.band()?.lines[0] === 'The company has fallen.' && run.world.state.mapId === 'saltmouth' && stoppedAt(run).where === fellIn,
    `with the pilot at the helm, a wipe in Wrackholm stops it on "${p.why[0]}" over the Telhus, and the run says it fell in ${stoppedAt(run).where}`);

  // A company of one wakes alone, and the log says nothing of the rest.
  const solo = headlessGame(4);
  solo.party.members.splice(1);
  solo.party.members[0].conditions = ['dead']; solo.party.members[0].hp = -1;
  const soloLines = wakeAtChapel(solo.world);
  ok(soloLines[1] === `${solo.party.members[0].name} wakes at dawn.`, `a company of one wakes alone ("${soloLines.join('" "')}")`);
}
