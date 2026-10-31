// Hearth Isle's walkthrough, as scenes that each run alone (#1033), a section of the road to each.
// The boxes first, as each was built, and its chapter last: the
// isle (H6, #753) walked at 28: the last crossing bought at Cinderport's quay and landed on the strand at
// 20,30, and its boatman selling it back; the light close at the cleft's foot and the hum on the strand;
// the cleft carved up through the rim and its pickets; the Bowl, the pilgrims' camp and its rest, its
// three tents and the shrine; the three pilgrims' questions, a token taken and the other two gone, and
// each token another way; the Hearth, the warm ground and the Grove's sliver humming for a company that
// carries it; the temple's door; the lookouts; the cache found from the draught; the moths by night; the
// Compact's runner or the Wardens' sergeant; and the box's groups won at 28. Then the east rim (I6, #754):
// the rim's path from the Bowl with the pocket's fight, Anchorhold's yard and the cell, the east foot,
// the Hand's camp and its guard, the Steps, the grey door read, the takings found from the tally-house and
// the smell; a detour to the vigil cell in the rim's east face (#864), found and never told, from the vein of
// glass in the turf that stops at the rock: the door found by a search, the Vigil Robe in the plain chest and the
// Levin Mace in the grey-banded one, which the company's thief picks (the finds themselves, off the ladder, in no
// shop and inside the window, and the lock's refusals are held on their own, `vigilFinds` and `vigilLocked`); the
// moths by night and the guard gone once Vask is gone from Helmstow. Then the temple,
// Hearthfane (#755): in at the door and out again, the nave's moths, the pillar read, the sacristan's lamps
// put out wrong and then in the pillar's order (56), the moths gone to the light, his key, the treasury
// that opens to it and to nothing else, the Hand's best won at 28 and the court's second gone with Vask.
// Then its crypt (#756), walked at 29: down the stair behind the altar and up again, the chamber's
// champions, the eleven niches and the eleven kept for a company that gave the log, the side vault's dead
// and rats, the keeper at the passage and her knot on the grey door's frame. Then the Ways (#757), walked
// at 30: down through the grey door and up again, every frame read and the hatch found from the eighth, the
// crawl way, the crack sealed and widened (61), the CREW ONLY door answered both ways and walked through
// (60), and the groups won at 30. Then the Stair (#758), walked at 30: down the ways' last door and up
// again, and out of the crawl way onto its fourth landing; the first landing held for the badge carried
// (57), and on other walks the rearguard won where nobody holds it and a verdict that outranks a token; the
// dead and the letter (58); her name on the last frame (59); the groups won at 30, and the Catcher at 31;
// the last door shut on four of the road's five and open on the five. Then the Heart (#759), at 32: the
// door, the heart and its roof; Vask's parley and the fight on the clock, won with the Hands killed first
// and with the clock left to run; the panel, Vask after, the voice, the girl and the ring; each of her
// three answers once, the third with Fane's map, its pages and the ring, which begins The Signet (64); and
// for a Council that removed Vask the thinned group, and who stands inside the door.
// Last, the Cleric's third (#763), The Eleven Kept, played twice by a cleric of 27 with the second: the
// anchoress's ask and then the Crowness keeper's log, the eleven lit and the third taught; and the log
// brought before the ask. Then three companies short of the ask: she never asks it of them, and the log
// she takes from them begins no journal. Then the chapter, The Heart (#760), played to each of its three
// ends from the road behind done, and once by a company over early on four of the road's five.
// The Stair's scene sees her knots in the Ways by hand, as the Ways left them; the chapter's steps
// are in steps.ts.
import { newWalk, mapDef, groupOn, featureOn, ownMaps, see, kneel, fight, listen, walkThrough, gone as left, playChapter, everyGoalWalked, goalFromBegun, quest, ending, goalOf, written, holding, keys, thiefDown, same, hour, log, key, press, chest } from '../../../../tools/kit/walk.ts';
import { apartFrom, zone } from '../../../../tools/kit/grid.ts';
import type { Walk, Scene } from '../../../../tools/kit/walk.ts';
import { NORTH, EAST, SOUTH, WEST } from '../../../game/types.ts';
import type { Facing } from '../../../game/types.ts';
import { ATLAS, MAP_DEFS, QUESTS, AREAS, MONSTERS, TABLES } from '../../index.ts';
import { CURVE } from '../../progression.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { meet, heard, answer, handIns } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import type { Feature, MapDef } from '../../../game/mapdef.ts';
import { item, hits, sellPrice } from '../../../game/items.ts';
import { elementMult } from '../../../game/monsters.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { xpForLevel, takePrestige, className, PRESTIGES, defaultParty, equip, statOf, spellHeal } from '../../../game/party.ts';
import type { Party } from '../../../game/party.ts';
import { teach, barOf } from '../../../game/prestige.ts';
import { seekId, sought } from '../../../game/seeking.ts';
import { take as ride } from '../../../game/passage.ts';
import { endingTaken } from '../../../game/stones.ts';
import { ENDINGS } from '../../endings.ts';
import { winRate, gateOpts } from '../../../../tools/kit/fight.ts';
import { ANSWER } from '../../../game/bot.ts';
import { GEAR } from '../../../../tools/kit/company.ts';
import { restRefused } from '../../../game/wilds.ts';
import { questLog, holds } from '../../../game/quests.ts';
import { readerOf } from '../../../game/inscriptions.ts';
import { LAST_CROSSING } from '../../crossings.ts';
import { COMPACT_OVER, COMPACT_WARDENS } from '../saltreach/public.ts';
import { THRONE_REMOVED, THRONE_HOLD, THRONE_TALLIS } from '../shelf/public.ts';
import { STRAND, PILGRIMS, TOKEN_COUSIN, TOKEN_HOLD, TOKEN_TALLIS } from './maps/hearthisle_h6.ts';
import { KEPT_ASKED } from './maps/hearthisle_i6.ts';
import { LAMPS, LAMPS_OUT, LAMPS_WRONG, LAMPS_KEY, FANE_KEY, LAMP_FLAGS, STAIR } from './maps/hearthfane.ts';
import { ELEVEN_KEPT, GREY_DOOR, LOG_GIVEN } from './maps/hearthfane2.ts';
import { STAIR_DOOR, CRAWL_DOOR } from './maps/underdeep.ts';
import { CREW_OPEN, CREW_SHUT, CRACK_SEALED, CRACK_WIDE, VOICE_WHOLE, SIGNET } from './public.ts';
import { FIVE, LAST_DOOR } from './maps/underdeep2.ts';
import { VASK, VASK_FALLEN, RING_GIVEN, END_REIGNITE, END_ARRIVE, END_FINISH } from './maps/core.ts';
import { THE_QUEST } from '../../index.ts';
import type { Chapter, QuestCond, QuestDef } from '../../../game/quests.ts';
import { PAGE } from '../../../ui/quests.ts';
import { wrap } from '../../../ui/draw.ts';
import { ROAD_EAST } from '../glasswold/public.ts';
import { CHAPTER } from './chapter.ts';
import type { GameMap } from '../../../game/map.ts';
import { STEPS, FOR_TALLIS, WITH_THE_MAP, EARLY, CROSSING } from './steps.ts';

const H6 = mapDef('hearthisle_h6');
const person = (name: string): Person => H6.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
const ISLE = ATLAS.zones.find((z) => z.id === 'hearthisle')!;

// ---- the vigil cell in the east rim (#864) ----

const RIM = mapDef('hearthisle_i6');
type Chest = Extract<Feature, { kind: 'chest' }>;
type Happening = Extract<Feature, { kind: 'event' }>;
const eventOf = (id: string): Happening => featureOn(RIM, id, 'event');

/** The isle's two boxes laid side by side as the world lays them, I6 32 squares on from H6, so that a walk may cross the seam between them. */
const WHOLE_ISLE: MapDef = { ...H6, id: 'hearthisle', features: [], exits: [], secrets: [], encounters: [], rows: H6.rows.map((r, y) => r + RIM.rows[y]) };

/**
 * The detour (#864), on from the Hand's takings in the same rim: the vein of glass in the turf that ends at the rim's
 * east face is seen, a search where it ends finds the door, and the company goes in. The plain chest gives the Vigil
 * Robe; the grey-banded one is locked, and the company's thief picks it (the premade six's Ottilie is born to Lockpick,
 * #857; what the lock refuses is played on a game of its own, `vigilLocked`). The Levin Mace comes out of it.
 */
function theVigil(w: Walk): void {
  const door = RIM.secrets![1], glass = eventOf('i6_scorch'), inside = eventOf('i6_vigil');
  const plain = chest(RIM, 'i6_vigil_chest'), banded = chest(RIM, 'i6_vigil_locked');
  const standsOn = (c: { x: number; y: number }): boolean => { const o = w.world.locate(RIM.id, c.x, c.y); return !!o && w.world.state.x === o.x && w.world.state.y === o.y; };
  w.ok(door.hint === glass.id && glass.x === door.x + 1 && glass.y === door.y && RIM.rows[door.y][door.x] === 'S' && RIM.rows[door.y - 1][door.x] === 'r' && RIM.rows[door.y + 1][door.x] === 'r',
    'the vigil cell\'s door is the box\'s second secret, in the rim\'s east face between rock above and below, and the vein of glass ends on its near side');
  see(w, `${RIM.id}:${glass.id}`);
  w.ok(w.world.used(glass.id), 'the vein of glass in the turf is seen where it stops at the rock');
  w.world.travel(RIM.id, glass.x, glass.y, WEST);
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  w.ok(found, 'a search where the glass stops finds the door in the rock');
  const in3 = [w.world.move('forward'), w.world.move('forward'), w.world.move('forward')];
  w.ok(in3.every((r) => r.kind === 'moved') && w.world.used(inside.id) && standsOn(plain), 'through the door the cell runs on west: its first square, and the plain chest on the second');
  w.world.markUsed(plain.id); w.party.gold += plain.gold; w.party.bag.push(...plain.items);
  const robe = w.party.bag.includes('vigil_robe');
  w.world.move('forward');
  w.ok(robe && standsOn(banded), 'the plain chest gives the Vigil Robe, and the grey-banded chest stands at the back');
  const gold = w.party.gold, before = keys(w);
  const said = w.world.unlock();
  w.ok(banded.locked === true && said === 'Ottilie picks the lock.' && keys(w) === before, `the company's thief picks the grey-banded lock, born to Lockpick (${said || 'nothing'}), and no key is spent`);
  w.world.markUsed(banded.id); w.party.gold += banded.gold; w.party.bag.push(...banded.items);
  w.ok(w.party.bag.includes('levin_mace') && w.party.gold === gold && !banded.items.includes('key_iron'), 'and in it the Levin Mace, no gold and no key');
  listen(w);
}

/**
 * The grey-banded chest on the real map (#864), pressed on in a game of its own with the company dressed each way: a
 * company with neither a Lockpick nor an iron key is refused ("Locked.", twice) and the chest stays shut and full; a
 * thief standing, born to Lockpick, opens it and keeps its key; a key opens it and is spent. The plain chest beside it
 * has no lock and opens to the company that cannot open the other.
 */
function vigilLocked(ok: (cond: boolean, msg: string) => void): void {
  const banded = chest(RIM, 'i6_vigil_locked'), plain = chest(RIM, 'i6_vigil_chest');
  const prize = 'You open the chest: Levin Mace. The chest is empty.';
  const cases: [string, Chest, (p: Party) => void, string][] = [
    ['no Lockpick standing and no key', banded, thiefDown, 'A locked chest. Locked. Locked. | shut | left | 0 keys'],
    ['the thief standing, born to Lockpick, no key', banded, () => undefined, `A locked chest. Ottilie picks the lock. ${prize} | spent | taken | 0 keys`],
    ['the thief standing and a key carried, which is kept', banded, key, `A locked chest. Ottilie picks the lock. ${prize} | spent | taken | 1 keys`],
    ['no Lockpick standing and an iron key, which is spent', banded, (p) => { thiefDown(p); key(p); }, `A locked chest. The lock turns. The key crumbles. ${prize} | spent | taken | 0 keys`],
    ['no Lockpick and no key, at the plain chest beside it', plain, thiefDown, 'A chest. Space opens it. You open the chest: Vigil Robe. The chest is empty. | spent | taken | 0 keys'],
  ];
  const wrong = cases.flatMap(([who, c, dress, want]) => { const said = press(RIM.id, WEST, c, dress); return said === want ? [] : [`${who}: "${said}", wanted "${want}"`]; });
  ok(banded.locked === true && !plain.locked && !wrong.length,
    `the grey-banded chest refuses a company with neither a Lockpick nor an iron key and opens to either, the plain chest beside it opening to any (${cases.map(([who]) => who).join('; ')})${wrong.length ? ' -> ' + wrong.join('; ') : ''}`);
}

