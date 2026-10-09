// Ashfall's side quests, in the journal's words: the third prestiges' quests of the three classes taught
// here (#448; DESIGN §5; §6 of docs/areas/ashfall.md). The Cold Lamp (the old Lightbearer on Old
// Cinder's lip, and the lamp at the bottom of the undercroft), What Nests There (the warlord's heir at
// Grimsforge, and the Brood Drake on its eggs in the iron corridors) and The Seedling (the Archdruid at
// his rock, a seedling from the Grove and the bed under the Ember Stone's lookout). Each is begun by its
// trainer's ask to a member at 27 with the second, which ends that member's seeking (`teaches.asks`);
// its deed done, the trainer teaches (`teaches.done`), and the quest ends with the prestige taught.
// How the words are keyed is in src/content/area.ts (`quests`); tools/tests/quests.ts checks every key.
import type { QuestDef } from '../../../game/quests.ts';
import { LAMP_ASKED, LAMP_LIT } from './maps/old_cinder2.ts';
import { BROOD_ASKED, BROOD } from './maps/firemount_g11.ts';
import { LIT, SEEDLING_ASKED, SEEDLING_TAKEN, SEEDLING_PLANTED } from './maps/ember_stone.ts';

export const QUESTS: readonly QuestDef[] = [
  {
    // The Paladin's: asked on the lip, the lamp lit at the bottom of the walk, and back up to be taught.
    id: 'old_lamp',
    title: 'The Cold Lamp',
    start: { flag: LAMP_ASKED },
    done: { member: { cls: 'paladin', prestige: 3 } },
    entries: [
      { id: 'lip', when: { flag: LAMP_ASKED }, text: 'On Old Cinder\'s lip an old Lightbearer gave us his oil and his flint, for the lamp at the bottom of the buried town.' },
      { id: 'lit', when: { flag: LAMP_LIT }, text: 'At the bottom of the lamp-keeper\'s walk we lit the lamp again, and the walk was lit to the top.' },
    ],
    goals: [
      { when: { flag: LAMP_LIT }, text: 'Climb back up to the old Lightbearer on Old Cinder\'s lip.', at: 'emberwaste_f11' },
      { when: { flag: LAMP_ASKED }, text: 'Go down under Old Cinder, and light the lamp at the bottom.', at: 'old_cinder2' },
    ],
  },
  {
    // The Barbarian's: asked at the anvil, down the vents to the nest off the last corridor, and back.
    id: 'brood',
    title: 'What Nests There',
    start: { flag: BROOD_ASKED },
    done: { member: { cls: 'barbarian', prestige: 3 } },
    entries: [
      { id: 'anvil', when: { flag: BROOD_ASKED }, text: 'At Grimsforge the warlord\'s heir sent us down the vents. Something nests where the iron runs hot, and his grandfather heard it breathe.' },
      { id: 'nest', when: { slain: BROOD }, text: 'In a gallery off the last corridor the Brood Drake died over its eggs.' },
    ],
    goals: [
      { when: { flag: BROOD_ASKED, slain: BROOD }, text: 'Climb back up to the warlord\'s heir at Grimsforge.', at: 'firemount_g11' },
      { when: { flag: BROOD_ASKED }, text: 'Go down Fire Mountain\'s vents to Meridian Camp, and kill what nests there.', at: 'meridian_camp2' },
    ],
  },
  {
    // The Druid's: asked at the rock, the seedling lifted at the Grove, planted in the Stone's bed, kept
    // till the Stone is lit (planted first or after), and back to the rock.
    id: 'seedling',
    title: 'The Seedling',
    start: { flag: SEEDLING_ASKED },
    done: { member: { cls: 'druid', prestige: 3 } },
    entries: [
      { id: 'rock', when: { flag: SEEDLING_ASKED }, text: 'The Archdruid at his rock in the Waste asked for a seedling from the Grove, kept living here till the Ember Stone is lit.' },
      { id: 'grove', when: { flag: SEEDLING_TAKEN }, text: 'Under the Grove\'s oldest oaks we lifted a seedling, roots and earth.' },
      { id: 'bed', when: { flag: SEEDLING_PLANTED }, text: 'We planted it in the bed of earth under the Ember Stone\'s lookout, where the cinders blow in.' },
      { id: 'green', when: { flag: [SEEDLING_PLANTED, LIT] }, text: 'With the Stone lit, the seedling in its bed put out a new leaf, green.' },
    ],
    goals: [
      { when: { flag: [SEEDLING_PLANTED, LIT] }, text: 'Go back to the Archdruid at his rock in the Ember Waste.', at: 'emberwaste_f10' },
      { when: { flag: SEEDLING_PLANTED }, text: 'Keep the seedling living till the Ember Stone is lit.', at: 'ember_stone' },
      { when: { flag: SEEDLING_TAKEN }, text: 'Carry the seedling into the Ember Waste, and plant it where it might live.' },
      { when: { flag: SEEDLING_ASKED }, text: 'Bring a seedling from the Grove, in Thornmark.', at: 'thornmark' },
    ],
  },
];
