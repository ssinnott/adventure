// The keep's ward, behind Helmstow's north gatehouse: grey stone and the Queen's blue and gold, the
// keep's great door at the head of the road, the chapel where she lay in state, a walled garden, a
// rookery on the west tower. Vask holds court in the throne room behind the keep's door.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const KEEP: MapDef = {
  id: 'keep',
  name: 'The Keep',
  kind: 'town',
  band: [1, 4],
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
    { kind: 'npc', x: 7, y: 4, name: 'Lord Aumery Vask, Regent-Warden', interior: 'throne_room', lines: [
      'A tall man in Warden grey, his guards a step behind him. He does not wait for you to bow, and does not appear to notice that you did not.',
      '"The Crown has need of a chartered company; the Wardens are stretched thin. A farm south of here, Ashcombe, on the Foreland road, has gone quiet. Find out why. Clear whatever is there."',
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
      after: ['"Thornmark, and the Grove Stone. Go and see why it has gone quiet, and bring me what you find. The road east runs through the Scarth; Captain Hale holds it, and will tell you the forest is dangerous, which it is. Thornhold will train you further than my drillyard can."'],
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
    { kind: 'npc', x: 3, y: 2, name: 'The rookery keeper', lines: [
      'A woman with feathers on her sleeves feeds the rooks at the foot of the west tower.',
      '"They come in off the Downs with barrow earth on their feet. The ones I send over the Scarth have stopped coming back."',
    ] },
    { kind: 'well', x: 13, y: 6, text: 'The garden well, walled in with the Queen\'s roses. The water tastes of iron, as the town\'s does.' },
  ],
};
