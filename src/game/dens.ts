// Dens (#88): a camp that breeds one kind of monster until the company burns it. Its brood are
// groups of the map, back one a pace while it stands; its keepers, a group beside it, guard it. A
// burnt den is its id in the map's `used`, as an opened chest is, and its brood's `until` reads
// that; its look, once said, is `<id>.seen` there too. So nothing new is saved. Pure, so the tests
// load it; world.ts runs the pace and the look, and game.ts puts the choice and says the lines.
import type { Feature, GameMap, EncounterDef } from './map.ts';
import type { QuestCond } from './quests.ts';
import type { World } from './world.ts';
import type { Party } from './party.ts';
import { giftOf, give } from './wilds.ts';
import { item } from './items.ts';

export type Den = Extract<Feature, { kind: 'den' }>;

/** The brood's `until`: the den burnt, by its map as written and its id. */
export const denBurnt = (map: string, id: string): QuestCond => ({ seen: `${map}:${id}` });

/** The key a den's look is kept by in `used` once said. Never ':', which `seen` splits on. */
export const lookKey = (den: Den): string => `${den.id}.seen`;

export const burnt = (world: World, den: Den): boolean => world.used(den.id);

/** Whether its keepers lie dead. Keepers never come back, so once dead they stay so. */
export const keepersDead = (world: World, den: Den): boolean => (world.mapState.groups[den.keepers]?.dead ?? -1) >= 0;

/** Each map's dens and their brood groups, found once: `liveGroups` asks every frame. */
const cache = new WeakMap<GameMap, { den: Den; brood: EncounterDef[] }[]>();
export function densOf(map: GameMap): { den: Den; brood: EncounterDef[] }[] {
  let d = cache.get(map);
  if (!d) {
    d = map.features.filter((f): f is Den => f.kind === 'den').map((den) => ({ den, brood: map.encounters.filter((e) => den.brood.includes(e.id)) }));
    cache.set(map, d);
  }
  return d;
}

/**
 * The pace: a standing den's dead brood come back one at a time, each its `respawn` after the one
 * before. A waiting group's `dead` minute is moved on to the start of its turn, the minute the one
 * ahead of it is back, so the queue is the saved minutes and nothing new is saved. Run before the
 * groups come back, whenever they are asked after.
 */
export function pace(world: World): void {
  const groups = world.mapState.groups;
  for (const { den, brood } of densOf(world.map)) {
    if (!brood.length || burnt(world, den)) continue;
    const waiting = brood.filter((e) => e.respawn && (groups[e.id]?.dead ?? -1) >= 0).sort((a, b) => groups[a.id].dead - groups[b.id].dead);
    for (let i = 1; i < waiting.length; i++) {
      const ahead = waiting[i - 1], st = groups[waiting[i].id];
      st.dead = Math.max(st.dead, groups[ahead.id].dead + ahead.respawn!);
    }
  }
}

/** The hoard in words, as the burning gives it; '' for none. */
export function hoardLine(den: Den): string {
  const got = [...(den.gold ? [`${den.gold} gold`] : []), ...den.items.map((id) => item(id).name)];
  return got.length ? `The hoard: ${got.join(', ')}.` : '';
}

/** What the log says as the party steps into it or faces it with Space, and whether to put the choice. */
export function approach(world: World, den: Den): { lines: string[]; ask: boolean } {
  if (burnt(world, den)) return { lines: [den.ruin ?? 'Cold ashes. Nothing breeds here now.'], ask: false };
  if (!keepersDead(world, den)) return { lines: ['Its keepers stand in the way.'], ask: false };
  return { lines: [], ask: true };
}

/**
 * Burn it, its keepers dead: marked used, so its brood stop coming; its hoard to the purse and the
 * bag. Returns the burning and the hoard's line; nothing for a den standing guarded or burnt.
 */
export function burn(world: World, party: Party, den: Den): string[] {
  if (burnt(world, den) || !keepersDead(world, den)) return [];
  world.markUsed(den.id);
  give(party, giftOf(den)!);
  const hoard = hoardLine(den);
  return [den.burnt, ...(hoard ? [hoard] : [])];
}

/**
 * The looks of the standing dens now in sight, or stood in, the first time: said once each and
 * kept. A burnt one says nothing: its crows have flown.
 */
export function denLooks(world: World, inSight: (x: number, y: number) => boolean): string[] {
  const said: string[] = [];
  for (const { den } of densOf(world.map)) {
    if (burnt(world, den) || world.used(lookKey(den)) || !inSight(den.x, den.y)) continue;
    world.markUsed(lookKey(den));
    said.push(den.text);
  }
  return said;
}
