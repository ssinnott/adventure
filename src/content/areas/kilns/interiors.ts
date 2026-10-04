// The Kilns' businesses' painted rooms, Anvilhall's six (#459) and Kilnhaven's six (#469), each
// drawn in src/ui/interiors/kilns/ (#473). Drawn ahead of the area's first map, so
// src/content/index.ts lists them in ROOMS_AHEAD until then; once the area is listed, its Area
// takes them as `interiors`.
export const INTERIORS = [
  'anvilhall_great_hall', 'anvilhall_forge', 'anvilhall_training_hall', 'anvilhall_inn', 'anvilhall_surgeon', 'anvilhall_stores',
  'kilnhaven_inn', 'kilnhaven_smith', 'kilnhaven_training_hall', 'kilnhaven_harbourmaster', 'kilnhaven_chapel', 'kilnhaven_chandlery',
] as const;
