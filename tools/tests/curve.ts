// The curve (EXPANSION §5.2), area by area, against its row in src/content/progression.ts: its band
// is the atlas's, three quarters of a clear's xp reaches the next area's floor, a clear's gold
// trains the party through the band, every monster's level sits in its maps' bands, on each map
// the groups' levels rise with walking steps from the way in, the nearest group is near the floor
// and the hardest near the top, and no chest or drop is dearer than the area's window. Entered at
// its floor and three quarters cleared, paid by level, an area leaves a company no more than a
// level over the next floor, unless it is named as passing that. What a row says is owed is
// reported, not failed, until it holds. A map an area lists `outside` is held to its own band and
// its country's window, and what it pays is a figure, counted in no clear; so is an enclave (#845),
// whose band stands over its box's, shown on the fixture lair beside Saltreach. Pay is booked where it
// is paid, and each quest a clear counts that belongs to another area is a figure too, printed.
import { AREAS, ATLAS, MAP_DEFS, MONSTERS, ITEMS } from '../../src/content/index.ts';
import type { RegionId } from '../../src/content/index.ts';
import type { Area } from '../../src/content/area.ts';
import { CURVE, MEMBERS, xpBudget, goldBudget } from '../../src/content/progression.ts';
import type { AreaCurve } from '../../src/content/progression.ts';
import type { MapDef, Feature, EncounterDef, Choice } from '../../src/game/mapdef.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import type { ItemDef } from '../../src/game/items.ts';
import type { QuestDef } from '../../src/game/quests.ts';
import type { GuildQuest } from '../../src/game/guilds.ts';
import { guildName } from '../../src/game/guilds.ts';
import { areaBand, homeMap } from '../../src/game/atlas.ts';
import { giftOf, spentId } from '../../src/game/wilds.ts';
import { handIns, choices } from '../../src/game/people.ts';
import { xpForLevel, killPay, MAX_LEVEL } from '../../src/game/party.ts';
import { FIXTURE, LAIR } from '../kit/rules/enclave.ts';
import { CHECKS, once } from '../kit/checks.ts';
import { ok, owed, withDefs, fxMap, fxKey, fxFlag } from './lib.ts';
import { stepsFrom } from '../kit/rules/curve.ts';

/** Spearman's rank correlation, ties given their mean rank; 0 where either side does not vary. */
function rankCorrelation(a: readonly number[], b: readonly number[]): number {
  const ranks = (v: readonly number[]): number[] => {
    const order = v.map((x, i) => [x, i]).sort((p, q) => p[0] - q[0]); const r = new Array<number>(v.length);
    for (let i = 0; i < order.length;) {
      let j = i; while (j + 1 < order.length && order[j + 1][0] === order[i][0]) j++;
      for (let k = i; k <= j; k++) r[order[k][1]] = (i + j) / 2;
      i = j + 1;
    }
    return r;
  };
  const ra = ranks(a), rb = ranks(b), mean = (v: number[]): number => v.reduce((t, x) => t + x, 0) / v.length;
  const ma = mean(ra), mb = mean(rb);
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < ra.length; i++) { num += (ra[i] - ma) * (rb[i] - mb); da += (ra[i] - ma) ** 2; db += (rb[i] - mb) ** 2; }
  return da && db ? num / Math.sqrt(da * db) : 0;
}

const fmt = (n: number): string => Math.round(n).toLocaleString('en-GB');

/** A figure the curve asks for: passed, or reported while its row says it is owed, above a floor. */
function budget(id: string, what: string, gives: number, needs: number, owing: AreaCurve['owed'], floor: number | undefined): void {
  const msg = `${id}: a clear gives ${fmt(gives)} ${what} of the ${fmt(needs)} the curve asks`;
  if (owing && floor !== undefined) {
    ok(gives >= floor, `${id}: a clear still gives the ${fmt(floor)} ${what} it gave when the shortfall was owed (${fmt(gives)})`);
    owed(gives >= needs, `${msg}; ${owing.why}`, owing.whose);
  } else ok(gives >= needs, msg);
}

/**
 * Areas listed by their first maps whose band the atlas cannot give yet, and whose issue owes it: a
 * zone's band is its built maps' once it has any, so an area with only its first map may read
 * narrower than its row. Reported, not failed, until it holds; then the entry is dropped.
 */
const BAND_OWED: Record<string, string> = {};

/**
 * Whether a map's floor is over its area's band: a later area's country reached from this one, as
 * the Dead-Drop's stair under the Tide Ship is, 26 to 28 in Act II's isle. The pace check places it
 * with that later area (tools/tests/pillars.ts); here it stands outside its area's band and clear,
 * and pays nothing unless its area lists it `outside`.
 */
export const beyond = (d: Pick<MapDef, 'band'>, band: readonly [number, number]): boolean => !!d.band && d.band[0] > band[1];

/**
 * What is wrong with an area's `outside`, the maps that pay outside any area's budget: an id that is
 * none of its maps, or a map that does not stand past its band. Only a map past it may: the deepest
 * levels, which the road never needs.
 */
export function outsideFaults(area: { id: string; maps: readonly Pick<MapDef, 'id' | 'band'>[]; outside?: readonly string[] }, band: readonly [number, number]): string[] {
  return (area.outside ?? []).flatMap((id) => {
    const d = area.maps.find((m) => m.id === id);
    if (!d) return [`${area.id}: ${id}, listed outside its budget, is none of its maps`];
    return beyond(d, band) ? [] : [`${area.id}: ${id}, listed outside its budget, does not stand past its band ${band.join('-')} (${d.band?.join('-') ?? 'none'})`];
  });
}

