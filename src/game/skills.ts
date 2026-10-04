// The secondary skills (DESIGN §5, §8; #538): a list on each member (`Character.skills`), learnt for
// a price at a hall of the guild that teaches the skill, or from a person who teaches it (`skill`),
// by a company that is a member of that guild ("taught to its members"). A people may be born to one,
// as the dwarves are to Linguist, and an item carried may do one's work (`ItemDef.skill`: a scholar's
// copybook reads as a Linguist does). Linguist is the first built, and reads Kiln-script
// (game/inscriptions.ts); the other eleven come as their shortcuts and secrets do. Pure apart from the
// party handed in, so the tests teach as the game does, without a Game.
import type { GuildId } from '../content/guilds.ts';
import type { Character, Party, RaceId } from './party.ts';
import { isDown, countItem } from './party.ts';
import { rankOf } from './guilds.ts';
import { ITEMS } from '../content/index.ts';

export type SkillId = 'linguist';

export interface SkillDef {
  id: SkillId;
  name: string;
  /** What it does, in a line: the sheet's and the menu's note. */
  text: string;
  /** The guild whose halls teach it, to the guild's members. */
  guild: GuildId;
  /** What a member pays to learn it. */
  price: number;
  /** A people born to it, whose members have it without learning it. */
  race?: RaceId;
}

/**
 * The guild skill price (#434's call 2, #538): a first prestige's (DESIGN §5), a little under a tier 6
 * spell at Lantern Watch (1,280) and an eighth of training six through the Kilns' band (7,920), so
 * that one reader is a purchase and never a toll.
 */
export const SKILL_PRICE = 1000;

export const SKILLS: Readonly<Record<SkillId, SkillDef>> = {
  linguist: { id: 'linguist', name: 'Linguist', text: 'Reads Kiln-script.', guild: 'lanterns', price: SKILL_PRICE, race: 'dwarf' },
};

/** The skills a member has learnt: none in a save from before them. */
export const skillsOf = (c: Pick<Character, 'skills'>): readonly SkillId[] => c.skills ?? [];

/** Whether a member has a skill: learnt, or born to it. */
export const hasSkill = (c: Pick<Character, 'skills' | 'race'>, id: SkillId): boolean => skillsOf(c).includes(id) || SKILLS[id].race === c.race;

/** The skills a member has, learnt or born to, in the table's order: what the sheet lists. */
export const skillNames = (c: Pick<Character, 'skills' | 'race'>): string[] => Object.values(SKILLS).filter((s) => hasSkill(c, s.id)).map((s) => s.name);

/**
 * Who does a skill's work for the company: the first standing member who has it; failing that, while
 * an item that does it is carried (`ItemDef.skill`), the first standing member with one in the pack,
 * else the first standing member. Nobody, if none of that holds.
 */
export function skilled(party: Party, id: SkillId): Character | undefined {
  const up = party.members.filter((m) => !isDown(m));
  const has = up.find((m) => hasSkill(m, id));
  if (has) return has;
  const doers = Object.values(ITEMS).filter((i) => i.skill === id).map((i) => i.id);
  if (!doers.some((it) => countItem(party, it) > 0)) return undefined;
  return up.find((m) => m.pack.some((it) => doers.includes(it))) ?? up[0];
}

/** The skills a guild's halls teach. */
export const taughtBy = (guild: GuildId): SkillId[] => Object.values(SKILLS).filter((s) => s.guild === guild).map((s) => s.id);

/** Whether the company may learn a skill: it is a member of the skill's guild, its first task done (DESIGN §8). */
export const mayLearn = (id: SkillId, party: Party): boolean => rankOf(SKILLS[id].guild, party) > 0;

/** One line of the menu: a member, a skill, its price, and why not, if not. */
export interface SkillOffer { who: number; skill: SkillId; price: number; bar: string }

/** Why a member may not learn a skill, or '' if it may: learnt already, born to it, or the gold short. */
export function skillBar(id: SkillId, c: Character, party: Party): string {
  if (skillsOf(c).includes(id)) return KNOWN;
  if (SKILLS[id].race === c.race) return BORN;
  if (party.gold < SKILLS[id].price) return SHORT;
  return '';
}

/** The menu: every member with every skill taught there, each with its bar. */
export function skillOffers(ids: readonly SkillId[], party: Party): SkillOffer[] {
  return party.members.flatMap((c, who) => ids.map((skill) => ({ who, skill, price: SKILLS[skill].price, bar: skillBar(skill, c, party) })));
}

/** The menu's line for an offer: the member and the skill, the price or why not, and what it does. */
export const skillLine = (o: SkillOffer, party: Party): string => `${party.members[o.who].name}: ${SKILLS[o.skill].name}\t${o.bar || `${o.price}g`}\t${SKILLS[o.skill].text}`;

/** Teach a member a skill: the price paid, the skill on its list. Nothing changes, and false, where it may not. */
export function learn(id: SkillId, party: Party, who: number): { taught: boolean; line: string } {
  const c = party.members[who];
  if (!c || !mayLearn(id, party) || skillBar(id, c, party)) return { taught: false, line: '' };
  party.gold -= SKILLS[id].price;
  c.skills = [...skillsOf(c), id];
  return { taught: true, line: LEARNT(c.name, SKILLS[id].name) };
}

// ---- the words ----

/** Put over the menu, and its way out. */
export const askSkill = (party: Party): string => `"Who would learn?" (${party.gold} gold.)`;
export const LEAVE_SKILLS = 'Leave';
/** What a hall, or a person who teaches, says to a company that is not of its guild. */
export const STRANGER = '"We teach our own. Take the first task, and you are one."';
const KNOWN = 'known';
const BORN = 'born to it';
const SHORT = 'not enough gold';
const LEARNT = (name: string, skill: string): string => `${name} learns ${skill}.`;
