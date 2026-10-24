// The pilot's fair view of the world (epic #713, Decided 1; docs/PILOT.md): what the party has seen
// and heard, and nothing more. Every brain reads the world through it and never through `g.world`,
// `g.maps` or a map as written: the automap's bits, its cells as the automap inks them, the features,
// exits and groups it marks, the maps walked, the world map as it is painted, the lines said and the
// company. Nothing here gives a map's secrets or encounters as written, a gate's terms or what a
// person or a statue holds, nor a shop's wares before its menu has shown them: a group is a square
// the automap marks, and no more. The headless run's omniscient view (#723), which the game never
// sets, has every square seen, each cell as it is and the secret doors as written (`secrets`).
import type { Game } from '../game.ts';
import type { Cell, Exit, Feature, GameMap, MapZone } from '../map.ts';
import type { Party } from '../party.ts';
import type { WorldState } from '../world.ts';
import { seen as lit } from '../world.ts';
import { drawnCell, onAutomap, markedGroups } from '../ink.ts';
import { mapPlace } from '../atlas.ts';
import { spentId } from '../wilds.ts';
import { questLog, goalMap } from '../quests.ts';
import { ChoiceScreen, InteriorScreen } from '../../ui/screens.ts';
import { optionParts } from '../../ui/draw.ts';
import { ATLAS, ITEMS, MAP_DEFS } from '../../content/index.ts';

/** A cell as the automap inks it, its legend letter gone: a secret door is a wall and no more. */
export type Inked = Omit<Cell, 'ch'>;

export interface Known {
  /** The automap's bit: whether the party has seen the square (`MapState.explored`). */
  seen(map: string, x: number, y: number): boolean;
  /** The cell as the automap inks it (`drawnCell`), or undefined when unseen: a secret door comes back a wall. */
  cell(map: string, x: number, y: number): Inked | undefined;
  /**
   * The features the automap marks on seen squares (`onAutomap`: no event, there now, not spent),
   * each a fair copy (`fair`): what only a meeting, a menu or a use shows is blank or gone, but a
   * shop's wares and prices and a trainer's top level once its menu has shown them (#719).
   */
  features(map: string): Feature[];
  /** The exits on seen squares that are there now, as the automap marks them: where each leads, and no gate's terms. */
  exits(map: string): Exit<string>[];
  /**
   * The squares of the groups the automap marks now (`markedGroups`): on the party's own map, in view
   * or on a seen square within two steps; none on any other map. Nothing of what a group is.
   */
  groups(map: string): { x: number; y: number }[];
  /** The company, as its sheets show it: who stands, what each has learnt and what it carries. */
  readonly party: Party;
  /** The maps visited: the keys of `WorldState.maps`. */
  visited(): string[];
  /** Where a map is on the world map, in world cells, as the world map places it (`mapPlace`). */
  placeOf(map: string): [number, number] | undefined;
  /** Lines heard: everything said through `Game.say` and every message box opened, the last `HEARD_MAX`. */
  heard: readonly string[];

  // The explorer's readers (#718).
  /**
   * The squares a map id spans, in the reckoning its readers take: a map's whole extent, as the automap
   * draws it, or a zone's box on the outdoors, as the world map draws it. Its bounds and nothing else.
   */
  box(map: string): { x: number; y: number; w: number; h: number } | undefined;
  /**
   * The levels a place is tuned for, as the almanac gives them where the party stands (`World.here`): a
   * zone's once the party has set foot in it (`WorldState.zones`), a town's or a dungeon's once visited;
   * undefined before then, or where none is set.
   */
  band(map: string): readonly [number, number] | undefined;
  /**
   * An enclave's band (#845), as its door says it: once the party has seen a way into it or been in
   * it; undefined before then, and for a map that is no enclave.
   */
  enclave(map: string): readonly [number, number] | undefined;
  /** How many squares of a map the party has seen: the automap's bits counted, so a brain can tell that nothing new is seen. */
  seenCount(map: string): number;

  // The strategist's readers (#720).
  /**
   * The journal's goals: each open quest's id, the goal its page shows and the map that goal is done
   * on (`goalMap`) where the goal says. Only what the log shows: no goal not yet shown, nor its map.
   */
  goals(): { quest: string; text: string; map?: string }[];
  /** The zones of the outdoors the party has set foot in (`WorldState.zones`), first first: what the almanac has said. */
  zones(): readonly string[];

  // Talk's reader (#721).
  /**
   * The crossings told (`Pilot.offers`, as `Game.offer` opened its menu): each seller's map and square,
   * the route's name, the fare its menu showed and where it lands, as played (`World.locate`). Nothing of
   * a person's crossings before they are offered.
   */
  offers(): { map: string; x: number; y: number; name: string; fare: number; to: string; tx: number; ty: number }[];