/**
 * An area's maps as the curve takes them: those its clear counts, in its band; those past its band
 * it lists `outside` its budget; and its enclaves (#845), wherever their bands stand. A map outside
 * and an enclave are each held to their own band and their country's window, and what they pay is a
 * figure, counted in no clear.
 */
export function curveMaps<D extends Pick<MapDef, 'id' | 'band' | 'enclave'>>(maps: readonly D[], band: readonly [number, number], outside: readonly string[] = []): { counted: D[]; apart: D[]; enclaves: D[] } {
  const road = maps.filter((d) => !d.enclave);
  return { counted: road.filter((d) => !beyond(d, band)), apart: road.filter((d) => beyond(d, band) && outside.includes(d.id)), enclaves: maps.filter((d) => !!d.enclave) };
}

/**
 * What is wrong with an area's enclaves (#845): one with no band of its own, one listed `outside`
 * too, one that is a zone map or opens onto no box (`homeMap`), or one whose floor does not stand
 * over its box's band. An enclave is held to its own band because it stands past its box's.
 */
export function enclaveFaults(area: { id: string; maps: readonly MapDef[]; outside?: readonly string[] }, defs: readonly MapDef[]): string[] {
  return area.maps.filter((d) => d.enclave).flatMap((d) => {
    const at = `${area.id}: ${d.id}, an enclave,`, box = d.kind === 'outdoor' ? undefined : homeMap(defs, d.id);
    if (!d.band) return [`${at} has no band of its own`];
    if (area.outside?.includes(d.id)) return [`${at} is listed outside its area's budget too`];
    if (!box) return [`${at} ${d.kind === 'outdoor' ? 'is a zone map' : 'opens onto no box'}, where it is entered from a box`];
    return box.band && d.band[0] > box.band[1] ? [] : [`${at} stands at ${d.band.join('-')}, not over its box ${box.id}'s ${box.band?.join('-') ?? 'none'}`];
  });
}

/** The price window a map past its area's band or an enclave is held to: the last area's on the road whose floor is at or under its own. */
const countryPrice = (road: readonly { id: keyof typeof CURVE }[], floor: number): number => CURVE[road.filter((r) => CURVE[r.id].band[0] <= floor).pop()!.id].price;

/**
 * A map held to its band: every monster's level within two of it, and its groups walked to from its
 * way in, their levels rising with the steps, the nearest near its floor and the hardest near its top.
 */
function heldToBand(d: MapDef): void {
  if (!d.encounters?.length) return;
  const [a, b] = d.band ?? [1, 0];
  // A caller's retinue, the kind it calls, stands in its group at its own level, as the calls it
  // makes do (the tallyman's knockers at the ice-hole, docs/areas/rimewater.md §9, #487): the
  // group's own monsters are the rest, and they set its level.
  const own = (e: { monsters: readonly string[] }): string[] => e.monsters.filter((m) => !e.monsters.some((c) => (MONSTERS[c].calls?.monsters ?? []).some((q) => q === m)));
  const kinds = [...new Set(d.encounters.flatMap(own))];
  const astray = kinds.filter((mid) => { const l = MONSTERS[mid].level; return !(Number.isInteger(l) && l >= 1 && l >= a - 2 && l <= b + 2); });
  ok(!astray.length, `${d.id}: its ${kinds.length} monsters' levels sit in ${a}-${b}, give or take two${astray.length ? `; not ${astray.map((m) => `${m} (${MONSTERS[m].level})`).join(', ')}` : ''}`);
  // Rising: a group's level (its monsters' mean) goes with its walking steps from the way in,
  // the nearest group is near the floor, and the hardest near the top. The hardest need not be
  // the farthest: Thornmark's farthest, the lake, is a middling group.
  const steps = stepsFrom(d);
  const at = d.encounters.map((e) => ({ id: e.id, steps: steps(e.x, e.y), level: own(e).reduce((t, m) => t + MONSTERS[m].level, 0) / own(e).length }));
  const lost = at.filter((g) => !Number.isFinite(g.steps));
  ok(!lost.length, `${d.id}: its ${at.length} groups can be walked to from the way in${lost.length ? `; not ${lost.map((g) => g.id).join(', ')}` : ''}`);
  const walked = at.filter((g) => Number.isFinite(g.steps));
  if (!walked.length) return;
  // A rise needs two groups at different distances; the nearest and hardest cover the rest.
  if (new Set(walked.map((g) => g.steps)).size > 1) {
    const rho = rankCorrelation(walked.map((g) => g.steps), walked.map((g) => g.level));
    ok(rho > 0, `${d.id}: its groups' levels rise from the way in (rank correlation ${rho.toFixed(2)})`);
  }
  const nearest = walked.reduce((p, g) => (g.steps < p.steps ? g : p));
  ok(nearest.level <= a + 2, `${d.id}: the nearest group, ${nearest.id} at ${nearest.steps} steps, is near the floor ${a} (level ${nearest.level.toFixed(1)})`);
  const hardest = walked.reduce((p, g) => (g.level > p.level ? g : p));
  // Near the top is within two of it, but above the floor however narrow the band, save at the cap.
  const top = nearTop(a, b);
  ok(hardest.level >= top, `${d.id}: the hardest group, ${hardest.id} at ${hardest.steps} steps, is near the top ${b} (level ${hardest.level.toFixed(1)}, at least ${top})`);
}

/**
 * What a clear of some maps gives: a member's share of the xp, the gold in cash, the monsters it
 * places in their groups' order, every monster any group of the maps places (the price window holds
 * them all, whichever twin a company meets), its features and a member's share of its quests' xp.
 */
interface Clear { xp: number; gold: number; placed: MonsterDef[]; every: MonsterDef[]; features: Feature[]; quest: number }

