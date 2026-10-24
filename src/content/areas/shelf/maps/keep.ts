// The keep's ward, behind Helmstow's north gatehouse: grey stone and the Queen's blue and gold, the
// keep's great door at the head of the road, the chapel where she lay in state, a walled garden, a
// rookery on the west tower. Vask holds court in the throne room behind the keep's door. Before the
// shut armoury the keep's armourer teaches the Knight's first prestige (#19). Once the Hand has Wenna
// the Council's clerk waits at the chapel's door, and the Council sits on the case once (#764).
import type { Answer, MapDef, Words } from '../../../../game/map.ts';
import type { QuestCond } from '../../../../game/quests.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';
import { ENDED, ENDINGS } from '../../../endings.ts';

// The Empty Throne's end, the Council of Helmstow (#764; docs/areas/hearth_isle.md §6): the case the
// company makes to Wiglaf, and the verdicts. Every verdict but a failed case removes Vask.
export const CASE_COUSIN = 'q_case_cousin', CASE_HOLD = 'q_case_hold', CASE_TALLIS = 'q_case_tallis', CASE_WENNA = 'q_case_wenna', CASE_NOBODY = 'q_case_nobody';
export const THRONE_COUSIN = 'q_throne_cousin', THRONE_HOLD = 'q_throne_hold', THRONE_TALLIS = 'q_throne_tallis', THRONE_WENNA = 'q_throne_wenna', THRONE_COUNCIL = 'q_throne_council';
export const CASE_FAILED = 'q_case_failed', THRONE_REMOVED = 'q_throne_removed';
/** A case made: Wiglaf has written it down. */
export const CASES: readonly QuestCond[] = [CASE_COUSIN, CASE_HOLD, CASE_TALLIS, CASE_WENNA, CASE_NOBODY].map((flag) => ({ flag }));
/** The Council has sat: any of its six verdicts. */
export const SAT: readonly QuestCond[] = [THRONE_COUSIN, THRONE_HOLD, THRONE_TALLIS, THRONE_WENNA, THRONE_COUNCIL, CASE_FAILED].map((flag) => ({ flag }));

// Wenna's three answers at the Heart (#759 sets them): the relit and the finished bring Vask up the stair in irons.
const IRONS: readonly QuestCond[] = [{ flag: ENDINGS.reignite.flag }, { flag: ENDINGS.finish.flag }];
// Once the company is on the isle Vask is at the panel (#765; hearth_isle.md §12): gone from the keep
// with his guards, and his door the empty throne room's until the Council has removed him.
const AWAY: readonly QuestCond[] = [{ flag: THRONE_REMOVED }, { visited: 'hearthisle_h6' }, ...ENDED];
// Once the company has stepped onto the isle, and after an ending: while Vask's steward stands before the door and takes
// the hand-ins Vask took (#795), until the Council has sat and Wiglaf keeps the door. With Vask (`until: AWAY`) and
// Wiglaf (`after: THRONE_REMOVED`) exactly one of the three stands in every state.
const ISLE: readonly QuestCond[] = [{ visited: 'hearthisle_h6' }, ...ENDED];

/** Each list of flags in `a` with each in `b`: a `When` that holds where both do. */
const both = (a: readonly QuestCond[], b: readonly QuestCond[]): QuestCond[] =>
  a.flatMap((x) => b.map((y) => ({ flag: [...[x.flag ?? []].flat(), ...[y.flag ?? []].flat()] })));

