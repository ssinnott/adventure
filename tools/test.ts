// Pure-Node tests for the game model: maps, movement, combat determinism, saves, the quest log. No browser.
//   node tools/test.ts            run everything
//   node tools/test.ts maps combat  run selected suites
import { makeRng } from '../src/lib/engine/rng.ts';
import { buildMaps, MAP_DEFS, PLAYED_DEFS } from '../src/content/maps/index.ts';
import { GameMap } from '../src/game/map.ts';
import type { MapDef } from '../src/game/map.ts';
import { World, seen } from '../src/game/world.ts';
import { layOutdoors, OUTDOORS } from '../src/game/outdoors.ts';
import { defaultParty, createCharacter, CLASSES, TRAITS, hasTrait, damage, STALWART_AC, DIE_HARD_AT, INSPIRE_HIT, partyCan, xpForLevel, levelUp, equip, armorClass, weaponOf, canTrain, spellTierAt, MAX_LEVEL, addCondition, hasCondition, takeItem } from '../src/game/party.ts';
import { startCombat, currentTurn, partyAct, monsterAct, aliveMonsters, canAttackFromRow, castOnAlly, buffHit, traitDamage, describeGroups, WARD_AC } from '../src/game/combat.ts';
import type { CombatState } from '../src/game/combat.ts';
import type { Party } from '../src/game/party.ts';
import { serialize, deserialize } from '../src/game/save.ts';
import { ITEMS } from '../src/game/items.ts';
import { MONSTERS } from '../src/game/monsters.ts';
import { SPELLS, spell, spellsFor, spellDice } from '../src/game/spells.ts';
import { ATLAS } from '../src/content/atlas.ts';
import { worldGrid, worldPoint, progression, reachable, isWater, zoneOfMap, TI } from '../src/game/atlas.ts';
import { QUESTS } from '../src/content/quests.ts';
import { questLog, questMarks, questNews, holds } from '../src/game/quests.ts';
import type { QuestCond, QuestView, When } from '../src/game/quests.ts';
import { questPage, PAGE, LIST } from '../src/ui/quests.ts';
import { FONT_CHARS, measureText } from '../src/lib/engine/text.ts';
import { NORTH } from '../src/game/types.ts';
import { testMonster, standardEncounter, line, scaleAt, HP, DAMAGE, ROLES, ROLE_IDS } from './testmonster.ts';
import { measure, days, fight, companyAt, edgeOf, spent, mustRest, bossFloor, longest, slowest, fightsPerRest, ROUND_CAP, REST_AT, WORST, CAP, RULES } from './harness.ts';
import { dateAt, shortDate, longDate, daylightAt, sunTimes, MONTHS, DAYS_PER_YEAR, EPOCH_DAY, MIDSUMMER } from '../src/game/calendar.ts';
import type { Season } from '../src/game/calendar.ts';
import { weatherAt, findWeather, classify, skyNews, fairStart, weatherSight, rangedPenalty, snowDrag, CLIMATES, RANGED_PENALTY, SNOW_DRAG, isRainy, isSnowy } from '../src/game/weather.ts';
import type { Climate, Sky, Weather } from '../src/game/weather.ts';
import { START_MINUTES, LEGACY_WEATHER_SEED } from '../src/game/world.ts';
import type { WorldState, MapState } from '../src/game/world.ts';

let failures = 0;
const ok = (cond: boolean, msg: string): void => { console.log((cond ? '  ok:   ' : '  FAIL: ') + msg); if (!cond) failures++; };

/** Where the party stands on the maps as written: outdoors, its zone map and the cell on it. */
const local = (w: World): { map: string; x: number; y: number } => {
  const z = w.zone;
  return z ? { map: z.id, x: w.state.x - z.x, y: w.state.y - z.y } : { map: w.state.mapId, x: w.state.x, y: w.state.y };
};

