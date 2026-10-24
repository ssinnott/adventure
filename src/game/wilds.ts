// The wilderness features (EXPANSION §5.3): a shrine or fountain that blesses once, a cairn
// with a cache, a statue that gives for its riddle's answer, typed, and a camp to rest at. A spent
// one is its id in the map's `used`, as an opened chest is, so nothing new is saved. A well and the
// exploration spells are here too (#978). Pure, so the tests load it; game.ts and the spell screen
// call it and say what it returns.
import type { Feature } from './mapdef.ts';
import type { When } from './quests.ts';
import type { Flag } from '../content/index.ts';
import type { World } from './world.ts';
import type { Party, Stat } from './party.ts';
import { rest as restMember, stayNight, isDown } from './party.ts';
import { manhattan } from './types.ts';
import { item } from './items.ts';
import { spell } from './spells.ts';
import { castOnParty } from './combat.ts';
import type { Items } from './tables.ts';

/**
 * What a statue gives for its riddle's answer: gold, items, a stat point to every member or an
 * element kept off every member (game/wilds.ts).
 */
export interface Gift { gold?: number; items?: string[]; stat?: import('./party.ts').Stat; amount?: number; resist?: import('./party.ts').Blessed }

/**
 * A night a camp counts (#730), as an inn counts the flags of its `nights`: a rest there sets `sets`,
 * once `after` holds, and its `says` are said on waking in place of the usual line (game/wilds.ts
 * `campNight`, `restAndWake`).
 */
export interface Night { after?: When; sets: Flag; says?: readonly string[] }

/** The features this module plays. */
export type Wild = Extract<Feature, { kind: 'shrine' | 'fountain' | 'cairn' | 'statue' | 'camp' }>;

/** What a feature gives when it is used: a chest's, cairn's or den's gold and items, a shrine's stat or resistance, a statue's gift. */
export function giftOf(f: Feature): Gift | undefined {
  switch (f.kind) {
    case 'chest': case 'cairn': case 'den': return { gold: f.gold, items: f.items };
    case 'shrine': case 'fountain': return { stat: f.stat, amount: f.amount ?? 1, resist: f.resist };
    case 'statue': return f.gift;
    default: return undefined;
  }
}

/** The id a feature is kept by in `used` once spent: in game/keys.ts with the save's other keys. */
export { spentId } from './keys.ts';

const STAT_NAMES: Record<Stat, string> = { might: 'Might', intellect: 'Intellect', personality: 'Personality', endurance: 'Endurance', accuracy: 'Accuracy', speed: 'Speed', luck: 'Luck' };

/**
 * Hand the party a gift: gold and items to the purse and the bag, and `amount` of `stat` and the
 * element `resist` keeps off to every member, whatever their state, unless it is kept off them for
 * as long already. Returns it in words for the log.
 */
export function give(items: Items, party: Party, gift: Gift): string[] {
  const words: string[] = [];
  if (gift.gold) { party.gold += gift.gold; words.push(`${gift.gold} gold`); }
  for (const id of gift.items ?? []) { party.bag.push(id); words.push(item(items, id).name); }
  if (gift.stat) {
    const n = gift.amount ?? 1;
    for (const m of party.members) m.stats[gift.stat] += n;
    words.push(`${n > 0 ? '+' : ''}${n} ${STAT_NAMES[gift.stat]} to each of the company`);
  }
  if (gift.resist) {
    const { element, until } = gift.resist;
    for (const m of party.members) if (!m.blessed.some((b) => b.element === element && (!b.until || until))) m.blessed.push({ ...gift.resist });
    const kept = `${element} kept off each of the company${until ? ' until the next rest' : ''}`;
    words.push(words.length ? kept : kept[0].toUpperCase() + kept.slice(1));
  }
  return words;
}

/** What the log says as the party steps onto one, before Space. */
export function lookLine(f: Wild): string {
  switch (f.kind) {
    case 'shrine': return 'A shrine. Space kneels.';
    case 'fountain': return 'A fountain. Space drinks.';
    case 'cairn': return 'A cairn. Space lifts its stones.';
    case 'statue': return `${f.text} Space reads the plinth.`;
    case 'camp': return `${f.text} R rests here.`;
  }
}

/** The look as the party steps onto one; '' for one spent, or one not there. */
export const stepLine = (world: World, f: Wild): string => (!world.present(f) || (f.kind !== 'camp' && world.used(f.id)) ? '' : lookLine(f));

/**
 * Kneel at a shrine or drink at a fountain: its blessing to every member the first time, its `done`
 * after. One out of its presence is not there, says nothing and is not spent.
 */
export function useShrine(world: World, party: Party, f: Extract<Wild, { kind: 'shrine' | 'fountain' }>): string[] {
  if (!world.present(f)) return [];
  if (world.used(f.id)) return [f.done];
  world.markUsed(f.id);
  return [f.text, give(world.tables.items, party, giftOf(f)!).join(', ') + '.'];
}

/** Lift a cairn's stones: its cache the first time. */
export function openCairn(world: World, party: Party, f: Extract<Wild, { kind: 'cairn' }>): string[] {
  if (world.used(f.id)) return ['The cairn has been emptied.'];
  world.markUsed(f.id);
  const got = give(world.tables.items, party, giftOf(f)!);
  return [...(f.text ? [f.text] : []), got.length ? `Under the stones: ${got.join(', ')}.` : 'Under the stones: nothing.'];
}

/** The longest answer the riddle's box takes, as typed. */
export const ANSWER_MAX = 16;