/** A case carried: its flag and any two of the claimant's pieces (a piece may be one of several flags), or the signet given to the claimant. */
function carried(made: string, pieces: readonly (readonly string[])[], signet?: string): QuestCond[] {
  const pairs = pieces.flatMap((a, i) => pieces.slice(i + 1).flatMap((b) => a.flatMap((x) => b.map((y) => ({ flag: [made, x, y] })))));
  return signet ? [...pairs, { flag: [made, signet] }] : pairs;
}
// The pieces (§6's table): letters, seals, records and rings found on the road, the pilgrims' tokens (57, #753) and the signet (64, #759).
const COUSIN = carried(CASE_COUSIN, [['q_riders_hale'], ['q_seal_hale'], ['q_well_lanterns'], ['q_token_cousin']], 'q_signet_cousin');
const HOLD = carried(CASE_HOLD, [['q_treaty', 'q_sylvane_treaty'], ['q_ring_elves'], ['q_orders_council'], ['q_token_hold']], 'q_signet_hold');
const TALLIS = carried(CASE_TALLIS, [['q_star_tallis'], ['q_crown_sailed'], ['q_hermit_tallis'], ['q_ring_sold'], ['q_token_tallis']], 'q_signet_tallis');
const WENNA = carried(CASE_WENNA, [['q_wenna_up'], ['q_wentback_witness', 'q_sleepers_seen', 'q_wenna_home']]);
const NOBODY: readonly QuestCond[] = [{ flag: CASE_NOBODY }];
/** A claimant's case that its pieces may not carry: it fails if no carried verdict comes first. */
const CLAIMED = CASES.filter((c) => c.flag !== CASE_NOBODY);

const WIGLAF = [
  'A thin man at the chapel door with a book under his arm and ink on his cuff, who looks at the keep\'s great door the way a man looks at weather.',
  '"Wiglaf. Clerk to the Council of Helmstow, which sits when the Regent lets it and counts on its fingers when he does not. The chair is empty. The Council would settle it tomorrow, if anyone brought it a case it could not refuse."',
  '"A chartered company goes everywhere, and hears everything. Bring the Council what you have heard, and name a claimant, and it will sit on it. Once. It is not brave enough for twice."',
];
const ASK = '"Whose case does the company make?"';
const FOR_COUSIN: Answer = { label: 'The Queen\'s cousin.', sets: CASE_COUSIN, says: ['"The Wardens\' candidate. Blood, which is what the Council likes and the Regent does not." He writes it. "It sits tonight."'] };
const FOR_HOLD: Answer = { label: 'The elves of Henlys.', sets: CASE_HOLD, says: ['"The treaty. The Council has not read it in two hundred years, and the Lanterns have." He writes it. "It sits tonight."'] };
const FOR_TALLIS: Answer = { label: 'Jory Tallis.', sets: CASE_TALLIS, says: ['"The dockmaster. A lineage in one shade of ink, and a hundred and forty hulls." He writes it. "It sits tonight."'] };
const FOR_WENNA: Answer = { label: 'Wenna of Gullwick.', sets: CASE_WENNA, says: ['"A fisher\'s girl." He stops writing. "Whom the Council has heard of, lately, from people who came up out of the ground. It sits tonight, and I do not know what it will say."'] };
const FOR_NOBODY: Answer = { label: 'Nobody.', sets: CASE_NOBODY, says: ['"Nobody. The chair stays empty, under the Council\'s own seal, and the Regent holds it for nobody." He writes that too. "It sits tonight. That is a case, of a kind."'] };

const BY_DAY = { hours: 'day' } as const;
/** Which words the sitting said: its first, or its twin's after an ending that changes them. The log reads them. */
export const EARLY = 'q_council_early', LATE = 'q_council_late';

/** A verdict carried: its first words, and its twin's after the relit or the finished ending. */
const sat = (carry: readonly QuestCond[], verdict: string, text: string): Words[] => [
  { after: carry, until: IRONS, sets: [verdict, THRONE_REMOVED, EARLY], lines: [`${text} The Regent is not in the keep when they come for him.`] },
  { after: both(carry, IRONS), sets: [verdict, THRONE_REMOVED, LATE], lines: [`${text} Vask stands before the Council in irons.`] },
];

