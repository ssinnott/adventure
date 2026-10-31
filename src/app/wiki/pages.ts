// The wiki's pages as data (wiki.html, src/app/wiki/main.ts): the peoples, the classes with their
// traits, prestiges and feats, a member's first numbers for every pairing, the monsters' kinds and the
// bestiary, a section to each area in road order with a card to each def. All of it is read from the
// tables the game plays by (game/party/tables.ts, game/monsters.ts, content/index.ts) and the sums it
// plays them with (createCharacter, armorClass, attackBonus), so a change to a rule is a change to
// the wiki and nothing is written twice. It touches no DOM: main.ts draws it and tools/tests/wiki.ts
// holds it to the tables, an entry to every race, class, trait, prestige, feat, kind and monster.
import {
  RACES, CLASSES, TRAITS, STATS, PRESTIGES, PRESTIGE_LEVELS, PRESTIGE_PRICES, PRESTIGE_POOLS, FEATS_ON,
  createCharacter, armorClass, attackBonus,
  type RaceId, type ClassId, type Stat, type Stats, type Calling,
} from '../../game/party.ts';
import { KINDS, type MonsterDef } from '../../game/monsters.ts';
import { FEATS } from '../../game/combat/feats.ts';
import { abilities, and, noun } from '../../game/bestiary.ts';
import { areaBand } from '../../game/atlas.ts';
import { makeRng } from '../../lib/engine/rng.ts';
import { AREAS, ATLAS, ITEMS, MAP_DEFS, MONSTERS, SPELLS, TABLES } from '../../content/index.ts';

/** A stat's name as the game's screens give it. */
export const STAT_NAME: Readonly<Record<Stat, string>> = {
  might: 'Might', intellect: 'Intellect', personality: 'Personality', endurance: 'Endurance', accuracy: 'Accuracy', speed: 'Speed', luck: 'Luck',
};
/** A number with its sign: `+2`, `−1`, `0`. */
export const signed = (n: number): string => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0');
const item = (id: string): string => ITEMS[id]?.name ?? id;

// ---- The peoples --------------------------------------------------------------------------------

/** A people as the wiki gives it. */
interface Race { id: RaceId; name: string; mods: Stats; resists: string[]; swims: boolean; note: string }

/** Every people in the creation screen's order: what it adds to each stat, what it resists, whether it swims and its line. */
export function races(): Race[] {
  return Object.values(RACES).map((r) => ({
    id: r.id, name: r.name,
    mods: Object.fromEntries(STATS.map((s) => [s, r.mods[s] ?? 0])) as Stats,
    resists: (r.resist ?? []).map(noun), swims: !!r.swim, note: r.blurb,
  }));
}

// ---- The classes --------------------------------------------------------------------------------

/** A prestige: its title, the level it comes at and what it costs, gold or a quest. */
interface Prestige { title: string; level: number; cost: string }
/** A feat: the level it comes at, its name, its stamina and what it does. */
interface Feat { level: number; name: string; cost: number; text: string }
/** A class as the wiki gives it. */
interface Class {
  id: ClassId; name: string; note: string;
  hpDie: number; spDie: number; spStat?: string; spells?: string; attack: number;
  /** The stats it starts on, BASE_STATS's under its own, before its people's. */
  stats: Stats;
  kit: string[];
  traits: { name: string; text: string }[];
  calling: Calling; prestiges: Prestige[];
  /** What each prestige adds to every level from its own on. */
  pools: { hp: number; sp: number };
  feats: Feat[];
}

/** What the class's calling means, as DESIGN §5 has it. */
export const CALLING: Readonly<Record<Calling, string>> = {
  caster: 'a caster: each prestige is a spell rank',
  hybrid: 'a hybrid: each prestige is a spell rank and a perk',
  fighter: 'casts nothing: each prestige is a perk',
};