/** Two conditions are one when they read the same, as the maps' and pillars' checks read a twin's; a missing one matches nothing. */
const same = (a: unknown, b: unknown): boolean => a !== undefined && JSON.stringify(a) === JSON.stringify(b);

/**
 * The groups a clear fights: every group once, a twin pair once, at the lesser (#792). Twins are two groups
 * alone on a square of a map, one `until` a condition and `leaves` when it holds, the other `after` it, as the
 * Heart's Vask is, whole before the Council has sat and thinned after: the square holds the one or the other,
 * and a clear meets one. The lesser by xp counts, its monsters for xp and gold alike, so that every company's
 * clear meets the budget and not only the lighter's. Else each group counts: ones that merely share a square,
 * or whose conditions differ, or that both stand `after`; an `until` group that stays till it is killed, which
 * a company may meet beside its twin; a third on the square, which makes the clears other sums (an `until` of
 * 2 beside two `after` of 1 and 3 is met as 2 or 4, never 1).
 */
export function clearGroups(maps: readonly Pick<MapDef, 'encounters'>[]): EncounterDef[] {
  const xp = (e: EncounterDef): number => e.monsters.reduce((t, m) => t + MONSTERS[m].xp, 0);
  return maps.flatMap((d) => {
    const groups = d.encounters ?? [];
    // Of each pair the dearer stands aside; on a tie, the `after` one.
    const aside = new Set(groups.flatMap((a) => {
      const square = groups.filter((g) => g.x === a.x && g.y === a.y), b = square.find((g) => g !== a);
      return a.leaves && square.length === 2 && b && same(a.until, b.after) ? [xp(b) < xp(a) ? a : b] : [];
    }));
    return groups.filter((e) => !aside.has(e));
  });
}

/** A question a clear asks: the question, the person who puts it and the map they stand on. */
interface Asked { choice: Choice; who: string; at: Pick<MapDef, 'id' | 'name'> }

/** The questions a clear of these maps asks, each once: one two people share (one person in two places) is counted once, at the first. */
function questionsOf(maps: readonly Pick<MapDef, 'id' | 'name' | 'features'>[]): Asked[] {
  const first = new Map<Choice, Asked>();
  for (const d of maps) for (const f of d.features ?? []) if (f.kind === 'npc') for (const choice of choices(f)) if (!first.has(choice)) first.set(choice, { choice, who: f.name, at: d });
  return [...first.values()];
}

/** A question's pay, whichever way it is answered: of its answers, the least, for each of xp and gold. */
const sureOf = (c: Choice, k: 'xp' | 'gold'): number => Math.min(...c.answers.map((a) => a.pay?.[k] ?? 0));

/** A hand-in a clear counts: its reward, the flag it sets, the person who takes the item and the map they stand on. */
interface Taken { reward: number; setFlag: string; who: string; at: Pick<MapDef, 'id' | 'name'> }

/** The hand-ins a clear of these maps counts, one for each item: of two people who take it, the larger (the first, on a tie). */
function handInsOf(maps: readonly Pick<MapDef, 'id' | 'name' | 'features'>[]): Taken[] {
  const best = new Map<string, Taken>();
  for (const d of maps) for (const f of d.features ?? []) if (f.kind === 'npc') for (const q of handIns(f)) {
    if (q.reward > (best.get(q.item)?.reward ?? -1)) best.set(q.item, { reward: q.reward, setFlag: q.setFlag, who: f.name, at: d });
  }
  return [...best.values()];
}

/**
 * A clear of these maps: every group once, a twin pair once; a member's share of the xp summed; the gold in cash.
 *
 * Pay is booked where it is paid (#728): a question's or a hand-in's in the clear of the area whose map holds the
 * person who pays it, and a guild quest's in the clear of the area whose file holds it, whichever hall pays it. It
 * is never moved to the area whose quest log the quest is in, or whose country its deed lies in, so a quest done
 * in one country and paid in another is counted in the second's clear: the Garden of Glass, the Glasswold's, is
 * paid by the priest at Cinderport's temple and counted in Ashfall's. `crossBooked` reads each such quest from the
 * data and the road prints it.
 */
function clearOf(maps: readonly MapDef[], guild: NonNullable<Area['guilds']> = []): Clear {
  const groups = clearGroups(maps);
  const placed = groups.flatMap((e) => e.monsters.map((m) => MONSTERS[m]));
  const every = maps.flatMap((d) => d.encounters ?? []).flatMap((e) => e.monsters.map((m) => MONSTERS[m]));
  const features = maps.flatMap((d) => d.features ?? []);
  const asked = questionsOf(maps).map((a) => a.choice);
  const sure = (k: 'xp' | 'gold'): number => asked.reduce((t, c) => t + sureOf(c, k), 0);
  const quest = guild.reduce((t, q) => t + (q.pay.xp ?? 0), 0) + sure('xp');
  const xp = Math.floor((placed.reduce((t, m) => t + m.xp, 0) + quest) / MEMBERS);
  const gold = placed.reduce((t, m) => t + (m.gold[0] + m.gold[1]) / 2, 0)
    + features.reduce((t, f) => t + (giftOf(f)?.gold ?? 0), 0) + handInsOf(maps).reduce((t, h) => t + h.reward, 0)
    + guild.reduce((t, q) => t + (q.pay.gold ?? 0), 0) + sure('gold');
  return { xp, gold, placed, every, features, quest: quest / MEMBERS };
}

/** An area as the booking reads it: its maps, its side quests and its chapter of the one quest. */
interface Country { id: string; maps: readonly Pick<MapDef, 'id'>[]; quests: readonly Pick<QuestDef, 'title' | 'done'>[]; chapter?: Pick<QuestDef, 'title' | 'done'> }