  // The omniscient run's (#723): the headless run alone, never the game (`Pilot.omniscient`).
  /** Whether this is the omniscient view: every square seen, a cell as it is, a secret door a door. */
  readonly omniscient: boolean;
  /**
   * The secret doors of a map not yet found, as written (`MapDef.secrets`, a zone's in the outdoors'
   * squares): the omniscient view's alone. A fair pilot is told of none, as a secret is found.
   */
  secrets(map: string): { x: number; y: number }[];
}

/**
 * The fair view of `g`. A zone map's id (a goal's map may be one) names the outdoors it lies in
 * (`World.locate`), and every reader takes and gives the outdoors' squares, as `g.world.state` has
 * them while the party is there: `seen` and `cell` answer for any of them, and the features and exits
 * are those in the zone's box. A goal's square written in the zone's own reckoning goes through
 * `World.locate` before it is compared. Features and exits of seen squares are as the world has them
 * now, not as last seen (a known simplification). A pilot's `omniscient` (the headless run, #723)
 * has every square seen, each cell as it is (a secret door a door) and the secret doors as written
 * (`secrets`); the game never sets it. Each look notes what the menu on top shows (`look`), so a
 * shop's wares and a trainer's top level are known from the first time their menus are seen.
 */
export function knownOf(g: Game): Known {
  const w = g.world, all = g.pilot?.omniscient ?? false;
  look(g, shownTo(g.party));
  const seenOn = (m: GameMap, x: number, y: number): boolean => {
    if (!m.inBounds(x, y)) return false;
    const ms = w.state.maps[m.id];
    return all || (!!ms && lit(ms.explored, y * m.width + x));
  };
  /** The map as played that an id names (a zone map's is the outdoors), and the zone's box where a zone map's id named it. */
  const played = (map: string): { m: GameMap; box?: MapZone } | undefined => {
    const id = w.locate(map, 0, 0).mapId, m = g.maps[id];
    return m && { m, box: id === map ? undefined : m.zones.find((z) => z.id === map) };
  };
  const inBox = (box: MapZone | undefined, x: number, y: number): boolean => !box || (x >= box.x && y >= box.y && x < box.x + box.w && y < box.y + box.h);
  return {
    seen(map, x, y) {
      const p = played(map);
      return !!p && seenOn(p.m, x, y);
    },
    cell(map, x, y) {
      const p = played(map);
      if (!p || !seenOn(p.m, x, y)) return undefined;
      // The omniscient view reads the cell as it is, not as drawn: a secret door is a door.
      if (all) { const { terrain, solid, door } = p.m.at(x, y); return { terrain, solid, door: door === 'secret' ? 'door' : door }; }
      const { terrain, solid, door } = drawnCell(p.m, x, y);
      return door === 'secret' ? { terrain, solid: 'wall', door: 'none' } : { terrain, solid, door };
    },
    features(map) {
      const p = played(map);
      if (!p) return [];
      const used = w.state.maps[p.m.id]?.used ?? {};
      // As the automap marks them: a den standing or burnt, any other spent thing gone.
      const spent = (f: Feature): boolean => { const id = spentId(f); return f.kind !== 'den' && !!id && !!used[id]; };
      const menus = shownTo(g.party);
      return p.m.features.filter((f) => inBox(p.box, f.x, f.y) && seenOn(p.m, f.x, f.y) && onAutomap(w, f, p.m.id) && !spent(f)).map((f) => fair(f, menus.get(`${p.m.id}:${f.x},${f.y}`)));
    },
    exits(map) {
      const p = played(map);
      if (!p) return [];
      return p.m.exits.filter((e) => inBox(p.box, e.x, e.y) && seenOn(p.m, e.x, e.y) && w.there(e))
        .map(({ x, y, to, tx, ty, tf }) => (tf === undefined ? { x, y, to, tx, ty } : { x, y, to, tx, ty, tf }));
    },
    groups(map) {
      const p = played(map);
      return p && p.m.id === w.state.mapId ? markedGroups(w).map(({ state: s }) => ({ x: s.x, y: s.y })) : [];
    },
    get party() { return g.party; },
    visited: () => Object.keys(w.state.maps),
    placeOf: (map) => mapPlace(ATLAS, MAP_DEFS, map),
    heard: g.pilot?.heard ?? [],
    box(map) {
      const p = played(map), z = p?.box;
      return p && (z ? { x: z.x, y: z.y, w: z.w, h: z.h } : { x: 0, y: 0, w: p.m.width, h: p.m.height });
    },
    band(map) {
      const p = played(map);
      if (!p) return undefined;
      return p.box ? ((w.state.zones ?? []).includes(p.box.id) ? p.box.band : undefined) : w.state.maps[p.m.id] ? p.m.def.band : undefined;
    },
    enclave(map) {
      const m = g.maps[map];
      if (!m?.def.enclave) return undefined;
      const door = (id: string): boolean => !!g.maps[id]?.exits.some((e) => e.to === map && seenOn(g.maps[id], e.x, e.y) && w.there(e));
      return w.state.maps[map] || Object.keys(w.state.maps).some(door) ? m.def.band : undefined;
    },
    seenCount(map) {
      const p = played(map), n = p ? p.m.width * p.m.height : 0, bits = p && w.state.maps[p.m.id]?.explored;
      if (all || !bits) return all ? n : 0;
      let c = 0;
      for (let i = 0, words = Math.min(bits.length, Math.ceil(n / 32)); i < words; i++) {
        // A word's bits counted; the last word's beyond the map's squares are left out.
        let v = i === words - 1 && n % 32 ? bits[i] & ((1 << (n % 32)) - 1) : bits[i];
        v -= (v >>> 1) & 0x55555555;
        v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
        c += Math.imul((v + (v >>> 4)) & 0x0f0f0f0f, 0x01010101) >>> 24;
      }
      return c;
    },
    goals() {
      // The log is worked out afresh only when something it reads has moved (`logKey`).
      const key = logKey(w.state, g.party), last = LOGS.get(w.state);
      if (last?.key === key) return last.goals.map((q) => ({ ...q }));
      // The one quest's pages each show their own goal (#723): every page begun and not done, the earliest first, as the journal's pages turn.
      const goals = questLog(w.state, g.party).flatMap((v) => {
        if (v.done || v.goal === null) return [];
        const shown = v.def.chapters ? v.pages.filter((pg) => pg.goal !== null && !pg.done && (pg.begun || pg.goal === v.goal)) : [];
        if (shown.length > 1) return shown.map((pg) => { const map = pg.def.goals.find((q) => q.text === pg.goal)?.at; return map === undefined ? { quest: v.def.id, text: pg.goal! } : { quest: v.def.id, text: pg.goal!, map }; });
        const map = goalMap(v);
        return [map === undefined ? { quest: v.def.id, text: v.goal } : { quest: v.def.id, text: v.goal, map }];
      });
      LOGS.set(w.state, { key, goals });
      return goals.map((q) => ({ ...q }));
    },
    zones: () => [...w.state.zones ?? []],
    offers: () => (g.pilot?.offers ?? []).map(({ map, x, y, passage: r, fare }) => {
      const at = w.locate(r.to, r.x, r.y);
      return { map, x, y, name: r.name, fare, to: at.mapId, tx: at.x, ty: at.y };
    }),
    omniscient: all,
    secrets(map) {
      const p = played(map);
      if (!all || !p) return [];
      // A dungeon's or a town's as written; the outdoors' from each zone's map, placed where its box lies.
      const from = p.m.kind === 'outdoor' ? p.m.zones.filter((z) => !p.box || z.id === p.box.id).map((z) => ({ def: MAP_DEFS.find((d) => d.id === z.id), x: z.x, y: z.y })) : [{ def: p.m.def, x: 0, y: 0 }];
      return from.flatMap(({ def, x, y }) => (def?.secrets ?? []).map((s) => ({ x: s.x + x, y: s.y + y }))).filter((s) => p.m.at(s.x, s.y).door === 'secret');
    },
  };
}

