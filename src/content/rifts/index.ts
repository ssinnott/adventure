// The small Rifts: an area places one by naming a template, a material and a seed (game/rifts.ts),
// putting the map among its maps and the tear among its zone map's features:
//   const DELTA_RIFT = rift({ id: 'c5_rift', template: 'ring', material: 'brine', seed: 7, ... });
//   maps: [..., DELTA_RIFT.map]; features: [..., DELTA_RIFT.way(12, 9)]
// RIFT_SAMPLES are the eight templates dressed once each, for the tests and the contact sheet; no
// area places them, so they are in no save.
import { generateRift, riftWay } from '../../game/rifts.ts';
import type { RiftSpec, RiftTemplate, RiftMaterial } from '../../game/rifts.ts';
import type { MapDef, Feature } from '../../game/map.ts';
import { TEMPLATES } from './templates.ts';
import { MATERIALS } from './materials.ts';

export { TEMPLATES, MATERIALS };

export interface Rift {
  map: MapDef;
  /** The tear on the zone map at x,y that leads in, saying the material's words for it. */
  way: (x: number, y: number) => Extract<Feature, { kind: 'rift' }>;
}

/** A Rift from a template and a material named by id. */
export function rift(spec: Omit<RiftSpec, 'template' | 'material'> & { template: string; material: string }): Rift {
  const template: RiftTemplate | undefined = TEMPLATES.find((t) => t.id === spec.template);
  const material: RiftMaterial | undefined = MATERIALS.find((m) => m.id === spec.material);
  if (!template) throw new Error(`rift ${spec.id}: no template '${spec.template}'`);
  if (!material) throw new Error(`rift ${spec.id}: no material '${spec.material}'`);
  const map = generateRift({ ...spec, template, material });
  return { map, way: (x, y) => riftWay(map, x, y, material.enter) };
}

/**
 * Each template dressed once, the materials in turn, out onto the cellar's farmyard: the Rift's
 * own small things, a warden whose fall closes it, and a hoard.
 */
export const RIFT_SAMPLES: readonly MapDef[] = TEMPLATES.map((t, i) => {
  const id = `rift_${t.id}`;
  return rift({
    id, template: t.id, material: MATERIALS[i % MATERIALS.length].id, seed: i + 1, band: [6, 9],
    out: { to: 'downs_e3', tx: 21, ty: 4 },
    table: { groups: [['riftling', 'riftling', 'rift_crawler'], ['rift_crawler', 'rift_crawler', 'rift_crawler'], ['riftling', 'riftling']], warden: ['riftling_elder', 'riftling', 'riftling'] },
    hoard: { gold: 60, items: ['potion_heal'] },
    until: { slain: `${id}:${id}_warden` },
  }).map;
});