/** A name said mid-sentence: "the Glasswold", "a priest of the Harbour Temple". */
const said = (name: string): string => name.replace(/^(The|An?) /, (w) => w.toLowerCase());
/** An area's name, as the atlas has it. */
const areaName = (id: string): string => ATLAS.areas.find((a) => a.id === id)?.name ?? id;
/** The flags a quest is done on. */
const doneOn = (q: Pick<QuestDef, 'done'>): string[] => [q.done ?? []].flat().flatMap((c) => [c.flag ?? []].flat());
/** What a quest books, in the road's words: a member's share of the xp, the gold in cash. */
const pays = (xp: number, gold: number): string => [xp ? `${fmt(xp / MEMBERS)} xp a member` : '', gold ? `${fmt(gold)} gold` : ''].filter(Boolean).join(' and ');

/**
 * What a clear counts of a quest that belongs to another area (#728), one message each: a figure, never a failure.
 * Pay is booked where it is paid (`clearOf`), so these are the quests done in one area's country and paid in
 * another's, read from the data:
 * - a question the clear counts (one that pays whichever way it is answered, as the clear reads it) whose answers
 *   set a flag that another area's quest log, its side quests and its chapter, reads as the quest's `done`: the
 *   Garden of Glass, the Glasswold's, paid by the priest at Cinderport's temple; and a hand-in's reward, which
 *   sets such a flag, in the same way;
 * - a guild quest of the area's file, paid at any hall, whose deed names (`seen`, `slain` or `visited`) a map of
 *   another area. A deed that is a flag or an item names no map and is counted with its file.
 */
function crossBooked(id: string, maps: readonly Pick<MapDef, 'id' | 'name' | 'features'>[], guild: readonly GuildQuest[], world: readonly Country[]): string[] {
  const areaOf = new Map(world.flatMap((a) => a.maps.map((d) => [d.id, a.id] as const)));
  const logs = world.flatMap((a) => [...a.quests, ...(a.chapter ? [a.chapter] : [])].map((quest) => ({ area: a.id, quest })));
  const out: string[] = [];
  const paid = [
    ...questionsOf(maps).map(({ choice, who, at }) => ({ xp: sureOf(choice, 'xp'), gold: sureOf(choice, 'gold'), sets: choice.answers.flatMap((a) => [a.sets ?? []].flat()), who, at })),
    ...handInsOf(maps).map(({ reward, setFlag, who, at }) => ({ xp: 0, gold: reward, sets: [setFlag], who, at })),
  ];
  for (const { xp, gold, sets, who, at } of paid) {
    if (!xp && !gold) continue;
    for (const { area, quest } of logs.filter((l) => l.area !== id && doneOn(l.quest).some((f) => sets.includes(f)))) {
      out.push(`${id}: its clear counts ${said(quest.title)}'s ${pays(xp, gold)}, ${said(areaName(area))}'s quest paid at ${at.name} by ${said(who)}`);
    }
  }
  for (const q of guild) {
    const deeds = [q.goal ?? []].flat().flatMap((c) => [c.seen ?? [], c.slain ?? [], c.visited ?? []].flat().map((ref) => ref.split(':')[0]));
    const away = [...new Set(deeds.flatMap((m) => areaOf.get(m) ?? []))].filter((a) => a !== id);
    if (away.length && (q.pay.xp || q.pay.gold)) {
      out.push(`${id}: its clear counts ${said(q.title)}'s ${pays(q.pay.xp ?? 0, q.pay.gold ?? 0)}, ${guildName(q.guild)}'s quest paid at any hall, its deed in ${away.map((a) => said(areaName(a))).join(' and ')}`);
    }
  }
  return out;
}

/**
 * The level a company of six leaves an area at, as a decimal (19.2 is level 19 and two tenths of
 * the way to 20), entered at its floor and three quarters cleared, paid as the game pays: a kill
 * pays a member a sixth of its xp by its level against the company's (`killPay`), one at a time,
 * the company training as soon as it can; the quests pay theirs fixed, spread evenly through the
 * kills. Chests pay no xp.
 */
export function leaves(floor: number, kills: readonly Pick<MonsterDef, 'xp' | 'level'>[], quest: number): number {
  let xp = xpForLevel(floor), level = floor;
  for (const m of kills) {
    xp += 0.75 * ((m.xp / MEMBERS) * killPay(m.level, level) + quest / kills.length);
    while (level < MAX_LEVEL && xp >= xpForLevel(level + 1)) level++;
  }
  return level < MAX_LEVEL ? level + (xp - xpForLevel(level)) / (xpForLevel(level + 1) - xpForLevel(level)) : level;
}

/** How far over the next floor an area may leave that company: a level (EXPANSION §5.2, #634). */
const LEAD = 1;

const leadSaid = (id: string, left: number, next: number): string =>
  `${id}: entered at its floor and three quarters cleared, paid by level, a company leaves at ${left.toFixed(1)}, ${left < next ? '' : '+'}${(left - next).toFixed(1)} over the next floor ${next}`;

/**
 * What is wrong with the level an area leaves that company at, against the next floor and the
 * figure it is named at: nothing when it holds.
 */
export function leadFault(id: string, left: number, next: number, named?: { level: number }): string | undefined {
  if (!named) return left - next > LEAD ? `${leadSaid(id, left, next)}: more than a level, and its area holds no overRoad` : undefined;
  if (left > named.level) return `${leadSaid(id, left, next)}: past its named ${named.level}, so it grew`;
  return left - next > LEAD ? undefined : `${leadSaid(id, left, next)}: inside the line, so drop its overRoad`;
}

/**
 * The least a map's hardest group may stand at, its monsters' mean: within two of its band's top, and
 * over its floor however narrow the band, save a floor at the cap, which no group can stand over: the
 * Heart, at 32, asks 30, and its one group stands at 31.25 (#745).
 */
