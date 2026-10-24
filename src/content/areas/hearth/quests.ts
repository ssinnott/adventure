// Hearth Isle's quests in the journal's words. #56's 57, The Pilgrims in the Bowl (§6 of
// docs/areas/hearth.md), as far as the isle goes (H6, #753): the three pilgrims met in the Bowl and
// a token taken, or none, and its end on the Stair's first landing (#758): a claimant's people there, or the
// rearguard slain where none hold it. #56's 58, A Letter for Gullwick, from the Stair's dead (#758) to
// Gullwick's shore (#765). #56's 56, The Sacristan's Lamps, in the
// temple (#755): the lamps out in the pillar's order and the treasury's key. In the Ways (#757): 59, Every
// Frame She Marked, to the last frame's word on the Stair (#758); 60, Crew Only, From
// the Inside; and 61, The Knocker That Stopped, each answered either way. The Cleric's third, The Eleven
// Kept (#763): the Crowness keeper's log to the anchoress at Anchorhold and the eleven lamps lit in the
// crypt. At the Heart (#759): 64, The Signet, the ring every answer at the panel gives, to where it goes.
// After it, The Walk Home (the road behind, #765): begun on any ending, done on Hild's words at Gullwick.
// How the words are keyed is in src/content/area.ts (`quests`); tools/tests/quests.ts checks every key.
import type { QuestDef } from '../../../game/quests.ts';
import { PILGRIMS, TOKEN_COUSIN, TOKEN_HOLD, TOKEN_TALLIS } from './maps/hearthisle_h6.ts';
import { KEPT_ASKED } from './maps/hearthisle_i6.ts';
import { LAMPS, LAMPS_OUT, LAMPS_WRONG, LAMPS_KEY, PILLARS } from './maps/hearthfane.ts';
import { ELEVEN_KEPT, LOG_GIVEN } from './maps/hearthfane2.ts';
import { CREW_OPEN, CREW_SHUT, CRACK_SEALED, CRACK_WIDE, SIGNET, WENNA_HOME } from './public.ts';
import { KNOT_LAST } from './maps/underdeep2.ts';
import { ENDED } from '../../endings.ts';
import { THRONE_COUSIN, THRONE_HOLD, THRONE_TALLIS } from '../shelf/public.ts';

/** The rearguard on the Stair's first landing, slain: 57's end where no claimant's people hold it (#758). */
const REARGUARD = 'underdeep2:ud2_rearguard';