/**
 * The two finds (#864), off the ladder: the Levin Mace is the Slag Mace of Cinderport's 25 with lightning on its head, the
 * rung under the Grey Blade the ladder wears from 28, so the die is the gain; the Vigil Robe is the Grey Robe a point
 * lighter, with +3 personality while worn. Each is priced above nothing and inside Hearth Isle's window and under its
 * dearest find, the Grey Mail, so the curve's line stands; sold by no shop and dropped by no monster, on no row of the
 * ladder, sold back at half, and lying in the cell's two chests and nowhere else, the area's one locked chest holding the
 * mace. Lightning is held against what the isle places. And the cell is found and never told: the glass explains nothing,
 * no person, quest or world-map mark names it, and it lies off the road, where the measure is named.
 */
function vigilFinds(ok: (cond: boolean, msg: string) => void): void {
  const [mace, robe] = [item(TABLES.items, 'levin_mace'), item(TABLES.items, 'vigil_robe')];
  const [slag, blade, grey] = [item(TABLES.items, 'slag_mace'), item(TABLES.items, 'grey_blade'), item(TABLES.items, 'grey_robe')];
  ok(mace.slot === 'weapon' && mace.element === 'lightning' && !mace.stat && !mace.plus && mace.dice === slag.dice && mace.sides === slag.sides && mace.bonus === slag.bonus && same(mace.classes, slag.classes) && same(mace.classes, blade.classes) && mace.name.length <= 26,
    `the Levin Mace is the Slag Mace's steel with lightning on it, for the Grey Blade's classes, its name ${mace.name.length} characters of the sheet's 26`);
  ok(hits(mace) - hits(slag) === 3.5 && hits(slag) < hits(blade) && hits(blade) < hits(mace),
    `a rung under the ladder's, so the die is the gain: hits ${hits(mace)} against the Grey Blade of 28 at ${hits(blade)} (the Slag Mace of 25 ${hits(slag)}, the die 3.5)`);
  ok(robe.slot === 'armor' && same(robe.stat, { personality: 3 }) && !robe.element && robe.ac === (grey.ac ?? 0) - 1 && same(robe.classes, grey.classes),
    `the Vigil Robe is a point under the Grey Robe's armour (${robe.ac} of ${grey.ac}), for anyone, raising personality by 3 and nothing else`);
  // Priced, in the window, never sold, off the ladder, sold back at half.
  const stocked = new Set(MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => (f.kind === 'shop' ? f.stock : []))));
  const ladder = new Set(GEAR.flatMap(([, ids]) => ids)), dropped = new Set(Object.values(MONSTERS).flatMap((m) => (m.drops ?? []).map((x) => x.item)));
  const limit = CURVE.hearth.price, dearest = item(TABLES.items, 'grey_mail').price, six = defaultParty(TABLES, makeRng(1));
  for (const d of [mace, robe]) {
    ok(d.price > 0 && d.price < dearest && d.price <= limit && !stocked.has(d.id) && !ladder.has(d.id) && !dropped.has(d.id) && sellPrice(TABLES.items, six, d.price) === d.price / 2,
      `${d.name} costs ${d.price} of Hearth Isle's window of ${limit} and under the Grey Mail's ${dearest}, is sold by no shop, worn by no rung of the ladder and dropped by no monster, and sells back at ${sellPrice(TABLES.items, six, d.price)}`);
  }
  // Where they lie: the cell's two chests, the grey-banded one the area's only locked chest.
  const hearth = AREAS.find((a) => a.id === 'hearth')!;
  const chests = MAP_DEFS.flatMap((d) => (d.features ?? []).filter((f): f is Chest => f.kind === 'chest').map((f) => ({ map: d.id, f })));
  const locked = chests.filter(({ map, f }) => f.locked && hearth.maps.some((m) => m.id === map)).map(({ map, f }) => `${map}:${f.id}`);
  ok(holding('levin_mace') === 'hearthisle_i6:i6_vigil_locked' && holding('vigil_robe') === 'hearthisle_i6:i6_vigil_chest' && locked.join() === 'hearthisle_i6:i6_vigil_locked'
    && chest(RIM, 'i6_vigil_locked').gold === 0 && chest(RIM, 'i6_vigil_chest').gold === 0,
    `the Levin Mace lies in the grey-banded chest and the robe in the plain chest beside it, no gold with either, and the grey-banded chest is the only locked one the isle places (${locked.join() || 'none'})`);
  // The raise and the blow, on the real items: worn, the robe adds 3 to personality and not to the bare stat, and to what the cleric heals; carried it adds nothing; and the classes that cannot wield the mace are refused.
  const crew = defaultParty(TABLES, makeRng(1)), cleric = crew.members.find((m) => m.cls === 'cleric')!, paladin = crew.members.find((m) => m.cls === 'paladin')!;
  const bare = statOf(TABLES.items, cleric, 'personality'), healed = spellHeal(TABLES.items, cleric, 20);
  cleric.pack.push(robe.id);
  const carried = statOf(TABLES.items, cleric, 'personality');
  cleric.pack.pop();
  ok(equip(TABLES.items, cleric, robe.id) && carried === bare && statOf(TABLES.items, cleric, 'personality') === bare + 3 && cleric.stats.personality === bare && spellHeal(TABLES.items, cleric, 20) === healed + 1
    && equip(TABLES.items, paladin, mace.id) && paladin.equipment.weapon === mace.id && !equip(TABLES.items, crew.members.find((m) => m.cls === 'sorcerer')!, mace.id) && !equip(TABLES.items, crew.members.find((m) => m.cls === 'thief')!, mace.id),
    `worn, the robe raises the cleric's personality ${bare} to ${statOf(TABLES.items, cleric, 'personality')} (carried, nothing) and her heal ${healed} to ${spellHeal(TABLES.items, cleric, 20)}, and the paladin wields the mace; the sorcerer and the thief cannot`);
  // Lightning against what the isle places: none of its monsters is immune or resists it; the weak are named.
  const placed = [...new Set(hearth.maps.flatMap((m) => (m.encounters ?? []).flatMap((e) => e.monsters)))].map((id) => MONSTERS[id]).filter((m) => m.level > 10);
  const weak = placed.filter((m) => elementMult(m, 'lightning') > 1), shut = placed.filter((m) => elementMult(m, 'lightning') < 1);
  ok(placed.length >= 10 && weak.length >= 1 && !shut.length, `lightning is never nothing here: of the ${placed.length} monsters the isle places past 10, ${weak.length} are weak to it (${weak.map((m) => m.id).join(', ')}) and ${shut.length} immune or resistant`);
  // Found and never told.
  const glass = eventOf('i6_scorch');
  ok(!/door|secret|cell|hide|chest|lock|key|search|store/i.test(glass.text), 'the vein of glass is a thing seen, and its text explains nothing');
  const quests = AREAS.flatMap((a) => [...(a.quests ?? []), ...(a.chapter ? [a.chapter] : [])]);
  const told = [
    ...quests.flatMap((q) => [q.title, ...q.entries.map((e) => e.text), ...q.goals.map((x) => x.text)]),
    ...MAP_DEFS.flatMap((d) => (d.features ?? []).filter((f) => f.kind === 'npc').map((f) => JSON.stringify(f))),
    ...ATLAS.sites.map((s) => s.name), ...ATLAS.places.flatMap((p) => [p.name ?? '', p.note ?? '']),
  ].filter((t) => /Levin Mace|Vigil Robe|vein of glass|banded in grey|cell cut in the rim/i.test(t));
  ok(!told.length && !JSON.stringify(CHAPTER).includes(RIM.id), `found and never told: no person, quest, chapter or atlas place or site names the cell, the mace or the robe, and the chapter's road never enters the east rim (${told.length} do)`);
  // Off the road: the squares on a shortest walk from the strand (20,30) to the temple's door (18,14), across the isle's two boxes laid side by side.
  const strand: [number, number] = [H6.start.x, H6.start.y], doorway: [number, number] = [H6.exits![0].x, H6.exits![0].y], hint: [number, number] = [32 + glass.x, glass.y];
  const far = apartFrom(WHOLE_ISLE, strand, doorway, hint), on = apartFrom(WHOLE_ISLE, strand, doorway, [strand[0], strand[1] - 6]);
  ok(far.steps > 0 && far.walking > 10 && on.walking === 0 && on.crow === 0,
    `the cell is off the road: where the glass stops is ${far.walking} squares from the nearest square on a shortest walk from the strand to the temple's door (${far.steps} steps) by the way a company walks, and ${far.crow} as the crow flies; a square of the cleft itself is ${on.walking}`);
}

/**
 * The outdoors as built, for a scene to read its squares and zones: a copy of the maps the run
 * builds once (#1018), its doors its own and its other cells frozen. Its zones, groups and ways
 * out are every walk's in the run, so a scene writes nothing on it: a write would reach the scenes
 * after it in one process, which --jobs 1 hides.
 */
const outdoors = (): GameMap => ownMaps()[OUTDOORS];

/**
 * The isle and the road down under it (#753 to #759), a scene to each box's or level's section in road
 * order: the isle (H6) from a new game, as the old body began, and each after it started with the level
 * and the flags the sections before it left on the old body's one walk, as data. The Stair reads
 * her knots seen in the Ways (the frames' goal and end), which no start carries: its scene
 * sees them by hand, as the Ways left them.
 */
