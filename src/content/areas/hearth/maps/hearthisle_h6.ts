// Hearth Isle, box H6: the isle, the first map of Act V. Core, band 28-29: the strand on the south
// shore, where the last crossing's boat grounds and its man sits in the stern; the cleft carved one
// square wide up through the rim's rock from the strand to the Bowl's hills, worn by the pilgrims'
// feet; the Bowl inside the rim, green and warm, with the pilgrims' camp in the lee of the rim on its
// west side, its fires, its three tents round a yard and the three pilgrims of 57; the temple's mound
// in the Bowl's north, Hearthfane's door in its south face; and east of it, on the grass, the Hearth
// itself, the column's foot. The cache under the north rim, found from the draught at its foot. The
// grass shelf up the west coast outside the rim to the lookout; the coast north of it and the north-west
// hills, reached by no way on foot, are the rim's rock to the shallows, as is the grass in the north
// rim's corner on row 0. The Hand's pickets up the cleft and at its head, its preacher before the
// temple's door, its champions on the west shelf, the moths by night and the rats come up from below.
// Cut from the atlas by tools/scaffold.ts; docs/areas/hearth_isle.md §4.2 is its brief (#753).
import type { MapDef } from '../../../../game/map.ts';
import type { QuestCond } from '../../../../game/quests.ts';
import { NORTH } from '../../../../game/types.ts';
import { LAST_CROSSING, sells } from '../../../crossings.ts';
import { COMPACT_OVER, COMPACT_WARDENS } from '../../saltreach/maps/saltmouth.ts';
import { THRONE_COUSIN, THRONE_HOLD, THRONE_TALLIS } from '../../shelf/maps/keep.ts';

/** The once-event at the boat's grounding, the cleft's foot: the chapter's first step (§5). */
export const STRAND = 'hearthisle_h6:h6_strand';
/** Met any of the three pilgrims (57): not Rimewater's `q_pilgrims`, the pilgrims in the pass (44). */
export const PILGRIMS = 'q_bowl_pilgrims';
/** The pilgrims' tokens, each carried down for its claimant (57): a piece at the Council, and the fallback for the Stair and the core. */
export const TOKEN_COUSIN = 'q_token_cousin', TOKEN_HOLD = 'q_token_hold', TOKEN_TALLIS = 'q_token_tallis';
/** Whoever holds the Stair's first landing: the Council's verdict for a claimant, or a pilgrim's token (§4.1). */
export const HELD: readonly QuestCond[] = [THRONE_COUSIN, THRONE_HOLD, THRONE_TALLIS, TOKEN_COUSIN, TOKEN_HOLD, TOKEN_TALLIS].map((flag) => ({ flag }));

const many = (n: number, id: string): string[] => Array.from({ length: n }, () => id);

