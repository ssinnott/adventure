// The Glasswold's quests in the journal's words. Its side quests, #56's four (§6 of docs/areas/glasswold.md,
// #532), each paying its xp whichever way it goes: The Horse That Came Back (Cador Lusk at Cinderport's
// Chart House, and the Rider with a hammer by the tethered horse at Akordu, D8), The Lion's Share (the
// young Rider at Akordu, who is at the hunters' fire on B8 once the company will hunt with him, and the
// eldest), Orders on the Scarp Stair (Hendra, the Compact's factor at Cinderport, her runner on C8's top
// flight and the eldest at Akordu) and The Garden of Glass (the mother among the figures at Akordu, and
// the priest at Cinderport's Harbour Temple). Then the Ranger's third prestige's quest (#448), its
// trainer's `asks`, paying nothing but the prestige: Oriel Fane's Map (Aysu, the scout on Kushtash, B8,
// and the map Fane gives at the last of the Meridian Company's camps, under Fire Mountain, taken from the
// pack). How the words are keyed is in src/content/area.ts (`quests`); tools/tests/quests.ts checks every key.
import type { QuestDef } from '../../../game/quests.ts';
import { SCOUT_ASKED, MAP_GIVEN, LION_ASKED, LION_HUNT, LION_LEFT, LION_BLOW, LION_TOLD, LION_TAKEN, LION_DOWN } from './maps/wold_b8.ts';
import { HORSE_ASKED, HORSE_BROKEN, HORSE_CARRIED, HORSE_WHOLE, GARDEN_ASKED, GARDEN_CARRIED, GARDEN_BROUGHT, GARDEN_LIFTED, GARDEN_DRAUGHT } from './maps/wold_d8.ts';
import { ORDERS_ASKED, ORDERS_CARRIED, ORDERS_SEALED, ORDERS_TOLD, ORDERS_BURNED } from './maps/wold_c8.ts';

