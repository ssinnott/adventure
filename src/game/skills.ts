// The secondary skills (DESIGN §5, §8; #538): a list on each member (`Character.skills`), learnt for
// a price at a hall of the guild that teaches the skill, or from a person who teaches it (`skill`),
// by a company that is a member of that guild ("taught to its members"). A people may be born to one,
// as the dwarves are to Linguist, and an item carried may do one's work (`ItemDef.skill`: a scholar's
// copybook reads as a Linguist does). Linguist is the first built, and reads Kiln-script
// (game/inscriptions.ts); Mountaineer and Swimmer climb and swim (`partyCan`, game/party.ts; #805);
// Perception searches (`World.search`), Spirit Sense and Danger Sense mark the automap (`markedGroups`,
// game/ink.ts) and Arms Master strikes first (`newRound`, game/combat.ts; #856); Cartographer maps a
// square further (`World.reveal`), Pathfinder walks rough ground at the road's pace (`World.move`),
// Lockpick opens an iron lock and keeps the key (`World.unlock`), Merchant sells dearer (`sellPrice`,
// game/items.ts) and Navigator crosses for half (`fareOf`, game/passage.ts; #857). Pure apart from the
// party and the tables handed in, so the tests teach as the game does, without a Game.
import type { GuildId } from '../content/guilds.ts';
import type { Character, Party, RaceId, ClassId } from './party.ts';
import { isDown, countItem } from './party.ts';
import { rankOf } from './ranks.ts';
import type { Items, Tables } from './tables.ts';

export type SkillId = 'linguist' | 'mountaineer' | 'swimmer' | 'perception' | 'spirit_sense' | 'danger_sense' | 'arms_master'
  | 'cartographer' | 'pathfinder' | 'lockpick' | 'merchant' | 'navigator';

export interface SkillDef {
  id: SkillId;
  name: string;
  /** What it does, in a line: the note under it on the menu that teaches it. */
  text: string;
  /** The guild whose halls teach it, to the guild's members. */
  guild: GuildId;
  /** What a member pays to learn it. */
  price: number;
  /** The peoples born to it, whose members have it without learning it. */
  races?: readonly RaceId[];
  /** The classes born to it, as the peoples are. */
  classes?: readonly ClassId[];
}

/**
 * The guild skill price (#434's call 2, #538): a first prestige's (DESIGN §5), a little under a tier 6
 * spell at Lantern Watch (1,280) and an eighth of training six through the Kilns' band (7,920), so
 * that one reader is a purchase and never a toll.
 */
export const SKILL_PRICE = 1000;

export const SKILLS: Readonly<Record<SkillId, SkillDef>> = {
  linguist: { id: 'linguist', name: 'Linguist', text: 'Reads Kiln-script.', guild: 'lanterns', price: SKILL_PRICE, races: ['dwarf'] },
  // No people is born to these two: the Tidefolk swim by their people (`RACES`), not by the skill.
  mountaineer: { id: 'mountaineer', name: 'Mountaineer', text: 'Climbs mountain and cliff.', guild: 'wardens', price: SKILL_PRICE },
  swimmer: { id: 'swimmer', name: 'Swimmer', text: 'Swims deep water.', guild: 'cartographers', price: SKILL_PRICE },
  // #856: the elves and the gnomes are born to Perception (DESIGN §5); nobody to the other three.
  perception: { id: 'perception', name: 'Perception', text: 'Finds hidden doors, even a square off.', guild: 'lanterns', price: SKILL_PRICE, races: ['elf', 'gnome'] },
  spirit_sense: { id: 'spirit_sense', name: 'Spirit Sense', text: 'Senses the dead through walls.', guild: 'lanterns', price: SKILL_PRICE },
  danger_sense: { id: 'danger_sense', name: 'Danger Sense', text: 'Senses what hunts the company.', guild: 'wardens', price: SKILL_PRICE },
  arms_master: { id: 'arms_master', name: 'Arms Master', text: 'The company strikes first.', guild: 'wardens', price: SKILL_PRICE },
  // #857: the Rangers are born to Pathfinder and the Thieves to Lockpick (DESIGN §5); nobody to the other three.
  cartographer: { id: 'cartographer', name: 'Cartographer', text: 'Maps a square further.', guild: 'cartographers', price: SKILL_PRICE },
  pathfinder: { id: 'pathfinder', name: 'Pathfinder', text: 'Walks rough ground at the road\'s pace.', guild: 'cartographers', price: SKILL_PRICE, classes: ['ranger'] },
  lockpick: { id: 'lockpick', name: 'Lockpick', text: 'Picks locks, and keeps the key.', guild: 'compact', price: SKILL_PRICE, classes: ['thief'] },
  merchant: { id: 'merchant', name: 'Merchant', text: 'Sells at two thirds, not half.', guild: 'compact', price: SKILL_PRICE },
  navigator: { id: 'navigator', name: 'Navigator', text: 'Pays half fare on every crossing.', guild: 'compact', price: SKILL_PRICE },
};

