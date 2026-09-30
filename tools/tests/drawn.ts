// A group as the view draws it while exploring (game/world.ts, groupDrawn): to three figures, each
// of its kinds once in the order they stand, then the rest, so the archer or the caster among ten
// brigands is seen before the fight. Held over every group on the maps as played, and the look of
// each kind drawn is said when first seen.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { PLAYED_DEFS } from '../../src/content/maps.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef } from '../../src/game/map.ts';
import { World, groupDrawn, DRAWN_MAX } from '../../src/game/world.ts';
import { defaultParty } from '../../src/game/party.ts';
import { NORTH } from '../../src/game/types.ts';
import { ok } from './lib.ts';

/** What is wrong with a group as drawn: a kind of its first three missing, or the wrong number drawn. */
export function drawnFaults(monsters: readonly string[], drawn: readonly string[] = groupDrawn(monsters)): string[] {
  const kinds = [...new Set(monsters)], out: string[] = [];
  if (drawn.length !== Math.min(DRAWN_MAX, monsters.length)) out.push(`${drawn.length} drawn, not ${Math.min(DRAWN_MAX, monsters.length)}`);
  for (const k of kinds.slice(0, DRAWN_MAX)) if (!drawn.includes(k)) out.push(`no ${k} drawn`);
  const left = [...monsters];
  for (const d of drawn) { const i = left.indexOf(d); if (i < 0) out.push(`a ${d} drawn that is not in it`); else left.splice(i, 1); }
  return out;
}

export function drawn(): void {
  const groups = PLAYED_DEFS.flatMap((d) => (d.encounters ?? []).map((e) => ({ at: `${d.id} ${e.id}`, monsters: e.monsters })));
  const bad = groups.flatMap((g) => drawnFaults(g.monsters).map((f) => `${g.at}: ${f}`));
  const mixed = groups.filter((g) => new Set(g.monsters).size > 1).length;
  ok(bad.length === 0, `every group on the maps is drawn as each of its kinds, to three (${groups.length} groups, ${mixed} mixed)${bad.length ? ' -> ' + bad.slice(0, 5).join('; ') : ''}`);
  ok(groupDrawn(['brigand', 'brigand', 'brigand', 'brigand_archer']).join() === 'brigand,brigand_archer,brigand', `three brigands and an archer are drawn as a brigand, the archer and a brigand (${groupDrawn(['brigand', 'brigand', 'brigand', 'brigand_archer']).join(', ')})`);
  ok(groupDrawn(['a', 'b', 'c', 'd']).join() === 'a,b,c' && groupDrawn(['wolf']).join() === 'wolf', 'four kinds are drawn as the first three, and a lone wolf as itself');
  // Broken on purpose: the old drawing, three copies of the first, is caught.
  const old = (ms: readonly string[]): string[] => ms.slice(0, 1).flatMap((m) => Array(Math.min(DRAWN_MAX, ms.length)).fill(m));
  const caught = groups.filter((g) => drawnFaults(g.monsters, old(g.monsters)).length).length;
  ok(caught === mixed, `the old drawing, copies of the first monster, fails every mixed group (${caught} of ${mixed})`);

  // Seen before the fight: eleven brigands and their archer ahead, and the company meets both kinds.
  const field: MapDef = {
    id: 'drawn_field', name: 'Field', kind: 'outdoor', density: 'country', start: { x: 2, y: 4, facing: NORTH },
    rows: [',,,,,', ',,,,,', ',,,,,', ',,,,,', ',,,,,'],
    encounters: [{ id: 'band', x: 2, y: 2, monsters: [...Array(11).fill('brigand'), 'brigand_archer'], roams: false }],
  };
  const rng = makeRng(5), w = new World({ drawn_field: new GameMap(field) }, defaultParty(rng), rng);
  w.sightings();
  const met = w.state.met ?? [];
  ok(met.includes('brigand') && met.includes('brigand_archer'), `a band seen ahead is met as each kind drawn, the archer among the brigands (${met.join(', ')})`);
}