export const QUESTS: readonly QuestDef[] = [
  {
    // #56's 51, at 26: Cador Lusk asks, or the Rider with a hammer puts it to whoever comes by. Broken, the
    // Rider says what it did on the way home; taken whole, Cador takes it at any meeting, the first too.
    id: 'horse_back',
    title: 'The Horse That Came Back',
    start: [{ flag: HORSE_ASKED }, { flag: HORSE_CARRIED }],
    done: [{ flag: HORSE_BROKEN }, { flag: HORSE_WHOLE }],
    entries: [
      { id: 'cador', when: { flag: HORSE_ASKED }, text: 'At Cinderport Cador Lusk of the Cartographers wants what came back out of the Glass in a Rider\'s saddle, whole. The Riders will break it.' },
      { id: 'dunes', when: { seen: 'wold_d9:d9_horse' }, text: 'On the steppe a horse came in off the dunes alone, glass in its hooves, something very still in its saddle.' },
      { id: 'prints', when: { seen: 'wold_b9:b9_horse' }, text: 'At the Glass\'s edge its prints come up out of the dunes, deep, and go north.' },
      { id: 'broken', when: { flag: HORSE_BROKEN }, text: 'At Akordu the Rider with the hammer broke it with one blow. On the way home, he says, it turned its head at night to look back south-west.' },
      { id: 'carried', when: { flag: HORSE_CARRIED }, text: 'At Akordu we lifted it down from the saddle whole. It is cold, and it does not move.' },
      { id: 'whole', when: { flag: HORSE_WHOLE }, text: 'Cador Lusk has it on his plotting table, and the Guild\'s map has the Glass\'s edge.' },
    ],
    goals: [
      { when: { flag: HORSE_CARRIED }, text: 'Carry what sat the horse to Cador Lusk at the Chart House in Cinderport.', at: 'cinderport' },
      { when: { flag: HORSE_ASKED }, text: 'Find the horse that came back, tethered at Akordu, the Riders\' camp.', at: 'wold_d8' },
    ],
  },
  {
    // #56's 53, at 27: the young Rider asks at Akordu. Hunted with him, the Grey Lion brought down on his
    // ground and the boy's the last blow, told at the hunters' fire; let die, the eldest tells the rest of
    // her story. A lion killed before either is nobody's blow, and pays nothing.
    id: 'lions_share',
    title: 'The Lion\'s Share',
    start: { flag: LION_ASKED },
    done: [{ flag: LION_BLOW }, { flag: LION_TOLD }, { flag: LION_TAKEN }],
    entries: [
      { id: 'boy', when: { flag: LION_ASKED }, text: 'At Akordu a young Rider wants the last blow when the Riders hunt the Grey Lion. The eldest says let him die.' },
      { id: 'hunt', when: { flag: LION_HUNT }, text: 'We will hunt the Grey Lion with him. He has ridden out to the hunters\' fire under the rim.' },
      { id: 'blow', when: { flag: LION_BLOW }, text: 'We brought the Grey Lion down on his ground, and the boy gave him the last blow. He is a Rider.' },
      { id: 'left', when: { flag: LION_LEFT }, text: 'We told the boy to let the old lion die on his own ground.' },
      { id: 'rest', when: { flag: LION_TOLD }, text: 'For that, at her fire, the eldest told us the rest of her story.' },
      { id: 'taken', when: { flag: LION_TAKEN }, text: 'The Grey Lion is dead by our hands, and the boy\'s blow was never struck.' },
    ],
    goals: [
      { when: { flag: LION_LEFT }, text: 'Hear the rest of the eldest\'s story at her fire in Akordu.', at: 'wold_d8' },
      { when: { flag: LION_HUNT, slain: LION_DOWN }, text: 'Go back to the young Rider at the hunters\' fire.', at: 'wold_b8' },
      { when: { flag: LION_HUNT }, text: 'Bring the Grey Lion down on his ground between the mesas, and leave the last blow to the boy.', at: 'wold_b8' },
      { when: { flag: LION_ASKED }, text: 'Tell the young Rider at Akordu: hunt the Grey Lion with him, or let the old lion die.', at: 'wold_d8' },
    ],
  },
  {
    // #56's 54, at 27: Hendra asks; her runner on the top flight gives up the orders, which read from the
    // pack; the eldest has them sealed, hears what they say, or watches them burn, and the runner climbs again.
    id: 'scarp_orders',
    title: 'Orders on the Scarp Stair',
    start: { flag: ORDERS_ASKED },
    done: [{ flag: ORDERS_SEALED }, { flag: ORDERS_TOLD }, { flag: ORDERS_BURNED }],
    entries: [
      { id: 'factor', when: { flag: ORDERS_ASKED }, text: 'At Cinderport Hendra, the Compact\'s factor, wants her runner\'s orders carried up the Scarp stair to the Riders.' },
      { id: 'runner', when: { flag: ORDERS_CARRIED }, text: 'On the stair\'s top flight the runner gave us the orders, sealed in black wax, for the eldest at Akordu.' },
      { id: 'cleft', when: { seen: 'wold_c8:c8_cleft' }, text: 'In a cleft under the Scarp\'s lip lie three bundles under the same black wax, never taken.' },
      { id: 'sealed', when: { flag: ORDERS_SEALED }, text: 'We gave the eldest the orders sealed. She kept the silver, and burned the orders unread.' },
      { id: 'told', when: { flag: ORDERS_TOLD }, text: 'We told the eldest what the orders say. The Riders take nothing more from the Compact.' },
      { id: 'burned', when: { flag: ORDERS_BURNED }, text: 'We burned the orders in the eldest\'s fire, and nobody read them. The runner will climb again.' },
    ],
    goals: [
      { when: { flag: ORDERS_CARRIED }, text: 'Take the orders to the eldest at Akordu: give them sealed, tell her what they say, or burn them.', at: 'wold_d8' },
      { when: { flag: ORDERS_ASKED }, text: 'Find Hendra\'s runner on the Scarp stair, where it tops the lip.', at: 'wold_c8' },
    ],
  },
  {
    // #56's 55, at 28: the mother among the figures gives her son to be carried; the priest at the Harbour
    // Temple takes him in, and the stone is lifted at the temple's price or by a draught, and he wakes.
    id: 'glass_garden',
    title: 'The Garden of Glass',
    start: { flag: GARDEN_ASKED },
    done: [{ flag: GARDEN_LIFTED }, { flag: GARDEN_DRAUGHT }],
    entries: [
      { id: 'mother', when: { flag: GARDEN_ASKED }, text: 'At Akordu a woman sits among the figures of glass, her hand on her son\'s foot. He went to look at the basilisk.' },
      { id: 'mesas', when: { seen: 'wold_d10:d10_glassed' }, text: 'Under the great mesa others stand in glass where they looked up, and nobody carried them home.' },
      { id: 'carried', when: { flag: GARDEN_CARRIED }, text: 'She gave him to us to carry to the temple at Cinderport, where they lift stone.' },
      { id: 'temple', when: { flag: GARDEN_BROUGHT }, text: 'At the Harbour Temple the priest had him laid on the stone by the altar.' },
      { id: 'woke', when: [{ flag: GARDEN_LIFTED }, { flag: GARDEN_DRAUGHT }], text: 'The stone ran off him and he woke. From the mesa, he says, he saw a crown standing up in the Glass, and something moving on it.' },
    ],
    goals: [
      { when: { flag: GARDEN_BROUGHT }, text: 'Have the priest at the Harbour Temple lift the stone, or give the boy a draught.', at: 'cinderport' },
      { when: { flag: GARDEN_CARRIED }, text: 'Carry the boy of glass to the Harbour Temple at Cinderport. The Riders\' ride goes from Akordu.', at: 'cinderport' },
      { when: { flag: GARDEN_ASKED }, text: 'Tell the woman among the figures at Akordu that you will carry her son to the port.', at: 'wold_d8' },
    ],
  },
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
