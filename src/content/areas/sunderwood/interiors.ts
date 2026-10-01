// Sunderwood's businesses' painted rooms, all in Lantern Watch (#201), each drawn in
// src/ui/interiors/sunderwood/. Drawn ahead of the area's first map, so src/content/index.ts lists
// them in ROOMS_AHEAD until then; once the area is listed, its Area takes them as `interiors`.
export const INTERIORS = ['watch_hall', 'watch_refectory', 'watch_stores', 'priors_room'] as const;
