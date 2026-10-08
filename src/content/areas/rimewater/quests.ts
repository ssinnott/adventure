// Rimewater's side quests, in the journal's words: #56's five, 40 to 44, each built on its box (#494;
// §6 of docs/areas/rimewater.md). The Coach That Never Came (the coachman at Rime Lodge, and the coach
// on Cairnmoor's N8), The One Who Went Back Down (the man at the foot of the ice-hole), The Bell Under
// the Ice (the lodge woman, and the tower's cap on Loch Fuar's ice), Where the Sky Meets Ice (the
// guide, at the lodge and at the glacier's edge) and The Pilgrims in the Pass (below the high pass's
// mouth); 40's and 43's titles are #56's cut by a word to fit the log's list. #56's 39 ends at the
// lodge, its words Rimewater's and its quest Cairnmoor's. How the words are keyed is in
// src/content/area.ts (`quests`); tools/tests/quests.ts checks every key.
import type { QuestDef } from '../../../game/quests.ts';

export const QUESTS: readonly QuestDef[] = [
  {
    // #56's 40: the coachman at the lodge gives it, or the note from the coach does, brought down before
    // he asks (#43). The sleeper comes down on the lodge's sledge and goes to the Lanterns' hall or the
    // healer's house, which 42 reads.
    id: 'coach',
    title: 'The Coach That Never Came',
    start: [{ flag: 'q_coach' }, { flag: 'q_coach_note' }],
    done: [{ flag: 'q_coach_hall' }, { flag: 'q_coach_temple' }],
    entries: [
      { id: 'late', when: { flag: 'q_coach' }, text: 'The coach for Rime Lodge is two days late over the moor, and the drove road white. Its coachman at the lodge asks us to look for it.' },
      { id: 'coach', when: { flag: 'q_coach_note' }, text: 'The coach stands in the snow on the drove road through the Cairnfield, its coachman dead on the box. By it a man in a healer\'s coat, and a woman under the rugs who does not wake.' },
      { id: 'sledge', when: { flag: 'q_coach_sledge' }, text: 'The coachman read the man\'s note and sent the lodge\'s sledge up the road for the two of them.' },
      { id: 'hall', when: { flag: 'q_coach_hall' }, text: 'She sleeps in the Lanterns\' hall, under the lamps. The man in the healer\'s coat went back up the road alone.' },
      { id: 'temple', when: { flag: 'q_coach_temple' }, text: 'She sleeps in the healer\'s house, by the stone with the cup. The man in the healer\'s coat went back up the road alone.' },
    ],
    goals: [
      { when: { flag: 'q_coach_sledge' }, text: 'Answer the man in the healer\'s coat in the lodge\'s yard: the Lanterns\' hall for her, or the healer\'s house.', at: 'rime_lodge' },
      { when: { flag: 'q_coach_note' }, text: 'Take the note down to the coachman at Rime Lodge.', at: 'rime_lodge' },
      { when: { flag: 'q_coach' }, text: 'Find the coach for the lodge on the drove road over the Cairnfield.', at: 'cairnfield_n8' },
    ],
  },
  {
    // #56's 41: the man at the foot of the ice-hole gives it. Shown Hale's token (#56's 20) or read the
    // names in the clerk's book (27), he says what he saw below, and goes home on the coach or stays at
    // the lodge to tell it.
    id: 'wentback',
    title: 'The One Who Went Back Down',
    start: { flag: 'q_wentback' },
    done: [{ flag: 'q_wentback_home' }, { flag: 'q_wentback_witness' }],
    entries: [
      { id: 'man', when: { flag: 'q_wentback' }, text: 'On the shelf of ice under the hole\'s lip sits a man who came up with the others and went back down for his wife. Something down there counted him and let him go. What he saw, he tells nobody he does not know.' },
      { id: 'door', when: [{ flag: 'q_wentback_home' }, { flag: 'q_wentback_witness' }], text: 'Down there, he says, is a wall with a door in it and no handle. A girl put her hand on it, and it opened for her.' },
      { id: 'home', when: { flag: 'q_wentback_home' }, text: 'He went home on the coach, without her.' },
      { id: 'witness', when: { flag: 'q_wentback_witness' }, text: 'He stays at Rime Lodge, and tells the Lanterns what he saw, and anybody who comes up.' },
    ],
    goals: [
      { when: [{ flag: 'q_wentback', item: 'hale_token' }, { flag: 'q_wentback', seen: 'tide_ship2:ts2_clerk' }], text: 'Answer the man at the hole: home on the coach, or a witness at the lodge.', at: 'longmere_m9' },
      { when: { flag: 'q_wentback' }, text: 'Show the man at the hole you knew the column: Hale\'s token, or a name from the clerk\'s book.', at: 'longmere_m9' },
    ],
  },
  {
    // #56's 42: the lodge woman tells it once the coach's sleeper is placed (40). By night over the pike
    // at the tower's cap the clapper rings the bell, whose Kiln-script a reader reads (#538); the
    // sleeper the Lanterns have wakes at it. She goes out to her people's hearth, or stays. Its id is
    // not `bell` nor its flags `q_bell`, which are the Shelf's (The Bell That Rang Twice).
    id: 'icebell',
    title: 'The Bell Under the Ice',
    start: { flag: 'q_icebell' },
    done: [{ flag: 'q_icebell_out' }, { flag: 'q_icebell_stay' }],
    entries: [
      { id: 'woman', when: { flag: 'q_icebell' }, text: 'A lodge woman by the inn\'s yard fire had her people at Fuar when the loch came up over it. Nobody rang the bell for them. On a still night, she says, it can be reached from the tower\'s cap.' },
      { id: 'rung', when: { flag: 'q_icebell_rung' }, text: 'By night, over the tower\'s cap on Loch Fuar\'s ice, we reached the clapper and rang the bell under the ice.' },
      { id: 'read', when: { seen: 'coldmere_k9:k9_bell' }, text: 'Round the bell\'s lip, in the old script: KEEP THE COLD.' },
      { id: 'out', when: { flag: 'q_icebell_out' }, text: 'She went out to Fuar, to sweep her people\'s hearth above the old bank.' },
      { id: 'stay', when: { flag: 'q_icebell_stay' }, text: 'She stays by the yard\'s fire, watching the door to the ice.' },
    ],
    goals: [
      { when: { flag: 'q_icebell_rung' }, text: 'Answer the lodge woman by the inn\'s yard fire: out to Fuar, or stay.', at: 'rime_lodge' },
      { when: { flag: 'q_icebell' }, text: 'Ring the bell under Loch Fuar\'s ice from the tower\'s cap, on a still night.', at: 'coldmere_k9' },
    ],
  },
  {
    // #56's 43: the guide at the lodge gives it, going up the glacier with a party. Found at its foot,
    // frostbitten, and carried in, she draws the way on the company's map, east into the void (call 7);
    // it ends at the glacier's edge, where the old marks a reader reads put the reach on the world map.
    id: 'sky',
    title: 'Where the Sky Meets Ice',
    start: { flag: 'q_sky' },
    done: { seen: 'longmere_m9:m9_sky' },
    entries: [
      { id: 'guide', when: { flag: 'q_sky' }, text: 'A guide at Rime Lodge went up the glacier with a party, to where they say the sky comes down to the ice.' },
      { id: 'found', when: { flag: 'q_sky_in' }, text: 'We found her at the glacier\'s foot, her fingers black with frost, building a cairn. The sky comes down to the ice up there, she says, and there are stairs in it. Her party went on up them.' },
      { id: 'marked', when: { flag: 'q_sky_marked' }, text: 'By the yard\'s fire she drew the way on our map in charcoal: off the glacier\'s edge, east, into nothing.' },
      { id: 'edge', when: { seen: 'longmere_m9:m9_sky' }, text: 'From the glacier\'s edge we saw it, far up the ice: the sky come down to meet it.' },
    ],
    goals: [
      { when: { flag: 'q_sky_marked' }, text: 'Go to the glacier\'s edge east of Rime Lodge, where her way leaves the map.', at: 'longmere_m9' },
      { when: { flag: 'q_sky_in' }, text: 'Find the guide by the inn\'s yard fire at Rime Lodge.', at: 'rime_lodge' },
      { when: { flag: 'q_sky' }, text: 'Find the guide on the glacier, east of Rime Lodge.', at: 'longmere_m9' },
    ],
  },
  {
    // #56's 44: the pilgrims below the high pass give it. A brother comes down the pass to them (the
    // Whitespine's Brother, MONSTERS §8.1, a person here and no fight); they go up with him, which
    // #445's monastery reads, or back to the lodge.
    id: 'pilgrims',
    title: 'The Pilgrims in the Pass',
    start: { flag: 'q_pilgrims' },
    done: [{ flag: 'q_pilgrims_up' }, { flag: 'q_pilgrims_back' }],
    entries: [
      { id: 'camp', when: { flag: 'q_pilgrims' }, text: 'Pilgrims from Anvilhall, bound for the bells in Monks\' Vale, are snowed in below the high pass, a boy among them dying.' },
      { id: 'brother', when: [{ flag: 'q_pilgrims_up' }, { flag: 'q_pilgrims_back' }], text: 'A brother came down the pass to them in a grey robe and no cloak. He took the blankets off the boy and rubbed snow into his chest.' },
      { id: 'up', when: { flag: 'q_pilgrims_up' }, text: 'They went up into the pass behind the brother, the boy in his arms, singing.' },
      { id: 'back', when: { flag: 'q_pilgrims_back' }, text: 'They carried the boy back down to Rime Lodge. The brother went up the pass alone.' },
    ],
    goals: [
      { when: { flag: 'q_pilgrims' }, text: 'Answer the pilgrims below the high pass: up with the brother, or back to the lodge.', at: 'coldmere_k10' },
    ],
  },
];