function theRoad(): Scene[] {
  return [
    { name: 'h6', play: (ok) => {
      const w = newWalk(ok);
      const out = outdoors();
      const h6 = out.zones.find((z) => z.id === 'hearthisle_h6')!;
      w.level = 28;
      for (const m of w.party.members) m.level = 28;

      // The last crossing, bought at Cinderport's quay from the harbourmaster: it leaves at 20:00 and grounds
      // on the strand at the cleft's foot, 20,30, facing north, the afternoon after (#547; §4.2).
      ok(ISLE.maps?.map((m) => m.map).join() === 'hearthisle_h6,hearthisle_i6' && !!ISLE.crossing?.harder && !!ISLE.crossing?.warning && H6.density === 'core' && H6.band?.join() === '28,29',
        'Hearth Isle holds H6 and I6, H6 core, band 28-29, and has its crossing words');
      const port = mapDef('cinderport').features!.find((f): f is Person => f.kind === 'npc' && (f.passage ?? []).some((p) => p.to === 'hearthisle_h6'))!;
      const [over] = port?.passage?.filter((p) => p.to === 'hearthisle_h6') ?? [];
      const landing = LAST_CROSSING.ends.find((e) => e.at === 'hearthisle')!;
      ok(!!over && !landing.owed && over.x === 20 && over.y === 30 && over.facing === NORTH && over.fare === LAST_CROSSING.fare && H6.start.x === 20 && H6.start.y === 30,
        `Cinderport's harbourmaster sells the last crossing to the strand at 20,30, ${over?.fare} gold, its isle end landed`);
      w.world.travel('cinderport', port.x, port.y);
      hour(w, 12);
      w.party.gold = LAST_CROSSING.fare;
      const day = w.world.day, gone = ride(over, w.world, w.party);
      ok(gone.taken && w.party.gold === 0 && w.world.zone?.id === 'hearthisle_h6' && w.world.state.x === h6.x + 20 && w.world.state.y === h6.y + 30 && w.world.day === day + 1 && w.world.hour === LAST_CROSSING.arrives,
        `the boat grounds on the strand the next afternoon (${gone.lines.join(' ')})`);
      listen(w);
      const boatman = person('The boatman'), [back] = boatman.passage ?? [];
      const steps = LAST_CROSSING.ends.find((e) => e.at === 'cinderport')!.landing!;
      ok(!!back && back.to === 'cinderport' && back.x === steps.x && back.y === steps.y && Math.abs(boatman.x - 20) + Math.abs(boatman.y - 30) === 1
        && meet(boatman, w.party, heard(w.world, boatman)).text.includes('I wait anyway'), 'the boatman in the stern beside the landing sells it back to Cinderport\'s steps, and waits');

      // The strand: the light close at the cleft's foot, the chapter's first step, and the hum by the boat.
      see(w, STRAND);
      see(w, 'hearthisle_h6:h6_shard');
      ok(w.world.used('h6_strand') && w.world.used('h6_shard'), 'on the strand the column seen close, and the hum of the carved lump under Ashcombe');

      // The cleft, carved one square wide through the rim from the strand to the Bowl's hills, its pickets in
      // it and at its head; the picket's chest with the Hand's knife.
      const ch = (x: number, y: number): string => out.at(h6.x + x, h6.y + y).ch;
      ok([24, 25, 26, 27, 28, 29].every((y) => ch(20, y) === ':' && ch(19, y) !== ':' && ch(21, y) !== ':') && ch(20, 23) === '^' && ch(20, 22) === ',',
        'the cleft is a path of dirt one square wide from the strand to the Bowl\'s hills, through the rim\'s rock');
      see(w, 'hearthisle_h6:h6_cleft');
      fight(w, 'hearthisle_h6:h6_picket1');
      fight(w, 'hearthisle_h6:h6_picket2');
      see(w, 'hearthisle_h6:h6_bowl');
      const chest = H6.features!.find((f) => f.kind === 'chest' && f.id === 'h6_picket_chest');
      ok(chest?.kind === 'chest' && chest.items.includes('grey_knife') && chest.gold === 700, 'in the picket\'s chest at the cleft\'s head, 700 gold and a Grey Knife');
      const toll = H6.features!.find((f) => f.kind === 'chest' && f.id === 'h6_toll');
      ok(toll?.kind === 'chest' && toll.gold === 1200 && !toll.items.length && toll.x === 20 && toll.y === 13, 'behind the preacher at the temple\'s door the Hand\'s toll, 1,200 gold');

      // The camp in the lee of the rim: its fires, the isle's rest; its three tents round a yard, each a door
      // into its room; and the pilgrims' shrine.
      const camp = H6.features!.find((f) => f.kind === 'camp')!;
      w.world.travel('hearthisle_h6', camp.x, camp.y);
      ok(restRefused(w.world) === '', 'a company may rest at the pilgrims\' fires, the isle\'s rest');
      const tents = H6.features!.filter((f) => f.kind === 'shop' || f.kind === 'trainer' || f.kind === 'temple');
      ok(tents.length === 3 && tents.every((f) => ch(f.x, f.y) === 'D' && Math.abs(f.x - 16) + Math.abs(f.y - 16) === 1) && tents.some((f) => f.kind === 'trainer' && f.maxLevel === 32),
        'the store, the sergeant\'s tent and the Lantern\'s open round the yard at 16,16, and the sergeant teaches to the cap');
      const personality = w.party.members.map((m) => m.stats.personality);
      kneel(w, 'hearthisle_h6:h6_shrine');
      ok(w.party.members.every((m, i) => m.stats.personality === personality[i] + 1), 'kneeling at the pilgrims\' shrine, the hum settles in the chest: a point of Personality to each of the company');

      // The three pilgrims: each asks, and met begins the quest; one token taken, the other two keep theirs
      // and are gone, and the one who gave it speaks of it after.
      const [aelfric, talwyn, pasco] = ['Sergeant Aelfric', 'Talwyn', 'Pasco'].map(person);
      const asks = [aelfric, talwyn, pasco].map((p) => { w.world.travel('hearthisle_h6', p.x, p.y); return meet(p, w.party, heard(w.world, p)).choice?.ask ?? ''; });
      ok(asks.join('|') === 'Take the Wardens\' badge down?|Take the hold\'s seal down?|Take Tallis\'s tally down?' && !!w.party.flags[PILGRIMS] && !!questLog(TABLES, w.world.state, w.party).find((v) => v.def.id === 'bowl_pilgrims' && !v.done),
        'Aelfric, Talwyn and Pasco each ask their token carried down, and the quest begins');
      const take = (p: Person, w: Walk): string => answer(TABLES.items, p.choice!.answers.find((a) => a.label === 'Take it.')!, w.party);
      ok(take(aelfric, w).includes('pins it to your sleeve') && !!w.party.flags[TOKEN_COUSIN] && w.party.bag.includes('wardens_badge')
        && !w.world.present(talwyn) && !w.world.present(pasco) && w.world.present(aelfric)
        && !!questLog(TABLES, w.world.state, w.party).find((v) => v.def.id === 'bowl_pilgrims' && !v.done && v.goal === 'Carry the token down the stair under the temple.'),
        'the Wardens\' badge taken, Talwyn and Pasco keep theirs and are gone, and the quest goes on down the stair with the badge');
      w.world.travel('hearthisle_h6', aelfric.x, aelfric.y);
      ok(meet(aelfric, w.party, heard(w.world, aelfric)).text.includes('Keep it on your sleeve'), 'Aelfric speaks of the badge after');
      for (const [p, flag, item] of [[talwyn, TOKEN_HOLD, 'treaty_seal'], [pasco, TOKEN_TALLIS, 'tallis_tally']] as const) {
        const r = newWalk(ok);
        r.world.travel('hearthisle_h6', p.x, p.y);
        meet(p, r.party, heard(r.world, p));
        take(p, r);
        ok(!!r.party.flags[flag] && r.party.bag.includes(item) && !r.world.present(aelfric), `${p.name}'s token taken another way: ${item}, and Aelfric gone`);
      }

      // The Hearth on the grass east of the mound, the warm ground between, and the Grove's sliver humming in
      // the pack of a company that carries it (#56's 18), and in no other's.
      const hearth = ATLAS.sites.find((s) => s.name === 'The Hearth')!;
      ok(!hearth.planned && hearth.at[0] === h6.x + 24 && hearth.at[1] === h6.y + 16 && H6.features!.some((f) => f.kind === 'sign' && f.x === 24 && f.y === 16), 'the Hearth\'s site, built, is the column\'s foot at 24,16');
      see(w, 'hearthisle_h6:h6_warm');
      w.world.travel('hearthisle_h6', 23, 16);
      w.world.eventsHere();
      const unheard = !w.world.used('h6_sliver');
      w.party.bag.push('grove_sliver');
      see(w, 'hearthisle_h6:h6_sliver');
      ok(unheard && w.world.used('h6_sliver'), 'at the column\'s foot the Grove\'s sliver hums, for a company that carries it');

      // The temple's door in the mound's south face, the way into Hearthfane (#755), and its preacher's group
      // before it, the box's hardest.
      fight(w, 'hearthisle_h6:h6_sermon');
      see(w, 'hearthisle_h6:h6_front');
      see(w, 'hearthisle_h6:h6_north');
      see(w, 'hearthisle_h6:h6_lookout');

      // The secret: the draught at the north rim's foot, the rock that opens on a search, and the cache.
      see(w, 'hearthisle_h6:h6_draught');
      const [door] = H6.secrets!;
      w.world.travel('hearthisle_h6', door.x, door.y + 1, NORTH);
      let opens = false;
      for (let i = 0; i < 20 && !opens; i++) opens = w.world.search();
      const inside = opens ? [w.world.move('forward'), w.world.move('forward')] : [];
      ok(opens && inside.every((r) => r.kind === 'moved') && w.world.used('h6_cache'), 'searched at the draught, the rock opens, and the hollow behind it is walked into');
      listen(w);
      const lamp = H6.features!.find((f) => f.kind === 'chest' && f.id === 'h6_lamp');
      ok(lamp?.kind === 'chest' && lamp.gold === 1000 && lamp.items.filter((i) => i === 'smelling_salts').length === 3 && lamp.x === door.x && lamp.y === door.y - 2,
        'in the cache, 1,000 gold and three Smelling Salts');

      // The moths by night: over the Bowl, and on the strand and the Bowl's north, gone by day.
      const moths = H6.encounters!.filter((g) => g.monsters.includes('hearth_moth'));
      ok(moths.length === 2 && moths.every((g) => JSON.stringify(g.when) === JSON.stringify({ hours: 'night' })), 'the moths come by night, on the strand and over the Bowl\'s north');
      hour(w, 23);
      see(w, 'hearthisle_h6:h6_moths');
      ok(w.world.used('h6_moths'), 'by night the sky over the Bowl is moving');

      // The Compact as the company left it: its runner for a Partner, or a Warden sergeant.
      const runner = person('A Compact runner'), sergeant = person('A Warden sergeant');
      const none = !w.world.present(runner) && !w.world.present(sergeant);
      w.party.flags[COMPACT_OVER] = 1;
      ok(none && w.world.present(runner) && !w.world.present(sergeant) && runner.x === sergeant.x && runner.y === sergeant.y && runner.lines.join(' ').includes('tally-house'),
        'on the strand a Compact runner for a Partner, with the one spy\'s word, and no one for a company that did neither');
      delete w.party.flags[COMPACT_OVER];
      w.party.flags[COMPACT_WARDENS] = 1;
      ok(w.world.present(sergeant) && !w.world.present(runner), 'or a Warden sergeant, the Compact handed to the Wardens');

      // The box's groups, each won at 28: the moths, the champions on the west shelf and the rats.
      for (const id of ['h6_moths1', 'h6_moths2', 'h6_rim', 'h6_rats']) fight(w, `hearthisle_h6:${id}`);
      ok(H6.encounters!.find((g) => g.id === 'h6_rim')?.roams === true && H6.encounters!.filter((g) => g.id === 'h6_picket1' || g.id === 'h6_sermon').every((g) => g.roams === false),
        'the champions on the west shelf roam; the cleft\'s picket and the preacher\'s group stand');
    } },
    { name: 'i6', play: (ok) => {
      // The east rim (I6, #754), walked on from the Bowl by day: the champions in the Bowl's east pocket where
      // the rim's path begins, and the path carved through the rim's rock into Anchorhold's yard under the
      // cell and on out to the east foot, north under the rim to the Wyke.
      const w = newWalk(ok, { level: 28, flags: { q_bowl_pilgrims: 1, q_compact_wardens: 1, q_token_cousin: 1 } }), out = outdoors();
      delete w.party.flags[COMPACT_WARDENS];
      hour(w, 12);
      const I6 = mapDef('hearthisle_i6'), i6 = out.zones.find((z) => z.id === 'hearthisle_i6')!;
      const rim = (x: number, y: number): string => out.at(i6.x + x, i6.y + y).ch;
      ok(I6.density === 'core' && I6.band?.join() === '28,29' && i6.x === 264 && i6.y === 158 && ISLE.maps![1].at.join() === '264,158', 'I6 is laid at 264,158, core, band 28-29');
      fight(w, 'hearthisle_i6:i6_rim');
      const yard = [2, 3, 4, 5].flatMap((x) => [19, 20].map((y) => rim(x, y)));
      ok([[1, 18], [2, 18], [6, 19], [7, 19]].every(([x, y]) => rim(x, y) === ':') && yard.every((c) => c === ':') && rim(0, 18) === ',' && rim(8, 19) === ',' && rim(4, 18) === 'B',
        'the rim\'s path is carved from the Bowl\'s grass at 0,18 through the rock into Anchorhold\'s yard, 2-5,19-20, and out to the east foot at 8,19; the cell at 4,18 is built into the rim');
      const anchorhold = ATLAS.sites.find((s) => s.name === 'Anchorhold')!;
      ok(!anchorhold.planned && anchorhold.map === 'hearthisle_i6' && anchorhold.at[0] === 4 && anchorhold.at[1] === 18 && I6.features!.some((f) => f.kind === 'npc' && f.x === 4 && f.y === 19 && f.name === 'Hereswith, the anchoress'),
        'Anchorhold\'s site, built, is the cell at 4,18, and the anchoress stands in the yard under its window, at 4,19 (#763)');
      for (const id of ['i6_wall', 'i6_cell', 'i6_path', 'i6_keel', 'i6_wyke']) see(w, `hearthisle_i6:${id}`);
      ok(['i6_wall', 'i6_cell', 'i6_path', 'i6_keel', 'i6_wyke'].every((id) => w.world.used(id)), 'the hours scratched on the cell, its window, the causeway from the path, the keel and the Wyke');

      // The Hand's camp at the stair's head: its guard, gone once Vask is gone from Helmstow (#747) and back
      // where it stood if not, and the two at the stair's head; the camp, its crates and its chest; the Steps.
      const guard = groupOn(I6, 'i6_guard');
      ok(guard.leaves === true && JSON.stringify(guard.until) === JSON.stringify({ flag: THRONE_REMOVED }) && guard.roams === false && guard.monsters.includes('ashen_preacher'), 'the camp\'s guard and its preacher stand, and leave once the Council has removed Vask');
      w.party.flags[THRONE_REMOVED] = 1;
      left(w, 'hearthisle_i6:i6_guard');
      delete w.party.flags[THRONE_REMOVED];
      fight(w, 'hearthisle_i6:i6_guard');
      fight(w, 'hearthisle_i6:i6_guard2');
      for (const id of ['i6_camp', 'i6_crates', 'i6_steps']) see(w, `hearthisle_i6:${id}`);
      const staff = I6.features!.find((f) => f.kind === 'chest' && f.id === 'i6_camp_chest');
      ok(staff?.kind === 'chest' && staff.gold === 700 && staff.items.join() === 'grey_staff' && w.world.used('i6_steps'), 'in the camp\'s chest, 700 gold and a Grey Staff; the causeway comes up out of the sea at the Steps');

      // The grey door at the camp's back, read from the grass below it: no exit, and no lock.
      see(w, 'hearthisle_i6:i6_door');
      see(w, 'hearthisle_i6:i6_knot');
      ok(rim(5, 22) === 'r' && !(I6.exits ?? []).length && w.world.used('i6_door') && w.world.used('i6_knot'), 'the grey door at 5,22 is the rim\'s rock, read and never opened');

      // The secret: the tally-house against the rim and the smell at its foot, the rock behind it that opens
      // on a search, and the Hand's takings in the pocket behind.
      see(w, 'hearthisle_i6:i6_tally');
      see(w, 'hearthisle_i6:i6_smell');
      const [pocket] = I6.secrets!;
      w.world.travel('hearthisle_i6', pocket.x + 1, pocket.y, WEST);
      let found = false;
      for (let i = 0; i < 20 && !found; i++) found = w.world.search();
      const into = found ? [w.world.move('forward'), w.world.move('forward')] : [];
      ok(found && into.every((r) => r.kind === 'moved') && w.world.used('i6_takings'), 'searched behind the tally-house, the rock opens, and the pocket behind it is walked into');
      listen(w);
      const rimHoard = I6.features!.find((f) => f.kind === 'chest' && f.id === 'i6_hoard');
      ok(rimHoard?.kind === 'chest' && rimHoard.gold === 1700 && rimHoard.items.join() === 'grey_mail' && rimHoard.x === pocket.x - 2 && rimHoard.y === pocket.y, 'in the Hand\'s hoard, 1,700 gold and the Grey Mail');

      // A detour off the road (#864): the vigil cell in the rim's east face, found from the vein of glass in the turf.
      theVigil(w);

      // The moths over Anchorhold's yard by night.
      ok(JSON.stringify(I6.encounters!.find((g) => g.id === 'i6_moths')?.when) === JSON.stringify({ hours: 'night' }), 'the moths come over the yard by night');
      hour(w, 23);
      fight(w, 'hearthisle_i6:i6_moths');
    } },
    { name: 'hearthfane', play: (ok) => {
      // Hearthfane (#755): in at the door in the mound, 18,14, onto the nave's foot facing up it, and out
      // again onto the Bowl before the door.
      const w = newWalk(ok, { level: 28, flags: { q_bowl_pilgrims: 1, q_token_cousin: 1 } }), out = outdoors(), h6 = zone(out, 'hearthisle_h6');
      const ch = (x: number, y: number): string => out.at(h6.x + x, h6.y + y).ch;
      const TEMPLE = mapDef('hearthfane');
      const inFane = (name: string): Person => TEMPLE.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
      ok(ch(18, 14) === 'D' && H6.exits?.length === 1 && H6.exits[0].to === 'hearthfane' && TEMPLE.kind === 'dungeon' && TEMPLE.band?.join() === '28,29',
        'Hearthfane\'s door at 18,14 opens on the temple, a dungeon of band 28-29');
      walkThrough(w, 'hearthisle_h6', 18, 15, NORTH, 'hearthfane', 1);
      ok(w.world.state.x === 8 && w.world.state.y === 14 && w.world.state.facing === NORTH, 'in at the door onto the nave\'s foot, 8,14, facing up it');
      walkThrough(w, 'hearthfane', 8, 14, SOUTH, 'hearthisle_h6', 1);
      ok(w.world.state.x === h6.x + 18 && w.world.state.y === h6.y + 15 && w.world.state.facing === SOUTH, 'and out again onto the Bowl before the door, facing away from it');

      // The nave and its moths while the lamps burn, won at 28; the pillar, whose carving a reader reads and
      // the log keeps, and no other company.
      see(w, 'hearthfane:hf_nave');
      fight(w, 'hearthfane:hf_moths');
      w.world.travel('hearthfane', 8, 10);
      const reader = !!readerOf(TABLES.items, w.party), plain = w.world.eventsHere().join(' ');
      w.party.bag.push('copybook');
      const read = w.world.eventsHere().join(' ');
      w.party.bag.splice(w.party.bag.indexOf('copybook'), 1);
      ok((reader || (!plain.includes('FIRST THE SEA'))) && read.includes('THEN THE SHORE. THEN THE HOUSE.') && w.world.used('hf_pillars'),
        `the pillar's carving, its order read with a reader and kept read (${read})`);

      // The sacristan under the vestry's table: met, he wants the lamps out in the pillar's order (56).
      see(w, 'hearthfane:hf_vestry');
      const sacristan = inFane('The sacristan');
      const talk = (p: Person) => { w.world.travel('hearthfane', p.x, p.y); return meet(p, w.party, heard(w.world, p)); };
      const lamps = questLog(TABLES, w.world.state, w.party);
      ok(!lamps.some((v) => v.def.id === 'lamps') && talk(sacristan).text.includes('the pillar says the way') && !!w.party.flags[LAMPS]
        && !!questLog(TABLES, w.world.state, w.party).find((v) => v.def.id === 'lamps' && !v.done), 'the sacristan under the vestry table wants the lamps out in the pillar\'s order, and the quest begins');
      listen(w);
      // The goal points at the pillar and does not tell its order: no goal of any quest names the four lamps in sequence (#795).
      const orderTold = QUESTS.flatMap((x): readonly QuestDef[] => x.chapters ?? [x]).flatMap((d) => d.goals).filter((g) => /\bSea\b.*\bShore\b.*\bHouse\b.*\bHearth\b/i.test(g.text));
      ok(!orderTold.length && questLog(TABLES, w.world.state, w.party).find((v) => v.def.id === 'lamps')?.goal === 'Put out the four lamps in the order the pillar gives.',
        `the sacristan's goal points at the pillar, and no goal names the four lamps in their order${orderTold.length ? ' -> ' + orderTold.map((g) => g.text).join('; ') : ''}`);

      // A lamp out of its turn, the Shore first: the others flare, the swarm comes and the lamp burns on; the
      // swarm won at 28. Then the pillar's order, which still works: each lamp out in its turn, and stays out.
      const [sea, shore, house, hearthLamp] = ['The Sea lamp', 'The Shore lamp', 'The House lamp', 'The Hearth lamp'].map(inFane);
      const swarm = (): boolean => w.world.liveGroups().some((g) => g.def.id === 'hf_swarm');
      const pinch = (p: Person): string => answer(TABLES.items, talk(p).choice!.answers[0], w.party);
      const calm = !swarm();
      ok(calm && pinch(shore).includes('the rest flare') && !!w.party.flags[LAMPS_WRONG] && !w.party.flags.lamp_shore && w.world.present(shore) && swarm(),
        'the Shore lamp put out first is wrong: the others flare, the swarm comes, and the lamp burns on');
      ok(talk(sacristan).text.includes('Read the pillar'), 'and from under the table the sacristan says so');
      fight(w, 'hearthfane:hf_swarm');
      const order = [sea, shore, house, hearthLamp].map((p, i) => { const said = pinch(p); return !!w.party.flags[LAMP_FLAGS[i]] && !w.world.present(p) && said.length > 0; });
      listen(w);
      ok(order.every((x) => x) && !!w.party.flags[LAMPS_OUT], 'then the Sea, the Shore, the House and the Hearth, in the pillar\'s order, each out in its turn and staying out');
      left(w, 'hearthfane:hf_moths');
      left(w, 'hearthfane:hf_swarm');

      // The Sea and Shore lamps stand in the first room, so a company may put out lamps before it has met the
      // sacristan. After one out of its turn his own words still come first and the quest begins, and then he
      // says so; after all four in the pillar's order the key's offer begins it. Each on a walk of its own.
      const apart = (n: Walk) => {
        const say = (p: Person) => { n.world.travel('hearthfane', p.x, p.y); return meet(p, n.party, heard(n.world, p)); };
        const log = () => questLog(TABLES, n.world.state, n.party).find((v) => v.def.id === 'lamps');
        return { n, say, pinch: (p: Person): string => answer(TABLES.items, say(p).choice!.answers[0], n.party), log, asked: () => !!log()?.pages[0].entries.some((e) => e.id === 'asked') };
      };
      const first = apart(newWalk(ok));
      first.pinch(shore);
      const unmet = !first.log(), told = first.say(sacristan);
      ok(unmet && !!first.n.party.flags[LAMPS_WRONG] && told.text.includes('the pillar says the way') && !!first.n.party.flags[LAMPS] && first.asked()
        && first.log()?.goal?.startsWith('Put out the four lamps') === true, 'a lamp put out before he is met: his own words come first, and the quest, its entry and its goal begin');
      ok(first.say(sacristan).text.includes('Read the pillar'), 'and the next time he says so');
      const all = apart(newWalk(ok));
      const turns = [sea, shore, house, hearthLamp].map((p) => all.pinch(p).length > 0);
      const quiet = !all.log(), offer2 = all.say(sacristan);
      ok(turns.every((x) => x) && !!all.n.party.flags[LAMPS_OUT] && quiet && offer2.text.includes('Gone. Every one of them') && !!all.n.party.flags[LAMPS] && all.asked()
        && all.log()?.goal === 'Go back to the sacristan under the vestry table.', 'all four lamps out in the pillar\'s order before he is met: his offer begins the quest, with its entry and its goal');
      answer(TABLES.items, offer2.choice!.answers.find((a) => a.label === 'Take the key.')!, all.n.party);
      ok(all.n.party.bag.includes(FANE_KEY) && all.log()?.done === true, 'and taking the key ends it');

      // The treasury's door: shut with no key and shut to an iron key, which it leaves whole; the sacristan's
      // key, 3,000 experience among the company and the quest done; and the door open to his key.
      const treasury = (): string => { w.world.travel('hearthfane', 10, 10, EAST); return w.world.move('forward').kind; };
      const keyless = treasury();
      w.party.bag.push('key_iron');
      const iron = treasury(), whole = w.party.bag.includes('key_iron');
      w.party.bag.splice(w.party.bag.indexOf('key_iron'), 1);
      ok(keyless === 'blocked' && iron === 'blocked' && whole, 'the treasury\'s door stays shut with no key, and to an iron key, which it leaves whole');
      const xp = w.party.members[0].xp;
      const offer = talk(sacristan);
      const took = answer(TABLES.items, offer.choice!.answers.find((a) => a.label === 'Take the key.')!, w.party);
      ok(offer.text.includes('Gone. Every one of them') && took.includes('warm from his belt') && w.party.bag.includes(FANE_KEY) && !!w.party.flags[LAMPS_KEY]
        && w.party.members[0].xp - xp === 500 && !!questLog(TABLES, w.world.state, w.party).find((v) => v.def.id === 'lamps' && v.done), 'the sacristan gives the treasury\'s key, the company 3,000 experience between them, and the quest is done');
      listen(w);
      ok(talk(sacristan).text.includes('Dark again'), 'after, he trims the wicks and lights none');
      ok(treasury() === 'moved' && w.world.state.x === 11 && w.world.state.y === 10, 'the treasury\'s door opens to the sacristan\'s key');
      see(w, 'hearthfane:hf_treasury');
      const hoard = TEMPLE.features!.find((f) => f.kind === 'chest' && f.id === 'hf_offerings');
      ok(hoard?.kind === 'chest' && hoard.gold === 3000 && hoard.items.join() === 'grey_blade,grey_bow,grey_shortbow,grey_sling' && hoard.x === 13 && hoard.y === 11,
        'in the treasury the pilgrims\' offerings, 3,000 gold, and the Hand\'s steel: a Grey Blade and a Grey Bow, with the bow\'s short bow and sling (#1115)');
      const selling = MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => (f.kind === 'shop' ? f.stock : [])));
      ok(!selling.includes('grey_shortbow') && !selling.includes('grey_sling'), 'no shop of any area sells the short bow or the sling: found beside the bow, as it is, and never sold');
      const tithe = TEMPLE.features!.find((f) => f.kind === 'chest' && f.id === 'hf_tithe');
      ok(tithe?.kind === 'chest' && tithe.gold === 1100 && !tithe.items.length && tithe.x === 11 && tithe.y === 2, 'under the arch the Hand\'s tithe to the light, 1,100 gold');

      // Up the nave past the Hand's best to the court and the altar, each group won at 28; the court's second
      // group gone once the Council has removed Vask from Helmstow, standing or not.
      see(w, 'hearthfane:hf_dead');
      fight(w, 'hearthfane:hf_champions');
      see(w, 'hearthfane:hf_court');
      fight(w, 'hearthfane:hf_sermon');
      fight(w, 'hearthfane:hf_second');
      see(w, 'hearthfane:hf_altar');
      const r = newWalk(ok);
      r.party.flags[THRONE_REMOVED] = 1;
      left(r, 'hearthfane:hf_second');
    } },
    { name: 'crypt', play: (ok) => {
      // The crypt (#756): behind the altar the stair down onto its foot, 8,14, facing up the passage, and its
      // way back up onto the altar's square, 8,2, facing away from the stair.
      const w = newWalk(ok, { level: 28, flags: {
        lamp_hearth: 1, lamp_house: 1, lamp_sea: 1, lamp_shore: 1, q_bowl_pilgrims: 1, q_lamps: 1, q_lamps_key: 1, q_lamps_out: 1, q_lamps_wrong: 1, q_token_cousin: 1,
      } }), TEMPLE = mapDef('hearthfane');
      const CRYPT = mapDef('hearthfane2');
      ok(TEMPLE.rows[STAIR.y][STAIR.x] === '.' && (TEMPLE.exits ?? []).includes(STAIR) && CRYPT.kind === 'dungeon' && CRYPT.band?.join() === '29,29',
        'behind the altar the stair goes down into the crypt, a dungeon of band 29');
      walkThrough(w, 'hearthfane', 8, 2, NORTH, 'hearthfane2', 1);
      ok(w.world.state.x === 8 && w.world.state.y === 14 && w.world.state.facing === NORTH, 'down the stair onto its foot, 8,14, facing up the passage');
      walkThrough(w, 'hearthfane2', 8, 14, SOUTH, 'hearthfane', 1);
      ok(w.world.state.x === 8 && w.world.state.y === 2 && w.world.state.facing === SOUTH, 'and up it again onto the altar\'s square, 8,2, facing away from the stair');

      // At the crypt's floor, 29: the vaulted passage, and the Hand's best in the round chamber; its eleven
      // niches, whose lamps only a company that gave Hereswith the keeper's log lights (#763); the cups.
      w.level = 29;
      for (const m of w.party.members) m.level = 29;
      see(w, 'hearthfane2:hf2_vault');
      fight(w, 'hearthfane2:hf2_champions');
      see(w, 'hearthfane2:hf2_niches');
      const eleven = featureOn(CRYPT, 'hf2_eleven', 'event');
      w.world.travel('hearthfane2', eleven.x, eleven.y);
      w.world.eventsHere();
      ok(!w.world.present(eleven) && !w.party.flags[ELEVEN_KEPT], 'the eleven are not lit without the keeper\'s log given at Anchorhold');
      const c = newWalk(ok);
      c.party.flags[LOG_GIVEN] = 1;
      see(c, 'hearthfane2:hf2_eleven');
      ok(!!c.party.flags[ELEVEN_KEPT], 'with it given, the eleven lit as the log has them keep the hum');
      const find = (id: string) => CRYPT.features!.find((f) => f.kind === 'chest' && f.id === id);
      const cups = find('hf2_cups'), pack = find('hf2_pack');
      ok(cups?.kind === 'chest' && cups.gold === 1800 && !cups.items.length && cups.x === 10 && cups.y === 10,
        'in the chamber the pilgrims\' cups, 1,800 gold');

      // The side vault off the chamber's west: the Hand's dead, the rats come up for them, and a dead
      // champion's pack with the Hand's robe in it.
      see(w, 'hearthfane2:hf2_dead');
      fight(w, 'hearthfane2:hf2_rats');
      ok(pack?.kind === 'chest' && pack.gold === 1100 && pack.items.join() === 'grey_robe' && pack.x === 1 && pack.y === 8,
        'in the side vault the dead champion\'s pack, 1,100 gold and a Grey Robe');

      // Through the chamber's north door the keeper, with the Hand's last man
      // beside it; her knot on the grey door's frame, the chapter's next step (#760); and the grey door,
      // standing open onto the Ways (#757), its sign read on the passage, stepping from the north door onto 8,3
      // where the keeper stood: an exit takes the company on arrival, before the square's texts are said, so a
      // sign on the door's own square would never be read, and nothing stands on either of the crypt's exits.
      see(w, 'hearthfane2:hf2_last');
      fight(w, 'hearthfane2:hf2_keeper');
      see(w, 'hearthfane2:hf2_knot');
      w.world.travel('hearthfane2', 8, 4, NORTH);
      const onto = w.world.move('forward');
      const grey = onto.kind === 'moved' ? onto.messages.join(' ') : '';
      const sign = CRYPT.features!.find((f) => f.kind === 'sign' && f.id === 'hf2_door');
      ok(onto.kind === 'moved' && !onto.arrived && w.world.state.x === 8 && w.world.state.y === 3 && grey.includes('A door of grey with no handle') && sign?.x === 8 && sign.y === 3
        && w.world.used('hf2_knot') && CRYPT.rows[GREY_DOOR.y][GREY_DOOR.x] === 'D' && GREY_DOOR.to === 'underdeep' && (CRYPT.exits ?? []).includes(GREY_DOOR)
        && (CRYPT.exits ?? []).length === 2 && !(CRYPT.features ?? []).some((f) => (CRYPT.exits ?? []).some((e) => e.x === f.x && e.y === f.y)),
        'the grey door\'s sign read on the passage, her knot on its frame, and the door standing open onto the Ways with nothing on its square');
    } },
    { name: 'ways', play: (ok) => {
      // The Ways (#757): through the grey door onto its foot, 16,30, facing up the main way, and back up onto
      // the knot's square, 8,2, facing away from the door: the way to the camp to rest, and down again.
      const w = newWalk(ok, { level: 29, flags: {
        lamp_hearth: 1, lamp_house: 1, lamp_sea: 1, lamp_shore: 1, q_bowl_pilgrims: 1, q_lamps: 1, q_lamps_key: 1, q_lamps_out: 1, q_lamps_wrong: 1, q_token_cousin: 1,
      } });
      const WAYS = mapDef('underdeep');
      ok(WAYS.kind === 'dungeon' && WAYS.band?.join() === '30,30' && WAYS.region === 'hearth', 'below the grey door the Ways, a dungeon of band 30');
      walkThrough(w, 'hearthfane2', 8, 2, NORTH, 'underdeep', 1);
      ok(w.world.state.x === 16 && w.world.state.y === 30 && w.world.state.facing === NORTH, 'down through the grey door onto its foot, 16,30, facing up the main way');
      walkThrough(w, 'underdeep', 16, 30, SOUTH, 'hearthfane2', 1);
      ok(w.world.state.x === 8 && w.world.state.y === 2 && w.world.state.facing === SOUTH, 'and back up through it onto the knot\'s square in the crypt, 8,2, facing away from the door');

      // At the Ways' floor, 30: the hum, the rats at the way in, and her knot on every frame (59), the side
      // ways' groups won as they come; behind the first west frame the keepers' store.
      w.level = 30;
      for (const m of w.party.members) m.level = 30;
      see(w, 'underdeep:ud_in');
      fight(w, 'underdeep:ud_rats1');
      see(w, 'underdeep:ud_knot1');
      ok(!!log(w, 'frames') && !log(w, 'frames')!.done && log(w, 'frames')!.goal === 'Follow her knots through the ways, frame by frame.', 'her knot on the first frame begins Every Frame She Marked');
      fight(w, 'underdeep:ud_knockers1');
      const ways = (id: string) => WAYS.features!.find((f) => f.kind === 'chest' && f.id === id);
      const store = ways('ud_store'), crawl = ways('ud_crawl_chest'), crew = ways('ud_crew_store'), store2 = ways('ud_store2');
      ok(store?.kind === 'chest' && store.gold === 1800 && store.items.join() === 'grey_shield', 'in the keepers\' store behind the first west frame, 1,800 gold and a Grey Shield');
      ok(crew?.kind === 'chest' && crew.gold === 2000 && crew.x === 7 && crew.y === 21 && store2?.kind === 'chest' && store2.gold === 2200 && store2.x === 24 && store2.y === 17,
        'in the crew\'s stores behind the third west frame 2,000 gold, and in a second store behind the third east frame 2,200 (#794)');
      see(w, 'underdeep:ud_knot2');
      fight(w, 'underdeep:ud_knockers2');
      see(w, 'underdeep:ud_voice');
      see(w, 'underdeep:ud_knot3');
      see(w, 'underdeep:ud_rats');
      see(w, 'underdeep:ud_knot4');
      fight(w, 'underdeep:ud_keepers2');
      see(w, 'underdeep:ud_knot5');
      fight(w, 'underdeep:ud_keepers1');
      see(w, 'underdeep:ud_knot6');
      see(w, 'underdeep:ud_knot7');
      fight(w, 'underdeep:ud_rats2');
      see(w, 'underdeep:ud_knot8');
      ok([1, 2, 3, 4, 5, 6, 7, 8].every((n) => w.world.used(`ud_knot${n}`)) && log(w, 'frames')!.pages[0].entries.length === 2 && !log(w, 'frames')!.done,
        'every frame read, the eighth cut deeper over a thin wall, and the quest goes on down to the Stair\'s last frame (#758)');

      // The hatch behind the eighth frame, found from it: searched at the wall in the room behind it, it
      // opens on the crawl way, its chest and its door onto the Stair, which the Stair lists (#758).
      const [hatch] = WAYS.secrets!;
      w.world.travel('underdeep', hatch.x, hatch.y + 1, NORTH);
      let hatchFound = false;
      for (let i = 0; i < 20 && !hatchFound; i++) hatchFound = w.world.search();
      const crawled = hatchFound ? [w.world.move('forward'), w.world.move('forward')] : [];
      ok(hatch.hint === 'ud_knot8' && hatchFound && crawled.every((r) => r.kind === 'moved') && w.world.used('ud_hatch') && log(w, 'frames')!.pages[0].entries.length === 3,
        'searched at the wall behind the eighth frame, the hatch opens on the crawl way, and the log keeps it');
      listen(w);
      ok(crawl?.kind === 'chest' && crawl.gold === 2200 && crawl.items.join() === 'potion_sp_great,potion_sp_great,potion_sp_great' && crawl.x === 24 && crawl.y === 4,
        'in the crawl way 2,200 gold and three Great Spell Draughts');
      ok(WAYS.rows[CRAWL_DOOR.y][CRAWL_DOOR.x] === 'D' && WAYS.rows[STAIR_DOOR.y][STAIR_DOOR.x] === '.' && WAYS.rows[STAIR_DOOR.y + 1][STAIR_DOOR.x] === 'D'
        && [STAIR_DOOR, CRAWL_DOOR].every((d) => d.to === 'underdeep2' && (WAYS.exits ?? []).includes(d)),
        'the crawl way\'s door and the Stair\'s head are listed, their ways down onto the Stair (#758)');
      // Out of the crawl way's door onto the Stair's fourth landing, below its fights, on another walk (59).
      const crawler = newWalk(ok);
      walkThrough(crawler, 'underdeep', CRAWL_DOOR.x, CRAWL_DOOR.y + 1, NORTH, 'underdeep2', 2);
      ok(crawler.world.state.x === 24 && crawler.world.state.y === 18 && crawler.world.state.facing === SOUTH,
        'through the crawl way\'s door onto the Stair\'s fourth landing, 24,18, facing south');

      // The crack (61): the knockers by it won at 30, then the knocker that stopped. Sealed, it pays 4,000
      // among the company, the knockers go to the crack and are gone, and the quest is done; widened, on
      // another walk, it gives the Old Lantern's Staff and the knockers stand.
      fight(w, 'underdeep:ud_knockers3');
      see(w, 'underdeep:ud_crack');
      const inWays = (name: string): Person => WAYS.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
      // Spoken to as the game has it: from the square before the person, facing them, where an event may stand
      // and no sign (the interactable on a company's own square comes before the one ahead).
      const speak = (v: Walk, p: Person, x: number, y: number, facing: Facing) => {
        v.world.travel('underdeep', x, y, facing);
        const f = v.world.featureHere();
        v.ok(f?.kind === 'npc' && f.name === p.name, `${p.name} is the one to talk to from ${x},${y}, facing them`);
        return meet(p, v.party, heard(v.world, p));
      };
      const knocker = inWays('The knocker at the crack'), crewDoor = inWays('The door marked CREW ONLY');
      const from = (p: Person): { x: number; y: number; f: Facing } => p === knocker ? { x: 28, y: 6, f: EAST } : { x: 3, y: 10, f: WEST };
      const pay = (v: Walk, p: Person, label: string): number => {
        const xp = v.party.members[0].xp, at = from(p);
        answer(TABLES.items, speak(v, p, at.x, at.y, at.f).choice!.answers.find((a) => a.label === label)!, v.party);
        return v.party.members[0].xp - xp;
      };
      ok(!!log(w, 'crack') && !log(w, 'crack')!.done, 'at the crack, The Knocker That Stopped begins');
      const sealed = pay(w, knocker, 'Seal it.');
      ok(Math.abs(sealed - 4000 / 6) < 1 && !!w.party.flags[CRACK_SEALED] && !w.world.present(knocker) && log(w, 'crack')!.done, 'sealed with its hammer: 4,000 experience among the company, the knocker finished and the quest done');
      left(w, 'underdeep:ud_knockers3');
      const b = newWalk(ok);
      see(b, 'underdeep:ud_crack');
      const widened = pay(b, knocker, 'Widen it.');
      ok(Math.abs(widened - 4000 / 6) < 1 && !!b.party.flags[CRACK_WIDE] && b.party.bag.includes('old_lanterns_staff') && b.world.liveGroups().some((g) => g.def.id === 'ud_knockers3')
        && !!questLog(TABLES, b.world.state, b.party).find((v) => v.def.id === 'crack' && v.done), 'or widened: the Old Lantern\'s Staff from the swallowed hall, 4,000 experience, and the knockers stay');

      // Up the main way to the row-10 way, its guard won at 30, and the CREW ONLY door from the inside (60):
      // its marks on the way west, read by a reader, then the feet on the square before it, which begin the
      // quest; from there, facing west, the door ahead is the one to talk to, shut to the mines until it is
      // answered, and a step forward after either answer goes through. Opened and left open, it pays 2,000
      // among the company and its way through lands on the Clean Corridor's floor, 13,3, facing west; opened,
      // gone through and shut, on another walk, the same.
      fight(w, 'underdeep:ud_keepers3');
      fight(w, 'underdeep:ud_crew_guard');
      const stepOn = (v: Walk): string => { const r = v.world.move('forward'); return r.kind === 'moved' ? r.messages.join(' ') : r.kind === 'blocked' ? `(${r.reason})` : ''; };
      w.world.travel('underdeep', 5, 10, WEST);
      const lettered = !!readerOf(TABLES.items, w.party), unread = stepOn(w);
      w.party.bag.push('copybook');
      const marks = w.world.eventsHere().join(' ');
      w.party.bag.splice(w.party.bag.indexOf('copybook'), 1);
      ok(w.world.state.x === 4 && w.world.state.y === 10 && (lettered || !unread.includes('CREW ONLY.')) && marks.includes('CREW ONLY. THE MINES BEYOND.') && w.world.used('ud_crew_sign'),
        `the marks over the door, on the way to it, read with a reader and kept read (${marks})`);
      const feet = stepOn(w);
      ok(w.world.state.x === 3 && w.world.state.y === 10 && feet.includes('footprints') && w.world.used('ud_feet') && !!log(w, 'crew_only') && !log(w, 'crew_only')!.done,
        'the feet on the square before the door, and Crew Only, From the Inside begun');
      w.world.move('forward');
      ok(w.world.state.mapId === 'underdeep' && w.world.state.x === 2, 'the door stays shut on the mines until it is answered');
      const opened = pay(w, crewDoor, 'Open it, and leave it open.');
      ok(Math.abs(opened - 2000 / 6) < 1 && !!w.party.flags[CREW_OPEN] && !w.world.present(crewDoor) && log(w, 'crew_only')!.done, 'opened and left open: 2,000 experience among the company, and the quest done');
      const through = w.world.move('forward');
      ok(through.kind === 'moved' && !!through.arrived && w.world.state.mapId === 'deep_mines3' && w.world.state.x === 13 && w.world.state.y === 3 && w.world.state.facing === WEST,
        'a step forward from the feet\'s square goes through onto the Clean Corridor\'s floor before its other side, 13,3, facing west');
      const c2 = newWalk(ok);
      see(c2, 'underdeep:ud_feet');
      const shut = pay(c2, crewDoor, 'Go through and shut it.');
      ok(Math.abs(shut - 2000 / 6) < 1 && !!c2.party.flags[CREW_SHUT] && !c2.party.flags[CREW_OPEN] && !!questLog(TABLES, c2.world.state, c2.party).find((v) => v.def.id === 'crew_only' && v.done),
        'or opened, gone through and shut: the same 2,000, and the quest done');
      walkThrough(c2, 'underdeep', 3, 10, WEST, 'deep_mines3', 1);

      // The main way's last run: the keepers, and at the Stair's head the first crawlers, down off the
      // ceiling, won at 30; the ways' end at the Stair's door, whose way down is the Stair's (#758).
      fight(w, 'underdeep:ud_keepers4');
      fight(w, 'underdeep:ud_crawlers');
      see(w, 'underdeep:ud_end');
    } },
    { name: 'stair', play: (ok) => {
      // The Stair (#758), at its floor, 30: through the ways' last door onto its head, and back up again.
      // Her knots in the Ways are seen by hand, as the Ways left them: the frames' goal and
      // end read them.
      const w = newWalk(ok, { level: 30, flags: {
        lamp_hearth: 1, lamp_house: 1, lamp_sea: 1, lamp_shore: 1, q_bowl_pilgrims: 1, q_crack_sealed: 1, q_crew_open: 1, q_lamps: 1, q_lamps_key: 1,
        q_lamps_out: 1, q_lamps_wrong: 1, q_token_cousin: 1,
      } }), UD2 = mapDef('underdeep2');
      w.world.travel('underdeep', 16, 30);
      for (const n of [1, 2, 3, 4, 5, 6, 7, 8]) w.world.markUsed(`ud_knot${n}`);
      w.world.markUsed('ud_hatch');
      walkThrough(w, 'underdeep', STAIR_DOOR.x, STAIR_DOOR.y + 1, NORTH, 'underdeep2', 2);
      ok(w.world.state.x === 16 && w.world.state.y === 30 && w.world.state.facing === NORTH, 'through the ways\' last door onto the stair\'s head, 16,30, facing down it');
      walkThrough(w, 'underdeep2', 16, 30, SOUTH, 'underdeep', 2);
      ok(w.world.state.x === 16 && w.world.state.y === 2 && w.world.state.facing === SOUTH, 'and back up off its head into the ways before their last door, 16,2, facing away from it: on up to the camp');
      see(w, 'underdeep2:ud2_head');

      // The first landing (57): the company carries the Wardens' badge, so the cousin's people hold it, the
      // rearguard gone (#747), their captain says so, and the quest is done. Their chest is the rearguard's.
      const captain = UD2.features!.find((f) => f.kind === 'npc') as Person;
      see(w, 'underdeep2:ud2_held');
      left(w, 'underdeep2:ud2_rearguard');
      w.world.travel('underdeep2', captain.x, captain.y);
      ok(meet(captain, w.party, heard(w.world, captain)).text.includes('Sergeant Aelfric\'s badge') && log(w, 'bowl_pilgrims')!.done,
        'the cousin\'s people hold the first landing for the badge, their captain says so, and The Pilgrims in the Bowl is done');
      const ud2 = (id: string) => UD2.features!.find((f) => f.kind === 'chest' && f.id === id);
      const [rearguardChest, letter, packs, packs2, takings] = ['ud2_rearguard_chest', 'ud2_letter_chest', 'ud2_packs', 'ud2_packs2', 'ud2_takings'].map(ud2);
      ok(rearguardChest?.kind === 'chest' && rearguardChest.gold === 2000 && rearguardChest.items.join() === 'grey_axe' && packs?.kind === 'chest' && packs.gold === 1800
        && packs.items.join() === 'potion_heal,potion_heal,potion_heal,potion_heal', 'the rearguard\'s chest, 2,000 gold and a Grey Axe; the dead\'s packs, 1,800 gold and four healing potions');
      ok(packs2?.kind === 'chest' && packs2.gold === 1800 && packs2.x === 13 && packs2.y === 22 && takings?.kind === 'chest' && takings.gold === 2600 && takings.x === 20 && takings.y === 2,
        'more of the dead\'s packs on the second landing, 1,800 gold, and the Hand\'s takings at the last door, 2,600 (#794)');
      // On another walk, nobody holds it: the rearguard won at 30, and the quest done on it, carrying unheld.
      const unheld = newWalk(ok);
      unheld.level = 30;
      for (const m of unheld.party.members) m.level = 30;
      unheld.party.flags[PILGRIMS] = 1;
      fight(unheld, 'underdeep2:ud2_rearguard');
      const carried = questLog(TABLES, unheld.world.state, unheld.party).find((v) => v.def.id === 'bowl_pilgrims');
      ok(!!carried?.done && carried.pages[0].entries.some((e) => e.id === 'none') && !unheld.world.present(captain), 'with no token and no verdict the rearguard holds the landing; won at 30, the quest is done: we carried none');
      // And a verdict that carried outranks a token: the hold's elves hold it though the company wears the badge.
      const held = newWalk(ok);
      held.party.flags[THRONE_HOLD] = 1;
      held.party.flags[TOKEN_COUSIN] = 1;
      left(held, 'underdeep2:ud2_rearguard');
      held.world.travel('underdeep2', captain.x, captain.y);
      ok(meet(captain, held.party, heard(held.world, captain)).text.includes('The hold sent us when the Council read the treaty'), 'the Council\'s verdict for the hold outranks the Wardens\' badge on the landing');

      // Down the flights: the rats at the dead, the letter under a champion's hands (58), the crawlers off the
      // ceiling, the keepers, the dead who stood, the chalked creed, the knockers, and her name on the last
      // frame (59).
      fight(w, 'underdeep2:ud2_rats');
      see(w, 'underdeep2:ud2_dead');
      see(w, 'underdeep2:ud2_letter');
      ok(letter?.kind === 'chest' && letter.x === 15 && letter.y === 21 && letter.gold === 0 && letter.items.join() === 'gullwick_letter', 'under the champion\'s hands, the letter for Gullwick');
      w.party.bag.push('gullwick_letter');
      ok(log(w, 'letter')?.goal === 'Take Jowan\'s letter to his mother at Gullwick, the third house from the slip.' && !log(w, 'letter')!.done,
        'the letter taken begins A Letter for Gullwick, its end at his mother\'s door (#765)');
      fight(w, 'underdeep2:ud2_crawlers1');
      see(w, 'underdeep2:ud2_marks');
      fight(w, 'underdeep2:ud2_keepers');
      see(w, 'underdeep2:ud2_more');
      fight(w, 'underdeep2:ud2_crawlers2');
      w.world.travel('underdeep2', 16, 10);
      ok(w.world.eventsHere().join(' ').includes('THE DOOR IS CLOSE. KEEP GOING.'), 'chalked on the shaft\'s wall by a shaking hand: THE DOOR IS CLOSE. KEEP GOING.');
      fight(w, 'underdeep2:ud2_knockers');
      ok(log(w, 'frames')!.goal === 'Follow her knots down to the last frame before the foot of the stair.', 'the knots followed down the stair to the last frame');
      see(w, 'underdeep2:ud2_word');
      ok(log(w, 'frames')!.done && log(w, 'frames')!.pages[0].entries.some((e) => e.id === 'name'), 'on the last frame her name, not her knot: Every Frame She Marked is done');
    } },
    { name: 'foot', play: (ok) => {
      // The foot at 31, where the Catcher is sized on its odds, and the last door (#759): on four of the road's
      // five it stays shut, listening for five voices, and the way back up to the camp is open; the Hand's own
      // door beside it, shut behind her. On the five it opens as the company comes near, into the Heart.
      const w = newWalk(ok, { level: 30, flags: {
        lamp_hearth: 1, lamp_house: 1, lamp_sea: 1, lamp_shore: 1, q_bowl_pilgrims: 1, q_crack_sealed: 1, q_crew_open: 1, q_lamps: 1, q_lamps_key: 1,
        q_lamps_out: 1, q_lamps_wrong: 1, q_token_cousin: 1,
      } }), UD2 = mapDef('underdeep2');
      w.level = 31;
      for (const m of w.party.members) m.level = 31;
      fight(w, 'underdeep2:ud2_catcher');
      see(w, 'underdeep2:ud2_foot');
      see(w, 'underdeep2:ud2_hand');
      for (const f of FIVE.slice(0, 4)) w.party.flags[f] = 1;
      w.world.travel('underdeep2', 16, 2, NORTH);
      const listens = w.world.eventsHere().join(' ');
      const early = w.world.move('forward');
      ok(listens.includes('listens for five voices, and hears fewer') && early.kind === 'blocked' && early.reason === LAST_DOOR.blockedText && w.world.state.mapId === 'underdeep2'
        && w.world.state.y === 2 && UD2.rows[1][16] === 'D' && UD2.rows[1][13] === 'Z' && (UD2.exits ?? []).includes(LAST_DOOR) && LAST_DOOR.needFlag === FIVE,
        'at the last door on four of the road\'s five: it listens for five voices and does not open, the Hand\'s own door shut beside it');
      walkThrough(w, 'underdeep2', 16, 30, SOUTH, 'underdeep', 2);
      ok(w.world.state.x === 16 && w.world.state.y === 2, 'and the way back up off the stair\'s head is open, on up to the camp to rest');
      w.party.flags[FIVE[4]] = 1;
      w.world.travel('underdeep2', 16, 2, NORTH);
      const hushed = !w.world.eventsHere().join(' ').includes('five voices');
      walkThrough(w, 'underdeep2', 16, 2, NORTH, 'core', 1);
      ok(hushed && w.world.state.x === 8 && w.world.state.y === 14 && w.world.state.facing === NORTH,
        'on the road\'s five it listens no longer and opens as the company comes near: into the Heart, 8,14, facing up its passage');
      walkThrough(w, 'core', 8, 14, SOUTH, 'underdeep2', 1);
      ok(w.world.state.x === 16 && w.world.state.y === 2 && w.world.state.facing === SOUTH, 'and back through it onto the stair\'s last landing, 16,2, facing away: it stays open behind the company now');
    } },
    { name: 'heart', play: (ok) => {
      // The Heart (#759), at the cap, 32: the door, the heart and its roof; Vask's parley, one answer, and the
      // fight on the clock, won with the Grey Hands killed first and with the clock left to run; his fall a flag,
      // the panel, Vask on his knees, the voice and the girl with the ring; and her first answer, its pages and
      // the ring in the pack, which begins The Signet (64).
      const w = newWalk(ok, { level: 31, flags: {
        lamp_hearth: 1, lamp_house: 1, lamp_sea: 1, lamp_shore: 1, q_anvil_closed: 1, q_bowl_pilgrims: 1, q_crack_sealed: 1, q_crew_open: 1, q_ember_lit: 1,
        q_grove_done: 1, q_lamps: 1, q_lamps_key: 1, q_lamps_out: 1, q_lamps_wrong: 1, q_peak_stood: 1, q_tide_home: 1, q_token_cousin: 1,
      } });
      const HEART = mapDef('core');
      const inCore = (name: string): Person => HEART.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
      const speakTo = (v: Walk, p: Person) => { v.world.travel('core', p.x, p.y); return meet(p, v.party, heard(v.world, p)); };
      const [vaskAfter, voice, wenna, tallisMan, doorRunner] = ['Lord Vask', 'The voice in the walls', 'The girl out of the hole', 'Tallis\'s man', 'A Compact runner'].map(inCore);
      const vask = groupOn(HEART, 'core_vask');
      w.level = 32;
      for (const m of w.party.members) m.level = 32;
      walkThrough(w, 'underdeep2', 16, 2, NORTH, 'core', 1);
      // The first line is read on the first step in, 8,13: an exit's arrival fires no event on the landing square,
      // 8,14 (§9.2, #759's 16). The step is taken, not seen.
      const doorLine = HEART.features!.find((f) => f.kind === 'event' && f.id === 'core_door');
      const firstStep = w.world.move('forward');
      ok(doorLine?.kind === 'event' && doorLine.x === 8 && doorLine.y === 13 && w.world.state.x === 8 && w.world.state.y === 13 && firstStep.kind === 'moved'
        && firstStep.messages.includes(doorLine.text), 'the first step in from the door, 8,14 to 8,13, reads the Heart\'s first line, which the landing did not');
      listen(w);
      see(w, 'core:core_heart');
      see(w, 'core:core_roof');
      ok(vask.choice === VASK && VASK.answers.length === 1 && VASK.answers[0].label === 'Stop him.' && !!VASK.answers[0].fight && vask.x === 8 && vask.y === 5 && vask.aware === 2
        && vask.leader === 'vask' && vask.clock?.calls === 'core_sentry' && vask.clock.every === 2 && vask.clock.dims === 8 && vask.clock.panel.join() === 'grey_hand',
        'Vask at the panel, 8,5, puts his parley as the company comes beside him at 8,7: one answer, Stop him., and the fight on the clock');
      const odds = (clock: 'panel' | 'called'): number => winRate(32, vask, 10, Infinity, gateOpts(vask), { answer: { ...ANSWER, clock } });
      const handsFirst = odds('panel'), letRun = odds('called');
      ok(handsFirst > 0 && letRun > 0, `won at 32 with the Grey Hands killed first (${Math.round(handsFirst * 100)}% of ten fights) and with the clock left to run (${Math.round(letRun * 100)}%)`);
      ok(!w.world.present(voice) && !w.world.present(wenna) && !w.world.present(vaskAfter), 'nobody speaks at the panel while Vask stands');
      fight(w, 'core:core_vask');
      ok(!!w.party.flags[VASK_FALLEN], 'Vask goes down on his knees: his fall is a flag, and everything after it keys on it');
      see(w, 'core:core_after');
      see(w, 'core:core_panel');
      ok(speakTo(w, vaskAfter).text.includes('I was never once wrong about the facts') && !w.world.present(tallisMan) && !w.world.present(doorRunner) && !w.world.present(wenna),
        'Vask on his knees by the wall says his one thing; nobody stands inside the door for a company with no verdict, tally or Partnership; the girl waits for the voice');
      const spoken = speakTo(w, voice).text;
      ok(spoken.includes('The voyage is over') && spoken.includes('"Captain. Give the order."') && !!w.party.flags[VOICE_WHOLE] && speakTo(w, voice).text === 'The hum, steady, and one voice in it, waiting. "Captain."',
        'the voice in the walls, one voice at last: the voyage is over, and Captain, give the order; and after, only Captain');
      const asked = speakTo(w, wenna);
      ok(asked.text.includes('"I\'m not anyone\'s key."') && !!w.party.flags[RING_GIVEN] && asked.choice?.answers.map((a) => a.label).join() === 'Light it again.,Open the hull.',
        'the girl takes the ring off his finger and puts it in the company\'s hand: two answers without Fane\'s map');
      const relit = asked.choice!.answers[0], said = answer(TABLES.items, relit, w.party);
      ok(!!w.party.flags[END_REIGNITE] && said.includes('like a tide coming in') && endingTaken(TABLES.endings, relit, w.party.flags) === ENDINGS.reignite && ENDINGS.reignite.pages.length === 3 && w.party.bag.includes(SIGNET),
        'Light it again.: its flag set, its three pages shown as it is taken, and the ring in the pack');
      const after = speakTo(w, wenna);
      ok(after.text.includes('"Home," she says. "In the spring. Walk me."') && !after.choice && !w.world.present(vaskAfter),
        'after it she waits to be walked home, the question not put again, and Vask gone from the room');
      w.party.flags[THRONE_REMOVED] = 1;
      left(w, 'core:core_vask_thinned');
      const ring = log(w, 'signet');
      ok(!!ring && !ring.done && ring.goal === 'Where the ring goes: the Council\'s clerk waits at Helmstow\'s gate, and the sea off Gullwick is where the boat went out.',
        'the ring in the pack begins The Signet, its end at Helmstow\'s gate or the sea off Gullwick (#765)');

      // Each other answer once, on a walk of its own from the voice: Open the hull.; and with Fane's map the
      // third, Make it finish., which no company without the map is offered.
      const fallen = (...flags: string[]): Walk => { const v = newWalk(ok); for (const f of [VASK_FALLEN, VOICE_WHOLE, ...flags]) v.party.flags[f] = 1; v.world.travel('core', 8, 9); return v; };
      const hull = fallen(), hulled = speakTo(hull, wenna).choice!.answers.find((a) => a.label === 'Open the hull.')!, hullSaid = answer(TABLES.items, hulled, hull.party);
      ok(!!hull.party.flags[END_ARRIVE] && hullSaid.includes('you hear wind') && endingTaken(TABLES.endings, hulled, hull.party.flags) === ENDINGS.arrive && hull.party.bag.includes(SIGNET)
        && speakTo(hull, wenna).text.includes('I want to see what it looks like from outside.'), 'Open the hull.: its flag, its pages and the ring, and her words after it');
      const charted = fallen('meridian_map'), offered = speakTo(charted, wenna), finish = offered.choice?.answers.find((a) => a.label === 'Make it finish.');
      ok(offered.text.includes('the oilcloth roll in your pack') && !!charted.party.flags[RING_GIVEN] && offered.choice?.answers.length === 3 && !!finish,
        'with Fane\'s map she looks at the oilcloth roll in the pack, and the third answer is put; the ring is given all the same');
      answer(TABLES.items, finish!, charted.party);
      ok(!!charted.party.flags[END_FINISH] && endingTaken(TABLES.endings, finish!, charted.party.flags) === ENDINGS.finish && charted.party.bag.includes(SIGNET) && speakTo(charted, wenna).text.includes('"It\'s moving," she says.'),
        'Make it finish.: its flag, its pages and the ring, and her words after it');

      // With Vask removed from Helmstow by the Council his group is gone by the leave rule and the thinned one
      // stands in its place, its fall the same flag; for Tallis's chair his man inside the door, a Partner's
      // runner beside him, until an ending; and where no claimant's verdict carried, Tallis's tally.
      const thinned = newWalk(ok);
      thinned.level = 32;
      for (const m of thinned.party.members) m.level = 32;
      for (const f of [THRONE_REMOVED, THRONE_TALLIS, COMPACT_OVER]) thinned.party.flags[f] = 1;
      left(thinned, 'core:core_vask');
      fight(thinned, 'core:core_vask_thinned');
      ok(!!thinned.party.flags[VASK_FALLEN] && speakTo(thinned, tallisMan).text.includes('the ring most of all') && thinned.world.present(doorRunner) && speakTo(thinned, doorRunner).text.includes('ask no fee'),
        'the thinned group won at 32 sets his fall as the first does; Tallis\'s man inside the door for Tallis\'s chair, and the Compact\'s runner beside him for a Partner');
      thinned.party.flags[END_ARRIVE] = 1;
      ok(!thinned.world.present(tallisMan) && !thinned.world.present(doorRunner), 'both gone once an ending is taken');
      const tally = fallen(TOKEN_TALLIS), outranked = fallen(TOKEN_TALLIS, THRONE_HOLD);
      ok(tally.world.present(tallisMan) && !outranked.world.present(tallisMan), 'where no claimant\'s verdict carried, Tallis\'s tally carried down puts his man there; the hold\'s verdict outranks it');
    } },
  ];
}