/** Every class in the creation screen's order: dice, casting, to-hit, stats, kit, traits, prestiges and feats. */
export function classes(): Class[] {
  return Object.values(CLASSES).map((c) => {
    const p = PRESTIGES[c.id], pool = PRESTIGE_POOLS[p.calling];
    return {
      id: c.id, name: c.name, note: c.blurb,
      hpDie: c.hpDie, spDie: c.spDie, spStat: c.spStat && STAT_NAME[c.spStat], spells: c.spells, attack: c.attack,
      stats: Object.fromEntries(STATS.map((s) => [s, c.stats[s] ?? 10])) as Stats,
      kit: c.kit.map(item),
      traits: c.traits.map((t) => ({ name: TRAITS[t].name, text: TRAITS[t].text })),
      calling: p.calling,
      prestiges: p.titles.map((title, i) => ({ title, level: PRESTIGE_LEVELS[i], cost: PRESTIGE_PRICES[i] ? `${PRESTIGE_PRICES[i].toLocaleString('en-GB')} gold` : 'a quest' })),
      pools: { hp: pool[0], sp: pool[1] },
      feats: FEATS.filter((f) => f.cls === c.id).sort((a, b) => a.level - b.level).map((f) => ({ level: f.level, name: f.name, cost: f.cost, text: f.text })),
    };
  });
}

/** Whether the feats are in play yet (FEATS_ON): the wiki says so where it lists them. */
export const featsOn = (): boolean => FEATS_ON;

// ---- The pairings -------------------------------------------------------------------------------

/** A member at level 1 of a people and a class, as the creation screen makes one. */
interface Start { race: RaceId; cls: ClassId; stats: Stats; hp: number; sp: number; ac: number; toHit: number }

/** Every pairing's first numbers, made by createCharacter on the class's stats with its kit worn, as a new game makes them. */
export function starts(): Start[] {
  return Object.values(CLASSES).flatMap((k) => Object.values(RACES).map((r) => {
    const c = createCharacter(TABLES, `${r.name} ${k.name}`, r.id, k.id, k.stats, makeRng(1));
    return { race: r.id, cls: k.id, stats: c.stats, hp: c.maxHp, sp: c.maxSp, ac: armorClass(TABLES.items, c), toHit: attackBonus(TABLES.items, c) };
  }));
}

// ---- The bestiary -------------------------------------------------------------------------------

/** A kind of monster (MONSTERS §2) and what goes for every monster of it. */
interface Kind { id: string; immune: string; resists: string; weak: string; holy: boolean; breaks: string }

const BREAKS: Readonly<Record<string, string>> = { leader: 'when its leader falls', rout: 'once three in four of its group are down', never: 'never' };
const listed = (xs: readonly string[] | undefined): string => (xs?.length ? and(xs.map(noun)) : '');

/** The five kinds: what the whole kind shrugs off, resists and is weak to, whether Holy Strike bites and when it breaks. */
export function kinds(): Kind[] {
  return Object.entries(KINDS).map(([id, k]) => ({ id, immune: listed(k.immune), resists: listed(k.resist), weak: listed(k.weak), holy: k.holy, breaks: BREAKS[k.breaks] ?? k.breaks }));
}

/** A monster's card: its picture's sprite and tint, its numbers, its look, what it does and what it drops. */
export interface Monster {
  id: string; name: string; sprite: MonsterDef['sprite']; tint: string; size: number;
  kind: string; level: number; hp: number; ac: number; toHit: number; blow: string; speed: number; xp: number; gold: string;
  look: string; does: string; drops: { name: string; chance: number }[];
}
/** An area of the bestiary: its name, the levels its maps are tuned for and its monsters. */
interface Area { id: string; name: string; band?: readonly [number, number]; monsters: Monster[] }

/** A def as its card. */
export function monster(d: MonsterDef): Monster {
  return {
    id: d.id, name: d.name, sprite: d.sprite, tint: d.tint, size: d.size,
    kind: d.kind, level: d.level, hp: d.hp, ac: d.ac, toHit: d.attack,
    blow: `${d.dice}d${d.sides}${d.bonus ? signed(d.bonus).replace('−', '-') : ''}`,
    speed: d.speed, xp: d.xp, gold: d.gold[0] === d.gold[1] ? `${d.gold[0]}` : `${d.gold[0]}–${d.gold[1]}`,
    look: d.look ?? '',
    does: abilities(d, { spells: SPELLS, monster: (id) => MONSTERS[id] }),
    drops: (d.drops ?? []).map((x) => ({ name: item(x.item), chance: x.chance })),
  };
}

/** The areas in road order, as content/index.ts lists them, each with its monsters in its monsters.ts's order; an area with none is left out. */
export function bestiary(): Area[] {
  const named = new Map(ATLAS.areas.map((a) => [a.id, a.name]));
  return AREAS.filter((a) => a.monsters.length).map((a) => ({
    id: a.id, name: named.get(a.id) ?? a.id, band: areaBand(ATLAS, MAP_DEFS, a.id), monsters: a.monsters.map(monster),
  }));
}
