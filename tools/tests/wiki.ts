// The wiki (wiki.html, src/app/wiki/): its pages, as src/app/wiki/pages.ts makes them, hold an entry to
// every people, class, trait, prestige, feat, pairing, kind and monster the tables have and none they
// lack, each with the tables' own numbers; a monster's card says what the roster says it does, and its
// picture is a drawing a family registers. The page is held drawn by the smoke's `wiki` part.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { RACES, CLASSES, TRAITS, STATS, PRESTIGES, PRESTIGE_LEVELS } from '../../src/game/party.ts';
import { KINDS } from '../../src/game/monsters.ts';
import { FEATS } from '../../src/game/combat/feats.ts';
import { abilities } from '../../src/game/bestiary.ts';
import { AREAS, MONSTERS, SPELLS } from '../../src/content/index.ts';
import { SPRITES } from '../../src/ui/monsters/index.ts';
import { bestiary, classes, kinds, monster, races, starts } from '../../src/app/wiki/pages.ts';
import { ok } from './lib.ts';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

export function wiki(): void {
  // The peoples: each once, in the tables' order, with its mods, a stat it leaves alone a 0.
  const rs = races(), raceIds = Object.keys(RACES);
  const offRace = rs.filter((r) => STATS.some((s) => r.mods[s] !== (RACES[r.id].mods[s] ?? 0)) || r.swims !== !!RACES[r.id].swim).map((r) => r.id);
  ok(rs.map((r) => r.id).join() === raceIds.join() && !offRace.length, `the races: all ${raceIds.length}, in order, each with its people's mods${offRace.length ? '; off: ' + offRace.join(', ') : ''}`);

  // The classes: each once, with its traits, its three prestiges at their levels and its feats.
  const cs = classes(), classIds = Object.keys(CLASSES);
  const offClass = cs.filter((c) => {
    const d = CLASSES[c.id];
    return c.hpDie !== d.hpDie || c.spDie !== d.spDie || c.attack !== d.attack
      || c.traits.map((t) => t.name).join() !== d.traits.map((t) => TRAITS[t].name).join()
      || c.prestiges.map((p) => `${p.title}@${p.level}`).join() !== PRESTIGES[c.id].titles.map((t, i) => `${t}@${PRESTIGE_LEVELS[i]}`).join()
      || c.feats.map((f) => f.name).sort().join() !== FEATS.filter((f) => f.cls === c.id).map((f) => f.name).sort().join();
  }).map((c) => c.id);
  ok(cs.map((c) => c.id).join() === classIds.join() && !offClass.length,
    `the classes: all ${classIds.length}, in order, each with its dice, to-hit, traits, ${cs.reduce((n, c) => n + c.prestiges.length, 0)} prestiges and ${cs.reduce((n, c) => n + c.feats.length, 0)} feats${offClass.length ? '; off: ' + offClass.join(', ') : ''}`);

  // The pairings: every people as every class, once, each starting on its class's stats with its people's on top.
  const ps = starts(), pairs = new Set(ps.map((s) => `${s.race}/${s.cls}`));
  const offStart = ps.filter((s) => STATS.some((k) => s.stats[k] !== (CLASSES[s.cls].stats[k] ?? 10) + (RACES[s.race].mods[k] ?? 0)) || s.hp < 1).map((s) => `${s.race}/${s.cls}`);
  ok(ps.length === raceIds.length * classIds.length && pairs.size === ps.length && !offStart.length,
    `every pairing: ${ps.length}, each once, on its class's stats and its people's mods${offStart.length ? '; off: ' + offStart.join(', ') : ''}`);

  // The kinds, each once.
  ok(kinds().map((k) => k.id).join() === Object.keys(KINDS).join(), `the kinds: ${Object.keys(KINDS).join(', ')}`);

  // The bestiary: the areas with monsters in road order, every def once with its numbers, its words and a drawing.
  const areas = bestiary(), cards = areas.flatMap((a) => a.monsters), ids = Object.keys(MONSTERS);
  const seen = new Map<string, number>();
  for (const c of cards) seen.set(c.id, (seen.get(c.id) ?? 0) + 1);
  const missing = ids.filter((id) => !seen.has(id)), twice = [...seen].filter(([, n]) => n > 1).map(([id]) => id), extra = [...seen.keys()].filter((id) => !(id in MONSTERS));
  ok(areas.map((a) => a.id).join() === AREAS.filter((a) => a.monsters.length).map((a) => a.id).join() && areas.every((a) => a.band),
    `the bestiary's ${areas.length} areas, in road order, each with its band`);
  ok(cards.length === ids.length && !missing.length && !twice.length && !extra.length,
    `the bestiary: every one of the ${ids.length} monsters, once${missing.length ? '; none for ' + missing.join(', ') : ''}${twice.length ? '; twice: ' + twice.join(', ') : ''}${extra.length ? '; no def: ' + extra.join(', ') : ''}`);
  const offCard = cards.filter((c) => {
    const d = MONSTERS[c.id];
    return c.name !== d.name || c.level !== d.level || c.hp !== d.hp || c.ac !== d.ac || c.toHit !== d.attack || c.speed !== d.speed || c.xp !== d.xp
      || c.kind !== d.kind || c.sprite !== d.sprite || c.does !== abilities(d, { spells: SPELLS, monster: (id) => MONSTERS[id] }) || !(d.sprite in SPRITES);
  }).map((c) => c.id);
  ok(!offCard.length, `each card holds its def's numbers and words and a drawing a family registers${offCard.length ? '; off: ' + offCard.join(', ') : ''}`);
  const blow = monster({ ...MONSTERS.rat, dice: 2, sides: 6, bonus: -1, gold: [3, 3] });
  ok(blow.blow === '2d6-1' && blow.gold === '3' && monster({ ...MONSTERS.rat, bonus: 4 }).blow === `${MONSTERS.rat.dice}d${MONSTERS.rat.sides}+4`,
    `a blow is its dice and its bonus, a gold that does not vary one number (${blow.blow}, ${blow.gold})`);

  // The page: wiki.html loads the wiki's entry, which is there.
  const html = readFileSync(`${ROOT}wiki.html`, 'utf8'), entry = /<script type="module" src="([^"]+)"><\/script>/.exec(html)?.[1];
  ok(entry === 'src/app/wiki/main.ts' && existsSync(`${ROOT}${entry}`), `wiki.html loads ${entry}`);
}
