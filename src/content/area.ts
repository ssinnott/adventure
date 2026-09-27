// The shape of an area: one step of the road of levels, with everything that is its own. Each lives
// in src/content/areas/<area>/ and is listed once, in road order, in src/content/index.ts.
import type { MapDef } from '../game/map.ts';
import type { MonsterDef } from '../game/monsters.ts';
import type { ItemDef } from '../game/items.ts';
import type { QuestDef } from '../game/quests.ts';
import type { Climate } from '../game/weather.ts';

export interface Area {
  /** Also the region its maps name for their weather (`MapDef.region`). */
  id: string;
  /** Its zone maps, towns and dungeons. A new game starts on the first area's first map. */
  maps: readonly MapDef[];
  /** Its monsters; any area's maps may place them. */
  monsters: readonly MonsterDef[];
  /** The drawings its monsters are drawn with: the MonsterSprite union is made of these. */
  sprites: readonly string[];
  /** Its items; any area's chests, shops and monsters may hold them. */
  items: readonly ItemDef[];
  /** Its side of the quest log, joined in road order. */
  quests: readonly QuestDef[];
  /** The weather its maps share. */
  climate: Climate;
  /** Its businesses' painted rooms: the Interior union is made of these, and src/ui/interior.ts paints each. */
  interiors: readonly string[];
}
