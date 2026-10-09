// The Glasswold's quests in the journal's words. Its side quests (§6 of docs/areas/glasswold.md) are
// still their boxes' to build; here first is the Ranger's third prestige's quest (#448), its trainer's
// `asks`, paying nothing but the prestige: Oriel Fane's Map (Aysu, the scout on Kushtash, B8, and the map
// Fane gives at the last of the Meridian Company's camps, under Fire Mountain, taken from the pack).
// How the words are keyed is in src/content/area.ts (`quests`); tools/tests/quests.ts checks every key.
import type { QuestDef } from '../../../game/quests.ts';
import { SCOUT_ASKED, MAP_GIVEN } from './maps/wold_b8.ts';

export const QUESTS: readonly QuestDef[] = [
  {
    // #448, the Ranger's third: Aysu on Kushtash asks a company with a Deadeye of 27. Down the vents from
    // Grimsforge, through the camps to Fane's fire, and his map up the mesa to her; she takes it, and the
    // Lost Expedition stays done on `meridian_map`, which his giving set. Given, she teaches the third.
    id: 'scout_map',
    title: 'Oriel Fane\'s Map',
    start: { flag: SCOUT_ASKED },
    done: { flag: MAP_GIVEN },
    entries: [
      { id: 'asked', when: { flag: SCOUT_ASKED }, text: 'On Kushtash, Aysu, who guided the Meridian Company over the Wold, asked for their mapmaker\'s map. Oriel Fane drew every step they took.' },
      { id: 'fane', when: { flag: 'meridian_map' }, text: 'At the last of the Company\'s camps, under Fire Mountain, Fane gave us his map himself, sewn shut in oilcloth.' },
      { id: 'given', when: { flag: MAP_GIVEN }, text: 'On Kushtash Aysu took the map in both hands, and did not open it.' },
    ],
    goals: [
      { when: { flag: [SCOUT_ASKED, 'meridian_map'] }, text: 'Take Fane\'s map up Kushtash to Aysu.', at: 'wold_b8' },
      { when: { flag: SCOUT_ASKED }, text: 'Follow the Meridian journals down Fire Mountain\'s vents to Meridian Camp, and find Fane\'s map.', at: 'meridian_camp3' },
    ],
  },
];
