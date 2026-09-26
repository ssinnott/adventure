// The level gates, measured: how often a company of a given level wins an area's fights, so a map's
// band can be held against what its monsters actually do (docs/EXPANSION.md §2.2, §5.2).
//   node tools/gate.ts                                 every map with monsters, levels 1-8 and 10
//   node tools/gate.ts --maps thornmark,grove2 --levels 2,3,4,5 --seeds 200
//   node tools/gate.ts --road thornmark:tm_wolves1,tm_brigands2,tm_hounds,tm_zealots
// The premade company is trained to each level in its starting gear, and fights every group of a map
// alone from full health, once per seed. --road instead fights the groups named, in order, with no
// rest between, and counts the companies still standing after each; one group is one fight. A plain
// bot plays the party: mend the weakest when someone is under 40%, else the strongest damage spell it
// can afford, else a weapon, else brace. It never sleeps, blesses, drinks or flees, and nobody has
// gear past the start, so it is weaker than a player; single fights at full health are kinder than
// play. Read the numbers as where the fights bite, not as a promise.
import { makeRng } from '../src/lib/engine/rng.ts';
import { defaultParty, xpForLevel, levelUp, isDown, MAX_LEVEL } from '../src/game/party.ts';
import type { Party } from '../src/game/party.ts';
import { startCombat, currentTurn, partyAct, monsterAct, aliveMonsters, canAttackFromRow } from '../src/game/combat.ts';
import { spell } from '../src/game/spells.ts';
import type { SpellTarget } from '../src/game/spells.ts';
import { MAP_DEFS } from '../src/content/maps/index.ts';
import type { EncounterDef } from '../src/game/map.ts';

const args = process.argv.slice(2);
const opt = (name: string): string | undefined => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : undefined; };
const levels = (opt('levels') ?? '1,2,3,4,5,6,7,8,10').split(',').map(Number);
const seeds = Number(opt('seeds') ?? 100);
const only = opt('maps')?.split(',').filter(Boolean);
if (levels.some((l) => !(l >= 1 && l <= MAX_LEVEL))) throw new Error(`levels run from 1 to ${MAX_LEVEL}`);

/** The premade company, every member trained to `level`, whole. */
function companyAt(level: number, seed: number): Party {
  const rng = makeRng(seed), p = defaultParty(rng);
  for (const c of p.members) { c.xp = xpForLevel(level); levelUp(c, rng); c.hp = c.maxHp; c.sp = c.maxSp; }
  return p;
}

/** How far a damage spell reaches; the bot casts the widest it can afford. */
const REACH: Partial<Record<SpellTarget, number>> = { all: 3, group: 2, enemy: 1 };

/** One fight to its end with the bot playing the party, which carries its wounds out. True if won. */
function fight(p: Party, monsters: string[], seed: number): boolean {
  const rng = makeRng(seed), s = startCombat(p, [{ id: 'gate', monsters }], rng);
  for (let guard = 0; s.outcome === 'ongoing' && guard < 4000; guard++) {
    const t = currentTurn(s, p, rng);
    if (!t) break;
    if (t.side === 'monster') { monsterAct(s, p, rng); continue; }
    const c = p.members[t.i], foe = aliveMonsters(s)[0];
    const known = c.spells.map(spell).filter((x) => x.context !== 'explore' && x.sp <= c.sp);
    const low = p.members.map((m, i) => ({ m, i })).filter(({ m }) => !isDown(m) && m.hp < m.maxHp * 0.4).sort((a, b) => a.m.hp - b.m.hp)[0];
    const mend = known.filter((x) => x.heal && !x.raise).sort((a, b) => (b.heal ?? 0) - (a.heal ?? 0))[0];
    const blast = known.filter((x) => x.dice && REACH[x.target])
      .sort((a, b) => REACH[b.target]! - REACH[a.target]! || b.dice! * b.sides! - a.dice! * a.sides!)[0];
    if (low && mend && partyAct(s, p, rng, { type: 'cast', spellId: mend.id, target: low.i })) continue;
    if (blast && partyAct(s, p, rng, { type: 'cast', spellId: blast.id, target: foe })) continue;
    if (canAttackFromRow(c, t.i) && partyAct(s, p, rng, { type: 'attack', target: foe })) continue;
    partyAct(s, p, rng, { type: 'defend' });
  }
  return s.outcome === 'victory';
}

const pct = (n: number, of: number): number => Math.round((100 * n) / of);
const line = (label: string, cells: readonly (string | number)[]): void => console.log(label.padEnd(28) + cells.map((c) => String(c).padStart(5)).join(''));
const heading = (label: string): void => line(label, levels.map((l) => `L${l}`));

const road = opt('road');
if (road) {
  const [mapId, ids = ''] = road.split(':');
  const groups: EncounterDef[] = ids.split(',').filter(Boolean).map((id) => {
    const g = MAP_DEFS.find((d) => d.id === mapId)?.encounters?.find((e) => e.id === id);
    if (!g) throw new Error(`no group '${id}' on '${mapId}'`);
    return g;
  });
  console.log(`${mapId}: companies still standing after each fight, no rest between (%, ${seeds} seeds)`);
  heading('fight');
  const standing = groups.map(() => levels.map(() => 0));
  levels.forEach((l, li) => {
    for (let k = 1; k <= seeds; k++) {
      const p = companyAt(l, k);
      for (let f = 0; f < groups.length && fight(p, groups[f].monsters, k * 104729 + f); f++) standing[f][li]++;
    }
  });
  groups.forEach((g, f) => line(`${f + 1}: ${g.id} [${g.monsters.length}]`, standing[f].map((n) => pct(n, seeds))));
} else {
  console.log(`Fights won, each group alone from full health (%, ${seeds} seeds)`);
  heading('map (band)');
  for (const d of MAP_DEFS) {
    const groups = d.encounters ?? [];
    if (!groups.length || (only && !only.includes(d.id))) continue;
    line(`${d.id} (${d.band?.join('-') ?? '-'})`, levels.map((l) => {
      let won = 0;
      for (const g of groups) for (let k = 1; k <= seeds; k++) if (fight(companyAt(l, k), g.monsters, k * 7919 + 13)) won++;
      return pct(won, groups.length * seeds);
    }));
  }
}