/**
 * A feature as the party knows it before it is met, used or bought from: its kind, its square, its
 * id and the name its hint shows. Words are '' and lists [] until said or shown, a number is NaN and
 * a gift {}; what it would say, ask, sell, teach or give, and when it is there, is gone. A rift keeps
 * where it leads, as an exit does. A shop's wares and their prices and a trainer's top level are
 * what its menu has shown, if it has (`seen`), and blank till then.
 */
function fair(f: Feature, seen?: Shown): Feature {
  const { x, y } = f, named = 'name' in f && f.name ? { name: f.name } : {};
  switch (f.kind) {
    case 'sign': return { kind: 'sign', x, y, text: '' };
    case 'inn': return { kind: 'inn', x, y, name: f.name, interior: f.interior, price: NaN };
    case 'temple': return { kind: 'temple', x, y, name: f.name, interior: f.interior };
    case 'shop': return { kind: 'shop', x, y, name: f.name, interior: f.interior, stock: [...seen?.stock ?? []], ...(seen?.prices ? { prices: { ...seen.prices } } : {}) };
    case 'guild': return { kind: 'guild', x, y, name: f.name, interior: f.interior, classes: [], fee: NaN };
    case 'trainer': return { kind: 'trainer', x, y, name: f.name, interior: f.interior, maxLevel: seen?.maxLevel ?? NaN };
    case 'chest': return { kind: 'chest', x, y, id: f.id, gold: NaN, items: [] };
    case 'npc': return { kind: 'npc', x, y, name: f.name, lines: [], ...(f.interior ? { interior: f.interior } : {}) };
    case 'rift': return { kind: 'rift', x, y, id: f.id, to: f.to, tx: f.tx, ty: f.ty, ...(f.tf === undefined ? {} : { tf: f.tf }) };
    case 'shrine': return { kind: 'shrine', x, y, id: f.id, ...named, text: '', done: '' };
    case 'fountain': return { kind: 'fountain', x, y, id: f.id, ...named, text: '', done: '' };
    case 'cairn': return { kind: 'cairn', x, y, id: f.id, ...named, gold: NaN, items: [] };
    case 'statue': return { kind: 'statue', x, y, id: f.id, ...named, text: '', riddle: '', answer: '', gift: {}, done: '' };
    case 'camp': return { kind: 'camp', x, y, ...named, text: '' };
    case 'den': return { kind: 'den', x, y, id: f.id, ...named, text: '', breeds: [], keepers: '', brood: [], ask: '', burn: '', burnt: '', gold: NaN, items: [] };
    case 'well': return { kind: 'well', x, y, text: '' };
    case 'event': return { kind: 'event', x, y, id: f.id, text: '' };
  }
}