const suites: Record<string, () => void> = {
  maps() {
    // The maps as written, each on its own, the Shelf and Thornmark included (see `outdoors` for how they are played).
    const maps = Object.fromEntries(MAP_DEFS.map((d) => [d.id, new GameMap(d)]));
    for (const def of MAP_DEFS) {
      const m = maps[def.id];
      ok(def.rows.every((r) => r.length === m.width), `${def.id}: every row is ${m.width} wide`);
      ok(m.passable(def.start.x, def.start.y) === 'ok', `${def.id}: the start cell is passable`);
      for (const e of m.exits) {
        const to = maps[e.to];
        ok(!!to, `${def.id}: exit at ${e.x},${e.y} points at a real map (${e.to})`);
        ok(m.passable(e.x, e.y) === 'ok', `${def.id}: exit cell ${e.x},${e.y} is passable`);
        if (to) ok(to.passable(e.tx, e.ty) === 'ok', `${def.id} -> ${e.to}: arrival cell ${e.tx},${e.ty} is passable`);
      }
      for (const f of m.features) ok(m.passable(f.x, f.y, { swim: true, climb: true, keys: 1 }) !== 'wall', `${def.id}: feature ${f.kind} at ${f.x},${f.y} is not inside a wall`);
      for (const e of m.encounters) {
        ok(m.passable(e.x, e.y) === 'ok', `${def.id}: encounter ${e.id} at ${e.x},${e.y} is passable`);
        for (const id of e.monsters) ok(id in MONSTERS, `${def.id}: encounter ${e.id} monster '${id}' exists`);
      }
      for (const f of m.features) {
        if (f.kind === 'chest') for (const id of f.items) ok(id in ITEMS, `${def.id}: chest ${f.id} item '${id}' exists`);
        if (f.kind === 'shop') for (const id of f.stock) ok(id in ITEMS, `${def.id}: shop stock '${id}' exists`);
        if (f.kind === 'npc' && f.quest) ok(f.quest.item in ITEMS, `${def.id}: quest item '${f.quest.item}' exists`);
      }
      for (const e of m.exits) for (const flag of [e.needFlag ?? []].flat()) ok(MAP_DEFS.some((d) => d.features?.some((f) => f.kind === 'npc' && f.quest?.setFlag === flag)), `${def.id}: gated exit flag '${flag}' is set by some quest`);
    }
    // Every quest item is dropped or found somewhere; every monster is placed on some map.
    const placed = new Set(MAP_DEFS.flatMap((d) => (d.encounters ?? []).flatMap((e) => e.monsters)));
    for (const id of Object.keys(MONSTERS)) ok(placed.has(id), `monster '${id}' appears on a map`);
    const found = new Set([...MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => f.kind === 'chest' ? f.items : [])), ...Object.values(MONSTERS).flatMap((m) => (m.drops ?? []).map((x) => x.item))]);
    for (const d of MAP_DEFS) for (const f of d.features ?? []) if (f.kind === 'npc' && f.quest) ok(found.has(f.quest.item), `${d.id}: quest item '${f.quest.item}' can be found`);
    // A business is a feature in a town's doorway: you walk into it, so it has a room to show, and
    // no two businesses share one.
    const interiors: string[] = [];
    for (const def of MAP_DEFS) {
      const m = maps[def.id];
      for (const f of m.features) {
        const interior = 'interior' in f ? f.interior : undefined;
        if (m.kind === 'town' && m.at(f.x, f.y).door !== 'none') ok(!!interior, `${def.id}: the business in the doorway at ${f.x},${f.y} has an interior`);
        if (interior) { interiors.push(interior); ok(m.at(f.x, f.y).door !== 'none', `${def.id}: ${interior} is entered through a door`); }
      }
    }
    ok(interiors.length === 12 && new Set(interiors).size === interiors.length, `every business has an interior of its own (${interiors.length}, ${new Set(interiors).size} distinct)`);
    // The trainer ladder: some trainer teaches to the cap, and the cap is what levelUp stops at.
    const trainers = MAP_DEFS.flatMap((d) => (d.features ?? []).filter((f) => f.kind === 'trainer'));
    ok(Math.max(...trainers.map((t) => t.kind === 'trainer' ? t.maxLevel : 0)) === MAX_LEVEL, `a trainer teaches to level ${MAX_LEVEL}`);
    const bands = MAP_DEFS.map((d) => d.band?.[1] ?? 0);
    ok(Math.max(...bands) >= MAX_LEVEL, `some map is tuned for level ${MAX_LEVEL}`);
    { // The level 10 party: total first-pass xp from every non-respawning and respawning group, once, per member.
      let total = 0; for (const d of MAP_DEFS) for (const e of d.encounters ?? []) for (const id of e.monsters) total += MONSTERS[id].xp;
      const each = Math.floor(total / 6);
      ok(each >= xpForLevel(7), `one clear of every map is worth level 7 or more per member (${each} xp each; level 10 needs ${xpForLevel(10)})`);
    }
    { // The Shelf ramp: Ashcombe alone reaches level 2, and both of the dungeons the pass waits on reach
      // level 4 before Thornmark's band 5 (respawns and a second sweep make up the rest).
      const perMember = (ids: string[]): number => Math.floor(MAP_DEFS.filter((d) => ids.includes(d.id))
        .flatMap((d) => (d.encounters ?? []).flatMap((e) => e.monsters)).reduce((t, id) => t + MONSTERS[id].xp, 0) / 6);
      const ashcombe = perMember(['shelf', 'mill']), shelf = perMember(['shelf', 'mill', 'greywater1', 'greywater2']);
      ok(ashcombe >= xpForLevel(2), `one clear of the Shelf and the cellar is worth level 2 per member (${ashcombe} xp each)`);
      ok(shelf >= xpForLevel(4), `one clear of the Shelf, the cellar and Greywater is worth level 4 per member (${shelf} xp each)`);
    }
    // Every cell in every map is reachable from the start, given keys and secrets: no orphaned rooms.
    for (const def of MAP_DEFS) {
      const m = maps[def.id];
      const seen = new Set<number>(); const stack = [[def.start.x, def.start.y]];
      while (stack.length) {
        const [x, y] = stack.pop()!; const k = y * m.width + x;
        if (seen.has(k) || m.passable(x, y, { swim: true, climb: true, keys: 1 }) === 'wall') continue;
        if (m.at(x, y).solid === 'tree' || m.at(x, y).solid === 'rock') continue;
        seen.add(k);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (m.inBounds(x + dx, y + dy)) stack.push([x + dx, y + dy]);
      }
      let open = 0; for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) { const c = m.at(x, y); if (m.passable(x, y, { swim: true, climb: true, keys: 1 }) !== 'wall' && c.solid === 'none') open++; }
      ok(seen.size >= open, `${def.id}: every open cell is reachable from the start (${seen.size} reached of ${open})`);
    }
  },

  movement() {
    const rng = makeRng(7);
    const party = defaultParty(rng);
    const world = new World(buildMaps(), party, rng);
    ok(world.map.id === 'harrow' && world.state.x === 7 && world.state.y === 14, 'a new world starts in Harrow at the gate');
    ok(world.hour === 7 && world.day === 1, `the clock starts on day 1 at 07:00 (${world.hour}:${world.minute})`);
    const r1 = world.move('forward');
    ok(r1.kind === 'moved' && world.state.y === 13, 'stepping forward moves north one cell');
    ok(world.state.minutes === 7 * 60 + 2, 'a town step takes two minutes');
    world.turn('left'); world.turn('left');
    ok(world.state.facing === 2, 'two left turns face south');
    const r2 = world.move('forward'); const r3 = world.move('forward');
    const out = local(world);
    ok(r2.kind === 'moved' && r3.kind === 'moved' && world.map.id === OUTDOORS && out.map === 'shelf' && out.x === 16 && out.y === 4 && world.state.facing === 2,
      `walking through the south gate arrives outdoors on the Shelf, facing south (${world.map.id}: ${out.map} ${out.x},${out.y})`);
    ok(world.explored(world.state.x, world.state.y) && world.explored(world.state.x, world.state.y + 2), 'arrival reveals the cells around and ahead');
    ok(world.here.name === 'The Shelf' && world.state.zones!.includes('shelf'), `outdoors the place is the zone (${world.here.name}), and the party has set foot in it`);
    // Leaving a business: back out of the doorway into the street, facing the door, no time passing.
    world.travel('harrow', 4, 4, 0);
    const at = world.state.minutes;
    ok(world.stepOut() && world.state.x === 4 && world.state.y === 5 && world.state.facing === 0 && world.state.minutes === at, 'leaving the inn steps back into the street, facing its door');
    world.travel('harrow', 12, 13, 1);
    ok(world.stepOut() && world.state.x === 12 && world.state.y === 14 && world.state.facing === 0, 'a party that strafed into the tavern leaves by its only open side, turned to the door');
    world.travel('shelf', 16, 4, 2);
    // Walls block.
    world.travel('mill', 1, 1, 0);
    const r4 = world.move('forward');
    ok(r4.kind === 'blocked', 'a wall blocks the way');
    // Locked door needs a key; the key opens it and is consumed.
    world.travel('mill', 6, 11, 1);
    const locked = world.move('forward');
    ok(locked.kind === 'blocked' && /Locked/.test(locked.reason), 'a locked door blocks without a key');
    party.bag.push('key_iron');
    const unlocked = world.move('forward');
    ok(unlocked.kind === 'moved' && world.map.at(7, 11).door === 'door' && !party.bag.includes('key_iron'), 'an iron key unlocks the door and is used up');
    ok(world.mapState.doors['7,11'] === 'door', 'the unlocked door is recorded for the save');
    // Secret door: the party has an elf and a gnome, so the search always succeeds.
    world.travel('mill', 4, 6, 2);
    ok(world.map.at(4, 7).door === 'secret' && world.search() && world.map.at(4, 7).door === 'door', 'searching finds the secret door');
    // Water and mountains.
    world.travel('shelf', 5, 28, 2);
    ok(world.move('forward').kind === 'blocked' === !partyCan(party).swim, 'water is passable only with a swimmer (Tidefolk in the party)');
    world.travel('shelf', 30, 2, 1);
    const steep = world.move('forward');
    ok(steep.kind === 'blocked' && /steep/.test(steep.reason), 'mountains (the ridge between the Shelf and Thornmark) block without a mountaineer');
    // Where nothing is built yet the world ends, and nothing crosses into it, a mountaineer included.
    world.travel('shelf', 1, 12, 3);
    const edge = world.move('forward');
    ok(edge.kind === 'blocked' && edge.reason === 'The world ends here.' && local(world).x === 1, `west of the Shelf the world ends, and the party cannot step into it (${edge.kind === 'blocked' ? edge.reason : edge.kind})`);
    party.flags.skill_mountaineer = 1;
    world.travel('shelf', 10, 1, 0);
    ok(world.move('forward').kind === 'blocked' && local(world).y === 1, 'not even over the mountains that closed the Shelf in to the north');
    delete party.flags.skill_mountaineer;
    // The pass to Thornmark is a gate on the road through the ridge: closed until Vask's contract is done.
    world.travel('shelf', 30, 9, 1);
    const closed = world.move('forward');
    ok(closed.kind === 'blocked' && /checkpoint/.test(closed.reason) && local(world).x === 30, 'the Thornmark pass is closed before the Ashcombe hand-in');
    party.flags.q_ashcombe_done = 1;
    ok(world.move('forward').kind === 'blocked' && local(world).x === 30, 'the pass stays closed until Greywater is cleared as well');
    party.flags.q_greywater_done = 1;
    // Open, it is walked, not jumped: the road runs on through the ridge into Thornmark, and the log
    // says where the Shelf ends, then Thornmark greets the party as it always has.
    const said: string[] = [];
    for (let i = 0; i < 3; i++) { const step = world.move('forward'); if (step.kind === 'moved') said.push(...step.messages); }
    const there = local(world);
    ok(world.map.id === OUTDOORS && there.map === 'thornmark' && there.x === 1 && there.y === 9, `the pass opens once the flags are set, and three steps on the road reach Thornmark (${there.map} ${there.x},${there.y})`);
    ok(said[0] === 'The pass opens onto old forest. Thornmark.' && said.some((m) => /older than Harrow/.test(m)), `crossing into Thornmark says so (${said.join(' / ')})`);
    ok(world.here.name === 'Thornmark' && world.region === 'thornmark' && world.state.zones!.includes('thornmark'), 'the party has set foot in Thornmark, and its weather is Thornmark\'s');
    world.turn('back');
    const back = [world.move('forward'), world.move('forward')];
    ok(local(world).map === 'shelf' && back[1].kind === 'moved' && back[1].messages.includes('Back through the pass to the Shelf.') && world.region === 'shelf', 'back west through the gate it is the Shelf again');
    // Town Portal returns to the last town stood in.
    ok(world.townPortal() === 'Harrow' && world.map.id === 'harrow', 'Town Portal goes to Harrow before any other town is visited');
    world.travel('thornhold', 7, 14, 0); world.travel('grove2', 8, 8, 0);
    ok(world.townPortal() === 'Thornhold' && world.map.id === 'thornhold' && world.state.x === 7 && world.state.y === 14, 'Town Portal returns to the last town visited');
    // Dungeon stairs go down and come back up.
    world.travel('grove1', 11, 11, 0);
    const down = world.move('forward');
    ok(down.kind === 'moved' && world.map.id === 'grove2' && world.state.x === 1 && world.state.y === 1, 'the Grove Roots stairs go down to the Cut Stone');
    world.travel('greywater1', 14, 13, 2);
    const shrine = world.move('forward');
    ok(shrine.kind === 'moved' && world.map.id === 'greywater2' && world.state.x === 1 && world.state.y === 1, 'the Greywater stairs go down to the Drowned Shrine');
  },

  monsters() {
    const rng = makeRng(3);
    const party = defaultParty(rng);
    const world = new World(buildMaps(), party, rng);
    world.travel('shelf', 16, 4, 2);
    const shelf = world.zone!;
    const rats = world.liveGroups().find((g) => g.def.id === 'road_rats')!;
    ok(rats.state.x === shelf.x + 16 && rats.state.y === shelf.y + 7, 'the road rats start where the Shelf puts them, on the outdoors');
    const r = world.move('forward');
    ok(rats.state.y === shelf.y + 6, `an aware group steps toward the party (${rats.state.x - shelf.x},${rats.state.y - shelf.y} on the Shelf)`);
    ok(r.kind === 'moved' && !!r.encounter && r.encounter.includes('road_rats'), 'a group that reaches the party triggers an encounter');
    world.killGroups(['road_rats']);
    ok(!world.liveGroups().some((g) => g.def.id === 'road_rats'), 'a killed group is gone');
    world.advance(1440);
    ok(world.liveGroups().some((g) => g.def.id === 'road_rats'), 'and returns after its respawn time');
    // Truce after fleeing.
    const back = world.state.y;
    world.flee(['road_rats']);
    ok(world.state.truce === 4 && world.state.y === back - 1, 'fleeing steps the party back and grants a truce');
    ok(world.adjacentGroups().length === 0, 'the fled group does not re-engage during the truce');
    // The Cut Stone: the tear closes when the Warden of the Cut dies, not as the party walks up to it.
    const cut = new World(buildMaps(), defaultParty(makeRng(6)), makeRng(6));
    cut.travel('grove2', 7, 8, 1); cut.killGroups(['g2_hand']);
    const up = cut.move('forward');
    ok(up.kind === 'moved' && !!up.encounter?.includes('g2_warden') && !up.messages.some((m) => /tear closes/.test(m)), 'stepping up to the Warden of the Cut starts the fight, and nothing yet says the tear has closed');
    ok(cut.killGroups(['g2_warden']).some((m) => /tear closes/.test(m)) && cut.killGroups(['g2_hand']).length === 0, 'beating the Warden is what closes the tear, and a group with nothing to say says nothing');
  },

  combat() {
    // A scripted policy: everyone attacks the first living monster, casters cast when they can.
    const run = (seed: number): { log: string[]; rounds: number; party: Party; state: CombatState } => {
      const rng = makeRng(seed);
      const party = defaultParty(rng);
      const state = startCombat(party, [{ id: 'g', monsters: ['rat', 'rat', 'rat', 'wolf'] }], rng);
      let guard = 0;
      while (state.outcome === 'ongoing' && guard++ < 500) {
        const t = currentTurn(state, party, rng);
        if (!t) break;
        if (t.side === 'monster') { monsterAct(state, party, rng); continue; }
        const c = party.members[t.i];
        const target = aliveMonsters(state)[0];
        if (c.cls === 'sorcerer' && c.sp >= 2) partyAct(state, party, rng, { type: 'cast', spellId: 'spark', target });
        else if (canAttackFromRow(c, t.i)) partyAct(state, party, rng, { type: 'attack', target });
        else partyAct(state, party, rng, { type: 'defend' });
      }
      return { log: state.log, rounds: state.round, party, state };
    };
    const a = run(11), b = run(11), c = run(12);
    ok(a.log.join('|') === b.log.join('|'), 'the same seed replays the same fight');
    ok(a.log.join('|') !== c.log.join('|'), 'a different seed is a different fight');
    ok(a.state.outcome === 'victory', `the default party beats three rats and a wolf (${a.rounds} rounds, ${a.state.outcome})`);
    const xp = MONSTERS.rat.xp * 3 + MONSTERS.wolf.xp;
    ok(a.state.loot !== null && a.state.loot.xp === xp, `xp is the sum of the monsters' (${a.state.loot?.xp})`);
    ok(a.party.members.every((m) => m.xp === Math.floor(xp / 6)), 'xp is split evenly among the living');
    ok(a.party.gold >= 200, 'gold is added to the party');
    // The cap.
    const rng = makeRng(1);
    const big = startCombat(defaultParty(rng), [{ id: 'a', monsters: new Array(8).fill('rat') }, { id: 'b', monsters: new Array(8).fill('rat') }], rng);
    ok(big.monsters.length === 12, `a fight never has more than 12 monsters (${big.monsters.length})`);
    // Back row cannot attack in melee; the ranger with a bow can.
    const p = defaultParty(makeRng(2));
    ok(!canAttackFromRow(p.members[3], 3) === !ITEMS[p.members[3].equipment.weapon!].ranged, 'back row melee is refused, back row ranged allowed');
    equip(p.members[3], 'sling');
    ok(canAttackFromRow(p.members[3], 3), 'a sling lets the thief attack from the back row');
    ok(canAttackFromRow(p.members[5], 5), 'the sorcerer starts with a sling, so it has a shot from the back row');
    // Fleeing eventually works and ends the fight.
    let fled = false;
    for (let seed = 1; seed < 20 && !fled; seed++) {
      const r = makeRng(seed); const pp = defaultParty(r);
      const s = startCombat(pp, [{ id: 'g', monsters: ['slime'] }], r);
      for (let i = 0; i < 20 && s.outcome === 'ongoing'; i++) { const t = currentTurn(s, pp, r); if (!t) break; if (t.side === 'party') partyAct(s, pp, r, { type: 'flee' }); else monsterAct(s, pp, r); }
      fled = s.outcome === 'fled';
    }
    ok(fled, 'fleeing from a slime succeeds within a few tries');
    // Tier 4-5 spells: an all-target spell hits every foe; Ward and Haste set their timers; Revive raises the dead.
    {
      const r = makeRng(21); const pp = defaultParty(r);
      const sorc = pp.members[5], cler = pp.members[4];
      sorc.level = 8; sorc.spells.push('lightning', 'meteor'); sorc.sp = 60; cler.spells.push('ward', 'revive', 'wrath'); cler.sp = 60;
      const s = startCombat(pp, [{ id: 'a', monsters: ['ogre', 'ogre'] }, { id: 'b', monsters: ['wraith', 'wraith', 'wraith'] }], r);
      let cast = 0, warded = false;
      for (let i = 0; i < 60 && s.outcome === 'ongoing' && cast < 2; i++) {
        const t = currentTurn(s, pp, r); if (!t) break;
        if (t.side === 'monster') { monsterAct(s, pp, r); continue; }
        const c = pp.members[t.i];
        if (c === sorc) { const before = s.monsters.map((m) => m.hp); partyAct(s, pp, r, { type: 'cast', spellId: 'meteor', target: 0 }); ok(s.monsters.every((m, k) => m.hp < before[k]), 'Meteor Swarm damages every monster'); cast++; }
        else if (c === cler && !warded) { partyAct(s, pp, r, { type: 'cast', spellId: 'ward', target: 0 }); warded = s.shield === 5; cast++; }
        else partyAct(s, pp, r, { type: 'defend' });
      }
      ok(warded, 'Ward sets the party shield for five rounds');
      ok(WARD_AC > 0 && s.log.some((l) => /ward settles/.test(l)), 'the ward is logged');
      const dead = pp.members[0]; addCondition(dead, 'dead'); dead.hp = -10;
      const line = castOnAlly(cler, spell('revive'), dead);
      ok(!hasCondition(dead, 'dead') && dead.hp === 10 && /draws breath/.test(line), `Revive brings a dead member back at 10 hp (${line})`);
      ok(/not dead/.test(castOnAlly(cler, spell('revive'), dead)), 'Revive on the living does nothing');
      ok(spell('haste').buff === 'haste' && spell('town_portal').explore === 'town_portal', 'Haste and Town Portal exist at tier 4 and 5');
    }
    // Weather: bows lose to-hit on both sides; the Ashen casters, ranged but not archers, do not.
    ok(!!MONSTERS.bandit_archer.missile && !!MONSTERS.smuggler_bowman.missile && !!MONSTERS.brigand_archer.missile && !!MONSTERS.ashen_adept.ranged && !MONSTERS.ashen_adept.missile, 'archers shoot; Ashen adepts cast');
    {
      const rate = (penalty: number): number => {
        let hit = 0, miss = 0;
        for (let seed = 1; seed <= 60; seed++) {
          const r = makeRng(seed), pp = defaultParty(r);
          const s = startCombat(pp, [{ id: 'a', monsters: new Array(6).fill('bandit_archer') }], r, { rangedPenalty: penalty });
          for (let i = 0; i < 60 && s.outcome === 'ongoing'; i++) { const t = currentTurn(s, pp, r); if (!t) break; if (t.side === 'monster') monsterAct(s, pp, r); else partyAct(s, pp, r, { type: 'defend' }); }
          hit += s.log.filter((l) => l.startsWith('Bandit Archer hits')).length; miss += s.log.filter((l) => l.startsWith('Bandit Archer misses')).length;
        }
        return hit / (hit + miss);
      };
      const dry = rate(0), wet = rate(RANGED_PENALTY);
      ok(wet < dry - 0.05, `archers hit less often in a downpour (${(wet * 100).toFixed(0)}% against ${(dry * 100).toFixed(0)}%)`);
    }
    const noted = startCombat(defaultParty(makeRng(4)), [{ id: 'a', monsters: ['rat'] }], makeRng(4), { rangedPenalty: RANGED_PENALTY, note: 'The downpour spoils every archer\'s aim.' });
    ok(noted.rangedPenalty === RANGED_PENALTY && noted.log[1] === 'The downpour spoils every archer\'s aim.', 'a fight in the weather carries the penalty and says why');
    ok(startCombat(defaultParty(makeRng(4)), [{ id: 'a', monsters: ['rat'] }], makeRng(4)).rangedPenalty === 0, 'and a fight with no word of the weather has none');
  },

  harness() {
    // The resolver fights defs that no map places, which is what the combat harness hands it.
    const soldier = testMonster('soldier', 3), rng = makeRng(31);
    const s = startCombat(defaultParty(rng), [{ id: 'test', monsters: [soldier, soldier] }], rng);
    ok(s.monsters.length === 2 && s.monsters.every((m) => m.def === soldier && m.hp === soldier.hp) && describeGroups(s) === '2 Test Soldiers', `a fight takes a def as well as an id, and names it (${describeGroups(s)})`);
    // Spells that grow with their caster grow without end in play; a tool may try a ceiling.
    const meteor = spell('meteor'), smite = spell('smite');
    ok(spellDice(meteor, 10) === 10 && spellDice(meteor, 20) === 20 && spellDice(meteor, 20, 10) === 10 && spellDice(smite, 20, 10) === 3, 'Meteor Swarm rolls 2d10 for every two levels, and stops growing only where a tool says');
    ok(startCombat(defaultParty(makeRng(35)), [{ id: 'a', monsters: ['rat'] }], makeRng(35)).spellsGrowTo === undefined && startCombat(defaultParty(makeRng(35)), [{ id: 'a', monsters: ['rat'] }], makeRng(35), { spellsGrowTo: 10 }).spellsGrowTo === 10, 'a fight has no ceiling on spells unless it is given one');
    // New powers, as a what-if: a member the resolver is told strikes twice does, and play gives none.
    const twice = defaultParty(makeRng(38)), duel = startCombat(twice, [{ id: 'a', monsters: [testMonster('soldier', 1, 60, 1)] }], makeRng(38), { edge: () => ({ blows: 2, damage: 0, ac: 0 }) });
    let turn: string[] = [];
    for (let k = 0; k < 20 && !turn.length; k++) {
      const t = currentTurn(duel, twice, makeRng(38 + k));
      if (!t) break;
      if (t.side === 'monster') { monsterAct(duel, twice, makeRng(38 + k)); continue; }
      const before = duel.log.length;
      partyAct(duel, twice, makeRng(38 + k), { type: 'attack', target: 0 });
      turn = duel.log.slice(before);
    }
    ok(turn.length === 2 && startCombat(defaultParty(makeRng(39)), [{ id: 'a', monsters: ['rat'] }], makeRng(39)).edge === undefined, `a member told to strike twice strikes twice (${turn.join(' ')}), and a fight gives no such power unless told`);
    RULES.levelTraits = true;
    const blows = [10, 11, 28, 29].map((l) => edgeOf(companyAt(l, 37).members[0], 1).blows), traits = companyAt(24, 37).members.map((m) => edgeOf(m, 1));
    const later = edgeOf(companyAt(24, 37).members[3], 2).damage;
    RULES.levelTraits = undefined; RULES.levelBonus = true;
    const perks = companyAt(24, 37).members.map((m) => edgeOf(m, 1));
    RULES.levelBonus = undefined;
    ok(blows.join() === '1,2,2,3' && traits[5].blows === 1 && traits[3].damage === 14 && later === 0 && perks.every((e) => e.damage === 7 && e.ac === 7) && edgeOf(companyAt(24, 37).members[0], 1).blows === 1, `with --level-traits the knight strikes once more a turn with each promotion (${blows.join(', ')} blows at 10, 11, 28 and 29) and at 24 a sneak attack adds 14 in the first round only; with --level-bonus every member gains 7 at 24; without, none`);
    // The curve's gear, as a what-if: past level 10 weapons and armour keep growing; play has none of it.
    const knight = (p: ReturnType<typeof companyAt>): [number, number] => [weaponOf(p.members[0]).bonus ?? 0, armorClass(p.members[0])];
    const flat = [knight(companyAt(10, 37)), knight(companyAt(20, 37))];
    RULES.gearGrows = true;
    const grown = [knight(companyAt(10, 37)), knight(companyAt(20, 37))];
    RULES.gearGrows = undefined;
    ok(grown[0].join() === flat[0].join() && grown[1][0] > flat[1][0] && grown[1][1] === flat[1][1] + 5, `gear grows past 10 only where a what-if asks: at 20 the knight's war hammer gains ${grown[1][0] - flat[1][0]} and the knight's armour 5`);
    // Fights may run longer as both sides grow, and never to the cap; a fight that would is broken off.
    const allowed = Array.from({ length: CAP }, (_, k) => [longest(k + 1), slowest(k + 1)]);
    ok(longest(1) === 4 && slowest(1) === 6 && allowed.every(([a, b], k) => a <= b && b < ROUND_CAP && (k === 0 || a >= allowed[k - 1][0])), `a fight's rounds run from ${longest(1)} (${slowest(1)} at most) at level 1 to ${longest(CAP).toFixed(1)} (${slowest(CAP).toFixed(1)}) at ${CAP}`);
    const wall = fight(companyAt(1, 36), [testMonster('soldier', 1, 2000, 0.01)], 36);
    ok(ROUND_CAP === 15 && wall.broken && !wall.won && wall.rounds === ROUND_CAP, `a fight nobody can finish is broken off after ${ROUND_CAP} rounds (${wall.rounds})`);
    // Six or seven fights between rests to level 10, a fight more every four levels after, and never fifteen.
    const perRest = Array.from({ length: CAP }, (_, k) => fightsPerRest(k + 1));
    ok(perRest[0] === 6.5 && perRest[9] === 6.5 && perRest[CAP - 1] === 12 && perRest.every((f, k) => f < 15 && (k === 0 || f >= perRest[k - 1])), `fights between rests run from ${perRest[0]} at level 1 and ${perRest[9]} at 10 to ${perRest[CAP - 1]} at ${CAP}`);
    // Training past today's cap is for tools only.
    const c = defaultParty(makeRng(32)).members[0];
    c.xp = xpForLevel(20); levelUp(c, makeRng(32));
    ok(c.level === MAX_LEVEL, `levelUp stops at MAX_LEVEL in play (${c.level})`);
    levelUp(c, makeRng(32), 20);
    ok(c.level === 20, `and trains on when a tool asks it to (${c.level})`);
    // What a fight costs: all of a fallen member's hit points, and every spell point cast.
    const p = defaultParty(makeRng(33)), fallen = p.members[5];
    const pool = p.members.reduce((a, m) => a + m.maxHp + m.maxSp, 0);
    fallen.hp = -1; addCondition(fallen, 'unconscious'); p.members[4].sp -= 3;
    const cost = spent(p).cost;
    ok(Math.abs(cost - (fallen.maxHp + 3) / pool) < 1e-9, `a fallen member costs all of their hit points, a spell its points (${(cost * 100).toFixed(1)}% of the company)`);
    // A company rests once anyone is under a quarter of their hit points, or it is under a quarter of its spell points.
    const whole = defaultParty(makeRng(34)), hurt = structuredClone(whole), dry = structuredClone(whole);
    hurt.members[0].hp = Math.ceil(hurt.members[0].maxHp * REST_AT) - 1;
    for (const m of dry.members) m.sp = Math.floor(m.maxSp * (REST_AT - 0.05));
    ok(mustRest(whole) === null && mustRest(hurt) === 'hp' && mustRest(dry) === 'sp', `a whole company fights on, and rests for one member's wounds or for its spell points (${mustRest(whole)}, ${mustRest(hurt)}, ${mustRest(dry)})`);
    // From 1 to the road's cap, a test monster's hit points never fall with level, and it hits under
    // its role's share of the line only where its hit points came down with it (docs/MONSTERS.md §4.4).
    for (const r of ROLE_IDS) {
      const levels = Array.from({ length: CAP }, (_, k) => k + 1), m = levels.map((l) => testMonster(r, l));
      const falls = levels.filter((l) => l > 1 && m[l - 1].hp < m[l - 2].hp);
      const under = levels.filter((l) => scaleAt(DAMAGE, r, l) < 1 - 1e-9 && scaleAt(HP, r, l) > scaleAt(DAMAGE, r, l) + 1e-9);
      const off = levels.filter((l) => Math.abs((m[l - 1].dice * (m[l - 1].sides + 1)) / 2 + m[l - 1].bonus - Math.max(1, line(l).dmg * ROLES[r].dmg * scaleAt(DAMAGE, r, l))) > 0.5);
      ok(!falls.length && !under.length && !off.length, `the test ${r} gains hit points with every level, hits under the line only where it comes down whole, and its dice roll what it should${falls.length || under.length || off.length ? ` (falls at ${falls.join(', ')}; under at ${under.join(', ')}; dice off at ${off.join(', ')})` : ''}`);
    }
    // The calibration holds on seeds it was not made on: six or seven fights between rests at a company's
    // own level, few of its days ending in a death or a lost fight, and the boss a coin flip from two
    // under. Two brutes at 4 are the worst of it: six rounds a fight is as safe as they get (docs/MONSTERS.md §4.4).
    for (const [r, l, worst] of [['fodder', 2, 2 * WORST], ['brute', 4, 3.5 * WORST], ['soldier', 6, 2 * WORST], ['caster', 10, 2 * WORST]] as const) {
      const d = days(l, [standardEncounter(r, l)], 60, 5001), bad = d.why.dead + d.why.lost + d.why.long;
      ok(Math.abs(d.fights - fightsPerRest(l)) <= 1 && bad <= worst, `a company of level ${l} fights ${d.fights.toFixed(1)} encounters of ${ROLES[r].group} ${ROLES[r].plural} between rests (${fightsPerRest(l)} asked), and ${(bad * 100).toFixed(0)}% of its days end badly (${(worst * 100).toFixed(0)}% at most)`);
    }
    // Past 10 the target grows: a company of 24 fights about ten between rests.
    const late = days(24, [standardEncounter('soldier', 24)], 40, 5001);
    ok(Math.abs(late.fights - fightsPerRest(24)) <= 1.5, `a company of level 24 fights ${late.fights.toFixed(1)} encounters of 4 Test Soldiers between rests (${fightsPerRest(24)} asked)`);
    const boss = measure(bossFloor(8), standardEncounter('boss', 8), 80, 5001);
    ok(boss.won >= 0.3 && boss.won <= 0.7, `a company two levels under the test boss wins ${(boss.won * 100).toFixed(0)}% of the time (half asked)`);
  },

  party() {
    const rng = makeRng(5);
    const p = defaultParty(rng);
    ok(p.members.length === 6, 'six members');
    ok(p.members.every((m) => m.hp === m.maxHp && m.hp > 0), 'everyone starts at full health');
    ok(p.members[0].equipment.weapon === 'longsword' && p.members[0].equipment.armor === 'scale', 'the knight starts in scale with a long sword');
    ok(p.members[5].spells.includes('spark') && p.members[5].spells.includes('light'), 'the sorcerer knows the tier-1 spells');
    ok(p.members[5].equipment.weapon === 'sling' && p.members[5].pack.includes('dagger'), 'the sorcerer starts with a sling in hand and the dagger packed');
    ok(!p.members[5].spells.includes('sleep'), 'but not tier 2');
    ok(xpForLevel(2) > 0 && xpForLevel(3) > xpForLevel(2), 'xp thresholds rise');
    const s = p.members[5];
    s.xp = xpForLevel(2);
    const before = s.maxHp;
    ok(levelUp(s, rng) === 1 && s.level === 2 && s.maxHp > before && s.spells.includes('sleep'), 'levelling to 2 raises hp and teaches tier 2');
    ok(!equip(p.members[5], 'chain'), 'a sorcerer cannot wear chain');
    ok(armorClass(p.members[0]) > armorClass(p.members[5]), 'the knight has the better AC');
    ok(Object.values(SPELLS).every((sp) => sp.sp > 0), 'every spell costs something');
    // The road to level 10: tiers land at 1, 2, 4, 6, 8; levelling stops at the cap; nothing is left to train.
    ok([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(spellTierAt).join() === '1,2,2,3,3,4,4,5,5,5', `spell tiers by level are ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(spellTierAt).join()}`);
    for (const list of ['cleric', 'sorcerer', 'druid'] as const) for (let t = 1; t <= 5; t++) ok(spellsFor(list, t).some((sp) => sp.level === t), `the ${list} list has a tier ${t} spell`);
    const c = p.members[4];
    c.xp = 1_000_000;
    const gained = levelUp(c, rng);
    ok(c.level === MAX_LEVEL && gained === MAX_LEVEL - 1, `a cleric with endless xp levels to exactly ${MAX_LEVEL} (${c.level})`);
    ok(!canTrain(c), 'and cannot train further');
    ok(spellsFor('cleric', 5).every((sp) => c.spells.includes(sp.id)), 'at the cap every cleric spell is known, including tier 5');
    ok(c.maxHp >= 9 * 1 + 8 && c.maxSp > 20, `hp and sp grew with the levels (hp ${c.maxHp}, sp ${c.maxSp})`);
    const k = p.members[0]; k.xp = xpForLevel(8);
    ok(levelUp(k, rng) === 7 && k.level === 8 && k.spells.length === 0, 'a knight levels to 8 on level-8 xp and learns no spells');
    // Every class can wear its own starting kit, and every caster's list has spells to give.
    for (const cd of Object.values(CLASSES)) {
      const m = createCharacter('Test', 'human', cd.id, {}, makeRng(9));
      ok(cd.kit.every((id) => !ITEMS[id].classes || ITEMS[id].classes!.includes(cd.id)) && !!m.equipment.weapon && !!m.equipment.armor, `a ${cd.name} may use its whole starting kit`);
      ok(!cd.spells || m.spells.length > 0, `a ${cd.name} starts with ${cd.spells ? 'spells' : 'no spells'}`);
    }
    const r = p.members[2]; r.xp = xpForLevel(4); levelUp(r, rng);
    ok(r.spells.includes('thorn') && r.spells.includes('barkskin') && !r.spells.includes('spark'), 'the ranger learns the druid list');
    ok(xpForLevel(MAX_LEVEL) === 13050, `level ${MAX_LEVEL} costs ${xpForLevel(MAX_LEVEL)} xp`);
  },

  traits() {
    const mk = (cls: Parameters<typeof createCharacter>[2]) => createCharacter('T', 'human', cls, {}, makeRng(3));
    for (const cd of Object.values(CLASSES)) ok(cd.traits.length >= 1 && cd.traits.length <= 2 && cd.traits.every((t) => t in TRAITS), `a ${cd.name} has one or two traits (${cd.traits.join(', ')})`);
    // Stalwart: the knight's AC carries the bonus.
    const k = mk('knight'); const ac = armorClass(k);
    ok(ac === 10 + 5 + 1 + STALWART_AC, `a knight in scale and buckler is AC ${ac}`);
    // Unarmoured Defence grows with level and goes away under real armour.
    const monk = mk('monk'); const a1 = armorClass(monk); monk.level = 10;
    ok(armorClass(monk) === a1 + 5, `a level-10 monk in a robe gains AC (${a1} -> ${armorClass(monk)})`);
    const leatherMonk = mk('monk'); leatherMonk.equipment.armor = 'leather';
    ok(armorClass(leatherMonk) === 10 + 3, 'a monk in leather loses unarmoured defence');
    // Immunities come through addCondition.
    const cases: [Parameters<typeof createCharacter>[2], 'diseased' | 'cursed' | 'asleep' | 'paralysed' | 'poisoned'][] = [['paladin', 'diseased'], ['cleric', 'cursed'], ['sorcerer', 'asleep'], ['monk', 'paralysed'], ['druid', 'poisoned']];
    for (const [cls, cond] of cases) { const c = mk(cls); addCondition(c, cond); ok(!hasCondition(c, cond), `a ${cls} is immune to ${cond}`); }
    const kn = mk('knight'); addCondition(kn, 'poisoned'); ok(hasCondition(kn, 'poisoned'), 'a knight is not');
    // Die Hard: a barbarian at -15 is unconscious, not dead; a knight is dead.
    const b = mk('barbarian'); damage(b, b.hp + 15);
    ok(!hasCondition(b, 'dead') && hasCondition(b, 'unconscious'), 'a barbarian at -15 hp still lives');
    const b2 = mk('barbarian'); damage(b2, b2.hp + 25); ok(hasCondition(b2, 'dead') && b2.hp === DIE_HARD_AT, `but a blow past ${DIE_HARD_AT} kills`);
    const k2 = mk('knight'); damage(k2, k2.hp + 15); ok(hasCondition(k2, 'dead'), 'a knight at -15 hp is dead');
    // Healing Hands: the cleric heals more than a paladin with the same Personality.
    const cl = mk('cleric'), pa = mk('paladin'), hurtA = mk('knight'), hurtB = mk('knight');
    hurtA.maxHp = hurtB.maxHp = 100; hurtA.hp = hurtB.hp = 1;
    castOnAlly(cl, spell('heal'), hurtA); castOnAlly(pa, spell('heal'), hurtB);
    ok(hurtA.hp > hurtB.hp, `a cleric's Mend heals more (${hurtA.hp - 1} vs ${hurtB.hp - 1})`);
    // Damage traits, and the bard's song.
    const party = defaultParty(makeRng(4));
    const s = startCombat(party, [{ id: 'a', monsters: ['rat'] }], makeRng(4));
    const rat = s.monsters[0];
    const bow = ITEMS.shortbow, sword = ITEMS.longsword;
    ok(traitDamage(s, mk('ranger'), bow, rat) > 0 && traitDamage(s, mk('ranger'), sword, rat) === 0, 'Marksman adds only to ranged attacks');
    ok(traitDamage(s, mk('thief'), sword, rat) > 0, 'Sneak Attack adds in the first round');
    s.round = 2; ok(traitDamage(s, mk('thief'), sword, rat) === 0, 'and not after');
    const bb = mk('barbarian'); ok(traitDamage(s, bb, sword, rat) === 0, 'a healthy barbarian does not rage');
    bb.hp = 1; ok(traitDamage(s, bb, sword, rat) > 0, 'a wounded one does');
    const noBard = buffHit(s, party);
    party.members[3] = mk('bard');
    ok(buffHit(s, party) === noBard + INSPIRE_HIT, 'a standing bard inspires the party');
    addCondition(party.members[3], 'unconscious'); ok(buffHit(s, party) === noBard, 'a fallen one does not');
    ok(hasTrait(mk('thief'), 'keen_eyes') && hasTrait(mk('ranger'), 'keen_eyes'), 'thieves and rangers have Keen Eyes');
  },

  calendar() {
    const d1 = dateAt(START_MINUTES);
    ok(shortDate(d1) === '1 Mistfall 1016' && d1.season === 'autumn' && d1.gameDay === 1, `game day 1 is the 1st of Mistfall, 1016, in the autumn (${shortDate(d1)}, ${d1.season})`);
    ok(MONTHS.length === 8 && DAYS_PER_YEAR === 120, 'the year is eight months of fifteen days');
    ok(shortDate(dateAt(14 * 1440)) === '15 Mistfall 1016' && shortDate(dateAt(15 * 1440)) === '1 Frost 1016' && dateAt(15 * 1440).season === 'winter', 'Mistfall has fifteen days, then Frost begins the winter');
    const newYear = (DAYS_PER_YEAR - EPOCH_DAY) * 1440;
    ok(shortDate(dateAt(newYear - 1)) === '15 Longnight 1016' && shortDate(dateAt(newYear)) === '1 Thaw 1017' && dateAt(newYear).season === 'spring', `the year turns after Longnight (${shortDate(dateAt(newYear))})`);
    ok(dateAt(newYear).gameDay === DAYS_PER_YEAR - EPOCH_DAY + 1, 'and the game-day count carries on through it');
    ok(longDate(dateAt(0)) === 'the 1st of Mistfall, 1016' && longDate(dateAt(1440)) === 'the 2nd of Mistfall, 1016' && longDate(dateAt(10 * 1440)) === 'the 11th of Mistfall, 1016', 'long dates take their ordinals (1st, 2nd, 11th)');
    // The days lengthen and shorten. `at` is the minute of a day of the year and an hour.
    const at = (doy: number, hour: number): number => ((doy - EPOCH_DAY + DAYS_PER_YEAR) % DAYS_PER_YEAR) * 1440 + hour * 60;
    const winter = MIDSUMMER + DAYS_PER_YEAR / 2;
    ok([0, 30, 60, 90].every((doy) => daylightAt(at(doy, 12)) === 1), 'noon is full daylight in every season');
    ok(daylightAt(at(MIDSUMMER, 18.5)) === 1 && daylightAt(at(winter, 18.5)) === 0, 'at half past six in the evening it is day at midsummer and night at midwinter');
    ok(daylightAt(at(winter, 7)) < 0.25 && daylightAt(at(MIDSUMMER, 5)) >= 0.5, 'a midwinter morning is still dark at seven; a midsummer one light at five');
    const { dawn, dusk } = sunTimes(EPOCH_DAY);
    const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-9;
    // The day length moves through the day, not in a step at midnight, so the old clock holds to within minutes.
    ok(near(dawn, 6.5) && near(dusk, 18.5) && daylightAt(at(EPOCH_DAY, 4.9)) === 0 && daylightAt(at(EPOCH_DAY, 8)) > 0.97 && daylightAt(at(EPOCH_DAY, 20)) < 0.03, '1 Mistfall is an equinox, with the old fixed clock: dark before 05:00, full light by 08:00, dark again by 20:00');
  },

  weather() {
    const shelf = CLIMATES.shelf, thorn = CLIMATES.thornmark;
    ok(JSON.stringify(weatherAt(7, 5000, shelf)) === JSON.stringify(weatherAt(7, 5000, shelf)), 'the weather is a pure function of the seed and the minute');
    let differ = 0; for (let h = 0; h < 240; h++) if (classify(weatherAt(7, h * 60, shelf)).sky !== classify(weatherAt(8, h * 60, shelf)).sky) differ++;
    ok(differ > 40, `another seed brings other weather (${differ} of 240 hours differ)`);
    // Three years of hours in each region, one seed a year.
    const sim = (c: Climate): { sky: Record<Season, Partial<Record<Sky, number>>>; warmestSnow: number; summerCover: number; winterDeep: number; maxCover: number; maxWet: number; spells: number[] } => {
      const out = { sky: { spring: {}, summer: {}, autumn: {}, winter: {} } as Record<Season, Partial<Record<Sky, number>>>, warmestSnow: -99, summerCover: 0, winterDeep: 0, maxCover: 0, maxWet: 0, spells: [] as number[] };
      for (const seed of [11, 777, 4242]) {
        let spell = 0, winterHours = 0, deep = 0;
        for (let h = 0; h < DAYS_PER_YEAR * 24; h++) {
          const m = h * 60, w = weatherAt(seed, m, c), s = dateAt(m).season, k = classify(w).sky;
          out.sky[s][k] = (out.sky[s][k] ?? 0) + 1;
          if (w.precip >= 0.08 && w.snow >= 0.7) out.warmestSnow = Math.max(out.warmestSnow, w.temp);
          if (s === 'summer') out.summerCover = Math.max(out.summerCover, w.cover);
          if (s === 'winter') { winterHours++; if (w.cover >= 0.5) deep++; }
          out.maxCover = Math.max(out.maxCover, w.cover); out.maxWet = Math.max(out.maxWet, w.wet);
          if (w.precip >= 0.08) spell++; else if (spell) { out.spells.push(spell); spell = 0; }
        }
        out.winterDeep += deep / winterHours / 3;
      }
      return out;
    };
    const count = (r: Partial<Record<Sky, number>>, pick: (s: Sky) => boolean): number => Object.entries(r).reduce((n, [k, v]) => n + (pick(k as Sky) ? v! : 0), 0);
    const sh = sim(shelf), tm = sim(thorn);
    for (const s of ['spring', 'summer', 'autumn', 'winter'] as Season[]) ok(count(sh.sky[s], isRainy) > 0, `it rains on the Shelf in the ${s}`);
    const year = (r: typeof sh, k: Sky): number => (['spring', 'summer', 'autumn', 'winter'] as Season[]).reduce((n, s) => n + (r.sky[s][k] ?? 0), 0);
    ok(year(sh, 'drizzle') > 0 && year(sh, 'rain') > 0 && year(sh, 'downpour') > 0 && year(sh, 'storm') > 0, `the rain comes in every strength: drizzle ${year(sh, 'drizzle')}h, rain ${year(sh, 'rain')}h, downpour ${year(sh, 'downpour')}h, thunderstorms ${year(sh, 'storm')}h`);
    ok(year(sh, 'downpour') < year(sh, 'rain') + year(sh, 'drizzle'), 'and downpours are the rarer kind');
    ok((sh.sky.autumn.fog ?? 0) > (sh.sky.summer.fog ?? 0), `the Shelf's fogs come in the autumn (${sh.sky.autumn.fog ?? 0}h against ${sh.sky.summer.fog ?? 0}h in summer)`);
    ok(sh.warmestSnow < 0 && tm.warmestSnow < 0, `snow falls only below freezing (warmest snowfall ${Math.max(sh.warmestSnow, tm.warmestSnow).toFixed(1)} degrees)`);
    ok(count(sh.sky.summer, isSnowy) + count(tm.sky.summer, isSnowy) === 0 && sh.summerCover === 0 && tm.summerCover === 0, 'no snow falls or lies in the summer');
    ok(count(tm.sky.winter, isSnowy) > count(sh.sky.winter, isSnowy) * 2, `Thornmark's winter snows far more than the Shelf's (${count(tm.sky.winter, isSnowy)}h against ${count(sh.sky.winter, isSnowy)}h)`);
    ok(year(tm, 'blizzard') > 0 && (year(tm, 'sleet') + year(sh, 'sleet')) > 0, `blizzards blow in Thornmark (${year(tm, 'blizzard')}h) and sleet falls somewhere (${year(tm, 'sleet') + year(sh, 'sleet')}h)`);
    ok(tm.winterDeep > 0.3 && sh.winterDeep < tm.winterDeep, `snow lies deep over the pass for much of the winter (${(tm.winterDeep * 100).toFixed(0)}% of hours; the Shelf ${(sh.winterDeep * 100).toFixed(0)}%)`);
    ok(tm.maxCover === 1 && sh.maxWet > 0.9, 'the ground can be buried in snow and stand in water');
    const meanSpell = sh.spells.reduce((a, b) => a + b, 0) / sh.spells.length;
    ok(meanSpell >= 3, `a wet spell lasts hours, not minutes (mean ${meanSpell.toFixed(1)} hours)`);
    // The log: hysteresis keeps a shower on a boundary from flickering, and the news reads right.
    const edge: Weather = { ...weatherAt(1, 0, shelf), precip: 0.28, snow: 0, fog: 0, storm: 0 };
    ok(classify(edge).sky === 'drizzle' && classify(edge, { sky: 'rain', band: 2 }).sky === 'rain', 'rain easing just under the threshold stays rain until it clearly eases');
    ok(skyNews(null, 'rain', shelf) === 'It is raining.' && skyNews(null, 'clear', shelf) === null, 'first sight of the sky reports rain and says nothing of a clear day');
    ok(skyNews('clear', 'rain', shelf) === 'Rain begins to fall.' && skyNews('rain', 'overcast', shelf) === 'The rain stops.' && skyNews('rain', 'snow', thorn) === 'The rain turns to snow.', 'changes read as changes');
    ok(skyNews('clear', 'fog', shelf) === shelf.fogText && skyNews('clear', 'fog', thorn) === thorn.fogText && skyNews('cloudy', 'overcast', shelf) === null, 'fog comes in its region\'s own words; cloud is left to the eye');
    // A new world opens on a fair morning and never draws on the gameplay rng again.
    for (const seed of [1, 2, 3, 4, 5]) {
      const r = makeRng(seed), w = new World(buildMaps(), defaultParty(r), r);
      ok(fairStart(w.state.weatherSeed!, START_MINUTES, shelf) && w.weather.precip < 0.05 && w.weather.fog < 0.3, `a new game (seed ${seed}) opens dry and clear of fog`);
    }
    {
      const a = makeRng(3), b = makeRng(3);
      const wa = new World(buildMaps(), defaultParty(a), a), wb = new World(buildMaps(), defaultParty(b), b);
      for (let i = 0; i < 50; i++) { wa.advance(97); void wa.weather; wa.weatherNews(); void wa.sight; }
      ok(a.next() === b.next() && a.next() === b.next(), 'reading the weather draws nothing from the gameplay rng');
    }
    // What it does: fog and downpours close the view outdoors (a Light spell does not cut fog), not underground.
    const r = makeRng(5), world = new World(buildMaps(), defaultParty(r), r), seed = world.state.weatherSeed!;
    const daylit = (m: number): boolean => daylightAt(m) === 1;
    const fogAt = findWeather(seed, START_MINUTES, shelf, (w, m) => w.fog >= 0.6 && daylit(m));
    world.travel('shelf', 16, 8, 2); world.state.minutes = fogAt;
    ok(fogAt > 0 && world.sight === 2, `thick fog by day leaves two squares of sight on the Shelf (${world.sight})`);
    world.state.light = 50;
    ok(world.sight === 2, 'and a Light spell does not cut through it');
    world.travel('mill', 1, 1, 2);
    ok(world.sight === 4 && world.weatherNews() === null && world.combatWeather().rangedPenalty === 0, 'underground the weather neither blinds, nor speaks, nor spoils a shot');
    world.state.light = 0;
    const pourAt = findWeather(seed, START_MINUTES, shelf, (w, m) => w.precip >= 0.7 && w.snow === 0 && w.fog < 0.35 && daylit(m));
    world.travel('shelf', 16, 8, 2); world.state.minutes = pourAt; world.sky = null;
    ok(pourAt > 0 && world.sight === 3 && world.combatWeather().rangedPenalty === RANGED_PENALTY && !!world.combatWeather().note, `a downpour by day leaves three squares of sight and spoils bows (sight ${world.sight})`);
    ok(/pouring|heavens|sheets|thunder/i.test(world.weatherNews() ?? ''), 'and the log says it is pouring when the party looks up');
    ok(/Bows and slings will shoot poorly/.test(world.almanac()) && /three squares/.test(world.almanac()), 'the almanac says so too');
    // Deep snow slows a step outdoors, not in town.
    const snowAt = findWeather(seed, START_MINUTES, thorn, (w) => w.cover >= 0.5);
    world.travel('thornmark', 13, 12, 2); world.state.minutes = snowAt;
    const before = world.state.minutes, stepped = world.move('forward');
    ok(snowAt > 0 && stepped.kind === 'moved' && world.state.minutes - before === 6 + SNOW_DRAG && snowDrag(weatherAt(seed, before, thorn)) === SNOW_DRAG, `a step through deep snow takes ${world.state.minutes - before} minutes`);
    ok(/Snow lies deep/.test(world.almanac()), 'the almanac warns of it');
    const clearAt = findWeather(seed, START_MINUTES, shelf, (w) => w.cover === 0 && w.precip === 0);
    world.travel('shelf', 16, 8, 2); world.state.minutes = clearAt;
    const b2 = world.state.minutes; world.move('forward');
    ok(world.state.minutes - b2 === 6 && weatherSight(world.weather) === 4 && rangedPenalty(world.weather) === 0, 'a dry step on bare ground takes the usual six');
    // The inn wakes the party at 07:00, or at first light in the depth of winter.
    world.state.minutes = 0; world.sleepUntilMorning();
    ok(world.state.minutes === 7 * 60, 'in the autumn the inn wakes the party at 07:00');
    world.state.minutes = (MIDSUMMER + DAYS_PER_YEAR / 2 - EPOCH_DAY) * 1440 + 22 * 60; world.sleepUntilMorning();
    ok(world.hour === 8 && world.daylight >= 0.5, `at midwinter it waits for the light (${world.hour}:${String(world.minute).padStart(2, '0')})`);
    // Towns and dungeons share their region's weather; only the open road crosses from one to the next.
    for (const def of MAP_DEFS) for (const e of def.exits ?? []) {
      const to = MAP_DEFS.find((d) => d.id === e.to)!;
      if (def.kind !== 'outdoor' || to.kind !== 'outdoor') ok((def.region ?? 'shelf') === (to.region ?? 'shelf'), `${def.id} and ${to.id} share a region`);
    }
  },

  atlas() {
    const grid = worldGrid(ATLAS, MAP_DEFS);
    const W = grid.width, H = grid.height;
    ok(W === ATLAS.width && H === ATLAS.height && W % ATLAS.square === 0 && H % ATLAS.square === 0, `the world is ${W}x${H} squares, in whole lettered squares of ${ATLAS.square}`);
    const land = (x: number, y: number): boolean => { const t = grid.t(Math.floor(x), Math.floor(y)); return t !== TI.void && (!isWater(t) || grid.river[Math.floor(y) * W + Math.floor(x)] === 1); };
    const near = (x: number, y: number, r: number, fn: (x: number, y: number) => boolean): boolean => {
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (fn(x + dx, y + dy)) return true;
      return false;
    };
    // Every built outdoor map is placed once, inside the world, stamped 1:1, and no two overlap.
    const placed: { id: string; x: number; y: number; w: number; h: number }[] = [];
    for (const def of MAP_DEFS.filter((d) => d.kind === 'outdoor')) {
      const zs = ATLAS.zones.filter((z) => z.map === def.id);
      ok(zs.length === 1 && !!zs[0].at, `${def.id}: placed on the world map as exactly one zone`);
      const at = zs[0]?.at;
      if (!at) continue;
      const w = def.rows[0].length, h = def.rows.length;
      ok(at[0] >= 0 && at[1] >= 0 && at[0] + w <= W && at[1] + h <= H, `${def.id}: inside the world`);
      let own = 0;
      for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) own += grid.built[(at[1] + y) * W + at[0] + x];
      ok(own === (w - 2) * (h - 2), `${def.id}: every inner square is the map's own (${own} of ${(w - 2) * (h - 2)})`);
      placed.push({ id: def.id, x: at[0], y: at[1], w, h });
    }
    for (const a of placed) for (const b of placed) if (a.id < b.id) ok(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y, `${a.id} and ${b.id} do not overlap`);
    // A way between two placed maps joins neighbouring squares, so the maps meet where the way is.
    for (const def of MAP_DEFS) for (const e of def.exits ?? []) {
      const a = worldPoint(ATLAS, def.id, e.x, e.y), b = worldPoint(ATLAS, e.to, e.tx, e.ty);
      if (a && b) ok(Math.hypot(a[0] - b[0], a[1] - b[1]) <= 2.5, `${def.id} -> ${e.to}: the exit and the arrival are neighbours on the world map`);
    }
    // Every zone holds land and its seeds, every area is made of zones, and every land square is in one.
    const size = new Map<number, number>();
    for (let i = 0; i < W * H; i++) if (grid.zone[i] >= 0) size.set(grid.zone[i], (size.get(grid.zone[i]) ?? 0) + 1);
    ATLAS.zones.forEach((z, k) => {
      ok((size.get(k) ?? 0) >= 300, `zone ${z.id}: holds land (${size.get(k) ?? 0} squares)`);
      for (const [sx, sy] of z.seeds ?? []) ok(grid.zone[Math.floor(sy) * W + Math.floor(sx)] === k, `zone ${z.id}: its seed at ${sx},${sy} lies in it`);
      ok(ATLAS.areas.some((a) => a.id === z.area), `zone ${z.id}: its area '${z.area}' exists`);
    });
    for (const a of ATLAS.areas) ok(ATLAS.zones.some((z) => z.area === a.id), `area ${a.id}: is made of zones`);
    let squares = 0, claimed = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (land(x, y)) { squares++; if (grid.zone[y * W + x] >= 0) claimed++; }
    ok(claimed === squares, `every land square is in a zone (${claimed} of ${squares})`);
    // Sites stand on land and name waters on water; ports stand on the coast.
    for (const s of ATLAS.sites) {
      const z = s.map ? ATLAS.zones.find((q) => q.map === s.map) : undefined;
      const x = (z?.at?.[0] ?? 0) + s.at[0], y = (z?.at?.[1] ?? 0) + s.at[1];
      if (s.icon === 'water') ok(isWater(grid.t(Math.floor(x), Math.floor(y))), `${s.name}: lettered on water`);
      else if (s.icon !== 'label' && s.icon !== 'wreck') ok(near(x, y, 1, land), `${s.name}: stands on land`);
    }
    const ports = ATLAS.sites.filter((s) => s.icon === 'port');
    ok(ports.length === 3, `three port cities (${ports.map((p) => p.name).join(', ')})`);
    for (const p of ports) ok(near(p.at[0], p.at[1], 4, (x, y) => grid.t(Math.floor(x), Math.floor(y)) === TI.sea || grid.t(Math.floor(x), Math.floor(y)) === TI.shallow), `${p.name}: on the coast`);
    // Every way's ends exist, and a crossing's course stays at sea.
    const ids = new Set([...ATLAS.areas.map((a) => a.id), ...ATLAS.zones.map((z) => z.id), ...ATLAS.places.map((q) => q.id), ...MAP_DEFS.map((d) => d.id)]);
    for (const l of ATLAS.links) ok(ids.has(l.from) && ids.has(l.to), `way ${l.from} -> ${l.to}: both ends exist`);
    for (const l of ATLAS.links.filter((q) => q.kind === 'sea')) for (const [x, y] of l.via ?? []) ok(grid.t(Math.floor(x), Math.floor(y)) === TI.sea, `crossing ${l.from} -> ${l.to}: passes ${x},${y} at sea`);
    // Places: a built one is a map, a planned one is not yet; every town and dungeon has one.
    for (const q of ATLAS.places) ok(q.planned ? !MAP_DEFS.some((d) => d.id === q.id) : MAP_DEFS.some((d) => d.id === q.id), `place ${q.id}: ${q.planned ? 'planned and not built yet' : 'a built map'}`);
    for (const d of MAP_DEFS.filter((q) => q.kind !== 'outdoor')) ok(ATLAS.places.some((q) => q.id === d.id), `${d.id}: has a plate on the world map`);
    // The road of levels: numbered once each, every step reachable once the ones before it are done,
    // the gates that make it wind shutting their step out until then, and the bands rising along it.
    const steps = progression(ATLAS, MAP_DEFS);
    ok(steps.every((st, i) => st.order === i + 1), `the steps are numbered 1 to ${steps.length}, once each`);
    for (const st of steps) ok(reachable(ATLAS, MAP_DEFS, st.order - 1).has(st.id), `step ${st.order} (${st.name}) can be reached once the steps before it are done`);
    for (const [id, done] of [['saltreach', 1], ['sunderwood', 3], ['ashfall', 8], ['hearth', 10]] as const) ok(!reachable(ATLAS, MAP_DEFS, done).has(id), `${id} is shut until step ${done + 1}'s way opens`);
    const banded = steps.filter((st) => st.band);
    ok(banded.length === steps.length && banded.every((st, i) => i === 0 || st.band![0] >= banded[i - 1].band![0]), 'every step has a level band, and the bands rise along the road');
  },

  outdoors() {
    // The outdoors is played as one map the size of the world, every zone map the atlas places laid into it.
    const zoneMaps = MAP_DEFS.filter((d) => d.kind === 'outdoor');
    const played = PLAYED_DEFS.filter((d) => d.kind === 'outdoor');
    ok(played.length === 1 && played[0].id === OUTDOORS, `the outdoors is played as one map (${played.map((d) => d.id).join(', ')})`);
    ok(PLAYED_DEFS[0].id === MAP_DEFS[0].id && PLAYED_DEFS.length === MAP_DEFS.length - zoneMaps.length + 1, 'Harrow is still the first map, and the towns and dungeons are played as they are written');
    const out = new GameMap(played[0]);
    ok(out.width === ATLAS.width && out.height === ATLAS.height, `the outdoors is the world's size, square for square with the painted map (${out.width}x${out.height})`);
    for (const d of zoneMaps) {
      const z = out.zones.find((q) => q.id === d.id), at = zoneOfMap(ATLAS, d.id)?.at;
      ok(!!z && !!at && z.x === at[0] && z.y === at[1] && z.w === d.rows[0].length && z.h === d.rows.length && z.name === d.name, `${d.id}: laid where the atlas puts it, and called ${d.name}`);
      if (!z) continue;
      let same = 0;
      for (let y = 1; y < z.h - 1; y++) for (let x = 1; x < z.w - 1; x++) if (out.at(z.x + x, z.y + y).ch === d.rows[y][x]) same++;
      ok(same === (z.w - 2) * (z.h - 2), `${d.id}: every square inside its ring is the map's own (${same} of ${(z.w - 2) * (z.h - 2)})`);
    }
    let outside = 0, blank = 0;
    for (let y = 0; y < out.height; y++) for (let x = 0; x < out.width; x++) if (!out.zoneAt(x, y)) { outside++; if (out.at(x, y).solid === 'void') blank++; }
    ok(outside > 0 && blank === outside, `every square no zone map covers is void: the world ends there for now (${blank} of ${outside})`);
    ok(out.at(0, 0) === out.at(out.width - 1, out.height - 1) && Object.isFrozen(out.at(0, 0)), 'the void is one frozen cell, however much of it there is');
    // The mountains that closed each zone map in are, where they face nothing built, the end of the
    // world too; between the two zones they are the ridge, as they were, with the pass through it.
    const sh = out.zones.find((z) => z.id === 'shelf')!, th = out.zones.find((z) => z.id === 'thornmark')!;
    const line = (x: number, y: number, dx: number, dy: number, n: number): string => Array.from({ length: n }, (_, i) => out.at(x + dx * i, y + dy * i).ch).join('');
    const faces = [line(sh.x, sh.y, 1, 0, sh.w), line(sh.x, sh.y + sh.h - 1, 1, 0, sh.w), line(sh.x, sh.y, 0, 1, sh.h), line(th.x, th.y, 1, 0, th.w), line(th.x, th.y + th.h - 1, 1, 0, th.w), line(th.x + th.w - 1, th.y, 0, 1, th.h)];
    ok(faces.every((s) => /^%+$/.test(s)), 'the Shelf\'s north, west and south edges and Thornmark\'s north, east and south edges are the end of the world');
    const ridge = '%' + 'M'.repeat(8) + '=' + 'M'.repeat(21) + '%';
    ok(line(sh.x + sh.w - 1, sh.y, 0, 1, sh.h) === ridge && line(th.x, th.y, 0, 1, th.h) === ridge, 'between them the ridge stands two squares thick with the pass through it, and runs out into the void at both ends');
    // The ways: every one lands on open ground; none joins one zone to the next, which is walked; the
    // checkpoint's flags close the road instead; and the towns and dungeons open onto the outdoors.
    const maps = buildMaps();
    for (const d of PLAYED_DEFS) for (const e of d.exits ?? []) ok(maps[e.to]?.passable(e.tx, e.ty) === 'ok', `${d.id} -> ${e.to}: lands on an open square (${e.tx},${e.ty})`);
    ok(!out.exits.some((e) => e.to === OUTDOORS), 'no exit joins one zone to the next: the way between them is walked');
    const g = out.gates;
    ok(g.length === 1 && g[0].x === sh.x + 31 && g[0].y === sh.y + 9 && [g[0].needFlag].flat().join() === 'q_ashcombe_done,q_greywater_done' && /checkpoint/.test(g[0].blockedText ?? ''),
      'the Warden checkpoint is a gate on the road through the pass, with the old exit\'s flags and words');
    ok(PLAYED_DEFS.find((d) => d.id === 'harrow')!.exits!.every((e) => e.to === OUTDOORS && e.tx === sh.x + 16 && e.ty === sh.y + 4), 'Harrow\'s south gate opens onto the Shelf road, where it always did');
    ok(sh.enter?.thornmark === 'Back through the pass to the Shelf.' && th.enter?.shelf === 'The pass opens onto old forest. Thornmark.', 'crossing from one zone to the other says what the exits used to');
    { // Every open square of the outdoors can be walked to from its start, given keys, secrets, water and climbing, and never through the void.
      const can = { swim: true, climb: true, keys: 1 }, reached = new Uint8Array(out.width * out.height);
      const stack = [[out.def.start.x, out.def.start.y]];
      while (stack.length) {
        const [x, y] = stack.pop()!, k = y * out.width + x, p = out.passable(x, y, can), c = out.at(x, y);
        if (reached[k] || p === 'wall' || p === 'void' || c.solid === 'tree' || c.solid === 'rock') continue;
        reached[k] = 1;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (out.inBounds(x + dx, y + dy)) stack.push([x + dx, y + dy]);
      }
      let open = 0, got = 0;
      for (let y = 0; y < out.height; y++) for (let x = 0; x < out.width; x++) {
        const p = out.passable(x, y, can);
        if (p === 'wall' || p === 'void' || out.at(x, y).solid !== 'none') continue;
        open++; if (reached[y * out.width + x]) got++;
      }
      ok(open > 1500 && got === open, `every open square of the outdoors is reachable from its start (${got} of ${open})`);
    }
    // The composer refuses what the outdoors cannot hold: two zones keeping state under one id, or two zone maps on one square.
    const refusal = (f: () => unknown): string => { try { f(); return ''; } catch (e) { return e instanceof Error ? e.message : String(e); } };
    const clash: MapDef[] = MAP_DEFS.map((d) => (d.id === 'thornmark' ? { ...d, features: [...(d.features ?? []), { kind: 'event', x: 2, y: 2, id: 'coast', text: '' }] } : d));
    ok(/'coast'/.test(refusal(() => layOutdoors(ATLAS, clash))), 'two zones may not share a feature id: the outdoors keeps one record for both');
    const heaped = { ...ATLAS, zones: ATLAS.zones.map((z) => (z.id === 'thornmark' ? { ...z, at: [220, 30] as const } : z)) };
    ok(/laid over/.test(refusal(() => layOutdoors(heaped, MAP_DEFS))), 'nor may two zone maps be laid on the same squares');
  },

  save() {
    const rng = makeRng(9);
    const party = defaultParty(rng);
    const world = new World(buildMaps(), party, rng);
    world.move('forward'); world.turn('right'); world.move('forward');
    party.flags.q_ashcombe = 1;
    world.travel('mill', 6, 11, 1); party.bag.push('key_iron'); world.move('forward');
    const text = serialize(world.state, party, 12345);
    const data = deserialize(text);
    ok(JSON.stringify(data.world) === JSON.stringify(world.state) && JSON.stringify(data.party) === JSON.stringify(party) && data.rng === 12345, 'a save round-trips the world, the party and the rng');
    const world2 = new World(buildMaps(), data.party, makeRng(1), data.world);
    ok(world2.map.at(7, 11).door === 'door', 'loading re-applies the unlocked door to fresh map content');
    ok(seen(world2.state.maps.harrow.explored, 14 * 16 + 7) && world2.state.mapId === 'mill' && world2.state.x === 7, 'loading keeps the explored cells and the position');
    { // The outdoors saves small: its cells seen are kept a bit apiece.
      world.travel('shelf', 16, 8, 2);
      const outdoors = JSON.stringify(world.state.maps[OUTDOORS]).length;
      ok(outdoors < 20_000 && seen(world.state.maps[OUTDOORS].explored, world.state.y * world.map.width + world.state.x), `the whole outdoors' state saves in ${outdoors} characters, and it knows where the party has been`);
    }
    ok(data.world.weatherSeed === world.state.weatherSeed && JSON.stringify(world2.weather) === JSON.stringify(world.weather), 'the weather seed round-trips, and with it the weather');
    // A save from before there was weather has no seed: it loads with the legacy one and keeps it.
    const old = JSON.parse(text) as { world: WorldState };
    delete old.world.weatherSeed;
    const world3 = new World(buildMaps(), data.party, makeRng(1), old.world);
    ok(world3.state.weatherSeed === LEGACY_WEATHER_SEED && world3.weather.precip >= 0 && world3.date.gameDay === world.date.gameDay, 'a save from before the weather loads, on the same date, with the legacy weather seed');
    { // A version 1 save, from when the Shelf and Thornmark were maps of their own, each cell seen a
      // number apiece: it loads onto the outdoors, everything where it was.
      const cells = (w: number, h: number, at: [number, number][]): number[] => { const a = new Array(w * h).fill(0); for (const [x, y] of at) a[y * w + x] = 1; return a; };
      const v1 = {
        version: 1, savedAt: 0, rng: 7, party: defaultParty(makeRng(2)),
        world: {
          mapId: 'thornmark', x: 13, y: 12, facing: 2, minutes: 3000, light: 0, truce: 2, truceGroups: ['tm_spiders1'], steps: 40, lastTown: 'harrow', weatherSeed: 99,
          maps: {
            harrow: { explored: cells(16, 16, [[7, 14]]), used: {}, groups: {}, doors: {} },
            shelf: { explored: cells(32, 32, [[16, 4], [30, 9]]), used: { coast: 1 }, groups: { road_rats: { x: 16, y: 6, dead: 2000 }, hill_wolves: { x: 20, y: 10, dead: -1 } }, doors: {} },
            thornmark: { explored: cells(32, 32, [[13, 12]]), used: { tm_tower: 1 }, groups: { tm_ogre: { x: 5, y: 7, dead: 2500 } }, doors: {} },
          },
        },
      };
      const loaded = deserialize(JSON.stringify(v1));
      const up = new World(buildMaps(), loaded.party, makeRng(1), loaded.world);
      const at = local(up), ms = up.state.maps[OUTDOORS], z = (id: string) => up.map.zones.find((q) => q.id === id)!;
      const sh = z('shelf'), th = z('thornmark');
      ok(up.state.mapId === OUTDOORS && at.map === 'thornmark' && at.x === 13 && at.y === 12, `the party stands where it stood, on the outdoors now (${at.map} ${at.x},${at.y})`);
      ok(!('shelf' in up.state.maps) && !('thornmark' in up.state.maps) && JSON.stringify(up.state.zones) === '["shelf","thornmark"]', 'the Shelf and Thornmark keep no state of their own, and count as set foot in');
      ok(up.explored(sh.x + 16, sh.y + 4) && up.explored(sh.x + 30, sh.y + 9) && up.explored(th.x + 13, th.y + 12) && !up.explored(sh.x + 17, sh.y + 4), 'what was seen on each is seen where it now lies');
      ok(seen(up.state.maps.harrow.explored, 14 * 16 + 7) && !seen(up.state.maps.harrow.explored, 14 * 16 + 8), 'and Harrow\'s cells seen are packed into bits');
      ok(ms.used.coast === 1 && ms.used.tm_tower === 1, 'the Shelf\'s event and Thornmark\'s chest stay used');
      ok(ms.groups.road_rats.dead === 2000 && ms.groups.tm_ogre.dead === 2500 && ms.groups.hill_wolves.x === sh.x + 20 && ms.groups.hill_wolves.y === sh.y + 10 && ms.groups.tm_wolves1.dead === -1, 'the dead stay dead, the living stand where they stood, and groups never met are where their maps put them');
      ok(holds({ visited: 'thornmark' }, up.state, up.party) && !holds({ visited: 'grove1' }, up.state, up.party) && up.region === 'thornmark', 'the quest log still knows the party has been to Thornmark, and the weather is Thornmark\'s');
      const again = new World(buildMaps(), loaded.party, makeRng(1), deserialize(serialize(up.state, up.party, 1)).world);
      ok(JSON.stringify(again.state) === JSON.stringify(up.state), 'saved again, it loads as it is');
      ok((() => { try { deserialize(JSON.stringify({ ...v1, version: 99 })); return false; } catch { return true; } })(), 'a save from a newer build is refused');
    }
  },

  quests() {
    const conds = (w: When): QuestCond[] => [w].flat();
    // Every condition names something real: a flag an NPC sets, an item, a once-only event or a
    // chest, a guardian that never respawns (one that does comes back to life and would take its
    // entry with it), a map.
    const npcFlags = new Set(MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => f.kind === 'npc' ? [f.flag, f.quest?.setFlag] : [])));
    const onMap = (ref: string): { map: (typeof MAP_DEFS)[number] | undefined; id: string } => { const [m, id] = ref.split(':'); return { map: MAP_DEFS.find((d) => d.id === m), id }; };
    ok(new Set(QUESTS.map((q) => q.id)).size === QUESTS.length, `the ${QUESTS.length} quests have distinct ids`);
    for (const q of QUESTS) {
      const bad: string[] = [];
      for (const c of [q.start, ...(q.done ? [q.done] : []), ...q.entries.map((e) => e.when), ...q.goals.map((g) => g.when)].flatMap(conds)) {
        for (const f of [c.flag ?? []].flat()) if (!npcFlags.has(f)) bad.push(`flag ${f}`);
        if (c.item !== undefined && !(c.item in ITEMS)) bad.push(`item ${c.item}`);
        if (c.seen !== undefined) { const { map, id } = onMap(c.seen); if (!map?.features?.some((f) => ((f.kind === 'event' && f.once) || f.kind === 'chest') && f.id === id)) bad.push(`seen ${c.seen}`); }
        if (c.slain !== undefined) { const { map, id } = onMap(c.slain); const e = map?.encounters?.find((x) => x.id === id); if (!e || e.respawn) bad.push(`slain ${c.slain}`); }
        if (c.visited !== undefined && !MAP_DEFS.some((d) => d.id === c.visited)) bad.push(`visited ${c.visited}`);
      }
      ok(!bad.length, `${q.id}: every condition names a real flag, item, event, guardian or map${bad.length ? ' -> ' + bad.join(', ') : ''}`);
      ok(new Set(q.entries.map((e) => e.id)).size === q.entries.length, `${q.id}: entry ids are distinct`);
      const missing = [...new Set([q.title, ...q.entries.map((e) => e.text), ...q.goals.map((g) => g.text)].join('').toUpperCase())].filter((ch) => !FONT_CHARS.includes(ch));
      ok(!missing.length, `${q.id}: every character has a glyph in the pixel font${missing.length ? ' -> ' + missing.join(' ') : ''}`);
      ok(measureText('▶ ' + q.title) <= LIST.w, `${q.id}: the title fits the list (${measureText('▶ ' + q.title)} of ${LIST.w}px)`);
      const all = (goal: string | null): QuestView => ({ def: q, done: goal === null, entries: q.entries, goal });
      ok([...q.goals.map((g) => g.text), null].every((goal) => questPage(all(goal), PAGE.w, PAGE.h).dropped === 0), `${q.id}: the whole journal fits its page under any goal`);
    }
    { // A page too long for the box gives up its oldest entries and keeps the newest.
      const q = QUESTS[0];
      const long = { ...q, entries: Array.from({ length: 14 }, (_, i) => ({ id: `e${i}`, when: q.start, text: `${i}: ${q.entries[0].text}` })) };
      const p = questPage({ def: long, done: false, entries: long.entries, goal: q.goals[0].text }, PAGE.w, PAGE.h);
      ok(p.dropped > 0 && p.rows.every((r) => r.y + 7 <= PAGE.h) && p.rows.some((r) => r.text.startsWith('13: ')) && !p.rows.some((r) => r.text.startsWith('0: ')),
        `a journal too long for its page drops the oldest ${p.dropped} entries and keeps the newest`);
    }
    // Each way in starts the quest with a goal; each entry can be written; each goal can be the one
    // shown (not hidden behind an earlier one); and an entry keyed to an item outlasts the hand-in.
    const fresh = (): { party: Party; world: World } => { const rng = makeRng(8); const party = defaultParty(rng); return { party, world: new World(buildMaps(), party, rng) }; };
    // A zone map's ids are kept in the outdoors' state, and the party has to have walked into it.
    const stateFor = (w: World, map: string): MapState => {
      const on = w.locate(map, 0, 0).mapId;
      if (on !== map && !w.state.zones!.includes(map)) w.state.zones!.push(map);
      return w.ensureMapState(on);
    };
    const satisfy = (s: { party: Party; world: World }, c: QuestCond): void => {
      for (const f of [c.flag ?? []].flat()) s.party.flags[f] = 1;
      if (c.item) s.party.bag.push(c.item);
      if (c.seen) { const [m, id] = c.seen.split(':'); stateFor(s.world, m).used[id] = 1; }
      if (c.slain) { const [m, id] = c.slain.split(':'); stateFor(s.world, m).groups[id].dead = s.world.state.minutes; }
      if (c.visited) stateFor(s.world, c.visited);
    };
    const view = (s: { party: Party; world: World }, id: string): QuestView | undefined => questLog(s.world.state, s.party).find((v) => v.def.id === id);
    const handedIn = new Set(MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => f.kind === 'npc' && f.quest ? [f.quest.item] : [])));
    for (const q of QUESTS) {
      const bad: string[] = [];
      for (const c of conds(q.start)) { const s = fresh(); satisfy(s, c); const v = view(s, q.id); if (!v || v.done || !v.goal) bad.push(`start ${JSON.stringify(c)}`); }
      const start = conds(q.start)[0];
      for (const e of q.entries) for (const c of conds(e.when)) { const s = fresh(); satisfy(s, start); satisfy(s, c); if (!view(s, q.id)?.entries.includes(e)) bad.push(`entry ${e.id}`); }
      q.goals.forEach((g, i) => { const s = fresh(); satisfy(s, start); satisfy(s, conds(g.when)[0]); if (view(s, q.id)?.goal !== g.text) bad.push(`goal ${i + 1}`); });
      ok(!bad.length, `${q.id}: starts with a goal, and every entry and goal can come up${bad.length ? ' -> ' + bad.join(', ') : ''}`);
      // An entry keyed to an item has to outlast losing it: at the hand-in that ends the quest, or,
      // for a quest with no end yet, never, so no hand-in may want the item and no shop buy it.
      const lost = new Set<string>();
      if (q.done) {
        for (const e of q.entries) if (conds(e.when).some((c) => c.item)) { const s = fresh(); satisfy(s, start); satisfy(s, conds(q.done)[0]); if (!view(s, q.id)?.entries.includes(e)) lost.add(`entry ${e.id}, at the hand-in`); }
      } else {
        for (const c of [q.start, ...q.entries.map((e) => e.when)].flatMap(conds)) if (c.item && (handedIn.has(c.item) || Math.floor(ITEMS[c.item].price / 2) > 0)) lost.add(`${c.item}, which can be taken`);
      }
      ok(!lost.size, `${q.id}: nothing in the log vanishes when an item leaves the party${lost.size ? ' -> ' + [...lost].join(', ') : ''}`);
    }
    { // The slice's quests end to end, from the real flags and triggers: the log fills in, the goal
      // moves on, and each change is announced once and in story order.
      const rng = makeRng(4);
      const party = defaultParty(rng);
      const world = new World(buildMaps(), party, rng);
      const log = (): QuestView[] => questLog(world.state, party);
      const quest = (id: string): QuestView => log().find((v) => v.def.id === id)!;
      let marks = questMarks(log());
      const news = (): string => { const l = log(); const n = questNews(marks, l).map((x) => x.text).join(' '); marks = questMarks(l); return n; };
      ok(log().length === 0 && news() === '', 'a new game starts with an empty quest log');
      party.flags.q_ashcombe = 1;
      ok(news() === 'New quest: The Quiet Farm.' && /Ashcombe/.test(quest('ashcombe').goal ?? ''), `Vask's contract begins The Quiet Farm, and says where to go (${quest('ashcombe').goal})`);
      world.travel('mill', 1, 1, 2);
      ok(/cellar/.test(quest('ashcombe').goal ?? '') && news() === '', 'in the cellar the goal moves on, which is not news');
      world.travel('mill', 10, 4, NORTH); world.move('forward');
      ok(quest('ashcombe').entries.some((e) => e.id === 'lantern') && news() === 'Quest log updated: The Quiet Farm.', "stepping on the dead Lantern writes her note into the log");
      party.bag.push('survey_wand');
      ok(/Vask/.test(quest('ashcombe').goal ?? '') && news() === 'Quest log updated: The Quiet Farm.', 'with the wand in hand, the goal is Vask');
      takeItem(party, 'survey_wand'); party.flags.q_ashcombe_done = 1; // what Vask's hand-in does
      ok(news() === 'Quest complete: The Quiet Farm. New quest: The Grove Stone.', 'the hand-in finishes the farm and, after it, begins the Grove Stone');
      const farm = quest('ashcombe');
      ok(farm.done && farm.goal === null && farm.entries.some((e) => e.id === 'wand'), 'a finished quest has no goal and keeps the wand it handed over');
      ok(/Greywater/.test(quest('grove').goal ?? ''), `while Greywater holds out, the Grove Stone waits on the pass (${quest('grove').goal})`);
      party.flags.q_greywater = 1; party.bag.push('greywater_ledger');
      ok(news() === 'New quest: The Greywater Ledger.' && /Hale/.test(quest('greywater').goal ?? ''), 'Hale\'s contract and his ledger arrive together as one line');
      takeItem(party, 'greywater_ledger'); party.flags.q_greywater_done = 1;
      ok(news() === 'Quest complete: The Greywater Ledger. Quest log updated: The Grove Stone.' && /pass/.test(quest('grove').goal ?? ''), 'the second hand-in opens the pass, and the Grove Stone says so');
      const data = deserialize(serialize(world.state, party, 1));
      const reloaded = questLog(data.world, data.party);
      ok(JSON.stringify(reloaded) === JSON.stringify(log()) && questNews(marks, reloaded).length === 0, 'a save carries the quest log without storing it, and a reload is not news');
      world.travel('thornmark', 1, 9, 1);
      party.flags.q_grove = 1;
      ok(news() === 'Quest log updated: The Grove Stone.' && /under the Grove/.test(quest('grove').goal ?? ''), 'Sylvane sends the party under the Grove');
      party.bag.push('ashen_chisel');
      world.travel('grove2', 8, 8, 0); world.killGroups(['g2_warden']); party.bag.push('meridian_journal'); // the Warden dies and drops its journal
      ok(/Sylvane/.test(quest('grove').goal ?? '') && ['chisel', 'tear'].every((id) => quest('grove').entries.some((e) => e.id === id)), 'the chisel goes to Sylvane, and the Warden\'s death is written');
      ok(news() === 'Quest log updated: The Grove Stone. New quest: The Lost Expedition.', 'the journal the Warden drops begins the Lost Expedition');
      takeItem(party, 'ashen_chisel'); party.flags.q_grove_done = 1;
      ok(news() === 'Quest complete: The Grove Stone.' && log().filter((v) => v.done).length === 3, 'the three quests of the slice can all be finished');
      const expedition = quest('meridian');
      ok(!expedition.done && /Meridian/.test(expedition.goal ?? '') && expedition.entries.length === 1, `and the Lost Expedition stays open with a goal, its trail not built yet (${expedition.goal})`);
    }
  },
};

const wanted = process.argv.slice(2);
for (const [name, fn] of Object.entries(suites)) {
  if (wanted.length && !wanted.includes(name)) continue;
  console.log(`\n${name}`);
  try { fn(); } catch (e) { failures++; console.log('  FAIL: threw ' + (e instanceof Error ? e.stack : String(e))); }
}
console.log(failures ? `\n${failures} FAILURE(S)` : '\nALL OK');
process.exit(failures ? 1 : 0);
