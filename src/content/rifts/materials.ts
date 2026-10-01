// The Stones' materials a Rift is dressed in (MONSTERS §2.1): ember at the cellar and the Grove,
// brine at the Tide Stone, black glass in Sunderwood, slag at the Anvil. Cairnmoor's ring has no
// body left to tear, so no Rift wears it, and none comes after it.
import type { RiftMaterial } from '../../game/rifts.ts';

export const EMBER: RiftMaterial = {
  id: 'ember', name: 'The Ember Rift',
  palette: { wall: '#8a5a44', wallDark: '#5a3426', floor: '#4a3028', ceiling: '#3a2018', door: '#6a4a3a', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#c05a3a' },
  enter: 'Heat, and an orange light with no lamp to make it.',
  leave: 'Cold air. The orange goes out of your eyes slowly.',
  tear: 'The tear. Ember-light breathes up out of the floor. A shard beside it, warm in the hand, humming.',
  quiet: 'The tear is a dark seam, and cold. The crystal on the walls has gone the grey of ash.',
  looks: [
    'Crystal grows from the wall in rows too even to be grown.',
    'The floor is warm underfoot, and the warmth has edges.',
    'Orange light with no flame behind it. Your shadow falls the wrong way.',
    'A smell of hot stone and something sharper. Breath comes dry.',
    'Somewhere a slow tick, like a cooling hearth, but it never stops.',
    'An ember the size of a fist on the floor. It is cold to touch.',
  ],
};

export const BRINE: RiftMaterial = {
  id: 'brine', name: 'The Brine Rift',
  palette: { wall: '#4a8a7a', wallDark: '#2a5a50', floor: '#2e4a46', ceiling: '#1e3434', door: '#3a5a50', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#3aa08a' },
  enter: 'Wet air, and a green light that moves like water.',
  leave: 'Open air. Your boots are dry, and should not be.',
  tear: 'The tear. Brine glass round it like a frozen wave. A shard beside it, wet, humming in the teeth.',
  quiet: 'The green has gone out of the glass. The tear is a crack, and nothing comes up but salt.',
  looks: [
    'The walls are glass with brine inside, and the brine moves.',
    'A tide line runs along the wall at the height of a man, dead level.',
    'Green light from the walls. It flickers like sun through water.',
    'Salt in the air so thick it sits on the tongue.',
    'A sound of surf, close, in a room with no sea in it.',
    'A fish on the floor, glass to the bone, still wet.',
  ],
};

export const GLASS: RiftMaterial = {
  id: 'glass', name: 'The Glass Rift',
  palette: { wall: '#2e2c36', wallDark: '#18161e', floor: '#3a3a42', ceiling: '#121016', door: '#4a4440', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#e0e0ea' },
  enter: 'Dead wood, black glass, and a white light inside it.',
  leave: 'Daylight. It takes a while to seem bright enough.',
  tear: 'The tear. White light inside black glass, as if from behind it. A shard beside it, cold, humming.',
  quiet: 'The white has gone. The glass is only black, the wood only dead. The tear is a line on the floor.',
  looks: [
    'Black glass walls, and under the black a white light that does not warm.',
    'Dead trees stand in the floor, roots in the glass. The bark has gone to glass.',
    'The light here throws no shadow at all.',
    'The air is still and tastes of nothing. Not dust, not damp. Nothing.',
    'No sound but your own. Even that comes back wrong, a half beat late.',
    'A leaf on the floor, black glass, every vein in it. It is heavy as a coin.',
  ],
};

export const SLAG: RiftMaterial = {
  id: 'slag', name: 'The Slag Rift',
  palette: { wall: '#5a4a46', wallDark: '#3a2a26', floor: '#3a2e2a', ceiling: '#241a18', door: '#4a3a34', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#c0402a' },
  enter: 'Hot iron and a red light low in the walls.',
  leave: 'Clean air. The forge smell stays in your clothes.',
  tear: 'The tear. Slag set round it in ridges, red at the cracks. A shard beside it, hot, humming.',
  quiet: 'The slag is black and the iron is cold. The tear is a seam you could step over without looking.',
  looks: [
    'The walls are slag, run and set, but set in squares.',
    'The floor is iron, and rings underfoot the same note in every room.',
    'Red light from cracks in the slag, the colour of a forge banked for the night.',
    'The air is hot and dry and tastes of the smithy.',
    'A hammering somewhere, slow, that keeps time too well.',
    'A chain on the floor, each link the same, no join in any of them.',
  ],
};

export const MATERIALS: readonly RiftMaterial[] = [EMBER, BRINE, GLASS, SLAG];