/** The journal's goals at the last look, by world, with what the log read then (`logKey`). */
const LOGS = new WeakMap<WorldState, { key: string; goals: { quest: string; text: string; map?: string }[] }>();
/**
 * Everything `questLog` reads, in one string: the flags, what the company carries, who it is and at
 * what level and prestige, the maps and zones walked, and the things used up and the groups dead on
 * every map. While it stands the log's goals stand.
 */
function logKey(w: WorldState, p: Party): string {
  let used = 0, dead = 0;
  for (const id in w.maps) {
    const ms = w.maps[id];
    for (const u in ms.used) used += u.length + 1;
    for (const q in ms.groups) if (ms.groups[q].dead >= 0) dead += q.length + 1;
  }
  const who = p.members.map((m) => `${m.cls}.${m.race}.${m.level}.${m.prestige ?? 0}.${m.pack.join('+')}`).join('/');
  return [Object.keys(p.flags).join('+'), p.bag.join('+'), who, Object.keys(w.maps).length, w.zones?.length ?? 0, used, dead].join('|');
}

/** What a business's menu has shown (#719): a shop's wares and their prices, in its Buy list, and a trainer's top level, in its words. */
interface Shown { stock?: string[]; prices?: Record<string, number>; maxLevel?: number }
/**
 * What the menus have shown each company, by the business's square ('map:x,y', the map as played):
 * kept outside the save, as the corpus is, and a new game's or a load's company has seen none.
 */
const SHOWN = new WeakMap<Party, Map<string, Shown>>();
function shownTo(p: Party): Map<string, Shown> {
  let m = SHOWN.get(p);
  if (!m) SHOWN.set(p, (m = new Map()));
  return m;
}

/**
 * Notes what the menu on top shows of the business the party is in (the visit's square): a Buy
 * list's wares and prices (`wares`), a trainer's top level (`trainsTo`). Nothing else is read: the
 * screen's own rows and words, as a player reads them.
 */
function look(g: Game, shown: Map<string, Shown>): void {
  const top = g.top, at = g.screens.find((s): s is InteriorScreen => s instanceof InteriorScreen)?.at;
  if (!(top instanceof ChoiceScreen) || !at) return;
  const key = `${g.world.state.mapId}:${at.x},${at.y}`, rows = wares(top), level = trainsTo(top);
  if (rows) shown.set(key, { ...shown.get(key), stock: rows.map((r) => r.id), prices: Object.fromEntries(rows.map((r) => [r.id, r.price])) });
  if (level !== undefined) shown.set(key, { ...shown.get(key), maxLevel: level });
}

/**
 * The wares a shop's Buy list shows, in its order, each with the price it shows: undefined when the
 * menu is not a Buy list (every row but the last an item's name and a price, the last 'Done').
 */
export function wares(c: ChoiceScreen): { id: string; price: number }[] | undefined {
  const rows = c.options, out: { id: string; price: number }[] = [];
  if (rows.length < 2 || rows.at(-1) !== 'Done') return undefined;
  for (const row of rows.slice(0, -1)) {
    const { label, value } = optionParts(row), price = /^(\d+)g$/.exec(value), d = Object.values(ITEMS).find((q) => q.name === label);
    if (!price || !d) return undefined;
    out.push({ id: d.id, price: Number(price[1]) });
  }
  return out;
}

/** The level a trainer's menu says it trains to ("I train to level 6."), or undefined for any other menu. */
export function trainsTo(c: ChoiceScreen): number | undefined {
  const m = /I train to level (\d+)\./.exec(c.words);
  return m ? Number(m[1]) : undefined;
}