/** A typed word as it is compared: letters and spaces only, case-blind, trimmed, spaces single. */
export const normalWord = (s: string): string => s.toLowerCase().replace(/[^a-z ]/g, '').trim().replace(/ +/g, ' ');

/**
 * Answer a statue's riddle. The right word gives its gift and spends it; a wrong one says so and
 * spends nothing, so it may be tried again.
 */
export function answerRiddle(world: World, party: Party, f: Extract<Wild, { kind: 'statue' }>, word: string): { right: boolean; lines: string[] } {
  if (world.used(f.id)) return { right: false, lines: [f.done] };
  if (!normalWord(word) || normalWord(word) !== normalWord(f.answer)) return { right: false, lines: ['The statue is silent.'] };
  world.markUsed(f.id);
  const got = give(world.tables.items, party, f.gift);
  return { right: true, lines: [f.done, ...(got.length ? [`At its feet: ${got.join(', ')}.`] : [])] };
}

/** Whether the party stands at a camp. */
export const atCamp = (world: World): boolean => world.map.featuresAt(world.state.x, world.state.y).some((f) => f.kind === 'camp');

/**
 * Why the party may not rest here, or '' if it may. Nowhere with a group within two squares; at a
 * camp, only with a group next to the party.
 */
export function restRefused(world: World): string {
  const near = atCamp(world) ? 1 : 2;
  const { x, y } = world.state;
  if (world.adjacentGroups().length || world.liveGroups().some((g) => manhattan(g.state.x, g.state.y, x, y) <= near)) return 'Too dangerous to rest here.';
  return '';
}

/** Eight hours' rest, a ration each, every member rested. False, and nothing changes, without the food. */
export function restParty(world: World, party: Party): boolean {
  if (!world.rest()) return false;
  for (const m of party.members) restMember(m);
  return true;
}

/** What is said on waking from a rest that counts no night. */
const MORNING = 'The party rests. Morning comes.';

/**
 * The night a rest where the party stands counts (#730), set, if it counts one: at a camp with `nights`,
 * the first not yet set, once its `after` holds, as an inn's stay sets its own (`stayNight`). A night not
 * yet due keeps the later ones back, so they come in order. None at a camp that counts none, with every
 * night set or with the next not yet due, nor off a camp.
 */
export function campNight(world: World, party: Party): Night | undefined {
  const camp = world.map.featuresAt(world.state.x, world.state.y).find((f): f is Extract<Feature, { kind: 'camp' }> => f.kind === 'camp' && !!f.nights);
  const night = camp?.nights?.find((n) => !party.flags[n.sets]);
  if (!camp || !night || !world.walks(night, camp.x, camp.y)) return undefined;
  stayNight(party, [night.sets]);
  return night;
}

/**
 * Eight hours' rest where the party stands (`restParty`) and the words said on waking: the night's own
 * (`campNight`), as one entry, as a group's answer is said, else the usual morning. Undefined, and
 * nothing changes, without the food.
 */
export function restAndWake(world: World, party: Party): string | undefined {
  if (!restParty(world, party)) return undefined;
  const says = campNight(world, party)?.says;
  return says?.length ? says.join(' ') : MORNING;
}

/** A well: its words and, where it heals, every member not down made whole (#978, out of `Game.interact`). */
export function drinkWell(party: Pick<Party, 'members'>, f: Extract<Feature, { kind: 'well' }>): string[] {
  if (!f.heal) return [f.text];
  for (const m of party.members) if (!isDown(m)) m.hp = m.maxHp;
  return [f.text, 'The party drinks and feels restored.'];
}

/** What an exploration spell did: its lines, and whether it moved the party, which the game answers by meeting what stands there (`Game.enterCell`). */
export interface Explored { lines: string[]; moved: boolean }

/**
 * An exploration spell cast by a member of the company (#978, out of `Game`): the spell points paid and
 * its work done on the world. Waymark sets its mark, or with `back` returns to it, and gives the points
 * back where the mark will not take.
 */
export function castExplore(world: Pick<World, 'tables' | 'state' | 'revealAll' | 'townPortal' | 'bear' | 'setMark' | 'toMark'>, party: Party, casterIndex: number, spellId: string, back = false): Explored {
  const c = party.members[casterIndex];
  const sp = spell(spellId);
  const said = (line: string, moved = false): Explored => ({ lines: [line], moved });
  if (c.sp < sp.sp) return said(`${c.name} lacks the spell points.`);
  c.sp -= sp.sp;
  switch (sp.explore) {
    case 'light': world.state.light = 200; return said(`${c.name} casts ${sp.name}. The way ahead is lit.`);
    case 'wizard_eye': world.revealAll(6); return said(`${c.name} casts ${sp.name}. The map fills in around you.`);
    case 'town_portal': { const name = world.townPortal(); return said(`${c.name} casts ${sp.name}. The world folds, and you stand in ${name}.`, true); }
    case 'walk': world.bear('walk'); return said(`${c.name} casts ${sp.name}. The shallows will bear you a while.`);
    case 'float': world.bear('float'); return said(`${c.name} casts ${sp.name}. Your feet leave the ground.`);
    case 'mark':
      if (back ? world.toMark() : world.setMark()) return said(back ? `${c.name} casts ${sp.name}. The world folds, and you stand at the mark.` : `${c.name} casts ${sp.name}. The ground here is marked.`, back);
      c.sp += sp.sp;
      return said(`${c.name} casts ${sp.name}, but the mark will not take here.`);
    default:
      return said(sp.target === 'party' && (sp.heal || sp.cure) ? castOnParty(world.tables.items, c, sp, party) : `${c.name} casts ${sp.name}.`);
  }
}
