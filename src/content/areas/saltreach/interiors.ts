// Saltreach's businesses' painted rooms, all in Saltmouth (#185), each drawn in
// src/ui/interiors/saltreach/. Drawn ahead of the area's first map, so src/content/index.ts lists
// them in ROOMS_AHEAD until then; once the area is listed, its Area takes them as `interiors`.
export const INTERIORS = ['training_loft'] as const;