export const nearTop = (floor: number, top: number): number => (floor < MAX_LEVEL ? Math.max(floor + 1, top - 2) : top - 2);

/**
 * Whether a find is held to a price window: a weapon, armour or shield with a price, and no artifact.
 * An artifact is past the ladder's top and no window holds it, by its mark alone (`ItemDef.artifact`,
 * #847), never by its price; keys, quest items and consumables are exempt as ever.
 */
export const windowed = (d: ItemDef): boolean => d.slot !== 'none' && d.price > 0 && !d.artifact;

/** The finds of a clear that a price window holds (`windowed`): each with where it is found. */
const heldFinds = ({ every, features }: Clear): { it: string; from: string }[] => [
  ...features.flatMap((f) => (giftOf(f)?.items ?? []).map((it) => ({ it, from: `${f.kind} ${spentId(f)}` }))),
  ...[...new Set(every)].flatMap((m) => (m.drops ?? []).map((x) => ({ it: x.item, from: `${m.id}'s drop` }))),
].filter(({ it }) => windowed(ITEMS[it]));

/**
 * The price window: no weapon, armour or shield in a clear's chests or its monsters' drops dearer
 * than `price`, the monsters of every group, whichever twin a company meets. Keys, quest items,
 * consumables and an artifact are exempt (`windowed`).
 */
function priceWindow(who: string, clear: Clear, price: number): void {
  const found = heldFinds(clear);
  const dearer = found.filter((x) => ITEMS[x.it].price > price);
  for (const x of dearer) ok(false, `${who}: ${x.it} (${ITEMS[x.it].price} gold, ${x.from}) is dearer than its window's ${price}`);
  const dearest = found.reduce((p, x) => (ITEMS[x.it].price > ITEMS[p.it].price ? x : p), found[0]);
  if (!dearer.length && dearest) ok(true, `${who}: its dearest find, ${dearest.it} at ${ITEMS[dearest.it].price} gold, sits in its window (${price})`);
}