/** How far Spirit Sense reaches, in steps (`markedGroups`, game/ink.ts). */
export const SPIRIT_REACH = 8;

/** The skills a member has learnt: none in a save from before them. */
export const skillsOf = (c: Pick<Character, 'skills'>): readonly SkillId[] => c.skills ?? [];

/** Whether a member is born to a skill: of a people or a class that has it unlearnt. */
export const bornTo = (c: Pick<Character, 'race' | 'cls'>, id: SkillId): boolean => !!SKILLS[id].races?.includes(c.race) || !!SKILLS[id].classes?.includes(c.cls);

/** Whether a member has a skill: learnt, or born to it. */
export const hasSkill = (c: Pick<Character, 'skills' | 'race' | 'cls'>, id: SkillId): boolean => skillsOf(c).includes(id) || bornTo(c, id);

/** The skills a member has, learnt or born to, in the table's order: what the sheet lists. */
export const skillNames = (c: Pick<Character, 'skills' | 'race' | 'cls'>): string[] => Object.values(SKILLS).filter((s) => hasSkill(c, s.id)).map((s) => s.name);

/**
 * Who does a skill's work for the company: the first standing member who has it; failing that, while
 * an item that does it is carried (`ItemDef.skill`), the first standing member with one in the pack,
 * else the first standing member. Nobody, if none of that holds.
 */
export function skilled(items: Items, party: Party, id: SkillId): Character | undefined {
  const up = party.members.filter((m) => !isDown(m));
  const has = up.find((m) => hasSkill(m, id));
  if (has) return has;
  const doers = Object.values(items).filter((i) => i.skill === id).map((i) => i.id);
  if (!doers.some((it) => countItem(party, it) > 0)) return undefined;
  return up.find((m) => m.pack.some((it) => doers.includes(it))) ?? up[0];
}

/** The skills a guild's halls teach. */
export const taughtBy = (guild: GuildId): SkillId[] => Object.values(SKILLS).filter((s) => s.guild === guild).map((s) => s.id);

/** Whether the company may learn a skill: it is a member of the skill's guild, its first task done (DESIGN §8). */
export const mayLearn = (tables: Tables, id: SkillId, party: Party): boolean => rankOf(tables, SKILLS[id].guild, party) > 0;

/** One line of the menu's second level: a member, the skill, its price, and why not, if not. */
export interface SkillOffer { who: number; skill: SkillId; price: number; bar: string }

/** Why a member may not learn a skill, or '' if it may: learnt already, born to it, or the gold short. */
export function skillBar(id: SkillId, c: Character, party: Party): string {
  if (skillsOf(c).includes(id)) return KNOWN;
  if (bornTo(c, id)) return BORN;
  if (party.gold < SKILLS[id].price) return SHORT;
  return '';
}

/**
 * The menu is skill-major and two-level (#856): a hall's skills first, a row each with its price and
 * what it does in the note (`skillRow`); then, a skill chosen, who would learn it: its six offers, a
 * member each with the price or why not (`skillLine`).
 */
export const skillRow = (id: SkillId): string => `${SKILLS[id].name}\t${SKILLS[id].price}g\t${SKILLS[id].text}`;

/** A skill's offers: every member, each with its bar. */
export function skillOffers(id: SkillId, party: Party): SkillOffer[] {
  return party.members.map((c, who) => ({ who, skill: id, price: SKILLS[id].price, bar: skillBar(id, c, party) }));
}

/** The second level's line for an offer: the member, and the price or why not. */
export const skillLine = (o: SkillOffer, party: Party): string => `${party.members[o.who].name}\t${o.bar || `${o.price}g`}`;

/** Teach a member a skill: the price paid, the skill on its list. Nothing changes, and false, where it may not. */
export function learn(tables: Tables, id: SkillId, party: Party, who: number): { taught: boolean; line: string } {
  const c = party.members[who];
  if (!c || !mayLearn(tables, id, party) || skillBar(id, c, party)) return { taught: false, line: '' };
  party.gold -= SKILLS[id].price;
  c.skills = [...skillsOf(c), id];
  return { taught: true, line: LEARNT(c.name, SKILLS[id].name) };
}

// ---- the words ----

/** Put over the menu's two levels, and their way out. */
export const askWhich = (party: Party): string => `"Which skill?" (${party.gold} gold.)`;
export const askSkill = (party: Party): string => `"Who would learn?" (${party.gold} gold.)`;
export const LEAVE_SKILLS = 'Leave';
/** What a hall, or a person who teaches, says to a company that is not of its guild. */
export const STRANGER = '"We teach our own. Take the first task, and you are one."';
const KNOWN = 'known';
const BORN = 'born to it';
const SHORT = 'not enough gold';
const LEARNT = (name: string, skill: string): string => `${name} learns ${skill}.`;