export const HEARTHISLE_H6: MapDef = {
  id: 'hearthisle_h6',
  name: 'Hearth Isle',
  kind: 'outdoor',
  density: 'core',
  band: [28, 29],
  region: 'hearth',
  // Put down by the boat on the strand at the cleft's foot.
  start: { x: 20, y: 30, facing: NORTH },
  rows: [
    'WWWWWWWWWW~~~~~rrrrrrrrrrrrrrrrr',
    'WWWWWWWWW~~~rrrrrrrrrrrrrrrrrrrr',
    'WWWWWWWW~~rrrrrrrrrrrrrrrrrrrrrr',
    'WWWWWWW~~rrrrrrrrrrrrrrrrrrrrrrr',
    'WWWWWWW~~rrrrrrrrrrrrrrrrrrrrrrr',
    'WWWWWW~~rrrrrrrrrrrrrrrrrr:rrrrr',
    'WWWWW~~rrrrrrrrrrrrrrrrrrr:rrrrr',
    'WWWWW~~~rrrrrrrrrrr,^,,,,rSrrrrr',
    'WWWW~~~rrrrrrrrrr^^^^^,,,,,,rrrr',
    'WWWW~~~rrrrrrrr^^^^^^^^^,,,,,rrr',
    'WWWW~~~rrrrrrrr^^^^^^^^^,,,,,rrr',
    'WWW~~~rrrrrrrr,^^^^^^^^^,,,,,,,r',
    'WWW~~~rrrrrrr,,^^^^^,,^^,,,,,,,,',
    'WWW~~~rrrrrrr,,,,^^,,,,,,,,,,,,,',
    'WWW~~~rrrrrrr,,,B,D,,,,,,,,,,,,,',
    'WW~~~rrrrrrr,,,BDB,,,,,,,,,,,,,,',
    'WWW~~rrrrrrrr,,D,D,,,,,,,,,,,,,,',
    'WWW~~rrrrrrrr,,,,,,,,,,,,,,,,,,,',
    'WWW~~rrrrrrrr,,,,,,,,,,^,,,,,,,,',
    'WWWW~~rrrrrrrr,,,,,,,,,^^,,,,,,,',
    'WWWW~~rrrrrrrrr,,,,,,,,^^,,,,,,,',
    'WWWW~~rrrrrrrrr,,,,,,,^^^^,,,,rr',
    'WWWWW~~,rrrrrrrrrr,,,^^^^^^rrrrr',
    'WWWWW~~,,rrrrrrrrrrr^^^^^^rrrrrr',
    'WWWWWW~~_,rrrrrrrrrr:rrrrrrrrrrr',
    'WWWWWWW~~_,,rrrrrrrr:rrrrrrrrrrr',
    'WWWWWWWW~~_,,rrrrrrr:rrrrrrrrrrr',
    'WWWWWWWWW~~_,,rrrrrr:rrrrrrrrrrr',
    'WWWWWWWWWW~~_,,,rrrr:rrrrrrrrrrr',
    'WWWWWWWWWWW~~~~,,,,r:rrrrrrr,,,,',
    'WWWWWWWWWWWW~~~,,,,,,,,,,,,,____',
    'WWWWWWWWWWWWWW~~~~~,,,,,,,__~~~~',
  ],
  exits: [
    // Hearthfane's door in the mound's south face (#755): in at the nave's foot, facing up it.
    { x: 18, y: 14, to: 'hearthfane', tx: 8, ty: 14, tf: NORTH, label: 'In at the temple\'s door, out of the light.' },
  ],
  features: [
    // The strand, where the last crossing grounds at 20,30 (LAST_CROSSING): its man in the stern, who
    // sells it back; the light seen close at the cleft's foot, the chapter's first step; and the hum.
    { kind: 'npc', x: 21, y: 30, name: 'The boatman', lines: [
      'A man sits in the grounded boat\'s stern with the oars shipped, looking at the light and not at you.',
      '"I row over, I row back. I do not go up. Nobody who goes up has ever asked me to wait, and I wait anyway."',
    ], passage: sells('hearthisle', LAST_CROSSING) },
    { kind: 'event', x: 20, y: 29, id: 'h6_strand', once: true, text: 'Up close the Hearth is no fire. A column of light stands out of the isle into the roof of the sky, and it hums in your teeth.' },
    { kind: 'event', x: 19, y: 30, id: 'h6_shard', once: true, text: 'The hum. It is the hum of the carved lump by the tear under Ashcombe, at the very beginning, and it has not stopped since.' },
    // The Compact as the company left it (§6): its runner for a Partner, with the one spy's word toward
    // the Hand's takings on I6; or, the Compact handed to the Wardens, a Warden sergeant instead.
    { kind: 'npc', x: 23, y: 30, name: 'A Compact runner', after: { flag: COMPACT_OVER }, lines: [
      '"Partner. The boat is yours, both ways, for as long as you need it. The Compact\'s orders come from you now, and the first one was that."',
      '"A word from the boats, since words are ours now: the Hand counted everything it took off the road, and none of it went home. Ask the rock behind its tally-house."',
    ] },
    { kind: 'npc', x: 23, y: 30, name: 'A Warden sergeant', after: { flag: COMPACT_WARDENS }, lines: [
      '"The sea lanes are the Wardens\' now, and the Hand\'s boats have stopped coming over. We counted eleven of theirs on the way. We\'ll count yours back."',
    ] },
    // The cleft, the one way up through the rim: its mouth, and its head at the Bowl's edge.
    { kind: 'event', x: 20, y: 27, id: 'h6_cleft', once: true, text: 'A path worn into the rim\'s rock, one person wide, by four hundred years of feet. Shoes stand at its foot in pairs, left for the walk up.' },
    { kind: 'event', x: 20, y: 22, id: 'h6_bowl', once: true, text: 'The Bowl: a green cup inside the rim, and the column standing out of its north end. The grass is warm.' },
    // In the cleft's head, the Hand's picket's chest: the knife it was issued.
    { kind: 'chest', x: 21, y: 22, id: 'h6_picket_chest', gold: 300, items: ['grey_knife'] },
    // The pilgrims' camp, the isle's rest (§9, call 4): its fires, its three tents round a yard, each a
    // business with a room of its own (#762), and the pilgrims' shrine at the yard's east side.
    { kind: 'camp', x: 16, y: 17, name: 'The pilgrims\' camp', text: 'The pilgrims\' fires in the lee of the rim, banked low. Nobody here has slept since the Hand landed, and they make room without a word.' },
    { kind: 'shop', x: 15, y: 16, name: 'The Pilgrims\' Store', stock: ['rations', 'torch', 'lantern_oil', 'potion_heal', 'antidote', 'elixir', 'potion_sp', 'potion_sp_great', 'quickening'], interior: 'bowl_store' },
    // Sergeant Aelfric's, who trains from it: one man, not two. The ceiling is the cap.
    { kind: 'trainer', x: 17, y: 16, name: 'The Sergeant\'s Tent', maxLevel: 32, interior: 'bowl_yard' },
    { kind: 'temple', x: 16, y: 15, name: 'The Lantern\'s Tent', interior: 'bowl_lantern' },
    { kind: 'shrine', x: 18, y: 16, id: 'h6_shrine', name: 'The pilgrims\' shrine', text: 'A cairn of offerings under a cloth: cups, knots of rope, a child\'s shoe. Whoever kneels here feels the hum settle in the chest.', stat: 'personality', done: 'The cloth is where you left it. The hum is in you now.' },
    // The three pilgrims of 57, one of each claimant's, each with a token to carry down; one taken, the
    // other two keep theirs and are gone. Any of them met begins the quest.
    { kind: 'npc', x: 14, y: 17, name: 'Sergeant Aelfric', flag: PILGRIMS, until: [{ flag: TOKEN_HOLD }, { flag: TOKEN_TALLIS }], lines: [
      'A Warden in the old grey with the old badge, his sword across his knees, sitting the way Ordgar sits.',
      '"Sergeant Aelfric, of the Drillyard. The captains sent me over with a pilgrim\'s staff and no orders but one: see what the Regent does on the isle, and come back and say it." He looks at the temple. "I\'ve seen. I can\'t get back."',
      '"They went down under the temple by a door that opened for them from below. It is open still, they say. Take this down with you." He holds out the old badge. "If the cousin\'s people are to stand anywhere in this, let it be at the bottom."',
    ], choice: { ask: 'Take the Wardens\' badge down?', answers: [
      { label: 'Take it.', sets: TOKEN_COUSIN, gives: 'wardens_badge', says: ['He pins it to your sleeve himself, and his hands are steady.', '"Then we are behind you. Mind the stair."'] },
      { label: 'Not ours to carry.', says: ['"No. Fair." He puts the badge away. "I\'ll keep watching the door."'] },
    ] }, says: [{ after: { flag: TOKEN_COUSIN }, lines: ['Aelfric is at the camp\'s edge, looking at the temple\'s door.', '"The badge. Keep it on your sleeve where they can see it."'] }] },
    { kind: 'npc', x: 18, y: 18, name: 'Talwyn', flag: PILGRIMS, until: [{ flag: TOKEN_COUSIN }, { flag: TOKEN_TALLIS }], lines: [
      'An elf in Thornhold green gone grey with the isle\'s dust, a seal on a cord at her throat: the treaty\'s mark, the one on the chisel.',
      '"Talwyn, of Henlys. The hold sent me to see the Hearth with the eldest\'s seal, and say to it what the treaty says: that the lines were one." A small laugh. "It did not answer. Then the grey men came, and went in under it, and now there is nobody to say it to but you."',
      '"Carry the seal down. Whatever is at the bottom, let it see the elves\' mark."',
    ], choice: { ask: 'Take the hold\'s seal down?', answers: [
      { label: 'Take it.', sets: TOKEN_HOLD, gives: 'treaty_seal', says: ['She lifts the cord over her head and puts it over yours.', '"Say it for us, at the bottom. The lines were one."'] },
      { label: 'Not ours to carry.', says: ['"Then I will say it to the column until it answers." She turns back to the light.'] },
    ] }, says: [{ after: { flag: TOKEN_HOLD }, lines: ['Talwyn sits facing the column with her hands in her lap.', '"The seal. Let the door see it."'] }] },
    { kind: 'npc', x: 14, y: 19, name: 'Pasco', flag: PILGRIMS, until: [{ flag: TOKEN_COUSIN }, { flag: TOKEN_HOLD }], lines: [
      'A man in a good coat gone to rags, a tally-stick in his hand notched to the top. He counts you before he speaks.',
      '"Pasco. I count for Tallis. He sent me over on the last honest boat to count what the Regent takes off this isle, and the answer so far is everything, and the boat went back without me."',
      '"Here." The tally-stick. "Tallis\'s mark is on the butt. Whoever comes up out of that hole with it is Tallis\'s, in the Council\'s eyes and in his, and he pays for what he counts."',
    ], choice: { ask: 'Take Tallis\'s tally down?', answers: [
      { label: 'Take it.', sets: TOKEN_TALLIS, gives: 'tallis_tally', says: ['He notches it once more, for you, and hands it over.', '"He remembers what he pays for. He\'ll remember this."'] },
      { label: 'Not ours to carry.', says: ['"Suit yourselves. He pays either way, and he\'ll know who didn\'t."'] },
    ] }, says: [{ after: { flag: TOKEN_TALLIS }, lines: ['Pasco is counting the moths over the Bowl, and losing count.', '"Keep the stick dry."'] }] },
    // Hearthfane's door in the mound's south face, 18,14, the way into its nave (#755). Before it, the
    // temple seen.
    { kind: 'event', x: 18, y: 15, id: 'h6_front', once: true, text: 'A temple of the rim\'s own rock, built round the column\'s foot. Its door stands open, and the Hand\'s grey is on the men at it.' },
    // The Hearth on the Bowl's grass east of the mound: the column's foot, the warm ground between, and
    // the Grove's sliver humming again for a company that carries it (#56's 18).
    { kind: 'sign', x: 24, y: 16, text: 'The column of light. It stands out of the ground here as a tree stands, wider than the temple\'s door, and goes up until the sky stops it. Looking up at it hurts.' },
    { kind: 'event', x: 23, y: 14, id: 'h6_warm', once: true, text: 'The ground here is warm as a hearthstone.' },
    { kind: 'event', x: 23, y: 16, id: 'h6_sliver', once: true, after: { item: 'grove_sliver' }, text: 'The sliver from the Grove hums in your pack, the way it did under the roots.' },
    // The rim's lookouts: the west edge at the shelf's head, and the mound's head under the north face.
    { kind: 'event', x: 7, y: 22, id: 'h6_lookout', once: true, text: 'The rim\'s west edge. Over the Sound, under its smoke, Cinderport, and the mountain over it. The whole road is behind you.' },
    { kind: 'event', x: 20, y: 7, id: 'h6_north', once: true, text: 'The rim\'s highest rock. Cut into it, worn almost smooth, a mark like the one on the chisel from under the Grove. The first people stood here.' },
    { kind: 'event', x: 22, y: 19, id: 'h6_moths', once: true, when: { hours: 'night' }, text: 'The sky over the Bowl is moving. Moths, more than the stars, drawn in to the biggest lamp there is.' },
    // The secret: the draught at the north rim's foot, the rock at 26,7 that opens on a search, and the
    // cache in the hollow behind it, carved: the old lamp seen, and the salts and the gold taken.
    { kind: 'event', x: 26, y: 8, id: 'h6_draught', once: true, text: 'A draught comes out of the rock here, warm, and smelling of oil.' },
    { kind: 'event', x: 26, y: 6, id: 'h6_cache', once: true, text: 'A hollow the size of a cupboard, and in it a lamp of grey metal that burns without oil, four hundred years lit.' },
    { kind: 'chest', x: 26, y: 5, id: 'h6_lamp', gold: 400, items: ['smelling_salts', 'smelling_salts', 'smelling_salts'] },
  ],
  secrets: [{ x: 26, y: 7, hint: 'h6_draught' }],
  encounters: [
    // The band's gentlest first, by the strand, the moths by night; the Hand's pickets up the cleft and
    // at its head; the preacher's group before the temple's door, the box's hardest, never roaming; the
    // champions on the west shelf; the moths over the Bowl's north by night; and the rats come up from
    // below in the Bowl's south-east. Nothing by the camp. None thins here.
    { id: 'h6_moths1', x: 18, y: 30, monsters: many(12, 'hearth_moth'), aware: 3, respawn: 1440, when: { hours: 'night' } },
    { id: 'h6_picket1', x: 20, y: 25, monsters: many(2, 'ashen_champion'), aware: 2, roams: false, respawn: 2880 },
    { id: 'h6_picket2', x: 20, y: 22, monsters: many(3, 'ashen_champion'), aware: 3, respawn: 2880 },
    { id: 'h6_moths2', x: 26, y: 12, monsters: many(12, 'hearth_moth'), aware: 3, respawn: 1440, when: { hours: 'night' } },
    { id: 'h6_sermon', x: 19, y: 13, monsters: [...many(2, 'ashen_champion'), 'ashen_preacher'], back: 1, aware: 3, roams: false, respawn: 2880 },
    { id: 'h6_rim', x: 9, y: 24, monsters: many(2, 'ashen_champion'), aware: 4, roams: true, respawn: 2880 },
    { id: 'h6_rats', x: 28, y: 21, monsters: many(8, 'deep_rat'), aware: 3, respawn: 1440 },
  ],
};
