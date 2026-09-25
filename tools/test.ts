// Pure-Node tests for the game model: maps, movement, combat determinism, saves. No browser.
//   node tools/test.ts            run everything
//   node tools/test.ts maps combat  run selected suites
import { makeRng } from '../src/lib/engine/rng.ts';
import { buildMaps, MAP_DEFS } from '../src/content/maps/index.ts';
import { World } from '../src/game/world.ts';
import { defaultParty, createCharacter, CLASSES, TRAITS, hasTrait, damage, STALWART_AC, DIE_HARD_AT, INSPIRE_HIT, partyCan, xpForLevel, levelUp, equip, armorClass, canTrain, spellTierAt, MAX_LEVEL, addCondition, hasCondition } from '../src/game/party.ts';
import { startCombat, currentTurn, partyAct, monsterAct, aliveMonsters, canAttackFromRow, castOnAlly, buffHit, traitDamage, WARD_AC } from '../src/game/combat.ts';
import type { CombatState } from '../src/game/combat.ts';
import type { Party } from '../src/game/party.ts';
import { serialize, deserialize } from '../src/game/save.ts';
import { ITEMS } from '../src/game/items.ts';
import { MONSTERS } from '../src/game/monsters.ts';
import { SPELLS, spell, spellsFor } from '../src/game/spells.ts';
import { dateAt, shortDate, longDate, daylightAt, sunTimes, MONTHS, DAYS_PER_YEAR, EPOCH_DAY, MIDSUMMER } from '../src/game/calendar.ts';
import type { Season } from '../src/game/calendar.ts';
import { weatherAt, findWeather, classify, skyNews, fairStart, weatherSight, rangedPenalty, snowDrag, CLIMATES, RANGED_PENALTY, SNOW_DRAG, isRainy, isSnowy } from '../src/game/weather.ts';
import type { Climate, Sky, Weather } from '../src/game/weather.ts';
import { START_MINUTES, LEGACY_WEATHER_SEED } from '../src/game/world.ts';
import type { WorldState } from '../src/game/world.ts';

let failures = 0;
const ok = (cond: boolean, msg: string): void => { console.log((cond ? '  ok:   ' : '  FAIL: ') + msg); if (!cond) failures++; };

const suites: Record<string, () => void> = {
  maps() {
    const maps = buildMaps();
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
    ok(r2.kind === 'moved' && r3.kind === 'moved' && world.map.id === 'shelf' && world.state.x === 16 && world.state.y === 4 && world.state.facing === 2,
      `walking through the south gate arrives on the Shelf facing south (${world.map.id} ${world.state.x},${world.state.y})`);
    ok(world.explored(16, 4) && world.explored(16, 6), 'arrival reveals the cells around and ahead');
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
    world.travel('shelf', 1, 1, 3);
    ok(world.move('forward').kind === 'blocked', 'mountains block without a mountaineer');
    // The pass to Thornmark is a flag-gated exit: closed until Vask's contract is done.
    world.travel('shelf', 30, 9, 1);
    const closed = world.move('forward');
    ok(closed.kind === 'blocked' && /checkpoint/.test(closed.reason) && world.map.id === 'shelf', 'the Thornmark pass is closed before the Ashcombe hand-in');
    party.flags.q_ashcombe_done = 1;
    ok(world.move('forward').kind === 'blocked' && world.map.id === 'shelf', 'the pass stays closed until Greywater is cleared as well');
    party.flags.q_greywater_done = 1;
    const opened = world.move('forward');
    ok(opened.kind === 'moved' && world.map.id === 'thornmark' && world.state.x === 1 && world.state.y === 9, `the pass opens once the flag is set (${world.map.id} ${world.state.x},${world.state.y})`);
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
    const rats = world.liveGroups().find((g) => g.def.id === 'road_rats')!;
    ok(rats.state.y === 7, 'the road rats start where the map puts them');
    const r = world.move('forward');
    ok(rats.state.y === 6, `an aware group steps toward the party (${rats.state.x},${rats.state.y})`);
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

  party() {
    const rng = makeRng(5);
    const p = defaultParty(rng);
    ok(p.members.length === 6, 'six members');
    ok(p.members.every((m) => m.hp === m.maxHp && m.hp > 0), 'everyone starts at full health');
    ok(p.members[0].equipment.weapon === 'longsword' && p.members[0].equipment.armor === 'scale', 'the knight starts in scale with a long sword');
    ok(p.members[5].spells.includes('spark') && p.members[5].spells.includes('light'), 'the sorcerer knows the tier-1 spells');
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
    ok(world2.state.maps.harrow.explored[14 * 16 + 7] === 1 && world2.state.mapId === 'mill' && world2.state.x === 7, 'loading keeps the explored cells and the position');
    ok(data.world.weatherSeed === world.state.weatherSeed && JSON.stringify(world2.weather) === JSON.stringify(world.weather), 'the weather seed round-trips, and with it the weather');
    // A save from before there was weather has no seed: it loads with the legacy one and keeps it.
    const old = JSON.parse(text) as { world: WorldState };
    delete old.world.weatherSeed;
    const world3 = new World(buildMaps(), data.party, makeRng(1), old.world);
    ok(world3.state.weatherSeed === LEGACY_WEATHER_SEED && world3.weather.precip >= 0 && world3.date.gameDay === world.date.gameDay, 'a save from before the weather loads, on the same date, with the legacy weather seed');
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
