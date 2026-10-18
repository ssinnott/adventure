// Hearth Isle's businesses' painted rooms, the pilgrims' camp's three tents in the Bowl (H6, #753),
// each drawn in src/ui/interiors/hearth/ (#762). Drawn ahead of the area's first map, so
// src/content/index.ts listed them in ROOMS_AHEAD until H6 listed the area (#753); its Area takes
// them as `interiors`.
export const INTERIORS = ['bowl_store', 'bowl_yard', 'bowl_lantern'] as const;
