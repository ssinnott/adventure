// Ashfall's walkthrough. Its chapter, The Window, is #518's, which plays it here; until then,
// Cinderport's box (G10, #511) walked: put down at the gate's front, where Cinderport's way out lands,
// since nothing beside it is built; the gate a door into the town (#512); the road
// square to square from the gate's front up the wall to the north edge and out south-west to the west
// edge, past which, for now, the world ends; the trading ground: the ground's line, the eldest's story,
// the Riders' fires and horses and their shrine; the milestone; the chandler's racks under the wall; the
// stream forded on its stones and the knoll over it; the hermit and the clay pit under the vines; the
// box's groups won at its floor, the vines never roaming; and the factor's hide, found from the cut vines
// at its mouth. The crossing words wait for the first box beside it (#510, #513, #517). Then
// Cinderport (#512), in at the gate and out again, its businesses, its two halls and its crossings.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen } from '../../../../tools/walk.ts';
import type { Walk } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH } from '../../../game/types.ts';
import { ATLAS, MAP_DEFS, GUILD_QUESTS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import type { Feature } from '../../../game/map.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { buy, item } from '../../../game/items.ts';
import { canTrainAt, xpForLevel, rest, trainPrice, levelUp, templePrice, addCondition } from '../../../game/party.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { offered, take, inHand, report, rankOf } from '../../../game/guilds.ts';
import { rankFlag } from '../../guilds.ts';
import { take as sail, fareOf } from '../../../game/passage.ts';
import { MINUTES_PER_DAY } from '../../../game/calendar.ts';
import { serialize, deserialize } from '../../../game/save.ts';
import { World } from '../../../game/world.ts';
import { COMPACT_SHIP, RIDERS_RIDE, LAST_CROSSING } from '../../crossings.ts';
import { ACT_IV } from '../../../../tools/tests/ladder.ts';
import { ARMOURER, CURES } from './items.ts';
import { INTERIORS } from './interiors.ts';
import { GATE } from './maps/cindercoast_g10.ts';

const G10 = MAP_DEFS.find((d) => d.id === 'cindercoast_g10')!;
const person = (name: string): Person => G10.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
const COAST = ATLAS.zones.find((z) => z.id === 'cindercoast')!;

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);
  const out = buildMaps()[OUTDOORS];
  const g10 = out.zones.find((z) => z.id === 'cindercoast_g10')!;
  w.level = 24;
  for (const m of w.party.members) m.level = 24;
  const at = (x: number, y: number): number => (g10.y + y) * out.width + g10.x + x;
  const onG10 = (x: number, y: number): boolean => x >= g10.x && x < g10.x + g10.w && y >= g10.y && y < g10.y + g10.h;
  const reach = (fx: number, fy: number, along: (x: number, y: number) => boolean): Set<number> => {
    const seen = new Set([(g10.y + fy) * out.width + g10.x + fx]), q = [[g10.x + fx, g10.y + fy]];
    for (let i = 0; i < q.length; i++) {
      const [x, y] = q[i];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = (y + dy) * out.width + x + dx; if (!seen.has(k) && along(x + dx, y + dy)) { seen.add(k); q.push([x + dx, y + dy]); } }
    }
    return seen;
  };
  const walk = (x: number, y: number): boolean => onG10(x, y) && out.passable(x, y) === 'ok';

  // The way in: nothing beside the box is built, so the company is put down at the gate's front, where
  // Cinderport's way out lands (#512) and the ship and the ride come in through the town (#547).
  ok(G10.start.x === GATE.x && G10.start.y === GATE.y + 1 && G10.start.facing === SOUTH && G10.exits?.length === 1 && G10.exits[0] === GATE,
    'the box\'s way in is the gate\'s front, 6,3, facing south, and its one way out but its edges is Cinderport\'s gate');
  ok(COAST.maps?.length === 1 && COAST.maps[0].map === 'cindercoast_g10' && !!COAST.crossing?.harder && !!COAST.crossing?.warning,
    'Cindercoast holds G10 and has its crossing words, said when a box beside it is built and walked over (#166)');
  w.world.travel('cindercoast_g10', G10.start.x, G10.start.y, SOUTH);
  ok(w.world.zone?.id === 'cindercoast_g10' && w.world.state.x === g10.x + GATE.x && w.world.state.y === g10.y + GATE.y + 1, 'put down at the gate\'s front on G10');

  // The gate open (#512): a door in the town's wall into Cinderport, nobody barring its front.
  ok(out.at(g10.x + GATE.x, g10.y + GATE.y).door === 'door' && GATE.to === 'cinderport' && !G10.features!.some((f) => f.x === GATE.x && f.y === GATE.y + 1),
    'the gate at 6,2 is a door into Cinderport (GATE), and nobody bars its front');
  const plate = ATLAS.places.find((p) => p.id === 'cinderport')!.at;
  ok(Math.floor(plate[0]) === g10.x + GATE.x && Math.floor(plate[1]) === g10.y + GATE.y, `the gate at 6,2 is Cinderport's plate on the atlas (${plate.join(',')})`);

  // The road square to square from the gate's front, up the wall's west side to the north edge and out
  // south-west through the vines to the west edge; past both, for now, the world ends.
  const road = reach(GATE.x, GATE.y + 1, (x, y) => onG10(x, y) && out.at(x, y).ch === '=');
  ok(road.has(at(3, 0)) && road.has(at(0, 7)) && road.has(at(0, 8)) && out.passable(g10.x + 3, g10.y - 1) !== 'ok' && out.passable(g10.x - 1, g10.y + 7) !== 'ok',
    'the road runs square to square from the gate\'s front to the north edge at 3,0 and to the west edge at 0,7 and 0,8, and past both, for now, the world ends');
  const stone = G10.features!.find((f) => f.kind === 'event' && f.id === 'g10_milestone');
  ok(stone?.kind === 'event' && stone.text.includes('OLD CINDER 4, THE WOLD 6') && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => road.has(at(stone.x + dx, stone.y + dy))),
    'the milestone stands by the road where it leaves the ground: OLD CINDER 4, THE WOLD 6');
  see(w, 'cindercoast_g10:g10_milestone');

  // The trading ground: the ground's line, the eldest's story at the Riders' fire, their horses and shrine.
  see(w, 'cindercoast_g10:g10_ground');
  ok(w.world.used('g10_ground'), 'on the ground outside the gate, the horses and the fires: the Riders come down to trade');
  const eldest = person('The eldest');
  w.world.travel('cindercoast_g10', eldest.x, eldest.y);
  const story = meet(eldest, w.party, heard(w.world, eldest)).text;
  ok(story.includes('pillar of fire') && story.includes('Remember what that cost'), 'the Riders\' eldest tells the oldest story on this side of the sea');
  const fires = G10.features!.find((f) => f.kind === 'camp' && f.name === 'The Riders\' fires');
  ok(!!fires && Math.abs(fires.x - eldest.x) + Math.abs(fires.y - eldest.y) <= 3, 'the Riders\' fires are a camp beside the horse-lines, by the eldest');
  see(w, 'cindercoast_g10:g10_horses');
  const shrine = G10.features!.find((f): f is Extract<typeof f, { kind: 'shrine' }> => f.kind === 'shrine' && f.id === 'g10_shrine');
  ok(!!shrine && out.at(g10.x + shrine.x, g10.y + shrine.y).ch === ',' && shrine.text.includes('horse'), 'the Riders\' shrine stands on the ground, a horse\'s skull on a post');
  const racks = G10.features!.find((f) => f.kind === 'event' && f.id === 'g10_racks');
  ok(!!racks && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => out.at(g10.x + racks.x + dx, g10.y + racks.y + dy).solid === 'building'), 'the chandler\'s racks stand under the town\'s wall');
  see(w, 'cindercoast_g10:g10_racks');

  // Over the stream on its stones to the knoll, and the vines along the shore east of the town.
  const dry = reach(GATE.x, GATE.y + 1, walk);
  ok(dry.has(at(21, 2)) && dry.has(at(26, 8)) && !reach(GATE.x, GATE.y + 1, (x, y) => walk(x, y) && out.at(x, y).ch !== '"').has(at(21, 2)),
    'the stream is crossed only on its stones, to the knoll and the vines east of it');
  see(w, 'cindercoast_g10:g10_knoll');

  // Under the west vines, the hermit who came down off the mountain, and the potter's clay pit.
  const hermit = person('A hermit');
  w.world.travel('cindercoast_g10', hermit.x, hermit.y);
  ok(meet(hermit, w.party, heard(w.world, hermit)).text.includes('came down off the mountain'), 'the hermit under the vines came down off the mountain, as the first did');
  see(w, 'cindercoast_g10:g10_clay');

  // The box's groups, each won at its floor: the beetles south of the ground, the vines in the shore's
  // trees, which never roam, and at the far end the salamanders and the drake, the box's group at 25.
  ok(G10.encounters!.filter((g) => g.monsters.includes('strangler_vine')).every((g) => g.roams === false), 'the strangler vines never roam');
  for (const g of G10.encounters!) fight(w, `cindercoast_g10:${g.id}`);
  const overhead = G10.features!.find((f) => f.kind === 'event' && f.id === 'g10_overhead');
  ok(overhead?.kind === 'event' && JSON.stringify(overhead.when) === JSON.stringify({ hours: 'day' }), 'by day a drake turns over the ash, a warning of the slopes');

  // The secret: the cut vines at the hide's mouth, the search there and the crates behind the trees.
  // Walked, waded, climbed or floated, the hide is never reached but through its mouth.
  const [door] = G10.secrets!;
  const shut = reach(door.x - 1, door.y, (x, y) => !(x === g10.x + door.x && y === g10.y + door.y) && onG10(x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok');
  ok(shut.size > 300 && !shut.has(at(door.x + 1, door.y)) && !shut.has(at(door.x + 2, door.y)), `the hide is shut but for its mouth: none of G10's ${shut.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'cindercoast_g10:g10_cut');
  w.world.travel('cindercoast_g10', door.x - 1, door.y, EAST);
  let opens = false;
  for (let i = 0; i < 20 && !opens; i++) opens = w.world.search();
  const inside = opens ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(opens && inside.every((r) => r.kind === 'moved') && w.world.used('g10_crates'), 'searched where the vines are cut, the trees open, and the crates behind them can be walked to');
  listen(w);
  const hide = G10.features!.find((f) => f.kind === 'chest' && f.id === 'g10_hide');
  ok(hide?.kind === 'chest' && hide.items.includes('longsword+2') && hide.x === door.x + 2 && hide.y === door.y, 'in the hide, among the crates, a Long Sword +2');

  cinderport(ok);
};

/**
 * Cinderport (#512): in at G10's gate with the town's gate line, a step inside to the gate-ward, and
 * out again; a night at the inn, the act's step bought at the armourer's, the provisions, lamp oil and
 * the stone cure at the chandler's, the stone lifted at the temple at the cure's price for a member of
 * 25, and training to 27 at the yard; either hall's ladder joined, the Cartographers' at the Chart
 * House and the Compact's at the factor's house, which pays the Fence's rung; the Compact's ship from
 * Kilnhaven's steps to the Compact's steps here and back, halved here for a member of the Compact; and
 * the ride and the last crossing, whose far ends are not built, sold by nobody yet, their sellers only
 * talking and their landings written; the smith, the potter, the guildsman and the factor with words
 * only, their quests others' (#519, #635, #448).
 */
function cinderport(ok: (cond: boolean, msg: string) => void): void {
  const PORT = MAP_DEFS.find((d) => d.id === 'cinderport')!;
  const here = <K extends Feature['kind']>(kind: K): Extract<Feature, { kind: K }>[] => PORT.features!.filter((f): f is Extract<Feature, { kind: K }> => f.kind === kind);
  const who = (name: string): Person => here('npc').find((f) => f.name.startsWith(name)) as Person;
  const says = (w: Walk, p: Person): string => { w.world.travel('cinderport', p.x, p.y); return meet(p, w.party, heard(w.world, p)).text; };
  const RIDER = who('A Rider'), MORWENNA = who('Morwenna'), JAGO = who('Jago'), GORRAN = who('Gorran'), JENIFER = who('Jenifer'), CADOR = who('Cador'), HENDRA = who('Hendra');
  const w = newWalk(ok);
  w.level = 24;
  for (const m of w.party.members) m.level = 24;

  // In at G10's gate, saying the town's gate line, onto the first square inside the south gate; a step
  // in, the gate-ward; and out by the gate onto the gate's front on G10, facing the trading ground.
  w.world.travel('cindercoast_g10', GATE.x, GATE.y + 1, NORTH);
  const step = w.world.move('forward'), inside = step.kind === 'moved' ? step.messages : [];
  ok(w.world.state.mapId === 'cinderport' && w.world.state.x === PORT.start.x && w.world.state.y === PORT.start.y && w.world.state.facing === NORTH && GATE.tx === PORT.start.x && GATE.ty === PORT.start.y,
    'G10\'s gate lets the company in just inside Cinderport\'s south gate, facing up the street');
  ok(inside.join() === GATE.label, `going in, the town's gate line (${inside.join(' / ')})`);
  const ward = w.world.move('forward');
  ok(ward.kind === 'moved' && ward.messages.some((t) => t.startsWith('The gate-ward')), `a step inside, the gate-ward (${ward.kind === 'moved' ? ward.messages.join(' / ') : ward.kind})`);
  listen(w);
  w.world.travel('cinderport', PORT.start.x, PORT.start.y, SOUTH);
  const leave = w.world.move('forward');
  ok(leave.kind === 'moved' && w.world.zone?.id === 'cindercoast_g10' && w.world.state.x - w.world.zone.x === GATE.x && w.world.state.y - w.world.zone.y === GATE.y + 1 && w.world.state.facing === SOUTH,
    'and out by the gate onto G10\'s 6,3, the gate\'s front, facing the trading ground');
  ok(PORT.exits!.length === 1 && PORT.exits!.every((e) => !e.shut && !e.needFlag), 'nothing shuts the gate');
  listen(w);

  // A night at the inn, as the business's screen does it (src/ui/screens.ts).
  ok(here('inn').length === 1 && here('temple').length === 1 && here('trainer').length === 1 && here('shop').length === 2 && !here('guild').length
    && INTERIORS.every((id) => PORT.features!.some((f) => 'interior' in f && f.interior === id)),
    'Cinderport has its eight businesses, each opening into its room: the inn, the temple, the armourer\'s, the chandler\'s, the yard, the two halls and the potter\'s; and no spell hall');
  w.party.gold = 60000;
  const inn = here('inn')[0], night = inn.price * w.party.members.length;
  for (const m of w.party.members) { m.hp = 1; m.sp = 0; }
  w.party.gold -= night;
  for (const m of w.party.members) rest(m);
  w.world.sleepUntilMorning();
  ok(w.party.members.every((m) => m.hp === m.maxHp && m.sp === m.maxSp) && w.world.hour >= 6 && w.world.hour <= 9 && w.party.gold === 60000 - night, `a night at ${inn.name} for ${night} gold, and the company wakes whole in the morning`);

  // The armourer's sells the act's one step (#542), each class its rung at 25, at list price; the
  // chandler's the provisions, lamp oil and the stone cure (#546), and no steel.
  const armourer = here('shop').find((f) => f.interior === 'cinderport_armourer')!, chandler = here('shop').find((f) => f.interior === 'cinderport_chandlery')!;
  ok(armourer.stock.length === ARMOURER.length && ARMOURER.every((id) => armourer.stock.includes(id)) && !armourer.prices, `${armourer.name} sells the act's step, all ${ARMOURER.length} wares and nothing else, at list price`);
  for (const m of w.party.members) for (const id of ACT_IV[0].classes[m.cls]) {
    const before = w.party.gold;
    ok(!!buy(w.party, armourer, id) && before - w.party.gold === item(id).price, `${m.name} buys a ${item(id).name} at the armourer's for ${item(id).price} gold`);
  }
  ok(['rations', 'lantern_oil', 'potion_heal', 'antidote', ...CURES].every((id) => chandler.stock.includes(id)) && !chandler.stock.some((id) => ARMOURER.includes(id)) && !chandler.prices,
    'the chandler\'s sells the provisions, lamp oil and the Quickening Draught at list price, and no steel');
  const cure = item(CURES[0]), gold = w.party.gold;
  ok(!!buy(w.party, chandler, cure.id) && gold - w.party.gold === cure.price && w.party.bag.includes(cure.id), `a ${cure.name} bought at the chandler's for ${cure.price} gold`);

  // The temple lifts the stone at 80 gold a level: for a member of 25, the cure's own price (#546).
  const glassed = structuredClone(w.party.members[0]);
  glassed.level = 25; addCondition(glassed, 'stoned');
  ok(templePrice(glassed) === cure.price && here('temple')[0].interior === 'cinderport_temple', `${here('temple')[0].name} lifts the stone from a member of 25 for ${templePrice(glassed)} gold, the cure's price`);

  // Training to 27 at the yard, on a copy, so the company walks on as it was.
  const yard = here('trainer')[0], trainee = structuredClone(w.party.members[0]);
  trainee.level = 26; trainee.xp = xpForLevel(27);
  ok(yard.maxLevel === 27 && yard.interior === 'cinderport_yard' && canTrainAt(trainee, yard.maxLevel), `${yard.name} will train a member of 26`);
  const fee = trainPrice(trainee);
  levelUp(trainee, makeRng(1), 27);
  ok(trainee.level === 27 && !canTrainAt(trainee, yard.maxLevel), `who trains to 27 for ${fee} gold, and no further`);

  // The two halls (#443, call 7), each a room: the Chart House the Cartographers' second, and the
  // factor's house the Compact's. A new company joins either ladder here, its first task offered and taken.
  const chart = here('npc').find((f) => f.interior === 'cinderport_cartographers')!, house = here('npc').find((f) => f.interior === 'cinderport_factor')!;
  ok(chart.hall === 'cartographers' && house.hall === 'compact', `${chart.name} is the Cartographers' hall and ${house.name} the Compact's`);
  for (const g of ['cartographers', 'compact'] as const) {
    const p = structuredClone(w.party), [first] = offered(g, p);
    ok(!!first && first.rank === 0 && !take(first, w.world.state, p).length && inHand(g, p).some((q) => q.id === first.id), `a new company joins the ${g} ladder here: ${first?.title} offered and taken`);
  }
  // The Fence's rung (#635), offered to the Compact's rank 2 and paid at the factor's house once the
  // Dead-Drop's stair is gone down, as at the Keel.
  const fence = GUILD_QUESTS.find((q) => q.id === 'compact_fence')!, f = newWalk(ok);
  f.party.flags[rankFlag('compact')] = 2;
  ok(offered('compact', f.party).some((q) => q.id === fence.id) && !take(fence, f.world.state, f.party).length, `${fence.title} offered to a company of the Compact's rank 2, and taken`);
  see(f, 'dead_drop_stair:dd_foot');
  f.world.travel('cinderport', house.x, house.y);
  const purse = f.party.gold, paid = report('compact', f.world.state, f.party);
  ok(paid.length >= 1 && f.party.gold === purse + (fence.pay.gold ?? 0) && rankOf('compact', f.party) === 3, `and paid at ${house.name} (${paid.join(' ').replace(/\n+/g, ' ')})`);

  // The Compact's ship (#547): sold on Kilnhaven's quay to the Compact's steps here for its whole fare,
  // it sails at 20:00 and ties up two days on at 16:00, the steps said as the company comes ashore, and
  // a save made there loads there; her master on the steps here sells the way back to Kilnhaven's steps,
  // halved for a member of the Compact as Kitto's boat is, and Kilnhaven halves none.
  const kilnhaven = MAP_DEFS.find((d) => d.id === 'kilnhaven')!.features!.find((x): x is Person => x.kind === 'npc' && x.name.startsWith('Jago'))!;
  const steps = COMPACT_SHIP.ends.find((e) => e.at === 'cinderport')!, home = COMPACT_SHIP.ends.find((e) => e.at === 'kilnhaven')!.landing!;
  const [over, ...more] = kilnhaven.passage ?? [];
  ok(!!over && !more.length && over.to === 'cinderport' && over.x === steps.landing?.x && over.y === steps.landing.y && over.fare === COMPACT_SHIP.fare && over.days === COMPACT_SHIP.days && !over.half,
    `on Kilnhaven's quay Jago sells the Compact ship to Cinderport's steps, ${over?.fare} gold and ${over?.days} days, halved for nobody`);
  const s = newWalk(ok);
  for (const m of s.party.members) m.level = 24;
  s.world.travel('kilnhaven', kilnhaven.x, kilnhaven.y);
  s.world.state.minutes = Math.floor(s.world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY + 9 * 60;
  s.party.gold = COMPACT_SHIP.fare;
  const day = s.world.day, sailed = sail(over, s.world, s.party), ashore = sailed.taken ? s.world.eventsHere() : [];
  ok(sailed.taken && s.party.gold === 0 && s.world.state.mapId === 'cinderport' && s.world.state.x === 13 && s.world.state.y === 2 && s.world.state.facing === SOUTH && PORT.rows[2][13] === '"',
    `the ship ties up at Cinderport and puts the company on the Compact's steps under the factor's house (${sailed.lines.join(' ')})`);
  ok(sailed.lines.join() === steps.label && ashore.some((t) => t.startsWith('The Compact\'s steps')) && s.world.day === day + 2 && s.world.hour === 16,
    `with Cinderport's own line and the steps said, two days on at 16:00 (${ashore.join(' / ')}; day ${day} to day ${s.world.day})`);
  const kept = deserialize(serialize(s.world.state, s.party, 0)), loaded = new World(buildMaps(), kept.party, makeRng(1), kept.world);
  ok(loaded.state.mapId === 'cinderport' && loaded.state.x === 13 && loaded.state.y === 2, 'a save made on the steps loads there');
  const [back, ...others] = JAGO.passage ?? [];
  ok(!!back && !others.length && back.to === 'kilnhaven' && back.x === home.x && back.y === home.y && back.fare === COMPACT_SHIP.fare && back.days === COMPACT_SHIP.days,
    `on the steps here ${JAGO.name.split(',')[0]}, the same master, sells the ship back to Kilnhaven's steps`);
  s.world.travel('cinderport', JAGO.x, JAGO.y);
  const full = fareOf(back, s.world);
  s.party.flags.q_compact_run_done = 1;
  const half = fareOf(back, s.world);
  ok(full === COMPACT_SHIP.fare && half === COMPACT_SHIP.fare / 2, `a stranger pays ${full} gold and a member of the Compact ${half}`);
  s.party.gold = half;
  const went = sail(back, s.world, s.party);
  ok(went.taken && s.party.gold === 0 && s.world.state.mapId === 'kilnhaven' && s.world.state.x === home.x && s.world.state.y === home.y, `and the ship puts the member back on Kilnhaven's steps for ${half} (${went.lines.join(' ')})`);

  // The quay's line where the street comes down to it: the ship, and the light beyond the Sound.
  see(w, 'cinderport:cp_quay');
  const quay = here('event').find((e) => e.id === 'cp_quay')!;
  ok(w.world.used('cp_quay') && quay.text === 'The Compact\'s ship rides at the quay with Kilnhaven\'s mark on her. Beyond the Sound, a column of light.', 'on the quay, the ship with Kilnhaven\'s mark and a column of light beyond the Sound');

  // The ride and the last crossing (#547): Cinderport writes where each puts a company down, just inside
  // the gate by the Riders' rail and on the Compact's steps; each is sold once its far end lands (Akordu,
  // #526; Hearth Isle, Phase 1.5) and not before, its seller only talking and naming no fare.
  for (const [c, seller] of [[RIDERS_RIDE, RIDER], [LAST_CROSSING, MORWENNA]] as const) {
    const ours = c.ends.find((e) => e.at === 'cinderport')!, far = c.ends.find((e) => e.at !== 'cinderport')!, words = says(w, seller);
    ok(!!ours.landing && !ours.owed && (seller.passage ?? []).length === (far.landing ? 1 : 0) && (!!far.landing || !/gold|fare|hundred/i.test(words)),
      `${c.name} lands at ${ours.landing?.x},${ours.landing?.y}, and ${seller.name.split(',')[0]} sells it once ${far.name} lands (${far.owed ?? 'landed'}), naming no fare till then`);
  }
  const ride = RIDERS_RIDE.ends.find((e) => e.at === 'cinderport')!.landing!, last = LAST_CROSSING.ends.find((e) => e.at === 'cinderport')!.landing!;
  ok(Math.abs(ride.x - PORT.start.x) + Math.abs(ride.y - PORT.start.y) === 1 && Math.abs(ride.x - RIDER.x) + Math.abs(ride.y - RIDER.y) === 1 && JSON.stringify(last) === JSON.stringify(steps.landing),
    'the ride sets a company down just inside the gate by the Rider, and the last crossing on the Compact\'s steps, as the ship does');
  ok(says(w, MORWENNA).includes('Hearth Isle'), 'the harbourmaster says where the last crossing goes, and no more');

  // The smith with the shovel that does not blunt, the potter, the guildsman and the factor speak, and
  // ask nothing yet: their quests are #519's, #635's and #448's.
  const shovel = says(w, GORRAN), cups = says(w, JENIFER), shelf = says(w, CADOR);
  ok([GORRAN, JENIFER, CADOR, HENDRA].every((p) => !p.choice && !p.quest && !p.flag && !p.interior) && shovel.includes('will not take a burr') && cups.includes('came down off the mountain') && shelf.includes('they stopped at the Stone'),
    'the smith\'s shovel-head will not take a burr, the potter\'s cups are the first folk\'s shape, and the guildsman says Fane wrote at the Stone; none asks anything yet');
}
