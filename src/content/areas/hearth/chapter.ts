// Hearth Isle's chapter of the one quest, in the journal's words: The Heart (a working title), the twelfth
// and last, Act V's. Over the Sound by the last crossing, from Cinderport's quay with the Glass seen or early;
// the column close on the strand and the hum of the carved lump under Ashcombe; up the cleft into the Bowl
// and the temple at the column's foot, the nave past the Hand's best and the crypt behind the altar, and
// her knot on its grey door; the Ways below the world, her knots on every frame; the Stair, the Hand's dead
// and the thing that caught them, her name on the last frame and the Hand's creed across the last door,
// which asks the road's five; and the Heart: Vask at the panel, his fall, the voice, the ring in our hands
// and the choice, which ends the quest. The walk home is a side quest of its own (§6). content/index.ts
// joins it after the Wold's in road order; how the words are keyed is in src/content/area.ts (`chapter`),
// and tools/tests/quests.ts checks every key. docs/areas/hearth_isle.md §5 and §9 (#760) are its design.
import type { Chapter } from '../../../game/quests.ts';
import { ENDED } from '../../endings.ts';
import { ROAD_EAST } from '../glasswold/maps/wold_d8.ts';
import { STRAND } from './maps/hearthisle_h6.ts';
import { KNOT_LAST } from './maps/underdeep2.ts';
import { VASK_FALLEN, VOICE_WHOLE, RING_GIVEN, END_REIGNITE, END_ARRIVE, END_FINISH } from './maps/core.ts';

export const CHAPTER: Chapter = {
  id: 'heart',
  title: 'The Heart',
  // The Warning done, turned east at Akordu's horse-lines with the Glass seen; or on the isle, for a company
  // that bought the last crossing early.
  start: [{ flag: ROAD_EAST }, { visited: 'hearthisle_h6' }],
  // Any of the three answers she puts at the panel; the quest's own end is said then.
  done: ENDED,
  entries: [
    { id: 'isle', when: { seen: STRAND },
      text: 'Up close the Hearth is no fire. A column of light stands out of the isle into the sky\'s roof, and it hums in our teeth.' },
    { id: 'shard', when: { seen: 'hearthisle_h6:h6_shard' },
      text: 'It is the hum of the carved lump by the tear under Ashcombe, at the very beginning.' },
    { id: 'temple', when: { visited: 'hearthfane' },
      text: 'A temple round the column\'s foot, built by people who thought it a god. The Hand holds it, its best in front.' },
    { id: 'knot', when: { seen: 'hearthfane2:hf2_knot' },
      text: 'On the crypt\'s grey door, at a girl\'s shoulder: a loop inside a loop. She has left us a trail.' },
    { id: 'ways', when: { seen: 'underdeep:ud_in' },
      text: 'Below the crypt the world goes down: corridors clean and humming and lit from nowhere, and her knot on every frame.' },
    { id: 'dead', when: { seen: 'underdeep2:ud2_dead' },
      text: 'The Hand\'s dead lie on the stairs below, where what lives down here caught them. Something is still catching.' },
    { id: 'word', when: { seen: KNOT_LAST },
      text: 'On the last frame, not the knot. A word, scratched hard: WENNA.' },
    { id: 'catcher', when: { slain: 'underdeep2:ud2_catcher' },
      text: 'It caught the Hand on these stairs. It did not catch us.' },
    { id: 'creed', when: { seen: 'underdeep2:ud2_foot' },
      text: 'Across the last door, the Hand\'s last words: PUT OUT THE LIGHT, AND THE DOOR WILL OPEN.' },
    { id: 'door', when: { seen: 'core:core_door' },
      text: 'It did not wait for anyone\'s palm. It opened as we came near, the way a door opens for someone it knows.' },
    { id: 'vask', when: { seen: 'core:core_heart' },
      text: 'Vask at the heart of it, the Queen\'s ring on his finger, her palm held to the glass. Overhead, the light was going out.' },
    { id: 'fallen', when: { flag: VASK_FALLEN },
      text: 'A hard fight, and not a clean one. Vask on his knees, the grey hands gone and her in the middle of it, rubbing her wrist.' },
    { id: 'voice', when: { flag: VOICE_WHOLE },
      text: 'Then the voice, one voice at last. The voyage is over, it said, and has been for four hundred years. Nobody told the crew.' },
    { id: 'ring', when: { flag: RING_GIVEN },
      text: 'She took the ring off his finger and put it in our hands. I\'m not anyone\'s key, she said. You choose.' },
    { id: 'relit', when: { flag: END_REIGNITE },
      text: 'We lit it again. The Hearth stood up out of the sea brighter than anyone living has seen it, and the tears closed like doors at night.' },
    { id: 'opened', when: { flag: END_ARRIVE },
      text: 'We opened the hull. We walked up into daylight the wrong colour, under a sky that does not stop, and felt wind.' },
    { id: 'finished', when: { flag: END_FINISH },
      text: 'We made it finish. The Hearth burns harder than it ever has, and far below, engines woke. Our grandchildren will see it land.' },
  ],
  // A company that comes to the last door early reads `ud2_shut` there, and no goal names it: the goal still
  // says the door, and the journal reads true. The door's goal is the Stair's, where the door stands.
  goals: [
    { when: { flag: RING_GIVEN }, at: 'core', text: 'The ring is in our hands, and the panel at the heart waits under hers. Choose.' },
    { when: { flag: VOICE_WHOLE }, at: 'core', text: 'The girl out of the hole, at the heart\'s panel, with the ring.' },
    { when: { flag: VASK_FALLEN }, at: 'core', text: 'The panel at the heart, and whatever speaks now the Hand is broken.' },
    { when: { seen: 'core:core_door' }, at: 'core', text: 'Into the heart of the Hearth, to Vask at the panel, and stop him.' },
    { when: { slain: 'underdeep2:ud2_catcher' }, at: 'underdeep2', text: 'Through the last door at the stair\'s foot, which opens for whoever made the Stones whole.' },
    { when: { seen: 'underdeep2:ud2_dead' }, at: 'underdeep2', text: 'Down the rest of the stair past the Hand\'s dead, to whatever caught them, and the door at the foot.' },
    { when: { seen: 'underdeep:ud_in' }, at: 'underdeep2', text: 'Through the service ways under the world, following her knots, to the stair that goes down to the heart.' },
    { when: { seen: 'hearthfane2:hf2_knot' }, at: 'underdeep', text: 'Through the grey door she marked, down into the ways below the world.' },
    { when: { visited: 'hearthfane' }, at: 'hearthfane2', text: 'Through the nave past the Hand\'s best, and down the stair behind the altar into the crypt.' },
    // On the isle, by the crossing bought on the road east or early: the goal holds as the boat grounds.
    { when: { visited: 'hearthisle_h6' }, at: 'hearthfane', text: 'Up the cleft through the rim into the Bowl, to Hearthfane, the temple at the column\'s foot.' },
    { when: { flag: ROAD_EAST }, at: 'hearthisle_h6', text: 'East to Cinderport\'s quay, and the last crossing over the Sound to Hearth Isle, where the light stands.' },
  ],
};
