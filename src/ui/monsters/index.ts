// Every monster family's kinds in one record. Each module of this folder that draws monsters registers
// the kinds it draws in its SPRITES (a shared brush, as common.ts, figure.ts and gloss.ts are, registers
// none), and this merges them, as ../interior.ts merges each area's rooms. ../sprites.ts derives FAMILY
// and SPAN from it, the smoke test its DETACHED and tools/changed.ts the monsters a family draws.
import type { MonsterSprite } from '../../game/monsters.ts';
import { AREAS } from '../../content/index.ts';
import type { Sprite } from './common.ts';
import { SPRITES as rat } from './rat.ts';
import { SPRITES as slime } from './slime.ts';
import { SPRITES as wolf } from './wolf.ts';
import { SPRITES as boar } from './boar.ts';
import { SPRITES as spider } from './spider.ts';
import { SPRITES as bandit } from './bandit.ts';
import { SPRITES as cultist } from './cultist.ts';
import { SPRITES as skeleton } from './skeleton.ts';
import { SPRITES as riftling } from './riftling.ts';
import { SPRITES as ogre } from './ogre.ts';
import { SPRITES as wraith } from './wraith.ts';
import { SPRITES as birds } from './birds.ts';
import { SPRITES as oldwood } from './oldwood.ts';
import { SPRITES as longbodies } from './longbodies.ts';
import { SPRITES as toads } from './toads.ts';
import { SPRITES as devilfish } from './devilfish.ts';
import { SPRITES as bears } from './bears.ts';
import { SPRITES as moths } from './moths.ts';
import { SPRITES as knockers } from './knockers.ts';
import { SPRITES as salamanders } from './salamanders.ts';
import { SPRITES as lights } from './lights.ts';
import { SPRITES as keepers } from './keepers.ts';
import { SPRITES as cats } from './cats.ts';
import { SPRITES as giants } from './giants.ts';
import { SPRITES as drakes } from './drakes.ts';
import { SPRITES as machines } from './machines.ts';
import { SPRITES as glasswalkers } from './glasswalkers.ts';
import { SPRITES as crawlers } from './crawlers.ts';

/** The kinds a set of families register between them. */
type Kinds<F> = { [N in keyof F]: keyof F[N] & string }[keyof F];

/**
 * The families' kinds in one record, and the family that registers each, by its module's name. A kind
 * two families register is refused by name (a spread would let the later win), and so is a kind no
 * area names (`named`, the areas' sprites), as content/index.ts refuses a monster defined twice.
 */
export function merge<F extends Record<string, Record<string, Sprite>>>(families: F, named: readonly string[]): { sprites: Record<Kinds<F>, Sprite>; family: Record<Kinds<F>, string> } {
  const sprites: Record<string, Sprite> = {}, family: Record<string, string> = {};
  for (const [name, kinds] of Object.entries(families)) {
    for (const [kind, sprite] of Object.entries(kinds)) {
      if (Object.hasOwn(family, kind)) throw new Error(`monster sprite '${kind}' is registered by ${family[kind]} and ${name}`);
      if (!named.includes(kind)) throw new Error(`monster sprite '${kind}' is registered by ${name}, but no area names it`);
      sprites[kind] = sprite;
      family[kind] = name;
    }
  }
  return { sprites, family } as { sprites: Record<Kinds<F>, Sprite>; family: Record<Kinds<F>, string> };
}

const merged = merge({
  rat, slime, wolf, boar, spider, bandit, cultist, skeleton, riftling, ogre, wraith, birds, oldwood, longbodies,
  toads, devilfish, bears, moths, knockers, salamanders, lights, keepers, cats, giants, drakes, machines, glasswalkers, crawlers,
}, AREAS.flatMap((a) => a.sprites));

/** Each sprite kind's drawer, span and parts drawn apart: a kind no family draws fails the typecheck here. */
export const SPRITES = merged.sprites satisfies Record<MonsterSprite, Sprite>;

/** Which family registers each kind, by its module's name ('boar' for ./boar.ts, the tusker's too). */
export const FAMILY_OF = merged.family satisfies Record<MonsterSprite, string>;
