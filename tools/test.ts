// Pure-Node tests for the game model: maps, movement, combat determinism, saves. No browser.
//   node tools/test.ts            run everything
//   node tools/test.ts maps combat  run selected suites
import { makeRng } from '../src/lib/engine/rng.ts';
import { buildMaps, MAP_DEFS } from '../src/content/maps/index.ts';
import { World } from '../src/game/world.ts';
import { defaultParty, partyCan, xpForLevel, levelUp, equip, armorClass, canTrain, spellTierAt, MAX_LEVEL, addCondition, hasCondition } from '../src/game/party.ts';
import { startCombat, currentTurn, partyAct, monsterAct, aliveMonsters, canAttackFromRow, castOnAlly, WARD_AC } from '../src/game/combat.ts';
import type { CombatState } from '../src/game/combat.ts';
import type { Party } from '../src/game/party.ts';
import { serialize, deserialize } from '../src/game/save.ts';
import { ITEMS } from '../src/game/items.ts';
import { MONSTERS } from '../src/game/monsters.ts';
import { SPELLS, spell, spellsFor } from '../src/game/spells.ts';

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
      for (const e of m.exits) if (e.needFlag) ok(MAP_DEFS.some((d) => d.features?.some((f) => f.kind === 'npc' && f.quest?.setFlag === e.needFlag)), `${def.id}: gated exit flag '${e.needFlag}' is set by some quest`);
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
    ok(a.state.loot !== null && a.state.loot.xp === 6 * 3 + 14, `xp is the sum of the monsters' (${a.state.loot?.xp})`);
    ok(a.party.members.every((m) => m.xp === Math.floor(32 / 6)), 'xp is split evenly among the living');
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
    for (const list of ['cleric', 'sorcerer'] as const) for (let t = 1; t <= 5; t++) ok(spellsFor(list, t).some((sp) => sp.level === t), `the ${list} list has a tier ${t} spell`);
    const c = p.members[4];
    c.xp = 1_000_000;
    const gained = levelUp(c, rng);
    ok(c.level === MAX_LEVEL && gained === MAX_LEVEL - 1, `a cleric with endless xp levels to exactly ${MAX_LEVEL} (${c.level})`);
    ok(!canTrain(c), 'and cannot train further');
    ok(spellsFor('cleric', 5).every((sp) => c.spells.includes(sp.id)), 'at the cap every cleric spell is known, including tier 5');
    ok(c.maxHp >= 9 * 1 + 8 && c.maxSp > 20, `hp and sp grew with the levels (hp ${c.maxHp}, sp ${c.maxSp})`);
    const k = p.members[0]; k.xp = xpForLevel(8);
    ok(levelUp(k, rng) === 7 && k.level === 8 && k.spells.length === 0, 'a knight levels to 8 on level-8 xp and learns no spells');
    ok(xpForLevel(MAX_LEVEL) === 13050, `level ${MAX_LEVEL} costs ${xpForLevel(MAX_LEVEL)} xp`);
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