export const KEEP: MapDef = {
  id: 'keep',
  name: 'The Keep',
  kind: 'town',
  band: [1, 4],
  region: 'shelf',
  start: { x: 7, y: 8, facing: NORTH },
  rows: [
    '################',
    '###,,######,,###',
    '###,,######,,###',
    '#,,,,######,,,,#',
    '#BBB.##D###.,,,#',
    '#BBB...==...,,,#',
    '#,,,...==..#,,,#',
    '#BBB...==..#,,,#',
    '#BBB,..==..#,,,#',
    '#######==#######',
  ],
  // The Queen's colours: deep blue and gold (the banner's ring), on cool grey stone.
  palette: { wall: '#9aa0a8', wallDark: '#62686f', door: '#3a2a22', banner: '#1f3a7a' },
  // Either side of the keep's door, and either side of the gate as you come in.
  banners: [{ x: 6, y: 4 }, { x: 8, y: 4 }, { x: 6, y: 9 }, { x: 9, y: 9 }],
  exits: [
    { x: 7, y: 9, to: 'harrow', tx: 7, ty: 1, tf: SOUTH, label: 'You pass back under the gatehouse into Helmstow.' },
    { x: 8, y: 9, to: 'harrow', tx: 8, ty: 1, tf: SOUTH, label: 'You pass back under the gatehouse into Helmstow.' },
  ],
  features: [
    { kind: 'sign', x: 9, y: 8, text: 'A proclamation on the gatehouse: the Regent-Warden holds Helmstow in the Crown\'s name until the succession is settled.' },
    // The Council's proclamation (#764): a sign takes no presence, so it is said after the Regent's on
    // its square, every time, as a sign is.
    { kind: 'event', x: 9, y: 8, id: 'proclaimed', after: { flag: THRONE_REMOVED }, text: 'Over it: the Council of Helmstow holds the city under its seal.' },
    // After an ending its twins (#765), on the gatehouse the other side of the gate, since the Regent's sign
    // fills the log there: the opened written as any ending but the other two, so the pair are seen apart.
    { kind: 'event', x: 6, y: 8, id: 'proclaimed_irons', after: IRONS, text: 'A proclamation on the gatehouse: the Council of Helmstow sits in judgement on Aumery Vask, once Regent-Warden, this day and every day until it is done.' },
    { kind: 'event', x: 6, y: 8, id: 'proclaimed_open', after: ENDED, until: IRONS, text: 'A proclamation on the gatehouse, the ink run in the strange light: the Council holds the city, and the gates stand open, since there is nothing now to shut them against.' },
    // Gone once the Council has removed him (#764), his guards with him, or once the company is on the
    // isle or after an ending (#765); his door is the empty throne room's, then the Council's.
    { kind: 'npc', x: 7, y: 4, name: 'Lord Aumery Vask, Regent-Warden', interior: 'throne_room', until: AWAY, lines: [
      'A tall man in Warden grey, his guards a step behind him. He does not wait for you to bow, and does not appear to notice that you did not.',
      '"The Crown has need of a chartered company; the Wardens are stretched thin. A farm past Gullwick, Ashcombe, off the Salt Road, has gone quiet. Find out why. Clear whatever is there."',
      '"Bring me anything you find that is not a rat. Especially anything that glows."',
    ], flag: 'q_ashcombe', quest: [{
      item: 'survey_wand', reward: 300, setFlag: 'q_ashcombe_done',
      early: [
        'A tall man in Warden grey, flanked by guards. His eyes go to the cracked survey wand before they go to you.',
        '"Ashcombe. I meant to hire a company for that." He turns the wand over for a long moment. If he recognises it, nothing in his face says so.',
        '"A Lantern tool. So the Lanterns were there before us. Interesting." He drops it into a pocket. "The Crown pays for work it did not have to ask for."',
        '"There will be more work. The Grove Stone in Thornmark has gone quiet too. Rest, train, and come back to me."',
      ],
      done: [
        'Vask turns the cracked survey wand over in his long fingers, once, and then again. If he knows what he is holding, nothing in his face admits it.',
        '"A Lantern tool. So the Lanterns were at Ashcombe before the Crown was. Interesting." The wand goes into a pocket as if it had always lived there. "You have done what I asked. The Crown pays its debts; you\'ll find it does little else so reliably."',
        '"There will be more work. The Grove Stone in Thornmark has gone quiet too. Rest, train, and come back to me."',
      ],
      after: ['"Thornmark, and the Grove Stone. Go and see why it has gone quiet, and bring me what you find. The road east runs through the Scarth; the Wardens hold it, and always will. The forest is dangerous, whether or not anybody at the pole tells you so. Thornhold will train you further than my drillyard can."'],
    }, {
      // Who Lived at Ashcombe (#77): the tenant's paper, with no after-lines, so the wand's stay his.
      item: 'tenant_paper', reward: 50, setFlag: 'q_paper_vask',
      done: [
        'Vask reads the paper once, and the back of it once, and folds it along its own creases.',
        '"A tenant who let his cellar and did not ask. How very ordinary." He hands it to the guard at his shoulder without looking at him. "Thank you. The Crown pays for this kind of thing, and it will see the matter closed. Ashcombe will have a new tenant by spring."',
      ],
    }], says: [
      // Oil for the Lamp (#67), the keeper's want put to him: said once, and not once the company has lit the lamp itself.
      { after: { flag: 'q_oil_vask' }, until: { flag: 'q_oil_lit' }, sets: ['q_oil_order', 'q_oil_lit'], lines: [
        'Vask hears you out without moving. When you have finished he lets the silence sit a moment, so that you know he has chosen to end it.',
        '"Crowness Light. An order given in the confusion of that week, by a sergeant who mistook thrift for policy. Consider it lifted. The cart goes down on the first of the month, as it always has."',
        '"Tell the keeper the Crown remembers him." He smiles, briefly, the way a man does when a small account closes in his favour. "Was there anything else?"',
      ] },
    ] },
    { kind: 'npc', x: 7, y: 4, name: 'The throne room', interior: 'throne_room', after: AWAY, until: { flag: THRONE_REMOVED }, lines: [
      'The throne room, and the Queen\'s throne at the end of it under its black cloth, with nobody before it.',
    ] },
    // Once the Council has sat he keeps the door, and takes what Vask took (#795), in the Council's name: the wand and the
    // tenant's paper as hand-ins, the keeper's oil as Vask's order, with the same pay and flags.
    { kind: 'npc', x: 7, y: 4, name: 'Wiglaf, at the keep\'s door', interior: 'throne_room', after: { flag: THRONE_REMOVED }, lines: [
      'The keep\'s great door stands open, and Wiglaf at it with his book, keeping the door for the Council as he kept the chapel\'s.',
      '"The Council sat once, as it said it would. It finds it likes the chairs."',
    ], quest: [{
      item: 'survey_wand', reward: 300, setFlag: 'q_ashcombe_done',
      done: [
        'Wiglaf holds the cracked survey wand at arm\'s length, then close, and looks along the crack as along a line of ink.',
        '"A Lantern tool, and a debt in the Regent\'s book against the Crown. The Council keeps the book now." He pays it out of the strongbox, and has it written down before the last coin is on the table.',
        '"There is a line in the book about the Grove Stone in Thornmark. Gone quiet. Someone should ask why." He does not say who.',
      ],
    }, {
      item: 'tenant_paper', reward: 50, setFlag: 'q_paper_vask',
      done: [
        'Wiglaf reads the paper and the back of it, and writes a line in his book before he has finished.',
        '"A tenant who let his cellar and did not ask. The Council will see the matter closed, and Ashcombe will have a new tenant by spring." He looks at what he has written. "It wrote itself."',
      ],
    }], says: [
      { after: { flag: 'q_oil_vask' }, until: { flag: 'q_oil_lit' }, sets: ['q_oil_order', 'q_oil_lit'], lines: [
        'Wiglaf hears you out, and finds the week in the Regent\'s book, and a sergeant\'s paper in it.',
        '"An order given in the confusion of that week. The Council lifts it. The cart goes down on the first of the month, as it always has."',
        '"Tell the keeper the Council remembers him. It has written it down, which for the Council is the same."',
      ] },
    ] },
    // After the relit and the finished endings Vask is in irons before the Council (#765), in the room
    // behind his door, whoever keeps it; and before the door once he is on the isle, his steward.
    { kind: 'npc', x: 7, y: 4, name: 'Aumery Vask, before the Council', after: IRONS, lines: [
      'Through the keep\'s door the hall, and the Council in the Queen\'s chairs, and Vask standing before them in irons with his hands folded. He is answering a question, quietly, and he never once looks up.',
      'A councillor, to the clerk: "Write that he was not wrong about the facts. He will want that written."',
    ] },
    // He takes Vask's three hand-ins from the first step onto the isle (#795), the same items, pay and flags, in his
    // own words: the wand and the tenant's paper as hand-ins, the keeper's oil as Vask's order. He hires nobody, so
    // the wand has no `early` words; they would never be said. Nor has it `after` words: a hand-in's are said to
    // any company whose flag is set, whoever took the item, and would hide his first words from every company
    // that gave the wand to Vask. He stands on after an ending, since the opened leaves nobody else at the door,
    // and goes when the Council has sat, to Wiglaf.
    { kind: 'npc', x: 7, y: 5, name: 'The Regent\'s steward', after: ISLE, until: { flag: THRONE_REMOVED }, lines: [
      'The Regent\'s steward before the throne room\'s door, a ring of keys at his belt and nobody to open anything for.',
      '"His lordship is not in the keep. He went over to the isle with the grey men and left me the keys, and no orders."',
    ], quest: [{
      item: 'survey_wand', reward: 300, setFlag: 'q_ashcombe_done',
      done: [
        'The steward takes the cracked survey wand by the wrong end, and turns it round.',
        '"A Lantern tool, by the look of it. His lordship will want it entered." The Crown\'s strongbox opens on its key, and the gold comes out of it, counted twice.',
        '"He left a line with the keys. The Grove Stone in Thornmark has gone quiet, and he wants to know why. That is all the line says."',
      ],
    }, {
      item: 'tenant_paper', reward: 50, setFlag: 'q_paper_vask',
      done: [
        'The steward reads the paper, turns it over, and reads the back for longer than the front.',
        '"I am not to know what this is." The strongbox opens and shuts. "The Crown pays for this, and will see the matter closed. Ashcombe will have a new tenant by spring."',
      ],
    }], says: [
      { after: { flag: 'q_oil_vask' }, until: { flag: 'q_oil_lit' }, sets: ['q_oil_order', 'q_oil_lit'], lines: [
        'The steward hears you out with the keys shut in his fist, so that they say nothing.',
        '"Crowness Light. An order of that week, a sergeant\'s, on a paper I have seen. Lifted. The cart goes down on the first of the month, as it always has."',
        '"Tell the keeper the Crown remembers him. That is no order. It is only what I would say."',
      ] },
      // After an ending the hall behind him is the Council's, and his first words (the Regent is on the isle) are not true.
      { after: ENDED, lines: [
        'The Regent\'s steward at the throne room\'s door, the keys still at his belt. He has stopped looking up at the windows.',
        '"The Council has the city, they say. Nobody has come for the keys, and nobody has said what they open."',
      ] },
    ] },
    { kind: 'npc', x: 6, y: 5, name: 'Petitioners', lines: [
      'Petitioners wait on the keep\'s steps, caps in hand.',
      'A farmer\'s wife: "Ashcombe has gone quiet. No smoke, no carts. My sister is out there."',
      'A fisherman from Gullwick: "Wreckers on the shore road again, and the Regent says the shore is not his."',
    ] },
    { kind: 'event', x: 4, y: 4, id: 'keep_chapel', once: true, text: 'The keep\'s chapel, where the Queen lay in state. Its door is shut and still hung with black.' },
    { kind: 'npc', x: 2, y: 6, name: 'A mourner', lines: [
      'An old woman in black sits by the chapel wall.',
      '"I dressed her for the chapel. Forty years I served her, and she never once looked at the Hearth without frowning."',
    ] },
    // The Knight's first prestige (#19; DESIGN §5): the armourer at his bench before the shut armoury,
    // whose door and armour wait on an interior.
    { kind: 'npc', x: 4, y: 7, name: 'Wulfric, armourer of the keep', lines: [
      'Under the west wall, a shut building with the Queen\'s arms over its barred shutters, and before it a bench in the open with a man at it, raising a dent out of a breastplate. He keeps the hammer going while you come up.',
      '"Wulfric. Armourer to the Queen, and now to whoever breaks what she paid for, which is the Wardens. That\'s the armoury behind me. The key went to the Regent with everything else, so I work out here."',
      '"A blow rings. A good one rings a while, and a man who stands listening to it is a man standing still. Hit again before it stops. One of you has the makings. Hold this plate and don\'t flinch."',
    ], teaches: { cls: 'knight', prestige: 1, seek: 'Wulfric the armourer, at his bench under the west wall of the keep\'s ward in Helmstow, can make a Knight-Errant of a knight.' } },
    { kind: 'npc', x: 3, y: 2, name: 'The rookery keeper', lines: [
      'A woman with feathers on her sleeves feeds the rooks at the foot of the west tower.',
      '"They come in off the Downs with barrow earth on their feet. The ones I send over the Scarth have stopped coming back."',
    ] },
    { kind: 'well', x: 13, y: 6, text: 'The garden well, walled in with the Queen\'s roses. The water tastes of iron, as the town\'s does.' },
    // The Council's clerk at the chapel's door once the Hand has Wenna (#764), until the case is made:
    // the case for Wenna only to a company she led up (Act III).
    { kind: 'npc', x: 4, y: 6, name: 'Wiglaf, the Council\'s clerk', after: { flag: 'q_wenna_taken' }, until: CASES, flag: 'q_council_met', lines: WIGLAF,
      choice: { ask: ASK, answers: [FOR_COUSIN, FOR_HOLD, FOR_TALLIS, FOR_NOBODY] }, says: [
        { after: { flag: 'q_wenna_up' }, sets: 'q_council_met', lines: WIGLAF, choice: { ask: ASK, answers: [FOR_COUSIN, FOR_HOLD, FOR_TALLIS, FOR_WENNA, FOR_NOBODY] } },
      ] },
    // The Council sits on the case that night, and by day Wiglaf is at the chapel's door with what it
    // found: the first verdict that holds is said and sets its flags, and he is gone with it. A Council
    // that sits after the relit or the finished ending has Vask before it in irons; after any ending a
    // failed case leaves the chair empty. The twin's words set LATE, the first words EARLY, for the log.
    { kind: 'npc', x: 4, y: 5, name: 'Wiglaf, the Council\'s clerk', when: BY_DAY, after: CASES, until: SAT, lines: ['Wiglaf at the chapel door, his book shut, waiting on the Council.'], says: [
      ...sat(COUSIN, THRONE_COUSIN, 'The Council sits in the chapel where she lay in state and reads what you brought. By noon the Wardens wear the old badge.'),
      ...sat(HOLD, THRONE_HOLD, 'The Council reads the treaty aloud for the first time in two hundred years. By evening Sylvane\'s people are in the ward.'),
      ...sat(TALLIS, THRONE_TALLIS, 'The Council counts hulls. Tallis comes up the Salt Road with a hundred Compact hands and his lineage in a case.'),
      ...sat(WENNA, THRONE_WENNA, 'The Council sits a long time, then seals the chair for a girl from Gullwick until she comes to it.'),
      ...sat(NOBODY, THRONE_COUNCIL, 'The Council seals the chair empty under its own seal and holds Helmstow itself.'),
      { after: CLAIMED, until: ENDED, sets: [CASE_FAILED, EARLY], lines: ['The Council sits, and reads what you brought, and is not persuaded. The Regent holds the keep. Wiglaf says it was never brave enough for twice.'] },
      { after: both(CLAIMED, ENDED), sets: [CASE_FAILED, LATE], lines: ['The Council sits, and reads what you brought, and is not persuaded. The chair stays empty. Wiglaf says it was never brave enough for twice.'] },
    ] },
  ],
};
