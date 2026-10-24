// The enclave's fixture the suites share (#984): the lair beside Saltreach and its guardian, which
// the enclave suite builds and holds, and the gate, curve, pillars, quests and pilot suites take.
import { MAP_DEFS } from '../../../src/content/index.ts';
import type { MapDef } from '../../../src/game/map.ts';

/** Where the fixture lair stands: beside Saltreach, a band-10 area, its door on C3 in the Upper Water (10-11). */
export const FIXTURE = { area: 'saltreach', zone: 'upperwater', box: 'upperwater_c3' } as const;

const STAIR = MAP_DEFS.find((d) => d.id === 'underdeep2')!;

/**
 * The fixture lair: an artifact lair at the cap, 30-32, off C3. Its ground and groups are the Stair's
 * (`underdeep2`), whose groups and Catcher the gate passes at 30, so it stands where a lair must; its
 * one way out leads up onto C3; and its one chest holds the Grey Axe at 6,800 gold, over Saltreach's
 * window and inside the cap's.
 */
export const LAIR: MapDef = {
  id: 'fx_lair', name: 'The Fixture Lair', kind: 'dungeon', band: [30, 32], enclave: true,
  rows: STAIR.rows, legend: STAIR.legend, start: { ...STAIR.start }, palette: STAIR.palette,
  exits: [{ x: 16, y: 31, to: FIXTURE.box, tx: 27, ty: 10, label: 'Up into the light.' }],
  encounters: STAIR.encounters,
  features: [{ kind: 'chest', x: 17, y: 26, id: 'fx_lair_chest', gold: 2000, items: ['grey_axe'] }],
};

/** The lair's guardian, as the gate names a boss: the Stair's Catcher, judged at the lair's own floor. */
export const GUARDIAN = `${LAIR.id}:ud2_catcher`;