/**
 * The Cleric's third (#763), The Eleven Kept, played twice by a company whose cleric is 27 with the second.
 * The ask first: the seeking quest sends her to the anchoress at Anchorhold; her own words, then her ask,
 * said at each meeting until the log is in, which begins the quest and ends the seeking; the third waits and
 * the crypt's lamps stay dark; the Crowness keeper's log taken from the chest under the light (where the
 * Bard's gathering still reads it), handed in, her word to go down; the chamber's champions won at 29 and the
 * eleven lit; back at the window, her last words and the third taught, for the deed and no gold. The log
 * first: taken at the first meeting and heard `early`, the ask never said, the quest begun on the log alone,
 * and the deed and the teaching the same. Then three companies short of the ask (a cleric of 27 with the
 * first only, one of 26 with the second, none): her own words again, never the ask, and the log she takes
 * all the same begun for none of them until the cleric is 27 with the second.
 */
function elevenKept(ok: (cond: boolean, msg: string) => void): void {
  const I6 = mapDef('hearthisle_i6'), CRYPT = mapDef('hearthfane2'), E3 = mapDef('downs_e3');
  const anchoress = I6.features!.find((f): f is Person => f.kind === 'npc' && f.name === 'Hereswith, the anchoress')!;
  const [hand] = handIns(anchoress), teaching = anchoress.teaches!;
  const lamps = featureOn(CRYPT, 'hf2_eleven', 'event');
  const chest = featureOn(E3, 'e3_log', 'chest');
  ok(anchoress.x === 4 && anchoress.y === 19 && teaching.cls === 'cleric' && teaching.prestige === 3 && teaching.asks === 'eleven_kept' && JSON.stringify(teaching.done) === JSON.stringify({ flag: ELEVEN_KEPT })
    && hand.item === 'keepers_log' && hand.reward === 0 && hand.setFlag === LOG_GIVEN && chest.items.join() === 'keepers_log' && lamps.sets === ELEVEN_KEPT && JSON.stringify(lamps.after) === JSON.stringify({ flag: LOG_GIVEN }),
    'the anchoress at 4,19 takes the keeper\'s log from the chest at Crowness Light for nothing and sets the flag the crypt\'s lamps wait on, and the lamps set the flag her teaching waits on');
  // Her hand-in ends on the send-down early or not, so the entry `given`, which says she sent them down, reads true of both (#795).
  ok([hand.early!, hand.done].every((t) => /fane's crypt/.test(t.at(-1)!) && /eleven/i.test(t.at(-1)!) && /keep the top/.test(t.at(-1)!)),
    'her hand-in ends on the send-down whether the log is brought before her ask or after it: the fane\'s crypt, the eleven lamps and the top she keeps');

  const play = (early: boolean): void => {
    const how = early ? 'the log before the ask' : 'the ask first';
    const w = newWalk(ok);
    const who = w.party.members.findIndex((m) => m.cls === 'cleric'), cleric = w.party.members[who];
    cleric.xp = xpForLevel(27); cleric.level = 27; takePrestige(cleric); takePrestige(cleric);
    w.level = 29;
    const log = (id: string) => questLog(TABLES, w.world.state, w.party).find((v) => v.def.id === id);
    const entered = (id: string): string => (log(id)?.pages.flatMap((p) => p.entries.map((e) => e.id)) ?? []).join();
    const talk = (): string => { w.world.travel('hearthisle_i6', anchoress.x, anchoress.y); const said = meet(anchoress, w.party, heard(w.world, anchoress)).text; listen(w); return said; };
    const bar = (): string => barOf(teaching, cleric, w.party, w.world.state);
    const sent = sought(questLog(TABLES, w.world.state, w.party));
    ok(sent.find((s) => s.at === 'hearthisle_i6')?.who.includes(cleric.name) === true && teaching.seek?.includes(PRESTIGES.cleric.titles[2]) === true && log(seekId(who, 3))?.done === false && !log('eleven_kept'),
      `${how}: at 27 with the second, ${cleric.name} is sent to the anchoress at Anchorhold, the seeking naming the third, and the quest is not in the log`);

    if (!early) {
      const [first, ask, again] = [talk(), talk(), talk()];
      ok(first === anchoress.lines.join('\n\n') && !!w.party.flags['i6_anchoress_met'] && ask.includes('Bring me his log') && again === ask && !!w.party.flags[KEPT_ASKED]
        && log(seekId(who, 3))?.done === true && entered('eleven_kept') === 'asked' && log('eleven_kept')?.goal === 'Bring the Crowness keeper\'s log to Hereswith at Anchorhold.' && !!bar() && !teach(teaching, w.party, w.world.state, who).taught,
        `${how}: her own words, then her ask, said again until the log is in (${ask.split('\n\n')[1]}), which begins the quest and ends the seeking; the third waits`);
      w.world.travel('hearthfane2', lamps.x, lamps.y);
      w.world.eventsHere();
      ok(!w.world.present(lamps) && !w.party.flags[ELEVEN_KEPT], `${how}: the crypt's eleven stay dark to a company that has not given the log`);
    }

    // The log, from the chest under Crowness Light, carried to the window.
    w.world.travel('downs_e3', chest.x, chest.y);
    ok(!w.world.used(chest.id), `${how}: the chest at Crowness Light is there to open`);
    w.world.markUsed(chest.id);
    w.party.gold += chest.gold;
    w.party.bag.push(...chest.items);
    const gold = w.party.gold, said = talk();
    ok(said === (early ? hand.early! : hand.done).join('\n\n') && !w.party.bag.includes('keepers_log') && !!w.party.flags[LOG_GIVEN] && w.party.gold === gold && !!w.party.flags['i6_anchoress_met'] === !early
      && holds({ seen: 'downs_e3:e3_log' }, w.world.state, w.party), `${how}: the log taken at the window for no gold, ${early ? 'heard early: ' + hand.early!.at(-1) : 'her word to go down into the crypt'}, and the chest still seen for the Bard's gathering`);
    ok(entered('eleven_kept') === (early ? 'given' : 'asked,given') && log('eleven_kept')?.goal === 'Down into the crypt under Hearthfane, and light the eleven lamps as the log has them.' && log(seekId(who, 3))?.done === true
      && log('eleven_kept')?.done === false && !!bar() && !teach(teaching, w.party, w.world.state, who).taught && (talk().includes('Go on down; I have the top.')) && !!w.party.flags[KEPT_ASKED] === !early,
      `${how}: the log reads true ${early ? 'on the log alone' : 'in two entries'}, sends the company down, ${early ? 'the ask never said, ' : ''}and the third waits on the lamps`);

    // The crypt: past the chamber's champions, the eleven lit.
    fight(w, 'hearthfane2:hf2_champions');
    w.world.travel('hearthfane2', lamps.x, lamps.y);
    const lit = w.world.eventsHere();
    listen(w);
    ok(lit.join(' ') === lamps.text && !!w.party.flags[ELEVEN_KEPT] && entered('eleven_kept').endsWith('kept') && log('eleven_kept')?.goal === 'Back up to the anchoress\'s window at Anchorhold.' && log('eleven_kept')?.done === false,
      `${how}: the eleven lit as the log has them (${lit.join(' ')}), and the log sends the company back up`);

    // Back at the window: her last words, and the third for the deed and no gold.
    const purse = w.party.gold, last = talk();
    ok(last.includes('The hum changed key an hour ago') && !bar() && teach(teaching, w.party, w.world.state, who).taught && className(cleric) === PRESTIGES.cleric.titles[2] && w.party.gold === purse && log('eleven_kept')?.done === true,
      `${how}: ${last.split('\n\n')[1]} And ${cleric.name} is ${className(cleric)} for the deed and no gold, the quest done`);
  };
  play(false);
  play(true);

  // The ask's gate and the log's: a cleric of 27 with the second, and no less. A company short of it (a
  // cleric of 27 with the first only, or of 26 with the second, or none) hears her own words again and never
  // her ask; and the log, which she takes from any company, is not begun for one with no such cleric, which
  // would be shown a goal no one in it can finish. It is there once the cleric is 27 with the second.
  const clericOf = (w: Walk) => w.party.members.find((m) => m.cls === 'cleric')!;
  const short = (how: string, make: (w: Walk) => void, rise?: (w: Walk) => void): void => {
    const w = newWalk(ok);
    make(w);
    const log = (id: string) => questLog(TABLES, w.world.state, w.party).find((v) => v.def.id === id);
    const talk = (): string => { w.world.travel('hearthisle_i6', anchoress.x, anchoress.y); const said = meet(anchoress, w.party, heard(w.world, anchoress)).text; listen(w); return said; };
    const [first, again] = [talk(), talk()];
    ok(first === anchoress.lines.join('\n\n') && again === first && !w.party.flags[KEPT_ASKED] && !log('eleven_kept'),
      `${how}: she says her own words and says them again, never her ask, and no journal is begun`);
    w.world.travel('downs_e3', chest.x, chest.y);
    w.world.markUsed(chest.id);
    w.party.bag.push(...chest.items);
    const said = talk();
    ok(said === hand.done.join('\n\n') && !!w.party.flags[LOG_GIVEN] && !w.party.bag.includes('keepers_log') && !log('eleven_kept'),
      `${how}: she takes the log all the same, and the journal shows no goal that no one in the company can finish`);
    if (!rise) return;
    rise(w);
    const entries = (log('eleven_kept')?.pages.flatMap((p) => p.entries.map((e) => e.id)) ?? []).join();
    ok(entries === 'given' && log('eleven_kept')?.goal === 'Down into the crypt under Hearthfane, and light the eleven lamps as the log has them.',
      `${how}: and once its cleric is 27 with the second the log is there, reading from the log given`);
  };
  short('a cleric of 27 with the first only', (w) => { const c = clericOf(w); c.xp = xpForLevel(27); c.level = 27; takePrestige(c); }, (w) => takePrestige(clericOf(w)));
  short('a cleric of 26 with the second', (w) => { const c = clericOf(w); c.xp = xpForLevel(26); c.level = 26; takePrestige(c); takePrestige(c); }, (w) => { const c = clericOf(w); c.xp = xpForLevel(27); c.level = 27; });
  short('a company with no cleric', (w) => { w.party.members = w.party.members.filter((m) => m.cls !== 'cleric'); });
}

// ---- the chapter (#760) ----

/**
 * The road behind put done before `upTo`, each chapter's end by its first way, as the quests check satisfies
 * a condition: its flags set, its event spent and its map walked into. It is the other chapters' to play.
 */
function roadDone(w: Walk, upTo: Chapter): void {
  const stateOf = (map: string) => {
    const on = w.world.locate(map, 0, 0).mapId;
    if (on !== map && !w.world.state.zones!.includes(map)) w.world.state.zones!.push(map);
    return w.world.ensureMapState(on);
  };
  for (const c of THE_QUEST.chapters.slice(0, THE_QUEST.chapters.indexOf(upTo))) {
    const end = ([c.done ?? []].flat() as QuestCond[])[0];
    for (const f of [end?.flag ?? []].flat()) w.party.flags[f] = 1;
    if (end?.seen) { const [m, id] = end.seen.split(':'); stateOf(m).used[id] = 1; }
    if (end?.visited) stateOf(end.visited);
  }
}

/**
 * The Heart (#760), begun where The Warning ends and played at 28, 30 and 32 three ways, each to one of its
 * ends: by the boat, every frame read, the rearguard fought, the Catcher at 31 and Vask fought with the Hands
 * first, then Light it again.; with the Council sat for Tallis and Vask removed, the thinned temple and heart,
 * the hatch's way onto the stair below the fights and Tallis's man inside the door, then Open the hull.; and
 * with Fane's map and the Wardens' badge carried and no verdict, the three answers put and Make it finish.
 * taken. Each ends the quest once. Then once early, over at 27 before The Warning is done, the door shut on
 * four of the road's five, the walk back up to the camp to rest, and the journal true to the Catcher.
 */
function theHeart(ok: (cond: boolean, msg: string) => void): void {
  const texts = [...CHAPTER.entries.map((e) => e.text), ...CHAPTER.goals.map((g) => g.text)];
  const long = texts.filter((t) => wrap(t, PAGE.w).length > 2);
  ok(!long.length, `every entry and goal of the chapter fits two lines of the journal's page${long.length ? ' -> ' + long.join(' | ') : ''}`);
  ok(texts.filter((t) => /wenna/i.test(t)).length === 1 && CHAPTER.entries.find((e) => e.id === 'word')!.text.endsWith('WENNA.') && texts.every((t) => !/custodian|"/i.test(t)),
    'nobody is named but her, the once, on the last frame; and the voice is never quoted, nor what it is said');
  const read = new Set<string>();
  const plays = [
    { how: 'by the boat, the rearguard fought, Light it again.', flags: [] as string[], items: [] as string[], end: 'relit',
      steps: STEPS },
    { how: 'with the Council sat for Tallis, Open the hull.', flags: [THRONE_REMOVED, THRONE_TALLIS], items: [], end: 'opened',
      steps: FOR_TALLIS },
    { how: 'with Fane\'s map and the Wardens\' badge, Make it finish.', flags: ['meridian_map', TOKEN_COUSIN], items: ['wardens_badge'], end: 'finished',
      steps: WITH_THE_MAP },
  ];
  for (const p of plays) {
    const w = newWalk(ok);
    roadDone(w, CHAPTER);
    for (const f of [...FIVE, ...p.flags]) w.party.flags[f] = 1;
    w.party.bag.push(...p.items);
    listen(w);
    ok(!!w.party.flags[ROAD_EAST] && quest(w)?.goal === CHAPTER.goals.at(-1)!.text && !written(w, CHAPTER).length,
      `${p.how}: the road behind done and turned east at Akordu, the chapter begins, its goal the last crossing (${quest(w)?.goal})`);
    playChapter(w, CHAPTER, p.steps, p.how);
    goalFromBegun(w, p.how);
    const ids = ending(w, p.how);
    const ends = ['relit', 'opened', 'finished'].filter((e) => ids.includes(`heart.${e}`));
    ok(ends.join() === p.end && ids.includes('heart.ring'), `${p.how}: the journal ends on ${p.end}, and on no other end (${written(w, CHAPTER).join(', ')})`);
    for (const e of written(w, CHAPTER)) read.add(e);
  }
  ok(CHAPTER.entries.every((e) => read.has(e.id)), `every entry of the chapter is written in some run (${CHAPTER.entries.filter((e) => !read.has(e.id)).map((e) => e.id).join(', ') || 'all'})`);
  const shore = JSON.stringify(mapDef('downs_f3').features ?? []);
  ok(Object.values(ENDINGS).every((e) => shore.includes(e.flag)), 'each ending\'s flag reaches Gullwick\'s shore, by the lines the road behind writes there (#765)');

  // Early: over at 27 with The Window done and The Warning not, the Peak Stone never stood beside.
  const how = 'early, over at 27 on four of the five', early = newWalk(ok);
  roadDone(early, THE_QUEST.chapters.find((c) => c.id === 'warning')!);
  early.party.flags.q_ember_lit = 1;
  listen(early);
  early.level = 27;
  for (const m of early.party.members) { m.level = 27; m.xp = xpForLevel(27); }
  CROSSING.play(early);
  ok(!early.party.flags[ROAD_EAST] && FIVE.filter((f) => early.party.flags[f]).length === 4 && quest(early)?.goal === goalOf(CHAPTER, 'Up the cleft') && written(early, CHAPTER).join(', ') === 'isle, shard',
    `${how}: the boat grounds and the chapter begins on the isle, its goal up the cleft (${quest(early)?.goal})`);
  playChapter(early, CHAPTER, EARLY, how);
  see(early, 'underdeep2:ud2_foot');
  early.world.travel('underdeep2', 16, 2, NORTH);
  const shut = early.world.eventsHere().join(' '), tried = early.world.move('forward');
  listen(early);
  ok(shut.includes('hears fewer') && tried.kind === 'blocked' && tried.reason === LAST_DOOR.blockedText && quest(early)?.goal === goalOf(CHAPTER, 'Through the last door'),
    `${how}: the last door listens for five voices and stays shut, and the goal is the door still (${quest(early)?.goal})`);
  walkThrough(early, 'underdeep2', 16, 30, SOUTH, 'underdeep', 2);
  walkThrough(early, 'underdeep', 16, 30, SOUTH, 'hearthfane2', 1);
  walkThrough(early, 'hearthfane2', 8, 14, SOUTH, 'hearthfane', 1);
  walkThrough(early, 'hearthfane', 8, 14, SOUTH, 'hearthisle_h6', 1);
  const camp = H6.features!.find((f) => f.kind === 'camp')!;
  early.world.travel('hearthisle_h6', camp.x, camp.y);
  ok(restRefused(early.world) === '', `${how}: back up by the stair's head, the ways' grey door, the crypt and the temple to the pilgrims' camp, and a rest there`);
  goalFromBegun(early, how);
  ok(written(early, CHAPTER).join(', ') === 'isle, shard, temple, knot, ways, dead, word, catcher, creed' && quest(early)?.goal === goalOf(CHAPTER, 'Through the last door') && !quest(early)?.done
    && !early.news.some((n) => n === `Chapter complete: ${CHAPTER.title}.` || n === `Quest complete: ${THE_QUEST.title}.`),
    `${how}: the journal reads true to the Catcher and the creed, and the end is unreached (${written(early, CHAPTER).join(', ')})`);
}

/**
 * The walkthrough's scenes (#1033), in the order its checks have always printed: each starts its own
 * walks, from what it says, and runs alone as `walkthrough:hearth:<scene>`.
 */
export const scenes: readonly Scene[] = [
  // The vigil cell's two finds held to their rules, and its lock (#864), each on its own.
  { name: 'vigil-finds', play: vigilFinds },
  { name: 'vigil-locked', play: vigilLocked },
  ...theRoad(),
  // The Cleric's third, The Eleven Kept (#763): Anchorhold's anchoress, the keeper's log and the crypt's eleven.
  { name: 'eleven-kept', play: elevenKept },
  // The chapter, The Heart (#760): three ways to its three ends, and once early.
  { name: 'chain', walks: [CHAPTER], play: theHeart },
  // Every goal of the chapter comes up in the chain's plays, as the scenes say (#1018).
  { name: 'goals', play: (ok) => everyGoalWalked(ok, [CHAPTER], scenes) },
];
