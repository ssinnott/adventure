// The Whitespine's side quests, in the journal's words: #56's four, 45 to 48, each built on its box
// (#506; §6 of docs/areas/whitespine.md). The Novice (the boy in Highcell's last cell, and his mother
// at Anvilhall), The Eagles' Nest (the herder at J11's fold, the nest above the Peak Stone, and the
// badge to Lantern Watch or to Highcell), The Toll (the caravan-master short of the Stair's head, and
// the king's toll) and The Mason's Tally (the deserter in the rocks on Sheer Point, and Cinderport).
// How the words are keyed is in src/content/area.ts (`quests`); tools/tests/quests.ts checks every key.
import type { QuestDef } from '../../../game/quests.ts';
import { NOVICE_TOLD, NOVICE_KEPT } from './maps/monastery.ts';
import { NEST_FOUND, NEST_WATCH, NEST_CELL } from './maps/highspine_i11.ts';
import { STAIR_PASSED, TOLL_DONE } from './maps/highspine_i10.ts';
import { MASON_PASSAGE, MASON_SWAPPED } from './maps/sheerpoint_i8.ts';

export const QUESTS: readonly QuestDef[] = [
  {
    // #56's 45: the novice in the last cell gives it, and his letter; his mother at Anvilhall takes it.
    // Back in his cell, told, he walks out at the gate and home to her; not told, he keeps the fasts.
    id: 'novice',
    title: 'The Novice',
    start: { flag: 'q_novice' },
    done: [{ flag: NOVICE_TOLD }, { flag: NOVICE_KEPT }],
    entries: [
      { id: 'cell', when: { flag: 'q_novice' }, text: 'In the last cell at Highcell a boy in a novice\'s robe keeps the fasts with the brothers. Nobody has said a word to him since the gate.' },
      { id: 'letter', when: { flag: 'q_novice_letter' }, text: 'He gave us a letter for his mother at Anvilhall, sealed with candle wax.' },
      { id: 'read', when: { flag: 'q_novice_home' }, text: 'She read it twice on the terrace step. "Hungry, he says, and all of them fasting. Tell him to come home."' },
      { id: 'told', when: { flag: NOVICE_TOLD }, text: 'We told him. He leaned his broom by the cell door and walked out at the gate, and the brother in it bowed him by.' },
      { id: 'kept', when: { flag: NOVICE_KEPT }, text: 'We told him his mother was well. He went back to his sweeping.' },
    ],
    goals: [
      { when: { flag: 'q_novice_home' }, text: 'Go back up to the novice in the last cell at Highcell.', at: 'monastery' },
      { when: { flag: 'q_novice_letter' }, text: 'Carry the novice\'s letter to his mother at Anvilhall.', at: 'anvilhall' },
      { when: { flag: 'q_novice' }, text: 'Answer the novice in the last cell at Highcell.', at: 'monastery' },
    ],
  },
  {
    // #56's 46: the herder at the fold gives it, or the nest does, opened. The badge in it goes to the
    // Reader at Lantern Watch or to a brother at Highcell, either the end.
    id: 'nest',
    title: 'The Eagles\' Nest',
    start: [{ flag: 'q_nest' }, NEST_FOUND],
    done: [{ flag: NEST_WATCH }, { flag: NEST_CELL }],
    entries: [
      { id: 'herder', when: { flag: 'q_nest' }, text: 'A herder at his fold on the vale\'s east edge loses lambs to the eagles, taken off the hill in broad day.' },
      { id: 'nest', when: NEST_FOUND, text: 'In the eagles\' nest above the Peak Stone, among the bones, a Lantern\'s badge with its pin torn, and a smooth grey part that is not bone.' },
      { id: 'watch', when: { flag: NEST_WATCH }, text: 'The Reader at Lantern Watch wrote in her book, and laid the badge in the fold of the page.' },
      { id: 'cell', when: { flag: NEST_CELL }, text: 'At Highcell a brother in the first cell took the badge, and turned back to the wall with it.' },
    ],
    goals: [
      { when: NEST_FOUND, text: 'Take the Lantern\'s badge to Lantern Watch, or to Highcell.' },
      { when: { flag: 'q_nest' }, text: 'Find where the eagles nest, in the peaks above the Peak Stone.', at: 'highspine_i11' },
    ],
  },
  {
    // #56's 47: the caravan-master short of the Stair's head gives it. The king's toll answered for the
    // company (paid, a part, the coin) or the king fallen, his girl walks down to the wagons.
    id: 'toll',
    title: 'The Toll',
    start: { flag: 'q_toll' },
    done: { flag: TOLL_DONE },
    entries: [
      { id: 'caravan', when: { flag: 'q_toll' }, text: 'A caravan-master short of the Stair\'s head cannot pay the giants\' toll, and their king keeps his girl until it is paid.' },
      { id: 'paid', when: { flag: 'toll_paid' }, text: 'We paid the king his toll in gold, counted twice into his palm.' },
      { id: 'part', when: { flag: 'toll_part' }, text: 'We gave the king a grey part from the nest. "From below," he said, and stood aside.' },
      { id: 'coin', when: { flag: 'toll_coin' }, text: 'We gave the king the coin with no face. He set it with his oldest.' },
      { id: 'fought', when: { slain: 'highspine_i10:i10_king' }, text: 'The king fell on his own stair.' },
      { id: 'down', when: { flag: TOLL_DONE }, text: 'The girl walked down to the wagons on her own feet. Her father would give anything, and we took nothing.' },
    ],
    goals: [
      { when: STAIR_PASSED, text: 'Go back down to the caravan-master at his wagons.', at: 'highspine_i10' },
      { when: { flag: 'q_toll' }, text: 'Answer the Stair-king\'s toll at the Stair\'s head, for the caravan.', at: 'highspine_i10' },
    ],
  },
  {
    // #56's 48: the deserter in the rocks on Sheer Point gives it, and asks: his passage bought, he is
    // at Cinderport; the page swapped, he goes back to the causeway with a count chalked wrong.
    id: 'mason',
    title: 'The Mason\'s Tally',
    start: { flag: 'q_mason' },
    done: [{ flag: MASON_PASSAGE }, { flag: MASON_SWAPPED }],
    entries: [
      { id: 'deserter', when: { flag: 'q_mason' }, text: 'In the rocks at the end of Sheer Point\'s pines a mason hides with the causeway\'s tally. Eleven more, it says, and the road reaches the isle.' },
      { id: 'passage', when: { flag: MASON_PASSAGE }, text: 'We paid his passage over the water to Cinderport. He went down the shore with the tally under his coat.' },
      { id: 'swapped', when: { flag: MASON_SWAPPED }, text: 'He chalked a page short of the true count and went back to the causeway with it. The true page is ours.' },
    ],
    goals: [
      { when: { flag: 'q_mason' }, text: 'Answer the deserter in the rocks on Sheer Point: his passage, or the page.', at: 'sheerpoint_i8' },
    ],
  },
];