export const QUESTS: readonly QuestDef[] = [
  {
    // #56's 57, at 28: begun on meeting any of the three; done once a claimant holds the bottom, by the
    // Council's verdict, or by a token carried down to the first landing and its people seen holding it
    // (`ud2_held`, after HELD), or once the company kills the rearguard there itself.
    id: 'bowl_pilgrims',
    title: 'The Pilgrims in the Bowl',
    start: { flag: PILGRIMS },
    done: [{ flag: THRONE_COUSIN }, { flag: THRONE_HOLD }, { flag: THRONE_TALLIS }, { seen: 'underdeep2:ud2_held' }, { slain: REARGUARD }],
    entries: [
      { id: 'met', when: { flag: PILGRIMS }, text: 'Three pilgrims in the Bowl, stranded by the Hand\'s landing: a Warden of the cousin\'s, an elf of the hold\'s, a hand of Tallis\'s. Each wants their token carried down.' },
      { id: 'badge', when: { flag: TOKEN_COUSIN }, text: 'We carry the Wardens\' badge. The cousin\'s people will stand at the bottom.' },
      { id: 'seal', when: { flag: TOKEN_HOLD }, text: 'We carry the hold\'s seal. The hold\'s people will stand at the bottom.' },
      { id: 'tally', when: { flag: TOKEN_TALLIS }, text: 'We carry Tallis\'s tally. Tallis\'s people will stand at the bottom.' },
      { id: 'none', when: { slain: REARGUARD }, text: 'We carried none of them. Whoever stands at the bottom, it is us.' },
    ],
    goals: [
      { when: [{ flag: TOKEN_COUSIN }, { flag: TOKEN_HOLD }, { flag: TOKEN_TALLIS }], text: 'Carry the token down the stair under the temple.', at: 'underdeep2' },
      { when: { flag: PILGRIMS }, text: 'Choose whose token to carry down, or none.', at: 'hearthisle_h6' },
    ],
  },
  {
    // #56's 56, at 28: begun on meeting the sacristan under the vestry's table; done on taking his key.
    id: 'lamps',
    title: 'The Sacristan\'s Lamps',
    start: { flag: LAMPS },
    done: { flag: LAMPS_KEY },
    entries: [
      { id: 'asked', when: { flag: LAMPS }, text: 'The temple\'s sacristan kept its lamps dark for forty years, for the moths. The Hand lit them. He wants them out, in the order the pillar gives.' },
      { id: 'pillar', when: { seen: PILLARS }, text: 'The pillar: FIRST THE SEA. THEN THE SHORE. THEN THE HOUSE. LAST OF ALL THE HEARTH.' },
      { id: 'wrong', when: { flag: LAMPS_WRONG }, text: 'Wrong. The others flared and the nave filled with wings.' },
      { id: 'out', when: { flag: LAMPS_OUT }, text: 'The last wick out, the moths went, all together, out through the court to the light.' },
      { id: 'key', when: { flag: LAMPS_KEY }, text: 'He gave us the treasury\'s key. The grey men\'s gear in there is nobody\'s, he says.' },
    ],
    goals: [
      { when: { flag: LAMPS_OUT }, text: 'Go back to the sacristan under the vestry table.', at: 'hearthfane' },
      { when: { flag: LAMPS }, text: 'Put out the four lamps in the order the pillar gives.', at: 'hearthfane' },
    ],
  },
  {
    // #56's 58, at 29: begun on the letter found under a dead champion's hands on the Stair; done when his
    // mother at Gullwick takes it (`q_letter_given`, the road behind's, #765).
    id: 'letter',
    title: 'A Letter for Gullwick',
    start: { item: 'gullwick_letter' },
    done: { flag: 'q_letter_given' },
    entries: [
      { id: 'letter', when: { item: 'gullwick_letter' }, text: 'A champion of the Hand died on the stair with a letter home under his hands. He was a Gullwick boy, Jowan, and he chose it.' },
      { id: 'given', when: { flag: 'q_letter_given' }, text: 'His mother read it at her door, twice, and went down to the shingle after.' },
    ],
    goals: [
      { when: { item: 'gullwick_letter' }, text: 'Take Jowan\'s letter to his mother at Gullwick, the third house from the slip.', at: 'downs_f3' },
    ],
  },
  {
    // #56's 59, at 30: no giver, her knots found frame by frame. Done on the last frame's word on the Stair
    // (KNOT_LAST, `underdeep2:ud2_word`, #758).
    id: 'frames',
    title: 'Every Frame She Marked',
    start: { seen: 'underdeep:ud_knot1' },
    done: { seen: KNOT_LAST },
    entries: [
      { id: 'first', when: { seen: 'underdeep:ud_knot1' }, text: 'Her knot on the first frame below the crypt, at a girl\'s shoulder. We can follow every one.' },
      { id: 'eighth', when: { seen: 'underdeep:ud_knot8' }, text: 'On the eighth frame the knot is cut deeper, and the wall behind it is thin. We can hear the stair through it.' },
      { id: 'hatch', when: { seen: 'underdeep:ud_hatch' }, text: 'A crawl way behind the frames, a knocker\'s height, down onto the stair below its fights.' },
      { id: 'name', when: { seen: KNOT_LAST }, text: 'On the last frame, not the knot. Her name.' },
    ],
    goals: [
      { when: { seen: 'underdeep:ud_knot8' }, text: 'Follow her knots down to the last frame before the foot of the stair.', at: 'underdeep2' },
      { when: { seen: 'underdeep:ud_knot1' }, text: 'Follow her knots through the ways, frame by frame.', at: 'underdeep' },
    ],
  },
  {
    // #56's 60, at 30: begun at the feet before the door; done on either answer at it, 2,000 experience.
    id: 'crew_only',
    title: 'Crew Only, From the Inside',
    start: { seen: 'underdeep:ud_feet' },
    done: [{ flag: CREW_OPEN }, { flag: CREW_SHUT }],
    entries: [
      { id: 'door', when: { seen: 'underdeep:ud_feet' }, text: 'The door marked CREW ONLY has another side. From here it is only a door, with a bar and a handle.' },
      { id: 'open', when: { flag: CREW_OPEN }, text: 'We opened it onto the Tiefzeche\'s lowest level and left it open. Something came to look.' },
      { id: 'shut', when: { flag: CREW_SHUT }, text: 'We opened it, went through and shut it behind us. A wall with a door drawn on it again.' },
    ],
    goals: [
      { when: { seen: 'underdeep:ud_feet' }, text: 'Open the door marked CREW ONLY from the inside, and decide whether to shut it.', at: 'underdeep' },
    ],
  },
  {
    // #56's 61, at 30: begun at the crack; done on either answer at the knocker, 4,000 experience.
    id: 'crack',
    title: 'The Knocker That Stopped',
    start: { seen: 'underdeep:ud_crack' },
    done: [{ flag: CRACK_SEALED }, { flag: CRACK_WIDE }],
    entries: [
      { id: 'crack', when: { seen: 'underdeep:ud_crack' }, text: 'A deep knocker stands still at a crack in the wall, the first it has found in four hundred years. Through the crack, daylight the colour of glass: the Sunder, from below.' },
      { id: 'sealed', when: { flag: CRACK_SEALED }, text: 'We sealed it with its hammer. Its light went dim, and far above, something stopped coming.' },
      { id: 'wide', when: { flag: CRACK_WIDE }, text: 'We widened it. Behind the wall, a hall the Sunder swallowed, and on its lectern a lamp on a staff, still lit.' },
    ],
    goals: [
      { when: { seen: 'underdeep:ud_crack' }, text: 'The knocker\'s hammer waits at the crack: seal it, or widen it.', at: 'underdeep' },
    ],
  },
  {
    // The Cleric's third, at 27 with the second: begun on the anchoress's ask, or on the log given to her
    // before it (a hand-in takes its item at the first meeting, so either may come first); done once a
    // cleric of the company is an Exarch. The deed is the eleven lamps in the crypt (ELEVEN_KEPT). The
    // log given begins it only for a company with a cleric of 27 with the second, as the ask is said:
    // the hand-in takes the Crowness log from any company, and a goal no one can finish is not shown.
    id: 'eleven_kept',
    title: 'The Eleven Kept',
    start: [{ flag: KEPT_ASKED }, { flag: LOG_GIVEN, member: { cls: 'cleric', level: 27, prestige: 2 } }],
    done: { member: { cls: 'cleric', prestige: 3 } },
    entries: [
      { id: 'asked', when: { flag: KEPT_ASKED }, text: 'The anchoress walled into Anchorhold counted the eleven the night the Queen died, and wants the Crowness keeper\'s log, to see if he counted the same.' },
      { id: 'given', when: { flag: LOG_GIVEN }, text: 'He did. She keeps the book now, and sent us down into the fane\'s crypt to light the eleven lamps there in his gaps, while she keeps the top.' },
      { id: 'kept', when: { flag: ELEVEN_KEPT }, text: 'We lit the eleven in the crypt, a grace between each. On the eleventh the hum changed key, and held.' },
    ],
    goals: [
      { when: { flag: ELEVEN_KEPT }, text: 'Back up to the anchoress\'s window at Anchorhold.', at: 'hearthisle_i6' },
      { when: { flag: LOG_GIVEN }, text: 'Down into the crypt under Hearthfane, and light the eleven lamps as the log has them.', at: 'hearthfane2' },
      { when: { flag: KEPT_ASKED }, text: 'Bring the Crowness keeper\'s log to Hereswith at Anchorhold.', at: 'hearthisle_i6' },
    ],
  },
  {
    // #56's 64, at 32: begun on the ring in the pack, which every answer at the Heart's panel gives (#759);
    // done where it goes, to a claimant by the Council's clerk at Helmstow's gate or into the sea off
    // Gullwick, both the road behind's (#765). The Council's verdicts read the same flags (keep.ts).
    id: 'signet',
    title: 'The Signet',
    start: { item: SIGNET },
    done: [{ flag: 'q_signet_cousin' }, { flag: 'q_signet_hold' }, { flag: 'q_signet_tallis' }, { flag: 'q_signet_sea' }],
    entries: [
      { id: 'ring', when: { item: SIGNET }, text: 'The Queen\'s signet, in our hands. Everyone on the road wanted it, and the one it opened doors for does not.' },
      { id: 'cousin', when: { flag: 'q_signet_cousin' }, text: 'It went to the cousin, in a cloth.' },
      { id: 'hold', when: { flag: 'q_signet_hold' }, text: 'It went to the hold, in a cloth.' },
      { id: 'tallis', when: { flag: 'q_signet_tallis' }, text: 'It went to Tallis, in a cloth.' },
      { id: 'sea', when: { flag: 'q_signet_sea' }, text: 'It went into the sea off Gullwick, where the boat went out. Good, she said.' },
    ],
    goals: [
      { when: { item: SIGNET }, text: 'Where the ring goes: the Council\'s clerk waits at Helmstow\'s gate, and the sea off Gullwick is where the boat went out.', at: 'shelf' },
    ],
  },
  {
    // The Walk Home, at 32: the chapter is done on the choice (§5), so the walk is a quest of its own, begun
    // on any ending and done on Hild's words on Gullwick's shore (`WENNA_HOME`, the road behind's, #765).
    // Its entry at Helmstow's open gate is on the gate's once-event, `gate_open`, the road behind's Helmstow half's.
    id: 'walk_home',
    title: 'The Walk Home',
    start: ENDED,
    done: { flag: WENNA_HOME },
    entries: [
      { id: 'spring', when: ENDED, text: 'In the spring we walk her home to Gullwick, along the coast road.' },
      { id: 'gate', when: { seen: 'shelf:gate_open' }, text: 'Helmstow\'s gate stood open as we passed, and nobody at it said a word about who went through.' },
      { id: 'home', when: { flag: WENNA_HOME }, text: 'Her mother was on the shore where we left her, as if she had never moved. This time, she cried.' },
    ],
    goals: [
      { when: ENDED, text: 'Along the coast road to Gullwick, to the shore where her mother stands.', at: 'downs_f3' },
    ],
  },
];