export function curve(): void {
  const fx: [number, number] = [12, 14];
  ok(beyond({ band: [26, 28] }, fx) && !beyond({ band: [12, 14] }, fx) && !beyond({ band: [10, 11] }, fx) && !beyond({}, fx),
    'a map whose floor is over its area\'s band stands past it; one in it, under it or with none does not');
  const isle = { id: 'fixture', maps: [{ id: 'fx_shore', band: fx }, { id: 'fx_drop', band: [26, 28] as [number, number] }] };
  ok(!outsideFaults({ ...isle, outside: ['fx_drop'] }, fx).length && outsideFaults({ ...isle, outside: ['fx_shore', 'fx_vault'] }, fx).length === 2,
    'an area may list a map of its own outside its budget where it stands past its band, and not one in its band or none of its maps');
  const climb = (MEMBERS * (xpForLevel(6) - xpForLevel(5))) / 0.75, near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-9;
  ok(near(leaves(5, [{ xp: climb, level: 5 }], 0), 6) && near(leaves(5, [{ xp: 0, level: 9 }], climb / MEMBERS), 6) && near(leaves(5, [{ xp: climb, level: 2 }], 0), 5.1),
    'three quarters of the climb from 5, paid by a kill at the company\'s level or by quests, reaches 6; paid by a kill three under, a tenth of the way');
  ok(!leadFault('fx', 19, 18) && !!leadFault('fx', 19.1, 18), 'an area may leave a company a level over the next floor, and no more unless it is named');
  const named = { level: 19.2 };
  ok(!leadFault('fx', 19.2, 18, named) && !!leadFault('fx', 19.3, 18, named) && !!leadFault('fx', 19, 18, named),
    'a named area may leave it further over, up to its figure, and not past it, nor stay named once inside the line');
  ok(nearTop(32, 32) === 30 && nearTop(31, 32) === 32 && nearTop(28, 29) === 29 && nearTop(20, 20) === 21,
    'a hardest group stands within two of the top and over the floor, however narrow the band, save at the cap: 32 asks 30, where 31-32 asks 32 and 20 asks 21');
  // A twin pair counts once, at the lesser (#792), as the Heart's Vask does, whole before the Council has sat and
  // thinned after. Else each group counts: ones that merely share a square, or whose conditions differ, or that both
  // stand `after`; an `until` group that stays till it is killed; a third on the square.
  const [fxc, fxd] = [{ flag: fxFlag('fx_c') }, { flag: fxFlag('fx_d') }];
  const gone = { until: fxc, leaves: true }, later = { after: fxc };
  const hands = (id: string, n: number, when: Pick<EncounterDef, 'until' | 'after' | 'leaves'> = {}, at: [number, number] = [1, 1]): EncounterDef =>
    ({ id, x: at[0], y: at[1], monsters: Array<string>(n).fill('grey_hand'), ...when });
  const fought = (...groups: EncounterDef[]): string => clearGroups([{ encounters: groups }]).map((g) => g.id).join();
  const twins = (until: number, after: number): EncounterDef[] => [hands('a', until, gone), hands('b', after, later)];
  ok(fought(...twins(3, 2)) === 'b' && fought(...twins(2, 3)) === 'a' && fought(...twins(3, 2).reverse()) === 'b' && fought(...twins(2, 3).reverse()) === 'a',
    'a twin pair is counted once, at the lesser, whether that is the group `until` the condition or the one `after` it, and in whichever order they stand');
  ok(fought(...twins(2, 2)) === 'a' && fought(...twins(2, 2).reverse()) === 'a', 'and a tie keeps the `until` group');
  ok(fought(hands('a', 3), hands('b', 2)) === 'a,b' && fought(hands('a', 3, gone), hands('b', 2, { after: fxd })) === 'a,b'
    && fought(hands('a', 3, later), hands('b', 2, later)) === 'a,b' && fought(hands('a', 3, gone), hands('b', 2, gone)) === 'a,b',
    'two groups that merely share a square are counted both, and so are an `until` beside an `after` another condition, two `after` the same and two `until` it');
  ok(fought(hands('a', 3, gone), hands('b', 2, later, [2, 1])) === 'a,b' && fought(hands('a', 3, gone), hands('b', 2, later, [1, 2])) === 'a,b'
    && clearGroups([{ encounters: [hands('a', 3, gone)] }, { encounters: [hands('b', 2, later)] }]).length === 2,
    'and twins on two squares, one x with two ys among them, or on two maps, are counted both');
  ok(fought(hands('a', 3, { until: fxc }), hands('b', 2, later)) === 'a,b',
    'and so is the pair whose `until` group does not leave, which stays till it is killed and may be met beside its twin');
  ok(fought(hands('a', 2, gone), hands('b', 1, later), hands('c', 3, later)) === 'a,b,c',
    'and three groups on a square, an `until` of 2 beside two `after` of 1 and 3, met as 2 or 4 and never 1, are counted all');
  // Pay is booked where it is paid, and the quests a clear counts that belong to another area are read from the data
  // (#728): a question that pays, whose answers set the flag another area's quest is done on, and a guild quest whose
  // deed names a map of another area. Not a quest of the area's own, a question that pays nothing in some answer (the
  // clear counts the least), nor a guild quest whose deed is a flag, an item or on the area's own maps.
  const ask = (...answers: [xp: number, sets: string][]): Feature => ({ kind: 'npc', x: 1, y: 1, name: 'A priest', lines: ['.'],
    choice: { ask: '?', answers: answers.map(([xp, sets], i) => ({ label: `${i}`, sets: fxFlag(sets), pay: { xp }, says: ['.'] })) } });
  const quest = (title: string, flag: string): Pick<QuestDef, 'title' | 'done'> => ({ title, done: { flag: fxFlag(flag) } });
  const lands: Country[] = [{ id: 'fx_a', maps: [{ id: 'fx_a1' }], quests: [quest('The Home', 'fx_home')] },
    { id: 'fx_b', maps: [{ id: 'fx_b1' }], quests: [quest('The Away', 'fx_away')], chapter: quest('The Road', 'fx_road') }];
  const booked = (...features: Feature[]): string => crossBooked('fx_a', [{ id: 'fx_a1', name: 'Fx Home', features }], [], lands).join('|');
  ok(booked(ask([600, 'fx_away'])) === 'fx_a: its clear counts the Away\'s 100 xp a member, fx_b\'s quest paid at Fx Home by a priest'
    && booked(ask([600, 'fx_road'])).includes('the Road\'s 100 xp a member') && booked(ask([600, 'fx_away'], [900, 'fx_nowhere'])).includes('the Away\'s 100 xp a member'),
    'a question that pays, whose answer sets the flag another area\'s quest (or its chapter) is done on, is counted in the clear of the area whose map holds the person, at the least of its answers');
  const shared = ask([600, 'fx_away']);
  ok(!booked(ask([600, 'fx_home'])) && !booked(ask([0, 'fx_away'])) && !booked(ask([600, 'fx_away'], [0, 'fx_nowhere'])) && booked(shared, shared) === booked(shared),
    'and one for the area\'s own quest, one that pays nothing in some answer, or none at all, is not printed, and one two people share is printed once');
  const take = (reward: number, setFlag: string): Feature => ({ kind: 'npc', x: 1, y: 1, name: 'A priest', lines: ['.'], quest: { item: 'fx_letter', reward, done: ['.'], setFlag: fxFlag(setFlag) } });
  ok(booked(take(500, 'fx_away')) === 'fx_a: its clear counts the Away\'s 500 gold, fx_b\'s quest paid at Fx Home by a priest' && booked(take(300, 'fx_home'), take(500, 'fx_away')) === booked(take(500, 'fx_away'))
    && !booked(take(300, 'fx_away'), take(500, 'fx_home')) && !booked(take(0, 'fx_away')),
    'and so is a hand-in\'s reward, at the larger of two people who take the item, and not a reward of nothing');
  const deed = (goal: GuildQuest['goal'], pay: GuildQuest['pay'] = { xp: 600, gold: 40 }): string =>
    crossBooked('fx_a', [], [{ id: 'fx_q', guild: 'compact', rank: 0, offer: [], goal, paid: [], pay, title: 'The Errand', entries: [], goals: [] }], lands).join('|');
  ok(deed({ seen: fxKey('fx_b1:x') }) === 'fx_a: its clear counts the Errand\'s 100 xp a member and 40 gold, the Salt Compact\'s quest paid at any hall, its deed in fx_b'
    && !!deed({ slain: [fxKey('fx_a1:g'), fxKey('fx_b1:h')] }) && !!deed({ visited: fxMap('fx_b1') }) && !!deed([{ flag: fxFlag('fx_f') }, { seen: fxKey('fx_b1:x') }]),
    'a guild quest whose deed is seen, slain or visited on a map of another area is counted in the clear of the area whose file holds it, with its xp a member and its gold');
  ok(!deed({ seen: fxKey('fx_a1:x') }) && !deed({ flag: fxFlag('fx_f') }) && !deed({ item: 'fx_i' }) && !deed(undefined) && !deed({ seen: fxKey('fx_nowhere:x') }) && !deed({ seen: fxKey('fx_b1:x') }, { items: ['fx_i'] }),
    'and one whose deed is on the area\'s own maps, a flag, an item, none or no map at all, or that pays no xp or gold, is not printed');
  // The road's last area reads its deep places' bands with its zone's (docs/areas/hearth_isle.md §9,
  // call 2): its isle laid at 28-29 reads 28-32 with the Underdeep and the Core, and 28-29 without.
  const laid = { ...ATLAS, zones: ATLAS.zones.map((z) => (z.area === 'hearth' ? { ...z, maps: [{ map: 'fx_isle', at: [0, 0] as const }] } : z)) };
  const strand = [{ ...MAP_DEFS[0], id: 'fx_isle', band: [28, 29] as [number, number] }];
  ok(areaBand(laid, strand, 'hearth')?.join('-') === '28-32' && areaBand({ ...laid, links: laid.links.filter((l) => l.kind !== 'deep') }, strand, 'hearth')?.join('-') === '28-29',
    'an area\'s band widens by the deep places its deep ways lead down to: Hearth Isle laid at 28-29 reads 28-32 with the Underdeep and the Core, 28-29 without');
  // The areas in the atlas's order: an area may be listed before an earlier one is, and its row still
  // follows that one's.
  const order = (id: string): number => ATLAS.areas.find((a) => a.id === id)?.order ?? Infinity;
  const road: readonly { id: RegionId; area?: Area }[] = AREAS.map((a) => ({ id: a.id, area: a as Area })).sort((a, b) => order(a.id) - order(b.id));
  // What a clear falls short of is owed on its row or by its area (`Owes.curve`), not both (#897).
  const owing = (id: string): AreaCurve['owed'] => CURVE[id as RegionId].owed ?? CHECKS.get(id)?.owes?.curve;
  ok(...once('every shortfall is owed once, on its row in CURVE or by its area', AREAS.filter((a) => CURVE[a.id].owed && CHECKS.get(a.id)?.owes?.curve).map((a) => a.id)));
  // An area that leaves a company further over is held by its area (`AreaChecks.overRoad`) at the level
  // it leaves as built, rounded up, as a row's `owed` holds a floor, so that none grows unnoticed; once
  // inside the line, it is dropped.
  const overRoad = (id: string): { level: number; why: string } | undefined => CHECKS.get(id)?.overRoad;
  // The enclave (#845): the fixture lair at the cap beside Saltreach, a band-10 area, leaves Saltreach's
  // curve as it was, its clear (and so its lead and its window) and its band; it is held to its own band
  // and the cap's window, and its pay is a figure. An enclave has a band of its own over its box's, is
  // entered from a box and is not listed outside as well.
  {
    const salt = AREAS.find((a) => a.id === FIXTURE.area)! as Area, row = CURVE[FIXTURE.area], guilds = salt.guilds ?? [];
    const was = curveMaps(salt.maps, row.band, salt.outside), now = curveMaps([...salt.maps, LAIR], row.band, salt.outside);
    const ids = (ds: readonly { id: string }[]): string => ds.map((d) => d.id).join(), before = clearOf(was.counted, guilds), after = clearOf(now.counted, guilds);
    const band = (defs: readonly MapDef[]): string => areaBand(ATLAS, defs, FIXTURE.area)?.join('-') ?? 'none';
    ok(ids(now.counted) === ids(was.counted) && ids(now.apart) === ids(was.apart) && ids(now.enclaves) === LAIR.id && after.xp === before.xp && after.gold === before.gold
      && after.quest === before.quest && band([...MAP_DEFS, LAIR]) === band(MAP_DEFS),
      `the fixture lair at 30-32 leaves Saltreach's curve as it was: its clear gives ${fmt(before.xp)} xp a member and ${fmt(before.gold)} gold with it and without, and its band reads ${band(MAP_DEFS)}`);
    heldToBand(LAIR);
    const price = countryPrice(road, LAIR.band![0]), lair = clearOf([LAIR]);
    ok(price === CURVE.hearth.price && ITEMS.grey_axe.price > row.price,
      `its window is the cap's country's, the Hearth's ${price}, where its find, the Grey Axe at ${ITEMS.grey_axe.price}, is dearer than Saltreach's ${row.price}`);
    priceWindow(LAIR.id, lair, price);
    // No window holds an artifact, by its mark alone (#847): each in the fixture lair's chest is passed by
    // the cap's window, and the same piece unmarked, dearer than every window, is caught by it, but for a
    // thing carried, which no window holds marked or not.
    const arts = Object.values(ITEMS).filter((d) => d.artifact), widest = Math.max(...Object.values(CURVE).map((r) => r.price));
    const twins = arts.map((d): ItemDef => ({ ...d, id: `test_${d.id}_unmarked`, artifact: undefined }));
    const caught = (id: string): string => heldFinds(clearOf([{ ...LAIR, features: (LAIR.features ?? []).map((f) => (f.kind === 'chest' ? { ...f, items: [id] } : f)) }])).filter((x) => ITEMS[x.it].price > price).map((x) => x.it).join();
    withDefs(ITEMS, twins, () => {
      const passed = arts.filter((d) => caught(d.id) === ''), slotted = twins.filter((d) => d.slot !== 'none'), held = slotted.filter((d) => caught(d.id) === d.id);
      ok(arts.length > 0 && passed.length === arts.length && slotted.length > 0 && held.length === slotted.length && arts.every((d) => d.price > widest),
        `no window holds an artifact, by its mark alone: each of the ${arts.length} in ${LAIR.id}'s chest passes its window, the cap's ${fmt(price)}, and each of the ${held.length} with a slot, unmarked, at ${fmt(Math.min(...arts.map((d) => d.price)))} past the widest window's ${fmt(widest)}, is caught by it`);
    });
    ok(true, `${LAIR.id}: as an enclave its ${fmt(lair.xp)} xp a member and ${fmt(lair.gold)} gold are a figure, counted in no clear`);
    const faults = (d: MapDef, outside = salt.outside ?? []): number => enclaveFaults({ id: FIXTURE.area, maps: [...salt.maps, d], outside }, [...MAP_DEFS, d]).length;
    ok(!faults(LAIR) && faults({ ...LAIR, band: undefined }) === 1 && faults({ ...LAIR, band: [11, 13] }) === 1 && faults(LAIR, [fxMap(LAIR.id)]) === 1
      && faults({ ...LAIR, exits: [] }) === 1 && faults({ ...LAIR, kind: 'outdoor' }) === 1,
      'an enclave has a band of its own over its box\'s, opens onto a box and is listed nowhere else: one with no band, at 11-13 by C3\'s 10-11, listed outside too, opening onto nothing or laid as a zone map fails');
  }
  road.forEach(({ id, area }, i) => {
    const row = CURVE[id];
    const [lo, hi] = row.band;
    // A map past the band pays nothing here, unless the area lists it outside its budget: then it is
    // held to its own band and its country's window, and what it pays is counted in no clear. So is
    // an enclave (#845), wherever its band stands.
    const { counted: maps, apart, enclaves } = curveMaps(area?.maps ?? [], row.band, area?.outside);
    for (const d of (area?.maps ?? []).filter((q) => !q.enclave && beyond(q, row.band) && !apart.includes(q))) ok(!d.encounters?.length && !d.features?.some((f) => f.kind === 'chest'), `${id}: ${d.id}, at ${d.band!.join('-')}, stands past its band, a later area's country, and pays nothing here`);
    if (area) for (const f of [...outsideFaults(area, row.band), ...enclaveFaults(area, MAP_DEFS)]) ok(false, f);
    // The band: the atlas's, holding every map's, and the next floor the next area's.
    const atlas = areaBand(ATLAS, MAP_DEFS, id);
    const bandMsg = `${id}: its band ${lo}-${hi} is the atlas's (${atlas?.join('-') ?? 'none'})`, bandHolds = !!atlas && atlas[0] === lo && atlas[1] === hi;
    if (BAND_OWED[id]) owed(bandHolds, bandMsg, BAND_OWED[id]);
    else ok(bandHolds, bandMsg);
    for (const d of maps) ok(!!d.band && d.band[0] >= lo && d.band[1] <= hi, `${id}: ${d.id}'s band ${d.band?.join('-') ?? 'none'} sits in ${lo}-${hi}`);
    const later = road[i + 1];
    const at = order(id);
    // The road's last row has no area after it to take a floor from: its next floor is the cap, which
    // three quarters of its clear must reach (Hearth Isle's, 32: docs/areas/hearth_isle.md §8).
    const last = !later && Number.isFinite(at) && !ATLAS.areas.some((a) => a.order > at);
    const next = later ? CURVE[later.id].band[0] : last ? MAX_LEVEL : ATLAS.areas.find((a) => a.order === at + 1)?.band?.[0];
    ok(row.next === next, `${id}: the next floor, ${row.next}, is ${last ? 'the cap, no area coming after it' : 'the next area\'s'} (${next ?? 'none'})`);
    if (later) ok(order(later.id) === at + 1, `${id}: ${later.id}, its next row, is the atlas's next area`);

    // What a clear gives: every group once (a twin pair at the lesser), a member's share of the xp summed; the
    // gold in cash. The area's guild quests pay too, counted with the area whose file holds them.
    const clear = clearOf(maps, area?.guilds ?? []);
    const owes = owing(id);
    budget(id, 'xp a member', clear.xp, xpBudget(row), owes, owes?.xp);
    budget(id, 'gold', Math.floor(clear.gold), goldBudget(row), owes, owes?.gold);
    // The lead over the road (#634): the level that clear leaves a company at, paid by level,
    // against the next floor and, for an area held over the road (`overRoad`), its figure.
    if (area) {
      const left = leaves(lo, clear.placed, clear.quest), held = overRoad(id), fault = leadFault(id, left, row.next, held);
      ok(!fault, fault ?? `${leadSaid(id, left, row.next)}${held ? `, a named exception held at ${held.level}: ${held.why}` : ''}`);
      // Pay is booked where it is paid (#728): what this clear counts of a quest that belongs to another area, by its
      // quest log or its deed, is a figure, printed and never a failure.
      for (const line of crossBooked(id, maps, area.guilds ?? [], AREAS)) ok(true, line);
    }
    // What the maps outside give is a figure, never a failure: no clear counts it, and no one owes
    // it, for they are the deepest levels, which the road never needs.
    if (apart.length) {
      const out = clearOf(apart);
      ok(true, `${id}: outside its budget, ${apart.map((d) => d.id).join(', ')} give ${fmt(out.xp)} xp a member and ${fmt(out.gold)} gold, counted in no clear`);
    }
    if (enclaves.length) {
      const out = clearOf(enclaves);
      ok(true, `${id}: its enclaves, ${enclaves.map((d) => d.id).join(', ')}, give ${fmt(out.xp)} xp a member and ${fmt(out.gold)} gold, counted in no clear`);
    }

    // Every monster's level: at least 1, and within two of the band of every map that places it, a
    // map outside the budget or an enclave its own.
    for (const d of [...maps, ...apart, ...enclaves]) heldToBand(d);

    // The price window, the row's. A map outside the budget or an enclave is held to its country's: the
    // window of the last area on the road whose floor is at or under its own, as the pace check places it.
    priceWindow(id, clear, row.price);
    for (const d of [...apart, ...enclaves]) if (d.band) priceWindow(d.id, clearOf([d]), countryPrice(road, d.band[0]));
    // The window never narrows along the road.
    const before = road[i - 1];
    if (before) ok(row.price >= CURVE[before.id].price, `${id}: its window, ${row.price}, is no narrower than ${before.id}'s (${CURVE[before.id].price})`);
  });
}
